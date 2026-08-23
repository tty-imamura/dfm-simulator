// 第179便 exp-coreshell9.mjs — コア外殻第9実験(🐚 残差の構造対処: t=0+ 解析値 vs 窓平均引きずり)
// ============================================================================================
// 位置づけ: 第135便 tests/exp-coreshell.mjs → 第139便 exp-coreshell2 → 第152便 exp-coreshell3 →
//   第154便 exp-coreshell4 → 第155便 exp-coreshell-theory(解析専用)→ 第158便 exp-coreshell5 →
//   第163便 exp-coreshell6 → 第168便 exp-coreshell7 → 第174便 exp-coreshell8 の続き。
//
// 第174便(coreshell8)は 🐚 の平均場2項振幅 (A_b, A_c) を q 4点 {1.25,1.5,1.75,2.0} の最小二乗で
//   解き直し、精細アンカー(coreshell7 env×1 実測 q₅₀=1.6575)による 2項複合予測 1.489072… を
//   coreshell7 env×2 実測 1.5300 と突き合わせて |差| 0.040928(FW1 PASS・0.05 も通過)を得た。
//   その申し送りは limits.tZeroAnalytic:
//     「予測に使う Ω̄_drag は **1步後(t=0+)の解析値**である。🐚 は窓の間にクランプが合体・回転して
//      自走する系なので、窓平均の引きずりは t=0+ の値と同じではない(第155便 postHoc ②)。
//      本便はこの限界を承知のうえで、t=0+ の解析値による予測をそのまま照合に掛ける」
//   であり、第174便の申し送りが名指しした残りのレバーは **時間軸**である。あわせて第174便は
//   「予測は系統的に低い(実測 − 予測 = +0.0409 > 0)」「4点適合の残差は大 q 側で単調一方向」を
//   収載した。本便(第179便)はこの一点だけを詰める:
//     ① 採点窓と同一の走行(3000步・seed 20260804・kFrame=1・dt=0.016)の**最中**に、プローブと
//        同一式の解析的 Ω_drag を **時間分解**で記録する(t=0+ と 50步ごと)。
//     ② その **窓平均 Ω̄̄_drag** から4点最小二乗で振幅を解き直す(核は第158便収載値に固定)。
//     ③ 精細アンカー(coreshell7 env×1 実測 1.6575)+窓平均振幅で env×2 を 2項複合再予測し、
//        実測 1.5300 と突き合わせる。
//   **新規の q₅₀ 掃引は行わない**(q₅₀ は coreshell7 の実測値の機械読取)。
//
// ★★ 正直な位置づけの事前宣言(実測前・読み違えを防ぐため最初に書く)★★
//   **本便に hold-out(前向きに伏せられた実測値)は存在しない。** 照合先の q₅₀(env×1 1.6575・
//   env×2 1.5300)も、比較相手の残差 0.040928 も、第158便の核も、第174便の t=0+ 振幅も、すべて
//   既に確定した既知量である。本便が新しく測るのは **3000步走行中の Ω_drag の時間分解記録**と、
//   そこから解ける窓平均振幅、およびその振幅で立つ予測だけである。
//   したがって **GW2 の PASS は「未知を当てた」証拠ではない**。GW2 が実際に問うているのは
//   **「t=0+ を窓平均へ置き換えたとき、第174便の残差 0.040928 が説明できるか」**であり、
//   その読み方は結果に依らず変えない。**GW2 が FAIL でも収載する** — FAIL は
//   「残差 ~0.04 は t=0+ vs 窓平均の系統では説明できない」という決定的情報であり、
//   (T5′) の3項化など次の一手を指す価値がある(統括の事前登録に明記されている)。
//   実装担当が封①より前に目にしたのは、配線確認の煙試験で出た env×1 q=1.5 の t=0+ 平均
//   (= 第158便収載値と bit 一致することの確認)と、同アームの step=3000 の平均のみである。
//   **窓平均・振幅解・予測値・GW2 の残差は封①より前に一切計算していない。**
//   この開示は封①のブロックに含まれ、正準化 SHA-256 で固定される。
//
// ★ アーム(8本 = env×{1,2} × q∈{1.25,1.5,1.75,2.0}。いずれも 🐚kF1kRep実)★
//   env×1  エンベロープ ring 既定半径(rIn/rOut ×1)・keepR=300 … **アンカー構成**(予測は恒等)
//   env×2  エンベロープ ring 半径 ×2(rIn/rOut ×2)・keepR=600 … GW2 の判定対象
//
// ============================ 事前登録(実測前に固定 — 逐語)===================================
//   GW1(記述): 時間プロファイル(q 別・env 別)と t0/窓平均比。乖離の符号が「予測が低い」方向と
//     整合するかも記録。
//   **GW2(主窓): 窓平均補正予測の |q₅₀_pred − 1.5300| ≤ 0.05 かつ 第174便の 0.0409 より改善**
//     (両条件を満たして PASS。未達は FAIL のまま収載 — 「t=0+ 系統では説明できない」という
//     決定的情報として価値がある)。
//   GW3(決定性): 別プロセス2回の正準化 SHA 一致。
//   転記照合: t=0+ プローブ値と2点/4点振幅が第158/174便収載値とビット一致(同条件再現)。
//   併記(記述): 逆向きアンカー・旧 t=0+ 予測との差の分解(振幅変化分 vs Ω_crit 変化分)。
//   **実測後に窓・記録格子・平均の定義・解法・採点定義を動かさない。PASS/FAIL とも収載する。**
//
// ============================ 予測式(第155便→…→第174便からの逐語転記)========================
//   (T1) Ω_drag(r; q₅₀) = Ω_crit                     … 保持喪失の条件式(Ω_drag は q に単調減少)
//   (T5′) 🐚 の平均場2項  Ω̄_drag(q) = A_b·x_b^q + A_c·x_c^q,  x_b = R̄/(R̄+r̄),  x_c = Rc/(Rc+r̄)
//   予測 = 「Ω̄_drag_var(q₅₀') = Ω̄_drag_ref(q₅₀_ref)」の数値解(**決定論的二分法**・区間 [0.05,8.0]・
//        反復 200 回固定)。アンカー q₅₀_ref は **coreshell7 の env×1 実測 q₅₀ ただ1つ**で、
//        未知の Ω_crit を代数的に消去するための代入である(較正自由度ではない — classification.fit は空)。
//   **本便が動かすレバーは Ω̄_drag の時間軸だけである。**
//        (T5′) の関数形・核 x_b/x_c・4点最小二乗の閉形式・二分法ソルバ・アンカー・照合先は
//        第174便から 1 bit も変えない。変えるのは「振幅を解く入力が t=0+ の1点値か、
//        採点窓を通した時間平均か」の一点だけである。核まで動かすと効果が混ざるので固定する。
//        窓平均の r̄・R̄ から核を取り直した版は **併記(記述・判定外)**として収載する。
//
//   ---- 窓平均の定義(実測前に宣言・完全決定論)------------------------------------------------
//   Ω̄_drag(step) = その時刻のエンベロープ帯 [NC, S.n) のうち r>1e-6 かつ hasU の粒子について
//     解析的 Ω_drag(第154/158/163/168/174便 nebDragProbe と同一式)の **単純平均**。
//   記録格子: step ∈ {1} ∪ {50,100,…,3000}(t=0+ の1点 + 一様 50步刻みの 60点)。
//   **窓平均(GW2 が使う主定義)**: 一様格子 {50,100,…,3000} の 60 点にわたる **等重み算術平均**。
//     step=1 は「一様格子ではない t=0+ アンカー点」なので主定義から外し、第174便との bit 照合
//     専用に別記する(この選択は実測前に固定し、結果を見てから変えない)。
//   併記の代替定義(記述・判定外): t=0+ を含めた 61 点平均 / 台形則 / 保持粒子のみ(r<keepR)の
//     空間平均による窓平均 / 前半・後半平均 / 標本中央値。
//
// 走行規約(第154/158/163/168/174便の 🐚 走行の踏襲 — 1 bit も変えない):
//   🐚nebulaShell: seed 20260804(プリセット定義値)・dt=0.016・3000步(validT=48)。
//   時間分解走行: kFrame=1・q・envScale を上書きして build し、S.step(0.016) を 3000 回呼ぶ間に
//     記録格子の時刻で解析的 Ω_drag を読む(**読み取りのみ・力学には一切干渉しない**)。
//     すなわち軌道は coreshell7 の採点走行と bit 同一である(checks.sameRunAsScoring が機械確認)。
//   t=0+ プローブ: 第174便と同一の nebDragProbe(kFrame=1 で build して1步だけ進め解析値を読む)。
//   対照: kFrame=0 × kRep=0 の 3000步走行(第168/174便と同一 — 記述・判定外)。
//   数値の創作は一切しない — 本 JSON/報告の数値はすべて本スクリプトの出力である。
//
// トイ単位の限界(第135便〜第174便の宣言を踏襲):
//   本シミュレータの G・質量・長さ・時間は**トイ単位**であり実世界の物理単位ではない。q は無次元の
//   指数なので単位系に依らないが、R̄・Rc・r̄ の絶対値は当該サンプルの単位系に閉じた値である。
//
// 実行:
//   node tests/exp-coreshell9.mjs                        … 全節(既定)
//   CS9_ONLY=probe,series,ctl node tests/...             … 節を選択実行
//   CS9_OUT=/path/x.json node tests/...                  … 出力先の変更(決定性の2回実行比較に使う)
//   CS9_DET_REF=/path/run1.json [CS9_DET_WAIT_SEC=1800]  … 2回目実行で1回目の JSON と SHA 照合
//   CS9_QUICK=1 …………………………………………………………… 步数 1/10 の煙試験(配線確認専用)
//   QA_TARGET=index.html node tests/...                  … 対象 HTML の変更(既定 beta/index.html)
// 出力: tests/out/coreshell9-results.json
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
const OUT_PATH = process.env.CS9_OUT ? path.resolve(process.env.CS9_OUT)
  : path.join(OUT_DIR, 'coreshell9-results.json');

const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

async function launch() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  const { chromium } = await import('playwright-core');
  return chromium.launch({ executablePath: exe });
}

const QUICK = !!process.env.CS9_QUICK;
const SC = (n) => (QUICK ? Math.max(60, Math.round(n / 10)) : n);
const ONLY = (process.env.CS9_ONLY || '').split(',').map(t => t.trim()).filter(Boolean);
const doSec = (k) => (ONLY.length === 0 || ONLY.includes(k));

const NEB_STEPS = SC(3000);                    // 採点窓と同一(validT=48)
const SAMPLE_EVERY = QUICK ? 5 : 50;           // 一様記録格子の刻み(封①で固定)
const T_ZERO_STEP = 1;                         // t=0+(第174便プローブと同一時刻)

// ======================== 事前登録(実測前に固定 — 実測後に動かさない) ========================
const PRE_REGISTERED = {
  fixedBy: '統括(第174便 coreshell8 の申し送り limits.tZeroAnalytic と第155便 postHoc ② の未潰し' +
    'として第179便で固定 — ハンドオフ 2026-08-23a §3a)',
  fixedBefore: '実測',
  hypothesis: '予測入力の振幅が **t=0+ プローブ由来**である一方、q₅₀ 採点は **3000步窓の保持**で' +
    '決まるため、**窓の間に引きずり Ω_drag が時間変化して窓平均が t=0+ と乖離**していることが' +
    '第174便の残差 ~0.04 の正体である、という仮説を検証する',
  honestFraming: {
    headline: '**本便に hold-out(前向きに伏せられた実測値)は存在しない**',
    whatIsKnownBeforehand: '照合先の q₅₀(coreshell7 の env×1 1.6575・env×2 1.5300)も、比較相手の' +
      '残差 0.040928 も、第158便 ZW2 の核 x_b・x_c も、第174便の t=0+ 4点振幅も、すべて既に確定した' +
      '既知量である。本便はこれらを機械読取するだけで測り直さない(t=0+ プローブは bit 再現の' +
      '転記照合として同条件で再走行するが、値は既知である)',
    whatIsNew: '本便が新しく測るのは **採点窓と同一の 3000步走行中の Ω_drag の時間分解記録**' +
      '(8アーム × 61 標本)と、そこから解ける **窓平均振幅**、およびその振幅で立つ予測である。' +
      '**新規の q₅₀ 掃引は行わない**',
    whatGW2ActuallyAsks: 'GW2 が問うているのは「t=0+ を窓平均へ置き換えたとき、第174便の残差 ' +
      '0.040928 が説明できるか」である。**GW2 の PASS は「未知を当てた」証拠ではない**。' +
      'この読み方は実測前に宣言しており、結果に応じて変えない',
    failIsInformative: '**GW2 が FAIL でも収載する。** FAIL は「残差 ~0.04 は t=0+ vs 窓平均引きずりの' +
      '系統では説明できない」という決定的情報であり、(T5′) の3項化など次の一手を指す価値がある' +
      '(統括の事前登録に明記されている)。したがって FAIL を避けるために窓・平均定義・解法を' +
      '動かすことはしない',
    preflightDisclosure: '実装担当は配線確認の煙試験で、env×1 q=1.5 の **t=0+ 平均**' +
      '(= 第158便収載値と bit 一致することの確認)と、同アームの **step=3000 の平均**を目にしている。' +
      'ただし **窓平均・振幅解・予測値・GW2 の残差は封①より前に一切計算していない**。' +
      '本開示は封①のブロックに含まれ正準化 SHA-256 で固定される',
    whyThisWaveExists: '第174便の申し送り(limits.tZeroAnalytic)と第155便 postHoc ② が名指しした' +
      '未潰しの系統が「t=0+ 解析値 vs 窓平均の乖離」である。第174便で振幅の分解能(点数)は' +
      '2点→4点へ上げたが、**時間軸は t=0+ の1点のまま**であった。本便はそこだけを動かす',
  },
  designPrinciples: {
    oneLeverIsTime: '**本便が動かすレバーは Ω̄_drag の時間軸だけである。** (T5′) の関数形・核 ' +
      'x_b/x_c・4点最小二乗の閉形式・二分法ソルバ・アンカー・照合先・プローブ q 格子は第174便から ' +
      '1 bit も変えない。核まで動かすと「時間平均にした効果」と「核が動いた効果」が混ざる',
    sameRunAsScoring: '時間分解記録は **採点窓と同一の走行**(同一プリセット・同一 seed・同一 dt・' +
      '同一步数・kFrame=1)の最中に行う。記録は状態の読み取りだけで力学へ一切干渉しないので、' +
      '軌道は coreshell7 の採点走行と bit 同一である。この同一性は ' +
      'checks.sameRunAsScoring が measureNeb(採点器そのもの)の返り値との bit 比較で機械確認する',
    machineTranscription: 'アンカー q₅₀・照合先の実測 q₅₀・第174便の残差・核 x_b/x_c・第158便の2点' +
      '振幅・第174便の4点振幅はすべて既存 JSON からの **機械読取**であり、手書き転記をしない',
    anchorIsMeasurement: 'アンカーは coreshell7 の env×1 実測 q₅₀ ただ1つの代入であり、未知の臨界値 ' +
      'Ω_crit を代数的に消去する役割しか持たない(最小二乗も探索も行わない = 較正自由度ではない)',
    lsqIsAgainstProbeObservable: '4点最小二乗が当てはめる相手は **窓平均 Ω̄̄_drag(q)** であって、' +
      'GW2 が判定する **q₅₀(保持喪失曲線)ではない**。すなわち予測対象の残差を小さくする自由度を' +
      '一つも導入していない(classification.fit が空である根拠)',
    anchorRecoveryIsNotPrediction: 'アンカー構成である env×1 の 2項複合予測は**恒等的にアンカー値**に' +
      'なる。したがって GW2 の判定対象は **env×2 の1アームのみ**である',
    twoSeals: '封は2段である。**封①(どの走行よりも前)**: 事前登録窓・記録格子・窓平均の定義・' +
      '振幅の解法・核の出所・二分法ソルバ・アンカーと照合先の出所・正直な位置づけ(煙試験の開示を' +
      '含む)を正準化 SHA-256 で固定して OUT_PATH へ書き出す(preRegistrationSeal)。' +
      '**封②(判定節より前)**: 実測した窓平均振幅と、そこから立てた予測ブロックを正準化 SHA-256 で' +
      '固定して OUT_PATH へ書き出す(predictionIntegrity)。**本便には hold-out が存在しないので、' +
      '封②が担保するのは「判定節で予測を書き換えていない」ことだけである**',
    priorWavesUntouched: '第152/154/155/158/163/168/174便の JSON は一切変更しない。本便は新規ファイル' +
      'として独立に走り、既存 JSON は読み取り専用の機械読取・bit 照合・来歴参照としてのみ使う',
  },
  GW1: {
    role: '記述(判定外)',
    verbatim: 'GW1(記述): 時間プロファイル(q 別・env 別)と t0/窓平均比。乖離の符号が' +
      '「予測が低い」方向と整合するかも記録。',
    items: {
      profile: '8アーム(env×{1,2} × q∈{1.25,1.5,1.75,2.0})それぞれについて、記録格子上の ' +
        'Ω̄_drag(step) の全標本・最小・最大・単調性・半減步数(初期値の 1/2 を最初に下回る標本步)',
      ratio: 't0/窓平均比 = Ω̄_drag(t=0+) / Ω̄̄_drag(窓平均)。**アームごとに記録し、q 依存と ' +
        'env 依存を分けて見る**',
      signConsistency: '第174便の残差の符号は「実測 − 予測 = +0.040928 > 0 = **予測が系統的に低い**」' +
        'である。窓平均化が予測を **上げる** 向きに効くならこの符号と整合する。整合するか否かを' +
        '**記述として**収載する(GW2 の判定はあくまで |差| と改善で行う)',
      retention: '各アームの窓終端の保持率(1 − loss)も併記する(採点量そのものの記述)',
    },
    note: '**判定を伴わない記述窓**である。PASS/FAIL を主張しない',
  },
  GW2: {
    role: '主窓',
    verbatim: '**GW2(主窓): 窓平均補正予測の |q₅₀_pred − 1.5300| ≤ 0.05 かつ 第174便の 0.0409 より' +
      '改善**(両条件を満たして PASS。未達は FAIL のまま収載 — 「t=0+ 系統では説明できない」という' +
      '決定的情報として価値がある)。',
    window: '**|q₅₀_meas(coreshell7 env×2 = 1.5300) − q₅₀_pred(2項複合・窓平均振幅・精細アンカー)| ' +
      '≤ 0.05 かつ その |差| < 第174便 coreshell8 の |差|(fw1.comparisons[env2].absDiff)**',
    tolerance: 0.05,
    improvementRule: '**厳密な改善**(thisAbsDiff < wave174AbsDiff)を要求する。同値・悪化は改善では' +
      'ないので FAIL とする',
    conjunction: '**両条件の論理積**。片方だけ満たしても PASS にしない',
    judgedArm: 'env2(1アームのみ。env×1 は恒等予測なので窓判定に使わない)',
    prediction: '(T1)+(T5′): Ω̄_drag(q) = A_b·x_b^q + A_c·x_c^q を、精細アンカー(coreshell7 の ' +
      '🐚 env×1 実測 q₅₀)で決めた Ω_crit に等しくする q を、決定論的二分法(区間 [0.05,8.0]・' +
      '反復 200 回固定)で解いた値。振幅 A_b・A_c は **本便の窓平均 Ω̄̄_drag(q) 4点の最小二乗解**',
    parameterMapping: {
      A_b: 'A_b = 本便 amplitudes.windowMean.env{1,2}.amplitudeBase(窓平均4点の最小二乗解)',
      A_c: 'A_c = 本便 amplitudes.windowMean.env{1,2}.amplitudeCore(窓平均4点の最小二乗解)',
      x_b: 'x_b = 第158便 zw2.perScale.env{1,2}.kernels.xBase = R̄/(R̄+r̄)(機械読取・本便で動かさない)',
      x_c: 'x_c = 第158便 zw2.perScale.env{1,2}.kernels.xCore = Rc/(Rc+r̄)(機械読取・本便で動かさない)',
      anchor: 'q₅₀_ref = coreshell7-results.json: q50.summary.env1.q50(機械読取)',
      target: 'q₅₀_meas = coreshell7-results.json: q50.summary.env2.q50(機械読取)',
      priorResidual: 'coreshell8-results.json: fw1.comparisons[armKey=env2].absDiff(機械読取)',
    },
    solutionMethod: {
      fourPoint: '重みなし普通最小二乗(正規方程式の閉形式 — 第174便から逐語転記)。' +
        'u_k=x_b^{q_k}・v_k=x_c^{q_k}・y_k=Ω̄̄(q_k) として S11=Σu²・S12=Σuv・S22=Σv²・b1=Σu·y・' +
        'b2=Σv·y、det=S11·S22−S12²、A_b=(b1·S22−b2·S12)/det、A_c=(S11·b2−S12·b1)/det。' +
        '反復・乱数・初期値依存を持たない。**第174便との違いは y_k が t=0+ 値か窓平均かだけ**',
      twoPointSubset: '第158便 ZW2 と同一の閉形式(2式2未知数のクラメル解): ' +
        'det₂=x_b^{q1}·x_c^{q2}−x_c^{q1}·x_b^{q2}、A_b=(y1·x_c^{q2}−y2·x_c^{q1})/det₂、' +
        'A_c=(x_b^{q1}·y2−x_b^{q2}·y1)/det₂',
      scaledCrossCheck: '列を最大値で正規化してから解く尺度正規化版も併記する(数学的に同値。' +
        '丸めに強い経路との相対差を記録する — 記述のみ・判定外)',
      weighting: '**重みなし**(Ω̄̄ の生値に対する最小二乗 — 第174便と同一の選択)。実測前に固定し、' +
        '結果を見てから変えない',
    },
    coRecordedDescriptive: {
      note: '**併記(記述・判定外)**。GW2 の PASS/FAIL には一切使わない',
      a: '(a) より緩い目安 ≤0.10(第174便 FW1 の許容)にも入るか',
      b: '(b) 第174便の残差 0.040928 からの変化(符号つき。悪化も収載する)と予測の移動量',
      c: '(c) **逆向きアンカー**: env×2 実測 1.5300 をアンカーにして env×1 を予測し、実測 1.6575 と' +
        '突き合わせる(窓平均版と t=0+ 版の両方)',
      d: '(d) **旧 t=0+ 予測との差の分解**: 予測の移動を「Ω_crit(アンカー側 env×1 の振幅)が' +
        '動いた分」と「判定アーム(env×2)の振幅が動いた分」と「交互作用」へ 2×2 で分解する。' +
        'P00=t0/t0(= 第174便の予測)・P10=窓/t0・P01=t0/窓・P11=窓/窓 として ' +
        'ΔΩcrit=P10−P00、Δamp=P01−P00、交互作用=P11−P10−P01+P00',
      e: '(e) **窓平均の代替定義**それぞれで解いた予測(t=0+ 込み61点平均・台形則・保持粒子のみ・' +
        '前半・後半・標本中央値)。定義の選び方に予測がどれだけ依存するかの記述',
      f: '(f) **核を窓平均の r̄・R̄ から取り直した版**の予測(本便の主定義では核を固定しているので、' +
        'これは「もう一つのレバーを同時に動かしたら」の記述であり判定外)',
      g: '(g) 4点適合の残差(相対): 各 q での (model−Ω̄̄)/Ω̄̄ と、その最大絶対値・RMS。' +
        '第174便の t=0+ 適合残差(大 q 側で単調一方向)と比べて構造が変わったか',
      h: '(h) 2点部分集合(6組)それぞれの窓平均振幅→予測のばらつき(第174便 FW1 併記 (c) と同形式)',
    },
    inconclusiveRule: '二分法が固定区間 [0.05, 8.0] で解を挟めなかった場合(例えば最小二乗解の振幅に' +
      '負値が出て Ω̄_drag(q) が単調減少でなくなった場合)は **値を捏造せず null を返し INCONCLUSIVE** ' +
      'として PASS/FAIL を主張しない',
    verdictPrecedence: '適用順序(実測前に固定): ① 予測が立たない(挟めない・振幅が解けない)→ ' +
      '**INCONCLUSIVE**。② それ以外 → |q₅₀_meas − q₅₀_pred| ≤ 0.05 **かつ** ' +
      '|差| < 第174便 |差| の両立で PASS、それ以外は FAIL',
  },
  GW3: {
    role: '窓(決定性)',
    verbatim: 'GW3(決定性): 別プロセス2回の正準化 SHA 一致。',
    window: '全体を2回実行(別プロセス)し結果 JSON(非測定メタを除く)の正準化 SHA 一致',
    canonicalization: 'raw(実測部)と predictedFromWindowMeanAmplitudes(予測部)を再帰キー整列した ' +
      'JSON。走行時間は meta.timings にのみ置き raw には入れていないので、除外すべき揮発値は' +
      '対象内に存在しない',
  },
  XCHECK: {
    role: '窓(転記照合)',
    verbatim: '転記照合: t=0+ プローブ値と2点/4点振幅が第158/174便収載値とビット一致(同条件再現)。',
    window: '**次の4群がすべて bit 一致**: (i) 本便の t=0+ プローブ8本が第174便 raw.probe.dragProbes と' +
      '一致し、うち q∈{1.5,2.0} の4本が第158便 raw.neb.dragProbes とも一致する。' +
      '(ii) 本便の時間分解記録の step=1 標本の Ω̄_drag が (i) のプローブ平均と一致する' +
      '(= 時間分解走行の t=0+ が第174便の t=0+ と同一時刻・同一状態であることの証拠)。' +
      '(iii) 本便の t=0+ 4点最小二乗振幅が第174便 amplitudes.fourPoint と一致する。' +
      '(iv) 本便の t=0+ 2点部分集合 {1.5,2.0} 振幅が第158便 zw2.perScale.*.separation と一致する。' +
      'あわせて t=0+ 振幅から立てた予測が第174便 fw1.comparisons[*].predictedQ50FourPoint と一致する',
    tolerance: { bitIdentical: true, fallbackRelative: 1e-12 },
    rationale: '本便は「同じ式・同じ核・同じ解法で、入力の時間軸だけを変える」便である。' +
      't=0+ を入力にしたときに第174便と 1 bit も違わない値が出ることが、' +
      '**窓平均で出た違いが時間軸だけに由来する**ことの機械証拠になる',
    inconclusiveRule: 'プローブ節または既存 JSON の読み取りに失敗した場合は INCONCLUSIVE',
  },
  samplingGridDefinition: {
    declaredBefore: '**どの走行よりも前**に宣言・固定した記録格子である(封①)',
    steps: NEB_STEPS,
    dt: 0.016,
    tZeroStep: T_ZERO_STEP,
    sampleEvery: SAMPLE_EVERY,
    grid: `step ∈ {${T_ZERO_STEP}} ∪ {${SAMPLE_EVERY}, ${2 * SAMPLE_EVERY}, …, ${NEB_STEPS}}`,
    nUniform: Math.floor(NEB_STEPS / SAMPLE_EVERY),
    detailRowSteps: [T_ZERO_STEP, NEB_STEPS],
    detailRowNote: '生行(粒子ごとの r・omFrameMeasured・omDragAnalytic・omKepler)は JSON 肥大を' +
      '避けるため **step=1 と step=3000 の2時刻だけ**収載する。他の時刻は集計量のみ',
    rationale: '50步刻みは 3000步窓を 60 等分する。窓全体を一様に覆いつつ、8アーム × 61 標本の' +
      '記録で JSON が扱える大きさに収まる。t=0+ の1点は第174便との bit 照合のために別に採る',
    nonIntrusive: '記録は状態の読み取りのみで S.step の呼び方・回数・引数を一切変えない。' +
      'したがって軌道は採点走行と bit 同一である',
    noPostHocChange: '実測後に格子・刻み・時刻を動かさない',
  },
  windowMeanDefinition: {
    declaredBefore: '**実測より前**に宣言・固定した平均の定義である(封①)',
    spatialStatistic: 'Ω̄_drag(step) = エンベロープ帯 [NC, S.n) のうち r>1e-6 かつ hasU の粒子の ' +
      'omDragAnalytic の **単純平均**(第158便 ZW2 / 第174便 meanDrag と 1 bit も違わない空間定義。' +
      '**本便は空間側の定義を一切変えない**)',
    primary: '**Ω̄̄_drag(q, env) = 一様格子 {50,100,…,3000} の 60 標本にわたる Ω̄_drag(step) の' +
      '等重み算術平均**。これが GW2 の判定に使う唯一の定義である',
    tZeroExcluded: 'step=1 は一様格子上の点ではない(50步刻みに乗らない)ので **主定義から外す**。' +
      't=0+ は第174便との bit 照合専用のアンカー点として別記する。この選択は実測前に固定した',
    alternatives: {
      withTZero: 't=0+ を含めた 61 標本の等重み平均(記述・判定外)',
      trapezoid: '一様格子上の台形則 (½y₁ + y₂ + … + y₅₉ + ½y₆₀)/59(記述・判定外)',
      retainedOnly: '各時刻の空間平均を **保持粒子のみ**(r < keepR)に限った版の窓平均' +
        '(記述・判定外。窓終端で逃げた粒子を落とすとどうなるかの目安)',
      firstHalf: '一様格子の前半 30 標本(step 50〜1500)の平均(記述・判定外)',
      secondHalf: '一様格子の後半 30 標本(step 1550〜3000)の平均(記述・判定外)',
      median: '一様格子 60 標本の中央値(下位側 = sorted[floor(n/2)] — 第158便 medianDrag と同一規約)',
    },
    noPostHocChange: '実測後に主定義を代替定義へ差し替えない。代替定義は**併記 (e)** としてのみ収載する',
  },
  scoringDefinition: {
    declaredBefore: '**実測より前**に宣言・固定した採点定義である',
    probeObservable: '窓平均 Ω̄̄_drag(q)(windowMeanDefinition.primary)',
    model: 'Ω̄_drag(q) = A_b·x_b^q + A_c·x_c^q(第155便 (T5) の 🐚 平均場版 = (T5′))',
    q50Source: 'q₅₀ は **coreshell7 の実測値の機械読取**である(本便では掃引しない)。' +
      'coreshell7 の採点定義: loss(q) = 1 − envelope.keepFrac・ロジスティック当てはめ・' +
      'keepR は env×1 で 300 / env×2 で 600',
    residualDefinition: '4点適合の残差は relative = (model(q_k) − Ω̄̄(q_k)) / Ω̄̄(q_k)。' +
      '最大絶対値と RMS を収載する',
  },
  procedure: {
    order: [
      '① coreshell5 / coreshell7 / coreshell8 の結果 JSON を機械読取する(sha256 を来歴に残す)。' +
      'あわせてシミュレーション不要の転記照合を行う: 第158便 ZW2 の2点分離を第158便の生プローブ行から' +
      '再計算して bit 一致を要求し、第174便の4点振幅と予測を第174便の生プローブ行から再計算して ' +
      'bit 一致を要求する',
      '② 事前登録窓・記録格子・窓平均の定義・振幅の解法・核の出所・アンカーと照合先の出所・' +
      '正直な位置づけを正準化 SHA-256 で封印し OUT_PATH へ書き出す(封①)',
      '③ t=0+ プローブを q 4点 × env×{1,2} で走行する(1步・計8走行)。第174便/第158便との ' +
      'bit 照合を行う。あわせて従来対象 index.html でも同じ8走行を行い対象実体の同一性を bit 照合する',
      '④ **時間分解走行**を q 4点 × env×{1,2} で行う(3000步 × 8アーム)。記録格子の各時刻で ' +
      'Ω̄_drag と補助量を読む。あわせて採点器 measureNeb の同一設定 3000步走行と終端量を bit 照合し、' +
      '「採点窓と同一の走行」であることを機械確認する',
      '⑤ kF0×kRep0 対照を走行する(記述・判定外。過去便との bit 一致でエンジン同一性を示す)',
      '⑥ 窓平均から4点最小二乗で振幅を解き、予測を立てて predictedFromWindowMeanAmplitudes として ' +
      'JSON へ記録し OUT_PATH へ書き出す(封②)',
      '⑦ GW1(記述)・GW2(主窓)+併記群 (a)〜(h)・XCHECK(転記照合)・GW3(決定性)で判定する' +
      '(窓は①より前に固定済み)',
    ],
    note: '本便は q₅₀ を一切掃引しない。時間分解走行は **採点窓と同一の走行の読み取り**であって、' +
      '新しい力学ではない',
  },
};

const LIMITS = {
  units: 'トイ単位(G・質量・長さ・時間は実世界の物理単位ではない)。q は無次元の指数なので単位系に' +
    '依らないが、R̄・Rc・r̄ の絶対値は当該サンプルの単位系に閉じた値である',
  dt: 0.016,
  noHoldOut: '**本便に hold-out は存在しない**(preRegistered.honestFraming)。照合先の q₅₀ も' +
    '比較相手の残差も既知量であり、GW2 の PASS を「未知を当てた」証拠として読んではならない。' +
    'あわせて、実装担当が煙試験で env×1 q=1.5 の t=0+ と step=3000 の平均を目にしていることを' +
    '開示している(窓平均・振幅解・予測は封①より前に計算していない)',
  noNewSweep: '本便は **q₅₀ の掃引を一切行わない**。したがって q₅₀ 側の分解能(coreshell7 の掃引刻み ' +
    '0.025 と保持率の粒度 1/44 ≈ 0.0227)は本便でも改善していない。改善しうるのは振幅入力の時間軸だけ',
  kernelsHeldFixed: '核 x_b・x_c は第158便 ZW2 の収載値に固定した(r̄ = t=0+ q=1.5 プローブの ' +
    'envMeanR)。**窓の間に r̄ も R̄ も大きく動く**(raw.timeSeries に収載)ので、核を窓平均から' +
    '取り直せば予測は動きうる。その版は併記 (f) に記述として収載するが判定には使わない。' +
    'すなわち本便は「核の時間変化」という系統を潰していない',
  meanFieldApproximation: '🐚 の真の引きずりは粒子対ごとの距離 d_ij に依存する多項和である。' +
    '(T5′) の2項は「クランプ粒子半径の平均 R̄ を核とする項」と「クランプのコア半径 Rc を核とする項」' +
    'による**平均場近似**であり、A_b・A_c は近似モデルのパラメータであってエンジン内部の量そのもの' +
    'ではない(第158便 zw2.perScale.*.separation.caveat と同じ限界)。**時間平均にしてもこの限界は' +
    '動かない** — 4点適合の残差(併記 (g))が近似の当てはまりの直接の物差しである',
  windowMeanIsNotTheScoringFunctional: '採点量 q₅₀ は「窓終端で r<keepR に残った粒子の割合」であり、' +
    '**引きずりの窓平均そのものではない**。(T1) は「Ω_drag が臨界値を下回ると保持を失う」という' +
    '平均場の条件式であって、保持喪失の厳密な汎関数ではない。窓平均を採るのは t=0+ の1点値よりも' +
    '窓の実効値に近いという作業仮説であり、**正しい重み(たとえば脱出が起きる時刻付近を重く見る)は' +
    '本便では導出していない**。これは本便が潰していない系統である',
  escapedParticlesIncluded: '主定義の空間平均は **窓の間に逃げた粒子も含めた**エンベロープ全粒子の' +
    '単純平均である(t=0+ の定義との連続性を優先した)。逃げた粒子は r が大きく Ω_drag が小さいので、' +
    '窓平均は保持粒子だけの平均より低く出る。保持粒子のみの版は併記 (e) に収載する',
  lsqUnweighted: '4点最小二乗は Ω̄̄ の**生値**に対する重みなし普通最小二乗である(第174便と同一の' +
    '選択)。Ω̄̄ は q とともに大きく落ちるので、小さい Ω̄̄(大きい q)の点は相対的に軽く扱われる',
  envScaleCaveat: 'エンベロープ半径倍率は「引きずり核の相対的な効きを変える」以外の寄与も同時に動かす: ' +
    'r̄ が変われば重み w_ij と正規化 D₀+ΣW も変わり、ケプラー角速度・力学時間・保持しきい値(keepR も ' +
    '×2 にする規約)も変わる。これらは差分では相殺されない系統であり、q₅₀ には引きずり核の' +
    '効き以外の寄与も混じりうる(第154便 YW2・第158便 zw2・第163/168/174便と同じ限界)',
  anchorArmIsIdentity: 'env×1 はアンカー構成そのものなので 2項複合予測は恒等的にアンカー値になる。' +
    'env×1 の予測は恒等性の自己点検であって式の予測力の検定ではない(GW2 の判定対象は env×2 のみ)',
  anchorPropagation: '予測はアンカー(coreshell7 の env×1 実測 q₅₀)を1点使う。アンカー自身が ' +
    'coreshell7 の掃引刻み 0.025 と保持率の粒度に由来する不確かさを持ち、その不確かさは予測値へ' +
    'そのまま伝播する。本便はアンカー側を触っていないので、この成分は coreshell7 と同じまま残っている',
  singleSeed: '🐚nebulaShell は seed 20260804 の 1 標本である。窓平均の時間プロファイルが' +
    'この標本に固有か普遍かは本便では測っていない(シード散らばりは未計装)',
  targetIsBeta: '本便の対象 HTML は **beta/index.html**(統括指示)である。従来の coreshell 系は ' +
    'index.html を対象にしてきたので、両者が本便の測定量について bit 同一であることを ' +
    'checks.targetEquivalence で機械確認する',
  notClaim: '実在天体についての主張ではない。すべて DFM 公理系内部の構成依存の実測である',
};

// ==================== 入力(既存 JSON — 読み取り専用。sha256 を来歴に残す)====================
const INPUT_SPECS = [
  { key: 'cs5', file: 'coreshell5-results.json',
    role: '第158便の実測正本(**本便の核の出所**: ZW2 の x_b・x_c を機械読取して固定する。' +
      'また XCHECK の照合先である2点振幅 A_b・A_c と、その再計算元の生プローブ行)' },
  { key: 'cs7', file: 'coreshell7-results.json',
    role: '第168便の実測正本(**本便のアンカーと照合先**: q50.summary.env1.q50 = 1.6575 を' +
      'アンカーに、q50.summary.env2.q50 = 1.5300 を照合先に機械読取する。対照の bit 照合参照も兼ねる)' },
  { key: 'cs8', file: 'coreshell8-results.json',
    role: '第174便の実測正本(**本便の比較相手**: fw1.comparisons[env2].absDiff = 0.040928… が ' +
      'GW2 の改善判定の基準線。amplitudes.fourPoint が XCHECK の照合先、raw.probe.dragProbes が ' +
      't=0+ プローブの bit 照合先)' },
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
const CS5 = inputs.cs5, CS7 = inputs.cs7, CS8 = inputs.cs8;
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
    '(index.html)の SHA-256 の照合。実体の同値性は SHA ではなく **測定値の bit 一致**で示す ' +
    '(checks.probeReproduction / checks.targetEquivalence / crossWaveCheck)',
};

// ============================ 測定器(第174便 exp-coreshell8.mjs から逐語踏襲) ================
// A) 🐚nebulaShell 採点器 — 第154/158/163/168/174便 measureNeb と同一(帯定義・しきい値・返却)。
//    本便では kF0×kRep0 対照と、**時間分解走行が採点走行と同一であることの bit 照合**に使う。
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

// B) 🐚 引きずりプローブ(t=0+)— 第154/158/163/168/174便 nebDragProbe と同一(1步・解析値の読み取り)。
//    本便では **転記照合(XCHECK)専用**。窓平均の入力ではない。
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

// C) 【本便の新規】🐚 引きずりの時間分解記録 — **採点窓と同一の走行**の最中に読む。
//    build/step の呼び方は measureNeb の 3000步走行と 1 bit も違わない(kFrame=1・q・envScale のみ上書き)。
//    記録は状態の読み取りだけで力学へ一切干渉しない。Ω_drag の式は上の nebDragProbe と逐語同一。
const nebDragTimeSeriesOn = (pg) => (opt) => pg.evaluate((o) => {
  const p = JSON.parse(JSON.stringify(HP.allPresets().find(z => z.id === 'nebulaShell')));
  p.physics.kFrame = 1;
  if (o.q !== undefined && o.q !== null) p.physics.q = o.q;
  const env = p.bodies.find(b => b.type === 'ring');
  const ENV0 = { rIn: env.rIn, rOut: env.rOut };
  if (o.envScale !== undefined && o.envScale !== null && o.envScale !== 1) {
    env.rIn = ENV0.rIn * o.envScale; env.rOut = ENV0.rOut * o.envScale;
  }
  HP.sim.build(p);
  const S = HP.sim;
  const NC = p.bodies[0].n + p.bodies[1].n + p.bodies[2].n;
  const KEEP = o.keepR;
  const samples = [], detailRows = {};
  const snapshot = (step) => {
    const q = S.params.q, G = S.params.G, eps = S.params.softening, D0 = S.params.D0;
    let M = 0, cx = 0, cy = 0, cvx = 0, cvy = 0;
    for (let i = 0; i < NC; i++) { const mi = S.m[i]; M += mi; cx += mi * S.x[i]; cy += mi * S.y[i];
      cvx += mi * S.vx[i]; cvy += mi * S.vy[i]; }
    cx /= M; cy /= M; cvx /= M; cvy /= M;
    let Rbar = 0; for (let i = 0; i < NC; i++) Rbar += S.R[i]; Rbar /= NC;
    // 採点器 measureNeb の band() と同一定義(フィルタ無し・帯全体)の補助量
    let nAll = 0, sumRAll = 0, keepAll = 0;
    for (let i = NC; i < S.n; i++) {
      const r = Math.hypot(S.x[i] - cx, S.y[i] - cy);
      nAll++; sumRAll += r; if (r < KEEP) keepAll++;
    }
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
    const n = rows.length;
    const mean = (f) => rows.reduce((a, e) => a + f(e), 0) / n;
    const sortedD = rows.map(e => e.omDragAnalytic).slice().sort((a, b) => a - b);
    const sortedDK = rows.map(e => e.dragOverKepler).slice().sort((a, b) => a - b);
    let nKept = 0, sumKept = 0;
    for (const e of rows) if (e.r < KEEP) { nKept++; sumKept += e.omDragAnalytic; }
    samples.push({ step, t: step * 0.016, nEnv: n,
      meanOmegaDrag: mean(e => e.omDragAnalytic),
      medianOmegaDrag: sortedD[Math.floor(n / 2)],
      meanOmegaDragRetained: nKept ? sumKept / nKept : null, nRetained: nKept,
      envMeanR: mean(e => e.r),
      meanDragOverKepler: mean(e => e.dragOverKepler),
      medianDragOverKepler: sortedDK[Math.floor(n / 2)],
      meanOmegaFrameMeasured: mean(e => e.omFrameMeasured),
      clumpMass: M, RbarClump: Rbar,
      bandN: nAll, bandMeanR: sumRAll / nAll, bandKeepFrac: keepAll / nAll });
    if (o.detailSteps.includes(step)) detailRows['step' + step] = rows;
  };
  for (let k = 0; k < o.steps; k++) {
    S.step(0.016);
    const st = k + 1;
    if (st === o.tZeroStep || st % o.sampleEvery === 0) snapshot(st);
  }
  return { cfg: { kFrame: p.physics.kFrame, q: S.params.q, kRep: p.physics.kRep,
      G: S.params.G, D0: S.params.D0, softening: S.params.softening,
      envScale: (o.envScale === undefined || o.envScale === null) ? 1 : o.envScale,
      envRIn: env.rIn, envROut: env.rOut, envRInRef: ENV0.rIn, envROutRef: ENV0.rOut,
      keepR: KEEP, steps: o.steps, sampleEvery: o.sampleEvery, tZeroStep: o.tZeroStep,
      nClump: NC, n: S.n },
    samples, detailRows, n: S.n, nan: S.hasNaN(), clampV: S.clampVN, clampS: S.clampSN };
}, opt);

// ================= 予測式(第155便 → … → 第174便からの逐語転記)===============================
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
// 第158便 ZW2 の平均場2項分離(2式2未知数のクラメル解。XCHECK の判定に使う逐語転記)
const separateTwoTerm = (xb, xc, q1, q2, o1, o2) => {
  const det = Math.pow(xb, q1) * Math.pow(xc, q2) - Math.pow(xc, q1) * Math.pow(xb, q2);
  return { determinant: det,
    amplitudeBase: (o1 * Math.pow(xc, q2) - o2 * Math.pow(xc, q1)) / det,
    amplitudeCore: (Math.pow(xb, q1) * o2 - Math.pow(xb, q2) * o1) / det };
};
// 4点最小二乗(第174便 fitTwoTermLSQ から逐語転記 — 入力 y_k だけが窓平均に替わる)
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
    method: PRE_REGISTERED.GW2.solutionMethod.fourPoint };
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
const nebDragTimeSeries = nebDragTimeSeriesOn(page);

const log = (...a) => console.log(...a);
const fmt = (v, d = 4) => (v === null || v === undefined || Number.isNaN(v)) ? '—' : Number(v).toFixed(d);

const out = { meta: { exp: 'coreshell9', wave: 179, target: TARGET, date: new Date().toISOString(),
    dt: 0.016,
    basedOn: '第174便 tests/exp-coreshell8.mjs(**本便の比較相手・振幅解法・プローブ格子**: ' +
      't=0+ 4点振幅と予測 1.489072…・残差 0.040928…。4点最小二乗の閉形式と封の流儀も逐語踏襲)' +
      ' / 第168便 tests/exp-coreshell7.mjs(**本便のアンカーと照合先**: 精細 q₅₀ env×1 1.6575 / ' +
      'env×2 1.5300 と 🐚 採点走行規約 3000步・validT=48)' +
      ' / 第158便 tests/exp-coreshell5.mjs(ZW2 の 🐚 引きずりプローブ規約と2点分離 = 本便の核の出所)' +
      ' / 第155便 tests/exp-coreshell-theory.mjs(予測式 (T1)(T5)・postHoc ② が本便の動機)' +
      ' / 第154便 exp-coreshell4(🐚 走行規約)/ 第163便 exp-coreshell6 / 第152便 exp-coreshell3 / ' +
      '第139便 exp-coreshell2 / 第135便 exp-coreshell(原型)',
    role: '🐚 の引きずり Ω_drag を **採点窓と同一の 3000步走行の最中に時間分解で記録**し、' +
      '**窓平均 Ω̄̄_drag(q)** から平均場2項振幅を解き直して、coreshell7 の精細アンカーで立て直した ' +
      '2項複合予測を coreshell7 env×2 実測 1.5300 と突き合わせる便(**t=0+ 解析値 vs 窓平均引きずりの' +
      '系統の検証 — hold-out は存在しない・新規掃引なし**)',
    quick: QUICK, only: ONLY },
  preRegistered: PRE_REGISTERED, limits: LIMITS,
  provenance: { inputs: provenanceInputs, targetConsistency },
  raw: {} };
out.meta.timings = {};   // 走行時間は非測定メタなので raw には入れない(raw は完全に決定論的)

// ---- アーム・走行規約(実測前に固定)----
const NEB_KEEP_R0 = 300;              // 🐚 保持しきい値(×1)。半径倍率とともに拡大する(第154便規約)
const NEB_ARMS = [
  { key: 'env1', envScale: 1, keepR: NEB_KEEP_R0 * 1, group: 'anchor', cs7Key: 'env1',
    label: '🐚kF1kRep実 env×1(保持しきい値 r<300)— アンカー構成(予測は恒等)' },
  { key: 'env2', envScale: 2, keepR: NEB_KEEP_R0 * 2, group: 'judged', cs7Key: 'env2',
    label: '🐚kF1kRep実 env×2(保持しきい値 r<600)— GW2 の判定対象' },
];
const NEB_ANCHOR_KEY = 'env1';
const PROBE_QS = [1.25, 1.5, 1.75, 2.0];      // 第174便と同一(封①で固定)
const WAVE158_QS = [1.5, 2.0];                // 第158便 ZW2 の2点(XCHECK の部分集合)
const CTL_STEPS = SC(3000);
const DETAIL_STEPS = [T_ZERO_STEP, NEB_STEPS];
const tagQ = (q) => 'q' + q.toFixed(5);
const tagQ2 = (q) => 'q' + q.toFixed(2);                     // 第158便 JSON のキー形式
const armQKey = (a, q) => `env${a.envScale}_${tagQ(q)}`;
const meanDrag = (pr) => pr.rows.reduce((a, e) => a + e.omDragAnalytic, 0) / pr.rows.length;
const medianDrag = (pr) => {
  const s = pr.rows.map(e => e.omDragAnalytic).sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
};

// 核(第158便 ZW2 の収載値を機械読取して固定する — 本便のレバーは時間軸だけ)
const kernelsOf = (a) => {
  const s = CS5.zw2.perScale[`env${a.envScale}`];
  return { xb: s.kernels.xBase, xc: s.kernels.xCore,
    Rbar: s.kernels.kernelRadiusBase, Rc: s.kernels.kernelRadiusCore, rBar: s.kernels.rBarUsed,
    rBarSource: s.kernels.rBarSource,
    sourcePath: `coreshell5-results.json: zw2.perScale.env${a.envScale}.kernels` };
};

// アンカー・照合先・比較相手(coreshell7 / coreshell8 から機械読取)
const ANCHOR = {
  armKey: NEB_ANCHOR_KEY,
  q50: CS7.q50.summary.env1.q50,
  fitResult: CS7.q50.summary.env1.result,
  source: 'coreshell7-results.json: q50.summary.env1.q50(第168便が 0.025 刻み21点で実測した値)',
};
const cs8Env2 = (CS8.fw1 && CS8.fw1.comparisons)
  ? CS8.fw1.comparisons.find(c => c.armKey === 'env2') || null : null;
const cs8Env1 = (CS8.fw1 && CS8.fw1.comparisons)
  ? CS8.fw1.comparisons.find(c => c.armKey === 'env1') || null : null;
const TARGETQ = {
  armKey: 'env2',
  q50Measured: CS7.q50.summary.env2.q50,
  fitResult: CS7.q50.summary.env2.result,
  source: 'coreshell7-results.json: q50.summary.env2.q50',
  wave174PredictedTZero: cs8Env2 ? cs8Env2.predictedQ50FourPoint : null,
  wave174AbsDiff: cs8Env2 ? cs8Env2.absDiff : null,
  wave174SignedDiff: cs8Env2 ? cs8Env2.signedDiff : null,
  wave174Source: 'coreshell8-results.json: fw1.comparisons[armKey=env2]',
  signOfWave174Residual: '実測 − 予測 > 0 ⇔ **予測が系統的に低い**(GW1 の符号整合の基準)',
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
      'の値を bit 一致で再現するか',
    method: '第158便 raw.neb.dragProbes の生行(omDragAnalytic)から Ω̄_drag(q) を再計算し、同じ核で' +
      '連立を解いて第158便 JSON の収載値と厳密比較する(シミュレーションは行わない)',
    rows, nCompared: rows.length, nIdentical: rows.filter(e => e.identical).length,
    allIdentical: rows.length ? rows.every(e => e.identical) : null };
}
// (b) 第174便 coreshell8 の4点振幅・Ω_crit・予測を、第174便の生プローブ行から本ハーネスで再現する。
{
  const rows = [];
  try {
    const P = CS8.raw.probe.dragProbes;
    const ysOf = (a) => PROBE_QS.map(q => meanDrag(P[armQKey(a, q)]));
    const fitOf = (a) => { const K = kernelsOf(a); return fitTwoTermLSQ(K.xb, K.xc, PROBE_QS, ysOf(a)); };
    const fits = Object.fromEntries(NEB_ARMS.map(a => [a.key, fitOf(a)]));
    for (const a of NEB_ARMS) {
      const theirs = CS8.amplitudes.fourPoint[a.key];
      rows.push({ item: `4点振幅(第174便の生プローブ行から再計算) ${a.key}`,
        identical: fits[a.key].amplitudeBase === theirs.amplitudeBase &&
          fits[a.key].amplitudeCore === theirs.amplitudeCore &&
          fits[a.key].determinant === theirs.determinant,
        mine: { base: fits[a.key].amplitudeBase, core: fits[a.key].amplitudeCore,
          det: fits[a.key].determinant },
        theirs: { base: theirs.amplitudeBase, core: theirs.amplitudeCore, det: theirs.determinant } });
    }
    const refA = NEB_ARMS.find(x => x.key === NEB_ANCHOR_KEY);
    const refK = kernelsOf(refA);
    const crit = omegaDragNeb({ xb: refK.xb, xc: refK.xc,
      Ab: fits[refA.key].amplitudeBase, Ac: fits[refA.key].amplitudeCore }, ANCHOR.q50);
    rows.push({ item: 'Ω_crit(第174便の4点振幅・精細アンカー)',
      identical: crit === CS8.predictedFromRefreshedAmplitudes.omegaCrit,
      mine: crit, theirs: CS8.predictedFromRefreshedAmplitudes.omegaCrit });
    for (const a of NEB_ARMS) {
      const K = kernelsOf(a);
      const sol = solveMonotoneDecreasing((q) => omegaDragNeb(
        { xb: K.xb, xc: K.xc, Ab: fits[a.key].amplitudeBase, Ac: fits[a.key].amplitudeCore }, q), crit);
      const theirs = (CS8.fw1.comparisons.find(c => c.armKey === a.key) || {}).predictedQ50FourPoint;
      rows.push({ item: `q₅₀_pred(第174便 t=0+ 4点振幅) ${a.key}`,
        identical: sol.q === theirs, mine: sol.q, theirs });
    }
  } catch (e) { out.checks.wave174TranscriptionError = String(e && e.message); }
  out.checks.transcriptionReproducesWave174Prediction = {
    question: '本ハーネスへ転記した4点最小二乗・(T5′)・二分法ソルバが、第174便 coreshell8 の' +
      '4点振幅・Ω_crit・両アームの q₅₀_pred を bit 一致で再現するか(= 「時間軸だけを差し替える」' +
      '比較が成立することの機械証拠)',
    method: '第174便 raw.probe.dragProbes の生行から Ω̄_drag(q) を再計算し、第158便の核・本ハーネスの' +
      '関数へ通して coreshell8 JSON の収載値と厳密比較する(シミュレーションは行わない)',
    anchorQ50: ANCHOR.q50,
    rows, nCompared: rows.length, nIdentical: rows.filter(e => e.identical).length,
    allIdentical: rows.length ? rows.every(e => e.identical) : null };
}
out.checks.solverMatchesWave174 = {
  mine: SOLVER,
  wave174: (CS8.manifest && CS8.manifest.numerics) ? CS8.manifest.numerics.solver : null,
  identical: (CS8.manifest && CS8.manifest.numerics && CS8.manifest.numerics.solver)
    ? JSON.stringify(canonize(SOLVER)) === JSON.stringify(canonize(CS8.manifest.numerics.solver)) : null };
out.checks.probeGridMatchesWave174 = {
  question: '本便のプローブ q 格子が第174便と同一か(「時間軸だけを動かす」ための必要条件)',
  mine: PROBE_QS, wave174: (CS8.raw && CS8.raw.probe) ? CS8.raw.probe.probeQs : null,
  identical: (CS8.raw && CS8.raw.probe)
    ? JSON.stringify(PROBE_QS) === JSON.stringify(CS8.raw.probe.probeQs) : null };
out.checks.scoringRunMatchesWave168 = {
  question: '本便の時間分解走行の步数・dt・seed 規約が coreshell7 の採点走行と同一か',
  mine: { steps: NEB_STEPS, dt: 0.016, seed: 20260804, validT: NEB_STEPS * 0.016 },
  wave168: (CS7.preRegistrationBlock && CS7.preRegistrationBlock.runProtocol)
    ? CS7.preRegistrationBlock.runProtocol : null,
  stepsIdentical: (CS7.preRegistrationBlock && CS7.preRegistrationBlock.runProtocol)
    ? CS7.preRegistrationBlock.runProtocol.steps === NEB_STEPS : null };

log(`\n===== ① 転記照合(シミュレーション不要・走行前)=====`);
log(`  第158便 ZW2 2点分離の再現: ${out.checks.transcriptionReproducesWave158Separation.nIdentical}/${out.checks.transcriptionReproducesWave158Separation.nCompared}`);
log(`  第174便 4点振幅・予測の再現: ${out.checks.transcriptionReproducesWave174Prediction.nIdentical}/${out.checks.transcriptionReproducesWave174Prediction.nCompared}`);
log(`  ソルバが第174便と同一: ${out.checks.solverMatchesWave174.identical} / q 格子が第174便と同一: ${out.checks.probeGridMatchesWave174.identical} / 步数が第168便採点走行と同一: ${out.checks.scoringRunMatchesWave168.stepsIdentical}`);

// ---- ② 封①: 事前登録・記録格子・窓平均定義・解法・核の出所を走行前に固定して書き出す ---------
const preRegistrationBlock = {
  declaredBefore: '**どの走行よりも前**に固定し OUT_PATH へ書き出したブロックである(封①)',
  honestFraming: PRE_REGISTERED.honestFraming,
  hypothesis: PRE_REGISTERED.hypothesis,
  windows: { GW1: PRE_REGISTERED.GW1, GW2: PRE_REGISTERED.GW2, GW3: PRE_REGISTERED.GW3,
    XCHECK: PRE_REGISTERED.XCHECK },
  scoringDefinition: PRE_REGISTERED.scoringDefinition,
  samplingGridDefinition: PRE_REGISTERED.samplingGridDefinition,
  windowMeanDefinition: PRE_REGISTERED.windowMeanDefinition,
  solver: SOLVER,
  probeQs: PROBE_QS,
  arms: NEB_ARMS.map(a => ({ key: a.key, envScale: a.envScale, keepR: a.keepR, group: a.group,
    label: a.label })),
  kernelSource: Object.fromEntries(NEB_ARMS.map(a => [a.key, kernelsOf(a)])),
  anchor: ANCHOR,
  comparisonTarget: TARGETQ,
  wave174Amplitudes: Object.fromEntries(NEB_ARMS.map(a => [a.key, {
    amplitudeBase: CS8.amplitudes.fourPoint[a.key].amplitudeBase,
    amplitudeCore: CS8.amplitudes.fourPoint[a.key].amplitudeCore,
    source: `coreshell8-results.json: amplitudes.fourPoint.${a.key}`,
    note: '**XCHECK の照合先**であり、併記の「新旧比較」の旧側(t=0+ 側)でもある' }])),
  wave158Amplitudes: Object.fromEntries(NEB_ARMS.map(a => [a.key, {
    amplitudeBase: CS5.zw2.perScale[`env${a.envScale}`].separation.amplitudeBase,
    amplitudeCore: CS5.zw2.perScale[`env${a.envScale}`].separation.amplitudeCore,
    determinant: CS5.zw2.perScale[`env${a.envScale}`].separation.determinant,
    source: `coreshell5-results.json: zw2.perScale.env${a.envScale}.separation` }])),
  runProtocol: { probeSteps: 1, seriesSteps: NEB_STEPS, ctlSteps: CTL_STEPS, dt: 0.016,
    seed: 20260804, sampleEvery: SAMPLE_EVERY, tZeroStep: T_ZERO_STEP, detailSteps: DETAIL_STEPS,
    note: '第154/158/163/168/174便の 🐚 走行規約と同一(seed・dt・1步プローブ・3000步窓)。' +
      '時間分解走行は **採点走行そのもの**の読み取りであり、S.step の呼び方を変えない' },
};
out.preRegistrationSeal = {
  canonicalization: 'preRegistrationBlock を再帰キー整列した JSON の SHA-256',
  sha256AtSealTime: canonSha(preRegistrationBlock),
  writtenToDiskBeforeAnyRun: false, sha256AtFinalWrite: null, unchanged: null,
  note: '事前登録窓・記録格子・窓平均の定義・振幅の解法・核の出所・アンカーと照合先の出所・' +
    '正直な位置づけを、**どの走行よりも前**にディスクへ書き出してから走行を始める。' +
    '最終書き出し時に正準化 SHA-256 を照合し、実測後にこれらを書き換えていないことの機械証拠とする' };
out.preRegistrationBlock = preRegistrationBlock;

log(`\n===== ② 封①(走行前の窓・記録格子・窓平均定義・解法・核の固定)=====`);
log(`  記録格子: ${PRE_REGISTERED.samplingGridDefinition.grid}(一様 ${PRE_REGISTERED.samplingGridDefinition.nUniform} 点 + t=0+ 1点)`);
log(`  窓平均(主定義): 一様格子の等重み算術平均 / q=[${PROBE_QS.join(', ')}] × env×[${NEB_ARMS.map(a => a.envScale).join(', ')}]`);
log(`  アンカー q₅₀_ref=${fmt(ANCHOR.q50)} / 照合先 q₅₀_meas=${fmt(TARGETQ.q50Measured)} / 比較相手(第174便 |差|)=${fmt(TARGETQ.wave174AbsDiff, 6)}`);
out.meta.stage = 'pre-registration-sealed-before-any-run';
fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));
out.preRegistrationSeal.writtenToDiskBeforeAnyRun = true;
log(`  → 封① を ${path.relative(ROOT, OUT_PATH)} へ書き出した(sha256 ${out.preRegistrationSeal.sha256AtSealTime.slice(0, 16)}…)`);

// ---- ③ t=0+ プローブ 4点 × env×{1,2}(転記照合 XCHECK 用)-------------------------------------
const dragProbes = {};
const dropRowsJ = (pr) => JSON.stringify({ q: pr.q, RbarClump: pr.RbarClump, envMeanR: pr.envMeanR,
  meanDragOverKepler: pr.meanDragOverKepler, medianDragOverKepler: pr.medianDragOverKepler,
  meanMeasuredOverKepler: pr.meanMeasuredOverKepler, nEnv: pr.nEnv, rows: pr.rows });
if (doSec('probe')) {
  log(`\n===== ③ 🐚 t=0+ 引きずりプローブ(q=${PROBE_QS.join(',')} × env×${NEB_ARMS.map(a => a.envScale).join(',×')})=====`);
  for (const a of NEB_ARMS) for (const q of PROBE_QS) {
    const t0 = Date.now();
    const pr = await nebDragProbe(q, a.envScale);
    dragProbes[armQKey(a, q)] = pr;
    out.meta.timings[`probe:${armQKey(a, q)}`] = (Date.now() - t0) / 1000;
    log(`  env×${a.envScale} q=${fmt(pr.q, 2)} R̄=${fmt(pr.RbarClump, 4)} ⟨r⟩=${fmt(pr.envMeanR, 3)} Ω̄_drag(t=0+)=${meanDrag(pr).toExponential(6)} nEnv=${pr.nEnv}`);
  }
  out.raw.probe = { probeQs: PROBE_QS, dragProbes,
    note: '1步プローブ(kFrame=1 で build → S.step(0.016) を1回)。**本便では転記照合(XCHECK)と' +
      '「時間軸を動かす前の基準線」としてのみ使う**。GW2 の入力は窓平均である' };

  const cmp158 = [], cmp174 = [];
  for (const a of NEB_ARMS) for (const q of PROBE_QS) {
    const mine = dragProbes[armQKey(a, q)];
    const t174 = (CS8.raw && CS8.raw.probe) ? CS8.raw.probe.dragProbes[armQKey(a, q)] : null;
    if (mine && t174) cmp174.push({ label: `🐚 t=0+ プローブ env×${a.envScale} q=${q} vs 第174便`,
      identical: dropRowsJ(mine) === dropRowsJ(t174) });
    if (WAVE158_QS.includes(q)) {
      const t158 = CS5.raw.neb.dragProbes[`env${a.envScale}_${tagQ2(q)}`];
      if (mine && t158) cmp158.push({ label: `🐚 t=0+ プローブ env×${a.envScale} q=${q} vs 第158便`,
        identical: dropRowsJ(mine) === dropRowsJ(t158) });
    }
  }
  out.checks.probeReproduction = {
    question: '本便の対象 HTML が第174便(8点)・第158便(共有する4点)と同じ t=0+ プローブ値を出すか',
    vsWave174: { comparisons: cmp174, nCompared: cmp174.length,
      nIdentical: cmp174.filter(e => e.identical).length,
      allIdentical: cmp174.length ? cmp174.every(e => e.identical) : null },
    vsWave158: { comparisons: cmp158, nCompared: cmp158.length,
      nIdentical: cmp158.filter(e => e.identical).length,
      allIdentical: cmp158.length ? cmp158.every(e => e.identical) : null },
    note: '一致していれば「本便の窓平均振幅と第174便の t=0+ 振幅の違いは、入力の時間軸だけに由来する」' +
      'と読める。一致しない場合もそのまま収載し、GW2 の解釈上の注記とする' };
  log(`  第174便プローブとの bit 一致: ${out.checks.probeReproduction.vsWave174.nIdentical}/${out.checks.probeReproduction.vsWave174.nCompared} / 第158便: ${out.checks.probeReproduction.vsWave158.nIdentical}/${out.checks.probeReproduction.vsWave158.nCompared}`);
}

// ---- ④ 時間分解走行 4点 × env×{1,2}(**本便の主測定**)----------------------------------------
// 窓平均の算出器(定義は封①の windowMeanDefinition — 実測後に動かさない)
const uniformSamples = (ts) => ts.samples.filter(s => s.step % SAMPLE_EVERY === 0);
const tZeroSample = (ts) => ts.samples.find(s => s.step === T_ZERO_STEP) || null;
const arithMean = (xs) => xs.reduce((a, v) => a + v, 0) / xs.length;
const medianOf = (xs) => { const s = xs.slice().sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
const trapezoidMean = (ys) => {
  const n = ys.length;
  if (n < 2) return null;
  let s = 0.5 * ys[0] + 0.5 * ys[n - 1];
  for (let i = 1; i < n - 1; i++) s += ys[i];
  return s / (n - 1);
};
const windowMeansOf = (ts) => {
  const uni = uniformSamples(ts), t0 = tZeroSample(ts);
  const y = uni.map(s => s.meanOmegaDrag);
  const half = Math.floor(uni.length / 2);
  const kept = uni.map(s => s.meanOmegaDragRetained).filter(v => v !== null && Number.isFinite(v));
  return {
    primary: arithMean(y),
    nUniform: uni.length,
    tZero: t0 ? t0.meanOmegaDrag : null,
    withTZero: t0 ? arithMean([t0.meanOmegaDrag, ...y]) : null,
    trapezoid: trapezoidMean(y),
    retainedOnly: kept.length === uni.length ? arithMean(kept) : (kept.length ? arithMean(kept) : null),
    retainedOnlyNSamples: kept.length,
    firstHalf: arithMean(y.slice(0, half)),
    secondHalf: arithMean(y.slice(half)),
    median: medianOf(y),
    min: Math.min(...y), max: Math.max(...y),
    ratioTZeroOverPrimary: t0 ? t0.meanOmegaDrag / arithMean(y) : null,
    ratioPrimaryOverTZero: t0 ? arithMean(y) / t0.meanOmegaDrag : null,
    envMeanRWindow: arithMean(uni.map(s => s.envMeanR)),
    RbarClumpWindow: arithMean(uni.map(s => s.RbarClump)),
    clumpMassWindow: arithMean(uni.map(s => s.clumpMass)),
    endKeepFrac: uni[uni.length - 1].bandKeepFrac,
    endBandMeanR: uni[uni.length - 1].bandMeanR,
    definitionNote: '**primary が GW2 の唯一の判定入力**(一様格子 {50,…,3000} の等重き算術平均)。' +
      '他は併記(記述・判定外)である',
  };
};

const series = {}, windowMeans = {};
if (doSec('series')) {
  log(`\n===== ④ 🐚 時間分解走行(採点窓と同一の ${NEB_STEPS} 步・記録 ${SAMPLE_EVERY} 步ごと + t=0+)=====`);
  for (const a of NEB_ARMS) for (const q of PROBE_QS) {
    const k = armQKey(a, q);
    const t0 = Date.now();
    const ts = await nebDragTimeSeries({ q, envScale: a.envScale, keepR: a.keepR, steps: NEB_STEPS,
      sampleEvery: SAMPLE_EVERY, tZeroStep: T_ZERO_STEP, detailSteps: DETAIL_STEPS });
    series[k] = ts;
    const wm = windowMeansOf(ts);
    windowMeans[k] = wm;
    out.meta.timings[`series:${k}`] = (Date.now() - t0) / 1000;
    log(`  env×${a.envScale} q=${fmt(q, 2)} Ω̄(t=0+)=${wm.tZero.toExponential(6)} → Ω̄̄(窓平均)=${wm.primary.toExponential(6)}` +
      ` 比 t0/窓=${fmt(wm.ratioTZeroOverPrimary, 4)} 終端保持=${fmt(wm.endKeepFrac, 4)} 標本=${wm.nUniform} (${out.meta.timings[`series:${k}`].toFixed(1)}s)`);
  }
  out.raw.timeSeries = { steps: NEB_STEPS, sampleEvery: SAMPLE_EVERY, tZeroStep: T_ZERO_STEP,
    detailSteps: DETAIL_STEPS, probeQs: PROBE_QS,
    armDefs: NEB_ARMS.map(a => ({ key: a.key, envScale: a.envScale, keepR: a.keepR })),
    runs: series,
    note: '**本便の主測定**。採点窓と同一の走行(kFrame=1・同一 seed・同一 dt・同一步数)の最中に、' +
      '第174便 nebDragProbe と逐語同一の式で解析的 Ω_drag を読んだ時間分解記録。' +
      '記録は状態の読み取りのみで力学へ一切干渉しない' };
  out.raw.windowMeans = { perArmQ: windowMeans, definition: PRE_REGISTERED.windowMeanDefinition,
    note: 'windowMeanDefinition.primary が GW2 の唯一の判定入力である' };

  // (i) t=0+ 標本が t=0+ プローブと bit 一致するか(= 時間分解走行の起点が第174便と同一時刻・同一状態)
  const tzCmp = [];
  if (out.raw.probe) {
    for (const a of NEB_ARMS) for (const q of PROBE_QS) {
      const k = armQKey(a, q);
      const s0 = tZeroSample(series[k]);
      const pr = dragProbes[k];
      const rows0 = series[k].detailRows['step' + T_ZERO_STEP] || null;
      tzCmp.push({ label: `時間分解 step=${T_ZERO_STEP} vs t=0+ プローブ ${k}`,
        meanIdentical: s0 ? s0.meanOmegaDrag === meanDrag(pr) : null,
        envMeanRIdentical: s0 ? s0.envMeanR === pr.envMeanR : null,
        nEnvIdentical: s0 ? s0.nEnv === pr.nEnv : null,
        rowsIdentical: rows0 ? JSON.stringify(rows0) === JSON.stringify(pr.rows) : null,
        identical: !!(s0 && rows0 && s0.meanOmegaDrag === meanDrag(pr) && s0.envMeanR === pr.envMeanR &&
          s0.nEnv === pr.nEnv && JSON.stringify(rows0) === JSON.stringify(pr.rows)) });
    }
  }
  out.checks.timeSeriesTZeroMatchesProbe = {
    question: '時間分解走行の step=1 標本が、同条件の t=0+ プローブと bit 一致するか(= 両者が' +
      '同一時刻・同一状態を見ていることの機械証拠)',
    comparisons: tzCmp, nCompared: tzCmp.length, nIdentical: tzCmp.filter(e => e.identical).length,
    allIdentical: tzCmp.length ? tzCmp.every(e => e.identical) : null };
  log(`  時間分解 step=1 と t=0+ プローブの bit 一致: ${out.checks.timeSeriesTZeroMatchesProbe.nIdentical}/${out.checks.timeSeriesTZeroMatchesProbe.nCompared}`);

  // (ii) 採点器 measureNeb の同一設定走行と終端量が bit 一致するか(= 採点窓と同一の走行であること)
  const scCmp = [];
  for (const a of NEB_ARMS) for (const q of PROBE_QS) {
    const k = armQKey(a, q);
    const t0 = Date.now();
    const r = await measureNeb({ kFrame: 1, q, envScale: a.envScale, keepR: a.keepR, steps: NEB_STEPS });
    out.meta.timings[`scoringRun:${k}`] = (Date.now() - t0) / 1000;
    const last = series[k].samples[series[k].samples.length - 1];
    scCmp.push({ label: `採点器 measureNeb vs 時間分解終端 ${k}`,
      step: last.step,
      meanRIdentical: r.envelope.meanR === last.bandMeanR,
      keepFracIdentical: r.envelope.keepFrac === last.bandKeepFrac,
      nIdentical: r.envelope.n === last.bandN && r.n === series[k].n,
      nanIdentical: r.nan === series[k].nan,
      identical: r.envelope.meanR === last.bandMeanR && r.envelope.keepFrac === last.bandKeepFrac &&
        r.envelope.n === last.bandN && r.n === series[k].n && r.nan === series[k].nan,
      scoring: { meanR: r.envelope.meanR, keepFrac: r.envelope.keepFrac, n: r.envelope.n,
        loss: 1 - r.envelope.keepFrac, nan: r.nan, clampV: r.clampV, clampS: r.clampS },
      timeSeriesEnd: { bandMeanR: last.bandMeanR, bandKeepFrac: last.bandKeepFrac, bandN: last.bandN,
        nan: series[k].nan, clampV: series[k].clampV, clampS: series[k].clampS } });
  }
  out.checks.sameRunAsScoring = {
    question: '**時間分解走行が採点窓と同一の走行か**(採点器 measureNeb を同一設定・同一步数で' +
      '回した終端の帯量が、時間分解記録の終端標本と bit 一致するか)',
    method: '時間分解走行の各標本は measureNeb の band() と同一定義(フィルタ無し・帯全体)の ' +
      'bandMeanR / bandKeepFrac / bandN も記録している。採点器の envelope.meanR / keepFrac / n と' +
      '厳密比較する。一致すれば「記録が力学へ干渉していない」ことと「窓が同一」であることの両方が' +
      '同時に示される',
    comparisons: scCmp, nCompared: scCmp.length, nIdentical: scCmp.filter(e => e.identical).length,
    allIdentical: scCmp.length ? scCmp.every(e => e.identical) : null };
  log(`  採点器との終端 bit 一致(記録が力学に干渉していない証拠): ${out.checks.sameRunAsScoring.nIdentical}/${out.checks.sameRunAsScoring.nCompared}`);
}

// ---- ④′ 従来対象 index.html との同一性(記述・判定外)------------------------------------------
if (doSec('probe') && doSec('series') && ALT_SHA_NOW !== null && ALT_SHA_NOW !== TARGET_SHA_NOW) {
  const altPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  altPage.on('pageerror', (e) => console.log('PAGEERROR(alt):', e.message));
  await altPage.goto(ALT_INDEX);
  await altPage.waitForFunction(() => window.HP && HP.sim);
  const altProbe = nebDragProbeOn(altPage);
  const altSeries = nebDragTimeSeriesOn(altPage);
  const acmp = [], scmp = [], altWindowMeans = {};
  for (const a of NEB_ARMS) for (const q of PROBE_QS) {
    const k = armQKey(a, q);
    const pr = await altProbe(q, a.envScale);
    acmp.push({ label: `t=0+ プローブ ${k}`, identical: dropRowsJ(pr) === dropRowsJ(dragProbes[k]) });
    const ts = await altSeries({ q, envScale: a.envScale, keepR: a.keepR, steps: NEB_STEPS,
      sampleEvery: SAMPLE_EVERY, tZeroStep: T_ZERO_STEP, detailSteps: DETAIL_STEPS });
    const wm = windowMeansOf(ts);
    altWindowMeans[k] = { primary: wm.primary, tZero: wm.tZero,
      samplesSha256: canonSha(ts.samples) };
    scmp.push({ label: `時間分解記録 ${k}`,
      samplesIdentical: canonSha(ts.samples) === canonSha(series[k].samples),
      windowMeanIdentical: wm.primary === windowMeans[k].primary,
      identical: canonSha(ts.samples) === canonSha(series[k].samples) &&
        wm.primary === windowMeans[k].primary });
  }
  await altPage.close();
  out.checks.targetEquivalence = {
    question: `本便の対象(${TARGET})と従来対象(${ALT_TARGET})が、本便の測定量について bit 同一か`,
    targetSha256: TARGET_SHA_NOW, altSha256: ALT_SHA_NOW, filesIdentical: false,
    probeComparisons: acmp, seriesComparisons: scmp,
    nCompared: acmp.length + scmp.length,
    nIdentical: acmp.filter(e => e.identical).length + scmp.filter(e => e.identical).length,
    allIdentical: [...acmp, ...scmp].every(e => e.identical),
    altWindowMeans,
    note: 'HTML の SHA は違う(beta は UI 等が別実装)。物理エンジンの当該経路が同一であることを' +
      '**測定値の bit 一致**で示す。従来対象の生標本は JSON 肥大を避けるため収載せず、' +
      '正準化 SHA-256 と窓平均だけを残す。**記述・判定外**' };
  log(`  従来対象 ${ALT_TARGET} との測定値 bit 一致: ${out.checks.targetEquivalence.nIdentical}/${out.checks.targetEquivalence.nCompared}`);
} else if (doSec('probe') && doSec('series')) {
  out.checks.targetEquivalence = {
    question: `本便の対象(${TARGET})と従来対象(${ALT_TARGET})が同一実体か`,
    targetSha256: TARGET_SHA_NOW, altSha256: ALT_SHA_NOW,
    filesIdentical: ALT_SHA_NOW === TARGET_SHA_NOW,
    probeComparisons: [], seriesComparisons: [], nCompared: 0, nIdentical: 0, allIdentical: null,
    note: 'HTML の SHA が一致(または従来対象が存在しない)ため、測定値の再走行照合は行っていない' };
}

// ---- ⑤ 対照(kFrame=0 × kRep=0 の bit 一致 — 記述。窓ではない)---------------------------------
if (doSec('ctl')) {
  const ctl = {};
  log(`\n===== ⑤ 対照 / 🐚 kFrame=0 × kRep=0(bit 一致対照 — 記述)=====`);
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
      '第168/174便との bit 一致照合を通じてエンジン同一性の証拠を兼ねる' };
}
out.meta.stage = 'measured';

// ======================================= 振幅解・予測 =======================================
// ---- ⑥ 窓平均4点最小二乗・t=0+ 対照解・2点部分集合(6組)・予測 ---------------------------------
const SUBSET_PAIRS = [];
for (let i = 0; i < PROBE_QS.length; i++) for (let j = i + 1; j < PROBE_QS.length; j++)
  SUBSET_PAIRS.push([i, j]);
const subsetKey = (pair) => `${PROBE_QS[pair[0]].toFixed(2)}|${PROBE_QS[pair[1]].toFixed(2)}`;
const WAVE158_SUBSET_KEY = `${WAVE158_QS[0].toFixed(2)}|${WAVE158_QS[1].toFixed(2)}`;
const ALT_DEFS = ['withTZero', 'trapezoid', 'retainedOnly', 'firstHalf', 'secondHalf', 'median'];

const amplitudes = { windowMean: {}, tZero: {}, twoPointSubsetsWindow: {}, twoPointSubsetsTZero: {},
  wave174: {}, wave158: {}, comparison: {}, alternativeDefinitions: {}, refreshedKernels: {} };
let haveAmps = false;
if (doSec('series') && Object.keys(windowMeans).length === NEB_ARMS.length * PROBE_QS.length) {
  haveAmps = true;
  const ysWindow = (a) => PROBE_QS.map(q => windowMeans[armQKey(a, q)].primary);
  const ysTZero = (a) => PROBE_QS.map(q => windowMeans[armQKey(a, q)].tZero);
  for (const a of NEB_ARMS) {
    const K = kernelsOf(a);
    const yW = ysWindow(a), yT = ysTZero(a);
    const fitW = fitTwoTermLSQ(K.xb, K.xc, PROBE_QS, yW);
    const fitT = fitTwoTermLSQ(K.xb, K.xc, PROBE_QS, yT);
    const scaledW = fitTwoTermLSQScaled(K.xb, K.xc, PROBE_QS, yW);
    amplitudes.windowMean[a.key] = { armKey: a.key, envScale: a.envScale, keepR: a.keepR, kernels: K,
      omegaBarPerQ: PROBE_QS.map((q, i) => ({ q, windowMeanOmegaDrag: yW[i], tZeroOmegaDrag: yT[i],
        ratioTZeroOverWindow: yT[i] / yW[i], nUniformSamples: windowMeans[armQKey(a, q)].nUniform,
        endKeepFrac: windowMeans[armQKey(a, q)].endKeepFrac })),
      ...fitW,
      scaledCrossCheck: { ...scaledW,
        relDiffAmplitudeBase: relDiff(fitW.amplitudeBase, scaledW.amplitudeBase),
        relDiffAmplitudeCore: relDiff(fitW.amplitudeCore, scaledW.amplitudeCore),
        note: '列を最大値で正規化してから解いた同値解。**記述のみ・判定外**' },
      positiveAmplitudes: fitW.amplitudeBase > 0 && fitW.amplitudeCore > 0,
      caveat: '**平均場近似のパラメータ**であってエンジン内部の量そのものではない' +
        '(第158便 zw2.perScale.*.separation.caveat と同じ限界)' };
    amplitudes.tZero[a.key] = { armKey: a.key, envScale: a.envScale, kernels: K, ...fitT,
      positiveAmplitudes: fitT.amplitudeBase > 0 && fitT.amplitudeCore > 0,
      note: '**第174便と同一入力(t=0+)・同一解法の対照解**。XCHECK がこれと第174便収載値の ' +
        'bit 一致を要求する' };
    const subsW = {}, subsT = {};
    for (const pair of SUBSET_PAIRS) {
      const [i, j] = pair, kk = subsetKey(pair);
      subsW[kk] = { qs: [PROBE_QS[i], PROBE_QS[j]], omegaBar: [yW[i], yW[j]],
        ...separateTwoTerm(K.xb, K.xc, PROBE_QS[i], PROBE_QS[j], yW[i], yW[j]),
        isWave158Subset: kk === WAVE158_SUBSET_KEY };
      subsT[kk] = { qs: [PROBE_QS[i], PROBE_QS[j]], omegaBar: [yT[i], yT[j]],
        ...separateTwoTerm(K.xb, K.xc, PROBE_QS[i], PROBE_QS[j], yT[i], yT[j]),
        isWave158Subset: kk === WAVE158_SUBSET_KEY };
    }
    amplitudes.twoPointSubsetsWindow[a.key] = subsW;
    amplitudes.twoPointSubsetsTZero[a.key] = subsT;
    amplitudes.wave174[a.key] = {
      amplitudeBase: CS8.amplitudes.fourPoint[a.key].amplitudeBase,
      amplitudeCore: CS8.amplitudes.fourPoint[a.key].amplitudeCore,
      determinant: CS8.amplitudes.fourPoint[a.key].determinant,
      source: `coreshell8-results.json: amplitudes.fourPoint.${a.key}` };
    amplitudes.wave158[a.key] = {
      amplitudeBase: CS5.zw2.perScale[`env${a.envScale}`].separation.amplitudeBase,
      amplitudeCore: CS5.zw2.perScale[`env${a.envScale}`].separation.amplitudeCore,
      determinant: CS5.zw2.perScale[`env${a.envScale}`].separation.determinant,
      source: `coreshell5-results.json: zw2.perScale.env${a.envScale}.separation` };
    amplitudes.comparison[a.key] = {
      windowMean: { base: fitW.amplitudeBase, core: fitW.amplitudeCore },
      tZeroFourPoint: { base: fitT.amplitudeBase, core: fitT.amplitudeCore },
      wave174FourPoint: { base: amplitudes.wave174[a.key].amplitudeBase,
        core: amplitudes.wave174[a.key].amplitudeCore },
      ratioWindowOverTZero: { base: fitW.amplitudeBase / fitT.amplitudeBase,
        core: fitW.amplitudeCore / fitT.amplitudeCore },
      relDiffTZeroVsWave174: { base: relDiff(fitT.amplitudeBase, amplitudes.wave174[a.key].amplitudeBase),
        core: relDiff(fitT.amplitudeCore, amplitudes.wave174[a.key].amplitudeCore) },
      note: '**新旧比較**(窓平均 vs t=0+)。GW2 の判定はこの比ではなく予測と実測の |差| で行う' };
    // 併記 (e): 代替定義それぞれの4点振幅
    amplitudes.alternativeDefinitions[a.key] = Object.fromEntries(ALT_DEFS.map(d => {
      const ys = PROBE_QS.map(q => windowMeans[armQKey(a, q)][d]);
      if (ys.some(v => v === null || !Number.isFinite(v))) return [d, { available: false }];
      const f = fitTwoTermLSQ(K.xb, K.xc, PROBE_QS, ys);
      return [d, { available: true, omegaBar: ys, amplitudeBase: f.amplitudeBase,
        amplitudeCore: f.amplitudeCore, maxAbsRelativeResidual: f.maxAbsRelativeResidual,
        rmsRelativeResidual: f.rmsRelativeResidual }];
    }));
    // 併記 (f): 核を窓平均の r̄・R̄ から取り直した版(第158便規約に倣い q=1.5 アームの窓平均を採る)
    const w15 = windowMeans[armQKey(a, 1.5)];
    const rBarW = w15.envMeanRWindow, RbarW = w15.RbarClumpWindow, Rc = K.Rc;
    const xbW = RbarW / (RbarW + rBarW), xcW = Rc / (Rc + rBarW);
    const fitK = fitTwoTermLSQ(xbW, xcW, PROBE_QS, yW);
    amplitudes.refreshedKernels[a.key] = { xb: xbW, xc: xcW, rBarWindow: rBarW, RbarWindow: RbarW,
      Rc, rBarFixed: K.rBar, RbarFixed: K.Rbar, xbFixed: K.xb, xcFixed: K.xc,
      envMeanRWindowPerQ: Object.fromEntries(PROBE_QS.map(q =>
        [tagQ(q), windowMeans[armQKey(a, q)].envMeanRWindow])),
      amplitudeBase: fitK.amplitudeBase, amplitudeCore: fitK.amplitudeCore,
      maxAbsRelativeResidual: fitK.maxAbsRelativeResidual,
      note: '**併記 (f)・判定外**。主定義では核を第158便収載値に固定している(レバーを一つに保つため)。' +
        'これは「時間軸と核を同時に動かしたら」の記述であり、r̄ は第158便規約に倣って q=1.5 アームの' +
        '窓平均 envMeanR を採る' };
  }
  amplitudes.subsetPairs = SUBSET_PAIRS.map(subsetKey);
  amplitudes.method = PRE_REGISTERED.GW2.solutionMethod;
  amplitudes.kernelsHeldFixedNote = LIMITS.kernelsHeldFixed;
  out.amplitudes = amplitudes;
}

// 予測(窓平均振幅 + 精細アンカー)
const predBlock = { available: false };
if (haveAmps && ANCHOR.q50 !== null && ANCHOR.q50 !== undefined) {
  const K = (key) => kernelsOf(NEB_ARMS.find(a => a.key === key));
  const pW = (key) => ({ ...K(key), Ab: amplitudes.windowMean[key].amplitudeBase,
    Ac: amplitudes.windowMean[key].amplitudeCore });
  const pT = (key) => ({ ...K(key), Ab: amplitudes.tZero[key].amplitudeBase,
    Ac: amplitudes.tZero[key].amplitudeCore });
  const REF = NEB_ANCHOR_KEY, VAR = NEB_ARMS.find(a => a.key !== NEB_ANCHOR_KEY).key;
  const omegaCritWindow = omegaDragNeb(pW(REF), ANCHOR.q50);
  const omegaCritTZero = omegaDragNeb(pT(REF), ANCHOR.q50);

  const arms = [];
  for (const a of NEB_ARMS) {
    const p = pW(a.key);
    const sol = solveMonotoneDecreasing((q) => omegaDragNeb(p, q), omegaCritWindow);
    const mono = (() => {
      const gs = []; for (let q = 0.05; q <= 8.0001; q += 0.05) gs.push(Math.round(q * 1e6) / 1e6);
      const vs = gs.map(q => omegaDragNeb(p, q));
      let ok = true; for (let i = 1; i < vs.length; i++) if (!(vs[i] <= vs[i - 1])) { ok = false; break; }
      return { gridStep: 0.05, monotoneDecreasing: ok };
    })();
    arms.push({ armKey: a.key, label: a.label, group: a.group, envScale: a.envScale, keepR: a.keepR,
      isAnchorArm: a.key === REF, judgedByGW2: a.key !== REF,
      anchorRecoveryNote: a.key === REF
        ? '**このアームはアンカー構成そのものなので 2項複合予測は恒等的にアンカー値になる**。' +
          'GW2 の判定には使わず、恒等性の自己点検としてのみ収載する'
        : '**アンカーに使っていない構成**。GW2 の判定対象はこのアームである',
      kernels: { xBase: p.xb, xCore: p.xc, kernelRadiusBase: p.Rbar, kernelRadiusCore: p.Rc,
        rBar: p.rBar },
      amplitudesWindowMean: { base: p.Ab, core: p.Ac },
      amplitudesTZero: { base: pT(a.key).Ab, core: pT(a.key).Ac },
      predictedQ50WindowMean: sol.q,
      predictedQ50TZero: solveMonotoneDecreasing((q) => omegaDragNeb(pT(a.key), q), omegaCritTZero).q,
      solver: { bracketed: sol.bracketed, residual: sol.residual ?? null,
        fAtLo: sol.fAtLo, fAtHi: sol.fAtHi, note: sol.note || null },
      monotonicity: mono,
      extrapolationNote: sol.q === null ? null
        : (sol.q >= PROBE_QS[0] && sol.q <= PROBE_QS[PROBE_QS.length - 1]
          ? `予測 q₅₀ はプローブ区間 [${PROBE_QS[0]}, ${PROBE_QS[PROBE_QS.length - 1]}] の**内側**(内挿)`
          : `予測 q₅₀ はプローブ区間 [${PROBE_QS[0]}, ${PROBE_QS[PROBE_QS.length - 1]}] の**外側**(外挿)`) });
  }

  // 併記 (d): 2×2 分解(P00 = t0/t0 = 第174便の予測・P11 = 窓/窓 = 本便の予測)
  const predWith = (refAmp, varAmp) => {
    const rp = refAmp === 'w' ? pW(REF) : pT(REF);
    const vp = varAmp === 'w' ? pW(VAR) : pT(VAR);
    const crit = omegaDragNeb(rp, ANCHOR.q50);
    const s = solveMonotoneDecreasing((q) => omegaDragNeb(vp, q), crit);
    return { omegaCrit: crit, q: s.q, bracketed: s.bracketed };
  };
  const P00 = predWith('t', 't'), P10 = predWith('w', 't'), P01 = predWith('t', 'w'),
    P11 = predWith('w', 'w');
  const decomposition = {
    note: '**併記 (d)・判定外**。予測の移動を「アンカー側 env×1 の振幅が動いた分(= Ω_crit の変化)」' +
      'と「判定アーム env×2 の振幅が動いた分」と「交互作用」へ 2×2 で分解する',
    legend: 'P{ref}{var}: ref = Ω_crit を決める env×1 の振幅、var = 判定アーム env×2 の振幅。' +
      't = t=0+ 4点解、w = 窓平均4点解。P_tt が第174便の予測、P_ww が本便の予測',
    P_tt: P00, P_wt: P10, P_tw: P01, P_ww: P11,
    deltaFromOmegaCritOnly: (P10.q === null || P00.q === null) ? null : P10.q - P00.q,
    deltaFromVarAmplitudeOnly: (P01.q === null || P00.q === null) ? null : P01.q - P00.q,
    interaction: [P11.q, P10.q, P01.q, P00.q].some(v => v === null) ? null
      : P11.q - P10.q - P01.q + P00.q,
    totalShift: (P11.q === null || P00.q === null) ? null : P11.q - P00.q,
    omegaCritTZero, omegaCritWindow,
    omegaCritRelativeShift: relDiff(omegaCritWindow, omegaCritTZero),
    omegaCritRatioWindowOverTZero: omegaCritWindow / omegaCritTZero,
  };

  // 併記 (c): 逆向きアンカー(env×2 実測をアンカーに env×1 を予測)
  const reverse = (which) => {
    const rp = which === 'w' ? pW(VAR) : pT(VAR);
    const vp = which === 'w' ? pW(REF) : pT(REF);
    const crit = omegaDragNeb(rp, TARGETQ.q50Measured);
    const s = solveMonotoneDecreasing((q) => omegaDragNeb(vp, q), crit);
    const meas = ANCHOR.q50;
    return { omegaCrit: crit, predictedQ50: s.q, bracketed: s.bracketed, measuredQ50: meas,
      signedDiff: s.q === null ? null : meas - s.q, absDiff: s.q === null ? null : Math.abs(meas - s.q) };
  };
  const reverseAnchor = { note: '**併記 (c)・判定外**。env×2 実測 q₅₀ をアンカーにして env×1 を' +
      '予測し、env×1 実測と突き合わせる。順方向とは独立な整合性の目安である',
    windowMean: reverse('w'), tZero: reverse('t') };

  // 併記 (e): 窓平均の代替定義それぞれで立てた予測
  const altPredictions = Object.fromEntries(ALT_DEFS.map(d => {
    const rA = amplitudes.alternativeDefinitions[REF][d], vA = amplitudes.alternativeDefinitions[VAR][d];
    if (!rA.available || !vA.available) return [d, { available: false }];
    const rp = { ...K(REF), Ab: rA.amplitudeBase, Ac: rA.amplitudeCore };
    const vp = { ...K(VAR), Ab: vA.amplitudeBase, Ac: vA.amplitudeCore };
    const crit = omegaDragNeb(rp, ANCHOR.q50);
    const s = solveMonotoneDecreasing((q) => omegaDragNeb(vp, q), crit);
    return [d, { available: true, omegaCrit: crit, predictedQ50Env2: s.q, bracketed: s.bracketed,
      absDiffVsMeasured: s.q === null ? null : Math.abs(TARGETQ.q50Measured - s.q) }];
  }));

  // 併記 (f): 核を窓平均から取り直した版の予測
  const rk = (key) => ({ xb: amplitudes.refreshedKernels[key].xb, xc: amplitudes.refreshedKernels[key].xc,
    Ab: amplitudes.refreshedKernels[key].amplitudeBase, Ac: amplitudes.refreshedKernels[key].amplitudeCore });
  const rkCrit = omegaDragNeb(rk(REF), ANCHOR.q50);
  const rkSol = solveMonotoneDecreasing((q) => omegaDragNeb(rk(VAR), q), rkCrit);
  const refreshedKernelPrediction = { note: '**併記 (f)・判定外**。核も窓平均から取り直した版',
    omegaCrit: rkCrit, predictedQ50Env2: rkSol.q, bracketed: rkSol.bracketed,
    absDiffVsMeasured: rkSol.q === null ? null : Math.abs(TARGETQ.q50Measured - rkSol.q),
    kernels: { env1: amplitudes.refreshedKernels[REF], env2: amplitudes.refreshedKernels[VAR] } };

  // 併記 (h): 2点部分集合6組それぞれの窓平均振幅→予測
  const subsetPreds = [];
  for (const pair of SUBSET_PAIRS) {
    const kk = subsetKey(pair);
    const sRef = amplitudes.twoPointSubsetsWindow[REF][kk];
    const Kref = K(REF);
    const crit = omegaDragNeb({ xb: Kref.xb, xc: Kref.xc, Ab: sRef.amplitudeBase,
      Ac: sRef.amplitudeCore }, ANCHOR.q50);
    const row = { subset: kk, qs: sRef.qs, omegaCrit: crit,
      isWave158Subset: kk === WAVE158_SUBSET_KEY, arms: {} };
    for (const a of NEB_ARMS) {
      const s = amplitudes.twoPointSubsetsWindow[a.key][kk];
      const Ka = K(a.key);
      const sol = solveMonotoneDecreasing((q) => omegaDragNeb(
        { xb: Ka.xb, xc: Ka.xc, Ab: s.amplitudeBase, Ac: s.amplitudeCore }, q), crit);
      row.arms[a.key] = { amplitudeBase: s.amplitudeBase, amplitudeCore: s.amplitudeCore,
        predictedQ50: sol.q, bracketed: sol.bracketed };
    }
    subsetPreds.push(row);
  }
  const env2Preds = subsetPreds.map(r => r.arms[VAR].predictedQ50).filter(v => v !== null);

  predBlock.available = true;
  predBlock.declaredBefore = '**判定節より前**に確定し OUT_PATH へ書き出したブロックである(封②)。' +
    '**本便には hold-out が存在しないので、封②が担保するのは「判定節で予測を書き換えていない」' +
    'ことだけである**(preRegistered.honestFraming で実測前に宣言済み)';
  predBlock.anchor = ANCHOR;
  predBlock.comparisonTarget = TARGETQ;
  predBlock.omegaCrit = omegaCritWindow;
  predBlock.omegaCritTZero = omegaCritTZero;
  predBlock.omegaCritWave174 = CS8.predictedFromRefreshedAmplitudes.omegaCrit;
  predBlock.arms = arms;
  predBlock.decomposition = decomposition;
  predBlock.reverseAnchor = reverseAnchor;
  predBlock.alternativeDefinitionPredictions = altPredictions;
  predBlock.refreshedKernelPrediction = refreshedKernelPrediction;
  predBlock.subsetPredictions = { pairs: subsetPreds,
    env2Spread: env2Preds.length ? { n: env2Preds.length, min: Math.min(...env2Preds),
      max: Math.max(...env2Preds), spread: Math.max(...env2Preds) - Math.min(...env2Preds),
      mean: arithMean(env2Preds) } : null,
    note: '**併記 (h)**: q 4点から2点を選ぶ6通りの部分集合それぞれで窓平均振幅を解き、同じ部分集合' +
      'どうしで Ω_crit と予測を立てた。ばらつきは統計誤差ではなく **2項近似の食い違いの大きさ**である' };
  predBlock.formula = '(T1)+(T5′): Ω̄_drag(q) = A_b·x_b^q + A_c·x_c^q を Ω_crit = Ω̄̄_drag_env1(q₅₀_ref) に' +
    '等しくする q を決定論的二分法で解く。振幅は本便の**窓平均**4点最小二乗解、核は第158便収載値(固定)';
  out.predictedFromWindowMeanAmplitudes = predBlock;
  out.predictionIntegrity = {
    canonicalization: 'predictedFromWindowMeanAmplitudes を再帰キー整列した JSON の SHA-256',
    sha256AtPredictionTime: canonSha(predBlock),
    writtenToDiskBeforeVerdict: false, sha256AtFinalWrite: null, unchanged: null,
    holdOutNote: '**本便に hold-out は存在しない**。この封は前向き性の証拠ではなく、' +
      '判定節での事後改変が無いことの機械証拠である' };
  out.meta.stage = 'prediction-sealed-before-verdict';
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));
  out.predictionIntegrity.writtenToDiskBeforeVerdict = true;
  log(`\n===== ⑥ 封②(窓平均振幅の解と予測の固定)=====`);
  log(`  Ω_crit(窓平均)=${omegaCritWindow.toExponential(9)} / t=0+ =${omegaCritTZero.toExponential(9)} 比=${fmt(decomposition.omegaCritRatioWindowOverTZero, 6)}`);
  for (const a of arms)
    log(`  ${a.armKey.padEnd(6)} A_b=${fmt(a.amplitudesWindowMean.base, 6)}(t=0+ ${fmt(a.amplitudesTZero.base, 6)}) A_c=${fmt(a.amplitudesWindowMean.core, 6)}(t=0+ ${fmt(a.amplitudesTZero.core, 6)}) → 予測 q₅₀=${fmt(a.predictedQ50WindowMean, 6)}(t=0+ 版 ${fmt(a.predictedQ50TZero, 6)})`);
  log(`  → 封② を ${path.relative(ROOT, OUT_PATH)} へ書き出した(sha256 ${out.predictionIntegrity.sha256AtPredictionTime.slice(0, 16)}…)`);
}
out.meta.stage = 'complete';

// ======================================= 集計・判定 =========================================
// 事前登録した規則をそのまま適用する(実測後に規則を変えない)。
const dynKeysNeb = ['clump', 'envelope', 'n', 'nan', 'clampV', 'clampS'];
const pickJ = (o, ks) => { const r = {}; for (const k of ks) r[k] = o[k]; return JSON.stringify(r); };
const fullJ = (o) => { const r = { ...o }; delete r.cfg; delete r.tag; return JSON.stringify(r); };

// ---- GW1(記述): 時間プロファイルと t0/窓平均比 -----------------------------------------------
out.gw1 = { rule: PRE_REGISTERED.GW1, available: false };
if (haveAmps) {
  const profiles = [];
  for (const a of NEB_ARMS) for (const q of PROBE_QS) {
    const k = armQKey(a, q);
    const ts = series[k], wm = windowMeans[k];
    const uni = uniformSamples(ts);
    const y = uni.map(s => s.meanOmegaDrag);
    let monotone = true;
    for (let i = 1; i < y.length; i++) if (!(y[i] <= y[i - 1])) { monotone = false; break; }
    const halfLevel = wm.tZero / 2;
    const halfSample = uni.find(s => s.meanOmegaDrag < halfLevel) || null;
    profiles.push({ armKey: a.key, envScale: a.envScale, q, keepR: a.keepR,
      tZeroOmegaDrag: wm.tZero, windowMeanOmegaDrag: wm.primary,
      ratioTZeroOverWindow: wm.ratioTZeroOverPrimary,
      ratioWindowOverTZero: wm.ratioPrimaryOverTZero,
      minOmegaDrag: wm.min, maxOmegaDrag: wm.max,
      firstHalfMean: wm.firstHalf, secondHalfMean: wm.secondHalf,
      secondOverFirstHalf: wm.secondHalf / wm.firstHalf,
      monotoneDecreasingOnUniformGrid: monotone,
      halfLifeStep: halfSample ? halfSample.step : null,
      halfLifeT: halfSample ? halfSample.t : null,
      endStepOmegaDrag: uni[uni.length - 1].meanOmegaDrag,
      endKeepFrac: wm.endKeepFrac, endLoss: 1 - wm.endKeepFrac,
      envMeanRTZero: uni.length ? (tZeroSample(ts) || {}).envMeanR : null,
      envMeanRWindow: wm.envMeanRWindow, envMeanREnd: uni[uni.length - 1].envMeanR,
      RbarClumpTZero: (tZeroSample(ts) || {}).RbarClump, RbarClumpWindow: wm.RbarClumpWindow,
      nUniformSamples: wm.nUniform });
  }
  const byArm = Object.fromEntries(NEB_ARMS.map(a => {
    const rows = profiles.filter(p => p.armKey === a.key);
    const rs = rows.map(p => p.ratioTZeroOverWindow);
    return [a.key, { ratioTZeroOverWindow: Object.fromEntries(rows.map(p => [tagQ(p.q), p.ratioTZeroOverWindow])),
      min: Math.min(...rs), max: Math.max(...rs), spread: Math.max(...rs) - Math.min(...rs),
      mean: arithMean(rs),
      qDependence: '比が q とともに増える(= 大 q ほど窓平均が相対的に強く落ちる)なら +、' +
        '減るなら −。符号は monotoneInQ に記録する',
      monotoneInQ: (() => { const v = rows.map(p => p.ratioTZeroOverWindow);
        let inc = true, dec = true;
        for (let i = 1; i < v.length; i++) { if (!(v[i] >= v[i - 1])) inc = false; if (!(v[i] <= v[i - 1])) dec = false; }
        return inc ? 'increasing' : (dec ? 'decreasing' : 'non-monotone'); })() }];
  }));
  const p = out.predictedFromWindowMeanAmplitudes;
  const shift = (p && p.available && p.arms) ? (() => {
    const arm = p.arms.find(x => x.armKey !== NEB_ANCHOR_KEY);
    return arm && arm.predictedQ50WindowMean !== null && arm.predictedQ50TZero !== null
      ? arm.predictedQ50WindowMean - arm.predictedQ50TZero : null;
  })() : null;
  out.gw1 = { rule: PRE_REGISTERED.GW1, available: true, profiles, ratioSummaryByArm: byArm,
    signConsistency: {
      wave174SignedDiff: TARGETQ.wave174SignedDiff,
      wave174Interpretation: TARGETQ.wave174SignedDiff !== null && TARGETQ.wave174SignedDiff > 0
        ? '実測 − 予測 > 0 = **第174便の予測は系統的に低い**' : '実測 − 予測 ≤ 0 = 予測は低くない',
      predictionShiftFromTZeroToWindow: shift,
      movesUpward: shift === null ? null : shift > 0,
      consistentWithLowPredictionSign: (shift === null || TARGETQ.wave174SignedDiff === null) ? null
        : (shift > 0) === (TARGETQ.wave174SignedDiff > 0),
      note: '**記述のみ**。窓平均化が予測を上げる向きに効けば第174便の残差の符号と整合する。' +
        '整合しても「残差を説明できた」ことにはならない — その量的判定は GW2 が行う' },
    note: '**判定を伴わない記述窓**である' };
}

// ---- GW2(主窓): 窓平均補正予測 vs coreshell7 env×2 実測 ---------------------------------------
out.gw2 = { rule: PRE_REGISTERED.GW2, comparisons: [], verdict: null, coRecorded: {} };
if (predBlock.available) {
  const rows = [];
  for (const a of predBlock.arms) {
    const measured = a.armKey === NEB_ANCHOR_KEY ? ANCHOR.q50 : TARGETQ.q50Measured;
    const pred = a.predictedQ50WindowMean;
    const abs = pred === null ? null : Math.abs(measured - pred);
    const prior = TARGETQ.wave174AbsDiff;
    const within = abs === null ? null : abs <= PRE_REGISTERED.GW2.tolerance;
    const improved = (abs === null || prior === null) ? null : abs < prior;
    rows.push({ armKey: a.armKey, label: a.label, group: a.group,
      isAnchorArm: a.isAnchorArm, judgedByGW2: a.judgedByGW2,
      anchorRecoveryNote: a.anchorRecoveryNote,
      kernels: a.kernels,
      amplitudesWindowMean: a.amplitudesWindowMean, amplitudesTZero: a.amplitudesTZero,
      predictedQ50WindowMean: pred, predictedQ50TZero: a.predictedQ50TZero,
      wave174PredictedQ50: a.armKey === 'env2' ? (cs8Env2 || {}).predictedQ50FourPoint
        : (cs8Env1 || {}).predictedQ50FourPoint,
      measuredQ50: measured,
      measuredSource: a.armKey === NEB_ANCHOR_KEY
        ? 'coreshell7-results.json: q50.summary.env1.q50' : TARGETQ.source,
      signedDiff: pred === null ? null : measured - pred,
      absDiff: abs,
      tolerance: PRE_REGISTERED.GW2.tolerance, withinTolerance: within,
      priorAbsDiffWave174: prior,
      improvedOverWave174: improved,
      improvementAmount: (abs === null || prior === null) ? null : prior - abs,
      monotonicity: a.monotonicity, extrapolationNote: a.extrapolationNote,
      solverBracketed: a.solver.bracketed,
      result: !a.judgedByGW2 ? 'NOT-JUDGED'
        : (pred === null || !a.solver.bracketed ? 'INCONCLUSIVE'
          : ((within && improved) ? 'PASS' : 'FAIL')),
      resultReason: !a.judgedByGW2
        ? 'アンカー構成(予測は恒等)なので GW2 の判定対象外 — 恒等性の自己点検として収載する'
        : (pred === null || !a.solver.bracketed ? '二分法が固定区間で解を挟めなかった(値を捏造しない)'
          : (within && improved ? null
            : `|差|≤${PRE_REGISTERED.GW2.tolerance} = ${within} / 第174便より改善 = ${improved}` +
              '(**両条件の論理積**が PASS の要件 — 実測前に固定)')) });
  }
  const judged = rows.filter(r => r.judgedByGW2);
  out.gw2.comparisons = rows;
  out.gw2.verdict = { window: PRE_REGISTERED.GW2.window, tolerance: PRE_REGISTERED.GW2.tolerance,
    improvementBaseline: TARGETQ.wave174AbsDiff,
    judgedArms: judged.map(r => r.armKey),
    result: judged.some(r => r.result === 'INCONCLUSIVE') ? 'INCONCLUSIVE'
      : (judged.every(r => r.result === 'PASS') ? 'PASS' : 'FAIL'),
    perArm: judged.map(r => ({ armKey: r.armKey, predictedQ50WindowMean: r.predictedQ50WindowMean,
      measured: r.measuredQ50, absDiff: r.absDiff, withinTolerance: r.withinTolerance,
      improvedOverWave174: r.improvedOverWave174, result: r.result })),
    note: '判定対象は env×2 の1アームのみ(env×1 は恒等予測なので NOT-JUDGED)。' +
      '**hold-out は存在しない** — PASS を「未知を当てた」証拠として読んではならない。' +
      '**FAIL も収載する**(「t=0+ 系統では説明できない」という決定的情報である)' };

  const env2Row = judged[0] || null;
  out.gw2.coRecorded = {
    a_looser0p10: { item: '(a) より緩い目安 ≤0.10(第174便 FW1 の許容)にも入るか(**記述のみ**)',
      threshold: 0.10,
      arms: rows.map(r => ({ armKey: r.armKey, absDiff: r.absDiff,
        within0p10: r.absDiff === null ? null : r.absDiff <= 0.10 })) },
    b_changeVsWave174: { item: '(b) 第174便の残差からの変化(符号つき。悪化も収載する)',
      wave174AbsDiff: TARGETQ.wave174AbsDiff,
      thisWaveAbsDiff: env2Row ? env2Row.absDiff : null,
      change: (env2Row && env2Row.absDiff !== null && TARGETQ.wave174AbsDiff !== null)
        ? env2Row.absDiff - TARGETQ.wave174AbsDiff : null,
      improved: env2Row ? env2Row.improvedOverWave174 : null,
      wave174Prediction: TARGETQ.wave174PredictedTZero,
      thisWavePrediction: env2Row ? env2Row.predictedQ50WindowMean : null,
      predictionShift: (env2Row && env2Row.predictedQ50WindowMean !== null &&
        TARGETQ.wave174PredictedTZero !== null)
        ? env2Row.predictedQ50WindowMean - TARGETQ.wave174PredictedTZero : null,
      fractionOfResidualExplained: (env2Row && env2Row.absDiff !== null && TARGETQ.wave174AbsDiff)
        ? (TARGETQ.wave174AbsDiff - env2Row.absDiff) / TARGETQ.wave174AbsDiff : null,
      note: '残差のうち何割が t=0+→窓平均の置き換えで消えたかの目安。**記述のみ**' },
    c_reverseAnchor: { item: '(c) 逆向きアンカー(env×2 実測をアンカーに env×1 を予測)',
      ...predBlock.reverseAnchor },
    d_decomposition: { item: '(d) 旧 t=0+ 予測との差の 2×2 分解', ...predBlock.decomposition },
    e_alternativeDefinitions: { item: '(e) 窓平均の代替定義それぞれの予測(定義依存性)',
      definitions: PRE_REGISTERED.windowMeanDefinition.alternatives,
      predictions: predBlock.alternativeDefinitionPredictions,
      primary: { predictedQ50Env2: env2Row ? env2Row.predictedQ50WindowMean : null,
        absDiffVsMeasured: env2Row ? env2Row.absDiff : null },
      spread: (() => {
        const vs = Object.values(predBlock.alternativeDefinitionPredictions)
          .filter(v => v.available && v.predictedQ50Env2 !== null).map(v => v.predictedQ50Env2);
        const all = env2Row && env2Row.predictedQ50WindowMean !== null
          ? [...vs, env2Row.predictedQ50WindowMean] : vs;
        return all.length ? { n: all.length, min: Math.min(...all), max: Math.max(...all),
          spread: Math.max(...all) - Math.min(...all) } : null;
      })() },
    f_refreshedKernels: { item: '(f) 核も窓平均から取り直した版の予測',
      ...predBlock.refreshedKernelPrediction },
    g_fitResidual: { item: '(g) 4点適合の相対残差(窓平均 vs t=0+ の構造比較)',
      arms: NEB_ARMS.map(a => ({ armKey: a.key,
        windowMean: { relativeResidual: amplitudes.windowMean[a.key].relativeResidual,
          maxAbsRelativeResidual: amplitudes.windowMean[a.key].maxAbsRelativeResidual,
          rmsRelativeResidual: amplitudes.windowMean[a.key].rmsRelativeResidual,
          basisCorrelation: amplitudes.windowMean[a.key].basisCorrelation,
          conditionProxy: amplitudes.windowMean[a.key].conditionProxy,
          scaledPathRelDiff: { base: amplitudes.windowMean[a.key].scaledCrossCheck.relDiffAmplitudeBase,
            core: amplitudes.windowMean[a.key].scaledCrossCheck.relDiffAmplitudeCore } },
        tZero: { relativeResidual: amplitudes.tZero[a.key].relativeResidual,
          maxAbsRelativeResidual: amplitudes.tZero[a.key].maxAbsRelativeResidual,
          rmsRelativeResidual: amplitudes.tZero[a.key].rmsRelativeResidual },
        signPatternWindow: amplitudes.windowMean[a.key].relativeResidual.map(v => v >= 0 ? '+' : '−').join(''),
        signPatternTZero: amplitudes.tZero[a.key].relativeResidual.map(v => v >= 0 ? '+' : '−').join(''),
        signPatternIdentical: amplitudes.windowMean[a.key].relativeResidual.map(v => v >= 0).join() ===
          amplitudes.tZero[a.key].relativeResidual.map(v => v >= 0).join() })),
      note: '第174便は「適合残差は大 q 側で単調一方向」と収載した。窓平均でその構造が変わったかを' +
        '符号パターンと最大相対残差で見る。**記述のみ**' },
    h_subsetSpread: { item: '(h) 2点部分集合6組の窓平均振幅→予測のばらつき',
      pairs: predBlock.subsetPredictions.pairs.map(r => ({ subset: r.subset, qs: r.qs,
        isWave158Subset: r.isWave158Subset,
        env2: r.arms.env2, predictedQ50Env2: r.arms.env2.predictedQ50,
        absDiffVsMeasured: r.arms.env2.predictedQ50 === null ? null
          : Math.abs(TARGETQ.q50Measured - r.arms.env2.predictedQ50) })),
      env2Spread: predBlock.subsetPredictions.env2Spread,
      fourPointPrediction: env2Row ? env2Row.predictedQ50WindowMean : null,
      measured: TARGETQ.q50Measured,
      note: predBlock.subsetPredictions.note },
  };
}

// ---- XCHECK(転記照合): t=0+ 入力なら第158/174便と bit 一致するか -------------------------------
out.xcheck = { rule: PRE_REGISTERED.XCHECK, groups: {}, verdict: null };
{
  const g = {};
  g.i_probeValues = out.checks.probeReproduction || { nCompared: 0, nIdentical: 0, allIdentical: null,
    note: 'プローブ節を実行していない(CS9_ONLY)ため比較できない' };
  g.ii_timeSeriesTZero = out.checks.timeSeriesTZeroMatchesProbe || { nCompared: 0, nIdentical: 0,
    allIdentical: null, note: '時間分解節を実行していないため比較できない' };
  const ampRows = [];
  if (haveAmps) {
    for (const a of NEB_ARMS) {
      const mine = amplitudes.tZero[a.key], theirs = amplitudes.wave174[a.key];
      ampRows.push({ item: `(iii) t=0+ 4点振幅 ${a.key} vs 第174便 amplitudes.fourPoint`,
        bitIdentical: mine.amplitudeBase === theirs.amplitudeBase &&
          mine.amplitudeCore === theirs.amplitudeCore && mine.determinant === theirs.determinant,
        relDiffBase: relDiff(mine.amplitudeBase, theirs.amplitudeBase),
        relDiffCore: relDiff(mine.amplitudeCore, theirs.amplitudeCore),
        mine: { base: mine.amplitudeBase, core: mine.amplitudeCore, det: mine.determinant },
        theirs: { base: theirs.amplitudeBase, core: theirs.amplitudeCore, det: theirs.determinant } });
      const sub = amplitudes.twoPointSubsetsTZero[a.key][WAVE158_SUBSET_KEY];
      const w158 = amplitudes.wave158[a.key];
      ampRows.push({ item: `(iv) t=0+ 2点部分集合{1.5,2.0} ${a.key} vs 第158便 separation`,
        bitIdentical: sub.amplitudeBase === w158.amplitudeBase &&
          sub.amplitudeCore === w158.amplitudeCore && sub.determinant === w158.determinant,
        relDiffBase: relDiff(sub.amplitudeBase, w158.amplitudeBase),
        relDiffCore: relDiff(sub.amplitudeCore, w158.amplitudeCore),
        mine: { base: sub.amplitudeBase, core: sub.amplitudeCore, det: sub.determinant },
        theirs: { base: w158.amplitudeBase, core: w158.amplitudeCore, det: w158.determinant } });
    }
    if (predBlock.available) for (const a of predBlock.arms) {
      const theirs = a.armKey === 'env2' ? (cs8Env2 || {}).predictedQ50FourPoint
        : (cs8Env1 || {}).predictedQ50FourPoint;
      ampRows.push({ item: `(v) t=0+ 振幅による予測 q₅₀ ${a.armKey} vs 第174便`,
        bitIdentical: a.predictedQ50TZero === theirs,
        relDiffBase: relDiff(a.predictedQ50TZero, theirs), relDiffCore: null,
        mine: { predictedQ50TZero: a.predictedQ50TZero }, theirs: { predictedQ50FourPoint: theirs } });
    }
  }
  g.iii_amplitudesAndPrediction = { rows: ampRows, nCompared: ampRows.length,
    nBitIdentical: ampRows.filter(e => e.bitIdentical).length,
    allBitIdentical: ampRows.length ? ampRows.every(e => e.bitIdentical) : null,
    maxRelativeDiff: ampRows.length
      ? Math.max(...ampRows.flatMap(e => [e.relDiffBase, e.relDiffCore].filter(v => v !== null))) : null };
  out.xcheck.groups = g;
  const parts = [g.i_probeValues.vsWave174 ? g.i_probeValues.vsWave174.allIdentical : null,
    g.i_probeValues.vsWave158 ? g.i_probeValues.vsWave158.allIdentical : null,
    g.ii_timeSeriesTZero.allIdentical, g.iii_amplitudesAndPrediction.allBitIdentical];
  out.xcheck.verdict = {
    window: PRE_REGISTERED.XCHECK.window,
    groupResults: { probeVsWave174: parts[0], probeVsWave158: parts[1], timeSeriesTZero: parts[2],
      amplitudesAndPrediction: parts[3] },
    maxRelativeDiff: g.iii_amplitudesAndPrediction.maxRelativeDiff,
    result: parts.some(v => v === null) ? 'INCONCLUSIVE' : (parts.every(v => v === true) ? 'PASS' : 'FAIL'),
    fallbackUsed: false,
    note: '同じ式・同じ核・同じ解法へ t=0+ を入力したときに第174便/第158便と 1 bit も違わない値が' +
      '出ることが、**窓平均で出た違いが時間軸だけに由来する**ことの機械証拠である' };
}

// ---- 対照(記述)・過去便との bit 照合 --------------------------------------------------------
out.controls = { window: null,
  note: '**事前登録窓の外の記述**。kFrame=0 × kRep=0 なら q や Ω_c を振っても外殻の力学は不変のはず',
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
      { wave: '第174便', runs: (CS8.raw && CS8.raw.ctl) ? CS8.raw.ctl.runs : null },
      { wave: '第168便', runs: (CS7.raw && CS7.raw.ctl) ? CS7.raw.ctl.runs : null },
      { wave: '第158便', runs: (CS5.raw && CS5.raw.neb) ? CS5.raw.neb.controls : null },
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
      for (const a of NEB_ARMS) for (const q of WAVE158_QS) {
        const k = armQKey(a, q);
        const mine = dragProbes[k], theirs = CS7.raw.probe.dragProbes[k];
        if (mine && theirs) probeCmp.push({ label: `🐚 t=0+ プローブ ${k} vs 第168便`,
          identical: dropRowsJ(mine) === dropRowsJ(theirs) });
      }
    }
  } catch (e) { out.crossWaveError = String(e && e.message); }
  const roll = (arr) => { const cmp = arr.filter(e => e.identical !== null);
    return { comparisons: arr, nCompared: cmp.length, nIdentical: cmp.filter(e => e.identical).length,
      mismatches: cmp.filter(e => !e.identical).map(e => e.label),
      allIdentical: cmp.length ? cmp.every(e => e.identical) : null }; };
  out.crossWaveCheck = { window: null,
    source: 'tests/out/coreshell{5,7,8}-results.json',
    controlSourcePaths: { 第174便: 'raw.ctl.runs', 第168便: 'raw.ctl.runs', 第158便: 'raw.neb.controls' },
    controlSourceNote: '対照の収載位置は便ごとに違う。第158便の raw.ctl.runs は ⚫blackHole 節の対照で' +
      '**🐚 とは別物**なので、第158便については raw.neb.controls を明示指定して比較している',
    note: '設定が一致する走行の力学フィールド bit 一致。**事前登録窓の外の記述**であり判定には使わない',
    controls: roll(add), probesVsWave168: roll(probeCmp) };
  if (QUICK) out.crossWaveCheck.quickNote = '煙試験(CS9_QUICK)では步数が 1/10 なので bit 一致は成立しない';
}

// ---- GW3: 決定性(2回実行ビット同一)----
{
  const target = { raw: out.raw,
    predictedFromWindowMeanAmplitudes: out.predictedFromWindowMeanAmplitudes || null };
  const mine = JSON.stringify(canonize(target));
  const rec = { canonicalization: PRE_REGISTERED.GW3.canonicalization,
    sha256: sha256(Buffer.from(mine, 'utf8')), bytes: mine.length, reference: null, identical: null };
  const refPath = process.env.CS9_DET_REF;
  if (refPath) {
    const waitSec = Number(process.env.CS9_DET_WAIT_SEC || 0);
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
        predictedFromWindowMeanAmplitudes: other.predictedFromWindowMeanAmplitudes || null }));
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
out.gw3 = { rule: PRE_REGISTERED.GW3, sha256: out.determinism.sha256,
  reference: out.determinism.reference, identical: out.determinism.identical,
  result: out.determinism.identical === null ? 'PENDING(参照なし)'
    : (out.determinism.identical ? 'PASS' : 'FAIL') };

// ---- 封の自己点検(封①・封②が判定後に動いていないこと)----
{
  const nowPre = canonSha(out.preRegistrationBlock);
  out.preRegistrationSeal.sha256AtFinalWrite = nowPre;
  out.preRegistrationSeal.unchanged = (nowPre === out.preRegistrationSeal.sha256AtSealTime);
  if (out.predictedFromWindowMeanAmplitudes && out.predictionIntegrity) {
    const now = canonSha(out.predictedFromWindowMeanAmplitudes);
    out.predictionIntegrity.sha256AtFinalWrite = now;
    out.predictionIntegrity.unchanged = (now === out.predictionIntegrity.sha256AtPredictionTime);
  }
}

out.meta.elapsedSec = (Date.now() - T_START) / 1000;

// ---- 実験マニフェスト(第145便様式)----------------------------------------------------------
out.manifest = await buildManifest({
  root: ROOT, scriptUrl: import.meta.url, page, browser, payload: out,
  target: TARGET,
  experiment: { id: 'coreshell9', wave: 179,
    title: 'コア外殻第9実験 — 🐚 残差の構造対処(**t=0+ 解析値 vs 窓平均引きずりの系統**)。' +
      '採点窓と同一の 3000步走行中に解析的 Ω_drag を時間分解で記録し、窓平均 Ω̄̄_drag(q) から' +
      '平均場2項振幅を解き直して 2項複合予測を立て直す(事前登録窓 GW1 記述(時間プロファイルと ' +
      't0/窓平均比・符号整合)/ GW2 主窓(|予測−実測 1.5300| ≤ 0.05 **かつ** 第174便の 0.040928… より' +
      '改善 — 両条件の論理積)/ XCHECK 転記照合(t=0+ 入力なら第158/174便収載値と bit 一致)/ ' +
      'GW3 決定性。併記 (a) 0.10 目安 (b) 残差変化 (c) 逆向きアンカー (d) 2×2 分解 ' +
      '(e) 窓平均の代替定義 (f) 核の取り直し (g) 適合残差の構造 (h) 2点部分集合の散らばり — 記述)' +
      ' ※**hold-out は存在しない**(preRegistered.honestFraming)。**新規 q₅₀ 掃引なし**。' +
      '**FAIL も収載する**(「t=0+ 系統では説明できない」という決定的情報)',
    command: 'node tests/exp-coreshell9.mjs(節選択 CS9_ONLY=… / 出力先 CS9_OUT=… / ' +
      '決定性参照 CS9_DET_REF=… / 煙試験 CS9_QUICK=1 / 対象変更 QA_TARGET=…)' },
  presets: { mode: 'builtin', ids: ['nebulaShell'],
    modifiedAtRuntime: '時間分解走行と t=0+ プローブは kFrame=1 と 影響範囲指数 q のみを上書きし、' +
      'エンベロープ ring の rIn/rOut に半径倍率 envScale を掛けて build する(**倍率が 1 のときは ' +
      'ring の上書きを省く** = プリセット実値のまま build するので第154/158/168/174便の env×1 走行と ' +
      'build が同一になる)。対照は kFrame=0 / kRep=0 / q / core.omega 倍率を第174便と同一の改変器で' +
      '上書きする。改変内容は各 run.cfg / プローブの cfg に記録済み',
    note: 'seed はプリセット定義値(🐚 20260804)をそのまま使う' },
  numerics: {
    seed: { nebulaShell: 20260804, note: 'プリセット定義値(改変器は seed を触らない)' },
    dt: 0.016,
    timeScale: 'プリセット既定値(ハーネスは sim.step(dt) を直接呼ぶため積分には掛からない)',
    substeps: NOT_APPLICABLE,
    steps: { timeSeries: NEB_STEPS, probes: '1步(t=0+ プローブ = 転記照合用)',
      scoringCrossCheck: NEB_STEPS, controls: CTL_STEPS, quick: QUICK, sweeps: NOT_APPLICABLE },
    window: { timeSeries: `t=0 → t=${(NEB_STEPS * 0.016).toFixed(3)}(validT・採点窓と同一)`,
      windowMean: PRE_REGISTERED.windowMeanDefinition.primary,
      probes: 't=0+(1步後の解析値)',
      controls: `t=${(CTL_STEPS * 0.016).toFixed(3)}`,
      q50: '本便は q₅₀ を掃引していない — coreshell7 の実測値(3000步・validT=48)を機械読取する' },
    warmup: NOT_APPLICABLE,
    samplingGrid: PRE_REGISTERED.samplingGridDefinition,
    windowMeanDefinition: PRE_REGISTERED.windowMeanDefinition,
    probeGrid: { qs: PROBE_QS, envScales: NEB_ARMS.map(a => a.envScale),
      subsetPairs: SUBSET_PAIRS.map(subsetKey), wave158Subset: WAVE158_SUBSET_KEY },
    amplitudeSolver: PRE_REGISTERED.GW2.solutionMethod,
    solver: SOLVER,
    sectionsRun: ONLY.length ? ONLY : ['(all)'],
  },
  classification: {
    input: ['内蔵プリセット nebulaShell の初期配置・質量・seed(第135便〜第174便と同一 — ' +
      '本便で再フィットしない)', 'dt=0.016・步数 3000(coreshell7 の採点走行と同一)',
      '**核 x_b・x_c**(= 第158便 ZW2 の収載値。coreshell5-results.json から機械読取し、' +
      '本便では取り直さない。provenance.inputs に sha256)',
      '**アンカー q₅₀_ref = 第168便 coreshell7 の env×1 実測 q₅₀**(coreshell7-results.json から' +
      '機械読取。未知の Ω_crit を代数的に消去するための代入であり較正自由度ではない)',
      '**照合先 q₅₀_meas = 第168便 coreshell7 の env×2 実測 q₅₀**(機械読取。' +
      '**本便では測り直さない = hold-out ではない**)',
      '**改善判定の基準線 = 第174便 coreshell8 の |差| 0.040928…**' +
      '(coreshell8-results.json: fw1.comparisons[env2].absDiff を機械読取)',
      '予測式の関数形((T1)(T5′))・二分法ソルバ・4点最小二乗の閉形式(第155便→…→第174便からの' +
      '逐語転記。転記の正しさは checks.transcriptionReproducesWave158Separation / ' +
      '…Wave174Prediction と xcheck が bit 一致で機械照合する)',
      '**記録格子と窓平均の定義**(走行前に preRegistered.samplingGridDefinition / ' +
      'windowMeanDefinition へ宣言固定 — 封①)',
      'プローブ q 格子 q∈{1.25,1.5,1.75,2.0}(第174便と同一・封①で固定)',
      '事前登録窓 GW2 の許容 0.05 と改善要件(実測前に固定・実測後に動かさない)'],
    fit: [],
    derived: ['🐚 引きずりの**時間分解記録** Ω̄_drag(step)(raw.timeSeries — 採点窓と同一の走行中の' +
      '解析値。記録は状態の読み取りのみで力学へ干渉しない = checks.sameRunAsScoring が機械証明)',
      '**窓平均 Ω̄̄_drag(q)**(raw.windowMeans — 封①で宣言した定義の適用)',
      '**平均場2項振幅 A_b・A_c の窓平均4点最小二乗解**(amplitudes.windowMean — 当てはめる相手は' +
      '**窓平均 Ω̄̄_drag(q)** であって GW2 が判定する q₅₀ ではない。すなわち予測対象の残差を' +
      '小さくする較正自由度を一つも導入していない。閉形式の正規方程式で初期値・乱数・反復を持たない)',
      't=0+ 対照解の振幅(amplitudes.tZero — 第174便との bit 照合用)',
      '窓平均振幅による Ω_crit と予測 q₅₀・実測との |差|(predictedFromWindowMeanAmplitudes・gw2)',
      '時間プロファイルと t0/窓平均比・符号整合(gw1 — 記述)',
      '2×2 分解・逆向きアンカー・代替定義・核取り直し・適合残差・部分集合散らばり' +
      '(gw2.coRecorded (c)〜(h) — 記述)',
      '対照の bit 一致(controls — 記述)', '決定性ハッシュ(determinism)',
      '第174/168/158便との対照・プローブ bit 照合(crossWaveCheck・checks・xcheck)',
      '本便対象(beta/index.html)と従来対象(index.html)の測定値 bit 一致' +
      '(checks.targetEquivalence — 記述)'],
    holdOut: ['**本便に hold-out は存在しない**。照合先の q₅₀(1.5300)も比較相手の残差(0.040928…)も' +
      '第168/174便で既に確定した既知量であり、本便はそれを機械読取するだけである' +
      '(preRegistered.honestFraming で実測前に宣言)。前向きなのは「時間軸を窓平均へ替えた結果が' +
      'どちらへ動くか」が封①の時点で未計算だったことのみで、それは hold-out ではない',
      '第152/154/155/158/163/168/174便の実測・解析値(本便は読み取り専用の照合参照としてのみ使い、' +
      '書き換えない)'],
    note: '事前登録窓(preRegistered)は実測前に固定し実測後に動かしていない。fit は空 = ' +
      '**本便で新しい較正自由度を一つも導入していない**。4点最小二乗は「窓平均 Ω̄̄_drag(q) に' +
      'モデル (T5′) を当てる」操作であって、判定対象である q₅₀ の残差に触れる自由度ではない' +
      '(designPrinciples.lsqIsAgainstProbeObservable)。窓平均の定義は **走行前に**固定しており、' +
      '代替定義は併記 (e) としてのみ収載して主定義と差し替えない。' +
      '**本便は hold-out を持たない事後解析であり、GW2 の PASS を「未知を当てた」証拠として' +
      '読んではならない**ことを honestFraming で実測前に宣言している',
  },
  judgement: {
    pointers: ['preRegistered', 'preRegistered.honestFraming', 'preRegistered.windowMeanDefinition',
      'limits', 'provenance.inputs', 'checks', 'checks.sameRunAsScoring',
      'preRegistrationBlock', 'preRegistrationSeal', 'raw.timeSeries', 'raw.windowMeans',
      'amplitudes', 'predictedFromWindowMeanAmplitudes', 'predictionIntegrity',
      'gw1', 'gw2.verdict', 'gw2.comparisons', 'gw2.coRecorded', 'xcheck.verdict', 'gw3',
      'controls.allDynamicsIdentical', 'determinism', 'crossWaveCheck', 'raw'],
    note: '許容窓は preRegistered(実測前固定)、走行前に固定した記録格子・窓平均定義・解法・核・' +
      'アンカーは preRegistrationBlock(改変が無いことは preRegistrationSeal)、窓平均振幅と' +
      'そこから立てた予測は predictedFromWindowMeanAmplitudes(判定節での改変が無いことは ' +
      'predictionIntegrity)、エンジン実測は raw、記述窓は gw1、主窓の判定は gw2.verdict、' +
      '併記群 (a)〜(h) は gw2.coRecorded、転記照合は xcheck.verdict、決定性は gw3 にある',
    externalReferences: [
      '第174便 coreshell8 の t=0+ 4点振幅・予測 1.489072…・残差 0.040928…' +
      '(tests/out/coreshell8-results.json — 本便の比較相手・XCHECK の照合先)',
      '第168便 coreshell7 の 🐚 精細 q₅₀(env×1 1.6575 / env×2 1.5300)と採点走行規約' +
      '(tests/out/coreshell7-results.json — 本便のアンカー・照合先・窓の定義元)',
      '第158便 ZW2 の 🐚 平均場2項分離 A_b・A_c と核 x_b・x_c(tests/out/coreshell5-results.json — ' +
      '本便の核の出所・XCHECK の照合先)',
      '第155便の予測式 (T1) Ω_drag(r;q₅₀)=Ω_crit ・(T5) 2項複合と **postHoc ②(t=0 解析値と窓平均の' +
      '乖離の指摘)**(tests/out/coreshell-theory-results.json — 本便の動機そのもの)',
      '遠方漸近の臨界指数 3/2(第135便が同定)'],
  },
  health: {
    conservation: { status: NOT_INSTRUMENTED,
      note: '本ハーネスは保存量残差を記録していない。数値健全性の代理指標は **kF0×kRep=0 対照の ' +
        'bit 一致**(controls.allDynamicsIdentical)・**第174/168/158便の対照・プローブとの bit 一致**' +
        '(crossWaveCheck・checks.probeReproduction)・**時間分解走行と採点器の終端 bit 一致**' +
        '(checks.sameRunAsScoring)・**時間分解 step=1 と t=0+ プローブの bit 一致**' +
        '(checks.timeSeriesTZeroMatchesProbe)・**本便対象と従来対象の測定値 bit 一致**' +
        '(checks.targetEquivalence)・**最小二乗の尺度正規化経路との相対差**' +
        '(gw2.coRecorded.g_fitResidual.arms[].windowMean.scaledPathRelDiff)・**決定性ハッシュ**' +
        '(determinism.sha256)である。各時間分解走行の NaN・クランプ計数は raw.timeSeries.runs[*] の ' +
        'nan / clampV / clampS に収載している' },
  },
  regenerationNote: 'meta.date / meta.elapsedSec / meta.timings / meta.only / meta.stage / ' +
    'determinism.readAttempts は非測定メタなので照合対象外(determinism の正規化と同方針)。' +
    '走行時間は raw に入れていないので raw は完全に決定論的である',
  excludeKeys: ['meta.date', 'meta.elapsedSec', 'meta.timings', 'meta.only', 'meta.stage',
    'determinism.readAttempts'],
});

fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));

log(`\n===== 判定(事前登録窓 — 実測後に動かさない)=====`);
if (out.gw1 && out.gw1.available) {
  log('GW1(記述)時間プロファイル / t=0+ → 窓平均:');
  for (const p of out.gw1.profiles)
    log(`   ${p.armKey} q=${fmt(p.q, 2)} Ω̄(t0)=${p.tZeroOmegaDrag.toExponential(5)} → Ω̄̄(窓)=${p.windowMeanOmegaDrag.toExponential(5)}` +
      ` 比 t0/窓=${fmt(p.ratioTZeroOverWindow, 4)} 後半/前半=${fmt(p.secondOverFirstHalf, 4)}` +
      ` 半減步=${p.halfLifeStep === null ? '—' : p.halfLifeStep} 単調減少=${p.monotoneDecreasingOnUniformGrid} 終端保持=${fmt(p.endKeepFrac, 4)}`);
  for (const a of NEB_ARMS) {
    const s = out.gw1.ratioSummaryByArm[a.key];
    log(`   ${a.key} の t0/窓比: min=${fmt(s.min, 4)} max=${fmt(s.max, 4)} 幅=${fmt(s.spread, 4)} 平均=${fmt(s.mean, 4)} q 依存=${s.monotoneInQ}`);
  }
  const sc = out.gw1.signConsistency;
  log(`   符号整合: 第174便 実測−予測=${fmt(sc.wave174SignedDiff, 6)}(予測が低い)/ 窓平均化による予測の移動=${fmt(sc.predictionShiftFromTZeroToWindow, 6)} → 上向き=${sc.movesUpward} 整合=${sc.consistentWithLowPredictionSign}`);
}
if (haveAmps) {
  log('振幅(窓平均4点最小二乗 / t=0+ 4点解):');
  for (const a of NEB_ARMS) {
    const c = amplitudes.comparison[a.key];
    log(`   ${a.key.padEnd(6)} A_b=${fmt(c.windowMean.base, 6)}(t=0+ ${fmt(c.tZeroFourPoint.base, 6)}・比 ${fmt(c.ratioWindowOverTZero.base, 4)})` +
      `  A_c=${fmt(c.windowMean.core, 6)}(t=0+ ${fmt(c.tZeroFourPoint.core, 6)}・比 ${fmt(c.ratioWindowOverTZero.core, 4)})`);
  }
  log('4点適合の相対残差(窓平均): ' + out.gw2.coRecorded.g_fitResidual.arms.map(e =>
    `${e.armKey} max|rel|=${e.windowMean.maxAbsRelativeResidual.toExponential(3)} RMS=${e.windowMean.rmsRelativeResidual.toExponential(3)} 符号 ${e.signPatternWindow}(t=0+ ${e.signPatternTZero})`).join(' / '));
}
if (out.gw2.verdict) {
  log(`GW2 主窓(窓平均補正予測・許容 ${PRE_REGISTERED.GW2.tolerance} **かつ** 第174便 ${fmt(TARGETQ.wave174AbsDiff, 6)} より改善・判定対象 ${(out.gw2.verdict.judgedArms || []).join(',')})→ ${out.gw2.verdict.result}`);
  for (const c of out.gw2.comparisons)
    log(`   ${c.armKey.padEnd(6)}${c.judgedByGW2 ? '[GW2 判定]  ' : '[アンカー恒等]'} 予測(窓平均)=${fmt(c.predictedQ50WindowMean, 6)} 予測(t=0+)=${fmt(c.predictedQ50TZero, 6)} 実測=${fmt(c.measuredQ50, 4)} ` +
      `|差|=${fmt(c.absDiff, 6)} 窓内=${c.withinTolerance} 改善=${c.improvedOverWave174} → ${c.result}` +
      (c.resultReason ? ` [${c.resultReason}]` : ''));
  const b = out.gw2.coRecorded.b_changeVsWave174;
  log(`併記(b) 第174便 ${fmt(b.wave174AbsDiff, 6)} → 本便 ${fmt(b.thisWaveAbsDiff, 6)}(変化 ${b.change === null ? '—' : (b.change >= 0 ? '+' : '') + fmt(b.change, 6)}・改善=${b.improved}・予測の移動 ${fmt(b.predictionShift, 6)}・残差の説明割合 ${fmt(b.fractionOfResidualExplained, 4)})`);
  const d = out.gw2.coRecorded.d_decomposition;
  log(`併記(d) 2×2 分解: P_tt(第174便)=${fmt(d.P_tt.q, 6)} P_wt=${fmt(d.P_wt.q, 6)} P_tw=${fmt(d.P_tw.q, 6)} P_ww(本便)=${fmt(d.P_ww.q, 6)}`);
  log(`            ΔΩ_crit のみ=${fmt(d.deltaFromOmegaCritOnly, 6)} / 判定アーム振幅のみ=${fmt(d.deltaFromVarAmplitudeOnly, 6)} / 交互作用=${fmt(d.interaction, 6)} / 合計=${fmt(d.totalShift, 6)}`);
  const c = out.gw2.coRecorded.c_reverseAnchor;
  log(`併記(c) 逆向きアンカー(env×2→env×1): 窓平均 予測=${fmt(c.windowMean.predictedQ50, 6)} |差|=${fmt(c.windowMean.absDiff, 6)} / t=0+ 予測=${fmt(c.tZero.predictedQ50, 6)} |差|=${fmt(c.tZero.absDiff, 6)}`);
  const e = out.gw2.coRecorded.e_alternativeDefinitions;
  log(`併記(e) 代替定義の予測: ` + Object.entries(e.predictions).map(([k, v]) =>
    `${k}=${v.available ? fmt(v.predictedQ50Env2, 5) : '—'}`).join(' ') +
    (e.spread ? `(主定義込みの幅 ${fmt(e.spread.spread, 6)})` : ''));
  const f = out.gw2.coRecorded.f_refreshedKernels;
  log(`併記(f) 核も窓平均で取り直した版: 予測=${fmt(f.predictedQ50Env2, 6)} |差|=${fmt(f.absDiffVsMeasured, 6)}`);
  const h = out.gw2.coRecorded.h_subsetSpread;
  if (h && h.env2Spread)
    log(`併記(h) 2点部分集合6組の env×2 予測: min=${fmt(h.env2Spread.min, 6)} max=${fmt(h.env2Spread.max, 6)} 幅=${fmt(h.env2Spread.spread, 6)}(4点解=${fmt(h.fourPointPrediction, 6)}・実測 ${fmt(h.measured, 4)})`);
}
if (out.xcheck.verdict) {
  const v = out.xcheck.verdict;
  log(`XCHECK 転記照合 → ${v.result}(プローブ vs 第174便=${v.groupResults.probeVsWave174} / vs 第158便=${v.groupResults.probeVsWave158} / 時間分解 t=0+=${v.groupResults.timeSeriesTZero} / 振幅・予測=${v.groupResults.amplitudesAndPrediction}・最大相対差 ${v.maxRelativeDiff === null ? '—' : v.maxRelativeDiff.toExponential(3)})`);
}
log(`封①(窓・記録格子・窓平均定義・解法・核)の不変性: sha256 一致=${out.preRegistrationSeal.unchanged}` +
  ` / 封②(振幅と予測)の不変性: sha256 一致=${out.predictionIntegrity ? out.predictionIntegrity.unchanged : '—'}`);
log(`転記照合(走行前): 第158便2点分離 ${out.checks.transcriptionReproducesWave158Separation.nIdentical}/${out.checks.transcriptionReproducesWave158Separation.nCompared}` +
  ` / 第174便4点振幅・予測 ${out.checks.transcriptionReproducesWave174Prediction.nIdentical}/${out.checks.transcriptionReproducesWave174Prediction.nCompared}`);
if (out.checks.sameRunAsScoring)
  log(`採点窓同一性: 採点器との終端 bit 一致 ${out.checks.sameRunAsScoring.nIdentical}/${out.checks.sameRunAsScoring.nCompared}` +
    ` / 時間分解 step=1 と t=0+ プローブ ${out.checks.timeSeriesTZeroMatchesProbe.nIdentical}/${out.checks.timeSeriesTZeroMatchesProbe.nCompared}`);
if (out.checks.targetEquivalence)
  log(`対象同値(beta vs 従来): ${out.checks.targetEquivalence.nIdentical}/${out.checks.targetEquivalence.nCompared}`);
log(`GW3 決定性 sha256=${out.determinism.sha256} identical=${out.determinism.identical} → ${out.gw3.result}`);
log(`対照(記述)kF0×kRep0 allDynamicsIdentical=${out.controls.allDynamicsIdentical}` +
  ` / 過去便対照との bit 一致 ${out.crossWaveCheck.controls.nIdentical}/${out.crossWaveCheck.controls.nCompared}` +
  ` / 第168便プローブとの bit 一致 ${out.crossWaveCheck.probesVsWave168.nIdentical}/${out.crossWaveCheck.probesVsWave168.nCompared}`);
log(`saved: ${path.relative(ROOT, OUT_PATH)} (総実行 ${out.meta.elapsedSec.toFixed(1)} 秒)`);
await browser.close();

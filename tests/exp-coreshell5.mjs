// 第158便 exp-coreshell5.mjs — コア外殻第5実験(第155便理論の**前向き検証**・事前登録 ZW1〜ZW3)
// ============================================================================================
// 位置づけ: 第135便 tests/exp-coreshell.mjs → 第139便 tests/exp-coreshell2.mjs →
//   第152便 tests/exp-coreshell3.mjs → 第154便 tests/exp-coreshell4.mjs →
//   第155便 tests/exp-coreshell-theory.mjs(解析専用・回顧的)の続き。
//
// 第155便は「保持喪失の条件式 Ω_drag(r;q₅₀)=Ω_crit」から振幅寄与込みの予測式を立て、
//   **既存実測に対して回顧的に**当てはまりを点検した(窓なし)。回顧的検証は
//   「式が書かれた時点で対象の実測が既に存在していた」という原理的な弱点を持つ。
//   本便(第158便)はその弱点を**前向き(prospective)**に潰す:
//     ① 第155便の理論・回顧検証のどちらにも使われていない**未実測構成**を対象に選び、
//     ② 予測値を**実測が存在しない時点で計算して JSON に書き出し**(ディスクに固定し)、
//     ③ そのあとで対象構成を実測し、
//     ④ 実測前に固定した窓(ZW1)で判定する。
//   予測ブロックは実測前に一度 OUT_PATH へ書き出され、最終書き出し時に SHA-256 で
//   「1 bit も動いていないこと」を機械照合する(predictionIntegrity)。
//
// ★ アーム(いずれも ⚫kF1kRep実。第155便のアンカー・回顧検証に**使っていない未実測構成**)★
//   基準       (R,Rc)=(15,  7.5 )  同率 s=1     … アンカー(21点格子で**再実測**する)
//   新規①     (R,Rc)=(12.5,6.25)  同率 s=5/6  … 前向き予測の対象(本便が初実測)
//   新規②     (R,Rc)=(7.5, 3.75)  同率 s=1/2  … 前向き予測の対象(本便が初実測)
//   第154便が実測した同率アームは (10,5)・(5,2.5) で、本便の2構成はその**間**と**間の外**を
//   埋める位置にある。第155便の 2項複合予測はこれらの構成について一度も評価されていない。
//
// ★ 格子(第154便の教訓の踏襲と強化)★
//   **全アーム同一の21点格子 q = 1.0, 1.05, 1.10, …, 2.00(×0.05・補間なし)**。
//   基準アームも同格子で**再実測**する(第154便の 11点格子の q₅₀ を流用しない — 第152便が
//   「格子の非対称が Δq₅₀ の符号を決めうる」ことを実測で示した以上、アンカーと対象は
//   同一格子上の実測値でなければならない)。q₅₀ は第152便・第154便と**同一のロジスティック
//   当てはめ関数・同一の当てはめ格子・同一の INCONCLUSIVE 規則**で得る。
//   刻みを 0.1 → 0.05 に落としたのは第155便 postHoc の次便候補「q 掃引の刻みを 0.05 に落として
//   q₅₀ の分解能を上げる」に対応する(第155便 postHoc.nextMeasurementCandidates)。
//
// ============================ 事前登録(実測前に固定 — 逐語)===================================
//   ZW1(主窓): 新規2アームそれぞれで **|q₅₀_meas − q₅₀_pred(2項複合)| ≤ 0.10**。
//   ZW2(記述 — 窓なし): 🐚kF1kRep実 ×1/×2 の引きずりプローブを q∈{1.5, 2.0} の2点で計装し収載する
//     (第155便で「未知2・方程式1本」だった 🐚 2項評価を可能にする計装 — 本便では実測収載のみ・判定なし)。
//   ZW3(決定性・整合): (a) 全体2回実行(別プロセス)SHA 一致
//     (b) 基準アームのうち第154便 coreshell4 と設定・格子点が一致する 0.1 格子部分集合の raw 値 bit 一致
//     (c) kF0×kRep=0 対照の bit 一致。
//   **実測後に窓を動かさない。FAIL は FAIL のまま収載する。**
//
// ============================ 予測式(第155便からの逐語転記)==================================
//   (T1) Ω_drag(r; q₅₀) = Ω_crit                      … 保持喪失の条件式(Ω_drag は q に単調減少)
//   (T5) Ω_drag(r;R,Rc,s,q) = s·(R/(R+r))^q + f·(Ω_c − s)·(Rc/(Rc+r))^q      … 2項複合(⚫)
//        (s = 殻スピン・f = コア質量比 coreMassFrac・Ω_c = コア角速度。tests/exp-coreshell4.mjs の
//         profileOf = index.html の基底スピン項 + A8 コア差動項 からの転記)
//   予測 = 「Ω_drag_var(q₅₀') = Ω_drag_ref(q₅₀_ref)」の数値解(**決定論的二分法**・区間 [0.05,8.0]・
//        反復 200 回固定)。アンカーは基準アームの**実測 q₅₀ ただ1つ**で、未知の Ω_crit を代数的に
//        消去するための代入である(較正自由度ではない — manifest.classification.fit は空)。
//   参考として第155便の (T3) 単一項アンカー式・(T4) 振幅寄与込み単一項・旧式 (3/2)(1+R/r) の
//   差分予測も併記する(**いずれも窓判定には使わない**)。
//   転記の正しさは、第154便の実測アーム(10,5)・(5,2.5)に対する本ハーネスの 2項複合予測が
//   第155便 JSON の値と bit 一致することで機械確認する(checks.transcriptionReproducesTheory)。
//
// 手法は第135便→第139便→第152便→第154便の踏襲(測定器・帯定義・逃散/落下しきい値・seed・步数):
//   ⚫bhCore  : seed 20260805・6000步(validT=96)・外殻 = ①降着円盤ガス 120体(esc r>200 / fall r<30)
//               ②恒星ディスク 200体(esc r>450 / fall r<30)。損失率 = 両帯の(逃散+落下)/320
//   🐚nebulaShell: seed 20260804・3000步(validT=48)— 本便では **q 掃引を行わない**(ZW2 は
//               引きずりプローブ走行と kF0×kRep0 対照のみ)
//   dt=0.016(全構成共通)。数値の創作は一切しない — 本 JSON/報告の数値はすべて本スクリプトの出力である。
//
// 本便が触るノブ(第154便と同一。既定値では 1 bit も変えない):
//   ⚫ rAbs  : bodies[0].radius(中心の半径 R。プリセット実値 15)を上書きする。
//   ⚫ rcAbs : bodies[0].core.radius(コア半径 Rc。プリセット実値 7.5)を上書きする。
//   🐚 envScale : エンベロープ ring の rIn/rOut を一律倍率で振る(引きずりプローブのみ)。
//   **上書きはプリセット実値と異なる場合にのみ行う**(実値と同じなら上書きを省く)。これにより
//   基準アームの走行は第154便の対応走行と build が完全に同一になり、ZW3b の bit 一致照合が意味を持つ。
//
// トイ単位の限界(第135便・第139便・第152便・第154便の宣言を踏襲):
//   本シミュレータの G・質量・長さ・時間は**トイ単位**であり実世界の物理単位ではない。q は無次元の
//   指数なので単位系に依らないが、R・Rc・r・Ω_c の絶対値は当該サンプルの単位系に閉じた値である。
//   窓(步数)は各サンプルの validT に一致させた有限窓で、窓外の長時間挙動は測っていない。粒子数は
//   320(⚫)/98(🐚)の小標本で、損失率・保持率の分解能はそれぞれ 1/320・1/44 に制限される。
//
// 実行:
//   node tests/exp-coreshell5.mjs                        … 全節(既定)
//   CS5_ONLY=bh,neb,ctl node tests/...                   … 節を選択実行
//   CS5_OUT=/path/x.json node tests/...                  … 出力先の変更(決定性の2回実行比較に使う)
//   CS5_DET_REF=/path/run1.json [CS5_DET_WAIT_SEC=1800]  … 2回目実行で1回目の JSON と SHA 照合
//                                                          (WAIT_SEC は並行実行時に参照側の生成を待つ秒数)
//   CS5_QUICK=1 …………………………………………………………… 步数 1/10 の煙試験(配線確認専用・本番数値ではない)
// 出力: tests/out/coreshell5-results.json
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
const OUT_PATH = process.env.CS5_OUT ? path.resolve(process.env.CS5_OUT)
  : path.join(OUT_DIR, 'coreshell5-results.json');

const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

async function launch() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  const { chromium } = await import('playwright-core');
  return chromium.launch({ executablePath: exe });
}

const QUICK = !!process.env.CS5_QUICK;
const SC = (n) => (QUICK ? Math.max(60, Math.round(n / 10)) : n);
const ONLY = (process.env.CS5_ONLY || '').split(',').map(t => t.trim()).filter(Boolean);
const doSec = (k) => (ONLY.length === 0 || ONLY.includes(k));

// ======================== 事前登録(実測前に固定 — 実測後に動かさない) ========================
const PRE_REGISTERED = {
  fixedBy: '統括(第155便の回顧的検証を前向き検証へ移すため第158便で固定)', fixedBefore: '実測',
  designPrinciples: {
    prospective: '**前向き(prospective)である**。予測式(第155便 (T1)(T5))は本便の実測より前に' +
      '書かれており、対象2構成は第155便のアンカーにも回顧検証にも使われていない未実測構成である。' +
      '本便は基準アームを実測 → その q₅₀ をアンカーに予測を計算して JSON へ書き出し → ' +
      'そのあとで対象2構成を実測する、という順序を厳守する',
    unmeasuredArms: '新規2構成 (R,Rc)=(12.5,6.25)(同率 s=5/6)・(7.5,3.75)(同率 s=1/2)は、' +
      '第152便・第154便・第155便のいずれでも実測されていない(第154便の同率アームは (10,5)・(5,2.5))',
    uniformGrid: '**全アーム同一の21点格子 q = 1.0, 1.05, …, 2.0(×0.05・補間なし)で実測する**。' +
      '基準アームも同格子で**再実測**し、第154便の11点格子の q₅₀ は流用しない — アンカーと予測対象は' +
      '同一格子上の実測値でなければならない(第152便が示した格子非対称の教訓)',
    anchorIsMeasurement: 'アンカーは基準アームの**実測 q₅₀ ただ1つ**の代入であり、未知の臨界値 Ω_crit を' +
      '代数的に消去する役割しか持たない(最小二乗も探索も行わない = 較正自由度ではない)',
    waves152to155Untouched: '第152便(coreshell3)・第154便(coreshell4)・第155便(coreshell-theory)の' +
      'JSON は一切変更しない。本便は新規ファイルとして独立に走り、既存 JSON は読み取り専用の' +
      'bit 照合・転記照合・来歴参照としてのみ使う',
  },
  ZW1: {
    role: '主窓',
    verbatim: 'ZW1(主窓): 新規2アームそれぞれで **|q₅₀_meas − q₅₀_pred(2項複合)| ≤ 0.10**。',
    window: '**|q₅₀_meas − q₅₀_pred(2項複合)| ≤ 0.10**(新規2アームそれぞれで)',
    tolerance: 0.10,
    arms: '新規 (R,Rc)=(12.5,6.25) / 新規 (R,Rc)=(7.5,3.75)(いずれも ⚫kF1kRep実)',
    prediction: '第155便 (T1)+(T5): Ω_drag(r;R,Rc,s,q) = s·(R/(R+r))^q + f·(Ω_c−s)·(Rc/(Rc+r))^q を' +
      'アンカー(基準アームの実測 q₅₀)で決めた Ω_crit に等しくする q を、決定論的二分法' +
      '(区間 [0.05,8.0]・反復 200 回固定)で解いた値',
    RrMapping: {
      R: 'R = S.R[0](= bodies[0].radius)', Rc: 'Rc = S.RcV[0](= bodies[0].core.radius)',
      r: 'r = 恒星帯(外殻・200体)の初期平均半径(エンジン実測。第152便・第154便 canonicalr と同一定義)',
      s: 's = S.spin[0]・f = S.coreMF[0]・Ω_c = S.coreOmV[0](いずれも各アームの影響範囲プローブ実測)',
    },
    referencePredictions: '参考として (T3) 単一項アンカー式・(T4) 振幅寄与込み単一項・' +
      '旧式 (3/2)(1+R/r) の差分予測も併記するが、**窓判定は 2項複合のみで行う**',
    inconclusiveRule: 'アームの q₅₀ が当てはめの INCONCLUSIVE 規則(振幅 A−B < 0.20 または q₅₀ が' +
      '掃引範囲 ±0.25 の外)に掛かった場合、あるいは二分法が固定区間で解を挟めなかった場合は ' +
      'INCONCLUSIVE として PASS/FAIL を主張しない',
    prospectiveEvidence: '予測は実測前に out.predictedBeforeMeasurement へ書き込み、OUT_PATH へ' +
      '一度書き出してから対象アームの走行を開始する。最終書き出し時に同ブロックの正準化 SHA-256 が' +
      '予測時点の値と一致することを機械照合する(predictionIntegrity)',
  },
  ZW2: {
    role: '記述(窓なし — 判定に使わない)',
    verbatim: 'ZW2(記述 — 窓なし): 🐚kF1kRep実 ×1/×2 の引きずりプローブを q∈{1.5, 2.0} の2点で計装し' +
      '収載する(第155便で「未知2・方程式1本」だった 🐚 2項評価を可能にする計装 — 本便では実測収載のみ・判定なし)。',
    window: 'なし(記述のみ)',
    background: '第155便 neb.twoTermNote: 🐚 の引きずりは粒子対ごとの距離に依存する多項和で、' +
      '引きずりプローブが 1 つの q でしか回っていなかったため、記録済みの集約量から2つの振幅を' +
      '分離できなかった(未知2個に対し方程式1本)。q を2点に振れば方程式が2本になり分離できる',
    scope: '**本便では実測収載のみ・判定なし**。q 掃引(q₅₀ の再実測)は行わない — プローブ走行のみ',
  },
  ZW3: {
    role: '窓(決定性・整合)',
    verbatim: 'ZW3(決定性・整合): (a) 全体2回実行(別プロセス)SHA 一致 (b) 基準アームのうち coreshell4 と' +
      '設定・格子点が一致する 0.1 格子部分集合の raw 値 bit 一致 (c) kF0×kRep=0 対照の bit 一致。',
    a: '全体を2回実行(別プロセス)し結果 JSON(非測定メタを除く)の正準化 SHA 一致',
    b: '基準アームのうち第154便(coreshell4)と設定・格子点が一致する **0.1 格子部分集合**' +
      '(q=1.0,1.1,…,2.0 の11点)の raw 値 bit 一致',
    c: 'kF0×kRep=0 対照の bit 一致(⚫ と 🐚 の双方)',
    controlRule: 'kFrame=0(引きずり経路を閉じる)かつ kRep=0(E5′ スピン斥力経路を閉じる)なら、' +
      'q や Ω_c を振っても外殻の力学は 1 bit も変わらないはず',
    comparedFields: '力学フィールド(⚫: series/final/outerVt/nOuter/n/nan/clamp* ・' +
      '🐚: clump/envelope/n/nan/clamp*)の JSON 完全一致。コア状態(coreOm0/coreOm1/shellSpin1 等)は ' +
      'Ω_c を振れば当然変わるので比較対象から外し、q 対については全フィールド一致も併記する' +
      '(第139便・第152便・第154便と同じ対照方法)',
  },
  procedure: {
    order: ['① 基準アーム (15,7.5) を21点格子で実測し q₅₀ を当てはめる',
      '② 各アームの幾何・影響範囲プローブ(1步)から (T5) のパラメータ R・Rc・s・f・Ω_c を読む',
      '③ ①の q₅₀ をアンカーに新規2構成の q₅₀_pred(2項複合)を計算し ' +
      'predictedBeforeMeasurement として JSON へ記録・OUT_PATH へ書き出す',
      '④ 新規2アームを同一21点格子で実測する',
      '⑤ ZW1 で判定する(窓は①より前に固定済み)'],
    note: '②の影響範囲プローブは 1 步だけ進めた解析パラメータの読み取りであり、対象アームの' +
      '**損失率掃引(q₅₀ の実測)ではない**。q₅₀ の実測は④でのみ行う',
  },
};

const LIMITS = {
  units: 'トイ単位(G・質量・長さ・時間は実世界の物理単位ではない)。q は無次元の指数なので単位系に' +
    '依らないが、R・Rc・r・Ω_c の絶対値は当該サンプルの単位系に閉じた値である',
  dt: 0.016,
  windows: {
    bhCore: { steps: 6000, validT: 96, note: '第135便・第139便・第152便・第154便と同一窓。窓外の長時間挙動は測っていない' },
    nebulaShell: { steps: 3000, validT: 48, note: '第135便・第139便・第152便・第154便と同一窓(本便では対照走行のみ)' },
  },
  seeds: { bhCore: 20260805, nebulaShell: 20260804,
    note: 'seed はプリセット定義値。build がそれを使うので構成間で同一 — 構成差はすべてノブ差である' },
  sampleSize: {
    bhCore: 'ガス 120体 + 恒星 200体 = 320(損失率の分解能 1/320 ≈ 0.0031)',
    nebulaShell: 'エンベロープ 44体(プローブの母数)+ クランプ 54体',
  },
  q50Resolution: 'q₅₀ の当てはめ格子は 0.0025 刻み。掃引点の刻み(本便 0.05)より細かいが、' +
    '**q₅₀ の実質的な分解能を決めるのは掃引点の刻み(0.05)と損失率の粒度**(1/320)であり、' +
    '格子刻みではない。ZW1 の許容 0.10 は掃引刻みの 2 倍にあたる — この限界の上で読むこと',
  anchorPropagation: '予測はアンカー(基準アームの実測 q₅₀)を1点使う。アンカー自身が掃引刻み ' +
    '0.05 と損失率の粒度に由来する不確かさを持つので、その不確かさは予測値へそのまま伝播する' +
    '(sensitivity.anchorPerturbation に ±0.05 ずらした場合の予測を併記する — 記述のみ)',
  proportionalSweepCaveat: '同率スイープは R と Rc を同率で振るので、**引きずり核の縮小以外の寄与も同時に動く**: ' +
    'R は中心天体の慣性 I=½mR²・接触半径・温度・扁平率に、Rc はコアの慣性 I_c=½M_cRc²(= τ_cs による ' +
    '角運動量放出の速さ)に効く。これらは差分では相殺されない系統であり、q₅₀ には引きずり核の' +
    '形状変化以外の寄与も混じりうる(第154便 limits.proportionalSweepCaveat・第155便 postHoc ① と同じ限界)',
  tZeroAnalytic: '予測に使う Ω_drag は **1步後(t=0+)の解析値**である。⚫ は窓の間に殻スピンと ' +
    'コア Ω_c が動く自走系なので、窓平均の引きずりは t=0+ の値と同じではない(第155便 postHoc ②)。' +
    '本便はこの限界を承知のうえで、t=0+ の解析値による予測を**そのまま**前向き検証に掛ける',
  nebProbeOnly: '🐚 は本便では **q 掃引を行わない**。ZW2 は引きずりプローブ(1步)と kF0×kRep0 対照' +
    'だけであり、🐚 の q₅₀ は本便では実測していない(既存値は第154便の11点格子のもの)',
  notClaim: '実在天体についての主張ではない。すべて DFM 公理系内部の構成依存の実測である',
};

// ==================== 入力(既存 JSON — 読み取り専用。sha256 を来歴に残す)====================
const INPUT_SPECS = [
  { key: 'theory', file: 'coreshell-theory-results.json',
    role: '第155便の理論正本(本便が転記した予測式 (T1)(T5)・二分法ソルバの出典。' +
      '転記の正しさは checks.transcriptionReproducesTheory で機械照合する)' },
  { key: 'cs4', file: 'coreshell4-results.json',
    role: '第154便の実測正本(ZW3b の bit 照合参照・転記照合の入力パラメータ源)' },
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
const THEORY = inputs.theory, CS4 = inputs.cs4;
const TARGET_SHA_NOW = sha256(fs.readFileSync(path.join(ROOT, TARGET)));
const targetConsistency = {
  target: TARGET, sha256Now: TARGET_SHA_NOW,
  inputs: provenanceInputs.map(e => ({ path: e.path, targetSha256: e.targetSha256,
    sameAsNow: e.targetSha256 === TARGET_SHA_NOW })),
  allSame: provenanceInputs.every(e => e.targetSha256 === TARGET_SHA_NOW),
  note: '入力 JSON の実測を出した対象 HTML の SHA-256 が、本便が実測する index.html と同一実体かの照合。' +
    '一致していれば ZW3b(第154便との bit 一致)が意味を持つ前提が満たされる',
};

// ============================ 測定器(第154便 exp-coreshell4.mjs から逐語踏襲) =================
// A) ⚫bhCore — 第154便 measureBH と同一(帯定義・しきい値・スナップ数 NS=4・返却フィールドすべて同一)。
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

// B) 🐚nebulaShell — 第154便 measureNeb と同一(本便では kF0×kRep0 対照にのみ使う)
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

// C) ⚫ 幾何プローブ(第154便 bhGeom と同一)。R・Rc と参照半径 r を build 直後(step 前)に読む。
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

// D) ⚫ 影響範囲プローブ — 第154便 profileOf と同一((T5) のパラメータ源 = index.html の関数形)
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

// E) 🐚 引きずりプローブ — 第154便 nebDragProbe と同一(ZW2 は q を2点に振ってこれを回す)
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

// ==================== q₅₀(ロジスティック中点)の当てはめ — 第152便・第154便と同一の関数 =======
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

// ================= 予測式(第155便 exp-coreshell-theory.mjs からの逐語転記)====================
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
// (T5) ⚫ の2項複合。tests/exp-coreshell4.mjs profileOf(= index.html)からの正確な転記
const omegaDragBH = (p, r, q) =>
  p.s * Math.pow(p.R / (p.R + r), q) + p.f * (p.Omc - p.s) * Math.pow(p.Rc / (p.Rc + r), q);
const kernelBase = (p, r) => p.R / (p.R + r);        // x_b
const kernelCore = (p, r) => p.Rc / (p.Rc + r);      // x_c
const ampBase = (p) => p.s;                          // A_b
const ampCore = (p) => p.f * (p.Omc - p.s);          // A_c
const qEffLegacy = (R, r) => 1.5 * (1 + R / r);      // 旧式(第139便 post-hoc → 第152便 XW2 → 第154便 YW1)
// (T3) 単一項アンカー式 / (T4) 振幅寄与込み一般形
const predSingleTerm = (q50Ref, xRef, xVar) => q50Ref * Math.log(xRef) / Math.log(xVar);
const predSingleTermAmplitude = (q50Ref, xRef, aRef, xVar, aVar) =>
  (q50Ref * Math.log(xRef) + Math.log(aRef / aVar)) / Math.log(xVar);

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

const out = { meta: { exp: 'coreshell5', wave: 158, target: TARGET, date: new Date().toISOString(),
    dt: 0.016,
    basedOn: '第154便 tests/exp-coreshell4.mjs(測定器・帯定義・窓・seed・步数・q₅₀ 当てはめ関数を踏襲)' +
      ' / 第155便 tests/exp-coreshell-theory.mjs(予測式 (T1)(T5)・二分法ソルバを逐語転記)' +
      ' / 第152便 exp-coreshell3 / 第139便 exp-coreshell2 / 第135便 exp-coreshell(原型)',
    role: '第155便の**回顧的**検証を**前向き**検証へ移す便。未実測の2構成に対し、実測前に固定した' +
      '予測(2項複合)と事前登録窓 ZW1 で判定する',
    quick: QUICK, only: ONLY },
  preRegistered: PRE_REGISTERED, limits: LIMITS,
  provenance: { inputs: provenanceInputs, targetConsistency },
  raw: {} };
out.meta.timings = {};   // 走行時間は非測定メタなので raw には入れない(raw は完全に決定論的)

// ---- 掃引点・アーム(実測前に固定)----
// **全アーム同一の21点格子**(補間なし)。0.1 格子の11点(1.0,1.1,…,2.0)は第154便の literal と
// 同一値なので、基準アームのその部分集合は第154便と bit 一致するはずである(ZW3b)。
const Q_GRID = [1.0, 1.05, 1.1, 1.15, 1.2, 1.25, 1.3, 1.35, 1.4, 1.45, 1.5,
  1.55, 1.6, 1.65, 1.7, 1.75, 1.8, 1.85, 1.9, 1.95, 2.0];
const Q_GRID_SHARED_WITH_CS4 = [1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0];
const BH_PRESET_R = 15, BH_PRESET_RC = 7.5;   // index.html bhCore bodies[0] のプリセット実値
const ovR = (R) => (R === BH_PRESET_R ? null : R);
const ovRc = (Rc) => (Rc === BH_PRESET_RC ? null : Rc);
const BH_ANCHOR_KEY = 'base';
const BH_ARMS = [
  { key: 'base', R: 15, Rc: 7.5, scale: 1, group: 'anchor',
    label: '⚫kF1kRep実 基準 (R,Rc)=(15,7.5)(21点格子で再実測 — アンカー)' },
  { key: 'prop_R12p5Rc6p25', R: 12.5, Rc: 6.25, scale: 5 / 6, group: 'prospective',
    label: '⚫kF1kRep実 新規 同率 s=5/6 (R,Rc)=(12.5,6.25)' },
  { key: 'prop_R7p5Rc3p75', R: 7.5, Rc: 3.75, scale: 1 / 2, group: 'prospective',
    label: '⚫kF1kRep実 新規 同率 s=1/2 (R,Rc)=(7.5,3.75)' },
];
const BH_VARIANT_KEYS = BH_ARMS.filter(a => a.group === 'prospective').map(a => a.key);
const NEB_ENV_SCALES = [1, 2];        // ZW2 のエンベロープ半径倍率
const NEB_PROBE_QS = [1.5, 2.0];      // ZW2 の引きずりプローブ q(2点 = 2項分離に必要な本数)
const BH_STEPS = SC(6000), NEB_STEPS = SC(3000);
const PROFILE_QS = [1.5, 2.0];        // (T5) パラメータ源・core/base 内訳を読む q(第154便と同じ2点)
const tagQ = (q) => 'q' + q.toFixed(2);

const bhLoss = (f) => (f.gas.n * (f.gas.escFrac + f.gas.fallFrac) + f.star.n * (f.star.escFrac + f.star.fallFrac))
  / (f.gas.n + f.star.n);
const nebLoss = (r) => 1 - r.envelope.keepFrac;

const runBH = async (tag, mod, store, prefix = 'bh') => {
  const t0 = Date.now();
  const r = await measureBH({ ...mod, steps: BH_STEPS });
  r.tag = tag;
  store[tag] = r;
  const sec = (Date.now() - t0) / 1000;
  out.meta.timings[`${prefix}:${tag}`] = sec;
  const f = r.final;
  log(`[⚫ ${tag.padEnd(8)}] loss=${fmt(bhLoss(f), 4)} (gas ${fmt(f.gas.escFrac + f.gas.fallFrac, 3)} / star ${fmt(f.star.escFrac + f.star.fallFrac, 3)}) R=${r.cfg.bodyRadius} Rc=${r.cfg.coreRadius} σ/r star=${fmt(f.star.sdOverMean, 3)} NaN=${r.nan} (${sec.toFixed(1)}s)`);
  return r;
};
const runNeb = async (tag, mod, store) => {
  const t0 = Date.now();
  const r = await measureNeb({ ...mod, steps: NEB_STEPS });
  r.tag = tag;
  store[tag] = r;
  const sec = (Date.now() - t0) / 1000;
  out.meta.timings[`neb:${tag}`] = sec;
  log(`[🐚 ${tag.padEnd(12)}] loss=${fmt(nebLoss(r), 4)} keep=${fmt(r.envelope.keepFrac, 3)} envScale=${r.cfg.envScale} keepR=${r.cfg.keepR} meanR=${fmt(r.envelope.meanR, 1)} | clump keep=${fmt(r.clump.keepFrac, 3)} NaN=${r.nan} (${sec.toFixed(1)}s)`);
  return r;
};

const bhTable = (runs) => Object.entries(runs).map(([tag, r]) =>
  ({ tag, q: r.cfg.q, bodyRadius: r.cfg.bodyRadius, coreRadius: r.cfg.coreRadius, loss: bhLoss(r.final),
    lossGas: r.final.gas.escFrac + r.final.gas.fallFrac,
    lossStar: r.final.star.escFrac + r.final.star.fallFrac })).sort((a, b) => a.q - b.q);

// (T5) のパラメータをアームの影響範囲プローブから読む(第155便 bhParamsOf と同一の読み方)
const paramsFromProfiles = (profiles, key) => {
  const a = profiles[`${key}_q1.50`].params;
  const b = profiles[`${key}_q2.00`].params;
  return { R: a.R0, Rc: a.Rc, s: a.s0, f: a.coreMassFrac, Omc: a.coreOmega,
    spinSameAcrossProfileQs: a.s0 === b.s0,
    coreMassFracSame: a.coreMassFrac === b.coreMassFrac, coreOmegaSame: a.coreOmega === b.coreOmega };
};

// ---- 節 bh: ①基準アーム実測 → ②パラメータ読み → ③予測を記録・書き出し → ④新規2アーム実測 ----
if (doSec('bh')) {
  const geom = {}, arms = {}, profiles = {};
  log(`\n===== ⚫bhCore 幾何プローブ(${BH_ARMS.length} 構成)=====`);
  for (const a of BH_ARMS) {
    const g = await bhGeom(ovR(a.R), ovRc(a.Rc));
    geom[a.key] = g;
    log(`  ${a.key.padEnd(17)} S.R[0]=${g.R0} Rc=${g.Rc} 恒星帯⟨r⟩=${fmt(g.star.meanR, 3)} ガス帯⟨r⟩=${fmt(g.gas.meanR, 3)} J_core(0)=${fmt(g.coreJ0, 3)} 配置指紋=${g.positionFingerprint}`);
  }
  log(`\n===== ⚫bhCore 影響範囲プローブ((T5) のパラメータ源・q=${PROFILE_QS.join(',')})=====`);
  for (const a of BH_ARMS) for (const q of PROFILE_QS)
    profiles[`${a.key}_${tagQ(q)}`] = await profileOf('bhCore', { q, rAbs: ovR(a.R), rcAbs: ovRc(a.Rc) });

  // ---- ① 基準アーム(アンカー)を21点格子で実測する ----
  {
    const a = BH_ARMS.find(x => x.key === BH_ANCHOR_KEY);
    const runs = {};
    log(`\n===== ① ⚫bhCore ${a.label}: ${Q_GRID.length} 構成 × ${BH_STEPS}步 =====`);
    for (const q of Q_GRID) await runBH(tagQ(q), { kFrame: 1, q, rAbs: ovR(a.R), rcAbs: ovRc(a.Rc) }, runs, a.key);
    arms[a.key] = { arm: { kFrame: 1, kRep: '実値(1)', bodyRadius: a.R, coreRadius: a.Rc,
      scale: a.scale, group: a.group, label: a.label }, grid: Q_GRID, runs };
  }
  out.raw.bh = { steps: BH_STEPS, grid: Q_GRID, armDefs: BH_ARMS, presetR: BH_PRESET_R,
    presetRc: BH_PRESET_RC, profileQs: PROFILE_QS, geom, arms, profiles };

  // ---- ② 幾何・パラメータの整合確認(重み相殺の根拠 — 第155便 checks と同じ量)----
  const rStar = geom[BH_ANCHOR_KEY].star.meanR, rGas = geom[BH_ANCHOR_KEY].gas.meanR;
  const geomIdentical = Object.values(geom).every(g =>
    g.positionFingerprint === geom[BH_ANCHOR_KEY].positionFingerprint &&
    g.star.meanR === rStar && g.gas.meanR === rGas && g.m0 === geom[BH_ANCHOR_KEY].m0);
  const wFracAtBin = Object.fromEntries(Object.entries(profiles).map(([k, pr]) => {
    let e = null;
    for (const row of pr.prof) if (e === null || Math.abs(row.r - rStar) < Math.abs(e.r - rStar)) e = row;
    return [k, { rBin: e.rBin, r: e.r, wFrac0: e.wFrac0 }];
  }));
  const wFracValues = Object.values(wFracAtBin).map(e => e.wFrac0);
  out.checks = {
    geometryIdentical: geomIdentical,
    geometryIdenticalNote: '⚫ 全アームで位置指紋・恒星帯/ガス帯の初期平均半径・中心質量が一致する' +
      '(初期配置は R・Rc に依存しない — insideBig は radiusScale·rMul·√m を使い b.radius/core.radius を' +
      '見ない)。これが「r と重み係数が構成間で共通 = (T1) の両辺で相殺する」の根拠',
    wFracAtCanonicalR: wFracAtBin,
    wFracSpread: Math.max(...wFracValues) - Math.min(...wFracValues),
    wFracNote: '正準 r に最も近いプロファイル bin での w/(D₀+w) の構成間ばらつき。0 に近いほど、' +
      '重み係数が (T1) の両辺で相殺するという扱いが実測で裏づけられる',
    spinConstantAcrossProfileQs: Object.fromEntries(BH_ARMS.map(a =>
      [a.key, paramsFromProfiles(profiles, a.key).spinSameAcrossProfileQs])),
    spinNote: '殻スピン s は q に依らない(各アームの q=1.5 / q=2.0 プロファイルで bit 一致)ので、' +
      '(T5) の s をアームごとの単一値として扱ってよい',
  };

  // ---- ③ 予測(**実測前**に計算し JSON へ記録してディスクへ書き出す)----
  const q50BaseFit = fitLogisticQ50(bhTable(arms[BH_ANCHOR_KEY].runs));
  const ref = paramsFromProfiles(profiles, BH_ANCHOR_KEY);
  const q50Ref = q50BaseFit.q50;
  const omegaCrit = q50Ref === null ? null : omegaDragBH(ref, rStar, q50Ref);
  const xbRef = kernelBase(ref, rStar), xcRef = kernelCore(ref, rStar);
  const predArms = [];
  for (const key of BH_VARIANT_KEYS) {
    const p = paramsFromProfiles(profiles, key);
    const xb = kernelBase(p, rStar), xc = kernelCore(p, rStar);
    const two = q50Ref === null ? { q: null, bracketed: false }
      : solveMonotoneDecreasing((q) => omegaDragBH(p, rStar, q), omegaCrit);
    predArms.push({
      armKey: key, label: BH_ARMS.find(a => a.key === key).label,
      scale: BH_ARMS.find(a => a.key === key).scale,
      geometry: { R: p.R, Rc: p.Rc, r: rStar, xBase: xb, xCore: xc, oneMinusXCore: 1 - xc },
      params: { s: p.s, f: p.f, Omc: p.Omc },
      amplitudes: { base: ampBase(p), core: ampCore(p) },
      predictedQ50: {
        twoTerm: two.q,
        singleTerm: q50Ref === null ? null : predSingleTerm(q50Ref, xcRef, xc),
        singleTermAmplitude: q50Ref === null ? null
          : predSingleTermAmplitude(q50Ref, xcRef, ampCore(ref), xc, ampCore(p)),
        singleTermBaseKernel: q50Ref === null ? null : predSingleTerm(q50Ref, xbRef, xb),
        legacy: q50Ref === null ? null : q50Ref + (qEffLegacy(p.R, rStar) - qEffLegacy(ref.R, rStar)),
      },
      twoTermSolve: { bracketed: two.bracketed,
        residualOmega: two.residual === undefined ? null : two.residual,
        omegaDragAtPrediction: two.q === null ? null : omegaDragBH(p, rStar, two.q) },
    });
  }
  // アンカーの不確かさ(掃引刻み ±0.05)を予測へ伝播させた場合の幅(記述のみ・窓に使わない)
  const anchorPerturbation = q50Ref === null ? null : [-0.05, 0.05].map(d => {
    const qa = q50Ref + d;
    const crit = omegaDragBH(ref, rStar, qa);
    return { anchorShift: d, anchorQ50: qa,
      arms: BH_VARIANT_KEYS.map(key => {
        const p = paramsFromProfiles(profiles, key);
        const s = solveMonotoneDecreasing((q) => omegaDragBH(p, rStar, q), crit);
        return { armKey: key, twoTerm: s.q };
      }) };
  });
  const predictionBlock = {
    declaredBefore: '**新規2アームの掃引実測より前**に計算し、OUT_PATH へ書き出した予測である' +
      '(手順は preRegistered.procedure。書き出し後は 1 bit も変更しない — predictionIntegrity で照合)',
    formula: '第155便 (T1)+(T5) の逐語転記: Ω_drag(r;R,Rc,s,q) = s·(R/(R+r))^q + f·(Ω_c−s)·(Rc/(Rc+r))^q' +
      ' を Ω_crit = Ω_drag(基準アーム; q₅₀_ref) に等しくする q を決定論的二分法で解く',
    solver: SOLVER,
    anchor: { armKey: BH_ANCHOR_KEY, q50: q50Ref, fitResult: q50BaseFit.result,
      grid: Q_GRID, nPoints: q50BaseFit.nPoints,
      note: 'アンカーは基準アームを**本便の21点格子で実測**して当てはめた q₅₀ である' +
        '(第154便の11点格子の値を流用していない)' },
    canonicalR: '恒星帯(外殻200体)の初期平均半径(第152便・第154便 canonicalr と同一定義)',
    r: rStar, omegaCrit, refParams: ref, kernels: { xBaseRef: xbRef, xCoreRef: xcRef },
    arms: predArms,
    anchorPerturbation,
    anchorPerturbationNote: 'アンカーを掃引刻み ±0.05 ずらした場合の2項複合予測(**記述のみ**・' +
      'ZW1 の判定には使わない)。アンカー自身の不確かさが予測へどう伝播するかの目安である',
    referenceOnly: 'singleTerm / singleTermAmplitude / singleTermBaseKernel / legacy は参考併記であり、' +
      'ZW1 の判定は twoTerm のみで行う',
  };
  out.predictedBeforeMeasurement = predictionBlock;
  out.predictionIntegrity = {
    canonicalization: 'predictedBeforeMeasurement を再帰キー整列した JSON の SHA-256',
    sha256AtPredictionTime: canonSha(predictionBlock),
    writtenToDiskBeforeVariantRuns: false, sha256AtFinalWrite: null, unchanged: null };
  log(`\n===== ③ 前向き予測(**新規2アームの実測前**に固定)=====`);
  log(`  アンカー ${BH_ANCHOR_KEY} q₅₀=${fmt(q50Ref)}(${q50BaseFit.result}・21点格子)/ r=${fmt(rStar, 3)} / Ω_crit=${omegaCrit === null ? '—' : omegaCrit.toExponential(6)}`);
  for (const a of predArms)
    log(`  ${a.armKey.padEnd(17)} 2項複合 q₅₀_pred=${fmt(a.predictedQ50.twoTerm)} ` +
      `(参考 単一項=${fmt(a.predictedQ50.singleTerm)} 単一項+振幅=${fmt(a.predictedQ50.singleTermAmplitude)} 旧式=${fmt(a.predictedQ50.legacy)})`);
  // 予測をディスクへ固定してから対象を実測する(前向き性の物理的な証跡)
  out.meta.stage = 'prediction-recorded-before-variant-measurement';
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));
  out.predictionIntegrity.writtenToDiskBeforeVariantRuns = true;
  log(`  → 予測を ${path.relative(ROOT, OUT_PATH)} へ書き出した(sha256 ${out.predictionIntegrity.sha256AtPredictionTime.slice(0, 16)}…)。以降、対象アームを実測する`);

  // ---- ④ 新規2アームを同一21点格子で実測する ----
  for (const key of BH_VARIANT_KEYS) {
    const a = BH_ARMS.find(x => x.key === key);
    const runs = {};
    log(`\n===== ④ ⚫bhCore ${a.label}: ${Q_GRID.length} 構成 × ${BH_STEPS}步 =====`);
    for (const q of Q_GRID) await runBH(tagQ(q), { kFrame: 1, q, rAbs: ovR(a.R), rcAbs: ovRc(a.Rc) }, runs, a.key);
    arms[a.key] = { arm: { kFrame: 1, kRep: '実値(1)', bodyRadius: a.R, coreRadius: a.Rc,
      scale: a.scale, group: a.group, label: a.label }, grid: Q_GRID, runs };
  }
  out.meta.stage = 'complete';
}

// ---- 節 neb: ZW2 引きずりプローブ(q 2点 × エンベロープ半径2構成)+ kF0×kRep0 対照 ----
if (doSec('neb')) {
  const dragProbes = {};
  log(`\n===== ZW2 🐚nebulaShell 引きずりプローブ(q=${NEB_PROBE_QS.join(',')} × env×${NEB_ENV_SCALES.join(',×')})=====`);
  for (const s of NEB_ENV_SCALES) for (const q of NEB_PROBE_QS) {
    const pr = await nebDragProbe(q, s);
    dragProbes[`env${s}_${tagQ(q)}`] = pr;
    const mean = pr.rows.reduce((a, e) => a + e.omDragAnalytic, 0) / pr.rows.length;
    log(`  env×${s} q=${pr.q} R̄=${fmt(pr.RbarClump, 4)} ⟨r⟩=${fmt(pr.envMeanR, 3)} Ω̄_drag=${mean.toExponential(6)} Ω_drag/Ω_kep=${fmt(pr.meanDragOverKepler, 6)} nEnv=${pr.nEnv}`);
  }
  const ctl = {};
  log(`\n===== ZW3c 対照 / 🐚 kFrame=0 × kRep=0(bit 一致対照)=====`);
  await runNeb('ctl_q1.30', { kFrame: 0, kRep: 0, q: 1.3 }, ctl);
  await runNeb('ctl_q1.90', { kFrame: 0, kRep: 0, q: 1.9 }, ctl);
  await runNeb('ctl_om0.00', { kFrame: 0, kRep: 0, omMul: 0 }, ctl);
  await runNeb('ctl_om2.00', { kFrame: 0, kRep: 0, omMul: 2 }, ctl);
  out.raw.neb = { steps: NEB_STEPS, probeQs: NEB_PROBE_QS, envScales: NEB_ENV_SCALES,
    note: '本便の 🐚 は **q 掃引を行わない**(ZW2 はプローブ走行のみ・判定なし)。' +
      '対照走行は ZW3c の bit 一致対照である',
    dragProbes, controls: ctl };
}

// ---- 節 ctl: ZW3c ⚫ 対照(kFrame=0 × kRep=0 の bit 一致)----
if (doSec('ctl')) {
  const ctl = {};
  log(`\n===== ZW3c 対照 / ⚫bhCore kFrame=0 × kRep=0(bit 一致対照)=====`);
  await runBH('ctl_q1.30', { kFrame: 0, kRep: 0, q: 1.3 }, ctl, 'ctl');
  await runBH('ctl_q1.90', { kFrame: 0, kRep: 0, q: 1.9 }, ctl, 'ctl');
  await runBH('ctl_om0.00', { kFrame: 0, kRep: 0, omMul: 0 }, ctl, 'ctl');
  await runBH('ctl_om2.00', { kFrame: 0, kRep: 0, omMul: 2 }, ctl, 'ctl');
  out.raw.ctl = { runs: ctl };
}

// ======================================= 集計・判定 =========================================
// 事前登録した規則をそのまま適用する(実測後に規則を変えない)。
const dynKeysBH = ['series', 'final', 'outerVt', 'nOuter', 'n', 'nan', 'clampV', 'clampS', 'clampR'];
const dynKeysNeb = ['clump', 'envelope', 'n', 'nan', 'clampV', 'clampS'];
const pickJ = (o, ks) => { const r = {}; for (const k of ks) r[k] = o[k]; return JSON.stringify(r); };
const fullJ = (o) => { const r = { ...o }; delete r.cfg; delete r.tag; return JSON.stringify(r); };

// ---- 全アームの q₅₀(同一の21点格子・同一の当てはめ関数)----
out.q50 = { grid: Q_GRID, fitGrid: Q50_GRID,
  note: '**全アームが同一の21点格子**(q=1.0〜2.0・0.05 刻み・補間なし)で実測され、第152便・第154便と' +
    '同一のロジスティック当てはめ関数で q₅₀ を得ている。アーム間で格子点は 1 点も違わない。' +
    '基準アームも本便の格子で再実測しており、第154便の11点格子の q₅₀ は流用していない',
  arms: {} };
if (out.raw.bh) {
  for (const a of BH_ARMS) {
    const arm = out.raw.bh.arms[a.key];
    if (!arm) continue;
    const table = bhTable(arm.runs);
    out.q50.arms[a.key] = { label: a.label, group: a.group, scale: a.scale, table, fit: fitLogisticQ50(table) };
  }
  out.q50.summary = Object.fromEntries(Object.entries(out.q50.arms).map(([k, a]) =>
    [k, { label: a.label, group: a.group, q50: a.fit.q50, result: a.fit.result, width: a.fit.width,
      plateaus: [a.fit.plateauLowQ, a.fit.plateauHighQ], rmse: a.fit.rmse, nPoints: a.fit.nPoints,
      crossing0p5LinearInterp: a.fit.crossing0p5LinearInterp }]));
  out.q50.allArmsSameGrid = Object.values(out.q50.arms).every(a =>
    a.table.length === Q_GRID.length &&
    a.table.every((e, i) => Math.abs(e.q - Q_GRID[i]) < 1e-12));
  // アンカーが予測時点の値と同一であること(手順の自己点検)
  out.q50.anchorMatchesPrediction = out.predictedBeforeMeasurement
    ? out.q50.arms[BH_ANCHOR_KEY].fit.q50 === out.predictedBeforeMeasurement.anchor.q50 : null;
  // 参考: 第154便の11点格子との比較(**判定に使わない**記述)
  out.q50.gridRefinementNote = '参考として、基準アームの q₅₀ を第154便(11点格子・0.1 刻み)と並べる。' +
    '両者の差は掃引刻みの細分による当てはめの動きであり、**判定には使わない**';
  out.q50.baseQ50Wave154Eleven = CS4.q50.summary[BH_ANCHOR_KEY] ? CS4.q50.summary[BH_ANCHOR_KEY].q50 : null;
}

// ---- ZW1(主窓): |q₅₀_meas − q₅₀_pred(2項複合)| ≤ 0.10 ----
out.zw1 = { rule: PRE_REGISTERED.ZW1, comparisons: [], verdict: null };
if (out.raw.bh && out.predictedBeforeMeasurement) {
  const rows = [];
  for (const pa of out.predictedBeforeMeasurement.arms) {
    const fit = out.q50.arms[pa.armKey] ? out.q50.arms[pa.armKey].fit : null;
    const meas = fit ? fit.q50 : null;
    const pred = pa.predictedQ50.twoTerm;
    const inconclusive = (meas === null || pred === null);
    const absDiff = inconclusive ? null : Math.abs(meas - pred);
    const d = (v) => (v === null || meas === null) ? null : Math.abs(v - meas);
    rows.push({
      armKey: pa.armKey, label: pa.label,
      geometry: pa.geometry,
      predictedQ50: pa.predictedQ50,
      measuredQ50: meas, measuredFitResult: fit ? fit.result : null,
      signedDiff: inconclusive ? null : (meas - pred),
      absDiff, tolerance: PRE_REGISTERED.ZW1.tolerance,
      withinTolerance: inconclusive ? null : (absDiff <= PRE_REGISTERED.ZW1.tolerance),
      result: inconclusive ? 'INCONCLUSIVE'
        : (absDiff <= PRE_REGISTERED.ZW1.tolerance ? 'PASS' : 'FAIL'),
      referenceAbsDiff: { singleTerm: d(pa.predictedQ50.singleTerm),
        singleTermAmplitude: d(pa.predictedQ50.singleTermAmplitude),
        singleTermBaseKernel: d(pa.predictedQ50.singleTermBaseKernel),
        legacy: d(pa.predictedQ50.legacy) },
      referenceNote: '参考予測との |差|(**窓判定には使わない** — ZW1 は twoTerm のみ)',
    });
  }
  out.zw1.comparisons = rows;
  out.zw1.verdict = { window: PRE_REGISTERED.ZW1.window,
    tolerance: PRE_REGISTERED.ZW1.tolerance,
    result: rows.length ? (rows.some(e => e.result === 'INCONCLUSIVE') ? 'INCONCLUSIVE'
      : (rows.every(e => e.result === 'PASS') ? 'PASS' : 'FAIL')) : null,
    perArm: rows.map(e => ({ armKey: e.armKey, predictedTwoTerm: e.predictedQ50.twoTerm,
      measured: e.measuredQ50, absDiff: e.absDiff, result: e.result })) };
}

// ---- ZW2(記述 — 窓なし): 🐚 引きずりプローブ q 2点の実測収載 ----
out.zw2 = { rule: PRE_REGISTERED.ZW2, window: null,
  note: '**窓なし・判定に使わない**。第155便が「未知2・方程式1本」で分離できなかった 🐚 の2項振幅を、' +
    'q を2点に振ったプローブ実測として収載する(分離そのものは記述として併記する)' };
if (out.raw.neb && out.raw.neb.dragProbes) {
  const P = out.raw.neb.dragProbes;
  const meanDrag = (pr) => pr.rows.reduce((a, e) => a + e.omDragAnalytic, 0) / pr.rows.length;
  const medianDrag = (pr) => {
    const s = pr.rows.map(e => e.omDragAnalytic).sort((a, b) => a - b);
    return s[Math.floor(s.length / 2)];
  };
  // クランプのコア半径 Rc(= bodies[0].core.radius。第155便 sensitivity.nebKernelChoice と同一定義)。
  // 本便の対照走行 cfg から読む(= 本ハーネスの出力。既定ノブなのでプリセット実値そのもの)
  const rcClump = (out.raw.neb.controls && out.raw.neb.controls['ctl_q1.30'])
    ? out.raw.neb.controls['ctl_q1.30'].cfg.coreRc : null;
  const table = [], perScale = {};
  for (const s of NEB_ENV_SCALES) {
    const probes = NEB_PROBE_QS.map(q => P[`env${s}_${tagQ(q)}`]);
    for (const pr of probes) table.push({ envScale: s, q: pr.q, RbarClump: pr.RbarClump,
      envMeanR: pr.envMeanR, nEnv: pr.nEnv,
      meanOmegaDrag: meanDrag(pr), medianOmegaDrag: medianDrag(pr),
      meanDragOverKepler: pr.meanDragOverKepler, medianDragOverKepler: pr.medianDragOverKepler,
      meanMeasuredOverKepler: pr.meanMeasuredOverKepler, envRIn: pr.envRIn, envROut: pr.envROut });
    // 2項の平均場分離(記述のみ): A_b·x_b^q + A_c·x_c^q = Ω̄(q) を q 2点で解く
    const rBar = probes[0].envMeanR, Rbar = probes[0].RbarClump;
    const xb = Rbar / (Rbar + rBar), xc = rcClump === null ? null : rcClump / (rcClump + rBar);
    const [q1, q2] = probes.map(pr => pr.q), [o1, o2] = probes.map(meanDrag);
    const det = xc === null ? null
      : Math.pow(xb, q1) * Math.pow(xc, q2) - Math.pow(xc, q1) * Math.pow(xb, q2);
    const Ab = det === null ? null : (o1 * Math.pow(xc, q2) - o2 * Math.pow(xc, q1)) / det;
    const Ac = det === null ? null : (Math.pow(xb, q1) * o2 - Math.pow(xb, q2) * o1) / det;
    perScale[`env${s}`] = {
      envScale: s, RbarClump: Rbar, coreRcClump: rcClump,
      envMeanRAtProbeQs: probes.map(pr => ({ q: pr.q, envMeanR: pr.envMeanR })),
      envMeanRSpread: Math.max(...probes.map(pr => pr.envMeanR)) - Math.min(...probes.map(pr => pr.envMeanR)),
      kernels: { xBase: xb, xCore: xc, kernelRadiusBase: Rbar, kernelRadiusCore: rcClump,
        rBarUsed: rBar, rBarSource: `q=${q1} のプローブ実測(envMeanR は q でわずかに動くので片方を採り、` +
          '差は envMeanRSpread に記録する)' },
      omegaDragAtProbeQs: probes.map((pr, i) => ({ q: pr.q, meanOmegaDrag: [o1, o2][i] })),
      separation: { method: '平均場2項 A_b·x_b^q + A_c·x_c^q = Ω̄(q) を q の2点で連立して解いた' +
          '(2式2未知数の線形解。反復・乱数なし)',
        determinant: det, amplitudeBase: Ab, amplitudeCore: Ac,
        coreOverBaseAtQ: NEB_PROBE_QS.map(q => ({ q,
          value: (Ab === null || Ac === null) ? null : (Ac * Math.pow(xc, q)) / (Ab * Math.pow(xb, q)) })),
        caveat: '**記述のみ・判定なし**。真の 🐚 引きずりは粒子対ごとの距離 d_ij に依存する多項和で、' +
          'ここでの2項は「クランプ粒子半径の平均 R̄ を核とする項」と「クランプのコア半径 Rc を核とする項」' +
          'による平均場近似である。分離値は近似モデルのパラメータであって、エンジン内部の量そのものではない' },
    };
  }
  out.zw2.probeTable = table;
  out.zw2.perScale = perScale;
  const sepOk = perScale.env1 && perScale.env2 &&
    perScale.env1.separation.amplitudeBase !== null && perScale.env2.separation.amplitudeBase !== null;
  out.zw2.amplitudeRatioEnv2OverEnv1 = {
    base: sepOk ? perScale.env2.separation.amplitudeBase / perScale.env1.separation.amplitudeBase : null,
    core: sepOk ? perScale.env2.separation.amplitudeCore / perScale.env1.separation.amplitudeCore : null,
    note: 'エンベロープ半径を×2 にすると重み w_ij と正規化 D₀+ΣW が変わる — その振幅寄与の実体' +
      '(第155便 neb.meanFieldNote が「構成間で等しくない」と述べた量)',
  };
  out.zw2.enablesTwoTermForNeb = '本便のプローブは q を2点に振っているので、第155便で ' +
    '「未知2個に対し方程式1本」だった分離が**方程式2本**になり解ける(perScale.*.separation)。' +
    'ただし本便は 🐚 の q₅₀ を実測していないので、🐚 側の2項複合 q₅₀ 予測に対する**判定は行わない**';
  out.zw2.wave154ProbeComparable = '第154便の 🐚 引きずりプローブはプリセット既定 q(=2)の1点だけで' +
    '回っていた。本便の env×1/×2 の q=2.00 プローブはその走行と設定が一致するので、' +
    'crossWaveCheck.additional で bit 照合する';
}

// ---- ZW3c: kF0 × kRep=0 の bit 対照 ----
out.controls = { rule: PRE_REGISTERED.ZW3, bitIdentity: [] };
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

// ---- ZW3b: 第154便(coreshell4)と設定・格子点が一致する走行の bit 一致 ----
// 事前登録の窓本体 = **基準アームの 0.1 格子部分集合(q=1.0,1.1,…,2.0 の11点)**。
// 対照走行・🐚 プローブ(q=2.00)も同じ方法で照合するが、こちらは additional として別集計する。
{
  const pre = [], add = [];
  try {
    const R = CS4.raw || {};
    if (out.raw.bh && R.bh && R.bh.arms && R.bh.arms.base) {
      const mine = out.raw.bh.arms[BH_ANCHOR_KEY].runs, theirs = R.bh.arms.base.runs;
      for (const q of Q_GRID_SHARED_WITH_CS4) {
        const tag = tagQ(q);
        if (mine[tag] && theirs[tag])
          pre.push({ label: `⚫基準アーム(R=15,Rc=7.5) ${tag}`,
            identical: pickJ(mine[tag], dynKeysBH) === pickJ(theirs[tag], dynKeysBH) });
      }
    }
    if (out.raw.ctl && R.ctl) for (const tag of Object.keys(out.raw.ctl.runs)) {
      if (R.ctl.runs[tag]) add.push({ label: `⚫対照 ${tag}`,
        identical: pickJ(out.raw.ctl.runs[tag], dynKeysBH) === pickJ(R.ctl.runs[tag], dynKeysBH) });
    }
    if (out.raw.neb && R.neb && R.neb.controls) for (const tag of Object.keys(out.raw.neb.controls)) {
      if (R.neb.controls[tag]) add.push({ label: `🐚対照 ${tag}`,
        identical: pickJ(out.raw.neb.controls[tag], dynKeysNeb) === pickJ(R.neb.controls[tag], dynKeysNeb) });
    }
    // 🐚 引きずりプローブ: 第154便はプリセット既定 q(=2)の1点。本便の q=2.00 プローブと設定が一致する
    if (out.raw.neb && R.neb && R.neb.dragProbes) {
      const dropRowsJ = (pr) => JSON.stringify({ q: pr.q, RbarClump: pr.RbarClump, envMeanR: pr.envMeanR,
        meanDragOverKepler: pr.meanDragOverKepler, medianDragOverKepler: pr.medianDragOverKepler,
        meanMeasuredOverKepler: pr.meanMeasuredOverKepler, nEnv: pr.nEnv, rows: pr.rows });
      for (const s of NEB_ENV_SCALES) {
        const mine = out.raw.neb.dragProbes[`env${s}_q2.00`], theirs = R.neb.dragProbes[`env${s}`];
        if (mine && theirs && theirs.q === mine.q)
          add.push({ label: `🐚引きずりプローブ env×${s}(q=${mine.q})`,
            identical: dropRowsJ(mine) === dropRowsJ(theirs) });
      }
    }
  } catch (e) { out.crossWaveError = String(e && e.message); }
  const roll = (arr) => ({ comparisons: arr, nCompared: arr.length,
    nIdentical: arr.filter(e => e.identical).length,
    mismatches: arr.filter(e => !e.identical).map(e => e.label),
    allIdentical: arr.length ? arr.every(e => e.identical) : null });
  out.crossWaveCheck = { source: 'tests/out/coreshell4-results.json(第154便)',
    note: '設定・格子点が一致する走行(同一プリセット・同一 seed・同一步数・同一ノブ)の力学フィールド ' +
      'bit 一致。本便の 0.05 刻みのうち第154便に存在しない格子点(1.05・1.15・…)と、本便の新規2アームは' +
      '比較対象外である(第154便に対応走行が無い)',
    preRegisteredSet: roll(pre),
    preRegisteredSetNote: '事前登録 ZW3b が名指しする集合 = 基準アームの 0.1 格子部分集合(11点)',
    additional: roll(add),
    additionalNote: 'kF0×kRep0 対照(⚫・🐚)と 🐚 引きずりプローブ(q=2)。窓文の名指し外なので' +
      '判定は preRegisteredSet で行う',
    nCompared: pre.length + add.length,
    nIdentical: pre.filter(e => e.identical).length + add.filter(e => e.identical).length,
    allIdentical: (pre.length + add.length) ? [...pre, ...add].every(e => e.identical) : null };
  if (QUICK) out.crossWaveCheck.quickNote = '煙試験(CS5_QUICK)では步数が 1/10 なので bit 一致は成立しない';
}

// ---- 転記照合: 本ハーネスの予測器が第155便 JSON の値を再現するか(bit 一致)----
// 第154便の実測アーム(同率 (10,5)・(5,2.5)/ R単独 (10,7.5)・(5,7.5))について、第155便が公開した
// 2項複合・単一項・振幅込み単一項・旧式の予測値を、本ハーネスの転記式で**再計算**して突き合わせる。
// 一致すれば「本便が使っている予測器は第155便の式そのものである」ことの機械証拠になる(シミュレーション不要)。
{
  const rows = [];
  try {
    const r = THEORY.bh.r, anchorQ50 = THEORY.bh.anchorQ50;
    const pOf = (k) => { const a = CS4.raw.bh.profiles[`${k}_q1.50`].params;
      return { R: a.R0, Rc: a.Rc, s: a.s0, f: a.coreMassFrac, Omc: a.coreOmega }; };
    const ref = pOf('base');
    const crit = omegaDragBH(ref, r, anchorQ50);
    const xcRef = kernelCore(ref, r), xbRef = kernelBase(ref, r);
    for (const a of THEORY.bh.arms) {
      if (a.isAnchor) continue;
      const p = pOf(a.armKey);
      const two = solveMonotoneDecreasing((q) => omegaDragBH(p, r, q), crit);
      const mine = { twoTerm: two.q, singleTerm: predSingleTerm(anchorQ50, xcRef, kernelCore(p, r)),
        singleTermAmplitude: predSingleTermAmplitude(anchorQ50, xcRef, ampCore(ref), kernelCore(p, r), ampCore(p)),
        singleTermBaseKernel: predSingleTerm(anchorQ50, xbRef, kernelBase(p, r)),
        legacy: anchorQ50 + (qEffLegacy(p.R, r) - qEffLegacy(ref.R, r)) };
      const theirs = a.predicted;
      rows.push({ armKey: a.armKey,
        identical: ['twoTerm', 'singleTerm', 'singleTermAmplitude', 'singleTermBaseKernel', 'legacy']
          .every(k => mine[k] === theirs[k]),
        mine, theirs });
    }
  } catch (e) { out.transcriptionError = String(e && e.message); }
  out.checks = out.checks || {};
  out.checks.transcriptionReproducesTheory = {
    question: '本ハーネスへ転記した予測式((T1)(T5)・単一項・振幅込み・旧式)と二分法ソルバが、' +
      '第155便 JSON の予測値を bit 一致で再現するか(= 転記が正しいことの機械証拠)',
    method: '第155便と同じ入力(第154便のプロファイル実測パラメータ・第155便のアンカー q₅₀ と r)を' +
      '本ハーネスの関数へ通して再計算し、第155便 JSON の bh.arms[].predicted と厳密比較する' +
      '(シミュレーションは行わない)',
    anchorQ50FromTheory: THEORY.bh ? THEORY.bh.anchorQ50 : null,
    rFromTheory: THEORY.bh ? THEORY.bh.r : null,
    rows, nCompared: rows.length, nIdentical: rows.filter(e => e.identical).length,
    allIdentical: rows.length ? rows.every(e => e.identical) : null };
  out.checks.solverMatchesTheory = {
    mine: SOLVER,
    theory: THEORY.derivation ? THEORY.derivation.solver : null,
    identical: THEORY.derivation ? JSON.stringify(canonize(SOLVER)) === JSON.stringify(canonize(THEORY.derivation.solver)) : null };
}

// ---- ZW3a: 決定性(2回実行ビット同一)----
{
  const target = { raw: out.raw, predictedBeforeMeasurement: out.predictedBeforeMeasurement || null };
  const mine = JSON.stringify(canonize(target));
  const rec = { canonicalization: 'raw(実測部)と predictedBeforeMeasurement(予測部)を対象に' +
      'キーを再帰整列した JSON。走行時間は meta.timings にのみ置き raw には入れていないので、' +
      '除外すべき揮発値はこの対象内に存在しない',
    sha256: sha256(Buffer.from(mine, 'utf8')), bytes: mine.length, reference: null, identical: null };
  const refPath = process.env.CS5_DET_REF;
  if (refPath) {
    // 並行実行(2プロセス同時)に備えて、参照 JSON の生成を待てるようにする(既定 0 秒 = 待たない)。
    // 待ちは determinism の記録にしか関与せず、測定値には一切触れない。
    const waitSec = Number(process.env.CS5_DET_WAIT_SEC || 0);
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
  out.predictionIntegrity.note = '予測ブロックの正準化 SHA-256 を「予測を書き出した時点」と' +
    '「最終書き出し時点」で比較する。一致していれば、実測後に予測を書き換えていないことの機械証拠になる';
}

// ---- ZW まとめ(判定はここに集約 — 数値の実体は上のブロックにある)----
out.zw3 = {
  rule: PRE_REGISTERED.ZW3,
  a_determinism: { sha256: out.determinism.sha256, reference: out.determinism.reference,
    identical: out.determinism.identical,
    result: out.determinism.identical === null ? 'PENDING(参照なし)' : (out.determinism.identical ? 'PASS' : 'FAIL') },
  b_sharedGridBitIdentity: {
    scope: '基準アームの 0.1 格子部分集合(q=1.0,1.1,…,2.0 の11点)vs 第154便 coreshell4',
    nCompared: out.crossWaveCheck.preRegisteredSet.nCompared,
    nIdentical: out.crossWaveCheck.preRegisteredSet.nIdentical,
    allIdentical: out.crossWaveCheck.preRegisteredSet.allIdentical,
    additionalNCompared: out.crossWaveCheck.additional.nCompared,
    additionalAllIdentical: out.crossWaveCheck.additional.allIdentical,
    result: out.crossWaveCheck.preRegisteredSet.allIdentical === null ? 'INCONCLUSIVE'
      : (out.crossWaveCheck.preRegisteredSet.allIdentical ? 'PASS' : 'FAIL') },
  c_kF0kRep0Control: { nPairs: out.controls.bitIdentity.length,
    allDynamicsIdentical: out.controls.allDynamicsIdentical,
    result: out.controls.allDynamicsIdentical === null ? 'INCONCLUSIVE'
      : (out.controls.allDynamicsIdentical ? 'PASS' : 'FAIL') },
};

out.meta.stage = 'complete';
out.meta.elapsedSec = (Date.now() - T_START) / 1000;

// ---- 実験マニフェスト(第145便様式)----------------------------------------------------------
out.manifest = await buildManifest({
  root: ROOT, scriptUrl: import.meta.url, page, browser, payload: out,
  target: TARGET,
  experiment: { id: 'coreshell5', wave: 158,
    title: 'コア外殻第5実験 — 第155便理論(振幅寄与込み予測式・2項複合)の**前向き検証**' +
      '(事前登録窓 ZW1 未実測2構成の q₅₀ 予測 / ZW2 🐚 引きずりプローブ q 2点計装の記述 / ' +
      'ZW3 決定性・第154便との共有点 bit 一致・kF0×kRep0 対照)',
    command: 'node tests/exp-coreshell5.mjs(節選択 CS5_ONLY=… / 出力先 CS5_OUT=… / ' +
      '決定性参照 CS5_DET_REF=… / 煙試験 CS5_QUICK=1)' },
  presets: { mode: 'builtin', ids: ['bhCore', 'nebulaShell'],
    modifiedAtRuntime: 'kFrame / kRep / 影響範囲指数 q / core.omega 倍率 Ω_c を第135便・第139便・第152便・' +
      '第154便と同一の改変器で上書きし、⚫ は bodies[0].radius(中心半径 R)と bodies[0].core.radius' +
      '(コア半径 Rc)を、🐚 はエンベロープ ring の rIn/rOut(半径倍率)を上書きして build する。' +
      '上書きはプリセット実値と異なる場合にのみ行う(改変内容は各 run.cfg / プローブの cfg に記録済み)',
    note: 'seed は各プリセット定義値(⚫20260805 / 🐚20260804)をそのまま使う' },
  numerics: {
    seed: { bhCore: 20260805, nebulaShell: 20260804, note: 'プリセット定義値(改変器は seed を触らない)' },
    dt: 0.016,
    timeScale: 'プリセット既定値(ハーネスは sim.step(dt) を直接呼ぶため積分には掛からない)',
    substeps: NOT_APPLICABLE,
    steps: { bhCore: BH_STEPS, nebulaShell: NEB_STEPS, probes: '1步(幾何は0步)', quick: QUICK },
    window: { bhCore: 't=96(validT・第135便/第139便/第152便/第154便と同一窓)',
      nebulaShell: 't=48(validT・同。本便では対照走行のみ)' },
    warmup: NOT_APPLICABLE,
    sweeps: { qGridAllArms: Q_GRID, sharedWithWave154: Q_GRID_SHARED_WITH_CS4,
      bhCoreArms: BH_ARMS.map(a => ({ key: a.key, group: a.group, R: a.R, Rc: a.Rc, scale: a.scale })),
      nebulaProbeQs: NEB_PROBE_QS, nebulaEnvScales: NEB_ENV_SCALES, profileQs: PROFILE_QS },
    gridUniformity: '**全3アームが同一の21点格子**(1.0〜2.0・0.05 刻み・補間なし)。基準アームも' +
      '同格子で再実測しており、第154便の11点格子の q₅₀ を流用していない',
    q50FitGrid: Q50_GRID,
    solver: SOLVER,
    sectionsRun: ONLY.length ? ONLY : ['(all)'],
  },
  classification: {
    input: ['内蔵プリセットの初期配置・質量・seed(第135便/第139便/第152便/第154便と同一 — 本便で再フィットしない)',
      'dt=0.016', '窓(bhCore 6000步 / nebulaShell 3000步 = 第154便と同一)',
      '掃引点(全アーム共通の21点格子 q=1.0〜2.0・0.05 刻み / ⚫ (R,Rc)∈{(15,7.5),(12.5,6.25),(7.5,3.75)} / ' +
      '🐚 プローブ q∈{1.5,2.0} × エンベロープ半径倍率∈{1,2})— すべて実測前に固定',
      'q₅₀ の当てはめ格子と INCONCLUSIVE 規則(第152便・第154便から不変・実測前に固定)',
      '予測式の関数形((T1)(T5))と二分法ソルバ(第155便 tests/exp-coreshell-theory.mjs からの逐語転記。' +
      '本便の実測より前に確定していた — provenance.inputs に sha256)',
      '**アンカー = 基準アームの実測 q₅₀ 1点**(未知の Ω_crit を代数的に消去するための代入であり、' +
      '残差を最小化する自由度を一つも導入しない — したがって fit ではなく input に置く)',
      '事前登録窓 ZW1 の許容 0.10(実測前に固定・実測後に動かさない)'],
    fit: [],
    derived: ['外殻損失率(q50.arms.*.table)',
      'ロジスティック中点 q₅₀ とプラトー A,B・遷移幅 w(q50 — 実測した損失率曲線の記述統計であり、' +
      '物理モデルの較正自由度ではない。当てはめは決定論的な閉形式+格子探索で、初期値・乱数を持たない)',
      '予測 q₅₀(2項複合・単一項・振幅込み単一項・旧式)と実測との |差|(predictedBeforeMeasurement・zw1)',
      '🐚 平均場2項の振幅分離(zw2.perScale.*.separation — 記述のみ・判定なし)',
      '対照の bit 一致(controls)', '決定性ハッシュ(determinism)',
      '第154便との共有点 bit 照合(crossWaveCheck)',
      '第155便予測値の転記照合(checks.transcriptionReproducesTheory)'],
    holdOut: ['**新規2構成 (R,Rc)=(12.5,6.25)・(7.5,3.75) の実測 q₅₀** — 予測の構成に一切使っていない' +
      '(使うのは基準アームのアンカー1点のみ)。予測は実測前に計算・書き出し済みで、' +
      'predictionIntegrity が事後改変のないことを機械照合する = **事前登録された hold-out** である',
      '旧式 q*_eff=(3/2)(1+R/r) と遠方漸近の臨界指数 3/2(第135便・第139便の外部解析値。本便で' +
      '当てはめ直していない)',
      '第152便・第154便・第155便の実測/解析値(本便は読み取り専用の照合参照としてのみ使い、書き換えない)'],
    note: '事前登録窓(preRegistered)は実測前に固定し実測後に動かしていない。fit は空 = 本便で' +
      '新しい較正自由度を一つも導入していない。第155便が回顧的だった点(式が書かれた時点で対象の' +
      '実測が存在した)を、本便は未実測構成+実測前の予測書き出しで前向きに解消している',
  },
  judgement: {
    pointers: ['preRegistered', 'limits', 'provenance.inputs', 'checks',
      'predictedBeforeMeasurement', 'predictionIntegrity', 'q50.summary',
      'zw1.verdict', 'zw1.comparisons', 'zw2', 'zw3',
      'controls.allDynamicsIdentical', 'determinism', 'crossWaveCheck', 'raw'],
    note: '許容窓は preRegistered(実測前固定)、実測前に固定した予測は predictedBeforeMeasurement' +
      '(改変が無いことは predictionIntegrity)、エンジン実測は raw、q₅₀ は q50、' +
      '主窓の判定は zw1.verdict、記述は zw2、決定性・整合は zw3 にある。' +
      'ZW1 の外部解析値は第155便の 2項複合予測式で、その残差は zw1.comparisons[].absDiff である',
    externalReferences: ['第155便の予測式 (T1) Ω_drag(r;q₅₀)=Ω_crit ・(T5) 2項複合 ' +
      'Ω_drag = s·(R/(R+r))^q + f·(Ω_c−s)·(Rc/(Rc+r))^q(tests/out/coreshell-theory-results.json)',
      '(T3) 単一項アンカー式・(T4) 振幅寄与込み単一項(参考併記)',
      '旧式 実効臨界指数 q*_eff=(3/2)(1+R/r)(第139便 post-hoc → 第152便 XW2 → 第154便 YW1)',
      '遠方漸近の臨界指数 3/2(第135便が同定)'],
  },
  health: {
    conservation: { status: NOT_INSTRUMENTED,
      note: '本ハーネスは保存量残差を記録していない(⚫ の relL は角運動量スケールに対する相対変化として ' +
        'raw に残るが、保存則の主張には用いていない)。数値健全性の代理指標は **kF0×kRep=0 対照の ' +
        'bit 一致**(controls.allDynamicsIdentical)・**第154便との共有点 bit 一致**' +
        '(crossWaveCheck.preRegisteredSet.allIdentical)・**決定性ハッシュ**(determinism.sha256)である' },
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
  log('q₅₀(全アーム同一21点格子): ' + Object.entries(out.q50.summary).map(([k, v]) =>
    `${k}=${fmt(v.q50, 4)}${v.result === 'OK' ? '' : '(' + v.result + ')'}`).join(' / '));
  log(`  全アーム同一格子か: ${out.q50.allArmsSameGrid} / アンカー一致: ${out.q50.anchorMatchesPrediction}` +
    ` / 参考(第154便11点格子の基準 q₅₀): ${fmt(out.q50.baseQ50Wave154Eleven, 4)}`);
}
if (out.zw1.verdict) {
  log(`ZW1 主窓(前向き 2項複合予測・許容 ${PRE_REGISTERED.ZW1.tolerance})→ ${out.zw1.verdict.result}`);
  for (const c of out.zw1.comparisons)
    log(`   ${c.armKey.padEnd(17)} 予測(2項複合)=${fmt(c.predictedQ50.twoTerm)} 実測=${fmt(c.measuredQ50)} ` +
      `|差|=${fmt(c.absDiff)} → ${c.result}` +
      `   [参考 |差| 単一項=${fmt(c.referenceAbsDiff.singleTerm)} 単一項+振幅=${fmt(c.referenceAbsDiff.singleTermAmplitude)} 旧式=${fmt(c.referenceAbsDiff.legacy)}]`);
}
if (out.zw2.probeTable) {
  log('ZW2 記述(窓なし)— 🐚 引きずりプローブ:');
  for (const e of out.zw2.probeTable)
    log(`   env×${e.envScale} q=${e.q} R̄=${fmt(e.RbarClump, 4)} ⟨r⟩=${fmt(e.envMeanR, 3)} ` +
      `Ω̄_drag=${e.meanOmegaDrag.toExponential(6)} Ω̄/Ω_kep=${fmt(e.meanDragOverKepler, 6)}`);
  for (const [k, v] of Object.entries(out.zw2.perScale))
    log(`   ${k} 平均場2項分離: A_base=${v.separation.amplitudeBase === null ? '—' : v.separation.amplitudeBase.toExponential(6)}` +
      ` A_core=${v.separation.amplitudeCore === null ? '—' : v.separation.amplitudeCore.toExponential(6)} (記述のみ)`);
}
log(`予測の不変性(前向き性の証跡): sha256 一致=${out.predictionIntegrity ? out.predictionIntegrity.unchanged : '—'}`);
log(`転記照合(第155便の予測値を再現するか): ${out.checks && out.checks.transcriptionReproducesTheory ? out.checks.transcriptionReproducesTheory.nIdentical + '/' + out.checks.transcriptionReproducesTheory.nCompared : '—'}`);
log(`ZW3a 決定性 sha256=${out.determinism.sha256} identical=${out.determinism.identical}`);
log(`ZW3b 第154便 共有点 bit 一致(事前登録集合)${out.zw3.b_sharedGridBitIdentity.nIdentical}/${out.zw3.b_sharedGridBitIdentity.nCompared} → ${out.zw3.b_sharedGridBitIdentity.result}` +
  `(追加集合 ${out.crossWaveCheck.additional.nIdentical}/${out.crossWaveCheck.additional.nCompared} allIdentical=${out.crossWaveCheck.additional.allIdentical})`);
log(`ZW3c kF0×kRep0 対照 allDynamicsIdentical=${out.controls.allDynamicsIdentical} → ${out.zw3.c_kF0kRep0Control.result}`);
log(`saved: ${path.relative(ROOT, OUT_PATH)} (総実行 ${(out.meta.elapsedSec / 60).toFixed(1)} 分)`);
await browser.close();

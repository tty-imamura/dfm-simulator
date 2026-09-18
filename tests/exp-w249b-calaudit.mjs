// 第249便b W2「現実較正サンプルの棚卸し」(第41報「現実較正分類の各サンプルについて、観測版も DFM 版も
//   同様に、合っているのか、合っていないなら何がどの程度合わないのか、合わない度合いに相関する観測値は
//   どれか、を調査する」)。
//
// **エンジンの物理は 1 bit も読み書きしない**。内蔵プリセットをそのまま build して測るだけである。
//
// ■ 何をするか
//   1) `HP.allPresets()` の `sampleClass:"calibration"` 全 31 本を列挙する。
//   2) 各サンプルの**観測参照を機械的に取り出す**: obsCard の `obs` 欄(と `model` 欄)を数値パーサに
//      通し、claims の `expected` 窓を併せて読む。手で数値を打ち直さない。
//   3) 同じ検出器で実測する:
//        ・公転周期 **2 定義** — 近点間(検出器 A=ṙ の −→+ 交差 / B=距離極小の放物線頂点)と
//          **同方向 1 周**(相対角の 2π 交差)。外部レビュー の「周期の定義が残差の符号まで変える」の
//          機械確認。
//        ・離心率 e(半径比 proxy (r_max−r_min)/(r_max+r_min))。
//        ・近点移動 °/周(検出器 A/B の 2 方式・直線 fit の残差も出す)。
//        ・接触要素(osculating)の a と P — 1 公転が予算に収まらない衛星はこちらで出す
//          (💠 の obsCard が「転写診断」で使っているのと同じ規約)。
//        ・自転(殻 spin)とコア Ω の保持、環/衛星の周期。
//   4) 判定を **5 区分**(合/窓/否/従/転)で付ける。観測誤差が読めた量は誤差で機械判定し、
//      無い量は **±1% を「目安」**として使う(一律の百分率を確定基準にはしない — 出力に明記する)。
//   5) 相関量(ν・χ・GM/(ac²)・a/R・e・Ω_spin/n)を t=0 の宣言から算出し、残差との
//      **Spearman 順位相関**を DFM 版だけで取る(少数サンプル — 相関≠原因)。
//
// ■ 走行長(すべて出力 JSON に記録する)
//   dt は**アプリ既定の 0.016**(index.html の const DT)と、その半分 0.008 の 2 段。
//   dt/2 段は軽いサンプル(実行時 n≤12)だけに絞る(重い環・多体は時間予算に収まらないため — 明記)。
//   1 サンプルあたりの步数は「実測した步/秒 × 時間予算」で決め、上限 60 公転。
//   1 公転が予算に収まらない対象は接触要素だけを出し、`method:"osculating"` と記録する。
//
// 実行: node tests/exp-w249b-calaudit.mjs [--fast] [--only id1,id2] [--budget 80] [--dt3] [--merge]
//       [--dt3-registry]  … 第265便a(Z14): 3 段の**恒久登録表**の系だけを --dt3 で回す。
//                            **--merge と併用する**(単独だと登録外の系が出力から落ちる)。
//       --budget … 1 段あたりの**計算時間**の予算(秒・既定 80 — 第257便d で 30 から上げた)。
//                  重いサンプルは ×3。精度条件ではない(窓が埋まらなければ「未測定」のまま)。
//       --fast   … dt/2 段を全部省く
//       --only   … サンプルを絞る(デバッグ用)
//       --dt3    … 第255便d(第47報 N8): **dt/4 段を足して 3 段にする**。3 段が揃うと ε_num の定義が
//                  |Q_h−Q_{h/2}|(感度診断)から **|Q_h−Q_{h/4}|** へ変わり、観測次数
//                  p_obs=log₂|(Q_h−Q_{h/2})/(Q_{h/2}−Q_{h/4})| が `numBoundDecl.order` に入る。
//                  第253便b の保留条件(3 段+正の次数)を満たした量だけが「数値未解決」から出る。
//                  時間予算が 3 倍以上になるので、`--only` で系を絞って `--merge` するのが標準。
// 出力: tests/out/calaudit-w249.json(QA `docs.calaudit-sync` が id 集合と verdict 語彙を照合する)
//
// ■ **再現手順**(第270便a・AE8 —— 正本はここと docs/CALIBRATION_VERDICT_v1.44.md §5.16 である)
//     ① 通常走行(**全プリセット・--merge なし**):
//          PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w249b-calaudit.mjs
//     ② 3 段の登録表だけを 3 段で回して**差し替える**:
//          PLAYWRIGHT_CORE_DIR=… node tests/exp-w249b-calaudit.mjs --dt3-registry --merge
//     ③ σ 接続器を掛け直す: node tests/exp-w262d-solarsigma.mjs
//   **`--regate` の産物を正本にしない**。--regate は「既に繋がっている σ が動いたか」だけを答える
//   再判定専用の経路で、`applySigma` を通らない(= 宣言・単位換算・新しい宛先は反映されない)。
//   元測定の来歴は `--regate` の前の走行にしかないので、**判定を動かす変更のあとは ① から回す**。
//   **--merge の鍵**(`out.mergeKey`)は preset id だけではない: 入力 CSV の SHA・宣言ファイルの SHA・
//   近点窓・基準刻み・停止条件の版・抽出器の版・対象 HTML を持ち、**1 つでも違う記録が混ざれば器を止める**。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// 第258便d(第50報 W4): 条件不一致の隔離・証拠付き予測・ε_num の推定誤差・deg/yr の門は
// **純関数**として tests/lib-w258d-evidence.mjs に置き、QA が同じ 1 本を読む。
import { GATE, VERDICT_CONDITION, VERDICTS6, YEAR_SEC, enforceAllConditions,
  predictionEligible, refinedNumBound, degPerYear, assessDegYearGate,
  // 第259便d(第51報 W4): 証拠付き予測の**記録器**(枠だけ — 中身は空で出荷する)
  emptyEvidenceRegistry, recordEvidence, applyEvidenceRegistry,
  validatePredictionEvidence } from './lib-w258d-evidence.mjs';
// 第264便d(第56報 W4・統括の裁定 X6/X7/⑥): `sigma_primary` の印の**厳密読み**(語境界+凡例除外+先頭一致)・
// `verified_by` の規約読み・`sigma_kind`(informational な尺度)を **1 本の純関数**にまとめた。
// 門・σ 接続器・会計器の 3 器が**同じ 1 本**を読む(読み方が器ごとに違わないようにする)。
import { isSigmaPrimaryVerified, legacyIsSigmaPrimaryVerified, readSigmaMark,
  readVerifiedBy, readSigmaKind } from './lib-w264d-sigmamark.mjs';
// 第268便a(第58報 W1・統括の読み (C)): **σ の宛先表 3 つ**(`SIGMA_BODY` / `SIGMA_QUANT` /
// `SIGMA_TARGET_BODY`)は、本器の中で定義するのをやめて **副作用の無い共通モジュール**へ移した。
// 中身は 1 文字も変えていない(コメントごと移した)。アナロジー器と QA が**この表そのもの**を
// 読むようになり、器のソース文字列検索(`CAL_SRC.indexOf("'47 Tuc'")`)は廃止した。
import { SIGMA_BODY, SIGMA_QUANT, SIGMA_TARGET_BODY } from './lib-sigma-destinations.mjs';
// 第268便a(統括の読み (D)・AB2): **採用観測解の明示宣言**(body|quantity → 採用行)。
// 宣言の無い対象は従来どおり**ファイル順の最初**の行を採る(後方互換)。
// 第270便a(AD5): 宣言は**正式経路**へ入った(`mode:'applied-AD5'`)。
// 第270便a(AD8): 換算 ϖ̇ = Δϖ × YEAR / P_peri は `precessionDegPerYear`(同じ近点集合の周期で割る)。
import { loadJudgementSources, pickDeclaredRow, precessionDegPerYear } from './lib-w268a-judgement.mjs';
// 第270便b(第60報 W2・AE2): CSV は**列位置でなくヘッダ名**で読む(`record_id` の列追加で壊れない)。
import { loadObsCsv as loadObsCsvByHeader } from './lib-w270b-obscsv.mjs';
// 第270便a(AE9): **走行の停止条件**(步数上限と必要近点数の宣言)。壁時計は資源上限にだけ残す。
import { stopRuleFor, stopDecision, machineIndependenceProbe, STOP_RULE_VERSION,
  WALL_CEILING_SEC_DEFAULT, PRESET_MAX_STEPS, PRESET_NEED_PERIASTRA,
  CLASS_MAX_STEPS, STOP_RULE_SPEC } from './lib-w270a-stoprule.mjs';
import crypto from 'node:crypto';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'calaudit-w249.json');
const argv = process.argv.slice(2);
const FAST = argv.includes('--fast');
const MERGE = argv.includes('--merge');   // --only で一部だけ回して既存 JSON へ差し替える(再判定用)
// 第263便c(第55報 W3): **--regate**。**エンジンを 1 步も走らせず**、既存の出力 JSON
// (tests/out/calaudit-w249.json)を読み直し、**CSV の σ の転写と門(assessObservation)だけを
// 掛け直す**。観測レコードの intake で CSV が動いたときに「門の σ が動いたかどうか」を
// 数で確かめるための経路である。**測定値は 1 bit も作らない・書き換えない** ——
// 動くのは q.obsSigmaCsv / q.sigmaSource / q.gate と、そこから作る集計だけである
// (--merge と違って走行の差し替えが無いので、dt3 の段・観測次数・過去の走行はそのまま残る)。
const REGATE = argv.includes('--regate');
let ONLY = (() => { const i = argv.indexOf('--only'); return (i >= 0 && argv[i + 1]) ? argv[i + 1].split(',') : null; })();
let DT3 = argv.includes('--dt3');         // 第255便d(N8): dt/4 段を足して 3 段+観測次数を出す
// 第265便a(裁定 Z14): **--dt3-registry** —— 下の `THREE_STAGE_REGISTRY` に登録した系だけを 3 段で回す。
// 「どれが 3 段対象だったか」を次の便が探し直さないための近道である(--only を手で並べるのと同値)。
const DT3_REGISTRY = argv.includes('--dt3-registry');
// 第258便d(第50報 W4): **h8 検査点**。--dt8 id1,id2 で指定した系にだけ dt/8=0.002 の 4 段目を足す。
// 目的は 2 つ: (a) 3 段で出した観測次数 p_obs が h をもう 1 段細かくしても同じか(漸近域に居るか)、
// (b) |Q_h−Q_{h/4}|/(1−4^−p) という**推定誤差**が、実際に測った |Q_{h/2}−Q_{h/8}| と整合するか。
// **予算の都合で 1 系だけ走らせる**(⚡)。走らせていない系は「未走行」と書く(推定で埋めない)。
const DT8 = (() => { const i = argv.indexOf('--dt8');
  return (i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--')) ? argv[i + 1].split(',') : null; })();
// 第259便d(第51報 W4): **証拠付き予測の記録器**。`--record-evidence <file.json>` で
// `{ "<gate.key>": {dataset, commit, harness, window, recordedAt}, … }` を読み、
// 検証を通った宣言だけを量へ配る。**既定は 0 件**(ファイルを渡さなければ枠だけが出る)。
// 過去に測った値を後から「fit に使っていない」と宣言することはしない —— それは後付けの hold-out で、
// 「観測値を見る前に手順を凍結した」という hold-out の意味が失われる。宣言は**測る前**に入れる。
const EVIDENCE_FILE = (() => { const i = argv.indexOf('--record-evidence');
  return (i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--')) ? argv[i + 1] : null; })();
// 第257便d(第49報・3 審査 v15 一致): **dt/4 段の時間予算の既定を 30 s → 80 s にする**。
// これは**計算時間の予算**であって精度条件の緩和ではない —— 第256便d は 🧶 の dt/4 を
// `--budget 80` で走らせないと 20 近点窓が埋まらず(予算 30 s では 15 公転で切れて 2 段に落ちた)、
// 「窓が埋まらない」が既定値の副作用として現れていた。予算・dt・近点数は**別の欄**でログし
// (timeBudget)、窓が埋まらずに終わった行は `unmeasuredReason:"time-budget"` を立てる
// (= **機種依存の時間で結果が変わった**ことを、数値の性質と混ぜずに記録する)。
// 第270便a(第60報 W1・AE9): **この時間予算は走行長を決めるのをやめた**。
// 走行長は `tests/lib-w270a-stoprule.mjs` の**宣言**(步数上限 + 必要近点数)で決まり、
// **步/秒も壁時計も入らない**(機種が違っても同じ步数・同じ近点数になる)。
// 壁時計はここから下では**資源上限**(`--wall-ceiling` 既定 900 s)としてだけ効く ——
// 超えた段は `resource-limit` で unmeasured にし、**途中までの軌道を最終判定へ流さない**。
// 旧欄(`budgetSecLight` / `timeBudget`)は**記録として残す**(機種依存の量であることを明記する)。
const BUDGET_DEFAULT = 80;
const BUDGET_LIGHT = (() => { const i = argv.indexOf('--budget'); return (i >= 0 && argv[i + 1]) ? Number(argv[i + 1]) : BUDGET_DEFAULT; })();
const BUDGET_HEAVY = BUDGET_LIGHT * 3;
const WALL_CEILING_SEC = (() => { const i = argv.indexOf('--wall-ceiling');
  return (i >= 0 && argv[i + 1]) ? Number(argv[i + 1]) : WALL_CEILING_SEC_DEFAULT; })();
const ORB_MAX = 60;            // 直接法(近点間・同方向1周)で数える上限公転数
// 第252便b(第44報): **近点間周期の窓は「最初の 20 近点(19 区間)」に固定**する(宣言であって
// 自動判定ではない)。走行長で窓が変わっていたのが第251便 統括の残した窓感度 0.66pt の源である。
// 第253便b(第45報 L6): **窓感度そのものは未計測のままである** —— 窓を 20・30・40 近点と振って
// 値がどう動くかは測っていない。窓は**全系で 20 近点に固定**したので系間の比較は揃うが、
// 「20 が十分な長さか」は本便でも確かめていない(未計測を未計測と書く)。
const PERI_WINDOW = 20;
const DT0 = 0.016;             // アプリ既定(index.html の const DT)

// ---------------------------------------------------------------- サンプル別の対象宣言
// 中心と周回体は**プリセットの宣言 body index**(ring は count 個へ展開されるので、走行前に
// 宣言 index → 実行 index の対応表を機械的に作る)。ラベルは obsCard の q 欄との突き合わせに使う。
const CFG = {
  earthMoonReal:      { c: 0, o: [[1, '月']] },
  earthMoonRealKF1:   { c: 0, o: [[1, '月']] },
  emAuditNewton:      { c: 0, o: [[1, '月']] },
  emAuditDFM:         { c: 0, o: [[1, '月']] },
  emAuditSolar:       { c: 1, o: [[2, '月']] },
  qLockRadialAudit:   { c: 0, o: [[1, '最内'], [8, '参照点']] },
  qLockRadialAuditQ3: { c: 0, o: [[1, '最内'], [8, '参照点']] },
  mercuryReal:        { c: 0, o: [[1, '水星']] },
  mercuryRealKF1:     { c: 0, o: [[1, '水星']] },
  solarInner:         { c: 0, o: [[1, '水星'], [2, '金星'], [3, '地球'], [4, '火星']] },
  jupiterGalilean:    { c: 0, o: [[1, 'イオ'], [2, 'エウロパ'], [3, 'ガニメデ'], [4, 'カリスト']] },
  venusReal:          { c: 0, o: [[1, '金星']] },
  marsMoonsReal:      { c: 0, o: [[1, 'フォボス'], [2, 'ダイモス']] },
  plutoCharonReal:    { c: 0, o: [[1, 'カロン']] },
  uranusReal:         { c: 0, o: [[1, 'ミランダ'], [2, 'アリエル'], [3, 'ウンブリエル'], [4, 'チタニア'], [5, 'オベロン']] },
  neptuneReal:        { c: 0, o: [[1, 'トリトン']] },
  alphaCenAB:         { c: 0, o: [[1, 'B']] },
  alphaCenABDFM:      { c: 0, o: [[1, 'B']] },
  siriusAB:           { c: 0, o: [[1, 'B']] },
  siriusABDFM:        { c: 0, o: [[1, 'B']] },
  psrDoubleAB:        { c: 0, o: [[1, 'B']] },
  psrDoubleABDFM:     { c: 0, o: [[1, 'B']] },
  psrDoubleABSpinCal: { c: 0, o: [[1, 'B']] },
  psrJ1757DFM:        { c: 0, o: [[1, 'B']] },
  psrJ1946DFM:        { c: 0, o: [[1, 'B']] },
  // 第249便a の λ_PN=1/f variant(⚡🧮🩺 と同じ器で測る — 近点移動は候補の応答そのものなので「従」にしない)
  psrDoubleABPN:      { c: 0, o: [[1, 'B']] },
  psrJ1757PN:         { c: 0, o: [[1, 'B']] },
  psrJ1946PN:         { c: 0, o: [[1, 'B']] },
  // 第251便a の compactForce variant(案K)と第 4 の凍結 hold-out PSR B1534+12(観測/DFM/CF の 3 版)
  psrDoubleABCF:      { c: 0, o: [[1, 'B']] },
  psrJ1757CF:         { c: 0, o: [[1, 'B']] },
  psrJ1946CF:         { c: 0, o: [[1, 'B']] },
  psrB1534:           { c: 0, o: [[1, 'B']] },
  psrB1534DFM:        { c: 0, o: [[1, 'B']] },
  psrB1534CF:         { c: 0, o: [[1, 'B']] },
  gw150914:           { c: 0, o: [[1, 'B']] },
  gw150914DFM:        { c: 0, o: [[1, 'B']] },
  gw150914Merge4s:    { c: 0, o: [[1, 'B']], orbMax: 3, note: '合体サンプル(外部放射オーバーレイ)— 3 公転で打ち切る' },
  saturnZonalD68:     { c: 0, o: [[1, 'D68']] },
  saturnRingReal:     { c: 0, o: [[4, 'ミマス'], [9, 'タイタン']], ringInner: 'C環内縁' },
  saturnRingRealKF1:  { c: 0, o: [[4, 'ミマス'], [9, 'タイタン']], ringInner: 'C環内縁' },
};

// ---------------------------------------------------------------- 第265便a(第57報 W1・裁定 Z14)
// **3 段(dt/4)の恒久登録表**。`--dt3` を付けた走行で 3 段を走らせる対象として**宣言列挙**する
// (自動判定はしない —— 対象は宣言である)。`since` は登録した便で、**登録は合格の宣言ではない**。
// 走行のたびに out.threeStageRegistry が「3 段で走ったか・σ の宛先が立ったか・3σ を通ったか」を数える。
const THREE_STAGE_REGISTRY = [
  { id: 'psrDoubleABDFM', since: '第255便d', why: 'NS 4 系(第47報 N8)' },
  { id: 'psrJ1757DFM', since: '第255便d', why: 'NS 4 系(第47報 N8)' },
  { id: 'psrJ1946DFM', since: '第255便d', why: 'NS 4 系(第47報 N8)' },
  { id: 'psrB1534DFM', since: '第255便d', why: 'NS 4 系(第47報 N8)' },
  { id: 'alphaCenAB', since: '第256便d', why: '恒星 4 系(第48報)' },
  { id: 'alphaCenABDFM', since: '第256便d', why: '恒星 4 系(第48報)' },
  { id: 'siriusAB', since: '第256便d', why: '恒星 4 系(第48報)' },
  { id: 'siriusABDFM', since: '第256便d', why: '恒星 4 系(第48報)' },
  { id: 'psrDoubleAB', since: '第256便d', why: '📻 観測版(第48報)' },
  // 第264便a(X14)で σ の宛先を足して 3 段を走らせた 5 本。**本便で恒久登録する**(裁定 Z14)。
  { id: 'psrDoubleABCF', since: '第265便a(Z14)', why: 'X14 の 5 本(第264便a で σ 宛先を接続)' },
  { id: 'psrJ1757CF', since: '第265便a(Z14)', why: 'X14 の 5 本(第264便a で σ 宛先を接続)' },
  { id: 'psrJ1946CF', since: '第265便a(Z14)', why: 'X14 の 5 本(第264便a で σ 宛先を接続)' },
  { id: 'psrB1534', since: '第265便a(Z14)', why: 'X14 の 5 本(第264便a で σ 宛先を接続)' },
  { id: 'psrB1534CF', since: '第265便a(Z14)', why: 'X14 の 5 本(第264便a で σ 宛先を接続)' },
  // 第270便a(第60報 W1・AD8): **📡 D68 を登録する**。第269便a の器(tests/exp-w268a-d68.mjs)が
  // AD4 の収束規約(3 段・窓充足・抽出健全・次数>0・ε̂ と 2 段差 ≤0.3σ)を満たしたので、
  // **換算後(傾きと同じ近点集合の P_peri で割った ϖ̇ [deg/yr])の判定を正式な門へ繋ぐ**。
  // **登録は合格の宣言ではない** —— 登録した結果どちらへ動くかは走らせて測る。
  { id: 'saturnZonalD68', since: '第270便a(AD8)',
    why: 'AD4 の収束規約を満たした換算後判定の正式接続' },
  // 第271便a(第61報・AF2): **❄️ カロンの公転周期を 3 段登録する**。第270便a の AD5 で
  // 採用観測解が Buie et al. 2012 Table 5 の two-body Keplerian(551856.43872 ± 0.02592 s)に
  // なったが、3 段(dt/4)を走らせていないので `convergence.ok` が立たず「数値未解決(=保留)」
  // だった。**同じ停止条件・同じ周期抽出契約で 3 段を測る**ための登録である。
  // **登録は合格の宣言ではない** —— 3 段を測った結果どうなるかは走らせて測る
  // (残差そのものは大きいが、**測る前に「否」と書かない**)。
  // 走らせる前に步数を計算した: dt 段 20,694,498 步(60 公転)・dt/2 41,388,996・dt/4 82,777,992 で、
  // **後ろ 2 段は階級上限 40e6 を超える**ので `PRESET_MAX_STEPS` に 60 公転ぶんを宣言した(AF3)。
  { id: 'plutoCharonReal', since: '第271便a(AF2)',
    why: 'AD5 で採用した Buie 2012 の P(551856.43872±0.02592 s)を同じ停止・周期抽出契約で 3 段測る' },
];
const THREE_STAGE_IDS = new Set(THREE_STAGE_REGISTRY.map((z) => z.id));
// ---------------------------------------------------------------- 第270便a(第60報 W1・AD8)
// **換算後の量で正式判定する系の宣言表**(自動判定ではない)。近点移動の判定量を
// °/周 から **ϖ̇ [deg/yr]** へ写し、CSV の deg/yr の値と σ を**換算せずそのまま**門へ渡す。
// 換算の分母は **傾き fit と同じ近点集合**の近点間周期(第269便a の契約・`pPeriSameWindowSec`)で、
// 窓が足りない段は**換算しない**(短い窓へ置換しない = 未測定)。
// **換算前の行(°/周)は `q.previousUnit` に温存する** —— σ 接続器の切断点 `unit-not-converted` は
// 換算していない他の系(☄️🪨🌞 の水星)で**対照として残る**。
const AD8_CONVERT = new Set(['saturnZonalD68']);
if (DT3_REGISTRY) {
  DT3 = true;
  ONLY = ONLY ? ONLY.filter((z) => THREE_STAGE_IDS.has(z)) : Array.from(THREE_STAGE_IDS);
  console.error('[w265a] --dt3-registry: 登録表の ' + ONLY.length + ' 本を 3 段で回す(--merge の併用を推奨)');
}

// 理論対照(観測較正ではない — preset 側の referenceKind 宣言と同じ集合)
const THEORY_CONTROL = ['qLockRadialAudit', 'qLockRadialAuditQ3', 'emAuditNewton'];
// 較正の従属量(第248便b の現行判定): NS 連星 DFM 版の近点移動は較正質量 f≈2 の帰結であって独立予言ではない
const DEPENDENT = { psrDoubleABDFM: ['precession'], psrJ1757DFM: ['precession'], psrJ1946DFM: ['precession'],
  psrB1534DFM: ['precession'] };   // 第251便a: 第 4 の凍結 hold-out の DFM 版も同じ構造(較正質量 f≈2 が 1PN へ入る)

// ---------------------------------------------------------------- 第251便c(第43報 W3・ChatGPT §8.1)
// **周期の定義契約**(裁定 I6 の次段)。パルサータイミングの離心連星では、観測の P_b は
// **近点間の平均周期**として定義されている。棚卸しの検出器はこれまで「同方向1周」を優先し、
// 取れなければ接触要素へ落としていたが、**大きく歳差する軌道では両者が数 % 違う**ので、
// 定義の取り違えがそのまま系統誤差になる(🪐 D68 で 2.0% — 第250便c の近点移動換算で判明済み)。
// そこで、**明示した ID の離心タイミング連星に限り**判定を近点間周期へ固定する:
//   ① 判定量は近点間周期(検出器A)。同方向1周は別欄に残す(residualPctRev)。
//   ② dt/2 段の ε_num も**同じ定義**で作る(rawMeas 側も近点間)。
//   ③ 検出器 A/B は**同じ近点間周期どうし**で比べる(detPairSec)。
//   ④ 近点が測れない対象は**他の周期へ黙って置換しない** — 「未測定」を返す(meas=null → 転)。
// **視覚連星・円軌道・惑星/衛星系は従来どおり**(同方向1周 → 接触要素)。ID は明示列挙であって
// 自動判定ではない(「離心率がいくつ以上」のような閾値は置かない — 定義は宣言である)。
const ECC_TIMING_BINARY = new Set([
  'psrDoubleAB', 'psrDoubleABDFM', 'psrDoubleABSpinCal', 'psrDoubleABPN',   // 📻⚡🧿🪶 J0737−3039A/B
  'psrJ1757DFM', 'psrJ1757PN',                                             // 🧮🪃 J1757−1854
  'psrJ1946DFM', 'psrJ1946PN',                                             // 🩺🪀 J1946+2052
  // PSR B1534+12 系(第251便c 時点では**プリセットが無い** — CSV に観測行だけがある)。
  // 将来サンプルを起こしたときに定義契約が自動で効くよう、ID を先に置いておく。
  'psrB1534', 'psrB1534DFM', 'psrB1534PN',
  // 第252便(統括): 第251便a の案K variant(CF)を追加 — 同じ系の DFM 版が近点間判定なのに CF 版だけ
  // 同方向 1 周で判定していた不整合(第252便b の指摘)を解消する。定義契約は同じ(宣言列挙・自動判定なし)。
  'psrDoubleABCF', 'psrJ1757CF', 'psrJ1946CF', 'psrB1534CF',
]);

// ---------------------------------------------------------------- 第251便c(第43報 W3・ChatGPT §8.1)
// **観測 σ の転写**。paper/data/solar-observations.csv に本便で足した **sigma 列**(末尾列 —
// 既存 8 列の並びは 1 バイトも動かしていないので、cols[0..7] で読む既存の器はそのまま動く)から
// 観測誤差を読み、obsCard の文面に ± が書かれていない量へ充填する。**CSV が正本**で、この検証器
// には観測数値を 1 つも書かない(手打ちの数字を増やさない)。同じ量に複数の版レコードがある系
// (J1757/J1946 の 2026 年版)は**最初の行**だけを採る — プリセットが使っているのがその行だから。
// sigma_primary=verified/unverified は CSV の note に書いてある機械可読な印で、門の sourceVerified
// (一次表の照合が済んでいるか)へそのまま渡す。
// 第264便d(X6): `primaryVerified` は **`lib-w264d-sigmamark.mjs` の厳密読み**で決める
// (語境界 + 第251便c の凡例文を除外 + 先頭一致)。旧読み(部分一致)との差は `sigmaMarkAudit` に残す。
const sigmaMarkAudit = { rows: 353, legacyVerified: 0, strictVerified: 0, flips: [],
  verifiedByMissing: [], legendRows: 0,
  rule: '語境界つきの `sigma_primary=<語>` を全部拾い、直後が `means` の出現(第251便c の凡例)を除いた'
    + '**最初の出現**を行の印とする。無印は verified ではない。',
  note: '**印を上げ下げしていない** —— 読み方を直しただけである(`verified` にするのは原仮定者の照合)。' };
function loadSigmaTable() {
  // 第270便b(AE2): **ヘッダ名で読む**(列位置で読まない)。`record_id` 欄が末尾に付いても
  // 中間に列が挿さっても、読む欄は名前で決まる。読み方そのものは 1 つも変えていない。
  const loaded = loadObsCsvByHeader(path.join(ROOT, 'paper', 'data', 'solar-observations.csv'));
  if (loaded.missing.length)
    throw new Error('[w249b] solar-observations.csv に必須列が無い: ' + loaded.missing.join(','));
  const m = new Map();
  const all = [];
  sigmaMarkAudit.rows = 0;
  for (const r of loaded.rows) {
    const note = r.note || '';
    const hasSigmaCell = r.rawSigma !== '';
    // ---- 第264便d(X6): 厳密読みと旧読みの差を全行で数える(**判定の前に数える**)----
    sigmaMarkAudit.rows++;
    const mk = readSigmaMark(note), lg = legacyIsSigmaPrimaryVerified(note);
    if (mk.legend.length) sigmaMarkAudit.legendRows++;
    if (lg) sigmaMarkAudit.legacyVerified++;
    if (mk.verified) sigmaMarkAudit.strictVerified++;
    if (mk.verified !== lg) sigmaMarkAudit.flips.push({ body: r.body, quantity: r.quantity,
      legacy: lg ? 'verified' : 'unverified', strict: mk.mark, hasSigma: hasSigmaCell });
    // ---- 第264便d(X7): `verified` なのに `verified_by=` が無い行(**警告**であって拒否ではない)----
    const vb = readVerifiedBy(note);
    if (vb.warn) sigmaMarkAudit.verifiedByMissing.push({ body: r.body, quantity: r.quantity,
      hasSigma: hasSigmaCell });
    const key = r.body + '|' + r.quantity;
    const kind = readSigmaKind(note);
    const rec = { body: r.body, quantity: r.quantity, value: Number(r.rawValue), unit: r.unit,
      // 第264便d: **空欄の value を 0 と読ませない**(`Number('')` は 0 である)。
      valueRaw: (String(r.rawValue).trim() !== '') ? Number(r.rawValue) : null,
      source: r.source, sigma: r.sigma,
      // 第270便b(AE2): **同定の鍵**(印でも σ でもない)。宣言の `record_id` はこれに当たる。
      recordId: r.recordId || null, ln: r.ln,
      primaryVerified: isSigmaPrimaryVerified(note),
      verifiedBy: vb.present ? vb.who : null, verifiedAt: vb.at, verifiedValue: vb.value,
      sigmaKind: kind.kind, infoScale: kind.scale, infoScaleKind: kind.scaleKind,
      digits: kind.digits, note };
    // 第268便a: **採用観測解の明示宣言**は候補行(`_candidate` という別の鍵・同じ鍵の 2 行目以降)を
    // 指すことがあるので、全行の一覧も残す(**判定の既定はこれまでどおり「最初の行」である**)。
    all.push(rec);
    if (m.has(key)) continue;                       // **最初の行**を採る(別版レコードは混ぜない)
    m.set(key, rec);
  }
  return { map: m, all };
}
const SIGMA_LOAD = (() => { try { return loadSigmaTable(); }
  catch (e) { console.error('[w249b] sigma 表が読めない: ' + String(e).slice(0, 140));
    return { map: new Map(), all: [] }; } })();
const SIGMA_TABLE = SIGMA_LOAD.map;
const SIGMA_ROWS_ALL = SIGMA_LOAD.all;
// 第268便a(統括の読み (D)・AB2): **採用観測解の宣言表**(`paper/data/judgement-sources.json`)。
// 宣言の無い body|quantity は**従来どおりファイル順の最初の行**を採る(後方互換)。
const JUDGEMENT_SOURCES = loadJudgementSources(path.join(ROOT, 'paper', 'data', 'judgement-sources.json'));
// 第269便a(統括の読み (F)): **不正スキーマ・重複宣言は入力エラーとして器を止める**。
// 黙って「宣言なし」に落として走行を続けると、**どの行で判定したかが JSON から読めなくなる**。
if (!JUDGEMENT_SOURCES.ok) {
  throw new Error('[w249b] judgement-sources.json が不正: ' + (JUDGEMENT_SOURCES.error || '(理由なし)'));
}
// ---------------------------------------------------------------- 第268便a(第58報 W1・統括の読み (C))
// **3 つの宣言表(`SIGMA_BODY` / `SIGMA_QUANT` / `SIGMA_TARGET_BODY`)は
// `tests/lib-sigma-destinations.mjs` へ移した**(中身は 1 文字も変えていない — コメントごと移した)。
// 移設の理由: 同じ表を**器のソースの文字列検索**で読んでいた場所が 2 つあり(アナロジー器と QA)、
// コメント中の body 名にも当たる読み方だった。宣言表そのものを import すればその曖昧さは消える。
// **接続候補の判定**(`gateWiringCensus`)も同じモジュールに置いてある。

// ---------------------------------------------------------------- 第257便d(第49報・3 審査 v15)
// **観測量対応の宣言表**(自動判定ではない — 宣言である)。
// 門の `mappingResolved` は「**シミュレータが測っている量**と、**CSV/obsCard の観測が指す量**が
// 同じ測定量か」だけを見る。合わないことの弁解ではなく、**定義の違う 2 量の差を棄却 σ として
// 読まないため**の欄である。ここに載らない kind は「対応は確定」として扱う。
//   ・**ecc(全行)**: 判定に使っているのは 1 周目の**距離の極値**から作る比
//     (r_max−r_min)/(r_max+r_min) = `eProxy` である。観測側は
//       - タイミング連星 … DD/DDGR の**時間離心率 e_T**(タイミングモデルのパラメータ)
//       - 視覚連星 … астrometric な軌道 fit の**ケプラー要素 e**
//     いずれも「1 周の距離の極値の比」ではない(歳差・PN・有限窓の下では別物になる)。
//     **どちらが正しいかではなく、対応が未確定である**。棄却 σ を読むにはこの写像が要る。
// 以下は「対応は確定している」と宣言した量(理由も併記する):
//   ・period(離心タイミング連星) … 近点間周期 ⇄ 観測の P_b(近点間の平均周期)。第251便c の定義契約。
//   ・period(視覚連星) … 同方向 1 周 ⇄ 軌道 fit の公転周期。
//   ・precession … 近点方位の直線 fit の傾き [°/周] ⇄ ω̇ [deg/yr] を**同じ近点間周期**で換算した値。
const MAPPING_UNRESOLVED = (kind, id) => {
  if (kind !== 'ecc') return null;
  return ECC_TIMING_BINARY.has(id)
    ? 'タイミング解の e_T(時間離心率)と、距離の極値から作る eProxy は同じ測定量ではない'
    : '軌道 fit のケプラー要素 e と、距離の極値から作る eProxy は同じ測定量ではない';
};

// ---------------------------------------------------------------- 単位(観測欄の数値を秒へ)
const SEC = { '日': 86400, 'd': 86400, '年': 3.15576e7, 'yr': 3.15576e7, '時間': 3600, 'h': 3600,
  '秒': 1, 's': 1, 'ms': 1e-3 };
const UNIT_RE = /^(日|年|時間|ms|s|d|h|yr|秒)/;

// 「数値+誤差+単位」を機械的に取り出す。"a / b / c 単位" の並びは 1 組として返し、
// 単位を持つ最初の組を優先する(「2周目 8819.36 秒」から 8819.36 秒 を取るため)。
function normNum(str) {
  const sup = { '\u2070': '0', '\u00b9': '1', '\u00b2': '2', '\u00b3': '3', '\u2074': '4',
    '\u2075': '5', '\u2076': '6', '\u2077': '7', '\u2078': '8', '\u2079': '9' };
  return String(str).replace(/\uff0c/g, ',').replace(/\u2212/g, '-')
    .replace(/\u00d710\u207b/g, 'e-').replace(/\u00d710/g, 'e')
    .replace(/[\u2070\u00b9\u00b2\u00b3\u2074\u2075\u2076\u2077\u2078\u2079]/g, (ch) => sup[ch]);
}
const NUM_RE = /([+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\s*(?:\u00b1\s*(\d+(?:\.\d+)?(?:[eE][+-]?\d+)?))?/g;
function scanNums(str) {
  const t = normNum(str), ms = []; NUM_RE.lastIndex = 0;
  let m;
  while ((m = NUM_RE.exec(t)) !== null && ms.length < 16) {
    const v = Number(m[1]); if (!Number.isFinite(v)) continue;
    const end = m.index + m[0].length;
    const rest = t.slice(end).replace(/^[)\uff09\s]*/, '');
    const um = rest.match(UNIT_RE);
    // 「\u00b0/\u5468」等の率は parseRate の担当なので単位として拾わない
    const isRate = /^\s*[\u00b0\u2033]|^\s*rad\s*\//.test(t.slice(end));
    ms.push({ v, err: m[2] !== undefined ? Number(m[2]) : null,
      unit: (um && !isRate) ? um[1] : null, idx: m.index, end });
  }
  return { t, ms };
}
function parseObs(str) {
  if (typeof str !== 'string') return null;
  const { t, ms } = scanNums(str);
  if (!ms.length) return null;
  const groups = []; let cur = [ms[0]];
  for (let i = 1; i < ms.length; i++) {
    if (/^\s*\/\s*$/.test(t.slice(ms[i - 1].end, ms[i].idx))) cur.push(ms[i]);
    else { groups.push(cur); cur = [ms[i]]; }
  }
  groups.push(cur);
  const g = groups.find((gr) => gr.some((x) => x.unit)) || groups[0];
  const u = (g.find((x) => x.unit) || {}).unit || null;
  return g.map((x) => ({ v: x.v, err: x.err, unit: x.unit || u }));
}
// 単位つきの数値を**全部**返す(自転の照合など、並記された複数の観測値から選ぶ用)
function parseAllUnits(str) {
  if (typeof str !== 'string') return [];
  return scanNums(str).ms.filter((x) => x.unit && SEC[x.unit]).map((x) => ({ v: x.v, unit: x.unit }));
}

// 率(近点移動)の単位を取り出す: °/周・°/公転・rad/公転・°/日・″/世紀
function parseRate(str) {
  if (typeof str !== 'string') return null;
  const sup = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };
  const t = String(str).replace(/−/g, '-').replace(/×10⁻/g, 'e-').replace(/×10/g, 'e')
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (ch) => sup[ch]);
  const m = t.match(/([+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\s*(°|″|rad)\s*\/\s*(周|公転|日|世紀|yr|年)/);
  if (!m) {
    const z = t.match(/^\s*[≈約]?\s*0\s*[((]/);   // 「≈0(厳密ケプラー)」
    if (z) return { v: 0, kind: 'deg-per-orbit' };
    return null;
  }
  const v = Number(m[1]), num = m[2], den = m[3];
  if (!Number.isFinite(v)) return null;
  if (den === '周' || den === '公転') {
    if (num === 'rad') return { v: v * 180 / Math.PI, kind: 'deg-per-orbit' };
    if (num === '″') return { v: v / 3600, kind: 'deg-per-orbit' };
    return { v, kind: 'deg-per-orbit' };
  }
  if (den === '日') return { v: (num === '″' ? v / 3600 : v), kind: 'deg-per-day' };
  if (den === '世紀') return { v: (num === '″' ? v / 3600 : v), kind: 'deg-per-century' };
  if (den === 'yr' || den === '年') return { v: (num === '″' ? v / 3600 : v), kind: 'deg-per-year' };
  return null;
}

// 「0.026〜0.077(有界)」型の**範囲で書かれた観測**を取り出す(点推定ではないので % 残差にしない)
function parseRange(str) {
  if (typeof str !== 'string') return null;
  const t = normNum(str);
  const m = t.match(/([+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\s*[〜~ー–—-]\s*([+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/);
  if (!m) return null;
  const lo = Number(m[1]), hi = Number(m[2]);
  if (!Number.isFinite(lo) || !Number.isFinite(hi) || !(hi > lo)) return null;
  return { lo, hi };
}

const pct = (a, b) => (Number.isFinite(a) && Number.isFinite(b) && b !== 0) ? (a - b) / Math.abs(b) * 100 : null;

// Spearman 順位相関(同順位は平均順位)
function spearman(xs, ys) {
  const n = xs.length; if (n < 4) return null;
  const rank = (a) => {
    const idx = a.map((v, i) => [v, i]).sort((p, q) => p[0] - q[0]);
    const r = new Array(n); let i = 0;
    while (i < n) { let j = i; while (j + 1 < n && idx[j + 1][0] === idx[i][0]) j++;
      const rr = (i + j) / 2 + 1; for (let k = i; k <= j; k++) r[idx[k][1]] = rr; i = j + 1; }
    return r;
  };
  const rx = rank(xs), ry = rank(ys);
  const mx = rx.reduce((a, b) => a + b, 0) / n, my = ry.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) { sxy += (rx[i] - mx) * (ry[i] - my); sxx += (rx[i] - mx) ** 2; syy += (ry[i] - my) ** 2; }
  return (sxx > 0 && syy > 0) ? sxy / Math.sqrt(sxx * syy) : null;
}

// ================================================================ ブラウザ
// 第263便c: --regate では**ブラウザも走行も無い**(既存 JSON を読み直して門だけ掛け直す)。
let decls = [], out = null, report = [];
if (!REGATE) {
let browser;
try { const { chromium } = await import('playwright'); browser = await chromium.launch(); }
catch { const { chromium } = await import('playwright-core');
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); }
const pg = await browser.newPage();
const pageErrors = [];
pg.on('pageerror', (e) => pageErrors.push(String(e)));
await pg.goto(INDEX, { waitUntil: 'load' });
await pg.waitForFunction(() => window.HP && HP.sim);

// ---------------------------------------------------------------- ページ側ヘルパ(本体には入れない)
await pg.evaluate((PERI_WINDOW) => {   // 第252便b: 近点間周期の固定窓をページ側へ渡す
  // 宣言 body index → 実行 index(ring/cluster 等は count 個へ展開される)
  window.__w249map = (p) => {
    const map = []; let si = 0;
    for (const b of (p.bodies || [])) {
      map.push(si);
      const n = (b.n !== undefined) ? b.n : (b.count !== undefined ? b.count : 1);
      si += (b.type && b.type !== 'single') ? Math.max(1, Math.round(n)) : 1;
    }
    return map;
  };
  window.__w249build = (id) => {
    const p = HP.allPresets().find((q) => q.id === id);
    const v = HP.validatePreset(JSON.parse(JSON.stringify(p)));
    HP.sim.build(v.preset);
    return { warnings: v.warnings, n: HP.sim.n, map: window.__w249map(v.preset) };
  };
  // 步/秒の実測(判定には使わない — 走行長の予算にだけ使う)
  window.__w249rate = (id, dt) => {
    window.__w249build(id); const S = HP.sim;
    for (let i = 0; i < 5000; i++) S.step(dt);          // JIT の暖機(計時に入れない)
    const t0 = Date.now(); const N = 20000;
    for (let i = 0; i < N; i++) S.step(dt);
    const ms = Date.now() - t0;
    return (ms > 0) ? N / (ms / 1000) : 1e6;
  };
  // t=0 の接触要素(2 体近似)
  window.__w249osc0 = (ci, oi, G) => {
    const S = HP.sim;
    const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci];
    const dvx = S.vx[oi] - S.vx[ci], dvy = S.vy[oi] - S.vy[ci];
    const r = Math.hypot(dx, dy), v2 = dvx * dvx + dvy * dvy;
    const mu = G * (S.m[ci] + S.m[oi]);
    const inv = 2 / r - v2 / mu, a = (inv !== 0) ? 1 / inv : NaN;
    const h = dx * dvy - dy * dvx;
    const ex = (v2 * dx - (dx * dvx + dy * dvy) * dvx) / mu - dx / r;
    const ey = (v2 * dy - (dx * dvx + dy * dvy) * dvy) / mu - dy / r;
    return { r, a, e: Math.hypot(ex, ey), h, mu,
      P: (a > 0) ? 2 * Math.PI * Math.sqrt(a * a * a / mu) : NaN };
  };
  // 本体: 1 走行で全対象を測る
  //   targets = [{ci, oi, label}]  (実行 index)
  window.__w249run = (id, dt, maxSteps, targets, orbMax, G) => {
    const b = window.__w249build(id); const S = HP.sim;
    const T = targets.map((t) => {
      const o = window.__w249osc0(t.ci, t.oi, G);
      return { ci: t.ci, oi: t.oi, label: t.label,
        r2: 0, r1: 0, th2: 0, th1: 0, rd1: 0, k0: 0,
        rMin: Infinity, rMax: -Infinity, rMin1: Infinity, rMax1: -Infinity,
        A: [], B: [], rev: [], angAcc: 0, angPrev: 0,
        oscA: 0, oscP: 0, oscE: 0, oscN: 0, osc0: o, done: false };
    });
    const spin0 = Array.from(S.spin).slice(0, Math.min(S.n, 8));
    const core0 = [];
    for (const t of T) for (const i of [t.ci, t.oi]) {
      const ci = (HP.coreState ? HP.coreState(i) : null);
      if (ci && Number.isFinite(ci.omega)) core0.push({ i, omega: ci.omega });
    }
    const oscEvery = Math.max(1, Math.round(maxSteps / 2000));
    // 初期角
    for (const t of T) {
      const dx = S.x[t.oi] - S.x[t.ci], dy = S.y[t.oi] - S.y[t.ci];
      t.angPrev = Math.atan2(dy, dx);
    }
    let k = 0, stop = false;
    for (; k < maxSteps && !stop; k++) {
      S.step(dt);
      for (const t of T) {
        const dx = S.x[t.oi] - S.x[t.ci], dy = S.y[t.oi] - S.y[t.ci];
        const rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
        const dvx = S.vx[t.oi] - S.vx[t.ci], dvy = S.vy[t.oi] - S.vy[t.ci];
        const rd = (rr > 0) ? (dx * dvx + dy * dvy) / rr : 0;
        if (rr < t.rMin) t.rMin = rr; if (rr > t.rMax) t.rMax = rr;
        if (!t.rev.length) { if (rr < t.rMin1) t.rMin1 = rr; if (rr > t.rMax1) t.rMax1 = rr; }
        // 同方向 1 周: 相対角の連続化と 2π 交差
        let d = th - t.angPrev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
        const prevAcc = t.angAcc; t.angAcc += d; t.angPrev = th;
        const nPrev = Math.floor(Math.abs(prevAcc) / (2 * Math.PI)), nNow = Math.floor(Math.abs(t.angAcc) / (2 * Math.PI));
        if (nNow > nPrev && t.rev.length < orbMax + 2) {
          const target = Math.sign(t.angAcc) * nNow * 2 * Math.PI;
          const fr = (t.angAcc !== prevAcc) ? (target - prevAcc) / (t.angAcc - prevAcc) : 0;
          t.rev.push((k - 1 + fr) * dt);
        }
        // 近点 検出器 A(ṙ の −→+ 交差)
        if (k >= 1 && t.rd1 < 0 && rd >= 0 && t.A.length < orbMax + 3) {
          const fr = (rd !== t.rd1) ? (-t.rd1 / (rd - t.rd1)) : 0;
          let a1 = t.th1, a2 = th; while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI; while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
          t.A.push({ ang: a1 + fr * (a2 - a1), k: k - 1 + fr, r: rr });
        }
        // 近点 検出器 B(距離極小の放物線頂点)
        if (k >= 2 && t.r1 < t.r2 && t.r1 < rr && t.B.length < orbMax + 3) {
          const dd = (t.r2 - 2 * t.r1 + rr), fr = (dd !== 0) ? 0.5 * (t.r2 - rr) / dd : 0;
          let a1 = t.th2, a2 = t.th1, a3 = th;
          while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI; while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
          while (a3 - a2 > Math.PI) a3 -= 2 * Math.PI; while (a3 - a2 < -Math.PI) a3 += 2 * Math.PI;
          t.B.push({ ang: a2 + 0.5 * fr * (a3 - a1) + 0.5 * fr * fr * (a3 - 2 * a2 + a1), k: k - 1 + fr, r: t.r1 });
        }
        t.r2 = t.r1; t.r1 = rr; t.th2 = t.th1; t.th1 = th; t.rd1 = rd;
        // 接触要素の積算
        if (k % oscEvery === 0) {
          const v2 = dvx * dvx + dvy * dvy, mu = t.osc0.mu;
          const inv = 2 / rr - v2 / mu, a = (inv !== 0) ? 1 / inv : NaN;
          if (Number.isFinite(a) && a > 0) {
            const ex = (v2 * dx - (dx * dvx + dy * dvy) * dvx) / mu - dx / rr;
            const ey = (v2 * dy - (dx * dvx + dy * dvy) * dvy) / mu - dy / rr;
            t.oscA += a; t.oscP += 2 * Math.PI * Math.sqrt(a * a * a / mu); t.oscE += Math.hypot(ex, ey); t.oscN++;
          }
        }
      }
      if (T.every((t) => t.rev.length >= orbMax)) stop = true;
      if (S.hasNaN()) { stop = true; }
    }
    // 近点位相の直線 fit(第246便b→第247便a と同一手続き)
    const fit = (raw, rMin, rMax, pRef) => {
      const mid = 0.5 * (rMin + rMax);
      const peri = raw.filter((p) => p.r <= mid);
      const rej = { apo: raw.length - peri.length, dup: 0, jump: 0 };
      const keep = [];
      for (const p of peri) {
        if (keep.length && (p.k - keep[keep.length - 1].k) * dt < 0.5 * pRef) { rej.dup++; continue; }
        keep.push(p);
      }
      const use = keep, ang = [];
      for (let i = 0; i < use.length; i++) {
        let a = use[i].ang;
        if (i) { let z = a - ang[i - 1]; while (z > Math.PI) z -= 2 * Math.PI; while (z < -Math.PI) z += 2 * Math.PI;
          if (Math.abs(z) > Math.PI / 2) { rej.jump++; break; }
          a = ang[i - 1] + z; }
        ang.push(a);
      }
      const n = ang.length; let slope = null, resid = null;
      if (n >= 2) {
        const mx = (n - 1) / 2, my = ang.reduce((a, b) => a + b, 0) / n;
        let sxy = 0, sxx = 0;
        for (let i = 0; i < n; i++) { sxy += (i - mx) * (ang[i] - my); sxx += (i - mx) * (i - mx); }
        slope = sxy / sxx;
        resid = Math.sqrt(ang.reduce((s, a, i) => s + (a - (my + slope * (i - mx))) ** 2, 0) / n);
      }
      // 第258便d(第50報 W4): **deg/yr の門**のための、unwrap した近点角の**実時刻**への線形 fit。
      // 上の slope は「近点番号に対する」傾き(°/周)で、deg/yr へ直すには周期を 1 つ選ぶ必要がある
      // (⚡ は P_b と ω̇ が**別解**から来ているので、その換算は 2 つの解をまたぐ)。
      // ここでは横軸を**時刻そのもの**(k·dt = シミュレータ時間)にして傾きを取り、
      // 時系(t の範囲)と**傾きの分散・共分散**も残す。年の長さへの換算は node 側で行う。
      let timeFit = null;
      if (n >= 2) {
        const ts = []; for (let i = 0; i < n; i++) ts.push(use[i].k * dt);
        const mt = ts.reduce((a, b) => a + b, 0) / n, ma = ang.reduce((a, b) => a + b, 0) / n;
        let sxy = 0, sxx = 0;
        for (let i = 0; i < n; i++) { sxy += (ts[i] - mt) * (ang[i] - ma); sxx += (ts[i] - mt) * (ts[i] - mt); }
        const sl = (sxx > 0) ? sxy / sxx : null;
        let ss = 0;
        if (sl !== null) for (let i = 0; i < n; i++) { const rr2 = ang[i] - (ma + sl * (ts[i] - mt)); ss += rr2 * rr2; }
        const s2 = (n > 2) ? ss / (n - 2) : 0;
        timeFit = { nPeri: n, slopeRadPerTime: sl,
          slopeDegPerTime: (sl === null) ? null : sl * 180 / Math.PI,
          t0: ts[0], t1: ts[n - 1], tSpan: ts[n - 1] - ts[0], dt,
          varSlope: (sxx > 0) ? s2 / sxx : null,
          seSlopeDegPerTime: (sxx > 0) ? Math.sqrt(s2 / sxx) * 180 / Math.PI : null,
          varIntercept: (sxx > 0) ? s2 * (1 / n + mt * mt / sxx) : null,
          covSlopeIntercept: (sxx > 0) ? -s2 * mt / sxx : null,
          residRmsDeg: Math.sqrt(ss / n) * 180 / Math.PI,
          note: '横軸は**時刻**(k·dt = シミュレータ時間単位)。近点番号ではない' };
      }
      // 第252便b(第44報): **近点間周期の窓を「最初の 20 近点(19 区間)」へ固定**する。
      // 第251便 統括の未解決「近点間平均の窓感度で ⚡🧿🪶 の周期残差が 0.66pt 割れる」への処置で、
      // 窓の長さがサンプルごとの走行長(時間予算)で決まっていたのをやめ、**宣言した固定窓**にする。
      // 20 近点に満たなければ **perMean=null(未計測)** を返す —— 他の周期定義へは置換しない
      // (第251便c の定義契約 ④ をそのまま延長する)。窓外の全近点平均は perMeanAll に残す(履歴)。
      const perAll = []; for (let i = 1; i < use.length; i++) perAll.push((use[i].k - use[i - 1].k) * dt);
      const win = use.slice(0, PERI_WINDOW), measured = (win.length >= PERI_WINDOW);
      return { nPeri: n, rej, slopeDeg: slope === null ? null : slope * 180 / Math.PI,
        residDeg: resid === null ? null : resid * 180 / Math.PI, timeFit,
        perMean: measured ? (win[PERI_WINDOW - 1].k - win[0].k) * dt / (PERI_WINDOW - 1) : null,
        perMeanAll: perAll.length ? perAll.reduce((a, b) => a + b, 0) / perAll.length : null,
        // 第269便a(統括の読み (E)): **傾き fit に使ったのと同じ近点集合**(n 個・n−1 区間)の平均。
        // 換算 ϖ̇ = Δϖ × YEAR / P で「分子と同じ窓の周期で割る」ための分母である。
        // **判定量(周期)はこれまでどおり perMean(20 近点窓)のまま** —— この欄は換算の診断専用。
        perMeanFit: (n >= 2) ? (use[n - 1].k - use[0].k) * dt / (n - 1) : null, perFitN: n,
        perWindow: PERI_WINDOW, perFound: use.length, perUnmeasured: !measured,
        perFirst: perAll.length ? perAll[0] : null, perN: measured ? PERI_WINDOW - 1 : 0 };
    };
    const out = T.map((t) => {
      const pRef = Number.isFinite(t.osc0.P) ? t.osc0.P : (t.rev.length > 1 ? t.rev[1] - t.rev[0] : 1);
      // revP[0]=1周目(t=0 から最初の 2π)・revP[1]=2周目 …(obsCard の「2周目」と同じ数え方)
      const revP = []; for (let i = 0; i < t.rev.length; i++) revP.push(i ? t.rev[i] - t.rev[i - 1] : t.rev[0]);
      return { label: t.label, ci: t.ci, oi: t.oi,
        rMin: t.rMin, rMax: t.rMax, rMin1: t.rMin1, rMax1: t.rMax1,
        eProxy: (t.rMax + t.rMin > 0) ? (t.rMax - t.rMin) / (t.rMax + t.rMin) : null,
        eProxy1: (t.rMax1 + t.rMin1 > 0 && t.rMax1 > 0) ? (t.rMax1 - t.rMin1) / (t.rMax1 + t.rMin1) : null,
        revFirst: t.rev.length ? t.rev[0] : null,
        revP, revN: revP.length,
        revPMean: revP.length ? revP.reduce((a, b) => a + b, 0) / revP.length : null,
        A: fit(t.A, t.rMin, t.rMax, pRef), B: fit(t.B, t.rMin, t.rMax, pRef),
        osc0: t.osc0,
        oscA: t.oscN ? t.oscA / t.oscN : null, oscP: t.oscN ? t.oscP / t.oscN : null,
        oscE: t.oscN ? t.oscE / t.oscN : null, oscN: t.oscN };
    });
    const spinDrift = spin0.map((s, i) => ({ i, s0: s, s1: S.spin[i],
      driftPct: (s !== 0) ? (S.spin[i] - s) / Math.abs(s) * 100 : (S.spin[i] === 0 ? 0 : null) }));
    const coreDrift = core0.map((c) => { const ci = HP.coreState(c.i);
      return { i: c.i, omega0: c.omega, omega1: ci ? ci.omega : null,
        driftPct: (c.omega !== 0 && ci) ? (ci.omega - c.omega) / Math.abs(c.omega) * 100 : null }; });
    return { steps: k, tEnd: k * dt, targets: out, spinDrift, coreDrift,
      nan: S.hasNaN(), clamp: (S.clampVN || 0) + (S.clampSN || 0) + (S.clampHN || 0) + (S.clampRN || 0) + (S.clampTN || 0),
      warnings: b.warnings, n: b.n, framePrec: S.framePrec || null };
  };
}, PERI_WINDOW);

// ---------------------------------------------------------------- サンプル一覧と宣言の読み出し
decls = await pg.evaluate(() => HP.allPresets().filter((p) => p.sampleClass === 'calibration').map((p) => ({
  id: p.id, emoji: p.emoji || null, name: p.name || null,
  obsCard: p.obsCard || [], claims: (p.claims || []).map((c) => ({ id: c.id, role: c.role, metric: c.metric,
    expected: c.expected || null })),
  physics: p.physics || {}, scaleExp: p.scaleExp || null,
  massCalibration: p.massCalibration ? { law: p.massCalibration.law,
    factor: p.massCalibration.factor !== undefined ? p.massCalibration.factor : p.massCalibration.factorUniform } : null,
  referenceKind: p.referenceKind || null,
  bodies: (p.bodies || []).map((b) => ({ type: b.type || 'single', m: b.m, radius: b.radius, spin: b.spin,
    n: (b.n !== undefined) ? b.n : (b.count !== undefined ? b.count : null) })),
})));

const ids = decls.map((d) => d.id).filter((x) => !ONLY || ONLY.includes(x));
console.error(`[w249b] 現実較正サンプル ${decls.length} 本 / 走行対象 ${ids.length} 本`);

// ================================================================ 走行
out = { meta: {
  wave: '第249便b', when: new Date().toISOString(), target: TARGET, dtBase: DT0,
  budgetSecLight: BUDGET_LIGHT, budgetSecHeavy: BUDGET_HEAVY, orbMax: ORB_MAX,
  // ---------------------------------------------------------------- 第270便a(第60報 W1・AE9)
  // **停止条件の宣言**。走行長は「步数上限 × 必要近点数」で決まり、**步/秒も壁時計も入らない**。
  stopRule: {
    version: STOP_RULE_VERSION,
    module: 'tests/lib-w270a-stoprule.mjs(純関数・副作用なし)',
    rule: '1 段の步数 = **min(宣言した步数上限, ' + ORB_MAX + ' 公転ぶんの步数)**。'
      + '公転ぶんの步数は t=0 の接触要素(刻みと質量だけで決まる量)から作る。'
      + '近点は宣言した本数(既定 ' + PERI_WINDOW + ')だけ要り、足りなければ **unmeasured** である'
      + '(「否」ではない)。',
    classMaxSteps: CLASS_MAX_STEPS,
    presetMaxSteps: PRESET_MAX_STEPS,
    presetNeedPeriastra: PRESET_NEED_PERIASTRA,
    // 第271便a(AF3): **版つきの既定規約**をそのまま載せる(器と文書と QA が同じ表を読む)。
    spec: STOP_RULE_SPEC,
    wallCeilingSec: WALL_CEILING_SEC,
    wallClock: '**壁時計は資源上限にだけ残す**。超えた段は `resource-limit` として unmeasured にし、'
      + '**途中までの軌道を最終判定へ流さない**。判定・走行長には 1 bit も入らない。',
    why: '第257便d までは走行長が `実測した步/秒 × 時間予算` で決まっていたので、'
      + '**同じコード・同じ入力でも機種が違えば近点の本数が変わり、判定が動いた**'
      + '(🌘 earthMoonRealKF1 の 26 近点は 40,000,000 步まで走れたときの数である)。',
    defaultsFrom: '既定値は**基点 f6c19b4 の走行から逆算した**(tests/data-w270a-stoprule-base.json '
      + 'の 84 段と同じ步数・同じ近点数が埋まる)。照合は tests/exp-w270a-stoprule.mjs が行う。',
    doNotWrite: ['步数を宣言したので収束した', '停止条件を入れたので判定が確定した'],
  },
  budgetNote: '第257便d(第49報): 1 段あたりの計算時間予算の**既定を 30 s → ' + BUDGET_DEFAULT + ' s** にした。'
    + 'これは**計算時間の予算**であって精度条件ではない(第256便d は 🧶 の dt/4 を --budget 80 で'
    + '走らせて初めて 20 近点窓が埋まった)。予算で切れて窓が埋まらなかった行は '
    + '`unmeasuredReason:"time-budget"`、時間が余っているのに埋まらない行は `"window"` と分けて記録する。'
    + '**機種依存の量**なので、dt・近点数とは別の欄(run.timeBudget)に置く。',
  verdicts: VERDICTS6,
  verdictsNote: '第258便d(第50報 W4): 5 区分に **`条`(condition-mismatch)** を足した。'
    + '行が要求している条件(kFrame)と、割り当てられている測定値の走行条件が違う行の隔離である。'
    + '**数値が間違っているのではなく、行の割り当てが間違っている** —— 元の証拠は '
    + 'conditionRejectedEvidence に残す。',
  dt8: DT8 ? { on: true, ids: DT8, dt: DT0 / 8,
    note: '第258便d: h8 検査点。名指しした系だけ 4 段目を走らせる(予算の都合で 1 系)。'
      + '走らせていない系は**未走行**である(推定で埋めない)。' } : { on: false },
  toleranceNote: '観測誤差が obsCard の obs 欄から読めた量は誤差で機械判定する。読めない量は ±1% を'
    + '「目安」として使い(guide:true)、確定基準にはしない。',
  periodNote: '公転周期は 2 定義(近点間 / 同方向 1 周)を両方測り、判定は同方向 1 周で行う'
    + '(obsCard の「2 周目/周回時間」がこの定義)。両定義が許容の内外に分かれた行は note に「定義依存」を書く。'
    + ' **第252便b: 近点間周期の窓を「最初の 20 近点(19 区間)」に固定した。**20 近点に満たない対象は'
    + ' unmeasured を返し、他の周期定義へは置換しない(第251便c の定義契約 ④ の延長)。'
    + ' 窓外の全近点平均は detail.periAllSec に履歴として残す。',
  periWindow: { nPeri: PERI_WINDOW, nIntervals: PERI_WINDOW - 1,
    reason: '第251便 統括の未解決「近点間平均の窓感度で ⚡🧿🪶 の周期残差が 0.66pt 割れる」— '
      + '窓の長さが走行長(時間予算)で決まっていたのをやめ、宣言した固定窓にする(第252便b)',
    unmeasured: '**窓感度は未計測のままである**(第253便b L6): 窓を 20・30・40 近点と振って値が'
      + 'どう動くかは測っていない。窓は全系で 20 近点に固定したので系間の比較は揃うが、'
      + '「20 が十分な長さか」は確かめていない。' },
  dtNote: 'dt はアプリ既定 0.016 と、その半分 0.008 の 2 段。dt/2 段は実行時 n≤12 のサンプルだけ'
    + '(重い環・多体は時間予算に収まらない — 明記)。'
    + (DT3 ? '**第255便d(第47報 N8): 本走行は --dt3 で dt/4=0.004 を足した 3 段**である'
      + '(--only で絞った系だけ。ε_num=|Q_h−Q_{h/4}|・観測次数 p_obs を実測して numBoundDecl へ入れる)。' : ''),
  dt3: DT3 ? { on: true, only: ONLY,
    note: '3 段(dt, dt/2, dt/4)を走らせた系だけ numBoundDecl.steps=3・order=p_obs になる。'
      + '2 段のままの系の値・文言は第253便b から 1 文字も動いていない。' } : { on: false },
}, presets: [] };

for (const id of ids) {
  const d = decls.find((x) => x.id === id);
  const cfg = CFG[id];
  if (!cfg) { console.error(`  SKIP ${id}(CFG 未宣言)`); continue; }
  const G = Number(d.physics.G), c = Number(d.physics.cLight);
  const eT = d.scaleExp ? Number(d.scaleExp.T) : 0;
  const toSec = Math.pow(10, eT);

  // 宣言 index → 実行 index
  const b0 = await pg.evaluate((id) => window.__w249build(id), id);
  const map = b0.map;
  const heavy = b0.n > 12;
  const budget = heavy ? BUDGET_HEAVY : BUDGET_LIGHT;
  const targets = cfg.o.map(([di, label]) => ({ ci: map[cfg.c], oi: map[di], label }));
  if (cfg.ringInner) {
    // 最内リング粒子(実行 index の中で中心を除き r 最小のもの)
    const inner = await pg.evaluate(({ ci }) => { const S = HP.sim; let best = -1, br = Infinity;
      for (let i = 0; i < S.n; i++) { if (i === ci) continue;
        const r = Math.hypot(S.x[i] - S.x[ci], S.y[i] - S.y[ci]); if (r < br) { br = r; best = i; } }
      return { i: best, r: br }; }, { ci: map[cfg.c] });
    targets.unshift({ ci: map[cfg.c], oi: inner.i, label: cfg.ringInner });
  }

  const rows = [];
  const levels = [{ dt: DT0, tag: 'dt' }];
  if (!FAST && !heavy) levels.push({ dt: DT0 / 2, tag: 'dt/2' });
  if (DT3 && !FAST && !heavy) levels.push({ dt: DT0 / 4, tag: 'dt/4' });   // 第255便d(N8)
  // 第258便d(第50報 W4): **h8 検査点**。--dt8 で名指しした系にだけ 4 段目を足す(予算の都合で 1 系)。
  if (DT8 && DT8.includes(id) && !FAST && !heavy) levels.push({ dt: DT0 / 8, tag: 'dt/8' });

  for (const lv of levels) {
    const rate = await pg.evaluate(({ id, dt }) => window.__w249rate(id, dt), { id, dt: lv.dt });
    // t=0 の接触要素から 1 公転の步数を見積もる
    await pg.evaluate((id) => window.__w249build(id), id);
    const osc0 = await pg.evaluate(({ targets, G }) => targets.map((t) => window.__w249osc0(t.ci, t.oi, G)),
      { targets, G });
    const stepsPerOrbit = osc0.map((o) => (Number.isFinite(o.P) && o.P > 0) ? o.P / lv.dt : Infinity);
    const orbMax = cfg.orbMax || ORB_MAX;
    // 第270便a(第60報 W1・AE9): **走行長は宣言で決める**。
    // 步数 = min(宣言した步数上限, orbMax 公転ぶんの步数)。**步/秒も壁時計も入らない** ——
    // t=0 の接触要素(刻みと質量だけで決まる量)から作るので、機種が違っても同じ步数になる。
    // 旧規則 `min(max(rate×予算, 5 公転), orbMax 公転, hardCap)` は rate(機種依存)で走行長が
    // 変わり、**🌘 の近点数が 26 か 13 かで period 行が 合↔転 に動いた**。
    const stopRule = stopRuleFor({ id, n: b0.n, dt: lv.dt, dtBase: DT0, stepsPerOrbit, orbMax });
    const wantSteps = stopRule.wantSteps;
    const maxSteps = stopRule.maxSteps;
    const t0 = Date.now();
    const r = await pg.evaluate(({ id, dt, maxSteps, targets, orbMax, G }) =>
      window.__w249run(id, dt, maxSteps, targets, orbMax, G), { id, dt: lv.dt, maxSteps, targets, orbMax, G });
    r.dt = lv.dt; r.tag = lv.tag; r.rateStepsPerSec = Math.round(rate); r.wallSec = (Date.now() - t0) / 1000;
    r.stepsPerOrbit0 = stepsPerOrbit.map((s) => Number.isFinite(s) ? Math.round(s) : null);
    // 第257便d: **計算時間の予算**を数値の性質と混ぜずに記録する(機種依存の欄)。
    // budgetSec = この段に与えた秒数 / wallSec = 実際に掛かった秒数 / budgetHit = 予算で切れたか /
    // periFound = 検出できた近点の数(窓 20 に届いたか)。**予算は精度条件ではない**。
    r.timeBudget = { budgetSec: budget, heavy, wallSec: r.wallSec,
      budgetHit: r.wallSec >= 0.9 * budget, maxSteps, stepsRun: r.steps,
      rateStepsPerSec: Math.round(rate), dt: lv.dt,
      periFoundA: r.targets.map((t) => t.A.perFound), periWindow: PERI_WINDOW,
      windowFilledA: r.targets.map((t) => !t.A.perUnmeasured),
      note: '**第270便a(AE9)以降、この欄は記録である** —— 走行長はここではなく `run.stopRule`'
        + 'の宣言(步数上限と必要近点数)で決まる。壁時計と步/秒は機種依存の量なので、'
        + '**判定にも走行長にも入らない**(壁時計は資源上限 `stopRule.wallCeilingSec` にだけ効く)。' };
    // 第270便a(AE9): **停止条件の宣言と、その段がそれを満たしたか**を機械可読で残す。
    r.stopRule = Object.assign({}, stopRule, stopDecision({
      stepsRun: r.steps, maxSteps, periFound: r.targets.map((t) => t.A.perFound),
      needPeriastra: stopRule.needPeriastra, wallSec: r.wallSec, wallCeilingSec: WALL_CEILING_SEC,
      boundBy: stopRule.boundBy }),
    { stepsPerOrbit0: stepsPerOrbit.map((s) => Number.isFinite(s) ? Math.round(s) : null),
      periFoundA: r.targets.map((t) => t.A.perFound),
      periFitN: r.targets.map((t) => (t.A.perFitN === undefined) ? null : t.A.perFitN),
      windowFilledA: r.targets.map((t) => !t.A.perUnmeasured),
      rateStepsPerSec: Math.round(rate),
      rateNote: '**步/秒は記録であって停止条件ではない**(第270便a・AE9)',
      machineIndependence: machineIndependenceProbe({ id, n: b0.n, dt: lv.dt, stepsPerOrbit, orbMax }) });
    rows.push(r);
    console.error(`  ${d.emoji} ${id} [${lv.tag}=${lv.dt}] n=${r.n} steps=${r.steps}/${maxSteps}`
      + `(${r.stopRule.stoppedBy}) orbits=${r.targets.map((t) => t.revN).join('/')}`
      + ` peri=${r.stopRule.periFoundA.join('/')}≥${r.stopRule.needPeriastra}?${r.stopRule.periastraOk}`
      + ` ${r.wallSec.toFixed(1)}s`);
  }
  out.presets.push({ decl: d, cfg: { center: cfg.c, orbiters: cfg.o, ringInner: cfg.ringInner || null,
    note: cfg.note || null }, runs: rows, toSec, G, c, heavy });
}

// ---------------------------------------------------------------- 第257便d(第49報・3 審査 v15)
// **Float32 質量の記録**。状態配列 `S.m` は `stateCarry:"double"` を宣言した系でも **Float32Array**
// である(倍精度化したのは軌道状態 x/y/v/a と累積角であって、質量ではない — beta/index.html
// の `S.alloc` を参照)。したがって**宣言した質量は、そのまま保持されているとは限らない**。
// ここで記録するのは 3 つだけで、**どれも実測である**(提案でも予想でもない):
//   ① 保持質量 = 実際に `S.m[i]` に入っている値(Float32 の格子点)
//   ② その桁での Float32 の**最小刻み**(ULP)
//   ③ 宣言質量(preset の bodies[i].m)との差(絶対・相対)
// あわせて **massCalibration の f の分解能**を測る: f を 1e−7 動かしたときに保持質量が動くか、
// 動かないなら**保持質量を 1 目盛り動かすのに要る最小の δf**(= ULP / baseMass)はいくつか。
// **「全 native を double 化せよ」という提案ではない**(エンジンは 1 bit も触っていない)。
const MASS_F32_TARGETS = ['psrDoubleABDFM', 'psrJ1757DFM', 'psrJ1946DFM', 'psrB1534DFM', 'gw150914DFM'];
out.massFloat32 = { note: '第257便d: S.m は Float32Array である(stateCarry:"double" は軌道状態の話)。'
  + '① 保持質量 ② その桁の Float32 最小刻み(ULP) ③ 宣言質量との差、と f の分解能を実測で記録する。'
  + '**エンジンは 1 bit も触っていない**(読み出しだけ)。',
  rows: await pg.evaluate((ids) => {
    const buf = new Float32Array(1), u32 = new Uint32Array(buf.buffer);
    const ulp32 = (v) => { const a = Math.fround(v); buf[0] = a;
      if (!Number.isFinite(a)) return null;
      u32[0] = u32[0] + 1; const up = buf[0]; return Math.abs(up - a); };
    const rows = [];
    for (const id of ids) {
      const p = HP.allPresets().find((q) => q.id === id);
      if (!p) { rows.push({ id, missing: true }); continue; }
      const v = HP.validatePreset(JSON.parse(JSON.stringify(p)));
      HP.sim.build(v.preset);
      const S = HP.sim, mc = p.massCalibration || null, bodies = [];
      const nB = Math.min(S.n, (p.bodies || []).length);
      for (let i = 0; i < nB; i++) {
        const decl = Number(p.bodies[i].m), held = S.m[i], u = ulp32(held);
        const base = (mc && Array.isArray(mc.baseMass) && Number.isFinite(Number(mc.baseMass[i])))
          ? Number(mc.baseMass[i]) : null;
        const fb = (mc && Array.isArray(mc.factorByBody) && Number.isFinite(Number(mc.factorByBody[i])))
          ? Number(mc.factorByBody[i])
          : ((mc && Number.isFinite(Number(mc.factor))) ? Number(mc.factor) : null);
        let fRes = null;
        if (base !== null && fb !== null) {
          const m0 = Math.fround(base * fb), m1 = Math.fround(base * (fb + 1e-7));
          fRes = { dF: 1e-7, movesHeldMass: (m1 !== m0), dMassDouble: base * 1e-7,
            minDeltaFthatMoves: (u !== null && base !== 0) ? u / base : null };
        }
        bodies.push({ i, declaredMass: decl, heldMass: held, ulp32: u,
          absDiff: held - decl, relDiff: (decl !== 0) ? (held - decl) / Math.abs(decl) : null,
          heldIsFroundOfDeclared: (held === Math.fround(decl)),
          baseMass: base, factor: fb, fResolution: fRes });
      }
      rows.push({ id, emoji: p.emoji || null, n: S.n,
        stateCarry: (p.physics || {}).stateCarry || null,
        massArrayType: S.m.constructor.name,
        massCalLaw: mc ? mc.law : null, bodies });
    }
    return rows;
  }, MASS_F32_TARGETS) };

out.pageErrors = pageErrors;
await browser.close();
} else {
  // ---- --regate: 既存 JSON を正本として読み直す(走行しない)----
  if (!fs.existsSync(OUT)) { console.error('[w249b] --regate: ' + OUT + ' が無い'); process.exit(1); }
  out = JSON.parse(fs.readFileSync(OUT, 'utf8'));
  out.presets = out.presets || [];
  decls = out.presets.map((p) => ({ id: p.id }));
  console.error('[w249b] --regate: 既存 ' + out.presets.length + ' 本を読み直す(走行なし・門だけ掛け直す)');
}

// ================================================================ 判定・相関(node 側)
const VER = { OK: '合', WIN: '窓', NG: '否', DEP: '従', TR: '転' };

// ---------------------------------------------------------------- 第250便c(第42報 W3・I2)
// **機械門** assessObservation。既存の 5 区分(合/窓/否/従/転)は**来歴・解釈の欄としてそのまま
// 保持**し、これは別欄である。門:
//     |y_sim − y_obs| ≤ 3σ_obs + ε_num 、 ε_num ≤ 0.3σ_obs
// ε_num は**保守的な決定論的数値誤差幅**(本便では dt 2 段 — 既定 0.016 と 0.008 — の同じ検出器の
// 差)であり、観測残差を見て増やすフィット項ではない。
// **第251便c(ChatGPT §8.1)**: ε_num は「dt 2 段の差」そのものではなく**宣言**である。ここに置くのは
// 「dt/2 と dt/4 の差の上限として記録した値」で、収束次数を添えて `numBoundDecl` に残す
// (本便の走行は dt と dt/2 の 2 段なので **収束次数は未測定**(order:null)— 次数 p が既知なら真の
//  誤差は |y(dt)−y(dt/2)|/(2^p−1) 程度で、記録値はその上限側である)。
//   ・観測誤差が読めない / 定義(検出器・周期の定義)が観測精度で一致しない / 一次表が未確認 → **未判定**
//   ・数値が収束していない(dt 2 段が無い・ε_num が 0.3σ を超える)              → **数値未解決**
// ±1% の目安(guideTolerance)は**観測一致ではない**。この門を通らない「合」は目安合である。
// 第257便d(第49報・3 審査 v15 一致): **門を 4 段で読む**。
//   (i) 数値収束(dt 3 段+正の観測次数)/(ii) 観測量対応(シミュレータの測定量と観測の量が
//   同じものを指しているか)/(iii) 観測適合(3σ)/(iv) 予測(較正の従属量でない合格)。
// **第 4 の状態 `mapping-unresolved` を足す**: σ も定義も一次表もあるが、**測っている量と
// 観測の量の対応が未確定**な行(例: タイミング解の e_T と、距離の極値から作る eProxy)。
// これは「合わない」でも「数値が足りない」でもない —— **定義の違う 2 量の差を棄却 σ として
// 読まないため**の区分である(3σ は 1 mm も緩めない)。
// 第258便d(W4): GATE の語彙は `tests/lib-w258d-evidence.mjs` の 1 本に集約した(QA も同じ 1 本を読む)。
// 第 5 の状態 `condition-mismatch` が足された(**合っていないのではなく、条件が違う**行の隔離)。
// 第253便b(第45報・ChatGPT §7.1): ε_num の**書き方の正本**。dt 2 段の差は**感度診断**であって
// 誤差上限ではない —— 漸近域でも粗い側の真の誤差は 2^p/(2^p−1)·|Q_h−Q_{h/2}| で、この差そのもの
// より大きい(p=1 で 2 倍・p=2 で 1.33 倍)。旧文言「上限としての宣言」は撤回する。
// --merge で持ち越した過去分の行にも同じ文言を張り直すため、関数にして 2 か所から使う。
function numBoundDeclOf(value, steps = 2, order = null, stage = 'h') {
  // 第255便d(第47報 N8): 3 段(dt, dt/2, dt/4)が揃った量だけ、ε_num の定義と文言が変わる。
  // 2 段のままの量の文言・値は第253便b から 1 文字も変えていない。
  // 第271便a(R3): **3 段登録系は判定段が h/4** なので、門が読む ε_num は
  // **最終 2 段差 |Q_{h/2}−Q_{h/4}|** である(|Q_h−Q_{h/4}| は `coarseNumBound` に残す)。
  if (steps >= 3) {
    return { value, steps, order, assessedStage: stage,
      basis: (stage === 'h4')
        ? 'dt/2=0.008・dt/4=0.004 の同じ検出器の **|Q_{h/2} − Q_{h/4}|**(最終 2 段差 —— '
          + '**判定段が h/4 なので、その段の誤差の目安は最後の 2 段の差である**。第271便a・R3。'
          + '|Q_h − Q_{h/4}| は `coarseNumBound` に履歴として残す)'
        : 'dt=0.016・dt/2=0.008・dt/4=0.004 の同じ検出器の **|Q_h − Q_{h/4}|**'
        + '(第252便b ③ と同じ ε_num の定義。3 段が揃ったので感度診断ではなく収束の量として使う)',
      orderNote: (Number.isFinite(order) && order > 0)
        ? `観測次数 p_obs=log₂|(Q_h−Q_{h/2})/(Q_{h/2}−Q_{h/4})| = ${order.toFixed(3)} を実測した`
          + '(スキームの次数ではなく**この窓のこの量の観測次数**である — 第252便b ③(b))。'
          + '3 段+正の次数が揃ったので、この量は収束の保留条件を満たす'
        : '**観測次数が負または測れない**(Q が単調でない)= 収束していない。'
          + '3 段は走ったが保留条件は満たさない(第253便b の門はこの量を「数値未解決」に留める)' };
  }
  return { value, steps, order,
    basis: 'dt=0.016 と dt/2=0.008 の同じ検出器の差(**感度診断** — dt/4 は走らせておらず、'
      + '誤差上限は未確認。漸近域でも粗い側の誤差は 2^p/(2^p−1)|Q_h−Q_{h/2}| で、この値より大きい)',
    orderNote: 'dt/4 を走らせていないので**収束次数は未測定**(order:null)。次数 p が実測されるまでは '
      + '|Q_h−Q_{h/2}| を誤差の上限として使えない —— 真の誤差は 2^p/(2^p−1) 倍で、'
      + 'p が小さいほど大きい(p=1 で 2 倍)。3 段+正の次数が揃うまでこの量は診断値である' };
}
// ---------------------------------------------------------------- 第271便a(第61報・AF12)
// **採用解の列を作る純関数**(宣言読取器の結果と、判定が実際に使った行から作る)。
//   ・`rule` …… `declared(judgement-sources.json)` か `default(csv-first-row)` か。
//   ・`recordId` / `source` / `solution` / `unit` / `value` / `sigma` …… **判定に配ったのと同じ値**。
//   ・`selectedBy` …… 宣言読取器がどの鍵で 1 行に決めたか(`record_id` / 内容照合)。
//   ・`sameObjectAsJudgement` …… 表示と判定が同じ行から出ていることの機械確認。
// **この列は判定を変えない** —— 判定が何を使ったかを読めるようにするだけである。
function buildAdopted({ q, declKey, decl, picked, row, legacyRow }) {
  const applied = !!(q.judgementSource && q.judgementSource.applied === true);
  const r = row || null;
  const sameObject = !!(r && (applied ? (picked && picked.row === r) : (r === legacyRow)));
  return {
    key: declKey,
    rule: decl ? (applied ? 'declared(judgement-sources.json)'
      : 'declared-but-not-applied(unit-mismatch)') : 'default(csv-first-row)',
    declared: !!decl,
    applied,
    recordId: r ? (r.recordId || r.record_id || null) : null,
    solutionId: decl ? (decl.solution_id || null) : null,
    solution: decl ? (decl.solution || null) : null,
    source: r ? String(r.source).slice(0, 90) : null,
    unit: r ? r.unit : null,
    value: Number.isFinite(q.obs) ? q.obs : null,
    sigma: Number.isFinite(q.obsSigmaCsv) ? q.obsSigmaCsv : null,
    csvValue: r ? ((r.valueRaw !== undefined) ? r.valueRaw : r.value) : null,
    csvSigma: r ? r.sigma : null,
    primaryVerified: r ? !!r.primaryVerified : null,
    selectedBy: decl ? ((picked && picked.matchedBy) ? picked.matchedBy : 'body|quantity|source|unit|value|sigma')
      : 'file-order-first-row',
    selectionReason: decl
      ? (applied
        ? '**宣言がある**ので `judgement-sources.json` の解を採った(`pickDeclaredRow` が 1 行に同定)。'
        : '**宣言はあるが単位が判定量と一致しない**ので切り替えていない(黙って換算しない)。')
      : '**宣言が無い**ので既定規則「CSV のファイル順で最初の行」を採った(第268便a からの後方互換)。'
        + '**verified の印で行を選び直さない**(印は行の属性であって選択規則ではない)。',
    sameObjectAsJudgement: sameObject,
    // 第271便a(AF12): **中心値がどこから来たか**を分けて記録する。宣言のある行は宣言行から
    // (AD5 の 6 つ同時)。**宣言の無い行は中心値が obsCard・σ が CSV 行**という組み合わせのままで、
    // 両者が一致するとは限らない —— **一致しているかどうかをここで数えられるようにする**
    // (合わせに行くかどうかは決断事項であって、本便では数えるだけである)。
    centerFrom: applied ? 'declared-row(AD5)' : 'obsCard(従来の参照値)',
    centerMatchesCsv: (() => {
      const cv = r ? Number((r.valueRaw !== undefined) ? r.valueRaw : r.value) : NaN;
      if (!Number.isFinite(cv) || !Number.isFinite(q.obs) || cv === 0) return null;
      return Math.abs(q.obs / cv - 1) <= 1e-12;
    })(),
    centerVsCsvRel: (() => {
      const cv = r ? Number((r.valueRaw !== undefined) ? r.valueRaw : r.value) : NaN;
      if (!Number.isFinite(cv) || !Number.isFinite(q.obs) || cv === 0) return null;
      return q.obs / cv - 1;
    })(),
    defaultRule: '宣言の無い body|quantity は **CSV のファイル順で最初の行**(`SIGMA_TABLE`)。'
      + '**中心値は obsCard・σ はその CSV 行**という組み合わせのままである(AD5 で 6 つ同時に'
      + '切り替えたのは宣言のある 2 件だけ)—— 一致していない行が何行あるかは '
      + '`out.adoptedCensus` が数える。',
    note: '**表示だけ新解・判定は旧解にならないように、判定へ配ったのと同じ行・同じ中心値・同じ σ を'
      + 'ここへ写している**(別経路で読み直していない)。旧経路は `judgementSource.previous` にある。',
  };
}

function assessObservation({ value, reference, sigma, numBound,
  converged = false, definitionMatches = false, sourceVerified = false,
  mappingResolved = true, mappingNote = '' }) {
  if (![value, reference].every(Number.isFinite) || !Number.isFinite(sigma) || !(sigma > 0))
    return { status: GATE.NA, reason: '観測誤差(σ)または有限の実測が無い' };
  const residual = value - reference, nSigma = Math.abs(residual) / sigma;
  const base = { residual, nSigma, sigma };
  // 第257便d: `definitionMatches` は **A を正本とした「定義が宣言されているか」**である
  // (第256便d ③ の実測: 検出器 A/B の差は定義差ではなく軌道側の雑音だった)。
  // A−B の広がりは `orbitNoiseIndicator` という別欄へ移した —— 門はそれを読まない。
  if (!definitionMatches)
    return Object.assign(base, { status: GATE.NA,
      reason: '判定量の定義・推定器が宣言されていない(検出器 A を正本にできない)' });
  // 第257便d: 定義は宣言されているが、**観測の量との対応**が未確定の行(e_T ⇄ eProxy 等)
  if (!mappingResolved)
    return Object.assign(base, { status: GATE.MAP,
      reason: '観測量対応が未確定' + (mappingNote ? '(' + mappingNote + ')' : '') });
  if (!sourceVerified)
    return Object.assign(base, { status: GATE.NA, reason: '一次表(観測の出所)が未確認' });
  if (!converged || !Number.isFinite(numBound) || numBound > 0.3 * sigma)
    return Object.assign(base, { status: GATE.NUM,
      // 第253便b: 「収束の保留」も同じ区分へ入る(3 段+正の次数が無い = 数値は未解決)
      reason: '数値誤差幅が予算(0.3σ)を超える/収束未確認(dt 3 段+正の実測次数が無い)', numBound });
  const tolerance = 3 * sigma + numBound;
  return Object.assign(base, { status: (Math.abs(residual) <= tolerance) ? GATE.OK : GATE.NG,
    numBound, tolerance });
}
// 一次表(publication の一次表)との照合が**済んだ**量をここへ登録する。鍵は
// `sample|target|quantity`(外部レビューの識別子)。**第250便c 時点では 0 件** — 本便は門の実装で
// あって照合そのものは行っていない(I5 の再初期化と同じ便で埋める)。
const PRIMARY_VERIFIED = new Set([]);

function classify(q) {
  const s = String(q);
  if (/自転|パルス/.test(s) && !/公転/.test(s)) return 'spin';
  if (/離心率/.test(s) || /(^|[(（\s])e=/.test(s)) return 'ecc';
  if (/近点移動|近日点前進|近点回転|歳差|近点前進|アプシ/.test(s)) return 'precession';
  if (/公転周期|恒星月|公転|周期/.test(s)) return 'period';
  return null;
}

if (REGATE) report = out.presets;   // 第263便c: 判定済みの表をそのまま持ち込む(作り直さない)
for (const P of (REGATE ? [] : out.presets)) {
  const d = P.decl, cfg = P.cfg;
  const base = P.runs.find((r) => r.tag === 'dt') || P.runs[0];
  const half = P.runs.find((r) => r.tag === 'dt/2') || null;
  const quarter = P.runs.find((r) => r.tag === 'dt/4') || null;   // 第255便d(N8): 3 段目
  const eighth = P.runs.find((r) => r.tag === 'dt/8') || null;    // 第258便d(W4): h8 検査点(4 段目)
  const version = (Number(d.physics.kFrame) > 0) ? 'dfm' : 'obs';
  const theory = THEORY_CONTROL.includes(d.id);
  const dep = DEPENDENT[d.id] || [];

  // ---- 主対象(相関量を測る対): 環サンプルは最内リング粒子・それ以外は最初の宣言周回体
  const main = cfg.ringInner ? base.targets[0]
    : (base.targets.find((t) => t.label === cfg.orbiters[0][1]) || base.targets[0]);

  // ---- 便利関数(測定値の取り出し)
  const revSecOf = (t) => t.revP.map((p) => p * P.toSec);          // [1周目, 2周目, …]
  const pRevSec = (t) => { const r = revSecOf(t); return r.length >= 2 ? r[1] : (r.length ? r[0] : null); };
  const pOscSec = (t) => (t.oscP !== null ? t.oscP * P.toSec : null);
  const eMeas = (t) => (t.eProxy1 !== null && t.revN >= 1 ? t.eProxy1 : t.eProxy);

  // ---- 相関量(**観測側の量**で作る: 較正質量ではなく観測質量 m/f、a は実測の (r_min+r_max)/2)
  const G = P.G, cl = P.c;
  const fCal = (d.massCalibration && Number.isFinite(Number(d.massCalibration.factor)))
    ? Number(d.massCalibration.factor) : 1;
  const mC = d.bodies[cfg.center] ? Number(d.bodies[cfg.center].m) / fCal : NaN;
  const oDecl = cfg.orbiters[0][0];
  const mO = d.bodies[oDecl] ? Number(d.bodies[oDecl].m) / fCal : NaN;
  const Rc = d.bodies[cfg.center] ? Number(d.bodies[cfg.center].radius) : NaN;
  const aMeas = (Number.isFinite(main.rMin1) && Number.isFinite(main.rMax1) && main.rMax1 > 0)
    ? 0.5 * (main.rMin1 + main.rMax1) : (main.osc0 ? main.osc0.a : NaN);
  const sep0 = main.osc0 ? main.osc0.r : NaN;
  const eps = Number(d.physics.softening || 0);
  const fw = (d.physics.frameWeight === undefined) ? 'pull' : d.physics.frameWeight;
  const pow = (fw === 'pull') ? 2 : (fw === 'pull3') ? 3 : (fw === 'pull4') ? 4 : 0;
  const D0e = (d.physics.D0pull !== undefined) ? Number(d.physics.D0pull) : Number(d.physics.D0 || 0);
  // χ_A = 相手(B)の引き重み / (D₀ᵖ + 同) — ✴️ の宣言値 χ_A=1.99e-4 を再現する定義
  const wOf = (m) => (pow === 0) ? m : m / Math.pow(sep0 * sep0 + eps * eps, pow / 2);
  const mCcal = d.bodies[cfg.center] ? Number(d.bodies[cfg.center].m) : NaN;
  const mOcal = d.bodies[oDecl] ? Number(d.bodies[oDecl].m) : NaN;
  const chiA = (Number.isFinite(mOcal) && Number.isFinite(sep0)) ? wOf(mOcal) / (D0e + wOf(mOcal)) : null;
  const chiB = (Number.isFinite(mCcal) && Number.isFinite(sep0)) ? wOf(mCcal) / (D0e + wOf(mCcal)) : null;
  const spinC = d.bodies[cfg.center] ? Number(d.bodies[cfg.center].spin || 0) : 0;
  const pRefSec = pRevSec(main) || pOscSec(main);
  const nMean = (pRefSec && P.toSec) ? 2 * Math.PI / (pRefSec / P.toSec) : null;
  const correlates = {
    nu: (Number.isFinite(mC) && Number.isFinite(mO)) ? mC * mO / Math.pow(mC + mO, 2) : null,
    chiA, chiB, chi: (chiA !== null && chiB !== null) ? 0.5 * (chiA + chiB) : null,
    GMac2: (Number.isFinite(G) && Number.isFinite(mC + mO) && Number.isFinite(aMeas) && Number.isFinite(cl))
      ? G * (mC + mO) / (aMeas * cl * cl) : null,
    aOverR: (Number.isFinite(aMeas) && Number.isFinite(Rc) && Rc > 0) ? aMeas / Rc : null,
    e: eMeas(main),
    spinRatio: (nMean && spinC) ? Math.abs(spinC) / nMean : 0,
    kFrame: Number(d.physics.kFrame), frameWeight: fw, D0eff: D0e, massFactor: fCal,
    mainTarget: main.label,
  };

  // ---- 判定の共通部
  const quantities = [], notes = [];
  if (cfg.note) notes.push(cfg.note);
  if (theory) notes.push('理論対照(`referenceKind:"theory-control"`)— 参照が観測ではなく理論値(LT 則・二体ケプラー)の行を含む');
  if (P.heavy) notes.push(`実行時 n=${base.n} の重いサンプル: dt/2 段は走らせていない(時間予算 — 明記)`);
  if (base.warnings && base.warnings.length) notes.push('validatePreset 警告: ' + base.warnings.join(' / '));
  if (base.nan) notes.push('**NaN が発生した**');
  if (base.clamp) notes.push(`安全クランプ計数 ${base.clamp}`);
  for (const t of base.targets) {
    if (t.revN === 0) notes.push(`${t.label}: 1 公転が時間予算に収まらないため接触要素(osculating)だけで出す`);
  }
  if (cfg.ringInner) notes.push('最内リング粒子は帯 [rIn,rOut] の乱数半径に置かれるので、obsCard の'
    + '「C環内縁(74,658km)」そのものではない — 周期の比較は帯内位置の分だけずれる(接触要素 P を detail に併記)');

  const finish = (q, kind) => {
    const tol = (q.obsErr !== null && q.obsErr !== undefined && q.obsErr > 0 && q.obs)
      ? Math.abs(q.obsErr / q.obs) * 100 : null;
    const useTol = (tol !== null) ? tol : 1.0;
    q.guideTolerance = (tol === null);
    q.toleranceUsedPct = useTol;
    if (dep.includes(kind)) {
      q.verdict = VER.DEP;
      q.note = (q.note ? q.note + ' / ' : '') + '較正の従属量(第248便b の現行判定)— 較正質量 f≈2 が ω̇ の式に入る帰結で、独立な予言ではない';
      return q;
    }
    if (q.meas === null || q.meas === undefined || !Number.isFinite(q.meas)) {
      q.verdict = VER.TR;
      q.note = (q.note ? q.note + ' / ' : '') + '照合できる実測が取れない(窓不足・宣言のみ)';
      return q;
    }
    if (q.obs === null || q.obs === undefined || !Number.isFinite(q.obs)) {
      q.verdict = VER.TR;
      q.note = (q.note ? q.note + ' / ' : '') + '観測欄に照合できる数値が無い(入力の転写・規約・帳簿量・理論値)';
      return q;
    }
    if (q.degenerate) {
      q.verdict = VER.TR;
      q.note = (q.note ? q.note + ' / ' : '') + '縮退・窓不足のため合否の対象にしない';
      return q;
    }
    if (q.obsRange) {   // 範囲で書かれた観測(有界帯)は「帯の中か外か」で判定する
      const { lo, hi } = q.obsRange;
      const inside = q.meas >= lo && q.meas <= hi;
      q.verdict = inside ? VER.OK : VER.NG;
      q.residualPct = inside ? null : pct(q.meas, (q.meas < lo) ? lo : hi);
      q.note = (q.note ? q.note + ' / ' : '')
        + `観測は範囲 [${lo}, ${hi}](点推定ではない)— 実測 ${q.meas.toPrecision(4)} は帯の${inside ? '内' : '外'}`;
      return q;
    }
    if (q.obs === 0) {   // 「≈0(厳密ケプラー)」型の参照
      const floor = (q.detail && q.detail.floorDeg) ? q.detail.floorDeg : 0;
      q.verdict = (Math.abs(q.meas) <= Math.max(floor, 1e-9)) ? VER.OK : VER.NG;
      q.note = (q.note ? q.note + ' / ' : '') + `参照は 0(理論)— 実測 ${q.meas.toExponential(3)}・検出限界 ${floor.toExponential(3)}`;
      return q;
    }
    q.residualPct = pct(q.meas, q.obs);
    if (!Number.isFinite(q.residualPct)) { q.verdict = VER.TR; return q; }
    q.strictOK = Math.abs(q.residualPct) <= 0.1;   // 目安を ±0.1% に締めたときの合否(感度の記録)
    if (Math.abs(q.residualPct) <= useTol) { q.verdict = VER.OK; return q; }
    let inWin = false;
    for (const c of d.claims) {
      if (!c.expected) continue;
      const cand = [q.meas];
      if (q.unit === 's') cand.push(q.meas / 86400, q.meas / 3.15576e7, q.meas / 3600);
      for (const v of cand) if (Number.isFinite(v) && v >= c.expected.min && v <= c.expected.max) inWin = true;
    }
    q.verdict = inWin ? VER.WIN : VER.NG;
    if (inWin) q.note = (q.note ? q.note + ' / ' : '') + '宣言(claims)の較正窓の内側だが観測許容の外';
    return q;
  };

  // 測定値の充填(obs は呼び出し側が入れる)
  // 第251便c: 周期の定義契約(ECC_TIMING_BINARY のコメント参照)
  const periastronFirst = ECC_TIMING_BINARY.has(d.id);
  // 第251便c: CSV の sigma 列を**門(assessObservation)専用の別欄** q.obsSigmaCsv へ載せる。
  // **5 区分(合/窓/否/従/転)の経路には入れない** — 5 区分は来歴・解釈の欄として不変に保つ
  // という第250便c の設計をそのまま守る(σ が効くのは門だけ)。
  const sigBody = SIGMA_BODY[d.id] || null;
  const applySigma = (q, t, kind, toJudgedUnit) => {
    // 第262便d: target ごとの宣言表を先に見る(太陽系は 1 preset に複数の周回体がある)。
    // 無ければ従来どおり preset 単位の SIGMA_BODY を**最初の周回体にだけ**当てる(NS/恒星は不変)。
    const body = SIGMA_TARGET_BODY[d.id + '|' + t.label]
      || ((sigBody && t.label === cfg.orbiters[0][1]) ? sigBody : null);
    if (!body) return q;
    // 第268便a(統括の読み (D)・AB2): **採用観測解の明示宣言**。
    // **第269便a(統括の読み (G))で直したところ** —— 第268便a の経路は、宣言が当たると
    // `q.obsSigmaCsv` に**宣言行の σ** を入れ、正式 `assessObservation` は `reference: q.obs`
    // (= obsCard の従来値)で判定していた。つまり**中心値は旧参照・σ だけ新解**という混在が
    // 通常走行で起きる(カロンでは 551854.08 s に Buie の 0.02592 s が付く)。
    // さらに解決失敗時は `picked.row || SIGMA_TABLE.get(...)` で**旧行へ黙って戻って**いた。
    // 最小修正:
    //   ・**AD5(署名便)までは旧正式経路を一貫して保つ** —— `q.obsSigmaCsv` は
    //     **従来行(ファイル順の最初)**からだけ採る。
    //   ・宣言は**診断欄** `q.judgementSource`(`applied:false`・`mode:'diagnostic-only-until-AD5'`)
    //     にだけ置き、宣言行の value/sigma は**別欄** `declaredRow` に入れる。
    //   ・**宣言の解決失敗は入力エラーとして throw**(旧行へ黙って戻さない)。
    // AD5 の署名便で、中心値・σ・単位変換・解 ID・verified 状態・測定定義を**同時に**切り替える。
    const declKey = body + '|' + SIGMA_QUANT[kind];
    const decl = JUDGEMENT_SOURCES.byKey.get(declKey) || null;
    const picked = decl ? pickDeclaredRow(decl, SIGMA_ROWS_ALL) : { row: null, reason: null };
    if (decl && !picked.row) {
      throw new Error('[w249b] 宣言 ' + declKey + ' が CSV の 1 行に解決できない(' + picked.reason
        + ')— **旧行へ黙って戻さない**。judgement-sources.json か CSV を直すこと');
    }
    const legacyRow = SIGMA_TABLE.get(declKey);   // 従来行(ファイル順の最初)= AD5 **前**の正式経路
    // ---------------------------------------------------------------- 第270便a(第60報 W1・AD5)
    // **宣言を正式経路へ入れる**(第269便a の `diagnostic-only-until-AD5` を終える)。
    // 切り替えるのは **6 つ同時**である —— 中心値(`q.obs`)・σ(`q.obsSigmaCsv`)・単位・解 ID
    // (`solution`)・verified 状態(`sigmaPrimaryVerified`)・測定定義(`measurementDefinition`)。
    // **1 つでも欠けたら切り替えない**(中心値だけ新解・σ だけ新解という混在を作らないため)。
    // 旧経路(従来行での参照値と σ)は `judgementSource.previous` に**温存する**(履歴は消さない)。
    // 5 区分(合/窓/否/従/転)の許容は従来どおり **obsCard の ±** で決める —— 第251便c の
    // 「CSV の σ は 5 区分の経路へ入れない」という規約は AD5 でも変えない(σ が効くのは門だけ)。
    let row = legacyRow;
    if (decl) {
      const dRow = picked.row;
      const judgedUnit = q.unit;   // fillPeriod/fillEcc/fillPrec が入れた判定量の単位
      const unitOkPeriod = (kind === 'period' && decl.unit === 's' && judgedUnit === 's');
      const unitOkEcc = (kind === 'ecc' && decl.unit === '1');
      const unitOkPrec = (kind === 'precession' && decl.unit === 'deg/yr'
        && typeof toJudgedUnit === 'function');
      const unitOk = unitOkPeriod || unitOkEcc || unitOkPrec;
      const centerRaw = Number(decl.value);
      const center = !unitOk ? null
        : (unitOkPrec ? toJudgedUnit(centerRaw) : centerRaw);
      const sigmaRaw = (decl.sigma === undefined || decl.sigma === null) ? null : Number(decl.sigma);
      const sigmaJudged = (sigmaRaw === null || !unitOk) ? null
        : (unitOkPrec ? toJudgedUnit(sigmaRaw) : sigmaRaw);
      const previous = { mode: 'diagnostic-only-until-AD5', since: '第269便a',
        obs: (Number.isFinite(q.obs) ? q.obs : null),
        obsSigmaCsv: (Number.isFinite(q.obsSigmaCsv) ? q.obsSigmaCsv : null),
        officialRow: legacyRow ? { body: legacyRow.body, quantity: legacyRow.quantity,
          unit: legacyRow.unit, sigma: legacyRow.sigma,
          source: String(legacyRow.source).slice(0, 90),
          primaryVerified: !!legacyRow.primaryVerified } : null,
        note: '**AD5 前の正式経路**(中心値は obsCard 由来・σ は従来行)。**旧値は履歴として残す** —— '
          + '新値として写してはならない。' };
      q.judgementSource = { declared: true, key: declKey, source: decl.source,
        solution: decl.solution || null, unit: decl.unit || null,
        csvQuantity: decl.csvQuantity || decl.quantity, declaredAt: decl.declared || null,
        declaredRow: { value: decl.value, sigma: sigmaRaw,
          unit: decl.unit || null, csvSigma: dRow.sigma, csvUnit: dRow.unit,
          primaryVerified: !!dRow.primaryVerified },
        candidateResolved: true, resolveReason: null,
        applied: unitOk, mode: unitOk ? 'applied-AD5' : 'not-applied(unit-mismatch)',
        unitOk, judgedUnit,
        centerApplied: center, sigmaApplied: sigmaJudged,
        // **測定定義**(どの推定器のどの窓で測った量を、この解と比べているのか)を同時に宣言する
        measurementDefinition: (kind === 'period')
          ? `検出器 A(ṙ の −→+ 交差)の近点間周期・窓=最初の ${PERI_WINDOW} 近点`
            + `(${PERI_WINDOW - 1} 区間)/ 非タイミング連星は同方向 1 周(2 周目)`
          : (kind === 'ecc') ? '1 周目の距離の極値の比 eProxy=(r_max−r_min)/(r_max+r_min)'
            : '近点方位の直線 fit の傾き(検出器 A)',
        officialRow: dRow ? { body: dRow.body, quantity: dRow.quantity, unit: dRow.unit,
          sigma: dRow.sigma, source: String(dRow.source).slice(0, 90),
          primaryVerified: !!dRow.primaryVerified } : null,
        previous,
        note: unitOk
          ? '**AD5(第270便a)で正式経路へ入れた** —— 中心値・σ・単位・解 ID・verified 状態・'
            + '測定定義を**同時に**宣言行から採っている(混在を作らない)。旧経路は `previous` に温存。'
            + ' 5 区分の許容は従来どおり obsCard の ± である(CSV の σ は門だけ)。'
          : '**単位が判定量と一致しないので切り替えない**(黙って換算しない)。旧経路のままである。' };
      if (unitOk) {
        // **6 つ同時**に切り替える(どれか 1 つだけを動かさない)
        if (Number.isFinite(center)) q.obs = center;
        q.obsUnitDeclared = decl.unit;
        q.declaredSolution = decl.solution || null;
        q.measurementDefinition = q.judgementSource.measurementDefinition;
        row = dRow;   // σ・verified 状態・出典もこの行から採る(下の共通経路がそのまま使う)
        if (q.kind === 'period' && q.detail && Number.isFinite(q.obs)) {
          // 中心値が動いたので、同じ定義の残差欄も宣言行に対して作り直す(古い残差を残さない)
          if (Number.isFinite(q.detail.periASec)) q.residualPctPeri = pct(q.detail.periASec, q.obs);
          const rev1 = Array.isArray(q.detail.revSec) ? q.detail.revSec[1] : null;
          if (Number.isFinite(rev1)) q.residualPctRev = pct(rev1, q.obs);
        }
      }
    }
    if (!row) { q.sigmaNote = `CSV に ${body}|${SIGMA_QUANT[kind]} の行が無い`; return q; }
    q.sigmaSource = { body: row.body, quantity: row.quantity, unit: row.unit, sigma: row.sigma,
      source: String(row.source).slice(0, 90), primaryVerified: row.primaryVerified };
    q.sigmaPrimaryVerified = !!row.primaryVerified;
    if (row.sigma === null) { q.sigmaNote = 'CSV の sigma 列が空欄(**未記録**であって 0 ではない)'; return q; }
    let s = null;
    if (kind === 'period' && row.unit === 's') s = row.sigma;
    else if (kind === 'ecc' && row.unit === '1') s = row.sigma;
    else if (kind === 'precession' && row.unit === 'deg/yr' && typeof toJudgedUnit === 'function')
      s = toJudgedUnit(row.sigma);
    if (Number.isFinite(s) && s > 0) {
      q.obsSigmaCsv = s;
      q.sigmaNote = `σ=${s} を CSV(${row.body}|${row.quantity}・${row.unit})から転写`
        + `(sigma_primary=${row.primaryVerified ? 'verified' : 'unverified'})`;
    } else q.sigmaNote = `CSV の σ の単位(${row.unit})が判定量へ換算できない — 転写しない`;
    // ---------------------------------------------------------------- 第271便a(第61報・AF12)
    // **採用解(`adopted`)の列**を、宣言読取器(`pickDeclaredRow`)の結果から作る。
    // **表示だけ新解・判定は旧解**という混在を作らないために、この列は
    // **判定が実際に使った同じ行オブジェクト(`row`)と同じ中心値(`q.obs`)・同じ σ(`q.obsSigmaCsv`)**
    // から作る(別経路で読み直さない)。宣言の**無い** body|quantity の既定規則は
    // 第268便a からの後方互換のとおり「**CSV のファイル順で最初の行**」であり、
    // **verified かどうかで行を選び直したりはしない**(印は行の属性であって選択規則ではない)。
    q.adopted = buildAdopted({ q, declKey, decl, picked, row, legacyRow });
    return q;
  };
  // ---------------------------------------------------------------- 第270便a(第60報 W1・AD8)
  // **換算後の量を正式判定へ繋ぐ**(`AD8_CONVERT` に宣言した系だけ)。
  //   ϖ̇ [deg/yr] = Δϖ [deg/周] × YEAR_SEC / P_peri、P_peri は**傾きと同じ近点集合**の平均間隔。
  //   観測値と σ は CSV の deg/yr の行を**換算せずそのまま**使う(両辺を同じ係数で割るのと同値)。
  //   窓が足りない(近点が宣言本数に届かない)段は**換算しない**:「未測定」と書いて判定へ流さない。
  // **これは合否の宣言ではない** —— どちらへ動くかは走らせて測る。
  const applyAD8 = (q, t) => {
    if (!AD8_CONVERT.has(d.id) || q.kind !== 'precession' || q.unit !== 'deg/orbit') return q;
    const body = SIGMA_TARGET_BODY[d.id + '|' + t.label]
      || ((sigBody && t.label === cfg.orbiters[0][1]) ? sigBody : null);
    const row = body ? SIGMA_TABLE.get(body + '|' + SIGMA_QUANT.precession) : null;
    const det = q.detail || {};
    const pSame = Number.isFinite(det.pPeriSameWindowSec) ? det.pPeriSameWindowSec : null;
    const nSame = Number.isFinite(det.pPeriSameWindowN) ? det.pPeriSameWindowN : null;
    const need = (base.stopRule && Number.isFinite(base.stopRule.needPeriastra))
      ? base.stopRule.needPeriastra : PERI_WINDOW;
    const ok = !!(row && row.unit === 'deg/yr' && Number.isFinite(row.value)
      && Number.isFinite(q.meas) && pSame !== null && pSame > 0 && nSame !== null && nSame >= need);
    const converted = ok ? precessionDegPerYear({ degPerOrbit: q.meas, pPeriSec: pSame }) : null;
    q.ad8 = { converted: ok && Number.isFinite(converted), since: '第270便a(AD8)',
      registry: THREE_STAGE_IDS.has(d.id),
      needPeriastra: need, periastraUsed: nSame, pPeriSec: pSame,
      periodDef: 'periastron-same-window', yearSec: YEAR_SEC,
      contract: 'ϖ̇ [deg/yr] = Δϖ [deg/周] × ' + YEAR_SEC + ' / P_peri。P_peri は**傾き fit と'
        + '同じ近点集合**(' + (nSame === null ? '—' : nSame) + ' 近点・'
        + ((nSame || 1) - 1) + ' 区間)の平均間隔である(第269便a の契約)。'
        + '**観測値と σ は CSV の deg/yr をそのまま使う**(換算係数を σ に混ぜない)。',
      reason: ok ? null
        : (!row ? 'CSV に deg/yr の行が無い'
          : (pSame === null ? '**傾きと同じ窓の近点間周期が未測定**(短い窓へ置換しない)'
            : (nSame !== null && nSame < need)
              ? `近点が ${nSame} 本で宣言 ${need} 本に足りない(換算しない)`
              : '実測が有限でない')),
      note: '**換算は判定ではない** —— 合否は門(assessObservation)が決める。'
        + '換算前(°/周)の行は `previousUnit` に温存する(切断点 `unit-not-converted` の対照は'
        + '換算していない系に残る)。' };
    if (!q.ad8.converted) return q;
    // **換算前の行を温存**(旧値を新値として写さないため・履歴は消さない)
    q.previousUnit = { unit: 'deg/orbit', meas: q.meas, obs: q.obs,
      obsErr: (Number.isFinite(q.obsErr) ? q.obsErr : null),
      obsSigmaCsv: (Number.isFinite(q.obsSigmaCsv) ? q.obsSigmaCsv : null),
      sigmaNote: q.sigmaNote || null,
      residualPct: Number.isFinite(q.residualPct) ? q.residualPct : null,
      cut: 'unit-not-converted',
      why: '第266便a〜第269便a の切断点(obsCard が °/周・CSV が deg/yr で、換算しないまま σ を'
        + '当てると見かけの「合(3σ)」になる)。**第270便a(AD8)で換算を入れて正式接続した** —— '
        + 'この欄は**換算前の記録**であって、新しい判定値ではない。' };
    const f = YEAR_SEC / pSame;   // deg/周 → deg/yr の係数(正)
    q.meas = converted;
    q.obs = row.value;
    q.obsErr = Number.isFinite(q.obsErr) ? q.obsErr * f : q.obsErr;
    q.unit = 'deg/yr';
    q.method = (q.method || '') + ` / **換算後 ϖ̇ [deg/yr]**(傾きと同じ ${nSame} 近点`
      + `(${nSame - 1} 区間)の近点間周期 ${pSame.toPrecision(10)} s で割った — 第270便a AD8)`;
    if (Number.isFinite(row.sigma) && row.sigma > 0) {
      q.obsSigmaCsv = row.sigma;   // **換算しない**(観測側は既に deg/yr である)
      q.sigmaNote = `σ=${row.sigma} を CSV(${row.body}|${row.quantity}・${row.unit})から`
        + '**換算せずそのまま**転写(判定量を deg/yr へ写したので単位が一致する — 第270便a AD8)'
        + `(sigma_primary=${row.primaryVerified ? 'verified' : 'unverified'})`;
      q.sigmaSource = { body: row.body, quantity: row.quantity, unit: row.unit, sigma: row.sigma,
        source: String(row.source).slice(0, 90), primaryVerified: row.primaryVerified };
      q.sigmaPrimaryVerified = !!row.primaryVerified;
    }
    q.detail = Object.assign({}, q.detail, { degPerYearFromSameWindow: converted,
      degPerYearFactor: f, degPerOrbitBeforeAD8: q.previousUnit.meas });
    // 第271便a(AF12): 換算で中心値と σ の出所が **deg/yr の行**へ移ったので、採用解の列も
    // **判定が実際に使ったその行**から作り直す(換算前の行は `previousUnit` に残っている)。
    q.adopted = Object.assign(
      buildAdopted({ q, declKey: body + '|' + SIGMA_QUANT.precession,
        decl: null, picked: null, row, legacyRow: row }),
      { ad8Converted: true,
        ad8Note: '**AD8 の換算後**(判定量 ϖ̇ [deg/yr])の採用解である。中心値と σ は '
          + 'CSV の deg/yr 行を**換算せずそのまま**採っている(換算したのは実測の側だけ)。' });
    return q;
  };

  const fillPeriod = (q, t) => {
    const revs = revSecOf(t);
    const pRev = pRevSec(t), pOsc = pOscSec(t);
    const pPeriA = (t.A.perMean !== null) ? t.A.perMean * P.toSec : null;
    const pPeriB = (t.B.perMean !== null) ? t.B.perMean * P.toSec : null;
    if (periastronFirst) {
      // ①④ 近点間で判定する。近点が測れなければ**未測定**(同方向1周・接触要素へ置換しない)
      q.periodDef = (pPeriA !== null) ? 'periastron' : 'unmeasured';
      q.meas = pPeriA;
      q.method = (pPeriA !== null)
        ? `近点間周期(検出器A・ṙ の −→+ 交差。**窓=最初の ${t.A.perWindow} 近点(${t.A.perWindow - 1} 区間)**`
          + ` — 第251便c の定義契約 + 第252便b の窓固定。検出できた近点は ${t.A.perFound} 個)`
        : `**未測定**: 近点間周期の窓(最初の ${PERI_WINDOW} 近点)が埋まらない`
          + `(検出できた近点 ${t.A.perFound === undefined ? 0 : t.A.perFound} 個)— 他の周期定義へは置換しない`
          + '(第251便c の定義契約 + 第252便b の窓固定)';
      if (pPeriA === null) q.note = (q.note ? q.note + ' / ' : '')
        + '離心タイミング連星の判定量は近点間周期だが**近点が測れない**ため未測定とする'
        + `(同方向1周 ${pRev === null ? '—' : pRev.toPrecision(9) + ' s'}・接触要素 `
        + `${pOsc === null ? '—' : pOsc.toPrecision(9) + ' s'} は detail に残すが判定には使わない)`;
    } else {
      q.periodDef = (pRev !== null) ? 'revolution' : ((pOsc !== null) ? 'osculating' : 'unmeasured');
      q.meas = (pRev !== null) ? pRev : pOsc;
      q.method = (pRev !== null) ? '同方向1周(2周目 — obsCard の数え方)'
        : '接触要素の平均 P(1公転が時間予算に収まらない)';
    }
    q.unit = 's';
    q.detail = { revSec: revs.slice(0, 6), periASec: pPeriA, periBSec: pPeriB, oscSec: pOsc,
      periWindow: t.A.perWindow || null, periFoundA: t.A.perFound, periFoundB: t.B.perFound,
      periUnmeasuredA: t.A.perUnmeasured, periAllSec: (t.A.perMeanAll !== null && t.A.perMeanAll !== undefined) ? t.A.perMeanAll * P.toSec : null,
      revN: t.revN, aOscMean: t.oscA, aOsc0: t.osc0.a,
      periodDef: q.periodDef,
      // ③ 検出器 A/B は**同じ近点間周期どうし**で比べる(定義違いの広がりは crossDef 側へ)
      detPairSec: (pPeriA !== null && pPeriB !== null) ? [pPeriA, pPeriB] : null };
    if (q.obs) {
      if (pPeriA !== null) q.residualPctPeri = pct(pPeriA, q.obs);
      if (pRev !== null) q.residualPctRev = pct(pRev, q.obs);
      if (pPeriA !== null && pRev !== null) q.defDiffPct = pct(pPeriA, pRev);
    }
    return q;
  };
  const fillEcc = (q, t) => {
    q.meas = eMeas(t); q.unit = '-';
    q.method = '1周目の半径比 proxy (r_max−r_min)/(r_max+r_min)';
    q.detail = { rMin1: t.rMin1, rMax1: t.rMax1, eProxyAll: t.eProxy, eOscMean: t.oscE,
      eOsc0: t.osc0.e, revN: t.revN };
    return q;
  };
  const fillPrec = (q, t) => {
    q.meas = t.A.slopeDeg; q.unit = 'deg/orbit';
    q.method = `近点移動 検出器A(ṙ 交差・近点 ${t.A.nPeri} 個の直線 fit)`;
    q.detail = { detectorA: t.A.slopeDeg, residA: t.A.residDeg, nPeriA: t.A.nPeri,
      detectorB: t.B.slopeDeg, residB: t.B.residDeg, nPeriB: t.B.nPeri,
      floorDeg: (t.A.residDeg !== null && t.A.nPeri > 1) ? 3 * t.A.residDeg / Math.sqrt(t.A.nPeri) : null,
      pRevSec: pRevSec(t), revN: t.revN,
      // 第250便c: °/日 ⇄ °/周 の換算に使う周期を明示する(近点間 = slopeDeg と同じ間隔)
      pPeriSec: (Number.isFinite(t.A.perMean) && t.A.perMean > 0) ? t.A.perMean * P.toSec : null,
      convPeriod: 'periastron',
      // 第269便a(統括の読み (E)): **傾きと同じ近点集合**の近点間周期。上の `pPeriSec` は
      // 第252便b の固定窓(最初の 20 近点)なので、**同じ窓ではない**(それが窓の不一致だった)。
      pPeriSameWindowSec: (Number.isFinite(t.A.perMeanFit) && t.A.perMeanFit > 0)
        ? t.A.perMeanFit * P.toSec : null,
      pPeriSameWindowN: (t.A.perFitN === undefined) ? null : t.A.perFitN,
      pPeriWindow: t.A.perWindow || null };
    const ee = eMeas(t);
    q.detail.eMeasured = ee;
    if (q.detail.floorDeg !== null && q.meas !== null && Math.abs(q.meas) < q.detail.floorDeg) {
      q.degenerate = true;
      q.note = (q.note ? q.note + ' / ' : '')
        + `検出限界未満(|実測| < 3σ/√n = ${q.detail.floorDeg.toExponential(2)} °/周)— 窓が足りない`;
    }
    // 円軌道に近い対象は近点方位そのものが縮退する(角度 fit は雑音を測る)。合否の対象にしない
    if (Number.isFinite(ee) && ee < 1e-3) {
      q.degenerate = true;
      q.note = (q.note ? q.note + ' / ' : '')
        + `実測 e=${ee.toExponential(2)} は円軌道に近く**近点方位が縮退**する — 近点移動は測定できない`;
    }
    return q;
  };

  // ---- obsCard の行を 1 行ずつ照合
  const covered = new Set();
  let prevObsVals = null;
  for (const row of d.obsCard) {
    const kind = classify(row.q);
    const inherit = /^\s*同(上|左)/.test(row.obs);
    // obsCard は「観測が無い/照合の対象ではない」を obs 欄の先頭「—」で表す規約なので、
    // その行からは観測値を取り出さない(括弧内の解析値・注記を観測と誤読しないため)
    const noObs = /^\s*[—―–-]/.test(row.obs);
    const obsRate = noObs ? null : parseRate(row.obs);
    const modRate = parseRate(row.model);
    let obsVals = noObs ? null : parseObs(row.obs);
    if (inherit && prevObsVals) obsVals = prevObsVals;
    if (!inherit && obsVals) prevObsVals = obsVals;
    const modVals = parseObs(row.model);

    if (!kind) {
      quantities.push({ name: row.q, kind: 'other', version, target: null,
        model: row.model.slice(0, 110), obs: row.obs.slice(0, 110), obsErr: null, meas: null,
        unit: null, residualPct: null, verdict: VER.TR, method: 'declaration', standard: false,
        note: '合否の対象ではない宣言行(規約・帳簿・単位族・受け皿など)' });
      continue;
    }

    // 対象の割り当て
    const named = []; for (const t of base.targets) if (String(row.q).includes(t.label)) named.push(t);
    const nVals = (kind === 'precession' && obsRate) ? 1 : (obsVals ? obsVals.length : 1);
    let assign;
    if (named.length && named.length === nVals) assign = named;
    else if (named.length === 1) assign = named;
    else if (obsVals && obsVals.length === base.targets.length) assign = base.targets;
    else assign = [named.length ? named[0] : main];

    for (let i = 0; i < assign.length; i++) {
      const t = assign[i];
      const ov = obsVals ? obsVals[Math.min(i, obsVals.length - 1)] : null;
      const mv = modVals ? modVals[Math.min(i, modVals.length - 1)] : null;
      const q = { name: row.q + (assign.length > 1 ? `(${t.label})` : ''), kind, version,
        target: t.label, declaredModel: row.model.slice(0, 110), declaredObs: row.obs.slice(0, 110),
        model: null, obs: null, obsErr: null, meas: null, unit: null,
        residualPct: null, modelResidualPct: null, verdict: null, method: null, note: null,
        standard: false };
      covered.add(t.label + '|' + kind);

      if (kind === 'period') {
        const u = (ov && ov.unit && SEC[ov.unit]) ? SEC[ov.unit] : null;
        if (u) { q.obs = ov.v * u; q.obsErr = (ov.err !== null) ? ov.err * u : null; }
        else if (ov) q.note = '観測欄の単位が読めない(率の宣言など)';
        if (mv && mv.unit && SEC[mv.unit]) q.model = mv.v * SEC[mv.unit];
        fillPeriod(q, t);
        applySigma(q, t, 'period');
      } else if (kind === 'ecc') {
        const rg = noObs ? null : parseRange(row.obs);
        if (rg) { q.obsRange = rg; q.obs = 0.5 * (rg.lo + rg.hi); }
        else if (ov) { q.obs = ov.v; q.obsErr = ov.err; }
        if (mv) q.model = mv.v;
        fillEcc(q, t);
        applySigma(q, t, 'ecc');
      } else if (kind === 'precession') {
        // 第250便c(第42報 W3): slopeDeg は**近点番号に対する**傾きなので、観測の °/日・°/年を
        // °/周へ直す換算にも**同じ近点間隔(近点間周期)**を使う。以前は同方向1周(revP)を使い、
        // 無ければ osculating P へ落としていたが、大きく歳差する軌道では両者が数 % 違うため
        // 系統誤差になる(🪐 D68: 同方向 17865.95 s / 近点間 18224.86 s = 2.0% 差)。
        // フォールバックは置かない — 近点間隔が取れない対象は換算しない(= 判定しない)。
        const pS = (Number.isFinite(t.A.perMean) && t.A.perMean > 0) ? t.A.perMean * P.toSec : null;
        const pDays = pS ? pS / 86400 : NaN;
        const conv = (r) => { if (!r) return null;
          if (r.kind === 'deg-per-orbit') return r.v;
          if (r.kind === 'deg-per-day') return r.v * pDays;
          if (r.kind === 'deg-per-century') return r.v * pDays / 36525;
          if (r.kind === 'deg-per-year') return r.v * pDays / 365.25;
          return null; };
        if (obsRate) {
          q.obs = conv(obsRate); q.model = conv(modRate);
          fillPrec(q, t);
          // 第251便c: CSV の σ は deg/yr。判定量は °/周なので**観測値と同じ換算**(近点間周期)を掛ける
          applySigma(q, t, 'precession', (s) => conv({ kind: 'deg-per-year', v: s }));
        } else if (ov && ov.unit && SEC[ov.unit] && /周期/.test(row.q)) {
          // 「近点回転の周期 8.85 年」型 — 実測 Δϖ から 360°/Δϖ×P で周期へ換算して照合する
          q.obs = ov.v * SEC[ov.unit]; q.obsErr = (ov.err !== null) ? ov.err * SEC[ov.unit] : null;
          if (mv && mv.unit && SEC[mv.unit]) q.model = mv.v * SEC[mv.unit];
          fillPrec(q, t);
          const sl = q.meas;
          q.detail.slopeDegPerOrbit = sl;
          q.meas = (sl && pS) ? Math.abs(360 / sl) * pS : null;
          q.unit = 's';
          q.method = `近点回転の周期 = 360°/Δϖ × P(Δϖ は検出器A・近点 ${t.A.nPeri} 個の直線 fit)`;
        } else {
          q.model = conv(modRate);
          fillPrec(q, t);
        }
        // 第270便a(AD8): 宣言した系だけ、判定量を **ϖ̇ [deg/yr]** へ写して正式判定へ繋ぐ
        applyAD8(q, t);
      } else if (kind === 'spin') {
        const obsList = noObs ? [] : parseAllUnits(row.obs);
        if (!obsList.length) { q.method = 'declaration'; q.note = '観測欄が周期の数値ではない(帳簿・上限・比・宣言)'; }
        else {
          const cand = [];
          for (const idx of [t.ci, t.oi]) {
            const sd = base.spinDrift.find((s) => s.i === idx);
            if (sd && sd.s0) cand.push({ src: `body#${idx} 殻 spin`, per: 2 * Math.PI / Math.abs(sd.s0) * P.toSec, drift: sd.driftPct });
            const cd = base.coreDrift.find((s) => s.i === idx);
            if (cd && cd.omega0) cand.push({ src: `body#${idx} コア Ω`, per: 2 * Math.PI / Math.abs(cd.omega0) * P.toSec, drift: cd.driftPct });
          }
          // どの観測(A/B・殻/コア)がどのチャネルに転写されているかは宣言依存なので、
          // 「候補 × 観測」の全組から比が 1 に最も近い組を採る(採った組は method に書く)
          let best = null;
          for (const c2 of cand) for (const o2 of obsList) {
            const ob = Math.abs(o2.v) * SEC[o2.unit];
            const d2 = Math.abs(Math.log(c2.per / ob));
            if (best === null || d2 < best.d) best = { d: d2, per: c2.per, src: c2.src, drift: c2.drift, obs: ob };
          }
          if (best) { q.obs = best.obs; q.unit = 's'; q.meas = best.per;
            q.method = `${best.src} から 2π/ω(転写の読み戻し・並記された観測から最も近い組を採る)`;
            q.detail = { candidates: cand, obsList, driftPct: best.drift }; }
          else q.note = '自転が転写されていない(spin=0・コア無し)';
        }
      }
      quantities.push(finish(q, kind));
    }
  }

  // ---- 標準検出器の実測(obsCard に無い量も同じ器で必ず出す)
  for (const t of base.targets) {
    for (const kind of ['period', 'ecc', 'precession']) {
      if (covered.has(t.label + '|' + kind)) continue;
      const q = { name: `実測(標準検出器): ${{ period: '公転周期', ecc: '離心率', precession: '近点移動' }[kind]}(${t.label})`,
        kind, version, target: t.label, declaredModel: null, declaredObs: null,
        model: null, obs: null, obsErr: null, meas: null, unit: null,
        residualPct: null, modelResidualPct: null, verdict: null, method: null,
        note: 'obsCard に対応する観測行が無い(**観測台帳の欠け** — 外部レビュー指摘)', standard: true };
      if (kind === 'period') fillPeriod(q, t);
      else if (kind === 'ecc') fillEcc(q, t);
      else fillPrec(q, t);
      // ---------------------------------------------------------------- 第270便a(第60報 W1・AD5)
      // **宣言のある鍵だけ**、obsCard に行が無い量(標準検出器の行)でも宣言行を判定の参照にする。
      // 宣言は「この量はどの解と比べるか」の宣言なので、obsCard に行が無いという理由で
      // **宣言が宙に浮くのをやめる**(第269便a まで金星 e の宣言はどの量にも届いていなかった)。
      // **宣言の無い鍵はここを通らない**(標準検出器の行に σ 宛先を一斉に引く変更ではない)。
      const bodyStd = SIGMA_TARGET_BODY[d.id + '|' + t.label]
        || ((sigBody && t.label === cfg.orbiters[0][1]) ? sigBody : null);
      if (bodyStd && kind !== 'precession'
        && JUDGEMENT_SOURCES.byKey.has(bodyStd + '|' + SIGMA_QUANT[kind])) {
        applySigma(q, t, kind);
        q.declaredOnlyRow = true;
      }
      quantities.push(finish(q, kind));
    }
  }

  // ---- 第257便d → **第270便a(AE9)**: 未測定の**理由**を分ける。
  // 旧: `time-budget`(壁時計で切れた=機種依存)/ `window`。
  // 新: `max-steps`(**宣言した步数上限**で止まった)/ `window`(步数は余っているのに近点が出ない)/
  //     `resource-limit`(壁時計の**資源上限**を超えた段 —— 途中軌道を判定へ流さない)。
  const sr0 = base.stopRule || null;
  for (const q of quantities) {
    if (q.kind !== 'period' || q.periodDef !== 'unmeasured') continue;
    const bt = base.timeBudget || {};
    q.unmeasuredReason = sr0 ? (sr0.resourceExceeded ? 'resource-limit'
      : (sr0.cappedByDeclaration ? 'max-steps' : 'window')) : 'window';
    q.unmeasuredNote = (q.unmeasuredReason === 'resource-limit')
      ? `**unmeasured/resource-limit**: 壁時計の資源上限 ${sr0.wallCeilingSec} s を超えた`
        + `(実 ${(sr0.wallSec || 0).toFixed(1)} s)。**途中までの軌道を判定へ流さない**`
      : (q.unmeasuredReason === 'max-steps')
        ? `**unmeasured/max-steps**: **宣言した步数上限 ${sr0.maxSteps} 步**(${sr0.maxStepsSource})`
          + `まで走って ${PERI_WINDOW} 近点窓が埋まらなかった(検出できた近点 `
          + `${JSON.stringify(sr0.periFoundA)})。**機種には依存しない打ち切り**であって、`
          + '数値が収束しないという意味ではない'
        : `**unmeasured/window**: 步数は余っている(${sr0 ? sr0.stepsRun : bt.stepsRun} / `
          + `${sr0 ? sr0.maxSteps : bt.maxSteps} 步)のに ${PERI_WINDOW} 近点窓が埋まらない`
          + `(検出できた近点 ${JSON.stringify(sr0 ? sr0.periFoundA : bt.periFoundA)})— 軌道そのものの性質`;
  }
  // ---- 第270便a(AE9)④: **資源上限を超えた段の測定は最終判定へ流さない**。
  // 現行の走行では 1 段も超えない(超えていないことを `out.stopRuleCensus` が数で残す)。
  // 超えた場合にだけ効く経路である —— 打ち切った軌道から作った値で合否を言わないためにある。
  if (sr0 && sr0.resourceExceeded) {
    for (const q of quantities) {
      q.resourceExceeded = true;
      q.measBeforeResourceLimit = q.meas;
      q.meas = null;
      q.unmeasuredReason = 'resource-limit';
      q.verdict = VER.TR;
      q.note = (q.note ? q.note + ' / ' : '')
        + `**資源上限(壁時計 ${sr0.wallCeilingSec} s)を超えた段の測定である** —— `
        + '途中までの軌道を最終判定へ流さない(unmeasured/resource-limit)';
    }
    notes.push(`**資源上限超過**: dt 段の壁時計 ${(sr0.wallSec || 0).toFixed(1)} s > `
      + `${sr0.wallCeilingSec} s。この preset の量は judgement へ流していない`);
  }

  // ---- 宣言値と再実測の差(model 欄が読めた行だけ)
  for (const q of quantities) {
    if (q.model !== null && q.model !== undefined && Number.isFinite(q.model) && Number.isFinite(q.meas)) {
      q.modelResidualPct = pct(q.meas, q.model);
    }
    // 周期の 2 定義が許容の内外に分かれた行に印を付ける(外部レビュー)
    if (q.kind === 'period' && Number.isFinite(q.residualPctRev) && Number.isFinite(q.residualPctPeri)) {
      const tol = q.toleranceUsedPct;
      const inRev = Math.abs(q.residualPctRev) <= tol, inPeri = Math.abs(q.residualPctPeri) <= tol;
      if (inRev !== inPeri || Math.sign(q.residualPctRev) !== Math.sign(q.residualPctPeri)) {
        q.note = (q.note ? q.note + ' / ' : '')
          + `**周期の定義依存**: 同方向1周 ${q.residualPctRev.toFixed(4)}% / 近点間 ${q.residualPctPeri.toFixed(4)}%`
          + `(判定に採ったのは ${q.periodDef === 'periastron' ? '**近点間**' : q.periodDef})`;
      }
    }
  }

  // ---- dt 収束(dt と dt/2 の主対象)
  if (half) {
    const a = base.targets[base.targets.indexOf(main)] || base.targets[0];
    const b = half.targets[base.targets.indexOf(main)] || half.targets[0];
    const pa = a.revP.length >= 2 ? a.revP[1] * P.toSec : null, pb = b.revP.length >= 2 ? b.revP[1] * P.toSec : null;
    if (quarter) {
      const c = quarter.targets[base.targets.indexOf(main)] || quarter.targets[0];
      notes.push('**dt 3 段(第255便d N8)**: dt/4=0.004 まで走らせた。近点移動 '
        + ((main.A.slopeDeg !== null && c && c.A.slopeDeg !== null)
          ? `${main.A.slopeDeg.toExponential(4)} → ${c.A.slopeDeg.toExponential(4)} °/周(h → h/4)` : '窓不足')
        + ' / ε_num=|Q_h−Q_{h/4}| と観測次数 p_obs は各量の numBoundDecl へ入れた');
    }
    notes.push('dt 収束(主対象 ' + main.label + '): 周期 '
      + ((pa && pb) ? `${pa.toPrecision(9)} → ${pb.toPrecision(9)} s(${pct(pb, pa).toFixed(4)}%)` : '窓不足')
      + ' / 近点移動 ' + ((a.A.slopeDeg !== null && b.A.slopeDeg !== null)
        ? `${a.A.slopeDeg.toExponential(4)} → ${b.A.slopeDeg.toExponential(4)} °/周` : '窓不足'));
  }

  // ---- 第250便c: I2 の機械門が使う ε_num(dt 2 段の同じ検出器の差)を各量へ記録する ----------
  // 門そのものは --merge で持ち越した過去分にも掛けるため、**併合の後**に一括で付ける(下記)。
  const halfOf = (t) => (half ? (half.targets[base.targets.indexOf(t)] || null) : null);
  const quarterOf = (t) => (quarter ? (quarter.targets[base.targets.indexOf(t)] || null) : null);
  const eighthOf = (t) => (eighth ? (eighth.targets[base.targets.indexOf(t)] || null) : null);
  const rawMeas = (q, t) => { if (!t) return null;
    // 第251便c: ε_num も**同じ定義**で作る(離心タイミング連星は dt/2 でも近点間)
    if (q.kind === 'period') {
      if (periastronFirst) return (t.A.perMean !== null) ? t.A.perMean * P.toSec : null;
      const a = pRevSec(t); return (a !== null) ? a : pOscSec(t); }
    if (q.kind === 'ecc') return eMeas(t);
    if (q.kind === 'precession') {
      // 第270便a(AD8): 換算後の量は**各段それぞれの**「傾きと同じ近点集合の周期」で写す
      // (h の周期で h/2・h/4 を割らない —— 段ごとに窓が同じ本数であることも確かめる)。
      if (q.ad8 && q.ad8.converted) {
        const nF = (t.A.perFitN === undefined) ? null : t.A.perFitN;
        const pS = (Number.isFinite(t.A.perMeanFit) && t.A.perMeanFit > 0) ? t.A.perMeanFit * P.toSec : null;
        if (!(Number.isFinite(nF) && nF >= q.ad8.needPeriastra) || pS === null) return null;
        return precessionDegPerYear({ degPerOrbit: t.A.slopeDeg, pPeriSec: pS });
      }
      if (q.unit === 's') { const sl = t.A.slopeDeg;
        const pS = (Number.isFinite(t.A.perMean) && t.A.perMean > 0) ? t.A.perMean * P.toSec : null;
        return (sl && pS) ? Math.abs(360 / sl) * pS : null; }
      return t.A.slopeDeg; }
    return null; };
  for (const q of quantities) {
    const t = base.targets.find((z) => z.label === q.target) || null;
    // ---------------------------------------------------------------- 第270便a(第60報 W1・AD4/AE3)
    // **段ごとの抽出の健全さ**を量に残す(収束規約が読む欄 —— 走行の中にしか無い情報である)。
    //   ・`nan` / `clamp` … その段の走行そのものの異常
    //   ・`dup` / `jump`  … 近点の重複除去と unwrap の中断(抽出器の異常)
    //   ・`nPeri` / `perFound` / `perUnmeasured` … 段ごとの**窓の充足**(3 段で同じ窓か)
    // **1 つでも欠けたら「収束済み」とは書かない**(第269便a の AD4 規約をそのまま門へ入れる)。
    if (t) {
      const stageOf = (run, tt) => (run && tt) ? {
        tag: run.tag, nan: run.nan === true, clamp: run.clamp || 0,
        dup: (tt.A && tt.A.rej) ? tt.A.rej.dup : null,
        jump: (tt.A && tt.A.rej) ? tt.A.rej.jump : null,
        nPeri: (tt.A && Number.isFinite(tt.A.nPeri)) ? tt.A.nPeri : null,
        perFitN: (tt.A && tt.A.perFitN !== undefined) ? tt.A.perFitN : null,
        perFound: (tt.A && tt.A.perFound !== undefined) ? tt.A.perFound : null,
        perUnmeasured: (tt.A) ? tt.A.perUnmeasured === true : null,
      } : null;
      const sH = [stageOf(base, t), stageOf(half, halfOf(t)), stageOf(quarter, quarterOf(t))]
        .filter(Boolean);
      const fitSet = new Set(sH.map((z) => z.perFitN));
      q.stageHealth = { stages: sH.length, rows: sH,
        nan: sH.some((z) => z.nan), clamp: sH.reduce((a, z) => a + (z.clamp || 0), 0),
        dup: sH.reduce((a, z) => a + (z.dup || 0), 0),
        jump: sH.reduce((a, z) => a + (z.jump || 0), 0),
        sameFitWindow: fitSet.size === 1,
        fitWindows: [...fitSet],
        periodWindowFilled: sH.every((z) => z.perUnmeasured === false),
        extractionClean: !sH.some((z) => z.nan) && sH.reduce((a, z) => a + (z.clamp || 0), 0) === 0
          && sH.reduce((a, z) => a + (z.dup || 0), 0) === 0
          && sH.reduce((a, z) => a + (z.jump || 0), 0) === 0,
        rule: '**AD4**(第269便a): ①3 段すべて窓充足 ②NaN 0・クランプ 0・重複 0・unwrap 中断 0 —— '
          + '抽出の異常が 1 件でもあれば「収束済み」とは書かない' };
    }
    const mHalf = rawMeas(q, halfOf(t));
    q.numBoundDt2 = (Number.isFinite(mHalf) && Number.isFinite(q.meas)) ? Math.abs(q.meas - mHalf) : null;
    // 第251便c: ε_num を作った**定義**を記録する(dt 2 段で定義が食い違っていないことの機械確認)
    if (q.kind === 'period') q.numBoundDef = periastronFirst ? 'periastron' : 'revolution-or-osculating';
    // 第251便c: ε_num は「dt 2 段の差」ではなく**宣言**である。dt/2 と dt/4 の差の上限として
    // 記録し、収束次数を添える(本便の走行は dt と dt/2 の 2 段なので、次数は 2 段からの推定
    // であって測定ではない — order:null は「次数未測定」を意味する)。
    // 第253便b(第45報・ChatGPT §7.1): **dt 2 段の差は感度診断であって誤差上限ではない。**
    // 漸近域でも粗い側の真の誤差は 2^p/(2^p−1)·|Q_h−Q_{h/2}| で、|Q_h−Q_{h/2}| そのものは
    // それより**小さい**(p=1 なら 2 倍・p=2 なら 1.33 倍の開きがある)。したがって「上限としての宣言」
    // という旧文言を撤回し、**感度診断・上限未確認**と書く。3 段(dt, dt/2, dt/4)と正の実測次数が
    // 揃うまでは、この値を根拠に「数値は収束した」とは言わない(下の門の保留条件を参照)。
    // 第255便d(第47報 N8): dt/4 段が走っていれば **3 段**にする。ε_num の定義は第252便b ③ と
    // 同じ |Q_h − Q_{h/4}| へ、観測次数は p_obs=log₂|(Q_h−Q_{h/2})/(Q_{h/2}−Q_{h/4})| を実測値として
    // 入れる(**負でもそのまま入れる** — 門の側が order>0 を要求して落とす)。2 段のままの量は不変。
    const mQuarter = rawMeas(q, quarterOf(t));
    if (Number.isFinite(mQuarter) && Number.isFinite(mHalf) && Number.isFinite(q.meas)) {
      const d1 = q.meas - mHalf, d2 = mHalf - mQuarter;
      q.numBoundDt3 = Math.abs(q.meas - mQuarter);
      q.pObs = (d1 !== 0 && d2 !== 0) ? Math.log2(Math.abs(d1 / d2)) : null;
      q.dtStages = { dt: q.meas, dtHalf: mHalf, dtQuarter: mQuarter };
      q.numBoundDt2 = q.numBoundDt3;   // 門が読む ε_num を 3 段の定義へ差し替える
      q.numBoundDecl = numBoundDeclOf(q.numBoundDt3, 3, q.pObs);
      // ------------------------------------------------------------ 第271便a(第61報・R3)
      // **正式判定段を h/4 へ統一する**(統括の検証項目 R3 —— 文書と器の不一致の解消)。
      // docs/CALIBRATION_VERDICT_v1.44.md §5.13′.2(AD4 の規約)は「判定段 h/4・
      // ε̂=|Q_{h/2}−Q_{h/4}|/(2^p−1)」と書いていたが、器の正式門は `value: q.meas`(**h 段**)・
      // ε_num=|Q_h−Q_{h/4}| で判定していた。**AD4 の既決どおり h/4 へ統一する**。
      //   ・判定値 `assessedValue` = **Q_{h/4}**(`assessedStage:'h4'`)
      //   ・最終 2 段差 = **|Q_{h/2} − Q_{h/4}|**(門が読む ε_num はこれになる)
      //   ・ε̂ = |Q_{h/2} − Q_{h/4}| / (2^p − 1)(p は従来どおり log₂|(Q_h−Q_{h/2})/(Q_{h/2}−Q_{h/4})|)
      //   ・h 段の値は `coarseValue`(= 旧 `meas`)・旧感度幅は `coarseNumBound` として**履歴に残す**
      // **2 段だけの系(登録外)の扱いは変えない**(現状のまま・数値未解決)。
      // **次数推定の適用条件**: 連続 2 段差が**同符号**でなければ次数は推定できない
      // (非単調列に log₂|d1/d2| を当てても漸近次数ではない)。3 段が完全に一致する列も次数不明。
      // どちらも `orderNotEstimable(...)` として**保留**にする(「収束した」と書かない)。
      const mono = (d1 > 0 && d2 > 0) || (d1 < 0 && d2 < 0);
      const identical = (d1 === 0 && d2 === 0);
      q.orderEstimable = {
        ok: mono, d1, d2,
        reason: mono ? null
          : (identical ? 'orderNotEstimable(identicalStages)' : 'orderNotEstimable(nonMonotone)'),
        rule: '**連続 2 段差が同符号**のときだけ観測次数を推定する(第271便a・R3)。'
          + '非単調な 3 段列(d1 と d2 の符号が違う)は漸近域の振る舞いではないので次数が'
          + '**不明**であり、3 段が完全に一致する列も次数が**不明**である —— どちらも'
          + '「数値未解決」で保留する(**h/8 への自動昇格はしない**)。',
      };
      if (THREE_STAGE_IDS.has(d.id)) {
        q.assessedStage = 'h4';
        q.assessedValue = mQuarter;
        q.coarseValue = q.meas;                  // h 段(第270便a までの判定値 —— 履歴)
        q.coarseNumBound = q.numBoundDt3;        // |Q_h−Q_{h/4}|(旧 ε_num —— 名前を変えて保持)
        q.numBoundDt2 = Math.abs(d2);            // **最終 2 段差**(門が読む ε_num)
        q.numBoundDecl = numBoundDeclOf(Math.abs(d2), 3, q.pObs, 'h4');
        q.numBoundDeclCoarse = numBoundDeclOf(q.numBoundDt3, 3, q.pObs, 'h');   // 旧宣言(履歴)
        q.assessedStageNote = '**判定段は h/4**(第271便a・R3 —— AD4 の既決へ統一した)。'
          + 'h 段の値は `coarseValue`・|Q_h−Q_{h/4}| は `coarseNumBound` に**履歴として残す**。'
          + '**登録外(2 段だけ)の系の扱いは変えていない**。';
      }
    } else {
      q.numBoundDecl = (q.numBoundDt2 === null) ? null : numBoundDeclOf(q.numBoundDt2);
    }
    // 第258便d(W4): **h8 検査点**(--dt8 で名指しした系だけ)。4 段が揃うと 2 つのことが測れる:
    //   (a) 観測次数が h をもう 1 段細かくしても同じか(p_obs(h,h/2,h/4) 対 p_obs(h/2,h/4,h/8))
    //   (b) |Q_h−Q_{h/4}|/(1−4^−p) という**推定誤差**が、実測の |Q_{h/2}−Q_{h/8}| と整合するか
    const mEighth = rawMeas(q, eighthOf(t));
    if (Number.isFinite(mEighth) && Number.isFinite(mQuarter) && Number.isFinite(mHalf) && Number.isFinite(q.meas)) {
      const d2 = mHalf - mQuarter, d3 = mQuarter - mEighth;
      const pHalf = (d2 !== 0 && d3 !== 0) ? Math.log2(Math.abs(d2 / d3)) : null;
      q.h8 = { stages: { dt: q.meas, dtHalf: mHalf, dtQuarter: mQuarter, dtEighth: mEighth },
        pObs3: q.pObs, pObsShifted: pHalf,
        numBoundH4: q.numBoundDt3, numBoundH8: Math.abs(mHalf - mEighth),
        estimateFromH4: refinedNumBound(q.numBoundDt3, q.pObs),
        estimateFromH8: refinedNumBound(Math.abs(mHalf - mEighth), pHalf),
        richardson: (Number.isFinite(pHalf) && pHalf > 0)
          ? mEighth + (mEighth - mQuarter) / (Math.pow(2, pHalf) - 1) : null,
        note: '**h8 検査点**(第258便d): dt/8=0.002 まで走らせた 1 系だけの欄である。'
          + 'pObs3 は (h,h/2,h/4)・pObsShifted は (h/2,h/4,h/8) の観測次数で、'
          + '**2 つが揃っていれば漸近域に居る**と読める(揃わなければ居ない)。'
          + '門が読む ε_num は従来どおり |Q_h−Q_{h/4}| のままで、ここは記録である' };
    }
    // 第258便d(W4): ε_num の**推定誤差欄**(門は緩めない — |Q_h−Q_{h/4}| は上限ではないという記録)
    if (q.numBoundDecl && Number.isFinite(q.numBoundDecl.value))
      q.numBoundDecl.estimate = refinedNumBound(q.numBoundDecl.value,
        Number.isFinite(q.numBoundDecl.order) ? q.numBoundDecl.order : null,
        (q.numBoundDecl.steps >= 3) ? 4 : 2);
  }

  // ---------------------------------------------------------------- 第258便d(第50報 W4): deg/yr の門
  // 3 審査 v16 の一致点:「⚡ は **deg/yr の門**で判定する(unwrap した近点角を**実時刻**に線形 fit し、
  // 時系・年の長さ・傾きの共分散を記録する)。Hu 解の P_b/e_T と Kramer の ω̇ の**来歴を分ける**。
  // **単位を変えても比 2 は直らない**」。従来の判定量「°/周」は**別欄に残す**(消さない)。
  // ここでやるのは 3 つだけである:
  //   ① 近点角の実時刻 fit の傾き(deg/シミュレータ時間)を、scaleExp の T と**年の長さ**で deg/yr へ。
  //   ② CSV の deg/yr の値と σ を**換算せずにそのまま**使う(°/周 への換算は周期を 1 つ選ぶので、
  //      ⚡ では Kramer の ω̇ と Hu の P_b という**別解をまたぐ**)。
  //   ③ 同じ門(3σ+ε_num・ε_num ≤ 0.3σ・収束条件)を掛け、°/周 の門と**判定が動くか**を記録する。
  const degYearRow = sigBody ? SIGMA_TABLE.get(sigBody + '|periastron_advance') : null;
  const periodRow = sigBody ? SIGMA_TABLE.get(sigBody + '|orbital_period') : null;
  for (const q of quantities) {
    if (q.kind !== 'precession') continue;
    // 第270便a(AD8): 判定量を deg/yr へ写した行でも、この**診断欄**(実時刻 fit)は残す。
    // 判定に使う換算は「近点番号の傾き × YEAR / 同じ窓の近点間周期」であって、この欄の
    // 「近点角の実時刻 fit」とは**別の推定器**である —— 2 つを並べて置く(混ぜない)。
    const perOrbit = (q.unit === 'deg/orbit') ? { meas: q.meas, obs: q.obs }
      : ((q.ad8 && q.ad8.converted && q.previousUnit)
        ? { meas: q.previousUnit.meas, obs: q.previousUnit.obs } : null);
    if (!perOrbit) continue;
    const t = base.targets.find((z) => z.label === q.target) || null;
    if (!t) continue;
    const tfOf = (x) => (x && x.A && x.A.timeFit && Number.isFinite(x.A.timeFit.slopeDegPerTime))
      ? x.A.timeFit : null;
    const f0 = tfOf(t), fH = tfOf(halfOf(t)), fQ = tfOf(quarterOf(t)), fE = tfOf(eighthOf(t));
    if (!f0) { q.degYear = { measured: false,
      reason: '**未走行/窓不足**: 近点角の実時刻 fit が取れない(検出器 A の近点が 2 個未満)' }; continue; }
    const dy = (f) => (f ? degPerYear({ slopeDegPerSimTime: f.slopeDegPerTime, toSec: P.toSec }) : null);
    const v0 = dy(f0), vH = dy(fH), vQ = dy(fQ), vE = dy(fE);
    let nb = null, pObs = null, stages = 1;
    if (Number.isFinite(vH)) { nb = Math.abs(v0 - vH); stages = 2; }
    if (Number.isFinite(vQ) && Number.isFinite(vH)) {
      nb = Math.abs(v0 - vQ); stages = 3;
      const d1 = v0 - vH, d2 = vH - vQ;
      pObs = (d1 !== 0 && d2 !== 0) ? Math.log2(Math.abs(d1 / d2)) : null;
    }
    const conv = (stages >= 3) && Number.isFinite(pObs) && pObs > 0;
    const obsV = (degYearRow && Number.isFinite(degYearRow.value)) ? degYearRow.value : null;
    const obsS = (degYearRow && Number.isFinite(degYearRow.sigma) && degYearRow.sigma > 0)
      ? degYearRow.sigma : null;
    q.degYear = { measured: true, unit: 'deg/yr', yearSec: YEAR_SEC,
      yearNote: '年の長さは**単位の約束**(ユリウス年 365.25 d = 3.15576×10⁷ s)であって観測ではない',
      meas: v0, stages: { dt: v0, dtHalf: vH, dtQuarter: vQ, dtEighth: vE }, nStages: stages,
      numBound: nb, pObs, converged: conv,
      numBoundEstimate: refinedNumBound(nb, pObs, (stages >= 3) ? 4 : 2),
      obs: obsV, sigma: obsS,
      timeFit: { nPeri: f0.nPeri, t0: f0.t0, t1: f0.t1, tSpanSim: f0.tSpan,
        tSpanSec: (Number.isFinite(f0.tSpan)) ? f0.tSpan * P.toSec : null,
        tSpanYr: (Number.isFinite(f0.tSpan)) ? f0.tSpan * P.toSec / YEAR_SEC : null,
        slopeDegPerSimTime: f0.slopeDegPerTime, seSlopeDegPerTime: f0.seSlopeDegPerTime,
        seDegPerYr: Number.isFinite(f0.seSlopeDegPerTime)
          ? degPerYear({ slopeDegPerSimTime: f0.seSlopeDegPerTime, toSec: P.toSec }) : null,
        varSlope: f0.varSlope, varIntercept: f0.varIntercept, covSlopeIntercept: f0.covSlopeIntercept,
        residRmsDeg: f0.residRmsDeg,
        note: '**横軸は時刻**(k·dt)であって近点番号ではない。共分散は fit の残差分散から作った '
          + '2×2(傾き・切片)である — 観測の誤差ではなく**この fit の内的な散らばり**である' },
      degPerOrbit: { meas: perOrbit.meas, obs: perOrbit.obs, unit: 'deg/orbit',
        fromAD8Previous: !!(q.ad8 && q.ad8.converted),
        note: '**別欄として残す**(第250便c 以来の判定量)。°/周 は周期を 1 つ選ばないと作れない'
          + ((q.ad8 && q.ad8.converted)
            ? ' / **この行は第270便a(AD8)で判定量を deg/yr へ写した** —— ここの °/周 は'
              + '`previousUnit`(換算前)の記録である' : '') },
      provenance: {
        omegaDot: degYearRow ? String(degYearRow.source).slice(0, 110) : null,
        orbitalPeriod: periodRow ? String(periodRow.source).slice(0, 110) : null,
        separated: !!(degYearRow && periodRow
          && String(degYearRow.source).slice(0, 24) !== String(periodRow.source).slice(0, 24)),
        note: 'ω̇ と P_b の**来歴を分ける**。⚡ では ω̇ が Kramer et al. (2021) PRX 11 041050 Table IV、'
          + 'P_b は Hu et al. (2022) A&A 667 A149 の**別解**である。deg/yr の門は ω̇ の一次表だけを'
          + '使うので、°/周 への換算が持っていた「2 つの解をまたぐ」問題が無い' },
      ratioToObs: (Number.isFinite(v0) && Number.isFinite(obsV) && obsV !== 0) ? v0 / obsV : null };
    q.degYear.gate = assessDegYearGate({ value: v0, reference: obsV, sigma: obsS,
      numBound: nb, converged: conv });
  }

  const tally = {}; for (const v of VERDICTS6) tally[v] = 0;
  for (const q of quantities) tally[q.verdict] = (tally[q.verdict] || 0) + 1;

  report.push({ id: d.id, emoji: d.emoji, name: d.name, version,
    referenceKind: theory ? 'theory-control' : null,
    massCalibration: d.massCalibration, scaleExpT: d.scaleExp ? d.scaleExp.T : null,
    run: { n: base.n, dt: base.dt, steps: base.steps, wallSec: base.wallSec,
      orbits: base.targets.map((t) => ({ label: t.label, rev: t.revN, periA: t.A.nPeri, periB: t.B.nPeri })),
      nan: base.nan, clamp: base.clamp, warnings: base.warnings.length,
      dtHalf: half ? { dt: half.dt, steps: half.steps } : null,
      dtQuarter: quarter ? { dt: quarter.dt, steps: quarter.steps } : null,   // 第255便d(N8)
      dtEighth: eighth ? { dt: eighth.dt, steps: eighth.steps, wallSec: eighth.wallSec } : null,  // 第258便d(W4)
      // 第257便d: 段ごとの**計算時間予算**(機種依存の欄 — dt・近点数とは分けて置く)
      timeBudget: P.runs.map((z) => Object.assign({ tag: z.tag }, z.timeBudget || {})),
      // 第270便a(AE9): **停止条件の宣言と結果**。dt 段を `stopRule`・全段を `stopRuleStages` に置く
      // (走行長が步/秒・壁時計に依らないことを、段ごとに後から数えられるようにする)。
      stopRule: base.stopRule || null,
      stopRuleStages: P.runs.map((z) => Object.assign({ tag: z.tag }, z.stopRule || {})),
      stepsPerOrbit0: (base.stopRule && base.stopRule.stepsPerOrbit0) || base.stepsPerOrbit0 || null },
    correlates, quantities, tally, notes });
}

// ---------------------------------------------------------------- 既存 JSON との併合(--merge)
// --only で一部だけ回し直したとき、既存の結果へその preset だけを差し替える(物理の再実行を減らす)。
let merged = report;
if (MERGE && fs.existsSync(OUT)) {
  {
    // ---------------------------------------------------------------- 第270便a(第60報 W1・AE8)
    // **--merge の鍵は preset id だけではない**。入力 CSV・宣言ファイル・窓・基準刻み・停止条件の版・
    // 抽出器・門の規約・対象 HTML が**同じ記録どうし**でなければ差し替えてはならない。
    // 1 つでも違えば**器を止める**(黙って混ぜない)。旧版の JSON(鍵そのものが無い)も止める ——
    // 再現手順 ① の通常走行からやり直す。
    const prev0 = JSON.parse(fs.readFileSync(OUT, 'utf8'));
    const sha0 = (p) => { try { return crypto.createHash('sha256')
      .update(fs.readFileSync(path.join(ROOT, p))).digest('hex'); } catch (e) { return null; } };
    const now = { csvSha: sha0('paper/data/solar-observations.csv'),
      judgementSourcesSha: sha0('paper/data/judgement-sources.json'), target: TARGET,
      periWindow: PERI_WINDOW, dtBase: DT0, orbMax: ORB_MAX, stopRuleVersion: STOP_RULE_VERSION };
    const old = prev0.mergeKey || null;
    if (!old) {
      throw new Error('[w249b] --merge の相手に `mergeKey` が無い(第270便a より前の JSON である)。'
        + '**条件の違う記録を混ぜない** —— 再現手順 ① の通常走行からやり直すこと');
    }
    const diff = Object.keys(now).filter((k) => String(old[k]) !== String(now[k]));
    if (diff.length) {
      throw new Error('[w249b] --merge の鍵が一致しない(' + diff.map((k) =>
        k + ': 既存=' + String(old[k]).slice(0, 16) + ' / 今回=' + String(now[k]).slice(0, 16)).join(' / ')
        + ')。**異なる条件の記録を混ぜない** —— 再現手順 ① からやり直すこと');
    }
  }
  try {
    const prev = JSON.parse(fs.readFileSync(OUT, 'utf8'));
    const byId = new Map((prev.presets || []).map((r) => [r.id, r]));
    for (const r of report) byId.set(r.id, r);
    const order = decls.map((d) => d.id);
    merged = order.map((id) => byId.get(id)).filter(Boolean);
    console.error(`[w249b] --merge: 既存 ${(prev.presets || []).length} 本へ ${report.length} 本を差し替え → ${merged.length} 本`);
  } catch (e) { console.error('[w249b] --merge 失敗(新規として書く): ' + String(e).slice(0, 120)); }
}

// ---------------------------------------------------------------- 相関表(DFM 版のみ)
const dfm = merged.filter((r) => r.version === 'dfm' && !r.referenceKind);
const primaryResid = (r) => {
  // 「主要残差」= その版で最初に出てくる周期の |残差 %|(較正の対象そのもの)
  const q = r.quantities.find((x) => x.kind === 'period' && Number.isFinite(x.residualPct));
  return q ? Math.abs(q.residualPct) : null;
};
const corrKeys = ['nu', 'chi', 'GMac2', 'aOverR', 'e', 'spinRatio'];
const pairs = [];
{
  const rows = dfm.map((r) => ({ id: r.id, emoji: r.emoji, resid: primaryResid(r), c: r.correlates }))
    .filter((r) => r.resid !== null);
  for (const k of corrKeys) {
    const xs = [], ys = [], used = [];
    for (const r of rows) { const v = r.c[k];
      if (Number.isFinite(v)) { xs.push(v); ys.push(r.resid); used.push(r.emoji); } }
    pairs.push({ correlate: k, n: xs.length, rho: spearman(xs, ys), samples: used });
  }
  out.correlation = { method: 'spearman', target: '主要周期残差 |%|(DFM 版・理論対照を除く)',
    n: rows.length, rows: rows.map((r) => ({ id: r.id, emoji: r.emoji, residPct: r.resid, ...r.c })),
    pairs,
    caveat: '少数サンプル(n≈10)の順位相関である。**相関は原因ではない** — 同じ GM・a・e で ν だけを'
      + '掃引する識別試験(外部レビューの識別試験)を通すまでは、どの量も「合わない度合いの説明」ではない。'
      + ' 第250便c: **この行数は独立な天体観測の数ではない** — 同じ物理系の旧則版・PN variant'
      + '(psrDoubleABDFM と psrDoubleABSpinCal 等)が別行として入るので、n 行 ≠ n 天体である。'
      + ' χ の順位相関が小さいことから「引きずりが消えた・χ が要らない」とは結論しない。',
    nextTests: {
      nu: '同じ GM・a・e で質量比だけを振る(ν 0.05→0.25)— 残差が ν に沿って動くか',
      chi: 'D0pull を ×10 して χ だけを動かす(質量・軌道は不変)',
      GMac2: 'c を √2 倍して GM/(ac²) を半分にする(1PN チャネルの寄与を分離)',
      aOverR: '半径 R だけを ×2(軌道に効かないはず — 効けば引きずり則の半径依存)',
      e: '同じ a・M で e を 0.0→0.6 に振る',
      spinRatio: '中心スピンを 0 にする(スピン引きずりの寄与を分離)',
    } };
}

// ---------------------------------------------------------------- 第263便c(第55報 W3): σ の張り直し
// **--regate 専用**。既存の行が持っている `q.sigmaSource`(= 前回の走行で決まった CSV の行の宛先
// `body|quantity`)をそのまま使って、**CSV を読み直した σ と一次表の印を張り直す**。
// **宛先そのものは作り直さない**(対応表 SIGMA_BODY / SIGMA_TARGET_BODY を当てるには preset の
// 宣言と周回体の並びが要り、それは走行の側にしか無い)。だから --regate が検出できるのは
// 「**すでに繋がっている量の σ が動いたか**」であって、「新しく繋がる量が現れたか」ではない
// —— 後者は走行が要る。**その限界をそのまま JSON に書く**(sigmaRegate.limitation)。
// σ の単位換算(近点移動の deg/yr → 判定量)は**線形**なので、新旧の比で送る(0 除算はしない)。
const sigmaRegate = { on: REGATE, checked: 0, unchanged: 0, changed: [], verifiedFlips: [], noSource: 0,
  limitation: '既存の `sigmaSource` の宛先だけを見る。**新しく繋がる量(対応表に無い宛先)は走行が要る** '
    + '—— --regate は「繋がっている σ が動いたか」しか答えない。',
  // 第269便a(統括の読み (G)): **--regate は `applySigma` を通らない**(既存の宛先を張り直すだけ)。
  // だから「宣言が σ だけを差し替える経路」の検査に --regate の結果を使ってはならない —— 通常走行が要る。
  limitationApplySigma: '--regate は `applySigma` を通らない(既存宛先の張り直し)。'
    + '**宣言の扱いを検査するには通常走行が要る**。',
  // **AD5 で検査すること**(本便では注記に留める): 下の「CSV の行が消えた」経路は
  // `changed` に積んで `continue` するだけで、**その量が持っている旧 σ(q.obsSigmaCsv)を消さない**。
  // 参照行が消えたのに旧判定を再利用するのは、AD5(中心値・σ・解 ID を同時に切り替える便)では
  // 誤りになる。**「行消失時に旧判定を再利用しない」検査を AD5 で入れる**。
  limitationAD5: '参照 CSV 行が消えた宛先は `changed` に積んで continue するだけで、'
    + '**旧 σ(q.obsSigmaCsv)はその量に残る**。AD5 で「行消失時に旧判定を再利用しない」検査を入れる。' };
if (REGATE) {
  for (const r of merged) for (const q of (r.quantities || [])) {
    const src = q.sigmaSource || null;
    if (!src || !src.body || !src.quantity) { sigmaRegate.noSource++; continue; }
    sigmaRegate.checked++;
    // 統括の統合(第270便・AD5): **宣言のある鍵は宣言行を張り直す**(ファイル順の最初の行に戻さない)。
    //   通常走行が `applied-AD5` で宣言行の σ を採った量を、--regate が従来行の σ で上書きすると
    //   宣言前の状態へ黙って戻る(統合ツリーで実測: カロン 0.02592→null・J1946 1.728e-6→8.64e-4)。
    //   宣言は body|quantity と body|csvQuantity のどちらの鍵でも引く。
    const declRegate = (() => {
      const k1 = src.body + '|' + src.quantity;
      for (const d of (JUDGEMENT_SOURCES.declarations || [])) {
        if ((d.body + '|' + d.quantity) === k1 || (d.body + '|' + (d.csvQuantity || d.quantity)) === k1) return d;
      }
      return null;
    })();
    const declaredRow = declRegate ? (pickDeclaredRow(declRegate, SIGMA_ROWS_ALL).row || null) : null;
    const row = declaredRow || SIGMA_TABLE.get(src.body + '|' + src.quantity) || null;
    const oldSig = (typeof src.sigma === 'number') ? src.sigma : null;
    const newSig = row ? row.sigma : null;
    const oldVer = !!q.sigmaPrimaryVerified, newVer = !!(row && row.primaryVerified);
    const key = `${r.id}|${q.target}|${q.kind}`;
    if (!row) { sigmaRegate.changed.push({ key, from: oldSig, to: null, reason: 'CSV の行が消えた' }); continue; }
    // 一次表の印(sigma_primary)
    if (oldVer !== newVer) sigmaRegate.verifiedFlips.push({ key, from: oldVer, to: newVer });
    q.sigmaPrimaryVerified = newVer;
    q.sigmaSource = { body: row.body, quantity: row.quantity, unit: row.unit, sigma: row.sigma,
      source: String(row.source).slice(0, 90), primaryVerified: row.primaryVerified };
    if (oldSig === newSig) { sigmaRegate.unchanged++; continue; }
    sigmaRegate.changed.push({ key, from: oldSig, to: newSig });
    if (Number.isFinite(q.obsSigmaCsv) && Number.isFinite(oldSig) && oldSig > 0 && Number.isFinite(newSig) && newSig > 0)
      q.obsSigmaCsv = q.obsSigmaCsv * (newSig / oldSig);   // 換算は線形(比で送る)
    else if (!Number.isFinite(newSig)) delete q.obsSigmaCsv;
  }
  console.error('[w249b] --regate: σ の宛先 ' + sigmaRegate.checked + ' 件 / 変化 '
    + sigmaRegate.changed.length + ' 件 / 一次表の印の反転 ' + sigmaRegate.verifiedFlips.length + ' 件');
}

// ---------------------------------------------------------------- 第264便d(第56報 W4・統括の裁定 ⑥)
// **informational 距離**。σ を持たない宛先でも、note に「同じ量の別転写との隔たり」(`spread=`)や
// 「古い版の 1σ」(`older_sigma=`)が書いてあることがある。**それは σ ではない**ので門には入れない。
// だが「どのくらい外れているか」の目盛りとしては読めるので、**別欄**に距離を出す。
//
// **絶対規約**: この欄は 4 値にも `q.gate` にも 1 bit も触らない。`spread` を σ として判定しない。
//
// 尺度の出どころ(**宣言** — 上から順に見て最初に見つかったものを使う):
//   ① 宛先の行そのものの note(`spread=` / `older_sigma=`)
//   ② 2026-09-15 intake の**候補行** `<body>|<量>_candidate` の note
//      (既存の採用レコードは 1 バイトも動かさない約束なので、隔たりは候補行の側に書いてある)
// 単位橋(**線形**): 尺度は CSV の単位で書いてあるので、判定量の単位へは
//   `scale × |q.obs| / |row.value|` で送る(同じ測定量の単位換算 —— 比が定義できないときは出さない)。
const infoDistance = { on: true, rows: [], byTier: {}, skipped: {},
  rule: '尺度は ① 宛先の行の note、② 2026-09-15 intake の候補行 の順に探す。'
    + '単位橋は `scale × |obs| / |csv value|`(線形)。',
  doNotWrite: ['spread を σ として判定した', 'informational 距離で合格した', '太陽系の較正が進んだ'],
  note: '**judgement は informational** —— 4 値・`q.gate`・合否には 1 bit も入らない。' };
{
  const bump = (m, k) => { m[k] = (m[k] || 0) + 1; };
  // 宛先の解き方(**宣言表のまま** — 推測で当てない)。`q.sigmaSource` があればそれを使い、
  // 無ければ第262便d の `SIGMA_TARGET_BODY` / 第251便c の `SIGMA_BODY` と量の対応表で解く
  // (--regate は走行しないので `sigmaSource` が入っていない行がある —— 太陽系がまさにそれである)。
  const INFO_QUANT = Object.assign({ spin: 'rotation_period' }, SIGMA_QUANT);
  for (const r of merged) for (const q of (r.quantities || [])) {
    let src = q.sigmaSource || null;
    if (!src || !src.body || !src.quantity) {
      const b = SIGMA_TARGET_BODY[r.id + '|' + q.target] || SIGMA_BODY[r.id] || null;
      const qq = INFO_QUANT[q.kind] || null;
      if (!b || !qq) { bump(infoDistance.skipped, 'no-declared-destination'); continue; }
      src = { body: b, quantity: qq, resolvedFrom: 'declaration-table' };
    }
    const row = SIGMA_TABLE.get(src.body + '|' + src.quantity) || null;
    if (!row) { bump(infoDistance.skipped, 'csv-row-missing'); continue; }
    if (row.sigma !== null) { bump(infoDistance.skipped, 'has-primary-sigma'); continue; }
    let scale = row.infoScale, scaleKind = row.infoScaleKind, from = 'destination-row';
    if (scale === null) {
      const cand = SIGMA_TABLE.get(src.body + '|' + src.quantity + '_candidate') || null;
      if (cand && cand.infoScale !== null) {
        scale = cand.infoScale; scaleKind = cand.infoScaleKind; from = 'intake-candidate-row';
      }
    }
    if (scale === null) { bump(infoDistance.skipped, 'no-informational-scale'); continue; }
    if (!(Number.isFinite(q.obs) && Number.isFinite(q.meas))) {
      bump(infoDistance.skipped, 'no-obs-or-meas'); continue; }
    const rv = Number(row.valueRaw);
    if (!(Number.isFinite(rv) && rv !== 0)) { bump(infoDistance.skipped, 'no-unit-bridge'); continue; }
    const bridge = Math.abs(q.obs / rv);
    const scaleJudged = scale * bridge;
    if (!(Number.isFinite(scaleJudged) && scaleJudged > 0)) {
      bump(infoDistance.skipped, 'scale-not-convertible'); continue; }
    const dist = Math.abs(q.meas - q.obs) / scaleJudged;
    infoDistance.rows.push({ id: r.id, emoji: r.emoji, target: q.target, kind: q.kind, name: q.name,
      csvBody: src.body, csvQuantity: src.quantity, scale, scaleKind, scaleFrom: from,
      unitBridge: bridge, scaleInJudgedUnit: scaleJudged,
      residual: Math.abs(q.meas - q.obs), infoDistance: dist,
      gateStatus: (q.gate || {}).status || null,
      judgement: 'informational' });
    q.infoDistance = { value: dist, scale: scaleJudged, scaleKind, scaleFrom: from,
      judgement: 'informational',
      why: '**σ ではない尺度**(同じ量の別転写との隔たり/古い版の 1σ)で割った距離。門には入らない。' };
  }
  console.error('[w249b] informational 距離: ' + infoDistance.rows.length + ' 量'
    + '(尺度なし ' + (infoDistance.skipped['no-informational-scale'] || 0)
    + ' / obs か実測なし ' + (infoDistance.skipped['no-obs-or-meas'] || 0)
    + ' / 一次 σ あり ' + (infoDistance.skipped['has-primary-sigma'] || 0) + ')');
}

// ---------------------------------------------------------------- 第250便c: I2 の機械門を掛ける
// 5 区分(合/窓/否/従/転)は**不変**。門は別欄 q.gate に入れる。--merge で持ち越した過去分にも
// 同じ門を掛けるため、量そのものに残っている値(meas/obs/obsErr/detail/numBoundDt2)だけで判定する。
// 定義の一致は「同じ量の複数の定義・検出器が観測精度 σ_rel の中で一致しているか」で機械判定する:
//   周期 … 同方向1周 / 近点間 / osculating の広がり、近点移動 … 検出器 A と B、離心率 … 窓と接触要素。
const spreadPct = (vals) => { const v = vals.filter((z) => Number.isFinite(z) && z !== 0);
  if (v.length < 2) return null;
  const lo = Math.min(...v), hi = Math.max(...v);
  return 100 * Math.abs(hi - lo) / Math.abs(hi); };
for (const r of merged) for (const q of (r.quantities || [])) {
  // 第251便c: obsCard の文面に ± が無い量は **CSV の sigma 列**(q.obsSigmaCsv)を使う。
  // 一次表の照合(sourceVerified)は CSV の sigma_primary=verified を通ってきた σ にだけ立つ。
  // **CSV(出典表)を優先する** — obsCard の ± は同じ一次表の表示側の写しなので、出所の印
  // (sigma_primary)を持っている CSV 側を正本に採る。両方あるときの差は sigmaCardVsCsvRel に残す。
  const sigCard = (Number.isFinite(q.obsErr) && q.obsErr > 0) ? q.obsErr : null;
  const sigCsv = (Number.isFinite(q.obsSigmaCsv) && q.obsSigmaCsv > 0) ? q.obsSigmaCsv : null;
  const sig = (sigCsv !== null) ? sigCsv : sigCard;
  const sigFrom = (sigCsv !== null) ? 'csv' : ((sigCard !== null) ? 'obsCard' : null);
  const sigPct = (sig !== null && Number.isFinite(q.obs) && q.obs !== 0) ? 100 * Math.abs(sig / q.obs) : null;
  const d = q.detail || {};
  // 第251便c(ChatGPT §8.1): **定義差は誤差ではない**。門の definitionMatches が見るのは
  // 「**同じ定義**の検出器 A/B が観測精度 σ_rel の中で一致するか」(detSpread)だけである。
  // 定義違いの広がり(同方向1周/近点間/接触要素・窓と接触要素)は crossDef として**別欄に残し、
  // σ とは比較しない**。旧 JSON の行(定義メタデータ periodDef が無い)は昇格させない。
  let detSpread = null, crossDef = null, defMeta = true, defNote = '';
  // 第257便d: **A を正本**にする。定義が宣言されていて検出器 A の測定値を判定に使っている行が
  // `definitionDeclared:true`(= 門の definitionMatches)。A−B の広がりは門から外す。
  let defDeclared = false, defDeclNote = '';
  if (q.kind === 'period') {
    detSpread = spreadPct(Array.isArray(d.detPairSec) ? d.detPairSec : []);
    crossDef = spreadPct([d.revSec ? d.revSec[1] : null, d.periASec, d.oscSec]);
    defMeta = (typeof d.periodDef === 'string');
    defNote = defMeta
      ? `判定した定義=${d.periodDef}・検出器 A/B(同じ定義)の広がり=${detSpread === null ? '—' : detSpread.toExponential(2) + '%'}`
        + `(定義違いの広がり ${crossDef === null ? '—' : crossDef.toExponential(2) + '%'} は σ と比較しない)`
      : '**定義メタデータが無い行**(第251便c 以前の JSON)— 定義が宣言されるまで昇格させない';
    defDeclared = defMeta && d.periodDef !== 'unmeasured' && Number.isFinite(q.meas);
    defDeclNote = defDeclared
      ? `定義=${d.periodDef}・判定に採ったのは**検出器 A**(近点間は ṙ の −→+ 交差・20 近点窓)`
      : '定義が宣言されていない、または未測定';
  } else if (q.kind === 'precession') {
    detSpread = spreadPct([d.detectorA, d.detectorB]);   // 同じ「近点方位の直線 fit」の 2 検出器
    defNote = `検出器 A/B(同じ近点方位 fit)の広がり=${detSpread === null ? '—' : detSpread.toExponential(2) + '%'}`;
    defDeclared = Number.isFinite(d.detectorA) && Number.isFinite(q.meas);
    defDeclNote = defDeclared
      ? '定義=近点方位の直線 fit の傾き・判定に採ったのは**検出器 A**(第256便d ③ で真値復元 ≤2.1×10⁻¹¹ を実測した側)'
      : '検出器 A の傾きが取れない(窓不足・縮退)';
  } else if (q.kind === 'ecc') {
    crossDef = spreadPct([q.meas, d.eProxyAll, d.eOscMean]);
    defMeta = false;   // 同じ定義の 2 検出器が無い(1周目の窓・全窓・接触要素は別定義)
    defNote = '離心率は**同じ定義の 2 検出器が無い**(1周目の半径比・全窓・接触要素は別の量)— '
      + `定義違いの広がり ${crossDef === null ? '—' : crossDef.toExponential(2) + '%'} は σ と比較しない`;
    // 第257便d: 推定器そのものは宣言されている(1 周目の距離の極値の比)。止まるのは**観測量対応**の側。
    defDeclared = Number.isFinite(q.meas);
    defDeclNote = '定義=1 周目の距離の極値の比 eProxy(推定器は宣言されている)— '
      + '観測の量(e_T / ケプラー要素 e)との対応は別問題(mapping)';
  }
  const numBound = Number.isFinite(q.numBoundDt2) ? q.numBoundDt2 : null;
  // 第253便b(第45報・ChatGPT §7.1): **収束の保留条件**。`numBound !== null`(= dt 2 段が走った)
  // だけで「収束済み」としていたのは過剰だった —— dt 2 段の差は感度診断であって誤差上限ではない。
  // **3 段(dt, dt/2, dt/4)と正の実測次数が揃っていない結果は収束済みとしない**。
  // 本便の走行は 2 段・order:null なので、この条件は**全量で偽**になり、門の 3σ 判定は
  // 「数値未解決」へ保留される(判定を甘くする方向の変更ではない — 厳しくする方向である)。
  // --merge で持ち越した過去分の行にも第253便b の文言を張り直す(値・段数・次数は動かさない)
  if (q.numBoundDecl && Number.isFinite(q.numBoundDecl.value)) {
    q.numBoundDecl = numBoundDeclOf(q.numBoundDecl.value,
      Number.isFinite(q.numBoundDecl.steps) ? q.numBoundDecl.steps : 2,
      Number.isFinite(q.numBoundDecl.order) ? q.numBoundDecl.order : null,
      q.assessedStage || q.numBoundDecl.assessedStage || 'h');
    // 第258便d(W4): **ε_num の推定誤差欄**を、--merge で持ち越した過去分の行にも張る。
    // |Q_h−Q_{h/k}| は上限ではない —— 漸近形なら /(1−k^−p) 倍である(門は緩めも締めもしない)。
    q.numBoundDecl.estimate = refinedNumBound(q.numBoundDecl.value,
      Number.isFinite(q.numBoundDecl.order) ? q.numBoundDecl.order : null,
      (q.numBoundDecl.steps >= 3) ? 4 : 2);
  }
  const nbd = q.numBoundDecl || null;
  // ---------------------------------------------------------------- 第270便a(第60報 W1・AD4/AE3)
  // **収束規約を門の `convergence.ok` に入れる**。第269便a までの条件は「3 段+次数>0」だけで、
  // 第269便a の器(tests/exp-w268a-d68.mjs)が宣言した AD4 の 5 条件のうち 3 つが門に無かった。
  //   ① 3 段(dt, dt/2, dt/4)     ② 実測次数 order>0
  //   ③ **|p−2| ≤ 0.5 の次数ガード(AE3)** …… スキームは 2 次であると宣言しているので、
  //      観測次数がそこから離れている量は**漸近域に居ない**(「収束済み」と書けない)。
  //   ④ **窓充足**(3 段で同じ fit 窓・周期の窓が埋まっている)
  //   ⑤ **抽出健全**(NaN 0・クランプ 0・重複除去 0・unwrap 中断 0)
  //   ⑥ **ε̂ = |Q_h−Q_{h/4}|/(2^p−1) ≤ 0.3σ** と **最終段差 ≤ 0.3σ**(σ がある量だけ評価できる)
  // **これは判定を甘くする条件ではない** —— 「まだ言えない」を言えるようにする条件である。
  // 旧規約での成否は `convergence.okLegacy` に残す(**何がどこで動いたかを後から数えるため**)。
  const convOKLegacy = numBound !== null && !!nbd
    && Number.isFinite(nbd.steps) && nbd.steps >= 3
    && Number.isFinite(nbd.order) && nbd.order > 0;
  const sh = q.stageHealth || null;
  const ord = (nbd && Number.isFinite(nbd.order)) ? nbd.order : null;
  const orderGuard = (ord !== null) ? (Math.abs(ord - 2) <= 0.5) : false;
  const epsHat = (numBound !== null && ord !== null && ord > 0)
    ? numBound / (Math.pow(2, ord) - 1) : null;
  const convBudget = (sig !== null && sig > 0) ? 0.3 * sig : null;
  const epsHatOk = (epsHat === null || convBudget === null) ? null : (epsHat <= convBudget);
  const lastDiffOk = (numBound === null || convBudget === null) ? null : (numBound <= convBudget);
  const windowsComplete = sh ? (sh.sameFitWindow === true
    && (q.kind !== 'period' || sh.periodWindowFilled === true)) : false;
  const extractionClean = sh ? (sh.extractionClean === true) : false;
  const budgetOK = (convBudget === null) ? true : (epsHatOk === true && lastDiffOk === true);
  // 第271便a(R3): **次数が推定できる列かどうか**を条件に足す(非単調・3 段完全一致は次数不明)。
  const ordEst = q.orderEstimable || null;
  const orderEstimable = ordEst ? (ordEst.ok === true) : true;
  const convOK = convOKLegacy && orderEstimable && orderGuard && windowsComplete
    && extractionClean && budgetOK;
  // 第271便a(R3): **判定値は 3 段登録系では h/4** である(h 段は `coarseValue` に履歴として残る)。
  const assessedStage = q.assessedStage || 'h';
  const assessedValue = Number.isFinite(q.assessedValue) ? q.assessedValue : q.meas;
  // 第257便d: 観測量対応の宣言(自動判定ではない)
  const mapNote = MAPPING_UNRESOLVED(q.kind, r.id);
  const g = assessObservation({ value: assessedValue, reference: q.obs, sigma: sig, numBound,
    converged: convOK,
    definitionMatches: defDeclared,
    mappingResolved: (mapNote === null), mappingNote: mapNote || '',
    sourceVerified: PRIMARY_VERIFIED.has(`${r.id}|${q.target}|${q.kind}`)
      || (sigFrom === 'csv' && q.sigmaPrimaryVerified === true) });
  g.key = `${r.id}|${q.target}|${q.kind}`;
  // 第271便a(R3): 判定段と、その段で測った値・粗い段の値を**門の欄として明示する**。
  g.assessedStage = assessedStage;
  g.assessedValue = assessedValue;
  g.coarseStage = 'h';
  g.coarseValue = Number.isFinite(q.coarseValue) ? q.coarseValue : q.meas;
  g.coarseNumBound = Number.isFinite(q.coarseNumBound) ? q.coarseNumBound : null;
  g.assessedStageRule = (assessedStage === 'h4')
    ? '**判定値は h/4 段**(第271便a・R3 —— AD4 の既決へ統一した)。最終 2 段差は '
      + '|Q_{h/2}−Q_{h/4}|・ε̂ はそれを (2^p−1) で割った量である。h 段の値と |Q_h−Q_{h/4}| は '
      + '`coarseValue` / `coarseNumBound` に**履歴として残す**(新値として写さない)。'
    : '**判定値は h 段**(3 段登録表の外の系 —— 第271便a でも扱いを変えていない)。';
  // 第257便d: **A 正本**の宣言と、A−B を測る別欄 `orbitNoiseIndicator`
  g.detectorCanonical = 'A';
  g.definitionDeclared = defDeclared; g.definitionDeclaredNote = defDeclNote;
  g.mappingResolved = (mapNote === null); g.mappingNote = mapNote;
  g.orbitNoiseIndicator = {
    abRelPct: detSpread, sigmaRelPct: sigPct,
    ratio: (detSpread !== null && sigPct !== null && sigPct > 0) ? detSpread / sigPct : null,
    meaning: '検出器 A(正本)と B(距離極小の放物線頂点)の相対差 [%]。**これは定義の一致度ではない** —— '
      + '第256便d ③ の合成軌道検定で、定義も推定器も 10⁻¹¹ 台で一致し、シミュレータ側の A−B は'
      + '**軌道側の位置雑音 ε≈10⁻¹⁰〜10⁻⁸ に対する検出器 B の感度**だと同定された。'
      + 'したがってこの欄は「**軌道側の相対 1e−10〜1e−8 の雑音に対する検出器差の感度**」であって、'
      + '門(3σ)には入らない。ratio は σ_rel を 1 とした目盛り(>1 = 雑音が観測精度より大きい)',
    gate: 'none(第257便d で門から外した — 第256便d までは definitionMatches の判定根拠だった)' };
  g.sigmaRelPct = sigPct; g.numBound = numBound;
  g.sigma = sig; g.sigmaFrom = sigFrom; g.sigmaSource = q.sigmaSource || null;
  g.sigmaCardVsCsvRel = (sigCard !== null && sigCsv !== null) ? Math.abs(sigCard / sigCsv - 1) : null;
  g.detSpreadPct = detSpread; g.defSpreadCrossDefPct = crossDef;
  // **旧鍵(第257便d で意味が変わった欄 — 読み替え表は out.keyAliases)**
  //   detSpreadPct / defSpreadPct … 値は同じ(A−B の相対差 %)だが、**門には入らない**。
  //   正名は g.orbitNoiseIndicator.abRelPct。旧欄は既存の器・QA が読むので残す。
  g.defSpreadPct = detSpread;   // 後方互換の欄名(= orbitNoiseIndicator.abRelPct・門からは外れた)
  g.defMeta = defMeta; g.definitionNote = defNote;
  g.deprecatedKeys = { defSpreadPct: 'orbitNoiseIndicator.abRelPct',
    detSpreadPct: 'orbitNoiseIndicator.abRelPct', defMeta: 'definitionDeclared(A 正本)' };
  g.numBoundDecl = q.numBoundDecl || null;   // ε_num は「感度診断」である(dt/4 は走らせていない)
  // 第253便b: 保留の理由を機械可読で残す(なぜ「数値未解決」なのかが JSON から辿れるように)
  g.convergence = { ok: convOK, okLegacy: convOKLegacy,
    steps: nbd ? nbd.steps : null, order: nbd ? nbd.order : null,
    orderGuard, orderGuardRule: '|p−2| ≤ 0.5(AE3 —— スキームは 2 次であると宣言しているので、'
      + '観測次数がそこから離れている量は**漸近域に居ない**)',
    epsHat, epsHatInSigma: (epsHat !== null && sig) ? epsHat / sig : null, epsHatOk,
    lastDiff: numBound, lastDiffInSigma: (numBound !== null && sig) ? numBound / sig : null, lastDiffOk,
    // 第271便a(R3): 判定段・次数推定の可否を収束欄にも置く(門の JSON だけで辿れるように)
    assessedStage, orderEstimable,
    orderEstimableReason: ordEst ? ordEst.reason : null,
    orderEstimableRule: ordEst ? ordEst.rule : null,
    lastDiffDef: (assessedStage === 'h4') ? '|Q_{h/2}−Q_{h/4}|(最終 2 段差)'
      : '|Q_h−Q_{h/4}|(3 段)/|Q_h−Q_{h/2}|(2 段)',
    coarseNumBound: Number.isFinite(q.coarseNumBound) ? q.coarseNumBound : null,
    budget: convBudget, windowsComplete, extractionClean,
    fitWindows: sh ? sh.fitWindows : null,
    rule: '**AD4+AE3(第270便a)+ R3(第271便a)**: ①3 段(dt, dt/2, dt/4)②実測次数 order>0 '
      + '(**次数は連続 2 段差が同符号のときだけ推定する** —— 非単調列・3 段完全一致は次数不明)'
      + '③**|p−2| ≤ 0.5**(次数ガード)④窓充足(3 段で同じ fit 窓・周期窓が埋まっている)'
      + '⑤抽出健全(NaN 0・クランプ 0・重複 0・unwrap 中断 0)⑥ε̂=|Q_h−Q_{h/4}|/(2^p−1) と'
      + '最終段差がどちらも **≤0.3σ**(σ を持つ量だけ評価できる)。'
      + '**判定を甘くする条件ではない** —— 「まだ言えない」を言えるようにする条件である。',
    hold: convOK ? null
      : ((!nbd || !(nbd.steps >= 3)) ? 'dt 3 段が走っていない(2 段は感度診断)'
        : (!orderEstimable ? `**次数が推定できない列である**(${ordEst ? ordEst.reason : '—'})`
          + ' —— 連続 2 段差が同符号でない、または 3 段が完全に一致している(第271便a・R3)'
        : (!(ord > 0) ? '収束次数が未測定または非正'
          : (!orderGuard ? `**次数ガード(AE3)で保留**: 観測次数 p=${ord.toFixed(4)} が 2 から `
            + `${Math.abs(ord - 2).toFixed(4)} 離れている(|p−2|≤0.5 を満たさない)= 漸近域に居ない`
            : (!windowsComplete ? '3 段で窓が揃っていない(fit 窓が違う/周期窓が埋まっていない)'
              : (!extractionClean ? '抽出に異常がある(NaN/クランプ/重複/unwrap 中断)'
                : '数値誤差幅が 0.3σ の予算を超える')))))),
    previous: { rule: '3 段かつ order>0(第253便b〜第269便a)', ok: convOKLegacy,
      note: '**旧規約での成否**。第270便a で AD4+AE3 を門へ入れたので、'
        + '**旧規約で「収束済み」だった量のうち次数ガードを満たさないものは「数値未解決」へ戻る** —— '
        + 'これは測定が悪くなったのではなく、収束したと言える条件を満たしていなかったということである。' } };
  // 参考(判定ではない): 来歴・定義の条件を外し、3σ+ε_num の算術だけを見たときの成否
  g.arithOnly = (sig !== null && numBound !== null && Number.isFinite(assessedValue) && Number.isFinite(q.obs))
    ? (Math.abs(assessedValue - q.obs) <= 3 * sig + numBound) : null;
  q.gate = g;
}

// ---------------------------------------------------------------- 第258便d(第50報 W4)
// **① 条件不一致の隔離**。obsCard の行が「kFrame=0 対照」と要求しているのに、割り当てられている
// 測定値は kFrame=1 の走行のものである行が 8 行ある(🟠 木星衛星 4・🌇 金星・🥔 火星衛星の対照差・
// ❄️ 冥王星/カロン・🌊 海王星)。プリセットの physics は 1 つなので、**1 回の走行から 2 つの条件の
// 行へ同じ数値が配られていた**。これは「合っている」でも「合っていない」でもなく、**条件が違う**。
// 元の証拠は `conditionRejectedEvidence` に残し(捨てない)、判定を `条` にして tally を再計算する。
// **全 339 量に requiredContext / measurementContext を立てる**(新走行だけでなく、--merge で
// 持ち越した過去分にも。どの条件の走行から来た数値なのかが、行ごとに JSON から辿れるようにする)。
const conditionResult = enforceAllConditions(merged);
// **② 証拠付き予測の資格**。③(3σ)を通っただけでは ④ に数えない —— `usedForFit:false` /
// `validation:"held-out"` / `dataset` / `frozenProtocol` の 4 つが宣言として揃った量だけを数える。
// **現行の宣言は 0 件である**(プリセットにも CSV にもこの 4 つを書いた行が無い)。
// **②′ 記録器(第259便d)**。枠を先に作り、`--record-evidence` で渡された宣言だけを配る。
// **既定は 0 件**である —— 台帳には「予測が 0 件」ではなく「**記録器あり・記録 0 件**」と書く。
const evidenceRegistry = emptyEvidenceRegistry();
let evidenceApply = { applied: 0, unmatched: [] };
if (EVIDENCE_FILE) {
  const decls = JSON.parse(fs.readFileSync(path.isAbsolute(EVIDENCE_FILE)
    ? EVIDENCE_FILE : path.join(ROOT, EVIDENCE_FILE), 'utf8'));
  for (const [key, ev] of Object.entries(decls || {})) recordEvidence(evidenceRegistry, key, ev);
  evidenceApply = applyEvidenceRegistry(merged, evidenceRegistry);
}
for (const r of merged) for (const q of (r.quantities || [])) {
  const pe = predictionEligible(q);
  q.predictionEligible = pe.eligible;
  q.predictionEligibleReasons = pe.reasons;
  if (q.predictionEvidence) q.predictionEvidenceValid = validatePredictionEvidence(q.predictionEvidence);
}

out.presets = merged;   // decl/run の生データは残さず、判定済みの表を正本にする
out.sigmaRegate = sigmaRegate;   // 第263便c: --regate で σ を張り直した記録(既定は on:false)
// 第264便d(X6/X7/⑥): 印の厳密読みの会計・`verified_by` の欠けている行・informational 距離
out.sigmaMarkAudit = sigmaMarkAudit;
// 第268便a(統括の読み (D)・AB2): **採用観測解の宣言表**の読み取り記録(宣言は行選択である)。
out.judgementSources = { file: 'paper/data/judgement-sources.json', ok: JUDGEMENT_SOURCES.ok,
  error: JUDGEMENT_SOURCES.error || null, schemaVersion: JUDGEMENT_SOURCES.schemaVersion || null,
  declared: JUDGEMENT_SOURCES.declarations.map((d) => ({ key: d.body + '|' + d.quantity,
    source: String(d.source).slice(0, 90), value: d.value,
    sigma: d.sigma === undefined ? null : d.sigma, unit: d.unit || null })),
  notDeclared: (JUDGEMENT_SOURCES.notDeclared || []).map((d) => d.body + '|' + d.quantity),
  // 第269便a(統括の読み (F)(G))→ **第270便a(AD5)で正式経路へ**
  mode: 'applied-AD5',
  identity: '同定は body・csvQuantity・**source**・**unit**・value・sigma の完全一致。'
    + '欠損値を 0 に変換しない。重複宣言・不正スキーマ・解決失敗は**器を止める**(throw)。',
  appliedToJudgement: true,
  appliedSince: '第270便a(2026-09-18・AD5)',
  appliedWhat: ['中心値 q.obs', 'σ q.obsSigmaCsv', '単位', '解 ID(solution)',
    'verified 状態(sigmaPrimaryVerified)', '測定定義(measurementDefinition)'],
  appliedRule: '**6 つを同時に**宣言行から採る(1 つでも欠けたら切り替えない —— 中心値だけ新解・'
    + 'σ だけ新解という混在を作らない)。単位が判定量と一致しない宣言は**黙って換算せず**'
    + '`mode:"not-applied(unit-mismatch)"` で止める。旧経路(AD5 前の参照値と σ)は'
    + '`q.judgementSource.previous` に**温存する**。',
  fiveValueRule: '5 区分(合/窓/否/従/転)の許容は従来どおり **obsCard の ±**(無ければ目安 ±1%)'
    + 'で決める —— 第251便c の「CSV の σ は 5 区分の経路へ入れない」規約は AD5 でも変えない'
    + '(σ が効くのは門だけ)。**中心値は宣言行へ動く**ので、5 区分の残差は宣言行に対する残差である。',
  declaredOnlyStandardRows: '**宣言のある鍵だけ**、obsCard に行が無い量(標準検出器の行)でも'
    + '宣言行を参照にする(第269便a まで金星 e の宣言はどの量にも届いていなかった)。'
    + '**宣言の無い鍵には σ 宛先を引かない**。',
  note: '**宣言の無い body|quantity は従来どおりファイル順の最初の行**である(後方互換)。'
    + '**「宣言したので判定が増えた」とは書かない** —— 動いた行は旧値と並べて理由を残す。' };
out.infoDistance = infoDistance;
// ---- 第250便c: 量の総数と、I2 の機械門の集計(5 区分の tally はそのまま残す)----
const allQ = merged.flatMap((r) => r.quantities || []);
const gateStatus = {}; for (const v of Object.values(GATE)) gateStatus[v] = 0;
const gateReason = {};
for (const q of allQ) { const st = (q.gate && q.gate.status) || GATE.NA;
  gateStatus[st] = (gateStatus[st] || 0) + 1;
  const rs = (q.gate && q.gate.reason) || '(判定済み)';
  gateReason[rs] = (gateReason[rs] || 0) + 1; }
const okQ = allQ.filter((q) => q.verdict === VER.OK);
const okSigma3 = okQ.filter((q) => q.gate && q.gate.status === GATE.OK).length;
const okGuide = okQ.filter((q) => q.guideTolerance && !(q.gate && q.gate.status === GATE.OK)).length;

// ---------------------------------------------------------------- 第257便d: **4 段判定の集計**
// 段は**排他ではない**(status は排他だが、こちらは「どこまで来たか」の階段である)。
//   ① 数値収束 … dt 3 段 + 正の観測次数 p_obs(第253便b の保留条件)
//   ② 観測量対応 … σ があり・定義(A 正本)が宣言され・観測量対応が確定し・一次表の印がある
//   ③ 観測適合 … 3σ+ε_num の門を通った(= status 合(3σ))
//   ④ 予測 … ③ のうち**較正の従属量でない**もの(較正質量 f≈2 が式へ入る量は予測ではない)
const hasSig = (q) => !!(q.gate && Number.isFinite(q.gate.sigma) && q.gate.sigma > 0);
const stage1 = allQ.filter((q) => q.gate && q.gate.convergence && q.gate.convergence.ok === true);
const stage2 = allQ.filter((q) => hasSig(q) && q.gate.definitionDeclared === true
  && q.gate.mappingResolved === true
  && (PRIMARY_VERIFIED.has(q.gate.key) || (q.gate.sigmaFrom === 'csv' && q.sigmaPrimaryVerified === true)));
const stage3 = allQ.filter((q) => q.gate && q.gate.status === GATE.OK);
const stage4 = stage3.filter((q) => q.verdict !== VER.DEP);
// 第258便d(W4): **④ は「証拠付き予測」**へ。③ を通っただけでは数えない(宣言が 4 つ要る)。
const stage4ev = allQ.filter((q) => q.predictionEligible === true);
const mapUnres = allQ.filter((q) => q.gate && q.gate.status === GATE.MAP);
const condMis = allQ.filter((q) => q.gate && q.gate.status === GATE.COND);
out.summary = { nPresets: merged.length,
  stages: {
    note: '第258便d(第50報・3 審査 v16): 段は**階段ではない**。**①(数値収束)と ②(観測量対応)は'
      + '独立な集合**である —— 数値が収束していなくても観測量対応は宣言できるし、その逆もある'
      + '(①∩② が空でないだけで、①→② という順序は無い)。**④ ⊆ ③ だけが包含である**。'
      + '第258便d で ④ は「③ のうち従属量でないもの」から「**証拠付き予測**」へ狭めた ——'
      + '`usedForFit:false` / `validation:"held-out"` / `dataset` / `frozenProtocol` の 4 つが'
      + '宣言として揃った量だけを数える。**現行は 0 件である**(宣言が無い)。'
      + '**3σ は 1 mm も緩めていない**。',
    '①数値収束': stage1.length, '②観測量対応': stage2.length,
    '③観測適合(3σ)': stage3.length,
    '④予測(従属量でない③)': stage4.length,
    '④予測(証拠付き)': stage4ev.length,
    predictionNote: '「④予測(従属量でない③)」は第257便d までの弱い数え方(' + stage4.length + ' 件)で、'
      + '**証拠付き予測は ' + stage4ev.length + ' 件**である。③ を通ったからといって予測ではない ——'
      + 'fit に使っていないこと・hold-out であること・どのデータか・凍結手順、の 4 つが要る。',
    conditionMismatch: condMis.length,
    conditionMismatchKeys: condMis.map((q) => (q.gate && q.gate.key) || null),
    mappingUnresolved: mapUnres.length,
    mappingUnresolvedKeys: mapUnres.map((q) => (q.gate && q.gate.key) || null),
    stage3Keys: stage3.map((q) => q.gate.key),
    ng3Keys: allQ.filter((q) => q.gate && q.gate.status === GATE.NG).map((q) => q.gate.key),
    numUnresolvedKeys: allQ.filter((q) => q.gate && q.gate.status === GATE.NUM).map((q) => q.gate.key) },
  keyAliases: {
    note: '第257便d で意味の変わった鍵の**読み替え表**(欄そのものは消していない)。',
    'gate.defSpreadPct / gate.detSpreadPct': 'gate.orbitNoiseIndicator.abRelPct'
      + '(値は同じ・**門からは外れた**。第256便d までは definitionMatches の判定根拠だった)',
    'gate.definitionMatches(第256便d までの意味)': '「A/B の広がりが σ_rel の内側か」= 実際には軌道雑音の大小'
      + ' → 第257便d では gate.definitionDeclared(A を正本とした定義の宣言)と'
      + ' gate.orbitNoiseIndicator(A−B の感度)に分割した',
    'gate.defMeta': 'gate.definitionDeclared(旧欄は「同じ定義の 2 検出器が居るか」のまま残す)',
    'gate.status 未判定(理由=量の定義・検出器が観測精度で一致しない)':
      '第257便d では mapping-unresolved(観測量対応が未確定)か、定義未宣言の 未判定 のどちらかへ分かれる' },
  nQuantities: allQ.length,   // 第250便c: 「261(+)量」ではなく**確定表記**の量数
  tally: merged.reduce((a, r) => { for (const [k, v] of Object.entries(r.tally)) a[k] = (a[k] || 0) + v; return a; }, {}),
  byVersion: { obs: merged.filter((r) => r.version === 'obs').length,
    dfm: merged.filter((r) => r.version === 'dfm').length },
  gate: { rule: '|y_sim−y_obs| ≤ 3σ_obs + ε_num(ε_num ≤ 0.3σ_obs)。**ただし収束の保留条件**(第253便b): '
    + 'dt 3 段(dt, dt/2, dt/4)かつ正の実測次数 order>0 が揃うまで「収束済み」としない —— '
    + 'dt 2 段の差は**感度診断**であって誤差上限ではない(漸近域でも粗い側の誤差は 2^p/(2^p−1)|Q_h−Q_{h/2}|)。'
    + '第253便b の走行は 2 段・次数未測定なので、σ を持つ量はすべて「数値未解決」へ保留された。'
    + '**第255便d(第47報 N8)**: NS 4 系(⚡🧮🩺🧶)だけ --dt3 で 3 段を走らせ、観測次数 p_obs を実測した。'
    + '3 段+正の次数が揃った量は保留を抜け、**3σ の合否がその場で出る**(= 収束の門と観測一致の門が分かれた)。'
    + '**収束したことは一致したことではない** —— 次数が正でも残差が 3σ+ε_num を超えれば「否(3σ)」になる。'
    + '**第257便d(第49報)**: (a) `definitionMatches` を **A 正本**へ —— 判定に採るのは検出器 A で、'
    + '門が見るのは「定義が宣言されているか」だけになった。A−B は `orbitNoiseIndicator`(軌道側の'
    + '相対 1e−10〜1e−8 の雑音に対する検出器差の感度)として別欄へ出す。(b) 第 4 の状態 '
    + '`mapping-unresolved` を足した(観測量対応が未確定 — 例: タイミングの e_T と距離極値の eProxy)。'
    + '**3σ そのものは 1 mm も緩めていない**',
    byStatus: gateStatus, byReason: gateReason,
    withSigma: allQ.filter((q) => (q.gate && Number.isFinite(q.gate.sigma) && q.gate.sigma > 0)).length,
    withSigmaBySource: {
      obsCard: allQ.filter((q) => q.gate && q.gate.sigmaFrom === 'obsCard').length,
      csv: allQ.filter((q) => q.gate && q.gate.sigmaFrom === 'csv').length },
    sourceVerified: allQ.filter((q) => q.sigmaPrimaryVerified === true
      && q.gate && q.gate.sigmaFrom === 'csv').length,
    arithOnlyPass: allQ.filter((q) => q.gate && q.gate.arithOnly === true).length,
    note: '5 区分(合/窓/否/従/転)は来歴・解釈の欄として不変(**CSV の σ は 5 区分の経路へ入れない** '
      + '— 第251便c: σ が効くのは門だけ)。門は別欄であり、第251便c で観測 σ の転写(paper/data/'
      + 'solar-observations.csv の sigma 列)と一次表の照合印(sigma_primary)が入った。'
      + '定義の一致は**同じ定義の検出器 A/B の広がり**だけで見る(定義違いの広がりは σ と比較しない)。'
      + '**第253便b(第45報)**: ε_num は dt 2 段の差であり、これは**感度診断**であって誤差上限ではない'
      + '(旧文言「上限としての宣言」は撤回)。門は 3 段+正の実測次数が揃うまで「収束済み」としない'
      + '保留条件を持つ。これは判定を甘くする条件ではなく、**「まだ言えない」を言えるようにする条件**である。'
      + ' **第256便d(第48報)**: 恒星 4 系 ✨✴️🌟💫 と 📻 を --dt3 で走らせ、保留を外した'
      + '(3 段が揃った量は 29 件)。**収束したことは合ったことではない** —— 保留が外れた 4 件のうち'
      + '2 件は「合(3σ)」、2 件(DFM 版 ✴️💫)は「否(3σ)」である。' },
  agreementBreakdown: { verdictOK: okQ.length, sigma3: okSigma3, guide: okGuide,
    unassessed: okQ.length - okSigma3 - okGuide,
    note: '「合」の内訳: sigma3 = 機械門を通った 3σ 一致 / guide = 観測誤差が読めないときの ±1% 目安'
      + '(観測一致ではない)/ unassessed = 観測誤差はあるが定義・一次表・数値収束の条件が未達。'
      + ' **第253便b**: 収束の保留条件(3 段+正の次数)を入れたので、2 段しか走っていない量は sigma3 に入らない'
      + '(第252便までの sigma3=2 件は一度「数値未解決」へ移った — 数値が悪くなったのではなく、'
      + '2 段の差を上限として使ってよいという根拠が無かったということである)。'
      + ' **第256便d(第48報)**: 恒星 4 系(✨✴️🌟💫)と 📻 を --dt3 で走らせて 3 段+正の次数を揃えた結果、'
      + '保留が外れて**合否がその場で出た** —— 観測版 ✨🌟 が「合(3σ)」、**DFM 版 ✴️💫 が「否(3σ)」**である'
      + '(sigma3 が 0 でなくなったのは、判定が甘くなったからではなく、保留の条件を満たしたからである)。' } };

// ---------------------------------------------------------------- 第259便d(W4): 記録器の欄
// **枠だけを出す**。`--record-evidence` を渡さなければ `n:0` で、`entries` は空のままである。
out.predictionEvidenceRegistry = {
  n: evidenceRegistry.n, entries: evidenceRegistry.entries, invalid: evidenceRegistry.invalid,
  appliedToQuantities: evidenceApply.applied, unmatchedKeys: evidenceApply.unmatched,
  file: EVIDENCE_FILE || null,
  // 第260便d(W4): 宣言書式を **9 欄**にした(`units` / `covariance` / `extractor` / `codeHash` を追加)。
  // 欄が増えても**記録は 0 件のまま**である —— 増えたのは「宣言に要るもの」だけである。
  fields: ['dataset', 'usedForFit:false', 'validation:"held-out"', 'units', 'covariance',
    'extractor', 'codeHash', 'frozenProtocol:{commit,harness,window}', 'recordedAt'],
  declaredBefore: '**宣言は測定前にブリーフで行う**(器は記録するだけである)。'
    + '後から「これは fit に使っていない」と書き足すのは**後付けの hold-out** であって宣言ではない。',
  note: '**記録器あり・記録 ' + evidenceRegistry.n + ' 件**。第258便d の「宣言が無いので 0 件」は、'
    + '**宣言する場所が無かった**ことと区別が付かなかった —— 第259便d で枠を作り、区別が付くようにした。'
    + '**中身は空のまま出荷する**: 過去に測った値を後から「fit に使っていない」と宣言すると'
    + '**後付けの hold-out** になるからである(hold-out は観測値を見る前に手順を凍結したことに意味がある)。'
    + '宣言は**測る前**に `--record-evidence` で入れる。'
    + '**「予測が 0 件」ではなく「記録が 0 件」である** —— この 2 つを台帳でも混ぜない。' };

// ---------------------------------------------------------------- 第258便d(W4): 3 つの新しい欄
// (a) 条件不一致の一覧(隔離した行と、捨てていない元の証拠)
out.conditionMismatch = { n: conditionResult.n, rows: conditionResult.isolated,
  rule: '行が明記している条件(現行の宣言は kFrame だけ)と、その行に割り当てられている測定値の'
    + '走行条件が違うとき、判定を `条`(condition-mismatch)にして隔離する。**宣言である**'
    + '(閾値による自動判定ではない)。元の測定値・残差は conditionRejectedEvidence に残す —— '
    + '**数値が間違っているのではなく、行の割り当てが間違っている**。',
  fix: '対照条件の走行を**別に**行い、その行へ割り当てる。プリセットの physics は変えない'
    + '(検証器の中で physics を差し替えた診断コピーを走らせる)。',
  note: '**「対照が合っていた」という記録は、この便で 1 件も残っていない** —— '
    + '対照条件の走行そのものが行われていなかったからである。' };
// (b) deg/yr の門(⚡🧮🩺🧶 の近点移動)
{
  const rows = [];
  for (const r of merged) for (const q of (r.quantities || [])) {
    if (!q.degYear || q.degYear.measured !== true) continue;
    rows.push({ id: r.id, emoji: r.emoji, target: q.target,
      measDegPerYr: q.degYear.meas, obsDegPerYr: q.degYear.obs, sigmaDegPerYr: q.degYear.sigma,
      ratio: q.degYear.ratioToObs, nSigma: q.degYear.gate ? q.degYear.gate.nSigma : null,
      statusDegYear: q.degYear.gate ? q.degYear.gate.status : null,
      statusDegPerOrbit: q.gate ? q.gate.status : null,
      moved: !!(q.gate && q.degYear.gate && q.gate.status !== q.degYear.gate.status),
      // 第270便a(AD8): 判定量を deg/yr へ写した行では、**°/周 は換算前の記録**である
      // (`q.meas` はもう °/周 ではない)。欄の意味を取り違えないよう degYear.degPerOrbit から採る。
      ad8Converted: !!(q.ad8 && q.ad8.converted),
      measDegPerOrbit: q.degYear.degPerOrbit.meas, obsDegPerOrbit: q.degYear.degPerOrbit.obs,
      ratioDegPerOrbit: (Number.isFinite(q.degYear.degPerOrbit.meas)
        && Number.isFinite(q.degYear.degPerOrbit.obs) && q.degYear.degPerOrbit.obs !== 0)
        ? q.degYear.degPerOrbit.meas / q.degYear.degPerOrbit.obs : null,
      tSpanYr: q.degYear.timeFit ? q.degYear.timeFit.tSpanYr : null,
      nPeri: q.degYear.timeFit ? q.degYear.timeFit.nPeri : null,
      seDegPerYr: q.degYear.timeFit ? q.degYear.timeFit.seDegPerYr : null,
      provenanceSeparated: q.degYear.provenance ? q.degYear.provenance.separated : null });
  }
  out.degYearGate = { n: rows.length, rows,
    rule: '近点角を unwrap して**実時刻**に線形 fit し、傾きを deg/yr へ直して CSV の deg/yr の'
      + '値・σ と**換算せずに**比べる。°/周 は別欄に残す(degPerOrbit)。',
    unitNote: '**単位を変えても比は直らない** —— ratio(deg/yr)と ratioDegPerOrbit を並べて置いたのは'
      + 'そのためである。比が 2 に近いのは単位の取り違えではない。',
    provenanceNote: '⚡ の ω̇ は Kramer et al. (2021) PRX 11 041050 Table IV、P_b は Hu et al. (2022) '
      + 'A&A 667 A149 の**別解**である。deg/yr の門は ω̇ の一次表だけを使うので、'
      + '°/周 への換算が持っていた「2 つの解をまたぐ」問題が無い。',
    moved: rows.filter((z) => z.moved).length };
}
// (c) h8 検査点(--dt8 で名指しした系だけ。走らせていない系は **未走行** と書く)
{
  const rows = [];
  for (const r of merged) for (const q of (r.quantities || [])) {
    if (!q.h8) continue;
    rows.push({ id: r.id, emoji: r.emoji, kind: q.kind, target: q.target,
      stages: q.h8.stages, pObs3: q.h8.pObs3, pObsShifted: q.h8.pObsShifted,
      numBoundH4: q.h8.numBoundH4, numBoundH8: q.h8.numBoundH8,
      estimateFromH4: q.h8.estimateFromH4 ? q.h8.estimateFromH4.refined : null,
      estimateFactorH4: q.h8.estimateFromH4 ? q.h8.estimateFromH4.factor : null,
      richardson: q.h8.richardson });
  }
  out.h8 = { requested: DT8 || null, n: rows.length, rows,
    notRun: DT8 ? null : '**未走行**(--dt8 を指定していない走行である)',
    rule: 'dt/8=0.002 の 4 段目。pObs3=(h,h/2,h/4)・pObsShifted=(h/2,h/4,h/8) の観測次数を並べる'
      + '(**2 つが揃えば漸近域に居る**と読める)。門が読む ε_num は |Q_h−Q_{h/4}| のままで、'
      + '**|Q_h−Q_{h/4}| は上限ではない** —— 漸近形なら /(1−4^−p) 倍(p≈1 で 4/3)である。' };
}
// (d) 40 本の**再判定台帳**(docs/CALIBRATION_VERDICT_v1.44.md の正本 — QA が突き合わせる)
{
  const V4 = { OK: '合', LIM: '量限定合', NG: '否', HOLD: '保留' };
  const ledger = merged.map((r) => {
    const qs = r.quantities || [];
    const st = (s) => qs.filter((q) => q.gate && q.gate.status === s);
    const ng = st(GATE.NG), ok = st(GATE.OK), num = st(GATE.NUM), map = st(GATE.MAP), cond = st(GATE.COND);
    const withSig = qs.filter((q) => q.gate && Number.isFinite(q.gate.sigma) && q.gate.sigma > 0);
    // 4 値: 否 > 量限定合 > 保留。**「合」は「その系のすべての判定量が 3σ を通った」ときだけ** ——
    // 現行は 0 本である(どの系も σ の付いた量がすべて通ってはいない)。
    let v4 = V4.HOLD;
    if (ng.length) v4 = V4.NG;
    else if (ok.length) v4 = (ok.length === withSig.length && withSig.length > 0) ? V4.OK : V4.LIM;
    const missing = [];
    if (cond.length) missing.push('条件不一致');
    if (!withSig.length) missing.push('σ 未接続');
    if (map.length) missing.push('写像未確定');
    if (num.length) missing.push('数値精度');
    if (qs.every((q) => !Number.isFinite(q.meas))) missing.push('未測定');
    if (!missing.length) missing.push('(3σ を通った量がある — 残りは量の不足)');
    const rep = (() => {
      const c = ok[0] || ng[0] || num[0] || withSig[0] || null;
      return c ? { kind: c.kind, nSigma: (c.gate && Number.isFinite(c.gate.nSigma)) ? c.gate.nSigma : null,
        residualPct: Number.isFinite(c.residualPct) ? c.residualPct : null } : null;
    })();
    // **保存済み代表残差**(σ の有無に依らず、観測と突き合わせた量が残している残差)。
    // 条件不一致で隔離した行は**含めない**(その行の残差は conditionRejectedEvidence にある)。
    const cmp = qs.filter((q) => Number.isFinite(q.obs) && Number.isFinite(q.meas)
      && q.verdict !== VERDICT_CONDITION);
    const per = cmp.find((q) => q.kind === 'period' && Number.isFinite(q.residualPct)) || null;
    const worst = cmp.filter((q) => Number.isFinite(q.residualPct))
      .sort((a, b) => Math.abs(b.residualPct) - Math.abs(a.residualPct))[0] || null;
    // **分類変更の提案**(提案だけ — プリセット JSON は 1 bit も変えない)。機械的な条件は 2 つ:
    //   (a) 参照が観測でない(referenceKind:"theory-control")/ (b) 観測と突き合わせた量が 0 件
    // どちらかなら「原理/参照」へ移す提案を立てる。**現実較正に数えない**という提案であって、
    // そのサンプルが要らないという意味ではない。
    const proposeRef = (r.referenceKind === 'theory-control') || cmp.length === 0;
    return { id: r.id, emoji: r.emoji, version: r.version,
      referenceKind: r.referenceKind || null, verdict4: v4,
      gateCounts: { ok: ok.length, ng: ng.length, num: num.length, map: map.length,
        cond: cond.length, withSigma: withSig.length, nQ: qs.length },
      representative: rep, missing,
      comparedCount: cmp.length,
      residualPeriodPct: per ? per.residualPct : null,
      residualWorst: worst ? { kind: worst.kind, pct: worst.residualPct } : null,
      classProposal: proposeRef ? '原理/参照' : null,
      classProposalReason: proposeRef
        ? ((r.referenceKind === 'theory-control') ? '参照が観測ではなく理論値である(referenceKind:"theory-control")'
          : '観測と突き合わせた量が 0 件である(転写・帳簿・宣言だけ)')
        : null,
      predictionEligible: qs.filter((q) => q.predictionEligible === true).length };
  });
  out.verdictLedger = { n: ledger.length, values: Object.values(V4), rows: ledger,
    counts: Object.values(V4).reduce((a, v) => { a[v] = ledger.filter((z) => z.verdict4 === v).length; return a; }, {}),
    rule: '**4 値**(合/量限定合/否/保留)。「合」は**その系の σ を持つ判定量がすべて 3σ を通った**ときだけ。'
      + '「量限定合」は一部の量だけが通った系。「否」は 3σ を外した量がある系。'
      + '「保留」は**判定できない**系(σ 未接続・写像未確定・数値精度・未測定・条件不一致)——'
      + '**保留は否定ではない**(物理仮説が否定されたという意味ではまったくない)。',
    note: 'docs/CALIBRATION_VERDICT_v1.44.md はこの欄の転記である(QA docs.calibration-verdict-sync が照合する)。' };
}

// (e) 第265便a(第57報 W1・裁定 Z14): **3 段(dt/4)の恒久登録表**の点検
//   第264便a は 🪝🪄🩹📿🪤 の 5 本について「対応表に宛先があるのに σ が繋がっていない」を解き、
//   **その場限りの `--only … --dt3 --merge`** で 3 段を走らせた。恒久化しないと、次の便で
//   「どれが 3 段対象だったか」が失われる。本便は **登録表 `THREE_STAGE_REGISTRY` を器に置き**、
//   走行のたびに「登録した系が 3 段で走っているか・σ の宛先が立っているか」を機械で数える。
//   **登録は「3 段で走らせる対象である」という宣言であって、合格の宣言ではない。**
//   登録しただけでは σ も 3σ も 1 件も動かない(下の census がそれを数で示す)。
{
  const reg = THREE_STAGE_REGISTRY;
  const rows = reg.map((z) => {
    const r = merged.find((m) => m.id === z.id) || null;
    const qs = r ? (r.quantities || []) : [];
    const withSig = qs.filter((q) => q.gate && Number.isFinite(q.gate.sigma) && q.gate.sigma > 0);
    const fromCsv = qs.filter((q) => q.gate && q.gate.sigmaFrom === 'csv');
    const ok = qs.filter((q) => q.gate && q.gate.status === GATE.OK);
    return { id: z.id, emoji: r ? r.emoji : null, registeredBy: z.since, why: z.why,
      present: !!r,
      hasQuarter: !!(r && r.run && r.run.dtQuarter),
      hasHalf: !!(r && r.run && r.run.dtHalf),
      nQuantities: qs.length, withSigma: withSig.length, sigmaFromCsv: fromCsv.length,
      pass3Sigma: ok.length,
      sigmaTargets: qs.filter((q) => q.sigmaSource)
        .map((q) => ({ target: q.target, kind: q.kind, quantity: q.sigmaSource.quantity,
          primaryVerified: q.sigmaSource.primaryVerified === true })),
      verdict4: (out.verdictLedger.rows.find((v) => v.id === z.id) || {}).verdict4 || null,
      tally: r ? r.tally : null };
  });
  out.threeStageRegistry = { n: rows.length, rows,
    registeredThisWave: reg.filter((z) => z.since.indexOf('第265便a') === 0).map((z) => z.id),
    quarterRun: rows.filter((z) => z.hasQuarter).length,
    sigmaFromCsvTotal: rows.reduce((a, z) => a + z.sigmaFromCsv, 0),
    pass3SigmaTotal: rows.reduce((a, z) => a + z.pass3Sigma, 0),
    rule: '**登録表は「3 段(dt/4)で走らせる対象である」という宣言**である。'
      + '登録しても σ は 1 件も増えず、3σ も 1 件も動かない —— `pass3SigmaTotal` がそれを数える。',
    note: '**新しく繋がった量が 3σ を通らないことを隠さない**(第264便a の 11 件は 0 件のままである)。' };
}

// ---------------------------------------------------------------- 第270便a(第60報 W1・AE8/AE9/(A))
// (f) **4 値の履歴**・**再現手順**・**--merge の鍵**・**停止条件の点検**。
// 本便は**署名便**である —— 既定経路の結果が動く。**旧値を履歴として残し、新値は再集計して測る**。
{
  const sha = (p) => { try { return crypto.createHash('sha256')
    .update(fs.readFileSync(path.join(ROOT, p))).digest('hex'); } catch (e) { return null; } };
  const csvSha = sha('paper/data/solar-observations.csv');
  const jsSha = sha('paper/data/judgement-sources.json');
  out.mergeKey = { csvSha, judgementSourcesSha: jsSha, target: TARGET,
    periWindow: PERI_WINDOW, dtBase: DT0, orbMax: ORB_MAX,
    stopRuleVersion: STOP_RULE_VERSION,
    extractor: 'periastron-detectorA(ṙ の −→+ 交差・線形内挿)+ 第269便a の同窓周期',
    gateRule: 'AD4+AE3(3 段・order>0・|p−2|≤0.5・窓充足・抽出健全・ε̂ と 2 段差 ≤0.3σ)',
    judgementMode: 'applied-AD5',
    rule: '**--merge はこの鍵が一致する記録どうしでしか行えない**(preset id だけを鍵にしない)。'
      + '入力 CSV・宣言・窓・刻み・停止条件の版・抽出器・門の規約のどれか 1 つでも違えば器を止める。' };
  out.reproduce = {
    step1: 'PLAYWRIGHT_CORE_DIR=… node tests/exp-w249b-calaudit.mjs(通常走行・全プリセット)',
    step2: 'PLAYWRIGHT_CORE_DIR=… node tests/exp-w249b-calaudit.mjs --dt3-registry --merge',
    step3: 'node tests/exp-w262d-solarsigma.mjs',
    regate: '**`--regate` の産物を正本にしない** —— 再判定専用(`applySigma` を通らないので'
      + '宣言・単位換算・新しい宛先は反映されない)。元測定の来歴は --regate の前の走行にある。',
    note: '**この順序が正本である**(第270便a・AE8)。docs/CALIBRATION_VERDICT_v1.44.md §5.16 と同じ。' };
  const counts = out.verdictLedger.counts;
  out.fourValues = {
    current: { counts, gate: out.summary.gate.byStatus, tally: out.summary.tally,
      commit: '第271便a(署名便)', csvSha, judgementSourcesSha: jsSha, when: out.meta.when || null },
    history: [{
      wave: '第270便(第60報・PR #272)', commit: 'ef2cd45',
      counts: { '合': 0, '量限定合': 2, '否': 1, '保留': 34 },
      gate: { '合(3σ)': 2, '否(3σ)': 1, '数値未解決': 35, 'mapping-unresolved': 14,
        'condition-mismatch': 8, '未判定': 254 },
      tally: { '合': 57, '窓': 6, '否': 25, '従': 4, '転': 214, '条': 8 },
      solarFour: { '否': 1, '保留': 15 }, solarCut: { 'csv-sigma-empty': 106,
        'kind-not-gated': 26, 'unit-not-converted': 3, 'connected': 4 },
      judgementSourcesVersion: '第270便a(2026-09-18)・mode=applied-AD5',
      reason: '**本便の基点**。判定段は **h 段**(文書 §5.13′.2 は h/4 と書いていた —— '
        + '第271便a の R3 でコードを AD4 の既決 h/4 へ統一した)・3 段登録 15 本'
        + '(❄️ カロンは未登録で「数値未解決=保留」)・停止条件は版 w270a-1。',
    }, {
      wave: '第269便(第59報・PR #271)', commit: 'f6c19b4',
      counts: { '合': 0, '量限定合': 2, '否': 2, '保留': 33 },
      gate: { '合(3σ)': 2, '否(3σ)': 2, '数値未解決': 31, 'mapping-unresolved': 13,
        'condition-mismatch': 8, '未判定': 258 },
      tally: { '合': 56, '窓': 6, '否': 22, '従': 4, '転': 218, '条': 8 },
      solarFour: { '保留': 16 }, solarCut: { 'csv-sigma-empty': 109, 'kind-not-gated': 26,
        'unit-not-converted': 4 },
      csvSha: 'e426aa7d8a6751068699933074c7885ee66234936e11aafd319bc091a670afd4',
      judgementSourcesVersion: '第268便a(2026-09-17)・mode=diagnostic-only-until-AD5',
      reason: '**基点**。宣言は診断欄のみ・📡 は 3 段登録に無く換算前(°/周)で判定・'
        + '収束規約は「3 段+order>0」だけ・走行長は步/秒×時間予算(機種依存)。',
    }],
    whatMoved: ['**R3: 正式判定段を h/4 へ統一**(3 段登録系だけ。h 段の値は `coarseValue`・'
      + '|Q_h−Q_{h/4}| は `coarseNumBound` として履歴に残す。**2 段だけの系の扱いは不変**)',
    '**R3: 次数推定の適用条件**(連続 2 段差が同符号でない列・3 段完全一致の列は次数不明として保留)',
    '**AF2: ❄️ カロンの公転周期を 3 段登録**(AF3 で 60 公転ぶんの步数を preset 宣言に足した)',
    '(第270便a まで)AD5: 宣言 2 件(カロン P・金星 e)を正式経路へ(中心値・σ・単位・解 ID・'
      + 'verified 状態・測定定義を同時に切り替え)',
    'AD8: 📡 D68 を 3 段登録し、**換算後(同じ近点集合の P_peri)の ϖ̇ [deg/yr]** を正式判定へ',
    'AD4+AE3: 収束規約に次数ガード |p−2|≤0.5・窓充足・抽出健全・ε̂ と 2 段差の予算を入れた',
    'AE9: 走行長を「步数上限+必要近点数の宣言」へ(壁時計は資源上限だけ)'],
    doNotWrite: ['判定が増えた', '較正を完了した', 'D68 が合(3σ)', '太陽系の σ が揃った',
      '模型が較正された'],
    note: '**「1 回」は以後の訂正禁止の意味ではない** —— 旧値は履歴として残し、'
      + '動いた行は理由・分母・入力の SHA・宣言版を添えて並べる。',
  };
  // (g) **AE3 の反実仮想**(次数ガードを入れなかったときの門)。**どの行がどちらへ動いたか**を数で残す。
  const cf = { rule: '第269便a の規約(3 段+order>0)だけで判定したときの門', moved: [], byStatus: {} };
  for (const r of merged) for (const q of (r.quantities || [])) {
    const g = q.gate; if (!g) continue;
    const c = g.convergence || {};
    let st = g.status;
    if (c.okLegacy === true && c.ok === false && g.status === GATE.NUM) {
      // 旧規約なら収束済みとして 3σ の算術に入っていた行
      st = (g.arithOnly === true) ? GATE.OK : ((g.arithOnly === false) ? GATE.NG : g.status);
      if (st !== g.status) cf.moved.push({ key: g.key, now: g.status, legacy: st,
        order: c.order, orderGuard: c.orderGuard, nSigma: g.nSigma });
    }
    cf.byStatus[st] = (cf.byStatus[st] || 0) + 1;
  }
  cf.n = cf.moved.length;
  cf.note = '**AE3(次数ガード |p−2|≤0.5)を入れたことで「数値未解決」へ戻った行**が '
    + cf.n + ' 件ある。**測定が悪くなったのではない** —— 観測次数が 2 から離れている量は'
    + '漸近域に居ないので、「収束した」と書ける条件を満たしていなかったということである。';
  out.ae3Counterfactual = cf;
  // (h) **停止条件の点検**(AE9): 資源上限を超えた段・步数上限で止まった段・近点不足の段を数える。
  const srRows = [];
  for (const r of merged) {
    const tb = (r.run && r.run.timeBudget) || [];
    srRows.push({ id: r.id, emoji: r.emoji, stages: tb.map((z) => z.tag) });
  }
  out.stopRuleCensus = { version: STOP_RULE_VERSION,
    presets: srRows.length,
    wallCeilingSec: WALL_CEILING_SEC,
    note: '段ごとの宣言と結果は `presets[].run.stopRule`(走行した preset)にある。'
      + '**壁時計は資源上限にだけ効く** —— 現行の走行で超えた段があるかどうかは '
      + 'tests/exp-w270a-stoprule.mjs が全段を数えて記録する。' };
}

// ---------------------------------------------------------------- 第271便a(第61報・AF12)
// **採用解の列の会計**。宣言のある行・既定規則の行・中心値が CSV 行と一致しない行を数える。
// **判定を変えない集計である**(何を使ったかを読めるようにするだけ)。
{
  const c = { n: 0, declared: 0, applied: 0, defaultRule: 0, byRecordId: 0,
    centerMatchesCsv: 0, centerDiffersFromCsv: 0, centerNotComparable: 0,
    sameObjectAsJudgement: 0, notSameObject: [], centerDiffRows: [] };
  for (const p of (out.presets || [])) for (const q of (p.quantities || [])) {
    const a = q.adopted; if (!a) continue;
    c.n++;
    if (a.declared) c.declared++; else c.defaultRule++;
    if (a.applied) c.applied++;
    if (a.selectedBy === 'record_id') c.byRecordId++;
    if (a.sameObjectAsJudgement) c.sameObjectAsJudgement++;
    else c.notSameObject.push({ id: p.id, key: a.key });
    if (a.centerMatchesCsv === true) c.centerMatchesCsv++;
    else if (a.centerMatchesCsv === false) { c.centerDiffersFromCsv++;
      if (c.centerDiffRows.length < 40) c.centerDiffRows.push({ id: p.id, key: a.key,
        obs: a.value, csvValue: a.csvValue, rel: a.centerVsCsvRel, rule: a.rule }); }
    else c.centerNotComparable++;
  }
  out.adoptedCensus = Object.assign(c, { since: '第271便a(第61報・AF12)',
    rule: '`adopted` 列は宣言読取器(`pickDeclaredRow`)の結果と、**判定が実際に使った行**から作る。'
      + '宣言の無い body|quantity の既定規則は「CSV のファイル順で最初の行」である。',
    finding: '**中心値が CSV 行と一致しない行**は、中心値が obsCard 由来・σ が CSV 行由来という'
      + '組み合わせのまま残っている行である(AD5 で 6 つ同時に切り替えたのは宣言のある 2 件だけ)。'
      + '**これは判定の誤りの宣言ではない** —— 何行あるかを数えただけである。',
    doNotWrite: ['採用解を揃えた', '宣言で判定が増えた'] });
}

// ---------------------------------------------------------------- 第271便a(第61報・AF16)
// **正本 JSON から「重い診断」を別ファイルへ分ける**(**削らない** —— 移すだけである)。
// 何を移すかは**宣言列挙**であり、自動判定ではない。移すのは「判定にも QA にも入らない診断欄」だけで、
// 門が読む数(σ・残差・収束の欄)や走行の記録(步数・近点数・壁時計)は**正本に残す**。
//   ① `run.stopRule.machineIndependence` / `run.stopRuleStages[].machineIndependence`
//      …… 旧停止規則を 3 つの步/秒で再現した比較(第270便a の器が同じものを合成入力で作れる)。
//   ② `quantities[].stageHealth.rows` …… 段ごとの生の抽出診断(**要約は `stageHealth` 本体と
//      `gate.convergence` に残る**)。
//   ③ `quantities[].gate.deprecatedKeys` …… 旧鍵の読み替え表(`out.keyAliases` に正本がある)。
//   ④ `quantities[].predictionEligibleReasons` …… ④ 予測資格の理由列(判定には入らない)。
// 正本には **要約 + 相対パス + SHA-256** を残し、参照先が欠けたときに分かるようにする。
const DIAG_OUT = path.join(ROOT, 'tests', 'out', 'calaudit-w249-diag.json');
const DIAG_FIELDS = [
  { path: 'presets[].run.stopRule.machineIndependence', why: '旧停止規則の步/秒依存の再現(第270便a)' },
  { path: 'presets[].run.stopRuleStages[].machineIndependence', why: '同上(段ごと)' },
  { path: 'presets[].quantities[].stageHealth.rows', why: '段ごとの生の抽出診断(要約は本体に残る)' },
  { path: 'presets[].quantities[].gate.deprecatedKeys', why: '旧鍵の読み替え表(正本は out.keyAliases)' },
  { path: 'presets[].quantities[].predictionEligibleReasons', why: '④ 予測資格の理由列(門に入らない)' },
  { path: 'presets[].quantities[].numBoundDeclCoarse', why: '旧規約(h 段)の ε_num 宣言(第271便a・R3 の履歴)' },
];
// ---------------------------------------------------------------- 第271便a(第61報・AF16)
// **同じ文言が何百行にも複製されている欄は、正本の中で 1 か所へまとめる**(`out.contracts`)。
// 移すのではなく **辞書化**である —— 文言は正本の中に 1 部だけ残り、各行には参照鍵が入る。
// 鍵は**文言の SHA-256 の先頭 8 桁**なので、違う文言が同じ鍵に潰れることはない(取りこぼさない)。
// **数は 1 つも辞書化しない**(門が読む値・走行の記録はすべて各行に残る)。
const CONTRACT_TEXT_FIELDS = [
  'run.stopRule.{rule,note,maxStepsWhy,needPeriastraWhy,rateNote}',
  'run.stopRuleStages[].{同上}', 'run.timeBudget[].note',
  'quantities[].stageHealth.rule', 'quantities[].assessedStageNote',
  'quantities[].orderEstimable.rule', 'quantities[].numBoundDecl.{basis,orderNote}',
  'quantities[].gate.{assessedStageRule,definitionNote,definitionDeclaredNote}',
  'quantities[].gate.orbitNoiseIndicator.meaning',
  'quantities[].gate.convergence.{rule,orderGuardRule,orderEstimableRule,lastDiffDef}',
  'quantities[].gate.convergence.previous.{rule,note}',
  'quantities[].adopted.{selectionReason,defaultRule,note,ad8Note}',
  'quantities[].judgementSource.{note,previous.note}',
];
// **`--merge` / `--regate` で持ち越した preset の診断は、前回の別ファイルから引き継ぐ**。
// 引き継がないと、再走しなかった preset の診断が正本にも別ファイルにも無くなる(= 実際に消える)。
// 引き継げなかったものは `missingReferences` に**そのまま並べる**(黙って埋めない)。
const PREV_DIAG = (() => { try {
  return JSON.parse(fs.readFileSync(DIAG_OUT, 'utf8')); } catch (e) { return null; } })();
const diag = { when: new Date().toISOString(), wave: '第271便a(第61報・AF16)',
  of: 'tests/out/calaudit-w249.json',
  what: '**正本から移した重い診断**である(削ったのではない)。正本の `diagnosticsSplit` に'
    + 'このファイルの相対パスと SHA-256 がある。単独で配ると参照先が欠ける —— 2 つで 1 組である。',
  carriedOverFrom: PREV_DIAG ? (PREV_DIAG.when || null) : null,
  fields: DIAG_FIELDS, presets: {}, missingReferences: [] };
{
  const bytesBefore = Buffer.byteLength(JSON.stringify(out, null, 1));   // **UTF-8 バイト**で測る(文字数ではない)
  let moved = 0;
  // ---- 文言の辞書化(`out.contracts`)。**正本の中に 1 部だけ残す**(別ファイルへは出さない)
  // `--merge` で持ち越した行は既に辞書化済み(文言のかわりに `…Ref` の鍵を持つ)なので、
  // **前回の辞書を種にする** —— そうしないと持ち越した行の参照先が消える(下の dangling で検査する)。
  const PREV_MAIN = (() => { try { return JSON.parse(fs.readFileSync(OUT, 'utf8')); } catch (e) { return null; } })();
  const CONTRACTS = Object.assign({}, (PREV_MAIN && PREV_MAIN.contracts && PREV_MAIN.contracts.texts) || {});
  let hoisted = 0;
  const hoist = (obj, field, prefix) => {
    if (!obj || typeof obj[field] !== 'string' || obj[field].length < 60) return;
    const text = obj[field];
    const key = prefix + '#' + crypto.createHash('sha256').update(text).digest('hex').slice(0, 8);
    if (CONTRACTS[key] === undefined) CONTRACTS[key] = text;
    delete obj[field];
    obj[field + 'Ref'] = key;
    hoisted++;
  };
  const hoistAll = (obj, fields, prefix) => { for (const f of fields) hoist(obj, f, prefix + '.' + f); };
  for (const p of (out.presets || [])) {
    const bucket = { stopRule: null, stopRuleStages: {}, quantities: {} };
    const run = p.run || {};
    if (run.stopRule && run.stopRule.machineIndependence) {
      bucket.stopRule = run.stopRule.machineIndependence; moved++;
      delete run.stopRule.machineIndependence;
      run.stopRule.machineIndependenceMoved = 'calaudit-w249-diag.json';
    }
    for (const st of (run.stopRuleStages || [])) {
      if (!st || !st.machineIndependence) continue;
      bucket.stopRuleStages[st.tag || 'dt'] = st.machineIndependence; moved++;
      delete st.machineIndependence;
      st.machineIndependenceMoved = 'calaudit-w249-diag.json';
    }
    // 文言の辞書化(走行の側)
    const SR_TEXT = ['rule', 'note', 'maxStepsWhy', 'needPeriastraWhy', 'rateNote'];
    if (run.stopRule) hoistAll(run.stopRule, SR_TEXT, 'stopRule');
    for (const st of (run.stopRuleStages || [])) hoistAll(st, SR_TEXT, 'stopRule');
    for (const tb of (run.timeBudget || [])) hoist(tb, 'note', 'timeBudget.note');
    for (const q of (p.quantities || [])) {
      const key = `${q.target}|${q.kind}|${q.name}`;
      const b = {};
      if (q.stageHealth && Array.isArray(q.stageHealth.rows)) {
        b.stageHealthRows = q.stageHealth.rows; moved++;
        q.stageHealth.rowsMoved = 'calaudit-w249-diag.json';
        q.stageHealth.rowsN = q.stageHealth.rows.length;
        delete q.stageHealth.rows;
      }
      if (q.gate && q.gate.deprecatedKeys) {
        b.deprecatedKeys = q.gate.deprecatedKeys; moved++;
        q.gate.deprecatedKeysMoved = 'calaudit-w249-diag.json';
        delete q.gate.deprecatedKeys;
      }
      if (q.predictionEligibleReasons) {
        b.predictionEligibleReasons = q.predictionEligibleReasons; moved++;
        q.predictionEligibleReasonsMoved = 'calaudit-w249-diag.json';
        delete q.predictionEligibleReasons;
      }
      if (q.numBoundDeclCoarse) {
        b.numBoundDeclCoarse = q.numBoundDeclCoarse; moved++;
        q.numBoundDeclCoarseMoved = 'calaudit-w249-diag.json';
        delete q.numBoundDeclCoarse;
      }
      // 文言の辞書化(量の側)—— **数は 1 つも触らない**
      if (q.stageHealth) hoist(q.stageHealth, 'rule', 'stageHealth.rule');
      hoist(q, 'assessedStageNote', 'assessedStageNote');
      if (q.orderEstimable) hoist(q.orderEstimable, 'rule', 'orderEstimable.rule');
      if (q.numBoundDecl) hoistAll(q.numBoundDecl, ['basis', 'orderNote'], 'numBoundDecl');
      if (q.adopted) hoistAll(q.adopted, ['selectionReason', 'defaultRule', 'note', 'ad8Note'], 'adopted');
      if (q.judgementSource) {
        hoist(q.judgementSource, 'note', 'judgementSource.note');
        if (q.judgementSource.previous) hoist(q.judgementSource.previous, 'note', 'judgementSource.previous.note');
      }
      if (q.gate) {
        hoistAll(q.gate, ['assessedStageRule', 'definitionNote', 'definitionDeclaredNote'], 'gate');
        if (q.gate.orbitNoiseIndicator) hoist(q.gate.orbitNoiseIndicator, 'meaning', 'orbitNoiseIndicator.meaning');
        const c = q.gate.convergence;
        if (c) {
          hoistAll(c, ['rule', 'orderGuardRule', 'orderEstimableRule', 'lastDiffDef'], 'convergence');
          if (c.previous) hoistAll(c.previous, ['rule', 'note'], 'convergence.previous');
        }
      }
      if (Object.keys(b).length) bucket.quantities[key] = b;
    }
    if (bucket.stopRule || Object.keys(bucket.stopRuleStages).length
      || Object.keys(bucket.quantities).length) { diag.presets[p.id] = bucket; continue; }
    // この preset では何も移さなかった。**前回の走行で移した記録が残っているなら引き継ぐ**
    // (`--merge` で持ち越した preset は既に剥がれているので、印だけが残っている)。
    const marked = !!((run.stopRule && run.stopRule.machineIndependenceMoved)
      || (p.quantities || []).some((q) => (q.stageHealth && q.stageHealth.rowsMoved)
        || (q.gate && q.gate.deprecatedKeysMoved) || q.predictionEligibleReasonsMoved));
    if (!marked) continue;
    const old = PREV_DIAG && PREV_DIAG.presets ? PREV_DIAG.presets[p.id] : null;
    if (old) {
      diag.presets[p.id] = old;
      moved += (old.stopRule ? 1 : 0) + Object.keys(old.stopRuleStages || {}).length
        + Object.values(old.quantities || {}).reduce((a, q) => a + Object.keys(q).length, 0);
    } else diag.missingReferences.push({ id: p.id,
      why: '正本に `…Moved` の印があるのに、別ファイルに記録が無い(参照先が欠けている)' });
  }
  // **参照先の欠落を検査する**(`…Ref` の鍵が辞書に無ければ、その行の文言は読めない)
  const dangling = [];
  (function walk(o, path) {
    if (o === null || typeof o !== 'object') return;
    if (Array.isArray(o)) { for (let i = 0; i < o.length; i++) walk(o[i], path + '[' + i + ']'); return; }
    for (const k of Object.keys(o)) {
      const v = o[k];
      if (typeof v === 'string' && /Ref$/.test(k) && v.indexOf('#') > 0) {
        if (CONTRACTS[v] === undefined && dangling.length < 40) dangling.push(path + '.' + k + ' → ' + v);
      } else walk(v, path + '.' + k);
    }
  })(out.presets, 'presets');
  out.contracts = Object.assign({
    dangling, danglingN: dangling.length,
    what: '**同じ文言が何百行にも複製されていた欄を、正本の中で 1 か所へまとめた辞書**'
      + '(第271便a・AF16)。各行には `…Ref` という鍵が入っていて、その鍵でここを引く。'
      + '鍵は文言の SHA-256 の先頭 8 桁なので、**違う文言が同じ鍵へ潰れることはない**。'
      + '**別ファイルへ出したのではない** —— 文言は正本の中に 1 部だけ残っている。'
      + '**数は 1 つも辞書化していない**(門が読む値・走行の記録は各行にある)。',
    fields: CONTRACT_TEXT_FIELDS, n: Object.keys(CONTRACTS).length, hoisted,
  }, { texts: CONTRACTS });
  const diagText = JSON.stringify(diag, null, 1);
  fs.mkdirSync(path.dirname(DIAG_OUT), { recursive: true });
  fs.writeFileSync(DIAG_OUT, diagText);
  const sha = crypto.createHash('sha256').update(diagText).digest('hex');
  out.diagnosticsSplit = { since: '第271便a(第61報・AF16)',
    file: 'tests/out/calaudit-w249-diag.json', relPath: './calaudit-w249-diag.json',
    sha256: sha, bytes: Buffer.byteLength(diagText), movedFields: moved, fields: DIAG_FIELDS,
    presets: Object.keys(diag.presets).length,
    missingReferences: diag.missingReferences,
    carriedOverFrom: diag.carriedOverFrom,
    bytesBeforeSplit: bytesBefore,
    contractsHoisted: hoisted, contractsTexts: Object.keys(CONTRACTS).length,
    contractsDangling: dangling.length,
    rule: '**削っていない** —— 上の欄は別ファイルへ移しただけである。正本を単独で配ると'
      + 'これらの欄の参照先が欠ける(`…Moved` の印が残るので、欠けていることが分かる)。',
    says: '**分離はサイズの都合であって、診断を捨てたという意味ではない**。' };
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
out.diagnosticsSplit.bytesAfterSplit = Buffer.byteLength(JSON.stringify(out, null, 1));
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
out.diagnosticsSplit.bytesAfterSplit = fs.statSync(OUT).size;
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error(`[w249b] wrote ${OUT}`);
console.error('[w271a] 診断分離: ' + out.diagnosticsSplit.movedFields + ' 欄 → '
  + out.diagnosticsSplit.file + '(' + out.diagnosticsSplit.bytes + ' B・sha256 '
  + out.diagnosticsSplit.sha256.slice(0, 12) + '…)/ 正本 '
  + out.diagnosticsSplit.bytesBeforeSplit + ' → ' + out.diagnosticsSplit.bytesAfterSplit + ' B');
console.error('[w265a] 3 段登録表 ' + out.threeStageRegistry.n + ' 本(3 段済み '
  + out.threeStageRegistry.quarterRun + ' / σ 宛先 ' + out.threeStageRegistry.sigmaFromCsvTotal
  + ' / 3σ ' + out.threeStageRegistry.pass3SigmaTotal + ')');
console.error('[w249b] 判定集計 ' + JSON.stringify(out.summary.tally));
console.error('[w258d] 条件不一致 ' + out.conditionMismatch.n + ' 行 / 証拠付き予測 '
  + out.summary.stages['④予測(証拠付き)'] + ' 件(従属量でない③ は '
  + out.summary.stages['④予測(従属量でない③)'] + ' 件)/ 門 '
  + JSON.stringify(out.summary.gate.byStatus));
console.error('[w258d] 4 値 ' + JSON.stringify(out.verdictLedger.counts)
  + ' / deg/yr 門 ' + out.degYearGate.n + ' 行(判定が動いた行 ' + out.degYearGate.moved + ')'
  + ' / h8 ' + out.h8.n + ' 欄');
for (const z of out.degYearGate.rows) console.error(`  ${z.emoji} ${z.id} deg/yr ${z.measDegPerYr === null ? '—' : z.measDegPerYr.toPrecision(7)}`
  + ` 対 ${z.obsDegPerYr} (比 ${z.ratio === null ? '—' : z.ratio.toFixed(4)}・°/周の比 ${z.ratioDegPerOrbit === null ? '—' : z.ratioDegPerOrbit.toFixed(4)})`
  + ` ${z.statusDegYear} / °周 ${z.statusDegPerOrbit}`);
for (const p of pairs) console.error(`  ρ(${p.correlate}) = ${p.rho === null ? 'n/a' : p.rho.toFixed(3)} (n=${p.n})`);

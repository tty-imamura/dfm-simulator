// 第281便a(原仮定者の裁定(第71報)・AN16 採用・統括の検証項目 R71)— **正本の再生成表**(chain の段と正本の対応)。
//
// ■ 何を持つか
//   統括の chain(正本を作り直す一連の走行)の**段**ごとに:
//     key(段の名前)・cmd(実行する器と引数)・env(器が要る環境変数)・outs(書く正本)・
//     sec(**実測の所要秒** —— secSource が出所)・alwaysRun(毎回走らせる常時群)・
//     role('current' | 'history')・after(meta.inputs[] に出ない読み込み —— 例: charon が calaudit を読む)
//   を 1 行に持つ。`tools/regen-plan.mjs` がこの表と正本の meta(inputs[]・code[]・scope)から
//   「再生成 / 再利用(領域一致)/ 履歴 / 常時」を判定し、依存順の実行計画を出す。
//   `lint.regenScope` が「lint.provenanceMeta の CANON がすべてこの表の outs に載っている」「alwaysRun の段は
//   計画で省略されない」「履歴の正本はどの現行の段の入力にもなっていない」を照合する。
//
// ■ 所要秒の出所(**予想ではなく実測**)
//   'w280-chain' … 第280便の統括 chain(4 本並列・同じ容器)の各段の開始〜終了の差(scratch の chain ログ)。
//   'w281a-chain' … 第281便a の再生成(Chromium 1 本 + node 1 本)の各段の差。
//   'w272b-wallSec' … 正本 charon-w272b.json の列ごとの `wallSec`(実測)を、新しい既定列の集合で足した値。
//   'w282a-branch' … 第282便a の枝で器を 1 回走らせた実測(fmigration は正本の meta.wallSec の前後の和)。
//   'w282c-run' … 第282便c の器の単独走行(正本の elapsedS —— Node だけ・Chromium なし)。
//   'w283a-branch' … 第283便a の枝で器を 1 回走らせた実測(正本の elapsedS —— Node だけ・他の枝と同じ容器で並走)。
//   'w283c-run' … 第283便c の器の単独走行(正本の elapsedSec —— Node の vm + 判定器の --tp-copy〔Chromium〕)。
//   'w284a-branch' … 第284便a の枝で器を走らせた実測(正本の elapsedS —— 1 回目 3808.5・2 回目 3067.7 を採る。Node だけ・子プロセス 3 本・他の枝と同じ容器で並走〔負荷平均 12〜34〕)。
//   'w284e-branch' … 第284便e の枝で器を 1 回走らせた実測(正本の elapsedS —— tpsign は正本が基点の世代で判定器を --only で走らせた値)。
//   'w285a-branch' … 第285便a の枝で器を走らせた実測(正本の elapsedS —— contact285 は判定器なし・clusterScan は子プロセス 2 本・他の枝と同じ容器で並走)。
//   'w285b-branch' … 第285便b の枝で器を 1 回走らせた実測(正本の elapsedS 681.6 —— Node だけ・他の枝と同じ容器で並走〔負荷平均 30 前後〕)。
//   'w285d-branch' … 第285便d の枝で器を走らせた実測(正本の elapsedS —— Chromium 1 本・1 步も走らせない生成器)。
//   'w286a-branch' … 第286便a の枝で器を走らせた実測(正本の elapsedS —— jeans286 は Node だけ・clusterScan286 は子プロセス 2 本・他の 5 枝と同じ容器で並走)。
//   'w287a-branch' … 第287便a の枝で器を走らせた実測(正本の elapsedS 157.9 —— Node だけ・子プロセス 2 本・負荷平均 1 未満の容器。他の 5 枝と並走した 1 回目は 559.1)。
//   'w287c-branch' … 第287便c の枝で器を走らせた実測(正本の elapsedS 71.5〜109.2 —— Node だけ・geo3 の再走〔Chromium〕と同じ容器で並走)。
//   'w288d-branch' … 第288便d の枝で器を走らせた実測(正本の elapsedS 0.5〜1 —— Node だけ・1 步もエンジンを走らせない・他の 5 枝と同じ容器で並走)。
//   'w289d-branch' … 第289便d の枝で器を走らせた実測(正本の elapsedS 0.4 —— Node だけ・1 步もエンジンを積分しない・他の 5 枝と同じ容器で並走)。
//   'w289a-branch' … 第289便a の枝で器を走らせた実測(正本の elapsedS 1.3〜1.6 —— Node だけ・エンジンは固定した 3 体で 1 步と光線 2 本だけ・他の 5 枝と同じ容器で並走)。
//   'w289c-branch' … 第289便c の枝で器を走らせた実測(正本の elapsedS —— reldrag289 は Node の純関数だけ〔0.3 秒〕・nearfar289 は Node の headless〔1.1 秒〕・他の枝と同じ容器で並走)。
//   'w289b-branch' … 第289便b の枝で器を走らせた実測(正本の elapsedS 9.1 —— Node だけ・他の 5 枝と同じ容器で並走)。
//   'w290c-branch' … 第290便c の枝で器を走らせた実測(正本の elapsedS 4.2 —— Node の headless だけ・Chromium なし・他の枝と同じ容器で並走)。
//   'w290e-branch' … 第290便e の枝で器を 1 回走らせた実測(正本の elapsedS 170.6 —— Node の headless 1 本・他の枝と同じ容器で並走)。
//   'w291d-branch' … 第291便d の枝で器を走らせた実測(正本の elapsedS 2.5〜2.7 —— Node の headless 1 本・Chromium なし・他の枝と同じ容器で並走)。
//
// ■ 第282便e(原仮定者の裁定(第72報)・統括の検証項目 R82)
//   ・段ごとに `volatilePaths`({正本: [JSON Pointer…]})—— 安定 hash で除く欄(**実行時刻・壁時計の所要だけ**)。
//     宣言の無い正本は**除外なし**。表の外で作られる JSON 入力は `EXTERNAL_VOLATILE` に置く。
//   ・計画の各段に `cause`(どの入力・式・受理規則で無効化されたか)を 1 列足す。領域の不一致の内訳は、
//     刻印時の html(`meta.targetSha256` と sha が同じ基点 html —— `--base`)があるときだけ引ける。
//   ・領域 hash と安定 hash は**刻印の版で**照合する(旧版の刻印は旧版で引き直す)。
//
// ■ 第283便e(原仮定者の裁定(第73報)AN29・統括の検証項目 R88)—— **非物理 meta の除外・随伴ファイル・鎖の機械生成**
//   ・calaudit の除外 Pointer に**非物理の同一性 meta**(`V_CALAUDIT_META` —— 対象 html の名前と sha の写し 4 か所・
//     引用した ❄️ 正本の sha・分割先 diag の sha とバイト数・分割前後のバイト数)を足した。実パスは 53aaa64 → 8b05232 の
//     calaudit の実際の再走(既存 140 本 1 bit 不変の便)で**変わった欄の全部**から、実行時刻・所要と同一性 meta だけを取った
//     (物理欄は 1 つも除いていない —— `lint.stableHashPaths` ②)。
//   ・分割先 `calaudit-w249-diag.json` は sha を除いた代わりに**随伴ファイル**(`STABLE_COMPANIONS`)として別の行で
//     安定 hash を刻む(除く Pointer は `/when`・`/carriedOverFrom` だけ —— 中身〔移した診断〕は残る)。
//   ・段が**書く**ファイルを `merges`(`--merge` で正本へ書き戻す段: dt3・kf0 → calaudit の 2 ファイル)まで含めて持つ
//     (`writesOf`)。読む段は**書く段のすべて**の後に置く(`tableDeps`)。第282便の統合で起きた順序の型(d0audit・bgbudget を
//     入力より先・kf0ledger を nslockledger の再走の後に走らせない)は `tableDepsAudit`(表の after の推移閉包が正本の入力の
//     書き手を覆うか)と `checkOrder`(実際に走った列の照合)で検出する。
//   ・`buildChain` / `chainShell`: 計画(regen/always/recheck)と依存の閉包から、依存順の波と並列レーンのシェルを出す
//     (済み印で再開・rc≠0 で止まる・ログ名 `<波>-<段>.log`)。閉包で入った後段は**上流が走った後に自分の判定を引き直す**
//     (`--gate` —— 自分の対象・コード・入力〔安定 hash〕が一致すれば再利用)。`tools/regen-chain.mjs` が CLI。
//
// ■ 第284便f(原仮定者の裁定(第74報)⑥「まだ時間が長いので改善する・並列実行を検討する」・統括の検証項目 R94)—— **並列化の規約**
//   ・**ready queue**: 鎖のランナー(`chainShell`)は波全体の完了を待たない。依存(鎖の中)が済んだ段から、優先度(自分から下流の端までの
//     実測秒の最長路 —— `chainPriority`)の順に空きレーンへ入れる。波の番号はログ名 `<波>-<段>.log` と表示にだけ残す。
//   ・**書込排他**: 書くファイル(`writesOf` = outs + merges)が重なる段は同時に走らせない(ランナーは排他の鍵・表は after の全順序 ——
//     `tableDepsAudit` ②・模擬 `simulateReadyQueue`・実走の時系列 `checkTimeline`)。outs の外を書く段は `touches` に書き、
//     ほぼ全段が読むファイル(beta/index.html —— samplestatus)を書く段は `exclusive:true`(レーンを全部取る = 単独で走る)。
//   ・**共有 worker 予算**: 段の `workers`(既定 1)ぶんのレーンを取る。段の中で並列に走る器(較正走行の分割 tools/calaudit-split.mjs は
//     分割数)は workers に分割数を書く —— 再生成のレーン × 段の中の並列 × QA を重ねない(QA は鎖の外・鎖の後に 1 本)。
//   ・**済み印の契約**(`chainContracts`・版 CHAIN_CONTRACT_VERSION): policy(表の版・段・mode・cmd・env の名前・書くファイル・workers)・
//     code(cmd の器と正本の meta.code[] の現行 sha)・input(計画の対象 html の sha と鎖の中の上流の契約)の sha256。**同じ契約の
//     済み印だけ**を再開で済みと見なす(違う印は .stale へ退けて走らせ直す)。便をまたぐ済み印は契約が違うので自動で無効になる。
//   ・**刻印の Pointer ≠ 今の宣言 → regen**(AN43 —— `planRegen` の入力の照合。`--gate` も同じ判定を引く)。
//   ・**較正走行の分割**: `--shard-*`(tests/exp-w249b-calaudit.mjs)と tools/calaudit-split.mjs。分割した正本が直列と**ビット同一**
//     (安定 hash 一致・除外 Pointer の外の差 0 —— tests/exp-w284f-splitcheck.mjs)であることを実測した段だけ cmd を分割にする
//     (同一でなければ採らない)。cmd には器の名前(`--harness tests/exp-w249b-calaudit.mjs`)を残す(samplestatus・families が cmd の
//     器の名前で段を引く)。
//
// ■ しないこと: 走らせない・判定しない(表と、表を読む計画の純関数だけ)。
import fs from 'node:fs';
import crypto from 'node:crypto';
import { scopeHash, stableMatches, stableInputOk, STABLE_VERSION, stableJsonSha, stableValueSha, canonJson, parseTopLevel, closureOf, SCOPE_STOP, normalizeScope } from './lib-w281a-scope.mjs';
import { HTML_STAGE_ORDER, HTML_STAGE_VERSION } from './lib-w288f-htmlstage.mjs';   // 第288便f(AN90): 集約段の断片の順序

// ■ 第284便c(原仮定者の裁定(第74報)⑥・AN33・AN43・統括の検証項目 R93)
//   ・常時の dt3 段を `--h4-exceptions --merge`(h/4 は例外の登録簿の本だけ)・kf0 段を `--kf0-h4-exceptions`(h/4 は登録簿の kf0 の本だけ)へ。
//     所要秒は第284便c の枝の実測(一時ファイルへ走らせた同じ段 —— secSource 'w284c-run')。
//   ・**AN43**: 計画(`planRegen` —— 鎖の `--gate` も同じ関数)は、入力の**刻印の安定 hash の Pointer 宣言・方式の版が今の宣言と違えば**
//     (入力のバイト sha が刻印と同じでも)その段を regen にする。随伴ファイルの行も同じ(`stampedDeclDrift`)。
//     第283便e の `lint.stableHashPaths` ⑤ は「旧宣言 ⊊ 今の宣言」を**照合の上では**通す(刻印の Pointer で照合するので除きすぎにならない)が、
//     再生成の計画では「今の宣言で刻み直す」ために走らせ直す(`an43Probe` —— QA `lint.regenChain` (g))。
// ■ 第285便f(原仮定者の裁定(第75報)AN52・AN53・統括の検証項目〔較正走行の窓〕)
//   ・**AN53**: html 全体を刻む段(正本の meta.target が beta/index.html で、完全な領域の宣言が無い段)に `after:['samplestatus']` を足した
//     (`W285F_AFTER_SAMPLESTATUS`)。samplestatus は beta/index.html の生成領域を**書く**ので、その前に html 全体を刻んだ段は
//     samplestatus の後で必ず刻印が古くなる。**足さないもの**: samplestatus の上流(after の閉包 —— calaudit・dt3・kf0・charonwin)と、
//     samplestatus が読む正本の書き手(循環を作らない: 物理入力 → 測定 → 状態表 → html 全体)。`tableDepsAudit` に
//     「samplestatus より先に走りうる html 全体の段」の検出(`beforeSamplestatus`)を足した(`--audit`・自己試験 (n))。
//   ・**AN52**: calaudit の `budgetHit` を `wallNearBudget`(壁時計近接の診断)へ改名し、壁時計・時刻の欄(wallNearBudget・diag の
//     h2Store/h4Store の generatedAt・carriedFrom・wallSec・rateStepsPerSec)を除外 Pointer に**版つきで**足した(`VOLATILE_DECL` ——
//     宣言の版と Pointer の指紋。宣言の語彙の方式の版は tests/lib-w281a-scope.mjs の `STABLE_DECL_VERSION`)。
//     `complete`・`resourceExceeded`・`stoppedBy`・窓充足は**除外しない**(停止状態は物理の記録)。
// ■ 第286便f(統括の検証項目〔再生成表の after 検査〕): 第285便の統合で「obscompare の after に pn1」の注記が取りこぼされ、check-order が順序違反を出した。
//   `tableDepsAudit` に **「器が読む正本の書き手が after の推移閉包に無い」を静的に検査する項**(`missingAfter`)を足した: 各段の cmd が名指しする
//   器(tests/*.mjs・tools/*.mjs)と、その器が `from './x.mjs'` で読む同じ木の module(推移 —— 再生成表そのもの lib-w281a-regentable.mjs は除く)の本文から
//   `tests/out/*.json` の名指しを拾い(注釈は除く)、その正本を書く現行の段が after の閉包に無ければ欠落とする。同じ器を使う段の出力・import した器の自分の
//   出力は「書き」とみなす。前回の世代を読む循環の読み・文言の中の言及は `STATIC_READ_DECL` に**理由つきで宣言**する(宣言が実態に合わなくなったら `staleReadDecl`)。
//   現行の表で出た欠落 1 件(galaxydiag ← sparc)は after に足した。自己試験 (o)・QA `lint.regenChain` (o)。
// ■ 第287便f(原仮定者の裁定(第77報)AN69・統括の検証項目 R112): **済み印の契約を入力の安定 hash へ・html を書く段の宣言と検査**
//   ・済み印の契約(版 w287f-chaincontract-2)= 静的な部分(policy・code)+ 段を入れる直前に引く**入力の安定 hash**(`chainInputSpecs`・`inputDigest`・
//     `tools/regen-chain.mjs --digest`)。上流の意味的出力が同じなら読み手の印は生きる(第286便の鎖 7〜8 の空回りの再現と解消 —— 自己試験 (p))。
//   ・html を書く段に `htmlRegions`(生成領域の名 —— obscompare・assessed〔htmlWriteMode:'check'〕・samplestatus)を宣言し、書く段を
//     obscompare → assessed → samplestatus の全順序に並べた。`tableDepsAudit` の `html`(`htmlTailAudit`)が宣言と器の本文・領域の印・
//     書く段の順序・after 欠落・領域の閉包の重なり・依存の循環を検査する(自己試験 (q))。検査で見つけた欠落 2 型を表で直した:
//     families の領域が SAMPLE_STATUS を読む → after に samplestatus / meta を刻まない d68three・confirm4 が html の本文を読む → obscompare の after に。
//     順序で直せない読み(pn1 の領域の閉包が OBS_COMPARE_* に掛かる —— obscompare が pn1 を読む)は `HTML_REGION_READ_DECL` に理由つきで宣言。
//   ・families の `touches`(docs/FAMILIES_v1.45.md)を足した(outs の外に書くファイル —— 入力の並びから除く)。
// ■ 第288便f(原仮定者の裁定(第78報)AN90・統括の検証項目 R118): **一時出力の集約**(版 w288f-regentable-9)
//   ・html を書く段(obscompare → samplestatus)は鎖の中(REGEN_HTML_STAGE —— chainShell が $REGEN_LOG/html を入れる)で html を直に書かず、
//     領域 1 つぶんの断片を置く(tests/lib-w288f-htmlstage.mjs)。集約段 'htmlagg'(tools/regen-html-aggregate.mjs —— 常時群・単独)が
//     samplestatus の後で**1 回だけ** beta/index.html を置き換える(断片が合わなければ何も書かずに rc 1)。中断した鎖の半分だけ新しい html を
//     完成扱いしない。変数が無いとき(手で器を回すとき)は従来どおり直に書く。
//   ・samplestatus の後に置いていた段(after に samplestatus —— AN53 の html 全体を刻む 27 段・families 等)は集約段の後へ(after に htmlagg)。
//     集約段が書く段と読む段の間に入るので、27 段の刻印の方式(html 全体の sha)は変えずに「書いた後の html を読む」順序が保てる。
//   ・`htmlTailAudit` に ⑦ 書く段の直書き(鎖で書く段は writeHtmlStaged を使う)・⑧ 集約段(1 段・常時群・全ての書く段の下流・html 全体を読む
//     下流の段の上流・断片の順序 = 書く段の全順序)を足した。自己試験 (r) が「中断 → 再開で html が 1 回だけ書かれる」を stub の鎖で確かめる。
//   ・chainShell は冒頭で $REGEN_LOG/env.json に Node と Chromium の版を記録する(AN90 —— 1 ulp の切り分け用・版は固定しない)。
//   ・`HTML_REGION_READ_DECL` から pn1 → obs-compare を外した(AN90 —— 読込依存が無いことを lint.pn1RegionDecl・自己試験 (q6)(q6b) で機械検査してから)。
export const REGEN_TABLE_VERSION = 'w288f-regentable-9';

// ---- 第282便e: 安定 hash の除外 Pointer(実パスは 8b05232 の正本で確かめた —— `lint.stableHashPaths` が毎回照合)
const META_RUN = ['/meta/generatedAt', '/meta/inputs/*/mtime', '/meta/code/*/mtime'];
const V_CALAUDIT = ['/meta/when', '/fourValues/current/when', '/diagnosticsSplit/carriedOverFrom',
  '/presets/*/run/wallSec', '/presets/*/run/timeBudget/*/wallSec', '/presets/*/run/timeBudget/*/rateStepsPerSec',
  '/presets/*/run/stopRule/wallSec', '/presets/*/run/stopRule/rateStepsPerSec',
  '/presets/*/run/stopRuleStages/*/wallSec', '/presets/*/run/stopRuleStages/*/rateStepsPerSec',
  // 第285便f(AN52): 旧 budgetHit の改名(wallSec ≥ 0.9×budgetSec —— 壁時計近接の診断。停止状態は stopRule.stoppedBy・complete に残す)
  '/presets/*/run/timeBudget/*/wallNearBudget',
  // 第283便c で dt/8 を常時から外した(明示診断だけ)ので、常時の正本に dtEighth は無い —— Pointer は宣言から外す(統合時)
  ];
/**
 * 第283便e(AN29): calaudit の**非物理の同一性 meta**(`STABLE_META_KEYS` の鍵だけ —— 値の型は QA が照合)。
 * html を 1 字変えて calaudit を走らせ直すと、物理が 1 bit も動かなくても次が変わる(53aaa64 → 8b05232 の実測):
 * 対象 html の sha の写し 4 か所・引用した ❄️ 正本〔charon-w272b〕のファイル sha・分割先 diag の sha(diag の `when` が
 * 変わるため)・分割前後のバイト数(壁時計の桁数で変わる)。`/meta/target` は値が変わらないが、対象の名前は同一性の
 * meta なので同じ群に置く。分割先の中身は随伴ファイルの行で見る(`STABLE_COMPANIONS`)。
 */
export const V_CALAUDIT_META = ['/meta/target', '/meta/targetSha256', '/mergeKey/targetSha256', '/fourValues/current/targetSha256',
  '/kf0Runs/charonCitation/citedTargetSha256', '/kf0Runs/charonCitation/fileSha256',
  '/diagnosticsSplit/sha256', '/diagnosticsSplit/bytes', '/diagnosticsSplit/bytesBeforeSplit', '/diagnosticsSplit/bytesAfterSplit'];
/** 第283便e: 分割先 diag の意味 hash(除くのは生成時刻と持ち越し時刻だけ —— 53aaa64 → 8b05232 の再走で変わった欄の全部)。 */
// 第285便f(AN52): dt/2・dt/4 の転記元(h2Store/h4Store)の壁時計・時刻(新しく走らせた段の記録と、前回の diag の時刻の写し)。
//   h の生の走行の署名 hSig・契約・run の物理欄・stopRule の complete/stoppedBy/resourceExceeded・窓充足は**除かない**
const V_STORE_WALL = ['h2Store', 'h4Store'].flatMap((k) => ['/' + k + '/carriedFrom', '/' + k + '/entries/*/generatedAt',
  '/' + k + '/entries/*/run/wallSec', '/' + k + '/entries/*/run/rateStepsPerSec',
  '/' + k + '/entries/*/run/timeBudget/wallSec', '/' + k + '/entries/*/run/timeBudget/rateStepsPerSec', '/' + k + '/entries/*/run/timeBudget/wallNearBudget',
  '/' + k + '/entries/*/run/stopRule/wallSec', '/' + k + '/entries/*/run/stopRule/rateStepsPerSec']);
const V_CALAUDIT_DIAG = ['/when', '/carriedOverFrom'].concat(V_STORE_WALL);
/**
 * 第285便f(原仮定者の裁定(第75報)AN52): **除外 Pointer の宣言の版**(正本ごと)。`fp` は宣言した Pointer の並び(sort)の sha256 の先頭 16 桁 ——
 * Pointer を足し引きしたら版と fp を上げる(`lint.stableHashPaths` ⑦ が照合)。`renamed` は改名した欄(新 → 旧)で、改名前の世代の正本
 * (鎖で再生成する前)では旧名の位置に当たることを ② が許す。履歴は `history`。
 */
export const VOLATILE_DECL = {
  'tests/out/calaudit-w249.json': { version: 'w285f-vcal-2', since: '第285便f(AN52)', fp: 'afc6f3285acdc4bf',
    added: ['/presets/*/run/timeBudget/*/wallNearBudget'], renamed: { wallNearBudget: 'budgetHit' },
    history: [{ version: 'w283e-vcal-1', since: '第282便e・第283便e(AN29)', note: '実行時刻・壁時計・非物理の同一性 meta(budgetHit は未宣言 —— 第284便f の分割照合で見つかった)' }] },
  'tests/out/calaudit-w249-diag.json': { version: 'w285f-vdiag-2', since: '第285便f(AN52)', fp: '2461f5b121a2fc1c',
    added: V_STORE_WALL.slice(), renamed: { wallNearBudget: 'budgetHit' },
    history: [{ version: 'w283e-vdiag-1', since: '第283便e', note: '/when・/carriedOverFrom だけ(h2Store/h4Store の壁時計と時刻は未宣言)' }] },
};
/** 宣言した Pointer の並びの指紋(sort して改行で連ねた sha256 の先頭 16 桁)。 */
export function volatileDeclFp(file) {
  return crypto.createHash('sha256').update(volatilePathsOf(file).slice().sort().join('\n')).digest('hex').slice(0, 16);
}

/**
 * 第283便e: **随伴ファイル**(ある正本の安定 hash がその sha を除いているとき、中身の変化を別の行で見るファイル)。
 * `stableInputs` が入力の行の次に随伴ファイルの行を足す。
 */
export const STABLE_COMPANIONS = { 'tests/out/calaudit-w249.json': ['tests/out/calaudit-w249-diag.json'] };
export function companionsOf(file) { return (STABLE_COMPANIONS[file] || []).slice(); }

const S = (key, cmd, outs, sec, o) => Object.assign({ key, cmd, outs, sec, secSource: 'w280-chain',
  alwaysRun: false, role: 'current', after: [], env: {}, volatilePaths: {} }, o || {});
// 第283便b: 表の外にあった履歴の器(退役 7 本を名指しする —— 再生成しない・実測の所要なし)
const RH = (key, cmd, outs) => S('h283b-' + key, cmd, outs, 0, { role: 'history', secSource: '履歴(第283便b で登録 —— 走らせない)',
  note: '第283便b(第73報④・R84): 退役の本を名指しする過去の器。**再生成しない**(計画は常に「履歴」)' });

/** 段の表(並びは第280便の chain の順 —— 計画は依存で並べ直す)。 */
export const REGEN_STEPS = [
  S('obsintake', 'node tests/exp-w263c-obsintake.mjs', ['tests/out/obsintake-w263c.json'], 0, { after: ['calaudit', 'solarsigma'] }),
  S('recordid', 'node tests/exp-w270b-recordid.mjs', ['tests/out/recordid-w270b.json'], 1),
  S('corrections', 'node tests/exp-w272e-corrections.mjs', ['tests/out/corrections-w272e.json'], 0),
  S('bh90', 'node tests/exp-w269c-bh90.mjs', ['tests/out/bh90-w269c.json'], 20),
  // 第286便f(原仮定者の裁定(第76報)AN57): 🩺 psrJ1946DFM を f=1 へ移した —— この器は第270便c(AD9)の採用レコードを**旧則(f≈2)の 🩺 🪀 🩹**で
  //   4 段(h/1〜h/8・20 近点窓)と共同根の探索で測る記録で、f=1 の 🩺(同方向1周が観測の約 33 倍)には当たらない。**履歴**(再生成しない —— 正本は第285便の鎖の走行のまま)
  S('j1946adopt', 'node tests/exp-w270c-j1946adopt.mjs', ['tests/out/j1946adopt-w270c.json'], 149, { secSource: 'w281a-chain', role: 'history',
    note: '第286便f(AN57): 🩺 の f=1 で旧則(f≈2)の採用記録は履歴 —— **再生成しない**(計画は常に「履歴」)。旧 🩺 の宣言は tests/fixtures/retired-w286f.json の superseded' }),
  S('nslock', 'node tests/exp-w272c-nslock.mjs', ['tests/out/nslock-w272c.json'], 688, { secSource: 'w281a-chain' }),
  S('plutostates', 'node tests/exp-w277a-plutostates.mjs', ['tests/out/plutostates-w277a.json'], 1),
  // ---- 常時群(calaudit 系と署名の後段): 領域が一致しても**毎回走らせる**
  // 第284便f(R94): ① 通常走行は**プリセット分割**(2 分割 —— 重い 4 本は 2 本ずつ別の分割へ)。分割した ①・dt3・kf0 の鎖で作った正本が
  //   直列の鎖の正本(2a4af53)と、物理欄を含めて一致することを第284便f で実測(除外 Pointer・測定コードの sha・壁時計から作る未宣言の欄
  //   〔budgetHit・diag の h4Store の壁時計と時刻〕の外の差 0 —— tests/data-w284f-calsplit.json)。静かな容器で ① 1411 s(各本の壁時計の和 2629 s)。
  //   重い本は 1 段 500〜830 s・壁時計の資源上限 900 s —— **容器が他の走行で混んでいるときは分割しても資源上限に当たりうる**(workers = 分割数)
  S('calaudit', 'node tools/calaudit-split.mjs --k 2 --harness tests/exp-w249b-calaudit.mjs --', ['tests/out/calaudit-w249.json', 'tests/out/calaudit-w249-diag.json'], 3724, { alwaysRun: true, workers: 2,
    volatilePaths: { 'tests/out/calaudit-w249.json': V_CALAUDIT.concat(V_CALAUDIT_META), 'tests/out/calaudit-w249-diag.json': V_CALAUDIT_DIAG } }),
  // 第283便c(原仮定者の裁定(第73報)⑤・統括の検証項目 R86 (ii)(iii)): 常時の dt3 段から `--dt8-registry` を外した(h/8 は明示診断の
  //   入口だけ —— `--dt8-registry` 単独)。dt/4 は前回の正本の同じ契約の h4 を転記する(`--no-h4-reuse` で切る)。
  //   **sec は旧値(第280便の chain の実測 —— dt/8 込み)のまま**:再測定するまで書き換えない(dt/8 の段の和は第282便の正本で 544 s)
  // 第283便e: dt3・kf0 は --merge で calaudit の 2 ファイルを書き戻す(merges —— 読む段はこの 2 段の後に置く)
  // 第284便f(R94): dt3・kf0 は**プリセット分割**(2 分割・tools/calaudit-split.mjs)。直列と分割の正本の同一性は第284便f で実測(dt3 472→313 s・kf0 89→60 s・安定 hash 一致・除外 Pointer の外の差 0)。統合時に第284便c の旗(--h4-exceptions / --kf0-h4-exceptions)と合成した
  // 第284便c(原仮定者の裁定(第74報)⑥・AN33・R93): **dt/4 を常時から外した** —— 3 段は例外の登録簿(tests/lib-w283c-calstages.mjs の
  //   H4_EXCEPTIONS)の main の本だけ(`--h4-exceptions`)。登録表の全本の 3 段は明示診断(`--dt4-registry --merge` 単独 —— 鎖に入れない)。
  //   dt/2 は同一便の再走で転記(H2_REUSE_RULE —— ① 通常走行が直前に同じ html で h/2 を置くので、この段の h/2 は転記になる)。
  //   sec は第284便c の枝の実測(一時ファイルへの同じ段 —— 4 コアを他の枝と共有した容器): dt3 112 s(例外 3 本・h/2 は直前の ① から転記・
  //   h/4 は新規〔契約の版を上げたので初回は再取得〕)/ kf0 171 s(5 本の h・h/2 と ❄️ の h/4 をすべて新規 —— --no-h2-reuse --no-h4-reuse。
  //   同一便の再走で h/2 を転記した走行は 139 s)
  S('dt3', 'node tools/calaudit-split.mjs --k 2 --harness tests/exp-w249b-calaudit.mjs -- --h4-exceptions --merge', [], 112, { alwaysRun: true, after: ['calaudit'], secSource: 'w284c-run',
    merges: ['tests/out/calaudit-w249.json', 'tests/out/calaudit-w249-diag.json'], workers: 2,   // 第284便f: プリセット 2 分割(統合時に c の旗と合成)
    note: '第284便c: h/4 は例外の登録簿の本だけ(--h4-exceptions)・同一契約の h4 は転記・h/2 は同一便の再走で転記。旧 --dt3-registry(登録表の全本)は明示診断 --dt4-registry' }),
  S('kf0', 'node tools/calaudit-split.mjs --k 2 --harness tests/exp-w249b-calaudit.mjs -- --kf0-runs --kf0-only --kf0-h4-exceptions --only jupiterGalilean,venusReal,marsMoonsReal,plutoCharonReal,neptuneReal --merge', ['tests/out/kf0-w259d.json'], 171, { alwaysRun: true, after: ['dt3'], secSource: 'w284c-run',
    merges: ['tests/out/calaudit-w249.json', 'tests/out/calaudit-w249-diag.json'], workers: 2,   // 第284便f: プリセット 2 分割(統合時に c の旗と合成)
    note: '第284便c: kF0 の診断コピーの h/4 は例外の登録簿の kf0 の本(plutoCharonReal)だけ(--kf0-h4-exceptions)。5 本すべての h/4 は明示診断 --kf0-dt3。'
      + '第290便b: ❄️ は退役して母集団の外 —— `--only` に名前が残っても job にならない(引数は分割の同一性の実測記録 tests/data-w284f-calsplit.json と同じに保つ)' }),
  S('solarsigma', 'node tests/exp-w262d-solarsigma.mjs', ['tests/out/solarsigma-w262d.json'], 0, { alwaysRun: true, after: ['kf0'] }),
  // 第286便 統合(統括): 📡 D68 の 3 段(第268便a・h/h2/h4・T=10698.816)。QA docs.threeStageD68 ⑥ / docs.d68Decomp が calaudit の門の値・
  //   d68-w280e の再現とビットで突き合わせる正本なのに表に無く、cLight 真値化(第286便b)で 1e-9 動いた値が古いまま残った → 常時群に
  //   (meta を刻まない旧形式の器 —— 計画は毎回 regen。所要は実測で埋める)
  S('d68three', 'node tests/exp-w268a-d68.mjs', ['tests/out/d68-w268a.json'], 900, { secSource: 'w286-estimate', alwaysRun: true, after: ['kf0'],
    note: '第268便a の 3 段(旧形式・meta なし)。docs.threeStageD68 ⑥ と docs.d68Decomp の再現の照合先' }),
  S('stoprule', 'node tests/exp-w270a-stoprule.mjs', ['tests/out/stoprule-w270a.json'], 0, { alwaysRun: true, after: ['kf0'] }),
  S('issues', 'node tests/exp-w272a-issues.mjs', ['tests/out/issues-w272a.json'], 0, { alwaysRun: true, after: ['kf0', 'solarsigma', 'charon-h', 'charon-h2', 'charon-h4', 'nslock'] }),
  // 第287便f(AN69): 器は --check が無いと beta/index.html の生成領域 assessed-table を書く(鎖では --check —— html を読むだけ)。
  //   html を書きうる段として領域を宣言し(htmlWriteMode:'check')、html を書く段の列 obscompare → assessed → samplestatus に並べる
  S('assessed', 'node tests/exp-w273c-assessedtable.mjs --check', ['tests/out/assessed-w273c.json'], 1, { alwaysRun: true, after: ['kf0', 'obscompare'],
    htmlRegions: ['assessed-table'], htmlWriteMode: 'check' }),
  // 第283便e: calaudit-w249.json を読む(meta.inputs)—— 書く段(calaudit・dt3・kf0)の最後の kf0 の後
  S('d0audit', 'node tests/exp-w275b-d0audit.mjs', ['tests/out/d0audit-w275b.json'], 21, { after: ['kf0'] }),
  // ---- ❄️ 対照系列(第281便a: 現行列 C0/C1/C3/C5/C6/S・h4 は C0/C1/C6 だけ・履歴列 C2/C4/C7 は再生成しない)
  S('charon-h', 'node tests/exp-w272b-charon.mjs --stage h', ['tests/out/charon-w272b.json'], 677, { secSource: 'w281a-chain', after: ['kf0'], group: 'charon' }),
  S('charon-h2', 'node tests/exp-w272b-charon.mjs --stage h2', ['tests/out/charon-w272b.json'], 1407, { secSource: 'w272b-wallSec', after: ['charon-h'], group: 'charon' }),
  S('charon-h4', 'node tests/exp-w272b-charon.mjs --stage h4', ['tests/out/charon-w272b.json'], 700, { secSource: 'w272b-wallSec', after: ['charon-h2'], group: 'charon' }),
  S('charon-history', 'node tests/exp-w281a-charonsplit.mjs --rev 53aaa64', ['tests/out/charon-history-w272b.json'], 0, { role: 'history', secSource: 'w281a-chain',
    note: '履歴列は 1 度だけ転記した。**再生成しない**(計画は常に「履歴」)' }),
  // ❄️ D₀ 系列は履歴へ(D₀ の規則が変わるときだけ再走 —— 計画は「履歴」)
  S('charond0', 'node tests/exp-w272b-charon.mjs --stage h --D0 rule && node tests/exp-w272b-charon.mjs --stage h2 --D0 rule && node tests/exp-w272b-charon.mjs --stage h4 --D0 rule',
    ['tests/out/charond0-w275b.json'], 1402, { role: 'history', after: ['kf0'],
      note: 'D₀ の規則(tests/lib-w275b-dsplit.mjs)が変わるときだけ再走する(第281便a)' }),
  S('charonk', 'node tests/exp-w273b-charonk.mjs', ['tests/out/charonk-w273b.json'], 979, { secSource: 'w281a-chain', after: ['kf0'] }),
  // ε 系列は h 段だけ(h2/h4 は領域が同じなら「転記」で残る —— 器の併合規則)
  S('charoneps-h', 'node tests/exp-w272b-charon.mjs --stage h --eps rule', ['tests/out/charoneps-w276b.json'], 212, { secSource: 'w281a-chain', after: ['kf0'],
    volatilePaths: { 'tests/out/charoneps-w276b.json': META_RUN.concat(['/columns/*/h/wallSec', '/columns/*/h2/wallSec', '/columns/*/h4/wallSec']) },
    note: '第281便a: 既定は h 段だけ。領域が変わったときは h2/h4 も走らせる(計画が charoneps-h2/h4 を足す)' }),
  S('charoneps-h2', 'node tests/exp-w272b-charon.mjs --stage h2 --eps rule', ['tests/out/charoneps-w276b.json'], 430, { secSource: 'w272b-wallSec', after: ['charoneps-h'], onlyIfScopeChanged: true }),
  S('charoneps-h4', 'node tests/exp-w272b-charon.mjs --stage h4 --eps rule', ['tests/out/charoneps-w276b.json'], 847, { secSource: 'w272b-wallSec', after: ['charoneps-h2'], onlyIfScopeChanged: true }),
  S('charonfactors', 'node tests/exp-w276b-charonfactors.mjs', ['tests/out/charonfactors-w276b.json'], 308, { secSource: 'w281a-chain', after: ['charoneps-h', 'charoneps-h2', 'charoneps-h4'] }),
  S('charondfm', 'node tests/exp-w277b-charondfm.mjs', ['tests/out/charondfm-w277b.json'], 76, { secSource: 'w281a-chain' }),
  S('charonwin', 'node tests/exp-w278b-charonwin.mjs', ['tests/out/charonwin-w278b.json'], 87, { secSource: 'w281a-chain' }),
  // ---- 第280便の chain2
  S('sparc', 'node tests/exp-w269c-sparc.mjs', ['tests/out/sparc-w269c.json'], 192, { secSource: 'w281a-chain' }),
  S('cluster', 'node tests/exp-w269d-cluster.mjs', ['tests/out/cluster-w269d.json'], 84, { secSource: 'w281a-chain' }),
  // 第286便f(再生成表の after 検査): galaxydiag は sparc-w269c.json の帯を読んで一致を確かめる(`missingAfter` が検出)—— after に sparc
  S('galaxydiag', 'node tests/exp-w271d-galaxydiag.mjs', ['tests/out/galaxydiag-w271d.json'], 352, { secSource: 'w281a-chain', after: ['sparc'] }),
  S('qsplit', 'node tests/exp-w271c-qsplit.mjs', ['tests/out/qsplit-w271c.json'], 1),
  S('twobody', 'node tests/exp-w272c-twobody.mjs', ['tests/out/twobody-w272c.json'], 8),
  S('rpar', 'node tests/exp-w272c-rpar.mjs', ['tests/out/rpar-w272c.json'], 1),
  S('nslockledger', 'node tests/exp-w273c-nslockledger.mjs', ['tests/out/nslockledger-w273c.json'], 1, { after: ['nslock'] }),
  S('intakeB', 'node tests/exp-w266a-intakeB.mjs', ['tests/out/intakeB-w266a.json'], 0),
  S('confirm2', 'node tests/exp-w267a-confirm2.mjs', ['tests/out/confirm2-w267a.json'], 1, { after: ['kf0', 'solarsigma'] }),
  S('confirm3', 'node tests/exp-w269b-confirm3.mjs', ['tests/out/confirm3-w269b.json'], 0, { after: ['kf0', 'solarsigma'] }),
  S('confirm4', 'node tests/exp-w270b-confirm4.mjs', ['tests/out/confirm4-w270b.json'], 0, { after: ['kf0', 'solarsigma'] }),
  S('declmatch', 'node tests/exp-w271b-declmatch.mjs', [], 0),
  S('solutionid', 'node tests/exp-w271b-solutionid.mjs', [], 0),
  S('derived', 'node tests/exp-w271b-derived.mjs', [], 0),
  S('bhcore', 'node tests/exp-w274e-bhcore.mjs', ['tests/out/bhcore-w274e.json'], 1),
  S('armbar', 'node tests/exp-w274e-armbar.mjs', ['tests/out/armbar-w274e.json'], 0),
  S('sync', 'node tests/exp-w274b-sync.mjs', ['tests/out/sync-w274b.json'], 25),
  S('shapetoy', 'node tests/exp-w274d-shapetoy.mjs', ['tests/out/shapetoy-w274d.json'], 265, { secSource: 'w281a-chain' }),
  S('galaxylite', 'node tests/exp-w274c-galaxylite.mjs', ['tests/out/galaxylite-w274c.json'], 53),
  S('galaxyprof2', 'node tests/exp-w275c-galaxyprof2.mjs', ['tests/out/galaxyprof2-w275c.json'], 22),
  S('meshnod0', 'node tests/exp-w275b-meshnod0.mjs', ['tests/out/meshnod0-w275b.json'], 2),
  S('shapecrit', 'node tests/exp-w275d-shapecrit.mjs', ['tests/out/shapecrit-w275d.json'], 106, { secSource: 'w281a-chain' }),
  S('dyncenter', 'node tests/exp-w275d-dyncenter.mjs', ['tests/out/dyncenter-w275d.json'], 5),
  S('powerball', 'node tests/exp-w275e-powerball.mjs', ['tests/out/powerball-w275e.json'], 3),
  S('kfgate', 'node tests/exp-w275a-kfgate.mjs', ['tests/out/kfgate-w275a.json'], 1),
  S('presetaxes', 'node tests/exp-w275a-presetaxes.mjs', ['tests/out/presetaxes-w275a.json'], 1),
  S('bgfield', 'node tests/exp-w276a-bgfield.mjs', ['tests/out/bgfield-w276a.json'], 1),
  S('d0audit2', 'node tests/exp-w276a-d0audit2.mjs', ['tests/out/d0sites-w276a.json'], 2),
  S('bgpredict', 'node tests/exp-w276a-bgpredict.mjs', ['tests/out/bgpredict-w276a.json'], 1,
    { volatilePaths: { 'tests/out/bgpredict-w276a.json': META_RUN } }),
  S('powerball2', 'node tests/exp-w276c-powerball2.mjs', ['tests/out/powerball2-w276c.json'], 11),
  S('corefield', 'node tests/exp-w276d-corefield.mjs', ['tests/out/corefield-w276d.json'], 187, { secSource: 'w281a-chain' }),
  S('galaxyproto', 'node tests/exp-w276e-galaxyproto.mjs', ['tests/out/galaxyproto-w276e.json'], 467),
  S('nsgrid', 'node tests/exp-w277c-nsgrid.mjs', ['tests/out/nsgrid-w277c.json'], 955),
  S('selfinertia', 'node tests/exp-w277d-selfinertia.mjs', ['tests/out/selfinertia-w277d.json'], 1),
  S('slipaudit', 'node tests/exp-w278c-slipaudit.mjs', ['tests/out/slipaudit-w278c.json'], 0),
  S('nsmode', 'node tests/exp-w278c-nsmode.mjs', ['tests/out/nsmode-w278c.json'], 117, { after: ['nsgrid'] }),   // 第283便e: nsgrid-w277c.json を読む
  S('bgequiv', 'node tests/exp-w278d-bgequiv.mjs', ['tests/out/bgequiv-w278d.json'], 96, { secSource: 'w281a-chain', after: ['bgpredict'],   // 第283便e: bgpredict を読む
    volatilePaths: { 'tests/out/bgequiv-w278d.json': META_RUN.concat(['/elapsedS']) } }),
  S('bgbudget', 'node tests/exp-w277d-bgbudget.mjs', ['tests/out/bgbudget-w277d.json'], 29, { secSource: 'w281a-chain', after: ['bgpredict', 'bgequiv'] }),   // 第283便e
  S('bgcompose', 'node tests/exp-w279c-bgcompose.mjs', ['tests/out/bgcompose-w279c.json'], 2),
  S('bgbudget2', 'node tests/exp-w279c-bgbudget2.mjs', ['tests/out/bgbudget2-w279c.json'], 77, { secSource: 'w281a-chain', after: ['bgpredict', 'bgequiv'],   // 第283便e
    volatilePaths: { 'tests/out/bgbudget2-w279c.json': META_RUN.concat(['/elapsedS']) } }),
  S('sphereKernel', 'node tests/exp-w280b-sphereKernel.mjs', ['tests/out/spherekernel-w280b.json'], 2),
  S('galaxyprof', 'node tests/exp-w274c-galaxyprof.mjs $BASE_HTML beta/index.html', ['tests/out/galaxyprof-w274c.json'], 25, { env: { BASE_HTML: '基点 html(引数)' } }),
  S('needmesh', 'node tests/exp-w274c-needmesh.mjs $BASE_HTML beta/index.html', ['tests/out/needmesh-w274c.json'], 2, { env: { BASE_HTML: '基点 html(引数)' } }),
  S('d68', 'node tests/exp-w280e-d68.mjs', ['tests/out/d68-w280e.json'], 153, { secSource: 'w281a-chain', after: ['d68three'],
    note: '第286便 統合: 第268便a の 3 段(d68-w268a.json)をビット再現の照合先に読む → d68three の後' }),
  // QA の確認順・並列化の実測(統括がフル QA の後に --record —— chain の外。所要は QA 本体に含まれる)
  S('qaorder', 'node tests/exp-w279b-qaorder.mjs --record', ['tests/out/qaorder-w279b.json'], 0, { secSource: 'chain の外(フル QA の後)', outside: true }),
  // 第283便e: cmd は 1 行のシェルでない(部分走行 4 本 + --merge)—— 鎖は「手動の段」として止まる(済み印を置けば進む)
  S('emgrid', 'node tests/exp-w280b-emgrid.mjs(4 部分 + --merge —— 第280便の chain2c と同じ分割)', ['tests/out/emgrid-w280b.json'], 2295, { secSource: 'w281a-chain', node: true, manual: true }),
  // ---- 後段(calaudit と署名の後 —— 読む正本が揃ってから)
  S('kf0ledger-old', 'node tests/exp-w274a-kf0ledger.mjs', ['tests/out/kf0ledger-w274a.json'], 0, { alwaysRun: true, after: ['kf0', 'charon-h', 'charon-h2', 'charon-h4', 'nslockledger', 'galaxydiag', 'calcontract'] }),
  S('kf0ledger', 'node tests/exp-w275a-kf0ledger.mjs', ['tests/out/kf0ledger-w275a.json'], 0, { alwaysRun: true, after: ['kf0', 'charon-h', 'charon-h2', 'charon-h4', 'nslockledger', 'galaxydiag', 'presetaxes', 'calcontract'] }),
  S('charonInput', 'node tests/exp-w280d-charonInput.mjs', ['tests/out/charoninput-w280d.json'], 603, { secSource: 'w281a-chain', after: ['kf0'] }),
  S('geo3', 'node tests/exp-w280c-geo3.mjs', ['tests/out/geo3-w280c.json'], 1016, { secSource: 'w281a-chain', after: ['kf0', 'bgbudget2'],
    env: { W280_BASE: 'beta/_w280_base.html(第280便の基点 d0286cf の beta/index.html —— 項目 g・h の対照)' } }),
  // ---- 第281便 b/c/d の新しい正本(統括が統合時に追記 —— 所要は第281便の統合 chain3 の実測)
  S('galaxychain', 'node tests/exp-w281b-galaxychain.mjs', ['tests/out/galaxychain-w281b.json', 'tests/out/chainledger-w281b.json'], 73, { secSource: 'w281-chain3', node: true,
    volatilePaths: { 'tests/out/galaxychain-w281b.json': META_RUN },   // 第282便 統合: analogy(枝 d)が安定 hash で読む —— 実行時刻だけを除く
    note: '第281便b: 場の契約の一覧・🎋 の連鎖・交換模型の帳簿(chainledger は lib 自身が target —— 同じ器が書く)' }),
  S('rotorledger', 'node tests/exp-w281c-rotorledger.mjs', ['tests/out/rotorledger-w281c.json'], 1, { secSource: 'w281-chain3', node: true,
    note: '第281便c: 条件付き質量台帳・η 対照(html だけを読む・他の正本を読まない)' }),
  // ---- 第282便d(原仮定者の裁定(第72報)⑥・R81): アナロジー便の正本(**galaxychain-w281b.json を読む** —— after に置く。
  //   所要は第282便d の枝の実測 148 秒〔Node 1 本・同じ容器で他の枝と並走〕)
  S('analogy', 'node tests/exp-w282d-analogy.mjs', ['tests/out/analogy-w282d.json'], 148, { secSource: 'w282d-branch', node: true, after: ['galaxychain'],
    note: '第282便d: 場の契約の読み手の再現・中心 spin の応答・🌚 の台帳と回転曲線・🛞 の f=1 台帳(inputs に galaxychain-w281b.json)' }),
  S('strain', 'node tests/exp-w281d-strain.mjs', ['tests/out/strain-w281d.json'], 26, { secSource: 'w281-chain3', node: true, after: ['galaxyproto', 'corefield'],
    note: '第281便d: 2D の渦伸長 0・ひずみ率の診断(inputs に galaxyproto-w276e・corefield-w276d)' }),
  // ---- 第282便a(原仮定者の裁定(第72報)・R77/R78): 較正契約の 3 系統と f=1 の棚卸し(calaudit の後 —— 旧 4 値の区分・門・残差を読む)/
  //   恒星連星 2 本の f=1 移行の前後記録(**履歴** —— 移行は 1 度きり。判定器を --only で 2 回・一時ファイルへ)
  S('calcontract', 'node tests/exp-w282a-calcontract.mjs', ['tests/out/calcontract-w282a.json'], 2, { secSource: 'w282a-branch', after: ['calaudit', 'kf0'],
    note: '第282便a: html の CAL_CONTRACT と内蔵 140 本の宣言・calaudit の旧 4 値の区分を読む(判定は変えない)。kf0ledger 旧/新がこの正本の fEffective を読む' }),
  S('fmigration', 'node tests/exp-w282a-fmigration.mjs', ['tests/out/fmigration-w282a.json'], 391, { role: 'history', secSource: 'w282a-branch', env: { W282A_BASE_REV: '基点(既定 8b05232 —— git show で一時ファイルを作り終了後に削除)' },
    note: '第282便a: ✴️💫 の f=1 移行の前後(基点 8b05232 と移行後の html に判定器を --only --dt3 で 2 回)。**再生成しない**(計画は常に「履歴」)' }),
  // 第284便f: samplestatus は beta/index.html の生成領域と docs/SAMPLE_STATUS を**書く**(outs の外)。html はほぼ全段が読むので、
  //   鎖の中では**単独**で走らせる(exclusive —— ready queue はレーンを全部取り、走行中の段が無いときだけ入れる)
  // 第285便d(原仮定者の裁定(第75報)⑦・統括の検証項目 R100): 観測対実行のグラフの行(beta/index.html の生成領域 obs-compare)を calaudit の
  //   量ごとの行から書く(1 步も走らせない —— Chromium で照合するだけ)。calaudit を書く段(calaudit・dt3・kf0)の最後の kf0 の後・html を書くので
  //   単独(exclusive)・samplestatus(html 全体の後段 —— AN53)の前。領域に時刻・sha を入れない(正本の値が変わったときだけ html が動く)。
  //   常時群には入れない(入力 calaudit の安定 hash と領域 hash で判定 —— 常時群の契約〔lint.regenScope ③〕は変えない)。
  //   所要は第285便d の枝の実測(器の elapsedS 2.0〜2.9 s —— Chromium 1 本・領域 hash の headless 読み込みを含む)
  // 第287便f(AN69): meta を刻まない旧形式の段で html の本文を読む d68three・confirm4 は、html を書く段と順序が無かった(html を書く段の検査 ④ の
  //   after 欠落)。刻印が無い(古くならない)ので**書く段の上流**に置く(末尾の型 —— 書く段が後)。d68three は kf0 の後の 900 s で charon の系列と並走する
  S('obscompare', 'node tests/exp-w285d-obscompare.mjs && node tests/exp-w285d-obscompare.mjs --check', ['tests/out/obscompare-w285d.json'], 3, { after: ['kf0', 'pn1', 'd68three', 'confirm4'],
    secSource: 'w285d-branch', exclusive: true, touches: ['beta/index.html'], htmlRegions: ['obs-compare'],
    volatilePaths: { 'tests/out/obscompare-w285d.json': META_RUN.concat(['/elapsedS']) },
    note: '第285便d: 正本の量ごとの行の転記(判定しない)。枝 b の診断正本 tests/out/pn1-w285b.json があれば obsCompareRows を λ_PN=0 の対照として足す(統合で b の段 pn1 を after に入れた —— 第285便の鎖 2 で pn1 の前に走り check-order が順序違反を出した)' }),
  S('samplestatus', 'node tests/exp-w279a-samplestatus.mjs && node tests/exp-w279a-samplestatus.mjs --check', ['tests/out/samplestatus-w279a.json'], 2, { alwaysRun: true, after: ['kf0', 'charonwin', 'obscompare', 'assessed'],
    exclusive: true, touches: ['beta/index.html', 'docs/SAMPLE_STATUS_v1.45.md'], htmlRegions: ['sample-status'] }),
  // 第288便f(原仮定者の裁定(第78報)AN90・R118): **集約段**。書く段(obscompare → samplestatus)が $REGEN_HTML_STAGE に置いた断片を順に当て、
  //   beta/index.html を 1 回だけ置き換える(断片が合わなければ書かずに rc 1)。常時群(断片が無ければ何もしない —— 所要 1 s 未満)。
  //   html を書くので単独(exclusive)。html 全体を読む下流の段(after に samplestatus を持っていた段)は、この段の後に置く
  S('htmlagg', 'node tools/regen-html-aggregate.mjs', [], 1, { alwaysRun: true, after: ['samplestatus'], secSource: 'w288f-branch',
    exclusive: true, touches: ['beta/index.html'], htmlAggregate: true, htmlInput: 'whole',
    note: '第288便f: 一時出力(領域の断片)の集約 —— 書く段の後・読む段の前で 1 回だけ html を書く' }),
  S('mercury', 'node tests/exp-w280a-mercury.mjs', ['tests/out/mercury-w280a.json'], 284, { secSource: 'w281a-chain', alwaysRun: true, after: ['kf0'] }),
  // ---- 第282便c の新しい正本(html だけを読む・他の正本を読まない —— 所要は器の elapsedS の実測)
  S('dragprofile', 'node tests/exp-w282c-dragprofile.mjs', ['tests/out/dragprofile-w282c.json'], 2, { secSource: 'w282c-run', node: true,
    note: '第282便c: kF0 不感の実測(128 歩 × 2 本)・引きずりプロファイルの純関数の単体試験・診断表(html だけを読む・環境変数なし)' }),
  // ---- 第282便b(第72報 ⑤・R79): geoPN=1 の契約の穴と比較表(水星の正式値を calaudit-w249.json から読む —— calaudit の後)
  // ---- 第283便f(原仮定者の裁定(第72報)⑥・第73報 AN27/AN37・R81): 球状星団アナロジー(💮)の形状の門と対照 5 走行・rayHeavy の lens 除外の
  //   光線の比較(基点 html と今の html —— 内蔵の全本)。他の正本を読まない(galaxychain → analogy の後段に置く)。所要は枝の実測
  S('clusterAnalogy', 'W283F_BASE=beta/_w283_base.html node tests/exp-w283f-cluster.mjs', ['tests/out/cluster-w283f.json'], 658, { secSource: 'w283f-branch', node: true,
    after: ['galaxychain', 'analogy'],
    env: { W283F_BASE: '基点 html(第283便の基点 de9e39b の beta/index.html —— git show で一時ファイルを作り終了後に削除。光線の基点比較 (D)。無ければ (D) を SKIP)' },
    volatilePaths: { 'tests/out/cluster-w283f.json': META_RUN.concat(['/elapsedS', '/runs/*/wallSec', '/runs/*/rateStepsPerSec']) },
    note: '第283便f: 💮 の走行(基準・中心 spin 0・DR なし・N_rep 80/160)と門の判定・台帳・軸比の標本の床・光線(🌚 だけが変わる)・47 Tuc の参照行。'
      + '第284便a から 💮 は凍結写し tests/fixtures/cluster-w283f-preset.json を読む(第283便f の宣言の記録)' }),
  // ---- 第284便a(原仮定者の裁定(第74報)④・R89/R90): 球状星団安定化(💮 の新しい宣言 —— 接触ばね 0・代表粒子の半径・平衡初速・台帳の nTrue/radii)。
  //   門は第283便f のまま(器 exp-w283f の GATES を読む)・代表数 40/80/160 × 個数比 20/10 × 乱数種 3 と対照。前後の「前」に cluster-w283f.json を読む
  //   (clusterAnalogy の後)。子プロセスの並列(W284A_WORKERS・既定 3 —— 結果は並列数に依らない)。所要は枝の実測
  S('clusterStable', 'node tests/exp-w284a-cluster.mjs', ['tests/out/cluster-w284a.json'], 3068, { secSource: 'w284a-branch', node: true,
    after: ['clusterAnalogy'],
    volatilePaths: { 'tests/out/cluster-w284a.json': META_RUN.concat(['/elapsedS', '/runs/*/wallSec', '/runs/*/rateStepsPerSec']) },
    note: '第284便a: 💮 の宣言の照合・E9 の不発火(300 步のビット一致と検出力)・平衡初速の t=0 の量・門の走行 27 本(行列 18・対照 9)・D_A(中心の引きずり支配の目標)・軸比の床' }),
  // 第283便a(原仮定者の裁定(第73報)AN23): geoPN=1 が 1PN の反作用を返すようになり、本器の「本体 = 反作用を返さない旧則」の
  //   前提が消えた —— 正本は旧則の記録として**履歴**へ(再生成しない・計画は常に「履歴」)。新しい契約の実測は geomode(下)
  S('geo1', 'node tests/exp-w282b-geo1.mjs', ['tests/out/geo1-w282b.json'], 1033, { role: 'history', secSource: 'w282b-run', after: ['calaudit', 'kf0'],
    env: { PLAYWRIGHT_CORE_DIR: 'Chromium の Playwright(水星の表と比較表 —— W282B_ENGINE=node なら不要・約 6 倍遅い)' },
    note: '第282便b: 1 歩の表・束縛二体・ブースト・固定源・質量比の走査は Node の vm(本体 + 反作用返しの器の中のコピー)。'
      + '第283便a で**履歴**(geoPN=1 の旧則〔反作用を返さない〕の記録 —— 再生成しない)' }),
  // ---- 第283便a(原仮定者の裁定(2026-09-26 追加)・AN23・R83): geoPN の 2 フラグの導出表・共通化の前後(基点 html と 141 本 × 1/128 歩)・
  //   kF0 走行 37 本の geoPN=1 対 geoPN=2∧kFrame=0・⭐ の前後(html と calaudit のページ側ヘルパだけを読む —— Node だけ・他の正本は読まない)
  // 第285便b(原仮定者の裁定(第75報)⑦・統括の検証項目 R97): kF0 の 1PN が EIH 型(有限質量比の N 体 1PN)になり、本器の (d)
  //   「geoPN=1 は試験粒子形 + 対反作用(Σm·vx=0・近点移動比 1−10ν/3)」と (b) の前後の差(⭐ だけ)の前提が消えた —— 正本は第283便a の
  //   記録として**履歴**へ(再生成しない・計画は常に「履歴」)。新しい kF0 の 1PN の実測は pn1(下)
  S('geomode', 'node tests/exp-w283a-geomode.mjs', ['tests/out/geomode-w283a.json'], 1608, { role: 'history', secSource: 'w283a-branch', node: true,
    env: { W283A_BASE_REV: '基点(既定 de9e39b —— git show で一時ファイルを作り終了後に削除)' },
    volatilePaths: { 'tests/out/geomode-w283a.json': META_RUN.concat(['/elapsedS', '/headless/*/wallSec']) },
    note: '第283便a: 導出表(141 本)・受理器の契約・基点との 1/128 歩のビット比較と署名・kF0 走行 37 本 + 診断コピー 7 本・⭐ の前後'
      + '(1 歩の Σm·vx・束縛二体の近点移動比・本体 6000 步)・☿ と V18。第285便b で**履歴**(kF0 の 1PN が EIH 型へ —— 再生成しない)' }),
  // ---- 第285便b(原仮定者の裁定(第75報)⑦・R97/R98): kF0 1PN 対照便の正本(制御二体の近点移動比・加速度の照合・ラグランジアン・保存量・
  //   kF0 主系列の λ=0/1 対照・水星の ε/dt の分解・geoPN 1/2 の本の前後)。**calaudit-w249.json を読む**(観測の近点移動)—— 書く段の
  //   calaudit・dt3・kf0 の後。所要は第285便b の枝の実測(Node 1 本・他の枝と同じ容器で並走)
  S('pn1', 'node tests/exp-w285b-pn1.mjs', ['tests/out/pn1-w285b.json'], 682, { secSource: 'w285b-branch', node: true, after: ['calaudit', 'dt3', 'kf0'],
    env: { W285B_BASE_REV: '基点(既定 b92ffa1 —— git show で一時ファイルを作り終了後に削除)' },
    volatilePaths: { 'tests/out/pn1-w285b.json': META_RUN.concat(['/elapsedS', '/headless/*/wallSec']) },
    note: '第285便b: kF0 の 1PN(EIH 型)—— 制御二体(R97)・html の Δ と参照実装の照合・Euler–Lagrange・保存量・kF0 主系列の λ=0/1・☄️ の ε/dt・前後' }),
  // ---- 第286便b(原仮定者の裁定(第76報)AN54・AN59・統括の検証項目 R104): kF0 較正の正式判定便の正本(✴️💫✨🌟 の伴星の pnSource の前後・
  //   制御二体の両方源/主星だけ源・☄️ の cLight 真値化と較正専用 ε の要因分解・cLight の従属値の一覧 tests/data-w286b-clight.json と html の照合・
  //   内蔵全本の 1/32 歩のビット比較と署名)。**calaudit-w249.json(観測の近点移動)と pn1-w285b.json(第285便b の比の記録)を読む** —— 書く段の
  //   calaudit・dt3・kf0 と pn1 の後。判定はしない(正式判定は鎖の calaudit)。所要は第286便b の枝の実測(Node 1 本・他の枝と同じ容器で並走)
  S('pnsource286', 'node tests/exp-w286b-pnsource.mjs', ['tests/out/pnsource-w286b.json'], 1249, { secSource: 'w286b-branch', node: true, after: ['calaudit', 'dt3', 'kf0', 'pn1'],
    env: { W286B_BASE_REV: '基点(既定 7822768 —— git show で一時ファイルを作り終了後に削除)' },
    volatilePaths: { 'tests/out/pnsource-w286b.json': META_RUN.concat(['/elapsedS', '/headless/*/wallSec']) },
    note: '第286便b: 伴星の pnSource(✴️💫✨🌟 —— 基点・c 真値で伴星外し・現行の 3 本立て)・制御二体・☄️ の c/ε/dt の要因・cLight の従属値と html・前後' }),
  // ---- 第287便b(原仮定者の裁定(第77報)⑤・AN61・AN75・統括の検証項目 R110): kF0 写しの診断 1 行の正本(制御二体 q=1/10⁻⁴ で、現行の kF0 の EIH と
  //   DFM 経路 geoPN=2・kFrame=κ→0⁺ の極限〔試験粒子形 + 対反作用〕の近点移動の λ 増分 —— 等質量の倍率)と、DFM 版へ EIH を足すときの手順(実装しない)。
  //   **pn1-w285b.json を読む**(第285便b の基点の旧 kF0 則の比 —— 書く段 pn1 の後)。html だけを読む(Node 1 本)。所要は第287便b の枝の実測
  S('eihdiag287', 'node tests/exp-w287b-eihdiag.mjs', ['tests/out/eihdiag-w287b.json'], 20, { secSource: 'w287b-branch', node: true, after: ['pn1'],
    volatilePaths: { 'tests/out/eihdiag-w287b.json': META_RUN.concat(['/elapsedS', '/headless/wallSec']) },
    note: '第287便b: kF0 写しの診断(EIH / 対反作用だけ の近点移動の λ 増分 —— 等質量で約 6 倍・試験粒子の極限で一致)・DFM 版へ EIH を足さない理由と足すときの手順(診断コピーの受入条件 6 つ)' }),
  // ---- 第283便b(原仮定者の裁定(第73報)④・統括の検証項目 R85): 同一天体の家族の差分表と統廃合の候補(html・calaudit の較正母集団・
  //   凍結の写し tests/fixtures/retired-w283b.json を読む —— 1 步も走らせない。所要は第283便b の枝の実測〔Node 1 本・壁時計〕)
  // 第287便f(AN69): families の領域(REGEN_SCOPE の roots)は SAMPLE_STATUS(生成領域 sample-status —— samplestatus が書く)を読む ——
  //   html を書く段の検査 ⑤ が見つけた after 欠落。samplestatus の後に置く(samplestatus は families を読まない —— 循環なし)
  S('families', 'node tests/exp-w283b-families.mjs', ['tests/out/families-w283b.json'], 8, { secSource: 'w283b-branch', node: true, after: ['calaudit', 'dt3', 'kf0', 'samplestatus'],
    touches: ['docs/FAMILIES_v1.45.md'],
    volatilePaths: { 'tests/out/families-w283b.json': META_RUN.concat(['/elapsedS']) },
    note: '第283便b: 家族 21・鍵ごとの差・推定の列・候補(畳まない)・退役 7 本の棚卸し。一覧 docs/FAMILIES_v1.45.md も同じ器が書く(QA docs.families が照合)' }),
  // ---- 第283便b(第73報④・R84): 退役 7 本を名指しする**表の外の器**のうち tests/out に出力が残るもの —— **履歴**として登録する
  //   (再生成しない。退役の本を走らせ直す段を現行の計画に入れない)。退役後も走る器(rotorledger・analogy)は凍結の写しを読む。
  //   凍結の写しそのもの(tests/fixtures/retired-w283b.json —— 器 tests/exp-w283b-retiredfx.mjs が基点 de9e39b から 1 度だけ作る)は
  //   正本ではないので表に載せない(現行の正本の入力なので履歴にもしない)。
  RH('exp-4-67', 'node tests/exp-4-67.mjs', ['tests/out/exp-4-67.json']),
  RH('exp-4-72', 'node tests/exp-4-72.mjs', ['tests/out/exp-4-72.json']),
  RH('exp-4-73', 'node tests/exp-4-73.mjs', ['tests/out/exp-4-73.json']),
  RH('exp-4-75', 'node tests/exp-4-75.mjs', ['tests/out/exp-4-75.json']),
  RH('exp-4-88', 'node tests/exp-4-88.mjs', ['tests/out/exp-4-88.json']),
  RH('exp-coreshell', 'node tests/exp-coreshell.mjs', ['tests/out/coreshell-results.json']),
  RH('exp-coreshell2', 'node tests/exp-coreshell2.mjs', ['tests/out/coreshell2-results.json']),
  RH('exp-coreshell3', 'node tests/exp-coreshell3.mjs', ['tests/out/coreshell3-results.json']),
  RH('exp-coreshell4', 'node tests/exp-coreshell4.mjs', ['tests/out/coreshell4-results.json']),
  RH('exp-coreshell5', 'node tests/exp-coreshell5.mjs', ['tests/out/coreshell5-results.json']),
  RH('exp-coreshell6', 'node tests/exp-coreshell6.mjs', ['tests/out/coreshell6-results.json']),
  RH('exp-coreshell7', 'node tests/exp-coreshell7.mjs', ['tests/out/coreshell7-results.json']),
  RH('exp-coreshell8', 'node tests/exp-coreshell8.mjs', ['tests/out/coreshell8-results.json']),
  RH('exp-coreshell9', 'node tests/exp-coreshell9.mjs', ['tests/out/coreshell9-results.json']),
  RH('exp-coreshell-theory', 'node tests/exp-coreshell-theory.mjs', ['tests/out/coreshell-theory-results.json']),
  RH('exp-darkness', 'node tests/exp-darkness.mjs', ['tests/out/darkness-results.json']),
  RH('exp-darkrotor', 'node tests/exp-darkrotor.mjs', ['tests/out/darkrotor-results.json']),
  RH('exp-factors', 'node tests/exp-factors.mjs', ['tests/out/factors-results.json']),
  RH('exp-ureq', 'node tests/exp-ureq.mjs', ['tests/out/ureq-results.json']),
  RH('seeds', 'node tests/seeds.mjs', ['tests/out/seeds-results.json']),
  RH('exp-w262b-migrate', 'node tests/exp-w262b-migrate.mjs', ['tests/out/w262b-migrate.json']),
  RH('exp-w265d-lfbot', 'node tests/exp-w265d-lfbot.mjs', ['tests/out/lfbot-w265d.json']),
  // ---- 第283便c(第73報 ⑤・R86 (iv)): 重い較正 4 本の粒子数・ms/步・試験粒子契約の検査と判定量の前後(calaudit の後 —— 正本の段別の
  //   壁時計と判定量を読み、判定器を --tp-copy で写しに掛ける —— 一時ファイル)
  // 第284便e(原仮定者の裁定(第74報)AN34): 4 本に試験粒子契約を**宣言して署名**したので、本器の前提(「4 本の宣言は群が相互作用粒子」
  //   —— 写しと並べる (B)(D)・内蔵に宣言 0 本の (C④))が消えた —— 正本は署名前の記録として**履歴**へ(再生成しない・計画は常に「履歴」)。
  //   署名の前後の実測は tpsign(下)
  S('heavy', 'node tests/exp-w283c-heavy.mjs', ['tests/out/heavy-w283c.json'], 368, { role: 'history', secSource: 'w283c-run', after: ['calaudit', 'dt3', 'kf0'],
    env: { PLAYWRIGHT_CORE_DIR: 'Chromium の Playwright(判定器を試験粒子の写しに掛ける (D) —— 残りは Node の vm)' },
    volatilePaths: { 'tests/out/heavy-w283c.json': META_RUN },
    note: '第283便c: 重い 4 本の粒子数・対・質量の内訳・ms/步(全粒子/主要天体だけ/試験粒子の写し)・試験粒子契約の機械検査・判定量の前後。'
      + '第284便e で**履歴**(4 本の署名の前の記録 —— 再生成しない)' }),
  // ---- 第284便e(原仮定者の裁定(第74報)AN34・④・統括の検証項目 R91): 試験粒子契約の署名の前後(基点の calaudit 正本〔git show〕と
  //   いまの calaudit 正本の 4 本 54 量 —— 正本がいまの html の世代でなければ判定器を --only で一時ファイルへ走らせる)/
  //   背景複素決定力 W₀・A₀ の算出表と接続の実測(html だけを読む —— Node だけ・他の正本は読まない)
  S('tpsign', 'node tests/exp-w284e-tpsign.mjs', ['tests/out/tpsign-w284e.json'], 153, { secSource: 'w284e-branch', after: ['calaudit', 'dt3', 'kf0'],
    env: { W284E_BASE_REV: '基点(既定 2a4af53 —— git show で基点の calaudit 正本を一時読み)',
      PLAYWRIGHT_CORE_DIR: 'Chromium の Playwright(正本 calaudit がいまの html の世代でないときだけ —— 判定器を --only で一時ファイルへ。鎖の中では読むだけ)' },
    volatilePaths: { 'tests/out/tpsign-w284e.json': META_RUN.concat(['/elapsedS', '/after/when', '/after/wallSec',
      '/table/presets/*/run/before/wallSec', '/table/presets/*/run/after/wallSec']) },
    note: '第284便e: 🌞💠💍💿 の群を testParticle に署名した前後(量ごとの値・絶対/相対差・区分・門・近点数・壁時計〔機種依存 —— 文書に写さない〕)と '
      + '4 値の差し替え集計。sec は枝の実測(正本が基点の世代で判定器を走らせた —— 鎖の中では正本を読むだけで数秒)' }),
  // 統括(第284便 統合): 段の鍵は表で一意でなければならない —— e の段が第276便a の `bgfield`(bgfield-w276a.json)と同じ鍵で、
  //   ready queue の表(連想配列)で先の段が消え bgfield-w276a.json が刻み直されなかった(ゲート 2 で検出)。`bgfield284` に改名し、--audit に重複の検査を足した
  S('bgfield284', 'node tests/exp-w284e-bgfield.mjs', ['tests/out/bgfield-w284e.json'], 6, { secSource: 'w284e-branch', node: true,
    volatilePaths: { 'tests/out/bgfield-w284e.json': META_RUN.concat(['/elapsedS']) },
    note: '第284便e: p=2 の台帳からの W₀・A₀・∇・∂ₜ の算出(html の dfmComplexMomentsOf と照合)・検算 3 件・4 区分の表・'
      + '💮🌚(share 経路)の未接続と 🔁🌒(meshVelocity)の適用中の実測' }),
  // ---- 第285便a(原仮定者の裁定(第75報)④⑤・統括の検証項目 R95/R96)
  //   contact285: 多粒子の契約 contactMode の単体試験(4 経路・ばねエネルギー・受理)・内蔵 142 本の 1 步(基点 html と —— git show の一時ファイル)・
  //     拘束の反作用の記帳・適用表の前後(基点の宣言をいまのエンジンで)・💍💿 の量ごとの前後(calaudit の正本がいまの html の世代なら読むだけ ——
  //     そうでなければ判定器を --only で一時ファイルへ走らせる〔Chromium〕)。所要は枝の実測(判定器を走らせない場合)
  //   clusterScan: 💮 の宣言の照合(particleRadius・長さ単位・表示半径)・E9 の不発火・第284便a の宣言との力学のビット一致・
  //     走査 36 構成(N_rep 40)と検証(上位 2 + 宣言 × N_rep 320 × 乱数種 3)。子プロセスの並列(W285A_WORKERS・既定 2 —— 結果は並列数に依らない)
  S('contact285', 'node tests/exp-w285a-contact.mjs', ['tests/out/contact-w285a.json'], 282, { secSource: 'w285a-branch', after: ['calaudit', 'dt3', 'kf0'],
    env: { W285A_BASE_REV: '基点(既定 b92ffa1 —— git show で基点 html と基点の calaudit 正本を一時読み)',
      PLAYWRIGHT_CORE_DIR: 'Chromium の Playwright(正本 calaudit がいまの html の世代でないときだけ —— 💍💿 の判定器を --only で一時ファイルへ。鎖の中では読むだけ)' },
    volatilePaths: { 'tests/out/contact-w285a.json': META_RUN.concat(['/elapsedS']) },
    note: '第285便a: contactMode:"none" は E9 の 4 経路を止める(単体試験)・未指定 ≡ normal・fusion/phaseChange 併用の拒否・particleRadius・'
      + '1 步の比較(違う本 ⊆ 宣言した本)・pinned の反作用の記帳・適用表 16 本の前後と normal のまま残す本・💍💿 の量ごとの前後' }),
  // 第286便a(原仮定者の裁定(第76報)⑤・R101〜R103): 💮 を星団スケールへ書き換えたので、第285便a の走査の正本は**履歴**(走らせない ——
  //   器は凍結写し tests/fixtures/cluster-w285a-preset.json を読むように直した・正本は第285便a の宣言の記録)
  S('clusterScan', 'node tests/exp-w285a-cluster.mjs', ['tests/out/cluster-w285a.json'], 4645, { role: 'history', secSource: 'w285a-branch(第286便a から履歴 —— 走らせない)', node: true,
    volatilePaths: { 'tests/out/cluster-w285a.json': META_RUN.concat(['/elapsedS', '/runs/*/wallSec']) },
    note: '第285便a: 💮 の半径の分離(DR 惑星級・恒星は表示比較の仮定・dispMag)・E9 の不発火と検出力・第284便a の宣言との力学のビット一致・'
      + '走査 (a) 半径 bin の診断 → (b) 実効ポテンシャル Φ_eff=Φ̄_E4−½⟨|ū|²⟩ の初期分布 → (c) N_rep 320 × 乱数種 3 の門(門は第283便f のまま)' }),
  // ---- 第286便a(原仮定者の裁定(第76報)⑤・統括の検証項目 R101〜R103・AN60)
  //   jeans286: 動径 Jeans の初期分布の純関数の検算・負の σ² の拒否・html と純関数のビット一致・💮 の t=0・受理器(Node だけ・他の正本を読まない)
  //   clusterScan286: 💮 の星団スケールの宣言の照合(単位の一組・同じ代表率・4 半径の分離)・測定不確かさの床・走査 8 構成(宣言の構成 × 乱数種 3 +
  //     1 因子ずつ)。子プロセスの並列(W286A_WORKERS・既定 2 —— 結果は並列数に依らない)。所要は枝の実測(他の枝と同じ容器で並走)
  S('jeans286', 'node tests/exp-w286a-jeans.mjs', ['tests/out/jeans-w286a.json'], 27, { secSource: 'w286a-branch', node: true,
    volatilePaths: { 'tests/out/jeans-w286a.json': META_RUN.concat(['/elapsedS']) },
    note: '第286便a: σ²=a²{ω_g²−(Ω−ω)²}(35.64)の検算・平衡解なしの拒否・html の jeansSigma2Profile と純関数のビット一致・💮 の Jeans の反復と ∂ₜū の大きさ・受理器の拒否 5 種' }),
  // 第287便a(統括の検証項目 R107・統括が設定した検証仮説「本体半径の漏れの正体」): 走査器 exp-w286a-cluster に**同じ初期状態のコピーから条件を変える**
  //   関数(sameInitCopy・sameInitSeparation)を足したので、第286便a の走査の正本は**履歴**(走らせない —— 第286便a の宣言と別 build の走査の記録)。
  //   同一初期状態の比較の数は段 growth287 の正本(growth-w287a.json の sameInit286)に入る
  S('clusterScan286', 'node tests/exp-w286a-cluster.mjs', ['tests/out/cluster-w286a.json'], 8895, { role: 'history', secSource: 'w286a-branch(第287便a から履歴 —— 走らせない)', node: true, workers: 2,
    volatilePaths: { 'tests/out/cluster-w286a.json': META_RUN.concat(['/elapsedS', '/runs/*/wallSec']) },
    note: '第286便a: 💮 の星団スケール(L16/T12/M35 の単位の一組・同じ代表率・4 半径の分離・vMode jeans)の宣言の照合と走査 8 構成(門は第283便f のまま・D_A と η_mesh)。'
      + '第287便a から**履歴**(走査器に同一初期状態の関数を足した —— 第286便a の走行は別 build で半径を変えていた記録)' }),
  // ---- 第287便a(原仮定者の裁定(第77報)④・統括の検証項目 R107・AN63/AN74): 成長経路の原理コピー 🌰 の走行(順行・逆行・真正面 × 乱数種 3 +
  //   半径の対照)・捕獲の帳簿・門(合体が止んだ後の窓)・D_g と符号つき η_mesh・F_r・摂動後の復元・負の対照(捕獲関数の直接呼び出し)・
  //   💮 の同一初期状態の比較・対照の最小模型の単体試験(Node だけ・html だけを読む —— 他の正本は読まない。子プロセスの並列 W287A_WORKERS・既定 2)
  S('growth287', 'node tests/exp-w287a-growth.mjs', ['tests/out/growth-w287a.json'], 158, { secSource: 'w287a-branch', node: true, workers: 2,
    env: { W287A_WORKERS: '子プロセスの並列数(既定 2 —— 結果は並列数に依らない)' },
    volatilePaths: { 'tests/out/growth-w287a.json': META_RUN.concat(['/elapsedS', '/runs/*/wallSec', '/runs/*/spentSec', '/radiusRun/wallSec', '/radiusRun/spentSec',
      '/speed/growth/*/wallSec', '/speed/growthTotal/wallSec']) },
    note: '第287便a: 🌰 clusterGrowthCopy(自由な中心・中心とだけの捕獲 centerCapture)の門(💮 の閾値・合体が止んだ後の窓)・捕獲の帳簿・D_g/η_mesh/F_r・'
      + '摂動後の復元・負の対照 6 事例・半径の対照(同じ初期状態)・💮 の走査器の同一初期状態の比較・最小模型の単体試験' }),
  // ---- 第288便a(原仮定者の裁定(第78報)⑤・統括の検証項目 R113・AN76/AN77/AN78): 固定中心の合体・離散の原理コピー 🥜 の走行(順行・逆行・真正面 ×
  //   乱数種 3 + R_I=0.01 の対照)・帳簿(M・E の格納残差・J_pin/P_pin の別口座・配分器 lib-w288a-fixcap での作り直し)・門(🌰 と同じ閾値・合体が止んだ後の窓)・
  //   D_g と符号つき η_mesh・摂動後の復元・トイの補償値 E_mesh・負の対照・離散の往復・受理器の事例・半径対照(同じ捕獲列)。🌰 の正本 growth-w287a.json を
  //   **読むだけ**(同じ鍵の走行と並べる —— after growth287)。Node だけ・子プロセスの並列 W288A_WORKERS・既定 2
  S('fixcap288', 'node tests/exp-w288a-fixcap.mjs', ['tests/out/fixcap-w288a.json'], 175, { secSource: 'w288a-branch(W288A_WORKERS=3 で 129 s —— 既定 2 の見積り)', node: true, workers: 2,
    after: ['growth287'],
    env: { W288A_WORKERS: '子プロセスの並列数(既定 2 —— 結果は並列数に依らない)' },
    volatilePaths: { 'tests/out/fixcap-w288a.json': META_RUN.concat(['/elapsedS', '/runs/*/wallSec', '/runs/*/spentSec', '/radiusRun/wallSec', '/radiusRun/spentSec']) },
    note: '第288便a: 🥜 fixedCaptureCopy(🌰 と同じ初期状態・中心 pinned・fixedCapture w288a-fixcap-1)の門(🌰 の閾値・合体が止んだ後の窓)・帳簿(E の格納残差・J_pin・P_pin・'
      + '配分器での作り直し)・D_g/η_mesh/F_r・摂動後の復元・E_mesh・負の対照 9 事例 + 超過からの放出・離散の往復(h=0)・受理器 14 事例・半径対照・🌰 の正本と並べる' }),
  // ---- 第285便c(原仮定者の裁定(第75報)⑥・統括の検証項目 R99): 背景場の微分の算出可否と宣言の型 bgModel(html の純関数と受理器だけを読む ——
  //   Node だけ・1 步も走らせない・他の正本は読まない)
  S('bgderiv', 'node tests/exp-w285c-bgderiv.mjs', ['tests/out/bgderiv-w285c.json'], 1, { secSource: 'w285c-branch', node: true,
    volatilePaths: { 'tests/out/bgderiv-w285c.json': META_RUN.concat(['/elapsedS']) },
    note: '第285便c: 同じ (W₀,A₀) で微分が違う反例・一様凍結の宣言(微分は宣言による 0)・背景源の台帳からの全項・遠方 1 源の閉じた式の一致・'
      + '単位の指数・無限一様の発散・判定表・受理器の事例' }),
  // ---- 第286便c(原仮定者の裁定(第76報)・第76報で閉じた AN7′/AN47/AN56): 背景場の解析微分と中心差分の照合・背景の法則版(share-p1/complex-p2)の
  //   受理と接続の診断コピー(Node だけ・html だけを読む —— 他の正本は読まない)
  S('bgdiff286', 'node tests/exp-w286c-bgdiff.mjs', ['tests/out/bgdiff-w286c.json'], 3, { secSource: 'w286c-branch', node: true,
    volatilePaths: { 'tests/out/bgdiff-w286c.json': META_RUN.concat(['/elapsedS']) },
    note: '第286便c: ∇W・∇A・∂ₜW・∂ₜA と合成 u の ∇u・∂ₜu を中心差分 h・h/2・h/4 で照合(次数 2)・並進基準系・W→0・W=0 の未定義・'
      + '法則版の受理器・share-p1(💮 の縮小写し 3 つ)と complex-p2(🔁 の写し)の接続と帳簿・geoPN=1 と geoPN=2∧kFrame=0 の 400 步' }),
  // ---- 第287便c(原仮定者の裁定(第77報)⑤・統括の検証項目 R109): 背景場の時間発展の契約(timeContract)—— 反例の再現・時間差分と返却 ∂ₜu の照合・
  //   🌒 の前後(周期 2 周目・kF0 の写し・taylor の採らない形)・share-p1 の基準コピー(🪁 と 600 步のビット一致)。Node だけ・html だけを読む(他の正本は読まない)
  S('bgtime287', 'node tests/exp-w287c-bgtime.mjs', ['tests/out/bgtime-w287c.json'], 110, { secSource: 'w287c-branch', node: true,
    volatilePaths: { 'tests/out/bgtime-w287c.json': META_RUN.concat(['/elapsedS']) },
    note: '第287便c: 状態を固定して評価時刻だけ進めたとき u と ∂ₜu が一致するか(旧い契約の反例と新しい契約)・時間差分 h・h/2・h/4(次数 2・器の丸め床)・'
      + 'RHS の coordAccel・範囲の外の再展開・受理器・🌒 の周期の前後と η_bg・share-p1 の基準コピー' }),
  // ---- 第288便c(原仮定者の裁定(第78報)⑧・第78報で閉じた AN84/AN86・統括の検証項目 R115): 背景場と総当たり便
  //   (Node だけ・html だけを読む —— 他の正本は読まない。基点 html〔W288C_BASE〕は任意の照合 —— 無ければ宣言値)
  S('bgrange288', 'node tests/exp-w288c-bgrange.mjs', ['tests/out/bgrange-w288c.json'], 12, { secSource: 'w288c-branch', node: true,
    volatilePaths: { 'tests/out/bgrange-w288c.json': META_RUN.concat(['/elapsedS']) },
    note: '第288便c: taylor の契約の再展開の out 旗(反例 3 件 widthT+1・−widthT−1・空間と時間の両超過 —— 基点 0/3 → 3/3・対照 2 件)・'
      + '🌒 の sources 経路の前後のビット同一・有効幅を超えた步の数と観測比較の旗「契約範囲外」(再展開しない)・棚卸し' }),
  S('compose288', 'node tests/exp-w288c-compose.mjs', ['tests/out/compose-w288c.json'], 5, { secSource: 'w288c-branch', node: true,
    volatilePaths: { 'tests/out/compose-w288c.json': META_RUN.concat(['/elapsedS']) },
    note: '第288便c: 診断コピー 🧩 と 🌚 のビット同一・共通評価器(中心 1 回・静止した中心だけなら u=0・A_spin の inline は場の契約とビット一致/'
      + 'separate は丸めの差・単位 p=1/p=2)・回転核の候補(解析勾配の次数 2・面内の J と r で z だけ・双極子の力とトルク・比較器 —— 足さない)' }),
  S('pairfuse288', 'node tests/exp-w288c-pairfuse.mjs', ['tests/out/pairfuse-w288c.json'], 300, { secSource: 'w288c-branch', node: true,
    volatilePaths: { 'tests/out/pairfuse-w288c.json': META_RUN.concat(['/elapsedS',   // 統合(第288便): 壁時計は off/on の下の数の葉 wallSec(lint.stableHashPaths ② —— 最後の鍵は語彙・値は有限の数)
      '/short/rows/*/off/wallSec', '/short/rows/*/on/wallSec', '/growth/rows/*/off/wallSec', '/growth/rows/*/on/wallSec', '/growth/off/wallSec', '/growth/on/wallSec',
      '/speed/growth/off/wallSec', '/speed/growth/on/wallSec', '/speed/jeans/off/wallSec', '/speed/jeans/on/wallSec',
      '/jeans/rows/*/off/wallSec', '/jeans/rows/*/on/wallSec', '/jeans/off/wallSec', '/jeans/on/wallSec']) },
    note: '第288便c: pair 巡回の融合(非順序対の s・1/√s・s^{−p/2} を 1 回だけ作り両巡回で再利用・加速度確定後の第 2 巡回は残す)の受入 ——'
      + ' 🌚💮🌰(融合)と 🪁(対照)の OFF/ON と基点のビット同一・🌰 の門の走行 3 本の OFF/ON の結果一致と壁時計・💮 の Jeans 走行 3 本は宣言値(W288C_FULL=1 で測り直す)' }),
  // ---- 第288便d(原仮定者の裁定(第78報)⑥・統括の検証項目 R116): スピン・歳差・熱の口座(node 模型・**エンジン未接続**)——
  //   上限の連鎖の時系列と閉形式・旗の負の対照・剛体対照(lib-w275e-powerball・lib-w276c-axiswork)・周波数ロックの正逆と γ=0 の非収束。
  //   html は dfmCoreAxisStep・coreAxisState のソースと 🪩 bhCoreTilt の宣言を文字列で読むだけ(領域 3 名 + 1 本)。他の正本は読まない
  S('spinprec288', 'node tests/exp-w288d-spinprec.mjs', ['tests/out/spinprec-w288d.json'], 1, { secSource: 'w288d-branch', node: true,
    volatilePaths: { 'tests/out/spinprec-w288d.json': META_RUN.concat(['/elapsedS']) },
    note: '第288便d: 口座 E_spin/E_axis/E_prec/Q の恒等式・上限の連鎖(スピン → 傾き → 歳差 → スピン → 旗)・W_drive<0・θ=90° の分離・剛体対照・'
      + '熱 = ミクロのスピン・ロックの小模型(正逆・独立な初期位相・γ=0・K=0)・dfmCoreAxisStep が φ(t) を外から指定すること' }),
  // ---- 第288便e(原仮定者の裁定(第78報)⑦・統括の検証項目 R117・AN79): 軸傾きと 90° BH —— 🛸(🌚 の軸を 90° に倒した原理コピー)の現行法則の実測
  //   (J_z・符号つき η_mesh・🌚 の spin 0 とのビット一致)・歳差が担う面内の引きずりの候補(立体核・層数・Ω_p・換算式 —— 純関数)・比較器・
  //   点粒子の自転軸の表示専用の宣言 spinAxis(受理・署名・📻 の状態のビット一致)。Node だけ・html だけを読む(他の正本は読まない)。
  //   所要は第288便e の枝の実測 256 秒(Node 1 本・同じ容器で他の枝と並走)
  S('tilt90288', 'node tests/exp-w288e-tilt90.mjs', ['tests/out/tilt90-w288e.json'], 256, { secSource: 'w288e-branch', node: true,
    volatilePaths: { 'tests/out/tilt90-w288e.json': META_RUN.concat(['/elapsedS', '/runs/*/wallSec']) },
    note: '第288便e: 🛸 galaxyAnalogyBHTilt90 の宣言の照合・7 走行(T=48)の J_z/η_mesh/軸の状態/拘束の帳簿/状態の指紋・中心の自転の寄与(t=0 の η 差)・'
      + '立体核の候補(1 層の対照・上下の打ち消し・z 微分・層数 1→32・Ω_p 0/宣言/2 倍・J_z,eff と s_eff)・場の契約の読み手との比較器・spinAxis の受理と署名' }),
  // ---- 第289便d(原仮定者の裁定(第79報)で閉じた AN95/AN96/AN97・統括の検証項目 R122): 離散の後の慣性半径の状態引き継ぎ(再現・2 回連続の離散・
  //   離散の後の捕獲・超過からの離散・⏮)・第288便a の正本の離散の行の引き直し・ΔE_self の口座の意味・異方的剛体の E_rot(lib-w288d の純関数 ——
  //   エンジン未接続)。🥜 の正本 fixcap-w288a.json を**読むだけ**(after fixcap288)。Node だけ・1 步もエンジンを積分しない。
  //   基点 html(W289D_BASE)は任意の照合 —— 無ければ宣言値 BEFORE_AE29
  S('ejectstate289', 'node tests/exp-w289d-ejectstate.mjs', ['tests/out/ejectstate-w289d.json'], 1, { secSource: 'w289d-branch', node: true,
    after: ['fixcap288'],
    volatilePaths: { 'tests/out/ejectstate-w289d.json': META_RUN.concat(['/elapsedS']) },
    note: '第289便d: dfmFixedEject の成功後に S.fixcap.rInertia を R_a へ引き継ぐ修正の前後(状態から読む I′・E′ = イベントの値・イベントをまたぐ連続・'
      + '捕獲が新しい R_I を読む・⏮ で宣言へ)・fixcap の正本の離散の行(往復・超過・負の対照)のビット同一・ΔE_self = ΣU_pair の口座・rotEnergyAniso の単一軸/対称こま/三軸' }),
  // ---- 第290便d(原仮定者の裁定(第80報)②・統括の検証項目 R128): チェックポイントの保存/復元が固定中心の状態 S.fixcap を運ぶ修正の回帰
  //   (再現・超過の捕獲 + 離散の保存/復元/再走・宣言した歩の離散の時刻・2 回連続の離散の後の I′/E′・A/B の写しの不変と B 側の保存/復元)と
  //   再開保存(保存 JSON → loadSave)の棚卸し(表だけ —— 実装しない)。Node だけ・html だけを読む(他の正本は読まない)。
  //   第289便d の離散の器の後に並べる(同じ 🥜 の写しの宣言を使う —— 読む正本は無い)。基点 html(W290D_BASE)は任意の照合 —— 無ければ宣言値 BEFORE_F03
  // ---- 第291便b(原仮定者の裁定(第81報)⑤・統括の検証項目 R133): kF0 の 1PN の源集合(全質量源)の器 —— 内蔵全本の源の表と基点 cf2da0a との
  //   前後(ビット・署名)・html の Δ + 試験粒子形と参照 EIH の照合・半径だけを変えた回帰・🥶 の残差の分解(閉じた式と 1PN の桁)・表示条件の集計。
  //   html と lib だけを読む(正本は読まない —— Node 1 本・基点は git show の一時ファイル)。所要は第291便b の枝の実測
  S('pnsources291', 'node tests/exp-w291b-pnsources.mjs', ['tests/out/pnsources-w291b.json'], 208, { secSource: 'w291b-branch', node: true,
    env: { W291B_BASE_REV: '基点(既定 cf2da0a —— git show で一時ファイルを作り終了後に削除)' },
    volatilePaths: { 'tests/out/pnsources-w291b.json': META_RUN.concat(['/elapsedS', '/headless/*/wallSec']) },
    note: '第291便b: kF0 の 1PN 源 = 全質量源(半径門は光線描画の省略基準)—— 源が増えた本の列挙・前後の差は源が増えた本だけ・参照 EIH と 1e−12・半径回帰・🥶 の閉じた式 +7.2168 s と 1PN の桁' }),
  S('ckfixcap290', 'node tests/exp-w290d-ckfixcap.mjs', ['tests/out/ckfixcap-w290d.json'], 2, { secSource: 'w290d-branch', node: true,
    after: ['ejectstate289'],
    volatilePaths: { 'tests/out/ckfixcap-w290d.json': META_RUN.concat(['/elapsedS']) },
    note: '第290便d: ckSnapOne/ckRestoreOne が S.fixcap(R_I・stepN・回数・口座・ログ)を深い写しで保存/復元する修正の前後(基点 f03bf5a の宣言値)・'
      + '超過の捕獲 + 離散の再走のビット一致(系譜 id は別に数える)・atStep の時刻・A/B の写しの不変・保存 JSON/チェックポイント/A/B 複製/build の棚卸し' }),
  // ---- 第289便a(原仮定者の裁定(第79報)⑤・統括の検証項目 R119): 理論照合便 —— 時計・光の弱場係数(現行 E7R/E8R・文字どおりの反比例・第 3 案〔実装しない〕)の
  //   一次係数・相対移動 r⁻³ 核の限定模型(Δϖ の解析と RK4・r 依存)・現行実装の実測(gclock の写しで tauUpdate と traceRay を 1 回ずつ)・
  //   式の綴りの読み・枠の重みの棚卸し(全プリセット —— presets "all")・🛰 の式レベル出力 HP.grSI の引用。Node だけ・html だけを読む(他の正本は読まない)。
  //   所要は第289便a の枝の実測(正本の elapsedS 1.3〜1.6 秒 —— Node 1 本・同じ容器で他の枝と並走)
  S('weakfield289', 'node tests/exp-w289a-weakfield.mjs', ['tests/out/weakfield-w289a.json'], 2, { secSource: 'w289a-branch', node: true,
    volatilePaths: { 'tests/out/weakfield-w289a.json': META_RUN.concat(['/elapsedS', '/engine/rays/*/wallSec']) },
    note: '第289便a: 弱場の一次係数(静止時計の率・光偏向〔直線経路の求積と光線方程式の RK4〕・シャピロ)を 3 案で解析と相対 1e-6・'
      + 'r⁻³ 核の近点移動の解析 2π(√((1+a)/(1−2a))−1) と RK4・GR との r 依存の比・現行 tauUpdate/traceRay の実測(Float32 の 2 ulp・相対 1e-4)・式の綴り・枠の重みの棚卸し' }),
  // ---- 第289便c(原仮定者の裁定(第79報)⑤・第79報で閉じた AN98/AN99・統括の検証項目 R121): 複素核便 —— 純関数と比較器だけ(**エンジン未接続**)。
  //   reldrag289 は html を読まない(target = 純関数 tests/lib-w289c-reldrag.mjs —— 領域の宣言なし)。nearfar289 は html を読み(領域 REGEN_SCOPE)、
  //   第288便c の正本 compose-w288c.json の r=20 の 2 値を再現の照合に読む(inputs に載る —— compose288 の後)
  S('reldrag289', 'node tests/exp-w289c-reldrag.mjs', ['tests/out/reldrag-w289c.json'], 1, { secSource: 'w289c-branch', node: true,
    volatilePaths: { 'tests/out/reldrag-w289c.json': META_RUN.concat(['/elapsedS']) },
    note: '第289便c: 相対移動 r⁻³ 核(前ステップ参照)の不変性 6 項と一致点の拒否・2 体の漸化式(a=0.2/0.5/0.8 の収束・振動・発散)と dt を半分にした対照・'
      + '対策 3 案(実装しない)・3 環の連鎖の対照(全結合/媒介を切る/直接を切る)・環数 3→6・代表粒子の数' }),
  S('nearfar289', 'node tests/exp-w289c-nearfar.mjs', ['tests/out/nearfar-w289c.json'], 2, { secSource: 'w289c-branch', node: true, after: ['compose288'],
    volatilePaths: { 'tests/out/nearfar-w289c.json': META_RUN.concat(['/elapsedS']) },
    note: '第289便c: 有限サイズ回転源の手前/反対の核(d≤R の拒否・遠方の冪 −4 と rotlet 型 −2)・🧩 の r=20 で第288便c の 3.43/0.725 を再現してから並べる・'
      + '門(🧩 の 0/150/300 步の全自由粒子で C=0 なら既存の u とビット同一・C≠0 で動く・状態不変)' }),
  // ---- 第289便b(原仮定者の裁定(第79報)③で閉じた AN100・統括の検証項目 R120): **契約範囲外の評価器**を内蔵の走行に掛ける ——
  //   🌒 の 2 周(宣言の widthT —— 範囲内)・有効幅を縮めた器の中の写し(契約範囲外 → 保留)・geoPN=3 の 🔁🩻 の 2 周(範囲外の步 0 —— 宣言なし)・
  //   timeContract の棚卸し。Node だけ・html だけを読む(他の正本は読まない —— calaudit の後に置かない)。判定器の行の属性 contractRange は calaudit の段が書く
  S('contractrange289', 'node tests/exp-w289b-contractrange.mjs', ['tests/out/contractrange-w289b.json'], 10, { secSource: 'w289b-branch', node: true,
    volatilePaths: { 'tests/out/contractrange-w289b.json': META_RUN.concat(['/elapsedS']) },
    note: '第289便b: 背景の時間の契約の範囲外の步(S.meshVelTimeOutSteps)を評価器(lib-w289b-contractrange —— calaudit と同じ 1 本)に通す:'
      + ' 🌒 の 2 周は範囲内・有効幅 3000 の写しは契約範囲外で保留(軌道はビット同一)・🔁🩻 は 2 周で範囲外の步 0(宣言なし)・timeContract の宣言は 🌒 だけ' }),
  // ---- 第289便e(原仮定者の裁定(第79報)AN105/AN106・統括の検証項目 R123): 親子コア便 —— 🪆(🛸 の中心を親子コアの層に置き直した診断コピー)の
  //   宣言の照合(🛸 の写し・HP.coreV2ToLayers と同じ層)・11 走行(T=48)の步ごとの指紋の照合(層の軸の対照 6 本・層の差分 S._layerForce を器の中だけで
  //   外した対照)・最初の層の近傍キックの步・変換の往復(JSON 形と実行状態形)・層の軸の宣言欄の受理。Node だけ・html だけを読む(他の正本は読まない)。
  //   🛸 の実測の段 tilt90288 の後に置く(同じ 🛸🌚 を読む —— 並べて読む表の順)。所要は第289便e の枝の実測 135 秒(Node 1 本・同じ容器で他の枝と並走)
  S('tilt90layers289', 'node tests/exp-w289e-tilt90layers.mjs', ['tests/out/tilt90layers-w289e.json'], 135, { secSource: 'w289e-branch', node: true, after: ['tilt90288'],
    volatilePaths: { 'tests/out/tilt90layers-w289e.json': META_RUN.concat(['/elapsedS', '/runs/*/wallSec']) },
    note: '第289便e: 🪆 の宣言の照合・11 走行の步ごとの指紋(層の軸 0/90°・方位・歳差 0/2 倍・層の J の有無は全步一致/🛸 とは最初の層の近傍キックの步から食い違い・'
      + '差分を外すと 🛸 と全步一致)・変換の往復(t=0/24)・融合の合算規約・層の軸の宣言欄の受理' }),
  // ---- 第290便c(原仮定者の裁定(第80報)⑥・統括の検証項目 R127): 慣性引きずり便 —— 法則版 physics.relativeDrag.law:"inertial"(宣言した本だけの別経路)の
  //   門 b〜f(gain:0 と宣言なしの全標本ビット同一・固定配置で第289便c の純関数とビット同一・Δt 不変性・2 体の前ステップ参照の収束/振動/発散と上界・
  //   自己項/共通並進/1 体/一致点/チェックポイントの復元と複製)と診断本 🐌 の Δϖ(gain 3 点・限定模型)・上界・帳簿・dt 半分。
  //   Node の headless(html だけを読む —— 他の正本は読まない)。純関数 tests/lib-w289c-reldrag.mjs を code[] に持つので reldrag289 の後に置く(並べて読む表の順)
  S('inertial290', 'node tests/exp-w290c-inertial.mjs', ['tests/out/inertial-w290c.json'], 4, { secSource: 'w290c-branch', node: true, after: ['reldrag289'],
    volatilePaths: { 'tests/out/inertial-w290c.json': META_RUN.concat(['/elapsedS']) },
    note: '第290便c: 法則版 inertial の門(gain:0 のビット同一 4 本・固定配置で relDragAt とビット同一・Δt 不変・2 体 a=0.2/0.5/0.8 の収束/振動/発散と上界 ≥1 の步・'
      + '自己項 0・並進不変・1 体・一致点の拒否・復元/複製)と 🐌 の近点移動(gain 0.4/0.8/1.6・限定模型 ẋ=v/(1+a) の RK4)・帳簿(外部支持の仕事)・dt 半分' }),
  // ---- 第290便e(原仮定者の裁定(第80報)⑤・統括の検証項目 R129): 渦巻の参照模型 2 本(🍭 shapeToySpiral・🎢 shapeToySpiralCore)の門 ①〜⑦ ——
  //   成分の割り当て・単独の本(🥏🧵📀🧹)の同じ窓の値との比・ピッチ角の直交回帰・N/2N/4N/seed/刻み・Ω_p=0・G/中心スピンの不変性・往復と所要。
  //   Node だけ・html だけを読む(他の正本は読まない)。形状トイ(shapetoy)と Core 力学(corefield)の段の後に置く(同じ 🥏🧵📀🧹 を並べて読む表の順)。
  //   所要は第290便e の枝の実測 171 秒(Node 1 本・同じ容器で他の枝と並走)
  S('spiral290', 'node tests/exp-w290e-spiral.mjs', ['tests/out/spiral-w290e.json'], 171, { secSource: 'w290e-branch', node: true, after: ['shapetoy', 'corefield'],
    volatilePaths: { 'tests/out/spiral-w290e.json': META_RUN.concat(['/elapsedS', '/gate7/timing/rows/*/wallSec', '/gate7/timing/rows/*/rateStepsPerSec']) },
    note: '第290便e: 🍭🎢 の宣言(shape:"spiral")・成分の数/質量/重複所属・軸比/横断/厚さを 🥏🧵📀🧹 と比べる・ピッチ角(φ−Ω_p t と ln r の直交回帰)・'
      + 'N/2N/4N・seed・刻み・Ω_p=0・G と中心スピンに対する腕成分の不変性・宣言の往復・⏮・チェックポイント・A/B・1 步の所要' }),
  // ---- 第291便d(原仮定者の裁定(第81報)⑥・統括の検証項目 R135): 背景の精査 —— 新しい慣性決定力の核が D₀・Wbg・backgroundComplex・spaceMesh.D0・q・自転を
  //   読まないこと(固定配置で 1 步の u がビット同一)・共通並進/一様加速度は消え回転/潮汐は残ること・旧正規化 u=A/W 型の場では Wbg が分母に残ること・
  //   走行中の 🐌 と 🌚🌒 の診断コピーで標本の V に共通の c を足しても u が丸め床以内・核と wbgStateOf の静的な参照。
  //   Node の headless(html だけを読む —— 他の正本は読まない)。核の器 inertial290 の後に置く(同じ 🐌 を並べて読む表の順)。所要は第291便d の枝の実測 2.7 秒
  S('bgaudit291', 'node tests/exp-w291d-bgaudit.mjs', ['tests/out/bgaudit-w291d.json'], 3, { secSource: 'w291d-branch', node: true, after: ['inertial290'],
    volatilePaths: { 'tests/out/bgaudit-w291d.json': META_RUN.concat(['/elapsedS']) },
    note: '第291便d: 背景の精査表(D₀・Wbg・backgroundComplex・共通並進・一様加速度・回転・潮汐)—— 新核は背景を読まない(固定配置で u がビット同一 8 宣言)・'
      + '2 進の配置で共通並進がビット同一・走行中の 🐌🌚🌒 で丸め床以内・旧正規化の場の Wbg 依存と ∇D の不変・核と wbgStateOf の静的な参照' }),
];

/**
 * 第285便f(原仮定者の裁定(第75報)AN53): **html 全体を刻む段**(正本の meta.target が beta/index.html・完全な領域の宣言なし —— 第285便f の
 * 基点 b92ffa1 の正本の meta から機械で数えた 27 段)。samplestatus(beta/index.html の生成領域を書く)の**後**に置く。
 * samplestatus の上流(calaudit・dt3・kf0・charonwin)と、samplestatus が読む正本の書き手は含めない(循環を作らない)。
 * 検出は `tableDepsAudit` の `beforeSamplestatus`(正本の meta から引き直す —— 新しい段が足されても見落とさない)。
 */
export const W285F_AFTER_SAMPLESTATUS = ['bh90', 'd0audit', 'qsplit', 'twobody', 'rpar', 'nslockledger', 'bhcore', 'galaxylite', 'galaxyprof2',
  'meshnod0', 'kfgate', 'presetaxes', 'bgfield', 'd0audit2', 'bgpredict', 'selfinertia', 'slipaudit', 'bgbudget', 'bgcompose', 'sphereKernel',
  'galaxyprof', 'needmesh', 'kf0ledger-old', 'kf0ledger', 'galaxychain', 'rotorledger', 'strain'];
for (const st of REGEN_STEPS) if (W285F_AFTER_SAMPLESTATUS.includes(st.key) && !(st.after || []).includes('samplestatus')) st.after = (st.after || []).concat(['samplestatus']);
// 第288便f(AN90): samplestatus の後に置いた段(書いた後の html・一覧 md を読む)は、集約段 htmlagg の後へ(html は集約段が 1 回だけ書く)
for (const st of REGEN_STEPS) if (st.key !== 'htmlagg' && (st.after || []).includes('samplestatus') && !(st.htmlRegions || []).length && !(st.after || []).includes('htmlagg')) st.after = st.after.concat(['htmlagg']);

/**
 * 第285便f(AN53): html 全体を刻む現行の段(正本の meta から —— target が beta/index.html で scopeComplete の領域が無い)。
 * @param {{root:string, steps?:Array, metaOf?:Function}} o
 */
export function htmlWholeSteps(o) {
  const steps = (o && o.steps) || REGEN_STEPS;
  const metaOf = (o && o.metaOf) || ((f) => readMetaAt(o.root, f));
  return steps.filter((st) => st.role !== 'history' && !st.outside && (st.outs || []).some((f) => {
    const m = metaOf(f);
    return !!(m && m.target === 'beta/index.html' && !(m.scope && m.scopeComplete === true));
  })).map((st) => st.key);
}
/**
 * 第285便f(AN53): samplestatus の上流(after の閉包)と、samplestatus が読む正本(meta.inputs[]・inputsStable[])の書き手とその閉包 ——
 * ここに入る段には `after:['samplestatus']` を足さない(循環)。
 */
export function samplestatusUpstream(o) {
  const steps = (o && o.steps) || REGEN_STEPS;
  const C = afterClosure(steps);
  const W = writersMap(steps);
  const metaOf = (o && o.metaOf) || ((f) => readMetaAt(o.root, f));
  const up = new Set(C.get('samplestatus') || []);
  const ss = steps.find((z) => z.key === 'samplestatus');
  for (const f of ((ss || {}).outs || [])) {
    const m = metaOf(f);
    if (!m) continue;
    for (const z of [...(m.inputs || []), ...(m.inputsStable || [])]) for (const w of (W.get(z.file) || [])) {
      if (w === 'samplestatus') continue;
      up.add(w); for (const x of (C.get(w) || [])) up.add(x);
    }
  }
  return up;
}

/**
 * 表の外で作られる JSON 入力の除外 Pointer(第282便e —— 領域を宣言した器が安定 hash を刻む入力のうち、
 * 再生成表の段が書かないもの)。
 */
export const EXTERNAL_VOLATILE = {
  'tests/out/analogy-w265a.json': ['/meta/when', '/meta/inputs/*/mtime', '/meta/spentSec'],
  'tests/out/kjoint2-w265a.json': ['/meta/spentSec'],
  'tests/out/obscal-results.json': ['/manifest/generatedAt'],
  // 第283便b: 退役 7 本の凍結の写し(書き換えない fixture —— 除く欄は無い。現行の正本 rotorledger・analogy・families・samplestatus の入力)
  'tests/fixtures/retired-w283b.json': [],
  // 第284便b(原仮定者の裁定(第74報)⑤・AN35): 退役 6 本と ⚡ の旧則(f≈2)の凍結の写し(書き換えない fixture —— 現行の正本 families・samplestatus の入力)
  'tests/fixtures/retired-w284b.json': [],
  // 第285便a(原仮定者の裁定(第75報)⑤・R96): 第284便a の 💮 の宣言の凍結の写し(書き換えない fixture —— 現行の正本 cluster-w284a・cluster-w285a の入力)
  'tests/fixtures/cluster-w284a-preset.json': [],
  // 第285便f(原仮定者の裁定(第75報)AN51・AN24′): 退役 1 本(🪄)と 🧮 の旧則(f≈2)の凍結の写し(書き換えない fixture —— 現行の正本 families・samplestatus の入力)
  'tests/fixtures/retired-w285f.json': [],
  // 第286便a(原仮定者の裁定(第76報)⑤・R101〜R103): 第285便a の 💮 の宣言の凍結の写し(書き換えない fixture —— 履歴の正本 cluster-w285a の入力)
  'tests/fixtures/cluster-w285a-preset.json': [],
  // 第286便b(原仮定者の裁定(第76報)AN59): cLight の真値化の一覧と従属値(手で書いた宣言の表 —— 除く欄は無い。現行の正本 pnsource-w286b の入力)
  'tests/data-w286b-clight.json': [],
  // 第286便f(原仮定者の裁定(第76報)AN57): 退役 1 本(🩹)と 🩺 の旧則(f≈2)の凍結の写し(書き換えない fixture —— 現行の正本 families・samplestatus の入力)
  'tests/fixtures/retired-w286f.json': [],
  // 第287便b(原仮定者の裁定(第77報)AN62): 退役 1 本(🪤)と 🧶 の旧則(f≈2)の凍結の写し(書き換えない fixture —— 現行の正本 families・samplestatus の入力)
  'tests/fixtures/retired-w287b.json': [],
};

/** 第282便e: 正本(相対パス)の除外 Pointer —— 書く段の宣言の和 + 表の外の宣言。**宣言が無ければ []**(除外なし)。 */
export function volatilePathsOf(file) {
  const set = new Set();
  for (const st of REGEN_STEPS) for (const p of ((st.volatilePaths || {})[file] || [])) set.add(p);
  for (const p of (EXTERNAL_VOLATILE[file] || [])) set.add(p);
  return [...set].sort();
}

/** 第282便e: その正本に除外 Pointer の宣言(空の [] を含む)があるか。 */
export function volatileDeclared(file) {
  if (Object.prototype.hasOwnProperty.call(EXTERNAL_VOLATILE, file)) return true;
  return REGEN_STEPS.some((st) => Object.prototype.hasOwnProperty.call(st.volatilePaths || {}, file));
}

/** 正本ファイル → 段の key の並び。 */
export function stepsByOut() {
  const m = new Map();
  for (const s of REGEN_STEPS) for (const o of s.outs) { if (!m.has(o)) m.set(o, []); m.get(o).push(s.key); }
  return m;
}

/** 常時群の正本(alwaysRun の段が書く正本)。 */
export function alwaysRunOuts() {
  return [...new Set(REGEN_STEPS.filter((s) => s.alwaysRun).flatMap((s) => s.outs))];
}

/** 履歴の正本(role:'history' の段が書く正本)。 */
export function historyOuts() {
  return [...new Set(REGEN_STEPS.filter((s) => s.role === 'history').flatMap((s) => s.outs))];
}

const shaFile = (abs) => { try { return crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex'); } catch { return null; } };

/**
 * 第284便c(原仮定者の裁定(第74報)AN43): **刻印の安定 hash の宣言が今の宣言と違うか**(入力 `file` の行と、その随伴ファイルの行)。
 * 違いの理由の並びを返す(空 = 一致・刻印の行が無い入力は検査しない —— 安定 hash を刻まない器は sha で縛られている)。
 *   ・方式の版(`stableVersion`)が今の `STABLE_VERSION` でない(版なしの旧方式を含む)
 *   ・刻印の Pointer の並び ≠ 今の宣言(`volatileOf(file)` —— 再生成表の段の volatilePaths ∪ 表の外の宣言)
 *   ・今の宣言が随伴ファイルを持つのに随伴の行が無い / 随伴の行の版・Pointer が今の宣言と違う
 * @param {Array} inputsStable 正本の meta.inputsStable
 * @param {string} file 入力の相対パス
 * @param {(f:string)=>string[]} [volatileOf] 既定は `volatilePathsOf`
 */
export function stampedDeclDrift(inputsStable, file, volatileOf) {
  const volOf = volatileOf || volatilePathsOf;
  const rows = inputsStable || [];
  const st = rows.find((z) => z.file === file && z.companionOf === undefined) || null;
  if (!st) return [];
  const out = [];
  const chk = (row, f, label) => {
    if (row.stableVersion !== STABLE_VERSION) out.push(label + 'の方式の版 ' + String(row.stableVersion) + ' ≠ ' + STABLE_VERSION);
    const got = (row.volatilePaths || []).slice().sort(), cur = volOf(f).slice().sort();
    if (JSON.stringify(got) !== JSON.stringify(cur)) {
      const add = cur.filter((z) => !got.includes(z)), del = got.filter((z) => !cur.includes(z));
      out.push(label + 'の Pointer ≠ 今の宣言(' + (add.length ? '今だけ ' + add.slice(0, 2).join(',') + (add.length > 2 ? ` 他 ${add.length - 2}` : '') : '')
        + (add.length && del.length ? '・' : '') + (del.length ? '刻印だけ ' + del.slice(0, 2).join(',') + (del.length > 2 ? ` 他 ${del.length - 2}` : '') : '') + ')');
    }
  };
  chk(st, file, '刻印');
  for (const c of companionsOf(file)) {
    const r = rows.find((z) => z.file === c) || null;
    if (!r) { out.push('随伴 ' + c + ' の行が無い'); continue; }
    chk(r, c, '随伴 ' + c.replace('tests/out/', '') + ' ');
  }
  return out;
}
const readMeta = (abs) => { try { return (JSON.parse(fs.readFileSync(abs, 'utf8')) || {}).meta || null; } catch { return null; } };

/**
 * 再生成の計画(純関数 —— ファイルを書かない・走らせない)。
 * 判定(段ごと):
 *   history … role:'history'(再生成しない)
 *   always  … alwaysRun(常時群 —— 領域が一致しても走らせる)
 *   regen   … 正本・来歴が無い / 対象(html)の hash も領域 hash も一致しない / 器・lib の刻印が違う /
 *             入力ファイルの sha も安定 hash も違う
 *   recheck … 自分は一致しているが、依存先(after・入力の生成段)が regen/always —— **依存先が走った後に
 *             もう一度計画する**(常時群の正本は中身が同じでも時刻で sha が変わるので、安定 hash で見直す)
 *   reuse   … 対象・領域・コード・入力がすべて一致(再利用)
 * @param {object} o
 * @param {string} o.root リポジトリ root
 * @param {string} [o.html] 候補の html(既定 root/beta/index.html)—— 正本の target が beta/index.html のとき、この html で照合する
 * @param {string} [o.baseHtml] 基点の html(情報: 基点で領域が一致していたか)
 */
export function planRegen(o) {
  const root = o.root.replace(/\/$/, '');
  // 第284便c: 表と宣言を差し替えられる(AN43 の自己試験 `an43Probe` —— 既定は本表)
  const STEPS = o.steps || REGEN_STEPS;
  const volOf = o.volatileOf || volatilePathsOf;
  const abs = (f) => root + '/' + f;
  const htmlAbs = o.html || abs('beta/index.html');
  const htmlSha = shaFile(htmlAbs);
  const baseSha = o.baseHtml ? shaFile(o.baseHtml) : null;
  const scopeCache = new Map();
  const scopeFull = (hAbs, sc) => {
    const k = hAbs + '|' + JSON.stringify(sc);
    if (!scopeCache.has(k)) { let r = null; try { r = scopeHash(hAbs, sc); } catch { r = null; } scopeCache.set(k, r); }
    return scopeCache.get(k);
  };
  // 領域 hash は**刻印の版で**引く(sc.version —— scopeHash が読む)
  const scopeOn = (hAbs, sc) => { const r = scopeFull(hAbs, sc); return r && r.scopeComplete ? r.scopeSha256 : null; };
  // 第282便e: 領域の不一致の内訳(刻印時の html = 基点のときだけ)
  const scopeCause = (hA, sc, stampSha) => {
    if (!o.baseHtml || !baseSha || baseSha !== stampSha) return '領域(内訳は刻印時の html が要る —— --base に targetSha256 の html)';
    const a = scopeFull(o.baseHtml, sc), b = scopeFull(hA, sc);
    if (!a || !b) return '領域(引けない)';
    const out = [];
    const diffKeys = (x, y) => [...new Set([...Object.keys(x || {}), ...Object.keys(y || {})])].filter((k) => (x || {})[k] !== (y || {})[k]);
    const raw = diffKeys(a.parts.presetsRaw, b.parts.presetsRaw);
    const acc = diffKeys(a.parts.presetsAccepted, b.parts.presetsAccepted).filter((k) => raw.indexOf(k) < 0);
    const fn = diffKeys(a.parts.closure, b.parts.closure);
    const hp = diffKeys(a.parts.hp, b.parts.hp);
    const cs = diffKeys(a.parts.consts, b.parts.consts);
    if (raw.length) out.push('プリセット: ' + raw.slice(0, 4).join(',') + (raw.length > 4 ? ` 他 ${raw.length - 4}` : ''));
    if (acc.length) out.push('受理規則(受理後だけ変化): ' + acc.slice(0, 4).join(',') + (acc.length > 4 ? ` 他 ${acc.length - 4}` : ''));
    if (fn.length) out.push('式: ' + fn.slice(0, 4).join(',') + (fn.length > 4 ? ` 他 ${fn.length - 4}` : ''));
    if (hp.length) out.push('式(HP): ' + hp.join(','));
    if (a.parts.core !== b.parts.core) out.push('式: S._core');
    if (cs.length) out.push('定数: ' + cs.join(','));
    if (a.scope.version !== b.scope.version) out.push('領域の版');
    return out.length ? out.join(' / ') : '領域(内訳の差なし —— 版・停止集合)';
  };
  // 第283便e: 入力の依存は**書く段のすべて**(outs + merges —— dt3・kf0 は calaudit を書き戻す)
  const producer = writersMap(STEPS);
  const rows = new Map();
  for (const st of STEPS) {
    const row = { key: st.key, cmd: st.cmd, env: st.env, outs: st.outs, sec: st.sec, secSource: st.secSource,
      alwaysRun: st.alwaysRun, role: st.role, status: null, reasons: [], deps: [], scopeUsed: false, baseScopeSame: null,
      cause: [] };
    const cause = (c) => { if (row.cause.indexOf(c) < 0) row.cause.push(c); };
    const deps = new Set(st.after || []);
    if (st.role === 'history') { row.status = 'history'; row.reasons.push(st.note || '履歴(再生成しない)'); rows.set(st.key, row); continue; }
    const why = [];
    for (const out of st.outs) {
      const m = readMeta(abs(out));
      if (!m) { why.push(out + ': 正本か meta が無い'); cause('正本が無い'); continue; }
      for (const inp of (m.inputs || [])) for (const p of (producer.get(inp.file) || [])) if (p !== st.key) deps.add(p);
      // 対象
      const t = m.target || null;
      if (!t || !m.targetSha256) { why.push(out + ': 対象の刻印が無い'); cause('刻印が無い'); }
      else if (/\.html$/.test(t)) {
        const hA = (t === 'beta/index.html') ? htmlAbs : abs(t);
        const hS = (t === 'beta/index.html') ? htmlSha : shaFile(hA);
        if (m.targetSha256 !== hS) {
          const sNow = (m.scopeComplete === true && m.scope) ? scopeOn(hA, m.scope) : null;
          if (sNow && sNow === m.scopeSha256) {
            row.scopeUsed = true;
            if (o.baseHtml && t === 'beta/index.html') row.baseScopeSame = (scopeOn(o.baseHtml, m.scope) === sNow);
          } else {
            why.push(out + ': 対象 html の hash も領域 hash も一致しない' + (m.scope ? '' : '(領域の宣言なし)'));
            cause(m.scope && m.scopeComplete === true ? scopeCause(hA, m.scope, m.targetSha256) : '対象 html(領域の宣言なし —— html 全体)');
          }
        }
      } else if (shaFile(abs(t)) !== m.targetSha256) { why.push(out + ': 対象 ' + t + ' の hash が違う'); cause('入力(対象): ' + t); }
      // コード
      if (!Array.isArray(m.code) || !m.code.length) { why.push(out + ': 器・lib の刻印が無い'); cause('刻印が無い'); }
      else for (const c of m.code) if (c.sha256 && shaFile(abs(c.file)) !== c.sha256) { why.push(out + ': コード ' + c.file + ' が変わった'); cause('式(器・lib): ' + c.file); }
      // 第284便f(原仮定者の裁定(第74報)AN43): **刻印の Pointer ≠ 今の宣言 → regen**(第283便は刻印の Pointer で照合して再利用し、
      //   宣言を足した後も古い Pointer の刻印が残った —— 刻み直すまで「今の宣言で同じ」かは分からない)
      for (const z of (m.inputsStable || [])) {
        if (z.stableVersion !== STABLE_VERSION) continue;
        const got = JSON.stringify((z.volatilePaths || []).slice().sort()), cur = JSON.stringify(volOf(z.file));   // 統括(第284便 統合): 自己試験の差し替え宣言(volOf)を読む
        if (got !== cur) { why.push(out + ': 入力 ' + z.file + ' の刻印の Pointer が今の宣言と違う'); cause('刻印の Pointer ≠ 今の宣言: ' + z.file); }
      }
      // 入力
      for (const inp of (m.inputs || [])) {
        if (inp.missing || !inp.sha256 || inp.file === t) continue;
        // 第284便c(AN43): 刻印の安定 hash の宣言(Pointer・方式の版 —— 随伴の行も)が今の宣言と違えば、**バイト sha が同じでも** regen
        const drift = stampedDeclDrift(m.inputsStable, inp.file, volOf);
        if (drift.length) { why.push(out + ': 入力 ' + inp.file + ' の安定 hash の刻印が今の宣言と違う(' + drift.join(' / ') + ')'); cause('安定 hash の宣言: ' + inp.file + '(' + drift[0] + ')'); continue; }
        if (shaFile(abs(inp.file)) === inp.sha256) continue;
        const st2 = (m.inputsStable || []).find((z) => z.file === inp.file);
        if (st2 && stableInputOk(root, m.inputsStable, inp.file)) continue;   // 第282便e: 刻印の版で照合(第283便e: 随伴の行も)
        why.push(out + ': 入力 ' + inp.file + ' が変わった');
        cause('入力: ' + inp.file + (st2 ? '(安定 hash も違う)' : ''));
      }
      // inputs[] に載らない読み込み(❄️ 対照系列の calaudit・nslock の kjoint2 —— 安定 hash だけを刻んだ入力)
      const listed = new Set((m.inputs || []).map((z) => z.file));
      for (const st2 of (m.inputsStable || [])) {
        if (listed.has(st2.file)) continue;
        for (const p of (producer.get(st2.file) || [])) if (p !== st.key) deps.add(p);
        // 第284便c(AN43): 刻印の宣言 ≠ 今の宣言 → regen(随伴の行は親の行の検査で見る)
        if (st2.companionOf === undefined) {
          const drift = stampedDeclDrift(m.inputsStable, st2.file, volOf);
          if (drift.length) { why.push(out + ': 入力 ' + st2.file + ' の安定 hash の刻印が今の宣言と違う(' + drift.join(' / ') + ')'); cause('安定 hash の宣言: ' + st2.file + '(' + drift[0] + ')'); continue; }
        }
        if (!stableMatches(root, st2)) { why.push(out + ': 入力 ' + st2.file + ' の中身(安定 hash)が変わった'); cause('入力: ' + st2.file + '(安定 hash)'); }
      }
    }
    row.deps = [...deps].filter((d) => STEPS.some((z) => z.key === d));
    if (st.alwaysRun) { row.status = 'always'; row.reasons = ['常時群'].concat(why); }
    else if (why.length) { row.status = 'regen'; row.reasons = why; }
    else row.status = 'reuse';
    // 第283便e: 依存の伝播の前の**自分の判定**(鎖の --gate が上流の走行後に引き直す値)
    row.ownStatus = row.status;
    rows.set(st.key, row);
  }
  // 依存の伝播(regen/always に依存する reuse → recheck)
  let changed = true;
  while (changed) {
    changed = false;
    for (const row of rows.values()) {
      if (row.status !== 'reuse') continue;
      const hit = row.deps.filter((d) => rows.get(d) && ['regen', 'always', 'recheck'].includes(rows.get(d).status));
      if (hit.length) { row.status = 'recheck'; row.reasons.push('依存先が走る: ' + hit.join(', ')); row.cause.push('依存先: ' + hit.join(',')); changed = true; }
    }
  }
  // 領域が変わったときだけの段(ε 系列の h2/h4)
  for (const st of STEPS) {
    if (!st.onlyIfScopeChanged) continue;
    const row = rows.get(st.key);
    const htmlWhy = row.reasons.some((r) => r.indexOf('hash も領域 hash も一致しない') >= 0);
    if (row.status === 'regen' && !htmlWhy) { row.status = 'reuse'; row.reasons.push('領域は同じ —— h 段だけ走らせ h2/h4 は器の併合規則で転記'); }
    if (row.status === 'recheck') { row.status = 'reuse'; row.reasons.push('領域は同じ —— h2/h4 は転記'); }
  }
  // 依存順(トポロジカル)
  const order = [];
  const seen = new Set();
  const visit = (k, stack) => {
    if (seen.has(k)) return;
    if (stack.has(k)) return;
    stack.add(k);
    for (const d of (rows.get(k) || { deps: [] }).deps) visit(d, stack);
    stack.delete(k);
    seen.add(k); order.push(k);
  };
  for (const st of STEPS) visit(st.key, new Set());
  const list = order.map((k) => rows.get(k));
  // 第282便e: 「どの入力・式・受理規則で無効化されたか」の 1 列(文字列)
  for (const r of list) {
    if (r.ownStatus === undefined) r.ownStatus = r.status;
    if (r.status === 'history') r.causeText = '履歴';
    else if (r.status === 'reuse') r.causeText = '';
    else r.causeText = (r.status === 'always' ? ['常時群'] : []).concat(r.cause).join(' / ') || (r.status === 'always' ? '常時群' : '');
  }
  const sum = (f) => list.filter(f).reduce((a, r) => a + (Number(r.sec) || 0), 0);
  const count = {};
  for (const r of list) count[r.status] = (count[r.status] || 0) + 1;
  return {
    version: REGEN_TABLE_VERSION,
    html: htmlAbs.replace(root + '/', ''), htmlSha256: htmlSha,
    baseHtml: o.baseHtml ? o.baseHtml.replace(root + '/', '') : null, baseSha256: baseSha,
    count,
    secLower: sum((r) => r.status === 'regen' || r.status === 'always'),
    secUpper: sum((r) => r.status === 'regen' || r.status === 'always' || r.status === 'recheck'),
    run: list.filter((r) => ['regen', 'always', 'recheck'].includes(r.status)).map((r) => r.key),
    steps: list,
    note: 'secLower = regen+always の実測秒の和(recheck が全部「再利用」に戻った場合)/ secUpper = recheck も走らせた場合。'
      + '所要秒は第280便の chain(4 本並列)と正本の列ごとの wallSec の実測で、見積りである(並列度で変わる)',
  };
}

// ======================================================================================================
// 第283便e(原仮定者の裁定(第73報)⑤・統括の検証項目 R88): **鎖の機械生成**と**順序の照合**(純関数 —— 走らせない)
// ======================================================================================================

/** 段が書くファイル(outs + merges)。 */
export function writesOf(st) { return [...new Set((st.outs || []).concat(st.merges || []))]; }

/** ファイル → 書く段の key の並び(表の順・履歴の段も含む)。 */
export function writersMap(steps) {
  const m = new Map();
  for (const st of (steps || REGEN_STEPS)) for (const f of writesOf(st)) { if (!m.has(f)) m.set(f, []); m.get(f).push(st.key); }
  return m;
}

/** 表の after の推移閉包(key → Set)。 */
export function afterClosure(steps) {
  const S0 = steps || REGEN_STEPS;
  const by = new Map(S0.map((z) => [z.key, z]));
  const memo = new Map();
  const go = (k, stack) => {
    if (memo.has(k)) return memo.get(k);
    const out = new Set();
    if (stack.has(k)) return out;
    stack.add(k);
    for (const d of ((by.get(k) || {}).after || [])) { out.add(d); for (const x of go(d, stack)) out.add(x); }
    stack.delete(k);
    memo.set(k, out);
    return out;
  };
  const res = new Map();
  for (const z of S0) res.set(z.key, go(z.key, new Set()));
  return res;
}

const readMetaAt = (root, f) => { try { return (JSON.parse(fs.readFileSync(root.replace(/\/$/, '') + '/' + f, 'utf8')) || {}).meta || null; } catch { return null; } };

/**
 * 表の依存(key → Set(直接の依存))= after ∪(root を渡したとき)正本の meta.inputs[]・inputsStable[] のファイルを**書く段のすべて**。
 * 履歴の段は依存に入れない(履歴は再生成しない)。
 * @param {{root?:string, steps?:Array, metaOf?:(file)=>object|null}} [o]
 */
export function tableDeps(o) {
  const opt = o || {};
  const steps = opt.steps || REGEN_STEPS;
  const cur = new Set(steps.filter((z) => z.role !== 'history').map((z) => z.key));
  const W = writersMap(steps);
  const metaOf = opt.metaOf || (opt.root ? (f) => readMetaAt(opt.root, f) : null);
  const deps = new Map();
  for (const st of steps) {
    if (st.role === 'history') continue;
    const d = new Set((st.after || []).filter((k) => cur.has(k)));
    if (metaOf) for (const out of (st.outs || [])) {
      const m = metaOf(out);
      if (!m) continue;
      for (const z of [...(m.inputs || []), ...(m.inputsStable || [])]) for (const w of (W.get(z.file) || [])) if (w !== st.key && cur.has(w)) d.add(w);
    }
    deps.set(st.key, d);
  }
  return deps;
}

/**
 * 第286便f: **静的な読み取りの宣言**(after に足せない読み —— 循環する前回の世代の読みと、文言の中の言及)。
 * via = 名指しが書いてあるファイル・file = 正本・kind = 'prev-generation'(書き手が下流 —— 前回の正本を読む)| 'mention'(文言の中の言及で読まない)| 'imported-main'(import した器の本走だけが読む)。
 */
export const STATIC_READ_DECL = [
  { via: 'tests/exp-w249b-calaudit.mjs', file: 'tests/out/charon-w272b.json', kind: 'prev-generation',
    why: 'kF0 の対照走行の独立照合(kf0Runs.charonCitation)—— ❄️ の系列(charon-h/h2/h4)は calaudit の下流なので、前回の世代の正本を hash つきで引用する(走行の代わりではない)' },
  { via: 'tests/exp-w249b-calaudit.mjs', file: 'tests/out/calcontract-w282a.json', kind: 'prev-generation',
    why: 'dt と dt/2 の閾値規則(既定 off)の対象 = 較正契約の正本で system が dfm の本 —— calcontract は calaudit の下流なので前回の世代を読む(既定の鎖では使わない)' },
  { via: 'tests/lib-w283c-calstages.mjs', file: 'tests/out/calcontract-w282a.json', kind: 'mention',
    why: 'DT_DT2_RULE.scope の説明文の中の言及(読まない)' },
  { via: 'tests/exp-w277c-nsgrid.mjs', file: 'tests/out/powerball2-w276c.json', kind: 'mention',
    why: '出力の説明文の中の言及(読まない)' },
  { via: 'tests/exp-w284a-cluster.mjs', file: 'tests/out/cluster-w283f.json', kind: 'imported-main',
    why: 'exp-w284a-cluster の本走(段 clusterStable —— after に clusterAnalogy)が読む正本。段 clusterScan(exp-w285a-cluster)は定数と関数だけを import し、この読みは走らない' },
];
const STATIC_SKIP_MODULES = ['tests/lib-w281a-regentable.mjs'];
const stripComments = (t) => t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`\\])\/\/.*$/gm, '$1');
/**
 * 第286便f: 段が**名指しする正本**(静的)。{ key, file, via } の配列(自分の段・同じ器を使う段の出力・import した器の段の出力は除く)。
 * @param {{root:string, steps?:Array, readText?:(rel)=>string|null}} o
 */
export function harnessReads(o) {
  const steps = (o && o.steps) || REGEN_STEPS;
  const root = String(o.root).replace(/\/$/, '');
  const readText = (o && o.readText) || ((rel) => { try { return fs.readFileSync(root + '/' + rel, 'utf8'); } catch { return null; } });
  const cur = steps.filter((z) => z.role !== 'history');
  const harnessOf = (st) => [...new Set(String(st.cmd).match(/(?:tests|tools)\/[A-Za-z0-9_.-]+\.mjs/g) || [])];
  const outsByHarness = new Map();
  for (const st of cur) for (const h of harnessOf(st)) { if (!outsByHarness.has(h)) outsByHarness.set(h, new Set()); for (const f of writesOf(st)) outsByHarness.get(h).add(f); }
  const memo = new Map();
  const namesOf = (rel, stack) => {
    if (memo.has(rel)) return memo.get(rel);
    const out = new Map();
    if (stack.has(rel) || STATIC_SKIP_MODULES.includes(rel)) return out;
    stack.add(rel);
    const t = readText(rel);
    if (t !== null) {
      const u = stripComments(t);
      for (const m of u.matchAll(/tests\/out\/([A-Za-z0-9_.-]+\.json)/g)) out.set('tests/out/' + m[1], rel);
      for (const m of u.matchAll(/'tests',\s*'out',\s*'([A-Za-z0-9_.-]+\.json)'/g)) out.set('tests/out/' + m[1], rel);
      for (const m of u.matchAll(/from\s+'\.\/([A-Za-z0-9_.-]+\.mjs)'/g)) {
        const dir = rel.slice(0, rel.lastIndexOf('/') + 1), r2 = dir + m[1];
        const own = outsByHarness.get(r2) || new Set();   // import した器の自分の出力は「書き」
        for (const [f, via] of namesOf(r2, stack)) if (!out.has(f) && !own.has(f)) out.set(f, via);
      }
    }
    stack.delete(rel);
    memo.set(rel, out);
    return out;
  };
  const res = [];
  for (const st of cur) {
    const hs = harnessOf(st);
    const sib = new Set(); for (const h of hs) for (const f of (outsByHarness.get(h) || [])) sib.add(f);
    for (const f of writesOf(st)) sib.add(f);
    const seen = new Set();
    for (const h of hs) for (const [f, via] of namesOf(h, new Set())) {
      if (sib.has(f) || seen.has(f)) continue;
      seen.add(f); res.push({ key: st.key, file: f, via });
    }
  }
  return res;
}
/**
 * 第286便f: **器が読む正本の書き手が after に無い**(静的)。宣言した読み(STATIC_READ_DECL)は別に数える。
 * @returns {{missingAfter:Array<{key,file,writer,via}>, declared:Array, staleReadDecl:Array, reads:number}}
 */
export function staticAfterAudit(o) {
  const steps = (o && o.steps) || REGEN_STEPS;
  const cur = new Set(steps.filter((z) => z.role !== 'history').map((z) => z.key));
  const C = afterClosure(steps);
  const W = writersMap(steps);
  const reads = harnessReads(Object.assign({}, o, { steps }));
  const decl = (o && o.decl) || STATIC_READ_DECL;
  const missingAfter = [], declared = [], used = new Set();
  for (const r of reads) for (const w of (W.get(r.file) || [])) {
    if (w === r.key || !cur.has(w) || (C.get(r.key) || new Set()).has(w)) continue;
    const d = decl.find((z) => z.via === r.via && z.file === r.file);
    if (d) { declared.push({ key: r.key, file: r.file, writer: w, via: r.via, kind: d.kind }); used.add(d.via + '|' + d.file); continue; }
    missingAfter.push({ key: r.key, file: r.file, writer: w, via: r.via });
  }
  const staleReadDecl = decl.filter((z) => !used.has(z.via + '|' + z.file)).map((z) => z.via + '|' + z.file);
  return { missingAfter, declared, staleReadDecl, reads: reads.length };
}

/**
 * **表の依存の完全性**(第282便の順序不整合を表から検出する):
 *   ① 正本の入力(meta.inputs[]・inputsStable[])を書く現行の段が、読む段の **after の推移閉包**に入っている
 *      (入っていないと、手で書いた鎖が入力より先に走らせても表からは分からない)
 *   ② 同じファイルを書く現行の段どうしが after の推移閉包で**全順序**になっている(並列に書かない)
 *   ③ after に循環が無い・after の名前が表にある
 * @param {{root?:string, steps?:Array, metaOf?:Function}} o
 * @returns {{ok:boolean, missing:Array<{key,file,writer}>, unordered:Array<{file,a,b}>, cycles:string[], unknown:string[]}}
 */
export function tableDepsAudit(o) {
  const opt = o || {};
  const steps = opt.steps || REGEN_STEPS;
  const keys = new Set(steps.map((z) => z.key));
  const cur = new Set(steps.filter((z) => z.role !== 'history').map((z) => z.key));
  const C = afterClosure(steps);
  const W = writersMap(steps);
  const metaOf = opt.metaOf || (opt.root ? (f) => readMetaAt(opt.root, f) : null);
  const missing = [], unordered = [], cycles = [], unknown = [];
  for (const st of steps) {
    for (const a of (st.after || [])) if (!keys.has(a)) unknown.push(st.key + '→' + a);
    if (C.get(st.key).has(st.key)) cycles.push(st.key);
    if (st.role === 'history' || !metaOf) continue;
    const seen = new Set();
    for (const out of (st.outs || [])) {
      const m = metaOf(out);
      if (!m) continue;
      for (const z of [...(m.inputs || []), ...(m.inputsStable || [])]) for (const w of (W.get(z.file) || [])) {
        if (w === st.key || !cur.has(w) || C.get(st.key).has(w) || seen.has(w + '|' + z.file)) continue;
        // 自分も同じファイルを書く段(kf0 が calaudit を読み書きする)は「書く段の順序」②で見る
        if (writesOf(st).includes(z.file)) continue;
        seen.add(w + '|' + z.file);
        missing.push({ key: st.key, file: z.file, writer: w });
      }
    }
  }
  for (const [f, ws] of W) {
    const c = ws.filter((k) => cur.has(k));
    for (let i = 0; i < c.length; i++) for (let j = i + 1; j < c.length; j++) {
      const a = c[i], b = c[j];
      if (!C.get(a).has(b) && !C.get(b).has(a)) unordered.push({ file: f, a, b });
    }
  }
  // 統括(第284便 統合): 段の鍵の重複(後の定義が先の定義を黙って消す —— 第284便e の bgfield)
  const seen = new Set(), dupKeys = [];
  for (const st of steps) { if (seen.has(st.key)) dupKeys.push(st.key); seen.add(st.key); }
  // 第285便f(AN53): samplestatus より先に走りうる html 全体の段(samplestatus の上流と、samplestatus が読む正本の書き手は除く)
  const beforeSamplestatus = [];
  if (metaOf && keys.has('samplestatus')) {
    const up = samplestatusUpstream({ steps, metaOf });
    for (const k of htmlWholeSteps({ steps, metaOf })) {
      if (k === 'samplestatus' || up.has(k)) continue;
      if (!(C.get(k) || new Set()).has('samplestatus')) beforeSamplestatus.push(k);
    }
  }
  // 第286便f: 器が読む正本の書き手が after に無い(静的 —— root があるときだけ)
  let missingAfter = [], staleReadDecl = [], declaredReads = 0;
  if (opt.root) { const sa = staticAfterAudit({ root: opt.root, steps, decl: opt.decl }); missingAfter = sa.missingAfter; staleReadDecl = sa.staleReadDecl; declaredReads = sa.declared.length; }
  // 第287便f(AN69 後半): html を書く段の検査(root があるときだけ —— 書く段の宣言・領域・順序・after 欠落・領域の閉包・依存の循環)
  const html = opt.root && opt.html !== false ? htmlTailAudit({ root: opt.root, steps, metaOf: opt.metaOf, htmlText: opt.htmlText }) : null;
  return { ok: !missing.length && !unordered.length && !cycles.length && !unknown.length && !dupKeys.length && !beforeSamplestatus.length
      && !missingAfter.length && !staleReadDecl.length && (!html || html.ok),
    missing, unordered, cycles, unknown, dupKeys, beforeSamplestatus, missingAfter, staleReadDecl, declaredReads, html };
}

/** 依存の推移閉包(key → Set(上流すべて))と逆向き(key → Set(下流すべて))。 */
function closures(deps) {
  const up = new Map();
  const go = (k, stack) => {
    if (up.has(k)) return up.get(k);
    const s = new Set();
    if (stack.has(k)) return s;
    stack.add(k);
    for (const d of (deps.get(k) || [])) { s.add(d); for (const x of go(d, stack)) s.add(x); }
    stack.delete(k);
    up.set(k, s);
    return s;
  };
  for (const k of deps.keys()) go(k, new Set());
  const down = new Map([...deps.keys()].map((k) => [k, new Set()]));
  for (const [k, s] of up) for (const d of s) { if (!down.has(d)) down.set(d, new Set()); down.get(d).add(k); }
  return { up, down };
}

/**
 * **実際に走った列の照合**(第282便の統合で起きた型を検出する)。
 *   order   … 段 s の依存 d(推移)が列にあり、d の最後の走行より後に s が 1 度も無い(s は古い入力で終わった)。
 *             s が列に無いときは downstream に分ける。
 *   downstream … 段 d が走ったのに、その下流 s(推移・現行の段)が列に 1 度も無い(依存の閉包で再判定していない)。
 *   wasted  … s が依存 d より先に走り、d の後にもう 1 度走った(入力より先の走行は無駄になった)。
 * 列の要素は段の key(同じ key が何度出てもよい —— 再判定〔gate〕で再利用と決めた段も「列にある」に数える)。
 * @param {string[]} seq
 * @param {{deps?:Map, root?:string, steps?:Array}} [o]
 */
export function checkOrder(seq, o) {
  const opt = o || {};
  const deps = opt.deps || tableDeps({ root: opt.root, steps: opt.steps });
  const { up, down } = closures(deps);
  const first = new Map(), last = new Map(), all = new Map();
  seq.forEach((k, i) => { if (!first.has(k)) first.set(k, i); last.set(k, i); if (!all.has(k)) all.set(k, []); all.get(k).push(i); });
  const order = [], wasted = [], downstream = [];
  for (const [s, idx] of all) {
    for (const d of (up.get(s) || [])) {
      if (!last.has(d)) continue;
      const ld = last.get(d);
      const after = idx.some((i) => i > ld);
      if (!after) order.push({ step: s, dep: d, stepAt: last.get(s), depAt: ld });
      else if (idx.some((i) => i < ld)) wasted.push({ step: s, dep: d });
    }
  }
  const ran = new Set(seq);
  for (const d of ran) for (const s of (down.get(d) || [])) if (!ran.has(s)) downstream.push({ step: s, dep: d });
  const uniq = (arr, f) => [...new Map(arr.map((z) => [f(z), z])).values()];
  return { ok: !order.length && !downstream.length, order: uniq(order, (z) => z.step + '<' + z.dep),
    wasted: uniq(wasted, (z) => z.step + '<' + z.dep), downstream: uniq(downstream, (z) => z.step), n: seq.length };
}

/**
 * 計画 → **鎖**(依存順の波)。
 *   run    … 計画で regen / always(onlyIfScopeChanged の段は計画の判定のまま)
 *   gate   … 計画で recheck、または依存の閉包(run/gate の下流すべて)で入った段 —— 上流が走った後に**自分の判定**
 *             (`ownStatus`: 対象・コード・入力〔安定 hash〕)を引き直し、reuse なら走らせない
 *   manual … 表の cmd が 1 行のシェルでない段(emgrid)—— 済み印が無ければ鎖はそこで止まる
 *   履歴・chain の外(qaorder)・reuse で閉包にも入らない段は鎖に入れない。
 * 波 = 鎖に入った段どうしの依存の最長路の段数。波の中は互いに独立(並列にしてよい)。
 * @param {object} plan planRegen の戻り(steps[].status・key)
 * @param {{deps?:Map, root?:string, steps?:Array, noGate?:boolean}} [o]
 */
export function buildChain(plan, o) {
  const opt = o || {};
  const steps = opt.steps || REGEN_STEPS;
  const by = new Map(steps.map((z) => [z.key, z]));
  const deps = opt.deps || tableDeps({ root: opt.root, steps });
  const { down } = closures(deps);
  const status = new Map((plan.steps || []).map((r) => [r.key, r.status]));
  const mode = new Map();
  for (const st of steps) {
    if (st.role === 'history' || st.outside) continue;
    const s = status.get(st.key);
    if (s === 'regen' || s === 'always') mode.set(st.key, st.manual ? 'manual' : 'run');
    else if (s === 'recheck') mode.set(st.key, st.manual ? 'manual' : (opt.noGate ? 'run' : 'gate'));
  }
  // 依存の閉包: 鎖に入った段の下流はすべて鎖に入る(上流の後に置いて判定を引き直す)
  for (const k of [...mode.keys()]) for (const d of (down.get(k) || [])) {
    const st = by.get(d);
    if (!st || st.role === 'history' || st.outside || mode.has(d)) continue;
    mode.set(d, st.manual ? 'manual' : (opt.noGate ? 'run' : 'gate'));
  }
  // 第283便 統合: **同じファイルへ段階的に書く段**(charon の h → h2 → h4 —— 上流が同じ outs を書き直す)は、上流が鎖に入ったら
  //   再判定(gate)で再利用してはいけない(上流が書き直したファイルに自分の列が無くなる)。上流が run/gate なら自分も run。
  for (let changed = true; changed;) {
    changed = false;
    for (const [k, m] of mode) {
      if (m !== 'gate') continue;
      const st = by.get(k); const mine = writesOf(st);
      const up = [...(deps.get(k) || [])].filter((d) => mode.get(d) === 'run' && writesOf(by.get(d)).some((f) => mine.includes(f)));
      if (up.length) { mode.set(k, 'run'); changed = true; }
    }
  }
  // 波(依存の最長路)
  const level = new Map();
  const lv = (k, stack) => {
    if (level.has(k)) return level.get(k);
    if (stack.has(k)) throw new Error('依存の循環: ' + [...stack, k].join(' → '));
    stack.add(k);
    let L = 0;
    for (const d of (deps.get(k) || [])) if (mode.has(d)) L = Math.max(L, lv(d, stack) + 1);
    stack.delete(k);
    level.set(k, L);
    return L;
  };
  for (const k of mode.keys()) lv(k, new Set());
  const nW = mode.size ? Math.max(...level.values()) + 1 : 0;
  const tableIdx = new Map(steps.map((z, i) => [z.key, i]));
  const waves = [];
  for (let w = 0; w < nW; w++) waves.push([...mode.keys()].filter((k) => level.get(k) === w).sort((a, b) => tableIdx.get(a) - tableIdx.get(b)));
  const rows = {};
  for (const [k, m] of mode) {
    const st = by.get(k);
    const mine = writesOf(st);
    rows[k] = { key: k, mode: m, wave: level.get(k), cmd: st.cmd, env: st.env || {}, sec: st.sec || 0,
      deps: [...(deps.get(k) || [])].filter((d) => mode.has(d)), plan: status.get(k) || null,
      // 第284便f: 書くファイル(排他の鍵)・worker 数(分割して走る段は分割数)
      writes: mine, workers: st.exclusive ? 'all' : Math.max(1, st.workers || 1),
      // 第283便 統合: 同じファイルを書く上流(鎖の中)—— gate_step は、これが実際に走った(済み印が run)なら再利用せず走る
      sameFileUps: [...(deps.get(k) || [])].filter((d) => mode.has(d) && writesOf(by.get(d)).some((f) => mine.includes(f))) };
  }
  const skipped = steps.filter((z) => !mode.has(z.key)).map((z) => ({ key: z.key,
    why: z.role === 'history' ? '履歴' : z.outside ? 'chain の外' : (status.get(z.key) || '計画に無い') }));
  // 第284便f: 済み印の契約(code/input/policy —— 鎖の生成時に決まる値)と ready queue の優先度(臨界路)
  const ct = chainContracts(rows, { by, root: opt.root || null, htmlSha: plan.htmlSha256 || null });
  for (const k of Object.keys(rows)) rows[k].contract = ct.get(k);
  // 第287便f(AN69): 入力の並び(段を入れる直前に --digest で hash を引く —— 契約の入力の部分)
  const specs = chainInputSpecs(rows, { by, root: opt.root || null, steps, deps });
  for (const k of Object.keys(rows)) rows[k].inputs = specs.get(k) || [];
  const priority = chainPriority({ steps: rows }, tableIdx);
  return { version: REGEN_TABLE_VERSION, contractVersion: CHAIN_CONTRACT_VERSION, waves, priority, steps: rows, skipped,
    count: { run: [...mode.values()].filter((m) => m === 'run').length, gate: [...mode.values()].filter((m) => m === 'gate').length,
      manual: [...mode.values()].filter((m) => m === 'manual').length },
    secRun: [...mode].filter(([, m]) => m === 'run').reduce((a, [k]) => a + (rows[k].sec || 0), 0),
    secGate: [...mode].filter(([, m]) => m === 'gate').reduce((a, [k]) => a + (rows[k].sec || 0), 0) };
}

/** 鎖を波の順に平らにした列(checkOrder の自己試験用 —— 波の中は表の順)。 */
export function chainSequence(chain) { return chain.waves.flat(); }

/** 波の中の段をレーンへ(所要秒の大きい順に、いちばん空いたレーンへ —— LPT)。 */
export function laneSplit(keys, secOf, lanes) {
  const n = Math.max(1, Math.min(lanes || 1, keys.length));
  const L = Array.from({ length: n }, () => ({ sec: 0, keys: [] }));
  for (const k of keys.slice().sort((a, b) => (secOf(b) - secOf(a)) || (a < b ? -1 : 1))) {
    const t = L.reduce((m, x) => (x.sec < m.sec ? x : m), L[0]);
    t.keys.push(k); t.sec += secOf(k);
  }
  return L.filter((x) => x.keys.length);
}

const shq = (t) => "'" + String(t).replace(/'/g, "'\\''") + "'";

// ======================================================================================================
// 第284便f(原仮定者の裁定(第74報)⑥「まだ時間が長いので改善する・並列実行を検討する」・統括の検証項目 R94):
//   **ready queue**(波全体の完了を待たず、依存が済んだ段から空きレーンへ)・**書込排他**(書くファイル〔outs + merges〕が
//   重なる段を同時に走らせない)・**共有 worker 予算**(段の `workers` —— 分割して走る段は分割数ぶんのレーンを取る)・
//   **済み印の契約**(`done/<段>.done` に code/input/policy の hash —— 同じ契約の済み印だけを済みと見なす)。
// ======================================================================================================

/** 段の cmd に出る器と、段の正本の meta.code[] のファイル(済み印の契約の code)。 */
export function codeFilesOf(st, root) {
  const set = new Set();
  for (const m of String(st.cmd || '').matchAll(/\b(?:tests|tools)\/[\w.-]+\.mjs\b/g)) set.add(m[0]);
  if (root) for (const out of (st.outs || [])) { const m = readMetaAt(root, out); for (const c of ((m && m.code) || [])) if (c && c.file) set.add(c.file); }
  return [...set].sort();
}
const sha256Hex = (s) => crypto.createHash('sha256').update(s).digest('hex');

// ======================================================================================================
// 第287便f(原仮定者の裁定(第77報)AN69・統括の検証項目 R112): **済み印の契約 = 静的な部分 + 入力の安定 hash**(版 w287f-chaincontract-2)
//   ・静的(鎖の生成時 —— `chainContracts`): policy(段・mode・cmd・env の名前・書くファイル・workers)・code(器と meta.code[] の現行 sha)。
//   ・入力(段を入れる直前に `tools/regen-chain.mjs --digest` で引く —— `chainInputSpecs` の並び・`inputDigest`):
//       json:<file>  … 読む正本の**意味的出力**(宣言した除外 Pointer〔volatilePathsOf〕と来歴・時刻の欄 SEMANTIC_RUN_META を除いた安定 hash)
//       bytes:<file> … 表の外の入力(観測値の CSV・量対応の表など —— バイトの sha)
//       html:scope:<正本> … 領域を宣言した段(meta.scopeComplete)は**領域 hash**(刻印の宣言で今の html から引く)
//       html:strip:<領域,…> / html:whole … それ以外で html を読む段は本文。**自分と下流の html を書く段の生成領域だけを除く**
//                    (上流の段は下流が書く領域を入力にできない —— 読めば循環)。下流でも上流でもない書き手の領域は除かない
//       mark:<段>    … 同じファイルを段階的に書く上流(鎖の中)の済み印の走行行(上流が走り直せば、中身が同じでも自分の列を書き直す)
//       env:<名前>   … 環境変数の値(hash)
//   ・旧版 w284f-chaincontract-1 は input に「対象 html の sha と鎖の中の上流の契約(Merkle)」を入れていた —— html を 1 字でも変えて鎖を
//     作り直すか、上流が走り直す(中身が同じでも)と下流の済み印が全部無効になった(第286便の鎖 7〜8 の空回り: kf0 が calaudit の
//     時刻の欄だけを書き直し、読み手が全部走り直した)。新版では**上流の意味的出力が同じなら読み手の印が生きる**(自己試験 (p))。
//   ・**全 html のバイト hash を全段の入力にしない**(html を読まない段は html を入れない)。「説明文なら全て除く」の大まかな除外もしない
//     (除くのは宣言した生成領域の中身だけ —— 領域は `htmlRegions` で段が宣言し、`htmlTailAudit` が器の本文と html の印で照合する)。
// ======================================================================================================

/** 済み印の契約の版(第287便f で入力の安定 hash へ)。 */
export const CHAIN_CONTRACT_VERSION = 'w287f-chaincontract-2';
export const CHAIN_CONTRACT_HISTORY = [
  { version: 'w284f-chaincontract-1', since: '第284便f(R94)',
    note: 'policy・code・input(計画の対象 html の sha と鎖の中の上流の契約 —— Merkle)。html を変えて鎖を作り直すか上流が走り直すと、中身が同じでも下流の済み印が全部無効(第286便の鎖 7〜8 の空回り)' },
];
/** 生成領域の印(beta/index.html の JS 注釈 —— 第275便a の形)。 */
export const HTML_TARGET = 'beta/index.html';
export const htmlGenBegin = (r) => '// >>> w275a-generated: ' + r;
export const htmlGenEnd = (r) => '// <<< w275a-generated: ' + r;
/**
 * 意味的出力で除く欄(どの正本にも共通の**来歴と時刻** —— 値が変わっても読み手の入力は変わらない)。
 * 正本ごとの壁時計・非物理 meta は従来どおり段の `volatilePaths` の宣言(`volatilePathsOf`)で除く。物理欄は 1 つも入れない。
 */
export const SEMANTIC_RUN_META = ['/meta/generatedAt', '/meta/when', '/meta/inputs', '/meta/inputsStable', '/meta/code', '/meta/codeSha256',
  '/meta/targetSha256', '/meta/scopeSha256', '/meta/elapsedS', '/meta/spentSec', '/meta/wallSec', '/generatedAt', '/when', '/elapsedS', '/elapsedSec'];

/**
 * 済み印の契約の**静的な部分**(鎖の生成時 —— policy と code だけ。入力は `inputDigest` が段を入れる直前に引く)。
 * @returns {Map<string,string>} 段 → 64 桁
 */
export function chainContracts(rows, o) {
  const opt = o || {};
  const memo = new Map();
  for (const k of Object.keys(rows)) {
    const r = rows[k];
    const st = opt.by ? opt.by.get(k) : null;
    const code = st ? codeFilesOf(st, opt.root).map((f) => [f, opt.root ? shaFile(opt.root.replace(/\/$/, '') + '/' + f) : null]) : [];
    memo.set(k, sha256Hex(JSON.stringify({ contract: CHAIN_CONTRACT_VERSION,
      policy: { key: k, mode: r.mode, cmd: r.cmd, env: Object.keys(r.env || {}).sort(), writes: (r.writes || []).slice().sort(), workers: r.workers || 1 },
      code })));
  }
  return memo;
}
/**
 * 旧版(w284f-chaincontract-1)の契約 —— **自己試験 (p) の再現専用**(html の sha と鎖の中の上流の契約を入れる Merkle)。
 * @returns {Map<string,string>}
 */
export function legacyChainContracts(rows, o) {
  const opt = o || {};
  const memo = new Map();
  const go = (k, stack) => {
    if (memo.has(k)) return memo.get(k);
    if (stack.has(k)) throw new Error('依存の循環: ' + k);
    stack.add(k);
    const r = rows[k];
    const st = opt.by ? opt.by.get(k) : null;
    const code = st ? codeFilesOf(st, opt.root).map((f) => [f, opt.root ? shaFile(opt.root.replace(/\/$/, '') + '/' + f) : null]) : [];
    const ups = (r.deps || []).slice().sort().map((d) => [d, go(d, stack)]);
    const c = sha256Hex(JSON.stringify({ v: REGEN_TABLE_VERSION, contract: 'w284f-chaincontract-1',
      policy: { key: k, mode: r.mode, cmd: r.cmd, env: Object.keys(r.env || {}).sort(), writes: (r.writes || []).slice().sort(), workers: r.workers || 1 },
      code, input: { html: opt.htmlSha || null, ups } }));
    stack.delete(k);
    memo.set(k, c);
    return c;
  };
  for (const k of Object.keys(rows)) go(k, new Set());
  return memo;
}

/** 器(cmd が名指しする tests/*.mjs・tools/*.mjs)と、その `from './x.mjs'` の閉包の本文(注釈を除く)。 */
function harnessClosureTexts(st, root, readText) {
  const rt = readText || ((rel) => { try { return fs.readFileSync(String(root).replace(/\/$/, '') + '/' + rel, 'utf8'); } catch { return null; } });
  const out = new Map();
  const visit = (rel) => {
    if (out.has(rel) || STATIC_SKIP_MODULES.includes(rel)) return;
    const t = root || readText ? rt(rel) : null;
    if (t === null) return;
    const u = stripComments(t);
    out.set(rel, u);
    const dir = rel.slice(0, rel.lastIndexOf('/') + 1);
    for (const m of u.matchAll(/from\s+'\.\/([A-Za-z0-9_.-]+\.mjs)'/g)) visit(dir + m[1]);
  };
  for (const h of new Set(String(st.cmd || '').match(/(?:tests|tools)\/[A-Za-z0-9_.-]+\.mjs/g) || [])) visit(h);
  return out;
}

/**
 * 段の **html の読み方**(機械で):
 *   gen   … html を書く段(`htmlRegions` を宣言)
 *   scope … 正本の meta が対象 beta/index.html・完全な領域の宣言(scopeComplete)を持つ(html を刻む正本がすべてそう)
 *   whole … それ以外で meta が html を刻む・入力に持つ / meta が html を刻まず器の本文(import の閉包・注釈を除く)が index.html を名指しする /
 *           meta も器の本文も引けない(読まないと言えない —— 保守側)
 *   none  … 読まない
 * 自己試験の stub は `htmlInput`('none'|'whole')で直に与える。root も metaOf も無いときは 'none'。
 * @param {object} st 段
 * @param {{root?:string, metaOf?:Function, readText?:Function}} o
 */
export function htmlReadOf(st, o) {
  const opt = o || {};
  if ((st.htmlRegions || []).length) return { kind: 'gen' };
  if (st.htmlInput) return { kind: st.htmlInput, why: 'htmlInput' };
  const metaOf = opt.metaOf || (opt.root ? (f) => readMetaAt(opt.root, f) : null);
  if (!metaOf) return { kind: 'none', why: 'meta を引けない(stub)' };
  const metas = (st.outs || []).map((f) => [f, metaOf(f)]);
  const hm = metas.filter(([, m]) => m && (/\.html$/.test(String(m.target || '')) || (m.inputs || []).some((z) => /\.html$/.test(String(z.file || '')))));
  if (hm.length) {
    const scoped = hm.every(([, m]) => m.target === HTML_TARGET && m.scope && m.scopeComplete === true);
    return scoped ? { kind: 'scope', outs: hm.map(([f]) => f) } : { kind: 'whole', why: 'meta が html 全体を刻む' };
  }
  // meta がすべての正本にあり html を刻まない → 読まない(来歴の meta が器の宣言した入力 —— 器の本文の文言の言及で html 読みにしない)
  if (metas.length && metas.every(([, m]) => !!m)) return { kind: 'none', why: 'meta が html を刻まない' };
  const texts = harnessClosureTexts(st, opt.root, opt.readText);
  for (const [rel, t] of texts) if (!HTML_READ_SCAN_SKIP.includes(rel) && /index\.html/.test(t)) return { kind: 'whole', why: '器の本文 ' + rel };
  if (!texts.size) return { kind: 'whole', why: 'meta も器の本文も引けない' };
  return { kind: 'none' };
}

/** html 読みの静的な走査で見ない共通の器(既定の対象名として 'beta/index.html' を持つだけで、読むのは呼び出した器)。 */
export const HTML_READ_SCAN_SKIP = ['tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];

/** html の生成領域の中身を除いた本文(印は残す・無い領域は `missing` に返す)。 */
export function stripHtmlRegions(text, regions) {
  let t = String(text);
  const missing = [];
  for (const r of [...new Set(regions || [])].sort()) {
    const a = t.indexOf(htmlGenBegin(r)), b = t.indexOf(htmlGenEnd(r));
    if (a < 0 || b < a) { missing.push(r); continue; }
    t = t.slice(0, a + htmlGenBegin(r).length) + '\n' + t.slice(b);
  }
  return { text: t, missing };
}

/** 表の依存(tableDeps)の上流・下流の推移閉包。 */
export function depClosures(deps) { return closures(deps); }

/**
 * 鎖の各段の**入力の並び**(`inputDigest` が段を入れる直前に hash を引く)。純関数(ファイルの中身は読まない —— meta と器の本文の名指しだけ)。
 * 読む正本 = 正本の meta.inputs[]・inputsStable[]・target(html 以外)∪ 器が名指しする正本(`harnessReads`)∪ 表の直接の依存の書くファイル
 * (html を書く段への依存は html の読み方で見る)∪ 段の `reads`(stub)。自分が書くファイルは除く(同じファイルの上流は mark: で見る)。
 * 表の段が書くファイルは**書き手が上流にあるときだけ**入れる(前回の世代を読む循環の読み —— STATIC_READ_DECL —— は入れない)。
 * @param {object} rows buildChain の段(mode・deps・sameFileUps・writes)
 * @param {{by:Map, root?:string, steps?:Array, deps?:Map, metaOf?:Function}} o
 * @returns {Map<string,string[]>}
 */
export function chainInputSpecs(rows, o) {
  const opt = o || {};
  const steps = opt.steps || REGEN_STEPS;
  const by = opt.by || new Map(steps.map((z) => [z.key, z]));
  const deps = opt.deps || tableDeps({ root: opt.root, steps });
  const { up, down } = closures(deps);
  const W = writersMap(steps);
  const cur = new Set(steps.filter((z) => z.role !== 'history').map((z) => z.key));
  const metaOf = opt.metaOf || (opt.root ? (f) => readMetaAt(opt.root, f) : null);
  const reads = new Map();
  if (opt.root) for (const r of harnessReads({ root: opt.root, steps })) { if (!reads.has(r.key)) reads.set(r.key, new Set()); reads.get(r.key).add(r.file); }
  const writers = steps.filter((z) => z.role !== 'history' && !z.outside && (z.htmlRegions || []).length);
  const res = new Map();
  for (const k of Object.keys(rows)) {
    const st = by.get(k) || { key: k, outs: [], cmd: rows[k].cmd };
    const specs = [];
    for (const u of (rows[k].sameFileUps || []).slice().sort()) specs.push('mark:' + u);
    const own = new Set(writesOf(st).concat(st.touches || []));   // outs の外に書くファイル(touches)も自分の書き
    const want = new Set(st.reads || []);
    for (const f of (reads.get(k) || [])) want.add(f);
    // 表の外のデータ(観測値の CSV・宣言の表・凍結の写し)を器の本文(import の閉包・注釈は除く)の名指しから
    if (opt.root) for (const [, t] of harnessClosureTexts(st, opt.root)) {
      for (const m of t.matchAll(/\b(paper\/data\/[A-Za-z0-9_.-]+\.(?:csv|json)|tests\/data-[A-Za-z0-9_.-]+\.json|tests\/fixtures\/[A-Za-z0-9_.-]+\.json)\b/g)) want.add(m[1]);
      for (const m of t.matchAll(/'paper',\s*'data',\s*'([A-Za-z0-9_.-]+\.(?:csv|json))'/g)) want.add('paper/data/' + m[1]);
    }
    if (metaOf) for (const out of (st.outs || [])) {
      const m = metaOf(out);
      if (!m) continue;
      for (const z of [...(m.inputs || []), ...(m.inputsStable || [])]) if (z && z.file) want.add(z.file);
      if (m.target && !/\.html$/.test(String(m.target))) want.add(m.target);
    }
    for (const d of (deps.get(k) || [])) {
      const ds = by.get(d);
      if (!ds || (ds.htmlRegions || []).length) continue;
      for (const f of writesOf(ds)) want.add(f);
    }
    const upK = up.get(k) || new Set();
    for (const f of [...want].sort()) {
      if (own.has(f) || /\.html$/.test(f)) continue;
      const ws = (W.get(f) || []).filter((w) => cur.has(w) && w !== k);
      if (ws.length && !ws.some((w) => upK.has(w))) continue;   // 書き手が上流に無い(前回の世代の読み・宣言した言及)—— 入れない
      specs.push((/\.json$/.test(f) ? 'json:' : 'bytes:') + f);
    }
    const h = htmlReadOf(st, { root: opt.root, metaOf });
    if (h.kind === 'scope') for (const out of h.outs) specs.push('html:scope:' + out);
    else if (h.kind === 'gen' || h.kind === 'whole') {
      const dn = down.get(k) || new Set();
      const regs = writers.filter((w) => w.key === k || dn.has(w.key)).flatMap((w) => w.htmlRegions);
      specs.push(regs.length ? 'html:strip:' + [...new Set(regs)].sort().join(',') : 'html:whole');
    }
    const envs = new Set(Object.keys(st.env || {}));
    for (const m of String(st.cmd || '').matchAll(/\$([A-Z_][A-Z0-9_]*)/g)) envs.add(m[1]);
    for (const e of [...envs].sort()) specs.push('env:' + e);
    res.set(k, specs);
  }
  return res;
}

/**
 * 正本の**意味的出力**の hash(JSON は宣言した除外 Pointer ∪ SEMANTIC_RUN_META を除いた安定 hash・読めなければバイト sha・無ければ 'missing')。
 * @param {string} abs 絶対パス
 * @param {string} rel 相対パス(除外 Pointer の宣言を引く鍵)
 */
export function semanticSha(abs, rel) {
  let buf;
  try { buf = fs.readFileSync(abs); } catch { return 'missing'; }
  if (/\.json$/.test(rel)) {
    try {
      const J = JSON.parse(buf.toString('utf8'));
      return 'sem:' + stableValueSha(J, [...new Set(volatilePathsOf(rel).concat(SEMANTIC_RUN_META))]);
    } catch { /* バイトで */ }
  }
  return 'bytes:' + crypto.createHash('sha256').update(buf).digest('hex');
}

/**
 * 入力の並び → **契約**(静的な部分と各入力の hash の sha256)。段を入れる直前に鎖のランナーが `--digest` で呼ぶ。
 * @param {string[]} specs chainInputSpecs の並び
 * @param {{root:string, html:string, logDir?:string, staticContract:string}} o html は絶対パス(REGEN_HTML)・logDir は済み印と領域 hash の控えの置き場
 * @returns {{contract:string, lines:string[]}}
 */
export function inputDigest(specs, o) {
  const root = String(o.root).replace(/\/$/, '');
  const htmlAbs = o.html && o.html.startsWith('/') ? o.html : root + '/' + (o.html || HTML_TARGET);
  let htmlText = null, htmlSha = null;
  const html = () => {
    if (htmlText === null) { try { const b = fs.readFileSync(htmlAbs); htmlText = b.toString('utf8'); htmlSha = crypto.createHash('sha256').update(b).digest('hex'); } catch { htmlText = ''; htmlSha = 'missing'; } }
    return htmlText;
  };
  const cacheDir = o.logDir ? o.logDir.replace(/\/$/, '') + '/.digest' : null;
  const lines = [];
  for (const spec of (specs || [])) {
    const i = spec.indexOf(':');
    const kind = spec.slice(0, i), arg = spec.slice(i + 1);
    let v;
    if (kind === 'json' || kind === 'bytes') v = kind === 'json' ? semanticSha(root + '/' + arg, arg) : (shaFile(root + '/' + arg) || 'missing');
    else if (kind === 'env') v = process.env[arg] === undefined ? '(unset)' : sha256Hex(String(process.env[arg]));
    else if (kind === 'mark') {
      let t = null;
      try { t = fs.readFileSync((o.logDir || '') + '/done/' + arg + '.done', 'utf8').split('\n'); } catch { t = null; }
      v = !t ? 'missing' : (/^(run|manual)\b/.test(t[0]) ? sha256Hex(t[0] + '\n' + (t[1] || '')) : 'noRun');
    } else if (kind === 'html') {
      html();
      if (arg === 'whole') v = htmlSha;
      else if (arg.startsWith('strip:')) {
        const r = stripHtmlRegions(htmlText, arg.slice(6).split(','));
        v = sha256Hex(r.text) + (r.missing.length ? '(印なし ' + r.missing.join(',') + ')' : '');
      } else if (arg.startsWith('scope:')) {
        const out = arg.slice(6);
        const m = readMetaAt(root, out);
        if (!(m && m.scope && m.scopeComplete === true)) v = 'whole:' + htmlSha;
        else {
          const key = sha256Hex(htmlSha + '\n' + canonJson(m.scope));
          const cf = cacheDir ? cacheDir + '/scope-' + key : null;
          let got = null;
          if (cf) { try { got = fs.readFileSync(cf, 'utf8').trim(); } catch { got = null; } }
          if (!got) {
            let r = null;
            try { r = scopeHash(htmlAbs, m.scope); } catch { r = null; }
            got = r && r.scopeComplete ? r.scopeSha256 : 'incomplete:' + htmlSha;
            if (cf) { try { fs.mkdirSync(cacheDir, { recursive: true }); fs.writeFileSync(cf, got + '\n'); } catch { /* 控えは任意 */ } }
          }
          v = got;
        }
      } else v = 'unknown-html-spec';
    } else v = 'unknown-spec';
    lines.push(spec + ' ' + v);
  }
  return { contract: sha256Hex(JSON.stringify({ contract: CHAIN_CONTRACT_VERSION, static: o.staticContract || null, inputs: lines })), lines };
}

// ======================================================================================================
// 第287便f(原仮定者の裁定(第77報)AN69 後半・統括の検証項目 R112): **html を書く段の検査**(`tableDepsAudit` の `html` —— `--audit`)
//   html を書く段(assessed・obscompare・samplestatus —— 表の `htmlRegions`)は生成領域だけを書く。「末尾に移したから依存が満たされる」とは
//   決めず、次を**機械で**照合する:
//     ① 書く段の宣言 = 器の本文(import の閉包・注釈は除く)が `writeFileSync(HTML …)` と index.html を持つ段(宣言漏れ・古い宣言 0)・
//        htmlWriteMode:'check' の段は cmd が --check
//     ② 宣言した領域の印(// >>> w275a-generated: <領域>)が html にあり、器の本文が領域名を持つ・同じ領域を 2 段が書かない
//     ③ 書く段どうしが表の依存の推移閉包で全順序(同じ html を並べて書かない)
//     ④ **after 欠落**: html の本文を読む段(`htmlReadOf` = whole)は、鎖で書く段(check でない)の**どちらか側に順序がある**こと
//        (上流 = 書き手が自分の正本を読む/下流 = 書いた後の html を読む —— AN53 の形)。どちらでもない段は欠落。
//        上流にいて常時群でない段(書かれた後に刻印が古くなる)は `beforeStale`
//     ⑤ 領域を宣言した段(scope)の依存閉包(最上位の文)と定数が、書き手が上流に無い生成領域に**重ならない**こと(重なれば下流に置くべき)
//     ⑥ 表の依存(after ∪ meta の入力の書き手)に循環が無い
//   **末尾の型への移行の残り**(`tailBacklog`): html 本文を刻む段のうち書く段の**後**にいる段(AN53 で後ろへ回した段)。末尾の型は
//   「書く段が DAG の末尾・読む段はすべて上流」で、これらの段の刻印を「生成領域を除いた本文」の hash へ替えるまで移れない(判定には使わない)。
// ======================================================================================================

/**
 * 第287便f: **領域の閉包が上流の段の書く生成領域に掛かる読み**の宣言(順序では直せない —— 書き手がこの段の正本を読むので、下流へ置くと循環)。
 * 宣言が実態に合わなくなったら `staleRegionDecl`。**直し方は領域の宣言(器の REGEN_SCOPE の roots / 停止集合)の側**で、鎖の順序ではない。
 */
export const HTML_REGION_READ_DECL = [
  // 第288便f(原仮定者の裁定(第78報)AN90): 第287便f の宣言 { key:'pn1', region:'obs-compare', kind:'scope-closure-cycle' } を**外した**。
  //   外す前に読込依存を機械で検査した(QA lint.pn1RegionDecl・自己試験 (q6)(q6b)): pn1 の器の領域の閉包が観測対実行の生成領域に掛かっていたのは、
  //   器の局所名(λ_PN=0 の対照行)が html の関数 obsCompareRows と同じ綴りで、領域の下限の自動導出(deriveScope —— 名前で数える)が
  //   それを roots に入れていたから(器は html のその関数を 1 度も呼ばない)。局所名と正本の鍵を lambda0Rows に改名し、roots から外すと
  //   宣言の閉包・自動導出の下限のどちらも OBS_COMPARE_* に掛からない(閉包 877 → 869 名・生成領域との重なり 3 文 → 0)。
];

const htmlAuditCache = new Map();
/** html の最上位の文の分解(本文の sha で控える)。 */
function htmlParsedOf(htmlText) {
  const key = sha256Hex(htmlText);
  if (htmlAuditCache.has(key)) return htmlAuditCache.get(key);
  const sIdx = htmlText.indexOf('<script>'), eIdx = htmlText.lastIndexOf('</script>');
  const src = sIdx >= 0 && eIdx > sIdx ? htmlText.slice(sIdx + '<script>'.length, eIdx) : '';
  let parsed = null;
  try { parsed = parseTopLevel(src); } catch { parsed = null; }
  const v = { src, parsed, closures: new Map() };
  htmlAuditCache.clear();
  htmlAuditCache.set(key, v);
  return v;
}

/**
 * html を書く段の検査(上の ①〜⑥)。
 * @param {{root:string, steps?:Array, metaOf?:Function, readText?:Function, htmlText?:string}} o
 */
export function htmlTailAudit(o) {
  const opt = o || {};
  const steps = opt.steps || REGEN_STEPS;
  const root = String(opt.root).replace(/\/$/, '');
  const readText = opt.readText || ((rel) => { try { return fs.readFileSync(root + '/' + rel, 'utf8'); } catch { return null; } });
  const metaOf = opt.metaOf || ((f) => readMetaAt(root, f));
  const htmlText = opt.htmlText !== undefined ? opt.htmlText : (readText(HTML_TARGET) || '');
  const cur = steps.filter((z) => z.role !== 'history' && !z.outside);
  const deps = tableDeps({ root, steps, metaOf });
  const { up, down } = closures(deps);
  const U = (k) => up.get(k) || new Set(), D = (k) => down.get(k) || new Set();
  // ⑥
  const cycles = cur.filter((z) => U(z.key).has(z.key)).map((z) => z.key);
  const writers = cur.filter((z) => (z.htmlRegions || []).length);
  const chainWriters = writers.filter((z) => z.htmlWriteMode !== 'check');
  // ①
  const textsOf = new Map(cur.map((z) => [z.key, harnessClosureTexts(z, root, readText)]));
  // 第288便f(AN90): 書く段 = 器の本文が html を直に書く(writeFileSync(HTML …)+ index.html)か、一時出力の書き口 writeHtmlStaged(HTML …)を呼ぶ段
  const writesHtml = (st) => { for (const [rel, t] of textsOf.get(st.key)) if ((/writeFileSync\(\s*HTML\b/.test(t) && /index\.html/.test(t)) || /\bwriteHtmlStaged\(\s*HTML\b/.test(t)) return rel; return null; };
  const directWrites = (st) => { for (const [rel, t] of textsOf.get(st.key)) if (/writeFileSync\(\s*HTML\b/.test(t)) return rel; return null; };
  const stagedWrites = (st) => [...textsOf.get(st.key).values()].some((t) => /\bwriteHtmlStaged\(\s*HTML\b/.test(t));
  const undeclared = [], staleDecl = [], checkMode = [];
  for (const st of cur) {
    const w = writesHtml(st);
    const decl = writers.includes(st);
    if (w && !decl) undeclared.push(st.key + '(' + w + ')');
    if (!w && decl) staleDecl.push(st.key);
  }
  for (const st of writers) if (st.htmlWriteMode === 'check' && !/\s--check\b/.test(st.cmd)) checkMode.push(st.key);
  // ②
  const regionMissing = [], regionDup = [];
  const owner = new Map();
  for (const st of writers) for (const r of st.htmlRegions) {
    if (owner.has(r)) regionDup.push(r + ':' + owner.get(r) + '+' + st.key); else owner.set(r, st.key);
    if (htmlText.indexOf(htmlGenBegin(r)) < 0 || htmlText.indexOf(htmlGenEnd(r)) < 0) regionMissing.push(st.key + ':' + r + '(html に印が無い)');
    if (![...textsOf.get(st.key).values()].some((t) => t.indexOf(r) >= 0)) regionMissing.push(st.key + ':' + r + '(器の本文に領域名が無い)');
  }
  // ③
  const writerUnordered = [];
  for (let i = 0; i < writers.length; i++) for (let j = i + 1; j < writers.length; j++) {
    const a = writers[i].key, b = writers[j].key;
    if (!U(a).has(b) && !U(b).has(a)) writerUnordered.push(a + '|' + b);
  }
  // ④
  const afterMissing = [], beforeStale = [], beforeAlways = [], tail = new Set(), reads = { whole: 0, scope: 0, none: 0 };
  const scopeReaders = [];
  // ⑧ 第288便f(AN90): 集約段(htmlAggregate)—— 1 段・常時群・単独・全ての書く段の下流。html 全体を読む段で書く段の下流にいるものは集約段の下流
  const aggs = cur.filter((z) => z.htmlAggregate);
  const agg = aggs.length === 1 ? aggs[0] : null;
  const aggregator = { steps: aggs.map((z) => z.key), stageVersion: HTML_STAGE_VERSION, order: HTML_STAGE_ORDER.slice(), bad: [] };
  if (aggs.length !== 1) aggregator.bad.push('集約段が ' + aggs.length + ' 段(1 段であること)');
  if (agg) {
    if (!agg.alwaysRun) aggregator.bad.push(agg.key + ' が常時群でない');
    if (!agg.exclusive) aggregator.bad.push(agg.key + ' が単独(exclusive)でない');
    if (!/\btools\/regen-html-aggregate\.mjs\b/.test(agg.cmd)) aggregator.bad.push(agg.key + ' の cmd が tools/regen-html-aggregate.mjs でない');
    for (const w of writers) if (!U(agg.key).has(w.key)) aggregator.bad.push(w.key + ' が集約段の上流に無い');
  }
  // ⑦ 鎖で書く段(check でない)は一時出力の書き口を使う(直書きしない)
  const directWrite = [];
  for (const w of chainWriters) { const d = directWrites(w); if (d || !stagedWrites(w)) directWrite.push(w.key + (d ? '(直書き ' + d + ')' : '(writeHtmlStaged を呼ばない)')); }
  // 断片の順序 = 書く段の全順序(上流の書く段の領域が HTML_STAGE_ORDER で先)
  const stageOrder = [];
  for (const w of writers) for (const r of w.htmlRegions) if (HTML_STAGE_ORDER.indexOf(r) < 0) stageOrder.push(w.key + ':' + r + '(HTML_STAGE_ORDER に無い)');
  for (const a of writers) for (const b of writers) if (a !== b && U(b.key).has(a.key)) for (const ra of a.htmlRegions) for (const rb of b.htmlRegions)
    if (HTML_STAGE_ORDER.indexOf(ra) >= 0 && HTML_STAGE_ORDER.indexOf(rb) >= 0 && HTML_STAGE_ORDER.indexOf(ra) > HTML_STAGE_ORDER.indexOf(rb)) stageOrder.push(ra + '>' + rb);
  const aggMissing = [];
  for (const st of cur) {
    if (writers.includes(st)) continue;
    const h = htmlReadOf(st, { root, metaOf, readText });
    reads[h.kind] = (reads[h.kind] || 0) + 1;
    if (h.kind === 'scope') { scopeReaders.push([st, h]); continue; }
    if (h.kind !== 'whole') continue;
    if (st.htmlAggregate) continue;
    if (agg && chainWriters.some((w) => U(st.key).has(w.key)) && !U(st.key).has(agg.key)) aggMissing.push(st.key);
    for (const w of chainWriters) {
      if (U(st.key).has(w.key)) { tail.add(st.key); continue; }
      // 書き手の上流: 常時群は毎回刻み直す・meta を刻まない段は古くなる刻印が無い(情報)/ html 全体を刻む現行の段は書かれた後に刻印が古くなる
      if (D(st.key).has(w.key)) { (st.alwaysRun || h.why !== 'meta が html 全体を刻む' ? beforeAlways : beforeStale).push(st.key + '<' + w.key); continue; }
      afterMissing.push(st.key + '?' + w.key + '(' + (h.why || '') + ')');
    }
  }
  // ⑤ 領域の宣言の閉包が、上流に無い書き手の生成領域に重なるか(最上位の文の範囲で)
  const scopeReadsRegion = [];
  const P = htmlParsedOf(htmlText);
  const ranges = [];
  for (const w of chainWriters.concat(writers.filter((z) => z.htmlWriteMode === 'check'))) for (const r of w.htmlRegions) {
    const a = P.src.indexOf(htmlGenBegin(r)), b = P.src.indexOf(htmlGenEnd(r));
    if (a >= 0 && b > a) ranges.push({ writer: w.key, region: r, a, b });
  }
  let scopeChecked = 0;
  const declaredRegionReads = [], usedDecl = new Set();
  if (P.parsed) for (const [st, h] of scopeReaders) for (const out of h.outs) {
    const m = metaOf(out);
    if (!m || !m.scope) continue;
    const sc = normalizeScope(m.scope);
    const ck = canonJson({ v: m.scope.version || null, roots: sc.roots, consts: sc.consts });
    let segs = P.closures.get(ck);
    if (!segs) {
      const stop = m.scope.version === 'w286d-scope-4' ? SCOPE_STOP : SCOPE_STOP.filter((n) => n !== 'lcAfterStep' && n !== 'lcReset');
      let cl = null;
      try { cl = closureOf(P.parsed, sc.roots, undefined, { hardStop: stop }); } catch { cl = null; }
      segs = cl ? cl.segIdx.map((i) => P.parsed.segments[i]) : [];
      for (const nm of sc.consts) for (const s of P.parsed.segments) if ((s.names || []).includes(nm)) segs.push(s);
      P.closures.set(ck, segs);
    }
    scopeChecked++;
    for (const g of ranges) {
      if (U(st.key).has(g.writer)) continue;   // 書き手が上流(書いた後に読む)なら重なってよい
      // 文の始まりが領域の中 / 文が領域をまたぐ(直前の文の末尾の注釈が印の行に掛かるだけの重なりは数えない)
      if (segs.some((s) => (g.a <= s.start && s.start < g.b) || (s.start < g.a && s.end > g.b))) {
        const d = (opt.regionDecl || HTML_REGION_READ_DECL).find((z) => z.key === st.key && z.region === g.region);
        if (d) { declaredRegionReads.push(st.key + '→' + g.region); usedDecl.add(d.key + '|' + d.region); }
        else scopeReadsRegion.push(st.key + '→' + g.region);
      }
    }
  }
  const staleRegionDecl = (opt.regionDecl || HTML_REGION_READ_DECL).filter((z) => !usedDecl.has(z.key + '|' + z.region)).map((z) => z.key + '→' + z.region);
  aggregator.ok = aggregator.bad.length === 0;
  const ok = !cycles.length && !undeclared.length && !staleDecl.length && !checkMode.length && !regionMissing.length && !regionDup.length
    && !writerUnordered.length && !afterMissing.length && !beforeStale.length && !scopeReadsRegion.length && !staleRegionDecl.length && !!P.parsed
    && !directWrite.length && !stageOrder.length && !aggMissing.length && aggregator.ok;
  return { ok, writers: writers.map((z) => z.key + '[' + z.htmlRegions.join(',') + (z.htmlWriteMode === 'check' ? '・check' : '') + ']'),
    aggregator, directWrite, stageOrder, aggMissing,
    cycles, undeclared, staleDecl, checkMode, regionMissing, regionDup, writerUnordered, afterMissing, beforeStale,
    beforeAlways: [...new Set(beforeAlways)], scopeReadsRegion: [...new Set(scopeReadsRegion)], declaredRegionReads: [...new Set(declaredRegionReads)], staleRegionDecl, scopeChecked, reads,
    tailBacklog: [...tail].sort(), parsed: !!P.parsed };
}

/** 優先度: 自分から下流の端までの実測秒の最長路(臨界路)の長い順 → 表の順。 */
export function chainPriority(chain, tableIdx) {
  const rows = chain.steps;
  const down = new Map(Object.keys(rows).map((k) => [k, []]));
  for (const [k, r] of Object.entries(rows)) for (const d of (r.deps || [])) if (down.has(d)) down.get(d).push(k);
  const memo = new Map();
  const cp = (k) => { if (memo.has(k)) return memo.get(k); const v = (rows[k].sec || 0) + Math.max(0, ...down.get(k).map(cp)); memo.set(k, v); return v; };
  const idx = tableIdx || new Map(Object.keys(rows).map((k, i) => [k, i]));
  return Object.keys(rows).sort((a, b) => (cp(b) - cp(a)) || ((idx.get(a) ?? 0) - (idx.get(b) ?? 0)));
}

/**
 * ready queue の模擬(離散事象 —— 生成するシェルのランナーと同じ規則): 依存(鎖の中)がすべて済み・書くファイルが走行中の段と
 * 重ならない・worker の空き(レーン)がある段を、優先度の順に入れる。所要は表の実測秒(**見積り**・0 秒の段は 0)。
 * @param {object} chain buildChain の戻り
 * @param {{lanes?:number, secOf?:(k)=>number}} [o]
 * @returns {{makespan:number, events:Array<{key,start,end,workers}>, check:object}}
 */
export function simulateReadyQueue(chain, o) {
  const opt = o || {};
  const lanes = opt.lanes || 4;
  const rows = chain.steps;
  const secOf = opt.secOf || ((k) => rows[k].sec || 0);
  const pri = chain.priority || chainPriority(chain);
  const state = new Map(pri.map((k) => [k, 'pending']));
  const running = [];
  const lock = new Map();
  const events = [];
  let t = 0, free = lanes;
  for (let guard = 0; guard < 100000; guard++) {
    for (const k of pri) {
      if (state.get(k) !== 'pending') continue;
      const r = rows[k];
      if (!(r.deps || []).every((d) => state.get(d) === 'ok' || !state.has(d))) continue;
      if ((r.writes || []).some((f) => lock.has(f))) continue;
      const need = r.workers === 'all' ? lanes : Math.min(r.workers || 1, lanes);
      if (need > free) continue;
      free -= need; for (const f of (r.writes || [])) lock.set(f, k);
      state.set(k, 'running');
      const ev = { key: k, start: t, end: t + secOf(k), workers: need };
      running.push(ev); events.push(ev);
    }
    if (!running.length) break;
    running.sort((a, b) => a.end - b.end);
    const ev = running.shift();
    t = ev.end;
    free += ev.workers; for (const f of (rows[ev.key].writes || [])) if (lock.get(f) === ev.key) lock.delete(f);
    state.set(ev.key, 'ok');
  }
  const check = checkTimeline(events, { rows, lanes });
  return { makespan: events.reduce((m, e) => Math.max(m, e.end), 0), events, pending: [...state].filter(([, s]) => s !== 'ok').map(([k]) => k), check };
}

/** 波の型(第283便e —— 波ごとに全段の完了を待つ・波の中は LPT)の見積り: 波ごとの最大レーンの秒の和。 */
export function waveMakespan(chain, lanes, secOf) {
  const so = secOf || ((k) => (chain.steps[k] || {}).sec || 0);
  return chain.waves.reduce((a, keys) => a + Math.max(0, ...laneSplit(keys, so, lanes || 4).map((l) => l.sec)), 0);
}

/**
 * 走行の時系列の照合(模擬と実際の走行の両方): events = [{key, start, end, workers?}](同じ段が複数回あってよい)。
 *   order  … 依存 d(rows[k].deps —— 鎖の中の直接の上流。推移は直接の辺の連鎖で守られる)の**最後の end より前**に k が start した
 *   writes … 書くファイルが重なる 2 段の走行区間が重なった
 *   budget … 同時に走った worker の和がレーンを超えた
 * @param {Array} events
 * @param {{rows:object, lanes:number}} o
 */
export function checkTimeline(events, o) {
  const rows = o.rows || {};
  const order = [], writes = [], budget = [];
  const byKey = new Map();
  for (const e of events) { if (!byKey.has(e.key)) byKey.set(e.key, []); byKey.get(e.key).push(e); }
  for (const e of events) for (const d of ((rows[e.key] || {}).deps || [])) {
    const runs = byKey.get(d) || [];
    if (!runs.length) continue;
    const lastEnd = Math.max(...runs.map((z) => z.end));
    if (e.start < lastEnd - 1e-9) order.push({ step: e.key, dep: d, start: e.start, depEnd: lastEnd });
  }
  for (let i = 0; i < events.length; i++) for (let j = i + 1; j < events.length; j++) {
    const a = events[i], b = events[j];
    if (a.key === b.key) continue;
    const wa = (rows[a.key] || {}).writes || [], wb = (rows[b.key] || {}).writes || [];
    const f = wa.find((x) => wb.includes(x));
    if (f && a.start < b.end - 1e-9 && b.start < a.end - 1e-9) writes.push({ a: a.key, b: b.key, file: f });
  }
  const pts = [...new Set(events.flatMap((e) => [e.start]))];
  for (const t of pts) {
    const wOf = (e) => { const d = (rows[e.key] || {}).workers; return e.workers || (d === 'all' ? (o.lanes || 4) : Math.min(d || 1, o.lanes || 4)); };
    const w = events.filter((e) => e.start <= t + 1e-9 && t < e.end - 1e-9).reduce((s, e) => s + wOf(e), 0);
    if (w > (o.lanes || 4)) budget.push({ t, workers: w });
  }
  return { ok: !order.length && !writes.length && !budget.length, order, writes, budget };
}

/** `$REGEN_LOG/timeline.txt` → events(start/end の対)と lanes。 */
export function parseTimeline(text) {
  const open = new Map(), events = [];
  let lanes = null;
  for (const line of String(text).split(/\r?\n/)) {
    const m = line.match(/^# ready-queue .* lanes=(\d+)/); if (m) { lanes = Number(m[1]); continue; }
    const s = line.split(/\s+/);
    if (s[0] === 'start') open.set(s[1], { key: s[1], start: Number(s[2]), workers: Number(s[3]) || undefined });
    else if (s[0] === 'end' && open.has(s[1])) { const e = open.get(s[1]); open.delete(s[1]); e.rc = Number(s[2]); e.end = Number(s[3]); events.push(e); }
  }
  for (const e of open.values()) { e.end = Infinity; events.push(e); }
  events.sort((a, b) => a.start - b.start);
  return { events, lanes };
}

/**
 * 鎖 → bash(**走らせない** —— 文字列を返す)。第284便f で **ready queue** に替えた(第283便e の波は `wave` の番号とログ名だけに残る)。
 *   ・段は優先度(臨界路の長い順)に並べ、依存(鎖の中)の済んだ段から、書くファイルが走行中の段と重ならず worker の空きがあるものを
 *     空きレーン(≤ REGEN_LANES)へ入れる。1 段でも rc≠0 → 新しい段を入れず、走行中の段の終わりを待って止まる(rc 1)。
 *   ・済み印 `$REGEN_LOG/done/<段>.done` の 2 行目 `contract <64 桁>` が**この鎖の契約と同じとき**だけ済み(再開)。違う印は
 *     `<段>.done.stale` へ退けて走らせ直す。印には走行後の書いたファイルの sha256 を `out <file> <sha>` で残す(監査用)。
 *   ・時系列 `$REGEN_LOG/timeline.txt`(`start <段> <秒> <workers>` / `end <段> <rc> <秒>`)—— `--check-order <timeline>` が照合する。
 *   ・ログ名 `$REGEN_LOG/<波 2 桁>-<段>.log`(gate の判定は `.gate`・失敗の rc は `.rc`)。
 *   ・cmd が `$NAME` で参照する環境変数は冒頭で必須にする(未設定なら走らせる前に止まる)。
 * @param {object} chain buildChain の戻り
 * @param {{lanes?:number, htmlSha?:string}} [o]
 */
export function chainShell(chain, o) {
  const opt = o || {};
  const lanes = opt.lanes || 4;
  const L = [];
  const keys = chain.priority || chainPriority(chain);
  L.push('#!/usr/bin/env bash');
  L.push('# 生成物(手で直さない): node tools/regen-chain.mjs —— 再生成表 ' + chain.version
    + (opt.htmlSha ? '・html ' + String(opt.htmlSha).slice(0, 12) : '')
    + `・段 run ${chain.count.run} / gate ${chain.count.gate} / manual ${chain.count.manual}・ready queue(レーン ≤${lanes}・書込排他・worker 予算)`);
  L.push('# 済み印 $REGEN_LOG/done/<段>.done は契約(' + CHAIN_CONTRACT_VERSION + ' —— 静的な policy/code と、段を入れる直前に引く入力の安定 hash)が同じときだけ再開に使う。rc≠0 の段があれば、走行中の段の終わりで止まる(rc 1)。');
  L.push('# gate の段は上流が走った後に `node tools/regen-chain.mjs --gate <段>` で自分の判定を引き直し、再利用なら走らせない。');
  L.push('set -u');
  L.push('ROOT=${REGEN_ROOT:-$(pwd)}');
  L.push('REGEN_HTML=${REGEN_HTML:-beta/index.html}');
  L.push('REGEN_LOG=${REGEN_LOG:-${TMPDIR:-/tmp}/regen-chain' + (opt.htmlSha ? '-' + String(opt.htmlSha).slice(0, 12) : '') + '}');
  L.push(`REGEN_LANES=\${REGEN_LANES:-${lanes}}`);
  L.push('REGEN_TOOL=${REGEN_TOOL:-tools/regen-chain.mjs}   # 第287便f: 入力の安定 hash を引く器(--digest)');
  L.push('DONE="$REGEN_LOG/done"; ST="$REGEN_LOG/.st"; mkdir -p "$DONE" "$ST" || exit 2; rm -f "$ST"/*.rc');
  L.push('cd "$ROOT" || exit 2');
  // 第288便f(原仮定者の裁定(第78報)AN90): html を書く段は一時出力の断片を $REGEN_HTML_STAGE へ(集約段 htmlagg が 1 回だけ html を書く)・
  //   鎖を回した Node と Chromium の版を $REGEN_LOG/env.json に記録(1 ulp の切り分け用 —— 版は固定しない。REGEN_ENV_BROWSER=0 で Chromium を起こさない)
  L.push('export REGEN_HTML_STAGE="${REGEN_HTML_STAGE:-$REGEN_LOG/html}"; mkdir -p "$REGEN_HTML_STAGE" || exit 2');
  L.push('node "$REGEN_TOOL" --env >"$REGEN_LOG/env.json" 2>/dev/null || echo "{}" >"$REGEN_LOG/env.json"');
  const envNeed = new Map();
  for (const r of Object.values(chain.steps)) for (const m of String(r.cmd).matchAll(/\$([A-Z_][A-Z0-9_]*)/g)) {
    if (!envNeed.has(m[1])) envNeed.set(m[1], []);
    envNeed.get(m[1]).push(r.key + (r.env && r.env[m[1]] ? '(' + r.env[m[1]] + ')' : ''));
  }
  for (const [v, who] of envNeed) L.push(`: "\${${v}:?${v} が要る —— ${who.join('・').replace(/["`$\\]/g, '')}}"`);
  L.push('contract_of() {   # $1=段 $2=静的な契約 → 標準出力に契約(静的 + 入力の安定 hash)。各入力の hash は $ST/<段>.in(済み印に写す)');
  L.push('  node "$REGEN_TOOL" --digest --static "$2" --html "$REGEN_HTML" --log "$REGEN_LOG" --lines "$ST/$1.in" -- ${IN[$1]}');
  L.push('}');
  L.push('mark_ok() {   # $1=段 $2=契約: 同じ契約の済み印だけを済みと見なす');
  L.push('  [ -f "$DONE/$1.done" ] || return 1');
  L.push('  if grep -qx "contract $2" "$DONE/$1.done"; then return 0; fi');
  L.push('  mv -f "$DONE/$1.done" "$DONE/$1.done.stale"; echo "[旧印] $1: 済み印の契約がこの鎖と違う → 走らせ直す($DONE/$1.done.stale)"; return 1');
  L.push('}');
  L.push('write_mark() {   # $1=段 $2=状態の行 $3=契約 $4=書くファイル $5=静的な契約(入力の hash は $ST/<段>.in —— 走らせる前に引いた値)');
  L.push('  { echo "$2"; echo "contract $3"; echo "static $5"; [ -f "$ST/$1.in" ] && sed "s/^/in /" "$ST/$1.in"; local f; for f in $4; do if [ -f "$f" ]; then echo "out $f $(sha256sum "$f" | cut -c1-64)"; fi; done; } >"$DONE/$1.done"');
  L.push('}');
  L.push('run_step() {   # $1=段 $2=ログ名 $3=cmd $4=静的な契約 $5=書くファイル');
  L.push('  local c; c=$(contract_of "$1" "$4") || { echo "[止] $1 の入力の hash が引けない"; return 4; }');
  L.push('  if mark_ok "$1" "$c"; then echo "[済] $1"; return 0; fi');
  L.push('  echo "[走] $1 → $REGEN_LOG/$2.log"; local t0; t0=$(date +%s)');
  L.push('  ( eval "$3" ) >"$REGEN_LOG/$2.log" 2>&1; local rc=$?');
  L.push('  if [ $rc -ne 0 ]; then echo "$rc" >"$REGEN_LOG/$2.rc"; echo "[止] $1 rc=$rc(ログ $REGEN_LOG/$2.log)"; return $rc; fi');
  L.push('  write_mark "$1" "run $(( $(date +%s) - t0 ))s $(date -u +%FT%TZ)" "$c" "$5" "$4"');
  L.push('}');
  L.push('gate_step() {  # 上流の後で自分の判定を引き直す(終了コード 10 = 再利用)。$6=同じファイルを書く上流(実際に走っていれば再利用しない)');
  L.push('  local c; c=$(contract_of "$1" "$4") || { echo "[止] $1 の入力の hash が引けない"; return 4; }');
  L.push('  if mark_ok "$1" "$c"; then echo "[済] $1"; return 0; fi');
  L.push('  local u; for u in ${6:-}; do if [ -f "$DONE/$u.done" ] && grep -q "^run" "$DONE/$u.done"; then echo "[走・上流 $u が同じファイルを書き直した] $1"; run_step "$1" "$2" "$3" "$4" "$5"; return $?; fi; done');
  L.push('  node tools/regen-chain.mjs --gate "$1" --html "$REGEN_HTML" >"$REGEN_LOG/$2.gate" 2>&1; local g=$?');
  L.push('  if [ $g -eq 10 ]; then write_mark "$1" "reuse $(date -u +%FT%TZ)" "$c" "$5" "$4"; echo "[再利用] $1"; return 0; fi');
  L.push('  if [ $g -ne 0 ]; then echo "[止] $1 の再判定が rc=$g"; return $g; fi');
  L.push('  run_step "$1" "$2" "$3" "$4" "$5"');
  L.push('}');
  L.push('manual_step() {  # 1 行のシェルでない段: 同じ契約の済み印が無ければ止まる');
  L.push('  local c; c=$(contract_of "$1" "$4") || { echo "[止] $1 の入力の hash が引けない"; return 4; }');
  L.push('  if mark_ok "$1" "$c"; then echo "[済] $1"; return 0; fi');
  L.push('  echo "[手動] $1: $3 —— 走らせた後に printf \'manual\\ncontract %s\\n\' $c >$DONE/$1.done で再開(入力が変われば契約も変わる)"; return 3');
  L.push('}');
  // 表(段の属性 —— 書くファイルは排他の鍵 w<番号> に写す)
  const files = [...new Set(keys.flatMap((k) => chain.steps[k].writes || []))].sort();
  const fid = new Map(files.map((f, i) => [f, 'w' + i]));
  L.push('declare -a K=(' + keys.join(' ') + ')');
  const assoc = (name, f) => L.push(`declare -A ${name}=(` + keys.map((k) => `[${k}]=${shq(f(chain.steps[k]))}`).join(' ') + ')');
  assoc('DEP', (r) => (r.deps || []).join(' '));
  assoc('WR', (r) => (r.writes || []).map((f) => fid.get(f)).join(' '));
  assoc('WF', (r) => (r.writes || []).join(' '));
  assoc('NW', (r) => (r.workers === 'all' ? 'all' : String(Math.max(1, r.workers || 1))));
  assoc('FN', (r) => (r.mode === 'gate' ? 'gate_step' : r.mode === 'manual' ? 'manual_step' : 'run_step'));
  assoc('CMD', (r) => r.cmd);
  assoc('CT', (r) => r.contract || '-');
  assoc('IN', (r) => (r.inputs || []).join(' '));
  assoc('UPS', (r) => (r.mode === 'gate' ? (r.sameFileUps || []).join(' ') : ''));
  assoc('LOGN', (r) => String((r.wave || 0) + 1).padStart(2, '0') + '-' + r.key);
  L.push('declare -A STATE=() LOCK=()');
  L.push('for k in "${K[@]}"; do STATE[$k]=pending; done');
  L.push('free=$REGEN_LANES; nrun=0; stop=0');
  L.push('echo "# ready-queue $(date -u +%FT%TZ) lanes=$REGEN_LANES" >>"$REGEN_LOG/timeline.txt"');
  L.push('while :; do');
  L.push('  for k in "${K[@]}"; do   # 終わった段を回収(rc はファイルで受ける)');
  L.push('    [ "${STATE[$k]}" = running ] && [ -f "$ST/$k.rc" ] || continue');
  L.push('    rc=$(cat "$ST/$k.rc"); echo "end $k $rc $(date +%s.%N)" >>"$REGEN_LOG/timeline.txt"');
  L.push('    need=${NW[$k]}; [ "$need" != all ] && [ "$need" -le "$REGEN_LANES" ] || need=$REGEN_LANES; free=$((free + need)); nrun=$((nrun - 1))');
  L.push('    for w in ${WR[$k]}; do unset "LOCK[$w]"; done');
  L.push('    if [ "$rc" -eq 0 ]; then STATE[$k]=ok; else STATE[$k]=fail; stop=1; fi');
  L.push('  done');
  L.push('  if [ $stop -eq 0 ]; then for k in "${K[@]}"; do   # 依存が済み・書込が空き・worker が空いた段を入れる(優先度の順)');
  L.push('    [ "${STATE[$k]}" = pending ] || continue');
  L.push('    ok=1; for d in ${DEP[$k]}; do [ "${STATE[$d]}" = ok ] || { ok=0; break; }; done; [ $ok -eq 1 ] || continue');
  L.push('    for w in ${WR[$k]}; do [ -z "${LOCK[$w]:-}" ] || { ok=0; break; }; done; [ $ok -eq 1 ] || continue');
  L.push('    need=${NW[$k]}; [ "$need" != all ] && [ "$need" -le "$REGEN_LANES" ] || need=$REGEN_LANES; [ "$need" -le "$free" ] || continue');
  L.push('    free=$((free - need)); nrun=$((nrun + 1)); for w in ${WR[$k]}; do LOCK[$w]=$k; done; STATE[$k]=running');
  L.push('    echo "start $k $(date +%s.%N) $need" >>"$REGEN_LOG/timeline.txt"');
  L.push('    ( "${FN[$k]}" "$k" "${LOGN[$k]}" "${CMD[$k]}" "${CT[$k]}" "${WF[$k]}" "${UPS[$k]}"; echo $? >"$ST/$k.rc" ) &');
  L.push('  done; fi');
  L.push('  [ $nrun -gt 0 ] || break');
  L.push('  wait -n 2>/dev/null || true');
  L.push('done');
  L.push('left=""; for k in "${K[@]}"; do [ "${STATE[$k]}" = ok ] || left="$left $k"; done');
  L.push('if [ -n "$left" ]; then echo "[止] 済んでいない段:$left($REGEN_LOG)"; exit 1; fi');
  L.push('echo "[完] 鎖の全段($REGEN_LOG)"');
  return L.join('\n') + '\n';
}

/**
 * 第283便e(AN29)の**自己試験**(一時ディレクトリ —— 正本は書き換えない)。
 * 「html だけ変わる再走」を calaudit の 2 ファイルで模す: 宣言した Pointer(実行時刻・所要・非物理 meta)の値を全部書き換え、
 * diag は `/when`・`/carriedOverFrom` だけ書き換えた写しを一時 root に置く。calaudit を入力にする現行の正本ごとに
 *   old … 今の刻印の行(`inputsStable` —— 刻印時の Pointer)で一時 root と照合
 *   neu … 今の宣言の Pointer で刻み直した行(統合時の付け替えを模す —— 随伴 diag の行も足す)で照合
 *   phys … 物理欄 1 つ(presets の最初の量の値)を変えた写しで neu が**不一致になる**か
 *   diag … diag の中身(移した診断)を 1 つ変えた写しで随伴の行が**不一致になる**か
 * @param {{root:string, tmpDir:string, stableJsonSha:Function, stableMatches:Function, STABLE_VERSION:string}} o
 */
export function an29Probe(o) {
  const root = o.root.replace(/\/$/, '');
  const CAL = 'tests/out/calaudit-w249.json', DIAG = 'tests/out/calaudit-w249-diag.json';
  const J = JSON.parse(fs.readFileSync(root + '/' + CAL, 'utf8'));
  const D = JSON.parse(fs.readFileSync(root + '/' + DIAG, 'utf8'));
  const vpC = volatilePathsOf(CAL), vpD = volatilePathsOf(DIAG);
  const bump = (v) => (typeof v === 'number' ? (Number.isInteger(v) ? v + 7 : v * 1.37 + 0.5)
    : (typeof v === 'string' && /^[0-9a-f]{64}$/.test(v)) ? crypto.createHash('sha256').update(v + '|w283e').digest('hex')
      : (typeof v === 'string' && /^\d{4}-\d\d-\d\dT/.test(v)) ? '2099-01-02T03:04:05.678Z' : v);
  const setAt = (X, ptr, f) => {
    const toks = ptr.slice(1).split('/').map((t) => t.replace(/~1/g, '/').replace(/~0/g, '~'));
    let n = 0;
    const walk = (x, i) => { if (!x || typeof x !== 'object') return;
      const keys = toks[i] === '*' ? Object.keys(x) : (Object.prototype.hasOwnProperty.call(x, toks[i]) ? [toks[i]] : []);
      for (const k of keys) { if (i === toks.length - 1) { x[k] = f(x[k]); n++; } else walk(x[k], i + 1); } };
    walk(X, 0);
    return n;
  };
  const clone = (x) => JSON.parse(JSON.stringify(x));
  const Jh = clone(J), Dh = clone(D);
  let nC = 0, nD = 0;
  for (const p of vpC) nC += setAt(Jh, p, bump);
  for (const p of vpD) nD += setAt(Dh, p, bump);
  const tmp = o.tmpDir.replace(/\/$/, '');
  fs.mkdirSync(tmp + '/tests/out', { recursive: true });
  const put = (a, b) => { fs.writeFileSync(tmp + '/' + CAL, JSON.stringify(a, null, 1)); fs.writeFileSync(tmp + '/' + DIAG, JSON.stringify(b, null, 1)); };
  put(Jh, Dh);
  const newRow = (file) => ({ file, stableSha256: o.stableJsonSha(root + '/' + file, volatilePathsOf(file)), stableVersion: o.STABLE_VERSION, volatilePaths: volatilePathsOf(file) });
  // 今の宣言で刻み直した行(統合時の付け替えを模す —— stableInputs と同じ形: calaudit の行 + 随伴 diag の行)
  const newRows = () => [newRow(CAL), Object.assign(newRow(DIAG), { companionOf: CAL })];
  const rows = [];
  const W = writersMap();
  const seenOut = new Set();
  for (const st of REGEN_STEPS) {
    if (st.role === 'history') continue;
    for (const out of st.outs) {
      if (seenOut.has(out)) continue;
      seenOut.add(out);
      const m = readMetaAt(root, out);
      if (!m) continue;
      const inInputs = (m.inputs || []).some((z) => z.file === CAL);
      const oldRow = (m.inputsStable || []).find((z) => z.file === CAL) || null;
      if (!inInputs && !oldRow) continue;
      rows.push({ step: st.key, out, alwaysRun: !!st.alwaysRun, hasStable: !!oldRow,
        old: oldRow ? o.stableMatches(tmp, oldRow) : false,
        neu: stableInputOk(tmp, newRows(), CAL) });
    }
  }
  // 物理欄 1 つ(presets の最初の本の最初の量の数値)を変える → 不一致
  const Jp = clone(Jh);
  let physPath = null;
  const p0 = (Jp.presets || [])[0];
  if (p0 && Array.isArray(p0.quantities) && p0.quantities.length) {
    const q = p0.quantities[0];
    const k = Object.keys(q).find((z) => typeof q[z] === 'number' && Number.isFinite(q[z]));
    if (k) { q[k] = q[k] * (1 + 1e-12) + 1e-300; physPath = '/presets/0/quantities/0/' + k; }
  }
  put(Jp, Dh);
  const physDetected = !stableInputOk(tmp, newRows(), CAL);
  // diag の中身(移した診断)を 1 つ変える → 随伴の行が不一致
  const Dp = clone(Dh);
  const dk = Object.keys(Dp.presets || {})[0];
  let diagPath = null;
  if (dk) { Dp.presets[dk] = [Dp.presets[dk], 'w283e-probe']; diagPath = '/presets/' + dk; }
  put(Jh, Dp);
  const diagDetected = o.stableMatches(tmp, newRow(CAL)) && !stableInputOk(tmp, newRows(), CAL);
  // 随伴の行が無い刻印(非物理 meta を除いた calaudit の行だけ)は一致としない
  put(Jh, Dh);
  const companionRequired = o.stableMatches(tmp, newRow(CAL)) && !stableInputOk(tmp, [newRow(CAL)], CAL);
  // 物理欄が宣言に入っていない(最後の鍵が実行時刻・所要か非物理 meta)ことは lint.stableHashPaths ② が見る
  return { calPointers: vpC.length, calHits: nC, diagPointers: vpD.length, diagHits: nD, rows,
    downstream: rows.length, withStable: rows.filter((r) => r.hasStable).length,
    reusableOld: rows.filter((r) => r.old).length, reusableNew: rows.filter((r) => r.hasStable && r.neu).length,
    needStamp: rows.filter((r) => !r.hasStable).map((r) => r.step),
    physPath, physDetected, diagPath, diagDetected, companionRequired, writersOfCal: W.get(CAL) || [] };
}

/**
 * 第284便c(原仮定者の裁定(第74報)AN43)の**自己試験**(一時 root —— 正本は書き換えない・走らせない)。
 * 2 段の表(書き手 `cal` が calaudit の 2 ファイル〔随伴つき〕を書き、読み手 `rd` が calaudit を入力にする)と、読み手の正本の刻印を
 * 一時 root に作り、`planRegen`(鎖の `--gate` も同じ関数)の読み手の自分の判定(`ownStatus`)を見る:
 *   same     … 刻印の Pointer = 今の宣言・バイト sha も同じ → reuse
 *   stable   … バイト sha は違うが今の宣言の安定 hash が同じ(実行時刻だけの再走)→ reuse(第282便e の既存の挙動)
 *   ptr      … **バイト sha は同じ**・刻印の Pointer ⊊ 今の宣言(宣言に Pointer を 1 本足した)→ regen(AN43)
 *   version  … バイト sha は同じ・刻印の方式の版が無い(旧方式)→ regen(AN43)
 *   companion… バイト sha は同じ・随伴 diag の行の Pointer が今の宣言と違う → regen(AN43)
 *   noComp   … バイト sha は同じ・随伴 diag の行が無い → regen(AN43)
 * @param {{tmpDir:string}} o
 */
export function an43Probe(o) {
  const tmp = o.tmpDir.replace(/\/$/, '');
  const CAL = 'tests/out/calaudit-w249.json', DIAG = 'tests/out/calaudit-w249-diag.json', RD = 'tests/out/rd-w284c.json';
  fs.mkdirSync(tmp + '/tests/out', { recursive: true });
  const w = (f, x) => fs.writeFileSync(tmp + '/' + f, typeof x === 'string' ? x : JSON.stringify(x, null, 1));
  const sh = (f) => shaFile(tmp + '/' + f);
  w('tests/rd-code.mjs', '// w284c an43 probe\n');
  w('tests/rd-target.txt', 'target\n');
  const cal = { meta: { when: '2026-09-27T00:00:00.000Z', targetSha256: 'a'.repeat(64) }, presets: [{ run: { wallSec: 1.5 }, quantities: [{ meas: 1.25 }] }] };
  const diag = { when: '2026-09-27T00:00:00.000Z', presets: { x: [1, 2] } };
  const P0 = { [CAL]: ['/meta/targetSha256', '/meta/when'], [DIAG]: ['/when'] };
  const P1 = { [CAL]: ['/meta/targetSha256', '/meta/when', '/presets/*/run/wallSec'], [DIAG]: ['/when'] };
  const volOf = (decl) => (f) => (decl[f] || []).slice().sort();
  const steps = [
    { key: 'cal', cmd: 'true', outs: [CAL, DIAG], sec: 0, secSource: 'probe', alwaysRun: false, role: 'current', after: [], env: {}, volatilePaths: {} },
    { key: 'rd', cmd: 'true', outs: [RD], sec: 0, secSource: 'probe', alwaysRun: false, role: 'current', after: ['cal'], env: {}, volatilePaths: {} },
  ];
  const row = (f, decl, extra) => Object.assign({ file: f, stableSha256: stableJsonSha(tmp + '/' + f, (decl[f] || []).slice().sort()),
    stableVersion: STABLE_VERSION, volatilePaths: (decl[f] || []).slice().sort() }, extra || {});
  const stamp = (rows) => w(RD, { meta: { target: 'tests/rd-target.txt', targetSha256: sh('tests/rd-target.txt'),
    code: [{ file: 'tests/rd-code.mjs', sha256: sh('tests/rd-code.mjs') }], inputs: [{ file: CAL, sha256: sh(CAL) }], inputsStable: rows } });
  const own = (decl) => { const pl = planRegen({ root: tmp, steps, volatileOf: volOf(decl) }); const r = pl.steps.find((z) => z.key === 'rd');
    return { status: r.ownStatus, cause: r.causeText }; };
  const res = {};
  // same: 刻印 P0・今 P0・バイト同じ
  w(CAL, cal); w(DIAG, diag);
  stamp([row(CAL, P0), row(DIAG, P0, { companionOf: CAL })]);
  res.same = own(P0);
  // stable: 実行時刻だけ変えた再走(バイト違い・安定 hash 同じ)
  w(CAL, Object.assign({}, cal, { meta: { when: '2026-09-28T00:00:00.000Z', targetSha256: 'b'.repeat(64) } }));
  res.stable = own(P0);
  // ptr: バイト同じ・今の宣言に Pointer を 1 本足した(刻印 P0 ⊊ 今 P1)
  w(CAL, cal); stamp([row(CAL, P0), row(DIAG, P0, { companionOf: CAL })]);
  res.ptr = own(P1);
  // version: バイト同じ・刻印の方式の版が無い(旧方式)
  const legacy = row(CAL, P0); delete legacy.stableVersion;
  stamp([legacy, row(DIAG, P0, { companionOf: CAL })]);
  res.version = own(P0);
  // companion: バイト同じ・随伴 diag の行の Pointer が今の宣言と違う
  stamp([row(CAL, P0), row(DIAG, { [DIAG]: [] }, { companionOf: CAL })]);
  res.companion = own(P0);
  // noComp: バイト同じ・随伴 diag の行が無い
  stamp([row(CAL, P0)]);
  res.noComp = own(P0);
  const ok = res.same.status === 'reuse' && res.stable.status === 'reuse' && res.ptr.status === 'regen' && res.version.status === 'regen'
    && res.companion.status === 'regen' && res.noComp.status === 'regen' && /安定 hash の宣言/.test(res.ptr.cause || '');
  return { ok, cases: res };
}

/** 第282便の統合で起きた順序の型を表で再現した**合成の列**(自己試験の固定入力)。 */
export const W282_ORDER_FIXTURE = ['d0audit', 'nslockledger', 'bgbudget', 'calaudit', 'dt3', 'kf0', 'nslock', 'bgpredict', 'bgequiv',
  'kf0ledger', 'nslockledger'];
/** 第282便の基点の表で after が無かった段(第283便e で足した after —— 自己試験で外して検出を確かめる)。 */
export const W283E_ADDED_AFTER = ['d0audit', 'nsmode', 'bgequiv', 'bgbudget', 'bgbudget2'];

/**
 * 第283便e: **鎖の自己試験**(dry-run —— 正本を書かない・走らせない。(f) だけ一時ディレクトリで stub の鎖を bash で走らせる)。
 *   (a) 今の表: 依存の完全性(入力の書き手 ⊆ after の閉包・同じファイルの書き手が全順序・循環なし)
 *   (b) 第282便の型の表(W283E_ADDED_AFTER の after と merges を外した写し)で、欠けた依存が**検出される**
 *   (c) 第282便の型の列(W282_ORDER_FIXTURE)で、入力より先の走行と後段の再走の欠落が**検出される**
 *   (d) 全段 regen の計画 → 鎖 → 平らにした列が checkOrder を通る(順序違反 0・後段の欠落 0)・表の現行段を全部覆う
 *   (e) 渡された計画(planRegen の実物)→ 鎖 → checkOrder を通る
 *   (f) stub の表(5 段・1 段が 1 回目だけ失敗)で生成したシェルを bash で 2 回走らせる: 1 回目は失敗した波で止まり後段を
 *       走らせない(rc 1)・2 回目は済み印の段を飛ばして再開し完走する・ログ名が規約どおり
 * @param {{root:string, tmpDir?:string, plan?:object}} o
 */
export async function regenChainSelfTest(o) {
  const root = o.root.replace(/\/$/, '');
  const res = { a: null, b: null, c: null, d: null, e: null, f: null, g: null, h: null, i: null, n: null, o: null, p: null, q: null };
  const deps = tableDeps({ root });
  // (a)
  const A = tableDepsAudit({ root });
  res.a = { ok: A.ok, missing: A.missing.length, unordered: A.unordered.length, cycles: A.cycles.length, unknown: A.unknown.length };
  // (b)
  const old = REGEN_STEPS.map((z) => Object.assign({}, z, W283E_ADDED_AFTER.includes(z.key) ? { after: [] } : {}, { merges: undefined }));
  const B = tableDepsAudit({ root, steps: old });
  const miss = [...new Set(B.missing.map((z) => z.key))].sort();
  res.b = { detected: miss, n: B.missing.length, ok: JSON.stringify(miss) === JSON.stringify(W283E_ADDED_AFTER.slice().sort()) };
  // (c)
  const C = checkOrder(W282_ORDER_FIXTURE, { deps });
  const ordSteps = [...new Set(C.order.map((z) => z.step))].sort();
  const wasteSteps = [...new Set(C.wasted.map((z) => z.step))].sort();
  res.c = { order: C.order.map((z) => z.step + '<' + z.dep), wasted: C.wasted.map((z) => z.step + '<' + z.dep), downstream: C.downstream.length,
    ok: ['bgbudget', 'd0audit', 'kf0ledger'].every((k) => ordSteps.includes(k)) && wasteSteps.includes('nslockledger')
      && C.order.some((z) => z.step === 'kf0ledger' && z.dep === 'nslockledger') };
  // (d)
  const all = { steps: REGEN_STEPS.map((z) => ({ key: z.key, status: z.role === 'history' ? 'history' : 'regen' })) };
  const D = buildChain(all, { deps });
  const Dc = checkOrder(chainSequence(D), { deps });
  const want = REGEN_STEPS.filter((z) => z.role !== 'history' && !z.outside).map((z) => z.key);
  const have = new Set(Object.keys(D.steps));
  res.d = { waves: D.waves.length, steps: have.size, want: want.length, order: Dc.order.length, downstream: Dc.downstream.length,
    widest: Math.max(...D.waves.map((w) => w.length)), manual: D.count.manual,
    ok: Dc.ok && want.every((k) => have.has(k)) };
  // (e)
  if (o.plan) {
    const E = buildChain(o.plan, { deps });
    const Ec = checkOrder(chainSequence(E), { deps });
    // 計画で走る段の下流は全部鎖にある(依存の閉包)
    const { down } = closures(deps);
    const lost = [];
    for (const k of Object.keys(E.steps)) for (const d of (down.get(k) || [])) {
      const st = REGEN_STEPS.find((z) => z.key === d);
      if (st && st.role !== 'history' && !st.outside && !E.steps[d]) lost.push(d);
    }
    res.e = { run: E.count.run, gate: E.count.gate, manual: E.count.manual, waves: E.waves.length, secRun: E.secRun, secGate: E.secGate,
      order: Ec.order.length, downstream: Ec.downstream.length, lost: [...new Set(lost)], ok: Ec.ok && !lost.length };
  }
  // (f) stub の鎖を bash で
  if (o.tmpDir) {
    const cp = await import('node:child_process');
    const tmp = o.tmpDir.replace(/\/$/, '');
    fs.mkdirSync(tmp + '/marks', { recursive: true });
    const mk = (k, cmd, after) => ({ key: k, cmd, outs: [], after: after || [], role: 'current', sec: 1 });
    const stub = [mk('sa', 'echo a > marks/sa'), mk('sb', 'test -f marks/ok || exit 7; echo b > marks/sb', ['sa']),
      mk('sc', 'echo c > marks/sc', ['sa']), mk('sd', 'echo d > marks/sd', ['sb', 'sc']), mk('se', 'echo "$W283E_STUB" > marks/se', ['sd'])];
    const sdeps = tableDeps({ steps: stub });
    const ch = buildChain({ steps: stub.map((z) => ({ key: z.key, status: 'regen' })) }, { steps: stub, deps: sdeps });
    const sh = chainShell(ch, { lanes: 2 });
    fs.writeFileSync(tmp + '/chain.sh', sh);
    const syn = cp.spawnSync('bash', ['-n', tmp + '/chain.sh'], { encoding: 'utf8' });
    const env = Object.assign({}, process.env, { REGEN_ROOT: tmp, REGEN_LOG: tmp + '/log', REGEN_TOOL: root + '/tools/regen-chain.mjs' });
    delete env.W283E_STUB;
    const r0 = cp.spawnSync('bash', [tmp + '/chain.sh'], { encoding: 'utf8', env, cwd: tmp });   // 環境変数が無い → 走らせる前に止まる
    const noEnv = r0.status !== 0 && !fs.existsSync(tmp + '/marks/sa');
    env.W283E_STUB = 'ok';
    const r1 = cp.spawnSync('bash', [tmp + '/chain.sh'], { encoding: 'utf8', env, cwd: tmp });
    const after1 = ['sa', 'sb', 'sc', 'sd', 'se'].filter((k) => fs.existsSync(tmp + '/marks/' + k));
    const logs1 = fs.existsSync(tmp + '/log') ? fs.readdirSync(tmp + '/log').filter((f) => /\.(log|rc)$/.test(f)).sort() : [];
    fs.writeFileSync(tmp + '/marks/ok', '1');
    fs.writeFileSync(tmp + '/marks/sa', 'stale');   // 済み印の段は走らせ直さない(stale のまま残る)
    const r2 = cp.spawnSync('bash', [tmp + '/chain.sh'], { encoding: 'utf8', env, cwd: tmp });
    const after2 = ['sa', 'sb', 'sc', 'sd', 'se'].filter((k) => fs.existsSync(tmp + '/marks/' + k));
    const saStale = fs.readFileSync(tmp + '/marks/sa', 'utf8') === 'stale';
    res.f = { waves: ch.waves.map((w) => w.join('+')).join(' → '), syntax: syn.status === 0,
      noEnv,
      run1: { rc: r1.status, ran: after1, logs: logs1 }, run2: { rc: r2.status, ran: after2, resumedSkip: saStale },
      ok: syn.status === 0 && noEnv && r1.status === 1 && JSON.stringify(after1) === JSON.stringify(['sa', 'sc'])
        && logs1.includes('01-sa.log') && logs1.includes('02-sb.rc') && r2.status === 0 && after2.length === 5 && saStale };
  }
  // ---- 第284便f(R94): ready queue・書込排他・worker 予算・済み印の契約
  // (g) 全段 regen の鎖を ready queue で模擬(表の実測秒・レーン 4): 順序違反・書込の重なり・予算超過 0・全段が済む・
  //     波の型(第283便e)の見積り以下
  {
    const all = { steps: REGEN_STEPS.map((z) => ({ key: z.key, status: z.role === 'history' ? 'history' : 'regen' })) };
    const G = buildChain(all, { deps });
    const sim = simulateReadyQueue(G, { lanes: 4 });
    const wave = waveMakespan(G, 4);
    // 排他の鍵が効くことを、同じファイルを書く段(charon h/h2/h4・calaudit/dt3/kf0)の区間で確かめる
    const byFile = new Map();
    for (const e of sim.events) for (const f of (G.steps[e.key].writes || [])) { if (!byFile.has(f)) byFile.set(f, []); byFile.get(f).push(e); }
    const shared = [...byFile].filter(([, es]) => es.length > 1).map(([f, es]) => f.replace(/^tests\/out\//, '') + ':' + es.map((z) => z.key).join('→'));
    const excl = Object.keys(G.steps).filter((k) => G.steps[k].workers === 'all');
    const exclAlone = excl.every((k) => { const e = sim.events.find((z) => z.key === k); return e && sim.events.every((z) => z === e || z.end <= e.start + 1e-9 || z.start >= e.end - 1e-9 || z.end === z.start); });
    res.g = { exclusive: excl, exclusiveAlone: exclAlone, steps: sim.events.length, pending: sim.pending.length, makespan: Math.round(sim.makespan), waveMakespan: Math.round(wave),
      order: sim.check.order.length, writes: sim.check.writes.length, budget: sim.check.budget.length, sharedWriters: shared,
      ok: sim.check.ok && !sim.pending.length && sim.events.length === Object.keys(G.steps).length && sim.makespan <= wave + 1e-9 && shared.length >= 2
        && excl.includes('samplestatus') && exclAlone };
    // 模擬の照合器が違反を**検出する**(書込の重なり・入力より先・予算超過を 1 つずつ作る)
    const fx = { rows: { p: { deps: [], writes: ['F'], workers: 1 }, q: { deps: ['p'], writes: ['F'], workers: 1 }, r: { deps: [], writes: ['F'], workers: 2 } }, lanes: 2 };
    const bad = checkTimeline([{ key: 'p', start: 0, end: 5 }, { key: 'q', start: 3, end: 6 }, { key: 'r', start: 1, end: 2, workers: 2 }], fx);
    res.g.detect = { order: bad.order.length, writes: bad.writes.length, budget: bad.budget.length };
    res.g.ok = res.g.ok && bad.order.length === 1 && bad.writes.length >= 2 && bad.budget.length >= 1;
  }
  // (h) stub の鎖を bash で(レーン 3): 同じファイルを書く 2 段は重ならない・worker 2 の段は他と合わせて 3 を超えない・
  //     波の境を待たない(x4 は x3 の後すぐ —— x2 の終わりを待たない)。(i) 済み印の契約: 1 段の cmd を変えた鎖を同じ REGEN_LOG で
  //     走らせると、その段と下流だけが走り直し(旧印は .stale)、他は済みのまま
  if (o.tmpDir) {
    const cp = await import('node:child_process');
    const tmp = o.tmpDir.replace(/\/$/, '') + '/rq';
    fs.mkdirSync(tmp + '/cnt', { recursive: true });
    const mk = (k, cmd, after, extra) => Object.assign({ key: k, cmd, outs: [], after: after || [], role: 'current', sec: 1 }, extra || {});
    const tick = (k) => `echo x >> cnt/${k}`;
    const stubOf = (x2cmd) => [
      mk('x1', tick('x1') + '; sleep 0.6', [], { merges: ['out/F.json'] }),
      // 第287便f: x2 は F.json に値を書く(契約の入力は上流の意味的出力 —— cmd を変えた x2 が違う値を書くので下流 x6 が走り直す)
      mk('x2', (x2cmd || tick('x2') + " && mkdir -p out && printf '{\"v\":1}' > out/F.json") + '; sleep 0.6', [], { merges: ['out/F.json'] }),
      mk('x3', tick('x3') + '; sleep 0.3', [], { outs: ['out/G.json'] }),
      mk('x4', tick('x4') + '; sleep 0.3', ['x3']),
      mk('x5', tick('x5') + '; sleep 0.3', [], { workers: 2 }),
      mk('x6', tick('x6'), ['x2'])];
    const gen = (stub, name) => {
      const sd = tableDeps({ steps: stub });
      const ch = buildChain({ steps: stub.map((z) => ({ key: z.key, status: 'regen' })) }, { steps: stub, deps: sd });
      fs.writeFileSync(tmp + '/' + name, chainShell(ch, { lanes: 3 }));
      return ch;
    };
    const ch1 = gen(stubOf(null), 'c1.sh');
    const env = Object.assign({}, process.env, { REGEN_ROOT: tmp, REGEN_LOG: tmp + '/log', REGEN_TOOL: root + '/tools/regen-chain.mjs' });
    const r1 = cp.spawnSync('bash', [tmp + '/c1.sh'], { encoding: 'utf8', env, cwd: tmp });
    const tl = parseTimeline(fs.readFileSync(tmp + '/log/timeline.txt', 'utf8'));
    const ev = (k) => tl.events.find((e) => e.key === k);
    const chk = checkTimeline(tl.events, { rows: ch1.steps, lanes: 3 });
    const x12 = [ev('x1'), ev('x2')].sort((a, b) => a.start - b.start);
    const noWave = ev('x4') && ev('x2') && ev('x4').start < Math.max(ev('x1').end, ev('x2').end);
    const cnt = (k) => { try { return fs.readFileSync(tmp + '/cnt/' + k, 'utf8').split('\n').filter(Boolean).length; } catch { return 0; } };
    // 第287便f: 済み印の 2 行目は契約(静的 + 入力の安定 hash)・3 行目が鎖の静的な契約
    const marksOk = ['x1', 'x2', 'x3', 'x4', 'x5', 'x6'].every((k) => { try { const t = fs.readFileSync(tmp + '/log/done/' + k + '.done', 'utf8').split('\n'); return /^contract [0-9a-f]{64}$/.test(t[1]) && t[2] === 'static ' + ch1.steps[k].contract; } catch { return false; } });
    res.h = { rc: r1.status, events: tl.events.length, lanes: tl.lanes, order: chk.order.length, writes: chk.writes.length, budget: chk.budget.length,
      serialF: x12[0].end <= x12[1].start + 1e-6, noWaveBarrier: noWave, marksOk,
      ok: r1.status === 0 && tl.events.length === 6 && tl.lanes === 3 && chk.ok && x12[0].end <= x12[1].start + 1e-6 && noWave && marksOk };
    // (i)
    const ch2 = gen(stubOf(tick('x2') + " && mkdir -p out && printf '{\"v\":2}' > out/F.json"), 'c2.sh');
    const changed = Object.keys(ch2.steps).filter((k) => ch2.steps[k].contract !== ch1.steps[k].contract).sort();
    const before = Object.fromEntries(['x1', 'x2', 'x3', 'x4', 'x5', 'x6'].map((k) => [k, cnt(k)]));
    const r2 = cp.spawnSync('bash', [tmp + '/c2.sh'], { encoding: 'utf8', env, cwd: tmp });
    const reran = ['x1', 'x2', 'x3', 'x4', 'x5', 'x6'].filter((k) => cnt(k) > before[k]);
    const stale = fs.readdirSync(tmp + '/log/done').filter((f) => f.endsWith('.stale')).sort();
    // 契約の無い済み印(第283便e の形 —— touch)は済みと見なさない
    fs.writeFileSync(tmp + '/log/done/x3.done', 'run 1s\n');
    const r3 = cp.spawnSync('bash', [tmp + '/c2.sh'], { encoding: 'utf8', env, cwd: tmp });
    res.i = { changed, reran, stale, rc2: r2.status, rc3: r3.status, bareMarkRerun: cnt('x3') === before.x3 + 1,
      // 第287便f: 静的な契約が変わるのは cmd を変えた x2 だけ(旧版は Merkle で x6 も)。x6 は x2 の意味的出力(F.json の値)が変わったので走り直す
      ok: JSON.stringify(changed) === '["x2"]' && JSON.stringify(reran) === '["x2","x6"]' && JSON.stringify(stale) === '["x2.done.stale","x6.done.stale"]'
        && r2.status === 0 && r3.status === 0 && cnt('x3') === before.x3 + 1 && /\[旧印\] x3/.test(r3.stdout) };
  }
  // (n) 第285便f(AN53): 今の表で samplestatus より先に走りうる html 全体の段が 0・足した after を外した写しで**検出される**・
  //     samplestatus の上流(calaudit・dt3・kf0・charonwin)と読む正本の書き手には足していない(循環 0)
  {
    const N0 = tableDepsAudit({ root });
    // 第288便f: 足した after は samplestatus と集約段 htmlagg(samplestatus の下流)の 2 つ —— 両方を外した写しで検出を見る
    const strip = REGEN_STEPS.map((z) => Object.assign({}, z, W285F_AFTER_SAMPLESTATUS.includes(z.key) ? { after: (z.after || []).filter((k) => k !== 'samplestatus' && k !== 'htmlagg') } : {}));
    const N1 = tableDepsAudit({ root, steps: strip });
    const up = samplestatusUpstream({ root });
    const whole = htmlWholeSteps({ root });
    const intoUp = W285F_AFTER_SAMPLESTATUS.filter((k) => up.has(k));
    const det = N1.beforeSamplestatus.slice().sort();
    res.n = { whole: whole.length, upstream: [...up].sort(), added: W285F_AFTER_SAMPLESTATUS.length, now: N0.beforeSamplestatus, detected: det.length,
      cycles: N0.cycles.length, intoUpstream: intoUp,
      ok: N0.beforeSamplestatus.length === 0 && N0.cycles.length === 0 && intoUp.length === 0
        && JSON.stringify(det) === JSON.stringify(W285F_AFTER_SAMPLESTATUS.slice().sort()) && ['calaudit', 'dt3', 'kf0', 'charonwin'].every((k) => up.has(k)) };
  }
  // (o) 第286便f(再生成表の after 検査): 今の表で静的な欠落 0・宣言した読みが実態に合う(stale 0)・第285便の型(obscompare の after から pn1 を外した写し)と
  //     galaxydiag の after から sparc を外した写しで**検出される**・宣言を空にした写しで宣言した読みがすべて欠落として出る(宣言が素通しでない)
  {
    const A0 = staticAfterAudit({ root });
    const strip = (key, dep) => REGEN_STEPS.map((z) => z.key === key ? Object.assign({}, z, { after: (z.after || []).filter((k) => k !== dep) }) : z);
    const hasMiss = (A, key, file, writer) => A.missingAfter.some((z) => z.key === key && z.file === file && z.writer === writer);
    const A1 = staticAfterAudit({ root, steps: strip('obscompare', 'pn1') });
    const A2 = staticAfterAudit({ root, steps: strip('galaxydiag', 'sparc') });
    const A3 = staticAfterAudit({ root, decl: [] });
    const T0 = tableDepsAudit({ root });
    res.o = { reads: A0.reads, missingAfter: A0.missingAfter.length, declared: A0.declared.length, declaredDecl: STATIC_READ_DECL.length, stale: A0.staleReadDecl,
      detect285: hasMiss(A1, 'obscompare', 'tests/out/pn1-w285b.json', 'pn1'), detectSparc: hasMiss(A2, 'galaxydiag', 'tests/out/sparc-w269c.json', 'sparc'),
      undeclared: A3.missingAfter.length, auditOk: T0.ok && T0.missingAfter.length === 0,
      ok: A0.missingAfter.length === 0 && A0.staleReadDecl.length === 0 && hasMiss(A1, 'obscompare', 'tests/out/pn1-w285b.json', 'pn1')
        && hasMiss(A2, 'galaxydiag', 'tests/out/sparc-w269c.json', 'sparc') && A3.missingAfter.length === A0.declared.length && A0.declared.length > 0
        && T0.ok && T0.missingAfter.length === 0 };
  }
  // ---- 第287便f(原仮定者の裁定(第77報)AN69・統括の検証項目 R112)
  // (p) **済み印の契約 = 静的 + 入力の安定 hash**:
  //     (p0) 実物の calaudit-w249.json で、宣言した除外 Pointer と来歴・時刻の欄(kf0 の書き戻しが変える欄)だけを書き換えた写しの意味的出力が同じ・
  //          物理欄を 1 つ変えた写しは違う。
  //     (p1) 旧版の契約(Merkle)の再現: html の sha を変えて鎖を作り直すと全段の契約が変わる / 1 段(k0)の cmd を変えると k0 と下流の全部が変わる
  //          (第286便の鎖 7〜8 の空回りの型)。
  //     (p2) stub の鎖(cal → k0〔同じ C.json へ書き戻す〕→ r1 → r2・html を読む hw・読まない hn)を bash で同じ REGEN_LOG に 5 回:
  //          A 全段が走る / B k0 の cmd だけ変える(k0 は C.json の時刻だけを書き直す)→ **k0 だけが走り r1・r2 の印は生きる** /
  //          C html だけ変える → hw だけ / D k0 が値を変える(負の対照)→ k0・r1・r2 / E cal の cmd を変える → cal と、同じファイルを段階的に書く k0
  //          (mark: —— 中身が同じでも書き直す)だけ。
  if (o.tmpDir) {
    const cp = await import('node:child_process');
    const tmp = o.tmpDir.replace(/\/$/, '') + '/p287';
    fs.mkdirSync(tmp + '/cnt', { recursive: true });
    // (p0)
    const CAL = 'tests/out/calaudit-w249.json';
    let p0 = { ok: false };
    try {
      const J = JSON.parse(fs.readFileSync(root + '/' + CAL, 'utf8'));
      const base = semanticSha(root + '/' + CAL, CAL);
      const W = JSON.parse(JSON.stringify(J));
      if (W.meta) { W.meta.generatedAt = '2099-01-01T00:00:00.000Z'; W.meta.when = '2099-01-01T00:00:00.000Z'; W.meta.targetSha256 = 'f'.repeat(64); W.meta.code = []; }
      for (const pr of Object.values(W.presets || {})) if (pr && pr.run && typeof pr.run.wallSec === 'number') pr.run.wallSec += 1;
      fs.writeFileSync(tmp + '/cal-time.json', JSON.stringify(W));
      const Y = JSON.parse(JSON.stringify(J));
      // 物理欄: presets の最初の本の最初の数値の量(再帰で最初に見つかる有限数 —— wallSec 等の除外欄は避ける)
      let hit = null;
      const firstNum = (x, pth) => {
        if (hit || !x || typeof x !== 'object') return;
        for (const k of Object.keys(x)) {
          if (hit) return;
          if (/wall|rate|when|generatedAt|elapsed|spent|sha|bytes/i.test(k)) continue;
          if (typeof x[k] === 'number' && Number.isFinite(x[k]) && x[k] !== 0) { x[k] = x[k] * (1 + 1e-9); hit = pth + '/' + k; return; }
          firstNum(x[k], pth + '/' + k);
        }
      };
      firstNum(Y.presets, '/presets');
      fs.writeFileSync(tmp + '/cal-phys.json', JSON.stringify(Y));
      const sT = semanticSha(tmp + '/cal-time.json', CAL), sP = semanticSha(tmp + '/cal-phys.json', CAL);
      p0 = { base: base.slice(0, 16), timeOnly: sT === base, physChanged: hit, physDiffers: sP !== base, ok: sT === base && !!hit && sP !== base };
    } catch (e) { p0 = { ok: false, error: String(e).slice(0, 120) }; }
    // stub の器(1 本の node スクリプト —— 段の名前で振る舞いを変える)
    fs.writeFileSync(tmp + '/w.mjs', [
      "import fs from 'node:fs';",
      "const k = process.argv[2]; fs.mkdirSync('out', { recursive: true }); fs.appendFileSync('cnt/' + k, 'x\\n');",
      "const now = () => new Date().toISOString() + ':' + process.hrtime.bigint();",
      "const rd = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));",
      "if (k === 'cal') fs.writeFileSync('out/C.json', JSON.stringify({ meta: { generatedAt: now() }, v: 1 }));",
      "if (k === 'k0') { const j = rd('out/C.json'); j.meta.generatedAt = now(); j.v += Number(fs.existsSync('k0dv') ? fs.readFileSync('k0dv', 'utf8') : 0); fs.writeFileSync('out/C.json', JSON.stringify(j)); }",
      "if (k === 'r1') fs.writeFileSync('out/R1.json', JSON.stringify({ meta: { generatedAt: now() }, v: 2 * rd('out/C.json').v }));",
      "if (k === 'r2') fs.writeFileSync('out/R2.json', JSON.stringify({ meta: { generatedAt: now() }, v: rd('out/R1.json').v + 1 }));",
      "if (k === 'hw') fs.writeFileSync('out/H.json', JSON.stringify({ meta: { generatedAt: now() }, n: fs.readFileSync('page.html', 'utf8').length }));",
      "if (k === 'hn') fs.writeFileSync('out/N.json', JSON.stringify({ meta: { generatedAt: now() }, n: 1 }));",
    ].join('\n'));
    fs.writeFileSync(tmp + '/page.html', '<html><script>// a</script></html>\n');
    const mk = (k, extra, after, more) => Object.assign({ key: k, cmd: 'node w.mjs ' + k + (extra || ''), outs: [], after: after || [], role: 'current', sec: 1 }, more || {});
    const table = (x) => [
      mk('cal', x.cal, [], { outs: ['out/C.json'], htmlInput: 'none' }),
      mk('k0', x.k0, ['cal'], { merges: ['out/C.json'], htmlInput: 'none' }),
      mk('r1', '', ['k0'], { outs: ['out/R1.json'], htmlInput: 'none' }),
      mk('r2', '', ['r1'], { outs: ['out/R2.json'], htmlInput: 'none' }),
      mk('hw', '', [], { outs: ['out/H.json'], htmlInput: 'whole' }),
      mk('hn', '', [], { outs: ['out/N.json'], htmlInput: 'none' })];
    const env = Object.assign({}, process.env, { REGEN_ROOT: tmp, REGEN_LOG: tmp + '/log', REGEN_TOOL: root + '/tools/regen-chain.mjs', REGEN_HTML: 'page.html',
      REGEN_ENV_BROWSER: '0' });   // 第288便f: env.json の Chromium は起こさない(stub)
    delete env.REGEN_HTML_STAGE;   // 第288便f: 外の鎖の一時出力を stub に持ち込まない
    const cnt = (k) => { try { return fs.readFileSync(tmp + '/cnt/' + k, 'utf8').split('\n').filter(Boolean).length; } catch { return 0; } };
    const K6 = ['cal', 'k0', 'r1', 'r2', 'hw', 'hn'];
    const runOnce = (x, name) => {
      const stub = table(x);
      const sd = tableDeps({ steps: stub });
      const ch = buildChain({ steps: stub.map((z) => ({ key: z.key, status: 'regen' })) }, { steps: stub, deps: sd });
      fs.writeFileSync(tmp + '/' + name + '.sh', chainShell(ch, { lanes: 2 }));
      const before = Object.fromEntries(K6.map((k) => [k, cnt(k)]));
      const r = cp.spawnSync('bash', [tmp + '/' + name + '.sh'], { encoding: 'utf8', env, cwd: tmp });
      return { rc: r.status, reran: K6.filter((k) => cnt(k) > before[k]), ch, out: (r.stdout || '').slice(-400) };
    };
    const A = runOnce({}, 'pA');
    const B = runOnce({ k0: ' --again' }, 'pB');
    fs.writeFileSync(tmp + '/page.html', '<html><script>// b</script></html>\n');
    const C = runOnce({ k0: ' --again' }, 'pC');
    fs.writeFileSync(tmp + '/k0dv', '1');
    const D = runOnce({ k0: ' --again2' }, 'pD');
    const E = runOnce({ cal: ' --x', k0: ' --again2' }, 'pE');
    // (p1) 旧版の契約の再現(同じ stub の鎖の行で —— 純関数)
    const legacyA = legacyChainContracts(A.ch.steps, { htmlSha: 'a'.repeat(64) });
    const legacyHtml = legacyChainContracts(A.ch.steps, { htmlSha: 'b'.repeat(64) });
    const legacyK0 = legacyChainContracts(B.ch.steps, { htmlSha: 'a'.repeat(64) });
    const diff = (m1, m2) => K6.filter((k) => m1.get(k) !== m2.get(k));
    const p1 = { htmlChange: diff(legacyA, legacyHtml), k0Change: diff(legacyA, legacyK0) };
    p1.ok = p1.htmlChange.length === K6.length && JSON.stringify(p1.k0Change) === '["k0","r1","r2"]';
    const specsR1 = (A.ch.steps.r1 || {}).inputs || [];
    const specsK0 = (A.ch.steps.k0 || {}).inputs || [];
    const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    res.p = { p0, p1, specs: { r1: specsR1, k0: specsK0, hw: (A.ch.steps.hw || {}).inputs, hn: (A.ch.steps.hn || {}).inputs },
      runs: { A: A.reran, B: B.reran, C: C.reran, D: D.reran, E: E.reran }, rc: [A.rc, B.rc, C.rc, D.rc, E.rc],
      ok: p0.ok && p1.ok && [A.rc, B.rc, C.rc, D.rc, E.rc].every((z) => z === 0)
        && eq(A.reran, K6) && eq(B.reran, ['k0']) && eq(C.reran, ['hw']) && eq(D.reran, ['k0', 'r1', 'r2']) && eq(E.reran, ['cal', 'k0'])
        && eq(specsK0, ['mark:cal']) && eq(specsR1, ['json:out/C.json']) && eq((A.ch.steps.hw || {}).inputs, ['html:whole']) && eq((A.ch.steps.hn || {}).inputs, []) };
  }
  // (q) **html を書く段の検査が型ごとに検出する**(今の表の写しを 1 か所ずつ壊す —— 正本は書き換えない):
  //     q1 書く段の順序を外す → 全順序の欠け / q2 obscompare の領域の宣言を外す → 器の本文から宣言漏れ / q3 samplestatus の after に families
  //     → 循環 / q4 families の after から samplestatus を外す → 領域の閉包が sample-status に掛かる / q5 obscompare の after から d68three を外す
  //     → after 欠落 / q6 領域の読みの宣言を空にする → pn1→obs-compare が違反に出る(第288便f: 旧い形の刻印を与えて)/ q6b 旧い宣言を今の pn1 に当てる →
//     宣言が実態に合わない / q7 html から sample-status の印を消す → 領域の印の欠け
  {
    const Q0 = htmlTailAudit({ root });
    const edit = (key, f) => REGEN_STEPS.map((z) => (z.key === key ? f(Object.assign({}, z)) : z));
    const drop = (arr, v) => (arr || []).filter((x) => x !== v);
    const q1 = htmlTailAudit({ root, steps: edit('samplestatus', (z) => Object.assign(z, { after: drop(z.after, 'assessed') })).map((z) => (z.key === 'assessed' ? Object.assign({}, z, { after: drop(z.after, 'obscompare') }) : z)) });
    const q2 = htmlTailAudit({ root, steps: edit('obscompare', (z) => { delete z.htmlRegions; return z; }) });
    const q3 = htmlTailAudit({ root, steps: edit('samplestatus', (z) => Object.assign(z, { after: (z.after || []).concat(['families']) })) });
    const q4 = htmlTailAudit({ root, steps: edit('families', (z) => Object.assign(z, { after: drop(drop(z.after, 'samplestatus'), 'htmlagg') })) });   // 第288便f: htmlagg も外す
    const q5 = htmlTailAudit({ root, steps: edit('obscompare', (z) => Object.assign(z, { after: drop(z.after, 'd68three') })) });
    // 第288便f: pn1 の宣言を外したので、q6 は「旧い形の刻印(roots に obsCompareRows)を持つ pn1」を metaOf で与え、宣言が空なら違反に出ることを、
    //   q6b は「今の pn1 に旧い宣言を当てる」と宣言が実態に合わない(staleRegionDecl)ことを確かめる
    const pn1Old = (f) => { const m = readMetaAt(root, f); if (f !== 'tests/out/pn1-w285b.json' || !m || !m.scope) return m;
      return Object.assign({}, m, { scope: Object.assign({}, m.scope, { roots: (m.scope.roots || []).filter((z) => z !== 'obsCompareRows').concat(['obsCompareRows']) }) }); };
    const q6 = htmlTailAudit({ root, regionDecl: [], metaOf: pn1Old });
    const q6b = htmlTailAudit({ root, regionDecl: [{ key: 'pn1', region: 'obs-compare', kind: 'scope-closure-cycle', why: '旧い宣言(自己試験)' }] });
    let htmlNow = ''; try { htmlNow = fs.readFileSync(root + '/' + HTML_TARGET, 'utf8'); } catch { htmlNow = ''; }
    const q7 = htmlTailAudit({ root, htmlText: htmlNow.split(htmlGenBegin('sample-status')).join('// (印を消した写し)') });
    // 第288便f(AN90): q8 html 全体を読む下流の段(bh90)の after から集約段を外す → 集約段の欠落 / q9 obscompare の器を直書きに戻した写し →
    //   直書きの検出 / q10 集約段を表から外す → 集約段 0 段
    const q8 = htmlTailAudit({ root, steps: edit('bh90', (z) => Object.assign(z, { after: drop(z.after, 'htmlagg') })) });
    const rt9 = (rel) => { let t = null; try { t = fs.readFileSync(root + '/' + rel, 'utf8'); } catch { return null; }
      return rel === 'tests/exp-w285d-obscompare.mjs' ? t.replace(/HS\.writeHtmlStaged\(HTML, html0, html1, L\.REGION\)\.view/, '(fs.writeFileSync(HTML, html1), HTML)') : t; };
    const q9 = htmlTailAudit({ root, readText: rt9 });
    const q10 = htmlTailAudit({ root, steps: REGEN_STEPS.filter((z) => z.key !== 'htmlagg') });
    const has = (arr, re) => (arr || []).some((z) => re.test(z));
    res.q = { now: { ok: Q0.ok, writers: Q0.writers, reads: Q0.reads, tailBacklog: Q0.tailBacklog.length, declaredRegionReads: Q0.declaredRegionReads, beforeAlways: Q0.beforeAlways.length,
      aggregator: Q0.aggregator && Q0.aggregator.steps },
      q8: has(q8.aggMissing, /^bh90$/), q9: has(q9.directWrite, /^obscompare\(直書き/), q10: !!q10.aggregator && q10.aggregator.bad.some((z) => /集約段が 0 段/.test(z)),
      q1: has(q1.writerUnordered, /assessed\|samplestatus|samplestatus\|assessed|obscompare\|assessed|assessed\|obscompare/), q2: has(q2.undeclared, /^obscompare\(/),
      q3: q3.cycles.some((k) => k === 'samplestatus' || k === 'families'), q4: has(q4.scopeReadsRegion, /^families→sample-status$/),
      q5: has(q5.afterMissing, /^d68three\?obscompare/), q6: has(q6.scopeReadsRegion, /^pn1→obs-compare$/), q6b: has(q6b.staleRegionDecl, /^pn1→obs-compare$/) && !has(q6b.scopeReadsRegion, /^pn1→/), q7: has(q7.regionMissing, /^samplestatus:sample-status\(html/) };
    res.q.ok = Q0.ok && ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q6b', 'q7', 'q8', 'q9', 'q10'].every((k) => res.q[k] === true);
  }
  // (r) 第288便f(原仮定者の裁定(第78報)AN90): 一時出力の集約 —— 中断 → 再開で html が 1 回だけ書かれる(htmlAggregateProbe)
  res.r = await htmlAggregateProbe({ root, tmpDir: o.tmpDir + '/r' });
  res.ok = Object.values(res).filter((z) => z && typeof z === 'object').every((z) => z.ok !== false);
  return res;
}

/**
 * 第288便f(原仮定者の裁定(第78報)AN90)の自己試験 (r) —— 一時出力の集約(QA lint.chainAggregate も同じ関数を呼ぶ)。
 * (r) 第288便f(原仮定者の裁定(第78報)AN90): **一時出力の集約 —— 中断 → 再開で html が 1 回だけ書かれる**(stub の鎖を実際に bash で回す)。
 *     書く段 2 つ(w1 → w2 —— 領域 obs-compare・sample-status を tests/lib-w288f-htmlstage.mjs の書き口で書く)と集約段 agg
 *     (tools/regen-html-aggregate.mjs)。回 1: w2 が rc 1 で止まる → html は 1 字も変わらない(w1 の断片だけが置き場にある)。
 *     回 2(同じ REGEN_LOG で再開): w1 は済み・w2 と agg が走る → html が 1 回だけ書かれ(aggregate.log の written 1 行)両方の領域が新しい。
 *     回 3(もう一度): 全段が済み → html は変わらない。加えて (r4) 別の html で作った断片(baseSha256 が違う)は集約が拒否し(rc 1)html を書かない・
 *     (r5) 領域の外を書き換える書き込みは書き口が投げる・(r6) 変数が無いと従来どおり直に書く(同じ本文)。
 * @param {{root:string, tmpDir:string}} o tmpDir は一時ディレクトリ(中に stub の鎖を置く)
 */
export async function htmlAggregateProbe(o) {
  const root = String(o.root).replace(/\/$/, '');
  fs.mkdirSync(o.tmpDir, { recursive: true });
  {
    const cp = await import('node:child_process');
    const tmp = o.tmpDir;
    fs.mkdirSync(tmp + '/cnt', { recursive: true });
    const libUrl = 'file://' + root + '/tests/lib-w288f-htmlstage.mjs';
    const page0 = '<html><script>\nconst A=0;\n// >>> w275a-generated: obs-compare\nconst OC=0;\n// <<< w275a-generated: obs-compare\nconst B=1;\n'
      + '// >>> w275a-generated: sample-status\nconst SS=0;\n// <<< w275a-generated: sample-status\n</script></html>\n';
    fs.writeFileSync(tmp + '/page.html', page0);
    fs.writeFileSync(tmp + '/s.mjs', [
      "import fs from 'node:fs';",
      "const HS = await import(" + JSON.stringify(libUrl) + ");",
      "const k = process.argv[2], region = process.argv[3], v = process.argv[4]; fs.appendFileSync('cnt/' + k, 'x\\n');",
      "if (fs.existsSync('fail-' + k)) process.exit(1);",
      "const HTML = 'page.html';",
      "const prev = HS.readHtmlStaged(HTML, region);",
      "const a = prev.indexOf(HS.stageBegin(region)), b = prev.indexOf(HS.stageEnd(region));",
      "const next = prev.slice(0, a) + HS.stageBegin(region) + '\\n' + v + '\\n' + prev.slice(b);",
      "HS.writeHtmlStaged(HTML, prev, next, region);",
      "fs.mkdirSync('out', { recursive: true }); fs.writeFileSync('out/' + k + '.json', JSON.stringify({ meta: {}, v }));",
    ].join('\n'));
    const table = () => [
      { key: 'w1', cmd: 'node s.mjs w1 obs-compare "const OC=1;"', outs: ['out/w1.json'], after: [], role: 'current', sec: 1, htmlInput: 'none' },
      { key: 'w2', cmd: 'node s.mjs w2 sample-status "const SS=2;"', outs: ['out/w2.json'], after: ['w1'], role: 'current', sec: 1, htmlInput: 'none' },
      { key: 'agg', cmd: 'node ' + root + '/tools/regen-html-aggregate.mjs --html page.html', outs: [], after: ['w2'], role: 'current', sec: 1, htmlInput: 'whole',
        alwaysRun: true, exclusive: true, htmlAggregate: true }];
    const env = Object.assign({}, process.env, { REGEN_ROOT: tmp, REGEN_LOG: tmp + '/log', REGEN_TOOL: root + '/tools/regen-chain.mjs', REGEN_HTML: 'page.html', REGEN_ENV_BROWSER: '0' });
    delete env.REGEN_HTML_STAGE;
    const cnt = (k) => { try { return fs.readFileSync(tmp + '/cnt/' + k, 'utf8').split('\n').filter(Boolean).length; } catch { return 0; } };
    const shaT = (t) => crypto.createHash('sha256').update(t).digest('hex');
    const htmlSha = () => shaT(fs.readFileSync(tmp + '/page.html', 'utf8'));
    const aggLog = () => { try { return fs.readFileSync(tmp + '/log/html/aggregate.log', 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)); } catch { return []; } };
    const runOnce = (name) => {
      const stub = table();
      const sd = tableDeps({ steps: stub });
      const ch = buildChain({ steps: stub.map((z) => ({ key: z.key, status: 'regen' })) }, { steps: stub, deps: sd });
      fs.writeFileSync(tmp + '/' + name + '.sh', chainShell(ch, { lanes: 2 }));
      const before = { w1: cnt('w1'), w2: cnt('w2') };
      const r = cp.spawnSync('bash', [tmp + '/' + name + '.sh'], { encoding: 'utf8', env, cwd: tmp });
      return { rc: r.status, ran: ['w1', 'w2'].filter((k) => cnt(k) > before[k]), sha: htmlSha(), written: aggLog().filter((z) => z.written).length };
    };
    const sha0 = htmlSha();
    fs.writeFileSync(tmp + '/fail-w2', '1');
    const R1 = runOnce('r1');
    const frag1 = fs.existsSync(tmp + '/log/html/obs-compare.frag.json');
    fs.rmSync(tmp + '/fail-w2');
    const R2 = runOnce('r2');
    const html2 = fs.readFileSync(tmp + '/page.html', 'utf8');
    const R3 = runOnce('r3');
    const want = page0.replace('const OC=0;', 'const OC=1;').replace('const SS=0;', 'const SS=2;');
    // (r4) 別の html で作った断片は拒否(何も書かない)
    const H = await import('./lib-w288f-htmlstage.mjs');
    const d4 = tmp + '/r4'; fs.mkdirSync(d4, { recursive: true });
    fs.writeFileSync(d4 + '/page.html', page0);
    const other = page0.replace('const A=0;', 'const A=9;');
    const on = other.replace('const OC=0;', 'const OC=5;');
    fs.writeFileSync(d4 + '/obs-compare.frag.json', JSON.stringify({ version: H.HTML_STAGE_VERSION, region: 'obs-compare', baseSha256: shaT(other), nextSha256: shaT(on),
      body: on.slice(on.indexOf(H.stageBegin('obs-compare')), on.indexOf(H.stageEnd('obs-compare')) + H.stageEnd('obs-compare').length) }));
    const r4 = cp.spawnSync(process.execPath, [root + '/tools/regen-html-aggregate.mjs', '--html', d4 + '/page.html', '--stage', d4], { encoding: 'utf8', env });
    const r4ok = r4.status === 1 && fs.readFileSync(d4 + '/page.html', 'utf8') === page0;
    // (r5) 領域の外を書き換える書き込みは投げる
    let r5ok = false;
    try { H.writeHtmlStaged(d4 + '/page.html', page0, page0.replace('const B=1;', 'const B=7;').replace('const SS=0;', 'const SS=3;'), 'sample-status', { REGEN_HTML_STAGE: d4 + '/s5' }); }
    catch (e) { r5ok = /領域 sample-status の外/.test(String(e.message || e)); }
    // (r6) 変数が無ければ直に書く
    const p6 = d4 + '/p6.html'; fs.writeFileSync(p6, page0);
    const n6 = page0.replace('const OC=0;', 'const OC=6;');
    const w6 = H.writeHtmlStaged(p6, H.readHtmlStaged(p6, 'obs-compare', { env: {} }), n6, 'obs-compare', {});
    const r6ok = w6.staged === false && fs.readFileSync(p6, 'utf8') === n6;
    return { runs: { r1: R1, r2: R2, r3: R3 }, frag1, r4: r4ok, r5: r5ok, r6: r6ok,
      ok: R1.rc !== 0 && R1.sha === sha0 && frag1 && JSON.stringify(R1.ran) === '["w1","w2"]' && R1.written === 0
        && R2.rc === 0 && JSON.stringify(R2.ran) === '["w2"]' && R2.written === 1 && html2 === want && R2.sha === shaT(want)
        && R3.rc === 0 && R3.ran.length === 0 && R3.written === 1 && R3.sha === R2.sha && r4ok && r5ok && r6ok };
  }
}

export default { REGEN_TABLE_VERSION, REGEN_STEPS, STATIC_READ_DECL, harnessReads, staticAfterAudit, stampedDeclDrift, VOLATILE_DECL, volatileDeclFp, W285F_AFTER_SAMPLESTATUS, htmlWholeSteps, samplestatusUpstream, an43Probe, EXTERNAL_VOLATILE, V_CALAUDIT_META, STABLE_COMPANIONS, companionsOf,
  volatilePathsOf, volatileDeclared, stepsByOut, alwaysRunOuts, historyOuts, planRegen,
  writesOf, writersMap, afterClosure, tableDeps, tableDepsAudit, checkOrder, buildChain, chainSequence, laneSplit, chainShell, an29Probe,
  codeFilesOf, chainContracts, CHAIN_CONTRACT_VERSION, chainPriority, simulateReadyQueue, waveMakespan, checkTimeline, parseTimeline,
  W282_ORDER_FIXTURE, W283E_ADDED_AFTER, regenChainSelfTest,
  CHAIN_CONTRACT_HISTORY, SEMANTIC_RUN_META, HTML_TARGET, htmlGenBegin, htmlGenEnd, legacyChainContracts, htmlReadOf, HTML_READ_SCAN_SKIP, stripHtmlRegions,
  depClosures, chainInputSpecs, semanticSha, inputDigest, HTML_REGION_READ_DECL, htmlTailAudit, htmlAggregateProbe };

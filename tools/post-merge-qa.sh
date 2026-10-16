#!/usr/bin/env bash
# 第287便f(原仮定者の裁定(第77報)AN70・統括の検証項目 R112): **統合直後の部分 QA**(常設集合)を 1 本で回す。
#
# 統合(worktree の取り込み)の直後、フル QA・再生成の鎖の前に、壊れやすい所を短く一周する。**フル QA の代わりではない**
# (CI が最終裁定者 —— 手元のゲートは CI の代わりにしない)。順序(先に落ちるものを先に):
#   ① 静的受理   tests/qa-preflight.mjs(QA_TARGET=beta/index.html —— tier lint の文と全内蔵の受理・構築・1 歩。Chromium なし・heap の上限 6144 MiB —— 第305便e)
#   ② 接続契約   node tools/regen-chain.mjs --audit と --self-test(再生成表の依存・html を書く段・済み印の契約 —— 枝ごとに足した段の接続)
#   ③ 前回失敗項 --failed の id(無ければ tests/out/qa-results-full-beta.json の FAIL の id)を qapart で beta に
#   ③′ 本便の新設ブロック(第288便f・原仮定者の裁定(第78報)AN90): POST_MERGE_WAVE_IDS(既定は本便〔第293便〕の新設・更新 13 本 ——
#                第290便f で第289便の contract 系 6 本から差し替え)を qapart で beta に。
#                名前が qa.mjs の add('<名>' に無ければ末尾一致(add('<接頭>.<名>')で引く・どちらも無い名は「未統合」として数えるだけ(FAIL にしない)。
#                統合直後の常設集合(④)は変えない
#   ④ 常設集合   POST_MERGE_IDS を qapart(tests/exp-w258c-qapart.mjs —— 1 本の Chromium)で beta と root(QA_TARGET=index.html)に。
#                root では beta 線の新設ブロックが SKIP になる(SKIP の数を出す —— PASS に数えない)
#   ⑤ 影響サンプルの短走 --base <基点 html>(リポジトリの中の相対パス —— 例 beta/_w288_base.html)があるとき
#                tests/exp-w258c-bitsame.mjs で全内蔵の 600 步の指紋を比べ、差分 ID を出す(**情報** —— 物理を変える枝は差が出て正しい。
#                予測した差分 ID と照らすのは統括)
#   ⑥ (この器の外)フルゲート: 統合後のフル QA は **QA_CHANGED=0** で回す(第294便d・原仮定者の裁定(第84報)・統括の検証項目 R151 ——
#                変更依存の先行実行はフルの前に同じ試験を一度ずつ走らせるだけ・フルの試験は減らない)。例: QA_CHANGED=0 QA_TARGET=beta/index.html npm test
# 最後に 1 行で出す: `post-merge-qa: ① … ② … ③ … ③′ … ④ beta p/n・root p/n(SKIP s)⑤ … 所要 N s → OK|FAIL`。
#
# 使い方:
#   tools/post-merge-qa.sh [--base beta/_wNNN_base.html] [--failed "id id …"] [--no-root] [--no-preflight]
#   環境変数: PLAYWRIGHT_CORE_DIR(既定: /opt/node22/lib/node_modules/playwright があればそれ)・POST_MERGE_LOG(ログの置き場 ——
#             既定 ${TMPDIR:-/tmp}/post-merge-qa-<時刻>)・POST_MERGE_IDS(常設集合を差し替える —— 既定は下の 9 本)・
#             POST_MERGE_WAVE_IDS(③′ の本便の新設ブロック —— 既定は下の 11 本・空文字で飛ばす)
# 終了コード: 0 = ①〜④ がすべて通った / 1 = どれかが FAIL(⑤ は情報 —— 器が落ちたときだけ FAIL)/ 2 = 使い方の誤り
# **書くもの**: ログだけ(tests/out/qa-preflight-beta.json は preflight の既定の保存物 —— .gitignore の対象)。正本・html は書かない。
set -u
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT" || exit 2
DEFAULT_IDS="lint.regenScope behavior.rayLensExcluded ai.stabilize docs.fourValuesHistory docs.preset-table-sync docs.families ui.samplePicker lint.provenanceMeta ui.pickerSeparators"
IDS="${POST_MERGE_IDS:-$DEFAULT_IDS}"
# 第288便f(AN90): ③′ 本便の新設ブロック。統合直後の常設集合(④)とは別。
# 第289便f: 本便の contract 系 6 本(a〜e の docs.dfmAxiomTable・preset.condRowsRenamed・behavior.relDragKernel・behavior.ejectStateCarry・
#   preset.layerAxisDecl と f の ui.pickerStatusAxes)へ差し替えた(第288便の 5 本は ④ の後のフル QA で見る)。qa.mjs に無い名は「未統合」として数えるだけ
# 第290便f: 本便の新設 11 本(a の docs.terminologyInertial・docs.claimScope / b の preset.retired290b・docs.d68FactorRow / c の behavior.inertialDragGate・
#   preset.inertialDragPair / d の behavior.ckFixcapRestore / e の preset.shapeToySpiral・behavior.spiralGeometry / f の ui.aboutOrder・ui.pickerScope)へ差し替えた
#   (第289便の 6 本は ④ の後のフル QA で見る)。統合前の枝では他枝の名は「未統合」として数えるだけ
# 第294便d: 枝 d の新設 2 本(docs.timingContract294・lint.scopeClosureSame294)を末尾に足した(第293便の 13 本と他枝の新設への差し替えは統合で)
# 第295便b: 枝 b の新設 1 本(behavior.geo4Migrate295 —— geoPN=4「空間メッシュ」への移住)を末尾に足した(他枝の新設と第294便の分の差し替えは統合で)
# 第295便(統合): 4 枝の新設 5 本(a の behavior.modeIssues295・b の behavior.geo4Migrate295・c の preset.inertial3_295・docs.inertial3Contract295・d の ui.labels295)と
#   4 枝が世代切替で固定値を改めた 17 本へ差し替えた(第294便の分は ④ の後のフル QA で見る)
# 第296便(統合): 枝 a〜d の新設と世代切替の分(b の preset.fitDerived296・docs.fitContract296 を含む)
# 第297便b: behavior.claimEffort297・preset.fitCond297・docs.fit297(新設)と世代切替の docs.claimScope
# 第297便c: 枝 c の新設 3 本(preset.timeStd297・behavior.timeStd297・docs.timeStd297 —— 時間の標準)を末尾に足した(他枝の新設と第296便の分の差し替えは統合で)
# 第297便d: 枝 d の新設 1 本(ui.liveMeasure297 —— アプリ内実測〔精密〕)を末尾に足した(他枝の新設と第296便の分の差し替えは統合で)
# 第299便d: 枝 d の新設 3 本(behavior.geo4Stable299 —— geoPN=4 の安定の条件・preset.chainSpread299 —— 広げた円盤の配置・preset.meshMigrate299 —— 旧 spaceMesh の 🔁 の移行)を末尾に足した
# 第299便f: 枝 f の新設 2 本(ui.selEdit299 —— 選択粒子の編集の出し分け・ui.paramTab299 —— パラメータタブの三次元の切り替え)と、行を分けた棚卸し docs.coreCensus を末尾に足した(ui.familyFold296 は既に在る)
# 第300便d: 枝 d の新設 3 本(ui.tiltSwipe300 —— 二本指の縦スワイプで θ・ui.refModelGroup300 —— 参照模型の群・lint.betaBuild300 —— beta 版の名前に便名)を末尾に足した
# 第301便e: 枝 e の新設 3 本(ui.toastSkin301 —— 通知の帯の下地とスキン・ui.tiltWheel301 —— Shift+ホイールで θ・ui.v59Text301 —— v59 の文言の細目)を末尾に足した
# 第298便d: 枝 d の新設 2 本(ui.fitTargetRow298 —— 説明タブのフィットの標的の行のはみ出し・ui.viewTilt298 —— 視点の傾き θ)を末尾に足した(他枝の新設と第297便の分の差し替えは統合で)
DEFAULT_WAVE_IDS="behavior.modeIssues295 behavior.geo4Migrate295 preset.inertial3_295 docs.inertial3Contract295 ui.labels295 behavior.modeSaveWarnings behavior.loadSaveModePolicy behavior.geoMode behavior.geoModeResolve docs.geoModeTable behavior.geo3Inertial294 behavior.geoToyPinned ui.pickerGeoFilter ui.pickerSeparators ui.meshChipState preset.geo3Contract ui.pickerScope ui.observedCompare294 ui.pickerReorg294 ui.emFamily behavior.rayLensExcluded ui.familyFold296 ui.charonFamily ui.step-accounting ui.paramWbgRow behavior.sampleGenContract296 preset.modeNoRestriction prompt.spec-sync behavior.chain296 docs.chainContract296 behavior.composeGate behavior.inertialDragGate preset.clocksGravity preset.groupAnalogies preset.fitDerived296 docs.fitContract296 behavior.claimEffort297 preset.fitCond297 docs.fit297 docs.claimScope preset.timeStd297 behavior.timeStd297 docs.timeStd297 ui.liveMeasure297 ui.fitTargetRow298 ui.viewTilt298 ui.selEdit299 ui.paramTab299 docs.coreCensus behavior.geo4Stable299 preset.chainSpread299 preset.meshMigrate299 ui.tiltSwipe300 ui.refModelGroup300 lint.betaBuild300 ui.toastSkin301 ui.tiltWheel301 ui.v59Text301"
# 第297便a: 枝 a の新設 3 本(preset.lambdaPN297・behavior.lambdaPnOnDrag297・docs.refit297)を末尾に足した(他枝の新設と第296便の分の差し替えは統合で)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS preset.lambdaPN297 behavior.lambdaPnOnDrag297 docs.refit297"
# 第298便a: 枝 a の新設 3 本(behavior.coord3d298・preset.coord3d298・docs.coord3d298 —— 三次元座標の土台)と世代切替の behavior.spinAxisDecl を末尾に足した(他枝の新設の差し替えは統合で)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.coord3d298 preset.coord3d298 docs.coord3d298 behavior.spinAxisDecl"
# 第298便c: 枝 c の新設 4 本(三次元の慣性決定力・空間メッシュの受動プローブ・geoPN=4 の三次元の標準・🌥️ の三次元の写し)と世代切替の behavior.meshDisplayBitsame
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.drag3d298 behavior.meshField298 preset.geo4Std298 docs.moon3d298 behavior.meshDisplayBitsame"
# 第299便c: 枝 c の新設 2 本(preset.planets3d299・docs.planets3d299 —— 惑星の geoPN=3 三次元の本 7 本)を末尾に足した(他枝の新設と世代切替の分の差し替えは統合で)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS preset.planets3d299 docs.planets3d299"
# 第298便b(原仮定者の裁定(第88報)・R166): 退役 8 本・🌘 の f=1 再フィット・フィット記録 w298b-1・比較器の共通化の新設 4 本と、追従した在位の集合のブロック
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS preset.retire298 behavior.fitCond298 docs.refit298 lint.near298 docs.retired docs.noRetiredMention294 preset.revived292b"
# 第298便e(原仮定者の追加指示(第88報の追補)・R166′): 🌘 の周期優先で追従したブロック(docs.refit298・behavior.fitCond298・preset.revived292b は上にある)—— behavior.framePull・wave120.ui
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.framePull wave120.ui"
# 第299便a(統括の検証項目 R169・AN275 ⑤・AN277 ⑥・AN282): 枝 a の新設 3 本(三次元の片側停止・チェックポイントの三次元の帳簿・時間の標準器の三次元化)と、
#   旧世代の分岐を外したブロック(rayLensExcluded・spinAxisDecl・inertial3_295 は上にある)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.coord3dHaltAB299 behavior.ckDrag3d299 docs.timeStd3d299 behavior.contactMode preset.lambdaPN297 docs.refit297 behavior.ckFixcapRestore"
# 第299便b(原仮定者の裁定(第89報)①・R170): 🌘 の朔望月の新設 2 本(behavior.synodicClock299・docs.synodic299)と世代切替で追従した docs.emgrid-sync・claims.sync(docs.refit298・behavior.fitCond298・preset.revived292b・behavior.framePull・wave120.ui は上にある)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.synodicClock299 docs.synodic299 docs.emgrid-sync claims.sync"
# 第299便e: 枝 e の新設 3 本(behavior.ref3d299 —— 参照模型の三次元化・preset.ref3d299 —— 宣言と凍結の二次元の写し・docs.ref3d299)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.ref3d299 preset.ref3d299 docs.ref3d299"
# 第300便a(原仮定者の裁定(第90報)⑤・R175): physics.spaceMesh の全面廃止の新設 1 本(preset.spaceMeshRetired300)と世代切替で追従した 3 本(preset.geo4Std298・preset.meshMigrate299・ui.charonFamily —— docs.retired・docs.noRetiredMention294 は上にある)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS preset.spaceMeshRetired300 preset.meshMigrate299 ui.charonFamily"
# 第300便b(原仮定者の裁定(第90報)①②③・R176): 地球の整理と近似の原則の新設 2 本(preset.earthReorg300・docs.approx300)と世代切替で追従したブロック(docs.retired・docs.noRetiredMention294・preset.retire298・behavior.fitCond298・preset.revived292b は上にある)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS preset.earthReorg300 docs.approx300 preset.earthMoonInertial preset.earthMoonTide behavior.dragCoreGate preset.fitCond297 docs.inertial3Contract295 docs.fitContract296"
# 第300便m(原仮定者の裁定(第90報)④・R176): 🌞 solarInner の退役の新設 1 本(preset.solarInnerRetired300)と世代切替で追従したブロック(docs.retired・preset.revived292b・preset.earthReorg300・docs.noRetiredMention294・ui.samplePicker・ui.liveMeasure297・ui.labels295 は上にある)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS preset.solarInnerRetired300 preset.unifyTable docs.calibration-verdict-sync docs.calaudit-sync docs.calCause lint.kf0RunsCondition ui.holdRemedy docs.timingContract294 docs.intakeC docs.intakeD docs.uranusSwap behavior.solarsigmaGuards behavior.unitConvertedFirst"
# 第300便c: 枝 c の新設 2 本(preset.saturnRing3d300 —— 土星の輪の三次元・docs.solar16Contract300 —— 太陽系 16 体の入力の契約と器)を末尾に足した(他枝の新設の差し替えは統合で)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS preset.saturnRing3d300 docs.solar16Contract300"
# 第301便a(原仮定者の裁定(第91報)⑤・R179): 引きずりの強さの総和正規化の新設 2 本(behavior.dragNorm301 —— 法則の零試験と正本・preset.refit301 —— フィットの本の記録と条件の署名)を末尾に足した(他枝の新設の差し替えは統合で)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.dragNorm301 preset.refit301"
# 第301便c(原仮定者の裁定(第91報)②・R181): 枝 c の新設 1 本(behavior.axialSplit301 —— 軸回転 = 慣性軸回転 + 引きずり軸回転)と、🪛 の軸引きずりの数で追従した behavior.drag3d298・behavior.ckDrag3d299
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.axialSplit301"
# 第301便b: 枝 b の新設 2 本(behavior.approxMany301 —— 近似多粒子の対のマスク・preset.approxMany301 —— 🍥🍩 の宣言と測り直し・監査)と世代切替で追従した 3 本(preset.chainSpread299・behavior.geo4Stable299・preset.saturnRing3d300 は上にある)を末尾に足した(他枝の新設は統合で)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.approxMany301 preset.approxMany301"
# 第301便f: 枝 f の新設 1 本(behavior.clone2d301 —— 複製とチェックポイントの全本の同一・build の機能ごとの初期化)と、正本を作り直したチェックポイントの棚卸し(behavior.ckFixcapRestore —— 上にある)・三次元の複製(behavior.ckDrag3d299 —— 上にある)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.clone2d301"
# 第301便g(原仮定者の裁定 AN300・R185): 枝 g の新設 1 本(docs.wbgLaw301 —— W_bg の法則性の探索の正本と文書)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS docs.wbgLaw301"
# 第301便d(原仮定者の裁定(第91報)④・R182): 枝 d の新設 2 本(docs.chainBurst301 —— 連鎖円盤の 14000 步付近の飛びの記録と正本・文書・preset.chainBurstShell301 —— 放出の探索の写し 🧨)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS docs.chainBurst301 preset.chainBurstShell301"
# 第302便a(原仮定者の裁定(第92報)AN304 ②⑤・R186): 枝 a の新設 2 本(behavior.wbgDirect302 —— W_bg の直接定義・gain の廃止・移行表・互換読込・ui.wbgSlider302 —— パラメータタブの W_bg の行)と
#   世代切替で追従した UI の 4 本(ui.paramOrderDrag・ui.paramWbgRow・ui.bgComplexPanel・ui.bgDerivPanel)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.wbgDirect302 ui.wbgSlider302 ui.paramOrderDrag ui.paramWbgRow ui.bgComplexPanel ui.bgDerivPanel"
# 第302便b(原仮定者の裁定(第92報)AN304 ①・R187): 枝 b の新設 1 本(behavior.gLoc302 —— 局所重力 G_loc の宣言・零試験・固定中心の近点・受理器・状態の契約・正本と文書)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.gLoc302"
# 第302便d(決断事項 AN303 ①②⑤・R188): 枝 d の新設 2 本(behavior.semic302 —— 本体の積分器 semic の門・docs.semic302 —— 影響の記録と文書)と、世代切替で split を明示した behavior.composeGate(上の常設)・docs.chainBurst301(上)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.semic302 docs.semic302"
# 第302便c(原仮定者の裁定(第92報)AN304 ①③・R190): 枝 c の新設 2 本(behavior.wbgEstimate302 —— W_bg の推定・推定を入れる・preset.gLocPlanets302 —— 惑星の本の G_loc と 🌡️ の再フィット)と、世代を受けた既存の 5 本
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.wbgEstimate302 preset.gLocPlanets302 preset.planets3d299 docs.planets3d299 behavior.wbgDirect302 docs.wbgLaw301 behavior.gLoc302"
# 第302便e(原仮定者の裁定(第92報)・R189 の細目): 枝 e の新設 4 本(behavior.axialSign302 —— 源の軸と Ω の符号の正準化・ui.wheel302 —— 横だけのホイールと θ の向きの反転・lint.stateContract302 —— 状態の契約の登録漏れと持ち越し・lint.retiredRef302 —— 説明文の退役の本の名)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.axialSign302 ui.wheel302 lint.stateContract302 lint.retiredRef302"
# 第302便h(ゲート 1 の FAIL 12 件の処置 —— R186〜R190 の統合後): 新設なし。歴史の記録の器を分割の步に固定して正本を戻した 9 本と世代切替を足した 2 本(⑦ の照合・W_bg の同値移行の署名の記録)・再生成範囲の宣言
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.regenScope docs.dragCoreFit docs.composeContract docs.tideContract docs.inertial3Contract295 preset.fitDerived296 preset.fitCond297 docs.fit297 docs.pn1Contract docs.moon3d298 docs.planets3d299 preset.earthReorg300"
# 第303便a(原仮定者の裁定(第93報)①②・R191): 枝 a の新設 2 本(preset.revertGLoc303 —— 在位の惑星の本の G_loc を外す・semic の再フィット 4 本・🌔 の移送・A1 の列・
#   docs.obsA1B1303 —— 観測の候補の行 A1・A4・B1 の行自体の整合)と、第302便の宣言の写し(tests/lib-w303a-pre.mjs)/再フィットの記録で世代を受けた既存の 14 本(と時間の標準・安定 hash の宣言)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS preset.revertGLoc303 docs.obsA1B1303 preset.gLocPlanets302 preset.planets3d299 docs.planets3d299 preset.fitCond297 docs.fit297 docs.moon3d298 ui.liveMeasure297"
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS preset.fitDerived296 docs.fitContract296 preset.refit301 docs.wbgLaw301 behavior.wbgDirect302 ui.wbgSlider302 preset.meshMigrate299 docs.timeStd297 docs.timeStd3d299 lint.stableHashPaths"
# 第303便b(原仮定者の裁定(第93報)④⑤・R192): 枝 b の新設 2 本(behavior.inertialR2_303 —— 源の慣性決定力 r⁻² の宣言・零試験・閉形式・解法・cRatio・状態の契約・docs.inertialR2_303 —— 正本と文書)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.inertialR2_303 docs.inertialR2_303"
# 第303便c(原仮定者の裁定(第93報)③・R193): 枝 c の新設 1 本(docs.earthMoon303 —— 地球–月の基線の監査・天体半径の効き方の目録・太陽が背景側・多量の同定の正本と文書)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS docs.earthMoon303"
# 第303便e(決断事項 AN312 ③・R194): 枝 e の新設 2 本(lint.canon303 —— 第302便の正本 5 本を CANON へ・lint.harnessSmoke303 —— 鎖の前の器の煙試験・ゲートの前の転記照合・探索の停止幅の道具)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.canon303 lint.harnessSmoke303"
# 第304便a: 枝 a の新設 2 本(behavior.shell304 —— 引きずり核の殻・自己の項・総速度の読み口の零試験・docs.shell304 —— 正本と文書)を末尾に足した(他枝の新設の差し替えは統合で)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.shell304 docs.shell304"
# 第304便b(原仮定者の裁定(第94報)・R196): 枝 b の新設 1 本(docs.shell304b —— 引きずり核の球面近似を器の中の写しで測った正本と文書)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS docs.shell304b"
# 第304便c(AN316 ①〜④・R197): 枝 c の新設 2 本(preset.emBaseline304 —— 🌦️🌔 の基線の見直しの宣言・正本の門・fitRecord と観測カードの転記・docs.emBaseline304 —— 正本と文書)と軟化の下限の世代切替の preset.softeningFloor
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS preset.emBaseline304 docs.emBaseline304 preset.softeningFloor"
# 第304便e(統括の検証項目 R198): 枝 e の新設 3 本(lint.canon304 —— 第297便以降の現行の正本 16 本と第303便の 3 本を CANON へ・lint.harnessSmoke304 —— 煙試験の判定の直し 3 型・
#   docs.primaryAudit304 —— 観測の候補の行 EPM2011 の一次表との照合の記録)と、版 2 を受けた lint.harnessSmoke303
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.canon304 lint.harnessSmoke304 docs.primaryAudit304"
# 第305便a(原仮定者の裁定(第96報)・AN326・R199): 枝 a の新設 2 本(behavior.pairNorm305 —— 対ごとの正規化の宣言・零試験・粒子分割・直接法・状態の契約・docs.pairNorm305 —— 正本と文書)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.pairNorm305 docs.pairNorm305"
# 第305便b(第95報・AN332 の裁定・R200): 枝 b の新設 1 本(docs.gfamily305 —— 惑星の G_loc の n の族 × λ ∝ m の写しの正本と文書)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS docs.gfamily305"
# 第305便c(AN327 ③⑤・R201): 枝 c の新設 3 本(behavior.j2_305 —— 三次元の J₂ の受理・零試験・軸の経路・保存・解析の歳差・状態の契約・preset.emJ2_305 —— 🌦️🌔 の地球の J₂ の宣言・fitRecord・
#   観測カードの転記・🌔 の T1 を転記しない契約・docs.j2_305 —— 正本と文書)と、T1 の転記の契約を直した preset.earthReorg300
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.j2_305 preset.emJ2_305 docs.j2_305 preset.earthReorg300"
# 第305便d(原仮定者の裁定(第96報)・R202): 枝 d の新設 1 本(docs.spinAvg305 —— 回転引きずり・軸引きずりと多粒子の平均の診断の正本と文書)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS docs.spinAvg305"
# 第305便e(決断事項 AN323・AN327・AN328・AN318・AN333・統括の検証項目 R203): 枝 e の新設 4 本(behavior.shellTinyEta305 —— 極小 η の受理・ui.softeningFloorSlider305 —— 軟化の行の下限・
#   docs.charonAudit305 —— 🟪 の基線の監査・docs.obsTime305 —— 観測の時間標準の記録)と、形の説明を受けた behavior.inertialR2_303
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.shellTinyEta305 ui.softeningFloorSlider305 docs.charonAudit305 docs.obsTime305 behavior.inertialR2_303"
# >>> 第306便e(決断事項 AN339 の案 (A)・統括の検証項目 R208): 枝 e の新設 2 本(preset.charonFix306 —— 🟪 の宣言の直し (A)・docs.charonFix306 —— 正本と文書)
#   (世代切替の docs.charonAudit305 は第305便e の行に既にある)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS preset.charonFix306 docs.charonFix306"
# <<< 第306便e
WAVE_IDS="${POST_MERGE_WAVE_IDS-$DEFAULT_WAVE_IDS}"
BASE=""; FAILED=""; NOROOT=0; NOPRE=0
while [ $# -gt 0 ]; do
  case "$1" in
    --base) BASE="${2:-}"; shift 2 ;;
    --failed) FAILED="${2:-}"; shift 2 ;;
    --no-root) NOROOT=1; shift ;;
    --no-preflight) NOPRE=1; shift ;;
    -h|--help) sed -n '2,30p' "$0"; exit 0 ;;
    *) echo "post-merge-qa: 知らない引数 $1" >&2; exit 2 ;;
  esac
done
if [ -z "${PLAYWRIGHT_CORE_DIR:-}" ] && [ -d /opt/node22/lib/node_modules/playwright ]; then export PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright; fi
LOG="${POST_MERGE_LOG:-${TMPDIR:-/tmp}/post-merge-qa-$(date -u +%Y%m%dT%H%M%SZ)}"
mkdir -p "$LOG" || exit 2
T0=$(date +%s); fail=0
count() { grep -c "^$1 " "$2" 2>/dev/null || true; }
say() { echo "[post-merge-qa] $*"; }

# ① 静的受理
S1="skip"
if [ $NOPRE -eq 0 ]; then
  say "① 静的受理(qa-preflight beta)→ $LOG/1-preflight.log"
  # 第305便e(決断事項 AN328): heap の上限 6144 MiB(第304便e の測定 —— 2048 MiB で heap out of memory・終了コード 134)
  QA_TARGET=beta/index.html node --max-old-space-size=6144 tests/qa-preflight.mjs >"$LOG/1-preflight.log" 2>&1; rc=$?
  p=$(count PASS "$LOG/1-preflight.log"); f=$(count FAIL "$LOG/1-preflight.log")
  S1="preflight ${p}/$((p + f))"; [ $rc -eq 0 ] || { S1="$S1 FAIL(rc $rc)"; fail=1; }
fi

# ② 接続契約
say "② 接続契約(regen-chain --audit / --self-test)→ $LOG/2-*.log"
node tools/regen-chain.mjs --audit >"$LOG/2-audit.json" 2>&1; ra=$?
node tools/regen-chain.mjs --self-test >"$LOG/2-selftest.json" 2>&1; rs=$?
S2="audit $([ $ra -eq 0 ] && echo ok || echo FAIL)・self-test $([ $rs -eq 0 ] && echo ok || echo FAIL)"
[ $ra -eq 0 ] && [ $rs -eq 0 ] || fail=1

# ③ 前回失敗項
if [ -z "$FAILED" ] && [ -f tests/out/qa-results-full-beta.json ]; then
  FAILED=$(node -e 'const j=JSON.parse(require("fs").readFileSync("tests/out/qa-results-full-beta.json","utf8"));const src=require("fs").readFileSync("tests/qa.mjs","utf8");console.log([...new Set((j.results||[]).filter(r=>!r.pass).map(r=>r.id))].filter(id=>src.includes("add(\x27"+id+"\x27")).join(" "))' 2>/dev/null || true)
fi
S3="前回失敗 0"
if [ -n "$FAILED" ]; then
  say "③ 前回失敗項 $FAILED → $LOG/3-failed.log"
  # shellcheck disable=SC2086
  node tests/exp-w258c-qapart.mjs $FAILED >"$LOG/3-failed.log" 2>&1; rc=$?
  p=$(count PASS "$LOG/3-failed.log"); f=$(count FAIL "$LOG/3-failed.log")
  S3="前回失敗 ${p}/$((p + f))"; [ $rc -eq 0 ] || { S3="$S3 FAIL"; fail=1; }
fi

# ③′ 本便の新設ブロック(名前 → qa.mjs の id: 完全一致か末尾一致。無い名は未統合として数える)
S3W="本便 なし"
if [ -n "$WAVE_IDS" ]; then
  RES=$(node -e 'const src=require("fs").readFileSync("tests/qa.mjs","utf8");const ids=[...new Set([...src.matchAll(/add\(\x27([\w.\-]+)\x27/g)].map(m=>m[1]))];const got=[],miss=[];for(const n of process.argv.slice(1)){if(ids.includes(n)){got.push(n);continue;}const h=ids.filter(i=>i.endsWith("."+n));if(h.length)got.push(...h);else miss.push(n);}console.log(got.join(" ")+"|"+miss.join(" "))' $WAVE_IDS 2>/dev/null || echo "|$WAVE_IDS")
  WGOT="${RES%%|*}"; WMISS="${RES#*|}"
  nmiss=$(echo "$WMISS" | wc -w)
  if [ -n "$WGOT" ]; then
    say "③′ 本便の新設ブロック $WGOT → $LOG/3w-wave.log"
    # shellcheck disable=SC2086
    node tests/exp-w258c-qapart.mjs $WGOT >"$LOG/3w-wave.log" 2>&1; rc=$?
    p=$(count PASS "$LOG/3w-wave.log"); f=$(count FAIL "$LOG/3w-wave.log"); s=$(count SKIP "$LOG/3w-wave.log")
    S3W="本便 ${p}/$((p + f))$([ "$s" -gt 0 ] && echo "(SKIP $s)")・未統合 ${nmiss}"; [ $rc -eq 0 ] || { S3W="$S3W FAIL"; fail=1; }
  else S3W="本便 0/0・未統合 ${nmiss}"
  fi
fi

# ④ 常設集合(beta と root)
say "④ 常設集合 beta → $LOG/4-beta.log"
# shellcheck disable=SC2086
node tests/exp-w258c-qapart.mjs $IDS >"$LOG/4-beta.log" 2>&1; rb=$?
pb=$(count PASS "$LOG/4-beta.log"); fb=$(count FAIL "$LOG/4-beta.log"); sb=$(count SKIP "$LOG/4-beta.log")
S4="beta ${pb}/$((pb + fb))$([ "$sb" -gt 0 ] && echo "(SKIP $sb)")"
[ $rb -eq 0 ] || { S4="$S4 FAIL"; fail=1; }
if [ $NOROOT -eq 0 ]; then
  say "④ 常設集合 root → $LOG/4-root.log"
  # shellcheck disable=SC2086
  QA_TARGET=index.html node tests/exp-w258c-qapart.mjs $IDS >"$LOG/4-root.log" 2>&1; rr=$?
  pr=$(count PASS "$LOG/4-root.log"); fr=$(count FAIL "$LOG/4-root.log"); sr=$(count SKIP "$LOG/4-root.log")
  S4="$S4・root ${pr}/$((pr + fr))(SKIP $sr)"
  [ $rr -eq 0 ] || { S4="$S4 FAIL"; fail=1; }
fi

# ⑤ 影響サンプルの短走(情報)
S5="bitsame なし(--base 無し)"
if [ -n "$BASE" ]; then
  case "$BASE" in /*) BASE="$(realpath --relative-to="$ROOT" "$BASE")" ;; esac
  if [ ! -f "$BASE" ]; then S5="bitsame FAIL(基点 $BASE が無い)"; fail=1
  else
    say "⑤ bitsame $BASE → beta/index.html → $LOG/5-bitsame.json"
    node tests/exp-w258c-bitsame.mjs "$BASE" beta/index.html >"$LOG/5-bitsame.json" 2>"$LOG/5-bitsame.err"; rc=$?
    if [ $rc -gt 1 ] || ! node -e 'JSON.parse(require("fs").readFileSync(process.argv[1],"utf8"))' "$LOG/5-bitsame.json" 2>/dev/null; then S5="bitsame FAIL(器 rc $rc)"; fail=1
    else S5=$(node -e 'const j=JSON.parse(require("fs").readFileSync(process.argv[1],"utf8"));const ids=j.diff.map(s=>s.split(":")[0]);const pe=(j.pageErrorsBase||[]).length+(j.pageErrorsNow||[]).length;console.log("bitsame "+(j.n-ids.length)+"/"+j.n+(ids.length?"(差分 ID "+ids.slice(0,8).join(",")+(ids.length>8?" 他 "+(ids.length-8):"")+" —— 情報)":"")+(pe?" pageErrors "+pe:""))' "$LOG/5-bitsame.json")
    fi
  fi
fi

T1=$(date +%s)
echo "post-merge-qa: ① $S1 ② $S2 ③ $S3 ③′ $S3W ④ $S4 ⑤ $S5 所要 $((T1 - T0)) s → $([ $fail -eq 0 ] && echo OK || echo FAIL)(ログ $LOG)"
exit $fail

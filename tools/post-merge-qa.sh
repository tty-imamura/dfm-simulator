#!/usr/bin/env bash
# 第287便f(原仮定者の裁定(第77報)AN70・統括の検証項目 R112): **統合直後の部分 QA**(常設集合)を 1 本で回す。
#
# 統合(worktree の取り込み)の直後、フル QA・再生成の鎖の前に、壊れやすい所を短く一周する。**フル QA の代わりではない**
# (CI が最終裁定者 —— 手元のゲートは CI の代わりにしない)。順序(先に落ちるものを先に):
#   ① 静的受理   tests/qa-preflight.mjs(QA_TARGET=beta/index.html —— tier lint の文と全内蔵の受理・構築・1 歩。Chromium なし・heap の上限 6144 MiB —— 第305便e)
#   ② 接続契約   node tools/regen-chain.mjs --audit と --self-test(再生成表の依存・html を書く段・済み印の契約 —— 枝ごとに足した段の接続)
#                第313便c: と --scope-all --check(presets:"all" の段の理由の一覧が今の器と同じか —— 落ちたら統合で段が増えた・--write で引き直す)
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
#             POST_MERGE_PHYS_SCAN_IDS(③′ に必ず足す PHYSICS の全文を否定の照合で読む QA の一式 —— 第309便d・既定は下の PHYS_SCAN_IDS・空文字で外す)
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
# <<< 第306便a の塊(原仮定者の裁定〔第97報〕AN336・R204): 枝 a の新設 2 本(docs.an336_306 —— 派生した参照値の生成器の契約・正本の門・PHYSICS の表と正本の数・
#   preset.planets306 —— 在位の惑星 7 本が同じ k・gLoc kappaC2・denom pair・自己なし・fitted は 🌡️ だけ・木星の注記・43.0 の履歴の列)と、第306便a の世代を受けた preset.planets3d299・docs.planets3d299
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS docs.an336_306 preset.planets306 preset.planets3d299 docs.planets3d299"
# >>> 第306便a の塊
# 第305便e(決断事項 AN323・AN327・AN328・AN318・AN333・統括の検証項目 R203): 枝 e の新設 4 本(behavior.shellTinyEta305 —— 極小 η の受理・ui.softeningFloorSlider305 —— 軟化の行の下限・
#   docs.charonAudit305 —— 🟪 の基線の監査・docs.obsTime305 —— 観測の時間標準の記録)と、形の説明を受けた behavior.inertialR2_303
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.shellTinyEta305 ui.softeningFloorSlider305 docs.charonAudit305 docs.obsTime305 behavior.inertialR2_303"
# >>> 第306便e(決断事項 AN339 の案 (A)・統括の検証項目 R208): 枝 e の新設 2 本(preset.charonFix306 —— 🟪 の宣言の直し (A)・docs.charonFix306 —— 正本と文書)
#   (世代切替の docs.charonAudit305 は第305便e の行に既にある)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS preset.charonFix306 docs.charonFix306"
# <<< 第306便e
# ==== 第307便e の塊(ここから)====
# 第307便e(AN340 ④・AN342 ③・AN344 ①②・R213): 枝 e の新設 4 本(behavior.gLocNull307 —— B 側で G_loc を切る受理と実行・在位の惑星 7 本のワンタップ = 両方 OFF・
#   preset.fitRole307 —— 標的ごとの役割の契約・🌦️ の交点の標的 18.599525・🟪 の役割・preset.coldReason307 —— 🥶 の判定の理由・docs.w307e —— 文書)と、世代切替を受けた
#   preset.emResolve306・preset.charonFix306・docs.pn1Contract
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.gLocNull307 preset.fitRole307 preset.coldReason307 docs.w307e docs.pn1Contract"
# ==== 第307便e の塊(ここまで)====
# ==== 第306便b の塊ここから(他の枝の行と混ぜない) ====
# 第306便b(AN336 ③・AN333・AN335 ③・R205): 枝 b の新設 1 本(docs.periodN306 —— 周期による G_loc の n の識別の器の正本と文書)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS docs.periodN306"
# ==== 第306便b の塊ここまで ====
# ==== 第306便c の塊(ここから —— 他の枝の塊と混ぜない)====
# 第306便c(AN337 ③④⑤・AN335 ①・R206): 枝 c の新設 3 本(preset.emResolve306 —— 🌦️ の J₂ ありの初期配置の解き直しの宣言・fitRecord・観測カード・🌔 の写し・対照の説明・
#   docs.emResolve306 —— 正本と文書・docs.obsMoonNode306 —— 交点の観測の行の確認の記録)と、pin305 の世代切替を足した preset.emJ2_305・🌔 の観測カードの数を見る preset.earthReorg300
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS preset.emResolve306 docs.emResolve306 docs.obsMoonNode306 preset.emJ2_305 preset.earthReorg300"
# ==== 第306便c の塊(ここまで)====
# ==== 第306便d の塊(ここから)====
# 第306便d(原仮定者の裁定(第96報)・AN338・R207): 枝 d の新設 1 本(docs.rotFrame306 —— 回転引きずりを座標変換として測る器の正本と文書)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS docs.rotFrame306"
# ==== 第306便d の塊(ここまで)====
# ==== 第307便a の塊(ここから)====
# 第307便a(原仮定者の裁定(第100報)・AN345・AN343・R209): 枝 a の新設 1 本(docs.sphereAxial307 —— 軸引きずりの球面の核・回転の位置の剛体の步の正本と文書と受理の契約)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS docs.sphereAxial307"
# ==== 第307便a の塊(ここまで)====
# ==== 第307便b の塊(ここから)====
# 第307便b(原仮定者の裁定(第100報)・AN345 ③⑤・R210): 枝 b の新設 2 本(behavior.tide3d307 —— 三次元の明示潮汐と内部熱の受理・二次元のビット同一・恒等式・状態の契約・
#   docs.tide3d307 —— 正本と文書)と、三次元の受理の門の一覧が動く behavior.coord3d298
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.tide3d307 docs.tide3d307 behavior.coord3d298"
# ==== 第307便b の塊(ここまで)====
# ==== 第308便b の塊(ここから)====
# 第308便b(原仮定者の裁定(第101報・第102報)・AN348・R215): 枝 b の新設 2 本(behavior.axisHold308 —— 元の自転軸の維持と慣性自転への駆動の受理・参照との一致・帳簿・二重計上の型・
#   状態の契約・docs.axisHold308 —— 正本と文書)と、状態の契約の一覧が動く lint.stateContract302
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.axisHold308 docs.axisHold308 lint.stateContract302"
# ==== 第308便b の塊(ここまで)====
# ==== 第309便b の塊(ここから)====
# 第309便b(原仮定者の裁定(第103報・第104報)・AN356・AN358・AN362・R219): 枝 b の新設 2 本(behavior.maintain309 —— 維持の型の受理・参照との一致・維持の門と表示の門・
#   口座・dt の走査・状態の契約・docs.maintain309 —— 正本と文書)。axisHold の受理器が動く behavior.axisHold308 と状態の契約の lint.stateContract302 は第308便b の塊にある
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.maintain309 docs.maintain309"
# ==== 第309便b の塊(ここまで)====
# ==== 第310便b の塊(ここから)====
# 第310便b(決断事項 AN370・AN373・AN365・AN371・R223): 枝 b の新設 2 本(behavior.holdLedger310 —— 維持の型の帳簿の欄〔間隔が未宣言・{tauHold} の基準・
#   実際の内部熱/帳簿の維持のコスト/背景からの供給〕と状態を動かさないこと・docs.pairHeat310 —— 対の熱の相反の測定の正本と文書)。維持の型の器は第309便b の塊にある
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.holdLedger310 docs.pairHeat310"
# ==== 第310便b の塊(ここまで)====
# ==== 第307便c の塊(ここから)====
# 第307便c(原仮定者の裁定(第100報)・AN345 ④・R211): 枝 c の新設 1 本(docs.spinDecomp307 —— 金星・木星の観測の自転の分解の器の正本と文書)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS docs.spinDecomp307"
# ==== 第307便c の塊(ここまで)====
# ==== 第308便c の塊(ここから)====
# 第308便c(原仮定者の裁定(第102報)②①・第101報・AN355・AN348・R216): 枝 c の新設 1 本(docs.sunSpin308 —— 要求される太陽の慣性自転と銀河を源とする引きずり軸回転の器の正本と文書)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS docs.sunSpin308"
# ==== 第308便c の塊(ここまで)====
# ==== 第309便c の塊(ここから)====
# 第309便c(原仮定者の裁定(第103報)AN355・AN357・(第105報)AN364・R220): 枝 c の新設 2 本(behavior.initObs309 —— 観測の自転と移動の初期値の分解の受理・門・状態の契約・
#   docs.recheck309 —— AN357 の再確認の器の正本と文書)と、状態の契約の一覧が動く lint.stateContract302・PHYSICS 全体を走査する docs.*(新しい節の数と単位)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.initObs309 docs.recheck309 lint.stateContract302 docs.mercuryUnits docs.ref3d299 preset.spaceMeshRetired300"
# ==== 第309便c の塊(ここまで)====
# ==== 第307便d の塊(ここから)====
# 第307便d(原仮定者の裁定(第100報)「UI関連タスク」6 項目・R212): 枝 d の新設 6 本(スピンの表示の上限・右下の XYZ の軸・サンプルの行の geoPN・「E水準」を「その他」へ・
#   λ_PN=0 で α の淡色・kFrame=0 で qLock と q の淡色と kFrame の並び)と、世代切替を足した既存の UI の QA(畳みの次元・「その他」の段と軸の数・パラメータの並び)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS ui.spinVisCap307 ui.axisGizmo307 ui.pickerGeoLine307 ui.pickerEmergence307 ui.paramAlphaGrey307 ui.paramDragGrey307"
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS ui.pickerFilterFold ui.pickerOtherChips ui.pickerSeparators ui.pickerBadgeAxes ui.pickerOtherTriState ui.pickerOtherFold ui.pickerStatusAxes ui.presetpicker ui.samplePicker ui.paramOrderDrag wave124.ui"
# ==== 第307便d の塊(ここまで)====
# ==== 第308便a の塊(ここから)====
# 第308便a(原仮定者の裁定(第101報)・AN346・AN347・AN354・R214): 枝 a の新設 1 本(docs.bevel308 —— 軸引きずりの鏡映の核の正本と文書と受理の契約)と、
#   遠方の M1 の外部の級数で正本の数が動く docs.sphereAxial307
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS docs.bevel308 docs.sphereAxial307"
# ==== 第308便a の塊(ここまで)====
# ==== 第309便a の塊(ここから)====
# 第309便a(原仮定者の裁定(第103報)・AN359・AN363・R218): 枝 a の新設 2 本(behavior.invSq309 —— 新しい引きずり則と dragCore の既定の受理・エンジンと参照・opt-in・
#   docs.invSq309 —— 正本と文書)と、PHYSICS 全体を走査する docs.*(新しい節の数と単位が古い docs.* に当たらないか)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.invSq309 docs.invSq309 docs.mercuryUnits docs.ref3d299 preset.spaceMeshRetired300 lint.stateContract302"
# ==== 第309便a の塊(ここまで)====
# ==== 第310便a の塊(ここから)====
# 第310便a(原仮定者の裁定(第107報)・(第109報)AN380・AN378・AN384・AN385・R222): 枝 a の新設 2 本(behavior.invSq310 —— Wbg2 は 0 だけの受理・中心の向き・外殻の源・
#   自己の場の前計算・docs.invSq310 —— 正本と文書)と、版を上げた新則を両方の版で読む behavior.invSq309・docs.invSq309・新則の本の分解の behavior.initObs309
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.invSq310 docs.invSq310 behavior.invSq309 docs.invSq309 behavior.initObs309"
# ==== 第310便a の塊(ここまで)====
# ==== 第308便d の塊(ここから)====
# 第308便d(AN351・AN350・R217 —— 細目): 枝 d の新設 4 本(preset.fitRole308 —— 🌡️🟫🌘 の標的の役割・behavior.tide3Recv308 —— 三次元の潮汐の受け手の受理の警告・
#   lint.qaEvidenceStamp308 —— 保存 QA の刻印と SAMPLE_STATUS の根拠〔情報〕・docs.w308d —— 文書と perf の長さ)と、役割を宣言していない本の選び方を宣言からにした preset.fitRole307・
#   第307便の fitRecord の写し/record308d で照合する世代切替の preset.revertGLoc303・docs.synodic299・preset.planets306、第308便d の警告を除いて数える behavior.tide3d307、
#   🟫 の観測カードと README の語を見る docs.fitContract296・docs.noRetiredMention294
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS preset.fitRole308 behavior.tide3Recv308 lint.qaEvidenceStamp308 docs.w308d preset.fitRole307 preset.revertGLoc303 docs.synodic299 preset.planets306 behavior.tide3d307 docs.fitContract296 docs.noRetiredMention294"
# ==== 第308便d の塊(ここまで)====
# ==== 第310便d の塊(ここから)====
# 第310便d(原仮定者の裁定(第109報)AN380・AN384〜AN386・AN336・R225): 枝 d の新設 1 本(docs.mdSweep310 —— 太陽の m_d の掃引の器の正本と文書・在位の 🌡️ の宣言が不変)と、
#   標的 1PN + A1 と在位の 🌡️ の宣言を読む第306便a の docs.an336_306・preset.planets306
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS docs.mdSweep310 docs.an336_306 preset.planets306"
# ==== 第310便d の塊(ここまで)====
# ==== 第311便a の塊(ここから)====
# 第311便a(原仮定者の裁定(第110報)AN387 ④・DECISIONS v70 §1 AN397・AN384・R226): 枝 a の新設 2 本(behavior.coreSpin311 —— dragCore の自転と軸の受理・未宣言のビット同一・
#   宣言の値 = 天体の一致・核と外殻の線形・極薄の厚い殻の受理の防御・docs.coreSpin311 —— 正本と文書)と、受理器と新則の評価を読む behavior.invSq310・behavior.invSq309・behavior.initObs309
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.coreSpin311 docs.coreSpin311 behavior.invSq310 behavior.invSq309 behavior.initObs309"
# ==== 第311便a の塊(ここまで)====
# ==== 第311便b の塊(ここから)====
# 第311便b(原仮定者の裁定(第110報)・AN389・AN382・AN390・AN395・R227): 枝 b の新設 2 本(behavior.galaxial311 —— 銀河の一様軸引きずりの受理とビット同一・受け手の制限・分解の拒否・
#   docs.galaxial311 —— 正本と文書)と、受理・分解・build を読む behavior.invSq310・docs.invSq310(段 Z の 2 行が拒否へ)・behavior.invSq309・behavior.initObs309・docs.recheck309・状態の契約
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.galaxial311 docs.galaxial311 behavior.invSq310 docs.invSq310 behavior.invSq309 docs.invSq309 behavior.initObs309 docs.recheck309 lint.stateContract302"
# ==== 第311便b の塊(ここまで)====
# ==== 第312便b の塊(ここから)====
# 第312便b(原仮定者の裁定(第114報)・AN395・R231): 枝 b の新設 2 本(behavior.galaxialRd312 —— 銀河の一様軸引きずりの受け手の R_d の応答 rdPow・refRadius の受理・省略のビット同一・
#   q の比・位置の不変・同じ R_d の双子・β と並進の不変・同じ R_d の対の軸の角・docs.galaxialRd312 —— 正本と文書・〔第311便b〕と〔第311便 — 統括〕の注記)と、
#   同じ鍵と読み口を読む behavior.galaxial311・docs.galaxial311(〔第311便b〕に注記)・新則の受理を読む behavior.invSq310・behavior.coreSpin311・behavior.initObs309・状態の契約
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.galaxialRd312 docs.galaxialRd312 behavior.galaxial311 docs.galaxial311 behavior.invSq310 behavior.coreSpin311 behavior.initObs309 lint.stateContract302"
# ==== 第312便b の塊(ここまで)====
# ==== 第311便d の塊(ここから)====
# 第311便d(原仮定者の裁定(第110報)AN387・(第111報)AN391・AN392・AN386・AN396・R229): 枝 d の新設 1 本(docs.planet3_311 —— 3 惑星の dragCore の探索の器の正本と文書・
#   在位の 🌡️🌋🔴 の宣言が不変)と、同じ写しの作り方と標的を読む docs.mdSweep310・docs.an336_306
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS docs.planet3_311 docs.mdSweep310 docs.an336_306"
# ==== 第311便d の塊(ここまで)====
# ==== 第312便a の塊(ここから)====
# 第312便a(原仮定者の裁定(第114報)AN398・R230): 枝 a の新設 2 本(behavior.decayK1_312 —— 一貫した K1 の重みの opt-in の受理・未宣言のビット同一・lib との照合・遠方の次数・
#   docs.decay312 —— 減衰の比較のスクリーニングの正本と文書)と、受理器と新則の評価を読む behavior.invSq310・behavior.invSq309・behavior.initObs309・behavior.coreSpin311・behavior.galaxial311・
#   第311便d の正本を読む docs.planet3_311・状態の契約
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.decayK1_312 docs.decay312 behavior.invSq310 behavior.invSq309 behavior.initObs309 behavior.coreSpin311 behavior.galaxial311 docs.planet3_311 lint.stateContract302"
# ==== 第312便a の塊(ここまで)====
# ==== 第312便d の塊(ここから)====
# 第312便d(原仮定者の裁定(第114報)・AN398・AN396・AN336・R233): 枝 d の新設 1 本(docs.confirm312 —— 確認の器の正本と文書・在位の 🏀🌦️ の宣言が不変)と、
#   v2 の世代切替を受けた docs.planet3_311(AN396 の採用の欄・門の直し)・同じ写しと標的を読む docs.mdSweep310・docs.an336_306・CANON の lint.canon304
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS docs.confirm312 docs.planet3_311 docs.mdSweep310 docs.an336_306 lint.canon304"
# ==== 第312便d の塊(ここまで)====
# ==== 第313便a の塊(ここから)====
# 第313便a(原仮定者の裁定(第115報)AN399・AN402・AN403・AN404・R234): 枝 a の新設 3 本(behavior.kappaM313 —— K1 の規則の鍵 rdRule:"kappaM" の受理・閉じた式・明示の優先・下限の記録・
#   省略のビット同一・器の写しの明示の dragCore とのビット同一・behavior.shellRecv313 —— 外殻の受け手 "core"・近距離の場・docs.kappaM313 —— 正本と文書)と、受理器と K1 の評価を読む
#   behavior.decayK1_312・docs.decay312・behavior.invSq310・behavior.invSq309・behavior.initObs309・behavior.coreSpin311・behavior.galaxial311・behavior.galaxialRd312・状態の契約・CANON
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.kappaM313 behavior.shellRecv313 docs.kappaM313 behavior.decayK1_312 docs.decay312 behavior.invSq310 behavior.invSq309 behavior.initObs309 behavior.coreSpin311 behavior.galaxial311 behavior.galaxialRd312 lint.stateContract302 lint.canon304"
# ==== 第313便a の塊(ここまで)====
# ==== 第313便b の塊(ここから)====
# 第313便b(原仮定者の裁定(第115報)・AN395・AN399・AN402・R235): 枝 b の新設 2 本(behavior.galaxialRdm313 —— 一様軸引きずりの受け手の質量の次数 massPow・refMass の受理・
#   省略と rdPow だけの宣言のビット同一・R_d 2 倍 → 2 倍・質量 10 倍 → 0.1 倍・位置の不変・β と並進の不変・全天体 κm で共通の係数・docs.galaxialRdm313 —— 正本と文書)と、
#   同じ鍵と読み口を読む behavior.galaxialRd312(器の段 A の massPow の行の世代切替)・docs.galaxialRd312・behavior.galaxial311・docs.galaxial311・新則と K1 の受理を読む
#   behavior.invSq310・behavior.initObs309・behavior.coreSpin311・behavior.decayK1_312・状態の契約
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.galaxialRdm313 docs.galaxialRdm313 behavior.galaxialRd312 docs.galaxialRd312 behavior.galaxial311 docs.galaxial311 behavior.invSq310 behavior.initObs309 behavior.coreSpin311 behavior.decayK1_312 lint.stateContract302"
# ==== 第313便b の塊(ここまで)====
# ==== 第313便d の塊(ここから)====
# 第313便d(原仮定者の裁定(第115報)AN399・AN402・AN401・AN405・AN396′・R237): 枝 d の新設 2 本(docs.planet3v3_313 —— 探索の器 v3・確認の器 v2 の口と版の世代切替・
#   docs.k1confirm313 —— K1 の確認の系の正本〔全天体 κ₀m・h/4 まで〕と小さい係数の分解の表)と、版の世代切替を受けた docs.planet3_311・docs.confirm312・
#   同じ写しと標的を読む docs.mdSweep310・docs.an336_306・正本の段の lint.regenScope・lint.stableHashPaths・CANON の lint.canon304
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS docs.planet3v3_313 docs.k1confirm313 docs.planet3_311 docs.confirm312 docs.mdSweep310 docs.an336_306 lint.regenScope lint.stableHashPaths lint.canon304"
# ==== 第313便d の塊(ここまで)====
# ==== 第314便a の塊(ここから)====
# 第314便a(原仮定者の裁定(第116報)AN404・AN403/AN409・決断事項 AN411 の推奨の型・R238): 枝 a の新設 3 本(behavior.rdExcess314 —— R_d > 観測半径の受理の表・警告の文・
#   読み口 radiusExcess・重なりは今のまま数える・超過の無い本のビット同一・ui.rdExcess314 —— 選択粒子の欄の R_d/R の行・説明の 1 行・破線の円〔超過の天体だけ〕・
#   docs.rdExcess314 —— 正本と文書)と、受理の表を世代切替した behavior.kappaM313・docs.kappaM313・受理器と新則の評価を読む behavior.shellRecv313・behavior.invSq309・
#   behavior.invSq310・behavior.coreSpin311・behavior.decayK1_312・構造核の受理の behavior.dragCoreGate・選択粒子の欄の ui.selEdit299・説明の並びの ui.descOrder・状態の契約・CANON・段の lint
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.rdExcess314 ui.rdExcess314 docs.rdExcess314 behavior.kappaM313 docs.kappaM313 behavior.shellRecv313 behavior.invSq309 behavior.invSq310 behavior.coreSpin311 behavior.decayK1_312 behavior.dragCoreGate ui.selEdit299 ui.descOrder lint.stateContract302 lint.canon304 lint.regenScope lint.stableHashPaths"
# ==== 第314便a の塊(ここまで)====
# ==== 第314便b の塊(ここから)====
# 第314便b(原仮定者の裁定(第116報)の補足・R239): 枝 b の新設 1 本(docs.rdScale314 —— R_d を重力半径へ置き換える場合の検討の正本と文書・PHYSICS〔第314便b〕の解説)と、
#   同じ κ₀ と規則の写しを読む docs.kappaM313・docs.k1confirm313・docs.decay312・正本の段の lint.regenScope・lint.stableHashPaths・CANON の lint.canon304
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS docs.rdScale314 docs.kappaM313 docs.k1confirm313 docs.decay312 lint.regenScope lint.stableHashPaths lint.canon304"
# ==== 第314便b の塊(ここまで)====
# ==== 第314便c の塊(ここから)====
# 第314便c(原仮定者の裁定(第116報)の補足・AN410〔推奨〕・AN405・AN401・AN396′・R240): 枝 c の新設 2 本(docs.k1outer314 —— 外惑星 3 本の K1 の確認の正本〔全天体 κ₀ × エンジンの質量・
#   相対の門〕と小さい係数の分解の表の延長・docs.k1em314 —— 🌦️ の h/4・月の 354 公転の正本と統括の 2 段目との照合)と、同じ写しと標的と第313便d の正本を読む docs.k1confirm313・
#   docs.planet3_311・docs.confirm312・docs.an336_306・正本の段の lint.regenScope・lint.stableHashPaths・lint.regenChain・CANON の lint.canon304
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS docs.k1outer314 docs.k1em314 docs.k1confirm313 docs.planet3_311 docs.confirm312 docs.an336_306 lint.regenScope lint.stableHashPaths lint.regenChain lint.canon304"
# ==== 第314便c の塊(ここまで)====
# ==== 第314便d の塊(ここから)====
# 第314便d(原仮定者の裁定(第116報)の補足・R241): 枝 d の新設 2 本(behavior.pn1x3d314 —— 三次元の geoPN=1〔EIH の 1PN の 3 成分〕の器を作り直して正本と一致・受理の表・
#   走行中の門・切り替えられるようになった在位の geoPN=1 の本の零試験・読み口・docs.pn1x3d314 —— 正本と文書)と、受理の門・三次元の步を読む behavior.coord3d298
#   (器 w298a の拒否の行を geoPN=2 へ)・preset.coord3d298・docs.coord3d298・behavior.coord3dHaltAB299・behavior.drag3d298・preset.planets3d299・docs.planets3d299・
#   二次元の 1PN を読む behavior.pn1Binary・behavior.pn1Sources・docs.pn1Contract・behavior.geoModeResolve・二次元→三次元の切り替えの零試験 ui.paramTab299・
#   状態の契約・S._core・正本の段の lint.regenScope・lint.stableHashPaths・CANON の lint.canon304・lint.qaHeapRelease310
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.pn1x3d314 docs.pn1x3d314 behavior.coord3d298 preset.coord3d298 docs.coord3d298 behavior.coord3dHaltAB299 behavior.drag3d298 preset.planets3d299 docs.planets3d299 behavior.pn1Binary behavior.pn1Sources docs.pn1Contract behavior.geoModeResolve ui.paramTab299 lint.stateContract302 lint.coreBudget lint.regenScope lint.stableHashPaths lint.canon304 lint.qaHeapRelease310"
# ==== 第314便d の塊(ここまで)====
# ==== 第315便a の塊(ここから)====
# 第315便a(原仮定者の裁定(第117報)AN414・統括の推奨 AN419・R242): 枝 a の新設 3 本(docs.symbols315 —— 記号の体系の正本と文書・ui.physLock315 —— 物理対応ロックの読込時の
#   自動 ON〔値を書き直さない〕・lint.kappaSymbol315 —— 新しい説明の裸のカッパ)と、世代切替を受けた物理対応ロックとパラメータのラベルを読む physlock.kt-derive・physlock.ui-110・
#   budget.consistency・params.direct-input・ab.edit-target・wave124.ui・wave125.ui・ui.wave96a、SYSTEM_PROMPT を読む prompt.spec-sync・prompt.schema-sync・ai.external-prompt・
#   preset.lambdaPN297、文を読む behavior.lambdaPnOnDrag297・ai.stabilize・behavior.clusterAnalogy、loadSave の指紋の behavior.ckFixcapRestore、一覧の lint.scopeAll312、
#   正本の段の lint.regenScope・lint.stableHashPaths・CANON の lint.canon304・状態の契約 lint.stateContract302・lint.coreBudget・lint.sectionLookup313
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS docs.symbols315 ui.physLock315 lint.kappaSymbol315 physlock.kt-derive physlock.ui-110 budget.consistency params.direct-input ab.edit-target wave124.ui wave125.ui ui.wave96a prompt.spec-sync prompt.schema-sync ai.external-prompt preset.lambdaPN297 behavior.lambdaPnOnDrag297 ai.stabilize behavior.clusterAnalogy behavior.ckFixcapRestore lint.scopeAll312 lint.regenScope lint.stableHashPaths lint.canon304 lint.stateContract302 lint.coreBudget lint.sectionLookup313"
# ==== 第315便a の塊(ここまで)====
# ==== 第315便b の塊(ここから)====
# 第315便b(決断事項 AN415・原仮定者の裁定(第117報)AN414 の記号・K1 の境界の 1 点・R243): 枝 b の新設 3 本(behavior.rsExcess315 —— r_s > R_obs の読み口の表・等号・質量の割合と本の種類で不変・
#   状態を書かない・K1 の境界の 1 点・ui.rsExcess315 —— 選択粒子の欄 #beRsX・説明の 1 行 #rsExcessNotice・灰の破線の円・画素・docs.rsExcess315 —— 正本と文書)と、表示を世代切替した
#   ui.rdExcess314・受理の境界を世代切替した器を読む behavior.rdExcess314・docs.rdExcess314・受理器を読む behavior.kappaM313・docs.kappaM313・behavior.dragCoreGate・選択粒子の欄と説明の並びの
#   ui.selEdit299・ui.descOrder・ui.gwGroupMove(🎻 の家族のカード)・状態の契約・CANON・段の lint
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.rsExcess315 ui.rsExcess315 docs.rsExcess315 ui.rdExcess314 behavior.rdExcess314 docs.rdExcess314 behavior.kappaM313 docs.kappaM313 behavior.dragCoreGate ui.selEdit299 ui.descOrder ui.gwGroupMove lint.stateContract302 lint.coreBudget lint.regenScope lint.stableHashPaths lint.canon304 lint.qaHeapRelease310"
# ==== 第315便b の塊(ここまで)====
# ==== 第315便c の塊(ここから)====
# 第315便c(原仮定者の裁定(第117報)・決断事項 AN406・AN410・R244): 枝 c の新設 3 本(preset.inposK1_315 —— 在位の 7 本の K1 + rdRule の宣言・behavior.inposK1_315 —— 凍結の写し + 変換と
#   移行した本のビット同一・r_d の読み口・docs.inposK1_315 —— 継ぎ目の正本と文書)と、世代切替を受けた在位の 7 本を読む QA(凍結の写し pinHeadless・legacyView —— 第299便c〜第314便c)・
#   正本の段の lint.regenScope・lint.stableHashPaths・lint.regenChain・CANON の lint.canon304・状態の契約・lint.qaHeapRelease310・lint.sectionLookup313
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS preset.inposK1_315 behavior.inposK1_315 docs.inposK1_315 preset.planets3d299 docs.planets3d299 behavior.dragNorm301 preset.refit301 behavior.gLoc302 behavior.wbgDirect302 ui.wbgSlider302 behavior.wbgEstimate302 preset.gLocPlanets302 preset.revertGLoc303 behavior.inertialR2_303 behavior.shell304 behavior.j2_305 behavior.pairNorm305 behavior.invSq309 behavior.invSq310 behavior.coreSpin311 behavior.initObs309 behavior.shellTinyEta305 docs.charonAudit305 docs.obsTime305 preset.planets306 preset.emResolve306 preset.charonFix306 behavior.galaxial311 behavior.galaxialRd312 behavior.decayK1_312 docs.mdSweep310 docs.planet3_311 docs.confirm312 docs.k1confirm313 docs.k1outer314 docs.an336_306 behavior.composeGate theory.refs-all ui.v59Text301 behavior.maintain309 behavior.holdLedger310 docs.pairHeat310 behavior.galaxialRdm313 behavior.gLocNull307 preset.fitRole308 docs.timeStd3d299 lint.regenScope lint.stableHashPaths lint.regenChain lint.canon304 lint.stateContract302 lint.qaHeapRelease310 lint.sectionLookup313"
# ==== 第315便c の塊(ここまで)====
# ==== 第315便d の塊(ここから)====
# 第315便d(原仮定者の裁定(第117報)・AN413・AN410・AN412・AN414・R245): 枝 d の新設 1 本(docs.satK1_315 —— 衛星 6 本の K1 の検証の正本〔二体と三体 × 引きずりの有無・
#   近似要素の種・数値の帯の判定〕と文書・外惑星の一様の門の表・16 体の入力の契約の変種の表)と、門を一様へ世代切替した docs.k1outer314・同じ器の docs.k1em314・
#   入力の契約を更新した docs.solar16Contract300・16 体の写しを読む docs.pn1x3d314・第313便d の正本の docs.k1confirm313・正本の段の lint.regenScope・lint.stableHashPaths・
#   lint.regenChain・lint.scopeAll312・CANON の lint.canon304・lint.qaHeapRelease310
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS docs.satK1_315 docs.k1outer314 docs.k1em314 docs.solar16Contract300 docs.pn1x3d314 docs.k1confirm313 lint.regenScope lint.stableHashPaths lint.regenChain lint.scopeAll312 lint.canon304 lint.qaHeapRelease310"
# ==== 第315便d の塊(ここまで)====
# ==== 第316便a の塊(ここから)====
# 第316便a(原仮定者の裁定(第118報)・決断事項 AN417・AN420・AN422 ①・AN426・R246): 枝 a の新設 4 本(lint.uiText316 —— a の表の文字列に来歴の語・旧記号・裸の κ が無い・
#   params.i18n316 —— パラメータのラベルと説明は I18N の表・ui.symDisp316 —— 下付きの表示の純関数の表と通す所・docs.uiText316 —— 文書)と、世代切替した既存の照合
#   (lint.kappaSymbol315・prompt.spec-sync・preset.inposK1_315・ui.rdExcess314・ui.rsExcess315 ほか —— 表示の文と下付きの DOM の文字)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.uiText316 params.i18n316 ui.symDisp316 docs.uiText316 lint.kappaSymbol315 prompt.spec-sync preset.inposK1_315"
# ==== 第316便a の塊(ここまで)====
# ==== 第316便b の塊(ここから)====
# 第316便b(原仮定者の裁定(第118報)・決断事項 AN425・R247): 枝 b の新設 2 本(lint.presetText316b —— サンプルの説明の前半 105 本と SAMPLE_STATUS の表示の文に来歴の語と旧記号が無い・
#   preset.referenceKind316b —— 🌡️ の referenceKind)と、表示の文を照合していて世代切替を受けた QA(ui.mercuryNaming・preset.earthMoonInertial・docs.analogyKernelNote・
#   preset.revived292b・preset.inposK1_315・ui.samplePicker・preset.revertGLoc303・preset.emBaseline304・preset.emJ2_305・preset.emResolve306)・SAMPLE_STATUS の同期
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.presetText316b preset.referenceKind316b ui.mercuryNaming preset.earthMoonInertial docs.analogyKernelNote preset.revived292b ui.samplePicker preset.revertGLoc303 preset.emBaseline304 preset.emJ2_305 preset.emResolve306 docs.sampleStatus-sync"
# ==== 第316便b の塊(ここまで)====
# ==== 第316便c の塊(ここから)====
# 第316便c(原仮定者の裁定(第118報)・AN417・AN420・AN426・R248): 枝 c の新設 3 本(lint.presetText316c —— サンプルの説明の後半 71 本の表示の欄に来歴の語と旧記号が無い・
#   lint.miscText316c —— 受理器の理由ほかその他の画面の文と出す側で外す欄 provTextClean・docs.w316c —— 文書)と、受理の理由の文の照合を世代切替した QA
#   (behavior.tide3d307・behavior.tide3Recv308・behavior.galaxial311・behavior.rdExcess314・ui.rdExcess314・behavior.alphaCenAB)・後半の本の説明を読む QA。
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.presetText316c lint.miscText316c docs.w316c behavior.tide3d307 behavior.tide3Recv308 behavior.galaxial311 behavior.rdExcess314 ui.rdExcess314 docs.rdExcess314 behavior.kappaM313 behavior.rsExcess315 behavior.alphaCenAB behavior.siriusAB docs.period-definitions lint.kappaSymbol315 lint.stateContract302 lint.coreBudget lint.regenScope lint.stableHashPaths lint.qaHeapRelease310 lint.sectionLookup313"
# ==== 第316便c の塊(ここまで)====
# ==== 第316便d の塊(ここから)====
# 第316便d(原仮定者の裁定(第118報)・AN423・AN424・AN416・AN422 ②・R249): 枝 d の新設 3 本(docs.satH316 —— 衛星 6 本の三体の診断の正本と文書・docs.paperSymbols316 —— 論文 1〜5 の
#   記号と記号表と脚注・lint.perfTargets316 —— perf の正本に測った対象の sha256 と Node の版)と、停止集合の版上げを読む lint.scopeStop・lint.regenScope・lint.regenChain・lint.scopeAll312・
#   第315便d の正本を読む docs.satK1_315・論文 1 を読む docs.symbols315・論文 2 の転記の p2sens.papersync・perf を読む lint.perfAbJit・正本の段の lint.stableHashPaths・CANON の lint.canon304・
#   lint.qaHeapRelease310・lint.sectionLookup313
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS docs.satH316 docs.paperSymbols316 lint.perfTargets316 lint.scopeStop lint.regenScope lint.regenChain lint.scopeAll312 docs.satK1_315 docs.symbols315 p2sens.papersync lint.perfAbJit lint.stableHashPaths lint.canon304 lint.qaHeapRelease310 lint.sectionLookup313"
# ==== 第316便d の塊(ここまで)====
# ==== 第317便a の塊(ここから)====
# 第317便a(原仮定者の裁定(第119報)・AN431・R250): 枝 a の新設 2 本(docs.satMeas317a —— 衛星 6 本の測る量と予算の正本と文書・behavior.satMeas317a —— 測る量の lib の純関数〔片側ヤコビの
#   特異値・差の回帰の恒等式・会合周期・判定の格子〕)と、第316便d の正本を読む docs.satH316・正本の段の lint.regenScope・lint.stableHashPaths・lint.regenChain・CANON の lint.canon304・
#   lint.qaHeapRelease310・lint.sectionLookup313
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS docs.satMeas317a behavior.satMeas317a docs.satH316 lint.regenScope lint.stableHashPaths lint.regenChain lint.canon304 lint.qaHeapRelease310 lint.sectionLookup313"
# ==== 第317便a の塊(ここまで)====
WAVE_IDS="${POST_MERGE_WAVE_IDS-$DEFAULT_WAVE_IDS}"
# ==== 第309便d の塊(ここから)====
# 第309便d(AN361・R221 —— 細目): 枝 d の新設 2 本(preset.fitRole309 —— 退役の 🌥️ の標的の役割の記録・docs.w309d —— 文書と post-merge の一式)と、
#   世代切替を受けた preset.fitRole307(役割の無い本が無い世代の DOM の確かめ)・preset.fitCond297(派生本の照合を pin308d の写しで)・規則を変えた lint.qaEvidenceStamp308
#   (POST_MERGE_WAVE_IDS で一覧を差し替えたときは足さない —— 他の枝の塊と同じ扱い)
[ -n "${POST_MERGE_WAVE_IDS+x}" ] || WAVE_IDS="$WAVE_IDS preset.fitRole309 docs.w309d preset.fitRole307 preset.fitCond297 lint.qaEvidenceStamp308"
# PHYSICS の全文(節から「## 7.」まで —— 新しい節が置かれる範囲)を否定の照合で読む QA の一式(第308便の教訓: 新しい節の速さの数が古い単位の照合に当たり、ゲートまで見つからなかった)。
#   統合の直後の ③′ で毎便走らせる(POST_MERGE_WAVE_IDS で一覧を差し替えても足す —— 外すときは POST_MERGE_PHYS_SCAN_IDS="" を明示)。
#   一覧は第309便d の走査(qa.mjs の否定の語の見本を PHYSICS の「## 7.」の直前に足した写しで、FAIL に変わったブロック)で見付けた範囲 —— PHYSICS〔第309便d〕⑤ の表と同じ
PHYS_SCAN_IDS="behavior.calauditStages docs.heavyCal docs.mercuryUnits docs.terminologyOpticalCamouflage preset.retired290b docs.ref3d299 docs.refit298 docs.synodic299 preset.spaceMeshRetired300"
WAVE_IDS="$WAVE_IDS ${POST_MERGE_PHYS_SCAN_IDS-$PHYS_SCAN_IDS}"
# ==== 第309便d の塊(ここまで)====
# ==== 第310便c の塊(ここから)====
# 第310便c(原仮定者の裁定(第107報・第108報・第109報)・R224 —— 文書と運用の直し): 枝 c の新設 2 本(docs.w310c —— 第107報の注記・AN365/AN372 の文言・凍結の参照の 3 か所・
#   再生成の順・lint.qaHeapRelease310 —— headless の写しを作るブロックの包み)と、節の末尾に注記を足した〔第301便a〕〔第309便a〕〔第309便b〕〔第309便c〕を読む
#   behavior.dragNorm301・docs.invSq309・docs.maintain309・docs.recheck309、表の版と自己試験 (s) の lint.regenChain、凍結の参照の lint.frozenBaseline・lint.perfAbJit、
#   ブロックの包みで最上位の文の形を見る lint.qaOrder(POST_MERGE_WAVE_IDS で一覧を差し替えたときは足さない —— 他の枝の塊と同じ扱い)
[ -n "${POST_MERGE_WAVE_IDS+x}" ] || WAVE_IDS="$WAVE_IDS docs.w310c lint.qaHeapRelease310 behavior.dragNorm301 docs.invSq309 docs.maintain309 docs.recheck309 lint.regenChain lint.frozenBaseline lint.perfAbJit lint.qaOrder"
# ==== 第310便c の塊(ここまで)====
# ==== 第311便c の塊(ここから)====
# 第311便c(統括の検証項目 R228・決断事項 AN393 —— 鎖の道具と器の型): 枝 c の新設 3 本(lint.readyQueue311 —— 予約つきの ready queue・見積りの上書き・
#   workers all の見直し・lint.h4Carry311 —— h/4 の転記の型と振り分けの一覧・docs.w311c —— 文書)と、表の版と自己試験 (g) の lint.regenChain・
#   samplestatus の原稿の qaTargets を読む docs.sampleStatus-sync・転記を当てた器の正本を読む docs.chainBurst301・docs.shell304b
#   (POST_MERGE_WAVE_IDS で一覧を差し替えたときは足さない —— 他の枝の塊と同じ扱い)
[ -n "${POST_MERGE_WAVE_IDS+x}" ] || WAVE_IDS="$WAVE_IDS lint.readyQueue311 lint.h4Carry311 docs.w311c lint.regenChain docs.sampleStatus-sync docs.chainBurst301 docs.shell304b"
# ==== 第311便c の塊(ここまで)====
# ==== 第312便c の塊(ここから)====
# 第312便c(統括の検証項目 R232・決断事項 AN400・AN394 —— 鎖の道具): 枝 c の新設 3 本(lint.regenTools312 —— --calibrate の再起動の型の直しと値の差の記録の道具・
#   lint.scopeAll312 —— REGEN_SCOPE の presets:"all" の段の理由の一覧・docs.w312c —— 文書)と、h/4 の既定(全部測る)と影の記録を見る lint.h4Carry311・
#   影の記録の除外の鍵を見る lint.stableHashPaths・転記を当てた 4 器の正本を読む docs.chainBurst301・docs.inertialR2_303・docs.shell304b・docs.an336_306
#   (POST_MERGE_WAVE_IDS で一覧を差し替えたときは足さない —— 他の枝の塊と同じ扱い)
[ -n "${POST_MERGE_WAVE_IDS+x}" ] || WAVE_IDS="$WAVE_IDS lint.regenTools312 lint.scopeAll312 docs.w312c lint.h4Carry311 lint.stableHashPaths docs.chainBurst301 docs.inertialR2_303 docs.shell304b docs.an336_306"
# ==== 第312便c の塊(ここまで)====
# ==== 第313便c の塊(ここから)====
# 第313便c(統括の検証項目 R236 —— 鎖の道具): 枝 c の新設 4 本(lint.valdiffDecl313 —— 値の差の除外の宣言と差の分類・lint.readyQueue313 —— 予約の前の
#   backfill の余裕 α・lint.sectionLookup313 —— PHYSICS の節の探し方・docs.w313c —— 文書)と、規則と道具の版を世代で読む lint.readyQueue311・lint.regenTools312、
#   ② の scope-all の一覧を見る lint.scopeAll312(POST_MERGE_WAVE_IDS で一覧を差し替えたときは足さない —— 他の枝の塊と同じ扱い)
[ -n "${POST_MERGE_WAVE_IDS+x}" ] || WAVE_IDS="$WAVE_IDS lint.valdiffDecl313 lint.readyQueue313 lint.sectionLookup313 docs.w313c lint.readyQueue311 lint.regenTools312 lint.scopeAll312"
# ==== 第313便c の塊(ここまで)====
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
# ==== 第313便c の塊(ここから)====
# 第313便c(統括の検証項目 R236): ② に REGEN_SCOPE の presets:"all" の段の理由の一覧(tests/data-w312c-scopeall.json —— 生成物)と今の器の照合を足した。
#   統合で器・段が増えると一覧が古くなる(第312便の統合の後に 2 段)—— 落ちたら「統合で段が増えた —— node tools/regen-chain.mjs --scope-all --write で引き直す」
node tools/regen-chain.mjs --scope-all --check >"$LOG/2-scopeall.log" 2>&1; rsa=$?
if [ $rsa -eq 0 ]; then S2="$S2・scope-all ok"
else
  S2="$S2・scope-all FAIL(統合で段が増えた —— node tools/regen-chain.mjs --scope-all --write で引き直す)"; fail=1
  say "② scope-all: 一覧と今の器が違う —— 統合で段が増えた。node tools/regen-chain.mjs --scope-all --write で引き直して、一覧の差を確かめてからコミットする"
fi
# ==== 第313便c の塊(ここまで)====

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

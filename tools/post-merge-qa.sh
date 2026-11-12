#!/usr/bin/env bash
# 第287便f(原仮定者の裁定(第77報)AN70・統括の検証項目 R112): **統合直後の部分 QA**(常設集合)を 1 本で回す。
#
# 統合(worktree の取り込み)の直後、フル QA・再生成の鎖の前に、壊れやすい所を短く一周する。**フル QA の代わりではない**
# (CI が最終裁定者 —— 手元のゲートは CI の代わりにしない)。順序(先に落ちるものを先に):
#   ⓪ 規約の速い判定 tools/conventions-check.mjs(第323便a・原仮定者の指示(2026-11-01)「今後は、すぐに確認可能な規約を先に判定する」・R275 ——
#                c₀ の規約・段の分類・全内蔵の受理・X_k = G_0/c_0² の情報を beta と root〔--no-root で beta だけ〕で数秒)。**NG なら ① 以降を走らせずに終了コード 1**
#                (samplestatus の冪等 --samplestatus は鎖の起動の前に統括が回す —— 統合の直後は生成領域の作り直しが鎖の段にあるので、ここでは見ない)
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
# 最後に 1 行で出す: `post-merge-qa: ⓪ … ① … ② … ③ … ③′ … ④ beta p/n・root p/n(SKIP s)⑤ … 所要 N s → OK|FAIL`。
#
# 使い方:
#   tools/post-merge-qa.sh [--base beta/_wNNN_base.html] [--failed "id id …"] [--no-root] [--no-preflight] [--wave N] [--all-waves]
#   第324便c(R281): ③′ の既定は**便の塊だけ**(--wave N か CHANGELOG の最新の便 —— 過去の便の新設を積まない・--all-waves で積み上げ)・
#             ③〜④ は qapart の `# qapart-summary` の行で PASS・FAIL・SKIP・未実行の 4 つの数(未実行の鍵の名)・④ の後に部分 QA で覆えない鍵の数
#   環境変数: PLAYWRIGHT_CORE_DIR(既定: /opt/node22/lib/node_modules/playwright があればそれ)・POST_MERGE_LOG(ログの置き場 ——
#             既定 ${TMPDIR:-/tmp}/post-merge-qa-<時刻>)・POST_MERGE_IDS(常設集合を差し替える —— 既定は下の 9 本)・
#             POST_MERGE_WAVE_IDS(③′ の本便の新設ブロック —— 既定は下の 11 本・空文字で飛ばす)
#             POST_MERGE_PHYS_SCAN_IDS(③′ に必ず足す PHYSICS の全文を否定の照合で読む QA の一式 —— 第309便d・既定は下の PHYS_SCAN_IDS・空文字で外す)
# 終了コード: 0 = ⓪〜④ がすべて通った / 1 = どれかが FAIL(⓪ が NG ならそこで止まる・⑤ は情報 —— 器が落ちたときだけ FAIL)/ 2 = 使い方の誤り
# **書くもの**: ログだけ(tests/out/qa-preflight-beta.json は preflight の既定の保存物 —— .gitignore の対象)。正本・html は書かない。
set -u
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT" || exit 2
# 第318便(統括の統合 —— ③′ の一覧が伸びて qapart が既定の heap で落ちた〔363/750 本で heap out of memory〕): qapart の heap の既定を 8192 MiB に(外から NODE_OPTIONS を渡せばそれを使う)
# 第319便(統括の統合 —— 上の既定は外の NODE_OPTIONS〔例 --use-openssl-ca〕が空でないと効かず、③′ の 381/803 本で heap out of memory〔2 GB〕):
#   外の NODE_OPTIONS に heap の宣言が無ければ 8192 MiB を足す(宣言があればそれを使う)
case " ${NODE_OPTIONS:-} " in *--max-old-space-size=*) ;; *) export NODE_OPTIONS="${NODE_OPTIONS:+$NODE_OPTIONS }--max-old-space-size=8192" ;; esac
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
# ==== 第317便b の塊(ここから)====
# 第317便b(原仮定者の決断事項 AN431・R251): 枝 b の新設 2 本(docs.satN317b —— 衛星の物理の軸の正本〔G_loc の n = 2・1・0 × 核 K1-rule・K1-Y(n)・K2 —— 測る量 M0・
#   二体 → 三体〕と文書・behavior.satN317b —— 変種の本の作り手と判定の純関数)と、第316便d の正本を読む docs.satH316・正本の段の lint.regenScope・lint.stableHashPaths・
#   lint.regenChain・lint.scopeAll312・CANON の lint.canon304・lint.qaHeapRelease310・lint.sectionLookup313
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS docs.satN317b behavior.satN317b docs.satH316 lint.regenScope lint.stableHashPaths lint.regenChain lint.scopeAll312 lint.canon304 lint.qaHeapRelease310 lint.sectionLookup313"
# ==== 第317便b の塊(ここまで)====
# ==== 第317便c の塊(ここから)====
# 第317便c(原仮定者の裁定(第119報)・同 補足 1・AN435・AN431・R252): 枝 c の新設 2 本(behavior.satCut317c —— 衛星の三体の切る変種の本〔受理・軸の分解の値・軸の経路・pairs と分母・
#   母惑星中心の写し〕・docs.satCut317c —— 切る変種の正本と文書)と、第316便d の正本を読む docs.satH316・正本の段の lint.stableHashPaths・CANON の lint.canon304・lint.regenScope・
#   lint.qaHeapRelease310・lint.sectionLookup313
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.satCut317c docs.satCut317c docs.satH316 lint.regenScope lint.stableHashPaths lint.canon304 lint.qaHeapRelease310 lint.sectionLookup313"
# ==== 第317便c の塊(ここまで)====
# ==== 第317便d の塊(ここから)====
# 第317便d(原仮定者の裁定(第119報)・AN431・AN432・R253): 枝 d の新設 2 本(docs.satAn317d —— 二体の解析の一次の率の表とトリトンの離心率ベクトルの表の量の正本と文書・
#   docs.paper3Key317d —— 論文 3 の保存の鍵の文)と、論文の記号を読む docs.paperSymbols316・入力の正本を読む docs.satH316・docs.satK1_315・正本の段の lint.stableHashPaths・
#   CANON の lint.canon304・lint.regenScope・lint.regenChain・lint.sectionLookup313
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS docs.satAn317d docs.paper3Key317d docs.paperSymbols316 docs.satH316 docs.satK1_315 lint.stableHashPaths lint.canon304 lint.regenScope lint.regenChain lint.sectionLookup313"
# ==== 第317便d の塊(ここまで)====
# ==== 第318便a の塊(ここから)====
# 第318便a(原仮定者の裁定(第120報)・AN427・AN383・AN429・AN430・AN433・R254): 枝 a の新設 7 本(lint.textRegistry318 —— 受理器の理由の文の表と文の登録簿・lint.toolStamp318 —— 刻印の道具の照合・
#   ui.symDisp318 —— 観測結果カードと監査ビューの下付き・lint.axialSymbol318 —— 軸の係数の表示 A_k・lint.docNames318 —— 版なしの文書名・docs.scopeProbe318 —— 鎖の費用の対照・docs.w318a —— 文書)と、
#   世代切替を受けた lint.scopeStop・lint.regenScope・lint.provenanceMeta・lint.canon303・lint.canon304・lint.presetText316c(同じブロックの lint.miscText316c)・lint.uiText316・lint.kappaSymbol315・
#   docs.symbols315(器の版 w315a-symbols-2)と、版なしの名の文書を読む docs.*・lint.betaBuild300・lint.regenChain・正本の段の lint.stableHashPaths・lint.qaHeapRelease310・lint.sectionLookup313
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.textRegistry318 lint.toolStamp318 ui.symDisp318 lint.axialSymbol318 lint.docNames318 docs.scopeProbe318 docs.w318a lint.scopeStop lint.regenScope lint.provenanceMeta lint.canon303 lint.canon304 lint.presetText316c lint.uiText316 lint.kappaSymbol315 docs.symbols315 docs.bhDesignSync docs.families docs.fourValuesHistory docs.intake8 docs.issuesD68Explain docs.issuesSync docs.kf0Ledger docs.mappingRowsDeclared docs.noRetiredMention293 docs.noRetiredMention294 docs.retired docs.sampleStatus-sync docs.tallySource docs.tallySync docs.terminologyOpticalCamouflage docs.w310c lint.betaBuild300 lint.regenChain lint.stableHashPaths lint.qaHeapRelease310 lint.sectionLookup313"
# ==== 第318便a の塊(ここまで)====
# ==== 第318便b の塊(ここから)====
# 第318便b(原仮定者の指示(第120報)・AN436・AN437・AN439・AN440・AN442・R255): 枝 b の新設 2 本(behavior.satNext318b —— q11 の宣言の形の写し・V1a の pair の mask と分母・V3 の写し・
#   判定と回帰の純関数・短い走行・docs.satNext318b —— 衛星の次の正本と文書・第317便の記録の訂正)と、第317便c の正本を読む docs.satCut317c・正本の段の lint.stableHashPaths・
#   CANON の lint.canon304・lint.regenScope・lint.regenChain・lint.scopeStop・lint.qaHeapRelease310・lint.sectionLookup313
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.satNext318b docs.satNext318b docs.satCut317c lint.stableHashPaths lint.canon304 lint.regenScope lint.regenChain lint.scopeStop lint.qaHeapRelease310 lint.sectionLookup313"
# ==== 第318便b の塊(ここまで)====
# ==== 第318便c の塊(ここから)====
# 第318便c(原仮定者の指示(第120報)・R256): 枝 c の新設 2 本(behavior.solar16Builtin318c —— 太陽系 16 体の内蔵の本の宣言と走り・docs.solar16Builtin318c —— 正本と文書)と、
#   世代切替を受けた docs.solar16Contract300(予約 id が内蔵に 1 本)・lint.presetText316b(並びの照合から新本を除く)・docs.sampleStatus-sync(root で beta だけの本を除く)・正本の段の lint.regenScope・lint.stableHashPaths・
#   lint.regenChain・CANON の lint.canon304・lint.qaHeapRelease310・lint.sectionLookup313・lint.scopeStop、QA_FAST で見付けた世代切替(ui.fidelity・ui.notclaim-real・lint.cLightTrue・behavior.geoMode・
#   preset.timeStd297・docs.timeStd297・後に入った本として外す behavior.wbgDirect302・preset.gLocPlanets302・docs.semic302・preset.revertGLoc303・behavior.invSq309・behavior.galaxial311)と lint.kappaSymbol315
#   (内蔵の本の数の式 W318C_S16 の behavior.shellSpinMassLaw・coreV2Migrate・coreV2ReplaceReport は上流の局所の定数 W284_CORE を読むので部分 QA で走らない —— フル QA で見る)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.solar16Builtin318c docs.solar16Builtin318c docs.solar16Contract300 lint.presetText316b docs.sampleStatus-sync docs.preset-table-sync preset.multiParticleContract behavior.inertialDragGate theory.refs-all preset.massPrecision preset.softeningFloor lint.regenScope lint.stableHashPaths lint.regenChain lint.canon304 lint.qaHeapRelease310 lint.sectionLookup313 lint.scopeStop ui.fidelity ui.notclaim-real lint.cLightTrue behavior.geoMode preset.timeStd297 docs.timeStd297 behavior.wbgDirect302 preset.gLocPlanets302 docs.semic302 preset.revertGLoc303 behavior.invSq309 behavior.galaxial311 lint.kappaSymbol315"
# ==== 第318便c の塊(ここまで)====
# ==== 第318便d の塊(ここから)====
# 第318便d(原仮定者の指示(第120報)・AN438・R257): 枝 d の新設 2 本(docs.dragEst318d —— 銀河と太陽の引きずりの見積りの正本と文書・behavior.dragEst318d —— 読み口と解析の式・
#   節点の和の写し・maintain の帳簿の式の照合)と、正本の段の lint.stableHashPaths・lint.regenScope・lint.regenChain・lint.scopeStop・CANON の lint.canon304・lint.qaHeapRelease310・
#   lint.sectionLookup313
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS docs.dragEst318d behavior.dragEst318d lint.stableHashPaths lint.regenScope lint.regenChain lint.scopeStop lint.canon304 lint.qaHeapRelease310 lint.sectionLookup313"
# ==== 第318便d の塊(ここまで)====
# ==== 第319便a の塊(ここから)====
# 第319便a(原仮定者の指示(第121報)・AN447・AN468・AN469・R258): 枝 a の新設 2 本(behavior.axisHoldBalance319 —— 維持の型の源ごとの維持と釣り合いの口座の受理・同一・純関数の場面・
#   状態の契約・docs.axisHeat319 —— 正本と文書・PHYSICS〔第318便d〕の訂正の段落)と、維持の型の既存の 2 本(behavior.maintain309・docs.maintain309)・帳簿の欄(behavior.holdLedger310・
#   docs.pairHeat310)・維持の型の段の正本を読む docs.dragEst318d・正本の段の lint.stableHashPaths・lint.regenScope・lint.regenChain・lint.scopeStop・lint.scopeAll312・lint.canon304・
#   lint.qaHeapRelease310・lint.sectionLookup313・lint.provenanceMeta・lint.presetText316c(受理器の理由の文の表)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.axisHoldBalance319 docs.axisHeat319 behavior.maintain309 docs.maintain309 docs.dragEst318d behavior.dragEst318d lint.stableHashPaths lint.regenScope lint.regenChain lint.scopeStop lint.scopeAll312 lint.canon304 lint.qaHeapRelease310 lint.sectionLookup313 lint.provenanceMeta lint.presetText316c"
# ==== 第319便a の塊(ここまで)====
# ==== 第319便b の塊(ここから)====
# 第319便b(原仮定者の指示(第121報)・AN445・AN446・AN449・R259): 枝 b の新設 1 本(docs.srcRadius319 —— 引きずる側の半径 R_src の 3 案・分布した銀河の太陽系近傍・天体別の役割の表の
#   正本と文書・純関数の作り直し)と、正本の段の lint.stableHashPaths・lint.regenScope・lint.regenChain・lint.scopeStop・lint.scopeAll312・lint.provenanceMeta・CANON の lint.canon304・
#   lint.qaHeapRelease310・lint.sectionLookup313
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS docs.srcRadius319 lint.stableHashPaths lint.regenScope lint.regenChain lint.scopeStop lint.scopeAll312 lint.provenanceMeta lint.canon304 lint.qaHeapRelease310 lint.sectionLookup313"
# ==== 第319便b の塊(ここまで)====
# ==== 第319便c の塊(ここから)====
# 第319便c(原仮定者の指示(第121報)・決断事項 AN454・統括の検証項目 R260): 枝 c の新設 1 本(docs.regenShort319c —— 再生成の段の短縮の記録と文書)と、履歴へ移した段の
#   docs.satMeas317a・docs.satN317b(履歴の世代の照合)・器の宣言と正本の刻印の lint.regenScope・lint.regenChain・lint.scopeAll312・lint.scopeStop・lint.stableHashPaths・
#   lint.provenanceMeta・lint.canon304
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS docs.regenShort319c docs.satMeas317a docs.satN317b lint.regenScope lint.regenChain lint.scopeAll312 lint.scopeStop lint.stableHashPaths lint.provenanceMeta lint.canon304"
# ==== 第319便c の塊(ここまで)====
# ==== 第319便d の塊(ここから)====
# 第319便d(決断事項 AN460・AN461・AN462・AN455・R261): 枝 d の新設 2 本(lint.laterBooks319 —— 後に入った本の除外の理由の表・docs.w319d —— 三次元の本の数と較正の注と
#   帰属と受理の理由の文の領域の見積り)と、書き換えた QA(三次元の本を受理した宣言で数える 10 ブロック・較正の注の 2 ブロック・docs.sampleStatus-sync の原稿の世代)・lint.regenScope
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.laterBooks319 docs.w319d behavior.rayLensExcluded behavior.contactMode docs.coreCensus behavior.coreV2Migrate behavior.coreV2ReplaceReport behavior.shellSpinMassLaw behavior.geoMode docs.timeStd297 behavior.coord3dHaltAB299 docs.timeStd3d299 ui.notclaim-real ui.v59Text301 docs.sampleStatus-sync lint.regenScope"
# ==== 第319便d の塊(ここまで)====
# ==== 第320便a の塊(ここから)====
# 第320便a(原仮定者の回答(2026-10-30 —— AN475)・原仮定者の裁定(第122報)AN471・決断事項 AN471・AN474・AN475・R262): 枝 a の新設 2 本(behavior.srcHeat320 —— 読み (b) と源のモーメントの半径の
#   受理・同一・純関数の場面・状態の契約・チェックポイント・docs.srcHeat320 —— 正本と文書)と、版の世代で分けた第319便a の 2 本(behavior.axisHoldBalance319・docs.axisHeat319)・維持の型の既存の
#   本(behavior.maintain309・docs.maintain309・behavior.holdLedger310・docs.pairHeat310)・維持の型の純関数を読む docs.dragEst318d・behavior.dragEst318d・docs.srcRadius319・正本の段の lint 一式・
#   受理器の理由の文の表 lint.presetText316c
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.srcHeat320 docs.srcHeat320 behavior.axisHoldBalance319 docs.axisHeat319 behavior.maintain309 docs.maintain309 behavior.holdLedger310 docs.pairHeat310 docs.dragEst318d behavior.dragEst318d docs.srcRadius319 lint.stableHashPaths lint.regenScope lint.regenChain lint.scopeStop lint.scopeAll312 lint.canon304 lint.qaHeapRelease310 lint.sectionLookup313 lint.provenanceMeta lint.presetText316c lint.harnessSmoke303"
# ==== 第320便a の塊(ここまで)====
# ==== 第320便b の塊(ここから)====
# 第320便b(原仮定者の裁定(第122報)・決断事項 AN471・R263): 枝 b の新設 1 本(docs.jExplore320b —— 源の角運動量 J の確かめ・案2b の混成の導き直し・候補を並べて数える 6 天体の表の
#   正本と文書・純関数の作り直し)と、正本の段の lint.stableHashPaths・lint.regenScope・lint.regenChain・lint.scopeStop・lint.scopeAll312・lint.provenanceMeta・CANON の lint.canon304・
#   lint.qaHeapRelease310・lint.sectionLookup313・lint.harnessSmoke303
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS docs.jExplore320b lint.stableHashPaths lint.regenScope lint.regenChain lint.scopeStop lint.scopeAll312 lint.provenanceMeta lint.canon304 lint.qaHeapRelease310 lint.sectionLookup313 lint.harnessSmoke303"
# ==== 第320便b の塊(ここまで)====
# ==== 第320便c の塊(ここから)====
# 第320便c(原仮定者の指示(第122報)・AN472・AN473・R264): 枝 c の新設 1 本(docs.nbCompose320c —— 太陽系近傍の銀河の軸の源の合成の正本と文書・純関数の作り直し)と、
#   正本の段の lint.stableHashPaths・lint.regenScope・lint.regenChain・lint.scopeStop・lint.scopeAll312・lint.provenanceMeta・CANON の lint.canon304・lint.qaHeapRelease310・
#   lint.sectionLookup313・新しい記号のコードの書式の lint.kappaSymbol315・煙試験の窓の表の lint.harnessSmoke303
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS docs.nbCompose320c lint.stableHashPaths lint.regenScope lint.regenChain lint.scopeStop lint.scopeAll312 lint.provenanceMeta lint.canon304 lint.qaHeapRelease310 lint.sectionLookup313 lint.kappaSymbol315 lint.harnessSmoke303"
# ==== 第320便c の塊(ここまで)====
# ==== 第320便d の塊(ここから)====
# 第320便d(決断事項 AN478・AN481・AN477・AN455・R265): 枝 d の新設 3 本(lint.violationKinds320 —— lint の違反の種類と刻印の型以外を先に・lint.byproducts320 —— 段の副産物の md を段の書きに・
#   docs.w320d —— 名簿と分類・変異試験・SAMPLE_STATUS の来歴・文書)と、detail を書き換えた lint 5 本(lint.provenanceMeta・lint.regenScope・lint.stableHashPaths・lint.scopeAll312・lint.canon304)・
#   表を世代で読む lint.laterBooks319・器を直した段の正本を読む docs.invSq309・docs.invSq310・behavior.invSq309・docs.semic302・docs.sampleStatus-sync・再生成表の lint.regenChain
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.violationKinds320 lint.byproducts320 docs.w320d lint.provenanceMeta lint.regenScope lint.stableHashPaths lint.scopeAll312 lint.canon304 lint.laterBooks319 docs.invSq309 docs.invSq310 behavior.invSq309 docs.semic302 docs.sampleStatus-sync lint.regenChain"
# ==== 第320便d の塊(ここまで)====
# ==== 第321便a の塊(ここから)====
# 第321便a(原仮定者の予定(第123報)・R266): 枝 a の新設 2 本(behavior.geo2v3321a —— geoPN=2 の 3D の S1 の純関数の面への退化・回転共変・解析の場・初回の履歴・口座・今の門・
#   docs.geo2v3321a —— 正本と文書)と、正本の段の lint.stableHashPaths・lint.regenScope・lint.regenChain・lint.scopeStop・lint.scopeAll312・lint.provenanceMeta・CANON の lint.canon304・
#   lint.qaHeapRelease310・lint.sectionLookup313・煙試験の窓の表の lint.harnessSmoke303
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.geo2v3321a docs.geo2v3321a lint.stableHashPaths lint.regenScope lint.regenChain lint.scopeStop lint.scopeAll312 lint.provenanceMeta lint.canon304 lint.qaHeapRelease310 lint.sectionLookup313 lint.harnessSmoke303"
# ==== 第321便a の塊(ここまで)====
# ==== 第321便b の塊(ここから)====
# 第321便b(原仮定者の予定(第123報)「geoPN=3の予定: 連星サンプル群のgeoPN=3版を用意する」・R267): 枝 b の新設 1 本(docs.geo3Bin321b —— 在位の連星の一覧〔その場の宣言と照合〕・
#   同じ入力の geo1 参照 ↔ geo3 慣性版の兄弟の写しの量ごとの表・J の列の宣言の可否・NS の観測の自転の経路の材料・器と QA の名指しの除外〔その場の本文と照合〕の正本と文書)と、
#   正本の段の lint.stableHashPaths・lint.regenScope・lint.regenChain・lint.scopeStop・lint.scopeAll312・lint.provenanceMeta・CANON の lint.canon304・lint.qaHeapRelease310・
#   lint.sectionLookup313・煙試験の窓の表の lint.harnessSmoke303・後に入った本の除外の表の lint.laterBooks319
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS docs.geo3Bin321b lint.stableHashPaths lint.regenScope lint.regenChain lint.scopeStop lint.scopeAll312 lint.provenanceMeta lint.canon304 lint.qaHeapRelease310 lint.sectionLookup313 lint.harnessSmoke303 lint.laterBooks319"
# ==== 第321便b の塊(ここまで)====
# ==== 第321便c の塊(ここから)====
# 第321便c(原仮定者の予定(第123報)・原仮定者の回答(2026-10-31 —— AN489)・AN486・AN487・AN488・AN496・R268): 枝 c の新設 1 本(docs.galField321c —— geoPN=4 の一新の S1 の正本と文書・
#   場の純関数の作り直し)と、第320便c の lib を import する docs.nbCompose320c・第320便a の器を import する docs.srcHeat320・正本の段の lint.stableHashPaths・lint.regenScope・lint.regenChain・
#   lint.scopeStop・lint.scopeAll312・lint.provenanceMeta・CANON の lint.canon304・lint.qaHeapRelease310・lint.sectionLookup313・新しい記号のコードの書式の lint.kappaSymbol315・
#   煙試験の窓の表の lint.harnessSmoke303
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS docs.galField321c docs.nbCompose320c docs.srcHeat320 lint.stableHashPaths lint.regenScope lint.regenChain lint.scopeStop lint.scopeAll312 lint.provenanceMeta lint.canon304 lint.qaHeapRelease310 lint.sectionLookup313 lint.kappaSymbol315 lint.harnessSmoke303"
# ==== 第321便c の塊(ここまで)====
# ==== 第321便d の塊(ここから)====
# 第321便d(決断事項 AN502・AN493・R269): 枝 d の新設 2 本(behavior.srcMomentIdx321 —— sourceMoment.f の添字の守り〔受理の拒否の型〕・docs.w321d —— ゲートの後の samplestatus の段の道具と文書)と、
#   受理器を読む behavior.srcHeat320・docs.srcHeat320・受理器の理由の文の表 lint.textRegistry318・lint.presetText316c・PHYSICS の節の lint.sectionLookup313・lint.qaHeapRelease310
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.srcMomentIdx321 docs.w321d behavior.srcHeat320 docs.srcHeat320 lint.textRegistry318 lint.presetText316c lint.sectionLookup313 lint.qaHeapRelease310"
# ==== 第321便d の塊(ここまで)====
# ==== 第322便a の塊(ここから)====
# 第322便a(原仮定者の予定(第123報)・AN504・R270): 枝 a の新設 2 本(behavior.geo2flat322a —— geoPN=2 の 3D の輸送を dfmStep3 へ接続した步の面への退化・純関数との照合・初回の履歴・
#   保存と復帰・口座・門の表・平面の 3D 銀河の本・docs.geo2flat322a —— 正本と文書)と、世代切替を受けた第321便a の 2 本(behavior.geo2v3321a・docs.geo2v3321a —— 今の門を S2 の世代で読む)・
#   正本の段の lint.stableHashPaths・lint.regenScope・lint.regenChain・lint.scopeStop・lint.scopeAll312・lint.provenanceMeta・CANON の lint.canon304・lint.qaHeapRelease310・
#   lint.sectionLookup313・煙試験の窓の表の lint.harnessSmoke303(家族の表と SAMPLE_STATUS の生成領域は鎖の段 families・samplestatus が作り直す)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.geo2flat322a docs.geo2flat322a behavior.geo2v3321a docs.geo2v3321a lint.stableHashPaths lint.regenScope lint.regenChain lint.scopeStop lint.scopeAll312 lint.provenanceMeta lint.canon304 lint.qaHeapRelease310 lint.sectionLookup313 lint.harnessSmoke303"
# ==== 第322便a の塊(ここまで)====
# ==== 第322便b の塊(ここから)====
# 第322便b(原仮定者の回答 AN499・AN505・AN492・AN508・R271): 枝 b の新設 2 本(behavior.binBooks322b —— 内蔵の 4 本の受理と兄弟の写しの同一・走行のビット・表示の 1 + (4/3)η・
#   docs.binBooks322b —— 正本と文書・NS の観測の自転の欄の設計)と、後に入った本の除外を宣言の条件へ移した QA 6 本(behavior.wbgDirect302・preset.gLocPlanets302・docs.semic302・
#   preset.revertGLoc303・behavior.invSq309・behavior.galaxial311)・lint.laterBooks319(世代切替)・docs.geo3Bin321b(S2 の本の世代切替)・ui.fidelity・正本の段の lint 一式
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.binBooks322b docs.binBooks322b behavior.wbgDirect302 preset.gLocPlanets302 docs.semic302 preset.revertGLoc303 behavior.invSq309 behavior.galaxial311 lint.laterBooks319 docs.geo3Bin321b ui.fidelity lint.stableHashPaths lint.regenScope lint.regenChain lint.scopeStop lint.scopeAll312 lint.provenanceMeta lint.canon304 lint.qaHeapRelease310 lint.sectionLookup313 lint.harnessSmoke303"
# ==== 第322便b の塊(ここまで)====
# ==== 第322便c の塊(ここから)====
# 第322便c(決断事項 AN501・AN503・AN506・AN511・AN512・R272): 枝 c の新設 1 本(docs.fieldContract322c —— 外部場の輸送の力学の契約の導出と散逸のグループの集計の正本と文書・純関数の作り直し)と、
#   lib 版 2 にした第321便c の docs.galField321c(代理 J の直し —— 正本を作り直した)・正本の段の lint.stableHashPaths・lint.regenScope・lint.regenChain・lint.scopeStop・lint.scopeAll312・
#   lint.provenanceMeta・CANON の lint.canon304・lint.qaHeapRelease310・lint.sectionLookup313・lint.kappaSymbol315・煙試験の窓の表の lint.harnessSmoke303
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS docs.fieldContract322c docs.galField321c lint.stableHashPaths lint.regenScope lint.regenChain lint.scopeStop lint.scopeAll312 lint.provenanceMeta lint.canon304 lint.qaHeapRelease310 lint.sectionLookup313 lint.kappaSymbol315 lint.harnessSmoke303"
# ==== 第322便c の塊(ここまで)====
# ==== 第322便d の塊(ここから)====
# 第322便d(決断事項 AN509・R273): 枝 d の新設 1 本(docs.w322d —— nslock の本ごとの行の再利用 --merge の門と配線・煙試験の --wide の全体の枠と未実行の段の終わりの行・
#   版名 QA の鍵の抜き出し tools/qa-keys.mjs・qapart の --batch と切り出しの lib)と、器 nslock の正本を読む docs.nsLockBranch・docs.binlockAxisDef・煙試験の道具の
#   lint.harnessSmoke303・lint.harnessSmoke304・名簿の docs.w320d(器の --merge の印)・器の領域と刻印の lint.regenScope・lint.provenanceMeta・lint.stableHashPaths・lint.scopeStop・
#   この脚本の lint.postMergeQaScript・PHYSICS の節の lint.sectionLookup313・lint.qaHeapRelease310
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS docs.w322d docs.nsLockBranch docs.binlockAxisDef lint.harnessSmoke303 lint.harnessSmoke304 docs.w320d lint.regenScope lint.provenanceMeta lint.stableHashPaths lint.scopeStop lint.postMergeQaScript lint.sectionLookup313 lint.qaHeapRelease310"
# ==== 第322便d の塊(ここまで)====
# ==== 第323便a の塊(ここから)====
# 第323便a(R275): 枝 a の新設 3 本(lint.conventionsCheck323 —— 規約の速い判定の道具と qa.mjs の式の照合・post-merge の ⓪・lint.qapartRequested323 —— qapart の要求した鍵の照合・
#   SKIP の数え方・列 0 の最上位の文の切り出し・上流の宣言の閉包・docs.w323a —— 文書)と、qa-keys の自己試験と qapart の --emit を読む docs.w322d・この脚本の lint.postMergeQaScript・
#   PHYSICS の節の lint.sectionLookup313
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.conventionsCheck323 lint.qapartRequested323 docs.w323a docs.w322d lint.postMergeQaScript lint.sectionLookup313"
# ==== 第323便a の塊(ここまで)====
# ==== 第323便b の塊(ここから)====
# 第323便b(原仮定者の指示(2026-11-01)・決断事項 AN517/AN518・R276): 枝 b の新設 3 本(lint.regenQuick323 —— 簡易一致確認の影の規則・窓の指紋・来歴 meta.verify の受理・記録の形 /
#   lint.regenOrderOnly323 —— 順序だけの依存・gate の速い判定・行だけの --gate / docs.w323b —— 文書)と、受理の口を足した lint.provenanceMeta・lint.canon304・lint.regenScope・
#   計画と鎖の関数を変えた lint.regenChain・lint.regenStableHash・lint.chainAggregate・lint.readyQueue311・lint.byproducts320・煙試験の道具の lint.harnessSmoke303・lint.harnessSmoke304・
#   違反の種類の lint.violationKinds320(lint の本文の刻印の型の文)・lint.qaHeapRelease310・lint.sectionLookup313
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.regenQuick323 lint.regenOrderOnly323 docs.w323b lint.provenanceMeta lint.canon304 lint.regenScope lint.regenChain lint.regenStableHash lint.chainAggregate lint.readyQueue311 lint.byproducts320 lint.harnessSmoke303 lint.harnessSmoke304 lint.violationKinds320 lint.qaHeapRelease310 lint.sectionLookup313"
# ==== 第323便b の塊(ここまで)====
# ==== 第323便c の塊(ここから)====
# 第323便c(決断事項 AN517・AN518・AN480・R277): 枝 c の新設 2 本(lint.quickWindows323 —— 窓の無い大きい 16 段の簡易の窓・synodic-299b の子プロセス 3 本・領域の宣言の無い段の REGEN_SCOPE・
#   docs.w323c —— 文書)と、煙試験の窓の表の lint.harnessSmoke303・lint.harnessSmoke304・docs.w322d・器の宣言と刻印の lint.regenScope・lint.provenanceMeta・lint.stableHashPaths・lint.scopeStop・
#   lint.scopeAll312・lint.regenChain・CANON の lint.canon304・宣言を足した 13 段の正本を読む QA(docs.twoBodyMesh・docs.rparCanonical・docs.meshV2Rpar・docs.nsLockLedgerRow・docs.rotorLedger・
#   docs.sphereKernel・docs.bgCompose・docs.bgpredict-sync・behavior.pairSlipSign)・朔望月の正本の docs.synodic299・lint.qaHeapRelease310・lint.sectionLookup313
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.quickWindows323 docs.w323c lint.harnessSmoke303 lint.harnessSmoke304 docs.w322d lint.regenScope lint.provenanceMeta lint.stableHashPaths lint.scopeStop lint.scopeAll312 lint.regenChain lint.canon304 docs.twoBodyMesh docs.rparCanonical docs.meshV2Rpar docs.nsLockLedgerRow docs.rotorLedger docs.sphereKernel docs.bgCompose docs.bgpredict-sync behavior.pairSlipSign docs.synodic299 lint.qaHeapRelease310 lint.sectionLookup313"
# ==== 第323便c の塊(ここまで)====
# ==== 第323便d の塊(ここから)====
# 第323便d(決断事項 AN428 ①・統括の検証項目 R278): 枝 d の新設 3 本(lint.provenanceIds323 —— 較正の行の安定した id の表の被覆・正本の rowId・判定の値の記録との照合 /
#   lint.qaRecheck323 —— 部分の再検査の補足の記録と samplestatus の口 / docs.w323d —— 文書)と、器 calaudit・samplestatus の正本を読む QA(行に rowId と要約 rowIds が足された
#   世代 —— docs.calaudit-sync・docs.calibration-verdict-sync・behavior.calauditStages・lint.calauditMergeKeyHash・lint.calauditDiagSplit・docs.periodContractRows・
#   docs.sampleStatus-sync・preset.statusLedger-sync・docs.tallySync)・刻印の lint.provenanceMeta・lint.stableHashPaths・lint.regenChain・この脚本の lint.postMergeQaScript・lint.qaHeapRelease310
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.provenanceIds323 lint.qaRecheck323 docs.w323d docs.calaudit-sync docs.calibration-verdict-sync behavior.calauditStages lint.calauditMergeKeyHash lint.calauditDiagSplit docs.periodContractRows docs.sampleStatus-sync preset.statusLedger-sync docs.tallySync lint.provenanceMeta lint.stableHashPaths lint.regenChain lint.postMergeQaScript lint.qaHeapRelease310"
# ==== 第323便d の塊(ここまで)====
# ==== 第324便a の塊(ここから)====
# 第324便a(原仮定者の回答(2026-11-01 —— AN500)・決断事項 AN513・AN510・R279): 枝 a の新設 2 本(behavior.geo2thick324a —— disk の有限厚の宣言 thickness の受理・正準形・乱数の系列の分離・
#   h = 0 の旧署名・再抽選の上限・対の本 🥞🧇 の回転共変・AN510 の門・保存と復帰 / docs.geo2thick324a —— 正本と文書)と、世代切替を受けた QA(behavior.geo2flat322a ⑦ の三次元の geoPN=2 の本・
#   lint.presetText316b の並びの照合の除外・contactMode の写しの表 preset.multiParticleContract)・内蔵の数を読む QA・正本の段の lint 一式(家族の表と SAMPLE_STATUS の生成領域は鎖の段
#   families・samplestatus が作り直す)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.geo2thick324a docs.geo2thick324a behavior.geo2flat322a docs.geo2flat322a lint.presetText316b preset.multiParticleContract ui.physLock315 lint.stableHashPaths lint.regenScope lint.regenChain lint.scopeStop lint.scopeAll312 lint.provenanceMeta lint.canon304 lint.qaHeapRelease310 lint.sectionLookup313 lint.harnessSmoke303 lint.conventionsCheck323"
# ==== 第324便a の塊(ここまで)====
# ==== 第324便b の塊(ここから)====
# 第324便b(決断事項 AN514・AN515・R280): 枝 b の新設 2 本(behavior.obsSpin324b —— 天体ごとの観測の自転 obsSpin の受理・拒否の 32 の場合・📟 と 🔸 の宣言・60 步のビット・
#   源の J の読み口と状態の自転の不変・本の文の数 / docs.obsSpin324b —— 正本と文書)と、本を足した便で数え上げの変わる QA(fidelity・c₀ の一律規約・光速の真値の一覧・三次元の本の並び —— ui.fidelity・
#   light.canonical-builtins・lint.cLightTrue・preset.clocksGravity)・受理器を読む lint.presetText316c・正本の段の lint 一式(lint.stableHashPaths・lint.regenScope・lint.regenChain・lint.scopeStop・
#   lint.scopeAll312・lint.provenanceMeta・CANON の lint.canon304・lint.qaHeapRelease310・lint.sectionLookup313・煙試験の窓の表の lint.harnessSmoke303・規約の速い判定の lint.conventionsCheck323)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS behavior.obsSpin324b docs.obsSpin324b ui.fidelity light.canonical-builtins lint.cLightTrue preset.clocksGravity lint.presetText316c lint.stableHashPaths lint.regenScope lint.regenChain lint.scopeStop lint.scopeAll312 lint.provenanceMeta lint.canon304 lint.qaHeapRelease310 lint.sectionLookup313 lint.harnessSmoke303 lint.conventionsCheck323"
# ==== 第324便b の塊(ここまで)====
# ==== 第324便c の塊(ここから)====
# 第324便c(統括の検証項目 R281): 枝 c の新設 4 本(lint.quickBoundary324c —— 簡易一致の欠測の境界・照合の数・自己比較の拒否・長期の量の名簿・nslock の影の照合の記録・
#   速い判定の実効値 / lint.calVolatile324c —— calaudit の揮発の欄〔h/2 の転記の来歴・置き場の html の sha〕/ lint.postMergeCounts324c —— post-merge の ③〜④ の 4 つの数・③′ の絞り・部分 QA で覆えない鍵の名簿 /
#   docs.w324c —— 文書)と、版を世代で受けた lint.regenQuick323・宣言の版と語彙の拡張を受けた lint.stableHashPaths・鎖の脚本の lint.regenChain・lint.regenOrderOnly323・
#   この脚本の lint.postMergeQaScript・qa-keys の docs.w322d・PHYSICS の節の lint.sectionLookup313・lint.qaHeapRelease310
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.quickBoundary324c lint.calVolatile324c lint.postMergeCounts324c docs.w324c lint.regenQuick323 lint.stableHashPaths lint.regenChain lint.regenOrderOnly323 lint.postMergeQaScript docs.w322d lint.sectionLookup313 lint.qaHeapRelease310"
# ==== 第324便c の塊(ここまで)====
# ==== 第324便d の塊(ここから)====
# 第324便d(決断事項 AN480・AN452・統括の検証項目 R282): 枝 d の新設 2 本(lint.resume324d —— 再開の型の lib の自己試験・同じ process の復帰の同一と否定対照・器の口の配線・
#   段が履歴で鎖に入らない / docs.satlong324d —— 門の正本・長い窓の正本〔あれば〕・文書)と、触った器と表の lint(lint.regenScope・lint.provenanceMeta・lint.stableHashPaths・
#   lint.scopeStop・lint.scopeAll312・lint.regenChain・lint.canon304・lint.harnessSmoke303・lint.qaHeapRelease310・lint.sectionLookup313)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.resume324d docs.satlong324d lint.regenScope lint.provenanceMeta lint.stableHashPaths lint.scopeStop lint.scopeAll312 lint.regenChain lint.canon304 lint.harnessSmoke303 lint.qaHeapRelease310 lint.sectionLookup313"
# ==== 第324便d の塊(ここまで)====
# ==== 第325便a の塊(ここから)====
# 第325便a(原仮定者の指示(2026-11-03)「再生成の段の対象が宣言なしの場合、html全体にしない」・統括の検証項目 R284): 枝 a の新設 2 本(lint.htmlPhys325a —— html の物理の部分の hash の
#   定義・門の小さな写し・移行の口・html 全体の段の棚卸しの表・台帳・計画 / docs.w325a —— 文書)と、対象一致の受け入れを足した lint.provenanceMeta・docs の 7 本(docs.d0audit-sync・
#   docs.d0sites-sync・docs.bgpredict-sync・docs.selfInertia-sync・docs.bgbudget-sync・docs.bgCompose・docs.sphereKernel)・計画の関数を変えた lint.regenChain・lint.regenScope・
#   lint.regenOrderOnly323・lint.regenQuick323・lint.violationKinds320(lint の本文の刻印の型の文)・正本の段の lint 一式・lint.qaHeapRelease310・lint.sectionLookup313
#   台帳: 鎖の後に node tools/regen-plan.mjs --htmlphys-record(物理の部分の宣言のある段の正本の刻印の html と今の html の行 —— 台帳 tests/data-w325a-htmlphys.json をコミット)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.htmlPhys325a docs.w325a lint.provenanceMeta docs.d0audit-sync docs.d0sites-sync docs.bgpredict-sync docs.selfInertia-sync docs.bgbudget-sync docs.bgCompose docs.sphereKernel lint.regenChain lint.regenScope lint.regenOrderOnly323 lint.regenQuick323 lint.violationKinds320 lint.stableHashPaths lint.scopeStop lint.scopeAll312 lint.canon304 lint.qaHeapRelease310 lint.sectionLookup313"
# ==== 第325便a の塊(ここまで)====
# ==== 第325便b の塊(ここから)====
# 第325便b(原仮定者の指示(第127報)・統括の検証項目 R285): 枝 b の新設 2 本(preset.sampleWords325b —— 在位の本の表示の欄の旧 gain 語・観測質量の f=1 の残り 0・照合の鍵の行名が残る・
#   金星と木星の内部熱は未解決・較正母集団の焦点 / docs.sampleWords325b —— 文書)と、古い文を世代で直した QA(docs.calPolicyText・preset.inertialDragPair・behavior.psrF1-1757・behavior.psrF1-1946・
#   behavior.psrF1-1534・ui.liveComparePeriodDef・preset.condRowsRenamed)・生成表の docs.sampleStatus-sync・preset.statusLedger-sync・docs.families・規約の速い判定の lint.conventionsCheck323・PHYSICS の節の lint.sectionLookup313・lint.qaHeapRelease310
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS preset.sampleWords325b docs.sampleWords325b docs.calPolicyText preset.inertialDragPair behavior.psrF1-1757 behavior.psrF1-1946 behavior.psrF1-1534 ui.liveComparePeriodDef preset.condRowsRenamed docs.sampleStatus-sync preset.statusLedger-sync docs.families lint.conventionsCheck323 lint.sectionLookup313 lint.qaHeapRelease310"
# ==== 第325便b の塊(ここまで)====
# ==== 第325便c の塊(ここから)====
# 第325便c(原仮定者の指示(第127報)・統括の検証項目 R286): 枝 c の新設(docs.words325c —— 連鎖の玩具 5 本の説明の古い語・📟 の B の 139.4° の列・AN516 の数の訂正・文書)と、
#   説明を読む生成表の QA(docs.sampleStatus-sync・preset.statusLedger-sync・docs.families)・本の文を読む behavior.obsSpin324b・docs.obsSpin324b・lint.qaHeapRelease310・lint.sectionLookup313・規約の速い判定の lint.conventionsCheck323
#   AN526(📟 の A の傾きのノブ): behavior.j0737AxisKnob325c と、器と lib の版を上げた段 obsspin-324b の lint 一式(lint.stableHashPaths・lint.regenScope・lint.regenChain・lint.scopeStop・lint.scopeAll312・lint.provenanceMeta・lint.canon304・lint.harnessSmoke303)
#   AN525(旧方式の geoPN=4 の退役): docs.geo4old325c と、退役の集合と掲載の数を読む docs.noRetiredMention294・preset.spaceMeshRetired300・preset.retire298・preset.retired290b
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS docs.words325c behavior.j0737AxisKnob325c docs.geo4old325c docs.noRetiredMention294 preset.spaceMeshRetired300 preset.retire298 preset.retired290b docs.sampleStatus-sync preset.statusLedger-sync docs.families behavior.obsSpin324b docs.obsSpin324b lint.stableHashPaths lint.regenScope lint.regenChain lint.scopeStop lint.scopeAll312 lint.provenanceMeta lint.canon304 lint.harnessSmoke303 lint.qaHeapRelease310 lint.sectionLookup313 lint.conventionsCheck323"
# ==== 第325便c の塊(ここまで)====
# ==== 第325便d の塊(ここから)====
# 第325便d(統括の検証項目 R287・決断事項 AN517/AN518 —— 簡易一致の本運用の前の試験): 枝 d の新設 5 本(lint.quickMutation325d —— 短窓の後だけ効く変異の影の試験 /
#   lint.quickEnvWin325d —— args/cmd の窓 6 段の環境変数の窓 / lint.quickEnv325d —— 環境の整合・枝 a との継ぎ目・暦の債務 / lint.quickGate325d —— 本運用の門の関数〔休眠〕/
#   docs.w325d —— 文書)と、版と窓の表を世代で受けた lint.regenQuick323・lint.quickBoundary324c・lint.quickWindows323・docs.w323c・煙試験の lint.harnessSmoke303・
#   PHYSICS の節の lint.sectionLookup313・lint.qaHeapRelease310
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.quickMutation325d lint.quickEnvWin325d lint.quickEnv325d lint.quickGate325d docs.w325d lint.regenQuick323 lint.quickBoundary324c lint.quickWindows323 docs.w323c lint.harnessSmoke303 lint.sectionLookup313 lint.qaHeapRelease310"
# ==== 第325便d の塊(ここまで)====
# ==== 第325便e の塊(ここから)====
# 第325便e(原仮定者の回答(2026-11-03 —— AN528)「実在天体なら、f=1に質量を修正。実在天体で無いならそのまま採用」・統括の検証項目 R288): 枝 e の新設 1 ブロック
#   (preset.realMassF1325e —— 在位の本の質量の倍率の宣言・🛞 の恒星の円盤の倍率 1・凍結の写し tests/fixtures/realmass-w325e.json / docs.realMassF1325e —— 文書)と、
#   世代で直した QA(behavior.ngc3198 —— W5b・preset.massLedger・docs.rotorLedger・docs.analogyLedger)・🛞 を読む段の正本の QA(behavior.sparc10・behavior.galaxyStateBranch・docs.galaxyChain・
#   docs.galaxyFieldContract・behavior.chainLedger・preset.fieldContract・docs.galField321c)・器を直した段(galfield-321c・analogy)の lint 一式・説明の語の preset.sampleWords325b・behavior.claimEffort297・生成表の docs.sampleStatus-sync・
#   preset.statusLedger-sync・docs.families・規約の速い判定の lint.conventionsCheck323・PHYSICS の節の lint.sectionLookup313・lint.qaHeapRelease310
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS preset.realMassF1325e docs.realMassF1325e behavior.ngc3198 preset.massLedger docs.rotorLedger behavior.sparc10 behavior.galaxyStateBranch docs.galaxyChain docs.galaxyFieldContract behavior.chainLedger preset.fieldContract docs.analogyLedger docs.galField321c preset.sampleWords325b behavior.claimEffort297 docs.sampleStatus-sync preset.statusLedger-sync docs.families lint.stableHashPaths lint.regenScope lint.regenChain lint.scopeStop lint.scopeAll312 lint.provenanceMeta lint.canon304 lint.harnessSmoke303 lint.conventionsCheck323 lint.sectionLookup313 lint.qaHeapRelease310"
# ==== 第325便e の塊(ここまで)====
# ==== 第325便f の塊(ここから)====
# 第325便f(原仮定者の指示(2026-11-03)「「物理対応ロック Xₖ = G₀/c₀²」を常に有効にした場合の影響を調べる。…分類する」・統括の検証項目 R289): 枝 f の新設 2 本
#   (lint.xkLock325f —— 調べのデータ tests/data-w325f-xklock.json と今の html の照合〔新しい本・値の違う本は名指しで落ちる〕・在位の本の 3 分類・写像の影響の行・数 /
#   docs.xkLock325f —— 文書)と、qa.mjs の包みの lint.qaHeapRelease310・PHYSICS の節の lint.sectionLookup313(html・本の宣言・器の本文・正本は不変 —— 鎖の段は足さない)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.xkLock325f docs.xkLock325f lint.qaHeapRelease310 lint.sectionLookup313"
# ==== 第325便f の塊(ここまで)====
# ==== 第326便a の塊(ここから)====
# 第326便a(原仮定者の回答(2026-11-03 —— AN530)「ロックした方がDFMを理解し易いのでロックする。…」・決断事項 AN532(推奨 A —— 別のコミット)・統括の検証項目 R290): 枝 a の新設 3 本
#   (lint.physLockAlways326a —— 宣言の X_k が導出値・第325便f のデータとの照合〔分類 1・分類 2・満たした 56 本・退役 3 本〕・X_k のノブ 0・凍結の写し /
#   behavior.xkDerive326a —— 受理・既定値のマージ・読み込み・編集・セーブ・チェックポイント・⏮・A/B・退役の本はロックの外 / docs.xkLock326a —— 文書)と、
#   世代を直した既存の QA(lint.xkLock325f・ui.physLock315・physlock.ui-110・docs.retired・docs.noRetiredMention294 ほか —— PHYSICS〔第326便a〕の名指し)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.physLockAlways326a behavior.xkDerive326a docs.xkLock326a lint.xkLock325f ui.physLock315 physlock.ui-110 docs.retired docs.noRetiredMention294"
# ==== 第326便a の塊(ここまで)====
# ==== 第326便b の塊(ここから)====
# 第326便b(原仮定者の回答(2026-11-03 —— AN531)「gc3198DFM〔ngc3198DFM〕は、意図した挙動では無いので廃止し、将来的にgeoPN=4で作り直す。ngc3198は、対照無しのダークマターハローサンプルとする」・
#   統括の検証項目 R291): 枝 b の新設 1 ブロック(preset.ngc3198Halo326b —— 🛞 の退役・🌃 の家族の入口と説明・退役の see・原稿と生成物・凍結の写し tests/fixtures/retired-w326b.json /
#   docs.ngc3198Halo326b —— 文書 / behavior.ngc3198AbHalo326b —— 原仮定者の回答(2026-11-04 —— AN533)の 🌃 のワンタップ対照〔NFW ハローの有無〕)と、世代で直した QA(docs.retired —— 第326便b の世代と root の正本の世代・ui.pickerStatusAxes —— 未達の代表 🥏)・退役の集合と掲載の数を読む
#   docs.noRetiredMention294・lint.retiredRef302・preset.spaceMeshRetired300・preset.retire298・preset.retired290b・docs.geo4old325c・🛞 を ID で引く behavior.ngc3198(W5b —— 窓は広げない)・
#   preset.realMassF1325e・docs.realMassF1325e・生成表の docs.sampleStatus-sync・preset.statusLedger-sync・docs.families・退役の数と時間の宣言の世代を直した preset.revived292b・preset.timeStd297・
#   在位の別を直した lint.xkLock325f・機械鍵の出現数の docs.terminologyOpticalCamouflage・RETIRED_PRESETS の表で html の物理の部分の code が動く lint.htmlPhys325a・lint.provenanceMeta・規約の速い判定の lint.conventionsCheck323・
#   PHYSICS の節の lint.sectionLookup313・lint.qaHeapRelease310(root の部分 QA でも docs.retired を回す —— 正本の退役の数は root の世代の分岐で読む)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS preset.ngc3198Halo326b docs.ngc3198Halo326b behavior.ngc3198AbHalo326b docs.retired ui.pickerStatusAxes docs.noRetiredMention294 lint.retiredRef302 preset.spaceMeshRetired300 preset.retire298 preset.retired290b docs.geo4old325c behavior.ngc3198 preset.realMassF1325e docs.realMassF1325e docs.sampleStatus-sync preset.statusLedger-sync docs.families preset.revived292b preset.timeStd297 lint.xkLock325f docs.terminologyOpticalCamouflage lint.htmlPhys325a lint.provenanceMeta lint.conventionsCheck323 lint.sectionLookup313 lint.qaHeapRelease310"
# ==== 第326便b の塊(ここまで)====
# ==== 第326便c の塊(ここから)====
# 第326便c(原仮定者の指示(第128報)「「選択粒子の編集」から、「減光」と「自動」を外す。「X」と「Y」を編集対象に加える」「「パラメータ」の「時空」から、「物理対応ロック」を外す。計算済みの「κ_D」「Xₖ」「Yₖ」を表示する」・
#   原仮定者の回答(2026-11-03 —— AN530)・統括の検証項目 R292 —— UI だけ): 枝 c の新設 3 本(ui.selEditXY326c —— 選択粒子の編集の x・y と外した欄 / ui.spacetimeDerived326c —— 時空の群の計算済みの 3 行 /
#   ui.pickerProc326c —— サンプルの選択の固有の処理のチップと絞り込み〔原仮定者の指示(2026-11-04)〕/ docs.w326c —— 文書)と、世代を直した QA(ui.sweep-auto-checkbox・ui.selEdit299・physlock.kt-derive・physlock.ui-110・wave124.ui・ui.symDisp316・ui.physLock315)・群と行を読む params.roles・
#   記号の lint.kappaSymbol315・docs.symbols315・i18n.toggle・budget.consistency・ui.wave96a・規約の速い判定の lint.conventionsCheck323・PHYSICS の節の lint.sectionLookup313・lint.qaHeapRelease310
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS ui.selEditXY326c ui.spacetimeDerived326c ui.pickerProc326c docs.w326c ui.sweep-auto-checkbox ui.selEdit299 physlock.kt-derive physlock.ui-110 wave124.ui ui.symDisp316 ui.physLock315 params.roles lint.kappaSymbol315 docs.symbols315 i18n.toggle budget.consistency ui.wave96a lint.conventionsCheck323 lint.sectionLookup313 lint.qaHeapRelease310"
# ==== 第326便c の塊(ここまで)====
# ==== 第326便d の塊(ここから)====
# 第326便d(原仮定者の指示(第128報)「軸引きずりについて」「引きずり計算の補足」・統括の検証項目 R293): 枝 d の新設 3 本(lint.axialHeat326d —— 純関数の場面〔逆向きの 2 源の熱・
#   固定軸の支え・帳簿の閉じ・尺度の不定・負の Γ・凸包・厳密な 1 步〕/ behavior.axialRadius326d —— 今の html の 🗺️ の写しで R_d と R_src の独立の宣言・K1 の源ごとの軸の ω が正本と同じ /
#   docs.axialHeat326d —— 正本の門と表が PHYSICS〔第326便d〕に逐語・文書)と、新しい段 axialheat-326d の lint 一式(lint.regenScope・lint.provenanceMeta・lint.stableHashPaths・lint.scopeStop・
#   lint.scopeAll312・lint.regenChain・lint.canon304・lint.harnessSmoke303・lint.quickBoundary324c)・qa.mjs の包みの lint.qaHeapRelease310・PHYSICS の節の lint.sectionLookup313
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.axialHeat326d behavior.axialRadius326d docs.axialHeat326d lint.regenScope lint.provenanceMeta lint.stableHashPaths lint.scopeStop lint.scopeAll312 lint.regenChain lint.canon304 lint.harnessSmoke303 lint.quickBoundary324c lint.qaHeapRelease310 lint.sectionLookup313"
# ==== 第326便d の塊(ここまで)====
# ==== 第326便e の塊(ここから)====
# 第326便e(原仮定者の回答(2026-11-03 —— AN527)「推奨で進める」・統括の検証項目 R294 —— 道具だけ・html は変えない): 枝 e の新設 5 本(lint.alwaysShadow326e —— 常時群 13 段の
#   html の物理の部分の門の影と鎖の後の照合の口 / lint.familiesTemp326e —— 家族の表の走査からドット始まりの一時ファイルを外す / lint.scopeObsSpin326e —— 領域 hash の版 7 /
#   lint.narrow326e —— 全部の本を領域に持つ段の絞りの探索 / docs.w326e —— 文書)と、世代を直した既存の 5 本(docs.families・lint.quickMutation325d・lint.quickGate325d・
#   lint.regenScope・docs.regenShort319c)と、正本の入力の宣言の lint.stableHashPaths
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.alwaysShadow326e lint.familiesTemp326e lint.scopeObsSpin326e lint.narrow326e docs.w326e docs.families lint.quickMutation325d lint.quickGate325d lint.regenScope docs.regenShort319c lint.stableHashPaths"
# ==== 第326便e の塊(ここまで)====
# ==== 第327便a の塊(ここから)====
# 第327便a(原仮定者の回答(2026-11-05 —— AN534・AN535・AN537)・統括の検証項目 R295 —— 診断だけ・html は変えない): 枝 a の新設 3 本(lint.axialSum327a —— 角速度の和の族 S と族 E の純関数の場面
#   〔和と平均・細分の不変・受動の口・帳簿・尺度・配分・族 E の照合・採否・凸包・法則・根〕/ behavior.axialSum327a —— 今の html の 🗺️ の写しで族 S・族 E の解と金星の R_d の 2 点が正本と同じ /
#   docs.axialSum327a —— 正本の門と表が PHYSICS〔第327便a〕に逐語・第326便d の節の「第327便の更新」・文書)と、世代を直した lint.axialHeat326d(族 E の採否の直し —— lib 版 2・場面 14)と
#   docs.axialHeat326d・behavior.axialRadius326d(正本 axialheat-w326d を走らせ直した)・新しい段 axialsum-327a の lint 一式(lint.regenScope・lint.provenanceMeta・lint.stableHashPaths・
#   lint.scopeStop・lint.scopeAll312・lint.regenChain・lint.canon304・lint.harnessSmoke303・lint.quickBoundary324c)・qa.mjs の包みの lint.qaHeapRelease310・PHYSICS の節の lint.sectionLookup313
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.axialSum327a behavior.axialSum327a docs.axialSum327a lint.axialHeat326d docs.axialHeat326d behavior.axialRadius326d lint.regenScope lint.provenanceMeta lint.stableHashPaths lint.scopeStop lint.scopeAll312 lint.regenChain lint.canon304 lint.harnessSmoke303 lint.quickBoundary324c lint.qaHeapRelease310 lint.sectionLookup313"
# ==== 第327便a の塊(ここまで)====
# ==== 第327便b の塊(ここから)====
# 第327便b(原仮定者の回答(2026-11-05 —— AN536)・統括の検証項目 R296 —— 診断だけ): 枝 b の新設 3 本(lint.galaxis327b —— 純関数の場面〔剛体回転・平らな曲線・ケプラーの半渦度とシア・
#   鏡映の核の向き・AN536 の符号の表・場の軸の反転の拒否・要る相対の角速度・平均の列が無い・格子の符号・口が 1 つの和の式〕と呼ぶだけの検査 / behavior.galaxis327b —— 今の html と
#   場の API で二つの経路を作り直して正本と照合 / docs.galaxis327b —— 正本の門と表が PHYSICS〔第327便b〕に逐語・文書)と、新しい段 galaxis-327b の lint 一式(lint.regenScope・lint.provenanceMeta・
#   lint.stableHashPaths・lint.scopeStop・lint.scopeAll312・lint.regenChain・lint.canon304・lint.harnessSmoke303・lint.quickBoundary324c)・qa.mjs の包みの lint.qaHeapRelease310・PHYSICS の節の lint.sectionLookup313
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.galaxis327b behavior.galaxis327b docs.galaxis327b lint.regenScope lint.provenanceMeta lint.stableHashPaths lint.scopeStop lint.scopeAll312 lint.regenChain lint.canon304 lint.harnessSmoke303 lint.quickBoundary324c lint.qaHeapRelease310 lint.sectionLookup313"
# ==== 第327便b の塊(ここまで)====
# ==== 第327便c の塊(ここから)====
# 第327便c(原仮定者の指示(2026-11-01)「今後は、サンプルの変更だけでは、全行程を再実行しない様にする」・原仮定者の回答(2026-11-04 —— AN543)・統括の検証項目 R297 —— 道具だけ・
#   html は変えない): 枝 c の新設 2 本(lint.narrowScope327c —— 鎖を狭める 4 件と名指しの段の領域・版の移行・変異の写し / docs.w327c —— 文書)と、世代を直した既存の 3 本
#   (lint.scopeStop・lint.htmlPhys325a・lint.scopeObsSpin326e —— 領域 hash の版 8・html の物理の部分の版 2)と、器の宣言と正本の刻印を照合する lint.regenScope・lint.provenanceMeta・docs.families
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.narrowScope327c docs.w327c lint.scopeStop lint.htmlPhys325a lint.scopeObsSpin326e lint.regenScope lint.provenanceMeta docs.families"
# ==== 第327便c の塊(ここまで)====
# ==== 第327便d の塊(ここから)====
# 第327便d(原仮定者の回答(2026-11-05 —— AN544・AN545)・統括の検証項目 R298 —— beta/index.html を変える): 枝 d の新設 4 本(lint.xkLock327d —— 出どころの口と受理 /
#   behavior.xkClampShown327d —— 赤の行と画面の ⚠ / behavior.xkExemptScope327d —— 経路の表 / docs.xkLock327d —— 文書)と、世代を直した既存の QA(XK_LOCK_VERSION の版の型 ——
#   lint.physLockAlways326a・behavior.xkDerive326a・docs.xkLock326a の塊と第326便の統括の照合 / ai.stabilize)と、ロックと退役の数を読む一式(physlock.*・docs.retired・groups.*)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.xkLock327d behavior.xkClampShown327d behavior.xkExemptScope327d docs.xkLock327d lint.physLockAlways326a behavior.xkDerive326a docs.xkLock326a ai.stabilize physlock.kt-derive physlock.ui-110 docs.retired groups.family-invariant groups.family-split groups.reorder"
# ==== 第327便d の塊(ここまで)====
# ==== 第327便e の塊(ここから)====
# 第327便e(原仮定者の指示(2026-11-05)「軸引きずりについて」・統括の検証項目 R299 —— 診断だけ・html は変えない): 枝 e の新設 3 本(lint.axialDiff327e —— 差分の型の純関数の場面
#   〔勾配の極限・比の頭打ち・自己の場が勝つ間の比例・規則の往復・鏡映の幾何・零点と跳び・系の帳簿・入力の拒否〕/ behavior.axialDiff327e —— 今の html の 🗺️ の写しで核の点と
#   金星の零点の区間の端が正本と同じ / docs.axialDiff327e —— 正本の門と表が PHYSICS〔第327便e〕に逐語・第327便a の節の「第327便e の更新」・文書)と、第327便a の節を読む
#   docs.axialSum327a(節に行を足した)・新しい段 axialdiff-327e の lint 一式(lint.regenScope・lint.provenanceMeta・lint.stableHashPaths・lint.quickBoundary324c・lint.narrowScope327c・docs.w320d)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.axialDiff327e behavior.axialDiff327e docs.axialDiff327e docs.axialSum327a lint.regenScope lint.provenanceMeta lint.stableHashPaths lint.quickBoundary324c lint.narrowScope327c docs.w320d lint.qaHeapRelease310 lint.sectionLookup313"
# ==== 第327便e の塊(ここまで)====
# ==== 第327便f の塊(ここから)====
# 第327便f(原仮定者の指示(2026-11-05)「金星の逆行自転は、大気熱潮汐の影響と、地球との共鳴を採用する」「R_dはK1で固定し、観測の自転もトルクの釣り合いで進める」・統括の検証項目 R300 ——
#   診断だけ・html は変えない): 枝 f の新設 3 本(lint.venusTide327f —— 口の型の純関数の場面〔固体の潮汐の受動・熱潮汐の駆動と日射の供給・解析の枝・縮退の中立・共鳴の係数と 5 の比・
#   系の帳簿・振り子の分離線・入力の拒否〕/ behavior.venusTide327f —— 今の html の 🗺️ の写しで銀河と K1 の口のトルク・釣り合いの振幅・火星の正味のトルクが正本と同じ /
#   docs.venusTide327f —— 正本の門と表が PHYSICS〔第327便f〕に逐語・第327便e と第327便a の節の「第327便f の更新」・文書)と、節に行を足した docs.axialDiff327e・docs.axialSum327a・
#   新しい段 venustide-327f の lint 一式
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.venusTide327f behavior.venusTide327f docs.venusTide327f docs.axialDiff327e docs.axialSum327a lint.regenScope lint.provenanceMeta lint.stableHashPaths lint.quickBoundary324c lint.narrowScope327c docs.w320d lint.qaHeapRelease310 lint.sectionLookup313"
# ==== 第327便f の塊(ここまで)====
# ==== 第328便a の塊(ここから)====
# 第328便a(原仮定者の回答(2026-11-05 —— AN551・AN552・AN553)・統括の検証項目 R301 —— 診断と契約だけ・html は変えない): 枝 a の新設 3 本(lint.fieldContract328a —— 場の API の opt-in の契約の
#   純関数の場面〔古い呼び出しのビット同一・形・欠測は null・拒否・u を変えない・直接の滑り・双対の同じ係数・二重に数えない・縮退のランク 1・腕と物質・枠と場・収束の印・由来〕と呼ぶだけの検査 /
#   behavior.fieldContract328a —— 今の html と場の API で古い呼び出し・太陽の位置の契約・太陽の式の閉じ・対照の列〔第327便b の正本と照合〕・双対の帳簿を作り直す / docs.fieldContract328a ——
#   正本の門と表が PHYSICS〔第328便a〕に逐語・第327便b の節の「第328便の更新」・文書)と、節に行を足した docs.galaxis327b・名簿の行の docs.w320d・新しい段 fieldcontract-328a の lint 一式
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.fieldContract328a behavior.fieldContract328a docs.fieldContract328a docs.galaxis327b docs.w320d lint.regenScope lint.provenanceMeta lint.stableHashPaths lint.scopeStop lint.scopeAll312 lint.regenChain lint.canon304 lint.harnessSmoke303 lint.quickBoundary324c lint.narrowScope327c lint.qaHeapRelease310 lint.sectionLookup313"
# ==== 第328便a の塊(ここまで)====
# ==== 第328便b の塊(ここから)====
# 第328便b(原仮定者の回答(2026-11-05 —— AN559・AN561・AN562・AN563・AN550・AN566)・統括の検証項目 R302 —— 診断だけ・html は変えない): 枝 b の新設 3 本(lint.response328b —— 受け手の演算の
#   純関数の場面〔契約の形と欠測の null・球の平均・既定の列と否定対照・正の対照・一定でない例の拒否・慣性で配る型の応答の表・源の固定の列の帳簿・入力の拒否〕/ behavior.response328b ——
#   今の html の 🗺️ の写しで既定の列のエンジンの係数・金星の口のトルクと A・主の型の N_0・固定の列の A と外部の口座が正本と同じ / docs.response328b —— 正本の門と表が PHYSICS〔第328便b〕に逐語・
#   第327便a と第327便f の節の「第328便の更新」・文書)と、節に行を足した docs.axialSum327a・docs.venusTide327f・新しい段 response-328b の lint 一式
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.response328b behavior.response328b docs.response328b docs.axialSum327a docs.venusTide327f lint.regenScope lint.provenanceMeta lint.stableHashPaths lint.quickBoundary324c lint.narrowScope327c docs.w320d lint.qaHeapRelease310 lint.sectionLookup313"
# ==== 第328便b の塊(ここまで)====
# ==== 第328便c の塊(ここから)====
# 第328便c(統括の検証項目 R303・原仮定者の回答(2026-11-05 —— AN564 = A)—— 診断だけ・html は変えない): 枝 c の新設 3 本(lint.venusCoverage328c —— 第327便f の器の版 2 の件数の門と
#   件数をずらす変異 / lint.resPower328c —— 共鳴の口の仕事の契約の純関数の場面と resPort の等置・html に契約が無い / docs.w328c —— 表が PHYSICS〔第328便c〕に逐語・第327便f の節と
#   第327便の統括の節の「第328便の更新」・文書)と、器の版を上げて正本を作り直した段 venustide-327f の QA(lint.venusTide327f・behavior.venusTide327f・docs.venusTide327f —— 器の版を
#   名指ししないので世代は直していない)・節に行を足した第327便の統括の節を位置で読む docs.axialDiff327e・段の lint 一式
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.venusCoverage328c lint.resPower328c docs.w328c lint.venusTide327f behavior.venusTide327f docs.venusTide327f docs.axialDiff327e lint.regenScope lint.provenanceMeta lint.stableHashPaths lint.quickBoundary324c lint.narrowScope327c lint.qaHeapRelease310 lint.sectionLookup313"
# ==== 第328便c の塊(ここまで)====
# ==== 第329便a の塊(ここから)====
# 第329便a(原仮定者の方針(2026-11-07)・原仮定者の回答(2026-11-07 —— AN570・AN571・AN574・AN575)・統括の検証項目 R304 —— 診断だけ・html は変えない): 枝 a の新設 3 本(lint.spinBias329a ——
#   偏りの口と比べる表の純関数の場面〔保存の口・契約の閉じ・平衡の位相と勾配・分離線と要る振幅・水星の 1 回対称の項・由来ごとの熱と結合の口・位相の模型の h と h/2・入力の拒否〕と呼ぶだけの検査 /
#   behavior.spinBias329a —— 今の html の 🗺️ の写しで入力・受動の口のトルク・受理器の s_d の読み口と守り・偏りの列の要る振幅が正本と同じ / docs.spinBias329a —— 正本の門と表が
#   PHYSICS〔第329便a〕に逐語・第327便f の節の「第329便の更新」・文書)と、節に行を足した第327便f の節を読む docs.venusTide327f・docs.w328c・docs.response328b・新しい段 spinbias-329a の lint 一式
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.spinBias329a behavior.spinBias329a docs.spinBias329a docs.venusTide327f docs.w328c docs.response328b lint.regenScope lint.provenanceMeta lint.stableHashPaths lint.quickBoundary324c lint.narrowScope327c docs.w320d lint.qaHeapRelease310 lint.sectionLookup313"
# ==== 第329便a の塊(ここまで)====
# ==== 第329便b の塊(ここから)====
# 第329便b(原仮定者の方針(2026-11-07)・原仮定者の回答(2026-11-07 —— AN568・AN569・AN570)・統括の検証項目 R305 —— 診断だけ・html は変えない): 枝 b の新設 3 本(lint.galRot329b —— 既存理論の
#   ラベルと場の契約の版 2 の純関数の場面〔恒等式・物質線の反例・微分の型・ラベルの口・基準列と η・箱の集計/版 1 と同じ・回す枠・欠測は null・拒否・往復と相対の速さ・滑りと帳簿・ラベル〕と
#   fixture の照合〔sha256・生の文・第三者の写し・CSV の v_rot〕・呼ぶだけの検査 / behavior.galRot329b —— 今の html の 🌃 の写しで DFM の探り・場の API で版 2 の口・fixture で基準列を作り直す /
#   docs.galRot329b —— 正本の門と表が PHYSICS〔第329便b〕に逐語・第328便a の節の「第329便の更新」・文書)と、節に行を足した docs.fieldContract328a・名簿の行の docs.w320d・新しい段 galrot-329b の lint 一式
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.galRot329b behavior.galRot329b docs.galRot329b docs.fieldContract328a docs.w320d lint.regenScope lint.provenanceMeta lint.stableHashPaths lint.scopeStop lint.scopeAll312 lint.regenChain lint.canon304 lint.harnessSmoke303 lint.quickBoundary324c lint.narrowScope327c lint.qaHeapRelease310 lint.sectionLookup313"
# ==== 第329便b の塊(ここまで)====
# ==== 第329便c の塊(ここから)====
# 第329便c(原仮定者の回答(2026-11-05 —— AN554 = A)・原仮定者の回答(2026-11-07 —— AN569)・統括の検証項目 R306 —— 道具だけ・html は変えない): 枝 c の新設 6 本(lint.contractSeam329c —— 契約の継ぎ目 /
#   lint.condSelect329c —— 条件で選ぶ本の宣言と変異の試験 / lint.alwaysShadowVolatile329c —— 常時群の影の揮発の欄 / lint.fixedWindow329c —— 固定の字数の窓の残り / lint.qaHeapDefault329c —— QA_FAST の heap の既定 /
#   docs.w329c)と、世代を直した lint.response328b・器の版を上げて正本を作り直した段 response-328b の QA・刻印の道具と再生成表を触った lint 一式・固定の字数の窓を「次の見出しまで」へ直した 86 鍵
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.contractSeam329c lint.condSelect329c lint.alwaysShadowVolatile329c lint.fixedWindow329c lint.qaHeapDefault329c docs.w329c lint.response328b behavior.response328b docs.response328b lint.alwaysShadow326e docs.regenShort319c lint.regenScope lint.provenanceMeta lint.stableHashPaths lint.scopeStop lint.scopeAll312 lint.regenChain lint.narrowScope327c lint.qaHeapRelease310 lint.sectionLookup313 lint.qaOrder"
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS docs.d0audit-sync docs.d0sites-sync docs.bgpredict-sync docs.selfInertia-sync docs.bgbudget-sync docs.bgEquivalence docs.comovingAdvection docs.bgCompose docs.bgbudget2-sync docs.sphereKernel preset.earthMoonInertial docs.composeContract docs.coreCensus docs.emgrid-sync docs.geo3-sync ui.gwGroupMove ui.trailFollowFrame ui.liveComparePeriodDef docs.gwWindowDecl docs.moon3d298 docs.planets3d299 preset.saturnRing3d300 preset.approxMany301 behavior.gLoc302 docs.semic302 docs.inertialR2_303 docs.shell304 docs.pairNorm305 docs.sphereAxial307 docs.bevel308 docs.invSq309 docs.invSq310 docs.coreSpin311 docs.galaxial311 docs.galaxialRd312 docs.galaxialRdm313 docs.w308d docs.mdSweep310 docs.planet3_311 docs.decay312 docs.confirm312 docs.kappaM313 docs.rdExcess314 docs.planet3v3_313 docs.k1confirm313 docs.rdScale314 docs.k1outer314 docs.pn1x3d314 docs.rsExcess315 docs.inposK1_315 docs.satK1_315 docs.satH316 docs.satMeas317a docs.satN317b docs.satCut317c docs.satAn317d docs.paper3Key317d docs.satNext318b docs.solar16Builtin318c docs.dragEst318d docs.axisHeat319 docs.srcRadius319 docs.regenShort319c docs.srcHeat320 docs.jExplore320b docs.nbCompose320c docs.geo2v3321a docs.geo3Bin321b docs.galField321c docs.geo2flat322a docs.binBooks322b docs.fieldContract322c docs.obsSpin324b docs.geo2thick324a docs.geo4old325c docs.xkLock325f docs.xkLock326a docs.axialHeat326d docs.axialSum327a docs.galaxis327b docs.xkLock327d docs.axialDiff327e docs.venusTide327f docs.fieldContract328a docs.w328c"
# ==== 第329便c の塊(ここまで)====
# ==== 第330便a の塊(ここから)====
# 第330便a(原仮定者の整理(2026-11-08)・原仮定者の回答(2026-11-08 —— AN577・AN578・AN579)・統括の検証項目 R307 —— 診断だけ・html は変えない): 枝 a の新設 3 本(lint.spinClass330a ——
#   分類と群・重みの定常・1 つの A・符号の表・内部熱の帳簿・測地の歳差・古典と節の歳差・窓の角の純関数の場面と呼ぶだけの検査・文献の値が paper/data の行と同じ値 / behavior.spinClass330a —— 今の html の
#   🗺️ の写しで入力・由来ごとのトルク・1 つの A・金星の符号・帳簿が正本と同じ / docs.spinClass330a —— 正本の門と表が PHYSICS〔第330便a〕に逐語・第329便a の節の「第330便の更新」・文書)と、
#   節に行を足した第329便a の節を読む docs.spinBias329a・新しい段 spinclass-330a の lint 一式
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.spinClass330a behavior.spinClass330a docs.spinClass330a docs.spinBias329a lint.regenScope lint.provenanceMeta lint.stableHashPaths lint.quickBoundary324c lint.narrowScope327c docs.w320d lint.qaHeapRelease310 lint.sectionLookup313 lint.fixedWindow329c"
# ==== 第330便a の塊(ここまで)====
# ==== 第330便b の塊(ここから)====
# 第330便b(原仮定者の整理(2026-11-08)・原仮定者の回答(2026-11-08 —— AN578・AN580)・統括の検証項目 R308 —— 診断だけ・html は変えない): 枝 b の新設 3 本(lint.dragWeight330b ——
#   重みの式・自己の重みの型・連鎖の固定点・ジャイロ・密度波のラベルの純関数の場面と呼ぶだけの検査・回転する枠の欠測の修正〔第329便b の契約の lib-2〕の場面 /
#   behavior.dragWeight330b —— 今の html の 🗺️ の写しで受理器の試しと 3 体の β・円盤の連鎖・ジャイロ・密度波を作り直して正本と同じ / docs.dragWeight330b —— 正本の門と表が
#   PHYSICS〔第330便b〕に逐語・〔第329便b〕の節の「第330便の更新」・文書)と、世代を直した lint.galRot329b と節に行を足した docs.galRot329b・新しい段 dragweight-330b の lint 一式
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.dragWeight330b behavior.dragWeight330b docs.dragWeight330b lint.galRot329b behavior.galRot329b docs.galRot329b docs.w320d lint.regenScope lint.provenanceMeta lint.stableHashPaths lint.scopeStop lint.scopeAll312 lint.regenChain lint.canon304 lint.harnessSmoke303 lint.quickBoundary324c lint.narrowScope327c lint.qaHeapRelease310 lint.sectionLookup313 lint.kappaSymbol315 lint.fixedWindow329c"
# ==== 第330便b の塊(ここまで)====
# ==== 第330便c の塊(ここから)====
# 第330便c(原仮定者の回答(2026-11-08 —— AN584・AN585)・統括の検証項目 R309 —— 道具だけ・html は変えない): 枝 c の新設 3 本(lint.toolCheckProv330c —— 計画と lint の道具の照合を 1 つの関数に /
#   lint.physKeysGuard330c —— 名指しの段の physics の鍵の集合の守り / docs.w330c)と、道具の照合の関数を呼ぶ lint 一式(provenanceMeta・toolStamp318・canon304 ほか)・batchKeys を直した
#   版名 QA の束の QA(docs.w322d —— qa-keys の自己試験 ④ の期待を世代で直した)・§5.19 の窓を直した docs.nsLockLedgerRow・固定の字数の窓の lint.fixedWindow329c
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.toolCheckProv330c lint.physKeysGuard330c docs.w330c docs.w322d docs.nsLockLedgerRow lint.fixedWindow329c lint.toolStamp318 lint.provenanceMeta lint.regenScope lint.canon304 lint.scopeAll312 lint.stableHashPaths lint.regenChain lint.scopeStop lint.condSelect329c lint.qaOrder"
# ==== 第330便c の塊(ここまで)====
# ==== 第331便a の塊(ここから)====
# 第331便a(原仮定者の決断(2026-11-09 —— AN586〜AN590)・原仮定者の回答(2026-11-09 —— AN591)・統括の検証項目 R310 —— 診断だけ・html は変えない): 枝 a の新設 3 本(lint.coordTwist331a ——
#   座標則・自己の重みの宣言・口の登録と 4 条件・近点の一次の目安・通約・内部熱の 3 欄の純関数の場面と呼ぶだけの検査・lockTargets の宣言・入力の正本の値 / behavior.coordTwist331a —— 今の html の
#   🗺️ の写しで成分ごとの表・近点の目安・4 条件・地球と火星を作り直して正本と同じ / docs.coordTwist331a —— 正本の門と表が PHYSICS〔第331便a〕に逐語・文書)と、新しい段 coordtwist-331a の lint 一式
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.coordTwist331a behavior.coordTwist331a docs.coordTwist331a docs.w320d lint.regenScope lint.provenanceMeta lint.stableHashPaths lint.scopeStop lint.scopeAll312 lint.regenChain lint.quickBoundary324c lint.narrowScope327c lint.qaHeapRelease310 lint.sectionLookup313 lint.kappaSymbol315 lint.fixedWindow329c"
# ==== 第331便a の塊(ここまで)====
# ==== 第331便b の塊(ここから)====
# 第331便b(原仮定者の追記(2026-11-09)・原仮定者の決断(2026-11-09 —— AN593・AN595)・統括の検証項目 R311 —— 診断だけ・html は変えない): 枝 b の新設 3 本(lint.centrifugal331b ——
#   回る枠の中の円軌道の釣り合い・枠の 2 つの読み・否定対照・円盤の枠の固定点の純関数の場面と呼ぶだけの検査 / behavior.centrifugal331b —— 今の html の 🗺️ と 💍 の宣言と fixture から
#   要る枠・AN593 B の格子・横の列・太陽系・環を作り直して正本と同じ / docs.centrifugal331b —— 正本の門と表が PHYSICS〔第331便b〕に逐語・文書)と、新しい段 centrifugal-331b の lint 一式
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.centrifugal331b behavior.centrifugal331b docs.centrifugal331b docs.w320d lint.regenScope lint.provenanceMeta lint.stableHashPaths lint.scopeStop lint.scopeAll312 lint.regenChain lint.canon304 lint.harnessSmoke303 lint.quickBoundary324c lint.narrowScope327c lint.qaHeapRelease310 lint.sectionLookup313 lint.kappaSymbol315 lint.fixedWindow329c"
# ==== 第331便b の塊(ここまで)====
# ==== 第331便c の塊(ここから)====
# 第331便c(原仮定者の整理(2026-11-09)・原仮定者の追記(2026-11-09)・統括の検証項目 R312 —— 診断だけ・html は変えない): 枝 c の新設 3 本(lint.k1Scale331c ——
#   G_loc の一次の分担・候補・K1 のスケールの読み・純粋な積分器・土星の環の振動数の純関数の場面と呼ぶだけの検査・文献の値の出典 / behavior.k1Scale331c —— 今の html で
#   t = 0 の印字と写しの宣言・正本の数値の表を作り直して同じ・在位の正本とのビット同一 / docs.k1Scale331c —— 正本の門と表 14 本が PHYSICS〔第331便c〕に逐語・文書)と、
#   新しい段 k1scale-331c の lint 一式
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.k1Scale331c behavior.k1Scale331c docs.k1Scale331c docs.w320d lint.regenScope lint.provenanceMeta lint.stableHashPaths lint.scopeStop lint.scopeAll312 lint.regenChain lint.canon304 lint.harnessSmoke303 lint.quickBoundary324c lint.narrowScope327c lint.qaHeapRelease310 lint.sectionLookup313 lint.kappaSymbol315 lint.fixedWindow329c"
# ==== 第331便c の塊(ここまで)====
# ==== 第331便d の塊(ここから)====
# 第331便d(原仮定者の依頼(2026-11-09)・統括の検証項目 R313 —— 文書と QA だけ・html は変えない): 枝 d の新設 2 本(lint.equations331d —— docs/EQUATIONS.md のプログラム版の抜粋が
#   名指しのファイルの名指しの関数の本体に在る・変異の自己試験・PHYSICS §5 の E の名の拾い漏れ / docs.equations331d —— ラベルと 4 つの部分・定数と在位の水星の正本・書かない語・置き場所)と、
#   PHYSICS と AI_SPEC の新しい文の係数記号の lint.kappaSymbol315・節の窓の lint.fixedWindow329c・節の引き方の lint.sectionLookup313・版名 QA の束の docs.w322d
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.equations331d docs.equations331d lint.kappaSymbol315 lint.fixedWindow329c lint.sectionLookup313 docs.w322d"
# ==== 第331便d の塊(ここまで)====
# ==== 第331便e の塊(ここから)====
# 第331便e(原仮定者の補足(2026-11-09)・統括の検証項目 R314 —— 文書と QA だけ・html は変えない): 枝 e の新設 2 本(lint.phenomena331e —— 現象の状況一覧の照合の規則の自己試験と転記の表の形 /
#   docs.phenomena331e —— docs/PHENOMENA_STATUS.md の証拠の実在・語彙と件数・SAMPLE_STATUS の状況との対応と理由の欄・主な数の転記・PHYSICS〔第331便e〕・文書)と、PHYSICS・AI_SPEC・CHANGELOG を読む lint 一式
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.phenomena331e docs.phenomena331e lint.kappaSymbol315 lint.fixedWindow329c lint.sectionLookup313 lint.qaHeapRelease310 docs.w322d docs.sampleStatus-sync"
# ==== 第331便e の塊(ここまで)====
# ==== 第332便a の塊(ここから)====
# 第332便a(原仮定者の補足(2026-11-10)・原仮定者の補足その3(2026-11-10)・統括の検証項目 R315 —— 診断だけ・html は変えない): 枝 a の新設 3 本(lint.eqBand332a —— 帯の力〔宣言・未接続〕の形・尾・向き・強さ・
#   規則の型の一覧と純関数の場面と呼ぶだけの検査・文献の出典 / behavior.eqBand332a —— 今の html の 🗺️ と 💍 の宣言から環・公転面・揃える時間・物差し・球の核と帯の比べを作り直して
#   正本と同じ / docs.eqBand332a —— 正本の門と表 17 本が PHYSICS〔第332便a〕に逐語・文書)と、新しい段 eqband-332a の lint 一式
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.eqBand332a behavior.eqBand332a docs.eqBand332a docs.w320d lint.regenScope lint.provenanceMeta lint.stableHashPaths lint.scopeStop lint.scopeAll312 lint.regenChain lint.canon304 lint.harnessSmoke303 lint.quickBoundary324c lint.narrowScope327c lint.qaHeapRelease310 lint.sectionLookup313 lint.kappaSymbol315 lint.fixedWindow329c"
# ==== 第332便a の塊(ここまで)====
# ==== 第332便b の塊(ここから)====
# 第332便b(原仮定者の補足(2026-11-10)・統括の検証項目 R316 —— 診断だけ・html は変えない): 枝 b の新設 3 本(lint.transGeo2332b —— 場の式・解析の勾配・E2 の q = 0 と座標変換の回転・
#   第331便a の座標則との照らし・定常の輸送と第331便b の枠の式の純関数の場面と呼ぶだけの検査・物差しの宣言 / behavior.transGeo2332b —— 今の html の 💫 の写しでエンジンとの照らし・
#   同じ入力の表・NGC 3198・違いの分解・近似として読める範囲を作り直して正本と同じ / docs.transGeo2332b —— 正本の門と表が PHYSICS〔第332便b〕に逐語・文書)と、新しい段 transgeo2-332b の lint 一式
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.transGeo2332b behavior.transGeo2332b docs.transGeo2332b docs.w320d lint.regenScope lint.provenanceMeta lint.stableHashPaths lint.scopeStop lint.scopeAll312 lint.regenChain lint.canon304 lint.harnessSmoke303 lint.quickBoundary324c lint.narrowScope327c lint.qaHeapRelease310 lint.sectionLookup313 lint.kappaSymbol315 lint.fixedWindow329c"
# ==== 第332便b の塊(ここまで)====
# ==== 第333便a の塊(ここから)====
# 第333便a(原仮定者の整理(2026-11-10)・統括の検証項目 R317 —— 診断だけ・html は変えない): 枝 a の新設 3 本(lint.rotDiff333a —— 3 列と型の一覧・走行の前の宣言・純関数の場面と呼ぶだけの検査・
#   慣性係数の表 / behavior.rotDiff333a —— 今の html の 🗺️ と 💍 の宣言から 3 列の表・s_d の表・写しのエンジンとの等価・揃いの表を作り直して正本と同じ / docs.rotDiff333a —— 正本の門と表 12 本が
#   PHYSICS〔第333便a〕に逐語・文書)と、新しい段 rotdiff-333a の lint 一式
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.rotDiff333a behavior.rotDiff333a docs.rotDiff333a docs.w320d lint.regenScope lint.provenanceMeta lint.stableHashPaths lint.scopeStop lint.scopeAll312 lint.regenChain lint.canon304 lint.harnessSmoke303 lint.quickBoundary324c lint.narrowScope327c lint.qaHeapRelease310 lint.sectionLookup313 lint.kappaSymbol315 lint.fixedWindow329c"
# ==== 第333便a の塊(ここまで)====
# ==== 第333便b の塊(ここから)====
# 第333便b(原仮定者の整理(2026-11-10)・統括の検証項目 R318 —— 診断だけ・html は変えない): 枝 b の新設 3 本(lint.axialField333b —— 統合した並進の場と受け手の差分・遠心の順行と逆行・
#   次数と単位の純関数の場面と呼ぶだけの検査 / behavior.axialField333b —— 今の html の 🗺️ の写しで場の表・今の軸の口の読み口・有限の受け手・遠心・次数と単位を作り直して正本と同じ /
#   docs.axialField333b —— 正本の門と表が PHYSICS〔第333便b〕に逐語・文書)と、新しい段 axialfield-333b の lint 一式
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.axialField333b behavior.axialField333b docs.axialField333b docs.w320d lint.regenScope lint.provenanceMeta lint.stableHashPaths lint.scopeStop lint.scopeAll312 lint.regenChain lint.canon304 lint.harnessSmoke303 lint.quickBoundary324c lint.narrowScope327c lint.qaHeapRelease310 lint.sectionLookup313 lint.kappaSymbol315 lint.fixedWindow329c"
# ==== 第333便b の塊(ここまで)====
# ==== 第333便c の塊(ここから)====
# 第333便c(原仮定者の整理(2026-11-10)・原仮定者の回答(2026-11-10 —— AN597・AN598・AN600)・統括の検証項目 R319 —— 診断だけ・html は変えない): 枝 c の新設 3 本(lint.mercury3d333c —— 三次元の幾何の宣言・
#   効果の型の一覧と純関数の場面〔Gauss の平均・J₂ の独立の照合・対向 2 点の差分・切り口の式と第332便a の平均・連星の一次〕と呼ぶだけの検査・文献の出典 / behavior.mercury3d333c —— 今の html の 🌡️🌋🔴 の
#   宣言から幾何・今の組・G_loc の格子・統合した並進・回転の差分・対照を作り直して正本と同じ / docs.mercury3d333c —— 正本の門と表 11 本が PHYSICS〔第333便c〕に逐語・文書)と、新しい段 mercury3d-333c の lint 一式
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.mercury3d333c behavior.mercury3d333c docs.mercury3d333c docs.w320d lint.regenScope lint.provenanceMeta lint.stableHashPaths lint.scopeStop lint.scopeAll312 lint.regenChain lint.canon304 lint.harnessSmoke303 lint.quickBoundary324c lint.narrowScope327c lint.qaHeapRelease310 lint.sectionLookup313 lint.kappaSymbol315 lint.fixedWindow329c"
# ==== 第333便c の塊(ここまで)====
# ==== 第333便d の塊(ここから)====
# 第333便d(原仮定者の整理(2026-11-10)・原仮定者の回答(2026-11-10 —— AN608)・統括の検証項目 R320 —— 診断だけ・html は変えない): 枝 d の新設 3 本(lint.nonCirc333d —— 非円軌道の低 N の円盤と
#   場の時間微分の純関数の場面と呼ぶだけの検査・器の宣言 / behavior.nonCirc333d —— 族と組・腕と分散の比べ・離散化・∂U/∂t の差分の照らし・共鳴の半径を作り直して正本と同じ・
#   第332便b の円盤との起点の照合 / docs.nonCirc333d —— 正本の門と表 8 本が PHYSICS〔第333便d〕に逐語・文書)と、新しい段 noncirc-333d の lint 一式
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.nonCirc333d behavior.nonCirc333d docs.nonCirc333d docs.w320d lint.regenScope lint.provenanceMeta lint.stableHashPaths lint.scopeStop lint.scopeAll312 lint.regenChain lint.canon304 lint.harnessSmoke303 lint.quickBoundary324c lint.narrowScope327c lint.qaHeapRelease310 lint.sectionLookup313 lint.kappaSymbol315 lint.fixedWindow329c"
# ==== 第333便d の塊(ここまで)====
# ==== 第333便e の塊(ここから)====
# 第333便e(原仮定者の整理(2026-11-10)・原仮定者の回答(2026-11-10 —— AN609・AN610)・統括の検証項目 R321 —— 文書と論文と QA だけ・html は変えない): 枝 e の新設 2 本
#   (lint.symbols333e —— 新しい文の旧い記号とコードの書式の外のコードの名前・変異の自己試験 / docs.symbols333e —— 対応表とコードの名前の実在・数式版・論文 10 本の位置と距離・
#   PHYSICS〔第333便e〕・文書)と、直した文書と論文を読む鍵(式の一覧・現象の一覧・論文の記号・論文 3 の鍵の文・裸のカッパ)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.symbols333e docs.symbols333e lint.equations331d docs.equations331d lint.phenomena331e docs.phenomena331e docs.paperSymbols316 docs.paper3Key317d docs.symbols315 lint.kappaSymbol315 lint.sectionLookup313 lint.qaHeapRelease310"
# ==== 第333便e の塊(ここまで)====
# ==== 第334便a の塊(ここから)====
# 第334便a(原仮定者の整理(2026-11-11)・原仮定者の回答(2026-11-11 —— AN623・AN624)・統括の検証項目 R322 —— 診断だけ・html は変えない): 枝 a の新設 3 本(lint.heightLaw334a —— 高さ則の読みの候補・
#   範囲の物差し・扁平の則・回転楕円体の求積・厚みの対照の純関数の場面と呼ぶだけの検査・器の宣言 / behavior.heightLaw334a —— 範囲・高さの分布・比例の範囲・厚み・扁平・天体の表を作り直して正本と同じ・
#   比べる列が第333便a の lib と同じ / docs.heightLaw334a —— 正本の門と表 11 本が PHYSICS〔第334便a〕に逐語・文書)と、新しい段 heightlaw-334a の lint 一式
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.heightLaw334a behavior.heightLaw334a docs.heightLaw334a docs.w320d lint.regenScope lint.provenanceMeta lint.stableHashPaths lint.scopeStop lint.scopeAll312 lint.regenChain lint.canon304 lint.harnessSmoke303 lint.quickBoundary324c lint.narrowScope327c lint.qaHeapRelease310 lint.sectionLookup313 lint.kappaSymbol315 lint.fixedWindow329c lint.symbols333e"
# ==== 第334便a の塊(ここまで)====
# ==== 第334便b の塊(ここから)====
# 第334便b(原仮定者の整理(2026-11-11)・原仮定者の回答(2026-11-11 —— AN626・AN630)・統括の検証項目 R323 —— 診断だけ・html は変えない): 枝 b の新設 3 本(lint.ledger334b —— 帳簿の純関数の
#   場面と呼ぶだけの検査・宣言 / behavior.ledger334b —— 押し・軸の応答・潮汐の対応・自己の割合と 1 系の窓を作り直して正本と同じ / docs.ledger334b —— 正本の門と表 9 本が
#   PHYSICS〔第334便b〕に逐語・文書)と、新しい段 ledger-334b の lint 一式
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.ledger334b behavior.ledger334b docs.ledger334b docs.w320d lint.regenScope lint.provenanceMeta lint.stableHashPaths lint.scopeStop lint.scopeAll312 lint.regenChain lint.canon304 lint.harnessSmoke303 lint.quickBoundary324c lint.narrowScope327c lint.qaHeapRelease310 lint.sectionLookup313 lint.kappaSymbol315 lint.fixedWindow329c"
# ==== 第334便b の塊(ここまで)====
# ==== 第334便c の塊(ここから)====
# 第334便c(原仮定者の整理(2026-11-11)・原仮定者の回答(2026-11-11 —— AN633〜AN636)・統括の検証項目 R324 —— 診断だけ・html は変えない): 枝 c の新設 3 本(lint.mercuryNode334c —— 窓の宣言と
#   純関数の場面〔窓の和・面を変えたベクトル・面に垂直な力・並進と K1・揃えた自己の形・文献の式・ω に依らない面内の回転・帯の区間〕と呼ぶだけの検査・文献の出典と未照合の印 / behavior.mercuryNode334c ——
#   今の html の 🌡️🌋🔴 の宣言から窓・仮説・組み合わせ・文献の比・対照を作り直して正本と同じ / docs.mercuryNode334c —— 正本の門と表 13 本が PHYSICS〔第334便c〕に逐語・文書)と、新しい段 mercurynode-334c の lint 一式
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.mercuryNode334c behavior.mercuryNode334c docs.mercuryNode334c docs.w320d lint.regenScope lint.provenanceMeta lint.stableHashPaths lint.scopeStop lint.scopeAll312 lint.regenChain lint.canon304 lint.harnessSmoke303 lint.quickBoundary324c lint.narrowScope327c lint.qaHeapRelease310 lint.sectionLookup313 lint.kappaSymbol315 lint.fixedWindow329c lint.symbols333e"
# ==== 第334便c の塊(ここまで)====
# ==== 第334便d の塊(ここから)====
# 第334便d(原仮定者の整理(2026-11-11)・原仮定者の回答(2026-11-11 —— AN637・AN634・AN624)・統括の検証項目 R325 —— 診断だけ・html は変えない): 枝 d の新設 3 本(lint.binaryLaw334d —— 同期の零試験と
#   二体の同時発展の純関数の場面と呼ぶだけの検査・宣言 / behavior.binaryLaw334d —— 系の表・零試験・部分集合の格子・傾いた軸の行を今の html の 10 本から作り直して正本と同じ /
#   docs.binaryLaw334d —— 正本の門と表 12 本が PHYSICS〔第334便d〕に逐語・文書)と、新しい段 binarylaw-334d の lint 一式
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.binaryLaw334d behavior.binaryLaw334d docs.binaryLaw334d docs.w320d lint.regenScope lint.provenanceMeta lint.stableHashPaths lint.scopeStop lint.scopeAll312 lint.regenChain lint.canon304 lint.harnessSmoke303 lint.quickBoundary324c lint.narrowScope327c lint.qaHeapRelease310 lint.sectionLookup313 lint.kappaSymbol315 lint.fixedWindow329c lint.symbols333e"
# ==== 第334便d の塊(ここまで)====
# ==== 第334便e の塊(ここから)====
# 第334便e(原仮定者の回答(2026-11-11 —— AN638・AN640)・原仮定者の整理(2026-11-11)・統括の検証項目 R326 —— 診断だけ・html は変えない): 枝 e の新設 3 本(lint.gridFloor334e —— 固定の受け手の格子の場の
#   純関数の場面と呼ぶだけの検査・器の宣言〔誤差の幅の定義・目標・判定の比〕/ behavior.gridFloor334e —— 格子の受け手の主の離散化・幅と分解・目標・腕の比べ・星の点の受け手と第333便d の照らし・
#   高さの列を作り直して正本と同じ / docs.gridFloor334e —— 正本の門と表 17 本が PHYSICS〔第334便e〕に逐語・文書)と、新しい段 gridfloor-334e の lint 一式
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.gridFloor334e behavior.gridFloor334e docs.gridFloor334e docs.w320d lint.regenScope lint.provenanceMeta lint.stableHashPaths lint.scopeStop lint.scopeAll312 lint.regenChain lint.canon304 lint.harnessSmoke303 lint.quickBoundary324c lint.narrowScope327c lint.qaHeapRelease310 lint.sectionLookup313 lint.kappaSymbol315 lint.fixedWindow329c lint.symbols333e"
# ==== 第334便e の塊(ここまで)====
# ==== 第334便f の塊(ここから)====
# 第334便f(原仮定者の整理(2026-11-11)・統括の検証項目 R327 —— 文書と QA だけ・html は変えない): 枝 f の新設 2 本(lint.terms334f —— 引きずり 3 種の用語の表と
#   第333便の診断の式の項・変異の自己試験 / docs.terms334f —— 現象の一覧の更新した行と P33・PHYSICS〔第334便f〕・文書)と、直した文書を読む鍵(式の一覧・現象の一覧・記号)
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.terms334f docs.terms334f lint.equations331d docs.equations331d lint.phenomena331e docs.phenomena331e lint.symbols333e docs.symbols333e lint.kappaSymbol315"
# ==== 第334便f の塊(ここまで)====
# ==== 第335便b の塊(ここから)====
# 第335便b(原仮定者の決断(2026-11-12 —— AN654・AN653・AN650)・原仮定者の補足(2026-11-12)・統括の検証項目 R329 —— 診断だけ・html は変えない): 枝 b の新設 3 本(lint.carryLedger335b ——
#   自己を運ぶ式・熱の口・供給の帳簿・T1 の部位の則の純関数と宣言 / behavior.carryLedger335b —— 正本の本の時刻の状態から表を作り直して正本と同じ / docs.carryLedger335b —— 正本の門と
#   表 11 本が PHYSICS〔第335便b〕に逐語・文書)と、新しい段 carryledger-335b の lint 一式
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.carryLedger335b behavior.carryLedger335b docs.carryLedger335b docs.w320d lint.regenScope lint.provenanceMeta lint.stableHashPaths lint.scopeStop lint.scopeAll312 lint.regenChain lint.symbols333e lint.kappaSymbol315"
# ==== 第335便b の塊(ここまで)====
# ==== 第335便c の塊(ここから)====
# 第335便c(原仮定者の決断(2026-11-12)・原仮定者の補足(2026-11-12)・原仮定者の回答(2026-11-12 —— AN646・AN650・AN655・AN657)・統括の検証項目 R330 —— 診断だけ・html は変えない): 枝 c の新設 3 本
#   (lint.mercuryCombo335c —— 宣言と純関数の場面〔分解の閉じ・動径の成分・T1 の速さの指標・向きの基底・区間の和・当てはめ・単位の写し・入力の拒否〕と呼ぶだけの検査・文献の値の訂正 /
#   behavior.mercuryCombo335c —— 今の html の 🌡️🌋🔴 の宣言から分解・組み合わせ・区間・型・二次の結合・対照を作り直して正本と同じ / docs.mercuryCombo335c —— 正本の門と表が PHYSICS〔第335便c〕に逐語・文書)と、
#   文献の値を訂正した第334便c の 3 本と、新しい段 mercurycombo-335c の lint 一式
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.mercuryCombo335c behavior.mercuryCombo335c docs.mercuryCombo335c lint.mercuryNode334c behavior.mercuryNode334c docs.mercuryNode334c docs.w320d lint.regenScope lint.provenanceMeta lint.stableHashPaths lint.scopeStop lint.scopeAll312 lint.regenChain lint.canon304 lint.harnessSmoke303 lint.quickBoundary324c lint.narrowScope327c lint.qaHeapRelease310 lint.sectionLookup313 lint.kappaSymbol315 lint.fixedWindow329c lint.symbols333e"
# ==== 第335便c の塊(ここまで)====
# ==== 第335便g の塊(ここから)====
# 第335便g(原仮定者の決断(2026-11-12)・統括の検証項目 R334 —— 文書と QA だけ・html は変えない): 枝 g の新設 2 本(lint.terms335g —— 第334便の診断の式の項 EQ-34〜EQ-43 と
#   用語の表の更新・第334便f の照合の世代の写し・変異の自己試験 / docs.terms335g —— 現象の一覧の欄「第334便の調べ」・PHYSICS〔第335便g〕・文書)と、直した文書を読む鍵
DEFAULT_WAVE_IDS="$DEFAULT_WAVE_IDS lint.terms335g docs.terms335g lint.terms334f docs.terms334f lint.equations331d docs.equations331d lint.phenomena331e docs.phenomena331e lint.symbols333e docs.symbols333e lint.kappaSymbol315"
# ==== 第335便g の塊(ここまで)====
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
PMWAVE="${POST_MERGE_WAVE:-}"; ALLW=0   # 第324便c(R281): ③′ の便(--wave N・既定は CHANGELOG の最新の便)・--all-waves で第323便までの積み上げ
while [ $# -gt 0 ]; do
  case "$1" in
    --base) BASE="${2:-}"; shift 2 ;;
    --failed) FAILED="${2:-}"; shift 2 ;;
    --no-root) NOROOT=1; shift ;;
    --no-preflight) NOPRE=1; shift ;;
    --wave) PMWAVE="${2:-}"; shift 2 ;;
    --all-waves) ALLW=1; shift ;;
    -h|--help) sed -n '2,30p' "$0"; exit 0 ;;
    *) echo "post-merge-qa: 知らない引数 $1" >&2; exit 2 ;;
  esac
done
if [ -z "${PLAYWRIGHT_CORE_DIR:-}" ] && [ -d /opt/node22/lib/node_modules/playwright ]; then export PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright; fi
# ==== 第324便c の塊(ここから)====
# 第324便c(統括の検証項目 R281 —— 第323便の統括の手順で決めたこと「③′ は便の新設に絞る」): ③′ の既定を**便の塊だけ**に。
#   便 = --wave N か POST_MERGE_WAVE か CHANGELOG.md の最初の `## v…-b<便>(`。この脚本の `# ==== 第<便><枝> の塊(ここから)====` の中の
#   DEFAULT_WAVE_IDS / WAVE_IDS の名だけを集め(tests/lib-w324c-postmerge.mjs の waveIdsFromScript)、PHYSICS 全体を走査する一式(PHYS_SCAN_IDS)を足す。
#   過去の便の新設は積まない(第323便は過去の便の新設を積んだ 412 鍵で 30 min 前後)—— 過去の便の分はフルゲートと CI が見る。
#   POST_MERGE_WAVE_IDS を渡したときはそのまま(絞らない)・--all-waves で第323便までの積み上げ(全部の便の塊)。
S3W_SCOPE="指定の一覧(POST_MERGE_WAVE_IDS)"
if [ -z "${POST_MERGE_WAVE_IDS+x}" ]; then
  if [ $ALLW -eq 1 ]; then S3W_SCOPE="全部の便の積み上げ(--all-waves)"
  else
    [ -n "$PMWAVE" ] || PMWAVE=$(node tests/lib-w324c-postmerge.mjs --wave-of CHANGELOG.md 2>/dev/null || true)
    if [ -n "$PMWAVE" ]; then
      NALLW=$(echo "$WAVE_IDS" | tr -s ' ' '\n' | sort -u | grep -c .)   # 重複を除いた名の数
      WAVE_IDS="$(node tests/lib-w324c-postmerge.mjs --wave-ids "$ROOT/tools/post-merge-qa.sh" "$PMWAVE" 2>/dev/null) ${POST_MERGE_PHYS_SCAN_IDS-$PHYS_SCAN_IDS}"
      S3W_SCOPE="第${PMWAVE}便の塊と PHYSICS の走査の一式(全部の便を積むと重複を除いて ${NALLW} 名)"
    else S3W_SCOPE="全部の便の積み上げ(便の番号が引けない)"
    fi
  fi
fi
# ③〜④ の数: qapart の `# qapart-summary` の行を読んで PASS・FAIL・SKIP・未実行の 4 つの数(未実行の鍵の名つき —— beta で root でだけ走る鍵の未実行は正常と注記)
qsum324c() { node tests/lib-w324c-postmerge.mjs --sum "$1" --target "${2:-beta}" ${3:+--requested "$3"} 2>/dev/null || echo "要約が読めない"; }
# ==== 第324便c の塊(ここまで)====
LOG="${POST_MERGE_LOG:-${TMPDIR:-/tmp}/post-merge-qa-$(date -u +%Y%m%dT%H%M%SZ)}"
mkdir -p "$LOG" || exit 2
T0=$(date +%s); fail=0
count() { grep -c "^$1 " "$2" 2>/dev/null || true; }
say() { echo "[post-merge-qa] $*"; }

# ==== 第323便a の塊(ここから)====
# 第323便a(統括の検証項目 R275 —— 原仮定者の指示(2026-11-01)「今後は、すぐに確認可能な規約を先に判定する」): ⓪ 規約の速い判定。
#   第322便は c₀ = 30 の規約の外(♊⚖️ の c₀ = 10)を鎖の後のゲートで初めて見つけた —— 統合の直後・① の前に数秒で見る。NG(rc ≠ 0)なら ① 以降を走らせない。
#   qapart(③〜④)は第323便a から要求した鍵の未実行を FAIL に数え、SKIP は PASS に数えない(終わりの行「PASS n・FAIL n・SKIP n・未実行 n」)。
S0="skip"
say "⓪ 規約の速い判定(conventions-check)→ $LOG/0-conventions.log"
CT="--target beta/index.html"; [ $NOROOT -eq 0 ] && CT="$CT --target index.html"
# shellcheck disable=SC2086
node tools/conventions-check.mjs $CT --json "$LOG/0-conventions.json" >"$LOG/0-conventions.log" 2>&1; rc0=$?
S0="conventions $([ $rc0 -eq 0 ] && echo ok || echo "NG(rc $rc0)")"
if [ $rc0 -ne 0 ]; then
  cat "$LOG/0-conventions.log"
  echo "post-merge-qa: ⓪ $S0 —— 規約の外か道具の誤り(① 以降を走らせない)所要 $(( $(date +%s) - T0 )) s → FAIL(ログ $LOG)"
  exit 1
fi
# ==== 第323便a の塊(ここまで)====

# ① 静的受理
S1="skip"
if [ $NOPRE -eq 0 ]; then
  say "① 静的受理(qa-preflight beta)→ $LOG/1-preflight.log"
  # 第305便e(決断事項 AN328): heap の上限 6144 MiB(第304便e の測定 —— 2048 MiB で heap out of memory・終了コード 134)
  QA_TARGET=beta/index.html node --max-old-space-size=6144 tests/qa-preflight.mjs >"$LOG/1-preflight.log" 2>&1; rc=$?
  p=$(count PASS "$LOG/1-preflight.log"); f=$(count FAIL "$LOG/1-preflight.log")
  S1="preflight ${p}/$((p + f))"; [ $rc -eq 0 ] || { S1="$S1 FAIL(rc $rc)"; fail=1; }
fi
# ==== 第320便d の塊(ここから)====
# 第320便d(統括の検証項目 R265 —— 第319便の見落とし): lint の違反を種類で数える(tests/lib-w320d-lintkinds.mjs の印 〔違反の種類 w320d: …〕 を拾う)。
#   刻印の型(targetSha256・meta.scope・「器を走らせ直す」—— 鎖で直る)とそれ以外を分け、**刻印の型以外が 1 件でもあれば ‼ で目立たせる**(判定は変えない —— fail は従来どおり)。
kinds320() {
  [ -f "$1" ] || { echo ""; return; }
  node --input-type=module -e 'import fs from "node:fs"; const L = await import(process.argv[1]); const r = L.summarizeLog(fs.readFileSync(process.argv[2], "utf8"));
if (!r.byLint.length) { console.log(""); process.exit(0); }
const by = r.byLint.filter((z) => z[1] > 0).map((z) => z[0] + " " + z[1]).join("・");
console.log(r.other > 0 ? "・‼ 刻印の型以外の違反 " + r.other + " 件(" + by + ")・刻印の型 " + r.stamp + " 件" : "・刻印の型以外の違反 0 件(刻印の型 " + r.stamp + " 件 —— 鎖で直る)");' "$ROOT/tests/lib-w320d-lintkinds.mjs" "$1" 2>/dev/null || echo ""
}
[ "$S1" = "skip" ] || S1="$S1$(kinds320 "$LOG/1-preflight.log")"
# ==== 第320便d の塊(ここまで)====

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
# ==== 第320便d の塊(ここから)====
# 第320便d(決断事項 AN478・R265): ② に本ごとに分けられる器の名簿(tests/data-w320d-perbook.json)の段の集合と版の照合 —— 統合で段が増えたら
#   node tools/regen-plan.mjs --roster --write で引き直す(QA docs.w320d ① と同じ照合)
node tools/regen-plan.mjs --roster --check >"$LOG/2-roster.log" 2>&1; rro=$?
if [ $rro -eq 0 ]; then S2="$S2・roster ok"
else S2="$S2・roster FAIL(統合で段が増えた —— node tools/regen-plan.mjs --roster --write で引き直す)"; fail=1; fi
# ==== 第320便d の塊(ここまで)====

# ③ 前回失敗項
if [ -z "$FAILED" ] && [ -f tests/out/qa-results-full-beta.json ]; then
  FAILED=$(node -e 'const j=JSON.parse(require("fs").readFileSync("tests/out/qa-results-full-beta.json","utf8"));const src=require("fs").readFileSync("tests/qa.mjs","utf8");console.log([...new Set((j.results||[]).filter(r=>!r.pass).map(r=>r.id))].filter(id=>src.includes("add(\x27"+id+"\x27")).join(" "))' 2>/dev/null || true)
fi
S3="前回失敗 0"
if [ -n "$FAILED" ]; then
  say "③ 前回失敗項 $FAILED → $LOG/3-failed.log"
  # shellcheck disable=SC2086
  node tests/exp-w258c-qapart.mjs $FAILED >"$LOG/3-failed.log" 2>&1; rc=$?
  S3="前回失敗 $(qsum324c "$LOG/3-failed.log" beta "$(echo $FAILED | wc -w)")"; [ $rc -eq 0 ] || { S3="$S3 FAIL"; fail=1; }   # 第324便c: 4 つの数
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
    t3w=$(date +%s)
    node tests/exp-w258c-qapart.mjs $WGOT >"$LOG/3w-wave.log" 2>&1; rc=$?
    S3W="本便 $(echo $WGOT | wc -w) 鍵 $(qsum324c "$LOG/3w-wave.log" beta "$(echo $WGOT | wc -w)")・未統合 ${nmiss}・$(( $(date +%s) - t3w )) s"; [ $rc -eq 0 ] || { S3W="$S3W FAIL"; fail=1; }   # 第324便c: 4 つの数と所要
  else S3W="本便 0/0・未統合 ${nmiss}"
  fi
fi
S3W="$S3W〔${S3W_SCOPE:-全部の便の積み上げ}〕"   # 第324便c: ③′ の範囲

# ④ 常設集合(beta と root)
say "④ 常設集合 beta → $LOG/4-beta.log"
# shellcheck disable=SC2086
node tests/exp-w258c-qapart.mjs $IDS >"$LOG/4-beta.log" 2>&1; rb=$?
S4="beta $(qsum324c "$LOG/4-beta.log" beta "$(echo $IDS | wc -w)")"   # 第324便c: 4 つの数
[ $rb -eq 0 ] || { S4="$S4 FAIL"; fail=1; }
# ==== 第320便d の塊(ここから)====
S4="$S4$(kinds320 "$LOG/4-beta.log")"   # 第320便d(R265): 常設集合の lint.regenScope・lint.provenanceMeta の違反の種類
# ==== 第320便d の塊(ここまで)====
if [ $NOROOT -eq 0 ]; then
  say "④ 常設集合 root → $LOG/4-root.log"
  # shellcheck disable=SC2086
  QA_TARGET=index.html node tests/exp-w258c-qapart.mjs $IDS >"$LOG/4-root.log" 2>&1; rr=$?
  S4="$S4・root $(qsum324c "$LOG/4-root.log" root "$(echo $IDS | wc -w)")"   # 第324便c: 4 つの数
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

# ==== 第324便c の塊(ここから)====
# 第324便c(R281): **部分 QA で覆えない鍵の名簿**(tools/qa-keys.mjs --uncovered —— W5c の範囲・前文に写せない上流の名前・qapart の検索がコメントに当たる・
#   保存のフル QA に行の無い鍵〔何も印字せず飛ばすか対象で走らない〕)。数を ④ の後に出し、名簿は $LOG/uncovered.json(フルゲートが見る鍵)
node tools/qa-keys.mjs --uncovered --json "$LOG/uncovered.json" >"$LOG/uncovered.log" 2>&1 && S4="$S4・$(head -1 "$LOG/uncovered.log" | sed 's/^qa-keys --uncovered[^:]*: //')" || S4="$S4・覆えない鍵の名簿が引けない"
# ==== 第324便c の塊(ここまで)====
T1=$(date +%s)
echo "post-merge-qa: ⓪ $S0 ① $S1 ② $S2 ③ $S3 ③′ $S3W ④ $S4 ⑤ $S5 所要 $((T1 - T0)) s → $([ $fail -eq 0 ] && echo OK || echo FAIL)(ログ $LOG)"
exit $fail

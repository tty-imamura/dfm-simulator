# サンプル状況一覧(v1.45-b1・第279便a)

> **この文書は生成物である —— 手で直さない。** 器 `tests/exp-w279a-samplestatus.mjs` が、原稿 `tests/data-w279a-samplestatus-src.json`(目的・状況・根拠 ID)と正本 `tests/out/calaudit-w249.json`(verdictLedger)・`tests/out/charonwin-w278b.json`(⛄🌨️ の比較値)から作り、`beta/index.html` の生成領域 `sample-status` と正本 `tests/out/samplestatus-w279a.json` を同時に書く。QA `docs.sampleStatus-sync`(この表 ↔ html ↔ 正本)と `preset.statusLedger-sync`(html の較正欄 ↔ calaudit)が照合する。
> 原仮定者の裁定(第69報)「各サンプルについて目的と状況を一覧化する(一覧の情報はサンプルの『概要』で利用する)」への対応。アプリの「説明」タブの 🔖概要(1 行 3 節「目的。状況。較正。」)と状態チップは、この表と同じ宣言から出ている。

## 読み方

- **3 つの欄は別の問いである。** 「保存 QA が通った」「サンプルの目的に達した」「観測との較正が成り立つ」は同じことではない —— 1 つの語に混ぜない。
- **状況**(目的の達成)の語: **達** = 根拠に挙げた保存 QA(`tests/out/qa-results-full-beta.json` で PASS)または完成門が、サンプルの目的そのものを測って通っている。**部分** = 目的の一部だけが測られている(受理・構築・画像回帰だけの本、照合の走行は台帳にあるが門を通った量が全部ではない本を含む)。**未達** = 目的を測る門・量が外れている。**対象外** = 本便では使っていない。根拠 ID の無い「達」は書かない(器が止める)。
- **較正**の語: 較正母集団 37 本は **4 値の台帳の正式語**(合・量限定合・否・保留 —— `tests/out/calaudit-w249.json` の verdictLedger の転記)。⛄🌨️ は **判定保留(量定義不一致)**(母集団の外の表示 —— 第 5 の値ではない)。それ以外は **較正対象外**(観測との合否をこの一覧では書かない)。合否の語は門(3σ)に入る本だけに付く。
- **合わない量と差**: 代表量が 3σ を外れていればその量の差 %(σ 倍)。σ が無い本は、写像が確定していて目安判定が外れている量のうち差が最大のもの(「σ なし」と明記)。どれも無ければ「—」。⛄🌨️ は Buie 2012 に対する**比較値**(門ではない)。
- **精度見込み**: 正本の数から決まる語だけを書く —— 「σ 未接続」(観測の σ が繋がっていない)・「数値未解決」(刻みの収束が門の予算に入っていない)・「写像未確定」(量の対応が決まっていない)・「刻み間差 xσ・刻みでは縮まない」(門で否かつ刻みで動く幅が 1σ 未満)。**刻みを細かくすれば合格に移るという予測は、正本に証拠付きの行が 0 件である**(`predictionEligible` の合計 0)—— この一覧もその予測を書かない。

## 集計

- 内蔵 **141 本**(群 14・うち 0 本の群 3)。
- 状況: **達 81・部分 55・未達 5・対象外 0**。
- 較正: 4 値(合/量限定合/否/保留)**0/2/2/33**(台帳の転記)・判定保留(量定義不一致)**2**・較正対象外 **102**。

| 群 | 本数 | 達 | 部分 | 未達 | 4 値の本 | 判定保留(量定義不一致) | 較正対象外 |
|---|---|---|---|---|---|---|---|
| 🧭 運動と時空 | 5 | 4 | 1 | 0 | 0 | 0 | 5 |
| 🌌 銀河の力学 | 18 | 11 | 6 | 1 | 0 | 0 | 18 |
| 🪐 天体の機構 | 18 | 17 | 1 | 0 | 0 | 0 | 18 |
| ⏱️ 時計と重力 | 5 | 5 | 0 | 0 | 0 | 0 | 5 |
| 💡 光の伝播 | 5 | 4 | 1 | 0 | 0 | 0 | 5 |
| 🌡️ スピンと熱 | 12 | 7 | 5 | 0 | 0 | 0 | 12 |
| 📦 箱宇宙の実験 | 10 | 10 | 0 | 0 | 0 | 0 | 10 |
| 🌗 自転と減光 | 10 | 10 | 0 | 0 | 0 | 0 | 10 |
| ☀️ 現実との照合・太陽系 | 28 | 9 | 17 | 2 | 16 | 2 | 10 |
| ⭐ 現実との照合・連星 | 19 | 0 | 18 | 1 | 18 | 0 | 1 |
| 🔭 実在天体のアナロジー | 11 | 4 | 6 | 1 | 3 | 0 | 8 |
| ⚗️ 法則の実験室 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 🖥️ シミュレーション | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 📏 現実との照合 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## 🧭 運動と時空(5 本)

| 絵文字 | ID | 名前 | 目的 | 状況(達/部分/未達+根拠) | 較正 | 合わない量と差 | 精度見込み |
|---|---|---|---|---|---|---|---|
| ⚾ | `projectile` | 自由落下と放物運動 | 一様重力だけで自由落下と放物運動を見せる | 部分・場の式と配置の検査のみで軌道の定量門は無い(根拠: `field.uniform-gravity`, `projectile.layout`) | 較正対象外 | — | — |
| ⏪ | `echo` | 時間の矢 — 巻き戻る宇宙と巻き戻らない宇宙 | 保存系は巻き戻り摩擦系は戻らないことを比べる | 達・反転後の復帰と摩擦での不復帰が門を通過(根拠: `echo.leapfrog-return`, `echo.friction-noreturn`) | 較正対象外 | — | — |
| 🪗 | `compactForceToy` | コンパクト力の符号 — 近点は前へ回るか後ろへ回るか | 3 候補の追加力が近点を回す向きを比べる | 達・力の符号と整合を純関数とエンジンで確認(根拠: `behavior.compactForce`) | 較正対象外 | — | — |
| 🫂 | `boxBinaryToy` | 箱宇宙と連星 — 等質量だと背景に対する移動が消える | 等質量で共通移動が相対軌道から消えるかを測る | 達・等質量で消え質量差の対照では残る(根拠: `behavior.boxBinary`) | 較正対象外 | — | — |
| 🪟 | `spaceMeshBinaryToy` | 空間メッシュの窓 — メッシュの重力は既にある重力 | メッシュの重力が既存の重力と同じ核かを確かめる | 達・重力は二重計上なし・慣性候補は頂点で退化(根拠: `behavior.spaceMeshForce`) | 較正対象外 | — | — |

## 🌌 銀河の力学(18 本)

| 絵文字 | ID | 名前 | 目的 | 状況(達/部分/未達+根拠) | 較正 | 合わない量と差 | 精度見込み |
|---|---|---|---|---|---|---|---|
| 🌌 | `galaxy` | 銀河の回転曲線 | 中心天体の引きずりで外縁の回転が速まるかを測る | 達・外縁速度比 1.526 が門 >1.04 を通過(根拠: `claim.galaxy-outerboost`) | 較正対象外 | — | — |
| 🎡 | `galaxyStd` | 空間引きずりの基準実験 — 銀河標準 | 重力と引きずりだけで外縁の増速を測る基準 | 達・外縁速度比 1.267 が窓 1.15〜1.4 内(根拠: `claim.galaxystd-outerboost`) | 較正対象外 | — | — |
| 💫 | `galaxyGeo2` | v−u統一測地線の銀河 | v−u 測地線則で外縁の増速を比べる | 達・外縁速度比 1.195 が窓内・クランプ 0(根拠: `claim.galaxygeo2-outerboost`) | 較正対象外 | — | — |
| 🍳 | `galaxyDB` | ディスクとバルジ — 回転支持と分散支持 | 円盤の回転支持とバルジの分散支持を比べる | 達・速度分散の比 2.37 が窓 2.2〜3.0 内(根拠: `claim.galaxydb-contrast`) | 較正対象外 | — | — |
| 🌫️ | `collapse` | 自己重力雲の崩壊と原始星形成 | 自己重力の崩壊と放射冷却の役割を分ける | 達・冷却は温度を下げるが崩壊の速さは変えない(根拠: `behavior.collapse-cooling`) | 較正対象外 | — | — |
| 🥢 | `axisBarStill` | 回転ゼロの棒 — 軸に集まる恒星 | 回転のない円盤で軸への力が棒を作るかを見る | 部分・力の純関数は検査済み・棒の形の門は無い(根拠: `behavior.armBarPure`, `preset.axisBarStill`) | 較正対象外 | — | — |
| 🎏 | `axisBarArms` | 内側の棒と外側の2本腕 — 回転する円盤 | 回転する同じ円盤で内側の棒と外側の腕を見る | 部分・力の純関数は検査済み・腕の形の門は無い(根拠: `behavior.armBarPure`, `preset.axisBarArms`) | 較正対象外 | — | — |
| 🎚️ | `axisBarReach` | 棒の到達長 R_b — 外縁までは届かない | 到達長だけを変えて棒の長さを比べる | 部分・力の純関数は検査済み・長さの門は無い(根拠: `behavior.armBarPure`, `preset.axisBarReach`) | 較正対象外 | — | — |
| 🎠 | `galaxyMeshSpiral` | 銀河の空間メッシュ | 銀河の空間メッシュを局所場と物質線で表す | 達・場の加算・単調性・物質線を純関数で確認(根拠: `behavior.galaxyMesh`) | 較正対象外 | — | — |
| 🪁 | `galaxyMeshSpiralGeoToy` | 銀河の空間メッシュ — geoPN=3 原理コピー(較正ではない) | 🎠 の配置で法則だけ geoPN=3 に替えて比べる | 部分・600 歩の走行と帳簿は確認・形の門は無い(根拠: `behavior.geoToyNeedMesh`, `preset.galaxyGeoToyCopy`) | 較正対象外 | — | — |
| 🎋 | `galaxyMeshSpiralGeoToyLite` | 銀河の空間メッシュ・軽量コピー(円盤 80 粒 — 較正ではない) | 🪁 を円盤 80 粒に軽くした比較用の写し | 部分・準備経路のビット同一は確認・形の門は無い(根拠: `perf.geoToyPrepared`) | 較正対象外 | — | — |
| 🌚 | `galaxyAnalogyBH` | 銀河アナロジー(中心 DFM 版 BH+恒星質量 DR) | 中心 DFM 版 BH と恒星質量ダークローターを力学の質量要素に置いた銀河アナロジー | 部分・中心の自転への応答は 0 でない・回転曲線は数だけで形の門は無い(根拠: `tests/out/analogy-w282d.json`) | 較正対象外 | — | — |
| 🔮 | `shapeToyCluster` | 球状星団トイ — 3D 正規分布の参照モデル(較正ではない) | 指定した 3D 正規分布を保つ参照模型 | 達・形状トイの門を通過(規定分布の模型)(根拠: `docs.shapeToyCriteria`, `tests/out/shapetoy-w274d.json`) | 較正対象外 | — | — |
| 🥏 | `shapeToyDisk` | 腕なし回転円盤トイ — 扁平は σ_z の宣言(較正ではない) | 指定した薄い回転円盤を保つ参照模型 | 未達・形状トイの門で KS 比 1.330 が不合格(根拠: `docs.shapeToyCriteria`, `tests/out/shapetoy-w274d.json`) | 較正対象外 | — | — |
| 🧵 | `shapeToyArm` | 腕単体トイ — 腕の軸に対して正規分布(較正ではない) | 腕の軸に対する正規分布を保つ参照模型 | 達・形状トイの門を通過(規定分布の模型)(根拠: `docs.shapeToyCriteria`, `tests/out/shapetoy-w274d.json`) | 較正対象外 | — | — |
| 🎱 | `shapeToyClusterCore` | 球状星団トイ(中心天体つき)— 中心スピンが束ねる構成仮説(較正ではない) | 中心スピンに依存する力学で星団を束ねる | 達・Core 力学の門を通過(RMS 偏り 0.0101)(根拠: `docs.coreFieldCriteria`, `tests/out/corefield-w276d.json`) | 較正対象外 | — | — |
| 📀 | `shapeToyDiskCore` | 腕なし回転円盤トイ(中心天体つき)— 薄さも回転も中心スピンの帰結(較正ではない) | 中心スピンから薄さと円盤の回転を作る | 達・Core 力学の門を通過(逆行率 0.0352)(根拠: `docs.coreFieldCriteria`, `tests/out/corefield-w276d.json`) | 較正対象外 | — | — |
| 🧹 | `shapeToyArmCore` | 棒トイ(中心天体つき)— 面内の自転軸に沿って伸びる(較正ではない) | 面内の自転軸に沿った棒を作る | 達・Core 力学の門を通過(RMS 偏り 0.0060)(根拠: `docs.coreFieldCriteria`, `tests/out/corefield-w276d.json`) | 較正対象外 | — | — |

## 🪐 天体の機構(18 本)

| 絵文字 | ID | 名前 | 目的 | 状況(達/部分/未達+根拠) | 較正 | 合わない量と差 | 精度見込み |
|---|---|---|---|---|---|---|---|
| 🌍 | `earthMoon` | 地球と月 | 同期自転する月の公転を見せる誇張模型 | 達・距離 ±2%・同期誤差 0.10°/周が門内(根拠: `behavior.earthMoon`) | 較正対象外 | — | — |
| 🌕 | `earthMoonFree` | 地球と月(自由二体・物理比) | どちらも固定しない地球–月の二体を保つ | 達・10 周で距離 ±1%・重心移動が門内(根拠: `behavior.earthMoonFree`) | 較正対象外 | — | — |
| ☿ | `mercury` | 水星の近日点前進 — 測地線1PN | 測地線 1PN の有無で近日点前進を比べる | 達・基線差引の比 2.98 が理論 3±0.6 内(根拠: `behavior.mercury-builtin`) | 較正対象外 | — | — |
| 🪐 | `saturn` | 土星の環(実験) | 氷粒の環が長時間残るかを測る | 達・帯内 97.1%・落下 0.4% が門内(根拠: `behavior.saturnExp`) | 較正対象外 | — | — |
| 🎯 | `saturnLayered` | 土星の環(主星2層) | 主星のコアと殻の差動が環に効くかを見る | 達・等価性と差動コアの効果を検査で確認(根拠: `core.twolayer`) | 較正対象外 | — | — |
| ⭐ | `binary` | 連星系と周連星円盤 | 連星の間隔と周連星円盤を保つ | 達・間隔 122.9・円盤 240/240 残存が門内(根拠: `behavior.binary`) | 較正対象外 | — | — |
| ♾️ | `fig8` | 三体問題 — 8の字軌道 | 等質量三体の 8 の字周期軌道を見せる | 部分・画像回帰のみで軌道の定量門は無い(根拠: `shot.regress-fig8`, `preset.fig8`) | 較正対象外 | — | — |
| 💥 | `counterring` | 順行・逆行リングの衝突 | 逆向きに回る環どうしの摩擦を比べる | 達・摩擦あり 0.74・なし 0 の対照(根拠: `new.counterring`) | 較正対象外 | — | — |
| 🌪️ | `spinup` | 収縮とスピン加速 | 閉じた系で収縮とともにスピンが上がるかを見る | 達・収縮 3.02 倍で ω 8.46 倍・帳簿は閉じる(根拠: `behavior.spinup`) | 較正対象外 | — | — |
| 🏮 | `pulsarSolo` | パルサー灯台(単体)— 傾いた軸と運動学の時計 | 傾いた軸の灯台と運動学の時計を見せる | 達・位相の恒等と軸の傾きを検査で確認(根拠: `behavior.templates229`) | 較正対象外 | — | — |
| 🎇 | `supernovaCore` | 超新星 — 1つの赤色巨星が多層の外殻を吹き飛ばし、時計つきの核が残る | 1 つの星の殻放出と時計つきの核の残存を見せる | 達・分割放出と帳簿の閉じを検査で確認(根拠: `behavior.supernova`) | 較正対象外 | — | — |
| ⚪ | `whiteDwarfDFM` | 白色矮星 — 赤色巨星の外殻が徐々に剥がれ、育ったコアが残る(DFM版) | 殻が繰り返し剥がれて育ったコアが残る | 達・4 回の放出と帳簿の閉じを検査で確認(根拠: `behavior.shedRepeat`) | 較正対象外 | — | — |
| 🔘 | `whiteDwarfBareDFM` | 裸のコア — 最後の殻が剥がれて Mc=M の終端状態になる(DFM版・⚪ の variant) | 最後の殻が剥がれ Mc=M の終端を作る | 達・終端と結合エネルギーの台帳を検査で確認(根拠: `behavior.coreTerminal`) | 較正対象外 | — | — |
| 🎆 | `envelopeShedDFM` | エンベロープの分割放出 — 限界回転のコアが殻をガスへ割って出す(DFM版) | 限界回転のコアが殻を粒へ割って出す | 達・1 回の放出と帳簿の閉じを検査で確認(根拠: `behavior.envelopeShed`) | 較正対象外 | — | — |
| 🐮 | `lfbotTrap` | 閉じ込めた光の解放 — 減光で溜めた自光をコアの崩壊で放つ(トイ仮説) | 減光で溜めた光をコアの崩壊で放つトイ | 達・光の口座の保存と対照 4 本を検査で確認(根拠: `behavior.lightTrapLedger`) | 較正対象外 | — | — |
| 🧅 | `layeredCoreDFM` | 親子コア — 観測半径は殻・質量はコア(二層天体の原理) | 観測半径は殻・質量はコアに分ける二層天体 | 達・検証器と球殻定理の検査を通過(根拠: `behavior.bodyLayers`) | 較正対象外 | — | — |
| ⚙️ | `spinDipoleBinary` | スピン双極子の連星 — 自転が押し合うと近点が逆行する(玩具) | スピン双極子の力で近点が逆行するかを見る | 達・近点移動 −0.980°/周が解析値の 0.994 倍(根拠: `behavior.spinDipole`) | 較正対象外 | — | — |
| 🌬️ | `gasCohSurface` | 気体の殻の表面随伴 — 外殻が気体だと引きずりは弱い | 気体の殻で表面の引きずりが弱まるかを見る | 達・表面随伴の比が gasCoh に一致(根拠: `behavior.gasCohSurface`) | 較正対象外 | — | — |

## ⏱️ 時計と重力(5 本)

| 絵文字 | ID | 名前 | 目的 | 状況(達/部分/未達+根拠) | 較正 | 合わない量と差 | 精度見込み |
|---|---|---|---|---|---|---|---|
| ⏱️ | `gclock` | 重力による時計の遅れ | 重力の強さだけを変えて時計の遅れを比べる | 達・τ/t と解析値の差 1.1×10⁻⁵(根拠: `new.gclock`) | 較正対象外 | — | — |
| 🛰️ | `grcal` | 弱場GR較正 — GPS・光・シャピロ | 時計・光の偏向・遅延を 1 本の弱場則で出す | 達・式の値 5 つが事前登録窓 ±1% 内(縮尺模型)(根拠: `behavior.grcal3`, `grcal.clocks`) | 較正対象外 | — | — |
| 🕰️ | `grcalGps` | GPS 時計差 — 重力項と速度項の分解 | GPS の時計差を重力項と速度項に分ける | 達・式の値 正味 38.50 μs/日が窓 ±1% 内(根拠: `behavior.grcal3`) | 較正対象外 | — | — |
| 🌟 | `grcalLight` | 太陽縁の光偏向 — 1.75″ | 太陽縁の光の偏向を同じ場から出す | 達・式の値 1.7509″ が窓 ±1% 内(根拠: `behavior.grcal3`) | 較正対象外 | — | — |
| ⏲️ | `grcalShapiro` | シャピロ遅延 — 太陽の近くを往復する信号 | 太陽の近くを往復する信号の遅れを見せる | 達・式の値 281.0 μs が窓 ±1% 内(根拠: `behavior.grcal3`) | 較正対象外 | — | — |

## 💡 光の伝播(5 本)

| 絵文字 | ID | 名前 | 目的 | 状況(達/部分/未達+根拠) | 較正 | 合わない量と差 | 精度見込み |
|---|---|---|---|---|---|---|---|
| 💡 | `lensing` | 重力レンズと光子捕捉 | 重力場で光線が曲がり捕まることを見せる | 部分・画像回帰と光速宣言の検査のみ(根拠: `shot.regress-lensing`, `light.canonical-builtins`) | 較正対象外 | — | — |
| 🌗 | `spinlens` | 回る星のレンズ — 非対称湾曲 | 回る星の場で光の曲がりが非対称になるかを見る | 達・非対称度 0.678・kF0 対照で 0(根拠: `spinlens.kframe-control`) | 較正対象外 | — | — |
| 🔭 | `blens` | 連星重力レンズ | 上下の連星で光線束が曲がる向きを見る | 達・上下で偏向の符号が反転し門を通過(根拠: `behavior.blens`) | 較正対象外 | — | — |
| 🌆 | `reddening` | 暗黒雲の赤化 — 体積吸収と波長依存 | 波長ごとの吸収で雲越しの光が赤へ寄るかを見る | 達・青/赤の比 0.0154 が窓内・用量反応は一定(根拠: `claim.reddening`) | 較正対象外 | — | — |
| 🪞 | `mmPhaseToy` | 2腕の往復位相 — 正対照が先 | 2 本の腕を往復した光の位相差を正対照から測る | 達・正対照の位相差が解析式どおり(根拠: `behavior.mmPhase`) | 較正対象外 | — | — |

## 🌡️ スピンと熱(12 本)

| 絵文字 | ID | 名前 | 目的 | 状況(達/部分/未達+根拠) | 較正 | 合わない量と差 | 精度見込み |
|---|---|---|---|---|---|---|---|
| 🔥 | `gas` | 気体の熱平衡 | 温度差のある気体が熱平衡へ向かうかを見る | 達・温度分散の比 0.647 が門 <0.75 を通過(根拠: `behavior.gas`) | 較正対象外 | — | — |
| 🎈 | `pressure` | 熱の圧力 — 熱は押し広げる | 熱の斥力が周りの気体を押し広げるかを測る | 達・半径比 1.18・熱斥力 0 の対照 1.02(根拠: `behavior.pressure`) | 較正対象外 | — | — |
| 📏 | `conduction` | 熱伝導 — 近いほど速く伝わる | 接触なしの粒の列で熱が伝わるかを見る | 達・距離に応じた温度の順と減衰比が門内(根拠: `behavior.conduction`) | 較正対象外 | — | — |
| 🛷 | `frictionHeat` | 摩擦熱 — 運動が熱に変わる | 摩擦で運動が熱へ移ることを見せる | 部分・受理と構築の検査のみで熱移送の門は無い(根拠: `preset.frictionHeat`) | 較正対象外 | — | — |
| 🌈 | `coolrace` | 放射冷却 — 高温ほど速い | 高温ほど速く冷えることを比べる | 達・冷却速度比 15.8/15.1(理論 16)(根拠: `new.coolrace`) | 較正対象外 | — | — |
| ♨️ | `convection` | 加熱の対流 — 伝熱する箱 | 壁からの加熱で対流を保つ | 達・循環 17.9・熱流の収支差 0.5% が門内(根拠: `behavior.convection`) | 較正対象外 | — | — |
| 🧪 | `buoyancy` | 重力分離と浮力 | 重力場で重い粒と軽い粒が分かれるかを見る | 達・平均高さの差 163.8 が門 >20 を通過(根拠: `behavior.buoyancy`) | 較正対象外 | — | — |
| ☕ | `cooling` | 冷めるお茶 — 壁への熱伝導 | 冷たい壁へ熱が逃げていく様子を見せる | 部分・受理と構築の検査のみで冷却の門は無い(根拠: `preset.cooling`) | 較正対象外 | — | — |
| 🧬 | `emergent` | 三態の創発 — 結合の予算 | 結合の予算だけで三態を作る | 部分・多 seed の門は通過・摂動回復は通らず E1(根拠: `behavior.phase-multiseed`) | 較正対象外 | — | — |
| 🧊 | `emergent2` | 格子も分子も — 予算×角度 | 結合の予算と角度で蜂の巣の格子を作る | 部分・多 seed の門は通過・摂動回復は通らず E1(根拠: `behavior.phase-multiseed`) | 較正対象外 | — | — |
| ⛓️ | `chain2` | 鎖の創発 — 予算2×角度180° | 予算 2 と理想角 180° で鎖を作る | 部分・多 seed の門は通過・摂動回復は通らず E1(根拠: `behavior.phase-multiseed`) | 較正対象外 | — | — |
| ♻️ | `chaincycle` | 温度循環 — 鎖の凍結と解離 | 壁温だけで鎖の凍結と解離を往復させる | 達・凍結末と解離末の窓を通過(E1)(根拠: `claim.chaincycle`, `behavior.phase-multiseed`) | 較正対象外 | — | — |

## 📦 箱宇宙の実験(10 本)

| 絵文字 | ID | 名前 | 目的 | 状況(達/部分/未達+根拠) | 較正 | 合わない量と差 | 精度見込み |
|---|---|---|---|---|---|---|---|
| 📦 | `boxtrans` | 箱宇宙 — 並進する箱 | 並進する箱の中で共動と時計を比べる | 達・共動 τ/t 0.9994・固有運動 0.9881 が門内(根拠: `box.trans-clocks`) | 較正対象外 | — | — |
| 🌀 | `boxrot` | 箱宇宙 — 回る箱と空間の支え | 回る壁が軌道を支えるかを kF で比べる | 達・半径比 kF1 0.988・kF0 3.71(外部駆動)(根拠: `box.rot-support`) | 較正対象外 | — | — |
| 📈 | `boxexpand` | 箱宇宙 — 膨張する箱(質点リング) | 膨張させた壁に内側がどこまで追随するかを測る | 達・追随は a でなく √a(比 0.9996)(根拠: `box.expand-sqrt`) | 較正対象外 | — | — |
| 🫧 | `boxcomoving` | 箱宇宙 — UniverseBoxの完全共動と膨張時計 | 連続背景で完全共動と膨張の時計を見せる | 達・赤方偏移が規定 a(t) と相対 1e-6 未満(根拠: `box.redshift`) | 較正対象外 | — | — |
| 🪢 | `boxbound` | 箱宇宙 — 束縛系は膨張に逆らえるか | 膨張の中で連星の束縛が残るかを測る | 達・宣言した膨張率と時間窓の門を通過(根拠: `behavior.boxbound`) | 較正対象外 | — | — |
| 🫁 | `boxbreath` | 箱宇宙 — 呼吸する宇宙と時計 | 膨張と収縮を 1 周期戻して変位を測る | 達・1 周期後 RMS 0.049 が門 <1 を通過(根拠: `box.breath-return`) | 較正対象外 | — | — |
| 🔦 | `boxredshift` | 箱宇宙 — 光の赤方偏移(A・B・C) | 共動する 3 点の間で光の赤方偏移を比べる | 達・z_A 2.93・z_B 0.958 が窓内(根拠: `box.photon-abc`) | 較正対象外 | — | — |
| 🧭 | `probeH` | 箱宇宙 — ２つのH推定器(ハッブルテンション類似) | 幾何と速度の 2 つの H 推定器の差を見せる | 達・2 つの読みが解析値と 1% 内(根拠: `behavior.probeH`) | 較正対象外 | — | — |
| 🕊️ | `freebox` | 箱宇宙 — 自由な箱(膨張の原因) | 自由な壁の重力と圧力で膨張を作る | 達・4 象限対照で加速の源は圧力(根拠: `freebox.quadrants`) | 較正対象外 | — | — |
| 🕸️ | `cosmicweb` | 箱宇宙 — 膨張と自己重力の綱引き(コズミックウェブ類似) | 膨張と自己重力の綱引きで疎密を作る | 達・δ² 5.4 倍・膨張なし対照で成長が大(根拠: `behavior.cosmicweb`) | 較正対象外 | — | — |

## 🌗 自転と減光(10 本)

| 絵文字 | ID | 名前 | 目的 | 状況(達/部分/未達+根拠) | 較正 | 合わない量と差 | 精度見込み |
|---|---|---|---|---|---|---|---|
| 🕶️ | `darkrotor` | ダークローターの銀河 | 暗いローターが作る腕の強さと減光を測る | 達・腕の強さ・保持・減光が長時間の門内(根拠: `behavior.darkrotorLong`) | 較正対象外 | — | — |
| 🕳️ | `rotorSolo` | ダークローター(単体) | 単体ローターの掻き出しと減光を測る | 達・掻き出し・非脱出・帳簿が門内(根拠: `behavior.rotorSolo`) | 較正対象外 | — | — |
| 🌑 | `nebulaRotor` | ローター星雲 — 暗黒星雲と散光星雲 | ローター群で暗いコアと明るい外層を作る | 達・明暗のコントラスト 11.5 倍が門 >10(根拠: `claim.nebularotor-contrast`) | 較正対象外 | — | — |
| 🐚 | `nebulaShell` | 重殻ローター星雲 — 束縛と暗さの両立 | 重い殻で束縛と暗さを両立させる | 達・暗さ 0.962・保持 1.000 が窓内(根拠: `claim.nebulashell-stress`) | 較正対象外 | — | — |
| ⏳ | `nebulaBipolar` | 双極星雲 — 暗黒トーラスと極方向ローブ | 暗い赤道帯と明るい極方向の形を作る | 達・3 seed で極方向比の最小 0.614 が窓内(根拠: `claim.nebulabipolar-multiseed`) | 較正対象外 | — | — |
| ⚫ | `bhCore` | DFM版ブラックホール — 自由な5層の中心 | 自由な多層の中心のスピン移送と減光を測る | 達・外縁増強 1.506・自走・減光が門内(根拠: `claim.bhcore-selfdrive`) | 較正対象外 | — | — |
| 🪩 | `bhCoreTilt` | DFM版ブラックホール(横倒し)— エッジオンの暗い中心 | 中心コアの軸を横倒しにした暗い中心を見せる | 達・横倒しでも減光 1.000・Jz は機械ゼロ(根拠: `behavior.templates229`) | 較正対象外 | — | — |
| 🪜 | `massLadder` | 隠れ質量ラダー — 暗い中心の力学質量 | 暗い中心の力学質量を 3 段で比べる | 達・質量比 1.96・3.84 が窓内(根拠: `claim.massladder`) | 較正対象外 | — | — |
| 🥚 | `selfRotor` | 自己形成ダークローター — 種から育つ暗い中心 | 一様な雲から暗く回る中心が育つかを見る | 達・4 seed で質量比の最小 18.3%・対照の 33 倍(根拠: `behavior.selfrotor-multiseed`) | 較正対象外 | — | — |
| 🌱 | `starSeed` | 星の種ローター — 圧縮とパワーボール | コアの圧縮・軸仕事と減光の経路を測る | 達・Ω 比 107.9・減光 0.9988 が窓内(根拠: `claim.starseed-powerball`) | 較正対象外 | — | — |

## ☀️ 現実との照合・太陽系(28 本)

| 絵文字 | ID | 名前 | 目的 | 状況(達/部分/未達+根拠) | 較正 | 合わない量と差 | 精度見込み |
|---|---|---|---|---|---|---|---|
| 🌙 | `earthMoonReal` | 地球と月(実単位)— 恒星月 27.32日 | 実単位の地球と月を kF0 で照合する | 部分・照合の走行は台帳に記帳(根拠: `tests/out/calaudit-w249.json`, `docs.calibration-verdict-sync`) | 保留 | — | σ 未接続 |
| 🌘 | `earthMoonRealKF1` | 地球と月(実単位・kFrame=1)— 近点回転 8.85年の較正再現 | 月の周期と近点回転を kF1 で照合する | 部分・照合の走行は台帳に記帳・🧲 との差は重みと初速の両方(根拠: `tests/out/calaudit-w249.json`, `docs.calibration-verdict-sync`, `tests/out/emgrid-w280b.json`) | 保留 | 近点移動 +12.7%(σ なし) | σ 未接続 |
| ⭕ | `emAuditNewton` | 地球と月・機構判別A(二体ニュートン)— 閉じた楕円 | 純二体では月の近点回転が出ないことを示す | 達・陰性対照として Δϖ が窓内(根拠: `behavior.emAudit`) | 較正対象外 | — | — |
| 🧲 | `emAuditDFM` | 地球と月・機構判別B(二体DFM較正)— 8.85年を別機構で | 月の較正窓の一致が長期に続くかを調べる | 達・長い窓で 20.77 年へずれることを検出・🌘 との差は重みと初速(根拠: `behavior.emAudit`, `tests/out/calaudit-w249.json`, `tests/out/emgrid-w280b.json`) | 保留 | 近点移動 +23.1%(σ なし) | σ 未接続 |
| 🔆 | `emAuditSolar` | 地球と月・機構判別C(太陽+地球+月の三体)— 較正なしの太陽摂動 | 太陽摂動だけで月の近点回転を出す | 部分・向きは前進・年数は記録のみ(根拠: `behavior.emAudit`, `tests/out/calaudit-w249.json`) | 保留 | — | σ 未接続 |
| 🌓 | `earthMoonDiagOne` | 地球と月(表裏核の診断)— 同じ初期状態・経路だけ置換 | 🌘 の初期状態のまま引きずりを表裏核の座標変換へ置き換える診断 | 達・近点移動 1.07×10⁻³ °/周・c² 抑制なしを記帳(根拠: `tests/out/emgrid-w280b.json`, `tests/out/spherekernel-w280b.json`) | 較正対象外 | — | — |
| 📶 | `qLockRadialAudit` | qLock 半径方向監査 — 参照点は LT 級・その外では r⁻³ を捨てる | qLock が参照軌道の外で崩れるかを監査する | 達・内側 2 点で逆行・落ち方 5.49 倍を検出(根拠: `behavior.qlockRadial`) | 較正対象外 | — | — |
| 📐 | `qLockRadialAuditQ3` | qLock 半径方向監査・対照(q=3)— r⁻³ 則そのものの物差し | q=3 の対照で r⁻³ 則の物差しを示す | 達・q=3 対照は qLock の 8.5 倍(門 >5)(根拠: `behavior.qlockRadial`) | 較正対象外 | — | — |
| ☄️ | `mercuryReal` | 水星(実単位)— 近日点前進(43.0″/世紀は RL 勾配・600 公転・λ_PN 差引き) | 水星の近日点前進を kF0 で照合する | 部分・不足を軟化 70.3%・刻み 29.0%・入力 0.63% に分解(根拠: `tests/out/calaudit-w249.json`, `tests/out/mercury-w280a.json`, `docs.calibration-verdict-sync`) | 保留 | 近点移動 −21.7%(6.2×10³σ) | 数値未解決 |
| 🔁 | `mercuryGeoToy3` | 水星 — geoPN=3 契約の零試験(一様な座標変換・較正ではない) | 一様な座標変換で近点移動が変わらないかを geoPN=3 契約で確かめる | 達・u=V の近点移動は ☄️ と刻みの幅の 10⁻⁴ 未満で一致(根拠: `tests/out/geo3-w280c.json`) | 較正対象外 | — | — |
| 🪨 | `mercuryRealKF1` | 水星(実単位・kFrame=1)— 共通補正(43.0″/世紀は RL 勾配・600 公転・λ_PN 差引き) | 水星の近日点前進を kF1 で照合する | 部分・☄️ との差 −2.856×10⁻⁸ °/周 は太陽自転の引きずり(根拠: `tests/out/calaudit-w249.json`, `tests/out/mercury-w280a.json`, `docs.calibration-verdict-sync`) | 保留 | 近点移動 −21.8%(6.3×10³σ) | 数値未解決 |
| 🌞 | `solarInner` | 太陽系 — 内惑星(実単位) | 内惑星 4 つの周期を実単位で照合する | 部分・照合の走行は台帳に記帳(根拠: `tests/out/calaudit-w249.json`, `behavior.solarInner`) | 保留 | — | σ 未接続 |
| 🟠 | `jupiterGalilean` | 木星とガリレオ衛星(実単位)— 規則を再フィットしない hold-out | 木星 4 衛星へ規則を再 fit せず当てる | 部分・照合の走行は台帳に記帳(根拠: `tests/out/calaudit-w249.json`, `docs.calibration-verdict-sync`) | 保留 | — | σ 未接続 |
| 🌇 | `venusReal` | 太陽と金星(実単位)— 自由中心の二体転写 | 自由中心の太陽–金星を実単位で照合する | 部分・照合の走行は台帳に記帳(根拠: `tests/out/calaudit-w249.json`, `behavior.venusReal`) | 保留 | — | σ 未接続 |
| 🥔 | `marsMoonsReal` | 火星とフォボス・ダイモス(実単位)— テスト粒子転写 | 火星の 2 衛星を実単位で照合する | 部分・照合の走行は台帳に記帳(根拠: `tests/out/calaudit-w249.json`, `behavior.marsMoonsReal`) | 保留 | — | σ 未接続 |
| ❄️ | `plutoCharonReal` | 冥王星とカロン(実単位)— 重心が外にある二体 | 旧入力の冥王星–カロンを照合する | 未達・代表量が門の外・残差を要因の鎖で分解(根拠: `tests/out/calaudit-w249.json`, `behavior.plutoCharonReal`, `tests/out/charoninput-w280d.json`) | 否 | 周期 +0.00138%(294σ) | 刻み間差 1×10⁻³σ・刻みでは縮まない・数値未解決・写像未確定 |
| ⛄ | `plutoCharonDFM` | 冥王星とカロン(同一観測解)— 相対すべりの零条件を持つ DFM 版 | 同一観測解の二体に零条件つき引きずり則を載せる | 部分・中点法の収束と 2 欄は確認・則の寄与は同期の定義に由来(根拠: `docs.charonTwoColumns`, `behavior.plutoCharonDFM`, `tests/out/charonwin-w278b.json`, `tests/out/charoninput-w280d.json`) | 判定保留(量定義不一致) | 比較値 +31.6 s(Buie 2012 比・門ではない) | 量の定義が揃うまで門に入れない |
| 🌨️ | `plutoCharonKF0Control` | 冥王星とカロン(同一観測解)— kF0 対照(引きずり則なし) | ⛄ と同じ入力で則だけを外した kF0 対照 | 達・則なしで定常・⛄ との差 1.37 s を記帳(根拠: `docs.charonTwoColumns`, `behavior.plutoCharonDFM`, `tests/out/charonwin-w278b.json`) | 判定保留(量定義不一致) | 比較値 +30.2 s(Buie 2012 比・門ではない) | 量の定義が揃うまで門に入れない |
| 🥶 | `plutoCharonDiagInput` | 冥王星とカロン(入力を整えた二体)— 観測入力 kF0 対照 | ❄️ の入力の丸めと軟化を外した kF0 診断コピー | 達・要因の鎖と同一定義の表を記帳(根拠: `tests/out/charoninput-w280d.json`) | 較正対象外 | — | — |
| ☃️ | `plutoCharonSyncZero` | 冥王星とカロン(厳密同期円)— 相対すべり則の零試験 | 厳密同期円で相対すべり則の零条件を走行中も試す | 部分・初期 1 歩は厳密に 0・走行中は丸め級の熱が残る(根拠: `tests/out/charoninput-w280d.json`) | 較正対象外 | — | — |
| 🌒 | `charonGeoToy3` | 冥王星とカロン — geoPN=3 契約の診断コピー(太陽の背景・mutual:0・較正ではない) | 太陽の背景を置いた geoPN=3 契約の周期を kF0 と並べる | 部分・1PN が読む速度で差が分かれる(ẋ は kF0 と 10⁻⁵ s 未満・v は +5.6×10⁻⁴ s)(根拠: `tests/out/geo3-w280c.json`) | 較正対象外 | — | — |
| 💠 | `uranusReal` | 天王星の環と主要5衛星(実単位) | 天王星の環と 5 衛星を実単位で照合する | 部分・照合の走行は台帳に記帳(根拠: `tests/out/calaudit-w249.json`, `behavior.uranusReal`) | 保留 | — | σ 未接続 |
| 🌊 | `neptuneReal` | 海王星とトリトン(実単位)— 逆行衛星の二体 | 逆行衛星トリトンを実単位で照合する | 部分・照合の走行は台帳に記帳(根拠: `tests/out/calaudit-w249.json`, `behavior.neptuneReal`) | 保留 | — | σ 未接続 |
| 📡 | `saturnZonalD68` | 土星の近点移動(実単位・D68 — 帯状重力の照合) | 帯状重力係数で D68 の近点移動を照合する | 未達・代表量が門の外(根拠: `tests/out/calaudit-w249.json`, `docs.calibration-verdict-sync`) | 否 | 近点移動 −0.306%(14.6σ) | 刻み間差 4×10⁻³σ・刻みでは縮まない |
| 🧷 | `saturnD68Consistent` | 土星 D68 の近点移動 — 整合した初速の診断コピー(e*=0.001) | 📡 の差を同じ窓で初速の幾何と他の要因に分ける | 達・同じ抽出器・同じ窓で差 +42.66 deg/yr のうち初速が +42.23(根拠: `tests/out/d68-w280e.json`) | 較正対象外 | — | — |
| 📎 | `saturnD68ObsOrbit` | 土星 D68 の近点移動 — 観測定義の軌道の診断コピー(ae=25 km) | 観測の a と ae の定義で置いた D68 の近点移動を測る | 部分・同じ窓で測定済み・a と ae と ϖ̇ の同一元期の組は未確認(根拠: `tests/out/d68-w280e.json`) | 較正対象外 | — | — |
| 💍 | `saturnRingReal` | 土星の環(実単位)— 見えないのが正しい | 実単位の土星の環を kF0 で照合する | 部分・照合の走行は台帳に記帳(根拠: `tests/out/calaudit-w249.json`, `docs.calibration-verdict-sync`) | 保留 | — | σ 未接続 |
| 💿 | `saturnRingRealKF1` | 土星の環(実単位・kFrame=1)— 表面随伴と自動算出q | 土星の環を kF1 と自動算出 q で照合する | 部分・照合の走行は台帳に記帳(根拠: `tests/out/calaudit-w249.json`, `docs.calibration-verdict-sync`) | 保留 | — | σ 未接続 |

## ⭐ 現実との照合・連星(19 本)

| 絵文字 | ID | 名前 | 目的 | 状況(達/部分/未達+根拠) | 較正 | 合わない量と差 | 精度見込み |
|---|---|---|---|---|---|---|---|
| ✨ | `alphaCenAB` | αケンタウリAB(実単位)— 恒星連星の二体 | α Cen AB を kF0 で照合する | 部分・照合の走行は台帳に記帳(根拠: `tests/out/calaudit-w249.json`, `behavior.alphaCenAB`) | 量限定合 | — | 写像未確定 |
| ✴️ | `alphaCenABDFM` | αケンタウリAB(DFM版)— pull 重み・観測質量のまま kF1 | 観測質量のまま kF1 を α Cen へ当てる | 部分・照合の走行は台帳に記帳(根拠: `tests/out/calaudit-w249.json`, `docs.calibration-verdict-sync`) | 保留 | 周期 −0.597%(25σ) | 数値未解決・写像未確定 |
| 🌟 | `siriusAB` | シリウスAB(実単位)— 白色矮星との連星 | シリウス AB を kF0 で照合する | 部分・照合の走行は台帳に記帳(根拠: `tests/out/calaudit-w249.json`, `behavior.siriusAB`) | 量限定合 | — | 写像未確定 |
| 💫 | `siriusABDFM` | シリウスAB(DFM版)— pull 重み・観測質量のまま kF1 | 観測質量のまま kF1 をシリウスへ当てる | 部分・照合の走行は台帳に記帳(根拠: `tests/out/calaudit-w249.json`, `docs.calibration-verdict-sync`) | 保留 | 周期 −1.77%(206σ) | 数値未解決・写像未確定 |
| 📻 | `psrDoubleAB` | 二重パルサー J0737−3039A/B(実単位)— 2.45時間の中性子星連星 | 二重パルサーを kF0 で照合する | 部分・照合の走行は台帳に記帳(根拠: `tests/out/calaudit-w249.json`, `docs.calibration-verdict-sync`) | 保留 | 周期 +0.00269%(9.5×10⁵σ) | 数値未解決・写像未確定 |
| ⚡ | `psrDoubleABDFM` | 二重パルサー J0737−3039A/B(DFM版)— pull 重み・kF1 質量較正(f≈2) | 二重パルサーを質量補正と kF1 で照合 | 部分・照合の走行は台帳に記帳(根拠: `tests/out/calaudit-w249.json`, `docs.calibration-verdict-sync`) | 保留 | 周期 −1.10%(4.9×10⁷σ) | 数値未解決・写像未確定 |
| 🩻 | `psrDoubleABGeoToy` | 二重パルサー J0737−3039A/B — geoPN=3 診断(f=1・較正候補ではない) | 観測質量のまま geoPN=3 則を当てる診断 | 未達・周期 +0.0897%・掃引で観測をまたがない(根拠: `tests/out/geotoy-w262a.json`, `behavior.geoToyOverlay`) | 較正対象外 | — | — |
| 🧿 | `psrDoubleABSpinCal` | 二重パルサー J0737−3039A/B(スピン–スピン較正候補)— f と λ を回した比較 variant | f と λ を回した較正候補を比べる | 部分・照合の走行は台帳に記帳(根拠: `tests/out/calaudit-w249.json`, `docs.calibration-verdict-sync`) | 保留 | 近点移動 +2.42%(3.2×10⁴σ) | 数値未解決 |
| 🧮 | `psrJ1757DFM` | PSR J1757−1854(DFM版・hold-out)— ⚡ の処方をそのまま当てた中性子星連星2例目 | ⚡ の処方を J1757 へ当てる | 部分・照合の走行は台帳に記帳(根拠: `tests/out/calaudit-w249.json`, `docs.calibration-verdict-sync`) | 保留 | 近点移動 5.3×10⁴σ(差の%は正本に無い) | 数値未解決・写像未確定 |
| 🩺 | `psrJ1946DFM` | PSR J1946+2052(DFM版・hold-out)— 銀河系で最短周期の中性子星連星 | ⚡ の処方を J1946 へ当てる | 部分・照合の走行は台帳に記帳(根拠: `tests/out/calaudit-w249.json`, `docs.calibration-verdict-sync`) | 保留 | 近点移動 6.6×10⁴σ(差の%は正本に無い) | 数値未解決・写像未確定 |
| 🪶 | `psrDoubleABPN` | 二重パルサー J0737−3039A/B(NS 応答候補 λ_PN=1/f)— 1PN の強さだけを観測質量へ戻す | 1PN の強さを 1/f で戻す応答候補 | 部分・照合の走行は台帳に記帳(根拠: `tests/out/calaudit-w249.json`, `docs.calibration-verdict-sync`) | 保留 | 近点移動 +3.37%(4.4×10⁴σ) | 数値未解決・写像未確定 |
| 🪃 | `psrJ1757PN` | PSR J1757−1854(NS 応答候補 λ_PN=1/f)— ⚡ の処方に 1/f を足して当てた 2 例目 | 1/f の応答候補を J1757 へ当てる | 部分・照合の走行は台帳に記帳(根拠: `tests/out/calaudit-w249.json`, `docs.calibration-verdict-sync`) | 保留 | 近点移動 +1.70%(899σ) | 数値未解決・写像未確定 |
| 🪀 | `psrJ1946PN` | PSR J1946+2052(NS 応答候補 λ_PN=1/f)— ⚡ の処方に 1/f を足して当てた 3 例目 | 1/f の応答候補を J1946 へ当てる | 部分・照合の走行は台帳に記帳(根拠: `tests/out/calaudit-w249.json`, `docs.calibration-verdict-sync`) | 保留 | 近点移動 +7.53%(4.9×10³σ) | 数値未解決・写像未確定 |
| 🪝 | `psrDoubleABCF` | 二重パルサー J0737−3039A/B(コンパクト力 案K)— χ ゲート付き質量電流結合 | 速度依存の追加力(案K)を試す | 部分・照合の走行は台帳に記帳(根拠: `tests/out/calaudit-w249.json`, `docs.calibration-verdict-sync`) | 保留 | 近点移動 +2.61%(3.6×10³σ) | 数値未解決 |
| 🪄 | `psrJ1757CF` | PSR J1757−1854(コンパクト力 案K)— ⚡ で凍結した κ をそのまま流した 2 例目 | 凍結した κ を J1757 へ流す | 部分・照合の走行は台帳に記帳(根拠: `tests/out/calaudit-w249.json`, `docs.calibration-verdict-sync`) | 保留 | 近点移動 +1.59%(169σ) | 数値未解決 |
| 🩹 | `psrJ1946CF` | PSR J1946+2052(コンパクト力 案K)— ⚡ で凍結した κ をそのまま流した 3 例目 | 凍結した κ を J1946 へ流す | 部分・照合の走行は台帳に記帳(根拠: `tests/out/calaudit-w249.json`, `docs.calibration-verdict-sync`) | 保留 | 近点移動 +8.28%(276σ) | 数値未解決・写像未確定 |
| 📿 | `psrB1534` | PSR B1534+12(実単位・観測版)— 第 4 の凍結 hold-out の入力確認 | B1534 の観測入力を kF0 で確かめる | 部分・照合の走行は台帳に記帳(根拠: `tests/out/calaudit-w249.json`, `docs.calibration-verdict-sync`) | 保留 | 周期 +0.000769%(3.2×10⁵σ) | 数値未解決・写像未確定 |
| 🧶 | `psrB1534DFM` | PSR B1534+12(DFM版・凍結 hold-out)— ⚡ の処方をそのまま当てた 4 例目 | ⚡ の処方を B1534 へ当てる | 部分・照合の走行は台帳に記帳(根拠: `tests/out/calaudit-w249.json`, `docs.calibration-verdict-sync`) | 保留 | 近点移動 2.0×10⁵σ(差の%は正本に無い) | 数値未解決・写像未確定 |
| 🪤 | `psrB1534CF` | PSR B1534+12(コンパクト力 案K・凍結 hold-out)— ⚡ の κ を 4 例目へ | 凍結した κ を B1534 へ流す | 部分・照合の走行は台帳に記帳(根拠: `tests/out/calaudit-w249.json`, `docs.calibration-verdict-sync`) | 保留 | 近点移動 +2.80%(5.0×10³σ) | 数値未解決 |

## 🔭 実在天体のアナロジー(11 本)

| 絵文字 | ID | 名前 | 目的 | 状況(達/部分/未達+根拠) | 較正 | 合わない量と差 | 精度見込み |
|---|---|---|---|---|---|---|---|
| 🎐 | `gw150914` | GW150914(実単位)— 連星ブラックホールの基準状態 | GW150914 の合体前の基準状態を転写する | 部分・照合の走行は台帳に記帳(根拠: `tests/out/calaudit-w249.json`, `behavior.gw150914`) | 保留 | — | σ 未接続 |
| 🎻 | `gw150914DFM` | GW150914(DFM版)— pull 重み・kF1 質量較正(f≈2) | GW150914 を kF1 と質量補正で回す | 部分・照合の走行は台帳に記帳(根拠: `tests/out/calaudit-w249.json`, `docs.calibration-verdict-sync`) | 保留 | — | σ 未接続 |
| ⏰ | `gw150914Merge4s` | GW150914 の合体(約4秒)— 放射の方向と用量の較正 variant | 放射の向きと量を宣言して約 4 秒の合体を回す | 部分・照合の走行は台帳に記帳(根拠: `tests/out/calaudit-w249.json`, `docs.calibration-verdict-sync`) | 保留 | — | σ 未接続 |
| ⚛️ | `gw150914SpinDipole` | BH 合体直前のスピン双極子 — λ=1 の届く場所(原理) | 合体直前で λ=1 のスピン双極子の強さを測る | 達・強さ η が純関数とエンジンで一致(根拠: `behavior.gwSpinDipole`) | 較正対象外 | — | — |
| 🍇 | `tuc47` | 球状星団 47 Tuc(観測転写)— Plummer 形の第一号 | 47 Tuc の配置と速度を観測から転写する | 部分・束縛 93.3%・視線分散との量の対応は未確定(根拠: `behavior.tuc47`) | 較正対象外 | — | — |
| 🫐 | `tuc47DFM` | 球状星団 47 Tuc(DFM版)— χ-law 平均場の質量 hold-out | 連星の質量補正を星団へ当てる hold-out | 部分・面内の分散は観測の中心 1D と別の量(根拠: `behavior.tuc47`) | 較正対象外 | — | — |
| 🌃 | `ngc3198` | 渦巻銀河 NGC 3198(観測転写)— 指数円盤+NFW 対照 | 指数円盤と NFW ハローで回転を比べる | 部分・外縁 128 km/s・ハローは自前 fit(根拠: `behavior.ngc3198`) | 較正対象外 | — | — |
| 🛞 | `ngc3198DFM` | NGC 3198(DFM版)— 恒星質量×2+自由中心核の hold-out | ハローなしの DFM で外縁速度を支える | 未達・外縁 55 km/s で届かない(根拠: `behavior.ngc3198`) | 較正対象外 | — | — |
| 🥀 | `supernovaProg` | 超新星前駆星 — ベテルギウス(観測転写) | ベテルギウスの前駆星状態を転写する | 達・静止の保持と転写を検査で確認(根拠: `behavior.supernovaObs`) | 較正対象外 | — | — |
| 🌹 | `supernovaProgDFM` | 超新星前駆星(DFM版)— 質量台帳 f=2・光球半径=コアの引きずり外縁 | 質量台帳 f=2 の前駆星を比べる | 達・台帳 f=2 と光球半径の逆算を確認(根拠: `behavior.dfm-star-structure`) | 較正対象外 | — | — |
| 🦀 | `crabRemnant` | 超新星残骸 SN 1054 — かに星雲とパルサー(観測転写) | かに星雲とパルサーの残骸状態を転写する | 達・膨張速度の転写と自由膨張を確認(根拠: `behavior.supernovaObs`) | 較正対象外 | — | — |

## ⚗️ 法則の実験室(0 本)

(内蔵サンプルは 0 本)

## 🖥️ シミュレーション(0 本)

(内蔵サンプルは 0 本)

## 📏 現実との照合(0 本)

(内蔵サンプルは 0 本)

## 所要時間(正本の再生成と QA)

> **測った値の転記であって判定ではない**(第282便・原仮定者の指示 2026-09-26)。時間は html の生成領域に入れない(時間で html を変えない)。数は `tests/lib-w281a-regentable.mjs`(段の実測秒)・`tests/out/calaudit-w249.json`(各本の壁時計)・`tests/out/qa-results-full-beta.json`(試験ごとの所要 ms)の転記で、走行のたびに変わる。

- **較正走行(calaudit)**: 較正母集団の各本を calaudit が走らせた壁時計(段 dt / dt/2 / dt/4 / dt/8 の和・`presets[].run.timeBudget[].wallSec`)。母集団の外の本は「—」。
- **関与する再生成の段**: 領域(REGEN_SCOPE)を宣言した段のうち、この本を宣言に含むもの。表記「段 秒/本数」は**段 1 回の実測秒とその段が宣言した本数**(所要は宣言した本で共有する —— 本ごとに足し上げない)。all は全プリセットを走査する段。
- **宣言の無い段**(対象 html の全体に縛られ、どの本に関与するかを宣言していない 45 段・実測 1883 s)と**常時群**(11 段・実測 5993 s・毎回走る)は本ごとの行に配らない。現行の段 84 段の実測秒の和 21047 s(5.85 h・逐次の上限。履歴の段は除く)。
- **保存 QA**: `tests/out/qa-results-full-beta.json`(905 試験・全体 1356 s・commit ceafecf)のうち、**試験の id にこの本の id を含むもの+その本の claims が挙げる testId** の所要の和と本数(1 つの試験が複数の本に数えられうる —— 本ごとの列は重なりを含む)。内訳は所要の上位 3。

| 本 | 較正走行(s) | 段別(s) | 関与する再生成の段(段 秒/本数) | 保存 QA(s・本数) | QA の内訳(上位 3) |
|---|---|---|---|---|---|
| ⚾ `projectile` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.01・2 | `preset.projectile` 0.01・`projectile.layout` 0.00 |
| ⏪ `echo` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 1.00・8 | `echo.leapfrog-return` 0.44・`echo.hud` 0.36・`shot.regress-echo` 0.14 |
| 🪗 `compactForceToy` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.04・1 | `preset.compactForceToy` 0.04 |
| 🫂 `boxBinaryToy` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.08・1 | `preset.boxBinaryToy` 0.08 |
| 🪟 `spaceMeshBinaryToy` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.07・1 | `preset.spaceMeshBinaryToy` 0.07 |
| 🌌 `galaxy` | — | — | nslock 688/9・sparc 192/3・cluster 84.0/3・shapecrit 106/all・bgbudget2 77.0/4・d68 153/all・calcontract 2.00/all | 335・22 | `claim.galaxygeo2-outerboost` 164・`claim.galaxystd-outerboost` 64.6・`claim.galaxydb-contrast` 50.6 |
| 🎡 `galaxyStd` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 69.1・2 | `claim.galaxystd-outerboost` 64.6・`preset.galaxyStd` 4.49 |
| 💫 `galaxyGeo2` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 171・2 | `claim.galaxygeo2-outerboost` 164・`preset.galaxyGeo2` 6.17 |
| 🍳 `galaxyDB` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 54.0・2 | `claim.galaxydb-contrast` 50.6・`preset.galaxyDB` 3.44 |
| 🌫️ `collapse` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 24.8・6 | `collapse.rotation` 22.9・`preset.collapse` 1.62・`behavior.collapseRControl` 0.16 |
| 🥢 `axisBarStill` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 6.46・1 | `preset.axisBarStill` 6.46 |
| 🎏 `axisBarArms` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 6.21・1 | `preset.axisBarArms` 6.21 |
| 🎚️ `axisBarReach` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 6.03・1 | `preset.axisBarReach` 6.03 |
| 🎠 `galaxyMeshSpiral` | — | — | shapecrit 106/all・d68 153/all・analogy 148/8・calcontract 2.00/all | 12.6・3 | `preset.galaxyMeshSpiralGeoToy` 7.19・`preset.galaxyMeshSpiral` 3.62・`preset.galaxyMeshSpiralGeoToyLite` 1.74 |
| 🪁 `galaxyMeshSpiralGeoToy` | — | — | shapecrit 106/all・d68 153/all・analogy 148/8・calcontract 2.00/all | 8.93・2 | `preset.galaxyMeshSpiralGeoToy` 7.19・`preset.galaxyMeshSpiralGeoToyLite` 1.74 |
| 🎋 `galaxyMeshSpiralGeoToyLite` | — | — | shapecrit 106/all・d68 153/all・analogy 148/8・calcontract 2.00/all | 1.74・1 | `preset.galaxyMeshSpiralGeoToyLite` 1.74 |
| 🌚 `galaxyAnalogyBH` | — | — | shapecrit 106/all・d68 153/all・analogy 148/8・calcontract 2.00/all | 3.26・1 | `preset.galaxyAnalogyBH` 3.26 |
| 🔮 `shapeToyCluster` | — | — | shapetoy 265/3・shapecrit 106/all・corefield 187/5・d68 153/all・calcontract 2.00/all | 2.08・2 | `preset.shapeToyClusterCore` 1.12・`preset.shapeToyCluster` 0.96 |
| 🥏 `shapeToyDisk` | — | — | shapetoy 265/3・shapecrit 106/all・d68 153/all・calcontract 2.00/all | 2.72・2 | `preset.shapeToyDiskCore` 1.38・`preset.shapeToyDisk` 1.34 |
| 🧵 `shapeToyArm` | — | — | shapetoy 265/3・shapecrit 106/all・d68 153/all・calcontract 2.00/all | 1.11・2 | `preset.shapeToyArm` 0.60・`preset.shapeToyArmCore` 0.51 |
| 🎱 `shapeToyClusterCore` | — | — | shapecrit 106/all・corefield 187/5・d68 153/all・calcontract 2.00/all | 1.12・1 | `preset.shapeToyClusterCore` 1.12 |
| 📀 `shapeToyDiskCore` | — | — | shapecrit 106/all・corefield 187/5・d68 153/all・calcontract 2.00/all | 1.38・1 | `preset.shapeToyDiskCore` 1.38 |
| 🧹 `shapeToyArmCore` | — | — | shapecrit 106/all・corefield 187/5・d68 153/all・calcontract 2.00/all | 0.51・1 | `preset.shapeToyArmCore` 0.51 |
| 🌍 `earthMoon` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 2.26・8 | `behavior.earthMoonFree` 1.21・`behavior.earthMoon` 0.32・`preset.earthMoon` 0.29 |
| 🌕 `earthMoonFree` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 1.34・2 | `behavior.earthMoonFree` 1.21・`preset.earthMoonFree` 0.13 |
| ☿ `mercury` | — | — | shapecrit 106/all・d68 153/all・geo3 1016/34・calcontract 2.00/all・geo1 1033/36 | 0.75・7 | `behavior.mercury-builtin` 0.42・`ui.mercuryNaming` 0.10・`preset.mercuryGeoToy3` 0.07 |
| 🪐 `saturn` | — | — | shapecrit 106/all・corefield 187/5・d68 153/all・calcontract 2.00/all | 17.2・14 | `preset.saturnRingRealKF1` 6.36・`shot.regress-saturnLayered` 2.61・`shot.regress-saturn` 2.57 |
| 🎯 `saturnLayered` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 4.78・4 | `shot.regress-saturnLayered` 2.61・`preset.saturnLayered` 2.16・`core.twolayer` 0.01 |
| ⭐ `binary` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all・geo1 1033/36 | 3.68・8 | `preset.binary` 2.04・`behavior.boxBinary` 1.39・`preset.boxBinaryToy` 0.08 |
| ♾️ `fig8` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.14・2 | `shot.regress-fig8` 0.11・`preset.fig8` 0.02 |
| 💥 `counterring` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.67・2 | `preset.counterring` 0.67・`new.counterring` 0.00 |
| 🌪️ `spinup` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 1.75・3 | `shot.regress-spinup` 0.95・`preset.spinup` 0.80・`behavior.spinup` 0.00 |
| 🏮 `pulsarSolo` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.28・1 | `preset.pulsarSolo` 0.28 |
| 🎇 `supernovaCore` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.12・1 | `preset.supernovaCore` 0.12 |
| ⚪ `whiteDwarfDFM` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.01・1 | `preset.whiteDwarfDFM` 0.01 |
| 🔘 `whiteDwarfBareDFM` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.12・1 | `preset.whiteDwarfBareDFM` 0.12 |
| 🎆 `envelopeShedDFM` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.04・1 | `preset.envelopeShedDFM` 0.04 |
| 🐮 `lfbotTrap` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.17・2 | `preset.lfbotTrap` 0.10・`preset.lfbotTrap` 0.07 |
| 🧅 `layeredCoreDFM` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.03・1 | `preset.layeredCoreDFM` 0.03 |
| ⚙️ `spinDipoleBinary` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.02・1 | `preset.spinDipoleBinary` 0.02 |
| 🌬️ `gasCohSurface` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.20・2 | `behavior.gasCohSurface` 0.18・`preset.gasCohSurface` 0.03 |
| ⏱️ `gclock` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 13.7・3 | `new.gclock` 13.5・`shot.regress-gclock` 0.19・`preset.gclock` 0.03 |
| 🛰️ `grcal` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.23・8 | `behavior.grcal3` 0.09・`preset.grcalGps` 0.05・`preset.grcal` 0.03 |
| 🕰️ `grcalGps` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.14・2 | `behavior.grcal3` 0.09・`preset.grcalGps` 0.05 |
| 🌟 `grcalLight` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.12・2 | `behavior.grcal3` 0.09・`preset.grcalLight` 0.03 |
| ⏲️ `grcalShapiro` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.11・2 | `behavior.grcal3` 0.09・`preset.grcalShapiro` 0.02 |
| 💡 `lensing` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.18・2 | `shot.regress-lensing` 0.15・`preset.lensing` 0.03 |
| 🌗 `spinlens` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.02・2 | `preset.spinlens` 0.02・`spinlens.kframe-control` 0.00 |
| 🔭 `blens` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.05・2 | `preset.blens` 0.03・`behavior.blens` 0.02 |
| 🌆 `reddening` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.33・2 | `preset.reddening` 0.30・`claim.reddening` 0.03 |
| 🪞 `mmPhaseToy` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.01・1 | `preset.mmPhaseToy` 0.01 |
| 🔥 `gas` | — | — | shapecrit 106/all・d68 153/all・emgrid 2295/5・analogy 148/8・calcontract 2.00/all・dragprofile 2.00/21 | 30.2・6 | `behavior.gas` 25.7・`shot.regress-gas` 2.24・`preset.gas` 2.10 |
| 🎈 `pressure` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 20.5・4 | `behavior.pressure` 12.0・`behavior.geoToyBandPressure` 5.14・`preset.pressure` 2.11 |
| 📏 `conduction` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.72・4 | `behavior.conduction` 0.60・`preset.conduction` 0.10・`conduction.pinned-zero-cost` 0.02 |
| 🛷 `frictionHeat` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.85・1 | `preset.frictionHeat` 0.85 |
| 🌈 `coolrace` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.02・2 | `preset.coolrace` 0.02・`new.coolrace` 0.00 |
| ♨️ `convection` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 3.87・4 | `shot.regress-convection` 2.10・`preset.convection` 1.77・`perf.convection-timescale` 0.01 |
| 🧪 `buoyancy` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 2.55・2 | `preset.buoyancy` 2.55・`behavior.buoyancy` 0.00 |
| ☕ `cooling` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 1.65・2 | `preset.cooling` 1.65・`behavior.collapse-cooling` 0.00 |
| 🧬 `emergent` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 2.66・5 | `preset.emergent2` 1.78・`preset.emergent` 0.88・`phasechange.emergent` 0.00 |
| 🧊 `emergent2` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 1.78・3 | `preset.emergent2` 1.78・`phasechange.emergent2` 0.00・`behavior.phase-multiseed` 0.00 |
| ⛓️ `chain2` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.90・3 | `preset.chain2` 0.90・`phasechange.chain2` 0.00・`behavior.phase-multiseed` 0.00 |
| ♻️ `chaincycle` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 1.19・3 | `preset.chaincycle` 1.19・`claim.chaincycle` 0.00・`behavior.phase-multiseed` 0.00 |
| 📦 `boxtrans` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.16・1 | `preset.boxtrans` 0.16 |
| 🌀 `boxrot` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.22・1 | `preset.boxrot` 0.22 |
| 📈 `boxexpand` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.30・1 | `preset.boxexpand` 0.30 |
| 🫧 `boxcomoving` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.40・2 | `shot.regress-boxcomoving` 0.28・`preset.boxcomoving` 0.11 |
| 🪢 `boxbound` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.36・2 | `behavior.boxbound` 0.32・`preset.boxbound` 0.04 |
| 🫁 `boxbreath` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.11・1 | `preset.boxbreath` 0.11 |
| 🔦 `boxredshift` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.20・3 | `shot.regress-boxredshift` 0.13・`box.photon-abc` 0.06・`preset.boxredshift` 0.01 |
| 🧭 `probeH` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.21・2 | `behavior.probeH` 0.12・`preset.probeH` 0.09 |
| 🕊️ `freebox` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 2.21・11 | `freebox.pressure-expand` 1.23・`preset.freebox` 0.46・`shot.regress-freebox` 0.27 |
| 🕸️ `cosmicweb` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 4.25・2 | `preset.cosmicweb` 4.25・`behavior.cosmicweb` 0.00 |
| 🕶️ `darkrotor` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 7.55・8 | `shot.regress-darkrotor` 4.16・`preset.darkrotor` 3.34・`darkrotor.uphi` 0.02 |
| 🕳️ `rotorSolo` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 1.05・2 | `behavior.rotorSolo` 0.93・`preset.rotorSolo` 0.12 |
| 🌑 `nebulaRotor` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 4.50・2 | `claim.nebularotor-contrast` 4.15・`preset.nebulaRotor` 0.35 |
| 🐚 `nebulaShell` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 3.66・2 | `claim.nebulashell-stress` 3.31・`preset.nebulaShell` 0.35 |
| ⏳ `nebulaBipolar` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 21.1・3 | `claim.nebulabipolar-multiseed` 15.5・`claim.nebulabipolar-polar` 5.43・`preset.nebulaBipolar` 0.17 |
| ⚫ `bhCore` | — | — | shapecrit 106/all・d68 153/all・analogy 148/8・calcontract 2.00/all | 59.3・4 | `claim.bhcore-selfdrive` 52.9・`preset.bhCore` 3.29・`preset.bhCoreTilt` 3.09 |
| 🪩 `bhCoreTilt` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 3.09・1 | `preset.bhCoreTilt` 3.09 |
| 🪜 `massLadder` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 6.19・2 | `claim.massladder` 5.67・`preset.massLadder` 0.52 |
| 🥚 `selfRotor` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 1.27・3 | `preset.selfRotor` 1.27・`behavior.selfrotor` 0.00・`behavior.selfrotor-multiseed` 0.00 |
| 🌱 `starSeed` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.06・2 | `claim.starseed-powerball` 0.04・`preset.starSeed` 0.03 |
| 🌙 `earthMoonReal` | 69.1 | dt 34.3・dt/2 34.8 | shapecrit 106/all・d68 153/all・calcontract 2.00/all・geo1 1033/36 | 0.08・2 | `preset.earthMoonRealKF1` 0.07・`preset.earthMoonReal` 0.02 |
| 🌘 `earthMoonRealKF1` | 130 | dt 64.9・dt/2 65.1 | shapecrit 106/all・bgequiv 96.0/3・bgbudget2 77.0/4・d68 153/all・emgrid 2295/5・geo3 1016/34・calcontract 2.00/all・mercury 284/32・dragprofile 2.00/21・geo1 1033/36 | 0.07・1 | `preset.earthMoonRealKF1` 0.07 |
| ⭕ `emAuditNewton` | — | — | shapecrit 106/all・d68 153/all・geo3 1016/34・calcontract 2.00/all・mercury 284/32・geo1 1033/36 | 0.07・2 | `preset.emAuditNewton` 0.07・`behavior.emAudit` 0.00 |
| 🧲 `emAuditDFM` | 115 | dt 58.0・dt/2 56.9 | shapecrit 106/all・d68 153/all・emgrid 2295/5・geo3 1016/34・calcontract 2.00/all・mercury 284/32・geo1 1033/36 | 0.07・2 | `preset.emAuditDFM` 0.07・`behavior.emAudit` 0.00 |
| 🔆 `emAuditSolar` | 3.02 | dt 1.06・dt/2 1.96 | shapecrit 106/all・d68 153/all・emgrid 2295/5・calcontract 2.00/all | 0.02・2 | `preset.emAuditSolar` 0.02・`behavior.emAudit` 0.00 |
| 🌓 `earthMoonDiagOne` | — | — | shapecrit 106/all・d68 153/all・emgrid 2295/5・calcontract 2.00/all・dragprofile 2.00/21 | 0.09・1 | `preset.earthMoonDiagOne` 0.09 |
| 📶 `qLockRadialAudit` | — | — | shapecrit 106/all・d68 153/all・geo3 1016/34・calcontract 2.00/all・mercury 284/32・geo1 1033/36 | 0.88・3 | `behavior.qlockRadial` 0.72・`preset.qLockRadialAudit` 0.09・`preset.qLockRadialAuditQ3` 0.06 |
| 📐 `qLockRadialAuditQ3` | — | — | shapecrit 106/all・d68 153/all・geo3 1016/34・calcontract 2.00/all・mercury 284/32・geo1 1033/36 | 0.78・2 | `behavior.qlockRadial` 0.72・`preset.qLockRadialAuditQ3` 0.06 |
| ☄️ `mercuryReal` | 7.25 | dt 2.43・dt/2 4.82 | shapecrit 106/all・d68 153/all・geo3 1016/34・calcontract 2.00/all・mercury 284/32・dragprofile 2.00/21・geo1 1033/36 | 0.09・2 | `preset.mercuryRealKF1` 0.05・`preset.mercuryReal` 0.04 |
| 🔁 `mercuryGeoToy3` | — | — | shapecrit 106/all・d68 153/all・geo3 1016/34・calcontract 2.00/all・geo1 1033/36 | 0.07・1 | `preset.mercuryGeoToy3` 0.07 |
| 🪨 `mercuryRealKF1` | 13.1 | dt 4.30・dt/2 8.75 | shapecrit 106/all・d68 153/all・calcontract 2.00/all・mercury 284/32 | 0.05・1 | `preset.mercuryRealKF1` 0.05 |
| 🌞 `solarInner` | 650 | dt 650 | shapecrit 106/all・d68 153/all・calcontract 2.00/all・dragprofile 2.00/21 | 4.14・2 | `preset.solarInner` 2.63・`behavior.solarInner` 1.51 |
| 🟠 `jupiterGalilean` | 55.9 | dt 18.7・dt/2 37.2 | shapecrit 106/all・d68 153/all・geo3 1016/34・calcontract 2.00/all・mercury 284/32・dragprofile 2.00/21・geo1 1033/36 | 0.45・2 | `behavior.jupiter` 0.43・`preset.jupiterGalilean` 0.02 |
| 🌇 `venusReal` | 33.1 | dt 10.9・dt/2 22.2 | charon-h 677/9・charon-h2 1407/9・charon-h4 700/9・charoneps-h 212/9・charoneps-h2 430/9・charoneps-h4 847/9・shapecrit 106/all・d68 153/all・geo3 1016/34・calcontract 2.00/all・mercury 284/32・dragprofile 2.00/21・geo1 1033/36 | 4.16・2 | `behavior.venusReal` 4.11・`preset.venusReal` 0.05 |
| 🥔 `marsMoonsReal` | 22.8 | dt 7.43・dt/2 15.3 | shapecrit 106/all・d68 153/all・geo3 1016/34・calcontract 2.00/all・mercury 284/32・dragprofile 2.00/21・geo1 1033/36 | 0.03・2 | `preset.marsMoonsReal` 0.03・`behavior.marsMoonsReal` 0.00 |
| ❄️ `plutoCharonReal` | 716 | dt 31.3・dt/2 61.8・dt/4 125・dt/8 249・dt/8 249 | charon-h 677/9・charon-h2 1407/9・charon-h4 700/9・charonk 979/1・charoneps-h 212/9・charoneps-h2 430/9・charoneps-h4 847/9・charonfactors 308/1・shapecrit 106/all・bgequiv 96.0/3・bgbudget2 77.0/4・d68 153/all・charonInput 603/5・geo3 1016/34・calcontract 2.00/all・mercury 284/32・dragprofile 2.00/21・geo1 1033/36 | 0.03・2 | `preset.plutoCharonReal` 0.03・`behavior.plutoCharonReal` 0.00 |
| ⛄ `plutoCharonDFM` | — | — | charondfm 76.0/2・charonwin 87.0/2・shapecrit 106/all・d68 153/all・charonInput 603/5・calcontract 2.00/all | 9.24・2 | `behavior.plutoCharonDFM` 9.17・`preset.plutoCharonDFM` 0.07 |
| 🌨️ `plutoCharonKF0Control` | — | — | charondfm 76.0/2・charonwin 87.0/2・shapecrit 106/all・d68 153/all・charonInput 603/5・calcontract 2.00/all | 0.06・1 | `preset.plutoCharonKF0Control` 0.06 |
| 🥶 `plutoCharonDiagInput` | — | — | shapecrit 106/all・d68 153/all・charonInput 603/5・calcontract 2.00/all・geo1 1033/36 | 0.02・1 | `preset.plutoCharonDiagInput` 0.02 |
| ☃️ `plutoCharonSyncZero` | — | — | shapecrit 106/all・d68 153/all・charonInput 603/5・calcontract 2.00/all | 0.02・1 | `preset.plutoCharonSyncZero` 0.02 |
| 🌒 `charonGeoToy3` | — | — | shapecrit 106/all・d68 153/all・geo3 1016/34・calcontract 2.00/all | 0.04・1 | `preset.charonGeoToy3` 0.04 |
| 💠 `uranusReal` | 648 | dt 648 | shapecrit 106/all・d68 153/all・calcontract 2.00/all・dragprofile 2.00/21 | 1.94・2 | `preset.uranusReal` 1.94・`behavior.uranusReal` 0.00 |
| 🌊 `neptuneReal` | 8.89 | dt 2.96・dt/2 5.93 | charon-h 677/9・charon-h2 1407/9・charon-h4 700/9・charoneps-h 212/9・charoneps-h2 430/9・charoneps-h4 847/9・shapecrit 106/all・d68 153/all・geo3 1016/34・calcontract 2.00/all・mercury 284/32・dragprofile 2.00/21・geo1 1033/36 | 0.02・2 | `preset.neptuneReal` 0.02・`behavior.neptuneReal` 0.00 |
| 📡 `saturnZonalD68` | 89.1 | dt 3.94・dt/2 7.81・dt/4 15.5・dt/8 31.0・dt/8 31.0 | shapecrit 106/all・d68 153/all・geo3 1016/34・calcontract 2.00/all・mercury 284/32・dragprofile 2.00/21・geo1 1033/36 | 6.53・4 | `zonal.d68-realunit` 6.47・`preset.saturnZonalD68` 0.05・`zonal.analytic-d68` 0.01 |
| 🧷 `saturnD68Consistent` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.02・1 | `preset.saturnD68Consistent` 0.02 |
| 📎 `saturnD68ObsOrbit` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.02・1 | `preset.saturnD68ObsOrbit` 0.02 |
| 💍 `saturnRingReal` | 641 | dt 641 | shapecrit 106/all・d68 153/all・calcontract 2.00/all・dragprofile 2.00/21 | 7.40・3 | `preset.saturnRingRealKF1` 6.36・`preset.saturnRingReal` 1.00・`wave121.ui` 0.04 |
| 💿 `saturnRingRealKF1` | 612 | dt 612 | shapecrit 106/all・d68 153/all・calcontract 2.00/all・dragprofile 2.00/21 | 6.36・1 | `preset.saturnRingRealKF1` 6.36 |
| ✨ `alphaCenAB` | 64.9 | dt 9.52・dt/2 18.7・dt/4 36.7 | nslock 688/9・charon-h 677/9・charon-h2 1407/9・charon-h4 700/9・charoneps-h 212/9・charoneps-h2 430/9・charoneps-h4 847/9・shapecrit 106/all・d68 153/all・geo3 1016/34・calcontract 2.00/all・mercury 284/32・geo1 1033/36 | 3.47・3 | `behavior.alphaCenAB` 3.37・`preset.alphaCenABDFM` 0.05・`preset.alphaCenAB` 0.05 |
| ✴️ `alphaCenABDFM` | 121 | dt 17.7・dt/2 34.2・dt/4 69.0 | nslock 688/9・shapecrit 106/all・d68 153/all・geo3 1016/34・calcontract 2.00/all・mercury 284/32・dragprofile 2.00/21・geo1 1033/36 | 3.42・2 | `behavior.alphaCenAB` 3.37・`preset.alphaCenABDFM` 0.05 |
| 🌟 `siriusAB` | 40.9 | dt 5.91・dt/2 11.7・dt/4 23.3 | nslock 688/9・charon-h 677/9・charon-h2 1407/9・charon-h4 700/9・charoneps-h 212/9・charoneps-h2 430/9・charoneps-h4 847/9・shapecrit 106/all・d68 153/all・geo3 1016/34・calcontract 2.00/all・mercury 284/32・geo1 1033/36 | 2.57・3 | `behavior.siriusAB` 2.48・`preset.siriusAB` 0.04・`preset.siriusABDFM` 0.04 |
| 💫 `siriusABDFM` | 73.2 | dt 10.4・dt/2 20.9・dt/4 41.9 | nslock 688/9・shapecrit 106/all・d68 153/all・geo3 1016/34・calcontract 2.00/all・mercury 284/32・dragprofile 2.00/21・geo1 1033/36 | 2.53・2 | `behavior.siriusAB` 2.48・`preset.siriusABDFM` 0.04 |
| 📻 `psrDoubleAB` | 76.3 | dt 3.40・dt/2 6.74・dt/4 13.4・dt/8 26.4・dt/8 26.4 | shapecrit 106/all・bgequiv 96.0/3・bgbudget2 77.0/4・d68 153/all・geo3 1016/34・calcontract 2.00/all・mercury 284/32・geo1 1033/36 | 0.45・7 | `preset.psrDoubleABGeoToy` 0.11・`preset.psrDoubleABCF` 0.11・`preset.psrDoubleABDFM` 0.08 |
| ⚡ `psrDoubleABDFM` | 66.7 | dt 2.92・dt/2 5.84・dt/4 11.5・dt/8 23.2・dt/8 23.2 | nslock 688/9・charon-h 677/9・charon-h2 1407/9・charon-h4 700/9・charoneps-h 212/9・charoneps-h2 430/9・charoneps-h4 847/9・shapecrit 106/all・d68 153/all・geo3 1016/34・calcontract 2.00/all・mercury 284/32・dragprofile 2.00/21・geo1 1033/36 | 0.08・2 | `preset.psrDoubleABDFM` 0.08・`behavior.psrDoubleAB` 0.00 |
| 🩻 `psrDoubleABGeoToy` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.11・1 | `preset.psrDoubleABGeoToy` 0.11 |
| 🧿 `psrDoubleABSpinCal` | 9.15 | dt 2.99・dt/2 6.16 | shapecrit 106/all・d68 153/all・geo3 1016/34・calcontract 2.00/all・mercury 284/32・geo1 1033/36 | 0.08・1 | `preset.psrDoubleABSpinCal` 0.08 |
| 🧮 `psrJ1757DFM` | 171 | dt 7.59・dt/2 14.8・dt/4 29.6・dt/8 59.6・dt/8 59.6 | nslock 688/9・charon-h 677/9・charon-h2 1407/9・charon-h4 700/9・charoneps-h 212/9・charoneps-h2 430/9・charoneps-h4 847/9・shapecrit 106/all・d68 153/all・geo3 1016/34・calcontract 2.00/all・mercury 284/32・dragprofile 2.00/21・geo1 1033/36 | 0.06・1 | `preset.psrJ1757DFM` 0.06 |
| 🩺 `psrJ1946DFM` | 50.1 | dt 2.28・dt/2 4.38・dt/4 8.85・dt/8 17.3・dt/8 17.3 | j1946adopt 149/3・nslock 688/9・charon-h 677/9・charon-h2 1407/9・charon-h4 700/9・charoneps-h 212/9・charoneps-h2 430/9・charoneps-h4 847/9・shapecrit 106/all・d68 153/all・geo3 1016/34・calcontract 2.00/all・mercury 284/32・dragprofile 2.00/21・geo1 1033/36 | 0.05・1 | `preset.psrJ1946DFM` 0.05 |
| 🪶 `psrDoubleABPN` | 8.92 | dt 2.94・dt/2 5.99 | shapecrit 106/all・d68 153/all・geo3 1016/34・calcontract 2.00/all・mercury 284/32・geo1 1033/36 | 0.03・1 | `preset.psrDoubleABPN` 0.03 |
| 🪃 `psrJ1757PN` | 22.6 | dt 7.73・dt/2 14.9 | shapecrit 106/all・d68 153/all・geo3 1016/34・calcontract 2.00/all・mercury 284/32・geo1 1033/36 | 0.03・1 | `preset.psrJ1757PN` 0.03 |
| 🪀 `psrJ1946PN` | 6.50 | dt 2.17・dt/2 4.33 | j1946adopt 149/3・shapecrit 106/all・d68 153/all・geo3 1016/34・calcontract 2.00/all・mercury 284/32・geo1 1033/36 | 0.04・1 | `preset.psrJ1946PN` 0.04 |
| 🪝 `psrDoubleABCF` | 92.8 | dt 4.11・dt/2 8.07・dt/4 16.1・dt/8 32.3・dt/8 32.3 | shapecrit 106/all・d68 153/all・geo3 1016/34・calcontract 2.00/all・mercury 284/32・geo1 1033/36 | 0.11・1 | `preset.psrDoubleABCF` 0.11 |
| 🪄 `psrJ1757CF` | 234 | dt 10.4・dt/2 20.2・dt/4 40.5・dt/8 81.6・dt/8 81.6 | shapecrit 106/all・d68 153/all・geo3 1016/34・calcontract 2.00/all・mercury 284/32・geo1 1033/36 | 0.05・1 | `preset.psrJ1757CF` 0.05 |
| 🩹 `psrJ1946CF` | 68.6 | dt 3.00・dt/2 5.96・dt/4 11.8・dt/8 23.9・dt/8 23.9 | j1946adopt 149/3・shapecrit 106/all・d68 153/all・geo3 1016/34・calcontract 2.00/all・mercury 284/32・geo1 1033/36 | 0.05・1 | `preset.psrJ1946CF` 0.05 |
| 📿 `psrB1534` | 102 | dt 17.3・dt/2 34.5・dt/4 50.4 | shapecrit 106/all・d68 153/all・geo3 1016/34・calcontract 2.00/all・mercury 284/32・geo1 1033/36 | 0.14・3 | `preset.psrB1534DFM` 0.06・`preset.psrB1534CF` 0.05・`preset.psrB1534` 0.03 |
| 🧶 `psrB1534DFM` | 97.6 | dt 14.0・dt/2 27.7・dt/4 55.9 | nslock 688/9・charon-h 677/9・charon-h2 1407/9・charon-h4 700/9・charoneps-h 212/9・charoneps-h2 430/9・charoneps-h4 847/9・shapecrit 106/all・d68 153/all・geo3 1016/34・calcontract 2.00/all・mercury 284/32・dragprofile 2.00/21・geo1 1033/36 | 0.06・1 | `preset.psrB1534DFM` 0.06 |
| 🪤 `psrB1534CF` | 133 | dt 19.4・dt/2 37.8・dt/4 75.5 | shapecrit 106/all・d68 153/all・geo3 1016/34・calcontract 2.00/all・mercury 284/32・geo1 1033/36 | 0.05・1 | `preset.psrB1534CF` 0.05 |
| 🎐 `gw150914` | 1.99 | dt 0.68・dt/2 1.32 | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 4.09・5 | `behavior.gw150914` 3.90・`preset.gw150914Merge4s` 0.07・`preset.gw150914DFM` 0.06 |
| 🎻 `gw150914DFM` | 1.47 | dt 0.54・dt/2 0.93 | shapecrit 106/all・d68 153/all・geo3 1016/34・analogy 148/8・calcontract 2.00/all・mercury 284/32・dragprofile 2.00/21・geo1 1033/36 | 3.96・2 | `behavior.gw150914` 3.90・`preset.gw150914DFM` 0.06 |
| ⏰ `gw150914Merge4s` | 0.10 | dt 0.04・dt/2 0.06 | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.07・1 | `preset.gw150914Merge4s` 0.07 |
| ⚛️ `gw150914SpinDipole` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.03・1 | `preset.gw150914SpinDipole` 0.03 |
| 🍇 `tuc47` | — | — | cluster 84.0/3・shapecrit 106/all・d68 153/all・calcontract 2.00/all | 9.51・3 | `preset.tuc47DFM` 6.03・`preset.tuc47` 3.48・`behavior.tuc47` 0.00 |
| 🫐 `tuc47DFM` | — | — | cluster 84.0/3・shapecrit 106/all・d68 153/all・calcontract 2.00/all | 6.03・1 | `preset.tuc47DFM` 6.03 |
| 🌃 `ngc3198` | — | — | sparc 192/3・galaxydiag 352/2・shapecrit 106/all・d68 153/all・calcontract 2.00/all | 15.9・3 | `preset.ngc3198DFM` 10.6・`preset.ngc3198` 5.37・`behavior.ngc3198` 0.00 |
| 🛞 `ngc3198DFM` | — | — | sparc 192/3・galaxydiag 352/2・shapecrit 106/all・d68 153/all・analogy 148/8・calcontract 2.00/all | 10.6・1 | `preset.ngc3198DFM` 10.6 |
| 🥀 `supernovaProg` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.04・2 | `preset.supernovaProg` 0.02・`preset.supernovaProgDFM` 0.02 |
| 🌹 `supernovaProgDFM` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.02・1 | `preset.supernovaProgDFM` 0.02 |
| 🦀 `crabRemnant` | — | — | shapecrit 106/all・d68 153/all・calcontract 2.00/all | 0.40・1 | `preset.crabRemnant` 0.40 |

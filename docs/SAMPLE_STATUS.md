# サンプル状況一覧(v1.48-b357・第279便a)

> **この文書は生成物である —— 手で直さない。** 器 `tests/exp-w279a-samplestatus.mjs` が、原稿 `tests/data-w279a-samplestatus-src.json`(目的・状況・根拠 ID)と正本 `tests/out/calaudit-w249.json`(verdictLedger)・`tests/out/charonwin-w278b.json`(冥王星–カロンの同一定義の比較値)から作り、`beta/index.html` の生成領域 `sample-status` と正本 `tests/out/samplestatus-w279a.json` を同時に書く。QA `docs.sampleStatus-sync`(この表 ↔ html ↔ 正本)と `preset.statusLedger-sync`(html の較正欄 ↔ calaudit)が照合する。
> 原仮定者の裁定(第69報)「各サンプルについて目的と状況を一覧化する(一覧の情報はサンプルの『概要』で利用する)」への対応。アプリの「説明」タブの 🔖概要(1 行 3 節「目的。状況。較正。」)と状態チップは、この表と同じ宣言から出ている。

## 読み方

- **3 つの欄は別の問いである。** 「保存 QA が通った」「サンプルの目的に達した」「観測との較正が成り立つ」は同じことではない —— 1 つの語に混ぜない。
- **状況**(目的の達成)の語: **達** = 根拠に挙げた保存 QA(`tests/out/qa-results-full-beta.json` で PASS)または完成門が、サンプルの目的そのものを測って通っている。**部分** = 目的の一部だけが測られている(受理・構築・画像回帰だけの本、照合の走行は台帳にあるが門を通った量が全部ではない本を含む)。**未達** = 目的を測る門・量が外れている。**対象外** = 本便では使っていない。根拠 ID の無い「達」は書かない(器が止める)。
- **較正**の語: 較正母集団 19 本(sampleClass:"calibration" ∧ familyRole≠"retired" —— 判定器 calaudit が機械で数える)は **4 値の台帳の正式語**(合・量限定合・否・保留 —— `tests/out/calaudit-w249.json` の verdictLedger の転記)。**判定保留(量定義不一致)** は母集団の外の表示(第 5 の値ではない)。それ以外は **較正対象外**(観測との合否をこの一覧では書かない)。合否の語は門(3σ)に入る本だけに付く。
- **合わない量と差**: 代表量が 3σ を外れていればその量の差 %(σ 倍)。σ が無い本は、写像が確定していて目安判定が外れている量のうち差が最大のもの(「σ なし」と明記)。どれも無ければ「—」。
- **保留の解き方**(第291便e・原仮定者の裁定(第81報)⑦): 較正が保留/判定保留の本で、**何をすれば判定器が判定を出すか**の 1 行(原稿 `tests/data-w279a-samplestatus-src.json` の `holdRemedy` の転記 —— 保留の理由が器の結果〔calaudit の missing・σ 接続器 `tests/exp-w262d-solarsigma.mjs` の切断点・charonwin の比較値〕に基づく本だけに書く)。原稿に行の無い保留の本は「—(既定表)」で、アプリは見込みの分類から引く既定表 `HOLD_REMEDY_RULES` で 1 行を出す。**判定が出ることまでを書き、合否は約束しない**。
- **精度見込み**: 正本の数から決まる語だけを書く —— 「σ 未接続」(観測の σ が繋がっていない)・「数値未解決」(刻みの収束が門の予算に入っていない)・「写像未確定」(量の対応が決まっていない)・「刻み間差 xσ・刻みでは縮まない」(門で否かつ刻みで動く幅が 1σ 未満)・「量の定義の差・同じ解の状態が未接続」(第307便e —— 保留で門が「数値未解決」の量のうち、走行の残差が正本の閉じた式の定義の差と 1σ 以内で一致する本 —— 原稿の definitionGap・判定語は保留のまま)。**刻みを細かくすれば合格に移るという予測は、正本に証拠付きの行が 0 件である**(`predictionEligible` の合計 0)—— この一覧もその予測を書かない。

## 集計

- 掲載 **124 本**(サンプル一覧に出る在位の本 —— 群 14・うち 0 本の群 4)。状況と較正の集計は掲載の本で数える。
- 状況: **達 87・部分 35・未達 2・対象外 0**。
- 較正: 4 値(合/量限定合/否/保留)**0/2/1/16**(台帳の転記)・判定保留(量定義不一致)**0**・較正対象外 **105**。
- 量の 5 区分(正本 `tests/out/calaudit-w249.json` の summary.tally の転記 —— 来歴の欄であって合否ではない): 合 **48**・窓 **0**・否 **3**・従 **2**・転 **117**。

| 群 | 本数 | 達 | 部分 | 未達 | 4 値の本 | 判定保留(量定義不一致) | 較正対象外 |
|---|---|---|---|---|---|---|---|
| 🧭 運動と時空 | 10 | 9 | 1 | 0 | 0 | 0 | 10 |
| 🌌 銀河の力学 | 9 | 9 | 0 | 0 | 0 | 0 | 9 |
| 🪐 天体の機構 | 16 | 14 | 2 | 0 | 0 | 0 | 16 |
| ⏱️ 時計と重力 | 5 | 5 | 0 | 0 | 0 | 0 | 5 |
| 💡 光の伝播 | 5 | 4 | 1 | 0 | 0 | 0 | 5 |
| 📦 箱宇宙の実験 | 11 | 11 | 0 | 0 | 0 | 0 | 11 |
| 🌡️ スピンと熱 | 12 | 7 | 5 | 0 | 0 | 0 | 12 |
| 🌗 自転と減光 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 🌀 腕と軸力 | 11 | 5 | 5 | 1 | 0 | 0 | 11 |
| 🎯 実在天体との照合 | 41 | 21 | 19 | 1 | 19 | 0 | 22 |
| 🔭 実在天体のアナロジー | 4 | 2 | 2 | 0 | 0 | 0 | 4 |
| ⚗️ 法則の実験室 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 🖥️ シミュレーション | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 📏 現実との照合 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## 🧭 運動と時空(10 本)

| 絵文字 | ID | 名前 | 目的 | 状況(達/部分/未達+根拠) | 較正 | 合わない量と差 | 精度見込み | 保留の解き方 |
|---|---|---|---|---|---|---|---|---|
| ⚾ | `projectile` | 自由落下と放物運動 | 一様重力だけで自由落下と放物運動を見せる | 部分・場の式と配置の検査のみで軌道の定量門は無い(根拠: `field.uniform-gravity`, `projectile.layout`) | 較正対象外 | — | — | — |
| ⏪ | `echo` | 時間の矢 — 巻き戻る宇宙と巻き戻らない宇宙 | 保存系は巻き戻り摩擦系は戻らないことを比べる | 達・反転後の復帰と摩擦での不復帰が門を通過(根拠: `echo.leapfrog-return`, `echo.friction-noreturn`) | 較正対象外 | — | — | — |
| 🪗 | `compactForceToy` | コンパクト力の符号 — 近点は前へ回るか後ろへ回るか | 3 候補の追加力が近点を回す向きを比べる | 達・力の符号と整合を純関数とエンジンで確認(根拠: `behavior.compactForce`) | 較正対象外 | — | — | — |
| 🐌 | `inertialDragPair` | 慣性引きずりの 2 体 — 座標の差分で動かす並進引きずり | 法則版 inertial の並進引きずりを宣言した本だけで走らせ近点移動と上界を測る | 達・合成則 solve が既定・引きずり OFF でビット同一・Δϖ は限定模型と相対 1.1e-5・上界 0.0021・回転と連鎖は未実装(根拠: `tests/out/inertial-w290c.json`) | 較正対象外 | — | — | — |
| 🌐 | `coord3dKeplerTilt` | 傾いた軌道面の二体 — 三次元の楕円(原理) | 三次元の座標で傾いた軌道面の楕円を走らせ周期と軌道面の保存を測る | 達・零試験で二次元とビット同一・周期の差は相対 7.9e-4(刻み 1/2 で 2.1e-4)・軌道面のずれ 4.1e-5°・三次元の引きずりは第 2 段(根拠: `tests/out/coord3d-w298a.json`) | 較正対象外 | — | — | — |
| 🎲 | `coord3dSpinPrecess` | 自転軸の歳差 — 1 粒子だけ軸を有効化(原理) | 三次元で 1 粒子だけ自転軸を有効化し宣言した歳差で回す表示を確かめる | 達・軸は解析値と 2.5e-16 で一致・傾きは保存・歳差は規定運動でトルクからは求めない・軸は力に入らない(根拠: `tests/out/coord3d-w298a.json`) | 較正対象外 | — | — | — |
| 👥 | `twoBodyOnly3d` | 天体が 2 つだけの宇宙 — 互いに慣性と座標を決め合う(質量比 1:10・三次元) | 天体が 2 つだけの宇宙で、互いの引きずりと局所重力の決まり方を見る | 達・引きずりと局所重力の比 = 質量の比 10・共通の並進は門 1e-10 の内・近点の比 1.1100(h/4)(根拠: `tests/out/twobody-w357e.json`) | 較正対象外 | — | — | — |
| ♊ | `binaryCheckEqualInertial3d` | 連星の検証サンプル(等質量・三次元)— K1 の規則と (1 + (4/3)η) の物差し | 連星の geoPN=3 三次元の検証サンプル(等質量)—— OFF を差し引いた近点の移動の比を 1 + (4/3)η と並べる | 達・比 1.3331(h/4・c₀ = 30)・1 + (4/3)η = 1.33333(根拠: `tests/out/binbooks-w322b.json`) | 較正対象外 | — | — | — |
| ⚖️ | `binaryCheckRatio3Inertial3d` | 連星の検証サンプル(質量比 1:3・三次元)— K1 の規則と (1 + (4/3)η) の物差し | 連星の geoPN=3 三次元の検証サンプル(質量比 1:3)—— 近点の移動の比が質量比で変わるのを 1 + (4/3)η と並べる | 達・比 1.2498(h/4・c₀ = 30)・1 + (4/3)η = 1.25000(根拠: `tests/out/binbooks-w322b.json`) | 較正対象外 | — | — | — |
| 🫂 | `boxBinaryToy` | 箱宇宙と連星 — 等質量だと背景に対する移動が消える | 等質量で共通移動が相対軌道から消えるかを測る | 達・等質量で消え質量差の対照では残る(根拠: `behavior.boxBinary`) | 較正対象外 | — | — | — |

## 🌌 銀河の力学(9 本)

| 絵文字 | ID | 名前 | 目的 | 状況(達/部分/未達+根拠) | 較正 | 合わない量と差 | 精度見込み | 保留の解き方 |
|---|---|---|---|---|---|---|---|---|
| 🌌 | `galaxy` | 銀河の回転曲線 | 中心天体の引きずりで外縁の回転が速まるかを測る | 達・外縁速度比 1.521 が門 >1.04 を通過(根拠: `claim.galaxy-outerboost`) | 較正対象外 | — | — | — |
| 🎡 | `galaxyStd` | 空間引きずりの基準実験 — 銀河標準 | 重力と引きずりだけで外縁の増速を測る基準 | 達・外縁速度比 1.266 が窓 1.15〜1.4 内(根拠: `claim.galaxystd-outerboost`) | 較正対象外 | — | — | — |
| 💫 | `galaxyGeo2` | v−u統一測地線の銀河 | v−u 測地線則で外縁の増速を比べる | 達・λ_PN=0 で外縁速度比 1.180 が窓内・クランプ 0(根拠: `claim.galaxygeo2-outerboost`) | 較正対象外 | — | — | — |
| 🫓 | `galaxyGeo2Flat3d` | v−u統一測地線の銀河(三次元・平面の写し) | 💫 の面内の写しを三次元の步で走らせ二次元と比べる | 達・外縁速度比が二次元の 💫 と同じビット・クランプ 0・z と軸は面内のまま(根拠: `tests/out/geo2flat-w322a.json`) | 較正対象外 | — | — | — |
| 🥞 | `galaxyGeo2Thick3d` | v−u統一測地線の銀河(三次元・有限厚) | 💫 の面内の配置に有限厚(±3h の外は再抽選)を足し三次元の步で走らせる | 達・外縁速度比 1.1819・z の二乗平均 7.68 → 8.02・脱落 0(有限厚は初期の近似)(根拠: `tests/out/geo2thick-w324a.json`) | 較正対象外 | — | — | — |
| 🧇 | `galaxyGeo2ThickTilt3d` | v−u統一測地線の銀河(三次元・有限厚・傾き有り) | 🥞 と同じ入力を全体で回した対の本で回転共変の程度を測る | 達・面の座標の外縁速度比 1.1819(🥞 との差は刻みの感度の内・差は単精度の配列から)(根拠: `tests/out/geo2thick-w324a.json`) | 較正対象外 | — | — | — |
| 🍳 | `galaxyDB` | ディスクとバルジ — 回転支持と分散支持 | 円盤の回転支持とバルジの分散支持を比べる | 達・速度分散の比 2.37 が窓 2.2〜3.0 内(根拠: `claim.galaxydb-contrast`) | 較正対象外 | — | — | — |
| 🌫️ | `collapse` | 自己重力雲の崩壊と原始星形成 | 自己重力の崩壊と放射冷却の役割を分ける | 達・冷却は温度を下げるが崩壊の速さは変えない(根拠: `behavior.collapse-cooling`) | 較正対象外 | — | — | — |
| 🎠 | `galaxyMeshSpiral` | 銀河の空間メッシュ | 銀河の空間メッシュを局所場と物質線で表す | 達・場の加算・単調性・物質線を純関数で確認(根拠: `behavior.galaxyMesh`) | 較正対象外 | — | — | — |

## 🪐 天体の機構(16 本)

| 絵文字 | ID | 名前 | 目的 | 状況(達/部分/未達+根拠) | 較正 | 合わない量と差 | 精度見込み | 保留の解き方 |
|---|---|---|---|---|---|---|---|---|
| 🌘 | `earthMoonRealKF1` | 地球と月(実単位・kFrame=1)— q 引きずりの機構実験(現象論の参照・旧フィット) | 二体 + 引きずりで近点移動 8.85 年にフィットできる記録を示す原理の参照 | 部分・8 公転窓の記録 恒星月 27.3216 日・近点 8.850 年(118 公転 14.30 年 —— 恒久ではない)(根拠: `tests/out/emrecord-w336a.json`, `tests/out/refit-w297a.json`, `tests/out/emgrid-w280b.json`, `tests/out/calaudit-w249.json`) | 較正対象外 | — | — | — |
| ☿ | `mercury` | 水星の近日点前進 — 測地線1PN | 測地線 1PN の有無で近日点前進を比べる | 達・基線差引の比 2.98 が理論 3±0.6 内(根拠: `behavior.mercury-builtin`) | 較正対象外 | — | — | — |
| ⭐ | `binary` | 連星系と周連星円盤 | 連星の間隔と周連星円盤を保つ | 達・間隔 122.9・円盤 240/240 残存が門内(根拠: `behavior.binary`) | 較正対象外 | — | — | — |
| ♾️ | `fig8` | 三体問題 — 8の字軌道 | 等質量三体の 8 の字周期軌道を見せる | 部分・画像回帰のみで軌道の定量門は無い(根拠: `shot.regress-fig8`, `preset.fig8`) | 較正対象外 | — | — | — |
| 💥 | `counterring` | 順行・逆行リングの衝突 | 逆向きに回る環どうしの摩擦を比べる | 達・摩擦あり 0.74・なし 0 の対照(根拠: `new.counterring`) | 較正対象外 | — | — | — |
| 🌪️ | `spinup` | 収縮とスピン加速 | 閉じた系で収縮とともにスピンが上がるかを見る | 達・収縮 3.02 倍で ω 8.46 倍・帳簿は閉じる(根拠: `behavior.spinup`) | 較正対象外 | — | — | — |
| 🏮 | `pulsarSolo` | パルサー灯台(単体)— 傾いた軸と運動学の時計 | 傾いた軸の灯台と運動学の時計を見せる | 達・位相の恒等と軸の傾きを検査で確認(根拠: `behavior.templates229`) | 較正対象外 | — | — | — |
| 🎇 | `supernovaCore` | 超新星 — 1つの赤色巨星が多層の外殻を吹き飛ばし、時計つきの核が残る | 1 つの星の殻放出と時計つきの核の残存を見せる | 達・分割放出と帳簿の閉じを検査で確認(根拠: `behavior.supernova`) | 較正対象外 | — | — | — |
| ⚪ | `whiteDwarfDFM` | 白色矮星 — 赤色巨星の外殻が徐々に剥がれ、育ったコアが残る(DFM版) | 殻が繰り返し剥がれて育ったコアが残る | 達・4 回の放出と帳簿の閉じを検査で確認(根拠: `behavior.shedRepeat`) | 較正対象外 | — | — | — |
| 🔘 | `whiteDwarfBareDFM` | 裸のコア — 最後の殻が剥がれて Mc=M の終端状態になる(DFM版・⚪ の variant) | 最後の殻が剥がれ Mc=M の終端を作る | 達・終端と結合エネルギーの台帳を検査で確認(根拠: `behavior.coreTerminal`) | 較正対象外 | — | — | — |
| 🎆 | `envelopeShedDFM` | エンベロープの分割放出 — 限界回転のコアが殻をガスへ割って出す(DFM版) | 限界回転のコアが殻を粒へ割って出す | 達・1 回の放出と帳簿の閉じを検査で確認(根拠: `behavior.envelopeShed`) | 較正対象外 | — | — | — |
| 🐮 | `lfbotTrap` | 閉じ込めた光の解放 — 減光で溜めた自光をコアの崩壊で放つ(トイ仮説) | 減光で溜めた光をコアの崩壊で放つトイ | 達・光の口座の保存と対照 4 本を検査で確認(根拠: `behavior.lightTrapLedger`) | 較正対象外 | — | — | — |
| 🧅 | `layeredCoreDFM` | 親子コア — 観測半径は殻・質量はコア(二層天体の原理) | 観測半径は殻・質量はコアに分ける二層天体 | 達・検証器と球殻定理の検査を通過(根拠: `behavior.bodyLayers`) | 較正対象外 | — | — | — |
| ⚙️ | `spinDipoleBinary` | スピン双極子の連星 — 自転が押し合うと近点が逆行する(玩具) | スピン双極子の力で近点が逆行するかを見る | 達・近点移動 −0.980°/周が解析値の 0.994 倍(根拠: `behavior.spinDipole`) | 較正対象外 | — | — | — |
| 🌬️ | `gasCohSurface` | 気体の殻の表面随伴 — 外殻が気体だと引きずりは弱い | 気体の殻で表面の引きずりが弱まるかを見る | 達・表面随伴の比が gasCoh に一致(根拠: `behavior.gasCohSurface`) | 較正対象外 | — | — | — |
| 🛟 | `saturnRotVertExplore3d` | 土星の環と円盤引きずりの鉛直の型(探索用・未較正) | 円盤引きずりの鉛直の型(探索用・未較正)を見える倍率で傾いた環の粒子に当てる | 達・3000 步の傾きの比が目安の 5% の内・鍵 OFF の写しは不変・lib との点の照合 8/8(根拠: `tests/out/rotvert-w339a.json`) | 較正対象外 | — | — | — |

## ⏱️ 時計と重力(5 本)

| 絵文字 | ID | 名前 | 目的 | 状況(達/部分/未達+根拠) | 較正 | 合わない量と差 | 精度見込み | 保留の解き方 |
|---|---|---|---|---|---|---|---|---|
| ⏱️ | `gclock` | 重力による時計の遅れ | 重力の強さだけを変えて時計の遅れを比べる | 達・τ/t と解析値の差 1.1×10⁻⁵(根拠: `new.gclock`) | 較正対象外 | — | — | — |
| 🛰️ | `grcal` | 弱場GR較正 — GPS・光・シャピロ | 時計・光の偏向・遅延を 1 本の弱場則で出す | 達・式の値 5 つが事前登録窓 ±1% 内(縮尺模型)(根拠: `behavior.grcal3`, `grcal.clocks`) | 較正対象外 | — | — | — |
| 🕰️ | `grcalGps` | GPS 時計差 — 重力項と速度項の分解 | GPS の時計差を重力項と速度項に分ける | 達・式の値 正味 38.50 μs/日が窓 ±1% 内(根拠: `behavior.grcal3`) | 較正対象外 | — | — | — |
| 🌟 | `grcalLight` | 太陽縁の光偏向 — 1.75″ | 太陽縁の光の偏向を同じ場から出す | 達・式の値 1.7509″ が窓 ±1% 内(根拠: `behavior.grcal3`) | 較正対象外 | — | — | — |
| ⏲️ | `grcalShapiro` | シャピロ遅延 — 太陽の近くを往復する信号 | 太陽の近くを往復する信号の遅れを見せる | 達・式の値 281.0 μs が窓 ±1% 内(根拠: `behavior.grcal3`) | 較正対象外 | — | — | — |

## 💡 光の伝播(5 本)

| 絵文字 | ID | 名前 | 目的 | 状況(達/部分/未達+根拠) | 較正 | 合わない量と差 | 精度見込み | 保留の解き方 |
|---|---|---|---|---|---|---|---|---|
| 💡 | `lensing` | 重力レンズと光子捕捉 | 重力場で光線が曲がり捕まることを見せる | 部分・画像回帰と光速宣言の検査のみ(根拠: `shot.regress-lensing`, `light.canonical-builtins`) | 較正対象外 | — | — | — |
| 🌗 | `spinlens` | 回る星のレンズ — 非対称湾曲 | 回る星の場で光の曲がりが非対称になるかを見る | 達・非対称度 0.678・kF0 対照で 0(根拠: `spinlens.kframe-control`) | 較正対象外 | — | — | — |
| 🔭 | `blens` | 連星重力レンズ | 上下の連星で光線束が曲がる向きを見る | 達・上下で偏向の符号が反転し門を通過(根拠: `behavior.blens`) | 較正対象外 | — | — | — |
| 🌆 | `reddening` | 暗黒雲の赤化 — 体積吸収と波長依存 | 波長ごとの吸収で雲越しの光が赤へ寄るかを見る | 達・青/赤の比 0.0154 が窓内・用量反応は一定(根拠: `claim.reddening`) | 較正対象外 | — | — | — |
| 🪞 | `mmPhaseToy` | 2腕の往復位相 — 正対照が先 | 2 本の腕を往復した光の位相差を正対照から測る | 達・正対照の位相差が解析式どおり(根拠: `behavior.mmPhase`) | 較正対象外 | — | — | — |

## 📦 箱宇宙の実験(11 本)

| 絵文字 | ID | 名前 | 目的 | 状況(達/部分/未達+根拠) | 較正 | 合わない量と差 | 精度見込み | 保留の解き方 |
|---|---|---|---|---|---|---|---|---|
| ☝️ | `boxone` | 箱宇宙 — 天体が 1 つだけの箱 | 天体が 1 つだけの箱で、並進が内部の相対の量に出ないかを見る | 達・並進ありと並進を引いた写しの 600 步の相対の量の差が門 1e-3 の内・走り直しで指紋が同じ(根拠: `tests/out/boxone-w357d.json`) | 較正対象外 | — | — | — |
| 📦 | `boxtrans` | 箱宇宙 — 並進する箱 | 並進する箱の中で共動と時計を比べる | 達・共動 τ/t 0.9994・固有運動 0.9881 が門内(根拠: `box.trans-clocks`) | 較正対象外 | — | — | — |
| 🌀 | `boxrot` | 箱宇宙 — 回る箱と空間の支え | 回る壁が軌道を支えるかを kF で比べる | 達・半径比 kF1 0.988・kF0 3.71(外部駆動)(根拠: `box.rot-support`) | 較正対象外 | — | — | — |
| 📈 | `boxexpand` | 箱宇宙 — 膨張する箱(質点リング) | 膨張させた壁に内側がどこまで追随するかを測る | 達・追随は a でなく √a(比 0.9996)(根拠: `box.expand-sqrt`) | 較正対象外 | — | — | — |
| 🫧 | `boxcomoving` | 箱宇宙 — UniverseBoxの完全共動 | 連続背景で完全共動と膨張の時計を見せる | 達・赤方偏移が規定 a(t) と相対 1e-6 未満(根拠: `box.redshift`) | 較正対象外 | — | — | — |
| 🪢 | `boxbound` | 箱宇宙 — 束縛系は膨張に逆らえるか | 膨張の中で連星の束縛が残るかを測る | 達・宣言した膨張率と時間窓の門を通過(根拠: `behavior.boxbound`) | 較正対象外 | — | — | — |
| 🫁 | `boxbreath` | 箱宇宙 — 呼吸する宇宙 | 膨張と収縮を 1 周期戻して変位を測る | 達・1 周期後 RMS 0.049 が門 <1 を通過(根拠: `box.breath-return`) | 較正対象外 | — | — | — |
| 🔦 | `boxredshift` | 箱宇宙 — 光の赤方偏移(A・B・C) | 共動する 3 点の間で光の赤方偏移を比べる | 達・z_A 2.93・z_B 0.958 が窓内(根拠: `box.photon-abc`) | 較正対象外 | — | — | — |
| 🧭 | `probeH` | 箱宇宙 — ２つのH推定器(ハッブルテンション類似) | 幾何と速度の 2 つの H 推定器の差を見せる | 達・2 つの読みが解析値と 1% 内(根拠: `behavior.probeH`) | 較正対象外 | — | — | — |
| 🕊️ | `freebox` | 箱宇宙 — 自由な箱(膨張の原因) | 自由な壁の重力と圧力で膨張を作る | 達・4 象限対照で加速の源は圧力(根拠: `freebox.quadrants`) | 較正対象外 | — | — | — |
| 🕸️ | `cosmicweb` | 箱宇宙 — 膨張と自己重力の綱引き(コズミックウェブ類似) | 膨張と自己重力の綱引きで疎密を作る | 達・δ² 5.4 倍・膨張なし対照で成長が大(根拠: `behavior.cosmicweb`) | 較正対象外 | — | — | — |

## 🌡️ スピンと熱(12 本)

| 絵文字 | ID | 名前 | 目的 | 状況(達/部分/未達+根拠) | 較正 | 合わない量と差 | 精度見込み | 保留の解き方 |
|---|---|---|---|---|---|---|---|---|
| 🔥 | `gas` | 気体の熱平衡 | 温度差のある気体が熱平衡へ向かうかを見る | 達・温度分散の比 0.647 が門 <0.75 を通過(根拠: `behavior.gas`) | 較正対象外 | — | — | — |
| 🎈 | `pressure` | 熱の圧力 — 熱は押し広げる | 熱の斥力が周りの気体を押し広げるかを測る | 達・半径比 1.18・熱斥力 0 の対照 1.02(根拠: `behavior.pressure`) | 較正対象外 | — | — | — |
| 📏 | `conduction` | 熱伝導 — 近いほど速く伝わる | 接触なしの粒の列で熱が伝わるかを見る | 達・距離に応じた温度の順と減衰比が門内(根拠: `behavior.conduction`) | 較正対象外 | — | — | — |
| 🛷 | `frictionHeat` | 摩擦熱 — 運動が熱に変わる | 摩擦で運動が熱へ移ることを見せる | 部分・受理と構築の検査のみで熱移送の門は無い(根拠: `preset.frictionHeat`) | 較正対象外 | — | — | — |
| 🌈 | `coolrace` | 放射冷却 — 高温ほど速い | 高温ほど速く冷えることを比べる | 達・冷却速度比 15.8/15.1(理論 16)(根拠: `new.coolrace`) | 較正対象外 | — | — | — |
| ♨️ | `convection` | 加熱の対流 — 伝熱する箱 | 壁からの加熱で対流を保つ | 達・循環 20.9・熱流の収支差 0.2% が門内(根拠: `behavior.convection`) | 較正対象外 | — | — | — |
| 🧪 | `buoyancy` | 重力分離と浮力 | 重力場で重い粒と軽い粒が分かれるかを見る | 達・平均高さの差 163.8 が門 >20 を通過(根拠: `behavior.buoyancy`) | 較正対象外 | — | — | — |
| ☕ | `cooling` | 冷めるお茶 — 壁への熱伝導 | 冷たい壁へ熱が逃げていく様子を見せる | 部分・受理と構築の検査のみで冷却の門は無い(根拠: `preset.cooling`) | 較正対象外 | — | — | — |
| 🧬 | `emergent` | 三態の創発 — 結合の予算 | 結合の予算だけで三態を作る | 部分・多 seed の門は通過・摂動回復は通らず E1(根拠: `behavior.phase-multiseed`) | 較正対象外 | — | — | — |
| 🧊 | `emergent2` | 格子も分子も — 予算×角度 | 結合の予算と角度で蜂の巣の格子を作る | 部分・多 seed の門は通過・摂動回復は通らず E1(根拠: `behavior.phase-multiseed`) | 較正対象外 | — | — | — |
| ⛓️ | `chain2` | 鎖の創発 — 予算2×角度180° | 予算 2 と理想角 180° で鎖を作る | 部分・多 seed の門は通過・摂動回復は通らず E1(根拠: `behavior.phase-multiseed`) | 較正対象外 | — | — | — |
| ♻️ | `chaincycle` | 温度循環 — 鎖の凍結と解離 | 壁温だけで鎖の凍結と解離を往復させる | 達・凍結末と解離末の窓を通過(E1)(根拠: `claim.chaincycle`, `behavior.phase-multiseed`) | 較正対象外 | — | — | — |

## 🌗 自転と減光(0 本)

(内蔵サンプルは 0 本)

## 🌀 腕と軸力(11 本)

| 絵文字 | ID | 名前 | 目的 | 状況(達/部分/未達+根拠) | 較正 | 合わない量と差 | 精度見込み | 保留の解き方 |
|---|---|---|---|---|---|---|---|---|
| 🥢 | `axisBarStill` | 回転ゼロの棒 — 軸に集まる恒星 | 回転のない円盤で軸への力が棒を作るかを見る | 部分・力の純関数は検査済み・棒の形の門は無い(根拠: `behavior.armBarPure`, `preset.axisBarStill`) | 較正対象外 | — | — | — |
| 🎏 | `axisBarArms` | 内側の棒と外側の2本腕 — 回転する円盤 | 回転する同じ円盤で内側の棒と外側の腕を見る | 部分・力の純関数は検査済み・腕の形の門は無い(根拠: `behavior.armBarPure`, `preset.axisBarArms`) | 較正対象外 | — | — | — |
| 🎚️ | `axisBarReach` | 棒の到達長 R_b — 外縁までは届かない | 到達長だけを変えて棒の長さを比べる | 部分・力の純関数は検査済み・長さの門は無い(根拠: `behavior.armBarPure`, `preset.axisBarReach`) | 較正対象外 | — | — | — |
| 🔮 | `shapeToyCluster` | 球状星団トイ — 3D 正規分布の参照モデル(較正ではない) | 指定した 3D 正規分布を保つ参照模型(三次元の本 —— z は座標) | 達・形状トイの門を通過(規定分布の模型)(根拠: `docs.shapeToyCriteria`, `tests/out/shapetoy-w274d.json`, `tests/out/ref3d-w299e.json`) | 較正対象外 | — | — | — |
| 🥏 | `shapeToyDisk` | 腕なし回転円盤トイ — 扁平は σ_z の宣言(較正ではない) | 指定した薄い回転円盤を保つ参照模型(三次元 —— 厚みは σ_z の宣言) | 未達・形状トイの門で KS 比 1.330 が不合格(根拠: `docs.shapeToyCriteria`, `tests/out/shapetoy-w274d.json`, `tests/out/ref3d-w299e.json`) | 較正対象外 | — | — | — |
| 🧵 | `shapeToyArm` | 腕単体トイ — 腕の軸に対して正規分布(較正ではない) | 腕の軸に対する正規分布を保つ参照模型(三次元) | 達・形状トイの門を通過(規定分布の模型)(根拠: `docs.shapeToyCriteria`, `tests/out/shapetoy-w274d.json`, `tests/out/ref3d-w299e.json`) | 較正対象外 | — | — | — |
| 🍭 | `shapeToySpiral` | 渦巻の参照模型 — 円盤+対数螺旋の腕(宣言した形・較正ではない) | 🥏 の円盤と 🧵 の幅を継いだ宣言の 2 本腕を保つ渦巻の参照模型(三次元・創発ではない) | 部分・門 ①②③⑤⑥⑦ 通過(ピッチ角 20.58°)・④ は円盤の軸比の N 依存が ±10% 超(🥏 と同じ)(根拠: `tests/out/spiral-w290e.json`, `tests/out/ref3d-w299e.json`) | 較正対象外 | — | — | — |
| 🎱 | `shapeToyClusterCore` | 球状星団トイ(中心天体つき)— 中心スピンが束ねる構成仮説(較正ではない) | 中心スピンに依存する力学で星団を束ねる(三次元) | 達・Core 力学の門を通過(RMS 偏り 0.0101)(根拠: `docs.coreFieldCriteria`, `tests/out/corefield-w276d.json`, `tests/out/ref3d-w299e.json`) | 較正対象外 | — | — | — |
| 📀 | `shapeToyDiskCore` | 腕なし回転円盤トイ(中心天体つき)— 薄さも回転も中心スピンの帰結(較正ではない) | 中心スピンから薄さと円盤の回転を作る(三次元) | 達・Core 力学の門を通過(逆行率 0.0352)(根拠: `docs.coreFieldCriteria`, `tests/out/corefield-w276d.json`, `tests/out/ref3d-w299e.json`) | 較正対象外 | — | — | — |
| 🧹 | `shapeToyArmCore` | 棒トイ(中心天体つき)— 面内の自転軸に沿って伸びる(較正ではない) | 面内の自転軸に沿った棒を作る(三次元) | 達・Core 力学の門を通過(RMS 偏り 0.0060)(根拠: `docs.coreFieldCriteria`, `tests/out/corefield-w276d.json`, `tests/out/ref3d-w299e.json`) | 較正対象外 | — | — | — |
| 🎢 | `shapeToySpiralCore` | 中心つき渦巻の幾何参照 — Core 力学の円盤+規定運動の腕(較正ではない) | 📀 の Core 力学の円盤に規定運動の腕を載せた中心つき幾何参照(三次元・創発ではない) | 部分・門 ①②③⑤⑥⑦ 通過(ピッチ角 20.45°)・k_arm は未実装・④ は円盤の軸比の N 依存が ±10% 超(根拠: `tests/out/spiral-w290e.json`, `tests/out/ref3d-w299e.json`) | 較正対象外 | — | — | — |

## 🎯 実在天体との照合(41 本)

| 絵文字 | ID | 名前 | 目的 | 状況(達/部分/未達+根拠) | 較正 | 合わない量と差 | 精度見込み | 保留の解き方 |
|---|---|---|---|---|---|---|---|---|
| 🌙 | `earthMoonReal` | 地球と月(実単位)— 恒星月 27.32日 | 実単位の地球と月を kF0 で照合する | 部分・焦点は恒星月(kF0)の照合・月の近点の機構の同定ではない(根拠: `tests/out/calaudit-w249.json`, `docs.calibration-verdict-sync`) | 保留 | — | σ 未接続 | 恒星月は観測 σ を観測表に宣言して σ 接続器に入れる(残差 2.4×10⁻⁶)。離心率は e↔eProxy の写像を宣言する。近点は太陽(第三体)が作る量で、二体の 1PN は観測の 4×10⁻⁹ —— 1PN の是正では解けない |
| 🔆 | `emAuditSolar` | 地球と月・機構判別C(太陽+地球+月の三体)— 較正なしの太陽摂動 | 太陽摂動だけで月の近点回転を出す | 部分・焦点は太陽摂動だけの月の近点・向きは前進・年数は記録のみ(根拠: `behavior.emAudit`, `tests/out/calaudit-w249.json`) | 保留 | — | σ 未接続 | 周期の行は観測 σ を σ 接続器に入れる。近点の行は理想化の床(2D・円軌道の太陽・傾斜なし・J2 なし)の −1.1% が残り、現実の σ では否になりうる —— σ 接続を合への手順と書かない。近点は第三体の量で、1PN の是正では解けない |
| 🌦️ | `earthMoonSunInertial3d` | 太陽・地球・月(慣性決定力版・三次元)— 月の軌道傾斜 5.145° と 8.85 年への探索 | 地球の三次元版 —— 月の軌道傾斜・e′・J₂ を入れ、引きずり OFF の基線を長窓で確かめる | 達・J₂ ありで解き直し・長窓 M4 8.8495 年・交点 18.6037 年(B1 +0.0041 —— 許容の内)(根拠: `tests/out/emresolve-w306c.json`, `tests/out/j2-w305c.json`, `tests/out/baseline-w304c.json`) | 較正対象外 | — | — | — |
| 🌔 | `earthMoonOnly3d` | 地球と月だけ(慣性決定力版・三次元)— 🌦️ から太陽を外した対照 | 🌦️ から太陽を外した地球と月だけの三次元の対照で太陽の有無の差を見る | 達・恒星月 27.4903 日・引きずり OFF の二体と地球の J₂(118 窓では近点の周期は読めない)(根拠: `tests/out/emonly-w300b.json`, `tests/out/j2-w305c.json`) | 較正対象外 | — | — | — |
| 📶 | `qLockRadialAudit` | qLock 半径方向監査 — 参照点は LT 級・その外では r⁻³ を捨てる | qLock が参照軌道の外で崩れるかを監査する | 達・内側 2 点で逆行・落ち方 5.49 倍を検出(根拠: `behavior.qlockRadial`) | 較正対象外 | — | — | — |
| 📐 | `qLockRadialAuditQ3` | qLock 半径方向監査・対照(q=3)— r⁻³ 則そのものの物差し | q=3 の対照で r⁻³ 則の物差しを示す | 達・q=3 対照は qLock の 8.5 倍(門 >5)(根拠: `behavior.qlockRadial`) | 較正対象外 | — | — | — |
| ☄️ | `mercuryReal` | 水星(実単位)— 近日点前進(43.0″/世紀は RL 勾配・600 公転・λ_PN 差引き) | 水星の近日点前進を kF0 で照合する | 部分・焦点は近日点 43″/世紀・不足を軟化 70.3%・刻み 29.0%・入力 0.63% に分解(根拠: `tests/out/calaudit-w249.json`, `tests/out/mercury-w280a.json`, `docs.calibration-verdict-sync`) | 保留 | 近点移動 −6.91%(2.0×10³σ) | 数値未解決 | 近日点前進は軟化(判定行の写しで不足の 8.8%)を宣言誤差として分離し、刻み h/h2/h4 の収束を正の次数で示す(刻みが不足の 91.2%)。1PN は解析値どおりで原因ではない。公転周期は観測 σ を、離心率は e↔eProxy の写像を宣言する |
| 🟫 | `mercurySunInertialFit` | 水星と太陽(慣性決定力版・フィット)— 近点率に合わせた W₀ | 係数移送版の写しで W₀ だけを近点率(43.0″/世紀)に合わせる(semic) | 達・W₀ 221.1206・残差 1.79e-5・h/2 差 1.97e-4・周期と離心率は未調整・核は同定不可(根拠: `tests/out/refit-w303a.json`, `tests/out/fit-w297b.json`) | 較正対象外 | — | — | — |
| 🌡️ | `mercurySunInertial3d` | 太陽と水星(慣性決定力版・三次元)— K1 の規則 R_d = Y_k m(合わせない) | 太陽と水星の三次元 —— 規則 R_d = Y_k m(K1・全天体・合わせない)で近点率の差の 1PN の残差を測る | 達・r_1PN 2.618e-5″/世紀(h/2)・規則で置いた残差が門 1.000e-3 の内(根拠: `tests/out/inposk1-w315c.json`, `tests/out/k1confirm-w313d.json`, `tests/out/planets3d-w299c.json`) | 較正対象外 | — | — | — |
| 🌋 | `venusSunInertial3d` | 太陽と金星(慣性決定力版・三次元)— K1 の規則 R_d = Y_k m(合わせない) | 太陽と金星の三次元 —— 規則 R_d = Y_k m(K1・全天体・合わせない)で近点率の差の 1PN の残差を測る | 達・近点の残差 r_1PN 6.965e-5″/世紀(h/2)が門の内・内部熱と自転の逆回転は未解決(根拠: `tests/out/inposk1-w315c.json`, `tests/out/k1confirm-w313d.json`, `tests/out/planets3d-w299c.json`) | 較正対象外 | — | — | — |
| 🔴 | `marsSunInertial3d` | 太陽と火星(慣性決定力版・三次元)— K1 の規則 R_d = Y_k m(合わせない) | 太陽と火星の三次元 —— 規則 R_d = Y_k m(K1・全天体・合わせない)で近点率の差の 1PN の残差を測る | 達・r_1PN 6.091e-6″/世紀(h/2)・規則で置いた残差が門 1.000e-3 の内(根拠: `tests/out/inposk1-w315c.json`, `tests/out/k1confirm-w313d.json`, `tests/out/planets3d-w299c.json`) | 較正対象外 | — | — | — |
| 🏀 | `jupiterSunInertial3d` | 太陽と木星(慣性決定力版・三次元)— K1 の規則 R_d = Y_k m(合わせない) | 太陽と木星の三次元 —— 規則 R_d = Y_k m(K1・全天体・合わせない)で近点率の差の 1PN の残差を測る | 達・近点の残差 r_1PN 7.926e-5″/世紀(h/2)が門の内・内部熱は未解決(根拠: `tests/out/inposk1-w315c.json`, `tests/out/k1confirm-w313d.json`, `tests/out/planets3d-w299c.json`) | 較正対象外 | — | — | — |
| 🟡 | `saturnSunInertial3d` | 太陽と土星(慣性決定力版・三次元)— K1 の規則 R_d = Y_k m(合わせない) | 太陽と土星の三次元 —— 規則 R_d = Y_k m(K1・全天体・合わせない)で近点率の差の 1PN の残差を測る | 達・r_1PN 5.251e-6″/世紀(h/4)・規則で置いた残差が門 1.371e-4 の内(根拠: `tests/out/inposk1-w315c.json`, `tests/out/k1outer-w314c.json`, `tests/out/planets3d-w299c.json`) | 較正対象外 | — | — | — |
| 🍩 | `saturnRingInertial3d` | 土星の輪(慣性決定力版・三次元)— 引きずり OFF の基準 | 土星の輪を三次元の赤道面に置き面の保持と損失を測る | 達・C環内縁 20828.3 s(h/2 20824.9)・面の角 1.5e-6°・損失 0・帯は塵(有限質量の粒)(根拠: `tests/out/saturnring3d-w300c.json`, `tests/out/approxmany-w301b.json`) | 較正対象外 | — | — | — |
| 🔷 | `uranusSunInertial3d` | 太陽と天王星(慣性決定力版・三次元)— K1 の規則 R_d = Y_k m(合わせない) | 太陽と天王星の三次元 —— 規則 R_d = Y_k m(K1・全天体・合わせない)で近点率の差の 1PN の残差を測る | 達・r_1PN 1.573e-7″/世紀(h/4)・規則で置いた残差が門 2.385e-5 の内(根拠: `tests/out/inposk1-w315c.json`, `tests/out/k1outer-w314c.json`, `tests/out/planets3d-w299c.json`) | 較正対象外 | — | — | — |
| 💙 | `neptuneSunInertial3d` | 太陽と海王星(慣性決定力版・三次元)— K1 の規則 R_d = Y_k m(合わせない) | 太陽と海王星の三次元 —— 規則 R_d = Y_k m(K1・全天体・合わせない)で近点率の差の 1PN の残差を測る | 達・r_1PN -6.927e-10″/世紀(h/4)・規則で置いた残差が門 7.741e-6 の内(根拠: `tests/out/inposk1-w315c.json`, `tests/out/k1outer-w314c.json`, `tests/out/planets3d-w299c.json`) | 較正対象外 | — | — | — |
| 🗺️ | `solarSystem16Inertial3d` | 太陽系 16 体(J2000・三次元)— K1 の規則 R_d = Y_k m(診断の本・合わせない) | 太陽系 16 体を J2000 の入力のまま三次元に置き入力と刻みと K1 − 1PN の差を測る | 達・入力の検査 10 門・イオの刻みの差 15.9 km・熱の本ではない(内部熱は未解決)(根拠: `tests/out/solar16-w318c.json`) | 較正対象外 | — | — | — |
| 🟠 | `jupiterGalilean` | 木星とガリレオ衛星(実単位)— 規則を再フィットしない hold-out | 木星 4 衛星へ規則を再 fit せず当てる | 部分・焦点は規則を動かさない 4 衛星の周期(hold-out)・木星の内部熱は扱わない(根拠: `tests/out/calaudit-w249.json`, `docs.calibration-verdict-sync`) | 保留 | — | σ 未接続 | 4 衛星の公転周期・近点の観測 σ を観測表に宣言して σ 接続器に入れる(周期の残差はイオの 4.9×10⁻⁴ まで —— 1PN の桁 10⁻⁹ の外で、1PN の是正では解けない)。離心率は e↔eProxy の写像を宣言する |
| 🌇 | `venusReal` | 太陽と金星(実単位)— 自由中心の二体転写 | 自由中心の太陽–金星を実単位で照合する | 部分・焦点は自由中心の太陽–金星の周期と離心率・内部熱の本ではない(根拠: `tests/out/calaudit-w249.json`, `behavior.venusReal`) | 保留 | — | σ 未接続 | 公転周期は観測 σ を σ 接続器に入れる(残差 1.4×10⁻⁵)。離心率(+3.3%)は入力と比較値を同一解・同一元期に揃えて e↔eProxy の写像を宣言する —— 1PN(10⁻⁸ の桁)の是正では解けない |
| 🥔 | `marsMoonsReal` | 火星とフォボス・ダイモス(実単位)— テスト粒子転写 | 火星の 2 衛星を実単位で照合する | 部分・焦点は実単位の 2 衛星の公転周期・照合の走行は台帳に記帳(根拠: `tests/out/calaudit-w249.json`, `behavior.marsMoonsReal`) | 保留 | — | σ 未接続 | フォボス・ダイモスの公転周期は観測 σ を σ 接続器に入れる。離心率は e↔eProxy の写像を宣言する。近点は火星の帯状重力(J2)が作る量で 1PN は観測の 10⁻⁶ 以下 —— 1PN の是正では解けない(J2 の宣言が先) |
| 🥶 | `plutoCharonDiagInput` | 冥王星とカロン(入力を整えた二体)— 観測入力の geoPN=1 の対照 | 冥王星–カロンを 1 つの観測解に揃えた入力で照合する(家族の入口) | 部分・焦点は 1 つの観測解の周期・平均の a を使った差を記帳(根拠: `tests/out/calaudit-w249.json`, `tests/out/charoninput-w280d.json`, `tests/out/charonfix-w306e.json`) | 保留 | 周期 +0.00131%(279σ) | 定義の差・同じ解の状態が未接続 | 同一解・同一元期の状態ベクトル(または軌道要素)と GM・共分散・座標時を揃える(閉じた式だけで +7.216805 s が残る —— 刻みの細分化では消えない)。1PN の源集合の寄与は 10⁻⁷ s の桁で、1PN の是正では解けない |
| 🟪 | `plutoCharonInertialFit` | 冥王星とカロン(慣性決定力版)— 二体のケプラーの初期状態・引きずり OFF | 二体のケプラーの初期状態で引きずり OFF の基線を確かめる(周期は入力の整合) | 達・引きずり OFF・a 19595.593 km(標的の P と GM から)・残差 +0.00437 s(軟化)・旧 W₀ は履歴(根拠: `tests/out/charonfix-w306e.json`, `tests/out/charonaudit-w305e.json`) | 較正対象外 | — | — | — |
| 💠 | `uranusReal` | 天王星の環と主要5衛星(実単位) | 天王星の環と 5 衛星を実単位で照合する | 部分・焦点は 5 衛星の周期・環の群は試験粒子(質量のある粒の較正と読まない)(根拠: `tests/out/calaudit-w249.json`, `behavior.uranusReal`, `tests/out/tpsign-w284e.json`, `behavior.testParticleSigned`) | 保留 | — | σ 未接続 | 5 衛星の公転周期と天王星の自転は観測 σ を σ 接続器に入れる(周期の残差はミランダの 6.8×10⁻⁴ まで)。離心率は e↔eProxy の写像を宣言する。近点は天王星の帯状重力が作る量で 1PN は観測の 10⁻⁵ —— 1PN の是正では解けない |
| 🌊 | `neptuneReal` | 海王星とトリトン(実単位)— 逆行衛星の二体 | 逆行衛星トリトンを実単位で照合する | 部分・焦点は逆行衛星トリトンの周期と公転の向き(根拠: `tests/out/calaudit-w249.json`, `behavior.neptuneReal`) | 保留 | — | σ 未接続 | トリトンの公転周期と自転は観測 σ を σ 接続器に入れる(周期の残差 4.2×10⁻⁵)。離心率は e↔eProxy の写像を宣言する。近点は海王星の帯状重力が作る量で 1PN は観測の 4×10⁻⁵ —— 1PN の是正では解けない |
| ✨ | `alphaCenAB` | αケンタウリAB(実単位)— 恒星連星の二体 | α Cen AB を kF0 で照合する | 部分・焦点は実単位・kF0 の連星の公転周期(限定した量だけ・系全体ではない)(根拠: `tests/out/calaudit-w249.json`, `behavior.alphaCenAB`) | 量限定合 | — | 写像未確定 | — |
| 🌟 | `siriusAB` | シリウスAB(実単位)— 白色矮星との連星 | シリウス AB を kF0 で照合する | 部分・焦点は実単位・kF0 の連星の公転周期(限定した量だけ・系全体ではない)(根拠: `tests/out/calaudit-w249.json`, `behavior.siriusAB`) | 量限定合 | — | 写像未確定 | — |
| 🌠 | `siriusABInertial3d` | シリウスAB(慣性決定力版・三次元)— K1 の規則 R_d = Y_k m(合わせない)・無自転 | シリウス AB の geoPN=3 三次元(無自転)—— K1 の規則で同じ入力の geo1 との近点の移動の比を見る | 達・比 1.2951(h/4)・1 + (4/3)η = 1.29499(系ごとの値)(根拠: `tests/out/binbooks-w322b.json`) | 較正対象外 | — | — | — |
| 🔶 | `alphaCenABInertial3d` | αケンタウリAB(慣性決定力版・三次元)— K1 の規則 R_d = Y_k m(合わせない)・並進だけ | α Cen AB の geoPN=3 三次元(並進だけ)—— K1 の規則で同じ入力の geo1 との近点の移動の比を見る | 達・比 1.3310(h/4)・1 + (4/3)η = 1.33091(系ごとの値)(根拠: `tests/out/binbooks-w322b.json`) | 較正対象外 | — | — | — |
| 🔸 | `alphaCenABInertial3dJ` | αケンタウリAB(慣性決定力版・三次元)— 源の角運動量 J(f は模型の入力・軸はノブ) | α Cen AB の geoPN=3 三次元に源の J(fSrc は模型の入力・軸はノブ)—— 並進だけの 🔶 との差 | 達・J − 並進だけ -2.1e-13 rad/公転(h/4・軸はノブの既定)(根拠: `tests/out/obsspin-w324b.json`) | 較正対象外 | — | — | — |
| 📟 | `psrDoubleABInertial3d` | 二重パルサー J0737−3039A/B(慣性決定力版・三次元)— 天体ごとの観測の自転 obsSpin(軸は推定の傾きとノブ) | J0737 の geoPN=3 三次元 —— 天体ごとの観測の自転 obsSpin(推定の傾きとノブの軸) | 達・源の J − 並進だけ -1.770e-9 rad/公転(h/4)・B の寄与 0.57%(根拠: `tests/out/obsspin-w324b.json`) | 較正対象外 | — | — | — |
| 📻 | `psrDoubleAB` | 二重パルサー J0737−3039A/B(実単位)— 2.45時間の中性子星連星 | 二重パルサーを kF0 で照合する | 部分・焦点はタイミングの公転周期・同一解と同一元期の入力が先(根拠: `tests/out/calaudit-w249.json`, `docs.calibration-verdict-sync`) | 保留 | 周期 +0.00307%(1.1×10⁶σ) | 数値未解決・写像未確定 | 公転周期は σ の 10⁶ 倍の差で、タイミング解の Pb と同一解・同一元期の入力(1PN で一貫した初期状態)を揃えるのが先 —— EIH の式・源集合の是正ではない。近点は h/h2/h4 の収束を示す。離心率は e_T↔eProxy の写像を宣言する |
| 🧮 | `psrJ1757DFM` | PSR J1757−1854(実単位)— 観測質量の中性子星連星2例目 | J1757 を観測質量・geoPN=1 で照合 | 部分・焦点はタイミングの公転周期・同一解と同一元期の入力が先(根拠: `tests/out/calaudit-w249.json`, `docs.calibration-verdict-sync`) | 保留 | 周期 +0.000114%(4.2×10³σ) | 数値未解決・写像未確定 | 公転周期は σ の 4200 倍の差で、タイミング解の Pb と同一解・同一元期の入力(1PN で一貫した初期状態)を揃えるのが先 —— EIH の式・源集合の是正ではない。近点は h/h2/h4 の収束を示す。離心率は e_T↔eProxy の写像を宣言する |
| 🩺 | `psrJ1946DFM` | PSR J1946+2052(実単位)— 観測質量の銀河系で最短周期の中性子星連星 | J1946 を観測質量・geoPN=1 で照合 | 部分・焦点はタイミングの公転周期・同一解と同一元期の入力が先(根拠: `tests/out/calaudit-w249.json`, `docs.calibration-verdict-sync`) | 保留 | 周期 +0.00495%(1.9×10⁵σ) | 数値未解決・写像未確定 | 公転周期は σ の 10⁵ 倍の差で、タイミング解の Pb と同一解・同一元期の入力(1PN で一貫した初期状態)を揃えるのが先 —— EIH の式・源集合の是正ではない。近点は h/h2/h4 の収束を示す。離心率は e_T↔eProxy の写像を宣言する |
| 📿 | `psrB1534` | PSR B1534+12(実単位・観測版)— 第 4 の凍結 hold-out の入力確認 | B1534 の観測入力を kF0 で確かめる | 部分・焦点はタイミングの公転周期・同一解と同一元期の入力が先(根拠: `tests/out/calaudit-w249.json`, `docs.calibration-verdict-sync`) | 保留 | 周期 +0.000876%(3.7×10⁵σ) | 数値未解決・写像未確定 | 公転周期は σ の 10⁵ 倍の差で、タイミング解の Pb と同一解・同一元期の入力(1PN で一貫した初期状態)を揃えるのが先 —— EIH の式・源集合の是正ではない。近点は h/h2/h4 の収束を示す。離心率は e_T↔eProxy の写像を宣言する |
| 🎐 | `gw150914` | GW150914(実単位)— 連星ブラックホールの基準状態 | GW150914 の合体前の基準状態を転写する | 部分・焦点は合体前の基準状態の転写・波形の照合ではない(根拠: `tests/out/calaudit-w249.json`, `behavior.gw150914`) | 保留 | — | σ 未接続 | GM/(c²a)≈0.05 の強場で、保守的な 1PN の範囲外 —— 1PN の照合の対象にしない。判定に入れるには 2PN・放射反作用の扱いと、公転周期・離心率の比較値の観測 σ(判定器の SIGMA_BODY)を宣言する |
| ⏰ | `gw150914Merge4s` | GW150914 の合体(約4秒の窓の宣言)— 放射の方向と用量の較正 variant | 放射の向きと量を宣言して約 4 秒の合体を回す | 部分・焦点は約 4 秒の放射の宣言・波形の照合ではない(根拠: `tests/out/calaudit-w249.json`, `docs.calibration-verdict-sync`) | 保留 | — | σ 未接続 | GM/(c²a)≈0.05 の強場で、保守的な 1PN の範囲外 —— 1PN の照合の対象にしない。判定に入れるには 2PN・放射反作用の扱いと、融合時刻・公転周期・離心率の比較値の観測 σ(判定器の SIGMA_BODY)を宣言する |
| ⚛️ | `gw150914SpinDipole` | BH 合体直前のスピン双極子 — λ=1 の届く場所(原理) | 合体直前で λ=1 のスピン双極子の強さを測る | 達・強さ η が純関数とエンジンで一致(根拠: `behavior.gwSpinDipole`) | 較正対象外 | — | — | — |
| 📡 | `saturnZonalD68` | 土星の近点移動(実単位・D68 — 帯状重力の照合) | 帯状重力係数で D68 の近点移動を照合する | 未達・焦点は帯状重力の D68 の近点移動・代表量が門の外(根拠: `tests/out/calaudit-w249.json`, `docs.calibration-verdict-sync`) | 否 | 近点移動 −0.306%(14.6σ) | 刻み間差 4×10⁻³σ・刻みでは縮まない | — |
| 🧷 | `saturnD68Consistent` | 土星 D68 の近点移動 — 整合した初速の診断コピー(e*=0.001) | 📡 の差を同じ窓で初速の幾何と他の要因に分ける | 達・同じ抽出器・同じ窓で差 +42.66 deg/yr のうち初速が +42.23(根拠: `tests/out/d68-w280e.json`) | 較正対象外 | — | — | — |
| 📎 | `saturnD68ObsOrbit` | 土星 D68 の近点移動 — 観測定義の軌道の診断コピー(ae=25 km) | 観測の a と ae の定義で置いた D68 の近点移動を測る | 部分・同じ窓で測定済み・a と ae と ϖ̇ の同一元期の組は未確認(根拠: `tests/out/d68-w280e.json`) | 較正対象外 | — | — | — |
| 💍 | `saturnRingReal` | 土星の環(実単位)— 見えないのが正しい | 実単位の土星の環を kF0 で照合する | 部分・焦点は環の帯の周期・群は試験粒子(質量のある粒の較正と読まない)(根拠: `tests/out/calaudit-w249.json`, `docs.calibration-verdict-sync`, `tests/out/tpsign-w284e.json`, `behavior.testParticleSigned`) | 保留 | — | σ 未接続 | C環内縁・ミマス・タイタンの公転周期・近点の観測 σ を観測表に宣言して σ 接続器に入れる。離心率は e↔eProxy の写像を宣言する。C環内縁の周期の残差 −0.27% は 1PN(10⁻⁸ の桁)の外で、1PN の是正では解けない |

## 🔭 実在天体のアナロジー(4 本)

| 絵文字 | ID | 名前 | 目的 | 状況(達/部分/未達+根拠) | 較正 | 合わない量と差 | 精度見込み | 保留の解き方 |
|---|---|---|---|---|---|---|---|---|
| 🍇 | `tuc47` | 球状星団 47 Tuc(観測転写)— Plummer 形の第一号 | 47 Tuc の配置と速度を観測から転写する | 部分・束縛 93.3%・視線分散との量の対応は未確定(根拠: `behavior.tuc47`) | 較正対象外 | — | — | — |
| 🌃 | `ngc3198` | 渦巻銀河 NGC 3198(観測転写)— 指数円盤+NFW ハロー | 指数円盤と NFW ハローの転写で外縁の回転を保つ(対照無しのダークマターハローの本) | 部分・外縁 128 km/s・ハローは自前 fit(根拠: `behavior.ngc3198`) | 較正対象外 | — | — | — |
| 🥀 | `supernovaProg` | 超新星前駆星 — ベテルギウス(観測転写) | ベテルギウスの前駆星状態を転写する | 達・静止の保持と転写を検査で確認(根拠: `behavior.supernovaObs`) | 較正対象外 | — | — | — |
| 🦀 | `crabRemnant` | 超新星残骸 SN 1054 — かに星雲とパルサー(観測転写) | かに星雲とパルサーの残骸状態を転写する | 達・膨張速度の転写と自由膨張を確認(根拠: `behavior.supernovaObs`) | 較正対象外 | — | — | — |

## ⚗️ 法則の実験室(0 本)

(内蔵サンプルは 0 本)

## 🖥️ シミュレーション(0 本)

(内蔵サンプルは 0 本)

## 📏 現実との照合(0 本)

(内蔵サンプルは 0 本)

## 所要時間(正本の再生成と QA)

> **測った値の転記であって判定ではない**(第282便・原仮定者の指示 2026-09-26)。時間は html の生成領域に入れない(時間で html を変えない)。数は `tests/lib-w281a-regentable.mjs`(段の実測秒)・`tests/out/calaudit-w249.json`(各本の壁時計)・`tests/out/qa-results-full-beta.json`(試験ごとの所要 ms)の転記で、走行のたびに変わる。

- **較正走行(calaudit)**: 較正母集団の各本を calaudit が走らせた壁時計(段 dt / dt/2 / dt/4 の和・`presets[].run.timeBudget[].wallSec`。第283便c: dt/8 は常時の鎖から外した —— 旧形式の記録だけ dt/8 を 1 回数える・転記した段〔再利用〕は和に入れず「元 N s」を添える)。母集団の外の本は「—」。
- **再利用 h2/h4 の内訳**(第284便c): 転記した段は **h2**(dt/2 の同一便の再走の転記 —— h の生の走行がビット一致・`skippedBy:"reuse-dt2"`)17 段(元の走行 299 s)・**h4**(同一契約の dt/4 の転記 —— `skippedBy:"reuse"`)3 段(元の走行 80.5 s)。第284便c から dt/4 は常時の鎖では例外の登録簿の本だけ(登録の外の本は dt/4 の段が無い)。**転記は収束の証明ではない**。
- **再生成の段**: 下の「再生成の段の表」に段ごとの実測秒と対象の本を置いた(第318便 —— 本の表の段の列は外した)。段の所要は対象の本で共有する(本ごとに足し上げない)。
- **宣言の無い段**(どの本に関与するかを宣言していない 162 段・実測 5437 s —— うち **html を読まない段** 154 段・実測 5229 s〔対象が lib・CSV・正本 —— html の変更では作り直さない〕・**物理の部分(htmlPhys)の段** 7 段・実測 208 s〔第325便a —— 段が読むと宣言した html の部分だけで比べる。版名・説明だけの差では作り直さない〕・**html の全文を文字列で読むと宣言した段** 1 段・実測 0.00 s〔第327便c —— 物理は読まず全文の語を数える(理由を宣言)〕・**対象 html の全体に縛られる段** 0 段・実測 0.00 s)と**常時群**(14 段・実測 1035 s・毎回走る)は下の「再生成の段の表」で区分「html を読まない」「物理の部分(htmlPhys)」「html の全文(宣言)」「宣言なし(html 全体)」「常時群」として載せる。現行の段 376 段の実測秒の和 80684 s(22.41 h・逐次の上限。履歴の段は除く)。
- **保存 QA の来歴**(第320便d): 保存物は版名 `v1.48-b356`・commit dd2061a・2026-11-26T08:06:28.657Z・対象 html の sha ecde6e986387 —— 今の html(版名 `v1.48-b357`)に対して **前の便のゲートの保存物**(1 便遅れる —— 鎖の常時群の段 samplestatus はゲートの QA の前に走る)。
- **保存 QA**: `tests/out/qa-results-full-beta.json`(1905 試験・全体 9886 s・commit dd2061a)のうち、**その本の claims が挙げる testId と、原稿 `tests/data-w279a-samplestatus-src.json` の `qaTargets` がその本を挙げた試験**(帰属 w283e-1 —— 試験の id の部分文字列では帰属させない)の所要の和と本数(1 つの試験が複数の本に数えられうる —— 本ごとの列は重なりを含む)。どちらにも無い本は「帰属なし」(6 本)。内訳は所要の上位 3。

| 本 | 較正走行(s) | 段別(s) | 保存 QA(s・本数) | QA の内訳(上位 3) |
|---|---|---|---|---|
| ⚾ `projectile` | — | — | 0.02・2 | `preset.projectile` 0.02・`projectile.layout` 0.00 |
| ⏪ `echo` | — | — | 1.72・8 | `echo.leapfrog-return` 1.21・`echo.hud` 0.30・`shot.regress-echo` 0.17 |
| 🪗 `compactForceToy` | — | — | 0.01・1 | `preset.compactForceToy` 0.01 |
| 🐌 `inertialDragPair` | — | — | 2.56・3 | `preset.inertialDragPair` 2.10・`behavior.inertialDragGate` 0.45・`preset.inertialDragPair` 0.01 |
| 🌐 `coord3dKeplerTilt` | — | — | 7.44・3 | `ui.selEdit299` 3.39・`ui.paramTab299` 2.67・`ui.axisGizmo307` 1.38 |
| 🎲 `coord3dSpinPrecess` | — | — | 3.39・1 | `ui.selEdit299` 3.39 |
| 👥 `twoBodyOnly3d` | — | — | 0.00・0 | — |
| ♊ `binaryCheckEqualInertial3d` | — | — | 0.42・2 | `behavior.binBooks322b` 0.23・`docs.binBooks322b` 0.19 |
| ⚖️ `binaryCheckRatio3Inertial3d` | — | — | 0.42・2 | `behavior.binBooks322b` 0.23・`docs.binBooks322b` 0.19 |
| 🫂 `boxBinaryToy` | — | — | 0.02・1 | `preset.boxBinaryToy` 0.02 |
| 🌌 `galaxy` | — | — | 93.6・3 | `preset.galaxy` 47.7・`shot.regress-galaxy` 45.9・`claim.galaxy-outerboost` 0.00 |
| 🎡 `galaxyStd` | — | — | 46.8・2 | `preset.galaxyStd` 46.8・`claim.galaxystd-outerboost` 0.00 |
| 💫 `galaxyGeo2` | — | — | 74.8・2 | `preset.galaxyGeo2` 74.8・`claim.galaxygeo2-outerboost` 0.00 |
| 🫓 `galaxyGeo2Flat3d` | — | — | 5.07・2 | `behavior.geo2flat322a` 4.91・`docs.geo2flat322a` 0.16 |
| 🥞 `galaxyGeo2Thick3d` | — | — | 46.4・2 | `behavior.geo2thick324a` 46.2・`docs.geo2thick324a` 0.19 |
| 🧇 `galaxyGeo2ThickTilt3d` | — | — | 46.4・2 | `behavior.geo2thick324a` 46.2・`docs.geo2thick324a` 0.19 |
| 🍳 `galaxyDB` | — | — | 21.4・2 | `preset.galaxyDB` 21.4・`claim.galaxydb-contrast` 0.00 |
| 🌫️ `collapse` | — | — | 200・3 | `collapse.rotation` 185・`preset.collapse` 14.9・`behavior.collapse-cooling` 0.00 |
| 🎠 `galaxyMeshSpiral` | — | — | 16.6・2 | `preset.galaxyMeshSpiral` 16.6・`behavior.galaxyMesh` 0.00 |
| 🌘 `earthMoonRealKF1` | — | — | 0.02・1 | `preset.earthMoonRealKF1` 0.02 |
| ☿ `mercury` | — | — | 0.85・2 | `behavior.mercury-builtin` 0.84・`preset.mercury` 0.01 |
| ⭐ `binary` | — | — | 20.6・4 | `preset.binary` 20.5・`ai.obs-binary` 0.11・`preset.kframe-binary-default` 0.00 |
| ♾️ `fig8` | — | — | 0.20・2 | `shot.regress-fig8` 0.15・`preset.fig8` 0.05 |
| 💥 `counterring` | — | — | 3.68・2 | `preset.counterring` 3.68・`new.counterring` 0.00 |
| 🌪️ `spinup` | — | — | 13.5・3 | `shot.regress-spinup` 7.49・`preset.spinup` 6.02・`behavior.spinup` 0.00 |
| 🏮 `pulsarSolo` | — | — | 0.02・1 | `preset.pulsarSolo` 0.02 |
| 🎇 `supernovaCore` | — | — | 0.01・1 | `preset.supernovaCore` 0.01 |
| ⚪ `whiteDwarfDFM` | — | — | 0.01・1 | `preset.whiteDwarfDFM` 0.01 |
| 🔘 `whiteDwarfBareDFM` | — | — | 0.01・1 | `preset.whiteDwarfBareDFM` 0.01 |
| 🎆 `envelopeShedDFM` | — | — | 0.01・1 | `preset.envelopeShedDFM` 0.01 |
| 🐮 `lfbotTrap` | — | — | 0.16・2 | `preset.lfbotTrap` 0.10・`preset.lfbotTrap` 0.06 |
| 🧅 `layeredCoreDFM` | — | — | 0.02・1 | `preset.layeredCoreDFM` 0.02 |
| ⚙️ `spinDipoleBinary` | — | — | 0.02・1 | `preset.spinDipoleBinary` 0.02 |
| 🌬️ `gasCohSurface` | — | — | 0.50・2 | `behavior.gasCohSurface` 0.48・`preset.gasCohSurface` 0.02 |
| 🛟 `saturnRotVertExplore3d` | — | — | 11.0・2 | `behavior.rotvert339a` 10.8・`docs.rotvert339a` 0.22 |
| ⏱️ `gclock` | — | — | 0.27・3 | `shot.regress-gclock` 0.22・`preset.gclock` 0.05・`new.gclock` 0.00 |
| 🛰️ `grcal` | — | — | 0.04・4 | `preset.grcal` 0.03・`grcal.clocks` 0.02・`grcal.calib-text` 0.00 |
| 🕰️ `grcalGps` | — | — | 0.10・2 | `behavior.grcal3` 0.08・`preset.grcalGps` 0.03 |
| 🌟 `grcalLight` | — | — | 0.10・2 | `behavior.grcal3` 0.08・`preset.grcalLight` 0.03 |
| ⏲️ `grcalShapiro` | — | — | 0.10・2 | `behavior.grcal3` 0.08・`preset.grcalShapiro` 0.02 |
| 💡 `lensing` | — | — | 0.20・2 | `shot.regress-lensing` 0.16・`preset.lensing` 0.03 |
| 🌗 `spinlens` | — | — | 0.02・2 | `preset.spinlens` 0.02・`spinlens.kframe-control` 0.00 |
| 🔭 `blens` | — | — | 0.06・2 | `preset.blens` 0.04・`behavior.blens` 0.02 |
| 🌆 `reddening` | — | — | 0.30・2 | `preset.reddening` 0.27・`claim.reddening` 0.03 |
| 🪞 `mmPhaseToy` | — | — | 0.04・1 | `preset.mmPhaseToy` 0.04 |
| ☝️ `boxone` | — | — | 0.00・0 | — |
| 📦 `boxtrans` | — | — | 0.11・1 | `preset.boxtrans` 0.11 |
| 🌀 `boxrot` | — | — | 0.37・1 | `preset.boxrot` 0.37 |
| 📈 `boxexpand` | — | — | 0.74・1 | `preset.boxexpand` 0.74 |
| 🫧 `boxcomoving` | — | — | 0.73・2 | `shot.regress-boxcomoving` 0.45・`preset.boxcomoving` 0.28 |
| 🪢 `boxbound` | — | — | 2.01・2 | `behavior.boxbound` 1.79・`preset.boxbound` 0.22 |
| 🫁 `boxbreath` | — | — | 0.19・1 | `preset.boxbreath` 0.19 |
| 🔦 `boxredshift` | — | — | 0.18・3 | `shot.regress-boxredshift` 0.12・`box.photon-abc` 0.04・`preset.boxredshift` 0.02 |
| 🧭 `probeH` | — | — | 0.87・2 | `behavior.probeH` 0.75・`preset.probeH` 0.12 |
| 🕊️ `freebox` | — | — | 6.92・11 | `freebox.pressure-expand` 4.49・`freebox.graph-measured` 0.90・`shot.regress-freebox` 0.82 |
| 🕸️ `cosmicweb` | — | — | 28.5・2 | `preset.cosmicweb` 28.5・`behavior.cosmicweb` 0.00 |
| 🔥 `gas` | — | — | 21.3・3 | `shot.regress-gas` 10.9・`preset.gas` 10.4・`behavior.gas` 0.00 |
| 🎈 `pressure` | — | — | 16.1・3 | `preset.pressure` 11.6・`freebox.pressure-expand` 4.49・`behavior.pressure` 0.00 |
| 📏 `conduction` | — | — | 4.28・4 | `behavior.conduction` 3.97・`preset.conduction` 0.21・`conduction.pinned-zero-cost` 0.09 |
| 🛷 `frictionHeat` | — | — | 5.87・1 | `preset.frictionHeat` 5.87 |
| 🌈 `coolrace` | — | — | 0.02・2 | `preset.coolrace` 0.02・`new.coolrace` 0.00 |
| ♨️ `convection` | — | — | 18.0・4 | `preset.convection` 9.32・`shot.regress-convection` 8.70・`perf.convection-timescale` 0.02 |
| 🧪 `buoyancy` | — | — | 15.2・2 | `preset.buoyancy` 15.2・`behavior.buoyancy` 0.00 |
| ☕ `cooling` | — | — | 9.62・2 | `preset.cooling` 9.62・`behavior.collapse-cooling` 0.00 |
| 🧬 `emergent` | — | — | 2.86・3 | `preset.emergent` 2.86・`phasechange.emergent` 0.00・`behavior.phase-multiseed` 0.00 |
| 🧊 `emergent2` | — | — | 7.00・3 | `preset.emergent2` 7.00・`phasechange.emergent2` 0.00・`behavior.phase-multiseed` 0.00 |
| ⛓️ `chain2` | — | — | 6.72・3 | `preset.chain2` 6.72・`phasechange.chain2` 0.00・`behavior.phase-multiseed` 0.00 |
| ♻️ `chaincycle` | — | — | 7.11・3 | `preset.chaincycle` 7.11・`claim.chaincycle` 0.00・`behavior.phase-multiseed` 0.00 |
| 🥢 `axisBarStill` | — | — | 24.3・1 | `preset.axisBarStill` 24.3 |
| 🎏 `axisBarArms` | — | — | 25.0・1 | `preset.axisBarArms` 25.0 |
| 🎚️ `axisBarReach` | — | — | 24.1・1 | `preset.axisBarReach` 24.1 |
| 🔮 `shapeToyCluster` | — | — | 0.31・1 | `preset.shapeToyCluster` 0.31 |
| 🥏 `shapeToyDisk` | — | — | 0.55・1 | `preset.shapeToyDisk` 0.55 |
| 🧵 `shapeToyArm` | — | — | 0.22・1 | `preset.shapeToyArm` 0.22 |
| 🍭 `shapeToySpiral` | — | — | 5.14・4 | `behavior.spiralGeometry` 4.13・`preset.shapeToySpiral` 0.75・`docs.spiralRef` 0.14 |
| 🎱 `shapeToyClusterCore` | — | — | 0.30・1 | `preset.shapeToyClusterCore` 0.30 |
| 📀 `shapeToyDiskCore` | — | — | 0.42・1 | `preset.shapeToyDiskCore` 0.42 |
| 🧹 `shapeToyArmCore` | — | — | 0.18・1 | `preset.shapeToyArmCore` 0.18 |
| 🎢 `shapeToySpiralCore` | — | — | 5.14・4 | `behavior.spiralGeometry` 4.13・`preset.shapeToySpiral` 0.75・`docs.spiralRef` 0.14 |
| 🌙 `earthMoonReal` | 33.5 | dt 33.5・dt/2 再利用〔h2〕(元 62.0) | 0.01・1 | `preset.earthMoonReal` 0.01 |
| 🔆 `emAuditSolar` | 1.03 | dt 1.03・dt/2 再利用〔h2〕(元 1.87) | 0.02・2 | `preset.emAuditSolar` 0.02・`behavior.emAudit` 0.00 |
| 🌦️ `earthMoonSunInertial3d` | — | — | 32.8・10 | `behavior.gLocNull307` 24.2・`behavior.wbgDirect302` 2.25・`behavior.wbgEstimate302` 1.63 |
| 🌔 `earthMoonOnly3d` | — | — | 2.78・3 | `behavior.wbgEstimate302` 1.63・`preset.earthReorg300` 0.97・`behavior.dragNorm301` 0.18 |
| 📶 `qLockRadialAudit` | — | — | 1.66・2 | `behavior.qlockRadial` 1.63・`preset.qLockRadialAudit` 0.03 |
| 📐 `qLockRadialAuditQ3` | — | — | 1.65・2 | `behavior.qlockRadial` 1.63・`preset.qLockRadialAuditQ3` 0.03 |
| ☄️ `mercuryReal` | 2.11 | dt 2.11・dt/2 再利用〔h2〕(元 4.22) | 0.02・1 | `preset.mercuryReal` 0.02 |
| 🟫 `mercurySunInertialFit` | — | — | 99.3・8 | `ui.liveMeasure297` 89.9・`behavior.gLoc302` 6.17・`ui.wbgSlider302` 1.29 |
| 🌡️ `mercurySunInertial3d` | — | — | 14.0・11 | `behavior.gLoc302` 6.17・`behavior.wbgEstimate302` 1.63・`ui.softeningFloorSlider305` 1.27 |
| 🌋 `venusSunInertial3d` | — | — | 0.14・1 | `preset.planets306` 0.14 |
| 🔴 `marsSunInertial3d` | — | — | 0.14・1 | `preset.planets306` 0.14 |
| 🏀 `jupiterSunInertial3d` | — | — | 1.33・3 | `behavior.initObs309` 0.74・`behavior.invSq309` 0.45・`preset.planets306` 0.14 |
| 🟡 `saturnSunInertial3d` | — | — | 0.14・1 | `preset.planets306` 0.14 |
| 🍩 `saturnRingInertial3d` | — | — | 8.75・8 | `behavior.wbgDirect302` 2.25・`behavior.wbgEstimate302` 1.63・`ui.wbgSlider302` 1.29 |
| 🔷 `uranusSunInertial3d` | — | — | 0.14・1 | `preset.planets306` 0.14 |
| 💙 `neptuneSunInertial3d` | — | — | 0.14・1 | `preset.planets306` 0.14 |
| 🗺️ `solarSystem16Inertial3d` | — | — | 6.71・3 | `behavior.solar16Builtin318c` 4.70・`preset.solarSystem16Inertial3d` 1.85・`docs.solar16Builtin318c` 0.16 |
| 🟠 `jupiterGalilean` | 12.1 | dt 12.1・dt/2 再利用〔h2〕(元 23.5) | 0.91・2 | `behavior.jupiter` 0.88・`preset.jupiterGalilean` 0.03 |
| 🌇 `venusReal` | 6.16 | dt 6.16・dt/2 再利用〔h2〕(元 11.5) | 9.68・2 | `behavior.venusReal` 9.66・`preset.venusReal` 0.01 |
| 🥔 `marsMoonsReal` | 4.97 | dt 4.97・dt/2 再利用〔h2〕(元 8.71) | 0.02・2 | `preset.marsMoonsReal` 0.01・`behavior.marsMoonsReal` 0.00 |
| 🥶 `plutoCharonDiagInput` | 62.0 | dt 62.0・dt/2 再利用〔h2〕(元 112) | 0.02・1 | `preset.plutoCharonDiagInput` 0.02 |
| 🟪 `plutoCharonInertialFit` | — | — | 7.62・8 | `behavior.wbgDirect302` 2.25・`behavior.wbgEstimate302` 1.63・`behavior.inertialR2_303` 1.24 |
| 💠 `uranusReal` | 49.3 | dt 49.3 | 0.11・2 | `preset.uranusReal` 0.11・`behavior.uranusReal` 0.00 |
| 🌊 `neptuneReal` | 1.77 | dt 1.77・dt/2 再利用〔h2〕(元 3.04) | 0.02・2 | `preset.neptuneReal` 0.02・`behavior.neptuneReal` 0.00 |
| ✨ `alphaCenAB` | 7.63 | dt 7.63・dt/2 再利用〔h2〕(元 15.2)・dt/4 再利用〔h4〕(元 36.2) | 6.10・2 | `behavior.alphaCenAB` 6.08・`preset.alphaCenAB` 0.02 |
| 🌟 `siriusAB` | 5.85 | dt 5.85・dt/2 再利用〔h2〕(元 9.92)・dt/4 再利用〔h4〕(元 22.8) | 5.14・2 | `behavior.siriusAB` 5.12・`preset.siriusAB` 0.02 |
| 🌠 `siriusABInertial3d` | — | — | 0.42・2 | `behavior.binBooks322b` 0.23・`docs.binBooks322b` 0.19 |
| 🔶 `alphaCenABInertial3d` | — | — | 0.42・2 | `behavior.binBooks322b` 0.23・`docs.binBooks322b` 0.19 |
| 🔸 `alphaCenABInertial3dJ` | — | — | 0.71・2 | `behavior.obsSpin324b` 0.52・`docs.obsSpin324b` 0.20 |
| 📟 `psrDoubleABInertial3d` | — | — | 0.71・2 | `behavior.obsSpin324b` 0.52・`docs.obsSpin324b` 0.20 |
| 📻 `psrDoubleAB` | 3.15 | dt 3.15・dt/2 再利用〔h2〕(元 5.49) | 0.02・2 | `preset.psrDoubleAB` 0.01・`behavior.psrDoubleAB` 0.00 |
| 🧮 `psrJ1757DFM` | 1.94 | dt 1.94・dt/2 再利用〔h2〕(元 3.00) | 0.02・1 | `preset.psrJ1757DFM` 0.02 |
| 🩺 `psrJ1946DFM` | 1.05 | dt 1.05・dt/2 再利用〔h2〕(元 1.64) | 0.02・1 | `preset.psrJ1946DFM` 0.02 |
| 📿 `psrB1534` | 14.7 | dt 14.7・dt/2 再利用〔h2〕(元 26.5) | 0.01・1 | `preset.psrB1534` 0.01 |
| 🎐 `gw150914` | 0.42 | dt 0.42・dt/2 再利用〔h2〕(元 0.95) | 8.26・2 | `behavior.gw150914` 8.23・`preset.gw150914` 0.03 |
| ⏰ `gw150914Merge4s` | 0.15 | dt 0.15・dt/2 再利用〔h2〕(元 0.08) | 0.01・1 | `preset.gw150914Merge4s` 0.01 |
| ⚛️ `gw150914SpinDipole` | — | — | 0.01・1 | `preset.gw150914SpinDipole` 0.01 |
| 📡 `saturnZonalD68` | 5.21 | dt 5.21・dt/2 再利用〔h2〕(元 9.66)・dt/4 再利用〔h4〕(元 21.6) | 15.1・4 | `zonal.d68-realunit` 15.0・`preset.saturnZonalD68` 0.03・`zonal.analytic-d68` 0.02 |
| 🧷 `saturnD68Consistent` | — | — | 0.02・1 | `preset.saturnD68Consistent` 0.02 |
| 📎 `saturnD68ObsOrbit` | — | — | 0.01・1 | `preset.saturnD68ObsOrbit` 0.01 |
| 💍 `saturnRingReal` | 102 | dt 102 | 0.21・2 | `preset.saturnRingReal` 0.18・`wave121.ui` 0.03 |
| 🍇 `tuc47` | — | — | 0.98・2 | `preset.tuc47` 0.98・`behavior.tuc47` 0.00 |
| 🌃 `ngc3198` | — | — | 1.55・2 | `preset.ngc3198` 1.55・`behavior.ngc3198` 0.00 |
| 🥀 `supernovaProg` | — | — | 0.01・1 | `preset.supernovaProg` 0.01 |
| 🦀 `crabRemnant` | — | — | 0.93・1 | `preset.crabRemnant` 0.93 |

### 再生成の段の表

> 段 376(履歴の段を除く)・実測秒の和 80684 s。実測秒は `tests/lib-w281a-regentable.mjs` の段の秒(段 1 回の実測 —— 対象の本で共有する)。区分: **常時群** = 毎回走る段・**領域の宣言** = REGEN_SCOPE の presets で対象の本を宣言した段・**物理の部分(htmlPhys)** = 領域の宣言は無いが段が読む html の部分(第325便a の宣言 —— 版名・説明の欄・注釈を外した部分)だけで刻印の html と比べる段(第326便e)・**html の全文(宣言)** = 物理を読まず html の全文を文字列で読むと理由つきで宣言した段(第327便c —— 外部名の出現数など)・**宣言なし(html 全体)** = 対象 html の全体に縛られる段・**html を読まない** = 宣言は無いが対象が lib・CSV・正本の段(第320便d —— html の変更では作り直さない)。対象: **all** = 内蔵の全本(189 本)・それ以外は宣言した本のうち掲載の本の列挙(掲載の外の本は数だけ)。並びは実測秒の大きい順。

| 段 | 実測(s) | 区分 | 対象の本 |
|---|---|---|---|
| satnext-318b | 5907 | 領域の宣言 | 9 本: 🟠 `jupiterGalilean`・🏀 `jupiterSunInertial3d`・🔴 `marsSunInertial3d`・🌡️ `mercurySunInertial3d`・💙 `neptuneSunInertial3d`・💍 `saturnRingReal`・🟡 `saturnSunInertial3d`・🔷 `uranusSunInertial3d`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 1 本) |
| shell-304b | 5195 | 領域の宣言 | 22 本: 🌔 `earthMoonOnly3d`・🌦️ `earthMoonSunInertial3d`・🔆 `emAuditSolar`・🔥 `gas`・🟠 `jupiterGalilean`・🏀 `jupiterSunInertial3d`・🥔 `marsMoonsReal`・🔴 `marsSunInertial3d`・☿ `mercury`・☄️ `mercuryReal`・🌡️ `mercurySunInertial3d`・🟫 `mercurySunInertialFit`・🌊 `neptuneReal`・💙 `neptuneSunInertial3d`・🥶 `plutoCharonDiagInput`・🟪 `plutoCharonInertialFit`・💍 `saturnRingReal`・🟡 `saturnSunInertial3d`・💠 `uranusReal`・🔷 `uranusSunInertial3d`・🌇 `venusReal`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 8 本) |
| k1confirm-313d | 3554 | 領域の宣言 | 19 本: 🌔 `earthMoonOnly3d`・🌦️ `earthMoonSunInertial3d`・🟠 `jupiterGalilean`・🏀 `jupiterSunInertial3d`・🥔 `marsMoonsReal`・🔴 `marsSunInertial3d`・☿ `mercury`・☄️ `mercuryReal`・🌡️ `mercurySunInertial3d`・🟫 `mercurySunInertialFit`・🌊 `neptuneReal`・💙 `neptuneSunInertial3d`・🟪 `plutoCharonInertialFit`・💍 `saturnRingReal`・🟡 `saturnSunInertial3d`・💠 `uranusReal`・🔷 `uranusSunInertial3d`・🌇 `venusReal`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 2 本) |
| emgrid | 3355 | 領域の宣言 | 3 本: 🌘 `earthMoonRealKF1`・🔆 `emAuditSolar`・🔥 `gas`(ほかに掲載の外の本 2 本) |
| satcut-317c | 2499 | 領域の宣言 | 9 本: 🟠 `jupiterGalilean`・🏀 `jupiterSunInertial3d`・🔴 `marsSunInertial3d`・🌡️ `mercurySunInertial3d`・💙 `neptuneSunInertial3d`・💍 `saturnRingReal`・🟡 `saturnSunInertial3d`・🔷 `uranusSunInertial3d`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 1 本) |
| pairnorm-305a | 2460 | 領域の宣言 | 22 本: 🌔 `earthMoonOnly3d`・🌦️ `earthMoonSunInertial3d`・🔆 `emAuditSolar`・🐌 `inertialDragPair`・🟠 `jupiterGalilean`・🏀 `jupiterSunInertial3d`・🥔 `marsMoonsReal`・🔴 `marsSunInertial3d`・☿ `mercury`・☄️ `mercuryReal`・🌡️ `mercurySunInertial3d`・🟫 `mercurySunInertialFit`・🌊 `neptuneReal`・💙 `neptuneSunInertial3d`・🥶 `plutoCharonDiagInput`・🟪 `plutoCharonInertialFit`・💍 `saturnRingReal`・🟡 `saturnSunInertial3d`・💠 `uranusReal`・🔷 `uranusSunInertial3d`・🌇 `venusReal`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 7 本) |
| k1em-314c | 2458 | 領域の宣言 | 19 本: 🌔 `earthMoonOnly3d`・🌦️ `earthMoonSunInertial3d`・🟠 `jupiterGalilean`・🏀 `jupiterSunInertial3d`・🥔 `marsMoonsReal`・🔴 `marsSunInertial3d`・☿ `mercury`・☄️ `mercuryReal`・🌡️ `mercurySunInertial3d`・🟫 `mercurySunInertialFit`・🌊 `neptuneReal`・💙 `neptuneSunInertial3d`・🟪 `plutoCharonInertialFit`・💍 `saturnRingReal`・🟡 `saturnSunInertial3d`・💠 `uranusReal`・🔷 `uranusSunInertial3d`・🌇 `venusReal`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 2 本) |
| solar16-318c | 2414 | 領域の宣言 | 12 本: 🌦️ `earthMoonSunInertial3d`・🟠 `jupiterGalilean`・🏀 `jupiterSunInertial3d`・🔴 `marsSunInertial3d`・☿ `mercury`・🌡️ `mercurySunInertial3d`・💙 `neptuneSunInertial3d`・💍 `saturnRingReal`・🟡 `saturnSunInertial3d`・🗺️ `solarSystem16Inertial3d`・🔷 `uranusSunInertial3d`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 1 本) |
| k1outer-314c | 2016 | 領域の宣言 | 19 本: 🌔 `earthMoonOnly3d`・🌦️ `earthMoonSunInertial3d`・🟠 `jupiterGalilean`・🏀 `jupiterSunInertial3d`・🥔 `marsMoonsReal`・🔴 `marsSunInertial3d`・☿ `mercury`・☄️ `mercuryReal`・🌡️ `mercurySunInertial3d`・🟫 `mercurySunInertialFit`・🌊 `neptuneReal`・💙 `neptuneSunInertial3d`・🟪 `plutoCharonInertialFit`・💍 `saturnRingReal`・🟡 `saturnSunInertial3d`・💠 `uranusReal`・🔷 `uranusSunInertial3d`・🌇 `venusReal`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 2 本) |
| refit-297a | 1926 | 領域の宣言 | all(内蔵の全 189 本) |
| k1scale-331c | 1699 | 領域の宣言 | 17 本: 🌦️ `earthMoonSunInertial3d`・🟠 `jupiterGalilean`・🏀 `jupiterSunInertial3d`・🥔 `marsMoonsReal`・🔴 `marsSunInertial3d`・☿ `mercury`・☄️ `mercuryReal`・🌡️ `mercurySunInertial3d`・🟫 `mercurySunInertialFit`・🌊 `neptuneReal`・💙 `neptuneSunInertial3d`・💍 `saturnRingReal`・🟡 `saturnSunInertial3d`・💠 `uranusReal`・🔷 `uranusSunInertial3d`・🌇 `venusReal`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 2 本) |
| charon-h2 | 1583 | 領域の宣言 | 7 本: ✨ `alphaCenAB`・🌊 `neptuneReal`・🥶 `plutoCharonDiagInput`・🧮 `psrJ1757DFM`・🩺 `psrJ1946DFM`・🌟 `siriusAB`・🌇 `venusReal`(ほかに掲載の外の本 3 本) |
| inertialr2-303b | 1473 | 領域の宣言 | 21 本: 🌔 `earthMoonOnly3d`・🌦️ `earthMoonSunInertial3d`・🔆 `emAuditSolar`・🟠 `jupiterGalilean`・🏀 `jupiterSunInertial3d`・🥔 `marsMoonsReal`・🔴 `marsSunInertial3d`・☿ `mercury`・☄️ `mercuryReal`・🌡️ `mercurySunInertial3d`・🟫 `mercurySunInertialFit`・🌊 `neptuneReal`・💙 `neptuneSunInertial3d`・🥶 `plutoCharonDiagInput`・🟪 `plutoCharonInertialFit`・💍 `saturnRingReal`・🟡 `saturnSunInertial3d`・💠 `uranusReal`・🔷 `uranusSunInertial3d`・🌇 `venusReal`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 7 本) |
| planet3-311d | 1348 | 領域の宣言 | 17 本: 🌦️ `earthMoonSunInertial3d`・🟠 `jupiterGalilean`・🏀 `jupiterSunInertial3d`・🥔 `marsMoonsReal`・🔴 `marsSunInertial3d`・☿ `mercury`・☄️ `mercuryReal`・🌡️ `mercurySunInertial3d`・🟫 `mercurySunInertialFit`・🌊 `neptuneReal`・💙 `neptuneSunInertial3d`・💍 `saturnRingReal`・🟡 `saturnSunInertial3d`・💠 `uranusReal`・🔷 `uranusSunInertial3d`・🌇 `venusReal`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 2 本) |
| chainburst-301d | 1276 | 領域の宣言 | 0 本(ほかに掲載の外の本 3 本) |
| gfamily-305b | 1252 | 領域の宣言 | 22 本: 🌔 `earthMoonOnly3d`・🌦️ `earthMoonSunInertial3d`・🔆 `emAuditSolar`・🔥 `gas`・🟠 `jupiterGalilean`・🏀 `jupiterSunInertial3d`・🥔 `marsMoonsReal`・🔴 `marsSunInertial3d`・☿ `mercury`・☄️ `mercuryReal`・🌡️ `mercurySunInertial3d`・🟫 `mercurySunInertialFit`・🌊 `neptuneReal`・💙 `neptuneSunInertial3d`・🥶 `plutoCharonDiagInput`・🟪 `plutoCharonInertialFit`・💍 `saturnRingReal`・🟡 `saturnSunInertial3d`・💠 `uranusReal`・🔷 `uranusSunInertial3d`・🌇 `venusReal`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 8 本) |
| dragcore292 | 1239 | 領域の宣言 | 1 本: 🌙 `earthMoonReal`(ほかに掲載の外の本 1 本) |
| confirm-312d | 1127 | 領域の宣言 | 19 本: 🌔 `earthMoonOnly3d`・🌦️ `earthMoonSunInertial3d`・🟠 `jupiterGalilean`・🏀 `jupiterSunInertial3d`・🥔 `marsMoonsReal`・🔴 `marsSunInertial3d`・☿ `mercury`・☄️ `mercuryReal`・🌡️ `mercurySunInertial3d`・🟫 `mercurySunInertialFit`・🌊 `neptuneReal`・💙 `neptuneSunInertial3d`・🟪 `plutoCharonInertialFit`・💍 `saturnRingReal`・🟡 `saturnSunInertial3d`・💠 `uranusReal`・🔷 `uranusSunInertial3d`・🌇 `venusReal`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 2 本) |
| periodn-306b | 1033 | 領域の宣言 | 22 本: 🌔 `earthMoonOnly3d`・🌦️ `earthMoonSunInertial3d`・🔆 `emAuditSolar`・🔥 `gas`・🟠 `jupiterGalilean`・🏀 `jupiterSunInertial3d`・🥔 `marsMoonsReal`・🔴 `marsSunInertial3d`・☿ `mercury`・☄️ `mercuryReal`・🌡️ `mercurySunInertial3d`・🟫 `mercurySunInertialFit`・🌊 `neptuneReal`・💙 `neptuneSunInertial3d`・🥶 `plutoCharonDiagInput`・🟪 `plutoCharonInertialFit`・💍 `saturnRingReal`・🟡 `saturnSunInertial3d`・💠 `uranusReal`・🔷 `uranusSunInertial3d`・🌇 `venusReal`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 8 本) |
| nsgrid | 955 | html を読まない | — |
| emresolve-306c | 938 | 領域の宣言 | 4 本: 🌔 `earthMoonOnly3d`・🌦️ `earthMoonSunInertial3d`・🌡️ `mercurySunInertial3d`・🟪 `plutoCharonInertialFit`(ほかに掲載の外の本 1 本) |
| sath-316d | 930 | 領域の宣言 | 2 本: 🟠 `jupiterGalilean`・💍 `saturnRingReal`(ほかに掲載の外の本 1 本) |
| charonInput | 925 | 領域の宣言 | 1 本: 🥶 `plutoCharonDiagInput`(ほかに掲載の外の本 4 本) |
| charon-h | 913 | 領域の宣言 | 7 本: ✨ `alphaCenAB`・🌊 `neptuneReal`・🥶 `plutoCharonDiagInput`・🧮 `psrJ1757DFM`・🩺 `psrJ1946DFM`・🌟 `siriusAB`・🌇 `venusReal`(ほかに掲載の外の本 3 本) |
| earthmoon-303c | 830 | 領域の宣言 | 4 本: 🌔 `earthMoonOnly3d`・🌦️ `earthMoonSunInertial3d`・🌡️ `mercurySunInertial3d`・🟪 `plutoCharonInertialFit` |
| geo3 | 820 | 領域の宣言 | 17 本: ✨ `alphaCenAB`・🌘 `earthMoonRealKF1`・🟠 `jupiterGalilean`・🥔 `marsMoonsReal`・☿ `mercury`・☄️ `mercuryReal`・🌊 `neptuneReal`・🥶 `plutoCharonDiagInput`・📿 `psrB1534`・📻 `psrDoubleAB`・🧮 `psrJ1757DFM`・🩺 `psrJ1946DFM`・📶 `qLockRadialAudit`・📐 `qLockRadialAuditQ3`・📡 `saturnZonalD68`・🌟 `siriusAB`・🌇 `venusReal`(ほかに掲載の外の本 18 本) |
| charoneps-h4 | 804 | 領域の宣言 | 7 本: ✨ `alphaCenAB`・🌊 `neptuneReal`・🥶 `plutoCharonDiagInput`・🧮 `psrJ1757DFM`・🩺 `psrJ1946DFM`・🌟 `siriusAB`・🌇 `venusReal`(ほかに掲載の外の本 3 本) |
| inposk1-315c | 785 | 領域の宣言 | 17 本: 🌦️ `earthMoonSunInertial3d`・🟠 `jupiterGalilean`・🏀 `jupiterSunInertial3d`・🥔 `marsMoonsReal`・🔴 `marsSunInertial3d`・☿ `mercury`・☄️ `mercuryReal`・🌡️ `mercurySunInertial3d`・🟫 `mercurySunInertialFit`・🌊 `neptuneReal`・💙 `neptuneSunInertial3d`・💍 `saturnRingReal`・🟡 `saturnSunInertial3d`・💠 `uranusReal`・🔷 `uranusSunInertial3d`・🌇 `venusReal`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 2 本) |
| nslock | 766 | 領域の宣言 | 5 本: ✨ `alphaCenAB`・🌌 `galaxy`・🧮 `psrJ1757DFM`・🩺 `psrJ1946DFM`・🌟 `siriusAB`(ほかに掲載の外の本 4 本) |
| semic-302d | 741 | 領域の宣言 | all(内蔵の全 189 本) |
| baseline-304c | 734 | 領域の宣言 | 4 本: 🌔 `earthMoonOnly3d`・🌦️ `earthMoonSunInertial3d`・🌡️ `mercurySunInertial3d`・🟪 `plutoCharonInertialFit`(ほかに掲載の外の本 1 本) |
| charonk | 718 | 領域の宣言 | 1 本: 🥶 `plutoCharonDiagInput`(ほかに掲載の外の本 1 本) |
| an336-306a | 718 | 領域の宣言 | 22 本: 🌔 `earthMoonOnly3d`・🌘 `earthMoonRealKF1`・🌦️ `earthMoonSunInertial3d`・🔆 `emAuditSolar`・🟠 `jupiterGalilean`・🏀 `jupiterSunInertial3d`・🥔 `marsMoonsReal`・🔴 `marsSunInertial3d`・☿ `mercury`・☄️ `mercuryReal`・🌡️ `mercurySunInertial3d`・🟫 `mercurySunInertialFit`・🌊 `neptuneReal`・💙 `neptuneSunInertial3d`・🥶 `plutoCharonDiagInput`・🟪 `plutoCharonInertialFit`・💍 `saturnRingReal`・🟡 `saturnSunInertial3d`・💠 `uranusReal`・🔷 `uranusSunInertial3d`・🌇 `venusReal`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 7 本) |
| mdsweep-310d | 703 | 領域の宣言 | 17 本: 🌦️ `earthMoonSunInertial3d`・🟠 `jupiterGalilean`・🏀 `jupiterSunInertial3d`・🥔 `marsMoonsReal`・🔴 `marsSunInertial3d`・☿ `mercury`・☄️ `mercuryReal`・🌡️ `mercurySunInertial3d`・🟫 `mercurySunInertialFit`・🌊 `neptuneReal`・💙 `neptuneSunInertial3d`・💍 `saturnRingReal`・🟡 `saturnSunInertial3d`・💠 `uranusReal`・🔷 `uranusSunInertial3d`・🌇 `venusReal`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 2 本) |
| charoneps-h2 | 697 | 領域の宣言 | 7 本: ✨ `alphaCenAB`・🌊 `neptuneReal`・🥶 `plutoCharonDiagInput`・🧮 `psrJ1757DFM`・🩺 `psrJ1946DFM`・🌟 `siriusAB`・🌇 `venusReal`(ほかに掲載の外の本 3 本) |
| moon3d-298c | 696 | 領域の宣言 | 1 本: 🌦️ `earthMoonSunInertial3d`(ほかに掲載の外の本 1 本) |
| geo2thick-324a | 666 | 領域の宣言 | 4 本: 💫 `galaxyGeo2`・🫓 `galaxyGeo2Flat3d`・🥞 `galaxyGeo2Thick3d`・🧇 `galaxyGeo2ThickTilt3d` |
| replaw-355i | 660 | html を読まない | — |
| charon-h4 | 657 | 領域の宣言 | 7 本: ✨ `alphaCenAB`・🌊 `neptuneReal`・🥶 `plutoCharonDiagInput`・🧮 `psrJ1757DFM`・🩺 `psrJ1946DFM`・🌟 `siriusAB`・🌇 `venusReal`(ほかに掲載の外の本 3 本) |
| rotframe-306d | 646 | 領域の宣言 | 1 本: 🍩 `saturnRingInertial3d`(ほかに掲載の外の本 3 本) |
| j2-305c | 618 | 領域の宣言 | 4 本: 🌔 `earthMoonOnly3d`・🌦️ `earthMoonSunInertial3d`・🌡️ `mercurySunInertial3d`・🟪 `plutoCharonInertialFit` |
| pnsource286 | 612 | 領域の宣言 | all(内蔵の全 189 本) |
| pn1 | 560 | 領域の宣言 | all(内蔵の全 189 本) |
| calaudit | 541 | 常時群 | — |
| fit-297b | 534 | 領域の宣言 | all(内蔵の全 189 本) |
| planets3d-299c | 525 | 領域の宣言 | 17 本: 🌦️ `earthMoonSunInertial3d`・🟠 `jupiterGalilean`・🏀 `jupiterSunInertial3d`・🥔 `marsMoonsReal`・🔴 `marsSunInertial3d`・☿ `mercury`・☄️ `mercuryReal`・🌡️ `mercurySunInertial3d`・🟫 `mercurySunInertialFit`・🌊 `neptuneReal`・💙 `neptuneSunInertial3d`・💍 `saturnRingReal`・🟡 `saturnSunInertial3d`・💠 `uranusReal`・🔷 `uranusSunInertial3d`・🌇 `venusReal`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 2 本) |
| geo3-294a | 524 | 領域の宣言 | 1 本: 🌙 `earthMoonReal`(ほかに掲載の外の本 1 本) |
| spinavg-305d | 512 | 領域の宣言 | 1 本: 🍩 `saturnRingInertial3d`(ほかに掲載の外の本 4 本) |
| compose293 | 492 | 領域の宣言 | all(内蔵の全 189 本) |
| dragbox-356i | 480 | html を読まない | — |
| wbgest-302c | 470 | 領域の宣言 | all(内蔵の全 189 本) |
| galaxyproto | 467 | html を読まない | — |
| satk1-315d | 448 | 領域の宣言 | 2 本: 🟠 `jupiterGalilean`・💍 `saturnRingReal`(ほかに掲載の外の本 1 本) |
| timestd-297c | 430 | 領域の宣言 | all(内蔵の全 189 本) |
| refit-303a | 423 | 領域の宣言 | all(内蔵の全 189 本) |
| contact285 | 365 | 領域の宣言 | all(内蔵の全 189 本) |
| mercury | 358 | 常時群 | 18 本: ✨ `alphaCenAB`・🌙 `earthMoonReal`・🌘 `earthMoonRealKF1`・🟠 `jupiterGalilean`・🥔 `marsMoonsReal`・☄️ `mercuryReal`・🌊 `neptuneReal`・🥶 `plutoCharonDiagInput`・📿 `psrB1534`・📻 `psrDoubleAB`・🧮 `psrJ1757DFM`・🩺 `psrJ1946DFM`・📶 `qLockRadialAudit`・📐 `qLockRadialAuditQ3`・💍 `saturnRingReal`・📡 `saturnZonalD68`・🌟 `siriusAB`・🌇 `venusReal`(ほかに掲載の外の本 17 本) |
| geo2flat-322a | 335 | 領域の宣言 | 2 本: 💫 `galaxyGeo2`・🫓 `galaxyGeo2Flat3d` |
| charonfactors | 333 | 領域の宣言 | 1 本: 🥶 `plutoCharonDiagInput`(ほかに掲載の外の本 1 本) |
| charoneps-h | 320 | 領域の宣言 | 7 本: ✨ `alphaCenAB`・🌊 `neptuneReal`・🥶 `plutoCharonDiagInput`・🧮 `psrJ1757DFM`・🩺 `psrJ1946DFM`・🌟 `siriusAB`・🌇 `venusReal`(ほかに掲載の外の本 3 本) |
| clusterStable | 319 | 領域の宣言 | 1 本: 🔥 `gas`(ほかに掲載の外の本 2 本) |
| geo4stable-299d | 314 | 領域の宣言 | 1 本: 🟫 `mercurySunInertialFit`(ほかに掲載の外の本 4 本) |
| galaxydiag | 299 | 領域の宣言 | 1 本: 🌃 `ngc3198`(ほかに掲載の外の本 1 本) |
| swing293 | 277 | 領域の宣言 | 1 本: 🔆 `emAuditSolar`(ほかに掲載の外の本 1 本) |
| wbglaw-301g | 264 | 領域の宣言 | all(内蔵の全 189 本) |
| clone-301f | 258 | 領域の宣言 | all(内蔵の全 189 本) |
| charonaudit-305e | 252 | 領域の宣言 | 1 本: 🟪 `plutoCharonInertialFit` |
| galaxialrd-312b | 241 | 領域の宣言 | 21 本: 🌔 `earthMoonOnly3d`・🌦️ `earthMoonSunInertial3d`・🌌 `galaxy`・💫 `galaxyGeo2`・🎡 `galaxyStd`・🟠 `jupiterGalilean`・🏀 `jupiterSunInertial3d`・🥔 `marsMoonsReal`・🔴 `marsSunInertial3d`・☿ `mercury`・☄️ `mercuryReal`・🌡️ `mercurySunInertial3d`・🟫 `mercurySunInertialFit`・🌊 `neptuneReal`・💙 `neptuneSunInertial3d`・💍 `saturnRingReal`・🟡 `saturnSunInertial3d`・💠 `uranusReal`・🔷 `uranusSunInertial3d`・🌇 `venusReal`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 2 本) |
| pnsources291 | 240 | 領域の宣言 | all(内蔵の全 189 本) |
| drageos-356d | 240 | html を読まない | — |
| geo2v3-321a | 233 | 領域の宣言 | 1 本: 💫 `galaxyGeo2` |
| timing294 | 231 | 領域の宣言 | all(内蔵の全 189 本) |
| sparc | 225 | 領域の宣言 | 2 本: 🌌 `galaxy`・🌃 `ngc3198`(ほかに掲載の外の本 1 本) |
| galaxial-311b | 201 | 領域の宣言 | 20 本: 🌔 `earthMoonOnly3d`・🌦️ `earthMoonSunInertial3d`・🌌 `galaxy`・💫 `galaxyGeo2`・🎡 `galaxyStd`・🟠 `jupiterGalilean`・🏀 `jupiterSunInertial3d`・🥔 `marsMoonsReal`・🔴 `marsSunInertial3d`・☿ `mercury`・☄️ `mercuryReal`・🌡️ `mercurySunInertial3d`・🌊 `neptuneReal`・💙 `neptuneSunInertial3d`・💍 `saturnRingReal`・🟡 `saturnSunInertial3d`・💠 `uranusReal`・🔷 `uranusSunInertial3d`・🌇 `venusReal`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 1 本) |
| heat3d-355g | 200 | html を読まない | — |
| shapetoy | 199 | 領域の宣言 | 3 本: 🧵 `shapeToyArm`・🔮 `shapeToyCluster`・🥏 `shapeToyDisk` |
| formwave-353ze | 190 | html を読まない | — |
| saturnring3d-300c | 182 | 領域の宣言 | 9 本: 🏀 `jupiterSunInertial3d`・🔴 `marsSunInertial3d`・🌡️ `mercurySunInertial3d`・💙 `neptuneSunInertial3d`・🍩 `saturnRingInertial3d`・💍 `saturnRingReal`・🟡 `saturnSunInertial3d`・🔷 `uranusSunInertial3d`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 1 本) |
| g4cols-355f | 180 | html を読まない | — |
| corot-356h | 180 | html を読まない | — |
| galfield-321c | 179 | 領域の宣言 | 14 本: 🍳 `galaxyDB`・💫 `galaxyGeo2`・🎡 `galaxyStd`・🟠 `jupiterGalilean`・🏀 `jupiterSunInertial3d`・🔴 `marsSunInertial3d`・☿ `mercury`・🌡️ `mercurySunInertial3d`・💙 `neptuneSunInertial3d`・💍 `saturnRingReal`・🟡 `saturnSunInertial3d`・🗺️ `solarSystem16Inertial3d`・🔷 `uranusSunInertial3d`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 4 本) |
| moonwindow-348e | 167 | html を読まない | — |
| geo4-295b | 165 | 領域の宣言 | all(内蔵の全 189 本) |
| tide292 | 160 | 領域の宣言 | 2 本: 🌙 `earthMoonReal`・🧵 `shapeToyArm`(ほかに掲載の外の本 2 本) |
| clusterAnalogy | 159 | 領域の宣言 | all(内蔵の全 189 本) |
| charonfix-306e | 157 | 領域の宣言 | 2 本: 🥶 `plutoCharonDiagInput`・🟪 `plutoCharonInertialFit` |
| tpsign | 153 | 領域の宣言 | all(内蔵の全 189 本) |
| d68 | 152 | 領域の宣言 | all(内蔵の全 189 本) |
| pairfuse288 | 148 | 領域の宣言 | 1 本: 🔥 `gas`(ほかに掲載の外の本 4 本) |
| opttour-346a | 138 | 物理の部分(htmlPhys) | — |
| corefield | 136 | 領域の宣言 | 4 本: 🧹 `shapeToyArmCore`・🔮 `shapeToyCluster`・🎱 `shapeToyClusterCore`・📀 `shapeToyDiskCore`(ほかに掲載の外の本 1 本) |
| dragnorm-301a | 129 | 領域の宣言 | all(内蔵の全 189 本) |
| tilt90layers289 | 127 | 領域の宣言 | 0 本(ほかに掲載の外の本 3 本) |
| galaxialrdm-313b | 127 | 領域の宣言 | 20 本: 🌔 `earthMoonOnly3d`・🌦️ `earthMoonSunInertial3d`・🌌 `galaxy`・💫 `galaxyGeo2`・🎡 `galaxyStd`・🟠 `jupiterGalilean`・🏀 `jupiterSunInertial3d`・🥔 `marsMoonsReal`・🔴 `marsSunInertial3d`・☿ `mercury`・☄️ `mercuryReal`・🌡️ `mercurySunInertial3d`・🌊 `neptuneReal`・💙 `neptuneSunInertial3d`・💍 `saturnRingReal`・🟡 `saturnSunInertial3d`・💠 `uranusReal`・🔷 `uranusSunInertial3d`・🌇 `venusReal`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 1 本) |
| rdscale-314b | 122 | 領域の宣言 | 9 本: 🌦️ `earthMoonSunInertial3d`・🏀 `jupiterSunInertial3d`・🔴 `marsSunInertial3d`・☿ `mercury`・🌡️ `mercurySunInertial3d`・💙 `neptuneSunInertial3d`・🟡 `saturnSunInertial3d`・🔷 `uranusSunInertial3d`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 1 本) |
| nsmode | 117 | html を読まない | — |
| inertial3-295c | 114 | 領域の宣言 | 3 本: 🔆 `emAuditSolar`・☄️ `mercuryReal`・🥶 `plutoCharonDiagInput`(ほかに掲載の外の本 4 本) |
| charonwin | 110 | 領域の宣言 | 0 本(ほかに掲載の外の本 2 本) |
| formstage-353w | 110 | html を読まない | — |
| tilt90288 | 108 | 領域の宣言 | 1 本: 📻 `psrDoubleAB`(ほかに掲載の外の本 2 本) |
| emrecord-336a | 92.0 | 領域の宣言 | 1 本: 🌘 `earthMoonRealKF1` |
| shapecrit | 85.0 | 領域の宣言 | all(内蔵の全 189 本) |
| fieldcontract-322c | 85.0 | 領域の宣言 | 11 本: 🟠 `jupiterGalilean`・🏀 `jupiterSunInertial3d`・🔴 `marsSunInertial3d`・☿ `mercury`・🌡️ `mercurySunInertial3d`・💙 `neptuneSunInertial3d`・💍 `saturnRingReal`・🟡 `saturnSunInertial3d`・🗺️ `solarSystem16Inertial3d`・🔷 `uranusSunInertial3d`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 1 本) |
| cluster | 82.0 | 領域の宣言 | 2 本: 🌌 `galaxy`・🍇 `tuc47`(ほかに掲載の外の本 1 本) |
| charondfm | 75.0 | 領域の宣言 | 0 本(ほかに掲載の外の本 2 本) |
| galaxychain | 72.0 | 領域の宣言 | 1 本: 🎠 `galaxyMeshSpiral`(ほかに掲載の外の本 3 本) |
| nbcompose-320c | 72.0 | 領域の宣言 | 10 本: 🟠 `jupiterGalilean`・🏀 `jupiterSunInertial3d`・🔴 `marsSunInertial3d`・☿ `mercury`・🌡️ `mercurySunInertial3d`・💙 `neptuneSunInertial3d`・💍 `saturnRingReal`・🟡 `saturnSunInertial3d`・🔷 `uranusSunInertial3d`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 1 本) |
| sphereaxial-307a | 65.0 | 領域の宣言 | 1 本: 🍩 `saturnRingInertial3d`(ほかに掲載の外の本 3 本) |
| twobody-357e | 65.0 | 領域の宣言 | 20 本: ✨ `alphaCenAB`・🔶 `alphaCenABInertial3d`・⭐ `binary`・♊ `binaryCheckEqualInertial3d`・⚖️ `binaryCheckRatio3Inertial3d`・🫂 `boxBinaryToy`・🪗 `compactForceToy`・🌐 `coord3dKeplerTilt`・🎲 `coord3dSpinPrecess`・♾️ `fig8`・🎐 `gw150914`・🐌 `inertialDragPair`・📿 `psrB1534`・📻 `psrDoubleAB`・🧮 `psrJ1757DFM`・🩺 `psrJ1946DFM`・🌟 `siriusAB`・🌠 `siriusABInertial3d`・⚙️ `spinDipoleBinary`・👥 `twoBodyOnly3d` |
| growth287 | 60.0 | 領域の宣言 | 1 本: 🔥 `gas`(ほかに掲載の外の本 3 本) |
| eqthird-353zi | 60.0 | html を読まない | — |
| kf0 | 59.0 | 常時群 | — |
| emonly-300b | 56.0 | 領域の宣言 | 2 本: 🌔 `earthMoonOnly3d`・🌦️ `earthMoonSunInertial3d` |
| analogy | 55.0 | 領域の宣言 | 2 本: 🎠 `galaxyMeshSpiral`・🔥 `gas`(ほかに掲載の外の本 5 本) |
| bgtime287 | 53.0 | 領域の宣言 | all(内蔵の全 189 本) |
| bgbudget2 | 51.0 | 領域の宣言 | 3 本: 🌘 `earthMoonRealKF1`・🌌 `galaxy`・📻 `psrDoubleAB`(ほかに掲載の外の本 1 本) |
| galaxylite | 50.0 | 領域の宣言 | 0 本(ほかに掲載の外の本 2 本) |
| bgequiv | 48.0 | 領域の宣言 | 2 本: 🌘 `earthMoonRealKF1`・📻 `psrDoubleAB`(ほかに掲載の外の本 1 本) |
| d68three | 47.0 | 常時群 | — |
| spiral290 | 47.0 | 領域の宣言 | 6 本: 🧵 `shapeToyArm`・🧹 `shapeToyArmCore`・🥏 `shapeToyDisk`・📀 `shapeToyDiskCore`・🍭 `shapeToySpiral`・🎢 `shapeToySpiralCore` |
| ref3d-299e | 47.0 | 領域の宣言 | 8 本: 🧵 `shapeToyArm`・🧹 `shapeToyArmCore`・🔮 `shapeToyCluster`・🎱 `shapeToyClusterCore`・🥏 `shapeToyDisk`・📀 `shapeToyDiskCore`・🍭 `shapeToySpiral`・🎢 `shapeToySpiralCore` |
| obsspin-324b | 46.0 | 領域の宣言 | 18 本: ✨ `alphaCenAB`・🔶 `alphaCenABInertial3d`・🔸 `alphaCenABInertial3dJ`・⭐ `binary`・🫂 `boxBinaryToy`・🪗 `compactForceToy`・🌐 `coord3dKeplerTilt`・🎲 `coord3dSpinPrecess`・♾️ `fig8`・🎐 `gw150914`・🐌 `inertialDragPair`・📿 `psrB1534`・📻 `psrDoubleAB`・📟 `psrDoubleABInertial3d`・🧮 `psrJ1757DFM`・🩺 `psrJ1946DFM`・🌟 `siriusAB`・⚙️ `spinDipoleBinary` |
| elliptical-335f | 45.0 | html を読まない | — |
| axialsum-327a | 44.0 | 領域の宣言 | 1 本: 🗺️ `solarSystem16Inertial3d` |
| shell-304a | 43.0 | 領域の宣言 | 17 本: 🌦️ `earthMoonSunInertial3d`・🟠 `jupiterGalilean`・🏀 `jupiterSunInertial3d`・🥔 `marsMoonsReal`・🔴 `marsSunInertial3d`・☿ `mercury`・☄️ `mercuryReal`・🌡️ `mercurySunInertial3d`・🟫 `mercurySunInertialFit`・🌊 `neptuneReal`・💙 `neptuneSunInertial3d`・💍 `saturnRingReal`・🟡 `saturnSunInertial3d`・💠 `uranusReal`・🔷 `uranusSunInertial3d`・🌇 `venusReal`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 3 本) |
| sunorigin-352x | 43.0 | html を読まない | — |
| partytime-343b | 41.0 | html を読まない | — |
| keepcone-352w | 41.0 | html を読まない | — |
| geo3bin-321b | 40.0 | 領域の宣言 | all(内蔵の全 189 本) |
| galrot-329b | 40.0 | 領域の宣言 | 11 本: 🟠 `jupiterGalilean`・🏀 `jupiterSunInertial3d`・🔴 `marsSunInertial3d`・☿ `mercury`・🌡️ `mercurySunInertial3d`・💙 `neptuneSunInertial3d`・🌃 `ngc3198`・💍 `saturnRingReal`・🟡 `saturnSunInertial3d`・🔷 `uranusSunInertial3d`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 2 本) |
| oblatering-341d | 40.0 | html を読まない | — |
| equalradius-353zg | 40.0 | html を読まない | — |
| comove-353zh | 40.0 | html を読まない | — |
| fixcap288 | 39.0 | 領域の宣言 | 1 本: 🔥 `gas`(ほかに掲載の外の本 4 本) |
| draglong-347d | 39.0 | html を読まない | — |
| binarylaw-334d | 38.0 | 領域の宣言 | 10 本: 🔶 `alphaCenABInertial3d`・🔸 `alphaCenABInertial3dJ`・♊ `binaryCheckEqualInertial3d`・⚖️ `binaryCheckRatio3Inertial3d`・🥶 `plutoCharonDiagInput`・🟪 `plutoCharonInertialFit`・📿 `psrB1534`・📟 `psrDoubleABInertial3d`・🧮 `psrJ1757DFM`・🩺 `psrJ1946DFM` |
| dragest-318d | 36.0 | 領域の宣言 | 10 本: 🟠 `jupiterGalilean`・🏀 `jupiterSunInertial3d`・🔴 `marsSunInertial3d`・☿ `mercury`・🌡️ `mercurySunInertial3d`・💙 `neptuneSunInertial3d`・💍 `saturnRingReal`・🟡 `saturnSunInertial3d`・🔷 `uranusSunInertial3d`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 1 本) |
| rangecols-355c | 35.0 | html を読まない | — |
| gyropath-340d | 34.0 | html を読まない | — |
| partyconv-344b | 34.0 | html を読まない | — |
| rotring-337i | 32.0 | html を読まない | — |
| twoaxis-353x | 32.0 | html を読まない | — |
| axialsign-302e | 31.0 | 領域の宣言 | 0 本(ほかに掲載の外の本 1 本) |
| convbody-347b | 31.0 | html を読まない | — |
| drag3d-298c | 30.0 | 領域の宣言 | 2 本: 🌦️ `earthMoonSunInertial3d`・🐌 `inertialDragPair`(ほかに掲載の外の本 3 本) |
| fluid-337e | 30.0 | html を読まない | — |
| diskaxis-348d | 30.0 | html を読まない | — |
| d0audit | 28.0 | 領域の宣言 | all(内蔵の全 189 本) |
| bgbudget | 28.0 | 領域の宣言 | 2 本: 🌘 `earthMoonRealKF1`・📻 `psrDoubleAB`(ほかに掲載の外の本 1 本) |
| moonapsis-335e | 27.0 | 領域の宣言 | 2 本: 🌔 `earthMoonOnly3d`・🌦️ `earthMoonSunInertial3d` |
| dragconv-344d | 27.0 | html を読まない | — |
| ledger-334b | 26.0 | html を読まない | — |
| sync | 25.0 | html を読まない | — |
| galaxyprof | 25.0 | 物理の部分(htmlPhys) | — |
| axisenergy-347i | 25.0 | html を読まない | — |
| dt3 | 24.0 | 常時群 | — |
| fluidconv-340g | 24.0 | html を読まない | — |
| diskgeo3-348i | 24.0 | html を読まない | — |
| fieldcontract-328a | 23.0 | 領域の宣言 | 11 本: 🟠 `jupiterGalilean`・🏀 `jupiterSunInertial3d`・🔴 `marsSunInertial3d`・☿ `mercury`・🌡️ `mercurySunInertial3d`・💙 `neptuneSunInertial3d`・💍 `saturnRingReal`・🟡 `saturnSunInertial3d`・🗺️ `solarSystem16Inertial3d`・🔷 `uranusSunInertial3d`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 1 本) |
| gridfloor-334e | 23.0 | html を読まない | — |
| tidelock-337c | 23.0 | html を読まない | — |
| binbooks-322b | 22.0 | 領域の宣言 | 19 本: ✨ `alphaCenAB`・🔶 `alphaCenABInertial3d`・⭐ `binary`・♊ `binaryCheckEqualInertial3d`・⚖️ `binaryCheckRatio3Inertial3d`・🫂 `boxBinaryToy`・🪗 `compactForceToy`・🌐 `coord3dKeplerTilt`・🎲 `coord3dSpinPrecess`・♾️ `fig8`・🎐 `gw150914`・🐌 `inertialDragPair`・📿 `psrB1534`・📻 `psrDoubleAB`・🧮 `psrJ1757DFM`・🩺 `psrJ1946DFM`・🌟 `siriusAB`・🌠 `siriusABInertial3d`・⚙️ `spinDipoleBinary` |
| bh90 | 21.0 | 物理の部分(htmlPhys) | — |
| strain | 21.0 | 領域の宣言 | 2 本: 🎠 `galaxyMeshSpiral`・🧹 `shapeToyArmCore` |
| bevel-308a | 21.0 | 領域の宣言 | 4 本: 🟠 `jupiterGalilean`・🏀 `jupiterSunInertial3d`・🍩 `saturnRingInertial3d`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 3 本) |
| bgrange288 | 20.0 | 領域の宣言 | all(内蔵の全 189 本) |
| galaxyprof2 | 19.0 | 物理の部分(htmlPhys) | — |
| gloc-302b | 18.0 | 領域の宣言 | 6 本: 🌦️ `earthMoonSunInertial3d`・🔴 `marsSunInertial3d`・☄️ `mercuryReal`・🌡️ `mercurySunInertial3d`・🟫 `mercurySunInertialFit`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 1 本) |
| recvradius-353c | 18.0 | html を読まない | — |
| chain-296c | 17.0 | 領域の宣言 | all(内蔵の全 189 本) |
| transgeo2-332b | 17.0 | 領域の宣言 | 1 本: 💫 `galaxyGeo2` |
| bgfield284 | 16.0 | 領域の宣言 | all(内蔵の全 189 本) |
| spinreset-348b | 16.0 | html を読まない | — |
| galdisk-352f | 16.0 | html を読まない | — |
| venuslock-353g | 16.0 | html を読まない | — |
| eihdiag287 | 15.0 | 領域の宣言 | all(内蔵の全 189 本) |
| statecontract-302e | 15.0 | 領域の宣言 | all(内蔵の全 189 本) |
| rotvert-339a | 15.0 | 領域の宣言 | all(内蔵の全 189 本) |
| jeans286 | 14.0 | 領域の宣言 | 1 本: 🔥 `gas`(ほかに掲載の外の本 2 本) |
| rsexcess-315b | 14.0 | 領域の宣言 | all(内蔵の全 189 本) |
| r3energy-351g | 13.0 | html を読まない | — |
| mercurycombo-335c | 12.0 | 領域の宣言 | 4 本: 🔴 `marsSunInertial3d`・☿ `mercury`・🌡️ `mercurySunInertial3d`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 1 本) |
| suntiltmain-353o | 12.0 | html を読まない | — |
| powerball2 | 11.0 | html を読まない | — |
| hold-308b | 11.0 | 領域の宣言 | 2 本: 🏀 `jupiterSunInertial3d`・🌋 `venusSunInertial3d` |
| axialdiff-327e | 11.0 | 領域の宣言 | 1 本: 🗺️ `solarSystem16Inertial3d` |
| binarytilt-335d | 11.0 | 領域の宣言 | 11 本: 🔶 `alphaCenABInertial3d`・🔸 `alphaCenABInertial3dJ`・♊ `binaryCheckEqualInertial3d`・⚖️ `binaryCheckRatio3Inertial3d`・🥶 `plutoCharonDiagInput`・🟪 `plutoCharonInertialFit`・📿 `psrB1534`・📟 `psrDoubleABInertial3d`・🧮 `psrJ1757DFM`・🩺 `psrJ1946DFM`・🌠 `siriusABInertial3d` |
| ringbook-338d | 11.0 | html を読まない | — |
| spinfield-338e | 11.0 | html を読まない | — |
| contractrange289 | 10.0 | 領域の宣言 | all(内蔵の全 189 本) |
| mercurynode-334c | 10.0 | 領域の宣言 | 3 本: 🔴 `marsSunInertial3d`・🌡️ `mercurySunInertial3d`・🌋 `venusSunInertial3d` |
| clockstop-342b | 10.0 | html を読まない | — |
| knobrank-351k | 10.0 | html を読まない | — |
| dirmatch-353t | 10.0 | html を読まない | — |
| massradius-353zb | 10.0 | html を読まない | — |
| threecols-353zf | 10.0 | html を読まない | — |
| twobody | 9.00 | 領域の宣言 | 0 本(ほかに掲載の外の本 1 本) |
| srcheat-320a | 9.00 | 領域の宣言 | 3 本: 🏀 `jupiterSunInertial3d`・🗺️ `solarSystem16Inertial3d`・🌋 `venusSunInertial3d` |
| galaxis-327b | 9.00 | 領域の宣言 | 11 本: 🟠 `jupiterGalilean`・🏀 `jupiterSunInertial3d`・🔴 `marsSunInertial3d`・☿ `mercury`・🌡️ `mercurySunInertial3d`・💙 `neptuneSunInertial3d`・💍 `saturnRingReal`・🟡 `saturnSunInertial3d`・🗺️ `solarSystem16Inertial3d`・🔷 `uranusSunInertial3d`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 1 本) |
| venustide-327f | 9.00 | 領域の宣言 | 1 本: 🗺️ `solarSystem16Inertial3d` |
| accelloss-337d | 9.00 | html を読まない | — |
| axisdiff-347h | 9.00 | html を読まない | — |
| ktilt-353za | 9.00 | html を読まない | — |
| inertial290 | 8.00 | 領域の宣言 | 3 本: 🫂 `boxBinaryToy`・🪗 `compactForceToy`・🐌 `inertialDragPair`(ほかに掲載の外の本 1 本) |
| invsq-310a | 8.00 | 領域の宣言 | all(内蔵の全 189 本) |
| pn1x3d-314d | 8.00 | 領域の宣言 | all(内蔵の全 189 本) |
| lightmass-341e | 8.00 | html を読まない | — |
| recvscale-353v | 8.00 | html を読まない | — |
| dirgeo-353zc | 8.00 | html を読まない | — |
| bgaudit291 | 7.00 | 領域の宣言 | 1 本: 🐌 `inertialDragPair`(ほかに掲載の外の本 2 本) |
| corecensus293 | 7.00 | 領域の宣言 | all(内蔵の全 189 本) |
| spindecomp-307c | 7.00 | 領域の宣言 | 3 本: 🟠 `jupiterGalilean`・🏀 `jupiterSunInertial3d`・🌋 `venusSunInertial3d` |
| corespin-311a | 7.00 | 領域の宣言 | 1 本: 🌡️ `mercurySunInertial3d` |
| response-328b | 7.00 | 領域の宣言 | 11 本: 🟠 `jupiterGalilean`・🏀 `jupiterSunInertial3d`・🔴 `marsSunInertial3d`・☿ `mercury`・🌡️ `mercurySunInertial3d`・💙 `neptuneSunInertial3d`・💍 `saturnRingReal`・🟡 `saturnSunInertial3d`・🗺️ `solarSystem16Inertial3d`・🔷 `uranusSunInertial3d`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 1 本) |
| spinbias-329a | 7.00 | 領域の宣言 | 1 本: 🗺️ `solarSystem16Inertial3d` |
| lightweight-340e | 7.00 | html を読まない | — |
| orbitk-353zj | 7.00 | html を読まない | — |
| obscompare | 6.00 | 領域の宣言 | 20 本: ✨ `alphaCenAB`・🌙 `earthMoonReal`・🌘 `earthMoonRealKF1`・🔆 `emAuditSolar`・🎐 `gw150914`・⏰ `gw150914Merge4s`・🟠 `jupiterGalilean`・🥔 `marsMoonsReal`・☄️ `mercuryReal`・🌊 `neptuneReal`・🥶 `plutoCharonDiagInput`・📿 `psrB1534`・📻 `psrDoubleAB`・🧮 `psrJ1757DFM`・🩺 `psrJ1946DFM`・💍 `saturnRingReal`・📡 `saturnZonalD68`・🌟 `siriusAB`・💠 `uranusReal`・🌇 `venusReal`(ほかに掲載の外の本 18 本) |
| families | 6.00 | 領域の宣言 | all(内蔵の全 189 本) |
| coord3d-298a | 6.00 | 領域の宣言 | 3 本: 🌐 `coord3dKeplerTilt`・🎲 `coord3dSpinPrecess`・🐌 `inertialDragPair`(ほかに掲載の外の本 1 本) |
| approxmany-301b | 6.00 | 領域の宣言 | all(内蔵の全 189 本) |
| decay-312a | 6.00 | 領域の宣言 | 6 本: 🌦️ `earthMoonSunInertial3d`・🏀 `jupiterSunInertial3d`・🔴 `marsSunInertial3d`・☿ `mercury`・🌡️ `mercurySunInertial3d`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 1 本) |
| kappam-313a | 6.00 | 領域の宣言 | 6 本: 🌦️ `earthMoonSunInertial3d`・🏀 `jupiterSunInertial3d`・🔴 `marsSunInertial3d`・☿ `mercury`・🌡️ `mercurySunInertial3d`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 1 本) |
| srcradius-319b | 6.00 | 領域の宣言 | 10 本: 🟠 `jupiterGalilean`・🏀 `jupiterSunInertial3d`・🔴 `marsSunInertial3d`・☿ `mercury`・🌡️ `mercurySunInertial3d`・💙 `neptuneSunInertial3d`・💍 `saturnRingReal`・🟡 `saturnSunInertial3d`・🔷 `uranusSunInertial3d`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 1 本) |
| axialfield-333b | 6.00 | 領域の宣言 | 2 本: 💍 `saturnRingReal`・🗺️ `solarSystem16Inertial3d` |
| mercury3d-333c | 6.00 | 領域の宣言 | 3 本: 🔴 `marsSunInertial3d`・🌡️ `mercurySunInertial3d`・🌋 `venusSunInertial3d` |
| diskcheck-350g | 6.00 | html を読まない | — |
| bgwindow-352y | 6.00 | html を読まない | — |
| boxone-357d | 6.00 | 領域の宣言 | 1 本: ☝️ `boxone` |
| meshnod0 | 5.00 | 領域の宣言 | 0 本(ほかに掲載の外の本 1 本) |
| dyncenter | 5.00 | html を読まない | — |
| sphereKernel | 5.00 | 領域の宣言 | 1 本: 🔥 `gas` |
| dragprofile | 5.00 | 領域の宣言 | 12 本: 🌘 `earthMoonRealKF1`・🔥 `gas`・🟠 `jupiterGalilean`・🥔 `marsMoonsReal`・☄️ `mercuryReal`・🌊 `neptuneReal`・🧮 `psrJ1757DFM`・🩺 `psrJ1946DFM`・💍 `saturnRingReal`・📡 `saturnZonalD68`・💠 `uranusReal`・🌇 `venusReal`(ほかに掲載の外の本 9 本) |
| invsq-309a | 5.00 | 領域の宣言 | all(内蔵の全 189 本) |
| recheck-309c | 5.00 | 領域の宣言 | 11 本: 🌌 `galaxy`・💫 `galaxyGeo2`・🎡 `galaxyStd`・🟠 `jupiterGalilean`・🏀 `jupiterSunInertial3d`・🔴 `marsSunInertial3d`・🌡️ `mercurySunInertial3d`・💙 `neptuneSunInertial3d`・🟡 `saturnSunInertial3d`・🔷 `uranusSunInertial3d`・🌋 `venusSunInertial3d` |
| symbols-315a | 5.00 | 領域の宣言 | all(内蔵の全 189 本) |
| spinclass-330a | 5.00 | 領域の宣言 | 11 本: 🟠 `jupiterGalilean`・🏀 `jupiterSunInertial3d`・🔴 `marsSunInertial3d`・☿ `mercury`・🌡️ `mercurySunInertial3d`・💙 `neptuneSunInertial3d`・💍 `saturnRingReal`・🟡 `saturnSunInertial3d`・🗺️ `solarSystem16Inertial3d`・🔷 `uranusSunInertial3d`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 1 本) |
| noncirc-333d | 5.00 | html を読まない | — |
| mercuryband-337b | 5.00 | html を読まない | — |
| surfquad-343d | 5.00 | html を読まない | — |
| axisgeo3-348h | 5.00 | html を読まない | — |
| structfit-350f | 5.00 | html を読まない | — |
| coprec-352p | 5.00 | html を読まない | — |
| p2figs-356b | 5.00 | html を読まない | — |
| slipaudit | 4.00 | 領域の宣言 | 0 本 |
| calcontract | 4.00 | 領域の宣言 | all(内蔵の全 189 本) |
| compose288 | 4.00 | 領域の宣言 | 0 本(ほかに掲載の外の本 2 本) |
| spinprec288 | 4.00 | 領域の宣言 | 0 本(ほかに掲載の外の本 1 本) |
| tide3d-307b | 4.00 | 領域の宣言 | 3 本: 🟠 `jupiterGalilean`・🏀 `jupiterSunInertial3d`・🌋 `venusSunInertial3d` |
| centrifugal-331b | 4.00 | 領域の宣言 | 2 本: 💍 `saturnRingReal`・🗺️ `solarSystem16Inertial3d` |
| gyrodrag-337k | 4.00 | html を読まない | — |
| clockmid-344c | 4.00 | html を読まない | — |
| spinform-352k | 4.00 | html を読まない | — |
| srcoblate-353d | 4.00 | html を読まない | — |
| venus098-353j | 4.00 | html を読まない | — |
| watch098-353n | 4.00 | html を読まない | — |
| nearrecv-353u | 4.00 | html を読まない | — |
| powerball | 3.00 | html を読まない | — |
| samplestatus | 3.00 | 常時群 | — |
| bgdiff286 | 3.00 | 領域の宣言 | all(内蔵の全 189 本) |
| weakfield289 | 3.00 | 領域の宣言 | all(内蔵の全 189 本) |
| nearfar289 | 3.00 | 領域の宣言 | 0 本(ほかに掲載の外の本 1 本) |
| pairheat-310b | 3.00 | 領域の宣言 | 13 本: 🌔 `earthMoonOnly3d`・🌦️ `earthMoonSunInertial3d`・🌌 `galaxy`・💫 `galaxyGeo2`・🎡 `galaxyStd`・🟠 `jupiterGalilean`・🏀 `jupiterSunInertial3d`・🔴 `marsSunInertial3d`・🌡️ `mercurySunInertial3d`・💙 `neptuneSunInertial3d`・🟡 `saturnSunInertial3d`・🔷 `uranusSunInertial3d`・🌋 `venusSunInertial3d` |
| rdexcess-314a | 3.00 | 領域の宣言 | 6 本: 🌦️ `earthMoonSunInertial3d`・🏀 `jupiterSunInertial3d`・🔴 `marsSunInertial3d`・☿ `mercury`・🌡️ `mercurySunInertial3d`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 1 本) |
| jexplore-320b | 3.00 | 領域の宣言 | 10 本: 🟠 `jupiterGalilean`・🏀 `jupiterSunInertial3d`・🔴 `marsSunInertial3d`・☿ `mercury`・🌡️ `mercurySunInertial3d`・💙 `neptuneSunInertial3d`・💍 `saturnRingReal`・🟡 `saturnSunInertial3d`・🔷 `uranusSunInertial3d`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 1 本) |
| axialheat-326d | 3.00 | 領域の宣言 | 1 本: 🗺️ `solarSystem16Inertial3d` |
| dragweight-330b | 3.00 | 領域の宣言 | 1 本: 🗺️ `solarSystem16Inertial3d` |
| coordtwist-331a | 3.00 | 領域の宣言 | 1 本: 🗺️ `solarSystem16Inertial3d` |
| rotdiff-333a | 3.00 | 領域の宣言 | 2 本: 💍 `saturnRingReal`・🗺️ `solarSystem16Inertial3d` |
| heightlaw-334a | 3.00 | html を読まない | — |
| spinorbit-337j | 3.00 | html を読まない | — |
| gyroheat-341f | 3.00 | html を読まない | — |
| axisheat-350d | 3.00 | html を読まない | — |
| ringstep-351j | 3.00 | html を読まない | — |
| venuslong-352n | 3.00 | html を読まない | — |
| obsradius-352o | 3.00 | html を読まない | — |
| twobg-352r | 3.00 | html を読まない | — |
| bgrange-355b | 3.00 | html を読まない | — |
| qsplit | 2.00 | 領域の宣言 | all(内蔵の全 189 本) |
| rpar | 2.00 | 領域の宣言 | 0 本 |
| nslockledger | 2.00 | 領域の宣言 | all(内蔵の全 189 本) |
| bhcore | 2.00 | 領域の宣言 | 1 本: 🎐 `gw150914`(ほかに掲載の外の本 1 本) |
| presetaxes | 2.00 | 領域の宣言 | all(内蔵の全 189 本) |
| bgfield | 2.00 | 領域の宣言 | 0 本 |
| d0audit2 | 2.00 | 物理の部分(htmlPhys) | — |
| bgpredict | 2.00 | 領域の宣言 | all(内蔵の全 189 本) |
| bgcompose | 2.00 | 領域の宣言 | 0 本 |
| needmesh | 2.00 | 物理の部分(htmlPhys) | — |
| rotorledger | 2.00 | 領域の宣言 | all(内蔵の全 189 本) |
| bgderiv | 2.00 | 領域の宣言 | 0 本 |
| ckfixcap290 | 2.00 | 領域の宣言 | 2 本: 🧅 `layeredCoreDFM`・🧵 `shapeToyArm`(ほかに掲載の外の本 5 本) |
| calcause292 | 2.00 | 領域の宣言 | 19 本: ✨ `alphaCenAB`・🌙 `earthMoonReal`・🔆 `emAuditSolar`・🎐 `gw150914`・⏰ `gw150914Merge4s`・🟠 `jupiterGalilean`・🥔 `marsMoonsReal`・☄️ `mercuryReal`・🌊 `neptuneReal`・🥶 `plutoCharonDiagInput`・📿 `psrB1534`・📻 `psrDoubleAB`・🧮 `psrJ1757DFM`・🩺 `psrJ1946DFM`・💍 `saturnRingReal`・📡 `saturnZonalD68`・🌟 `siriusAB`・💠 `uranusReal`・🌇 `venusReal` |
| maintain-309b | 2.00 | 領域の宣言 | 2 本: 🏀 `jupiterSunInertial3d`・🌋 `venusSunInertial3d`(ほかに掲載の外の本 1 本) |
| sunspin-308c | 2.00 | 領域の宣言 | 11 本: 🌌 `galaxy`・💫 `galaxyGeo2`・🎡 `galaxyStd`・🟠 `jupiterGalilean`・🏀 `jupiterSunInertial3d`・🔴 `marsSunInertial3d`・🌡️ `mercurySunInertial3d`・💙 `neptuneSunInertial3d`・🟡 `saturnSunInertial3d`・🔷 `uranusSunInertial3d`・🌋 `venusSunInertial3d` |
| eqband-332a | 2.00 | 領域の宣言 | 2 本: 💍 `saturnRingReal`・🗺️ `solarSystem16Inertial3d` |
| carryledger-335b | 2.00 | 領域の宣言 | 2 本: ☿ `mercury`・🗺️ `solarSystem16Inertial3d`(ほかに掲載の外の本 1 本) |
| heatlock-338f | 2.00 | html を読まない | — |
| selfclock-347c | 2.00 | html を読まない | — |
| axisbalance-348c | 2.00 | html を読まない | — |
| sphereconv-350b | 2.00 | html を読まない | — |
| gyrostep-350c | 2.00 | html を読まない | — |
| r3step-351d | 2.00 | html を読まない | — |
| satlock-351f | 2.00 | html を読まない | — |
| refaxis-352c | 2.00 | html を読まない | — |
| sunrecv-352e | 2.00 | html を読まない | — |
| venusbal-352h | 2.00 | html を読まない | — |
| stableprec-352i | 2.00 | html を読まない | — |
| maintable-352j | 2.00 | html を読まない | — |
| suntilt-352l | 2.00 | html を読まない | — |
| response-352q | 2.00 | html を読まない | — |
| satring-352s | 2.00 | html を読まない | — |
| paper1prep-352t | 2.00 | 領域の宣言 | 5 本: ⏱️ `gclock`・🛰️ `grcal`・🕰️ `grcalGps`・🌟 `grcalLight`・⏲️ `grcalShapiro` |
| cancelmap-352v | 2.00 | html を読まない | — |
| sconseq-352za | 2.00 | html を読まない | — |
| maincol-353b | 2.00 | html を読まない | — |
| focus098-353e | 2.00 | html を読まない | — |
| ratesum-353f | 2.00 | html を読まない | — |
| ringdisk-353h | 2.00 | html を読まない | — |
| ringstd-353k | 2.00 | html を読まない | — |
| earthonvenus-353l | 2.00 | html を読まない | — |
| residsign-353m | 2.00 | html を読まない | — |
| cancelstd-353p | 2.00 | html を読まない | — |
| onek-353q | 2.00 | html を読まない | — |
| residfit-353r | 2.00 | html を読まない | — |
| srcinterp-353s | 2.00 | html を読まない | — |
| ringsurf-353y | 2.00 | html を読まない | — |
| lockdef-353zk | 2.00 | html を読まない | — |
| recordid | 1.00 | html を読まない | — |
| plutostates | 1.00 | html を読まない | — |
| assessed | 1.00 | 常時群 | — |
| confirm2 | 1.00 | html を読まない | — |
| selfinertia | 1.00 | 物理の部分(htmlPhys) | — |
| htmlagg | 1.00 | 常時群 | — |
| ejectstate289 | 1.00 | 領域の宣言 | 1 本: 🔥 `gas`(ほかに掲載の外の本 4 本) |
| reldrag289 | 1.00 | html を読まない | — |
| satan-317d | 1.00 | html を読まない | — |
| supply-337a | 1.00 | html を読まない | — |
| bevel-337l | 1.00 | html を読まない | — |
| bevelknob-338b | 1.00 | html を読まない | — |
| axialsplit-340b | 1.00 | html を読まない | — |
| heatsource-340f | 1.00 | html を読まない | — |
| bodycoef-341b | 1.00 | html を読まない | — |
| plutocontrol-341g | 1.00 | html を読まない | — |
| oblateapprox-342c | 1.00 | html を読まない | — |
| powerball-342e | 1.00 | html を読まない | — |
| clockread-343c | 1.00 | html を読まない | — |
| spintransfer-343e | 1.00 | html を読まない | — |
| plutostate-343g | 1.00 | html を読まない | — |
| spincompose-344e | 1.00 | html を読まない | — |
| plutogm-344g | 1.00 | html を読まない | — |
| engine-345b | 1.00 | 常時群 | — |
| spintorque-347e | 1.00 | html を読まない | — |
| bgaxial-350e | 1.00 | html を読まない | — |
| c2main-351b | 1.00 | html を読まない | — |
| srcparts-351c | 1.00 | html を読まない | — |
| bgbalance-351e | 1.00 | html を読まない | — |
| provisional-352b | 1.00 | html を読まない | — |
| precsense-352d | 1.00 | html を読まない | — |
| tidaldrag-352u | 1.00 | html を読まない | — |
| obpower-353z | 1.00 | html を読まない | — |
| kqopen-355e | 1.00 | html を読まない | — |
| p1figs-356a | 1.00 | html を読まない | — |
| obsintake | 0.00 | html を読まない | — |
| corrections | 0.00 | html を読まない | — |
| solarsigma | 0.00 | 常時群 | — |
| stoprule | 0.00 | 常時群 | — |
| issues | 0.00 | 常時群 | — |
| intakeB | 0.00 | html を読まない | — |
| confirm3 | 0.00 | html を読まない | — |
| confirm4 | 0.00 | html の全文(宣言 —— 器が html の全文から外部名の出現数を数えて歴史文書の残数の表に写す(注釈・文を含む全文 —— 物理は読まない)・正本は meta の無い旧形式で毎回走る(実測 0 s)) | — |
| declmatch | 0.00 | html を読まない | — |
| solutionid | 0.00 | html を読まない | — |
| derived | 0.00 | html を読まない | — |
| armbar | 0.00 | html を読まない | — |
| kf0ledger-old | 0.00 | 常時群 | — |
| kf0ledger | 0.00 | 常時群 | — |

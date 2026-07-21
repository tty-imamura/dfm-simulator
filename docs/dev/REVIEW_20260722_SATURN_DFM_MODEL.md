# 第12次外部AIレビュー裁定記録 — ルート/beta比較・DFM版土星モデル(2026-07-22)

- レビュー3系統: ChatGPT(root/beta比較+多層土星設計)/ Gemini(比較+rigid disk 案)/
  Grok(比較+kappaS 調整案)
- 裁定者: 開発セッション(規約 §1-2)。実装先: **beta のみ**(ルート不変)
- 併せて原仮定者指示を実装: **🧭 saturnZonal の線の軌跡(overlays.trail)を既定ON**
- 関連: 🧊 saturnIce プリセット新設、QA `zonal.trail-default` / `ice.e10-off` / `ice.thermal-isolation`

## 1. 裁定の要約

3件とも「ルート版と beta 版の比較」は概ね正確(検証済み)。本命の提案は
**「自転→扁平化→重力多重極→環歳差」を DFM 内で自己生成する多層土星モデル**(ChatGPT が
最も具体的)だが、これは材質別係数・楕円層ジェネレータ・bulkOmega 分離・J フィットという
**エンジン拡張4点を要する大型スプリント**であり、本セッションでは**方向性を採用した上で保留**
(開発キュー §6-2 へ)。今すぐ実装可能な範囲として、ChatGPT §8 の暫定プリセットを
**🧊 saturnIce として内蔵化**した(kFrame は実測に基づき 0 へ裁定変更 — 下記 C3)。

## 2. 主張別の裁定表

### ChatGPT

| # | 主張 | 検証 | 裁定 |
|---|---|---|---|
| C1 | ルート/beta 比較(🪐は数値同一・beta は OGP/PWA/バッジ/E13/🧭 追加) | リポジトリと一致。behavior.saturn が両ターゲットで同一値 PASS(inAnn=100%/drift=0.0)なのも傍証 | **確認 — 正確** |
| C2 | E10′ は非接触でもカーネル g(d) で熱が伝わるため、「氷=熱伝播なし」には kappaS=0 が必要 | 実装確認: E10′ は kappaS ゲート・接触不要(📏プリセットの主張とも整合) | **採用**(🧊 の主役パラメータ) |
| C3 | 暫定プリセット(§8: C/B/A 実比率 124–153/153–195/203–227・氷粒子 m=0.01–0.03・spin=0・vNoise=0.005・kappaS=0・radiusScale=1.8・kFrame=0.2) | **kFrame=0.2 のみ実測で不採用**: DFM では spin=熱の代理量であり、E6′ の残余トルク移譲(A13 帳簿・③反作用パス)が kFrame>0 だと非接触でスピンを動かす。実測: kFrame=0.2 → 6000步で全環粒子 spin≠0(平均 0.030)/ kFrame=0 → **98.7% が厳密 0 を維持**(平均 0.0024 = 接触した粒のみ) | **採用(kFrame=0 に修正)= 🧊 saturnIce**。裁定変更の理由と実測値をプリセットコメントに焼き込み |
| C4 | エンジン拡張 P0: 材質別係数(thermal/repulsion/friction/damping の √積の対則) | 設計としては妥当。physics 21キー QA・RUNTIME_LLM・validatePreset の同期改修を伴う | **方向性採用・保留**(スキーマ拡張スプリントとして開発キューへ。着手前に HANDOFF_IMPLEMENTATION 追補が必要) |
| C5 | エンジン拡張 P0/P1: oblateAnnulus ジェネレータ・bulkOmega(バルク回転とスピン=熱の分離)・緩和形状からの J2–J6 フィット | bulkOmega 分離は C3 で実測した「spin=熱と自転の混同」問題の正攻法。J フィットは E13 と対で「DFM 生成 vs Cassini 実測」の A/B を可能にする | **方向性採用・保留**(同上 — 多層土星スプリント。目標扁平率 f≈0.098・χ=ω_core/ω_surface の A/B/C 設計も引き継ぐ) |
| C6 | 検証項目 §9(版比較・扁平化・差動回転・熱分離・環安定) | §9.4(熱分離)は本セッションで QA 化。§9.1 は behavior.saturn の両ターゲット一致が実質カバー | **部分採用**(§9.4 → `ice.thermal-isolation`。残りは多層土星スプリントの受け入れ条件に引き継ぐ) |
| C7 | 現行バリデータは import 時に zonal を受理しない → E13 版は内蔵化が必要 | 実装確認: validatePreset の single 分岐は zonal を透過しない(第11次裁定どおり builtin 専用) | **確認 — 正確**(AI/import への開放は保留のまま) |

### Gemini

| # | 主張 | 検証 | 裁定 |
|---|---|---|---|
| G1 | ルート/beta 比較 | 正確 | **確認** |
| G2 | rigid 回転 disk(m=5–10×60粒)を「赤道バルジ」として置き扁平性を表現する JSON | vMode "rigid" は disk で有効・スキーマも通過(validatePreset で機械確認済み)。ただし 2D では「扁平(赤道バルジ)」は動径方向の質量拡がりとしてしか表せず、帯状重力の生成源としての検証にはならない。また重い disk(総質量 ~450)が環のケプラー場(aroundMass=1500)を乱す恐れ | **不採用(内蔵化せず)** — ユーザーが手動インポートして遊ぶ分には有効な実験として記録。多層土星スプリント(C5)が正式な受け皿 |
| G3 | kappaS≈0.001 で熱伝播をほぼ停止 | 0.001 は「ほぼ」であり厳密0ではない。🧊 は kappaS=0 を採用(C2) | **部分採用**(方向は同じ・値は 0 に強化) |

### Grok

| # | 主張 | 検証 | 裁定 |
|---|---|---|---|
| K1 | ルート/beta 比較 | 概ね正確(「A1–A13, E1′–E13 の公理系」は不正確 — E13 は公理でなく現実較正デモ層) | **確認(注記付き)** |
| K2 | 既存🪐の kappaS を 0.005 等へ下げる調整 | 既存🪐は v1.24 較正の QA `behavior.saturn` が保護しており変更しない方針(第11次 C9 と同じ)。かわりに独立プリセット🧊で kappaS=0 を実装 | **部分採用**(別プリセットとして) |
| K3 | coreSpin/surfaceSpin 属性・多粒子惑星 | ChatGPT C5(bulkOmega)と同方向 | **方向性採用・保留**(C5 に合流) |

## 3. 実装成果物(beta のみ)

1. **🧭 saturnZonal: overlays.trail=true**(原仮定者指示)— 線の軌跡が既定ONになり、
   楕円の向きの回転が開いた瞬間から見える。説明文も既定ON前提に更新。
   QA `zonal.trail-default` で固定
2. **🧊 saturnIce プリセット**(ChatGPT §8 ベース+kFrame=0 裁定): 現実の C/B/A 半径比・
   カッシーニ間隙・氷粒子(m=0.01–0.03, spin=0)・kappaS=0・radiusScale=1.8。
   activeParams=[kappaS, muF, gammaN]
3. **QA 3項目**: `zonal.trail-default` / `ice.e10-off`(kappaS=0 で拡散配列 ds が全ゼロ、
   0.08 で 301/301 非ゼロ — E10′ 停止の機械検証)/ `ice.thermal-isolation`
   (6000步後に環粒子の 90% 以上が spin 厳密0・帯内率 95% 以上・NaN なし)。
   saturnIce の無い対象では自動 SKIP
4. **PHYSICS.md §6 に saturnIce 行**(beta 先行の明記)。sw.js キャッシュキー → beta.3

## 4. 保留・持ち越し(開発キュー「多層土星スプリント」として集約)

ChatGPT C4/C5/C6 + Grok K3 を一本化。着手条件: Fable 級での設計裁定+HANDOFF_IMPLEMENTATION 追補。

1. 材質別係数(particle.material — E10′/E5′/E9 の対則を √積で分離)
2. oblateAnnulus / oblateDisk ジェネレータ(初期 b/a=1 から回転あり/なしの緩和 A/B)
3. bulkOmega(バルク自転)と spin(熱)の分離
4. 緩和形状からの J2–J6 最小二乗フィット → E13 互換場として環計算に使用
   (「DFM 自転→扁平化→多重極→環歳差」の因果チェーン検証。Cassini 実測 🧭 と A/B)
5. 受け入れ条件の骨子: 扁平率 f=0.098±0.005(回転なし対照で有意に小)/
   χ=1.00/1.05/1.10 の3条件比較 / 24000步の環安定(帯間混入 <5% 等 — ChatGPT §9.5)

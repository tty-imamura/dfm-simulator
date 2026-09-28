# tests/fixtures — 旧セーブ移行の恒久固定資産(第86便)

ここに置く JSON は **書き換えない**。コアv1(比率仕様 `coreMR` / `coreSR` / `coreRR`)で
書き出された「実在しうる旧エクスポート」を、当時の封筒形式のまま固定した資産である。
第81便でコアv1 はエンジンから廃止され、旧キーは `validatePreset` の `legacyCoreToV2` が
**読込時にコアv2 `core:{}` へ移行**する。その移行が将来も同じ結果を出し続けることを
QA `migration.fixtures` が機械固定する。

## 目的

- **回帰の検出面**: コアv2 側の値域・既定値・`build` の初期化式を触ったときに、
  「旧セーブを読むと初期状態が変わる」ことを検出する。移行式そのものはアプリ内
  (`legacyCoreToV2`)にあるが、**入力側の代表例が本ディレクトリに固定されている**ため、
  式と入力の両方が同時に動かない限りゲートは反応する。
- **保証範囲の体現**: 移行が保証するのは **t=0 の初期状態一致だけ**である。
  コアv1 の Ω_c は殻スピンに比例追従(Ω_c = coreSR·s(t))したが、コアv2 の J_core は
  独立変数なので、コアが時間発展する構成では**軌跡は旧版と一致しない場合がある**。
  QA も同じ範囲しか主張しない(t=0 の全状態だけを照合し、步進後の一致は検査しない)。

## ファイル

| ファイル | 封筒 | 主題 | 移行先 mode |
| --- | --- | --- | --- |
| `legacy-core-rigid-v2.json` | schemaVersion 2 | 🌍地球と月を編集した旧セーブ(`coreSR=1.0`) | `rigid` |
| `legacy-core-differential-v2.json` | schemaVersion 2 | 🐚重殻ローター型(`coreSR≠1`・single と disk 群) | `differential` |
| `legacy-core-cavity-v3.json` | schemaVersion 3 | 空洞コア(`coreMR<0`・`radiusScale=1.5`) | `cavity` |

封筒はいずれも当時のエクスポート実装をそのまま再現している:

- schemaVersion 2 = v1.37.0(ルート版)の `exportData`
  … `{schemaVersion, appVersion, appBuild, exportedAt, saves, customPresets}`
- schemaVersion 3 = 第80便の `exportData`
  … 同じ封筒。`customPresets` は `withLegacyCore` を通るが、`core:{}` を持たない
  (=旧キーだけの)構成はそのまま素通りするので、旧キーだけのプリセットが入るのは正規の状態。

3種は移行式の分岐を網羅するように選んである:

- `coreRR` **未指定**(Rc は質量比からの既定式 `radiusScale·rMul·√|coreMR·m|`)と
  **指定**(`Rc = coreRR·R`)の両方
- `radius` **未指定**(R = `radiusScale·rMul·√|m|`)と **指定**(R = `radiusScale·radius`)の両方
- `single`(その粒子の値)と `disk` 群(代表値=平均質量・平均スピン)の両方
- `radiusScale` が 1 の構成と 1 以外(1.5)の構成の両方

## 追加・変更のルール

- **既存ファイルは編集しない**。移行式の意図的な変更でゲートが落ちたら、期待値は
  QA 側(`tests/qa.mjs` の `migration.fixtures`)で実測して更新し、fixture は据え置く。
- 新しい分岐を覆いたいときは**新しいファイルを足す**(命名: `legacy-core-<主題>-v<封筒>.json`)。
- 将来スキーマが 5 以降へ進んでも、ここは「その当時の形」を保つ資産なので更新しない。

## retired-w283b.json(第283便b — 退役 7 本の凍結資産)

原仮定者の裁定(第73報)④「ダークローター関連の一部は不用なので廃止の方向」で**退役**(`familyRole:"retired"`)にした 7 本
(🕶️ `darkrotor`・⚫ `bhCore`・🌑 `nebulaRotor`・🐚 `nebulaShell`・⏳ `nebulaBipolar`・🌱 `starSeed`・🪩 `bhCoreTilt`)の凍結資産。
**書き換えない**(器 `tests/exp-w283b-retiredfx.mjs --rev de9e39b` が 1 度だけ作る —— 既存があれば `--force` なしでは止まる)。

- `presets.<id>.raw` … 基点 de9e39b の `BUILTIN_PRESETS` の要素そのもの(JSON 写し)と `presetSigHash`。内蔵から消す日が来ても、
  履歴の正本・試験がこの写しから同じ本を組み立てられる(QA `docs.retired` ④ が内蔵と 200 步の状態のビット一致を照合する)。
- `history` … ゲートから外した 🕶️ の長走行 4 ユニット(`darkrotorMidNew`・`darkrotorMidOld`・`darkrotorLong`・`darkrotorMultiseed`)と、
  その結果を読む 4 試験の**最後の保存 QA の値**(pass・detail・所要 —— 転記であって測り直していない)。
- `mechanism` … ゲートに残す機構の最小試験(コアの交換・傾斜・減光・パワーボールの 1 点ずつ)の試験 ID と本。
- `analogyRef` … ⚫ の尺度比較の参照値(`tests/exp-w282d-analogy.mjs` の参照の行が読む)。

## cluster-w283f-preset.json(第284便a — 第283便f の 💮 の凍結写し)

原仮定者の裁定(第74報)④「clusterAnalogyBH を修正する」で 💮 `clusterAnalogyBH` の宣言(接触ばね・代表粒子の半径・初速・台帳)を
書き換えた。第283便f の器 `tests/exp-w283f-cluster.mjs` と正本 `tests/out/cluster-w283f.json` は**第283便f の宣言の記録**なので、
内蔵の 💮 が第284便a の世代(`massLedger.version` が `w283f-1` でない)ならこの写しを読む(第283便f の宣言が使う経路 ——
vMode virial・既定の接触ばね —— は第284便a で 1 bit も変えていないので、同じ写しから同じ走行になる)。**書き換えない**。

- `preset` … 基点 2a4af53 の `allPresets()` の 💮 の要素(JSON 写し)。`source` に基点の html の sha256 と presetSig の sha256。

## cluster-w284a-preset.json(第285便a — 第284便a の 💮 の凍結写し)

原仮定者の裁定(第75報)⑤「粒子が大き過ぎる。見易さは粒子表示倍率で調整する」と R95/R96 で 💮 `clusterAnalogyBH` の宣言(接触の契約
`contactMode:"none"`・群の `particleRadius`・`dispMag`・台帳の radii の長さ単位換算)を書き換えた。第284便a の器 `tests/exp-w284a-cluster.mjs` と
正本 `tests/out/cluster-w284a.json` は**第284便a の宣言の記録**なので、内蔵の 💮 が第285便a の世代(`massLedger.version` が `w284a-1` でない)なら
この写しを読む(第284便a の宣言が使う経路 —— contactK=0・rMul の半径・vMode equilibrium —— は第285便a で 1 bit も変えていない。今の宣言との
力学のビット一致は器 `tests/exp-w285a-cluster.mjs` の `contactInert().vs284a` が確かめる)。**書き換えない**。

- `preset` … 基点 b92ffa1 の `allPresets()` の 💮 の要素(JSON 写し)。`source` に基点の html の sha256 と presetSig の sha256。

## retired-w284b.json(第284便b — 退役 6 本と ⚡ の旧則の凍結資産)

原仮定者の裁定(第74報)⑤「不用なサンプルを廃止する(galaxyMeshSpiralGeoToyLite・psrDoubleABPN・psrJ1757PN・psrJ1946PN)。f=1 の修正を進める」で
**退役**にした 6 本(🎋 `galaxyMeshSpiralGeoToyLite`・🪶 `psrDoubleABPN`・🪃 `psrJ1757PN`・🪀 `psrJ1946PN`・⭕ `emAuditNewton`〔🌙 と実効 JSON 同一〕・
🪝 `psrDoubleABCF`〔⚡ の f=1 署名と同時〕)と、**f=1 へ移した ⚡ `psrDoubleABDFM` の旧則**(第245〜283便の一次則 f≈2 の条件つき較正)の凍結資産。
**書き換えない**(器 `tests/exp-w284b-retiredfx.mjs` が 1 度だけ作る —— 既存があれば `--force` なしでは止まる)。

- `presets.<id>.raw` … 第284便b の html の `BUILTIN_PRESETS` の要素そのもの(JSON 写し)と `presetSigHash`・基点 2a4af53 の署名(`base`)。
  QA `docs.retired` ④ が内蔵と 200 步の状態のビット一致を照合する(⭕ だけは AN39 の geoPN=1 宣言で署名が基点と違う —— 力学はビット同一)。
- `superseded.psrDoubleABDFM` … 基点 2a4af53 の ⚡ の定義(旧 massCalibration・旧 claims の窓と説明文の値・旧 obsCard の行名)。**現行の根拠ではない**(履歴)。
  QA `behavior.psrF1` が「初速・位置・dragQ は移行前とビット同一(比較用に固定)」をこの写しと照合し、`behavior.w249a-pnResponse` が 🪶 の複製元をこの写しへ付け替える。
- `history.tests` … 付け替えた試験の**基点の保存 QA の値**(pass・detail・所要 —— 転記であって測り直していない)。

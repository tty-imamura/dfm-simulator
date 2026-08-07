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

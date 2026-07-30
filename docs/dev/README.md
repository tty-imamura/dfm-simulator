# docs/dev/ — 開発者向け内部資料

このフォルダには、アプリの利用者・理論の読者向けではない開発用資料を置く。
第49便(2026-07-30)整理: **現役文書のみを直下に置き、役目を終えた文書は `archive/` へ**。

## 現役文書

| ファイル | 内容 |
|---|---|
| MODEL_ROUTING.md | AIモデルルーティングの方針と便ごとの実績記録(追補が正史) |
| HANDOFF_PAPER_V2.md | 第1論文の執筆指示書(正本・自己完結) |
| HANDOFF_PAPER_BOX.md | 第2論文「箱宇宙」骨子 v0.3(原仮定者承認済み) |
| HANDOFF_PAPER2_WRITE.md | 第2論文の執筆指示書(v1.1 — Sprint 0=V29 消化済み) |
| HANDOFF_IMPLEMENTATION.md | アプリ実装指示書(テンプレート1) |
| HANDOFF_RUNTIME_LLM.md | 実行時 LLM プリセット生成のプロンプト仕様(テンプレート2) |
| HANDOFF_OBSERVATION_DATA.md | 観測データのアプリデータ化手順 |
| RELEASE_NOTES_v1.33.md | v1.33.0 Release 本文草案+残チェックリスト |
| EXP_4-66_PROBE_H_DESIGN.md | 台帳4-66 比較実験の設計(実装待ち — exp-4-66.mjs) |

## archive/

過去のレビュー快照(REVIEW_2026072x_*)・廃止済み指示書(HANDOFF_PAPER.md — PAPER_V2 に置換)・
消化済み設計書(DESIGN_4-48 — 第45便で実装済み)。履歴として保全するのみで、参照先は
常に上の現役文書と CHANGELOG・private ロードマップが優先する。

## 運用メモ

- セッション引き継ぎの正本は **private リポジトリ(dfm-simulator-private)の
  roadmap_handoff/** にある(本フォルダはコード側資料のみ)。
- プリセット追加時は docs/PHYSICS.md §6 表の同期が必須(CI docs.preset-table-sync)。

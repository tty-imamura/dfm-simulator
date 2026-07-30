# 第13次外部AIレビュー裁定記録 — Release 前確認(2026-07-22)

- レビュー2系統: ChatGPT(**HOLD 判定** — P0×3/P1×3/P2×3)/ Grok(条件付き Ready)。
  Gemini は今回回答不可(原仮定者報)
- 裁定者: 開発セッション(規約 §1-2: 主張を実装・正本で検証してから採否)
- 実装先: beta/sw.js・.github/workflows/ci.yml・tests/qa.mjs・beta/index.html・CHANGELOG.md

## 1. 裁定の要約

ChatGPT の P0 3件は**いずれも事実と確認し、全て採用・即時修正**した。これで ChatGPT の
最終判定基準(§9)のうち機械側の 1〜4 は充足し、残る Release 条件は**実機確認(基準5)と
昇格 PR そのもの**になる。Grok の推奨(CI beta 必須化・CHANGELOG 追記)も同内容で充足。

## 2. 主張別の裁定表

### ChatGPT(HOLD の根拠と対応)

| # | 主張 | 検証 | 裁定・対応 |
|---|---|---|---|
| P0-1 | CI が beta を検査していない(緑バッジはルート109項目のみ。beta の構文破損すら通過する) | ci.yml を確認 — 事実(`npm test` のみで QA_TARGET 未指定)。PR#47 artifact も target=index.html | **採用**: root/beta の **マトリクス化**(fail-fast:false・timeout 30分・artifact を `qa-results-root`/`qa-results-beta` に分離 = P2-2 も同時解決)。提案 YAML をほぼそのまま採用(SHA 固定は既存方針と一致) |
| P0-2 | SW の activate が**同一オリジンの全キャッシュを削除**(Cache Storage はオリジン単位 — ルート版 SW 導入後に相互破壊)。`caches.match` の全キャッシュ横断も危険 | sw.js を確認 — 事実(`k !== CACHE` で全削除・照合も横断) | **採用**: `CACHE_PREFIX="dfm-beta-"` を導入し、削除は**接頭辞内のみ**・照合も `caches.open(CACHE)` の自キャッシュに限定。キー `dfm-beta-v1.27-b6`。**昇格時は接頭辞を `dfm-release-` へ切替**(昇格手順に明記)。QA `pwa.sw-offline` が名前空間を機械検証 |
| P0-3 | 昇格は index.html 単体では不足(manifest/SW/アイコンが 404 になり PWA が壊れる)— PWA 一式+版数+キャッシュキーを1コミットで | 相対参照を確認 — 事実 | **採用(手順)**: 昇格手順書(ロードマップ §3)を「PWA 一式コピー+接頭辞切替+APP_VERSION/package/CHANGELOG 更新+両CI成功」に改訂 |
| P1-1 | PWA の HTTP 実動作が未検証(file:// QA では SW が動かない。登録失敗も黙殺) | 事実 | **採用**: QA に **`pwa.sw-offline`** を新設(qa.mjs 内でローカル HTTP サーバを起動し beta/ を配信)— SW ready・manifest/sw/アイコン5点の 200・**オフライン再読込成功**・キャッシュ名前空間 dfm-beta-* を機械検証。実測: 全て PASS。登録失敗の画面表示は見送り(QA が検出するため — 記録) |
| P1-2 | 未保存編集がプリセット/セーブ読込で無警告消失(beforeunload も無し) | 再現手順どおり(loadPreset が paramsDirty=false) | **採用(主部)**: presetSelect の change とセーブ一覧の読込ボタンに `confirm(未保存の編集があります。破棄して読み込みますか?)` を追加(dirty 時のみ発火 — QA は HP.loadPreset 直呼びのため無影響)。beforeunload は iOS Safari で保証されないため**見送り**(sessionStorage 自動ドラフトは開発キューへ) |
| P1-3 | beta と Release が localStorage を共有(キー分離 or 明示警告を) | 既知(SECURITY.md 記載)。キー分離(hp_beta_*)は移行・スキーマ双方に波及する大工事 | **部分採用**: 案2(明示)を実装 — **β版の初回起動時に共有ストレージ警告を1度だけ notify**(http(s) かつ /beta/ 配下のみ発火。file:// QA・昇格後ルートでは発火しない)。キー分離は多層土星スプリント等の破壊的実験を始める際に再検討(開発キューへ) |
| P2-1 | README に「テスト運用」見出しがなく SECURITY の参照が切れている | **誤指摘**: README には「### 公開サイトに影響を与えないテスト運用(v1.27 公開後の3層方式)」が実在し、beta URL・localStorage 共有・事前エクスポートも記載済み | **棄却**(参照は有効。報告先等の追記は不要と判断) |
| P2-2 | QA 証跡が曖昧(artifact 名が単一・追跡メタ不足) | 一部事実 | **採用(P0-1 に統合)**: artifact を root/beta に分離。結果 JSON には commit/target/env を記録済み(run ID 等の追加は見送り — 記録) |
| P2-3 | iPhone/Safari 実機 E2E 不足 | 既知(4-22/4-27) | **確認**: Phase C チェックリストを昇格手順の実機確認項目として採用(ロードマップ §3) |

### Grok

| # | 主張 | 検証 | 裁定 |
|---|---|---|---|
| R1 | 総合「条件付き Ready」・QA/CI 健全 | CI が beta を見ていない点を見落としており、ChatGPT P0-1 の方が正確 | **部分確認**(ChatGPT 裁定を優先) |
| R2 | 推奨: beta 向け npm test の実行確認 | QA_TARGET は実装済み・今回 CI 必須化 | **採用済み**(P0-1) |
| R3 | 推奨: CHANGELOG に E13/P2群を追記 | 事実(CHANGELOG は v1.27 まで) | **採用**: 「v1.28(未リリース — beta 検証中)」節を新設し、E13・🪐(実験)・PWA・第13次対応を記載(昇格時に確定) |
| R4 | 推奨 Release 手順(実機→QA→CHANGELOG→昇格→beta 掃除) | ChatGPT Phase A〜D とほぼ同型 | **採用**(昇格手順書に統合) |

## 3. 実装成果物

1. **ci.yml**: root/beta マトリクス(P0-1)+artifact 分離(P2-2)+timeout 30分
2. **beta/sw.js**: `dfm-beta-` 名前空間化(削除・照合とも)。キー `dfm-beta-v1.27-b6`(P0-2)
3. **QA `pwa.sw-offline`**(P1-1): ローカル HTTP 配信で SW ready・アセット5点200・
   オフライン再読込・名前空間を検証(beta 対象時のみ。実測 PASS)
4. **beta/index.html**: 未保存破棄の confirm(P1-2)+β初回起動の共有ストレージ警告(P1-3)+
   i18n 2キー(confirmDiscard/betaShared)
5. **CHANGELOG.md**: v1.28(未リリース)節
6. 昇格手順の改訂はロードマップ 22e §3(P0-3+Phase C 実機チェックリスト)

## 4. 見送り・持ち越し(開発キューへ)

- localStorage の hp_beta_* 名前空間分離(P1-3 案1)— 破壊的スキーマ実験を始める際に
- sessionStorage 自動ドラフト・beforeunload(P1-2 後半)
- SW 登録失敗の画面表示(P1-1 後半)・QA 結果 JSON への run ID 追加(P2-2 後半)

## 5. Release 判定への影響(ChatGPT §9 基準との対応)

| 基準 | 状態 |
|---|---|
| 1. beta QA が同一SHAで ALL PASS | ✅ CI マトリクス化で毎コミット取得(本コミットで両者 ALL PASS) |
| 2. behavior.saturnExp / zonal.* が CI 成果物に含まれ PASS | ✅ qa-results-beta artifact に含まれる |
| 3. SW が他の名前空間を削除しない | ✅ dfm-beta-* 限定+QA で機械検証 |
| 4. PWA 一式を含む昇格 PR が両CI通過 | 手順化済み(昇格時に実施) |
| 5. iPhone 実機確認 | **残タスク**(4-22/4-27 — Phase C チェックリスト) |
| 6. 未保存破棄・共有ストレージの保護/警告 | ✅ confirm+初回警告を実装 |

→ 機械側の HOLD 要因は解消。**Release の残条件は実機確認と昇格 PR のみ**。

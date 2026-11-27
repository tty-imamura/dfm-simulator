# セキュリティポリシー / Security Policy

## 設計上の前提(サーバレス・外へ送らない)

本アプリは **単一 HTML ファイル・外部依存ゼロ・サーバレス** で動作する。

- **外の AI の事業者を呼ばない(第357便b)**: AI のタブの「アプリの中の生成」(API キーを入れて外の AI の事業者を呼ぶ方式)は
  外した(beta は第357便b から・公開版は v1.48.0 から)。html に外へ送る呼び出しは無く、AI の利用は
  「プロンプトをコピーして AI チャットへ → 返答を貼り付けて取り込む」の道だけ(アプリは外へ何も送らない)。
  以前の版がこの端末に保存したキーと設定(`hp_key`・`hp_key_anthropic`・`hp_key_openai`・`hp_key_gemini`・
  `hp_model`・`hp_model_anthropic`・`hp_model_openai`・`hp_model_gemini`・`hp_provider`・`hp_baseurl_openai` の 10 個)は、
  公開版の道(パスに `/beta/` を含まない配信)で開いたときにアプリが消す(ほかの `hp_*` —— セーブ等 —— には触れない)。
- **(記録 —— 外す前の版)API キー(BYOK)**: ユーザー自身の Claude / OpenAI 互換 / Gemini の API キーを使用する。
  キーは「この端末に保存」ON のとき **ブラウザの localStorage のみ** に保存され
  (OFF のときはメモリのみ・タブを閉じると消える)、**第三者サーバを経由しない**。
  Anthropic へは `anthropic-dangerous-direct-browser-access: true` ヘッダで
  ブラウザから直接呼び出す(決断事項 4-21: BYOK 継続)。
- **収集ゼロ**: 本アプリはアナリティクス・Cookie・外部 CDN・トラッキングを一切使用しない。
  シミュレーションのセーブデータ(hp_*)も localStorage のみに保存される。
- **同一オリジン注意**: GitHub Pages の `…/dfm-simulator/` と `…/dfm-simulator/beta/` は
  同一オリジンのため localStorage(セーブ・設定。外す前の版では API キーも)を共有する。beta で実験する際は
  事前にエクスポートを推奨(README「テスト運用」参照)。

## ユーザーへの推奨

- 外す前の版(公開版 v1.47 まで)でキーを保存していた場合は、念のためプロバイダのコンソールで失効させること
  (新しい版は端末の保存を消すが、キーそのものの失効はプロバイダの側でしかできない)
- (記録 —— 外す前の版)API キーは**支出上限を設定した専用キー**を発行して使用すること
- 共有端末では「この端末に保存」を OFF にすること
- キーが漏えいした可能性がある場合は、プロバイダのコンソールで直ちに失効させること

## 脆弱性の報告 / Reporting a Vulnerability

- **非公開報告(推奨)**: GitHub の **Private vulnerability reporting**
  (リポジトリ Security タブ → "Report a vulnerability")
- 公開されても実害が小さい問題(表示崩れ等)は通常の Issue でも可
- 対象: `index.html`(および `beta/index.html`)の XSS・保存領域の取り扱い(外す前の版ではキー取り扱い)・
  インポート機能(JSON 貼り付け)まわりの入力検証など

対応目安: 報告受領の確認まで 1 週間以内。修正はキー取り扱いに関わるものを最優先とする。

---

*English summary*: This is a single-file, serverless app. Since wave 357b (beta) / v1.48.0 (release)
the app no longer calls any AI provider: the in-app generation with user-supplied API keys was removed,
the html contains no outgoing network call, and AI use goes through copying a prompt into an AI chat
and pasting the reply back. API keys and settings saved by earlier versions (10 fixed localStorage
names) are removed by the app when it is opened on the release path (not under /beta/).
*Record (before the removal)*: User-supplied API keys (BYOK)
are stored only in the browser's localStorage (or memory) and are sent directly to the
provider's API — never to any third-party server. No analytics, no cookies, no CDN.
Please report vulnerabilities via GitHub Private Vulnerability Reporting.

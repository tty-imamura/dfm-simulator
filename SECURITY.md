# セキュリティポリシー / Security Policy

## 設計上の前提(BYOK・サーバレス)

本アプリは **単一 HTML ファイル・外部依存ゼロ・サーバレス** で動作する。

- **API キー(BYOK)**: ユーザー自身の Claude / OpenAI 互換 / Gemini の API キーを使用する。
  キーは「この端末に保存」ON のとき **ブラウザの localStorage のみ** に保存され
  (OFF のときはメモリのみ・タブを閉じると消える)、**第三者サーバを経由しない**。
  Anthropic へは `anthropic-dangerous-direct-browser-access: true` ヘッダで
  ブラウザから直接呼び出す(決断事項 4-21: BYOK 継続)。
- **収集ゼロ**: 本アプリはアナリティクス・Cookie・外部 CDN・トラッキングを一切使用しない。
  シミュレーションのセーブデータ(hp_*)も localStorage のみに保存される。
- **同一オリジン注意**: GitHub Pages の `…/dfm-simulator/` と `…/dfm-simulator/beta/` は
  同一オリジンのため localStorage(セーブ・API キー)を共有する。beta で実験する際は
  事前にエクスポートを推奨(README「テスト運用」参照)。

## ユーザーへの推奨

- API キーは**支出上限を設定した専用キー**を発行して使用すること
- 共有端末では「この端末に保存」を OFF にすること
- キーが漏えいした可能性がある場合は、プロバイダのコンソールで直ちに失効させること

## 脆弱性の報告 / Reporting a Vulnerability

- **非公開報告(推奨)**: GitHub の **Private vulnerability reporting**
  (リポジトリ Security タブ → "Report a vulnerability")
- 公開されても実害が小さい問題(表示崩れ等)は通常の Issue でも可
- 対象: `index.html`(および `beta/index.html`)の XSS・キー取り扱い・
  インポート機能(JSON 貼り付け)まわりの入力検証など

対応目安: 報告受領の確認まで 1 週間以内。修正はキー取り扱いに関わるものを最優先とする。

---

*English summary*: This is a single-file, serverless app. User-supplied API keys (BYOK)
are stored only in the browser's localStorage (or memory) and are sent directly to the
provider's API — never to any third-party server. No analytics, no cookies, no CDN.
Please report vulnerabilities via GitHub Private Vulnerability Reporting.

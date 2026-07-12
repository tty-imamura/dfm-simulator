# 実装指示書: 仮定物理シミュレーションアプリ (index.html)

テンプレート1(設計→実装ハンドオフ)準拠。実装担当 Tier: Sonnet 4.6 相当。
物理式は `docs/PHYSICS.md` の E1〜E10 と既定パラメータ表を正とし、本書では繰り返さない。

## 目的(1段落)

ユーザー提示の仮定物理法則(相対空間・決定力・スピン=熱)を、iPhone の Safari で動く
単一 HTML ファイルのインタラクティブシミュレータとして可視化する。6つの内蔵プリセットと、
Claude API(Haiku 4.5)によるプリセット追加機能を持つ。迷ったら「iPhoneで指1本で触れて、
法則の帰結(整列・平坦回転・熱平衡・光の湾曲・引きずり)が目に見えること」を優先する。

## 成果物

- `index.html` — アプリ本体。**単一ファイル・外部リソース参照ゼロ**(CDN/フォント/画像不可)。
- 変更禁止: `docs/` 配下(実装中に矛盾を見つけた場合は実装を止めて文書改訂を要求する)。

## インターフェース契約

### 1. プリセットJSON(内蔵・LLM生成・共通スキーマ)

```jsonc
{
  "name": "土星の環",            // 必須 string ≤30字
  "emoji": "🪐",                // 任意 string
  "description": "説明…",       // 必須 string ≤200字
  "camera": { "scale": 170 },   // 必須。画面短辺の半分が scale ワールド単位に対応
  "world": { "boundary": "none", "size": 0 },  // 必須。boundary: none|box|circle。size=半幅/半径
  "physics": { /* PHYSICS.md の既定パラメータ表のキー(dt,substeps除く)。部分指定可、既定値にマージ */ },
  "bodies": [ /* 下記ジェネレータの配列。合計粒子数は600にクランプ */ ],
  "rays": { "n": 26, "spread": 0.85 },          // 任意。光線: 左端から n 本、縦に spread×高さへ分散
  "overlays": { "rotationCurve": false, "tempHistogram": false, "field": false }  // 任意
}
```

ジェネレータ4種(**全フィールド必須**。LLM出力も同形):

```jsonc
{ "type":"single", "m":1200, "x":0, "y":0, "vx":0, "vy":0, "spin":0.8, "pinned":false }
{ "type":"ring", "n":340, "cx":0, "cy":0, "rIn":60, "rOut":150,
  "mMin":0.05, "mMax":0.3, "spinMin":0, "spinMax":0,
  "vMode":"kepler",            // kepler|omega|none
  "aroundMass":1200,           // vMode=kepler時の中心質量 (v=√(G·aroundMass/r))
  "omega":0,                   // vMode=omega時: v = omega·r·direction
  "vNoise":0.06,               // 速度に±vNoise比のジッタ
  "direction":1,               // 1|-1 (反時計|時計)
  "pinned":false }             // true: 力を受けず、vMode=omegaなら円軌道レール上を回る
{ "type":"disk", "n":380, "cx":0, "cy":0, "radius":260,
  "mMin":0.5, "mMax":1.2, "spinMin":0, "spinMax":0,
  "vMode":"flat",              // kepler|rigid|flat|random|none
  "aroundMass":600,            // kepler用
  "vScale":1.6,                // kepler:倍率 / rigid:角速度ω / flat:速さ / random:速さ
  "direction":1 }
{ "type":"box", "n":120, "cx":-100, "cy":0, "w":180, "h":360,
  "mMin":1, "mMax":1, "spinMin":2, "spinMax":3, "vScale":2.5 }   // ランダム方向・速さ~vScale
```

### 2. 内蔵プリセット(6種、上記スキーマのJSオブジェクトとして定義)

| id | 主要設定(camera.scale / world / physics上書き / bodies / overlays) |
|---|---|
| saturn 🪐 土星の環 | 170 / none / {muF:0.6, gammaN:0.5, timeScale:4} / single(m1200,spin0.8) + ring(n340, 60..150, kepler around 1200, vNoise0.06) / なし |
| protodisk 🌀 原始惑星系円盤 | 260 / none / {muF:0.7, gammaN:0.6, kappaS:0.1, timeScale:4} / single(m400) + disk(n320, r220, m0.2..1.5, rigid ω=0.006) / なし |
| galaxy 🌌 銀河の回転曲線 | 300 / none / {D0:1, muF:0.1, gammaN:0.1, kRep:0.5, softening:4, timeScale:4} / single(m600, spin1.5) + disk(n380, r260, m0.5..1.2, flat v=1.6) / rotationCurve |
| gas 🔥 気体の熱平衡 | 240 / box size200 / {G:0.05, D0:50, kFrame:0.2, kRep:2, muF:0.8, kappaS:0.15, timeScale:2} / box左(n120, spin0, v0.3) + box右(n120, spin2..3, v2.5) / tempHistogram |
| lensing 💡 重力レンズと時間 | 300 / none / {kLens:0.004, Kt:30, timeScale:1} / single(m1500, pinned, spin0.5) + single(m500, x120, y-90, pinned) + rays(n26, 0.85) / field |
| mach 🪣 マッハのバケツ | 220 / none / {G:0.02, D0:0.5, timeScale:2} / ring(n14, r150, m80, omega0.012, pinned, spin0.5) + disk(n40, r80, m0.5, none) / なし |

数値は初期案。**QA(品質ゲート)で「帰結が目に見える」ことを基準に timeScale・半径・質量の調整可**。
それ以外の仕様変更は不可。

### 3. localStorage キー

| キー | 内容 |
|---|---|
| `hp_key` | Claude APIキー(平文。端末外に出るのは api.anthropic.com への送信のみ) |
| `hp_model` | 実行時モデルID(既定 `claude-haiku-4-5`) |
| `hp_saves` | 保存配列: `[{name, comment, savedAt(ISO), presetId, presetName, physics{...全キー}, cameraScale}]` |
| `hp_custom_presets` | LLM生成プリセット配列(検証済みプリセットJSON + `id:"custom_<epoch>"`) |

### 4. 実行時LLM呼び出し

`docs/HANDOFF_RUNTIME_LLM.md` のシステムプロンプト・スキーマ・段構えロジックを**そのまま**焼き込む。
エンドポイント/ヘッダ契約:

```
POST https://api.anthropic.com/v1/messages
content-type: application/json
x-api-key: <hp_key>
anthropic-version: 2023-06-01
anthropic-dangerous-direct-browser-access: true
```

### 5. デバッグフック(品質ゲートが使用)

`window.HP = { sim, loadPreset(id), presets, running() }` を公開する。
`sim` は `{n, x, y, vx, vy, spin, t}` を参照できること(TypedArray可)。

## 実装手順

1. HTML骨格 + CSS(ダークテーマ、`viewport-fit=cover`、`user-scalable=no`、safe-area対応、
   ボタン最小44px、`touch-action:none` はcanvasのみ)。レイアウト: ヘッダ(タイトル+プリセット
   `<select>`)/ canvas(伸縮)/ トランスポートバー(⏮ 初めから・▶/⏸ 実行停止再開・速度select)/
   タブバー(説明・パラメータ・セーブ・AI)+ パネル(max-height 42vh、スクロール)。
2. 物理エンジン: SoA(Float32Array)で m,x,y,vx,vy,spin,R,I,pinned,rail{cx,cy,r,ang,omega},
   uPrevX,uPrevY,tau。ステップ関数は PHYSICS.md §5 数値スキーマの順序どおり。
3. プリセットローダ: スキーマ→粒子生成(乱数は mulberry32、`seed` はリセット毎に固定し直す)。
4. 描画: 背景微星、粒子(色=|スピン|正規化: 青→白→橙→赤、半径=R・表示は30px上限+大天体グロー)、pinnedは輪郭付き、
   トレイル(オフ可)、fieldオーバーレイ(48×48グリッドのW値を淡色で、5フレーム毎更新)、
   光線(白→黄のポリライン、毎フレームE8を左端から再積分、ステップ長=scale/120、320step上限)、
   rotationCurve(右下 140×90px: 半径10ビンの平均接線速度の折れ線+ケプラー参照曲線)、
   tempHistogram(右下: 左半分/右半分の平均温度バー+時系列)、
   選択粒子の固有時計(タップで選択、τ/tの円グラフ)。ヘッダ下に t・N・fps 表示。
5. カメラ: 1本指ドラッグ=パン、2本指ピンチ=ズーム(タッチイベント、preventDefault)。
   マウス(ドラッグ+ホイール)も対応。
6. パラメータタブ: PHYSICS.md の表の全キー+timeScale をスライダ+数値表示で。変更は**即時**
   `sim.params` に反映(再スタート不要)。「粒子の初期配置(bodies・N)はプリセット選択/⏮で反映」
   の注記。既定値に戻すボタン。
7. セーブタブ: 名前+コメント入力→保存で `hp_saves` へ。一覧(名前・コメント・日時・元プリセット)
   に 読込(=physicsを適用し該当プリセットを⏮)・削除。全体をJSONでエクスポート(クリップボード)
   /インポート(textarea貼り付け)。
8. AIタブ: APIキー入力(type=password、保存ボタン、「キーはこの端末のlocalStorageにのみ保存」
   注記)、モデル選択(haiku既定/sonnet)、要望textarea、生成ボタン(生成中はスピナー+無効化)、
   結果メッセージ領域。成功→ hp_custom_presets へ追加、プリセットselectに「🤖名前」で追加し
   即ロード。カスタムプリセットの削除ボタン。
9. NaNガード: 毎フレーム先頭粒子群の座標をチェックし、NaN検出で自動停止+「数値が発散しました。
   パラメータを見直すか⏮してください」表示。
10. 説明タブ: 各プリセットの見どころ+操作方法+法則の要約(PHYSICS.mdの短縮版)を静的表示。

## エッジケースと対応(表)

| 入力/状況 | 期待動作 |
|---|---|
| APIキー未設定で生成ボタン | 「APIキーを設定してください」表示、リクエストしない |
| APIキー不正(401) | 「APIキーが無効です」表示 |
| 429 / 529 | 「混雑しています。しばらく待って再試行してください」 |
| オフライン/fetch例外 | 「ネットワークに接続できません」 |
| stop_reason≠"end_turn"(refusal/max_tokens) | 「生成に失敗しました(理由)」表示、登録しない |
| LLM出力がスキーマ検証NG | 失敗理由を添えて同モデルに1回だけ再試行→なお失敗なら Sonnet 5 へ→なお失敗ならエラー表示 |
| 粒子合計 >600 | 600に比例縮小(先頭ジェネレータ優先)し、その旨を表示 |
| 数値が範囲外 | バリデータがクランプ(範囲は HANDOFF_RUNTIME_LLM.md の表) |
| 保存名が空 | 「無題」+日時で保存 |
| localStorage書込例外(容量) | 「保存できませんでした(容量)」alert |
| インポートJSONが不正 | 「読み込めませんでした」表示、既存データ無変更 |
| 画面回転/リサイズ | canvasをdevicePixelRatio込みで再設定、描画継続 |
| ⏸中のパラメータ変更 | 反映され、▶で継続 |
| ⏮ | 現在のphysicsパラメータを**保持したまま**粒子を初期配置し直し、t=0、停止状態にする |
| bodies空のプリセット | 空宇宙を表示(エラーにしない) |

## 使用技術の制約

- Vanilla JS (ES2020)、ライブラリ・ビルド・CDN一切禁止。`<script>` 1ブロック。
- フォントはシステムフォント。絵文字はUnicodeのまま使用可。
- LLM/ユーザー由来の文字列は **textContent でのみ** DOMに入れる(innerHTML禁止)。
- コメントは日本語で、セクション見出し(`// ===== 物理エンジン =====` 等)を付ける。

## 正例・負例

```js
// ✅ 正例: LLM由来文字列の表示
li.querySelector('.name').textContent = preset.name;
// ❌ 負例: XSS経路になる
li.innerHTML = `<b>${preset.name}</b>`;

// ✅ 正例: E4 ソフトニング付き重力(対称なので j>i で半分だけ回す)
const d2 = dx*dx + dy*dy + eps2, inv = 1/(d2*Math.sqrt(d2));
// ❌ 負例: 距離0で発散 / 全対を2回計算
```

## 受け入れ条件(全て検証可能な形で)

- [ ] `<script>` 抽出後 `node --check` がエラー0
- [ ] headless Chromium(390×844)で6プリセット全てをロードし、各120フレーム進めて
      console error 0件・粒子座標にNaNなし(`window.HP` で検査)
- [ ] ▶→⏸→▶→⏮ の操作列が動作(⏮後 t=0・停止)
- [ ] パラメータスライダ変更が `HP.sim.params` に即反映
- [ ] 保存→リロード→読込 で physics が復元される
- [ ] AIタブ: キー未設定時にエラーメッセージ表示(実API呼び出しはQA対象外、バリデータは
      few-shot例4件が全て検証合格・壊した例が不合格になることを node で確認)
- [ ] 横スクロールが発生しない(document.scrollingElement.scrollWidth ≤ innerWidth)

## 禁止事項

- api.anthropic.com 以外への通信。外部へのAPIキー送信・埋め込みアナリティクス。
- LLM出力の eval / Function 化(JSONとしてのみ解釈)。
- docs/ の仕様と異なる式・スキーマの発明(発見した矛盾は文書改訂として報告)。
- プリセット調整の名目で physics の式(E1〜E10)自体を変えること。

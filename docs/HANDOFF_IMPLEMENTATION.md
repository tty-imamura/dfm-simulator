# 実装指示書: 仮定物理シミュレーションアプリ (index.html)

テンプレート1(設計→実装ハンドオフ)準拠。実装担当 Tier: Sonnet 4.6 相当。
物理式は `docs/PHYSICS.md` の E1〜E10 と既定パラメータ表を正とし、本書では繰り返さない。
**v1.1(2026-07-15)**: 物理改訂(A11/A12/A13、E5′/E6′/E8′/E9/E10′/E11)の実装差分は
**付録B** を正とする(DERIVATIONS.md §7 の添付・詳細化)。

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
| saturn 🪐 土星の環 | 170 / none / {muF:0.6, gammaN:0.5, timeScale:4} / single(m1200,spin0.04) + ring(n340, 60..150, kepler around 1200, vNoise0.06) / なし |
| protodisk 🌀 原始惑星系円盤 | 260 / none / {muF:0.5, gammaN:0.6, kappaS:0.1, kRep:0.5, timeScale:4} / single(m400) + disk(n320, r220, m0.2..1.5, kepler around 400 ×0.75) / なし |
| galaxy 🌌 銀河の回転曲線 | 300 / none / {D0:1, muF:0.1, gammaN:0.1, kRep:0.5, softening:4, timeScale:4} / single(m600, spin0.05) + disk(n380, r260, m0.5..1.2, flat v=1.6) / rotationCurve |

> **改訂 2026-07-13(安定初期値)**: 大質量天体のスピンは「表面速度 s·R が軌道速度と同程度以下」
> になるよう選ぶこと(例: m=1200, R≈42 なら s≦0.05 程度)。大きなスピンはスピン引きずり(E2/E3)
> により周囲の軌道速度を超える回転流を作り、系全体を吹き飛ばす。
> 原始円盤は「弱い回転の剛体雲」ではなく「サブケプラー円盤(kepler×0.75)」で開始する方が
> 穏やかに収縮し、蒸発しない。
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
   ring/disk/box の位置サンプリングは、既に置かれた大質量天体(m≥40)の内部を避けて
   リトライする(最大30回)。深い初期重なりは接触ばねの持続的な押し出しを生み不安定の原因になる。
4. 描画: 背景微星、粒子(色=|スピン|正規化: 青→白→橙→赤、半径=R・表示は30px上限+大天体グロー)、pinnedは輪郭付き、
   トレイル(オフ可)、fieldオーバーレイ(48×48グリッドのW値を淡色で、5フレーム毎更新)、
   光線(白→黄のポリライン、毎フレームE8を左端から再積分、ステップ長=scale/120、320step上限)、
   rotationCurve(右下 140×90px: 半径10ビンの平均接線速度の折れ線+ケプラー参照曲線)、
   tempHistogram(右下: 左半分/右半分の平均温度バー+時系列)、
   選択粒子の固有時計(タップで選択、τ/tの円グラフ)。ヘッダ下に t・N・fps 表示。
5. カメラ: 1本指ドラッグ=パン、2本指ピンチ=ズーム(タッチイベント、preventDefault)。
   マウス(ドラッグ+ホイール)も対応。
6. パラメータタブ: PHYSICS.md の表の全キー+timeScale を
   **スライダ+直値入力欄**の2系統で編集できるようにする。変更は**即時** `sim.params` に反映
   (再スタート不要)。
   - 桁をまたぐ量(G・D₀・Kt・kLens・timeScale)は**対数スライダー**(内部0..1000の指数マップ)、
     それ以外は微調整しやすい細かいステップの線形スライダー。
   - 直値入力欄はスライダー範囲外の値(0を含む)も受け付け、バリデータの値域(CLAMPS)でクランプ。
     不正入力は元の値に戻す。inputmode="decimal"。
   - 「粒子の初期配置(bodies・N)はプリセット選択/⏮で反映」の注記。既定値に戻すボタン。
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
| 直値入力が範囲外/不正 | CLAMPSでクランプ / 不正文字列は元の値へ戻す |
| ジェネレータ位置が大質量天体の内部 | 生成時にリサンプリングで回避(最大30回) |
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

---

## 付録B: v1.1 物理改訂の実装差分(DERIVATIONS.md §7 の添付)

対象ファイルは `index.html` のみ。式の正は PHYSICS.md v1.1(E5′/E6′/E8′/E9/E10′/E11)。
以下は実装上の確定事項であり、判断の余地を残さない。

### B1. パラメータ追加(4件)

`DEFAULT_PHYSICS` / `CLAMPS` / `PARAM_DEFS` に追加する:

| キー | 既定 | CLAMPS | スライダー | グループ |
|---|---|---|---|---|
| cLight | 60 | [1, 10000] | log, lo:5, hi:1000 | 法則 |
| bM | 1.0 | [0.001, 1000] | log, lo:0.01, hi:100 | 法則 |
| etaRad | 0 | [0, 1] | log, lo:1e-6, hi:0.1(0 は直値入力で設定) | 法則 |
| pRad | 4 | [1, 6] | lin, lo:1, hi:6, step:0.5 | 法則 |

実行時LLMプロンプト(SYSTEM_PROMPT)と HANDOFF_RUNTIME_LLM.md は**意図的に変更しない**。
LLM が新キーを出力しなくてもバリデータの既定値マージで補完されるため、few-shot 4例は
そのまま有効。LLM 出力に新キーが含まれた場合は CLAMPS の値域でクランプされる。

### B2. エンジン改修(sim.step の4フェーズ化)

PHYSICS.md v1.1 §5「数値スキーム」の順序どおり。実装の要点:

1. **対距離キャッシュ**: 全対ループで計算した d_ij を `S.pairD`(Float32Array、長さ
   n(n−1)/2、インデックス `i*n - i*(i+1)/2 + (j-i-1)`)に保存し、反作用対ループで再利用
   (sqrt の二重計算を避ける)。alloc 時に確保。
2. **E5′**: `f = kRep * muIJ * (omI*omI + omJ*omJ)`、`a_i += f/m_i * (dx,dy)`、
   `a_j -= f/m_j * (dx,dy)`。omI/omJ は E2 の ω_i(d), ω_j(d)(既存計算を流用)。
3. **E9 摩擦(符号・作用線の改訂)**: 実効腕 `Li = Ri*d/(Ri+Rj)`, `Lj = Rj*d/(Ri+Rj)`。
   `vs = (v_i−v_j)·t̂ − spin_i*Li − spin_j*Lj`、`jt = (muF/3) * mu * vs`
   (mu は換算質量。pinned 側は invM=0 として K=invMi+invMj で計算し、jt = muF*vs/(3K))。
   適用: `v_i −= jt*invMi*t̂; v_j += jt*invMj*t̂; spin_i += Li*jt/I_i; spin_j += Lj*jt/I_j`
   (pinned はスピン変更なし)。旧実装は vs の符号と Δs の符号が PHYSICS.md と不一致で、
   L を系統的に破っていた(修正後は V1 が合格する)。
4. **法線減衰の放射帳簿**: 減衰インパルス適用前後の並進運動エネルギー差を `S.radE` に加算。
5. **E10′**: 拡散重みを `I_j/(I_i+I_j)` に変更。共通係数
   `c = kappaS*(s_j−s_i)*gg/(I_i+I_j)` を作り `ds_i += c*I_j; ds_j −= c*I_i`
   (この形なら I_i·Δs_i = −I_j·Δs_j が浮動小数点でも厳密)。
6. **E6′ 反作用**: 粒子ループで Δp_i = m_i·kFrame·Δu(クランプ後)を `S.dpx/S.dpy` に保存。
   位置更新はまだしない。反作用対ループで各対 (i,j) につき双方向に:
   `phi = (m_j/(pairD+eps)) / (D0 + sumW_i)`; j が非pinned なら
   `v_j −= phi*dp_i/m_j` とし、残余トルク `n = dx*(phi*dpy_i) − dy*(phi*dpx_i)` を
   `spin_i −= n/(I_i+I_j); spin_j −= n/(I_i+I_j)` として移譲。j が pinned なら
   運動量 −phi*dp_i とトルク [r_i×phi*dp_i]_z をリザーバへ
   (`resPx −= phi*dpx_i` 等、`resL −= x_i*phi*dpy_i − y_i*phi*dpx_i`)。
   背景分 `phiBg = D0/(D0+sumW_i)` も同じ式でリザーバへ。最後の粒子ループで位置・境界・τ 更新。
7. **E11 冷却**: etaRad>0 かつ s≠0 のとき `T = I*s*s; lam = etaRad*T^pRad;
   dsC = lam*dt/(I*|s|)` を `min(dsC, 0.5*|s|)` にクランプして |s| を減らす。
   `radE += ½I(s_before²−s_after²); radL += I*(s_before−s_after)`。

帳簿変数は `S.resPx, S.resPy, S.resL, S.radE, S.radL`(build でゼロ初期化)。
検証恒等式: P+resP 一定、L+resL+radL 一定(D₀=0・pinnedなし・境界なしなら resP=resL=0)。

### B3. E8′ 光線の媒質随伴

光線積分を共有関数 `traceRay(S, x0, y0, cx0, cy0, maxSteps, dl, emit)` に括り出し、
描画(drawRays)と検証(V8)の双方から使う。1ステップ:
- 重い天体(m ≥ RAY_MASS_MIN)のみで n, ∇n, **u** を評価(既存の性能近似を維持)。
  **u** は E3 と同形: `u = Σ w_j(v_j + ω_j ẑ×(r−r_j)) / (D0 + Σ w_j)`、ω_j は E2。
- 方向更新は従来どおり(フェルマー則)、位置更新を `r += ĉ·dl + u·(n/cLight)·dl` に変更。

### B4. 表示の改修

- **色マップのキー**: `T_i = ½·m_i·R_i²·s_i²`(= I s²)。正規化は全粒子 T の
  **90パーセンタイル**(EMA 平滑、係数 0.05)とし、`t = min(1, √(T/p90))` を
  既存 tempColor に渡す(単一の大質量天体がスケールを飽和させないため。
  パレット自体は変更しない)。
- **温度ヒストグラム**: T の定義を同じ I s² に変更、ラベルを「平均温度(Is²)左/右」に。
- **選択粒子の情報行**: `T=… λ=…`(λ = bM/T、T=0 のときは「λ=—」)を追記。
- **保存量モニタ**: 表示グループに「保存量モニタ」トグル(既定オフ)を追加。
  オンのとき HUD 2行目に `P=(Px,Py) L=… | 帳簿 P=(…) L=… 放射E=…` を15フレーム毎に更新表示。
  P・L は B2 の恒等式の左辺(粒子系のみ)、帳簿はリザーバ変数を表示する。

### B5. 検証フック(HP.verify)と受け入れ条件の追加

`window.HP.verify = { v1(), v2(), v8(), all() }` を実装する。各関数は
`{id, pass:boolean, detail:string, value:number}` を返す(all は配列)。UI には出さない。

- **v1(T7 保存則)**: makeSim で独立に組み立てる。physics: D₀=0, kFrame=1, G=1, kRep=1,
  muF=0.5, gammaN=0.4, kappaS=0.05, etaRad=0, softening=2, boundary none。
  粒子: 疑似乱数(seed 固定)で disk 状に 48 個(m 0.5〜2, |v|≤1.2, spin −2〜2)+
  m=30 の単体1個。1000 ステップ(dt=0.016)実行し、
  `|ΔP|/P_scale < 1e-3` かつ `|ΔL|/L_scale < 1e-3` で合格。
  スケール: P_scale = Σ m|v|(初期)、L_scale = Σ|m(r×v)| + Σ I|s|(初期)。
- **v2(D1 分光温度計)**: 検証粒子(m=2, R=radiusScale√2, s=1.7)につき
  T = Is²、λ = bM/T を計算し、`s' = √(bM/(I·λ))` で逆算。相対誤差 < 5% で合格
  (色マップと HUD が同じ T 定義を共有していることの配線検査を兼ねる)。
- **v8(T8 非対称レンズ)**: 中央に pinned 単体(m=1500)を置き、spin = +0.5 と −0.5 の
  2 ケースで、y = ±60 の対称な平行光線を traceRay で 320 ステップ積分。
  各ケースの上下光線の湾曲角差 Δθ(spin) を測り、`sign(Δθ(+)) ≠ sign(Δθ(−))` かつ
  `|Δθ| > 1e-4 rad` で合格(kLens=0.004, cLight=60)。
- **V3〜V7(銀河 r_flat・環の方向選択・𝒟効果・歳差・軌道移動)は長時間実行を要するため
  自動テスト列に含めない。** DERIVATIONS.md §6 の手順どおり手動実験として実施し、
  結果は THEORY SYNTHESIS / DERIVATIONS 側に記録する(実装フェーズの受け入れ条件外)。

受け入れ条件(既存リストに追加):
- [ ] `HP.verify.all()` で v1, v2, v8 が全て pass
- [ ] 既存6プリセットが v1.1 エンジンでも 120 フレーム console error 0・NaN なし
- [ ] etaRad=0(既定)のとき、v1.0 と比べてデモの見た目の破綻がない(目視)

### B6. 禁止事項(付録B 固有)

- 実行時LLMプロンプト・few-shot・HANDOFF_RUNTIME_LLM.md の変更(B1 の方針どおり不要)。
- tempColor のパレット変更(キーの変更のみ)。
- 旧 E5/E6/E10 の式を kFrame 等のフラグで残すこと(改訂式へ完全置換する。
  ニュートン退化は従来どおり kFrame=0 で得られる)。

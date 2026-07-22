# 実行時プロンプト仕様: LLMプリセット生成

テンプレート2(実装→実行時プロンプト)準拠。この文書の内容は `index.html` に**そのまま**焼き込む。
**v1.7 改訂(2026-07-16)**: kLens 廃止(E8R: 屈折は Kt に統一)に伴い、物理要約・ルール2/7・
few-shot 4例・参考スキーマから kLens を削除。BH例は kLens=0.01 ↔ Kt=200 の等価換算。
旧AIプリセットの kLens はバリデータが受理して無視する(CLAMPS 残置)。few-shot 4例の
validatePreset 合格(警告なし)を機械検証済み(MODEL_ROUTING.md v1.7)。

**v1.10 改訂(2026-07-16)— プロバイダ抽象化と言語対応**:
1. 呼び出し先を3プロバイダに拡張(`callLLM`): **Anthropic**(既定・本書のリクエスト形状)/
   **OpenAI互換**(`{baseUrl}/chat/completions`、system は messages 先頭の system ロール。
   baseUrl は UI から変更可 — ローカルLLM等の互換サーバにも接続可)/
   **Gemini**(`v1beta/models/{model}:generateContent`、system は `systemInstruction`、
   ヘッダ `x-goog-api-key`)。モデルIDは UI の自由入力(datalist で候補提示:
   anthropic=claude-haiku-4-5/claude-sonnet-5/claude-opus-4-8、openai=gpt-5-mini/gpt-5/gpt-4.1-mini、
   gemini=gemini-2.5-flash/gemini-2.5-pro)。
2. 段構えのフォールバック連鎖(haiku→sonnet-5、sonnet→opus-4-8)は **Anthropic のみ**
   (他プロバイダのモデル階層はアプリが仮定しない)。検証→失敗理由付きリトライ1回は全プロバイダ共通。
3. SYSTEM_PROMPT 本体は不変。UI言語が英語のときのみ `getSystemPrompt()` が
   「name/description を英語で書く」上書き節を末尾に付加する(few-shot は形式見本として共通)。
4. APIキーはプロバイダ別に管理。**既定は端末に保存せずメモリのみ**(明示チェックで
   localStorage 保存にオプトイン。第5次レビュー裁定 #13 — DERIVATIONS §14)。
   旧 hp_key/hp_model は hp_key_anthropic/hp_model_anthropic へ自動移行(保存状態は維持)。

## 呼び出しコンテキスト

- モデル: `claude-haiku-4-5`(既定)/ フォールバック `claude-sonnet-5`(`thinking:{"type":"disabled"}` を付与)
- 頻度: 1ユーザー操作あたり1〜3回(検証リトライ・フォールバック込み)。想定月間 ≈ 20回。
- レイテンシ要件: 10秒以内(UIはスピナー表示、体感許容)
- max_tokens: **4000** — 最大想定プリセット ≈ 1.2Kトークン + 余裕。コスト上限も兼ねる。
- プロンプトキャッシュ: **不使用**(散発呼び出し + Haiku 4.5 の最小キャッシュ4096トークン未満のため。
  MODEL_ROUTING.md 参照)

## リクエスト形状

```jsonc
POST https://api.anthropic.com/v1/messages
headers: { "content-type":"application/json", "x-api-key":<key>,
           "anthropic-version":"2023-06-01",
           "anthropic-dangerous-direct-browser-access":"true" }
body: {
  "model": "claude-haiku-4-5",
  "max_tokens": 4000,
  "system": SYSTEM_PROMPT,               // 下記確定版
  "messages": [{ "role":"user", "content": ユーザー要望テキスト }]
}
// フォールバック時のみ "thinking": {"type":"disabled"} を追加(Sonnet 5 は省略時アダプティブ思考が既定のため)
```

> **改訂 2026-07-13: 構造化出力(output_config.format)は使わない。**
> 本スキーマを渡すと実機で `400 The compiled grammar is too large` となった
> (bodiesのanyOf 4種×全フィールド必須が文法コンパイル上限を超える)。
> JSON形式の担保は「few-shot + 応答からの **JSON抽出**(最初の `{` 〜最後の `}` を切り出し、
> 前置き文・コードフェンスを除去)+ アプリ内バリデータ + リトライ/フォールバック」で行う。
> スキーマを縮小して再導入する場合も、必ず実機Haikuで400が出ないことを確認してから。
```jsonc
// (参考) 撤去前のリクエストには output_config.format(json_schema)が入っていた
```

## システムプロンプト(確定版)

v1.11(2026-07-16)改訂: ①pinned熱浴・放射冷却・光子捕捉レシピ(スピン0〜0.5の条件込み)・
overlays説明を物理要約に追加 ②既定値・値域に cLight/bM/etaRad/pRad を追加 ③熱ガスの
軽量化注意(自己重力凍結の回避)をルール5に追加 ④few-shotを5例に(例3=ブラックホール
光子捕捉〔m2000+Kt40+spin0.5、8本中7本が半径38の円軌道に巻き付くことを機械検証〕、
例5=床加熱・天井冷却の対流〔熱浴の型見本〕)。**正本は index.html の SYSTEM_PROMPT**。
以下は同一内容の写し:

```
あなたは「仮想物理シミュレータ」のプリセット生成器です。ユーザーの要望を読み、下記仕様のシミュレーション設定をJSONで1つだけ出力します。

# シミュレータの物理(要約)
- 2次元。粒子は質量m・位置(x,y)・速度・スピンs(符号付き角速度=熱)を持つ。
- 重力: ニュートン的引力(強さG)。円軌道速度は v=√(G×中心質量÷半径)。
- スピンは熱。高スピン粒子は近接時に斥力(圧力, kRep)を生む。衝突で速度が減衰しスピンに変わる(muF,gammaN)。スピンは近接拡散で平衡化する(kappaS)。粒子の色は温度(青=冷,赤=熱)。
- pinned:true の粒子は動かずスピンも変わらない=熱浴になる。高スピンのpinned粒子はヒーター、スピン0のpinned粒子は冷却板として、接触摩擦とスピン拡散(kappaS)で周囲を加熱/冷却する。
- 放射冷却: etaRad>0 にすると温度の高い粒子ほど速く冷えて暗くなる(急峻さはpRad)。加熱・冷却・重力を組み合わせると対流・蒸発・凝集が作れる。
- 空間は質量に引きずられる(kFrame: 0=通常のニュートン力学, 1=完全な相対空間)。背景決定力D0が大きいほど空間が安定する。
- rays を指定すると左端から光線が飛び、質量の近くで曲がる(曲がりの強さと時間の遅れは同じKtで決まり、Ktが小さいほど強い)。超大質量(2000〜3000)をpinnedで置きKtを40〜60に下げると、近くを通る光が捕まって周回する=ブラックホールの光学類似(光子捕捉)。ただし中心のスピンは0〜0.5に抑える(スピンが大きいと空間の引きずりが光を外へ流し、捕捉が消える)。
- overlays: rotationCurve=回転曲線グラフ, tempHistogram=左右の平均温度グラフ, field=決定力マップ(レンズ系で推奨), spectrum=放射スペクトル。
- 原点は画面中央。camera.scale は画面短辺の半分に相当するワールド長。

# 出力ルール
1. スキーマに完全準拠したJSONのみを出力する。説明文やコードフェンスは書かない。
2. physicsは全キーを必ず含める。変更不要なキーは既定値を書く。既定値: G=1, D0=2, kFrame=1, q=2, kRep=1, muF=0.5, gammaN=0.4, kappaS=0.05, Kt=60, cLight=60, bM=1, etaRad=0, pRad=4, radiusScale=1.2, softening=2, timeScale=1
3. 粒子総数は最大600。滑らかに動かすため通常は120〜400にする。
4. 軌道系を作るとき: 中心に single(質量M)を置き、ring/disk は vMode="kepler", aroundMass=M にする。保存則(運動量・角運動量)を見せたい閉鎖系では中心を pinned:false にする。周回物の反作用で中心が漂って構図が崩れるのを防ぎたい展示系では pinned:true でよいが、その場合は「中心は固定(外部拘束)」と description に書く。
5. 粒子をばら撒くだけの系(気体など)は world.boundary を "box" か "circle" にし、D0を20以上にすると安定する。重力を弱くするなら G=0.05 程度。加熱・冷却するガスの系では粒子を軽く(mMin/mMax 0.05〜0.1)しkRepを2前後にする — 重いガスは自己重力で1塊に凍結する。
6. name は30字以内、description は200字以内の日本語。emoji は絵文字1文字。
7. 値域(超えると自動修正される): G:0〜100, D0:0〜1000, kFrame:0〜1, q:0.5〜4, kRep:0〜20, muF:0〜1, gammaN:0〜1, kappaS:0〜2, Kt:1〜10000, cLight:1〜10000, bM:0.001〜1000, etaRad:0〜1, pRad:1〜6, radiusScale:0.2〜5, softening:0.5〜20, timeScale:0.1〜16, camera.scale:20〜3000, 座標・長さ:±5000, 質量:0.01〜5000, 速度成分:±50, スピン:±20, omega:±2, vNoise:0〜1, vScale:0〜50, rays.n:0〜64

# ジェネレータ(bodiesの要素。typeごとに全フィールド必須)
- single: {type,m,x,y,vx,vy,spin,pinned} — 粒子1個。pinned:true で力を受けず固定。
- ring: {type,n,cx,cy,rIn,rOut,mMin,mMax,spinMin,spinMax,vMode,aroundMass,omega,vNoise,direction,pinned} — 半径rIn〜rOutの環にn個。vMode: "kepler"(aroundMassの周りを公転)|"omega"(v=omega×r)|"none"。direction: 1=反時計,-1=時計。
- disk: {type,n,cx,cy,radius,mMin,mMax,spinMin,spinMax,vMode,aroundMass,vScale,direction} — 半径radiusの円盤にn個。vMode: "kepler"(vScaleは倍率,通常1)|"rigid"(vScale=角速度)|"flat"(vScale=一定速さ)|"random"(vScale=速さ)|"none"。
- box: {type,n,cx,cy,w,h,mMin,mMax,spinMin,spinMax,vScale} — 幅w高さhの矩形にn個、ランダム方向に速さ〜vScale。

# 例
例1 要望「連星と、その周りを回る惑星たち」
{"name":"連星系の惑星たち","emoji":"⭐","description":"2つの恒星が共通重心を回り、その外側を小さな惑星たちが公転する。連星の複雑な重力場で軌道が乱される様子が見どころ。","camera":{"scale":320},"world":{"boundary":"none","size":0},"physics":{"G":1,"D0":2,"kFrame":1,"q":2,"kRep":1,"muF":0.5,"gammaN":0.4,"kappaS":0.05,"Kt":60,"cLight":60,"bM":1,"etaRad":0,"pRad":4,"radiusScale":1.2,"softening":2,"timeScale":4},"bodies":[{"type":"single","m":500,"x":-60,"y":0,"vx":0,"vy":-1.44,"spin":0.5,"pinned":false},{"type":"single","m":500,"x":60,"y":0,"vx":0,"vy":1.44,"spin":0.5,"pinned":false},{"type":"ring","n":220,"cx":0,"cy":0,"rIn":180,"rOut":290,"mMin":0.05,"mMax":0.3,"spinMin":0,"spinMax":0,"vMode":"kepler","aroundMass":1000,"omega":0,"vNoise":0.05,"direction":1,"pinned":false}],"overlays":{"rotationCurve":false,"tempHistogram":false,"field":false}}
(連星の公転速度: 半径60・相手質量500 → v≈√(1×500÷(60×2))≈1.44 を互いに逆向きに与える)

例2 要望「熱いガスと冷たいガスが混ざるところ」
{"name":"高温ガスと低温ガスの混合","emoji":"🔥","description":"箱の左に低温(低スピン)、右に高温(高スピン)のガスを配置。衝突とスピン拡散で温度が均一化し、熱平衡に達する過程を観察できる。","camera":{"scale":240},"world":{"boundary":"box","size":200},"physics":{"G":0.05,"D0":50,"kFrame":0.2,"q":2,"kRep":2,"muF":0.8,"gammaN":0.3,"kappaS":0.15,"Kt":60,"cLight":60,"bM":1,"etaRad":0,"pRad":4,"radiusScale":1.2,"softening":2,"timeScale":2},"bodies":[{"type":"box","n":120,"cx":-100,"cy":0,"w":180,"h":360,"mMin":1,"mMax":1,"spinMin":0,"spinMax":0.2,"vScale":0.3},{"type":"box","n":120,"cx":100,"cy":0,"w":180,"h":360,"mMin":1,"mMax":1,"spinMin":2,"spinMax":3,"vScale":2.5}],"overlays":{"rotationCurve":false,"tempHistogram":true,"field":false}}

例3 要望「ブラックホールが見たい。光が吸い込まれるところも。星も1000個ちりばめて」
{"name":"ブラックホール — 光子捕捉","emoji":"🕳️","description":"中央の超大質量天体(ブラックホールの光学類似)。左からの光線が強く曲がり、近くを通る光は捕まって光子球のような円軌道に巻き付く(光子捕捉)。周囲の星は数を400に抑えて軽快に動かす。決定力マップ表示付き。","camera":{"scale":300},"world":{"boundary":"none","size":0},"physics":{"G":1,"D0":2,"kFrame":1,"q":2,"kRep":1,"muF":0.5,"gammaN":0.4,"kappaS":0.05,"Kt":40,"cLight":60,"bM":1,"etaRad":0,"pRad":4,"radiusScale":1.2,"softening":2,"timeScale":1},"bodies":[{"type":"single","m":2000,"x":0,"y":0,"vx":0,"vy":0,"spin":0.5,"pinned":true},{"type":"disk","n":400,"cx":0,"cy":0,"radius":280,"mMin":0.05,"mMax":0.2,"spinMin":0,"spinMax":0,"vMode":"kepler","aroundMass":2000,"vScale":1,"direction":1}],"rays":{"n":32,"spread":0.7},"overlays":{"rotationCurve":false,"tempHistogram":false,"field":true}}
(質量2000+Kt=40+スピン0.5で光子捕捉が起きる=機械検証済み。要望の1000個は上限・性能の推奨に合わせて400に調整し、descriptionでその旨に触れている)

例4 要望「回る空間に引きずられるのを見たい」
{"name":"回転リングの空間引きずり","emoji":"🌀","description":"重いリングが回転すると内側の空間ごと引きずられ、静止していた粒子が回り始める(マッハの原理)。D0を上げると引きずりが弱まるのも試せる。","camera":{"scale":220},"world":{"boundary":"none","size":0},"physics":{"G":0.02,"D0":0.5,"kFrame":1,"q":2,"kRep":1,"muF":0.5,"gammaN":0.4,"kappaS":0.05,"Kt":60,"cLight":60,"bM":1,"etaRad":0,"pRad":4,"radiusScale":1.2,"softening":2,"timeScale":2},"bodies":[{"type":"ring","n":14,"cx":0,"cy":0,"rIn":150,"rOut":150,"mMin":80,"mMax":80,"spinMin":0.5,"spinMax":0.5,"vMode":"omega","aroundMass":0,"omega":0.012,"vNoise":0,"direction":1,"pinned":true},{"type":"disk","n":40,"cx":0,"cy":0,"radius":80,"mMin":0.5,"mMax":0.5,"spinMin":0,"spinMax":0,"vMode":"none","aroundMass":0,"vScale":0,"direction":1}],"overlays":{"rotationCurve":false,"tempHistogram":false,"field":false}}

例5 要望「床で温めて天井で冷やす対流実験」
{"name":"対流セル — 床加熱・天井冷却","emoji":"♨️","description":"床の左〜中央がヒーター(固定・高スピン)、天井の右側が疎な冷却板(固定・スピン0)。温められたガスはスピン斥力で膨らんで浮かび、天井で熱を渡して右から沈む一方向の対流セル。ガスは軽い粒子にして自己重力の凍結を防ぐ。左右の平均温度グラフ付き。","camera":{"scale":240},"world":{"boundary":"box","size":190},"physics":{"G":3.9,"D0":40,"kFrame":0.2,"q":2,"kRep":2,"muF":0.3,"gammaN":0.2,"kappaS":0.8,"Kt":60,"cLight":60,"bM":1,"etaRad":0.00001,"pRad":2,"radiusScale":4,"softening":4,"timeScale":2},"bodies":[{"type":"single","m":5000,"x":0,"y":900,"vx":0,"vy":0,"spin":0,"pinned":true},{"type":"single","m":1,"x":-170,"y":186,"vx":0,"vy":0,"spin":10,"pinned":true},{"type":"single","m":1,"x":-150,"y":186,"vx":0,"vy":0,"spin":10,"pinned":true},{"type":"single","m":1,"x":-130,"y":186,"vx":0,"vy":0,"spin":10,"pinned":true},{"type":"single","m":1,"x":-110,"y":186,"vx":0,"vy":0,"spin":10,"pinned":true},{"type":"single","m":1,"x":-90,"y":186,"vx":0,"vy":0,"spin":10,"pinned":true},{"type":"single","m":1,"x":-70,"y":186,"vx":0,"vy":0,"spin":10,"pinned":true},{"type":"single","m":1,"x":-50,"y":186,"vx":0,"vy":0,"spin":10,"pinned":true},{"type":"single","m":1,"x":-30,"y":186,"vx":0,"vy":0,"spin":10,"pinned":true},{"type":"single","m":1,"x":-10,"y":186,"vx":0,"vy":0,"spin":10,"pinned":true},{"type":"single","m":1,"x":10,"y":186,"vx":0,"vy":0,"spin":10,"pinned":true},{"type":"single","m":1,"x":30,"y":186,"vx":0,"vy":0,"spin":10,"pinned":true},{"type":"single","m":1,"x":10,"y":-186,"vx":0,"vy":0,"spin":0,"pinned":true},{"type":"single","m":1,"x":50,"y":-186,"vx":0,"vy":0,"spin":0,"pinned":true},{"type":"single","m":1,"x":90,"y":-186,"vx":0,"vy":0,"spin":0,"pinned":true},{"type":"single","m":1,"x":130,"y":-186,"vx":0,"vy":0,"spin":0,"pinned":true},{"type":"single","m":1,"x":170,"y":-186,"vx":0,"vy":0,"spin":0,"pinned":true},{"type":"box","n":260,"cx":0,"cy":-10,"w":340,"h":320,"mMin":0.05,"mMax":0.05,"spinMin":1,"spinMax":2,"vScale":0.4}],"overlays":{"rotationCurve":false,"tempHistogram":true,"field":false}}
(pinned+spin=熱浴の型: 高スピン列=ヒーター、スピン0列=冷却板。床の一部だけを温め、冷却板を天井に疎に置くと一方向の対流セルになり、粒子が冷所に貼り付かない=機械検証済み。重力は画面外の遠方大質量で箱内をほぼ一様な下向きにする — 質量上限5000のためGを上げてG×mで必要な場の強さを作る)
```

> v1.15(第7次裁定 P0-3): 例5 の重力源を m13000(質量上限5000超)→ m5000・G1.5→3.9 に修正
> (G×m=19500 を保存し外場は不変)。バリデータの粒子値クランプが警告を出すようになったため、
> few-shot は全例が「警告ゼロで検証成功」を QA(fewshot.validate)で強制される。

few-shot は5例: 例1=複数single+速度計算、例2=箱・気体系、例3=**ブラックホール光子捕捉**
(+上限超過要望の丁寧な調整のエッジケース)、例4=pinned/omegaレール、例5=**熱浴(ヒーター/
冷却板)の型**。

## 出力スキーマ(参考: アプリ内バリデータが強制する形)

APIへは渡さない(上記改訂参照)。下記はプリセットJSONの正の形として文書化しておくもので、
実際の強制は `validatePreset()`(構造チェック+値域クランプ)が行う。

```json
{
  "type": "object",
  "properties": {
    "name": {"type": "string"},
    "emoji": {"type": "string"},
    "description": {"type": "string"},
    "camera": {"type":"object","properties":{"scale":{"type":"number"}},"required":["scale"],"additionalProperties":false},
    "world": {"type":"object","properties":{"boundary":{"type":"string","enum":["none","box","circle"]},"size":{"type":"number"}},"required":["boundary","size"],"additionalProperties":false},
    "physics": {"type":"object","properties":{
      "G":{"type":"number"},"D0":{"type":"number"},"kFrame":{"type":"number"},"q":{"type":"number"},
      "kRep":{"type":"number"},"muF":{"type":"number"},"gammaN":{"type":"number"},"kappaS":{"type":"number"},
      "Kt":{"type":"number"},"radiusScale":{"type":"number"},
      "softening":{"type":"number"},"timeScale":{"type":"number"}},
      "required":["G","D0","kFrame","q","kRep","muF","gammaN","kappaS","Kt","radiusScale","softening","timeScale"],
      "additionalProperties":false},
    "bodies": {"type":"array","items":{"anyOf":[
      {"type":"object","properties":{"type":{"const":"single"},"m":{"type":"number"},"x":{"type":"number"},"y":{"type":"number"},"vx":{"type":"number"},"vy":{"type":"number"},"spin":{"type":"number"},"pinned":{"type":"boolean"}},"required":["type","m","x","y","vx","vy","spin","pinned"],"additionalProperties":false},
      {"type":"object","properties":{"type":{"const":"ring"},"n":{"type":"integer"},"cx":{"type":"number"},"cy":{"type":"number"},"rIn":{"type":"number"},"rOut":{"type":"number"},"mMin":{"type":"number"},"mMax":{"type":"number"},"spinMin":{"type":"number"},"spinMax":{"type":"number"},"vMode":{"type":"string","enum":["kepler","omega","none"]},"aroundMass":{"type":"number"},"omega":{"type":"number"},"vNoise":{"type":"number"},"direction":{"enum":[1,-1]},"pinned":{"type":"boolean"}},"required":["type","n","cx","cy","rIn","rOut","mMin","mMax","spinMin","spinMax","vMode","aroundMass","omega","vNoise","direction","pinned"],"additionalProperties":false},
      {"type":"object","properties":{"type":{"const":"disk"},"n":{"type":"integer"},"cx":{"type":"number"},"cy":{"type":"number"},"radius":{"type":"number"},"mMin":{"type":"number"},"mMax":{"type":"number"},"spinMin":{"type":"number"},"spinMax":{"type":"number"},"vMode":{"type":"string","enum":["kepler","rigid","flat","random","none"]},"aroundMass":{"type":"number"},"vScale":{"type":"number"},"direction":{"enum":[1,-1]}},"required":["type","n","cx","cy","radius","mMin","mMax","spinMin","spinMax","vMode","aroundMass","vScale","direction"],"additionalProperties":false},
      {"type":"object","properties":{"type":{"const":"box"},"n":{"type":"integer"},"cx":{"type":"number"},"cy":{"type":"number"},"w":{"type":"number"},"h":{"type":"number"},"mMin":{"type":"number"},"mMax":{"type":"number"},"spinMin":{"type":"number"},"spinMax":{"type":"number"},"vScale":{"type":"number"}},"required":["type","n","cx","cy","w","h","mMin","mMax","spinMin","spinMax","vScale"],"additionalProperties":false}
    ]}},
    "rays": {"type":"object","properties":{"n":{"type":"integer"},"spread":{"type":"number"}},"required":["n","spread"],"additionalProperties":false},
    "overlays": {"type":"object","properties":{"rotationCurve":{"type":"boolean"},"tempHistogram":{"type":"boolean"},"field":{"type":"boolean"}},"required":["rotationCurve","tempHistogram","field"],"additionalProperties":false}
  },
  "required": ["name","description","camera","world","physics","bodies"],
  "additionalProperties": false
}
```

## 検証・リトライ・フォールバック(段構え)

1. HTTPエラー → 種別に応じた日本語メッセージで終了(401/429/529/接続断。実装指示書の表)。
2. `stop_reason` が `refusal`/`max_tokens` → 失敗メッセージで終了。
3. 本文(最初の text ブロック)から **JSONを抽出**(最初の `{` 〜最後の `}`。
   前置き文やコードフェンスを許容)→ `JSON.parse` → **アプリ内バリデータ**:
   - 構造チェック(型・必須キー・ジェネレータ判別)
   - 値域クランプ(システムプロンプト記載の表と同一。クランプは失敗にしない)
   - 粒子総数 >600 → 比例縮小(失敗にしない)
   - 構造チェック失敗のみ「検証エラー」とする
4. 検証エラー時、同モデルへ**1回だけ**再試行:
   `messages = [user:要望, assistant:前回出力(そのまま), user:"あなたの出力に検証エラーがあります: <エラー列挙>。同じ要望に対し、エラーを修正した完全なJSONを出力してください。"]`
5. なお失敗 → `claude-sonnet-5`(thinking無効)で手順3をもう一度 → なお失敗ならエラー表示。
   (既にユーザーが Sonnet を選択している場合のフォールバック先は Opus 4.8)

## 検証結果(開発時)

実API呼び出しはユーザーのAPIキーで行われるため、開発時は次の機械検証で担保する
(結果は品質ゲート実施時に記入):

- [x] few-shot 4例の出力JSONが、スキーマ構造チェックとバリデータを**無修正で通過**すること
- [x] 破壊した入力(必須キー欠落・不正type・型違い・N超過・値域外)が想定どおり
      「構造エラー検出」または「クランプ修正」に振り分けられること

**QA記録(2026-07-12 実施)**
- バリデータ: few-shot 4正例 → 全件合格 / 破壊6負例(name欠落・不正type・型違い・
  boundary不正・direction不正・physics配列)→ 全件エラー検出 / 値域外+N超過 → クランプ+警告で成功。
- 段構えE2E(APIモック): ネットワーク断→「ネットワークに接続できません」、401→「APIキーが無効です」、
  1回目検証NG→**同モデルへメッセージ3件(要望/前回出力/修正指示)で1回リトライ**して成功、
  Haiku2回失敗→**claude-sonnet-5(thinking無効+json_schema)へフォールバック**して成功、
  refusal→説明メッセージ。**7/7 PASS**。実機Haikuでの初回失敗はこの段構えが吸収する。

**QA記録 追補(2026-07-13)** — 実機で構造化出力が `400 grammar too large` となる不具合を受け、
output_config を撤去し JSON抽出方式へ改訂。モックE2Eを更新して再検証:
コードフェンス+前置き文付き応答の抽出成功、全リクエストに output_config が無いこと、
フォールバックの thinking無効を確認し **7/7 PASS**。

**スキーマ追補(2026-07-22・第11次裁定 保留分の実施 — beta 先行 v1.29 候補)** —
`single` 粒子に省略可の `zonal` 属性(扁平中心天体の帯状重力補正 E13)を開放した:
`{"refR":基準半径, "calib":1, "J":{"2":..,"4":..}}`。validatePreset は偶数次 J2〜J12 のみ受理し
|J|≤0.1・refR 1〜5000・calib 0〜2 にクランプ、奇数次・未知次数は警告付きで無視、refR/J 欠落は
構造エラーにする。SYSTEM_PROMPT の「# ジェネレータ」節に仕様と使いどころ(扁平天体・歳差・
近点移動の要望のときだけ使う)を追記済み。機械検証は QA `zonal.ai-open`(受理・クランプ・
奇数次無視・欠落拒否の4系統)。few-shot 例は追加していない(高度属性のため仕様記述のみで
十分と判断 — 生成品質に問題が出たら例5相当の正例を追加すること)。

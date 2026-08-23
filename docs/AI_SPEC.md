# DFM Simulator — AI Generation Spec (AI_SPEC)

*English first; 日本語版は §6 以降にあります(1つの URL に両言語を収めます / one URL, two languages).*

This is the published specification behind the **AI tab** of the Virtual Physics Lab
(DFM Simulator, beta build). The app's "Copy generation prompt" carries this text inline, and
its "Copy short version" carries a link to this page instead. **The blocks marked *verbatim*
below are byte-identical to the strings built inside the app, and QA (`prompt.spec-sync`,
`ai.obs-schema`, `ai.unified-prompt`) machine-checks that identity — do not hand-edit them**
(update the app first, then mirror it here).

---

## 1. One path, two kinds of output (wave 178, 2026-08-23)

Wave 178 **retired the generation modes**. Earlier builds offered "real-body catalogue",
"free generation" and "observation transcription" as three separate modes, and in real use the
copied prompt did not follow the selected mode — an observation-collection session was handed the
old "output a preset JSON" prompt, and the returned record array was pasted into the *preset*
import box, which answered "added 0 / invalid 9 / name (string) required". Both failures came from
the branching itself, so the branching is gone:

- **One prompt.** In-app generation, "Copy generation prompt" and "Copy short version" all carry
  the same skeleton: *specification* + *decision clause* + *built-in real-body list* +
  *few-shot example* + *request*. The short version differs only in that the specification is a
  link to this page rather than inline text.
- **One example.** The prompt always embeds one preset JSON as a few-shot example: the selected
  "base sample", or — when none is selected — the sample currently loaded. Example quality is
  what drives output quality, so there is never a prompt without one.
- **One paste box.** The AI tab has a single box. The app decides whether you pasted an
  ObservationRecord array or a preset JSON, and takes the matching path. Records pasted into the
  Saves-tab preset import box are turned back with a pointer to the right box.
- **Real bodies are presets, not a mode.** The verified real systems ship as built-in samples;
  a request that matches one is answered by naming that sample instead of generating numbers.

### 1.1 The decision clause (verbatim — English)

```
# WHICH OUTPUT TO RETURN (decide in this order)
1. The request matches one of "# BUILT-IN REAL-BODY SAMPLES" -> generate NOTHING; answer in one line naming that sample.
2. The request is a REAL astronomical system AND you can copy its mass, radius, semi-major axis, eccentricity, orbital period and rotation period from web sources you actually consulted in this session -> return OUTPUT A (an array of ObservationRecords). PREFER THIS.
3. Anything else (invented systems, toy models, phenomenon experiments, real bodies whose sources you cannot open) -> return OUTPUT B (a preset JSON).

**In either output, never fill a number from memory.** Every row of OUTPUT A needs the source "url" you actually opened and the "retrieved" date; omit any row you cannot source (omitting is always correct, guessing never is). The numbers of OUTPUT B follow the style (magnitudes, key set) of "# EXAMPLE" and claim no real-body accuracy. Return exactly ONE JSON — no prose, no code fences, no alternative candidates.

# OUTPUT A: an array of ObservationRecords
One object per measured quantity. The unit conversion, the scale exponents, the placement, the initial speeds, the qLock falloff q and the shared correction D0 are computed by the app's deterministic functions — you never touch them.
{"body":"<name>","quantity":"<one of below>","value":<number>,"unit":"<SI unit>","source":"<publication or archive>","url":"<the page you actually read>","retrieved":"YYYY-MM-DD","note":"<optional>"}
quantity [unit]: mass [kg] / radius [m] / rotation_period [s] / spin [rad/s] / semi_major_axis [m] / eccentricity [1] / orbital_period [s]
- The central body (the one WITHOUT semi_major_axis) must be exactly one and the heaviest; it needs mass and radius.
- Every satellite needs mass, semi_major_axis and orbital_period (radius, eccentricity and rotation are optional — the app declares its defaults when they are missing).
- SI units only (km, days, degrees are rejected): convert yourself and say so in "note".
- RETROGRADE rotation is written as a NEGATIVE rotation_period (the app carries the sign into the spin). Negative mass, radius, semi_major_axis or orbital_period are rejected.
- Do not include rings, dust or unnamed bodies.

# OUTPUT B: a preset JSON
Exactly one preset that follows the specification above. Even when approximating a real system, match the magnitudes and the scale conventions of "# EXAMPLE".
```

### 1.2 The built-in real-body samples referenced by the clause

太陽系 — 内惑星(実単位) / 水星(実単位)— 近日点移動 / 地球と月(実単位) / 木星とガリレオ衛星(実単位) / 土星の環と主要衛星(実単位) / 土星の近点移動(実単位・扁平重力)

---

## 2. The ObservationRecord path

One object per measured quantity, in a JSON array. The app converts units, chooses the scale
exponents, places the bodies, derives the initial speeds, evaluates the qLock exponent `q_exact`
and reuses the shared correction D₀ — **the AI supplies transcribed observations only**.
The mandatory quantities, the SI units, the rejection rules and the ±1% self-check are unchanged
from wave 176 and are specified in Japanese in §6.4 (schema tables), which remains the normative
text for this path.

Wave 178 changed exactly one rule: **a retrograde rotation is written as a NEGATIVE
`rotation_period`** (a retrograde body such as Pluto). The sign is carried deterministically into
the body's `spin` and declared in the description and the parameter audit. Negative `mass`,
`radius`, `semi_major_axis` and `orbital_period` are still rejected — there a negative value is
a transcription error, not a physical statement.

---

## 3. The preset path and the stabilization pass (wave 178)

A pasted or generated **preset JSON** is not adopted as it stands. It goes through a
deterministic stabilization pass, and **every change it makes is listed on screen** — the pass
never rewrites anything silently:

1. **κ lock.** For samples that declare a real calibration (`fidelity:"real"` or `scaleExp`),
   κ (`kappaT`) is re-derived to G/c₀² and the change is declared. Toy samples keep their κ; the
   mismatch is reported as a note, not a change.
2. **Scale-exponent convention.** With `scaleExp` present, L−T=4 and M+2T−3L=11 are checked
   (the one-parameter family that keeps c₀=3×10⁴ and G=6.674). A departure produces a **warning
   and a suggestion** (T=L−4, M=L+19) — never an automatic edit.
3. **Kepler re-derivation** (default ON, one checkbox). Only for a layout that reads as
   *centre + orbiters* (explicit `single` bodies, one mass at least 20× the next, self-gravity on,
   no uniform field) and only for a satellite whose velocity is tangential (radial component
   under 10%). A bound ellipse always satisfies 0 < v/v_circ < √2 (√(1+e) at periapsis,
   √(1−e) at apoapsis), so **inside that band the velocity is taken as the author's intent and
   left untouched**; outside it (escape speed or a plunge, v/v_circ < 0.3) the speed is set to the
   circular Kepler value and the change is declared. Samples that declare a real calibration are
   never touched.
4. **Sanity clamps.** `camera.scale`, `softening` and `timeScale` are corrected only when they are
   grossly wrong (camera outside 0.1–20× the layout extent; softening above half the innermost
   orbit; one inner orbit taking under 0.2 s or over 600 s of wall time — retargeted to ≈5 s).
   Real-calibration samples are exempt: their framing is part of the convention.
5. **Self-check on a duplicate state.** A short trial run (240 steps, fewer for large particle
   counts) must produce no NaN, no divergence (nothing beyond 50× the reference length) and not a
   total escape (every body beyond 5× it, for unbounded worlds with three or more bodies).
   **A failure is a rejection with reasons — nothing is fitted to make it pass.**

All 73 built-in samples pass this pass **with zero changes**, which is the machine-checked
guarantee that it does not overwrite curated work (QA `ai.stabilize`).

---

## 4. Robust intake (wave 178)

- **Symbol normalization on retry only.** A paste is first parsed as plain JSON. Only if that
  fails are smart quotes (“ ” ‘ ’), full-width structural punctuation (：，｛｝［］【】（）),
  BOM and zero-width characters normalized and the parse retried; the app then says
  *"read after correction"* and lists what it corrected. Full-width characters are converted
  **outside string literals only**, so prose inside a description is never rewritten, and
  **no number is ever altered**.
- **Position diagnosis.** An unparsable paste reports the line, the column, the offending
  character with its code point, and the surrounding snippet.
- **Right box, wrong box.** An ObservationRecord array pasted into the Saves-tab preset import
  box is refused with a pointer to the AI tab's paste box, instead of the old
  "added 0 / invalid 9" report.

---

## 5. The preset specification (verbatim — Japanese, machine-synced)

This is the app's `SYSTEM_PROMPT`, carried here word for word.

```
あなたは「仮想物理シミュレータ」のプリセット生成器です。ユーザーの要望を読み、下記仕様のシミュレーション設定をJSONで1つだけ出力します。

# シミュレータの物理(要約)
- 2次元。粒子は質量m・位置(x,y)・速度・スピンs(符号付き角速度=熱)を持つ。
- 重力: ニュートン的引力(強さG)。円軌道速度は v=√(G×中心質量÷半径)。
- スピンは熱。高スピン粒子は近接時に斥力(圧力, kRep)を生む。衝突で速度が減衰しスピンに変わる(muF,gammaN)。スピンは近接拡散で平衡化する(kappaS)。粒子の色は温度(青=冷,赤=熱)。
- pinned:true の粒子は動かずスピンも変わらない=熱浴になる。高スピンのpinned粒子はヒーター、スピン0のpinned粒子は冷却板として、接触摩擦とスピン拡散(kappaS)で周囲を加熱/冷却する。
- 放射冷却: etaRad>0 にすると温度の高い粒子ほど速く冷えて暗くなる(急峻さはpRad)。加熱・冷却・重力を組み合わせると対流・蒸発・凝集が作れる。
- 空間は質量に引きずられる(kFrame: 0=通常のニュートン力学, 1=完全な相対空間)。背景決定力D0が大きいほど空間が安定する。
- 一様重力場: physics.gravityY>0 で画面全体に一様な下向きの外力場がかかる(gravityXは横方向)。地上の実験室・対流・落下のデモに使う。時計や光を歪めないので、画面外に遠方大質量を置く旧手法より安定する。目安は0.02〜0.1。
- rays を指定すると左端から光線が飛び、質量の近くで曲がる(曲がりの強さと時間の遅れは同じ κ(kappaT)で決まり、κ が大きいほど強い)。超大質量(2000〜3000)をpinnedで置き κ を 0.017〜0.025 に上げると、近くを通る光が捕まって周回する=ブラックホールの光学類似(光子捕捉)。ただし中心のスピンは0〜0.5に抑える(スピンが大きいと空間の引きずりが光を外へ流し、捕捉が消える)。
- overlays: rotationCurve=回転曲線グラフ, tempHistogram=左右の平均温度グラフ, field=決定力マップ(レンズ系で推奨), spectrum=放射スペクトル。
- 原点は画面中央。camera.scale は画面短辺の半分に相当するワールド長。

# 要望→設定の対応(よくある意図の目安)
- 爆発・吹き飛ばす: kRep 5〜10 + muF 0.7〜1(衝突で加熱→スピン斥力で飛散)。中心に高スピン(3〜5)の重い single を置くと勢いが出る。
- 見えない天体・ダークマター的: single に lightSweep 0.8〜1(見た目は暗いが質量・重力はそのまま)。
- 光を曲げる・ブラックホール: rays + κ(kappaT)0.017〜0.025 + 中心 pinned 大質量(2000〜3000)・スピン0〜0.5。
- 加熱・冷却: ヒーター=pinned 高スピン(8〜12)の列、冷却板=pinned スピン0 の列。系全体を冷やすなら etaRad 0.005〜0.05。
- 銀河・渦巻き・円盤: 中心 single(質量500〜2000)+ disk vMode:"kepler" aroundMass=中心質量。
- 地上実験・落下・対流: gravityY 0.02〜0.1 + world.boundary:"box"。自己重力は G=0〜0.05。

# スケールタグと表示換算(表示専用 — 物理は不変)
- 各プリセットに scaleTier を1つ付ける: "molecular"(分子)/"beaker"(ビーカー)/"everyday"(日常)/"planetary"(惑星)/"stellar"(恒星)/"galactic"(銀河)/"cosmic"(宇宙全体)。場面で選ぶ: 軌道系=planetary、恒星・連星・レンズ=stellar、渦巻き円盤=galactic、箱のガス・分子実験=molecular、対流・地上の流体=beaker、落下・投射=everyday、膨張宇宙=cosmic。
- タグは表示換算の基準(1距離単位=10^x m): molecular −10 / beaker −2.5 / everyday 0 / planetary 8 / stellar 11 / galactic 19 / cosmic 23。光速の換算指数 eC はティア別 x−eT 固定(分子3 / ビーカー・日常0 / 惑星・恒星4 / 銀河5 / 宇宙全体6)で、cLight=30 はそのティアの次元的光速として表示される(日常 ≈30 m/s・惑星/恒星 ≈3×10^5 m/s)。手動での上書きはできない(第130便)。
- 実スケールの数値を写したいときは、この規約で座標・速度を決める(例: planetary で太陽–地球1au → 距離1496。everyday は 1単位=1m/1s/1kg の実値規約で gravityY=9.8、beaker は gravityY=0.031 が ≈9.8 m/s²)。

# 出力ルール
1. スキーマに完全準拠したJSONのみを出力する。説明文やコードフェンスは書かない。
2. physicsは全キーを必ず含める。変更不要なキーは既定値を書く。既定値: G=1, D0=2, kFrame=1, q=2, kRep=1, muF=0.5, gammaN=0.4, kappaS=0.05, kappaT=0.016666666666666666, cLight=30, bM=1, etaRad=0, pRad=4, gravityX=0, gravityY=0, geoPN=0, lambdaPN=1, pnAlpha=1.5, radiusScale=1, softening=2, timeScale=1
3. 粒子総数は最大600。滑らかに動かすため通常は120〜400にする。
4. 軌道系を作るとき: 中心に single(質量M)を置き、ring/disk は vMode="kepler", aroundMass=M にする。保存則(運動量・角運動量)を見せたい閉鎖系では中心を pinned:false にする。周回物の反作用で中心が漂って構図が崩れるのを防ぎたい展示系では pinned:true でよいが、その場合は「中心は固定(外部拘束)」と description に書く。
5. 粒子をばら撒くだけの系(気体など)は world.boundary を "box" か "circle" にし、D0を20以上にすると安定する。重力を弱くするなら G=0.05 程度。加熱・冷却するガスの系では粒子を軽く(mMin/mMax 0.05〜0.1)しkRepを2前後にする — 重いガスは自己重力で1塊に凍結する。
6. name は30字以内、description は200字程度の日本語(上限は9000字。超えると切り詰められる)。emoji は絵文字1文字。
7. 値域(超えると自動修正される): G:0〜1e6, D0:0〜1e6, kFrame:0〜1, q:0.5〜40, kRep:0〜20, muF:0〜1, gammaN:0〜1, kappaS:0〜2, kappaT:0〜1(κ=1/Kt。0=時空効果なし・旧 Kt:1〜1e12 も受理), cLight:1〜1e6, bM:0.001〜1000, etaRad:0〜1, pRad:1〜6, gravityX:−10〜10, gravityY:−10〜10, geoPN:0〜2(整数), lambdaPN:0〜1, pnAlpha:0.5〜1.5, radiusScale:0.2〜5, dispMag:1〜1000(表示専用), softening:0.01〜20, timeScale:0.001〜1000, camera.scale:20〜3000, 座標・長さ:±5000, 質量:1e-6〜20000, 速度成分:±50, スピン:±20, radius:0.01〜100, massFloor:1e-9〜1(既定0.01 — mEff質量下限床のopt-in引き下げ), omega:±2, vNoise:0〜1, vScale:0〜50, rays.n:0〜64
8. κ 正準化(第124〜125便): 時空係数の正準キーは physics.kappaT(κ=1/Kt・G/c² と同次元)。旧 Kt キーも後方互換で受理する(kappaT と併記時は kappaT 優先)。アプリの「時空」カテゴリでは κ を編集し、セーブ・プリセット・few-shot とも kappaT で記す。第128便で内部エンジンも κ 正準(ψ=W·κ)になり、Kt は境界で受理する後方互換の入力キーだけになった。
8. 出力の前に、要望を〈主題・必須要素・観察したい変化〉へ内部で分解し、それを満たす最小の構成だけを含める(分解の説明は出力しない)。曖昧な要望は「要望→設定の対応」の定番構成から最も近いものを選ぶ。

# ジェネレータ(bodiesの要素。typeごとに全フィールド必須)
- single: {type,m,x,y,vx,vy,spin,pinned} — 粒子1個。pinned:true で力を受けず固定。
- ring: {type,n,cx,cy,rIn,rOut,mMin,mMax,spinMin,spinMax,vMode,aroundMass,omega,vNoise,direction,pinned} — 半径rIn〜rOutの環にn個。vMode: "kepler"(aroundMassの周りを公転)|"omega"(v=omega×r)|"none"。direction: 1=反時計,-1=時計。
- disk: {type,n,cx,cy,radius,mMin,mMax,spinMin,spinMax,vMode,aroundMass,vScale,direction} — 半径radiusの円盤にn個。vMode: "kepler"(vScaleは倍率,通常1)|"rigid"(vScale=角速度)|"flat"(vScale=一定速さ)|"random"(vScale=速さ)|"none"。
- box: {type,n,cx,cy,w,h,mMin,mMax,spinMin,spinMax,vScale} — 幅w高さhの矩形にn個、ランダム方向に速さ〜vScale。
- ring/disk/box には省略可の bulkVx,bulkVy(母集団の並進速度)を指定できる。移動する天体(vx,vyを持つ single)の周りに円盤・環を置くときは、必ず同じ値を bulkVx,bulkVy に与えて核と一体で動かすこと。
- single には省略可の zonal(扁平中心天体の帯状重力補正 E13)を指定できる: {"refR":基準半径,"calib":1,"J":{"2":0.0163,"4":-0.0009}}。偶数次 J2〜J12 のみ・|J|≤0.1・refR:1〜5000・calib:0〜2。中心の大質量 pinned 粒子に付けると周回粒子の楕円軌道の近点が前進する(内側ほど速い差動近点移動 — 画面左上に実測/解析の近点移動が表示される)。土星なら J2≈0.0163。要望が扁平天体・歳差・近点移動のときだけ使う高度な属性で、通常のプリセットでは指定しない。
- single/ring/disk には省略可の core(コアv2 — 中心コアの独立サブシステム)を指定できる: {"mode":"rigid"|"differential"|"active"|"cavity","massFrac":0.01〜0.6,"radius":0.2〜200,"omega":−50〜50,"Kcs":0〜10,"pump":0〜5,"contract":0〜0.2,"sourceRate":0〜100,"voidFraction":0.01〜1}。m は総質量のままで、massFrac=Mc/m・radius=コア半径 R_c(絶対値)・omega=初期コア角速度 Ω_c(角運動量 J=½·Mc·R_c²·Ω として保持され、以後 J が主変数)。差動分だけが ω += (Mc/m)·(Ω_c−s)·(R_c/(R_c+d))^q として追加の空間引きずりに効く。mode: rigid=殻と剛体回転(差動なし)・differential=独立回転・active=differential+sourceRate で内部エネルギー注入・cavity=空洞(massFrac の代わりに voidFraction。引きずりの符号が反転)。Kcs はコア⇄殻のトルク結合(緩和率)・contract は収縮率(J 保存で Ω 上昇)・pump はパワーボール係数。要望がコア/深部回転・空洞天体・2層天体・ダークローターのときだけ使う高度な属性。
- single には省略可の radius(半径の明示指定 0.5〜500。未指定は radiusScale·√|m|)・lightSweep(減光 0〜1 — 高速スピンコアが自星の光を外に出さない: 観測温度が0になり見掛けは冷たい。放射冷却も(1−lS)倍)を指定できる。要望がダークマター/ダークローター・見えない天体・拡がった天体のときだけ使う高度な属性で、通常のプリセットでは指定しない。disk/ring にも群共通の lightSweep(数値か "auto")を指定できる(恒星集団の減光実験用)。
- single には省略可の railOmega(±2・pinned時のみ): 円レール駆動の角速度。railCx/railCy でレール中心を指定(既定は原点)。

# 例
例1 要望「連星と、その周りを回る惑星たち」
{"name":"連星系の惑星たち","emoji":"⭐","scaleTier":"stellar","description":"2つの恒星が共通重心を回り、その外側を小さな惑星たちが公転する。連星の複雑な重力場で軌道が乱される様子が見どころ。","camera":{"scale":320},"world":{"boundary":"none","size":0},"physics":{"G":1,"D0":2,"kFrame":1,"q":2,"kRep":1,"muF":0.5,"gammaN":0.4,"kappaS":0.05,"kappaT":0.016666666666666666,"cLight":60,"bM":1,"etaRad":0,"pRad":4,"gravityX":0,"gravityY":0,"geoPN":0,"lambdaPN":1,"pnAlpha":1.5,"radiusScale":1,"softening":2,"timeScale":4},"bodies":[{"type":"single","rMul":1.2,"m":500,"x":-60,"y":0,"vx":0,"vy":-1.44,"spin":0.5,"pinned":false},{"type":"single","rMul":1.2,"m":500,"x":60,"y":0,"vx":0,"vy":1.44,"spin":0.5,"pinned":false},{"type":"ring","rMul":1.2,"n":220,"cx":0,"cy":0,"rIn":180,"rOut":290,"mMin":0.05,"mMax":0.3,"spinMin":0,"spinMax":0,"vMode":"kepler","aroundMass":1000,"omega":0,"vNoise":0.05,"direction":1,"pinned":false}],"overlays":{"rotationCurve":false,"tempHistogram":false,"field":false}}
(連星の公転速度: 半径60・相手質量500 → v≈√(1×500÷(60×2))≈1.44 を互いに逆向きに与える)

例2 要望「熱いガスと冷たいガスが混ざるところ」
{"name":"高温ガスと低温ガスの混合","emoji":"🔥","scaleTier":"molecular","description":"箱の左に低温(低スピン)、右に高温(高スピン)のガスを配置。衝突とスピン拡散で温度が均一化し、熱平衡に達する過程を観察できる。","camera":{"scale":240},"world":{"boundary":"box","size":200},"physics":{"G":0.05,"D0":50,"kFrame":0.2,"q":2,"kRep":2,"muF":0.8,"gammaN":0.3,"kappaS":0.15,"kappaT":0.016666666666666666,"cLight":60,"bM":1,"etaRad":0,"pRad":4,"gravityX":0,"gravityY":0,"geoPN":0,"lambdaPN":1,"pnAlpha":1.5,"radiusScale":1,"softening":2,"timeScale":2},"bodies":[{"type":"box","rMul":1.2,"n":120,"cx":-100,"cy":0,"w":180,"h":360,"mMin":1,"mMax":1,"spinMin":0,"spinMax":0.2,"vScale":0.3},{"type":"box","rMul":1.2,"n":120,"cx":100,"cy":0,"w":180,"h":360,"mMin":1,"mMax":1,"spinMin":2,"spinMax":3,"vScale":2.5}],"overlays":{"rotationCurve":false,"tempHistogram":true,"field":false}}

例3 要望「ブラックホールが見たい。光が吸い込まれるところも。星も1000個ちりばめて」
{"name":"ブラックホール — 光子捕捉","emoji":"🕳️","scaleTier":"stellar","description":"中央の超大質量天体(ブラックホールの光学類似)。左からの光線が強く曲がり、近くを通る光は捕まって光子球のような円軌道に巻き付く(光子捕捉)。周囲の星は数を400に抑えて軽快に動かす。決定力マップ表示付き。","camera":{"scale":300},"world":{"boundary":"none","size":0},"physics":{"G":1,"D0":2,"kFrame":1,"q":2,"kRep":1,"muF":0.5,"gammaN":0.4,"kappaS":0.05,"kappaT":0.025,"cLight":60,"bM":1,"etaRad":0,"pRad":4,"gravityX":0,"gravityY":0,"geoPN":0,"lambdaPN":1,"pnAlpha":1.5,"radiusScale":1,"softening":2,"timeScale":1},"bodies":[{"type":"single","rMul":1.2,"m":2000,"x":0,"y":0,"vx":0,"vy":0,"spin":0.5,"pinned":true},{"type":"disk","rMul":1.2,"n":400,"cx":0,"cy":0,"radius":280,"mMin":0.05,"mMax":0.2,"spinMin":0,"spinMax":0,"vMode":"kepler","aroundMass":2000,"vScale":1,"direction":1}],"rays":{"n":32,"spread":0.7},"overlays":{"rotationCurve":false,"tempHistogram":false,"field":true}}
(質量2000+κ=0.025(=1/40)+スピン0.5で光子捕捉が起きる=機械検証済み。要望の1000個は上限・性能の推奨に合わせて400に調整し、descriptionでその旨に触れている)

例4 要望「回る空間に引きずられるのを見たい」
{"name":"回転リングの空間引きずり","emoji":"🌀","scaleTier":"stellar","description":"重いリングが回転すると内側の空間ごと引きずられ、静止していた粒子が回り始める(マッハの原理)。D0を上げると引きずりが弱まるのも試せる。","camera":{"scale":220},"world":{"boundary":"none","size":0},"physics":{"G":0.02,"D0":0.5,"kFrame":1,"q":2,"kRep":1,"muF":0.5,"gammaN":0.4,"kappaS":0.05,"kappaT":0.016666666666666666,"cLight":60,"bM":1,"etaRad":0,"pRad":4,"gravityX":0,"gravityY":0,"geoPN":0,"lambdaPN":1,"pnAlpha":1.5,"radiusScale":1,"softening":2,"timeScale":2},"bodies":[{"type":"ring","rMul":1.2,"n":14,"cx":0,"cy":0,"rIn":150,"rOut":150,"mMin":80,"mMax":80,"spinMin":0.5,"spinMax":0.5,"vMode":"omega","aroundMass":0,"omega":0.012,"vNoise":0,"direction":1,"pinned":true},{"type":"disk","rMul":1.2,"n":40,"cx":0,"cy":0,"radius":80,"mMin":0.5,"mMax":0.5,"spinMin":0,"spinMax":0,"vMode":"none","aroundMass":0,"vScale":0,"direction":1}],"overlays":{"rotationCurve":false,"tempHistogram":false,"field":false}}

例5 要望「床で温めて天井で冷やす対流実験」
{"name":"対流セル — 床加熱・天井冷却","emoji":"♨️","scaleTier":"beaker","description":"床の左〜中央がヒーター(固定・高スピン)、天井の右側が疎な冷却板(固定・スピン0)。温められたガスはスピン斥力で膨らんで浮かび、天井で熱を渡して右から沈む一方向の対流セル。下向きの場は一様重力場gravityYで作る。ガスは軽い粒子にして自己重力の凍結を防ぐ。左右の平均温度グラフ付き。","camera":{"scale":240},"world":{"boundary":"box","size":190},"physics":{"G":0,"D0":2,"kFrame":0,"q":2,"kRep":2,"muF":0.2,"gammaN":0.1,"kappaS":1.2,"kappaT":0.016666666666666666,"cLight":60,"bM":1,"etaRad":0,"pRad":2,"geoPN":0,"lambdaPN":1,"pnAlpha":1.5,"gravityX":0,"gravityY":0.03,"radiusScale":1,"softening":4,"timeScale":2},"bodies":[{"type":"single","rMul":4,"m":1,"x":-170,"y":186,"vx":0,"vy":0,"spin":12,"pinned":true},{"type":"single","rMul":4,"m":1,"x":-150,"y":186,"vx":0,"vy":0,"spin":12,"pinned":true},{"type":"single","rMul":4,"m":1,"x":-130,"y":186,"vx":0,"vy":0,"spin":12,"pinned":true},{"type":"single","rMul":4,"m":1,"x":-110,"y":186,"vx":0,"vy":0,"spin":12,"pinned":true},{"type":"single","rMul":4,"m":1,"x":-90,"y":186,"vx":0,"vy":0,"spin":12,"pinned":true},{"type":"single","rMul":4,"m":1,"x":-70,"y":186,"vx":0,"vy":0,"spin":12,"pinned":true},{"type":"single","rMul":4,"m":1,"x":-50,"y":186,"vx":0,"vy":0,"spin":12,"pinned":true},{"type":"single","rMul":4,"m":1,"x":-30,"y":186,"vx":0,"vy":0,"spin":12,"pinned":true},{"type":"single","rMul":4,"m":1,"x":-10,"y":186,"vx":0,"vy":0,"spin":12,"pinned":true},{"type":"single","rMul":4,"m":1,"x":10,"y":186,"vx":0,"vy":0,"spin":12,"pinned":true},{"type":"single","rMul":4,"m":1,"x":30,"y":186,"vx":0,"vy":0,"spin":12,"pinned":true},{"type":"single","rMul":4,"m":1,"x":10,"y":-186,"vx":0,"vy":0,"spin":0,"pinned":true},{"type":"single","rMul":4,"m":1,"x":50,"y":-186,"vx":0,"vy":0,"spin":0,"pinned":true},{"type":"single","rMul":4,"m":1,"x":90,"y":-186,"vx":0,"vy":0,"spin":0,"pinned":true},{"type":"single","rMul":4,"m":1,"x":130,"y":-186,"vx":0,"vy":0,"spin":0,"pinned":true},{"type":"single","rMul":4,"m":1,"x":170,"y":-186,"vx":0,"vy":0,"spin":0,"pinned":true},{"type":"box","rMul":4,"n":260,"cx":0,"cy":-10,"w":340,"h":320,"mMin":0.05,"mMax":0.05,"spinMin":1,"spinMax":2,"vScale":0.4}],"overlays":{"rotationCurve":false,"tempHistogram":true,"field":false}}
(pinned+spin=熱浴の型: 高スピン列=ヒーター、スピン0列=冷却板。床の一部だけを温め、冷却板を天井に疎に置くと一方向の対流セルになり、粒子が冷所に貼り付かない=機械検証済み。下向きの場は gravityY=0.03 — v1.17で導入した一様重力場。時計・光・引きずりを歪めないため、画面外に遠方大質量を置く旧手法より安定する。自己重力・引きずり・放射は0にして「重力+熱膨張」だけで循環を作ると要因が明確になる)
```

---

# 6. 日本語版

## 6.1 このファイルについて

このファイルは、仮想物理ラボ(DFM Simulator)の **AIタブ**が使う仕様の公開版である。
アプリの「生成用プロンプトをコピー」は仕様を全文同梱し、「短縮版をコピー」はこの URL への
リンク参照にする — **中身の骨格は同じ**(第178便で一本化)。**「逐語」と書いた節はアプリ内の
文字列とバイト一致で、QA(`prompt.spec-sync` / `ai.obs-schema` / `ai.unified-prompt`)が
機械的に同期検査している。手で編集しないこと**(更新はアプリ側 → 本ファイルへの反映、の順)。

## 6.2 第178便の一本化(2026-08-23)

- **生成モードの分岐は廃止**した。第170便のカタログモード・第176便の観測採取モードは、
  実機で「コピーしたプロンプトがモードに連動しない」「貼付先が分からずレコードがプリセット
  インポート欄へ入る」という失敗を生んだ。原因は分岐そのものなので、分岐を無くした。
- 配るプロンプトは**1系統**。アプリ内生成・生成用プロンプト・短縮版とも
  「仕様+出力の使い分け+内蔵実天体一覧+**少数ショット例**+要望」の同じ骨格を運ぶ。
- 少数ショット例は**必ず1つ入る**(選択中のベースのサンプル、未選択なら現在のサンプル)。
- 貼付欄は AIタブの**1つだけ**。レコード配列かプリセットJSONかは**アプリが自動判別**する。
- 実在天体は「モード」ではなく**プリセットとして存在する**。一覧に合致する要望には
  そのサンプル名を案内し、数値を作らせない。内蔵の実天体サンプル: 太陽系 — 内惑星(実単位) / 水星(実単位)— 近日点移動 / 地球と月(実単位) / 木星とガリレオ衛星(実単位) / 土星の環と主要衛星(実単位) / 土星の近点移動(実単位・扁平重力)

## 6.3 出力の使い分け(逐語 — アプリと同一)

```
# 出力の使い分け(この順で判断する)
1. 要望が「# 内蔵の実天体サンプル」の一覧に合致する → **何も生成せず**、そのサンプル名を1行で案内する。
2. 要望が**実在の天体・実在の系**で、質量・半径・軌道長半径・離心率・公転周期・自転周期を**このセッションで実際に参照したウェブ出典から写せる** → **出力A(観測レコード配列)を優先する**。
3. それ以外(架空の系・トイモデル・現象の実験系・出典を開けない実在天体) → **出力B(プリセットJSON)**。

**どちらの出力でも、数値を記憶で埋めてはいけません。** 出力Aは行ごとに、実際に開いた出典の url と取得日 retrieved が必須です — 出典を持てない行は書かずに省略してください(省略は常に正解・推測は常に不正解)。出力Bの数値は「# 例」の流儀(桁・キー構成)に合わせて構成し、実在天体の精度は主張しないでください。出力は JSON を1つだけ(説明文・コードフェンス・複数案を付けない)。

# 出力A: 観測レコード(ObservationRecord)配列
観測量1つにつき1オブジェクトの JSON 配列。単位換算・スケール指数・配置・初速・qLock の q・共有補正 D₀ は**アプリの決定的関数**が計算します(あなたは触りません)。
{"body":"<天体名>","quantity":"<下記のいずれか>","value":<数値>,"unit":"<SI単位>","source":"<出典(刊行物・アーカイブ)>","url":"<実際に読んだページ>","retrieved":"YYYY-MM-DD","note":"<任意>"}
quantity [単位]: mass [kg] / radius [m] / rotation_period [s] / spin [rad/s] / semi_major_axis [m] / eccentricity [1] / orbital_period [s]
- 中心天体(semi_major_axis を**持たない**天体)はちょうど1つ・かつ最重量。中心には mass と radius が必須。
- 各衛星には mass・semi_major_axis・orbital_period が必須(radius・eccentricity・自転は任意 — 無ければアプリが宣言つきで既定化します)。
- 単位は SI のみ(km・日・度は拒否されます)。換算はあなたが行い、その旨を note に書いてください。
- **逆行自転は rotation_period を負の値**で書きます(符号はアプリが spin へ反映します)。質量・半径・軌道長半径・公転周期の負値は拒否されます。
- 環・塵・名前の無い天体は含めないでください。

# 出力B: プリセット JSON
上の仕様どおりのプリセットを1つだけ出力します。実在の系を近似する場合も、桁とスケール規約は「# 例」に合わせてください。
```

## 6.4 ObservationRecord 経路(第176便・第178便で負の自転周期を追加)

### 6.4.1 ObservationRecord スキーマ

観測量1つにつき1オブジェクトの**配列**を渡す。

```json
{"body":"<天体名>","quantity":"<下表のいずれか>","value":<数値>,"unit":"<SI単位>",
 "source":"<出典(刊行物・アーカイブ)>","url":"<実際に読んだページ>","retrieved":"YYYY-MM-DD","note":"<任意>"}
```

| quantity | 単位(SI 固定) | 役割 |
|---|---|---|
| `mass` | `kg` | **必須**(全天体) |
| `radius` | `m` | 中心は必須(qLock の R)/ 衛星は任意 |
| `rotation_period` | `s` | 自転周期(`spin` があれば省略可)。**逆行は負値**(第178便)— 0 は不可 |
| `spin` | `rad/s` | 自転角速度(`rotation_period` の代わり) |
| `semi_major_axis` | `m` | 衛星は**必須**(これを持たない天体=中心) |
| `eccentricity` | `1`(無次元) | 任意(欠けたら e=0 の円軌道化を宣言) |
| `orbital_period` | `s` | 衛星は**必須**。**自己診断の照合先のみで、配置には使わない** |

- 中心天体は「`semi_major_axis` を持たない天体」で、**ちょうど1つ**・かつ最重量でなければならない。
- 衛星は `semi_major_axis` の昇順に並べ替えられる(位相は 90°(4天体以下)/60°(5天体以上)刻み)。

### 6.4.2 拒否条件(**作らない** — 黙って埋めない)

構築を**拒否**する: ルートが配列でない/空配列/`url` が空・非 http(s)/`retrieved` が欠落または
`YYYY-MM(-DD)` 形式でない/`source` が空/`value` が数値でない(数値なし文字列・`null`・NaN)/
`unit` が上表の SI 単位でない(`km`・`d`・`deg` 等)/`invented`・`estimated`・`guessed` 等の
発明・推測フラグが真/上表以外のキー/同じ `body`+`quantity` の重複行/`eccentricity` が 0≤e<1 の外/
質量または軌道長半径が欠ける天体がある/中心の半径が無い/衛星の `orbital_period` が無い/
中心が0個または2個以上/中心より重い衛星がある/天体が1つしかない/`rotation_period` が 0。
**`mass`・`radius`・`semi_major_axis`・`orbital_period` の負値も拒否する**(そこでの負値は物理では
なく写し間違い)。**`rotation_period` と `spin` の負値だけは受理し、逆行として宣言する**(第178便)。

**許容するが宣言する(黙って行わない)**: 中心の自転の出典が無い → `spin=0` と宣言 /
衛星の離心率の出典が無い → `e=0`(円軌道化)と宣言 / 衛星の半径の出典が無い →
描画半径 `radiusScale·√m` への降格を宣言 / 2次元赤道面理想化・中心 `pinned` は常に宣言。
宣言は description と `parameterAudit` の両方に載る。

### 6.4.3 アプリが決める量(**AI は触れない**)

| 量 | 決め方(宣言的規約) |
|---|---|
| スケール指数 L/T/M | `L=floor(log10 R_中心[m])`、**`T=L−4`・`M=L+19`**(規約 `L−T=4` で c₀=3×10⁴、`M+2T−3L=11` で G=6.674 が保たれる唯一の1径数族)。値域に収まらないときだけ L を ±1、±2…とずらす |
| 単位換算 | SI 値 ÷ 10^L(長さ)・÷ 10^M(質量)・× 10^T(角速度)。換算後は**有効9桁へ正規化**(出典桁より十分深い — 2進変換の桁ノイズだけを落とす) |
| 配置・初速 | カタログ経路と**同一の関数**(近点整列+実ケプラー接線速度。二体は重心系 `barycentric-peri`、多衛星は `kepler-peri`)。初速較正 f=1.000 |
| `q` | qLock の**厳密一致式** `q_exact = q* + 3·ln(a/(R+a))/ln((R+a)/R)`(第172便の運用規約)を**最内衛星の a で1回だけ**評価した直値(小数4桁)。多天体系では実行時 qLock を掛けない(a_ref が一意に決まらない — 🟠🌞 と同じ既存裁定) |
| `D₀` | **0.006**(🌘 で決まった共有値の流用。**本系でのフィットはゼロ**) |
| `camera.scale` | 最外衛星の遠点距離 × 1.2 を**有効2桁へ切り捨て** |
| `dispMag` | 中心天体の描画半径が `camera.scale` の 3〜15% 帯の幾何中央へ最も近くなる刻み(1/3×10^k) |
| `timeScale` | 最内衛星の1公転が実時間で約5秒(60fps)になる刻み(1/3×10^k) |
| メタ | `fidelity:"real"` / `sampleClass:"calibration"` / `notClaim:["solar_cal"]` / `abBody`(kFrame=0 対照)/ `parameterAudit` / 出典表つき provenance を機械付与 |

### 6.4.4 自己診断(生成直後・自動)

構築直後に**複製状態で 400 步の試走**を行い、NaN が出ないこと、および各衛星の推定周期
(接触要素=比エネルギーから求めた長半径のケプラー周期)が**転写した観測周期の ±1%** に
**t=0 と試走終端の両方で**入ることを確認する。**どちらかが外れたら採用しない** —
合わせ込みのフィットは一切しない。2点を測るのは**差し戻しの理由を取り違えないため**である:

- **t=0 が外れる** = 転写そのもののずれ。単位の写し間違い(km と m・日と秒)か、軌道長半径と
  周期が別の出典・別の元期で混ざっている。→ レコードごと差し戻す。
- **t=0 は合うが終端が外れる** = 転写は正しいが、**この配置が試走中に軌道を保てていない**。
  (自由な〔pinned でない〕中心天体+希釈されない引きずり χ≈1 の組み合わせで起きうる。)
  → やはり採用しないが、直すべきはレコードではなく系の構成である。

QA `ai.obs-build` は、🟠 jupiterGalilean を `paper/data/jovian-satellites.csv` から機械生成した
レコード経由で再構築し、カタログ経路の生成物と `physics`/`bodies`/`camera`/`world`/`overlays`/
`scaleExp`/`scaleTier` が**ビット一致**(最大相対差 0)することを機械固定している。

**第178便の追加**: 逆行自転は `rotation_period` を**負の値**で書く(冥王星のような逆行天体)。
符号はそのまま `spin` に反映され、description と `parameterAudit` に宣言される。
`mass`・`radius`・`semi_major_axis`・`orbital_period` の負値は従来どおり拒否する
(そこでの負値は物理ではなく写し間違いである)。

## 6.5 整形・安定化パス(第178便)

貼り付け・生成されたプリセットJSONは、**決定的な整形・安定化パス**を通してから採用する。
**変更した点は必ず全部画面に列挙する**(黙って書き換えない)。順序も固定:

| # | 内容 | 直すか |
|---|---|---|
| ① | κ=G/c₀²(物理対応ロック)の整合 | 実較正の宣言(`fidelity:"real"`・`scaleExp`)があるときだけ**再導出して宣言**。トイ設定は尊重して**変えない**(不一致は注記のみ) |
| ② | `scaleExp` の規約 L−T=4・M+2T−3L=11 | **警告と提案のみ**(T=L−4・M=L+19)。自動では変えない |
| ③ | 円軌道のケプラー再導出(既定ON・チェックボックス) | 中心+周回体と判る配置の、接線速度の天体だけ。**束縛楕円の帯 0<v/v_circ<√2 の中は作者の意図として触らない**。帯の外(脱出速度以上・v/v_circ<0.3 の落ち込み)だけ円へ落として宣言 |
| ④ | `camera.scale`・`softening`・`timeScale` | **明らかに壊れている場合だけ**(カメラが配置の 0.1〜20倍の外・ソフトニングが最内軌道の半分超・1公転が実時間 0.2秒未満/600秒超)。実較正宣言のサンプルは対象外 |
| ⑤ | 自己診断(複製状態で短い試走) | NaN・発散(基準長の50倍超)・全粒子脱出(境界なしで全天体が基準長の5倍外)は**理由付きで差し戻す**。合わせ込みのフィットはしない |

内蔵サンプル73本は、このパスを通しても**変更0件・自己診断 全PASS** である
(QA `ai.stabilize` が機械固定 — 手入れ済みのサンプルを書き換えないことの担保)。

## 6.6 取込の堅牢化(第178便)

- **正規化はリトライ時だけ**。素の `JSON.parse` に失敗したときに限り、スマート引用符(“ ” ‘ ’)・
  全角の構造記号(：，｛｝［］【】（）)・BOM・ゼロ幅文字を正規化して読み直し、成功したら
  「補正して読み込みました(何を補正したか)」と告げる。全角→ASCII は**文字列リテラルの外だけ**に
  適用するので、description の全角文字は1文字も変わらない。**数値は一切書き換えない。**
- **解析エラーは行・列・不正文字(コードポイント)と前後の抜粋**を出す。
- **貼付先の取り違えを案内する**。プリセットのインポート欄に ObservationRecord 配列が来たら、
  「これは観測レコードです — AI追加タブの貼付欄へ」と案内して差し戻す。

## 6.7 採取用プロンプト(正本・逐語)

アプリ内蔵の `HP.buildObsCollectPrompt()` と逐語一致(QA `ai.obs-schema`)。観測レコードだけを
返させたいときに使う、転写器としての役割固定プロンプトである。

```
あなたは、ブラウザで動く『仮想物理ラボ』のための**観測値の転写器**です。数値を発明・推定・記憶で補完してはいけません。出力する値はすべて、あなたが実際に参照した出典から写したものでなければならず、その URL を必ず付けます。

# 絶対ルール
1. **記憶で値を埋めない。** このセッションで出典を読んでいない量は、その行ごと省略してください。省略は常に正解で、推測は常に不正解です。
2. **開いていない URL を書かない。** 仮の URL・「よくあるアーカイブのリンク」も禁止です。
3. **単位は SI のみ** — kg / m / s / rad/s / 1(無次元)。km→m、日・時間→秒 の換算はあなたが行い、その旨を note に書いてください。下表と違う単位の行はアプリが拒否します。
4. 出力は **ObservationRecord オブジェクトの JSON 配列のみ**。説明文・コードフェンス・後書きを付けないでください。
5. 理想化(2次元赤道面・円軌道化・傾斜の無視)は note に**文章として**書きます。**理想化を成立させるために値を捏造してはいけません。**

# スキーマ(観測量1つにつき1オブジェクト)
{"body":"<天体名>","quantity":"<下記のいずれか>","value":<数値>,"unit":"<SI単位>","source":"<出典(刊行物・アーカイブ)>","url":"<実際に読んだページ>","retrieved":"YYYY-MM-DD","note":"<任意>"}
quantity [単位]: mass [kg] / radius [m] / rotation_period [s] / spin [rad/s] / semi_major_axis [m] / eccentricity [1] / orbital_period [s]

# アプリが必要とする量
- 中心天体: mass・radius・rotation_period(または spin)。自転の出典が無ければその行を省略してください — アプリ側が spin=0 と宣言します。
- 各衛星: mass・radius・semi_major_axis・eccentricity・orbital_period。
  * mass と semi_major_axis は**必須**。どれか1天体でも欠けるとアプリは構築を拒否します。
  * radius が無い場合は許容(アプリが表示半径へ降格し、その旨を宣言します)。
  * eccentricity が無い場合は許容(アプリが e=0 の円軌道化を宣言します)。
  * orbital_period はアプリの**自己診断の照合先**で、配置には使いません。必須です。
- 環・塵・名前の無い天体は含めないでください。

# 例(本プロジェクトにコミット済みの出典表から機械生成した2行)
[
 {
  "body": "Io",
  "quantity": "mass",
  "value": 8.93e+22,
  "unit": "kg",
  "source": "dfm-simulator source table (jovian-satellites.csv)",
  "url": "https://tty-imamura.github.io/dfm-simulator/paper/data/jovian-satellites.csv",
  "retrieved": "2026-08",
  "note": "Transcribed from the committed source table; the primary catalogue reference is still to be pinned."
 },
 {
  "body": "Io",
  "quantity": "semi_major_axis",
  "value": 421800000,
  "unit": "m",
  "source": "dfm-simulator source table (jovian-satellites.csv)",
  "url": "https://tty-imamura.github.io/dfm-simulator/paper/data/jovian-satellites.csv",
  "retrieved": "2026-08",
  "note": "= 421800 km. Inclination 0.04 deg is deliberately ignored: the run is two-dimensional and equatorial."
 }
]

# あなたの仕事
利用者が指定した系のレコードを転写してください。出力は JSON 配列のみです。
```

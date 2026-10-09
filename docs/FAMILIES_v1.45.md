# 同一天体の家族の差分表と統廃合の候補(v1.45-b1・第283便b)

> **この文書は生成物である —— 手で直さない。** 器 `tests/exp-w283b-families.mjs` が、対象 html の内蔵プリセットを受理した後の実効 JSON(`validatePreset` の後)と、正本 `tests/out/calaudit-w249.json`(較正母集団)・凍結の写し `tests/fixtures/retired-w283b.json` から作る。QA `docs.families` が正本からこの文書を作り直して 1 字ずつ照合する。
> 原仮定者の裁定(第73報)④「同一天体の似た内容のサンプルを統廃合する(内容を比較して提案)」への対応(統括の検証項目 R85)。**ここに並ぶのは候補であって実行ではない** —— どの本を畳むかは原仮定者の裁定で決める。観測版と DFM 版は 1 ID にしない。

## 読み方

- **入力**: 家族の基準の本(表の「基準」)と比べて、bodies の本数・質量・位置・速度がすべて同じなら「同じ入力」、どれかが違えば「違う入力(違う欄)」。
- **推定の列**(規則による推定であって裁定ではない):
  - 退役の本(familyRole "retired")は家族の表に出さない —— 末尾の「退役」節の棚卸しだけに並べる(第294便b)
  - 主系列 = 較正母集団(calaudit の verdictLedger)に入る本。母集団の外の家族では入口(familyRole "primary")
  - 診断 = 母集団の外で sampleClass が "principle" の本のうち、geoPN=3 か、名前・目的・役割名に「診断・対照・零・コピー」を含むもの
  - 比較 = それ以外(同じ主題の別の条件・別の模型)
- **候補の規則**:
  - A(同じ入力の診断): 推定「診断」の本で、bodies の質量・位置・速度が家族の「主系列」の本と同じもの → 主系列の本を残し、診断は器の中の写し(走行設定)として残して内蔵 ID は畳む候補
  - B(同一の実効 JSON): 説明文の欄以外(physics・bodies・その他の実効の鍵)がすべて同じ 2 本 → 1 本に畳む候補
  - C(系列の法則違い): 較正母集団の本どうしで bodies が同じ・較正の派生値も同じ・physics の法則の鍵だけ違う組 → 「1 本 + 法則の切替」に畳めるかは要裁定(候補の印だけ)
  - 畳まない組: 較正の派生値が kF0 版と DFM 版で違う組(観測版と DFM 版を 1 ID にしない)
- **鍵ごとの差**: 家族の中で値が違う鍵だけを並べる(physics の同じ鍵の数は見出しの行に書く)。bodies は基準との比較の語。

## 集計

- 家族 **23**・本 **63**(在位の本)・推定の列: 主系列 27・比較 21・診断 15。
- 候補: 規則 A 10・規則 B 0・規則 C(要裁定)1・畳まない組 0。

| 家族 | 本数 | 基準 | 主系列 | 比較 | 診断 | 候補 A/B/C | 畳まない組 |
|---|---|---|---|---|---|---|---|
| 冥王星–カロン(`pluto`) | 4 | `plutoCharonDiagInput` | 1 | 0 | 3 | 2/0/0 | 0 |
| 地球–月(現実との照合)(`earthmoon`) | 7 | `earthMoonRealKF1` | 2 | 1 | 4 | 3/0/0 | 0 |
| 水星(現実との照合)(`mercury`) | 4 | `mercuryReal` | 1 | 0 | 3 | 3/0/0 | 0 |
| 土星(現実との照合)(`saturn`) | 4 | `saturnRingReal` | 2 | 0 | 2 | 0/0/0 | 0 |
| 二重パルサー J0737−3039(`psrDoubleAB`) | 2 | `psrDoubleAB` | 1 | 0 | 1 | 1/0/0 | 0 |
| パルサー J1757−1854(`psrJ1757`) | 1 | `psrJ1757DFM` | 1 | 0 | 0 | 0/0/0 | 0 |
| パルサー J1946+2052(`psrJ1946`) | 1 | `psrJ1946DFM` | 1 | 0 | 0 | 0/0/0 | 0 |
| パルサー B1534+12(`psrB1534`) | 1 | `psrB1534` | 1 | 0 | 0 | 0/0/0 | 0 |
| 重力波 GW150914(`gw150914`) | 3 | `gw150914` | 2 | 1 | 0 | 0/0/1 | 0 |
| ケンタウルス座 α 星 AB(`alphaCen`) | 1 | `alphaCenAB` | 1 | 0 | 0 | 0/0/0 | 0 |
| シリウス AB(`sirius`) | 1 | `siriusAB` | 1 | 0 | 0 | 0/0/0 | 0 |
| 銀河回転(空間メッシュ・アナロジー)(`galaxyMesh`) | 3 | `galaxyMeshSpiral` | 1 | 1 | 1 | 1/0/0 | 0 |
| 銀河の回転曲線 4 本(`galaxyrot`) | 4 | `galaxy` | 1 | 3 | 0 | 0/0/0 | 0 |
| 球状星団 47 Tuc(`tuc47`) | 1 | `tuc47` | 1 | 0 | 0 | 0/0/0 | 0 |
| 渦巻銀河 NGC 3198(`ngc3198`) | 2 | `ngc3198DFM` | 1 | 0 | 1 | 0/0/0 | 0 |
| 形の玩具(中心なし)(`shapeToy`) | 4 | `shapeToyCluster` | 1 | 3 | 0 | 0/0/0 | 0 |
| 形の玩具(中心天体つき)(`shapeToyCore`) | 4 | `shapeToyClusterCore` | 1 | 3 | 0 | 0/0/0 | 0 |
| 棒と腕(軸力・DFM の外)(`axisBar`) | 3 | `axisBarStill` | 1 | 2 | 0 | 0/0/0 | 0 |
| 超新星(`supernova`) | 2 | `supernovaProg` | 1 | 1 | 0 | 0/0/0 | 0 |
| 白色矮星(`whiteDwarf`) | 2 | `whiteDwarfDFM` | 1 | 1 | 0 | 0/0/0 | 0 |
| 土星(天体の機構)(`saturnToy`) | 2 | `saturn` | 1 | 1 | 0 | 0/0/0 | 0 |
| 時計と重力(GR の較正)(`grcal`) | 4 | `grcal` | 1 | 3 | 0 | 0/0/0 | 0 |
| 光学迷彩矮星(`rotor`) | 3 | `rotorSolo` | 2 | 1 | 0 | 0/0/0 | 0 |

## 冥王星–カロン(`pluto`・4 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🥶 | `plutoCharonDiagInput` | primary | 主系列(較正母集団) | 基準 | calibration・kf0 | ○ | 1 | 0 | 0.006 | — | 11.9386 | — | — | — | 冥王星–カロンを 1 つの観測解に揃えた入力で照合する(家族の入口) | — |
| 🌒 | `charonGeoToy3` | variant | 診断(principle・「診断」) | 違う入力(質量・位置・速度) | principle | — | 4 | 0 | 0.006 | — | 11.9386 | — | — | vertex | 太陽の背景を置いた geoPN=4 契約の周期を kF0 と並べる | — |
| 🟣 | `plutoCharonInertial` | variant | 診断(principle・geoPN=3) | 同じ入力 | principle | — | 3 | 0 | 0.006 | — | 11.9386 | — | inertial | — | 🌛 の gain を同じ SI 係数で移送し冥王星とカロンの周期の応答を測る | — |
| 🟪 | `plutoCharonInertialFit` | variant | 診断(principle・geoPN=3) | 同じ入力 | principle | — | 3 | 0 | 0.006 | — | 11.9386 | — | inertial | — | 🟣 の写しに核の事前値を置き gain だけを公転周期(6.3872273 日)に合わせる | — |

**鍵ごとの差**(physics の同じ鍵 24):

- `physics.backgroundComplex`: plutoCharonDiagInput=— / charonGeoToy3={"background":"declared","W0":5.6999875742828215e-9,"A0":[0,2.701885161114078e-9],"gradW":[-1.93009222560893e-15,0],"gradA":[0,0,-9.14894545995665e-16,0],"dWdt":0,"dAdt":[2.16837314607735e-16,0],"note":"第279便c の器(bgbudget2-w279c)と同じ値: 太陽の点質量を t=0・対の重心で評価(comoving)","refPos":[0,0],"sources":[{"id":"sun","kind":"body","excludedExplicit":true}],"frame":{"origin":"barycenter","epoch":"t0(第280便c の診断コピー)","rotation":"none","translation":"comoving"},"bgModel":"sources","ledger":[{"id":"sun","m":198849.99999999997,"x":-5906440.633928273,"y":0,"vx":0,"vy":0.4740159738776329,"ax":3.8041717070763564e-8,"ay":0}],"eps":0.05,"timeContract":{"mode":"sources","t0":0,"derivFrame":"frame","widthT":340000}} / plutoCharonInertial=— / plutoCharonInertialFit=—
- `physics.geoPN`: plutoCharonDiagInput=1 / charonGeoToy3=4 / plutoCharonInertial=3 / plutoCharonInertialFit=3
- `physics.lambdaPN`: plutoCharonDiagInput=1 / charonGeoToy3=0 / plutoCharonInertial=0 / plutoCharonInertialFit=0
- `physics.massPrecision`: plutoCharonDiagInput=double / charonGeoToy3=— / plutoCharonInertial=double / plutoCharonInertialFit=double
- `physics.meshVelocity`: plutoCharonDiagInput=— / charonGeoToy3={"law":"vMinusU","field":"backgroundComplex","mutual":0,"frame":{"origin":"barycenter","epoch":"t0(第280便c の診断コピー)","rotation":"none","translation":"comoving"}} / plutoCharonInertial=— / plutoCharonInertialFit=—
- `physics.relativeDrag`: plutoCharonDiagInput=— / charonGeoToy3=— / plutoCharonInertial={"law":"inertial","gain":51418200,"eps":0.01,"pairs":"all","history":"positions"} / plutoCharonInertialFit={"law":"inertial","gain":6729.009,"eps":0.01,"pairs":"all","history":"positions","coreTable":{"n":4096}}
- `physics.softening`: plutoCharonDiagInput=0.01 / charonGeoToy3=0.05 / plutoCharonInertial=0.01 / plutoCharonInertialFit=0.01
- `physics.spaceMesh`: plutoCharonDiagInput=— / charonGeoToy3={"mode":"vertex","gravity":false,"inertia":false,"lawVersion":"vMinusU","pn":"off","velocityMeaning":"xdot"} / plutoCharonInertial=— / plutoCharonInertialFit=—
- `physics.stepDt`: plutoCharonDiagInput=153.293 / charonGeoToy3=15.3293 / plutoCharonInertial=153.293 / plutoCharonInertialFit=153.293
- `fitRecord`: plutoCharonDiagInput=— / charonGeoToy3=— / plutoCharonInertial=— / plutoCharonInertialFit=(宣言あり)
- `integrator`: plutoCharonDiagInput=leapfrog / charonGeoToy3=— / plutoCharonInertial=leapfrog / plutoCharonInertialFit=leapfrog
- `scaleExp`: plutoCharonDiagInput=(宣言あり) / charonGeoToy3=(宣言あり) / plutoCharonInertial=(宣言あり) / plutoCharonInertialFit=(宣言あり)
- `timeRef`: plutoCharonDiagInput=(宣言あり) / charonGeoToy3=(宣言あり) / plutoCharonInertial=(宣言あり) / plutoCharonInertialFit=(宣言あり)
- `sampleClass`: plutoCharonDiagInput=calibration / charonGeoToy3=principle / plutoCharonInertial=principle / plutoCharonInertialFit=principle
- `calVariant`: plutoCharonDiagInput=kf0 / charonGeoToy3=— / plutoCharonInertial=— / plutoCharonInertialFit=—
- `familyRole`: plutoCharonDiagInput=primary / charonGeoToy3=variant / plutoCharonInertial=variant / plutoCharonInertialFit=variant
- `bodies(vs 基準)`: plutoCharonDiagInput=基準 / charonGeoToy3=違う入力(質量・位置・速度) / plutoCharonInertial=同じ入力 / plutoCharonInertialFit=同じ入力

**統廃合の候補**(実行ではない):

| 規則 | 残す | 畳む | どう | 理由 |
|---|---|---|---|---|
| A | `plutoCharonDiagInput` | `plutoCharonInertial` | 器の中の写し(走行設定)として残し、内蔵 ID は畳む | bodies(質量・位置・速度)が plutoCharonDiagInput と同じ・違うのは physics の geoPN・lambdaPN・relativeDrag |
| A | `plutoCharonDiagInput` | `plutoCharonInertialFit` | 器の中の写し(走行設定)として残し、内蔵 ID は畳む | bodies(質量・位置・速度)が plutoCharonDiagInput と同じ・違うのは physics の geoPN・lambdaPN・relativeDrag |

## 地球–月(現実との照合)(`earthmoon`・7 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🌘 | `earthMoonRealKF1` | variant | 比較(上のどれでもない) | 基準 | principle | — | 2 | 1 | 0.006 | 0.0000314447 | 8.2358 | — | — | — | kF1 の q 引きずりが作る近点回転の機構を旧フィットの記録で示す原理の参照 | — |
| 🌙 | `earthMoonReal` | primary | 主系列(較正母集団) | 違う入力(速度) | calibration・kf0 | ○ | 1 | 0 | 0.1 | — | 3 | — | — | — | 実単位の地球と月を kF0 で照合する | — |
| 🔆 | `emAuditSolar` | variant | 主系列(較正母集団) | 違う入力(本数・質量・位置・速度) | calibration・kf0 | ○ | 1 | 0 | 0.1 | — | 3 | — | — | — | 太陽摂動だけで月の近点回転を出す | `behavior.emAudit` |
| 🌓 | `earthMoonDiagOne` | variant | 診断(principle・「診断」) | 違う入力(速度) | principle | — | 1 | 0 | 0.006 | — | 8.2358 | — | — | — | 🌘 の初期状態のまま引きずりを表裏核の座標変換へ置き換える診断 | — |
| 🌛 | `earthMoonInertial` | variant | 診断(principle・geoPN=3) | 違う入力(速度) | principle | — | 3 | 0 | 0.1 | — | 3 | — | inertial | — | 慣性決定力の構造核で近点回転 8.85 年へ gain を推定し構造への感度を測る | — |
| 🌜 | `earthMoonTide` | variant | 診断(principle・「診断」) | 違う入力(速度) | principle | — | 1 | 0 | 0.1 | — | 3 | — | — | — | 定時間遅延の明示潮汐を宣言した本だけで走らせ自転の減速と帳簿を測る | — |
| 🌤️ | `earthMoonSunInertial` | variant | 診断(principle・geoPN=3) | 違う入力(本数・質量・位置・速度) | principle | — | 3 | 0 | 0.1 | — | 3 | — | inertial | — | 🌛 の gain を同じ SI 係数で移送し太陽摂動の下で月の近点周期を測る | — |

**鍵ごとの差**(physics の同じ鍵 19):

- `physics.D0`: earthMoonRealKF1=0.006 / earthMoonReal=0.1 / emAuditSolar=0.1 / earthMoonDiagOne=0.006 / earthMoonInertial=0.1 / earthMoonTide=0.1 / earthMoonSunInertial=0.1
- `physics.D0pull`: earthMoonRealKF1=0.0000314447 / earthMoonReal=— / emAuditSolar=— / earthMoonDiagOne=— / earthMoonInertial=— / earthMoonTide=— / earthMoonSunInertial=—
- `physics.frameWeight`: earthMoonRealKF1=— / earthMoonReal=share / emAuditSolar=share / earthMoonDiagOne=— / earthMoonInertial=share / earthMoonTide=share / earthMoonSunInertial=share
- `physics.geoPN`: earthMoonRealKF1=2 / earthMoonReal=1 / emAuditSolar=1 / earthMoonDiagOne=1 / earthMoonInertial=3 / earthMoonTide=1 / earthMoonSunInertial=3
- `physics.kFrame`: earthMoonRealKF1=1 / earthMoonReal=0 / emAuditSolar=0 / earthMoonDiagOne=0 / earthMoonInertial=0 / earthMoonTide=0 / earthMoonSunInertial=0
- `physics.lambdaPN`: earthMoonRealKF1=0 / earthMoonReal=1 / emAuditSolar=1 / earthMoonDiagOne=1 / earthMoonInertial=0 / earthMoonTide=1 / earthMoonSunInertial=0
- `physics.meshVelocity`: earthMoonRealKF1=— / earthMoonReal=— / emAuditSolar=— / earthMoonDiagOne={"law":"vMinusU","field":"explicit","mutual":0,"frame":{"origin":"barycenter","epoch":"🌘 t=0","rotation":"none","translation":"comoving"},"external":["body:0"]} / earthMoonInertial=— / earthMoonTide=— / earthMoonSunInertial=—
- `physics.q`: earthMoonRealKF1=8.2358 / earthMoonReal=3 / emAuditSolar=3 / earthMoonDiagOne=8.2358 / earthMoonInertial=3 / earthMoonTide=3 / earthMoonSunInertial=3
- `physics.qLock`: earthMoonRealKF1=— / earthMoonReal=— / emAuditSolar=— / earthMoonDiagOne={"kernel":"frontBack","epsC":0,"nodes":16} / earthMoonInertial=— / earthMoonTide=— / earthMoonSunInertial=—
- `physics.relativeDrag`: earthMoonRealKF1=— / earthMoonReal=— / emAuditSolar=— / earthMoonDiagOne=— / earthMoonInertial={"law":"inertial","gain":514182,"eps":0.1,"pairs":"all","history":"positions"} / earthMoonTide=— / earthMoonSunInertial={"law":"inertial","gain":51.4182,"eps":0.01,"pairs":[[1,2]],"history":"positions"}
- `physics.softening`: earthMoonRealKF1=0.1 / earthMoonReal=0.1 / emAuditSolar=0.01 / earthMoonDiagOne=0.1 / earthMoonInertial=0.1 / earthMoonTide=0.1 / earthMoonSunInertial=0.01
- `physics.stepDt`: earthMoonRealKF1=65.5721 / earthMoonReal=65.5721 / emAuditSolar=0.655721 / earthMoonDiagOne=65.5721 / earthMoonInertial=65.5721 / earthMoonTide=65.5721 / earthMoonSunInertial=0.655721
- `physics.tide`: earthMoonRealKF1=— / earthMoonReal=— / emAuditSolar=— / earthMoonDiagOne=— / earthMoonInertial=— / earthMoonTide={"model":"ctl","maxN":8,"velocity":"v","inertia":"half","split":"full"} / earthMoonSunInertial=—
- `fitRecord`: earthMoonRealKF1=(宣言あり) / earthMoonReal=— / emAuditSolar=— / earthMoonDiagOne=— / earthMoonInertial=— / earthMoonTide=— / earthMoonSunInertial=—
- `qLock`: earthMoonRealKF1=true / earthMoonReal=— / emAuditSolar=— / earthMoonDiagOne=— / earthMoonInertial=— / earthMoonTide=— / earthMoonSunInertial=—
- `scaleExp`: earthMoonRealKF1=(宣言あり) / earthMoonReal=(宣言あり) / emAuditSolar=(宣言あり) / earthMoonDiagOne=(宣言あり) / earthMoonInertial=(宣言あり) / earthMoonTide=(宣言あり) / earthMoonSunInertial=(宣言あり)
- `timeRef`: earthMoonRealKF1=(宣言あり) / earthMoonReal=(宣言あり) / emAuditSolar=(宣言あり) / earthMoonDiagOne=(宣言あり) / earthMoonInertial=(宣言あり) / earthMoonTide=(宣言あり) / earthMoonSunInertial=(宣言あり)
- `sampleClass`: earthMoonRealKF1=principle / earthMoonReal=calibration / emAuditSolar=calibration / earthMoonDiagOne=principle / earthMoonInertial=principle / earthMoonTide=principle / earthMoonSunInertial=principle
- `calVariant`: earthMoonRealKF1=— / earthMoonReal=kf0 / emAuditSolar=kf0 / earthMoonDiagOne=— / earthMoonInertial=— / earthMoonTide=— / earthMoonSunInertial=—
- `familyRole`: earthMoonRealKF1=variant / earthMoonReal=primary / emAuditSolar=variant / earthMoonDiagOne=variant / earthMoonInertial=variant / earthMoonTide=variant / earthMoonSunInertial=variant
- `gates(testId)`: earthMoonRealKF1=— / earthMoonReal=— / emAuditSolar=behavior.emAudit / earthMoonDiagOne=— / earthMoonInertial=— / earthMoonTide=— / earthMoonSunInertial=—
- `bodies(vs 基準)`: earthMoonRealKF1=基準 / earthMoonReal=違う入力(速度) / emAuditSolar=違う入力(本数・質量・位置・速度) / earthMoonDiagOne=違う入力(速度) / earthMoonInertial=違う入力(速度) / earthMoonTide=違う入力(速度) / earthMoonSunInertial=違う入力(本数・質量・位置・速度)

**統廃合の候補**(実行ではない):

| 規則 | 残す | 畳む | どう | 理由 |
|---|---|---|---|---|
| A | `earthMoonReal` | `earthMoonInertial` | 器の中の写し(走行設定)として残し、内蔵 ID は畳む | bodies(質量・位置・速度)が earthMoonReal と同じ・違うのは physics の geoPN・lambdaPN・relativeDrag |
| A | `earthMoonReal` | `earthMoonTide` | 器の中の写し(走行設定)として残し、内蔵 ID は畳む | bodies(質量・位置・速度)が earthMoonReal と同じ・違うのは physics の tide |
| A | `emAuditSolar` | `earthMoonSunInertial` | 器の中の写し(走行設定)として残し、内蔵 ID は畳む | bodies(質量・位置・速度)が emAuditSolar と同じ・違うのは physics の geoPN・lambdaPN・relativeDrag |

## 水星(現実との照合)(`mercury`・4 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ☄️ | `mercuryReal` | primary | 主系列(較正母集団) | 基準 | calibration・kf0 | ○ | 1 | 0 | 0.1 | — | 3 | — | — | — | 水星の近日点前進を kF0 で照合する | — |
| 🔁 | `mercuryGeoToy3` | variant | 診断(principle・「零」) | 同じ入力 | principle | — | 4 | 0 | 0.1 | — | 3 | — | — | vertex | 一様な座標変換で近点移動が変わらないかを geoPN=4 契約で確かめる | — |
| 🟤 | `mercurySunInertial` | variant | 診断(principle・geoPN=3) | 同じ入力 | principle | — | 3 | 0 | 0.1 | — | 3 | — | inertial | — | 🌛 の gain を同じ SI 係数で移送し水星の近点率と周期の応答を測る | — |
| 🟫 | `mercurySunInertialFit` | variant | 診断(principle・geoPN=3) | 同じ入力 | principle | — | 3 | 0 | 0.1 | — | 3 | — | inertial | — | 🟤 の写しで gain だけを近点率(43.0″/世紀・gain 0 対照との差)に合わせる | — |

**鍵ごとの差**(physics の同じ鍵 25):

- `physics.backgroundComplex`: mercuryReal=— / mercuryGeoToy3={"background":"declared","W0":1,"A0":[2.3,0],"gradW":[0,0],"gradA":[0,0,0,0],"dWdt":0,"dAdt":[0,0],"note":"第280便c: 一様な座標変換 u=V の零試験(点源 1 個の mutual:0 の場と同じ形)","sources":[{"id":"uniform-u","kind":"field","excludedExplicit":true}],"frame":{"origin":"barycenter","epoch":"t0(第280便c の診断コピー)","rotation":"none","translation":"comoving"}} / mercurySunInertial=— / mercurySunInertialFit=—
- `physics.geoPN`: mercuryReal=1 / mercuryGeoToy3=4 / mercurySunInertial=3 / mercurySunInertialFit=3
- `physics.lambdaPN`: mercuryReal=1 / mercuryGeoToy3=0 / mercurySunInertial=0 / mercurySunInertialFit=0
- `physics.meshVelocity`: mercuryReal=— / mercuryGeoToy3={"law":"vMinusU","field":"backgroundComplex","mutual":0,"frame":{"origin":"barycenter","epoch":"t0(第280便c の診断コピー)","rotation":"none","translation":"comoving"}} / mercurySunInertial=— / mercurySunInertialFit=—
- `physics.relativeDrag`: mercuryReal=— / mercuryGeoToy3=— / mercurySunInertial={"law":"inertial","gain":51.4182,"eps":0.05,"pairs":"all","history":"positions"} / mercurySunInertialFit={"law":"inertial","gain":0.004522415,"eps":0.05,"pairs":"all","history":"positions"}
- `physics.spaceMesh`: mercuryReal=— / mercuryGeoToy3={"mode":"vertex","gravity":false,"inertia":false,"lawVersion":"vMinusU","pn":"off","velocityMeaning":"v"} / mercurySunInertial=— / mercurySunInertialFit=—
- `fitRecord`: mercuryReal=— / mercuryGeoToy3=— / mercurySunInertial=— / mercurySunInertialFit=(宣言あり)
- `sampleClass`: mercuryReal=calibration / mercuryGeoToy3=principle / mercurySunInertial=principle / mercurySunInertialFit=principle
- `calVariant`: mercuryReal=kf0 / mercuryGeoToy3=— / mercurySunInertial=— / mercurySunInertialFit=—
- `familyRole`: mercuryReal=primary / mercuryGeoToy3=variant / mercurySunInertial=variant / mercurySunInertialFit=variant
- `bodies(vs 基準)`: mercuryReal=基準 / mercuryGeoToy3=同じ入力 / mercurySunInertial=同じ入力 / mercurySunInertialFit=同じ入力

**統廃合の候補**(実行ではない):

| 規則 | 残す | 畳む | どう | 理由 |
|---|---|---|---|---|
| A | `mercuryReal` | `mercuryGeoToy3` | 器の中の写し(走行設定)として残し、内蔵 ID は畳む | bodies(質量・位置・速度)が mercuryReal と同じ・違うのは physics の backgroundComplex・geoPN・lambdaPN・meshVelocity・spaceMesh |
| A | `mercuryReal` | `mercurySunInertial` | 器の中の写し(走行設定)として残し、内蔵 ID は畳む | bodies(質量・位置・速度)が mercuryReal と同じ・違うのは physics の geoPN・lambdaPN・relativeDrag |
| A | `mercuryReal` | `mercurySunInertialFit` | 器の中の写し(走行設定)として残し、内蔵 ID は畳む | bodies(質量・位置・速度)が mercuryReal と同じ・違うのは physics の geoPN・lambdaPN・relativeDrag |

## 土星(現実との照合)(`saturn`・4 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 💍 | `saturnRingReal` | primary | 主系列(較正母集団) | 基準 | calibration・kf0 | ○ | 1 | 0 | 0.1 | — | 3 | — | — | — | 実単位の土星の環を kF0 で照合する | `wave121.ui` |
| 📡 | `saturnZonalD68` | variant | 主系列(較正母集団) | 違う入力(本数・質量・位置・速度) | calibration・kf0 | ○ | 1 | 0 | 0.1 | — | 3 | — | — | — | 帯状重力係数で D68 の近点移動を照合する | `zonal.analytic-d68` `zonal.d68-preset` `zonal.d68-realunit` |
| 🧷 | `saturnD68Consistent` | variant | 診断(principle・「診断」) | 違う入力(本数・質量・位置・速度) | principle | — | 1 | 0 | 0.1 | — | 3 | — | — | — | 📡 の差を同じ窓で初速の幾何と他の要因に分ける | — |
| 📎 | `saturnD68ObsOrbit` | variant | 診断(principle・「診断」) | 違う入力(本数・質量・位置・速度) | principle | — | 1 | 0 | 0.1 | — | 3 | — | — | — | 観測の a と ae の定義で置いた D68 の近点移動を測る | — |

**鍵ごとの差**(physics の同じ鍵 25):

- `physics.contactMode`: saturnRingReal=none / saturnZonalD68=— / saturnD68Consistent=— / saturnD68ObsOrbit=—
- `physics.softening`: saturnRingReal=0.05 / saturnZonalD68=0.05 / saturnD68Consistent=0.01 / saturnD68ObsOrbit=0.01
- `physics.stepDt`: saturnRingReal=0.58 / saturnZonalD68=0.498 / saturnD68Consistent=0.498 / saturnD68ObsOrbit=0.498
- `timeRef`: saturnRingReal=(宣言あり) / saturnZonalD68=(宣言あり) / saturnD68Consistent=(宣言あり) / saturnD68ObsOrbit=(宣言あり)
- `sampleClass`: saturnRingReal=calibration / saturnZonalD68=calibration / saturnD68Consistent=principle / saturnD68ObsOrbit=principle
- `calVariant`: saturnRingReal=kf0 / saturnZonalD68=kf0 / saturnD68Consistent=— / saturnD68ObsOrbit=—
- `familyRole`: saturnRingReal=primary / saturnZonalD68=variant / saturnD68Consistent=variant / saturnD68ObsOrbit=variant
- `gates(testId)`: saturnRingReal=wave121.ui / saturnZonalD68=zonal.analytic-d68,zonal.d68-preset,zonal.d68-realunit / saturnD68Consistent=— / saturnD68ObsOrbit=—
- `bodies(vs 基準)`: saturnRingReal=基準 / saturnZonalD68=違う入力(本数・質量・位置・速度) / saturnD68Consistent=違う入力(本数・質量・位置・速度) / saturnD68ObsOrbit=違う入力(本数・質量・位置・速度)

**統廃合の候補**: 規則に当たる組は無い。

## 二重パルサー J0737−3039(`psrDoubleAB`・2 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 📻 | `psrDoubleAB` | primary | 主系列(較正母集団) | 基準 | calibration・kf0 | ○ | 1 | 0 | 0.006 | 3.24204e-7 | 3.1789 | — | — | — | 二重パルサーを kF0 で照合する | `behavior.psrDoubleAB` |
| 🩻 | `psrDoubleABGeoToy` | variant | 診断(principle・「診断」) | 同じ入力 | principle | — | 4 | 0 | 0.006 | — | 3.1789 | — | — | vertex | 観測質量のまま geoPN=4 則を当てる診断 | — |

**鍵ごとの差**(physics の同じ鍵 25):

- `physics.D0pull`: psrDoubleAB=3.24204e-7 / psrDoubleABGeoToy=—
- `physics.framePrecision`: psrDoubleAB=— / psrDoubleABGeoToy=double
- `physics.geoPN`: psrDoubleAB=1 / psrDoubleABGeoToy=4
- `physics.lambdaPN`: psrDoubleAB=1 / psrDoubleABGeoToy=0
- `physics.spaceMesh`: psrDoubleAB=— / psrDoubleABGeoToy={"mode":"vertex","gravity":false,"inertia":false,"lawVersion":"local"}
- `physics.stepDt`: psrDoubleAB=2.45404 / psrDoubleABGeoToy=0.153377
- `timeRef`: psrDoubleAB=(宣言あり) / psrDoubleABGeoToy=(宣言あり)
- `sampleClass`: psrDoubleAB=calibration / psrDoubleABGeoToy=principle
- `calVariant`: psrDoubleAB=kf0 / psrDoubleABGeoToy=—
- `familyRole`: psrDoubleAB=primary / psrDoubleABGeoToy=variant
- `gates(testId)`: psrDoubleAB=behavior.psrDoubleAB / psrDoubleABGeoToy=—
- `bodies(vs 基準)`: psrDoubleAB=基準 / psrDoubleABGeoToy=同じ入力

**統廃合の候補**(実行ではない):

| 規則 | 残す | 畳む | どう | 理由 |
|---|---|---|---|---|
| A | `psrDoubleAB` | `psrDoubleABGeoToy` | 器の中の写し(走行設定)として残し、内蔵 ID は畳む | bodies(質量・位置・速度)が psrDoubleAB と同じ・違うのは physics の D0pull・framePrecision・geoPN・lambdaPN・spaceMesh・stepDt |

## パルサー J1757−1854(`psrJ1757`・1 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🧮 | `psrJ1757DFM` | — | 主系列(較正母集団) | 基準 | calibration・kf0 | ○ | 1 | 0 | 0.006 | 3.24204e-7 | 3.1726 | 1(f-fixed-1) | — | — | J1757 を観測質量(f=1)・geoPN=1 で照合 | — |

**鍵ごとの差**(physics の同じ鍵 31):

- `bodies(vs 基準)`: psrJ1757DFM=基準

**統廃合の候補**: 規則に当たる組は無い。

## パルサー J1946+2052(`psrJ1946`・1 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🩺 | `psrJ1946DFM` | — | 主系列(較正母集団) | 基準 | calibration・kf0 | ○ | 1 | 0 | 0.006 | 3.24204e-7 | 3.1856 | 1(f-fixed-1) | — | — | J1946 を観測質量(f=1)・geoPN=1 で照合 | — |

**鍵ごとの差**(physics の同じ鍵 31):

- `bodies(vs 基準)`: psrJ1946DFM=基準

**統廃合の候補**: 規則に当たる組は無い。

## パルサー B1534+12(`psrB1534`・1 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 📿 | `psrB1534` | primary | 主系列(較正母集団) | 基準 | calibration・kf0 | ○ | 1 | 0 | 0.006 | 3.24204e-7 | 3.1652 | — | — | — | B1534 の観測入力を kF0 で確かめる | — |

**鍵ごとの差**(physics の同じ鍵 31):

- `bodies(vs 基準)`: psrB1534=基準

**統廃合の候補**: 規則に当たる組は無い。

## 重力波 GW150914(`gw150914`・3 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🎐 | `gw150914` | primary | 主系列(較正母集団) | 基準 | calibration・kf0 | ○ | 0 | 0 | 0.006 | 3.24204e-13 | 3.2552 | — | — | — | GW150914 の合体前の基準状態を転写する | `behavior.gw150914` |
| ⏰ | `gw150914Merge4s` | variant | 主系列(較正母集団) | 同じ入力 | calibration・kf0 | ○ | 0 | 0 | 0.006 | 3.24204e-13 | 3.2552 | 1(f-fixed-1) | — | — | 放射の向きと量を宣言して約 4 秒の合体を回す | — |
| ⚛️ | `gw150914SpinDipole` | variant | 比較(上のどれでもない) | 同じ入力 | principle | — | 0 | 0 | 0.006 | 3.24204e-13 | 3.2552 | — | — | — | 合体直前で λ=1 のスピン双極子の強さを測る | — |

**鍵ごとの差**(physics の同じ鍵 30):

- `physics.petersDirection`: gw150914=— / gw150914Merge4s=tangential / gw150914SpinDipole=—
- `physics.petersGW`: gw150914=— / gw150914Merge4s=true / gw150914SpinDipole=—
- `physics.petersScale`: gw150914=— / gw150914Merge4s=0.1313 / gw150914SpinDipole=—
- `physics.spinSpin`: gw150914=— / gw150914Merge4s=1 / gw150914SpinDipole=1
- `fusion`: gw150914=— / gw150914Merge4s=(宣言あり) / gw150914SpinDipole=—
- `massCalibration`: gw150914=— / gw150914Merge4s=(宣言あり) / gw150914SpinDipole=—
- `thermal`: gw150914=— / gw150914Merge4s=tint / gw150914SpinDipole=—
- `sampleClass`: gw150914=calibration / gw150914Merge4s=calibration / gw150914SpinDipole=principle
- `calVariant`: gw150914=kf0 / gw150914Merge4s=kf0 / gw150914SpinDipole=—
- `familyRole`: gw150914=primary / gw150914Merge4s=variant / gw150914SpinDipole=variant
- `gates(testId)`: gw150914=behavior.gw150914 / gw150914Merge4s=— / gw150914SpinDipole=—
- `bodies(vs 基準)`: gw150914=基準 / gw150914Merge4s=同じ入力 / gw150914SpinDipole=同じ入力

**統廃合の候補**(実行ではない):

| 規則 | 残す | 畳む | どう | 理由 |
|---|---|---|---|---|
| C | — | `gw150914` `gw150914Merge4s` | 要裁定(1 本 + 法則の切替に畳めるか) | 同じ bodies・同じ派生値 kf0・違うのは physics の petersDirection・petersGW・petersScale・spinSpin |

## ケンタウルス座 α 星 AB(`alphaCen`・1 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ✨ | `alphaCenAB` | primary | 主系列(較正母集団) | 基準 | calibration・kf0 | ○ | 1 | 0 | 0.006 | 0.324204 | 4.6111 | — | — | — | α Cen AB を kF0 で照合する | `behavior.alphaCenAB` |

**鍵ごとの差**(physics の同じ鍵 28):

- `bodies(vs 基準)`: alphaCenAB=基準

**統廃合の候補**: 規則に当たる組は無い。

## シリウス AB(`sirius`・1 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🌟 | `siriusAB` | primary | 主系列(較正母集団) | 基準 | calibration・kf0 | ○ | 1 | 0 | 0.006 | 0.324204 | 4.6761 | — | — | — | シリウス AB を kF0 で照合する | `behavior.siriusAB` |

**鍵ごとの差**(physics の同じ鍵 28):

- `bodies(vs 基準)`: siriusAB=基準

**統廃合の候補**: 規則に当たる組は無い。

## 銀河回転(空間メッシュ・アナロジー)(`galaxyMesh`・3 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🎠 | `galaxyMeshSpiral` | — | 主系列(母集団の外の家族の基準の本) | 基準 | principle | — | 0 | 1 | 1.5 | — | 2 | — | — | — | 銀河の空間メッシュを局所場と物質線で表す | — |
| 🪁 | `galaxyMeshSpiralGeoToy` | — | 診断(principle・「コピー」) | 同じ入力 | principle | — | 4 | 0 | 1.5 | — | 2 | — | — | vertex | 🎠 の配置で法則だけ geoPN=4 に替えて比べる | — |
| 🌚 | `galaxyAnalogyBH` | — | 比較(上のどれでもない) | 違う入力(本数・質量・位置・速度) | principle | — | 4 | 0 | 1.5 | — | 2 | — | — | vertex | 中心 DFM 版 BH と恒星質量光学迷彩矮星を力学の質量要素に置いた銀河アナロジー | — |

**鍵ごとの差**(physics の同じ鍵 23):

- `physics.geoPN`: galaxyMeshSpiral=0 / galaxyMeshSpiralGeoToy=4 / galaxyAnalogyBH=4
- `physics.kFrame`: galaxyMeshSpiral=1 / galaxyMeshSpiralGeoToy=0 / galaxyAnalogyBH=0
- `physics.lambdaPN`: galaxyMeshSpiral=1 / galaxyMeshSpiralGeoToy=0 / galaxyAnalogyBH=0
- `physics.ledger`: galaxyMeshSpiral={"dragWork":true} / galaxyMeshSpiralGeoToy=— / galaxyAnalogyBH=—
- `physics.spaceMesh`: galaxyMeshSpiral=— / galaxyMeshSpiralGeoToy={"mode":"vertex","gravity":false,"inertia":false,"lawVersion":"scalar"} / galaxyAnalogyBH={"mode":"vertex","gravity":false,"inertia":false,"lawVersion":"scalar","centerSpin":"read"}
- `seed`: galaxyMeshSpiral=20260910 / galaxyMeshSpiralGeoToy=20260910 / galaxyAnalogyBH=20260925
- `bodies(vs 基準)`: galaxyMeshSpiral=基準 / galaxyMeshSpiralGeoToy=同じ入力 / galaxyAnalogyBH=違う入力(本数・質量・位置・速度)

**統廃合の候補**(実行ではない):

| 規則 | 残す | 畳む | どう | 理由 |
|---|---|---|---|---|
| A | `galaxyMeshSpiral` | `galaxyMeshSpiralGeoToy` | 器の中の写し(走行設定)として残し、内蔵 ID は畳む | bodies(質量・位置・速度)が galaxyMeshSpiral と同じ・違うのは physics の geoPN・kFrame・lambdaPN・ledger・spaceMesh |

## 銀河の回転曲線 4 本(`galaxyrot`・4 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🌌 | `galaxy` | primary | 主系列(母集団の外の家族の入口(primary)) | 基準 | composite | — | 0 | 1 | 1.5 | — | 2 | — | — | — | 中心天体の引きずりで外縁の回転が速まるかを測る | `claim.galaxy-outerboost` |
| 🎡 | `galaxyStd` | variant | 比較(上のどれでもない) | 同じ入力 | principle | — | 0 | 1 | 1.5 | — | 2 | — | — | — | 重力と引きずりだけで外縁の増速を測る基準 | `claim.galaxystd-outerboost` |
| 💫 | `galaxyGeo2` | variant | 比較(上のどれでもない) | 同じ入力 | principle | — | 2 | 1 | 1.5 | — | 2 | — | — | — | v−u 測地線則で外縁の増速を比べる | `claim.galaxygeo2-outerboost` |
| 🍳 | `galaxyDB` | variant | 比較(上のどれでもない) | 違う入力(本数・質量・位置・速度) | principle | — | 0 | 1 | 1.5 | — | 2 | — | — | — | 円盤の回転支持とバルジの分散支持を比べる | `claim.galaxydb-contrast` |

**鍵ごとの差**(physics の同じ鍵 18):

- `physics.contactCap`: galaxy=2 / galaxyStd=— / galaxyGeo2=2 / galaxyDB=—
- `physics.contactK`: galaxy=10 / galaxyStd=— / galaxyGeo2=10 / galaxyDB=—
- `physics.contactMode`: galaxy=none / galaxyStd=none / galaxyGeo2=none / galaxyDB=normal
- `physics.gammaN`: galaxy=0.4 / galaxyStd=0 / galaxyGeo2=0 / galaxyDB=0
- `physics.geoPN`: galaxy=0 / galaxyStd=0 / galaxyGeo2=2 / galaxyDB=0
- `physics.kRep`: galaxy=0.8 / galaxyStd=0 / galaxyGeo2=0 / galaxyDB=0
- `physics.kappaS`: galaxy=0.05 / galaxyStd=0 / galaxyGeo2=0 / galaxyDB=0
- `physics.lambdaPN`: galaxy=1 / galaxyStd=1 / galaxyGeo2=0 / galaxyDB=1
- `physics.muF`: galaxy=0.5 / galaxyStd=0 / galaxyGeo2=0 / galaxyDB=0
- `rays`: galaxy=(宣言あり) / galaxyStd=— / galaxyGeo2=— / galaxyDB=—
- `seed`: galaxy=20260727 / galaxyStd=20260727 / galaxyGeo2=20260727 / galaxyDB=20260804
- `timeRef`: galaxy=(宣言あり) / galaxyStd=(宣言あり) / galaxyGeo2=(宣言あり) / galaxyDB=(宣言あり)
- `sampleClass`: galaxy=composite / galaxyStd=principle / galaxyGeo2=principle / galaxyDB=principle
- `familyRole`: galaxy=primary / galaxyStd=variant / galaxyGeo2=variant / galaxyDB=variant
- `gates(testId)`: galaxy=claim.galaxy-outerboost / galaxyStd=claim.galaxystd-outerboost / galaxyGeo2=claim.galaxygeo2-outerboost / galaxyDB=claim.galaxydb-contrast
- `bodies(vs 基準)`: galaxy=基準 / galaxyStd=同じ入力 / galaxyGeo2=同じ入力 / galaxyDB=違う入力(本数・質量・位置・速度)

**統廃合の候補**: 規則に当たる組は無い。

## 球状星団 47 Tuc(`tuc47`・1 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🍇 | `tuc47` | primary | 主系列(母集団の外の家族の入口(primary)) | 基準 | principle | — | 0 | 0 | 0.006 | — | 2 | — | — | — | 47 Tuc の配置と速度を観測から転写する | — |

**鍵ごとの差**(physics の同じ鍵 26):

- `bodies(vs 基準)`: tuc47=基準

**統廃合の候補**: 規則に当たる組は無い。

## 渦巻銀河 NGC 3198(`ngc3198`・2 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🛞 | `ngc3198DFM` | primary | 主系列(母集団の外の家族の入口(primary)) | 基準 | principle | — | 0 | 1 | 0.006 | — | 2 | 1.9997320796514568(chi-law-v1-meanfield) | — | — | ハローなしの DFM で外縁速度を支える | — |
| 🌃 | `ngc3198` | variant | 診断(principle・「対照」) | 違う入力(本数・質量・位置・速度) | principle | — | 0 | 0 | 0.006 | — | 2 | — | — | — | 指数円盤と NFW ハローで回転を比べる | — |

**鍵ごとの差**(physics の同じ鍵 24):

- `physics.halo`: ngc3198DFM=— / ngc3198={"model":"nfw","cx":0,"cy":0,"rho0":0.002685,"rs":61.31}
- `physics.kFrame`: ngc3198DFM=1 / ngc3198=0
- `physics.stepDt`: ngc3198DFM=0.032 / ngc3198=0.048
- `massCalibration`: ngc3198DFM=(宣言あり) / ngc3198=—
- `timeRef`: ngc3198DFM=(宣言あり) / ngc3198=(宣言あり)
- `familyRole`: ngc3198DFM=primary / ngc3198=variant
- `bodies(vs 基準)`: ngc3198DFM=基準 / ngc3198=違う入力(本数・質量・位置・速度)

**統廃合の候補**: 規則に当たる組は無い。

## 形の玩具(中心なし)(`shapeToy`・4 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🔮 | `shapeToyCluster` | primary | 主系列(母集団の外の家族の入口(primary)) | 基準 | principle | — | 0 | 0 | 2 | — | 2 | — | — | — | 指定した 3D 正規分布を保つ参照模型 | — |
| 🥏 | `shapeToyDisk` | variant | 比較(上のどれでもない) | 同じ入力 | principle | — | 0 | 0 | 2 | — | 2 | — | — | — | 指定した薄い回転円盤を保つ参照模型 | — |
| 🧵 | `shapeToyArm` | variant | 比較(上のどれでもない) | 違う入力(位置・速度) | principle | — | 0 | 0 | 2 | — | 2 | — | — | — | 腕の軸に対する正規分布を保つ参照模型 | — |
| 🍭 | `shapeToySpiral` | variant | 比較(上のどれでもない) | 違う入力(本数・質量・位置・速度) | principle | — | 0 | 0 | 2 | — | 2 | — | — | — | 🥏 の円盤と 🧵 の幅を継いだ宣言の 2 本腕を保つ渦巻の参照模型(創発ではない) | — |

**鍵ごとの差**(physics の同じ鍵 25):

- `physics.shapeToy`: shapeToyCluster={"shape":"cluster","supply":"external-bath","omega0":0.1,"gamma":0.25,"sigma":36,"sigmaZ":36,"sigma0":36,"tauGrow":0,"center":"fixed","coupling":"prescribed","cx":0,"cy":0,"omegaSpin":0,"armLength":0,"armLength0":0} / shapeToyDisk={"shape":"disk","supply":"external-bath","omega0":0.01,"gamma":0.02,"sigma":44,"sigmaZ":14,"sigma0":44,"tauGrow":0,"center":"fixed","coupling":"prescribed","cx":0,"cy":0,"omegaSpin":0.05,"armLength":0,"armLength0":0} / shapeToyArm={"shape":"arm","supply":"external-bath","omega0":0.12,"gamma":0.24,"sigma":7.2,"sigmaZ":4.8,"sigma0":7.2,"tauGrow":0,"center":"fixed","coupling":"prescribed","cx":0,"cy":0,"omegaSpin":0,"armLength":120,"armLength0":120} / shapeToySpiral={"shape":"spiral","supply":"external-bath","omega0":0.01,"gamma":0.02,"sigma":44,"sigmaZ":14,"sigma0":44,"tauGrow":0,"center":"fixed","coupling":"prescribed","cx":0,"cy":0,"omegaSpin":0,"armLength":0,"armLength0":0,"spiral":{"nArm":2,"pitchDeg":20,"rMin":24,"rMax":144,"r0":24,"phi0Deg":0,"armWidth":7.2,"armSigmaZ":4.8,"armOmega0":0.12,"armGamma":0.24,"omegaP":0.05,"massRatio":2,"nDisk":300,"nArmParticles":150,"density":"uniform-s"}}
- `timeRef`: shapeToyCluster=(宣言あり) / shapeToyDisk=(宣言あり) / shapeToyArm=(宣言あり) / shapeToySpiral=(宣言あり)
- `familyRole`: shapeToyCluster=primary / shapeToyDisk=variant / shapeToyArm=variant / shapeToySpiral=variant
- `bodies(vs 基準)`: shapeToyCluster=基準 / shapeToyDisk=同じ入力 / shapeToyArm=違う入力(位置・速度) / shapeToySpiral=違う入力(本数・質量・位置・速度)

**統廃合の候補**: 規則に当たる組は無い。

## 形の玩具(中心天体つき)(`shapeToyCore`・4 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🎱 | `shapeToyClusterCore` | primary | 主系列(母集団の外の家族の入口(primary)) | 基準 | principle | — | 0 | 0 | 2 | — | 2 | — | — | — | 中心スピンに依存する力学で星団を束ねる | — |
| 📀 | `shapeToyDiskCore` | variant | 比較(上のどれでもない) | 同じ入力 | principle | — | 0 | 0 | 2 | — | 2 | — | — | — | 中心スピンから薄さと円盤の回転を作る | — |
| 🧹 | `shapeToyArmCore` | variant | 比較(上のどれでもない) | 違う入力(速度) | principle | — | 0 | 0 | 2 | — | 2 | — | — | — | 面内の自転軸に沿った棒を作る | — |
| 🎢 | `shapeToySpiralCore` | variant | 比較(上のどれでもない) | 違う入力(本数・質量・位置・速度) | principle | — | 0 | 0 | 2 | — | 2 | — | — | — | 📀 の Core 力学の円盤に規定運動の腕を載せた中心つき幾何参照(創発ではない) | — |

**鍵ごとの差**(physics の同じ鍵 27):

- `physics.shapeToy`: shapeToyClusterCore={"shape":"cluster","supply":"external-bath","omega0":0.1,"gamma":0.25,"sigma":36,"sigmaZ":36,"sigma0":36,"tauGrow":0,"center":"pinned","coupling":"prescribed","cx":0,"cy":0,"omegaSpin":0,"armLength":0,"armLength0":0,"law":"coreField","coreField":{"coreRc":125,"coreMass":10,"alpha":1.1,"beta":0.1,"axis":[0,0,1],"W0":0.00064,"temp":19.44,"omegaP":0,"init":"thermal","centreGravity":"phi","exchange":{"mode":"rotating-bath","rate":0.02,"capacity":20000}}} / shapeToyDiskCore={"shape":"disk","supply":"external-bath","omega0":0.01,"gamma":0.02,"sigma":44,"sigmaZ":14,"sigma0":44,"tauGrow":0,"center":"pinned","coupling":"prescribed","cx":0,"cy":0,"omegaSpin":0.05,"armLength":0,"armLength0":0,"law":"coreField","coreField":{"coreRc":160,"coreMass":10,"alpha":1.05,"beta":7.8,"axis":[0,0,1],"W0":0.0044921875,"temp":3.624,"omegaP":0.14,"init":"thermal","centreGravity":"phi","exchange":{"mode":"rotating-bath","rate":0.02,"capacity":20000}}} / shapeToyArmCore={"shape":"arm","supply":"external-bath","omega0":0.12,"gamma":0.24,"sigma":7.2,"sigmaZ":4.8,"sigma0":7.2,"tauGrow":0,"center":"pinned","coupling":"prescribed","cx":0,"cy":0,"omegaSpin":0,"armLength":120,"armLength0":120,"law":"coreField","coreField":{"coreRc":250,"coreMass":10,"alpha":2,"beta":0.0108,"axis":[1,0,0],"W0":0.00016,"temp":7.776,"omegaP":0,"init":"thermal","centreGravity":"phi","exchange":{"mode":"rotating-bath","rate":0.02,"capacity":20000}}} / shapeToySpiralCore={"shape":"spiral","supply":"external-bath","omega0":0.01,"gamma":0.02,"sigma":44,"sigmaZ":14,"sigma0":44,"tauGrow":0,"center":"pinned","coupling":"prescribed","cx":0,"cy":0,"omegaSpin":0,"armLength":0,"armLength0":0,"law":"coreField","coreField":{"coreRc":160,"coreMass":10,"alpha":1.05,"beta":7.8,"axis":[0,0,1],"W0":0.0044921875,"temp":3.624,"omegaP":0.14,"init":"thermal","centreGravity":"phi","exchange":{"mode":"rotating-bath","rate":0.02,"capacity":20000}},"spiral":{"nArm":2,"pitchDeg":20,"rMin":24,"rMax":144,"r0":24,"phi0Deg":0,"armWidth":7.2,"armSigmaZ":7.2,"armOmega0":0.12,"armGamma":0.24,"omegaP":0.14,"massRatio":2,"nDisk":300,"nArmParticles":150,"density":"uniform-s"}}
- `timeRef`: shapeToyClusterCore=(宣言あり) / shapeToyDiskCore=(宣言あり) / shapeToyArmCore=(宣言あり) / shapeToySpiralCore=(宣言あり)
- `familyRole`: shapeToyClusterCore=primary / shapeToyDiskCore=variant / shapeToyArmCore=variant / shapeToySpiralCore=variant
- `bodies(vs 基準)`: shapeToyClusterCore=基準 / shapeToyDiskCore=同じ入力 / shapeToyArmCore=違う入力(速度) / shapeToySpiralCore=違う入力(本数・質量・位置・速度)

**統廃合の候補**: 規則に当たる組は無い。

## 棒と腕(軸力・DFM の外)(`axisBar`・3 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🥢 | `axisBarStill` | primary | 主系列(母集団の外の家族の入口(primary)) | 基準 | principle | — | 0 | 1 | 1.5 | — | 2 | — | — | — | 回転のない円盤で軸への力が棒を作るかを見る | — |
| 🎏 | `axisBarArms` | variant | 比較(上のどれでもない) | 同じ入力 | principle | — | 0 | 1 | 1.5 | — | 2 | — | — | — | 回転する同じ円盤で内側の棒と外側の腕を見る | — |
| 🎚️ | `axisBarReach` | variant | 比較(上のどれでもない) | 同じ入力 | principle | — | 0 | 1 | 1.5 | — | 2 | — | — | — | 到達長だけを変えて棒の長さを比べる | — |

**鍵ごとの差**(physics の同じ鍵 24):

- `physics.axisForce`: axisBarStill={"A":300,"Rb":120,"rc":6,"axis":0,"source":0} / axisBarArms={"A":15,"Rb":110,"rc":6,"axis":0,"source":0,"omegaAxis":0.04} / axisBarReach={"A":300,"Rb":60,"rc":6,"axis":0,"source":0}
- `familyRole`: axisBarStill=primary / axisBarArms=variant / axisBarReach=variant
- `bodies(vs 基準)`: axisBarStill=基準 / axisBarArms=同じ入力 / axisBarReach=同じ入力

**統廃合の候補**: 規則に当たる組は無い。

## 超新星(`supernova`・2 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🥀 | `supernovaProg` | primary | 主系列(母集団の外の家族の入口(primary)) | 基準 | principle | — | 0 | 0 | 0.006 | — | 2 | — | — | — | ベテルギウスの前駆星状態を転写する | — |
| 🎇 | `supernovaCore` | variant | 比較(上のどれでもない) | 違う入力(質量) | principle | — | 0 | 1 | 2 | — | 2 | 2(chi-law-v1-transfer) | — | — | 1 つの星の殻放出と時計つきの核の残存を見せる | — |

**鍵ごとの差**(physics の同じ鍵 14):

- `physics.D0`: supernovaProg=0.006 / supernovaCore=2
- `physics.G`: supernovaProg=6.674 / supernovaCore=4
- `physics.cHeat`: supernovaProg=1 / supernovaCore=0.2
- `physics.cLight`: supernovaProg=29979.2458 / supernovaCore=30
- `physics.coupleSink`: supernovaProg=core / supernovaCore=reservoir
- `physics.etaRad`: supernovaProg=0 / supernovaCore=0.0016
- `physics.frameReaction`: supernovaProg=— / supernovaCore=pairReduced
- `physics.kFrame`: supernovaProg=0 / supernovaCore=1
- `physics.kappaT`: supernovaProg=7.425826474101849e-9 / supernovaCore=0.016666666666666666
- `physics.pRad`: supernovaProg=4 / supernovaCore=2
- `physics.softening`: supernovaProg=1 / supernovaCore=3
- `physics.stepDt`: supernovaProg=0.048 / supernovaCore=—
- `physics.timeScale`: supernovaProg=4 / supernovaCore=2
- `massCalibration`: supernovaProg=— / supernovaCore=(宣言あり)
- `scaleExp`: supernovaProg=(宣言あり) / supernovaCore=—
- `seed`: supernovaProg=20260901 / supernovaCore=20260907
- `thermal`: supernovaProg=— / supernovaCore=tint
- `timeRef`: supernovaProg=(宣言あり) / supernovaCore=(宣言あり)
- `familyRole`: supernovaProg=primary / supernovaCore=variant
- `bodies(vs 基準)`: supernovaProg=基準 / supernovaCore=違う入力(質量)

**統廃合の候補**: 規則に当たる組は無い。

## 白色矮星(`whiteDwarf`・2 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ⚪ | `whiteDwarfDFM` | primary | 主系列(母集団の外の家族の入口(primary)) | 基準 | principle | — | 0 | 1 | 2 | — | 2 | 2(chi-law-v1-transfer) | — | — | 殻が繰り返し剥がれて育ったコアが残る | — |
| 🔘 | `whiteDwarfBareDFM` | variant | 比較(上のどれでもない) | 同じ入力 | principle | — | 0 | 1 | 2 | — | 2 | 2(chi-law-v1-transfer) | — | — | 最後の殻が剥がれ Mc=M の終端を作る | — |

**鍵ごとの差**(physics の同じ鍵 26):

- `familyRole`: whiteDwarfDFM=primary / whiteDwarfBareDFM=variant
- `bodies(vs 基準)`: whiteDwarfDFM=基準 / whiteDwarfBareDFM=同じ入力

**統廃合の候補**: 規則に当たる組は無い。

## 土星(天体の機構)(`saturnToy`・2 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🪐 | `saturn` | primary | 主系列(母集団の外の家族の入口(primary)) | 基準 | composite | — | 0 | 1 | 2 | — | 2 | — | — | — | 氷粒の環が長時間残るかを測る | `behavior.saturn-kframe-control` `behavior.saturnExp` |
| 🎯 | `saturnLayered` | variant | 比較(上のどれでもない) | 同じ入力 | composite | — | 0 | 1 | 2 | — | 2 | — | — | — | 主星のコアと殻の差動が環に効くかを見る | `core.twolayer` |

**鍵ごとの差**(physics の同じ鍵 24):

- `seed`: saturn=— / saturnLayered=1501780989
- `familyRole`: saturn=primary / saturnLayered=variant
- `gates(testId)`: saturn=behavior.saturn-kframe-control,behavior.saturnExp / saturnLayered=core.twolayer
- `bodies(vs 基準)`: saturn=基準 / saturnLayered=同じ入力

**統廃合の候補**: 規則に当たる組は無い。

## 時計と重力(GR の較正)(`grcal`・4 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🛰️ | `grcal` | primary | 主系列(母集団の外の家族の入口(primary)) | 基準 | principle | — | 0 | 0 | 0 | — | 2 | — | — | — | 時計・光の偏向・遅延を 1 本の弱場則で出す | — |
| 🕰️ | `grcalGps` | variant | 比較(上のどれでもない) | 違う入力(本数・質量・位置・速度) | principle | — | 0 | 0 | 0 | — | 2 | — | — | — | GPS の時計差を重力項と速度項に分ける | `behavior.grcal3` |
| 🌟 | `grcalLight` | variant | 比較(上のどれでもない) | 違う入力(質量・位置・速度) | principle | — | 0 | 0 | 0 | — | 2 | — | — | — | 太陽縁の光の偏向を同じ場から出す | `behavior.grcal3` |
| ⏲️ | `grcalShapiro` | variant | 比較(上のどれでもない) | 違う入力(質量・位置・速度) | principle | — | 0 | 0 | 0 | — | 2 | — | — | — | 太陽の近くを往復する信号の遅れを見せる | `behavior.grcal3` |

**鍵ごとの差**(physics の同じ鍵 23):

- `physics.contactCap`: grcal=2 / grcalGps=0.01 / grcalLight=0.01 / grcalShapiro=0.01
- `physics.contactK`: grcal=10 / grcalGps=0.1 / grcalLight=0.1 / grcalShapiro=0.1
- `physics.kappaT`: grcal=0.0033333333333333335 / grcalGps=0.0002777777777777778 / grcalLight=0.0002777777777777778 / grcalShapiro=0.0002777777777777778
- `photonEmit`: grcal=— / grcalGps=— / grcalLight=(宣言あり) / grcalShapiro=(宣言あり)
- `rays`: grcal=(宣言あり) / grcalGps=— / grcalLight=(宣言あり) / grcalShapiro=(宣言あり)
- `timeRef`: grcal=(宣言あり) / grcalGps=(宣言あり) / grcalLight=(宣言あり) / grcalShapiro=(宣言あり)
- `familyRole`: grcal=primary / grcalGps=variant / grcalLight=variant / grcalShapiro=variant
- `gates(testId)`: grcal=— / grcalGps=behavior.grcal3 / grcalLight=behavior.grcal3 / grcalShapiro=behavior.grcal3
- `bodies(vs 基準)`: grcal=基準 / grcalGps=違う入力(本数・質量・位置・速度) / grcalLight=違う入力(質量・位置・速度) / grcalShapiro=違う入力(質量・位置・速度)

**統廃合の候補**: 規則に当たる組は無い。

## 光学迷彩矮星(`rotor`・3 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🕳️ | `rotorSolo` | primary | 主系列(母集団の外の家族の入口(primary)) | 基準 | principle | — | 0 | 1 | 2 | — | 2 | — | — | — | 単体の光学迷彩矮星の掻き出しと減光を測る | `behavior.rotorSolo` |
| 🪜 | `massLadder` | variant | 比較(上のどれでもない) | 違う入力(本数・質量・位置・速度) | composite | — | 0 | 1 | 1.5 | — | 2 | — | — | — | 暗い中心の力学質量を 3 段で比べる | `claim.massladder` |
| 🥚 | `selfRotor` | primary | 主系列(母集団の外の家族の入口(primary)) | 違う入力(本数・質量・位置・速度) | composite | — | 0 | 1 | 2 | — | 2 | — | — | — | 一様な雲から暗く回る中心が育つかを見る | `behavior.selfrotor` `behavior.selfrotor-multiseed` |

**鍵ごとの差**(physics の同じ鍵 13):

- `physics.D0`: rotorSolo=2 / massLadder=1.5 / selfRotor=2
- `physics.G`: rotorSolo=0.25 / massLadder=0.8 / selfRotor=8
- `physics.bM`: rotorSolo=0.25 / massLadder=1 / selfRotor=1
- `physics.cHeat`: rotorSolo=1 / massLadder=1 / selfRotor=0.2
- `physics.contactCap`: rotorSolo=2 / massLadder=2 / selfRotor=—
- `physics.contactK`: rotorSolo=10 / massLadder=10 / selfRotor=—
- `physics.etaRad`: rotorSolo=0 / massLadder=0 / selfRotor=0.0016
- `physics.gammaN`: rotorSolo=0 / massLadder=0 / selfRotor=0.4
- `physics.kappaT`: rotorSolo=0.016666666666666666 / massLadder=0.02 / selfRotor=0.07142857142857142
- `physics.muF`: rotorSolo=0 / massLadder=0 / selfRotor=0.5
- `physics.pRad`: rotorSolo=4 / massLadder=4 / selfRotor=2
- `physics.softening`: rotorSolo=4 / massLadder=3 / selfRotor=3
- `physics.timeScale`: rotorSolo=4 / massLadder=3 / selfRotor=2
- `fusion`: rotorSolo=— / massLadder=— / selfRotor=(宣言あり)
- `rays`: rotorSolo=(宣言あり) / massLadder=— / selfRotor=—
- `seed`: rotorSolo=20260727 / massLadder=20260806 / selfRotor=20260806
- `thermal`: rotorSolo=— / massLadder=— / selfRotor=tint
- `timeRef`: rotorSolo=(宣言あり) / massLadder=(宣言あり) / selfRotor=(宣言あり)
- `sampleClass`: rotorSolo=principle / massLadder=composite / selfRotor=composite
- `familyRole`: rotorSolo=primary / massLadder=variant / selfRotor=primary
- `gates(testId)`: rotorSolo=behavior.rotorSolo / massLadder=claim.massladder / selfRotor=behavior.selfrotor,behavior.selfrotor-multiseed
- `bodies(vs 基準)`: rotorSolo=基準 / massLadder=違う入力(本数・質量・位置・速度) / selfRotor=違う入力(本数・質量・位置・速度)

**統廃合の候補**: 規則に当たる組は無い。

## 退役 33 本の棚卸し(統括の検証項目 R84)

> 退役は**フラグ**である(`familyRole:"retired"`)。内蔵(BUILTIN_PRESETS)から消していない —— 旧セーブ・履歴の正本・過去の記録が ID で参照する。サンプル一覧に出さず、開いたときに「退役(履歴)」の 1 行を出す。物理・署名・保存 JSON は変えていない。

| 絵文字 | ID | 内蔵に残る | 退役の印 | 署名(内蔵) | 署名(凍結の写し) |
|---|---|---|---|---|---|
| 🕶️ | `darkrotor` | ○ | ○ | b7698e31 | b7698e31 |
| ⚫ | `bhCore` | ○ | ○ | 21141de6 | 21141de6 |
| 🌑 | `nebulaRotor` | ○ | ○ | e6e33609 | e6e33609 |
| 🐚 | `nebulaShell` | ○ | ○ | 40fb7bfc | 40fb7bfc |
| ⏳ | `nebulaBipolar` | ○ | ○ | 5b233073 | 5b233073 |
| 🌱 | `starSeed` | ○ | ○ | 12a2fb3a | 12a2fb3a |
| 🪩 | `bhCoreTilt` | ○ | ○ | be90c82f | be90c82f |
| 🎋 | `galaxyMeshSpiralGeoToyLite` | ○ | ○ | 4bbd4446 | 9f910293 |
| 🪶 | `psrDoubleABPN` | ○ | ○ | 73202193 | c794a498 |
| 🪃 | `psrJ1757PN` | ○ | ○ | eae3ad89 | 7132210b |
| 🪀 | `psrJ1946PN` | ○ | ○ | 971fc62b | cc595e3c |
| ⭕ | `emAuditNewton` | ○ | ○ | a573f11b | a573f11b |
| 🪝 | `psrDoubleABCF` | ○ | ○ | d8a175e6 | 8767377 |
| 🪄 | `psrJ1757CF` | ○ | ○ | 67328148 | 12797269 |
| 🩹 | `psrJ1946CF` | ○ | ○ | 159233c1 | f8600f7c |
| 🪤 | `psrB1534CF` | ○ | ○ | 67d471cb | 84820b4 |

- **ゲートから外した長走行**: `darkrotorMidNew`・`darkrotorMidOld`・`darkrotorLong`・`darkrotorMultiseed`(保存 QA の worker の所要の和 341.6 s)と、その結果を読む試験 `behavior.darkrotor`・`behavior.darkrotorLong`・`behavior.darkrotor-pitch`・`behavior.darkrotor-multiseed`。最後の保存 QA の値は凍結の写しの history に転記した(測り直していない)。
- **機構の最小試験**(ゲートに残す 1 点ずつ): コアの交換(殻のスピン移送) = `claim.bhcore-selfdrive`(bhCore) / 傾斜(コア軸の横倒しで Jz が機械ゼロ・減光は保つ) = `behavior.templates229`(bhCoreTilt) / 減光(暗いコアと明るい外層のコントラスト) = `claim.nebularotor-contrast`(nebulaRotor) / パワーボール(圧縮と軸仕事の経路) = `claim.starseed-powerball`(starSeed)。
- **第284便b の写し** `tests/fixtures/retired-w284b.json`(原仮定者の裁定(第74報)⑤・AN35): 退役 6 本(`galaxyMeshSpiralGeoToyLite` `psrDoubleABPN` `psrJ1757PN` `psrJ1946PN` `emAuditNewton` `psrDoubleABCF`)と、f=1 へ移した本の旧則(`psrDoubleABDFM` —— f≈2 の条件つき較正・履歴)。付け替えた試験の最後の保存 QA の値: `behavior.psrDoubleAB`・`behavior.w249a-pnResponse`・`behavior.compactForce`・`behavior.calibrationForecast`。
- **第285便f の写し** `tests/fixtures/retired-w285f.json`(原仮定者の裁定(第75報)AN51・AN24′): 退役 1 本(`psrJ1757CF`)と、f=1 へ移した本の旧則(`psrJ1757DFM` —— f≈2 の条件つき較正・履歴)。付け替えた試験の最後の保存 QA の値: `lint.precisionUlp`・`behavior.nsThreeStage`・`behavior.w249a-pnResponse`・`behavior.jointCalProtocol`。
- **第286便f の写し** `tests/fixtures/retired-w286f.json`(原仮定者の裁定(第76報)AN57): 退役 1 本(`psrJ1946CF`)と、f=1 へ移した本の旧則(`psrJ1946DFM` —— f≈2 の条件つき較正・履歴)。付け替えた試験の最後の保存 QA の値: `behavior.w249a-pnResponse`・`docs.j1946adoptPublished`・`docs.j1946Adopted`。
- **第287便b の写し** `tests/fixtures/retired-w287b.json`(原仮定者の裁定(第77報)AN62): 退役 1 本(`psrB1534CF`)と、f=1 へ移した本の旧則(`psrB1534DFM` —— f≈2 の条件つき較正・履歴)。付け替えた試験の最後の保存 QA の値: `lint.precisionUlp`・`behavior.nsThreeStage`。
- **名指しする器**(tests/*.mjs・tools/*.mjs —— QA 本体を除く 63 本): 凍結の写しを読む 2・再生成表の履歴 25・再生成表の現行 15・道具 4・表の外 17。QA 本体の出現数: darkrotor 144・bhCore 44・nebulaRotor 17・nebulaShell 14・nebulaBipolar 21・starSeed 15・bhCoreTilt 20・galaxyMeshSpiralGeoToyLite 25・psrDoubleABPN 20・psrJ1757PN 12・psrJ1946PN 14・emAuditNewton 34・psrDoubleABCF 13・psrJ1757CF 19・psrJ1946CF 20・psrB1534CF 19。

| 器 | 名指しする ID | 再生成表の段 | 扱い |
|---|---|---|---|
| `tests/exp-4-48.mjs` | darkrotor | — | 表の外(正本ではない) |
| `tests/exp-4-67.mjs` | darkrotor | h283b-exp-4-67(history) | 履歴(再生成しない) |
| `tests/exp-4-72.mjs` | darkrotor | h283b-exp-4-72(history) | 履歴(再生成しない) |
| `tests/exp-4-73.mjs` | darkrotor | h283b-exp-4-73(history) | 履歴(再生成しない) |
| `tests/exp-4-75.mjs` | nebulaRotor | h283b-exp-4-75(history) | 履歴(再生成しない) |
| `tests/exp-4-80.mjs` | bhCore | — | 表の外(正本ではない) |
| `tests/exp-4-81.mjs` | bhCore | — | 表の外(正本ではない) |
| `tests/exp-4-88.mjs` | darkrotor nebulaBipolar | h283b-exp-4-88(history) | 履歴(再生成しない) |
| `tests/exp-coreshell-theory.mjs` | bhCore nebulaShell | h283b-exp-coreshell-theory(history) | 履歴(再生成しない) |
| `tests/exp-coreshell.mjs` | bhCore nebulaShell starSeed | h283b-exp-coreshell(history) | 履歴(再生成しない) |
| `tests/exp-coreshell2.mjs` | bhCore nebulaShell | h283b-exp-coreshell2(history) | 履歴(再生成しない) |
| `tests/exp-coreshell3.mjs` | bhCore nebulaShell | h283b-exp-coreshell3(history) | 履歴(再生成しない) |
| `tests/exp-coreshell4.mjs` | bhCore nebulaShell | h283b-exp-coreshell4(history) | 履歴(再生成しない) |
| `tests/exp-coreshell5.mjs` | bhCore nebulaShell | h283b-exp-coreshell5(history) | 履歴(再生成しない) |
| `tests/exp-coreshell6.mjs` | nebulaShell | h283b-exp-coreshell6(history) | 履歴(再生成しない) |
| `tests/exp-coreshell7.mjs` | nebulaShell | h283b-exp-coreshell7(history) | 履歴(再生成しない) |
| `tests/exp-coreshell8.mjs` | nebulaShell | h283b-exp-coreshell8(history) | 履歴(再生成しない) |
| `tests/exp-coreshell9.mjs` | nebulaShell | h283b-exp-coreshell9(history) | 履歴(再生成しない) |
| `tests/exp-darkness.mjs` | darkrotor | h283b-exp-darkness(history) | 履歴(再生成しない) |
| `tests/exp-darkrotor.mjs` | darkrotor | h283b-exp-darkrotor(history) | 履歴(再生成しない) |
| `tests/exp-factors.mjs` | darkrotor | h283b-exp-factors(history) | 履歴(再生成しない) |
| `tests/exp-ureq.mjs` | darkrotor | h283b-exp-ureq(history) | 履歴(再生成しない) |
| `tests/exp-w248c.mjs` | darkrotor | — | 表の外(正本ではない) |
| `tests/exp-w249a.mjs` | psrDoubleABPN psrJ1757PN psrJ1946PN psrJ1946CF | — | 表の外(正本ではない) |
| `tests/exp-w249b-calaudit.mjs` | psrDoubleABPN psrJ1757PN psrJ1946PN emAuditNewton psrDoubleABCF psrJ1757CF psrJ1946CF psrB1534CF | calaudit(current) dt3(current) kf0(current) | 現行の段 |
| `tests/exp-w249c.mjs` | darkrotor | — | 表の外(正本ではない) |
| `tests/exp-w250a.mjs` | psrDoubleABPN psrJ1757PN psrJ1946PN psrJ1946CF | — | 表の外(正本ではない) |
| `tests/exp-w252a-boxbinary.mjs` | psrJ1946PN psrDoubleABCF psrJ1757CF psrJ1946CF psrB1534CF | — | 表の外(正本ではない) |
| `tests/exp-w252b-substep.mjs` | psrDoubleABPN psrJ1757PN psrJ1946PN psrDoubleABCF psrJ1757CF psrJ1946CF psrB1534CF | — | 表の外(正本ではない) |
| `tests/exp-w253b-a0sweep.mjs` | psrJ1946PN psrJ1946CF | — | 表の外(正本ではない) |
| `tests/exp-w257c-mesh.mjs` | starSeed | — | 表の外(正本ではない) |
| `tests/exp-w258e-jitprobe.mjs` | bhCore | — | 道具(正本を書かない) |
| `tests/exp-w262b-migrate.mjs` | bhCoreTilt | h283b-exp-w262b-migrate(history) | 履歴(再生成しない) |
| `tests/exp-w262c-v2delta.mjs` | psrJ1946PN psrJ1946CF | — | 表の外(正本ではない) |
| `tests/exp-w263b-beui.mjs` | bhCore | — | 表の外(正本ではない) |
| `tests/exp-w263c-obsintake.mjs` | psrDoubleABPN psrJ1757PN psrJ1946PN psrDoubleABCF psrJ1757CF psrJ1946CF psrB1534CF | obsintake(current) | 現行の段 |
| `tests/exp-w264c-benums.mjs` | bhCore | — | 表の外(正本ではない) |
| `tests/exp-w265d-lfbot.mjs` | bhCore | h283b-exp-w265d-lfbot(history) | 履歴(再生成しない) |
| `tests/exp-w270c-j1946adopt.mjs` | psrJ1946PN psrJ1946CF | j1946adopt(history) | 履歴(再生成しない) |
| `tests/exp-w272a-issues.mjs` | emAuditNewton | issues(current) | 現行の段 |
| `tests/exp-w274c-galaxylite.mjs` | galaxyMeshSpiralGeoToyLite | galaxylite(current) | 現行の段 |
| `tests/exp-w275b-d0audit.mjs` | galaxyMeshSpiralGeoToyLite psrDoubleABPN psrJ1757PN psrJ1946PN psrDoubleABCF psrJ1757CF psrJ1946CF psrB1534CF | d0audit(current) | 現行の段 |
| `tests/exp-w275c-galaxyprof2.mjs` | galaxyMeshSpiralGeoToyLite | galaxyprof2(current) | 現行の段 |
| `tests/exp-w276a-bgpredict.mjs` | galaxyMeshSpiralGeoToyLite psrDoubleABPN psrJ1757PN psrJ1946PN psrDoubleABCF psrJ1757CF psrJ1946CF psrB1534CF | bgpredict(current) | 現行の段 |
| `tests/exp-w280a-mercury.mjs` | psrDoubleABPN psrJ1757PN psrJ1946PN emAuditNewton psrDoubleABCF psrJ1757CF psrJ1946CF psrB1534CF | mercury(current) | 現行の段 |
| `tests/exp-w280c-geo3.mjs` | psrDoubleABPN psrJ1757PN psrJ1946PN emAuditNewton psrDoubleABCF psrJ1757CF psrJ1946CF psrB1534CF | geo3(current) | 現行の段 |
| `tests/exp-w281b-galaxychain.mjs` | galaxyMeshSpiralGeoToyLite | galaxychain(current) | 現行の段 |
| `tests/exp-w281c-rotorledger.mjs` | darkrotor | rotorledger(current) | 凍結の写しを読む |
| `tests/exp-w281e-canvasskin.mjs` | bhCore | — | 道具(正本を書かない) |
| `tests/exp-w282a-calcontract.mjs` | psrDoubleABPN psrDoubleABCF psrB1534CF | calcontract(current) | 現行の段 |
| `tests/exp-w282a-fmigration.mjs` | psrDoubleABPN psrJ1757PN psrJ1946PN emAuditNewton psrDoubleABCF psrJ1757CF psrJ1946CF psrB1534CF | fmigration(history) | 履歴(再生成しない) |
| `tests/exp-w282b-geo1.mjs` | psrDoubleABPN psrJ1757PN psrJ1946PN emAuditNewton psrDoubleABCF psrJ1757CF psrJ1946CF psrB1534CF | geo1(history) | 履歴(再生成しない) |
| `tests/exp-w282d-analogy.mjs` | bhCore galaxyMeshSpiralGeoToyLite | analogy(current) | 凍結の写しを読む |
| `tests/exp-w285d-obscompare.mjs` | psrDoubleABPN psrJ1757PN psrJ1946PN psrDoubleABCF psrJ1757CF psrJ1946CF psrB1534CF | obscompare(current) | 現行の段 |
| `tests/exp-w288d-spinprec.mjs` | bhCoreTilt | spinprec288(current) | 現行の段 |
| `tests/exp-w295b-geo4.mjs` | galaxyMeshSpiralGeoToyLite | geo4-295b(current) | 現行の段 |
| `tests/exp-w297a-refit.mjs` | psrDoubleABPN psrJ1757PN psrJ1946PN | refit-297a(current) | 現行の段 |
| `tests/lib-sigma-destinations.mjs` | psrDoubleABPN psrJ1757PN psrJ1946PN psrDoubleABCF psrJ1757CF psrJ1946CF psrB1534CF | — | 表の外(正本ではない) |
| `tests/lib-w270a-stoprule.mjs` | psrJ1946PN psrJ1946CF | — | 表の外(正本ではない) |
| `tests/lib-w279a-samplestatus.mjs` | bhCore bhCoreTilt | — | 表の外(正本ではない) |
| `tests/perf.mjs` | darkrotor bhCore nebulaRotor nebulaShell nebulaBipolar starSeed | — | 道具(正本を書かない) |
| `tests/probe-perf-floor.mjs` | starSeed | — | 道具(正本を書かない) |
| `tests/seeds.mjs` | darkrotor | h283b-seeds(history) | 履歴(再生成しない) |

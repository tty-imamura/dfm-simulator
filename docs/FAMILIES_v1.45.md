# 同一天体の家族の差分表と統廃合の候補(v1.45-b1・第283便b)

> **この文書は生成物である —— 手で直さない。** 器 `tests/exp-w283b-families.mjs` が、対象 html の内蔵プリセットを受理した後の実効 JSON(`validatePreset` の後)と、正本 `tests/out/calaudit-w249.json`(較正母集団)・凍結の写し `tests/fixtures/retired-w283b.json` から作る。QA `docs.families` が正本からこの文書を作り直して 1 字ずつ照合する。
> 原仮定者の裁定(第73報)④「同一天体の似た内容のサンプルを統廃合する(内容を比較して提案)」への対応(統括の検証項目 R85)。**ここに並ぶのは候補であって実行ではない** —— どの本を畳むかは原仮定者の裁定で決める。観測版と DFM 版は 1 ID にしない。

## 読み方

- **入力**: 家族の基準の本(表の「基準」)と比べて、bodies の本数・質量・位置・速度がすべて同じなら「同じ入力」、どれかが違えば「違う入力(違う欄)」。
- **推定の列**(規則による推定であって裁定ではない):
  - 履歴 = familyRole が "retired"(退役 —— 内蔵に残るが一覧に出ない)
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

- 家族 **23**・本 **89**(うち退役 31)・推定の列: 主系列 27・比較 21・診断 10・履歴 31。
- 候補: 規則 A 4・規則 B 0・規則 C(要裁定)1・畳まない組 0。

| 家族 | 本数 | 基準 | 主系列 | 比較 | 診断 | 履歴 | 候補 A/B/C | 畳まない組 |
|---|---|---|---|---|---|---|---|---|
| 冥王星–カロン(`pluto`) | 6 | `plutoCharonDiagInput` | 1 | 0 | 1 | 4 | 0/0/0 | 0 |
| 地球–月(現実との照合)(`earthmoon`) | 8 | `earthMoonRealKF1` | 2 | 2 | 2 | 2 | 1/0/0 | 0 |
| 水星(現実との照合)(`mercury`) | 3 | `mercuryRealKF1` | 1 | 0 | 1 | 1 | 1/0/0 | 0 |
| 土星(現実との照合)(`saturn`) | 5 | `saturnRingRealKF1` | 2 | 0 | 2 | 1 | 0/0/0 | 0 |
| 二重パルサー J0737−3039(`psrDoubleAB`) | 6 | `psrDoubleABDFM` | 1 | 0 | 1 | 4 | 1/0/0 | 0 |
| パルサー J1757−1854(`psrJ1757`) | 3 | `psrJ1757DFM` | 1 | 0 | 0 | 2 | 0/0/0 | 0 |
| パルサー J1946+2052(`psrJ1946`) | 3 | `psrJ1946DFM` | 1 | 0 | 0 | 2 | 0/0/0 | 0 |
| パルサー B1534+12(`psrB1534`) | 3 | `psrB1534` | 1 | 0 | 0 | 2 | 0/0/0 | 0 |
| 重力波 GW150914(`gw150914`) | 4 | `gw150914DFM` | 2 | 1 | 0 | 1 | 0/0/1 | 0 |
| ケンタウルス座 α 星 AB(`alphaCen`) | 2 | `alphaCenABDFM` | 1 | 0 | 0 | 1 | 0/0/0 | 0 |
| シリウス AB(`sirius`) | 2 | `siriusABDFM` | 1 | 0 | 0 | 1 | 0/0/0 | 0 |
| 銀河回転(空間メッシュ・アナロジー)(`galaxyMesh`) | 4 | `galaxyMeshSpiral` | 1 | 0 | 2 | 1 | 1/0/0 | 0 |
| 銀河の回転曲線 4 本(`galaxyrot`) | 4 | `galaxy` | 1 | 3 | 0 | 0 | 0/0/0 | 0 |
| 球状星団 47 Tuc(`tuc47`) | 2 | `tuc47` | 1 | 0 | 0 | 1 | 0/0/0 | 0 |
| 渦巻銀河 NGC 3198(`ngc3198`) | 2 | `ngc3198DFM` | 1 | 0 | 1 | 0 | 0/0/0 | 0 |
| 形の玩具(中心なし)(`shapeToy`) | 4 | `shapeToyCluster` | 1 | 3 | 0 | 0 | 0/0/0 | 0 |
| 形の玩具(中心天体つき)(`shapeToyCore`) | 4 | `shapeToyClusterCore` | 1 | 3 | 0 | 0 | 0/0/0 | 0 |
| 棒と腕(軸力・DFM の外)(`axisBar`) | 3 | `axisBarStill` | 1 | 2 | 0 | 0 | 0/0/0 | 0 |
| 超新星(`supernova`) | 3 | `supernovaProg` | 1 | 1 | 0 | 1 | 0/0/0 | 0 |
| 白色矮星(`whiteDwarf`) | 2 | `whiteDwarfDFM` | 1 | 1 | 0 | 0 | 0/0/0 | 0 |
| 土星(天体の機構)(`saturnToy`) | 2 | `saturn` | 1 | 1 | 0 | 0 | 0/0/0 | 0 |
| 時計と重力(GR の較正)(`grcal`) | 4 | `grcal` | 1 | 3 | 0 | 0 | 0/0/0 | 0 |
| 光学迷彩矮星(退役の文脈)(`rotor`) | 10 | `rotorSolo` | 2 | 1 | 0 | 7 | 0/0/0 | 0 |

## 冥王星–カロン(`pluto`・6 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🥶 | `plutoCharonDiagInput` | primary | 主系列(較正母集団) | 基準 | calibration・kf0 | ○ | 1 | 0 | 0.006 | — | 11.9386 | — | — | — | 冥王星–カロンを 1 つの観測解に揃えた入力で照合する(❄️ の後継の入口) | — |
| 🌨️ | `plutoCharonKF0Control` | retired | 履歴(familyRole "retired") | 違う入力(位置・速度) | principle | — | 1 | 0 | 0.006 | — | 11.9386 | — | — | — | ⛄ と同じ入力で則だけを外した kF0 対照 | — |
| 🌒 | `charonGeoToy3` | variant | 診断(principle・geoPN=3) | 違う入力(質量・位置・速度) | principle | — | 3 | 0 | 0.006 | — | 11.9386 | — | — | vertex | 太陽の背景を置いた geoPN=3 契約の周期を kF0 と並べる | — |
| ❄️ | `plutoCharonReal` | retired | 履歴(familyRole "retired") | 違う入力(質量・位置・速度) | calibration・kf0 | — | 1 | 0 | 0.006 | — | 11.9386 | — | — | — | 旧入力の冥王星–カロンを照合する | `behavior.plutoCharonReal` |
| ⛄ | `plutoCharonDFM` | retired | 履歴(familyRole "retired") | 違う入力(位置・速度) | principle | — | 1 | 0 | 0.006 | — | 11.9386 | — | pairSlip | — | 同一観測解の二体に零条件つき引きずり則を載せる | `behavior.plutoCharonDFM` |
| ☃️ | `plutoCharonSyncZero` | retired | 履歴(familyRole "retired") | 違う入力(位置・速度) | principle | — | 0 | 0 | 0.006 | — | 11.9386 | — | pairSlip | — | 厳密同期円で相対すべり則の零条件を走行中も試す | — |

**鍵ごとの差**(physics の同じ鍵 25):

- `physics.backgroundComplex`: plutoCharonDiagInput=— / plutoCharonKF0Control=— / charonGeoToy3={"background":"declared","W0":5.6999875742828215e-9,"A0":[0,2.701885161114078e-9],"gradW":[-1.93009222560893e-15,0],"gradA":[0,0,-9.14894545995665e-16,0],"dWdt":0,"dAdt":[2.16837314607735e-16,0],"note":"第279便c の器(bgbudget2-w279c)と同じ値: 太陽の点質量を t=0・対の重心で評価(comoving)","refPos":[0,0],"sources":[{"id":"sun","kind":"body","excludedExplicit":true}],"frame":{"origin":"barycenter","epoch":"t0(第280便c の診断コピー)","rotation":"none","translation":"comoving"},"bgModel":"sources","ledger":[{"id":"sun","m":198849.99999999997,"x":-5906440.633928273,"y":0,"vx":0,"vy":0.4740159738776329,"ax":3.8041717070763564e-8,"ay":0}],"eps":0.05,"timeContract":{"mode":"sources","t0":0,"derivFrame":"frame","widthT":340000}} / plutoCharonReal=— / plutoCharonDFM=— / plutoCharonSyncZero=—
- `physics.geoPN`: plutoCharonDiagInput=1 / plutoCharonKF0Control=1 / charonGeoToy3=3 / plutoCharonReal=1 / plutoCharonDFM=1 / plutoCharonSyncZero=0
- `physics.massPrecision`: plutoCharonDiagInput=double / plutoCharonKF0Control=double / charonGeoToy3=— / plutoCharonReal=— / plutoCharonDFM=double / plutoCharonSyncZero=double
- `physics.meshVelocity`: plutoCharonDiagInput=— / plutoCharonKF0Control=— / charonGeoToy3={"law":"vMinusU","field":"backgroundComplex","mutual":0,"frame":{"origin":"barycenter","epoch":"t0(第280便c の診断コピー)","rotation":"none","translation":"comoving"}} / plutoCharonReal=— / plutoCharonDFM=— / plutoCharonSyncZero=—
- `physics.relativeDrag`: plutoCharonDiagInput=— / plutoCharonKF0Control=— / charonGeoToy3=— / plutoCharonReal=— / plutoCharonDFM={"law":"pairSlip","kappa":1,"W0":0,"pairs":"all","spins":"declared","integration":"midpoint"} / plutoCharonSyncZero={"law":"pairSlip","kappa":1,"W0":0,"pairs":"all","spins":"declared","integration":"midpoint"}
- `physics.softening`: plutoCharonDiagInput=0.01 / plutoCharonKF0Control=0.01 / charonGeoToy3=0.05 / plutoCharonReal=0.05 / plutoCharonDFM=0.01 / plutoCharonSyncZero=0.01
- `physics.spaceMesh`: plutoCharonDiagInput=— / plutoCharonKF0Control=— / charonGeoToy3={"mode":"vertex","gravity":false,"inertia":false,"lawVersion":"vMinusU","pn":"reference-1PN","pnVelocity":"v","velocityMeaning":"xdot"} / plutoCharonReal=— / plutoCharonDFM=— / plutoCharonSyncZero=—
- `integrator`: plutoCharonDiagInput=leapfrog / plutoCharonKF0Control=leapfrog / charonGeoToy3=— / plutoCharonReal=— / plutoCharonDFM=leapfrog / plutoCharonSyncZero=leapfrog
- `scaleExp`: plutoCharonDiagInput=(宣言あり) / plutoCharonKF0Control=(宣言あり) / charonGeoToy3=(宣言あり) / plutoCharonReal=(宣言あり) / plutoCharonDFM=(宣言あり) / plutoCharonSyncZero=(宣言あり)
- `sampleClass`: plutoCharonDiagInput=calibration / plutoCharonKF0Control=principle / charonGeoToy3=principle / plutoCharonReal=calibration / plutoCharonDFM=principle / plutoCharonSyncZero=principle
- `calVariant`: plutoCharonDiagInput=kf0 / plutoCharonKF0Control=— / charonGeoToy3=— / plutoCharonReal=kf0 / plutoCharonDFM=— / plutoCharonSyncZero=—
- `familyRole`: plutoCharonDiagInput=primary / plutoCharonKF0Control=retired / charonGeoToy3=variant / plutoCharonReal=retired / plutoCharonDFM=retired / plutoCharonSyncZero=retired
- `gates(testId)`: plutoCharonDiagInput=— / plutoCharonKF0Control=— / charonGeoToy3=— / plutoCharonReal=behavior.plutoCharonReal / plutoCharonDFM=behavior.plutoCharonDFM / plutoCharonSyncZero=—
- `bodies(vs 基準)`: plutoCharonDiagInput=基準 / plutoCharonKF0Control=違う入力(位置・速度) / charonGeoToy3=違う入力(質量・位置・速度) / plutoCharonReal=違う入力(質量・位置・速度) / plutoCharonDFM=違う入力(位置・速度) / plutoCharonSyncZero=違う入力(位置・速度)

**統廃合の候補**: 規則に当たる組は無い。

**履歴(退役)**: `plutoCharonKF0Control` `plutoCharonReal` `plutoCharonDFM` `plutoCharonSyncZero`

## 地球–月(現実との照合)(`earthmoon`・8 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🌘 | `earthMoonRealKF1` | variant | 比較(上のどれでもない) | 基準 | principle | — | 2 | 1 | 0.006 | 0.0000324204 | 8.2358 | — | — | — | kF1 の q 引きずりが作る近点回転の機構を旧フィットの記録で示す原理の参照 | — |
| 🌙 | `earthMoonReal` | primary | 主系列(較正母集団) | 違う入力(速度) | calibration・kf0 | ○ | 1 | 0 | 0.1 | — | 3 | — | — | — | 実単位の地球と月を kF0 で照合する | — |
| ⭕ | `emAuditNewton` | retired | 履歴(familyRole "retired") | 違う入力(速度) | principle | — | 1 | 0 | 0.1 | — | 3 | — | — | — | 純二体では月の近点回転が出ないことを示す | `behavior.emAudit` |
| 🧲 | `emAuditDFM` | retired | 履歴(familyRole "retired") | 違う入力(速度) | calibration・dfm | — | 2 | 1 | 0.006 | — | 8.2358 | — | — | — | 月の較正窓の一致が長期に続くかを調べる | `behavior.emAudit` |
| 🔆 | `emAuditSolar` | variant | 主系列(較正母集団) | 違う入力(本数・質量・位置・速度) | calibration・kf0 | ○ | 1 | 0 | 0.1 | — | 3 | — | — | — | 太陽摂動だけで月の近点回転を出す | `behavior.emAudit` |
| 🌓 | `earthMoonDiagOne` | variant | 診断(principle・「診断」) | 違う入力(速度) | principle | — | 1 | 0 | 0.006 | — | 8.2358 | — | — | — | 🌘 の初期状態のまま引きずりを表裏核の座標変換へ置き換える診断 | — |
| 🌛 | `earthMoonInertial` | variant | 比較(上のどれでもない) | 違う入力(速度) | principle | — | 0 | 0 | 0.1 | — | 3 | — | inertial | — | 慣性決定力の構造核で近点回転 8.85 年へ gain を推定し構造への感度を測る | — |
| 🌜 | `earthMoonTide` | variant | 診断(principle・「診断」) | 違う入力(速度) | principle | — | 1 | 0 | 0.1 | — | 3 | — | — | — | 定時間遅延の明示潮汐を宣言した本だけで走らせ自転の減速と帳簿を測る | — |

**鍵ごとの差**(physics の同じ鍵 17):

- `physics.D0`: earthMoonRealKF1=0.006 / earthMoonReal=0.1 / emAuditNewton=0.1 / emAuditDFM=0.006 / emAuditSolar=0.1 / earthMoonDiagOne=0.006 / earthMoonInertial=0.1 / earthMoonTide=0.1
- `physics.D0pull`: earthMoonRealKF1=0.0000324204 / earthMoonReal=— / emAuditNewton=— / emAuditDFM=— / emAuditSolar=— / earthMoonDiagOne=— / earthMoonInertial=— / earthMoonTide=—
- `physics.cLight`: earthMoonRealKF1=29979.2458 / earthMoonReal=29979.2458 / emAuditNewton=30000 / emAuditDFM=29979.2458 / emAuditSolar=29979.2458 / earthMoonDiagOne=29979.2458 / earthMoonInertial=29979.2458 / earthMoonTide=29979.2458
- `physics.frameWeight`: earthMoonRealKF1=— / earthMoonReal=share / emAuditNewton=share / emAuditDFM=share / emAuditSolar=share / earthMoonDiagOne=— / earthMoonInertial=share / earthMoonTide=share
- `physics.geoPN`: earthMoonRealKF1=2 / earthMoonReal=1 / emAuditNewton=1 / emAuditDFM=2 / emAuditSolar=1 / earthMoonDiagOne=1 / earthMoonInertial=0 / earthMoonTide=1
- `physics.kFrame`: earthMoonRealKF1=1 / earthMoonReal=0 / emAuditNewton=0 / emAuditDFM=1 / emAuditSolar=0 / earthMoonDiagOne=0 / earthMoonInertial=0 / earthMoonTide=0
- `physics.kappaT`: earthMoonRealKF1=7.425826474101849e-9 / earthMoonReal=7.425826474101849e-9 / emAuditNewton=7.415555555555556e-9 / emAuditDFM=7.425826474101849e-9 / emAuditSolar=7.425826474101849e-9 / earthMoonDiagOne=7.425826474101849e-9 / earthMoonInertial=7.425826474101849e-9 / earthMoonTide=7.425826474101849e-9
- `physics.meshVelocity`: earthMoonRealKF1=— / earthMoonReal=— / emAuditNewton=— / emAuditDFM=— / emAuditSolar=— / earthMoonDiagOne={"law":"vMinusU","field":"explicit","mutual":0,"frame":{"origin":"barycenter","epoch":"🌘 t=0","rotation":"none","translation":"comoving"},"external":["body:0"]} / earthMoonInertial=— / earthMoonTide=—
- `physics.q`: earthMoonRealKF1=8.2358 / earthMoonReal=3 / emAuditNewton=3 / emAuditDFM=8.2358 / emAuditSolar=3 / earthMoonDiagOne=8.2358 / earthMoonInertial=3 / earthMoonTide=3
- `physics.qLock`: earthMoonRealKF1=— / earthMoonReal=— / emAuditNewton=— / emAuditDFM=— / emAuditSolar=— / earthMoonDiagOne={"kernel":"frontBack","epsC":0,"nodes":16} / earthMoonInertial=— / earthMoonTide=—
- `physics.relativeDrag`: earthMoonRealKF1=— / earthMoonReal=— / emAuditNewton=— / emAuditDFM=— / emAuditSolar=— / earthMoonDiagOne=— / earthMoonInertial={"law":"inertial","gain":514182,"eps":0.1,"pairs":"all","history":"positions"} / earthMoonTide=—
- `physics.softening`: earthMoonRealKF1=0.1 / earthMoonReal=0.1 / emAuditNewton=0.1 / emAuditDFM=0.1 / emAuditSolar=0.01 / earthMoonDiagOne=0.1 / earthMoonInertial=0.1 / earthMoonTide=0.1
- `physics.tide`: earthMoonRealKF1=— / earthMoonReal=— / emAuditNewton=— / emAuditDFM=— / emAuditSolar=— / earthMoonDiagOne=— / earthMoonInertial=— / earthMoonTide={"model":"ctl","maxN":8,"velocity":"v","inertia":"half","split":"full"}
- `physics.timeScale`: earthMoonRealKF1=100 / earthMoonReal=100 / emAuditNewton=100 / emAuditDFM=100 / emAuditSolar=1 / earthMoonDiagOne=100 / earthMoonInertial=100 / earthMoonTide=100
- `qLock`: earthMoonRealKF1=true / earthMoonReal=— / emAuditNewton=— / emAuditDFM=true / emAuditSolar=— / earthMoonDiagOne=— / earthMoonInertial=— / earthMoonTide=—
- `scaleExp`: earthMoonRealKF1=(宣言あり) / earthMoonReal=(宣言あり) / emAuditNewton=(宣言あり) / emAuditDFM=(宣言あり) / emAuditSolar=(宣言あり) / earthMoonDiagOne=(宣言あり) / earthMoonInertial=(宣言あり) / earthMoonTide=(宣言あり)
- `sampleClass`: earthMoonRealKF1=principle / earthMoonReal=calibration / emAuditNewton=principle / emAuditDFM=calibration / emAuditSolar=calibration / earthMoonDiagOne=principle / earthMoonInertial=principle / earthMoonTide=principle
- `calVariant`: earthMoonRealKF1=— / earthMoonReal=kf0 / emAuditNewton=— / emAuditDFM=dfm / emAuditSolar=kf0 / earthMoonDiagOne=— / earthMoonInertial=— / earthMoonTide=—
- `familyRole`: earthMoonRealKF1=variant / earthMoonReal=primary / emAuditNewton=retired / emAuditDFM=retired / emAuditSolar=variant / earthMoonDiagOne=variant / earthMoonInertial=variant / earthMoonTide=variant
- `gates(testId)`: earthMoonRealKF1=— / earthMoonReal=— / emAuditNewton=behavior.emAudit / emAuditDFM=behavior.emAudit / emAuditSolar=behavior.emAudit / earthMoonDiagOne=— / earthMoonInertial=— / earthMoonTide=—
- `bodies(vs 基準)`: earthMoonRealKF1=基準 / earthMoonReal=違う入力(速度) / emAuditNewton=違う入力(速度) / emAuditDFM=違う入力(速度) / emAuditSolar=違う入力(本数・質量・位置・速度) / earthMoonDiagOne=違う入力(速度) / earthMoonInertial=違う入力(速度) / earthMoonTide=違う入力(速度)

**統廃合の候補**(実行ではない):

| 規則 | 残す | 畳む | どう | 理由 |
|---|---|---|---|---|
| A | `earthMoonReal` | `earthMoonTide` | 器の中の写し(走行設定)として残し、内蔵 ID は畳む | bodies(質量・位置・速度)が earthMoonReal と同じ・違うのは physics の tide |

**履歴(退役)**: `emAuditNewton` `emAuditDFM`

## 水星(現実との照合)(`mercury`・3 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🪨 | `mercuryRealKF1` | retired | 履歴(familyRole "retired") | 基準 | calibration・dfm | — | 2 | 1 | 0.006 | 0.00324204 | 6.1471 | — | — | — | 水星の近日点前進を kF1 で照合する | — |
| ☄️ | `mercuryReal` | primary | 主系列(較正母集団) | 同じ入力 | calibration・kf0 | ○ | 1 | 0 | 0.1 | — | 3 | — | — | — | 水星の近日点前進を kF0 で照合する | — |
| 🔁 | `mercuryGeoToy3` | variant | 診断(principle・geoPN=3) | 同じ入力 | principle | — | 3 | 0 | 0.1 | — | 3 | — | — | vertex | 一様な座標変換で近点移動が変わらないかを geoPN=3 契約で確かめる | — |

**鍵ごとの差**(physics の同じ鍵 21):

- `physics.D0`: mercuryRealKF1=0.006 / mercuryReal=0.1 / mercuryGeoToy3=0.1
- `physics.D0pull`: mercuryRealKF1=0.00324204 / mercuryReal=— / mercuryGeoToy3=—
- `physics.backgroundComplex`: mercuryRealKF1=— / mercuryReal=— / mercuryGeoToy3={"background":"declared","W0":1,"A0":[2.3,0],"gradW":[0,0],"gradA":[0,0,0,0],"dWdt":0,"dAdt":[0,0],"note":"第280便c: 一様な座標変換 u=V の零試験(点源 1 個の mutual:0 の場と同じ形)","sources":[{"id":"uniform-u","kind":"field","excludedExplicit":true}],"frame":{"origin":"barycenter","epoch":"t0(第280便c の診断コピー)","rotation":"none","translation":"comoving"}}
- `physics.frameWeight`: mercuryRealKF1=— / mercuryReal=share / mercuryGeoToy3=share
- `physics.geoPN`: mercuryRealKF1=2 / mercuryReal=1 / mercuryGeoToy3=3
- `physics.kFrame`: mercuryRealKF1=1 / mercuryReal=0 / mercuryGeoToy3=0
- `physics.meshVelocity`: mercuryRealKF1=— / mercuryReal=— / mercuryGeoToy3={"law":"vMinusU","field":"backgroundComplex","mutual":0,"frame":{"origin":"barycenter","epoch":"t0(第280便c の診断コピー)","rotation":"none","translation":"comoving"}}
- `physics.q`: mercuryRealKF1=6.1471 / mercuryReal=3 / mercuryGeoToy3=3
- `physics.spaceMesh`: mercuryRealKF1=— / mercuryReal=— / mercuryGeoToy3={"mode":"vertex","gravity":false,"inertia":false,"lawVersion":"vMinusU","pn":"reference-1PN","pnVelocity":"v","velocityMeaning":"v"}
- `qLock`: mercuryRealKF1=true / mercuryReal=— / mercuryGeoToy3=—
- `sampleClass`: mercuryRealKF1=calibration / mercuryReal=calibration / mercuryGeoToy3=principle
- `calVariant`: mercuryRealKF1=dfm / mercuryReal=kf0 / mercuryGeoToy3=—
- `familyRole`: mercuryRealKF1=retired / mercuryReal=primary / mercuryGeoToy3=variant
- `bodies(vs 基準)`: mercuryRealKF1=基準 / mercuryReal=同じ入力 / mercuryGeoToy3=同じ入力

**統廃合の候補**(実行ではない):

| 規則 | 残す | 畳む | どう | 理由 |
|---|---|---|---|---|
| A | `mercuryReal` | `mercuryGeoToy3` | 器の中の写し(走行設定)として残し、内蔵 ID は畳む | bodies(質量・位置・速度)が mercuryReal と同じ・違うのは physics の backgroundComplex・geoPN・meshVelocity・spaceMesh |

**履歴(退役)**: `mercuryRealKF1`

## 土星(現実との照合)(`saturn`・5 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 💿 | `saturnRingRealKF1` | retired | 履歴(familyRole "retired") | 基準 | calibration・dfm | — | 2 | 1 | 0.006 | 0.0000324204 | 20.4932 | — | — | — | 土星の環を kF1 と自動算出 q で照合する | — |
| 💍 | `saturnRingReal` | primary | 主系列(較正母集団) | 同じ入力 | calibration・kf0 | ○ | 1 | 0 | 0.1 | — | 3 | — | — | — | 実単位の土星の環を kF0 で照合する | `wave121.ui` |
| 📡 | `saturnZonalD68` | variant | 主系列(較正母集団) | 違う入力(本数・質量・位置・速度) | calibration・kf0 | ○ | 1 | 0 | 0.1 | — | 3 | — | — | — | 帯状重力係数で D68 の近点移動を照合する | `zonal.analytic-d68` `zonal.d68-preset` `zonal.d68-realunit` |
| 🧷 | `saturnD68Consistent` | variant | 診断(principle・「診断」) | 違う入力(本数・質量・位置・速度) | principle | — | 1 | 0 | 0.1 | — | 3 | — | — | — | 📡 の差を同じ窓で初速の幾何と他の要因に分ける | — |
| 📎 | `saturnD68ObsOrbit` | variant | 診断(principle・「診断」) | 違う入力(本数・質量・位置・速度) | principle | — | 1 | 0 | 0.1 | — | 3 | — | — | — | 観測の a と ae の定義で置いた D68 の近点移動を測る | — |

**鍵ごとの差**(physics の同じ鍵 18):

- `physics.D0`: saturnRingRealKF1=0.006 / saturnRingReal=0.1 / saturnZonalD68=0.1 / saturnD68Consistent=0.1 / saturnD68ObsOrbit=0.1
- `physics.D0pull`: saturnRingRealKF1=0.0000324204 / saturnRingReal=— / saturnZonalD68=— / saturnD68Consistent=— / saturnD68ObsOrbit=—
- `physics.contactMode`: saturnRingRealKF1=none / saturnRingReal=none / saturnZonalD68=— / saturnD68Consistent=— / saturnD68ObsOrbit=—
- `physics.frameWeight`: saturnRingRealKF1=— / saturnRingReal=share / saturnZonalD68=share / saturnD68Consistent=share / saturnD68ObsOrbit=share
- `physics.geoPN`: saturnRingRealKF1=2 / saturnRingReal=1 / saturnZonalD68=1 / saturnD68Consistent=1 / saturnD68ObsOrbit=1
- `physics.kFrame`: saturnRingRealKF1=1 / saturnRingReal=0 / saturnZonalD68=0 / saturnD68Consistent=0 / saturnD68ObsOrbit=0
- `physics.massFloor`: saturnRingRealKF1=1e-8 / saturnRingReal=0.000001 / saturnZonalD68=0.000001 / saturnD68Consistent=0.000001 / saturnD68ObsOrbit=0.000001
- `physics.q`: saturnRingRealKF1=20.4932 / saturnRingReal=3 / saturnZonalD68=3 / saturnD68Consistent=3 / saturnD68ObsOrbit=3
- `physics.softening`: saturnRingRealKF1=0.05 / saturnRingReal=0.05 / saturnZonalD68=0.05 / saturnD68Consistent=0.01 / saturnD68ObsOrbit=0.01
- `physics.timeScale`: saturnRingRealKF1=10 / saturnRingReal=10 / saturnZonalD68=3 / saturnD68Consistent=3 / saturnD68ObsOrbit=3
- `qLock`: saturnRingRealKF1=true / saturnRingReal=— / saturnZonalD68=— / saturnD68Consistent=— / saturnD68ObsOrbit=—
- `sampleClass`: saturnRingRealKF1=calibration / saturnRingReal=calibration / saturnZonalD68=calibration / saturnD68Consistent=principle / saturnD68ObsOrbit=principle
- `calVariant`: saturnRingRealKF1=dfm / saturnRingReal=kf0 / saturnZonalD68=kf0 / saturnD68Consistent=— / saturnD68ObsOrbit=—
- `familyRole`: saturnRingRealKF1=retired / saturnRingReal=primary / saturnZonalD68=variant / saturnD68Consistent=variant / saturnD68ObsOrbit=variant
- `gates(testId)`: saturnRingRealKF1=— / saturnRingReal=wave121.ui / saturnZonalD68=zonal.analytic-d68,zonal.d68-preset,zonal.d68-realunit / saturnD68Consistent=— / saturnD68ObsOrbit=—
- `bodies(vs 基準)`: saturnRingRealKF1=基準 / saturnRingReal=同じ入力 / saturnZonalD68=違う入力(本数・質量・位置・速度) / saturnD68Consistent=違う入力(本数・質量・位置・速度) / saturnD68ObsOrbit=違う入力(本数・質量・位置・速度)

**統廃合の候補**: 規則に当たる組は無い。

**履歴(退役)**: `saturnRingRealKF1`

## 二重パルサー J0737−3039(`psrDoubleAB`・6 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ⚡ | `psrDoubleABDFM` | retired | 履歴(familyRole "retired") | 基準 | calibration・dfm | — | 2 | 1 | 0.006 | 3.24204e-7 | 3.1789 | 1(f-fixed-1) | — | — | 二重パルサーを観測質量(f=1)と kF1 で照合 | `behavior.psrF1` |
| 📻 | `psrDoubleAB` | primary | 主系列(較正母集団) | 同じ入力 | calibration・kf0 | ○ | 1 | 0 | 0.006 | 3.24204e-7 | 3.1789 | — | — | — | 二重パルサーを kF0 で照合する | `behavior.psrDoubleAB` |
| 🧿 | `psrDoubleABSpinCal` | retired | 履歴(familyRole "retired") | 違う入力(質量) | calibration・dfm | — | 2 | 1 | 0.006 | 3.24204e-7 | 3.1789 | 1.999914(spin-spin-cal-v1) | — | — | f と λ を回した較正候補を比べる | — |
| 🪶 | `psrDoubleABPN` | retired | 履歴(familyRole "retired") | 違う入力(質量) | calibration・dfm | — | 2 | 1 | 0.006 | 3.24204e-7 | 3.1789 | 1.999942269345993(inertia-law-lin-v1) | — | — | 旧則(履歴)の 1PN の強さを 1/f で戻す応答候補 | — |
| 🪝 | `psrDoubleABCF` | retired | 履歴(familyRole "retired") | 違う入力(質量) | calibration・dfm | — | 2 | 1 | 0.006 | 3.24204e-7 | 3.1789 | 1.999942269345993(inertia-law-lin-v1) | — | — | 速度依存の追加力(案K)を試す | — |
| 🩻 | `psrDoubleABGeoToy` | variant | 診断(principle・geoPN=3) | 同じ入力 | principle | — | 3 | 0 | 0.006 | — | 3.1789 | — | — | vertex | 観測質量のまま geoPN=3 則を当てる診断 | — |

**鍵ごとの差**(physics の同じ鍵 23):

- `physics.D0pull`: psrDoubleABDFM=3.24204e-7 / psrDoubleAB=3.24204e-7 / psrDoubleABSpinCal=3.24204e-7 / psrDoubleABPN=3.24204e-7 / psrDoubleABCF=3.24204e-7 / psrDoubleABGeoToy=—
- `physics.cmGauge`: psrDoubleABDFM=barycentric / psrDoubleAB=— / psrDoubleABSpinCal=barycentric / psrDoubleABPN=barycentric / psrDoubleABCF=barycentric / psrDoubleABGeoToy=—
- `physics.compactForce`: psrDoubleABDFM=— / psrDoubleAB=— / psrDoubleABSpinCal=— / psrDoubleABPN=— / psrDoubleABCF={"model":"current","kappa":12.015360249506628,"chiGate":0.5,"rc":0} / psrDoubleABGeoToy=—
- `physics.coupleSink`: psrDoubleABDFM=reservoir / psrDoubleAB=reservoir / psrDoubleABSpinCal=core / psrDoubleABPN=core / psrDoubleABCF=core / psrDoubleABGeoToy=reservoir
- `physics.framePrecision`: psrDoubleABDFM=double / psrDoubleAB=— / psrDoubleABSpinCal=double / psrDoubleABPN=double / psrDoubleABCF=double / psrDoubleABGeoToy=double
- `physics.geoPN`: psrDoubleABDFM=2 / psrDoubleAB=1 / psrDoubleABSpinCal=2 / psrDoubleABPN=2 / psrDoubleABCF=2 / psrDoubleABGeoToy=3
- `physics.kFrame`: psrDoubleABDFM=1 / psrDoubleAB=0 / psrDoubleABSpinCal=1 / psrDoubleABPN=1 / psrDoubleABCF=1 / psrDoubleABGeoToy=0
- `physics.lambdaPN`: psrDoubleABDFM=1 / psrDoubleAB=1 / psrDoubleABSpinCal=1 / psrDoubleABPN=0.5000144330801174 / psrDoubleABCF=1 / psrDoubleABGeoToy=1
- `physics.spaceMesh`: psrDoubleABDFM=— / psrDoubleAB=— / psrDoubleABSpinCal=— / psrDoubleABPN=— / psrDoubleABCF=— / psrDoubleABGeoToy={"mode":"vertex","gravity":false,"inertia":false,"lawVersion":"local"}
- `physics.spinSpin`: psrDoubleABDFM=— / psrDoubleAB=— / psrDoubleABSpinCal=100000000000 / psrDoubleABPN=— / psrDoubleABCF=— / psrDoubleABGeoToy=—
- `massCalibration`: psrDoubleABDFM=(宣言あり) / psrDoubleAB=— / psrDoubleABSpinCal=(宣言あり) / psrDoubleABPN=(宣言あり) / psrDoubleABCF=(宣言あり) / psrDoubleABGeoToy=—
- `sampleClass`: psrDoubleABDFM=calibration / psrDoubleAB=calibration / psrDoubleABSpinCal=calibration / psrDoubleABPN=calibration / psrDoubleABCF=calibration / psrDoubleABGeoToy=principle
- `calVariant`: psrDoubleABDFM=dfm / psrDoubleAB=kf0 / psrDoubleABSpinCal=dfm / psrDoubleABPN=dfm / psrDoubleABCF=dfm / psrDoubleABGeoToy=—
- `familyRole`: psrDoubleABDFM=retired / psrDoubleAB=primary / psrDoubleABSpinCal=retired / psrDoubleABPN=retired / psrDoubleABCF=retired / psrDoubleABGeoToy=variant
- `gates(testId)`: psrDoubleABDFM=behavior.psrF1 / psrDoubleAB=behavior.psrDoubleAB / psrDoubleABSpinCal=— / psrDoubleABPN=— / psrDoubleABCF=— / psrDoubleABGeoToy=—
- `bodies(vs 基準)`: psrDoubleABDFM=基準 / psrDoubleAB=同じ入力 / psrDoubleABSpinCal=違う入力(質量) / psrDoubleABPN=違う入力(質量) / psrDoubleABCF=違う入力(質量) / psrDoubleABGeoToy=同じ入力

**統廃合の候補**(実行ではない):

| 規則 | 残す | 畳む | どう | 理由 |
|---|---|---|---|---|
| A | `psrDoubleAB` | `psrDoubleABGeoToy` | 器の中の写し(走行設定)として残し、内蔵 ID は畳む | bodies(質量・位置・速度)が psrDoubleAB と同じ・違うのは physics の D0pull・framePrecision・geoPN・spaceMesh |

**履歴(退役)**: `psrDoubleABDFM` `psrDoubleABSpinCal` `psrDoubleABPN` `psrDoubleABCF`

## パルサー J1757−1854(`psrJ1757`・3 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🧮 | `psrJ1757DFM` | — | 主系列(較正母集団) | 基準 | calibration・kf0 | ○ | 1 | 0 | 0.006 | 3.24204e-7 | 3.1726 | 1(f-fixed-1) | — | — | J1757 を観測質量(f=1)・geoPN=1 で照合 | — |
| 🪃 | `psrJ1757PN` | retired | 履歴(familyRole "retired") | 違う入力(質量) | calibration・dfm | — | 2 | 1 | 0.006 | 3.24204e-7 | 3.1726 | 1.9998956627766773(inertia-law-lin-v1) | — | — | 旧則(履歴)の 1/f の応答候補を J1757 へ当てる | — |
| 🪄 | `psrJ1757CF` | retired | 履歴(familyRole "retired") | 違う入力(質量) | calibration・dfm | — | 2 | 1 | 0.006 | 3.24204e-7 | 3.1726 | 1.9998956627766773(inertia-law-lin-v1) | — | — | 凍結した κ を J1757 へ流す | — |

**鍵ごとの差**(physics の同じ鍵 26):

- `physics.compactForce`: psrJ1757DFM=— / psrJ1757PN=— / psrJ1757CF={"model":"current","kappa":12.015360249506628,"chiGate":0.5,"rc":0}
- `physics.coupleSink`: psrJ1757DFM=reservoir / psrJ1757PN=core / psrJ1757CF=core
- `physics.geoPN`: psrJ1757DFM=1 / psrJ1757PN=2 / psrJ1757CF=2
- `physics.kFrame`: psrJ1757DFM=0 / psrJ1757PN=1 / psrJ1757CF=1
- `physics.lambdaPN`: psrJ1757DFM=1 / psrJ1757PN=0.5000260856666837 / psrJ1757CF=1
- `massCalibration`: psrJ1757DFM=(宣言あり) / psrJ1757PN=(宣言あり) / psrJ1757CF=(宣言あり)
- `calVariant`: psrJ1757DFM=kf0 / psrJ1757PN=dfm / psrJ1757CF=dfm
- `familyRole`: psrJ1757DFM=— / psrJ1757PN=retired / psrJ1757CF=retired
- `bodies(vs 基準)`: psrJ1757DFM=基準 / psrJ1757PN=違う入力(質量) / psrJ1757CF=違う入力(質量)

**統廃合の候補**: 規則に当たる組は無い。

**履歴(退役)**: `psrJ1757PN` `psrJ1757CF`

## パルサー J1946+2052(`psrJ1946`・3 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🩺 | `psrJ1946DFM` | — | 主系列(較正母集団) | 基準 | calibration・kf0 | ○ | 1 | 0 | 0.006 | 3.24204e-7 | 3.1856 | 1(f-fixed-1) | — | — | J1946 を観測質量(f=1)・geoPN=1 で照合 | — |
| 🪀 | `psrJ1946PN` | retired | 履歴(familyRole "retired") | 違う入力(質量) | calibration・dfm | — | 2 | 1 | 0.006 | 3.24204e-7 | 3.1856 | 1.9999655295617553(inertia-law-lin-v1) | — | — | 旧則(履歴)の 1/f の応答候補を J1946 へ当てる | — |
| 🩹 | `psrJ1946CF` | retired | 履歴(familyRole "retired") | 違う入力(質量) | calibration・dfm | — | 2 | 1 | 0.006 | 3.24204e-7 | 3.1856 | 1.9999655295617553(inertia-law-lin-v1) | — | — | 凍結した κ を J1946 へ流す | — |

**鍵ごとの差**(physics の同じ鍵 26):

- `physics.compactForce`: psrJ1946DFM=— / psrJ1946PN=— / psrJ1946CF={"model":"current","kappa":12.015360249506628,"chiGate":0.5,"rc":0}
- `physics.coupleSink`: psrJ1946DFM=reservoir / psrJ1946PN=core / psrJ1946CF=core
- `physics.geoPN`: psrJ1946DFM=1 / psrJ1946PN=2 / psrJ1946CF=2
- `physics.kFrame`: psrJ1946DFM=0 / psrJ1946PN=1 / psrJ1946CF=1
- `physics.lambdaPN`: psrJ1946DFM=1 / psrJ1946PN=0.5000086177580901 / psrJ1946CF=1
- `massCalibration`: psrJ1946DFM=(宣言あり) / psrJ1946PN=(宣言あり) / psrJ1946CF=(宣言あり)
- `calVariant`: psrJ1946DFM=kf0 / psrJ1946PN=dfm / psrJ1946CF=dfm
- `familyRole`: psrJ1946DFM=— / psrJ1946PN=retired / psrJ1946CF=retired
- `bodies(vs 基準)`: psrJ1946DFM=基準 / psrJ1946PN=違う入力(質量) / psrJ1946CF=違う入力(質量)

**統廃合の候補**: 規則に当たる組は無い。

**履歴(退役)**: `psrJ1946PN` `psrJ1946CF`

## パルサー B1534+12(`psrB1534`・3 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 📿 | `psrB1534` | primary | 主系列(較正母集団) | 基準 | calibration・kf0 | ○ | 1 | 0 | 0.006 | 3.24204e-7 | 3.1652 | — | — | — | B1534 の観測入力を kF0 で確かめる | — |
| 🧶 | `psrB1534DFM` | retired | 履歴(familyRole "retired") | 同じ入力 | calibration・dfm | — | 2 | 1 | 0.006 | 3.24204e-7 | 3.1652 | 1(f-fixed-1) | — | — | B1534 を観測質量(f=1)と kF1 で照合 | — |
| 🪤 | `psrB1534CF` | retired | 履歴(familyRole "retired") | 違う入力(質量) | calibration・dfm | — | 2 | 1 | 0.006 | 3.24204e-7 | 3.1652 | 1.9994854557873434(inertia-law-lin-v1) | — | — | 凍結した κ を B1534 へ流す | — |

**鍵ごとの差**(physics の同じ鍵 27):

- `physics.compactForce`: psrB1534=— / psrB1534DFM=— / psrB1534CF={"model":"current","kappa":12.015360249506628,"chiGate":0.5,"rc":0}
- `physics.coupleSink`: psrB1534=core / psrB1534DFM=reservoir / psrB1534CF=core
- `physics.geoPN`: psrB1534=1 / psrB1534DFM=2 / psrB1534CF=2
- `physics.kFrame`: psrB1534=0 / psrB1534DFM=1 / psrB1534CF=1
- `massCalibration`: psrB1534=— / psrB1534DFM=(宣言あり) / psrB1534CF=(宣言あり)
- `calVariant`: psrB1534=kf0 / psrB1534DFM=dfm / psrB1534CF=dfm
- `familyRole`: psrB1534=primary / psrB1534DFM=retired / psrB1534CF=retired
- `bodies(vs 基準)`: psrB1534=基準 / psrB1534DFM=同じ入力 / psrB1534CF=違う入力(質量)

**統廃合の候補**: 規則に当たる組は無い。

**履歴(退役)**: `psrB1534DFM` `psrB1534CF`

## 重力波 GW150914(`gw150914`・4 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🎻 | `gw150914DFM` | retired | 履歴(familyRole "retired") | 基準 | calibration・dfm | — | 0 | 1 | 0.006 | 3.24204e-13 | 3.2552 | 1.9999999999889444(inertia-law-lin-v1) | — | — | GW150914 を kF1 と質量補正で回す | `behavior.gw150914` |
| 🎐 | `gw150914` | primary | 主系列(較正母集団) | 違う入力(質量) | calibration・kf0 | ○ | 0 | 0 | 0.006 | 3.24204e-13 | 3.2552 | — | — | — | GW150914 の合体前の基準状態を転写する | `behavior.gw150914` |
| ⏰ | `gw150914Merge4s` | variant | 主系列(較正母集団) | 違う入力(質量) | calibration・kf0 | ○ | 0 | 0 | 0.006 | 3.24204e-13 | 3.2552 | 1(f-fixed-1) | — | — | 放射の向きと量を宣言して約 4 秒の合体を回す | — |
| ⚛️ | `gw150914SpinDipole` | variant | 比較(上のどれでもない) | 違う入力(質量) | principle | — | 0 | 0 | 0.006 | 3.24204e-13 | 3.2552 | — | — | — | 合体直前で λ=1 のスピン双極子の強さを測る | — |

**鍵ごとの差**(physics の同じ鍵 28):

- `physics.kFrame`: gw150914DFM=1 / gw150914=0 / gw150914Merge4s=0 / gw150914SpinDipole=0
- `physics.ledger`: gw150914DFM={"dragWork":true} / gw150914=— / gw150914Merge4s=— / gw150914SpinDipole=—
- `physics.petersDirection`: gw150914DFM=— / gw150914=— / gw150914Merge4s=tangential / gw150914SpinDipole=—
- `physics.petersGW`: gw150914DFM=— / gw150914=— / gw150914Merge4s=true / gw150914SpinDipole=—
- `physics.petersScale`: gw150914DFM=— / gw150914=— / gw150914Merge4s=0.1313 / gw150914SpinDipole=—
- `physics.spinSpin`: gw150914DFM=— / gw150914=— / gw150914Merge4s=1 / gw150914SpinDipole=1
- `fusion`: gw150914DFM=— / gw150914=— / gw150914Merge4s=(宣言あり) / gw150914SpinDipole=—
- `massCalibration`: gw150914DFM=(宣言あり) / gw150914=— / gw150914Merge4s=(宣言あり) / gw150914SpinDipole=—
- `thermal`: gw150914DFM=— / gw150914=— / gw150914Merge4s=tint / gw150914SpinDipole=—
- `sampleClass`: gw150914DFM=calibration / gw150914=calibration / gw150914Merge4s=calibration / gw150914SpinDipole=principle
- `calVariant`: gw150914DFM=dfm / gw150914=kf0 / gw150914Merge4s=kf0 / gw150914SpinDipole=—
- `familyRole`: gw150914DFM=retired / gw150914=primary / gw150914Merge4s=variant / gw150914SpinDipole=variant
- `gates(testId)`: gw150914DFM=behavior.gw150914 / gw150914=behavior.gw150914 / gw150914Merge4s=— / gw150914SpinDipole=—
- `bodies(vs 基準)`: gw150914DFM=基準 / gw150914=違う入力(質量) / gw150914Merge4s=違う入力(質量) / gw150914SpinDipole=違う入力(質量)

**統廃合の候補**(実行ではない):

| 規則 | 残す | 畳む | どう | 理由 |
|---|---|---|---|---|
| C | — | `gw150914` `gw150914Merge4s` | 要裁定(1 本 + 法則の切替に畳めるか) | 同じ bodies・同じ派生値 kf0・違うのは physics の petersDirection・petersGW・petersScale・spinSpin |

**履歴(退役)**: `gw150914DFM`

## ケンタウルス座 α 星 AB(`alphaCen`・2 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ✴️ | `alphaCenABDFM` | retired | 履歴(familyRole "retired") | 基準 | calibration・dfm | — | 2 | 1 | 0.006 | 0.324204 | 4.6111 | 1(f-fixed-1) | — | — | 観測質量のまま kF1 を α Cen へ当てる | `behavior.alphaCenAB` |
| ✨ | `alphaCenAB` | primary | 主系列(較正母集団) | 同じ入力 | calibration・kf0 | ○ | 1 | 0 | 0.006 | 0.324204 | 4.6111 | — | — | — | α Cen AB を kF0 で照合する | `behavior.alphaCenAB` |

**鍵ごとの差**(physics の同じ鍵 25):

- `physics.cmGauge`: alphaCenABDFM=barycentric / alphaCenAB=—
- `physics.coupleSink`: alphaCenABDFM=reservoir / alphaCenAB=—
- `physics.geoPN`: alphaCenABDFM=2 / alphaCenAB=1
- `physics.kFrame`: alphaCenABDFM=1 / alphaCenAB=0
- `massCalibration`: alphaCenABDFM=(宣言あり) / alphaCenAB=—
- `calVariant`: alphaCenABDFM=dfm / alphaCenAB=kf0
- `familyRole`: alphaCenABDFM=retired / alphaCenAB=primary
- `bodies(vs 基準)`: alphaCenABDFM=基準 / alphaCenAB=同じ入力

**統廃合の候補**: 規則に当たる組は無い。

**履歴(退役)**: `alphaCenABDFM`

## シリウス AB(`sirius`・2 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 💫 | `siriusABDFM` | retired | 履歴(familyRole "retired") | 基準 | calibration・dfm | — | 2 | 1 | 0.006 | 0.324204 | 4.6761 | 1(f-fixed-1) | — | — | 観測質量のまま kF1 をシリウスへ当てる | `behavior.siriusAB` |
| 🌟 | `siriusAB` | primary | 主系列(較正母集団) | 同じ入力 | calibration・kf0 | ○ | 1 | 0 | 0.006 | 0.324204 | 4.6761 | — | — | — | シリウス AB を kF0 で照合する | `behavior.siriusAB` |

**鍵ごとの差**(physics の同じ鍵 25):

- `physics.cmGauge`: siriusABDFM=barycentric / siriusAB=—
- `physics.coupleSink`: siriusABDFM=reservoir / siriusAB=—
- `physics.geoPN`: siriusABDFM=2 / siriusAB=1
- `physics.kFrame`: siriusABDFM=1 / siriusAB=0
- `massCalibration`: siriusABDFM=(宣言あり) / siriusAB=—
- `calVariant`: siriusABDFM=dfm / siriusAB=kf0
- `familyRole`: siriusABDFM=retired / siriusAB=primary
- `bodies(vs 基準)`: siriusABDFM=基準 / siriusAB=同じ入力

**統廃合の候補**: 規則に当たる組は無い。

**履歴(退役)**: `siriusABDFM`

## 銀河回転(空間メッシュ・アナロジー)(`galaxyMesh`・4 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🎠 | `galaxyMeshSpiral` | — | 主系列(母集団の外の家族の基準の本) | 基準 | principle | — | 0 | 1 | 1.5 | — | 2 | — | — | — | 銀河の空間メッシュを局所場と物質線で表す | — |
| 🪁 | `galaxyMeshSpiralGeoToy` | — | 診断(principle・geoPN=3) | 同じ入力 | principle | — | 3 | 0 | 1.5 | — | 2 | — | — | vertex | 🎠 の配置で法則だけ geoPN=3 に替えて比べる | — |
| 🎋 | `galaxyMeshSpiralGeoToyLite` | retired | 履歴(familyRole "retired") | 同じ入力 | principle | — | 3 | 0 | 1.5 | — | 2 | — | — | vertex | 🪁 を円盤 80 粒に軽くした比較用の写し | — |
| 🌚 | `galaxyAnalogyBH` | — | 診断(principle・geoPN=3) | 違う入力(本数・質量・位置・速度) | principle | — | 3 | 0 | 1.5 | — | 2 | — | — | vertex | 中心 DFM 版 BH と恒星質量光学迷彩矮星を力学の質量要素に置いた銀河アナロジー | — |

**鍵ごとの差**(physics の同じ鍵 23):

- `physics.contactMode`: galaxyMeshSpiral=none / galaxyMeshSpiralGeoToy=none / galaxyMeshSpiralGeoToyLite=— / galaxyAnalogyBH=none
- `physics.geoPN`: galaxyMeshSpiral=0 / galaxyMeshSpiralGeoToy=3 / galaxyMeshSpiralGeoToyLite=3 / galaxyAnalogyBH=3
- `physics.kFrame`: galaxyMeshSpiral=1 / galaxyMeshSpiralGeoToy=0 / galaxyMeshSpiralGeoToyLite=0 / galaxyAnalogyBH=0
- `physics.ledger`: galaxyMeshSpiral={"dragWork":true} / galaxyMeshSpiralGeoToy=— / galaxyMeshSpiralGeoToyLite=— / galaxyAnalogyBH=—
- `physics.spaceMesh`: galaxyMeshSpiral=— / galaxyMeshSpiralGeoToy={"mode":"vertex","gravity":false,"inertia":false,"lawVersion":"scalar"} / galaxyMeshSpiralGeoToyLite={"mode":"vertex","gravity":false,"inertia":false,"lawVersion":"scalar"} / galaxyAnalogyBH={"mode":"vertex","gravity":false,"inertia":false,"lawVersion":"scalar","centerSpin":"read"}
- `seed`: galaxyMeshSpiral=20260910 / galaxyMeshSpiralGeoToy=20260910 / galaxyMeshSpiralGeoToyLite=20260910 / galaxyAnalogyBH=20260925
- `familyRole`: galaxyMeshSpiral=— / galaxyMeshSpiralGeoToy=— / galaxyMeshSpiralGeoToyLite=retired / galaxyAnalogyBH=—
- `bodies(vs 基準)`: galaxyMeshSpiral=基準 / galaxyMeshSpiralGeoToy=同じ入力 / galaxyMeshSpiralGeoToyLite=同じ入力 / galaxyAnalogyBH=違う入力(本数・質量・位置・速度)

**統廃合の候補**(実行ではない):

| 規則 | 残す | 畳む | どう | 理由 |
|---|---|---|---|---|
| A | `galaxyMeshSpiral` | `galaxyMeshSpiralGeoToy` | 器の中の写し(走行設定)として残し、内蔵 ID は畳む | bodies(質量・位置・速度)が galaxyMeshSpiral と同じ・違うのは physics の geoPN・kFrame・ledger・spaceMesh |

**履歴(退役)**: `galaxyMeshSpiralGeoToyLite`

## 銀河の回転曲線 4 本(`galaxyrot`・4 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🌌 | `galaxy` | primary | 主系列(母集団の外の家族の入口(primary)) | 基準 | composite | — | 0 | 1 | 1.5 | — | 2 | — | — | — | 中心天体の引きずりで外縁の回転が速まるかを測る | `claim.galaxy-outerboost` |
| 🎡 | `galaxyStd` | variant | 比較(上のどれでもない) | 同じ入力 | principle | — | 0 | 1 | 1.5 | — | 2 | — | — | — | 重力と引きずりだけで外縁の増速を測る基準 | `claim.galaxystd-outerboost` |
| 💫 | `galaxyGeo2` | variant | 比較(上のどれでもない) | 同じ入力 | principle | — | 2 | 1 | 1.5 | — | 2 | — | — | — | v−u 測地線則で外縁の増速を比べる | `claim.galaxygeo2-outerboost` |
| 🍳 | `galaxyDB` | variant | 比較(上のどれでもない) | 違う入力(本数・質量・位置・速度) | principle | — | 0 | 1 | 1.5 | — | 2 | — | — | — | 円盤の回転支持とバルジの分散支持を比べる | `claim.galaxydb-contrast` |

**鍵ごとの差**(physics の同じ鍵 19):

- `physics.contactCap`: galaxy=2 / galaxyStd=— / galaxyGeo2=2 / galaxyDB=—
- `physics.contactK`: galaxy=10 / galaxyStd=— / galaxyGeo2=10 / galaxyDB=—
- `physics.contactMode`: galaxy=none / galaxyStd=none / galaxyGeo2=none / galaxyDB=normal
- `physics.gammaN`: galaxy=0.4 / galaxyStd=0 / galaxyGeo2=0 / galaxyDB=0
- `physics.geoPN`: galaxy=0 / galaxyStd=0 / galaxyGeo2=2 / galaxyDB=0
- `physics.kRep`: galaxy=0.8 / galaxyStd=0 / galaxyGeo2=0 / galaxyDB=0
- `physics.kappaS`: galaxy=0.05 / galaxyStd=0 / galaxyGeo2=0 / galaxyDB=0
- `physics.muF`: galaxy=0.5 / galaxyStd=0 / galaxyGeo2=0 / galaxyDB=0
- `rays`: galaxy=(宣言あり) / galaxyStd=— / galaxyGeo2=— / galaxyDB=—
- `seed`: galaxy=20260727 / galaxyStd=20260727 / galaxyGeo2=20260727 / galaxyDB=20260804
- `sampleClass`: galaxy=composite / galaxyStd=principle / galaxyGeo2=principle / galaxyDB=principle
- `familyRole`: galaxy=primary / galaxyStd=variant / galaxyGeo2=variant / galaxyDB=variant
- `gates(testId)`: galaxy=claim.galaxy-outerboost / galaxyStd=claim.galaxystd-outerboost / galaxyGeo2=claim.galaxygeo2-outerboost / galaxyDB=claim.galaxydb-contrast
- `bodies(vs 基準)`: galaxy=基準 / galaxyStd=同じ入力 / galaxyGeo2=同じ入力 / galaxyDB=違う入力(本数・質量・位置・速度)

**統廃合の候補**: 規則に当たる組は無い。

## 球状星団 47 Tuc(`tuc47`・2 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🍇 | `tuc47` | primary | 主系列(母集団の外の家族の入口(primary)) | 基準 | principle | — | 0 | 0 | 0.006 | — | 2 | — | — | — | 47 Tuc の配置と速度を観測から転写する | — |
| 🫐 | `tuc47DFM` | retired | 履歴(familyRole "retired") | 同じ入力 | principle | — | 0 | 1 | 0.006 | — | 2 | 1.9934013530695391(chi-law-v1-meanfield) | — | — | 連星の質量補正を星団へ当てる hold-out | — |

**鍵ごとの差**(physics の同じ鍵 24):

- `physics.kFrame`: tuc47=0 / tuc47DFM=1
- `massCalibration`: tuc47=— / tuc47DFM=(宣言あり)
- `familyRole`: tuc47=primary / tuc47DFM=retired
- `bodies(vs 基準)`: tuc47=基準 / tuc47DFM=同じ入力

**統廃合の候補**: 規則に当たる組は無い。

**履歴(退役)**: `tuc47DFM`

## 渦巻銀河 NGC 3198(`ngc3198`・2 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🛞 | `ngc3198DFM` | primary | 主系列(母集団の外の家族の入口(primary)) | 基準 | principle | — | 0 | 1 | 0.006 | — | 2 | 1.9997320796514568(chi-law-v1-meanfield) | — | — | ハローなしの DFM で外縁速度を支える | — |
| 🌃 | `ngc3198` | variant | 診断(principle・「対照」) | 違う入力(本数・質量・位置・速度) | principle | — | 0 | 0 | 0.006 | — | 2 | — | — | — | 指数円盤と NFW ハローで回転を比べる | — |

**鍵ごとの差**(physics の同じ鍵 24):

- `physics.halo`: ngc3198DFM=— / ngc3198={"model":"nfw","cx":0,"cy":0,"rho0":0.002685,"rs":61.31}
- `physics.kFrame`: ngc3198DFM=1 / ngc3198=0
- `massCalibration`: ngc3198DFM=(宣言あり) / ngc3198=—
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

## 超新星(`supernova`・3 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🥀 | `supernovaProg` | primary | 主系列(母集団の外の家族の入口(primary)) | 基準 | principle | — | 0 | 0 | 0.006 | — | 2 | — | — | — | ベテルギウスの前駆星状態を転写する | — |
| 🎇 | `supernovaCore` | variant | 比較(上のどれでもない) | 違う入力(質量) | principle | — | 0 | 1 | 2 | — | 2 | 2(chi-law-v1-transfer) | — | — | 1 つの星の殻放出と時計つきの核の残存を見せる | — |
| 🌹 | `supernovaProgDFM` | retired | 履歴(familyRole "retired") | 違う入力(質量) | principle | — | 0 | 1 | 0.006 | — | 2 | 2(chi-law-v1-transfer) | — | — | 質量台帳 f=2 の前駆星を比べる | — |

**鍵ごとの差**(physics の同じ鍵 14):

- `physics.D0`: supernovaProg=0.006 / supernovaCore=2 / supernovaProgDFM=0.006
- `physics.G`: supernovaProg=6.674 / supernovaCore=4 / supernovaProgDFM=6.674
- `physics.cHeat`: supernovaProg=1 / supernovaCore=0.2 / supernovaProgDFM=1
- `physics.cLight`: supernovaProg=29979.2458 / supernovaCore=30 / supernovaProgDFM=29979.2458
- `physics.coupleSink`: supernovaProg=core / supernovaCore=reservoir / supernovaProgDFM=reservoir
- `physics.etaRad`: supernovaProg=0 / supernovaCore=0.0016 / supernovaProgDFM=0
- `physics.frameReaction`: supernovaProg=— / supernovaCore=pairReduced / supernovaProgDFM=—
- `physics.kFrame`: supernovaProg=0 / supernovaCore=1 / supernovaProgDFM=1
- `physics.kappaT`: supernovaProg=7.425826474101849e-9 / supernovaCore=0.016666666666666666 / supernovaProgDFM=7.425826474101849e-9
- `physics.pRad`: supernovaProg=4 / supernovaCore=2 / supernovaProgDFM=4
- `physics.softening`: supernovaProg=1 / supernovaCore=3 / supernovaProgDFM=1
- `physics.timeScale`: supernovaProg=100 / supernovaCore=2 / supernovaProgDFM=100
- `massCalibration`: supernovaProg=— / supernovaCore=(宣言あり) / supernovaProgDFM=(宣言あり)
- `scaleExp`: supernovaProg=(宣言あり) / supernovaCore=— / supernovaProgDFM=(宣言あり)
- `seed`: supernovaProg=20260901 / supernovaCore=20260907 / supernovaProgDFM=20260901
- `thermal`: supernovaProg=— / supernovaCore=tint / supernovaProgDFM=—
- `familyRole`: supernovaProg=primary / supernovaCore=variant / supernovaProgDFM=retired
- `bodies(vs 基準)`: supernovaProg=基準 / supernovaCore=違う入力(質量) / supernovaProgDFM=違う入力(質量)

**統廃合の候補**: 規則に当たる組は無い。

**履歴(退役)**: `supernovaProgDFM`

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
- `familyRole`: grcal=primary / grcalGps=variant / grcalLight=variant / grcalShapiro=variant
- `gates(testId)`: grcal=— / grcalGps=behavior.grcal3 / grcalLight=behavior.grcal3 / grcalShapiro=behavior.grcal3
- `bodies(vs 基準)`: grcal=基準 / grcalGps=違う入力(本数・質量・位置・速度) / grcalLight=違う入力(質量・位置・速度) / grcalShapiro=違う入力(質量・位置・速度)

**統廃合の候補**: 規則に当たる組は無い。

## 光学迷彩矮星(退役の文脈)(`rotor`・10 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🕳️ | `rotorSolo` | primary | 主系列(母集団の外の家族の入口(primary)) | 基準 | principle | — | 0 | 1 | 2 | — | 2 | — | — | — | 単体の光学迷彩矮星の掻き出しと減光を測る | `behavior.rotorSolo` |
| 🪜 | `massLadder` | variant | 比較(上のどれでもない) | 違う入力(本数・質量・位置・速度) | composite | — | 0 | 1 | 1.5 | — | 2 | — | — | — | 暗い中心の力学質量を 3 段で比べる | `claim.massladder` |
| 🥚 | `selfRotor` | primary | 主系列(母集団の外の家族の入口(primary)) | 違う入力(本数・質量・位置・速度) | composite | — | 0 | 1 | 2 | — | 2 | — | — | — | 一様な雲から暗く回る中心が育つかを見る | `behavior.selfrotor` `behavior.selfrotor-multiseed` |
| 🕶️ | `darkrotor` | retired | 履歴(familyRole "retired") | 違う入力(本数・質量・位置・速度) | composite | — | 0 | 1 | 2 | — | 2 | — | — | — | 暗い光学迷彩矮星が作る腕の強さと減光を測る | `behavior.darkrotor-multiseed` `behavior.darkrotor-pitch` `behavior.darkrotorLong` |
| ⚫ | `bhCore` | retired | 履歴(familyRole "retired") | 違う入力(本数・質量・位置・速度) | composite | — | 0 | 1 | 1.5 | — | 2 | — | — | — | 自由な多層の中心のスピン移送と減光を測る | `claim.bhcore-free` `claim.bhcore-selfdrive` |
| 🪩 | `bhCoreTilt` | retired | 履歴(familyRole "retired") | 違う入力(本数・質量・位置・速度) | principle | — | 0 | 1 | 1.5 | — | 2 | — | — | — | 中心コアの軸を横倒しにした暗い中心を見せる | — |
| 🌑 | `nebulaRotor` | retired | 履歴(familyRole "retired") | 違う入力(本数・質量・位置・速度) | composite | — | 0 | 1 | 1.5 | — | 2 | — | — | — | ローター群で暗いコアと明るい外層を作る | `claim.nebularotor-contrast` |
| 🐚 | `nebulaShell` | retired | 履歴(familyRole "retired") | 違う入力(本数・質量・位置・速度) | principle | — | 0 | 1 | 1.5 | — | 2 | — | — | — | 重い殻で束縛と暗さを両立させる | `claim.nebulashell-stress` |
| ⏳ | `nebulaBipolar` | retired | 履歴(familyRole "retired") | 違う入力(本数・質量・位置・速度) | composite | — | 0 | 1 | 1.5 | — | 2 | — | — | — | 暗い赤道帯と明るい極方向の形を作る | `claim.nebulabipolar-multiseed` `claim.nebulabipolar-polar` |
| 🌱 | `starSeed` | retired | 履歴(familyRole "retired") | 違う入力(本数・質量・位置・速度) | principle | — | 0 | 1 | 1.5 | — | 2 | — | — | — | コアの圧縮・軸仕事と減光の経路を測る | `claim.starseed-powerball` |

**鍵ごとの差**(physics の同じ鍵 11):

- `physics.D0`: rotorSolo=2 / massLadder=1.5 / selfRotor=2 / darkrotor=2 / bhCore=1.5 / bhCoreTilt=1.5 / nebulaRotor=1.5 / nebulaShell=1.5 / nebulaBipolar=1.5 / starSeed=1.5
- `physics.G`: rotorSolo=0.25 / massLadder=0.8 / selfRotor=8 / darkrotor=1 / bhCore=0.8 / bhCoreTilt=0.8 / nebulaRotor=0.8 / nebulaShell=0.8 / nebulaBipolar=0.8 / starSeed=0.8
- `physics.bM`: rotorSolo=0.25 / massLadder=1 / selfRotor=1 / darkrotor=1 / bhCore=1 / bhCoreTilt=1 / nebulaRotor=1 / nebulaShell=1 / nebulaBipolar=1 / starSeed=1
- `physics.cHeat`: rotorSolo=1 / massLadder=1 / selfRotor=0.2 / darkrotor=1 / bhCore=1 / bhCoreTilt=1 / nebulaRotor=1 / nebulaShell=1 / nebulaBipolar=1 / starSeed=1
- `physics.contactCap`: rotorSolo=2 / massLadder=2 / selfRotor=— / darkrotor=— / bhCore=— / bhCoreTilt=— / nebulaRotor=4.5 / nebulaShell=— / nebulaBipolar=— / starSeed=—
- `physics.contactK`: rotorSolo=10 / massLadder=10 / selfRotor=— / darkrotor=— / bhCore=— / bhCoreTilt=— / nebulaRotor=22.5 / nebulaShell=— / nebulaBipolar=— / starSeed=—
- `physics.etaRad`: rotorSolo=0 / massLadder=0 / selfRotor=0.0016 / darkrotor=0.005 / bhCore=0 / bhCoreTilt=0 / nebulaRotor=0.003 / nebulaShell=0 / nebulaBipolar=0.002 / starSeed=0
- `physics.frameReaction`: rotorSolo=— / massLadder=— / selfRotor=— / darkrotor=— / bhCore=pairReduced / bhCoreTilt=pairReduced / nebulaRotor=— / nebulaShell=— / nebulaBipolar=— / starSeed=—
- `physics.gammaN`: rotorSolo=0 / massLadder=0 / selfRotor=0.4 / darkrotor=0.05 / bhCore=0 / bhCoreTilt=0 / nebulaRotor=0 / nebulaShell=0 / nebulaBipolar=0 / starSeed=0
- `physics.kRep`: rotorSolo=0 / massLadder=0 / selfRotor=0 / darkrotor=0.15 / bhCore=1 / bhCoreTilt=1 / nebulaRotor=0 / nebulaShell=0.3 / nebulaBipolar=1.2 / starSeed=0
- `physics.kappaS`: rotorSolo=0 / massLadder=0 / selfRotor=0 / darkrotor=0.05 / bhCore=0 / bhCoreTilt=0 / nebulaRotor=0 / nebulaShell=0 / nebulaBipolar=0 / starSeed=0
- `physics.kappaT`: rotorSolo=0.016666666666666666 / massLadder=0.02 / selfRotor=0.07142857142857142 / darkrotor=0.016666666666666666 / bhCore=0.02 / bhCoreTilt=0.02 / nebulaRotor=0.02 / nebulaShell=0.02 / nebulaBipolar=0.02 / starSeed=0.02
- `physics.muF`: rotorSolo=0 / massLadder=0 / selfRotor=0.5 / darkrotor=0.02 / bhCore=0 / bhCoreTilt=0 / nebulaRotor=0 / nebulaShell=0 / nebulaBipolar=0 / starSeed=0
- `physics.pRad`: rotorSolo=4 / massLadder=4 / selfRotor=2 / darkrotor=4 / bhCore=4 / bhCoreTilt=4 / nebulaRotor=4 / nebulaShell=4 / nebulaBipolar=4 / starSeed=4
- `physics.softening`: rotorSolo=4 / massLadder=3 / selfRotor=3 / darkrotor=4 / bhCore=3 / bhCoreTilt=3 / nebulaRotor=3 / nebulaShell=3 / nebulaBipolar=3 / starSeed=3
- `physics.timeScale`: rotorSolo=4 / massLadder=3 / selfRotor=2 / darkrotor=2 / bhCore=3 / bhCoreTilt=3 / nebulaRotor=2 / nebulaShell=2 / nebulaBipolar=2 / starSeed=2
- `fusion`: rotorSolo=— / massLadder=— / selfRotor=(宣言あり) / darkrotor=— / bhCore=— / bhCoreTilt=— / nebulaRotor=— / nebulaShell=— / nebulaBipolar=— / starSeed=—
- `rays`: rotorSolo=(宣言あり) / massLadder=— / selfRotor=— / darkrotor=— / bhCore=— / bhCoreTilt=— / nebulaRotor=— / nebulaShell=— / nebulaBipolar=— / starSeed=—
- `seed`: rotorSolo=20260727 / massLadder=20260806 / selfRotor=20260806 / darkrotor=20260726 / bhCore=20260805 / bhCoreTilt=20260805 / nebulaRotor=20260804 / nebulaShell=20260804 / nebulaBipolar=20260804 / starSeed=20260805
- `thermal`: rotorSolo=— / massLadder=— / selfRotor=tint / darkrotor=— / bhCore=— / bhCoreTilt=— / nebulaRotor=— / nebulaShell=— / nebulaBipolar=— / starSeed=—
- `sampleClass`: rotorSolo=principle / massLadder=composite / selfRotor=composite / darkrotor=composite / bhCore=composite / bhCoreTilt=principle / nebulaRotor=composite / nebulaShell=principle / nebulaBipolar=composite / starSeed=principle
- `familyRole`: rotorSolo=primary / massLadder=variant / selfRotor=primary / darkrotor=retired / bhCore=retired / bhCoreTilt=retired / nebulaRotor=retired / nebulaShell=retired / nebulaBipolar=retired / starSeed=retired
- `gates(testId)`: rotorSolo=behavior.rotorSolo / massLadder=claim.massladder / selfRotor=behavior.selfrotor,behavior.selfrotor-multiseed / darkrotor=behavior.darkrotor-multiseed,behavior.darkrotor-pitch,behavior.darkrotorLong / bhCore=claim.bhcore-free,claim.bhcore-selfdrive / bhCoreTilt=— / nebulaRotor=claim.nebularotor-contrast / nebulaShell=claim.nebulashell-stress / nebulaBipolar=claim.nebulabipolar-multiseed,claim.nebulabipolar-polar / starSeed=claim.starseed-powerball
- `bodies(vs 基準)`: rotorSolo=基準 / massLadder=違う入力(本数・質量・位置・速度) / selfRotor=違う入力(本数・質量・位置・速度) / darkrotor=違う入力(本数・質量・位置・速度) / bhCore=違う入力(本数・質量・位置・速度) / bhCoreTilt=違う入力(本数・質量・位置・速度) / nebulaRotor=違う入力(本数・質量・位置・速度) / nebulaShell=違う入力(本数・質量・位置・速度) / nebulaBipolar=違う入力(本数・質量・位置・速度) / starSeed=違う入力(本数・質量・位置・速度)

**統廃合の候補**: 規則に当たる組は無い。

**履歴(退役)**: `darkrotor` `bhCore` `bhCoreTilt` `nebulaRotor` `nebulaShell` `nebulaBipolar` `starSeed`

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
| 🎋 | `galaxyMeshSpiralGeoToyLite` | ○ | ○ | 9f910293 | 9f910293 |
| 🪶 | `psrDoubleABPN` | ○ | ○ | c794a498 | c794a498 |
| 🪃 | `psrJ1757PN` | ○ | ○ | 7132210b | 7132210b |
| 🪀 | `psrJ1946PN` | ○ | ○ | cc595e3c | cc595e3c |
| ⭕ | `emAuditNewton` | ○ | ○ | a573f11b | a573f11b |
| 🪝 | `psrDoubleABCF` | ○ | ○ | 8767377 | 8767377 |
| 🪄 | `psrJ1757CF` | ○ | ○ | 12797269 | 12797269 |
| 🩹 | `psrJ1946CF` | ○ | ○ | f8600f7c | f8600f7c |
| 🪤 | `psrB1534CF` | ○ | ○ | 84820b4 | 84820b4 |

- **ゲートから外した長走行**: `darkrotorMidNew`・`darkrotorMidOld`・`darkrotorLong`・`darkrotorMultiseed`(保存 QA の worker の所要の和 341.6 s)と、その結果を読む試験 `behavior.darkrotor`・`behavior.darkrotorLong`・`behavior.darkrotor-pitch`・`behavior.darkrotor-multiseed`。最後の保存 QA の値は凍結の写しの history に転記した(測り直していない)。
- **機構の最小試験**(ゲートに残す 1 点ずつ): コアの交換(殻のスピン移送) = `claim.bhcore-selfdrive`(bhCore) / 傾斜(コア軸の横倒しで Jz が機械ゼロ・減光は保つ) = `behavior.templates229`(bhCoreTilt) / 減光(暗いコアと明るい外層のコントラスト) = `claim.nebularotor-contrast`(nebulaRotor) / パワーボール(圧縮と軸仕事の経路) = `claim.starseed-powerball`(starSeed)。
- **第284便b の写し** `tests/fixtures/retired-w284b.json`(原仮定者の裁定(第74報)⑤・AN35): 退役 6 本(`galaxyMeshSpiralGeoToyLite` `psrDoubleABPN` `psrJ1757PN` `psrJ1946PN` `emAuditNewton` `psrDoubleABCF`)と、f=1 へ移した本の旧則(`psrDoubleABDFM` —— f≈2 の条件つき較正・履歴)。付け替えた試験の最後の保存 QA の値: `behavior.psrDoubleAB`・`behavior.w249a-pnResponse`・`behavior.compactForce`・`behavior.calibrationForecast`。
- **第285便f の写し** `tests/fixtures/retired-w285f.json`(原仮定者の裁定(第75報)AN51・AN24′): 退役 1 本(`psrJ1757CF`)と、f=1 へ移した本の旧則(`psrJ1757DFM` —— f≈2 の条件つき較正・履歴)。付け替えた試験の最後の保存 QA の値: `lint.precisionUlp`・`behavior.nsThreeStage`・`behavior.w249a-pnResponse`・`behavior.jointCalProtocol`。
- **第286便f の写し** `tests/fixtures/retired-w286f.json`(原仮定者の裁定(第76報)AN57): 退役 1 本(`psrJ1946CF`)と、f=1 へ移した本の旧則(`psrJ1946DFM` —— f≈2 の条件つき較正・履歴)。付け替えた試験の最後の保存 QA の値: `behavior.w249a-pnResponse`・`docs.j1946adoptPublished`・`docs.j1946Adopted`。
- **第287便b の写し** `tests/fixtures/retired-w287b.json`(原仮定者の裁定(第77報)AN62): 退役 1 本(`psrB1534CF`)と、f=1 へ移した本の旧則(`psrB1534DFM` —— f≈2 の条件つき較正・履歴)。付け替えた試験の最後の保存 QA の値: `lint.precisionUlp`・`behavior.nsThreeStage`。
- **名指しする器**(tests/*.mjs・tools/*.mjs —— QA 本体を除く 61 本): 凍結の写しを読む 2・再生成表の履歴 25・再生成表の現行 13・道具 4・表の外 17。QA 本体の出現数: darkrotor 144・bhCore 44・nebulaRotor 17・nebulaShell 14・nebulaBipolar 21・starSeed 15・bhCoreTilt 20・galaxyMeshSpiralGeoToyLite 24・psrDoubleABPN 19・psrJ1757PN 11・psrJ1946PN 13・emAuditNewton 34・psrDoubleABCF 13・psrJ1757CF 19・psrJ1946CF 20・psrB1534CF 19。

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
| `tests/lib-sigma-destinations.mjs` | psrDoubleABPN psrJ1757PN psrJ1946PN psrDoubleABCF psrJ1757CF psrJ1946CF psrB1534CF | — | 表の外(正本ではない) |
| `tests/lib-w270a-stoprule.mjs` | psrJ1946PN psrJ1946CF | — | 表の外(正本ではない) |
| `tests/lib-w279a-samplestatus.mjs` | bhCore bhCoreTilt | — | 表の外(正本ではない) |
| `tests/perf.mjs` | darkrotor bhCore nebulaRotor nebulaShell nebulaBipolar starSeed | — | 道具(正本を書かない) |
| `tests/probe-perf-floor.mjs` | starSeed | — | 道具(正本を書かない) |
| `tests/seeds.mjs` | darkrotor | h283b-seeds(history) | 履歴(再生成しない) |

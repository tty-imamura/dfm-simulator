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

- 家族 **21**・本 **81**(うち退役 7)・推定の列: 主系列 42・比較 18・診断 14・履歴 7。
- 候補: 規則 A 5・規則 B 1・規則 C(要裁定)11・畳まない組 17。

| 家族 | 本数 | 基準 | 主系列 | 比較 | 診断 | 履歴 | 候補 A/B/C | 畳まない組 |
|---|---|---|---|---|---|---|---|---|
| 冥王星–カロン(`pluto`) | 6 | `plutoCharonReal` | 1 | 0 | 5 | 0 | 1/0/0 | 0 |
| 地球–月(現実との照合)(`earthmoon`) | 6 | `earthMoonRealKF1` | 4 | 1 | 1 | 0 | 0/1/0 | 4 |
| 水星(現実との照合)(`mercury`) | 3 | `mercuryRealKF1` | 2 | 0 | 1 | 0 | 1/0/0 | 1 |
| 土星(現実との照合)(`saturn`) | 5 | `saturnRingRealKF1` | 3 | 0 | 2 | 0 | 0/0/0 | 2 |
| 二重パルサー J0737−3039(`psrDoubleAB`) | 6 | `psrDoubleABDFM` | 5 | 0 | 1 | 0 | 1/0/3 | 4 |
| パルサー J1757−1854(`psrJ1757`) | 3 | `psrJ1757DFM` | 3 | 0 | 0 | 0 | 0/0/3 | 0 |
| パルサー J1946+2052(`psrJ1946`) | 3 | `psrJ1946DFM` | 3 | 0 | 0 | 0 | 0/0/3 | 0 |
| パルサー B1534+12(`psrB1534`) | 3 | `psrB1534` | 3 | 0 | 0 | 0 | 0/0/1 | 2 |
| 重力波 GW150914(`gw150914`) | 4 | `gw150914DFM` | 3 | 1 | 0 | 0 | 0/0/1 | 2 |
| ケンタウルス座 α 星 AB(`alphaCen`) | 2 | `alphaCenABDFM` | 2 | 0 | 0 | 0 | 0/0/0 | 1 |
| シリウス AB(`sirius`) | 2 | `siriusABDFM` | 2 | 0 | 0 | 0 | 0/0/0 | 1 |
| 銀河回転(空間メッシュ・アナロジー)(`galaxyMesh`) | 4 | `galaxyMeshSpiral` | 1 | 0 | 3 | 0 | 2/0/0 | 0 |
| 銀河の回転曲線 4 本(`galaxyrot`) | 4 | `galaxy` | 1 | 3 | 0 | 0 | 0/0/0 | 0 |
| 球状星団 47 Tuc(`tuc47`) | 2 | `tuc47DFM` | 1 | 1 | 0 | 0 | 0/0/0 | 0 |
| 渦巻銀河 NGC 3198(`ngc3198`) | 2 | `ngc3198DFM` | 1 | 0 | 1 | 0 | 0/0/0 | 0 |
| 形の玩具 6 本(`shapeToy`) | 6 | `shapeToyCluster` | 1 | 5 | 0 | 0 | 0/0/0 | 0 |
| 超新星の親星(`supernova`) | 2 | `supernovaProgDFM` | 1 | 1 | 0 | 0 | 0/0/0 | 0 |
| 白色矮星(`whiteDwarf`) | 2 | `whiteDwarfDFM` | 1 | 1 | 0 | 0 | 0/0/0 | 0 |
| 土星(天体の機構)(`saturnToy`) | 2 | `saturn` | 1 | 1 | 0 | 0 | 0/0/0 | 0 |
| 時計と重力(GR の較正)(`grcal`) | 4 | `grcal` | 1 | 3 | 0 | 0 | 0/0/0 | 0 |
| ダークローター(退役の文脈)(`rotor`) | 10 | `rotorSolo` | 2 | 1 | 0 | 7 | 0/0/0 | 0 |

## 冥王星–カロン(`pluto`・6 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ❄️ | `plutoCharonReal` | primary | 主系列(較正母集団) | 基準 | calibration・dfm | ○ | 2 | 1 | 0.006 | — | 11.9386 | — | — | — | 旧入力の冥王星–カロンを照合する | `behavior.plutoCharonReal` |
| ⛄ | `plutoCharonDFM` | variant | 診断(principle・「零」) | 違う入力(質量・位置・速度) | principle | — | 2 | 0 | 0.006 | — | 11.9386 | — | pairSlip | — | 同一観測解の二体に零条件つき引きずり則を載せる | `behavior.plutoCharonDFM` |
| 🌨️ | `plutoCharonKF0Control` | variant | 診断(principle・「対照」) | 違う入力(質量・位置・速度) | principle | — | 2 | 0 | 0.006 | — | 11.9386 | — | — | — | ⛄ と同じ入力で則だけを外した kF0 対照 | — |
| 🥶 | `plutoCharonDiagInput` | variant | 診断(principle・「対照」) | 違う入力(質量・位置・速度) | principle | — | 1 | 0 | 0.006 | — | 11.9386 | — | — | — | ❄️ の入力の丸めと軟化を外した kF0 診断コピー | — |
| ☃️ | `plutoCharonSyncZero` | variant | 診断(principle・「零」) | 違う入力(質量・位置・速度) | principle | — | 0 | 0 | 0.006 | — | 11.9386 | — | pairSlip | — | 厳密同期円で相対すべり則の零条件を走行中も試す | — |
| 🌒 | `charonGeoToy3` | variant | 診断(principle・geoPN=3) | 同じ入力 | principle | — | 3 | 0 | 0.006 | — | 11.9386 | — | — | vertex | 太陽の背景を置いた geoPN=3 契約の周期を kF0 と並べる | — |

**鍵ごとの差**(physics の同じ鍵 24):

- `physics.backgroundComplex`: plutoCharonReal=— / plutoCharonDFM=— / plutoCharonKF0Control=— / plutoCharonDiagInput=— / plutoCharonSyncZero=— / charonGeoToy3={"background":"declared","W0":5.699987574282822e-9,"A0":[0,2.7018851611140787e-9],"gradW":[-1.930092225608931e-15,0],"gradA":[0,0,-9.148945459956653e-16,0],"dWdt":0,"dAdt":[2.1683731460773505e-16,0],"note":"第279便c の器(bgbudget2-w279c)と同じ値: 太陽の点質量を t=0・対の重心で評価(comoving)","sources":[{"id":"sun","kind":"body","excludedExplicit":true}],"frame":{"origin":"barycenter","epoch":"t0(第280便c の診断コピー)","rotation":"none","translation":"comoving"}}
- `physics.geoPN`: plutoCharonReal=2 / plutoCharonDFM=2 / plutoCharonKF0Control=2 / plutoCharonDiagInput=1 / plutoCharonSyncZero=0 / charonGeoToy3=3
- `physics.kFrame`: plutoCharonReal=1 / plutoCharonDFM=0 / plutoCharonKF0Control=0 / plutoCharonDiagInput=0 / plutoCharonSyncZero=0 / charonGeoToy3=0
- `physics.massPrecision`: plutoCharonReal=— / plutoCharonDFM=double / plutoCharonKF0Control=double / plutoCharonDiagInput=double / plutoCharonSyncZero=double / charonGeoToy3=—
- `physics.meshVelocity`: plutoCharonReal=— / plutoCharonDFM=— / plutoCharonKF0Control=— / plutoCharonDiagInput=— / plutoCharonSyncZero=— / charonGeoToy3={"law":"vMinusU","field":"backgroundComplex","mutual":0,"frame":{"origin":"barycenter","epoch":"t0(第280便c の診断コピー)","rotation":"none","translation":"comoving"}}
- `physics.relativeDrag`: plutoCharonReal=— / plutoCharonDFM={"law":"pairSlip","kappa":1,"W0":0,"pairs":"all","spins":"declared","integration":"midpoint"} / plutoCharonKF0Control=— / plutoCharonDiagInput=— / plutoCharonSyncZero={"law":"pairSlip","kappa":1,"W0":0,"pairs":"all","spins":"declared","integration":"midpoint"} / charonGeoToy3=—
- `physics.softening`: plutoCharonReal=0.05 / plutoCharonDFM=0.01 / plutoCharonKF0Control=0.01 / plutoCharonDiagInput=0.01 / plutoCharonSyncZero=0.01 / charonGeoToy3=0.05
- `physics.spaceMesh`: plutoCharonReal=— / plutoCharonDFM=— / plutoCharonKF0Control=— / plutoCharonDiagInput=— / plutoCharonSyncZero=— / charonGeoToy3={"mode":"vertex","gravity":false,"inertia":false,"lawVersion":"vMinusU","pn":"reference-1PN","pnVelocity":"v","velocityMeaning":"xdot"}
- `integrator`: plutoCharonReal=— / plutoCharonDFM=leapfrog / plutoCharonKF0Control=leapfrog / plutoCharonDiagInput=leapfrog / plutoCharonSyncZero=leapfrog / charonGeoToy3=—
- `scaleExp`: plutoCharonReal=(宣言あり) / plutoCharonDFM=(宣言あり) / plutoCharonKF0Control=(宣言あり) / plutoCharonDiagInput=(宣言あり) / plutoCharonSyncZero=(宣言あり) / charonGeoToy3=(宣言あり)
- `sampleClass`: plutoCharonReal=calibration / plutoCharonDFM=principle / plutoCharonKF0Control=principle / plutoCharonDiagInput=principle / plutoCharonSyncZero=principle / charonGeoToy3=principle
- `calVariant`: plutoCharonReal=dfm / plutoCharonDFM=— / plutoCharonKF0Control=— / plutoCharonDiagInput=— / plutoCharonSyncZero=— / charonGeoToy3=—
- `familyRole`: plutoCharonReal=primary / plutoCharonDFM=variant / plutoCharonKF0Control=variant / plutoCharonDiagInput=variant / plutoCharonSyncZero=variant / charonGeoToy3=variant
- `gates(testId)`: plutoCharonReal=behavior.plutoCharonReal / plutoCharonDFM=behavior.plutoCharonDFM / plutoCharonKF0Control=— / plutoCharonDiagInput=— / plutoCharonSyncZero=— / charonGeoToy3=—
- `bodies(vs 基準)`: plutoCharonReal=基準 / plutoCharonDFM=違う入力(質量・位置・速度) / plutoCharonKF0Control=違う入力(質量・位置・速度) / plutoCharonDiagInput=違う入力(質量・位置・速度) / plutoCharonSyncZero=違う入力(質量・位置・速度) / charonGeoToy3=同じ入力

**統廃合の候補**(実行ではない):

| 規則 | 残す | 畳む | どう | 理由 |
|---|---|---|---|---|
| A | `plutoCharonReal` | `charonGeoToy3` | 器の中の写し(走行設定)として残し、内蔵 ID は畳む | bodies(質量・位置・速度)が plutoCharonReal と同じ・違うのは physics の backgroundComplex・geoPN・kFrame・meshVelocity・spaceMesh |

## 地球–月(現実との照合)(`earthmoon`・6 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🌘 | `earthMoonRealKF1` | primary | 主系列(較正母集団) | 基準 | calibration・dfm | ○ | 2 | 1 | 0.006 | 0.0000324204 | 8.2358 | — | — | — | 月の周期と近点回転を kF1 で照合する | — |
| 🌙 | `earthMoonReal` | variant | 主系列(較正母集団) | 違う入力(速度) | calibration・kf0 | ○ | 2 | 0 | 0.1 | — | 3 | — | — | — | 実単位の地球と月を kF0 で照合する | — |
| ⭕ | `emAuditNewton` | variant | 比較(上のどれでもない) | 違う入力(速度) | principle | — | 2 | 0 | 0.1 | — | 3 | — | — | — | 純二体では月の近点回転が出ないことを示す | `behavior.emAudit` |
| 🧲 | `emAuditDFM` | variant | 主系列(較正母集団) | 違う入力(速度) | calibration・dfm | ○ | 2 | 1 | 0.006 | — | 8.2358 | — | — | — | 月の較正窓の一致が長期に続くかを調べる | `behavior.emAudit` |
| 🔆 | `emAuditSolar` | variant | 主系列(較正母集団) | 違う入力(本数・質量・位置・速度) | calibration・kf0 | ○ | 0 | 0 | 0.1 | — | 3 | — | — | — | 太陽摂動だけで月の近点回転を出す | `behavior.emAudit` |
| 🌓 | `earthMoonDiagOne` | variant | 診断(principle・「診断」) | 違う入力(速度) | principle | — | 1 | 0 | 0.006 | — | 8.2358 | — | — | — | 🌘 の初期状態のまま引きずりを表裏核の座標変換へ置き換える診断 | — |

**鍵ごとの差**(physics の同じ鍵 19):

- `physics.D0`: earthMoonRealKF1=0.006 / earthMoonReal=0.1 / emAuditNewton=0.1 / emAuditDFM=0.006 / emAuditSolar=0.1 / earthMoonDiagOne=0.006
- `physics.D0pull`: earthMoonRealKF1=0.0000324204 / earthMoonReal=— / emAuditNewton=— / emAuditDFM=— / emAuditSolar=— / earthMoonDiagOne=—
- `physics.frameWeight`: earthMoonRealKF1=— / earthMoonReal=share / emAuditNewton=share / emAuditDFM=share / emAuditSolar=share / earthMoonDiagOne=—
- `physics.geoPN`: earthMoonRealKF1=2 / earthMoonReal=2 / emAuditNewton=2 / emAuditDFM=2 / emAuditSolar=0 / earthMoonDiagOne=1
- `physics.kFrame`: earthMoonRealKF1=1 / earthMoonReal=0 / emAuditNewton=0 / emAuditDFM=1 / emAuditSolar=0 / earthMoonDiagOne=0
- `physics.meshVelocity`: earthMoonRealKF1=— / earthMoonReal=— / emAuditNewton=— / emAuditDFM=— / emAuditSolar=— / earthMoonDiagOne={"law":"vMinusU","field":"explicit","mutual":0,"frame":{"origin":"barycenter","epoch":"🌘 t=0","rotation":"none","translation":"comoving"},"external":["body:0"]}
- `physics.q`: earthMoonRealKF1=8.2358 / earthMoonReal=3 / emAuditNewton=3 / emAuditDFM=8.2358 / emAuditSolar=3 / earthMoonDiagOne=8.2358
- `physics.qLock`: earthMoonRealKF1=— / earthMoonReal=— / emAuditNewton=— / emAuditDFM=— / emAuditSolar=— / earthMoonDiagOne={"kernel":"frontBack","epsC":0,"nodes":16}
- `physics.softening`: earthMoonRealKF1=0.1 / earthMoonReal=0.1 / emAuditNewton=0.1 / emAuditDFM=0.1 / emAuditSolar=0.01 / earthMoonDiagOne=0.1
- `physics.timeScale`: earthMoonRealKF1=100 / earthMoonReal=100 / emAuditNewton=100 / emAuditDFM=100 / emAuditSolar=1 / earthMoonDiagOne=100
- `qLock`: earthMoonRealKF1=true / earthMoonReal=— / emAuditNewton=— / emAuditDFM=true / emAuditSolar=— / earthMoonDiagOne=—
- `scaleExp`: earthMoonRealKF1=(宣言あり) / earthMoonReal=(宣言あり) / emAuditNewton=(宣言あり) / emAuditDFM=(宣言あり) / emAuditSolar=(宣言あり) / earthMoonDiagOne=(宣言あり)
- `sampleClass`: earthMoonRealKF1=calibration / earthMoonReal=calibration / emAuditNewton=principle / emAuditDFM=calibration / emAuditSolar=calibration / earthMoonDiagOne=principle
- `calVariant`: earthMoonRealKF1=dfm / earthMoonReal=kf0 / emAuditNewton=— / emAuditDFM=dfm / emAuditSolar=kf0 / earthMoonDiagOne=—
- `familyRole`: earthMoonRealKF1=primary / earthMoonReal=variant / emAuditNewton=variant / emAuditDFM=variant / emAuditSolar=variant / earthMoonDiagOne=variant
- `gates(testId)`: earthMoonRealKF1=— / earthMoonReal=— / emAuditNewton=behavior.emAudit / emAuditDFM=behavior.emAudit / emAuditSolar=behavior.emAudit / earthMoonDiagOne=—
- `bodies(vs 基準)`: earthMoonRealKF1=基準 / earthMoonReal=違う入力(速度) / emAuditNewton=違う入力(速度) / emAuditDFM=違う入力(速度) / emAuditSolar=違う入力(本数・質量・位置・速度) / earthMoonDiagOne=違う入力(速度)

**統廃合の候補**(実行ではない):

| 規則 | 残す | 畳む | どう | 理由 |
|---|---|---|---|---|
| B | `earthMoonReal` | `emAuditNewton` | 1 本に畳む | 説明文の欄以外の実効 JSON がすべて同じ |

**畳まない組**: `earthMoonRealKF1`・`earthMoonReal`(較正の派生値 dfm / kf0(観測版と DFM 版を 1 ID にしない)) / `earthMoonRealKF1`・`emAuditSolar`(較正の派生値 dfm / kf0(観測版と DFM 版を 1 ID にしない)) / `earthMoonReal`・`emAuditDFM`(較正の派生値 kf0 / dfm(観測版と DFM 版を 1 ID にしない)) / `emAuditDFM`・`emAuditSolar`(較正の派生値 dfm / kf0(観測版と DFM 版を 1 ID にしない))

## 水星(現実との照合)(`mercury`・3 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🪨 | `mercuryRealKF1` | primary | 主系列(較正母集団) | 基準 | calibration・dfm | ○ | 2 | 1 | 0.006 | 0.00324204 | 6.1471 | — | — | — | 水星の近日点前進を kF1 で照合する | — |
| ☄️ | `mercuryReal` | variant | 主系列(較正母集団) | 同じ入力 | calibration・kf0 | ○ | 2 | 0 | 0.1 | — | 3 | — | — | — | 水星の近日点前進を kF0 で照合する | — |
| 🔁 | `mercuryGeoToy3` | variant | 診断(principle・geoPN=3) | 同じ入力 | principle | — | 3 | 0 | 0.1 | — | 3 | — | — | vertex | 一様な座標変換で近点移動が変わらないかを geoPN=3 契約で確かめる | — |

**鍵ごとの差**(physics の同じ鍵 21):

- `physics.D0`: mercuryRealKF1=0.006 / mercuryReal=0.1 / mercuryGeoToy3=0.1
- `physics.D0pull`: mercuryRealKF1=0.00324204 / mercuryReal=— / mercuryGeoToy3=—
- `physics.backgroundComplex`: mercuryRealKF1=— / mercuryReal=— / mercuryGeoToy3={"background":"declared","W0":1,"A0":[2.3,0],"gradW":[0,0],"gradA":[0,0,0,0],"dWdt":0,"dAdt":[0,0],"note":"第280便c: 一様な座標変換 u=V の零試験(点源 1 個の mutual:0 の場と同じ形)","sources":[{"id":"uniform-u","kind":"field","excludedExplicit":true}],"frame":{"origin":"barycenter","epoch":"t0(第280便c の診断コピー)","rotation":"none","translation":"comoving"}}
- `physics.frameWeight`: mercuryRealKF1=— / mercuryReal=share / mercuryGeoToy3=share
- `physics.geoPN`: mercuryRealKF1=2 / mercuryReal=2 / mercuryGeoToy3=3
- `physics.kFrame`: mercuryRealKF1=1 / mercuryReal=0 / mercuryGeoToy3=0
- `physics.meshVelocity`: mercuryRealKF1=— / mercuryReal=— / mercuryGeoToy3={"law":"vMinusU","field":"backgroundComplex","mutual":0,"frame":{"origin":"barycenter","epoch":"t0(第280便c の診断コピー)","rotation":"none","translation":"comoving"}}
- `physics.q`: mercuryRealKF1=6.1471 / mercuryReal=3 / mercuryGeoToy3=3
- `physics.spaceMesh`: mercuryRealKF1=— / mercuryReal=— / mercuryGeoToy3={"mode":"vertex","gravity":false,"inertia":false,"lawVersion":"vMinusU","pn":"reference-1PN","pnVelocity":"v","velocityMeaning":"v"}
- `qLock`: mercuryRealKF1=true / mercuryReal=— / mercuryGeoToy3=—
- `sampleClass`: mercuryRealKF1=calibration / mercuryReal=calibration / mercuryGeoToy3=principle
- `calVariant`: mercuryRealKF1=dfm / mercuryReal=kf0 / mercuryGeoToy3=—
- `familyRole`: mercuryRealKF1=primary / mercuryReal=variant / mercuryGeoToy3=variant
- `bodies(vs 基準)`: mercuryRealKF1=基準 / mercuryReal=同じ入力 / mercuryGeoToy3=同じ入力

**統廃合の候補**(実行ではない):

| 規則 | 残す | 畳む | どう | 理由 |
|---|---|---|---|---|
| A | `mercuryRealKF1` | `mercuryGeoToy3` | 器の中の写し(走行設定)として残し、内蔵 ID は畳む | bodies(質量・位置・速度)が mercuryRealKF1 と同じ・違うのは physics の D0・D0pull・backgroundComplex・frameWeight・geoPN・kFrame・meshVelocity・q・spaceMesh |

**畳まない組**: `mercuryRealKF1`・`mercuryReal`(較正の派生値 dfm / kf0(観測版と DFM 版を 1 ID にしない)・bodies は同じ)

## 土星(現実との照合)(`saturn`・5 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 💿 | `saturnRingRealKF1` | primary | 主系列(較正母集団) | 基準 | calibration・dfm | ○ | 2 | 1 | 0.006 | 0.0000324204 | 20.4932 | — | — | — | 土星の環を kF1 と自動算出 q で照合する | — |
| 💍 | `saturnRingReal` | variant | 主系列(較正母集団) | 同じ入力 | calibration・kf0 | ○ | 2 | 0 | 0.1 | — | 3 | — | — | — | 実単位の土星の環を kF0 で照合する | `wave121.ui` |
| 📡 | `saturnZonalD68` | variant | 主系列(較正母集団) | 違う入力(本数・質量・位置・速度) | calibration・kf0 | ○ | 2 | 0 | 0.1 | — | 3 | — | — | — | 帯状重力係数で D68 の近点移動を照合する | `zonal.analytic-d68` `zonal.d68-preset` `zonal.d68-realunit` |
| 🧷 | `saturnD68Consistent` | variant | 診断(principle・「診断」) | 違う入力(本数・質量・位置・速度) | principle | — | 1 | 0 | 0.1 | — | 3 | — | — | — | 📡 の差を同じ窓で初速の幾何と他の要因に分ける | — |
| 📎 | `saturnD68ObsOrbit` | variant | 診断(principle・「診断」) | 違う入力(本数・質量・位置・速度) | principle | — | 1 | 0 | 0.1 | — | 3 | — | — | — | 観測の a と ae の定義で置いた D68 の近点移動を測る | — |

**鍵ごとの差**(physics の同じ鍵 18):

- `physics.D0`: saturnRingRealKF1=0.006 / saturnRingReal=0.1 / saturnZonalD68=0.1 / saturnD68Consistent=0.1 / saturnD68ObsOrbit=0.1
- `physics.D0pull`: saturnRingRealKF1=0.0000324204 / saturnRingReal=— / saturnZonalD68=— / saturnD68Consistent=— / saturnD68ObsOrbit=—
- `physics.frameWeight`: saturnRingRealKF1=— / saturnRingReal=share / saturnZonalD68=share / saturnD68Consistent=share / saturnD68ObsOrbit=share
- `physics.geoPN`: saturnRingRealKF1=2 / saturnRingReal=2 / saturnZonalD68=2 / saturnD68Consistent=1 / saturnD68ObsOrbit=1
- `physics.kFrame`: saturnRingRealKF1=1 / saturnRingReal=0 / saturnZonalD68=0 / saturnD68Consistent=0 / saturnD68ObsOrbit=0
- `physics.massFloor`: saturnRingRealKF1=1e-8 / saturnRingReal=0.000001 / saturnZonalD68=0.000001 / saturnD68Consistent=0.000001 / saturnD68ObsOrbit=0.000001
- `physics.q`: saturnRingRealKF1=20.4932 / saturnRingReal=3 / saturnZonalD68=3 / saturnD68Consistent=3 / saturnD68ObsOrbit=3
- `physics.softening`: saturnRingRealKF1=0.05 / saturnRingReal=0.05 / saturnZonalD68=0.05 / saturnD68Consistent=0.01 / saturnD68ObsOrbit=0.01
- `physics.timeScale`: saturnRingRealKF1=10 / saturnRingReal=10 / saturnZonalD68=3 / saturnD68Consistent=3 / saturnD68ObsOrbit=3
- `qLock`: saturnRingRealKF1=true / saturnRingReal=— / saturnZonalD68=— / saturnD68Consistent=— / saturnD68ObsOrbit=—
- `sampleClass`: saturnRingRealKF1=calibration / saturnRingReal=calibration / saturnZonalD68=calibration / saturnD68Consistent=principle / saturnD68ObsOrbit=principle
- `calVariant`: saturnRingRealKF1=dfm / saturnRingReal=kf0 / saturnZonalD68=kf0 / saturnD68Consistent=— / saturnD68ObsOrbit=—
- `familyRole`: saturnRingRealKF1=primary / saturnRingReal=variant / saturnZonalD68=variant / saturnD68Consistent=variant / saturnD68ObsOrbit=variant
- `gates(testId)`: saturnRingRealKF1=— / saturnRingReal=wave121.ui / saturnZonalD68=zonal.analytic-d68,zonal.d68-preset,zonal.d68-realunit / saturnD68Consistent=— / saturnD68ObsOrbit=—
- `bodies(vs 基準)`: saturnRingRealKF1=基準 / saturnRingReal=同じ入力 / saturnZonalD68=違う入力(本数・質量・位置・速度) / saturnD68Consistent=違う入力(本数・質量・位置・速度) / saturnD68ObsOrbit=違う入力(本数・質量・位置・速度)

**統廃合の候補**: 規則に当たる組は無い。

**畳まない組**: `saturnRingRealKF1`・`saturnRingReal`(較正の派生値 dfm / kf0(観測版と DFM 版を 1 ID にしない)・bodies は同じ) / `saturnRingRealKF1`・`saturnZonalD68`(較正の派生値 dfm / kf0(観測版と DFM 版を 1 ID にしない))

## 二重パルサー J0737−3039(`psrDoubleAB`・6 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ⚡ | `psrDoubleABDFM` | primary | 主系列(較正母集団) | 基準 | calibration・dfm | ○ | 2 | 1 | 0.006 | 3.24204e-7 | 3.1789 | 1.999942269345993(inertia-law-lin-v1) | — | — | 二重パルサーを質量補正と kF1 で照合 | `behavior.psrDoubleAB` |
| 📻 | `psrDoubleAB` | variant | 主系列(較正母集団) | 違う入力(質量) | calibration・kf0 | ○ | 2 | 0 | 0.006 | 3.24204e-7 | 3.1789 | — | — | — | 二重パルサーを kF0 で照合する | `behavior.psrDoubleAB` |
| 🧿 | `psrDoubleABSpinCal` | variant | 主系列(較正母集団) | 違う入力(質量) | calibration・dfm | ○ | 2 | 1 | 0.006 | 3.24204e-7 | 3.1789 | 1.999914(spin-spin-cal-v1) | — | — | f と λ を回した較正候補を比べる | — |
| 🪶 | `psrDoubleABPN` | variant | 主系列(較正母集団) | 同じ入力 | calibration・dfm | ○ | 2 | 1 | 0.006 | 3.24204e-7 | 3.1789 | 1.999942269345993(inertia-law-lin-v1) | — | — | 1PN の強さを 1/f で戻す応答候補 | — |
| 🪝 | `psrDoubleABCF` | variant | 主系列(較正母集団) | 同じ入力 | calibration・dfm | ○ | 2 | 1 | 0.006 | 3.24204e-7 | 3.1789 | 1.999942269345993(inertia-law-lin-v1) | — | — | 速度依存の追加力(案K)を試す | — |
| 🩻 | `psrDoubleABGeoToy` | variant | 診断(principle・geoPN=3) | 違う入力(質量) | principle | — | 3 | 0 | 0.006 | — | 3.1789 | — | — | vertex | 観測質量のまま geoPN=3 則を当てる診断 | — |

**鍵ごとの差**(physics の同じ鍵 21):

- `physics.D0pull`: psrDoubleABDFM=3.24204e-7 / psrDoubleAB=3.24204e-7 / psrDoubleABSpinCal=3.24204e-7 / psrDoubleABPN=3.24204e-7 / psrDoubleABCF=3.24204e-7 / psrDoubleABGeoToy=—
- `physics.cLight`: psrDoubleABDFM=3000 / psrDoubleAB=3000 / psrDoubleABSpinCal=3000 / psrDoubleABPN=2997.92458 / psrDoubleABCF=2997.92458 / psrDoubleABGeoToy=3000
- `physics.cmGauge`: psrDoubleABDFM=barycentric / psrDoubleAB=— / psrDoubleABSpinCal=barycentric / psrDoubleABPN=barycentric / psrDoubleABCF=barycentric / psrDoubleABGeoToy=—
- `physics.compactForce`: psrDoubleABDFM=— / psrDoubleAB=— / psrDoubleABSpinCal=— / psrDoubleABPN=— / psrDoubleABCF={"model":"current","kappa":12.015360249506628,"chiGate":0.5,"rc":0} / psrDoubleABGeoToy=—
- `physics.coupleSink`: psrDoubleABDFM=core / psrDoubleAB=reservoir / psrDoubleABSpinCal=core / psrDoubleABPN=core / psrDoubleABCF=core / psrDoubleABGeoToy=reservoir
- `physics.framePrecision`: psrDoubleABDFM=double / psrDoubleAB=— / psrDoubleABSpinCal=double / psrDoubleABPN=double / psrDoubleABCF=double / psrDoubleABGeoToy=double
- `physics.geoPN`: psrDoubleABDFM=2 / psrDoubleAB=2 / psrDoubleABSpinCal=2 / psrDoubleABPN=2 / psrDoubleABCF=2 / psrDoubleABGeoToy=3
- `physics.kFrame`: psrDoubleABDFM=1 / psrDoubleAB=0 / psrDoubleABSpinCal=1 / psrDoubleABPN=1 / psrDoubleABCF=1 / psrDoubleABGeoToy=0
- `physics.kappaT`: psrDoubleABDFM=7.415555555555556e-7 / psrDoubleAB=7.415555555555556e-7 / psrDoubleABSpinCal=7.415555555555556e-7 / psrDoubleABPN=7.42582647410185e-7 / psrDoubleABCF=7.42582647410185e-7 / psrDoubleABGeoToy=7.415555555555556e-7
- `physics.lambdaPN`: psrDoubleABDFM=1 / psrDoubleAB=1 / psrDoubleABSpinCal=1 / psrDoubleABPN=0.5000144330801174 / psrDoubleABCF=1 / psrDoubleABGeoToy=1
- `physics.spaceMesh`: psrDoubleABDFM=— / psrDoubleAB=— / psrDoubleABSpinCal=— / psrDoubleABPN=— / psrDoubleABCF=— / psrDoubleABGeoToy={"mode":"vertex","gravity":false,"inertia":false,"lawVersion":"local"}
- `physics.spinSpin`: psrDoubleABDFM=— / psrDoubleAB=— / psrDoubleABSpinCal=100000000000 / psrDoubleABPN=— / psrDoubleABCF=— / psrDoubleABGeoToy=—
- `massCalibration`: psrDoubleABDFM=(宣言あり) / psrDoubleAB=— / psrDoubleABSpinCal=(宣言あり) / psrDoubleABPN=(宣言あり) / psrDoubleABCF=(宣言あり) / psrDoubleABGeoToy=—
- `sampleClass`: psrDoubleABDFM=calibration / psrDoubleAB=calibration / psrDoubleABSpinCal=calibration / psrDoubleABPN=calibration / psrDoubleABCF=calibration / psrDoubleABGeoToy=principle
- `calVariant`: psrDoubleABDFM=dfm / psrDoubleAB=kf0 / psrDoubleABSpinCal=dfm / psrDoubleABPN=dfm / psrDoubleABCF=dfm / psrDoubleABGeoToy=—
- `familyRole`: psrDoubleABDFM=primary / psrDoubleAB=variant / psrDoubleABSpinCal=variant / psrDoubleABPN=variant / psrDoubleABCF=variant / psrDoubleABGeoToy=variant
- `gates(testId)`: psrDoubleABDFM=behavior.psrDoubleAB / psrDoubleAB=behavior.psrDoubleAB / psrDoubleABSpinCal=— / psrDoubleABPN=— / psrDoubleABCF=— / psrDoubleABGeoToy=—
- `bodies(vs 基準)`: psrDoubleABDFM=基準 / psrDoubleAB=違う入力(質量) / psrDoubleABSpinCal=違う入力(質量) / psrDoubleABPN=同じ入力 / psrDoubleABCF=同じ入力 / psrDoubleABGeoToy=違う入力(質量)

**統廃合の候補**(実行ではない):

| 規則 | 残す | 畳む | どう | 理由 |
|---|---|---|---|---|
| A | `psrDoubleAB` | `psrDoubleABGeoToy` | 器の中の写し(走行設定)として残し、内蔵 ID は畳む | bodies(質量・位置・速度)が psrDoubleAB と同じ・違うのは physics の D0pull・framePrecision・geoPN・spaceMesh |
| C | — | `psrDoubleABDFM` `psrDoubleABPN` | 要裁定(1 本 + 法則の切替に畳めるか) | 同じ bodies・同じ派生値 dfm・違うのは physics の cLight・kappaT・lambdaPN |
| C | — | `psrDoubleABDFM` `psrDoubleABCF` | 要裁定(1 本 + 法則の切替に畳めるか) | 同じ bodies・同じ派生値 dfm・違うのは physics の cLight・compactForce・kappaT |
| C | — | `psrDoubleABPN` `psrDoubleABCF` | 要裁定(1 本 + 法則の切替に畳めるか) | 同じ bodies・同じ派生値 dfm・違うのは physics の compactForce・lambdaPN |

**畳まない組**: `psrDoubleABDFM`・`psrDoubleAB`(較正の派生値 dfm / kf0(観測版と DFM 版を 1 ID にしない)) / `psrDoubleAB`・`psrDoubleABSpinCal`(較正の派生値 kf0 / dfm(観測版と DFM 版を 1 ID にしない)) / `psrDoubleAB`・`psrDoubleABPN`(較正の派生値 kf0 / dfm(観測版と DFM 版を 1 ID にしない)) / `psrDoubleAB`・`psrDoubleABCF`(較正の派生値 kf0 / dfm(観測版と DFM 版を 1 ID にしない))

## パルサー J1757−1854(`psrJ1757`・3 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🧮 | `psrJ1757DFM` | — | 主系列(較正母集団) | 基準 | calibration・dfm | ○ | 2 | 1 | 0.006 | 3.24204e-7 | 3.1726 | 1.9998956627766773(inertia-law-lin-v1) | — | — | ⚡ の処方を J1757 へ当てる | — |
| 🪃 | `psrJ1757PN` | variant | 主系列(較正母集団) | 同じ入力 | calibration・dfm | ○ | 2 | 1 | 0.006 | 3.24204e-7 | 3.1726 | 1.9998956627766773(inertia-law-lin-v1) | — | — | 1/f の応答候補を J1757 へ当てる | — |
| 🪄 | `psrJ1757CF` | — | 主系列(較正母集団) | 同じ入力 | calibration・dfm | ○ | 2 | 1 | 0.006 | 3.24204e-7 | 3.1726 | 1.9998956627766773(inertia-law-lin-v1) | — | — | 凍結した κ を J1757 へ流す | — |

**鍵ごとの差**(physics の同じ鍵 27):

- `physics.cLight`: psrJ1757DFM=3000 / psrJ1757PN=2997.92458 / psrJ1757CF=2997.92458
- `physics.compactForce`: psrJ1757DFM=— / psrJ1757PN=— / psrJ1757CF={"model":"current","kappa":12.015360249506628,"chiGate":0.5,"rc":0}
- `physics.kappaT`: psrJ1757DFM=7.415555555555556e-7 / psrJ1757PN=7.42582647410185e-7 / psrJ1757CF=7.42582647410185e-7
- `physics.lambdaPN`: psrJ1757DFM=1 / psrJ1757PN=0.5000260856666837 / psrJ1757CF=1
- `familyRole`: psrJ1757DFM=— / psrJ1757PN=variant / psrJ1757CF=—
- `bodies(vs 基準)`: psrJ1757DFM=基準 / psrJ1757PN=同じ入力 / psrJ1757CF=同じ入力

**統廃合の候補**(実行ではない):

| 規則 | 残す | 畳む | どう | 理由 |
|---|---|---|---|---|
| C | — | `psrJ1757DFM` `psrJ1757PN` | 要裁定(1 本 + 法則の切替に畳めるか) | 同じ bodies・同じ派生値 dfm・違うのは physics の cLight・kappaT・lambdaPN |
| C | — | `psrJ1757DFM` `psrJ1757CF` | 要裁定(1 本 + 法則の切替に畳めるか) | 同じ bodies・同じ派生値 dfm・違うのは physics の cLight・compactForce・kappaT |
| C | — | `psrJ1757PN` `psrJ1757CF` | 要裁定(1 本 + 法則の切替に畳めるか) | 同じ bodies・同じ派生値 dfm・違うのは physics の compactForce・lambdaPN |

## パルサー J1946+2052(`psrJ1946`・3 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🩺 | `psrJ1946DFM` | — | 主系列(較正母集団) | 基準 | calibration・dfm | ○ | 2 | 1 | 0.006 | 3.24204e-7 | 3.1856 | 1.9999655295617553(inertia-law-lin-v1) | — | — | ⚡ の処方を J1946 へ当てる | — |
| 🪀 | `psrJ1946PN` | variant | 主系列(較正母集団) | 同じ入力 | calibration・dfm | ○ | 2 | 1 | 0.006 | 3.24204e-7 | 3.1856 | 1.9999655295617553(inertia-law-lin-v1) | — | — | 1/f の応答候補を J1946 へ当てる | — |
| 🩹 | `psrJ1946CF` | — | 主系列(較正母集団) | 同じ入力 | calibration・dfm | ○ | 2 | 1 | 0.006 | 3.24204e-7 | 3.1856 | 1.9999655295617553(inertia-law-lin-v1) | — | — | 凍結した κ を J1946 へ流す | — |

**鍵ごとの差**(physics の同じ鍵 27):

- `physics.cLight`: psrJ1946DFM=3000 / psrJ1946PN=2997.92458 / psrJ1946CF=2997.92458
- `physics.compactForce`: psrJ1946DFM=— / psrJ1946PN=— / psrJ1946CF={"model":"current","kappa":12.015360249506628,"chiGate":0.5,"rc":0}
- `physics.kappaT`: psrJ1946DFM=7.415555555555556e-7 / psrJ1946PN=7.42582647410185e-7 / psrJ1946CF=7.42582647410185e-7
- `physics.lambdaPN`: psrJ1946DFM=1 / psrJ1946PN=0.5000086177580901 / psrJ1946CF=1
- `familyRole`: psrJ1946DFM=— / psrJ1946PN=variant / psrJ1946CF=—
- `bodies(vs 基準)`: psrJ1946DFM=基準 / psrJ1946PN=同じ入力 / psrJ1946CF=同じ入力

**統廃合の候補**(実行ではない):

| 規則 | 残す | 畳む | どう | 理由 |
|---|---|---|---|---|
| C | — | `psrJ1946DFM` `psrJ1946PN` | 要裁定(1 本 + 法則の切替に畳めるか) | 同じ bodies・同じ派生値 dfm・違うのは physics の cLight・kappaT・lambdaPN |
| C | — | `psrJ1946DFM` `psrJ1946CF` | 要裁定(1 本 + 法則の切替に畳めるか) | 同じ bodies・同じ派生値 dfm・違うのは physics の cLight・compactForce・kappaT |
| C | — | `psrJ1946PN` `psrJ1946CF` | 要裁定(1 本 + 法則の切替に畳めるか) | 同じ bodies・同じ派生値 dfm・違うのは physics の compactForce・lambdaPN |

## パルサー B1534+12(`psrB1534`・3 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 📿 | `psrB1534` | primary | 主系列(較正母集団) | 基準 | calibration・kf0 | ○ | 2 | 0 | 0.006 | 3.24204e-7 | 3.1652 | — | — | — | B1534 の観測入力を kF0 で確かめる | — |
| 🧶 | `psrB1534DFM` | variant | 主系列(較正母集団) | 違う入力(質量) | calibration・dfm | ○ | 2 | 1 | 0.006 | 3.24204e-7 | 3.1652 | 1.9994854557873434(inertia-law-lin-v1) | — | — | ⚡ の処方を B1534 へ当てる | — |
| 🪤 | `psrB1534CF` | variant | 主系列(較正母集団) | 違う入力(質量) | calibration・dfm | ○ | 2 | 1 | 0.006 | 3.24204e-7 | 3.1652 | 1.9994854557873434(inertia-law-lin-v1) | — | — | 凍結した κ を B1534 へ流す | — |

**鍵ごとの差**(physics の同じ鍵 29):

- `physics.compactForce`: psrB1534=— / psrB1534DFM=— / psrB1534CF={"model":"current","kappa":12.015360249506628,"chiGate":0.5,"rc":0}
- `physics.kFrame`: psrB1534=0 / psrB1534DFM=1 / psrB1534CF=1
- `massCalibration`: psrB1534=— / psrB1534DFM=(宣言あり) / psrB1534CF=(宣言あり)
- `calVariant`: psrB1534=kf0 / psrB1534DFM=dfm / psrB1534CF=dfm
- `familyRole`: psrB1534=primary / psrB1534DFM=variant / psrB1534CF=variant
- `bodies(vs 基準)`: psrB1534=基準 / psrB1534DFM=違う入力(質量) / psrB1534CF=違う入力(質量)

**統廃合の候補**(実行ではない):

| 規則 | 残す | 畳む | どう | 理由 |
|---|---|---|---|---|
| C | — | `psrB1534DFM` `psrB1534CF` | 要裁定(1 本 + 法則の切替に畳めるか) | 同じ bodies・同じ派生値 dfm・違うのは physics の compactForce |

**畳まない組**: `psrB1534`・`psrB1534DFM`(較正の派生値 kf0 / dfm(観測版と DFM 版を 1 ID にしない)) / `psrB1534`・`psrB1534CF`(較正の派生値 kf0 / dfm(観測版と DFM 版を 1 ID にしない))

## 重力波 GW150914(`gw150914`・4 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🎻 | `gw150914DFM` | primary | 主系列(較正母集団) | 基準 | calibration・dfm | ○ | 0 | 1 | 0.006 | 3.24204e-13 | 3.2552 | 1.9999999999889444(inertia-law-lin-v1) | — | — | GW150914 を kF1 と質量補正で回す | `behavior.gw150914` |
| 🎐 | `gw150914` | variant | 主系列(較正母集団) | 違う入力(質量) | calibration・kf0 | ○ | 0 | 0 | 0.006 | 3.24204e-13 | 3.2552 | — | — | — | GW150914 の合体前の基準状態を転写する | `behavior.gw150914` |
| ⏰ | `gw150914Merge4s` | variant | 主系列(較正母集団) | 同じ入力 | calibration・dfm | ○ | 0 | 1 | 0.006 | 3.24204e-13 | 3.2552 | — | — | — | 放射の向きと量を宣言して約 4 秒の合体を回す | — |
| ⚛️ | `gw150914SpinDipole` | variant | 比較(上のどれでもない) | 違う入力(質量) | principle | — | 0 | 0 | 0.006 | 3.24204e-13 | 3.2552 | — | — | — | 合体直前で λ=1 のスピン双極子の強さを測る | — |

**鍵ごとの差**(physics の同じ鍵 28):

- `physics.kFrame`: gw150914DFM=1 / gw150914=0 / gw150914Merge4s=1 / gw150914SpinDipole=0
- `physics.ledger`: gw150914DFM={"dragWork":true} / gw150914=— / gw150914Merge4s=— / gw150914SpinDipole=—
- `physics.petersDirection`: gw150914DFM=— / gw150914=— / gw150914Merge4s=tangential / gw150914SpinDipole=—
- `physics.petersGW`: gw150914DFM=— / gw150914=— / gw150914Merge4s=true / gw150914SpinDipole=—
- `physics.petersScale`: gw150914DFM=— / gw150914=— / gw150914Merge4s=0.1313 / gw150914SpinDipole=—
- `physics.spinSpin`: gw150914DFM=— / gw150914=— / gw150914Merge4s=1 / gw150914SpinDipole=1
- `fusion`: gw150914DFM=— / gw150914=— / gw150914Merge4s=(宣言あり) / gw150914SpinDipole=—
- `massCalibration`: gw150914DFM=(宣言あり) / gw150914=— / gw150914Merge4s=— / gw150914SpinDipole=—
- `thermal`: gw150914DFM=— / gw150914=— / gw150914Merge4s=tint / gw150914SpinDipole=—
- `sampleClass`: gw150914DFM=calibration / gw150914=calibration / gw150914Merge4s=calibration / gw150914SpinDipole=principle
- `calVariant`: gw150914DFM=dfm / gw150914=kf0 / gw150914Merge4s=dfm / gw150914SpinDipole=—
- `familyRole`: gw150914DFM=primary / gw150914=variant / gw150914Merge4s=variant / gw150914SpinDipole=variant
- `gates(testId)`: gw150914DFM=behavior.gw150914 / gw150914=behavior.gw150914 / gw150914Merge4s=— / gw150914SpinDipole=—
- `bodies(vs 基準)`: gw150914DFM=基準 / gw150914=違う入力(質量) / gw150914Merge4s=同じ入力 / gw150914SpinDipole=違う入力(質量)

**統廃合の候補**(実行ではない):

| 規則 | 残す | 畳む | どう | 理由 |
|---|---|---|---|---|
| C | — | `gw150914DFM` `gw150914Merge4s` | 要裁定(1 本 + 法則の切替に畳めるか) | 同じ bodies・同じ派生値 dfm・違うのは physics の ledger・petersDirection・petersGW・petersScale・spinSpin |

**畳まない組**: `gw150914DFM`・`gw150914`(較正の派生値 dfm / kf0(観測版と DFM 版を 1 ID にしない)) / `gw150914`・`gw150914Merge4s`(較正の派生値 kf0 / dfm(観測版と DFM 版を 1 ID にしない))

## ケンタウルス座 α 星 AB(`alphaCen`・2 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ✴️ | `alphaCenABDFM` | primary | 主系列(較正母集団) | 基準 | calibration・dfm | ○ | 2 | 1 | 0.006 | 0.324204 | 4.6111 | 1(f-fixed-1) | — | — | 観測質量のまま kF1 を α Cen へ当てる | `behavior.alphaCenAB` |
| ✨ | `alphaCenAB` | variant | 主系列(較正母集団) | 同じ入力 | calibration・kf0 | ○ | 2 | 0 | 0.006 | 0.324204 | 4.6111 | — | — | — | α Cen AB を kF0 で照合する | `behavior.alphaCenAB` |

**鍵ごとの差**(physics の同じ鍵 26):

- `physics.cmGauge`: alphaCenABDFM=barycentric / alphaCenAB=—
- `physics.coupleSink`: alphaCenABDFM=reservoir / alphaCenAB=—
- `physics.kFrame`: alphaCenABDFM=1 / alphaCenAB=0
- `massCalibration`: alphaCenABDFM=(宣言あり) / alphaCenAB=—
- `calVariant`: alphaCenABDFM=dfm / alphaCenAB=kf0
- `familyRole`: alphaCenABDFM=primary / alphaCenAB=variant
- `bodies(vs 基準)`: alphaCenABDFM=基準 / alphaCenAB=同じ入力

**統廃合の候補**: 規則に当たる組は無い。

**畳まない組**: `alphaCenABDFM`・`alphaCenAB`(較正の派生値 dfm / kf0(観測版と DFM 版を 1 ID にしない)・bodies は同じ)

## シリウス AB(`sirius`・2 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 💫 | `siriusABDFM` | primary | 主系列(較正母集団) | 基準 | calibration・dfm | ○ | 2 | 1 | 0.006 | 0.324204 | 4.6761 | 1(f-fixed-1) | — | — | 観測質量のまま kF1 をシリウスへ当てる | `behavior.siriusAB` |
| 🌟 | `siriusAB` | variant | 主系列(較正母集団) | 同じ入力 | calibration・kf0 | ○ | 2 | 0 | 0.006 | 0.324204 | 4.6761 | — | — | — | シリウス AB を kF0 で照合する | `behavior.siriusAB` |

**鍵ごとの差**(physics の同じ鍵 26):

- `physics.cmGauge`: siriusABDFM=barycentric / siriusAB=—
- `physics.coupleSink`: siriusABDFM=reservoir / siriusAB=—
- `physics.kFrame`: siriusABDFM=1 / siriusAB=0
- `massCalibration`: siriusABDFM=(宣言あり) / siriusAB=—
- `calVariant`: siriusABDFM=dfm / siriusAB=kf0
- `familyRole`: siriusABDFM=primary / siriusAB=variant
- `bodies(vs 基準)`: siriusABDFM=基準 / siriusAB=同じ入力

**統廃合の候補**: 規則に当たる組は無い。

**畳まない組**: `siriusABDFM`・`siriusAB`(較正の派生値 dfm / kf0(観測版と DFM 版を 1 ID にしない)・bodies は同じ)

## 銀河回転(空間メッシュ・アナロジー)(`galaxyMesh`・4 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🎠 | `galaxyMeshSpiral` | — | 主系列(母集団の外の家族の基準の本) | 基準 | principle | — | 0 | 1 | 1.5 | — | 2 | — | — | — | 銀河の空間メッシュを局所場と物質線で表す | — |
| 🪁 | `galaxyMeshSpiralGeoToy` | — | 診断(principle・geoPN=3) | 同じ入力 | principle | — | 3 | 0 | 1.5 | — | 2 | — | — | vertex | 🎠 の配置で法則だけ geoPN=3 に替えて比べる | — |
| 🎋 | `galaxyMeshSpiralGeoToyLite` | — | 診断(principle・geoPN=3) | 同じ入力 | principle | — | 3 | 0 | 1.5 | — | 2 | — | — | vertex | 🪁 を円盤 80 粒に軽くした比較用の写し | — |
| 🌚 | `galaxyAnalogyBH` | — | 診断(principle・geoPN=3) | 違う入力(本数・質量・位置・速度) | principle | — | 3 | 0 | 1.5 | — | 2 | — | — | vertex | 中心 DFM 版 BH と恒星質量ダークローターを力学の質量要素に置いた銀河アナロジー | — |

**鍵ごとの差**(physics の同じ鍵 23):

- `physics.geoPN`: galaxyMeshSpiral=0 / galaxyMeshSpiralGeoToy=3 / galaxyMeshSpiralGeoToyLite=3 / galaxyAnalogyBH=3
- `physics.kFrame`: galaxyMeshSpiral=1 / galaxyMeshSpiralGeoToy=0 / galaxyMeshSpiralGeoToyLite=0 / galaxyAnalogyBH=0
- `physics.ledger`: galaxyMeshSpiral={"dragWork":true} / galaxyMeshSpiralGeoToy=— / galaxyMeshSpiralGeoToyLite=— / galaxyAnalogyBH=—
- `physics.spaceMesh`: galaxyMeshSpiral=— / galaxyMeshSpiralGeoToy={"mode":"vertex","gravity":false,"inertia":false,"lawVersion":"scalar"} / galaxyMeshSpiralGeoToyLite={"mode":"vertex","gravity":false,"inertia":false,"lawVersion":"scalar"} / galaxyAnalogyBH={"mode":"vertex","gravity":false,"inertia":false,"lawVersion":"scalar","centerSpin":"read"}
- `seed`: galaxyMeshSpiral=20260910 / galaxyMeshSpiralGeoToy=20260910 / galaxyMeshSpiralGeoToyLite=20260910 / galaxyAnalogyBH=20260925
- `bodies(vs 基準)`: galaxyMeshSpiral=基準 / galaxyMeshSpiralGeoToy=同じ入力 / galaxyMeshSpiralGeoToyLite=同じ入力 / galaxyAnalogyBH=違う入力(本数・質量・位置・速度)

**統廃合の候補**(実行ではない):

| 規則 | 残す | 畳む | どう | 理由 |
|---|---|---|---|---|
| A | `galaxyMeshSpiral` | `galaxyMeshSpiralGeoToy` | 器の中の写し(走行設定)として残し、内蔵 ID は畳む | bodies(質量・位置・速度)が galaxyMeshSpiral と同じ・違うのは physics の geoPN・kFrame・ledger・spaceMesh |
| A | `galaxyMeshSpiral` | `galaxyMeshSpiralGeoToyLite` | 器の中の写し(走行設定)として残し、内蔵 ID は畳む | bodies(質量・位置・速度)が galaxyMeshSpiral と同じ・違うのは physics の geoPN・kFrame・ledger・spaceMesh |

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
| 🫐 | `tuc47DFM` | primary | 主系列(母集団の外の家族の入口(primary)) | 基準 | principle | — | 0 | 1 | 0.006 | — | 2 | 1.9934013530695391(chi-law-v1-meanfield) | — | — | 連星の質量補正を星団へ当てる hold-out | — |
| 🍇 | `tuc47` | variant | 比較(上のどれでもない) | 同じ入力 | principle | — | 0 | 0 | 0.006 | — | 2 | — | — | — | 47 Tuc の配置と速度を観測から転写する | — |

**鍵ごとの差**(physics の同じ鍵 24):

- `physics.kFrame`: tuc47DFM=1 / tuc47=0
- `massCalibration`: tuc47DFM=(宣言あり) / tuc47=—
- `familyRole`: tuc47DFM=primary / tuc47=variant
- `bodies(vs 基準)`: tuc47DFM=基準 / tuc47=同じ入力

**統廃合の候補**: 規則に当たる組は無い。

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

## 形の玩具 6 本(`shapeToy`・6 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🔮 | `shapeToyCluster` | — | 主系列(母集団の外の家族の基準の本) | 基準 | principle | — | 0 | 0 | 2 | — | 2 | — | — | — | 指定した 3D 正規分布を保つ参照模型 | — |
| 🥏 | `shapeToyDisk` | — | 比較(上のどれでもない) | 同じ入力 | principle | — | 0 | 0 | 2 | — | 2 | — | — | — | 指定した薄い回転円盤を保つ参照模型 | — |
| 🧵 | `shapeToyArm` | — | 比較(上のどれでもない) | 違う入力(位置・速度) | principle | — | 0 | 0 | 2 | — | 2 | — | — | — | 腕の軸に対する正規分布を保つ参照模型 | — |
| 🎱 | `shapeToyClusterCore` | — | 比較(上のどれでもない) | 違う入力(本数・質量・位置・速度) | principle | — | 0 | 0 | 2 | — | 2 | — | — | — | 中心スピンに依存する力学で星団を束ねる | — |
| 📀 | `shapeToyDiskCore` | — | 比較(上のどれでもない) | 違う入力(本数・質量・位置・速度) | principle | — | 0 | 0 | 2 | — | 2 | — | — | — | 中心スピンから薄さと円盤の回転を作る | — |
| 🧹 | `shapeToyArmCore` | — | 比較(上のどれでもない) | 違う入力(本数・質量・位置・速度) | principle | — | 0 | 0 | 2 | — | 2 | — | — | — | 面内の自転軸に沿った棒を作る | — |

**鍵ごとの差**(physics の同じ鍵 24):

- `physics.contactCap`: shapeToyCluster=— / shapeToyDisk=— / shapeToyArm=— / shapeToyClusterCore=0 / shapeToyDiskCore=0 / shapeToyArmCore=0
- `physics.contactK`: shapeToyCluster=— / shapeToyDisk=— / shapeToyArm=— / shapeToyClusterCore=0 / shapeToyDiskCore=0 / shapeToyArmCore=0
- `physics.shapeToy`: shapeToyCluster={"shape":"cluster","supply":"external-bath","omega0":0.1,"gamma":0.25,"sigma":36,"sigmaZ":36,"sigma0":36,"tauGrow":0,"center":"fixed","coupling":"prescribed","cx":0,"cy":0,"omegaSpin":0,"armLength":0,"armLength0":0} / shapeToyDisk={"shape":"disk","supply":"external-bath","omega0":0.01,"gamma":0.02,"sigma":44,"sigmaZ":14,"sigma0":44,"tauGrow":0,"center":"fixed","coupling":"prescribed","cx":0,"cy":0,"omegaSpin":0.05,"armLength":0,"armLength0":0} / shapeToyArm={"shape":"arm","supply":"external-bath","omega0":0.12,"gamma":0.24,"sigma":7.2,"sigmaZ":4.8,"sigma0":7.2,"tauGrow":0,"center":"fixed","coupling":"prescribed","cx":0,"cy":0,"omegaSpin":0,"armLength":120,"armLength0":120} / shapeToyClusterCore={"shape":"cluster","supply":"external-bath","omega0":0.1,"gamma":0.25,"sigma":36,"sigmaZ":36,"sigma0":36,"tauGrow":0,"center":"pinned","coupling":"prescribed","cx":0,"cy":0,"omegaSpin":0,"armLength":0,"armLength0":0,"law":"coreField","coreField":{"coreRc":125,"coreMass":10,"alpha":1.1,"beta":0.1,"axis":[0,0,1],"W0":0.00064,"temp":19.44,"omegaP":0,"init":"thermal","centreGravity":"phi","exchange":{"mode":"rotating-bath","rate":0.02,"capacity":20000}}} / shapeToyDiskCore={"shape":"disk","supply":"external-bath","omega0":0.01,"gamma":0.02,"sigma":44,"sigmaZ":14,"sigma0":44,"tauGrow":0,"center":"pinned","coupling":"prescribed","cx":0,"cy":0,"omegaSpin":0.05,"armLength":0,"armLength0":0,"law":"coreField","coreField":{"coreRc":160,"coreMass":10,"alpha":1.05,"beta":7.8,"axis":[0,0,1],"W0":0.0044921875,"temp":3.624,"omegaP":0.14,"init":"thermal","centreGravity":"phi","exchange":{"mode":"rotating-bath","rate":0.02,"capacity":20000}}} / shapeToyArmCore={"shape":"arm","supply":"external-bath","omega0":0.12,"gamma":0.24,"sigma":7.2,"sigmaZ":4.8,"sigma0":7.2,"tauGrow":0,"center":"pinned","coupling":"prescribed","cx":0,"cy":0,"omegaSpin":0,"armLength":120,"armLength0":120,"law":"coreField","coreField":{"coreRc":250,"coreMass":10,"alpha":2,"beta":0.0108,"axis":[1,0,0],"W0":0.00016,"temp":7.776,"omegaP":0,"init":"thermal","centreGravity":"phi","exchange":{"mode":"rotating-bath","rate":0.02,"capacity":20000}}}
- `seed`: shapeToyCluster=20260919 / shapeToyDisk=20260919 / shapeToyArm=20260919 / shapeToyClusterCore=20260920 / shapeToyDiskCore=20260920 / shapeToyArmCore=20260920
- `bodies(vs 基準)`: shapeToyCluster=基準 / shapeToyDisk=同じ入力 / shapeToyArm=違う入力(位置・速度) / shapeToyClusterCore=違う入力(本数・質量・位置・速度) / shapeToyDiskCore=違う入力(本数・質量・位置・速度) / shapeToyArmCore=違う入力(本数・質量・位置・速度)

**統廃合の候補**: 規則に当たる組は無い。

## 超新星の親星(`supernova`・2 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🌹 | `supernovaProgDFM` | — | 主系列(母集団の外の家族の基準の本) | 基準 | principle | — | 0 | 1 | 0.006 | — | 2 | 2(chi-law-v1-transfer) | — | — | 質量台帳 f=2 の前駆星を比べる | — |
| 🥀 | `supernovaProg` | — | 比較(上のどれでもない) | 違う入力(質量) | principle | — | 0 | 0 | 0.006 | — | 2 | — | — | — | ベテルギウスの前駆星状態を転写する | — |

**鍵ごとの差**(physics の同じ鍵 23):

- `physics.coupleSink`: supernovaProgDFM=reservoir / supernovaProg=core
- `physics.kFrame`: supernovaProgDFM=1 / supernovaProg=0
- `massCalibration`: supernovaProgDFM=(宣言あり) / supernovaProg=—
- `bodies(vs 基準)`: supernovaProgDFM=基準 / supernovaProg=違う入力(質量)

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
- `familyRole`: grcal=primary / grcalGps=variant / grcalLight=variant / grcalShapiro=variant
- `gates(testId)`: grcal=— / grcalGps=behavior.grcal3 / grcalLight=behavior.grcal3 / grcalShapiro=behavior.grcal3
- `bodies(vs 基準)`: grcal=基準 / grcalGps=違う入力(本数・質量・位置・速度) / grcalLight=違う入力(質量・位置・速度) / grcalShapiro=違う入力(質量・位置・速度)

**統廃合の候補**: 規則に当たる組は無い。

## ダークローター(退役の文脈)(`rotor`・10 本)

| 絵文字 | ID | familyRole | 推定の列 | 入力 | 分類・派生値 | 母集団 | geoPN | kFrame | D0 | D0pull | q | f(massCalibration) | relativeDrag | spaceMesh | 目的 | 門(testId) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 🕳️ | `rotorSolo` | primary | 主系列(母集団の外の家族の入口(primary)) | 基準 | principle | — | 0 | 1 | 2 | — | 2 | — | — | — | 単体ローターの掻き出しと減光を測る | `behavior.rotorSolo` |
| 🪜 | `massLadder` | variant | 比較(上のどれでもない) | 違う入力(本数・質量・位置・速度) | composite | — | 0 | 1 | 1.5 | — | 2 | — | — | — | 暗い中心の力学質量を 3 段で比べる | `claim.massladder` |
| 🥚 | `selfRotor` | primary | 主系列(母集団の外の家族の入口(primary)) | 違う入力(本数・質量・位置・速度) | composite | — | 0 | 1 | 2 | — | 2 | — | — | — | 一様な雲から暗く回る中心が育つかを見る | `behavior.selfrotor` `behavior.selfrotor-multiseed` |
| 🕶️ | `darkrotor` | retired | 履歴(familyRole "retired") | 違う入力(本数・質量・位置・速度) | composite | — | 0 | 1 | 2 | — | 2 | — | — | — | 暗いローターが作る腕の強さと減光を測る | `behavior.darkrotor-multiseed` `behavior.darkrotor-pitch` `behavior.darkrotorLong` |
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

## 退役 7 本の棚卸し(統括の検証項目 R84)

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

- **ゲートから外した長走行**: `darkrotorMidNew`・`darkrotorMidOld`・`darkrotorLong`・`darkrotorMultiseed`(保存 QA の worker の所要の和 341.6 s)と、その結果を読む試験 `behavior.darkrotor`・`behavior.darkrotorLong`・`behavior.darkrotor-pitch`・`behavior.darkrotor-multiseed`。最後の保存 QA の値は凍結の写しの history に転記した(測り直していない)。
- **機構の最小試験**(ゲートに残す 1 点ずつ): コアの交換(殻のスピン移送) = `claim.bhcore-selfdrive`(bhCore) / 傾斜(コア軸の横倒しで Jz が機械ゼロ・減光は保つ) = `behavior.templates229`(bhCoreTilt) / 減光(暗いコアと明るい外層のコントラスト) = `claim.nebularotor-contrast`(nebulaRotor) / パワーボール(圧縮と軸仕事の経路) = `claim.starseed-powerball`(starSeed)。
- **名指しする器**(tests/*.mjs・tools/*.mjs —— QA 本体を除く 37 本): 凍結の写しを読む 2・再生成表の履歴 22・再生成表の現行 0・道具 4・表の外 9。QA 本体の出現数: darkrotor 130・bhCore 44・nebulaRotor 15・nebulaShell 14・nebulaBipolar 21・starSeed 15・bhCoreTilt 13。

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
| `tests/exp-w249c.mjs` | darkrotor | — | 表の外(正本ではない) |
| `tests/exp-w257c-mesh.mjs` | starSeed | — | 表の外(正本ではない) |
| `tests/exp-w258e-jitprobe.mjs` | bhCore | — | 道具(正本を書かない) |
| `tests/exp-w262b-migrate.mjs` | bhCoreTilt | h283b-exp-w262b-migrate(history) | 履歴(再生成しない) |
| `tests/exp-w263b-beui.mjs` | bhCore | — | 表の外(正本ではない) |
| `tests/exp-w264c-benums.mjs` | bhCore | — | 表の外(正本ではない) |
| `tests/exp-w265d-lfbot.mjs` | bhCore | h283b-exp-w265d-lfbot(history) | 履歴(再生成しない) |
| `tests/exp-w281c-rotorledger.mjs` | darkrotor | rotorledger(current) | 凍結の写しを読む |
| `tests/exp-w281e-canvasskin.mjs` | bhCore | — | 道具(正本を書かない) |
| `tests/exp-w282d-analogy.mjs` | bhCore | analogy(current) | 凍結の写しを読む |
| `tests/lib-w279a-samplestatus.mjs` | bhCore bhCoreTilt | — | 表の外(正本ではない) |
| `tests/perf.mjs` | darkrotor bhCore nebulaRotor nebulaShell nebulaBipolar starSeed | — | 道具(正本を書かない) |
| `tests/probe-perf-floor.mjs` | starSeed | — | 道具(正本を書かない) |
| `tests/seeds.mjs` | darkrotor | h283b-seeds(history) | 履歴(再生成しない) |

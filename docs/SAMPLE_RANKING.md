# サンプルの伝わりやすさランク(整理用台帳)

- 版: v6d(第256便b・2026-09-11 — 第48報「銀河」: 🎠 galaxyMeshSpiral の**場の既定**を `overlays.galaxyField:{unSource:"disk",unFit:"affine"}` へ(署名便)。**表示と記録だけの変更**で、力学もランクも動いていない)。
- 版: v6c(第255便c・2026-09-11 — 第47報「空間線」: 🫂🪟 の既定表示を格子(guide/transport)から**空間線**(`overlays.spaceMeshMode:"lines"`)へ、🎠 は物質線に空間線を追加で描く。**表示だけの変更**で、ランクも力学も動いていない)。
- 版: v6(第254便a/b・2026-09-10 — 第46報「空間メッシュ」: 🪟 spaceMeshBinaryToy〔メッシュの重力は既にある重力〕を「空間と時間」へ、🎠 galaxyMeshSpiral〔局所場 χ(r)+物質線の巻き込み・**力は未接続**〕を「銀河の物語」へ追加)。
- 版: v5(第252便a・2026-09-10 — 第44報「箱宇宙と連星」: 🫂 boxBinaryToy〔等質量だと背景に対する移動が消える〕を「空間と時間」へ追加)。
- 版: v4(第247便d・2026-09-07 — 裁定 A5′(2): 🪞 mmPhaseToy〔MM 2 腕干渉計の位相玩具〕を「光の物語」へ追加)。
- 版: v3(第246便・2026-09-07 — 第38報「サンプルの調整」: 🔵 nsRemnantDFM を 🎇 supernovaCore へ統合・廃止し、🎇⚪ の一言を更新)。目的: **カタログ整理の指針**(外部レビュー2系の裁定統合)。
- 評価軸: 「画面を見て、カードを開く前に、何の法則か言えるか」— 物理主張の当否ではなく
  **問い・操作・合否の伝わりやすさ**。失敗を明記するサンプルは失敗の読み取りやすさで評価する。
- ランク: **S**=1画面1法則・数秒で見える / **A**=対や1概念の前提で伝わる / **B**=カードを読めば伝わる /
  **C**=監査・複合・過密 — 入口にしない。
- 本表は宣言専用(物理・QA には影響しない)。ランクの根拠が変わったら版を上げて更新する。

## 入口として推す10本(新しい人に出す順)

1. ⚾ projectile(力学が動く) 2. ⏱️ gclock(DFM の時間) 3. 💡 lensing(光)
4. ✴️ alphaCenABDFM(連星較正の型) 5. 🎡 galaxyStd(引きずりの基準) 6. ⚫ bhCore(暗い核の型)
7. 🏮 pulsarSolo(軸と時計) 8. 🎇 supernovaCore(1つの星が外殻を吹き飛ばす)
9. 🍇 tuc47(形の転写) 10. 🌃 ngc3198(平坦回転と NFW 対照)

## ランク表(第245便で ☀️🌻🍊🍂🌋⛲ の 6 本を廃止・⚪🔵🎆 を追加 / **第246便で 🔵 を 🎇 へ統合・廃止** / **第247便d で 🪞 mmPhaseToy を追加** / **第252便a で 🫂 boxBinaryToy を追加** / **第254便a で 🪟 spaceMeshBinaryToy を追加**。
本表は宣言専用の整理台帳であり、内蔵サンプルの全数(第247便d 時点で 99 本)を必ずしも網羅しない)

### 空間と時間
| ID | Rank | 一言 |
|---|:---:|---|
| gclock | S | 4時計の差が即座・問いが一つ |
| grcal | B | 分解3サンプルと重複(入口は分解側) |
| grcalGps | S | 重力項と速度項の対照が明確 |
| grcalLight | S | 1.75″ の単一合否値 |
| grcalShapiro | S | 往復信号と遅延が対応 |
| projectile | S | 等価原理と放物線が一目 |
| echo | S | 反転と散逸対照が劇的 |
| boxBinaryToy | A | 等質量では背景に対する移動が相対軌道から消える(kF0 対照つき)— 「消えないもの」を明記する必要がある |
| spaceMeshBinaryToy | A | 第255便c から**空間線**(主要 2 天体と重心から飛ばす線)が公転に随伴するのが見える(輸送された物質線は宣言時だけの診断表示へ)。ただし**主張は否定側**(メッシュの重力は既にある重力で、繋いでも何も変わらない)なので、A/B で「変わらないこと」を読ませる説明が要る |

### 箱宇宙
| ID | Rank | 一言 |
|---|:---:|---|
| boxtrans | A | 明快だが抽象度が高い |
| boxrot | A | 回転座標との比較がしやすい |
| boxexpand | A | 「不足の実測」がテーマ(C 評もあり — 記録) |
| boxcomoving | B | 座標と時計を同時に扱う |
| boxbound | S | 問いが明快 |
| boxbreath | A | 周期膨張と時計が対応 |
| boxredshift | S | 3対照で原因を分離 |
| probeH | B | 前提説明が多い |
| freebox | B | 9体の役割が密 |
| cosmicweb | A | 競合が視覚的 |

### 銀河の物語
| ID | Rank | 一言 |
|---|:---:|---|
| galaxy | B | 旧総合版 — 🎡 と重複(入口は 🎡) |
| galaxyStd | S | 基準対照として最短 |
| galaxyGeo2 | A | 差は明確・式の前提が要る |
| galaxyDB | S | 回転支持/分散支持を並置 |
| collapse | A | 中心形成が直観的 |
| galaxyMeshSpiral | B | 物質線が中心ほど速く巻くのは見える — ただし **χ(r) と「力は載せていない」はカードで読む**(第254便b)。**第256便b で場の既定が disk/affine になった**(`overlays.galaxyField` — 表示と記録だけ・ランクは不変) |

### ローターの物語
| ID | Rank | 一言 |
|---|:---:|---|
| darkrotor | B | 多機構・長い観察窓 |
| rotorSolo | S | 暗さを最小構成で示す |
| nebulaRotor | A | 暗い核/明るい縁が明快 |
| nebulaShell | A | 殻・束縛・減光を分離 |
| nebulaBipolar | B | 24体の複合で主因が薄い |
| bhCore | B | 5層同居(ただし較正の「核の型」として重要) |
| bhCoreTilt | A | 軸と減光の問いが単純 |
| massLadder | S | 1:2:4 比較が非常に明快 |
| selfRotor | C | 長時間・多機構で成立条件が読みにくい(第236便: summary に成立条件3つを明記) |
| starSeed | A | 圧縮とスピンアップを追える |

### 光の物語
| ID | Rank | 一言 |
|---|:---:|---|
| lensing | S | 直観的 |
| spinlens | A | 左右非対称が見える |
| blens | A | 複雑だが視覚目標は明快 |
| reddening | S | 波長依存を色で読める |
| mmPhaseToy | B | 画面は装置の姿だけ — 階段(1)〜(5)の数字はカードで読む(第247便d) |

### 熱の実験室
| ID | Rank | 一言 |
|---|:---:|---|
| gas | A | 静的で変化が弱い |
| pressure | S | 一因一果 |
| conduction | S | 距離と速度が直接対応 |
| frictionHeat | S | 運動→熱が明快 |
| coolrace | S | 高温ほど速い比較 |
| convection | A | 見えるが複合機構 |
| buoyancy | A | 対照が明快 |
| cooling | A | 日常比喩との対応説明が要る |
| emergent | B | 三態と予算を同時に読む |
| emergent2 | B | 二重主題 |
| chain2 | A | 予算2・180° に焦点 |
| chaincycle | A | 履歴が読める |

### 天体の物語
| ID | Rank | 一言 |
|---|:---:|---|
| earthMoon | A | トイ比と実系の区別が必要 |
| earthMoonFree | S | 重心運動が明快 |
| mercury | A | 長時間観察が必要 |
| saturn | B | 否定対照が主題を複雑化 |
| saturnLayered | C | 二層効果が前面に出ない(第236便: summary を「あるが微弱」先出しに短文化) |
| binary | A | 構造が直観的 |
| fig8 | S | 視覚目標が明快 |
| counterring | S | 衝突差が即座に見える |
| spinup | S | 一因一果 |
| pulsarSolo | A | 灯台・軸・時計を整理(第245便: L3 再転写+周期 2.773 s の画面表示で S 寄りへ) |
| supernovaCore | S | **赤色巨星 1 体**が多層に割れた外殻を吹き飛ばし、時計つきの核が残る(第246便: 🔵 を統合) |
| envelopeShedDFM | S | 「殻が割れて出る」機構そのもの — 4帳簿が発火の1步で閉じる(第245便: n 32 で密に) |
| whiteDwarfDFM | A | 赤色巨星の外殻が**徐々に剥がれる**(反復 shed 4 回)。**何回でも「コアだけ」にはならない**限界を明示(第246便) |

### 現実との照合・太陽系
| ID | Rank | 一言 |
|---|:---:|---|
| earthMoonReal | S | 恒星月との対応が閉じる |
| earthMoonRealKF1 | A | 別機構較正の前提が必要 |
| emAuditNewton | S | 閉じた楕円の基準 |
| emAuditDFM | A | 別機構の識別実験 |
| emAuditSolar | S | 無較正 hold-out が強い |
| qLockRadialAudit | B | 11体・6カードで過密(監査) |
| qLockRadialAuditQ3 | A | 役割が明快 |
| mercuryReal | S | 43″/世紀の単一合否値 |
| mercuryRealKF1 | A | 共通補正込みで長い |
| solarInner | A | 複数惑星を比較可能 |
| jupiterGalilean | A | hold-out は強いが密 |
| venusReal | A | 自由中心二体が明快 |
| marsMoonsReal | A | テスト粒子降格が明示 |
| plutoCharonReal | S | 外部重心が視覚的 |
| uranusReal | B | 17体・長文 |
| neptuneReal | A | 逆行が明快 |
| saturnZonalD68 | A | 合否値が明確 |
| saturnRingReal | B | 「見えないのが正しい」— 絵の反応が弱い |
| saturnRingRealKF1 | B | 随伴と q 自動算出が同居 |

### 現実との照合・太陽系外
| ID | Rank | 一言 |
|---|:---:|---|
| alphaCenAB | A | 観測連星基準として明快 |
| alphaCenABDFM | B | ロゼットは S 級・説明が過密(短文化はキュー) |
| siriusAB | A | 白色矮星との観測対が明快 |
| siriusABDFM | B | 半径下限・自転代理・較正が同居 |
| supernovaProgDFM | B | 🥀 の DFM 対 — 台帳と R_drag 逆算の宣言(第233便) |
| psrDoubleAB | B | 重要だが説明が長い |
| psrDoubleABDFM | C | 4主題が競合(第236便: summary を 3001→約900字へ短文化) |
| gw150914 | A | 二体基準として明快 |
| gw150914DFM | B | DFM 離散化と外部 Peters が同居 |
| gw150914Merge4s | B | ⏰ 第247便b: 約4秒の合体が見える・**用量 a=0.1313 は fit** で仮定も多い(正直な列挙あり) |
| gw150914SpinDipole | B | ⚛️ 第247便b: λ=1 の届く場所を1本で示す・主題は明快だが原理サンプルとして地味 |
| tuc47 | B | 形は良い・2D 分散は未較正(seed 明示で配置契約は成立 — 第230便) |
| tuc47DFM | B | 第230便: f=2 で kF1/kF0 が画面で分離+正直な hold-out(C→B) |
| ngc3198 | A | NFW 否定対照が強い |
| ngc3198DFM | B | 第230便: f=2 hold-out の宣言が主題に(C→B) |

## 整理の方針(裁定)

1. **入口はランク S+較正の型**(上の10本)。監査系(qLockRadialAudit・emAudit 群・箱宇宙後半)は
   折り畳み側 — 配列・物理は触らない(表示整理はキュー)。
2. **地球月ファミリー(7本)の入口は 🌘(kF1 較正)と 🔆(太陽摂動)の2本**、銀河回転の入口は 🎡。
3. C ランク(selfRotor・saturnLayered・psrDoubleABDFM)は説明の短文化
   (問い/操作/合否の3段化)を優先キューに載せる — 物理・QA は変えない。
4. 本表と実装の不一致に気付いたら、表の側を直す(表示専用 — 機械固定はしない)。

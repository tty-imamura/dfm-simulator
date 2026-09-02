# サンプルの伝わりやすさランク(整理用台帳)

- 版: v1(第230便・2026-09-01)。目的: **カタログ整理の指針**(外部レビュー2系の裁定統合)。
- 評価軸: 「画面を見て、カードを開く前に、何の法則か言えるか」— 物理主張の当否ではなく
  **問い・操作・合否の伝わりやすさ**。失敗を明記するサンプルは失敗の読み取りやすさで評価する。
- ランク: **S**=1画面1法則・数秒で見える / **A**=対や1概念の前提で伝わる / **B**=カードを読めば伝わる /
  **C**=監査・複合・過密 — 入口にしない。
- 本表は宣言専用(物理・QA には影響しない)。ランクの根拠が変わったら版を上げて更新する。

## 入口として推す10本(新しい人に出す順)

1. ⚾ projectile(力学が動く) 2. ⏱️ gclock(DFM の時間) 3. 💡 lensing(光)
4. ✴️ alphaCenABDFM(連星較正の型) 5. 🎡 galaxyStd(引きずりの基準) 6. ⚫ bhCore(暗い核の型)
7. 🏮 pulsarSolo(軸と時計) 8. 🎇 supernovaCore(コアが殻を動かす)
9. 🍇 tuc47(形の転写) 10. 🌃 ngc3198(平坦回転と NFW 対照)

## ランク表(98サンプル)

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
| merger | A | 潮汐尾の因果が見える |
| collapse | A | 中心形成が直観的 |

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
| selfRotor | C | 長時間・多機構で成立条件が読みにくい |
| starSeed | A | 圧縮とスピンアップを追える |

### 光の物語
| ID | Rank | 一言 |
|---|:---:|---|
| lensing | S | 直観的 |
| spinlens | A | 左右非対称が見える |
| blens | A | 複雑だが視覚目標は明快 |
| reddening | S | 波長依存を色で読める |

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
| saturnLayered | C | 二層効果が前面に出ない |
| binary | A | 構造が直観的 |
| fig8 | S | 視覚目標が明快 |
| counterring | S | 衝突差が即座に見える |
| agnjet | A | 内縁と双極流が対応 |
| accretionJet | C | seed 非頑健・dt 未収束(宣言済み) |
| spinup | S | 一因一果 |
| starcore | A | 無融合対照が強い |
| starDFM | B | 力学ビット同一 — ☀️ の変種と明示(独立の恒星に数えない) |
| pulsarSolo | A | 灯台・軸・時計を整理(スケール調整は第232便) |
| supernovaCore | S | 速いコアと外殻放出が明快・用量反応 |
| starMass2DFM | B | f=2 台帳と β_solid 較正の基準天体 — 🌻 との差は radE のみ(第233便) |
| redGiantDFM | A | コア Ω 用量で包絡が流出・白色矮星が残る(第233便) |

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
| psrDoubleABDFM | C | 4主題が競合(短文化の第一候補) |
| gw150914 | A | 二体基準として明快 |
| gw150914DFM | B | DFM 離散化と外部 Peters が同居 |
| tuc47 | B | 形は良い・2D 分散は未較正(seed 明示で配置契約は成立 — 第230便) |
| tuc47DFM | B | 第230便: f=2 で kF1/kF0 が画面で分離+正直な hold-out(C→B) |
| ngc3198 | A | NFW 否定対照が強い |
| ngc3198DFM | B | 第230便: f=2 hold-out の宣言が主題に(C→B) |

## 整理の方針(裁定)

1. **入口はランク S+較正の型**(上の10本)。監査系(qLockRadialAudit・emAudit 群・箱宇宙後半)は
   折り畳み側 — 配列・物理は触らない(表示整理はキュー)。
2. **地球月ファミリー(7本)の入口は 🌘(kF1 較正)と 🔆(太陽摂動)の2本**、銀河回転の入口は 🎡。
3. C ランク(selfRotor・saturnLayered・accretionJet・psrDoubleABDFM)は説明の短文化
   (問い/操作/合否の3段化)を優先キューに載せる — 物理・QA は変えない。
4. 本表と実装の不一致に気付いたら、表の側を直す(表示専用 — 機械固定はしない)。

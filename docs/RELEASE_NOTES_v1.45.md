# RELEASE NOTES v1.45 検証版(RC)

**v1.45 は検証版(RC)である。** RC は「検証版」の意味であって、較正の完了でも観測一致の主張でもない。
**3σ の門の数は v1.44 から増えていない**(掲載 120 本の較正 4 値は **合 0 / 量限定合 2 / 否 1 / 保留 16** —— `docs/SAMPLE_STATUS_v1.45.md`)。
**HOLD 6 項の解除宣言は行っていない**(`docs/RELEASE_NOTES_v1.44.md` §4⁶″ をそのまま継ぐ —— 継承は再判定ではない)。
したがってこの版も「**現実較正を完了した**」「**Release した**」とは名乗らない。

---

## 1. 範囲と版名

| 欄 | 値 |
|---|---|
| **版名** | **「v1.45 検証版(RC)」**(副題は付けない —— 付けるなら原仮定者の裁定で) |
| **昇格** | 第310便の最初の段(統括 —— 2026-10-20)。`tests/release-promote.mjs --apply --version 1.45 --wave 310 --date 2026-10-20`。基点 main **3e38f31**(第309便) |
| **ルートの中身** | v1.44.0(99286dc・第263便)→ **beta v1.45-b309 の中身**(`APP_VERSION` と `BETA_BUILD` の 2 行のほかは beta と byte 同一) |
| **次期の beta 線** | **v1.46-b310**(第300便d の便名の規則) |
| **範囲に入るもの** | 第264〜309便の開発線 v1.45-b1〜v1.45-b309 の記録(便ごとの記録は `CHANGELOG.md` の v1.45.0 節と `docs/PHYSICS.md` の便の節を正とする) |
| **範囲に入らないもの** | 3σ の合格の追加・太陽系/恒星連星/NS の較正の完了・新しい引きずり則の在位の本への適用・dragCore のフィット |
| **名乗らないもの** | 「**現実較正を完了した**」「**Release した**」「**HOLD が解けた**」「**新しい引きずり則(`relativeDrag.invSq`)を在位の本へ入れた**」「**dragCore をフィットした**」「**観測の初期値の分解を在位の本で使った**」 |
| **タグ・Release** | この昇格の commit では作らない(v1.40.0〜v1.44.0 と同じく原仮定者が行う)。版別 DOI は発行しない(第150便規約を継続) |

### 1′. 開発線 v1.45-b1〜b309 の主な主題(要約 —— 正は CHANGELOG と PHYSICS)

- **慣性の引きずり(相対の引きずり)**: 慣性決定力の重みで源の移動を受け手へ配る `physics.relativeDrag` の系統(背景の慣性決定力 `Wbg`・`dragCore`・殻の核・在位の本の宣言とフィット)。**旧則**(分子 m/r³・分母 `Wbg + Σw` —— 自己の項なし)が在位の本の法則である。
- **新しい引きずり則(第309便a・opt-in)**: `relativeDrag.invSq`(分子 m/r²〔源の球の体積平均〕・分母 = 自己の体積平均の場 + 他の源 —— 受け手の各体積点で比を取り体積で平均)。**分母の背景 `invSq.Wbg2` は既定で入っていない**(既定 0 —— 原仮定者の裁定(第107報)「分母に背景宇宙を入れると二重計上・自分が分母に入れば良い」の式そのもの)。在位の本は宣言していない。
- **自転の引きずり**(`spinDrag`): 軸の引きずりの核(球面・鏡映 "bevel")・剛体の回転の步・元の自転軸の維持(`axisHold`)と維持の型(`mode:"maintain"` —— 反作用は背景の口座・内部熱)。すべて opt-in。
- **潮汐**: 三次元の明示潮汐と内部熱・放射(opt-in)。
- **観測の初期値の分解**(第309便c・opt-in): `spinDrag.initSpin`・`relativeDrag.initMotion`(観測の自転・移動を慣性の分と引きずりの分へ分ける —— 最初の步から u(0))。
- **サンプルの整理**: 掲載 120 本(達 82・部分 35・未達 3)・退役 56・内蔵 176。`docs/SAMPLE_STATUS_v1.45.md`・`docs/FAMILIES_v1.45.md`・`docs/CALIBRATION_ISSUES_v1.45.md`・`docs/KF0_LEDGER_v1.45.md`。
- **検証の道具**: 再生成表と鎖(`tools/regen-plan.mjs`・`tools/regen-chain.mjs`)・統合直後の部分 QA(`tools/post-merge-qa.sh`)・正本の来歴(targetSha256)・保存 QA の刻印の厳格の照合。

**旧則の分母の `Wbg` は旧の法則・旧フィットの世代**として残る(在位の本の数とフィットはこの昇格で変わらない —— 新則への移行は次期線)。

## 2. 昇格のゲート(**値は測ったものだけ**)

| 段 | 結果 |
|---|---|
| `release-promote --check` | **7/7 PASS**(version-sync・root-equals-beta・sw-root・sw-beta・citation・lock-sync・changelog-heading) |
| 統合直後の部分 QA(`tools/post-merge-qa.sh --base` = 3e38f31 の beta) | 落ちたのは全体の hash を持つ正本の来歴・sync の型(鎖で作り直す型)と生成文書の見出しの版名 —— **ほかに CHANGELOG を節で読む QA 4 本**(`## v1.45-b<便>` の見出しだけを探していた —— 昇格で便の行が `## v1.45.0(RC・…)` の下へ移る)を、どちらの見出しでも読むように直した。全内蔵の 600 步の指紋 176/176 同一・署名 176/176 同一 |
| 再生成の鎖(`tools/regen-plan.mjs` → `tools/regen-chain.mjs`・`--base` = 3e38f31 の beta) | 計画 always 13 / regen 30 / reuse 72 / recheck 59 → **済み 104 段・段の失敗 0**(1 h 30 min)。鎖の後の html は鎖の前と byte 同一(ルートへの写し直しは要らなかった) |
| 転記照合(`tools/pregate-transcript.mjs --base-rev 3e38f31`) | **64/64 PASS** |
| フルゲート(手元・heap の上限 6144 MiB —— CI の qa ジョブと同じ) | 順序の検査 ok・指紋 176/176 同一・署名 176/176 同一・root と beta が byte 同一・**beta 1234/1234**・**root 943/943** ALL PASS・perf は下の行 |

## 3. root で SKIP する試験(昇格の後の root の QA の範囲)

昇格の後の root のフル QA は **943 件 PASS・SKIP 202 件**(昇格の前は 749 件 —— 内容で世代を判定する試験が root でも走るようになった)。
**SKIP 202 件のうち 196 件は beta だけの門(`TARGET.startsWith('beta/')` ほか)の試験**で、同じ html(root と beta は byte 同一)の beta のフル走行で **196/196 PASS** している。
残り 6 件(`behavior.phase`・`merger.bulk-velocity`・`behavior.merger-causal`・`obs.attrs`・`behavior.agnjet`・`behavior.starcore`)は**廃止した本・属性を読む旧い試験**で、beta でも SKIP である。
**root のフル QA の件数だけで第309便までの新機能をすべて試したとは言わない** —— 新機能の試験は beta の走行で数える。門を「機能の世代」で開く作り替えは次期線で行う(既存の SKIP を一括で外して旧 root に新世代の検査を当てることはしない)。

## 4. ルートで動きが変わる本(v1.44.0 のルート → v1.45.0 のルート)

`node tests/exp-w258c-bitsame.mjs <v1.44.0 のルート> index.html`(600 步の指紋・共通の 122 本): **同一 55・状態が変わる 45・署名の長さだけが違う 22・新しい本 54・消える本 0**。

- **状態が変わる 45 本**: galaxy・galaxyStd・galaxyGeo2・galaxyMeshSpiral・earthMoonReal・earthMoonRealKF1・emAuditNewton・emAuditDFM・emAuditSolar・qLockRadialAudit・qLockRadialAuditQ3・mercury・mercuryReal・mercuryRealKF1・solarInner・jupiterGalilean・venusReal・marsMoonsReal・plutoCharonReal・uranusReal・neptuneReal・alphaCenAB・alphaCenABDFM・siriusAB・siriusABDFM・psrDoubleAB・psrDoubleABDFM・psrDoubleABSpinCal・psrJ1757DFM・psrJ1946DFM・psrDoubleABPN・psrJ1757PN・psrJ1946PN・psrDoubleABCF・psrJ1757CF・psrJ1946CF・psrB1534・psrB1534DFM・psrB1534CF・gw150914Merge4s・gw150914SpinDipole・saturnZonalD68・saturnRingReal・saturnRingRealKF1・binary(第264〜309便の宣言・法則の変更 —— 理由は CHANGELOG と PHYSICS の便の節)。
- **署名の長さだけが違う 22 本**(状態は同一): projectile・boxtrans・boxredshift・galaxyDB・earthMoon・earthMoonFree・psrDoubleABGeoToy・compactForceToy・boxBinaryToy・spaceMeshBinaryToy・gw150914・gw150914DFM・tuc47・tuc47DFM・ngc3198・ngc3198DFM・supernovaProg・supernovaProgDFM・crabRemnant・fig8・pulsarSolo・spinDipoleBinary。

## 5. 継ぐもの

- **Negative Claims 1〜40**(`docs/RELEASE_NOTES_v1.44.md` §3)は取り下げずに継ぐ。
- **HOLD 6 項**(同 §4⁶″)は第263便 時点の枠のまま継ぐ。**解除の宣言はしていない**。
- 昇格の手順(同 §5)は、本版で次の 1 点を改めた: **`--check` 7/7 は必要だが十分ではない** —— 版の 2 行で全体の hash が変わるので、hash を持つ正本・保存 QA・生成文書(SAMPLE_STATUS / FAMILIES の見出し)が古くなる。`--apply` の後に `tools/regen-plan.mjs` → `tools/regen-chain.mjs`(`--base` = 昇格前の beta)で作り直し、生成器が beta を書き換えたら最終の beta をルートへもう一度写してからフルゲート(root・beta・perf)と CI へ。hash・日時・件数を手で書き換えない。

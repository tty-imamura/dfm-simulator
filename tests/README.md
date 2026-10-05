# tests/ — 運用の規則(抜粋)

この文書は `tests/` の器を**運用するときの規則**だけを置く。個々の試験の意味は `tests/qa.mjs` の各ブロックの注釈と
`docs/PHYSICS.md` が正本である(ここに同じ事実を書き写さない)。

## 1. 正本照合の許容(第287便f —— 第286便の CI の実失敗 2 件の再発防止)

第286便の PR では、手元のゲートが通ったのに CI で 2 件が落ちた。

- **論文2 の図 8**(`paper2.yml`): 基点 main の時点で、接触の契約(第285便a)の後の実測と図のデータが食い違っていた。
  `paper2.yml` は `paper/**` か生成器の変更でしか走らないので、失効が PR まで見えなかった。
- **`behavior.bgDiffCheck`**: CI の Chromium(1228)と手元(1194)で `Math.pow` 等が 1 ulp 違い、中心差分由来の誤差と次数が
  正本と相対 1e-12 で一致しなかった。

再発防止の規則(**量の性質で許容を分ける** —— 先回りで緩めない):

| 量の種類 | 例 | 許容 |
|---|---|---|
| 解析量(閉じた式・帳簿・ビット一致を主張する量) | W・A・u・χ・遠方 1 源・p=2 の一般形 | **相対 1e-12**(ビット一致を主張するものは完全一致) |
| 差分由来の量(中心差分の誤差・その比の次数) | `steps[].err`・`errGradU`・`order` | **器が宣言する丸め床**(同種の FAIL が出た試験から実測で決めた床だけ —— 例: 誤差は相対 1e-4 か絶対 1e-10 の緩い方・次数は絶対 1e-3) |
| 残差(本来 0 の量の丸め) | `rel*`・`work`・`maxRel` | **絶対の床**(例: 1e-12) |

- **残差の鍵は絶対 1e-12 で比べる。鍵名は末尾 `rel`/`…Rel` だけでなく `rel` 始まり(`relContract`・`relRotlet` 等)も残差として拾う**(第289便の教訓 ——
  `rel` 始まりの鍵を相対 1e-12 で比べて CI の 1 ulp の差で落ちた)。
- **退役(`familyRole:"retired"`)した id を期待に持つ器と QA は、世代切替 `has290b`(第290便b の退役の印の有無)で分岐する**。退役 id の合否を新しい本へ写さず、
  旧世代(root 等)の期待値は緩めない。

- 床は**同種の FAIL が CI で実際に出た試験**にだけ、器の注釈に出所(CI の実行・実測値)を書いて置く。出ていない試験の 1e-12 は緩めない。
- 門(判定の閾値 —— 例: 次数の門 [1.8, 2.2]・誤差の門)は照合の許容とは別に判定する。照合の床で門を広げない。
- Chromium の版は固定しない。手元のゲートは CI の代わりにしない(CI が最終裁定者)。
- **1 ulp の切り分けは結果 JSON の `env` の欄で**(第288便f・原仮定者の裁定(第78報)AN90): `tests/qa.mjs` は結果 JSON
  (`tests/out/qa-results*.json`)の `env` に `node`(Node の版)・`chromium`(試験した Chromium の `browser.version()`)・`playwright`・`platform`
  を書く。再生成の鎖は冒頭で `$REGEN_LOG/env.json` に同じ 2 つを書く(`node tools/regen-chain.mjs --env`)。CI と手元で同種の FAIL が出たら、
  まず `env.chromium` と `env.node` の差を見る(版は記録であって門ではない —— QA `lint.qaEnvVersions`)。
- 図のデータの照合(`tools/p2fig-compare.mjs`)は**揮発キー**(`generated`・`commit`・`targetSha256`・`generatorSha256`・`chromiumVersion`)
  だけを除いた**完全一致**である。失効したら第216便追補の形で再同期する(対象 html を確定 → `node tools/gen-figures2.mjs` の 22 ゲート PASS →
  再生成 JSON をコミット)。図 8 は再生成の鎖の段にしない。
- 失効を PR より前に見るため、`nightly.yml` の job `paper2-figures` が毎晩、図の再生成と照合だけを回す(TeX は載せない・失敗は FAIL)。

## 2. 再生成の鎖(`tools/regen-chain.mjs`)の済み印と html を書く段

- 済み印 `$REGEN_LOG/done/<段>.done` の契約は **静的な部分**(段・cmd・env の名前・書くファイル・workers と、器と `meta.code[]` の sha)と
  **入力の安定 hash** の sha256(版 `w287f-chaincontract-2`)。入力の並びは表と正本の meta から機械で引く(`chainInputSpecs`):
  読む正本の**意味的出力**(段の `volatilePaths` の宣言と来歴・時刻の欄 `SEMANTIC_RUN_META` を除いた安定 hash)・表の外の入力(CSV 等)・
  html の読み方(領域 hash / 自分と下流の書く段の生成領域を除いた本文 / 本文全体 —— 読まない段は html を入れない)・
  同じファイルを段階的に書く上流の走行行(`mark:`)・env の値。上流が走り直しても**意味的出力が同じなら読み手の印は生きる**。
- html を書く段(`htmlRegions` を宣言: obscompare → assessed〔鎖では --check〕→ samplestatus)は生成領域
  (`// >>> w275a-generated: <領域>`)だけを書く。`--audit` の html 検査(`htmlTailAudit`)が、書く段の宣言と器の本文・領域の印・
  書く段の全順序・html 本文を読む段の after 欠落・領域の閉包と生成領域の重なり・依存の循環を照合する。
- **一時出力の集約(第288便f・原仮定者の裁定(第78報)AN90)**: 鎖のランナーは冒頭で `REGEN_HTML_STAGE=$REGEN_LOG/html` を置く。
  書く段(obscompare → samplestatus)は、この変数があるとき `beta/index.html` を直に書かず、領域 1 つぶんの**断片**
  (`<領域>.frag.json` —— `tests/lib-w288f-htmlstage.mjs` の契約: 読んだ写しの sha256・書いた後の sha256・印から印までの本文)を置き、
  Chromium の照合は置き場の写し(`view-<領域>.html`)で行う。下流の書く段は上流の断片を当てた写しを読む(直に書いていたときと同じ html)。
  **集約段 `htmlagg`**(`tools/regen-html-aggregate.mjs` —— 常時群・単独・samplestatus の後)が断片を順に当て、html を**1 回だけ**
  置き換える(一時ファイル → rename)。断片が合わない(別の鎖の断片・途中で html が変わった)ときは**何も書かずに** rc 1 で止まる ——
  中断した鎖の半分だけ新しい html を完成扱いしない。変数が無いとき(器を手で回すとき)は従来どおり直に書く。
- 書く段の**後**に置いていた html 本文を刻む段(AN53 の 27 段と families —— after に samplestatus)は**集約段の後**へ置いた(after に htmlagg)。
  集約段が書く段と読む段の間に入るので、27 段の刻印の方式(html 全体の sha)は変えずに「書いた後の html を読む」順序が保てる
  (刻印を「生成領域を除いた本文」の hash へ替える案は採らなかった —— 決断事項候補)。`--audit` の html 検査は ⑦ 鎖で書く段の直書き・
  ⑧ 集約段(1 段・常時群・全ての書く段の下流・html 全体を読む下流の段の上流・断片の順序 = 書く段の全順序)を見る。`--self-test` の (r) が
  stub の鎖を bash で回し「中断(rc 1)で html 不変 → 再開で html を 1 回だけ書く → もう一度でも書かない」を確かめる(QA `lint.chainAggregate`)。
- **領域の読みの宣言(`HTML_REGION_READ_DECL`)は空**(第288便f): pn1 → obs-compare は、器の局所名が html の関数名と同じ綴りで下限の自動導出が
  roots に入れていたもの(器はその関数を呼ばない)。局所名と正本の鍵を `lambda0Rows` に改名して外した(QA `lint.pn1RegionDecl`・自己試験 (q6)(q6b))。

## 3. 統合直後の部分 QA

`tools/post-merge-qa.sh`(使い方は `tools/README.md`)。フル QA・CI の代わりではない。
第288便f から、③「前回失敗項」の次に **③′ 本便の新設ブロック**(`POST_MERGE_WAVE_IDS`)を回す。qa.mjs に無い id は「未統合」として数えるだけ
(FAIL にしない)。④ の常設集合(統合直後の 9 本)は変えない。既定は便ごとに差し替える —— 第289便f からは第289便の contract 系 6 本
(docs.dfmAxiomTable・preset.condRowsRenamed・behavior.relDragKernel・behavior.ejectStateCarry・preset.layerAxisDecl・ui.pickerStatusAxes)、
第290便f からは第290便の新設 11 本(docs.terminologyInertial・docs.claimScope・preset.retired290b・docs.d68FactorRow・behavior.inertialDragGate・
preset.inertialDragPair・behavior.ckFixcapRestore・preset.shapeToySpiral・behavior.spiralGeometry・ui.aboutOrder・ui.pickerScope)。

**部分実行(`tests/exp-w258c-qapart.mjs`)が運ばないもの(第289便f)**: qapart はブロックを切り出して一時ディレクトリで走らせるので、qa.mjs の
冒頭近くで決める定数 `W284_PSR_F1`〜`W288B_CORE`(世代の固定値)と `__qaPreset` を運ばない。これらを読むブロック —— `coreV2*`・`shellSpinMassLaw`・
`nsThreeStage`・`compactMeasures` —— は部分実行できない(固定値を変えたらフル QA で見る)。部分実行の結果に出ないことは PASS の意味ではない。

**Node と Chromium の差の欄は null のまま(第289便f・原仮定者の裁定(第79報)AN102)**: 再導出比較で Node の値と Chromium の値が 1 ulp 程度違う量
(CI の Chromium 1228 と手元の 1194 の Math.pow 等の差を含む)は、比較の欄を null のまま残し、**床(許容幅)を敷かない**。床は同種の
FAIL の実測からだけ決める(差が出たことを理由に床を足さない)。

## 4. 「サンプルを選ぶ」の題材・現実較正の 2 見出し・保留の解き方(第291便e)

原仮定者の裁定(第81報)⑦・統括の検証項目 R136。**表示だけ**(`group` の文字列・id・presetSig・保存 JSON・力学は 1 bit も変えない —— bitsame/sigsame 150/150)。

**題材チップの規則表**(html の `TOPIC_TAGS` —— 1 か所。名前・絵文字・群の名前では判定しない。QA `ui.topicChips291` はこの表を写さず、下の規則をその場で書き直して全内蔵で照合する):

| key | 語(ja / en) | 規則(宣言の鍵) |
|---|---|---|
| refModel | 参照模型 / Reference model | `physics.shapeToy` |
| dmHalo | ダークマターハロー / Dark-matter halo | `physics.halo`、または同じ `familyId` に `physics.halo` を宣言した本がある |
| inertial | 慣性決定力 / Inertial determinacy | `physics.relativeDrag.law:"inertial"` |
| cloakedDwarf | 光学迷彩矮星 / Optical-camouflage dwarf | `massLedger.darkRotor`、または bodies のどれかの `lightSweep:"auto"` |
| pn1Geo | 1PN・測地線 / 1PN / geodesic | `physics.geoPN ≥ 1` |
| testParticle | 試験粒子 / Test particle | bodies のどれかの `testParticle:true` |
| spaceMesh | 空間メッシュ / Space mesh | `physics.spaceMesh` |
| obsCal | 観測較正 / Observational calibration | `sampleClass:"calibration"`(合格の意味ではない) |
| manyBody | 連鎖・多体 / Chains / many bodies | bodies の粒子数(単体 1+群の n の和)≥ 100(`TOPIC_MANY_N`) |

- 件数(チップの `data-n`)は一覧に出せる本(catalog 非表示・退役を除く)を実行時に数える。1 本が複数の題材に入りうる。説明タブの `#descTopics` も同じ表から出る(押せない表示)。
- **「現実較正」の 2 見出し**: 表 `GROUP_DISPLAY_SPLIT` で、宣言の群「現実較正」を一覧の表示だけ「現実較正・太陽系」「現実較正・連星」に分ける(`calSubOf` —— `calTargetOf` の solar-system か否か)。
  第288便b のサブチップ(`#ppCalSub`)は撤去し、QA `ui.calGroupUnified` は `ui.calGroupSplit291` に置き換えた(2 見出し・各見出しの件数 = calSubOf の数え直し・退役の本は数えない)。
- **一覧の最下段の区切り** `.ppListEnd`: `#ppList` の最後の子(QA `ui.pickerListEnd` —— 既定・題材の絞り込み・検索・一致 0・保存一覧ありの 5 状態)。
- **原稿の新しい欄 `holdRemedy`**(`tests/data-w279a-samplestatus-src.json` の `rows[id].holdRemedy` と `rows[id].en.holdRemedy`): 較正が保留/判定保留の本で**何をすれば判定器が判定を出すか**の 1 行。
  保留の理由が器の結果(calaudit の missing・σ 接続器 `tests/exp-w262d-solarsigma.mjs` の切断点・charonwin の比較値)に基づく本だけに書く。ja 160 字・en 340 文字まで・ja/en の両方・禁止語と合否の約束の語
  (`HOLD_REMEDY_PROMISE`)を書かない(`lib-w279a-samplestatus.mjs` の `holdRemedyCheck` —— 器が止める)。器は保留の本だけに転記し(保留でなくなった本は正本の `tally.holdRemedy.dropped` に記録)、
  一覧 md の 9 列目「保留の解き方」に出す。原稿に行の無い保留の本は、アプリが既定表 `HOLD_REMEDY_RULES`(見込みの分類)で 1 行を出す(md は「—(既定表)」)。
  **生成は鎖で**(samplestatus の段 —— 手で html の生成領域を書き換えない)。鎖の前は QA `ui.holdRemedy` が「未転記」と記録し、既定表の 1 行で全保留の本を覆うことを確かめる。

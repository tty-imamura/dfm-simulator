# tools/ — 運用の器

各器の詳しい意味は、器の先頭の注釈が正本である。ここには**呼び出し方**だけを置く。

## post-merge-qa.sh — 統合直後の部分 QA(第287便f)

```
tools/post-merge-qa.sh [--base beta/_wNNN_base.html] [--failed "id id …"] [--no-root] [--no-preflight]
```

統合(枝の取り込み)の直後に、壊れやすい所を短く一周する。順序は

1. 静的受理 — `tests/qa-preflight.mjs`(beta・Chromium なし・**heap の上限 `--max-old-space-size=6144`** —— 第305便e)
2. 接続契約 — `node tools/regen-chain.mjs --audit` と `--self-test`
3. 前回失敗項 — `--failed` の id(無ければ `tests/out/qa-results-full-beta.json` の FAIL)を qapart で
3′. 本便の新設ブロック(第288便f)— `POST_MERGE_WAVE_IDS`(既定は第290便の 11 本: docs.terminologyInertial・docs.claimScope・
   preset.retired290b・docs.d68FactorRow・behavior.inertialDragGate・preset.inertialDragPair・behavior.ckFixcapRestore・preset.shapeToySpiral・
   behavior.spiralGeometry・ui.aboutOrder・ui.pickerScope —— 第290便f で第289便の 6 本から差し替え。
   名前は完全一致か末尾一致で qa.mjs の id へ。無い名は「未統合」として数えるだけ)を qapart で beta に
4. 常設集合 — `lint.regenScope`・`behavior.rayLensExcluded`・`ai.stabilize`・`docs.fourValuesHistory`・`docs.preset-table-sync`・
   `docs.families`・`ui.samplePicker`・`lint.provenanceMeta`・`ui.pickerSeparators` を qapart で beta と root(root では beta 線の新設ブロックは SKIP)
5. 影響サンプルの短走 — `--base` があるとき `tests/exp-w258c-bitsame.mjs` の差分 ID(情報 —— 物理を変える枝では差が出て正しい)

最後に 1 行(`post-merge-qa: ① … ② … ③ … ③′ … ④ beta p/n・root p/n(SKIP s)⑤ … 所要 N s → OK|FAIL`)を出す。ログは
`$POST_MERGE_LOG`(既定 `${TMPDIR:-/tmp}/post-merge-qa-<時刻>`)。常設集合は `POST_MERGE_IDS` で差し替えられる。
Playwright は `PLAYWRIGHT_CORE_DIR`(未設定なら `/opt/node22/lib/node_modules/playwright` があればそれ)。
**フル QA・CI の代わりではない**。

## preflight の heap の上限(第305便e —— 決断事項 AN328)

`npm run test:preflight` と `tools/post-merge-qa.sh` の ① は `node --max-old-space-size=6144 tests/qa-preflight.mjs` で起動する
(第304便e の測定: preflight の使用量は標本で最大 2141 MB〔GC の後に残る量がブロックごとに積み上がる〕・**2048 MiB の上限では 247 判定の後に
heap out of memory で終了コード 134**)。**他の経路**(`node tests/qa-preflight.mjs` を直接・`QA_TIER=lint npm test`・CI の外の脚本)は
フラグを付けないので、同じ上限を環境変数で渡す:

```
NODE_OPTIONS=--max-old-space-size=6144 QA_TARGET=beta/index.html node tests/qa-preflight.mjs
NODE_OPTIONS=--max-old-space-size=6144 QA_TIER=lint npm test
```

RAM が 8 GB 未満の環境では上限を下げると同じ型で落ちる(ブロックを束ごとに子プロセスへ分けるのは未実装 —— 次の見直し)。

## regen-chain.mjs — 再生成の鎖

```
node tools/regen-chain.mjs [--html <候補 html>] [--lanes 4] [--out chain.sh] [--json chain.json]
node tools/regen-chain.mjs --audit          # 表の依存・html を書く段の検査・ready queue の模擬
node tools/regen-chain.mjs --self-test      # 自己試験(QA lint.regenChain / lint.regenStableHash と同じ関数)
node tools/regen-chain.mjs --check-order <timeline.txt>
node tools/regen-chain.mjs --gate <段>
node tools/regen-chain.mjs --digest --static <契約> [--html …] [--log $REGEN_LOG] [--lines <file>] -- <入力…>   # 鎖のランナーが呼ぶ
node tools/regen-chain.mjs --env            # 鎖を回す Node と Chromium の版(第288便f —— 鎖が $REGEN_LOG/env.json に書く)
node tools/regen-html-aggregate.mjs [--html …] [--stage $REGEN_HTML_STAGE] [--check]   # 集約段 htmlagg(第288便f)
```

生成したシェルは `REGEN_ROOT`・`REGEN_HTML`・`REGEN_LOG`・`REGEN_LANES`・`REGEN_TOOL`(`--digest` を呼ぶ器の場所 —— 既定
`tools/regen-chain.mjs`)を読む。済み印の契約は静的な部分と入力の安定 hash(`tests/README.md` §2)。
第288便f から、シェルは冒頭で `REGEN_HTML_STAGE`(既定 `$REGEN_LOG/html`)を置き、html を書く段は断片をそこへ置く。集約段 `htmlagg` が
断片を順に当てて html を 1 回だけ書く(合わなければ書かずに rc 1)。

第311便c(統括の検証項目 R228)から:

```
node tools/regen-chain.mjs --calibrate <timeline.txt> [--log $REGEN_LOG] [--source <出所の名>] [--tol 0.1] [--apply]
node tools/regen-chain.mjs --simulate <chain.json> [--timeline <timeline.txt>] [--lanes 4] [--workers 段=n,…]
```

- **予約つきの ready queue**(規則の版 `w311c-easy-backfill-1` —— `readyPick`): レーン不足で入れない最初の段に予約(走行中の段の
  見積りの終わりから入れる最早の時刻 t_res)を置き、その後の段は「t_res までに終わる見込み」か「t_res に並んでもレーンが足りる」ときだけ入れる。
  模擬(`simulateReadyQueue`)とシェルが同じ規則。シェルは `REGEN_RESERVE=0` で旧の規則・timeline に `# reserve <段> <t_res> <extra>` の注釈。
- **見積りの更新**: `--calibrate` は timeline の start/end から段の所要を出し、表の `sec` との差の一覧を出す。`--apply` で
  `tests/data-w311c-regensec.json` に書く(表の本文は書き換えない —— `sec` は済み印の契約と計画の判定に入らない。timing294 だけがこのファイルを入力に持つ)。
- **レーンの見直し**: obscompare・samplestatus は鎖の中では一時出力だけを書く(html を置き換えない)ので workers 1。htmlagg は all のまま(`--audit` の lanes311)。

第312便c(統括の検証項目 R232・決断事項 AN400・AN394)から:

```
node tools/regen-chain.mjs --calibrate <timeline.txt> --log $REGEN_LOG [--base-sec <見積りの file>] [--apply [--out <file>]] [--json <file>]
node tools/regen-chain.mjs --scope-all [--write] [--check]      # REGEN_SCOPE が presets:"all" の段の理由の一覧(tests/data-w312c-scopeall.json)
node tools/regen-valdiff.mjs --base <rev> [--json <out>] [--steps 段,…] [--all-files] [--ignore 鍵,…]   # 正本の値の差の記録(段ごとに changed / same)
node tools/regen-valdiff.mjs --self-test
```

- **`--calibrate` の再起動の型**(規則の版 `w312c-calibrate-2`): `--log` の済み印の 1 行目 `run <N>s` を実測として先に読む(`reuse` —— gate の
  再利用・`manual` —— 鎖の外の段は飛ばす)。済み印の無い段は timeline を `# ready-queue` の見出しで回に分け(`# restart` の注釈を数える)、2 回目以降の回の
  5 s 以下の組は、前の回で rc 0 で終わっていれば済み印の確かめとして飛ばす。`--base-sec` は「今の見積り」をそのファイルから読み、`--apply` はそれを元に
  `--out`(既定 `tests/data-w311c-regensec.json`)へ書く(前の便の見積りから引き直して照合する用途)。
- **値の差の記録**(`tools/regen-valdiff.mjs` —— 判定ではなく測定): 鎖の後の作業木の正本と基点の rev の正本を、最上位の来歴(`/meta`・`/h4Carry`・`/h4Carried`)・
  再生成表の `volatilePaths`・実行時の鍵の名(時刻・所要・速さ・同一性の hash・html の行番号 `line`)を除いて比べる。観測の時刻・継続時間の欄は名で除かない。
  `--ignore stats` のように名を足せる(基点の正本が h/4 を転記した世代だと、an336・shell の走行の数 `stats` だけが違う)。
- **h/4 の転記の既定**(`tests/lib-w311c-h4carry.mjs`・版 `w312c-h4carry-2`): 既定は全部測る(影の記録 `h4Carry` を正本に書く)。`H4_CARRY=1` は比較の実験だけ
  (第311便c の転記 —— その正本はコミットしない)。

第313便c(統括の検証項目 R236・決断事項 AN394)から:

```
node tools/regen-valdiff.mjs --base <rev> [--now <rev>] [--table] [--declared <file> | --no-declared] [--json <out>]   # 宣言の除外と差の分類
node tools/regen-chain.mjs --simulate <chain.json|all> [--timeline <timeline.txt>] [--log $REGEN_LOG] [--est <見積りの json>] [--alpha 1,0.5] [--tail 段,…]
node tools/regen-chain.mjs --scope-all --check                  # post-merge の ② でも走る(落ちたら統合で段が増えた —— --write で引き直す)
```

- **除外の宣言**(`tests/data-w313c-valdiff-volatile.json` 版 `w313c-valdiff-decl-1`): 段ごと・正本ごとの JSON Pointer と種類と理由(実行時刻・所要・速さ・結合の鍵・
  コードの同一性・来歴・行番号・版名ほか / 並びを問わない表 `order` / 数え上げ `count` —— 除かない)。再生成表の `volatilePaths` と別のデータ(鎖の計画を動かさない)。
  **観測の epoch・物理の時刻・正本の値は宣言しない**(`checkDeclared` が種類ごとに値の型を照合 —— QA lint.valdiffDecl313)。既定で読む。
- **差の分類**: 宣言の後に残った差を数(物理の差の候補)・文字列(文言)・構成・数え上げに分け、段ごとに `same-by-declared`・`text`・`count`・`struct`・`number`。
  `--now <rev>` で今の側も rev の正本(便の基準線を git だけで引き直す)。
- **予約の前の backfill の余裕 α**(規則の版 `w313c-easy-backfill-2`・`RESERVE_BEFORE_ALPHA = 0.5`): 予約の前に入れるのは「見積り ≤ α ×(t_res − 今)」の段だけ。
  シェルは `REGEN_RESERVE_ALPHA`(百分率・既定 50 —— 100 で第311便c の規則 `w311c-easy-backfill-1`)。`REGEN_RESERVE=0` は今も予約なし。
- **`--simulate`**: `all` で今の表の全段 regen の鎖・実測は再起動の型を直した規則(`calibrateSec`)・`--est` で見積りを別のファイルから・`--alpha` で α を並べる。
  依存だけの下限・臨界路・末端の段の最早の開始と模擬ごとの遅れを出す。

## p2fig-compare.mjs — 論文2 の図データの照合(第287便f)

```
node tools/gen-figures2.mjs                       # 図の再生成(数値ゲート 22 件)
node tools/p2fig-compare.mjs [--ref HEAD] [--now-dir paper/figures]
P2FIG_OUT=/tmp/p2 node tools/gen-figures2.mjs && node tools/p2fig-compare.mjs --now-dir /tmp/p2   # 作業ツリーを汚さずに照合
```

`paper2.yml`(PR)と `nightly.yml` の job `paper2-figures`(毎晩・TeX なし・失敗は FAIL)が同じこの器を呼ぶ。

## beta-build.mjs — beta 版の名前に便名(第300便d)

```
node tools/beta-build.mjs                      # 検査だけ(書かない —— 食い違いは終了コード 1)
node tools/beta-build.mjs --apply --wave 301   # 3 か所を v<beta 線>-b301 へ(統括が便の基点で 1 回)
```

`BETA_BUILD = "v<beta 線>-b<便の番号>"`(beta 線 = APP_VERSION の minor + 1・便の番号 = CHANGELOG.md の行頭「- **第NNN便」の最大 ——
便の基点の「最大 + 1」も可)。書くのは `beta/index.html` の `const BETA_BUILD`・`beta/sw.js` の CACHE 接尾辞・CHANGELOG の beta 節の見出しの 3 か所。
QA `lint.betaBuild300` が同じ関数(`betaBuildState`)で照合する。生成文書の見出しは鎖で追従する(生成器が html の BETA_BUILD を読む)。

## harness-smoke.mjs — 鎖の前の器の煙試験(第303便e)

```
node tools/harness-smoke.mjs --base beta/_wNNN_base.html --base-rev <便の基点 sha>   # 統合の直後・鎖の前(例外・門の偽・NaN が 1 つでもあれば rc 1)
node tools/harness-smoke.mjs --base … --list        # 選ぶだけ(走らせない)
node tools/harness-smoke.mjs --keys dragnorm-301a   # 段を名指し
node tools/harness-smoke.mjs --self-test            # 器を走らせない自己試験(QA lint.harnessSmoke303 と同じ関数 —— 判定の缶詰 16 件・基点 html の相対パス)
```

基点の html と今の html の差(最上位の名前・`window.HP` の口・内蔵プリセットの生と受理後・`S._core`)と、`--base-rev` からの器・lib の差から、
再生成表の段のうち**差を直接読む器**(領域の宣言 REGEN_SCOPE の roots〔宣言の無い器は機械で引いた下限〕・宣言したプリセット・all の器・器のコード)を選び、
作業ツリーの写し(`$TMPDIR/harness-smoke-<時刻>/root` —— 正本は書かない)で並列(`--lanes 2`)に走らせて、**受理の例外・門の偽・NaN** だけを報告する。
長い器は表 `SMOKE_KNOBS` の窓(QUICK・PART・步数)を使い、それでも枠(`--budget 90` 秒)を越える器は枠で止める(最初の数段 —— 報告に書く)。
判定: 例外 = rc ≠ 0 で stack の直前の行 / 門の偽 = rc ≠ 0(例外なし)・gates の欄(JSON の行)の false・最上位の ok:false・「ok false」/ NaN = 「NaN なし」の類と受理器がわざと非有限を拒否した対照の行を除く。枠で止めた走行は止めた時点までの出力だけを見る(止めた後に子の Chromium が閉じて出る例外は数えない)。履歴・常時群・html を書く段・鎖の脚本の段・正本の対象が html でない器(lib・CSV を刻む)は選ばない。第302便の統合直後の状態の通しは 62 段・26.7 分(混んだ箱)で NG は dragnorm の 1 段。
多くの器が共有する名前(validatePreset など —— 宣言の 40% 以上)だけの段は `--wide`、閉包だけの段は `--indirect` で足す。全体の枠は `--max-minutes 30`(枠の外の段は「未実行」として数える)。
過去の状態を試すとき: `git archive <rev> | tar -x -C <dir>` で取り出し `--root <dir> --head-rev <rev> --git-dir <.git>`(第302便の dragnorm の停止 2 回と同じ型の例外が統合直後の状態で出た)。
**第304便e の直し(版 w304e-harness-smoke-2 —— 第303便の初回運用の NG 3 件はすべて道具側)**:
- `NaN=false`(器の行の書式)は NaN なしに数える(`NaN=true` は数える —— 第303便の sparc)。
- 器に渡す基点 html(環境変数 `BASE_HTML` —— 段の cmd の `$BASE_HTML`)は**写しの根からの相対パス**(器は `path.join(ROOT, 引数)` で開く。木の外の基点は写しの
  `beta/_harness_smoke_base.html` へ複写 —— 第303便の galaxyprof)。playwright の例外(stack の行の末尾が「 {」・Call log の節)は門の偽でなく例外として読み、文は Call log の前の行。
- **既知**: この走行で書いた正本の写しが ok:false でも、**基点の正本でも ok:false**(`--base-rev` があれば `git show <基点>:<正本>`・無ければ鎖の前の木の正本)で
  偽の門が基点の偽の門の内に収まる段は「既知」として分け、NG に数えない(第303便の spiral290 の g4)。偽の門が増えた・基点が ok:true の段は NG のまま。
  正本の写しは**この走行で書いたもの**だけを見る(書かない窓で古い写しを拾わない)。
- 確かめ(第303便の統合の後の状態 9d79aaa を `git archive` で取り出し、基点 7598e8e で 3 段を名指し): galaxyprof 完走(27 s)・spiral290 既知・sparc 枠で止めた(問題なし)
  —— 3 件が消えた。第302便の 19a4d5b の dragnorm-301a は 2.1 s で受理の例外のまま。QA lint.harnessSmoke304。

## pregate-transcript.mjs — ゲートの前の転記照合(第303便e)

```
node tools/pregate-transcript.mjs --base-rev <便の基点 sha>   # 鎖の直後・ゲートの前(FAIL・未実行が 1 つでもあれば rc 1 —— ゲートを回さずに処置へ)
node tools/pregate-transcript.mjs --list [--all]              # 列挙だけ
```

正本と PHYSICS・fitRecord・obsCard の転記の一致を見る QA ブロックを `tests/qa.mjs` から機械で列挙する(名前の型 docs.*Contract*・docs.*-sync・preset.fit*・docs.fit* /
転記の型 = docs.*・preset.* で正本 JSON と転記先〔PHYSICS.md・fitRecord・obsCard〕の両方を読むブロック —— `--base-rev` があれば読む正本が基点から**意味で**
〔再生成表の semanticSha〕変わったものだけ)。来歴の 2 本(lint.provenanceMeta・lint.regenScope)を足し、部分 QA(`tests/exp-w258c-qapart.mjs`)を
`--chunk 30` ずつ回す。切り出しの例外で結果の無い id は 1 本ずつ回し直し、それでも無ければ「未実行」として数える。

## tests/lib-w303e-fitstop.mjs — フィットの探索の停止幅(第303便e)

新しい器のフィットの探索が使う小さなライブラリ: 根の停止幅 = **宣言の許容 × 1/10**(`rootTolOf`)・丸めた最終値で刻み h と h/2 を**必ず**測り直す門
(`|残差| + |h − h/2| ≤ 許容` のときだけ fitted —— `fitStopSync` / `fitStop`)・割線と Illinois(挟めなければ unreachable-in-bounds)。
歴史の器(第302便c までの器)の中は書き換えない。自己試験 `fitstopSelfTest()`(QA lint.harnessSmoke303 ④)。

## tools/scope-probe319.mjs — 再生成の段の短縮の対照(第319便c)

原仮定者の指示(第121報)「時間が掛かっている再生成の段について、時間短縮を行う」・AN454・R260。同じ html の写しに変更の種類ごと(内蔵の本を 1 本足す・
在位の惑星 1 本の宣言・步の関数 2 種・表示の文 2 種)の 1 か所の変更を入れ、再生成表の段のうち regen になる段の数と見積りの秒(`tests/data-w311c-regensec.json`)を
前(`--base-rev` の器の REGEN_SCOPE と履歴の集合)と後(今)で数える(領域 hash は前後とも版 6)。記録 `tests/out/scopeprobe-w319c.json`(段にしない道具の記録)を
QA `docs.regenShort319c` が PHYSICS〔第319便c〕の表と照合する。

```
node tools/scope-probe319.mjs --base-rev 7c6bf88 --out tests/out/scopeprobe-w319c.json   # 1 プロセス・数分
```

段ごとの扱い(閉じた探索の段の履歴化 `HISTORY_319C`・presets の絞り `NARROWED_319C`・"all" のまま `KEEP_ALL_319C`・領域の宣言 `AN454_319C`)は再生成表
`tests/lib-w281a-regentable.mjs` の第319便c の塊に置いた。数は段 1 回の実測の見積りの和で、鎖の壁時計ではない。

## 第320便d —— 道具と QA(決断事項 AN478・AN481・統括の検証項目 R265)

- **lint の違反の種類**: `tests/lib-w320d-lintkinds.mjs` —— 刻印の型(「走らせ直す」の文 —— 鎖で直る)とそれ以外を分け、lint.provenanceMeta・lint.regenScope ほか 3 本の detail で**刻印の型以外を先に**並べる(判定は不変)。`post-merge-qa.sh` の ① と ④ の要約に「刻印の型以外の違反 k 件」(1 件でもあれば ‼)。
- **領域の差の分類(AN478)**: `node tools/regen-plan.mjs --classify [--stamp-html <刻印時の html>] [--stamp-git <N>] [--stamp-dir <写しの置き場>]` —— 計画の行ごとに核・本・表示(「本 X の変更だけで動く —— 名簿 A/B/C」)を `plan.classify320` に出す(段の判定は変えない)。刻印時の html は sha で引く(--stamp-git は beta/index.html の直近 N 版を git から写す)。
- **本ごとに分けられる器の名簿(AN478)**: `node tools/regen-plan.mjs --roster [--write|--check]` —— `tests/data-w320d-perbook.json`(A = 器に --only・B = 器を読んで確かめる候補・C = 全体の再走)。統合で段が増えたら `--roster --write` で引き直す。
- **受理の鍵を足すとほぼ全段の型の調べ(AN481)**: `node --max-old-space-size=4096 tools/an481-probe.mjs [--json] [--ids <本>] [--steps <N>] [--harness <器>]` —— 候補 P0/P1/P2 × 変異の表(動く宣言の数)と、P4(実行した関数の閉包 —— V8 の precise coverage)の静的/実行の閉包の大きさ。走らせない(1 冊の短い走行だけ)・書くのは標準出力だけ。
- **段の副産物の md**: 再生成表の `BYPRODUCTS_320D`(samplestatus・families・kf0ledger-old・kf0ledger・issues の一覧の md)は段の書き(writesOf —— 鎖の JSON の writes)に入る。段階コミットの脚本は writes を拾えばよい。

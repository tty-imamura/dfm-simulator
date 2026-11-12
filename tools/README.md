# tools/ — 運用の器

各器の詳しい意味は、器の先頭の注釈が正本である。ここには**呼び出し方**だけを置く。

## post-merge-qa.sh — 統合直後の部分 QA(第287便f)

```
tools/post-merge-qa.sh [--base beta/_wNNN_base.html] [--failed "id id …"] [--no-root] [--no-preflight]
```

統合(枝の取り込み)の直後に、壊れやすい所を短く一周する。順序は

0. ⓪ 規約の速い判定(第323便a)— `node tools/conventions-check.mjs --target beta/index.html --target index.html`(`--no-root` なら beta だけ・数秒)。**NG なら ① 以降を走らせずに終了コード 1**(下の「conventions-check.mjs」)
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

最後に 1 行(`post-merge-qa: ⓪ … ① … ② … ③ … ③′ … ④ beta p/n・root p/n(SKIP s)⑤ … 所要 N s → OK|FAIL`)を出す。ログは
`$POST_MERGE_LOG`(既定 `${TMPDIR:-/tmp}/post-merge-qa-<時刻>`)。常設集合は `POST_MERGE_IDS` で差し替えられる。
Playwright は `PLAYWRIGHT_CORE_DIR`(未設定なら `/opt/node22/lib/node_modules/playwright` があればそれ)。
**フル QA・CI の代わりではない**。

第336便b(統括の検証項目 R336): ① と ④ の要約の種類の数(刻印の型以外 k 件)は種類の印のある行だけの和 —— **印のない FAIL** は `$LOG/1-unmarked.txt`(④ は `$LOG/4-unmarked.txt`)に id・文に刻印の型の語があるか・理由の文の末尾 120 字で並ぶ(`tests/lib-w336b-unmarked.mjs`)。
1 件でもあれば最後の 1 行の ① か ④ に「‼ ① の印のない FAIL を 1 件ずつ読むこと(一覧 …)」が出る(終了コードは従来どおり)。**数が 0 でも、印のない FAIL は 1 件ずつ読む**。
QA `lint.unmarkedFail336b` がこの関数と第335便の ① のログの抜粋(`tests/data-w336b-pm335-preflight.txt`)を照合する。

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

**第322便d の直し(全体の枠と終わりの行 —— `SMOKE_WIDE_VERSION` w322d-smoke-wide-1・道具の版 w304e-harness-smoke-2 はそのまま)**:
- `--wide`(か `--indirect`)のときの全体の枠の既定は **90 min**(`MAX_MINUTES_WIDE` —— それ以外は 30 min のまま・`--max-minutes` を書けばそれが勝つ)。第321便の `--wide` は 158 段のうち 108 段で 30 min に達した(未実行 50 段)。
- 終わりの行: 未実行の段があれば `… —— 未完 —— 未実行 n 段(全体の枠 --max-minutes M の外 —— 走らせた段は問題なし・未実行の段は見ていない)` と、続く行に未実行の段の key(続きは `--keys` で)。
  「OK」とは並べない。smoke.json に `complete`・`notRun`・`notRunKeys`・`maxMinutes`。終了コードは従来どおり(例外・門の偽・NaN のときだけ 1)。

**第323便c の窓(決断事項 AN517・AN518・統括の検証項目 R277 —— 窓の無い大きい 16 段の簡易の窓・道具の版はそのまま)**:
- `SMOKE_KNOBS` の第323便c の塊に 16 段(shell-304b・emgrid・inertialr2-303b・periodn-306b・charon-h2・chainburst-301d・gfamily-305b・dragcore292・geo3・charonk・nslock・emresolve-306c・
  earthmoon-303c・charoneps-h4・an336-306a・baseline-304c)。**器の本文は変えない** —— 器に元から在る環境変数(`*_PARTS`・`*_QUICK`・`*_LONG`・`*_PLANETS`・`*_ONLY`・`*_OUT`)と引数
  (`--steps`・`--only`・`--iters`・`--variants`・`--out`・`--quick`・`--smoke`)で窓を開ける(器を変えるとその段と器を import する段が鎖で走らせ直しになる・nslock は AN516 の影の照合の門 G1 を保つ)。
- 行の欄: `env`・`args`(段の cmd の器の後に足す引数)・`cmd`(cmd が器 1 本でない手動の段 emgrid と、窓を別の器に置いた dragcore292 の窓の cmd)・`out`(窓の出力 —— **走らせる前に消す**:
  器が既存の出力の他の段を残す型のため)・`sec`(窓の秒の実測 —— 枠を `sec × 2 + 30` まで延ばす `w323cKnobLimit`)・`fullSec`・`covers`(窓が走らせる部分)。
- dragcore292 の窓は別の器 `tests/exp-w323c-dragcorequick.mjs`(器 `tests/exp-w292c-dragcore.mjs` の書き出した関数 gates・childTask を同じ順に —— 純関数の自己試験・門・8 公転 1 本 ——
  `W323C_DRAGCORE_OUT` が要る)。器の窓 `W292C_ONLY` は出力のファイルを書かないので指紋が取れない。
- charon-h2 と charoneps-h4 の窓は同じ probe(`tests/out/charon-w272b-probe.json` —— 規定步数に満たない走行の落とし先)に書く —— **同時に走らせない**。
- 表と記録は `tests/lib-w323c-quickwin.mjs`(PHYSICS〔第323便c〕の表 1〜3)・QA lint.quickWindows323・docs.w323c。

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

## samplestatus-postgate.mjs — ゲートの後の samplestatus の段(第321便d —— 決断事項 AN493・統括の検証項目 R269)

鎖の常時群の段 samplestatus はゲートの QA の前に走るので、SAMPLE_STATUS の保存 QA の欄は前の便のゲートの保存物を写す(1 便遅れる)。フルゲートの後(保存 QA を書いた後)に 1 回:

```
PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tools/samplestatus-postgate.mjs
```

- 前提: 保存 QA `tests/out/qa-results-full-beta.json` がフルの QA で、刻印 targetSha256 が今の beta/index.html と同じ(違えば rc 3 —— `--any-qa` で外す)。
- 再生成表の段 samplestatus の cmd をそのまま走らせ(`REGEN_HTML_STAGE` は外す)、木の全ファイルの sha の前後・正本 `tests/out/samplestatus-w279a.json` の差(JSON Pointer)・`docs/SAMPLE_STATUS.md` の差(行)を `tests/lib-w321d-postgate.mjs` で分類する。許す欄は**来歴**(実行の時刻・mtime・meta.evidenceQa・timingNote.qaProvenance・md の入力の sha)と**時間**(rows[].timing.qa・保存 QA の総数と総時間)だけ。html は 1 byte も変わらない。
- 終了コード: 0 = PASS(2 つのファイルを書いたまま —— commit する)・1 = 許す欄の外の差(段の書きを戻す —— `--keep` で残す)・2 = 器が rc ≠ 0(戻す)・3 = 前提を満たさない。`--dry-run` は判定の後に必ず戻す(試走)。`--json` で報告の JSON・`--out <file>` で保存・`--root <dir>` で別の木。
- 期待の出力: `PASS(rc 0 …)`・「段の書きの外 0 / html 不変 true」・「正本: 差 N(来歴 a・時間 b・外 0)」・「一覧 md: 違う行 M(来歴 1・時間 M−1・外 0)」・「evidenceQa <前のゲート> → <今のゲート>(保存 QA と同じ true)・sameHtml false → true」(第321便d の試走: 0d7d7f1 の写しで 3.5 s・正本の差 552・md 104 行)。

## 第322便d —— 道具(決断事項 AN509・統括の検証項目 R273)

- **nslock の本ごとの行の再利用(AN509 —— 影の運用)**: `node tests/exp-w272c-nslock.mjs --merge [--only id,...] [--prev <前の正本>] [--out <出力>] [--plan]` ——
  前の正本(既定は出力のファイル —— 走行の前に読む)の行のうち、門 G1〜G8(`tests/lib-w322d-nslockmerge.mjs` —— 版 w322d-nslock-merge-1)を通る行を写し、`--only` の系と門を通らない行だけを走らせて 1 本に組む。
  正本全体の門(器の版とコード・ページへ入れる lib・走行の窓・環境・核の hash・行の集合と順・全体集計・`--only` の範囲)が外れたら全走。`--plan` は門の評価を 1 行の JSON で印字して終わる(書かない)。
  **鎖の段の cmd は全走のまま**(影): 全走のときも前の正本で門を評価し、`[w272c-nslock] 影の照合 … 一致 n/m` を印字する(正本には書かない)。正本の meta に env・coreSha256・books・rowInputs・pageLibs・merge。
- **qapart の束**: `node tests/exp-w258c-qapart.mjs --batch N <鍵…>` —— 鍵を切り出しの範囲の順に並べて N 鍵ずつの束に分け(範囲が重なる鍵は同じ束)、束ごとに子の Node と Chromium を作り直す。
  終わりに `# --batch N: ALL PASS|FAILED —— 束 k・PASS p・FAIL f`(1 束でも FAIL か rc ≠ 0 なら終了コード 1 —— **第323便a から要求した鍵の PASS・FAIL・SKIP・未実行の 4 つの数**: 下の「conventions-check.mjs」の節)。既定(`--batch` なし)は従来どおり 1 本。`--emit <dir>` は走らせずに本文を書くだけ。
  切り出しの本文は `tests/lib-w322d-qapart.mjs`(qaSpanner —— 器から移しただけ・生成する本文は移す前と 1 byte も違わない)。

## qa-keys.mjs — 版名 QA の鍵の抜き出し(第322便d)

便の開始に beta の版名(BETA_BUILD)を変えた後、版名を読む QA のブロックの鍵を部分 QA で回す 1 行:

```
node tools/qa-keys.mjs --out-dir <scratch>/qakeys
for f in <scratch>/qakeys/qa-keys-*.txt; do node tests/exp-w258c-qapart.mjs $(cat $f); done        # root は QA_TARGET=index.html を前に
```

- 鍵は `add('<id>'` のうち**コードの位置**にある静的な id(コメント・文字列・テンプレート・正規表現の中の `add('"'` などは拾わない)。範囲は qapart と同じ関数(qaSpanner)で取る。
- 外す鍵: qapart の検索(`add('<id>'` を含む最初の行)がコメントか文字列の行に当たる・範囲が add の行を含まない(列 0 の `if (…) {` の中など)・範囲が取れない・
  **範囲の中のコードが w5cGetUnit を読む**(前後の add の位置でなく範囲そのもので判定 —— 第321便の pwa.sw-fail-ui → behavior.saturnExp)・範囲が qapart の前文に無い上流の最上位の名前を読む。
  **第323便a から**(判定の世代 `QA_KEYS_W323A` = w323a-qa-keys-2 —— 範囲と上流の名前は lib の qaSpanner・upstreamOf): 列 0 の if/for の中と最上位の文の鍵は外さない(lib が切り出す)・上流の名前は**前文に写せない名前**(let/var・W5b の関数・add を呼ぶ宣言・w5cGetUnit を読む宣言)だけで外す。今の qa.mjs で外す鍵は 94 → 43(残りは全部 w5cGetUnit の範囲)。
- 版名を読むブロック: 範囲のコメントを除いた本文(文字列は残す)が正規表現に合う(既定 `CHANGELOG`・`BETA_BUILD`・`APP_VERSION`・`sw\.js` —— `--re` で置き換え・`--re+` で足す・`--comments` でコメントも数える・`--ids+ a,b` で名指しを足す)。
- 束: 50 鍵ずつ(`--chunk`)のファイル `qa-keys-<k>.txt`(1 行・空白区切り)と `index.json`(選んだ鍵・版名を読む範囲で外した鍵と理由)。`--list` は束を印字するだけ・`--self-test` は缶詰と今の qa.mjs で自己試験(QA docs.w322d)。

## conventions-check.mjs — 規約の速い判定・qapart の要求した鍵の照合(第323便a —— 統括の検証項目 R275)

原仮定者の指示(2026-11-01)「今後は、すぐに確認可能な規約を先に判定する」。**統括の 1 行(鎖の起動の前)**:

```
PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tools/conventions-check.mjs --samplestatus
```

- 判定(html を Node で読む・既定 `beta/index.html`・`--target` は繰り返し可 —— 相対か絶対のパス): ① c₀ の規約(QA `light.canonical-builtins` と同じ式 —— c₀ = 30 か、自分の scaleExp〔無ければ段のアンカー〕の指数で実 c の ±1%・既定値のマージも c₀ = 30)
  ② 段の分類(QA `preset.scale-tier` と同じ式)③ 全内蔵の受理(拒否 0・警告のある本の数)④ X_k = G_0/c_0²(鍵 kappaT)を満たす本・満たさない本の数(**情報** —— FAIL にしない)。
- 式は道具に写した —— 走るたびに qa.mjs の該当ブロックから式の本文を引き、文字(コメントと空白を除く)と値(全内蔵 + 合成の変異の本)で照らす(食い違えば終了コード 2)。
- `--samplestatus`(beta だけ): samplestatus の器を `REGEN_HTML_STAGE` を一時の置き場にして走らせ(html を直に書かない)、htmlChanged:false を確かめる。器が書く `tests/out/samplestatus-w279a.json` と `docs/SAMPLE_STATUS.md` は走る前の bytes に戻す(前後の git status も照らす)。
- 終了コード: 0 = 通る / 1 = 規約の外・冪等でない・器が落ちた / 2 = 使い方・html が読めない・qa.mjs の式が引けないか食い違う。`--json <file>` で結果・`--self-test` で式の照合と変異(♊⚖️ を c₀ = 10 に —— 2fd84b4 の型)の缶詰(QA `lint.conventionsCheck323`)。
- post-merge の ⓪ はこの道具を beta と root で回す(`--samplestatus` は付けない —— 統合の直後は生成領域の作り直しが鎖の段にある)。

qapart(`tests/exp-w258c-qapart.mjs`)の終わりの行は第323便a から **要求した鍵の PASS・FAIL・SKIP・未実行**の 4 つの数:

- 結果に無い鍵は、走行中の `SKIP …`・`RETIRED …` の行が名指せば **SKIP**(PASS に数えない —— root で beta 線のブロックが SKIP するのは正常)、名指さなければ **未実行**(`FAIL <id>  未実行 —— Requested QA did not execute in qapart` —— FAIL として数える。
  同じ対象の保存のフル QA にもその鍵の行が無ければ「この対象では走らない鍵の型」と注記)。名指しの型: 行の語が鍵と同じ・または `<接頭>*`・`<接頭>.` の語が鍵の接頭。
- 終了コード: FAIL・未実行・同じ範囲の他の鍵の FAIL・範囲の例外のどれかで 1。SKIP だけなら 0(`--strict-skip` で 1)。要求した鍵 0 は 1。`--batch N` の終わりの行も同じ 4 つの数(子の `# qapart-summary {…}` の行を足す —— 行の無い束は要求した鍵を全部未実行に数える)。
- 範囲は列 0 の `if (…) {`・`for (…) {` の中・最上位の文の鍵も切り出す(add の行を含む列 0 の最上位の文)。範囲が読む上流の最上位の const・関数宣言は前文へ写す。範囲ごとに try/catch で包む(例外の範囲の鍵は未実行・後の範囲は走り続ける)。
  W5c のワーカープール(w5cGetUnit)は「呼べば例外」の代わりを置く —— その範囲の鍵は未実行(`tools/qa-keys.mjs` が外す)。
- **部分 QA の通過数はフル QA の被覆ではない**(選んだ範囲だけ・ページの上流の状態はフル QA の順と違いうる)。

## provenance-inventory.mjs — 来歴の語の一覧と行の id の表の被覆(第323便d —— 決断事項 AN428 ①・統括の検証項目 R278)

html を Node で読み(物理は走らせない)、内蔵の全本の観測結果カードの行名(ja/en)・フィットの記録の文・退役の理由のうち、来歴の語(html 自身の判定 `PROV_TEXT_CLEAN.PROV_TEST`)を含む文字列を数え、行名ごとに読む側のファイル(器・lib・データ・凍結の写し・正本・QA・html の最上位の表)を数える。行の id の表(`tests/lib-w323d-rowids.mjs` の `LEGACY_ROW_IDS`)が一覧を覆わなければ rc 1。

```
node tools/provenance-inventory.mjs --md --json <scratch>/inventory.json      # 一覧と表の被覆
node tools/provenance-inventory.mjs --calverdict <前の正本> <後の正本>         # 判定器の正本の判定の値の前後(差 0 で rc 0)
node tools/provenance-inventory.mjs --calverdict-write <正本> tests/data-w323d-calverdict.json --rev <rev>   # 判定の値の記録(QA lint.provenanceIds323 ⑥)
```

## qa-recheck-record.mjs — 部分の再検査の補足の記録(第323便d —— 統括の検証項目 R278)

保存のフル QA の FAIL を直した後、FAIL の ID だけを部分 QA(`tests/exp-w258c-qapart.mjs`)で再検査したときの来歴を `tests/out/qa-recheck-beta.json`(root は `qa-recheck.json` —— 1 本の追記型)に書く。保存のフルの結果は書き換えない。部分 QA の印字(`PASS`・`FAIL`・`SKIP` の行と `# 切り出し:`・`# 束 k/n:` の要求の鍵)を読み、要求したのに出ない鍵は未実行に数える。

```
TMPDIR=<scratch>/tmp node tests/exp-w258c-qapart.mjs lint.kappaSymbol315 > <scratch>/recheck.log
node tools/qa-recheck-record.mjs --log <scratch>/recheck.log --fix docs/PHYSICS.md@<直した commit> --html beta/index.html   # 既定の出力 tests/out/qa-recheck-beta.json
node tools/qa-recheck-record.mjs --check                       # 形の検査(QA lint.qaRecheck323 と同じ関数)
```

- `--fix <path>[@<rev>]`(直したファイル —— 文書・検査のコード): 直した後は `@rev` の版か作業木、直す前は保存のフルの commit の版。`--code`(既定 `tests/qa.mjs`)はフルの時点と再検査の時点の sha256 を並べる。
- 結論の「閉じた」= フルの FAIL の全部が再検査で PASS・再検査に FAIL と未実行が無い・再検査がフルと同じ html の上。
- samplestatus の器(`tests/exp-w279a-samplestatus.mjs`)は、記録が今の保存のフル(ファイルの sha256)を指すときだけ、SAMPLE_STATUS の「保存 QA の来歴」の行に 1 文を足す(試しは環境変数 `W323D_RECHECK=<記録>`)。根拠 ID の PASS の集合は保存のフルのまま(状況の判定は変えない)。

## 第323便b —— 再生成の計画(原仮定者の指示(2026-11-01)・決断事項 AN517/AN518・統括の検証項目 R276)

- **順序だけの依存**: 再生成表の after の辺を `data`(上流の書くファイルを正本の meta の入力か器の本文で読む・同じファイルを書く・上流の閉包の段の書くファイルを読む)・
  `html`(上流は beta/index.html を書く段・自分は html を読む —— 他のファイルは読まない)・`order`(並べるだけ)に機械で分ける(`tests/lib-w281a-regentable.mjs` の afterDepKinds ——
  版 w323b-afterkind-1・段の `afterOrderOnly` / `afterData` で手で上書き)。`regen-plan` は順序だけの辺で recheck を広げない(その段は reuse のまま `hold` —— 件数の行に
  「recheck n(第322便までの伝播なら m)・hold k 段」)。`--all-edges` で第322便までの伝播。
- **gate の速い判定**(鎖のシェル): 計画の自分の判定が reuse・html が計画の sha のまま(`PLAN_HTML_SHA` —— `REGEN_PLAN_HTML_SHA` で上書き)・データの上流が 1 つも走っていない →
  `--gate` を呼ばずに再利用(済み印の 1 行目 `reuse <時刻> fast`)。html を書く段が html を実際に書き換えた鎖では従来どおり `--gate`。**`REGEN_FASTGATE=0` で毎回 `--gate`**・
  `REGEN_FASTGATE=shadow` は影(判定は毎回 `--gate` —— `$REGEN_LOG/fastgate-shadow.txt` に「段 fast=reuse|no gate=<rc>」。fast=reuse で gate=0 の行が不一致)。
- **`--gate <段>` は段の行だけ**を引く(全段の計画は `--gate-full`)。`regen-plan --base` は領域 hash を今の html → 基点の html の順に先に引く(計画の判定は同じ)。
- **簡易一致確認の影**(判定だけ —— 鎖はフル): `regen-plan` と `regen-chain` が影の表(`plan.quickShadow` —— 領域だけの regen・候補・quick・輪番のフル・秒・外す理由)を出す。
  `--fp-record <記録>`(既定 `tests/data-w323b-quickfp.json`)・`--K 3`・`--wave <便>`(既定は html の BETA_BUILD)・`--promote`(root 昇格の便 —— 全段フル)。
- **窓の指紋の記録**: `node tools/harness-smoke.mjs --fingerprint tests/data-w323b-quickfp.json`(`--base`・`--keys` が無ければ窓のある段を全部 —— 簡易一致を使わない段は除く)。
  鎖の後に 1 回。記録はコミットする作業記録(正本ではない —— lint は形だけ)。

## 第324便c —— 道具の続き(統括の検証項目 R281・決断事項 AN516・AN517/AN518)

- **簡易一致の欠測の境界**(`tests/lib-w323b-quick.mjs` —— 版 w324c-quick-2): `quickShadow` は器・lib の hash(記録側・今の側)の欠け・不正・違い・正本の物理の値の hash の欠けを
  候補から外す。`shadowCompare` は欠測を **na**(理由つき —— trueSame に数えない)・照合の数 `tally`(比べた数・html が違う比較・na の理由ごと)・自己比較 `selfCompare`。
  `node tools/regen-plan.mjs --shadow-compare <前の記録> [--fp-record <今の記録>]` は「照合の数」の行を出し、**自己比較(同じファイル・同じ中身)は終了コード 2**(`--allow-self` で印字だけ)。
- **長期の量の名簿**: `tests/lib-w281a-regentable.mjs` の `QUICK_LONG_ROSTER`(版 w324c-quicklong-1 —— 段の行に宣言の無い段へ `quickVerify:'long'` を入れる)。
  新しい段は行に `quickVerify`(長期の量なら `'long'`・使わないなら `false` + `quickVerifyWhy`)を宣言するか名簿に足す。
- **速い判定の実効値**: 鎖の脚本の 1 行目 `# regen-chain fastgate=<0|shadow|1>(REGEN_FASTGATE=…)`・`$REGEN_LOG/fastgate.txt`・timeline の見出し `… lanes=N fastgate=<値>`(既定は 1 のまま)。
- **nslock の影の照合の記録**(AN516): 鎖の終わりに `node tools/regen-chain.mjs --nslock-shadow "$REGEN_LOG" --json "$REGEN_LOG/nslock-shadow.json"`(鎖の脚本が呼ぶ)。
  便ごとの作業記録へ: `node tools/regen-chain.mjs --nslock-shadow <REGEN_LOG> --append tests/data-w324c-nslockshadow.json --wave <便> [--rev <sha>]`・数だけ: `node tools/regen-chain.mjs --streak`
  (比較の実績が有る便だけで最後から続く n/n の便の数 —— m = 0 の便は「比較の実績なし」で数えない)。
- **post-merge**: ③・③′・④ は qapart の `# qapart-summary` の行で **PASS・FAIL・SKIP・未実行**(未実行の鍵の名・保存のフル QA にも行の無い鍵は「この対象では走らない鍵の型」)。
  ③′ の既定は**便の塊だけ**(`--wave N`・既定は CHANGELOG の最新の便 —— `tests/lib-w324c-postmerge.mjs` の waveIdsFromScript)+ PHYSICS の走査の一式。`--all-waves` で積み上げ。
- **部分 QA で覆えない鍵の名簿**: `node tools/qa-keys.mjs --uncovered [--target beta|root] [--json <file>]`(W5c の範囲・写せない上流・コメント・範囲・保存のフル QA に行の無い鍵 ——
  SKIP を印字するか、何も印字せず飛ばすか)。post-merge の ④ の後に数を出す(名簿は `$LOG/uncovered.json`)—— フルゲートが見る鍵。
- **calaudit の揮発の欄**: h/2 の転記の来歴(`V_CALAUDIT_H2P` —— 宣言の版 w324c-vcal-3)と置き場の行の html の sha(`V_CALAUDIT_DIAG_STOREP` —— w324c-vdiag-3)。
  2 回の走行の記録は `tests/data-w324c-calvolatile.json`(作業記録 —— 宣言を変えたら走らせ直して取り直す・QA lint.calVolatile324c)。

## 再開の型と衛星の長い窓(第324便d —— 決断事項 AN480・AN452・統括の検証項目 R282)

長い段を止めても続きから走らせる型(lib `tests/lib-w324d-resume.mjs`)。**完了済みのジョブの再利用**(done —— 契約つきの結果の本文)と**途中の步からの再開**(checkpoint —— 安全な步の境界で sim の全状態・検出器の累積・步の番号を原子的に保存)を分けて持つ。契約(入力・器・環境・版の hash)が違う・書きかけ・壊れた checkpoint は拒否して最初から。最初の使い手は衛星の器の長い窓の口(lib `tests/lib-w324d-satlong.mjs` —— 器が動的 import で読む・既定の経路は読まない)。

```
W324D_RESUME_DIR=<置き場> nice -n 19 node tests/exp-w318b-satnext.mjs --long          # イオ・エウロパ × 1.5 P_母(正本 tests/out/satlong-w324d.json —— 段 satlong-324d・履歴)
W324D_RESUME_DIR=<置き場> node tests/exp-w318b-satnext.mjs --long --status            # 済みのジョブと途中の checkpoint(步の番号 / 窓の終わり)を印字するだけ
W324D_RESUME_DIR=<置き場> node tests/exp-w318b-satnext.mjs --resume-gate              # 連続と再開の門(正本 tests/out/resume-w324d.json —— 段 resume-324d・履歴)
```

- 置き場の既定は `tests/out/.satlong-w324d/`(.gitignore のまま —— 数百 MiB になりうる)。`--resume-dir <dir>` でも指定できる。子プロセスは `W318B_WORKERS`(既定 2)・checkpoint の間隔は `W324D_CK_SEC`(既定 600 s)。
- 止まったら**同じ命令をもう一度**(済みのジョブは done から再利用・途中のジョブは checkpoint から続ける・`--long` は走行の初めに門を回し、外れたら走らせない)。対象 html・器と lib・凍結の写し・環境が変わると契約が違うので続きは拒否される(最初から)。
- 2 段とも履歴(計画は常に「履歴」—— 毎便の鎖に入れない)・簡易一致は使わない(quickVerify:false)。

## 第325便a —— 再生成の段の対象を html 全体にしない(html の物理の部分 —— 統括の検証項目 R284)

原仮定者の指示(2026-11-03)「次便以降で、再生成の段の対象が宣言なしの場合、html全体にしない。html全体だと、版名が変わっただけや、説明文だけの修正でも走ってしまう」。

- **html の物理の部分**(`tests/lib-w325a-htmlphys.mjs` —— 版 w325a-htmlphys-1): 部分 `code`(注釈を除いた最上位の文 —— 版名 `BETA_BUILD` の値・文の登録簿・内蔵の本の配列・生成領域 sample-status を外す)・
  `presets`(評価した内蔵の本の表示の欄を外した写し)・`markup`・`comments`・`build`・`text:<名>`・`regions:<名>`・`presetFull:<id>`(`*` は全部)。
- **段の宣言** `HTMLPHYS_DECL_325A`(`tests/lib-w281a-regentable.mjs`): 領域の宣言の無い html 全体の段が読む部分(reads —— 既定 code・presets・markup・本を `.find` で引く段は下限の本に絞る `presetFull:<id>`/`presetPhys:<id>`・
  html の文字列を直に走査して行を出す器は版名の外を全部 `HTMLPHYS_RAW_READS`)か `whole`(常時群)。部分に `textPairs`(code の中の表示の文の対 `{ja,en}`)・`presetIds` もある。
  **html 全体を刻む段を足したら宣言を足す**(無ければ QA lint.htmlPhys325a が名指しで落とす —— 器の本文・REGEN_SCOPE の行は変えずに表の側で)。
- **計画**: 刻印の html を台帳 → 基点・計画の html → git の履歴から sha で引いて宣言した部分を比べる(同じ → reuse・段の `htmlPhysUsed` / 違う → 理由の種類 `htmlphys` / 引けない → html 全体)。
  件数の行に「版名・説明だけの差で reuse にした n 段」。`node tools/regen-plan.mjs --no-htmlphys` は第324便までの判定(前後の比べ)。
- **台帳**: `node tools/regen-plan.mjs --htmlphys-record [--base <刻印の html>] [--stamp-git <N>]` → `tests/data-w325a-htmlphys.json`(物理の部分の宣言のある段の正本の刻印の html と今の html の行 ——
  **鎖の後と、html が動いたコミットの前に 1 回**。CI は浅い checkout なので QA の対象一致は台帳だけで引く)。引けない sha は名指して終了コード 1(その段は器を走らせ直す)。

## 第325便d —— 簡易一致の本運用の前の試験(統括の検証項目 R287・決断事項 AN517/AN518)

- **環境変数の窓**(`tools/harness-smoke.mjs` の `SMOKE_ARG_ENV` —— 版 w325d-smoke-argenv-1): 窓の表の行の env に `HS_ARG_*` を書くと、煙試験が走らせる前に器の引数へ写す
  (`HS_ARG_STEPS` → `--steps` ほか 9 種・env の並びの順・`HS_ARG_*` は器に渡さない)。emgrid・charon-h2・charonk・nslock・charoneps-h4 はこの形・dragcore292 は窓の器の
  `W323C_DRAGCORE_OUT`。窓の出力 `out` は走らせる前に写しから消す・同じ `out` の段は同時に走らせない・`--fingerprint` は `out` も読み、記録の頭に取った箱の `env`
  (Node・Chromium・platform・heap)を書く。第323便c の世代の行は `W325D_KNOBS_323C`(`knobs323cView()`)。
- **環境の整合**: `node tools/regen-plan.mjs [--chain-env <env.json>] [--no-env-check]` —— 影の表は記録の env と鎖の環境(無ければ今の箱の `node tools/regen-chain.mjs --env`)を照合し、
  違えば全段の候補 0(`--env` の出力に `heapMb`・`nodeOptionsHeap` を足した —— heap は印字だけ)。
- **本運用の門(休眠)**: `node tools/regen-plan.mjs --quick-gate [--shadow <影の照合の JSON>]… [--shadow-prev <前の記録 | git:<rev>>] [--fp-record <今の記録>] [--plan-json <計画>] [--chain-env <env.json>] [--promote] [--json <file>]`
  —— `tests/lib-w325d-quickgate.mjs` の `quickProductionGate` の判定(enter/hold)と門ごとの表を印字するだけ(鎖も計画も変えない・終了コード 0)。
  前の便の影の照合は git の記録からも引ける(`--shadow-prev git:<前の便の記録を含むコミット>`)。
- **変異の影の試験・暦の債務**: `tests/lib-w325d-quickgate.mjs` の `mutationSelfTest`(合成の段の便の模擬)・`calendarDebt`(提案 —— 鎖は呼ばない)。

## 第326便e —— 常時群の物理の部分の門(影)・家族の表の一時ファイル・簡易一致の門の強化・領域 hash の版 7(統括の検証項目 R294・決断事項 AN527)

原仮定者の回答(2026-11-03 —— AN527)「推奨で進める」(常時群に html の物理の部分の門を影で 1 便)。**影 —— 計画の status・鎖・済み印の契約は変えない**。

- **常時群の影**(`tests/lib-w326e-alwaysshadow.mjs` —— 版 w326e-alwaysshadow-1): `node tools/regen-plan.mjs [--base <基点 html>]` の計画に `plan.alwaysShadow326e`(常時群 13 段ごとに
  「常時群でなかったら html の物理の部分の門・器とデータ・入力で reuse にできたか」〔own〕と、常時群を own に置き換えた影の世界の数と秒)と件数の行。段の html の読み方は
  `ALWAYS_SHADOW_DECL_326E`(reads・scope・none・follows)。`--no-always-shadow` で付けない。
- **鎖の後の照合の口**: `node tools/regen-plan.mjs --always-shadow-check --plan-json <鎖の前の計画> [--base-rev <鎖の前のコミット>] [--json <file>]` —— 常時群の正本の物理の値を
  鎖の前のコミットと今で比べる(trueSame / falseSame〔影 reuse なのに値が違う —— 終了コード 1〕/ trueDiff / overRun / na)。**鎖の前に計画を取っておく**(計画の headRev が既定の基準)。
- **全部の本を領域に持つ段の絞りの探索**(`tests/lib-w326e-narrow.mjs` —— 版 w326e-narrow-1・影): `node tools/regen-plan.mjs --narrow-explore [--base <html> | --narrow-from <html>]` ——
  presets:"all" の段の名簿(named・filter・enumerates)と、変わった本だけで絞れば reuse の段の数を `plan.narrow326e` と件数の行に(段の判定は変えない)。
- **家族の表**: `tests/exp-w283b-families.mjs`(器の版 w326e-families-3)は名指しする器の走査からドット始まりのファイル(QA の静的受理の一時ファイル `.qa-preflight-*.mjs`)を外す。
- **簡易一致の本運用の門**(`tests/lib-w325d-quickgate.mjs` —— 版 w326e-quickgate-2・休眠のまま): 影の必要便数 2・暦の債務の対応を必須(債務 0 でも鎖が債務を扱えなければ hold)。
- **領域 hash の版 7**(`tests/lib-w281a-scope.mjs` —— w326e-scope-7): 本の bodies[].obsSpin の成分の説明の文(note・noteEn・source・sourceEn)を領域から外す。版 6 の刻印は版 6 の規則で照合。

## 第327便c —— 鎖を狭める 4 件・領域 hash の版 8・版の移行(一回きり)・html の物理の部分の版 2・名指しの段の領域(統括の検証項目 R297・決断事項 AN543)

原仮定者の指示(2026-11-01)「今後は、サンプルの変更だけでは、全行程を再実行しない様にする」・原仮定者の回答(2026-11-04 —— AN543)「推奨で進める」。**計画の status・鎖・済み印の契約の意味は変えない**(領域の宣言と停止の集合だけ)。

- **領域 hash の版 8**(`tests/lib-w281a-scope.mjs` —— w327c-scope-8): 停止集合に `updateBodyEdit`(選択粒子の編集の表示 —— 表示の状態 be* は表示の境界)・器の `REGEN_SCOPE` の宣言 `abBody:false`(ワンタップ対照 A/B を走らせない段 —— 器の本文に A/B の語が無いこと)と `keepProse:["familyRole"]`(familyRole を読む段)。版 7 の刻印は版 7 の規則で照合する。
- **版の移行**(一回きり): `planRegen` は刻印の版の閉包と現行の版の閉包が違う段を regen にする(理由の種類 `scopever` —— 走らせ直すと版 8 で刻まれる)。`node tools/regen-plan.mjs --no-scope-migrate` か環境変数 `W327C_SCOPE_MIGRATE=0` で切る(鎖の `--gate` も同じ既定)。件数の行「領域の版の移行」。
- **html の物理の部分の版 2**(`tests/lib-w325a-htmlphys.mjs` —— w327c-htmlphys-2): 退役の表 `RETIRED_PRESETS` を文の登録簿へ(code から外す —— 退役の表の行だけでは code を読む段は走らない)。台帳は `node tools/regen-plan.mjs --htmlphys-record --base <基点 html>` で版 2 の行に作り直す。
- **AN543**: 名指しの 6 段は presets:"all" のまま(pn1・pnsource286・pnsources291・refit-297a は文字列の式〔evalExpr・vm〕の中で全本を回る・eihdiag287・tpsign は較正走行の器の本文の評価と子プロセス —— QA が根拠の口を照合)。
- **家族の表**: 器の入力に `tests/qa.mjs`(qa.mjs を直したら `node tests/exp-w283b-families.mjs` で作り直す —— `--check` で照合)。**confirm4**: 再生成表の `HTML_TEXT_READ_DECL_327C`(html の全文を読む理由 —— 表示の区分だけ)。

## 第329便c — 道具: 条件で選ぶ本の宣言(AN554)・常時群の影の揮発の欄・固定の字数の窓・QA_FAST の heap の既定・契約の継ぎ目

- **条件で選ぶ本の宣言**(`tests/lib-w281a-scope.mjs` —— 選択器 `w329c-presetselect-1`): 器の REGEN_SCOPE に presets "all"(選べないときの戻り先)と `presetsWhere`(条件・読んだ欄・名指しの本・全本の数・器の選ぶ式)を書くと、
  刻印の道具が今の html で条件を評価し、選ばれた本 ∪ 名指しの本だけを領域 hash に刻む(評価が不明 —— 版・形・値の型・欠けた欄・閉包の本の表の読みの違い —— なら all)。
  pn1・refit-297a の 2 段(名指しの 6 段の残り 4 段は all のまま —— 再生成表の `CONDSELECT_KEEP_ALL_329C`)。器が本の表を読む行は再生成表の `CONDSELECT_329C`(QA が逐語で照合)。
- **危ない側の変異の試験**: `node tools/condselect-probe329c.mjs [--json <file>]` —— html の写し(一時のディレクトリ)を変えて、条件の宣言と従来の all の領域 hash を引く
  (条件に当たる本の変更 → regen・当たらない本 → reuse・条件に入る → regen・評価が不明 → all・鍵を足す・閉包の読み・本を足す → regen)。走らせない・正本を書かない・30 秒ほど。
- **常時群の影の照合の揮発の欄**: `tests/lib-w326e-alwaysshadow.mjs` の `SHADOW_VOLATILE_329C`(stoprule の正本の時間の欄と文の中の秒 —— `--always-shadow-check` の比べ)。
- **固定の字数の窓**: tests/qa.mjs の `secUntilNext329c(text, i, seps)`(次の見出しの前まで)—— 新しい QA は節を固定の字数で切らない。
- **QA_FAST の heap の既定**: `QA_FAST=1 node tests/qa.mjs` は heap の上限が 6144 MB より小さく heap を明示していなければ --max-old-space-size=6144 の子で起こし直す(`QA_HEAP_DEFAULT=0` で切る)。
- **契約の継ぎ目**: 第328便b の lib の `slipOf(c, OmegaArm)`(Ω_arm は明示の引数)・器は第328便a の `buildFieldContract`(版 w328b-response-2)。

## 第330便c — 道具: 計画と lint の道具の照合を 1 つの関数に・名指しの段の physics の鍵の集合の守り(AN584)・batchKeys を半開区間に・§5.19 の窓

- **道具の照合**(`tests/lib-w281a-scope.mjs` の `toolRecheck330c` —— 版 w330c-toolcheck-2): `toolStampRecheck` と計画の planRegen が同じ関数を呼ぶ。領域の刻印があれば必ず引き直す(対象が html でなければ beta/index.html —— 計画では候補の html で)。
  第329便の鎖の後の食い違い(計画は galaxychain を reuse・lint.provenanceMeta は chainledger-w281b を ④)は、対象が lib の正本に領域の刻印があったこと(旧の計画は領域を見ない・旧の lint は必ず不一致)。
- **physics の鍵の集合の守り**(AN584 —— `tests/lib-w330c-toolguard.mjs` 版 w330c-physkeys-1): 名指しの本の段の閉包の fastParams が読む全本の physics の鍵の名(雛形)・宣言の表に無い本の表の読み(全本の中身)を刻印の html と今の html で比べ、
  違えば regen(理由の種類 `physKeys` / `tableRead`・件数の行「physics の鍵の集合の守り」)。刻印の html は基点・計画の html → git の履歴(引けなければ regen)。`node tools/regen-plan.mjs --no-physkeys`・`W330C_PHYSKEYS=0` で切る。
- **変異の試験**: `node tools/toolguard-probe330c.mjs [--json <file>]`(照合の規則・一時の root の 4 段で計画と lint・守りの判定・計画の上の守り —— 15〜20 秒)/
  `--agree <計画の JSON> [--root <木>] [--lib <木>]`(実物の正本で計画と lint の道具の照合を突き合わせる —— 揃わなければ終了コード 1。刻印の道具を変える便は鎖の前の計画でこれを回すと食い違いを早く見る)/
  `--emit-html <dir>`(名指しでない本に physics の鍵を足した写し htmlK.html・値だけの写し htmlV.html —— `node tools/regen-plan.mjs --html <dir>/htmlK.html --base <基点 html>` で全段の広さ)。
- **batchKeys**(`tests/lib-w322d-qapart.mjs` 版 w330c-batchkeys-2): 範囲は半開区間 —— 端が接するだけの塊は別の組(tools/qa-keys.mjs の束が隣の塊に引きずられて 50 を超えない)。統合で枝の塊の前に空行を置く手順は残してよい(害は無い)。
- **§5.19 の窓**: docs.nsLockLedgerRow は CALIBRATION_VERDICT §5.19 を次の「### 」か「## 」の見出しまで読む(`secUntilNext329c`)。

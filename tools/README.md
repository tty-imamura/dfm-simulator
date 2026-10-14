# tools/ — 運用の器

各器の詳しい意味は、器の先頭の注釈が正本である。ここには**呼び出し方**だけを置く。

## post-merge-qa.sh — 統合直後の部分 QA(第287便f)

```
tools/post-merge-qa.sh [--base beta/_wNNN_base.html] [--failed "id id …"] [--no-root] [--no-preflight]
```

統合(枝の取り込み)の直後に、壊れやすい所を短く一周する。順序は

1. 静的受理 — `tests/qa-preflight.mjs`(beta・Chromium なし)
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
node tools/harness-smoke.mjs --self-test            # 器を走らせない自己試験(QA lint.harnessSmoke303 と同じ関数)
```

基点の html と今の html の差(最上位の名前・`window.HP` の口・内蔵プリセットの生と受理後・`S._core`)と、`--base-rev` からの器・lib の差から、
再生成表の段のうち**差を直接読む器**(領域の宣言 REGEN_SCOPE の roots〔宣言の無い器は機械で引いた下限〕・宣言したプリセット・all の器・器のコード)を選び、
作業ツリーの写し(`$TMPDIR/harness-smoke-<時刻>/root` —— 正本は書かない)で並列(`--lanes 2`)に走らせて、**受理の例外・門の偽・NaN** だけを報告する。
長い器は表 `SMOKE_KNOBS` の窓(QUICK・PART・步数)を使い、それでも枠(`--budget 90` 秒)を越える器は枠で止める(最初の数段 —— 報告に書く)。
多くの器が共有する名前(validatePreset など —— 宣言の 40% 以上)だけの段は `--wide`、閉包だけの段は `--indirect` で足す。全体の枠は `--max-minutes 30`(枠の外の段は「未実行」として数える)。
過去の状態を試すとき: `git archive <rev> | tar -x -C <dir>` で取り出し `--root <dir> --head-rev <rev> --git-dir <.git>`(第302便の dragnorm の停止 2 回と同じ型の例外が統合直後の状態で出た)。

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

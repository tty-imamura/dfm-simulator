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
4. 常設集合 — `lint.regenScope`・`behavior.rayLensExcluded`・`ai.stabilize`・`docs.fourValuesHistory`・`docs.preset-table-sync`・
   `docs.families`・`ui.samplePicker`・`lint.provenanceMeta`・`ui.pickerSeparators` を qapart で beta と root(root では beta 線の新設ブロックは SKIP)
5. 影響サンプルの短走 — `--base` があるとき `tests/exp-w258c-bitsame.mjs` の差分 ID(情報 —— 物理を変える枝では差が出て正しい)

最後に 1 行(`post-merge-qa: ① … ② … ③ … ④ beta p/n・root p/n(SKIP s)⑤ … 所要 N s → OK|FAIL`)を出す。ログは
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
```

生成したシェルは `REGEN_ROOT`・`REGEN_HTML`・`REGEN_LOG`・`REGEN_LANES`・`REGEN_TOOL`(`--digest` を呼ぶ器の場所 —— 既定
`tools/regen-chain.mjs`)を読む。済み印の契約は静的な部分と入力の安定 hash(`tests/README.md` §2)。

## p2fig-compare.mjs — 論文2 の図データの照合(第287便f)

```
node tools/gen-figures2.mjs                       # 図の再生成(数値ゲート 22 件)
node tools/p2fig-compare.mjs [--ref HEAD] [--now-dir paper/figures]
P2FIG_OUT=/tmp/p2 node tools/gen-figures2.mjs && node tools/p2fig-compare.mjs --now-dir /tmp/p2   # 作業ツリーを汚さずに照合
```

`paper2.yml`(PR)と `nightly.yml` の job `paper2-figures`(毎晩・TeX なし・失敗は FAIL)が同じこの器を呼ぶ。

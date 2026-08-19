# paper/ — arXiv 向け第1論文(software / computational toy model paper)

- 現行稿 **v0.7**(2026-07-20 — 公開前整合スプリント)。改稿履歴は `dfm-paper.tex`
  冒頭コメントに記録(v0.1 初稿 → v0.2 第5次模擬査読 → v0.3 英文校閲 →
  v0.4 E12 節 → v0.5 第6次査読=論文・コード一致回復 → v0.6 タイトル変更(4-19)→
  v0.7 公開前整合)。
- 執筆指示書は内部開発文書 HANDOFF_PAPER_V2.md(唯一の正本・非公開管理。2026-07-20 改訂 —
  禁止事項 6/7 の E12 整合と新タイトル。旧 HANDOFF_PAPER.md は参照禁止)。
- 入力正本: `docs/DERIVATIONS.md` / `docs/PHYSICS.md` v1.9 /
  `docs/THEORY_SYNTHESIS.md` v1.7+ / `index.html` **v1.27**(実験の物理エンジンは
  v1.20–1.21 の E12/E8R 改訂以降不変)。
- タイトル(4-19 確定): *Determinacy-Field Mechanics: A Machian Toy Universe with
  Tunable Frame Dragging, Inverse-Square Gravity, and Spin-as-Heat Analogies*
- 投稿先候補: American Journal of Physics / European Journal of Physics(第1)、
  Foundations of Physics / SciPost Physics Core(第2)。
  arXiv カテゴリ: physics.ed-ph(主)+ gr-qc(クロスリスト)。

## ビルド

```sh
pdflatex dfm-paper.tex && pdflatex dfm-paper.tex
```

RevTeX 4.2 が必要(TeX Live 標準同梱)。現行クラスオプションは `aps,reprint`
(ドラフト用)。AJP 投稿時は誌のテンプレート指定に合わせて差し替える。

## 日本語版(dfm-paper-ja.tex)

英語版 v0.9(記録版 = タグ `paper-v1`、doi:10.5281/zenodo.21454189)の
著者による日本語全訳。国内発表・国内読者向け。正本は英語版であり、
相違がある場合は英語版が優先する(訳注として第1ページに明記)。
数値・数式・主張・参考文献は英語版と同一。著者名は「今村哲矢」表記。
訳語は `docs/THEORY_SYNTHESIS.md` §9 の用語対訳表に統一
(決定力 / 背景決定力 D₀ / 局所フレーム u / フレーム引きずり k_F /
スピン引きずり / スピン斥力 k_rep / 固有時間 τ / 決定ポテンシャル ψ /
スピン=熱。和名は「決定力場モデル」、A13 は相互性公理、
レンズ=サーリング表記)。

```sh
lualatex dfm-paper-ja.tex && lualatex dfm-paper-ja.tex
```

LuaLaTeX + luatexja + 原ノ味フォント(TeX Live の
`texlive-luatex` / `texlive-lang-japanese` 相当)が必要。クラスは
`ltjsarticle`(2段組)。図は英語版と同じ `figures/` を参照する。
生成 PDF(20ページ)は英語版と同様ビルド成果物扱いでコミットしない
(`.gitignore` の `paper/*.pdf`)。

## 図の再生成(機械生成 — スクリーンショットは補助のみ)

```sh
node tools/gen-figures.mjs        # 全6図を figures/ に svg + pdf + json で生成
FIG=2,5 node tools/gen-figures.mjs  # 個別再生成
```

headless Chromium + HP フック駆動(依存は `npm ci` の playwright のみ)。
各図の `.json` に生成パラメータ・実測値・コミットハッシュを記録し、
数値ゲート(`figures/figures-gates.json`)が文書値との一致を機械強制する。
**投稿直前に必ず提出コミットで全図を再生成し、図 JSON・qa-results.json・論文の
コミット参照を一致させること**(第6次査読 Major 3 の再発防止)。

| 図 | 生成手段(v0.5 で廃止プリセット非依存化) | 実測ゲート(2026-07-20 再生成) |
|---|---|---|
| Fig. 1 | バケツリング構成(スクリプト内明示。旧 `mach`)+プローブ8点、D₀∈{0.05..128} | 解析 w/(w+D₀) と差 0.0% |
| Fig. 2 | preset `galaxy`(n=380, r≤260, D₀=1)+ abStart(kFrame,0)、6000步 | 外縁比 kF1/kF0 = 1.082 (>1.04) |
| Fig. 3 | V6 構成3ラン+ロゼット構成(スクリプト内明示。旧 `drag`)168000步 | −7.52° / +10.71° / 対照 −1.03° |
| Fig. 4 | V12/V13/V16 同構成(各1000步) | 最大相対誤差 9.1e-5 (<1e-3) |
| Fig. 5 | preset `lensing`(26本ファン)+ V8 構成(spin±0.5, Kt=500) | 非対称度 ∓6.77e-2 rad(符号反転) |
| Fig. 6 | preset `gas`(**64000步** — v1.18/21 統制化対応)/ `pressure`(16000步) | 温度ギャップ 4.36→0.29・コア半径 34.5→140.9(×4.09) |

## 投稿前 TODO(現況)

- [x] 図6枚の機械生成+現行コミットでの再生成(v0.5)
- [x] 書誌の全件検証(2026-07-18: 外部AI 3系統のクロス検証で全25件確認)
- [x] 著者所属行の確定(Independent Researcher, Tokyo, Japan)
- [x] 英文校閲(v0.3)・第6次外部AI査読の裁定(v0.5)・タイトル確定(v0.6)
- [x] Table I/IV の標準資料引用(v0.8: CODATA 2022 / IAU 2015 B3(Prša+16)/
      Ashby 2003 — 一次資料照合済み。第6次査読 Major 12)
- [x] pdflatex 2パス+ページ数確定(**16ページ** — エラー0・未解決参照0。
      arXiv Comments 欄確定)
- [x] リポジトリ提出版タグ+Zenodo DOI の挿入(v0.9: タグ `paper-v1`・
      **doi:10.5281/zenodo.21454189** を Reproducibility 節に確定。TODO 解消)
- [x] 日本語要旨(国内発表用・必要なら)→ 全訳版 `dfm-paper-ja.tex` として
      実施(2026-07-20。要旨のみでなく本文・付録・図表キャプション含む全訳)

## 受け入れ条件(HANDOFF_PAPER_V2 §7)と検査

grep で機械確認する:

1. 禁止事項7項目が0件(旧近点式 √(GMr³)・廃止サンプル名・独立レンズ係数・
   無限定の「完全閉性」・「重力を仮定せず導出」・過剰主張(水星は基底力学スコープ
   限定 — 2026-07-20 改訂)・旧個数)
2. Negative claims 1〜6 が Introduction 要約+Sec. VI 全文の2箇所
3. 現実較正(GPS/偏向/シャピロ=一致、水星=基底力学は不一致・E12 は再現)が
   同一表(Table I)
4. 全図キャプションに生成手段(プリセットID / Vフック / 明示構成+パラメータ)
5. 著者・AI開示・ライセンスが HANDOFF_PAPER_V2 §2 のとおり
6. アメリカ式綴り、SI 復元表が付録(Appendix A)

---

# 第2論文「箱宇宙」(dfm-paper2.tex / dfm-paper2-ja.tex)

- 現行稿 **v0.4**(2026-07-30 第46便 46F — 図8点の機械生成と組み込み)。
  改稿履歴は `dfm-paper2.tex` 冒頭コメント。
- 執筆指示書は内部開発文書 HANDOFF_PAPER2_WRITE.md v1.1(唯一の正本・非公開管理)。
- 図の設計正本: 骨子 HANDOFF_PAPER_BOX.md v0.3 §4 と EXP_4-66_PROBE_H_DESIGN.md
  (図6の仕様 — いずれも内部開発文書・非公開管理)。

## ビルド

```sh
pdflatex dfm-paper2.tex    && pdflatex dfm-paper2.tex      # 英語版(RevTeX 4.2・7ページ)
lualatex dfm-paper2-ja.tex && lualatex dfm-paper2-ja.tex   # 日本語版(ltjsarticle・8ページ)
```

## 図の再生成(機械生成)

```sh
node tools/gen-figures2.mjs          # 全8図を figures/ に p2fig1..8.{svg,pdf,json} で生成
FIG=2,6 node tools/gen-figures2.mjs  # 個別再生成(gates json は該当分だけ差し替え)
P2_SEEDS=20260723,1,2 node tools/gen-figures2.mjs   # 図8の seed 上書き
```

第1論文の `tools/gen-figures.mjs` と同じ流儀(headless Chromium + HP フック駆動・
外部チャートライブラリなし)。**対象は `beta/index.html`**(V29・freebox・
boxredshift・rotorSolo は beta 先行)。各図の `.json` に生成パラメータ・実測値・
コミットハッシュを記録し、数値ゲート `figures/p2figs-gates.json`(21件)が
本文・キャプションの値との一致を機械強制する。

| 図 | 生成手段 | 実測ゲート(2026-07-30) |
|---|---|---|
| p2fig1 | 模式図(シミュレーション不要・SVG 手組み) | 数値なし |
| p2fig2 | V23a/V24a 構成(96質点リング R=260)を r=20..240 へ半径スキャン+連続リング極限の求積 | g(20)=0.5002(解析 1/2)・解析との最大差 0.07% |
| p2fig3 | V25 の binLn/nNet を転記し universeBox.D をスキャン(連星 m=2000, d=24 固定) | アンカー n=1.61 / 0.00・φ_B 0.088→0.990 で単調 0.00→1.59 |
| p2fig4 | preset `boxredshift`(QA `box.photon-abc` と同一構成・t<75) | z_A=2.9187 / z_B=0.9556・帳簿ずれ 0(<1e-9)・到着差 0.080 |
| p2fig5 | preset `freebox`(QA `freebox.*` と同一・1200步) | a_eff=2.1795 / 圧力オフ 最大 1.0047(t=9.2)→再収縮・帳簿全0 |
| p2fig6 | V29 の測定系を D/Kt∈{0.3, 0.9242, 1.5}×24窓へ拡張+反比例対照(後処理) | 解析との最大相対誤差 6.2e-3・較正点 0.9242・対照 |比−1|<3.7e-3 |
| p2fig7 | preset `rotorSolo`(QA `behavior.rotorSolo` と同一光線条件) | 非脱出率 0.66→0.00・spin0.3 で 0.72(別機構)・ロックで 0.00・順行/逆行 123.4/40.4 |
| p2fig8 | tests/seeds.mjs の8帯測定系を転記・preset `galaxy`・8seed×6000步 | 外縁ブースト 1.331±0.009・帯別増強 1.58(r=121)→1.16(r=251) |

**投稿直前に必ず提出コミットで全図を再生成し、図 JSON と論文のコミット参照を
一致させること**(第1論文と同じ規律)。

---

# 第3論文「現実較正」/ 第4論文「スケール横断の創発」(2026-08-16 再編)

- **番号再編(2026-08-16 裁定)**: 論文3のテーマを**現実較正**とし、執筆中だった
  「スケール横断の創発」ドラフト(旧 dfm-paper3)は**内容不変のまま論文4へ繰り下げ**
  (`dfm-paper4.tex` / `dfm-paper4-ja.tex` v0.3)。
- **dfm-paper3.tex / dfm-paper3-ja.tex(v1.0-draft)**: 現実較正テーマの全文稿。
  柱は ①43″/世紀の力学直接再現(比1.002)②kF1 安定性の単位系依存 ③運動引きずりによる
  月の近点回転 8.85年の較正再現 ④共通補正 (D₀=0.006) の qLock 導出規則への純化 — 全章を
  「較正一致≠機構同定」の正直な較正の哲学で貫く。第140便で図4点と木星ガリレオ衛星
  hold-out(第VI節F)を収載。第141便で外部レビュー対応(qLock を「遠方近似の LT 級振幅規約」
  として再定義+有限半径因子表・W1〜W5 表・検証対応表の3列化・木星の感度実測)。計測正本: tests/exp-obscal.mjs・exp-kf1.mjs・exp-kf1b.mjs・
  exp-kf1c.mjs・exp-kf1d.mjs・exp-qlockradial.mjs・exp-jupiter.mjs / docs/PHYSICS.md §5。
- ビルドは第1・2論文と同じ(英語版 pdflatex ×2 / 日本語版 lualatex ×2)。
  CI は `.github/workflows/paper3.yml`(第140便)が paper2 と同格のゲートを張る:
  図再生成+**回帰整合ゲート(regression/consistency gates)** → コミット済み JSON との
  一致 assert → 英日ビルド
  (エラー・未定義参照ゼロ)→ PDF アーティファクト。論文4は引き続き手動。

## 論文3の図の再生成(機械生成)

```sh
node tools/gen-figures3.mjs          # 全4図を figures/ に p3fig1..4.{svg,pdf,json} で生成
FIG=3,4 node tools/gen-figures3.mjs  # 個別再生成
```

第1・2論文の生成器と同じ流儀(自前 SVG + headless Chromium での印刷・外部チャート
ライブラリなし)だが、**シミュレータは駆動しない**: 図の数値はすべて **コミット済みの
結果 JSON**(`tests/out/*.json`)から読む(手打ちの実測値ゼロ・2回実行で揮発キー以外
バイト一致)。**回帰整合ゲート** `figures/p3figs-gates.json`(第141便で「数値ゲート25件」から
改称・現在28件)が本文・キャプションの値との一致を機械強制する。これは独立な再測定では
なく、描画値とコミット済み結果 JSON の整合を固定する回帰検査である(検査は弱めていない)。

| 図 | 内容 | 出典 JSON | 実測ゲート |
|---|---|---|---|
| p3fig1 | 不変量ラダー(実測 vs 解析・深さ3桁)+段別の比 | `obscal-results.json` `.tests.mercuryReal` | 比 1.0013〜1.0019・log–log 傾き 0.9999・43.04″/世紀(観測比 0.14%) |
| p3fig2 | ループ利得の用量応答(2経路)+ χ_M の非対称 | `obscal-results.json` `.tests.kframeStability` | 安定境界 4.1e-3〜8.9e-3・k_sat 経路の χ_M 0.9395〜0.9402・D₀ 経路で単調減少 |
| p3fig3 | ω_DFM/Ω_LT の半径プロファイル(qLock q*=8.25 / q=3 / LT) | `qlockradial-results.json` | 参照点 裸 0.944・外側傾き −8.99(ω)・W5 傾き差 5.19・χ 飽和 0.912→0.115 |
| p3fig4 | 木星ガリレオ衛星 hold-out(周期偏差・軌道保持) | `jupiter-results.json` | JW1 ≤0.068%・JW2 周期 ≤0.051%/\|Δa\|/a ≤0.142%・衛星別 fit 0・q=3 対照は2衛星で ±1% 超 |

**投稿直前に必ず提出コミットで全図を再生成し、図 JSON と論文のコミット参照を
一致させること**(第1・2論文と同じ規律)。

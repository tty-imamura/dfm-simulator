# paper/ — arXiv 向け第1論文(software / computational toy model paper)

- **現行稿 = v0.12**(2026-08-22・第167便)/ **version of record = v0.9**
  (2026-07-20 確定・第143便の組版/書誌パスを含む)。現行稿は記録版の
  **post-record editorial revision** であり、数値・claims・式・窓は v0.9 から
  1つも動いていない(表記の正準化〔K_t → κ〕・タイトルと副題・組版・文言のみ)。Zenodo への再登録は
  投稿時作業(`dfm-paper.tex` 冒頭 TODO(release))。
  版表記はここと `dfm-paper.tex` 冒頭の "CURRENT VERSION"/"VERSION OF RECORD" 行の
  2箇所だけで、常に一致させる(第143便で v0.8/v0.9/README v0.7 の三重表記を解消)。
  改稿履歴は `dfm-paper.tex` 冒頭コメントに記録(v0.1 初稿 → v0.2 第5次模擬査読 →
  v0.3 英文校閲 → v0.4 E12 節 → v0.5 第6次査読=論文・コード一致回復 →
  v0.6 タイトル変更(4-19)→ v0.7 公開前整合 → v0.8 標準資料引用 →
  v0.9 提出版タグ+Zenodo DOI 確定 → 第143便 組版・書誌のみ〔主張・数値は不変〕→
  v0.10 第156便 図5見出しの κ 変換とメタデータ統一〔主張・数値は不変〕→
  v0.11 第161便 外部レビュー第4巡の文言対応〔主張・数値は不変〕: 要旨の E12 に
  静的・単一支配源・test-particle 較正という限定を明記(P1-1)、序論(§I B)に主張の
  3階層(実装が基準値を再現/モデル拡張が述べた領域で較正/物理機構が独立に検証)を
  分離する段落と E12 導入動機の丁寧化(P1-2)、要旨に平面上で 1/d² を措定する理由の
  1文(M-4)→ **v0.12 第167便 タイトル短縮**〔主張・数値は不変〕: 主題を
  *Determinacy-Field Mechanics: An Executable Machian Toy Universe* へ短縮し、
  旧題が含んでいた要素(調整可能な frame dragging・逆二乗重力・spin-as-heat・
  GPS/光偏向/Shapiro の弱場較正・「One Calibration, Not Evidence」)は
  **1つも落とさず副題へ再配置**した(組版・メタデータのみ))。
- **対象の分離**: 本論文が記述するのは提出タグ `paper-v1`(release v1.27.0 系)で
  あって、リポジトリの HEAD ではない。現行アプリは **v1.41.0**(リリース済み —
  beta v1.41-b1 から昇格)で、プリセット・エンジンオプション・ゲート件数はすでに
  動いている(Reproducibility 節に明記)。
  ※ 論文2 の図データの出所表記「build v1.41-b1」は**当時の beta build を指す帰属**なので
  そのまま据え置く(キャプション照合ゲートの対象 — 昇格に合わせて書き換えてはならない)。
- 執筆指示書は内部開発文書 HANDOFF_PAPER_V2.md(唯一の正本・非公開管理。2026-07-20 改訂 —
  禁止事項 6/7 の E12 整合と新タイトル。旧 HANDOFF_PAPER.md は参照禁止)。
- 入力正本: `docs/DERIVATIONS.md` / `docs/PHYSICS.md` v1.9 /
  `docs/THEORY_SYNTHESIS.md` v1.7+ / `index.html` **v1.27**(実験の物理エンジンは
  v1.20–1.21 の E12/E8R 改訂以降不変)。
- タイトル(4-19 確定 → 第153便で副題を追加 → **第167便で主題を短縮**):
  主題 *Determinacy-Field Mechanics: An Executable Machian Toy Universe* /
  副題 *Tunable Frame Dragging, Inverse-Square Gravity, and Spin-as-Heat Analogies;
  the GPS Clock Offset, Solar-Limb Deflection and Shapiro Delay as Consequences of
  One Calibration, Not as Evidence*
  (Zenodo v1 レコード 21454189 の表題は旧主題のみ — bibitem は投稿時の再登録まで
  当該レコードの実表題で引用する。論文2・3 の `\bibitem{DFM1}` は変更しない)
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
生成 PDF(頁数は下の「頁数(ローカルビルド実測)」を参照)は英語版と同様
ビルド成果物扱いでコミットしない
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
| Fig. 5 | preset `lensing`(26本ファン)+ V8 構成(spin±0.5, κ=1/500) | 非対称度 ∓6.77e-2 rad(符号反転) |
| Fig. 6 | preset `gas`(**64000步** — v1.18/21 統制化対応)/ `pressure`(16000步) | 温度ギャップ 4.36→0.29・コア半径 34.5→140.9(×4.09) |

## 投稿前 TODO(現況)

- [x] 図6枚の機械生成+現行コミットでの再生成(v0.5)
- [x] 書誌の全件検証(2026-07-18: 外部AI 3系統のクロス検証で全25件確認)
- [x] 著者所属行の確定(Independent Researcher, Tokyo, Japan)
- [x] 英文校閲(v0.3)・第6次外部AI査読の裁定(v0.5)・タイトル確定(v0.6)
- [x] Table I/IV の標準資料引用(v0.8: CODATA 2022 / IAU 2015 B3(Prša+16)/
      Ashby 2003 — 一次資料照合済み。第6次査読 Major 12)
- [x] pdflatex 2パス+ページ数確定(エラー0・未解決参照0。arXiv Comments 欄の
      頁数は下の「頁数(ローカルビルド実測)」の値を用いる)
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

- 現行稿 **v0.11**(2026-08-22 第167便 — 改題+感度分析。**数値・ゲート・図は不変**):
  タイトルを *The Box Universe: Probe-Dependent Expansion Estimates in a Relational
  Toy Model* へ変更(旧副題「意図的に限定したハッブルテンション類似」が担っていた限定は
  要旨の免責2文と第VI節に既に在り、そこは不変)。要旨・序論は新題に整合させ、
  **推定量バイアスを先導・ハッブルテンションを動機と比較として後置**する順序へ調整
  (文の順序と接続のみ。節構成・数値・ゲート対象文言は不変)。第V節に新設 C
  「Sensitivity of the ratio to the assumed decay law」— 小表(5係数×3観測窓×2ビニング
  = 30構成の比)+2段落で、「0.92 という値は係数選択の反映」と「プローブ依存自体は
  構成に依らず残る」を分離。出典は新ハーネス `tests/exp-p2sens.mjs`(committed 出力
  `tests/out/p2sens-results.json`)で、**図の新設はなく `tools/gen-figures2.mjs` と
  その22ゲートは無変更**。本文・小表の全数値は同 JSON からの機械転記であり、
  ハーネス自身の `paperSync` ブロックが en/ja 両ファイルを読んで照合する(手書き数値ゼロ)。
  v0.10 は 2026-08-22 第161便(外部レビュー第4巡の文言・書誌対応。
  数値・ゲート・図は不変): ハッブルテンション記述を Planck/SH0ES の2値対立から
  「JWST 期の複数の距離梯子解析に幅がある」記述へ(P1-3。Freedman et al. 2024 を
  新規 bibitem として追加し、既収載の Riess et al. 2024 と併せて引用 — 両者に
  TODO(ref-verify))、序論に「解決提案ではない」再強調1文・結論部に a→∞ でプローブ比が
  0 へ収束する挙動は実宇宙に適用できない旨の強調1文(M-2)。
  v0.9 は 2026-08-21 第156便(Code and data availability の現在形化・要旨の免責圧縮・
  所属統一。数値・ゲート・図は不変)。v0.8 は 2026-07-31 第51便
  (外部査読対応の Major revision)、図8点の機械生成と組み込みは v0.4(第46便 46F)。
  改稿履歴は `dfm-paper2.tex` 冒頭コメント。
- 執筆指示書は内部開発文書 HANDOFF_PAPER2_WRITE.md v1.1(唯一の正本・非公開管理)。
- 図の設計正本: 骨子 HANDOFF_PAPER_BOX.md v0.3 §4 と EXP_4-66_PROBE_H_DESIGN.md
  (図6の仕様 — いずれも内部開発文書・非公開管理)。

## ビルド

```sh
pdflatex dfm-paper2.tex    && pdflatex dfm-paper2.tex      # 英語版(RevTeX 4.2)
lualatex dfm-paper2-ja.tex && lualatex dfm-paper2-ja.tex   # 日本語版(ltjsarticle)
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
コミットハッシュを記録し、数値ゲート `figures/p2figs-gates.json`(**22件** —
第143便で図8キャプションの主数値を機械抽出して照合する `p2fig8.caption` を追加。
既存21件は値・意味とも不変)が本文・キャプションの値との一致を機械強制する。

| 図 | 生成手段 | 実測ゲート(2026-07-30) |
|---|---|---|
| p2fig1 | 模式図(シミュレーション不要・SVG 手組み) | 数値なし |
| p2fig2 | V23a/V24a 構成(96質点リング R=260)を r=20..240 へ半径スキャン+連続リング極限の求積 | g(20)=0.5002(解析 1/2)・解析との最大差 0.07% |
| p2fig3 | V25 の binLn/nNet を転記し universeBox.D をスキャン(連星 m=2000, d=24 固定) | アンカー n=1.61 / 0.00・φ_B 0.088→0.990 で単調 0.00→1.59 |
| p2fig4 | preset `boxredshift`(QA `box.photon-abc` と同一構成・t<75) | z_A=2.9275 / z_B=0.9581・帳簿ずれ 0(<1e-9)・到着差 0.080 |
| p2fig5 | preset `freebox`(QA `freebox.*` と同一・1200步) | a_eff=2.1795 / 圧力オフ 最大 1.0047(t=9.2)→再収縮・帳簿全0 |
| p2fig6 | V29 の測定系を D/Kt∈{0.3, 0.9242, 1.5}×24窓へ拡張+反比例対照(後処理) | 解析との最大相対誤差 6.2e-3・較正点 0.9242・対照 |比−1|<3.7e-3 |
| p2fig7 | preset `rotorSolo`(QA `behavior.rotorSolo` と同一光線条件) | 非脱出率 0.66→0.00・spin0.3 で 0.72(別機構)・ロックで 0.00・順行/逆行 123.4/40.4 |
| p2fig8 | tests/seeds.mjs の8帯測定系を転記・preset `galaxy`・8seed×6000步 | 外縁ブースト **1.331±0.008**・帯別増強 1.58(r=121)→1.16(r=251)。第143便でキャプション・付録・本文を本 JSON の現行値へ統一し、`p2fig8.caption` ゲートで機械固定 |

**投稿直前に必ず提出コミットで全図を再生成し、図 JSON と論文のコミット参照を
一致させること**(第1論文と同じ規律)。

## 感度分析(第V節C — 第167便・外部レビュー第4巡 P1-5)

```sh
node tests/exp-p2sens.mjs                                  # 既定(対象 beta/index.html)
P2S_OUT=/tmp/run1.json node tests/exp-p2sens.mjs           # 1回目(決定性照合用)
P2S_DET_REF=/tmp/run1.json node tests/exp-p2sens.mjs       # 2回目 → raw の SHA-256 を照合
```

`tools/gen-figures2.mjs` p2fig6 の測定系・推定式を**逐語転記**して再実装し、
減衰係数 Dκ ∈ {0.5, 0.75, 0.9242, 1.25, 1.5} × 観測範囲 a: 1→3^s(s ∈ {0.5, 1, 2})×
ビニング {ln a 等間隔(正本)/ a 等間隔(代替)} の **30構成**を実測して
`tests/out/p2sens-results.json` に記録する。事前登録窓(実測前固定・JSON に逐語収載):

| 窓 | 内容 | 実測(第167便) |
|---|---|---|
| PW1 | 正準構成が committed `figures/p2fig6.json`(Dκ=0.9242 系列24行)を論文2 既存ゲートと同じ許容(相対 1e-2)で再現 | **PASS**(144/144 フィールド **bit 一致**・最大相対差 0) |
| PW2 | 30構成の比を表収載(窓なし・記述) | 収載(本文小表) |
| PW3 | 全30構成で \|比−1\| > 数値床(床 = 正準構成の比の収束誤差 3.6e-3) | **PASS**(30/30・最小 1.20e-2 = 床の3.3倍) |
| PW4 | 別プロセス2回実行の raw SHA-256 一致 | **PASS** |

**図は新設せず、`tools/gen-figures2.mjs` と `figures/p2fig*.json`・`p2figs-gates.json` は
1 bit も変更しない**(本ハーネスはそれらを読み取り専用で参照するだけ)。本文・小表の数値は
同 JSON からの機械転記で、ハーネスの `paperSync` ブロックが `dfm-paper2.tex` /
`dfm-paper2-ja.tex` を読んで全項目を照合する(不一致があれば `paperSync.result` が FAIL)。

---

# 第3論文「現実較正」/ 第4論文「天体再現」/ 第5論文「ミクロの相変移」(2026-08-16 再編・2026-08-24 分割)

**論文4/5 分割(2026-08-24 原仮定者裁定「採用」・第191便 v0.4/v0.1 で構造改稿)**:
論文4 は「スケール横断の創発」から**天体再現**(マクロ: 重力・引きずり・形態)へ再構成 —
ミクロ章(内部スピン熱化)と隠れ質量ラダーは新設の**論文5「ミクロの相変移」**
(`dfm-paper5.tex` / `dfm-paper5-ja.tex` v0.1)へ**逐語移設**した。論文4 v0.4 の新設節:
①「太陽系実較正: ゼロフィット転写」(実測 — 転写ファミリー5件+🟠 hold-out・自由中心
反作用則 E6′-R の発見・引きずり超過の χ 系列 +0.002%/+0.117%/+0.246% と向き非依存)
②「銀河形態への段階的計画(計画)」(8対象クラス×観測版/DFM版・事前宣言ゲート —
結果の主張なし)。論文5 v0.1 は移設したミクロ章(実測)+計画章の骨格(コアv2 相転移・
減光クラス D0–D6・減光/消失の設計制約実験・隠れ質量ラダー)。
**CI**: 新設 `paper45.yml` が両論文の英日4ファイルをビルドゲート化(paper1 のひな型 —
ビルドのみ・エラー0・未定義参照0を assert。頁数・overfull は CI アーティファクトの PDF で確認)。

## 旧記録(2026-08-16 再編)

- **番号再編(2026-08-16 裁定)**: 論文3のテーマを**現実較正**とし、執筆中だった
  「スケール横断の創発」ドラフト(旧 dfm-paper3)は**内容不変のまま論文4へ繰り下げ**
  (`dfm-paper4.tex` / `dfm-paper4-ja.tex` v0.3)。
- **dfm-paper3.tex / dfm-paper3-ja.tex(現行稿 v1.3 / v1.3-ja — 2026-08-22 第173便。
  初出の全文稿は v1.0-draft)**: 現実較正テーマの全文稿。
  柱は ①43″/世紀の力学直接再現(比1.002)②kF1 安定性の単位系依存 ③運動引きずりによる
  月の近点回転 8.85年の較正再現 ④共通補正 (D₀=0.006) の qLock 導出規則への純化 — 全章を
  「較正一致≠機構同定」の正直な較正の哲学で貫く。第140便で図4点と木星ガリレオ衛星
  hold-out(第VI節F)を収載。第141便で外部レビュー対応(有限半径因子表・W1〜W5 表・
  検証対応表の3列化・木星の感度実測)。**第156便(v1.1)で qLock を
  「有限参照正規化規約」として再定義**した — 宣言参照軌道 a でスピン項振幅を
  LT 振幅×裸比 (a/(R+a))³ に一致させる規約であって、LT の r⁻³ 則も無限遠での
  非零 LT 比も保存しない(比は d^(3−q*) で消える)。第141便の「遠方近似の LT 級
  振幅規約」という表現は漸近命題として偽なので撤回した(数値・窓は一切不変)。
  木星 hold-out も「規則が選ぶ強減衰クラス(q≳8)の検証」へ範囲を狭めて記述する。
  **第161便(v1.2)で外部レビュー第4巡に対応**(実測値の手書きはゼロ — 本文へ新規に
  入る数値はすべてコミット済み結果 JSON からの機械転記であり、JSON と機械照合済み):
  木星入力表を `paper/data/jovian-satellites.csv` として恒久保存し、本文から sha256 の
  先頭12桁付きで参照(P0-1)/ 第162便の JUP365 ソース依存性(UW1〜UW4)を第VI節Fに
  短い段落+小表として収載(P0-2。**比較対象は fact-sheet 系のまま不変**)/ 要旨に
  半径方向監査の 2 PASS・3 FAIL を明記(P1-6)/ 木星の高q対照を「q=3 と飽和した
  高qクラス(q=8〜14 で鈍感)を区別するストレステスト」と表現(P1-7)/ 本文未引用の
  `\bibitem{DFM4}` を削除(P1-8。削除理由はコメントで保持)/ M-3 の小追記3点
  (単位系ロックの直感的解説・qLock 遠方減衰の定量注記・8.85年一致を「偶然か構造か」
  現時点では判定しない旨)。
  **第173便(v1.3)で q_exact 規約採用の反映**(実測の再解釈・書き換えはゼロ。
  本文へ新規に入る数値はすべてコミット済み結果 JSON / アプリの claims からの機械転記):
  第141便に「採らなかった代替規約」として記録した厳密一致式
  `q_exact = q* + 3·ln(a/(R+a))/ln((R+a)/R)` が、第172便(2026-08-22 原仮定者裁定・
  開発線 v1.42-b1)で**アプリの運用規約として採用された**事実を記録する。
  ① 第VI節Cの段落を「代替規約と、本論文の測定の後に行われたその採用」へ改訂し、
  歴史的経緯(当初 q* 直値 → 第164便 `tests/exp-qexact.mjs` の頑健性実測〔4系とも
  **既存の事前登録窓のまま** PASS・`tests/out/qexact-results.json`〕→ 採用)を書いた。
  採用が変えるのは**参照軌道での裸比が (a/(R+a))³ → 1 になること1点だけ**で、
  q_exact>3 ゆえ LT の r⁻³ 則も無限遠での非零 LT 比も依然として保存しない。
  ② 表 `tab:qlock` の後に「どの直値がどこで宣言されているか」の注記
  (本稿の全測定と固定タグ v1.41.0 は q* 直値・アプリ現行線は q_exact 直値
  6.1471 / 8.2358 / 20.4932 / 12.0586)+採用直値での再実測値(いずれも既登録窓の内側)。
  ③ 木星 hold-out(第VI節F)は事前登録して走らせた q=12.30 のまま据え置き、
  12.0586 で同じ JW2 窓が記録桁のまま満たされることを機械確認した旨を注記。
  ④ 第V節Bに、規約差が末尾桁を超えて効く**唯一の量**(💿 随伴比 — q に指数で効く)を
  明記(表面 h=0.5 で q\* なら ×45・q_exact なら ×114、×1 の交差が宣言参照軌道
  a=105〔h=44.7〕にちょうど乗る)。本文が引く実測列は q\* のまま。
  ⑤ 代償2・否定的主張4を同じ区別へ揃え、表 `tab:finrad` のキャプションから
  「採用しない」を外し、`exp-qexact.mjs` をハーネス表・検証対応表へ追加
  (値の CI ゲートは張らない — `manifest.coverage` が結果ファイルの整合を見る)。
  **図・図データ・回帰ゲートは1つも変更していない**(p3fig1〜4 と
  `figures/p3figs-gates.json` の28件は同じコミット済み結果ファイルを読むので不変
  — 第173便に再生成して28件 PASS・揮発キー以外は再生成前と一致することを確認済み)。
  計測正本: tests/exp-obscal.mjs・exp-kf1.mjs・exp-kf1b.mjs・
  exp-kf1c.mjs・exp-kf1d.mjs・exp-qlockradial.mjs・exp-jupiter.mjs・
  **exp-jup365.mjs**(第162便)・**exp-qexact.mjs**(第164便 — 規約の頑健性) /
  docs/PHYSICS.md §5。
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

---

# `paper/data/` — 論文が引く観測入力の恒久保存(第161便 P0-1 で新設)

論文が比較対象として引く観測値のうち、**転記元がリダイレクトしうるウェブ資料**の
ものを、機械可読な転記記録としてリポジトリ内に保存する場所。出典そのものではなく
**転記の記録**である(値は必ずハーネスの宣言値と1桁も違わないこと)。

| ファイル | 内容 | sha256(先頭12桁) |
|---|---|---|
| `jovian-satellites.csv` | 木星 hold-out(論文3 第VI節F)の観測入力36行。木星の質量・半径・自転周期、ガリレオ衛星4個の軌道長半径・離心率・質量・半径・同期自転・恒星公転周期、2次元理想化が捨てる軌道傾斜、および JUP365 比較周期4件 | `81bcb3807281` |

- 列: `body, quantity, value, unit, source, retrieved, note`(純 CSV — コメント行なし)。
- `unit` は**ハーネスの宣言単位**(`1e7 m` / `1e26 kg` / `rad/(1e3 s)` / `d` / `deg` / `1`)。
  SI 換算は `note` に併記する。
- `source` は論文3の bibitem キー(`NASAFact` / `NASASats`)。導出値は `derived`
  (同期自転など — 観測値ではないことを `note` で明示)。
- JUP365 の4行は `JUP365-secondary`。**原表未検証の二次転写**であり、
  取得日 2026-08-22・TODO(ref-verify)・「原表と食い違えば行を破棄して再実測する
  (値の書き換えはしない)」旨・JPL が mean elements を精密暦計算向けとしていない旨を
  `note` に明記してある。
- 本文からの参照は sha256 の先頭12桁付きで行う(論文3 第VI節F とデータ可用性の節)。
  **ファイルを1バイトでも変更したら sha256 を再計算し、英日の本文・コメントの12桁を
  必ず同時に更新すること**(本文2箇所+コメント2箇所 × 英日 = 計8箇所)。

```sh
sha256sum paper/data/jovian-satellites.csv   # 本文の12桁と先頭一致すること
```

---

# 頁数(ローカルビルド実測)

論文1〜論文4(en/ja の8ファイル)を 2026-08-22(**第173便**)にこのリポジトリ内で
まとめてビルドした実測値。arXiv の Comments 欄・投稿フォームの頁数はここを正とする。
括弧内は直前の実測値(論文1・2 は第167便、論文3 は第161便)。**論文4(v0.3・
2026-08-16 第122便以降 内容不変)は本表に第173便で初収載**し、括弧内は 2026-08-21 の
ローカルビルド実測を指す。

| 原稿 | 版 | エンジン | 頁数 |
|---|---|---|---|
| `dfm-paper.tex` | v0.12(記録版 v0.9) | pdflatex ×2 | 18(前 18) |
| `dfm-paper-ja.tex` | v1.3-ja | lualatex ×2 | 21(前 21) |
| `dfm-paper2.tex` | v0.11 | pdflatex ×2 | 11(前 11) |
| `dfm-paper2-ja.tex` | v0.11-ja | lualatex ×2 | 12(前 12) |
| `dfm-paper3.tex` | **v1.3** | pdflatex ×2 | **22(前 21)** |
| `dfm-paper3-ja.tex` | **v1.3-ja** | lualatex ×2 | **29(前 27)** |
| `dfm-paper4.tex` | v0.3 | pdflatex ×2 | 5(前 5) |
| `dfm-paper4-ja.tex` | v0.3-ja | lualatex ×2 | 4(前 4) |

**overfull 差分(第173便)**: 論文1・2・4 の6ファイルは頁数・overfull 件数・内容とも
直前の実測と**同一**である(`dfm-paper` 1件〔4.60pt〕/ `dfm-paper-ja` 5件〔5.94/3.25/
4.00/2.04/0.85pt〕/ `dfm-paper2` 0件 / `dfm-paper2-ja` 0件 / `dfm-paper4` 1件
〔27.90pt〕/ `dfm-paper4-ja` 1件〔37.32pt〕— 論文4 の2件は既存で不変。論文4 は
CI 対象外の手動ビルド)。**論文3 で新規の overfull は0件**: 英語版は第161便と同じ
1件(2.55pt・同一箇所)、日本語版は0件のまま。増頁(en 21→22・ja 27→29)は
第173便で追記した q_exact 規約採用の記述(第VI節Cの改訂段落・表 `tab:qlock` 後の注記・
第V節Bの随伴比の段落・第VI節Fの注記・ハーネス表と検証対応表の各1行)によるもので、
削除した文はない。8ファイルとも **エラー0・未定義参照0・未定義引用0**、
静的検査で 未定義 `\ref` 0・未定義 `\cite` 0・未引用 bibitem 0・重複 label 0
(英日ともラベル73・参照182・bibitem 17 で一致)。

**overfull 差分(第167便)**: 論文1・2 の4ファイルとも overfull 件数・内容は第161便と
**同数・同内容**である(`dfm-paper` 1件〔4.60pt〕/ `dfm-paper-ja` 5件〔5.94/3.25/4.00/
2.04/0.85pt〕/ `dfm-paper2` 0件 / `dfm-paper2-ja` 0件)。改題は表題ブロックの行数を
変えていない(論文1英語版は主題1行+副題を `\normalsize` で3行・日本語版は主題2行→1行と
副題2行→3行の入れ替え)。論文2 の増頁(en 10→11・ja 11→12)は新設した感度分析の
小節(小表+段落)によるもので、日本語版では要旨に足した1文が第4頁を 14.2pt 溢れさせたため
同文を1行短く言い換えて解消した(内容は英語版と等価)。論文3 の2ファイルは本便で触れて
いない(下の第161便の記録がそのまま有効)。

**overfull 差分(第161便)**: 6ファイルとも overfull 件数は第156便と**同数・同内容**である(`dfm-paper` 1件 / `dfm-paper2` 0件 / `dfm-paper3` 1件 /
`dfm-paper-ja` 5件 / `dfm-paper2-ja` 0件 / `dfm-paper3-ja` 0件)。第161便で新規に
出た2件は同便中に解消済み: ①論文3英語版で `\date` に4つめの "revised ..." 節を
足すと表題ブロックが 7.9pt 溢れたため、改訂日を1行にまとめた ②論文1日本語版で
要旨に2点を足すと `\twocolumn[...]` が1頁に収まらず Overfull \vbox が3件
(32.8pt ×2・16.0pt)出たため、表題ブロックの英語併記を `\small` へ・空きを
12pt→8pt / 10pt→6pt へ・要旨枠を 0.92→0.95`\textwidth` へ詰めた(文言・数値は不変。
日本語版の要旨追記は英語版より簡潔な言い回しにしてあり、内容は等価)。

**注記**: ローカル TeX Live での実測であり、CI(`paper1.yml` / `paper2.yml` /
`paper3.yml` が入れる TeX Live)とは **±1頁の差がありうる**(パッケージ版差による
行分割の違い)。エラー0・未定義参照0・overfull > 10pt が0件であることは
ローカル・CI の双方で確認する。**この overfull > 10pt の条件は投稿対象の論文1〜3に
かかるもの**で、CI 対象外の論文4(v0.3 ドラフト)は既存の2件(27.90pt / 37.32pt)を
そのまま抱えている(第173便で本表に初収載した時点の実測。解消は論文4の稿を進める便で
扱う)。

# 論文執筆指示書: Determinacy-Field Mechanics 論文(v1 プレプリント)

作成: Claude Fable 5(設計 Tier)/ 2026-07-15
実行担当: **Claude Sonnet 5**(`claude-sonnet-5`、2026-08-31まで導入価格 $2/$10 per MTok。
挙動固定が必要なら `claude-sonnet-4-6` $3/$15 でも可)
品質ゲート担当: **Claude Opus 4.8**(`claude-opus-4-8`)— §12 のレビュー指示を使用
本指示書の読者(=執筆モデル)は、**本書・THEORY_SYNTHESIS.md・docs/PHYSICS.md の3点のみ**を
入力とし、質問ゼロで完走すること。判断に迷う記述があれば §11 のエッジケース表に従う。

---

## 1. 目的(1段落)

GitHubSeaOtter/HypotheticalPhysics で体系化された「仮定の物理法則」(決定力場モデル、DFM)を、
arXiv 投稿可能な英語プレプリント論文に仕上げる。読者は物理の大学院生〜研究者。
本論文は実宇宙の新理論の提案では**なく**、「反実仮想の公理系を数値実装し帰結を調べる
理論実験」の報告である。この一点が全文のトーンを決める(§8 ヘッジ規則)。

## 2. 成果物(ファイル契約)

| パス | 内容 | 形式 |
|------|------|------|
| `paper/main.tex` | 論文本体 | REVTeX 4.2, `\documentclass[aps,prd,twocolumn,nofootinbib]{revtex4-2}` |
| `paper/refs.bib` | 文献 | BibTeX。§9 の16件+検証ログをコメントで併記 |
| `paper/abstract_ja.md` | 日本語要旨 | 600字以内、§4 の英文アブストの忠実訳 |
| `figures/fig1_lensing.png` 〜 `fig6_saturn.png` | 図6点 | §7 の仕様。未取得なら `\missingfigure` 代替(§11) |

変更してよいファイル: 上記4系統のみ。**変更禁止**: `docs/PHYSICS.md`、`index.html`、
`THEORY_SYNTHESIS.md`(矛盾を見つけた場合は修正せず TODO コメントで報告 — §11)。

## 3. 論文仕様(確定値)

- 言語: 英語(米語綴り)。分量: 組版後 **8〜14ページ**(図込み)。
- 投稿先想定: arXiv `physics.class-ph`(cross-list: `physics.ed-ph`)。
- 時制: 公理・式は現在形、数値実験の実施は過去形。一人称は "we"。
- 数式: 理想形(ε→0)で提示し、数値正則化(ソフトニング、クランプ、E9法線ばね)は
  Sec. V 冒頭の "Numerical scheme" 小節と脚注にまとめる(THEORY_SYNTHESIS §7 L5 の方針)。

## 4. タイトル・アブストラクト(確定文 — 一字一句このまま使う)

**Title:**
```
Determinacy-Field Mechanics: A Machian Toy Universe with Tunable Frame Dragging,
Emergent Inverse-Square Gravity, and Spin-as-Heat Thermodynamics
```

**Abstract(確定・正例):**
```
We formulate and numerically implement a relational toy model of mechanics in which
spatial coordinates have no independent existence but are fixed by the masses themselves.
A single scalar field W, the "determinacy" (mass over distance, plus a uniform background
D0 representing distant large-scale structure), simultaneously provides (i) the weighting
of the local inertial frame, (ii) a gravitational potential whose gradient automatically
reproduces the inverse-square law, (iii) the local rate of proper time, and (iv) an
effective refractive index for light. A signed spin degree of freedom, identified with
heat, couples to the frame field and yields contact friction, spin diffusion, and a
centrifugal repulsion that plays the role of pressure. The model interpolates continuously
between Newtonian absolute space (D0 -> infinity) and a fully relational Machian space
(D0 -> 0), and reduces exactly to Newtonian N-body dynamics when the frame-dragging
coupling is switched off. In two-dimensional simulations we observe disc formation and
spin alignment, thermal equilibration, light bending consistent with the weak-field
correspondence K_t = c^2/G and k_L = 2G/c^2, and, when frame dragging is amplified to
order unity, flat galactic rotation curves. We emphasize that the model is a
counterfactual laboratory: it demonstrates mechanism sufficiency within its own axioms
and makes no claim about the actual universe. A single-file, dependency-free simulator
accompanies the paper.
```

**日本語要旨**: 上記の忠実訳を `abstract_ja.md` に作成(600字以内。「反実仮想の実験場であり
実宇宙の主張ではない」の一文を必ず含める)。

## 5. セクション構成表(節・分量・含める内容を確定)

| 節 | 見出し | 分量 | 必須内容(出典) |
|----|--------|------|------------------|
| I | Introduction | 1.2p | ニュートンのバケツ→マッハ→Sciama の3段導入。Contributions C1〜C6 を箇条書き(THEORY_SYNTHESIS §3 を英訳)。Negative claims の第1文(§8 正例2)をイントロ末尾に置く |
| II | Axioms | 1.5p | A1〜A10 を番号付き公理として英訳(PHYSICS.md §2)。記号表(§6)を Table I として掲載 |
| III | Dynamics | 1.5p | E1〜E10 を式(1)〜(10)として掲載(§6.2 の写像表どおり)。理想形で書き、E6/E9 の離散規則は "update rule" と明示 |
| IV | Correspondence limits | 1.0p | THEORY_SYNTHESIS §4 の内容: k_F→0 でニュートン退化、D₀ の二重極限、弱場GR写像表(Table II)、K_t と k_L の独立性という構造的相違、偏向因子2は校正である旨の脚注 |
| V | Numerical experiments | 2.5p | 6プリセット=6実験(PHYSICS.md §6 の表を Table III に)。数値スキーム小節(セミ・インプリシットオイラー、O(N²)、N≤600、安定化措置4点)。図1〜6(§7)を順に参照し、各1段落で結果記述 |
| VI | Discussion | 1.5p | 先行研究マップ(THEORY_SYNTHESIS §5、特に回転曲線の Cooperstock–Tieu/Ludwig 論争と批判の両論併記)。Negative claims 4点(§8)。限界 L1〜L8(THEORY_SYNTHESIS §7)を段落2つに圧縮 |
| VII | Conclusion & Reproducibility | 0.5p | 貢献の再掲1段落+再現性宣言: リポジトリURL・**コミットハッシュ**・「単一HTML・依存ゼロ・全パラメータUI編集可」 |

## 6. 記法契約

### 6.1 記号表(Table I としてそのまま掲載)
m_i, **r**_i, **v**_i(質量・位置・速度)/ s_i(符号付きスピン)/ R_i = r_R√m_i /
I_i = ½m_iR_i² / d_j = |**r**−**r**_j| / w_j = m_j/d_j(理想形)/ D = Σw_j /
W = D₀ + D / **u**(**r**)(局所フレーム速度)/ G / k_F(=kFrame)/ q / k_rep /
μ_f / γ_n / κ_s / K_t / ψ(=W_ext/K_t。v1.7: k_L は廃止され n_eff=e^{2ψ})/ τ(固有時)。
シミュレータ変数名(kFrame 等)は本文に出さず、付録の既定パラメータ表(PHYSICS.md §5 末尾の
表を Table IV として転載)でのみ対応させる。

### 6.2 式番号の写像(この対応で採番する)
E1→(1), E2→(2), E3→(3), E4→(4), E5→(5), E6→(6), E7→(7), E8→(8a,8b), E9→(9a–9c), E10→(10)。
E9 は法線ばね(9a)・法線減衰(9b)・接線摩擦(9c)に分割。数式は PHYSICS.md §5 を
LaTeX に忠実に転写し、**物理内容の変更・簡略化は禁止**。

## 7. 図表契約(6点。全てシミュレータの現行機能のみで取得可能)

共通: iPhone Safari のスクリーンショット、幅1170px以上、UI操作パネルはトリミング、PNG。
取得者はユーザー(人間)。執筆モデルは `\includegraphics` とキャプション(下記確定文の英訳)を
先に書き、画像未着なら §11 のプレースホルダ規則に従う。

| 図 | プリセット | 手順(確定) | キャプション骨子(英訳して使用) |
|----|-----------|--------------|--------------------------------|
| Fig.1 | lensing | 既定パラメータで実行、光線湾曲と決定力マップが見える時点で撮影 | 決定力場 W と光線経路。n=1+k_L W による質量側への湾曲(式8) |
| Fig.2 | galaxy | ①k_F=1 で実行し内蔵回転曲線グラフを撮影 ②「初めから」→k_F=0 で同時刻まで実行し撮影。2パネル構成 | 回転曲線: k_F=1(平坦)vs k_F=0(ケプラー減衰)。同一初期条件の対照実験 |
| Fig.3 | mach | D₀ ∈ {0, 0.5, 2, 8} の4条件で、リング内側のプローブ粒子の回転周期を目視計測(速度倍率×1、シミュレータ内時間で一定区間、各条件3回測って平均)。結果を表→執筆モデルが pgfplots で棒グラフ化 | 内部フレームの引きずり率 vs D₀。D₀→0 でリングと共回転(マッハ)、D₀大で静止(絶対空間) |
| Fig.4 | protodisk | 初期(乱雲)・中間・終盤(円盤)の3時点スナップショット、3パネル | 雲→軌道円形化と回転方向整列(2D)(T3)。接触摩擦による非整列運動の選択的散逸 |
| Fig.5 | gas | 実行直後(二峰)と平衡後(一峰)の温度ヒストグラムを撮影、2パネル | スピン拡散による温度平衡化(T6、第0法則類似) |
| Fig.6 | saturn | 環が円形化した時点のスナップショット1枚 | ケプラー運動+衝突円形化+中心スピン引きずり(A6/A8/E9) |

Fig.3 の計測値が未提供の場合: 図は `\missingfigure` とし、本文には
"quantitative D0-scan deferred to the dataset accompanying a future revision" と1文で書く。
**架空の計測値をでっち上げることを固く禁じる。**

## 8. ヘッジ規則(表現の許可/禁止 — 全文に適用)

**禁止表現(grep でゼロ件であること)**: `we prove` / `proves that` /
`dark matter is unnecessary` / `no need for dark matter` / `explains the rotation curves
of real galaxies` / `new theory of gravity` / `overturns`。

**必須ヘッジ**: 「dark matter」「rotation curve」「real universe/galaxies」に言及する
全ての文は、同一文または直後の文に `within the model` / `in this toy universe` /
`we make no claim about` のいずれかを伴うこと。

**正例1(結果の書き方)**:
"With k_F = 1 the rotation curve flattens, whereas the k_F = 0 control reproduces the
Keplerian decline; within the model, amplified frame dragging is therefore sufficient
to flatten rotation curves."
**正例2(イントロ末尾に置く一文・確定)**:
"We stress at the outset that DFM is a counterfactual laboratory, not a proposal about
nature: real-universe frame dragging is suppressed by v/c^2, and the observational case
for dark matter rests on evidence independent of rotation curves."
**負例(こう書いたら不合格)**:
"Our model proves that galactic rotation curves can be explained without dark matter,
suggesting that dark matter may not exist."(過剰主張・ヘッジ欠落・prove 使用)

## 9. 引用リスト(確定16件+検証手順)

以下を refs.bib に収録する。**各件につき Web 検索で DOI または arXiv ID を確認し、
確認できた識別子を bib エントリに記載、確認結果を `% verified: <URL> <日付>` コメントで残す。**
確認できない文献は**削除**し、本文の当該引用箇所に `% TODO: citation unverified` を残す。
リスト外の文献追加は「回転曲線重力磁気説への査読付き反論」(#11)の1件のみ許可。

1. I. Newton, *Philosophiæ Naturalis Principia Mathematica* (1687) — Scholium(バケツ)
2. E. Mach, *Die Mechanik in ihrer Entwickelung* (1883) / 英訳 *The Science of Mechanics*
3. J. Lense & H. Thirring, Phys. Z. **19**, 156 (1918)
4. D. W. Sciama, "On the Origin of Inertia," MNRAS **113**, 34 (1953)
5. J. B. Barbour & B. Bertotti, Proc. R. Soc. Lond. A **382**, 295 (1982)
6. V. C. Rubin & W. K. Ford, Jr., ApJ **159**, 379 (1970)
7. M. Milgrom, ApJ **270**, 365 (1983)
8. C. W. F. Everitt *et al.*, Phys. Rev. Lett. **106**, 221101 (2011)
9. I. Ciufolini & E. C. Pavlis, Nature **431**, 958 (2004)
10. F. I. Cooperstock & S. Tieu, arXiv:astro-ph/0507619 (2005)
11. (執筆時に検索して補充)Cooperstock–Tieu または Ludwig への査読付き批判 1件
12. G. O. Ludwig, Eur. Phys. J. C **81**, 186 (2021)
13. E. Verlinde, SciPost Phys. **2**, 016 (2017)
14. F. de Felice, Gen. Relativ. Gravit. **2**, 347 (1971)
15. N. V. Brilliantov & T. Pöschel, *Kinetic Theory of Granular Gases* (Oxford UP, 2004)
16. Planck Collaboration, A&A **641**, A6 (2020)

## 10. 執筆手順(この順で)

1. `refs.bib` を作成し全件検証(§9)。完了条件: verified コメント16件(または削除+TODO)。
2. `main.tex` の骨格(節見出し・Table I〜IV・式(1)〜(10)の枠)を作る。完了条件: `latexmk -pdf` が通る。
3. Sec. II〜V を PHYSICS.md / THEORY_SYNTHESIS.md から翻訳・転写で埋める(新規の物理的主張の追加禁止)。
4. Sec. I, VI, VII を書く(§5 の必須内容、§8 のヘッジ規則)。
5. 図キャプション6本と `\includegraphics`(または `\missingfigure`)。
6. `abstract_ja.md` 作成。
7. §13 受け入れ条件を自己チェックし、結果を `paper/SELFCHECK.md` に記録して終了。

## 11. エッジケース表

| 状況 | 対応(確定) |
|------|--------------|
| PHYSICS.md と THEORY_SYNTHESIS.md が矛盾 | THEORY_SYNTHESIS.md を優先し、`% TODO: source conflict` を main.tex に残す |
| 引用の書誌が確認できない | §9 の削除+TODO 規則 |
| 図の画像が未提供 | `\usepackage{todonotes}` の `\missingfigure{<図名>}` を置き、キャプションは書く |
| 数式が2カラム幅を超える | `\begin{widetext}` で1カラム化(式の分割・省略は禁止) |
| ページ数が14を超えた | Sec. VI の先行研究記述から削る(公理・式・図は削らない) |
| ページ数が8未満 | Sec. V の各実験記述を1段落→2段落に増補(新主張は追加しない) |
| リポジトリのコミットハッシュが不明 | `\texttt{<commit>}` プレースホルダ+TODO |

## 12. レビュー指示(Opus 4.8 用 — テンプレート3準拠)

入力: 本指示書、THEORY_SYNTHESIS.md、PHYSICS.md、paper/ 一式。検査項目(優先順):
1. §13 受け入れ条件との差分を全て列挙(合格項目も明記)
2. §8 禁止表現の grep 結果と、ヘッジ必須語の全出現箇所の合否
3. 式(1)〜(10)が PHYSICS.md E1〜E10 と数学的に同一か(項ごとに照合)
4. Table II(弱場対応)の係数が THEORY_SYNTHESIS §4.2 と一致するか
5. refs.bib の verified コメントの実在性(1件抜き取りで URL を開く)
出力形式: 判定 PASS/FAIL。FAIL 項目ごとに、場所・問題・**本指示書への追記案**の形で修正指示を書く。

## 13. 受け入れ条件(全て検証可能)

- [ ] `latexmk -pdf paper/main.tex` が exit 0、PDF 8〜14ページ
- [ ] タイトルとアブストが §4 の確定文と完全一致
- [ ] 式(1)〜(10)が全て存在し、§6.2 の採番どおり
- [ ] Table I〜IV が存在
- [ ] §8 禁止表現の grep が 0 件/ヘッジ必須語の規則を全出現箇所で満たす
- [ ] refs.bib 全エントリに verified コメントまたは本文 TODO
- [ ] 図6点が `\includegraphics` または `\missingfigure` で参照されている
- [ ] Sec. VII にリポジトリ URL とコミットハッシュ(または TODO)
- [ ] `abstract_ja.md` が600字以内で存在
- [ ] `paper/SELFCHECK.md` に本チェックリストの自己評価が記録されている

## 14. 禁止事項

- 新しい物理的主張・公理・式・帰結の発明(体系化フェーズの領分)
- 計測値・数値結果の捏造(未取得は §11 の手順で明示)
- 文献の捏造・書誌の推測記入(検証できなければ削除)
- `docs/PHYSICS.md`・`index.html`・`THEORY_SYNTHESIS.md` の変更
- タイトル・アブスト・ヘッジ規則文言の改変

---

## 付録A: 外部AI対話(ChatGPT / Grok / Gemini)の後日統合手順

対象リンク3件(2026-07-15時点で機械取得不能)の本文が入手できたら:
1. ユーザーが対話本文をテキストで貼り付ける(または .md でリポジトリに置く)。
2. 上位モデル(Opus 4.8 以上)が内容を (a)矛盾指摘 (b)新帰結 (c)表現 の3分類に仕分け、
   THEORY_SYNTHESIS.md の §7 / §3 / EXPLAINER に追記する改訂案を作る。
3. 改訂が論文本文に波及する場合、本指示書 §5 の該当節に差分指示を追記してから
   Sonnet に再実行させる(口頭修正ではなく指示書改訂で回す — スキル原則)。

---

# 改訂1(2026-07-15、設計Tier発行)— 公理改訂と解析的帰結の組み込み

付録Aの手順が発動された(外部AI 3件のPDF提供+原仮定者の公理改訂2点)。
以下の差分は本文の該当箇所を**上書き**する。矛盾時は本改訂1が優先。

## R1-1. 入力の追加と優先順位
入力は4点になる: **DERIVATIONS.md(最優先)** > THEORY_SYNTHESIS.md(v1.1) >
本指示書 > docs/PHYSICS.md。式の正本は DERIVATIONS.md §0〜§1(E5′/E6′/E8′/E10′、
A11/A12/A13、温度定義 T = I s²/k_B)。旧 E5/E6/E10 は脚注で言及するのみ。

## R1-2. セクション構成の変更(§5 の表を置換)
新 Sec. V **"Analytical consequences"**(1.5〜2.0p)を挿入し、以下を含める:
V-A 保存則(T7、DERIVATIONS §1)/ V-B ウィーン型スピン–波長関係(§2)/
V-C 回転則・r_flat ≈ M_d/D₀・形態分類の3無次元数(§3)/
V-D 環の安定窓と DFM ロッシュ条件(§4)/ V-E LT類似歳差と軌道移動(§5a,b。
**v1.8 注意**: §5a は符号・半径冪が訂正済み — 順行で「後退」= GR の LT と同符号。
執筆時は訂正版を正とし、Sec. IV の現実較正数値は DERIVATIONS §12.2 から転記する)。
旧 V(数値実験)→ VI、旧 VI(Discussion)→ VII、旧 VII → VIII。ページ上限を **10〜16** に変更。
Discussion の限界リストは L1・L5〜L11(L2/L3/L4 は解消済みとして脚注移動)。

## R1-3. 式番号の追加
(11) T=Is²/k_B と s(λ) 式 / (12) 回転則 v_φ=½[k_F u_φ+√(k_F²u_φ²+4rg_eff)] /
(13) u_φ 自己無撞着積分と r_flat / (14) Q_DFM・λ_DFM・h の定義 /
(15) DFM ロッシュ(𝒟 数つき) / (16) Δϖ 歳差式 / (17) 共回転半径と dr/dt。
式(5)(6)(8)(10) は DERIVATIONS §1 の改訂版(プライム形)を正とする。

## R1-4. アブストラクトの改訂(確定)
§4 の確定アブスト中、"A single-file, dependency-free simulator..." の直前に次の2文を挿入
した版を新たな確定文とする(一字一句):
```
A reciprocity axiom renders the drag pairwise action–reaction symmetric, so that linear
and total (orbital plus spin) angular momentum are exactly conserved, with exchange
against the uniform background treated as transfer to an infinite-inertia reservoir.
Within the axioms we further derive a Wien-type spin–wavelength relation, a finite
flat-rotation radius r_flat ~ M/D0, a morphological classification of disc and
spheroidal systems, a drag-modified Roche criterion for stable rings, and
Lense–Thirring-like periapsis precession and spin–orbit evolution.
```

## R1-5. 図の追加(任意、Fig.7)
lensing プリセットで中心スピン +S_c と −S_c の2条件、平行光線束のスクリーンショット
2パネル。キャプション骨子: 「スピンによる左右非対称湾曲(T8)。差は k_F u_φ に比例」。
未取得時は §11 の \missingfigure 規則。

## R1-6. 引用の追加(検証規則は §9 と同一)
17. W. Wien, Ann. Phys. **294**, 662 (1896)(ウィーン変位則の原典。書誌は要検証)
18. P. J. Hoogerbrugge & J. M. V. A. Koelman, Europhys. Lett. **19**, 155 (1992)
    (DPD — 対ごとの保存散逸力学の先行例。E6′ の位置づけに引用)

## R1-7. ヘッジ規則の追加
実在天体名(Saturn, Mercury, the Moon, Phobos 等)への言及にも、同一文または直後の文に
within-the-model 系ヘッジを必須とする。禁止表現に "explains Saturn's rings" /
"explains Mercury's precession"(ヘッジなし単独使用)を追加。

## R1-8. 受け入れ条件の追加
- [ ] 式(11)〜(17)が存在し R1-3 の採番どおり
- [ ] T7 の保存則定理文と、D₀>0 時のリザーバ帳簿の説明が Sec. V-A にある
- [ ] DERIVATIONS §6 の検証表 V1〜V8 が Table V として掲載
- [ ] 改訂アブスト(R1-4)と完全一致
- [ ] A12 が「設計者補完」である旨が Sec. II の脚注にある

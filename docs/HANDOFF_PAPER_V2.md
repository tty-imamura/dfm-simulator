# HANDOFF_PAPER_V2: 論文ドラフト執筆の実行指示書(自己完結版)

作成: 2026-07-16(第5次レビュー裁定 #4 — DERIVATIONS §14)
改訂: 2026-07-20(**原仮定者承認 — ロードマップ決断事項 4-17・4-19**。§2 のタイトルを
4-19 承認どおり改訂(Emergent 削除・Thermodynamics→Analogies)。禁止事項 6/7 を
BOX_UNIVERSE §5.5 の合意条件・THEORY_SYNTHESIS v1.7 §6-5 と整合化し、
測地線オプション E12 の記述条件を明文化。paper v0.4 §IV D が実装例。
なお §1 の版番号は作成時点のスナップショット — 矛盾時は常に最新正本が優先)
旧 HANDOFF_PAPER.md は**廃止**(追補の積層により v1.9 以降を安全に生成できない)。
論文執筆フェーズの担当モデルは**本書だけを起点**とし、旧版を参照しないこと。

## 0. 目的(1段落)

決定力場モデル(Determinacy-Field Mechanics: DFM)の**教育用トイモデル論文**
(software / computational toy model paper)の英文初稿を作成する。読者は物理教育・
基礎論の研究者。売りは「単一スカラー場 W+スピン自由度 s の最小公理系が、慣性・重力・
フレーム引きずり・時間遅れ・光の湾曲・熱力学類似を1つの動く実装(単一HTML)で統一的に
模倣し、全主張が機械検証されている」こと。**実宇宙の代替理論とは主張しない**(方針A確定 —
DERIVATIONS §14.3)。

## 1. 入力正本と優先順位(これ以外を参照しない)

1. `docs/DERIVATIONS.md` — 数学的導出・全5次レビューの裁定(矛盾時の最終正本)
2. `docs/PHYSICS.md` v1.6 — 公理 A1〜A13・式 E1′〜E11・定理 T1〜T9・既定パラメータ
3. `docs/THEORY_SYNTHESIS.md` v1.6 — 論文の3層構造・C1〜C8・Negative claims・L1〜L17
4. `index.html` v1.10+ — 実装と検証フック(`HP.verify.all()` 11項目)・13サンプル
5. 本書 — 構成・選定・禁止事項

## 2. 書誌情報

- 著者: **Tetsuya Imamura**
- AI協働の開示(投稿誌の方針に従い Acknowledgments に記載):
  > Mathematical formalization, implementation, and verification were carried out
  > in collaboration with AI systems (Anthropic Claude); external AI reviews
  > (ChatGPT, Grok, Gemini) were used as adversarial checks. All axioms and
  > final decisions are the author's.
- タイトル(確定): *Determinacy-Field Mechanics: A Machian Toy Universe with
  Tunable Frame Dragging, Inverse-Square Gravity, and Spin-as-Heat
  Thermodynamics*
- 投稿先: 第1候補 *American Journal of Physics* / *European Journal of Physics*、
  第2候補 *Foundations of Physics* / *SciPost Physics Core*(DERIVATIONS §14 裁定 #15)
- ライセンス: コード MIT・文書 CC BY 4.0(LICENSE / docs/LICENSE)

## 3. セクション構成と各節の必須内容

| 節 | 内容 | ソース |
|---|---|---|
| I. Introduction | ニュートンのバケツ→マッハ原理→「もし引きずりが O(1) だったら」という反実仮想。貢献 C1〜C8(THEORY_SYNTHESIS §3 の v1.6 現行版を転記 — 特に C8 は改稿版のみ)。Negative claims の要約を**導入部にも**置く | TS §1〜§3, §6 |
| II. Axioms | A1〜A13(A7′/A12′ 改訂形)。存在論(粒子・W・s)と D₀ の意味。A13 相互性が保存則を担保 | PHYSICS §2 |
| III. Dynamics | E1′〜E11(E5′/E6′/E10′ の保存形)。単一ポテンシャル ψ=W_ext/K_t(E7R/E8R)。Plummer 正則化 ε は数値手法であり理論の一部でない | PHYSICS §5, DERIVATIONS §9/§11 |
| IV. Correspondence | 4.1 ニュートン退化(k_F=0)。4.2 弱場GR写像 — **K_t=c²/G の1本**で GPS 時計 +38.5μs/日・太陽縁偏向 1.7512″・シャピロ遅延が定量一致(現実較正表)。時間遅れ:偏向=1:2 は構成から出る(k_L は独立係数でなく弱場有効係数 2/K_t としてのみ言及可)。4.3 相違点 — 優先フレーム・瞬時遠隔作用・水星 1PN 非再現(E6′ は LT 同符号の後退のみ、半径冪も異なる) | TS §4, DERIVATIONS §12 |
| V. Numerical Experiments | §5 の6実験(下表)。各実験は「条件付き帰結」であることを明示(T3/T4/T6 は初期条件・パラメータ依存 — 普遍的定理と書かない) | 下記 §4 |
| VI. Limitations & Negative Claims | Negative claims 1〜6 を独立subsectionで転記(TS §6)。未解決 L1(作用原理)・L8(因果性)・L12(物質側ローレンツ応答)・L14(D₀ 規模)・L15〜L17(熱力学)を要約 | TS §6〜§7 |
| VII. Conclusion & Future Work | v2.0 展望: E7R 線素からの測地線化(静的弱場は PPN β=γ=1 を**示唆** — 検証仮説と明記)。D₀ の背景・摂動分解。定量熱力学プロファイル(q=3) | DERIVATIONS §14 裁定 #9〜#11 |

## 4. 論文用の数値実験(13サンプルから6件を選定済み — 変更禁止)

| # | 実験 | 図 | 数値の出典 |
|---|---|---|---|
| 1 | マッハのバケツ(D₀ スキャン: 絶対空間↔関係空間) | 引きずり角速度 vs D₀ | mach プリセット+手動スキャン |
| 2 | 銀河回転曲線の平坦化(k_F=0/1 の同一初期条件 A/B) | v(r) 実測 vs ケプラー | V11(時間平均 gain 0.055) |
| 3 | 近点の後退(E6′、スピン反転で前進) | Δϖ/周 vs スピン符号 | V6(−7.52°/+10.71°、対照 −1.03°) |
| 4 | 時計 — 重力+運動の合成と双子時計 | τ/t の解析値との一致 | V12/V13/V16(相対誤差 <1e-3) |
| 5 | 光 — 偏向・光子捕捉・非対称湾曲 | 光線束の軌跡(spin ±0.5) | V8(非対称度 ±6.77e-2 rad) |
| 6 | スピン=熱 — 温度平衡と圧力(単一粒径) | 左右平均温度の時系列/熱コア膨張 | gas / pressure プリセット(付録I) |

図はすべてシミュレーションから再生成可能であること(スクリーンショットは補助のみ)。
保存則(V1: |ΔP|,|ΔL| < 1e-3 相対)と第一法則(V10/V10b — **主張域は kRep=0 または
固定スピンに限定、L17 を併記**)は表として Sec. V 冒頭に置く。

## 5. 用語・記法規約

- 用語対訳は THEORY_SYNTHESIS §9 に従う(determinacy / background determinacy D₀ /
  frame dragging k_F / spin-as-heat / determinacy potential ψ)
- 位置づけの定型句: "a Machian toy model on a fixed Euclidean background that
  makes the inertial standard emergent from the matter distribution"
  (「完全な背景独立理論」と書かない — 裁定 #8)
- 光子捕捉は "an optical analogue of a photon sphere" — ブラックホール・事象の
  地平面の再現とは書かない

## 6. 禁止事項(逸脱したら差し戻し)

1. 旧近点式 Δϖ ∝ k_F S_c R_c²/√(GMr³) の使用(v1.8 で反証済み。正: −k_F S_c R_c²/√(GMa))
2. 廃止サンプル(protodisk / idealgas / starform / grinder / spectrum / radcool /
   accretion / collision)への言及
3. k_L / kLens を独立パラメータとして扱うこと(v1.7 で廃止)
4. 「第一法則の完全閉性」を主張域なしで書くこと
5. 「重力を仮定せず導出」(正: 場の距離則+勾配応答への分解)
6. 「理想気体を再現」「潜熱相転移」「Ra–Nu 則」「ダークマター不要」。
   水星近日点は**「基底力学 E1′〜E11 が説明する」と書くことを禁止**(Negative claim 5 は
   スコープ明示のうえ不変)。測地線オプション E12 による再現の記述は、
   BOX_UNIVERSE §5.5 の合意条件を満たす場合に限り可〔2026-07-20 改訂・4-17 承認〕:
   ①基底力学の不再現を必ず併記(同じ表・同じ節で対にする)
   ②β=γ=1・K_t=c²/G のまま追加自由係数なし・V18〜V20 の機械検証を明記
   ③主張域(静的・u=0・大質量源のみ・既定オフの明示ラベル付きオプション)を明記
   ④強場・重力波は引き続き非主張(L8/L12)
7. 公理・式・定理の個数を「10個・10本・6件」と書くこと(正: A1〜A13・E1′〜E11・T1〜T9。
   〔2026-07-20 追記〕E12 は v2.0 第1段階の明示ラベル付きオプションとして**別建て**で扱い、
   基底力学の個数に含めない —「E1′〜E12」と数えない)

## 7. 受け入れ条件

- [ ] 上記禁止事項 1〜7 が本文・図表・付録に0件(grep で機械確認)
- [ ] Negative claims 1〜6 が Introduction 要約+Sec. VI 全文の2箇所にある
- [ ] 現実較正(GPS/偏向/シャピロ=一致、水星 1PN=基底力学は不一致・E12 は再現
  〔2026-07-20 改訂〕)が**同じ表**にある
- [ ] すべての図に生成手段(プリセットID or Vフック名+パラメータ)が付記されている
- [ ] 著者表記・AI開示・ライセンスが §2 のとおり
- [ ] 英文はアメリカ式綴り、SI 復元は TS §4.3 の表を付録に転記

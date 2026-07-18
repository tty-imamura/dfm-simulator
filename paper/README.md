# paper/ — arXiv 向け第1論文(software / computational toy model paper)

- 初稿 v0.1(2026-07-17)。執筆指示書は `docs/HANDOFF_PAPER_V2.md`(唯一の正本。
  旧 HANDOFF_PAPER.md は参照禁止)。
- 入力正本: `docs/DERIVATIONS.md` / `docs/PHYSICS.md` v1.6 /
  `docs/THEORY_SYNTHESIS.md` v1.6 / `index.html` v1.15。
- 投稿先候補: American Journal of Physics / European Journal of Physics(第1)、
  Foundations of Physics / SciPost Physics Core(第2)。
  arXiv カテゴリ: physics.ed-ph(主)+ gr-qc(クロスリスト)。

## ビルド

```sh
pdflatex dfm-paper.tex && pdflatex dfm-paper.tex
```

RevTeX 4.2 が必要(TeX Live 標準同梱)。現行クラスオプションは `aps,reprint`
(ドラフト用)。AJP 投稿時は誌のテンプレート指定に合わせて差し替える。

## 図の再生成(v1.16 で機械生成済み — スクリーンショットは補助のみ)

```sh
node tools/gen-figures.mjs        # 全6図を figures/ に svg + pdf + json で生成
FIG=2,5 node tools/gen-figures.mjs  # 個別再生成
```

headless Chromium + HP フック駆動(依存は `npm install` の playwright のみ)。
各図の `.json` に生成パラメータ・実測値・コミットハッシュを記録し、
数値ゲート(`figures/figures-gates.json`)が文書値との一致を機械強制する。

| 図 | 生成手段 | 実測ゲート(2026-07-17) |
|---|---|---|
| Fig. 1 | preset `mach`(リング+プローブ8点)D₀∈{0.05..128}、E3 フレーム読み出し | 解析 w/(w+D₀) と差 0.0%・単調減少 |
| Fig. 2 | preset `galaxy` + abStart(kFrame,0)、6000步、幅20ビン | 外縁比 kF1/kF0 = 1.082 (>1.04) |
| Fig. 3 | V6 構成3ラン + preset `drag` 168000步ロゼット | −7.52° / +10.71° / 対照 −1.03° |
| Fig. 4 | V12/V13/V16 同構成(各1000步) | 最大相対誤差 9.1e-5 (<1e-3) |
| Fig. 5 | preset `lensing`(26本ファン)+ V8 構成(spin±0.5, Kt=500) | 非対称度 ∓6.77e-2 rad(符号反転) |
| Fig. 6 | preset `gas` / `pressure`(各16000步) | コア半径 34.5→140.9(×4.09)・温度ギャップ 4.34→0.48 |

## 投稿前 TODO

- [x] 図6枚の実生成(v1.16: tools/gen-figures.mjs で機械生成・tex 差し替え済み)
- [x] 書誌の全件検証(2026-07-18: 外部AI 3系統のクロス検証で全16件確認。
      Iorio の水星 LT 歳差の出典を IorioMercury2011(arXiv:1109.0266)+
      IorioEtAl2011(Astrophys. Space Sci. 331, 351)に差し替え、
      Cooperstock–Tieu / Ludwig への批判文献3件(FuchsPhleps2006 /
      Korzynski2007 / LasenbyHobsonBarker2023)を追加、全誌 DOI・Planck
      Erratum・Mach 英訳の訳者/副題・Lense–Thirring 原題綴りを補完)
- [ ] 著者所属行の確定(tex 内 `TODO(author)`)
- [ ] リポジトリ URL / Zenodo DOI の挿入(tex 内 `TODO(submission)`)
- [ ] 第5次AI模擬査読(AJP 査読者ペルソナ×3observers: 飛躍/先行研究/Negative
      claims 逸脱)→ DERIVATIONS へ裁定統合
- [ ] 日本語要旨(国内発表用・必要なら)

## 受け入れ条件(HANDOFF_PAPER_V2 §7)と検査

`tests/paper-qa.sh`(なければ下記 grep)で機械確認する:

1. 禁止事項7項目が0件(旧近点式 √(GMr³)・廃止サンプル名・独立レンズ係数・
   無限定の「完全閉性」・「重力を仮定せず導出」・過剰主張6種・旧個数)
2. Negative claims 1〜6 が Introduction 要約+Sec. VI 全文の2箇所
3. 現実較正(GPS/偏向/シャピロ=一致、水星=不一致)が同一表(Table I)
4. 全図キャプションに生成手段(プリセットID or Vフック+パラメータ)
5. 著者・AI開示・ライセンスが HANDOFF_PAPER_V2 §2 のとおり
6. アメリカ式綴り、SI 復元表が付録(Appendix A)

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

## 図の再生成(スクリーンショットは補助のみ)

全図はシミュレーション(`index.html` v1.15 の `HP.sim` / `HP.verify`)から
スクリプト再生成する。現稿はプレースホルダ枠+キャプションに生成手段を明記済み。

| 図 | 生成手段 | パラメータ |
|---|---|---|
| Fig. 1 | preset `mach` + 手動 D₀ スキャン | D₀ ∈ {0.05, 0.5, 2, 8, 32} |
| Fig. 2 | preset `galaxy` A/B(kFrame=1/0)+ V11 | 中心 m600・disk n140・D₀0.5、外帯 [85,130]、步1000–2000 平均 |
| Fig. 3 | verify V6(+preset `drag` のトレイル) | a=60, e=0.5, S=±0.05, kF∈{0,1}, D₀=0.05 |
| Fig. 4 | verify V12 / V13 / V16(+preset `twin`) | V12: Kt=1e6, v/c₀∈{0,0.3,0.6}; V16: v=0.5c₀ |
| Fig. 5 | preset `lensing`(Kt=150、26本ファン)/ `spinlens` + verify V8(Kt=500) | x₀=−300, \|y₀\|≤255, dl=2.73 |
| Fig. 6 | preset `gas` / `pressure` + 温度オーバーレイ | 既定値 |

図生成スクリプトは Phase 1 の CI 基盤(`tests/qa.mjs` の JSON artifact)に
接続して実装する(headless Chromium + HP フック。ロードマップ参照)。

## 投稿前 TODO

- [ ] 図6枚の実生成(上表のとおり機械生成。プレースホルダ枠を差し替え)
- [ ] 書誌の全件検証(THEORY_SYNTHESIS §5 の指示。特に Iorio の水星 LT 歳差の
      出典を正しい論文に差し替える — tex 内 `TODO(submission)` 参照)
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

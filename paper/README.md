# paper/ — arXiv 向け第1論文(software / computational toy model paper)

- 現行稿 **v0.7**(2026-07-20 — 公開前整合スプリント)。改稿履歴は `dfm-paper.tex`
  冒頭コメントに記録(v0.1 初稿 → v0.2 第5次模擬査読 → v0.3 英文校閲 →
  v0.4 E12 節 → v0.5 第6次査読=論文・コード一致回復 → v0.6 タイトル変更(4-19)→
  v0.7 公開前整合)。
- 執筆指示書は `docs/HANDOFF_PAPER_V2.md`(唯一の正本。2026-07-20 改訂 —
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
- [ ] リポジトリ提出版タグ+Zenodo DOI の挿入(tex 内 `TODO(submission)`。
      手順はルート README「提出版タグとアーカイブ DOI の発行手順」)
- [ ] Table I/IV の標準資料引用(CODATA / IAU nominal values / GPS IS —
      一次資料照合の上で追加。第6次査読 Major 12)
- [ ] ローカル pdflatex 2パス+ページ数確定(arXiv Comments 欄用)
- [ ] 日本語要旨(国内発表用・必要なら)

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

// 第302便h(ゲート 1 の処置・統括の検証項目 R188 の続き): **歴史の記録の器を分割の步で走らせる(器の中だけ)**。
// 第302便d で慣性決定力の引きずりの步の既定が semic(u をドリフトの前の位置で解く)になった。退役の本・凍結の記録・フィットの探索の記録
// (第292便c〜第299便c の正本 —— その便の本体〔分割の步〕で測った値・探索の根)を作る器は、記録した便と同じ步で走らせて歴史の値を保つ。
// 本の宣言・署名(presetSig・条件の署名)は変えない —— 宣言に stepOrder を書くと正準形と署名が動くので、器の process の中で html の
// 関数 relDragStepOrderOf(loadHtmlMain が大域に置く)を「合成則 solve の本は "split"」に差し替える(= 全本に stepOrder:"split" を
// 明示したのと同じ経路 —— 本体の S.step・dfmStep3 は步ごとにこの関数で順序を読む)。compose:"sum" の本は従来どおり null(分割のまま)。
// html を変えない・力学の式を変えない(器の走行の步の順序を記録の世代に固定するだけ)。semic の世代の値と許容は器 tests/exp-w302d-semic.mjs
// (段 semic-302d —— 目的の量の split と semic の差・fitRecord の許容)が受け持つ。
// 使い方: loadHtmlMain の直後(親と子プロセスの両方)に pinSplit302() を呼ぶ。戻り値を正本の stepOrderPin302 に書く。
// html に relDragStepOrderOf が無い世代(第302便d より前)では何もしない(pinned:false —— 元から分割)。
export const SPLIT_REC_VERSION = 'w302h-splitrec-1';
export function pinSplit302() {
  const G = globalThis;
  if (typeof G.relDragStepOrderOf !== 'function') return { version: SPLIT_REC_VERSION, pinned: false, order: 'split', note: 'html に步の順序の鍵が無い世代(元から分割)' };
  if (!G.relDragStepOrderOf.__w302hSplit) {
    const orig = G.relDragStepOrderOf;
    const pinned = function (rd) { const o = orig(rd); return (o === null || o === undefined) ? o : 'split'; };
    pinned.__w302hSplit = true;
    G.relDragStepOrderOf = pinned;
  }
  return { version: SPLIT_REC_VERSION, pinned: true, order: 'split', note: '合成則 solve の本の步を分割(第290便c〜第301便の步)に固定した記録 —— 本の宣言・署名は変えない' };
}

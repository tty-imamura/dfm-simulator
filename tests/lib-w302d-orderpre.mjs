// 第302便d(統括の検証項目 R188)—— **步の順序の強制(器の前置き —— 測定専用)**。`node --import ./tests/lib-w302d-orderpre.mjs <器>` か
// NODE_OPTIONS="--import=<この file の URL>" で読み込み、環境変数 W302D_FORCE_ORDER=split のときだけ、loadHtmlMain(tests/lib-w280b-emgrid.mjs —— vm.runInThisContext)
// が読む html の inline script の後ろに 1 文を足して、合成則 solve の本の步の順序を全部 "split"(旧の分割)にする(= 全本に stepOrder:"split" を宣言したのと同じ経路)。
// 既存の器(宣言を写して走らせる器・loadPreset で開く器)を**変えずに**、同じ器・同じ抽出器で分割と semic を並べるための道具。
// html に relDragStepOrderOf が無い世代(基点)では何もしない。本体のコード・正本・QA の判定には使わない(器 tests/exp-w302d-semic.mjs の段 chain だけ)。
import vm from 'node:vm';
export const ORDER_PRE_VERSION = 'w302d-orderpre-1';
const ORD = process.env.W302D_FORCE_ORDER || '';
if (ORD === 'split') {
  const orig = vm.runInThisContext;
  vm.runInThisContext = function (code, opts) {
    if (typeof code === 'string' && code.indexOf('function relDragStepOrderOf(') >= 0)
      code += '\n;relDragStepOrderOf=function(rd){ if(relDragComposeOf(rd)!=="solve") return null; return "split"; };\n';
    return orig.call(this, code, opts);
  };
}

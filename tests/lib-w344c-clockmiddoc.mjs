// 第344便c(原仮定者の回答(2026-11-19 —— 第143報の回答 3)AN879・原仮定者の回答(2026-11-19 —— 第143報)AN853 = B・統括の検証項目 R387): **正本 tests/out/clockmid-344c.json から PHYSICS〔第344便c〕の表を作る文書の lib**
// (QA docs.clockmid344c が節の表と逐語で照合する —— 比は小数 4 桁・小さな ε は有効数字 4 桁の指数・丸めで 0 と書いた値は「0」・極限の発散は「∞」・届かない値は「届かない」)。
export const DOC_VERSION = 'w344c-clockmiddoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const f4 = (x) => (x === 'inf' ? '∞' : x === null || x === undefined || !fin(x) ? '—' : x === 0 ? '0' : Math.abs(x) < 1e-4 || Math.abs(x) >= 1e4 ? Number(x).toExponential(2) : x.toFixed(4));
const fe = (x) => (x === null || x === undefined ? '届かない' : x === 0 ? '0' : Number(x).toExponential(3));
const fs = (x) => (x === null || x === undefined ? '—' : Math.abs(x) >= 1e4 ? (x >= 0 ? '+' : '') + Number(x).toExponential(2) : (x >= 0 ? '+' : '') + x.toFixed(Math.abs(x) < 10 ? 3 : 2));
const yn = (x) => (x ? 'はい' : 'いいえ');
export const formName = (f) => ({ F: '今の点の時計の形(1/√(1 + y²) = √(1 − x²))', k1: '1 ノブの族 k = 1(1/(1 + y²/2))', k2: '1 ノブの族 k = 2((1 + y²/4)^(−2))', kinf: '1 ノブの族 k → ∞(exp(−y²/2))',
  kstar: '1 ノブの族 k*(x = 1 で e^(−½))', h1: '2 ノブの族 h = a y⁴/(1 + y⁴)(遠くで定数 a)', h2: '2 ノブの族 h = a y⁴/(1 + y⁶)(遠くで 0)', h3: '2 ノブの族 h = (e − 2) y⁴(遠くで y⁴ のまま増す)' })[f];
const farName = (r) => (r.kind === 'X' ? '指数の立ち上がり a₀ = ' + r.a0 + '・p = ' + r.p : r.c === 0 ? '対照 c = 0(h = (e − 2) y^' + r.n + ')' : (r.far === 'm2n' ? '有理 m = 2n(遠くで 0)' : '有理 m = n(遠くで (e − 2)/c)') + '・n = ' + r.n);
const muCell = (m) => (m.note === 'unreached' ? '届かない | —' : m.tauUs.toFixed(3) + ' | ' + fs(m.dSig));
const foldCell = (r) => (r.monotone ? 'はい' : 'いいえ(最初の折り返し x = ' + f4(r.xFold) + '・y = ' + f4(r.yFold) + ')');

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, D = J.decl, I = D.ion;
  const tf = (x) => (x === true ? '真' : x === false ? '偽' : 'null');
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| ① 今の点の時計の形で ε = 0(仮定の下で 4 つの周波数を作り直す・〔第343便c〕の B の読みの k = ½) | 差の最大 < 1e-15 | ${tf(G.epsZeroF)} |`,
    `| ② h = 0 で k = ½ の形に戻る | 差の最大 < 1e-15 | ${tf(G.h0)} |`,
    `| ③ 2 ノブの族の ε の 2 つの数え方((1 + h)^(−½) − 1 と g ÷ √(1 − x²) − 1) | 差の最大 < 1e-12 | ${tf(G.twoWays)} |`,
    `| ④ atX1 の定義域(範囲の外で例外・k* で e^(−½)) | ${S.atX1Outs}/${S.atX1Of} | ${tf(G.atX1Domain)} |`,
    `| ⑤ 4 つの周波数の算術(比を先に取る式と積の式) | 相対の差 < 1e-6 | ${tf(G.arith)} |`,
    `| ⑥ 入力の拒否(x が 1 以上・形が無い・c が 1 以上・遠くの型が無い・h の型が無い) | ${S.reject.n}/${S.reject.of} | ${tf(G.reject)} |`].join('\n');

  T.t1 = ['| k | atX1 の結果 |', '|---|---|']
    .concat(J.t1.outs.map((r) => `| ${r.k === 'inf' ? '∞' : r.k === 0.5 ? '½' : r.k} | ${r.threw ? '例外(範囲の外)' : '値を返す'} |`))
    .concat(J.t1.ins.map((r) => `| ${r.k} | y = ${f4(r.y)}・時計 ${f4(r.g)} |`))
    .concat([`| k* = ${f4(J.t1.kStar)} | y = ${f4(J.t1.yAtKStar)}・時計 ${f4(J.t1.gAtKStar)}(e^(−½) との差 ${f4(J.t1.dRefKStar)}) |`]).join('\n')
    + `\n\n(〔第343便c〕の lib の版 ${J.t1.libVersion343c}。範囲 0 < k < ½ の外は例外 —— k = ½ は x = y/√(1 + y²) < 1 で有限の y では x = 1 に届かない・k > ½ は x の最大が 1 未満。漸近の値は〔第343便c〕の解析の極限の列で読む)`;

  T.t2 = ['| 形(B の読み)| y(x = 0.064)| ε の見込み(x = 0.064)| y(x = 0.338)| ε の見込み(x = 0.338)| (見込み − 報告の値)÷ 報告の不確かさ | 同(4 つの周波数の算術の値と比べる)|', '|---|---|---|---|---|---|---|']
    .concat(J.t2.rows.map((r) => `| ${formName(r.form)} | ${f4(r.y[0])} | ${fe(r.eps[0])} | ${f4(r.y[1])} | ${fe(r.eps[1])} | ${fs(r.dSigHigh)} | ${fs(r.dSigHighArith)} |`)).join('\n')
    + `\n\n(観測量 ε = √(ν_a ν_p ÷(ν_1 ν_2))− 1。比べる仮定: ${D.ionAssume.join('/')} —— このとき ε の見込み = g ÷ √(1 − x²) − 1。報告の値 (${I.epsRep.toExponential(1)} ± ${I.epsSig.toExponential(1)})(x = ${I.xHigh})・4 つの周波数の算術 ${J.t2.epsArith.toExponential(5)}(報告の値との差は不確かさの ${fs(J.t2.arithOverSig)} 倍)—— どれも文献の値・未照合。x = ${I.xLow} の報告の数は書かない。1 ノブの族と h3 は下の枝)`;

  const S3 = (r) => `| ${farName(r)} | ${f4(r.gAt1)} | ${foldCell(r)} | ${f4(r.xLimit)} | ${fe(r.epsLow)} | ${fe(r.epsHigh)} | ${fs(r.dSigHigh)} | ${muCell(r.muon)} |`;
  const H3 = ['| 型(h の立ち上がり)| (a) y = 1 の時計 | (b) x(y) が単調か | (b) y → ∞ の x | ε の見込み(x = 0.064)| (c) ε の見込み(x = 0.338)| (c) ÷ 報告の不確かさ | (d) ミューオンの見込み(µs)| (d) ÷ 報告の不確かさ |', '|---|---|---|---|---|---|---|---|---|'];
  T.t3s = H3.concat(J.t3.rows.map(S3), J.t3.ctrl.map(S3)).join('\n')
    + '\n\n(2 ノブの族 g(y)^(−2) = 1 + y² + h(y)・h(1) = e − 2 のまま(統括の参考の試作)、有理の型 h = (e − 2) y^n ÷(1 + c (y^m − 1))・c = ½。対照 c = 0 は遠くで h が増し、x → 0。(c) と (d) は文献の値・未照合 —— 〔第343便c〕⑥ と本節 ③ の比べる仮定つき。単調でない形は下の枝(最小の y)で読む)';
  T.t3x = H3.concat(J.t3.xrows.map(S3)).join('\n')
    + '\n\n(指数の立ち上がりの型 h = (e − 2) exp(A (1 − y^(−p))) × 2 ÷(1 + y⁴)・A = a₀ ÷ p(y = 1 での h の対数の傾きは a₀ − 2・遠くで h → 0)。x(y) が単調 ⇔ y h′ < 2(1 + h) —— h が e − 2 の近くでは対数の傾きが 2(e − 1)/(e − 2) = 4.78 未満)';
  T.t3n = ['| 有理の型の遠くの型 | c | (c) が報告の不確かさの 1 倍の内に入る n の下限 | 2 倍の内に入る n の下限 |', '|---|---|---|---|']
    .concat(J.t3.nmin.map((q) => `| ${q.far === 'm2n' ? 'm = 2n(遠くで 0)' : 'm = n(遠くで (e − 2)/c)'} | ${q.c} | ${f4(q.n1)} | ${f4(q.n2)} |`)).join('\n')
    + '\n\n(x = 0.338 の y は約 0.36 —— そこでの h は (e − 2) 0.36^n ÷(1 − c)の桁で、見込みは約 −h/2。n を実数で二分した値。報告の値と不確かさは文献の値・未照合)';
  T.t3j = ['| (a)〜(d) を同時に満たす行(この格子・この文献の値〔未照合〕・この比べる仮定では)|', '|---|'].concat(J.t3.joint.length ? J.t3.joint.map((r) => `| ${farName(r)} |`) : ['| (無い) |']).join('\n')
    + '\n\n(大きさが 1e-30 未満の ε は 0 と書いた。条件: y = 1 の時計 e^(−½)・x(y) が単調・y → ∞ で x → 1・(c) が報告の不確かさの 1 倍の内・(d) が 1 倍の内。形は決めない —— ノブの範囲の事実)';
  T.t3mid = ['| 型 | ' + D.xMid.map((x) => 'ε の見込み(x = ' + x + ')').join(' | ') + ' |', '|---|' + D.xMid.map(() => '---|').join('')]
    .concat(J.t3.mid.map((r) => `| ${farName(r)} | ${r.eps.map(fe).join(' | ')} |`)).join('\n')
    + '\n\n(y = 1 の近く(x ≈ e^(−½) = 0.6065)で h が立ち上がる分、速さ 0.6〜0.9 の時計が今の点の時計の形から離れる。鋭い有理の型は x(y) が折り返すので下の枝で読む。速さ 0.6〜0.9 の時計の測定の数は、この節では書かない)';

  const lightName = (f) => ({ F: '今の点の時計の形', S20: '有理の型 n = 20・m = 2n・c = ½', X4p3: '指数の立ち上がり a₀ = 4・p = 3' })[f];
  const R4 = J.t4.rows.filter((r) => r.read === 'B');
  T.t4fin = ['| 形(B の読み)| 駆動のべき | ' + D.yLight.map((y) => 'x(y = ' + y + ')').join(' | ') + ' | ' + D.yLight.map((y) => '曲がり ÷ 光(y = ' + y + ')').join(' | ') + ' |', '|---|---|' + D.yLight.map(() => '---|').join('') + D.yLight.map(() => '---|').join('')]
    .concat(R4.map((r) => `| ${lightName(r.form)} | n = ${r.n}${r.n === 0 ? '(今のアプリの力学)' : ''} | ${r.finite.map((q) => f4(q.x)).join(' | ')} | ${r.finite.map((q) => f4(q.bend)).join(' | ')} |`)).join('\n')
    + '\n\n(質量 0・当事者時間で測った速さ y を有限の列で上げる。絶対時間の速さ x = y g。同じ長さの飛行の時間 ÷(L ÷ c_loc)= 1/x。曲がり ÷ 今のアプリの光 = g^n ÷(2 x²)(弱い場の一次 —— 加速 × g^n を重力の加速にも当てた〔第342便b〕の宣言))';
  T.t4lim = ['| 読み | 形 | 駆動のべき | 極限の絶対時間の速さ ÷ c_loc | 極限の飛行の時間 ÷(L ÷ c_loc)| 極限の曲がり ÷ 光 | 光の経路と同じ |', '|---|---|---|---|---|---|---|']
    .concat(J.t4.rows.map((r) => `| ${r.read === 'B' ? 'B(主 —— y → ∞)' : 'A(比べる —— 絶対時間の速さが無限)'} | ${lightName(r.form)} | n = ${r.n} | ${f4(r.limit.speed)} | ${f4(r.limit.time)} | ${f4(r.limit.bend)} | ${yn(r.sameAsLight)} |`)).join('\n')
    + '\n\n(極限は解析の値 —— 3 つの形とも y → ∞ で h → 0・g y → 1。数値に無限は入れない)';
  T.t4num = ['| 形 | 駆動のべき | y | x | 数値の走りの曲がり ÷ 光 | 弱い場の一次の閉じた式 |', '|---|---|---|---|---|---|']
    .concat(J.t4.num.map((r) => `| ${lightName(r.form)} | n = ${r.n} | ${r.y} | ${f4(r.x)} | ${f4(r.ratio)} | ${f4(r.closed)} |`)).join('\n')
    + `\n\n(第342便b の deflectionG(型 F —— 衝突径数 ${f4(J.t4.bNum)} μ)÷ 第341便e の光の走り)`;
  T.t5 = ['| 形(B の読み)| ' + D.xFast.map((x) => 'ε の見込み(x = ' + x + ')').join(' | ') + ' |', '|---|' + D.xFast.map(() => '---|').join('')]
    .concat(J.t5.map((r) => `| ${formName(r.form)} | ${r.eps.map(fe).join(' | ')} |`)).join('\n')
    + '\n\n(比べる仮定は ③ と同じ。「届かない」は B の読みの x の最大がその速さに届かない形。中くらい〜速い側の時計の測定が在っても、その数は文献・未照合 —— この節では書かない)';
  return T;
}

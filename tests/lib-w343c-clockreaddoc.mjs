// 第343便c(原仮定者の回答(2026-11-19 —— 第143報)AN853・原仮定者の回答(2026-11-19 —— 第142報の回答 2)AN840・統括の検証項目 R380): **正本 tests/out/clockread-343c.json から PHYSICS〔第343便c〕の表を作る文書の lib**
// (QA docs.clockread343c が節の表と逐語で照合する —— 比は小数 4 桁か有効数字 3 桁の指数・丸めで 0 と書いた値は「0」・極限の発散は「∞」・届かない値は「届かない」)。
export const DOC_VERSION = 'w343c-clockreaddoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const f4 = (x) => (x === 'inf' ? '∞' : x === null || x === undefined || !fin(x) ? '—' : x === 0 ? '0' : Math.abs(x) < 1e-4 ? Number(x).toExponential(2) : Math.abs(x) >= 1e4 ? Number(x).toExponential(2) : x.toFixed(4));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : 'null');
const yn = (x) => (x ? 'はい' : 'いいえ');
export const kName = (k) => (k === 'inf' ? 'k → ∞(exp(−s²/2) —— 第342便b の U3)' : k === 0.5 ? 'k = ½(1/√(1 + s²) —— U1)' : k === 1 ? 'k = 1(1/(1 + s²/2) —— U2)' : k === 2 ? 'k = 2((1 + s²/4)^(−2))' : 'k = ' + k + '(参考 —— k ≤ ½ の境目の向こう)');
const kShort = (k) => (k === 'inf' ? 'k → ∞' : k === 0.5 ? 'k = ½' : 'k = ' + k);
const readName = (r) => (r === 'B' ? 'B(主 —— 当事者時間で測った速さ y)' : 'A(比べる —— 絶対時間で見た速さ x)');
const nName = (n) => (n === 0 ? 'n = 0(今のアプリの力学)' : 'n = ' + n);

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, D = J.decl;
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| ① 静止(y = 0・x = 0)で全部の形の g が 1 | ${S.g0 ? 'はい' : 'いいえ'} | ${tf(G.g0)} |`,
    `| ② 形の族(k = ½・1・∞)が第342便b の gOf と同じ値 | 差の最大 < 1e-15 | ${tf(G.family)} |`,
    `| ③ k = ½ の B の読み 1/√(1 + y²) と √(1 − x²)(x = y/√(1 + y²))の恒等式(y は 0〜100) | 差の最大 < 1e-12 | ${tf(G.identity)} |`,
    `| ④ 最大の x の閉じた形(k = 1 で √2 ÷ 2・k → ∞ で e^(−½)・k = 2 の y* = √(4/3)) | 差の最大 < 1e-12 | ${tf(G.xMax)} |`,
    `| ⑤ 絶対時間の速さで書き直した時計(2 つの枝)から x(y) を作り直す | 差の最大 < 1e-12 | ${tf(G.inverse)} |`,
    `| ⑥ 脱出の速さが s になる深さの時計 e^(−s²/2) = exp の形 | 差の最大 < 1e-15 | ${tf(G.escape)} |`,
    `| ⑦ 連鎖律の項を入れた読みの型 F が g⁴ = (1 − x²)²・到達の時間の閉じた形と Simpson | < 1e-12・< 1e-9 | ${tf(G.chain)} |`,
    `| ⑧ 入力の拒否(s が負・k が 0 以下・型が無い・x が負) | ${S.reject.n}/${S.reject.of} | ${tf(G.reject)} |`].join('\n');

  T.t1 = ['| 形(B の読み —— s = y)| 単調か | 最大の x(その y)| y → ∞ の x | x = 1 に届く | ' + D.yGrid.map((y) => 'x(y = ' + y + ')').join(' | ') + ' | g(y = 1)= x(y = 1)|', '|---|---|---|---|---|' + D.yGrid.map(() => '---|').join('') + '---|']
    .concat(J.t1.rows.map((r) => `| ${kName(r.k)} | ${yn(r.monotone)} | ${r.xMax === null ? '—' : f4(r.xMax) + '(y = ' + f4(r.yStar) + ')'} | ${f4(r.xLimit)} | ${yn(r.reachesOne)} | ${r.xOfY.map(f4).join(' | ')} | ${f4(r.gAtY1)} |`)).join('\n')
    + '\n\n(x = y g(y)。y = 1 では x = g(1)。k > ½ では x に最大が在り、y → ∞ で x → 0(当事者時間で測った速さが無限のとき、絶対時間で見た速さは 0 に近づく)。k = ½ は x → 1(局所光速)・k < ½ は x → ∞)';

  T.t1x = ['| 形 | ' + D.xRead.map((x) => 'g(x = ' + x + ')下の枝').join(' | ') + ' | ' + D.xRead.map((x) => 'g(x = ' + x + ')上の枝').join(' | ') + ' | 同じ時計になる A の読みの型 |', '|---|' + D.xRead.map(() => '---|').join('') + D.xRead.map(() => '---|').join('') + '---|']
    .concat(J.t1.rows.map((r) => { const s = J.t1.same.find((q) => q.k === r.k).sameAs;
      return `| ${kName(r.k)} | ${r.gLowerAtX.map(f4).join(' | ')} | ${r.gUpperAtX.map((v) => (v === null ? '無い' : f4(v))).join(' | ')} | ${s.length ? s.map((t) => (t === 'F' ? 'F(局所光速で止まる型 √(1 − x²))' : t)).join('・') : '無い'} |`; })).join('\n')
    + '\n\n(B の読みを絶対時間の速さ x の時計に書き直したもの。k > ½ では 1 つの x に y が 2 つ(下の枝 y ≤ y*・上の枝 y > y*)。**k = ½ の B の読みは √(1 − x²) と同じ時計**(恒等式 —— 「局所光速で止まる場合」と「当事者時間で測った速さが無限で止まる場合」が同じ時計の 2 つの書き方になる)。k = 1・2・∞ の B の読みは、どの A の読みの型とも同じ時計にならない)';

  T.t2rs = ['| 軟化 ε ÷ r_s | 背景 ψ₀ = X_k D₀ | r = r_s の ψ | 静止の時計 e^(−ψ) | 遠方の時計 e^(−ψ₀) に対する比 |', '|---|---|---|---|---|']
    .concat(J.t2.rs.map((r) => `| ${r.epsOverRs} | ${r.psi0} | ${f4(r.psi)} | ${f4(r.clock)} | ${f4(r.overFar)} |`)).join('\n')
    + '\n\n(今の式の静止の時計 e^(−ψ)・ψ = X_k(m/√(r² + ε²) + D₀)・r_s = 2G₀m/c₀² で ψ = ½ → e^(−½) = 0.6065。軟化と背景はノブの例の値)';

  T.t2forms = ['| 形 | (a) y = 1 の値(B の読み)| (a) ÷ e^(−½) | (b) x → 1 の値(B の読み)| A の読みの x = 1 の値 | 脱出の速さが s の深さの時計と同じ形 |', '|---|---|---|---|---|---|']
    .concat(J.t2.forms.map((r) => `| ${kName(r.k)} | ${f4(r.aAtY1)} | ${f4(r.overRs)} | ${r.bAtX1Note === 'limit' ? '0 に近づく(y → ∞)' : r.bAtX1Note === 'unreached' ? '届かない' : f4(r.bAtX1) + '(有限の y)'} | ${f4(r.aReadAtX1)} | ${r.escapeSameForm ? 'はい(A では ψ = x²/2・B では ψ = y²/2)' : 'いいえ'} |`)).join('\n')
    + `\n\n(局所光速で止まる型 F の x = 1 の値は ${f4(J.t2.fRef)}。y = 1 の値と A の読みの x = 1 の値は同じ数(同じ式に 1 を入れる)—— 違うのは、その値になる絶対時間の速さ(B では x = g(1)・A では x = 1))`;

  const R3 = J.t3.rows;
  T.t3lim = ['| 読み | 形 | 駆動のべき | 極限の絶対時間の速さ ÷ c_loc | 極限の曲がり ÷ 光 | 極限の飛行の時間 ÷(L ÷ c_loc)| 光の経路と同じ |', '|---|---|---|---|---|---|---|']
    .concat(R3.map((r) => `| ${readName(r.read)} | ${kShort(r.k)} | ${nName(r.n)} | ${f4(r.limit.speed)} | ${f4(r.limit.bend)} | ${f4(r.limit.time)} | ${yn(r.sameAsLight)} |`)).join('\n')
    + `\n\n(極限は解析の値(B は y → ∞・A は x → ∞)。曲がりは弱い場の一次(μ/b → 0 を先に)の 2 g^n/x² ÷ 4 —— 加速 × g^n を重力の加速にも当てた宣言(第342便b)。今のアプリの力学で局所光速の粒子の曲がりは光の ${f4(J.t3.appRatio)} 倍(第341便e))`;

  T.t3fin = ['| 読み | 形 | 駆動のべき | ' + D.sGrid.map((s) => '曲がり ÷ 光(s = ' + s + ')').join(' | ') + ' |', '|---|---|---|' + D.sGrid.map(() => '---|').join('')]
    .concat(R3.map((r) => `| ${readName(r.read)} | ${kShort(r.k)} | ${nName(r.n)} | ${r.finite.map((f) => f4(f.bend)).join(' | ')} |`)).join('\n');

  const xs = R3.filter((r) => r.n === 0);
  T.t3x = ['| 読み | 形 | ' + D.sGrid.map((s) => 'x(s = ' + s + ')').join(' | ') + ' | ' + D.sGrid.map((s) => '飛行の時間 ÷(L ÷ c_loc)(s = ' + s + ')').join(' | ') + ' |', '|---|---|' + D.sGrid.map(() => '---|').join('') + D.sGrid.map(() => '---|').join('')]
    .concat(xs.map((r) => `| ${readName(r.read)} | ${kShort(r.k)} | ${r.finite.map((f) => f4(f.x)).join(' | ')} | ${r.finite.map((f) => f4(f.time)).join(' | ')} |`)).join('\n')
    + '\n\n(s は B の読みでは y・A の読みでは x。同じ経路の長さ L の飛行の時間は 1/x 倍(一様な場の近似)。B の読みの k > ½ は大きな y で x が小さく、飛行の時間が長い)';

  T.t3num = ['| 読み | 形 | 駆動のべき | s | 数値の走りの曲がり ÷ 光 | 弱い場の一次の閉じた式 |', '|---|---|---|---|---|---|']
    .concat(J.t3.num.map((r) => `| ${readName(r.read)} | ${kShort(r.k)} | ${nName(r.n)} | ${r.s} | ${f4(r.ratio)} | ${f4(r.closed)} |`)).join('\n')
    + `\n\n(第342便b の deflectionG(衝突径数 ${f4(J.t3.bNum)} μ)。B の読みの k = ½ は型 F と同じ時計なので F の走り。B の読みの k > ½ は x の最大の近くで時計が 2 価 —— 走りには枝の宣言が要るので閉じた式だけ)`;

  const M = D.muon, R4 = J.t4.rows;
  T.t4 = ['| 読み | 形 | 当事者時間で測った速さ y | 時計 g | 寿命の見込み(µs)| 報告の値との差(µs)| ÷ 報告の不確かさ |', '|---|---|---|---|---|---|---|']
    .concat(R4.map((r) => (r.note === 'unreached' ? `| ${readName(r.read)} | ${kShort(r.k)} | — | — | 届かない(x の最大 ${f4(J.t4.xMaxB.find((q) => q.k === r.k).xMax)} < ${f4(J.t4.x)}) | — | — |`
      : `| ${readName(r.read)} | ${kShort(r.k)} | ${f4(r.y)} | ${f4(r.g)} | ${r.tauUs.toFixed(3)} | ${(r.dUs >= 0 ? '+' : '') + r.dUs.toFixed(3)} | ${(r.dSig >= 0 ? '+' : '') + r.dSig.toFixed(1)} |`))).join('\n')
    + `\n| 局所光速で止まる型 F(A の読み) | √(1 − x²) | ${f4(J.t4.x / J.t4.F.g)} | ${f4(J.t4.F.g)} | ${J.t4.F.tauUs.toFixed(3)} | ${(J.t4.F.dUs >= 0 ? '+' : '') + J.t4.F.dUs.toFixed(3)} | ${(J.t4.F.dSig >= 0 ? '+' : '') + J.t4.F.dSig.toFixed(1)} |`
    + `\n\n(x = √(1 − γ^−2) = ${J.t4.x.toFixed(6)}(γ = ${M.gamma})。静止の寿命 ${M.tau0us} µs・報告の寿命 ${M.tauObsUs} ± ${M.tauObsSigUs} µs —— 文献の値・未照合。比べる仮定: ${D.muonAssume.join('/')})`;

  T.t5 = ['| 型(A の読み)| ' + D.xChain.map((x) => '第 2 項 ÷ 左辺(x = ' + x + ')').join(' | ') + ' | ' + D.xChain.map((x) => '係数 f(x = ' + x + ')').join(' | ') + ' | ' + D.xReach.map((x) => 'x = ' + x + ' に届く T(べき 2 の列)').join(' | ') + ' | ' + D.xReach.map((x) => '同(項を入れた読み)').join(' | ') + ' |',
    '|---|' + D.xChain.map(() => '---|').join('') + D.xChain.map(() => '---|').join('') + D.xReach.map(() => '---|').join('') + D.xReach.map(() => '---|').join('')]
    .concat(J.t5.rows.map((r) => `| ${r.type} | ${r.share.map(f4).join(' | ')} | ${r.f.map(f4).join(' | ')} | ${r.tReachN2.map(f4).join(' | ')} | ${r.tReachFull.map(f4).join(' | ')} |`)).join('\n')
    + '\n\n(「d²p/dτ² = a*(一定)」の宣言で連鎖律の第 2 項 (d²τ/dt²)(dp/dτ) も入れると dx/dT = g² f・f = 1/(1 − x g′/g)(T はべき 2 の列と同じ物差し)。第 2 項 ÷ 左辺 = x g′/g は負 —— 加速の途中で時計の進みが遅くなる分だけ、べき 2 の列より加速が小さい。型 F では g² f = (1 − x²)²(べき 4 と同じ式))';
  return T;
}

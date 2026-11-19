// 第344便b(原仮定者の回答(2026-11-19 —— 第143報の回答 2・回答 3)AN876・AN877・統括の検証項目 R386): **正本 tests/out/partyconv-344b.json から PHYSICS〔第344便b〕の表を作る文書の lib**
// (QA docs.partyconv344b が節の表と逐語で照合する —— 比は小数 6 桁か有効数字 3 桁の指数・丸めで 0 と書いた値は「0」・小さい差は「< 床」の形で、丸めの残りの数は載せない)。
export const DOC_VERSION = 'w344b-partyconvdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f6 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Math.abs(x) < 1e-6 ? '< 1e-6' : x.toFixed(6));
const f4 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x.toFixed(4));
const f2 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x.toFixed(2));
const lt = (x, fl) => (x === 0 ? '0' : x < fl ? '< ' + fl.toExponential(0) : fe(x));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : 'null');

export const KIND_NAME = Object.freeze({ 0: '(0) 現行(絶対時間)', alpha: '(α) 速度の増し分(× q)', beta: '(β) 位置の 2 階(状態 U)', gamma: '(γ) 対照: キックに × q²',
  alphaGeo: '(α) 対に共通の因子 √(q_i q_j)', alphaAri: '(α) 対に共通の因子 (q_i + q_j)/2' });
const PAIR = Object.freeze({ receiver: '受け手', symmetric: '対称' });
const UNIT = Object.freeze({ abs: '絶対時間', static: '静止の当事者(N)', moving: '動く当事者(q = N g)' });
const COMBO = Object.freeze({ none: 'なし', both: '両方', app: '不揃い(今のアプリ)' });
const ENAME = (e) => (e === 0.20563593 ? '水星の型 0.2056' : e === 0.0068 ? '金星の型 0.0068' : '月の型 0.055');

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| ① 静止(v = 0・U = 0)で q = N・ψ = 0 で 1 | ${S.q0 ? 'はい' : 'いいえ'} | ${tf(G.q0)} |`,
    `| ② U から作る q と v から作る q が同じ状態を表す(v = q U —— 相対の差の最大) | ${lt(S.qUVmax, 1e-14)} | ${tf(G.qUV)} |`,
    `| ③ 静止の点の右辺((α) は N a_G・(β) と (γ) は N² a_G —— 差の最大) | ${lt(S.rhsMax, 1e-12)} | ${tf(G.rhs)} |`,
    `| ④ 見込みの式の値((0) 指数 2 と (α) 指数 1 は −2/3・(β) 指数 1 は −1/3・(γ) 指数 1 は −1・(β) 対称 指数 2 は −1/3) | ${S.closed ? 'はい' : 'いいえ'} | ${tf(G.closed)} |`,
    `| ⑤ X_k の閉じた形(絶対時間の単位で指数 2・静止の当事者の単位で (α)・(β) の指数 1 が 1) | ${S.xk ? 'はい' : 'いいえ'} | ${tf(G.xk)} |`,
    `| ⑥ 入力の拒否(型が無い・v が負・U が非有限・見込みの型が無い) | ${S.reject.n}/${S.reject.of} | ${tf(G.reject)} |`].join('\n');

  const t1 = J.t1, at = (e, p, n, k) => t1.rows.find((r) => r.e === e && r.pair === p && r.nG === n && r.kind === k);
  T.t1 = ['| 離心率 | G_loc の型 | n_G | (0) 現行 | (α) 速度の増し分 | (β) 位置の 2 階 | (γ) 対照 q² | 見込み (0)・(α)・(β)・(γ) | 刻みを半分にした差の最大 |', '|---|---|---|---|---|---|---|---|---|']
    .concat(J.decl.orbit.es.flatMap((e) => J.decl.pairs.flatMap((p) => J.decl.nG.map((n) => { const rs = J.decl.kinds.map((k) => at(e, p, n, k));
      return `| ${ENAME(e)} | ${PAIR[p]} | ${n} | ${rs.map((r) => f6(r.overPN)).join(' | ')} | ${rs.map((r) => f4(r.closed)).join('・')} | ${fe(Math.max(...rs.map((r) => r.halfDiff)))} |`; })))).join('\n')
    + `\n\n(近点の進み ÷ 弱い場の 1PN —— 正が進み。中心は固定の質点・場は静止・背景と軟化と引きずり無し・a = 1・μ = ${J.decl.orbit.mu}・1 周 ${J.decl.orbit.steps[1]} 刻み〔差は ${J.decl.orbit.steps[0]} 刻みとの差〕・近点 ${J.decl.orbit.nOrb} 回の差の平均・同じ位置と同じ絶対時間の速度から((β) は U₀ = v₀ ÷ q₀)。時計の因子は今の点の時計の形。見込みとの差〔2e-4 より小さい〕は μ の二次の項)`;
  T.chain = ['| 離心率 | G_loc の型 | n_G | (β) − (γ)(連鎖律の第 2 項の効き) | (β) − (0) | (α) − (0) |', '|---|---|---|---|---|---|']
    .concat(t1.chain.map((c) => `| ${ENAME(c.e)} | ${PAIR[c.pair]} | ${c.nG} | ${f6(c.betaMinusGamma)} | ${f6(c.betaMinus0)} | ${f6(c.alphaMinus0)} |`)).join('\n')
    + '\n\n((β) − (γ) は一次で +2/3 = +0.666667 —— キックに q² を掛けるだけの型は第 2 項を落とす。(β) − (0) は二次の桁 —— (β) では時計の因子が一次に入らない。(α) − (0) は一次で −1/3)';
  T.cross = ['| n_G | 型 | 本器 | 第343便b の lib の近点(宣言) | 差 |', '|---|---|---|---|---|']
    .concat(t1.cross.map((c) => `| ${c.nG} | ${KIND_NAME[c.kind]} | ${f6(c.here)} | ${f6(c.w343b)}(${c.decl343b}) | ${lt(c.diff, 1e-9)} |`)).join('\n');
  T.added = ['| 足した列(水星の型・受け手) | n_G | G_loc + 型の近点 ÷ 1PN | 同 ″/世紀 | K1 の +5/3 と足した和 | 和 ″/世紀 |', '|---|---|---|---|---|---|']
    .concat(t1.added.map((a) => `| ${KIND_NAME[a.kind]} | ${a.nG} | ${f6(a.overPN)} | ${f2(a.gLocArcsecCy)} | ${f6(a.withK1)} | ${f2(a.withK1ArcsecCy)} |`)).join('\n')
    + `\n\n(水星の 1PN は ${f2(t1.pn.arcsecCy)}″/世紀。K1 の +5/3 は第331便c の文書の値。今の収支〔−28.65 + 71.63〕は動かさない —— 別の列)`;

  const t2 = J.t2, row2 = (r) => `| ${r.group} | ${r.combo ? COMBO[r.combo] : '—'} | ${UNIT[r.unit]} | ${KIND_NAME[r.kind]} | ${r.nG} | ${r.psiG} | ${r.psi0} | ${r.psi0G === undefined ? 0 : r.psi0G} | ${r.x} | ${f6(r.closed)} | ${f6(r.numeric)} | ${lt(r.rel, 1e-6)} |`;
  T.t2 = ['| 組 | 背景の組 | 単位 | 型 | n_G | ψ_G | 時計の背景 ψ₀ | 重力の背景 | x | G_loc ÷ c_loc² ÷ X_k(閉じた形) | 同(数値) | 相対の差 |', '|---|---|---|---|---|---|---|---|---|---|---|---|']
    .concat(t2.rows.map(row2)).join('\n')
    + '\n\n(i = 絶対時間の単位・ii = 静止の当事者の時計の単位・iii = 背景の 3 つの組・iv = 動く当事者(x = 絶対時間の速さ ÷ c_loc)。数値は、静止の行は静止から短く落とした距離から〔2 つの刻みで寄せる〕・動く行は接線の速度の右辺から。(α) の単位の重力は時計の進みで 1 回割った則・(β) は 2 回。ψ = 0.5 の数値の差 4e-5 の桁は落下の間の場の勾配)';
  T.t2sets = ['| 単位 | 型 | n_G | 静止で 1 からの差の最大 | 動く当事者で 1 からの差の最大 | 不揃いの背景で 1 からの差の最大 | 読み |', '|---|---|---|---|---|---|---|']
    .concat(t2.sets.map((s) => `| ${UNIT[s.unit]} | ${KIND_NAME[s.kind]} | ${s.nG} | ${s.restMax === null ? '—' : lt(s.restMax, 1e-12)} | ${s.moveMax === null ? '—' : lt(s.moveMax, 1e-12)} | ${s.bgMax === null ? '—' : lt(s.bgMax, 1e-12)} | ${s.reading} |`)).join('\n')
    + '\n\n(格子の上での読み —— 「両方」の背景の行は除いて数えた。「格子の全部で 1」は格子の上でだけの読み)';
  T.bg = ['| 離心率 | 型 | n_G | 背景の組 | ψ₀ | 初期の速さの倍率(速さの 2 乗) | 近点 ÷ 1PN | 測った半直弦で割った比 | 見込み | なしとの差 |', '|---|---|---|---|---|---|---|---|---|---|']
    .concat(J.bg.rows.map((r) => `| ${ENAME(r.e)} | ${KIND_NAME[r.kind]} | ${r.nG} | ${COMBO[r.combo]} | ${r.psi0} | ${f6(r.vScale)} | ${f6(r.overPN)} | ${f6(r.overPNp)} | ${f6(r.closed)} | ${r.dNone === 0 ? '0' : Math.abs(r.dNone) < 1e-5 ? '< 1e-5' : f6(r.dNone)} |`)).join('\n')
    + '\n\n(受け手の型・刻み 6000。一様な倍率は初期の速さに入れた —— 同じ形の軌道から始める。(α) の見込みは −(2 n_G + 1 + e^(m ψ₀))/6(m = 両方 1・不揃い 3): 速さの因子 g の x = v ÷ c_loc が時計の背景で e^(2ψ₀) 倍に読まれる)';
  T.t3 = ['| 型 | n_G | μ = 1e-5 | μ = 2e-5 | μ = 4e-5 | 二次の係数 c₂(1e-5 と 4e-5) | 同(1e-5 と 2e-5) | 一次へ外挿 c₁ | 見込み | c₁ − 見込み |', '|---|---|---|---|---|---|---|---|---|---|']
    .concat(J.t3.rows.map((r) => `| ${KIND_NAME[r.kind]} | ${r.nG} | ${r.values.map(f6).join(' | ')} | ${f4(r.c2From14)} | ${f4(r.c2From12)} | ${f6(r.c1Extrap)} | ${f6(r.closed)} | ${fe(r.dC1)} |`)).join('\n')
    + '\n\n(近点 ÷ 1PN = c₁ + c₂ μ + …(a = 1・水星の型の e・受け手・刻み 6000)。c₂ は 1PN を 1 とした比の μ あたりの係数 —— 二次の項は初期の状態の取り方〔同じ絶対時間の速度〕にも依る)';
  T.t3pairs = ['| 組 | 一次の差 | 二次の係数の差 |', '|---|---|---|']
    .concat(J.t3.pairs.map((p) => `| ${KIND_NAME[p.a.kind]} 指数 ${p.a.nG} − ${KIND_NAME[p.b.kind]} 指数 ${p.b.nG} | ${fe(p.dC1)} | ${f4(p.dC2)} |`)).join('\n');

  const t4 = J.t4, sn = { two: '2 体', three: '3 体' };
  T.t4 = ['| 系 | n_G(対称) | 型 | (a) 運動量の残り ÷ Σ m 大きさ(v) | (b) 仕事の残り(E の変化 ÷ 大きさ(E)) | (c) 重心の漂い ÷ a | q の差の最大 |', '|---|---|---|---|---|---|---|']
    .concat(t4.rows.map((r) => `| ${sn[r.sys]} | ${r.nG} | ${KIND_NAME[r.kind]} | ${lt(r.dP, 1e-12)} | ${lt(r.dE, 1e-9)} | ${lt(r.drift, 1e-12)} | ${fe(r.dqMax)} |`)).join('\n')
    + `\n\n(第343便b の systemOf の系・RK4 ${J.decl.nbody.steps} 步で ${J.decl.nbody.orbits} 周・v は絶対時間の速度・E はニュートンの E(n_G = 1 の G_loc の力は位置の関数の勾配ではないので (0) でも残る))`;
  const pi = t4.pairImpulse;
  T.t4pair = ['| 2 体・(α)・n_G = 0 の初期の点 | 値 |', '|---|---|',
    `| q_1・q_2 | ${f6(pi.q1)}・${f6(pi.q2)} |`, `| 対の力積の残り(F_1 + F_2 の x 成分) | ${fe(pi.residX)} |`, `| 見込み F_12 (q_1 − q_2)(x 成分) | ${fe(pi.predX)} |`, `| 差 ÷ 大きさ(F_12) | ${lt(pi.diff, 1e-12)} |`].join('\n');
  T.common = ['| 離心率 | n_G | 型 | 近点 ÷ 1PN | 見込み −(2 n_G + 1)/6 | 差 | ″/世紀 | 刻みを半分にした差 |', '|---|---|---|---|---|---|---|---|']
    .concat(t4.commonApsis.map((r) => `| ${ENAME(r.e)} | ${r.nG} | ${KIND_NAME[r.kind]} | ${f6(r.overPN)} | ${f6(r.closed)} | ${fe(r.dClosed)} | ${f2(r.arcsecCy)} | ${fe(r.halfDiff)} |`)).join('\n')
    + '\n\n(試験粒子の極限 —— 中心の q = 1 なので共通の因子は √q と (1 + q)/2(どちらも一次で q の半分の効き)。受け手の型)';
  return T;
}

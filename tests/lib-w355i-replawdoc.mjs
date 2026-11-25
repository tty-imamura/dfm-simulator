// 第355便i(統括の検証項目 R512): 斥力の則の族と圧力の冪の文書の lib —— 原文・族の宣言の表・冪の表・数の文・表 6c を正本から作る(import しない・ファイルを読まない)。
export const DOC_VERSION = 'w355i-replawdoc-1';

/** 原文(言葉を変えずに引く —— 公開の文書〔docs/PAPER_PLAN.md の論文 5 の節〕に在る字から写した) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-22)', 'もしも気体の圧力が粒子間の斥力なら']),
  Object.freeze(['原仮定者の指示(2026-11-21)', '主にgeoPN=2を使用。アナロジーとして、熱の三態の創発の検証結果を示す。3Dに拡張し、理想気体の状態方程式に近付ける']),
  Object.freeze(['原仮定者の回答(2026-11-22)', 'AN949: Aで進める。論文5は、geoPN=0を使用に変更する。2D版と3D版のサンプルをそれぞれ用意する']),
]);
export const READINGS = Object.freeze([
  '入口の思考実験 —— 圧力を粒の間の斥力として読む。本節はこの読みのまま、斥力の則の側をノブで振る(推奨 A)',
  '三次元へ延ばして状態方程式の形に近付ける題(アナロジーとして —— 現実の熱力学の記述ではない)。「近付ける」の物差しは密度への冪と温度への冪(窓 0.9〜1.1)',
  '論文 5 は geoPN=0・2D 版と 3D 版の本を両方 —— 族の組は三次元を主に数え、二次元の箱でも同じ組を数える',
]);
export function originalTable() {
  return ['| 出どころ | 原文 | 読み |', '|---|---|---|'].concat(ORIGINAL.map(([s, o], k) => `| ${s} | 「${o}」 | ${READINGS[k]} |`)).join('\n');
}

/** 族の宣言(ノブ 4 つ —— 式の形を先に 1 つに決めない) */
export const FAMILY = Object.freeze([
  ['① 形 × 距離の冪', '(G) 今の形(g² の則)/(P1) abs(F) = 2 kRep μ H d t^(s+1)(接するところで 0 —— s 3 で (G) と同じ式)/(P2) abs(F) = 2 kRep μ H R̄ t^s(接するところで有限)・t = R̄ ÷ (R̄ + d)', 's = 1・2・3・4・6(遠くで abs(F) ∝ d^(−s))', '(G) と (P1) s 3 だけが今の式'],
  ['② 届く距離を切る', '(c-) 切らない/(cs) × (1 − (d ÷ r_c)²)²(なめらかに 0 へ)/(ct) d < r_c で 1・外で 0(段)', 'r_c = 0.5・1・2・4・8 × a★(a★ = 中の密度の粒の間隔 —— 密度で動かさない)', '切ると今の式に戻らない(r_c → ∞ の極限で戻る)'],
  ['③ 近くの粒の数で割る', '力に (2 ÷ (n_i + n_j))^p を掛ける・n_a = 1 + Σ_b (1 − (d_ab ÷ r_n)²)²(d_ab < r_n)', 'p = 0・0.5・1・r_n = 1・2・3 × a★', 'p 0 だけが今の式'],
  ['④ 熱への依り方', '(積) √(T_i T_j)/(和) (T_i + T_j) ÷ 2(第355便g の名)', '温度をそろえた箱では 2 つは同じ数(対の H = T)', '(積) は内部温度の今の式・(和) はスピンの今の式'],
]);
export function familyTable() {
  return ['| ノブ | 族の形 | 振った値 | 二次元へ落とすと今の式に戻るか |', '|---|---|---|---|'].concat(FAMILY.map((r) => '| ' + r.join(' | ') + ' |')).join('\n');
}

const f3 = (x) => (x === null || x === undefined) ? '—' : x.toFixed(3);
const f2 = (x) => (x === null || x === undefined) ? '—' : x.toFixed(2);
const yn = (b) => b === null ? '—' : (b ? '内' : '外');
const ext = (b) => b === null ? '—' : (b ? '示量' : '示量でない');
const ROWHEAD = ['| 表 | 組 | 届く | 密度への冪(箱で振る) | 密度への冪(粒の数で振る) | 温度への冪 | 2 つの密度の冪 | 窓 0.9〜1.1(3 つの冪) | 近くの数の平均(中の密度) | 切る距離の内の対の割合(中の密度) |', '|---|---|---|---|---|---|---|---|---|---|'];
const rowLine = (k, r) => `| ${k} | ${r.id} | ${r.reach ? '届く' : '届かない'} | ${f3(r.aBox)} | ${f3(r.aN)} | ${f3(r.aT)} | ${ext(r.extensive)} | ${r.reach ? (r.inWin ? '内' : '外') : '—'} | ${f2(r.nMeanMid)} | ${f3(r.inCutMid)} |`;

/** 表(正本から) */
export function tablesOf(J) {
  const T = {};
  T.a = ROWHEAD.concat(['a1', 'a2', 'a3', 'a4', 'a5'].flatMap((k) => J[k].map((r) => rowLine(k.toUpperCase(), r)))).join('\n');
  T.a67 = ['| 表 | 組 | 次元 | 並進 | 斥力の分の密度への冪(箱で振る) | (粒の数で振る) | 温度への冪 | 窓 0.9〜1.1(3 つの冪) |', '|---|---|---|---|---|---|---|---|']
    .concat(J.a6.map((r) => `| A6 | ${r.id} | 2 | なし | ${f3(r.aBox)} | ${f3(r.aN)} | ${f3(r.aT)} | ${r.reach ? (r.inWin ? '内' : '外') : '—'} |`))
    .concat(J.a7.map((r) => `| A7 | ${r.id} | 3 | あり(斥力の分 = 全体 − 並進の分) | ${f3(r.aBox)} | ${f3(r.aN)} | ${f3(r.aT)} | ${r.reach ? (r.inWin ? '内' : '外') : '—'} |`)).join('\n');
  T.a8 = ['| 組 | 粒 64 の箱で振る冪 | 粒 216 の箱で振る冪 | 動き(216 − 64) | 粒 216 で窓 0.9〜1.1 |', '|---|---|---|---|---|']
    .concat(J.a8.map((r) => `| ${r.id} | ${f3(r.aBox64)} | ${f3(r.big[0].aBox)} | ${r.big[0].shift === null ? '—' : (r.big[0].shift >= 0 ? '+' : '') + r.big[0].shift.toFixed(3)} | ${r.big[0].inWin ? '内' : '外'} |`)).join('\n');
  T.b = ['| 列(第355便g) | 斥力の強さの倍 | 全体の密度への冪 | 斥力の分 ÷ 並進の分(中の密度) | P ÷ (ρ T)(中の密度) | 窓 0.9〜1.1 |', '|---|---|---|---|---|---|']
    .concat(J.b.flatMap((c) => c.rows.map((r) => `| ${c.col} | ${r.mult} | ${f3(r.aRho)} | ${f3(r.repOverKin)} | ${f3(r.pOverRhoT)} | ${yn(r.inWin)} |`))).join('\n');
  T.zero = ['| 第355便g の列 | 密度 | 第355便g の lib の圧力 | 自分の器の既定の組の圧力 |', '|---|---|---|---|']
    .concat(J.zero.map((r) => `| ${r.col} | ${r.rho} | ${r.gP.toPrecision(10)} | ${r.mineP.toPrecision(10)} |`)).join('\n');
  return T;
}
/** 数の文(正本から) */
export function factsOf(J) {
  const F = {}, S = J.summary, near = S.nearest[0];
  F.inWin = S.inWin.length
    ? `宣言した族の ${S.nCombos} 組(届く組 ${S.nReach})のうち、斥力だけの圧力の 3 つの冪(箱で振る・粒の数で振る・温度)が窓 0.9〜1.1 に入る組は ${S.inWin.length} 組: ${S.inWin.join('・')}。`
    : `宣言した族の ${S.nCombos} 組(届く組 ${S.nReach})のうち、斥力だけの圧力の 3 つの冪が窓 0.9〜1.1 に入る組は無い —— この族では無い。`;
  F.nearest = `窓までの離れ(3 つの冪の 1 からの離れの最大)がいちばん小さい組は ${near.id}(箱で振る ${f3(near.aBox)}・粒の数で振る ${f3(near.aN)}・温度 ${f3(near.aT)}・離れ ${f3(near.dist)})。`;
  const a8 = J.a8.map((r) => `${r.id} ${f3(r.aBox64)} → ${f3(r.big[0].aBox)}`);
  F.big = J.a8.length ? `窓に入った組のうち格子の順の先頭 ${J.a8.length} 組を粒 216 の箱で振り直すと、箱で振る冪は ${a8.join('・')}(${S.a8Not.length ? S.a8Not.join('・') + ' の粒 216 と、' : ''}粒 512 は未)。` : '窓に入った組が無いので、粒の数を上げた箱は振っていない。';
  const noCut = J.a1.filter((r) => r.reach);
  F.ext = `切らない・割らない組(表 A1)では、箱で振る冪は ${f3(Math.min(...noCut.map((r) => r.aBox)))}〜${f3(Math.max(...noCut.map((r) => r.aBox)))}・粒の数で振る冪は ${f3(Math.min(...noCut.map((r) => r.aN)))}〜${f3(Math.max(...noCut.map((r) => r.aN)))} —— 2 つが離れる(斥力の分は示量でない)。`;
  F.b = 'B(比べる列): ' + J.b.map((c) => `${c.col} は倍 ${c.rows.filter((r) => r.inWin).map((r) => r.mult).join('・') || '—'} で窓の内` + (c.upperMult === null ? (c.allIn ? '(格子の全部が内)' : '') : `(上端の倍 ${f3(c.upperMult)} —— 格子の上の線形の内挿)`)).join('・') + '。';
  return F;
}
/** PAPER_PLAN の論文 5 の節の表 6c(短い表) */
export function table6c(J) {
  const S = J.summary;
  const head = ['| 組 | 密度への冪(箱で振る) | 密度への冪(粒の数で振る) | 温度への冪 | 窓 0.9〜1.1 |', '|---|---|---|---|---|'];
  const pick = ['G/c-/p0', 'P2s1/c-/p0', 'P2s1/c-/p1n3'].map((id) => ['a1', 'a3'].flatMap((k) => J[k]).find((r) => r.id === id)).filter(Boolean);
  const ins = S.inWin.map((id) => ['a1', 'a2', 'a3', 'a4'].flatMap((k) => J[k]).find((r) => r.id === id));
  return head.concat(pick.concat(ins).map((r) => `| ${r.id} | ${f3(r.aBox)} | ${f3(r.aN)} | ${f3(r.aT)} | ${r.inWin ? '内' : '外'} |`)).join('\n');
}

// 第353便zg(原仮定者の回答(2026-11-25 —— 第151報)「向きと幾何」・AN1045・AN1039・AN1034・統括の検証項目 R495):
// **正本 tests/out/equalradius-353zg.json から PHYSICS〔第353便zg〕の表と数の文を作る文書の lib**
// (QA docs.equalradius353zg が節の表と逐語で照合する —— 表の数は有効数字 3〜5 桁)。原文(言葉を変えずに引く)もここに持つ。
// ファイルを読まない・import しない。
export const DOC_VERSION = 'w353zg-equalradiusdoc-1';
const fe = (x, k = 2) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(k));
const ff = (x, n) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(n));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : (Math.abs(x) >= 1e-2 && Math.abs(x) < 1e3 ? Number(x.toPrecision(3)).toString() : fe(x)));
const sg = (x, k = 2) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : (x >= 0 ? '+' : '−') + Math.abs(x).toExponential(k));
const esc = (s) => String(s).replace(/\|/g, '/');
const HN = Object.freeze({ Jupiter: '木星', Saturn: '土星', Earth: '地球', Mars: '火星', Uranus: '天王星', Neptune: '海王星' });
const NN = Object.freeze({ 0: '倍なし', 2: '(1 − f)^(−2/3)', 5: '(1 − f)^(−5/3)' });
const EN = Object.freeze({ ringD: 'D 環', ringC: 'C 環', ringB: 'B 環', ringCD: 'カッシーニの間隙', ringA: 'A 環', ringF: 'F 環' });
const edgeName = (k) => { const [g, s] = k.split('-'); return `${EN[g] || g}の${s === 'in' ? '内縁' : '外縁'}`; };
const yn = (b) => (b ? '内' : '外');

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', '向きと幾何: これを採用『主の成分を太陽の自転の分・背景を太陽系の基準軸の向きに置くと、太陽の 5〜6° の傾きは円錐になり、金星で 1% まで打ち消します。』']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1045: 「規則の半径」。土星の環は、円盤引きずりが影響している。計算が合う方式を採用する。想定する基準は、引きずる側は「規則の半径と、扁平率」、引きずられる側は「観測半径と、構造の係数のノブ」']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1039: 角運動量の重み。計算が合う方式を採用する']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1034: 「金星で釣り合う」のは、金星の自転がロックした状態。逆回転は地球の影響であり、「金星は、自転に地球の影響が出るほどに釣り合っている」']),
]);
export const READINGS = Object.freeze([
  '主の列は局所 = 源の自転の分 (S)・背景 = (N+) 太陽系の基準軸の向き。金星では局所と背景がほぼ逆向きで、大きさが同じなら打ち消す。本節は「金星の局所の項と同じ大きさ」を 1 つの物差しに置き、木星と土星のまわりの半径 a を振って、局所の項が同じ大きさになる半径 a★(等大の半径)を数える',
  '引きずる側は規則の半径と扁平率。扁平率の入れ方は候補のまま(扁平の倍なし・(1 − f)^(−2/3)・(1 − f)^(−5/3) の 3 通り)で a★ の幅を出す。土星の環は円盤引きずりの題 —— 本節の環の行は、軸引きずりの合成の向きを環の半径で読んだ表で、環の形の材料ではない',
  '基準軸は角運動量の重み L(主の列)。a★ は大きさの比で決まり、基準軸と背景の向きに依らない。合成の軸の角は基準軸 L で読む',
  '「金星で釣り合う」の判定の量は〔第353便g〕〔第353便t〕の候補。本節は金星の局所の項の大きさだけを物差しに借りる(判定の量には使わない)',
]);
export function originalTable() {
  return '| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) |\n|---|---|---|---|\n'
    + ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${esc(READINGS[k])} |`).join('\n');
}

export function tablesOf(J) {
  const T = {}, t1 = J.t1, t2 = J.t2, t3 = J.t3, t4 = J.t4;
  { const S = J.pure.scenes, G = J.pure.gates;
    T.pure = '| 零試験・場面 | 値 | 門 |\n|---|---|---|\n' + [
      ['① 便の始めの数え直しの数(木星 a★ 4.0622e8・4.2164e8/土星 1.1870e8・1.2570e8/イオ ÷ a★ 1.038・カッシーニの間隙 ÷ a★ 1.010/イオの x 0.894142・0.99958)', `${fe(S.jup0, 4)}・${fe(S.sat0, 4)}・${ff(S.io0, 3)}・${ff(S.cd0, 3)}`, G.anchor7],
      ['② イオの道の半径の x が〔第353便z〕の `moonParts` の x と同じ(倍なし・n 5)', `${ff(S.zx0, 6)}・${ff(S.zx5, 5)}`, G.moonParts353z],
      ['③ 受け手の質量を 1e3 kg からイオの質量にしても x は同じ(規則の半径の自分の重みは受け手に依らない)', ff(S.xm, 6), G.recvMass],
      ['④ 入力の倍 1 の作り(太陽由来と金星を〔第353便p〕の `rotP` で)が lib の作りと同じ(木星・土星)', S.vsPert === 0 && S.vsPertS === 0 ? '0' : '< 1e-9', G.pertIdentity],
      ['⑤ 母天体由来 × a³ が a に依らない(冪 −3 —— a 3e8 と 6e8)', fe(S.p3), G.power3],
      ['⑥ 0.98 の列(局所に換算の係数 0.98 ÷ uV)の合成の軸が金星の条件の背景の列と同じ', S.col098 < 1e-15 ? '< 1e-15' : fe(S.col098), G.col098],
      ['⑦ 金星の局所 ÷ 背景の倍率が〔第352便v〕の uV と同じ', fe(S.uV, 6), G.uV352v],
      ['⑧ 閉じた形(太陽由来の分の 2 次の式まで)が二分の a★ と同じ・幾何の因子が木星と土星で同じ', `${fe(S.closed)}・${ff(S.gGeoJ, 6)}`, G.closed],
      ['⑨ 〔第338便d〕の土星の環の区分の中央が〔第334便a〕の半径と同じ(B・カッシーニの間隙・A —— C 環だけ 0.089% 違う)', S.edges.map((e) => (e === 0 ? '0' : fe(e))).join('・'), G.edges338d],
      ['⑩ 入力の拒否(a ≤ 0・m ≤ 0・行の無い母天体・作りの名・u ≤ 0・構造の無い母天体・入力の名・lib の作りに入力の倍)', `${S.rejects.filter(Boolean).length}/${S.rejects.length}`, G.rejects],
    ].map(([x, b, g]) => `| ${x} | ${b} | ${g ? '真' : '偽'} |`).join('\n'); }
  T.astar = '| 母天体 | 扁平の倍 | a★(m) | ÷ 観測の半径 | 入力の幅(二乗和の根 ÷ a★) | 1 つずつの最小〜最大(m) |\n|---|---|---|---|---|---|\n'
    + t1.flatMap((h) => h.cols.map((c) => `| ${HN[h.src]} | ${NN[c.n]} | ${fe(c.aStar, 4)} | ${ff(c.overRo, 3)} | ±${fe(c.relRss)} | ${fe(c.min, 5)}〜${fe(c.max, 5)} |`)).join('\n');
  T.widths = '| 母天体 | 入力(リポジトリの数 —— 文献の値・未照合) | 字 | 最後の桁の 1 つ分(相対) | a★ の動き(+1) | a★ の動き(−1) |\n|---|---|---|---|---|---|\n'
    + t1.map((h) => { const c = h.cols.find((q) => q.n === 5); return c.widths.map((w) => `| ${HN[h.src]} | ${w.name} | ${w.lit} | ${fe(w.relUnit)} | ${sg(w.dPlus)} | ${sg(w.dMinus)} |`).join('\n'); }).join('\n');
  T.structs = '| 母天体 | 構造(〔第334便a〕の半径 —— 文献の値・未照合) | 半径(m) | ÷ 観測の半径 | ' + t1[0].cols.map((c) => `÷ a★(${NN[c.n]})`).join(' | ') + ' | ' + t1[0].cols.map((c) => `x(${NN[c.n]})`).join(' | ') + ' | ±5% の内の入れ方 |\n|---|---|---|---|' + t1[0].cols.map(() => '---').join('|') + '|' + t1[0].cols.map(() => '---').join('|') + '|---|\n'
    + t1.flatMap((h) => h.structs.map((s) => `| ${HN[h.src]} | ${s.name} | ${fe(s.r, 4)} | ${ff(s.overRo, 2)} | ` + s.cells.map((c) => ff(c.ratio, 3)).join(' | ') + ' | ' + s.cells.map((c) => f3(c.x)).join(' | ') + ` | ${s.cells.filter((c) => c.in5).map((c) => NN[c.n]).join('・') || 'なし'} |`)).join('\n');
  T.closed = '| 母天体 | 扁平の倍 | a★(二分・m) | ÷ 観測の半径 | 母天体の内か | 冪だけの a★₀(m) | 冪だけの差 | 幾何の補正つきの差 | 太陽由来の分もの差 | 太陽由来 ÷ 金星(a★) |\n|---|---|---|---|---|---|---|---|---|---|\n'
    + t2.rows.map((r) => `| ${HN[r.src]} | ${NN[r.n]} | ${fe(r.a, 4)} | ${ff(r.overRo, 3)} | ${r.inside ? '母天体の内' : '外'} | ${fe(r.a0, 4)} | ${sg(r.d0)} | ${sg(r.dGeo)} | ${sg(r.dSun)} | ${fe(r.sunOverV)} |`).join('\n');
  T.others = '| 母天体 | 構造 | 半径 ÷ 観測の半径 | 半径 ÷ a★ | x | 太陽由来 ÷ 母天体由来 |\n|---|---|---|---|---|---|\n'
    + t2.structs.map((s) => (s.items.length ? s.items.map((i) => `| ${HN[s.src]} | ${i.name} | ${ff(i.overRo, 2)} | ${f3(i.ratio)} | ${f3(i.x)} | ${fe(i.sunOverPar)} |`).join('\n') : `| ${HN[s.src]} | (リポジトリに衛星と環の半径の行が無い) | — | — | — | — |`)).join('\n');
  T.prob = '| 母天体 | 幅 | 構造の置き方 | 構造の数(観測の半径の 1〜30 倍) | 見込み(区間の和 ÷ 対数の幅) | 重なりを数えない和 | a★ が或る構造の ±幅に入るか(倍なし・n 2・n 5) |\n|---|---|---|---|---|---|---|\n'
    + t3.hosts.flatMap((h) => h.probs.flatMap((p) => [['rep', '代表の半径'], ['repEdges', '代表の半径 + 環の区分の縁']].filter(([k]) => h.src === 'Saturn' || k === 'rep').map(([k, nm]) =>
      `| ${HN[h.src]} | ±${p.tol * 100}% | ${nm} | ${p[k].n} | ${ff(p[k].p, 4)} | ${ff(p[k].pSum, 4)} | ${p.hits.map((q) => yn(q[k])).join('・')} |`))).join('\n')
    + '\n' + t3.both.map((b) => `| 木星と土星の両方(積) | ±${b.tol * 100}% | 代表の半径/土星に縁を足す | — | ${ff(b.rep, 4)}/${ff(b.repEdges, 4)} | — | — |`).join('\n');
  const axRow = (g, nm) => `| ${nm} | ${ff(g.overRo, 2)} | ${f3(g.x)} | ${ff(g.angAnti, 2)} | ${ff(g.angSpin, 2)} | ${ff(g.angRef, 2)} | ${ff(g.angRef098, 2)} | ${f3(g.magOverBg)} |`;
  const axHead = '| 母天体・半径 | ÷ 観測の半径 | x | 合成と −自転軸 ° | 合成と自転軸 ° | 合成と基準軸 °(金星の条件の背景) | 合成と基準軸 °(0.98 + 換算の係数) | 合成 ÷ 背景 |\n|---|---|---|---|---|---|---|---|\n';
  T.axisGrid = axHead + t4.flatMap((h) => h.grid.map((g) => axRow(g, `${HN[h.src]}・格子`))).join('\n');
  T.axisStruct = axHead + t4.flatMap((h) => [...h.structs.map((g) => axRow(g, `${HN[h.src]}・${g.name}`)), ...h.edges.filter((e, k, a) => k === 0 || e.a !== a[k - 1].a).map((g) => axRow(g, `${HN[h.src]}・${edgeName(g.key)}`))]).join('\n');
  T.halves = '| 母天体 | 扁平の倍 | 軸が半分替わる半径(m) | a★(m) | 比 − 1 | 角が局所の 0.9 倍の半径 ÷ a★ | 0.1 倍の半径 ÷ a★ | 自転軸と基準軸の角 ° | 局所と基準軸の角 °(a★) |\n|---|---|---|---|---|---|---|---|---|\n'
    + t4.flatMap((h) => h.halves.map((q) => { const g0 = h.grid[0]; return `| ${HN[h.src]} | ${NN[q.n]} | ${fe(q.aHalf, 5)} | ${fe(q.aStar, 5)} | ${sg(q.ratio - 1)} | ${ff(q.r90, 3)} | ${ff(q.r10, 3)} | ${ff(g0.angSpinRef, 2)} | ${ff(g0.angLocRef, 2)} |`; })).join('\n');
  return T;
}
/** 数の文(節に逐語) */
export function factsOf(J) {
  const t1 = J.t1, t2 = J.t2, t3 = J.t3, t4 = J.t4, H = (s) => t1.find((h) => h.src === s), st = (s, k) => H(s).structs.find((q) => q.key === k), cl = (s, n) => t2.rows.find((r) => r.src === s && r.n === n);
  const hits = (s, k) => t3.hosts.find((h) => h.src === s).probs[k].hits, hit2 = (s) => hits(s, 1).filter((q) => q.rep).map((q) => NN[q.n]).join('・') || 'なし';
  const both2 = hits('Jupiter', 1).filter((q, k) => q.rep && hits('Saturn', 1)[k].rep).map((q) => q.n);
  const rw = (s) => Math.abs(H(s).cols[2].aStar / H(s).cols[0].aStar - 1) / H(s).cols[0].relRss, inside = t2.rows.filter((r) => r.n === 0 && !r.inside).map((r) => HN[r.src]);
  const io = st('Jupiter', 'io'), cd = st('Saturn', 'satCD'), ax = (s) => t4.find((h) => h.src === s), edge = (k) => ax('Saturn').edges.find((e) => e.key === k);
  return {
    astar: `木星の a★ は ${H('Jupiter').cols.map((c) => fe(c.aStar, 4)).join('・')} m(観測の半径の ${H('Jupiter').cols.map((c) => ff(c.overRo, 2)).join('・')} 倍 —— 扁平の倍なし・n 2・n 5)、土星の a★ は ${H('Saturn').cols.map((c) => fe(c.aStar, 4)).join('・')} m(${H('Saturn').cols.map((c) => ff(c.overRo, 2)).join('・')} 倍)。イオの道の半径 ÷ a★ は ${io.cells.map((c) => ff(c.ratio, 3)).join('・')}、カッシーニの間隙の半径 ÷ a★ は ${cd.cells.map((c) => ff(c.ratio, 3)).join('・')}。`,
    width: `入力 6 つの最後の桁 ±1 で動く a★ は、二乗和の根で木星 ±${fe(H('Jupiter').cols[0].relRss)}・土星 ±${fe(H('Saturn').cols[0].relRss)}(相対 —— 木星は質量の字 1.898e27 が主)で、扁平の倍の入れ方 3 通りの差(木星 ${ff((H('Jupiter').cols[2].aStar / H('Jupiter').cols[0].aStar - 1) * 100, 1)}%・土星 ${ff((H('Saturn').cols[2].aStar / H('Saturn').cols[0].aStar - 1) * 100, 1)}%)の ${ff(rw('Jupiter'), 0)} 分の 1・${ff(rw('Saturn'), 0)} 分の 1。入力の幅の内に入る構造は、n 5 のイオだけ(${io.cells.filter((c) => c.inRss).map((c) => NN[c.n]).join('・') || 'なし'})。`,
    closed: `a★ の冪だけの形 a_金星 ×(M ÷ M_太陽)×(ω ÷ ω_太陽)^(1/3)× σ^(1/3) は、二分の a★ と木星で ${sg(cl('Jupiter', 0).d0)}・土星で ${sg(cl('Saturn', 0).d0)} 違い、金星の位置の幾何の因子(${ff(cl('Jupiter', 0).gGeo, 5)} —— 母天体に依らない)と太陽由来の分(2 次の式)を足すと ${sg(cl('Jupiter', 0).dSun)}・${sg(cl('Saturn', 0).dSun)} の内。地球・火星・天王星・海王星の a★ は観測の半径の ${['Earth', 'Mars', 'Uranus', 'Neptune'].map((s) => ff(cl(s, 0).overRo, 3)).join('・')} 倍で、${['Earth', 'Mars', 'Uranus', 'Neptune'].every((x) => t2.rows.find((r) => r.src === x).inside) ? 'どれも母天体の内' : '外に出るものが在る'}(外に出るのは ${inside.join('・')})。月の道は地球の a★ の ${f3(t2.structs.find((s) => s.src === 'Earth').items[0].ratio)} 倍で、x は ${f3(t2.structs.find((s) => s.src === 'Earth').items[0].x)}(太陽由来が主)。`,
    prob: `a★ を観測の半径の 1〜30 倍に対数で一様に置くと、或る構造の ±5% に入る見込みは木星 ${ff(t3.hosts[0].probs[0].rep.p, 3)}・土星 ${ff(t3.hosts[1].probs[0].rep.p, 3)}(代表の半径 —— 土星に環の区分の縁を足すと ${ff(t3.hosts[1].probs[0].repEdges.p, 3)})、両方で ${ff(t3.both[0].rep, 4)}〜${ff(t3.both[0].repEdges, 4)}。±2% では両方で ${ff(t3.both[1].rep, 4)}〜${ff(t3.both[1].repEdges, 4)}。±2% に入る扁平の倍は木星 ${hit2('Jupiter')}・土星 ${hit2('Saturn')} で、両方が入る入れ方は ${both2.length ? both2.map((n) => NN[n]).join('・') : '無い'}。概算 —— 置き方と構造の数え方に依る。`,
    axis: `合成の軸と基準軸の角は、a★ より内では局所の向き(木星 ${ff(ax('Jupiter').grid[0].angLocRef, 1)}°・土星 ${ff(ax('Saturn').grid[0].angLocRef, 1)}° —— 自転軸の逆の近く)に寄り、外では基準軸へ寄る。軸が半分替わる半径は a★ と ${sg(ax('Jupiter').halves[0].ratio - 1)}(木星)・${sg(ax('Saturn').halves[0].ratio - 1)}(土星)の差で、等大のときに合成が 2 本の二等分の向きになる形。角が局所の 0.9 倍から 0.1 倍まで替わる半径は a★ の ${ff(ax('Jupiter').halves[0].r90, 2)}〜${ff(ax('Jupiter').halves[0].r10, 2)} 倍(木星)・${ff(ax('Saturn').halves[0].r90, 2)}〜${ff(ax('Saturn').halves[0].r10, 2)} 倍(土星)。土星では A 環の外縁で ${ff(edge('ringA-out').angRef, 1)}°・F 環で ${ff(edge('ringF-in').angRef, 1)}°・カッシーニの間隙の中央で ${ff(cd ? ax('Saturn').structs.find((q) => q.key === 'satCD').angRef : NaN, 1)}°。木星ではイオで ${ff(ax('Jupiter').structs.find((q) => q.key === 'io').angRef, 1)}°・エウロパで ${ff(ax('Jupiter').structs.find((q) => q.key === 'europa').angRef, 2)}°。0.98 の列(換算の係数つき)は同じ角。`,
  };
}

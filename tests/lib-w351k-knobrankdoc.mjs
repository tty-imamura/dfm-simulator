// 第351便k(原仮定者の整理(2026-11-23 —— 第146報)・原仮定者の回答(2026-11-24 —— 第147報)・統括の検証項目 R437):
// **正本 tests/out/knobrank-351k.json から PHYSICS〔第351便k〕の表を作る文書の lib**
// (QA docs.knobrank351k が節の表と逐語で照合する —— 表の数は有効数字 3 桁・比は小数 3〜4 桁)。原文(言葉を変えずに引く)と読みの表もここに持つ。
export const DOC_VERSION = 'w351k-knobrankdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
const f2 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(2));
const f8 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(8));
const sm = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Math.abs(x) < 1e-12 ? '< 1e-12' : Number(x).toExponential(2));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const qs = (q) => (q >= 1000 ? Number(q).toExponential(0) : String(q));
const NM = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Moon: '月', Sun: '太陽', EarthHi: '地球(傾きの最大の位相)' });
const KN = Object.freeze({ k: 'k', cRii: 'c_R (ii)', cRi: 'c_R (i)', f: 'f', u: 'u' });
const ON = Object.freeze({ prec: '歳差の率', raise: '起こす率', delta: 'δ', spin: '平行成分', heat: '熱の式の形' });
const PN = Object.freeze({ M: '(M)', S: '(S)', MS: '(MS)' });
const ST = Object.freeze({ one: '1 つ', none: '交わらない', many: '複数', flat: '平ら', edge: '格子の端', nodata: '比べる数なし' });
const GN = Object.freeze({ all: '(全)', group: '(組)', body: '(個)' });
const SETN = Object.freeze({ all: '全体', rock: '岩石', moon: '衛星' });

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の整理(2026-11-23 —— 第146報)', '天体の構造別に軸引きずりの利き方に差異が予想され、観測半径に対する引きずられ半径の係数がノブの候補。構造別の参考値を用意しつつ、天体の構造を分析する為に、個別にフィットする']),
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第147報)', 'AN1000: C2で進める。係数はノブにする']),
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第147報)', 'つまり、両方の経路が有り、比率は天体の構造などに起因するので、ノブにする']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['構造の係数 c_R(引きずられ半径 ÷ 観測半径)を 1 つずつ振って「要る値」を並べる診断(個別の当てはめは構造を見るための診断 —— 較正の合格ではない)。入り方は (ii) 自分の重みの球の半径も・(i) 腕だけ(平均の球の半径だけ)', '表 2・表 8・表 9']),
  Object.freeze(['換算の係数 k(既定 1)は局所の項(太陽・母天体由来の (C2))にだけ掛ける —— 宣言した背景の角速度 u には掛けない。c_R とは同時に当てはめない', '表 2〜表 8']),
  Object.freeze(['経路の比率 f(第351便d の (N1)(N2))は経路 ① ② の比を動かす —— 値は選ばない(感度は f 0.5 の点で取る)', '表 2・表 4']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, Cm = J.decl.common, A = J.decl.anchor;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 共通の点検の数(自転しない源の通過 —— x の直径の 2 点の差分・6 点の平均・(W) の z 成分、統括の数え直しの数 ${Cm.p2x}・${Cm.p6}・${Cm.w} と 5e-9 の内) | ${f8(S.common.p2x)}・${f8(S.common.p6)}・${f8(S.common.w)} | ${tf(G.common)} |`,
    `| ② 書き直した口 \`partRotQ\`(規則の半径)と第351便c の \`partRot\`(read 'C2')・\`pairParts\`(月の母天体の項)の相対の差(床 < 1e-12) | ${sm(S.same)} | ${tf(G.partSame)} |`,
    `| ③ 分母に銀河の重みを入れた (ii) と第351便b の \`c2BallPair\`(自分の重みの球の半径 = q × 規則の半径・地球 q 0.4・10)の相対の差 | ${sm(S.cb)} | ${tf(G.c2ballSame)} |`,
    `| ④ 統括の数え直しの数: 地球 (MS) の大きさ (W)・(C2)(分母に銀河の重み)・背景だけの起こす率 [″/年](${A.msWAsYr}・${A.msC2AsYr}・${A.bgRaiseAsYr}) | ${fe(S.anc.msW)}・${fe(S.anc.msC2)}・${fe(S.anc.bgRaise)} | ${tf(G.anchor)} |`,
    `| ⑤ 観測量の式: 歳差の率は第348便c の \`precess\` と同じ(k₂ 1)・起こす率は第351便c の \`raiseRate\`(k₁ Ω⊥)と同じ・δ も同じ | ${sm(S.fx.prec)}・${sm(S.fx.raise)}・${sm(S.fx.deltaVsPrecess)} | ${tf(G.obsForms)} |`,
    `| ⑥ 比の不変: 背景 0 で k を 2 倍しても 起こす率 ÷ 歳差の率 と δ は同じ・(u, k) を同じ倍にすると δ は同じで歳差の率は 2 倍 | ${sm(S.inv.ratioK)}・${sm(S.inv.deltaK)}・${sm(S.inv.deltaUK)}・${sm(S.inv.precUK)} | ${tf(G.invariance)} |`,
    `| ⑦ 特異値の自己試験(階数 2 の 3 × 3 —— 物差し 1e-6・最小 ÷ 最大の床は 1e-8 の桁・対角 4 と 3) | ${S.svT.rank2}・${fe(S.svT.min)} | ${tf(G.svd)} |`,
    `| ⑧ 当てはめの道具(第350便f の \`solveOne\`・\`solveJoint\` を本枝の刻みで): 冪 2 の解 2・端・平ら | ${f3(S.sol.powC)}・${ST[S.sol.edge]}・${ST[S.sol.flat]} | ${tf(G.solver)} |`,
    `| ⑨ 順位の相関の自己試験(同じ順 1・逆の順 −1・4 つの並べ替えで abs(ρ) = 1 になる割合 2 ÷ 4! ) | ${f3(S.sp.same)}・${f3(S.sp.rev)}・${f3(S.sp.perm4)} | ${tf(G.spearman)} |`,
    `| ⑩ 入力の拒否(成分の名・半径 0・入り方の名・c_R −1・Ω の長さ 2・k₁ NaN) | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  T.sens = ['| 天体 | 成分 | 背景の倍率 u(基準) | ノブ | 階数(物差し 1e-3・1e-6) | 決まらないノブの組の数(1e-3・1e-6) | 観測量 1 つだけで決まらない数: 歳差の率・起こす率・δ・平行成分・熱の式の形 | 特異値 ÷ 最大 |', '|---|---|---|---|---|---|---|---|',
    ...J.sens.map((r) => `| ${NM[r.id]} | ${PN[r.part]} | ${r.u} | ${r.knobs.map((k) => KN[k]).join('・')} | ${r.rank.join('・')} | ${r.undetermined.join('・')} | ${r.singleUndetermined.join('・')} | ${r.svRel.map(fe).join('・')} |`)].join('\n');
  const colRow = (r, o) => { const i = J.decl.obs.indexOf(o); return `| ${NM[r.id]} | ${PN[r.part]} | ${r.u} | ${ON[o]} | ${['k', 'cRii', 'cRi'].map((k) => f3(r.cols[k][i])).join('・')}・${f3(r.cRiDown[i])} | ${f3(r.cols.f[i])} | ${r.cols.u ? f3(r.cols.u[i]) : '—'} |`; };
  T.cols = ['| 天体 | 成分 | u | 観測量 | ∂ln ÷ ∂ln: k・c_R (ii)・c_R (i) の上側・(i) の下側 | f(N1・f 0.5) | u |', '|---|---|---|---|---|---|---|',
    ...J.sens.filter((r) => r.part === 'MS' || (r.part === 'S' && r.u === 1)).flatMap((r) => J.decl.obs.map((o) => colRow(r, o)))].join('\n');
  T.ratio = ['| 天体 | 成分 | u | 起こす率 ÷ 歳差の率(f 0.5・N1) | 閉じた形 (k₁ ÷ k₂)(Ω⊥·n) ÷ (sin ε abs(Ω)) との差 | 広がり: k 0.5・1・2 | 広がり: c_R (ii) q 0.4〜100 | 広がり: u 0.5・2 | f の依存 f ÷ (1 − f) との差: (N1)・(N2) |', '|---|---|---|---|---|---|---|---|---|',
    ...J.ratio.map((r) => `| ${NM[r.id]} | ${PN[r.part]} | ${r.u} | ${f3(r.ratio)} | ${sm(r.closed)} | ${sm(r.kSpread)} | ${sm(r.qSpread)} | ${r.uSpread === null ? '—' : sm(r.uSpread)} | ${sm(r.fN1)}・${sm(r.fN2)} |`)].join('\n');
  T.kcr = ['| 天体 | q | c_R | (ii) ÷ k(局所の大きさ) | 第351便b の c2BallPair との相対の差 | 向きの差 [°] |', '|---|---|---|---|---|---|',
    ...J.kcr.map((r) => `| ${NM[r.id]} | ${qs(r.q)} | ${fe(r.cR)} | ${f3(r.iiOverK)} | ${sm(r.vsC2Ball)} | ${sm(r.dirDeg)} |`)].join('\n');
  T.moon = ['| q(c_R ÷ 規則の比) | c_R | 母天体由来 ÷ 太陽由来 | 太陽由来 [rad/年] | 母天体由来 [rad/年] | 合成と太陽由来の向きの差 [°] |', '|---|---|---|---|---|---|',
    ...J.moon.map((r) => `| ${qs(r.q)} | ${fe(r.cR)} | ${fe(r.parOverSun)} | ${fe(r.sunYr)} | ${fe(r.parYr)} | ${fe(r.dirDeg)} |`)].join('\n');
  T.uk = ['| 天体 | 成分 | u | k | k ÷ u | δ [°] | 歳差の率 [″/年](経路 ② だけ) |', '|---|---|---|---|---|---|---|',
    ...J.uk.map((r) => `| ${NM[r.id]} | ${PN[r.part]} | ${r.u} | ${r.k} | ${r.kOverU} | ${f3(r.delta)} | ${fe(r.prec)} |`)].join('\n');
  const SETS = ['歳差の率', '+ δ', '+ 起こす率', '+ 起こす率 + δ', '5 つ全部'];
  T.pair = ['| 天体 | ノブの組 | 2 列の小さい特異値 ÷ 大きい特異値: ' + SETS.join('・') + ' | 分かれる最小の集まり(比 > 1e-3) |', '|---|---|---|---|',
    ...J.pair.map((r) => { const k = r.ratio.findIndex((x) => x !== null && x > 1e-3); return `| ${NM[r.id]} | ${KN[r.pair[0]]} と ${KN[r.pair[1]]} | ${r.ratio.map(fe).join('・')} | ${k < 0 ? '分かれない' : SETS[k]} |`; })].join('\n');
  T.fit = ['| ノブ | 成分 | u | 月 | 段 | 組 | 天体の数・自由度 | 状態 | 要る値 | 残差 ln(模型 ÷ 比べる数)(全・組だけ) | 既定の点の歳差の率 ÷ 比べる数(個だけ) |', '|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.fit.map((r) => `| ${KN[r.knob]} | ${PN[r.part]} | ${r.u} | ${r.moon === 'in' ? '入れる' : '外す'} | ${GN[r.level]} | ${r.level === 'body' ? NM[r.set] + (r.role && r.role !== 'lit' ? '(役割 桁)' : '') : SETN[r.set]} | ${r.n}・${r.dof === null ? '—' : r.dof} | ${ST[r.status] || r.status} | ${fe(r.c)} | ${r.level !== 'body' && r.resid ? r.resid.map(f2).join('・') : '—'} | ${r.level === 'body' ? fe(r.model1 / r.obsAsYr) : '—'} |`)].join('\n');
  T.corr = ['| ノブ | 成分 | u | 天体(要る値が 1 つの天体だけ) | n | 順位の相関 ρ: 密度・観測半径・自転の率 | 並べ替えの数 n! ・abs(ρ) = 1 の割合 2 ÷ n! |', '|---|---|---|---|---|---|---|',
    ...J.corr.map((r) => `| ${KN[r.knob]} | ${PN[r.part]} | ${r.u} | ${r.ids.map((id) => NM[id]).join('・') || '—'} | ${r.n} | ${J.decl.props.map((p) => f3(r.rho[p])).join('・')} | ${r.nPerm}・${r.pAll === null ? '—' : f3(r.pAll)} |`)].join('\n');
  T.props = ['| 天体 | 平均の密度 [kg/m³] | 観測半径 [m] | 自転の率 abs(ω) [rad/s] |', '|---|---|---|---|', ...J.props.map((r) => `| ${NM[r.id]} | ${fe(r.density)} | ${fe(r.radius)} | ${fe(r.spin)} |`)].join('\n');
  return T;
}
/** 数の文(節に逐語) */
export function factsOf(J) {
  const F = {}, S = J.pure.scenes;
  const sr = (id, part, u) => J.sens.find((r) => r.id === id && r.part === part && r.u === u);
  const e0 = sr('Earth', 'MS', 0), e1 = sr('Earth', 'MS', 1), m1 = sr('Mars', 'MS', 1), v1 = sr('Venus', 'MS', 1), es1 = sr('Earth', 'S', 1);
  F.rank = `階数(物差し 1e-3・1e-6): (MS)・u 0 は 3 天体とも ${e0.rank.join('・')}(ノブ 4)・(MS)・u 1 は 地球 ${e1.rank.join('・')}・火星 ${m1.rank.join('・')}・金星 ${v1.rank.join('・')}(ノブ 5)・(S)・u 1 は 地球 ${es1.rank.join('・')}。観測量 1 つだけでは、どの天体・どの基準でもノブの数 − 1 以上の組が決まらない`;
  const iP = J.decl.obs.indexOf('prec'), iR = J.decl.obs.indexOf('raise');
  F.cols = `地球・(MS)・u 1 の歳差の率の感度: k ${f3(e1.cols.k[iP])}・c_R (ii) ${f3(e1.cols.cRii[iP])}・c_R (i) ${f3(e1.cols.cRi[iP])}・f ${f3(e1.cols.f[iP])}・u ${f3(e1.cols.u[iP])}/起こす率の感度: k ${f3(e1.cols.k[iR])}・f ${f3(e1.cols.f[iR])}・u ${f3(e1.cols.u[iR])}`;
  const r0 = J.ratio.filter((r) => r.u === 0), r1m = J.ratio.filter((r) => r.u === 1 && r.part === 'MS');
  F.ratio = `(あ) 起こす率 ÷ 歳差の率: u 0 では k の広がり ${sm(Math.max(...r0.map((r) => r.kSpread)))}・c_R (ii) の広がり (MS) ${sm(Math.max(...r0.filter((r) => r.part === 'MS').map((r) => r.qSpread)))}・(S) ${fe(Math.max(...r0.filter((r) => r.part === 'S').map((r) => r.qSpread)))}/u 1・(MS) では k の広がり 地球 ${fe(r1m.find((r) => r.id === 'Earth').kSpread)}・火星 ${fe(r1m.find((r) => r.id === 'Mars').kSpread)}・金星 ${fe(r1m.find((r) => r.id === 'Venus').kSpread)}`;
  const kq = (id, q) => J.kcr.find((r) => r.id === id && r.q === q), mo = (q) => J.moon.find((r) => r.q === q);
  F.kcr = `(い) 地球の (ii) ÷ k は q 100 で ${f3(kq('Earth', 100).iiOverK)}・q 1e4 で ${f3(kq('Earth', 1e4).iiOverK)}・q 1e6 で ${f3(kq('Earth', 1e6).iiOverK)}(第351便b の表との差の最大 ${sm(J.kcrVs351b)})。月の母天体由来 ÷ 太陽由来は q 1 で ${fe(mo(1).parOverSun)}・q 100 で ${fe(mo(100).parOverSun)}・q 1e6 で ${fe(mo(1e6).parOverSun)}(k では q に依らない)`;
  const uk = (id, u, k) => J.uk.find((r) => r.id === id && r.part === 'MS' && r.u === u && r.k === k);
  F.uk = `(う) 火星・(MS): (u, k) = (1, 1) で δ ${f3(uk('Mars', 1, 1).delta)}°・(2, 2) で ${f3(uk('Mars', 2, 2).delta)}°・(1, 2) で ${f3(uk('Mars', 1, 2).delta)}°・(0.5, 1) で ${f3(uk('Mars', 0.5, 1).delta)}° —— 向きは k ÷ u だけで決まる`;
  const fb = (knob, part, u, set) => J.fit.find((r) => r.knob === knob && r.part === part && r.u === u && r.moon === 'out' && r.level === 'body' && r.set === set);
  const fa = (knob, part, u, level, set, moon = 'out') => J.fit.find((r) => r.knob === knob && r.part === part && r.u === u && r.moon === moon && r.level === level && r.set === set);
  F.fitK = `要る k(成分 (MS)・u 0・月を外す): 水星(役割 桁)${fe(fb('k', 'MS', 0, 'Mercury').c)}・金星 ${fe(fb('k', 'MS', 0, 'Venus').c)}・地球 ${fe(fb('k', 'MS', 0, 'Earth').c)}・火星 ${fe(fb('k', 'MS', 0, 'Mars').c)}・(全)${fe(fa('k', 'MS', 0, 'all', 'all').c)}/成分 (S): 金星 ${fe(fb('k', 'S', 0, 'Venus').c)}・地球 ${fe(fb('k', 'S', 0, 'Earth').c)}・火星 ${fe(fb('k', 'S', 0, 'Mars').c)}/月を入れた (全)(MS)${fe(fa('k', 'MS', 0, 'all', 'all', 'in').c)}・月だけ ${fe(J.fit.find((r) => r.knob === 'k' && r.part === 'MS' && r.u === 0 && r.moon === 'in' && r.set === 'Moon').c)}`;
  F.fitC = `要る c_R (ii)(成分 (MS)・u 0・月を外す): 金星 ${fe(fb('cRii', 'MS', 0, 'Venus').c)}・地球 ${fe(fb('cRii', 'MS', 0, 'Earth').c)}・火星 ${fe(fb('cRii', 'MS', 0, 'Mars').c)}・(全) は${ST[fa('cRii', 'MS', 0, 'all', 'all').status]}/成分 (S)・u 0 の (個) は 4 天体とも${ST[fb('cRii', 'S', 0, 'Earth').status]}・u 1 は${ST[fb('cRii', 'S', 1, 'Earth').status]}`;
  const cr = J.corr.find((r) => r.knob === 'k' && r.part === 'MS' && r.u === 0 && !r.withMercury);
  F.corr = `順位の相関(要る k・(MS)・u 0・${cr.ids.map((id) => NM[id]).join('・')}): 密度 ${f3(cr.rho.density)}・観測半径 ${f3(cr.rho.radius)}・自転の率 ${f3(cr.rho.spin)}(n ${cr.n} —— 並べ替え ${cr.nPerm} 通りで abs(ρ) = 1 の割合 ${f3(cr.pAll)})`;
  F.common = `共通の点検の数(自転しない源の通過): x の直径の 2 点の差分 ${f8(S.common.p2x)}・6 点の平均 ${f8(S.common.p6)}・(W) ${f8(S.common.w)}。地球 (MS) の大きさ (W) ${fe(S.anc.msW)}・(C2) ${fe(S.anc.msC2)}″/年・背景だけの起こす率 ${fe(S.anc.bgRaise)}″/年`;
  return F;
}

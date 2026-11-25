// 第353便c(原仮定者の回答(2026-11-25 —— 第151報)AN1045・向きと幾何の採用・統括の検証項目 R467):
// **正本 tests/out/recvradius-353c.json から PHYSICS〔第353便c〕の表を作る文書の lib**
// (QA docs.recvradius353c が節の表と逐語で照合する —— 表の数は有効数字 3 桁)。原文(言葉を変えずに引く)と読みの表もここに持つ。
export const DOC_VERSION = 'w353c-recvradiusdoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fe = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const fp = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Math.abs(x) >= 1e-3 && Math.abs(x) < 1e4 ? Number(x).toPrecision(3) : Number(x).toExponential(2));
const fd = (x) => (!fin(x) ? '—' : Math.abs(x) < 1e-3 ? '< 0.001' : Number(x).toFixed(3));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const sg = (x) => (x > 0 ? '+' : x < 0 ? '−' : '0');
const PLN = Object.freeze({ field: '(P-場)', avg: '(P-平)', resp: '(P-応)', rule: '規則の半径' });
const JA = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星', Moon: '月', Io: 'イオ', Pluto: '冥王星', Charon: 'カロン',
  Sun: '太陽', EarthHi: '地球', EarthLo: '地球' });
const pairJa = (p) => { const [a, b] = p.split('|'); return JA[a] + ' ← ' + JA[b]; };
const cRs = (x) => (x === null ? '規則' : fp(x));

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1045: 「規則の半径」。土星の環は、円盤引きずりが影響している。計算が合う方式を採用する。想定する基準は、引きずる側は「規則の半径と、扁平率」、引きずられる側は「観測半径と、構造の係数のノブ」']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', '向きと幾何: これを採用『主の成分を太陽の自転の分・背景を太陽系の基準軸の向きに置くと、太陽の 5〜6° の傾きは円錐になり、金星で 1% まで打ち消します。』']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['受け手(引きずられる側)の半径の主の列 = 観測半径 × 構造の係数のノブ。式のどこに入れるかは決まっていない —— 入れ方の候補 3 つ((P-場)・(P-応)・(P-平))を同じ重さで数える。規則の半径の列は比べる列', '表 3〜表 8']),
  Object.freeze(['採用された幾何 = (S)・(N+)・基準軸 L。金星の打ち消し(規則の半径で等大の残り 1.3%)が、受け手の半径の入れ方でどれだけ残るかを数える(両立するかの表 —— 判定ではない)', '表 3・表 4・表 7']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 基準軸 L(黄道 J2000)と eq との角・ω_G | ${S.L.map((x) => x.toFixed(6)).join(', ')}・${fp(S.LeqDeg)}°・${fe(S.omegaG)} rad/s | ${tf(G.refAxisL)} |`,
    `| ② 統括の数え直し 3 の金星の 6 行(等大の倍率 ÷ k・φ・等大の残り・A0・wS・c_R 1 の下限) | ${S.venus.length} 行 | ${tf(G.venus6)} |`,
    `| ③ 8 惑星の φ(規則 → (P-場) c_R 1 —— 有効数字 5 桁) | ${Object.keys(S.phi8).length} 惑星 | ${tf(G.phi8)} |`,
    `| ④ (P-場) = 第352便k の spinRot の cR・(P-応) の向き = 規則の半径・(P-平) で平均の球 = 規則の半径なら規則の半径(相対差) | ${fe(S.vsK)}・${fe(S.vsResp)}・${fe(S.vsAvg)} | ${tf(G.places)} |`,
    `| ⑤ cR★(金星: A0 = wS —— 二分と閉じた形 A0(1) ÷ wS) | ${fp(S.cs.cR)} | ${tf(G.cRStar)} |`,
    `| ⑥ (P-応) の倍: c = c_ref・R_ref 観測で 1・R_ref 規則で (規則 ÷ 観測)²・係数の無い天体は値なし | ${fp(S.m1)}・${fe(S.m2)} | ${tf(G.rateMult)} |`,
    `| ⑦ 残りの式(φ 60° で 2 sin(φ/2) = 1・sin φ = √3/2) | ${fp(S.r60.e)}・${fp(S.r60.m)} | ${tf(G.residForms)} |`,
    `| ⑧ 拒否(入れ方の名・c_R 0・(P-平) の源の半径・背景の名・基準軸の名・係数・物差しの名・倍率) | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  // 表 3: 金星 —— 入れ方 × c_R
  const v = (place, cR) => J.t1.find((r) => r.place === place && r.cR === cR);
  T.venus = ['| c_R | (P-場) φ° | (P-場) 等大の残り | (P-場) 下限 | (P-平) φ° | (P-平) 等大の残り | (P-平) 下限 | (P-応) φ° | (P-応) 等大の残り | 自分の重み ÷ 源の重み((P-場)) | 比べる列: (P-場) eq の残り | 比べる列: (P-場) (G−) の残り |', '|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.decl.cRGrid.map((cR) => { const a = v('field', cR), b = v('avg', cR), c = v('resp', cR);
      return `| ${fp(cR)} | ${fp(a.phiDeg)} | ${fp(a.residEqual)} | ${fp(a.residMin)} | ${fp(b.phiDeg)} | ${fp(b.residEqual)} | ${fp(b.residMin)} | ${fp(c.phiDeg)} | ${fp(c.residEqual)} | ${fe(a.A0overWS)} | ${fp(a.residEq)} | ${fp(a.residGm)} |`; })].join('\n');
  // 表 4: 帯の端
  const bd = (place, axis, band) => J.bands.rows.find((r) => r.place === place && r.axis === axis && r.band === band), be = (r) => (r.cR === null ? (r.below ? '格子の下端で既に越える' : '1 まで越えない') : fp(r.cR));
  T.bands = ['| 入れ方 | 基準軸 L: 残り 2% 以下の c_R の上端 | L: 5% 以下の上端 | 比べる列: eq 2% | eq 5% |', '|---|---|---|---|---|',
    ...['field', 'avg', 'resp'].map((p) => `| ${PLN[p]} | ${be(bd(p, 'L', 0.02))} | ${be(bd(p, 'L', 0.05))} | ${be(bd(p, 'eq', 0.02))} | ${be(bd(p, 'eq', 0.05))} |`)].join('\n');
  // 表 5: 全部の受け手
  T.pairs = ['| 組(受け手 ← 源) | 規則の半径 ÷ 観測半径 | cR★(A0 = wS) | 自分の重み ÷ 源の重み: 規則 | 同: c_R 1 | φ°: 規則 | φ°: (P-場) 1 | φ°: (P-平) 1 | 等大の残り: 規則 | 同: (P-場) 1 | abs(S) の比(c_R 1 ÷ 規則) |', '|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.t2.map((r) => `| ${pairJa(r.pair)} | ${fe(r.ruleOverObs)} | ${fp(r.cRStar)} | ${fe(r.selfOverSrcRule)} | ${fp(r.selfOverSrc1)} | ${fp(r.phiRule)} | ${fp(r.phiField1)} | ${fp(r.phiAvg1)} | ${fp(r.resRule)} | ${fp(r.resField1)} | ${fe(r.sRatio)} |`)].join('\n');
  // 表 6: イオ
  const io = (place, cR) => J.io.find((r) => r.place === place && r.cR === cR), r0 = io('rule', null);
  T.io = ['| c_R | (P-場) x(abs(S_イオ ← 木星) ÷ abs(S_金星 ← 太陽)) | (P-場) イオの φ° | (P-場) イオの等大の残り | (P-平) x | (P-平) φ° | (P-平) 等大の残り |', '|---|---|---|---|---|---|---|',
    `| 規則の半径 | ${fp(r0.x)} | ${fp(r0.phiDeg)} | ${fp(r0.residEqual)} | — | — | — |`,
    ...J.decl.cRGrid.map((cR) => { const a = io('field', cR), b = io('avg', cR); return `| ${fp(cR)} | ${fp(a.x)} | ${fp(a.phiDeg)} | ${fp(a.residEqual)} | ${fp(b.x)} | ${fp(b.phiDeg)} | ${fp(b.residEqual)} |`; })].join('\n');
  // 表 7: 主の表への影響
  const t = (id, u, col) => J.t3.find((r) => r.id === id && r.u === u && r.col === col);
  T.main = ['| 惑星 | 背景の倍率 u | 規則の半径: 合成と L の角° | 円錐° | 回る向きの目安(cos(ŝ, 合成) の符号) | 向きの動き°: (P-場) 0.01 | (P-場) 0.1 | (P-場) 1 | (P-応) | 局所 ÷ 背景((P-場) 1) | 符号の変わった列 |', '|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.decl.planets.flatMap((id) => J.decl.uCols.map((u) => { const b = t(id, u, 'rule'), ch = J.t3cols.filter((c) => t(id, u, c.id).sense !== b.sense).map((c) => c.id);
      return `| ${JA[id]} | ${fp(u)} | ${fd(b.toLDeg)} | ${fp(b.coneDeg)} | ${sg(b.sense)} | ${fd(t(id, u, 'f0.01').dTot)} | ${fd(t(id, u, 'f0.1').dTot)} | ${fd(t(id, u, 'f1').dTot)} | ${fd(t(id, u, 'resp').dTot)} | ${fe(t(id, u, 'f1').localOverBg)} | ${ch.length ? ch.join('・') : 'なし'} |`; }))].join('\n');
  // 表 8: 動き始める倍率
  const um = (id, col) => J.uMove.find((r) => r.id === id && r.col === col);
  T.umove = ['| 惑星 | 合成の向きが 0.1° 動く背景の倍率 u の上端: (P-場) 0.01 | (P-場) 0.1 | (P-場) 1 |', '|---|---|---|---|',
    ...J.decl.planets.map((id) => `| ${JA[id]} | ${fe(um(id, 'f0.01').uMove)} | ${fe(um(id, 'f0.1').uMove)} | ${fe(um(id, 'f1').uMove)} |`)].join('\n');
  // 表 9: (P-応) の率の倍
  T.resp = ['| 天体 | 慣性モーメントの係数 c(文献の値・未照合) | 規則の半径 ÷ 観測半径 | 倍: R_ref 規則 | 倍: R_ref 観測 | 地球を 1 に: R_ref 規則 | 地球を 1 に: R_ref 観測 | 格子 c 0.33: R_ref 規則・観測 | 格子 c 0.4: R_ref 規則・観測 |', '|---|---|---|---|---|---|---|---|---|',
    ...J.t4.map((r) => { const g = (c) => r.grid.find((x) => x.c === c); return `| ${JA[r.id]} | ${r.moi === null ? 'ノブ(リポジトリに無い)' : fp(r.moi)} | ${fe(r.ruleOverObs)} | ${fe(r.multRule)} | ${fp(r.multObs)} | ${fp(r.relRule)} | ${fp(r.relObs)} | ${fe(g(0.33).multRule)}・${fp(g(0.33).multObs)} | ${fe(g(0.4).multRule)}・${fp(g(0.4).multObs)} |`; })].join('\n');
  return T;
}

/** 数の文(節に逐語) */
export function factsOf(J) {
  const F = {}, v = (place, cR) => J.t1.find((r) => r.place === place && r.cR === cR), bd = (place, axis, band) => J.bands.rows.find((r) => r.place === place && r.axis === axis && r.band === band);
  F.venus = `- 金星(主の列 (S)・(N+)・基準軸 L)の等大の残りは、規則の半径で ${fp(J.bands.rule.residEqual)}(φ ${fp(J.bands.rule.phiDeg)}°)。(P-場) では c_R 0.01 で ${fp(v('field', 0.01).residEqual)}・0.1 で ${fp(v('field', 0.1).residEqual)}・1 で ${fp(v('field', 1).residEqual)}(下限 ${fp(v('field', 1).residMin)})。残り 2% 以下を保つ c_R は ${fp(bd('field', 'L', 0.02).cR)} 以下・5% 以下は ${fp(bd('field', 'L', 0.05).cR)} 以下((P-平) では ${fp(bd('avg', 'L', 0.02).cR)}・${fp(bd('avg', 'L', 0.05).cR)})。(P-応) では向きが規則の半径の列と同じで、残りは c_R に依らず ${fp(v('resp', 1).residEqual)}。規則の半径を c_R に直すと ${fe(J.bands.ruleAsCR)}・cR★(自分の重み = 源の重み)は ${fp(J.bands.cRStar)}。`;
  const p = (pr) => J.t2.find((r) => r.pair === pr), rocky = ['Mercury|Sun', 'Venus|Sun', 'Earth|Sun', 'Mars|Sun'], giant = ['Jupiter|Sun', 'Saturn|Sun', 'Uranus|Sun', 'Neptune|Sun'];
  const rng = (xs, f) => `${fp(Math.min(...xs.map((x) => f(p(x)))))}〜${fp(Math.max(...xs.map((x) => f(p(x)))))}`;
  F.pairs = `- cR★(= c_R 1 での自分の重み ÷ 源の重み —— K1 の中心の値は半径の逆数)は、岩石の惑星で ${rng(rocky, (r) => r.cRStar)}(c_R 1 で自分の重みが源の重みより小さい —— 向きが源の重みの側に動く)・巨大な惑星で ${rng(giant, (r) => r.cRStar)}(c_R 1 でも自分の重みが勝つ —— 向きは規則の半径の列の近く)。規則の半径の自分の重み ÷ 源の重みは ${fe(Math.min(...J.t2.map((r) => r.selfOverSrcRule)))}〜${fe(Math.max(...J.t2.map((r) => r.selfOverSrcRule)))}。(P-場) c_R 1 の φ は岩石の惑星で ${rng(rocky, (r) => r.phiField1)}°・巨大な惑星で ${rng(giant, (r) => r.phiField1)}°。`;
  const io = (place, cR) => J.io.find((r) => r.place === place && r.cR === cR), i0 = io('rule', null);
  F.io = `- イオ ← 木星の x(同じ c_R を金星にも置いたときの、打ち消しの倍率の比)は、規則の半径で ${fp(i0.x)}・(P-場) c_R 1e-6 で ${fp(io('field', 1e-6).x)}・0.01 で ${fp(io('field', 0.01).x)}・1 で ${fp(io('field', 1).x)}。イオの等大の残りは規則の半径で ${fp(i0.residEqual)}・(P-場) c_R 1 で ${fp(io('field', 1).residEqual)}(金星と逆に、c_R を大きくすると小さくなる)。(P-応) では x と残りは規則の半径の列と同じ。`;
  const mx = (col) => Math.max(...J.t3.filter((r) => r.col === col).map((r) => Math.abs(r.dTot))), flips = J.t3.filter((r) => r.col !== 'rule' && r.sense !== J.t3.find((q) => q.id === r.id && q.u === r.u && q.col === 'rule').sense).length;
  const um = (ids, col) => Math.max(...J.uMove.filter((r) => ids.includes(r.id) && r.col === col).map((r) => r.uMove));
  F.main = `- 背景の倍率 u 0.0487・0.835・0.98 では、8 惑星の合成の向きは規則の半径の列から最大 ${fe(mx('f0.01'))}°((P-場) 0.01)・${fe(mx('f0.1'))}°(0.1)・${fe(mx('f1'))}°(1)・${fe(mx('resp'))}°((P-応))しか動かない。回る向きの目安の符号が変わった欄は ${flips}。合成の向きが 0.1° 動き始める u の上端は、(P-場) c_R 1 で岩石の惑星 ${fe(um(['Mercury', 'Venus', 'Earth', 'Mars'], 'f1'))}・巨大な惑星 ${fe(um(['Jupiter', 'Saturn', 'Uranus', 'Neptune'], 'f1'))}(窓の下端 0.0487 は、岩石の惑星の上端の ${fp(0.0487 / um(['Mercury', 'Venus', 'Earth', 'Mars'], 'f1'))} 倍)。`;
  const r4 = (id) => J.t4.find((r) => r.id === id);
  F.resp = `- (P-応) の率の倍は、R_ref を規則の半径に置くと ${fe(Math.min(...J.t4.filter((r) => r.multRule !== null).map((r) => r.multRule)))}〜${fe(Math.max(...J.t4.filter((r) => r.multRule !== null).map((r) => r.multRule)))}(率が桁で落ちる)・観測半径に置くと ${fp(Math.min(...J.t4.filter((r) => r.multObs !== null).map((r) => r.multObs)))}〜${fp(Math.max(...J.t4.filter((r) => r.multObs !== null).map((r) => r.multObs)))}。地球を 1 にした比は、R_ref 規則で 金星 ${fp(r4('Venus').relRule)}・火星 ${fp(r4('Mars').relRule)}、R_ref 観測で 金星 ${fp(r4('Venus').relObs)}・火星 ${fp(r4('Mars').relObs)}。`;
  return F;
}

// 第352便k(原仮定者の回答(2026-11-24 —— 第148報)・原仮定者の回答(2026-11-24 —— 第147報)・統括の検証項目 R448):
// **正本 tests/out/spinform-352k.json から PHYSICS〔第352便k〕の表と数の文を作る文書の lib**
// (QA docs.spinform352k が節の表と逐語で照合する —— 表の数は有効数字 3 桁・丸めの床の量は「< 1e-12」)。原文(言葉を変えずに引く)と、固定の表もここに持つ。
// ファイルを読まない・import しない。
export const DOC_VERSION = 'w352k-spinformdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const fz = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '< 1e-12' : Number(x).toExponential(2));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
const f2 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(2));
const SENSE = (s) => (s < 0 ? '逆' : s > 0 ? '順' : '0');
const TN = Object.freeze({ 0: '規則', 0.25: '¼', 0.5: '½', 0.75: '¾', 1: '観測' });
const FN = Object.freeze({ M1: 'M・K1(在位)', M2: 'M・K2', q0: 'q 0', 'q0.5': 'q 0.5', q1: 'q 1', 'q1.2': 'q 1.2', 'q1.5': 'q 1.5', q2: 'q 2', q3: 'q 3' });
const BN = Object.freeze({ NpL: '(N+) L', NpEq: '(N+) eq', Gm: '(G−)' });
const PJ = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星' });
const crN = (c) => (c === null ? '規則の半径' : 'c_R ' + (c === 1 ? '1' : Number(c).toExponential(0)));

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第148報)', 'AN1015: Bで進める。銀河由来の軸引きずりも、(S)だけを数えると弱いと推測する']),
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第148報)', 'AN1019: Aで進める。金星の自転の逆回転は、釣り合った状態で地球とも共鳴した結果である']),
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第147報)', 'AN1000: C2で進める。係数はノブにする']),
  Object.freeze(['原仮定者の補足(2026-11-14 —— 第138報の補足)', '軸引きずりは、並進引きずりで引きずられる側の、近い面と遠い面の差分なので、赤道面では源の回転と逆回転になる']),
  Object.freeze(['原仮定者の回答(2026-11-23 —— 第145報の回答 10)', 'AN976: 安定している運行は、結果として釣り合っている。釣り合う向きは、銀河由来と太陽由来の軸引きずりを重みで合成した方向。その方向と観測の向きが違う場合は、ジャイロトルクで釣り合いつつ歳差運動をしている。天体の構造別に軸引きずりの利き方に差異が予想され、観測半径に対する引きずられ半径の係数がノブの候補']),
  Object.freeze(['原仮定者の回答(2026-11-18 —— 第141報 AN790)', '天体の特性を表す係数のノブにする']),
]);
export const READINGS = Object.freeze([
  '局所の軸引きずりの主の成分 = (S) 源の自転の分。主にすると (S) の大きさがそのまま全体の物差しになる —— 本節は (S) の大きさと符号が、源の回転の形と源の半径の置き方でどれだけ動くかを数える。「(S)だけを数えると弱い」は予想の文',
  '背景の大きさの主の列 = 金星で (S) と背景の大きさが同じになる値(この条件が決めるのは「倍率 ÷ k」)。後半は予想の文 —— 本節は打ち消しの度合いの数だけ',
  '換算の係数 k は局所の項にだけ掛かる(既定 1)。本節の源の回転の形・源の半径の置き方は k とは別の場所(源の回転の分子)に入る',
  '「源の回転」は源の自転と読む(統括の読み)。本節の「逆」= (S) が太陽の自転軸と逆向き(この文に当たる)・「順」= 同じ向き(当たらない)',
  '引きずられ半径の係数 c_R は受け手の側の半径(自分の重みの球の半径と (C2) の平均の半径)。本節の源の半径の置き方は源の側の半径 —— 混ぜない(表 4)',
  '天体ごとの係数の考え方。源の半径の置き方も「天体の特性」の 1 つと読める(統括の読み —— 同じノブとは決めない)',
]);
const esc = (s) => String(s).replace(/\|/g, '/');
export function originalTable() {
  return '| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) |\n|---|---|---|---|\n'
    + ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${esc(READINGS[k])} |`).join('\n');
}
/** 式の上の入り方(固定 —— 表 4 の素。統括の読みで寄せない) */
export const ENTRY_TABLE = ['| ノブ | 入る所(〔第348便h〕の `makeField3`) | (S) への効き方(A ≫ w_源 の間) | (M) への効き方 | (S) ÷ (M) |', '|---|---|---|---|---|',
  '| 源の半径の置き方 t(本節) | 源の回転の分子 s(r)(形 M: m R_源² ÷ (5 r³)・形 q: m K(r) (R_源 ÷ (R_源 + r))^q) | 形 M で R_源² に比例・形 q で R_源^q に比例・q 0 は依らない | 効かない(源の自転 0 —— 零試験) | 形 M で R_源² に比例 |',
  '| 源の回転の形(M・q・核) | 同じ分子の落ち方のべき | [f + r f′/2] ÷ f = (1 − q) ÷ 2 —— q > 1 逆・q < 1 順・距離のべき −(1 + q) | 核だけが効く(K1・K2) | 何桁も動く |',
  '| 受け手の半径の置き方 c_R(〔第348便h〕K1cM・〔第350便f〕(ii)) | 自分の重み A = m K(0, R_受け手) と (C2) の平均の半径 | 1 ÷ A に比例(A が分母を占める間) | 同じく 1 ÷ A に比例 | A が分母を占める間は動かない(表 4) |',
  '| 換算の係数 k(〔第351便b〕) | 局所の項の全体の倍 | k 倍 | k 倍 | 動かない |',
  '| 背景の倍率 u(〔第351便e〕) | 宣言の一様な背景 | — | — | — (金星の条件は u ÷ k を決める) |'].join('\n');

export function tablesOf(J) {
  const T = {};
  { const S = J.pure.scenes, G = J.pure.gates, a = S.anchor2;
    T.pure = '| 零試験・場面 | 値 | 門 |\n|---|---|---|\n' + [
      ['① 既定の引数(形 M・K1・規則の半径)で〔第351便c〕の `partRot` と同じ(8 惑星 + 衛星 2 組・(C2)(W)・成分 3 つ —— 相対の差)', fz(S.vsPart), G.vsPartRot],
      ['② 形 M1 で (S) は源の半径の 2 乗に比例(地球・t ¼〜1 —— 比の相対の差)', fz(S.r2), G.radiusSq],
      ['③ 形 q0 は源の半径に依らない/(M) は源の回転の形と源の半径に依らない', `${fz(S.q0Rs)}/${fz(S.mInv)}`, G.invariants],
      ['④ 統括の数え直し 2(地球・(W)): (S) ÷ (M) 在位・観測の半径・q 0 と、太陽の自転との向き', `${a.rule.toExponential(3)}・${fe(a.obs)}・${f2(a.q0)}/${SENSE(a.senseRule)}・${SENSE(a.senseObs)}・${SENSE(a.senseQ0)}`, G.anchor2],
      ['⑤ 閉じた形 [f + r f′/2](源の赤道面・形 6 つ)と `makeField3` の (W)・形 M で〔第351便c〕の `closedSEq` と同じ', `${fz(S.closed)}・${fz(S.vsClosedSEq)}`, G.closed],
      ['⑥ 一次の符号 (1 − q) の向き(q 0・0.5・1.5・2・3・M)', `${S.lead.filter(Boolean).length}/${S.lead.length}`, G.leadSign],
      ['⑦ 源の自転の反転で (S) が反転・k 2 は 2 倍・k 0 は 0', `${fz(S.flip)}・${fz(S.k2)}・${S.k0}`, G.flipK],
      ['⑧ (uV)(在位・金星・(C2)・k 1)', S.uV.toExponential(5), G.uV],
      ['⑨ 半径の関数(規則の半径・観測の半径・c_R 1)', `${Object.values(S.rr).filter(Boolean).length}/${Object.keys(S.rr).length}`, G.radii],
      ['⑩ 入力の拒否(成分・形・t・c_R・読み・k・負の q)', `${S.rejects.filter(Boolean).length}/${S.rejects.length}`, G.rejects],
    ].map(([x, b, g]) => `| ${x} | ${b} | ${g ? '真' : '偽'} |`).join('\n'); }
  { const rows = [];
    for (const f of J.decl.forms) for (const t of J.decl.tSrcs) {
      const rs = J.t1.filter((r) => r.form === f && r.tSrc === t), e = rs.find((r) => r.id === 'Earth'), v = rs.find((r) => r.id === 'Venus'), sl = J.slope.find((r) => r.form === f && r.tSrc === t);
      const nOpp = rs.filter((r) => r.sense < 0).length;
      rows.push(`| ${FN[f]} | ${TN[t]} | ${fe(e.Rs)} | ${fe(e.magAsYr)} | ${fe(e.overM)} | ${fe(v.magAsYr)} | ${fe(v.overM)} | 逆 ${nOpp}/${rs.length} | ${f2(sl.slope)}(${sl.lead}) |`);
    }
    T.t1 = '| 源の回転の形 | 源の半径 | R_源 [m] | 地球 (S) ″/年 | 地球 (S) ÷ (M) | 金星 (S) ″/年 | 金星 (S) ÷ (M) | 太陽の自転との向き(8 惑星) | 距離のべき(閉じた形の目安) |\n|---|---|---|---|---|---|---|---|---|\n' + rows.join('\n'); }
  { const pick = [['M1', 0], ['M1', 1], ['q0', 0], ['q0.5', 1], ['q1.5', 1], ['q2', 1]], rows = [];
    for (const id of J.decl.planets) rows.push(`| ${PJ[id]} | ` + pick.map(([f, t]) => { const r = J.t1.find((x) => x.id === id && x.form === f && x.tSrc === t); return `${fe(r.overM)}・${f3(r.cosSpin)}・${SENSE(r.sense)}`; }).join(' | ') + ' |');
    T.planets = '| 惑星 | ' + pick.map(([f, t]) => `${FN[f]}・${TN[t]}`).join(' | ') + ' |\n|---|' + pick.map(() => '---|').join('') + '\n' + rows.join('\n'); }
  T.qscan = '| 源の半径 | (S) が逆へ替わる q(0.05 刻み) | 逆向きの軸の成分が最大の q | −(S·ŝ_太陽) ÷ abs(M) | abs(S) ÷ abs(M) | cos(ŝ_太陽, S) | abs(S) ″/年 | 逆の点 / 点 |\n|---|---|---|---|---|---|---|---|\n'
    + J.qscan.map((r) => `| ${TN[r.tSrc]} | ${f2(r.cross)} | ${f2(r.best.q)} | ${fe(r.best.opp)} | ${fe(r.best.overM)} | ${f3(r.best.cosSrc)} | ${fe(r.best.magAsYr)} | ${r.nOpp}/${r.nPts} |`).join('\n');
  T.venus = '| 源の回転の形 | 源の半径 | 倍率 ÷ k(k 1 のときの倍率) | 倍率 1 のときに要る k | 金星の残り (N+) L | 金星の残り (N+) eq | 金星の残り (G−) | 金星の (S) の向き |\n|---|---|---|---|---|---|---|---|\n'
    + J.venus.map((r) => `| ${FN[r.form]} | ${TN[r.tSrc]} | ${fe(r.uk)} | ${fe(r.kAtU1)} | ${f3(r.resid.NpL)} | ${f3(r.resid.NpEq)} | ${f3(r.resid.Gm)} | ${SENSE(r.sense)} |`).join('\n');
  T.rate = '| 源の回転の形 | 源の半径 | 背景の向き | 地球 ″/年 | 地球 一周 [年] | 火星 ″/年 | 火星 一周 [年] | 太陽(背景だけ)″/年 | 太陽 一周 [年] | 地球に要る倍(仮) | 火星に要る倍(仮) |\n|---|---|---|---|---|---|---|---|---|---|---|\n'
    + J.rate.filter((r) => r.tSrc === 0 || r.tSrc === 1).map((r) => { const n = J.need.find((x) => x.form === r.form && x.tSrc === r.tSrc && x.bg === r.bg), R = r.rates;
      return `| ${FN[r.form]} | ${TN[r.tSrc]} | ${BN[r.bg]} | ${fe(R.Earth.asYr)} | ${fe(R.Earth.periodYr)} | ${fe(R.Mars.asYr)} | ${fe(R.Mars.periodYr)} | ${fe(R.Sun.asYr)} | ${fe(R.Sun.periodYr)} | ${fe(n.needEarth)} | ${fe(n.needMars)} |`; }).join('\n');
  T.cr = '| 源の回転の形 | 源の半径 | 受け手の半径 | 自分の重みの割合 A ÷ (A + w_源) | (S) ″/年 | (M) ″/年 | (S) ÷ (M) | 向き |\n|---|---|---|---|---|---|---|---|\n'
    + J.cr.map((r) => `| ${FN[r.form]} | ${TN[r.tSrc]} | ${crN(r.cR)} | ${fe(r.selfShare)} | ${fe(r.S)} | ${fe(r.M)} | ${fe(r.overM)} | ${SENSE(r.sense)} |`).join('\n');
  return T;
}
const rng = (xs, f) => { const v = xs.filter((x) => Number.isFinite(x)); const a = Math.min(...v), b = Math.max(...v); return f(a) === f(b) ? f(a) : f(a) + '〜' + f(b); };
export function factsOf(J) {
  const F = {}, t1 = J.t1, by = (f, t) => t1.filter((r) => r.form === f && r.tSrc === t), E = (f, t) => t1.find((r) => r.id === 'Earth' && r.form === f && r.tSrc === t);
  const opp = J.decl.forms.filter((f) => by(f, 0).every((r) => r.sense < 0)), dir = J.decl.forms.filter((f) => by(f, 0).every((r) => r.sense > 0));
  F.sign = `8 惑星で (S) が太陽の自転と逆向き(「赤道面では源の回転と逆回転」に当たる)形は ${opp.map((f) => FN[f]).join('・')}、順向きの形は ${dir.map((f) => FN[f]).join('・')}(源の半径の置き方では向きは替わらない —— 規則の半径の列)。`
    + `距離のべきは閉じた形の目安 −(1 + q)(形 M は −3)の近く(${rng(J.slope.map((r) => r.slope - r.lead), f2)} の差)。`;
  const mx = t1.filter((r) => r.id === 'Earth' && r.sense < 0).reduce((b, r) => (b === null || r.overM > b.overM ? r : b), null);
  F.size = `地球の (S) ÷ (M) は、在位の形(形 M・K1・規則の半径)で ${E('M1', 0).overM.toExponential(3)}、源の半径を観測の半径にすると ${fe(E('M1', 1).overM)}(源の半径の 2 乗の比 ${fe((E('M1', 1).Rs / E('M1', 0).Rs) ** 2)} 倍)、`
    + `落ちない形 q 0 で ${f2(E('q0', 0).overM)}(源の半径に依らない)。逆向きのまま (M) に届く形は、この格子には無い(逆向きの中の最大は ${fe(mx.overM)} —— ${FN[mx.form]}・${TN[mx.tSrc]}の半径)。`;
  { const q = J.qscan, b1 = q.find((r) => r.tSrc === 1);
    F.qscan = `q を 0.8〜3 で走らせると、地球の (S) が太陽の自転軸に沿って逆向きへ替わるのは q ${rng(q.map((r) => r.cross), f2)} の辺り(閉じた形の一次では q 1 —— 赤道面から外れた分が残る)。`
      + `逆向きの軸の成分の最大は、観測の半径で q ${f2(b1.best.q)}・abs(M) の ${fe(b1.best.opp)} 倍(${fe(b1.best.magAsYr)}″/年)・規則の半径で ${fe(q.find((r) => r.tSrc === 0).best.opp)} 倍。`; }
  { const v = (f, t) => J.venus.find((r) => r.form === f && r.tSrc === t);
    F.venus = `金星の条件(大きさが同じ)が決める倍率 ÷ k は、在位の形で ${v('M1', 0).uk.toExponential(5)}・観測の半径で ${fe(v('M1', 1).uk)}・q 0 で ${fe(v('q0', 0).uk)}(${J.decl.forms.length} 形 × 置き方 ${J.decl.tSrcs.length} で ${rng(J.venus.map((r) => r.uk), fe)})。`
      + `倍率 1(銀河の公転の角速度そのまま)に置くと要る k は ${rng(J.venus.map((r) => r.kAtU1), fe)}。(N+) での金星の残りは、逆向きの形では ${rng(J.venus.filter((r) => r.sense < 0).map((r) => r.resid.NpL), f3)}(L)、順向きの形では ${rng(J.venus.filter((r) => r.sense > 0).map((r) => r.resid.NpL), f3)}(L)—— 打ち消しは形の符号で替わる。`; }
  { const s = J.needSum;
    F.rate = `背景を (uV) に置いたときの地球の合成の率は ${rng(J.rate.map((r) => r.rates.Earth.asYr), fe)}″/年(一周 ${rng(J.rate.map((r) => r.rates.Earth.periodYr), fe)} 年)。`
      + `仮の比べる数(地球の歳差の率・火星の歳差の率 —— 仮・未照合)に単位の応答で届くのに要る倍は、最も小さい組でも地球 ${fe(s.minEarth.need)}(${FN[s.minEarth.form]}・${BN[s.minEarth.bg]})・火星 ${fe(s.minMars.need)}、在位の形で地球 ${rng(s.mainEarth, fe)}・火星 ${rng(s.mainMars, fe)}(全部の組で 1 を超える: ${s.allAboveOne ? 'はい' : 'いいえ'})。`; }
  { const c = J.cr, g = (f, t, cR) => c.find((r) => r.form === f && r.tSrc === t && r.cR === cR);
    F.cr = `受け手の半径の置き方 c_R は (S) と (M) を同じ倍で動かす —— 地球・形 M1・規則の源の半径で、(S) ÷ (M) は規則の半径 ${g('M1', 0, null).overM.toExponential(3)}・c_R 1e-4 ${g('M1', 0, 1e-4).overM.toExponential(3)}・c_R 1 ${fe(g('M1', 0, 1).overM)}`
      + `(自分の重みの割合が ${fe(g('M1', 0, 1).selfShare)} に落ちた所で動き始める)。源の半径の置き方は (S) だけを動かす(表 1)。`; }
  return F;
}

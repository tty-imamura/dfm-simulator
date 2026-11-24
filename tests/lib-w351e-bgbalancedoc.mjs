// 第351便e(原仮定者の回答(2026-11-24 —— 第147報)「AN1009: B2で進める」・統括の検証項目 R431):
// **正本 tests/out/bgbalance-351e.json から PHYSICS〔第351便e〕の表を作る文書の lib**
// (QA docs.bgbalance351e が節の表と逐語で照合する —— 大きさと率と倍率は有効数字 3 桁・角は小数 1 桁)。原文(言葉を変えずに引く)と統括の読みもここに持つ。
export const DOC_VERSION = 'w351e-bgbalancedoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f1 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(1));
const f3 = (x) => { if (x === null || x === undefined || !Number.isFinite(x)) return '—'; const s = Number(x).toFixed(3); return s === '-0.000' ? '0.000' : s; };
const fu = (x) => (x === 'inf' ? '→ ∞' : fe(x));
const NM = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星', Moon: '月', Io: 'イオ', Pluto: '冥王星',
  Sun: '太陽', EarthHi: '地球(傾きの最大の位相)', EarthLo: '地球(傾きの最小の位相)', Charon: 'カロン' });
const ORIG = Object.freeze({ sun: '太陽', parent: '母天体' });
const SIGN = Object.freeze({ '-1': '向き −1', '1': '向き +1' });
const READ = Object.freeze({ C2: '(C2)', W: '(W)' });
const KIND = Object.freeze({ kou: '(甲)', hei: '(丙)' });
const SIDE = Object.freeze({ sun: '太陽由来', bg: '背景', eq: '同じ' });
const PL = Object.freeze(['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']);

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第147報)', 'AN1009: B2で進める']),
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第147報)', '「背景並進引きずり」は、慣性系では織り込み済みなので']),
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第147報)', 'よって、大半の惑星は、銀河由来の軸引きずりは起こす向きで、太陽の由来の軸引きずりは倒す向きになり、釣り合う']),
  Object.freeze(['原仮定者の整理(2026-11-23 —— 第146報)', '安定している天体の運行は、結果として釣り合っている。釣り合う軸の向きは、銀河由来と太陽由来の軸引きずりを重みで合成した方向。その方向と観測の向きが違う場合は、その方向を軸に歳差運動が現れる']),
  Object.freeze(['原仮定者の回答(2026-11-15 —— AN720)', '「金星で釣り合う比」は、今後軸引きずりの計算を見直しても尊重する']),
  Object.freeze(['原仮定者の補足(2026-11-14 —— 第138報の補足 2)', '水星は太陽の影響が強い。金星は、太陽と銀河が釣り合っていて、さらに地球が影響を与えている']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['背景軸引きずりは並進の背景の重み W₀ と独立に持つ((B2) が主)。在位の形(W₀ = 0)は変えない。大きさは宣言のノブ(銀河の公転の角速度 ω_G の倍 u)。(B1)(並進の背景の取り分 1 − f に比例)は比べる列', '表 2・表 3']),
  Object.freeze(['背景並進引きずりが慣性系で織り込み済みなら、局所の項の分母に銀河の重みを入れない形(out)が筋、という読みが在る —— 本節は読みとして書き、主の列は決めない(決断事項の候補)', '表 2']),
  Object.freeze(['予想の文として表に置く。「起こす/倒す」は公転の北極を基準の起こす率の符号、「釣り合う」は 3 つの読み (甲)(乙)(丙) の列で数える —— 数えた符号と大きさは別の列', '表 7・表 8・表 11']),
  Object.freeze(['「重みで合成した方向」= 全体の Ω = Ω_bg + Σ(局所の項 × k)の向き(本節の lib の合成)。「その方向を軸に歳差運動」= 自転軸 ŝ が合成の向きのまわりを半頂角 δ で回る読み(経路 ②)', '表 4・表 12']),
  Object.freeze(['恒久の条件。本節の主の列((C2)・(B2)・向き −1)で、金星で (甲)・(丙) を満たす u を成分ごとに出し、その u を全部の組に当てた表を並べる —— 第147報の文との関係は寄せない', '表 10・表 11']),
  Object.freeze(['〔第337便c〕の目標の分類(水星 = 太陽が強い・金星 = 釣り合い・地球・火星・木星 = 銀河の側)を比べる列に置く(大きさの比で読む)', '表 11']),
]);
export function originalTable(readings = READINGS) {
  const rows = ['| # | 出どころ | 原文 | 統括の読み | 数えた所 |', '|---|---|---|---|---|'];
  ORIGINAL.forEach(([src, o], k) => rows.push(`| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`));
  return rows.join('\n');
}
/** 3 つの読みの定義の表 */
export const READ_TABLE = ['| 読み | 満たす式 | 背景の倍率の出し方 | 解の無い場合 |', '|---|---|---|---|',
  '| (甲) 起こす率の和が 0 | 背景(u)+ 太陽由来 + 母天体由来 の起こす率の和 = 0 | u* = −(局所の起こす率)÷(背景〔u 1〕の起こす率)—— 起こす率は u に線形 | 局所と背景の符号が同じ(打ち消さない)→ 解なし |',
  '| (乙) 自転軸が合成の向きにそろう | 合成の向き L + u b と ŝ のなす角 δ = 0 | δ の最小の u(閉じた形: u = 0・停留点 u₀・u → ∞ の 3 候補)—— 弧と ŝ の最小の角と同じ | δ の最小が 0 でない → 最小値をそのまま書く |',
  '| (丙) 太陽由来と背景の大きさが同じ | abs(太陽由来) = abs(背景) | u = abs(太陽由来)÷ abs(背景〔u 1〕) | 無い(いつも 1 つ) |'].join('\n');

const pn = (id, src) => `${NM[id]} | ${NM[src]}`;
export function tablesOf(J) {
  const T = {}, main = (r) => r.read === 'C2' && r.sign === -1, balAt = (id, src, part, u, read = 'C2', sign = -1) => J.bal.find((r) => r.id === id && r.src === src && r.part === part && r.u === u && r.read === read && r.sign === sign);
  // 表 2: 局所の分母の列 in と out
  { const rows = ['| 天体 | 源 | 由来 | in ÷ out − 1: (M)・(S)・(MS) | 向きの差(°): (MS) | 銀河の重み ÷ 太陽の重み(中心の値) |', '|---|---|---|---|---|---|'];
    for (const r of J.den.rows) rows.push(`| ${pn(r.id, r.src)} | ${ORIG[r.origin]} | ${fe(r.parts.M.relInOut)}・${fe(r.parts.S.relInOut)}・${fe(r.parts.MS.relInOut)} | ${f1(r.parts.MS.angDeg)} | ${fe(r.wGalOverSun)} |`);
    T.t2 = rows.join('\n'); }
  // 表 3: 入り方 (B2)・(B1)
  { const rows = ['| 天体 | 源 | (B2) の係数 | (B1) の 1 − f: W₀ 0(在位の形)・W₀ = 自分の重み | 銀河の重み ÷ 箱の重み(自分 + 太陽 + 母天体) |', '|---|---|---|---|---|'];
    for (const r of J.den.incl) rows.push(`| ${pn(r.id, r.src)} | 1 | ${f3(r.coefW0[0])}・${f3(r.coefW0[1])} | ${fe(r.wGalOverBox)} |`);
    T.t3 = rows.join('\n'); }
  // 表 4: 合成の向きと δ と歳差の率((C2)・向き −1)
  { const U = J.decl.uGrid, rows = ['| 天体 | 源 | 成分 | δ(°): u ' + U.map(String).join('・') + ' | 合成の向きと公転の北極の角(°): u 1・1e4 | abs(Ω) ″/年: u 0・1・1e4 | abs(Ω) sin δ ″/年: u 1 |', '|---|---|---|---|---|---|---|'];
    for (const [id, src] of J.pairs16) for (const part of J.decl.parts) {
      const at = (u) => balAt(id, src, part, u);
      rows.push(`| ${pn(id, src)} | (${part}) | ${U.map((u) => f1(at(u).deltaDeg)).join('・')} | ${f1(at(1).toNorthDeg)}・${f1(at(1e4).toNorthDeg)} | ${fe(at(0).precMag)}・${fe(at(1).precMag)}・${fe(at(1e4).precMag)} | ${fe(at(1).precCone)} |`);
    }
    T.t4 = rows.join('\n'); }
  // 表 5: 起こす率の内訳と和((C2)・向き −1・経路 ① 係数 1)
  { const rows = ['| 天体 | 源 | 成分 | 背景(u 1) | 太陽由来 | 母天体由来 | 和: u 1 | 和: u 1e4 |', '|---|---|---|---|---|---|---|---|'];
    for (const [id, src] of J.pairs16) for (const part of J.decl.parts) { const a = balAt(id, src, part, 1), b = balAt(id, src, part, 1e4);
      rows.push(`| ${pn(id, src)} | (${part}) | ${fe(a.raiseBg)} | ${fe(a.raiseSun)} | ${fe(a.raiseParent)} | ${fe(a.raiseSum)} | ${fe(b.raiseSum)} |`); }
    T.t5 = rows.join('\n'); }
  // 表 6: 比べる列((W)・向き +1)
  { const rows = ['| 天体 | 源 | 成分 | (W)・向き −1: δ(°)u 1・1e4 | (C2)・向き +1: δ(°)u 1・1e4 | (C2)・向き +1: 起こす率の和 ″/年 u 1・1e4 |', '|---|---|---|---|---|---|'];
    for (const [id, src] of J.pairs16) for (const part of J.decl.parts) {
      const w1 = balAt(id, src, part, 1, 'W'), w4 = balAt(id, src, part, 1e4, 'W'), p1 = balAt(id, src, part, 1, 'C2', 1), p4 = balAt(id, src, part, 1e4, 'C2', 1);
      rows.push(`| ${pn(id, src)} | (${part}) | ${f1(w1.deltaDeg)}・${f1(w4.deltaDeg)} | ${f1(p1.deltaDeg)}・${f1(p4.deltaDeg)} | ${fe(p1.raiseSum)}・${fe(p4.raiseSum)} |`);
    }
    T.t6 = rows.join('\n'); }
  // 表 7: 「釣り合う」の 3 つの読み((C2)・向き −1)
  { const rows = ['| 天体 | 源 | 成分 | 傾き ε(°) | (甲) u* | (乙) δ が最小の u・δ の最小(°) | δ(°): u 0・u → ∞ | (丙) u | 第147報の文に当たる(背景が起こす ∧ 太陽由来が倒す) |', '|---|---|---|---|---|---|---|---|---|'];
    for (const r of J.reads.filter(main)) rows.push(`| ${pn(r.id, r.src)} | (${r.part}) | ${f1(r.epsDeg)} | ${r.raiseUndef ? '—(傾きが定まらない)' : r.uKou === null ? '解なし' : fe(r.uKou)} | ${fu(r.uOtsu)}・${f1(r.deltaMinDeg)} | ${f1(r.delta0Deg)}・${f1(r.deltaInfDeg)} | ${fe(r.uHei)} | ${r.raiseUndef ? '—' : r.hit147 ? '当たる' : '当たらない'} |`);
    T.t7 = rows.join('\n'); }
  // 表 8: 数
  { const SC = { planets: '8 惑星', all: '16 組' }, rows = ['| 読み | 背景の向き | 成分 | 範囲 | 第147報の文に当たる | (甲) の根が在る | (甲) 解なし | 傾きが定まらない |', '|---|---|---|---|---|---|---|---|'];
    for (const c of J.counts) rows.push(`| ${READ[c.read]} | ${SIGN[String(c.sign)]} | (${c.part}) | ${SC[c.scope]} | ${c.hit} | ${c.kou} | ${c.kouNone} | ${c.undef} |`);
    T.t8 = rows.join('\n'); }
  // 表 9: 向きの幾何(8 惑星・(C2))
  { const rows = ['| 天体 | 背景の向き | 成分 | 背景と公転の北極の角(°) | 太陽由来と公転の北極の角(°) | 合成の向きが取る範囲(°) | 観測の傾き ε(°) | 範囲の内 | ŝ が 2 本の張る面から外れる角(°) | ŝ と弧の最小の角(°) |', '|---|---|---|---|---|---|---|---|---|---|'];
    for (const r of J.geo) rows.push(`| ${NM[r.id]} | ${SIGN[String(r.sign)]} | (${r.part}) | ${f1(r.bgToNorthDeg)} | ${f1(r.sunToNorthDeg)} | ${f1(r.minDeg)}〜${f1(r.maxDeg)} | ${f1(r.epsDeg)} | ${r.inRange ? '内' : '外'} | ${f1(r.planeOffDeg)} | ${f1(r.arcDistDeg)} |`);
    T.t9 = rows.join('\n'); }
  // 表 10: 金星で (甲)・(丙) を満たす u
  { const rows = ['| 成分 | 背景(u 1)の起こす率 ″/年 | 局所の起こす率 ″/年 | (甲) u | (丙) u |', '|---|---|---|---|---|'];
    for (const v of J.venus.vu) rows.push(`| (${v.part}) | ${fe(v.raiseBg1)} | ${fe(v.raiseLocal)} | ${v.uKou === null ? '解なし' : fe(v.uKou)} | ${fe(v.uHei)} |`);
    T.t10 = rows.join('\n'); }
  // 表 11: 金星の u を 8 惑星に当てた表
  { const rows = ['| 成分 | 読み | 金星の u | 天体 | 太陽由来 ÷ 背景 | 大きい側 | 起こす率の和 ″/年 | 和 ÷ 内訳の絶対値の和 | δ(°) | その天体の (甲) u* ÷ 金星の u | 〔第337便c〕の目標の分類 |', '|---|---|---|---|---|---|---|---|---|---|---|'];
    for (const r of J.venus.rows.filter((x) => x.src === 'Sun' && PL.includes(x.id))) rows.push(`| (${r.part}) | ${KIND[r.kind]} | ${fe(r.uV)} | ${NM[r.id]} | ${fe(r.sunOverBg)} | ${SIDE[r.side]} | ${fe(r.raiseSum)} | ${f3(r.raiseSumRel)} | ${f1(r.deltaDeg)} | ${r.kouOverV === null ? '解なし' : fe(r.kouOverV)} | ${r.class337c || '—'} |`);
    T.t11 = rows.join('\n'); }
  // 表 12: (R3) の步
  { const rows = ['| 天体 | 成分 | 読み・u | f | 傾き ε(°): 始め → 終わり | 合成の向きとのなす角(°): 始め → 終わり | 歳差の率(無次元 —— 1 ÷ abs(Ω) の時間あたり) | 合成の向きと公転の北極の角(°) | abs(Ω) ″/年 |', '|---|---|---|---|---|---|---|---|---|'];
    for (const r of J.steps) rows.push(`| ${NM[r.id]} | (${r.part}) | ${KIND[r.kind]} ${fe(r.u)} | ${r.f} | ${f1(r.eps0Deg)} → ${f1(r.epsEndDeg)} | ${f1(r.th0Deg)} → ${f1(r.thEndDeg)} | ${f3(r.precRate)} | ${f1(r.eqToNorthDeg)} | ${fe(r.magAsYr)} |`);
    T.t12 = rows.join('\n'); }
  // 表 13: 零試験
  { const S = J.pure.scenes, G = J.pure.gates, ok = (k) => (G[k] ? '真' : '偽'), lt = (v, t) => (v < t ? '< ' + t.toExponential(0) : fe(v)), c = S.common;
    const rows = ['| # | 試験 | 数 | 門 |', '|---|---|---|---|',
      `| ① | (B2) の背景の項は W₀ に依らない・(B1) は在位の形(W₀ 0)で 0・W₀ = 自分の重みで 1 − f | ${lt(S.incl.b2same, 1e-12)}・${S.incl.b1zero === 0 ? '0' : fe(S.incl.b1zero)}・${f3(S.incl.b1coef)} | ${ok('inclB2')} |`,
      `| ② | 背景の項 = 第350便e の \`uVec\`(ω_G × u, 'rd0', m, 向き)= 本便の枝 b の \`bgB2\` | ${lt(S.vsU, 1e-12)} | ${ok('bgIsU')} |`,
      `| ③ | 換算の係数 k は局所だけ(k 2 で局所 2 倍・背景は同じ)・合計は本便の枝 b の \`applyK\` と同じ | ${lt(Math.max(S.kk.local, S.kk.bg, S.kk.vsApplyK), 1e-12)} | ${ok('kLocalOnly')} |`,
      `| ④ | u 0 と k 0 で「向きは決まらない」・u 0 だけでは決まる | ${S.undet.zero && S.undet.uOnly ? '決まらない・決まる' : '—'} | ${ok('undetermined')} |`,
      `| ⑤ | 二度数え: 背景を局所の入力にも入れると合計が背景の 2 倍(\`applyK\`)・本節の合成は背景を 1 回だけ(項 2 つ) | ${lt(S.twice.doubled, 1e-12)}・${lt(S.twice.once, 1e-12)}・${S.twice.terms} | ${ok('doubleCount')} |`,
      `| ⑥ | 起こす率は由来ごとの和(線形) | ${lt(S.lin, 1e-12)} | ${ok('raiseLinear')} |`,
      `| ⑦ | (甲) の根で起こす率の和が 0(火星・(S))・符号が同じなら解なし | ${S.ko.back === null ? '—' : lt(S.ko.back, 1e-9)} | ${ok('uStar')} |`,
      `| ⑧ | (乙) の閉じた形の最小 = ŝ と弧の最小の角(8 惑星 × 成分 3)・格子の走査は最小を下回らない | ${lt(S.otsu, 1e-6)} | ${ok('deltaMin')} |`,
      `| ⑨ | 向きの幾何: 共面の例で範囲 60〜180°・0〜60°・面から外れる角 90° | ${f1(S.geo.r1[0])}〜${f1(S.geo.r1[1])}・${f1(S.geo.r2[0])}〜${f1(S.geo.r2[1])}・${f1(S.geo.off)} | ${ok('arcGeo')} |`,
      `| ⑩ | 合成の向き(本便の枝 d の \`eqAxis\`)= 第350便e の \`composeBal\` | ${lt(S.eqSame, 1e-15)} | ${ok('eqAxis')} |`,
      `| ⑪ | 第350便までの共通の点検の数(自転しない源の通過) | ${c.diaXz.toFixed(8)}・${c.sixZ.toFixed(8)}・${c.rotWz.toFixed(8)} | ${ok('common350')} |`,
      `| ⑫ | 入力の拒否(成分・k < 0・u < 0・入り方・(B1) の入力・ベクトルの長さ・0 の向き) | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${ok('rejects')} |`];
    T.t13 = rows.join('\n'); }
  return T;
}
export function factsOf(J) {
  const F = {}, rd = (id, part, read = 'C2', sign = -1) => J.reads.find((r) => r.id === id && r.src === 'Sun' && r.part === part && r.read === read && r.sign === sign);
  const eW = rd('Earth', 'MS', 'W'), mW = rd('Mars', 'MS', 'W');
  F.anchor = `共通の点検の数(本節の lib で出た値 —— 経路 ① だけ・係数 1・分母は自分と太陽だけ): 起こす率は 地球 (MS)((W))${eW.raiseLocal.toExponential(4)}・背景(銀河の公転の角速度 × 1・向き −1)${eW.raiseBg1.toExponential(4)}″/年/火星 ${mW.raiseLocal.toExponential(4)}・${mW.raiseBg1.toExponential(4)}″/年。`;
  const dv = J.den.rows.map((r) => r.parts.MS.relInOut);
  F.den = `局所の分母の列: in ÷ out − 1 は 16 組の全部の行で ${fe(Math.min(...dv))}〜${fe(Math.max(...dv))}(向きの差は ${f1(Math.max(...J.den.rows.map((r) => r.parts.MS.angDeg)))}°)。銀河の重み ÷ 太陽の重み(中心の値)は ${fe(Math.min(...J.den.rows.map((r) => r.wGalOverSun)))}〜${fe(Math.max(...J.den.rows.map((r) => r.wGalOverSun)))}・銀河の重み ÷ 箱の重みは ${fe(Math.min(...J.den.incl.map((r) => r.wGalOverBox)))}〜${fe(Math.max(...J.den.incl.map((r) => r.wGalOverBox)))}。`;
  F.incl = `(B1) の背景の係数 1 − f は在位の形(W₀ = 0)で 16 組とも ${f3(J.den.incl[0].coefW0[0])}・W₀ = 自分の重みの中心の値で ${f3(Math.min(...J.den.incl.map((r) => r.coefW0[1])))}〜${f3(Math.max(...J.den.incl.map((r) => r.coefW0[1])))} —— (B1) では在位の形の背景軸引きずりは 0、(B2) では W₀ に依らず 1。`;
  const cnt = (read, sign, part, scope) => J.counts.find((c) => c.read === read && c.sign === sign && c.part === part && c.scope === scope);
  F.count = `第147報の文に当たる行(背景が起こす ∧ 太陽由来が倒す —— (C2)・向き −1・8 惑星): (M) ${cnt('C2', -1, 'M', 'planets').hit}・(S) ${cnt('C2', -1, 'S', 'planets').hit}・(MS) ${cnt('C2', -1, 'MS', 'planets').hit}。(甲) の根が在る惑星: (M) ${cnt('C2', -1, 'M', 'planets').kou}・(S) ${cnt('C2', -1, 'S', 'planets').kou}・(MS) ${cnt('C2', -1, 'MS', 'planets').kou}(向き +1 では ${cnt('C2', 1, 'M', 'planets').kou}・${cnt('C2', 1, 'S', 'planets').kou}・${cnt('C2', 1, 'MS', 'planets').kou})。(W) の数は (C2) と同じ: ${['M', 'S', 'MS'].map((p) => cnt('W', -1, p, 'planets').hit + '/' + cnt('W', -1, p, 'planets').kou).join('・')}(当たる/根)。`;
  const kouNames = (part) => J.reads.filter((r) => r.read === 'C2' && r.sign === -1 && r.part === part && r.src === 'Sun' && PL.includes(r.id) && r.uKou !== null).map((r) => NM[r.id]).join('・');
  F.kouNames = `(甲) の根が在る惑星((C2)・向き −1): (M)(MS) は ${kouNames('MS')}・(S) は ${kouNames('S')}。`;
  const pr = J.reads.filter((r) => r.read === 'C2' && r.sign === -1 && r.src === 'Sun' && PL.includes(r.id));
  const kinds = (part) => { const x = pr.filter((r) => r.part === part); return `u 0 で最小 ${x.filter((r) => r.uOtsu === 0).length}・途中の u ${x.filter((r) => typeof r.uOtsu === 'number' && r.uOtsu > 0).length}・u → ∞ ${x.filter((r) => r.uOtsu === 'inf').length}・δ の最小が 0 の惑星 ${x.filter((r) => r.deltaMinDeg === 0).length}`; };
  F.otsu = `(乙) の δ の最小の置き場(8 惑星・(C2)・向き −1): (M) ${kinds('M')}/(S) ${kinds('S')}/(MS) ${kinds('MS')}。`;
  const g = J.geo.filter((r) => r.sign === -1), bgA = g.map((r) => r.bgToNorthDeg);
  const inR = (part) => g.filter((r) => r.part === part && r.inRange).map((r) => NM[r.id]).join('・') || 'なし';
  F.geo = `背景(向き −1)と公転の北極の角は 8 惑星で ${f1(Math.min(...bgA))}〜${f1(Math.max(...bgA))}°。(S) + 背景 の合成の向きは公転の北極から ${f1(Math.min(...g.filter((r) => r.part === 'S').map((r) => r.minDeg)))}° より外・(M) または (MS) + 背景 は 0〜${f1(Math.max(...g.filter((r) => r.part === 'MS').map((r) => r.maxDeg)))}° の内。観測の傾きが範囲の内に在る惑星: (S) ${inR('S')}/(MS) ${inR('MS')}。`;
  const vM = J.venus.vu.find((v) => v.part === 'MS'), vS = J.venus.vu.find((v) => v.part === 'S');
  const side = (part, kind) => { const x = J.venus.rows.filter((r) => r.part === part && r.kind === kind && r.src === 'Sun' && PL.includes(r.id)); return `太陽由来が大きい ${x.filter((r) => r.side === 'sun').map((r) => NM[r.id]).join('・') || 'なし'}/背景が大きい ${x.filter((r) => r.side === 'bg').map((r) => NM[r.id]).join('・') || 'なし'}`; };
  F.venus = `金星で (甲) を満たす u は (MS) ${vM.uKou === null ? '解なし' : fe(vM.uKou)}・(S) ${vS.uKou === null ? '解なし' : fe(vS.uKou)}、(丙) の u は (MS) ${fe(vM.uHei)}・(S) ${fe(vS.uHei)}。(MS) の (甲) の u では ${side('MS', 'kou')}。(MS) の (丙) の u では ${side('MS', 'hei')}。`;
  const zeroAt = (part, kind) => { const x = J.venus.rows.filter((r) => r.part === part && r.kind === kind && r.src === 'Sun' && PL.includes(r.id) && r.kouOverV !== null); return x.map((r) => `${NM[r.id]} ${fe(r.kouOverV)}`).join('・') || 'なし'; };
  F.both = `金星の u を当てたとき、各惑星の (甲) の根 ÷ 金星の u: (MS)・(甲) の u で ${zeroAt('MS', 'kou')}/(S)・(丙) の u で ${zeroAt('S', 'hei')}(根の無い惑星は書いていない)。`;
  const st = (id, part, kind, f) => J.steps.find((r) => r.id === id && r.part === part && r.kind === kind && r.f === f);
  const eh = st('Earth', 'MS', 'hei', 1), vk = st('Venus', 'MS', 'kou', 1), vk0 = st('Venus', 'MS', 'kou', 0);
  F.step = `步(f 1 —— 寄るだけ・無次元の時間 10): 地球 (MS)・(丙) の u で傾き ${f1(eh.eps0Deg)} → ${f1(eh.epsEndDeg)}°(合成の向きは公転の北極から ${f1(eh.eqToNorthDeg)}°)・金星 (MS)・(甲) の u で ${f1(vk.eps0Deg)} → ${f1(vk.epsEndDeg)}°(始めの合成の向きとのなす角 ${f1(vk.th0Deg)}° —— 本便の枝 d の読み (α) で 90° を越える)。f 0(歳差だけ)では金星の傾きは ${f1(vk0.eps0Deg)} → ${f1(vk0.epsEndDeg)}°・合成の向きとのなす角は保たれる(${f1(vk0.th0Deg)} → ${f1(vk0.thEndDeg)}°)。`;
  return F;
}

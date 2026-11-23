// 第348便c(原仮定者の回答(2026-11-23 —— 第145報の回答 10)の AN976・統括の検証項目 R411):
// **正本 tests/out/axisbalance-348c.json から PHYSICS〔第348便c〕の表を作る文書の lib**
// (QA docs.axisbalance348c が節の表と逐語で照合する —— 表の数は有効数字 3 桁・角は小数 2 桁)。原文(言葉を変えずに引く)もここに持つ。
export const DOC_VERSION = 'w348c-axisbalancedoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
const f2 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(2));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const NM = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星', Moon: '月', Io: 'イオ', Pluto: '冥王星',
  Sun: '太陽', EarthHi: '地球(傾きの最大の位相)', EarthLo: '地球(傾きの最小の位相)', Charon: 'カロン' });
const GRP = Object.freeze({ rock: '岩石', gas: 'ガス', ice: '氷', moon: '衛星' });
const CAND = Object.freeze({ W: '(W)', P2: '(P2)' });
const ROLE = Object.freeze({ lit: '文献の値', order: '桁' });
const sense = (d) => (d < 90 ? '順・逆' : d > 90 ? '逆・順' : '—');

/** 原文(訂正の鎖 —— 当時の文を消さずに並べる。言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の指示(2026-11-22 —— 第145報の補足 1)', '引きずられる側の自転軸に直交する回転成分を、ジャイロトルクの計算に使用する。「トルク=慣性モーメント*自転速度*直交する回転成分」が、自転方向に90度ズレた力で現れる。結果的に自転軸を軸引きずりの回転軸に向けて起こす力になる。継続した自転軸を起こす力が歳差運動になる']),
  Object.freeze(['原仮定者の回答(2026-11-22 —— 第145報の回答 9)', 'AN969: ２つのケースを検証する。１つ目は、『エネルギーの行き先は、自転の「引きずり回転」』。２つ目は、『自転速度が増すと、角運動量が増して、トルクが増し、傾きにくくなり釣り合う』']),
  Object.freeze(['原仮定者の回答(2026-11-23 —— 第145報の回答 10)', 'AN976: 安定している運行は、結果として釣り合っている。釣り合う向きは、銀河由来と太陽由来の軸引きずりを重みで合成した方向。その方向と観測の向きが違う場合は、ジャイロトルクで釣り合いつつ歳差運動をしている。天体の構造別に軸引きずりの利き方に差異が予想され、観測半径に対する引きずられ半径の係数がノブの候補']),
  Object.freeze(['原仮定者の回答(2026-11-23 —— 第145報の回答 10)', 'AN977: 実装は変えず、kFrameとqの引きずりは、「引きずり近似」として扱う。並進引きずりだけでなく、近距離での効きの違いも含んでいる']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えたこと] */
export const READINGS = Object.freeze([
  Object.freeze(['当時の文(〔第347便h〕表 1 —— 消さずに残す)。トルク τ = I ω abs(Ω⊥)・軸を起こす向きと歳差の向きの読みは〔第347便h〕の (g1)〜(g3) の列', '表 6 のトルクと歳差の率(歳差の率 = τ ÷ (I ω sin δ) = abs(Ω_釣))']),
  Object.freeze(['当時の文。「釣り合う」の形を〔第347便i〕で (Tc) 整列・(Tbc) 上限・(Td) 2 つの源に並べた(〔第347便i〕の ⑤ の (B)(C) —— 統括の推奨は (Ta)+(Tc)〔軸が起きてそろう形〕)', '〔第347便i〕表 5〜表 7']),
  Object.freeze(['「釣り合う」の形への答え: 釣り合う向き ê_釣 ∝ w_G â_G + w_S â_S(重みの型 W1・W2・W3 を列に —— 衛星は母天体の項の列も)。観測の自転軸と ê_釣 のなす角 δ ≠ 0 の天体は、ê_釣 のまわりを歳差していると読む。係数 c_R = 引きずられ半径 ÷ 観測半径を構造の組ごとのノブの候補に置く(入り方の候補 4 つ)', '表 3〜表 12']),
  Object.freeze(['q = 0(引きずり減衰なし —— 並進引きずりの定義の「半径を見ない」のとおり)の列を必ず置く。q 2・3 は今の実装の近い所の効き方の列(「引きずり近似」の語と用語の文は本便の枝 a)', '表 3〜表 12 の q 0 の行']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}
const pairName = (r) => `${NM[r.id]} | ${NM[r.src]}`;

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① w_G = 0 で太陽由来の軸に一致(角 [deg]) | ${fe(S.z1)} | ${tf(G.galZero)} |`,
    `| ② w_S = 0 で銀河由来の軸に一致(角 [deg]) | ${fe(S.z2)} | ${tf(G.sunZero)} |`,
    `| ③ 重みの入れ替え: 比 r の向きの太陽由来の軸からの角 = 比 1/r の向きの銀河由来の軸からの角(r 0.1・1・10 の差の最大 [deg]) | ${fe(S.sw)} | ${tf(G.swap)} |`,
    `| ④ δ = 0 で歳差 0(トルク・軸の先の速さ・歳差の率) | ${fe(S.p4tq)}・${fe(S.p4tip)}・${fe(S.p4prec)} | ${tf(G.deltaZero)} |`,
    `| ⑤ c_R = 1・q 2・3・D₀ 0 で〔第347便h〕の (iv)(表 9 の (W) と (P2) のベクトル)に一致(15 組 × q 2 × 候補 2 の相対の差の最大) | ${fe(S.hMax)} | ${tf(G.vsH)} |`,
    `| ⑥ q = 0・D₀ 0 は剛体の回転(太陽由来の (W) = ws ŝ・銀河由来 = ω_G ĝ —— 相対の差の最大) | ${fe(S.rigid)} | ${tf(G.rigid)} |`,
    `| ⑦ (P2) の腕 → 0 の極限 ê × (J ê) と腕 1e-4 の差分(相対の差)・銀河由来の項の方位による違いの最大 | ${fe(S.p2lim)}・${fe(S.galSpread)} | ${tf(G.p2limit)} |`,
    `| ⑧ W2(比 ρ・太陽の軸と −G)で〔第344便e〕の 120° の例に戻る(銀河との角 [deg])/変異(重みを落とす)の角/変異(銀河の向きを逆に)で銀河由来の項が回る角 [deg] | ${f3(S.deg120)}/${f3(S.mut120)}/${f3(S.galFlip)} | ${tf(G.w120)} |`,
    `| ⑨ c_R 2 の歳差の率の倍(k0・kI2・kI5)/変異(冪を落とす)の倍/要る c_R の往復の相対の差 | ${S.crf.map(f3).join('・')}/${f3(S.crMut)}/${fe(S.rt)} | ${tf(G.cR)} |`,
    `| ⑩ 入力の拒否(項なし・負の重み・慣性モーメント 0・入り方の名・c_R 0・q < 0) | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  T.balance = ['| 天体 | 源 | 候補 | q | abs(Ω_G) ÷ abs(Ω_S) | Ω_G と自転軸の角 | Ω_S と自転軸の角 | W1: 黄道の極との角・銀河の回転の向き G との角・δ | W2: 黄道・G・δ | W3(比 1): δ | W1 + 母天体の項: δ |', '|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.balance.filter((r) => r.d0k === 0).map((r) => `| ${pairName(r)} | ${CAND[r.cand]} | ${r.q} | ${fe(r.galOverSun)} | ${f2(r.galToSpinDeg)} | ${f2(r.sunToSpinDeg)} | ${f2(r.W1.eclDeg)}・${f2(r.W1.galDeg)}・${f2(r.W1.deltaDeg)} | ${f2(r.W2.eclDeg)}・${f2(r.W2.galDeg)}・${f2(r.W2.deltaDeg)} | ${f2(r.W3['1'].deltaDeg)} | ${r.W1P ? f2(r.W1P.deltaDeg) : '—'} |`)].join('\n');
  const d0 = [];
  for (const q of [0, 2, 3]) for (const c of ['W', 'P2']) {
    let a1 = 0, a2 = 0, p1 = 0;
    for (const r of J.balance.filter((x) => x.q === q && x.cand === c && x.d0k === 0)) {
      const s = J.balance.find((x) => x.id === r.id && x.src === r.src && x.q === q && x.cand === c && x.d0k === 1);
      a1 = Math.max(a1, Math.abs(s.W1.deltaDeg - r.W1.deltaDeg)); a2 = Math.max(a2, Math.abs(s.W2.deltaDeg - r.W2.deltaDeg)); p1 = Math.max(p1, Math.abs(s.W1.magYr / r.W1.magYr - 1));
    }
    d0.push(`| ${CAND[c]} | ${q} | ${f2(a1)} | ${f2(a2)} | ${f3(p1)} |`);
  }
  T.d0 = ['| 候補 | q | W1 の δ の違いの最大 [deg] | W2 の δ の違いの最大 [deg] | W1 の abs(Ω_釣) の相対の違いの最大 |', '|---|---|---|---|---|', ...d0].join('\n');
  T.ex120 = ['| 重みの型 | 候補 | q | D₀ | 比 w_G ÷ w_S | 銀河の回転の向き G との角 [deg] | 黄道の極との角 [deg] | 太陽の軸との角 [deg] |', '|---|---|---|---|---|---|---|---|',
    ...J.ex120.rows.map((r) => `| ${r.type} | ${r.cand ? CAND[r.cand] : '—'} | ${r.q === undefined ? '—' : r.q} | ${r.d0k === undefined ? '—' : r.d0k} | ${fe(r.ratio)} | ${f2(r.galDeg)} | ${f2(r.eclDeg)} | ${f2(r.sunDeg)} |`)].join('\n');
  T.prec = ['| 天体 | 源 | 候補 | q | W1: δ [deg] | W1: 歳差の率 [″/年] | 回り((g2+)・(g2−) —— 自転に対して) | W1: トルク [N·m] | W2: δ・歳差の率 [″/年] | 衛星 W1 + 母天体の項: δ・歳差の率 [″/年] | 比べる列 [″/年](第330便a の lib —— 文献の値・未照合) | W1 ÷ 比べる列 |',
    '|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.prec.filter((r) => r.rep).map((r) => `| ${NM[r.id]} | ${NM[r.src]} | ${CAND[r.cand]} | ${r.q} | ${f2(r.W1.deltaDeg)} | ${fe(r.W1.precAsYr)} | ${sense(r.W1.deltaDeg)} | ${fe(r.W1.torque)} | ${f2(r.W2.deltaDeg)}・${fe(r.W2.precAsYr)} | ${r.W1P ? f2(r.W1P.deltaDeg) + '・' + fe(r.W1P.precAsYr) : '—'} | ${r.obsAsYr === null ? '—' : fe(r.obsAsYr) + (r.obsRole === 'order' ? '(桁)' : '')} | ${fe(r.W1.ratio)} |`)].join('\n');
  T.cR = ['| 天体 | 構造の組 | q | 歳差の率 c_R 1 [″/年](W1・(W)) | (kI2) c_R 0.5・2 | (kI5) c_R 0.5・2 | 比べる列 [″/年] | 要る c_R (kI2): W1・W2・W1 + 母天体 | 要る c_R (kI5): W1・W2・W1 + 母天体 |', '|---|---|---|---|---|---|---|---|---|',
    ...J.cR.map((r) => { const W1 = r.per.W1, W2 = r.per.W2, WP = r.per.W1P, nd = (x, k) => (x && x.need ? fe(x.need[k]) : '—');
      return `| ${NM[r.id]} | ${GRP[r.group]} | ${r.q} | ${fe(W1.precAsYr)} | ${fe(W1.swept.kI2['0.5'])}・${fe(W1.swept.kI2['2'])} | ${fe(W1.swept.kI5['0.5'])}・${fe(W1.swept.kI5['2'])} | ${r.obsAsYr === null ? '—' : fe(r.obsAsYr) + (r.obsRole === 'order' ? '(桁)' : '')} | ${nd(W1, 'kI2')}・${nd(W2, 'kI2')}・${nd(WP, 'kI2')} | ${nd(W1, 'kI5')}・${nd(W2, 'kI5')}・${nd(WP, 'kI5')} |`; })].join('\n');
  T.spread = ['| 構造の組 | q | 重み | 入り方 | 比べる列の在る天体の数 | 天体 | 要る c_R の最小・最大 | 最大 ÷ 最小 |', '|---|---|---|---|---|---|---|---|',
    ...J.spread.filter((r) => r.group === 'rock' || r.n > 0).map((r) => `| ${GRP[r.group]} | ${r.q} | ${r.weight} | (${r.pow}) | ${r.n} | ${r.ids.map((x) => NM[x]).join('・') || '—'} | ${fe(r.min)}・${fe(r.max)} | ${r.spread === null ? '—(1 つ以下)' : f3(r.spread)} |`)].join('\n');
  T.cRp2 = ['| 天体 | 源 | q | 腕 ÷ 道の半径(c_R 1) | (P2) の大きさの相対の変わり c_R 0.5・2 |', '|---|---|---|---|---|',
    ...J.cRp2.map((r) => `| ${NM[r.id]} | ${NM[r.src]} | ${r.q} | ${fe(r.RbOverA)} | ${fe(r.rel['0.5'])}・${fe(r.rel['2'])} |`)].join('\n');
  T.rd = ['| 天体 | 質量 [kg] | 観測半径 R [m] | 引きずり半径 R_d = Y_k m [m](EQ-14) | R_d ÷ R | 要る c_R(q 2・W1・(W) —— (kI2)・(kI5)) |', '|---|---|---|---|---|---|',
    ...J.rd.rows.map((r) => `| ${NM[r.id]} | ${fe(r.m)} | ${fe(r.R)} | ${fe(r.Rd)} | ${fe(r.RdOverR)} | ${fe(r.needQ2W1kI2)}・${fe(r.needQ2W1kI5)} |`)].join('\n');
  T.heat = ['| 天体 | 源 | q | 候補 | 散逸の項なし(歳差だけ)[W] | 散逸の項・合成 abs(Ω_釣⊥)² [W] | 散逸の項・源ごとの和 Σ abs(Ω_k⊥)² [W] | 物差し [W] | 合成 ÷ 物差し | 源ごとの和 ÷ 物差し |', '|---|---|---|---|---|---|---|---|---|---|',
    ...J.heat.rows.map((r) => `| ${NM[r.id]} | ${r.srcs} | ${r.q} | ${CAND[r.cand]} | 0 | ${fe(r.sum)} | ${fe(r.each)} | ${fe(r.ruler)} | ${fe(r.sumRatio)} | ${fe(r.eachRatio)} |`)].join('\n');
  return T;
}

export function factsOf(J) {
  const F = {}, B = J.balance.filter((r) => r.d0k === 0), q0 = B.filter((r) => r.q === 0 && r.cand === 'W');
  const maxSun0 = Math.max(...q0.map((r) => r.W1.sunAxDeg)), gs0 = q0[0].galOverSun;
  F.q0 = `- q 0・D₀ 0 では、太陽由来の (W) は太陽の自転 ws ŝ そのもの(剛体の回転 —— 表 2 の ⑥)で、銀河由来の項との大きさの比は ${fe(gs0)}。W1 の ê_釣 と太陽の自転軸の角の最大は ${fe(maxSun0)}° —— この列では、釣り合う向きは太陽の自転軸に寄り、歳差の率(W1)は ${fe(q0[0].W1.precAsYr)}″/年(どの天体でも同じ —— abs(Ω_釣) が太陽の自転の速さ)。`;
  const ex = J.ex120.rows, w2 = ex.find((r) => r.type === 'W2'), w31 = ex.find((r) => r.type === 'W3' && r.ratio === 1), w1 = ex.filter((r) => r.type === 'W1');
  F.ex120 = `- 120° の例: W2(比 ρ ${f3(J.ex120.rho)})で銀河と ${f2(w2.galDeg)}°(〔第344便e〕の作りどおり)・W3 の比 1 で ${f2(w31.galDeg)}°・W1(地球の行の大きさの比 ${fe(Math.min(...w1.map((r) => r.ratio)))}〜${fe(Math.max(...w1.map((r) => r.ratio)))})では ${f2(Math.min(...w1.map((r) => r.galDeg)))}〜${f2(Math.max(...w1.map((r) => r.galDeg)))}°(太陽の軸と銀河の向き G の角 ${f2(J.ex120.sunGalDeg)}° に寄る —— 銀河由来の項が小さい)。`;
  const sp = J.spread.filter((r) => r.group === 'rock' && r.weight === 'W1' && r.pow === 'kI2'), others = J.spread.filter((r) => r.group !== 'rock' && r.weight === 'W1' && r.pow === 'kI2' && r.q === 2);
  F.spread = `- 要る c_R(W1・(W)・(kI2))の岩石の組(${sp[0].ids.map((x) => NM[x]).join('・')} —— 水星の桁の行は除く)の最大 ÷ 最小: q 0 ${f3(sp.find((r) => r.q === 0).spread)}・q 2 ${f3(sp.find((r) => r.q === 2).spread)}・q 3 ${f3(sp.find((r) => r.q === 3).spread)}。ほかの組の比べる列の数(q 2): ${others.map((r) => GRP[r.group] + ' ' + r.n).join('・')} —— 組の中でそろうか、ばらつくかは、比べる列が 2 つ以上在る岩石の組でだけ数えられる。`;
  const ioq = (q, c) => J.heat.rows.find((r) => r.id === 'Io' && r.q === q && r.cand === c), juq = (q, c) => J.heat.rows.find((r) => r.id === 'Jupiter' && r.q === q && r.cand === c);
  F.heat = `- 熱の窓(イオが物差しを超えない・木星が物差しの 0.1 倍に届く)を両方満たす組(q 3 × 候補 2): 合成の読み ${J.heat.windowSum}・源ごとの和の読み ${J.heat.windowEach}。q 2・(W): イオ ${fe(ioq(2, 'W').sumRatio)}・木星 ${fe(juq(2, 'W').sumRatio)}(〔第347便h〕表 16 と同じ桁)/q 0: イオ ${fe(ioq(0, 'W').sumRatio)}・木星 ${fe(juq(0, 'W').sumRatio)}(物差しを桁で超える)。散逸の項の無い型(歳差だけ)では熱は 0。`;
  const d0 = (q, c) => { let a = 0; for (const r of J.balance.filter((x) => x.q === q && x.cand === c && x.d0k === 0)) { const s = J.balance.find((x) => x.id === r.id && x.src === r.src && x.q === q && x.cand === c && x.d0k === 1); a = Math.max(a, Math.abs(s.W1.deltaDeg - r.W1.deltaDeg)); } return a; };
  F.d0 = `- D₀(源の重みの道での値の 1 倍)で W1 の δ が動く最大: (W) q 0 ${f2(d0(0, 'W'))}°・q 2 ${f2(d0(2, 'W'))}°・q 3 ${f2(d0(3, 'W'))}°/(P2) q 0 ${f2(d0(0, 'P2'))}°・q 2 ${f2(d0(2, 'P2'))}°・q 3 ${f2(d0(3, 'P2'))}° —— (W) の q 2 は赤道の向きで 1 − q/2 の打ち消しが在り、D₀ の項が向きを大きく変える。`;
  const e2 = J.prec.find((r) => r.id === 'Earth' && r.cand === 'W' && r.q === 2);
  F.earth = `- 地球(W1・(W)・q 2・D₀ 0): δ ${f2(e2.W1.deltaDeg)}°・歳差の率 ${fe(e2.W1.precAsYr)}″/年(比べる列 ${fe(e2.obsAsYr)}″/年 との比 ${fe(e2.W1.ratio)})・W2 では δ ${f2(e2.W2.deltaDeg)}°。銀河の受け手の道の距離(GALAXY の 2 つの値からの円の道)は ${fe(J.galDistM)} m。`;
  const gs = (q) => { const v = B.filter((r) => r.q === q && r.galOverSun > 0).map((r) => r.galOverSun); return `${fe(Math.min(...v))}〜${fe(Math.max(...v))}`; };
  const over = [...new Set(B.filter((r) => r.galOverSun > 1).map((r) => NM[r.id]))];
  F.gs = `- abs(Ω_G) ÷ abs(Ω_S)(表 3 の 15 組 × 候補 2・0 の組を除く): q 0 ${gs(0)}・q 2 ${gs(2)}・q 3 ${gs(3)}。1 を超える組の天体: ${over.join('・') || '無し'}(q 3 —— 太陽から遠い道で太陽由来の項が小さい)。銀河由来の項が打ち消しで 0 になる組: (P2) の q 2・D₀ 0 と (W) の q 3・D₀ 1(距離 ÷ 半径 = 1 の宣言の下 —— 重みの型に依らず ê_釣 は太陽由来の軸)。`;
  return F;
}

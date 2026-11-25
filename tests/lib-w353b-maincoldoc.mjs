// 第353便b(原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R466):
// **正本 tests/out/maincol-353b.json から PHYSICS〔第353便b〕の表を作る文書の lib**
// (QA docs.maincol353b が節の表と逐語で照合する —— 表の数は有効数字 3〜5 桁)。原文(言葉を変えずに引く)と読みの表もここに持つ。
export const DOC_VERSION = 'w353b-maincoldoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fe = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const fx = (x, n = 3) => (!fin(x) ? '—' : Number(x).toFixed(n));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const fl9 = (x) => (!fin(x) ? '—' : x === 0 ? '0' : x < 1e-9 ? '< 1e-9' : Number(x).toExponential(1));
const BODYN = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星', Sun: '太陽' });
const spinN = (x) => (x === 1 ? '順回転' : x === -1 ? '逆回転' : '—');
const progN = (x) => (x === 1 ? '順行' : x === -1 ? '逆行' : '—');
const relN = (x) => (x === 1 ? '同じ回り' : x === -1 ? '逆回り' : '—');
const sameN = (x) => (x === true ? '同じ' : x === false ? '逆' : '—');

/** 原文(言葉を変えずに引く)—— [出どころ, 原文] */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)AN1032', '順回転なら、歳差運動は逆回転になる']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)AN1033', '太陽系の基準軸の向き']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)AN1039', '角運動量の重み。計算が合う方式を採用する']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', '向きと大きさは別々に合わせて良い']),
]);
/** 統括の読みと本節の数え方(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['歳差の式の主の列 = (g2−) dŝ/dt = −Ω × ŝ(「こまの式」)。(g2+) は比べる列。「逆回転」は、自転の向き(ŝ のまわりの右ねじ)に対して、合成の軸 Ω̂ のまわりを逆に回ること(相対の回り −1)と読む', '表 2・表 3']),
  Object.freeze(['背景の向きの主の列 = (N+)(基準軸の向き)。(G−) は比べる列', '表 2・表 3']),
  Object.freeze(['基準軸の主の列 = L(角運動量の重み —— 太陽の円錐 5.968°)。eq(等しい重み)は比べる列', '表 2']),
  Object.freeze(['背景の大きさは窓 0.0487〜0.835(1 つの値に置かない)と注目の列 0.98(窓の上端より上)。向き(円錐・回る向き)と大きさ(率)を別の欄で並べる', '表 2・表 5']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読みと本節の数え方 —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 第352便j の cellOf と同じ数((N+)(G−) × L・eq × (g2−)(g2+) × 8 惑星 = ${S.nJ} 組 —— 相対の差の最大) | ${fl9(S.vsJ)} | ${tf(G.sameAsJ)} |`,
    `| ② 第352便w の stateW と同じ Ω・円錐((N+)・L・倍率 0.98) | ${fl9(S.vsW)} | ${tf(G.sameAsW)} |`,
    `| ③ 太陽の行 = 第352便e の sunTotal | ${fl9(S.sunErr)} | ${tf(G.sunRow)} |`,
    `| ④ 統括の数え直し 3: 基準軸 L(${S.L.map((x) => x.toFixed(6)).join(', ')})・eq との角 ${fx(S.angLEq, 4)}°・ω_G ${fe(S.omegaG)} rad/s | — | ${tf(G.anchorAxis)} |`,
    `| ⑤ 統括の数え直し 3: 金星の受け手の半径の置き方 6 行(等大の倍率 ÷ k・φ・等大の残り ÷ 背景 —— 規則の半径で φ ${fx(S.venus[0].phi, 4)}°・残り ${S.venus[0].res.toFixed(6)}) | — | ${tf(G.anchorVenus)} |`,
    `| ⑥ 統括の数え直し 3: 8 惑星の φ(規則の半径 → cR 1) | — | ${tf(G.anchorPhi)} |`,
    `| ⑦ (g2−) と (g2+) は方位の率が全部逆・円錐と率は同じ | ${fl9(S.flip)} | ${tf(G.g2Flip)} |`,
    `| ⑧ 単位の応答: 合成の軸のまわりの方位の率の大きさ = abs Ω・一周の年数 × 率 = 1 周・(g2−) の相対の回り = −(ŝ·Ω の符号) | ${fl9(S.unitErr)} | ${tf(G.unitResp)} |`,
    `| ⑨ k は局所だけに掛かる | ${fl9(S.kErr)} | ${tf(G.kLocal)} |`,
    `| ⑩ 太陽の円錐(基準軸 L のまわり) | ${fx(S.sunCone, 4)}° | ${tf(G.sunCone)} |`,
    `| ⑪ 変異 3(局所を落とす・基準軸を入れ替える・式の向きを入れ替える)で落ちる | — | ${tf(G.mutants)} |`,
    `| ⑫ 仮の値との並べは印つき・判定の側へ渡すと例外 | — | ${tf(G.provMark)} |`,
    `| ⑬ 拒否(受け手・倍率・背景の向き・基準軸・式の向き・太陽の受け手の半径・格子) | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  // 表 2: 主の表
  T.main = ['| 受け手 | 倍率 u | 合成と L の角 ° | 円錐の半頂角 ° | 局所 ÷ 背景 | ŝ·Ω | 自転(L に対して) | (g2−) 合成の軸のまわり | (g2−) 基準軸のまわり | 単位の応答の率 ″/年 | 一周の年数 | 比べる列 (g2+) 合成の軸のまわり | 比べる列 (G−): 合成と L の角 °・円錐 °・合成の軸/基準軸のまわり | 比べる列 eq: 円錐 °・合成と eq の角 ° |',
    '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.t1.map((r) => { const m = r.main, c = r.cmp;
      return `| ${BODYN[r.id]} | ${r.u} | ${fe(m.omToAxisDeg)} | ${fx(m.coneDeg)} | ${fe(m.locOverBg)} | ${spinN(m.spinOm)} | ${progN(m.spinAx)} | ${relN(m.relOm)} | ${relN(m.relAx)} | ${fe(m.precAsYr)} | ${fe(m.periodYr)} | ${relN(c.g2p.relOm)} | ${fx(c.Gm.omToAxisDeg)}・${fx(c.Gm.coneDeg)}・${relN(c.Gm.relOm)}/${relN(c.Gm.relAx)} | ${fx(c.eq.coneDeg)}・${fe(c.eq.omToAxisDeg)} |`; })].join('\n');
  // 表 3: 回る向きのまとめ
  T.sense = ['| 受け手 | ŝ·Ω(自転と合成の軸引きずり回転) | cos(ŝ, Ω) | 自転(L に対して) | (g2−) 合成の軸のまわり | (g2−) 基準軸 L のまわり | (g2−) 自分の公転の北極のまわり | (g2−) 黄道の極のまわりの方位の率 ″/年 | 比べる列 (g2+) 合成の軸のまわり |', '|---|---|---|---|---|---|---|---|---|',
    ...J.t2.rows.map((r) => `| ${BODYN[r.id]} | ${spinN(r.spinOm)} | ${fx(r.cosOm, 4)} | ${progN(r.spinAx)} | ${relN(r.om && r.om.rel)} | ${relN(r.ax && r.ax.rel)} | ${r.orb ? relN(r.orb.rel) : '—(公転の北極なし)'} | ${fe(r.eclAz * 206264.80624709636 * 365.25 * 86400)} | ${relN(r.g2pRelOm)} |`)].join('\n');
  // 表 4: 仮の値との並べ(印つき)
  const PN = Object.freeze({ Earth: '黄道の極', Mars: '自分の公転の北極', Venus: '—(大きさだけ)' });
  T.prov = ['| 天体 | 式 | 比べる極 | 極のまわりの方位の率 ″/年(単位の応答・倍率 0.98) | 仮の値と回る向き(仮・未照合) | 要る倍: 仮の率 ÷ 合成の率(仮・未照合) |', '|---|---|---|---|---|---|',
    ...J.t2.prov.map((r) => `| ${BODYN[r.id]} | ${r.sense === 'g2m' ? '(g2−) 主' : '(g2+) 比べる列'} | ${PN[r.id]} | ${fe(r.azPoleAsYr)} | ${sameN(r.sameSense)} | ${fe(r.needOm)} |`)].join('\n');
  // 表 5: u への依存
  T.udep = ['| 受け手 | 円錐の半頂角 °(u 0.0487) | 円錐の幅 °(u 6 点) | 合成と L の角の幅 ° | 率 ÷ u の幅(最大 ÷ 最小 − 1) | 率 ÷ (u ω_G) | 回る向きの替わり(合成の軸・基準軸) | 局所 ÷ 背景の最大 |', '|---|---|---|---|---|---|---|---|',
    ...J.t3.map((r) => `| ${BODYN[r.id]} | ${fx(r.coneDeg)} | ${fe(r.coneSpanDeg)} | ${fe(r.axisSpanDeg)} | ${fe(r.rateOverURel)} | ${fx(r.rateOverUOmegaG, 6)} | ${r.flipsOm}・${r.flipsAx} | ${fe(r.maxLocOverBg)} |`)].join('\n');
  // 表 6: 受け手の半径の置き方 cR への依存(窓の下端)
  T.cr = ['| 受け手 | 局所 ÷ 背景(規則の半径) | cR 1e-2: 局所 ÷ 背景・合成と L の角 °・円錐の動き ° | cR 0.1: 同 | cR 1: 同 | cR 1 の (g2−) 合成の軸のまわり |', '|---|---|---|---|---|---|',
    ...J.t4.map((r) => `| ${BODYN[r.id]} | ${fe(r.base.locOverBg)} | ${r.rows.map((q) => `${fe(q.locOverBg)}・${fe(q.omToAxisDeg)}・${fe(q.dConeDeg)}`).join(' | ')} | ${relN(r.rows[2].relOm)} |`)].join('\n');
  return T;
}

/** 数の文(節に逐語) */
export function factsOf(J) {
  const F = {}, at = (id, u) => J.t1.find((r) => r.id === id && r.u === u).main;
  const maxLB = Math.max(...J.t3.map((r) => r.maxLocOverBg)), maxAx = Math.max(...J.t3.map((r) => r.axisSpanDeg)), maxCone = Math.max(...J.t3.map((r) => r.coneSpanDeg));
  const maxId = J.t3.reduce((a, r) => (r.maxLocOverBg > a.maxLocOverBg ? r : a)).id;
  F.dir = `- 主の列では、局所 (S) ÷ 背景は窓の下端 0.0487 でも最大 ${fe(maxLB)}(${BODYN[maxId]})—— 合成の向きは 8 惑星と太陽のどれでも基準軸 L から ${fe(Math.max(...J.t1.map((r) => r.main.omToAxisDeg)))}° の内。円錐の半頂角は自転軸と L の角に等しく、水星 ${fx(at('Mercury', 0.98).coneDeg)}°・金星 ${fx(at('Venus', 0.98).coneDeg)}°・地球 ${fx(at('Earth', 0.98).coneDeg)}°・火星 ${fx(at('Mars', 0.98).coneDeg)}°・木星 ${fx(at('Jupiter', 0.98).coneDeg)}°・土星 ${fx(at('Saturn', 0.98).coneDeg)}°・天王星 ${fx(at('Uranus', 0.98).coneDeg)}°・海王星 ${fx(at('Neptune', 0.98).coneDeg)}°・太陽 ${fx(at('Sun', 0.98).coneDeg)}°。`;
  const rows = J.t2.rows, pro = rows.filter((r) => r.spinOm === 1).map((r) => BODYN[r.id]), ret = rows.filter((r) => r.spinOm === -1).map((r) => BODYN[r.id]);
  const gmFlip = J.t1.filter((r) => r.u === 0.98 && r.cmp.Gm.relOm !== r.cmp.Gm.relAx).map((r) => `${BODYN[r.id]}(合成の軸 ${relN(r.cmp.Gm.relOm)}・基準軸 ${relN(r.cmp.Gm.relAx)})`);
  F.sense = `- (g2−) では、ŝ·Ω > 0(順回転)の ${pro.length} 天体(${pro.join('・')})は合成の軸のまわりを自転と逆回りに歳差し、ŝ·Ω < 0(逆回転)の ${ret.length} 天体(${ret.join('・')})は自転と同じ回りに歳差する —— 合成の軸・基準軸 L・自分の公転の北極の 3 つの極で回りがそろう(主の列では合成の軸 ≈ L のため)。比べる列 (G−)(倍率 0.98)では、${gmFlip.join('・')}で、合成の軸のまわりと基準軸のまわりの回りが替わる。`;
  const e = at('Earth', 0.98), lo = at('Earth', 0.0487), hi = at('Earth', 0.835);
  F.rate = `- 単位の応答の率は受け手に依らず u ω_G(局所が背景の ${fe(maxLB)} 倍より小さいため): 窓の下端 ${fe(lo.precAsYr)}″/年(一周 ${fe(lo.periodYr)} 年)・窓の上端 ${fe(hi.precAsYr)}″/年(一周 ${fe(hi.periodYr)} 年)・注目の列 0.98 で ${fe(e.precAsYr)}″/年(一周 ${fe(e.periodYr)} 年)。u を 6 点で振っても、円錐の幅は最大 ${fe(maxCone)}°・合成と L の角の幅は最大 ${fe(maxAx)}°・回る向きの替わりは 0 —— 向きと円錐は u に依らず、率だけが u に比例する。`;
  const pv = (id, s) => J.t2.prov.find((r) => r.id === id && r.sense === s);
  F.prov = `- 仮の値(仮・未照合)との並べ: 回る向きは (g2−) で地球(黄道の極のまわり)${sameN(pv('Earth', 'g2m').sameSense)}・火星(自分の公転の北極のまわり)${sameN(pv('Mars', 'g2m').sameSense)}、(g2+) で地球 ${sameN(pv('Earth', 'g2p').sameSense)}・火星 ${sameN(pv('Mars', 'g2p').sameSense)}。率は、倍率 0.98 の単位の応答に対して仮の率が地球 ${fe(pv('Earth', 'g2m').needOm)} 倍・火星 ${fe(pv('Mars', 'g2m').needOm)} 倍・金星 ${fe(pv('Venus', 'g2m').needOm)} 倍(合否にしない —— 歳差の率と向きの本体は重力の側の列で読むのが主の読み)。`;
  const all = J.t4.flatMap((r) => r.rows), cr1 = Math.max(...all.map((q) => q.locOverBg)), cr1a = Math.max(...all.map((q) => q.omToAxisDeg)), cr1c = Math.max(...all.map((q) => Math.abs(q.dConeDeg)));
  const nFlip = J.t4.filter((r) => r.rows.some((q) => q.relOm !== J.t1.find((x) => x.id === r.id && x.u === r.u).main.relOm)).length;
  F.cr = `- 受け手の半径を cR 1e-2・0.1・1(× 観測半径)に置いても、窓の下端 0.0487 で局所 ÷ 背景は最大 ${fe(cr1)}・合成と L の角は最大 ${fe(cr1a)}°・円錐の動きは最大 ${fe(cr1c)}°・(g2−) の回る向きが替わる天体 ${nFlip} —— 主の列の向きと円錐は、この 3 つの置き方では背景の向きで定まる。`;
  return F;
}

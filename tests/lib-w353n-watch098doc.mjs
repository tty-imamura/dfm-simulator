// 第353便n(原仮定者の回答(2026-11-25 —— 第151報)「AN1046: C」・統括の検証項目 R478):
// **正本 tests/out/watch098-353n.json から PHYSICS〔第353便n〕の表と数の文を作る文書の lib**
// (QA docs.watch098_353n が節の表と逐語で照合する —— 表の数は有効数字 3 桁・角は 0.01° 以上で小数 3 桁・それより小さい角は指数)。原文(言葉を変えずに引く)と読みの表もここに持つ。
export const DOC_VERSION = 'w353n-watch098doc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fe = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const fa = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Math.abs(x) < 0.01 ? Number(x).toExponential(2) : Number(x).toFixed(3));
const fp = (x) => (!fin(x) ? '—' : Number(x).toPrecision(3));
const ft = (x) => (x === null || x === undefined ? '届かない' : fe(x));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const KEYN = Object.freeze({ 'Mercury|Sun': '水星', 'Venus|Sun': '金星', 'Earth|Sun': '地球', 'Mars|Sun': '火星', 'Jupiter|Sun': '木星', 'Saturn|Sun': '土星', 'Uranus|Sun': '天王星', 'Neptune|Sun': '海王星', 'Sun|-': '太陽' });
const IDN = Object.freeze({ Earth: '地球', Mars: '火星' });
const SEN = Object.freeze({ g2m: '(g2−)', g2p: '(g2+)' });
const WN = Object.freeze({ 100: '100 年', 10000: '1 万年', 1000000: '100 万年', 100000000: '1 億年', 4500000000: '45 億年' });

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1046: C']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', '銀河由来の背景軸引きずりの大きさ: これに注目 『銀河の公転の角速度』の『0.98 倍(銀河の回転と逆向き)』。向きと大きさは別々に合わせて良い']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1045: 「規則の半径」。土星の環は、円盤引きずりが影響している。計算が合う方式を採用する。想定する基準は、引きずる側は「規則の半径と、扁平率」、引きずられる側は「観測半径と、構造の係数のノブ」']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', '歳差の率: 潮汐を併用『「重力の側の潮汐のトルク」は、仮の値の 3〜11% の内に並びます。』']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['C = 「見ている時間の間は変わらない」を安定した歳差の主の読みに置く。見ている時間と変わらないの物差しは置かれていない —— 時間(100 年〜45 億年)と物差し(0.1°・1°)の格子で、変化の量と達する時間を数える', '表 3・表 4']),
  Object.freeze(['注目の列 u = 0.98(背景の大きさ ÷ 銀河の公転の角速度)・向きは (N+) のまま。歳差の一周は受け手に依らず 2π ÷ (0.98 ω_G)', '表 3・表 4・表 6']),
  Object.freeze(['引きずられる側は「観測半径と、構造の係数のノブ」—— 応答の側の率の倍(〔第353便c〕の (P-応) —— 観測半径と文献の慣性モーメントの係数)を率に掛けた列', '表 6']),
  Object.freeze(['歳差の本体は重力の側の列(比べる列 —— DFM の式ではない・率は仮の値)。軸引きずりの歳差は小さい項として 2 つの軸で足す', '表 5']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, D = J.decl, fs = J.fGrid;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 共通の点検の数: 基準軸 L・eq と L の角・ω_G・f の上限の最小(受け手 9)・一周の年数・太陽の周の数・円錐(地球・太陽) | (${S.L.map((x) => x.toFixed(6)).join(', ')})・${S.eqL.toFixed(4)}°・${fe(S.omegaG)} rad/s・${KEYN[S.jMin]} ${fe(S.fMin)}・${fe(S.periodYr)} 年・${fp(S.turnsSun)} 周・${S.chiE.toFixed(3)}°・${S.chiS.toFixed(3)}° | ${tf(G.anchor)} |`,
    `| ② 〔第353便e〕の合成 = 〔第353便b〕の mainState の合成・ŝ(t) の微分 = mainState の dŝ/dt((g2−)・地球・金星・太陽) | ${fe(S.mErr)}・${fe(S.dsErr)} | ${tf(G.sameAsMain)} |`,
    `| ③ f 0: 格子で数えた ε の幅 = 〔第352便w〕の coneRange(地球・3 億年・(g2−) と (g2+)) | ${fe(S.coneErr)}° | ${tf(G.coneSwing)} |`,
    `| ④ χ の閉じた形 = ŝ(t) と Ω の角(f 1e-2・45 億年)・χ が 0.1° 変わる時間の式 | ${fe(S.chiErr)}°・${fe(S.tcErr)}° | ${tf(G.chiClosed)} |`,
    `| ⑤ 達する時間: 地球の ε が 0.1° 変わる時間・その時の変化 − 0.1°・太陽(f 0) | ${fe(S.tr)} 年・${fe(S.trErr)}°・${S.trSun === null ? '届かない' : fe(S.trSun)} | ${tf(G.reach)} |`,
    `| ⑥ 位相ごとの步(〔第352便w〕の phaseRot・wobbleOf・stepPhases —— 地球): 位相のずれ ÷ 合成・揺れ・1 公転の位相ごとの步と平均の步の差 | ${fe(S.pw.varRel)}・${fe(S.pw.ampAs)}″・${fe(S.pw.stepDiffRad)} rad | ${tf(G.phaseStep)} |`,
    `| ⑦ 2 つの軸: 閉じた形 = 刻みの步(誇張した比 0.05)・平均した形 = 刻みの步(f 0.2・比 0.01)・共回りの ε の幅・Ω_c と n̂ の角 | ${fe(S.twoErr)}・${fe(S.avErr)}°・${fe(S.coErr)}°・${fa(S.tilt)}° | ${tf(G.twoAxis)} |`,
    `| ⑧ 率の倍(〔第353便c〕の rateMult —— 地球・観測半径)・倍を掛けた一周 × 倍 ÷ 一周 − 1 | ${fp(S.mE)}・${fe(S.multErr)} | ${tf(G.mult)} |`,
    `| ⑨ 仮の値(地球の歳差の一周・回る向き) | ${fp(S.gE.periodYr)} 年・${S.gE.sign} | ${tf(G.prov)} |`,
    `| ⑩ 拒否(見ている時間 0・向きの名・f > 1・倍 0・物差し 0・刻み 0・n̂ の置き方) | ${S.rejects.length} 件 | ${tf(G.rejects)} |`].join('\n');
  const r1 = (key, f, y) => J.t1.find((r) => r.key === key && r.f === f && r.years === y);
  T.t1 = ['| 受け手 | f | ' + D.windowsYr.map((y) => WN[y] + ': 揺れ °(Δχ °)').join(' | ') + ' |', '|---|---|' + D.windowsYr.map(() => '---|').join(''),
    ...D.keys.flatMap((k) => fs.map((f) => `| ${KEYN[k]} | ${fe(f)} | ${D.windowsYr.map((y) => { const r = r1(k, f, y); return fa(r.swingDeg) + '(' + fa(r.dChiDeg) + ')'; }).join(' | ')} |`))].join('\n');
  T.t1p = ['| 受け手 | f | ' + D.windowsYr.map((y) => WN[y] + ': (g2−) の Δε ° / (g2+) の Δε °').join(' | ') + ' |', '|---|---|' + D.windowsYr.map(() => '---|').join(''),
    ...['Earth|Sun', 'Mars|Sun', 'Venus|Sun'].flatMap((k) => fs.map((f) => `| ${KEYN[k]} | ${fe(f)} | ${D.windowsYr.map((y) => { const r = r1(k, f, y); return fa(r.dEpsEndDeg) + ' / ' + fa(r.dEpsEndP); }).join(' | ')} |`))].join('\n');
  const rb = (key, f) => J.t1b.find((r) => r.key === key && r.f === f);
  T.t1b = ['| 受け手 | f | ε₀ ° | 一周の ε の幅 °(最小〜最大) | ε が 0.1° 変わる時間 年((g2−) / (g2+)) | ε が 1° 変わる時間 年((g2−) / (g2+)) | χ が 0.1° 変わる時間 年 | χ が 1° 変わる時間 年 | 公転の位相ごとの揺れ ″ |', '|---|---|---|---|---|---|---|---|---|',
    ...D.keys.flatMap((k) => fs.map((f) => { const r = rb(k, f);
      return `| ${KEYN[k]} | ${fe(f)} | ${fa(r.eps0Deg)} | ${fa(r.cone.swingDeg)}(${fa(r.cone.minDeg)}〜${fa(r.cone.maxDeg)}) | ${ft(r.tEps.g2m[0])} / ${ft(r.tEps.g2p[0])} | ${ft(r.tEps.g2m[1])} / ${ft(r.tEps.g2p[1])} | ${ft(r.tChi[0])} | ${ft(r.tChi[1])} | ${r.wobble ? fe(r.wobble.ampAs) : '—'} |`; }))].join('\n');
  T.t2 = ['| 受け手 | 向き | f | 重力の側の一周 年(仮) | 軸引きずりの一周 年 | 率の比 | Ω_c と n̂ の角 ° | 2 つの軸: ε の幅 ° | 軸引きずりだけ: ε の幅 ° | 照らしの步 − 閉じた形 ° | 共回り: ε の幅 ° | 2 つの軸(平均した形): Δε ° 1 億年 / 45 億年 | 軸引きずりだけ: Δε ° 1 億年 / 45 億年 |', '|---|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.t2.map((r) => `| ${IDN[r.id]} | ${SEN[r.sense]} | ${fe(r.f)} | ${fp(r.gravPeriodYr)} | ${fe(r.dragPeriodYr)} | ${fe(r.ratio)} | ${fa(r.tiltDeg)} | ${fa(r.combEps.swingDeg)} | ${fa(r.dragEps.swingDeg)} | ${r.stepVsClosedDeg === null ? '—' : fe(r.stepVsClosedDeg)} | ${fe(r.coSwingDeg)} | ${fa(r.avgDEps[3])} / ${fa(r.avgDEps[4])} | ${fa(r.dragDEps[3])} / ${fa(r.dragDEps[4])} |`)].join('\n');
  const r3 = (key, ref) => J.t3.find((r) => r.key === key && r.ref === ref);
  T.t3 = ['| 受け手 | 慣性モーメントの係数(文献の値・未照合) | R_ref 観測: 率の倍 | 一周 年 | 年齢の内の周 | f の上限 | ε が 0.1° 変わる時間 年(f 0・(g2−)) | R_ref 規則(比べる列): 率の倍 | 一周 年 |', '|---|---|---|---|---|---|---|---|---|',
    ...D.keys.map((k) => { const o = r3(k, 'obs'), u = r3(k, 'rule');
      return `| ${KEYN[k]} | ${fp(o.moi)} | ${fp(o.mult)} | ${fe(o.periodYr)} | ${fp(o.turnsAge)} | ${fe(o.fMax)} | ${ft(o.t01Yr)} | ${fe(u.mult)} | ${fe(u.periodYr)} |`; })].join('\n');
  return T;
}

/** 数の文(節に逐語で置く) */
export function factsOf(J) {
  const F = {}, D = J.decl, fs = J.fGrid, r1 = (key, f, y) => J.t1.find((r) => r.key === key && r.f === f && r.years === y), rb = (key, f) => J.t1b.find((r) => r.key === key && r.f === f);
  const E0 = (y) => r1('Earth|Sun', 0, y), age = D.windowsYr[4];
  F.phase = `歳差の位相の進みは受け手に依らない(単位の応答・f 0): 100 年 ${fe(E0(100).phaseTurns)} 周・1 万年 ${fe(E0(1e4).phaseTurns)} 周・100 万年 ${fe(E0(1e6).phaseTurns)} 周・1 億年 ${fp(E0(1e8).phaseTurns)} 周・45 億年 ${fp(E0(age).phaseTurns)} 周(一周 ${fe(rb('Earth|Sun', 0).periodYr)} 年)。`;
  const tE = rb('Earth|Sun', 0), tM = rb('Mars|Sun', 0), tV = rb('Venus|Sun', 0);
  F.earth = `地球(f 0・(g2−)): 公転の法線を慣性の枠に固定すると、観測の傾き 23.439° は円錐を一周する間に ${fa(tE.cone.minDeg)}〜${fa(tE.cone.maxDeg)}° を動く(幅 ${fa(tE.cone.swingDeg)}° = 合成と公転の法線の角 ${fa(tE.alphaDeg)}° の 2 倍)。100 年で ${fe(E0(100).swingDeg)}°・1 万年で ${fe(E0(1e4).swingDeg)}°・100 万年で ${fa(E0(1e6).swingDeg)}°・1 億年の内に最大 ${fa(E0(1e8).swingDeg)}° 動く。変化が 0.1° に達するのは ${fe(tE.tEps.g2m[0])} 年・1° は ${fe(tE.tEps.g2m[1])} 年((g2+) では ${fe(tE.tEps.g2p[0])}・${fe(tE.tEps.g2p[1])} 年)。火星は ${fe(tM.tEps.g2m[0])}・${fe(tM.tEps.g2m[1])} 年・金星は ${fe(tV.tEps.g2m[0])} 年(1° には年齢の内に${tV.tEps.g2m[1] === null ? '届かない —— 一周の幅 ' + fa(tV.cone.swingDeg) + '°' : '届く'})。`;
  const sun = (f) => rb('Sun|-', f);
  F.sun = `太陽(公転の法線の代わりに基準軸 L —— ε = χ): f 0 では ε は変わらない(見ている時間に依らず 0)。寄る割合を f の上限の最小 ${fe(fs[1])} に置くと、χ が 0.1° 変わるのに ${fe(sun(fs[1]).tChi[0])} 年・1° に ${ft(sun(fs[1]).tChi[1])} 年・f 1e-2 では ${fe(sun(fs[2]).tChi[0])}・${fe(sun(fs[2]).tChi[1])} 年。`;
  const minT01 = Math.min(...D.keys.filter((k) => k !== 'Sun|-').map((k) => rb(k, 0).tEps.g2m[0])), kMin = D.keys.find((k) => rb(k, 0).tEps.g2m[0] === minT01);
  const maxW = Math.max(...J.t1b.filter((r) => r.wobble).map((r) => r.wobble.ampAs));
  F.span = `f 0・(g2−) で ε の変化が 0.1° に達する時間の最短は${KEYN[kMin]} ${fe(minT01)} 年(合成と公転の法線の角 ${fa(rb(kMin, 0).alphaDeg)}°)。100 年・1 万年の窓では、9 受け手とも ε の変化は ${fe(Math.max(...D.keys.map((k) => r1(k, 0, 1e4).swingDeg)))}° 以下。公転の位相ごとの (S) の揺れは最大 ${fe(maxW)}″(背景が局所の 1e10 倍以上の列 —— 位相ごとの步と平均の步の差は丸めの桁)。`;
  const t2 = (id, sense, f) => J.t2.find((r) => r.id === id && r.sense === sense && r.f === f), e0 = t2('Earth', 'g2m', 0), m0 = t2('Mars', 'g2m', 0), eF = t2('Earth', 'g2m', fs[1]);
  F.two = `2 つの軸(重力の側は比べる列・一周は仮の値 ${fp(e0.gravPeriodYr)} 年)では、地球の軸引きずりの率は重力の側の ${fe(e0.ratio)} 倍。公転の法線を固定すると、2 つの回転の和 Ω_c は公転の法線から ${fa(e0.tiltDeg)}° 傾くだけで、ε の幅は ${fa(e0.combEps.swingDeg)}°(軸引きずりだけの ${fa(e0.dragEps.swingDeg)}° に対して)—— 周期は重力の側の一周。火星は比 ${fe(m0.ratio)}・幅 ${fa(m0.combEps.swingDeg)}°。公転面も同じ係数で共回りする列では、ε の幅は ${fe(e0.coSwingDeg)}°。寄る割合 f > 0 の長い時間は、速い歳差で平均した形で ε が縮む(地球・f ${fe(fs[1])}: 45 億年で ${fa(eF.avgDEps[4])}° —— 軸引きずりだけの列では ${fa(eF.dragDEps[4])}°)。`;
  const r3 = (key, ref) => J.t3.find((r) => r.key === key && r.ref === ref), obs = J.t3.filter((r) => r.ref === 'obs' && r.key !== 'Sun|-');
  const mm = obs.map((r) => r.mult), fm = Math.min(...J.t3.filter((r) => r.ref === 'obs').map((r) => r.fMax)), kf = J.t3.find((r) => r.ref === 'obs' && r.fMax === fm).key;
  F.resp = `応答の側の率の倍(観測半径・文献の慣性モーメントの係数)は 8 惑星で ${fp(Math.min(...mm))}〜${fp(Math.max(...mm))}・太陽 ${fp(r3('Sun|-', 'obs').mult)}。一周は ${fe(Math.min(...obs.map((r) => r.periodYr)))}〜${fe(Math.max(...obs.map((r) => r.periodYr)))} 年(太陽 ${fe(r3('Sun|-', 'obs').periodYr)} 年・年齢の内に ${fp(r3('Sun|-', 'obs').turnsAge)} 周)。f の上限は倍にほぼ反比例して下がり、最小は${KEYN[kf]} ${fe(fm)}(倍なしの最小 ${fe(fs[1])})。R_ref を規則の半径に取る比べる列では倍は ${fe(Math.min(...J.t3.filter((r) => r.ref === 'rule').map((r) => r.mult)))}〜${fe(Math.max(...J.t3.filter((r) => r.ref === 'rule').map((r) => r.mult)))}(一周は年齢の 1e4 倍以上)。`;
  return F;
}

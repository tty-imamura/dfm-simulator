// 第353便x(原仮定者の回答(2026-11-25 —— 第151報)「AN1046: C」「AN1052: イ」・統括の検証項目 R488):
// **正本 tests/out/twoaxis-353x.json から PHYSICS〔第353便x〕の表と数の文を作る文書の lib**
// (QA docs.twoaxis353x が節の表と逐語で照合する —— 表の数は有効数字 3 桁・角は 0.01° 以上で小数 3 桁・それより小さい角は指数)。原文(言葉を変えずに引く)と読みの表もここに持つ。
export const DOC_VERSION = 'w353x-twoaxisdoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fe = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const fa = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Math.abs(x) < 0.01 ? Number(x).toExponential(2) : Number(x).toFixed(3));
const fp = (x) => (!fin(x) ? '—' : Number(x).toPrecision(3));
const fk = (x) => (!fin(x) ? '—' : Math.abs(x) >= 1e3 || (Math.abs(x) < 1e-2 && x !== 0) ? Number(x).toExponential(2) : String(Number(x.toPrecision(6))));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const KEYN = Object.freeze({ 'Mercury|Sun': '水星', 'Venus|Sun': '金星', 'Earth|Sun': '地球', 'Mars|Sun': '火星', 'Jupiter|Sun': '木星', 'Saturn|Sun': '土星', 'Uranus|Sun': '天王星', 'Neptune|Sun': '海王星', 'Sun|-': '太陽' });
const KIND = Object.freeze({ prov: '仮の値(印・未照合)', tide: '重力の側の潮汐のトルクの列', moonAvg: '月の道の 18.6 年の平均の列', drag: '軸引きずりだけ' });
const SEN = Object.freeze({ g2m: '(g2−)', g2p: '(g2+)' });
const WN = Object.freeze({ 10000: '1 万年', 1000000: '100 万年', 4500000000: '45 億年' });
const same = (x) => (x === true ? '同じ回り' : x === false ? '逆の回り' : '—');

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1046: C']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', '歳差の率: 潮汐を併用『「重力の側の潮汐のトルク」は、仮の値の 3〜11% の内に並びます。』']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1052: イ']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1032: 「順回転なら、歳差運動は逆回転になる」。「こまの式」と同じで、自転軸を回転軸に向けようとすると、逆回転で歳差運動する。「これまでの向き」を読み違えていた']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1034: 「金星で釣り合う」のは、金星の自転がロックした状態。逆回転は地球の影響であり、「金星は、自転に地球の影響が出るほどに釣り合っている」']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['C = 「見ている時間の間は変わらない」。見ている時間 1 万年・100 万年・45 億年と主の物差し 0.1° で、公転の極に対する観測の傾き ε の変化を、軸引きずりだけ/2 つの軸/共回り の 3 列で数える', '表 6']),
  Object.freeze(['歳差の本体を重力の側の潮汐のトルクの列(比べる列 —— DFM の式ではない)に置く。仮の値(未照合)と、地球は月の道の 18.6 年の平均の列(〔第353便m〕)を並べる', '表 3']),
  Object.freeze(['イ = 歳差の率は重力の側の列を基準に置き、軸引きずりは残り・向き・円錐・打ち消しを受け持つ小さい項 —— 2 つの回転の和 Ω_c のまわりの剛体の回転で数える', '表 3・表 4']),
  Object.freeze(['主の歳差の式 (g2−) = −Ω × ŝ(「こまの式」)。比べる列 (g2+) は同じ表に並べる。重力の側の歳差の回りは、順行なら公転の北極のまわりで逆回り —— 自転軸が公転の北極と逆を向く金星・天王星では回りが替わる', '表 3']),
  Object.freeze(['「金星で釣り合う」の判定の量は〔第353便g〕の列。本表は、金星の重力の側の歳差と軸引きずりの歳差が公転の北極のまわりで同じ回りか逆の回りかと、そのときの合成の軸の傾きを数える(判定はしない)', '表 3']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 共通の点検の数: 基準軸 L・eq と L の角・ω_G | (${S.L.map((x) => x.toFixed(6)).join(', ')})・${S.eqL.toFixed(4)}°・${fe(S.omegaG)} rad/s | ${tf(G.anchor)} |`,
    `| ② 〔第353便n〕の 2 つの軸の表: 地球・火星の軸引きずりだけの幅 → 2 つの軸の幅(仮の値の一周)・twoRow − twoAxisClosed の相対の差 | 地球 ${fa(S.rows[0].drag)}° → ${fe(S.rows[0].two)}°・火星 ${fa(S.rows[1].drag)}° → ${fe(S.rows[1].two)}°・${fe(Math.max(S.rows[0].err, S.rows[1].err))} | ${tf(G.table353n)} |`,
    `| ③ 刻みの步: c_輪 ÷ c 0・1 = 〔第353便n〕の twoAxisSteps の fixed・co(誇張した比 0.05・5 周) | ${fe(S.stepErr)} | ${tf(G.stepsAsN)} |`,
    `| ④ c_輪 ÷ c 0.5 の閉じた形の幅 = 刻みの步の幅(相対)・共回りの幅(仮の値の一周) | ${fe(S.kapErr)}・${fe(S.coSw)}° | ${tf(G.kappaClosed)} |`,
    `| ⑤ 軸引きずりだけ: c_輪 ÷ c 0.5 の幅 = 0 の幅・一周 = 2 倍(相対)・窓の内の変化の閉じた形 = 輪と自転軸を別に進めた閉じた形 | ${fe(S.dragErr)}・${fe(S.dwErr)}° | ${tf(G.dragOnly)} |`,
    `| ⑥ 金星: 仮の値の列の回り σ_g・潮汐の列の回り・軸引きずりの歳差と同じ回りか | ${S.venusSignG}・${S.venusTideSign}・${same(S.venusSame)} | ${tf(G.venus)} |`,
    `| ⑦ 潮汐の列 = 〔第353便f〕の tideRate(公転の北極 —— 火星・金星・木星・土星)・月の道の平均 = 〔第353便m〕の earthGrav | ${fe(S.tideErr)}・${fe(S.mErr)} | ${tf(G.sameAsF_M)} |`,
    `| ⑧ 公転面が寄る f_輪 の下限(c_輪 ÷ c 1)= 〔第353便e〕の fRingAt(0.98)・寄れる c_輪 ÷ c の下限・その 0.9 倍で寄れない | ${fe(S.rn.fRing)}・${fe(S.rn.kMin)}・${S.rnLow.fRing === null ? '寄れない' : fe(S.rnLow.fRing)} | ${tf(G.ringNeed)} |`,
    `| ⑨ 2 つの軸で公転面が寄るとき(誇張: 比 0.01・f_輪 0.2): ε の変化 ÷ 輪の動き・輪の動き | ${fe(S.adRatio)}・${fa(S.adMove)}° | ${tf(G.adiabatic)} |`,
    `| ⑩ 拒否(置き方の名・c_輪 ÷ c なし・f > 1・列の名・刻み 0・f_輪 > 1・負の率) | ${S.rejects.length} 件 | ${tf(G.rejects)} |`].join('\n');
  T.t1 = ['| 天体 | 重力の側の率の列 | 向き | ε₀ ° | 重力の側の率 ″/年 | 回り σ_g | 軸引きずりと | 率の比 | 合成の軸の傾き ° | 合成の一周 年 | 2 つの軸: ε の幅 ° | 軸引きずりだけ: ε の幅 ° | 照らしの步 − 閉じた形(相対) | 平均した形の Δε ° 45 億年(f 上限の最小) | 軸引きずりだけの Δε ° 45 億年 |', '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.t1.map((r) => `| ${KEYN[r.key]} | ${KIND[r.kind]} | ${SEN[r.sense]} | ${fa(r.eps0Deg)} | ${fp(r.gravAsYr)} | ${r.signG > 0 ? '+' : '−'} | ${same(r.sameSense)} | ${fe(r.ratio)} | ${fa(r.tiltDeg)} | ${fe(r.combPeriodYr)} | ${fa(r.combSwingDeg)} | ${fa(r.dragSwingDeg)} | ${fe(r.stepErrRel)} | ${fa(r.avgDEpsAge)} | ${fa(r.dragDEpsAge)} |`)].join('\n');
  const ks = J.decl.kappas.concat(J.decl.kappasNear);
  T.t2 = ['| 天体 | c_輪 ÷ c | 2 つの軸: ε の幅 °(閉じた形) | 照らしの步の幅 ° | 軸引きずりだけ: ε の幅 ° | 軸引きずりだけ: 一周 年 | 軸引きずりだけ: 45 億年の内の変化 ° | 公転面が寄る f_輪 の下限 | そのときの軸引きずりだけの変化 ° | 輪の動き ° |', '|---|---|---|---|---|---|---|---|---|---|',
    ...J.decl.t1Keys.flatMap((key) => ks.map((kr) => { const r = J.t2.find((q) => q.key === key && q.kRing === kr);
      return `| ${KEYN[key]} | ${fk(kr)} | ${fa(r.twoSwingDeg)} | ${r.stepSwingDeg === null ? '—' : fa(r.stepSwingDeg)} | ${fa(r.dragSwingDeg)} | ${fe(r.dragPeriodYr)} | ${fa(r.dragWinAgeDeg)} | ${r.fRing === null ? '寄れない' : fe(r.fRing)} | ${fa(r.ringDragWinDeg)} | ${fa(r.ringMoveDeg)} |`; }))].join('\n');
  const band = (r) => (fk(r.lo) + '〜' + (r.hiOpen ? '上限なし' : fk(r.hi)));
  T.t2b = ['| 天体 | 見ている時間 | 軸引きずりだけ: ε の変化 ≤ 0.1° の c_輪 ÷ c | 公転面も寄る(下限 ' + fk(J.ring.kMin) + ' 以上)と重なる帯 | 2 つの軸(潮汐の列): ε の変化 ≤ 0.1° の c_輪 ÷ c | 公転面も寄ると重なる帯 |', '|---|---|---|---|---|---|',
    ...J.decl.t1Keys.flatMap((key) => J.decl.windowsYr.map((y) => { const d = J.t2b.find((q) => q.key === key && q.Tyr === y && q.kind === 'drag'), t = J.t2b.find((q) => q.key === key && q.Tyr === y && q.kind === 'tide');
      const bb = (r) => (r.both ? fk(r.both.lo) + '〜' + (r.both.hiOpen ? '上限なし' : fk(r.both.hi)) : '重ならない');
      return `| ${KEYN[key]} | ${WN[y]} | ${band(d)} | ${bb(d)} | ${band(t)} | ${bb(t)} |`; }))].join('\n');
  T.t3 = ['| 受け手 | ε₀ ° | ' + J.decl.windowsYr.map((y) => WN[y] + ': 軸引きずりだけ / 2 つの軸(潮汐の列) / 2 つの軸(仮の値) / 共回り °').join(' | ') + ' |', '|---|---|' + J.decl.windowsYr.map(() => '---|').join(''),
    ...J.decl.keys.map((key) => { const rs = J.decl.windowsYr.map((y) => J.t3.find((q) => q.key === key && q.Tyr === y));
      return `| ${KEYN[key]} | ${fa(rs[0].eps0Deg)} | ${rs.map((r) => fa(r.dragDeg) + ' / ' + fa(r.twoDeg) + ' / ' + fa(r.twoProvDeg) + ' / ' + fe(r.coDeg)).join(' | ')} |`; })].join('\n');
  return T;
}

/** 数の文(節に逐語で置く) */
export function factsOf(J) {
  const F = {}, t1 = (key, kind, sense) => J.t1.find((r) => r.key === key && r.kind === kind && r.sense === sense);
  const vT = t1('Venus|Sun', 'tide', 'g2m'), vP = t1('Venus|Sun', 'prov', 'g2m'), vTp = t1('Venus|Sun', 'tide', 'g2p');
  F.venus = `金星(自転軸は公転の北極と ${fa(vT.eps0Deg)}°): 重力の側の歳差は公転の北極のまわりで${vT.signG > 0 ? '正の回り' : '負の回り'}(潮汐の列 ${fp(vT.gravAsYr)}″/年・仮の値の列も同じ回りに置いた)で、主の (g2−) の軸引きずりの歳差とは${same(vT.sameSense)}(比べる列 (g2+) では${same(vTp.sameSense)})。率の比 ${fe(vT.ratio)}・合成の軸の傾き ${fa(vT.tiltDeg)}°・ε の幅は軸引きずりだけの ${fa(vT.dragSwingDeg)}° から 2 つの軸で ${fa(vT.combSwingDeg)}°(仮の値の列 ${fa(vP.combSwingDeg)}°)。回りが逆でも、重力の側が速いので幅は率の比の桁に縮む。`;
  const uM = t1('Uranus|Sun', 'tide', 'g2m'), uP = t1('Uranus|Sun', 'tide', 'g2p');
  F.uranus = `天王星(ε₀ ${fa(uM.eps0Deg)}°・重力の側の列は太陽だけ —— 衛星の分なし): 重力の側の率 ${fe(uM.gravAsYr)}″/年は軸引きずり(注目の列)の ${fp(1 / uM.ratio)} 倍で、2 つの軸でも幅は縮まない —— (g2−) では回りが逆で合成の軸は σ_g n̂ から ${fa(uM.tiltDeg)}°(軸引きずりの側に寄る)・ε の幅 ${fa(uM.combSwingDeg)}°((g2+) ${fa(uP.combSwingDeg)}°)・軸引きずりだけ ${fa(uM.dragSwingDeg)}°。`;
  const eP = t1('Earth|Sun', 'prov', 'g2m'), eT = t1('Earth|Sun', 'tide', 'g2m'), eA = t1('Earth|Sun', 'moonAvg', 'g2m'), sT = t1('Saturn|Sun', 'tide', 'g2m'), jT = t1('Jupiter|Sun', 'tide', 'g2m');
  F.earth = `地球の重力の側の率を替えると、2 つの軸の ε の幅は 仮の値 ${fp(eP.gravAsYr)}″/年で ${fe(eP.combSwingDeg)}°・潮汐の列(月の道を固定)${fp(eT.gravAsYr)}″/年で ${fe(eT.combSwingDeg)}°・月の道の 18.6 年の平均の列 ${fp(eA.gravAsYr)}″/年で ${fe(eA.combSwingDeg)}°(幅は率にほぼ反比例 —— 差は ${fp(Math.abs(eA.combSwingDeg / eT.combSwingDeg - 1) * 100)}%)。木星は ${fa(jT.combSwingDeg)}°・土星は ${fa(sT.combSwingDeg)}°(率の比 ${fe(sT.ratio)})。`;
  const r2 = (key, kr) => J.t2.find((q) => q.key === key && q.kRing === kr), e0 = r2('Earth|Sun', 0), eh = r2('Earth|Sun', 0.5), e1 = r2('Earth|Sun', 1), e9 = r2('Earth|Sun', 0.999);
  F.ring = `公転面が背景に応える係数の比 c_輪 ÷ c を振ると、2 つの軸の ε の幅は abs(1 − c_輪 ÷ c) に比例して落ちる(地球 ${fe(e0.twoSwingDeg)}° → 0.5 で ${fe(eh.twoSwingDeg)}° → 1 で ${fe(e1.twoSwingDeg)}°)。軸引きずりだけでは、幅は c_輪 ÷ c が 1 でない限り ${fa(e0.dragSwingDeg)}° のままで、一周が 1 ÷ abs(1 − c_輪 ÷ c) 倍に延びるだけ —— 45 億年の内の変化は 0.999 でも ${fa(e9.dragWinAgeDeg)}°。公転面が寄る(散らばり 30° → 7°)には c_輪 ÷ c ≥ ${fe(J.ring.kMin)}(f_輪 1)が要り、c_輪 ÷ c 1 で f_輪 ≥ ${fe(J.ring.fRing)}。そのとき軸引きずりだけの列では、輪が ${fa(e1.ringMoveDeg)}° 動き ε は 45 億年の内に ${fa(e1.ringDragWinDeg)}° 変わる。`;
  const b = (key, y, kind) => J.t2b.find((q) => q.key === key && q.Tyr === y && q.kind === kind), age = J.decl.windowsYr[2];
  const ed = b('Earth|Sun', age, 'drag'), et = b('Earth|Sun', age, 'tide'), ud = b('Uranus|Sun', age, 'tide'), vd = b('Venus|Sun', age, 'drag');
  F.band = `45 億年の窓・物差し 0.1° で、「公転面が寄る」と「ε の変化が物差しの内」が同じ c_輪 ÷ c で成り立つ帯は、軸引きずりだけの列では 1 のまわりの細い帯(地球 ${fk(ed.both.lo)}〜${fk(ed.both.hi)}・金星 ${fk(vd.both.lo)}〜${fk(vd.both.hi)})、2 つの軸(潮汐の列)では地球 ${fk(et.both.lo)}〜${et.both.hiOpen ? '上限なし' : fk(et.both.hi)} と広い。天王星は 2 つの軸でも ${ud.both ? fk(ud.both.lo) + '〜' + fk(ud.both.hi) : '重ならない'}(重力の側が軸引きずりより遅い列)。`;
  const r3 = (key, y) => J.t3.find((q) => q.key === key && q.Tyr === y), jw = r3('Jupiter|Sun', 1e6);
  const over = J.t3.filter((r) => r.Tyr === age && r.twoDeg !== null && r.twoDeg >= J.decl.thrDeg).map((r) => KEYN[r.key]);
  F.window = `見ている時間の表では、軸引きずりだけの列は 1 万年で 9 受け手とも ${fe(Math.max(...J.t3.filter((r) => r.Tyr === 1e4).map((r) => r.dragDeg)))}° 以下・45 億年で太陽のほかは 0.1° を越える。2 つの軸(潮汐の列)は 45 億年で 0.1° を越えるのが${over.join('・')}(重力の側が太陽だけの遅い列)。短い窓では 2 つの軸の方が大きく出る天体もある(木星 100 万年: 2 つの軸 ${fa(jw.twoDeg)}° —— 軸引きずりだけ ${fa(jw.dragDeg)}° —— 合成の一周 ${fe(t1('Jupiter|Sun', 'tide', 'g2m').combPeriodYr)} 年の内で円錐を回る)。共回りの列は 27 行とも ${fe(Math.max(...J.t3.map((r) => r.coDeg)))}°(丸めの桁の床で 0 と書いた)。`;
  return F;
}

// 第353便zh(原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R497):
// **正本 tests/out/comove-353zh.json から PHYSICS〔第353便zh〕の表を作る文書の lib**
// (QA docs.comove353zh が節の表と逐語で照合する —— 表の数は有効数字 3 桁)。原文(言葉を変えずに引く)と読みの表もここに持つ。
export const DOC_VERSION = 'w353zh-comovedoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fe = (x) => (x === null || x === undefined ? '—' : !fin(x) ? '∞' : x === 0 ? '0' : Number(x).toExponential(2));
const d3 = (x) => (!fin(x) ? '—' : Number(x).toFixed(3));
const pc = (x) => (!fin(x) ? '—' : (100 * x).toFixed(1) + '%');
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const yr = (x) => (x === null || x === undefined ? '出ない(年齢の内)' : fe(x));
const NM = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星', Moon: '月', Io: 'イオ' });
const nm = (k) => NM[k] || k;
const COND = Object.freeze({ grav: '(ii) 重力の側の交点の回り(周期 1e7 年 —— ノブ)', dev: '(i) 公転面の応える比の 1 からのずれ 0.01', f: '(iii) 太陽の自転軸の寄る割合 f(窓を出る最小の格子の値)' });

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', '向きと幾何: これを採用『主の成分を太陽の自転の分・背景を太陽系の基準軸の向きに置くと、太陽の 5〜6° の傾きは円錐になり、金星で 1% まで打ち消します。』']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1034: 「金星で釣り合う」のは、金星の自転がロックした状態。']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1046: C']),
  Object.freeze(['原仮定者の整理(2026-11-24 —— 第148報)', '太陽系の、多くの天体の公転面に垂直かつ、多くの天体の歳差運動の中心軸方向が、太陽系の基準軸方向である']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['「金星で 1% まで打ち消す」は配置の文(〔第353便zc〕)。主の列では歳差の率が受け手に依らない(〔第353便b〕)ので、公転面も同じ係数で背景に応えるなら、太陽の自転軸と公転の法線は基準軸のまわりを同じ率で回り、相対の位相が止まる —— この条件と破れる条件を比の走査で並べる', '表 2〜表 5']),
  Object.freeze(['「ロックした状態」を相対の率の言葉に置くと: 換算の係数を置いた組では金星の合成が背景の 1.3% になり、金星の公転面は基準軸のまわりをほとんど回らない —— 太陽の円錐だけが回る列になる(状態の名は「ロックの判定の量」)', '表 3']),
  Object.freeze(['「見ている時間の間は変わらない」(C)に照らし、φ がいまの 2 倍以下で在る年数を、比・組・破れる条件ごとに並べる', '表 2〜表 4']),
  Object.freeze(['基準軸を「多くの天体の歳差運動の中心軸」と読むとき、公転面の歳差も基準軸のまわり —— 重力の側の交点の回りもノブの格子で基準軸のまわりに置く(DFM の式ではない比べる列)', '表 4']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 比 0: 相対の 1 周と〔第353便zc〕の太陽の円錐の周期の相対差・その周期 | ${fe(S.dPer)}・${fe(S.sunPeriodYr)} 年 | ${tf(G.fixedPeriod)} |`,
    `| ① 比 0: 窓の年数・前へ出るまでと〔第353便zc〕の表 7 の相対差・窓の年数・数えた出口と閉じた形の差(相対の位相の度 —— 交点の格子 0.1° の内) | ${fe(S.dWin)}・${fe(S.dExit)}・${fe(S.holdWinYr)} 年・${fe(S.dNum)}° | ${tf(G.fixedHold)} |`,
    `| ② 比 0: 金星の φ がいまより小さい時間の割合・金星が 8 惑星で 1 番の時間の割合(〔第353便zc〕の表 5 と同じ) | ${pc(S.pct)}・${pc(S.first)} | ${tf(G.fixedPhase)} |`,
    `| ③ 比 1: 背景だけの相対の率・局所つき(主の列)の相対の率 ÷ 太陽の率・金星の窓を年齢の内に出るか | ${fe(S.r1Rate)}・${fe(S.r1LRel)}・${S.h1Fwd === null && S.h1Bwd === null ? '出ない' : '出る'} | ${tf(G.coStop)} |`,
    `| ④ 閉じた形: 相対の率 = (1 − 比) × u ω_G(8 惑星 × 比 3 の相対差の最大)・方位の率の口と〔第353便b〕の mainState の相対差 | ${fe(S.dLin)}・${fe(S.dAz)} | ${tf(G.linear)} |`,
    `| ⑤ φ(t) = 〔第353便zc〕の phiAt(相対の位相)の相対差(比 0.5・3.7e7 年) | ${fe(S.dPhi)} | ${tf(G.phiPhase)} |`,
    `| ⑥ 回転の口 = 〔第353便x〕の ringSteps(比 0.7)・〔第353便n〕の sAt・〔第352便l〕の closedAxis(差の大きさ) | ${fe(S.dRing)}・${fe(S.dSat)}・${fe(S.dCl)} | ${tf(G.rotations)} |`,
    `| ⑦ 組の状態: k1 の金星の法線と〔第353便zc〕の法線の角・太陽の合成と基準軸の角(°)・〔第353便za〕の kWatch を呼べる・⑧ 月の一周の揺れ(周期 10 年・1e5 年) | ${fe(S.dN)}・${fe(S.sunB)}・${tf(S.kwOk)}・${fe(S.m1)}°・${fe(S.m2)}° | ${tf(G.combos)} |`,
    `| ⑨ 変異(太陽の向きの符号を替えると比 1 で止まらない・重力の側の交点の回りを足すと止まらない)と拒否 ${S.rejects.length} | ${tf(S.mutSun)}・${tf(S.mutG)}・${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.mutants)} |`].join('\n');
  const t1 = J.t1;
  T.t1 = ['| 公転面の応える比 c_輪 ÷ c | 相対の 1 周(年 —— 8 惑星の最小〜最大) | 金星の窓の年数(閉じた形) | 前へ窓を出るまで | 後へ | 数えた出口(前・後 —— 年齢の内) |', '|---|---|---|---|---|---|',
    ...t1.rows.map((r) => { const ps = Object.values(r.relPeriods).map((x) => (x === null ? Infinity : x)), c = r.venus.closed;
      return `| ${r.ratio} | ${fe(Math.min(...ps))}〜${fe(Math.max(...ps))} | ${fe(c.winYr)} | ${fe(c.fwdYr)} | ${fe(c.bwdYr)} | ${yr(r.venus.fwdYr)}・${yr(r.venus.bwdYr)} |`; })].join('\n');
  T.t1b = ['| 惑星 | いまの φ(°) | φ ≤ 2 × いまの相対の位相の窓(°) | 窓の年数(比 0) |', '|---|---|---|---|',
    ...t1.hold0.map((r) => `| ${nm(r.id)} | ${d3(r.phi0)} | ${r.winDeg >= 360 ? '全周' : r.winDeg.toFixed(1)} | ${r.winDeg >= 360 ? '全周(いつも 2 倍以下)' : fe(r.winYr)} |`)].join('\n');
  const B = t1.bound;
  T.t1c = ['| 物差し(年齢 4.5e9 年) | 比 < 1 の側 | 比 > 1 の側 |', '|---|---|---|',
    `| 窓の長さが年齢以上: abs(1 − 比) の上限 | ${fe(B.win)} | ${fe(B.win)} |`,
    `| いまから前へ年齢の間 窓に居る: 上限 | ${fe(B.fwdBelow)} | ${fe(B.fwdAbove)} |`,
    `| いままでの年齢の間 窓に居た(後へ): 上限 | ${fe(B.bwdBelow)} | ${fe(B.bwdAbove)} |`,
    `| 位相の割合(比 0・0.5・2): 金星の φ がいまより小さい・金星が 1 番 | ${t1.phase.map((p) => pc(p.pct)).join('・')} | ${t1.phase.map((p) => pc(p.first)).join('・')} |`].join('\n');
  T.t2 = ['| 組 | 公転面 | 換算の係数 k | 受け手の合成 ÷ 太陽の合成 | 受け手の合成と基準軸(°) | 太陽の方位の率(rad/年) | 公転の法線の方位の率(rad/年) | 相対の 1 周(年) | 窓の年数(前・後 —— 数えた) |', '|---|---|---|---|---|---|---|---|---|',
    ...J.t2.map((r) => `| ${r.combo} | ${nm(r.key)} | ${fe(r.k)} | ${fe(r.ringOverSun)} | ${r.ringOmToBDeg.toFixed(2)} | ${fe(r.sunAz)} | ${fe(r.ringAz)} | ${r.relPeriodYr === null || r.relPeriodYr === Infinity ? '∞(止まる)' : fe(r.relPeriodYr)} | ${yr(r.fwdYr)}・${yr(r.bwdYr)} |`)].join('\n');
  const t3 = J.t3;
  T.t3a = ['| (i) abs(1 − 比) | 窓の年数 | 比 < 1: 前・後 | 比 > 1: 前・後 |', '|---|---|---|---|',
    ...t3.devs.map((r) => `| ${r.dev} | ${fe(r.winYr)} | ${fe(r.fwdBelow)}・${fe(r.bwdBelow)} | ${fe(r.fwdAbove)}・${fe(r.bwdAbove)} |`)].join('\n');
  T.t3b = ['| (ii) 重力の側の交点の回りの周期(年 —— ノブ・未照合) | 向き | 相対の 1 周(年 —— 比 1) | 窓の年数 | 前・後(数えた) |', '|---|---|---|---|---|',
    ...t3.grav.map((r) => `| ${fe(r.periodYr)} | ${r.sense > 0 ? '+' : '−'} | ${fe(r.relPeriodYr)} | ${fe(r.winYr)} | ${yr(r.fwdYr)}・${yr(r.bwdYr)} |`)].join('\n');
  T.t3c = ['| (iii) 太陽の自転軸の寄る割合 f(比 1) | 前へ窓を出るまで(年) | 10 億年の後の金星の φ(°) | 45 億年の後の φ(°) | 45 億年の後の太陽の円錐(°) |', '|---|---|---|---|---|',
    ...t3.f.map((r) => `| ${r.f} | ${yr(r.fwdYr)} | ${d3(r.phi1e9)} | ${d3(r.phiAge)} | ${d3(r.coneAge)} |`)].join('\n');
  T.t3d = ['| 順 | 破れる条件(格子の代表の値) | 前へ窓を出るまで(年) |', '|---|---|---|',
    ...t3.order.map((r, i) => `| ${i + 1} | ${COND[r.cond]} | ${yr(r.yr)} |`)].join('\n');
  T.t4a = ['| 組 | k | 重力の側の率(″/年 —— 比べる列) | 2 つの軸の 1 周(年) | 100 年 | 1 万年 | 100 万年 | 45 億年 | 軸引きずりだけ・100 万年 |', '|---|---|---|---|---|---|---|---|---|',
    ...J.t4.mercury.map((r) => `| ${r.combo} | ${fe(r.k)} | ${fe(r.gravAsYr)}(${r.signG > 0 ? '+' : '−'}) | ${fe(r.periodYr)} | ${r.wins.map((w) => fe(w.winDeg)).join(' | ')} | ${fe(r.fixed1e6)} |`)].join('\n');
  const mm = {}; for (const r of J.t4.moons) { const k = r.key + '|' + r.combo; (mm[k] = mm[k] || { key: r.key, combo: r.combo, k: r.k, eps0: r.eps0Deg })[r.signG > 0 ? 'p' : 'm'] = r; }
  T.t4b = ['| 受け手 | 組 | k | いまの傾き(°) | 一周の揺れ ≤ 0.1° の周期の上限(年 —— 向き − ・ +) | 率の下限(″/年 —— 向き − ・ +) | 周期 1e6 年の一周の揺れ(° —— 向き −) |', '|---|---|---|---|---|---|---|',
    ...Object.values(mm).map((r) => `| ${nm(r.key)} | ${r.combo} | ${fe(r.k)} | ${d3(r.eps0)} | ${fe(r.m.periodMaxYr)}・${fe(r.p.periodMaxYr)} | ${fe(r.m.rateMinAsYr)}・${fe(r.p.rateMinAsYr)} | ${fe(r.m.swings[r.m.swings.length - 1].swingDeg)} |`)].join('\n');
  return T;
}
/** 数の文(節に逐語) */
export function factsOf(J) {
  const F = {}, r0 = J.t1.rows.find((r) => r.ratio === 0).venus.closed, B = J.t1.bound, vr = J.t2.filter((r) => r.key === 'Venus' && r.combo !== 'k1');
  const g = J.t3.grav, mer = J.t4.mercury, mo = J.t4.moons;
  const span = (a) => `${fe(Math.min(...a))}〜${fe(Math.max(...a))}`;
  F.stop = `主の列で公転面の応える比が 1 なら、背景だけの相対の率は 0(局所つきでも太陽の率の ${fe(J.pure.scenes.r1LRel)} 倍)で、金星の φ がいまの 2 倍以下で在る窓を年齢の内に出ない。比が 1 でなければ窓の年数は ${fe(r0.winYr)} ÷ abs(1 − 比) 年(閉じた形 —— 相対の位相だけで決まる)。`;
  F.bound = `年齢(4.5e9 年)の間 窓に居るのに要る 1 からのずれの上限は、窓の長さで ${fe(B.win)}・いまから前へ ${fe(B.fwdBelow)}(比 < 1)・${fe(B.fwdAbove)}(比 > 1)・いままでの年齢の間 ${fe(B.bwdBelow)}(比 < 1)・${fe(B.bwdAbove)}(比 > 1)。`;
  F.combo = `換算の係数を置いた組(k1 を除く 8 組)では、金星の合成は太陽の合成の ${span(vr.map((r) => r.ringOverSun))} 倍で基準軸から ${Math.min(...vr.map((r) => r.ringOmToBDeg)).toFixed(1)}〜${Math.max(...vr.map((r) => r.ringOmToBDeg)).toFixed(1)}° —— 比 1 でも相対の 1 周は ${span(vr.map((r) => r.relPeriodYr))} 年で、窓の年数(前 + 後)は ${span(vr.map((r) => r.winYr))} 年(公転面を固定した ${fe(r0.winYr)} 年と同じ桁)。`;
  F.order = `破れる条件の順(格子の代表の値): 重力の側の交点の回り(周期 1e7 年)は前へ ${fe(J.t3.order.find((r) => r.cond === 'grav').yr)} 年・1 からのずれ 0.01 は ${fe(J.t3.order.find((r) => r.cond === 'dev').yr)} 年・寄る割合 f は ${J.t3.f.filter((r) => r.fwdYr === null).map((r) => r.f).join('・')} で年齢の内に窓を出ない。重力の側の周期の格子 1e4〜1e7 年の窓の年数は ${span(g.map((r) => r.winYr))} 年。`;
  F.moons = `水星の 2 つの軸(重力の側の潮汐のトルクの列 —— 比べる列)では、組 9 の 100 万年の窓の変化は ${span(mer.map((r) => r.wins[2].winDeg))}°(軸引きずりだけでは ${span(mer.map((r) => r.fixed1e6))}°)。月とイオで一周の揺れが 0.1° の内に収まる重力の側の周期の上限は 月 ${span(mo.filter((r) => r.key === 'Moon').map((r) => r.periodMaxYr))} 年・イオ ${span(mo.filter((r) => r.key === 'Io').map((r) => r.periodMaxYr))} 年(ノブ・未照合)。`;
  return F;
}

// 第353便m(原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R477):
// **正本 tests/out/residsign-353m.json から PHYSICS〔第353便m〕の表を作る文書の lib**
// (QA docs.residsign353m が節の表と逐語で照合する —— 表の数は有効数字 3 桁)。原文(言葉を変えずに引く)と読みの表もここに持つ。
export const DOC_VERSION = 'w353m-residsigndoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fe = (x) => (x === Infinity ? '∞' : !fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const fs3 = (x) => (!fin(x) ? '—' : x === 0 ? '0' : (x > 0 ? '+' : '') + Number(x).toPrecision(3));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const yn = (x) => (x === true ? 'はい' : x === false ? 'いいえ' : '—');
const fp3 = (x) => (!fin(x) ? '—' : Number(x).toPrecision(3));
const fl12 = (x) => (!fin(x) ? '—' : x === 0 ? '0' : x < 1e-12 ? '< 1e-12' : Number(x).toExponential(1));
const MOON = Object.freeze({ fixed: 'リポジトリの向き(固定)', ecl: '黄道の面', avg: '18.6 年の平均' });
const HM = Object.freeze({ repo: 'J2 ÷ C/MR²', lit: 'H 0.0032737' });
const EM = Object.freeze({ none: '円', repo: '離心率の倍' });
const POLE = Object.freeze({ orbN: '金星の公転の北極', orbS: '金星の公転の南極', eclN: '黄道の北極', eclS: '黄道の南極', L: '基準軸 L' });
const AX = Object.freeze({ L: '有向の角運動量', N: '北半球の極' });
const VS = Object.freeze({ tide: '重力の列と同じ回り', anti: '逆の回り' });
const BODY = Object.freeze({ Earth: '地球', Mars: '火星', Venus: '金星' });
const c3 = (r) => BODY[r.id] + (r.id === 'Venus' ? '(' + VS[r.venusSense] + ')' : r.id === 'Earth' ? '(月の道: ' + MOON[r.moon] + ')' : '');

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', '歳差の率: 潮汐を併用『「重力の側の潮汐のトルク」は、仮の値の 3〜11% の内に並びます。』']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1052: イ']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1032: 「順回転なら、歳差運動は逆回転になる」。「こまの式」と同じで、自転軸を回転軸に向けようとすると、逆回転で歳差運動する。「これまでの向き」を読み違えていた']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['歳差の率は、重力の側の潮汐のトルクの列(比べる列 —— DFM の式ではない)を基準に置き、軸引きずりを足す形で読む。〔第353便f〕の残り(仮の値 − 重力の列)の符号が、重力の列の入力と定義の幅で替わるかを本節で数える', '表 2・表 3']),
  Object.freeze(['イ = 重力の側の列を基準に、軸引きずりは残り・向き・円錐・打ち消しを受け持つ小さい項。残りを埋める向きか・要る応答の係数は、残りの符号に依る', '表 2・表 5・表 6']),
  Object.freeze(['歳差の式の主の列は (g2−) = −Ω × ŝ。(g2+) は比べる列。〔第353便f〕では、地球の残りは (g2−) では埋まらない向き(差が広がる向き)だった', '表 2・表 4']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 既定(リポジトリの月の道・J2 ÷ C/MR²・円)= 〔第353便f〕の重力の列(地球・黄道の極 —— 相対差) | ${fl12(S.gravErr)} | ${tf(G.gravIsF)} |`,
    `| ② 18.6 年の平均の閉じた形 = 交点 72 点の平均・交点 0° = 固定・傾き 0 の平均 = 黄道の面・n̂n̂ の跡 1 | ${fl12(Math.max(S.avgErr, S.node0, S.avg0, ...S.tr))} | ${tf(G.avgIsMean)} |`,
    `| ③ n̂n̂ を受ける潮汐のテンソル = 〔第352便u〕の tideAvg | ${fl12(S.tideErr)} | ${tf(G.tideIsU)} |`,
    `| ④ 金星の既定(公転の北極・有向の角運動量・同じ回り)= 〔第353便f〕の残り・軸引きずり・重力の列 | ${fl12(S.vErr)} | ${tf(G.venusIsF)} |`,
    `| ⑤ 極を反転すると方位の率が反転・ŝ を反転しても方位の率は同じ・金星の重力の列(黄道の極・公転の北極・基準軸 L) | ${fl12(Math.max(S.flipPole, S.flipAxis))}・${fs3(S.vAz.ecl)}・${fs3(S.vAz.orb)}・${fs3(S.vAz.L)} ″/年 | ${tf(G.poleAxisSym)} |`,
    `| ⑥ 入力の振れの和(〔第353便f〕の幅)地球・火星・金星 | ${fe(S.pert.Earth)}・${fe(S.pert.Mars)}・${fe(S.pert.Venus)} ″/年 | ${tf(G.widthIsF)} |`,
    `| ⑦ 要る c(u 0.98)火星・金星・地球 と残り = 〔第353便f〕 | ${fs3(S.cNeed.Mars)}・${fs3(S.cNeed.Venus)}・${fs3(S.cNeed.Earth)} | ${tf(G.cNeedIsF)} |`,
    `| ⑧ 統括の数え直し 3: 基準軸 L の成分の差の最大・ω_G・金星の φ(規則の半径) | ${fe(S.Lerr)}・${fe(S.omegaG)} rad/s・${Number(S.phiV).toFixed(4)}° | ${tf(G.anchor3)} |`,
    `| ⑨ 振れの算術(質量は 1 乗・距離は −3 乗・離心率の倍 (1 − e²)^(−3/2)・H に比例)・月の道の傾き | ${fl12(Math.max(...S.arith, S.hLin))}・${Number(S.iMoon).toFixed(3)}° | ${tf(G.pertArith)} |`,
    `| ⑩ 拒否 | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  // 表 2: 地球の残りの符号
  T.earth = ['| 月の道の置き方 | 慣性モーメントの係数の置き方 | 1 公転の平均の 1/r³ | 重力の列 [″/年](比べる列) | 太陽の項 | 月の項 | 残り = 仮 − 重力(仮・未照合) | 符号が〔第353便f〕と逆か | 最後の桁の振れ [″/年] | 符号が最後の桁で替わらないか | (g2−) c 1 [″/年] | (g2−) で埋める向きか | (g2−) の要る c | (g2+) で埋める向きか | 残りが幅の内か |', '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.t1.rows.map((r) => `| ${MOON[r.moon]} | ${HM[r.h]} | ${EM[r.ecc]} | ${fs3(r.az)} | ${fs3(r.sun)} | ${fs3(r.moonTerm)} | ${fs3(r.resid)} | ${yn(r.flip)} | ${fe(r.digit)} | ${yn(r.signStable)} | ${fs3(r.dragM)} | ${yn(r.fillM)} | ${fs3(r.cNeedM)} | ${yn(r.fillP)} | ${yn(r.inWidth)} |`)].join('\n');
  T.node = ['| 交点の経度(0° = リポジトリの向き)| 重力の列 [″/年] | 月の項 | 残り | 符号が〔第353便f〕と逆か |', '|---|---|---|---|---|',
    ...J.t1node.rows.map((r) => `| ${r.nodeDeg}° | ${fs3(r.az)} | ${fs3(r.moonTerm)} | ${fs3(r.resid)} | ${yn(r.flip)} |`)].join('\n');
  // 表 4: 金星
  T.venus = ['| 極 | ŝ の向きの置き方 | 仮の値の回る向き(仮定) | 重力の列 [″/年] | 軸引きずり (g2−) u 0.98 c 1 | 仮の値 | 残り | 埋める向きか | 要る c(u 0.98・u 0.0487) | 幅 [″/年] | 残りが幅の内か | 話が閉じるか(幅の内 かつ 埋める向き) | abs(極 × 軸) |', '|---|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.t2.rows.map((r) => `| ${POLE[r.pole]} | ${AX[r.axis]} | ${VS[r.sense]} | ${fs3(r.grav)} | ${fs3(r.drag)} | ${fs3(r.prov)} | ${fs3(r.resid)} | ${yn(r.fill)} | ${fe(r.cNeed)}・${fe(r.cNeed0)} | ${fe(r.width)} | ${yn(r.inWidth)} | ${yn(r.closes)} | ${fe(r.sinPole)} |`)].join('\n');
  // 表 5: 要る c
  T.c = ['| 受け手 | u | 残り [″/年] | 要る c(符号つき) | 埋める向きか | 上限としてだけ(残りが幅の内) | c ÷ (ウ′) n² J2 ÷ (ω C/MR²) | c ÷ (ウ) n² ÷ ω | c ÷ (イ) 1 ÷ ω | (P-応) の率の倍(観測半径・文献の係数) | (P-応) の率の倍(規則の半径) |', '|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.t3.rows.map((r) => `| ${c3(r)} | ${r.u} | ${fs3(r.resid)} | ${fe(r.cNeed)} | ${yn(r.fill)} | ${yn(r.upperOnly)} | ${fe(r.overUJ)} | ${fe(r.overU)} | ${fe(r.overI)} | ${fs3(r.mObs)} | ${fe(r.mRule)} |`)].join('\n');
  T.spread = ['| u | 並べる天体 | abs(要る c) | ÷ (ウ′) | ÷ (ウ) | ÷ (イ) | ÷ (P-応) の倍(観測半径) |', '|---|---|---|---|---|---|---|',
    ...RD_U(J).flatMap((u) => [[J.t3.spread[u], '火星・金星(同じ回り)'], [J.t3.spread3[u], '火星・金星(同じ回り)・地球(18.6 年の平均)']].map(([s, nm]) => `| ${u} | ${nm} | ${fp3(s.c)} | ${fp3(s.uJ)} | ${fp3(s.u)} | ${fp3(s.i)} | ${fp3(s.mObs)} |`))].join('\n');
  return T;
}
const RD_U = (J) => Object.keys(J.t3.spread);
/** 数の文(正本から作る —— 節に逐語) */
export function factsOf(J) {
  const F = {}, e = (moon, h, ecc) => J.t1.rows.find((r) => r.moon === moon && r.h === h && r.ecc === ecc);
  const f0 = e('fixed', 'repo', 'none'), el = e('ecl', 'repo', 'none'), av = e('avg', 'repo', 'none'), ae = e('avg', 'repo', 'repo'), fl = e('fixed', 'lit', 'none');
  F.earth = `- 地球の残り(仮 − 重力)は、リポジトリの月の道(傾き ${Number(J.t1.iMoonDeg).toFixed(3)}°・交点はリポジトリの向き)で ${fs3(f0.resid)}・黄道の面で ${fs3(el.resid)}・交点の 1 巡(18.6 年)の平均で ${fs3(av.resid)}・平均 + 離心率の倍で ${fs3(ae.resid)} ″/年。`
    + ` 慣性モーメントの係数の置き方(J2 ÷ C/MR² と H 0.0032737)の差は ${fe(Math.abs(fl.resid - f0.resid))} ″/年・質量と距離の最後の桁の振れは ${fe(f0.digit)} ″/年。月の項は ${fs3(f0.moonTerm)}(固定)→ ${fs3(av.moonTerm)}(平均)。`
    + ` **18.6 年の平均の列では残りの符号が〔第353便f〕と逆になり、主の列 (g2−) の軸引きずりが埋める向きになる**(要る c は u 0.98 で ${fs3(av.cNeedM)}・離心率の倍を足すと ${fs3(ae.cNeedM)} —— このとき残り ${fe(Math.abs(ae.resid))} は幅 ${fe(ae.width)} の内で、最後の桁の振れ ${fe(ae.digit)} より小さい)。`;
  F.node = `- 傾きを ${Number(J.t1.iMoonDeg).toFixed(3)}° のまま交点の経度を回すと、重力の列は ${fs3(Math.max(...J.t1node.rows.map((r) => r.az)))}〜${fs3(Math.min(...J.t1node.rows.map((r) => r.az)))} ″/年・残りは ${fs3(Math.max(...J.t1node.rows.map((r) => r.resid)))}〜${fs3(Math.min(...J.t1node.rows.map((r) => r.resid)))} ″/年を動く。残りが 0 になる交点の経度は ${J.t1node.zeros.map((x) => Number(x).toFixed(1) + '°').join('・')}(離心率の倍を足すと ${J.t1node.zerosEcc.map((x) => Number(x).toFixed(1) + '°').join('・')})。リポジトリの向き(0°)は、月の道の傾きが黄道傾斜に足される側(残りが最大の側)。`;
  const v = (p, a, s) => J.t2.rows.find((r) => r.pole === p && r.axis === a && r.sense === s), closes = J.t2.rows.filter((r) => r.closes);
  F.venus = `- 金星: ŝ の向きの置き方(有向の角運動量・北半球の極)を替えても方位の率は同じ・極を南極に替えると全部の方位の率の符号が反転する —— 埋める向きか・残りの大きさは替わらない。替わるのは極の族(公転の極・黄道の極・基準軸 L)と仮の値の回る向き。`
    + ` 同じ回りの仮定で残りは 公転の極 ${fs3(v('orbN', 'L', 'tide').resid)}・黄道の極 ${fs3(v('eclN', 'L', 'tide').resid)}・基準軸 L ${fs3(v('L', 'L', 'tide').resid)} ″/年、逆の回りの仮定で ${fs3(v('orbN', 'L', 'anti').resid)}・${fs3(v('eclN', 'L', 'anti').resid)}・${fs3(v('L', 'L', 'anti').resid)} ″/年。軸引きずり (g2−) は ${J.t2.rows.every((r) => r.fill === true) ? '20 組の全部で埋める向き' : '組で向きが替わる'}。`
    + ` 話が閉じる(残りが幅 ${fe(v('orbN', 'L', 'tide').width)} の内 かつ 埋める向き)のは ${closes.length} 組 —— ${[...new Set(closes.map((r) => POLE[r.pole]))].join('・')} × 同じ回りの仮定(ŝ の向きは 2 つとも)。`;
  const c = (id, vs, moon, u) => J.t3.rows.find((r) => r.id === id && (r.venusSense || 'tide') === vs && r.moon === moon && r.u === u), s = J.t3.spread['0.98'], s3 = J.t3.spread3['0.98'];
  F.c = `- 要る c(u 0.98・(g2−))は 火星 ${fe(c('Mars', 'tide', null, 0.98).cNeed)}・金星(同じ回り)${fe(c('Venus', 'tide', null, 0.98).cNeed)}(残りが幅の内 —— 上限としてだけ)・地球(18.6 年の平均)${fe(c('Earth', 'tide', 'avg', 0.98).cNeed)}。`
    + ` 火星と金星の比のそろい方(最大 ÷ 最小)は c そのもの ${fp3(s.c)}・(ウ′) で割ると ${fp3(s.uJ)}・(ウ) ${fp3(s.u)}・(イ) ${fp3(s.i)}・(P-応) の倍 ${fp3(s.mObs)}。地球(18.6 年の平均)を足すと ${fp3(s3.c)}・${fp3(s3.uJ)}・${fp3(s3.u)}・${fp3(s3.i)}・${fp3(s3.mObs)}(一番そろうのは (イ) 1 ÷ ω —— 3 つの数の並びで、候補の 1 つ)。`;
  return F;
}

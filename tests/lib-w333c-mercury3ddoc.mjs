// 第333便c(原仮定者の整理(2026-11-10)・原仮定者の回答(2026-11-10 —— AN597・AN598・AN600)・統括の検証項目 R319): **正本 tests/out/mercury3d-w333c.json から PHYSICS〔第333便c〕の表を作る文書の lib**
// (QA docs.mercury3d333c が節の表と逐語で照合する —— 表の数は有効数字 4 桁か指数 3 桁・丸めの程度の数〔中心力の交点・傾きの数値の残り・数値の帯〕は「< 1e-9」の形で書き、数そのものは載せない)。
export const DOC_VERSION = 'w333c-mercury3ddoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toExponential(3));
const f4 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toPrecision(4));
const fx = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Math.abs(x) >= 0.01 && Math.abs(x) < 1e5 ? Number(x).toPrecision(4) : Number(x).toExponential(3));
const lt = (x, t) => (x === null || x === undefined ? '—' : Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : fx(x));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : 'null');
const RULE = Object.freeze({ kappaM: 'R = Y_k m', radius: '観測の半径' });
const PART = Object.freeze({ trans: '並進の分 −βv', rot: '回転の分 β s × p' });
const PAIR = Object.freeze({ receiver: '受け手', symmetric: '対称' });
/** 率の 4 つ(ω・ϖ・交点・傾き)の欄(小さな数値の残りは lt) */
const four = (o, tol) => [o.domega, o.dvarpi, o.dnode, o.di].map((x) => lt(x, tol)).join(' | ');
/** 行の尺度(率の絶対値の最大)—— 数値の残りの上限は尺度 × 1e-9 */
const rowMax = (q) => Math.max(Math.abs(q.apsIn), ...['ecl', 'sun'].flatMap((f) => ['domega', 'dvarpi', 'dnode', 'di'].map((k) => (q[f] && Number.isFinite(q[f][k]) ? Math.abs(q[f][k]) : 0))));
export function tablesOf(J) {
  const T = {}, G = J.geom, M = J.mercury, S = J.pure.scenes, PG = J.pure.gates;
  // 表 1 三次元の幾何(本の状態 → 要素 —— 黄道と太陽の赤道面)
  T.geom = ['| 惑星 | 出どころ | a [au] | e | 黄道: i [°] | Ω_node [°] | ω [°] | ϖ [°] | 太陽の赤道面: i [°] | Ω_node [°](赤道面の上 —— 黄道の昇交点から) | ω [°] | 文献の太陽の赤道面に対する i [°] |', '|---|---|---|---|---|---|---|---|---|---|---|---|']
    .concat(G.rows.map((q) => `| ${q.ja} | ${q.src === '文献の値(本を読まない)' ? '文献の値' : q.src} | ${q.aAU.toPrecision(8)} | ${q.e.toPrecision(6)} | ${q.key === 'earth' ? '≈ 0(定まらない)' : q.iEclDeg.toPrecision(6)} | ${q.key === 'earth' ? '—' : q.nodeEclDeg.toPrecision(6)} | ${q.key === 'earth' ? '—' : q.omegaEclDeg.toPrecision(6)} | ${q.varpiEclDeg.toPrecision(6)} | ${q.iEqDeg.toPrecision(5)} | ${q.nodeEqDeg.toPrecision(5)} | ${q.omegaEqDeg.toPrecision(5)} | ${q.eqIncLit} |`)).join('\n');
  // 表 2 太陽の極(本の宣言と文献の極を黄道へ)
  T.pole = ['| 太陽の極 | 傾き [°](黄道の北から) | 方位 [°](黄経) | 自転 s [rad/s] | 恒星自転周期 [日] |', '|---|---|---|---|---|',
    `| 本(🌡️ の bodies[0] の spinAxis・spin) | ${G.sunBook.tiltDeg.toPrecision(12)} | ${G.sunBook.azimuthDeg.toPrecision(12)} | ${fe(G.sunBook.spin)} | ${f4(G.sunBook.periodDays)} |`,
    `| 文献の極 α0 286.13°・δ0 63.87° を J2000 の黄道へ(ε0 = 84381.406″) | ${G.sunLit.tiltDeg.toPrecision(12)} | ${G.sunLit.azimuthDeg.toPrecision(12)} | — | 25.38(Carrington —— 比べる値) |`].join('\n');
  // 表 3 今の組(凍結の基準 —— 正本の値と一次の分担)
  { const n = M.glock1.now, c = n.canon;
    T.now = ['| 列 | G_loc(受け手 n = 2)〔″/世紀〕 | K1 の並進〔″/世紀〕 | 和 | 和 ÷ q_1PN | 交点・傾き(黄道・太陽の赤道面) |', '|---|---|---|---|---|---|',
      `| 正本 inposk1-w315c(写し・h/2 —— q10 − q00 と q11 − q10) | ${f4(c.dqG)} | ${f4(c.DG)} | ${f4(c.sum)} | ${f4(c.sum / M.glock1.q1cy)} | 写しは近点だけを測る(二体 —— 公転面は不動) |`,
      `| 一次(Gauss の式の軌道の平均・本の状態の軌道) | ${f4(n.gLoc.apsIn)} | ${f4(n.k1.apsIn)} | ${f4(n.sumApsIn)} | ${f4(n.sumApsIn / M.glock1.q1cy)} | ${['ecl', 'sun'].every((f) => ['gLoc', 'k1'].every((k) => Math.abs(n[k][f].di) <= 1e-9 && Math.abs(n[k][f].dnode) <= 1e-9)) ? '< 1e-9(中心力と公転面の中の力)' : '**0 でない**'} |`,
      `| 一次 ÷ 正本 − 1 | ${lt(n.vsCanon.gRel, 1e-5)} | ${lt(n.vsCanon.kRel, 1e-5)} | — | — | q_1PN = ${f4(M.glock1.q1cy)}″/世紀・η = ${fe(M.glock1.eta)} |`].join('\n'); }
  // 表 4 G_loc の次数と対称(単独 —— 今の n = 2 を置き換えると動く量)
  T.gloc = ['| 型 | n | 分担 ÷ q_1PN(一次 —— 第331便c の gLocShare) | Gauss の率〔″/世紀〕(ω = ϖ = 軌道面の中) | 今の G_loc からの差〔″/世紀〕 | K1 と足す ÷ q_1PN | K1 を外す ÷ q_1PN | 交点・傾き |', '|---|---|---|---|---|---|---|---|']
    .concat(M.glock1.grid.map((q) => `| ${PAIR[q.pair]} | ${q.n} | ${f4(q.share)} | ${fx(q.apsIn)} | ${fx(q.vsNow)} | ${f4(q.totalWithK1)} | ${f4(q.totalNoK1)} | ${Math.abs(q.ecl.di) <= 1e-9 && Math.abs(q.sun.dnode) <= 1e-9 ? '< 1e-9' : '**0 でない**'} |`)).join('\n');
  // 表 5 統合した並進引きずり(α × 自己の規則 × 部分 —— 単独の率)
  T.trans = ['| 自己の半径 | α | 部分 | 自己の型 | β(a) | 軌道面の中の近点 | 黄道: ω | ϖ | Ω_node | i | 太陽の赤道面: ω | ϖ | Ω_node | i | ln a〔/世紀〕 | 一次外挿が壊れる |', '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|']
    .concat(M.trans.rows.map((q) => `| ${RULE[q.rule]} | ${q.alpha} | ${PART[q.part]} | ${q.selfType} | ${fe(q.betaAtA)} | ${fx(q.apsIn)} | ${four(q.ecl, 1e-9 * rowMax(q))} | ${four(q.sun, 1e-9 * rowMax(q))} | ${lt(q.dlnAcy, 1e-12)} | ${tf(q.breaks)} |`)).join('\n');
  // 表 6 今の組に足すと動く量(黄道の ϖ・Ω_node・i と太陽の赤道面の Ω_node —— 足し算は一次の範囲の宣言)
  { const n = M.glock1.now, base = n.sumApsIn, pick = (lab, q) => { const t = 1e-9 * rowMax(q); return `| ${lab} | ${fx(base + q.ecl.dvarpi)} | ${lt(q.ecl.dnode, t)} | ${lt(q.ecl.di, t)} | ${fx(base + q.sun.dvarpi)} | ${lt(q.sun.dnode, t)} | ${tf(q.breaks)} |`; };
    const tr = (rule, a, part) => M.trans.rows.find((q) => q.rule === rule && q.alpha === a && q.part === part), pr = (a, sd, resp) => M.rotDiff.pair.find((q) => q.alpha === a && q.sdKey === sd && q.resp === resp);
    T.add = ['| 足す効果(単独の一次の率を今の組に足す) | 黄道: ϖ〔″/世紀〕 | Ω_node | i | 太陽の赤道面: ϖ | Ω_node | 一次外挿が壊れる |', '|---|---|---|---|---|---|---|',
      `| 今の組だけ(凍結の基準) | ${fx(base)} | 0 | 0 | ${fx(base)} | 0 | 偽 |`,
      pick('統合した並進の回転の分(α = 1・R = Y_k m —— K1 と同じ係数)', tr('kappaM', 1, 'rot')), pick('統合した並進の回転の分(α = 3・観測の半径)', tr('radius', 3, 'rot')),
      pick('統合した並進の並進の分(α = 3・観測の半径)', tr('radius', 3, 'trans')), pick('切り口の式(第332便a の主・観測自転)', M.rotDiff.cut),
      pick('対向 2 点の差分(α = 2・観測自転・固定)', pr(2, 'observed', 'fixed')), pick('対向 2 点の差分(α = 2・λ_J = 1e-3・連動)', pr(2, 'lambdaJ=0.001', 'linked')),
      pick('対向 2 点の差分(α = 2・λ_J = 1・固定)', pr(2, 'lambdaJ=1', 'fixed'))].join('\n'); }
  // 表 7 回転引きずりの差分(切り口の式と対向 2 点 × α × s_d × 応答率)
  { const R = M.rotDiff, c = R.cut;
    T.rotdiff = ['| 型 | α | s_d | s_d R_d/c | 応答率 | 軌道面の中の近点 | 黄道: Ω_node | i | 太陽の赤道面: Ω_node | i | ln a〔/世紀〕 | 一次外挿が壊れる |', '|---|---|---|---|---|---|---|---|---|---|---|---|',
      `| 切り口の式(帯の外で 0 —— 横切る ${c.crossSec.map((x) => x.toPrecision(3)).join('・')} 秒) | — | 観測自転 | ${fe(R.sds[0].sdRdOverC)} | 固定 | ${fe(c.apsIn)} | ${fe(c.ecl.dnode)} | ${fe(c.ecl.di)} | ${lt(c.sun.dnode, 1e-20)} | ${fe(c.sun.di)} | ${fe(c.dlnAcy)} | ${tf(c.breaks)} |`]
      .concat(R.pair.map((q) => `| 対向 2 点の差分 | ${q.alpha} | ${q.sdLabel} | ${fe(q.sdRdOverC)} | ${q.resp === 'fixed' ? '固定' : '連動'} | ${lt(q.apsIn, 1e-6 * Math.max(Math.abs(q.ecl.dnode || 0), Math.abs(q.sun.di || 0)))} | ${fe(q.ecl.dnode)} | ${fe(q.ecl.di)} | ${fe(q.sun.dnode)} | ${fe(q.sun.di)} | ${fe(q.dlnAcy)} | ${tf(q.breaks)} |`)).join('\n'); }
  // 表 8 純粋な三次元の積分器の照合
  T.numeric = ['| 型(係数を上げた写し) | 一次: 近点〔rad/公転〕 | 交点 | 傾き | ln a | 数値 h/2: 近点 | 交点 | 傾き | ln a | 一次との差 ÷ 尺度 | h と h/2 の差 ÷ 尺度 |', '|---|---|---|---|---|---|---|---|---|---|---|']
    .concat(J.numeric.rows.map((q) => { const sc = Math.max(...['aps', 'di', 'dnode', 'domega', 'dlnA'].map((k) => Math.abs(q.analytic[k]))), s = (x) => lt(x, 1e-7 * sc);
      return `| ${q.label} | ${s(q.analytic.aps)} | ${s(q.analytic.dnode)} | ${s(q.analytic.di)} | ${s(q.analytic.dlnA)} | ${s(q.h2.aps)} | ${s(q.h2.dnode)} | ${s(q.h2.di)} | ${s(q.h2.dlnA)} | ${lt(q.devOverScale, 1e-4)} | ${lt(q.bandOverScale, 1e-4)} |`; })).join('\n');
  // 表 9 対照(金星・地球・火星 —— 大きさ)
  T.controls = ['| 惑星 | 太陽の赤道面に対する i [°] | q_1PN〔″/世紀〕 | G_loc n = 2 | K1 | 統合した並進の回転の分(α = 1・Y_k m): 太陽の赤道面の Ω_node | 黄道の Ω_node | 黄道の i | 対向 2 点(α = 2・観測自転): 太陽の赤道面の i | 同(λ_J = 1e-3・連動) | 切り口の式: 太陽の赤道面の i |', '|---|---|---|---|---|---|---|---|---|---|---|']
    .concat(J.controls.map((q) => `| ${q.ja} | ${q.iEqDeg.toPrecision(4)} | ${f4(q.q1cy)} | ${f4(q.gLoc)} | ${f4(q.k1)} | ${fx(q.transRot1.sunNode)} | ${fx(q.transRot1.eclNode)} | ${fx(q.transRot1.eclDi)} | ${fe(q.pair2obs.sunDi)} | ${fe(q.pair2J3linked.sunDi)} | ${fe(q.cut.sunDi)} |`)).join('\n');
  // 表 10 連星の対称 G_loc(一次の分担 ÷ q_1PN —— η の格子)
  T.binary = ['| 型 | 区別 | η = 0(試験粒子) | η = 9.5352e-4(木星) | η = 0.1 | η = 0.25(等質量) | 純粋な積分器 η = 0 | η = 0.25 |', '|---|---|---|---|---|---|---|---|']
    .concat(J.binary.first.map((q) => { const nm = J.binary.numeric.filter((r) => r.key === q.key); return `| ${q.label} | ${q.status} | ${q.shares.map((s) => s.total.toPrecision(6)).join(' | ')} | ${nm.map((r) => r.total.toPrecision(6)).join(' | ')} |`; })).join('\n');
  // 表 11 純関数の場面
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| G_loc の力の型(n = 2・ε = 1e-10・e = 0.2・傾き 0.4 rad): 1 公転の近点 ÷ −2nπε/p・交点と傾き | ${(S.gLoc.perOrbit / S.gLoc.expect).toPrecision(8)}・< 1e-24 | ${tf(PG.gLoc)} |`,
    `| K1 の速度の型(b = 1e-7): 1 公転の近点 ÷ πb/p・交点と傾き | ${(S.k1.perOrbit / S.k1.expect).toPrecision(8)}・< 1e-20 | ${tf(PG.k1)} |`,
    `| J₂ の型(独立の照合): 交点 ÷ −(3/2)nJ₂(R/p)² cos i・近点引数 ÷ (3/4)nJ₂(R/p)²(5cos²i − 1)・傾き | ${(S.j2.dnode / S.j2.expectNode).toPrecision(8)}・${(S.j2.domega / S.j2.expectOmega).toPrecision(8)}・< 1e-18 | ${tf(PG.j2)} |`,
    `| 対向 2 点の差分: z の鏡映・s_d の符号・遠方の形 α s_d R_d² ρ/r² との比(α = 1・1.5・2・3)・帯の外(z = 10R_d)で正 | ${S.pair.mirror}・${S.pair.sign}・${S.pair.far.map((q) => q.ratio.toPrecision(6)).join('・')}・${S.pair.outside} | ${tf(PG.pair)} |`,
    `| 切り口の式の帯の区間の積分 ÷ 第332便a の円軌道の平均(orbitRates)の di/dt・区間の数 | ${(S.cut.di / S.cut.ref).toPrecision(8)}・${S.cut.windows} | ${tf(PG.cut)} |`,
    `| 連星の一次: 対称 n = 4 + K1(η の格子 4 点)・等質量の受け手 n = 2 + K1 と対称 n = 2 + K1 | ${S.binary.sym4.join('・')}・${S.binary.eqMass.map((x) => x.toPrecision(6)).join('・')} | ${tf(PG.binary)} |`,
    `| 入力の拒否(源の点の上・負の ρ・宣言の外の α・R_d = 0・束縛でない軌道・n の非有限) | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(PG.rejects)} |`,
    `| H₁(第330便b の harmonicSelf(1))÷ C₁ | ${(S.h1.H1 / S.h1.C1).toPrecision(8)} | ${tf(PG.h1)} |`].join('\n');
  return T;
}

// 第337便b(原仮定者の指示(2026-11-14 —— 第138報)・探索の方針(第138報)・統括の検証項目 R338): **正本 tests/out/mercuryband-337b.json から PHYSICS〔第337便b〕の表を作る文書の lib**
//   (QA docs.mercuryband337b が節の表と逐語で照合する —— 表の数は有効数字 4 桁か指数 3 桁・丸めの程度の数〔対称で 0 の成分・数値の残り〕は「< 1e-…」の形で書き、数そのものは載せない)。
export const DOC_VERSION = 'w337b-mercurybanddoc-1';
const ok = (x) => x !== null && x !== undefined && Number.isFinite(x);
const fe = (x) => (!ok(x) ? '—' : Number(x).toExponential(3));
const f4 = (x) => (!ok(x) ? '—' : Number(x).toPrecision(4));
const fx = (x) => (!ok(x) ? '—' : x === 0 ? '0' : Math.abs(x) >= 0.01 && Math.abs(x) < 1e5 ? Number(x).toPrecision(4) : Number(x).toExponential(3));
const lt = (x, t) => (!ok(x) ? '—' : Math.abs(x) <= t ? '< ' + t.toExponential(0) : fx(x));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const SC = Object.freeze({ tangent: '接線の分を候補で', k1: 'K1 を候補で', gloc: 'G_loc を候補で', gloc1: 'G_loc を n = 1 に', all: '全部を候補で' });
const NAME = Object.freeze({ transRadial: '(1) 並進引きずり 動径の分(距離の変化)', transTangent: '(2) 並進引きずり 接線の分', transNormal: '並進引きずり 法線の分', trans: '(3) 並進の和(統合した並進の並進の分)', k1: '(3′) K1 の並進(今の組)',
  rot: '(4) 並進の座標変換に入る源の回転(観測自転 s)', gloc0: '(5) G_loc n = 0', gloc1: '(5) G_loc n = 1', gloc2: '(5) G_loc n = 2(今の組)', pair2jEquiv: '(6) R2 旧い回転の差分 α = 2・J 等価', cut: '(6) R3 切り口(帯)',
  t1phiVel: '(6) R4 T1 × 方位 × 速度の場', t1tangentVel: '(6) R4 T1 × 接線 × 速度の場', t1normalVel: '(6) R4 T1 × 法線 × 速度の場', t1radialVel: '(6) R4 T1 × 動径 × 速度の場', t1phiPush: '(6) R4 T1 × 方位 × 押し' });
/** 候補の名(器の specKey: 型|速さ|向き|H|q|p)を読む形に */
export function knobName(key) {
  const [type, speed, dir, H, q, p] = key.split('|'), Hm = /^([A-Za-z]+)([\d.e+]+)$/.exec(H) || [];
  const Hs = Hm[1] === 'Rsun' ? `H = ${Hm[2]} R_☉` : Hm[1] === 'Rd' ? `H = ${Hm[2] === '10000' ? '1e4' : Hm[2]} R_d` : `H = r tan ${Hm[2]}°`;
  return `${({ vel: '速度の場', push: '押し', rel: '相対の速度' })[type] || type}・${speed === 'obs' ? '観測自転' : 'J 等価'}・${dir === 'phi' ? 'ŝ × p' : '面内へ射影'}・${Hs}・q = ${q.slice(1)}・p = ${p.slice(1)}`;
}
export function tablesOf(J) {
  const T = {}, M = J.mercury, D = M.decomp, S = M.scan, PS = J.pure.scenes, PG = J.pure.gates;
  // 表 1 幾何(太陽の赤道面に対する —— GEOM の要素と太陽の極から)
  T.geom = ['| 天体 | i(太陽の赤道面)・ω [°] | 順回転(L̂·ŝ) | 昇交点: f [°]・r/a・M [°]・近点からの日 | 降交点: f [°]・r/a・M [°]・近点からの日 | 2 点とも ∣f∣ < 90° | 2 点とも ∣M∣ < 90° | 近点・遠点の高さ ∣z∣ [R_☉] | 高さの比・(1 − e)/(1 + e) | 時間平均 ∣z∣ [R_☉]: 全周・近点の側の半周期・遠点の側 | ∣z∣ ≤ R_☉ の時間の割合: 近点の側・遠点の側 |',
    '|---|---|---|---|---|---|---|---|---|---|---|']
    .concat(J.geometry.map((g) => { const R = J.geom.Rsun, p = (q) => `${f4(q.fDeg)}・${f4(q.rOverA)}・${f4(q.Mdeg)}・${f4(q.tFromPeriDays)}`;
      return `| ${g.ja} | ${f4(g.iSunDeg)}・${f4(g.omegaSunDeg)} | ${tf(g.prograde)}(${f4(g.LdotS)}) | ${p(g.asc)} | ${p(g.desc)} | ${tf(g.readings.bothPeriSideF)} | ${tf(g.readings.bothPeriSideM)} | ${f4(Math.abs(g.zPeri) / R)}・${f4(Math.abs(g.zApo) / R)} | ${f4(g.heightRatio)}・${f4(g.heightRatioExpect)} | ${f4(g.meanAbsZ / R)}・${f4(g.meanAbsZPeriHalf / R)}・${f4(g.meanAbsZApoHalf / R)} | ${f4(g.bandTime.periHalf)}・${f4(g.bandTime.apoHalf)} |`; })).join('\n');
  // 表 2 寄与の分解(水星 —— 一次の率を同じ行に)
  T.decomp = [`| 列(q_1PN = ${f4(D.q1cy)}″/世紀) | ω_W〔″/世紀〕 | 黄道の ϖ | 黄道の Ω_node | 太陽の赤道面の Ω_node | dL̂/dt の大きさ | de/dt〔1/世紀〕 | d ln P/dt〔1/世紀〕 | 一次外挿が壊れる |`, '|---|---|---|---|---|---|---|---|---|']
    .concat(J.plan.decompKeys.map((k) => { const q = D.rows[k], u = 1e-9 * Math.max(Math.abs(q.apsW || 0), q.Lmag, 1e-9 * Math.abs(D.rows.trans.apsW));
      return `| ${NAME[k]} | ${lt(q.apsW, u)} | ${lt(q.ecl.dvarpi, u)} | ${lt(q.ecl.dnode, u)} | ${lt(q.sun.dnode, u)} | ${lt(q.Lmag, u)} | ${lt(q.decy, 1e-12)} | ${lt(q.dlnPcy, 1e-12)} | ${tf(q.breaks)} |`; }))
    .concat([`| 閉じ(動径 + 接線 + 法線 − 和)÷ 和・和 ÷ K1 | ${lt(D.closure, 1e-9)}・${f4(D.transOverK1)} | — | — | — | — | — | — | — |`]).join('\n');
  // 表 3 組の和(÷ q_1PN)
  T.sums = ['| 組 | ω_W〔″/世紀〕 | ÷ q_1PN | 否定対照 |', '|---|---|---|---|'].concat(D.sums.map((c) => `| ${c.label} | ${fx(c.apsW)} | ${f4(c.overQ)} | ${c.negative ? '真(二重)' : '—'} |`)).join('\n');
  // 表 4 区間(どこで効くか)
  T.bins = ['| 列 | 全周の ω_W〔″/世紀〕 | 打ち消しの度合い(和の絶対値 ÷ 絶対値の和) | 近日点 ±1 区間の割合 | 遠日点 ±1 区間 | 交点 ±1 区間(昇交点と降交点) |', '|---|---|---|---|---|---|']
    .concat(M.bins.map((b) => `| ${b.key.startsWith('band:') ? '(7) 候補(' + SC[b.key.split(':')[1]] + ')' + knobName(b.key.split(':').slice(2).join(':')) : NAME[b.key]} | ${fx(b.sum)} | ${f4(b.netOverGross)} | ${f4(b.shares.peri)} | ${f4(b.shares.apo)} | ${f4(b.shares.nodes)} |`)).join('\n');
  { const mk = M.bins[0].marks, keys = M.bins.map((b) => b.key), tag = (k) => [k === mk.peri ? '近日点' : '', k === mk.apo ? '遠日点' : '', k === mk.asc ? '昇交点' : '', k === mk.desc ? '降交点' : ''].filter(Boolean).join('・');
    T.binsPer = ['| 区間 k(中心 f = 10k°) | 印 | ' + keys.map((k, i) => (k.startsWith('band:') ? '候補 ' + (i - J.plan.binKeys.length + 1) : NAME[k].replace(/^\([^)]*\) /, ''))).join(' | ') + ' |', '|' + '---|'.repeat(keys.length + 2)]
      .concat(M.bins[0].perBin.map((_, k) => `| ${k} | ${tag(k) || '—'} | ` + M.bins.map((b) => lt(b.perBin[k], 1e-9 * Math.abs(b.gross || 0))).join(' | ') + ' |')).join('\n'); }
  // 表 5 ノブの格子の集計(置き換えの組ごと)
  T.scan = [`| 置き換えの組(候補が担う ω_W) | 行 | λ_B > 0(順方向) | ϖ の比 ≤ 1 | 交点の比 ≤ 1 | 周期の比 ≤ 1 | 離心率の比 ≤ 1 | ϖ・交点・周期 ≤ 1 | うち順方向 | 全部 ≤ 1 かつ順方向(合う組) | 離心率の比の最小(ϖ・交点・周期 ≤ 1 の行)・うち順方向 |`, '|---|---|---|---|---|---|---|---|---|---|---|']
    .concat(S.summary.map((c) => `| ${c.label}(${fx(c.need)}″/世紀) | ${c.rows} | ${c.prograde} | ${c.pass.varpi} | ${c.pass.node} | ${c.pass.period} | ${c.pass.ecc} | ${c.passNodePeriod} | ${c.progradeNodePeriod} | ${c.match} | ${fe(c.minEccRatioPassOthers)}・${fe(c.minEccRatioProgradePassOthers)} |`)).join('\n');
  // 表 6 型ごとの符号(λ_B = 1 の水星の ω_W の正の行)と速さの列
  T.signs = [`| 作用の型 | 行 | 順方向の λ_B で ω_W > 0 の行 | 速さの列(J 等価 s_d ÷ 観測自転 s = ${fe(S.speedRatioJ)}): λ_B の尺度の換算 |`, '|---|---|---|---|']
    .concat(S.signs.map((q) => `| ${({ vel: '速度の場', push: '押し', rel: '相対の速度' })[q.type]} | ${q.rows} | ${q.positive} | ${q.type === 'rel' ? '換算できない(−w の項は s_* に比例しない —— 両方の速さを走らせた)' : '× ' + fe(S.lambdaScaleJ[q.type])} |`)).join('\n');
  // 表 7 合う組(G_loc を候補で)
  { const m = M.matches.find((x) => x.scenario === 'gloc'), m1 = M.matches.find((x) => x.scenario === 'gloc1');
    T.matches = [`| 候補(G_loc を候補で —— 合う組 ${m.rows.length} 行・G_loc を n = 1 に ${m1.rows.length} 行) | λ_B | ϖ の比 | 交点の比 | 周期の比 | 離心率の比 |`, '|---|---|---|---|---|---|']
      .concat(m.rows.map((r) => `| ${knobName(r.key)} | ${fe(r.lambda)} | ${f4(r.ratios.varpi)} | ${f4(r.ratios.node)} | ${lt(r.ratios.period, 1e-6)} | ${lt(r.ratios.ecc, 1e-6)} |`)).join('\n'); }
  // 表 8 代表の候補(λ* と比・(i) の λ の範囲)
  T.reps = ['| 置き換えの組 | 型 | 候補 | λ_B*(置き換え) | 順方向 | ϖ・交点・周期・離心率の比 | (i) 今の組 + 候補の ϖ が幅の内の λ_B の範囲 | (i) ϖ と交点が同時に幅の内 | 合う |', '|---|---|---|---|---|---|---|---|---|']
    .concat(M.reps.map((r) => { const row = S.rows.find((x) => x.key === r.key), rg = (a) => (a ? `[${fe(a[0])}, ${fe(a[1])}]` : '空');
      return `| ${SC[r.scenario]} | ${r.type} | ${knobName(r.key)} | ${fe(r.lambda)} | ${tf(r.prograde)} | ${f4(r.ratios.varpi)}・${f4(r.ratios.node)}・${lt(r.ratios.period, 1e-6)}・${lt(r.ratios.ecc, 1e-6)} | ${rg(row.lamVarpi)} | ${rg(row.lamVarpiNode)} | ${tf(r.match)} |`; })).join('\n');
  // 表 9 順方向の最良(置き換えの組 × 型)
  T.prograde = ['| 置き換えの組 | 速度の場: 候補・最大の比 | 押し: 候補・最大の比 | 相対の速度: 候補・最大の比 |', '|---|---|---|---|']
    .concat(M.prograde.map((c) => `| ${SC[c.scenario]} | ` + c.perType.map((q) => (q.key ? `${knobName(q.key)}・${fe(q.max)}` : '順方向の行なし')).join(' | ') + ' |')).join('\n');
  // 表 10 持ち出し(同じノブ・同じ λ_B・同じ置き換えの組)
  T.carry = ['| 天体(q_1PN〔″/世紀〕) | 置き換えの組 | 型 | 候補の ω_W〔″/世紀〕 | 残す列 + 候補 ÷ q_1PN | ϖ の比 | 交点の比 | 周期の比 | 離心率の比 |', '|---|---|---|---|---|---|---|---|---|']
    .concat(J.carry.flatMap((c) => c.reps.map((r) => `| ${c.ja}(${f4(c.q1cy)}) | ${SC[r.scenario]} | ${r.type} | ${fx(r.bandApsW)} | ${f4(r.totalOverQ)} | ${fe(r.ratios.varpi)} | ${r.ratios.node === null ? '—' : f4(r.ratios.node)} | ${lt(r.ratios.period, 1e-6)} | ${lt(r.ratios.ecc, 1e-6)} |`))).join('\n');
  // 表 11 純粋な積分器(T4)
  T.integ = ['| 置き換えの組・候補 | λ_B | 一次の ω_W〔″/世紀〕 | 積分器 2000 步/公転・4000 步/公転 | 一次との差 ÷ 一次 | 刻みの差 ÷ 一次 | 一次・積分器の d ln a/dt〔1/世紀〕 |', '|---|---|---|---|---|---|---|']
    .concat(M.integ.rows.map((q) => `| ${SC[q.scenario]}・${knobName(q.key)} | ${fe(q.lambda)} | ${fx(q.firstApsW)} | ${q.runs.map((r) => fx(r.apsCy)).join('・')} | ${fe(q.relDiff)} | ${fe(q.stepSpread)} | ${lt(q.firstDlnAcy, 1e-12)}・${lt(q.runs[q.runs.length - 1].dlnAcy, 1e-8)} |`))
    .concat(M.integ.skipped.map((q) => `| ${SC[q.scenario]}・${knobName(q.key)} | — | — | 外した(${q.why}) | — | — | — |`)).join('\n');
  // 表 12 二次の結合(並進 × 帯)
  { const X = M.mix; T.mix = ['| 相手 | 混合の差 M〔rad/公転 —— 4000 步・16 公転〕 | 刻みと窓の振れ | 分解できた(> 10 倍) | 帯の係数を倍にした比 | 本物の係数で〔″/世紀〕 | 帯の一次〔″/世紀〕 |', '|---|---|---|---|---|---|---|',
    X ? `| ${SC[X.scenario]}・${knobName(X.key)}(帯の写しの倍率 ${fe(X.amp)}・並進 c_T = ${fe(X.cT)}・β(a) = ${fe(X.betaA)}) | ${fe(X.mixRef)} | ${fe(X.numSpread)} | ${tf(X.resolved)} | ${f4(X.bilinRatio)} | ${X.resolved ? fe(X.realArcsecCy) : '—(分解できない)'} | ${fx(X.firstArcsecCy)} |` : '| — | — | — | — | — | — | — |'].join('\n'); }
  // 表 13 純関数の場面
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| 部分積分の読み = 第334便c の vectorRates(中心差分)—— 広い帯と並進の分 | ${lt(Math.max(PS.ibp.band, PS.ibp.trans), 1e-6)} | ${tf(PG.ibp)} |`,
    `| 細い帯(H = R_d)の積分の点の倍(GL 24 と 48 —— 区切り ${PS.narrow.segs}) | ${lt(PS.narrow.dev, 1e-6)} | ${tf(PG.narrow)} |`,
    `| λ_B = 0 で 0・λ_B に比例 | ${PS.zero.zero === 0 ? '0' : fe(PS.zero.zero)}・${lt(PS.zero.lin, 1e-12)} | ${tf(PG.zero)} |`,
    `| 速度の型の帯は半長軸を動かさない・面内へ射影した型は L̂ を動かさない | ${lt(PS.vel.dlnA, 1e-9)}・${lt(PS.vel.planeIn, 1e-9)} | ${tf(PG.vel)} |`,
    `| 高さの比 = (1 − e)/(1 + e)・交点の真近点角の差 = π | ${lt(PS.geom.ratio, 1e-12)}・${lt(PS.geom.nodeGap, 1e-12)} | ${tf(PG.geom)} |`,
    `| 区間の和 = 全周 | ${lt(PS.bins.dev, 1e-8)} | ${tf(PG.bins)} |`,
    `| 単位の軌道への写し × (a n) = 実の場 | ${lt(PS.unit, 1e-12)} | ${tf(PG.unit)} |`,
    `| 入力の拒否 | ${PS.rejects.filter(Boolean).length}/${PS.rejects.length} | ${tf(PG.rejects)} |`].join('\n');
  return T;
}

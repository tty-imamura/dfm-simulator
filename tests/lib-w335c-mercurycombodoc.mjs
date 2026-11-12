// 第335便c(原仮定者の決断(2026-11-12)・原仮定者の補足(2026-11-12)・原仮定者の回答(2026-11-12 —— AN646・AN650・AN655・AN657)・統括の検証項目 R330): **正本 tests/out/mercurycombo-w335c.json から
// PHYSICS〔第335便c〕の表を作る文書の lib**(QA docs.mercuryCombo335c が節の表と逐語で照合する —— 表の数は有効数字 4 桁か指数 3 桁・丸めの程度の数〔対称で 0 の成分・数値の残り〕は
//   行の尺度の 1e-9 を上限にした「< 1e-…」の形で書き、数そのものは載せない)。
export const DOC_VERSION = 'w335c-mercurycombodoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toExponential(3));
const f4 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toPrecision(4));
const fx = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Math.abs(x) >= 0.01 && Math.abs(x) < 1e5 ? Number(x).toPrecision(4) : Number(x).toExponential(3));
const lt = (x, t) => (x === null || x === undefined ? '—' : Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : fx(x));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : 'null');
const sc = (q) => Math.max(Math.abs(q.apsW || 0), Math.abs(q.Lmag || 0));
const NAME = Object.freeze({ gloc: 'G_loc 受け手 n = 2', k1: 'K1 の並進(今の組)', trans: '統合した並進の並進の分(全体)', transRadial: '並進の分の動径の成分(距離の変化)', transTangent: '並進の分の面内の横(接線)の成分',
  transNormal: '並進の分の法線の成分', rot: 'R1 座標変換の回転の分', both: '統合した並進の両方', pair2obs: 'R2 旧い差分 α = 2・観測自転', pair2jEquiv: 'R2 旧い差分 α = 2・J 等価' });
const HARM = ['1', 'cos ω', 'sin ω', 'cos 2ω', 'sin 2ω'];
const nameOf = (J, k) => NAME[k] || (J.plan.comboCols.find((c) => c.key === k) || {}).label || k;
export function tablesOf(J) {
  const T = {}, G = J.geom, D = J.mercury.decomp, C = J.mercury.combos, P = J.mercury.position, M = J.mercury.mix, PS = J.pure.scenes, PG = J.pure.gates, LT = J.literature;
  // 表 1 幾何(水星 —— 本の状態の軌道)と T1 の速さの指標
  T.geom = ['| 量 | 値 |', '|---|---|',
    `| a [m]・e・周期 [s] | ${fe(G.a)}・${G.e.toPrecision(6)}・${fe(G.period)} |`,
    `| 太陽の赤道面に対する傾き i・近点引数 ω [°] | ${G.iSunDeg.toPrecision(5)}・${G.omegaSunDeg.toPrecision(5)} |`,
    `| 太陽の観測自転 s [rad/s](本)・R_d = Y_k m_☉ [m]・座標変換の重み β(a)(α = 1・ballHarmonic・Y_k m) | ${fe(G.sSun)}・${f4(G.Rd)}・${fe(G.betaA)} |`,
    `| 高さの最大 a(1 + e) sin i [m]・T1 の速さの指標の最大 s z [m/s] | ${fe(G.zMax)}・${f4(G.t1SpeedMax)} |`].join('\n');
  // 表 2 文献の値の訂正と比べる尺度(第334便c の LIT —— 第335便c の訂正の後)
  { const K = LT.correction, keys = ['merc', 'venus', 'earth', 'mars'], ja = { merc: '水星', venus: '金星', earth: '地球(EMB)', mars: '火星' };
    T.lit = ['| 惑星 | Δϖ〔″/世紀 —— 値・幅〕 | ΔΩ〔″/世紀 —— 値・幅(残差の変化 5% の区間)〕 | 比べる尺度 Δϖ・ΔΩ(値の絶対値 + 幅) |', '|---|---|---|---|']
      .concat(keys.map((k) => { const v = LT.dvarpi[k], n = LT.dnode[k]; return `| ${ja[k]} | ${fx(v[0])}・${fx(v[1])} | ${n ? fx(n[0]) + '・' + fx(n[1]) : '—'} | ${fx(Math.abs(v[0]) + v[1])}・${n ? fx(Math.abs(n[0]) + n[1]) : '—'} |`; }))
      .concat(['', '| 訂正(第335便c) | 前 | 後 |', '|---|---|---|', `| ${K.key}(出典の表 ${K.printed}・${K.conversion}) | ${fx(K.before[0])}・${fx(K.before[1])} | ${fx(K.after[0])}・${fx(K.after[1])} |`]).join('\n'); }
  // 表 3 並進の分の分解(水星 —— 一次の永年率 ″/世紀)
  { const rows = ['gloc', 'k1', 'transRadial', 'transTangent', 'transNormal', 'trans', 'rot'], t = 1e-9 * sc(D.main.trans);
    T.decomp = ['| 列 | ω_W | dL̂/dt の大きさ | 黄道の Ω_node | 黄道の ϖ | de/dt〔1/世紀〕 |', '|---|---|---|---|---|---|']
      .concat(rows.map((k) => { const q = D.main[k], u = Math.max(t, 1e-9 * sc(q)); return `| ${NAME[k]} | ${lt(q.apsW, u)} | ${lt(q.Lmag, u)} | ${lt(q.ecl.dnode, u)} | ${lt(q.ecl.dvarpi, u)} | ${lt(q.decy, 1e-12)} |`; }))
      .concat(['| R1 の動径・面内の横・法線の成分の ω_W | ' + ['radial', 'tangent', 'normal'].map((c) => lt(D.rotParts[c].apsW, 1e-9 * sc(D.main.rot))).join('・') + ' | ' + ['radial', 'tangent', 'normal'].map((c) => lt(D.rotParts[c].Lmag, 1e-9 * sc(D.main.rot))).join('・') + ' | — | — | — |',
        `| 閉じ(動径 + 横 + 法線 − 全体)÷ 尺度(並進の分・回転の分) | ${lt(D.closure.trans, 1e-9)}・${lt(D.closure.rot, 1e-9)} | — | — | — | — |`]).join('\n'); }
  // 表 4 組み合わせの読み(÷ q_1PN)—— 二重の否定対照
  T.decompCombos = [`| 組(q_1PN = ${f4(D.q1cy)}″/世紀) | ω_W | ÷ q_1PN | 否定対照 |`, '|---|---|---|---|']
    .concat(D.combos.map((c) => `| ${c.label} | ${fx(c.apsW)} | ${f4(c.overQ)} | ${c.negative ? '真(二重)' : '—'} |`)).join('\n');
  // 表 5 分解の格子(α × 自己の形 × 自己の半径 —— 並進の分の ω_W)
  T.decompGrid = ['| 自己の半径 | 自己の形 | α | 動径 | 面内の横 | 法線 | 全体 | 動径 ÷ 全体 | 全体 ÷ q_1PN | 閉じ |', '|---|---|---|---|---|---|---|---|---|---|']
    .concat(D.grid.map((q) => (q.defined ? `| ${q.radius === 'kappaM' ? 'Y_k m' : '観測の半径'} | ${q.shape} | ${q.alpha} | ${fx(q.radial)} | ${fx(q.tangent)} | ${lt(q.normal, 1e-9 * Math.abs(q.all))} | ${fx(q.all)} | ${f4(q.radialOverAll)} | ${fx(q.overQ)} | ${lt(q.closure, 1e-9)} |`
      : `| ${q.radius === 'kappaM' ? 'Y_k m' : '観測の半径'} | ${q.shape} | ${q.alpha} | 定義できない(自己の場が発散) | — | — | — | — | — | — |`))).join('\n');
  // 表 6 回転引きずり有りの組み合わせ(単独・基準に足した和・文献の尺度との比)
  T.combos = [`| 列(基準 = G_loc 受け手 n = 2 + 統合した並進の並進の分: ω_W ${fx(C.base.apsW)}・÷ q_1PN ${f4(C.base.overQ)}) | 単独: ω_W | dL̂/dt の大きさ | 黄道の Ω_node | 黄道の i | 黄道の ϖ | de/dt〔1/世紀〕 | d ln a/dt〔1/世紀〕 | 一次外挿が壊れる | 基準 + 列: ÷ q_1PN | ϖ ÷ 尺度 | Ω ÷ 尺度 | 係数の参考の比(min) |`, '|---|---|---|---|---|---|---|---|---|---|---|---|---|']
    .concat(C.cols.map((c) => { const q = c.alone, u = 1e-9 * sc(q), L0 = c.lit;
      return `| ${c.label} | ${lt(q.apsW, u)} | ${lt(q.Lmag, u)} | ${lt(q.ecl.dnode, u)} | ${lt(q.ecl.di, u)} | ${lt(q.ecl.dvarpi, u)} | ${lt(q.decy, 1e-12)} | ${lt(q.dlnAcy, 1e-12)} | ${tf(q.breaks)} | ${fx(c.withBase.overQ)} | ${lt(L0.ratio.varpi, 1e-6)} | ${lt(L0.ratio.node, 1e-6)} | ${L0.kRatio.min === null ? '—' : fe(L0.kRatio.min)} |`; })).join('\n');
  // 表 7 軌道の位置の区間(水星 —— 全周・区間の和・打ち消しの度合い・寄与の割合)
  T.position = ['| 列 | 全周の ω_W | 区間の和 − 全周 ÷ 尺度 | 打ち消しの度合い(和の絶対値 ÷ 絶対値の和) | 近日点 ±1 区間 | 遠日点 ±1 区間 | 交点 ±1 区間 | 高さの最大 ±1 区間 |', '|---|---|---|---|---|---|---|---|']
    .concat(P.mercury.map((q) => { const u = 1e-9 * Math.max(Math.abs(q.fullApsW || 0), Math.abs(q.grossApsW || 0), 1e-9 * Math.abs(D.main.trans.apsW));
      const tiny = Math.abs(q.grossApsW || 0) <= 1e-9 * Math.abs(D.main.trans.apsW);
      return `| ${nameOf(J, q.key)} | ${lt(q.fullApsW, u)} | ${lt(q.binSumDev, 1e-8)} | ${tiny ? '—(対称で 0)' : f4(q.netOverGross)} | ${tiny ? '—' : f4(q.shares.peri)} | ${tiny ? '—' : f4(q.shares.apo)} | ${tiny ? '—' : f4(q.shares.nodes)} | ${tiny ? '—' : f4(q.shares.zMax)} |`; })).join('\n');
  // 表 8 区間ごとの寄与(水星 —— 選んだ列・″/世紀)
  { const keys = ['trans', 'transRadial', 'rot', 't1phiVel', 't1radialVel', 't1phiPush'], cols = keys.map((k) => P.mercury.find((q) => q.key === k)), mk = cols[0].marks;
    const tag = (k) => [k === mk.peri ? '近日点' : '', k === mk.apo ? '遠日点' : '', k === mk.asc ? '昇交点' : '', k === mk.desc ? '降交点' : '', mk.zMax && mk.zMax.includes(k) ? '高さの最大' : ''].filter(Boolean).join('・');
    T.bins = ['| 区間 k(中心 f = 10k°) | 印 | ' + keys.map((k) => nameOf(J, k)).join(' | ') + ' |', '|' + '---|'.repeat(keys.length + 2)]
      .concat(cols[0].perBin.map((_, k) => `| ${k} | ${tag(k) || '—'} | ` + cols.map((q) => lt(q.perBin[k], 1e-9 * Math.abs(q.grossApsW || 0))).join(' | ') + ' |')).join('\n'); }
  // 表 9 型の判定(宣言 —— 走行の前)と形の当てはめ
  T.type = ['| 列 | (i) ω に依る | (ii) 傾き 0 で消え傾きとともに増える | (iii) e とともに増える | 型あり(宣言) | 当てはめの主の調和 | 調和の係数 ÷ 最大(cos ω・sin ω・cos 2ω・sin 2ω) | 平均 ÷ 最大 | A_ω(7°) ÷ A_ω(3.381°)(sin の比 2.066) | A_ω(0.4) ÷ A_ω(0.2056)・A_ω(0.1) ÷ A_ω(0.2056) | 走行の後の読み: A_ω × e の振れ ÷ 平均・面内の ė の e = 0 ÷ 水星の e |', '|---|---|---|---|---|---|---|---|---|---|---|']
    .concat(P.cols.map((c) => { const t = c.typeOf, tiny = c.belowFloor, pr = c.postRead;
      if (tiny) return `| ${nameOf(J, c.key)} | —(対称で 0) | — | — | 偽 | — | — | — | — | — | — |`;
      const flatZero = !t.omegaDependent;
      return `| ${nameOf(J, c.key)} | ${tf(t.omegaDependent)} | ${tf(t.vanishesFlatGrowsWithInc)} | ${tf(t.growsWithE)} | ${tf(t.has)} | ${flatZero ? '—(ω に依らない)' : HARM[t.fit.dominant]} | ${flatZero ? '—' : t.fit.overAmp.slice(1).map((x) => lt(x, 1e-6)).join('・')} | ${flatZero ? '—' : lt(t.fit.meanOverAmp, 1e-6)} | ${flatZero ? '—' : f4(t.scaling.incRatio)} | ${flatZero ? '—' : f4(t.scaling.eRatio04) + '・' + f4(t.scaling.eRatio01)} | ${flatZero ? '—' : f4(pr.AtimesESpread) + '・' + f4(pr.deInE0OverMerc)} |`; })).join('\n');
  // 表 10 格子の値(e = 0.2056 —— 傾き × 近点引数の ω_W ″/世紀・選んだ列)
  { const keys = ['rot', 't1phiVel', 't1tangentVel', 't1radialVel', 't1phiPush', 't1radialPush'];
    T.grid = ['| 列 | 傾き [°] | ' + J.decl.omegaGridDeg.map((o) => 'ω = ' + o + '°').join(' | ') + ' | 面内の ė の平均〔1/世紀〕 |', '|---|---|' + '---|'.repeat(J.decl.omegaGridDeg.length + 1)]
      .concat(keys.flatMap((k) => { const c = P.cols.find((q) => q.key === k); return c.grid.filter((r) => r.e === 0.2056).map((r) => `| ${nameOf(J, k)} | ${r.iDeg} | ` + r.pts.map((p) => lt(p.apsW, 1e-9 * c.scale)).join(' | ') + ` | ${lt(r.deInMean, 1e-15)} |`); })).join('\n'); }
  // 表 11 二次の結合(並進 × 相手 —— 単位の軌道)
  T.mix = [`| 相手(本物の係数 c_T = ${fe(M.cTreal)}・c_X = ${fe(M.cXreal)}) | 混合の差 M〔rad/公転 —— h/2・16 公転〕 | 刻みと窓の振れ | 分解できた(> 10 倍) | 相手の係数を倍にした比 | M ÷ (c_T c_X) | 本物の係数で〔″/世紀〕 |`, '|---|---|---|---|---|---|---|']
    .concat(M.rows.map((q) => `| ${nameOf(J, q.key)} | ${fe(q.mixRef)} | ${fe(q.numSpread)} | ${tf(q.resolved)} | ${f4(q.bilinRatio)} | ${fx(q.qMix)} | ${q.resolved ? fe(q.realArcsecCy) : '—(分解できない)'} |`)).join('\n');
  // 表 12 対照(金星・地球・火星 —— 分解と選んだ列)
  { const keys = ['rot', 'pair2jEquiv', 't1phiVel', 't1radialVel', 't1normalVel', 't1phiPush'];
    T.controls = ['| 惑星 | 太陽の赤道面に対する i [°] | q_1PN | 動径・面内の横・全体の ω_W | 二重の否定対照 ÷ q_1PN | ' + keys.map((k) => nameOf(J, k) + ': ϖ・Ω_node・係数の参考の比').join(' | ') + ' |', '|---|---|---|---|---|' + '---|'.repeat(keys.length)]
      .concat(J.controls.map((c) => { const m = c.decomp.main, dbl = c.decomp.combos.find((q) => q.key === 'double');
        return `| ${c.ja} | ${c.iSunDeg.toPrecision(4)} | ${f4(c.q1cy)} | ${fx(m.transRadial.apsW)}・${fx(m.transTangent.apsW)}・${fx(m.trans.apsW)} | ${f4(dbl.overQ)} | ` + keys.map((k) => { const q = c.combos.cols.find((x) => x.key === k), a = q.alone, u = 1e-9 * sc(a);
          return `${lt(a.ecl ? a.ecl.dvarpi : a.apsW, u)}・${a.ecl ? lt(a.ecl.dnode, u) : '—'}・${q.lit.kRatio.min === null ? '—' : fe(q.lit.kRatio.min)}`; }).join(' | ') + ' |'; })).join('\n'); }
  // 表 13 純関数の場面
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| 分解の閉じ(動径 + 横 + 法線 = 全体 —— ω_W と L̂) | ${lt(Math.max(PS.closure.apsW, PS.closure.L), 1e-12)} | ${tf(PG.closure)} |`,
    `| 並進の分の動径の成分 = −β ṙ r̂・回転の分の動径の成分 = 0 | ${lt(Math.max(PS.radial.trans, PS.radial.rot), 1e-15)} | ${tf(PG.radial)} |`,
    `| T1 の速さの指標 = 第334便a の t1Twist の s z・z の奇・傾き 0 で T1 の列が 0 | ${lt(Math.max(PS.t1.speed, PS.t1.odd), 1e-15)}・${PS.t1.zeroInc === 0 ? '0' : fe(PS.t1.zeroInc)} | ${tf(PG.t1)} |`,
    `| 向きの基底(方位 ⊥ ŝ と p・法線 ⊥ p と w・動径 ∥ p・単位) | ${lt(PS.dirs, 1e-14)} | ${tf(PG.dirs)} |`,
    `| 区間の和 = 全周(ω_W と L̂)・印(昇交点・降交点・高さの最大) | ${lt(Math.max(PS.bins.apsW, PS.bins.L), 1e-10)}・${PS.bins.marks.asc}・${PS.bins.marks.desc}・${PS.bins.marks.zMax.join('/')} | ${tf(PG.bins)} |`,
    `| 調和の当てはめが既知の係数を戻す | ${lt(PS.fit, 1e-12)} | ${tf(PG.fit)} |`,
    `| 単位の軌道の場の写し(T1 の速度の場 c (z/r) ê) | ${lt(PS.unit, 1e-14)} | ${tf(PG.unit)} |`,
    `| 入力の拒否(成分・向き・結合・列の名・r = 0・写しの名) | ${PS.rejects.filter(Boolean).length}/${PS.rejects.length} | ${tf(PG.rejects)} |`].join('\n');
  return T;
}

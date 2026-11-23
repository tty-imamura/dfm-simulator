// 第348便e(原仮定者の回答(2026-11-21 —— 第145報)「AN902: 推奨で進める。現状も近似として比較可能にする」・推奨で進める項 AN954 → AN980・統括の検証項目 R413):
// **正本 tests/out/moonwindow-348e.json から PHYSICS〔第348便e〕の表を作る文書の lib**(QA docs.moonwindow348e が節の表と逐語で照合する —— import を持たない・数は正本から)。
export const DOC_VERSION = 'w348e-moonwindowdoc-1';
const AS = 180 / Math.PI * 3600;
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f4 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Math.abs(x) < 1e-3 ? fe(x) : Number(x.toPrecision(4)).toString());
const pc = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : (100 * x < 0.01 ? '< 0.01' : (100 * x).toPrecision(3)) + '%');
const tf = (x) => (x === true ? '真' : x === false ? '偽' : 'null');
export const KIND_NAME = Object.freeze({ N: '(N) ニュートン(物差し)', 0: '(0) 現行の近似', alpha: '(α) 主の候補', beta: '(β) 比べる列' });
export const FRAME_NAME = Object.freeze({ abs: '絶対の枠', clock: '今の点の時計の枠', host: '主星の枠' });
const vname = (r) => KIND_NAME[r.kind] + (r.kind === '0' ? '' : ' —— ' + FRAME_NAME[r.frame]);
const WN = (w) => w + ' 年';

export function tablesOf(J) {
  const T = {}, L1 = J.long.find((c) => c.stepsPerMoon === J.decl.steps[1]), perYr = L1.Pearth / L1.Pmoon;
  const asYr = (r) => r * perYr * AS, W4 = J.decl.windows, WT = J.tables.window, nOf = (W) => L1.newton[L1.windows.indexOf(W)];
  const conv = (q, v, W) => (q === 'dVarpi' || q === 'dOm' ? asYr(v) : q === 'dLon' ? -v / nOf(W).lon : v);
  const X = J.exact, P = J.pure;
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| ① 因子のべきのノブ 1 の右辺が (α) の右辺と同じ(差の最大) | ${fe(X.knob1)} | ${tf(X.gates.knob1)} |`,
    `| ② 因子のべきのノブ 0・指数 2 の右辺が (0) の右辺と同じ(相対の差の最大 —— q a ÷ q の丸め) | ${P.scenes.knob0 === 0 ? '0(丸めの尺度の内)' : fe(P.scenes.knob0)} | ${tf(P.gates.knob0)} |`,
    `| ③ 長い走りの先頭の記録が〔第347便b〕の lib の同じ刻みの走りと同じ数 | ${X.prefixSame ? 'はい' : 'いいえ'} | ${tf(X.gates.prefix)} |`,
    `| ④ 読み B の当てはめ(4 列)が合成の時系列の傾きを返す(差) | ${P.scenes.rate4Err === 0 ? '0(丸めの尺度の内)' : fe(P.scenes.rate4Err)} | ${tf(P.gates.rate4)} |`,
    `| ⑤ 変異: 3 列に落とすと返さない(差) | ${fe(P.scenes.rate3Err)} | ${tf(P.gates.rate3Mut)} |`,
    `| ⑥ 入力の拒否(窓が走りより長い・ノブを (α) 以外に・年が 0) | ${P.scenes.reject.n}/${P.scenes.reject.of} | ${tf(P.gates.reject)} |`].join('\n');

  // T1 —— 型ごと・窓ごとの値(刻み 400/月・読み A)
  const t1 = (q, label, unit) => [`| ${label}(${unit}): 型 —— 枠 | ${W4.map(WN).join(' | ')} | 部分窓の散らばり(18.6 年 × 10 本) |`, '|---' + '|---'.repeat(W4.length + 1) + '|']
    .concat(J.decl.variants.map((vv) => { const rs = WT[q].filter((r) => r.kind === vv.kind && r.frame === vv.frame); const r18 = rs.find((r) => r.W === 18.6);
      return `| ${vname(vv)} | ${W4.map((W) => fe(conv(q, rs.find((r) => r.W === W).v, W))).join(' | ')} | ${fe(q === 'dLon' ? r18.bSd / Math.abs(nOf(18.6).lon) : q === 'dE' ? r18.bSd : asYr(r18.bSd))} |`; })).join('\n');
  T.t1varpi = t1('dVarpi', '月の近地点の率 −(N)', '″/年');
  T.t1node = t1('dOm', '月の交点の率 −(N)', '″/年');
  T.t1sid = t1('dLon', '恒星月の相対の差 −(N)', '正は周期が長い');
  T.t1ecc = t1('dE', '離心率の代理(窓の平均の e)−(N)', '無次元');
  T.t1newton = ['| (N) ニュートン(この器の系)| ' + W4.map(WN).join(' | ') + ' |', '|---' + '|---'.repeat(W4.length) + '|',
    '| 月の近地点の率(°/年) | ' + W4.map((W) => f4(asYr(nOf(W).varpi) / 3600)).join(' | ') + ' |',
    '| 月の交点の率(°/年) | ' + W4.map((W) => f4(asYr(nOf(W).Om) / 3600)).join(' | ') + ' |',
    '| 窓の平均の離心率 | ' + W4.map((W) => f4(nOf(W).eMean)).join(' | ') + ' |'].join('\n')
    + `\n\n(刻み ${J.decl.steps[1]}/月・1 本の ${J.decl.runYears} 年の走りの先頭からの窓。率は差の時系列の率〔読み A〕を ″/年 に直した値・年 = この系の地球の公転の周期。部分窓の散らばりは読み B の標本の標準偏差)`;

  // T1 刻みの幅(同じ窓 —— 刻み 200/月 と 400/月 の差)と、その内の記録の時刻の分
  const L0 = J.long.find((c) => c.stepsPerMoon === J.decl.steps[0]);
  const stepRow = (vv, q) => { const a = L0.rows.find((r) => r.kind === vv.kind && r.frame === vv.frame), b = L1.rows.find((r) => r.kind === vv.kind && r.frame === vv.frame);
    return W4.map((W) => { const wi = L1.windows.indexOf(W), v2 = b.A[wi][q]; return `${fe(Math.abs(b.A[wi][q] - a.A[wi][q]) / Math.abs(v2))}(${fe(Math.abs(b.Aal[wi][q] - a.A[wi][q]) / Math.abs(v2))})`; }).join(' | '); };
  T.t1step = [`| 刻みの幅 ÷ 値 —— 月の近地点(括弧は記録の時刻をそろえた分): 型 —— 枠 | ${W4.map(WN).join(' | ')} |`, '|---' + '|---'.repeat(W4.length) + '|']
    .concat(J.decl.variants.map((vv) => `| ${vname(vv)} | ${stepRow(vv, 'dVarpi')} |`)).join('\n')
    + `\n\n(|刻み ${J.decl.steps[1]}/月 − 刻み ${J.decl.steps[0]}/月| ÷ |刻み ${J.decl.steps[1]}/月の値|。括弧の中は ${J.decl.steps[1]}/月の走りの記録を 1 個おきに間引いて ${J.decl.steps[0]}/月と同じ時刻にした読みとの差 —— 刻みの誤差だけの分。括弧の外との違いは記録の間隔の違いの分)`;

  // T2 —— 窓を延ばしたときの動き ÷ 値
  const sh = (q, label) => [`| ${label}: 型 —— 枠 | 6 → 12 年(刻み ${J.decl.steps[0]}/月 ——〔第347便b〕の窓) | ` + J.tables.shrink[q][0].moves.map((m) => m.from + ' → ' + m.to + ' 年').join(' | ') + ' |', '|---|---' + '|---'.repeat(J.tables.shrink[q][0].moves.length) + '|']
    .concat(J.tables.shrink[q].map((r) => `| ${vname(r)} | ${pc(r.move612h200)} | ${r.moves.map((m) => pc(m.rel)).join(' | ')} |`)).join('\n');
  T.t2varpi = sh('dVarpi', '窓を延ばしたときの動き ÷ 値 —— 月の近地点の率');
  T.t2node = sh('dOm', '窓を延ばしたときの動き ÷ 値 —— 月の交点の率');
  T.t2note = `(値は型 −(N)の率。列の 6 → 12 年以外は刻み ${J.decl.steps[1]}/月。〔第347便b〕の「窓で約 30% 動く」は (0) −(α)の近地点の差の 6 → 12 年の動き ÷ 差 —— 下の表の差の列の動きと同じ読み)`;
  // T2 —— 差(型 − (0))そのものの、窓を延ばしたときの動き ÷ 差(〔第347便b〕の「窓で約 30% 動く」と同じ読み)
  const aRow = (c, vv) => c.rows.find((r) => r.kind === vv.kind && r.frame === vv.frame), z0 = { kind: '0', frame: 'abs' };
  const dAt = (c, vv, W, q) => { const wi = c.windows.indexOf(W); return aRow(c, vv).A[wi][q] - aRow(c, z0).A[wi][q]; };
  const AW = J.decl.allWindows, DV = [{ kind: 'alpha', frame: 'abs' }, { kind: 'alpha', frame: 'clock' }, { kind: 'beta', frame: 'abs' }, { kind: 'beta', frame: 'clock' }];
  const dsh = (q, label) => [`| ${label}: 差 —— 枠 | 6 → 12 年(刻み ${J.decl.steps[0]}/月 ——〔第347便b〕の窓) | ` + AW.slice(1).map((W, i) => AW[i] + ' → ' + W + ' 年').join(' | ') + ' |', '|---|---' + '|---'.repeat(AW.length - 1) + '|']
    .concat(DV.map((vv) => `| ${KIND_NAME[vv.kind]} − (0) —— ${FRAME_NAME[vv.frame]} | ${pc(Math.abs(dAt(L0, vv, 12, q) - dAt(L0, vv, 6, q)) / Math.abs(dAt(L0, vv, 12, q)))} | ${AW.slice(1).map((W, i) => pc(Math.abs(dAt(L1, vv, W, q) - dAt(L1, vv, AW[i], q)) / Math.abs(dAt(L1, vv, W, q)))).join(' | ')} |`)).join('\n');
  T.t2dshVarpi = dsh('dVarpi', '差の窓の動き ÷ 差 —— 月の近地点');
  T.t2dshNode = dsh('dOm', '差の窓の動き ÷ 差 —— 月の交点');
  // T2 —— 差 ÷ 幅
  const df = (q, label) => [`| ${label}: 差 —— 枠 | 窓 | 差(″/年) | 幅(″/年) | 差 ÷ 幅 | 差 ÷ (0) の値 | 読み B の差(″/年) |`, '|---|---|---|---|---|---|---|']
    .concat(WT[q].filter((r) => r.kind !== '0' && r.frame !== 'host').map((r) => `| ${KIND_NAME[r.kind]} − (0) —— ${FRAME_NAME[r.frame]} | ${WN(r.W)} | ${fe(asYr(r.diff))} | ${fe(asYr(r.diffWidth))} | ${f4(r.diffOverWidth)} | ${f4(r.diffRel0)} | ${fe(asYr(r.diffB))} |`)).join('\n');
  T.t2diffVarpi = df('dVarpi', '月の近地点');
  T.t2diffNode = df('dOm', '月の交点');
  T.t2diffNote = '(差 = 型 − (0)(同じ刻み 400/月・同じ窓 —— ニュートンの走りは打ち消す)。幅 = max(刻み 200/月 と 400/月 の差の差, 一つ前の窓との差の差)。読み B の差は部分窓の率の平均の差)';

  // T3 —— 月の本の表
  const bk = J.tables.book, col = (k) => bk.cols.find((c) => c.col === k), C0 = col('0:abs'), CN = col('N'), CA = col('alpha:clock'), CB = col('beta:clock'), CAa = col('alpha:abs'), CBa = col('beta:abs'), O = J.obs.rows;
  const p8 = (x) => (Number.isFinite(x) ? x.toFixed(8) : '—'), p6 = (x) => (Number.isFinite(x) ? x.toFixed(6) : '—');
  T.t3 = ['| 量 | 固定の比べる列(リポジトリの候補の行・文献の値・未照合) | (N) この器 | (0) 現行の近似 | (α) 主の候補 —— 今の点の時計の枠 | (β) 比べる列 —— 今の点の時計の枠 | (α) − (0)(秒) | (β) − (0)(秒) | (0) − 固定の列 | σ 倍 |', '|---|---|---|---|---|---|---|---|---|---|',
    `| 恒星月(日) | ${O[0].value}(${O[0].record}) | ${p8(CN.siderealDays)} | ${p8(C0.siderealDays)} | ${p8(CA.siderealDays)} | ${p8(CB.siderealDays)} | ${fe(CA.vs0SidS)} | ${fe(CB.vs0SidS)} | ${f4(C0.obsSid)} 日 | —(σ の欄は空) |`,
    `| 月の近点回転の周期(ユリウス年) | ${O[1].value}(${O[1].record}) | ${p6(CN.perigeeYr)} | ${p6(C0.perigeeYr)} | ${p6(CA.perigeeYr)} | ${p6(CB.perigeeYr)} | ${fe(CA.vs0PerS)} | ${fe(CB.vs0PerS)} | ${f4(C0.obsPer)} 年 | —(σ の欄は空) |`,
    `| 月の交点の周期(ユリウス年) | ${O[2].value}(${O[2].record}) | ${p6(CN.nodeYr)} | ${p6(C0.nodeYr)} | ${p6(CA.nodeYr)} | ${p6(CB.nodeYr)} | ${fe(CA.vs0NodS)} | ${fe(CB.vs0NodS)} | ${f4(C0.obsNod)} 年 | —(σ の欄は空) |`,
    `| 窓の平均の離心率 | —(固定の列に置かない) | ${p6(CN.eMean)} | ${p6(C0.eMean)} | ${p6(CA.eMean)} | ${p6(CB.eMean)} | — | — | — | — |`].join('\n')
    + `\n\n(窓 ${bk.window} 年・刻み ${bk.steps}/月の読み A。周期 = 2π ÷(ニュートンの率 + 型 −(N)の率)を、この系の時間の単位 √(天文単位³ ÷ GM_sun)= ${bk.tuS.toPrecision(7)} 秒で日とユリウス年に直した値。絶対の枠の列: (α) − (0) は恒星月 ${fe(CAa.vs0SidS)} 秒・近点 ${fe(CAa.vs0PerS)} 秒・交点 ${fe(CAa.vs0NodS)} 秒/(β) − (0) は ${fe(CBa.vs0SidS)}・${fe(CBa.vs0PerS)}・${fe(CBa.vs0NodS)} 秒。固定の比べる列は σ の欄が空の候補の行なので σ 倍は置かない)`;

  // T4 —— 枠の依り方
  const fr = (q, label) => [`| ${label}: 型 —— 枠 | ${W4.map(WN).join(' | ')} |`, '|---' + '|---'.repeat(W4.length) + '|']
    .concat(['alpha', 'beta'].flatMap((k) => ['clock', 'host'].map((f) => `| ${KIND_NAME[k]} —— ${FRAME_NAME[f]} | ${W4.map((W) => { const r = J.tables.frames[q].find((x) => x.kind === k && x.frame === f && x.W === W); return `${fe(asYr(r.frameMinusAbs))}(÷ 幅 ${f4(r.overWidth)})`; }).join(' | ')} |`))).join('\n');
  T.t4varpi = fr('dVarpi', '(型 − (0))の枠 −(同じ型の絶対の枠)—— 月の近地点(″/年)');
  T.t4node = fr('dOm', '(型 − (0))の枠 −(同じ型の絶対の枠)—— 月の交点(″/年)');

  // T5 —— 零試験・照合・変異
  const cr = J.cross, o = J.short.order, mu = J.mutants;
  T.t5 = ['| 照合・零試験・変異 | 値 | 門 |', '|---|---|---|',
    `| 〔第347便b〕の正本の実の比の行(窓 6 年・刻み 200/月 —— 短い部分の作り直し)との相対の差の最大(${cr.h200w6.n} 葉) | ${fe(cr.h200w6.worst)} | ${tf(J.gates.cross347b6)} |`,
    `| 同(窓 12 年・刻み 200/月 —— 長い走りの先頭) | ${fe(cr.h200w12.worst)} | ${tf(J.gates.cross347b12)} |`,
    `| 同(窓 6 年・刻み 400/月 —— 長い走りの先頭) | ${fe(cr.h400w6.worst)} | ${tf(J.gates.cross347b6h400)} |`,
    `| 長い走りの窓 6 年の行と短い部分の行(同じ刻み)の相対の差の最大 | ${fe(cr.shortVsLong.worst)} | ${tf(J.gates.shortVsLong)} |`,
    `| (α) の因子のべき 0・指数 2 の走り(窓 ${J.knob.zero.years} 年)と (0) の走りの率の相対の差の最大 | ${fe(J.knob.zero.maxRel)} | ${tf(J.gates.knobZero)} |`,
    `| 刻みの次数: 刻み ${J.decl.order.steps.join('・')}/月(${J.decl.order.years} 年・記録の時刻をそろえる)のニュートンの近地点の率の差の比・交点の率の差の比 | ${f4(o.ratioNVarpi)}・${f4(o.ratioNOm)} | ${tf(J.gates.order)} |`,
    `| 同 (0) −(N)・(α) −(N)の近地点の率の差(刻み 50 → 100・100 → 200) | ${fe(Math.abs(o.rows[0].d0Varpi - o.rows[1].d0Varpi))} → ${fe(Math.abs(o.rows[1].d0Varpi - o.rows[2].d0Varpi))}・${fe(Math.abs(o.rows[0].dAVarpi - o.rows[1].dAVarpi))} → ${fe(Math.abs(o.rows[1].dAVarpi - o.rows[2].dAVarpi))} | ${tf(J.gates.order)} |`,
    `| 変異: 窓の記録を 1 個ずらす(〔第347便b〕の行との相対の差) | ${fe(mu.prefix)} | ${tf(J.gates.mutants)} |`,
    `| 変異: 記録の時刻をそろえずに刻みの次数を読む(比) | ${f4(mu.unaligned)} | ${tf(J.gates.mutants)} |`,
    `| 変異: (α) の因子のべき 0.5・指数 2(と (0) の相対の差) | ${fe(mu.knobHalf)} | ${tf(J.gates.mutants)} |`,
    `| 変異: 読み B の当てはめを 3 列に(合成の傾きとの差) | ${fe(mu.rate3)} | ${tf(J.gates.mutants)} |`].join('\n');
  return T;
}

// 第337便d(原仮定者の指示(2026-11-14 —— 第138報)・統括の検証項目 R340): **正本 tests/out/accelloss-337d.json から PHYSICS〔第337便d〕の表を作る文書の lib**
// (QA docs.accelloss337d が節の表と逐語で照合する —— 表の数は有効数字 3 桁の指数・丸めの程度の数〔恒等式の残差〕は「< 1e-x」の形で書き、数そのものは載せない)。
export const DOC_VERSION = 'w337d-accellossdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toExponential(2));
const lt = (x, t) => (Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : '**' + fe(x) + '**');
const wd = (x) => (Number.isFinite(x) && Math.abs(x) < 1e-20 ? '< 1e-20' : fe(x));   // 対称で 0 の列の求積の丸め(1e-20 ″/年 未満)は数を載せない
const tf = (x) => (x === true ? '真' : x === false ? '偽' : 'null');
const SYS = Object.freeze({ fixed: '固定に近い源(m₁/m₂ = 1e-6・受け手だけ)', moveRecv: '動く源(m₁ = m₂・受け手だけ)', moveBoth: '動く源(m₁ = m₂・両方)', spinRecv: '自転する源(s₂ = 0.5 n・受け手だけ)' });
const NAME = Object.freeze({ mercury: '水星', earth: '地球', moon: '月', b1913: 'PSR B1913+16', j0737: 'PSR J0737−3039' });
const RD = Object.freeze({ 'recv|off': '受け手だけ・自転なし', 'both|off': '両方・自転なし', 'recv|on': '受け手だけ・自転あり', 'both|on': '両方・自転あり' });
const BK = Object.freeze({ adotRel: '|ȧ/a| [1/年]', adotAbs: '|ȧ| [m/年]', pbdotAbs: '|Ṗ_b| [s/s]' });
export const COL_ORDER = Object.freeze(['L1', 'L2', 'S0', 'S0a', 'S0d', 'S1', 'S2']);

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, st = J.plan.t1.steps;
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| ① ノブ 0 で損失 0(列 7 × 源の自転 あり/なし × 受け手だけ/両方 —— ȧ・ė・Q・W_f の最大) | ${lt(S.zero, 0)} | ${tf(G.zero)} |`,
    `| ② 型 2・3 の 5 列は円で 0(自転 あり/なし × 受け手だけ/両方)・型 1 は円でも落ちる(L1 η = 1e-3 の ȧ —— 期待 −2e-3) | ${lt(S.asymCircle, 1e-15)}・${fe(S.linCircle)} | ${tf(G.asymCircle)} |`,
    `| ③ 閉じた式 ÷ 求積 − 1(列 7 × 受け手だけ/両方・e 0.3・8192 点 —— ȧ・ΔE・ė) | ${lt(S.closed, 1e-6)} | ${tf(G.closed)} |`,
    `| ④ 帳簿(点ごとの F·v + Q̇ − F·U_ext・自転あり・両方・列 7) | ${lt(S.ledger, 1e-12)} | ${tf(G.ledger)} |`,
    `| ⑤ U_ext: 源 1 つで C_{j→i}・自転を外すと v_j・等しい重みの源 2 つで平均 | ${lt(S.uext, 1e-12)} | ${tf(G.uext)} |`,
    `| ⑥ 相互にロックした円の連星(s₁ = s₂ = n)の u と損失(列 7) | ${lt(S.lockedU, 1e-12)}・${lt(S.locked, 1e-15)} | ${tf(G.locked)} |`,
    `| ⑦ 加速だけ + 減速だけ = 両方(ȧ)・ϖ̇(加速だけ・減速だけ・両方 —— ε = 1e-3・n = 1) | ${lt(S.split.sum, 1e-9)}・${fe(S.split.wA)}・${fe(S.split.wD)}・${lt(S.split.wB, 1e-12)} | ${tf(G.split)} |`,
    `| ⑧ 入力の拒否 | ${S.reject.n}/${S.reject.of} | ${tf(G.reject)} |`].join('\n');
  const rel = (x, y) => (Number.isFinite(x) && Number.isFinite(y) && y !== 0 ? x / y - 1 : null);
  const t1row = (r) => {
    const q = r.quad, c = r.closed, n1 = r.num[st[0]], n2 = r.num[st[1]], nz = Math.abs(q.adot) > 1e-15;
    const cr = c && nz ? fe(rel(c.adot, q.adot)) : c ? '0 と 0' : '閉じた式なし';
    const nr = nz ? `${fe(rel(n1.adot, q.adot))}・${fe(rel(n2.adot, q.adot))}` : `${lt(n1.adot, 1e-12)}・${lt(n2.adot, 1e-12)}`;
    const led = nz ? fe(Math.max(n1.ledgerRel, n2.ledgerRel)) : '熱 ' + lt(Math.max(Math.abs(n1.Qorb), Math.abs(n2.Qorb)) / r.eBind, 1e-12) + '(÷ 束縛の E)';
    return `| ${r.e} | ${r.col} | ${fe(r.knob)} | ${nz ? fe(q.adot) : lt(q.adot, 1e-15)} | ${cr} | ${nr} | ${fe(q.edot)} | ${c && c.edot !== null ? fe(c.edot) : '—'} | ${q.wdot === null ? '—' : fe(q.wdot)} | ${fe(q.Qorb)} | ${led} |`;
  };
  T.t1 = [`| e | 列 | ノブ | ȧ(求積) | 閉じた式 ÷ 求積 − 1 | 数値 ÷ 求積 − 1(${st[0]}・${st[1]} 步/周) | ė(求積) | ė(閉じた式) | ϖ̇(求積) | 1 周の熱 Q | 帳簿の残り(数値) |`, '|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.t1.filter((r) => r.sys === 'fixed').map(t1row)].join('\n');
  T.t1other = [`| 系(e 0.3) | 列 | ȧ(求積) | 閉じた式 ÷ 求積 − 1 | 数値 ÷ 求積 − 1(${st[1]} 步/周) | ė(求積) | ϖ̇(求積) | 1 周の熱 Q | 1 周の場の口 W_f |`, '|---|---|---|---|---|---|---|---|---|',
    ...J.t1.filter((r) => r.sys !== 'fixed').map((r) => `| ${SYS[r.sys]} | ${r.col} | ${fe(r.quad.adot)} | ${r.closed ? fe(rel(r.closed.adot, r.quad.adot)) : '閉じた式なし'} | ${fe(rel(r.num[st[1]].adot, r.quad.adot))} | ${fe(r.quad.edot)} | ${r.quad.wdot === null ? '—' : fe(r.quad.wdot)} | ${fe(r.quad.Qorb)} | ${fe(r.quad.Wforb)} |`)].join('\n');
  T.t2 = ['| 走行 | 列・ノブ | 止まり・周 | a/a₀ | e(始め → 終わり) | |u₁|(始め → 終わり) | 熱 ÷ 始めの束縛の E | 場の口 W_f | 帳簿の残り |', '|---|---|---|---|---|---|---|---|---|',
    ...J.t2.runs.map((r) => `| ${r.note} | ${r.col}・${fe(r.knob)} | ${r.stop}・${r.orbits} | ${fe(r.aRatio)} | ${r.first.e.toFixed(3)} → ${fe(r.last.e)} | ${fe(r.first.u1)} → ${fe(r.last.u1)} | ${fe(r.heatOverE0)} | ${fe(r.last.Wf)} | ${r.heatOverE0 > 1e-9 ? fe(r.ledgerRel) : '熱 ' + lt(r.heatOverE0, 1e-9)} |`)].join('\n');
  const ck = J.t2.s0Check;
  T.s0track = ['| e | a/a₀(閉じた式の道 —— e₀ = 0.6) | d ln a/d ln e |', '|---|---|---|', ...J.t2.s0Track.map((x) => `| ${x.e} | ${fe(x.aOverA0)} | ${x.slopeLog.toFixed(3)} |`),
    `| 数値(S0・e₀ 0.6 —— 標本 ${ck.n} 点)の a ÷ 道の a − 1 の最大 | ${fe(ck.maxAbsRel)} | 終わり e ${ck.last.e.toFixed(4)}・a ${fe(ck.last.aNum)} |`].join('\n');
  T.t3 = ['| 系 | 読み | |u|/c(最大・最小) | 観測の目安 | ' + COL_ORDER.map((c) => c + ' の上限').join(' | ') + ' |', '|---|---|---|---|' + COL_ORDER.map(() => '---|').join(''),
    ...J.t3.map((r) => `| ${NAME[r.key]}${r.main ? '(主)' : ''} | ${RD[r.reading]} | ${fe(r.uOverC.max)}・${fe(r.uOverC.min)}${r.superluminalU ? '(|U_ext| > c)' : ''} | ${BK[r.bound.kind]} ${fe(r.bound.value)} | `
      + COL_ORDER.map((c) => fe(r.cols[c].kMax) + (r.cols[c].adotPerKnob > 0 ? '(ȧ > 0)' : '')).join(' | ') + ' |')].join('\n');
  T.joint = ['| 列 | 合わせた上限(主の読みの最小) | 決める系 | 広がり(最大 ÷ 最小) | いちばん緩い系 | 合わせた上限での率 ÷ 目安(水星・地球・月・B1913・J0737) |', '|---|---|---|---|---|---|',
    ...COL_ORDER.map((c) => { const j = J.joint[c]; return `| ${c} | ${fe(j.joint)} | ${NAME[j.binding]} | ${fe(j.spread)} | ${NAME[j.loosest]} | ${j.fractions.map((f) => fe(f.frac)).join('・')} |`; })].join('\n');
  // T4: 合わせた上限のノブ(列ごとに 1 つ)での主の読みの熱の仕事率と場の口
  const mains = J.t3.filter((r) => r.main);
  T.t4 = ['| 列 | 系 | Q̇ [W](合わせた上限) | 場の口 [W] | Q̇ × 1 年 ÷ 束縛の E | ϖ̇ [″/年] | 単位のノブの Q̇ [W] |', '|---|---|---|---|---|---|---|',
    ...COL_ORDER.flatMap((c) => mains.map((r) => { const k = J.joint[c].joint, q = r.cols[c], qd = q.QdotPerKnob * k;
      return `| ${c} | ${NAME[r.key]} | ${fe(qd)} | ${fe(q.WfPerKnob * k)} | ${fe(qd * J.decl.yearS / r.eBind)} | ${q.wdotPerKnob === null ? '—' : wd(q.wdotPerKnob * k * J.decl.yearS * 180 * 3600 / Math.PI)} | ${fe(q.QdotPerKnob)} |`; }))].join('\n');
  const t5 = J.t5.res, r5 = (k, c) => { const z = t5[k][c]; return `| ${k === 'on' ? '自転あり' : '自転なし'} | ${c} | ${fe(t5[k].uEarth.min)}〜${fe(t5[k].uEarth.max)} | ${fe(t5[k].uMoon.min)}〜${fe(t5[k].uMoon.max)} | ${fe(z.heatEarth)} | ${fe(z.heatMoon)} | ${fe(z.daMoonBoth)} | ${fe(z.daMoonRecv)} | ${fe(z.daTwoBody)} | ${fe(z.daMoonBoth / z.daTwoBody)} |`; };
  T.t5 = ['| 太陽と地球の自転 | 列(単位のノブ) | |u_地球| [m/s] | |u_月| [m/s] | 1 年の熱 地球 [J] | 1 年の熱 月 [J] | 1 年の Δa_月(3 体・両方)[m] | 同(月だけ) | 同(二体・地球だけの源・受け手だけ) | 3 体 ÷ 二体 |', '|---|---|---|---|---|---|---|---|---|---|',
    r5('off', 'L1'), r5('off', 'S0'), r5('on', 'L1'), r5('on', 'S0')].join('\n');
  return T;
}

// 第331便b(原仮定者の追記(2026-11-09)・原仮定者の決断(2026-11-09 —— AN593)・統括の検証項目 R311): **正本 tests/out/centrifugal-w331b.json から PHYSICS〔第331便b〕の表を作る文書の lib**
// (QA docs.centrifugal331b が節の表と逐語で照合する —— 表の数は有効数字 4 桁か指数 3 桁・丸めの程度の数〔解き方の差・式の残差〕は「< 1e-10」の形で書き、数そのものは載せない)。
export const DOC_VERSION = 'w331b-centrifugaldoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toExponential(3));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toPrecision(4));
const lt = (x, t) => (Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : '**' + fe(x) + '**');
const tf = (x) => (x === true ? '真' : x === false ? '偽' : 'null');
const kms = (v) => f3(v / 1e3);   // m/s → km s⁻¹ の数(単位は見出しに)
export const SIDE_LABEL = Object.freeze({
  main: '主(受け手の枠・自己 ballMean・f 0.9・間隔 1 kpc・方位 24・背景 0・源 sync・中心 frame・軸 rigid・境界なし・fixture の面密度)', spinNone: '源の回転の型 none(並進だけ)',
  centerMoment: '中心の型 moment(第330便b の源の中の速度の重みつきの平均)', axesFixed: '軸の型 fixed(Ω ≈ √(g/R) + Ω_f/2 の型)', axesHalfCurl: '軸の型 halfCurl(ω_f = Ω_f + ½R dΩ_f/dR —— 環の格子の差分・不動点の反復)', spinNoneHalfCurl: '源 none・軸の型 halfCurl', boundary: '境界(45 kpc・背景に静止・円盤と同じ質量)',
  expDisk: '指数円盤(SBdisk の当てはめ)', kappaM: '自己の半径 = K1 の規則 R_d = Y_k m(点の質量から)', noCenterField: '中心なし・場の枠・背景 0(錨 0)', noCenterReceiver: '中心なし・受け手の枠・背景 0',
  fieldBg0: '場の枠・背景 0', fieldBg1: '場の枠・背景 = 3H₀c/(2G)', mainBg1: '主・背景 = 3H₀c/(2G)',
});
const AXIS_LABEL = Object.freeze({ spin: '源の回転の型', reading: '枠の読み', selfType: '自己の重みの型(受け手の枠)', f: '自己の半径の比 f', disc: '離散化(間隔 kpc|方位)', bgMul: '背景の重みの倍率(× 3H₀c/(2G))' });
const near = (rows, R) => rows.reduce((b, q) => (b === null || Math.abs(q.R - R) < Math.abs(b.R - R) ? q : b), null);
export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, Q = J.required, Dk = J.disk, So = J.solar, Rg = J.rings;
  // 表 1 純関数の場面(回る枠の中の円軌道の釣り合い・枠の 2 つの読み・否定対照・小さな円盤の固定点)
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| Ω_f = 0 の円軌道(rigid・halfCurl・fixed)の Ω ÷ √(g/R)・v ÷ √(gR) | ${S.newton.Om.map((x) => f3(x / S.newton.OmK)).join('・')}・${f3(S.newton.v / S.newton.vK)} | ${tf(G.newtonAtZeroFrame)} |`,
    `| 枠と共に回る(g = 0・Ω_f = 4e-16): Ω ÷ Ω_f・要求 R(Ω − Ω_f)²・x = 1 の弱める割合 | ${f3(S.coRotate.Om / S.coRotate.of)}・${S.coRotate.demand}・${S.coRotate.red} | ${tf(G.coRotateZeroDemand)} |`,
    `| 剛体の枠の一次の読み v = √(gR) + Ω_f R(厳密)・fixed の (Ω − Ω_K − Ω_f/2)/Ω_f(Ω_f = 1e-3 Ω_K) | ${f3(S.firstOrder.rigidV / S.firstOrder.rigidRef)}・${fe(S.firstOrder.fixedDev)} | ${tf(G.rigidFirstOrder)} |`,
    `| 逆向きの枠(Ω_f = −0.3 Ω_K): Ω ÷ Ω_K・Ω − Ω_f の ÷ Ω_K・弱める割合・Ω_f について奇・Ω_f = −3 Ω_K の Ω ÷ Ω_K | ${f3(S.sign.counter / S.sign.OmK)}・${f3(S.sign.relCounter / S.sign.OmK)}・${f3(S.sign.redCounter)}・${lt(S.sign.odd / S.sign.OmK, 1e-12)}・${f3(S.sign.deep / S.sign.OmK)} | ${tf(G.signCounterFrame)} |`,
    `| 恒等式(rigid・halfCurl・fixed): 解の R(Ω − Ω_f)(Ω − ω_f) − g・剛体の部 + ずれの部 − 要求・要求 + 流れの項 + 軸の項 − Ω²R(相対) | ${S.identity.map((q) => q.axes + ' ' + lt(q.eq, 1e-12) + '・' + lt(q.split, 1e-12) + '・' + lt(q.total, 1e-12)).join(' / ')} | ${tf(G.balanceIdentity)} |`,
    `| 単位: (λg, λR) の Ω の相対の差・要る枠を m/s と m で作るのと km s⁻¹ と kpc で作って rad/s へ直すのとの相対の差 | ${lt(S.units.scale, 1e-12)}・${lt(S.units.kpc, 1e-12)} | ${tf(G.unitsInvariant)} |`,
    `| 逆算(v_obs = 1.5e5・v_bar = 1.1e5 m/s): 要る枠 rigid・fixed [rad/s] と前向きの式で v_obs へ戻る相対の差 | ${fe(S.inverse.rigid)}・${fe(S.inverse.fixed)}・${S.inverse.back.map((x) => lt(x, 1e-12)).join('・')} | ${tf(G.inverseRoundTrip)} |`,
    `| halfCurl: Ω_f ∝ R^−1.3 の ω_f ÷ Ω_f(1 + s/2) の相対の差(解析)・数値の微分の相対の差・局所のべき・一様の Ω_f のずれの部 | ${lt(S.halfCurl.powerRel, 1e-12)}・${fe(S.halfCurl.midRel)}・${f3(S.halfCurl.midSlope)}・${S.halfCurl.uniformShear} | ${tf(G.halfCurlShear)} |`,
    `| 枠の 2 つの読み(源 1 つ・重み 3・Ω_src 2e-6): 場の枠・受け手の枠(自己 1)・場の枠 + 背景 1・Ω_src を 2 倍の比・逆向きの同じ重みの和・受け手の自己の分 | ${fe(S.readings.field)}・${fe(S.readings.receiver)}・${fe(S.readings.fieldBg)}・${f3(S.readings.lin)}・${S.readings.opp}・${f3(S.readings.shares.self)} | ${tf(G.frameReadings)} |`,
    `| 否定対照: 自己の項を分子にも入れると Ω ÷ Ω_K(α = 0.99・α = 1 − 1e-6) | ${f3(S.selfNum.r99)}・${fe(S.selfNum.r6)} | ${tf(G.selfInNumeratorDiverges)} |`,
    `| 入力の拒否(g < 0・R = 0・非有限・知らない軸の型・halfCurl の微分なし・知らない読み・受け手の自己なし・負の重み・負の背景・v_obs = 0・halfCurl の逆算・α = 1・p = 1 の円盤・自己の宣言の無い受け手の円盤) | ${S.reject.filter(Boolean).length}/${S.reject.length} | ${tf(G.rejectInputs)} |`,
    `| 小さな円盤(6 環・方位 12・中心だけが錨・sync・場の枠・背景 0・Ω_K = 0): 全部が Ω_c で剛体に共に回る(相対の差)・Ω_K を入れた直接法と反復の差・式の残差 / 錨 0 は退化(反復 200 回で Ω の増え方)/ 背景 1e12 の (Ω − Ω_K)/Ω_K の最大 | ${lt(S.miniDisk.rigidCo, 1e-10)}・${lt(S.miniDisk.dvi, 1e-10)}・${lt(S.miniDisk.res, 1e-12)} / ${tf(S.miniDisk.degenerate)}(${f3(S.miniDisk.growth)} 倍)/ ${lt(S.miniDisk.bigBg, 1e-6)} | ${tf(G.miniDiskFixedPoint)} |`,
    `| 背景の重みの宣言の型 3H₀c/(2G)(H₀ = 67.4 km s⁻¹ Mpc⁻¹)[kg/m²] と 4πρ_c c/H₀ との相対の差 | ${f3(S.cosmic.w)}・${lt(S.cosmic.alt, 1e-12)} | ${tf(G.cosmicBackground)} |`,
    `| 弱める割合(x = 0.1: rigid 2x − x²・fixed x)・一次の目安(Ω_f = 2e-14・n = 8e-7: 近点の率 rigid・fixed と周期の比のずれ) | ${f3(S.reduce.rigid)}・${f3(S.reduce.fixed)}・${fe(S.reduce.gr.periRate)}・${fe(S.reduce.gf.periRate)}・${fe(S.reduce.gr.periodShift)}・${fe(S.reduce.gf.periodShift)} | ${tf(G.reductionAndGuide)} |`].join('\n');
  // 表 2 NGC 3198 の要る枠の回転(fixture の行 —— km s⁻¹ kpc⁻¹)
  {
    const ok = Q.rows.filter((q) => q.why === null), pick = J.plan.pickKpc.map((R) => near(ok, R)).filter((q, i, a) => a.indexOf(q) === i);
    T.required = ['| R [kpc] | v_obs [km s⁻¹] | v_bar [km s⁻¹] | Ω_obs = v_obs/R | Ω_bar = v_bar/R | Ω_f,req rigid | Ω_f,req fixed | Ω_f,req rigid ÷ Ω_obs | halfCurl のずれの部 ÷ g(rigid の要る形) |', '|---|---|---|---|---|---|---|---|---|']
      .concat(pick.map((q) => `| ${f3(q.R)} | ${f3(q.vObs)} | ${f3(q.vBar)} | ${f3(q.OmegaObs)} | ${f3(q.OmegaBar)} | ${f3(q.reqRigid)} | ${f3(q.reqFixed)} | ${f3(q.ratioRigid)} | ${f3(q.shear.shearOverG)} |`))
      .concat([`| 外側(R ≥ ${J.plan.outerFromKpc} kpc・${Q.outer.n} 行)の範囲 | — | — | — | — | — | — | ${f3(Q.outer.ratioRigidRange[0])}〜${f3(Q.outer.ratioRigidRange[1])} | ${f3(Q.outer.shearOverGRange[0])}〜${f3(Q.outer.shearOverGRange[1])} |`]).join('\n');
  }
  // 表 3 横の列(主の宣言から 1 つずつ変える)
  T.side = ['| 列 | 錨の分(最小〜最大) | 反復(止まった・回数)と直接法との差 | 外側のべき | 残差 rms(全部・外側) | Ω_f/Ω_f,req の中央値(外側) | v(8 kpc)・v(30 kpc)[km s⁻¹] | v/v_obs の最大 |', '|---|---|---|---|---|---|---|---|']
    .concat(Object.entries(Dk.side).map(([k, q]) => {
      if (!q.ok) return `| ${SIDE_LABEL[k]} | ${f3(q.anchor.min)}〜${f3(q.anchor.max)} | 退化 —— ${q.why} | — | — | — | — | — |`;
      const p8 = q.picks.find((p) => p.R === 8), p30 = q.picks.find((p) => p.R === 30), sv = q.solve;
      return `| ${SIDE_LABEL[k]} | ${f3(q.anchor.min)}〜${f3(q.anchor.max)} | ${tf(sv.converged)}・${sv.iters}・${sv.directVsIterRel === null ? '(不動点の反復)' : lt(sv.directVsIterRel, 1e-10)} | ${f3(q.slope.outer)} | ${f3(q.resAll.rms)}・${f3(q.resOuter.rms)} | ${f3(q.ratioOuterMedian)} | ${kms(p8.v)}・${kms(p30.v)} | ${f3(q.vOverVobsMax)} |`;
    })).concat([`| 無引きずりの対照(Ω_f = 0 → v = v_bar —— 同じ重力・同じ単位・同じ環) | — | — | ${f3(Dk.side.main.slope.vbarOuter)} | ${f3(Dk.control.resAll.rms)}・${f3(Dk.control.resOuter.rms)} | 0 | ${kms(Dk.side.main.picks.find((p) => p.R === 8).vBar)}・${kms(Dk.side.main.picks.find((p) => p.R === 30).vBar)} | — |`,
      `| 参照: v_obs | — | — | ${f3(Dk.side.main.slope.vobsOuter)} | 0・0 | 1 | ${kms(Dk.side.main.picks.find((p) => p.R === 8).vObs)}・${kms(Dk.side.main.picks.find((p) => p.R === 30).vObs)} | 1 |`]).join('\n');
  // 表 4 AN593 B の格子の軸ごとの範囲
  T.axes = ['| 宣言の軸 | 値 | 列の数 | 外側の残差 rms の範囲 | 外側のべきの範囲 | v/v_obs の最大の範囲 |', '|---|---|---|---|---|---|']
    .concat(Object.entries(Dk.byAxis).flatMap(([ax, m]) => Object.entries(m).map(([k, q]) => `| ${AXIS_LABEL[ax]} | ${k} | ${q.n} | ${f3(q.resOuterRms[0])}〜${f3(q.resOuterRms[1])} | ${f3(q.slopeOuter[0])}〜${f3(q.slopeOuter[1])} | ${f3(q.vOverVobsMax[0])}〜${f3(q.vOverVobsMax[1])} |`)))
    .concat([`| 全部 | — | ${Dk.n}(退化 ${Dk.nDegenerate}・反復の止まらない列 ${Dk.nNotConverged}・平坦の判定 |べき| ≤ 0.1 の列 ${Dk.nFlat}) | ${f3(Dk.resOuterRange[0])}〜${f3(Dk.resOuterRange[1])} | ${f3(Dk.slopeRange[0])}〜${f3(Dk.slopeRange[1])} | — |`]).join('\n');
  // 表 5・6 AN593 B の 2 次元の表(自己の重みの型 × f の行・離散化の列 —— 背景 0・受け手の枠 / 最後の行は場の枠)—— 外側の残差 rms・外側のべき
  for (const sp of J.plan.gridSpins) {
    const cell = (q) => (q && q.ok ? `${f3(q.resOuter.rms)}・${f3(q.slope.outer)}` : '—');
    const at = (t, f, dR, K, rd) => Dk.grid.find((q) => q.decl.sourceSpin === sp && q.decl.reading === rd && (rd === 'field' || (q.decl.selfType === t && q.decl.f === f)) && q.decl.dR === dR && q.decl.K === K && q.decl.bgMul === 0);
    const head = '| 自己の重みの型・f | ' + J.plan.gridDisc.map(([dR, K]) => `間隔 ${dR} kpc・方位 ${K}`).join(' | ') + ' |';
    T['grid_' + sp] = [head, '|---|' + J.plan.gridDisc.map(() => '---|').join('')]
      .concat(J.plan.gridSelfTypes.flatMap((t) => J.plan.gridF.map((f) => `| ${t}・f ${f} | ` + J.plan.gridDisc.map(([dR, K]) => cell(at(t, f, dR, K, 'receiver'))).join(' | ') + ' |')))
      .concat(['| 場の枠(自己なし) | ' + J.plan.gridDisc.map(([dR, K]) => cell(at(null, null, dR, K, 'field'))).join(' | ') + ' |']).join('\n');
  }
  // 表 7 背景の重み × 源の回転の型(主の受け手の枠と場の枠 —— 間隔 1 kpc・方位 24)
  T.background = ['| 背景の重み(× 3H₀c/(2G)) | 源 | 受け手の枠(ballMean・f 0.9): 外側の残差 rms・外側のべき・v(8 kpc)・v(30 kpc)[km s⁻¹]・Ω_f/Ω_f,req の中央値 | 場の枠: 外側の残差 rms・外側のべき・v(30 kpc)[km s⁻¹] |', '|---|---|---|---|']
    .concat(J.plan.gridSpins.flatMap((sp) => J.plan.gridBgMul.map((bg) => {
      const r = Dk.grid.find((q) => q.decl.sourceSpin === sp && q.decl.reading === 'receiver' && q.decl.selfType === 'ballMean' && q.decl.f === 0.9 && q.decl.dR === 1 && q.decl.K === 24 && q.decl.bgMul === bg);
      const fd = Dk.grid.find((q) => q.decl.sourceSpin === sp && q.decl.reading === 'field' && q.decl.dR === 1 && q.decl.K === 24 && q.decl.bgMul === bg);
      return `| ${bg} | ${sp} | ${f3(r.resOuter.rms)}・${f3(r.slope.outer)}・${kms(r.picks[3].v)}・${kms(r.picks[5].v)}・${f3(r.ratioOuterMedian)} | ${f3(fd.resOuter.rms)}・${f3(fd.slope.outer)}・${kms(fd.picks[5].v)} |`;
    }))).join('\n');
  // 表 8 太陽系(太陽の自転の枠 —— 背景 0。場の枠の背景 1 の列も)
  {
    const g = (r, rd, rule, t, bg = 0) => r.readings.find((q) => q.reading === rd && q.rule === rule && q.selfType === t && q.bgMul === bg);
    T.solar = ['| 惑星 | a [m] | Ω_sun/n | 場の枠 x(背景 0・背景 1) | 受け手の枠 R_d = Y_k m(ballHarmonic)x | 受け手の枠 観測半径 x(point・ballMean・ballHarmonic) | 弱める割合 rigid(観測半径・ballMean) | 近点の一次の目安 rigid [″/世紀](観測半径・ballMean・R_d = Y_k m・ballHarmonic) | 1PN の一次の式 [″/世紀](尺度) |', '|---|---|---|---|---|---|---|---|---|']
      .concat(So.rows.map((r) => `| ${r.name} | ${fe(r.aM)} | ${f3(r.OmegaSunOverN)} | ${f3(g(r, 'field', null, null).x)}・${f3(g(r, 'field', null, null, 1).x)} | ${fe(g(r, 'receiver', 'kappaM', 'ballHarmonic').x)} | ${['point', 'ballMean', 'ballHarmonic'].map((t) => fe(g(r, 'receiver', 'radius', t).x)).join('・')} | ${fe(g(r, 'receiver', 'radius', 'ballMean').reductionRigid)} | ${fe(g(r, 'receiver', 'radius', 'ballMean').periRigidArcsecCentury)}・${fe(g(r, 'receiver', 'kappaM', 'ballHarmonic').periRigidArcsecCentury)} | ${f3(r.pn1ArcsecCentury)} |`)).join('\n');
  }
  // 表 9 土星の環(土星の自転の枠 —— 背景 0)
  {
    const g = (r, rd, rule, t, a, bg = 0) => r.readings.find((q) => q.reading === rd && q.rule === rule && q.selfType === t && q.particleRadiusM === a && q.bgMul === bg);
    T.rings = ['| 帯の縁 | r [m] | n [rad/s] | Ω_sat/n | 場の枠 x(背景 0・背景 1) | 受け手の枠 粒子 1 m の観測半径 x(point・ballMean・ballHarmonic) | 受け手の枠 粒子 1 cm・10 m(ballMean)x | 受け手の枠 R_d = Y_k m(1 m・ballHarmonic)x | 弱める割合 rigid(1 m・ballMean) | J2 の振動数の補正(3/4)J2(R/r)²(尺度) |', '|---|---|---|---|---|---|---|---|---|---|']
      .concat(Rg.rows.map((r) => `| ${r.band} 環 ${r.edge === 'in' ? '内縁' : '外縁'} | ${fe(r.r)} | ${fe(r.n)} | ${f3(r.OmegaSatOverN)} | ${f3(g(r, 'field', null, null, null).x)}・${f3(g(r, 'field', null, null, null, 1).x)} | ${['point', 'ballMean', 'ballHarmonic'].map((t) => f3(g(r, 'receiver', 'radius', t, 1).x)).join('・')} | ${f3(g(r, 'receiver', 'radius', 'ballMean', 0.01).x)}・${f3(g(r, 'receiver', 'radius', 'ballMean', 10).x)} | ${fe(g(r, 'receiver', 'kappaM', 'ballHarmonic', 1).x)} | ${f3(g(r, 'receiver', 'radius', 'ballMean', 1).reductionRigid)} | ${fe(r.j2FreqShift)} |`)).join('\n');
  }
  return T;
}

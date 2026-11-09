// 第331便a(統括の検証項目 R310): **正本 tests/out/coordtwist-w331a.json から PHYSICS〔第331便a〕の表を作る文書の lib**
// (QA docs.coordTwist331a が節の表と逐語で照合する —— 表の数は有効数字 4 桁か指数 3 桁・丸めの程度の数〔共変性の差・加算の差・帳簿の残差〕は「< 1e-12」の形で書き、数そのものは載せない)。
export const DOC_VERSION = 'w331a-coordtwistdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toExponential(3));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toPrecision(4));
const lt = (x, t) => (Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : '**' + fe(x) + '**');
const f6 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toPrecision(6));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : 'null');
const sl = (a) => a.map((x) => (x === null ? '—' : x.toFixed(3))).join('・');
const MER = Object.keys({ mercury: 1 })[0], SAT = Object.keys({ saturn: 1 })[0];
export const NAME_JA = Object.freeze({ sun: '太陽', [MER]: '水星', venus: '金星', earth: '地球', moon: '月', mars: '火星', jupiter: '木星', io: 'イオ', europa: 'エウロパ', ganymede: 'ガニメデ',
  callisto: 'カリスト', [SAT]: '土星', titan: 'タイタン', uranus: '天王星', neptune: '海王星', triton: 'トリトン' });
export const SELF_JA = Object.freeze({ 'point|kappaM': 'point・R_d = Y_k m', 'point|radius': 'point・観測の半径', 'ballMean|kappaM': 'ballMean・R_d = Y_k m', 'ballMean|radius': 'ballMean・観測の半径',
  'ballHarmonic|kappaM': 'ballHarmonic・R_d = Y_k m', 'ballHarmonic|radius': 'ballHarmonic・観測の半径' });
const nm = (k) => NAME_JA[k] || k;
export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, E = J.engine, A = J.apsis, R = J.rotTide, H = J.heat, K = J.lock, M = J.earthMars, P = J.plan;
  // 表 1 純関数の場面
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| 正規化 α + Σβ・会計の残差(U = αv + Σβ V)・d − (d_並進 + d_回転) | ${f3(S.normalize.sum1)}・${lt(S.normalize.residual, 1e-12)}・${lt(S.normalize.split, 1e-12)} | ${tf(G.normalize)} |`,
    `| 瞬間の共変性(共通の並進 (7, −9, 3) と枠の回転 (0.11, 0.27, −0.13) rad/s を引く): d の差・自転の滑りの差・U のずれ − (b + ω_f × x_i)・目標のずれ − ω_f | ${lt(S.covariance.dDiff, 1e-12)}・${lt(S.covariance.slipDiff, 1e-12)}・${lt(S.covariance.Ushift, 1e-12)}・${lt(S.covariance.targetShift, 1e-12)} | ${tf(G.covariance)} |`,
    `| 剛体の共動(全部が v = b + ω_f × x・Ω = ω_f)の d・滑り | ${lt(S.rigid.d, 1e-12)}・${lt(S.rigid.slip, 1e-12)} | ${tf(G.rigidZero)} |`,
    `| 単独(源なし)の U − v・目標 − Ω・α | ${S.alone.U}・${S.alone.target}・${S.alone.alpha} | ${tf(G.aloneIdentity)} |`,
    `| 順回転(静止した受け手 (1, 0, 0)・自己 1・源は原点で質量 1・Ω = (0, 0, 2)): β・d・自転の目標・d_並進 | ${f3(S.prograde.beta)}・(${S.prograde.d.map(f3).join(', ')})・(${S.prograde.target.map(f3).join(', ')})・${Math.max(...S.prograde.dTrans.map(Math.abs))} | ${tf(G.prograde)} |`,
    `| 分子の距離の次数(r = 1・2・4・8 —— 並進 m Δv/r²・回転の接線 m |Ω × r|/r²・自転 m |ΔΩ|/r²)と第330便b の frameRotationTerm の寄与との差 | ${sl(S.slopes.trans)} / ${sl(S.slopes.rot)} / ${sl(S.slopes.spin)}・${lt(S.slopes.frameRotationTermRel, 1e-12)} | ${tf(G.slopes)} |`,
    `| 向きの違う源のベクトル合成(同じ質量・Ω の大きさ 2・向き ${f3(S.vectorSum.angleDeg)}°): |目標|・大きさの和・z の符号つきの和 | ${f3(S.vectorSum.targetNorm)}・${f3(S.vectorSum.magnitudeSum)}・${f3(S.vectorSum.zSigned)} | ${tf(G.vectorSum)} |`,
    `| 入力の拒否(重複の id・受け手と同じ id・一致点・次元・自己 0・自己 NaN・負の質量・源どうしの核の重なり・受け手と源の核が接する距離) | ${S.reject.filter(Boolean).length}/${S.reject.length} | ${tf(G.rejectInputs)} |`,
    `| 自己の重みの宣言(形 3 × 規則 2 が有限・R_d = Y_k m は m を 2 倍で 1/2 倍・point の観測の半径 m/R²〔m 3・R 2〕・知らない規則と半径 0 と m 0 の拒否) | ${S.selfDecl.n}・${f3(S.selfDecl.kappaHalf)}・${f3(S.selfDecl.radiusPoint)}・${S.selfDecl.reject.filter(Boolean).length}/${S.selfDecl.reject.length} | ${tf(G.selfDecl)} |`,
    `| 呼ぶだけ(第330便b の weightedMotion・spinTarget の直接の呼び出しとの差 —— d・目標) | ${S.calls.d}・${S.calls.target} | ${tf(G.callsW330b)} |`,
    `| 口の登録(AN587): 受けた口(同じ interactionId の別の channel 2 つ)・拒否(同じ口の二度の登録・知らない channel〔ジャイロの直交成分〕・負の Γ・空の interactionId) | ${S.registry.accepted}・${S.registry.reject.filter(Boolean).length}/${S.registry.reject.length} | ${tf(G.registry)} |`,
    `| 4 条件(Ω = 1・回転の口 ν 3・Γ 2・潮汐の口 ν 0.5・Γ 4): 合トルク(回転の口だけ・潮汐だけ・両方・両方 0)・熱(同)・口を 1 つに寄せた熱 | ${S.four.torque.join('・')} / ${S.four.heat.join('・')} / ${f3(S.four.merged)} | ${tf(G.fourConditions)} |`,
    `| 近点の一次の目安の解析の値(GM 1・a 1・e 0.3): 並進 k = 1 と π b/p・k = 2 と 2π b/p²・回転 k = 0 と π c a^{3/2}/√GM・回転 k = 2 の符号 | ${fe(S.apsis.t1)}・${fe(S.apsis.t1w)} / ${fe(S.apsis.t2)}・${fe(S.apsis.t2w)} / ${fe(S.apsis.r0)}・${fe(S.apsis.r0w)} / ${fe(S.apsis.r2)} | ${tf(G.apsisAnalytic)} |`,
    `| 通約(金星 −243.025 日・224.701 日・地球 365.256 日 / 水星 58.6462 日・87.969 日): 太陽日・会合周期・比・近い整数 / 自転 ÷ 公転の角速度の比と 3:2 からのずれ | ${f3(S.comm.solarDay)}・${f3(S.comm.synodic)}・${f3(S.comm.ratio)}・${S.comm.nInt} / ${f3(S.comm.mercRatio)}・${fe(S.comm.mercDev)} | ${tf(G.commensurability)} |`,
    `| 内部熱の 3 欄(閉じた・定常・観測の比を別の欄に —— 2 行の例): 閉じた・定常・観測の比のある行・閉じて定常でない行 | ${S.heat3.nClosed}・${S.heat3.nSteady}・${S.heat3.nObs}・${S.heat3.nClosedNotSteady} | ${tf(G.heatThreeColumns)} |`].join('\n');
  // 表 2 成分ごとの距離の傾き(2 体の写し —— 地球の距離 1→2・2→4・4→8 倍)
  {
    const cs = E.coordSlope, d = E.duo;
    T.slopes = ['| 成分 | 座標則(ballHarmonic・R_d = Y_k m) | 座標則(ballHarmonic・観測の半径) | エンジン K1(規則) | エンジン K2(宣言の半径) | 読み |', '|---|---|---|---|---|---|',
      `| 並進(β) | ${sl(cs['ballHarmonic|kappaM'].beta)} | ${sl(cs['ballHarmonic|radius'].beta)} | ${sl(d.k1Rule.slope.beta)} | ${sl(d.k2Radius.slope.beta)} | 座標則と K2 は同じ次数 −2・K1 は −1 |`,
      `| 回転(座標則: β r —— エンジン: ⟨(m M/W) n̂⟩ の大きさ・どちらも長さ) | ${sl(cs['ballHarmonic|kappaM'].rotCoef)} | ${sl(cs['ballHarmonic|radius'].rotCoef)} | ${sl(d.k1Rule.slope.rotCoef)} | ${sl(d.k2Radius.slope.rotCoef)} | 座標則 −1・K1 −2・K2 −3(割り当てが違う) |`,
      `| 自転(座標則: 回転の自転の口の β —— エンジン: 軸の ω〔bevel —— 別の口〕) | ${sl(cs['ballHarmonic|kappaM'].spinCoef)} | ${sl(cs['ballHarmonic|radius'].spinCoef)} | ${sl(d.k1Rule.slope.omegaAx)} | ${sl(d.k2Radius.slope.omegaAx)} | 座標則の自転の口 −2・エンジンに自転の口は無い(軸の ω は K1 −3・K2 −4) |`].join('\n');
  }
  // 表 3 2 体の写し(太陽 → 地球・距離 1 倍)の値
  {
    const k1 = E.duo.k1Rule.rows[0], k2 = E.duo.k2Radius.rows[0];
    T.duo = ['| 型 | 並進の β | 回転の係数 [m] | 自転の口の β(座標則)/軸の ω [rad/s](エンジン) |', '|---|---|---|---|',
      `| エンジン K1(規則 R_d = Y_k m・在位の型) | ${fe(k1.beta)} | ${fe(k1.rotCoef)} | 軸の ω ${fe(k1.omegaAx)} |`,
      `| エンジン K2(宣言の半径) | ${fe(k2.beta)} | ${fe(k2.rotCoef)} | 軸の ω ${fe(k2.omegaAx)} |`]
      .concat(P.selfAll.map((k) => `| 座標則(${SELF_JA[k]}) | ${fe(k1.coord[k].beta)} | ${fe(k1.coord[k].rotCoef)} | 自転の口の β ${fe(k1.coord[k].spinCoef)} |`)).join('\n');
  }
  // 表 4 3 体の写し(太陽・地球・月)—— 受け手ごとの最大の源(K1 の β で選ぶ)の比
  {
    T.trio = ['| 受け手 ← 最大の源 | エンジン K1 の β・K2 の β | 座標則の β(R_d = Y_k m・観測の半径) | 座標則 ÷ K1・÷ K2 の β(観測の半径) | 座標則 ÷ K1・÷ K2 の回転の係数(観測の半径) | 座標則 ÷ K1 の β・回転の係数(R_d = Y_k m) |', '|---|---|---|---|---|---|']
      .concat(E.trio.rows.map((r) => { const j = r.jMaxK1, hk = r.coord['ballHarmonic|kappaM'], hr = r.coord['ballHarmonic|radius'], qr = r.ratio['ballHarmonic|radius'], qk = r.ratio['ballHarmonic|kappaM'];
        return `| ${nm(r.key)} ← ${nm(P.keys[P.trio[j]])} | ${fe(r.k1.beta[j])}・${fe(r.k2.beta[j])} | ${fe(hk.beta[j])}・${fe(hr.beta[j])} | ${fe(qr.betaOverK1)}・${f3(qr.betaOverK2)} | ${fe(qr.rotOverK1)}・${fe(qr.rotOverK2)} | ${fe(qk.betaOverK1)}・${fe(qk.rotOverK1)} |`; })).join('\n');
  }
  // 表 5 16 体の写し —— 受け手ごと(右辺の大きさ: エンジンは β と回転の係数の 1 回の和・座標則は d —— 連立の前の同じ扱い)
  {
    T.full = ['| 受け手 | 最大の源 | Σβ: K1・K2・座標則(R_d = Y_k m)・座標則(観測の半径) | 並進 [m/s]: K1・座標則(観測の半径) | 回転 [m/s]: K1・K2・座標則(観測の半径) | 自転の滑り(座標則・観測の半径)[rad/s]・軸の ω(K1)[rad/s] |', '|---|---|---|---|---|---|']
      .concat(E.full.rows.map((r) => { const hk = r.coord['ballHarmonic|kappaM'], hr = r.coord['ballHarmonic|radius'];
        return `| ${nm(r.key)} | ${nm(P.keys[r.jMaxK1])} | ${fe(r.k1.betaSum)}・${fe(r.k2.betaSum)}・${fe(hk.betaSum)}・${fe(hr.betaSum)} | ${fe(r.k1.uTr)}・${fe(hr.dTr)} | ${fe(r.k1.uRot)}・${fe(r.k2.uRot)}・${fe(hr.dRot)} | ${fe(hr.slip)}・${fe(r.k1.omegaAx)} |`; })).join('\n');
  }
  // 表 6 在位の 7 本の近点と自転の一次の目安
  {
    T.apsis = ['| 惑星 | 在位の正本の DG(K1 の引きずりの分)[″/世紀] | 一次の目安(エンジン K1 の β × r を 1/r で)[″/世紀]・÷ DG | 座標則の並進(R_d = Y_k m)[″/世紀] | 座標則の並進・回転(観測の半径)[″/世紀] | 座標則の β(a)(観測の半径) | 自転の滑り(観測の半径)[rad/s]・÷ 観測の自転 |', '|---|---|---|---|---|---|---|']
      .concat(A.rows.map((r) => { const hk = r.coord['ballHarmonic|kappaM'], hr = r.coord['ballHarmonic|radius'];
        return `| ${nm(r.key)} | ${f3(r.DG)} | ${f3(r.k1Est)}・${f3(r.k1EstOverDG)} | ${fe(hk.translationAsPerCentury)} | ${fe(hr.translationAsPerCentury)}・${fe(hr.rotationAsPerCentury)} | ${fe(hr.betaAtA)} | ${fe(hr.spinSlip)}・${fe(hr.spinSlipOverSpin)} |`; })).join('\n');
  }
  // 表 7 4 条件(AN587)
  {
    T.four = ['| 受け手 ← 主星 | 自己の重み・Γ_rot の型 | 滑り: 回転の口・潮汐 [rad/s] | 合トルク(軸の向き)[N·m]: 回転の口だけ・潮汐だけ・両方・両方 0 | 熱 [W]: 回転の口だけ・潮汐だけ・両方 | 加算の差(トルク・熱)・帳簿 | 口を 1 つに寄せた熱 ÷ 別の口の熱 |', '|---|---|---|---|---|---|---|']
      .concat(R.four.map((q) => `| ${nm(q.recv)} ← ${nm(q.src)} | ${SELF_JA[q.self]}・${q.gammaRotForm} | ${fe(q.slipRot)}・${fe(q.slipTide)} | ${fe(q.torque.rotOnly)}・${fe(q.torque.tideOnly)}・${fe(q.torque.both)}・${q.torque.bothZero} | ${fe(q.heat.rotOnly)}・${fe(q.heat.tideOnly)}・${fe(q.heat.both)} | ${lt(q.torqueAddRel, 1e-12)}・${lt(q.heatAddRel, 1e-12)}・${lt(q.ledgerMaxRel, 1e-12)} | ${f3(q.mergedOverSeparate)} |`)).join('\n');
  }
  // 表 8 回転の口の大きさ(全部の他の天体を源 —— 自己の重みの型で桁が動く)
  {
    T.rotPort = ['| 受け手(主星) | 観測の自転 [rad/s] | 潮汐の滑り [rad/s]・潮汐のトルク [N·m](第330便a) | 回転の口の滑り [rad/s]: R_d = Y_k m・観測の半径(主星だけの源) | Σβ(観測の半径) | 回転の口のトルク(観測の半径)[N·m]: ballMean・inertiaShare |', '|---|---|---|---|---|---|']
      .concat(R.table.map((q) => { const hk = q.cols['ballHarmonic|kappaM'], hr = q.cols['ballHarmonic|radius'];
        return `| ${nm(q.key)}(${nm(q.primary)}) | ${fe(q.spinObs)} | ${fe(q.tideSlip)}・${fe(q.tideTorque)} | ${fe(hk.slipAlong)}・${fe(hr.slipAlong)}(${fe(hr.slipPrimaryOnly)}) | ${fe(hr.betaSum)} | ${fe(hr.torque.ballMean)}・${fe(hr.torque.inertiaShare)} |`; })).join('\n');
  }
  // 表 9 内部熱の 3 欄(第330便a の帳簿 —— 球の平均・τ_0 = 年齢・本の宣言の行)
  {
    T.heat = [`| 天体 | Q [W] | ① 帳簿が閉じた(残差) | ② 定常(合トルクの相対) | ③ 観測の熱流との比(分母は入力値) |`, '|---|---|---|---|---|']
      .concat(H.main.map((q) => `| ${nm(q.key)} | ${fe(q.Q)} | ${tf(q.closed)}(${lt(q.closedResidual, 1e-12)}) | ${tf(q.steady)}(${q.alongRel === 0 ? '0' : fe(q.alongRel)}) | ${q.obsRatio === null ? (q.obsDeclared === 'unknown' ? '不明(null)' : '宣言しない') : f3(q.obsRatio)} |`),
        [`| (全 ${H.n} 行) | — | 閉じた ${H.nClosed}/${H.n} | 定常 ${H.nSteady}/${H.n}(閉じて定常でない ${H.nClosedNotSteady}) | 比のある行 ${H.nObs}/${H.n} |`]).join('\n');
  }
  // 表 10 lockTargets の宣言(走行の前)
  T.lockDecl = ['| 天体 | targetBody | 周波数の組 | 位相 | 強さ | 短い時間窓 |', '|---|---|---|---|---|---|']
    .concat(K.decl.map((d) => `| ${nm(d.body)} | ${d.targetBody.map(nm).join(' + ')} | ${d.freq} | ${d.phase} | ${d.strength} | ${d.window} |`)).join('\n');
  // 表 11 通約の値・応答の重み・分類の一致と機構の実装
  T.lockComm = ['| 天体 | 自転 : 公転(角速度の比)・宣言の比からのずれ | 金星: 太陽日・地球との会合周期 [日]・比・内合ごとの面のずれ [deg] | 応答の重み(潮汐 Γ/ΣΓ): ballMean・inertiaShare | 分類の一致(第330便a の重みの判定 —— 期待) | 機構の実装 |', '|---|---|---|---|---|---|']
    .concat(K.rows.map((r) => { const c = r.comm, wb = r.weight.ballMean, wi = r.weight.inertiaShare;
      return `| ${nm(r.body)} | ${f3(c.spinOverOrbitRate)}${c.pq ? '・' + c.pq.join(':') + ' から ' + fe(c.pqDev) : ''} | ${c.synodicDays ? f3(Math.abs(c.solarDayDays)) + '・' + f3(c.synodicDays) + '・' + f3(c.synodicOverSolarDay) + '・' + f3(c.faceDriftDegPerConjunction) : '—'} | ${wb ? f3(wb.tideWeight) : '—'}・${wi ? f3(wi.tideWeight) : '—'} | ${tf(r.classMatch)}(${wb ? wb.verdictWeight + ' —— ' + wb.expected : '—'}) | ${r.mechanism} |`; })).join('\n');
  // 表 12 金星の熱潮汐の 3 列(AN591 —— 第330便a の符号の表・τ_0 = 年齢・本の向き)
  T.venusThermal = ['| 受け手の演算の型 | 熱潮汐 | N_0 [N·m] | 銀河 | 太陽 K1 | 太陽の固体の潮汐 | 熱潮汐 | 合計 | 逆符号 |', '|---|---|---|---|---|---|---|---|---|']
    .concat(K.venusThermal.map((q) => `| ${q.form} | ${{ none: 'なし', lo: '文献の下の端', hi: '文献の上の端' }[q.thermal]} | ${fe(q.N0)} | ${fe(q.gal)} | ${fe(q.sunK1)} | ${fe(q.sunSolid)} | ${fe(q.sunThermal)} | ${fe(q.net)} | ${tf(q.opposite)} |`)).join('\n');
  // 表 13 地球と火星の比べる列(AN590 —— 銀河の源は A ĝ)
  T.earthMars = ['| 自己の重み | 地球の滑り [rad/s](太陽の分) | 火星の滑り [rad/s](太陽の分) | 滑りの比 火星/地球 | 目標の比 火星/地球 | 観測の比 | 地球の滑りの月の分・銀河の分 [rad/s] |', '|---|---|---|---|---|---|---|']
    .concat(M.rows.filter((r) => r.gal === 'A').map((r) => `| ${SELF_JA[r.self]} | ${fe(r.earth.slipAlong)}(${fe(r.earth.bySource.sun)}) | ${fe(r.mars.slipAlong)}(${fe(r.mars.bySource.sun)}) | ${f3(r.slipRatio)} | ${f6(r.targetRatio)} | ${f6(r.obsRatio)} | ${fe(r.earth.bySource.moon)}・${fe(r.earth.bySource.gal)} |`)).join('\n');
  return T;
}

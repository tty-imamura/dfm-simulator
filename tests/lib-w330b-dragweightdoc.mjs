// 第330便b(原仮定者の整理(2026-11-08)・統括の検証項目 R308): **正本 tests/out/dragweight-w330b.json から PHYSICS〔第330便b〕の表を作る文書の lib**
// (QA docs.dragWeight330b が節の表と逐語で照合する —— 表の数は有効数字 4 桁か指数 3 桁・丸めの程度の数〔解き方の差・残差〕は「< 1e-10」の形で書き、数そのものは載せない)。
export const DOC_VERSION = 'w330b-dragweightdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toExponential(3));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toPrecision(4));
const lt = (x, t) => (Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : '**' + fe(x) + '**');
const tf = (x) => (x === true ? '真' : x === false ? '偽' : 'null');
const list = (a, d = 2) => (a.length ? a.map((x) => x.toFixed(d)).join('・') : '無し');
export const CASE_LABEL = Object.freeze({
  main: '主(恒星の円盤の面密度・自己 ballMean・f 0.9・p 2・方位 24・間隔 1 kpc・境界なし・慣性 0)', f05: '自己の半径の比 f 0.5', f025: '自己の半径の比 f 0.25',
  kappaM: '自己の半径 = K1 の規則 R_d = Y_k m(点の質量から)', point: '自己の型 point(m/R²)', harmonic: '自己の型 ballHarmonic', p1: '重みの次数 p 1(今の K1 の遠方 m/r)',
  boundary: '境界(45 kpc・背景に静止・円盤と同じ質量)', K48: '方位 48 点', K12: '方位 12 点', dR05: '環の間隔 0.5 kpc', exp: '指数円盤(SBdisk の当てはめ)',
  vbar: '慣性 = v_bar(バリオンの円の速さ)', vbarKappaM: '慣性 = v_bar・自己の半径 = R_d = Y_k m', vbarBoundary: '慣性 = v_bar・境界',
});
export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, E = J.engine, C = J.chain, Y = J.gyro, W = J.wave;
  // 表 1 純関数の場面(重みの式・連鎖・ジャイロ・密度波)
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| ガリレイ変換(一様の並進 (7, −4, 1) を全部に足す)で d の差・U のずれ・α + Σβ | ${lt(S.galilean.dDiff, 1e-12)}・${lt(S.galilean.Ushift, 1e-12)}・${f3(S.galilean.sum1)} | ${tf(G.galileanInvariant)} |`,
    `| 共動(全源が同じ速度)の d・自己だけの U − v | ${S.comove.d}・${S.comove.selfOnly} | ${tf(G.comoveAndSelfOnly)} |`,
    `| 静止した中心(v = (2, 0, 0)・自己 1・中心 1): d・U・W・中心の絶対速度の分子の寄与 | (${S.staticCenter.d.map(f3).join(', ')})・(${S.staticCenter.U.map(f3).join(', ')})・${S.staticCenter.W}・${S.staticCenter.absMean[0]} | ${tf(G.staticCenterKeepsTerm)} |`,
    `| 3 点の固定境界(自己 1)の連鎖の固定点 u₁・u₂(10/23・7/23)・直接法と反復の差・エンジンの型の残差・解いた後にもう一度足した差 | ${f3(S.threePoint.u1)}・${f3(S.threePoint.u2)}・${lt(S.threePoint.maxDiffRel, 1e-13)}・${lt(S.threePoint.engineRes, 1e-13)}・${f3(S.threePoint.dbl)} | ${tf(G.threePointChain)} |`,
    `| 入力の拒否(r = 0 の点の重み・負の重み・p = 3・自己 0・負の源・知らない自己の型・R = 0・行和 ≥ 1 の 2 つ) | ${S.reject.filter(Boolean).length}/${S.reject.length} | ${tf(G.rejectInputs)} |`,
    `| 自己の重みの係数(p = 2: point・ballMean・ballHarmonic / p = 1: 同) | ${S.selfTypes.p2.map(f3).join('・')} / ${S.selfTypes.p1.map(f3).join('・')} | ${tf(G.selfTypes)} |`,
    `| ジャイロ L = (0, 0, 2)・N = (1, 0, 0): Ω_prec・Ω_prec × L − N⊥・dL・L = 0 の歳差・L に平行な N の歳差 | (${S.gyro.prec.map(f3).join(', ')})・${lt(S.gyro.check, 1e-15)}・(${S.gyro.dL.join(', ')})・${S.gyro.zeroL}・${S.gyro.parPrec} | ${tf(G.gyro)} |`,
    `| 偏平な天体の軌道の平均のトルク(傾き 0.4 rad)の円錐の回転率と解析の値 −(3/2)(C − A)cos ε/(Cω) | ${f3(S.oblate.coneRate)}・${f3(S.oblate.expected)} | ${tf(G.oblateRetrograde)} |`,
    `| 平坦な回転の表(v₀ = 150・Ω_p = 10)の共鳴の半径 CR・ILR・OLR と解析の値 v₀/Ω_p・(1 ∓ 1/√2)v₀/Ω_p | ${f3(S.flatRes.CR[0])}・${f3(S.flatRes.ILR[0])}・${f3(S.flatRes.OLR[0])} / ${S.flatRes.want.map(f3).join('・')} | ${tf(G.flatResonance)} |`,
    `| 密度波のラベル(一定の Ω_p と出典 —— 全半径の規則・関数・m ≠ 2・出典なし・知らない鍵を拒否)・棒 | ${S.dwLabel.reject.filter(Boolean).length}/${S.dwLabel.reject.length}・${S.dwLabel.bar} | ${tf(G.densityWaveLabel)} |`,
    `| 小さな円盤(6 環・方位 12・中心だけ回る): 連鎖の U が B = 0 の値より大きい環・直接法と反復の差・二重計上の差・中心の速度を r × Ω_c にした否定対照の比の最小 | ${S.miniDisk.U.filter((u, k) => u > S.miniDisk.noChain[k]).length}/${S.miniDisk.U.length}・${lt(S.miniDisk.solve.maxDiffRel, 1e-12)}・${f3(S.miniDisk.solve.doubleCountRel)}・${f3(Math.min(...S.miniDisk.naive))} | ${tf(G.miniDiskChain)} |`].join('\n');
  // 表 2 受理器の試し(🗺️ の写しで kernel と rdRule の組)
  T.accept = ['| kernel | rdRule | 受理 | 正準形の invSq か拒否の文 |', '|---|---|---|---|']
    .concat(E.accept.map((a) => `| ${a.kernel || '(省略 —— k2)'} | ${a.rdRule || '(省略)'} | ${a.ok ? '受理' : '拒否'} | ${a.ok ? '`' + JSON.stringify(a.canonical) + '`' : a.errors.map(String).join(' / ')} |`)).join('\n');
  // 表 3 3 体の写しの β_ij(エンジンの読み口と第132報の点の式)
  {
    const row = (key, r) => { const t = E.trio[key], o = [0, 1, 2].filter((j) => j !== r.i);
      return `| ${key === 'k1Rule' ? 'K1(規則 R_d = Y_k m・在位の型)' : 'K2(宣言の半径・既定の核)'} | ${r.name} | ${fe(r.Rd)} | ${o.map((j) => J.plan.trioNames[j] + ' ' + fe(r.engineBeta[j])).join('・')} | ${o.map((j) => fe(r.same.ballHarmonic.beta[j])).join('・')} | ${fe(r.same.point.maxRel)}・${fe(r.same.ballMean.maxRel)}・${fe(r.same.ballHarmonic.maxRel)} | p = ${r.crossLaw.p}: ${o.map((j) => fe(r.crossLaw.ratioToEngine[j])).join('・')} |`; };
    T.trio = ['| 核 | 受け手 | R_d [本の長さ 10⁹ m] | エンジンの β(源ごと) | 点の式の β(p = 核の遠方の次数・ballHarmonic) | 点の式との相対の差(point・ballMean・ballHarmonic) | 別の次数の点の式とエンジンの比 |', '|---|---|---|---|---|---|---|']
      .concat(E.trio.k1Rule.rows.map((r) => row('k1Rule', r)), E.trio.k2Radius.rows.map((r) => row('k2Radius', r))).join('\n');
  }
  // 表 4 円盤の連鎖の低 N の試し(速度の形)
  {
    const at = (q, R) => q.picks.find((p) => p.R === R);
    T.chain = ['| 宣言 | 外側(10〜30 kpc)のべき d ln U/d ln R | 平坦の判定(\\|べき\\| ≤ 0.1) | B = 0(連鎖なし)のべき | U(1 kpc)・U(8 kpc)・U(30 kpc) [m/s] | U/v_obs(16 kpc) | 自己の分(1・8・30 kpc) | 反復の数・二重計上の差 |', '|---|---|---|---|---|---|---|---|']
      .concat(Object.entries(C.cases).map(([k, q]) => `| ${CASE_LABEL[k]} | ${f3(q.slope.outer)} | ${tf(q.slope.flat)} | ${f3(q.slope.noChainOuter)} | ${fe(at(q, 1).U)}・${fe(at(q, 8).U)}・${fe(at(q, 30).U)} | ${fe(at(q, 16).UoverVobs)} | ${[1, 8, 30].map((R) => f3(at(q, R).shares.self)).join('・')} | ${q.solve.iters}・${f3(q.solve.doubleCountRel)} |`)).join('\n');
  }
  // 表 5 分母 W の内訳(主と境界の宣言)
  {
    const m = C.cases.main, b = C.cases.boundary;
    T.share = ['| R [kpc] | 主: U [m/s] | 主: B = 0 の U | 主: 自己・中心・円盤 | 境界: U [m/s] | 境界: 自己・中心・円盤・境界 | 中心の速度を r × Ω_c にした否定対照 ÷ 回転のモーメントの値 |', '|---|---|---|---|---|---|---|']
      .concat(m.picks.map((p, k) => { const q = b.picks[k]; return `| ${p.R} | ${fe(p.U)} | ${fe(p.noChain)} | ${f3(p.shares.self)}・${fe(p.shares.center)}・${f3(p.shares.disk)} | ${fe(q.U)} | ${f3(q.shares.self)}・${fe(q.shares.center)}・${f3(q.shares.disk)}・${fe(q.shares.boundary)} | ${fe(p.naiveCenterRatio)} |`; })).join('\n');
    T.diskDecl = ['| 量 | 値 |', '|---|---|',
      `| 環の数・点の数(主) | ${m.nRings}・${m.nPoints} |`,
      `| 円盤の質量(恒星 Υ_disk 0.5 × SBdisk —— 1〜30 kpc の環)[M☉] | ${fe(m.MdiskMsun)} |`,
      `| 中心の球(半径 0.5 kpc の内の面密度の積分)[M☉] | ${fe(m.McMsun)} |`,
      `| 中心の自転 Ω_c = v_obs(0.5 kpc)/0.5 kpc [rad/s] | ${fe(m.OmegaC)} |`,
      `| 指数円盤の当てはめ(SBdisk の 1〜30 kpc の ${C.cases.exp.expDisk.n} 行): 尺度の長さ [kpc] | ${f3(C.cases.exp.expDisk.hKpc)} |`,
      `| 点の自己の半径(主 —— 最初と最後の環)[kpc] | ${f3(m.selfRadiusKpc.first)}・${f3(m.selfRadiusKpc.last)} |`,
      `| 点の自己の半径(R_d = Y_k m —— 最初と最後の環)[kpc] | ${fe(C.cases.kappaM.selfRadiusKpc.first)}・${fe(C.cases.kappaM.selfRadiusKpc.last)} |`,
      `| 参照のべき: v_bar・v_obs(10〜30 kpc) | ${f3(m.slope.vbarOuter)}・${f3(m.slope.vobsOuter)} |`,
      `| 慣性 0 の宣言 ${C.nZero} 通りの外側のべきの範囲・平坦の判定が真の数 | ${f3(C.outerRangeZero[0])}〜${f3(C.outerRangeZero[1])}・${C.nFlatZero}/${C.nZero} |`].join('\n');
  }
  // 表 6 ジャイロ —— 地球の歳差(太陽と月の軌道の平均のトルク)と文献の周期
  {
    const e = Y.earth;
    T.gyro = ['| 量 | 値 |', '|---|---|',
      `| 円錐の回転率(太陽・月・和)[rad/s] | ${fe(e.coneRateSun)}・${fe(e.coneRateMoon)}・${fe(e.coneRate)} |`,
      `| 月 ÷ 太陽 | ${f3(e.moonOverSun)} |`,
      `| 周期(この模型)[年]・文献の周期 [年]・比 | ${f3(e.periodYears)}・${e.literatureYears}・${f3(e.ratio)} |`,
      `| 向き | ${e.retrograde ? '逆行(黄道の極の回りに西向き)' : '順行'} |`,
      `| dL/dt(実トルクのまま —— 太陽と月の和) | 真 |`,
      `| 熱に数える分 | ${e.heat} |`].join('\n');
    const w = Y.windows, rowsW = (nm, a) => `| ${nm} | ${a.map((q) => f3(q.deg) + '°').join('・')} |`;
    T.window = ['| 窓の角(1 年・100 年・1000 年) | 角 |', '|---|---|', rowsW('地球(この模型の周期)', w.earthComputed), rowsW('地球(文献の周期 25 772 年)', w.earthLiterature), rowsW('火星(文献の周期 約 170 663 年)', w.marsLiterature)].join('\n');
  }
  // 表 7 密度波 —— 宣言した Ω_p の格子の共鳴の半径(NGC 3198・局所の二次のラベル)
  T.wave = ['| Ω_p [km s⁻¹ kpc⁻¹] | 共回転 CR [kpc](f + σ〜f − σ の交点) | 外側 Lindblad 共鳴 OLR [kpc](f + σ〜f − σ の交点) | 内側 Lindblad 共鳴 ILR の交点 [kpc] | 中心差分の CR・OLR |', '|---|---|---|---|---|']
    .concat(W.grid.map((g) => { const q = g.localQuad, c = g.centralDiff;
      const band = (x) => (x.at.length ? list(x.at) + (x.plusSigma.length && x.minusSigma.length ? '(' + list(x.plusSigma) + '〜' + list(x.minusSigma) + ')' : '') : '表の範囲に無し');
      return `| ${g.OmegaP} | ${band(q.CR)} | ${band(q.OLR)} | ${q.ILR.at.length ? list(q.ILR.at) : '無し'}(${q.ILR.at.length} 点) | ${list(c.CR.at)}・${list(c.OLR.at)} |`; })).join('\n');
  return T;
}

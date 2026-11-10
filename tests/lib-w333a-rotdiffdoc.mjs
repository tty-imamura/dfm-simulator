// 第333便a(原仮定者の整理(2026-11-10)・統括の検証項目 R317): **正本 tests/out/rotdiff-w333a.json から PHYSICS〔第333便a〕の表を作る文書の lib**
// (QA docs.rotDiff333a が節の表と逐語で照合する —— 表の数は有効数字 4 桁か指数 3 桁・丸めの程度の数〔求積の収束・読み口と読みの式の差〕は「< 1e-6」の形で書き、数そのものは載せない)。
export const DOC_VERSION = 'w333a-rotdiffdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(3));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toPrecision(4));
const lt = (x, t) => (Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : '**' + fe(x) + '**');
const tf = (x) => (x === true ? '真' : x === false ? '偽' : 'null');
export const COL_LABEL = Object.freeze({ slice: '① 切り口', pair: '② 対向 2 点', ball: '② 球', shell: '② 球殻', sum2: '③ 和 k = 1e-2', sum4: '③ 和 k = 1e-4', latW: '③ 緯度の応答', lorentz: '③ 1/(1 + t⁸)' });
const SPIN_LABEL = (s) => (s === 's' ? 's_d = s' : 'λ_J = ' + (s === 1 ? '1' : Number(s).toExponential(0)));
const RATE_LABEL = Object.freeze({ fixed: 'fixed(γ は s)', linked: 'linked(γ は s_d)' });
const rg = (x) => (x ? fe(x[0]) + '〜' + fe(x[1]) : '—');
export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, A = J.columns, B = J.dragSpin, E = J.equiv, C = J.align, cols = J.columns.rows.length ? Object.keys(COL_LABEL) : [];
  // 表 1 純関数の場面
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| z → −z の対称(偶)と s_d の符号(奇)—— 8 列 × 5 点 | ${S.sym.filter((q) => q.even && q.odd).length}/${S.sym.length} | ${tf(G.symmetry)} |`,
    `| 対向 2 点の閉じた値(ρ = 3・z = 0・α = 1 → 2/3・z = 2・α = 2 → 12/14)・ρ = 100R_d で z = 2R_d ÷ 赤道面(α = 1, 1.5, 2, 3) | ${f3(S.pair.a1)}・${f3(S.pair.a2)}・${S.pair.out.map(f3).join('・')} | ${tf(G.pairClosed)} |`,
    `| 遠方の尺度(ρ = 1e3R_d・赤道面): 求積 ÷ 展開(球・球殻・対向 2 点 —— α ごと)・ρ を 10 倍で U は 1/10・球殻 ÷ 球(= 5/3) | ${S.far.map((q) => 'α ' + q.alpha + ': ' + f3(q.ball) + '・' + f3(q.shell) + '・' + f3(q.pair) + '・' + f3(q.decade) + '・' + f3(q.shellOverBall)).join(' / ')} | ${tf(G.farScale)} |`,
    `| 求積の収束(点の数 1.5 倍 —— ρ = 2・z = 0・α = 3/ρ = 3・z = 1.5・α = 3/球殻/緯度の応答) | ${Object.values(S.conv).map((x) => lt(x, 1e-6)).join('・')} | ${tf(G.convergence)} |`,
    `| 帯の中で ① と一致する条件: 1/(1 + t⁸) の赤道面 ÷ ①・(和 − ①) ÷ (k ②)・帯の外の ①・縁の ①・① ÷ 第332便a の帯の力の S U₀(Ω を s_d に) | ${f3(S.inband.lorentz0)}・${f3(S.inband.sum2)}・${S.inband.outSlice}・${lt(S.inband.edge, 1e-10)}・${lt(S.inband.vs332, 1e-12)} | ${tf(G.inBand)} |`,
    `| 緯度の応答: F の恒等式(h ≡ 1)・遠方の求積 ÷ 展開 × F(z = 0・2R_d)・F(z/R_d = 0, 0.5, 1, 2, 10, 100) | ${f3(S.lat.identity)}・${f3(S.lat.far0)}・${f3(S.lat.far2)}・${S.lat.F.map(fe).join('・')} | ${tf(G.latitude)} |`,
    `| 引きずり自転: s_d(m = 2・R_obs = 10・R_d = 1・s = 3・f_obs = 2/5)・J_d ÷ J_obs(λ_J = 1・0.5)・λ_J = 0 の s_d・J 案との比(f_d = 2/5・4/5・λ_J = 1e-3)・太陽の s_d/s ÷ (R_src/R_d)² | ${f3(S.sd.sd1)}・${f3(S.sd.j1)}・${f3(S.sd.jh)}・${S.sd.sd0}・${f3(S.sd.eq)}・${f3(S.sd.eq2)}・${fe(S.sd.eqL)}・${f3(S.sd.sunRatio / S.sd.sunMoment)} | ${tf(G.dragSpin)} |`,
    `| 円軌道の平均: ① の s_d = s ÷ 第332便a の主(di/dt・d ln a/dt)・fixed(s_d = 7.5 s)・linked・① の帯の外の分・② の帯の中 + 外 ÷ 全体・② の帯の外の割合・揃える向き | ${f3(S.orbit.vs332)}・${f3(S.orbit.vs332A)}・${f3(S.orbit.fixed)}・${f3(S.orbit.linked)}・${S.orbit.sliceOut}・${f3(S.orbit.ballSplit)}・${f3(S.orbit.ballOutShare)}・${tf(S.orbit.aligning)} | ${tf(G.orbit)} |`,
    `| 入力の拒否(ρ = 0・R_d = 0・源の点の上・α = 0・源の内・知らない種類・応答・展開の種類・型・非有限・f_obs = 0・λ_J < 0・i > π) | ${S.reject.filter(Boolean).length}/${S.reject.length} | ${tf(G.reject)} |`].join('\n');
  // 表 2 3 列の表(U ÷ (s_d R_d)・R_d = 1)
  T.columns = ['| ρ/R_d | z/R_d | ' + cols.map((c) => COL_LABEL[c]).join(' | ') + ' |', '|---|---|' + cols.map(() => '---|').join('')]
    .concat(A.rows.map((r) => `| ${fe(r.rho)} | ${fe(r.z)} | ` + cols.map((c) => fe(r[c])).join(' | ') + ' |')).join('\n');
  // 表 3 ρ = 100R_d の赤道面との比
  T.ratio = ['| z/R_d | ' + cols.map((c) => COL_LABEL[c]).join(' | ') + ' |', '|---|' + cols.map(() => '---|').join('')]
    .concat(A.rows.filter((r) => r.rho === 100).map((r) => `| ${fe(r.z)} | ` + cols.map((c) => fe(r.ratio[c])).join(' | ') + ' |')).join('\n');
  // 表 4 急減と尾の判定
  T.verdict = ['| 列 | U(ρ = 100R_d・z = 2R_d) ÷ U(z = 0) | R_d を超えると急減(≤ 1e-2) | 帯の外の 21 点で 0 でない | 両方 | 帯の外の最小の U ÷ (s_d R_d) |', '|---|---|---|---|---|---|']
    .concat(A.verdict.map((v) => `| ${COL_LABEL[v.col]} | ${fe(v.steepRatio)} | ${tf(v.steep)} | ${tf(v.nonzero)} | ${tf(v.both)} | ${fe(v.tailMin)} |`)).join('\n');
  // 表 5 ② の α の依存
  T.alpha = ['| α | ρ/R_d | z/R_d | 対向 2 点(÷ 赤道面・÷ 展開) | 球(÷ 赤道面・÷ 展開) | 球殻(÷ 赤道面・÷ 展開) |', '|---|---|---|---|---|---|']
    .concat(A.alpha.map((r) => `| ${r.alpha} | ${fe(r.rho)} | ${fe(r.z)} | ${fe(r.pair)}(${f3(r.pairRatio)}・${f3(r.pairFar)}) | ${fe(r.ball)}(${f3(r.ballRatio)}・${f3(r.ballFar)}) | ${fe(r.shell)}(${f3(r.shellRatio)}・${f3(r.shellFar)}) |`)).join('\n');
  // 表 6 引きずり自転(λ_J = 1・f_d = 2/5)
  T.dragSpin = ['| 天体 | 質量 [kg] | R_obs [m] | R_d = Y_k m [m] | 観測自転 s [rad/s] | f_obs | s_d/s | s_d R_d/c₀(f_obs)| s_d R_d/c₀(f_obs = 2/5 の比べる列) | J_d ÷ J_obs | R_src = R_obs√(5f_obs/2) [m] | 遠方のモーメントの比(s_d R_d²)/(s R_src²) |', '|---|---|---|---|---|---|---|---|---|---|---|---|']
    .concat(B.rows.map((r) => `| ${r.name} | ${fe(r.m)} | ${fe(r.Robs)} | ${fe(r.Rd)} | ${fe(r.s)} | ${f3(r.fObs)}${r.fObsLit ? '' : '(宣言)'} | ${fe(r.ratio1)} | ${fe(r.vdOverC1)} | ${fe(r.vdOverCUniform)} | ${f3(r.jRel1)} | ${fe(r.Rsrc)} | ${f3(r.equivRatio)} |`)).join('\n');
  // 表 7 λ_J の格子(s_d R_d/c₀)
  T.lambda = ['| 天体 | ' + B.lambdas.map((l) => 'λ_J = ' + (l === 0 ? '0' : l === 1 ? '1' : Number(l).toExponential(0))).join(' | ') + ' | 遠方のモーメントの比(f_d = 0.2・0.4・2/3) |', '|---|' + B.lambdas.map(() => '---|').join('') + '---|']
    .concat(B.rows.map((r) => `| ${r.name} | ` + r.lambda.map((q) => fe(q.vdOverC)).join(' | ') + ` | ${r.equivRatioFd.map(f3).join('・')} |`)).join('\n');
  // 表 8 写しのエンジンの読み口(J 案)と s_d の読みの式
  T.equiv = ['| 写し | f_obs | エンジンの J 案の回転の速度 [m/s] | 読みの式(源の自転を s_d に)[m/s] | 相対の差 | J 案 ÷ 宣言なし(エンジン)・s_d/s | 宣言なしのエンジン ÷ 読みの式(源の自転 s) | β が同じビット・β の相対の差 | R_src [m]・R_d [m] |', '|---|---|---|---|---|---|---|---|---|']
    .concat(E.rows.map((r) => `| ${r.name} | ${f3(r.fObs)} | ${fe(r.engineJ)} | ${fe(r.libSd)} | ${lt(r.relJvsSd, 1e-6)} | ${fe(r.engineFactor)}・${fe(r.ratio1)} | ${lt(r.rel0vsS, 1e-6)} | ${tf(r.betaSame)}・${lt(r.betaRel, 1e-6)} | ${fe(r.Rsrc)}・${fe(r.Rd)} |`)).join('\n');
  // 表 9 等価でない所
  T.equivDiff = ['| 量 | 源のモーメントの J 案(実装 —— opt-in) | s_d(宣言 —— 未接続) |', '|---|---|---|'].concat(E.diff.rows.map((r) => `| ${r[0]} | ${r[1]} | ${r[2]} |`))
    .concat([`| 太陽の半径の比 R_src ÷ R_d・R_src ÷ R_obs | ${f3(E.diff.rsrcOverRd)}・${f3(E.diff.sunRsrc / E.diff.sunRobs)} | linked の γ は fixed の ${fe(E.diff.gammaRatio)} 倍(太陽 —— λ_J = 1) |`]).join('\n');
  // 表 10 公転面の揃いの表の作り直し(要約)
  T.alignSummary = ['| 列 | 自転 | 応答率 | 符号(惑星 水〜海 / 衛星 月・イ・エ・ガ・カ・タ・ト / 環の粒子 C 内〜A 外) | 惑星: 年齢の間の Δi の大きさ ÷ 今の角 | 惑星: Δ ln a の大きさの最大 | 衛星: Δi の大きさ ÷ 今の角 | 一次外挿が壊れる(惑星・衛星・環) |', '|---|---|---|---|---|---|---|---|']
    .concat(C.summary.map((s) => `| ${COL_LABEL[s.col]} | ${SPIN_LABEL(s.spin)} | ${RATE_LABEL[s.rate]} | ${s.sign.planets} / ${s.sign.moons} / ${s.sign.rings} | ${rg(s.fracPlanets)} | ${fe(s.dLnAPlanets && s.dLnAPlanets[1])} | ${rg(s.fracMoons)} | ${s.breaks.planets}/${s.breaks.n[0]}・${s.breaks.moons}/${s.breaks.n[1]}・${s.breaks.rings}/${s.breaks.n[2]} |`)).join('\n');
  // 表 11 組ごと(① と ② 球と ③ 緯度の応答 —— s_d = s・λ_J = 1 の fixed と linked の Δi の大きさ ÷ 今の角)
  const pick = (pair, col, spin, rate) => C.rows.find((r) => r.pair === pair && r.col === col && r.spin === spin && r.rate === rate);
  const cell = (r) => (r ? fe(r.frac) + (r.breaks ? '(壊れる)' : '') : '—');
  const pairs = [...new Set(C.rows.map((r) => r.pair))];
  T.alignPairs = ['| 組 | 赤道面からの角 [°] | ① s_d = s | ① λ_J = 1 fixed | ① λ_J = 1 linked | ② 球 s_d = s | ② 球 λ_J = 1 fixed | ③ 緯度の応答 s_d = s | ③ 緯度の応答 λ_J = 1 fixed |', '|---|---|---|---|---|---|---|---|---|']
    .concat(pairs.map((p) => { const b = C.base.find((x) => x.pair === p); return `| ${p} | ${f3(b.planeAngleDeg)} | ${cell(pick(p, 'slice', 's', 'fixed'))} | ${cell(pick(p, 'slice', 1, 'fixed'))} | ${cell(pick(p, 'slice', 1, 'linked'))} | ${cell(pick(p, 'ball', 's', 'fixed'))} | ${cell(pick(p, 'ball', 1, 'fixed'))} | ${cell(pick(p, 'latW', 's', 'fixed'))} | ${cell(pick(p, 'latW', 1, 'fixed'))} |`; })).join('\n');
  // 表 12 斜めの軌道 —— 帯を横切る所だけの寄与の割合(太陽–惑星)
  T.split = ['| 組 | 帯の中の時間の割合 | ' + J.plan.alignCols.map((c) => COL_LABEL[c] + '(帯の中の寄与の割合)').join(' | ') + ' |', '|---|---|' + J.plan.alignCols.map(() => '---|').join('')]
    .concat(C.split.map((r) => `| ${r.pair} | ${fe(r.slice.fracIn)} | ` + J.plan.alignCols.map((c) => fe(r[c].bandShare)).join(' | ') + ' |')).join('\n');
  return T;
}

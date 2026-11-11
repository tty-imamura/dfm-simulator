// 第334便a(原仮定者の整理(2026-11-11)・原仮定者の回答(2026-11-11 —— AN623・AN624)・統括の検証項目 R322): **正本 tests/out/heightlaw-w334a.json から PHYSICS〔第334便a〕の表を作る文書の lib**
// (QA docs.heightLaw334a が節の表と逐語で照合する —— 表の数は有効数字 4 桁か指数 3 桁・丸めの程度の数〔恒等式の残差・求積の収束〕は「< 1e-x」の形で書き、数そのものは載せない)。
export const DOC_VERSION = 'w334a-heightlawdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toExponential(3));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toPrecision(4));
const lt = (x, t) => (Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : '**' + fe(x) + '**');
const tf = (x) => (x === true ? '真' : x === false ? '偽' : 'null');
const qn = (q) => (Math.abs(q - 1 / 3) < 1e-12 ? '1/3' : Math.abs(q - 0.5) < 1e-12 ? '1/2' : String(q));
const SD = { obs: '観測自転 s', J: 'J 案(λ_J = 1)' };

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, D = J.dominance, H = J.heights, K = J.thickness, O = J.oblate;
  // 表 1 純関数の場面
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| ① 偶奇: 高さ則 T1・T1β・T2(切り口・球・対向 2 点)・T3 は z の奇関数・比べる列 ①②③(切り口・球・対向 2 点・lorentz・sum2)は偶関数(点 5) | ${Object.values(S.parity).filter(Boolean).length}/${Object.keys(S.parity).length} | ${tf(G.parity)} |`,
    `| ② 小さい z の極限: T1 の V/z ÷ s_d(z = 37・z = 1e3 ρ)・T2① の V/z ÷ (s_d r/ρ)(帯の内)と帯の外の値・T2② の V/z ÷ (2 s_d R_d²/(5ρ²))・T3 の V/z ÷ (β A s_d) | ${f3(S.slope.t1)}・${f3(S.slope.t1far)}・${f3(S.slope.t2slice)}・${S.slope.t2sliceOut}・${f3(S.slope.t2ball)}・${f3(S.slope.t3)} | ${tf(G.smallZ)} |`,
    `| ③ T2 の遠方の解析の形 ÷ 第333便a の求積の中心差分(r/R_d ≈ 300 —— 球・対向 2 点) | ${f3(S.t2far.ball)}・${f3(S.t2far.pair)} | ${tf(G.t2Far)} |`,
    `| ④ 赤道面: T1・T2・T3 は 0・切り口 ① は z = 0 で最大・T1 は z とともに増える(反対の向き) | ${S.equator.t1}・${S.equator.t2}・${S.equator.t3}・${tf(S.equator.sliceMaxAt0)}・${tf(S.equator.t1Increasing)} | ${tf(G.equator)} |`,
    `| ⑤ z に比例する範囲の上限 z/ρ(ρ = 1e3 R_d・許容 10%): T1・T2①・T3(H = R_d・ℓ = 4)・T2② | ${f3(S.prop.t1.zMaxOverRho)}・${fe(S.prop.t2slice.zMaxOverRho)}・${fe(S.prop.t3.zMaxOverRho)}・${f3(S.prop.t2ball.zMaxOverRho)} | ${tf(G.propRange)} |`,
    `| ⑥ 範囲の物差し: 1 つの源で D・加速度・β が 1・同じ源 2 つで 1/2・遠い大質量(D で勝ち重みで負ける)の注目の源の D の割合と加速度の割合・自己 kappaM と robs の β(質量 3770 kg・半径 1 m の受け手) | ${f3(S.dom.farD)}・${f3(S.dom.farA)}・${fe(S.dom.smallKappa)}・${f3(S.dom.smallRobs)} | ${tf(G.dominance)} |`,
    `| ⑦ 扁平の則: 軸比の則は球で R_d・q = 1/3 の実際の扁平率・体積比(10 通り)・文字どおりは f が増すと R_eq が減る・軸比は増える・f = 0 の拒否・土星(f_flat = 0.09796・q = 1)の R_eq/R_d | ${f3(S.oblate.sphere)}・${f3(S.oblate.fEff)}・${lt(Math.max(...S.oblate.vols.map((v) => Math.abs(v - 1))), 1e-12)}・${tf(S.oblate.litDecreasing)}・${tf(S.oblate.axIncreasing)}・${tf(S.oblate.rejectSphere)}・${f3(S.oblate.saturn[0])}・${f3(S.oblate.saturn[1])} | ${tf(G.oblate)} |`,
    `| ⑧ 回転楕円体の求積: R_eq = R_pol = R_d で第333便a の bodyVel との差・遠方の形との比・J 固定の遠方 ÷ 球・半径だけの遠方 ÷ (R_eq/R_d)²・点の数を 1.5 倍の差(3 点) | ${lt(Math.max(...S.spheroid.same.map((v) => Math.abs(v - 1))), 1e-12)}・${f3(S.spheroid.far)}・${f3(S.spheroid.invJ)}・${f3(S.spheroid.radOnly / S.spheroid.radOnlyExpect)}・${lt(Math.max(...S.spheroid.conv), 1e-6)} | ${tf(G.spheroid)} |`,
    `| ⑨ 厚みの対照: focus の ν_z/ν_eff(期待 1/2)・a = 0 で 1・diverge の非束縛・σ_z = 0 の厚み・shear・tilt の比 | ${f3(S.thick.focus)}・${S.thick.zeroA}・${tf(S.thick.divergeUnbound)}・${S.thick.sigma0}・${S.thick.shear}・${S.thick.tilt} | ${tf(G.thickness)} |`,
    `| ⑩ J 案: 第333便a の dragSpin の s_d と J 固定の s_d(R_eq = R_d・k_I = f_d = 2/5)の比 | ${f3(S.jcase.rel)} | ${tf(G.jCase)} |`,
    `| ⑪ 入力の拒否(ρ = 0・β > 1・列の名・H = 0・源の質量 0・W₀ < 0・文字どおりの f = 0・f = 1・則の名・楕円体の内・m = 0・型の名・ν_z = 0・NaN) | ${S.reject.filter(Boolean).length}/${S.reject.length} | ${tf(G.reject)} |`].join('\n');
  // 表 2 範囲の 2 つの物差し(太陽系)
  T.dominance = ['| 受け手(注目の源) | D の割合 | 加速度の割合 | β none | β kappaM | β robs | β none(W₀ = 宇宙の背景) | D の最大の源 | 判定(D・β none) |', '|---|---|---|---|---|---|---|---|---|',
    ...D.solar.map((r) => `| ${r.name}(${r.src}) | ${fe(r.dShare)} | ${f3(r.aShare)} | ${f3(r.beta.none)} | ${fe(r.beta.kappaM)} | ${fe(r.beta.robs)} | ${f3(r.betaCosmicW0)} | ${r.topD} | ${r.dDominant ? '内' : '外'}・${r.betaDominant.none ? '内' : '外'} |`)].join('\n');
  // 表 3 範囲の 2 つの物差し(NGC 3198)
  T.galDom = ['| 注目の源 | R [kpc] | z [kpc] | D の割合 | 加速度の割合 | β none | β kappaM | β robs | β none(W₀ = 宇宙の背景) | 判定(D・β none) |', '|---|---|---|---|---|---|---|---|---|---|',
    ...D.galaxy.filter((r) => r.zKpc === 0 || r.zKpc === 1).map((r) => `| ${r.src === 'center' ? '中心の点' : 'R の内の点の和'} | ${r.RKpc} | ${r.zKpc} | ${f3(r.dShare)} | ${f3(r.aShare)} | ${f3(r.beta.none)} | ${fe(r.beta.kappaM)} | ${fe(r.beta.robs)} | ${fe(r.betaCosmicW0)} | ${r.dDominant ? '内' : '外'}・${r.betaDominant.none ? '内' : '外'} |`)].join('\n');
  // 表 4 高さの分布(土星 B 環・NGC 3198 —— z ≥ 0)
  const pick = H.rows.filter((r) => (r.sys === 'satB' || r.sys === 'ngc3198') && r.zLabel >= 0);
  T.heights = ['| 系・s_d | z | T1 = s_d z [m/s] | T2①(切り口)[m/s] | T2②(球)[m/s] | T3(ℓ 4・H = R_d)[m/s] | ① 切り口 U₁ [m/s] | ② 球 U₂ [m/s] | ③ lorentz [m/s] | T1 ÷ ② | \\|T1\\|/c₀ | 範囲 |', '|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...pick.map((r) => `| ${r.sys === 'satB' ? '土星 B 環' : 'NGC 3198(R = 10 kpc)'}・${SD[r.sdCase]} | ${r.zLabel} ${r.zUnit} | ${fe(r.T1)} | ${fe(r.T2slice)} | ${fe(r.T2ball)} | ${fe(r.T3)} | ${fe(r.slice)} | ${fe(r.ball)} | ${fe(r.lorentz)} | ${fe(r.T1overBall)} | ${fe(r.T1overC)} | ${r.verdict} |`)].join('\n');
  // 表 5 z に比例する範囲(系 × s_d —— 小さい z の V/z と上限 ÷ R_d)
  T.ranges = ['| 系 | s_d | R_d [m] | s_d [rad/s] | β none | T1 の V/z・上限 ÷ R_d | T2① の V/z・上限 ÷ R_d | T2② の V/z・上限 ÷ ρ | T3 の V/z・上限 ÷ R_d | 範囲(D・β) |', '|---|---|---|---|---|---|---|---|---|---|',
    ...H.ranges.map((g) => `| ${g.name} | ${SD[g.sdCase]} | ${fe(g.Rd)} | ${fe(g.sd)} | ${f3(g.beta)} | ${fe(g.T1.slope0)}・${fe(g.T1.zMaxOverRd)} | ${fe(g.T2slice.slope0)}・${f3(g.T2slice.zMaxOverRd)} | ${fe(g.T2ball.slope0)}・${f3(g.T2ball.zMaxOverRho)} | ${fe(g.T3.slope0)}・${f3(g.T3.zMaxOverRd)} | ${g.inRangeD ? '内' : '外'}・${g.inRangeBeta ? '内' : '外'} |`)].join('\n');
  // 表 6 T3 の ℓ × H(土星 B 環・観測自転 —— z = 1 m と 100 m の V/z ÷ (β s_d)・上限)
  T.t3 = ['| ℓ | H | z = 1 m の V/z ÷ (β s_d) | z = 100 m の V/z ÷ (β s_d) | 比例の上限 z [m] |', '|---|---|---|---|---|',
    ...H.t3v.filter((r) => r.sys === 'satB' && r.sdCase === 'obs').map((r) => `| ${r.ell} | ${r.H === 'Rd' ? 'R_d' : 'R_obs'} | ${f3(r.at[0].overZ)} | ${fe(r.at[1].overZ)} | ${fe(r.range)} |`)].join('\n');
  // 表 7 厚みの対照(σ_z = 2 mm/s)
  T.thickness = ['| 環 | s_d | ν_z [1/s] | γ [1/s] | a = β s_d [1/s] | γa/ν_z² | H₀ = σ_z/ν_z [m] | focus の H [m] | diverge | 文献の厚み [m](種類) |', '|---|---|---|---|---|---|---|---|---|---|',
    ...K.rows.filter((r) => r.sigmaZ === 2e-3 && r.type === 'focus').map((r) => { const dv = K.rows.find((q) => q.ring === r.ring && q.sdCase === r.sdCase && q.sigmaZ === r.sigmaZ && q.type === 'diverge');
      return `| ${r.name} | ${SD[r.sdCase]} | ${fe(r.nuZ)} | ${fe(r.gamma)} | ${fe(r.a)} | ${fe(r.gammaAOverNu2)} | ${f3(r.H0)} | ${fe(r.H)} | ${dv.bound ? '束縛(H ' + fe(dv.H) + ' m)' : '束縛しない'} | ${r.Hlit === null ? '—' : r.Hlit < 1 ? fe(r.Hlit) : f3(r.Hlit)}(${r.HlitKind}) |`; })].join('\n');
  // 表 8 扁平の則(R_eq/R_d と実際の扁平率)
  const fs = [0, 0.01, 0.1, 0.3, 0.9];
  T.rules = ['| 則 | q | ' + fs.map((f) => 'f_flat = ' + f).join(' | ') + ' |', '|---|---|' + fs.map(() => '---|').join(''),
    ...J.oblate.rules.filter((r) => fs.includes(r.f)).reduce((acc, r) => { const k = r.law + '|' + r.q; if (!acc.some((a) => a.k === k)) acc.push({ k, law: r.law, q: r.q }); return acc; }, [])
      .map((a) => `| ${a.law === 'inverseF' ? '文字どおり R_d/f_flat^q' : '軸比 R_d/(1 − f_flat)^q'} | ${qn(a.q)} | ` + fs.map((f) => { const r = O.rules.find((x) => x.law === a.law && x.q === a.q && x.f === f); return r.ok ? f3(r.ReqOverRd) + '(' + f3(r.fEff) + ')' : '拒否'; }).join(' | ') + ' |')].join('\n');
  // 表 9 回転楕円体の求積(α = 2 —— 同じ物理の点で球との比)
  T.spheroid = ['| 形 f_flat(軸比 q = 1/3) | R_eq/R_d | ρ/R_eq = 1.5: J 固定・半径だけ | 2 | 10 | 100 | α = 1・1.5・3 の J 固定(ρ/R_eq = 1.5) | 高さ z = R_eq の U(z)/U(0)(ρ = 2R_eq): 楕円体・球 | T2 の型の ω_ρ ÷ 球(ρ = 2R_eq・z = R_eq) | 点の数 1.5 倍の差 |', '|---|---|---|---|---|---|---|---|---|---|',
    ...J.decl.spheroid.fShapes.map((f) => { const q = (k, a = 2) => O.quad.find((r) => r.f === f && r.alpha === a && r.rhoOverReq === k), h2 = O.heights.find((h) => h.f === f && h.rhoOverReq === 2), p1 = h2.prof.find((p) => p.zOverReq === 1), cv = O.conv.find((c) => c.f === f);
      return `| ${f} | ${f3(q(1.5).Req)} | ${f3(q(1.5).jFixedOverSphere)}・${f3(q(1.5).radiusOnlyOverSphere)} | ${f3(q(2).jFixedOverSphere)}・${f3(q(2).radiusOnlyOverSphere)} | ${f3(q(10).jFixedOverSphere)}・${f3(q(10).radiusOnlyOverSphere)} | ${f3(q(100).jFixedOverSphere)}・${f3(q(100).radiusOnlyOverSphere)} | ${[1, 1.5, 3].map((a) => f3(q(1.5, a).jFixedOverSphere)).join('・')} | ${f3(p1.spheroid)}・${f3(p1.sphere)} | ${f3(h2.t2.ratio)} | ${lt(cv.rel, 1e-10)} |`; }),
    ...O.saturnShapes.map((s) => `| 土星の ${s.law === 'inverseF' ? '文字どおり' : '軸比'} q = 1(実際の扁平率 ${f3(s.fEff)}) | ${f3(s.Req)} | ${f3(s.pts[0].jFixedOverSphere)}・${f3(s.pts[0].radiusOnlyOverSphere)} | ${f3(s.pts[1].jFixedOverSphere)}・${f3(s.pts[1].radiusOnlyOverSphere)} | ${f3(s.pts[2].jFixedOverSphere)}・${f3(s.pts[2].radiusOnlyOverSphere)} | ${f3(s.pts[3].jFixedOverSphere)}・${f3(s.pts[3].radiusOnlyOverSphere)} | — | — | — | ${lt(s.conv, 1e-10)} |`)].join('\n');
  // 表 10 天体の表(f_flat は文献の値・未照合 —— 銀河は軸比の宣言)
  T.bodies = ['| 天体 | 質量 [kg] | R_d = Y_k m [m] | f_flat | 文字どおり q = 1 の 2R_d,eq [m] | 軸比 q = 1 の 2R_d,eq [m] | 軸比 q = 1/3 の 2R_d,eq [m] | J 固定の s_d ÷ 球(軸比 q = 1) |', '|---|---|---|---|---|---|---|---|',
    ...O.bodies.map((b) => `| ${b.name} | ${fe(b.m)} | ${fe(b.Rd)} | ${b.f}${b.fSrc === 'decl' ? '(宣言)' : ''} | ${b.inverseF['1'] ? fe(b.inverseF['1'].twoReq) : '拒否(f_flat = 0)'} | ${fe(b.axisRatio['1'].twoReq)} | ${fe(b.axisRatio[String(1 / 3)].twoReq)} | ${f3(b.sdJFixedOverSphere)} |`)].join('\n');
  // 表 11 土星の主な環の典型の厚みとの比(独立な一致の数は 1)
  const RC = O.ringCompare;
  T.ringCompare = ['| 則 | q | 2R_d,eq [m] | ÷ 典型の厚み ' + RC.H + ' m |', '|---|---|---|---|', `| 球(R_d) | — | ${f3(RC.sphere.twoRd)} | ${f3(RC.sphere.overH)} |`,
    ...RC.rows.map((r) => `| ${r.law === 'inverseF' ? '文字どおり' : '軸比'} | ${qn(r.q)} | ${f3(r.twoReq)} | ${f3(r.overH)} |`), `| 独立な一致の数(主な環 4 本は同じ総説の典型の値) | — | — | ${RC.independentCount} |`].join('\n');
  return T;
}

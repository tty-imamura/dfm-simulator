// 第333便d(原仮定者の整理(2026-11-10)・原仮定者の回答(2026-11-10 —— AN608)・統括の検証項目 R320): **正本 tests/out/noncirc-w333d.json から PHYSICS〔第333便d〕の表を作る文書の lib**
// (QA docs.nonCirc333d が節の表と逐語で照合する —— 表の数は有効数字 4 桁か指数 3 桁・丸めの程度の数〔恒等式の残差・解析と差分の差〕は「< 1e-10」の形で書き、数そのものは載せない)。
export const DOC_VERSION = 'w333d-noncircdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toExponential(3));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toPrecision(4));
const lt = (x, t) => (Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : '**' + fe(x) + '**');
const tf = (x) => (x === true ? '真' : x === false ? '偽' : 'null');
const kms = (v) => (v === null || v === undefined || !Number.isFinite(v) ? '—' : f3(v / 1e3));   // m/s → km s⁻¹ の数(単位は見出しに)
const pc = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Math.abs(x) < 5e-5 ? '0.00%' : (100 * x).toFixed(2) + '%');
const sm10 = (x) => (Number.isFinite(x) && Math.abs(x) <= 1e-10 ? '< 1e-10' : f3(x));   // 円軌道の族の丸めの桁(数そのものは載せない)
const KMSKPC = 1e3 / 3.0856775814913673e19;
export const COMBO_LABEL = Object.freeze({ 'a2|none|field': 'α = 2・s_d 0・場の読み(主)', 'a2|none|selfRd': 'α = 2・s_d 0・自己 R_d = Y_k m', 'a2|sync|field': 'α = 2・s_d = Ω(sync)・場の読み',
  'a1|none|field': 'α = 1・s_d 0・場の読み', 'a1|sync|field': 'α = 1・s_d = Ω(sync)・場の読み' });
const famLabel = (k) => { const p = k.split('|'); return p[0] === 'circ' ? '円軌道' : p[0] === 'random' ? '位相を乱す ε ' + p[1] + '・種 ' + p[2].slice(1) : p[0] === 'kin' ? '位相を揃える kin ε ' + p[1] : '位相を揃える pattern ε ' + p[1] + '・Ω_p ' + p[2]; };

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, F = J.fam.families, d = J.fam.decl, main = J.plan.combos[0].key;
  // 表 1 純関数の場面
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| ① 位置の式と速度・加速度(厳密な時間微分)の中心差分の相対の差・極座標の成分 | ${lt(S.orbitDeriv.v, 1e-8)}・${lt(S.orbitDeriv.a, 1e-8)}・${lt(S.orbitDeriv.polar, 1e-10)} | ${tf(G.orbitDeriv)} |`,
    `| ② 角運動量 R²φ̇ の一次の保存: 残り ÷ ε²(ε = 1e-3)・ε を半分にした比 | ${f3(S.angMom.overEps2)}・${f3(S.angMom.ratio)} | ${tf(G.angMom)} |`,
    `| ③ 閉じたケプラー楕円ではない: 動径の 1 周期の間の方位の進み − 2π(ν = √2 Ω のロゼット / ν = Ω) | ${f3(S.notKepler.rosette.dphi)} rad / ${lt(S.notKepler.kepler.dphi, 1e-10)} | ${tf(G.notKepler)} |`,
    `| ④ 円軌道の族: 半径 = 案内中心・v_R = 0・v_φ = Ω R_g の相対の差・質量の和 | ${lt(S.circFamily.maxRel, 1e-10)}・${lt(S.circFamily.mass, 1e-10)}(点 ${S.circFamily.n}) | ${tf(G.circFamily)} |`,
    `| ⑤ 位相を揃えた族 kin: 動径の変位の m = 2 の主軸 − 腕の向き φ_arm(R_g)・random の族の種(同じ種で同じ列・違う種で違う列)・乱数の cos の平均(2 万回) | ${lt(S.alignPhase.maxPhaseErr, 1e-10)}・${tf(S.alignPhase.seedSame)}・${tf(S.alignPhase.seedDiff)}・${f3(S.alignPhase.meanCos)} | ${tf(G.alignPhase)} |`,
    `| ⑥ pattern の族: パターンの枠で ψ − 2(φ_g − Ω_p t − φ_arm) が時刻に依らない・共回転の近くの環(2Ω/|ν| > ${J.decl.yCap})の数 = 期待 | ${lt(S.patternFrame.maxPhaseErr, 1e-8)}・${S.patternFrame.dropped} = ${S.patternFrame.expDrop} | ${tf(G.patternFrame)} |`,
    `| ⑦ fieldDot の u と第332便b の frameField(座標変換の回転 —— 呼ぶだけ)の差・∂_t u と源を軌道の上で動かした中心差分の相対の差(核 2 × 軟化 × 自己 —— ${S.fieldDotFD.rows.length} 組) | ${lt(S.fieldDotFD.uMax, 1e-10)}・${fe(S.fieldDotFD.fdMax)} | ${tf(G.fieldDotFD)} |`,
    `| ⑧ 1 つの源(等速・自転 0): ∂_t u・u − 源の速度 | ${lt(S.oneSource.dudt, 1e-10)}・${lt(S.oneSource.u, 1e-10)} | ${tf(G.oneSource)} |`,
    `| ⑨ 剛体の回転(全部の環が同じ Ω₀): ∂_t u と Ω₀ ẑ × u − Ω₀ J (ẑ × p) の相対の差(受け手 3 × 核 2) | ${lt(S.rigidRotation.maxRel, 1e-10)} | ${tf(G.rigidRotation)} |`,
    `| ⑩ Fourier の m = 2(質量 1 + a cos 2(φ − θ) の環): 振幅 − a/2・主軸 − θ・帯の読みの振幅・分散・J の流れ | ${lt(S.fourier.amp, 1e-10)}・${lt(S.fourier.phase, 1e-10)}・${lt(S.fourier.annA2, 1e-10)}・${lt(S.fourier.annSigma, 1e-10)}・${lt(S.fourier.annJ, 1e-10)} | ${tf(G.fourier)} |`,
    `| ⑪ 入力の拒否(種・半径 0・ν = 0・K = 1・知らない族・ε = 0・Ω_p なし・知らない自転の型・受け手と源の一致・源なし・p = 3・空の Fourier) | ${S.reject.n}/${S.reject.of} | ${tf(G.reject)} |`].join('\n');
  // 表 2 円盤の宣言・`κ_epi`/Ω・共鳴の半径
  const R = J.res, sm = (a) => (a.length ? a.map((x) => f3(x)).join('・') : '—');
  T.disk = ['| 量 | 値 |', '|---|---|',
    `| 円盤(主の離散化): 環の間隔 ${d.dR} kpc・方位の点 ${d.K}・点の数(中心を含む) | ${d.n} |`,
    `| 中心の点の質量・円盤の質量 [M☉] | ${fe(d.McMsun)}・${fe(d.MdiskMsun)} |`,
    `| 中心の引きずり自転 s_d,c = v_obs(R_c)/R_c [km s⁻¹ kpc⁻¹] | ${f3(d.OmegaC / KMSKPC)} |`,
    `| \`κ_epi\`/Ω の最小・中央値・最大(環 ${d.ringsKpc.length} —— ν = \`κ_epi\` の軌道は閉じない) | ${f3(R.kappaOverOmega.min)}・${f3(R.kappaOverOmega.median)}・${f3(R.kappaOverOmega.max)} |`,
    `| kin の族のパターンの局所の速さ Ω − \`κ_epi\`/2 の範囲 [km s⁻¹ kpc⁻¹] | ${f3(Math.min(...R.implied.OmegaMinusHalfKappaKms))}〜${f3(Math.max(...R.implied.OmegaMinusHalfKappaKms))} |`,
    ...R.grid.map((g) => `| Ω_p = ${g.OmegaP} km s⁻¹ kpc⁻¹: ILR・CR・OLR の半径 [kpc](第330便b の resonanceRadii —— 表の範囲 ${g.rangeKpc[0]}〜${g.rangeKpc[1]} kpc)/pattern の族で X = 0 にした環 | ${sm(g.ILR)}・${sm(g.CR)}・${sm(g.OLR)} / ${F['pattern|0.1|' + g.OmegaP].dropped}(${F['pattern|0.1|' + g.OmegaP].droppedKpc.length ? f3(Math.min(...F['pattern|0.1|' + g.OmegaP].droppedKpc)) + '〜' + f3(Math.max(...F['pattern|0.1|' + g.OmegaP].droppedKpc)) + ' kpc' : '—'}) |`)].join('\n');
  // 表 3 族ごとの要約(主の組)
  const C0 = F.circ.combos[main].summary;
  T.families = ['| 族 | 密度の m = 2 | U_φ の m = 2 ÷ 平均 | σ_R ÷ v_obs | U と密度の m = 2 の位相差 [rad] | \\|∂U/∂t\\| ÷ \\|(v·∇)U\\| | \\|∂U/∂t\\| ÷ 定常の輸送 | J の流れ Σ(m R v_φ v_R/ΔR) ÷ Σ(m ⟨v_φ⟩² R/ΔR) | トルクの和 ÷ 円軌道 | 仕事の和 ÷ 円軌道 |', '|---|---|---|---|---|---|---|---|---|---|',
    ...Object.keys(F).filter((k) => !/\|s[23]$/.test(k)).map((k) => { const s = F[k].combos[main].summary;
      return `| ${famLabel(k)} | ${sm10(s.A2)} | ${sm10(s.uPhiA2)} | ${sm10(s.sigmaROverV)} | ${f3(s.phaseLag)} | ${f3(s.dudtOverConv)} | ${f3(s.dudtOverSteady)} | ${Math.abs(s.jFluxNorm) <= 1e-10 ? '< 1e-10' : fe(s.jFluxNorm)} | ${f3(s.torqueSum / C0.torqueSum)} | ${f3(s.workSum / C0.workSum)} |`; })].join('\n');
  // 表 4 腕と分散の切り分け(組 × ε)
  const ops = J.plan.omegaPKms;
  T.compare = ['| 組 | ε | 分散 (b − a)/a | 種のばらつき/a | 腕 kin (c − b)/a(÷ ばらつき) | 腕 pattern Ω_p ' + ops.join('・') + ' (c − b)/a(÷ ばらつき) | 分散 ÷ (v_obs − v_bar) | 腕 kin ÷ (v_obs − v_bar) | max \\|c − a\\|/a(kin) |', '|---|---|---|---|---|---|---|---|---|',
    ...J.cmp.rows.map((r) => `| ${COMBO_LABEL[r.combo]} | ${r.amp} | ${pc(r.dispOverCirc)} | ${pc(r.seedScatterOverCirc)} | ${pc(r.arms.kin.armOverCirc)}(${f3(r.arms.kin.armOverScatter)}) | ${ops.map((o) => pc(r.arms['pattern|' + o].armOverCirc) + '(' + f3(r.arms['pattern|' + o].armOverScatter) + ')').join('・')} | ${pc(r.dispOverNeed)} | ${pc(r.arms.kin.armOverNeed)} | ${pc(r.arms.kin.maxAbsTotOverCirc)} |`)].join('\n');
  // 表 5 半径ごとの読み(主の組)
  const pick = [5, 10, 15, 20, 25], idx = (Rk) => d.ringsKpc.findIndex((x) => Math.abs(x - Rk) < 1e-9), A = (k) => F[k].annuli;
  T.profile = ['| R [kpc] | 円軌道の ⟨U_φ⟩ [km s⁻¹] | v_obs − v_bar [km s⁻¹] | (random ε 0.1 種 1 − 円)/円 | (kin ε 0.1 − 円)/円 | (pattern ε 0.1 Ω_p 10 − 円)/円 | 密度の m = 2(kin ε 0.1) | \\|∂U/∂t\\| ÷ \\|(v·∇)U\\|(円・kin ε 0.1) | ⟨½∇×U⟩ 円 [km s⁻¹ kpc⁻¹] |', '|---|---|---|---|---|---|---|---|---|',
    ...pick.map((Rk) => { const i = idx(Rk), c = A('circ')[i], rr = A('random|0.1|s1')[i], kn = A('kin|0.1')[i], pt = A('pattern|0.1|10')[i];
      return `| ${Rk} | ${kms(c.uPhiMean)} | ${kms(d.vObs[i] - d.vBar[i])} | ${pc((rr.uPhiMean - c.uPhiMean) / c.uPhiMean)} | ${pc((kn.uPhiMean - c.uPhiMean) / c.uPhiMean)} | ${pc((pt.uPhiMean - c.uPhiMean) / c.uPhiMean)} | ${f3(kn.A2)} | ${f3(c.dudtOverConv)}・${f3(kn.dudtOverConv)} | ${f3(c.vortHalfMean / KMSKPC)} |`; })].join('\n');
  // 表 6 組ごとの場の大きさ(円軌道・R = 10 kpc)と源の分
  const i10 = idx(10);
  T.combos = ['| 組 | 円軌道の ⟨U_φ⟩(R = 10 kpc)[km s⁻¹] | ÷ v_obs | 源の分 W_src/W(中央値) |', '|---|---|---|---|',
    ...J.plan.combos.map((c) => { const s = F.circ.combos[c.key]; return `| ${COMBO_LABEL[c.key]} | ${kms(s.uPhiMean[i10])} | ${fe(s.uPhiMean[i10] / d.vObs[i10])} | ${fe(s.summary.shareSrc)} |`; })].join('\n');
  // 表 7 離散化の依存
  T.disc = ['| 間隔 [kpc]・方位 | \\|∂U/∂t\\| ÷ \\|(v·∇)U\\| 円・random・kin・pattern | 密度の m = 2 random・kin | 腕 kin (kin − random)/円 at 5・10・20 kpc | 分散 (random − 円)/円 at 5・10・20 kpc |', '|---|---|---|---|---|',
    ...J.disc.map((r) => { const fk = Object.keys(r.families), sv = (k) => r.families[k].summary;
      return `| ${r.dR}・${r.K} | ${fk.map((k) => f3(sv(k).dudtOverConv)).join('・')} | ${f3(sv(fk[1]).A2)}・${f3(sv(fk[2]).A2)} | ${r.armKinOverCirc.map(pc).join('・')} | ${r.dispOverCirc.map(pc).join('・')} |`; })].join('\n');
  // 表 8 ∂U/∂t の中心差分の照らし
  T.fd = ['| 量 | 値 |', '|---|---|', `| 刻み h [s](= ${J.plan.hFrac} ÷ 最大の率 ${fe(J.fd.rateMax)} rad/s) | ${fe(J.fd.hSec)} |`,
    `| 解析の ∂U/∂t と中心差分(h・h/2)の差 ÷ max(\\|∂U/∂t\\|, \\|U\\| Ω) の最大(${J.fd.rows.length} 組 × 受け手 ${J.fd.rows[0].receivers}) | ${fe(J.fd.maxRelH)}・${fe(J.fd.maxRelH2)} |`].join('\n');
  return T;
}

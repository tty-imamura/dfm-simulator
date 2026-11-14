// 第337便a(原仮定者の指示(2026-11-14 —— 第138報)・統括の検証項目 R337): **正本 tests/out/supply-337a.json から PHYSICS〔第337便a〕の表を作る文書の lib**
// (QA docs.supply337a が節の表と逐語で照合する —— 表の数は有効数字 4 桁・丸めの程度の数は「< 1e-12」の形で書き、数そのものは載せない)。この lib は何も import しない。
export const DOC_VERSION = 'w337a-supplydoc-1';
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toPrecision(4));
const f2 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(2));
const lt = (x, t) => (Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : '**' + Number(x).toExponential(3) + '**');
const tf = (x) => (x === true ? '真' : x === false ? '偽' : 'null');
const sg = (x) => (x > 0 ? '+' : x < 0 ? '−' : '0');
/** 天体の名(表の見出し —— 鍵は値で持つ) */
const NAME = new Map([['sun', '太陽'], ['mercury', '水星'], ['venus', '金星'], ['earth', '地球'], ['moon', '月'], ['mars', '火星'], ['jupiter', '木星'], ['io', 'イオ'], ['europa', 'エウロパ'],
  ['ganymede', 'ガニメデ'], ['callisto', 'カリスト'], ['saturn', '土星'], ['titan', 'タイタン'], ['uranus', '天王星'], ['neptune', '海王星'], ['triton', 'トリトン'], ['ecl', '黄道の北極'], ['inv', '不変面の北極'],
  ['sunJup', '太陽(太陽–木星の行)'], ['earthMoon', '地球(地球–月の行)'], ['jupIo', '木星(木星–イオの行)'], ['satRingB', '土星(土星–B 環の行)'],
  ['sunSpin', '太陽の自転'], ['planetOrbit', '惑星の公転(太陽に対して)'], ['planetSpin', '惑星の自転'], ['moonOrbit', '衛星の公転(主星に対して)'], ['moonSpin', '衛星の自転']]);
const nm = (k) => NAME.get(k) || k;
const RD = { orbit: '公転 Ω(対照)', vortInertial: '慣性系の渦度 −B', shearCorot: '共回転系のずれ −A', epicycle: '周転円 −ν_ep', dfmRigid: '剛体の場 −B − s_field(s_field = Ω)' };
const CV = { flat: '平坦', kepler: 'ケプラー', rigid: '剛体', oort: 'オールトの量' };
const KN = { lm: 'M', lr: 'R', lp: '主星までの距離', lmp: '主星の質量' };
const knobsTxt = (k) => (k.length ? k.map((q) => KN[q]).join(' + ') : '定数だけ');

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, T1 = J.t1, T2 = J.t2, T3 = J.t3, T4 = J.t4, T5 = J.t5;
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| ① 回転曲線の量: A − B = Ω(3 型 + オールト)・平坦の ζ_in・ζ_co・ν_ep(1・−1・√2)・ケプラーの ν_ep(1)・剛体の ζ_co・ν_ep(0・2) | ${lt(S.rates.sumAB, 1e-12)}・${f3(S.rates.flat.zetaIn)}・${f3(S.rates.flat.zetaCo)}・${f3(S.rates.flat.nuEp)}・${f3(S.rates.kepler.nuEp)}・${f3(S.rates.rigid.zetaCo)}・${f3(S.rates.rigid.nuEp)} | ${tf(G.rates)} |`,
    `| ② DFM の読み: s_field = −B で 0・s_field = Ω で共回転系のずれと同じ・s_field = 0 で慣性系の渦度と同じ・閾値の 1.01 倍で逆回転・0.99 倍で順回転 | ${lt(Math.abs(S.dfm.atThreshold), 1e-12)}・${lt(S.dfm.atOmega, 1e-12)}・${lt(S.dfm.atZero, 1e-12)}・${tf(S.dfm.retroAbove)}・${tf(S.dfm.progBelow)} | ${tf(G.dfm)} |`,
    `| ③ 傾き: θ = 60° の射影と合成の大きさ・θ = 0°・90° の合成 | ${f3(S.tilt.t60.cos)}・${f3(S.tilt.t60.sumOverOne)}・${f3(S.tilt.t0.sumOverOne)}・${f3(S.tilt.t90.sumOverOne)} | ${tf(G.tilt)} |`,
    `| ④ 射影: 軸が L̂ と 120° のとき逆回転の読み・順回転の読み・逆向きからの角 | ${f3(S.project.retro)}・${f3(S.project.prog)}・${f3(S.project.angle)}° | ${tf(G.project)} |`,
    `| ⑤ 駆動 + 減衰(I 2・Γ_d 0.5・N_in 3・ω_eff −0.3・s₀ 1・t_off 12): 閉じた式との差 ÷ max\\|s\\|・収支の残り・OFF の 1 τ 後の比(e^{−1} との差)・s* | ${lt(S.ode.errRel, 1e-9)}・${lt(S.ode.ledgerRel, 1e-10)}・${lt(Math.abs(S.ode.decay1 - S.ode.decay1Expect), 1e-9)}・${f3(S.ode.sStar)} | ${tf(G.ode)} |`,
    `| ⑥ 受動の型(N_in = 0): s* = ω_eff・十分な時間の後の s | ${f3(S.passive.sStar)}・${f3(S.passive.sEnd)} | ${tf(G.passive)} |`,
    `| ⑦ 天体の帳簿(I 10・s 2・ω_eff 0.1・H 7.22): 定常の収支・Γ_d の上限・τ の下限・年齢の窓 | ${lt(S.budget.steadyRel, 1e-12)}・${f3(S.budget.GdMax)}・${f3(S.budget.tauMinS)}・${f3(S.budget.window)} | ${tf(G.budget)} |`,
    `| ⑧ 雲: 合う R_c で L_c/L_now・L_c・収縮の自転の増え方 | ${f3(S.cloud.ratioAtMatch)}・${f3(S.cloud.Lc)}・${f3(S.cloud.collapse.spinUp)} | ${tf(G.cloud)} |`,
    `| ⑨ 最小二乗: 合成の冪の則の係数(0.7・1.5・−2)・残差・1 つ抜きの残差 | ${S.fit.coef.map(f3).join('・')}・${lt(S.fit.maxAbs, 1e-10)}・${lt(S.fit.looMax, 1e-9)} | ${tf(G.fit)} |`,
    `| ⑩ ずれの熱: 半径 2 倍で s と熱の比 | ${f3(S.shear.s)}・${f3(S.shear.heatRel)} | ${tf(G.shear)} |`,
    `| ⑪ 入力の拒否 | ${S.reject.n}/${S.reject.of} | ${tf(G.reject)} |`].join('\n');
  T.rates = ['| 回転曲線 | A [rad/s] | B [rad/s] | Ω = A − B [rad/s] | ζ_in = −2B | ζ_co = −2A | ν_ep | DFM の読みが逆回転になる s_field の下限 −B(÷ Ω) |', '|---|---|---|---|---|---|---|---|',
    ...T1.rates.map((r) => { const d = T1.dfm.find((q) => q.curve === r.curve); return `| ${CV[r.curve]} | ${f3(r.A)} | ${f3(r.B)} | ${f3(r.Omega)} | ${f3(r.zetaIn)} | ${f3(r.zetaCo)} | ${f3(r.nuEp)} | ${f3(d.threshold)}(${f3(d.thresholdOverOmega)}) |`; })].join('\n');
  T.geom = ['| 軸 x̂ | L̂·x̂ | 逆向き(−L̂)からの角 [deg] | 順回転の読みの射影の符号 | 逆回転の読みの射影の符号 |', '|---|---|---|---|---|',
    ...T1.geom.map((g) => `| ${nm(g.key)} | ${f3(g.LdotX)} | ${f2(g.angleFromAntiDeg)} | ${sg(g.LdotX)} | ${sg(-g.LdotX)} |`)].join('\n');
  const main = T1.readings.filter((q) => q.curve === 'oort'), cols = ['ecl', 'sun', 'earth', 'mars', 'jupiter', 'venus', 'io'];
  T.readings = ['| 読み(オールトの量) | ω [rad/s] | 向き | 黄道の北極への成分 [rad/s] | ' + cols.slice(1).map((k) => nm(k) + ' ω·ŝ/s').join(' | ') + ' |', '|---|---|---|---|' + cols.slice(1).map(() => '---|').join(''),
    ...main.map((q) => `| ${RD[q.reading]} | ${f3(q.omega)} | ${q.omega === 0 ? '0' : q.retro ? '逆' : '順'} | ${f3(q.proj.find((p) => p.key === 'ecl').comp)} | ${cols.slice(1).map((k) => f3(q.proj.find((p) => p.key === k).overS)).join(' | ')} |`)].join('\n');
  T.signs = ['| 回転曲線 | ' + Object.values(RD).join(' | ') + ' |', '|---|' + Object.keys(RD).map(() => '---|').join(''),
    ...Object.keys(CV).map((c) => `| ${CV[c]} | ${Object.keys(RD).map((rd) => { const q = T1.readings.find((x) => x.curve === c && x.reading === rd), ps = q.proj.find((p) => p.key === 'sun').sign; return (q.omega === 0 ? '0' : q.retro ? '逆' : '順') + '・太陽 ' + sg(ps); }).join(' | ')} |`)].join('\n');
  T.dfm = ['| 回転曲線 | ' + T1.dfm[0].rows.map((r) => (r.label === 'sdJ' ? 's_field = s_d(J 等価)' : 's_field = ' + r.label + ' Ω')).join(' | ') + ' |', '|---|' + T1.dfm[0].rows.map(() => '---|').join(''),
    ...T1.dfm.map((d) => `| ${CV[d.curve]} | ${d.rows.map((r) => `${f3(r.omega)}(${r.omega === 0 ? '0' : r.retro ? '逆' : '順'}・太陽 ${sg(r.sunComp)})`).join(' | ')} |`)].join('\n');
  T.tilt = ['| θ(逆向きからの傾き)[deg] | 射影 cos θ | 2 つの角速度のなす角 [deg] | 同じ大きさの 2 つの合成 ÷ 1 つ(2 sin(θ/2)) | 区分 |', '|---|---|---|---|---|',
    ...T1.tilt.map((r) => `| ${r.thetaDeg} | ${f3(r.cos)} | ${r.betweenDeg} | ${f3(r.sumOverOne)} | ${r.kind === 'boundary' ? '境目' : r.kind === 'lower' ? '減る' : '増える'} |`),
    ...T1.tiltGeom.map((g) => `| ${f2(g.thetaDeg)}(本の時刻の ${nm(g.key)}) | ${f3(g.row.cos)} | ${f2(g.row.betweenDeg)} | ${f3(g.row.sumOverOne)} | ${g.row.kind === 'boundary' ? '境目' : g.row.kind === 'lower' ? '減る' : '増える'} |`)].join('\n');
  T.control = ['| 受け手 | ŝ·L̂(本便) | ŝ·L̂(第335便b) | 公転 Ω の読みの ω·ŝ/s(本便 —— 平坦の曲線) | 第335便b の場の読み `rotation` の parOverS | 相対の差 |', '|---|---|---|---|---|---|',
    ...T1.control.map((c) => `| ${nm(c.key)} | ${f3(c.sHatDotL)} | ${f3(c.refSHatDotL)} | ${f3(c.parOverS)} | ${f3(c.ref)} | ${lt(c.rel, 1e-12)} |`)].join('\n');
  T.lnow = ['| 成分(本の時刻) | \\|L\\| [kg m² s⁻¹] | ÷ \\|L_now\\| |', '|---|---|---|', ...T2.comps.map((c) => `| ${nm(c.key)} | ${f3(c.mag)} | ${f3(c.share)} |`),
    `| 合計(ベクトルの和)L_now | ${f3(T2.Lnow)} | 1 |`, `| 太陽系の質量 M(16 体の和)[kg] | ${f3(T2.M)} | — |`].join('\n');
  T.cloud = ['| 回転曲線・読み | \\|ω₀\\| [rad/s] | 合う R_c [AU] | 合う R_c [pc] | 合う密度 [kg m⁻³] | 太陽だけの L で合う R_c [AU] | 太陽の半径の比 R_c/R☉ | 収縮の自転の増え方(I s = 一定) | 今の太陽の s ÷ \\|ω₀\\| |', '|---|---|---|---|---|---|---|---|---|',
    ...T2.rows.map((r) => `| ${CV[r.curve]}・${RD[r.reading]} | ${f3(r.omega0)} | ${f3(r.RcMatchAU)} | ${f3(r.RcMatchPc)} | ${f3(r.rhoMatch)} | ${f3(r.sunRcMatchAU)} | ${f3(r.sunRadiusRatio)} | ${f3(r.sunSpinUp)} | ${f3(r.sunSpinUpObs)} |`)].join('\n');
  const mainRd = T2.gridRows[0].ratios.map((q) => q.reading);
  T.cloudGrid = ['| R_c(格子)| 密度 [kg m⁻³] | ' + mainRd.map((r) => 'L_c/L_now ' + RD[r]).join(' | ') + ' |', '|---|---|' + mainRd.map(() => '---|').join(''),
    ...T2.gridRows.map((g) => `| ${g.label} | ${f3(g.rho)} | ${g.ratios.map((q) => f3(q.ratio)).join(' | ')} |`)].join('\n');
  T.core = ['| 分子雲のコアの速度の傾き(文献の目安・未照合)[km s⁻¹ pc⁻¹] | ω₀ [rad/s] | L_now に合う R_c [AU] | 同 [pc] |', '|---|---|---|---|',
    ...T2.core.map((c) => `| ${c.gradKmsPc} | ${f3(c.omega0)} | ${f3(c.RcMatchAU)} | ${f3(c.RcMatchPc)} |`), `| (文献のコアの半径の目安 ${T2.coreRPc.join('〜')} pc) | — | — | — |`].join('\n');
  const O = T3.ode;
  T.ode = ['| 量 | 値 |', '|---|---|', `| 無次元の 1 本(I 1・Γ_d 1・s* 1・ω_eff ${O.p.wEff}・s₀ ${O.p.s0}・OFF ${O.p.tOff} τ・終わり ${J.decl.ode.tEndOverTau} τ・步 ${J.decl.ode.steps}): 閉じた式との差 ÷ max\\|s\\| | ${lt(O.errRel, 1e-9)} |`,
    `| 収支の残り \\|W_in + W_field − Q − ΔE\\| ÷ 最大の項 | ${lt(O.ledgerRel, 1e-10)} |`, `| W_in・W_field・Q・ΔE | ${f3(O.Win)}・${f3(O.Wfield)}・${f3(O.Q)}・${f3(O.dE)} |`,
    `| 供給 OFF の時の s(数値 / 閉じた式) | ${f3(O.sOff)} / ${f3(O.sOffClosed)} |`, `| OFF の 1 τ 後の (s − ω_eff) の比(数値 / e^{−1}) | ${f3(O.decay1)} / ${f3(O.decay1Expect)} |`,
    `| 終わり(OFF の ${J.decl.ode.tEndOverTau - J.decl.ode.tOffOverTau} τ 後)の s(数値 / 閉じた式 —— ω_eff へ漸減) | ${f3(O.sEnd)} / ${f3(O.sEndClosed)} |`].join('\n');
  const allB = [...T3.rows, ...T3.listed];
  T.budget = ['| 天体 | I [kg m²] | s [rad/s] | ω_eff/s(主の読み) | E_spin [J] | 観測の熱 H [W] | Γ_d の上限 H/(s − ω_eff)² [N m s] | τ の下限 [年] | τ の下限 ÷ 年齢 | 要る N_in [N m] | 供給の仕事率 N_in s [W] | 年齢の Γ_d の下限 I/t_age | 窓の比(上限 ÷ 下限) | OFF の後の半減 [年] |', '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...allB.map((r) => `| ${nm(r.key)}${T3.listed.includes(r) ? '(並べるだけ)' : ''} | ${f3(r.I)} | ${f3(r.s)} | ${f3(r.wEffOverS)} | ${f3(r.Espin)} | ${f3(r.H)} | ${f3(r.GdMax)} | ${f3(r.tauMinYr)} | ${f3(r.tauMinOverAge)} | ${f3(r.NinReq)} | ${f3(r.Pin)} | ${f3(r.GdMinAge)} | ${f3(r.window)} | ${f3(r.halfAfterOffYr)} |`)].join('\n');
  T.weff = ['| 天体 | ' + allB[0].wAll.map((w) => CV[w.curve] + '・' + RD[w.reading]).join(' | ') + ' |', '|---|' + allB[0].wAll.map(() => '---|').join(''),
    ...allB.map((r) => `| ${nm(r.key)} | ${r.wAll.map((w) => f3(w.wEffOverS)).join(' | ')} |`)].join('\n');
  T.imbalance = ['| 天体 | 観測の自転の変化 \\|ṡ\\| [rad/s²](文献の値・未照合) | トルク I\\|ṡ\\| [N m] | ÷ 熱の上限で要る N_in | s/\\|ṡ\\| [年] |', '|---|---|---|---|---|',
    ...allB.filter((r) => r.imbalance).map((r) => `| ${nm(r.key)}(${r.sdotSrc === 'earthLod' ? '一日の長さの伸び —— 永年' : '自転の周期のゆらぎの桁 —— 永年の変化ではない'}) | ${f3(Math.abs(r.sdot))} | ${f3(r.imbalance.torque)} | ${f3(r.imbalance.overNin)} | ${f3(r.imbalance.tauObsYr)} |`)].join('\n');
  T.passive = ['| 第335便b の供給の行 | 目標の ŝ 成分 ÷ s(本便) | 同(第335便b) | (ω_eff − s)·ŝ/s(本便) | 同(第335便b) | 受動で供給できるか(本便 / 第335便b) | 相対の差 | 第335便b の供給なしの減衰の時間 [年] |', '|---|---|---|---|---|---|---|---|',
    ...T3.passive.map((p) => `| ${nm(p.key)} | ${f3(p.targetParOverS)} | ${f3(p.refTarget)} | ${f3(p.gapOverS)} | ${f3(p.refGap)} | ${tf(p.feasible)} / ${tf(p.refFeasible)} | ${lt(p.rel, 1e-12)} | ${f3(p.noSupplyYr335b)} |`)].join('\n');
  T.fit = ['| ノブ(log10 \\|s\\| の説明の変数)| 係数(定数・各ノブ) | 主の組の rms [dex] | 主の組の最大 [dex] | 満たせた(\\|Δ\\| ≤ 0.3) | 1 つ抜きの満たせた・rms [dex] | 自由度 |', '|---|---|---|---|---|---|---|',
    ...T4.steps.map((s) => `| ${knobsTxt(s.knobs)} | ${s.coef.map(f3).join('・')} | ${f3(s.rms)} | ${f3(s.maxAbs)} | ${s.nOk}/${s.nFit} | ${s.loo.nOk}/${s.loo.n}${s.loo.nSingular ? '(特異 ' + s.loo.nSingular + ')' : ''}・${f3(s.loo.rms)} | ${s.dof} |`)].join('\n');
  const keys = T4.rows.map((r) => r.key);
  T.fitRows = ['| 天体 | 組 | log10 \\|s\\| | 向き(不変面) | s/√(GM/R³) | ' + T4.steps.map((s) => knobsTxt(s.knobs)).join(' | ') + ' | 1 つ抜き(M + R + 距離) |', '|---|---|---|---|---|' + T4.steps.map(() => '---|').join('') + '---|',
    ...keys.map((k) => { const r = T4.rows.find((q) => q.key === k), inMain = T4.steps[0].rows.find((q) => q.key === k).inFit, lo = T4.steps[3].loo.rows.find((q) => q.key === k);
      return `| ${nm(k)} | ${inMain ? '主' : J.plan.fitOut.includes(k) ? '外れ(潮汐の候補)' : '持ち出し'} | ${f3(r.y)} | ${r.sign > 0 ? '順' : '逆'} | ${f3(r.breakup)} | ${T4.steps.map((s) => { const q = s.rows.find((x) => x.key === k); return f3(q.res) + (q.ok ? '' : ' ✗'); }).join(' | ')} | ${lo ? f3(lo.res) + (lo.ok ? '' : ' ✗') : '—'} |`; })].join('\n');
  T.fitAll = ['| ノブ(水星・金星も主の組に入れた対照) | 係数 | rms [dex] | 満たせた |', '|---|---|---|---|', ...T4.stepsAll.map((s) => `| ${knobsTxt(s.knobs)} | ${s.coef.map(f3).join('・')} | ${f3(s.rms)} | ${s.nOk}/${s.nFit} |`)].join('\n');
  const br = T4.breakup;
  T.breakup = ['| 型 | 係数 c₀(log10 s = c₀ + log10 √(GM/R³)) | 主の組の rms [dex] | 満たせた | イオの残差 [dex] |', '|---|---|---|---|---|',
    `| 破断の型(質量と半径の次数を 1/2・−3/2 に固定) | ${f3(br.coef[0])} | ${f3(br.rms)} | ${br.nOk}/${br.nFit} | ${f3(br.rows.find((r) => r.key === 'io').res)} |`].join('\n');
  T.gamma = ['| 熱の上限の Γ_d の則(log10 Γ_d,max)のノブ | 係数 | rms [dex] | 満たせた | ' + T4.gamma[0].rows.map((r) => nm(r.key)).join(' | ') + ' |', '|---|---|---|---|' + T4.gamma[0].rows.map(() => '---|').join(''),
    ...T4.gamma.map((g) => `| ${knobsTxt(g.knobs)} | ${g.coef.map(f3).join('・')} | ${f3(g.rms)} | ${g.nOk}/${g.nFit} | ${g.rows.map((r) => f3(r.res) + (r.ok ? '' : ' ✗')).join(' | ')} |`)].join('\n');
  T.shear = ['| R ÷ 今の太陽の半径 | s [rad/s](I s = 一定) | ' + T5.dList.map((d) => 'ずれの熱の比(Γ_d ∝ R^' + d + ')').join(' | ') + ' |', '|---|---|' + T5.dList.map(() => '---|').join(''),
    ...T5.rows.map((r) => `| ${r.ROverNow} | ${f3(r.cols[0].s)} | ${r.cols.map((c) => f3(c.heatRel)).join(' | ')} |`)].join('\n');
  const AX = J.axial, VJ = { 'center|obs': '中心の点(自転 = 観測の回転 Ω)', 'center|jd': '中心の点(自転 = J 等価の s_d)', inner: '半径の内の和(環の点 —— 自転 0・円軌道)' };
  T.axCoef = ['| α | 差分だけ diff(赤道面・静止の受け手)1 − α | 回転率の全部 full 1 − α/2 | 極の側 diff | 極の側 full |', '|---|---|---|---|---|',
    ...AX.coef.map((c) => `| ${c.alpha} | ${f3(c.diff)} | ${f3(c.full)} | ${f3(c.poleDiff)} | ${f3(c.poleFull)} |`)].join('\n');
  const dirL = (q) => (q.mag === 0 ? '0' : q.alongLRel > 0.5 ? '順(銀河と同じ)' : q.alongLRel < -0.5 ? '逆(原始太陽系 180° の向き)' : '斜め(' + f3(q.alongLRel) + ')');
  T.axGalaxy = ['| 銀河の源 | α | 重みの割合 w/W | diff の向き | diff·ŝ☉/s☉ | diff の 180° の軸への成分 [rad/s] | diff の今の黄道の北極への成分 [rad/s] | full の向き | full·ŝ☉/s☉ | mix(λ 0.5)·ŝ☉/s☉ | EQ-31 の向き | EQ-31·ŝ☉/s☉ |', '|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...AX.galaxy.map((g) => `| ${VJ[g.variant]} | ${g.alpha} | ${f3(g.share)} | ${dirL(g.diff)} | ${f3(g.diff.overS)} | ${f3(g.diff.proto)} | ${f3(g.diff.now)} | ${dirL(g.full)} | ${f3(g.full.overS)} | ${f3(g.mix.find((m) => m.lambda === 0.5).overS)} | ${dirL(g.eq31)} | ${f3(g.eq31.overS)} |`)].join('\n');
  const ag = (q) => (q.agree ? '合う' : '合わない');
  T.axPlanets = ['| 惑星 | 自転の向き(ŝ·ŝ☉) | 太陽の赤道面からの緯度 [deg] | s☉/n | α | diff の係数 (1 − α) s☉ + α n [rad/s] | diff·ŝ/s(惑星の自転に対して)| diff と自転の向き | full·ŝ/s | full と自転の向き | EQ-31·ŝ/s | EQ-31 と自転の向き |', '|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...AX.planets.flatMap((p) => p.cols.map((c) => `| ${nm(p.key)} | ${f3(p.spinDotSun)} | ${f2(p.latSun)} | ${f3(p.sOverN)} | ${c.alpha} | ${f3(c.coefDiff)} | ${f3(c.diff.overS)} | ${ag(c.diff)} | ${f3(c.full.overS)} | ${ag(c.full)} | ${f3(c.eq31.overS)} | ${ag(c.eq31)} |`))].join('\n');
  const cnt = (al, k) => AX.planets.filter((p) => p.cols.find((c) => c.alpha === al)[k].agree).length;
  T.axCount = ['| α | diff と自転の向きが合う惑星の数 | full | EQ-31 |', '|---|---|---|---|', ...J.decl.axialAlphas.map((al) => `| ${al} | ${cnt(al, 'diff')}/${AX.planets.length} | ${cnt(al, 'full')}/${AX.planets.length} | ${cnt(al, 'eq31')}/${AX.planets.length} |`)].join('\n');
  const LF = AX.localFluid, sd = (q) => `${f3(q.overOmega)}(${q.dir > 0 ? '順' : q.dir < 0 ? '逆' : '0'})`;
  T.axFluid = ['| 回転曲線(局所の流体・慣性系) | Ω [rad/s] | 近い面と遠い面の差分 dV/dR ÷ Ω | 横の面 V/R ÷ Ω | 渦度 ζ = dV/dR + V/R = −2B ÷ Ω | 回転率 ½ζ ÷ Ω | 混ぜ λ 0.5((dV/dR + ½ζ)/2)÷ Ω | 共回転系の差分 dV/dR − Ω = −2A ÷ Ω | dV/dR [rad/s] | dV/dR の 180° の軸への成分 [rad/s] | dV/dR の今の黄道の北極への成分 [rad/s] |', '|---|---|---|---|---|---|---|---|---|---|---|',
    ...LF.rows.map((r) => { const R0 = J.t1.rates.find((q) => q.curve === r.curve); return `| ${CV[r.curve]} | ${f3(R0.Omega)} | ${sd(r.diff)} | ${sd(r.lateral)} | ${sd(r.zeta)} | ${sd(r.rate)} | ${sd(r.mixHalf)} | ${sd(r.corotDiff)} | ${f3(r.diff.value)} | ${f3(r.diff.proto)} | ${f3(r.diff.now)} |`; })].join('\n');
  T.axFluidMeas = ['| 回転曲線 | 要素の置き方 | 要素の自転 | α | 正規化した場 U の渦度 ÷ ζ | 正規化した場の動径の差分 ∂_x U_y ÷ dV/dR | 重みの勾配の項(W 固定の源ごとの差分の和)÷ ½ζ |', '|---|---|---|---|---|---|---|',
    ...LF.meas.map((m) => `| ${CV[m.curve]} | ${m.shape === 'ring' ? '面内の環(64 点)' : '球殻(512 点)'} | ${m.spin === 'zero' ? '0' : '½ζ'} | ${m.alpha} | ${f3(m.fieldZetaOverZeta)} | ${f3(m.fieldDiffOverDV)} | ${f3(m.weightTermOverHalfZeta)} |`)].join('\n');
  const CP = J.complement, dS = (x) => (x > 0 ? '順' : x < 0 ? '逆' : '0');
  T.cpGalaxy = ['| r_½ [AU](太陽の取り分が ½ の距離 —— W₀ のノブ) | 銀河の源 | 銀河の取り分 f | 静止の補い: L̂ の成分 [rad/s](向き) | 静止の補い: 180° の軸への成分 | 受け手自身の補い(途中版): L̂ の成分(向き) | 両方: L̂ の成分(向き) | 有限の半径 R☉ の差分と勾配の相対の差 |', '|---|---|---|---|---|---|---|---|',
    ...CP.rows.galaxy.filter((g) => [0.387, 0.723, 5.2].includes(g.rHalf)).map((g) => `| ${g.rHalf} | ${VJ[g.source]} | ${f3(g.static.f)} | ${f3(g.static.alongL)}(${dS(g.static.alongL)}) | ${f3(g.static.proto)} | ${f3(g.self.alongL)}(${dS(g.self.alongL)}) | ${f3(g.both.alongL)}(${dS(g.both.alongL)}) | ${f3(g.static.finiteRel)} |`)].join('\n');
  T.cpFluid = ['| 回転曲線(局所の流体 U = f V) | 銀河の取り分 f(r_½ 0.723 AU) | f 一様: f dV/dR [rad/s](向き) | 中心の点の重みの形: f[dV/dR − α(1 − f)V/R] [rad/s](向き) |', '|---|---|---|---|',
    ...CP.fluid.filter((q) => q.rHalf === 0.723).map((q) => `| ${CV[q.curve]} | ${f3(q.f)} | ${f3(q.uniform)}(${dS(q.uniform)}) | ${f3(q.centerLike)}(${dS(q.centerLike)}) |`)].join('\n');
  T.cpPlanets = ['| 天体(源) | 距離 [AU] | 取り分 f(境目 1 − 1/α = 0.5) | 静止の補い: 閉じた式 s f[1 − α(1 − f)] [rad/s] | 同 数値(源の自転の軸の成分) | 向き(源の回転に対して) | 有限の半径の差分と勾配の相対の差 | 受け手の自転と | 受け手自身の補い(途中版)の源の軸の成分(閉じた式 f[s − α(1 − f)(s − n)]) | 途中版と受け手の自転 |', '|---|---|---|---|---|---|---|---|---|---|',
    ...[...CP.rows.planets.filter((r) => r.rHalf === 0.723), ...CP.rows.moons].map((r) => `| ${nm(r.key)}(${nm(r.src)}) | ${f3(r.rAU)} | ${f3(r.f)} | ${f3(r.closed)} | ${f3(r.gradAlongSrc)} | ${dS(r.gradAlongSrc)} | ${f3(r.finiteRel)} | ${r.agree ? '合う' : '合わない'} | ${f3(r.selfAlongSrc)}(${f3(r.selfClosed)}) | ${r.selfAgree ? '合う' : '合わない'} |`)].join('\n');
  T.cpBalance = ['| r_½ [AU] | 銀河の取り分 f_g | 金星での太陽の取り分 | 観測の回転(k = 1)で釣り合う距離 [AU] | 金星で釣り合うのに要る銀河の倍率 k | 自転の向きが合う惑星の数 | 惑星ごと(S = 太陽が強い/G = 銀河が強い・+ 合う/− 合わない) |', '|---|---|---|---|---|---|---|',
    ...CP.balance.map((b) => `| ${b.rHalf} | ${f3(b.fGal)} | ${f3(b.fSunVenus)} | ${b.rootsK1AU.map(f3).join('・') || '—'} | ${f3(b.kNeed)}${b.kNeed < 0 ? '(負 —— 銀河の向きが逆でないと釣り合わない)' : ''} | ${b.nAgree}/8 | ${b.per.map((q) => nm(q.key) + ' ' + (q.sunStrong ? 'S' : 'G') + (q.agree ? '+' : '−')).join('・')} |`)].join('\n');
  const b0 = CP.balance[0];
  T.cpAxis = ['| 惑星 | 自転の向き(黄道) | 自転の軸と 180° の軸のなす角 [deg](黄道の北極は 60.19°) |', '|---|---|---|', ...b0.per.map((q) => `| ${nm(q.key)} | ${q.prograde ? '順行' : '逆行'} | ${f2(q.axisFromAntiDeg)} |`)].join('\n');
  const VE = CP.venusEarth;
  T.cpVenus = ['| 量 | 値 |', '|---|---|', `| 金星と地球の会合の周期 [日] | ${f3(VE.synodicDays)} |`, `| 金星の太陽日 [日] | ${f3(VE.solarDayDays)} |`, `| 会合 ÷ 太陽日 | ${f3(VE.synOverSolarDay)} |`, `| 会合 ÷ 恒星の自転周期 | ${f3(VE.synOverSidereal)} |`,
    `| 源の並進の項(太陽が銀河の静止系で ${f3(CP.trans.vSun)} m/s で動く —— û × v☉ df/dr)÷ 自転の項(金星・r_½ 0.723) | ${f3(CP.trans.ratioAtVenus)}(一周の平均は 0) |`].join('\n');
  const BG = J.background, dB = (x) => (x > 0 ? '順' : x < 0 ? '逆(180° の軸)' : '0');
  T.bgGal = ['| R_½ [kpc](銀河の取り分が ½ の半径 —— 銀河の外の背景 W₀) | 太陽の位置の銀河の取り分 f | 中心の点(自転 Ω)の ω_bg [rad/s] | 局所の流体(オールトの量・中心の重みの形) | 半径の内の和 | 比べる列: 中心の点・補う重みが受け手の慣性の速度を運ぶ |', '|---|---|---|---|---|---|',
    ...BG.galRows.map((g) => `| ${g.rHalfKpc}${g.rHalfKpc === BG.mainKpc ? '(主)' : ''} | ${f3(g.f)} | ${f3(g.center)}(${dB(g.center)}) | ${f3(g.fluidOort)}(${dB(g.fluidOort)}) | ${f3(g.inner)}(${dB(g.inner)}) | ${f3(g.centerSelf)}(${dB(g.centerSelf)}) |`)].join('\n');
  const OC = BG.outcomes;
  T.bgReadings = ['| 補足の帰結 | 読み (i) 慣性系の背景宇宙が静止(U = Σ w c/(W₀ + Σ w)) | 読み (ii) 今の計算の形(d = Σ w (c − v_i)/(W₀ + W_ii + Σ w)) |', '|---|---|---|',
    '| 遠い面が確実に遅い(源の静止系・自転する源) | 出る(U = s r f —— f が r^−α で落ちる) | 受け手が公転すると出ないことがある(係数 (1 − α)s + αn) |',
    `| 赤道面で逆回転(太陽 → 惑星・α = 2) | f < ½ で出る(公転によらない) | s > 2n で出る(全惑星 s☉/n ≥ 5.1 —— 出る) |`,
    `| 原始太陽系は銀河と逆回転(銀河 → 太陽の位置・中心の点・R_½ ${BG.mainKpc} kpc) | 出る(${f3(OC.iGalaxy)} rad/s) | 出ない(${f3(OC.iiGalaxy)} rad/s —— 太陽は中心の点と共回転) |`,
    `| 同(局所の流体・オールトの量) | 出る(${f3(OC.iFluid)} rad/s) | 差分だけ dV/dR(−0.125 Ω)で出る・渦度では出ない(⑤′ の表) |`].join('\n');
  T.bgBalance = ['| 読み | 金星で釣り合う太陽の取り分 f☉ | W₀ [(kg/AU²)(重み α = 2)] | r_½ [AU] | 自転の向きが合う惑星 | 惑星ごと(S = 太陽の側/B = 背景の側・+ 合う/− 合わない) |', '|---|---|---|---|---|---|',
    ...BG.balance.map((b) => `| ${b.reading === 'i' ? '(i) 慣性系の背景が静止' : '(ii) 今の計算の形'} | ${f3(b.f)} | ${f3(b.W0)} | ${f3(b.rHalfAU)} | ${b.nAgree}/8 | ${b.per.map((q) => nm(q.key) + ' ' + (q.sunSide ? 'S' : 'B') + (q.agree ? '+' : '−')).join('・')} |`)].join('\n');
  T.bgCompare = ['| α | 解いた W₀ の桁と比べる量 | 太陽の距離の銀河の重み | 観測できる宇宙の重み(粗い桁・文献の値・未照合) | 金星の距離の太陽の重み |', '|---|---|---|---|---|',
    ...BG.compare.map((c) => `| ${c.alpha} | ${c.alpha === 2 ? f3(BG.balance[0].W0) + '〜' + f3(BG.balance[1].W0) : '(釣り合い無し)'} | ${f3(c.galaxyAtSun)} | ${f3(c.universe)} | ${f3(c.sunAtVenus)} |`)].join('\n');
  T.bgMoons = ['| 惑星 | 惑星の項と背景の項が釣り合う距離 [AU](読み i) | 衛星の距離 [AU] |', '|---|---|---|',
    ...BG.balance[0].moonsBal.map((m) => `| ${nm(m.planet)} | ${f3(m.balanceAU)} | ${m.moons.map((x) => nm(x.key) + ' ' + f3(x.rAU) + (x.rAU < m.balanceAU ? '(内)' : '(外)')).join('・') || '—'} |`)].join('\n');
  T.bgEq17 = ['| 項目 | EQ-17(銀河の一様軸引きずり) | 背景軸引きずり(本便の候補) |', '|---|---|---|', '| 向き | 宣言の 3 成分 ω_G | 180° の軸(銀河の系の差分の向き) |',
    `| 大きさ | 宣言のノブ(内蔵の本の宣言 ${BG.eq17Declared} 本) | ω_bg = ${f3(BG.wbg)} rad/s(中心の点・R_½ ${BG.mainKpc} kpc)—— R_½ で符号が変わる |`, '| 受け手ごとの因子 | (R_d,i/R_ref)^q か (R_d,i/R_ref)(m_ref/m_i) | 背景の取り分 1 − f_i |', '| 分母 | 入れない | 背景慣性決定力 W₀ として分母に入る(取り分の計算) |'].join('\n');
  const A0 = AX.angles;
  T.axAngles = ['| 量 | 値 |', '|---|---|', `| 原始太陽系の軸と銀河の回転の軸のなす角(置いた値) | ${A0.protoDeg}° |`, `| 今の太陽系(黄道の北極)と銀河の回転の軸のなす角(置いた値 / 本の時刻の幾何) | ${A0.nowDeg}° / ${f2(A0.nowGeomDeg)}° |`,
    `| 供給の向き(180°)からの傾き(本の時刻の幾何) | ${f2(A0.tiltFromSupplyDeg)}° |`, `| 原始太陽系の軸 −L̂ と今の黄道の北極の内積(= 射影 cos θ) | ${f3(A0.protoDotNow)} |`].join('\n');
  T.gates = ['| 門 | 値 |', '|---|---|', ...Object.entries(J.gates).map(([k, v]) => `| ${k} | ${tf(v)} |`)].join('\n');
  return T;
}

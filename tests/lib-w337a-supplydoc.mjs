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
  T.gates = ['| 門 | 値 |', '|---|---|', ...Object.entries(J.gates).map(([k, v]) => `| ${k} | ${tf(v)} |`)].join('\n');
  return T;
}

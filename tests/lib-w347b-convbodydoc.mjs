// 第347便b(原仮定者の回答(2026-11-21 —— 第145報)「AN902: 推奨で進める。現状も近似として比較可能にする」・統括の検証項目 R401): **正本 tests/out/convbody-347b.json から PHYSICS〔第347便b〕の表を作る文書の lib**
// (QA docs.convbody347b が節の表と逐語で照合する —— 比は有効数字 4 桁か 3 桁の指数・丸めで 0 と書いた値は「0」・小さい差は「< 床」の形)。
export const DOC_VERSION = 'w347b-convbodydoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f4 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Math.abs(x) < 1e-4 ? fe(x) : Number(x.toPrecision(4)).toString());
const f6 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Math.abs(x) < 1e-6 ? '< 1e-6' : x.toFixed(6));
const lt = (x, fl) => (x === 0 ? '0' : x < fl ? '< ' + fl.toExponential(0) : fe(x));
const pm = (o) => `${f4(o.c1)} ± ${f4(o.spread)}`;
const tf = (x) => (x === true ? '真' : x === false ? '偽' : 'null');

export const KIND_NAME = Object.freeze({ N: '(N) ニュートン(物差し)', 0: '(0) 現行の近似(指数 2)', alpha: '(α) 主の候補(指数 1)', beta: '(β) 比べる列(指数 1)' });
export const FRAME_NAME = Object.freeze({ abs: '絶対の枠', clock: '今の点の時計の枠', host: '主星の枠' });
const QN = Object.freeze({ dVarpi: '月の近地点の率', dOm: '月の交点の率', dLon: '月の恒星の黄経の率', dSyn: '朔望の角の率', dVarpiE: '地球の近日点の率' });
const ENAME = (e) => (e === 0.20563593 ? '水星の型 0.2056' : e === 0.0068 ? '金星の型 0.0068' : String(e));
const vname = (r) => KIND_NAME[r.kind] + (r.kind === '0' ? '' : ' —— ' + FRAME_NAME[r.frame]);

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| ① 静止(速さ 0)で (α) と (β) の q = e^(−ψ) | ${S.q0 ? 'はい' : 'いいえ'} | ${tf(G.q0)} |`,
    `| ② 枠つきの (β) の q(U と u から二次式)が同じ状態の (α) の q と同じ(相対の差の最大) | ${lt(S.qBetaMax, 1e-13)} | ${tf(G.qBeta)} |`,
    `| ③ ε = 0 で 3 つの型 × 枠 3 つの右辺がニュートンと同じ(相対の差の最大) | ${lt(S.rhsMax, 1e-12)} | ${tf(G.rhs)} |`,
    `| ④ 試験粒子の見込み((0) 指数 2 と (α) 指数 1 は −2/3・(β) 指数 1 は −1/3) | ${S.closed ? 'はい' : 'いいえ'} | ${tf(G.closed)} |`,
    `| ⑤ 円の周期の比 P₀ ÷ P_α − 1 と見込み ψ/4 の相対の差(ψ = 1e-6) | ${fe(S.periodRel)} | ${tf(G.period)} |`,
    `| ⑥ 入力の拒否(型が無い・枠が無い・ε が負・ψ が非有限) | ${S.reject.n}/${S.reject.of} | ${tf(G.reject)} |`].join('\n');

  const t1 = J.t1, Q = ['dVarpi', 'dOm', 'dLon', 'dSyn', 'dVarpiE'];
  const coefTab = (C, label) => [`| ${label}: 型 —— 枠 | ${Q.map((q) => QN[q]).join(' | ')} |`, '|---' + '|---'.repeat(Q.length) + '|']
    .concat(C.map((r) => `| ${vname(r)} | ${Q.map((q) => pm(r[q])).join(' | ')} |`)).join('\n');
  T.t1real = coefTab(t1.realCoef, '実の比') + `\n\n(型 − ニュートンの率 ÷ ε —— 月の 1 公転あたりの rad。一次の係数 c₁(ε と 10 ε の 2 点から外挿)± 幅(刻みを倍・窓を ${J.decl.sem.real.years[0]} 年 → ${J.decl.sem.real.years[1]} 年にしたときの動きの最大)。ε = GM_sun ÷(c₀² × 天文単位)= ${fe(t1.real[0].eps)}。ニュートンの物差しの月の近地点 ${f4(t1.realNewton.varpiAsYr / 3600)}°/年・交点 ${f4(t1.realNewton.OmAsYr / 3600)}°/年)`;
  T.t1dim = coefTab(t1.dimCoef, '無次元') + `\n\n(同じ測り方 —— 地球 ${J.decl.sem.dimless.mE}・月は地球の 1/81.3・月の軌道 ${J.decl.sem.dimless.aM}・ε = ${J.decl.sem.dimless.epsGrid.join('・')}・窓 ${J.decl.sem.dimless.years[0]} 年 → ${J.decl.sem.dimless.years[1]} 年)`;
  const diffTab = (D, label) => [`| ${label}: 差 —— 枠 | ${Q.map((q) => QN[q]).join(' | ')} | 近地点の差 ÷ (0) | 恒星の黄経の差 ÷ (0) |`, '|---' + '|---'.repeat(Q.length + 2) + '|']
    .concat(D.map((r) => `| (0) − ${KIND_NAME[r.kind]} —— ${FRAME_NAME[r.frame]} | ${Q.map((q) => pm(r[q])).join(' | ')} | ${f4(r.dVarpi.rel1)} | ${f4(r.dLon.rel1)} |`)).join('\n');
  T.t1diffReal = diffTab(t1.realDiff, '実の比') + '\n\n(一次の係数の差 ± 差の幅。「近地点の差 ÷ (0)」は |c₁(0) − c₁(型)| ÷ |c₁(0)| —— 0 なら一次で消える。幅より大きい差だけを読む)';
  T.t1diffDim = diffTab(t1.dimDiff, '無次元');
  T.t1values = ['| 実の比・ε そのもの(λ = 1)| 月の近地点(″/年) | 月の交点(″/年) | 恒星月の相対の差 | 朔望の周期の相対の差 | 朔望の周期の差(秒) |', '|---|---|---|---|---|---|']
    .concat(t1.realValues.map((r) => `| ${vname(r)} | ${fe(r.dVarpiAsYr)} | ${fe(r.dOmAsYr)} | ${fe(r.siderealRel)} | ${fe(r.synodicRel)} | ${f4(r.synodicS)} |`)).join('\n')
    + `\n\n(型 − ニュートン・刻み ${J.decl.sem.real.stepsPerMoon[0]}/月・窓 ${J.decl.sem.real.years[0]} 年の 1 本の走り。周期は固定の係数のまま —— 合わせない。周期の相対の差 = −Δ率 ÷ ニュートンの率(正は周期が長い))`;
  const fs = t1.frameSpeeds;
  T.frames = ['| 月の相対の速さを測る枠(実の比・初期の点) | 速さ ÷ c₀ | x² =(速さ ÷ c₀)² |', '|---|---|---|',
    `| 絶対の枠(系の重心) | ${fe(Math.sqrt(fs.x2.abs))} | ${fe(fs.x2.abs)} |`, `| 今の点の時計の枠(自分を除く決定力の重みの平均 —— D₀ = 0) | ${fe(Math.sqrt(fs.x2.clock))} | ${fe(fs.x2.clock)} |`, `| 主星の枠(地球) | ${fe(Math.sqrt(fs.x2.host))} | ${fe(fs.x2.host)} |`,
    `| 参考: 月の位置の太陽の ψ・地球の ψ | ${fe(fs.psiSunAtMoon)}・${fe(fs.psiEarthAtMoon)} | — |`].join('\n')
    + '\n\n(今の点の時計の枠は、月の位置では太陽の決定力の重みが地球の ' + f4(fs.psiSunAtMoon / fs.psiEarthAtMoon) + ' 倍で、絶対の枠とほぼ同じ —— 主星の枠とは x² で約 3 桁違う)';

  const t2 = J.t2;
  T.t2 = ['| 離心率 | 型 | 多体の器(太陽も動く・惑星 1e-12) | 第344便b の試験粒子 | 差 | 見込み |', '|---|---|---|---|---|---|']
    .concat(t2.rows.map((r) => `| ${ENAME(r.e)} | ${KIND_NAME[r.kind]} | ${f6(r.overPN)} | ${f6(r.w344b)} | ${lt(r.diff, 1e-8)} | ${f4(r.closed)} |`)).join('\n')
    + `\n\n(近点の進み ÷ 1PN・ε = ${J.decl.t2.eps}・1 周 ${J.decl.t2.steps} 刻み・近点 ${J.decl.t2.nOrb} 回の差 —— 第344便b と同じ測り方)`;
  T.t2pert = ['| 離心率 | 型 —— 枠 | (型 − ニュートン)÷ 1PN | 見込み(試験粒子) | ニュートンの近点の進み ÷ 1PN(摂動の分) |', '|---|---|---|---|---|']
    .concat(t2.pert.map((r) => `| ${ENAME(r.e)} | ${vname(r)} | ${f6(r.overPN)} | ${f4(r.closed)} | ${f4(r.newtonPerOrbitOverPN)} |`)).join('\n')
    + `\n\n(外の摂動の天体: 質量 ${J.decl.t2.pert.m}・軌道 ${J.decl.t2.pert.a}・e ${J.decl.t2.pert.e}・1 周 ${J.decl.t2.stepsPert} 刻み・近点 ${J.decl.t2.nOrbPert} 回の差。試験粒子の見込みからのずれの内訳〔摂動の天体の ψ と速さが時計に入る分・摂動との交わりの項〕は分けていない)`;

  const t3 = J.t3;
  T.t3 = ['| アプリの水星の本(🌡️)の背景の組 | 型 | 近点の一次 ÷ 1PN | なしとの差 | 差(″/世紀) |', '|---|---|---|---|---|']
    .concat(t3.rows.map((r) => `| ${{ none: 'なし', both: '両方', app: '不揃い(今のアプリ —— 時計にだけ)' }[r.combo]} | ${KIND_NAME[r.kind || 'alpha']} | ${f6(r.closed)} | ${fe(r.dFirst)} | ${fe(r.dArcsecCy)} |`)).join('\n')
    + `\n\n(背景 ψ₀ = X_k D₀ = ${fe(t3.kappaT)} × ${t3.D0} = ${fe(t3.psi0)}(本の physics の宣言の写し)・水星の位置の太陽の ψ ${fe(t3.psiSunAtMercury)}(比 ${f4(t3.ratio)})・1PN ${f4(t3.arcsecCy1PN)}″/世紀。見込みは第344便b の −(2 n_G + 1 + e^(m ψ₀))/6(m = 両方 1・不揃い 3))`;
  T.t3num = ['| 誇張した ψ₀ | (α) の近点の差 ÷ 1PN(数値) | ÷ ψ₀ | 見込み ÷ ψ₀ |', '|---|---|---|---|']
    .concat(t3.num.map((r) => `| ${r.psi0} | ${fe(r.dOverPN)} | ${f6(r.slope)} | ${f6(r.closedSlope)} |`)).join('\n');

  const sn = { two: '2 体', three: '3 体' };
  T.t4 = ['| 系 | n_G(対称) | 型 | 物質の運動量の残り | 帳簿を置いた全体 | 帳簿の最大 | 近点ごとの帳簿の増し分 | 周内の振れ | 増し分 ÷ 振れ | 候補 Π = Σ m v ÷ q の残り | 仕事の残り | 近点ごとの仕事の増し分 |', '|---|---|---|---|---|---|---|---|---|---|---|---|']
    .concat(J.t4.rows.map((r) => `| ${sn[r.sys]} | ${r.nG} | ${KIND_NAME[r.kind]} | ${lt(r.dP, 1e-12)} | ${lt(r.ledgerTotal, 1e-12)} | ${lt(r.ledgerMax, 1e-12)} | ${r.perOrbitInc === null ? '—' : lt(r.perOrbitInc, 1e-12)} | ${r.withinAmp === null ? '—' : lt(r.withinAmp, 1e-12)} | ${r.kind === '0' ? '—' : f4(r.incOverAmp)} | ${lt(r.piResid, 1e-12)} | ${lt(r.dE, 1e-9)} | ${r.perOrbitIncE === null ? '—' : fe(r.perOrbitIncE)} |`)).join('\n')
    + `\n\n(第343便b の systemOf の系・ε = 1・RK4 ${J.decl.t4.steps} 步で ${J.decl.t4.orbits} 周。運動量は Σ m 大きさ(v) で割った比・仕事はニュートンの E の変化 ÷ 大きさ(E)。帳簿 P_f = Σ m v(0) − Σ m v(t) を置くと全体は恒等で 0。「近点ごと」は天体 0 と 1 の相対の近点の間 —— 増し分が振れと同じ桁で一方へ積もる行は、この系とこの帳簿では帳簿が周ごとに戻らない)`;

  T.t5 = ['| 天体 | a(天文単位) | e | ψ = ε ÷ a | 1PN(″/世紀) | 数値の一次 c₁(外挿の床) | 二次の係数 c₂ | (0) − (α) の近点(″/世紀 —— 一次 0 + c₂ ψ) | 周期の比 P₀ ÷ P_α − 1(円・ψ/4) | 同 数値 | 1 周あたりの差(秒) |', '|---|---|---|---|---|---|---|---|---|---|---|']
    .concat(J.t5.rows.map((r) => `| ${r.ja} | ${f4(r.a)} | ${f4(r.e)} | ${fe(r.psi)} | ${f4(r.pnArcsecCy)} | ${Math.abs(r.c1) < 1e-7 ? '< 1e-7' : fe(r.c1)} | ${f4(r.c2)} | ${fe(r.dArcsecCy)} | ${fe(r.periodRelClosed)} | ${fe(r.periodRel)} | ${f4(r.periodS)} |`)).join('\n')
    + '\n\n(試験粒子・受け手の型。近点は (0) 指数 2 と (α) 指数 1 の差 —— 一次は見込みの式で 0(数値の c₁ は μ = 1e-5〜4e-5 からの外挿の床)・二次は μ 3 点の数値の係数 × ψ。周期は円の軌道の同じ半径での比(正は (0) の周期が長い)。惑星の a・e は第299便c の lib の写し・地球は同じ表の行の転記 —— 文献の値・未照合)';
  T.t5moon = ['| 月の型(実の比 —— T1)の枠 | (0) − (α) の月の近地点(″/年) | 幅 | 同 交点(″/年) | 幅 | 恒星月の相対の差 | 朔望の周期の相対の差 | 近地点の差 ÷ (0) |', '|---|---|---|---|---|---|---|---|']
    .concat(J.t5Moon.map((r) => `| ${FRAME_NAME[r.frame]} | ${fe(r.dVarpiAsYr)} | ${fe(r.dVarpiSpreadAsYr)} | ${fe(r.dOmAsYr)} | ${fe(r.dOmSpreadAsYr)} | ${fe(r.siderealRel)} | ${fe(r.synodicRel)} | ${f4(r.rel1Varpi)} |`)).join('\n')
    + '\n\n(T1 の実の比の一次の係数の差 × ε・幅も同じ換算。この系では (0) と (α) の差が一次で残る —— 月の位置の太陽の ψ と、太陽の枠での月の速さが時計の因子に入る型どうしの差の読み〔内訳は分けていない〕。主星の枠の近地点は幅が値と同じ桁)';
  return T;
}

// 第356便a(統括の検証項目 R513): **正本 tests/out/p1figs-356a.json から PHYSICS〔第356便a〕の表と数の文を作る文書の lib**
//   (docs.p1figs356a が呼ぶ —— import しない・ファイルを読まない・正本の値を書式に流すだけ)。
// ■ 言わないこと: 図のデータは模型の式の値。観測に届いた・論文の主張が確かめられた、とは書かない。原稿の印字との差は差のまま書く。
export const DOC_VERSION = 'w356a-p1figsdoc-1';

const v6 = (x) => (x === null || x === undefined ? '——' : (typeof x === 'boolean' ? (x ? 'はい' : 'いいえ') : (Number.isInteger(x) ? String(x) : x.toPrecision(6))));
const v4 = (x) => (x === null || x === undefined ? '——' : x.toPrecision(4));
const relT = (x) => (x === null || x === undefined ? '——' : x === 0 ? '0(相対 1e-9 の桁の下)' : x.toExponential(2));
const tolT = (g) => (g.tolSrc === 'floor289a' ? '相対 1e-6(第289便a の床 —— 既存)' : g.tolSrc === 'fig4' ? '相対 1e-3(図 4 の門の幅 —— 既存)' : g.tolSrc === 'cand' ? '印字の最後の桁の半分 ' + g.tol + '(候補)' : '作りで等しい');
/** 図 1 の表に出す行(格子の 37 点から 7 点 —— 端・中・GPS の軌道の近く) */
export const FIG1_SHOW = Object.freeze([0, 6, 12, 18, 24, 30, 36]);
export const FIG2_SHOW = Object.freeze([0, 10, 20, 25, 30, 35, 40, 50, 60]);
export const FIG3_SHOW = Object.freeze([0, 4, 8, 13, 17, 22, 26]);

export function tablesOf(J) {
  const T = {};
  const s0 = J.fig1.series[0], s1 = J.fig1.series[1];
  T.fig1 = ['| r ÷ R⊕ | 速さ v [km/秒] | 重力の分 [μs/日] | 運動の分(地上 0.465)[μs/日] | 合計(地上 0.465)[μs/日] | 運動の分(地上 0)[μs/日] | 合計(地上 0)[μs/日] |', '|---|---|---|---|---|---|---|']
    .concat(FIG1_SHOW.map((i) => { const a = s0.rows[i], b = s1.rows[i]; return `| ${v4(a.x)} | ${v4(a.vKmS)} | ${v6(a.grav)} | ${v6(a.motion)} | ${v6(a.net)} | ${v6(b.motion)} | ${v6(b.net)} |`; })).join('\n');
  const g = J.fig1.gps, z = J.fig1.zero;
  T.gps = ['| GPS の軌道の点(r = 2.6562e7 m) | 重力の分 [μs/日] | 運動の分 [μs/日] | 合計 [μs/日] | 交差の項 [μs/日] | 合計が 0 になる半径 [km](一次の閉じた形) |', '|---|---|---|---|---|---|',
    `| 地上の時計 0.465 km/秒(入力の表) | ${v6(g.withGround.grav)} | ${v6(g.withGround.motion)} | ${v6(g.withGround.net)} | ${v4(g.withGround.cross)} | ${v6(z.withGround.r0 / 1e3)}(${v6(z.withGround.r0First / 1e3)}) |`,
    `| 地上の時計 0(止めて読む) | ${v6(g.groundAtRest.grav)} | ${v6(g.groundAtRest.motion)} | ${v6(g.groundAtRest.net)} | ${v4(g.groundAtRest.cross)} | ${v6(z.groundAtRest.r0 / 1e3)}(${v6(z.groundAtRest.r0First / 1e3)}) |`].join('\n');
  T.fig2 = ['| x ÷ R☉ | x までに受けた偏向 [″] | 閉じた形との相対の差 | 直線からのずれ [km] |', '|---|---|---|---|']
    .concat(FIG2_SHOW.map((i) => { const r = J.fig2.rows[i]; return `| ${v4(r.x)} | ${v6(r.alphaArcsec)} | ${relT(r.relAlphaClosed)} | ${v6(r.yKm)} |`; })).join('\n');
  T.fig3 = ['| b ÷ R☉ | 片道 [μs] | 往復 [μs] | 往復の閉じた形 [μs] | 原稿の式 (4GM☉/c³) ln(4 r₁ r₂ / b²) [μs] | lib と閉じた形の相対の差 | 原稿の式と閉じた形の相対の差 |', '|---|---|---|---|---|---|---|']
    .concat(FIG3_SHOW.map((i) => { const r = J.fig3.rows[i]; return `| ${v4(r.bOverR)} | ${v6(r.oneWayUs)} | ${v6(r.roundTripUs)} | ${v6(r.closedRoundTripUs)} | ${v6(r.printedFormUs)} | ${relT(r.relLibClosed)} | ${relT(r.relPrintedExact)} |`; })).join('\n');
  T.gates = ['| 門 | 図 | 何を見て通すか | 値 | 幅 | 通る |', '|---|---|---|---|---|---|']
    .concat(J.figGates.map((q) => `| ${q.id} | ${q.fig} | ${q.what} | ${q.value === null ? '——' : v4(q.value)} | ${tolT(q)} | ${q.pass ? 'はい' : 'いいえ'} |`)).join('\n');
  T.printed = ['| 量 | 原稿の字(出どころ) | 原稿の印字 | 入力の表から作り直した値 | 相対の差 | 印字の最後の桁の半分の内 | 別の読みの値 |', '|---|---|---|---|---|---|---|']
    .concat(J.printed.map((p) => `| ${p.q} | ${p.where} | ${p.printed} ${p.unit} | ${v6(p.model)} | ${relT(p.relDiff)} | ${p.within ? 'はい' : 'いいえ'} | ${p.alt === undefined ? '——' : p.altNote + ' ' + v6(p.alt)} |`)).join('\n');
  return T;
}
export function factsOf(J) {
  const g = J.fig1.gps, f2 = J.fig2, f3 = J.fig3.rows[0], lp = J.printed.find((p) => p.q === 'limb');
  return {
    gps: `GPS の軌道の点では、地上の時計を止めて読むと重力の分 ${v6(g.groundAtRest.grav)}・運動の分 ${v6(g.groundAtRest.motion)}・合計 ${v6(g.groundAtRest.net)} μs/日 —— 原稿の照合の表の字(+45.7・−7.2・+38.5)の最後の桁の半分の内。地上の時計を入力の表の 0.465 km/秒で動かすと、運動の分 ${v6(g.withGround.motion)}・合計 ${v6(g.withGround.net)} μs/日。`,
    zero: `合計が 0 になる円の軌道の半径は ${v6(J.fig1.zero.withGround.r0 / 1e3)} km(r ÷ R⊕ ${v4(J.fig1.zero.withGround.r0 / J.inputs.R_E)} —— 地上の時計 0.465 km/秒)。`,
    limb: `太陽縁の偏向の全体は、入力の表の字(M☉ 1.989e30 kg・R☉ 6.96e8 m)と G・c から ${v6(f2.totalArcsec)}″ —— 原稿の印字 1.7512″ との相対の差 ${relT(lp.relDiff)}(印字の最後の桁の半分の外)。Fermat の光線の式の RK4 の係数は ${v6(f2.rayCoeff)}(4 との相対の差 ${relT(f2.rayRelTo4)} —— 二次の項の大きさ U_b = ${v4(f2.Ub)} の桁)。`,
    shapiro: `b = R☉ の往復は、原稿の式で ${v6(f3.printedFormUs)} μs・端点の有限の幾何の求積で ${v6(f3.roundTripUs)} μs(原稿の印字 ≈281 μs の最後の桁の半分の内)。`,
  };
}

/* ───── 構成案 docs/PAPER_PLAN.md の論文1 の節に置く表(表 2b・表 2c・表 2d)と ⑧ の V1-5 の欄の末尾 ───── */
/** ⑧ の V1-5 の行の欄の末尾に足す字句(行は書き換えない —— 「足りるか」の欄は「足りない」のまま: 図そのものと tools/gen-figures.mjs への組み込みが残る) */
export const PLAN_V15 = Object.freeze({
  row: '| V1-5 |',
  old: '図データの器と図のゲート(新しい図 3 枚)',
  add: ' → 〔第356便a〕 器 `tests/exp-w356a-p1figs.mjs`・正本 `tests/out/p1figs-356a.json`・段 `p1figs-356a`(html を読まない段 —— 〔第289便a〕の弱場の lib を呼ぶ)・鍵 `behavior.p1figs356a`・`docs.p1figs356a`(図のデータと図の門は表 2b —— 埋まったのは図のデータと門まで。図そのもの〔PDF・SVG〕と tools/gen-figures.mjs への組み込みは次の便)',
});
/** 表 2b 新しい図 3 枚のデータと門(正本から) */
export function table2b(J) {
  const ids = (f) => J.figGates.filter((g) => g.fig === f).map((g) => '`' + g.id + '`').join('・');
  const rows = [
    ['図 A 時計の遅れの 2 成分', J.fig1.axes.x + '(1〜10・37 点)', J.fig1.axes.y, '重力の分・運動の分・合計 × 地上の時計 2 通り(0.465 km/秒・0)+ GPS の軌道の点・合計 0 の半径', 'μs/日', '原稿の A7′(N は〔第289便a〕の lawFn(\'e7r\'))', ids(1)],
    ['図 B 太陽縁の光の軌跡', J.fig2.axes.x + '(±215・61 点)', 'x までに受けた偏向・直線からのずれ', '1 本(b = R☉)', '″・km', '〔第289便a〕の bornDeflectionCoeff(\'e7r\') の範囲を切る', ids(2)],
    ['図 C シャピロ遅延の往復', J.fig3.axes.x + '(1〜20・27 点)', J.fig3.axes.y, '片道・往復・往復の閉じた形・原稿の式', 'μs', '〔第289便a〕の shapiroCoeff(\'e7r\')', ids(3)],
  ];
  return ['| 図 | 横軸 | 縦軸 | 系列 | 単位 | 式・使った lib | 門(正本 tests/out/p1figs-356a.json) |', '|---|---|---|---|---|---|---|'].concat(rows.map((r) => '| ' + r.join(' | ') + ' |')).join('\n');
}
/** 今の版の原稿(paper/dfm-paper.tex)の照合の表の 4 行の字(TeX の字のまま —— 改行は空白 1 つに) */
export const MS_CALIB = Object.freeze([
  Object.freeze({ q: 'GPS net clock-rate difference (satellite $-$ ground)', dfm: '$+38.5\\ \\mu$s/day (gravity $+45.7$, motion $-7.2$; inputs in Table~\\ref{tab:inputs})', exp: '$\\approx +38.6\\ \\mu$s/day (GPS system design value~\\cite{Ashby2003})', verdict: 'formula-level agreement', mark: '文献の値・未照合' }),
  Object.freeze({ q: 'Solar-limb light deflection', dfm: '$4GM_\\odot/(c^2R_\\odot) = 1.7512\'\'$ (no additional parameter)', exp: '$1.75\'\'$ (light-deflection VLBI, percent level)', verdict: 'formula-level agreement', mark: '文献の値・未照合(この行に出典の字は無い)' }),
  Object.freeze({ q: 'Shapiro delay (idealized Cassini-conjunction geometry: $r_1 = 1\\,$AU, $r_2 = 8.43\\,$AU, $b = R_\\odot$, round trip)', dfm: '$(4GM_\\odot/c^3)\\ln(4r_1r_2/b^2) \\approx 281\\ \\mu$s', exp: 'Cassini radio links constrain the PPN coefficient of this formula: $\\gamma - 1 = (2.1 \\pm 2.3)\\times10^{-5}$~\\cite{Bertotti2003}', verdict: 'formula-level agreement', mark: '文献の値・未照合' }),
  Object.freeze({ q: 'Mercury perihelion advance (main term $+42.98\'\'$/century)', dfm: 'base dynamics: static field $0$ (Newtonian reduction), E6$\'$ gives only a Lense--Thirring-sign regression; geodesic option E12: $+42.98\'\'$/century ($\\beta = \\gamma = 1$, Sec.~\\ref{sec:e12})', exp: '$+42.98\'\'$/century', verdict: '\\textbf{not reproduced} by E1$\'$--E11; recovered by E12', mark: '文献の値・未照合(この行に出典の字は無い)' }),
]);
/** 今の版の原稿の付録の入力の表の字と SI の表の X_k の行(TeX の字のまま)・原稿に字の無い値は「未」 */
export const MS_INPUTS = Object.freeze([
  Object.freeze(['$M_\\oplus$', '$5.972\\times10^{24}$ kg', 'GPS']),
  Object.freeze(['$R_\\oplus$ (ground clock)', '$6.371\\times10^{6}$ m', 'GPS']),
  Object.freeze(['$r_{\\rm GPS}$ (orbit radius)', '$2.6562\\times10^{7}$ m', 'GPS']),
  Object.freeze(['$v_{\\rm sat} = \\sqrt{GM_\\oplus/r_{\\rm GPS}}$', '$3.87$ km/s', 'GPS']),
  Object.freeze(['$v_{\\rm ground} = \\Omega_\\oplus R_\\oplus$', '$0.465$ km/s', 'GPS']),
  Object.freeze(['$M_\\odot$', '$1.989\\times10^{30}$ kg', 'deflection, Shapiro']),
  Object.freeze(['$R_\\odot$ ($=b$)', '$6.96\\times10^{8}$ m', 'deflection, Shapiro']),
  Object.freeze(['$r_1$ (Earth)', '$1\\ {\\rm AU} = 1.496\\times10^{11}$ m', 'Shapiro']),
  Object.freeze(['$r_2$ (Saturn)', '$8.43\\ {\\rm AU} = 1.261\\times10^{12}$ m', 'Shapiro']),
  Object.freeze(['geometry', 'superior conjunction, round trip', 'Shapiro']),
]);
export const MS_SI = Object.freeze(['$\\Kt = G/c^2$', '$\\approx 7.43\\times10^{-28}\\ {\\rm m\\,kg^{-1}}$', 'clock/light coefficient']);
export const MS_MISSING = Object.freeze([
  Object.freeze(['重力定数 G', '未(原稿は「consistent with CODATA」と書くだけ —— 図のデータの器は tests/lib-w276b-charonfactors.mjs の CODATA_G 6.67430e-11 を使う)']),
  Object.freeze(['光の速さ c', '未(原稿は「$c_0 = c$」と書くだけ —— 図のデータの器は SI の定義の値 299792458 m/秒)']),
  Object.freeze(['地球の自転の角速度 Ω⊕', '未(v_ground の式に記号だけ)']),
  Object.freeze(['水星の軌道の値(長半径・離心率・周期)', '未(照合の表の水星の行と入力の表に字が無い —— 原稿の §E12 の本文を指す)']),
]);
const tex = (s) => '`' + s + '`';
export function table2c() {
  return ['| 量(原稿の字) | 原稿の DFM の欄 | 原稿の実験の制約の欄 | 原稿の判定の欄 | 印 |', '|---|---|---|---|---|']
    .concat(MS_CALIB.map((r) => `| ${tex(r.q)} | ${tex(r.dfm)} | ${tex(r.exp)} | ${tex(r.verdict)} | ${r.mark} |`)).join('\n');
}
export function table2d() {
  return ['| 入力(原稿の字) | 値(原稿の字) | 使う行(原稿の字) | 印 |', '|---|---|---|---|']
    .concat(MS_INPUTS.map((r) => `| ${tex(r[0])} | ${tex(r[1])} | ${tex(r[2])} | 文献の値・未照合 |`))
    .concat([`| ${tex(MS_SI[0])} | ${tex(MS_SI[1])} | ${tex(MS_SI[2])}(SI の表) | 写像の値 |`])
    .concat(MS_MISSING.map((r) => `| ${r[0]} | ${r[1]} | —— | 未 |`)).join('\n');
}
/** 原稿の字の照合(TeX の空白をつぶして含むか —— QA が使う) */
export function msStrings() { return MS_CALIB.flatMap((r) => [r.q, r.dfm, r.exp, r.verdict]).concat(MS_INPUTS.flat()).concat(MS_SI); }

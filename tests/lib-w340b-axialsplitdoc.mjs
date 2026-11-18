// 第340便b(原仮定者の指示(2026-11-17 —— 第140報)・統括の検証項目 R357): **正本 tests/out/axialsplit-340b.json から PHYSICS〔第340便b〕の表を作る文書の lib**
// (QA docs.axialsplit340b が節の表と逐語で照合する —— 数は有効数字 3 桁の指数・角は小数 2 桁・正本で 0 と書いた量〔丸めの残り〕は「0」)。
export const DOC_VERSION = 'w340b-axialsplitdoc-3';   // 版 3(第341便c): T3 の「主の列で減速しない」を 3 値(正・負・未解決)のまま書く
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f2 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(2));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
const f4 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(4));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const j3 = (x) => (x === '正' ? '正(減速しない)' : x === '負' ? '負(減速する)' : x === '未解決' ? '未解決(数値では決まらない)' : '—');   // 第341便c: 3 値
const sg = (x) => (x > 0 ? '順(+)' : x < 0 ? '逆(−)' : '0');
const NM = Object.freeze({ sun: '太陽', mercury: '水星', venus: '金星', earth: '地球', mars: '火星', jupiter: '木星', saturn: '土星', uranus: '天王星', neptune: '海王星',
  moon: '月', io: 'イオ', europa: 'エウロパ', ganymede: 'ガニメデ', callisto: 'カリスト', titan: 'タイタン', triton: 'トリトン(逆行)' });
const VC = Object.freeze({ A: '列 A f(α_e − 1)', B: '列 B f', Bp: '列 B′ α f(1 − f)', Bh: '列 (iii) (α/2) f(1 − f)' });
const KIND = Object.freeze({ zeroNode: '零点合わせ', finitePair: '有限の 2 項の拮抗' });
const cell = (c) => (c.ang === null ? `—(強さ 0)` : `${f2(c.ang)}°・${c.mag > 0 && c.mag < 1e-3 ? fe(c.mag) : f3(c.mag)}`);

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, D = J.decl, t1 = J.t1, t2 = J.t2, t3 = J.t3, t4 = J.t4;
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| ① 列 (iii) の閉じた形と数値の差分のヤコビアンの差(÷ f(1 − f) s・仰角 3 × f 3) | ${fe(S.c3.d)} | ${tf(G.c3)} |`,
    `| ② 列 (iii) の軸の上の強さ・赤道の回転の軸の成分(f ½)・赤道の向き・45° の向き | ${fe(S.c3pts.axis)}・${f3(S.c3pts.eqZ)}・${f2(S.c3pts.eqAng)}°・${f2(S.c3pts.midAng)}° | ${tf(G.c3pts)} |`,
    `| ③ 有限の受け手(R/r 1e-3)と列 (iii) の相対の差・天体が 1 つの有限の受け手の強さ | ${fe(S.c4.err)}・${fe(S.c4.single)} | ${tf(G.c4)} |`,
    `| ④ 赤道面の和: 列 B′ の和と f(2f − 1)・−列 A の差・列 (iii) の和と f² の差 | ${fe(S.view.d)}・${fe(S.view.dh)} | ${tf(G.view)} |`,
    `| ⑤ 角の求め方(atan2)の 1e-9 rad の薄い角の相対の差 | ${fe(S.thin.rel)} | ${tf(G.thin)} |`,
    `| ⑦ T1 の閉じた形の q・p の列と第338便b の twistAxis・overallAxis の差 | ${fe(S.same338.d)} | ${tf(G.same338)} |`,
    `| ⑥ 入力の拒否 | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  T.t1Main = ['| 仰角 el [°] | 列 (i) q 0: 角・強さ | 列 (ii) q 1: 角・強さ | 列 (iii) 第 2 項の回転: 角・強さ ÷ f(1 − f) s | 列 (iii) 歪み ÷ f(1 − f) s | 列 (iv) 有限の受け手(R/r 1e-4・f ½): 角・強さ ÷ f(1 − f) s | 列 (iv) と (iii) の相対の差 | 種類 (i)・(ii)・(iii)・(iv) |', '|---|---|---|---|---|---|---|---|',
    ...t1.rows.map((r) => `| ${r.elDeg} | ${cell(r.q[0])} | ${cell(r.q[1])} | ${cell(r.c3)} | ${f3(r.c3.strain)} | ${cell(r.c4)} | ${fe(r.c4.errRel)} | ${r.q[0].kind}・${r.q[1].kind}・${r.c3.kind}・${r.c4.kind} |`)].join('\n');
  T.t1Others = ['| 仰角 el [°] | ' + D.qCols.filter((q) => q !== 0 && q !== 1).map((q) => `q ${q}: 角・強さ`).join(' | ') + ' | ' + D.pCols.map((p) => `p ${p}: 角・強さ`).join(' | ') + ' |', '|---|' + D.qCols.filter((q) => q !== 0 && q !== 1).map(() => '---|').join('') + D.pCols.map(() => '---|').join(''),
    ...t1.rows.map((r) => `| ${r.elDeg} | ` + D.qCols.filter((q) => q !== 0 && q !== 1).map((q) => cell(r.q[q])).join(' | ') + ' | ' + D.pCols.map((p) => cell(r.p[p])).join(' | ') + ' |')].join('\n');
  const CN = { q0: '(i) q 0(2 倍角の則)', 'q0.25': 'q 0.25', 'q0.5': 'q 0.5', 'q0.75': 'q 0.75', q1: '(ii) q 1(⑪)', p1: 'p 1(全体に cos)', p2: 'p 2(全体に cos²)', c3: '(iii) 場の勾配の第 2 項', c4: '(iv) 有限の受け手(R/r 1e-4)' };
  T.t1Axis = ['| 列 | 軸の方向の強さ | 軸の方向で強さ 0 | 赤道の向き | 45° の向き・強さ | 45° で 90° 傾き |', '|---|---|---|---|---|---|',
    ...t1.axisZero.map((o) => `| ${CN[o.col]} | ${fe(o.axisMag)} | ${tf(o.axisZero)} | ${f2(o.eqAng)}° | ${f2(o.midAng)}°・${f3(o.midMag)} | ${tf(o.mid90)} |`)].join('\n');
  T.t1VsOld = ['| 仰角 el [°] | 列 (iii) − q 1 の向きの角の差 | 列 (iii) − q 0 の向きの角の差 | 強さの落ち方の比 (iii)/(q 1)(どちらも赤道の値で割る) |', '|---|---|---|---|',
    ...t1.rows.map((r) => `| ${r.elDeg} | ${r.vsQ1.dAng === null ? '—' : f2(r.vsQ1.dAng) + '°'} | ${r.vsQ0.dAng === null ? '—' : f2(r.vsQ0.dAng) + '°'} | ${r.vsQ1.magRatio === null ? '—' : f4(r.vsQ1.magRatio)} |`)].join('\n');
  T.t1Conv = ['| f | 仰角 [°] | W₀ の割合 φ | 受け手の並進 | R/r 1e-2 の相対の差 | 1e-3 | 1e-4 | 強さ(R/r 1e-4)÷ 閉じた形 |', '|---|---|---|---|---|---|---|---|',
    ...t1.converge.map((c) => `| ${c.f} | ${c.elDeg} | ${c.phi} | ${c.moving ? '公転の向き n/s 0.3' : '0'} | ${fe(c.err[0.01])} | ${fe(c.err[0.001])} | ${fe(c.err[0.0001])} | ${fe(c.mag)} ÷ ${fe(c.magClosed)} |`)].join('\n');
  const N0 = t1.null;
  T.t1Null = ['| 仰角 el [°] | 座標の回転(取り分 1 —— ÷ s) | 列 (iii) 第 2 項の回転 | 列 (iii) 歪み | 列 (iv) R/r 1e-2 | 列 (iv) R/r 1e-4 |', '|---|---|---|---|---|---|',
    ...N0.rows.map((r) => `| ${r.elDeg} | ${f3(r.coordRot)} | ${fe(r.c3)} | ${fe(r.c3strain)} | ${fe(r.c4)} | ${fe(r.c4small)} |`),
    `| 係数(f 1) | 強さの係数 f(1 − f) ${fe(N0.coef.ff)} | 列 B′ ${fe(N0.coef.Bp)}・列 (iii) ${fe(N0.coef.Bh)} | — | 列 A ${f3(N0.coef.A)}(座標の回転 −f を含む) | 列 B ${f3(N0.coef.B)}(取り分そのもの) |`].join('\n');
  T.t2Scan = ['| ρ = r/r_½ | f | 順の分 f | 逆の分 B′ α f(1 − f) | 和(B′)= f(2f − 1) | 和(B′)の向き | 逆の分 (iii) (α/2) f(1 − f) | 和(iii)= f² | 和(iii)の向き |', '|---|---|---|---|---|---|---|---|---|',
    ...t2.scan.map((x) => `| ${x.rho} | ${f4(x.f)} | ${f4(x.pro)} | ${f4(x.retroBp)} | ${f4(x.sumBp)} | ${sg(x.signBp)} | ${f4(x.retroH)} | ${f4(x.sumH)} | ${sg(x.signH)} |`)].join('\n');
  const bodyRow = (b, dist) => `| ${NM[b.src] || b.src} → ${NM[b.key]} | ${fe(b.srcSpin)} | ${dist} | ${f4(b.f)} | ${fe(b.pro)} | ${fe(b.retroBp)} | ${fe(b.sumBp)} | ${sg(b.signBp)} | ${fe(b.retroH)} | ${fe(b.sumH)} | ${sg(b.signH)} | ${f4(b.nOverS)}・${sg(b.selfSign)} |`;
  const head2 = '| 源 → 受け手 | 源の自転 [rad/s] | 距離 ÷ r_½(r_½) | f | 順の分 f s [rad/s] | 逆の分 B′ | 和(B′) | 和(B′)の向き | 逆の分 (iii) | 和(iii) | 和(iii)の向き | 比べる列: n/s・今の並進の式の形の符号 |';
  T.t2Planets = [head2, '|---|---|---|---|---|---|---|---|---|---|---|---|', ...t2.bodies.planets.map((b) => bodyRow(b, `${f3(b.aOverRHalf)}(${f3(b.rHalfAU)} AU)`))].join('\n');
  T.t2Moons = [head2, '|---|---|---|---|---|---|---|---|---|---|---|---|', ...t2.bodies.moons.map((b) => bodyRow(b, `${f3(b.aOverRHalf)}(${fe(b.rHalfKm)} km)`))].join('\n');
  const CF = { 120: '銀河と太陽系 120°', 180: '原始太陽系 180°', actual: `実際の角 ${f2(t3.actualDeg)}°(太陽の自転軸と L̂)` };
  T.t3Rule = ['| 配置 | 比 B/A | 主の列(普通のベクトル和)÷ A | 「どんな比でも 120°」の列 ÷ A | 持ち上げの分(差)÷ A | 主の列の境目 | 主の列で減速しない | 120° の列で減速しない |', '|---|---|---|---|---|---|---|---|',
    ...t3.rows.map((x) => `| ${CF[x.cfg]} | ${x.ratio} | ${f4(x.main)} | ${f4(x.rule120)} | ${fe(x.lift)} | ${f2(x.boundary)}° | ${j3(x.noDecelMain)} | ${tf(x.noDecel120)} |`)].join('\n');
  T.t3Bodies = ['| 受け手 | 太陽の項(列 A)[rad/s] | 背景軸引きずりの項 [rad/s] | 比 | 持ち上げの分 120° [rad/s] | 持ち上げの分 実際の角 [rad/s] | 持ち上げ ÷ 大きい側(実際の角) | 180° の持ち上げ |', '|---|---|---|---|---|---|---|---|',
    ...t3.bodies.map((b) => `| ${NM[b.key]} | ${fe(b.sunTerm)} | ${fe(b.bgTerm)} | ${fe(b.ratio)} | ${fe(b.per['120'].lift)} | ${fe(b.per.actual.lift)} | ${fe(b.per.actual.liftRel)} | ${fe(b.per['180'].lift)} |`)].join('\n');
  T.t4Venus = ['| q | 列 | 軌道の平均の因子 P | 根 f | 根の読み | 黄道の北の成分 | 自転の軸に平行(大きさを変える)÷ 尺度 | 垂直(向きを変える)÷ 尺度 | 垂直 [rad/s] | 垂直 ÷ 金星の自転 | 歳差の読みの周期 [年] | ÷ 文献の値 |', '|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...t4.venus.rows.flatMap((v) => v.roots.map((r) => `| ${v.q} | ${VC[v.col]} | ${f4(v.P)} | ${r.f < 1e-6 ? fe(r.f) : r.f.toFixed(13)} | ${KIND[r.kind]} | ${fe(r.north)} | ${f4(r.alongRel)} | ${f4(r.perpRel)} | ${fe(r.perp)} | ${fe(r.perpOverSpin)} | ${fe(r.precYr)} | ${fe(r.precOverLit)} |`))].join('\n');
  const st = t4.steady;
  T.t4Steady = ['| 量 | 値 |', '|---|---|',
    `| 太陽の自転軸 ŝ☉ と背景軸引きずりの向き L̂ の角 | ${f2(st.thDeg)}° |`, `| 和 a ŝ☉ + b L̂ の大きさ ÷ (a と b の大きさの和) の最小(比 t = a/b を 10^±8 で走査)・そのときの t | ${f4(st.minRel)}・${f3(st.tAtMin)} |`,
    `| 閉じた形 min(sin(θ/2), cos(θ/2)) | ${f4(st.minClosed)} |`, `| 3 成分とも 0 になる組が今のノブ(f・W₀・q・背景の大きさ)に在るか | ${tf(st.possible)} |`,
    `| 背景の軸の向きを ŝ☉ の線に重ねるのに要る角 | ${f2(st.tiltNeedDeg)}° |`, `| 金星の歳差の文献の値(第330便a の lib の表 —— 文献の値・未照合) | ${t4.venus.precLitArcsecPerYr}″/年(周期 ${fe(t4.venus.precLitYr)} 年) |`].join('\n');
  // T5(追加の依頼 1)
  const t5 = J.t5, FG = [...new Set(t5.rows.map((r) => r.f))], c5 = (c) => (c.ang === null ? '—(強さ 0)' : `${f2(c.ang)}°・${c.magOverF > 0 && c.magOverF < 1e-3 ? fe(c.magOverF) : f3(c.magOverF)}`);
  const grid = (nm) => ['| 仰角 el [°] | ' + FG.map((f) => `f ${f < 1e-3 ? fe(f) : f}: 角・強さ ÷ f`).join(' | ') + ' |', '|---|' + FG.map(() => '---|').join(''),
    ...D.elevDeg.map((el) => `| ${el} | ` + FG.map((f) => c5(t5.rows.find((r) => r.elDeg === el && r.f === f)[nm])).join(' | ') + ' |')].join('\n');
  T.t5A = grid('a');
  T.t5B = grid('b');
  T.t5Lim = ['| 仰角 el [°] | 2 倍角の則(第338便b の q 0): 角・強さ | (b) の和 ÷ f(f 1e-6)− q 0: 角の差・強さの差 | (a) の和 ÷ f(f 1e-6)− q 0: 角の差・強さの差 |', '|---|---|---|---|',
    ...t5.limit.vsQ0.map((r) => `| ${r.elDeg} | ${f2(r.q0Ang)}°・${f3(r.q0Mag)} | ${fe(r.b.dAng)}°・${fe(r.b.dMag)} | ${f2(r.a.dAng)}°・${f3(r.a.dMag)} |`),
    ...t5.limit.alphas.map((o) => `| α ${o.alpha}(f → 0 の極限・45°) | — | (b) ${f2(o.b.ang45)}°・${f3(o.b.mag45)} | (a) ${f2(o.a.ang45)}°・${f3(o.a.mag45)} |`)].join('\n');
  T.t5Shear = ['| f | 近い面と遠い面の速度の差 ÷ 直径 − 座標の回転 f s(R/r 1e-4)| (b) の大きさ −α f(1 − f) s | 相対の差 | 列 (iv) の回転(最小二乗)| (a) の大きさ −(α/2) f(1 − f) s | 相対の差 |', '|---|---|---|---|---|---|---|',
    ...t5.shear.map((x) => `| ${x.f} | ${f4(x.shearMinusCoord)} | ${f4(x.wantB)} | ${fe(x.relB)} | ${f4(x.rotFitZ)} | ${f4(x.wantA)} | ${fe(x.relA)} |`)].join('\n');
  return T;
}

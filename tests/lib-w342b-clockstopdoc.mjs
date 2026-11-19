// 第342便b(原仮定者の回答(2026-11-18 —— 第142報)AN806・統括の検証項目 R373): **正本 tests/out/clockstop-342b.json から PHYSICS〔第342便b〕の表を作る文書の lib**
// (QA docs.clockstop342b が節の表と逐語で照合する —— 比は小数 4 桁か有効数字 3 桁の指数・丸めで 0 と書いた値は「0」・小さい差は「< 床」の形で、丸めの残りの数は載せない)。
export const DOC_VERSION = 'w342b-clockstopdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f4 = (x) => (x === 'inf' || x === Infinity ? '∞' : x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Math.abs(x) < 1e-4 ? '< 1e-4' : Math.abs(x) >= 1e4 ? Number(x).toExponential(2) : x.toFixed(4));
const f2 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x.toFixed(2));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : 'null');
const yn = (x) => (x ? 'はい' : 'いいえ');
const gv = (x) => (x === null ? '定義域の外' : f4(x));

export const TYPE_NAME = Object.freeze({ F: 'F(局所光速で止まる —— √(1 − x²)・今の点の時計の形)', U1: 'U1(速さが無限で止まる —— 1/√(1 + x²))', U2: 'U2(同 —— 1/(1 + x²/2))', U3: 'U3(同 —— exp(−x²/2))' });
export function clockLabel(type, n) { return (TYPE_NAME[type] ? type : type) + (n === null || n === undefined ? '' : '・n = ' + n); }
export function lmLabel(lab, k) {
  if (lab === 'type0') return '(0) 今のアプリ(加速の係数 1)';
  if (lab === 'type1') return '(1) 場の係数を共有する型・ψ = ' + k.psi;
  if (lab === 'type2') return '(2) 加速の効きが落ちる型・p = ' + k.p;
  if (lab === 'type3') return '(3) 放射の抵抗の型・' + k.form + '・ε₊ = ' + k.eps;
  return lab;
}

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, D = J.decl;
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| ① 静止(x = 0)で全部の型の g が 1(丸めの 1 bit の内) | ${S.g0 ? 'はい' : 'いいえ'} | ${tf(G.g0)} |`,
    `| ② 低速で全部の型が同じ 1 − x²/2(c₂ + ½ の大きさの最大)・c₄ の数値と閉じた形の差の最大 | < 1e-6・< 1e-5 | ${tf(G.lowSame)} |`,
    `| ③ T3 の恒等式(U1 に粒子の時計で測った速さを入れたものと F の差の最大) | < 1e-15 | ${tf(G.identity)} |`,
    `| ④ 到達の時間の閉じた形と Simpson の相対の差の最大 | < 1e-9 | ${tf(G.closedQuad)} |`,
    `| ⑤ 同じ絶対時間の x・粒子の時計の閉じた形と RK4 の差の最大 | < 1e-9 | ${tf(G.closedOde)} |`,
    `| ⑥ 第341便e の曲線と同じ式(F・n = 1 = 型 (2) p = ½・F・n = 3 = 型 (1) ψ = 0)の差の最大 | < 1e-12 | ${tf(G.sameAs341e)} |`,
    `| ⑦ 入力の拒否(型が無い・x が負・F の x > 1 は 0 でなく定義域の外・べきが無い) | ${S.reject.n}/${S.reject.of} | ${tf(G.reject)} |`].join('\n');

  T.t1 = ['| 時計の型 | ' + D.xGrid.map((x) => 'g(x = ' + x + ')').join(' | ') + ' | 止まる x | 低速の展開 x⁴ の係数(数値)| 同(閉じた形)|', '|---|' + D.xGrid.map(() => '---|').join('') + '---|---|---|']
    .concat(J.t1.rows.map((r) => `| ${TYPE_NAME[r.type]} | ${r.g.map(gv).join(' | ')} | ${r.stopX === 'inf' ? '∞' : r.stopX} | ${r.c4.toFixed(4)} | ${r.c4Closed.toFixed(4)} |`)).join('\n')
    + '\n\n(g = 静止した局所の時計 N = e^(−ψ) に対する比。どの型も x² までは 1 − x²/2(数値の x² の係数は全部 −0.5000)—— 違いは x⁴ の係数から。F の x > 1 は「定義域の外」(アプリは根号の中が 0 以下なら時計の加算を 0 にする —— 0 と書かない))';

  const tag = (r) => clockLabel(r.type, r.n);
  T.t2reach = ['| 時計の型・駆動のべき | 時計が止まる所 | ' + D.xReach.map((x) => 'x = ' + x + ' に届く T').join(' | ') + ' | x = 1 に有限の時間で届く | x = 1 を通り抜ける | 近付き方 |', '|---|---|' + D.xReach.map(() => '---|').join('') + '---|---|---|']
    .concat(J.t2.rows.map((r) => `| ${tag(r)} | ${r.clockStops} | ${r.tReach.map((v) => (v === null ? '定義域の外' : f4(v))).join(' | ')} | ${yn(r.reachesOneFinite)}${r.reachesOneFinite ? '(T = ' + f4(r.tAtOne) + ')' : ''} | ${yn(r.passesOne)} | ${r.asym} |`)).join('\n')
    + '\n\n(一様な場・初速 0。T = a* N^n t ÷ c_loc。n = 1 は「粒子の時計 1 秒あたり同じ速度の増し分」dw/dτ = a*(dw/dt = a* N g)・n = 2 は d²/dt² = (dτ/dt)² d²/dτ² の読み(dw/dt = a* N² g²)。〔訂正(第343便c・統括の検証項目 R380): この読みは一般の連鎖律としては項が 1 つ足りない —— 正しくは d²p/dt² = (dτ/dt)² d²p/dτ² + (d²τ/dt²)(dp/dτ)。べき 2 の列の数は「時計の進みの二乗を掛ける、別の駆動の宣言」として有効で、数は変わらない(足りない項を入れた読みは〔第343便c〕の表)〕閉じた形と Simpson の相対の差は全部 1e-9 より小さい)';

  T.t2x = ['| 時計の型・駆動のべき | ' + D.tRead.map((t) => 'x(T = ' + t + ')').join(' | ') + ' |', '|---|' + D.tRead.map(() => '---|').join('')]
    .concat(J.t2.rows.map((r) => `| ${tag(r)} | ${r.xAtT.map(f4).join(' | ')} |`)).join('\n');
  T.t2theta = ['| 時計の型・駆動のべき | ' + D.tRead.map((t) => 'θ(T = ' + t + ')').join(' | ') + ' |', '|---|' + D.tRead.map(() => '---|').join('')]
    .concat(J.t2.rows.map((r) => `| ${tag(r)} | ${r.thetaAtT.map(f4).join(' | ')} |`)).join('\n')
    + '\n\n(θ = a* N^(n−1) τ ÷ c_loc は粒子の時計(dθ/dT = g)。n = 1 では θ = x(駆動の宣言そのもの)。F・n = 1 は T = π/2 で x = 1 に届き、その後はこの駆動では g = 0 なので x も θ も留まる)';

  T.t3 = ['| x(絶対時間で測った速さ ÷ c_loc)| y = x/√(1 − x²)(粒子の時計で測った速さ)| U1(y)| F(x)| U1(x)(同じ x で比べた U1)|', '|---|---|---|---|---|']
    .concat(J.t3.rows.map((r) => `| ${r.x} | ${f4(r.y)} | ${f4(r.u1OfY)} | ${f4(r.fOfX)} | ${f4(r.u1OfX)} |`)).join('\n')
    + '\n\n(1/√(1 + y²) = √(1 − x²) —— U1 に粒子の時計で測った速さを入れると F と同じ時計(差の最大 < 1e-15)。2 つの場合を比べる列は、両方とも同じ x で読む)';

  T.t4 = ['| 第341便e の候補の型(一定の力)| ' + J.t4.tRead.map((t) => 'x(T = ' + t + ')').join(' | ') + ' | 同じ曲線になる時計の型・べき |', '|---|' + J.t4.tRead.map(() => '---|').join('') + '---|']
    .concat(J.t4.rows.map((r) => `| ${lmLabel(r.label, r.knob)} | ${r.x.map((v) => (v === null ? '— (越えた後)' : f4(v))).join(' | ')} | ${r.sameAs ? clockLabel(r.sameAs.type, r.sameAs.n) + (r.sameAs.n === 3 ? '(参考の列)' : '') + (r.sameAs.nPts < J.t4.tRead.length ? '(x ≤ 1 の ' + r.sameAs.nPts + ' 点)' : '') : '無い'} |`)).join('\n')
    + '\n\n(第341便e の τ = t/t_N(t_N = m c_loc/F)は a* N = F/m と置くと T と同じ物差し —— 低速で dx/dT = 1。「同じ曲線」は 6 点〔R1 は x ≤ 1 の点〕の差の最大が 1e-12 より小さいもの。F の n は (1 − x²)^(n/2) なので型 (2) の p と n = 2p で重なる)';

  const Df = J.t5.defl, key = (x) => x.type + '|' + x.n + '|' + x.xInf;
  const keys = Df[0].rows.map(key);
  T.t5 = ['| 粒子・駆動のべき | 寄せる速さ x∞ | 曲がり ÷ 光(b = ' + Df.map((g) => fe(g.bOverMu) + ' μ').join(')| 同(b = ') + ')| 弱い場の一次の閉じた式 ÷ 光 | 定義域の外を通る |', '|---|---|' + Df.map(() => '---|').join('') + '---|---|']
    .concat(keys.map((k) => { const xs = Df.map((g) => g.rows.find((x) => key(x) === k)), x0 = xs[0];
      const nm = x0.type === 'light' ? '光(屈折率 e^(2ψ))' : x0.type === 'type0' ? '今のアプリ(加速の係数 1 —— 第341便e の型 (0))' : clockLabel(x0.type, x0.n);
      return `| ${nm} | ${x0.xInf} | ${xs.map((x) => f4(x.overLight)).join(' | ')} | ${f4(x0.closed / 4)} | ${x0.byDecl ? 'はい(宣言で直進 —— 走らせない)' : yn(x0.outside)} |`; })).join('\n')
    + '\n\n(読み: 加速 × g(x)^n を重力の加速にも当てた宣言 —— 時計の型だけでは経路は決まらない。弱い場の一次の閉じた式 = 2 g(x∞)^n/x∞² × μ/b(光は 4 μ/b)。角は第340便h の `thinAngle`。F の x∞ = 1 は内へ落ちると x > 1(定義域の外)で、宣言では加速の係数 0 —— 直進)';

  T.photon = ['| 時計の型 | x = 1 での g | 光子の時計にそのまま使えるか |', '|---|---|---|']
    .concat(J.t5.photon.map((p) => `| ${TYPE_NAME[p.type]} | ${f4(p.gAtOne)} | ${p.gAtOne === 0 ? 'x = 1 で止まる(今の点の時計の形)' : 'いいえ —— x = 1 で時計が進む(質量 0 の経路を別に宣言するか、同じ運動量の則から光線が出るかを別に試す)'} |`)).join('\n');

  const P = J.t6.pn;
  T.t6 = ['| 時計の型・駆動のべき | 近点の回り ÷ 1PN(数値・μ = ' + fe(1e-5) + ')| 一次の閉じた形 ÷ 1PN | 水星へ写した ″/世紀(1PN ' + f2(P.arcsecCy) + ')|', '|---|---|---|---|']
    .concat(J.t6.rows.map((r) => `| ${clockLabel(r.type, r.n)} | ${f4(r.overPN)} | ${f4(r.closed)} | ${f2(r.arcsecCy)} |`)).join('\n')
    + '\n' + J.t6.same.map((s) => `| 第341便e の器そのもの(型 (2) p = ${s.p} —— F・n = ${s.n} と同じ係数) | ${f4(s.overPN)} | ${f4(-s.n / 6)} | ${f2(s.arcsecCy)} |`).join('\n')
    + '\n\n(加速 × g^n を水星の重力に当てた宣言で、今の収支 42.98″/世紀を動かす量 —— **アプリには足さない**。一次では全部の型が −n/6 倍の 1PN(g の x² の係数 −½ が全部の型で同じ)。第341便e の (2) の −p/3 倍と、p = n/2 で同じ数)';

  T.t6diff = ['| 時計の型・駆動のべき | 型 F との差 ÷ μ(μ = ' + J.decl.muDiff.map(fe).join(')| 同(μ = ') + ')| μ → 0 へ寄せた値 | ÷ n(c₄(U) − c₄(F))| 水星へ写した差 ″/世紀 |', '|---|' + J.decl.muDiff.map(() => '---|').join('') + '---|---|---|']
    .concat(J.t6.diffs.map((d) => `| ${clockLabel(d.type, d.n)} | ${d.dOverMu.map(f4).join(' | ')} | ${f4(d.coef)} | ${f4(d.perDc4)} | ${fe(d.mercuryArcsecCy)} |`)).join('\n')
    + `\n\n(差は近点の回り ÷ 1PN の差。型の間の差は x⁴ の係数 n(c₄(U) − c₄(F))から出る —— ÷ の列が型に依らずそろう。水星の ψ = ${fe(P.psi)} へ写すと、型の間の差は 1e-6″/世紀より小さい)`;
  return T;
}

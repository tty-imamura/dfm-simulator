// 第341便e(原仮定者の補足(2026-11-18 —— 第141報)・統括の検証項目 R368): **正本 tests/out/lightmass-341e.json から PHYSICS〔第341便e〕の表を作る文書の lib**
// (QA docs.lightmass341e が節の表と逐語で照合する —— 比は小数 4 桁か有効数字 3 桁の指数・丸めで 0 と書いた値は「0」・1e-4 より小さい比は「< 1e-4」の形で、丸めの残りの数は載せない)。
export const DOC_VERSION = 'w341e-lightmassdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f4 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Math.abs(x) < 1e-4 ? '< 1e-4' : x.toFixed(4));
const f2 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x.toFixed(2));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : 'null');
const yn = (x) => (x ? 'はい' : 'いいえ');
const ROLE = Object.freeze({ control: '対照', replace: '置き換えの型', part: '置き換えの型の静止の部分', add: '足す型' });

export function typeLabel(type, k = {}) {
  if (type === 0 || type === 'type0') return '(0) 今のアプリ(対照)';
  if (type === 1 || type === 'type1') return '(1) 場の係数を共有する型' + (k.psi !== undefined ? '・ψ = ' + k.psi : '');
  if (type === 'type1static') return '(1) の静止の部分(e^(−4ψ) ∇ψ)';
  if (type === 2 || type === 'type2') return '(2) 加速の効きが落ちる型・p = ' + k.p;
  if (type === 3 || type === 'type3') return '(3) 放射の抵抗の型・' + k.form + (k.eps !== undefined ? '・ε₊ = ' + k.eps : '') + (k.sym === undefined ? '' : k.sym ? '・対称' : '・非対称');
  if (type === 'light') return '光(屈折率 e^(2ψ))';
  return String(type);
}

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| ① 型 (1) の m = 0: 速さ ÷ c_loc − 1(P の大きさ 3 つ × ψ 3 つの最大) | ${S.m0Speed === 0 ? '0' : '< 1e-14'} | ${tf(G.m0Speed)} |`,
    `| ② 型 (2) p = 3⁄2 と型 (1) ψ = 0 の β(τ) が同じ(4 点の差の最大) | ${S.p32Same === 0 ? '0' : '< 1e-15'} | ${tf(G.p32Same)} |`,
    `| ③ 加速に要るエネルギーの求積と閉じた式(型 (2)・型 (3) の相対の差の最大) | < 1e-9 | ${tf(G.energyQuad)} |`,
    `| ④ 光の H(c_loc の大きさ × P の大きさ)が静かな場で保存(衝突径数 1e3 μ の走り) | < 1e-10 | ${tf(G.hDrift)} |`,
    `| ⑤ 型 (1) の速さ ÷ c_loc の走りの最大(β∞ 0.999・b = 1e3 μ) | ${f4(S.type1wMax)} | ${tf(G.type1Sub)} |`,
    `| ⑥ 入力の拒否 | ${S.reject.n}/${S.reject.of} | ${tf(G.reject)} |`].join('\n');

  const R1 = J.t1.rows, br = J.decl.betaRead, tr = J.decl.tauRead;
  T.t1 = ['| 型 | β(τ = ' + tr.join(')| β(τ = ') + ')| c_loc に達する | c_loc を越える | 近付き方 |', '|---|---|---|---|---|---|---|']
    .concat(R1.filter((r) => !(r.type === 3 && r.knob.sym === false)).map((r) => `| ${typeLabel(r.type, r.type === 3 ? { form: r.knob.form, eps: r.knob.eps } : r.knob)} | ${r.betaAtTau.map((b) => (b === null ? '— (越えた後)' : f4(b))).join(' | ')} | ${yn(r.reaches)}${r.tauCross !== null ? '(τ = ' + f4(r.tauCross) + ')' : ''} | ${yn(r.crosses)} | ${r.asymptote} |`)).join('\n')
    + '\n\n(τ = t/t_N・t_N = m c_loc/F は今のアプリで c_loc に達する時刻。型 (0) の β > 1 は時計が止まる領域 —— 運動の式は止めない。型 (3) は減速の列で β(τ) が変わらないので対称の行だけ)';

  T.t1energy = ['| 型 | 要るエネルギー ÷ ½ m w²(β = ' + br.join(')| 同(β = ') + ')| 1 往復の損失 ÷ ½ m w²(β = ' + br.join(')| 同(β = ') + ')|', '|---|---|---|---|---|---|---|']
    .concat(R1.map((r) => `| ${typeLabel(r.type, r.knob)} | ${r.energyRatio.map(f4).join(' | ')} | ${r.cycleLoss.map(f4).join(' | ')} |`)).join('\n')
    + '\n\n(1 往復の損失 = 0 → β → 0 で、加速に要るエネルギー − 減速で戻るエネルギー —— 原仮定者の推測(2026-11-14 —— 第138報)の「加速の方がわずかに多くのエネルギーが必要」に当たる量。型 (0)・(1)・(2) は保存の型で 0)';

  const D = J.t2.defl;
  const keyOf = (x) => x.kind + JSON.stringify(x.knob);
  const rowsKeys = D[0].rows.map(keyOf);
  T.t2 = ['| 粒子 | 寄せる速さ β∞ | 曲がり ÷ (μ/b)(b = ' + D.map((g) => fe(g.bOverMu) + ' μ').join(')| 同(b = ') + ')| ÷ 光(b = ' + D.map((g) => fe(g.bOverMu) + ' μ').join(')| 同(b = ') + ')| 弱い場の一次の閉じた式 ÷ (μ/b) |', '|---|---|---|---|---|---|---|---|---|']
    .concat(rowsKeys.map((k) => { const xs = D.map((g) => g.rows.find((x) => keyOf(x) === k)), x0 = xs[0];
      return `| ${typeLabel(x0.kind, x0.knob)} | ${x0.knob.beta === undefined ? '1(c_loc)' : x0.knob.beta} | ${xs.map((x) => f4(x.alphaOverMuB)).join(' | ')} | ${xs.map((x) => f4(x.overLight)).join(' | ')} | ${f4(x0.closed)} |`; })).join('\n')
    + '\n\n(角は第340便h の `thinAngle`(atan2(外積の大きさ, 内積))で読み、端の欠けは一次の形で戻した。型 (1) の β∞ は c_loc に対する比・m = 1。型 (2) の β∞ = 0.999 は場の中で c_loc に届いて加速が 0 になる区間がある)';

  T.ruler = ['| ψ(r₁)| ψ(2r₁)| ∫ c_loc dt ÷ L | c₀ t ÷ L | c_loc(2r₁) t ÷ L | c_loc(r₁) t ÷ L | 外側の時計 τ × c₀ ÷ L | 波長の数 × λ₀ ÷ L |', '|---|---|---|---|---|---|---|---|']
    .concat(J.t2.ruler.map((x) => `| ${fe(x.psi1)} | ${fe(x.psi2)} | ${f4(x.cLocInt)} | ${f4(x.c0t)} | ${f4(x.cLocOuterT)} | ${f4(x.cLocInnerT)} | ${f4(x.tauOuter)} | ${f4(x.wavelengths)} |`)).join('\n')
    + '\n\n(区間は動径の r₁〜2r₁・L = 座標の長さ・t = 片道の座標の時間 ∫ dr/c_loc。波長は今のアプリの光線の色の式 λ = λ₀ e^(ψ₀ − ψ)(ψ₀ は外側の端)。外側の時計 τ = N(2r₁) t)';

  const P = J.t3.pn;
  T.t3 = ['| 型 | 置き換えか足すか | 近点の回り ÷ 1PN(数値)| 閉じた式 ÷ 1PN | 水星の ″/世紀(1PN ' + f2(P.arcsecCy) + ')| 1 周の ln a の変化 ÷ (μ/a) |', '|---|---|---|---|---|---|']
    .concat(J.t3.rows.map((r) => `| ${typeLabel(r.kind, r.knob)} | ${ROLE[r.role]} | ${f4(r.overPN)} | ${r.closed === null ? '求積だけ' : f4(r.closed)} | ${f2(r.mercuryArcsecCy)} | ${r.dLnAperOrbit === 0 ? '0' : f4(r.dLnAperOrbit / J.decl.orbit.mu)} |`)).join('\n')
    + `\n| (1) を今の重力に足した場合(2 度足す) | 足す型(使えない) | — | 周期 ${f4(J.t3.twice.periodRatio)} 倍・1PN の回り ${f4(J.t3.twice.pnRatio)} 倍 | — | — |`
    + `\n\n(誇張した場 μ/a = ${fe(J.decl.orbit.mu)}・e = 水星・1 周 ${J.decl.orbit.stepsPerOrbit} 刻み × ${J.decl.orbit.nOrb} 周の比を水星へ写した値 —— 弱い場の一次の比。型 (3) の ε₊ = ${J.decl.orbit.eps3} —— 効きは ε₊ に比例)`;

  T.gps = ['| 型 (2) の p | 衛星の β² | GPS の運動の項(−7.2 μs/日)の動き [μs/日] |', '|---|---|---|']
    .concat(J.t3.gps.map((g) => `| ${g.p} | ${fe(g.beta2)} | ${fe(g.motionShiftUsPerDay)} |`)).join('\n');

  const Z = J.t4, sp = Z.staticPair, lo = Z.low;
  T.zero = ['| 零試験 | 値 |', '|---|---|',
    `| 天体が 1 つ(u に運ばれるだけ・w = 0): 型 (1) の速さの u からのずれ・力・型 (3) の熱 | ${fe(Z.single.maxSlip)}・${fe(Z.single.maxForce)}・${fe(Z.single.maxHeat)} |`,
    `| 離して静止させた 2 体(水星の距離 ψ = ${fe(sp.psi)}): 加速度 ÷ G₀M/r² —— (0)・(2)・(3) | ${sp.type0}・${sp.type2}・${sp.type3} |`,
    `| 同 —— (1) を置き換えに使う(e^(−4ψ)) | 1 − ${fe(1 - sp.type1replace)} |`,
    `| 同 —— (1) を今の重力に足す(2 度足す —— 使えない) | ${f4(sp.type1added)} |`,
    `| 低速の極限: 加速度の今のアプリとの相対の差の次数(β = 1e-2〜1e-4)—— (1) ψ = 0・(2) p = ½・1・3⁄2・(3) R1・R2 | ${[lo.type1psi0].concat(lo.type2, lo.type3).map((x) => f2(x.order)).join('・')} |`,
    `| 同 —— (1) ψ = 0.1 の 0 次の差(e^(−3ψ) − 1 —— 実効の慣性の係数 e^(3ψ)) | ${f4(lo.type1psi01.zerothOrder)} |`].join('\n');

  T.speeds = ['| 速さの定義 | 何の量か | 光速との関係の扱い | 数(本便までの表) |', '|---|---|---|---|',
    '| 座標を運ぶ速さ u | 源の移動と回転が座標を運ぶ速さ(並進引きずり) | 判定に使わない(原仮定者の指示(2026-11-17 —— 第140報)「光速を超えるか超えないかは判断基準にならない」) | 第340便e: 剛体の型で 7 系が 82〜2070 c・受け手の自己の重みの型で 8.5〜26 桁下がる |',
    '| 場に対する物質の相対の速さ w = 大きさ(v − u) | 今の時計の式の w・本器の β = w/c_loc | 型ごとに表(T1)—— 型 (1)・(2)・(3) R2 は c_loc を越えない・型 (0)・(3) R1 は越える | 本器の T1〜T3 |',
    '| 局所で測る速さ | その場の時計と物差しで測る速さ | 本便は数にしていない | — |'].join('\n');
  return T;
}

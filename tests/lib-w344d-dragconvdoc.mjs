// 第344便d(原仮定者の回答(2026-11-19 —— 第143報の回答 2)・同 回答 3 AN876・統括の検証項目 R388): **正本 tests/out/dragconv-344d.json から PHYSICS〔第344便d〕の表を作る文書の lib**
// (QA docs.dragconv344d が節の表と逐語で照合する —— 比は小数 6 桁か有効数字 3 桁の指数・丸めで 0 と書いた値は「0」・小さい差は「< 床」の形で、丸めの残りの数は載せない)。
export const DOC_VERSION = 'w344d-dragconvdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f6 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Math.abs(x) < 1e-6 ? '< 1e-6' : x.toFixed(6));
const f2 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x.toFixed(2));
const lt = (x, fl) => (x === 0 ? '0' : Math.abs(x) < fl ? '< ' + fl.toExponential(0) : fe(x));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : 'null');

export const DRAG_NAME = Object.freeze({ none: '引きずりなし', D0: 'D0 掛けない(今の步)', D1: 'D1 移送の増し分に受け手の q', D2: 'D2 枠の速度を源の q で読む', D3: 'D3 移送の重みに受け手の q', DC: 'DC 対照: q を 3 か所に重ねる' });
export const GRAV_NAME = Object.freeze({ none: 'ニュートンだけ', i: '(i) G_loc n_G = 2(今の步)', iii: '(iii) 同じ G_loc を当事者時間 1 秒あたり' });

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| ① 静止(ψ = 0・x = 0)で q = 1(型 F・U1)・時計の型の 2 つの呼び口が定義域の内で同じ | ${S.q0 ? 'はい' : 'いいえ'} | ${tf(G.q0)} |`,
    `| ② q − 1 を丸めで桁を失わない形と素の形の相対の差(ψ = 1e-3・x = 0.03) | ${lt(S.qmRel, 1e-9)} | ${tf(G.qm)} |`,
    `| ③ 2 体の solve の閉じた形の残り・移送の運動量 Σ m u(D0) | ${lt(S.solveRes, 1e-15)}・${lt(S.momMax, 1e-18)} | ${tf(G.solve)} |`,
    `| ④ 試験粒子の極限で D2 = D0・D1 と D3 の移送の分の相対の差 | ${S.d2eq0 ? 'はい' : 'いいえ'}・${fe(S.d13)} | ${tf(G.testLimit)} |`,
    `| ⑤ 入力の拒否(宣言が無い・型が無い・x が負・重力の宣言が無い) | ${S.reject.n}/${S.reject.of} | ${tf(G.reject)} |`].join('\n');

  T.t1 = ['| 今のアプリの步の所 | コード(beta の html —— 読むだけ) | どの時間で足しているか |', '|---|---|---|']
    .concat(J.t1.steps.map((a) => `| ${a.part} | ${a.code} | ${a.time} |`)).join('\n');

  T.decl = ['| 宣言 | 移送の速度 dp_i/dt − v_i(2 体の solve —— (I + L) u = s) | 試験粒子(源は静止・β = 10μ/r)の dp/dt | 状態 |', '|---|---|---|---|',
    '| D0 掛けない | u_i | (1 − β/(1 + β)) v | 候補(今の步) |',
    '| D1 移送の増し分に受け手の q | q_i u_i | (1 − q β/(1 + β)) v | 候補 |',
    '| D2 枠の速度を源の q で読む | s_i = Σ_j a_ij q_j (v_j − v_i) で解いた u_i | D0 と同じ(源の q = 1) | 候補 |',
    '| D3 移送の重みに受け手の q | a_ij → q_i a_ij で解いた u_i | (1 − q β/(1 + q β)) v | 候補 |',
    '| DC 対照(相対の速度・増し分・位置を進める所に重ねる) | q_i v_i − v_i + q_i³ u_i | q (1 − q² β/(1 + β)) v | 対照 |'].join('\n');

  const z = J.t2zero, zz = (arr, k, fl) => arr.map((r) => `${r.drag} ${lt(r[k], fl)}`).join('・');
  T.zero = ['| 零試験 | 宣言ごとの差の最大(D0 の步との差・動く枠は静止の枠を u t ずらした軌道との差) | 門 |', '|---|---|---|',
    `| ① 静止(全部の速度 0・背景 ψ₀ = ${J.decl.zero.psi0}) | ${zz(z.rest, 'maxDiff', 1e-15)} | ${tf(J.gates.t2Rest)} |`,
    `| ② 一様な場(源なし・背景 ψ₀ = ${J.decl.zero.psi0} —— 移送は 0 なので dp/dt = v との差) | ${zz(z.uniform, 'maxDiff', 1e-15)} | ${tf(J.gates.t2Uniform)} |`,
    `| ③ 一様に動く枠(2 体と枠が u = ${J.decl.zero.boost} —— 2 周) | ${zz(z.boost, 'maxShift', 1e-11)} | ${tf(J.gates.t2Boost)} |`].join('\n')
    + '\n\n(D0〜D3 は 3 つとも差 0〔動く枠は 1e-11 より小さい〕。対照 DC は ② と ③ で差が出る —— 位置を進める所の q が、引きずりの無い一様な場でも位置の進みを変え、一様に動く枠で同じにならない)';

  const t3 = J.t3, at = (g, d, t) => t3.rows.find((r) => r.grav === g && r.drag === d && r.type === t);
  T.t3 = ['| 重力 | 引きずり | 型 F | 型 U1 | 見込み(一次) | 見込みとの差(F) | ″/世紀(F —— × 42.98) | 刻みを半分にした差の最大 |', '|---|---|---|---|---|---|---|---|']
    .concat(J.decl.gravs.flatMap((g) => ['none'].concat(J.decl.drags).filter((d) => !(g === 'none' && d === 'none')).map((d) => { const a = at(g, d, 'F'), b = at(g, d, 'U1');
      return `| ${GRAV_NAME[g]} | ${DRAG_NAME[d]} | ${f6(a.overPN)} | ${f6(b.overPN)} | ${a.expect === null ? '数で読む' : f6(a.expect)} | ${a.dExpect === null ? '—' : fe(a.dExpect)} | ${f2(a.arcsecCy)} | ${fe(Math.max(a.halfDiff, b.halfDiff))} |`; }))).join('\n')
    + `\n\n(近点の進み ÷ 弱い場の 1PN —— 正が進み。中心は固定の質点・試験粒子・a = 1・μ = ${J.decl.orbit.mu}・e = ${J.decl.orbit.e}・1 周 ${J.decl.orbit.steps[1]} 刻み〔差は ${J.decl.orbit.steps[0]} 刻みとの差〕・近点 ${J.decl.orbit.nOrb} 回の差の平均。重力だけの段は第343便b の apsidalPT を呼んだ数。数は誇張した場の比で、見込みとの差〔4e-4 より小さい〕は μ の二次の項。水星の 1PN は ${f2(t3.pn.arcsecCy)}″/世紀)`;

  T.slope = ['| 宣言 − D0 | μ = 1e-4 の差 | 差 ÷ μ | μ = 2e-4 の差 ÷ μ | μ = 4e-4 の差 ÷ μ | 読み |', '|---|---|---|---|---|---|']
    .concat(t3.slope.map((s) => { const r = s.rows, read = s.drag === 'DC' ? '差が μ に依らない(一次 —— 約 +1/3)' : s.drag === 'D2' ? '差 0(試験粒子では D0 と同じ)' : '差 ÷ μ がほぼ一定(二次)';
      return `| ${DRAG_NAME[s.drag]} | ${fe(r[0].diff)} | ${s.drag === 'D2' ? '0' : f2(r[0].perMu)} | ${s.drag === 'D2' ? '0' : f2(r[1].perMu)} | ${s.drag === 'D2' ? '0' : f2(r[2].perMu)} | ${read} |`; })).join('\n')
    + '\n\n(ニュートンだけ・型 F・1 周 6000 刻み。q = 1 − ψ − x²/2 + … の補正は K1 の項〔一次〕に ψ・x² の桁を掛けるので二次。DC は位置を進める所の q が重力の軌道そのものに一次で効く)';

  T.mercury = ['| 宣言 | 差 ÷ μ(μ = 1e-4) | 実の水星の場(GM/(c² a) = ' + fe(t3.muMerc) + ')での差の見込み(″/世紀 —— 差 ÷ μ × GM/(c² a) × 42.98) |', '|---|---|---|']
    .concat(t3.mercury.map((r) => `| ${DRAG_NAME[r.drag]} | ${r.drag === 'D2' ? '0' : f2(r.perMu)} | ${r.drag === 'D2' ? '0' : fe(r.estArcsecCy)} |`)).join('\n')
    + '\n\n(二次の宣言 D1・D3 は差 ÷ μ が一定の読みで外挿した桁。対照 DC は一次なので外挿は当たらない —— 参考の列)';

  T.added = ['| 足した列(重力 (i) + 引きずり —— 型 F) | 近点 ÷ 1PN | ″/世紀(× 42.98) |', '|---|---|---|']
    .concat(t3.added.map((r) => `| ${DRAG_NAME[r.drag]} | ${f6(r.overPN)} | ${f2(r.arcsecCy)} |`)).join('\n')
    + '\n\n(今の収支 −28.65 + 71.63 = 42.98″/世紀〔G_loc n_G = 2 受け手 + K1〕は動かさない —— この表は宣言を変えたときの和を別に置いた列。誇張した場の二次の項を含む)';

  T.cross = ['| 重力 | 型 | 交差の項(両方 − 重力だけ − K1 だけ —— D0) |', '|---|---|---|']
    .concat(t3.cross.map((r) => `| ${GRAV_NAME[r.grav]} | ${r.type} | ${fe(r.cross)} |`)).join('\n');

  T.t4 = ['| 宣言 | 型 | 近点の数 | 近点ごとの E の変化の最大(÷ E₀) | 近点ごとの E の変化の傾き(1 周あたり) | 移送の運動量の積み(3 周目の近点) | 同(最後の近点) |', '|---|---|---|---|---|---|---|']
    .concat(J.t4.rows.map((r) => `| ${DRAG_NAME[r.drag]} | ${r.type} | ${r.nPeri} | ${fe(r.dEPeriMax)} | ${lt(r.dESlope, 1e-12)} | ${lt(r.xpHalf, 1e-14)} | ${lt(r.xpEnd, 1e-14)} |`)).join('\n')
    + `\n\n(2 体〔質量 0.01・0.005・a = 1・e = 0.3〕・ニュートンの重力・移送の重み a_ij = 10 m_j/r の solve・RK4 1 周 ${J.decl.pair.stepsPerOrbit} 刻み・${J.decl.pair.orbits} 周。移送の運動量の積み = 大きさ(∫ Σ m (dp/dt − v) dt)÷(Σ m 大きさ(v₀) × a)—— 重心が移送で運ばれた量。E はニュートンの K + U を近点の直後の刻みで読む〔近点の位相のずれが刻み 1 つ分残る〕)`;

  T.t5 = ['| 天体 | 場 | ψ = GM/(c² a) | x²/2 | q − 1(型 F) | q − 1(型 U1) |', '|---|---|---|---|---|---|']
    .concat(J.t5.rows.map((r) => `| ${r.name} | ${r.frame} | ${fe(r.psi)} | ${fe(r.halfX2)} | ${fe(r.qm1F)} | ${fe(r.qm1U1)} |`)).join('\n')
    + '\n\n(率〔軸引きずりの ω・回転引きずりの帯の場〕に q を掛けたときの相対の変化は q − 1 —— 率の形に依らない。月の地球の場の行の ψ は太陽と地球の和。GM と長半径は標準の値 —— 文献の値・未照合。速さは円軌道の √(GM/a))';
  return T;
}

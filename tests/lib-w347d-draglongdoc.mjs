// 第347便d(原仮定者の回答(2026-11-21 —— 第145報)「AN909: 推奨で進める」・統括の検証項目 R403): **正本 tests/out/draglong-347d.json から PHYSICS〔第347便d〕の表を作る文書の lib**
// (QA docs.draglong347d が節の表と逐語で照合する —— 比は小数 6 桁か有効数字 3 桁の指数・丸めで 0 と書いた値は「0」・小さい値は「< 床」の形で、丸めの残りの数は載せない)。
export const DOC_VERSION = 'w347d-draglongdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f6 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Math.abs(x) < 1e-6 ? '< 1e-6' : x.toFixed(6));
const f2 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x.toFixed(2));
const lt = (x, fl) => (x === 0 ? '0' : Math.abs(x) < fl ? '< ' + fl.toExponential(0) : fe(x));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : 'null');

export const DRAG_NAME = Object.freeze({ none: '引きずりなし', D0: 'D0 掛けない(主)', D1: 'D1 移送の増し分に受け手の q', D2: 'D2 枠の速度を源の q で読む', D3: 'D3 移送の重みに受け手の q' });
export const GRAV_NAME = Object.freeze({ cur: '現行の近似 (0)(絶対時間・指数 2)', alpha1: '(α) 速度の増し分を当事者時間で(指数 1)' });

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| ① 多体の移送(N = 2)と第344便d の 2 体の移送の相対の差・3 つ目の質量 0 の N = 3・T2 の速い右辺 | ${lt(S.pairMax, 1e-12)}・${lt(S.zeroMax, 1e-12)}・${lt(S.fastMax, 1e-12)} | ${tf(G.pair)} |`,
    `| ② 3 体の移送の運動量 Σ m U ÷ Σ m 大きさ(U)(D0・D1) | ${lt(S.momD0, 1e-14)}・${fe(S.momD1)} | ${tf(G.momD0)} |`,
    `| ③ 3 体の Σ m U × v ÷ Σ m 大きさ(U) 大きさ(v)(D0・D1 —— ニュートンの角運動量の時間微分) | ${lt(S.angD0, 1e-14)}・${fe(S.angD1)} | ${tf(G.angD0)} |`,
    `| ④ 2 体の帳簿 E_mod = E − m₁m₂K/(2r²) の時間微分 ÷ 項の大きさの和(D0・D1) | ${lt(S.emodD0, 1e-14)}・${fe(S.emodD1)} | ${tf(G.emod)} |`,
    `| ⑤ 本 lib の試験粒子の近点(n_G = 2)と第344便d の近点の差(D0・D3・引きずりなし) | ${lt(S.apsidal344d, 1e-9)} | ${tf(G.apsidal)} |`,
    `| ⑥ 入力の拒否(宣言が無い・質量が負・換算の型が無い・系が無い) | ${S.reject.n}/${S.reject.of} | ${tf(G.reject)} |`].join('\n');

  const t1 = J.t1;
  T.t1 = ['| 系 | 引きずり | 近点の率(rad / 1 周) | 交点の率(rad / 1 周) | 重心の漂い | E の残りの最大(÷ abs(E₀)) | 角運動量の残りの最大(相対) |', '|---|---|---|---|---|---|---|']
    .concat(['sem', 'mj'].flatMap((k) => t1[k].rows.map((r) => `| ${t1[k].name} | ${DRAG_NAME[r.drag]} | ${fe(r.periRate)} | ${fe(r.nodeRate)} | ${lt(r.xp, 1e-9)} | ${fe(r.dEmax)} | ${lt(r.dLmax, 1e-10)} |`))).join('\n')
    + `\n\n(重力はニュートン・引きずりは K1 の一次の移送〔重み 10 m_j/r_ij・solve〕。太陽–地球–月の型 = 質量 1e-3・1e-5・1e-7・月の軌道 a = 0.03・e = 0.1・傾き 5°・外の 10 周〔内側 ${f2(t1.sem.rows[0].nInner)} 周〕・内側の 1 周 ${J.decl.systems.sem.steps[1]} 刻み/水星の型 + 木星の型 = 太陽 1e-4・水星の型 1e-10〔a = 1・e = 0.2056・傾き 7°〕・木星の型 1e-7〔a = 3〕・外の 4 周〔内側 ${f2(t1.mj.rows[0].nInner)} 周〕・内側の 1 周 ${J.decl.systems.mj.steps[1]} 刻み。率は内側の軌道の近点の通過〔相対の位置と幾何の速度 dp/dt の内積が − → + —— 二分法〕ごとの近点の経度 ϖ = Ω + ω と交点の経度 Ω の、通過の番号に対する傾き〔1 周 = 近点から近点まで —— 第344便d と同じ取り方〕。重心の漂い = 大きさ(Σ m p − Σ m p₀ − P t)÷(Σ m 大きさ(v₀) × 外の長半径)。丸めの残りは 0 と書いた)`;

  T.t1diff = ['| 系 | 宣言 − D0 | 近点の率の差 | 交点の率の差 | 近点の率の差(粗い刻み) | 交点の率の差(粗い刻み) |', '|---|---|---|---|---|---|']
    .concat(['sem', 'mj'].flatMap((k) => t1[k].diff.map((d) => `| ${t1[k].name} | ${DRAG_NAME[d.drag]} | ${fe(d.dPeri)} | ${fe(d.dNode)} | ${fe(d.dPeriCoarse)} | ${fe(d.dNodeCoarse)} |`)))
    .concat(['sem', 'mj'].map((k) => `| ${t1[k].name} | (参考)D0 − 引きずりなし | ${fe(t1[k].dragPart.peri)} | ${fe(t1[k].dragPart.node)} | — | — |`)).join('\n')
    + `\n\n(粗い刻み = 内側の 1 周 ${J.decl.systems.sem.steps[0]}/${J.decl.systems.mj.steps[0]} 刻み。宣言の差は刻みを半分にしても 1% の内で同じ —— 数値の誤差ではない)`;

  const lm = t1.limit;
  T.limit = ['| 2 体の極限(水星の型・木星の型の質量 0) | 本 lib(3 体の器・太陽も動く) | 第344便d(試験粒子・中心は固定) |', '|---|---|---|',
    `| 引きずり D0 の近点の分 ÷ 1PN(μ = ${lm.mu}) | ${f6(lm.d0OverPN)} | ${f6(lm.ref344dD0)} |`,
    `| 引きずり D1 の近点の分 ÷ 1PN | ${f6(lm.d1OverPN)} | ${f6(lm.ref344dD1)} |`,
    `| D1 − D0 | ${fe(lm.d1MinusD0)} | ${fe(lm.ref344dD1MinusD0)} |`,
    `| K1 の一次(第331便c) | ${f6(lm.k1)} | ${f6(lm.k1)} |`].join('\n')
    + `\n\n(本 lib は木星の型の質量を 0 にした 3 体の器を外の ${J.decl.systems.mj.limitOuter} 周〔内側の 1 周 ${J.decl.systems.mj.steps[0]} 刻み〕走らせ、近点の分 = 引きずりあり − 引きずりなし。第344便d は試験粒子の近点の通過 4 回の差〔1 周 6000 刻み〕。D0 の差は 1e-4 の内・D1 − D0 は相対 1e-4 の内。K1 の一次との差は μ = 1e-4 の二次の項)`;

  const L2 = J.decl.long, sumOf = (rows) => rows.map((r) => `| ${DRAG_NAME[r.drag]} | ${r.orbits} | ${r.steps} | ${fe(r.maxRfirst)} | ${fe(r.maxRlast)} | ${fe(r.slopeLast)} | ${r.drag === 'D0' ? '—' : fe(r.dSlope)} | ${fe(r.maxElast)} |`);
  const head = ['| 宣言 | 周 | 1 周の刻み | 帳簿の残りの最大(最初の 2 窓 —— 10 周まで) | 同(最後の窓) | 最後の窓の傾き(1 周あたり) | 傾き − D0 の傾き | E の残りの最大(最後の窓) |', '|---|---|---|---|---|---|---|---|'];
  T.t2 = head.concat(sumOf(J.t2long.summary)).concat(sumOf(J.t2long.summaryMax)).join('\n')
    + `\n\n(2 体〔質量 0.01・0.005・a = 1・e = 0.3〕・ニュートンの重力・RK4。帳簿 E_mod = E − m₁m₂K/(2r²)〔D0 で保たれる量 —— 純関数の場面 ④〕の残り ÷ abs(E₀) を ${L2.sampleEvery} 步ごとに読み、10 倍ごとの窓〔1・10・100・1e3・1e4・1e5 周〕で最大と傾きを取った。E〔ニュートンの K + U〕は移送の分だけ 1 周の中で約 9% 動く〔帳簿の残りではない〕。1e5 周は D0 と D1 だけ・刻み ${L2.stepsMax.join('・')}〔D2・D3 の 1e5 周は測っていない〕)`;

  const win = (d, st) => J.t2long.rows.find((r) => r.drag === d && r.steps === st);
  T.t2win = ['| 宣言 | 1 周の刻み | ' + win('D0', L2.steps[1]).windows.map((w) => `〜${w.hi} 周`).join(' | ') + ' |', '|---|---|' + win('D0', L2.steps[1]).windows.map(() => '---|').join('')]
    .concat(J.decl.drags.flatMap((d) => L2.steps.map((st) => `| ${DRAG_NAME[d]} | ${st} | ` + win(d, st).windows.map((w) => fe(w.maxR)).join(' | ') + ' |'))).join('\n')
    + '\n\n(窓ごとの帳簿の残りの最大 ÷ abs(E₀)。D0 は刻みを倍にすると約 1/32 —— 積分の誤差で、窓ごとに約 10 倍〔時間に比例〕。D1〜D3 は刻み 256 で 1.3e-3〜1.8e-3 の振れが 1e4 周まで変わらない〔有界〕。刻み 128 の 1e3〜1e4 周の窓は積分の誤差が振れを上回る)';

  const t3 = J.t3, at = (g, d) => t3.rows.find((r) => r.grav === g && r.drag === d);
  T.t3 = ['| 重力の換算 | 引きずり | 近点 ÷ 1PN | 見込み(一次) | 見込みとの差 | ″/世紀(× 42.98) | 刻みを半分にした差 |', '|---|---|---|---|---|---|---|']
    .concat(['cur', 'alpha1'].flatMap((g) => ['none', 'D0', 'D1'].map((d) => { const r = at(g, d); return `| ${GRAV_NAME[g]} | ${DRAG_NAME[d]} | ${f6(r.overPN)} | ${f6(r.expect)} | ${fe(r.dExpect)} | ${f2(r.arcsecCy)} | ${fe(r.halfDiff)} |`; }))).join('\n')
    + `\n\n(試験粒子・中心は固定・a = 1・μ = ${J.decl.orbit.mu}・e = ${J.decl.orbit.e}・1 周 ${J.decl.orbit.steps[1]} 刻み〔差は ${J.decl.orbit.steps[0]} 刻みとの差〕・近点 ${J.decl.orbit.nOrb} 回の差の平均。(α) の式は本 lib に閉じて書いた〔dv/dt = q a_G・局所の重力 e^(−2 n_G ψ)〕。n_G = 2 の (0)・(α) は第344便d の (i)・(iii) と同じ数〔差 ${lt(t3.ref344dMax, 1e-9)}〕)`;

  T.t3slope = ['| μ | (α)−(0)(D0 あり)÷ μ | (α)−(0)(引きずりなし)÷ μ | 交差(差の差)÷ μ | D1 − D0(現行)÷ μ | D1 − D0((α))÷ μ |', '|---|---|---|---|---|---|']
    .concat(t3.slope.map((r) => `| ${fe(r.mu)} | ${f2(r.alphaMinusCurD0)} | ${f2(r.alphaMinusCurNone)} | ${f2(r.cross)} | ${f2(r.d1MinusD0Cur)} | ${f2(r.d1MinusD0Alpha)} |`)).join('\n')
    + `\n\n(差 ÷ μ がほぼ一定 —— 二次。実の水星の場〔GM/(c² a) = ${fe(t3.mercury.muMerc)} —— 文献の値・未照合〕での桁: (α)−(0)〔D0 あり〕${fe(t3.mercury.alphaMinusCurD0)}″/世紀・交差 ${fe(t3.mercury.cross)}″/世紀・D1 − D0〔(α)〕${fe(t3.mercury.d1MinusD0Alpha)}″/世紀〔μ = 1e-4 の差 ÷ μ からの外挿〕)`;
  return T;
}

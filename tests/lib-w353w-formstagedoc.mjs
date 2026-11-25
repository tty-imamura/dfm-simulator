// 第353便w(原仮定者の整理(2026-11-24 —— 第148報)・原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R487):
// **正本 tests/out/formstage-353w.json から PHYSICS〔第353便w〕の表と数の文を作る文書の lib**
// (QA docs.formstage353w が節の表と逐語で照合する —— 表の数は有効数字 3〜4 桁・角は小数 3 桁)。原文(言葉を変えずに引く)と読みの表もここに持つ。
export const DOC_VERSION = 'w353w-formstagedoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fe = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const fd = (x) => (!fin(x) ? '—' : Math.abs(x) < 1e-3 ? (x === 0 ? '0' : '< 0.001') : Number(x).toFixed(3));
const fp = (x) => (!fin(x) ? '—' : Number(x).toPrecision(3));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const rhoN = (r) => (r === 'inf' || r === Infinity ? '∞((G−) だけ)' : String(r));
const AXN = Object.freeze({ L: 'L(主)', eq: 'eq(比べる)' });
const FK = Object.freeze({ '0': '0', keep: '保つ上限' });
const rng = (a) => (a === null || a === undefined ? '—' : a[0] === a[1] ? fp(a[0]) : fp(a[0]) + '〜' + fp(a[1]));
const rngD = (a) => (a === null || a === undefined ? '—' : fd(a[0]) + '〜' + fd(a[1]));

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の整理(2026-11-24 —— 第148報)', '銀河由来の円盤引きずりで、恒星は銀河の公転面に引き寄せられ、波打つ様に上下する。太陽の自転軸の傾きは、その際に生じる']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', '向きと幾何: これを採用『主の成分を太陽の自転の分・背景を太陽系の基準軸の向きに置くと、太陽の 5〜6° の傾きは円錐になり、金星で 1% まで打ち消します。』']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1033: 「太陽系の基準軸の向き」。「観測値は釣り合った結果」なので、観測値に沿った方式を採用する']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1032: 「順回転なら、歳差運動は逆回転になる」']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['形成の文は予想の文: 背景が今と違った時期(上下の運動の際)に傾きが作られる、という形を、背景が時間で替わる模型(始めは (G−) の項を持つ背景 → いまの (N+))のノブとして数える。背景が替わる理由と替わり方は書かない(ノブ)', '表 1・表 2・表 4']),
  Object.freeze(['採用された幾何 = いまの円錐の読み: 替わった後の (N+) では、太陽の自転軸は基準軸のまわりの円錐の上を回る(「保つ段」)', '表 1・表 3']),
  Object.freeze(['観測値に沿う = 終わり(いま)の公転面をいまの基準軸に置く読み B が主の置き方の候補(読み A は比べる置き方)', '表 1・表 2・表 5']),
  Object.freeze(['主の歳差の式 = (g2−)。(g2+) は比べる式として表 5 に残す', '表 1・表 5']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 統括の数え直し 3 の基準軸 L・ω_G・太陽の円錐(L) | (${S.axL.map((x) => x.toFixed(6)).join(', ')})・${S.omegaG} rad/s・${S.sunL}° | ${tf(G.anchor3)} |`,
    `| ② 替わる時刻 → ∞(背景が始めのまま): 〔第353便o〕の届く組 (g2−) 読み A・(g2+) 読み B を本 lib の進め方で数え直す/組ごとに scanCell と同じ | ${S.nA}・${S.nB}/${S.same}/${S.nCell} | ${tf(G.limitInfO)} |`,
    `| ③ 替わる時刻 → 0(はじめから (N+)): 2 つの軸の角と円錐の最大・届いた組 | ${fe(S.moved)}°・${S.make0} | ${tf(G.limitZeroMain)} |`,
    `| ④ 進め方 = 〔第353便o〕の twoAxisBoth(背景は関数・形 step)の差 | ${fe(S.vsTB)} | ${tf(G.stepVsTwoAxis)} |`,
    `| ⑤ 帯の長さ = 〔第353便o〕の dwellOf(替わる時刻 ∞)の相対差 | ${fe(S.dwVs)} | ${tf(G.dwellVsO)} |`,
    `| ⑥ 残る角: 形 step の比 1・tanh の閉じた形との相対差(x ${S.xTanh})・半分残る x(exp・tanh) | ${fd(S.r0)}・${fe(S.cTRel)}・${S.xHalf.exp.toFixed(4)}・${S.xHalf.tanh.toFixed(4)} | ${tf(G.retainLimits)} |`,
    `| ⑦ 背景の和 = 〔第352便r〕の bgTwo・方位 = 〔第352便r〕の dAzAround | ${fe(S.vsBg)}・${fe(S.vsAz)} | ${tf(G.bgAzVsR)} |`,
    `| ⑧ 拒否(形の名・基準軸の名・時間で替わる f を tanh で・負の x) | ${S.rejects.length} 件 | ${tf(G.rejects)} |`].join('\n');
  T.t1 = ['| 読み | 基準軸 | 移った後の大きさ u₁ | f | 組 | 角・方位・同時 | **作る段 → 保つ段** | うち太陽の係数 0(q −1) | いまの姿(t = 1 に角と方位 + 保つ) | 移った後の円錐 °(作る→保つの組) | いまの角 ±10% に居る長さ ÷ 年齢 | 届いた組でいまの角からの外れの最小 | 替わった後の歳差の周の数 |', '|---|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.t1.rows.map((r) => `| ${r.read} | ${AXN[r.axis]} | ${r.u1} | ${FK[r.fKind]}${r.fKind === 'keep' ? '(' + fe(r.f) + ')' : ''} | ${r.n} | ${r.nG}・${r.nA}・${r.nB} | **${r.nMake}** | ${r.nMakeQm1} | ${r.nNow} | ${rngD(r.makeCone)} | ${rng(r.makeDwell)} | ${fp(r.nearKeepDev)} | ${rng(r.turnsAfter)} |`)].join('\n');
  T.tsw = ['| 読み | 替わる時刻(年齢の倍) | 組 | 同時 | 作る段 → 保つ段 | うち替わる前に届いた組 | いまの姿 | 始めの比 ρ₀(作る→保つの組) |', '|---|---|---|---|---|---|---|---|',
    ...J.t1.tsw.map((r) => `| ${r.read} | ${r.tSwitch} | ${r.n} | ${r.nB} | ${r.nMake} | ${r.nForm} | ${r.nNow} | ${r.makeRho.length ? r.makeRho.map((x) => (x === 'inf' ? '∞' : x)).join('・') : '—'} |`)].join('\n');
  T.width = ['| 読み | 替わる時刻 | 形・幅(年齢の倍) | 組 | 同時 | 作る段 → 保つ段 | いまの姿 | 届いた組でいまの角からの外れの最小 |', '|---|---|---|---|---|---|---|---|',
    ...J.t1.width.map((r) => `| ${r.read} | ${r.tSwitch} | ${r.shape}・${r.width} | ${r.n} | ${r.nB} | ${r.nMake} | ${r.nNow} | ${fp(r.nearKeepDev)} |`)].join('\n');
  const oa = J.t1.oA;
  T.oA = ['| 始めの大きさ u₀ | 〔第353便o〕の (g2−) 読み A の届く組 | 届いた時刻に (N+) へ替えて保つ段に残る組 | うち太陽の係数 0(q −1) | 終わりの輪の法線が基準軸から 0.5° の内 | いまの角 ±10% に居る長さ ÷ 年齢(全組) | 届いた組でいまの角からの外れの最小 |', '|---|---|---|---|---|---|---|',
    ...oa.byU0.map((r) => `| ${r.u0} | ${oa.nHit} | ${r.nMake} | ${r.nMakeQm1} | ${r.nMakeRingNow} | ${rng(oa.runs.filter((x) => x.u0 === r.u0).length ? [Math.min(...oa.runs.filter((x) => x.u0 === r.u0).map((x) => x.dwell)), Math.max(...oa.runs.filter((x) => x.u0 === r.u0).map((x) => x.dwell))] : null)} | ${fp(r.nearKeepDev)} |`)].join('\n');
  T.t2 = ['| 始めの比 ρ₀ | 始めの背景と基準軸の角 θ ° | 形 | x = 歳差の率 × 幅 | 幅 ÷ 歳差の 1 周 | 残る角 ° | 残る角 ÷ θ | 閉じた形(小さい角) |', '|---|---|---|---|---|---|---|---|',
    ...J.t2.rows.map((r) => `| ${rhoN(r.rho0)} | ${fd(r.thDeg)} | ${r.shape} | ${fp(r.x)} | ${r.shape === 'step' ? '0' : fp(r.perTurn)} | ${fd(r.residDeg)} | ${fp(r.ratio)} | ${fp(r.closed)} |`)].join('\n');
  T.cond = ['| 始めの比 ρ₀ | θ ° | いまの角 ÷ θ | exp: 残る角がいまの角に届く x の上限・幅 ÷ 歳差の 1 周 | tanh: 同じ |', '|---|---|---|---|---|',
    ...J.t2.cond.map((r) => `| ${rhoN(r.rho0)} | ${fd(r.thDeg)} | ${fp(r.need)} | ${r.exp ? fp(r.exp.x) + '・' + fp(r.exp.perTurn) : '届かない(θ < いまの角)'} | ${r.tanh ? fp(r.tanh.x) + '・' + fp(r.tanh.perTurn) : '届かない(θ < いまの角)'} |`)].join('\n');
  const FN = { c70: '一定 0.7', c85: '一定 0.85', s70: '0.7 → 保つ上限', s85: '0.85 → 保つ上限' };
  T.t3 = ['| 基準軸 | f の列 | 組 | 角・同時 | 作る段 → 保つ段 | いまの姿 | 条件の悪い組(読み B を後ろへ解けない) | 届いた組でいまの角からの外れの最小 |', '|---|---|---|---|---|---|---|---|',
    ...J.t3.rows.map((r) => `| ${AXN[r.axis]} | ${FN[r.fId]} | ${r.n} | ${r.nG}・${r.nB} | ${r.nMake} | ${r.nNow} | ${r.nIll} | ${fp(r.nearKeepDev)} |`)].join('\n');
  const MN = { same: '作る段の f のまま', keep: '替わった後は保つ上限' };
  T.oB = ['| f | 係数の差 q | 組(36 × u₀ 2 の内) | 作る段 → 保つ段 | いまの姿 | 移った後の円錐 ° | 届いた組でいまの角からの外れの最小 |', '|---|---|---|---|---|---|---|',
    ...J.t3.oB.byModeQ.map((r) => `| ${MN[r.mode]} | ${r.q} | ${r.n} | ${r.nMake} | ${r.nNow} | ${rngD(r.makeCone)} | ${fp(r.nearKeepDev)} |`)].join('\n');
  return T;
}

export function factsOf(J) {
  const F = {}, R = J.t1.rows, sum = (a, k) => a.reduce((s, r) => s + r[k], 0);
  const B = R.filter((r) => r.read === 'B'), A = R.filter((r) => r.read === 'A'), nRow = R[0].n;
  const coneB = B.filter((r) => r.makeCone), cLo = Math.min(...coneB.map((r) => r.makeCone[0])), cHi = Math.max(...coneB.map((r) => r.makeCone[1]));
  F.main = `**① 主の式 (g2−)・背景が時間で替わる模型(形 step)。** 読み B(終わりの公転面がいまの基準軸)では、行ごと ${nRow} 組の内、角と方位に届き替わった後にいまの角 ±10% に居る組(作る段 → 保つ段)が ${Math.min(...B.map((r) => r.nMake))}〜${Math.max(...B.map((r) => r.nMake))}(太陽の係数 0 の組 q −1 を除くと ${Math.min(...B.map((r) => r.nMake - r.nMakeQm1))}〜${Math.max(...B.map((r) => r.nMake - r.nMakeQm1))})・移った後の円錐 ${fd(cLo)}〜${fd(cHi)}°(〔第353便o〕では背景が一定のまま同時に届く組 0)。読み A では ${Math.min(...A.map((r) => r.nMake))}〜${Math.max(...A.map((r) => r.nMake))} —— その多くは太陽の係数 0(q −1)の組か、終わりの輪の法線が基準軸から離れたままの組(輪の外れ 0.5° の内は行ごと ${Math.min(...A.map((r) => r.nMakeRingNow))}〜${Math.max(...A.map((r) => r.nMakeRingNow))})。t = 1 に角と方位が幅の内に居る「いまの姿」の組は、全部で読み B ${sum(B, 'nNow')}・読み A ${sum(A, 'nNow')}(${R.length * nRow} 組中)—— 替わった後は (N+) のまわりの歳差で方位が回る(周の数 最大 ${fp(Math.max(...R.map((r) => r.turnsAfter[1])))})ので、いまの方位は替わった後の位相の量になる。`;
  const W = J.t1.width;
  F.width = `**② 替わる幅。** 形 tanh・幅 0.01(年齢の倍)では、作る段 → 保つ段の組は読み A ${sum(W.filter((r) => r.read === 'A'), 'nMake')}・読み B ${sum(W.filter((r) => r.read === 'B'), 'nMake')}(各 ${W.length / 2 * W[0].n} 組 —— 形 step の表 1 では読み B に作る段 → 保つ段の組が在る)。この幅は、始めの大きさ 2.4〜3.7 の背景の歳差の数周に当たり、軸は背景に付いて (N+) の側へ寄る(表 3 の断熱の側)。`;
  const t2 = J.t2, small = t2.rows.filter((r) => (r.rho0 === 0.0605 || r.rho0 === 0.087) && r.shape !== 'step'), dev = Math.max(...small.map((r) => Math.abs(r.ratio / Math.max(r.closed, 1e-300) - 1) * (r.closed > 0.05 ? 1 : 0)));
  const big = t2.rows.filter((r) => (r.rho0 === 1 || r.rho0 === 'inf') && r.shape !== 'step' && r.closed > 0.05), devB = Math.max(...big.map((r) => Math.abs(r.ratio / r.closed - 1)));
  F.adiab = `**③ 替わり方の急さ(残る角の閉じた形)。** 1 つの軸が始めの背景の向きにそろって居るところで背景が (N+) へ替わると、残る角 ÷ θ は、小さい角では背景の向きの替わりの速さ ṡ の、歳差の率でのフーリエの大きさ: 形 step 1・exp 1 ÷ √(1 + x²)・tanh (πx/2) ÷ sinh(πx/2)(x = 歳差の率 × 幅)。半分残る境目は exp x = ${t2.xHalf.exp.toFixed(3)}(幅 ÷ 歳差の 1 周 ${fp(t2.xHalf.exp / (2 * Math.PI))})・tanh x = ${t2.xHalf.tanh.toFixed(3)}(${fp(t2.xHalf.tanh / (2 * Math.PI))})。数えた比と閉じた形の相対差は、θ ${fd(small[0].thDeg)}〜${fd(Math.max(...small.map((r) => r.thDeg)))}° で ${fp(dev)} 以下・θ ${fd(Math.min(...big.map((r) => r.thDeg)))}〜${fd(Math.max(...big.map((r) => r.thDeg)))}° で ${fp(devB)} 以下(大きい角では近似)。**形成の段階の後に (N+) へ移ったとき角が残る条件**: θ × R(x) ≥ いまの角 —— 始めの比 ${t2.cond.filter((r) => !r.tanh).map((r) => r.rho0).join('・')} では θ がいまの角より小さく、この置き方では届かない・比 ${t2.cond.filter((r) => r.tanh).map((r) => (r.rho0 === 'inf' ? '∞' : r.rho0)).join('・')} では x ≤ ${t2.cond.filter((r) => r.tanh).map((r) => fp(r.tanh.x)).join('〜')}(tanh)・${t2.cond.filter((r) => r.exp).map((r) => fp(r.exp.x)).join('〜')}(exp)。`;
  const ob = J.t3.oB.byModeQ, oS = ob.filter((r) => r.mode === 'same'), oK = ob.filter((r) => r.mode === 'keep');
  const nz = (a) => sum(a.filter((r) => r.q !== -1), 'nMake'), nzN = (a) => sum(a.filter((r) => r.q !== -1), 'n');
  F.cmp = `**④ 比べる式 (g2+)(f も時間で替わる列)。** 〔第353便o〕の (g2+) 読み B の届く組 ${J.t3.oB.nHit} で、届いた時刻に背景を (N+) へ替えると、作る段の f(0.665〜0.91)のままでは保つ段に残る組は太陽の係数 0(q −1)の組だけ(q ≠ −1 で ${nz(oS)}/${nzN(oS)})。替わった後の f を保つ上限(移った後の大きさ 0.98 の fKeepAt)に置くと、q ≠ −1 で ${nz(oK)}/${nzN(oK)} が残る —— 「作る段だけ f を大きく・保つ段は小さく」の列では、〔第353便o〕の f の食い違い(約 800 倍)はこの模型の中では並べられる(f の替わり方もノブ)。格子の時刻(0.001〜0.1)で数える走査では、読み B を後ろへ解けない組が ${sum(J.t3.rows, 'nIll')}/${sum(J.t3.rows, 'n')}・作る段 → 保つ段 ${sum(J.t3.rows, 'nMake')}。`;
  const oa = J.t1.oA;
  F.oA = `**⑤ 〔第353便o〕の (g2−) 読み A の届く組 ${oa.nHit} を延ばせるか。** 届いた時刻に背景を (N+) へ替えても、保つ段に残るのは ${oa.sum.nMake}/${oa.sum.n}(太陽の係数 0 の組 ${oa.sum.nMakeQm1})—— 読み A では届いた時の輪の法線が基準軸から離れて居て、替わった後は (N+) のまわりを回るので、2 つの軸の角が揺れて帯を出る。背景の替わりで帯の長さは延びない(この格子では)。`;
  return F;
}

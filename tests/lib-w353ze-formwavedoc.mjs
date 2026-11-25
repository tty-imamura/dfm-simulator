// 第353便ze(原仮定者の整理(2026-11-24 —— 第148報)・原仮定者の回答(2026-11-25 —— 第151報)・統括の検証項目 R494):
// **正本 tests/out/formwave-353ze.json から PHYSICS〔第353便ze〕の表と数の文を作る文書の lib**
// (QA docs.formwave353ze が節の表と逐語で照合する —— 表の数は有効数字 3 桁・角は小数 3 桁)。原文(言葉を変えずに引く)と読みの表もここに持つ。
export const DOC_VERSION = 'w353ze-formwavedoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fe = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const fd = (x) => (!fin(x) ? '—' : Math.abs(x) < 1e-3 ? (x === 0 ? '0' : '< 0.001') : Number(x).toFixed(3));
const fp = (x) => (!fin(x) ? '—' : Number(x).toPrecision(3));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const rhoN = (r) => (r === 'inf' || r === Infinity ? '∞' : String(r));
const FORM = Object.freeze({ none: '揺れ無し', nod: '首を振る', pulse: '脈を打つ' });
const ampN = (r) => (r.form === 'none' ? '—' : r.form === 'nod' ? r.A + '°' : String(r.A));
const SEN = Object.freeze({ g2m: '(g2−)(主)', g2p: '(g2+)(比べる)' });

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の整理(2026-11-24 —— 第148報)', '銀河由来の円盤引きずりで、恒星は銀河の公転面に引き寄せられ、波打つ様に上下する。太陽の自転軸の傾きは、その際に生じる']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', '向きと幾何: これを採用『主の成分を太陽の自転の分・背景を太陽系の基準軸の向きに置くと、太陽の 5〜6° の傾きは円錐になり、金星で 1% まで打ち消します。』']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1033: 「太陽系の基準軸の向き」。「観測値は釣り合った結果」なので、観測値に沿った方式を採用する']),
  Object.freeze(['原仮定者の回答(2026-11-25 —— 第151報)', 'AN1032: 「順回転なら、歳差運動は逆回転になる」']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['形成の文は予想の文: 「波打つ様に上下する」に数の側の形を付ける —— 始めの背景の (G−) の項が、上下の揺れの位相で基準軸のまわりに首を振る形と、大きさが脈を打つ形をノブとして足す(揺れの由来は書かない)', '表 5']),
  Object.freeze(['採用された幾何 = 替わった後の円錐の読み: 替わった後は太陽の自転軸が基準軸のまわりを回り、方位は位相の量になる', '表 6・表 7']),
  Object.freeze(['観測値に沿う = 終わり(いま)の公転面をいまの基準軸に置く読み B を主の置き方に(〔第353便w〕の推奨)', '表 3〜表 8']),
  Object.freeze(['主の歳差の式 = (g2−)。(g2+) は比べる式として表 8 の面に並べる', '表 8']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 統括の数え直し 3 の基準軸 L・ω_G・太陽の円錐(L) | (${S.axL.map((x) => x.toFixed(6)).join(', ')})・${S.omegaG} rad/s・${S.sunL}° | ${tf(G.anchor3)} |`,
    `| ② 揺れ 0: 〔第353便w〕の表 3 の 2 行(読み B・L・f 0・u₁ 0.0487 と 0.98)の作る段 → 保つ段・いまの姿/組ごとに runForm と同じ(相対 1e-9) | ${S.zero.u0487.make}・${S.zero.u0487.now} と ${S.zero.u098.make}・${S.zero.u098.now}/${S.nSame}/${S.nCell} | ${tf(G.zeroVsW)} |`,
    `| ③ 背景の形: 揺れ 0 は bgOf との相対差・速い道との相対差・首を振る形の (G−) の項と基準軸の角の差と大きさの差・脈を打つ形の向きの差 | ${fe(S.vs0)}・${fe(S.vsFast)}・${fe(S.nodAng)}°・${fe(S.nodMag)}・${fe(S.pulseDir)}° | ${tf(G.bgForms)} |`,
    `| ④ 一定の背景を揺れの規則で刻んで進めても 1 回の閉じた形と同じ(向きの差 —— 1e-4 の内) | ${fe(S.vsForce)} | ${tf(G.stepVsClosed)} |`,
    `| ⑤ 揺れの在る組で刻みを半分にしたときの向きの差(rad) | ${fe(S.refine)} | ${tf(G.refine)} |`,
    `| ⑥ 共鳴の式 u_res = 2π ÷ (P ω_G 年齢): 仮の値の周期の範囲で帯(〔第352便y〕)・逆の式の差 | ${S.bandLo.toFixed(2)}〜${S.bandHi.toFixed(2)}・${fe(S.inv)} | ${tf(G.resonance)} |`,
    `| ⑦ 閉じた形で残る角がいまの角の帯の下端(0.9)になる x(tanh・exp) | ${S.xK.tanh.toFixed(4)}・${S.xK.exp.toFixed(4)} | ${tf(G.keepClosed)} |`,
    `| ⑧ 拒否(揺れの形の名・脈の大きさ > 1・周期 0・負の周期・負の x) | ${S.rejects.length} 件 | ${tf(G.rejects)} |`].join('\n');
  const xs = J.t1.rows[0].per.map((p) => p.x);
  T.t1 = [`| 移った後の大きさ u₁ | 替わる時刻 | 形 step の作る段 → 保つ段 | 形 tanh で残る組(x = ${xs.join('・')}) | 組が残る x の上限 | 半分残る x |`, '|---|---|---|---|---|---|',
    ...J.t1.rows.map((r) => `| ${r.u1} | ${r.tSwitch} | ${r.nStep} | ${r.per.map((p) => p.nKeep).join('・')} | ${r.xMax === null ? '—' : r.xMax} | ${fp(r.xHalf)} |`)].join('\n');
  const u1s = [...new Set(J.t1.rows.map((r) => r.u1))];
  T.t1r = ['| x | 幅 ÷ 歳差の 1 周 | 閉じた形(tanh) | ' + u1s.map((u) => `u₁ ${u}: 残る角 ÷ 作った角(替わる時刻 4 の平均の範囲)`).join(' | ') + ' |', '|---|---|---|' + u1s.map(() => '---|').join(''),
    ...xs.map((x, k) => `| ${x} | ${fp(x / (2 * Math.PI))} | ${fp(J.t1.rows[0].per[k].closed)} | ` + u1s.map((u) => { const ms = J.t1.rows.filter((r) => r.u1 === u).map((r) => r.per[k].meanRatio).filter(fin); return ms.length ? fp(Math.min(...ms)) + '〜' + fp(Math.max(...ms)) : '—'; }).join(' | ') + ' |')].join('\n');
  T.t2 = ['| 始めの大きさ u₀ | 共鳴の帯(2.4〜3.7) | 揺れの形 | 大きさ A | 周期 P(年齢の倍) | 共鳴の大きさ u_res(P) ÷ u₀ | 角・方位・同時 | 作る段 → 保つ段 | 同時の増・減(揺れ無しから) | 作る→保つの増・減 |', '|---|---|---|---|---|---|---|---|---|---|',
    ...J.t2.rows.map((r) => `| ${r.u0} | ${r.inBand ? '中' : '外'} | ${FORM[r.form]} | ${ampN(r)} | ${r.P === null ? '—' : fp(r.P) + (r.prov ? '(比べる欄: ' + J.t2.provMark + ')' : '')} | ${r.P === null ? '—' : fp(r.uResOfP / r.u0)} | ${r.nG}・${r.nA}・${r.nB} | ${r.nMake} | ${r.form === 'none' ? '—' : '+' + r.gain + '・−' + r.lose} | ${r.form === 'none' ? '—' : '+' + r.gainMake + '・−' + r.loseMake} |`)].join('\n');
  T.t3 = ['| 移った後の大きさ u₁ | 組 | 替わった後にいまの角 ±10% に居る組 | うち t = 1 の方位がいまの方位 ±10° | 割合(一様なら ' + fp(J.t3.uniform) + ') | 作る段 → 保つ段の組・うち ±10° | 替わった後の歳差の周の数 |', '|---|---|---|---|---|---|---|',
    ...J.t3.rows.map((r) => `| ${r.u1} | ${r.nCell} | ${r.nKeepSw} | ${r.nIn} | ${fp(r.frac)} | ${r.nMake}・${r.nMakeIn} | ${r.turns ? fp(r.turns[0]) + '〜' + fp(r.turns[1]) : '—'} |`),
    `| 全部 | ${J.t3.rows.reduce((s, r) => s + r.nCell, 0)} | ${J.t3.n} | ${J.t3.nIn} | ${fp(J.t3.frac)} | — | — |`].join('\n');
  T.t3h = ['| 方位の外れ(°) | ' + J.t3.hist.map((_, k) => `${-180 + 30 * k}〜${-150 + 30 * k}`).join(' | ') + ' |', '|---|' + J.t3.hist.map(() => '---|').join(''), '| 組 | ' + J.t3.hist.join(' | ') + ' |'].join('\n');
  const turns = [...new Set(J.t4.rows.map((r) => r.turn))];
  T.t4 = ['| 歳差の式 | 替わる時刻 ÷ 年齢 | ' + turns.map((t) => `幅 ÷ 歳差の 1 周 ${t === 0 ? '0(step)' : t}: 同時・作る→保つ`).join(' | ') + ' |', '|---|---|' + turns.map(() => '---|').join(''),
    ...[...new Set(J.t4.rows.map((r) => r.sense + '|' + r.tSwitch))].map((k) => { const [sense, ts] = k.split('|'); const rs = J.t4.rows.filter((r) => r.sense === sense && String(r.tSwitch) === ts); return `| ${SEN[sense]} | ${ts} | ` + turns.map((t) => { const r = rs.find((x) => x.turn === t); return `${r.nB}・**${r.nMake}**`; }).join(' | ') + ' |'; })].join('\n');
  return T;
}

export function factsOf(J) {
  const F = {}, R1 = J.t1.rows, hi = R1.filter((r) => r.u1 !== 0.0487), lo = R1.filter((r) => r.u1 === 0.0487);
  const xm = hi.map((r) => r.xMax).filter(fin), xh = hi.map((r) => r.xHalf).filter(fin);
  F.width = `**① 替わる幅の細かい走査(形 tanh・主の式 (g2−)・読み B・L・f 0)。** 形 step で作る段 → 保つ段の組(行ごと ${Math.min(...R1.map((r) => r.nStep))}〜${Math.max(...R1.map((r) => r.nStep))})を tanh の幅に替えると、移った後の大きさ 0.835・0.98 の行では、組が残る x の上限は ${Math.min(...xm)}〜${Math.max(...xm)}・半分残る x は ${fp(Math.min(...xh))}〜${fp(Math.max(...xh))}(幅 ÷ 歳差の 1 周 ${fp(Math.min(...xh) / (2 * Math.PI))}〜${fp(Math.max(...xh) / (2 * Math.PI))})。閉じた形で残る角がいまの角の帯の下端(0.9)まで落ちる x は ${fp(J.t1.xKeepClosed)}(半分残る x ${fp(J.t1.xHalfClosed)})—— 組が残るかどうかは「半分残る」境目ではなく、帯の下端の境目の近くで切れる。移った後の大きさ 0.0487 の行では x 3 まで残る組が在り(半分残る x ${lo.map((r) => fp(r.xHalf)).join('・')})、x を替わりの中ほどの背景の率で測ると、替わった後の背景が小さい組では急さの物差しにならない(替わった後の率で測る量の候補)。`;
  const T2 = J.t2.rows, base = T2.filter((r) => r.form === 'none'), wv = T2.filter((r) => r.form !== 'none');
  const sumK = (a, k) => a.reduce((s, r) => s + r[k], 0);
  const near = wv.filter((r) => Math.abs(Math.log(r.uResOfP / r.u0)) < Math.log(1.5)), far = wv.filter((r) => Math.abs(Math.log(r.uResOfP / r.u0)) >= Math.log(1.5));
  const baseOf = (r) => base.find((b) => b.u0 === r.u0);
  const mean = (a, f) => (a.length ? a.reduce((s, r) => s + f(r), 0) / a.length : null);
  F.wave = `**② 上下の揺れ(主の式 (g2−)・読み B・L・u₁ 0.98・f 0 —— ${J.t2.nCell} 組)。** 揺れ無しの同時に届く組は 始めの大きさ ${base.map((b) => b.u0 + ' で ' + b.nB).join('・')}(作る段 → 保つ段 ${base.map((b) => b.nMake).join('・')})。揺れを足した ${wv.length} 列の同時に届く組は ${Math.min(...wv.map((r) => r.nB))}〜${Math.max(...wv.map((r) => r.nB))}(増える列 ${wv.filter((r) => r.nB > baseOf(r).nB).length}・減る列 ${wv.filter((r) => r.nB < baseOf(r).nB).length}・同じ ${wv.filter((r) => r.nB === baseOf(r).nB).length})・作る段 → 保つ段は ${Math.min(...wv.map((r) => r.nMake))}〜${Math.max(...wv.map((r) => r.nMake))}(増える列 ${wv.filter((r) => r.nMake > baseOf(r).nMake).length}・減る列 ${wv.filter((r) => r.nMake < baseOf(r).nMake).length})。組ごとの入れ替わり: 同時が増える組 ${sumK(wv, 'gain')}・減る組 ${sumK(wv, 'lose')}(列の和)。揺れの周期が始めの背景の歳差の周期に近い列(共鳴の大きさ ÷ 始めの大きさ 1/1.5〜1.5 —— ${near.length} 列)では、同時に届く組の揺れ無しとの差の平均 ${fp(mean(near, (r) => r.nB - baseOf(r).nB))}・離れた列(${far.length} 列)では ${fp(mean(far, (r) => r.nB - baseOf(r).nB))} —— この格子では、揺れは届く組を増やすよりも入れ替え、共鳴の近くでは減らす側に出る。`;
  const P = J.t3;
  F.phase = `**③ 替わった後の方位の位相(形 step・揺れ 0)。** 替わった後にいまの角 ±10% に居る組(移った後の大きさごとに ${P.rows[0].nKeepSw})の t = 1 の方位がいまの方位 ±10° に居る割合は、移った後の大きさ 6 つで ${fp(Math.min(...P.rows.map((r) => r.frac)))}〜${fp(Math.max(...P.rows.map((r) => r.frac)))}・全部で ${P.nIn}/${P.n} = ${fp(P.frac)}(一様なら ${fp(P.uniform)} —— 一様の見込みの ${fp(P.frac / P.uniform)} 倍)。替わった後の歳差の周の数は最大 ${fp(Math.max(...P.rows.map((r) => r.turns[1])))} —— 移った後の大きさを替えると同じ組の方位が回り、±10° に入る組は入れ替わる。方位の外れの分布(表 7)は一様ではなく、外れ 120° より大きい所に ${P.hist.slice(0, 2).concat(P.hist.slice(10)).reduce((a, v) => a + v, 0)}・60° より小さい所に ${P.hist.slice(4, 8).reduce((a, v) => a + v, 0)}(組の数は ${P.n})—— 太陽の係数 0 の組(q −1)は替わった後に方位が動かず、移った後の大きさに依らず同じ所に居る。`;
  const T4 = J.t4.rows, m = T4.filter((r) => r.sense === 'g2m'), p = T4.filter((r) => r.sense === 'g2p');
  const at = (a, t) => a.filter((r) => r.turn === t);
  const turns = [...new Set(T4.map((r) => r.turn))];
  const tss = [...new Set(T4.map((r) => r.tSwitch))], tMax = turns[turns.length - 1];
  F.plane = `**④ 2 つのノブの面(替わる時刻 ÷ 年齢 × 幅 ÷ 歳差の 1 周 —— 読み B・L・u₁ 0.98・f 0・${J.t4.nCell} 組)。** 主の式 (g2−) の作る段 → 保つ段の組の数は、幅 ÷ 歳差の 1 周 ${turns.map((t) => t + ' で ' + sumK(at(m, t), 'nMake')).join('・')}(替わる時刻 ${tss.length} つの和)・比べる式 (g2+) は ${turns.map((t) => t + ' で ' + sumK(at(p, t), 'nMake')).join('・')}。替わる時刻ごと(主の式・幅 0 → ${tMax} 周): ${tss.map((ts) => ts + ' で ' + m.find((r) => r.tSwitch === ts && r.turn === 0).nMake + ' → ' + m.find((r) => r.tSwitch === ts && r.turn === tMax).nMake).join('・')}。いまの姿(t = 1 に角と方位)の組は主の式で ${sumK(m, 'nNow')}・比べる式で ${sumK(p, 'nNow')}(面の全部)。f 0 では比べる式 (g2+) も読み B で作る段 → 保つ段の組を持ち、組の数は主の式と同じ桁。`;
  return F;
}

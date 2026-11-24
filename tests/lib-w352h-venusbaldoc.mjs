// 第352便h(原仮定者の回答(2026-11-24 —— 第148報)・統括の検証項目 R445):
// **正本 tests/out/venusbal-352h.json から PHYSICS〔第352便h〕の表を作る文書の lib**
// (QA docs.venusbal352h が節の表と逐語で照合する —— 表の数は有効数字 3〜4 桁・角は小数 3 桁)。原文(言葉を変えずに引く)と読みの表もここに持つ。
export const DOC_VERSION = 'w352h-venusbaldoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fe = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const fe3 = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(3));
const f3 = (x) => (!fin(x) ? '—' : Number(x).toFixed(3));
const f4 = (x) => (!fin(x) ? '—' : Number(x).toFixed(4));
const f5 = (x) => (!fin(x) ? '—' : Number(x).toFixed(5));
const sg = (x) => (!fin(x) ? '—' : x === 0 ? '0' : (x > 0 ? '+' : '') + Number(x).toExponential(2));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const NM = Object.freeze({ Mercury: '水星', Venus: '金星', Earth: '地球', Mars: '火星', Jupiter: '木星', Saturn: '土星', Uranus: '天王星', Neptune: '海王星' });
const DN = Object.freeze({ Np: '(N+)', Nm: '(N−)', Gm: '(G−)', Gp: '(G+)' });
const PN = Object.freeze({ M: '(M)', S: '(S)', MS: '(MS)' });
const AXN = Object.freeze({ eq: '等重み (eq)', L: '角運動量の重み (L)', ecl: '黄道の極 (ecl)', gal: '—(銀河の向き)' });
const SPN = Object.freeze({ prov: '仮の値(台帳)', provLo: '仮の値 − 1σ', provHi: '仮の値 + 1σ', repo: 'リポジトリの値(比べる列)', res: '共鳴の候補の周期(台帳)' });

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第148報)', 'AN1019: Aで進める。金星の自転の逆回転は、釣り合った状態で地球とも共鳴した結果である']),
  Object.freeze(['原仮定者の回答(2026-11-15 —— AN720)', '「金星で釣り合う比」は、今後軸引きずりの計算を見直しても尊重する']),
  Object.freeze(['原仮定者の補足(2026-11-14 —— 第138報の補足 2)', '金星は、太陽と銀河が釣り合っていて、さらに地球が影響を与えている']),
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第147報)', 'よって、大半の惑星は、銀河由来の軸引きずりは起こす向きで、太陽の由来の軸引きずりは倒す向きになり、釣り合う']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['前半(「A」)= 背景の大きさの主の列 (uV)。後半は予想の文 —— 「釣り合いの点(外からの軸の拘束が小さい点)」と「地球との共鳴の算術」を別の列で数える(説明の答えにしない)', '表 3〜表 9']),
  Object.freeze(['恒久の条件。「釣り合う」の中身は伺っている —— (ア) 大きさが同じ・(イ) 合成が最小・(ウ) 置かない。本節は (ア)(イ) を同じ重さで並べ、差を数える', '表 3・表 4']),
  Object.freeze(['金星の位置で、太陽由来と背景の残りに比べて地球由来の項がどれだけ在るか、の列(ほかの源も並べる)', '表 7']),
  Object.freeze(['予想の文。主の成分 (S) の太陽由来の項と背景の和の大きさを、8 惑星と距離の関数で並べる(数えた符号と大きさは別の列)', '表 5・表 6']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, A = S.anc;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 統括の数え直し: 金星で大きさが同じになる倍率 (S)・(MS)(第351便e の \`uEqMag\`・第352便d の \`uVenus\` と同じ数) | ${A.uV.toExponential(5)}・${A.uVms.toFixed(4)} | ${tf(G.anchorUV)} |`,
    `| ② 統括の数え直し: (N+)・等重みの軸・(ア) の残り(合成 ÷ 背景)と直接の比・合成の率・背景の率・(G−) の合成の率 [″/年] | ${f3(A.npRes)}・${Math.abs(A.npDirect / A.npRes - 1) < 1e-9 ? '< 1e-9' : fe(A.npDirect / A.npRes - 1)}・${fe(A.npComb)}・${fe(A.bgAs)}・${fe(A.gmComb)} | ${tf(G.anchorCancel)} |`,
    `| ③ 統括の数え直し: 背景 (uV)・(N+) の合成 ÷ 背景 —— 地球・火星・水星 | ${f3(A.cob.Earth)}・${f3(A.cob.Mars)}・${f3(A.cob.Mercury)} | ${tf(G.anchorRatio)} |`,
    `| ④ 反平行(S = −3 b̂)なら (ア)(イ) とも残り 0・倍率 3 | ${S.anti.resMag}・${S.anti.resMin}・${S.anti.uMag} | ${tf(G.antiZero)} |`,
    `| ⑤ 直交なら (イ) の倍率は無い(φ 90°)・平行なら打ち消さない(φ 180°) | ${S.orth.uMin === null ? 'null' : '—'}・${S.par.uMin === null ? 'null' : '—'} | ${tf(G.orthNone)} |`,
    `| ⑥ 閉じた形の残り 2 sin(φ/2)・tan φ・倍率の比 cos φ を、直接の合成(φ 0.3〜80°)と照合した相対の差の最大 | ${S.vsDirect < 1e-12 ? '< 1e-12' : fe(S.vsDirect)} | ${tf(G.closedVsDirect)} |`,
    `| ⑦ (S) の向きの閉じた形 −Ŝ ∥ 3 (ŝ☉·n̂) n̂ − ŝ☉ と 8 惑星の数値の角の最大 [°] | ${S.closedMax < 1e-5 ? '< 1e-5' : fe(S.closedMax)} | ${tf(G.closedDir)} |`,
    `| ⑧ 試しの受け手: 太陽の赤道面の道・(W) で第351便c の \`closedSEq\` と同じ(相対の差)・向きは源の自転と逆・距離のべき(0.5〜1 AU) | ${S.closedS < 1e-9 ? '< 1e-9' : fe(S.closedS)}・${f3(S.eqAnti)}・${f3(S.slope)} | ${tf(G.closedSEq)} |`,
    `| ⑨ \`pointRot\`(1 つの配置)を位相 72 で平均すると第352便e の \`rotOf\`(金星|太陽・(S)(M))と同じ・源の質量 0 で 0・源の自転 0 で (S) 0 | ${S.vsRot < 1e-12 ? '< 1e-12' : fe(S.vsRot)}・${S.m0}・${S.sp0} | ${tf(G.pointRot)} |`,
    `| ⑩ 共鳴の算術: 仮の自転周期で内合ごとの経度のずれ [°]・共鳴の周期でずれ 0・第352便b の \`resonancePeriod\` と同じ・回転の数の最も近い整数(仮・未照合) | ${f3(S.res.shift)}・${S.res.zero < 1e-9 ? '< 1e-9' : fe(S.res.zero)}・${S.res.presVsB === 0 ? '0' : fe(S.res.presVsB)}・${Math.round(S.res.turns)} | ${tf(G.resonance)} |`,
    `| ⑪ 変異: 2 sin φ(半角を落とす)・(イ) の符号を逆 —— どちらも門で落ちる | ${S.muts.noHalf && S.muts.cosSign ? '落ちる・落ちる' : '—'} | ${tf(G.mutants)} |`,
    `| ⑫ 入力の拒否(S 0・b̂ 0・b₁ 0・向きの名・成分 (M)・基準軸の名・距離 0・源が金星・周期の順・質量 0) | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  T.cancel = ['| 成分 | 背景の向き | 基準軸 | (ア) 倍率 uMag | (イ) 倍率 uMin | (イ) ÷ (ア) | φ(−S と背景の角)[°] | 残り (ア)(合成 ÷ 背景) | 残り (イ) | φ の閉じた形 [°] | φ の小角の式 [°] |', '|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.cancel.map((r) => `| ${PN[r.part]} | ${DN[r.dir]} | ${AXN[r.axis]} | ${fe3(r.uMag)} | ${r.uMin === null ? '打ち消さない' : fe3(r.uMin)} | ${r.minOverMag === null ? '—' : f5(r.minOverMag)} | ${f3(r.phiDeg)} | ${fe3(r.resMag)} | ${r.resMin === null ? '—' : fe3(r.resMin)} | ${f3(r.phiClosedDeg)} | ${f3(r.phiSmallDeg)} |`)].join('\n');
  T.angle = ['| 基準軸 | 太陽の自転軸との角 [°] | 金星の公転の法線との角 [°] | φ(数値)[°] | φ の閉じた形 [°] | φ の小角の式 [°] | 残り (ア) 2 sin(φ/2) |', '|---|---|---|---|---|---|---|',
    ...J.angle.rows.map((r) => `| ${AXN[r.axis]} | ${f3(r.sunDeg)} | ${f3(r.nDeg)} | ${f3(r.phiDeg)} | ${f3(r.phiClosedDeg)} | ${f3(r.phiSmallDeg)} | ${fe3(2 * Math.sin(r.phiDeg * Math.PI / 360))} |`)].join('\n');
  T.scan = ['| 基準軸 | 距離 [AU] | (S) ÷ 背景 | 合成 ÷ 背景 | 合成と背景の角 [°] | 合成と (S) の角 [°] |', '|---|---|---|---|---|---|',
    ...J.scan.rows.map((r) => `| ${AXN[r.axis]} | ${r.rAU} | ${fe3(r.sOverB)} | ${fe3(r.combOverB)} | ${f3(r.angToBg)} | ${f3(r.angToS)} |`)].join('\n');
  T.star = ['| 基準軸 | 太陽の円錐(基準軸と太陽の自転軸の角)[°] | 合成が最小の距離 r* [AU] | r* の合成 ÷ 背景 | r* の φ [°] | 0.3 AU の合成と (S) の角 [°] | 2 AU の合成と背景の角 [°] |', '|---|---|---|---|---|---|---|',
    ...J.scan.star.map((r) => `| ${AXN[r.axis]} | ${f3(r.coneSunDeg)} | ${f4(r.rStarAU)} | ${fe3(r.combOverB)} | ${f3(r.phiDeg)} | ${f3(r.innerAngToS)} | ${f3(r.outerAngToBg)} |`)].join('\n');
  const K = ['Np|eq', 'Np|L', 'Np|ecl', 'Gm|gal'];
  T.planets = ['| 惑星 | (S) ÷ 背景 (uV) | 合成 ÷ 背景: (N+) eq | (N+) L | (N+) ecl | (G−) |', '|---|---|---|---|---|---|',
    ...J.planets.rows.map((r) => `| ${NM[r.id]} | ${fe3(r.sOverB)} | ${K.map((k) => fe3(r.cols[k].comb)).join(' | ')} |`),
    `| 最小の惑星 | — | ${K.map((k) => NM[J.planets.ratio[k].minId]).join(' | ')} |`,
    `| 水星 ÷ 金星 | — | ${K.map((k) => fe3(J.planets.ratio[k].mercury)).join(' | ')} |`,
    `| 地球 ÷ 金星 | — | ${K.map((k) => fe3(J.planets.ratio[k].earth)).join(' | ')} |`].join('\n');
  const R = J.other.resid;
  T.other = ['| 源 | 成分 | 内合 [rad/s] | 外合 [rad/s] | 会合の平均(ベクトル)[rad/s] | 大きさの平均 [rad/s] | 内合 ÷ 残り (N+) eq | 大きさの平均 ÷ 残り | 内合 ÷ 外合 | 内合・外合の距離 [AU] |', '|---|---|---|---|---|---|---|---|---|---|',
    ...J.other.rows.map((r) => `| ${NM[r.src]} | ${PN[r.part]} | ${fe(r.inf)} | ${fe(r.sup)} | ${fe(r.mean)} | ${fe(r.meanMag)} | ${fe(r.infOverRes)} | ${fe(r.meanOverRes)} | ${fe(r.infOverSup)} | ${f3(r.dInfAU)}・${f3(r.dSupAU)} |`),
    `| 太陽 | (S)(背景なし) | ${fe(R.sunS.radS)} | — | — | — | ${fe(R.sunS.radS / R.np.radS)} | — | — | — |`,
    `| 太陽 | (M)(比べる列) | ${fe(R.sunM.radS)} | — | — | — | ${fe(R.sunM.radS / R.np.radS)} | — | — | — |`].join('\n');
  T.resid = ['| 残り(太陽の (S) + 背景 (uV)) | [rad/s] | [″/年] |', '|---|---|---|',
    `| (N+)・等重み | ${fe3(R.np.radS)} | ${fe3(R.np.asYr)} |`, `| (N+)・角運動量の重み | ${fe3(R.npL.radS)} | ${fe3(R.npL.asYr)} |`, `| (G−) | ${fe3(R.gm.radS)} | ${fe3(R.gm.asYr)} |`].join('\n');
  const Q = J.resonance;
  T.resonance = ['| 自転周期の列(仮・未照合) | 周期 [日] | 太陽日 [日] | 1 会合周期の回転の数(地球の向きに対して) | 整数からのずれ | 内合ごとの経度のずれ [°] | 一巡の年数 | 共鳴の周期との差 [日] | 差 ÷ σ |', '|---|---|---|---|---|---|---|---|---|',
    ...Q.rows.map((r) => `| ${SPN[r.key]} | ${f4(r.spinDays)} | ${f3(r.solar)} | ${f5(r.turns)} | ${fe3(r.frac)} | ${f3(r.shiftDeg)} | ${fe3(r.cycleYr)} | ${f4(r.dP)} | ${f3(r.dPsigma)} |`)].join('\n');
  T.paths = ['| 背景の向き・基準軸 | 残り Ω [″/年] | 平行成分 ŝ·Ω [″/年] | 直交成分 [″/年] | 自転軸と Ω の角 [°] | 寄る率の時間 1 ÷ abs(Ω⊥) [年] | 平行成分 ÷ 自転の率 |', '|---|---|---|---|---|---|---|',
    ...J.paths.rows.map((r) => `| ${DN[r.dir]}${r.axis === 'gal' ? '' : ' ' + AXN[r.axis]} | ${fe(r.omAsYr)} | ${sg(r.parAsYr)} | ${fe(r.perpAsYr)} | ${f3(r.thetaDeg)} | ${fe(r.tPerpYr)} | ${fe(r.parOverSpin)} |`)].join('\n');
  T.pathDecl = ['| 道 | いまの器で数えられる量 | 数えるのに足りない量 |', '|---|---|---|', ...J.pathDecl.map((p) => `| ${p.name} | ${p.can} | ${p.lack} |`)].join('\n');
  return T;
}
/** 数の文(節に逐語) */
export function factsOf(J) {
  const F = {}, c = (part, dir, axis) => J.cancel.find((r) => r.part === part && r.dir === dir && r.axis === axis);
  const np = c('S', 'Np', 'eq'), npL = c('S', 'Np', 'L'), npE = c('S', 'Np', 'ecl'), gm = c('S', 'Gm', 'gal'), msNm = c('MS', 'Nm', 'eq');
  F.cancel = `金星・成分 (S)・(N+): 残り (ア) は等重みの軸 ${fe3(np.resMag)}・角運動量の重みの軸 ${fe3(npL.resMag)}・黄道の極 ${fe3(npE.resMag)}(φ ${f3(np.phiDeg)}°・${f3(npL.phiDeg)}°・${f3(npE.phiDeg)}°)。(イ) ÷ (ア) の倍率は ${f5(np.minOverMag)}・${f5(npL.minOverMag)}・${f5(npE.minOverMag)} で、残りは (ア) と (イ) で有効数字 3 桁まで同じ。(N−) は打ち消さない。(G−) は (イ) の倍率が (ア) の ${f3(gm.minOverMag)} 倍で、残りは (ア) ${f3(gm.resMag)}・(イ) ${f3(gm.resMin)}(φ ${f3(gm.phiDeg)}°)。成分 (MS) では (N+) が打ち消さず、(N−) で打ち消す(等重みの軸で残り ${fe3(msNm.resMag)}・倍率 ${f4(msNm.uMag)})`;
  const A = J.angle;
  F.angle = `太陽の自転軸と金星の公転の法線の角 i は ${f3(A.iDeg)}°。−Ŝ は金星の法線から ${f3(A.offDeg)}°(閉じた形 atan(tan i ÷ 2) = ${f3(A.offClosedDeg)}°)だけ太陽の自転軸と反対の側に在る。φ は、基準軸と金星の法線の角(${A.rows.map((r) => f3(r.nDeg) + '°').join('・')})と基準軸と太陽の自転軸の角(${A.rows.map((r) => f3(r.sunDeg) + '°').join('・')})の組で決まり、小角の式 abs((3 n̂ − ŝ☉) ÷ 2 − b̂) は数値と ${A.rows.map((r) => f3(r.phiSmallDeg - r.phiDeg)).join('・')}° 違う`;
  const st = (a) => J.scan.star.find((r) => r.axis === a);
  F.star = `試しの受け手(基準軸に垂直な円の道・自転軸は基準軸・背景 = (uV) の大きさ ${fe3(J.scan.BAsYr)}″/年・(N+)): (S) は距離の −3 乗。合成が最小の距離 r* は等重み ${f4(st('eq').rStarAU)} AU・角運動量の重み ${f4(st('L').rStarAU)} AU・黄道の極 ${f4(st('ecl').rStarAU)} AU で、r* の残りは ${fe3(st('eq').combOverB)}・${fe3(st('L').combOverB)}・${fe3(st('ecl').combOverB)}(φ は距離に依らず ${f3(st('eq').phiDeg)}°・${f3(st('L').phiDeg)}°・${f3(st('ecl').phiDeg)}° —— 道の法線が基準軸のとき atan(tan(太陽の円錐) ÷ 2))。内側(0.3 AU)の合成は (S) の向きから ${f3(st('eq').innerAngToS)}°・外側(2 AU)の合成は背景の向きから ${f3(st('eq').outerAngToBg)}°`;
  const pr = J.planets.ratio;
  F.planets = `8 惑星の実際の位置で背景 (uV) と合わせた合成 ÷ 背景の最小は、(N+) の 3 軸とも金星(水星は金星の ${fe3(pr['Np|eq'].mercury)}・${fe3(pr['Np|L'].mercury)}・${fe3(pr['Np|ecl'].mercury)} 倍・地球は ${fe3(pr['Np|eq'].earth)}・${fe3(pr['Np|L'].earth)}・${fe3(pr['Np|ecl'].earth)} 倍)。(G−) の最小は${NM[pr['Gm|gal'].minId]}(金星 ${fe3(J.planets.rows.find((r) => r.id === 'Venus').cols['Gm|gal'].comb)}・地球は金星の ${fe3(pr['Gm|gal'].earth)} 倍)`;
  const R = J.other.resid, row = (s, p) => J.other.rows.find((r) => r.src === s && r.part === p);
  F.other = `金星の位置の残り(太陽の (S) + 背景 (uV)・(N+)・等重み)は ${fe3(R.np.radS)} rad/s(${fe3(R.np.asYr)}″/年)。ほかの源の (S) の大きさの平均 ÷ 残り: 地球 ${fe(row('Earth', 'S').meanOverRes)}・木星 ${fe(row('Jupiter', 'S').meanOverRes)}・水星 ${fe(row('Mercury', 'S').meanOverRes)}(内合 ÷ 外合: 地球 ${fe(row('Earth', 'S').infOverSup)})。(M) の比べる列: 地球 ${fe(row('Earth', 'M').meanOverRes)}・木星 ${fe(row('Jupiter', 'M').meanOverRes)}・水星 ${fe(row('Mercury', 'M').meanOverRes)}(地球の内合 ÷ 外合 ${fe(row('Earth', 'M').infOverSup)})。残りの中で一番大きい源: (S) の中では${NM[J.other.topS]}・(M) を入れると ${J.other.topAll.split('|').map((x, k) => (k === 0 ? NM[x] : PN[x])).join(' ')}`;
  const Q = J.resonance, q = (k) => Q.rows.find((r) => r.key === k);
  F.resonance = `仮・未照合: 会合周期 ${f3(Q.synodicRepo)} 日(リポジトリの公転の周期から —— 台帳 ${Q.synodicProv} 日)・共鳴の周期 ${f4(Q.Pres)} 日。仮の自転周期 ${q('prov').spinDays} 日では、1 会合周期に地球の向きに対して ${f5(q('prov').turns)} 回転し、内合ごとに地球を向く経度が ${f3(q('prov').shiftDeg)}° ずれ、一巡は ${fe3(q('prov').cycleYr)} 年。共鳴の周期との差は ${f4(q('prov').dP)} 日(σ ${Q.sigma} 日の ${f3(q('prov').dPsigma)} 倍)で、1σ の範囲ではずれの符号は変わらない(${f3(q('provLo').shiftDeg)}〜${f3(q('provHi').shiftDeg)}°)`;
  const pth = (d, a) => J.paths.rows.find((r) => r.dir === d && r.axis === a);
  F.paths = `残り Ω と金星の自転軸の角: (N+)・等重み ${f3(pth('Np', 'eq').thetaDeg)}°・(N+)・角運動量の重み ${f3(pth('Np', 'L').thetaDeg)}°・(G−) ${f3(pth('Gm', 'gal').thetaDeg)}°。寄る率の時間 1 ÷ abs(Ω⊥) は ${fe(pth('Np', 'eq').tPerpYr)}・${fe(pth('Np', 'L').tPerpYr)}・${fe(pth('Gm', 'gal').tPerpYr)} 年(係数 1)。平行成分 ÷ 金星の自転の率は ${fe(pth('Np', 'eq').parOverSpin)}・${fe(pth('Np', 'L').parOverSpin)}・${fe(pth('Gm', 'gal').parOverSpin)}`;
  return F;
}

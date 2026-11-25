// 第352便r(原仮定者の整理(2026-11-24 —— 第148報)・統括の検証項目 R455):
// **正本 tests/out/twobg-352r.json から PHYSICS〔第352便r〕の表を作る文書の lib**
// (QA docs.twobg352r が節の表と逐語で照合する —— 表の数は有効数字 3 桁・角は小数 3 桁か 1 桁)。原文(言葉を変えずに引く)と読みの表もここに持つ。
export const DOC_VERSION = 'w352r-twobgdoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fe = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f3 = (x) => (!fin(x) ? '—' : Number(x).toFixed(3));
const f1 = (x) => (!fin(x) ? '—' : Number(x).toFixed(1));
const f2 = (x) => (!fin(x) ? '—' : Number(x).toFixed(2));
const pc = (x) => (!fin(x) ? '—' : (100 * x).toFixed(2) + '%');
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const fl9 = (x) => (!fin(x) ? '—' : x === 0 ? '0' : x < 1e-9 ? '< 1e-9' : Number(x).toExponential(1));
const RHO = (r) => (r === 'inf' ? '∞((G−) だけ)' : r === 0 ? '0((N+) だけ)' : String(r));
const AXN = Object.freeze({ L: 'L(角運動量の重み)', eq: 'eq(等重み)' });
const RADN = Object.freeze({ rule: '規則の半径', obs: '観測の半径' });
const SN = Object.freeze({ g2p: '(g2+)', g2m: '(g2−)' });
const PN = Object.freeze({ spinSlow: '輪 1・太陽 0.99', spinFast: '輪 0.99・太陽 1', ringFixed: '輪 0(動かない)・太陽 1', spinFixed: '輪 1・太陽 0(動かない)' });
const KN = Object.freeze({ 1: 'K1', 2: 'K2' });
const DIRN = Object.freeze({ Np: '(N+) だけ', Gm: '(G−) だけ', 'Np+Gm': '(N+) + (G−)' });
const nul = (x, s) => (x === null || x === undefined ? s : x);

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の整理(2026-11-24 —— 第148報)', '太陽系の、多くの天体の公転面に垂直かつ、多くの天体の歳差運動の中心軸方向が、太陽系の基準軸方向である']),
  Object.freeze(['原仮定者の整理(2026-11-24 —— 第148報)', '太陽系の基準軸方向に対する、太陽の自転軸の傾きも歳差運動である。そこを手掛かりに、銀河由来の背景軸引きずりを算出する']),
  Object.freeze(['原仮定者の整理(2026-11-24 —— 第148報)', '銀河由来の円盤引きずりで、恒星は銀河の公転面に引き寄せられ、波打つ様に上下する。太陽の自転軸の傾きは、その際に生じる']),
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第148報)', 'AN1019: Aで進める。金星の自転の逆回転は、釣り合った状態で地球とも共鳴した結果である']),
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第148報)', 'AN1017: これまでの向き。自転と、主に銀河由来の軸引きずりが順回転なら、歳差運動は逆回転になる']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['背景の向きの候補 (N+)(基準軸の向き)の元の文。(N+) だけでは傾きを作れない(〔第352便l〕)ので、(G−) の項を比 b ÷ a で足した候補を走査する(背景が 2 つの項から成るとは書かない)', '表 2・表 3']),
  Object.freeze(['太陽の円錐(合成の軸と太陽の自転軸の角)を比の関数で数える目当て(基準軸 L 5.968°・eq 5.230°)', '表 2・表 3']),
  Object.freeze(['予想の文。傾きを作る作用の候補 (b)(輪と自転軸の係数の差)と (d)(上下の運動の揺れ)を、背景の向きの項 1 つ/2 つと組にして並べる', '表 4・表 5・表 6']),
  Object.freeze(['予想の文。「金星の条件」(金星で (S) と背景の大きさが同じ —— (uV))で背景の (N+) の項の大きさ a を置く。打ち消しの残りを比の関数で数える(地球との共鳴は数えない)', '表 2・表 3']),
  Object.freeze(['歳差の向き (g2+)・(g2−) を同じ重さで並べる。作られる方位からいまの方位まで進む角は向きで替わる', '表 4']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 比の両端(b 0 = (N+)・a 0 = (G−))と第352便j の \`cellOf\`(8 惑星 × 基準軸 2 —— 合成と ŝ・合成と基準軸・cos・合成)の差の最大 | ${fl9(S.vsJ)} | ${tf(G.rhoEndsVsMainTable)} |`,
    `| ② 統括の数え直し 1 の表(eq・3 桁)との差 ÷ 半桁の最大 | ${f2(S.vsAnchor)} | ${tf(G.anchorTable)} |`,
    `| ③ 局所の (S) の規則の列と第351便c の \`partRot\`・太陽の列と第352便e の \`sunLocal\` の相対の差 | ${fl9(S.vsPart)}・${fl9(S.vsSun)} | ${tf(G.localRuleVsPartRot)} |`,
    `| ④ 地球の (S): 観測の半径 ÷ 規則の半径 | ${fe(S.obsBig)} | ${tf(G.obsRadiusLarger)} |`,
    `| ⑤ 金星の条件の倍率(規則の半径)と第352便d の \`uVenus\` | ${fe(S.uV)}・${fe(S.uVd)} | ${tf(G.venusCondition)} |`,
    `| ⑥ 太陽の円錐(局所の (S) を入れた合成): (N+) eq・(N+) L・(G−) [°] | ${S.sunCone.eq}・${S.sunCone.L}・${S.sunCone.Gm} | ${tf(G.sunCone)} |`,
    `| ⑦ 開き始めの率の閉じた形と第352便l の \`twoAxisStep\`(短い時間)の相対の差 | ${fl9(S.rateVs)} | ${tf(G.openRateVsStep)} |`,
    `| ⑧ 経路 ② の年数の往復(その年数で 5.968° —— [°])・年齢の内に要る係数の差の往復 | ${fl9(S.yrRound)}・${fl9(S.dRound)} | ${tf(G.openYearsRound)} |`,
    `| ⑨ 作られる方位と短い步の向きの差 [°](経路 ②・(g2+)・輪 1・太陽 0.99) | ${f3(S.azVs)} | ${tf(G.createdAzVsStep)} |`,
    `| ⑩ 進む角: (g2+) と (g2−) の和が 360・同じ方位で 0 | ${S.adv.join('・')} | ${tf(G.advance)} |`,
    `| ⑪ 揺れ: 減りの率 0 で第352便l の \`wobbleRadius\`・共鳴の閉じた形・窓の端・減りの率つきの步との相対の差 | ${fl9(S.wVs)}・${fl9(S.wrVs)}・${fl9(S.wEdge)}・${fl9(S.wStep)} | ${tf(G.wobble)} |`,
    `| ⑫ 拒否(負の項・負の比・半径の名・長さ・向きの名・共鳴の 0 除算・係数の差 0) | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  // 表 2: 比の走査
  const r1 = J.t1, g = (axn, m, rho) => r1.find((r) => r.axis === axn && r.mag === m && r.rho === rho);
  T.rho = ['| 基準軸 | b ÷ a | 背景と基準軸の角 θ [°] | 太陽の円錐 [°] | 金星の残り(合成 ÷ 背景) | 地球の合成と基準軸 [°] | 火星の合成と基準軸 [°] | 経路 ② で届く角の上限 2θ [°] | 年齢の内に要る係数の差(経路 ②): 規則の半径・観測の半径・倍率 1 | 係数の差 1% で 届く年数(経路 ②): 規則・観測 |', '|---|---|---|---|---|---|---|---|---|---|',
    ...J.rowDecl.axes.flatMap((axn) => J.t1.filter((r) => r.axis === axn && r.mag === 'uVrule').map((r) => {
      const o = g(axn, 'uVobs', r.rho), u = g(axn, 'u1', r.rho), y = (q) => (q.per['0.01'].yr2 === null ? '届かない' : fe(q.per['0.01'].yr2));
      return `| ${AXN[axn]} | ${RHO(r.rho)} | ${f3(r.thDeg)} | ${f3(r.sunConeDeg)} | ${pc(r.venusRes)} | ${f3(r.earthRefDeg)} | ${f3(r.marsRefDeg)} | ${f3(r.maxGamma2Deg)} | ${r.dAge2 === null ? '届かない' : fe(r.dAge2) + '・' + fe(o.dAge2) + '・' + fe(u.dAge2)} | ${y(r)}・${y(o)} |`;
    }))].join('\n');
  // 表 3: 同時の条件
  T.win = ['| 基準軸 | (S) の源の半径 | b ÷ a 0 で条件を満たす | 条件を満たす帯の数 | 範囲の上端(縛る条件は太陽の円錐) | 経路 ② で届く下端(2θ ≥ γ) | 重なり | 上端での金星の残り・地球の合成と基準軸 [°] | 年齢の内に要る係数の差: 上端・範囲の中(幾何の中)・上端で倍率 1 の比べる列 | 走査の中の金星の残りの最小 |', '|---|---|---|---|---|---|---|---|---|---|',
    ...J.t2.map((r) => `| ${AXN[r.axis]} | ${RADN[r.rad]} | ${tf(r.okAtZero)} | ${r.nBands} | ${fe(r.hi)} | ${fe(r.reachLo)} | ${tf(r.overlap)} | ${pc(r.venAtHi)}・${f3(r.earthAtHi)} | ${fe(r.dAgeAtHi)}・${fe(r.dAgeAtMid)}・${fe(r.dAgeAtHiU1)} | ${pc(r.venMin)} |`)].join('\n');
  // 表 4: 方位
  T.az = ['| 基準軸 | b ÷ a | 経路 | 係数の組 | 歳差の向き | 作られる方位 − (G+) [°] | いま − (G+) [°] | 進む角 [°] | 進む時間 [年]: 規則・観測・倍率 1 | 步の標本: いまの側(前の半分)の割合・いまの方位との最小の差 [°] |', '|---|---|---|---|---|---|---|---|---|---|',
    ...J.t3.map((r) => `| ${AXN[r.axis]} | ${r.rhoName === 'inf' ? '∞' : '範囲の中 ' + fe(r.rho)} | ${r.f === 0 ? '②' : '①'} | ${PN[r.pair]} | ${SN[r.sense]} | ${f1(r.createdDAz)} | ${f1(r.nowDAz)} | ${f1(r.advDeg)} | ${fe(r.tYr.uVrule)}・${fe(r.tYr.uVobs)}・${fe(r.tYr.u1)} | ${r.nSamp ? f2(r.frontFrac) + '・' + f2(r.nearestDeg) : '開かない(0.5° 未満)'} |`)].join('\n');
  // 表 5: 揺れの窓(仮)
  T.wob = ['| 核 | 振幅 [pc](仮) | 周期 [年](仮) | 作用 A [″/年] | ω_z [″/年] | 共鳴の背景の倍率 ω_z ÷ ω_G | ÷ (uV) 規則・観測 | L 5.968° に届く減りの率の上限 [1/年] | 共鳴の上で育つ年数 ÷ 年齢 | 窓の幅(片側 ÷ ω_z): γ_d 0・上限の半分 | (uV) の背景での円の半径 [°] 規則・観測 |', '|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.t4.rows.map((r) => `| ${KN[r.al]} | ${r.Zpc} | ${fe(r.TzYr)} | ${fe(r.AAsYr)} | ${fe(r.wAsYr)} | ${f3(r.uRes)} | ${fe(r.uResOverUVrule)}・${fe(r.uResOverUVobs)} | ${fe(r.per.L.gMaxPerYr)} | ${fe(r.per.L.growOverAge)} | ${fe(r.per.L.win0)}・${fe(r.per.L.winHalf)} | ${fe(r.per.L.radAtUVrule)}・${fe(r.per.L.radAtUVobs)} |`)].join('\n');
  // 表 6: まとめ
  T.sum = ['| 基準軸 | 背景の向きの項 | 傾きを作る作用 | 太陽の円錐 [°] | 金星の残り | 地球の合成と基準軸 [°] | 傾きを作れるか(年齢の内) | 要る係数の差: 規則・観測 | 連続のノブの数 | 作られる方位 − (G+) [°] |', '|---|---|---|---|---|---|---|---|---|---|',
    ...J.t5.rows.map((r) => {
      const mk = r.act === 'b' ? (r.canMake ? '作れる(係数の差で)' : '作れない(基準軸にそろった軸は動かない)') : (r.canMake ? '作れる' : '共鳴の上でも年齢の ' + fe(J.t5.dGrowMinOverAge) + ' 倍以上');
      const dir = r.terms === 2 ? DIRN[r.dir] + '(比 ' + fe(r.rhoLo) + '〜' + fe(r.rhoHi) + ' —— 値は上端)' : DIRN[r.dir];
      return `| ${AXN[r.axis]} | ${dir} | (${r.act}) | ${f3(r.sunConeDeg)} | ${pc(r.venusRes)} | ${f3(r.earthRefDeg)} | ${mk} | ${r.dAgeRule === null ? '—' : fe(r.dAgeRule) + '・' + fe(r.dAgeObs)} | ${r.knobs} | ${r.side ? f1(r.side.min) + '〜' + f1(r.side.max) + '(経路 ② の開き始め)' : '—'} |`;
    })].join('\n');
  return T;
}

/** 数の文(節に逐語) */
export function factsOf(J) {
  const F = {}, w = (axn, rad) => J.t2.find((r) => r.axis === axn && r.rad === rad), r1 = (axn, m, rho) => J.t1.find((r) => r.axis === axn && r.mag === m && r.rho === rho);
  const wL = w('L', 'rule'), wE = w('eq', 'rule'), wLo = w('L', 'obs'), wEo = w('eq', 'obs');
  F.window = `- 同時の条件(太陽の円錐 10° 以内・金星の残り 10% 以内・地球の合成が基準軸から 10° 以内)を満たす比 b ÷ a は、0 から上端までの 1 つの帯: L で 0〜${fe(wL.hi)}・eq で 0〜${fe(wE.hi)}(上端を縛るのは太陽の円錐 —— 上端で金星の残り ${pc(wL.venAtHi)}・${pc(wE.venAtHi)})。経路 ② で 5.968°(L)・5.230°(eq)に届くには 2θ ≥ γ が要り、その下端は ${fe(wL.reachLo)}・${fe(wE.reachLo)} —— 重なる比は L で ${fe(wL.reachLo)}〜${fe(wL.hi)}・eq で ${fe(wE.reachLo)}〜${fe(wE.hi)}。`;
  F.delta = `- その重なりの上端で、太陽系の年齢の内に経路 ② で届くのに要る係数の差は、規則の半径(a = (uV))で L ${fe(wL.dAgeAtHi)}・eq ${fe(wE.dAgeAtHi)}/観測の半径で L ${fe(wLo.dAgeAtHi)}・eq ${fe(wEo.dAgeAtHi)}/比べる列の倍率 1 で L ${fe(wL.dAgeAtHiU1)}・eq ${fe(wE.dAgeAtHiU1)}。角(円錐・残り・合成の角)は源の半径の 2 列で 3 桁同じ(a を金星の条件で置くため)—— 差は大きさ(年数と要る係数の差)にだけ出る。`;
  const zL = r1('L', 'uVrule', 0), iL = r1('L', 'uVrule', 'inf');
  F.ends = `- 比の両端(L): (N+) だけ(b ÷ a 0)で太陽の円錐 ${f3(zL.sunConeDeg)}°・金星の残り ${pc(zL.venusRes)}・地球 ${f3(zL.earthRefDeg)}°・傾きは作れない/(G−) だけ(∞)で ${f3(iL.sunConeDeg)}°・${pc(iL.venusRes)}・${f3(iL.earthRefDeg)}°・年齢の内に要る係数の差は規則 ${fe(iL.dAge2)}・観測 ${fe(r1('L', 'uVobs', 'inf').dAge2)}。`;
  const az = (axn, rho, pair, f) => J.t3.filter((r) => r.axis === axn && r.rhoName === rho && r.pair === pair && r.f === f);
  const fr = (xs) => xs.map((r) => (r.frontFrac === null ? '—' : f2(r.frontFrac))).join('・');
  F.side = `- 作られる方位(L・経路 ②): 開き始めは (G+) の方位から ±90°(係数の組と歳差の向きで替わる)。步の標本で、いまの方位(${f1(J.t3[0].nowDAz)}°)の側(前の半分)に居る割合は、比が範囲の中なら 輪と太陽の両方が動く組で ${fr(az('L', 'mid', 'spinSlow', 0))}・輪が動かない組で ${fr(az('L', 'mid', 'ringFixed', 0))}/(G−) だけ(∞)では どの組も ${fr(az('L', 'inf', 'spinSlow', 0))}・${fr(az('L', 'inf', 'ringFixed', 0))}((g2−)・(g2+) の順)。`;
  const ws = J.t4.rows, k1 = ws.filter((r) => r.al === 1), k2 = ws.filter((r) => r.al === 2), mm = (xs, f) => [Math.min(...xs.map(f)), Math.max(...xs.map(f))];
  const g1 = mm(k1, (r) => r.per.L.growOverAge), g2 = mm(k2, (r) => r.per.L.growOverAge), wn = mm(k1, (r) => r.per.L.win0), uu = mm(ws, (r) => r.uRes), ur = mm(ws, (r) => r.uResOverUVrule), uo = mm(ws, (r) => r.uResOverUVobs);
  F.wob = `- 上下の運動の揺れ(仮・未照合): 共鳴(Ω_p = ω_z)の背景の倍率は ${f3(uu[0])}〜${f3(uu[1])} —— 金星の条件の倍率の ${fe(ur[0])}〜${fe(ur[1])} 倍(規則の半径)・${fe(uo[0])}〜${fe(uo[1])} 倍(観測の半径)。共鳴の上でも 5.968° に育つ年数は年齢の ${fe(g1[0])}〜${fe(g1[1])} 倍(K1)・${fe(g2[0])}〜${fe(g2[1])} 倍(K2)。窓の幅は減りの率 0 で ω_z の ${fe(wn[0])}〜${fe(wn[1])}(K1・片側)。`;
  return F;
}

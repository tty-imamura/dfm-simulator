// 第352便x(原仮定者の整理(2026-11-24 —— 第148報)・統括の検証項目 R461):
// **正本 tests/out/sunorigin-352x.json から PHYSICS〔第352便x〕の表を作る文書の lib**
// (QA docs.sunorigin352x が節の表と逐語で照合する —— 表の数は有効数字 3 桁・角は小数 2 桁か 1 桁)。原文(言葉を変えずに引く)と読みの表もここに持つ。
export const DOC_VERSION = 'w352x-sunorigindoc-1';
const fin = (x) => typeof x === 'number' && Number.isFinite(x);
const fe = (x) => (!fin(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f2 = (x) => (!fin(x) ? '—' : Number(x).toFixed(2));
const f1 = (x) => (!fin(x) ? '—' : Number(x).toFixed(1));
const fq = (x) => (!fin(x) ? '—' : String(x));
const pc = (x) => (!fin(x) ? '—' : (100 * x).toFixed(2) + '%');
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const fl9 = (x) => (!fin(x) ? '—' : x === 0 ? '0' : x < 1e-9 ? '< 1e-9' : Number(x).toExponential(1));
const RHO = (r) => (r === 'inf' ? '∞((G−) だけ)' : r === 0 ? '0((N+) だけ)' : String(r));
const AXN = Object.freeze({ L: 'L(角運動量の重み)', eq: 'eq(等重み)' });
const SN = Object.freeze({ g2p: '(g2+)', g2m: '(g2−)', '—': '—' });
const RN = Object.freeze({ A: '読み A(始まり = いまの基準軸)', B: '読み B(終わりの輪の法線 = いまの基準軸)', '—': '—' });
const LAWN = Object.freeze({ uni: '一様(全部 1)', i: '1 ÷ n(木星の輪を 1)', u: 'n(木星の輪を 1)' });
const MAGN = Object.freeze({ uVrule: '(uV) 規則の半径', uVobs: '(uV) 観測の半径', u1: '倍率 1' });
const CN = Object.freeze({ P1: '(P1) (S1) の読み', P2: '(P2) (S2) の読み', P3: '(P3) 慣性の形 0.4 ÷ C', a1: '(ア) (S1) ω_T ÷ ω_L', a2: '(ア) (S2) √(ω² + abs(Ω⊥)²) ÷ ω', i: '(イ) 1 ÷ ω', u: '(ウ) n² ÷ ω', uJ: '(ウ′) n² J2 ÷ (ω C′)', e: '(エ) c_R の入り方' });
const IDN = Object.freeze({ 'Np-only': '(N+) だけ', 'Gm-only-A-f0': '(G−) だけ・読み A・経路 ② だけ', 'Gm-only-B-f0': '(G−) だけ・読み B・経路 ② だけ', 'two-A-f0': '2 つの項(比 0.075)・読み A・経路 ② だけ',
  'two-B-f0': '2 つの項(比 0.075)・読み B・経路 ② だけ', 'two-B-mix': '2 つの項(比 0.075)・読み B・2 経路(0 < f < 1)', 'Gm-only-B-mix': '(G−) だけ・読み B・2 経路(0 < f < 1)' });
const qs = (xs) => xs.map((q) => (q === -1 ? '−1(太陽が動かない)' : q < 0 ? '−' + Math.abs(q) : '+' + q)).join('・');
const C3 = (o) => (o ? `${fe(o.uVrule)}・${fe(o.uVobs)}・${fe(o.u1)}` : '—');

/** 原文(言葉を変えずに引く) */
export const ORIGINAL = Object.freeze([
  Object.freeze(['原仮定者の整理(2026-11-24 —— 第148報)', '銀河由来の円盤引きずりで、恒星は銀河の公転面に引き寄せられ、波打つ様に上下する。太陽の自転軸の傾きは、その際に生じる']),
  Object.freeze(['原仮定者の整理(2026-11-24 —— 第148報)', '太陽系の基準軸方向に対する、太陽の自転軸の傾きも歳差運動である。そこを手掛かりに、銀河由来の背景軸引きずりを算出する']),
  Object.freeze(['原仮定者の回答(2026-11-24 —— 第148報)', 'AN1017: これまでの向き。自転と、主に銀河由来の軸引きずりが順回転なら、歳差運動は逆回転になる']),
]);
/** 統括の読み(原文と分ける)—— [読み, 数えた所] */
export const READINGS = Object.freeze([
  Object.freeze(['予想の文。傾きを作る作用の候補のうち (b)(公転面の輪と太陽の自転軸が別の係数で背景に応える)を、輪も動く組で続ける(上下の運動の揺れ (d) は〔第352便r〕の表のまま)。初めにそろっていた 2 つの軸が、いまの角といまの方位に同時に届く組を走査する', '表 2・表 3・表 5']),
  Object.freeze(['いまの角(基準軸 L 5.968°・eq 5.230°)と、いまの方位((G+) の方位から L −22.5°・eq −13.3°)の両方を目当てにする。届く組の範囲から背景の比・大きさ・係数の組の幅を出す(1 つに決めない)', '表 2・表 3・表 4']),
  Object.freeze(['歳差の向き (g2+)・(g2−) を同じ重さで並べる。方位の側は向きで替わる', '表 2・表 3']),
]);
export function originalTable(readings = READINGS) {
  return ['| # | 出どころ | 原文(言葉を変えずに引く) | 読み(統括の読み —— 原文と分ける) | 数えた所 |', '|---|---|---|---|---|',
    ...ORIGINAL.map(([src, o], k) => `| ${k + 1} | ${src} | 「${o}」 | ${readings[k][0]} | ${readings[k][1]} |`)].join('\n');
}

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 零試験・場面 | 値 | 門 |', '|---|---|---|',
    `| ① 写像(τ ≥ 0・f 0・0.5・1・(g2±))と第352便l の \`closedAxis\` の差の最大 | ${fl9(S.vsL)} | ${tf(G.mapVsClosedAxis)} |`,
    `| ② 逆の写像(経路 ① を含む)の往復の差 | ${fl9(S.back)} | ${tf(G.inverseMap)} |`,
    `| ③ 読み A の角と第352便l の \`twoAxisStep\` の差 [°] | ${fl9(S.vsStep)} | ${tf(G.readAVsTwoAxisStep)} |`,
    `| ④ 係数が同じなら角は開かない(読み A・B × f 0・0.5)[°] | ${fl9(S.same)} | ${tf(G.sameCoefNoOpen)} |`,
    `| ⑤ 読み B: 終わりの輪の法線 = いまの基準軸・f 0 の ŝ = N̂ を Ω̂ のまわりに Δφ 回したもの | ${fl9(S.vsB)} | ${tf(G.readBEndAtAxis)} |`,
    `| ⑥ いまの方位((G+) から)L・eq [°](枝 r の表と同じ) | ${S.nowAz.L}・${S.nowAz.eq} | ${tf(G.nowAzimuth)} |`,
    `| ⑦ 枝 r の帯の両端(経路 ② で届く下端の手前と、同時の条件の上端で 2θ と目当ての角) | ${Object.values(S.bandEnds).filter(Boolean).length}/4 | ${tf(G.bandEnds)} |`,
    `| ⑧ 輪が動かない組(読み A・経路 ②)の方位は (G−) の側(abs > 90°)の標本 | ${S.side}/${S.nSide} | ${tf(G.ringFixedSide)} |`,
    `| ⑨ 読み B・経路 ② の 2 つの探し方(Δφ の格子・τ の格子)の届きが同じ((G−) だけ) | ${tf(S.consistBG)} | ${tf(G.readBScanConsistent)} |`,
    `| ⑩ 太陽の局所の (S) ÷ 背景((uV)・規則 —— 走査で入れない大きさ) | ${fe(S.locOverBg)} | ${tf(G.sunLocalSmall)} |`,
    `| ⑪ 係数の比の候補: (P1) の差・(P3) の差(0.4 ÷ C − 1) | ${fq(S.qP1)}・${f2(S.qP3)} | ${tf(G.candRatios)} |`,
    `| ⑫ 係数がそろえば 8 惑星の公転面の散らばりは変わらない [°] | ${f2(S.sp0)} → ${f2(S.sp1)} | ${tf(G.uniformSpreadKept)} |`,
    `| ⑬ 拒否(向きの名・f の範囲・長さ・負の τ・読みの名・τ の上限 0・法則の名) | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  // 表 2: 届く組の走査の集計
  T.reach = ['| 基準軸 | 読み | 歳差の向き | 届いた組 / 走査した組 | 届いた f の範囲 | 届いた比 b ÷ a | 届いた係数の比 c_s ÷ c_n − 1 | 方位の差の最小 [°] | 年齢の内に届くのに要る輪の係数(最小): (uV) 規則・(uV) 観測・倍率 1 |', '|---|---|---|---|---|---|---|---|---|',
    ...J.t1s.map((r) => `| ${AXN[r.axis]} | ${RN[r.read]} | ${SN[r.sense]} | ${r.nHit}/${r.nAll} | ${r.nHit ? fq(r.fLo) + '〜' + fq(r.fHi) : '届かない'} | ${r.nHit ? r.rhos.map(RHO).join('・') : '—'} | ${r.nHit ? qs(r.qs) : '—'} | ${f1(r.nearAzDeg)} | ${r.nHit ? C3(r.needCMin) : '—'} |`)].join('\n');
  // 表 3: 読み B の f の窓
  T.win = ['| 基準軸 | b ÷ a | 背景と基準軸の角 θ [°] | 歳差の向き | c_s ÷ c_n − 1 | 届く f の範囲(刻み 0.005) | 窓の中の f | そのときの τ | 輪が回った角 [°] | 届いた方位 [°] | 比べる列 ∓atan(k₂ ÷ k₁) [°] | 要る輪の係数: (uV) 規則・(uV) 観測・倍率 1 |', '|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.t2.map((r) => `| ${AXN[r.axis]} | ${RHO(r.rho)} | ${f2(r.thDeg)} | ${SN[r.sense]} | ${qs([r.q])} | ${r.n ? fq(r.fLo) + '〜' + fq(r.fHi) : '届かない'} | ${r.mid ? fq(r.mid.f) : '—'} | ${r.mid ? fe(r.mid.tau) : '—'} | ${r.mid ? f2(r.mid.turnDeg) : '—'} | ${r.mid ? f1(r.mid.dAzDeg) : '—'} | ${r.mid ? f1(r.mid.azApproxDeg) : '—'} | ${r.mid ? C3(r.needC) : '—'} |`)].join('\n');
  // 表 4: 係数の比の候補
  T.cand = ['| 候補 | c_s ÷ c_n(輪 1) | c_s ÷ c_n − 1: (uV) 規則・(uV) 観測・倍率 1 | 走査したか | 届いた組 / 走査した組 | 届いた所(基準軸・読み・向き: f の範囲) | 方位の差の最小 [°] | 要る輪の係数(最小): 規則・観測・倍率 1 |', '|---|---|---|---|---|---|---|---|',
    ...J.t3.rows.map((r) => {
      const hs = r.hitSummary ? Object.entries(r.hitSummary).map(([k, v]) => { const [a, rd, s] = k.split('|'); return `${a}・${rd}・${SN[s]}: ${fq(v.fLo)}〜${fq(v.fHi)}`; }).join('/') : '';
      return `| ${CN[r.key]} | ${r.ratio === null ? '輪に量が無い' : fe(r.ratio)} | ${r.q === null ? '—' : fe(r.qByMag.uVrule) + '・' + fe(r.qByMag.uVobs) + '・' + fe(r.qByMag.u1)} | ${r.scanned ? '走査した' : (r.q === null ? '置けない' : '開かない(差が 1e-12 より小さい)')} | ${r.scanned ? r.nHit + '/' + r.nAll : '—'} | ${hs || '—'} | ${f1(r.nearAzDeg)} | ${r.nHit ? C3(r.needCMin) : '—'} |`;
    })].join('\n');
  // 表 5: 8 惑星の公転面
  T.orb = ['| 法線の係数の法則 | f | 基準軸 | 背景の大きさ | 散らばり 7° と両立する比の上限 | 比 0.075 で年齢の間の散らばりの最大 [°] | 比 0.075 で平均の軸の動き [°] | 比 ∞ で散らばりの最大 [°] | 比 ∞ で平均の軸の動き [°] |', '|---|---|---|---|---|---|---|---|---|',
    ...J.t4.rows.map((r) => { const a = r.per.find((p) => p.rho === 0.075), z = r.per[r.per.length - 1];
      return `| ${LAWN[r.law]} | ${r.f} | ${AXN[r.axis]} | ${MAGN[r.mag]} | ${r.allOk ? '格子の全部(∞ まで)' : r.rhoMax === null ? '格子の最小より下' : fq(r.rhoMax)} | ${f2(a.spreadMaxDeg)} | ${f2(a.meanMoveDeg)} | ${f2(z.spreadMaxDeg)} | ${f2(z.meanMoveDeg)} |`; })].join('\n');
  // 表 6: まとめ
  T.sum = ['| 基準軸 | 候補 | 歳差の向き | いまの角に届くか | いまの角といまの方位に同時に届くか | 方位の差の最小 [°] | 金星の残り((uV) 規則) | 公転面の散らばりの最大 [°](倍率 1): 一様・1 ÷ n | 連続のノブの数 | 要る輪の係数(最小): 規則・観測・倍率 1 |', '|---|---|---|---|---|---|---|---|---|---|',
    ...J.t5.rows.map((r) => `| ${AXN[r.axis]} | ${IDN[r.id]} | ${SN[r.sense]} | ${tf(r.angle)} | ${tf(r.azimuth)} | ${f1(r.nearAzDeg)} | ${pc(r.venusRes)} | ${f2(r.spreadUniDeg)}・${f2(r.spreadIDeg)} | ${r.knobs} | ${r.azimuth && r.needC ? C3(r.needC) : '—'} |`)].join('\n');
  // 表 7: 黄道の極の比べる列(仮)
  T.ecl = ['| b ÷ a | 背景と黄道の極の角 θ [°] | 歳差の向き | 目当ての角 [°](仮・未照合) | いまの方位 [°] | 届く f の範囲(c_s ÷ c_n − 1 = −1・読み B) | 輪が回った角 [°] |', '|---|---|---|---|---|---|---|',
    ...J.t6.rows.map((r) => `| ${RHO(r.rho)} | ${f2(r.thDeg)} | ${SN[r.sense]} | ${r.gT} | ${f1(r.azT)} | ${r.n ? fq(r.fLo) + '〜' + fq(r.fHi) : '届かない'} | ${r.mid ? f2(r.mid.turnDeg) : '—'} |`)].join('\n');
  return T;
}

/** 数の文(節に逐語) */
export function factsOf(J) {
  const F = {}, s = (axn, read, sense) => J.t1s.find((r) => r.axis === axn && r.read === read && r.sense === sense);
  const BLp = s('L', 'B', 'g2p'), BEp = s('eq', 'B', 'g2p'), BLm = s('L', 'B', 'g2m'), BEm = s('eq', 'B', 'g2m');
  F.readB = `- 読み B(終わりの輪の法線 = いまの基準軸)で、いまの角といまの方位に同時に届いた組は、(g2+) で L ${BLp.nHit}/${BLp.nAll}(f ${fq(BLp.fLo)}〜${fq(BLp.fHi)})・eq ${BEp.nHit}/${BEp.nAll}(f ${fq(BEp.fLo)}〜${fq(BEp.fHi)})、(g2−) で L ${BLm.nHit}・eq ${BEm.nHit}(方位の差の最小 ${f1(BLm.nearAzDeg)}°・${f1(BEm.nearAzDeg)}°)。経路 ② だけ(f 0)と経路 ① だけ(f 1)では、どの組も届かない(方位がそれぞれ (G−) の側・(G+) の方位の線の上)。届いた組の係数の比は、どれも太陽の自転軸の係数が輪より小さい側(c_s ÷ c_n − 1 が −1〜−0.1)。`;
  const w = (axn, rho, q) => J.t2.find((r) => r.axis === axn && r.rho === rho && r.sense === 'g2p' && r.q === q);
  const a = w('L', 'inf', -1), b = w('eq', 'inf', -1), c = w('L', 0.075, -1), d = w('eq', 0.075, -1);
  F.window = `- 読み B・(g2+)・太陽が動かない組(c_s 0)で届く f の窓は、(G−) だけで L ${fq(a.fLo)}〜${fq(a.fHi)}・eq ${fq(b.fLo)}〜${fq(b.fHi)}、比 0.075(枝 r の同時の条件の帯の中)で L ${fq(c.fLo)}〜${fq(c.fHi)}・eq ${fq(d.fLo)}〜${fq(d.fHi)}。窓の中の方位は、背景と基準軸の角が大きい行では ∓atan(k₂ ÷ k₁)の比べる列と 1° の桁で並ぶ(L・∞: ${f1(a.mid.dAzDeg)}° と ${f1(a.mid.azApproxDeg)}°)・帯の中の行では離れる(L・0.075: ${f1(c.mid.dAzDeg)}° と ${f1(c.mid.azApproxDeg)}°)。届いたとき輪の法線が回った角は、太陽が動かない組で ${f2(c.mid.turnDeg)}°(L・0.075)・c_s ÷ c_n 0.5 の組で ${f2(w('L', 0.075, -0.5).mid.turnDeg)}°。`;
  F.need = `- 年齢の内に届くのに要る輪の係数(輪 1 の物差しで τ を年齢の内の τ で割った値)は、比 0.075・太陽が動かない組で (uV) 規則の半径 ${fe(c.needC.uVrule)}(L)・${fe(d.needC.uVrule)}(eq)/(uV) 観測の半径 ${fe(c.needC.uVobs)}・${fe(d.needC.uVobs)}/倍率 1 ${fe(c.needC.u1)}・${fe(d.needC.u1)}。(G−) だけの行では観測の半径で ${fe(a.needC.uVobs)}・${fe(b.needC.uVobs)}(1 より小さい —— 係数 1 で年齢の内に届く)。`;
  const cr = (k) => J.t3.rows.find((r) => r.key === k), nB = (k) => Object.entries(cr(k).hitSummary || {}).filter(([key]) => /\|B\|g2p$/.test(key)).reduce((n, [, v]) => n + v.n, 0);
  F.cand = `- 係数の比を式の候補で置くと: (P1)・(ア)(S1) は差 0・(P2)・(ア)(S2) は差 ${fe(Math.abs(cr('P2').qByMag.u1))} 以下で開かない/(P3)(太陽が輪より速く応える側 ${fe(cr('P3').q)})は読み B で届かない(読み A で ${cr('P3').nHit} 組)/(イ)(c_s ÷ c_n − 1 = ${fe(cr('i').q)})・(ウ)(${fe(cr('u').q)})は太陽がほぼ動かない側で、係数の差のノブを足さずに読み B・(g2+) で届く組が在る(${nB('i')} 組・${nB('u')} 組 —— 読み A を含めると ${cr('i').nHit} 組・${cr('u').nHit} 組・f と比と大きさのノブは残る)/(ウ′)・(エ)は輪に量が無いので置けない。`;
  const o = (law, f, axn, m) => J.t4.rows.find((r) => r.law === law && r.f === f && r.axis === axn && r.mag === m);
  const u0 = o('uni', 0, 'L', 'u1'), i0 = o('i', 0, 'L', 'u1'), i0o = o('i', 0, 'L', 'uVobs'), n0 = o('u', 0, 'L', 'u1');
  F.orb = `- 8 惑星の公転面: 法線の係数がそろっていれば、散らばり(いま ${f2(J.t4.spread0Deg)}° —— 等しい重みの平均から)は年齢の間も変わらず、平均の軸だけが動く(L・倍率 1・比 0.075 で ${f2(u0.per.find((p) => p.rho === 0.075).meanMoveDeg)}°・∞ で ${f2(u0.per[u0.per.length - 1].meanMoveDeg)}°)。係数が公転の率で替わる法則では散らばりが増え、7° と両立する比の上限は 1 ÷ n で ${fq(i0.rhoMax)}(倍率 1)・${fq(i0o.rhoMax)}((uV) 観測)、n で ${fq(n0.rhoMax)}(倍率 1)。`;
  return F;
}

// 第337便k(原仮定者の回答(2026-11-15 —— 第138報の回答 2)・統括の検証項目 R347): **正本 tests/out/gyrodrag-337k.json から PHYSICS〔第337便k〕の表を作る文書の lib**
// (QA docs.gyrodrag337k が節の表と逐語で照合する —— 表の数は有効数字 3 桁の指数・丸めの程度の数〔恒等式の残差〕は「< 1e-x」の形で書く)。
export const DOC_VERSION = 'w337k-gyrodragdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toExponential(2));
const f2 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(2));
const lt = (x, t) => (Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : '**' + fe(x) + '**');
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const sg = (x) => (x > 0 ? '+' : x < 0 ? '−' : '0');
const NM = Object.freeze({ ringD: 'D 環', ringC: 'C 環', ringB: 'B 環', ringA: 'A 環', ringF: 'F 環', phobos: 'フォボス', moon: '月', titan: 'タイタン', triton: 'トリトン(逆行)',
  saturn: '土星', jupiter: '木星', uranus: '天王星', neptune: '海王星', mars: '火星', earth: '地球', sun: '太陽' });
const SPD = Object.freeze({ obs: 's', sd: 's_d' }), BASE = Object.freeze({ Req: 'R_eq', Robs: 'R_obs' }), SIZE = Object.freeze({ R: '半径', m: '質量' });
const AZ = Object.freeze({ 'vel|slice': '座標を運ぶ方位の場・slice', 'vel|lor4': '座標を運ぶ方位の場・lor4', 'vel|ball': '座標を運ぶ方位の場・ball', rigid: '剛体の場(対照 —— 並進引きずりの回転の分・R_d が入らない)', dampRigT1: 'T1 の組(剛体の場に対する相対の速度・χ ½)' });
const GRP = Object.freeze({ with: '有', without: '無', mixed: '混' });
const SET2 = Object.freeze({ mainHalf: '主(R_eq・半径・s・χ ½ —— 連続の解)', mainOne: '主(χ 1 —— 連続の解)', posHalf: '比べる列(p ≥ 0 の格子の最良・χ ½)' });

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| ① 直交の読み L̂̇_⊥ = c σ L̂ × L̂̇_az(L̂̇_az = Ω k̂ × L̂ → Ω (k̂ − L̂ cos i))の相対の差(plus・minus・add)・c = 0 で 0・di/dt = −Ω sin i | ${lt(S.orth.plus, 1e-12)}・${lt(S.orth.minus, 1e-12)}・${lt(S.orth.add, 1e-12)}・${lt(S.orth.zero, 1e-15)}・${lt(S.orth.di, 1e-12)} | ${tf(G.orth)} |`,
    `| ② EQ-23(\`gyroResponse\`)の歳差の軸と直交の読みの L̂̇ の向きの相対の差・EQ-23 の dL = N(90° 回した別のトルクを足さない) | ${lt(S.eq23.rel, 1e-12)}・${S.eq23.dL} | ${tf(G.eq23)} |`,
    `| ③ 直交の読みを速度の場 d = ω × x に置いた数と、剛体の場の L̂̇ を直交に回した値・時間積分(2000/4000 步/周 × 20 周)と一次の傾きの率・刻みの差 | ${lt(S.field.ldot, 1e-3)}・${lt(S.field.integ, 2e-2)}・${lt(S.field.steps, 1e-3)} | ${tf(G.field)} |`,
    `| ④ T1 の型: フォボスと月の単位の率の符号(第337便j の境目 n/s = χ)・λ = 0 で 0・落ち方の基準の倍 (R_eq/R_obs)^q と大きさの因子 R^p | ${sg(S.t1.signs[0])}・${sg(S.t1.signs[1])}・${S.t1.zero}・${lt(S.t1.base, 1e-12)}・${lt(S.t1.size, 1e-12)} | ${tf(G.t1)} |`,
    `| ⑤ 対数の最小二乗(4 点を厳密に通る線から係数を解き直す) | ${lt(S.lsq, 1e-9)} | ${tf(G.lsq)} |`,
    `| ⑥ 入力の拒否 | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  const t1 = J.t1, d1 = J.decl.t1;
  const rt = (r) => (r ? ['phobos', 'moon', 'titan', 'triton'].map((k) => f2(r[k])).join('・') : '—');
  T.t1Sets = ['| 組(χ・速さ・落ち方の基準・大きさの読み) | 符号(観測と同じ数/4) | q = p = 0 の S | 連続の解 q・p | 連続の解の S | 連続の解の λ | 連続の解の 計算 ÷ 観測(フォボス・月・タイタン・トリトン) | 1 桁の内(S ≤ 100)・2 倍の内(S ≤ 4) | p ≥ 0 の格子の最良 q・p・S | 4 つ目のノブ(源の質量のべき k_m)で 4 式: q・p・k_m |', '|---|---|---|---|---|---|---|---|---|---|',
    ...t1.sets.map((s) => { const nm = `χ ${s.spec.chi}・${SPD[s.spec.speed]}・${BASE[s.spec.base]}・${SIZE[s.spec.size]}`;
      if (!s.ok) return `| ${nm} | ${s.nMatch}/4 | — | — | — | — | —(${s.why}) | — | — | — |`;
      return `| ${nm} | ${s.nMatch}/4 | ${fe(s.q0.S)} | ${f2(s.fitQP.q)}・${f2(s.fitQP.p)} | ${fe(s.fitQP.S)} | ${fe(s.fitQP.lambda)} | ${rt(s.fitQP.ratios)} | ${tf(s.fitQP.S <= d1.order1)}・${tf(s.fitQP.S <= d1.order2)} | ${s.gridPos.q}・${s.gridPos.p}・${fe(s.gridPos.S)} | ${f2(s.four.q)}・${f2(s.four.p)}・${f2(s.four.km)} |`; })].join('\n');
  const sm = t1.summary;
  T.t1Summary = ['| T1 のまとめ | 値 |', '|---|---|',
    `| 組の数・4 天体の符号が観測と同じ組 | ${sm.nSets}・${sm.nSign4}(速さ s_d の 8 組は月の符号が逆 —— 3/4) |`,
    `| 連続の解の S の最小(組) | ${fe(sm.bestFitS)}(${sm.bestFit}) |`,
    `| 連続の解で 1 桁の内・2 倍の内の組 | ${sm.order1Fit}・${sm.order2Fit} |`,
    `| 連続の解の p が負(大きい受け手ほど弱い)の組 | ${sm.pNegFit}/${sm.nSign4} |`,
    `| p ≥ 0 の格子で 1 桁の内・2 倍の内の組・S の最小 | ${sm.order1Pos}・${sm.order2Pos}・${fe(sm.bestPosS)} |`].join('\n');
  const t2 = J.t2;
  T.t2Rings = ['| 組 | 環 | n/s | 1e7 年の Δ ln a ÷ 物差し 1e-5 | 半長軸の向き | 傾きの e 分の 1 の時間 [年](補正なし) | 集まりの係数 ε を 1 つの値で掛けた後の同じ時間 [年] | 定常のずれ ÷ 物差し 1e-5((c) の読みで残る分) |', '|---|---|---|---|---|---|---|---|',
    ...t2.sets.flatMap((s) => s.rows.map((r, i) => `| ${SET2[s.key]} | ${NM[r.key]} | ${fe(r.nOverS)} | ${fe(r.ratio)} | ${sg(r.sign)} | ${fe(r.tiltEfoldYr)} | ${fe(s.tiltAfterColl[i])} | ${fe(r.steadyRatio)} |`))].join('\n');
  T.t2Corr = ['| 組 | 4 天体の S(この組の λ・q・p) | 環の比の範囲(D〜F)・半径のべき | (a) 粒子の半径で 1 にするのに要る半径 [m](環ごとの最も厳しい値) | (b) 集まりの係数 ε(1 つの値)・ε の τ のべき・半径のべき | (c) 定常のずれ ÷ 物差しの最大 | (d) 帯の外の落ち方(lor4 ÷ ball): 環・4 天体 |', '|---|---|---|---|---|---|---|',
    ...t2.sets.map((s) => `| ${SET2[s.key]} | ${fe(s.pick.S)} | ${fe(s.minRatio)}〜${fe(s.maxRatio)}・${f2(s.ratioPow)} | ${s.corr.sizeOne === null ? '—(p = 0 —— 大きさが効かない)' : fe(s.corr.sizeOne) + (s.pick.p < 0 ? '(p < 0 —— 大きくする向き)' : '')} | ${fe(s.corr.collOne)}・${f2(s.corr.collPowTau)}・${f2(s.corr.collPowR)} | ${fe(s.corr.steadyMax)} | ${fe(Math.min(...s.corr.height.rings.map((x) => x.factor)))}〜${fe(Math.max(...s.corr.height.rings.map((x) => x.factor)))}・${fe(Math.min(...s.corr.height.sats.map((x) => x.factor)))}〜${fe(Math.max(...s.corr.height.sats.map((x) => x.factor)))} |`)].join('\n');
  const t3 = J.t3;
  T.t3Types = ['| 方位の作用の型 | λ | 交点の率 [rad/s](D 環・F 環) | 型そのものの傾きの率 d ln i/dt(D 環) | 直交の読み(c 1・plus)で足される傾きの率の最小(環) | 同 —— 環の傾きの e 分の 1 の時間 [年] | 環で赤道面へ寄る向き(plus) | 1e7 年に要る c | 足される率の半径のべき(D〜F) | 公転の角速度のずれの最大(環) | c 1 で環の物差しの内 |', '|---|---|---|---|---|---|---|---|---|---|---|',
    ...t3.types.map((t) => { const D = t.rows.find((r) => r.key === 'ringD'), F = t.rows.find((r) => r.key === 'ringF');
      return `| ${AZ[t.type]} | ${fe(t.lambda)} | ${fe(D.dnode)}・${fe(F.dnode)} | ${fe(D.dlnIown)} | ${fe(t.ringOrthSlow)} | ${fe(t.efoldYrC1)} | ${t.ringToward ? '寄る' : '離れる(minus の読みで寄る)'} | ${fe(t.cNeed)} | ${f2(t.ringPow)} | ${fe(t.keplerMax)} | ${tf(t.passC1)} |`; })].join('\n');
  const vb = t3.types.find((t) => t.type === 'vel|ball');
  T.t3Signs = ['| 受け手(座標を運ぶ方位の場・ball) | 源の赤道面に対する傾き [°] | 交点の率 [rad/s] | 直交の読み plus: 赤道面へ | minus: 赤道面へ | 読み替えの列の交点の率 ÷ 元の交点の率 | 足す列の交点の率 [rad/s] |', '|---|---|---|---|---|---|---|',
    ...vb.rows.map((r) => `| ${NM[r.key]} | ${r.iDeg.toFixed(r.iDeg < 1 ? 6 : 2)} | ${fe(r.dnode)} | ${r.per['plus|replace'].toPlane > 0 ? '寄る' : '離れる'} | ${r.per['minus|replace'].toPlane > 0 ? '寄る' : '離れる'} | ${lt(r.per['plus|replace'].dnode / (Math.abs(r.dnode) || 1), 1e-9)} | ${fe(r.per['plus|add'].dnode)} |`)].join('\n');
  T.t3Spin = ['| 受け手の自転の軸(座標を運ぶ方位の場・ball・λ 6.56e-7 —— 軸引きずりとは別の量) | 受け手の位置の場の角速度 Ω_f [rad/s] | 直交の読み(c 1)で軸を源の軸へ寄せる e 分の 1 の時間 [年] |', '|---|---|---|',
    ...t3.spin.map((q) => `| ${NM[q.key]} | ${fe(q.OmegaF)} | ${fe(q.efoldYr)} |`)].join('\n');
  const t4 = J.t4;
  T.t4Rows = ['| 源 | 扁平率 f_flat | 自転 s [rad/s] | 自転 ÷ 破断の速さ | R_eq [m] | 観測の配置(文献の値・未照合) | 群 | 高さ則 T1 の d ln i/dt(単位の λ) | 直交の読みの d ln i/dt(ball・単位の λ・c 1) |', '|---|---|---|---|---|---|---|---|---|',
    ...t4.rows.map((r) => `| ${NM[r.key]} | ${fe(r.fFlat)} | ${fe(r.s)} | ${fe(r.spinOverBreak)} | ${fe(r.Req)} | ${r.layout.note} | ${GRP[r.layout.group]} | ${fe(r.hlDlnI)} | ${fe(r.orthDlnI)} |`)].join('\n');
  const srcs = t4.rows.map((r) => r.key);
  T.t4Split = [`| 列・扁平率のべき k | ${srcs.map((k) => NM[k] + ' [年]').join(' | ')} | 有の最大 < 無の最小 | 余裕(無の最小 ÷ 有の最大) | 混(海王星)の側 | 太陽系の年齢 4.5e9 年で分かれる |`, '|---|' + srcs.map(() => '---|').join('') + '---|---|---|---|',
    ...t4.splits.map((sp) => `| ${sp.col === 'hlDlnI' ? '高さ則 T1' : '直交の読み(ball)'}・k ${sp.k} | ${srcs.map((k) => fe(sp.times.find((t) => t.key === k).tYr)).join(' | ')} | ${tf(sp.split)} | ${fe(sp.margin)} | ${sp.mixedSideWith ? '有の側' : sp.mixedSideWithout ? '無の側' : '間'} | ${tf(sp.ageSplit)} |`)].join('\n');
  T.t4Merc = ['| 扁平率のべき k | 太陽の (f_flat ÷ 土星の f_flat)^k | 第337便i の絞った 3 組の水星の近点の率 ÷ 1PN × 因子 |', '|---|---|---|',
    ...t4.merc.map((m) => `| ${m.k} | ${fe(m.factor)} | ${m.ratios.map(fe).join('・')} |`)].join('\n');
  return T;
}

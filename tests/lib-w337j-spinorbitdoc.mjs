// 第337便j(原仮定者の補足(2026-11-15 —— 第138報の補足 5)・統括の検証項目 R346): **正本 tests/out/spinorbit-337j.json から PHYSICS〔第337便j〕の表を作る文書の lib**
// (QA docs.spinorbit337j が節の表と逐語で照合する —— 表の数は有効数字 3 桁の指数・丸めの程度の数〔恒等式の残差〕は「< 1e-x」の形で書く)。
export const DOC_VERSION = 'w337j-spinorbitdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toExponential(2));
const lt = (x, t) => (Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : '**' + fe(x) + '**');
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const sg = (x) => (x > 0 ? '+' : x < 0 ? '−' : '0');
const SRC = Object.freeze({ sun: '太陽', moon: '月', phobos: 'フォボス', deimos: 'ダイモス', charon: 'カロン' });
const ACT = Object.freeze({ vel: '座標を運ぶ方位の場', push: '方位の押し', damp: '相対の速度の全部(場 U に対して)', dampRig: '剛体の場に対する相対の速度(本枝)' });
const setName = (s) => s.spec.action === 'dampRig' ? `${ACT.dampRig}・${s.spec.prof}・χ ${s.spec.chi}・q ${s.spec.qFall}` : `${ACT[s.spec.action]}・${s.spec.prof}`;
/** T2 の λ の表に並べる組(p ごとの行を持つ dampRig の代表) */
export const T2_SIZE_SETS = Object.freeze(['dampRig|ball|chi1|q0', 'dampRig|ball|chi1|q6', 'dampRig|ball|chi0.5|q6', 'dampRig|slice|chi1|q3']);

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| ① 2 つの読みの差 = −α f (1 − f) n(閉じた式との相対の差)・f = 1 と f = 0 で差 0・n = s で今の形は f s | ${lt(S.diff.closed, 1e-12)}・${S.diff.f1}・${S.diff.f0}・${lt(S.diff.sync, 1e-15)} | ${tf(G.diff)} |`,
    `| ② 閉じた式と数値の差分(第337便a の complementDiff —— 静止の補い/受け手自身の補い) | ${lt(S.numeric.st, 1e-6)}・${lt(S.numeric.se, 1e-6)} | ${tf(G.numeric)} |`,
    `| ③ 金星の釣り合いの解き方(2 つの読みの残り [rad/s])・根からの n_V の逆解き | ${lt(S.venus.st, 1e-20)}・${lt(S.venus.se, 1e-20)}・${lt(S.venus.nBack, 1e-9)} | ${tf(G.venus)} |`,
    `| ④ 本枝の型(剛体の場に対する相対の速度)は同期の円の軌道で d ln a/dt = 0(÷ 2|s|)・λ = 0 で 0・閉じた式と数の一次の率・符号の境目 n/s = χ | ${lt(S.t2.sync, 1e-9)}・${S.t2.zero}・${lt(S.t2.closed, 1e-6)}・${lt(S.t2.bound, 1e-12)} | ${tf(G.t2)} |`,
    `| ⑤ 帯の幅の読み R_eq ÷ Y_k m・源の取り分 β の ½ の半径・等しい高さの閉じた式と数 | ${lt(S.t3.width, 1e-12)}・${lt(S.t3.half, 1e-12)}・${lt(S.t3.zeq, 1e-9)} | ${tf(G.t3)} |`,
    `| ⑥ 入力の拒否 | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  const t1 = J.t1, C = t1.control;
  T.t1Control = ['| 対照(第337便a の正本と同じか) | 背景が静止 | 今の並進の式の形 |', '|---|---|---|',
    `| 金星で釣り合う太陽の取り分 f☉ | ${fe(C.f.st)} | ${fe(C.f.se)} |`,
    `| 背景慣性決定力 W₀ [(kg/AU²)(重み α = 2)](第337便a) | ${fe(C.W0.st)} | ${fe(C.W0.se)} |`,
    `| 同(本枝の解き直し —— 相対の差 ${lt(C.relW0, 1e-9)}) | ${fe(C.W0again.st)} | ${fe(C.W0again.se)} |`,
    `| 惑星 8 の太陽の項(第337便a の値と本枝の閉じた式の相対の差) | ${lt(C.relPer, 1e-9)} | — |`,
    `| ノブ: 今の形の読みで銀河 → 太陽の位置の項も今の形(ω_bg ${fe(t1.modes.consistent.wbg.se)} rad/s)で解き直した W₀ | — | ${fe(t1.modes.consistent.W0.se)}(f☉ ${fe(t1.modes.consistent.f)}) |`].join('\n');
  const rowOf = (k, r, M) => `| ${r.ja} | ${fe(r.s)} | ${M.per.map((q) => `${SRC[q.key]} ${fe(q.fSt)}`).join('・')}・背景 ${fe(M.fBgSt)} | ${fe(M.projSt)} | ${fe(M.projSe)} | ${M.agreeSt ? '順' : '逆'}・${M.agreeSe ? '順' : '逆'} | ${fe(M.ratioSt)}・${fe(M.ratioSe)} | ${fe(M.diffProj)} | ${tf(M.dirDistinct)} | ${fe(M.rateRelDiff)} | ${r.twoAngle.elevMaxDeg.toFixed(2)} | ${fe(r.twoAngle.proj)}(赤道面の係数 ${fe(r.twoAngle.eqProj)}・${r.twoAngle.sameAsEq ? '同じ符号' : '逆の符号'}) | ${M.angSt.toFixed(1)}・${M.angSe.toFixed(1)} |`;
  const hdr = '| 天体 | 観測の自転 s [rad/s] | 源の取り分 f(背景が静止の W₀) | 背景が静止: 和の自転の向きへの成分 [rad/s] | 今の並進の式の形: 同 [rad/s] | 観測の自転と同じ向きか(静止・今の形) | ÷ s(静止・今の形) | 2 つの読みの差 [rad/s] | 向きで見分けられる | 率で見分けるのに要る相対の精度 | 太陽の赤道面からの仰角の最大 [°] | 2 倍角の則の作用の軸の自転の向きへの成分(公転の平均) | 和と自転の軸の角 [°](静止・今の形) |';
  T.t1Bodies = [hdr, '|---|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.plan.t1Compare.map((k) => rowOf(k, t1.rows[k], t1.rows[k].modes.shared)),
    ...J.plan.t1Rows.map((k) => rowOf(k, t1.rows[k], t1.rows[k].modes.shared)),
    `| 太陽(銀河の中 —— 源は銀河の中心の点・第337便a の主) | ${fe(J.t1.sunGal.projSt / J.t1.sunGal.ratioSt)} | 銀河 ${fe(t1.sunGal.f)} | ${fe(t1.sunGal.projSt)} | ${fe(t1.sunGal.projSe)} | ${t1.sunGal.projSt > 0 ? '順' : '逆'}・${t1.sunGal.projSe > 0 ? '順' : '逆'} | ${fe(t1.sunGal.ratioSt)}・${fe(t1.sunGal.ratioSe)} | ${fe(t1.sunGal.projSt - t1.sunGal.projSe)} | ${tf(t1.sunGal.dirDistinct)} | — | — | — | — |`].join('\n');
  T.t1Sources = ['| 天体 | 源 | f(静止・今の形) | 背景が静止 ω_st [rad/s] | 今の並進の式の形 ω_se [rad/s] | 互いにロックした対(主は 0 —— 閉じた式のまま) |', '|---|---|---|---|---|---|',
    ...J.plan.t1Compare.flatMap((k) => t1.rows[k].modes.shared.per.map((q) => `| ${t1.rows[k].ja} | ${SRC[q.key]} | ${fe(q.fSt)}・${fe(q.fSe)} | ${fe(q.st)} | ${fe(q.se)} | ${q.locked ? `0(閉じた式 ${fe(q.stNaive)}・${fe(q.seNaive)})` : '—'} |`))].join('\n');
  const O = t1.obs, rate = (k, nm, src) => { const M = t1.rows[k].modes.shared; return `| ${nm} | ${fe(O[k].sdotOverS)} | ${src} | ${sg(M.pushSt)}・${sg(M.pushSe)} | ${tf(M.pushAgreeSt)}・${tf(M.pushAgreeSe)} | ${fe(M.rateRelDiff)} | ${fe(O[k].relUnc)} | ${tf(M.rateDistinct)} |`; };
  T.t1Rates = ['| 天体 | 観測の自転の変化の率 ṡ/s [1/s] | 出典(文献の値・未照合) | 受動の応答の向き(ω_ax − s の符号 —— 静止・今の形) | 観測の向きと同じか | 2 つの読みの率の相対の差 | 観測の率の相対の不確かさ(宣言) | 率で見分けられるか(観測の率を全部この応答に当てた読み) |', '|---|---|---|---|---|---|---|---|',
    rate('earth', '地球', '一日の長さ +1.78 ms/世紀(Stephenson ほか 2016)'), rate('mars', '火星', '角の加速 +4 mas/年²(Le Maistre ほか 2023)'),
    `| 冥王星 | — | 測定は記録に無い(カロンと互いにロック) | ${sg(t1.rows.pluto.modes.shared.pushSt)}・${sg(t1.rows.pluto.modes.shared.pushSe)} | — | ${fe(t1.rows.pluto.modes.shared.rateRelDiff)} | — | — |`].join('\n');
  T.t1Compact = ['| コンパクト天体 | 観測の自転 s [rad/s] | ṡ/s [1/s] | 源(伴星)の自転 [rad/s] | 伴星の取り分 f | 自転の軸の傾き [°] | 和の自転の向きへの成分(静止・今の形)[rad/s] | ÷ s | 向きで見分けられる | 受動の応答の向き・観測の向き | 率で見分けるのに要る相対の精度 | 伴星の赤道面からの仰角の最大 [°]・2 倍角の則の作用の軸の自転の向きへの成分 |', '|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...t1.compact.flatMap((c) => c.rows ? c.rows.map((r) => `| ${c.name} | ${fe(c.s)} | ${fe(c.sdotOverS)} | ${fe(c.sComp)} | ${fe(r.fComp)} | ${r.tiltDeg} | ${fe(r.projSt)}・${fe(r.projSe)} | ${fe(r.ratioSt)}・${fe(r.ratioSe)} | ${tf(r.dirDistinct)} | ${sg(r.pushSt)}・${sg(c.obsSign)} | ${fe(r.rateRelDiff)} | ${r.twoAngle.elevMaxDeg.toFixed(1)}・${fe(r.twoAngle.proj)} |`)
      : [`| ${c.name} | ${fe(c.s)} | ${fe(c.sdotOverS)} | —(背景だけ) | 0 | 未知 | 大きさ ${fe(c.magSt)}・${fe(c.magSe)} | ${fe(c.ratioSt)} | — | ${sg(c.pushSign)}・${sg(c.obsSign)} | — | — |`])].join('\n');
  T.t1Weak = ['| 比べる意味が薄い相手 | 主星 | 理由 | 主星の取り分 f(背景が静止の W₀) |', '|---|---|---|---|',
    ...t1.weak.map((w) => `| ${({ moon: '月', io: 'イオ', titan: 'タイタン', triton: 'トリトン', phobos: 'フォボス', mercury: '水星', venus: '金星' })[w.key]} | ${({ earth: '地球', jupiter: '木星', saturn: '土星', neptune: '海王星', mars: '火星', sun: '太陽' })[w.host]} | ${w.why} | ${fe(w.fHost)} |`)].join('\n');
  const t2 = J.t2;
  T.t2Recv = ['| 受け手 | 源 | n/s | 半長軸 ÷ 同期の半径 | 観測の半長軸の率 ȧ/a [1/s](文献の値・未照合) |', '|---|---|---|---|---|',
    ...t2.recvs.map((r) => `| ${r.name} | ${({ saturn: '土星', mars: '火星', jupiter: '木星', earth: '地球', neptune: '海王星' })[r.host]} | ${r.pro ? fe(r.nOverS) : fe(r.nOverS) + '(逆行)'} | ${fe(r.aOverSync)} | ${r.obsDlnA === null ? '記録に無い' : fe(r.obsDlnA)} |`)].join('\n');
  const keys = t2.recvs.map((r) => r.key), shortR = Object.fromEntries(t2.recvs.map((r) => [r.key, r.name.replace('土星 ', '').replace('の粒子', '').replace('(逆行)', '')]));
  T.t2Signs = [`| 組(単位の λ・R_eq・s) | 符号が変わる n/s(土星・火星) | ${keys.map((k) => shortR[k]).join(' | ')} | 観測と同じ符号 |`, '|---|---|' + keys.map(() => '---|').join('') + '---|',
    ...t2.sets.filter((s) => s.spec.action !== 'dampRig' || s.spec.qFall === 0 || s.spec.qFall === 6).map((s) => `| ${setName(s)} | ${s.boundSat === null ? '無し' : fe(s.boundSat)}・${s.boundMars === null ? '無し' : fe(s.boundMars)} | ${s.signs.map((x) => sg(x.pred)).join(' | ')} | ${s.nMatch}/${s.nObs} |`),
    `| 観測の公転の変化の符号(文献の値・未照合) | — | ${keys.map((k) => { const r = t2.recvs.find((q) => q.key === k); return r.obsSign === null ? '—' : sg(r.obsSign); }).join(' | ')} | — |`].join('\n');
  const atStr = (a) => (a === null ? '—' : `${a.ring.ok ? '環 内' : '環 外(' + fe(Math.max(a.ring.kepler / J.decl.t2.ringTol.kepler, a.ring.drift / J.decl.t2.ringTol.drift)) + ' 倍)'}・フォボス ${fe(a.sat.phobos.ratio)}・月 ${fe(a.sat.moon.ratio)}・タイタン ${fe(a.sat.titan.ratio)}・トリトン ${fe(a.sat.triton.ratio)}`);
  T.t2Lambda = ['| 組(受け手の大きさのべき p = 0) | λ (i)(環で要る値 —— 傾きを減らさない型は第337便i の主の組の値) | λ (ii)(フォボスを全部担う) | λ (iii)(環の物差しの上限) | (ii) ÷ (iii) | λ (i) で(環・予測 ÷ 観測) | λ (ii) で | λ (iii) で |', '|---|---|---|---|---|---|---|---|',
    ...t2.sets.filter((s) => s.spec.action !== 'dampRig' || s.spec.qFall === 0).map((s) => { const l = s.lam[0];
      return `| ${setName(s)} | ${fe(l.lamI)}${l.lamIfrom === 'main337i' ? '(第337便i)' : ''} | ${l.lamII === null ? '—(符号が逆か効きが 0)' : fe(l.lamII)} | ${fe(l.lamIII)} | ${fe(l.iiOverIII)} | ${atStr(l.atI)} | ${atStr(l.atII)} | ${atStr(l.atIII)} |`; })].join('\n');
  T.t2Size = ['| 組 | 受け手の大きさのべき p | λ (ii) | λ (iii) | (ii) ÷ (iii) | λ (ii) で(環・予測 ÷ 観測) | 同時に物差しの内 |', '|---|---|---|---|---|---|---|',
    ...T2_SIZE_SETS.flatMap((k) => { const s = t2.sets.find((q) => q.key === k); return s.lam.map((l) => `| ${setName(s)} | ${l.p} | ${fe(l.lamII)} | ${fe(l.lamIII)} | ${fe(l.iiOverIII)} | ${atStr(l.atII)} | ${tf(l.atII ? l.atII.all : null)} |`); })].join('\n');
  T.t2Centrifugal = ['| 受け手 | 順行/逆行 | n/s | 遠心力の読み: 座標を運ぶ方位の場(ball・単位の λ)の δΩ/Ω | 公転の速さ |Ω| の変化の向き | 剛体の場(χ s)で遠心力を下げる/上げる読みの δΩ/Ω ÷ λ(χ 1・χ ½) | 同期へ寄せる型(剛体の場に対する相対の速度・χ 1)の半長軸の向き |', '|---|---|---|---|---|---|---|',
    ...t2.centrifugal.map((c) => `| ${shortR[c.key]} | ${c.pro ? '順行' : '逆行'} | ${fe(c.nOverS)} | ${fe(c.velBallDOm)} | ${c.signAbsOm > 0 ? '速まる(遠心力を下げる)' : '遅くなる(遠心力を上げる)'} | ${fe(c.rigidChi1)}・${fe(c.rigidChiHalf)} | ${sg(c.dampRigSignA)} |`)].join('\n');
  const rings = ['ringD', 'ringB', 'ringF'];
  T.t2Steady = ['| 座標を運ぶ方位の場(定常の公転のずれ —— 半長軸は動かない) | ' + rings.map((k) => shortR[k] + ' の δΩ/Ω(単位の λ)').join(' | ') + ' | λ (i) 6.56e-7 での |δΩ/Ω| の最大 | 環の物差しの λ (iii) |', '|---|' + rings.map(() => '---|').join('') + '---|---|',
    ...t2.sets.filter((s) => s.spec.action === 'vel').map((s) => `| ${setName(s)} | ${rings.map((k) => fe(s.rows.find((q) => q.key === k).dOm)).join(' | ')} | ${fe(s.lam[0].atI.ring.kepler)} | ${fe(s.lam[0].lamIII)} |`)].join('\n');
  const ig = J.integ;
  T.integ = [`| 代表 | 読む量 | 一次の率 | 時間積分(${J.plan.integ.steps[0]}・${J.plan.integ.steps[1]} 步/周 × ${J.plan.integ.nOrb} 周) | 一次 ÷ 積分 − 1 | 刻みの差 |`, '|---|---|---|---|---|---|',
    `| フォボスの型の受け手(e 0.0151)・剛体の場に対する相対の速度・ball・χ 1(λ ${fe(ig.lambda)}) | d ln a/dt [1/s] | ${fe(ig.first)} | ${fe(ig.runs[0].dlnA)}・${fe(ig.runs[1].dlnA)} | ${fe(ig.relDiff)} | ${fe(ig.stepSpread)} |`].join('\n');
  const t3 = J.t3;
  T.t3Proposals = ['| 提案 | 型 | 式 | ノブ | 判定の物差し | 第337便i の型と | 本枝で |', '|---|---|---|---|---|---|---|',
    ...t3.proposals.map((p) => `| ${p.key} | ${p.type} | ${p.formula} | ${p.knobs} | ${p.judge} | ${p.vsI} | ${p.taken} |`)].join('\n');
  const RW = Object.freeze({ Yk: '2 Y_k m', Req: '2 R_eq(軸比 q = 1/3)', Req1: '2 R_d/(1 − f)', flat1: '2 R_d/f', flat2: '2 R_d/f²' });
  T.t3Width = ['| 帯の幅を厚みと読む(H = 2 R_d) | 扁平率 f | 文献の厚み [m](種類) | ' + J.decl.t3.widthReadings.map((k) => RW[k] + ' [m](÷ 文献)').join(' | ') + ' |', '|---|---|---|' + J.decl.t3.widthReadings.map(() => '---|').join(''),
    ...t3.width.map((w) => `| ${w.ja} | ${fe(w.fFlat)} | ${fe(w.lit)}(${w.litKind}) | ` + J.decl.t3.widthReadings.map((k) => `${fe(w.H[k].H)}(${fe(w.H[k].overLit)})`).join(' | ') + ' |')].join('\n');
  T.t3Dom = ['| 源の取り分で重みを付けた T1(土星の環 —— 他の源は太陽) | W₀ | D 環の β | F 環の β | 傾きの率の半径のべき | D〜F の一様さ | β = ½ の半径 [m](÷ 土星の半径) | 環で要る λ | 同じ λ の水星の黄道の ϖ・交点の率 [″/世紀] | 水星の尺度の比の最大 |', '|---|---|---|---|---|---|---|---|---|---|',
    ...t3.dom.map((d) => `| ${d.reading === 'st' ? '背景が静止' : '今の並進の式の形'} の W₀ | ${fe(d.W0)} | ${fe(d.pts[0].beta)} | ${fe(d.pts[d.pts.length - 1].beta)} | ${fe(d.powRate)} | ${fe(d.flatRate)} | ${fe(d.rHalf)}(${fe(d.rHalfOverSurface)}) | ${fe(d.judge.lambdaNeed)} | ${d.merc.at ? fe(d.merc.at.dvarpi) + '・' + fe(d.merc.at.dnode) : '—'} | ${fe(d.merc.scaleMax)} |`)].join('\n');
  T.t3zEq = ['| 場と重力の鉛直の速さが等しい高さ(T3 の型 —— A 1・ℓ 4・H = R_eq) | n/s | R_eq [m] | s ÷ ν_z | z* [m](s) | 2 z* ÷ 文献の厚み(s) | s_d ÷ ν_z | z* [m](s_d) | 2 z* ÷ 文献の厚み(s_d) |', '|---|---|---|---|---|---|---|---|---|',
    ...t3.zEq.map((q) => `| ${q.name}(文献 ${fe(q.lit)} m・${q.litKind}) | ${fe(q.nOverS)} | ${fe(q.Rd)} | ${fe(q.obs.ratio)} | ${q.obs.zStar === null ? '無し(s < ν_z)' : fe(q.obs.zStar)} | ${fe(q.obs.twoZOverLit)} | ${fe(q.sd.ratio)} | ${fe(q.sd.zStar)} | ${fe(q.sd.twoZOverLit)} |`)].join('\n');
  return T;
}

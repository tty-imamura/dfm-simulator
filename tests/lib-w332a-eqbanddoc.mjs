// 第332便a(原仮定者の補足(2026-11-10)・統括の検証項目 R315): **正本 tests/out/eqband-w332a.json から PHYSICS〔第332便a〕の表を作る文書の lib**
// (QA docs.eqBand332a が節の表と逐語で照合する —— 表の数は有効数字 4 桁か指数 3 桁・丸めの程度の数〔読み口と読みの式の差・永年の変化の数値の残り〕は「< 1e-6」の形で書き、数そのものは載せない)。
export const DOC_VERSION = 'w332a-eqbanddoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toExponential(3));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toPrecision(4));
const lt = (x, t) => (Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : '**' + fe(x) + '**');
const fx = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Math.abs(x) >= 0.01 && Math.abs(x) < 1e5 ? Number(x).toPrecision(4) : Number(x).toExponential(3));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : 'null');
const yr = (x) => fe(x);
export const DECL_LABEL = Object.freeze({ literal: '字どおり(段・尾 0・B・k1N・Y_k m)', literalD: '字どおり・κ_D m', tailInv: '尾 R_d/|z|', k1plane: 'K1 の核の平面の類比', smooth: '滑らか(gauss)', bodySize: '受け手の大きさ', strongN: '強さ N', weakK2: '強さ k2N', vertA: '向き A' });
const ST_LABEL = Object.freeze({ k1N: 'k1N', k1spin: 'k1spin', k2N: 'k2N', N: 'N' });
export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, R = J.rings, O = J.reach, A = J.align, M = J.metrics, K = J.sphere;
  // 表 1 純関数の場面
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| 鏡映 z → −z(形 4 × 尾 —— 6 組): A は奇・B は偶 | ${S.mirror.filter((q) => q.odd && q.even).length}/${S.mirror.length} | ${tf(G.mirror)} |`,
    `| 符号: A は赤道面へ(z = ±R_d/2 の a_z)・B は Ω > 0 で順・Ω < 0 で逆(静止した受け手)・赤道面の上の A | ${fe(S.sign.up)}・${fe(S.sign.dn)}・${fe(S.sign.pro)}・${fe(S.sign.ret)}・${S.sign.zeroAtPlane} | ${tf(G.sign)} |`,
    `| 帯の外で 0(段・k1plane の尾 none —— t = 1 ± 1e-9 の S と力の大きさ) | ${S.outside.map((q) => q.sh + ' ' + f3(q.inS) + '→' + q.outS + '・' + q.out).join(' / ')} | ${tf(G.outsideZero)} |`,
    `| 連続(t = 1 ± 1e-7): gauss・sech2・k1plane(尾 inv)の値の跳び・k1plane の傾き(左・右)・段(尾 inv)の値の跳び・段(尾 none)の跳び・k1plane の縁の値 | ${lt(S.cont.gauss, 1e-6)}・${lt(S.cont.sech2, 1e-6)}・${lt(S.cont.k1v, 1e-6)}・${f3(S.cont.k1slopeL)}・${f3(S.cont.k1slopeR)}・${lt(S.cont.stepInv, 1e-6)}・${S.cont.stepNoneJump}・${f3(S.cont.k1edge)} | ${tf(G.continuity)} |`,
    `| 自転 0: B の大きさ(強さ 4)・A の大きさ(k1spin・k1N) | ${S.spin0.map((q) => q.aB).join('・')}・${S.spin0.find((q) => q.st === 'k1spin').aA}・${fe(S.spin0.find((q) => q.st === 'k1N').aA)} | ${tf(G.spinZero)} |`,
    `| 共に回る受け手(v = Ω ŝ × d)の Δ ÷ Ωr と B・ガリレイ変換(源と受け手に同じ速度)の力の相対の差 | ${lt(S.corot.slipRel, 1e-12)}・${lt(S.corot.aB, 1e-25)}・${lt(S.galilei.diff, 1e-12)} | ${tf(G.corotation && G.galilei)} |`,
    `| 入力の拒否(r = 0・m = 0・軸 0・知らない形・形と尾の組・知らない向き・強さ・規則・非有限・鉛直の形・球の核の内部・軌道の i > π・負の質量) | ${S.reject.filter(Boolean).length}/${S.reject.length} | ${tf(G.reject)} |`,
    `| 規則: Y_k m ÷ κ_D m(= 5/C₁)・Y_k・κ_D [m/kg]・土星の Y_k m・κ_D m [m] | ${f3(S.rule.ratio)}・${fe(S.rule.k0)}・${fe(S.rule.kD)}・${f3(S.rule.satRd0)}・${f3(S.rule.satRdD)} | ${tf(G.ruleRatio)} |`,
    `| 恒等式: k1N の gA ÷ (R_d G m/r³)(Y_k m・κ_D m —— r ≫ R_d で C₁) | ${f3(S.k1id.k0)}・${f3(S.k1id.kD)} | ${tf(G.k1Identity)} |`,
    `| 球の核(今のエンジンの K1 の回転の項の読みの式): 軸の上・緯度 45° ÷ 赤道・2r ÷ r・順の向き・鉛直の成分・並進の β ÷ C₁R_d/r | ${S.sphere.axis}・${f3(S.sphere.latRatio)}・${f3(S.sphere.farRatio)}・${S.sphere.pro > 0 ? '正' : '負'}・${S.sphere.vert}・${f3(S.sphere.beta / S.sphere.betaExpect)} | ${tf(G.sphereCore)} |`,
    `| 軌道の平均の求積 ÷ 閉じた式(段・尾 none/inv・ε = 1e-9〜2 —— 8 組の最大の相対の差)・A の永年の di/dt(求積の和 ÷ 片側)・B の小さな i の閉じた式との比 | ${lt(Math.max(...S.quad.map((q) => Math.abs(q.num - q.closed) / Math.abs(q.closed))), 1e-6)}・${lt(S.orbit.aSecRel, 1e-12)}・${f3(S.orbit.bDidt / S.orbit.bClosed)} | ${tf(G.orbitQuad)} |`].join('\n');
  // 表 2 環の厚みと帯の厚み 2R_d
  T.thick = ['| 環 | 主星の質量 [kg] | Y_k m [m] | κ_D m [m] | 帯の厚み 2Y_k m [m] | 帯の厚み 2κ_D m [m] | 文献の厚み H [m](種類) | 2Y_k m ÷ H | 2κ_D m ÷ H |', '|---|---|---|---|---|---|---|---|---|']
    .concat(R.thick.map((q) => `| ${q.name} | ${fe(q.M)} | ${f3(q.Rd0)} | ${f3(q.RdD)} | ${f3(q.band0)} | ${f3(q.bandD)} | ${q.H === null ? '—' : f3(q.H)}(${{ typical: '典型', upper: '上限', moonInc: '衛星の傾きの振れ', none: '値なし' }[q.kind]}) | ${fx(q.ratio0)} | ${fx(q.ratioD)} |`)).join('\n');
  // 表 3 土星の環の点の鉛直(段・尾 0・V 字)
  T.vert = ['| 環の点 | r [m] | ν_z [rad/s] | 強さ・規則 | 帯の縁の A ÷ 重力 ν_z²R_d | ω_lin ÷ ν_z | 届く高さ z_max ÷ R_d(c = (H/2)ν_z) | 帯の内に収まる | B の共に回る時間 1/γ [年] | Δ_K = Ω_s r − v_K [m/s] |', '|---|---|---|---|---|---|---|---|---|---|']
    .concat(R.vert.map((q) => `| ${q.label} | ${fe(q.r)} | ${fe(q.nuZ)} | ${ST_LABEL[q.strength]}・${q.rule === 'kappa0' ? 'Y_k m' : 'κ_D m'} | ${fe(q.ratioEdge)} | ${fe(q.omegaLinOverNu)} | ${fe(q.zMaxOverRd)} | ${tf(q.confined)} | ${yr(q.tCorot / J.plan.yearS)} | ${f3(q.slipK)} |`)).join('\n');
  // 表 4 B 環外縁の形 × 鉛直の形(k1N・Y_k m)
  T.shapes = ['| 形・尾 | 鉛直の形 | 帯の縁の A ÷ 重力 | 届く高さ z_max ÷ R_d | 帯の内に収まる |', '|---|---|---|---|---|']
    .concat(R.shapes.map((q) => `| ${q.shape}・${q.tail} | ${q.vprof} | ${f3(q.ratioEdge)} | ${f3(q.zMaxOverRd)} | ${tf(q.confined)} |`)).join('\n');
  // 表 5 届く/届かない
  T.reach = ['| 組 | a [m] | 赤道面からの角 [°](🗺️・文献) | 高さ a sin(角) ÷ Y_k m | 同 ÷ κ_D m | 角の半幅 Y_k m/a [rad] | 帯の中の時間の割合(点・Y_k m) | 同(受け手の大きさを足す) |', '|---|---|---|---|---|---|---|---|']
    .concat(O.rows.map((q) => `| ${q.name} | ${fe(q.a)} | ${q.angleBook === null ? '—' : fx(q.angleBook)}・${q.angleLit === null ? '—' : fx(q.angleLit)} | ${fe(q.zOverRd0)} | ${fe(q.zOverRdD)} | ${fe(q.halfWidth0)} | ${fe(q.fracIn0)} | ${q.fracInBody0 === null ? '—' : fe(q.fracInBody0)} |`))
    .concat([`| 太陽の自転軸と不変面の法線の角(🗺️)・惑星の不変面に対する角の範囲(水星を除く)・太陽の赤道面に対する角の範囲 | — | ${f3(O.sunAxisToInvDeg)}・${f3(O.spread.iInvNoMercury[0])}〜${f3(O.spread.iInvNoMercury[1])}・${f3(O.spread.iSun[0])}〜${f3(O.spread.iSun[1])} | — | — | — | — | — |`]).join('\n');
  // 表 5b 惑星の不変面に対する角と自転軸の傾き(🗺️ と文献)
  T.planetAngles = ['| 惑星 | 不変面に対する角 [°](🗺️・文献) | 自転軸の傾き [°](🗺️・文献) |', '|---|---|---|']
    .concat(O.rows.filter((q) => q.kind === 'sun-planet').map((q) => `| ${q.name.replace('太陽–', '')} | ${f3(q.iInvBook)}・${f3(q.iInvLit)} | ${f3(q.obliqBook)}・${f3(q.obliqLit)} |`)).join('\n');
  // 表 6 揃える時間の宣言の型ごとの要約
  const rg = (x) => (x ? fe(x[0]) + '〜' + fe(x[1]) : '—');
  T.alignSummary = ['| 宣言の型 | 惑星: t_align ÷ 年齢 の範囲 | 惑星: 揃える向き・年齢より短い | 衛星: t_align ÷ 年齢 の範囲 | 衛星: 揃える向き・傾きが増す向き | 環の粒子: t_align [年]・a が変わる時間 [年] |', '|---|---|---|---|---|---|']
    .concat(A.summary.map((s) => `| ${s.label} | ${rg(s.planets.tAlignOverAge)} | ${s.planets.nAligning}/${s.planets.n}・${s.planets.nUnderAge}/${s.planets.n} | ${rg(s.moons.tAlignOverAge)} | ${s.moons.nAligning}・${s.moons.nMisaligning}(${s.moons.n}) | ${rg(s.rings.tAlignYr)}・${rg(s.rings.tAYr)} |`)).join('\n');
  // 表 7 惑星ごとの揃える時間(t_align ÷ 年齢・括弧は a が変わる時間 ÷ 年齢)
  const keys7 = ['literal', 'literalD', 'tailInv', 'k1plane', 'smooth', 'bodySize', 'strongN', 'weakK2'];
  const cell = (r) => (r ? (r.tAlignOverAge === null ? (r.aligning === false ? '傾きが増す' : '—') : fe(r.tAlignOverAge)) + '(' + fe(r.tAOverAge) + ')' : '—');
  const pairNames = [...new Set(A.rows.filter((r) => r.kind !== 'ring').map((r) => r.pair))];
  T.alignPairs = ['| 組 | 赤道面からの角 [°] | ' + keys7.map((k) => DECL_LABEL[k]).join(' | ') + ' | 向き A の節の歳差の周期 [年] |', '|---|---|' + keys7.map(() => '---|').join('') + '---|']
    .concat(pairNames.map((p) => { const r0 = A.rows.find((r) => r.pair === p && r.decl === 'literal'), rA = A.rows.find((r) => r.pair === p && r.decl === 'vertA');
      return `| ${p} | ${f3(r0.planeAngleDeg)} | ` + keys7.map((k) => cell(A.rows.find((r) => r.pair === p && r.decl === k))).join(' | ') + ` | ${fe(rA.tNodeYr)} |`; })).join('\n');
  // 表 8 環の粒子(字どおり)—— 揃える向き・t_align・a が変わる時間・A の節の歳差
  T.alignRings = ['| 環の点の粒子(傾き (H/2)/r) | 帯の中の時間の割合 | 字どおりの向き | t_align [年] | a が変わる時間 [年] | t_align ÷ (a の時間) | 向き A の節の歳差の周期 [年] |', '|---|---|---|---|---|---|---|']
    .concat(A.rows.filter((r) => r.kind === 'ring' && r.decl === 'literal').map((r) => { const rA = A.rows.find((x) => x.pair === r.pair && x.decl === 'vertA');
      return `| ${r.pair.replace('土星–', '').replace('の粒子', '')} | ${f3(r.fracIn)} | ${r.aligning === true ? '揃える' : r.aligning === false ? '傾きが増す' : '—'} | ${fe(r.tAlignYr)} | ${fe(r.tAYr)} | ${f3(r.tAlignOverTA)} | ${fe(rA.tNodeYr)} |`; })).join('\n');
  // 表 9 太陽–木星の物差し
  T.metrics = ['| 物差し(宣言) | 良い向き | ' + M.rows.map((r) => r.name).join(' | ') + ' | 最も顕著 | 木星の順位 |', '|---|---|' + M.rows.map(() => '---|').join('') + '---|---|']
    .concat(M.table.map((t) => `| ${t.label} | ${t.best === 'max' ? '大' : '小'} | ` + t.values.map((v) => (t.key.endsWith('Deg') ? fx(v) : fe(v))).join(' | ') + ` | ${t.top} | ${t.jupiterRank} |`)).join('\n');
  // 表 10 球の核と帯の型(土星 💍 の宣言・B 環外縁の半径)
  T.sphere = ['| 点 | z ÷ R_d | θ [°] | 球の核の回転の速度 [m/s] | 帯の重み S(段・尾 none / 段・尾 inv / k1plane・尾 inv / gauss / sech2) | 帯の B の速度の形 β S Δ [m/s](静止・ケプラー) | ÷ 球の核 | 帯の B の加速度 [m/s²] | 帯の A の加速度 a_z [m/s²](k1N) | 球の核と帯の B の向きの余弦 |', '|---|---|---|---|---|---|---|---|---|---|']
    .concat(K.lib.map((q) => `| ${q.label} | ${fe(q.zOverRd)} | ${f3(q.thetaDeg)} | ${fe(q.sphereMag)} | ${['step|none', 'step|inv', 'k1plane|inv', 'gauss|own', 'sech2|own'].map((k) => fx(q.S[k])).join(' / ')} | ${fe(q.uBvel)}・${fe(q.uBvelK)} | ${q.uBvelOverSphere === null ? '—' : fe(q.uBvelOverSphere)} | ${fe(q.aB)} | ${fe(q.aA)} | ${q.cosDir === null ? '—' : f3(q.cosDir)} |`)).join('\n');
  // 表 11 球の核: lib の読みの式とエンジンの読み口(🗺️ の 2 体の写し)
  T.engine = ['| 点(写し —— 🗺️ の土星 + タイタンを置き直す) | エンジンの回転の速度 [m/s] | 読みの式 [m/s] | 相対の差 | 向きの余弦 | 並進の β の相対の差 |', '|---|---|---|---|---|---|']
    .concat(K.engine.rows.map((q) => q.label === '軸の上' ? `| ${q.label} | 赤道の ${lt(q.engineOverEq, 1e-9)} 倍 | 赤道の ${lt(q.libOverEq, 1e-9)} 倍 | — | — | ${lt(q.betaRel, 1e-6)} |`
      : `| ${q.label} | ${fe(q.engineMag)} | ${fe(q.libMag)} | ${lt(q.rel, 1e-6)} | ${lt(1 - q.cos, 1e-9) === '< 1e-9' ? '1(差 < 1e-9)' : f3(q.cos)} | ${lt(q.betaRel, 1e-6)} |`))
    .concat([`| 太陽 + 木星(本の位置 —— 木星は太陽の赤道面から z ÷ Y_k m = ${fe(K.engine.sunJupiter.zOverRd)}・帯の重み ${K.engine.sunJupiter.bandS}) | ${fe(K.engine.sunJupiter.engineMag)} | ${fe(K.engine.sunJupiter.libMag)} | ${lt(K.engine.sunJupiter.rel, 1e-6)} | — | — |`]).join('\n');
  return T;
}

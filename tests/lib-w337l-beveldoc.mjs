// 第337便l(原仮定者の回答(2026-11-15 —— 第138報の回答 3)・統括の検証項目 R348): **正本 tests/out/bevel-337l.json から PHYSICS〔第337便l〕の表を作る文書の lib**
// (QA docs.bevel337l が節の表と逐語で照合する —— 表の数は有効数字 3 桁の指数・角は小数 2 桁・丸めの程度の数〔恒等式の残差〕は「< 1e-x」の形で書く)。
export const DOC_VERSION = 'w337l-beveldoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toExponential(2));
const f2 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(2));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
const lt = (x, t) => (Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : '**' + fe(x) + '**');
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const sg = (x) => (x > 0 ? '+' : x < 0 ? '−' : '0');
const NM = Object.freeze({ mercury: '水星', venus: '金星', earth: '地球', mars: '火星', jupiter: '木星', saturn: '土星', uranus: '天王星', neptune: '海王星', pluto: '冥王星',
  moon: '月', io: 'イオ', europa: 'エウロパ', ganymede: 'ガニメデ', callisto: 'カリスト', titan: 'タイタン', triton: 'トリトン(逆行)', j0737a: 'J0737−3039A', j0737b: 'J0737−3039B', b1913: 'B1913+16', b1913c: 'B1913+16 の伴星' });
const CAND = Object.freeze({ reflectP0: '半回転 × 1', reflectP1: '半回転 × cos el(EQ-16 の強さと同じ形)', reflectP2: '半回転 × cos² el', reflectP1e: '半回転 × (0.1 + 0.9 cos el)', diff: '差分の読み(線に垂直な分だけ)', twist0: '差分の読み + 捩れ μ 1・q 0', twist1: '差分の読み + 捩れ μ √2・q 1' });
const DIRP = Object.freeze({ reflectP1: '半回転 × cos el', reflectP0: '半回転 × 1', diff: '差分の読み', diffTwist: '差分の読み + 捩れ μ √2・q 1' });

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| ① 原文の 3 点(半回転の向きの源の軸からの角: 赤道面・45°・軸の方向)・半回転は大きさを変えない | ${f2(S.three.eq)}°・${f2(S.three.mid)}°・${f2(S.three.pole)}°・${lt(S.three.norm, 1e-12)} | ${tf(G.three)} |`,
    `| ② 差分の読みの閉じた形 f[(1 − α_e) s⊥ + α_e Ω_app] と c の 1 つの式 f r̂ × [∂_r c − α_e (c − v_ref)/r] の差・第337便a の数値の差分(今の形・背景が静止)との差 | ${lt(S.cform, 1e-12)}・${lt(S.self, 1e-6)}・${lt(S.static, 1e-6)} | ${tf(G.cform)} |`,
    `| ③ 第333便b の通過の場面(自転 0 の源が横を通り抜ける): ½∇×U の z・差分の読み(背景が静止)の z・比・見かけの回りの z | ${f3(S.passing.fullZ)}・${f3(S.passing.diffZ)}・${f2(S.passing.ratio)}・${f2(S.passing.OmAppZ)} | ${tf(G.passing)} |`,
    `| ④ 赤道面(f 0.3・背景が静止): 符号つきの半回転と差分の読みの z・並進 0 で並進の分の大きさ・f 0 で全体の大きさ | ${f3(S.equator.reflect)}・${f3(S.equator.diff)}・${S.equator.trZero}・${S.equator.zeroKnob} | ${tf(G.equator)} |`,
    `| ⑤ 近づく/遠ざかる相対の速度の分の大きさ・互いにロックした円の連星(今の形): 半回転(並進の重み 1)の大きさ・差分の読みの z(÷ f s) | ${S.radial}・${S.locked.ref1}・${f2(S.locked.diff)} | ${tf(G.radial)} |`,
    `| ⑥ 入力の拒否 | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  const t1 = J.t1;
  T.t1Elev = ['| 仰角 el [°] | 半回転の向きの源の軸からの角 [°](閉じた形 180° − 2 el) | 差分の読みの向き [°] | 差分の読み + 捩れ μ √2・q 1 の向き [°] | 半回転の源の軸の向きの成分 | 歯車の読みの余弦(源の最も近い表面と受け手の近い面の移動の向き) | 大きさ ÷ s: 半回転 × 1・× cos el・× cos² el・× (0.1 + 0.9 cos el) | 大きさ ÷ s: 差分の読み・+ 捩れ q 1 |', '|---|---|---|---|---|---|---|---|',
    ...t1.rows.map((r) => `| ${r.elDeg} | ${f2(r.reflectAng)}(${f2(r.reflectAngClosed)}) | ${r.diffAng === null ? '—(大きさ 0 —— 極限 ' + f2(r.diffLim) + ')' : f2(r.diffAng)} | ${r.twist1Ang === null ? '—(大きさ 0 —— 極限 ' + f2(r.twist1Lim) + ')' : f2(r.twist1Ang)} | ${f3(r.axisComp)} | ${r.gear === null ? '—(最も近い表面の速さ 0 —— 捩れの向きは同じ: ' + tf(r.gearTwist) + ')' : f3(r.gear)} | ${f3(r.mag.reflectP0)}・${f3(r.mag.reflectP1)}・${f3(r.mag.reflectP2)}・${f3(r.mag.reflectP1e)} | ${f3(r.mag.diff)}・${f3(r.mag.twist1)} |`)].join('\n');
  T.t1Cands = ['| 向きと強さの候補 | 原文の 3 点(0°・45°・90°)| 全部の仰角で 2 倍角(180° − 2 el) | 軸の方向の向き [°](大きさ 0 なら極限) | 軸方向で弱くなる | 大きさ ÷ s(0°〜90° の 7 点) |', '|---|---|---|---|---|---|',
    ...t1.cands.map((c) => `| ${CAND[c.key]} | ${tf(c.three)} | ${tf(c.twoAngleAll)} | ${f2(c.poleAng)} | ${tf(c.weakAxis)} | ${c.mag.map(f3).join('・')} |`)].join('\n');
  const t2 = J.t2;
  T.t2Checks = ['| 配置 | 今の形: 閉じた形と第337便a の axialAt の差(÷ 尺度) | 背景が静止: 閉じた形と第337便a の complementDiff の差(÷ 尺度) | c の 1 つの式と閉じた形の差 | 取り分 f |', '|---|---|---|---|---|',
    ...t2.checks.map((c) => `| ${c.i + 1} | ${lt(c.selfRel, 1e-6)} | ${lt(c.staticRel, 1e-6)} | ${lt(c.cformRel, 1e-12)} | ${f3(c.fStatic)} |`)].join('\n');
  T.t2Orbit = ['| 受け手の公転 ÷ 源の自転 n/s | 今の形 差分の読み(閉じた形 (1 − α) + α n/s) | 今の形 半回転・並進の重み 1(閉じた形 (α − 1)(n/s − 1)) | 今の形 半回転・並進の重み α/(α − 1) | 背景が静止 差分の読み(f 0.3 —— 公転の分は入らない) | 背景が静止 半回転・符号つき(f 0.3) |', '|---|---|---|---|---|---|',
    ...t2.orbit.map((o) => `| ${o.nOverS} | ${f3(o.selfDiff)} | ${f3(o.ref1)} | ${f3(o.refD)} | ${f3(o.staticDiff)} | ${f3(o.staticRef)} |`)].join('\n');
  T.t2Zero = ['| 場面 | 値 |', '|---|---|',
    `| 符号の境目(今の形・赤道面): 差分の読み・半回転(並進の重み 1) | n/s = ${f2(t2.flip.diff)}・n/s = ${f2(t2.flip.ref1)} |`,
    `| 互いにロックした円の連星(今の形・赤道面 —— ÷ f s): 半回転(並進の重み 1)・差分の読み・背景が静止の半回転(f 0.3) | ${f3(t2.locked.ref1)}・${f3(t2.locked.diff)}・${f3(t2.locked.staticRef)} |`,
    `| 近づく/遠ざかる相対の速度の分(向きの候補 3 × 読み 2 の大きさの和) | ${t2.radial.map((r) => r.mag).join('・')} |`,
    `| 自転 0 の源の横の通過(第333便b の場面): 差分の読み ÷ ½∇×U | ${f2(t2.passing.ratio)} |`].join('\n');
  const t3 = J.t3;
  T.t3Planets = ['| 惑星 | 取り分 f(背景が静止・第337便a の W₀) | α_e = α(1 − f) | n/s | 太陽の赤道面に対する傾き [°] | 自転軸の傾き [°] | 軌道の平均の向きの因子(半回転 × cos el) | 太陽の項 [rad/s]: 符号つきの半回転・差分の読み・取り分の半回転 | 今の形の公転の分を入れた太陽の項 [rad/s]: 差分の読み・半回転(重み 1) | 背景の項 [rad/s] | 太陽の項 ÷ 背景の項(符号つき) | 2 倍角の則で自転の向きになる仰角 el* [°] | 実際の仰角の範囲に入る |', '|---|---|---|---|---|---|---|---|---|---|---|---|---|',
    ...t3.planets.map((p) => `| ${NM[p.key]} | ${f3(p.f)} | ${f3(p.alphaE)} | ${fe(p.nOverS)} | ${f2(p.iSunDeg)} | ${f2(p.obliqDeg)} | ${f3(p.dirMean.reflectP1)} | ${fe(p.sunRefSigned)}・${fe(p.sunDiffStatic)}・${fe(p.sunRefShare)} | ${fe(p.selfDiff)}・${fe(p.selfRef1)} | ${fe(p.bg)} | ${fe(p.ratioSigned)} | ${f2(p.elNeededDeg)} | ${tf(p.inRange)} |`)].join('\n');
  T.t3Venus = ['| 向きの因子(金星の軌道の平均) | 振幅 | 因子 P | 釣り合いの根の数 | 根 f | f − 0.5 | W₀(金星の平均の半長軸で) | 背景の項に要る倍(取り分の振幅 —— f 0.5 のまま) |', '|---|---|---|---|---|---|---|---|',
    ...t3.venus.map((v) => `| ${DIRP[v.dir]} | ${v.amp === 'signed' ? '符号つき f(α_e − 1)' : '取り分 f'} | ${f3(v.P)} | ${v.nRoots} | ${v.f === null ? '—' : v.f.toFixed(6)} | ${fe(v.df)} | ${fe(v.W0)} | ${fe(v.bgFactorNeeded)} |`)].join('\n');
  const g = t3.galaxy;
  T.t3Galaxy = ['| 銀河 → 太陽系 | 値 |', '|---|---|',
    `| 太陽の銀河面からの仰角 [°](z☉ ÷ R₀) | ${fe(g.elDeg)} |`, `| 半回転の向きの銀河の軸からの角 [°] | ${f2(g.reflectAngDeg)} |`,
    `| 120° の向きに要る仰角 [°]・その高さ [kpc](R₀ のまま) | ${f2(g.el120Deg)}・${f2(g.z120kpc)} |`, `| 太陽の自転軸と銀河の角運動量の向き L̂ のなす角 [°](本の座標の幾何) | ${f2(g.sunVsL)} |`,
    ...g.rows.map((r) => `| 今の形・赤道面(÷ Ω): s_field/Ω ${r.sFieldOverOmega} の差分の読み・半回転(重み 1) | ${f2(r.selfDiff)}・${f2(r.selfRef1)} |`)].join('\n');
  const mo = t3.moons;
  T.t3Moons = ['| 衛星 | 主星の赤道面に対する傾き [°] | 取り分 f(主星 ÷ 主星 + 太陽 + W₀) | α_e | 赤道面の差分の読みの符号(+ = 主星の自転と同じ向き) | 符号つきの半回転の軌道の平均の符号 | 逆行の軌道 |', '|---|---|---|---|---|---|---|',
    ...mo.moons.map((m) => `| ${NM[m.key]} | ${f2(m.iDeg)} | ${f3(m.f)} | ${f3(m.alphaE)} | ${sg(m.eqSign)} | ${sg(m.reflectSignedSign)} | ${m.retro ? '逆行' : '順行'} |`),
    `| 冥王星 – カロン(カロンの取り分 ${f3(mo.charon.f)}・α_e ${f3(mo.charon.alphaE)}) | 互いにロック・今の形の半回転(重み 1)${f3(mo.charon.selfRef1Locked)}・差分の読み ${f3(mo.charon.selfDiffLocked)}・背景が静止の半回転(f 0.3)${f3(mo.charon.staticRefLocked)}(÷ f s) | — | — | — | — | — |`,
    `| 極の上の受け手(仮想) | 半回転の源の軸の向きの成分 ${f3(mo.pole.reflect)}(順回転の側) | — | — | — | — | — |`].join('\n');
  T.t3Compare = ['| 天体 | 源 | 源の軸と自転の軸の角 θ [°] | 仰角の範囲の最大 [°] | 2 倍角の則で自転の向きになる仰角 el* = (180° − θ)/2 [°] | 範囲に入る | θ の読み |', '|---|---|---|---|---|---|---|',
    ...t3.compare.map((c) => `| ${NM[c.key]} | ${c.src === 'sun' ? '太陽' : NM[c.src] || c.src} | ${c.thetaDeg === null ? '—(軌道の法線から ' + f2(c.tiltDeg) + ')' : f2(c.thetaDeg)} | ${f2(c.elMaxDeg)} | ${c.elNeededDeg === undefined || c.elNeededDeg === null ? '—' : f2(c.elNeededDeg)} | ${tf(c.inRange)} | ${c.thetaKind} |`)].join('\n');
  const t4 = J.t4;
  T.t4 = ['| 惑星 | 太陽の項と背景の項のなす角 [°] | 規則(なす角 ≤ 120° —— 減速しない)| 太陽の項 ÷ 背景の項の大きさ | ベクトルの和 [rad/s] | 規則どおりの読み [rad/s] |', '|---|---|---|---|---|---|',
    ...t4.rows.map((r) => `| ${NM[r.key]} | ${f2(r.angDeg)} | ${tf(r.noDecel)} | ${fe(r.ratio)} | ${fe(r.vecSum)} | ${fe(r.ruleRead)} |`),
    ...t4.equal.map((e) => `| 同じ大きさ 1 の 2 つ(なす角 ${e.angDeg}°) | ${e.angDeg} | ${tf(e.noDecel)} | 1 | ${f3(e.vecSum)} | ${f3(e.ruleRead)} |`)].join('\n');
  return T;
}

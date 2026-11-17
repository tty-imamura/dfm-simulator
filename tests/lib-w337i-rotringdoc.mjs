// 第337便i(原仮定者の回答(2026-11-14 —— 第138報の回答)・統括の検証項目 R345): **正本 tests/out/rotring-337i.json から PHYSICS〔第337便i〕の表を作る文書の lib**
// (QA docs.rotring337i が節の表と逐語で照合する —— 表の数は有効数字 3 桁の指数・丸めの程度の数〔恒等式の残差〕は「< 1e-x」の形で書き、数そのものは載せない)。
export const DOC_VERSION = 'w337i-rotringdoc-3';   // 第340便h: 近点の向き atNeed.advance の 3 値(正 → 進める・負 → 戻す・未解決 → 未解決(尺度の内))
// (旧 'w337i-rotringdoc-2')   // 第338便c: 0 と書いた葉(丸めの残り —— 正本の meta.recheck)を表で「0」と書く
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const lt = (x, t) => (Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : '**' + fe(x) + '**');
const z12 = (x) => (Number.isFinite(x) && Math.abs(x) < 1e-12 ? '0(< 1e-12)' : fe(x));   // べきの丸め(R_d が消える列)
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const ACT = Object.freeze({ vel: '座標を運ぶ方位の場', push: '方位の押し', focus: '鉛直へ寄せる場', damp: '相対の速度の全部', dampz: '相対の速度の鉛直だけ' });
const RD = Object.freeze({ Yk: 'Y_k m', Req: '軸比の R_eq', Robs: '観測半径', Rsrc: 'R_src' });
const SP = Object.freeze({ obs: 's', sd: 's_d' });
const PL = Object.freeze({ merc: '水星', venus: '金星', earth: '地球', mars: '火星' });
const CT = Object.freeze({ off: '回転引きずり OFF(λ = 0)', k1: '並進引きずりの K1(実装)', rigid: '源の自転が運ぶ速度の剛体の場(並進引きずりの回転の分 —— 単位の λ)' });
const nameOf = (s) => `${s.prof}・${ACT[s.action]}・${RD[s.reading]}・${SP[s.speed]}`;
/** 例として並べる環の物差しを満たさない組(作用の型ごとに 1 つ) */
export const FAIL_EXAMPLES = Object.freeze(['slice|push|Req|obs', 'lor2|vel|Req|obs', 'lor2|damp|Req|obs', 'ball|focus|Req|obs', 'lor8|focus|Robs|obs']);

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates;
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| ① 場の型が第333便a・第334便a の関数と同じ(切り口・lor8 = lorentz・球の遠方の U と ω —— 相対の差) | ${lt(S.match.U, 1e-12)}・${lt(S.match.om, 1e-12)} | ${tf(G.match)} |`,
    `| ② ω = −½ ∂U/∂z(中心差分 —— lor2・lor4・src・ball) | ${lt(S.deriv, 1e-6)} | ${tf(G.deriv)} |`,
    `| ③ R_d の読み: R_eq ÷ Y_k m = (1 − f)^{−1/3}・J 案の s_d R_d² が R_d に依らない・R_src・Y_k の倍 | ${lt(Math.max(S.readings.req, S.readings.jfix, S.readings.rsrc, S.readings.kscale), 1e-12)} | ${tf(G.readings)} |`,
    `| ④ λ = 0 で作用の型 5 の率が全部 0・λ に比例 | ${S.zero.zero === 0 ? '0' : '**' + fe(S.zero.zero) + '**'}・${lt(S.zero.lin, 1e-9)} | ${tf(G.zero)} |`,
    `| ⑤ 閉じた式: 帯の内の鉛直へ寄せる場 di/dt = −(a/2) sin i cos i・相対の速度の鉛直 di/dt ≈ −(γ/2) tan i | ${lt(S.closed.focus, 1e-6)}・${lt(S.closed.dampz, 1e-4)} | ${tf(G.closed)} |`,
    `| ⑥ 座標を運ぶ方位の場は半長軸を動かさない・傾きの率は交点の率より桁で小さい・剛体の場の公転のずれ = λ s/n | ${lt(S.vel.dlnA, 1e-9)}・${lt(S.vel.tilt, 1e-6)}・${lt(S.vel.rigid, 1e-9)} | ${tf(G.vel)} |`,
    `| ⑦ 入力の拒否 | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  T.inventory = ['| 型 | 出どころ | 式 | 源の引きずり半径の入り方 | 速さ | 高さの依存 | 赤道面の向き | R_d を超えた所 |', '|---|---|---|---|---|---|---|---|',
    ...J.inventory.types.map((t) => `| ${t.key} | ${t.wave} | ${t.formula} | ${t.rd} | ${t.speed} | ${t.zdep} | ${t.eqDir} | ${t.beyond} |`)].join('\n');
  const I = J.inventory;
  T.positions = ['| 受け手 | 半径または半長軸 [m] | ÷ Y_k m | ÷ 軸比の R_eq | ÷ 観測半径 | ÷ R_src | 高さの振れ ÷ Y_k m |', '|---|---|---|---|---|---|---|',
    `| 源の引きずり半径(土星) | — | ${fe(I.rdSaturn.Yk)} m | ${fe(I.rdSaturn.Req)} m | ${fe(I.rdSaturn.Robs)} m | ${fe(I.rdSaturn.Rsrc)} m | — |`,
    ...I.rings.map((r) => `| ${r.name} | ${fe(r.r)} | ${fe(r.rOverRd.Yk)} | ${fe(r.rOverRd.Req)} | ${fe(r.rOverRd.Robs)} | ${fe(r.rOverRd.Rsrc)} | ${fe(r.zMainOverRd.Yk)}(10 m) |`),
    `| 源の引きずり半径(太陽) | — | ${fe(I.rdSun.Yk)} m | ${fe(I.rdSun.Req)} m | ${fe(I.rdSun.Robs)} m | ${fe(I.rdSun.Rsrc)} m | — |`,
    ...I.planets.map((p) => `| ${p.ja}(太陽の赤道面に対する傾き ${p.iSunDeg.toFixed(3)}°) | ${fe(p.a)} | ${fe(p.aOverRd.Yk)} | ${fe(p.aOverRd.Req)} | ${fe(p.aOverRd.Robs)} | ${fe(p.aOverRd.Rsrc)} | ${fe(p.zMaxOverRd.Yk)} |`)].join('\n');
  T.speeds = ['| 源 | R_d の読み | 観測自転 s [rad/s] | J 案の s_d [rad/s] | s_d R_d [m/s](J の等価 —— 物質の速さではない) |', '|---|---|---|---|---|',
    ...['saturn', 'sun'].flatMap((k) => Object.entries(I.speeds[k]).map(([rk, v]) => `| ${k === 'saturn' ? '土星' : '太陽'} | ${RD[rk]} | ${fe(v.obs)} | ${fe(v.sd)} | ${fe(v.sdRd)} |`))].join('\n');
  const R = J.ring;
  T.ringAction = ['| 作用の型 | 組 | 傾きを減らす組 | 環の物差しを満たす組 | 源の自転の向き(λ > 0)で減らす組 |', '|---|---|---|---|---|',
    ...Object.entries(R.byAction).map(([a, v]) => `| ${ACT[a]} | ${v.n} | ${v.thin} | ${v.pass} | ${v.prograde} |`),
    ...R.controls.map((c) => `| 対照: ${CT[c.key]} | 1 | ${c.judge.thin ? 1 : 0} | ${c.judge.thin && c.judge.pass ? 1 : 0} | — |`)].join('\n');
  const setRow = (k) => { const s = R.sets.find((q) => q.key === k), j = s.judge;
    return `| ${nameOf(s.spec)} | ${j.thin ? fe(j.lambdaNeed) : '—'} | ${j.thin ? fe(j.kepler) : '—'} | ${j.thin ? fe(j.drift) : '—'} | ${j.thin ? fe(j.ecc) : '—'} | ${j.thin ? fe(j.fastestEfolds) : '—'} | ${j.thin ? (j.pass ? '満たす' : '満たさない') : j.why} |`; };
  T.ringSets = ['| 組(高さの型・作用の型・R_d の読み・速さ) | 要る λ | |δΩ/Ω| の最大 | |Δ ln a|(1e7 年) | Δ ln e(1e7 年) | いちばん速い点の e 分の 1 の回数 | 環の物差し |', '|---|---|---|---|---|---|---|',
    ...J.reps.map(setRow), ...FAIL_EXAMPLES.map(setRow)].join('\n');
  const rep0 = R.sets.find((q) => q.key === J.reps[0]);
  T.ringRows = [`| 環の点(${nameOf(rep0.spec)}・単位の λ) | z_max [m] | d ln i/dt [1/s] | d ln e/dt [1/s] | 近点の率 [rad/s] | 交点の率 [rad/s] | d ln a/dt [1/s] |`, '|---|---|---|---|---|---|---|',
    ...rep0.rows.map((q) => `| ${R.points.find((p) => p.ring === q.ring).name} | ${q.zMax} | ${fe(q.dlnI)} | ${fe(q.dlnE)} | ${fe(q.apsW)} | ${fe(q.dnode)} | ${fe(q.dlnA)} |`)].join('\n');
  const P = J.planets;
  T.planets = ['| 組(要る λ で) | 惑星 | 黄道の ϖ の率 [″/世紀] | 黄道の交点の率 [″/世紀] | 面内の近点 ÷ 1PN | 向き | 尺度の比の最大 | 尺度の内 | 残差の帯の内(第337便b の比) | 尺度の内に留まる λ ÷ 要る λ | 赤道面の近くの割合 |', '|---|---|---|---|---|---|---|---|---|---|---|',
    ...J.reps.flatMap((k) => { const s = P.sets.find((q) => q.key === k); return Object.entries(s.per).map(([pk, p]) => { const a = p.atNeed;
      return `| ${nameOf(s.spec)} | ${PL[pk]} | ${fe(a.row.ecl.dvarpi)} | ${fe(a.row.ecl.dnode)} | ${fe(a.q1Ratio)} | ${a.advance === '正' ? '進める' : a.advance === '負' ? '戻す' : '未解決(尺度の内)'} | ${fe(Math.max(...Object.values(a.scaleRatios)))} | ${tf(a.insideScale)} | ${tf(a.inside)} | ${fe(a.window)} | ${fe(a.row.nearShare.apsW)} |`; }); }),
    `| 対照(λ = 0)の残差の帯の比 | 水星・金星・地球・火星 | 0 | 0 | 0 | — | 0 | 真 | ${PL.merc} ${tf(Object.values(P.base.merc).every((x) => x <= 1))}・${PL.venus} ${tf(Object.values(P.base.venus).every((x) => x <= 1))}・${PL.earth} ${tf(Object.values(P.base.earth).every((x) => x <= 1))}・${PL.mars} ${tf(Object.values(P.base.mars).every((x) => x <= 1))} | — | — |`].join('\n');
  const q1 = P.q1cy, cmpRow = (label, kind, rdIn, row, k = 1) => `| ${label} | ${kind} | ${rdIn} | ${fe(row.apsW * k)} | ${fe(row.ecl.dvarpi * k)} | ${row.apsW * k > 0 ? '進める' : row.apsW * k < 0 ? '戻す' : '0'} | ${fe(row.apsW * k / q1)} | ${fe(row.nearShare ? row.nearShare.apsW : null)} |`;
  const TR = Object.fromEntries(P.trans.map((t) => [t.key, t.row])), CR = Object.fromEntries(P.controls.map((c) => [c.key, c.row]));
  const [repA, repB, repC] = J.plan.mainSets.map((k) => P.sets.find((q) => q.key === k));
  T.compare = [`| 列(水星 —— 1PN の面内の近点の率 ${fe(q1)} ″/世紀) | 引きずりの種 | 源の引きずり半径の入り方 | 面内の近点の率 [″/世紀] | 黄道の ϖ の率 [″/世紀] | 向き | ÷ 1PN | 赤道面の近くの割合 |`, '|---|---|---|---|---|---|---|---|',
    cmpRow('並進引きずりの動径の分(第337便b の分解)', '並進', '入らない', TR.transRadial), cmpRow('並進引きずりの接線の分(同)', '並進', '入らない', TR.transTangent), cmpRow('座標変換に入る源の回転(同)', '並進(回転の分)', '入らない', TR.rot),
    cmpRow('第337便b の赤道帯の候補の代表(G_loc の置き換え)', '並進の型(源の自転が運ぶ速度の場を高さで重み付け)', '入らない(帯の厚みは開き角 1°)', P.bandB),
    cmpRow('対照: ' + CT.k1, '並進', 'K1 の核(R_d の球)', CR.k1), cmpRow('対照: ' + CT.rigid, '並進(回転の分)', '入らない', CR.rigid),
    cmpRow('本枝: ' + nameOf(repA.spec) + '(要る λ)', '回転', '帯の厚み R_d・大きさ R_d²', repA.per.merc.atNeed.row),
    cmpRow('本枝: ' + nameOf(repB.spec) + '(要る λ)', '回転', '帯の厚み R_d(帯の形)', repB.per.merc.atNeed.row),
    cmpRow('本枝: ' + nameOf(repC.spec) + '(要る λ)', '回転', 's_d R_d² が一定(J 案 —— R_d が消える)', repC.per.merc.atNeed.row)].join('\n');
  T.rdScan = ['| 高さの型・作用の型・速さ | 要る λ のべき(d log λ/d log R_d) | 水星の ϖ のべき | 尺度の内に留まる λ ÷ 要る λ のべき | 環に効いて水星の尺度の内の k(R_d = Y_k m × 10^k) | k = −2・0・2・4・6 の 尺度の内の λ ÷ 要る λ |', '|---|---|---|---|---|---|',
    ...J.rdScan.map((r) => `| ${r.prof}・${ACT[r.action]}・${SP[r.speed]} | ${z12(r.slopeLambda)} | ${z12(r.slopeMercVarpi)} | ${z12(r.slopeWindow)} | ${r.insideK.length ? r.insideK.join('・') : 'なし'} | ${[-2, 0, 2, 4, 6].map((k) => fe(r.scan.find((q) => q.k === k).window)).join('・')} |`)].join('\n');
  const ig = J.integ, st = J.plan.integ.steps;
  T.integ = [`| 代表 | 読む量 | 一次の率 | 時間積分(${st[0]}・${st[1]} 步/周 × ${J.plan.integ.nOrb} 周) | 一次 ÷ 積分 − 1 | 刻みの差 |`, '|---|---|---|---|---|---|',
    `| 土星 B 環(z_max 1 m)・${nameOf(ig.ring.spec)} | d ln i/dt [1/s] | ${fe(ig.ring.first.dlnI)} | ${fe(ig.ring.runs[0].dlnI)}・${fe(ig.ring.runs[1].dlnI)} | ${fe(ig.ring.relDiff)} | ${fe(ig.ring.stepSpread)} |`,
    ...ig.planet.map((p) => `| 水星・${nameOf(p.spec)} | ${p.readKey === 'apsW' ? '面内の近点の率 [rad/s]' : 'd ln i/dt [1/s]'} | ${fe(p.first[p.readKey])} | ${fe(p.runs[0][p.readKey])}・${fe(p.runs[1][p.readKey])} | ${fe(p.relDiff)} | ${fe(p.stepSpread)} |`)].join('\n');
  // 補足 4 —— 扁平の則の次数・一様厚みの区間・比べる相手
  T.oblate = ['| 組 | 次数 q | 土星の R_eq ÷ Y_k m | 要る λ | 環の物差し | 水星の尺度の比の最大 |', '|---|---|---|---|---|---|',
    ...J.oblate.flatMap((o) => { const s = R.sets.find((q) => q.key === o.key); return o.rows.map((r) => `| ${nameOf(s.spec)} | ${r.q === 1 / 3 ? '1/3(主)' : r.q === 0.5 ? '1/2' : String(r.q)} | ${fe(r.satFactor)} | ${fe(r.lambdaNeed)} | ${r.pass ? '満たす' : '満たさない'} | ${fe(r.mercScaleMax)} |`); })].join('\n');
  const Uf = J.uniform, E = Uf.edges;
  T.uniformEdges = [`| 土星の環(源の重力が支配的な範囲 —— 決定力の割合 ½ の半径 ${fe(E.rHalfD)} m・加速度の割合 ½ の半径 ${fe(E.rHalfA)} m・表面 ${fe(E.surface)} m・主の R_eq ${fe(E.RdMain)} m) | 半径 [m] | ÷ 表面の半径 | 決定力の割合 | 加速度の割合 | 区間の内 |`, '|---|---|---|---|---|---|',
    ...Uf.ringPos.map((r) => `| ${r.name} | ${fe(r.r)} | ${fe(r.rOverSurface)} | ${fe(r.dShare)} | ${fe(r.aShare)} | ${tf(r.inside)} |`),
    ...Uf.prop.map((q) => `| z に比例する高さの上限(B 環 —— 高さ則 ${q.law}・V/z が z → 0 の値の 10% の内) | ${fe(q.zMax)} | — | — | ÷ R_eq ${fe(q.zMaxOverRd)} | — |`)].join('\n');
  const lawName = (k) => (R.sets.find((q) => q.key === k) ? nameOf(R.sets.find((q) => q.key === k).spec) : '高さ則 ' + k + '・鉛直へ寄せる場・R_eq・s');
  T.uniformRates = [`| 組(単位の λ・高さの振れ ${J.decl.uniform.zMax} m) | D 環の d ln i/dt [1/s] | F 環の d ln i/dt [1/s] | 単位の高さあたりの率 a のべき(d log a/d log r) | 傾きの率のべき | 1 周あたりの率のべき | D〜F の率の一様さ(平均からの最大のずれ) | 厚みのべき(乱しの σ_z が一様) | 厚みのべき(乱しの注入率が一様) |`, '|---|---|---|---|---|---|---|---|---|',
    ...Uf.rates.map((r) => `| ${lawName(r.key)} | ${fe(r.pts[0].dlnI)} | ${fe(r.pts[r.pts.length - 1].dlnI)} | ${z12(r.powSlope)} | ${z12(r.powRate)} | ${z12(r.powPerOrbit)} | ${z12(r.flatRate)} | ${z12(r.thickM1)} | ${z12(r.thickM2)} |`)].join('\n');
  const short = (k) => { const s = R.sets.find((q) => q.key === k).spec; return `${s.prof}・${ACT[s.action]}・${SP[s.speed]}`; };
  T.an719 = ['| 受け手 | 源 | n/s | 半長軸 ÷ 同期の半径 | 軸引きずり: 背景が静止の読み [rad/s] | 軸引きずり: 今の並進の式の形の読み [rad/s] | 2 つの読みの差 [rad/s] | ' + J.plan.mainSets.map((k) => short(k) + ': 傾きの e 分の 1 の時間 [年]・場の向きの回転率 [rad/s]・÷ 読みの差').join(' | ') + ' |',
    '|---|---|---|---|---|---|---|' + J.plan.mainSets.map(() => '---|').join(''),
    ...J.an719.map((r) => `| ${r.name} | ${r.host === 'saturn' ? '土星' : r.host === 'mars' ? '火星' : '木星'} | ${fe(r.nOverS)} | ${fe(r.aOverSync)} | ${fe(r.axStatic)} | ${fe(r.axSelf)} | ${fe(r.axDiff)} | ` + r.sets.map((q) => `${fe(q.tiltEfoldYr)}・${fe(q.spinField)}・${fe(q.vsAxialDiff)}`).join(' | ') + ' |')].join('\n');
  return T;
}

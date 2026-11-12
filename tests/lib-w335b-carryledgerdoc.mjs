// 第335便b(原仮定者の決断(2026-11-12 —— AN654・AN653・AN650)・原仮定者の補足(2026-11-12)・統括の検証項目 R329): **正本 tests/out/carryledger-w335b.json から PHYSICS〔第335便b〕の表を作る文書の lib**
// (QA docs.carryLedger335b が節の表と逐語で照合する —— 表の数は有効数字 4 桁か指数 3 桁・丸めの程度の数〔恒等式の残差〕は「< 1e-x」の形で書き、数そのものは載せない)。
export const DOC_VERSION = 'w335b-carryledgerdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toExponential(3));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toPrecision(4));
const lt = (x, t) => (Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : '**' + fe(x) + '**');
const tf = (x) => (x === true ? '真' : x === false ? '偽' : 'null');
const NAME = Object.freeze({ sun: '太陽', mercury: '水星', venus: '金星', earth: '地球', moon: '月', mars: '火星', jupiter: '木星', io: 'イオ', europa: 'エウロパ', ganymede: 'ガニメデ', callisto: 'カリスト', saturn: '土星', titan: 'タイタン',
  uranus: '天王星', neptune: '海王星', triton: 'トリトン', pluto: '冥王星', charon: 'カロン', satC: 'C 環の粒子', satB: 'B 環の粒子', satA: 'A 環の粒子' });
const nm = (k) => NAME[k] || k;
export const READING_LABEL = Object.freeze({ rotation: '銀河の回転 Ω_gal(銀河だけの源)', jEquiv: 'J 等価 s_d(銀河だけの源)', 'fieldPort|center': '場の枠の銀河の口(中心の点)', 'carryPort|center': '自己を運ぶ読みの銀河の口(中心の点・観測半径)',
  'fieldPort|inner': '場の枠の銀河の口(半径の内の和)', 'fieldPort|innerAlt': '同(離散化 2 倍)', 'jEquivPort|center': 'J 等価の銀河の口(中心の点)' });
export const SUPPLY_LABEL = Object.freeze({ sunJup: '太陽(木星への押し)', earthMoon: '地球(月への押し)', jupIo: '木星(イオへの押し)', satRingB: '土星(主な環を B 環の半径に置いた押し)' });
const HEAT_LABEL = Object.freeze({ none: '自己なし(場の枠)', 'carry|kappaM': '自己を運ぶ読み(R_d = Y_k m)', 'carry|robs': '自己を運ぶ読み(観測半径)' });

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, td = String(J.decl.tauDoc);
  // 表 1 純関数の場面
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| ① 自己を運ぶ式: 分子に自己を入れた平均との差(自己 0・1・1e6 と W₀ ≠ 0)・単独の天体で d = 0 かつ U = v・背景の項・ガリレイ変換で d が不変・源の割合を Σw/W で持つ | ${lt(S.carry.id, 1e-15)}・${tf(S.carry.single)}・${lt(S.carry.bgTerm, 1e-15)}・${lt(S.carry.galilean, 1e-9)}・${tf(S.carry.share)} | ${tf(G.carry)} |`,
    `| ② 静止の自己の場との恒等 U = U_static + f_self v・carryAt の ω′ と U′ の中心差分の ½∇×U′・冥王星–カロンの同期で ω′ = s・自己なしで d = 0 | ${lt(S.carryField.idStatic, 1e-12)}・${lt(S.carryField.fd, 1e-6)}・${lt(S.carryField.sync, 1e-9)}・${lt(S.carryField.dSync, 1e-12)} | ${tf(G.carryField)} |`,
    `| ③ 熱の口の反例(Γ = 1・s = 0): 同じ源を +2 と −1 に分ける → 源ごと・分解ごと・相殺の熱/別の源なら源ごと・分解ごと/合トルクの差 | ${f3(S.heat.sameSource)}・${f3(S.heat.samePart)}・${f3(S.heat.sameMerged)}/${f3(S.heat.diffSource)}・${f3(S.heat.diffPart)}/${lt(S.heat.torque, 1e-12)} | ${tf(G.heat)} |`,
    `| ④ 受け手の静止系と重心系(地球–月): 自己なしの ω の差・自己を運ぶ読みの ω′ の差・静止系の自己の勾配の口(0)・重心系では 0 でない | ${lt(S.frame.none, 1e-9)}・${lt(S.frame.carry, 1e-9)}・${f3(S.frame.restSelfPort)}・${tf(S.frame.barySelfPort)} | ${tf(G.frame)} |`,
    `| ⑤ T1(s = 2 ẑ・r = (3, 0, 4)): 率 s·r̂・中心の速さ・横のずれ 1 の速さ・軸に沿うずれの速さ・指標 s z | ${f3(S.t1.rate)}・${f3(S.t1.center)}・${f3(S.t1.off)}・${lt(S.t1.along, 1e-15)}・${f3(S.t1.proxy)} | ${tf(G.t1)} |`,
    `| ⑥ 供給の帳簿: 目標が自転より小さい → 受動では供給できない/大きい → Γ・熱(期待 5)・恒等式・供給なしの減衰の時間 | ${tf(S.supply.loFeasible)}/${tf(S.supply.hiFeasible)}・${f3(S.supply.Gamma)}・${f3(S.supply.Q)}・${lt(S.supply.id, 1e-12)}・${f3(S.supply.noSupply)} | ${tf(G.supply)} |`,
    `| ⑦ 銀河の座標軸: 正規直交・銀河の中心の向きの北極からの直交のずれ [°]・中心の点の座標の速度 ÷ v₀(太陽系の重心で)・円盤の質量の和 | ${lt(S.galaxy.ortho, 1e-12)}・${fe(S.galaxy.gcOffDeg)}・${lt(S.galaxy.centerSync, 1e-12)}・${lt(S.galaxy.innerMass, 1e-12)} | ${tf(G.galaxy)} |`,
    `| ⑧ 入力の拒否 | ${S.reject.n}/${S.reject.of} | ${tf(G.reject)} |`].join('\n');
  // 表 2 自己を運ぶ式の太陽系の表(本の時刻)
  T.carry = ['| 受け手 | ‖d‖/‖v − v_主星‖(自己なし・R_d・観測半径) | 源の割合 Σw/W(R_d・観測半径) | ω′·ŝ/s(自己なし・R_d・観測半径) | 静止の自己の項の ω·ŝ/s(R_d・観測半径) |', '|---|---|---|---|---|',
    ...J.carry.map((r) => { const c = r.cols; return `| ${nm(r.key)}${r.primary ? '' : '(重心に対する v)'} | ${fe(c.none.dOverVrel)}・${fe(c.kappaM.dOverVrel)}・${fe(c.robs.dOverVrel)} | ${fe(c.kappaM.srcShare)}・${fe(c.robs.srcShare)} | ${fe(c.none.carryParOverS)}・${fe(c.kappaM.carryParOverS)}・${fe(c.robs.carryParOverS)} | ${fe(c.kappaM.staticParOverS)}・${fe(c.robs.staticParOverS)} |`; })].join('\n');
  // 表 3 熱の口の 3 列(τ = 10³ 公転・受け手の静止系)と系の比べ
  const H = J.heat.rows;
  T.heat = ['| 受け手 | 読み | ω·ŝ/s | 源ごと(主)[W] | 分解ごと(比)[W] | 相殺(否定対照)[W] | 分解ごと ÷ 源ごと | 重心系の源ごと ÷ 静止系の源ごと |', '|---|---|---|---|---|---|---|---|',
    ...H.flatMap((r) => J.plan.heatReadings.map((rd) => { const q = r.readings[rd].rest, t = q.tau[td], b = r.readings[rd].bary.tau[td];
      return `| ${nm(r.key)} | ${HEAT_LABEL[rd]} | ${fe(q.omegaParOverS)} | ${fe(t.bySource)} | ${fe(t.byPart)} | ${fe(t.merged)} | ${fe(t.byPart / t.bySource)} | ${fe(b.bySource / t.bySource)} |`; }))].join('\n');
  // 表 4 熱 ÷ 観測の熱流(ブリーフの 5 受け手 —— τ の格子 3・受け手の静止系)
  T.heatObs = ['| 受け手 | 観測の熱流 [W] | 読み | 源ごと ÷ 観測(τ = 1・10³・10⁶ 公転) | 分解ごと ÷ 観測(τ = 10³) | 相殺 ÷ 観測(τ = 10³) | 源ごとの熱 [W](τ = 10³) |', '|---|---|---|---|---|---|---|',
    ...J.plan.heatFocus.flatMap((k) => { const r = H.find((z) => z.key === k); return J.plan.heatReadings.map((rd) => { const q = r.readings[rd].rest.tau, o = (t) => (q[t].obs ? fe(q[t].obs.bySource) : '観測なし');
      return `| ${nm(k)} | ${r.heatObs ? fe(r.heatObs) : '観測なし'} | ${HEAT_LABEL[rd]} | ${o('1')}・${o(td)}・${o('1000000')} | ${q[td].obs ? fe(q[td].obs.byPart) : '観測なし'} | ${q[td].obs ? fe(q[td].obs.merged) : '観測なし'} | ${fe(q[td].bySource)} |`; }); })].join('\n');
  // 表 5 銀河の量と座標軸
  const g = J.galaxy.gal, ax = J.galaxy.axes;
  T.galaxy = ['| 量 | 値 |', '|---|---|',
    `| 内側の質量 M = v₀²R₀/G [kg]・R₀ [m] | ${fe(g.M)}・${fe(g.R0)} |`, `| 銀河の回転 Ω_gal = v₀/R₀ [rad/s] | ${fe(g.Omega)} |`,
    `| J 等価 s_d [rad/s]・R_d = Y_k M [m]・s_d/Ω_gal | ${fe(g.sd)}・${fe(g.Rd)}・${fe(g.sdOverOmega)} |`, `| J 等価の座標の速度 s_d R₀ ÷ 光速 | ${fe(g.sd * g.R0 / J.decl.c)} |`,
    `| 太陽の自転軸 · 銀河の北極(本の座標 = 黄道 J2000) | ${f3(ax.sunPoleDotNGP)} |`, `| 銀河の中心の向きの直交のずれ [°] | ${fe(ax.gcOffDeg)} |`].join('\n');
  // 表 6 銀河の読みの符号(目標 T の ŝ 成分 ÷ s —— 増 = 受動の応答が自転を増やす・減 = 減らす)
  const rk = ['rotation', 'jEquiv', 'fieldPort|center', 'fieldPort|inner', 'fieldPort|innerAlt', 'carryPort|center', 'jEquivPort|center'];
  T.galSign = ['| 受け手 | ŝ·L̂_gal | ' + rk.map((k) => READING_LABEL[k]).join(' | ') + ' |', '|---|---|' + rk.map(() => '---|').join(''),
    ...J.galaxy.rows.map((r) => `| ${nm(r.key)} | ${f3(r.sHatDotL)} | ` + rk.map((k) => { const q = r.readings[k]; return fe(q.parOverS) + (q.raises ? '(増)' : '(減)'); }).join(' | ') + ' |')].join('\n');
  // 表 7 銀河の部の大きさ(口の読みの銀河の部の ω_gal·ŝ/s と口の割合)
  const pk = ['fieldPort|center', 'fieldPort|inner', 'carryPort|center', 'jEquivPort|center'];
  T.galPart = ['| 受け手 | ' + pk.map((k) => READING_LABEL[k] + ' の ω_gal·ŝ/s・割合').join(' | ') + ' |', '|---|' + pk.map(() => '---|').join(''),
    ...J.galaxy.rows.map((r) => `| ${nm(r.key)} | ` + pk.map((k) => fe(r.readings[k].galParOverS) + '・' + fe(r.readings[k].share)).join(' | ') + ' |')].join('\n');
  // 表 8 供給のある開いた帳簿(要る Γ と熱 —— 受動の型)
  const sk = ['rotation', 'jEquiv', 'fieldPort|center', 'fieldPort|inner', 'carryPort|center', 'jEquivPort|center'];
  const cell = (q) => { const p = q.passive, a = q.aligned, one = (z) => (z.feasible ? `Γ ${fe(z.Gamma)}・Q ${fe(z.Q)}・Q/観測 ${fe(z.obsRatio)}` + (z.GammaTotal ? `・全体 Γ ${fe(z.GammaTotal)} の合トルク ${fe(z.netTorquePar)}${z.netRaises ? '(増)' : '(減)'}・熱 ${fe(z.netHeat)}` : '') : '不可');
    return `受動: ${one(p)}/整列の仮定: ${one(a)}`; };
  T.supply = ['| 源(損失) | 読み | 目標 T·ŝ/s | 要る値(受動の型 N = Γ(T − s)) |', '|---|---|---|---|',
    ...J.supply.rows.flatMap((r) => sk.map((k) => `| ${SUPPLY_LABEL[r.key]} | ${READING_LABEL[k]} | ${fe(r.readings[k].targetParOverS)} | ${cell(r.readings[k])} |`))].join('\n');
  // 表 9 供給なしの列(対照)
  T.noSupply = ['| 源(損失) | 損失のトルク N_loss [N m] | 損失の仕事 s N_loss [W] | 減衰の時間 J/‖N_loss‖ [年] | 観測の熱流(太陽は光度)[W] | s N_loss ÷ 観測 |', '|---|---|---|---|---|---|',
    ...J.supply.rows.map((r) => `| ${SUPPLY_LABEL[r.key]} | ${fe(r.Nloss)} | ${fe(r.lossWork)} | ${fe(r.noSupplyYr)} | ${fe(r.heatObs)} | ${fe(r.lossWork / r.heatObs)} |`)].join('\n');
  // 表 10 T1 の部位の速度の則
  T.t1 = ['| 源 → 受け手 | 距離 r [m] | 高さ z [m] | 捩れの率 s·r̂ [rad/s] | s·r̂ ÷ s_源 | 表面の速さの最大 ‖s·r̂‖ R [m/s] | 指標 s z [m/s] | 中心の速さ | 受け手の自転の r̂ 成分 [rad/s] | ω_field の r̂ 成分 [rad/s] |', '|---|---|---|---|---|---|---|---|---|---|',
    ...J.t1.rows.map((r) => `| ${nm(r.src)} → ${nm(r.recv)} | ${fe(r.r)} | ${fe(r.z)} | ${fe(r.rate)} | ${fe(r.rateOverS)} | ${fe(r.surfaceMax)} | ${fe(r.proxy)} | ${f3(r.center)} | ${fe(r.recvPar)} | ${fe(r.fieldPar)} |`)].join('\n');
  // 表 11 冥王星–カロンの同期の 0(読むだけ)
  const sy = J.sync, row = (sr) => sy.ledger[sr].map((q) => `${nm(q.key)} ${lt(sr === 'none' ? q.omegaMinusSRel : q.carryMinusSRel, 1e-9)}`).join('・');
  T.sync = ['| 正本 | 量 | 値 |', '|---|---|---|',
    `| 第334便b | 自己なしの ‖ω_field − s‖/s | ${row('none')} |`, `| 第334便b | 自己を運ぶ読みの ‖ω′ − s‖/s(R_d) | ${row('kappaM')} |`, `| 第334便b | 自己を運ぶ読みの ‖ω′ − s‖/s(観測半径) | ${row('robs')} |`,
    `| 第334便d | 同期のずれ syncD・syncSlip・s/n | ${f3(sy.binary.syncD)}・${f3(sy.binary.syncSlip)}・${sy.binary.spinOverN.map(f3).join('/')} |`].join('\n');
  return T;
}

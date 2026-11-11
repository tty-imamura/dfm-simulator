// 第334便b(原仮定者の整理(2026-11-11)・原仮定者の回答(2026-11-11 —— AN626・AN630)・統括の検証項目 R323): **正本 tests/out/ledger-w334b.json から PHYSICS〔第334便b〕の表を作る文書の lib**
// (QA docs.ledger334b が節の表と逐語で照合する —— 表の数は有効数字 4 桁か指数 3 桁・丸めの程度の数〔恒等式の残差・刻みの閉じ〕は「< 1e-x」の形で書き、数そのものは載せない)。
export const DOC_VERSION = 'w334b-ledgerdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toExponential(3));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toPrecision(4));
const lt = (x, t) => (Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : '**' + fe(x) + '**');
const tf = (x) => (x === true ? '真' : x === false ? '偽' : 'null');
const NAME = Object.freeze({ sun: '太陽', mercury: '水星', venus: '金星', earth: '地球', moon: '月', mars: '火星', jupiter: '木星', io: 'イオ', saturn: '土星', titan: 'タイタン', uranus: '天王星', neptune: '海王星', triton: 'トリトン',
  pluto: '冥王星', charon: 'カロン' });
const nm = (k) => NAME[k] || k;
export const PAIR_LABEL = Object.freeze({ sunJup: '太陽 → 木星', earthMoon: '地球 → 月', satRingC: '土星 → C 環の粒子(a = 7.5e7 m)', satRingB: '土星 → B 環の粒子(a = 1.05e8 m)', satRingA: '土星 → A 環の粒子(a = 1.3e8 m)', jupIo: '木星 → イオ' });
export const SYS_LABEL = Object.freeze({ smv: '太陽–水星–金星', em: '地球–月', pc: '冥王星–カロン', ji: '木星–イオ', sj: '太陽–木星' });
export const SELF_LABEL = Object.freeze({ none: '自己なし(場の枠)', kappaM: '自己 R_d = Y_k m', robs: '自己 観測半径' });
const iLabel = (r) => (r.tilted ? (r.pair.indexOf('satRing') === 0 ? 'z_max = 10 m' : f3(r.iDeg) + '°') : '0');

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, A = J.push.rows;
  // 表 1 純関数の場面
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| ① 軸の応答の口ごとの恒等式 P_in − N·s_i − Q = 0・経路の合トルク − Γ(ω_field − s_i)・熱の差 − Γ[(Σ|ω_k|)² − |Σω_k|²]・平行な経路の熱の差・0 の経路の口(4 経路 → 口 ${S.identity.nPorts}) | ${lt(S.identity.id, 1e-12)}・${lt(S.identity.torque, 1e-12)}・${lt(S.identity.excess, 1e-9)}・${lt(S.identity.parallel, 1e-12)} | ${tf(G.identity)} |`,
    `| ② 相殺の否定対照(逆向きの 2 経路・s_i = 0・Γ = 3): 相殺の熱・経路ごとの熱(期待 Γ(2|ω|)² = 48)・合トルク | ${f3(S.cancel.merged)}・${f3(S.cancel.path)}・${f3(S.cancel.torque)} | ${tf(G.cancel)} |`,
    `| ③ 同期の 0(冥王星–カロン・自己なし): |ω_field − s|/s・熱/自己 R_d = Y_k m の列の |ω_field − s|/s/自己が自分の運動を運ぶ読みの |ω′ − s|/s(R_d・観測半径)と U′ の中心差分の ½∇×U′ との差 | ${lt(S.sync.none, 1e-12)}・${f3(S.sync.heat0)}/${f3(S.sync.kappaM)}/${lt(S.sync.carryKappaM, 1e-12)}・${lt(S.sync.carryRobs, 1e-9)}・${lt(S.sync.carryFd, 1e-6)} | ${tf(G.sync)} |`,
    `| ④ 押しの帳簿: 円軌道の P_orb − n·N_orb・第333便a の orbitPush との照らし(P・N_h・N_i —— 傾き 0.1 rad)・i = 0 で Q_S − N_h(s − n)・Q_D/Q_S − (s_d − n)/(s − n)・NS は P_orb < 0 | ${lt(S.push.Pn, 1e-12)}・${lt(Math.max(S.push.vsP, S.push.vsNh, S.push.vsNi), 1e-6)}・${lt(S.push.tidal, 1e-12)}・${lt(S.push.ratio, 1e-12)}・${tf(S.push.nsSign)} | ${tf(G.push)} |`,
    `| ⑤ 重力の勾配: 対称・跡 0・中心差分・距離の次数 | ${lt(S.tide.sym, 1e-15)}・${lt(S.tide.trace, 1e-15)}・${lt(S.tide.fd, 1e-6)}・${f3(-S.tide.slope)} | ${tf(G.tide)} |`,
    `| ⑥ 自己の割合(月 ← 地球): f_self − W_ii/W_t・|d| ≤ (1 − f_self) max|C − v|・自己 R_d の列は観測半径の列より f_self が大きく |d| が小さい | ${lt(S.self.f, 1e-12)}・${tf(S.self.bound)}・${tf(S.self.small)} | ${tf(G.self)} |`,
    `| ⑦ 窓の閉じ(地球–月・1 公転・τ = 1 公転・刻み 60 と 120): ΔE_spin の相対の残差・比・ΔL の相対・口の帳簿 | ${fe(S.window.c1)}・${fe(S.window.c2)}(比 ${f3(S.window.c1 / S.window.c2)})・${lt(S.window.l2, 1e-12)}・${lt(S.window.ledger, 1e-12)} | ${tf(G.window)} |`,
    `| ⑧ 入力の拒否 | ${S.reject.n}/${S.reject.of} | ${tf(G.reject)} |`].join('\n');
  // 表 2 源の量(共役の 2 列の比 —— s_d/s = I_obs/I_d)
  T.sources = ['| 源 | 観測自転 s [rad/s] | J 等価の s_d [rad/s] | s_d/s(= I_obs/I_d) | I_obs [kg m²] | I_d [kg m²] | J [kg m²/s] |', '|---|---|---|---|---|---|---|',
    ...Object.entries(J.push.sources).map(([k, q]) => `| ${nm(k)} | ${fe(q.s)} | ${fe(q.sd)} | ${fe(q.sdOverS)} | ${fe(q.I)} | ${fe(q.Id)} | ${fe(q.J)} |`)].join('\n');
  // 表 3 押しの帳簿(NF・応答率 fixed —— 列 ball〔主〕と slice〔凍結の対照〕)
  const pick = (pr, til, col, rate, dir) => A.find((r) => r.pair === pr && r.tilted === til && r.col === col && r.rate === rate && r.dir === dir);
  const pushRow = (r) => `| ${PAIR_LABEL[r.pair]} | ${iLabel(r)} | ${r.col} | ${fe(r.Nh)} | ${fe(r.P)} | ${fe(r.S.Q)}${r.S.Qneg ? '(負)' : ''} | ${fe(r.D.Q)}${r.D.Qneg ? '(負)' : ''} | ${fe(r.QDoverQS)} | ${fe(r.S.obsRatio)} | ${fe(r.D.obsRatio)} | ${fe(r.aux.tSpinYr)} |`;
  const pairs = J.plan.pushPairs.map((p) => p.key);
  T.push = ['| 組 | 傾き | 列 | N_orb の法線の成分 [N m] | P_orb [W] | Q_S [W] | Q_D [W] | Q_D/Q_S | Q_S/観測の熱流 | Q_D/観測の熱流 | J/|N_orb| [年] |', '|---|---|---|---|---|---|---|---|---|---|---|',
    ...pairs.flatMap((pr) => [false, true].flatMap((til) => ['ball', 'slice'].map((c) => pushRow(pick(pr, til, c, 'fixed', 'NF')))))].join('\n');
  // 表 4 作用の型と応答率(傾き 0・列 ball): NF と NS・fixed と linked
  T.pushDir = ['| 組 | NF の P_orb [W] | NF の Q_S [W] | NS の P_orb [W] | NS の Q_S [W] | linked ÷ fixed の Q_S(NF) | 列 5 の Q_S(NF・fixed)の最小〜最大 [W] |', '|---|---|---|---|---|---|---|',
    ...pairs.map((pr) => { const nf = pick(pr, false, 'ball', 'fixed', 'NF'), ns = pick(pr, false, 'ball', 'fixed', 'NS'), lk = pick(pr, false, 'ball', 'linked', 'NF'), cs = A.filter((r) => r.pair === pr && !r.tilted && r.rate === 'fixed' && r.dir === 'NF').map((r) => r.S.Q);
      return `| ${PAIR_LABEL[pr]} | ${fe(nf.P)} | ${fe(nf.S.Q)} | ${fe(ns.P)} | ${fe(ns.S.Q)} | ${fe(lk.S.Q / nf.S.Q)} | ${fe(Math.min(...cs))}〜${fe(Math.max(...cs))} |`; })].join('\n');
  // 表 5 軸の応答の帳簿(本の時刻・τ = 10³ 公転)
  const E = J.epoch.rows, t3 = '1000';
  T.epoch = ['| 受け手 | s [rad/s] | ω_field·ŝ/s(自己なし・R_d・観測半径) | 今の軸の口 ω·ŝ/s(K1 の規則・K2 の半径) | Q 経路(自己なし)[W] | Q 相殺(自己なし)[W] | 源ごとの経路の Q [W] | Q/観測の熱流(自己なし・R_d) |', '|---|---|---|---|---|---|---|---|',
    ...E.map((r) => { const c0 = r.cols['2|none'].tau[t3], c1 = r.cols['2|kappaM'].tau[t3];
      return `| ${nm(r.key)} | ${fe(r.sObs)} | ${fe(r.cols['2|none'].omegaParOverS)}・${fe(r.cols['2|kappaM'].omegaParOverS)}・${fe(r.cols['2|robs'].omegaParOverS)} | ${fe(r.engine.k1Rule / r.sObs)}・${fe(r.engine.k2Radius / r.sObs)} | ${fe(c0.heatParts)} | ${fe(c0.heatMerged)} | ${fe(c0.perSource.heat)} | ${fe(c0.obsRatio)}・${fe(c1.obsRatio)} |`; })].join('\n');
  // 表 6 窓(刻み h と h/2 の閉じ)
  const W = J.windows, sysKeys = J.plan.windowSystems;
  T.windows = ['| 系 | 公転の周期 [日] | 走行 | ΔE の相対の残差(h・h/2) | 比 | ΔL の相対(h/2) | 熱 経路 [J] | 熱 相殺 [J] | ΔE_spin/E_spin | 閉じ |', '|---|---|---|---|---|---|---|---|---|---|',
    ...sysKeys.flatMap((k) => W[k].runs.filter((r) => !(r.label === 'axial' || r.label === 'carry') || r.tauOrbits === 1 || r.tauOrbits === 1e6).map((r) => `| ${SYS_LABEL[k]} | ${f3(W[k].periodDays)} | ${r.label === 'axial' ? '軸 ' + SELF_LABEL[r.selfRule] + '・τ ' + fe(r.tauOrbits) + ' 公転' : r.label === 'carry' ? '軸 自己が自分の運動を運ぶ読み(' + SELF_LABEL[r.selfRule] + ')・τ ' + fe(r.tauOrbits) + ' 公転' : r.label === 'push' ? '押しだけ' : '両方(自己なし・τ 1e3 公転)'} | ${r.closeE[0] <= 1e-13 ? '< 1e-13' : fe(r.closeE[0])}・${r.closeE[1] <= 1e-13 ? '< 1e-13' : fe(r.closeE[1])} | ${r.closeE[1] <= 1e-13 ? '(床)' : f3(r.convRatio)} | ${lt(r.closeL[1], 1e-13)} | ${fe(r.heatPath)} | ${fe(r.heatMerged)} | ${fe(r.dEoverE0)} | ${tf(r.closed)} |`))].join('\n');
  // 表 7 窓の押しの熱(共役の 2 列)と同期の読み
  T.windowPush = ['| 系 | Q_S/供給 | Q_D/供給_D | Q_D/Q_S | 時刻 0 の |ω_field − s|/s(自己なし —— 天体ごと) | 時刻 0 の |ω′ − s|/s(自己が自分の運動を運ぶ読み —— R_d・観測半径) |', '|---|---|---|---|---|---|',
    ...sysKeys.map((k) => { const r = W[k].runs.find((q) => q.label === 'push'), sy = W[k].sync.find((q) => q.selfRule === 'none');
      const cy = (sr) => W[k].sync.find((q) => q.selfRule === sr).rows.map((q) => nm(q.key) + ' ' + (q.carryMinusSRel <= 1e-12 ? '< 1e-12' : fe(q.carryMinusSRel))).join('・');
      return `| ${SYS_LABEL[k]} | ${Math.abs(r.QnfSRel) <= 1e-9 ? '< 1e-9' : f3(r.QnfSRel)} | ${f3(r.QnfDRel)} | ${Math.abs(r.QnfSRel) <= 1e-9 ? '—(Q_S が刻みの桁)' : fe(r.QnfDoverS)} | ${sy.rows.map((q) => nm(q.key) + ' ' + (q.omegaMinusSRel <= 1e-12 ? '< 1e-12' : f3(q.omegaMinusSRel))).join('・')} | ${cy('kappaM')} / ${cy('robs')} |`; })].join('\n');
  // 表 8 潮汐力との対応
  T.tide = ['| 組(源 → 受け手) | 自己 | ‖T‖ [1/s²] | √‖T‖ [1/s] | |ω_field| [1/s] | ‖ひずみ‖ [1/s] | n‖J‖ [1/s²] | 距離の次数(T・ω・ひずみ) | 源の質量の次数(T・ω・ひずみ) | 受け手の半径の次数(ω・ひずみ) |', '|---|---|---|---|---|---|---|---|---|---|',
    ...J.tide.rows.map((r) => `| ${SYS_LABEL[r.pair]}(${nm(r.src)} → ${nm(r.recv)}) | ${SELF_LABEL[r.selfRule]} | ${fe(r.base.Tnorm)} | ${fe(r.base.sqrtT)} | ${fe(r.base.omega)} | ${fe(r.base.strain)} | ${fe(r.base.nJ)} | ${f3(r.slope.rT)}・${f3(r.slope.rOmega)}・${f3(r.slope.rStrain)} | ${f3(r.slope.mT)}・${f3(r.slope.mOmega)}・${f3(r.slope.mStrain)} | ${f3(r.slope.ROmega)}・${f3(r.slope.RStrain)} |`)].join('\n');
  // 表 9 自己の割合
  T.self = ['| 群 | 受け手(源) | 1 − f_self(R_d = Y_k m) | |d| [m/s](R_d) | 1 − f_self(観測半径) | |d| [m/s](観測半径) | max|C − v| [m/s] | 今の K1 の分母の一次 Σβ |', '|---|---|---|---|---|---|---|---|',
    ...J.self.rows.map((r) => `| ${r.group === 'solar' ? '太陽系' : r.group === 'binary' ? '連星' : '銀河の星'} | ${nm(r.key)}(${r.sys}) | ${fe(r.kappaM.oneMinus)} | ${fe(r.kappaM.d)} | ${fe(r.robs.oneMinus)} | ${fe(r.robs.d)} | ${fe(r.robs.cMax)} | ${fe(r.engineK1.sumBeta)} |`)].join('\n');
  return T;
}

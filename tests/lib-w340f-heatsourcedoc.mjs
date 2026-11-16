// 第340便f(原仮定者の指示(2026-11-17 —— 第140報)・統括の検証項目 R361): **正本 tests/out/heatsource-340f.json から PHYSICS〔第340便f〕の表を作る文書の lib**
// (QA docs.heatsource340f が節の表と逐語で照合する —— 表の数は有効数字 3 桁の指数・比は小数 2〜3 桁・丸めの残りは書かない)。
export const DOC_VERSION = 'w340f-heatsourcedoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : x === 0 ? '0' : Number(x).toExponential(2));
const f2 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(2));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const NM = Object.freeze({ Io: 'イオ', Europa: 'エウロパ', Ganymede: 'ガニメデ', Callisto: 'カリスト', Moon: '月', Enceladus: 'エンケラドゥス', Jupiter: '木星', Earth: '地球', Saturn: '土星',
  Phobos: 'フォボス', Deimos: 'ダイモス', Charon: 'カロン', Pluto: '冥王星', Venus: '金星', Mars: '火星', Sun: '太陽' });
const RD = Object.freeze({ aligned: '揃える(c = +1)', diff: '差分の読み(c = −1)' });
const REF = Object.freeze({ obsSpin: '観測の自転', lockN: '公転の角速度 n(第337便c の物差し)' });
const RUL = Object.freeze({ global: '全球(超過の判定に使う)', regional: '領域が違う(南極域 —— 下限の側・判定に使わない)', total: '総量(放射性の熱を含む —— 判定に使わない)' });
const PT = Object.freeze({ 'equal-bandLo': 'ρ 1・帯の下端', 'equal-bandHi': 'ρ 1・帯の上端', 'best-aligned': 'ρ 0・窓の中', 'shield-0.1': 'ρ_V・σ 0.1・窓の中' });
const iv = (I) => (I.intervals.length === 0 ? '無し' : I.intervals.map((q) => (q.from === null ? '0' : fe(q.from)) + '〜' + (q.to === null ? '∞' : fe(q.to))).join('・'));

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, T1 = J.t1, T2 = J.t2;
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| ① 天体が 1 つ(受け手が源の座標と一緒に回る —— 滑りなし)の口: 熱・トルク | ${S.oneBody.heat}・${S.oneBody.torque} | ${tf(G.oneBodyZero)} |`,
    `| ② ρ = 1 の窓 = 第337便c の帯 | ${fe(S.band.lo)}〜${fe(S.band.hi)} | ${tf(G.bandSame)} |`,
    `| ③ 熱は Γ について線形(Γ_host = Γ_bg = Γ₀ の和 ÷ 第338便f の口) | ${f3(S.linear)} | ${tf(G.linear)} |`,
    `| ④ 逆向きの 2 つの口: 正味のトルク・熱の和 | ${S.ports.net}・${S.ports.heat} | ${tf(G.portsNoCancel)} |`,
    `| ⑤ 要る (B − A)/C で滑り ÷ ω_lib | ${f3(S.libEdge)} | ${tf(G.libEdge)} |`,
    `| ⑥ 熱を軸に平行と垂直に分けて和が熱(主星の項の垂直の分 0) | ${tf(S.split)} | ${tf(G.split)} |`,
    `| ⑦ 金星の共鳴の番号 | ${S.kRes} | ${tf(G.resonanceIndex)} |`,
    `| ⑧ 入力の拒否 | ${S.rejects.filter(Boolean).length}/${S.rejects.length} | ${tf(G.rejects)} |`].join('\n');
  T.t1Units = ['| 天体 | 物差しの領域 | 読み | 主星の項の熱 u_host [W/(1/s)] | 銀河の項の熱 u_bg | ρ = 1 の銀河の取り分 | β_g ÷ β_host | 滑り² の比(銀河 ÷ 主星) | 銀河の項の軸に垂直の分 |', '|---|---|---|---|---|---|---|---|---|',
    ...T1.units.flatMap((u) => u.readings.map((q) => `| ${NM[u.key]}(${NM[u.host]}) | ${u.ruler ? RUL[u.ruler] : '—'} | ${RD[q.reading]} | ${fe(q.uHost)} | ${fe(q.uBg)} | ${f3(q.bgShareEqual)} | ${fe(q.betaRatio)} | ${fe(q.slipRatio)} | ${fe(q.bgPerp)} |`))].join('\n');
  T.t1Cls = ['| 天体 | 状態 | 束縛された系 | 潮汐 T [N·m] | 系の中の源 a [N·m·s] | 銀河 g [N·m·s] | g ÷ a | T ÷ a | T ÷ g |', '|---|---|---|---|---|---|---|---|---|',
    ...T1.cls.map((c) => `| ${NM[c.id]} | ${c.locked ? 'ロック' : c.state === 'star' ? '恒星' : 'ロックなし'} | ${tf(c.bound)} | ${fe(c.T)} | ${fe(c.a)} | ${fe(c.g)} | ${fe(c.g / c.a)} | ${fe(c.T / c.a)} | ${fe(c.T / c.g)} |`)].join('\n');
  T.t1Grid = ['| 読み | ρ = Γ_bg/Γ_host | Γ_host の下限(分類) | 決める行 | 上限(分類) | 決める行 | 上限(イオの熱) | 分類 | 分類とイオの熱 |', '|---|---|---|---|---|---|---|---|---|',
    ...T1.grid.flatMap((g) => g.rows.map((q) => `| ${RD[g.reading]} | ${q.rho} | ${fe(q.lo)} | ${NM[q.loBy]} | ${fe(q.hiCls)} | ${NM[q.hiBy]} | ${fe(q.hiHeat)} | ${tf(q.clsOk)} | ${tf(q.ok)} |`))].join('\n');
  T.t1Rho = ['| 読み | 分類が保たれる ρ | 分類とイオの熱が両方開く ρ | Γ_host = 0 の Γ_bg の窓(分類) | Γ_host = 0 のイオの熱の上限 | Γ_host = 0 で両方 |', '|---|---|---|---|---|---|',
    ...T1.grid.map((g) => `| ${RD[g.reading]} | ${iv(g.clsRho)} | ${iv(g.okRho)} | ${fe(g.hostOff.lo)}〜${fe(g.hostOff.hiCls)} | ${fe(g.hostOff.hiHeat)} | ${tf(g.hostOff.ok)} |`)].join('\n');
  T.t1Venus = ['| 読み | 金星の自転の物差し | 太陽の項 ÷ Γ [N·m·s] | 銀河の項 ÷ Γ | 逆向き | 釣り合う ρ_V |', '|---|---|---|---|---|---|',
    ...T1.venus.map((v) => `| ${RD[v.reading]} | ${REF[v.ref]} | ${fe(v.nSun)} | ${fe(v.nGal)} | ${tf(v.opposite)} | ${v.rhoV === null ? '—' : f3(v.rhoV)} |`),
    ...T1.atV.map((a) => `| ρ_V ${f3(a.rho)} での窓(熱は${RD[a.reading]}) | 分類 ${fe(a.lo)}〜${fe(a.hiCls)} | イオの熱の上限 ${fe(a.hiHeat)} | — | 分類 ${tf(a.clsOk)} | 両方 ${tf(a.ok)} |`)].join('\n');
  T.t1Shield = ['| 熱の読み | 遮り σ(衛星の ρ = σ ρ_V) | Γ_host の下限 | 決める行 | 上限(分類) | 決める行 | 上限(イオの熱) | 分類 | 分類とイオの熱 |', '|---|---|---|---|---|---|---|---|---|',
    ...T1.shield.flatMap((s) => s.rows.map((q) => `| ${RD[s.reading]} | ${q.sigma} | ${fe(q.lo)} | ${NM[q.loBy]} | ${fe(q.hiCls)} | ${NM[q.hiBy]} | ${fe(q.hiHeat)} | ${tf(q.clsOk)} | ${tf(q.ok)} |`)),
    ...T1.shield.map((s) => `| ${RD[s.reading]} | 両方開く σ の上限 | ${s.sigmaMax === null ? '無し(σ 0 でも)' : f3(s.sigmaMax)} | — | — | — | — | — | — |`)].join('\n');
  T.t1Rulers = ['| 天体 | 物差しの領域 | 観測の熱流 [W] | ' + T1.points.map((p) => PT[p.key]).join(' | ') + ' |', '|---|---|---|' + '---|'.repeat(T1.points.length),
    ...T1.rulers.map((r) => `| ${NM[r.key]} | ${RUL[r.ruler]} | ${fe(r.heatW)} | ${r.pts.map((p) => f3(p.rel)).join(' | ')} |`)].join('\n');
  const P = T2.periods, ph = T2.phase;
  T.t2B = ['| 読み B(先に —— 内合のたびにほぼ同じ面・ロックの近くを回る状態を含む)の量 | 値 |', '|---|---|',
    `| 共鳴の番号 k・自転の周期(CSV)・共鳴の周期 [日] | ${P.k}・${f3(P.periodObsDay)}・${f3(P.periodResDay)} |`,
    `| 滑り s − s_res [rad/s]・相対 | ${fe(P.slip)}・${fe(P.slipRel)} |`,
    `| 内合ごとの面のずれ [°] | ${f3(ph.driftDegPerConj)} |`,
    `| 面が 1 周(360°)する内合の数・年 | ${f2(ph.conjPerFace)}・${f2(ph.yrPerFace)} |`,
    `| 復元の位相が 1 周(180° —— sin 2(θ − φ) の周期)する内合の数・年 | ${f2(ph.conjPerPhase)}・${f2(ph.yrPerPhase)} |`,
    `| 太陽の潮汐だけのときの滑りの向き | ${ph.tideTowardRes ? '共鳴へ近づく向き' : '共鳴から離れる向き'} |`,
    ...ph.cross.map((c) => `| 太陽の潮汐 k₂/Q ${c.k2q} だけで滑りを渡る時間 [年] | ${fe(c.crossYr)} |`)].join('\n');
  T.t2Lib = ['| (B − A)/C | 復元 K [N·m] | 秤動の振動数 ω_lib [rad/s] | 滑り ÷ ω_lib | 秤動の幅の内 | 秤動の周期 [年] |', '|---|---|---|---|---|---|',
    ...T2.readings.map((r) => `| ${fe(r.bac)}${r.needed ? '(読み A に要る —— 境目)' : ''} | ${fe(r.K)} | ${fe(r.omegaLib)} | ${f2(r.slipOverLib)} | ${r.needed ? '境目' : tf(r.inside)} | ${fe(r.libPeriodYr)} |`)].join('\n');
  T.t2Rulers = ['| (B − A)/C | k₂/Q(太陽の潮汐) | 保つ力 K [N·m] | 入る減衰の大きさ N_st [N·m] | N_st ÷ K | 減衰 Γ′(無次元) |', '|---|---|---|---|---|---|',
    ...T2.rulers2.map((r) => `| ${fe(r.bac)} | ${r.k2q} | ${fe(r.K)} | ${fe(r.Nst)} | ${fe(r.NstOverK)} | ${fe(r.Gprime)} |`)].join('\n');
  T.t2Eps = ['| 第338便b の列 | 根の種類 | f | 軸に平行 ÷ 尺度 | 軸に垂直 ÷ 尺度 | ε_∥(÷ 太陽の項) | ε_⊥ | ε 全部 |', '|---|---|---|---|---|---|---|---|',
    ...T2.eps.map((e) => `| ${e.col} | ${e.kind === 'zeroNode' ? '零点合わせ' : '有限の 2 項の拮抗'} | ${fe(e.f)} | ${f3(e.alongRel)} | ${f3(e.perpRel)} | ${fe(e.epsAlong)} | ${f3(e.epsPerp)} | ${f3(e.epsTot)} |`)].join('\n');
  T.t2Joint = ['| (B − A)/C | k₂/Q | 帯 | 同じ向きの ε の上限 | 逆向きの ε の窓 | ε_∥(歳差と読む)同じ向き | 逆向き | ε 全部 同じ向き | 逆向き | 地球磁場(双極子の上限)÷ K |', '|---|---|---|---|---|---|---|---|---|---|',
    ...T2.joint.map((r) => `| ${fe(r.bac)} | ${r.k2q} | ${r.band === 'lo' ? '下端' : '上端'} | ${fe(r.epsSameMax)} | ${fe(r.epsOppLo)}〜${fe(r.epsOppHi)} | ${tf(r.alongSame)} | ${tf(r.alongOpp)} | ${tf(r.totSame)} | ${tf(r.totOpp)} | ${fe(r.magOverK)} |`)].join('\n');
  T.t2Need = ['| k₂/Q | 帯 | 要る (B − A)/C: ε_∥ 同じ向き | ε_∥ 逆向き | ε 全部 同じ向き | ε 全部 逆向き | 読み A(秤動の幅の内)に要る |', '|---|---|---|---|---|---|---|',
    ...T2.need.map((n) => `| ${n.k2q} | ${n.band === 'lo' ? '下端' : '上端'} | ${fe(n.alongSame)} | ${fe(n.alongOpp)} | ${fe(n.totSame)} | ${fe(n.totOpp)} | ${fe(T2.bacNeed)} |`)].join('\n');
  return T;
}

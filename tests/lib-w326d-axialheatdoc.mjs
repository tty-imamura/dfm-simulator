// 第326便d(原仮定者の指示(第128報)・統括の検証項目 R293): **軸引きずりの帳簿の正本 tests/out/axialheat-w326d.json から PHYSICS〔第326便d〕の表を作る文書の lib**
// (QA docs.axialHeat326d が節の表と逐語で照合する —— 表の数は有効数字 4 桁・丸めの程度の数〔閉じの残差など〕は「< 1e-12」の形で書き、数そのものは載せない)。
export const DOC_VERSION = 'w326d-axialheatdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toExponential(3));
const fp = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
const lt = (x, t = 1e-12) => (Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0).replace('e-', 'e-') : '**' + fe(x) + '**');
const tf = (x) => (x === true ? '真' : x === false ? '偽' : '—');
const NAME = { sun: '太陽', venus: '金星', earth: '地球', moon: '月', jupiter: '木星', io: 'イオ', saturn: '土星', titan: 'タイタン' };
const KIND = { gal: '銀河', k1: 'K1', tide: '潮汐' };
const portName = (q) => (q.kind === 'gal' ? '銀河(ĝ)' : (KIND[q.kind] + '(' + NAME[q.src] + ')'));
const boundText = (b) => {
  if (!b) return '—';
  if (b.kind === 'all') return 'どの p でも入る';
  if (b.kind === 'none') return 'どの p でも入らない';
  if (b.kind === 'le') return 'p ≤ ' + fp(b.p);
  if (b.kind === 'ge') return 'p ≥ ' + fp(b.p);
  return '—';
};
export function tablesOf(J) {
  const B = J.inputs.bodies, T = {};
  // 表 1 入力
  {
    const tideOf = (k) => Object.entries(J.inputs.tides).filter(([q]) => q.startsWith(k + ':')).map(([q, v]) => NAME[q.split(':')[1]] + ' ' + fe(v.along)).join('・') || '—';
    const rows = ['sun', 'venus', 'jupiter', 'io', 'earth', 'saturn'].map((k) => `| ${NAME[k]} | ${fe(B[k].s)} | ${fp(B[k].gDotA)} | ${fe(B[k].Rd)} | ${fe(B[k].I)}(${B[k].moi}) | ${tideOf(k)} |`);
    T.inputs = ['| 天体 | 符号つきの自転 s [rad/s] | ĝ·â | R_d [m](規則 Y_k m) | 受け手の I [kg m²](慣性係数) | 潮汐の目標 n·â [rad/s](起潮天体) |', '|---|---|---|---|---|---|'].concat(rows).join('\n');
  }
  // 表 2 K1 の源ごとの軸の ω(軸の向き)
  {
    const rows = ['venus:sun', 'jupiter:sun', 'io:sun', 'io:jupiter', 'earth:sun', 'saturn:sun'].map((k) => {
      const [r, s] = k.split(':'), a = J.k1.now.omega[k].along, b = J.k1.J.omega[k].along;
      return `| ${NAME[r]} ← ${NAME[s]} | ${fe(a)} | ${fe(b)} | ${fe(Math.abs(a) / Math.abs(B[r].s))} |`;
    });
    T.k1 = ['| 受け手 ← 源 | 今の K1(R_src = R_d)の ω·â [rad/s] | R_src = J(太陽 f 0.07・木星 0.254)の ω·â [rad/s] | 今の abs(ω·â)/abs(s) |', '|---|---|---|---|'].concat(rows).join('\n');
  }
  // 表 3 解(族 E —— p の格子)
  {
    const rows = J.solve.now.grid.map((q) => `| ${q.p} | ${fe(q.k.venus)} | ${fe(q.k.jupiter)} | ${fe(q.k.io)} | ${q.rejected.length ? q.rejected.map((z) => NAME[z]).join('・') : '無し'} |`);
    T.grid = ['| p | k_金星 | k_木星 | k_イオ | 不採用(k < 0 —— 負の散逸) |', '|---|---|---|---|---|'].concat(rows).join('\n');
  }
  // 表 4 p の端
  {
    const E = J.solve.now.edges, C = J.checks;
    const rows = ['venus', 'jupiter', 'io'].map((k) => `| ${NAME[k]} | ${boundText(E[k].hull)} | ${E[k].familyE.kind === 'none' ? 'どの p でも k < 0' : boundText(E[k].familyE)} |`)
      .concat(Object.keys(C).map((k) => `| ${NAME[k]}(検査) | ${boundText(C[k].hullBound)} | 格子で k ≥ 0: ${C[k].grid.filter((q) => !q.rejected).map((q) => q.p).join('・') || '無し'} |`));
    T.edges = ['| 天体 | Γ に依らない(凸包) | 族 E(k ≥ 0) |', '|---|---|---|'].concat(rows).join('\n');
  }
  // 表 5 ランク
  {
    const R = J.solve.now.ranks, F = J.controls.freeVector;
    T.rank = ['| 系 | 未知 | ランク | 条件数 |', '|---|---|---|---|',
      `| 族 E・p を固定(p = ${R.p}) | A・k_金星・k_木星・k_イオ | ${R.fixedP.rank}/${R.fixedP.cols} | ${fp(R.fixedP.cond)}(列を揃えた) |`,
      `| 族 E・p も未知 | A・k_金星・k_木星・k_イオ・p | ${R.withP.rank}/${R.withP.cols} | —(1 つの族) |`,
      `| 否定対照: 自由なベクトルの銀河場(潮汐 0) | ν_G の 3 成分(太陽・金星・木星の式) | ${F.rank}/3 | ${fp(F.cond)}(軸の幾何 —— 軸の広がり ${fp(F.axesSpreadDeg)}°) |`,
      '| 応答の絶対の尺度 | 全 Γ の倍率 λ | 同定できない(λ = 2 で A・k は同じ・熱は 2 倍) | — |'].join('\n');
  }
  // 表 6 熱の表
  {
    const H = J.heat, rows = [];
    for (const R of H.rows) {
      // 軸の向きのトルクが口の大きさ Γ(abs(ν) + abs(s)) の 1e-12 より小さい口(太陽の 1 つの口 —— 釣り合いの丸め)は数を載せない
      for (const q of R.ports) rows.push(`| ${NAME[R.key]} | ${portName(q)} | ${fe(q.nuAlong)} | ${Math.abs(q.torqueAlong) <= 1e-12 * Math.abs(q.Gamma) * (q.nuNorm + Math.abs(R.s)) ? '≈ 0(釣り合いの丸め)' : fe(q.torqueAlong)} | ${fe(q.heat)} | ${fe(q.supply)} |`);
      rows.push(`| ${NAME[R.key]} | **計** | s = ${fe(R.s)} | 和 ${lt(R.alongRel)}(相対) | **${fe(R.heat)}** | — |`);
    }
    T.heat = ['| 天体 | 口 | 目標 ν·â [rad/s] | 軸の向きのトルク N∥ τ_0 [kg m² s⁻¹] | 熱 Q τ_0 [J] | 供給 N·ν τ_0 [J] |', '|---|---|---|---|---|---|'].concat(rows).join('\n');
  }
  // 表 7 帳簿
  {
    const D = J.heat.ledger, H = J.heat;
    T.ledger = ['| 帳簿(p = ' + H.pHeat + '・太陽–木星–イオ・族 E) | 値 [J](× 1/τ_0 で W) |', '|---|---|',
      `| 銀河の中心からの供給 P_G τ_0(固定の外部の口座) | ${fe(D.galaxySupply)} |`,
      `| 潮汐の軌道の仕事 P_orb τ_0(負は軌道へ渡る分 —— 固定の軌道の口座) | ${fe(D.orbitWork)} |`,
      `| K1 の口の仕事(源の自転の口座 → 受け手 —— 移し替え) | ${fe(D.k1Draw)} |`,
      `| 熱 Σ Q τ_0(口ごとの和) | ${fe(D.heat)} |`,
      `| 背景への放射 L_rad τ_0(= 熱 —— 採用した境界の条件) | ${fe(D.radiation)} |`,
      `| 閉じ (P_G + P_orb − Σ Q)/max | ${lt(D.residualRel)} |`,
      `| K1 の口の仕事 − 源の反作用の仕事(相対) | ${lt(D.k1TransferRel)} |`,
      `| L の総和(天体のスピン + 銀河の中心 + 軌道 + 遠方の枠)/最大のトルク | ${lt(D.LTotalRel)} |`,
      `| 固定軸の支えの仕事/熱(天体ごとの最大) | ${lt(H.holdWorkMaxRel)} |`,
      `| 全 Γ を ${H.scale.lambda} 倍: 熱の比・軸の向きの残差 | ${fp(H.scale.heatRatio)}・${lt(H.scale.alongMaxRel)} |`].join('\n');
  }
  // 表 8 金星
  {
    const V = J.venus.now, VJ = J.venus.J, W = V.window, WJ = VJ.window;
    T.venus = ['| 金星 | 今の K1(R_src = R_d) | R_src = J |', '|---|---|---|',
      `| 族 E の k(p = ${V.pHeat}) | ${fe(V.kRejected)}(不採用) | ${fe(VJ.kRejected)}(不採用) |`,
      `| Γ に依らない —— 太陽の K1 の項に要る倍率の下限 s/(ν_☉·â) | ${fe(V.lambdaHullMin)} | ${fe(VJ.lambdaHullMin)} |`,
      `| 族 E で λ の区間が在る p | p ≥ ${fp(V.lambdaPEdge && V.lambdaPEdge.p)} | p ≥ ${fp(VJ.lambdaPEdge && VJ.lambdaPEdge.p)} |`,
      `| 木星と同じ p に入る窓(族 E) | ${W ? '[' + fp(W.lo) + ', ' + fp(W.hi) + ']' : '無し'} | ${WJ ? '[' + fp(WJ.lo) + ', ' + fp(WJ.hi) + ']' : '無し'} |`,
      `| 窓の中点の λ(区間の幾何平均) | ${W ? fe(W.lambda) : '—'} | ${WJ ? fe(WJ.lambda) : '—'} |`,
      `| 同じ λ を太陽の全部の K1 の口に掛けた 4 天体(族 E) | ${W ? (W.allSunPorts.accepted ? '全部 k ≥ 0' : '不採用 ' + W.allSunPorts.rejected.map((z) => NAME[z]).join('・')) : '—'} | ${WJ ? (WJ.allSunPorts.accepted ? '全部 k ≥ 0' : '不採用 ' + WJ.allSunPorts.rejected.map((z) => NAME[z]).join('・')) : '—'} |`].join('\n');
    const C = V.conditional, rows = C ? C.rows[0].ports.map((q) => `| ${portName(q)} | ${fe(q.nuAlong)} | ${fe(q.torqueAlong)} | ${fe(q.heat)} |`) : [];
    T.venusCond = ['| 金星の条件つきの写し(p = ' + (C ? C.p : '—') + '・λ = ' + (C ? fe(C.lambda) : '—') + ' —— 採らない) | 目標 ν·â [rad/s] | N∥ τ_0 [kg m² s⁻¹] | Q τ_0 [J] |', '|---|---|---|---|']
      .concat(rows, C ? [`| **計**(k = ${fe(C.k)}) | s = ${fe(C.rows[0].s)} | 和 ${lt(C.netAlongRel)}(相対)・abs の和 ${fe(C.sumAbsAlong)} | **${fe(C.rows[0].heat)}** |`] : []).join('\n');
  }
  // 表 9 検査
  {
    const C = J.checks, H = J.heat;
    T.checks = ['| 検査(合わせない) | 符号つきの自転 s [rad/s] | 凸包の p の端 | 族 E の k(p = ' + H.pHeat + ') |', '|---|---|---|---|']
      .concat(Object.keys(C).map((k) => `| ${NAME[k]} | ${fe(C[k].s)} | ${boundText(C[k].hullBound)} | ${fe(C[k].kAtPHeat)}${C[k].acceptedAtPHeat ? '' : '(不採用)'} |`)).join('\n');
  }
  // 表 10 否定対照
  {
    const N = J.controls, F = N.freeVector;
    T.controls = ['| 否定対照(統括の参考の試作の型を今のコードで書き直した) | 結果 |', '|---|---|',
      `| 恒等の伝達(K1 の口の目標を源の自転のベクトルそのものに・族 E・p = 0) | k_金星 ${fe(N.identity.k.venus)}・k_木星 ${fe(N.identity.k.jupiter)}・k_イオ ${fe(N.identity.k.io)} —— 不採用 ${N.identity.rejected.map((z) => NAME[z]).join('・')} |`,
      `| 自由なベクトルの銀河場(潮汐 0・太陽・金星・木星の 3 式) | abs(ν_G) ${fe(F.norm)} rad/s(太陽の自転の ${fe(F.overOmSun)} 倍)・ĝ との角 ${fp(F.angleToGDeg)}°・イオの式の残差 ${fe(F.ioResidualRel)}(相対)—— 4 天体の定常ではない |`,
      `| 応答の尺度(全 Γ を ${N.scale.lambda} 倍・p = 0) | A と k の相対の差 ${lt(N.scale.ARel)}・${lt(N.scale.kRelMax)}・熱の比 ${fp(N.scale.heatRatio)} |`].join('\n');
  }
  // 表 11 半径
  {
    const R = J.radius, r = Object.fromEntries(R.rows.map((q) => [q.key, q]));
    T.radius = ['| 場合 | 宣言(🗺️ の写し) | 結果 |', '|---|---|---|',
      `| R1 | 源の R_src を太陽だけ(invSq.sourceMoment {kind:"J", f:{0: 0.07}}) | R_src ${fe(r.R1.RsrcSun)} m・R_d ${fe(r.R1.RdSun)} m・(R_src/R_d)² ${fe(r.R1.momentFactor)}・受け手の β と R_d は同じビット ${tf(r.R1.betaRdSame)}・金星 ← 太陽の ω の比 = (R_src/R_d)²(相対 ${lt(r.R1.venusRatioRel, 1e-5)} —— 受け手の体積の節点の和の丸めの床)・イオ ← 木星は同じビット ${tf(r.R1.ioFromJupiterSame)} |`,
      `| R2 | 源の R_src を木星だけ(f:{6: 0.254}) | (R_src/R_d)² ${fe(r.R2.momentFactor)}・β と R_d は同じビット ${tf(r.R2.betaRdSame)}・イオ ← 木星の比 = (R_src/R_d)²(相対 ${lt(r.R2.ioRatioRel, 1e-5)})・金星 ← 太陽は同じビット ${tf(r.R2.venusFromSunSame)} |`,
      `| R3 | 受け手の R_d を金星だけ 2 倍(bodies[2].dragCore {massFrac:1, radius}) + 太陽の R_src | 金星の R_d の比 ${r.R3.venusRdRatio}・太陽の R_src は R1 と同じビット ${tf(r.R3.sunRsrcSameAsR1)}・他の受け手の R_d は同じビット ${tf(r.R3.otherRdSame)} |`,
      `| R4 | 同じ天体(金星)に明示の R_d(dragCore)と R_src(f)の両方 | 受理器が拒否(f は規則の R_d = Y_k m の天体だけ —— 今は欠けている組) |`,
      `| R5 | 源の観測の J(sourceMoment {kind:"obsSpin"}・bodies[0].obsSpin {fSrc 0.07, rObs}) | R_src = rObs√(5 fSrc/2)(相対 ${lt(r.R5.RsrcRel)})・β と R_d は同じビット ${tf(r.R5.betaRdSame)} |`,
      `| 画面 | 選択粒子の編集 | dragCore の欄の R_d(${R.ui.rdInput ? '有り' : '無し'})・R_src の欄 ${R.ui.srcInputs.length ? R.ui.srcInputs.join(',') : '無し'} |`].join('\n');
  }
  return T;
}

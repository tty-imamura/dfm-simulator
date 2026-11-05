// 第327便f(原仮定者の指示(2026-11-05)「金星の逆行自転は、大気熱潮汐の影響と、地球との共鳴を採用する」「R_dはK1で固定し、観測の自転もトルクの釣り合いで進める」・
//   統括の検証項目 R300): **正本 tests/out/venustide-w327f.json から PHYSICS〔第327便f〕の表を作る文書の lib**
// (QA docs.venusTide327f が節の表と逐語で照合する —— 表の数は有効数字 4 桁〔周期と比は桁を足す〕・丸めの程度の数〔閉じの残差など〕は「< 1e-12」の形で書き、数そのものは載せない)。
export const DOC_VERSION = 'w327f-venustidedoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toExponential(3));
const fx = (x, d) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(d));
const lt = (x, t = 1e-12) => (Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : '**' + fe(x) + '**');
const NAME = { sun: '太陽', venus: '金星', mars: '火星', earth: '地球', moon: '月' };
const SFORM = { constQ: '一定の Q', constLag: '一定の時間の遅れ' };
const TFORM = (k) => (k === 'constPhase' ? '一定の位相' : '熱の緩和 ω_0/σ_obs = ' + k.split(':')[1]);
const BR = { retro: '逆行', sync: '同期', slowPro: '順行(同期より遅い)', fastPro: '順行(同期より速い)' };
const CLS = { balanced: '釣り合い(解いた点)', locked: '共鳴で固定', nearStable: '近い安定な点', slow: '釣り合いではない(変化は年齢より遅い)', fast: '釣り合いではない(年齢の内に変わる)' };
const TAU = (k) => (k === 'inf' ? '∞(古典の極限)' : (k === 'age' ? '年齢 4.57 Gyr' : k + ' s'));
const stab = (z) => (z.stable ? '安定' : '不安定');
/** 解の枝の短い列(根ごとに「枝 周期 d(安定)」) */
const rootsCell = (r) => {
  if (r.neutral) return '中立(全部の自転でトルク 0 —— 縮退)';
  const parts = r.roots.map((z) => `${BR[z.branch]} ${fx(z.days, 1)} d(${stab(z)})${z.obs ? '★' : ''}`);
  if (r.tangent) parts.push('観測の自転は接する点(重根 —— 安定の境)★');
  return parts.join('・') || '無し';
};
export function tablesOf(J) {
  const T = {}, O = J.observed, VB = J.venusBase, V = J.venus, B = J.branches, R = J.resonance, ML = J.frozen, H = J.ledger, D = J.decl;
  // 表 1 観測の周期(宣言の値と本の状態)
  {
    const d = O.declared, b = O.book;
    T.periods = ['| 量 | 宣言の観測の周期(文献の値) | 本の状態(🗺️ の J2000 の転記・接触の二体) |', '|---|---|---|',
      `| 自転の周期(恒星に対して)[d] | ${fx(D.obs.venusSpinDays, 3)} | ${fx(b.spinDays, 3)} |`,
      `| 公転の周期 [d] | ${fx(D.obs.venusOrbitDays, 3)} | ${fx(b.orbitDays, 3)} |`,
      `| 自転比 k = T_orb/T_rot(本は軌道の法線への射影) | ${fx(d.k, 4)} | ${fx(b.k, 4)} |`,
      `| 1 公転に太陽を向く回数 N = 1 − k | ${fx(d.Nsun, 4)} | — |`,
      `| 太陽日 [d] | ${fx(d.solarDays, 3)} | ${fx(b.solarDays, 3)} |`,
      `| 地球の公転の周期 [d] | ${fx(D.obs.earthOrbitDays, 3)} | ${fx(b.earthOrbitDays, 3)} |`,
      `| 地球との会合周期 S [d] | ${fx(d.synodicDays, 3)} | ${fx(b.synodicDays, 3)} |`,
      `| S/太陽日 | ${fx(d.ratio, 4)} | ${fx(b.ratio, 4)} |`,
      `| 内合の間の自転(恒星に対して)・地球の公転・地球の方向に対する自転 [回] | ${fx(d.turnsSpin, 4)}・${fx(d.turnsEarth, 4)}・${fx(d.turnsRelEarth, 4)} | — |`,
      `| 厳密な 5:−4 の自転の周期 2π/(5n_⊕ − 4n_♀) [d] | ${fx(d.resDays, 3)} | ${fx(R.book.resDays, 3)} |`,
      `| 観測の自転 − 厳密な共鳴の自転 [rad/s] | ${fe(d.offset)} | ${fe(R.book.offset)} |`,
      `| 自転軸と軌道の法線の角(赤道傾斜)[°] | ${fx(D.obs.venusObliquityDeg, 2)} | ${fx(b.obliquityDeg, 2)} |`].join('\n');
  }
  // 表 2 金星の銀河と K1 の口(族 E・族 S —— 源 J・観測の自転での軸の向きのトルク × τ_0)と τ_0 の閾(Q 30)
  {
    const thr = (fam, p) => V.thresholds.find((q) => q.src === 'J' && q.fam === fam && q.p === p && q.Q === 30), g = (fam, p) => VB.gk.J[fam][p];
    const rows = D.pGrid.map((p) => { const e = g('E', p), s = g('S', p), te = thr('E', p), ts = thr('S', p);
      return `| ${p} | ${fe(e.galTarget)} | ${fe(e.galTau)} | ${fe(e.k1Tau)} | ${fe(e.gkTau)} | ${fe(te.tauCross)} | ${fe(te.tauLitHi)} | ${fe(te.epsAge)} | ${fe(s.gkTau)} | ${fe(ts.epsAge)} |`; });
    T.gk = ['| p | 銀河の口の目標 ν·â [rad/s] | 族 E 銀河の口 × τ_0 [N·m·s] | 族 E K1(太陽)の口 × τ_0 | 族 E 計 × τ_0 | τ_×(計 = 固体の潮汐)[s] | τ_lit(文献の桁の上の端で足りる最小)[s] | 族 E ε(τ_0 = 年齢) | 族 S 計 × τ_0 | 族 S ε(τ_0 = 年齢) |',
      '|---|---|---|---|---|---|---|---|---|---|'].concat(rows).join('\n');
  }
  // 表 3 固体の潮汐と熱潮汐の振幅(古典の極限 τ_0 = ∞・χ = 0 —— 一定の位相の型)
  {
    const th = VB.thermal, rows = VB.solid.map((s) => { const r = V.rows.find((q) => q.src === 'J' && q.fam === 'E' && q.p === 0 && q.Q === s.Q && q.tau === 'inf' && q.chi === 0 && q.sForm === 'constQ' && q.tForm === 'constPhase');
      return `| ${s.Q} | ${fe(s.Xp)} | ${fe(s.NQ)} | ${fe(s.k2DtSec)} | ${fe(r.N0)} | ${fe(r.eps)} | ${fe(r.eps * th.ps)} | ${fe(r.N0 / th.litN0[1])} | ${fe(r.N0 / th.litN0[0])} |`; });
    T.amp = ['| Q(k2 = 0.295) | X′ = G M_☉² R⁵/a⁶ [N·m] | N_Q = (3/2)(k2/Q)X′ [N·m] | 一定の時間の遅れの型の k2 Δt [s] | 熱潮汐の振幅 N_0 [N·m] | ε | δp = ε p_s [Pa] | N_0/文献の桁の上の端 | N_0/文献の桁の下の端 |',
      '|---|---|---|---|---|---|---|---|---|'].concat(rows).join('\n');
    const ur = Object.entries(th.unit).map(([k, u]) => { const r = V.rows.find((q) => q.src === 'J' && q.fam === 'E' && q.p === 0 && q.Q === 30 && q.tau === 'inf' && q.chi === 0 && q.sForm === 'constQ' && q.tForm === k);
      return `| ${TFORM(k)} | ${u.omega0 === null ? '—' : fe(u.omega0)} | ${fx(u.F, 4)} | ${fe(r.N0)} | ${fe(r.eps)} |`; });
    T.shape = ['| 熱潮汐の型 | ω_0 [rad/s] | F(σ_obs) | N_0(Q 30・τ_0 = ∞)[N·m] | ε |', '|---|---|---|---|---|'].concat(ur).join('\n');
  }
  // 表 4 τ_0 による ε(族 E・源 J・Q 30・一定の Q と一定の位相・χ = 0)
  {
    const ps = [-0.75, -0.5, -0.25, 0, 1];
    const rows = J.inputs.taus.map((tk) => `| ${TAU(tk)} | ${ps.map((p) => { const r = V.rows.find((q) => q.src === 'J' && q.fam === 'E' && q.p === p && q.Q === 30 && q.tau === tk && q.chi === 0 && q.sForm === 'constQ' && q.tForm === 'constPhase'); return fe(r.eps); }).join(' | ')} |`);
    T.tau = ['| τ_0 | ε(p -0.75) | ε(p -0.5) | ε(p -0.25) | ε(p 0) | ε(p 1) |', '|---|---|---|---|---|---|'].concat(rows).join('\n');
  }
  // 表 5 地球との共鳴の口((B − A)/C の格子)
  {
    const rows = R.grid.map((g) => `| ${fe(g.BAoverC)}(文献の桁の ${g.mult} 倍) | ${fe(g.Nmax)} | ${fe(g.halfWidth)} | ${fe(g.offsetOverWidth)} |`);
    T.res = ['| (B − A)/C | N_max = (3/2) G M_⊕ (B − A) abs(Z) [N·m] | 固定の幅 sqrt(2 N_max/C) [rad/s] | 観測の差/固定の幅 |', '|---|---|---|---|'].concat(rows).join('\n');
  }
  // 表 6 要る大きさとの比(一定の Q と一定の位相 —— 源 J)
  {
    const rows = R.need.map((q) => `| ${q.fam} | ${q.p} | ${q.Q} | ${TAU(q.tau)} | ${fe(q.need)} | ${fe(q.chiMax)} | ${fe(q.BAforAll)} |`);
    T.need = ['| 族 | p | Q | τ_0 | 駆動の口に要るトルク abs(D) [N·m] | χ_max = N_max/abs(D)(文献の桁) | 共鳴だけで足りる (B − A)/C |', '|---|---|---|---|---|---|---|'].concat(rows).join('\n');
  }
  // 表 7 共鳴の割合 χ(族 E・源 J・Q 30・一定の Q と一定の位相)
  {
    const sel = [['inf', 0], ['age', 0], ['age', -0.75]], NmaxM = R.NmaxMain, rows = [];
    for (const [tk, p] of sel) for (const chi of D.shares) {
      const r = V.rows.find((q) => q.src === 'J' && q.fam === 'E' && q.p === p && q.Q === 30 && q.tau === tk && q.chi === chi && q.sForm === 'constQ' && q.tForm === 'constPhase');
      rows.push(`| ${TAU(tk)} | ${tk === 'inf' ? '—' : p} | ${chi} | ${fe(r.Nr)} | ${fe(r.N0)} | ${fe(r.eps)} | ${Math.abs(r.Nr) <= NmaxM ? '入る' : '超える(' + fe(Math.abs(r.Nr) / NmaxM) + ' 倍)'} |`);
    }
    T.share = ['| τ_0 | p | χ | 共鳴の口 N_r [N·m] | 熱潮汐の振幅 N_0 [N·m] | ε | abs(N_r) ≤ N_max(文献の桁) |', '|---|---|---|---|---|---|---|'].concat(rows).join('\n');
  }
  // 表 8・9 解の枝と安定(τ_0 = ∞ と 年齢・p 0 —— Q 30・振幅の比 0.5・0.9・1・1.1・2)
  {
    const pick = [0.5, 0.9, 1, 1.1, 2];
    const tab = (tk, p) => ['| 固体の型 | 熱潮汐の型 | ' + pick.map((x) => 'N_0/N_0,釣り合い = ' + x).join(' | ') + ' |', '|---|---|' + pick.map(() => '---').join('|') + '|']
      .concat(B.combos.filter((c) => c.tau === tk && c.p === p).map((c) => `| ${SFORM[c.sForm]} | ${TFORM(c.tForm)} | ${pick.map((x) => rootsCell(c.rows.find((r) => r.ratio === x))).join(' | ')} |`)).join('\n');
    T.branchInf = tab('inf', 0); T.branchAge = tab('age', 0);
  }
  // 表 10 観測の自転の点の安定と共鳴で固定できる振幅の窓
  {
    const obsCell = (c) => { const r = c.rows.find((z) => z.ratio === 1); if (r.neutral) return '中立(縮退)'; if (r.obsRoot) return stab(r.obsRoot); return r.tangent ? '接する(安定の境)' : '—'; };
    const keys = [...new Set(B.combos.map((c) => c.sForm + '|' + c.tForm))];
    const rows = keys.map((k) => { const [sf, tf] = k.split('|'), c = (tk, p) => B.combos.find((z) => z.sForm === sf && z.tForm === tf && z.tau === tk && z.p === p), ci = c('inf', 0);
      return `| ${SFORM[sf]} | ${TFORM(tf)} | ${obsCell(ci)} | ${obsCell(c('age', 0))} | ${obsCell(c('age', -0.75))} | ${fx(ci.lockWindow.ratioLo, 4)}〜${fx(ci.lockWindow.ratioHi, 4)} | ${fx(c('age', 0).lockWindow.ratioLo, 4)}〜${fx(c('age', 0).lockWindow.ratioHi, 4)} |`; });
    T.stability = ['| 固体の型 | 熱潮汐の型 | 観測の点 τ_0 = ∞ | 年齢・p 0 | 年齢・p -0.75 | 共鳴で固定できる N_0/N_0,釣り合い(∞) | 同(年齢・p 0) |', '|---|---|---|---|---|---|---|'].concat(rows).join('\n');
  }
  // 表 11 規則を固定した火星と地球–月(一定の Q と一定の位相の行・判定の数は全部の型)
  {
    const rows = [];
    const cnt = (list) => { const c = {}; for (const z of list) c[z] = (c[z] || 0) + 1; return Object.entries(c).map(([k, v]) => CLS[k] + ' ' + v).join('・'); };
    for (const [tk, p] of [['inf', 0], ['age', 0], ['age', -0.75]]) {
      const mm = ML.mars.filter((q) => q.tau === tk && q.p === p), m0 = mm.find((q) => q.sForm === 'constQ' && q.tForm === 'constPhase');
      const ee = ML.triEM.filter((q) => q.tau === tk && q.p === p), e0 = ee.find((q) => q.sForm === 'constQ' && q.tForm === 'constPhase');
      const row = (nm, q, z, list) => `| ${nm} | ${TAU(tk)}${tk === 'inf' ? '' : '・p ' + p} | ${fe(q.eps)} | ${fe(q.N0)} | ${fe(z.Nnet)} | ${fe(z.tChangeOverAge)} | ${z.nearest ? fx(z.nearest.ratio, 4) : '—'} | ${CLS[z.cls]} | ${cnt(list)} |`;
      rows.push(row('太陽–火星(火星)', m0, m0.mars, mm.map((q) => q.mars.cls)), row('太陽–地球–月(地球)', e0, e0.earth, ee.map((q) => q.earth.cls)), row('太陽–地球–月(月)', e0, e0.moon, ee.map((q) => q.moon.cls)));
    }
    T.frozen = ['| 系(受け手) | τ_0 | ε(金星から固定) | 熱潮汐の振幅 N_0 [N·m] | 観測の自転での正味の軸の向きのトルク [N·m] | 変化の時間/年齢 | 近い安定な釣り合いの点 s/s_obs | 判定(一定の Q・一定の位相) | 判定の数(全部の型 22) |',
      '|---|---|---|---|---|---|---|---|---|'].concat(rows).join('\n');
    const rr = ['mars', 'earth', 'moon'].map((k) => { const q = ML.res[k]; return `| ${NAME[k]} ← ${NAME[q.partner]} | ${q.order} | ${fe(q.BAoverC)} | ${fe(q.absZ)} | ${fe(q.Nmax)} | ${fe(q.halfWidth)} | ${fe(Math.abs(q.offset) / q.halfWidth)} |`; });
    T.neighbor = ['| 受け手 ← 相手 | 最も近い共鳴の次数 j | (B − A)/C(文献の桁) | abs(Z) [m⁻³] | N_max [N·m] | 固定の幅 [rad/s] | 観測の差/固定の幅 |', '|---|---|---|---|---|---|---|'].concat(rr).join('\n');
  }
  // 表 12 帳簿(金星 —— 一定の Q・一定の位相・Q 30・族 E・源 J)
  {
    const rows = H.rows.map((q) => `| ${TAU(q.tau)} | ${q.tau === 'inf' ? '—' : q.p} | ${q.chi} | ${fe(q.ledger.galaxySupply)} | ${fe(q.ledger.orbitWork)} | ${fe(q.ledger.resOrbitWork)} | ${fe(q.ledger.solarSupply)} | ${fe(q.ledger.heatSolid)} | ${fe(q.ledger.heat)} | ${lt(q.ledger.residualRel)} | ${lt(q.ledger.LTotalRel)} | ${lt(Math.max(q.ledger.portCloseMaxRel, q.ledger.k1TransferRel))} |`);
    T.ledger = ['| τ_0 | p | χ | P_G [W] | 軌道の仕事(太陽–金星)[W] | 軌道の仕事(地球–金星)[W] | 日射の供給 P_日射 [W] | 固体の潮汐の熱 [W] | Σ Q [W] | 帳簿の閉じ | L の閉じ | 口の閉じ・移し替え |',
      '|---|---|---|---|---|---|---|---|---|---|---|---|'].concat(rows).join('\n');
    const KIND = { gal: '銀河(ĝ)', k1: 'K1(太陽)', solid: '固体の潮汐(太陽)', thermal: '熱潮汐(太陽)', res: '地球との共鳴' };
    const h = H.rows.find((q) => q.tau === 'age' && q.p === 0 && q.chi === 0.25);
    T.ports = ['| 口(τ_0 = 年齢・p 0・χ 0.25) | 軸の向きのトルク [N·m] | 熱 [W] | 供給(銀河・K1 の口は N·ν・固体の潮汐と共鳴は軌道の仕事・熱潮汐は日射)[W] |', '|---|---|---|---|']
      .concat(h.ports.map((q) => `| ${KIND[q.kind]} | ${fe(q.torqueAlong)} | ${fe(q.heat)} | ${fe(q.supply)} |`)).join('\n');
  }
  return T;
}

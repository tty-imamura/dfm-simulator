// 第327便a(原仮定者の回答(2026-11-05 —— AN534・AN535・AN537)・統括の検証項目 R295): **正本 tests/out/axialsum-w327a.json から PHYSICS〔第327便a〕の表を作る文書の lib**
// (QA docs.axialSum327a が節の表と逐語で照合する —— 表の数は有効数字 4 桁・丸めの程度の数〔閉じの残差など〕は「< 1e-12」の形で書き、数そのものは載せない)。
export const DOC_VERSION = 'w327a-axialsumdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toExponential(3));
const fp = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(3));
const lt = (x, t = 1e-12) => (Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : '**' + fe(x) + '**');
const SATK = Object.keys({ saturn: 1 })[0];
const NAME = { sun: '太陽', venus: '金星', earth: '地球', moon: '月', jupiter: '木星', io: 'イオ', [SATK]: '土星', titan: 'タイタン' };
const PHASE = { stellar: '恒星', solid: '固体', fluidGiant: '気体の惑星' };
const KIND = { gal: '銀河', k1: 'K1', tide: '潮汐' };
const portName = (q) => (q.kind === 'gal' ? '銀河(ĝ)' : (KIND[q.kind] + '(' + NAME[q.src] + ')'));
const bt = (b) => {
  if (!b) return '—';
  if (b.kind === 'all') return 'どの p でも入る';
  if (b.kind === 'none') return 'どの p でも入らない';
  if (b.kind === 'le') return 'p ≤ ' + fp(b.p);
  if (b.kind === 'ge') return 'p ≥ ' + fp(b.p);
  return '—';
};
const rej = (list) => (list.length ? list.map((z) => NAME[z]).join('・') : '無し');
const CONV_JA = { q1mass: 'R_d に比例(q 1・p 0 —— 今のエンジンの型)', rdFree: 'R_d に依らない(q 0・p 0)', radiusOnly: '半径だけ(q 1・p 1)',
  q1mass_pMain: 'R_d に比例(q 1・p -0.75)', rdFree_pMain: 'R_d に依らない(q 0・p -0.75)', rdPow_pMain: '(R_d/R_d,☉)^p(q = p = -0.75)' };
const SRC_JA = { now: '今(R_src = R_d)', J: 'J(太陽 f 0.07)' };
export function tablesOf(J) {
  const T = {}, S = J.sum, V = J.venusRd, F = J.inputs.features;
  // 表 1 族 S の解(p の格子・源は今の K1)
  {
    const rows = S.families.now.S.map((q) => `| ${q.p} | ${fe(q.beta.venus)} | ${fe(q.beta.jupiter)} | ${fe(q.beta.io)} | ${fe(q.checks.earth.beta)} | ${fe(q.checks[SATK].beta)} | ${rej(q.rejected.concat(Object.entries(q.checks).filter(([, v]) => v.rejected).map(([k]) => k)))} |`);
    T.sumGrid = ['| p | β_金星 | β_木星 | β_イオ | β_地球(検査) | β_土星(検査) | 不採用(β < 0 —— 負の散逸) |', '|---|---|---|---|---|---|---|'].concat(rows).join('\n');
  }
  // 表 2 p の端
  {
    const rows = ['venus', 'jupiter', 'io', 'earth', SATK].map((k) => `| ${NAME[k]}${k === 'earth' || k === SATK ? '(検査)' : ''} | ${bt(S.edges[k].S)} | ${S.edges[k].E ? bt(S.edges[k].E) : '—'} | ${bt(S.edges[k].hull)} |`);
    T.edges = ['| 天体 | 族 S(和 —— Γ にも配分 w にも依らない) | 族 E(平均 —— 第326便d) | Γ に依らない凸包(第326便d の型) |', '|---|---|---|---|'].concat(rows).join('\n');
  }
  // 表 3 和と平均・細分・配分・尺度
  {
    const P = J.pure.scenes, al = S.allocSens.find((q) => q.p === J.decl.pMain);
    T.sumVsMean = ['| 場面 | 族 S(和) | 族 E(平均) |', '|---|---|---|',
      `| 同じ軸の 2 由来 1 と 2(潮汐なし)の定常 | ${P.sumVsMean.sum} | ${P.sumVsMean.mean} |`,
      `| 同じ大きさの 2 由来の 120° の合成の大きさ | ${fp(P.compose120.sumNorm)} | ${fp(P.compose120.meanNorm)} |`,
      `| 由来を 0.3 と 0.7 に細分(v と w を同じ比で)—— トルク・供給・熱の差(相対) | ${lt(Math.max(P.split.torque, P.split.supply, P.split.heat))} | — |`,
      `| 配分 w(銀河 0.9 / 0.1)で β の差(相対・p = ${J.decl.pMain}) | ${lt(Math.max(al.betaRelGal, al.betaRelK1))} | — |`,
      `| 配分 w(銀河 0.9 / 0.1)で熱の比(均等に対して・p = ${J.decl.pMain}) | ${fp(al.heatRatioGal)} / ${fp(al.heatRatioK1)} | — |`,
      `| 太陽の式の A [rad/s] | ${fe(S.sunA.S)} | ${fe(S.sunA.E)} |`].join('\n');
  }
  // 表 4 金星の R_d の格子(代表の点)
  {
    const want = [J.inputs.venusK1Rd, 1, 1e3, 1e5, Math.pow(10, 5.5), 1e6, J.inputs.venusRobs, 1e8, 1e9, 1e10, 1e11];
    const pt = (src, R) => V.sources[src].points.find((q) => q.ok && q.Rd === R);
    const rows = want.map((R) => { const a = pt('now', R), b = pt('J', R), c = (k) => fe(b.cols[k + ':S'].beta);
      return `| ${fe(R)}${R === J.inputs.venusK1Rd ? '(K1 の規則)' : (R === J.inputs.venusRobs ? '(R_obs)' : (R === 1e11 ? '(重なりの手前 —— 求積が収束しない)' : ''))} | ${fe(a.vSunAlong)} | ${fe(b.vSunAlong)} | ${c('q1mass')} | ${c('rdFree')} | ${c('rdFree_pMain')} | ${c('rdPow_pMain')} |`; });
    T.venusGrid = ['| 金星の R_d [m] | 太陽の K1 の寄与 v·â 今 [rad/s] | 同 J [rad/s] | β_金星 族 S・J・R_d に比例(p 0) | 同 R_d に依らない(p 0) | 同 R_d に依らない(p -0.75) | 同 (R_d/R_d,☉)^p(p -0.75) |', '|---|---|---|---|---|---|---|'].concat(rows).join('\n');
  }
  // 表 5 根(規約 × 族 × 源)
  {
    const rows = [];
    for (const c of J.decl.conventions) for (const fam of ['S', 'E']) for (const src of ['now', 'J']) {
      const r = V.sources[src].roots[c.key + ':' + fam];
      rows.push(`| ${CONV_JA[c.key]} | ${fam} | ${SRC_JA[src]} | ${r.venusAcceptedPoints}/${r.points} | ${r.signChanges} | ${r.roots.length ? r.roots.map((z) => fe(z.Rd)).join('・') : '無し'} | ${r.allFourPoints}/${r.points} | ${r.jupiterAccepted && r.ioAccepted ? '入る' : '入らない'} | ${fe(r.lambdaNeedMin)}(R_d ${fe(r.lambdaNeedMinRd)}) |`);
    }
    T.roots = ['| 銀河の応答の規約 | 族 | 源 | β_金星 ≥ 0 の点 | 符号の変化 | 根(β_金星 = 0) | 4 天体とも ≥ 0 の点 | 木星・イオ | 太陽の K1 の項に要る倍率の最小(採らない) |', '|---|---|---|---|---|---|---|---|---|'].concat(rows).join('\n');
  }
  // 表 6 評価域・頭打ち・求積
  {
    const rows = ['now', 'J'].map((src) => { const s = V.sources[src], od = (R) => { const q = V.orders.find((z) => z.src === src && z.Rd === R); return q ? lt(q.spreadRel) : '—'; };
      const rIn = Math.max(...s.points.filter((q) => q.ok).map((q) => q.Rd));
      return `| ${SRC_JA[src]} | ${fe(s.Rsrc)} | ${fe(s.overlapEdge.lo)}(太陽–金星の距離 ${fe(s.dSunVenus)}) | ${fe(s.maxAbsVSun)}(R_d ${fe(s.maxAtRd)}) | ${fe(s.satEstimate)} | ${fe(s.RdCross)} | ${fe(s.shortfallNoGalaxy)} | ${od(J.inputs.venusRobs)}・${od(1e10)}・${od(rIn)} |`; });
    T.domain = ['| 源 | R_src [m] | 重なりの境界の R_d [m](評価域の外の始まり) | 太陽の K1 の寄与の abs の最大 [rad/s] | 比の型の頭打ちの見積り s_☉ R_src²/(5 d²) | 自己の場と源の場の交わる R_d* = 1.2 d m_金星/m_☉ [m] | abs(s_金星)/最大(銀河の寄与 0 でも要る倍率) | 求積の次数 8・12・16 の差(R_obs・1e10・評価域の最後の点) |', '|---|---|---|---|---|---|---|---|'].concat(rows).join('\n');
  }
  // 表 7 比べる表(K1 の R_d・観測半径・密度)
  {
    const rows = ['sun', 'venus', 'earth', 'jupiter', 'io', SATK].map((k) => `| ${NAME[k]} | ${PHASE[F[k].phase]} | ${fp(F[k].rho / 1000)} | ${fe(F[k].Rd)} | ${fe(F[k].R)} | ${fe(F[k].R / F[k].Rd)} |`);
    T.compare = ['| 天体 | 相 | 密度 [g/cm³](本の m と R から) | K1 の規則の R_d = Y_k m [m] | 観測半径 R_obs [m] | R_obs/R_d |', '|---|---|---|---|---|---|'].concat(rows).join('\n');
  }
  // 表 8 固体の R_d の規則(源 J)
  {
    const rows = J.solidRule.filter((q) => q.src === 'J').map((q) => { const c = (k) => `${fe(q.cols[k + ':S'].beta)}${q.cols[k + ':S'].rejected ? '(不採用)' : ''}`;
      return `| ${NAME[q.key]}(${q.role}) | ${q.rule === 'k1' ? 'K1 の規則 Y_k m' : '観測半径 R_obs'} | ${fe(q.Rd)} | ${fe(q.vSunAlong)} | ${c('q1mass')} | ${c('rdFree')} | ${c('rdFree_pMain')} | ${c('rdPow_pMain')} |`; });
    T.solid = ['| 天体 | 固体の R_d の規則(走行の前の宣言) | R_d [m] | 太陽の K1 の寄与 v·â(J)[rad/s] | β 族 S・R_d に比例(p 0) | 同 R_d に依らない(p 0) | 同 R_d に依らない(p -0.75) | 同 (R_d/R_d,☉)^p(p -0.75) |', '|---|---|---|---|---|---|---|---|'].concat(rows).join('\n');
  }
  // 表 9 潮汐の自由な係数と法則を探す表(p = pMain)
  {
    const fs = J.tide.free.S.find((q) => q.p === J.decl.pMain), fE = J.tide.free.E.find((q) => q.p === J.decl.pMain);
    const rows = ['venus', 'jupiter', 'io', 'earth', SATK].map((k) => { const b = F[k];
      return `| ${NAME[k]} | ${PHASE[b.phase]} | ${NAME[b.dominant]} | ${fe(b.aDominant)} | ${fp(b.rho / 1000)} | ${fe(b.Xsum)} | ${fe(fs.beta[k])}${fs.rejected.includes(k) ? '(不採用)' : ''} | ${fe(fE.beta[k])}${fE.rejected.includes(k) ? '(不採用)' : ''} | ${b.k2Q === null ? '—' : fe(b.k2Q)} |`; });
    T.tideFree = [`| 天体 | 相 | 主な起潮天体 | 軌道長半径 a [m] | 密度 [g/cm³] | 古典の尺度 X = Σ G M² R⁵/(a⁶ I) [s⁻²] | β(族 S・p = ${J.decl.pMain}) | k(族 E・p = ${J.decl.pMain}) | 文献の k2/Q(比べる列) |`, '|---|---|---|---|---|---|---|---|---|'].concat(rows).join('\n');
  }
  // 表 10 法則の段と予言の段
  {
    const LAWJA = { const: 'y = 1(同じ係数)', classical: 'y = X(古典の尺度・α 1)', classicalPow: 'y = X^α' };
    const rows = [];
    for (const fam of ['S', 'E']) for (const x of J.tide.law[fam]) for (const [k, l] of Object.entries(x.laws)) {
      const pr = (key) => { const q = l.predictions.find((z) => z.key === key); return q ? fe(q.ratio) : '—'; };
      rows.push(`| ${fam} | ${x.p} | ${LAWJA[k]} | ${l.trainKeys.map((z) => NAME[z]).join('・')} | ${l.excluded.map((z) => NAME[z.key]).join('・') || '無し'} | ${fe(l.fit.C)} | ${l.fit.alpha === null || l.fit.alpha === undefined ? '—' : fp(l.fit.alpha)} | ${l.fit.dof === 0 ? '0(2 母数 —— 厳密に決まる)' : fp(l.fit.spreadLog10)} | ${pr('earth')} | ${pr(SATK)} |`);
    }
    T.law = ['| 族 | p | 法則 Γ_ij = Γ_i⁰ C y_ij | 学ぶ天体 | 除いた天体(負の振幅) | C | α | 学ぶ 2 天体の振幅の開き [桁] | 地球の予言 s_予言/s_観測 | 土星の予言 s_予言/s_観測 |', '|---|---|---|---|---|---|---|---|---|---|'].concat(rows).join('\n');
  }
  // 表 10b 古典の尺度の 1 つの C が木星とイオで同じになる p と予言
  {
    const rows = ['S', 'E'].map((fam) => { const x = J.tide.pStar[fam], pr = (key) => { const q = x.predictions.find((z) => z.key === key); return q ? fe(q.ratio) : '—'; };
      return `| ${fam} | ${fp(x.p)} | ${fe(x.C)} | ${fp(x.gapAtMain)}・${fp(x.gapAtMinus1)} | ${fe(x.venusAmplitude)}(不採用) | ${pr('earth')} | ${pr(SATK)} |`; });
    T.pStar = [`| 族 | 木星とイオの古典の振幅が等しい p | C [s²] | p = ${J.decl.pMain}・-1 の開き [桁] | 金星の振幅 | 地球の予言 s_予言/s_観測 | 土星の予言 s_予言/s_観測 |`, '|---|---|---|---|---|---|---|'].concat(rows).join('\n');
  }
  // 表 11 文献の k2/Q と比べる(古典の尺度の振幅 / k2/Q —— 同じ則なら天体に依らない)
  {
    const cmp = J.tide.law.S.find((x) => x.p === J.decl.pMain).k2Qcompare, cmpE = J.tide.law.E.find((x) => x.p === J.decl.pMain).k2Qcompare;
    const rows = cmp.map((c, k) => `| ${NAME[c.key]} | ${c.k2Q === null ? '—' : fe(c.k2Q)} | ${fe(c.Cclassical)} | ${fe(c.CoverK2Q)} | ${fe(cmpE[k].CoverK2Q)} |`);
    T.k2Q = [`| 天体 | 文献の k2/Q | 古典の尺度の振幅 C_i(族 S・p = ${J.decl.pMain})[s²] | C_i/(k2/Q)(族 S) | C_i/(k2/Q)(族 E) |`, '|---|---|---|---|---|'].concat(rows).join('\n');
  }
  // 表 12 帳簿(候補ごと —— p = pMain)
  {
    const SETJA = { sji: '太陽–木星–イオ', five: '太陽–木星–イオ–地球–土星', venus: '太陽–金星' }, ALJA = { equal: '均等', galHeavy: '銀河 0.9', k1Heavy: '銀河 0.1' };
    const rows = J.ledger.candidates.map((c) => `| ${SETJA[c.set]} | ${c.family}${c.family === 'S' ? '(' + ALJA[c.alloc] + ')' : ''} | ${c.accepted ? '採る' : '不採用(' + rej(c.rejected) + ')'} | ${fe(c.ledger.galaxySupply)} | ${fe(c.ledger.orbitWork)} | ${fe(c.ledger.heat)} | ${lt(c.ledger.residualRel)} | ${lt(c.ledger.LTotalRel)} | ${lt(c.ledger.holdWorkMaxRel)} | ${fp(c.scale.heatRatio)} |`);
    T.ledger = [`| 系(p = ${J.ledger.p}) | 族(配分) | 採否 | 銀河の中心の供給 P_G τ_0 [J] | 軌道の仕事 P_orb τ_0 [J] | 熱 Σ Q τ_0 = 放射 [J] | 閉じ | L の総和 | 固定軸の支えの仕事/熱 | 全 Γ を 2 倍の熱の比 |`, '|---|---|---|---|---|---|---|---|---|---|'].concat(rows).join('\n');
  }
  // 表 13 口ごとの熱(族 S・均等・太陽–木星–イオ)
  {
    const c = J.ledger.candidates.find((z) => z.set === 'sji' && z.family === 'S' && z.alloc === 'equal'), rows = [];
    for (const R of c.table) {
      for (const q of R.ports) rows.push(`| ${NAME[R.key]} | ${portName(q)} | ${q.w === null ? '—' : fp(q.w)} | ${q.vAlong === null ? '—' : fe(q.vAlong)} | ${fe(q.nuAlong)} | ${R.ports.length === 1 ? '≈ 0(釣り合いの丸め)' : fe(q.torqueAlong)} | ${fe(q.heat)} | ${fe(q.supply)} |`);
      rows.push(`| ${NAME[R.key]} | **計** | — | — | s = ${fe(R.s)} | 和 ${lt(R.alongRel)}(相対) | **${fe(R.heat)}** | — |`);
    }
    T.ports = [`| 天体 | 口 | 配分 w | 寄与 v·â [rad/s] | 目標 ν·â = v·â/w [rad/s] | 軸の向きのトルク N∥ τ_0 [kg m² s⁻¹] | 熱 Q τ_0 [J] | 供給 N·ν τ_0 [J] |`, '|---|---|---|---|---|---|---|---|'].concat(rows).join('\n');
  }
  return T;
}

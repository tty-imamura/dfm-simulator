// 第327便e(原仮定者の指示(2026-11-05)「軸引きずりについて」・統括の検証項目 R299): **正本 tests/out/axialdiff-w327e.json から PHYSICS〔第327便e〕の表を作る文書の lib**
// (QA docs.axialDiff327e が節の表と逐語で照合する —— 表の数は有効数字 4 桁・丸めの程度の数〔閉じの残差など〕は「< 1e-12」の形で書き、数そのものは載せない)。
export const DOC_VERSION = 'w327e-axialdiffdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toExponential(3));
const lt = (x, t = 1e-12) => (Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : '**' + fe(x) + '**');
const NAME = { sun: '太陽', venus: '金星', mars: '火星', earth: '地球', moon: '月' };
const RULE = { obsRatio: '観測半径との比', rdRatio: 'K1 の R_d との比', absolute: '同じ長さ' };
const KIND = { gal: '銀河', k1: '軸(差分)', tide: '潮汐' };
const ok = (b) => (b ? '採る' : '不採用');
const rej = (list) => (list && list.length ? list.map((z) => NAME[z]).join('・') + 'が負' : '全部非負');
const f4 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : (Math.abs(x) < 1e-3 ? fe(x) : x.toFixed(4)));
const zeros = (c, flag) => { const z = c.roots.filter((r) => r.kind === 'zero'); return z.length ? z.map((r) => fe(r.R) + (flag && r.nearInsideSun ? '〔近い位置が太陽の観測半径の内〕' : '')).join('・') : '無し'; };
export function tablesOf(J) {
  const T = {}, K = J.kernel, V = J.venus, ML = J.marsEarth, D = J.decl, B = J.inputs.bodies;
  // 表 1 核の 2 つの型(太陽 → 金星の線の上・源 J)
  {
    const k = K.J, rows = k.points.map((q) => `| ${fe(q.R)}${q.R === B.venus.Rd ? '(K1 の R_d)' : (q.R === B.venus.R ? '(R_obs)' : (q.R === k.RdCross ? '(d m_金星/m_☉)' : ''))} | ${fe(q.gradAlong)} | ${fe(q.stencilAlong)} | ${fe(q.diffK1Along)} | ${f4(q.gradOverSatAlong)} | ${f4(q.DoverSat)} |`);
    T.kernel = ['| 別の半径 R [m] | 勾配の型(エンジンの K1・受け手の R_d = R の体積平均)v·â [rad/s] | 差分 diffStencil(2R で割る)v·â [rad/s] | 差分 diffK1(2R_d^K1 で割る)v·â [rad/s] | 勾配の型 / 見積り | diffStencil / 見積り |',
      '|---|---|---|---|---|---|'].concat(rows).join('\n');
  }
  // 表 2 金星の根(源 J・型 diffK1 と diffStencil・族 S と族 E・p の格子)
  {
    const s = V.sources.J, rows = D.pGrid.map((p) => { const cS = s.cols['diffK1:S:' + p], cE = s.cols['diffK1:E:' + p], dS = s.cols['diffStencil:S:' + p], dE = s.cols['diffStencil:E:' + p];
      return `| ${p} | ${fe(cS.vGalaxy)} | ${fe(cS.needSunAlong)} | ${zeros(cS, true)} | ${zeros(cE, true)} | ${dS.roots.length ? zeros(dS) : '無し(' + fe(dS.shortfall) + ' 倍足りない)'} | ${dE.roots.length ? zeros(dE) : '無し(' + fe(dE.shortfall) + ' 倍足りない)'} | ${cS.ARatioAtCross === null ? '—' : fe(cS.ARatioAtCross)} |`; });
    T.venusJ = ['| p | 銀河の寄与 v_G·â(K1)[rad/s] | 族 S に要る太陽の寄与 [rad/s] | diffK1 族 S の零点 R_alt [m] | diffK1 族 E の零点 R_alt [m] | diffStencil 族 S | diffStencil 族 E | 要る大きさに届く点の A/A_K1(族 S)|',
      '|---|---|---|---|---|---|---|---|'].concat(rows).join('\n');
  }
  // 表 3 金星の根(源 今 R_src = R_d)
  {
    const s = V.sources.now, rows = D.pGrid.map((p) => { const cS = s.cols['diffK1:S:' + p], cE = s.cols['diffK1:E:' + p], dS = s.cols['diffStencil:S:' + p];
      return `| ${p} | ${zeros(cS, true)} | ${zeros(cE, true)} | 無し(${fe(dS.shortfall)} 倍足りない)|`; });
    T.venusNow = ['| p | diffK1 族 S の零点 R_alt [m] | diffK1 族 E の零点 R_alt [m] | diffStencil 族 S |', '|---|---|---|---|'].concat(rows).join('\n');
  }
  // 表 4 金星の零点と比べる量(源 J・族 S の最も小さい零点)
  {
    const rows = D.pGrid.map((p) => { const F = V.frozen['J:S:' + p]; if (F.Ralt === null) return `| ${p} | 無し | — | — | — |`;
      const r = V.sources.J.cols['diffK1:S:' + p].roots.find((z) => z.R === F.Ralt); return `| ${p} | ${fe(r.R)} | ${fe(r.ROverRobs)} | ${fe(r.ROverRdK1)} | ${fe(r.R / K.J.RdCross)} |`; });
    T.venusCompare = ['| p | 族 S の最も小さい零点 R_alt [m] | R_alt/R_obs | R_alt/R_d^K1 | R_alt/(d m_金星/m_☉) |', '|---|---|---|---|---|'].concat(rows).join('\n');
  }
  // 表 5 太陽–火星(規則を固定 —— 源 J・族 S)
  {
    const rows = ML.mars.filter((q) => q.src === 'J' && q.family === 'S').map((q) => `| ${q.p} | ${fe(q.venusRoot)} | ${RULE[q.rule]} | ${fe(q.radii.mars)} | ${fe(q.k1Along['mars:sun'])} | ${fe(q.beta.mars)} | ${ok(q.accepted)} |`);
    T.mars = ['| p | 金星の零点 R_alt [m] | 規則 | 火星の R_alt [m] | 太陽の寄与 v·â [rad/s] | β_火星 | 採否 |', '|---|---|---|---|---|---|---|'].concat(rows).join('\n');
  }
  // 表 6 太陽–地球–月(規則を固定 —— 源 J・族 S・月 ↔ 地球の口は勾配の型)
  {
    const rows = ML.triEM.filter((q) => q.ok && q.src === 'J' && q.family === 'S' && q.moonPort === 'grad').map((q) => `| ${q.p} | ${RULE[q.rule]} | ${fe(q.radii.earth)} | ${fe(q.radii.moon)} | ${fe(q.k1Along['earth:sun'])} | ${fe(q.k1Along['moon:sun'])} | ${fe(q.beta.earth)} | ${fe(q.beta.moon)} | ${ok(q.accepted)}(${rej(q.rejected)}) |`);
    T.triEM = ['| p | 規則 | 地球の R_alt [m] | 月の R_alt [m] | 地球 ← 太陽 v·â [rad/s] | 月 ← 太陽 v·â [rad/s] | β_地球 | β_月 | 採否 |', '|---|---|---|---|---|---|---|---|---|'].concat(rows).join('\n');
  }
  // 表 7 比べる行(全部の口を勾配の型のまま —— 源 J・族 S)
  {
    const g = (sk, p) => ML.base.find((q) => q.sys === sk && q.src === 'J' && q.family === 'S' && q.p === p);
    const rows = D.pGrid.map((p) => { const v = g('venus', p), m = g('mars', p), e = g('triEM', p); return `| ${p} | ${fe(v.beta.venus)} | ${fe(m.beta.mars)} | ${fe(e.beta.earth)} | ${fe(e.beta.moon)} |`; });
    T.base = ['| p | β_金星 | β_火星 | β_地球 | β_月 |', '|---|---|---|---|---|'].concat(rows).join('\n');
  }
  // 表 8 自身の根(比べる列 —— 規則で決めない。火星と地球の太陽の口だけを振る・源 J)
  {
    const rows = ML.own.filter((q) => q.src === 'J').map((q) => `| ${NAME[q.key]} | ${q.family} | ${q.p} | ${q.roots.filter((r) => r.kind === 'zero').map((r) => fe(r.R) + (r.nearInsideSun ? '〔近い位置が太陽の観測半径の内〕' : '')).join('・') || '無し'} | ${q.acceptedPoints}/${q.points} |`);
    T.own = ['| 天体 | 族 | p | 零点 R [m] | β ≥ 0 の格子の点 |', '|---|---|---|---|---|'].concat(rows).join('\n');
  }
  // 表 9 帳簿(候補 —— 源 J・族 S)
  {
    const H0 = J.ledger.rows.find((q) => q.src === 'J' && q.family === 'S' && q.p === D.pAlso && q.at === 'root'), m5 = ML.mars.find((q) => q.src === 'J' && q.family === 'S' && q.p === -0.5 && q.rule === 'rdRatio');
    const e5 = ML.triEM.find((q) => q.src === 'J' && q.family === 'S' && q.p === -0.5 && q.rule === 'obsRatio' && q.moonPort === 'grad'), e0 = ML.triEM.find((q) => q.src === 'J' && q.family === 'S' && q.p === 0 && q.rule === 'obsRatio' && q.moonPort === 'grad');
    const row = (nm, ac, L) => `| ${nm} | ${ok(ac)} | ${fe(L.galaxySupply)} | ${fe(L.orbitWork)} | ${fe(L.k1Draw)} | ${fe(L.heat)} | ${lt(L.residualRel)} | ${lt(L.LTotalRel)} | ${lt(Math.max(L.k1TransferRel, L.portCloseMaxRel))} |`;
    T.ledger = ['| 系(源 J・族 S) | 採否 | P_G τ_0 | P_orb τ_0 | K1(差分)の口の仕事 τ_0 | Σ Q τ_0 | 帳簿の閉じ | L の閉じ | 口の閉じ・移し替え |', '|---|---|---|---|---|---|---|---|---|',
      row('太陽–金星(p 0・R_alt ' + fe(H0.R) + ' m —— 零点の β ≥ 0 の側)', H0.accepted, H0.ledger), row('太陽–火星(p -0.5・K1 の R_d との比)', m5.accepted, m5.ledger),
      row('太陽–地球–月(p -0.5・観測半径との比)', e5.accepted, e5.ledger), row('太陽–地球–月(p 0・観測半径との比)', e0.accepted, e0.ledger)].join('\n');
    // 表 10 口ごと(太陽–地球–月・p -0.5・観測半径との比)
    const pr = [];
    const lab = (q) => (q.kind === 'gal' ? '銀河(ĝ)' : (q.kind === 'k1' && q.src !== 'sun' ? '軸(K1 の勾配)' : KIND[q.kind]) + '(' + NAME[q.src] + ')');
    for (const R of e5.table) for (const q of R.ports) pr.push(`| ${NAME[R.key]} | ${lab(q)} | ${q.w === null ? '—' : q.w.toFixed(3)} | ${q.vAlong === null ? '—' : fe(q.vAlong)} | ${fe(q.nuAlong)} | ${fe(q.torqueAlong)} | ${fe(q.heat)} |`);
    T.ports = ['| 天体 | 口 | 配分 w | 寄与 v·â [rad/s] | 目標 ν·â [rad/s] | 軸の向きのトルク τ_0 | 熱 Q τ_0 |', '|---|---|---|---|---|---|---|'].concat(pr).join('\n');
  }
  return T;
}

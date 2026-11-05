// 第328便b(原仮定者の回答(2026-11-05 —— AN559・AN561・AN562・AN563・AN550・AN566)・統括の検証項目 R302): **正本 tests/out/response-w328b.json から PHYSICS〔第328便b〕の表を作る文書の lib**
// (QA docs.response328b が節の表と逐語で照合する —— 表の数は有効数字 4 桁〔傾きは小数 6 桁〕・丸めの程度の数〔閉じの残差・丸めの内の p と傾きの幅〕は「< 1e-12」の形で書き、数そのものは載せない)。
export const DOC_VERSION = 'w328b-responsedoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toExponential(3));
const fx = (x, d) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toFixed(d));
const lt = (x, t = 1e-12) => (x === null || x === undefined ? '—' : (Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : fe(x)));
const sl = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : (Math.abs(x) <= 1e-12 ? '0(< 1e-12)' : fx(x, 6)));
const NAME = { sun: '太陽', venus: '金星', mars: '火星', earth: '地球', moon: '月', jupiter: '木星', io: 'イオ' };
const nm = (k) => NAME[k] || (k === Object.keys({ saturn: 1 })[0] ? '土星' : k);
const FORM = { ballMean: '球の平均(主)', inertiaShare: '慣性で配る(主)', k1Ratio: 'K1 の比(検査)', engineDefault: '既定の列(q = 1・m_ref/m)', nullP0: '否定対照(p = 0)' };
const VERD = { candidate: 'p の候補', 'candidate-sameAsNegativeControl': 'p の候補(否定対照と同じ応答)', 'candidate-cancellation': 'p の候補(K1 の線で相殺)', table: '応答の表(p を出さない)' };
const COL = (k) => (k.indexOf('cand:') === 0 ? 'p の候補 0' : (k.indexOf('table:') === 0 ? '応答の表(' + FORM[k.slice(6)] + ')' : '比べる列 p ' + k.slice(5)));
const TAU = (k) => (k === 'inf' ? '∞(古典の極限)' : (k === 'age' ? '年齢 4.57 Gyr(格子の 1 点)' : k + ' s'));
const SF = { constQ: '一定の Q', constLag: '一定の時間の遅れ' };
const TF = (k) => (k === 'constPhase' ? '一定の位相' : '熱の緩和 ω_0/σ_obs = ' + k.split(':')[1]);
export function tablesOf(J) {
  const T = {}, C = J.contract, P = J.p, S = J.spatial, N = J.venus, F = J.fixedSource, TR = J.transient;
  // 表 1 場の契約(器の中の contractFromLegacy —— 統合で枝 a の buildFieldContract へ)
  { const c = C.contract;
    T.contract = ['| 欄 | 値 |', '|---|---|',
      `| version | ${c.version} |`, `| frame.axis(銀河中心系)・omegaFrame [rad/s] | (0, 0, 1)・${fe(c.frame.omegaFrame)}(渦状腕のパターンの角速度の文献の範囲 ${fe(C.OmegaPattern[0])}〜${fe(C.OmegaPattern[1])} の中点) |`,
      `| omegaField(mode・value [rad/s]・at) | ${c.omegaField.mode}・${fe(c.omegaField.value)}・R ${fx(c.omegaField.at.R_kpc, 1)} kpc・z ${fx(c.omegaField.at.z_kpc, 1)} kpc(宣言の候補 —— 同定ではない) |`,
      `| transfer(form・g_T) | ${c.transfer.form}・${c.transfer.gT} |`, `| 直接の滑り ν_slip = g_T(Ω_frame − Ω_field) [rad/s] | ${fe(C.slip.mag)}(太陽の式の A ${fe(C.Asun)} と同じ —— 宣言の作り方) |`,
      `| convergence(uConverged・curlConverged・gridSigns) | null・null・null(第321便c の sample に収束の印は無い —— 0 で埋めない) |`,
      `| sources | ${c.sources.map((q) => q.sourceId + '(' + q.owns.length + ' 成分・係数 ' + q.coef + ')').join('・')} |`,
      `| 背景の場 W_bg = β/(10G_0/c_0²) [kg/m](K1 の比の型だけが読む) | ${fe(C.Wbg)}(β ${fe(C.beta)}) |`].join('\n'); }
  // 表 2 型ごとの指数の判定(固定の位置・太陽を基準の受け手 —— 金星を基準の受け手にしても判定は同じ)
  { const rows = Object.entries(P.forms).map(([k, f]) => { const v = f.verdict, a = f.sun;
      return `| ${FORM[k]} | ${f.reads.length ? f.reads.join('・') : '—'} | ${sl(v.slopeRd)} | ${a.a.constant === undefined ? '—' : lt(a.a.spread)} | ${sl(v.slopeM)} | ${sl(v.slopeI)} | ${sl(v.slopeJoint)} | ${v.bodyFitOk ? sl(v.bodyP) : (v.bodyNearZero.length ? 'ほぼ 0 の応答(' + v.bodyNearZero.length + ' 天体)' : '残差 ' + fe(v.bodyMaxRes))} | ${VERD[v.verdict]} | ${v.p === null ? '—' : sl(v.p)} |`; });
    T.verdict = ['| 型 | 読む量 | R_d の指数(m・I 固定) | 局所の傾きの幅 | m の指数(R_d・I 固定) | I の指数(R_d・m 固定) | K1 の線(R_d と m を同じ倍率) | 本の 8 天体の ln f = p ln(R_d/R_d,☉) | 判定 | p |',
      '|---|---|---|---|---|---|---|---|---|---|'].concat(rows).join('\n'); }
  // 表 3 本の 8 天体の応答 f_i = F_i/F_☉(応答の表)
  { const keys = P.forms.ballMean.fit.rows.map((r) => r.key), fOf = (k, key) => P.forms[k].fit.rows.find((r) => r.key === key).f;
    const rows = keys.map((key) => { const b = J.inputs.bodies[key]; return `| ${nm(key)} | ${fe(b.Rd)} | ${fe(b.m)} | ${fe(b.I)} | ${fe(fOf('ballMean', key))} | ${fe(fOf('inertiaShare', key))} | ${fe(fOf('k1Ratio', key))} | ${fe(fOf('engineDefault', key))} | ${fe(fOf('nullP0', key))} |`; });
    T.bodies = ['| 天体 | R_d [m] | m [kg] | I [kg m²] | 球の平均 | 慣性で配る | K1 の比 | 既定の列 | 否定対照 |', '|---|---|---|---|---|---|---|---|---|'].concat(rows).join('\n'); }
  // 表 4 既定の列の照合(エンジンの銀河の一様軸の読み口の受け手ごとの係数)
  { const D = P.defaultColumn, k1 = D.rows.filter((r) => r.case === 'k1Rule');
    T.default = ['| 写し | 受け手 | エンジンの係数 | 本器の既定の列 | 差(相対) |', '|---|---|---|---|---|',
      `| K1 の規則(R_d = Y_k m・R_ref = R_d,☉・m_ref = m_☉) | ${k1.length} 天体 | 全部 ${fe(k1[0].engine)} | 全部 ${fe(k1[0].ours)} | ${lt(Math.max(...k1.map((r) => r.rel)))} |`]
      .concat(D.cases.map((c) => { const r = D.rows.find((q) => q.case === c.case); return `| ${{ 'venusRd0.1': '金星の R_d を 0.1 倍(m 固定)', venusRd10: '金星の R_d を 10 倍(m 固定)', venusMass10: '金星の m を 10 倍(R_d 固定)' }[c.case]} | 金星 | ${fe(c.engine)} | ${fe(r.ours)} | ${lt(r.rel)} |`; })).join('\n'); }
  // 表 5 否定対照(K1 の線だけを振る読みは見分けない)
  { const n = P.negative;
    T.negative = ['| 読み | 既定の列(q = 1・m_ref/m) | 否定対照(p = 0) |', '|---|---|---|',
      `| K1 の線だけ(R_d と m を同じ倍率) | ${sl(n.defaultJoint)} | ${sl(n.nullJoint)} |`, `| R_d だけ(m 固定) | ${sl(n.defaultRd)} | ${sl(n.nullRd)} |`, `| m だけ(R_d 固定) | ${sl(n.defaultM)} | ${sl(n.nullM)} |`].join('\n'); }
  // 表 6 広い範囲の R_d の応答の表(太陽を基準 —— 門を当てない・局所の傾き)
  { const pick = [1, 100, 1e4, 1e5, 1e6, 1e8, 1e10, 1e12], wOf = (k) => P.forms[k].sun.wide;
    const near = (w, x) => w.find((q) => Math.abs(Math.log10(q.RdOverBase) - Math.log10(x)) < 1e-6);
    const rows = pick.map((x) => { const a = near(wOf('k1Ratio'), x), b = near(wOf('inertiaShare'), x), c = near(wOf('engineDefault'), x);
      return `| ${fe(x)} | ${fe(a.fac)} | ${fx(a.localSlope, 4)} | ${fe(b.fac)} | ${fx(b.localSlope, 4)} | ${fx(c.localSlope, 4)} |`; });
    T.wide = ['| R_d/R_d,☉(m・I 固定) | K1 の比 係数 | K1 の比 局所の傾き | 慣性で配る 係数 | 慣性で配る 局所の傾き | 既定の列 局所の傾き |', '|---|---|---|---|---|---|'].concat(rows).join('\n'); }
  // 表 7 空間の勾配(位置を動かす —— 源の場の空間の指数・p ではない)
  { const rows = S.rowsR.map((q) => `| ${fx(q.RKpc, 1)} | 0 | ${fe(q.uPhi)} | ${fe(q.rigid)} | ${fe(q.halfCurlZ)} | ${fe(q.shear)} | ${fe(q.contractSlip)} |`)
      .concat(S.rowsZ.filter((q) => q.zKpc !== 0).map((q) => `| ${fx(q.RKpc, 1)} | ${fx(q.zKpc, 2)} | ${fe(q.uPhi)} | ${fe(q.rigid)} | ${fe(q.halfCurlZ)}(R̂ 成分 ${fe(q.halfCurlR)}) | ${fe(q.shear)} | ${fe(q.contractSlip)} |`));
    const s = S.slopeAtR0;
    T.spatial = ['| R [kpc] | z [kpc] | u_φ [m/s] | u_φ/R [rad/s] | 半渦度 ẑ [rad/s] | シア [rad/s] | 契約の直接の滑り [rad/s] |', '|---|---|---|---|---|---|---|'].concat(rows)
      .concat([`| **d ln/d ln R(8.2 kpc —— 7.7 と 8.7 の差)** | — | ${fx(s.uPhi, 4)} | ${fx(s.rigid, 4)} | ${fx(s.halfCurlZ, 4)} | ${fx(s.shear, 4)} | 0(宣言の定数) |`]).join('\n'); }
  // 表 8 金星の熱潮汐の振幅 N_0(主の型 —— 一定の時間の遅れ + 一定の位相・Q 30・族 E・源 J・今の列)
  { const cols = N.columns.map((c) => c.key), taus = J.inputs.taus;
    const rows = taus.map((tk) => '| ' + TAU(tk) + ' | ' + cols.map((ck) => { const r = N.rows.find((q) => q.col === ck && q.fix === 'coupled' && q.src === 'J' && q.fam === 'E' && q.Q === 30 && q.tau === tk); return fe(r.N0) + ' | ' + fe(r.eps); }).join(' | ') + ' |');
    T.n0 = ['| τ_0 | ' + cols.map((ck) => COL(ck) + ' N_0 [N·m] | ε').join(' | ') + ' |', '|---|' + cols.map(() => '---|---|').join('')].concat(rows).join('\n'); }
  // 表 9 τ_0 の閾(主の型・族 E・源 J・今の列)
  { const rows = N.thresholds.filter((t) => t.fix === 'coupled' && t.src === 'J' && t.fam === 'E').map((t) => `| ${COL(t.col)} | ${t.Q} | ${fe(t.gkTau)} | ${fe(t.epsInf)} | ${fe(t.epsAge)} | ${fe(t.tauLitHi)} | ${fe(t.tauLitLo)} |`);
    T.thresholds = ['| 列 | Q | 銀河と K1 の口の軸の向きのトルク × τ_0 [N·m·s] | ε(τ_0 = ∞) | ε(τ_0 = 年齢) | 文献の桁の上の端で足りる最小の τ_0 [s] | 下の端で足りる最小の τ_0 [s] |', '|---|---|---|---|---|---|---|'].concat(rows).join('\n'); }
  // 表 10 型の対照(p の候補の列・Q 30・族 E・源 J・今の列)
  { const ck = N.columns[0].key, tks = Object.keys(N.mats.unit), rowOf = (sf, tf, tk) => N.rows.concat(N.controls).find((q) => q.col === ck && q.fix === 'coupled' && q.src === 'J' && q.fam === 'E' && q.Q === 30 && q.tau === tk && q.sForm === sf && q.tForm === tf);
    const rows = J.decl.venus.solidForms.flatMap((sf) => tks.map((tf) => `| ${SF[sf]} | ${TF(tf)}${sf === J.decl.venus.solidMain && tf === J.decl.venus.thermalMain ? '(主)' : ''} | ${fe(rowOf(sf, tf, 'inf').N0)} | ${fe(rowOf(sf, tf, 'age').N0)} | ${fe(rowOf(sf, tf, '1e+17').N0)} |`));
    T.controls = ['| 固体の潮汐の型 | 熱潮汐の型 | N_0(τ_0 = ∞)[N·m] | N_0(τ_0 = 年齢) | N_0(τ_0 = 1e17 s) |', '|---|---|---|---|---|'].concat(rows).join('\n'); }
  // 表 11 観測の点の安定(Q 30・族 E・源 J・今の列)
  { const rows = N.stability.map((s) => `| ${COL(s.col)} | ${TAU(s.tau)} | ${SF[s.sForm]} + 一定の位相 | ${fe(s.N0)} | ${s.neutral ? '中立(全部の自転でトルク 0 —— 縮退)' : (s.obsRoot ? (s.obsRoot.stable ? '安定' : '不安定') : '根でない')} | ${s.roots.length} |`);
    T.stability = ['| 列 | τ_0 | 口の型 | N_0 [N·m] | 観測の自転の点 | 釣り合いの点の数 |', '|---|---|---|---|---|---|'].concat(rows).join('\n'); }
  // 表 12 源の自転を外部の口座に固定(K1 の口 —— 金星の系・源 J・族 E)
  { const rows = N.columns.map((c) => { const a = N.base[[c.key, 'coupled', 'J', 'E'].join('|')], b = N.base[[c.key, 'fixed', 'J', 'E'].join('|')];
      const n0a = N.rows.find((q) => q.col === c.key && q.fix === 'coupled' && q.src === 'J' && q.fam === 'E' && q.Q === 30 && q.tau === 'age'), n0b = N.rows.find((q) => q.col === c.key && q.fix === 'fixed' && q.src === 'J' && q.fam === 'E' && q.Q === 30 && q.tau === 'age');
      const rel = (x, y) => (x === y ? 0 : Math.abs(x - y) / Math.max(Math.abs(x), Math.abs(y)));
      return `| ${COL(c.key)} | ${fe(a.A)} | ${lt(rel(a.A, b.A))} | ${fe(b.external.torqueAlong)} | ${fe(b.external.work)} | ${fe(Math.abs(b.external.overGalaxySupply))} | ${lt(b.external.workVsDrawRel)} | ${lt(rel(n0a.N0, n0b.N0))} |`; });
    T.fixedK1 = ['| 列 | A(今の列)[rad/s] | A の差(固定の列と)| 外部の口座のトルク × τ_0 [N·m·s] | 外部の口座の供給の仕事 × τ_0 [J] | 供給の仕事/銀河の中心の供給 | 供給の仕事 − K1 の口の供給 | N_0 の差(Q 30・τ_0 = 年齢) |',
      '|---|---|---|---|---|---|---|---|'].concat(rows).join('\n'); }
  // 表 13 源の自転を外部の口座に固定(第327便e の器の口 —— 源 J・太陽の口だけ別の半径 diffK1・金星の零点)
  { const z = (q) => (q.smallestZero ? fe(q.smallestZero.R) : '無し');
    const rows = F.cols.map((c) => `| ${c.fam} | ${c.p} | ${c.coupled.zeros} | ${z(c.coupled)} | ${fe(c.coupled.atMaxSunPort.ARatio)} | ${c.fixed.zeros} | ${z(c.fixed)} | ${c.fixed.smallestZero ? fe(Math.abs(c.fixed.smallestZero.external.overGalaxySupply)) : '—'} | ${c.fixed.smallestZero ? fe(Math.abs(c.fixed.smallestZero.external.overHeat)) : '—'} |`);
    T.fixedAlt = ['| 族 | p | 今の列 零点の数 | 今の列 最も小さい零点 R_alt [m] | 今の列 太陽の口の寄与が最大の点の A/A_K1 | 固定の列 零点の数 | 固定の列 最も小さい零点 R_alt [m] | 固定の列 外部の供給の仕事/銀河の中心の供給(零点) | 同/Σ Q |',
      '|---|---|---|---|---|---|---|---|---|'].concat(rows).join('\n'); }
  // 表 14 火星と地球の変化の時間(AN566 —— その列の瞬間のトルクの局所の尺度・一定の時間の遅れ + 一定の位相・ε は金星の主の行を固定)
  { const rows = TR.rows.filter((r) => r.sForm === 'constLag').map((r) => { const e = r.triEM.find((q) => q.key === 'earth');
      return `| ${COL(r.col)} | ${TAU(r.tau)} | ${fe(r.eps)} | ${fe(r.mars.Nnet)} | ${fe(r.mars.tChangeOverAge)} | ${fe(e.Nnet)} | ${fe(e.tChangeOverAge)} |`; });
    T.transient = ['| 列 | τ_0 | ε(金星の主の行) | 火星 正味のトルク [N·m] | 火星 I abs(Ω)/abs(N) ÷ 年齢(局所の尺度) | 地球 正味のトルク [N·m] | 地球 I abs(Ω)/abs(N) ÷ 年齢(局所の尺度) |', '|---|---|---|---|---|---|---|'].concat(rows).join('\n'); }
  // 表 15 帳簿(全部の行 —— 金星の振幅の全条件を帳簿まで)
  { const w = N.worst;
    T.ledger = ['| 範囲 | 件数 | 軸の向きの残差 | 帳簿の閉じ | L の閉じ | 口の閉じ | 移し替え |', '|---|---|---|---|---|---|---|',
      `| 金星の振幅(列 ${N.columns.length} × 源の反作用 2 × 源 2 × 族 2 × Q 3 × τ_0 ${J.inputs.taus.length} × 固体の型 2 × 熱潮汐の型 6) | ${w.checked}/${w.expected}(不採用 ${w.rejected}) | ${lt(w.alongRel)} | ${lt(w.residualRel)} | ${lt(w.LTotalRel)} | ${lt(w.portCloseMaxRel)} | ${lt(w.k1TransferRel)} |`].join('\n'); }
  return T;
}

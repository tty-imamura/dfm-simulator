// 第335便f(原仮定者の補足(2026-11-12)・原仮定者の回答(2026-11-12 —— AN665)・統括の検証項目 R333): **正本 tests/out/elliptical-w335f.json から PHYSICS〔第335便f〕の表を作る文書の lib**
// (QA docs.elliptical335f が節の表と逐語で照合する —— 表の数は有効数字 4 桁か百分率の小数 2 桁・丸めの程度の数は「< 1e-10」の形で書き、数そのものは載せない)。
export const DOC_VERSION = 'w335f-ellipticaldoc-1';
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toPrecision(4));
const lt = (x, t) => (Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : '**' + Number(x).toExponential(3) + '**');
const tf = (x) => (x === true ? '真' : x === false ? '偽' : 'null');
const pc = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Math.abs(x) < 5e-5 ? '0.00%' : (100 * x).toFixed(2) + '%');
const rt = (x) => (!Number.isFinite(x) ? '—' : x >= 1e4 ? '> 1e4' : x < 1e-3 ? '< 1e-3' : f3(x));
/** 量の名前(表の見出し) */
export const QLABEL = Object.freeze({ r10: 'r10', r50: 'r50', r90: 'r90', conc: 'r10/r50', slope: '密度の傾き', ba: 'b/a', ca: 'c/a', sigR: 'σ_r', sigT: 'σ_t', beta: 'β_aniso', vir: '2K/\\|W\\|', esc: '脱落', dE: 'E の残差', dL: 'L の残差', dCM: '重心の漂い', vrot: '⟨v_φ⟩/σ' });
const STRUCT = ['r10', 'r50', 'r90', 'conc', 'slope', 'ba', 'ca', 'sigR', 'sigT', 'beta', 'vir', 'esc', 'vrot'], CONS = ['dE', 'dL', 'dCM'];
const qv = (J, k, x) => (J.qkind[k] === 'rel' ? pc(x) : f3(x));
const VLABEL = { hernquist: 'Hernquist 球', oblate: '扁平(z × 0.7)', rotate: '回転の支え(v_rot/σ 0.3)' };

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, P = J.plan, A = J.analysis;
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| ① Plummer の標本: 同じ種で同じ列・r < 1 の質量の割合(解析 ${f3(S.plummer.expect)})・ビリアル比(N 4096・ε 0.01) | ${tf(S.plummer.same)}・${f3(S.plummer.frac1)}・${f3(S.plummer.vir)} | ${tf(G.plummer)} |`,
    `| ② 星どうしの並進引きずりの和 d_i + v_i が第334便e の \`gridField\`(受け手を星に・自分を外す・s_d 0)と同じ(α 2・1 × ε 0.05・0.1 —— ${S.gridSame.n} 組)の相対の差 | ${lt(S.gridSame.maxRel, 1e-10)} | ${tf(G.gridSame)} |`,
    `| ③ 引きずりの恒等: 全部の星が同じ速度で d = 0・一様な速度を足して d が同じ(ガリレイ)・自己の重みで \\|d\\| ≤ (1 − f_self) max\\|v_j − v_i\\| | ${lt(S.dragId.zero, 1e-10)}・${lt(S.dragId.gal, 1e-10)}・${tf(S.dragId.ineq)} | ${tf(G.dragId)} |`,
    `| ④ 重力: Σ m a ÷ Σ m\\|a\\|・時間の反転(N 16・40 步)・E の残差・積分器と同じ手順 | ${lt(S.gravity.momRel, 1e-10)}・${lt(S.gravity.back, 1e-8)}・${f3(S.gravity.dE)}・${lt(S.gravity.sameFwd, 1e-10)} | ${tf(G.gravity)} |`,
    `| ⑤ 測り(軸の上の点の組): b/a・c/a・動径だけの速度の β_aniso・回転・固有値(5・3・1) | ${f3(S.measure.ba)}・${f3(S.measure.ca)}・${f3(S.measure.beta)}・${f3(S.measure.vrot)}・${S.measure.eig.map(f3).join('/')} | ${tf(G.measure)} |`,
    `| ⑥ Hernquist の標本: 包みの外れ・r < 1 の質量の割合(解析 ${f3(S.hernquist.expect)})・ビリアル比 | ${S.hernquist.miss}・${f3(S.hernquist.frac1)}・${f3(S.hernquist.vir)} | ${tf(G.hernquist)} |`,
    `| ⑦ 回転の支えの対照: \\|v\\| を星ごとに保つ(相対)・⟨v_φ⟩/σ(反しの前 → 後) | ${lt(S.rotate.keep, 1e-10)}・${f3(S.rotate.vrot0)} → ${f3(S.rotate.vrot)} | ${tf(G.rotate)} |`,
    `| ⑧ 扁平の対照: c/a(球の標本 → 扁平)・ビリアル比が球と同じ(相対) | ${f3(S.oblate.ca0)} → ${f3(S.oblate.ca)}・${lt(S.oblate.virRel, 1e-10)} | ${tf(G.oblate)} |`,
    `| ⑨ 自己の重み R_d = Y_k m(N 512 の星 1 個 —— 模型の単位)・抑えの割合 Σw/(w_ii + Σw) の最大 α 2 / α 1 | ${f3(S.selfRd.a2.RdModel)}・${f3(S.selfRd.a2.maxSuppress)} / ${f3(S.selfRd.a1.maxSuppress)} | ${tf(G.selfRd)} |`,
    `| ⑩ 入力の拒否 | ${S.reject.n}/${S.reject.of} | ${tf(G.reject)} |`].join('\n');
  const U = J.units;
  T.units = ['| 模型 | r_h [a] | v_rms [√(GM/a)] | t_cr [模型の単位] | t_cr [Myr] | 窓 5 t_cr [Myr] | 刻み h [Myr] | v_rms [m s⁻¹] |', '|---|---|---|---|---|---|---|---|',
    ...U.models.map((m) => `| ${m.model === 'plummer' ? 'Plummer 球(主)' : 'Hernquist 球(対照)'} | ${f3(m.rh)} | ${f3(m.vrms)} | ${f3(m.tcr)} | ${f3(m.tcrMyr)} | ${f3(m.windowMyr)} | ${f3(m.hMyr)} | ${f3(m.vrmsSI)} |`)].join('\n');
  T.unitsRd = ['| N | 星 1 個の質量 [M☉] | R_d = Y_k m [m] | R_d [a] |', '|---|---|---|---|', ...U.rd.map((r) => `| ${r.N} | ${f3(U.Msun / r.N)} | ${f3(r.RdM)} | ${f3(r.RdModel)} |`)].join('\n');
  T.relax = ['| N | t_relax(Λ = N)[t_cr] | 窓 ÷ t_relax | t_relax(Λ = r_h/ε)ε 0.02 / 0.05 / 0.1 [t_cr] | 窓 ÷ t_relax ε 0.02 / 0.05 / 0.1 |', '|---|---|---|---|---|',
    ...J.relax.map((r) => `| ${r.N}${P.Ns.includes(r.N) ? '' : '(--deep)'} | ${f3(r.tRelaxTcrN)} | ${f3(r.windowOverN)} | ${r.eps.map((e) => f3(e.tRelaxTcr)).join(' / ')} | ${r.eps.map((e) => f3(e.windowOver)).join(' / ')} |`)].join('\n');
  T.band = ['| 量 | 型 | 幅 B(18 本) | N だけ | ε だけ | 種だけ | 主の組の種の平均の ΔQ | Q(0) の幅(18 本) |', '|---|---|---|---|---|---|---|---|',
    ...J.qkeys.map((k) => { const d = A.decomp[k], raw = A.bandRaw[k]; return `| ${QLABEL[k]} | ${J.qkind[k]} | ${raw < P.roundFloor ? '< 1e-12(床 1e-12)' : qv(J, k, raw)} | ${qv(J, k, d.N)} | ${qv(J, k, d.eps)} | ${qv(J, k, d.seed)} | ${CONS.includes(k) && Math.abs(d.mainMean) < 1e-12 ? '< 1e-12' : qv(J, k, d.mainMean)} | ${qv(J, k, d.q0Spread)} |`; })].join('\n');
  const E = A.equilibrium;
  T.equil = ['| 記録 | 値 | 内か |', '|---|---|---|', `| 重力だけの 18 本の全部の時刻の \\|2K/\\|W\\| − 1\\| の最大(宣言 ≤ ${P.virTol}) | ${f3(E.virMaxDev)} | ${tf(E.virWithin)} |`,
    ...P.driftKeys.map((k) => `| 主の組の種の平均の ΔQ —— ${QLABEL[k]}(幅 ${qv(J, k, E.drift[k].band)}) | ${qv(J, k, E.drift[k].mean)} | ${tf(E.drift[k].within)} |`)].join('\n');
  // 時系列(主の組の種 1 —— 0〜5 t_cr)
  const run = (o) => J.runs.find((x) => Object.entries(o).every(([k, v]) => x.spec[k] === v));
  const idx = [0, 4, 8, 12, 16, 20], g1 = run({ part: 'ensemble', N: P.mainN, eps: P.mainEps, seed: 1 }), p1 = run({ part: 'drag', action: 'push', alpha: 2, self: 'none', gammaTcr: P.mainGammaTcr, seed: 1 }), v1 = run({ part: 'drag', action: 'vel', alpha: 2, self: 'none', seed: 1 });
  const SK = ['r10', 'r50', 'r90', 'sigR', 'vir', 'beta', 'esc'];
  T.series = ['| 列 | t [t_cr] | ' + SK.map((k) => QLABEL[k]).join(' | ') + ' |', '|---|---|' + SK.map(() => '---').join('|') + '|',
    ...[['重力だけ', g1], ['押し γ 0.1/t_cr', p1], ['速度の場', v1]].flatMap(([nm, r]) => idx.map((i) => `| ${nm} | ${f3(r.t[i])} | ${SK.map((k) => f3(r.q[k][i])).join(' | ')} |`))].join('\n');
  // 効果(構造の量 —— 効果と効果 ÷ 幅)
  T.eff = ['| 列 | 種 | ' + STRUCT.map((k) => QLABEL[k]).join(' | ') + ' |', '|---|---|' + STRUCT.map(() => '---').join('|') + '|',
    ...A.cells.map((c) => `| ${c.label} | ${c.nSeeds} | ${STRUCT.map((k) => qv(J, k, c.eff[k]) + '(' + rt(c.ratio[k]) + ')').join(' | ')} |`)].join('\n');
  T.effCons = ['| 列 | E の残差の差 | L の残差の差 | 重心の漂いの差 | 幅を超える 構造の量 / 保存の量 | 効果 ÷ 幅 の最大(構造の量) |', '|---|---|---|---|---|---|',
    ...A.cells.map((c) => `| ${c.label} | ${f3(c.eff.dE)}(${rt(c.ratio.dE)}) | ${Math.abs(c.eff.dL) < 1e-12 ? '< 1e-12' : f3(c.eff.dL)}(${rt(c.ratio.dL)}) | ${Math.abs(c.eff.dCM) < 1e-12 ? '< 1e-12' : f3(c.eff.dCM)}(${rt(c.ratio.dCM)}) | ${c.exceedStruct}/${STRUCT.length} / ${c.exceedCons}/${CONS.length} | ${rt(Math.max(...STRUCT.map((k) => c.ratio[k])))} |`)].join('\n');
  T.ledger = ['| 列 | 種 | 引きずりの仕事 ÷ \\|E₀\\| | (E(T) − E₀) ÷ \\|E₀\\| | 帳簿の残り (E(T) − E₀ − 仕事) ÷ \\|E₀\\| | 重力だけの E の残差(同じ初期条件) |', '|---|---|---|---|---|---|',
    ...A.cells.flatMap((c) => c.ledger.map((l) => `| ${c.label} | ${l.seed} | ${f3(l.Wdrag)} | ${f3(l.dE)} | ${f3(l.resid)} | ${f3(l.gravResid)} |`))].join('\n');
  T.selfRd = ['| 列 | 抑えの割合の最大(時刻 0) | 構造の量の効果 ÷ 幅 の最大 | 重力だけとビットで同じ |', '|---|---|---|---|',
    ...A.cells.filter((c) => c.spec.self === 'Rd').map((c) => `| ${c.label} | ${f3(c.maxSuppress)} | ${rt(Math.max(...STRUCT.map((k) => c.ratio[k])))} | ${tf(c.bitSameAsGrav)} |`)].join('\n');
  T.variants = ['| 対照の模型 | 量 | Q(0)(種 1) | 重力だけの ΔQ(種の平均) | 種の幅 | 押し γ 0.1/t_cr の効果(÷ 幅) | 速度の場の効果(÷ 幅) |', '|---|---|---|---|---|---|---|',
    ...A.variants.flatMap((v) => ['r10', 'r50', 'r90', 'ca', 'sigR', 'beta', 'vir', 'vrot'].map((k) => { const b = v.base[k], cp = v.cols.find((c) => c.action === 'push'), cv = v.cols.find((c) => c.action === 'vel');
      return `| ${VLABEL[v.variant]} | ${QLABEL[k]} | ${f3(b.q0)} | ${qv(J, k, b.mean)} | ${qv(J, k, v.seedBand[k])} | ${qv(J, k, cp.eff[k])}(${rt(cp.ratio[k])}) | ${qv(J, k, cv.eff[k])}(${rt(cv.ratio[k])}) |`; }))].join('\n');
  T.variantsSum = ['| 対照の模型 | 重力だけの \\|2K/\\|W\\| − 1\\| の最大 | 押し: 幅を超える 構造 / 保存 | 速度の場: 幅を超える 構造 / 保存 |', '|---|---|---|---|',
    ...A.variants.map((v) => { const cp = v.cols.find((c) => c.action === 'push'), cv = v.cols.find((c) => c.action === 'vel'); return `| ${VLABEL[v.variant]} | ${f3(v.virMaxDev)} | ${cp.exceedStruct}/${STRUCT.length} / ${cp.exceedCons}/${CONS.length} | ${cv.exceedStruct}/${STRUCT.length} / ${cv.exceedCons}/${CONS.length} |`; })].join('\n');
  const HK = ['r10', 'r50', 'r90', 'sigR', 'sigT', 'vir', 'beta', 'dE'];
  T.half = ['| 列(主の組の種 1) | ' + HK.map((k) => QLABEL[k]).join(' | ') + ' | 帳簿の残り h / h/2 |', '|---|' + HK.map(() => '---').join('|') + '|---|',
    ...A.half.map((h) => `| ${h.action === 'grav' ? '重力だけ(ΔQ の差 ÷ 幅)' : h.action === 'push' ? '押し γ 0.1/t_cr(効果の差 ÷ 幅)' : '速度の場(効果の差 ÷ 幅)'} | ${HK.map((k) => rt(h.overBand[k])).join(' | ')} | ${f3(h.resid[0])} / ${f3(h.resid[1])} |`)].join('\n');
  const C = J.cost;
  T.cost = ['| 部分 | 本数 | 対の評価の数 |', '|---|---|---|', ...Object.entries(C.perPart).map(([k, v]) => `| ${k} | ${v.runs} | ${f3(v.pairs)} |`), `| 合計 | ${C.runs} | ${f3(C.pairsTotal)} |`].join('\n');
  T.gates = ['| 門 | 値 |', '|---|---|', ...Object.entries(J.gates).map(([k, v]) => `| ${k} | ${tf(v)} |`)].join('\n');
  return T;
}

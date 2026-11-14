// 第337便e(原仮定者の指示(2026-11-14 —— 第138報)・統括の検証項目 R341): **正本 tests/out/fluid-337e.json から PHYSICS〔第337便e〕の表を作る文書の lib**
// (QA docs.fluid337e が節の表と逐語で照合する —— 表の数は有効数字 4 桁か百分率の小数 2 桁・丸めの程度の数は「< 1e-12」の形で書き、数そのものは載せない)。
export const DOC_VERSION = 'w337e-fluiddoc-1';
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toPrecision(4));
const lt = (x, t) => (Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : '**' + Number(x).toExponential(3) + '**');
const tf = (x) => (x === true ? '真' : x === false ? '偽' : 'null');
const pc = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Math.abs(x) < 5e-5 ? '0.00%' : (100 * x).toFixed(2) + '%');
const sl = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : (x >= 0 ? '+' : '') + x.toFixed(3));
const big = (x) => (!Number.isFinite(x) ? '—' : Math.abs(x) >= 1e4 || (Math.abs(x) < 1e-3 && x !== 0) ? Number(x).toExponential(2) : f3(x));
export const RULE_LABEL = Object.freeze({ none: '自己なし(第335便f の主列)', A: 'A 軟化の半径 m/ε^α', B: 'B 体積の内の積分(解析の密度)', Bk: 'B 体積の内の積分(k 近傍の密度)', C: 'C 星 1 個の R_d = Y_k m' });
export const DYN_RULE_LABEL = Object.freeze({ none: '自己なし(第335便f の主列)', A: 'A 軟化の半径 m/ε^α', B: 'B 体積の内の積分(k 近傍・測りの間隔ごとに更新)', C: 'C 星 1 個の R_d = Y_k m' });
export const FIELD_LABEL = Object.freeze({ rigid: '剛体回転', shear: 'ずれ', diff: '差動回転', iso: '散らばり(分布関数)' });
export const DEP_LABEL = Object.freeze({ flat: 'この格子では N に依らない', weak: '弱く依る', strong: '強く依る', '—': '—' });
export const TYPE_LABEL = Object.freeze({ grav: '重力だけ', row: 'row 行ごとに正規化(第335便f —— 対照)', symFull: 'symFull 共通の分母・全成分', symCentral: 'symCentral 共通の分母・中心方向', symCentralPi: 'symCentral + Π(要素の中の散らばり)' });
export const ACT_LABEL = Object.freeze({ grav: '重力だけ', push: '押し row γ 0.1/t_cr', velE: '速度の場(陽 —— 1 步遅れ)', velI: '速度の場(陰の中点・反復 3)' });
export const READ_LABEL = Object.freeze({ center0: '中心の点(自転 0)', centerL: '中心の点(自転 L_z/Σ m R²)', inner: '内の和', local: '局所(全分布の直接の和)' });
export const COL_LABEL = Object.freeze({ grav: '重力だけ', T: 'T 並進', R: 'R 回転(T1 × φ̂)', A: 'A 環の要素どうし', TRA: 'T + R + A', X1: 'X1 軸(近い面と遠い面の差分だけ)', X2: 'X2 軸(回転率の全部 ½∇×U)' });
const TREND = { grow: '増える', decay: '減る', flat: '平ら' };
const SK = ['r10', 'r50', 'r90', 'vir', 'sigR', 'sigT', 'beta', 'vrot'];
const SKL = { r10: 'r10', r50: 'r50', r90: 'r90', vir: '2K/\\|W\\|', sigR: 'σ_r', sigT: 'σ_t', beta: 'β_aniso', vrot: '⟨v_φ⟩/σ' };
const ev = (k, x) => (['beta', 'vrot'].includes(k) ? f3(x) : pc(x));

export function tablesOf(J) {
  const T = {}, S = J.pure.scenes, G = J.pure.gates, A = J.analysis;
  T.pure = ['| 場面 | 値 | 門 |', '|---|---|---|',
    `| ① 1 要素 → 4 分割(子は親と同じ位置で質量 m/4・同じ速度 —— 束の和は対の木): 受け手 ${S.split.nRec} 点の d と W がビット同一 / 子を正四面体(半径 R/2)に広げた W の差(中央値・最大)/ B の自己の重みの細分(子 1 つの w^B + 兄弟 3 つ)÷ 親の w^B(ε 0.05・0.01・0) | ${tf(S.split.same)} / ${pc(S.split.spreadMed)}・${pc(S.split.spread)} / ${S.split.sub.map((x) => f3(x.ratio)).join('・')} | ${tf(G.split)} |`,
    `| ② row の積分器が第335便f の \`integrate\` とビット同一(N 64・40 步・押し・速度の場・重力だけ) | ${S.rowSame.maxD === 0 ? '同一' : '違う'} | ${tf(G.rowSame)} |`,
    `| ③ 帳簿(N 64・40 步・γ 5・回転の支え): \\|ΔP\\|/v_rms と \\|ΔL\\|/(r_h v_rms) —— row / symFull / symCentral・熱の口 Q/\\|E₀\\| ≥ 0 | ${f3(S.conserve.row.dP)}・${f3(S.conserve.row.dL)} / ${lt(S.conserve.symFull.dP, 1e-13)}・${f3(S.conserve.symFull.dL)} / ${lt(S.conserve.symCentral.dP, 1e-13)}・${lt(S.conserve.symCentral.dL, 1e-13)}・${f3(S.conserve.symCentral.Qrad)} | ${tf(G.conserve)} |`,
    `| ④ 一定の速度の場で d = 0(読み 4)・一様な速度を足して d が同じ(row・symFull・symCentral) | ${lt(S.ident.zero, 1e-15)}・${lt(S.ident.gal, 1e-12)} | ${tf(G.ident)} |`,
    `| ⑤ 連続の場の求積: 方位の閉じた形と二重の求積の差(r = 0.3・1・3) | ${lt(S.quad.maxRel, 1e-6)} | ${tf(G.quad)} |`,
    `| ⑥ B の自己の重みの閉じた形と動径の求積の差(α 2・1 × ε 0.05・0.01)・ε → 0 で 4πρR | ${lt(S.selfB.maxRel, 1e-10)}・${lt(S.selfB.lim, 1e-15)} | ${tf(G.selfB)} |`,
    `| ⑦ Π の圧力だけ(重力なし —— 熱い球・N 64・40 步): 運動 + 内部のエネルギーの残差・運動のエネルギーの増え ÷ E・運動量 | ${f3(S.pi.dE)}・${f3(S.pi.Kgain)}・${lt(S.pi.px, 1e-13)} | ${tf(G.pi)} |`,
    `| ⑧ 環の並進の目標 U が第333便b の \`integratedField\` と同じ・回転の速さが第334便a の \`t1Twist\` と同じ・軸の読み X2 が \`integratedField\` の omega と同じ | ${lt(S.ringLib.maxRel, 1e-12)}・${lt(S.ringLib.twist, 1e-15)}・${lt(S.ringLib.axRel, 1e-12)} | ${tf(G.ringLib)} |`,
    `| ⑨ k 近傍の密度(N 4096 —— r 0.9〜1.4 の ${S.knn.n} 要素)÷ 解析の中央値 | ${f3(S.knn.med)} | ${tf(G.knn)} |`,
    `| ⑩ 入力の拒否 | ${S.reject.n}/${S.reject.of} | ${tf(G.reject)} |`].join('\n');
  // T1 静的(α 2): 自己の分け前と全体の重み(場に依らない —— rigid の行から)
  const r2 = (N, rule, field, alpha = 2) => J.t1static.find((r) => r.N === N && r.rule === rule && r.field === field && r.alpha === alpha);
  const Ns = J.plan.t1.Ns;
  T.t1share = ['| 読み | 自己の分け前 N ' + Ns.join(' / ') + ' | 全体の重み ÷ 連続 − 1 の平均 N ' + Ns.join(' / ') + ' | 同 RMS N ' + Ns.join(' / ') + ' |', '|---|---|---|---|',
    ...J.plan.t1.rules.map((rule) => `| ${RULE_LABEL[rule]} | ${Ns.map((N) => f3(r2(N, rule, 'rigid').shareMean)).join(' / ')} | ${Ns.map((N) => big(r2(N, rule, 'rigid').wTotBias)).join(' / ')} | ${Ns.map((N) => big(r2(N, rule, 'rigid').wTotRms)).join(' / ')} |`)].join('\n');
  T.t1drag = ['| 読み | 場 | RMS\\|d\\|/RMS\\|V\\| N ' + Ns.join(' / ') + ' | 連続の引きずりとの差 N ' + Ns.join(' / ') + ' | N の依存の傾き(\\|d\\|・分け前・連続との差) | 読み |', '|---|---|---|---|---|---|',
    ...J.plan.t1.rules.flatMap((rule) => J.plan.t1.fields.map((field) => { const s = A.t1slopes.find((x) => x.alpha === 2 && x.rule === rule && x.field === field);
      return `| ${RULE_LABEL[rule]} | ${FIELD_LABEL[field]} | ${Ns.map((N) => big(r2(N, rule, field).dOverV)).join(' / ')} | ${Ns.map((N) => big(r2(N, rule, field).contErr)).join(' / ')} | ${sl(s.dOverV)}・${sl(s.share)}・${sl(s.contErr)} | ${DEP_LABEL[s.dependD]} |`; }))].join('\n');
  T.t1alpha1 = ['| 読み(α 1) | 自己の分け前 N ' + Ns.join(' / ') + ' | RMS\\|d\\|/RMS\\|V\\|(散らばり)N ' + Ns.join(' / ') + ' | 傾き(\\|d\\|・分け前) |', '|---|---|---|---|',
    ...J.plan.t1.rules.map((rule) => { const s = A.t1slopes.find((x) => x.alpha === 1 && x.rule === rule && x.field === 'iso'); return `| ${RULE_LABEL[rule]} | ${Ns.map((N) => f3(r2(N, rule, 'iso', 1).shareMean)).join(' / ')} | ${Ns.map((N) => big(r2(N, rule, 'iso', 1).dOverV)).join(' / ')} | ${sl(s.dOverV)}・${sl(s.share)} |`; })].join('\n');
  T.arrange = ['| 並び(一様な球・ε 0.05) | 要素の数 | 受け手(r < 0.5) | 自己なし: 全体の重み ÷ 連続 − 1 | B: 同 | B の自己の重み w^B |', '|---|---|---|---|---|---|',
    ...J.t1arrange.flatMap((r) => ['lattice', 'random'].map((k) => `| ${k === 'lattice' ? '格子' : '乱数'}(格子の辺 ${r.nSide} の個数) | ${r.n} | ${r[k].nRecv} | ${pc(r[k].biasNone)} | ${pc(r[k].biasB)} | ${f3(r.shareB)} |`))].join('\n');
  T.t1dyn = ['| N | 読み | 自己の分け前 | ' + SK.map((k) => SKL[k]).join(' | ') + ' | 熱の口 Q/\\|E₀\\| |', '|---|---|---|' + SK.map(() => '---').join('|') + '|---|',
    ...A.t1dyn.map((r) => `| ${r.N} | ${DYN_RULE_LABEL[r.self]} | ${r.shareMean === null ? '0' : f3(r.shareMean)} | ${SK.map((k) => ev(k, r.eff[k])).join(' | ')} | ${big(r.Q)} |`)].join('\n');
  T.t1dynSlope = ['| 読み | 分け前の傾き | ' + ['r10', 'r50', 'r90', 'sigR', 'sigT'].map((k) => SKL[k] + ' の効きの傾き').join(' | ') + ' | 読み(r50) |', '|---|---|' + ['r10', 'r50', 'r90', 'sigR', 'sigT'].map(() => '---').join('|') + '|---|',
    ...A.t1dynSlope.map((r) => `| ${DYN_RULE_LABEL[r.self]} | ${sl(r.share)} | ${['r10', 'r50', 'r90', 'sigR', 'sigT'].map((k) => sl(r.eff[k])).join(' | ')} | ${DEP_LABEL[r.dependR50]} |`)].join('\n');
  T.t2ledger = ['| 型 | γ [1/t_cr] | \\|ΔP\\|/(M v_rms) | \\|ΔL\\|/(M r_h v_rms) | E の残差 | 熱の口 Q/\\|E₀\\| | 内部のエネルギー U/\\|E₀\\| | σ²_pec 0 → T | σ²_int(T) |', '|---|---|---|---|---|---|---|---|---|',
    ...A.t2.map((r) => `| ${TYPE_LABEL[r.type]} | ${r.gammaTcr} | ${lt(r.ledger.dP, 1e-12)} | ${lt(r.ledger.dL, 1e-12)} | ${big(r.ledger.resid)} | ${big(r.ledger.Q)} | ${big(r.ledger.U)} | ${f3(r.ledger.sig2pec0)} → ${f3(r.ledger.sig2pec1)} | ${f3(r.ledger.sig2int1)} |`)].join('\n');
  T.t2eff = ['| 型 | γ [1/t_cr] | ' + SK.map((k) => SKL[k]).join(' | ') + ' |', '|---|---|' + SK.map(() => '---').join('|') + '|',
    ...A.t2.filter((r) => r.type !== 'grav').map((r) => `| ${TYPE_LABEL[r.type]} | ${r.gammaTcr} | ${SK.map((k) => ev(k, r.eff[k])).join(' | ')} |`)].join('\n');
  const TK = J.plan.t3.keys, TKL = { r10: 'r10', r50: 'r50', r90: 'r90', vir: '2K/\\|W\\|', sigR: 'σ_r', resid: 'E の残差' };
  T.t3 = ['| 作用 | ' + TK.map((k) => TKL[k] + ' e₁ / e₂ (p)').join(' | ') + ' | 位置の RMS の差 ÷ r_h e₁ / e₂ | 刻みで決まる向き(量の数) | 陰の反復の残り h / h/2 / h/4 |', '|---|' + TK.map(() => '---').join('|') + '|---|---|---|',
    ...A.t3.map((r) => `| ${ACT_LABEL[r.action]} | ${TK.map((k) => `${big(r.keys[k].e1)} / ${big(r.keys[k].e2)} (${r.keys[k].order === null ? '—' : r.keys[k].order.toFixed(2)})`).join(' | ')} | ${big(r.pos.e1)} / ${big(r.pos.e2)} | ${r.nByStep}/${TK.length} | ${r.iterResid.every((x) => x === null) ? '—' : r.iterResid.map(big).join(' / ')} |`)].join('\n');
  T.t3vals = ['| 作用 | ' + TK.map((k) => TKL[k] + ' h / h/2 / h/4').join(' | ') + ' |', '|---|' + TK.map(() => '---').join('|') + '|',
    ...A.t3.map((r) => `| ${ACT_LABEL[r.action]} | ${TK.map((k) => r.keys[k].vals.map(big).join(' / ')).join(' | ')} |`)].join('\n');
  T.t4static = ['| 模型 | 読み | RMS\\|d\\|/σ | ⟨d_φ⟩/σ | ⟨d_r⟩/σ | 局所との相関 | 自己の分け前(B) |', '|---|---|---|---|---|---|---|',
    ...J.t4static.map((r) => `| ${r.model === 'rotate' ? '回転の支え(v_rot/σ 0.3)' : 'Plummer 球'} | ${READ_LABEL[r.reading]} | ${f3(r.dRms)} | ${f3(r.dPhi)} | ${f3(r.dR)} | ${f3(r.corrLocal)} | ${f3(r.shareMean)} |`)].join('\n');
  T.t4dyn = ['| 読み(回転の支え・N ' + J.plan.t4.dynN + '・押し γ 0.1/t_cr・3 t_cr) | ' + SK.map((k) => SKL[k]).join(' | ') + ' | \\|ΔL\\| | \\|ΔP\\| |', '|---|' + SK.map(() => '---').join('|') + '|---|---|',
    ...A.t4dyn.map((r) => `| ${READ_LABEL[r.reading]} | ${SK.map((k) => ev(k, r.eff[k])).join(' | ')} | ${f3(r.ledger.dL)} | ${f3(r.ledger.dP)} |`)].join('\n');
  T.t5 = ['| 中心 | 列 | 自己の重み | γ | e の散らばりの率 [/公転] | 傾きの散らばりの率 [/公転] | 重力だけとの差(e・傾き) | σ_e と σ_i の終わり ÷ 初め | 長半径の平均の変化 | β の最小 |', '|---|---|---|---|---|---|---|---|---|---|',
    ...A.t5.map((r) => `| ${r.center === 'single' ? '単体' : '連星(質量比 1)'} | ${COL_LABEL[r.col]} | ${r.self === 'B' ? 'B' : r.self === 'K9' ? 'K = 9(f(1) = 0.1)' : 'なし'} | ${r.gamma} | ${big(r.rateE)}(${TREND[r.trendE]}) | ${big(r.rateI)}(${TREND[r.trendI]}) | ${big(r.dRateE)}・${big(r.dRateI)} | ${big(r.ratioE)}・${big(r.ratioI)} | ${big(r.dA)} | ${f3(r.betaMin)} |`)].join('\n');
  T.t5axial = ['| 中心 | 読み | 自己の重み | ω_ax,z ÷ s(要素の平均・最小〜最大) | 向き | e の散らばりの率 | 傾きの散らばりの率 | 重力だけとの差(e・傾き) |', '|---|---|---|---|---|---|---|---|',
    ...A.t5.filter((r) => r.omegaZ).map((r) => `| ${r.center === 'single' ? '単体' : '連星(重心の 1 源とみなす)'} | ${COL_LABEL[r.col]} | ${r.self === 'B' ? 'B(f ≈ 1)' : 'K = 9(f(1) = 0.1)'} | ${f3(r.omegaZ.mean)}(${f3(r.omegaZ.min)}〜${f3(r.omegaZ.max)}) | ${r.omegaZ.max < 0 ? '源の回転と逆' : r.omegaZ.min > 0 ? '源の回転と同じ' : '混じる'} | ${big(r.rateE)}(${TREND[r.trendE]}) | ${big(r.rateI)}(${TREND[r.trendI]}) | ${big(r.dRateE)}・${big(r.dRateI)} |`)].join('\n');
  const C = J.cost;
  T.cost = ['| 動的の走行の本数 | 力の評価の回数(N の直接の和) | 環の走行の本数 |', '|---|---|---|', `| ${C.runs} | ${C.evals} | ${C.rings} |`].join('\n');   // 所要の秒は走らせ直すと動くので表に載せない
  T.gates = ['| 門 | 値 |', '|---|---|', ...Object.entries(J.gates).map(([k, v]) => `| ${k} | ${tf(v)} |`)].join('\n');
  return T;
}

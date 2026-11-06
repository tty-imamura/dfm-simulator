// 第328便a(原仮定者の回答(2026-11-05 —— AN551・AN552・AN553)・統括の検証項目 R301): **正本 tests/out/fieldcontract-w328a.json から PHYSICS〔第328便a〕の表を作る文書の lib**
// (QA docs.fieldContract328a が節の表と逐語で照合する —— 表の数は有効数字 4 桁・丸めの程度の数〔照合の残差など〕は「< 1e-12」の形で書き、数そのものは載せない)。
export const DOC_VERSION = 'w328a-fieldcontractdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toExponential(3));
const lt = (x, t = 1e-12) => (Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : '**' + fe(x) + '**');
const sg = (x) => (x > 0 ? '+' : x < 0 ? '−' : '0');
const tf = (x) => (x === true ? '真' : x === false ? '偽' : 'null');
const nv = (x) => (x === null ? 'null' : typeof x === 'number' ? fe(x) : String(x));
export const COL_JA = Object.freeze({ direct: '直接の滑り g_T(Ω_arm − Ω_field)ĝ', halfCurl: '半渦度 ½∇×u', rigid: '剛体の読み (u_φ/R)ĝ', shear: 'シア (∂_R u_φ − u_φ/R)ĝ', k1Mirror: 'K1 の源の幾何 (2n̂n̂ᵀ − I)(u_φ/R)ĝ' });
export const OLD_JA = Object.freeze({ mainCheckNorm: '太陽の位置・照合の別経路と正規化つき(第327便b の経路 2 と同じ呼び出し)', plain: '太陽の位置・既定の opts', zMinusCheck: '太陽の位置の面から −0.02 kpc・照合の別経路つき',
  split: '太陽の位置・中心と残余の 2 項(R_cut 4 kpc)', outside: '有効域の外(R = 50 kpc)', proxy: '太陽の位置・代理の J 双極子の項' });
const SYS_JA = Object.freeze({ sunOnly: '太陽だけ', solve4: '太陽・金星・木星・イオ(p = 0)' });
const BODY_JA = Object.freeze({ sun: '太陽', venus: '金星', jupiter: '木星', io: 'イオ' });
const STATUS_JA = Object.freeze({ added: '足した', declaredOnly: '宣言だけ(回転する枠の入力は版 1 の外)', refOnly: '参照だけ(帳簿の計算は第326便d の lib)' });
export function tablesOf(J) {
  const T = {}, CT = J.contract, M = CT.main, N0 = CT.nullContract, SP = CT.splitContract, D = J.direct, K = J.controls, Lg = J.dual, Gv = J.convergence, Y = J.degeneracy, H = J.handoff;
  // 表 1 契約の値(太陽の位置 —— 宣言の候補・宣言なし・中心と残余)
  {
    const ids = (c) => (c.sources === null ? 'null' : c.sources.map((q) => q.sourceId).join('・'));
    const row = (k, f) => `| ${k} | ${f(M)} | ${f(N0)} | ${f(SP)} |`;
    T.contract = ['| 鍵 | 太陽の位置の契約(宣言の候補) | 宣言なしの契約 | 中心と残余の契約 |', '|---|---|---|---|',
      row('version', (c) => c.version), row('frame.id・axis', (c) => c.frame.id + '・(' + c.frame.axis.join(', ') + ')'), row('frame.timeUnit・lengthUnit', (c) => c.frame.timeUnit + '・' + c.frame.lengthUnit),
      row('frame.omegaFrame [rad/s]', (c) => String(c.frame.omegaFrame)), row('omegaField.mode・unit', (c) => c.omegaField.mode + '・' + c.omegaField.unit),
      row('omegaField.value [rad/s]', (c) => nv(c.omegaField.value)), row('omegaField.at', (c) => (c.omegaField.at === null ? 'null' : 'R ' + c.omegaField.at.R_kpc + ' kpc・z ' + c.omegaField.at.z_kpc + ' kpc')),
      row('omegaField.source', (c) => nv(c.omegaField.source)), row('convergence.uConverged・curlConverged', (c) => tf(c.convergence.uConverged) + '・' + tf(c.convergence.curlConverged)),
      row('convergence.gridSigns', (c) => (c.convergence.gridSigns === null ? 'null' : c.convergence.gridSigns.map(sg).join(' '))), row('sources(sourceId)', ids),
      row('transfer.form・version・gT', (c) => c.transfer.form + '・' + c.transfer.version + '・' + nv(c.transfer.gT)),
      row('ledgerRefs.supply・reaction・heat', (c) => [c.ledgerRefs.supply, c.ledgerRefs.reaction, c.ledgerRefs.heat].map((s) => s.replace(/^[^#]*#/, '')).join('・'))].join('\n');
  }
  // 表 2 古い呼び出しのビット同一
  T.old = ['| 呼び出し(契約を求めない) | 第321便c の sample と | 戻り値の鍵 fieldContract | 有効域の内 |', '|---|---|---|---|']
    .concat(J.old.rows.map((q) => `| ${OLD_JA[q.key]} | ${q.bitSame ? '同じ(JSON の文字列で同じ)' : '**違う**'} | ${q.noFieldContract ? '無し' : '**有り**'} | ${tf(q.ok)} |`))
    .concat([`| 契約を求めた呼び出しの fieldContract 以外の鍵(太陽の位置・照合の別経路と正規化つき) | ${CT.restBitSame ? '同じ(JSON の文字列で同じ)' : '**違う**'} | 有り(最後の鍵) | 真 |`]).join('\n');
  // 表 3 直接の滑りの太陽の式の検査
  T.direct = ['| 量 | 値 |', '|---|---|',
    `| 太陽の式の A(第327便b の経路 1 —— 族 E・今の K1)[rad/s] | ${fe(D.A)} |`,
    `| 宣言: g_T(第326便d の銀河の口と同じ利得) | ${fe(D.gT)} |`,
    `| 宣言: Ω_arm(腕のパターンの角速度の文献の範囲の上端)[rad/s] | ${fe(D.OmegaArm)} |`,
    `| 宣言の候補: Ω_field = Ω_arm − A/g_T [rad/s] | ${fe(D.OmegaField)} |`,
    `| 契約から作った ν_G·ĝ = g_T(Ω_arm − Ω_field)[rad/s] | ${fe(D.nuAlong)} |`,
    `| ν_G·ĝ と A の相対の差(太陽の式の閉じ) | ${lt(D.closureRel)} |`,
    `| 第327便b の直接の型の要る Ω_field との相対の差 | ${lt(D.vs327bOmegaField)} |`,
    `| 前提 Ω_field > Ω_arm > 0 | ${tf(D.premise)} |`,
    `| 腕に対する相対 Ω_arm − Ω_field [rad/s] | ${fe(D.rel.toArm)} |`,
    `| 物質に対する相対 Ω_mat − Ω_field [rad/s] | ${fe(D.rel.toMatter)} |`,
    `| 二つの相対の差(= Ω_arm − Ω_mat)[rad/s] | ${fe(D.relDiff)} |`,
    `| Ω_field/Ω_mat・周期 2π/Ω_field [s] | ${fe(D.overOmMat)}・${fe(D.periodS)} |`,
    `| Ω_arm を文献の範囲の下端にしたときの Ω_field の相対の差 | ${lt(D.armSensRel, 1e-9)} |`,
    `| 宣言なしの契約の直接の滑り | ${D.nullSlip.nu === null ? 'null(欠測 —— 0 で埋めない)' : '**' + String(D.nullSlip.nu) + '**'} |`].join('\n');
  // 表 4 対照の列(第327便b の表の列と同じ値)
  {
    const conv = (k) => (k === 'direct' ? '—' : Gv.perCandidate[k].converged ? '真' : '偽');
    T.controls = ['| 列 | 役割 | ν_G·ĝ(太陽の位置)[rad/s] | 第327便b の表と(ν_G·ĝ・利得・要る Ω_rel の相対の差) | 利得 g_T(単位 Ω_mat あたり) | 要る Ω_rel = A/g_T [rad/s] | 前提(Ω_rel < 0)と | その利得で太陽の式を閉じる Ω_field [rad/s] | 格子の印 |',
      '|---|---|---|---|---|---|---|---|---|']
      .concat(K.rows.map((q) => `| ${COL_JA[q.key]} | ${q.role === 'declared' ? '本の宣言の型' : '対照'} | ${q.alongG === null ? '—' : fe(q.alongG)} | ${q.vs327bAlong === null ? '—' : lt(q.vs327bAlong)}・${lt(q.vs327bGain)}・${lt(q.vs327bOmRel)} | ${fe(q.gain)} | ${fe(q.OmRelReq)} | ${q.consistent ? '両立' : '両立しない'} | ${q.OmegaFieldReq === null ? '—' : fe(q.OmegaFieldReq)} | ${conv(q.key)} |`)).join('\n');
  }
  // 表 5 双対(口ごと)と 表 6 帳簿(系ごと)
  {
    const rows = [];
    for (const s of Lg.systems) for (const p of s.ports) rows.push(`| ${SYS_JA[s.key]} | ${BODY_JA[p.key] || p.key} | ${fe(p.supply)} | ${fe(p.workArm)} | ${fe(p.workField)} | ${lt(p.supplyRel)} | ${fe(p.reactionArm)} | ${fe(p.reactionField)} | ${p.reactionSum === 0 ? '0' : '**' + fe(p.reactionSum) + '**'} | ${fe(p.mismatchRel)} |`);
    T.dualPorts = ['| 系 | 天体(銀河の口) | 口の供給 N·ν τ_0 [J](Γ⁰ τ_0 = I) | 腕の口座の仕事 −τ_arm Ω_arm | 場の口座の仕事 −τ_field Ω_field | 腕 + 場 と N·ν(相対の差) | 腕の反作用 τ_arm = −g_T(N·ĝ) | 場の反作用 τ_field = +g_T(N·ĝ) | 反作用の和 | 場の反作用の係数を 2 倍にした否定対照(相対の差) |',
      '|---|---|---|---|---|---|---|---|---|---|'].concat(rows).join('\n');
    T.dualLedger = ['| 系 | Σ(腕 + 場)と ledger.galaxySupply | 帳簿の残差(供給を一度だけ数える) | 腕 + 場 を galaxySupply に重ねた帳簿の残差(否定対照) | 角運動量の残り −ΣN と ledger.L.galaxyCenter | 契約の ν と第326便d の A |', '|---|---|---|---|---|---|']
      .concat(Lg.systems.map((s) => `| ${SYS_JA[s.key]} | ${lt(s.sumVsLedger)} | ${lt(s.ledgerResidualRel)} | ${fe(s.doubledRel)} | ${lt(s.remainderRel)} | ${lt(s.AVsContract)} |`)).join('\n');
  }
  // 表 7 収束の印(u と curl を別に)
  {
    const g = Gv.grids.map((q) => q.join('・')).join(' / '), pc = Gv.perCandidate;
    T.conv = ['| 量 | 格子(' + g + ')の符号の列 | 384 の格子の相対の差 | 印 |', '|---|---|---|---|',
      `| u_φ(契約の uConverged) | + + + + | ${fe(Gv.uLastRel)} | ${tf(Gv.uConverged)} |`,
      `| 半渦度の ĝ の成分(契約の curlConverged) | ${Gv.gridSigns.map(sg).join(' ')} | ${fe(pc.halfCurl.lastRel)} | ${tf(Gv.curlConverged)} |`,
      `| 剛体の読み(対照) | ${pc.rigid.signs.map(sg).join(' ')} | ${fe(pc.rigid.lastRel)} | ${tf(pc.rigid.converged)} |`,
      `| シア(対照) | ${pc.shear.signs.map(sg).join(' ')} | ${fe(pc.shear.lastRel)} | ${tf(pc.shear.converged)} |`,
      `| K1 の源の幾何(対照) | ${pc.k1Mirror.signs.map(sg).join(' ')} | ${fe(pc.k1Mirror.lastRel)} | ${tf(pc.k1Mirror.converged)} |`,
      `| 照合の別経路(環の積分と u_φ の 4 次の中心差分 —— 半渦度に対して) | — | ${lt(Gv.routeRel, 1e-9)} | 格子の印とは別の経路 |`].join('\n');
  }
  // 表 8 縮退
  T.degeneracy = ['| 宣言の g_T | 太陽の式を閉じる Ω_field [rad/s] | g_T(Ω_arm − Ω_field) と A(相対の差) | 前提と |', '|---|---|---|---|']
    .concat(Y.rows.map((q) => `| ${fe(q.gT)} | ${fe(q.OmegaField)} | ${lt(q.productRel)} | ${q.consistent ? '両立' : '両立しない'} |`))
    .concat([`| 1 式の Jacobian [∂/∂g_T, ∂/∂Ω_field] のランク | ${Y.rankOne}(未知 ${Y.unknowns}) | 異なる組 ${Y.distinctPairs} | 解かない |`]).join('\n');
  // 表 9 引き継ぎの成分の行き先
  T.handoff = ['| 第327便b の無かった成分 | 契約の鍵 | 状態 | 中身 |', '|---|---|---|---|'].concat(H.rows.map((q) => `| ${q.key} | ${q.to} | ${STATUS_JA[q.status]} | ${q.ja} |`)).join('\n');
  return T;
}

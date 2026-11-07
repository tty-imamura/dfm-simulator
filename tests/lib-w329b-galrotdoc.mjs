// 第329便b(原仮定者の方針(2026-11-07)・原仮定者の回答(2026-11-07 —— AN568・AN569・AN570)・統括の検証項目 R305): **正本 tests/out/galrot-w329b.json から PHYSICS〔第329便b〕の表を作る文書の lib**
// (QA docs.galRot329b が節の表と逐語で照合する —— 表の数は有効数字 4 桁・丸めの程度の数〔照合の残差など〕は「< 1e-12」の形で書き、数そのものは載せない)。
export const DOC_VERSION = 'w329b-galrotdoc-1';
const fe = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toExponential(3));
const f3 = (x) => (x === null || x === undefined || !Number.isFinite(x) ? '—' : Number(x).toPrecision(4));
const lt = (x, t) => (Number.isFinite(x) && Math.abs(x) <= t ? '< ' + t.toExponential(0) : '**' + fe(x) + '**');
const tf = (x) => (x === true ? '真' : x === false ? '偽' : 'null');
const pm = (v, s) => (v === null || v === undefined ? '—' : f3(v) + (s === null || s === undefined ? '' : ' ± ' + f3(s)));
const bin = (q) => q.lo + '〜' + q.hi;
/** ラベルの表の半径(rotmod の 43 点から —— 内側・立ち上がり・平坦の部分の代表) */
export const LABEL_RADII = Object.freeze([1.28, 2.24, 3.21, 4.17, 6.1, 8.04, 10.04, 14.05, 20.05, 26.1, 32.14, 38.19, 42.17]);
export function tablesOf(J) {
  const T = {}, LB = J.labels, CT = J.contract, PT = J.port, B = J.baseline, D = J.dfm, EV = J.evolve, E = J.eta, M = J.mw, t0s = String(J.plan.probeT[0]), t1s = String(J.plan.probeT[1]);
  // 表 1 NGC 3198 の既存理論のラベル(局所の二次の当てはめ —— κ_epi は中心差分も並べる)
  {
    const Q = LB.tables.localQuad, C = LB.tables.centralDiff, at = (tb, R) => tb.find((q) => Math.abs(q.R - R) < 1e-9);
    T.labels = ['| R [kpc] | Ω | A_O | B_O | κ_epi(局所の二次) | κ_epi(中心差分) | Ω − κ_epi/2 | (Ω − κ_epi/2)·R [km/s] | κ_epi/Ω |', '|---|---|---|---|---|---|---|---|---|']
      .concat(LABEL_RADII.map((R) => { const q = at(Q, R).labels, c = at(C, R).labels, s = q.sigma;
        return `| ${R} | ${pm(q.Omega, s.Omega)} | ${pm(q.A_O, s.A_O)} | ${pm(q.B_O, s.B_O)} | ${pm(q.kappaEpi, s.kappaEpi)} | ${c ? pm(c.kappaEpi, c.sigma.kappaEpi) : '—'} | ${pm(q.OmMinusHalfK, s.OmMinusHalfK)} | ${f3(q.OmMinusHalfK * R)} | ${f3(q.kappaEpi / q.Omega)} |`; })).join('\n');
  }
  // 表 2 恒等式と物質線の反例
  {
    const S = LB.scenes;
    T.identity = ['| 場面 | 値 |', '|---|---|',
      `| 平坦(n = 0): A_O = −B_O = Ω/2・κ_epi = √2 Ω | ${tf(S.flat.AeqMinusB && S.flat.kappaSqrt2)} |`,
      `| 平坦(v₀ = 1): Ω − κ_epi/2 の R = 1・2・4 | ${S.flat.omMinus.map(f3).join('・')}(R 倍は ${f3(S.flat.omMinusTimesR[0])} —— 1/R で変わる) |`,
      `| 剛体(n = 1): A_O・B_O/Ω・κ_epi/Ω・Ω − κ_epi/2 | ${f3(S.rigid.A)}・${f3(S.rigid.B / S.rigid.Om)}・${f3(S.rigid.k / S.rigid.Om)}・${lt(S.rigid.omMinus, 1e-15)} |`,
      `| ケプラー(n = −½): κ_epi/Ω・A_O/Ω・B_O/Ω | ${f3(S.kepler.kOverOm)}・${f3(S.kepler.AoverOm)}・${f3(S.kepler.BoverOm)} |`,
      `| 物質線 n = −1 の 1 公転後の慣性系の向き [rad](公式) | ${S.line.angle.toFixed(6)}(−2π ではない) |`,
      `| 同(2 点の追跡 —— 別の経路)の相対の差 | ${lt(S.line.trackRel, 1e-5)} |`,
      `| 同の初めの回転率(Ω = 1) | ${f3(S.line.rate0)}(瞬間の値 nΩ) |`,
      `| 平坦(n = 0)・剛体(n = 1)の 1 公転後の向き [rad] | ${S.line.flatOne.toFixed(6)}・${S.line.rigidOne.toFixed(6)} |`,
      `| 微分の型の打ち切りの誤差(ケプラーの表の κ_epi —— 中心差分・局所の二次) | ${fe(S.deriv.keplerErrC)}・${fe(S.deriv.keplerErrQ)} |`].join('\n');
  }
  // 表 3 場の契約の版 2 の試験
  {
    const R = CT.rotating;
    T.contract2 = ['| 試験 | 結果 |', '|---|---|',
      `| 古い呼び出し(版 2 の口・契約を求めない —— 既定・中心と残余・有効域の外)が第321便c の sample と | ${CT.old.every(Boolean) ? '同じ(JSON の文字列で同じ)' : '**違う**'} |`,
      `| 版 1 の契約を求めた呼び出し(版 2 の口)が第328便a の sampleWithContract と | ${CT.old328 ? '同じ' : '**違う**'} |`,
      `| 宣言の無い枠の版 2 を版 1 の形へ写した契約が第328便a の正本の契約と | ${CT.v1proj.sameAs328a ? '同じ(JSON の文字列で同じ)' : '**違う**'} |`,
      `| 恒等の枠の u・∇u・半渦度が場の API と | ${Object.values(CT.identity).every(Boolean) ? 'ビット同一' : '**違う**'} |`,
      `| 軸と原点の取り換え(R_z 0.6 rad・R_x 0.25 rad・原点 (1, −0.5, 0.1) kpc): u′ と Qᵀu・‖u′‖ と ‖u‖・半渦度 | ${lt(CT.axes.uRel, 1e-14)}・${lt(CT.axes.normRel, 1e-14)}・${lt(CT.axes.halfCurlRel, 1e-13)} |`,
      `| 回す枠(Ω_frame = Ω_mat ${fe(R.OmegaFrame)} rad/s・銀河中心の回り): u_φ → u′_φ [m/s] | ${fe(R.u[1])} → ${fe(R.uFrame[1])} |`,
      `| 同: 引いた分 u_Ω [m/s] と単純な差 Ω_frame â × x β(x) の比 | ${fe(R.uOmega[1])}・比 ${f3(R.naiveRatio)}(重みつきの積分 —— 単純な差ではない) |`,
      `| 同: Ω_frame を 2 倍にした u_Ω の比・∇u′ と半渦度 | ${f3(R.linear)}・null(版 2 の外 —— 0 で埋めない) |`,
      `| 太陽を原点に共に回す枠(原点の速さ V0 ŷ): u′_φ [m/s]・−β v_o と u_Ω | ${fe(R.solarFrame.u[1])}・${fe(-R.solarFrame.betaVo[1])}・${fe(R.solarFrame.uOmega[1])} |`,
      `| 器の積分の道具(u_φ と β を第321便c の値と —— 面の上・z = 0.3 kpc) | ${lt(CT.tool.z0.maxRel, 1e-12)}・${lt(CT.tool.z03.maxRel, 1e-12)} |`,
      `| 同じ点の相対の速さ(枠の原点から離れた点)が Qᵀ で回るだけ・往復 | ${lt(CT.relVel.rel, 1e-12)}・${lt(CT.relVel.roundTrip, 1e-14)} |`,
      `| 受け手だけに Ω_frame ĝ′ × x′ を足し戻す(否定対照)の相対の差 | **${f3(CT.relVel.doubledRel)}**(引いた速さを引きずりへもう一度足さない) |`,
      `| 天の川の契約の直接の滑り ν_G·ĝ [rad/s] と第328便a の値・枠の中の差で作った滑り | ${fe(CT.mw.slipNu)}・${lt(CT.mw.slipVs328a, 1e-12)}・${lt(CT.mw.slipInFrameRel, 1e-9)} |`,
      `| 回す枠の契約を版 1 へ写す・Ω_arm が契約に有る | ${CT.mw.toV1 ? '**写せた**' : '写さない(null と理由)'}・${CT.mw.armInContract ? '**有る**' : '無い(受け手の側)'} |`,
      `| g_T と Ω_field のヤコビアン(3 天体の行)のランク・未知の数 | ${CT.rank.rank}・${CT.rank.unknowns} |`,
      `| 純関数の場面(lib) | ${Object.values(CT.pure.gates).filter(Boolean).length}/${Object.keys(CT.pure.gates).length} |`].join('\n');
  }
  // 表 4 天の川の太陽の近傍の契約の rates と labels
  {
    const c = CT.mw.contract, r = c.rates, L = c.labels;
    T.rates = ['| 欄 | 値 | 出どころ |', '|---|---|---|',
      `| frame.originKpc・originVelocity [m/s]・omegaFrame [rad/s] | (${c.frame.originKpc.join(', ')})・(${c.frame.originVelocity.join(', ')})・${fe(c.frame.omegaFrame)} | 太陽を原点に共に回す枠(宣言) |`,
      `| rates.omegaFrame [rad/s] | ${fe(r.omegaFrame)} | frame.omegaFrame の写し |`,
      `| rates.omegaMat [rad/s] | ${fe(r.omegaMat.value)} | ${r.omegaMat.source} |`,
      `| rates.omegaField [rad/s] | ${fe(r.omegaField)} | 第328便a の宣言の候補(g_T = 1) |`,
      `| rates.omegaP [rad/s] | ${fe(r.omegaP)} | labels の Ω − κ_epi/2(m = 2 の内側 Lindblad 共鳴の条件の値 —— R0 だけ) |`,
      `| Ω_arm | 契約に無い | 受け手の側の入力(滑りの関数の引数 —— AN569) |`,
      `| labels.A_O・B_O・Ω・κ_epi [km s⁻¹ kpc⁻¹] | ${f3(L.A_O)}・${f3(L.B_O)}・${f3(L.Omega)}・${f3(L.kappaEpi)} | ${L.source} |`].join('\n');
  }
  // 表 5 ラベルの口(AN570 の B の限定)
  {
    const P = PT.diag, N = PT.nearRow, z = PT.diffInSigma;
    T.port = ['| 量 [km s⁻¹ kpc⁻¹] | 🌃 の本(宣言なし) | 診断の宣言(平坦の恒等式・V_flat・R ' + P.at.RKpc + ' kpc) | 表のラベル(R ' + N.R + ' kpc・局所の二次) | 差(表の σ の単位) |', '|---|---|---|---|---|',
      ...[['A_O', 'A_O', 'A_O'], ['B_O', 'B_O', 'B_O'], ['Ω', 'Omega', 'Omega'], ['κ_epi', 'kappaEpi', 'kappaEpi'], ['Ω − κ_epi/2(Ω_p のラベル)', 'OmegaP', 'OmMinusHalfK']]
        .map(([ja, kp, kl]) => `| ${ja} | ${PT.bookPort[kp] === null ? 'null' : f3(PT.bookPort[kp])} | ${f3(P[kp])} | ${pm(N[kl], N.sigma[kl])} | ${f3(z[kl])} |`),
      `| 場の API の半渦度を口に置く | — | ${PT.halfCurlRejected ? '拒否' : '**受けた**'} | — | — |`].join('\n');
  }
  // 表 6 NGC 3198 の基準列(rotmod の写し —— 箱ごと)
  {
    const U3 = B.sensUpsilon['0.3'], U8 = B.sensUpsilon['0.8'];
    T.baseline = ['| 箱 [kpc] | 点 | ⟨v_obs²⟩ | ⟨v_bar²⟩(Υ_disk 0.5) | v_obs² − v_bar² ± σ | 有意に正(2σ) | Υ_disk 0.3 | Υ_disk 0.8 |', '|---|---|---|---|---|---|---|---|']
      .concat(B.bins.map((q, k) => `| ${bin(q)} | ${q.n} | ${f3(q.vobs2)} | ${f3(q.vbar2)} | ${pm(q.deficit, q.sigma)} | ${tf(q.significant)} | ${f3(U3[k].deficit)} | ${f3(U8[k].deficit)} |`))
      .concat([`| 写しの照合 | ${B.fixture.n} | sha256 ${B.fixture.shaSame ? '同じ' : '**違う**'}・生の文の読み直し ${B.fixture.parsedSame ? '同じ' : '**違う**'} | CSV の v_rot ${B.csvCompared} 行と V_obs ${B.csvMaxAbsDiff === 0 ? '同じ' : '**違う**'} | 距離 ${f3(B.fixture.distanceMpc)} Mpc | 第三者の写し ${tf(B.fixture.thirdParty)} | — | — |`]).join('\n');
  }
  // 表 7 DFM の OFF/ON(同じ状態の 2 歩目 —— 🌃 の写し・観測の回転の速さで評価・h/4)
  {
    const pr = D.obsVel[t0s], last = pr.rows[pr.rows.length - 1].bins, fl = D.flat[t0s].rows[D.flat[t0s].rows.length - 1].bins, nh = D.noHalo[t0s].rows[D.noHalo[t0s].rows.length - 1].bins, acc = D.units.accSI;
    T.dfm = ['| 箱 [kpc] | 粒 | ⟨a_in⟩ [m/s²] | ⟨a_t⟩ [m/s²] | 内向きの平均 ÷ 接線の絶対値の平均 | Δv²_DFM = R a_in ± SE(観測の速さ) | 同(写しの平坦の速さ) | 同(🛞 ハローなし・観測の速さ) |', '|---|---|---|---|---|---|---|---|']
      .concat(last.map((q, k) => `| ${bin(q)} | ${q.n} | ${q.ain === null ? '—' : fe(q.ain * acc)} | ${q.at === null ? '—' : fe(q.at * acc)} | ${f3(q.ratioInT)} | ${q.dv2 === null ? (q.n < 3 ? '—(粒が少ない)' : '読めない(接線)') : pm(q.dv2, q.dv2SE)} | ${fl[k].dv2 === null ? (fl[k].n < 3 ? '—' : '読めない(接線)') : f3(fl[k].dv2)} | ${nh[k].dv2 === null ? (nh[k].n < 3 ? '—' : '読めない(接線)') : f3(nh[k].dv2)} |`))
      .concat([`| 刻みの収束(読める箱の Δv² の h/2 と h/4 の最大の相対の差 —— 観測の速さ・平坦の速さ・🛞) | — | — | — | — | ${f3(pr.convH2H4)} | ${f3(D.flat[t0s].convH2H4)} | ${f3(D.noHalo[t0s].convH2H4)} |`,
        `| kF の線形(kF 0.5 と 1 の蹴りの比の外れ)・1 歩目の同一(全部の探り) | — | — | — | — | ${f3(D.kFLinearMaxRel)} | ${[].concat(Object.values(D.flat), Object.values(D.obsVel), Object.values(D.noHalo), Object.values(D.noHaloFlat), [D.nSens]).every((p) => p.rows.every((r) => r.firstStepSame)) ? '同一' : '**違う**'} | — |`]).join('\n');
  }
  // 表 8 η(R) と M_eq と感度
  {
    const S = E.sens, cell = (a, k) => (a[k].eta === null ? '—' : f3(a[k].eta));
    T.eta = ['| 箱 [kpc] | η = Δv²_DFM/(v_obs² − v_bar²) | M_eq [M☉] | Υ_disk 0.3 | Υ_disk 0.8 | 距離 12.4 Mpc | 距離 15.2 Mpc | 粒 ×2 | 平坦の速さ | t* = ' + t1s + ' の状態 | 🛞 ハローなし |', '|---|---|---|---|---|---|---|---|---|---|---|']
      .concat(E.rows.map((q, k) => `| ${bin(q)} | ${q.eta === null ? '保留(' + q.why + ')' : pm(q.eta, q.etaSigma)} | ${q.Meq === null ? '—' : fe(q.Meq)} | ${cell(S.upsilon03, k)} | ${cell(S.upsilon08, k)} | ${cell(S.dist124, k)} | ${cell(S.dist152, k)} | ${cell(S.nMul2, k)} | ${cell(S.flatVel, k)} | ${cell(S.state10, k)} | ${cell(S.noHalo, k)} |`)).join('\n');
  }
  // 表 9 時間発展の後の差(定常の解ではない)
  {
    const r0 = EV.runs[0], r1 = EV.runs[EV.runs.length - 1];
    T.evolve = ['| T | 箱 [kpc] の Δ⟨v_t²⟩ = ON − OFF [km²/s²](h) | 同(h/2) | 刻みで決まる箱 |', '|---|---|---|---|']
      .concat(r0.diff.map((d, j) => `| ${d.T} | ${d.dvt2.map((x) => (x === null ? '—' : f3(x))).join('・')} | ${r1.diff[j].dvt2.map((x) => (x === null ? '—' : f3(x))).join('・')} | ${EV.resolved[j].nResolved}/${EV.resolved[j].nCompared} |`)).join('\n');
  }
  // 表 10 天の川の太陽の近傍の桁の比(同一視しない)
  T.mw = ['| 量 | 値 [rad/s] | 種類 | Ω_field との比 | log10 |', '|---|---|---|---|---|']
    .concat(M.rows.map((q) => `| ${q.ja} | ${fe(q.value)} | ${q.kind} | ${fe(q.ratioFieldOver)} | ${q.log10.toFixed(2)} |`)).join('\n');
  // 周転円の振動数の記号はコードの書式で(lint.kappaSymbol315 —— 文書の係数記号は κ_D だけ・コードの書式の中は引用として数えない)
  for (const k of Object.keys(T)) T[k] = T[k].replace(/κ_epi/g, '`κ_epi`');
  return T;
}

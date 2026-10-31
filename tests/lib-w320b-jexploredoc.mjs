// 第320便b(原仮定者の裁定(第122報)・決断事項 AN471・統括の検証項目 R263):
// **PHYSICS〔第320便b〕の表の行と本文の数を正本から作る純関数**(文書だけ —— 正本を作る器の meta.code に入れない: 表の書式を直しても正本の来歴は動かない)。
// QA docs.jExplore320b が PHYSICS〔第320便b〕と逐語で照合する。逐語照合する表に丸めの程度の数を書かない(求積と有限差分の差は fmtFloor の床 —— 床より小さい値は「< 床」)。
import { fmtFloor, ex, fx } from './lib-w311d-planet3.mjs';
export const DOC_LIB_VERSION = 'w320b-jexploredoc-1';

const yn = (b) => (b ? '真' : '偽');
const e2 = (x) => ex(x, 2), e3 = (x) => ex(x, 3);
const fq = (x) => (x === null ? '—' : fmtFloor(x, 1e-12, 1));
const fd = (x) => fmtFloor(x, 1e-11, 1);
const row = (k, J) => J.T.rows.find((r) => r.key === k);

/** 本文に書く数(QA が節の中にあることを照合する) */
export function docNumbersJExplore(J) {
  const p3 = row('p3', J), p2b = row('p2b', J), c3dA = row('c3dAll', J), c3e = row('c3e', J), c3h = row('c3h', J), c3g = row('c3g', J), D = J.D, B = J.B, P = J.P;
  const sat = B.per.find((r) => /^環/.test(r.recv)), me = B.per.find((r) => r.recv === '水星');
  return [fx(J.J.root.x, 7), e2(J.J.root.rel), e2(p3.me), e2(p3.ve), e2(p3.ju), e2(p2b.ju), fx(p3.S3, 2), fx(c3dA.S3, 2), fx(J.T.bestQ.withPlane.q, 3), fx(J.T.bestQ.withPlane.S3, 2),
    e2(c3e.veHeat), e2(c3e.tauJu), fx(c3h.S3, 2), fx(c3g.S3, 2), fx(D.prof[0].JOverRigid, 4), fx(D.prof[D.prof.length - 1].JOverRigid, 4), fx(D.IfracCore, 4), fx(P.double.ratioJup, 1),
    fx(P.konig[0].spinOnlyFrac, 4), e2(me.rotRel), e2(sat.rotRel), e2(sat.axRel), fx(J.S[0].factorJ / 1e8, 3), e2(p3.veHeat), e2(J.T.aux.coronaJFrac)];
}

export function physicsTablesJExplore(J) {
  const out = [], JJ = J.J, P = J.P, D = J.D, B = J.B, T = J.T, A = T.aux;
  // J1 有限球の場の点
  const g = JJ.grids.map((q) => q.nr + '×' + q.nmu + '×' + q.nphi).join('・');
  out.push(`| 場の点(単位の球 m = R = Ω = 1 —— J = (2/5) ẑ) | r/R | 内側 | abs(u)/K(解析 —— K = 5G_0/c_0²) | 半渦度の J の向きの成分 w_z/(J/R³)(解析) | 源の中心の球座標の求積の差(格子 ${g}) | 光線の求積の差(同じ格子) | 有限差分の curl の差(h = ${JJ.fdH}・h/2) |`,
    '|---|---|---|---|---|---|---|---|');
  for (const r of JJ.rows) out.push(`| ${r.ja} | ${fx(r.d, 4)} | ${yn(r.inside)} | ${fx(r.uAbs, 5)} | ${fx(r.wJ, 5)} | ${r.q1.map(fq).join('・')} | ${r.q2.map(fq).join('・')} | ${fd(r.fdH)}・${fd(r.fdH2)} |`);
  out.push('', '| 有限球の量 | 値 |', '|---|---|',
    `| 赤道面の半渦度の符号が変わる r/R(光線の求積の最も細かい格子・有限差分 h/2 の二分法 ${JJ.root.iter} 回) | ${fx(JJ.root.x, 7)}(解析 √(5/6) = ${fx(JJ.root.exact, 7)}・相対の差 ${e2(JJ.root.rel)}) |`,
    `| 境界の連続(R(1 ∓ 10⁻¹²) の u と w の相対の差の最大 —— 赤道面・軸の上・45°) | ${fmtFloor(Math.max(...JJ.cont.map((c) => Math.max(c.uRel, c.wRel))), 1e-10, 1)} |`,
    `| 中心の半渦度 w/(J/R³)(解析 5/2 —— 有限) | ${fx(JJ.centerW, 4)} |`,
    `| 外側の式 J/r² を源の内へ延ばした値 / 内側の解析(赤道面 r/R = ${JJ.farFormInside.map((q) => q.x).join('・')}) | ${JJ.farFormInside.map((q) => fx(q.ratio, 4)).join('・')} |`,
    `| エンジンの 1 つの源の写し(太陽の質量・dragCore.radius = R_src,J・赤道面の 100 R☉)の回転の項 / 外側の J の場(5G_0/c_0²) J/r² | ${fx(J.E.one.ratio, 7)} |`,
    `| 器の中の源のモーメントだけを J の半径に替えた写し(太陽を pinned・dragCore.radius = ${e3(J.E.engJ.RsrcSunM)} m): 受け手の β がビット同一・読み口と lib の差の最大(受け手 ${J.E.engJ.receivers}) | ${yn(J.E.engJ.betaSame)}・${fmtFloor(J.E.engJ.worst, 1e-15, 1)} |`,
    `| lib の K2・M2 とエンジンのビット同一・lib の節点の和の写しと 16 体の読み口の差の最大 | ${yn(J.E.K.k2Same)}・${yn(J.E.K.m2Same)}・${fmtFloor(J.E.K.replicaWorst, 1e-15, 1)} |`);
  // P 分割
  out.push('', '| 流れ | 立方格子の一辺 n | セル N | 離散の J / 連続の球の J | 固有の J の割合 | 遠方の和 / (5G_0/c_0²) J_total/D²(D = 100 R) | 固有の自転だけの和 / 双極子 | 今(R_src = R_d)の分けた写し / J | 案2a / J | 案2b / J |',
    '|---|---|---|---|---|---|---|---|---|---|');
  for (const r of P.rigid.concat(P.diff)) out.push(`| ${r.alpha === 0 ? '剛体' : '差動(Ω = Ω_0(1 − 0.5ϖ²/R²))'} | ${r.n} | ${r.N} | ${fx(r.JtotOverCont, 4)} | ${fx(r.fracInt, 4)} | ${fx(r.farOverDip, 6)} | ${fx(r.spinOnlyOverDip, 4)} | ${fx(r.nowOverJ, 4)} | ${fx(r.p2aOverJ, 4)} | ${fx(r.p2bOverJ, 4)} |`);
  out.push(`| 剛体 | 1 つの一様な球(分けない —— 解析) | 1 | 1 | 1 | 1 | 1 | 0(R_d ≪ R —— 太陽で 3.6e-9) | 1(f = 0.4 の球) | 2 |`);
  const [kr, kd] = P.konig, [qr, qd] = P.quad;
  out.push('', '| 分割の量 | 剛体 | 差動(α = 0.5) |', '|---|---|---|',
    `| 粗視化の恒等式 Σ_g[J_int,g + x_g × M_g v_g] と J_total の相対の差(n = ${kr.n}・${kr.groups} 群) | ${fmtFloor(kr.rel, 1e-12, 1)} | ${fmtFloor(kd.rel, 1e-12, 1)} |`,
    `| ${kr.groups} 群の固有の J だけを足した割合(公転の分を失う —— 残り) | ${fx(kr.spinOnlyFrac, 4)} | ${fx(kd.spinOnlyFrac, 4)} |`,
    `| 連続の球の J(源の中心の球座標の求積)/ 解析(2/5・2/7)の相対の差 | ${fmtFloor(qr.Jrel, 1e-12, 1)} | ${fmtFloor(qd.Jrel, 1e-12, 1)} |`,
    `| 連続の球の流れの遠方(D = 100 R)の u / 双極子 J/D² | ${fx(qr.farOverDip, 6)} | ${fx(qd.farOverDip, 6)} |`,
    `| 木星・土星の公転の角運動量(16 体の重心の系)/ 太陽の自転の J(f = 0.07) | ${fx(P.double.ratioJup, 1)}・${fx(P.double.ratioSat, 1)} | — |`);
  // D 太陽の J
  out.push('', '| 太陽の J の体積積分(宣言の密度の模型の重み) | 値 |', '|---|---|',
    `| Lane–Emden n = ${D.polyN} の ξ1・I/(MR²) | ${fx(D.xi1, 4)}・${fx(D.fPoly, 4)} |`,
    `| 中心の核 r < 0.2 R・対流層の底 r < 0.713 R の内の慣性モーメントの割合 | ${fx(D.IfracCore, 4)}・${fx(D.IfracTach, 4)} |`,
    `| 入力の本の太陽の自転 Ω_ref | ${fx(D.OmRefNHz, 2)} nHz |`,
    `| f m R² Ω_ref(f = 0.07)[kg m²/s]・日震学の桁 1.9×10⁴¹ との比 | ${e3(D.Jref)}・${fx(D.JrefOverLit, 3)} |`,
    `| 放射層 ${fx(D.prof[0].OradNHz, 0)} nHz・対流層の緯度の平均 ${fx(D.prof[0].OczNHz, 2)} nHz(赤道 ${fx(D.prof[0].AeqNHz, 2)} nHz)の J / (I Ω_ref)(中心の核の倍率 k = ${D.prof.map((p) => p.k).join('・')}) | ${D.prof.map((p) => fx(p.JOverRigid, 4)).join('・')} |`);
  // B 案2b
  out.push('', '| x = r/R_src | (M2/K2)/((2/5)R_src²/r) − 1 | 同 / z(z = (R_src/r)² —— 級数の係数 3/35 = 0.0857) | d(K1·M2/K2)/dr / (−(4/5)R_src²/r³) − 1 | 同 / z(係数 6/35 = 0.1714) |', '|---|---|---|---|---|');
  for (const s of B.series) out.push(`| ${s.x} | ${e3(s.rotRel)} | ${fx(s.rotCoef, 4)} | ${e3(s.axRel)} | ${fx(s.axCoef, 4)} |`);
  out.push('', '| 源 → 受け手 | r/R_obs | 回転の項: 導き直した値 / 旧の近似 − 1 | 級数 (3/35)(R_obs/r)² | 軸の項: 導き直した値 / 旧の近似 − 1 | 級数 (6/35)(R_obs/r)² |', '|---|---|---|---|---|---|');
  for (const r of B.per) out.push(`| ${r.src} → ${r.recv} | ${fx(r.rOverRobs, 3)} | ${e2(r.rotRel)} | ${e2(r.rotSeries)} | ${e2(r.axRel)} | ${e2(r.axSeries)} |`);
  out.push('', '| 源 | 源の f | 案2b の遠方の有効な J / 物理の J(0.8/f) | 案2a(0.4/f) | 今((2/5)(R_d/R_obs)²/f) | 案3 |', '|---|---|---|---|---|---|');
  for (const r of B.effJ) out.push(`| ${r.name} | ${r.fLit ? fx(r.f, 4) : fx(r.f, 1) + '(一様の宣言)'} | ${fx(r.p2b, 3)} | ${fx(r.p2a, 3)} | ${e2(r.now)} | 1 |`);
  // S 源の表
  out.push('', '| 源 | m [kg] | R_obs [m] | R_d = Y_k m [m] | 源の f(文献の値) | R_src,J = R_obs√(5f/2) [m] | 遠方の倍率 (R_src,J/R_d)² | 案2b の旧の近似の倍率 2(R_obs/R_d)² | J = f m R_obs² Ω [kg m²/s] | 受け手の f(熱の比較 —— 宣言の列・文献の値の列) |',
    '|---|---|---|---|---|---|---|---|---|---|');
  for (const r of J.S) out.push(`| ${r.name} | ${e3(r.m)} | ${e3(r.Robs)} | ${e3(r.Rd)} | ${fx(r.fSrc, 4)} | ${e3(r.RsrcJ)} | ${e3(r.factorJ)} | ${e3(r.factor2b)} | ${e3(r.JSI)} | ${fx(r.fRecvDecl, 1)}・${fx(r.fRecvLit, 4)} |`);
  // T 6 天体の表
  out.push('', '| 候補 | 自由な係数 | 新しい仮定 | 加法性 | 水星の公転面 | 金星の軸を π | 金星の熱(宣言の区間の中央) | 地球の公転面 | 地球 → 月の abs(ω) [rad/s] | 火星の公転面(対照) | 木星の熱 (b) 太陽の項・主列(受け手 f 0.5) | 代替の列 | 主列(受け手 f 0.254) | 土星の環(C 環の内縁)u/v_K | 広がり S3 [dex] | S4 [dex] |',
    '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  for (const r of T.rows) out.push(`| ${r.ja} | ${r.free} | ${r.newAssump} | ${r.additive} | ${e2(r.me)} | ${e2(r.ve)} | ${e2(r.veHeat)} | ${e2(r.ea)} | ${e2(r.emOm)} | ${e2(r.ma)} | ${e2(r.ju)} | ${e2(r.juAlt)} | ${e2(r.juF)} | ${e2(r.ring)} | ${fx(r.S3, 2)} | ${fx(r.S4, 2)} |`);
  const c3e = row('c3e', J), q = T.bestQ, p3 = row('p3', J);
  out.push('', '| 候補の補助の量 | 値 |', '|---|---|',
    `| 金星の熱流の宣言(全球の平均の内部の熱流 —— 地表の温度に置き換えない): 区間 ${J.decl.venusHeat.fluxLow}〜${J.decl.venusHeat.fluxHigh} W/m²・中央 ${fx(A.req.fluxMid, 4)} W/m² → 電力 [W] | ${e3(A.req.PVlo)}・${e3(A.req.PV)}・${e3(A.req.PVhi)} |`,
    `| 案3 の金星の熱 (b) の比(区間の下端・上端) | ${e2(T.base.p3.veHeatLo)}・${e2(T.base.p3.veHeatHi)} |`,
    `| 木星の熱の主列・代替の列 [W]・h₀ [s] | ${e3(A.req.PJ)}・${e3(A.req.PJalt)}・${fx(A.h0, 2)} |`,
    `| 3e: 木星の熱の比を 1 にする η・τ_hold(木星・金星)[s] | ${e3(c3e.eta)}・${e2(c3e.tauJu)}・${e2(c3e.tauVe)} |`,
    `| 3d: S3 を最小にする q(選んだ値 —— 公転面の行にも掛ける型・軸の行だけの型)と S3 [dex] | ${fx(q.withPlane.q, 3)}・${fx(q.withPlane.S3, 2)}/${fx(q.axialOnly.q, 3)}・${fx(q.axialOnly.S3, 2)} |`,
    `| 3g: abs(Ω☉ − n_i ĥ_i)/abs(Ω☉)(${Object.keys(T.detail.c3gOmRel).join('・')}) | ${Object.values(T.detail.c3gOmRel).map((v) => fx(v, 4)).join('・')} |`,
    `| 3h: 時間平均の Ω / 今の Ω(太陽系の年齢の窓・直近 1 Gyr の窓 —— t_sat = ${A.spin.sweep.map((s) => s.tSat).join('・')} Gyr) | ${A.spin.sweep.map((s) => fx(s.age, 3)).join('・')}/${A.spin.sweep.map((s) => fx(s.venus, 3)).join('・')} |`,
    `| 3f: アルヴェーン半径までの共回転の物質の J / 太陽の J(R_A = ${A.corona.map((c) => c.rARsun).join('・')} R☉ —— 宣言の型の太陽風) | ${A.corona.map((c) => e2(c.JcOverJ)).join('・')} |`,
    `| 3f′: R_src = R_A の遠方の倍率 / 案3 の倍率((0.4/f)(R_A/R☉)²) | ${A.corona.map((c) => fx(c.fac2, 1)).join('・')} |`,
    `| 3i: 地球の 1 日の長さ(今・1 Gyr 前の一次の外挿)[s]・時間平均の Ω / 今の Ω | ${fx(A.earthLod.lodNowS, 0)}・${fx(A.earthLod.lodPastS, 0)}・${fx(A.earthLod.avgFactor, 4)} |`,
    `| 3b: 中心の核 k = 10 の J の倍率 | ${fx(A.j3b, 4)} |`,
    `| 案3 の木星の熱 (b) の E_axis^cost・E_speed(1 回)[J] | ${e2(T.base.p3.EaxJ)}・${e2(T.base.p3.EspJ)} |`,
    `| maintain の帳簿の式(lib)とエンジンの inertialDrag3MaintCell のビット同一(案3 の木星・金星) | ${yn(T.maintSame)} |`);
  // Q 候補の数の真偽
  out.push('', '| 候補の数(第122報の決断事項の材料に挙がった値 —— 計算の根拠が示されていない数) | 挙がった値 | 本便の計算 | 相対 5% の内 | 注 |', '|---|---|---|---|---|');
  for (const c of T.claims) out.push(`| ${c.ja} | ${c.kind === 'bool' ? yn(c.claimed) : e3(c.claimed)} | ${c.kind === 'bool' ? yn(c.mine) : e3(c.mine)} | ${yn(c.ok)} | ${c.note} |`);
  return out.join('\n');
}

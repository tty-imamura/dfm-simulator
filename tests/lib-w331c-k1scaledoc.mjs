// 第331便c(統括の検証項目 R312): PHYSICS〔第331便c〕の表の純関数(正本 tests/out/k1scale-w331c.json から作る —— QA docs.k1Scale331c が逐語で照合)。
//   正本の来歴に入れない(表の形だけ —— 数は正本の値)。html を読まない。
import * as L from './lib-w331c-k1scale.mjs';

export const DOC_VERSION = 'w331c-k1scaledoc-1';
const AU = 1.495978707e11;
const BOOKS = Object.freeze([['mercury', '🌡️ 水星'], ['venus', '🌋 金星'], ['mars', '🔴 火星'], ['jupiter', '🏀 木星'], ['saturn', '🟡 土星'], ['uranus', '🔷 天王星'], ['neptune', '💙 海王星']]);
const nameOf = (k) => (BOOKS.find((b) => b[0] === k) || [k, k])[1];
const fin = Number.isFinite;
export const fe = (x, d = 3) => (fin(x) ? (x === 0 ? '0' : Number(x).toExponential(d)) : '—');
export const fx = (x, d = 4) => (fin(x) ? Number(x).toFixed(d) : '—');
const fsg = (x, d = 4) => (fin(x) ? (x > 0 ? '+' : '') + Number(x).toFixed(d) : '—');
const fp = (x, d = 5) => (fin(x) ? Number(x).toPrecision(d) : '—');
const nTxt = (n) => (n < 0 ? '−' + String(-n) : String(n));
/** 丸めの程度の数は床で書く(< 1e-12) */
const ff = (x) => (fin(x) ? (Math.abs(x) < 1e-12 ? '< 1e-12' : Number(x).toExponential(3)) : '—');
const divTxt = (d) => (d === 1 ? 'h' : 'h/' + d);
const table = (head, rows) => [head, head.replace(/[^|]+/g, '---')].concat(rows).join('\n');

/** 表 1 —— G_loc の分担の解析の一次(試験粒子 η = 0)と 🌡️ の ″/世紀 */
export function t1(J) {
  const qm = J.P.systems.mercury.q1pn, em = J.P.systems.mercury.eta;
  const rows = [2, 1, 0, -1, -2, -3, -6].map((n) => '| ' + nTxt(n) + ' | ' + fsg(L.gLocShare(n)) + ' | ' + fsg(L.gLocShare(n) + L.k1Share()) + ' | ' + fsg(L.gLocShare(n, 'symmetric')) + ' | ' + fsg(L.gLocShare(n, 'symmetric') + L.k1Share())
    + ' | ' + fsg(L.gLocSharePotential(n)) + ' | ' + fsg(L.gLocShare(n, 'receiver', em) * qm, 2) + ' | ' + fsg((L.gLocShare(n, 'receiver', em) + L.k1Share()) * qm, 2) + ' |');
  return table('| n | 受け手 G_loc ÷ q_1PN(実装) | 受け手 + K1 | 対称 G_loc(実装) | 対称 + K1 | ポテンシャルの微分の型(受け手 —— 宣言・未接続) | 🌡️ 受け手 G_loc〔″/世紀〕 | 🌡️ 受け手 + K1〔″/世紀〕 |', rows);
}
/** 表 2 —— 写しの数値の G_loc の分(K1 なし・最も細かい刻み) */
export function t2(J) {
  const rows = BOOKS.map(([k, nm]) => {
    const G = J.K.g[k]; if (!G) return null;
    const z = G.byDiv[G.fine].rows, S = J.P.systems[k], devMax = Math.max(...Object.values(z).map((y) => Math.abs(y.devShare))), bandMax = Math.max(...Object.values(G.band));
    return '| ' + nm + ' | ' + fp(S.q1pn, 6) + ' | ' + divTxt(G.fine) + ' | ' + fx(z.r2.gShare, 5) + '(' + fx(L.gLocShare(2, 'receiver', S.eta), 5) + ') | ' + fx(z['r-3'].gShare, 5) + ' | ' + fx(z['s-6'].gShare, 5)
      + ' | ' + fe(devMax) + ' | ' + fe(bandMax) + ' |';
  }).filter(Boolean);
  return table('| 本 | q_1PN〔″/世紀〕 | 刻み | 受け手 n = 2 の G_loc の分 ÷ q_1PN(一次 −(2/3)(1 − 2η)) | 受け手 n = −3 | 対称 n = −6 | 13 の宣言の一次との差の最大 ÷ q_1PN | 刻みの帯の最大〔″/世紀〕 |', rows);
}
/** 表 3 —— 全近点移動の出所(K1 あり —— 🌡️🏀💙 × n・刻み h) */
export function t3(J) {
  const rows = [];
  for (const k of J.plan.kBooks) {
    const K = J.K.k[k], S = J.P.systems[k]; if (!K || !K.byDiv[1]) continue;
    for (const n of L.DECL.nGrid) {
      const z = K.byDiv[1]['r' + n], g = J.K.g[k].byDiv[1].rows['r' + n]; if (!z || !g) continue;
      const aRes = (L.totalShare({ n, eta: S.eta }) - 1) * S.q1pn;
      rows.push('| ' + nameOf(k) + ' | ' + nTxt(n) + ' | ' + fe(g.gMeas, 4) + ' | ' + fe(z.DG, 6) + ' | ' + ff(z.dDG) + ' | ' + fe(z.total, 6) + ' | ' + fx(z.totalShare, 5) + ' | ' + fe(z.resid) + ' | ' + fe(aRes) + ' |');
    }
  }
  return table('| 本 | n(受け手) | G_loc の分〔″/世紀〕(K1 なしの写し q − q00) | K1 の分 D_G(n) = q(n, K1) − q(n) | D_G(n) − D_G(2) | 和 q(n, K1) − q00 | 和 ÷ q_1PN | 残差 和 − q_1PN | 一次の残差 (−(n/3)(1 − 2η) + 5/3 − 1) q_1PN |', rows);
}
/** 表 4 —— 候補の表(数値 —— 最も細かい刻み・A は在位の正本の r_1PN) */
export function t4(J) {
  const R = J.R && J.R.systems;
  const val = (id, k) => {
    const C = J.K.cand[k]; if (!C) return '—';
    if (id === 'A') { const r = R && R[k] ? R[k].rows[String(R[k].fine)] : null; return r ? fe(r.r) : '—'; }
    if (id === 'B' || id === 'C') return fe(C[id].resid);
    if (id === 'D') return C.D ? fe(C.D.resid) : '—';
    return '—';
  };
  const ana = (c) => { const g = c.type === 'potential' ? L.gLocSharePotential(c.n, c.pair) : L.gLocShare(c.n, c.pair, 0); const t = g + (c.k1 ? L.k1Share() : 0) - 1;
    return fsg(t, 4) + (c.pair === 'receiver' && c.type === 'force' && c.n !== 0 ? ' ' + (c.n > 0 ? '+' : '−') + ' ' + fx(Math.abs(2 * c.n / 3), 4) + 'η' : ''); };
  const rows = L.CANDIDATES.map((c) => '| ' + c.id + ' ' + c.label + ' | ' + c.status + ' | ' + BOOKS.map(([k]) => val(c.id, k)).join(' | ') + ' | ' + ana(c) + ' |');
  return table('| 候補 | 区別 | 🌡️ 残差〔″/世紀〕 | 🌋 | 🔴 | 🏀 | 🟡 | 🔷 | 💙 | 一次の残差 ÷ q_1PN |', rows);
}
/** 表 5 —— 力の型とポテンシャルの微分の型(試験粒子・一次 —— 純粋な積分器の比 e = 0.2・n = 2) */
export function t5(J) {
  const I = Object.fromEntries(J.pure.scenes.integ.map((z) => [z.mode, z]));
  const rows = [
    '| 力の型・受け手(実装 —— gLocKick3) | a = −G e^{−2nψ} M r̂/r²(ψ = X_k M/r) | −2nπGM/(c²p) | −3 | ' + fx(I.gForce.ratio, 6) + ' |',
    '| ポテンシャルの微分の型・受け手(宣言 —— 未接続) | a = −∇(−G e^{−2nψ} M/r)(G′ の項が付く) | −4nπGM/(c²p) | −3/2 | ' + fx(I.gPot.ratio, 6) + ' |',
    '| 力の型・対称(実装 —— pair "symmetric") | G_ij = G e^{−n(ψ_i + ψ_j)} | −nπG(M+m)/(c²p) | −6 | —(相対の軌道の式) |',
    '| K1 の並進(実装 —— β = b/r) | u = (1 − b/r)v | πb/p | —(b = 10G(M+m)/c² で +5/3) | ' + fx(I.k1.ratio, 6) + ' |',
    '| m/r² の並進(宣言 —— 未接続) | u = (1 − b₂/r²)v | 2πb₂/p² | — | ' + fx(I.r2.ratio, 6) + ' |'];
  return table('| 型 | 式 | 1 公転あたりの近点(一次) | 単独で 1PN を担う n | 純粋な積分器 ÷ 一次(e = 0.2) |', rows);
}
/** 表 6 —— (i) 正本の比(規則が尺度を持たないことの表) */
export function t6(J) {
  const rows = [];
  for (const [k, nm] of BOOKS) {
    const R = J.R.systems[k]; if (!R) continue;
    const d = String(R.fine), z = R.rows[d];
    rows.push('| ' + nm + ' | ' + fe(R.eta) + ' | ' + divTxt(Number(d)) + ' | ' + fx(z.DGq, 6) + ' | ' + fe(z.DGdev) + ' | ' + fx(z.dqGq, 6) + ' | ' + fe(z.dqGdev) + ' | ' + fe(z.r) + ' |');
  }
  return table('| 本 | η | 刻み | D_G/q_1PN(一次 5/3) | 一次との差 | ΔqG/q_1PN(一次 −(2/3)(1 − 2η)) | 一次との差 | r_1PN〔″/世紀〕 |', rows);
}
/** 表 7 —— (ii) η を振る(🌡️ の写しの惑星の質量) */
export function t7(J) {
  const R = J.R.systems.mercury, d0 = String(R.fine), z0 = R.rows[d0];
  const rows = ['| 在位(水星の質量・正本) | ' + fe(R.eta) + ' | ' + divTxt(Number(d0)) + ' | ' + fx(R.q1pn, 5) + ' | ' + fx(z0.dqGq, 6) + ' | ' + fx(L.gLocShare(2, 'receiver', R.eta), 6) + ' | ' + fx(z0.DGq, 6) + ' | — | ' + fe(z0.r / R.q1pn) + ' | ' + fe(4 / 3 * R.eta) + ' |'];
  for (const z of J.H.rows) rows.push('| 木星の ' + z.scale + ' 倍 | ' + fe(z.eta) + ' | ' + divTxt(z.div) + ' | ' + fx(z.q1pn, 5) + ' | ' + fx(z.gShare, 6) + ' | ' + fx(z.gShareA, 6) + ' | ' + fx(z.kShare, 6) + ' | ' + fe(z.IShare) + ' | ' + fe(z.rShare) + ' | ' + fe(4 / 3 * z.eta) + ' |');
  return table('| 惑星の質量 | η | 刻み | q_1PN〔″/世紀〕 | G_loc の分 ÷ q_1PN | 一次 −(2/3)(1 − 2η) | K1 の分 ÷ q_1PN(一次 5/3) | 交差 I ÷ q_1PN | 残差 r ÷ q_1PN | 一次の有限質量比 (4/3)η |', rows);
}
/** 表 8 —— (iii) 回る枠の座標回転・(iv) m/r² の座標則(K1 の分との比) */
export function t8(J) {
  const rows = J.S.rows.map((z) => '| ' + nameOf(z.key) + ' | ' + fx(z.pSI / AU, 4) + ' | ' + fe(z.k1Adv, 4) + ' | ' + fx(z.vortexF, 5) + ' | ' + fsg(z.vRatioMatch, 4) + ' | ' + fe(z.vRatioRd) + ' | ' + fe(z.vRatioObs) + ' | ' + fx(z.r2RatioMatch, 4)
    + ' | ' + fe(z.r2RatioRd) + ' | ' + fe(z.r2RatioObs) + ' |');
  return table('| 本 | p〔au〕 | K1 の分〔″/世紀〕 | 渦の型の離心率の補正 f(e)(積分器) | 回る枠の座標回転 ÷ K1(木星で大きさを合わせた形) | 同(自己 R_d = Y_k m) | 同(自己 観測半径) | m/r² の並進 ÷ K1(木星で合わせた形 p_J/p) | 同(自己 R_d) | 同(自己 観測半径) |', rows);
}
/** 表 9 —— (v) 大きさと物差し */
export function t9(J) {
  const rows = J.S.rows.map((z) => '| ' + nameOf(z.key) + ' | ' + fx(z.aSI / AU, 4) + ' | ' + fe(z.eps1pn) + ' | ' + fe(z.betaK1) + ' | ' + fx(z.betaK1 / z.eps1pn, 6) + ' | ' + fe(z.q1pn, 4) + ' | ' + fe(z.k1Adv, 4) + ' | ' + fe(z.gate) + ' | ' + fe(z.k1OverGate) + ' | ' + fe(z.eta) + ' | ' + fe(z.fm) + ' |');
  return table('| 本 | a〔au〕 | ε = GM/(c²a) | K1 の β = 10GM/(c²a) | 比 | q_1PN〔″/世紀〕 | K1 の分〔″/世紀〕 | 数値の門 min(ε_fit, 1e-2 q_1PN) | K1 の分 ÷ 門 | η(太陽が受け手の分の割合 m/(M+m) と同じ桁) | 一次の有限質量比 (4/3)η q_1PN |', rows);
}
/** 表 10 —— 読みの比べ(物差しごと) */
export function t10(J) {
  const S = Object.fromEntries(J.S.rows.map((z) => [z.key, z])), R = J.R.systems, m = S.mercury, j = S.jupiter, n = S.neptune;
  const dg = (k) => fx(R[k].rows[String(R[k].fine)].DGq, 5);
  const rows = [
    '| (i) 分担の比 D_G/q_1PN | 惑星ごとの比が動くか(規則が尺度を持つか) | ' + dg('mercury') + ' | ' + dg('jupiter') + ' | ' + dg('neptune') + ' | 持たない(β と 1PN が同じ 1/a) |',
    '| (ii) 有限質量比 η | η と一次の残差 (4/3)η q_1PN(太陽–木星が最大) | ' + fe(m.eta) + '・' + fe(m.fm) + ' | ' + fe(j.eta) + '・' + fe(j.fm) + ' | ' + fe(n.eta) + '・' + fe(n.fm) + ' | 持つ(η —— 距離ではない) |',
    '| (iii) 回る枠の座標回転(Ω_J × r に M/r²) | K1 の分との比(木星で大きさを合わせた形 —— 向きは逆行) | ' + fsg(m.vRatioMatch, 4) + ' | ' + fsg(j.vRatioMatch, 4) + ' | ' + fsg(n.vRatioMatch, 4) + ' | 持つ(合わせた点 —— √a の形) |',
    '| (iv) m/r² の座標則の並進 | K1 の分との比(木星で合わせた形 p_J/p) | ' + fx(m.r2RatioMatch, 4) + ' | ' + fx(j.r2RatioMatch, 4) + ' | ' + fx(n.r2RatioMatch, 4) + ' | 持つ(合わせた点 —— 1/p の形) |',
    '| (v) 距離の強さ ε = GM/(c²a) | K1 の β ÷ ε(1PN の物差しと同じ 1/a か) | ' + fx(m.betaK1 / m.eps1pn, 4) + ' | ' + fx(j.betaK1 / j.eps1pn, 4) + ' | ' + fx(n.betaK1 / n.eps1pn, 4) + ' | 持たない(比は 10) |'];
  return table('| 読み | 物差し | 太陽–水星 | 太陽–木星 | 太陽–海王星 | 尺度 |', rows);
}
/** 表 11 —— 土星の環の文献の値(出典つき) */
export function t11(J) {
  const T = J.Z.lit;
  const rows = [
    '| 主な環の局所の鉛直の厚み(典型) | 約 ' + T.thickness.value + ' m の桁 | ' + T.thickness.src + ' |',
    '| A 環の局所の厚み(曲がり波の減衰) | ' + T.bendingA.text + ' | ' + T.bendingA.src + ' |',
    '| B 環の外縁の鉛直の構造(端) | km の桁(約 ' + fx(T.bEdge.value / 1000, 1) + ' km) | ' + T.bEdge.src + ' |',
    '| 環の粒子の大きさ | ' + T.particle.text + ' | ' + T.particle.src + ' |',
    '| 環の質量 | ' + fe(T.ringMass.value, 2) + ' kg | ' + T.ringMass.src + ' |',
    '| 土星の J₂ | ' + fe(T.saturnJ2.value, 7) + '(基準半径 ' + fx(T.saturnJ2.Rref / 1000, 0) + ' km) | ' + T.saturnJ2.src + ' |',
    '| J₂ の一次の振動数の式 | Ω²・`κ_epi`²・ν_z² = (GM/r³)[1 + (3/2, −3/2, 9/2)J₂(R/r)²] | ' + T.freqJ2.src + ' |'];
  return table('| 量 | 文献の値 | 出典(本便は一次資料に当たっていない) |', rows);
}
/** 表 12 —— DFM の長さの尺度と厚み 10 m の比 */
export function t12(J) {
  const rows = J.Z.lengths.rows.map((z) => '| ' + z.key + ' | ' + fe(z.value, 4) + ' m | ' + fe(z.overH) + ' | ' + z.kind + ' |');
  rows.push('| 環の点の距離 r ÷ R_d(土星) | ' + fe(J.Z.cand[0].rOverRd) + '〜' + fe(J.Z.cand[J.Z.cand.length - 1].rOverRd) + ' | — | K1 の核が R_d で変わる距離(土星の中心から R_d)は環の 7 桁内側 |');
  return table('| 長さ | 値 | 厚み 10 m との比 | 区別 |', rows);
}
/** 表 13 —— 環の点の振動数と引きずりの項の目安・R_d と厚みの比 */
export function t13(J) {
  const rows = J.Z.cand.map((z) => '| ' + z.label + ' | ' + fx(z.r / 1000, 0) + ' | ' + fe(z.Om) + ' | ' + fe(z.nodal) + ' | ' + fe(z.apsidal) + ' | ' + fe(z.apsK1OverJ2) + ' | ' + fe(z.nodal2ndOverJ2) + ' | ' + fe(z.rotVel) + ' | ' + fe(z.cFromH) + ' | ' + fx(z.RdOverH, 4) + ' | ' + fx(z.RdOverHc, 4) + ' |');
  return table('| 点(💍 の帯の端) | r〔km〕 | Ω〔rad/s〕 | ν_z − Ω(J₂) | Ω − `κ_epi`(J₂) | K1 の面内の近点の率 ÷ J₂ の Ω − `κ_epi` | K1 の鉛直(二次 (β/2)(ν_z − Ω))÷ J₂ の ν_z − Ω | 回転の項の接線の速度の目安〔m/s〕(宣言 —— 在位は宣言しない) | 厚み 10 m の速度の分散 c = HΩ〔m/s〕 | R_d/H(H = 10 m 一定) | R_d/H(H = c/Ω —— B 外縁で 10 m) |', rows);
}
/** 表 14 —— 関連の候補(主張しない —— 偶然の一致の可能性を同じ表に) */
export function t14(J) {
  const Z = J.Z, c = Z.cand, rdH = (k) => fx(c.find((z) => z.label === k).RdOverHc, 3), o = Object.fromEntries(Z.others.map((z) => [z.key, z.rd]));
  const rows = [
    '| R_d(土星)と厚みの典型の比 | R_d = ' + fx(Z.rdBook, 3) + ' m・H = 10 m(典型) | 桁が同じ(比 ' + fx(c[0].RdOverH, 3) + ') | R_d は土星の中心の球の半径で環の場所に無い・r に依らない | 高い(厚みは 10〜100 m の幅で場所で動く —— 比は ' + fx(c[0].RdOverHrange[1], 3) + '〜' + fx(c[0].RdOverHrange[0], 3) + ') | 環ごと・場所ごとの厚みの一次資料と R_d の比の並び |',
    '| 厚みが H = c/Ω で動くときの比 | C 内縁・B 外縁・A 外縁 | ' + rdH('C 内縁') + '・' + rdH('B 外縁') + '・' + rdH('A 外縁') + ' | R_d は一定・H は r^{3/2} | 比が場所で ' + fx(c[0].RdOverHc / c[c.length - 1].RdOverHc, 2) + ' 倍動く(一定の関係ではない) | 速度の分散の一次資料 |',
    '| K1 の引きずりの項が鉛直の釣り合いに足す大きさ | J₂ の ν_z − Ω との比(二次) | ' + fe(c[2].nodal2ndOverJ2) + '(B 外縁) | 一次の項なし(β は z の偶関数) | — | 鉛直の振動の写しの走行(3D の環の本) |',
    '| b = C₁R_d(K1 の並進の係数) | b = ' + fx(Z.lengths.rows[1].value, 3) + ' m | 桁が同じ(比 ' + fx(Z.lengths.rows[1].overH, 3) + ') | 長さの係数で、厚みの式に入る経路が無い | 高い | — |',
    '| 他の環を持つ惑星の R_d | 木星 ' + fx(o.jupiter, 2) + ' m・天王星 ' + fx(o.uranus, 3) + ' m・海王星 ' + fx(o.neptune, 3) + ' m | — | — | — | 各環の厚みの文献の値と並べる(本便は値を置かない) |'];
  return table('| 候補 | 何を比べたか | 値 | 同じ所・違う所 | 偶然の一致の可能性 | 次の検査 |', rows);
}
/** 補足 1 の型の式(表 15 の列 —— 器の型の id ごと) */
export const ROT_FORM = Object.freeze({
  i: ['d = (b/r)(v_☉ − v)(b = C₁Y_k(M + m))', 'πb/p', '順行'],
  'i-tan': ['d = −(b/r) v_φ φ̂', '2πb/p', '順行'],
  'i-rad': ['d = −(b/r) v_r r̂', '−πb/p', '逆行'],
  'i-spin': ['d = (b/r)(Ω_☉ ẑ × r + v_☉ − v)', 'πb/p(回転の分は一次で 0)', '順行'],
  ii: ['d = (c/r²) Ω_☉ ẑ × r(c = M/W)', '−πcΩ_☉/(n a²)', '逆行'],
  'ii-eng': ['spinDrag {rot:"surfaceFlip", axial:"on", axialModel:"bevel"}', '—', '—'],
  iii: ['d = (c/r²) n ẑ × r', '−πc/a²', '逆行'],
  iv: ['d = (c/r²) Ω_J ẑ × r', '−πcΩ_J/(n a²)', '逆行'],
  'v-t': ['d = −(c/r²) v', '2πc/a²', '順行'],
  v: ['d = (c/r²)(Ω_☉ ẑ × r − v)', 'πc(2 − Ω_☉/n)/a²', '逆行(Ω_☉ > 2n)'],
  'v-orb': ['d = (c/r²)(n ẑ × r − v)', 'πc/a²', '順行'],
});
/** 表 15 —— 補足 1: 太陽–水星の回転引きずりの型(K1 の分 +5/3 を読む型の一次の分担と要る長さ) */
export function t15(J) {
  const X = J.X.systems.mercury, W0 = J.W;
  const rows = X.rows.map((z) => {
    const F = ROT_FORM[z.id] || ['—', '—', '—'];
    if (z.kind === 'spinEngine') {
      const v = W0 && !W0.missing ? (W0.bitSame ? '0(1 公転の状態が spinDrag の有無でビット同一 —— ' + W0.nState + ' 成分)' : '状態の差の最大 ' + fe(W0.dMax)) : '—';
      return '| ' + z.label + ' | ' + z.status + ' | ' + F[0] + ' | ' + F[1] + ' | 軌道に効かない | — | ' + v + ' | — | ' + (W0 && W0.bitSame ? fsg(L.gLocShare(2, 'receiver', J.P.systems.mercury.eta), 4) : '—') + ' | — | — |';
    }
    const tot = fin(z.totalRd) ? fsg(z.totalRd, 4) + '(' + (z.factorRd >= 0 ? '' : '−') + fe(Math.abs(z.factorRd)) + ' 倍)' : '—';
    const lam = z.kind === 'field' ? (z.sameSign ? fe(z.lambda) : '—(向きが逆)') : (z.kind === 'k1' ? '1(規則 R_d = Y_k m)' : '—');
    const R = z.kind === 'field' && z.Rreq ? fe(z.Rreq) + '(' + fe(z.RreqOverRobs) + ')' : (z.kind === 'k1' ? fe(J.P.systems.mercury.rdPlanet) + '(' + fe(J.P.systems.mercury.rdPlanet / J.P.systems.mercury.Rplanet) + ')' : '—');
    return '| ' + z.label + ' | ' + z.status + ' | ' + F[0] + ' | ' + F[1] + ' | ' + F[2] + ' | ' + (fin(z.eFactor) ? fx(z.eFactor, 5) : '—') + ' | ' + (fin(z.shareRd) ? fe(z.shareRd) : '—') + ' | ' + (fin(z.shareObs) ? fe(z.shareObs) : '—') + ' | ' + tot + ' | ' + lam + ' | ' + R + ' |';
  });
  return table('| 型 | 区別 | 速度の場(相対の軌道 —— d は受け手の位置の速さに足す項) | 円軌道の一次(1 公転) | 向き | 離心率の補正(純粋な積分器・e = 0.2056) | 分担 ÷ q_1PN(自己 R_d = Y_k m) | 同(自己 観測半径) | G_loc(n = 2)と足す(自己 R_d —— 括弧は 5/3 に対する倍) | 要る倍率 λ(両方の自己の半径を λR_d) | 水星の自己の半径 λR_d〔m〕(÷ 観測半径) |', rows);
}
/** 表 16 —— 補足 1: 水星で要る倍率 λ を他の惑星に当てたときの分担(尺度を持つか) */
export function t16(J) {
  const S = J.X.scale, ids = Object.keys(S);
  const rows = BOOKS.map(([k, nm]) => '| ' + nm + ' | ' + ids.map((id) => { const z = S[id].rows.find((y) => y.key === k); return fx(z.share, 4) + '(' + fx(z.factor, 4) + ' 倍)'; }).join(' | ') + ' |');
  return table('| 本 | ' + ids.map((id) => (ROT_FORM[id] ? ROT_FORM[id][0] : id) + '(λ = ' + fe(S[id].lambda) + ')').join(' | ') + ' |', rows);
}
/** 表 17 —— 補足 2: K1 の R_d の有効な例・有効でない例・まだ判定していない例(物差しの宣言 —— 主張しない) */
export function t17(J) {
  const CL = { valid: '有効(物差しの内)', invalid: '有効でない(物差しの外)', open: 'まだ判定していない' };
  const rows = J.V.rows.map((z) => '| ' + CL[z.cls] + ' | ' + z.case + ' | ' + z.yardstick + ' | ' + z.value + ' | ' + z.source + ' | ' + (z.note || '—') + ' |');
  return table('| 区分 | 例 | 物差し(何をもって有効とするか) | 数 | 出典の正本・節 | 注 |', rows);
}
/** 表の全部(QA が逐語で照合する) */
export function tablesOf(J) {
  return { t1: t1(J), t2: t2(J), t3: t3(J), t4: t4(J), t5: t5(J), t6: t6(J), t7: t7(J), t8: t8(J), t9: t9(J), t10: t10(J), t11: t11(J), t12: t12(J), t13: t13(J), t14: t14(J), t15: t15(J), t16: t16(J), t17: t17(J) };
}

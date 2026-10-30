// 第319便b(原仮定者の指示(第121報)「引きずり半径について」・決断事項 AN445・AN446・AN449・統括の検証項目 R259):
// **PHYSICS〔第319便b〕の表の行と本文の数を正本から作る純関数**(文書だけ —— 正本を作る器の meta.code に入れない: 表の書式を直しても正本の来歴は動かない)。
// QA docs.srcRadius319 が PHYSICS〔第319便b〕と逐語で照合する。逐語照合する表に丸めの程度の数を書かない(写しと lib の差・丸めの床は fmtFloor の床・
// 本の単位と SI の写しの差〔丸めの感度〕は本文に桁だけ)。
import { fmtFloor, ex, fx } from './lib-w311d-planet3.mjs';
import { PLANS, PLAN_KEYS, BODY16, MSUN, KPC, MOI } from './lib-w319b-srcradius.mjs';
export const DOC_LIB_VERSION = 'w319b-srcradiusdoc-1';

const yn = (b) => (b ? '真' : '偽');
const e2 = (x) => ex(x, 2), e3 = (x) => ex(x, 3);
const PS = Object.freeze({ now: '今', p1: '案1', p2a: '案2a', p2b: '案2b', p3: '案3' });
const planHead = () => PLAN_KEYS.map((k) => PS[k]).join(' | ');
const zeroOr = (x, floor) => (x === 0 ? '0' : fmtFloor(Math.abs(x), floor, 2));

/** 本文に書く数(QA が節の中にあることを照合する) */
export function docNumbersSrcRadius(J) {
  const sun = J.S.rows[0], G = J.G, fin = G.grids[G.grids.length - 1].total, R = J.R, me = R.rows.find((r) => r.i === 1), ve = R.rows.find((r) => r.i === 2), ju = R.rows.find((r) => r.i === 6);
  return [e3(sun.factor.p1), e3(sun.factor.p2a), e3(sun.factor.p3), e3(J.S.k2Recv.ratio), e3(fin.beta), e3(fin.uCo[1]), e3(fin.halfCurlCo[2]), e3(G.central318.beta), e3(G.central318.halfCurlCo[2]),
    fx(G.RsrcJkpc, 2), e3(G.halfCurlOverOmRef), fx(ve.plans.now.angOmSun, 1), fx(ju.plans.now.angOmSun, 1), fx(me.angOmGdist, 1), e2(ju.plans.p2a.heat.ratioAbsPer), e2(ve.plans.p2a.ratio), e2(me.plans.p2a.ratio),
    fx(J.F.spreadAbs.p2a, 2), e2(ju.plans.p2a.heat.ratioAbsSun), e3(J.A.engine.one.rel), e3(G.cand[0].val), e3(J.F.galaxy.ratio)];
}

export function physicsTablesSrcRadius(J) {
  const out = [], S = J.S, G = J.G, A = J.A, R = J.R, C = J.C, F = J.F, K = J.K;
  // S1 源の表
  out.push('| 源 | m [kg] | R_obs [m] | R_d = Y_k m [m] | 案1 R_src [m] | 案3 の f | 案3 R_src [m] | 遠方のモーメントの倍率(案1・案2a・案2b・案3) | 最大の軸の ω の受け手 | 今の abs(ω) [rad/s] | 案1 | 案2a | 案2b | 案3 |',
    '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  for (const r of S.rows) out.push(`| ${r.name} | ${e3(r.m)} | ${e3(r.R)} | ${e3(r.Rd)} | ${e3(r.Rsrc.p1)} | ${r.fLit ? fx(r.f, 4) : fx(r.f, 1) + '(一様の宣言)'} | ${e3(r.Rsrc.p3)} | ${e2(r.factor.p1)}・${e2(r.factor.p2a)}・${e2(r.factor.p2b)}・${e2(r.factor.p3)} | ${r.mainName} | ${e2(r.omMain.now)} | ${e2(r.omMain.p1)} | ${e2(r.omMain.p2a)} | ${e2(r.omMain.p2b)} | ${e2(r.omMain.p3)} |`);
  // S2 照合
  out.push('', '| 照合(エンジンの値と lib) | 値 |', '|---|---|',
    `| lib の K2・M2 とエンジンの inertialDragIsqK2・inertialDragIsqM2 のビット同一(x = r/R の ${K.nK} 点・${K.nM} 点) | ${yn(K.k2Same)}・${yn(K.m2Same)} |`,
    `| lib の k1RecvSrc(省略の形)と 16 体の写しの読み口の差の最大(受け手 ${K.replica.receivers}・β ${K.replica.cells} 対・回転の係数・軸の ω) | ${zeroOr(K.replica.worst, 1e-15)} |`,
    `| 案ごとの写しの外の計算の受け手の β が今とビット同一(全案・全受け手) | ${yn(S.betaSame)} |`);
  for (const k of ['p1', 'p2a', 'p3']) { const e = S.engine[k]; out.push(`| 器の中の源のモーメントだけを替えた写し(太陽を pinned・dragCore.radius = ${e3(e.RsrcSun)} m —— ${PS[k]}): 受け手の β がビット同一・読み口と lib の差の最大(受け手 ${e.receivers}) | ${yn(e.betaSame)}・${zeroOr(e.worst, 1e-15)} |`); }
  out.push(`| 受け手を K2 にする型(受け手の W も K2・R_d = Y_k m)の β(☉ → ☿)/ K1 の β | ${e3(S.k2Recv.ratio)} |`);
  // A 加法性
  out.push('', '| 候補 | 同じ質量を N 等分した源のモーメントの和の N の指数 | 注 |', '|---|---|---|');
  for (const a of A.analytic) out.push(`| ${a.ja} | ${a.expN === null ? '—' : (a.expN === 0 ? '0' : fx(a.expN, 3))} | ${a.note} |`);
  out.push('', '| 立方格子の一辺 n | 要素の数 N | 離散の J / 一様な球の J | 並進の移送の遠方の和 / (5G_0/c_0²) J/r² | 要素の自転の回転の項の和 / 1 つの源(今の R_d) | 並進の移送の遠方の和 / 1 つの源の回転の項(今の R_d) |', '|---|---|---|---|---|---|');
  for (const r of A.rows) out.push(`| ${r.n} | ${r.N} | ${fx(r.JOverJphys, 4)} | ${fx(r.transOverDip, 6)} | ${e3(r.piecesOverOne)} | ${e3(r.transOverNow1)} |`);
  out.push(`| エンジンの写し(n = ${4}) | ${A.engine.N} | ${fx(A.engine.JOverJphys, 4)} | ${fx(A.engine.transOverDip, 6)} | — | 1 つの源(dragCore.radius = √(5J/(2mΩ)))の回転の項の読み口との相対の差 ${e3(A.engine.one.rel)} |`);
  // G 分布した銀河
  out.push('', '| 格子(円盤 動径 × 方位 × 鉛直・バルジ r′ × μ × 方位) | セル(円盤 1 成分・バルジ) | Σβ | 共動系の u_y [m/s] | 共動系の半渦度 w_z [1/s] | 銀河の中心の系の半渦度(源の流れの分)[1/s] | ∂u_y/∂x [1/s] | ∂u_x/∂y [1/s] | 勾配のフロベニウスの大きさ [1/s] | 100 au の差の速さ [m/s] |',
    '|---|---|---|---|---|---|---|---|---|---|');
  for (const m of G.grids) { const t = m.total, g = m.grid; out.push(`| ${g.nr} × ${g.np} × ${g.nz}・${g.br} × ${g.bm} × ${g.bp} | ${m.cellsDisk}・${m.cellsBulge} | ${e3(t.beta)} | ${e3(t.uCo[1])} | ${e3(t.halfCurlCo[2])} | ${e2(t.halfCurlGC[2])} | ${e3(t.dUyDx)} | ${e3(t.dUxDy)} | ${e3(t.frob)} | ${e3(t.du100au)} |`); }
  const c1 = G.central318, c2 = G.centralSameMass;
  out.push(`| 中心 1 体(第318便d の M_G = V0²R0/G_0 = ${e3(G.MGsun)} M☉・静止) | 1 | ${e3(c1.beta)} | ${e3(c1.uCo[1])} | ${e3(c1.halfCurlCo[2])} | 0 | ${e3(c1.dUyDx)} | 0 | ${e3(c1.frob)} | ${e3(c1.du100au)} |`,
    `| 中心 1 体(分布の模型と同じ全質量 ${e3(c2.mSun)} M☉・静止) | 1 | ${e3(c2.beta)} | ${e3(c2.uCo[1])} | ${e3(c2.halfCurlCo[2])} | 0 | ${e3(c2.dUyDx)} | 0 | ${e3(c2.frob)} | ${e3(c2.du100au)} |`,
    `| 格子 3 段の相対の広がり(Σβ・u_y・w_z・フロベニウス) | — | ${e2(G.spread.beta)} | ${e2(G.spread.uCoY)} | ${e2(G.spread.halfCurlZ)} | — | — | — | ${e2(G.spread.frob)} | — |`);
  const fin = G.grids[G.grids.length - 1];
  out.push('', '| 成分(最も細かい格子) | 質量(宣言の密度の積分)[M☉] | β | 共動系の u_y [m/s] | 銀河の中心の系の u_y [m/s] | 共動系の半渦度 w_z [1/s] |', '|---|---|---|---|---|---|');
  for (const p of fin.parts) out.push(`| ${p.ja} | ${e3(p.mSun)} | ${e3(p.beta)} | ${e3(p.uCo[1])} | ${e3(p.uGC[1])} | ${e3(p.halfCurlCo[2])} |`);
  out.push(`| 合計 | ${e3(fin.total.mSun)} | ${e3(fin.total.beta)} | ${e3(fin.total.uCo[1])} | ${e3(fin.total.uGC[1])} | ${e3(fin.total.halfCurlCo[2])} |`);
  out.push('', '| 銀河の軸の源の候補 | 分布の物質の公転の数え方(宣言) | R_src [m] | 太陽が R_src の内(遠方の式の外) | 太陽の位置の大きさ [rad/s] | 向き |', '|---|---|---|---|---|---|');
  for (const c of G.cand) out.push(`| ${c.ja} | ${c.count} | ${c.Rsrc === null ? '—' : e3(c.Rsrc)} | ${yn(c.inside)} | ${c.val === null ? '—(遠方の式の外)' : e3(c.val)} | ${c.dir} |`);
  out.push('', '| 中心 1 体の軸の ω の主項(各天体 —— 桁の見積り) | R_d,i / r_G | 主項 2 q2 β Ω_ref sinθ abs(2μ n̂ − â) [rad/s] | 外の場の勾配の項の上限の倍率 | 上限 [rad/s] | 案1 の上限 [rad/s] |', '|---|---|---|---|---|---|');
  for (const b of G.perBody) if ([0, 1, 2, 3, 4, 5, 6, 11].includes(b.i)) out.push(`| ${b.name} | ${e2(b.RdOverR)} | ${e3(b.omLeadAbs)} | ${e2(b.upFactor)} | ${e2(b.omUpper)} | ${e2(b.omP1Upper)} |`);
  // R 役割
  out.push('', '| 天体 | 役割(第121報) | abs(Ω) [rad/s](spin の符号) | Ω と ĝ の角 [°] | Ω と ω_☉ の角 [°] | ω_☉ と分布の半渦度の角 [°] | 減速(一般形 —— ω_☉・分布 +ĝ・中心 1 体 −ĝ・合成〔ω_☉ 案2a + 分布〕) | 減速(固定の 120° —— ω_☉・分布・中心 1 体) | 一般形と固定の 120° が違う | 拮抗(ω_☉ と分布・ω_☉ と中心 1 体) | 注 |',
    '|---|---|---|---|---|---|---|---|---|---|---|');
  for (const r of R.rows) { const p = r.plans.now, q = r.plans.p2a, dis = [p.cSun.disagree ? 'ω_☉' : null, r.cGdist.disagree ? '分布' : null, r.cGcen.disagree ? '中心 1 体' : null].filter(Boolean);
    out.push(`| ${r.name} | ${r.role} | ${e3(r.OmAbs)}(${r.spinSign > 0 ? '+' : '−'}) | ${fx(r.angOmG, 1)} | ${fx(p.angOmSun, 1)} | ${fx(p.angSunGdist, 1)} | ${yn(p.cSun.decel)}・${yn(r.cGdist.decel)}・${yn(r.cGcen.decel)}・${yn(q.cSum.decel)} | ${yn(p.cSun.fixed120)}・${yn(r.cGdist.fixed120)}・${yn(r.cGcen.fixed120)} | ${dis.length ? '真(' + dis.join('・') + ')' : '偽'} | ${yn(r.antagDist)}・${yn(r.antagCen)} | ${r.note} |`); }
  out.push('', `| 天体 | 量 | 要る大きさ | ${planHead()} |`, '|---|---|---|---|---|---|---|---|');
  const rowP = (name, q, req, f) => out.push(`| ${name} | ${q} | ${req} | ${PLAN_KEYS.map((k) => f(k)).join(' | ')} |`);
  for (const r of R.rows) {
    rowP(r.name, 'abs(ω_☉) [rad/s]', '—', (k) => e2(r.plans[k].omSun));
    if (r.req === 'plane') { rowP(r.name, '回転の率 ω_rot / 要る(公転面 3°/太陽系の年齢)', e3(r.plans.now.reqVal), (k) => e2(r.plans[k].ratio)); rowP(r.name, '回転の率 × 100 年 [″]', '—', (k) => e2(r.plans[k].arcsecCentury)); }
    if (r.req === 'venus') rowP(r.name, 'abs(ω_☉) / 要る(軸を π —— 仮の期間 1 Gyr)', e3(r.plans.now.reqVal), (k) => e2(r.plans[k].ratio));
    if (r.req === 'jupiter') {
      rowP(r.name, '熱(今の帳簿・源ごと〔太陽 + 分布〕・τ_hold = h₀)/ 主列', e3(R.req.jupiterP) + ' W', (k) => e2(r.plans[k].heat.ratioPer));
      rowP(r.name, '熱(候補 (b) 減速の分も熱・源ごと・τ_hold = h₀)/ 主列', e3(R.req.jupiterP) + ' W', (k) => e2(r.plans[k].heat.ratioAbsPer));
      rowP(r.name, '熱(候補 (b)・源ごと)/ 代替の列(別の欄 —— 混ぜない)', e3(R.req.jupiterPAlt) + ' W', (k) => e2(r.plans[k].heat.ratioAbsPerAlt));
    }
    if (r.req === 'none') for (const g of R.ring) rowP(r.name, '環の半径 ' + e3(g.rM) + ' m(' + fx(g.rOverRobs, 3) + ' R_obs)の回転の移送 / 公転の速さ', '—', (k) => e2(g.plans[k].uOverV));
  }
  const mo = R.moon;
  rowP('月(潮汐ロック)', '地球 → 月の abs(ω) [rad/s]', '—', (k) => e2(mo.plans[k].omEarth));
  rowP('月(潮汐ロック)', '太陽 → 月の abs(ω) [rad/s]', '—', (k) => e2(mo.plans[k].omSun));
  rowP('地球', '月 → 地球の abs(ω) [rad/s]', '—', (k) => e2(mo.plans[k].omMoonOnEarth));
  out.push('', '| 月(潮汐ロック —— 地球の行の三体) | 値 |', '|---|---|',
    `| 月の abs(Ω) [rad/s]・地球に対する瞬時の公転の率 [rad/s]・比 | ${e3(mo.OmAbs)}・${e3(mo.nOrb)}・${fx(mo.spinOverOrb, 3)} |`,
    `| 地球 → 月の ω と月の Ω の角 [°]・減速(一般形・固定の 120°) | ${fx(mo.plans.now.angOmEarth, 1)}・${yn(mo.plans.now.cEarth.decel)}・${yn(mo.plans.now.cEarth.fixed120)} |`,
    `| 合成(地球 + 太陽 + 分布)の減速(案2a・案3) | ${yn(mo.plans.p2a.cSum.decel)}・${yn(mo.plans.p3.cSum.decel)} |`,
    `| 月 → 地球の ω と地球の Ω の角 [°]・減速(一般形) | ${fx(mo.plans.now.cMoonOnEarth.thetaDeg, 1)}・${yn(mo.plans.now.cMoonOnEarth.decel)} |`);
  // 木星・金星の熱の詳細
  out.push('', '| 天体・案 | Q(太陽)[J] | Q(分布)[J] | 源ごと Q(太陽)+ Q(分布)[J] | 合成 Q(太陽 + 分布)[J] | 源ごと P = Q/h₀ [W] | 合成 P [W] | (b) 源ごと P [W] | (b) 合成 P [W] |', '|---|---|---|---|---|---|---|---|---|');
  for (const r of R.rows.filter((z) => z.req === 'jupiter' || z.req === 'venus')) for (const k of PLAN_KEYS) { const h = r.plans[k].heat; out.push(`| ${r.name}・${PS[k]} | ${e2(h.sun.Q)} | ${e2(h.gal.Q)} | ${e2(h.perSourceQ)} | ${e2(h.comp.Q)} | ${e2(h.Pper)} | ${e2(h.Pcomp)} | ${e2(h.PabsPer)} | ${e2(h.PabsComp)} |`); }
  // C 120°
  out.push('', '| 等しい大きさの 2 本の角 θ [°] | abs(Ω + ω)/abs(Ω) = 2 cos(θ/2) | 減速 |', '|---|---|---|');
  for (const q of C.equal) out.push(`| ${q.thetaDeg} | ${fx(q.ratio, 4)} | ${yn(q.decel)} |`);
  out.push('', '| abs(ω)/abs(Ω) | 減速の境界の角 θ_c = arccos(−abs(ω)/(2abs(Ω)))[°] | θ_c − 90° [°] |', '|---|---|---|');
  for (const q of C.threshold) out.push(`| ${q.wOverW} | ${fx(q.thetaCritDeg, 4)} | ${ex(q.minus90, 2)} |`);
  // F
  out.push('', `| 要る大きさとの比(今の K1 の大きさ / 要る大きさ) | ${planHead()} |`, '|---|---|---|---|---|---|');
  for (const r of F.rows) out.push(`| ${r.ja} | ${PLAN_KEYS.map((k) => e2(r[k])).join(' | ')} |`);
  out.push(`| 比の広がり(水星の公転面・金星・木星 (b) の太陽の項 —— log10 の最大 − 最小)[dex] | ${PLAN_KEYS.map((k) => fx(F.spreadAbs[k], 2)).join(' | ')} |`);
  out.push(`| 比の広がり(水星の公転面・金星・木星の今の帳簿の太陽の項)[dex] | ${PLAN_KEYS.map((k) => fx(F.spreadNow[k], 2)).join(' | ')} |`);
  out.push(`| ${F.galaxy.ja} | ${e2(F.galaxy.ratio)}(分布 —— 案に依らない) | 中心 1 体の上限 ${e2(F.galaxy.cenUpperRatio)} | — | — | — |`);
  return out.join('\n');
}
export const planLabels = () => PLANS.map((p) => PS[p.key] + ' = ' + p.ja);
export { MOI, BODY16, MSUN, KPC };

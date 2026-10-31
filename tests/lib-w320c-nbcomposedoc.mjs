// 第320便c(原仮定者の指示(第122報)・決断事項 AN472・AN473・統括の検証項目 R264):
// **PHYSICS〔第320便c〕の表の行と本文の数を正本から作る純関数**(文書だけ —— 正本を作る器の meta.code に入れない: 表の書式を直しても正本の来歴は動かない)。
// QA docs.nbCompose320c が PHYSICS〔第320便c〕と逐語で照合する。逐語照合する表に丸めの程度の数を書かない(座標の補正の戻りの差・階数 1 の残り・2 経路の差は fmtFloor の床)。
import { fmtFloor, ex, fx } from './lib-w311d-planet3.mjs';
export const DOC_LIB_VERSION = 'w320c-nbcomposedoc-1';

const yn = (b) => (b ? '真' : '偽');
const e2 = (x) => ex(x, 2), e3 = (x) => ex(x, 3), e4 = (x) => ex(x, 4);
const dir = (x) => (x > 0 ? '+ĝ' : x < 0 ? '−ĝ' : '0');
const OPJA = Object.freeze({ A: 'A(中心は bevel の主項・残余は半渦度)', B: 'B(両方とも半渦度)', Bco: 'B の共動系(受け手の動きの項を含む)' });
const lam = (x) => (x === null || x === undefined ? '—' : (x > 0 ? fx(x, 3) : '反転しない'));

/** 本文に書く数(QA が節の中にあることを照合する) */
export function docNumbersNbCompose(J) {
  const F = J.F, c = F.cont, N = J.N, P = J.P, r4 = P.rows.find((r) => r.rCutKpc === 4), r5 = P.rows.find((r) => r.rCutKpc === 5), D = J.D, B = J.B, Sh = J.Shape;
  const pxJt = D.proxy.find((p) => p.key === 'pxJt'), pxJg = D.proxy.find((p) => p.key === 'pxJg'), pxNow = D.proxy.find((p) => p.key === 'pxNow');
  return [e4(c.gc), e4(c.obs), e4(c.co), fx(100 * c.obsShare, 1), fx(-100 * c.srcShare, 1), e3(F.grids[0].gc[2]), e3(F.grids[1].gc[2]), e3(F.grids[2].gc[2]), e3(N.rows.find((r) => r.epsKpc === 0).cells[3].w),
    e3(r4.inner), e3(r4.residual), e3(r4.bevel), e3(r5.residual), fx(r5.flipLambda.B, 3), fx(r5.flipLambda.A, 3), e3(P.Jt), e3(pxJt.halfCurl), fx(pxJt.RsrcKpc, 2), fx(pxJg.RsrcKpc, 2), e3(pxNow.bevel),
    fx(B.inPlaneRatio, 3), e3(B.onAxisHalfCurl), fx(Sh.zeroRatio, 4), e3(Sh.rows.find((r) => r.key === 'point').wz)];
}

export function physicsTablesNbCompose(J) {
  const out = [], F = J.F, N = J.N, P = J.P, Sh = J.Shape, D = J.D, B = J.B, R = J.R;
  // F1 座標の補正と分けた表
  out.push('| 格子(円盤の動径 × 方位 × 鉛直) | 共動系の ω_Co,z [1/s] | 源の流れ ω_GC,z [1/s] | 受け手の動きの項 −½(∇β × V_ref)_z [1/s] | 受け手の項 / ω_Co | ∇β の階数 1 の残り(相対) | ω_Co + ½∇β × V_ref と ω_GC の差(ω_Co の大きさで割る) |',
    '|---|---|---|---|---|---|---|');
  for (const g of F.grids) out.push(`| ${g.grid.nr} × ${g.grid.np} × ${g.grid.nz} | ${e4(g.co[2])} | ${e3(g.gc[2])} | ${e4(g.obs)} | ${fx(g.obsShare, 3)} | ${fmtFloor(g.rank1Rel, 1e-12, 1)} | ${fmtFloor(g.backRel, 1e-12, 1)} |`);
  out.push(`| 環の積分(連続の値) | ${e4(F.cont.co)} | ${e4(F.cont.gc)} | ${e4(F.cont.obs)} | ${fx(F.cont.obsShare, 3)} | — | — |`);
  // F2 成分ごと
  out.push('', '| 成分(環の積分) | β(太陽の位置) | 源の流れ ω_GC,z [1/s] | u_φ の差分の経路との相対の差 | 受け手の動きの項 [1/s] |', '|---|---|---|---|---|');
  for (const r of F.ring) out.push(`| ${r.key} | ${e3(r.beta)} | ${r.gc === 0 ? '0(静止の宣言)' : e3(r.gc)} | ${r.gc === 0 ? '—' : fmtFloor(r.routeRel, 1e-8, 1)} | ${e3(r.obs)} |`);
  out.push(`| 計 | ${e3(F.cont.beta)} | ${e4(F.cont.gc)} | ${fmtFloor(F.cont.routeRel, 1e-8, 1)} | ${e4(F.cont.obs)} |`);
  out.push('', '| 感度(環の積分) | 値 |', '|---|---|',
    `| 求積の許容 ${F.quadRows.map((q) => ex(q.rel, 0)).join('・')} の ω_GC,z の広がり(相対) | ${fmtFloor(F.quadSpread, 1e-12, 1)} |`,
    `| 中心差分の幅 ${F.fdRows.map((q) => fx(q.fdKpc, 2)).join('・')} kpc の受け手の動きの項の広がり(相対) | ${fmtFloor(F.fdSpread, 1e-8, 1)} |`);
  // N1 軟化の幅 × 格子
  const gh = N.rows[0].cells.map((c) => String(c.nr)).join(' | ');
  out.push('', `| 軟化の幅 ε [kpc] | 連続の値(環の積分)[1/s] | 点のセルの和 —— 格子 ${gh} | 細かい 2 段と連続の値の相対の差 | 細かい 2 段が連続の値の 5% の内 |`, '|---|---|' + N.rows[0].cells.map(() => '---|').join('') + '---|---|');
  for (const r of N.rows) out.push(`| ${fx(r.epsKpc, 2)} | ${e3(r.cont)} | ${r.cells.map((c) => e3(c.w)).join(' | ')} | ${r.finestRel.map((x) => fx(x, 3)).join('・')} | ${yn(r.resolved)} |`);
  out.push('', `| 近傍のセルの局所の分割(D_loc ${fx(N.split[0].dlocKpc, 1)} kpc の内 —— s × s × s の小点・ε = 0) | ${N.split[0].cells.map((c) => '格子 ' + c.nr).join(' | ')} | 連続の値との相対の差 |`, '|---|' + N.split[0].cells.map(() => '---|').join('') + '---|');
  for (const r of N.split) out.push(`| s = ${r.s}(分けたセル ${r.cells.map((c) => c.nSplit).join('・')}) | ${r.cells.map((c) => e3(c.w)).join(' | ')} | ${r.rel.map((x) => fx(x, 3)).join('・')} |`);
  // P1 分割
  out.push('', '| R_cut [kpc] | 中心の J / 全 J | 解像した内側 [1/s] | 残余 [1/s] | 和(= 全場)[1/s] | J 双極子 [1/s] | 双極子近似の誤差 | bevel の主項(中心の J)[1/s] | 中心の等価の R_src [kpc] | 受け手の動きの項(中心・残余)[1/s] | 中心が優勢(A・B・Bco) | 反転する λ_c(A・B・Bco) |',
    '|---|---|---|---|---|---|---|---|---|---|---|---|');
  for (const r of P.rows) out.push(`| ${fx(r.rCutKpc, 1)} | ${fx(r.JcShare, 4)} | ${e3(r.inner)} | ${e3(r.residual)} | ${e4(r.sum)} | ${e3(r.dipole)} | ${fx(r.dipoleErr, 3)} | ${e3(r.bevel)} | ${fx(r.RsrcKpc, 2)} | ${e3(r.obsInner)}・${e3(r.obsResidual)} | ${yn(r.dominant.A)}・${yn(r.dominant.B)}・${yn(r.dominant.Bco)} | ${lam(r.flipLambda.A)}・${lam(r.flipLambda.B)}・${lam(r.flipLambda.Bco)} |`);
  // P2 λ_c の掃引(R_cut 2・4・6)
  const lcs = J.plan.lambdaC;
  out.push('', `| R_cut [kpc] | 演算 | κ_v | ${lcs.map((l) => 'λ_c = ' + l).join(' | ')} |`, '|---|---|---|' + lcs.map(() => '---|').join(''));
  for (const rc of [2, 4, 6]) for (const op of ['A', 'B', 'Bco']) for (const kv of J.plan.kappaV) {
    const cells = lcs.map((lc) => { const s = P.sweep.find((q) => q.rCutKpc === rc && q.op === op && q.kappaV === kv && q.lambdaC === lc); return s ? (s.w === 0 ? '0' : e2(s.w)) : '—'; });
    if (cells.every((c) => c === '—')) continue;
    out.push(`| ${fx(rc, 1)} | ${OPJA[op]} | ${kv} | ${cells.join(' | ')} |`);
  }
  // S 有限の分布の型
  out.push('', '| 分布の型(同じ総 J) | 大きさ | 太陽の位置の半渦度 w_z [1/s] | 向き |', '|---|---|---|---|');
  for (const r of Sh.rows) {
    if (r.key === 'uniformShellCheck') continue;
    const size = r.key === 'uniform' ? `R = ${fx(r.RKpc, 4)} kpc(R0/R = ${fx(r.rOverR, 3)})` : r.key === 'concRigid' || r.key === 'concDiff' ? `r_s = ${fx(r.scaleKpc, 1)} kpc` : r.key === 'diskComp' ? r.comp : '—';
    out.push(`| ${r.ja} | ${size} | ${e3(r.wz)} | ${dir(r.wz)} |`);
  }
  // D 宣言の型
  out.push('', '| 「中心」の宣言 | 質量 [kg] | J [kg m²/s] | 等価の R_src [kpc] | 太陽が R_src の内 | bevel の主項 [1/s] | 半渦度 [1/s] |', '|---|---|---|---|---|---|---|');
  for (const p of D.proxy) out.push(`| ${p.ja} | ${e3(p.M)} | ${e3(p.J)} | ${p.RsrcKpc < 1e-3 ? e3(p.RsrcKpc) : fx(p.RsrcKpc, 2)} | ${yn(p.inside)} | ${p.bevel === null ? '—(内側では主項の式の外)' : e3(p.bevel)} | ${e3(p.halfCurl)} |`);
  out.push('', '| 重ならない成分の和(combineDisjoint) | 受理 | 期待 |', '|---|---|---|');
  for (const c of D.cases) out.push(`| ${c.ja} | ${yn(c.accepted)} | ${yn(c.expect)} |`);
  // B 演算の比べ
  out.push('', '| 太陽の位置の極角 θ(J の軸から) | bevel の主項の大きさ [1/s] | J 双極子の半渦度の大きさ [1/s] | 比 bevel/半渦度 | 2 つのベクトルの角 [°] |', '|---|---|---|---|---|');
  for (const r of B.rows) out.push(`| ${fx(r.thetaDeg, 1)}° | ${r.bevelAbs === 0 ? '0' : e3(r.bevelAbs)} | ${e3(r.halfCurlAbs)} | ${r.ratio === null ? '—' : fx(r.ratio, 3)} | ${r.angDeg === null ? '—' : fx(r.angDeg, 1)} |`);
  out.push('', '| つなぐ対応の候補 | 同じ演算 | R_cut に依らない(λ_c = κ_v = 1) | 自由な係数 | 新しい仮定 |', '|---|---|---|---|---|');
  for (const c of B.candidates) out.push(`| ${c.ja} | ${yn(c.sameOp)} | ${yn(c.partitionFree)} | ${c.free.join('・')} | ${c.newAssump.join('・')} |`);
  // R 6 天体
  out.push('', '| 天体 | 役割 | Ω̂·ĝ | 太陽の項の abs(ω)(案3 J)[rad/s] | 今 [rad/s] | Ω と太陽の項の角 [°] | 太陽の項で減速 | +ĝ の銀河の項で減速 | −ĝ の銀河の項で減速 |', '|---|---|---|---|---|---|---|---|---|');
  for (const r of R.rows) out.push(`| ${r.name} | ${r.role} | ${fx(r.OmDotG, 3)} | ${e3(r.wSunP3Abs)} | ${e2(r.wSunNowAbs)} | ${fx(r.angOmSunP3, 1)} | ${yn(r.sunDecelP3)} | ${yn(r.OmDotG < 0)} | ${yn(r.OmDotG > 0)} |`);
  out.push('', `| 銀河の項の候補 | ω_nb·ĝ [1/s] | 向き | 拮抗(${R.order.join('・')}) | 合成の後の減速が太陽の項だけと違う天体(案3 J) | 同(今の太陽の項) | 木星の abs(銀河)/abs(太陽)(案3 J) | 土星の比 |`, '|---|---|---|---|---|---|---|---|');
  for (const c of R.cands) {
    const bits = R.rows.map((r) => (r.judge[c.key].antag ? '拮抗' : '同じ向き')).join('・'), flips = R.rows.filter((r) => r.judge[c.key].flipBySum).map((r) => r.name), ju = R.rows.find((r) => r.i === 6), sa = R.rows.find((r) => r.i === 11);
    const flipsNow = R.rows.filter((r) => r.judge[c.key].sumDecelNow !== r.sunDecelNow).map((r) => r.name);
    out.push(`| ${c.ja} | ${e3(c.w)} | ${dir(c.w)} | ${bits} | ${flips.length ? flips.join('・') : 'なし'} | ${flipsNow.length ? flipsNow.join('・') : 'なし'} | ${e2(ju.judge[c.key].galOverSun)} | ${e2(sa.judge[c.key].galOverSun)} |`);
  }
  const t = R.tally;
  out.push('', '| 掃引の全候補(R_cut × 演算 A・B・Bco × κ_v × λ_c)の向き | +ĝ | −ĝ | 0 |', '|---|---|---|---|', `| 候補の数(6 天体の拮抗は +ĝ で ${R.bitsPlus}・−ĝ で ${R.bitsMinus}) | ${t.plus} | ${t.minus} | ${t.zero} |`);
  // 新しい記号 κ_v はコードの書式で(lint.kappaSymbol315 —— 裸のカッパは κ_D だけ)
  return out.join('\n').replace(/κ_v/g, '`κ_v`');
}

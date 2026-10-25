// 第315便d(原仮定者の裁定(第117報)・決断事項 AN413・AN410・AN412・AN414〔新記号〕・統括の検証項目 R245): **PHYSICS〔第315便d〕の表の行を正本から作る純関数**
// (文書だけ —— 正本を作る器の meta.code に入れない: 表の書式を直しても正本の来歴は動かない)。QA docs.satK1_315 が PHYSICS〔第315便d〕と逐語で照合する。
//   ・physicsTablesSat(Js): 衛星の K1 の検証の正本(tests/out/satk1-w315d.json)の表 —— 近似要素の種・r_d と r_s の小さい表・主の窓の差と帯・窓 × 刻みの感度・
//     太陽の効き(三体 − 二体)・二体の参照の列(参考)
//   ・physicsTablesGate(Jo): 外惑星の一様の門(決断事項 AN410 —— tests/out/k1outer-w314c.json の門の欄)
//   ・physicsTablesContract(): 16 体の入力の契約の更新(決断事項 AN412 —— tests/lib-w300c-solar16.mjs の人工の入力の変種 —— html を読まない)
// 逐語照合する表に丸めの程度の数を書かない(帯・雑音の桁の差は丸めの床 fmtFloor)。新しい説明の記号は AN414 の新記号(Y_k・r_d・r_s・G_0・c_0)。
import * as Q from './lib-w311d-planet3.mjs';
import * as S16 from './lib-w300c-solar16.mjs';
import { OUTER } from './exp-w314c-k1outer.mjs';
import { QTY, SATS } from './exp-w315d-satk1.mjs';
import { SYSTEM_JA, PARENTS } from './lib-w315d-satk1.mjs';
export const DOC_LIB_VERSION = 'w315d-satdoc-1';

const { ex, fx } = Q;
const fl = (x, floor = 1e-12) => Q.fmtFloor(x, floor, 2);
const yn = (x) => (x === true ? '真' : (x === false ? '偽' : '—'));
const SAT_JA = { io: 'イオ', europa: 'エウロパ', ganymede: 'ガニメデ', callisto: 'カリスト', titan: 'タイタン', triton: 'トリトン' };
const srcLab = (t) => (t.src && t.src.m && t.src.m.indexOf('公表') === 0 ? '公表の近似' : (t.src && t.src.m ? t.src.m.split(' ')[0] : '—'));
const eLab = (t) => (t.src && t.src.e && t.src.e.indexOf('公表') === 0 ? '公表の近似' : srcLab(t));
const sysLab = (sys) => (sys === 'two' ? '二体' : '三体');
const bandsCell = (b) => (b && b.length ? b.map((x) => fl(x)).join('・') : '—');

export function physicsTablesSat(Js) {
  const out = [], sats = (Js.E && Js.E.sats) || Js.sats || SATS;
  if (Js.T) {
    out.push('| 衛星(近似要素の種 —— 観測レコードではない) | 母惑星 | m [kg] | 観測半径 R [m] | 長半径 a [m] | 離心率 e | 赤道面に対する傾き i_eq [°] | 恒星周期(種)[d] | m・R・a の出所 | e の出所 |', '|---|---|---|---|---|---|---|---|---|---|');
    for (const k of sats) { const t = Js.T.systems[k];
      out.push(`| ${SAT_JA[k]} | ${t.parentEmoji} ${PARENTS[t.parent].ja}(凍結の写し —— 母惑星の公転面に対する赤道の傾き ${fx(t.oblDeg, 3)}°) | ${ex(t.m, 4)} | ${ex(t.R, 4)} | ${ex(t.a, 6)} | ${ex(t.e, 3)} | ${t.iEqDeg} | ${fx(t.PDays, 5)} | ${srcLab(t)} | ${eLab(t)} |`); }
  }
  if (Js.P) {
    out.push('', '| 衛星(t = 0 の q11 の写し —— 全天体 r_d = Y_k m・規則の鍵 rdRule:"kappaM") | 衛星の r_d [m] | 衛星の r_d/R | 衛星の r_s/R | 母惑星の r_d [m] | 母惑星の r_d/R | 母惑星の r_s/R | (母惑星の r_d + 衛星の r_d)/a | エンジンの r_d・m_d と Y_k × エンジンの質量(二体・三体の全天体) |', '|---|---|---|---|---|---|---|---|---|');
    for (const k of sats) { const p = Js.P.systems[k], two = p.two, three = p.three; if (!two || two.err || !three || three.err) continue;
      const s = two.bodies[1], m = two.bodies[0], same = [two, three].every((z) => z.bodies.every((b) => b.rdSame && b.mdSame && b.sEngineMass));
      out.push(`| ${SAT_JA[k]} | ${ex(s.rdRule, 4)} | ${ex(s.rdOverR, 3)} | ${ex(s.rsOverR, 3)} | ${ex(m.rdRule, 4)} | ${ex(m.rdOverR, 3)} | ${ex(m.rsOverR, 3)} | ${ex(two.rdSumOverA, 3)} | ${same ? 'ビット同一' : '違う'} |`); }
  }
  if (Js.K && Js.W && Js.B) {
    out.push('', '| 衛星(系・主の窓・最も細かい刻み) | 近点 q11 − q10 [″/世紀] | 刻みの帯 | 窓の差の最大 | 近点 q10 − q00 [″/世紀] | 刻みの帯 | 窓の差の最大 | 恒星周期 q11 − q10 [s] | 刻みの帯 | 交点 q11 − q10 [″/世紀] | 刻みの帯 | 母惑星の軸の角 q11 − q10 [″] | 近点 q11 − q10 の判定 |', '|---|---|---|---|---|---|---|---|---|---|---|---|---|');
    for (const k of sats) for (const sys of Js.E.systems) { const id = k + '|' + sys, b = Js.B.systems[id]; if (!b) continue;
      const q = b.q, v = (Q2, df) => q[Q2][df];
      out.push(`| ${SAT_JA[k]}(${sysLab(sys)}・${b.N} 公転・h/${b.fine}) | ${ex(v('aps', 'dDG').v, 4)} | ${bandsCell(v('aps', 'dDG').bands)} | ${fl(v('aps', 'dDG').winSpread)} | ${ex(v('aps', 'dG').v, 4)} | ${bandsCell(v('aps', 'dG').bands)} | ${fl(v('aps', 'dG').winSpread)} | ${fl(v('sid', 'dDG').v, 1e-9)} | ${bandsCell(v('sid', 'dDG').bands)} | ${fl(v('node', 'dDG').v, 1e-9)} | ${bandsCell(v('node', 'dDG').bands)} | ${fl(v('axPar', 'dDG').v, 1e-9)} | ${v('aps', 'dDG').verdict} |`); }
    out.push('', '| 衛星(系 —— 近点 q11 − q10 の窓 × 刻みの感度・同じ走行の入れ子の窓) | 窓 N 公転 | h | h/2 | h/4 | 帯 h–h/2 | 帯 h/2–h/4 | 許容 1e-2 × abs(q11 − q10) | 許容の内 | 主の窓 |', '|---|---|---|---|---|---|---|---|---|---|');
    for (const k of sats) for (const sys of Js.E.systems) { const id = k + '|' + sys, Kk = Js.K.systems[id], W = Js.W.systems[id]; if (!Kk || !W) continue;
      for (const N of Object.keys(Kk.byWin).map(Number).sort((a, b) => a - b)) { const w = Kk.byWin[N], r = (d) => (w.byDiv[d] ? ex(w.byDiv[d].dDG.aps, 4) : '—'), row = W.rows.find((z) => z.N === N), bb = w.bands.dDG.aps;
        out.push(`| ${SAT_JA[k]}(${sysLab(sys)}) | ${N} | ${r(1)} | ${r(2)} | ${r(4)} | ${fl(bb['1-2'])} | ${fl(bb['2-4'])} | ${row && Number.isFinite(row.tol) ? ex(row.tol, 2) : '—'} | ${yn(row ? row.inTol : null)} | ${N === W.main ? '主' : ''} |`); } }
    out.push('', '| 衛星(太陽の効き —— 同じ窓の三体 − 二体・最も細かい刻み) | 窓 N 公転 | 近点 q00 [″/世紀] | 近点 q11 − q10 [″/世紀] | 交点 q00 [″/世紀] | 交点 q11 − q10 [″/世紀] | 恒星周期 q11 − q10 [s] |', '|---|---|---|---|---|---|---|');
    for (const k of sats) { const z = Js.B.sun[k]; if (!z) continue;
      out.push(`| ${SAT_JA[k]} | ${z.N} | ${ex(z.aps.q00, 4)} | ${fl(z.aps.dDG, 1e-9)} | ${ex(z.node.q00, 4)} | ${fl(z.node.dDG, 1e-9)} | ${fl(z.sid.dDG, 1e-9)} |`); }
    out.push('', '| 衛星(二体の参照 —— 参考・門を付けない) | q_1PN [″/世紀] | 在位の G_loc の解析の一次 [″/世紀] | q_1PN − G_loc の解析 | 二体の近点 q11 − q10(実測) | r_1PN = q11 − q00 − q_1PN(二体) | r_1PN/q_1PN | 帯 |', '|---|---|---|---|---|---|---|---|');
    for (const k of sats) { const t = Js.T.systems[k], b = Js.B.systems[k + '|two']; if (!b) continue;
      out.push(`| ${SAT_JA[k]} | ${ex(t.q1pn, 4)} | ${ex(t.gLocAnalytic, 4)} | ${ex(t.dDGRef, 4)} | ${ex(b.q.aps.dDG.v, 4)} | ${fl(b.r1pn.v, 1e-9)} | ${fl(b.r1pn.rOverQ, 1e-9)} | ${bandsCell(b.r1pn.bands)} |`); }
  }
  return out.join('\n');
}
export function physicsTablesGate(Jo) {
  const out = [];
  if (!Jo || !Jo.G) return '';
  out.push(`| 系(主の窓・h/4 —— 決断事項 AN410 の全系に一様の門) | q_1PN [″/世紀] | r_1PN | r_1PN/q_1PN | min(ε_fit, 1e-2 q_1PN) | abs(r) の門 | 帯(h–h/2・h/2–h/4) | min(ε_num, 1e-2 q_1PN) | 帯の門 | 判定 |`, '|---|---|---|---|---|---|---|---|---|---|');
  for (const s of OUTER) { const g = Jo.G.systems[s.key];
    out.push(`| ${s.emoji} ${s.ja}(${g.N} 公転) | ${ex(g.q1pn, 4)} | ${ex(g.r, 3)} | ${ex(g.rOverQ, 3)} | ${ex(g.gateTol, 3)} | ${yn(g.absOk === true && g.relOk === true)} | ${g.bands.map((x) => fl(x)).join('・')} | ${ex(g.bandTol, 3)} | ${yn(g.bandAbsOk === true && g.bandRelOk === true)} | ${g.verdict} |`); }
  return out.join('\n');
}
/** 第315便d で足した不正な入力の変種(名・期待の符号・拒否・符号の一致)—— 人工の入力だけ(観測レコードではない) */
export const NEW_VARIANT_CODES = Object.freeze(['satelliteParentAdded', 'massConversionG', 'massVersion', 'poleModel', 'composeEpoch', 'composePlane']);
export function contractRows() {
  const rec = S16.syntheticRecord(), all = S16.badVariants(rec);
  return all.filter((z) => NEW_VARIANT_CODES.indexOf(z.code) >= 0).map((z) => { const c = S16.checkSolar16(z.rec), codes = [...new Set(c.errors.map((e) => e.code))];
    return { name: z.name, code: z.code, rejected: !c.ok, hit: codes.indexOf(z.code) >= 0 }; });
}
export function physicsTablesContract() {
  const out = ['| 不正な入力の変種(第315便d —— 人工の入力 SYNTHETIC から作る・観測レコードではない) | 期待の符号 | 拒否 | 符号の一致 |', '|---|---|---|---|'];
  for (const r of contractRows()) out.push(`| ${r.name} | ${r.code} | ${yn(r.rejected)} | ${yn(r.hit)} |`);
  return out.join('\n');
}
/** 本文に書く数(逐語 —— 正本の数を本文の文に引く) */
export function docNumbersSat(Js, Jo) {
  const out = [];
  if (Js && Js.B) for (const k of ['io', 'titan', 'triton']) { const b = Js.B.systems[k + '|two']; if (b) out.push(ex(b.q.aps.dDG.v, 4)); }
  if (Jo && Jo.G) { const g = Jo.G.systems.saturn; out.push(ex(g.rOverQ, 3), fl(Math.max(...g.bands)), ex(g.gateTol, 3)); }
  out.push(String(S16.G0_SI));
  return out;
}
export const qtyLabels = () => QTY.map((q) => q.ja + '(' + q.unit + ')');
export { SYSTEM_JA };

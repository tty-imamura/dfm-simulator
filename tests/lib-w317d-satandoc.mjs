// 第317便d(原仮定者の裁定(第119報)・決断事項 AN431・AN432・統括の検証項目 R253): **PHYSICS〔第317便d〕の表の行を正本から作る純関数**
// (文書だけ —— 正本を作る器の meta.code に入れない: 表の書式を直しても正本の来歴は動かない)。QA docs.satAn317d が PHYSICS〔第317便d〕と逐語で照合する。
//   ・physicsTablesSatAn(J): 正本 tests/out/satan-w317d.json の表 —— 種と単位・解析の一次の率(n × 核 × 型)・候補 Y_k(n) の検算・走行の二体との対照・
//     刻みの帯の次数の観察・トリトンの表の量(大きさ・平行・垂直・刻みの帯・比較の時刻)と刻みごとの値・窓の間の傾き・6 衛星の平行の成分と β_rel(1 + e)
//   ・docNumbersSatAn(J): 本文に引く数(逐語)
// 逐語照合する表に丸めの程度の数を書かない(丸めの桁の数は床 fmtFloor —— 「< 1e-12」)。
import * as Q from './lib-w311d-planet3.mjs';
import { PARENTS } from './lib-w315d-satk1.mjs';
export const DOC_LIB_VERSION = 'w317d-satandoc-1';

const { ex, fx } = Q;
const fl = (x, floor = 1e-12) => Q.fmtFloor(x, floor, 2);
const yn = (x) => (x === true ? '真' : (x === false ? '偽' : '—'));
export const SAT_JA = Object.freeze({ io: 'イオ', europa: 'エウロパ', ganymede: 'ガニメデ', callisto: 'カリスト', titan: 'タイタン', triton: 'トリトン' });
const sysLab = (sys) => (sys === 'two' ? '二体' : '三体');
const lawOf = (J, n) => { const g = J.gLocOfN[n]; return g.law + (g.n !== undefined ? ' n:' + g.n : ''); };
const pair = (a, b, d = 4) => ex(a, d) + ' / ' + ex(b, d);
const bands = (b, floor = 1e-12) => (b && b.length ? b.map((x) => fl(x, floor)).join('・') : '—');

export function physicsTablesSatAn(J) {
  const out = [], sats = J.sats;
  // 種と単位
  out.push('| 衛星(近似要素の種 —— 観測レコードではない) | 母惑星(凍結の写し) | M [kg] | m [kg] | m/M | a [m] | e | p = a(1 − e²) [m] | 恒星周期(種)[d] | q_1PN(二体)[″/世紀] | π G_0 M/(c_0² p) [″/世紀] |',
    '|---|---|---|---|---|---|---|---|---|---|---|');
  for (const k of sats) { const r = J.R.systems[k], s = r.seed;
    out.push(`| ${SAT_JA[k]} | ${PARENTS[s.parent].emoji} ${PARENTS[s.parent].ja} | ${ex(s.M, 4)} | ${ex(s.m, 4)} | ${ex(s.mOverM, 3)} | ${ex(s.a, 6)} | ${ex(s.e, 3)} | ${ex(s.p, 6)} | ${fx(s.PDays, 5)} | ${ex(r.q1pn.tb, 5)} | ${ex(r.unitFc, 5)} |`); }
  // 解析の一次の率(規則の Y_k)
  out.push('', '| 衛星(G_loc の n・law・核 —— 規則の Y_k = 10 G_0/(C_1 c_0²)) | q10 − q00(G_loc)fc / tb [″/世紀] | q11 − q10(引きずり)fc / tb | q11 − q00(和)fc / tb | (q11 − q00)/q_1PN fc / tb |',
    '|---|---|---|---|---|');
  for (const k of sats) for (const n of J.nList) for (const kern of J.kernels) { const z = J.R.systems[k].byN[n][kern];
    out.push(`| ${SAT_JA[k]}(n = ${n}・${lawOf(J, n)}・${kern}) | ${pair(z.fc.gLoc, z.tb.gLoc)} | ${pair(z.fc.drag, z.tb.drag)} | ${pair(z.fc.sum, z.tb.sum)} | ${ex(z.fc.sumOverQ1, 4)} / ${ex(z.tb.sumOverQ1, 4)} |`); }
  // 候補 Y_k(n)
  out.push('', '| 衛星(n —— 候補 Y_k(n) = (6 + 2n) G_0/(C_1 c_0²)) | Y_k(n)/規則の Y_k | Y_k(n) [m/kg] | fc の q11 − q10 [″/世紀] | fc の q11 − q00 | fc の (q11 − q00 − q_1PN)/q_1PN | tb の q11 − q10 | tb の q11 − q00 | tb の (q11 − q00 − q_1PN)/q_1PN | 閉じた式 (2n/3)·Mm/(M + m)² | K2 で同じ率に要る衛星の R_d [m] | 規則の型の R_d = Y_k(n) m [m] | 比 | K2 の R_d/m [m/kg] |',
    '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  for (const k of sats) for (const n of J.nList) { const z = J.Y.systems[k].byN[n];
    out.push(`| ${SAT_JA[k]}(n = ${n}) | ${fx(z.factor, 1)} | ${ex(z.YkSI, 5)} | ${ex(z.fc.drag, 5)} | ${ex(z.fc.sum, 5)} | ${fl(z.fc.rOverQ)} | ${ex(z.tb.drag, 5)} | ${ex(z.tb.sum, 5)} | ${fl(z.tb.rOverQ)} | ${z.tb.rPred === 0 ? '0' : ex(z.tb.rPred, 4)} | ${ex(z.k2.RdNeeded, 4)} | ${ex(z.k2.RdRule, 4)} | ${ex(z.k2.ratio, 3)} | ${ex(z.k2.RdOverM, 3)} |`); }
  // 走行の二体との対照
  if (J.M) {
    out.push('', `| 衛星(二体・窓 ${J.M.window} 公転・模型 ${J.M.model}・h/${J.M.divs[J.M.divs.length - 1]} —— n = 2・K1) | q10 − q00 実測 / 解析 [″/世紀] | 相対の差 | 刻みの帯 | q11 − q10 実測 / 解析 | 相対の差 | 刻みの帯 | q11 − q00 の相対の差 | 差が帯の内(G_loc・引きずり・和) | 第315便d の参照の列 q_1PN − G_loc の解析との差(/ 解析の引きずり) | r_1PN/q_1PN 実測 / 解析 | 第316便d の判定 |`,
      '|---|---|---|---|---|---|---|---|---|---|---|---|');
    for (const k of sats) { const m = J.M.systems[k]; if (!m) continue;
      out.push(`| ${SAT_JA[k]} | ${pair(m.gLoc.meas, m.gLoc.an, 6)} | ${ex(m.gLoc.rel, 2)} | ${bands(m.gLoc.bands)} | ${pair(m.drag.meas, m.drag.an, 6)} | ${ex(m.drag.rel, 2)} | ${bands(m.drag.bands)} | ${ex(m.sum.rel, 2)} | ${yn(m.gLoc.inBand)}・${yn(m.drag.inBand)}・${yn(m.sum.inBand)} | ${ex(m.ref315.rel, 2)} | ${ex(m.r1pn.meas, 3)} / ${ex(m.r1pn.an, 3)} | ${m.verdict316} |`); }
  }
  // 刻みの帯の次数
  if (J.B && J.B.systems) {
    const ws = Object.values(J.B.systems)[0].rows.map((r) => r.N);
    out.push('', `| 衛星(系 —— 第316便d の段 A・模型 L) | 近点 q11 − q10 の帯の比 (h–h/2)/(h/2–h/4) 窓 ${ws.join('・')} | q00 の近点の率(数値の歳差)の同じ比(窓 ${ws[ws.length - 1]}) | 第316便d の判定 |`, '|---|---|---|---|');
    for (const k of sats) for (const sys of ['two', 'three']) { const b = J.B.systems[k + '|' + sys]; if (!b) continue;
      out.push(`| ${SAT_JA[k]}(${sysLab(sys)}) | ${b.rows.map((r) => fx(r.ratio, 2)).join('・')} | ${fx(b.rows[b.rows.length - 1].q00Ratio, 2)} | ${b.verdict316} |`); }
  }
  // トリトンの表の量
  if (J.V && J.V.triton) {
    const V = J.V.triton;
    out.push('', '| トリトン(系・窓 N 公転 —— 公転ごとの平均の離心率ベクトルの差 q11 − q10・h/4) | 比較の時刻 t̄(q10 の N 回目の公転の平均)[d] | Δt̄(q11 − q10)[s] | e(種) | abs(ē)(q10) | abs(Δe) | Δe∥ | Δe⊥ | Δe⊥/e [rad] | 刻みの帯 abs(Δe)(h–h/2・h/2–h/4) | 刻みの帯 Δe∥ | 刻みの帯 Δe⊥ | abs(Δe∥)/帯 | abs(Δe⊥)/帯 | 解析の一次の Δe⊥/e [rad] | β_rel(1 + e) |',
      '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
    for (const sys of ['two', 'three']) { const s = V.systems[sys]; if (!s) continue;
      for (const r of s.rows) out.push(`| トリトン(${sysLab(sys)}・${r.N}) | ${fx(r.tDays, 3)} | ${r.dtSec === 0 ? '0' : ex(r.dtSec, 2)} | ${ex(V.eSeed, 2)} | ${ex(r.e10, 5)} | ${ex(r.dE, 4)} | ${ex(r.par, 4)} | ${ex(r.perp, 3)} | ${ex(r.perpOverE, 3)} | ${bands(r.bandV, 1e-15)} | ${bands(r.bandPar, 1e-15)} | ${bands(r.bandPerp, 1e-15)} | ${ex(r.parOverBand, 2)} | ${ex(r.perpOverBand, 2)} | ${ex(r.refPerpOverE, 3)} | ${ex(r.parRef, 4)} |`); }
    out.push('', '| トリトン(系・窓 N —— 刻みごと h・h/2・h/4) | abs(ē)(q10) | q10 の ē の向きの刻みの差 [rad](h–h/2・h/2–h/4) | Δe∥ | Δe⊥ |', '|---|---|---|---|---|');
    for (const sys of ['two', 'three']) { const s = V.systems[sys]; if (!s) continue;
      for (const r of s.rows) out.push(`| トリトン(${sysLab(sys)}・${r.N}) | ${r.e10ByDiv.map((x) => ex(x, 4)).join('・')} | ${r.dPhi10.map((x) => ex(x, 2)).join('・')} | ${r.parByDiv.map((x) => ex(x, 4)).join('・')} | ${r.perpByDiv.map((x) => ex(x, 3)).join('・')} |`); }
    out.push('', '| トリトン(系 —— 垂直の成分の窓の間の傾き〔窓 8・16・32・64 の Δe⊥/e の時刻への直線〕—— 記録・近点の判定ではない) | 傾き h・h/2・h/4 [″/世紀] | 傾きの刻みの帯(h–h/2・h/2–h/4) | 切片 h・h/2・h/4 [rad] | 解析の一次(二体・K1・規則の Y_k)[″/世紀] | 平行の成分 Δe∥/e の傾き h/4 [/世紀] |',
      '|---|---|---|---|---|---|');
    for (const sys of ['two', 'three']) { const s = V.systems[sys]; if (!s) continue; const ks = Object.keys(s.slope).map(Number).sort((a, b) => a - b);
      out.push(`| トリトン(${sysLab(sys)}) | ${ks.map((d) => ex(s.slope[d].perpRate, 4)).join('・')} | ${s.slopeBands.map((x) => ex(x, 2)).join('・')} | ${ks.map((d) => ex(s.slope[d].perpIcpt, 3)).join('・')} | ${ex(s.rateRef, 4)} | ${ex(s.slope[ks[ks.length - 1]].parSlope, 2)} |`); }
  }
  if (J.V && J.V.parOffset) {
    const P = J.V.parOffset;
    out.push('', `| 衛星(系・窓 ${P.N} 公転・h/4 —— 平行の成分と t = 0 の目安) | abs(ē)(q10) | Δe∥ | β_rel(t = 0 の読み口) | β_rel(1 + e) | Δe∥/(β_rel(1 + e)) | abs(差)/刻みの帯(ベクトルの h/2–h/4 —— 第316便d の段 V の帯) |`, '|---|---|---|---|---|---|---|');
    for (const k of sats) for (const sys of ['two', 'three']) { const z = P.systems[k + '|' + sys]; if (!z) continue;
      out.push(`| ${SAT_JA[k]}(${sysLab(sys)}) | ${ex(z.e10, 4)} | ${ex(z.par, 4)} | ${ex(z.betaRel, 4)} | ${ex(z.ref, 4)} | ${fx(z.ratio, 5)} | ${ex(z.diffOverBand, 2)} |`); }
  }
  return out.join('\n');
}
/** 本文に引く数(逐語 —— 正本の数を本文の文に引く) */
export function docNumbersSatAn(J) {
  const c = J.conclusion, out = [c.mDragInBand, c.mGLocInBand, c.mSumInBand, c.mRef315InBand, ex(c.mDragRelMax, 2), ex(c.k2SameRadiusOverK1Max, 2), fx(c.k2RdOverMRatio[2], 2),
    ex(c.tbROverQ[2].min, 2), ex(c.tbROverQ[2].max, 2), ex(c.tbROverQ[1].min, 2), ex(c.tbROverQ[1].max, 2), fl(c.fcSumSpreadMax), fl(c.fcROverQMax)];
  if (J.V && J.V.triton) { const t2 = J.V.triton.systems.two, t3 = J.V.triton.systems.three, r2 = t2.rows[t2.rows.length - 1], r3 = t3.rows[t3.rows.length - 1];
    out.push(ex(r2.par, 4), ex(r2.parRef, 4), ex(t2.slope[4].perpRate, 4), ex(t2.rateRef, 4), ex(t2.slope[4].perpIcpt, 3), ex(t3.slope[4].perpRate, 4), ex(t3.slope[1].perpRate, 4), ex(t3.slope[2].perpRate, 4),
      ex(r3.perp, 3), fl(r3.bandPerp[r3.bandPerp.length - 1], 1e-15), ex(r2.bandPar[r2.bandPar.length - 1], 2), ex(r2.perpOverBand, 2)); }
  return out;
}

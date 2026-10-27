// 第317便b(原仮定者の決断事項 AN431・統括の検証項目 R251): **PHYSICS〔第317便b〕の衛星の物理の軸の表の行を正本から作る純関数**
// (文書だけ —— 正本を作る器の meta.code に入れない: 表の書式を直しても正本の来歴は動かない)。QA docs.satN317b が PHYSICS〔第317便b〕と逐語で照合する。
//   ・physicsTablesSatN(J): 衛星の物理の軸の正本(tests/out/satn-w317b.json)の表 —— 二体の格子(衛星 × n × 核の行 × M0 と通過の窓の判定・解析の一次)・
//     そろえる量 Σ = q11 − q00(K1-Y(n))・K2 の効きの大きさ(K1-rule の何分の一か・α² の伸び)・三体(イオ —— 二体で決まった組だけ)・三体へ流した組
// 逐語照合する表に丸めの程度の数を書かない(帯・雑音の桁の差は丸めの床 fmtFloor)。表は正本に保存した値から作る(作り直した値は QA が相対 1e-12 で正本と照合する)。
import * as Q from './lib-w311d-planet3.mjs';
import { combosOf } from './exp-w317b-satn.mjs';
export const DOC_LIB_VERSION = 'w317b-satndoc-1';

const { ex, fx } = Q;
const fl = (x, floor = 1e-12) => Q.fmtFloor(x, floor, 2);
const yn = (x) => (x === true ? '真' : (x === false ? '偽' : '—'));
const det = (x) => (x === true ? '決まった' : '決まらない');
export const SAT_JA = Object.freeze({ io: 'イオ', europa: 'エウロパ', ganymede: 'ガニメデ', callisto: 'カリスト', titan: 'タイタン', triton: 'トリトン' });
export const KR_JA = Object.freeze({ k1rule: 'K1-rule', k1y: 'K1-Y(n)', k2same: 'K2(i) α = 1', k2a1e4: 'K2(ii) α = 10⁴', k2a1e6: 'K2(ii) α = 10⁶', k2sqrt: 'K2(iii) √(m_☉ m)' });
const sysLab = (sys) => (sys === 'two' ? '二体' : '三体');
const fineOf = (E) => { const ds = E.divs.slice().sort((a, b) => a - b); return ds[ds.length - 1]; };
const atL = (v) => v.byWin[v.longest];

export function physicsTablesSatN(J) {
  const out = [];
  if (J.J2) {
    const E = J.E2, f = fineOf(E);
    out.push(`| 衛星(二体・n・核の行) | q11 − q10 の M0 [″/世紀](${E.runN} 公転・h/${f}) | 刻みの帯 h–h/2・h/2–h/4 | 窓 ${E.windows[E.windows.length - 2]}→${E.runN} の差 / 帯 | R1 | R2 | M0 の判定 | 通過の窓の判定(第316便d の型) | q10 − q00 [″/世紀] | 解析の一次(引きずり・G_loc)[″/世紀] | Σ = q11 − q00 [″/世紀] |`,
      '|---|---|---|---|---|---|---|---|---|---|---|');
    for (const sat of E.sats) for (const c of combosOf(E.kernels)) {
      const z = J.J2.systems[sat][c.kr + '|n=' + c.n]; if (!z) continue;
      const m = z.m0, zl = atL(m), q = zl.byDiv[f], last = m.steps[m.steps.length - 1], rf = J.X.twoRefs[sat] ? J.X.twoRefs[sat][c.kr + '|n=' + c.n] : null;
      out.push(`| ${SAT_JA[sat]}(二体・n = ${c.n}・${KR_JA[c.kr]}) | ${ex(zl.v, 4)} | ${Object.values(zl.bands).map((x) => fl(x)).join('・')} | ${last && Number.isFinite(last.overBand) ? fx(last.overBand, 2) : '—'} | ${yn(m.R1)} | ${yn(m.R2)} | ${det(m.determined)} | ${det(z.pass.determined)} | ${q ? ex(q.dG, 4) : '—'} | ${rf ? (Number.isFinite(rf.dragA) ? ex(rf.dragA, 4) : '—') + '・' + ex(rf.gLocA, 4) : '—'} | ${q ? ex(q.sum, 4) : '—'} |`);
    }
  }
  if (J.X && J.X.align) {
    out.push('', '| 衛星(二体 —— そろえる量 Σ = q11 − q00・M0・最長の窓・最も細かい刻み) | Σ(n = 2・K1-rule) | Σ(n = 1・K1-Y(1)) | Σ(n = 0・K1-Y(0)) | 差の最大 / Σ(2) | n によらずそろう(1e-2) | (Σ − q_1PN)/q_1PN(n = 2・1・0) | 参考: K1-rule の Σ(n = 1)・Σ(n = 0) |',
      '|---|---|---|---|---|---|---|---|');
    for (const sat of J.E2.sats) { const a = J.X.align[sat]; if (!a || !a.byN[2]) continue;
      const dmax = Math.max(...Object.values(a.byN).map((x) => x.devOverSum));
      out.push(`| ${SAT_JA[sat]} | ${ex(a.byN[2].sum, 4)} | ${a.byN[1] ? ex(a.byN[1].sum, 4) : '—'} | ${a.byN[0] ? ex(a.byN[0].sum, 4) : '—'} | ${fl(dmax)} | ${a.aligned ? '真' : '偽'} | ${[2, 1, 0].map((n) => (a.byN[n] ? ex(a.byN[n].rOverQ, 2) : '—')).join('・')} | ${[1, 0].map((n) => (a.byN[n] ? ex(a.byN[n].sumRule, 4) : '—')).join('・')} |`); }
  }
  if (J.X && J.X.k2) {
    out.push('', '| 衛星(系 —— K2 の効きの大きさ = K2 の q11 − q10 / K1-rule の q11 − q10・同じ n・M0・最長の窓・最も細かい刻み) | K1-rule(n = 2)[″/世紀] | K2(i) α = 1 | K2(ii) α = 10⁴ | K2(ii) α = 10⁶(n = 2・1・0) | K2(iii) √(m_☉ m) | α² の伸び(10⁶ / 10⁴ の比 / 10⁴) | K1 と同じ大きさの α の外挿 | 帯の内で決まった K2 の行 |',
      '|---|---|---|---|---|---|---|---|---|');
    for (const sys of ['two', 'three']) { const K = J.X.k2[sys]; if (!K) continue;
      for (const [sat, o] of Object.entries(K)) { const r = (k) => (o.rows[k] ? ex(o.rows[k].ratio, 3) : '—'), dets = Object.entries(o.rows).filter(([, z]) => z.determined).map(([k]) => KR_JA[k.split('|')[0]] + (k.endsWith('n=2') ? '' : '(' + k.split('|')[1] + ')'));
        out.push(`| ${SAT_JA[sat]}(${sysLab(sys)}) | ${ex(o.k1, 4)} | ${r('k2same|n=2')} | ${r('k2a1e4|n=2')} | ${['k2a1e6|n=2', 'k2a1e6|n=1', 'k2a1e6|n=0'].map(r).join('・')} | ${r('k2sqrt|n=2')} | ${ex(o.alphaSq.a1e6over1e4, 3)} | ${ex(o.alphaSq.alphaEq, 2)} | ${dets.length ? dets.join('・') : '—'} |`); } }
  }
  if (J.J3) {
    const E = J.E3, f = fineOf(E), ws = E.windows.slice().sort((a, b) => a - b);
    out.push('', `| 衛星(三体・n・核の行 —— 二体で M0 が決まった組だけ) | q11 − q10 の M0 窓 ${ws.join(' | 窓 ')} [″/世紀] | 刻みの帯 h/2–h/4(窓 ${E.runN}) | 窓 ${ws[ws.length - 2]}→${E.runN} の差 / 帯 | R1 | R2(帯の最大 / 許容) | M0 の判定 | 通過の窓(第316便d の型)R1・R2・判定 | 二体の q11 − q10 |`,
      '|---|' + ws.map(() => '---|').join('') + '---|---|---|---|---|---|---|');
    for (const sat of E.sats) for (const c of combosOf(E.kernels)) {
      const z = J.J3.systems[sat] ? J.J3.systems[sat][c.kr + '|n=' + c.n] : null; if (!z) continue;
      const m = z.m0, zl = atL(m), last = m.steps[m.steps.length - 1], x3 = J.X.three[sat] ? J.X.three[sat][c.kr + '|n=' + c.n] : null;
      out.push(`| ${SAT_JA[sat]}(三体・n = ${c.n}・${KR_JA[c.kr]}) | ${ws.map((N) => ex(m.byWin[N].v, 4)).join(' | ')} | ${fl(zl.bandFine)} | ${last && Number.isFinite(last.overBand) ? fx(last.overBand, 2) : '—'} | ${yn(m.R1)} | ${yn(m.R2)}(${Number.isFinite(m.R2over) ? fx(m.R2over, 2) : '—'}) | ${det(m.determined)} | ${yn(z.pass.R1)}・${yn(z.pass.R2)}・${det(z.pass.determined)} | ${x3 ? ex(x3.two, 4) : '—'} |`);
    }
    out.push('', '| 衛星(三体へ流した組 —— 二体の M0 で決まった組だけ) | 流した組 | 流さなかった組(二体で帯の外) |', '|---|---|---|');
    for (const sat of E.sats) { const all = combosOf(J.E2.kernels), run = E.combos[sat].map((c) => c.kr + '|n=' + c.n), lab = (c) => KR_JA[c.kr] + '・n = ' + c.n;
      out.push(`| ${SAT_JA[sat]} | ${E.combos[sat].length ? E.combos[sat].map(lab).join('/') : '—'} | ${all.filter((c) => !run.includes(c.kr + '|n=' + c.n)).map(lab).join('/') || '—'} |`); }
  }
  return out.join('\n');
}
/** 本文に書く数(逐語 —— 正本の数を本文の文に引く) */
export function docNumbersSatN(J) {
  const out = [];
  if (J.J2) { let n = 0, d = 0; for (const s of Object.values(J.J2.systems)) for (const z of Object.values(s)) { n++; if (z.m0.determined) d++; } out.push(d + '/' + n); }
  if (J.J3) { let n = 0, d = 0; for (const s of Object.values(J.J3.systems)) for (const z of Object.values(s)) { n++; if (z.m0.determined) d++; } out.push(d + '/' + n); }
  if (J.prefix) out.push(String(J.prefix.same) + '/' + String(J.prefix.compared));
  return out;
}

// 第317便a(原仮定者の裁定(第119報)・決断事項 AN431・統括の検証項目 R250): **PHYSICS〔第317便a〕の衛星の測る量の表の行を正本から作る純関数**
// (文書だけ —— 正本を作る器の meta.code に入れない: 表の書式を直しても正本の来歴は動かない)。QA docs.satMeas317a が PHYSICS〔第317便a〕と逐語で照合する。
//   ・physicsTablesSatMeas(J): 衛星の測る量と予算の正本(tests/out/satmeas-w317a.json)の表 —— 衛星ごとの答え・測る量 × 基の格子・予算の格子(長い窓・細かい步)・
//     差の回帰と回帰の差・慣性速度と座標速度の要素の差・計画行列の診断・離心率ベクトルの差(3 つの定義)
// 逐語照合する表に丸めの程度の数を書かない(帯・雑音の桁の差は丸めの床 fmtFloor)。表は正本に保存した値から作る(作り直した値は QA が相対 1e-12 で正本と照合する)。
import * as Q from './lib-w311d-planet3.mjs';
import { SATS, MEASURE_KEYS } from './exp-w317a-satmeas.mjs';
import { PARENTS } from './lib-w315d-satk1.mjs';
export const DOC_LIB_VERSION = 'w317a-satmeasdoc-1';

const { ex, fx } = Q;
const fl = (x, floor = 1e-12) => Q.fmtFloor(x, floor, 2);
const yn = (x) => (x === true ? '真' : (x === false ? '偽' : '—'));
const SAT_JA = { io: 'イオ', europa: 'エウロパ', ganymede: 'ガニメデ', callisto: 'カリスト', titan: 'タイタン', triton: 'トリトン' };
const sysLab = (sys) => (sys === 'two' ? '二体' : '三体');
const MLAB = { pass: '通過の窓', M0: 'M0', EIg: 'E_I(Δ)', ECg: 'E_C(Δ)', EX: 'E_X', direct: '差の回帰(固定の ê₀)', directRot: '差の回帰(回る ê₁₀)', syn: '会合周期の窓' };
const ratio = (x) => (Number.isFinite(x) ? fx(x, 2) : '—');
const GJA = { long: '窓 128', step8: '步 h/8' };
const dl = (d) => (d === 1 ? 'h' : 'h/' + d);
const bandLab = (ds) => { const o = []; for (let i = 1; i < ds.length; i++) o.push(dl(ds[i - 1]) + '–' + dl(ds[i])); return o.join('・'); };

export function physicsTablesSatMeas(J) {
  const out = [], sats = (J.E && J.E.sats) || SATS, G = J.M.grids;
  // ① 衛星ごとの答え(三体)
  if (J.A) {
    out.push('| 衛星(三体) | 通過の窓(第316便d)の判定 | M0 の R1 比 / R2 比(基の格子) | 測り方だけで決まった測る量 | 予算の格子で決まった測る量 | 刻みの見積り(M0 —— 外挿・次数 p) | 答え |', '|---|---|---|---|---|---|---|');
    for (const k of sats) { const a = J.A.systems[k]; if (!a) continue;
      const bud = Object.entries(a.budget).map(([g, z]) => GJA[g] + ': ' + (z.determinedBy.length ? z.determinedBy.map((m) => MLAB[m]).join('・') : 'なし')).join(' / ') || '—';
      out.push(`| ${SAT_JA[k]} | ${a.passBase ? '決まった' : '決まらない'} | ${ratio(a.M0base.r1Ratio)} / ${ratio(a.M0base.r2Ratio)} | ${a.measOnly.length ? a.measOnly.map((m) => MLAB[m]).join('・') : 'なし'} | ${bud} | ${a.stepNeedM0.div ? 'h/' + a.stepNeedM0.div : '—'}(p = ${ratio(a.stepNeedM0.p)}) | ${a.answer} |`); }
  }
  // ② 測る量 × 基の格子(h・h/2・h/4 × 窓 8〜64 —— 値は最も細かい刻み)
  if (G.base) {
    const B = G.base, ws = B.windows, fine = B.divs[B.divs.length - 1];   // 値は最も細かい刻み
    out.push('', `| 衛星(系・測る量 —— 近点の率の差 q11 − q10 [″/世紀]・${dl(fine)}) | ${ws.map((N) => '窓 ' + N).join(' | ')} | 刻みの帯 ${bandLab(B.divs)}(窓 ${ws[ws.length - 1]}) | 窓 ${ws[ws.length - 2]}→${ws[ws.length - 1]} の差 / 帯 | 帯 / 許容 | R1 | R2 | 判定 |`,
      '|---|' + ws.map(() => '---|').join('') + '---|---|---|---|---|---|');
    for (const k of sats) for (const sys of ['two', 'three']) {
      const o = B.systems[k + '|' + sys]; if (!o) continue;
      for (const Mk of MEASURE_KEYS) { const r = o.measures[Mk];
        out.push(`| ${SAT_JA[k]}(${sysLab(sys)}・${MLAB[Mk]}) | ${ws.map((N) => ex(r.byWin[N], 4)).join(' | ')} | ${r.bands.map((b) => fl(b)).join('・')} | ${ratio(r.r1Ratio)} | ${ratio(r.r2Ratio)} | ${yn(r.R1)} | ${yn(r.R2)} | ${r.determined ? '決まった' : '決まらない'} |`); } }
  }
  // ③ 予算の格子(長い窓・細かい步)
  for (const gk of ['long', 'step8']) { const B = G[gk]; if (!B) continue; const ws = B.windows, ds = B.divs, fine = ds[ds.length - 1];   // 値は最も細かい刻み
    out.push('', `| 衛星(${GJA[gk]}・測る量 —— 近点の率の差 q11 − q10 [″/世紀]・${dl(fine)}) | ${ws.map((N) => '窓 ' + N).join(' | ')} | 刻みの帯 ${bandLab(ds)}(窓 ${ws[ws.length - 1]}) | 窓 ${ws[ws.length - 2]}→${ws[ws.length - 1]} の差 / 帯 | 帯 / 許容 | R1 | R2 | 判定 |`,
      '|---|' + ws.map(() => '---|').join('') + '---|---|---|---|---|---|');
    for (const id of Object.keys(B.systems)) { const [k] = id.split('|'), o = B.systems[id];
      for (const Mk of MEASURE_KEYS) { const r = o.measures[Mk];
        out.push(`| ${SAT_JA[k]}(${GJA[gk]}・${MLAB[Mk]}) | ${ws.map((N) => ex(r.byWin[N], 4)).join(' | ')} | ${r.bands.map((b) => fl(b)).join('・')} | ${ratio(r.r1Ratio)} | ${ratio(r.r2Ratio)} | ${yn(r.R1)} | ${yn(r.R2)} | ${r.determined ? '決まった' : '決まらない'} |`); } } }
  // ④ 差の回帰と回帰の差(最も細かい刻み・最長の窓)
  if (J.I) {
    out.push('', '| 衛星(系 —— h/4・窓 64) | M0 [″/世紀] | 同じ計画行列の回帰の差 | θ の効き(M0 − 同じ計画行列) | 差の回帰(固定の ê₀)c₁ | 一次の補正 −ϖ̇₁₀·Δe∥/e | −(ė₁₀/e)·Δϖ⊥ | 二次の残り | 差の回帰(回る ê₁₀) | 回る ê₁₀ − M0 |', '|---|---|---|---|---|---|---|---|---|---|');
    for (const k of sats) for (const sys of ['two', 'three']) { const o = J.I.systems[k + '|' + sys]; if (!o) continue; const z = o.rows[o.rows.length - 1]; if (!z) continue;
      out.push(`| ${SAT_JA[k]}(${sysLab(sys)}) | ${ex(z.M0, 4)} | ${ex(z.sameX, 4)} | ${fl(z.thetaEff)} | ${ex(z.c1, 4)} | ${ex(z.corr1, 3)} | ${fl(z.corr2)} | ${fl(z.resid2)} | ${ex(z.c1rot, 4)} | ${fl(z.rotMinusM0)} |`); }
  }
  // ⑤ 慣性速度と座標速度の要素の差(E_C − E_I)
  if (J.C) {
    out.push('', '| 衛星(系 —— h/4・窓 64) | q10 の率 E_C − E_I [″/世紀] | q11 の率 E_C − E_I | q10 の abs(e_C − e_I)/e | q11 の abs(e_C − e_I)/e | q11 の平行 / 垂直(/e) | 差 q11 − q10 の E_C − E_I [″/世紀] |', '|---|---|---|---|---|---|---|');
    for (const k of sats) for (const sys of ['two', 'three']) { const z = J.C.systems[k + '|' + sys]; if (!z) continue;
      out.push(`| ${SAT_JA[k]}(${sysLab(sys)}) | ${fl(z.q10.dRate)} | ${fl(z.q11.dRate)} | ${fl(z.q10.dEOverE)} | ${fl(z.q11.dEOverE)} | ${ex(z.q11.parOverE, 2)} / ${ex(z.q11.perpOverE, 2)} | ${fl(z.dMeas)} |`); }
  }
  // ⑥ 計画行列の診断(q10・h/4・窓 64)と会合周期
  if (J.E) {
    out.push('', '| 衛星(系 —— q10・h/4・窓 64) | M0 の条件数 / 実効ランク / 形式の標準誤差 [″/世紀] | E_I(Δ) | E_C(Δ) | E_X | 差の回帰の形式の標準誤差(固定 / 回る) | 会合周期 [d](母惑星の公転周期) | 会合周期の窓の公転の数(窓 64) |', '|---|---|---|---|---|---|---|---|');
    const fine = G.base.divs[G.base.divs.length - 1], N = G.base.windows[G.base.windows.length - 1];
    const cell = (f) => (f ? `${ex(f.cond, 3)} / ${f.rank} / ${ex(f.se, 2)}` : '—');
    for (const k of sats) for (const sys of ['two', 'three']) { const r = Object.values(J.E.rows).find((x) => x.status === 'run' && x.spec.sat === k && x.spec.sys === sys && x.spec.div === fine); if (!r) continue;
      const w = r.q10.win[N], d = r.pair[N] && r.pair[N].direct, sy = J.syn[k];
      out.push(`| ${SAT_JA[k]}(${sysLab(sys)}) | ${cell(w.M0)} | ${cell(w.EIg)} | ${cell(w.ECg)} | ${cell(w.EX)} | ${d ? ex(d.se1, 2) + ' / ' + ex(d.seRot, 2) : '—'} | ${fx(sy.PsynDays, 4)}(${fx(sy.PplanetDays, 1)}${sy.sense < 0 ? '・逆行' : ''}) | ${w.syn ? fx(w.syn.t1OverP, 3) : '—'} |`); }
  }
  // ⑦ 離心率ベクトルの差 q11 − q10(3 つの定義 —— トリトンは全部の窓・他は最長の窓)
  if (J.V) {
    out.push('', '| 衛星(系・窓 —— h/4) | 種の e | E_I: abs(Δe) / 帯 / Δe∥/e / Δe⊥/e | E_C: abs(Δe) / 帯 / Δe∥/e / Δe⊥/e | E_X: abs(Δe) / 帯 / Δe∥/e / Δe⊥/e |', '|---|---|---|---|---|');
    const cell = (z) => `${ex(z.dE, 3)} / ${fl(z.band, 1e-15)} / ${ex(z.parOverE, 3)} / ${ex(z.perpOverE, 3)}`;
    for (const k of sats) for (const sys of ['two', 'three']) { const v = J.V.systems[k + '|' + sys]; if (!v) continue;
      const rows = k === 'triton' ? v.rows : v.rows.filter((r) => r.N === Math.max(...v.rows.map((z) => z.N)));
      for (const r of rows) out.push(`| ${SAT_JA[k]}(${sysLab(sys)}・${r.N} 公転) | ${ex(v.eSeed, 3)} | ${cell(r.defs.EIg)} | ${cell(r.defs.ECg)} | ${cell(r.defs.EX)} |`); }
  }
  return out.join('\n');
}
/** 本文に書く数(逐語 —— 正本の数を本文の文に引く) */
export function docNumbersSatMeas(J) {
  const out = [];
  if (J.prefix) out.push(String(J.prefix.same) + '/' + String(J.prefix.compared));
  if (J.stats) out.push(String(J.stats.pairs), String(J.stats.runs));
  if (J.I) out.push(ex(J.I.linMax, 1));
  return out;
}
export { PARENTS };

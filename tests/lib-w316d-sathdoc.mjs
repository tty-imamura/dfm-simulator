// 第316便d(原仮定者の裁定(第118報)・決断事項 AN423・AN424・統括の検証項目 R249): **PHYSICS〔第316便d〕の衛星の表の行を正本から作る純関数**
// (文書だけ —— 正本を作る器の meta.code に入れない: 表の書式を直しても正本の来歴は動かない)。QA docs.satH316 が PHYSICS〔第316便d〕と逐語で照合する。
//   ・physicsTablesSatH(J): 衛星の三体の診断の正本(tests/out/sath-w316d.json)の表 —— 表の代表(二体)と太陽の効きの記録(三体)・太陽の位相の被覆・
//     調和の回帰の診断(模型 L・H1・H2 × 窓 8・16・32・64)・離心率ベクトルの差・トリトンの各量の分解能
// 逐語照合する表に丸めの程度の数を書かない(帯・雑音の桁の差は丸めの床 fmtFloor)。表は正本に保存した値から作る(作り直した値は QA が相対 1e-12 で正本と照合する)。
import * as Q from './lib-w311d-planet3.mjs';
import { SATS, MODEL_KEYS, EXCLUDE } from './exp-w316d-sath.mjs';
import { PARENTS } from './lib-w315d-satk1.mjs';
export const DOC_LIB_VERSION = 'w316d-sathdoc-1';

const { ex, fx } = Q;
const fl = (x, floor = 1e-12) => Q.fmtFloor(x, floor, 2);
const yn = (x) => (x === true ? '真' : (x === false ? '偽' : '—'));
const SAT_JA = { io: 'イオ', europa: 'エウロパ', ganymede: 'ガニメデ', callisto: 'カリスト', titan: 'タイタン', triton: 'トリトン' };
const sysLab = (sys) => (sys === 'two' ? '二体' : '三体');
const bandsCell = (b) => (b && b.length ? b.map((x) => fl(x)).join('・') : '—');
const vCell = (z) => (z ? z.verdict : '—');   // 判定の語(判定から外す量は呼ぶ側で値と理由を残す)

export function physicsTablesSatH(J) {
  const out = [], sats = (J.E && J.E.sats) || SATS;
  if (J.C) {
    const B = J.C.B;
    out.push('| 衛星(代表 = 母惑星との二体・主の窓・最も細かい刻み) | 近点 q11 − q10 [″/世紀] | 刻みの帯 | 窓の差の最大(8〜64) | 近点の判定 | 恒星周期 q11 − q10 [s] | 恒星周期の判定 | 交点 q11 − q10 [″/世紀] | 交点の判定 | 三体の近点 q11 − q10(太陽の効きの記録 —— 合否の数にしない) | 三体 − 二体(同じ窓) |',
      '|---|---|---|---|---|---|---|---|---|---|---|');
    for (const k of sats) { const b = B.systems[k + '|two'], c = B.systems[k + '|three'], s = B.sun[k]; if (!b) continue;
      const ap = b.q.aps.dDG, ex1 = EXCLUDE[k + '|aps'];
      out.push(`| ${SAT_JA[k]}(${b.N} 公転・h/${b.fine}) | ${ex(ap.v, 4)} | ${bandsCell(ap.bands)} | ${fl(ap.winSpread)} | ${ex1 ? '判定から外す —— ' + ex1 : vCell(ap)} | ${fl(b.q.sid.dDG.v, 1e-9)} | ${vCell(b.q.sid.dDG)} | ${fl(b.q.node.dDG.v, 1e-9)} | ${vCell(b.q.node.dDG)} | ${c ? ex(c.q.aps.dDG.v, 4) + '(' + c.N + ' 公転・' + c.q.aps.dDG.verdict + ')' : '—'} | ${s ? fl(s.aps.dDG, 1e-9) + '(' + s.N + ' 公転)' : '—'} |`); }
    const C = J.C.rep.count;
    out.push('', '| 量(代表 = 二体の q11 − q10) | 判定した衛星 | 数値の帯の内(刻みと窓) | 判定から外した衛星 |', '|---|---|---|---|');
    for (const [qk, z] of Object.entries(C)) out.push(`| ${qk} | ${z.judged} | ${z.inBand} | ${z.excluded.length ? z.excluded.map((x) => SAT_JA[x]).join('・') : '—'} |`);
  }
  if (J.A) {
    out.push('', '| 衛星(太陽の位相の被覆 —— 二体と三体で同じ入力) | 母惑星の公転周期 [d] | 窓 8・16・32・64 の日数 | 窓の中の 2λ☉ の動き [°] | 窓の中の近点の動き(三体の q00)[°] |', '|---|---|---|---|---|');
    for (const k of sats) { const o = J.A.systems[k + '|three']; if (!o) continue; const ws = Object.keys(o.phase).map(Number).sort((a, b) => a - b);
      out.push(`| ${SAT_JA[k]}(${PARENTS[J.T.systems[k].parent].ja}) | ${fx(o.sunPeriodDays, 1)} | ${ws.map((N) => fx(o.phase[N].days, 1)).join('・')} | ${ws.map((N) => fx(o.phase[N].dDDeg, 2)).join('・')} | ${ws.map((N) => ex(o.phase[N].dVarpiDegQ00, 2)).join('・')} |`); }
    out.push('', '| 衛星(系・模型) | 近点 q11 − q10 窓 8 [″/世紀] | 窓 16 | 窓 32 | 窓 64 | 刻みの帯 h/2–h/4(窓 64) | 窓 32→64 の差 / 帯 | 条件数(窓 64) | 率の誤差の膨らみ(窓 64) | 保留の窓の予測の残差 [″](32 公転 → 次の 32) | R1 | R2 | R3 | 判定 |',
      '|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
    for (const k of sats) for (const sys of J.E.systems) { const o = J.A.systems[k + '|' + sys]; if (!o) continue;
      for (const M of MODEL_KEYS) { const m = o.models[M], ws = Object.keys(m.byWin).map(Number).sort((a, b) => a - b), last = m.steps[m.steps.length - 1], zl = m.byWin[m.longest], hN = Object.keys(m.holdout).map(Number).sort((a, b) => a - b).pop();
        out.push(`| ${SAT_JA[k]}(${sysLab(sys)}・${M}) | ${ws.map((N) => ex(m.byWin[N].v, 4)).join(' | ')} | ${fl(zl.bandFine)} | ${last && Number.isFinite(last.overBand) ? fx(last.overBand, 2) : '—'} | ${ex(zl.cond, 2)} | ${Number.isFinite(zl.infl) ? ex(zl.infl, 2) : '—'} | ${ex(m.holdout[hN].v, 2)} | ${yn(m.R1)} | ${yn(m.R2)} | ${M === 'L' ? '—' : yn(m.R3)} | ${m.determined ? '決まった' : '決まらない'} |`); } }
    out.push('', '| 衛星(系) | 近点 q11 − q10 の永年の効き(規則 HARM_RULE) | 決まった模型 |', '|---|---|---|');
    for (const k of sats) for (const sys of J.E.systems) { const o = J.A.systems[k + '|' + sys]; if (!o) continue;
      out.push(`| ${SAT_JA[k]}(${sysLab(sys)}) | ${o.verdict} | ${o.determinedBy.length ? o.determinedBy.join('・') : '—'} |`); }
  }
  if (J.V) {
    out.push('', '| 衛星(系 —— 公転ごとの平均の離心率ベクトルの差 q11 − q10・最も細かい刻み) | 種の離心率 e | 窓 N 公転 | abs(Δe) | abs(Δe)/e(種) | 刻みの帯 | abs(Δe)/帯 | 平行 Δe∥/e | 垂直 Δe⊥/e [rad] | 二体の解析の一次の Δe⊥/e [rad] |', '|---|---|---|---|---|---|---|---|---|---|');
    for (const k of sats) for (const sys of J.E.systems) { const v = J.V.systems[k + '|' + sys]; if (!v) continue;
      const rows = k === 'triton' ? v.rows : v.rows.filter((r) => r.N === Math.max(...v.rows.map((z) => z.N)));
      for (const r of rows) out.push(`| ${SAT_JA[k]}(${sysLab(sys)}) | ${ex(v.eSeed, 3)} | ${r.N} | ${ex(r.dE, 3)} | ${ex(r.dEOverSeed, 3)} | ${fl(r.band, 1e-12)} | ${Number.isFinite(r.dEOverBand) ? ex(r.dEOverBand, 2) : '—'} | ${ex(r.parOverE, 3)} | ${ex(r.perpOverE, 3)} | ${ex(r.refPerpOverE, 3)} |`); }
  }
  if (J.C) {
    out.push('', '| トリトン(系 —— 量ごとの分解能・主の窓・最も細かい刻み) | 量 | q11 − q10 | 刻みの帯 | 窓の差の最大(8〜64) | 判定 |', '|---|---|---|---|---|---|');
    for (const sys of J.E.systems) { const b = J.C.B.systems['triton|' + sys]; if (!b) continue;
      for (const [qk, lab] of [['sid', '恒星周期 [s]'], ['aps', '近点 [″/世紀]'], ['node', '交点 [″/世紀]'], ['axSat', '衛星の軸 [″]'], ['axPar', '母惑星の軸 [″]']]) { const z = b.q[qk].dDG;
        const fq = (x) => fl(x, qk === 'axSat' || qk === 'axPar' ? 1e-9 : 1e-12);   // 軸の角は丸めの桁(1e-12″)を床で書く
        out.push(`| トリトン(${sysLab(sys)}・${b.N} 公転) | ${lab} | ${fq(z.v)} | ${z.bands && z.bands.length ? z.bands.map(fq).join('・') : '—'} | ${fq(z.winSpread)} | ${qk === 'aps' ? '判定から外す(値と理由を残す)' : z.verdict} |`); } }
  }
  return out.join('\n');
}
/** 本文に書く数(逐語 —— 正本の数を本文の文に引く) */
export function docNumbersSatH(J) {
  const out = [];
  if (J.C) { const c = J.C.rep.count; out.push(c.aps.inBand + '/' + c.aps.judged, c.sid.inBand + '/' + c.sid.judged); }
  if (J.A) { for (const k of ['callisto', 'io']) { const o = J.A.systems[k + '|three']; if (o) out.push(fx(o.phase[64] ? o.phase[64].dDDeg : null, 2)); } }
  if (J.prefix) out.push(String(J.prefix.same) + '/' + String(J.prefix.compared));
  return out;
}

// 第317便c(原仮定者の裁定(第119報)・同 補足 1・原仮定者の裁定(第119報 補足)AN435・決断事項 AN431・統括の検証項目 R252):
// **PHYSICS〔第317便c〕の表の行を正本から作る純関数**(文書だけ —— 正本を作る器の meta.code に入れない: 表の書式を直しても正本の来歴は動かない)。
// QA docs.satCut317c が PHYSICS〔第317便c〕と逐語で照合する。
//   ・physicsTablesSatCut(J): 切る変種の正本(tests/out/satcut-w317c.json)の表 —— 軸の分解の値・t = 0 の軸の ω・M0 の表(変種 × 衛星 × 系 × 窓 × 刻み)・
//     恒星周期の差と二体との差・第316便d の通過の窓との連続性・衛星ごとの答え
// 逐語照合する表に丸めの程度の数を書かない(帯・雑音の桁の差は丸めの床 fmtFloor)。表は正本に保存した値から作る(作り直した値は QA が相対 1e-12 で正本と照合する)。
import * as Q from './lib-w311d-planet3.mjs';
import { VARIANTS } from './lib-w317c-satcut.mjs';
import { SATS } from './exp-w317c-satcut.mjs';
export const DOC_LIB_VERSION = 'w317c-satcutdoc-1';

const { ex, fx } = Q;
const fl = (x, floor = 1e-12) => Q.fmtFloor(x, floor, 2);
const yn = (x) => (x === true ? '真' : (x === false ? '偽' : '—'));
export const SAT_JA = Object.freeze({ io: 'イオ', europa: 'エウロパ', ganymede: 'ガニメデ', callisto: 'カリスト', titan: 'タイタン', triton: 'トリトン' });
const PARENT_JA = { jupiter: '木星', saturn: '土星', neptune: '海王星' };
const sysLab = (sys) => (sys === 'two' ? '二体' : '三体');
const vLab = (v) => v.replace('_f05', ' f=0.5').replace('_f0', ' f=0').replace('_r01', ' r=0.1').replace('_r10', ' r=10').replace('_r1', ' r=1');
const T_UNIT = 1e5;   // 本の時間の単位 [s](10⁵ s)
const vOrder = (J) => VARIANTS.map((v) => v.key).filter((k) => J.E.cells.some((c) => c.v === k));
const verdictWord = (z) => (z.determined ? '決まった' : 'この予算では永年項として決まらない');

export function physicsTablesSatCut(J) {
  const out = [], sats = (J.E && J.E.sats) || SATS;
  if (J.D) {
    const Om = J.D.galaxy.OmRefSI;
    out.push('| 母惑星(太陽 + 母惑星の二体の写し —— 衛星なし) | abs(ω☉,P) [1/本の時間] | abs(ω☉,P) [rad/s] | Ω_ref との比 | 母惑星の Σβ(源 = 太陽) | 分解の和の相対の差(f = 0.5・f = 0) |', '|---|---|---|---|---|---|');
    for (const [pk, p] of Object.entries(J.D.parents)) {
      const sc = p.sumCheck, rs = ['V6b_f05', 'V6b_f0'].map((k) => (sc[k] && sc[k].ok ? fl(sc[k].relErr, 1e-15) : '—')).join('・');
      out.push(`| ${PARENT_JA[pk] || pk} | ${ex(p.omSunPAbs, 3)} | ${ex(p.omSunPAbs / T_UNIT, 3)} | ${ex(p.omSunPAbs / T_UNIT / Om, 3)} | ${ex(p.betaPlanet, 3)} | ${rs} |`);
    }
  }
  if (J.P) {
    out.push('', '| 衛星(三体・t = 0・V0 の q11) | 太陽の軸の ω の大きさ [1/本の時間] | 母惑星の軸の ω | 衛星の軸の ω | 母惑星の Σβ | 衛星の Σβ | 銀河の分の係数の 1 からの差の最大(V6b) |', '|---|---|---|---|---|---|---|');
    for (const k of sats) { const o = J.P.cells['V0|' + k + '|three']; if (!o || !o.omega) continue;
      const mag = (i) => { const z = o.omega.find((r) => r.i === i); return z && z.omega ? Math.hypot(z.omega[0], z.omega[1], z.omega[2]) : null; }, beta = (i) => { const z = o.omega.find((r) => r.i === i); return z ? z.betaSum : null; };
      const g = ['V6b_f05', 'V6b_f0'].map((v) => J.P.cells[v + '|' + k + '|three']).filter((z) => z && z.galaxy).map((z) => z.galaxy.maxDev);
      out.push(`| ${SAT_JA[k]} | ${ex(mag(0), 2)} | ${ex(mag(1), 2)} | ${ex(mag(2), 2)} | ${ex(beta(1), 3)} | ${ex(beta(2), 3)} | ${g.length ? fl(Math.max(...g), 1e-16) : '—'} |`); }
  }
  if (J.A) {
    const ws = J.E.windows.slice().sort((a, b) => a - b), ds = J.E.divs.slice().sort((a, b) => a - b), fine = ds[ds.length - 1], last = ws[ws.length - 1];
    out.push('', `| 衛星(変種・系) | M0 q11 − q10 [″/世紀](h/${fine})窓 ${ws.join(' | 窓 ')} | 刻みの帯 h–h/2・h/2–h/4(窓 ${last}) | 窓 ${ws[ws.length - 2]}→${last} の差 / 帯 | 帯 / 許容 | R1 | R2 | 判定(HARM_RULE の L) | V0 との差(窓 ${last}・h/${fine}) | V0 とビット同一 |`,
      '|' + '---|'.repeat(ws.length + 10));
    for (const k of sats) for (const v of vOrder(J)) for (const sys of ['two', 'three']) {
      const o = J.A.cells[v + '|' + k + '|' + sys]; if (!o) continue; const z = o.m0.verdict, b = o.m0.byWin[last].bands;
      out.push(`| ${SAT_JA[k]}(${vLab(v)}・${sysLab(sys)}) | ${ws.map((N) => ex(o.m0.byWin[N].byDiv[fine] ? o.m0.byWin[N].byDiv[fine].d : null, 4)).join(' | ')} | ${Object.values(b).map((x) => fl(x)).join('・')} | ${Number.isFinite(z.overBand) ? fx(z.overBand, 2) : '—'} | ${Number.isFinite(z.bandOverTol) ? ex(z.bandOverTol, 2) : '—'} | ${yn(z.R1)} | ${yn(z.R2)} | ${verdictWord(z)} | ${o.vsV0 ? (o.vsV0.dv === 0 ? '0' : ex(o.vsV0.dv, 3)) : '—'} | ${o.vsV0 ? yn(o.vsV0.bitSame) : '—'} |`);
    }
    out.push('', `| 衛星(変種) | 三体の恒星周期 q11 − q10 [s](通過の窓 ${last}・h/${fine}) | 二体の同じ差 [s] | 三体 − 二体 の M0(窓 ${last}・h/${fine})[″/世紀] | 二体に対する相対 |`, '|---|---|---|---|---|');
    for (const k of sats) for (const v of vOrder(J)) { const o = J.A.cells[v + '|' + k + '|three']; if (!o) continue; const t = J.A.cells['V0|' + k + '|two'];
      out.push(`| ${SAT_JA[k]}(${vLab(v)}) | ${ex(o.sid.dSidS, 4)} | ${t ? ex(t.sid.dSidS, 4) : '—'} | ${o.vsTwo ? ex(o.vsTwo.dv, 3) : '—'} | ${o.vsTwo ? ex(o.vsTwo.rel, 2) : '—'} |`); }
    out.push('', `| 衛星(V0・系 —— 第316便d と同じ本・同じ步) | 通過の窓 ${last}(第316便d と同じ式)[″/世紀] | M0 窓 ${last} | 差 | 通過の窓の判定(R1・R2) | M0 の判定(R1・R2) |`, '|---|---|---|---|---|---|');
    for (const k of sats) for (const sys of ['two', 'three']) { const o = J.A.cells['V0|' + k + '|' + sys]; if (!o) continue; const p = o.pass.verdict, m = o.m0.verdict;
      out.push(`| ${SAT_JA[k]}(${sysLab(sys)}) | ${ex(p.v, 4)} | ${ex(m.v, 4)} | ${fl(Number.isFinite(p.v) && Number.isFinite(m.v) ? m.v - p.v : null, 1e-9)} | ${yn(p.R1)}・${yn(p.R2)} | ${yn(m.R1)}・${yn(m.R2)} |`); }
    out.push('', '| 衛星 | 二体(V0)の M0 の判定 | 三体で決まった変種 | 三体で決まらない変種 |', '|---|---|---|---|');
    for (const k of sats) { const a = J.A.answer[k]; if (!a) continue;
      out.push(`| ${SAT_JA[k]} | ${a.twoDetermined === null ? '—' : (a.twoDetermined ? '決まった' : 'この予算では永年項として決まらない')} | ${a.determinedBy.length ? a.determinedBy.map(vLab).join('・') : '—'} | ${a.tried.filter((v) => !a.determinedBy.includes(v)).map(vLab).join('・') || '—'} |`); }
  }
  return out.join('\n');
}
/** 本文に書く数(逐語照合) */
export function docNumbersSatCut(J) {
  const out = [];
  if (J.prefix) out.push(String(J.prefix.same) + '/' + String(J.prefix.compared));
  if (J.D) out.push(ex(J.D.galaxy.OmRefSI, 3), fx(J.D.galaxy.ecl.betaDeg, 2));
  return out;
}

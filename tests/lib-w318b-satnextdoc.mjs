// 第318便b(原仮定者の指示(第120報)・決断事項 AN436・AN437・AN439・AN440・AN442・統括の検証項目 R255):
// **PHYSICS〔第318便b〕の表の行を正本から作る純関数**(文書だけ —— 正本を作る器の meta.code に入れない: 表の書式を直しても正本の来歴は動かない)。
// QA docs.satNext318b が PHYSICS〔第318便b〕と逐語で照合する。`node tests/lib-w318b-satnextdoc.mjs --tables` で表を出す。
//   ・physicsTablesSatNext(J): 衛星の次の正本(tests/out/satnext-w318b.json)の表 —— 母惑星の公転周期と窓・AN439 の確かめ直し・V1a の pair の mask・
//     主の表(模型 LS の M0 型の差 × W1・W2 × 刻み・判定)・差の直接の回帰(回る ê₁₀)と模型 L・V0 − V1a・二体との差・計画行列の診断・64 公転の M0 の連続性・
//     トリトンの離心率ベクトルの差・1 ulp の診断の列
//   ・correctionTable317(Jm, Jn): 第317便の記録の訂正の表(第317便a の正本 satmeas-w317a.json の測る量の値と、第317便b の K2 の同じ半径の行)
// 逐語照合する表に丸めの程度の数を書かない(帯・雑音の桁の差は丸めの床 fmtFloor)。表は正本に保存した値から作る(作り直した値は QA が相対 1e-12 で正本と照合する)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as Q from './lib-w311d-planet3.mjs';
export const DOC_LIB_VERSION = 'w318b-satnextdoc-1';

const { ex, fx } = Q;
const fl = (x, floor = 1e-12, d = 2) => Q.fmtFloor(x, floor, d);
const yn = (x) => (x === true ? '真' : (x === false ? '偽' : '—'));
export const SAT_JA = Object.freeze({ io: 'イオ', europa: 'エウロパ', ganymede: 'ガニメデ', callisto: 'カリスト', titan: 'タイタン', triton: 'トリトン' });
const PARENT_JA = { jupiter: '木星', saturn: '土星', neptune: '海王星' };
const V_JA = { V1a: 'V1a', V0: 'V0', V3V1a: 'V3V1a', 'V0-V1a': 'V0 − V1a' };
const verdictWord = (z) => (z && z.determined ? '決まった(この格子と窓の規則を通った)' : 'この予算では永年項として決まらない');
const dsOf = (J) => J.E.divs.slice().sort((a, b) => a - b);
const divLab = (d) => (d === 1 ? 'h' : 'h/' + d);

export function physicsTablesSatNext(J) {
  const out = [], sats = J.E.sats, ds = dsOf(J), fine = ds[ds.length - 1];
  // 1. 母惑星の公転周期と窓
  out.push('| 衛星 | 母惑星 | P_母 [d] | 衛星の恒星周期 P_seed [d] | P_母 / P_seed [公転] | 走行(1.5 P_母)の公転 | W1 の標本の数(h ごと) |', '|---|---|---|---|---|---|---|');
  for (const k of sats.concat(J.E.triton ? [J.E.triton.sat] : [])) { const p = J.P.parents[k]; if (!p) continue;
    const r = J.E.runs[J.E.index['main|V1a|' + k + '|div=' + fine]], w1 = r && r.win && r.win.W1 ? r.win.W1.nSamples : null;
    out.push(`| ${SAT_JA[k]} | ${PARENT_JA[p.parent]} | ${fx(p.PparentDays, 2)} | ${fx(p.PseedDays, 4)} | ${fx(p.orbitsPerParent, 1)} | ${k === (J.E.triton && J.E.triton.sat) ? '—(' + J.E.triton.runN + ' 公転)' : fx(J.E.span * p.orbitsPerParent, 1)} | ${w1 === null ? '—' : String(w1)} |`); }
  // 2. AN439 の確かめ直し(旧 q11 と宣言の形 V2 の 1 公転の状態)
  out.push('', '| 衛星(AN439 —— 旧 q11〔外殻 + spinDrag〕と在位の宣言の形の 1 公転の位置と速度) | 二体 | 三体 |', '|---|---|---|');
  for (const k of Object.keys(SAT_JA)) { const a = J.P.v2[k + '|two'], b = J.P.v2[k + '|three']; if (!a || !b) continue;
    out.push(`| ${SAT_JA[k]} | ${a.bitSame ? 'ビット同一' : '違う'} | ${b.bitSame ? 'ビット同一' : '違う'} |`); }
  // 3. V1a の pair の mask(t = 0 の β)
  out.push('', '| 衛星(三体・t = 0) | 衛星の母惑星からの β(V0 = V1a) | V0 と V1a でビット同一 | 衛星の太陽からの β(V0) | 母惑星の太陽からの β(V0) | V1a の太陽からの β(母惑星・衛星) |', '|---|---|---|---|---|---|');
  for (const [k, z] of Object.entries(J.P.pairs)) if (z.accepted)
    out.push(`| ${SAT_JA[k]} | ${ex(z.satFromPlanet, 4)} | ${yn(z.satFromPlanetSame)} | ${ex(z.satFromSunV0, 4)} | ${ex(z.planetFromSunV0, 4)} | ${z.sunBetaV1a.map((x) => (x === 0 ? '0' : ex(x, 2))).join('・')} |`);
  // 4. 主の表(模型 LS の M0 型の差・回る ê₁₀・模型 L)
  const head = `| 衛星(変種・列) | W1 ${ds.map(divLab).join(' | W1 ')} | W2 ${divLab(fine)} | W1 の刻みの帯(${ds.slice(1).map((d, i) => divLab(ds[i]) + '–' + divLab(d)).join('・')}) | W1→W2 の差 / 帯 | 帯 / 許容 | R1 | R2 | 判定 |`;
  out.push('', head, '|' + '---|'.repeat(ds.length + 7));
  const cols = [['LS|d', '模型 LS・回帰の差'], ['LS|rot', '模型 LS・差の直接の回帰(回る ê₁₀)'], ['L|d', '模型 L・回帰の差(記録)']];
  for (const k of sats) for (const v of J.E.variants) { const c = J.A.cells[v + '|' + k]; if (!c) continue;
    for (const [mk, lab] of cols) { const z = c.models[mk], vd = z.verdict;
      out.push(`| ${SAT_JA[k]}(${V_JA[v]}・${lab}) | ${ds.map((d) => ex(z.vals.W1[d], 5)).join(' | ')} | ${ex(z.vals.W2[fine], 5)} | ${vd.bands.map((x) => fl(x, 1e-9)).join('・')} | ${Number.isFinite(vd.r1Ratio) ? fx(vd.r1Ratio, 2) : '—'} | ${Number.isFinite(vd.r2Ratio) ? ex(vd.r2Ratio, 2) : '—'} | ${yn(vd.R1)} | ${yn(vd.R2)} | ${verdictWord(vd)} |`); } }
  // 5. V0 − V1a(記録の列)と二体との差
  out.push('', `| 衛星 | V0 − V1a(模型 LS・W1・${divLab(fine)})[″/世紀] | W2 | W1 の刻みの帯 | V1a の W1 の値 | V0 の W1 の値 | 二体(第317便c の正本 —— 窓 64・${divLab(fine)}・模型 L) | V1a − 二体(相対) | V0 − 二体(相対) |`, '|---|---|---|---|---|---|---|---|---|');
  for (const k of sats) { const d = J.A.cells['V0-V1a|' + k], a = J.A.cells['V1a|' + k], b = J.A.cells['V0|' + k]; if (!d || !a || !b) continue;
    const ta = a.vsTwo, tb = b.vsTwo;
    out.push(`| ${SAT_JA[k]} | ${ex(d.vals.W1[fine], 4)} | ${ex(d.vals.W2[fine], 4)} | ${d.verdict.bands.map((x) => fl(x, 1e-9)).join('・')} | ${ex(a.models['LS|d'].vals.W1[fine], 5)} | ${ex(b.models['LS|d'].vals.W1[fine], 5)} | ${ta ? ex(ta.two, 5) : '—'} | ${ta ? ex(ta.dv, 3) + '(' + ex(ta.rel, 2) + ')' : '—'} | ${tb ? ex(tb.dv, 3) + '(' + ex(tb.rel, 2) + ')' : '—'} |`); }
  // 6. 計画行列の診断と λ☉ の項の大きさ(q10 の計画行列・最も細かい刻み)
  out.push('', `| 衛星(変種・窓・模型 —— ${divLab(fine)}) | 条件数 | 実効ランク / 列 | 標本の数 | q10 の率の形式の標準誤差 [″/世紀] | 差の直接の回帰の形式の標準誤差 [″/世紀] | 差の系列 Δϖ⊥ の λ☉ の 1 倍・2 倍の振幅 [rad] |`, '|---|---|---|---|---|---|---|');
  for (const k of sats) for (const v of J.E.variants) { const c = J.A.cells[v + '|' + k]; if (!c || !c.diag) continue;
    for (const wk of ['W1', 'W2']) { const w = c.diag[wk]; if (!w) continue;
      for (const mk of ['LS', 'L']) { const z = w[mk]; if (!z) continue;
        out.push(`| ${SAT_JA[k]}(${V_JA[v]}・${wk}・${mk}) | ${fx(z.cond, 3)} | ${z.rank} / ${z.cols} | ${z.n} | ${ex(z.se10, 2)} | ${ex(z.seRot, 2)} | ${z.harmRot ? z.harmRot.map((x) => ex(x, 2)).join('・') : '—'} |`); } } }
  // 7. 64 公転の M0 の連続性と窓の列(模型 L —— 第317便c と同じ式)
  const mw = J.E.m0Wins;
  out.push('', `| 衛星(変種 —— M0・模型 L・${divLab(fine)}) | 窓 ${mw.join(' | 窓 ')} | 窓 32→64 の判定(R1・R2 —— 第317便c の規則) |`, '|' + '---|'.repeat(mw.length + 2));
  for (const k of sats) for (const v of J.E.variants) { const c = J.A.cells[v + '|' + k]; if (!c) continue; const z = c.m0.verdict64;
    out.push(`| ${SAT_JA[k]}(${V_JA[v]}) | ${mw.map((N) => ex(c.m0.byWin[N] ? c.m0.byWin[N][fine] : null, 4)).join(' | ')} | ${yn(z.R1)}・${yn(z.R2)} |`); }
  // 8. トリトンの離心率ベクトルの差
  if (J.TRI) { const T = J.E.triton, td = T.divs.slice().sort((a, b) => a - b), tf = td[td.length - 1], seedE = J.T.systems[T.sat] ? J.T.systems[T.sat].e : null;
    out.push('', `| トリトン(変種・公転 N —— 公転ごとの平均の離心率ベクトルの差 q11 − q10・${divLab(tf)}) | 比較の時刻 t̄ [d] | Δt̄ [s] | e(種) | abs(ē)(q10) | abs(Δe) | Δe∥ | Δe⊥ | Δe⊥/e [rad] | 公転 1..N の Δe⊥/e の傾き [″/世紀] | 刻みの帯 abs(Δe)(${td.slice(1).map((d, i) => divLab(td[i]) + '–' + divLab(d)).join('・')}) | 刻みの帯 Δe∥ | 刻みの帯 Δe⊥ | 刻みの帯 傾き |`, '|' + '---|'.repeat(14));
    for (const v of T.variants) for (const N of T.evecN) { const c = J.TRI.cells[v + '|' + N]; if (!c || !c.fine) continue; const f = c.fine;
      out.push(`| トリトン(${V_JA[v]}・${N}) | ${fx(f.tMeanDays, 3)} | ${f.dtMean === 0 ? '0' : ex(f.dtMean * 1e5, 2)} | ${ex(seedE, 2)} | ${ex(f.e10, 5)} | ${ex(f.mag, 4)} | ${ex(f.par, 4)} | ${ex(f.perp, 3)} | ${ex(f.perpOverE, 3)} | ${ex(f.perpSlope, 3)} | ${c.bands.mag.map((x) => fl(x, 1e-15)).join('・')} | ${c.bands.par.map((x) => fl(x, 1e-15)).join('・')} | ${c.bands.perp.map((x) => fl(x, 1e-15)).join('・')} | ${c.bands.perpSlope.map((x) => fl(x, 1e-6)).join('・')} |`); }
    out.push('', `| トリトン(変種 —— M0・模型 L・${divLab(tf)}・近点は記録だけ) | 窓 ${T.m0Wins.join(' | 窓 ')} |`, '|' + '---|'.repeat(T.m0Wins.length + 1));
    for (const v of T.variants) out.push(`| トリトン(${V_JA[v]}) | ${T.m0Wins.map((N) => ex(J.TRI.m0[v][N][tf], 4)).join(' | ')} |`); }
  // 9. 1 ulp の診断の列
  if (J.ULP) {
    out.push('', '| 1 ulp の診断の列(衛星の初期の x を 1 ulp 上げた q10 と q11 −基の走行・h —— 合否に使わない) | M0 窓 64 の差の変化 [″/世紀] | 模型 LS・W1 の差の変化 | 回る ê₁₀・W1 の変化 | 模型 L・W1 の変化 | abs(Δe) の変化(公転 64・128) | Δe⊥/e の変化(公転 64・128)[rad] |', '|---|---|---|---|---|---|---|');
    for (const [rk, o] of Object.entries(J.ULP.cells)) { if (!o) continue;
      const m64 = o.m0['64'] ? o.m0['64'].diff : null, w = o.win && o.win.W1 ? o.win.W1 : null, ev = o.evec || null;
      out.push(`| ${SAT_JA[o.sat]}(${V_JA[o.v]}) | ${fl(m64, 1e-9)} | ${w && w.LS ? fl(w.LS.d, 1e-9) : '—'} | ${w && w.LS ? fl(w.LS.rot, 1e-9) : '—'} | ${w && w.L ? fl(w.L.d, 1e-9) : '—'} | ${ev ? Object.values(ev).map((z) => (z ? fl(z.mag, 1e-18) : '—')).join('・') : '—'} | ${ev ? Object.values(ev).map((z) => (z ? fl(z.perpOverE, 1e-15) : '—')).join('・') : '—'} |`); }
  }
  return out.join('\n');
}
/**
 * 第317便の記録の訂正の表: 第317便a の正本(satmeas-w317a.json —— 基の格子・窓 64・h/4)の三体ガニメデとトリトンの測る量の値と、
 * 第317便b の正本(satn-w317b.json)の K2 の同じ半径の行の二体の q11 − q10(窓 8〜32・h/4)と、第317便d の正本(satan-w317d.json —— Ja)の二体の解析の一次(tb・K2 の引きずり)。
 */
export const CORR_MEASURES = Object.freeze([['pass', '通過の窓'], ['M0', 'M0'], ['EIg', 'E_I(Δ)'], ['ECg', 'E_C(Δ)〔座標速度〕'], ['EX', 'E_X〔位置だけ〕'], ['direct', '差の回帰(固定の ê₀)'], ['directRot', '差の回帰(回る ê₁₀)'], ['syn', '会合周期の窓']]);
export function correctionTable317(Jm, Jn, Ja) {
  const out = [];
  if (Jm && Jm.M) {
    const sys = Jm.M.grids.base.systems, ms = CORR_MEASURES.filter(([k]) => ['ganymede|three', 'triton|three'].every((s) => sys[s] && sys[s].measures[k]));
    out.push(`| 第317便a の三体(窓 64・h/4 —— 正本 satmeas-w317a.json)[″/世紀] | ${ms.map(([, l]) => l).join(' | ')} | 判定(どの測る量も) |`, '|' + '---|'.repeat(ms.length + 2));
    for (const s of ['ganymede|three', 'triton|three']) { const z = sys[s];
      out.push(`| ${SAT_JA[s.split('|')[0]]} | ${ms.map(([k]) => ex(z.measures[k].v, 5)).join(' | ')} | ${ms.every(([k]) => z.measures[k].determined === false) ? 'どれも決まらない' : '—'} |`); }
  }
  if (Jn && Jn.J2) {
    out.push('', '| 第317便b の K2(同じ半径・n = 2 —— 正本 satn-w317b.json)の二体の q11 − q10(M0・h/4)[″/世紀] | 窓 8 | 窓 16 | 窓 32 | 解析の一次(二体の質量の因子 tb・K2 の引きずり —— 第317便d の正本 satan-w317d.json) |', '|---|---|---|---|---|');
    for (const k of ['io', 'europa', 'ganymede']) { const z = Jn.J2.systems[k] && Jn.J2.systems[k]['k2same|n=2']; if (!z) continue;
      const a = Ja && Ja.R && Ja.R.systems[k] && Ja.R.systems[k].byN['2'] ? Ja.R.systems[k].byN['2'].K2.tb.drag : null;
      out.push(`| ${SAT_JA[k]} | ${['8', '16', '32'].map((N) => ex(z.m0.byWin[N].byDiv['4'].dDG, 4)).join(' | ')} | ${ex(a, 5)} |`); }
  }
  return out.join('\n');
}
/** 本文に書く数(逐語照合) */
export function docNumbersSatNext(J) {
  const out = [];
  if (J.prefix) out.push(String(J.prefix.same) + '/' + String(J.prefix.compared));
  return out;
}
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN && process.argv.includes('--tables')) {
  const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'), i = process.argv.indexOf('--in');
  const J = JSON.parse(fs.readFileSync(i >= 0 ? process.argv[i + 1] : path.join(ROOT, 'tests/out/satnext-w318b.json'), 'utf8'));
  const rdj = (f) => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8')); } catch (e) { return null; } };
  console.log(physicsTablesSatNext(J));
  console.log('\n' + correctionTable317(rdj('tests/out/satmeas-w317a.json'), rdj('tests/out/satn-w317b.json'), rdj('tests/out/satan-w317d.json')));
  console.log('\n' + docNumbersSatNext(J).join(' / '));
}

// 第319便a(原仮定者の指示(第121報)・決断事項 AN447・AN468・AN469・統括の検証項目 R258):
// **PHYSICS〔第319便a〕の表の行と本文の数を正本から作る純関数**(文書だけ —— 正本を作る器の meta.code に入れない: 表の書式を直しても正本の来歴は動かない)。
// QA docs.axisHeat319 が PHYSICS〔第319便a〕と逐語で照合する。逐語照合する表に丸めの程度の数を書かない(源ごとと合成の差・口座の閉じ・刻みの差は fmtFloor の床)。
import { fmtFloor, ex, fx } from './lib-w311d-planet3.mjs';
export const DOC_LIB_VERSION = 'w319a-axisheatdoc-1';
const yn = (b) => (b ? '真' : '偽');
const dec = (q) => (q ? (q.decel ? '減' : '増') : '—');
const rel = (a, b) => (b === 0 ? (a === 0 ? 0 : Infinity) : a / b);
const fr = (x) => (x === Infinity ? '—' : fmtFloor(x, 1e-12, 2));

/** 本文に書く数(QA が節の中にあることを照合する) */
export function docNumbersAxisHeat(J) {
  const F = J.F, fr16 = (i, fk, gk) => F.rows.find((r) => r.book === 'solarSystem16Inertial3d' && r.i === i && r.factor === fk && r.galaxy === gk);
  const jd = fr16(6, 'k1', 'declPlus'), jm = fr16(6, 'k1', 'declMinus'), jo = fr16(6, 'k1', 'oneMinus'), je = fr16(6, 'spinR', 'equalMinus');
  const b16 = J.books.solar16, ven = b16.rows.find((r) => r.i === 2), jup = b16.rows.find((r) => r.i === 6);
  const m16 = J.books.solar16Minus, venM = m16.rows.find((r) => r.i === 2), jupM = m16.rows.find((r) => r.i === 6);
  return [ex(F.Preq, 5), ex(F.PreqAlt, 5), ex(jd.tauReq, 3), ex(jd.tauReqAlt, 3), ex(jd.tauReqB, 3), ex(jup.eventSource, 3), ex(ven.eventSource, 3),
    fx(ven.sunGalaxy.angleDeg, 1), fx(jup.sunGalaxy.angleDeg, 1), fx(jup.galaxy.angleDeg, 1), fx(ven.galaxy.angleDeg, 1),
    ex(jm.tauReq, 3), ex(jo.eventSource, 3), ex(jo.tauReq, 3), ex(je.tauReq, 3), fx(venM.sunGalaxy.angleDeg, 1), fx(jupM.sunGalaxy.angleDeg, 1), ex(jupM.eventSource, 3)];
}

export function physicsTablesAxisHeat(J) {
  const out = [], P = J.P, Q = J.Q, A = J.A;
  // P 純関数の場面
  out.push('| 純関数の場面(I = 1・Ω_I = ẑ) | 値 |', '|---|---|');
  for (const r of P.equal) out.push(`| 等しい大きさの 2 つの角速度(${r.deg}°): abs(a + b)² − abs(a)² の符号・速さが減る | ${r.change > 0 ? '正' : r.change < 0 ? '負' : '0'}(${fmtFloor(Math.abs(r.change), 1e-12, 3)})・${yn(r.less)} |`);
  out.push(`| 大きさの比 0.1 の境界の角 arccos(−0.05) [°] | ${fx(P.ratio01.thresholdDeg, 3)}(120° では減る: ${yn(P.ratio01.at120)}) |`,
    `| 反対で同じ大きさの 2 源(±0.1 x̂): 合成の 1 回の熱・源ごとの熱・1 源の熱 | ${ex(P.opposed.compositeHeat, 4)}・${ex(P.opposed.sourceHeat, 4)}・${ex(P.opposed.oneSource, 4)} |`,
    `| 平行の駆動(+0.1 ẑ): 軸のコスト・E_speed(熱) | ${ex(P.parallel.axisCost, 3)}・${ex(P.parallel.speed, 4)} |`,
    `| 逆平行(−0.1 ẑ): 軸のコスト・熱・背景からの供給 | ${ex(P.antiParallel.axisCost, 3)}・${ex(P.antiParallel.heat, 3)}・${ex(P.antiParallel.supply, 4)} |`,
    `| 口座の閉じ(2 源): 場 + 受け皿 + 熱 | ${fmtFloor(Math.abs(P.ledger.residual), 1e-15, 2)} |`,
    `| 源の分割の感度(0.1 x̂ を 0.05 x̂ × 2 に): 熱の比 | ${fx(P.split.ratio, 4)} |`);
  // A 受理
  out.push('', '| 受理の例 | 受理 | 期待 | 正準形の compose・balance |', '|---|---|---|---|');
  for (const r of A.rows) out.push(`| ${r.key} | ${yn(r.ok)} | ${yn(r.expect)} | ${r.ok ? ['compose', 'balance'].filter((k) => r.canon[k] !== undefined).map((k) => k + ':' + r.canon[k]).join('・') || '(出さない)' : '—'} |`);
  // Q 同一
  out.push('', '| 同一(🏀 の写し) | 値 |', '|---|---|',
    `| compose の省略と "sum"・balance の省略と "none": 正準形・読み口・状態 | ${yn(Q.omit.declSame)}・${yn(Q.omit.readSame)}・${yn(Q.omit.stateSame)} |`,
    `| 合成と源ごと: 状態のビット同一・合成の 1 回の熱の総和と受け手ごと | ${yn(Q.modes.stateSame)}・${yn(Q.modes.compositeTotalSame)}・${yn(Q.modes.compositePerBodySame)} |`,
    `| 源の ω の和と姿勢へ適用した ω_D の相対の差の最大 | ${Q.modes.sumResMax === 0 ? '0' : fmtFloor(Q.modes.sumResMax, 1e-15, 2)} |`,
    `| 銀河の項の無い写し(源が 1 つ): 源ごと = 合成(受け手ごと・総和)・状態 | ${yn(Q.one.perBodySame)}・${yn(Q.one.totalSame)}・${yn(Q.one.stateSame)} |`,
    `| 釣り合いの口座の閉じ(駆動 + 場 − 放射 − E_i へ)/ 大きい方 | ${fmtFloor(Q.balance.closeRel, 1e-12, 2)} |`,
    `| 明示潮汐の内部熱の受け手(木星の写し): E_i へ入った熱 = 潮汐の maintainInput・放射 + E_i へ = 熱の総和・閉じ / 大きい方 | ${yn(Q.tide.inputSame)}・${yn(Q.tide.splitSame)}・${fmtFloor(Q.tide.closeRel, 1e-12, 2)} |`);
  // 🗺️ の受け手の表(銀河の項の向き +ĝ と −ĝ —— どちらかを採ったのではない)
  for (const bk of ['solar16', 'solar16Minus']) {
  const b16 = J.books[bk]; if (!b16) continue;
  out.push('', `| 受け手(🗺️ の写し・銀河の項 ${b16.galaxySign > 0 ? '+ĝ' : '−ĝ'}) | 役割(第121報) | abs(Ω_I) [rad/s] | abs(ω_☉) [rad/s] | ∠(Ω_I, ω_☉) [°] | 太陽の項 | ∠(Ω_I, ω_G) [°] | 銀河の項 | ∠(ω_☉, ω_G) [°] | 源ごとの 1 回の熱 [J] | (源ごと − 合成)/合成 | 背景からの供給 [J] | (b) 源ごと [J] |`,
    '|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  for (const r of b16.rows) {
    out.push(`| ${r.name} | ${r.role || '—'} | ${ex(r.Om, 3)} | ${r.sun ? ex(r.sun.mag, 3) : '—'} | ${r.sun ? fx(r.sun.angleDeg, 2) : '—'} | ${dec(r.sun)} | ${r.galaxy ? fx(r.galaxy.angleDeg, 2) : '—'} | ${dec(r.galaxy)} | ${r.sunGalaxy ? fx(r.sunGalaxy.angleDeg, 2) : '—'} | ${ex(r.eventSource, 3)} | ${fr(rel(r.eventDiff, r.eventComposite))} | ${ex(r.supplyEvent, 3)} | ${ex(r.eventSourceB, 3)} |`);
  }
  }
  const g16 = J.books.solar16;
  out.push('', `銀河の項の大きさ abs(ω_G) は全受け手で ${ex(g16.rows[0].galaxy.mag, 4)} rad/s(宣言の尺度 Ω_ref —— K1 の応答の係数 1)。「減」は E_speed < 0(abs(Ω_I + ω_s) < abs(Ω_I) —— 背景からの供給)・「増」は E_speed > 0(熱)。`);
  // 釣り合いの口座
  out.push('', '| 釣り合いの口座(写し・累計 [J]) | 背景からの駆動(供給 + 軸のコスト) | 源の場からの符号つきの分 | 背景への熱放射 | E_i へ | 閉じ / 大きい方 |', '|---|---|---|---|---|---|');
  for (const k of ['venus', 'jupiter', 'solar16', 'solar16Minus']) { const b = J.books[k]; if (!b) continue;
    out.push(`| ${b.id}・${b.galaxySign > 0 ? '+ĝ' : '−ĝ'}(${b.steps + 1} 步) | ${ex(b.balance.drive, 4)} | ${ex(b.balance.fromField, 4)} | ${ex(b.balance.radiation, 4)} | ${ex(b.balance.toInternal, 3)} | ${fmtFloor(b.balance.closeRel, 1e-12, 2)} |`); }
  // F 木星
  out.push('', `| 木星(🗺️ の写し)の 1 回の量 | 銀河の項 | abs(ω_☉) [rad/s] | abs(ω_G) [rad/s] | 源ごと [J] | (源ごと − 合成)/合成 | 主列に要る τ_hold [s] | 代替の列に要る τ_hold [s] | (b) 主列に要る τ_hold [s] | (b) τ_hold = h₀ の電力 / 主列 |`,
    '|---|---|---|---|---|---|---|---|---|---|');
  for (const r of J.F.rows.filter((q) => q.book === 'solarSystem16Inertial3d' && q.i === 6)) {
    out.push(`| ${r.factorJa}(× ${ex(r.k, 3)}) | ${r.galaxyJa} | ${ex(r.sunMag, 3)} | ${r.galMag === 0 ? '0' : ex(r.galMag, 3)} | ${ex(r.eventSource, 3)} | ${fr(rel(r.eventDiff, r.eventComposite))} | ${ex(r.tauReq, 3)} | ${ex(r.tauReqAlt, 3)} | ${ex(r.tauReqB, 3)} | ${ex(r.ratioBAtH0, 3)} |`);
  }
  // F 金星
  out.push('', `| 金星(🗺️ の写し)の 1 回の量 | 銀河の項 | abs(ω_☉) [rad/s] | 源ごと [J] | (源ごと − 合成)/合成 | (b) 源ごと [J] |`, '|---|---|---|---|---|---|');
  for (const r of J.F.rows.filter((q) => q.book === 'solarSystem16Inertial3d' && q.i === 2)) {
    out.push(`| ${r.factorJa}(× ${ex(r.k, 3)}) | ${r.galaxyJa} | ${ex(r.sunMag, 3)} | ${ex(r.eventSource, 3)} | ${fr(rel(r.eventDiff, r.eventComposite))} | ${ex(r.eventSourceB, 3)} |`);
  }
  // TS
  out.push('', '| 刻みの感度(🏀 の写し・同じ時間) | 値 |', '|---|---|',
    `| {tauHold}: h と h/2 の熱の相対の差 | ${fmtFloor(J.TS.tauHold.rel, 1e-12, 2)} |`, `| "step": h/2 の熱 / h の熱 | ${fx(J.TS.step.ratio, 4)} |`);
  return out;
}

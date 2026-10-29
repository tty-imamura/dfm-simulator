// 第318便c(原仮定者の指示(第120報)・統括の検証項目 R256): **PHYSICS〔第318便c〕の表の行と観測結果カードの数を正本から作る純関数**
// (文書だけ —— 正本を作る器の meta.code に入れない: 表の書式を直しても正本の来歴は動かない)。QA docs.solar16Builtin318c が PHYSICS〔第318便c〕と逐語で照合し、
// 内蔵の本 🗺️ solarSystem16Inertial3d の観測結果カード(ja/en)に obsNumbers の数があるかを見る。
// 逐語照合する表に丸めの程度の数を書かない(K1 − 1PN の差のうち刻みの列で揺れる桁 —— 外惑星の 10⁻³ km 未満 —— は丸めの床 fmtFloor)。
import * as Q from './lib-w311d-planet3.mjs';
import * as L from './lib-w318c-solar16.mjs';
export const DOC_LIB_VERSION = 'w318c-solar16doc-1';

const { ex, fx } = Q;
const fl = (x, floor, d = 2) => Q.fmtFloor(x, floor, d);
const yn = (x) => (x === true ? '真' : (x === false ? '偽' : '—'));
const p3 = (x) => (x === null || x === undefined || !Number.isFinite(x)) ? '—' : Number(x).toPrecision(3);
const ja = (k) => (L.MEMBERS.find((m) => m.key === k) || { ja: k }).ja;
/** 上へ丸めた 2 桁(「以内」の上限の数 —— 例 1.044e-3 → 1.1e-3) */
export function up2e(x) { const e = Math.floor(Math.log10(Math.abs(x))), m = Math.ceil(Math.abs(x) / Math.pow(10, e - 1)) / 10; return (m >= 10 ? (m / 10).toFixed(1) + 'e' + (e + 1) : m.toFixed(1) + 'e' + e); }
const up2f = (x) => (Math.ceil(x * 100) / 100).toFixed(2);
/** 差の表で示す天体(衛星は母惑星に対する相対の位置)—— 外惑星の差は刻みの列で揺れる丸めの桁なので表に出さない(最大の列には入る) */
export const DIFF_SHOW = Object.freeze(['mercury', 'venus', 'earth', 'moon', 'io', 'europa', 'titan', 'triton']);
const dOf = (rows, k) => { const r = rows.find((z) => z.key === k); return r ? (r.relKm !== null ? r.relKm : r.posKm) : null; };

/** 観測結果カード(ja/en)に書く正本の数(QA が文字列で照合) */
export function obsNumbers(J) {
  const t = J.check.tables, s1440 = J.step.find((z) => z.phys === 'k1' && z.spo === 1440), s360 = J.step.find((z) => z.phys === 'k1' && z.spo === 360);
  const d1440 = J.diff.io.rows.find((r) => r.n === 1440), fio = J.floor.find((r) => r.key === 'io'), ftr = J.floor.find((r) => r.key === 'triton');
  const out = [ex(t.com.comKm, 1), up2e(Math.max(...t.masses.map((r) => Math.abs(r.rel)))), up2f(Math.max(...t.sats.map((r) => r.hillFrac))),
    fx(s1440.ioRelKm.h_h4, 1) + ' km', fx(s360.ioRelKm.h_h4, 0) + ' km', fx(s1440.order, 2),
    p3(dOf(d1440.perBody, 'io')) + ' km', p3(dOf(d1440.perBody, 'mercury')) + ' km',
    ex(ftr.ulpOverA, 1), String(ftr.ratioSsbOverPc), ex(fio.ulpOverA, 1), String(fio.ratioSsbOverPc)];
  const y = J.diff.year && J.diff.year[1440];
  if (y && y.points.length) { const last = y.points[y.points.length - 1]; out.push(p3(dOf(last.perBody, 'mercury')) + ' km', p3(dOf(last.perBody, 'io')) + ' km'); }
  return out;
}

/** PHYSICS〔第318便c〕の表(正本から —— 行は QA が逐語で照合) */
export function physicsTablesSolar16(J) {
  const out = [], t = J.check.tables;
  // ① 質量と G_0 m
  out.push('| 天体 | 質量 [kg](本の m × 10²⁸) | G_0 m [km³/s²] | 比べた在位の本の同じ天体 | 相対の差 |', '|---|---|---|---|---|');
  for (const r of t.masses) out.push(`| ${r.ja} | ${ex(r.kg, 6)} | ${p3(r.gmKm3s2 / 1e3)}e3 | ${r.ref} | ${ex(r.rel, 2)} |`);
  // ② 接触の軌道要素と参照
  out.push('', '| 天体(中心) | a | e | i(黄道)[°] | i_eq(母惑星の赤道)[°] | 参照 | a の相対の差 | e の差 | i の差 [°] |', '|---|---|---|---|---|---|---|---|---|');
  for (const r of t.elements) {
    const a = r.center === 'sun' ? fx(r.aAu, 6) + ' au' : fx(r.aKm, 0) + ' km', c = r.center === 'sun' ? '太陽' : ja(r.center);
    r.refs.forEach((f, i) => out.push(`| ${i === 0 ? r.ja + '(' + c + ')' : ''} | ${i === 0 ? a : ''} | ${i === 0 ? fx(r.e, 6) : ''} | ${i === 0 ? fx(r.iDeg, 4) : ''} | ${i === 0 && r.iEqDeg !== undefined ? fx(r.iEqDeg, 4) : ''} | ${f.src.replace(/\|/g, '/')} | ${ex(f.aRel, 2)} | ${ex(f.eDiff, 2)} | ${f.iDiff === null ? '—' : fx(f.iDiff, 4)} |`));
  }
  // ③ 衛星の Hill
  out.push('', '| 衛星 | 母惑星 | 距離 [km] | 母惑星の Hill 半径 [km] | 比 | 束縛 |', '|---|---|---|---|---|---|');
  for (const r of t.sats) out.push(`| ${r.ja} | ${ja(r.parent)} | ${ex(r.rKm, 4)} | ${ex(r.hillKm, 4)} | ${fx(r.hillFrac, 4)} | ${yn(r.energy < 0)} |`);
  // ④ 自転軸と符号
  out.push('', '| 天体 | 傾き [°] | 方位 [°] | 自転 [1/本の時間] | 周期 [h] | 自転のベクトルと黄道の北の角 [°] | 公転の極との角 [°] | 符号 | source の極との差 [°] | 在位の本の軸との差 [°] | 在位の本の自転との相対の差 |',
    '|---|---|---|---|---|---|---|---|---|---|---|');
  for (const r of t.spin) out.push(`| ${r.ja} | ${fx(r.tiltDeg, 4)} | ${fx(r.azimuthDeg, 4)} | ${p3(r.spin)} | ${fx(r.periodH, 3)} | ${fx(r.eclDeg, 3)} | ${fx(r.obliquityDeg, 3)} | ${r.retro ? '逆行(負)' : '順行(正)'}・${yn(r.signOk)} | ${r.poleSrc ? fl(r.poleSrc.diffDeg, 1e-6) : '—'} | ${r.axisBook ? ex(r.axisBook.diffDeg, 2) : '—'} | ${r.spinBook ? ex(r.spinBook.rel, 2) : '—'} |`);
  // ⑤ 刻みの検査
  out.push('', '| 物理 | 刻み(イオ 1 公転の步数) | dt [本の時間] | 終わりの位置の差の最大 h − h/4 [km] | h/2 − h/4 [km] | イオの相対の位置 h − h/4 [km] | 比 (h − h/4)/(h/2 − h/4) |', '|---|---|---|---|---|---|---|');
  for (const z of J.step) out.push(`| ${z.phys === 'k1' ? 'K1(内蔵の本)' : '1PN の対照(器の写し)'} | ${z.spo} | ${ex(z.dt, 6)} | ${p3(z.maxKm.h_h4)} | ${p3(z.maxKm.h2_h4)} | ${p3(z.ioRelKm.h_h4)} | ${fx(z.order, 3)} |`);
  out.push('', '| 刻み(イオ 1 公転の步数) | イオの h − h/4 / イオの長半径 | 地球 1 年の步数 | 公称 120 步/秒のイオ 1 公転 [s] | 公称の地球 1 年 [分] |', '|---|---|---|---|---|');
  for (const r of J.choice.rows) out.push(`| ${r.spo}${r.spo === J.choice.chosen ? '(選んだ —— 入力の値)' : ''} | ${ex(r.ioRelOverA, 2)} | ${r.stepsPerYear} | ${fx(r.secPerIoNominal, 0)} | ${fx(r.minPerYearNominal, 0)} |`);
  // ⑥ K1 − 1PN(イオ 1 公転)
  out.push('', '| イオ 1 公転の刻み(步数) | ' + DIFF_SHOW.map((k) => ja(k) + (L.MEMBERS.find((m) => m.key === k).parent ? '(相対)' : '')).join(' | ') + ' | 最大 [km] |', '|---' + '|---'.repeat(DIFF_SHOW.length + 1) + '|');
  for (const r of J.diff.io.rows) out.push(`| ${r.n} | ${DIFF_SHOW.map((k) => p3(dOf(r.perBody, k))).join(' | ')} | ${p3(r.maxKm)} |`);
  // ⑦ K1 − 1PN(地球 1 年の窓 —— P/1440 と P/360)
  if (J.diff.year && J.diff.year.h) {
    out.push('', '| 経過 [日] | ' + DIFF_SHOW.map((k) => ja(k) + ' P/1440・P/360').join(' | ') + ' |', '|---' + '|---'.repeat(DIFF_SHOW.length) + '|');
    for (const p of J.diff.year.h) out.push(`| ${fx(p.days, 2)} | ${DIFF_SHOW.map((k) => { const r = p.perBody.find((z) => z.key === k), a = r.rel1440 !== null ? r.rel1440 : r.d1440, b = r.rel360 !== null ? r.rel360 : r.d360; return p3(a) + '・' + p3(b); }).join(' | ')} |`);
  }
  // ⑧ 衛星の丸めの床
  out.push('', '| 衛星(母惑星) | SSB からの距離 [本の単位] | 座標の 1 ulp [m] | a [km] | e(接触) | 1 ulp / a | 1 ulp / 1 步の相対の変位 | 1 ulp / (a e) [rad] | 1 公転ごとに同じ向きに積んだ型 [″/世紀] | 母惑星中心の座標の床との比 |',
    '|---|---|---|---|---|---|---|---|---|---|');
  for (const r of J.floor) out.push(`| ${r.ja}(${ja(r.parent)}) | ${fx(r.ssbUnits, 1)} | ${ex(r.ulpM, 2)} | ${fx(r.aKm, 0)} | ${ex(r.e, 3)} | ${ex(r.ulpOverA, 2)} | ${ex(r.ulpOverStep, 2)} | ${ex(r.angERad, 2)} | ${ex(r.linCenturyAs, 2)} | ${r.ratioSsbOverPc} |`);
  // ⑨ 視点
  out.push('', '| 画面(幅 × 高さ) | 半幅・半高さ [本の単位] | ' + L.TILTS.map((d) => '傾き ' + d + '°').join(' | ') + ' |', '|---|---' + '|---'.repeat(L.TILTS.length) + '|');
  for (const v of J.view) out.push(`| ${v.view}(${v.w} × ${v.h}) | ${fx(v.halfW, 0)}・${fx(v.halfH, 0)} | ${v.tilts.map((z) => (z.out.length ? '外: ' + z.out.map(ja).join('・') : '全部の内')).join(' | ')} |`);
  return out.join('\n');
}

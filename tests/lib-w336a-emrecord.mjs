// 第336便a(原仮定者の指示(2026-11-12 —— 第137報)「地球と月の 2 体だけでも、引きずりがあれば月の近点移動周期を 8.85 年にフィット出来る。ただし恒久ではない」
//   「geoPN=2 の earthMoonRealKF1 を残した意図は、その記録を残す事 ——『初速を観測の値に戻し』が余計なので記録に戻す」・統括の検証項目 R335):
//   **🌘 の記録の窓の表の lib**(純関数 + 1 走行 —— 器 tests/exp-w336a-emrecord.mjs が呼ぶ)。
//
// ■ 何をするか
//   ・runWindows: 本の写しを build して月の同方向公転で revMax 周まで走らせ、**最初の W 公転**の窓ごとに
//       近点回転の周期(検出器 B —— 相対距離の極小・3 点の放物線の頂点・近点方位の時刻への直線 fit → 360°/ϖ̇〔ユリウス年〕)と、
//       公転ごとの離心率の代理 e_k = (r_max − r_min)/(r_max + r_min)(k 周目の同方向公転の通過の間の距離の極値)の最小〜最大を返す。
//     公転の数え方・検出器 B・直線 fit は tests/lib-w280b-emgrid.mjs の runRow と同じ式・同じ順序(fitPeri はその lib の関数をそのまま呼ぶ)。
//     runRow は窓ごとの e を「窓全体の極値」でしか返さないので、公転ごとの極値を足すためだけにループを写した(式は変えない)。
//   ・steadyJudge: 宣言の物差し(窓の周期と 8 公転窓の周期の相対差が帯の外なら「定常ではない」)で表を読む。
//   **エンジン・本・受理器は変えない**(器は本の宣言を読むだけ —— 写しの kFrame=0 の対照は器の中だけ)。
import { fitPeri, YEAR_UNITS_EM, DAY_UNITS_EM } from './lib-w280b-emgrid.mjs';

export const LIB_VERSION = 'w336a-emrecord-1';

/**
 * 1 走行(窓の表)。preset は検証前の写し。windows は昇順の公転数。
 * 戻り: { steps, revN, sidMeanDays(最初の revMax 周の通過の平均間隔), rows:[{orbits, complete, apsPeriodYr, slopeDegPerPeri, nPeri, eMin, eMax, eProxy}], perOrbitE:[...] }
 */
export function runWindows(HP, preset, o) {
  const { ci = 0, oi = 1, dt, windows, maxSteps = 4e8, yearUnits = YEAR_UNITS_EM, dayUnits = DAY_UNITS_EM } = o;
  const revMax = Math.max(...windows);
  const v = HP.validatePreset(JSON.parse(JSON.stringify(preset)));
  if (!v.ok) return { ok: false, err: 'validatePreset: ' + JSON.stringify(v.errors).slice(0, 200) };
  HP.sim.build(v.preset);
  const S = HP.sim;
  const rel = () => { const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci]; return [dx, dy, Math.hypot(dx, dy), Math.atan2(dy, dx)]; };
  const [, , r0, th0] = rel();
  const dvx0 = S.vx[oi] - S.vx[ci], dvy0 = S.vy[oi] - S.vy[ci];
  const mu = S.params.G * (S.m[ci] + S.m[oi]), v2 = dvx0 * dvx0 + dvy0 * dvy0;
  const a0 = 1 / (2 / r0 - v2 / mu), P0 = 2 * Math.PI * Math.sqrt(a0 * a0 * a0 / mu);
  let angPrev = th0, angAcc = 0, r1 = r0, r2 = r0, th1 = th0, th2 = th0;
  const B = [], rev = [];
  const rMinW = windows.map(() => Infinity), rMaxW = windows.map(() => -Infinity);
  // 公転ごとの極値(k 周目 = k−1 回目と k 回目の通過の間 —— 1 周目は t=0 から最初の通過まで)
  const segMin = [], segMax = [];
  let curMin = r0, curMax = r0, k = 0, nan = false;
  for (; k < maxSteps; k++) {
    S.step(dt);
    const [, , rr, th] = rel();
    if (!Number.isFinite(rr)) { nan = true; break; }
    for (let w = 0; w < windows.length; w++) if (rev.length < windows[w]) { if (rr < rMinW[w]) rMinW[w] = rr; if (rr > rMaxW[w]) rMaxW[w] = rr; }
    if (rr < curMin) curMin = rr; if (rr > curMax) curMax = rr;
    let d = th - angPrev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    const prevAcc = angAcc; angAcc += d; angPrev = th;
    const nP = Math.floor(Math.abs(prevAcc) / (2 * Math.PI)), nN = Math.floor(Math.abs(angAcc) / (2 * Math.PI));
    if (nN > nP) {
      const tg = Math.sign(angAcc) * nN * 2 * Math.PI; const fr = (tg - prevAcc) / (angAcc - prevAcc); rev.push((k - 1 + fr + 1) * dt);
      segMin.push(curMin); segMax.push(curMax); curMin = rr; curMax = rr;
    }
    if (k >= 2 && r1 < r2 && r1 < rr) {
      const dd = (r2 - 2 * r1 + rr), fr = (dd !== 0) ? 0.5 * (r2 - rr) / dd : 0;
      let a1 = th2, a2 = th1, a3 = th;
      while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI; while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
      while (a3 - a2 > Math.PI) a3 -= 2 * Math.PI; while (a3 - a2 < -Math.PI) a3 += 2 * Math.PI;
      B.push({ ang: a2 + 0.5 * fr * (a3 - a1) + 0.5 * fr * fr * (a3 - 2 * a2 + a1), k: k + fr, r: r1 });
    }
    r2 = r1; r1 = rr; th2 = th1; th1 = th;
    if (rev.length >= revMax) { k++; break; }
  }
  const perOrbitE = segMin.map((mn, i) => (segMax[i] - mn) / (segMax[i] + mn));
  const rows = windows.map((W, wi) => {
    if (rev.length < W) return { orbits: W, complete: false };
    const tCut = rev[W - 1];
    const fb = fitPeri(B.filter((p) => p.k * dt <= tCut), rMinW[wi], rMaxW[wi], P0, dt);
    const es = perOrbitE.slice(0, W);
    return { orbits: W, complete: true, tCutDays: tCut / dayUnits,
      apsPeriodYr: fb.slopeDegPerTime ? 360 / fb.slopeDegPerTime / yearUnits : null, slopeDegPerPeri: fb.slopeDegPerPeri, nPeri: fb.nPeri, residRmsDeg: fb.residRmsDeg,
      eMin: Math.min(...es), eMax: Math.max(...es), eProxy: (rMaxW[wi] - rMinW[wi]) / (rMaxW[wi] + rMinW[wi]) };
  });
  return { ok: true, dt, steps: k, revN: rev.length, nan: nan || S.hasNaN(), osc0: { r: r0, a: a0, P: P0 },
    sidMeanDays: rev.length >= 2 ? (rev[rev.length - 1] - rev[0]) / (rev.length - 1) / dayUnits : null, rows, perOrbitE };
}

/**
 * 宣言の物差しで表を読む(純関数)。ref = 8 公転窓の行。band = 相対の帯(宣言)。
 * 窓 W の周期の 8 公転窓からの相対差 |P_W/P_8 − 1| が帯を超えれば「定常ではない」。e の幅は最小〜最大の比で並べる(判定は周期だけ)。
 */
export function steadyJudge(rows, band) {
  const ref = rows.find((r) => r.orbits === 8 && r.complete);
  if (!ref || !Number.isFinite(ref.apsPeriodYr)) return { ok: false, why: '8 公転窓の行が無い' };
  const cmp = rows.filter((r) => r.complete && r.orbits !== 8).map((r) => {
    const relDiff = r.apsPeriodYr / ref.apsPeriodYr - 1;
    return { orbits: r.orbits, apsPeriodYr: r.apsPeriodYr, relTo8: relDiff, outside: Math.abs(relDiff) > band, eMin: r.eMin, eMax: r.eMax };
  });
  const monotone = cmp.every((c, i) => i === 0 || c.apsPeriodYr > cmp[i - 1].apsPeriodYr) && (cmp.length === 0 || cmp[0].apsPeriodYr > ref.apsPeriodYr);
  return { ok: true, band, ref8: ref.apsPeriodYr, rows: cmp, steady: cmp.every((c) => !c.outside), monotoneLonger: monotone,
    nOutside: cmp.filter((c) => c.outside).length };
}

/** 2 つの刻みの表の差(窓ごとの周期の相対差 —— 刻みの依存)。 */
export function dtDependence(rowsH, rowsHalf) {
  return rowsH.filter((r) => r.complete).map((r) => {
    const q = rowsHalf.find((z) => z.orbits === r.orbits && z.complete);
    return { orbits: r.orbits, h: r.apsPeriodYr, half: q ? q.apsPeriodYr : null, rel: q ? q.apsPeriodYr / r.apsPeriodYr - 1 : null,
      eMaxH: r.eMax, eMaxHalf: q ? q.eMax : null };
  });
}

/** 自己試験(純関数の部分 —— 窓の判定の物差し)。 */
export function selfTest() {
  const rows = [{ orbits: 8, complete: true, apsPeriodYr: 8.85, eMin: 0.05, eMax: 0.06 }, { orbits: 20, complete: true, apsPeriodYr: 10, eMin: 0.05, eMax: 0.07 },
    { orbits: 27, complete: true, apsPeriodYr: 8.86, eMin: 0.05, eMax: 0.06 }];
  const j = steadyJudge(rows, 0.01);
  const ok = j.ok && j.rows.length === 2 && j.rows[0].outside === true && j.rows[1].outside === false && j.steady === false && j.monotoneLonger === false;
  const d = dtDependence(rows, rows);
  return { ok: ok && d.every((z) => z.rel === 0), judge: j };
}

/**
 * 文書の表(PHYSICS〔第336便a〕に逐語で載せる —— QA docs.emRecord336a が正本から作り直して照らす)。J = 正本。
 */
export function docTables(J) {
  const R = J.remeasure, T = J.table, d = J.decl;
  const same = (v) => (v.sameBits ? 'ビット同一' : '恒星月 ' + v.sidMeanDays + ' 日・近点 ' + v.apsPeriodYr + ' 年');
  const t1 = ['| 刻み | 恒星月(日) | 近点回転の周期(年) | 記録との差 |', '|---|---|---|---|',
    '| h = ' + R.h.dt + ' | ' + R.h.sidMeanDays + ' | ' + R.h.apsPeriodYr + ' | ' + same(R.vsRecord.h) + ' |',
    '| h/2 = ' + R.half.dt + ' | ' + R.half.sidMeanDays + ' | ' + R.half.apsPeriodYr + ' | ' + same(R.vsRecord.half) + ' |'].join('\n');
  const st = T.steady, rowOf = (rows, W) => rows.find((z) => z.orbits === W) || {};
  const pct = (x) => (x >= 0 ? '+' : '−') + Math.abs(x * 100).toFixed(2) + '%';
  const t2 = ['| 窓(最初の W 公転) | 周期 刻み ' + d.dtTable.h + '(年) | 周期 刻み ' + d.dtTable.half + '(年) | 8 公転窓との差(刻み ' + d.dtTable.h + ') | 離心率の代理 最小〜最大(刻み ' + d.dtTable.h + ') |', '|---|---|---|---|---|']
    .concat(d.windows.map((W) => {
      const a = rowOf(T.h.rows, W), b = rowOf(T.half.rows, W), c = W === 8 ? null : (st.rows.find((z) => z.orbits === W) || {});
      return '| ' + W + ' | ' + a.apsPeriodYr.toFixed(4) + ' | ' + b.apsPeriodYr.toFixed(4) + ' | ' + (c ? pct(c.relTo8) : '—') + ' | ' + a.eMin.toFixed(4) + '〜' + a.eMax.toFixed(4) + ' |';
    })).join('\n');
  const k0 = rowOf(T.k0.rows, 118);
  const t3 = 'kFrame=0 の写し(刻み ' + d.control.dt + '): 118 公転窓の近点の傾き ' + k0.slopeDegPerPeri.toExponential(2) + ' °/近点・離心率の代理 ' + k0.eMin.toFixed(5) + '〜' + k0.eMax.toFixed(5);
  const g = J.fitRecord.gate, fr = J.fitRecord.fitRecord;
  const t4 = '恒星月: 残差 ' + g[0].residual.toFixed(3) + ' 秒 + h/2 差 ' + g[0].h2.toFixed(3) + ' 秒 ≤ 許容 ' + g[0].tol + ' 秒・近点回転: 残差 ' + g[1].residual.toExponential(3) + ' 年 + h/2 差 '
    + g[1].h2.toExponential(3) + ' 年 ≤ 許容 ' + g[1].tol + ' 年 → status ' + fr.status + '・cond.sig ' + fr.cond.sig;
  const t5 = '定常の物差し(相対 ' + (d.steadyBand * 100) + '%): 帯の外 ' + st.nOutside + '/' + st.rows.length + ' 窓・窓を延ばすと周期は単調に延びる ' + (st.monotoneLonger ? '真' : '偽') + ' → 定常 ' + (st.steady ? '真' : '偽');
  return { remeasure: t1, windows: t2, control: t3, gate: t4, steady: t5 };
}

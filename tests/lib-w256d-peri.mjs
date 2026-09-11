// 第256便d(第48報): **近点検出器の合成軌道検定ライブラリ**(純 Node・ブラウザ不要)。
//
// ChatGPT O5.2 の指摘「検出器 A/B の差は定義差とは限らない」への器である。
// **解析ケプラー軌道に既知の歳差 ω̇ を与えた合成軌道**(真値が閉じた式で分かる)を密出力し、
// 第252便b/第254便d/第255便d と**同一手続き**の検出器 A/B・柵・直線 fit にかける。
// 真値が分かっているので、出てくる差は
//   ・**推定器の誤差**(離散サンプルから近点の時刻と方向を復元するときの誤差)
// だけである —— 定義の差でも積分誤差でもない。したがって、
//   「合成軌道で A/B が一致するのに、シミュレータの軌道で A/B が割れる」のなら、
//   その割れは**軌道側**(積分誤差・引きずり場の床・非ケプラー性)から来ている、
//   と切り分けられる。**これは否定の道具である**(A/B 差を「定義差」と呼べなくする)。
//
// 真値の定め方(閉じた式):
//   真近点離角 ν(t) をケプラー方程式から厳密に解き、近点引数を ω(t)=ω0+ω̇·t とする。
//   位置角 θ(t)=ν(t)+ω(t)、動径 r(t)=a(1−e²)/(1+e cos ν)。近点通過は ν=0 mod 2π で起きるので
//   **近点間周期は厳密に P_kep**、**1 近点間の近点方向の前進は厳密に ω̇·P_kep** である。
//   (ω̇ は軌道面内の遅い歳差 —— 動径運動には効かせない「純粋な向きの回転」として与える。
//    本器が測るのは検出器の推定誤差であって、歳差の力学的起源ではない。)
//
// 使い方: import { synthOrbit, detect, fitPeri } from './lib-w256d-peri.mjs';
export const DEG = 180 / Math.PI;

// ---------------------------------------------------------------- ケプラー方程式(離心近点離角)
export function eccAnomaly(M, e) {
  let E = (e < 0.8) ? M : Math.PI;
  for (let i = 0; i < 80; i++) {
    const f = E - e * Math.sin(E) - M, fp = 1 - e * Math.cos(E);
    const d = f / fp;
    E -= d;
    if (Math.abs(d) < 1e-15) break;
  }
  return E;
}

// ---------------------------------------------------------------- 合成軌道(密出力)
// 返すのは検出器がシミュレータから受け取るのと同じ 4 本の時系列(相対座標と相対速度)。
// 速度も**解析値**で与える(積分誤差を 0 にするため — それが本器の目的)。
// 診断用の 2 つの汚し(**既定は 0 = 汚さない**):
//   vLagFrac … 速度だけを t+lag·dt の値にする(蛙跳び等の**食い違い時刻**の模擬)。
//   posNoise … 位置に相対振幅 ε の決定論的な擬似乱数を足す(**引きずり場の床**等の模擬)。
//   posQuantF32 … 位置を Float32 へ丸める(第246便 D2 の床の直接模擬)。
function lcg(seed) { let s = (seed >>> 0) || 1; return () => { s = (1664525 * s + 1013904223) >>> 0; return s / 4294967296 - 0.5; }; }

export function synthOrbit({ a, e, P, omegaDotDegPerTime = 0, omega0 = 0, dt, steps,
  vLagFrac = 0, posNoise = 0, posQuantF32 = false, seed = 12345 }) {
  const n = 2 * Math.PI / P;                 // 平均運動
  const wd = omegaDotDegPerTime / DEG;       // rad / 時間単位
  const rnd = lcg(seed);
  const out = { x: new Float64Array(steps), y: new Float64Array(steps),
    vx: new Float64Array(steps), vy: new Float64Array(steps), t: new Float64Array(steps),
    a, e, P, dt, steps, omegaDot: omegaDotDegPerTime, omega0, vLagFrac, posNoise, posQuantF32,
    trueAdvDegPerOrbit: omegaDotDegPerTime * P, truePeriod: P };
  const state = (t) => {
    const M = n * t;
    const E = eccAnomaly(M - 2 * Math.PI * Math.floor(M / (2 * Math.PI)), e);
    const cosE = Math.cos(E), sinE = Math.sin(E);
    const r = a * (1 - e * cosE);
    const nu = Math.atan2(Math.sqrt(1 - e * e) * sinE, cosE - e);
    const w = omega0 + wd * t;
    const th = nu + w;
    const Edot = n / (1 - e * cosE);
    const rdot = a * e * sinE * Edot;
    const nudot = Math.sqrt(1 - e * e) * Edot / (1 - e * cosE);
    const thdot = nudot + wd;
    return { x: r * Math.cos(th), y: r * Math.sin(th),
      vx: rdot * Math.cos(th) - r * thdot * Math.sin(th),
      vy: rdot * Math.sin(th) + r * thdot * Math.cos(th) };
  };
  for (let k = 0; k < steps; k++) {
    const t = (k + 1) * dt;                  // シミュレータ側は step 後に測るので +1 を揃える
    const s0 = state(t);
    const sv = (vLagFrac === 0) ? s0 : state(t + vLagFrac * dt);
    let px = s0.x, py = s0.y;
    if (posNoise > 0) { px += a * posNoise * rnd(); py += a * posNoise * rnd(); }
    if (posQuantF32) { px = Math.fround(px); py = Math.fround(py); }
    out.t[k] = t; out.x[k] = px; out.y[k] = py; out.vx[k] = sv.vx; out.vy[k] = sv.vy;
  }
  return out;
}

// ---------------------------------------------------------------- 検出器 A/B(第255便d と同一手続き)
// A: ṙ の −→+ 交差(線形内挿) / B: 距離極小の放物線頂点。角度の内挿式も同じものを使う。
export function detect(o) {
  const A = [], Bd = [], sid = [];
  let r2 = 0, r1 = 0, t2 = 0, t1 = 0, rd1 = 0, rMin = Infinity, rMax = -Infinity;
  let acc = 0, accPrev = 0, thPrev = null, nTurn = 0;
  const dt = o.dt;
  for (let k = 0; k < o.steps; k++) {
    const dx = o.x[k], dy = o.y[k];
    const rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
    const rd = (dx * o.vx[k] + dy * o.vy[k]) / rr;
    if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr;
    if (thPrev !== null) {
      let d = th - thPrev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
      accPrev = acc; acc += d;
      while (Math.abs(acc) >= (nTurn + 1) * 2 * Math.PI) {
        const tgt = Math.sign(acc) * (nTurn + 1) * 2 * Math.PI;
        const fr = (acc !== accPrev) ? (tgt - accPrev) / (acc - accPrev) : 0;
        sid.push((k - 1 + fr) * dt); nTurn++;
      }
    }
    thPrev = th;
    if (k >= 1 && rd1 < 0 && rd >= 0) {
      const fr = (rd !== rd1) ? (-rd1 / (rd - rd1)) : 0;
      let a1 = t1, a2 = th; while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI; while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
      A.push({ ang: a1 + fr * (a2 - a1), k: k - 1 + fr, r: rr });
    }
    if (k >= 2 && r1 < r2 && r1 < rr) {
      const dd = (r2 - 2 * r1 + rr), fr = (dd !== 0) ? 0.5 * (r2 - rr) / dd : 0;
      let a1 = t2, a2 = t1, a3 = th;
      while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI; while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
      while (a3 - a2 > Math.PI) a3 -= 2 * Math.PI; while (a3 - a2 < -Math.PI) a3 += 2 * Math.PI;
      Bd.push({ ang: a2 + 0.5 * fr * (a3 - a1) + 0.5 * fr * fr * (a3 - 2 * a2 + a1), k: k - 1 + fr, r: r1 });
    }
    r2 = r1; r1 = rr; t2 = t1; t1 = th; rd1 = rd;
  }
  const sidMean = sid.length > 1 ? (sid[sid.length - 1] - sid[0]) / (sid.length - 1) : null;
  return { A, B: Bd, rMin, rMax, sidMean, sidN: sid.length };
}

// ---------------------------------------------------------------- 柵つき直線 fit(第255便d と同一)
export function fitPeri(raw, rMin, rMax, pRef, dt, nWin) {
  const mid = 0.5 * (rMin + rMax);
  const peri = raw.filter((p) => p.r < mid);
  const rej = { apo: raw.length - peri.length, dup: 0, jump: 0 };
  const keep = [];
  for (const p of peri) {
    if (keep.length && (p.k - keep[keep.length - 1].k) * dt < 0.5 * pRef) { rej.dup++; continue; }
    keep.push(p);
  }
  const found = keep.length;
  const base = { cand: peri.length, found, rej };
  if (found < nWin) return Object.assign(base, { nPeri: found, unmeasured: true, slopeDeg: null, residDeg: null, perMean: null });
  const use = keep.slice(0, nWin), ang = [];
  for (let i = 0; i < use.length; i++) {
    let a = use[i].ang;
    if (i) { let z = a - ang[i - 1]; while (z > Math.PI) z -= 2 * Math.PI; while (z < -Math.PI) z += 2 * Math.PI;
      if (Math.abs(z) > Math.PI / 2) { rej.jump++; break; }
      a = ang[i - 1] + z; }
    ang.push(a);
  }
  const n = ang.length;
  if (n < nWin) return Object.assign(base, { nPeri: n, unmeasured: true, slopeDeg: null, residDeg: null, perMean: null });
  const mx = (n - 1) / 2, my = ang.reduce((x, y) => x + y, 0) / n;
  let sxy = 0, sxx = 0;
  for (let i = 0; i < n; i++) { sxy += (i - mx) * (ang[i] - my); sxx += (i - mx) * (i - mx); }
  const slope = sxy / sxx;
  const resid = Math.sqrt(ang.reduce((s, x, i) => s + (x - (my + slope * (i - mx))) ** 2, 0) / n);
  return Object.assign(base, { nPeri: n, unmeasured: false, slopeDeg: slope * DEG, residDeg: resid * DEG,
    perMean: (use[nWin - 1].k - use[0].k) * dt / (nWin - 1), perN: nWin - 1 });
}

// ---------------------------------------------------------------- 1 ケース = 合成 → 検出 → fit → 誤差
export function runCase({ a, e, P, omegaDotDegPerTime, omega0 = 0, dt, orbits = 21.5, nWin = 20,
  vLagFrac = 0, posNoise = 0, posQuantF32 = false, seed = 12345 }) {
  const steps = Math.round(orbits * P / dt);
  const o = synthOrbit({ a, e, P, omegaDotDegPerTime, omega0, dt, steps, vLagFrac, posNoise, posQuantF32, seed });
  const d = detect(o);
  const pUse = (d.sidMean > 0) ? d.sidMean : P;
  const fa = fitPeri(d.A, d.rMin, d.rMax, pUse, dt, nWin);
  const fb = fitPeri(d.B, d.rMin, d.rMax, pUse, dt, nWin);
  const trueAdv = o.trueAdvDegPerOrbit, trueP = o.truePeriod;
  const errOf = (f) => (f.slopeDeg === null) ? null : {
    advDeg: f.slopeDeg, advErrDeg: f.slopeDeg - trueAdv,
    advErrRel: trueAdv !== 0 ? (f.slopeDeg / trueAdv - 1) : null,
    perMean: f.perMean, perErr: f.perMean - trueP, perErrRel: f.perMean / trueP - 1,
    residFitDeg: f.residDeg, cand: f.cand, found: f.found, dup: f.rej.dup, jump: f.rej.jump };
  const ea = errOf(fa), eb = errOf(fb);
  return { a, e, P, dt, orbits, nWin, steps, vLagFrac, posNoise, posQuantF32,
    trueAdvDegPerOrbit: trueAdv, truePeriod: trueP,
    omegaDotDegPerTime, sidMean: d.sidMean, sidN: d.sidN, rMin: d.rMin, rMax: d.rMax,
    eProxy: (d.rMax - d.rMin) / (d.rMax + d.rMin),
    A: ea, B: eb,
    detDiffDeg: (ea && eb) ? Math.abs(ea.advDeg - eb.advDeg) : null,
    detDiffRelTrue: (ea && eb && trueAdv !== 0) ? Math.abs(ea.advDeg - eb.advDeg) / Math.abs(trueAdv) : null,
    detDiffPerSec: (ea && eb) ? Math.abs(ea.perMean - eb.perMean) : null };
}

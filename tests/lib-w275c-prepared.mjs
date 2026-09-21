// 第275便c(第65報 (3)「粒子同士は総当たりで重力計算、座標変換が重なっても総当たり回数は同じはず →
// なぜ重いか分析して改善」): **geoPN=3 スカラートイの 1 步を node で再実装した純関数**である。
//
// ■ なぜ node にも置くか
//   ① **ms/步 を Chromium の外でも測る**(同じ V8 でも、ページの他の仕事・描画・GC の影響を外した
//      裸の数字が要る。Chromium 側の数字は器 `tests/exp-w275c-galaxyprof2.mjs` が別に測る)。
//   ② **步をまたぐ幾何キャッシュ**(指示 3)は **html へ入れない**ので、node でだけ測って落とす。
//   ③ 旧経路と準備済み経路の**ビット同一を node でも独立に確かめる**(ブラウザ側の QA
//      `perf.geoToyPrepared` と別実装・別処理系での二重確認になる)。
//
// ■ **これはエンジンではない**(力にも表示にも 1 バイトも接続していない)。
//   beta/index.html の `dfmGeoToyStep`(旧経路)と `dfmGeoScalarPrepared`(準備済み経路)の
//   **scalar・支持なし・ω=0・閉包 "gravity"・箱なし**の場合を写したものである。
//   写し違いがあれば「node で同一・ブラウザで不一致」という形で必ず露見する(両方を回すため)。
//
// ■ 状態 St = { n, x,y,vx,vy,m:Float64Array, pin:Uint8Array, eps, pw, G, D0, eta, dt }
export const LIB_VERSION = 'w275c-1';

// ---- 旧経路: 行ごとに「源配列を作る → 源を昇順に 1 つずつ」(dfmField / dfmLocalMeshField の写し)
export function legacyAcc(St, ACC) {
  const { n, x, y, vx, vy, m, pin, eps, pw, G, D0, eta, dt } = St;
  const eps2 = eps * eps, pwZero = (pw === 0), pwHalfNeg = -pw / 2, om = 0, omd = 0;
  const AX = new Float64Array(n), AY = new Float64Array(n);
  // 第 1 巡(need:"gravity"): 行ごとに源配列を作り直す
  for (let i = 0; i < n; i++) {
    if (pin[i]) { AX[i] = 0; AY[i] = 0; continue; }
    const src = [], ids = [];
    for (let j = 0; j < n; j++) { if (j === i) continue; src.push(j); ids.push(j); }
    let D = 0, gDx = 0, gDy = 0;
    for (let k = 0; k < src.length; k++) {
      const j = src[k], mi = m[j];
      const dx = x[i] - x[j], dy = y[i] - y[j], s = dx * dx + dy * dy + eps2;
      const iv = 1 / Math.sqrt(s), iv3 = iv * iv * iv;
      D += mi * iv; gDx -= mi * dx * iv3; gDy -= mi * dy * iv3;
    }
    AX[i] = G * gDx; AY[i] = G * gDy;
  }
  // 第 2 巡(need:"mesh" → dfmLocalMeshField): 行ごとに源配列を作り直す
  let nOn = 0, dvM = 0, chiMax = 0;
  for (let i = 0; i < n; i++) {
    ACC[2 * i] = 0; ACC[2 * i + 1] = 0;
    if (pin[i]) continue;
    const src = [], ids = [];
    for (let j = 0; j < n; j++) { if (j === i) continue; src.push(j); ids.push(j); }
    let W = 0, gWx = 0, gWy = 0, Wd = 0, Nx = 0, Ny = 0;
    let g0 = 0, g1 = 0, g2 = 0, g3 = 0, Tx = 0, Ty = 0;
    for (let k = 0; k < src.length; k++) {
      const j = src[k], mi = m[j];
      const vix = vx[j], viy = vy[j], aix = AX[j], aiy = AY[j];
      const dx = x[i] - x[j], dy = y[i] - y[j], r2 = dx * dx + dy * dy, sq = r2 + eps2;
      const A = pwZero ? 1 : Math.pow(sq, pwHalfNeg);
      const w = mi * A;
      const kk = mi * (pwZero ? 0 : -pw * A / sq);
      const wgx = kk * dx, wgy = kk * dy;
      const uix = vix - om * dy, uiy = viy + om * dx;
      const wdi = -(wgx * vix + wgy * viy);
      const tix = aix - omd * dy + om * viy, tiy = aiy + omd * dx - om * vix;
      W += w; gWx += wgx; gWy += wgy; Wd += wdi;
      Nx += w * uix; Ny += w * uiy;
      g0 += uix * wgx; g1 += uix * wgy - w * om;
      g2 += uiy * wgx + w * om; g3 += uiy * wgy;
      Tx += wdi * uix + w * tix; Ty += wdi * uiy + w * tiy;
    }
    const den = D0 + W;
    if (!(den > 0) || !Number.isFinite(den)) continue;
    const ux = Nx / den, uy = Ny / den;
    const gu0 = (g0 - ux * gWx) / den, gu1 = (g1 - ux * gWy) / den,
      gu2 = (g2 - uy * gWx) / den, gu3 = (g3 - uy * gWy) / den;
    const du0 = (Tx - ux * Wd) / den, du1 = (Ty - uy * Wd) / den;
    const chi = W / den;
    if (chi > chiMax) chiMax = chi;
    const ubx = eta * ux, uby = eta * uy;
    const gxx = eta * gu0, gxy = eta * gu1, gyx = eta * gu2, gyy = eta * gu3;
    const tux = eta * du0, tuy = eta * du1;
    const vxi = vx[i], vyi = vy[i], rlx = vxi - ubx, rly = vyi - uby;
    const a0 = tux + gxx * vxi + gxy * vyi - (gxx * rlx + gyx * rly);
    const a1 = tuy + gyx * vxi + gyy * vyi - (gxy * rlx + gyy * rly);
    ACC[2 * i] = a0; ACC[2 * i + 1] = a1;
    const dm = Math.hypot(a0 * dt, a1 * dt); if (dm > dvM) dvM = dm;
    nOn++;
  }
  return { nOn, dvM, chiMax };
}

// ---- 準備済み経路: **無順序対を 1 度だけ**巡る(sqrt と pow が半分になる。和の順序は同じ)
//      `cache` を渡すと対の幾何(s と A)を書き出す/読み直す(**指示 3 の測定用** —— html には無い)
export function preparedAcc(St, ACC, cache, reuse) {
  const { n, x, y, vx, vy, m, pin, eps, pw, G, D0, eta, dt } = St;
  const eps2 = eps * eps, pwZero = (pw === 0), pwHalfNeg = -pw / 2, om = 0, omd = 0;
  const AX = new Float64Array(n), AY = new Float64Array(n);
  const DD = new Float64Array(n), GDX = new Float64Array(n), GDY = new Float64Array(n);
  const useCache = !!(cache && reuse), fill = !!cache && !reuse;
  let c = 0;
  for (let i = 0; i < n; i++) {
    const pi = pin[i], xi = x[i], yi = y[i], mi = m[i];
    for (let j = i + 1; j < n; j++) {
      const pj = pin[j];
      if (pi && pj) { if (cache) c++; continue; }
      let s;
      if (useCache) { s = cache.s[c]; }
      else { const dx = xi - x[j], dy = yi - y[j]; s = dx * dx + dy * dy + eps2; if (fill) cache.s[c] = s; }
      const iv = 1 / Math.sqrt(s), iv3 = iv * iv * iv;
      if (!pi) { const dxi = xi - x[j], dyi = yi - y[j], mj = m[j];
        DD[i] += mj * iv; GDX[i] -= mj * dxi * iv3; GDY[i] -= mj * dyi * iv3; }
      if (!pj) { const dxj = x[j] - xi, dyj = y[j] - yi;
        DD[j] += mi * iv; GDX[j] -= mi * dxj * iv3; GDY[j] -= mi * dyj * iv3; }
      if (cache) c++;
    }
  }
  for (let i = 0; i < n; i++) { if (pin[i]) { AX[i] = 0; AY[i] = 0; continue; }
    AX[i] = G * GDX[i]; AY[i] = G * GDY[i]; }
  const WW = new Float64Array(n), GWX = new Float64Array(n), GWY = new Float64Array(n),
    WD = new Float64Array(n), NX = new Float64Array(n), NY = new Float64Array(n),
    Q0 = new Float64Array(n), Q1 = new Float64Array(n), Q2 = new Float64Array(n),
    Q3 = new Float64Array(n), TX = new Float64Array(n), TY = new Float64Array(n);
  c = 0;
  for (let i = 0; i < n; i++) {
    const pi = pin[i], xi = x[i], yi = y[i];
    for (let j = i + 1; j < n; j++) {
      const pj = pin[j];
      if (pi && pj) { if (cache) c++; continue; }
      const dxi = xi - x[j], dyi = yi - y[j];
      let sq, A;
      if (useCache) { sq = cache.s[c]; A = cache.a[c]; }
      else { sq = dxi * dxi + dyi * dyi + eps2; A = pwZero ? 1 : Math.pow(sq, pwHalfNeg);
        if (fill) cache.a[c] = A; }
      if (!pi) {
        const mj = m[j], w = mj * A, kk = mj * (pwZero ? 0 : -pw * A / sq);
        const wgx = kk * dxi, wgy = kk * dyi;
        const vix = vx[j], viy = vy[j];
        const uix = vix - om * dyi, uiy = viy + om * dxi;
        const wdi = -(wgx * vix + wgy * viy);
        const tix = AX[j] - omd * dyi + om * viy, tiy = AY[j] + omd * dxi - om * vix;
        WW[i] += w; GWX[i] += wgx; GWY[i] += wgy; WD[i] += wdi;
        NX[i] += w * uix; NY[i] += w * uiy;
        Q0[i] += uix * wgx; Q1[i] += uix * wgy - w * om;
        Q2[i] += uiy * wgx + w * om; Q3[i] += uiy * wgy;
        TX[i] += wdi * uix + w * tix; TY[i] += wdi * uiy + w * tiy;
      }
      if (!pj) {
        const dxj = x[j] - xi, dyj = y[j] - yi;
        const mj = m[i], w = mj * A, kk = mj * (pwZero ? 0 : -pw * A / sq);
        const wgx = kk * dxj, wgy = kk * dyj;
        const vix = vx[i], viy = vy[i];
        const uix = vix - om * dyj, uiy = viy + om * dxj;
        const wdi = -(wgx * vix + wgy * viy);
        const tix = AX[i] - omd * dyj + om * viy, tiy = AY[i] + omd * dxj - om * vix;
        WW[j] += w; GWX[j] += wgx; GWY[j] += wgy; WD[j] += wdi;
        NX[j] += w * uix; NY[j] += w * uiy;
        Q0[j] += uix * wgx; Q1[j] += uix * wgy - w * om;
        Q2[j] += uiy * wgx + w * om; Q3[j] += uiy * wgy;
        TX[j] += wdi * uix + w * tix; TY[j] += wdi * uiy + w * tiy;
      }
      if (cache) c++;
    }
  }
  let nOn = 0, dvM = 0, chiMax = 0;
  for (let i = 0; i < n; i++) {
    ACC[2 * i] = 0; ACC[2 * i + 1] = 0;
    if (pin[i]) continue;
    const den = D0 + WW[i];
    if (!(den > 0) || !Number.isFinite(den)) continue;
    const ux = NX[i] / den, uy = NY[i] / den;
    const gu0 = (Q0[i] - ux * GWX[i]) / den, gu1 = (Q1[i] - ux * GWY[i]) / den,
      gu2 = (Q2[i] - uy * GWX[i]) / den, gu3 = (Q3[i] - uy * GWY[i]) / den;
    const du0 = (TX[i] - ux * WD[i]) / den, du1 = (TY[i] - uy * WD[i]) / den;
    const chi = WW[i] / den;
    if (chi > chiMax) chiMax = chi;
    const ubx = eta * ux, uby = eta * uy;
    const gxx = eta * gu0, gxy = eta * gu1, gyx = eta * gu2, gyy = eta * gu3;
    const tux = eta * du0, tuy = eta * du1;
    const vxi = vx[i], vyi = vy[i], rlx = vxi - ubx, rly = vyi - uby;
    const a0 = tux + gxx * vxi + gxy * vyi - (gxx * rlx + gyx * rly);
    const a1 = tuy + gyx * vxi + gyy * vyi - (gxy * rlx + gyy * rly);
    ACC[2 * i] = a0; ACC[2 * i + 1] = a1;
    const dm = Math.hypot(a0 * dt, a1 * dt); if (dm > dvM) dvM = dm;
    nOn++;
  }
  return { nOn, dvM, chiMax };
}

// ---- 対の数(**総当たり回数**の会計)。原仮定者の「座標変換が重なっても総当たり回数は同じはず」を
//      数で確かめるための純関数である。frameWeight も D₀ も帯平均も**この数には入らない**
//      (入るのは n と pinned の数だけ)。
export function pairCounts(n, nPin) {
  const nFree = n - nPin;
  const ordered = nFree * (n - 1);                       // 旧経路が 1 巡で通る (行,源) の順序対
  const unordered = (n * (n - 1)) / 2 - (nPin * (nPin - 1)) / 2;   // 準備済み経路が 1 巡で通る無順序対
  return {
    n, nPin, nFree,
    accumulationsPerPass: ordered,                        // **両経路で同じ**(和の項数は変わらない)
    legacyGeometryPerPass: ordered,                       // 旧: 順序対ごとに sqrt / pow を 1 回
    preparedGeometryPerPass: unordered,                   // 準: 無順序対ごとに 1 回
    passesPerStep: 2,                                     // 重力の第 1 巡 + 局所場の巡
    legacySqrtPerStep: ordered, legacyPowPerStep: ordered,
    preparedSqrtPerStep: unordered, preparedPowPerStep: unordered,
    // 旧経路が 1 步に作る一時配列(`dfmField` の src と ids)。第274便c で `.every` の配列は消えている
    legacyTempArraysPerStep: 2 * 2 * nFree + 1,           // 2 巡 × 行ごとに src と ids・+ BD 1 本
    preparedTempArraysPerStep: 1,                         // ACC 1 本だけ(累算器は步をまたいで使い回す)
  };
}

// ---- 指紋(ACC と積分後の状態を 1 つの 32bit へ)
export function fnv(arrs) {
  let a = 0x811c9dc5;
  const buf = new ArrayBuffer(8), f = new Float64Array(buf), u = new Uint8Array(buf);
  for (const A of arrs) for (let i = 0; i < A.length; i++) {
    f[0] = A[i];
    for (let b = 0; b < 8; b++) { a ^= u[b]; a = Math.imul(a, 0x01000193) >>> 0; }
  }
  return (a >>> 0).toString(16);
}

// ---- 駆動(**エンジンの積分器ではない** —— 位置を動かして「步をまたぐ再利用」を測るための最小の駆動)
export function drive(St, steps, mode, reuseEvery) {
  const { n, x, y, vx, vy, dt } = St;
  const ACC = new Float64Array(2 * n);
  const nPair = (n * (n - 1)) / 2;
  const cache = (mode === 'cached') ? { s: new Float64Array(nPair), a: new Float64Array(nPair) } : null;
  let nOn = 0, chiMax = 0;
  for (let k = 0; k < steps; k++) {
    const reuse = !!(cache && reuseEvery > 1 && (k % reuseEvery) !== 0);
    const r = (mode === 'legacy') ? legacyAcc(St, ACC) : preparedAcc(St, ACC, cache, reuse);
    nOn = r.nOn; chiMax = r.chiMax;
    for (let i = 0; i < n; i++) {
      if (St.pin[i]) continue;
      vx[i] += ACC[2 * i] * dt; vy[i] += ACC[2 * i + 1] * dt;
      x[i] += vx[i] * dt; y[i] += vy[i] * dt;
    }
  }
  return { nOn, chiMax, fp: fnv([x, y, vx, vy]) };
}

export function cloneState(St) {
  return { n: St.n, x: Float64Array.from(St.x), y: Float64Array.from(St.y),
    vx: Float64Array.from(St.vx), vy: Float64Array.from(St.vy), m: Float64Array.from(St.m),
    pin: Uint8Array.from(St.pin), eps: St.eps, pw: St.pw, G: St.G, D0: St.D0, eta: St.eta, dt: St.dt };
}

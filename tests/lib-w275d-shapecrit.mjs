// 第275便d(第65報 (4)(5)(6)): **形状トイの「安定・低分散・銀河らしさ」の機械量**(純関数)。
//
// 第274便d の判定は「指定した定常分布に入るか」だけを測っていた(共分散・投影の正規性・帳簿)。
// 原仮定者の裁定(第65報)は**見た目**を問題にしている:「粒子が初期配置に対して発散している」
// (🔮)・「軌道が入り乱れて銀河ディスクに見えない」(🥏)。そこで**測る前に**次の 5 つを決めた。
//
//   (a) `rmsRadius`   …… 面内 RMS 半径。**初期配置に対する残差**で「発散していない」を測る。
//   (b) `retrograde`  …… 角運動量 L_z の符号が**平均と逆**の粒子の割合(= 「入り乱れ」の機械量)。
//   (c) `axisWidth`   …… 腕(棒)の**横断 RMS 幅**と**軸方向の半長**。棒が太らないことを測る。
//   (d) `rotationCurve` …… 半径ビンごとの平均接線速度と Ω=v_t/r。**剛体回転か平坦か**を見る。
//   (e) `dispRatio`   …… σ_z/σ_R(面外/面内)。
//
// **どれも合否を宣言しない**(数を返すだけ)。合格条件は器 `tests/exp-w275d-shapecrit.mjs` の
// `CRIT` に**宣言値**として置いてあり、そこで真偽値になる。
// **較正ではない**: 観測された星団・銀河の量は 1 つも入っていない。

/** 面内 RMS 半径 √⟨x²+y²⟩(中心はあらかじめ引いてあるものとする)。 */
export function rmsRadius(X, Y) {
  const n = X.length;
  if (!n) return null;
  let s = 0;
  for (let i = 0; i < n; i++) s += X[i] * X[i] + Y[i] * Y[i];
  return Math.sqrt(s / n);
}

/** 標本平均・標本標準偏差。 */
export function meanSd(a) {
  const n = a.length;
  if (!n) return { n: 0, mean: null, sd: null };
  let m = 0;
  for (const v of a) m += v;
  m /= n;
  let s = 0;
  for (const v of a) s += (v - m) * (v - m);
  return { n, mean: m, sd: Math.sqrt(s / n) };
}

/**
 * **「入り乱れ」の機械量**。粒子ごとの L_z = x·v_y − y·v_x を作り、**総和の符号**を「平均の向き」と
 * して、それと逆符号の粒子の割合を返す。`net` は Σ|L_z| に対する ΣL_z の比(1 なら完全に揃っている)。
 * 銀河ディスクらしさの必要条件であって十分条件ではない(**形は別に測る**)。
 */
export function retrograde(X, Y, VX, VY) {
  const n = X.length;
  if (!n) return { n: 0, frac: null, net: null, sign: 0 };
  const L = new Array(n);
  let sum = 0, abs = 0;
  for (let i = 0; i < n; i++) {
    const l = X[i] * VY[i] - Y[i] * VX[i];
    L[i] = l; sum += l; abs += Math.abs(l);
  }
  const sign = sum >= 0 ? 1 : -1;
  let bad = 0;
  for (let i = 0; i < n; i++) if (L[i] * sign < 0) bad++;
  return { n, frac: bad / n, net: abs > 0 ? sum / abs : 0, sign, meanL: sum / n };
}

/**
 * 腕(棒)の幅。`X` は軸方向・`Y` は横断方向(どちらも中心を引いた値)。
 * 横断 RMS 幅・軸方向の半長(|X| の 95 パーセンタイル)・縦横比を返す。
 */
export function axisWidth(X, Y) {
  const n = X.length;
  if (!n) return { n: 0, width: null, half: null, ratio: null };
  let sy = 0;
  for (let i = 0; i < n; i++) sy += Y[i] * Y[i];
  const width = Math.sqrt(sy / n);
  const ax = Array.from(X, Math.abs).sort((p, q) => p - q);
  const half = ax[Math.min(n - 1, Math.floor(0.95 * n))];
  return { n, width, half, ratio: width > 0 ? half / width : null };
}

/**
 * 半径ビンの回転曲線。等頻度ビン(各ビンの粒子数をそろえる)で、平均半径・平均接線速度・
 * Ω=v_t/r・接線速度の標準偏差を返す。**剛体回転なら Ω がビンに依らず一定**、
 * **平坦回転なら v_t がビンに依らず一定**になる(どちらであるかを数で言うための列)。
 */
export function rotationCurve(X, Y, VX, VY, nbins) {
  const n = X.length;
  const nb = Math.max(1, nbins || 5);
  if (n < nb) return [];
  const idx = Array.from({ length: n }, (_, i) => i)
    .sort((p, q) => Math.hypot(X[p], Y[p]) - Math.hypot(X[q], Y[q]));
  const out = [];
  for (let b = 0; b < nb; b++) {
    const lo = Math.floor(b * n / nb), hi = Math.floor((b + 1) * n / nb);
    const rs = [], vts = [];
    for (let k = lo; k < hi; k++) {
      const i = idx[k], r = Math.hypot(X[i], Y[i]);
      if (!(r > 1e-12)) continue;
      rs.push(r);
      vts.push((X[i] * VY[i] - Y[i] * VX[i]) / r);
    }
    const mr = meanSd(rs), mv = meanSd(vts);
    out.push({ bin: b, n: rs.length, r: mr.mean, vt: mv.mean, vtSd: mv.sd,
      omega: (mr.mean > 0) ? mv.mean / mr.mean : null });
  }
  return out;
}

/**
 * 回転曲線の**形の 2 つの指標**(どちらも「宣言した形と比べる」ためだけの数で、合否ではない):
 *   `omegaSpread` …… Ω のビン間の相対ばらつき(max/min − 1)。**剛体回転なら 0**。
 *   `vtSpread`    …… v_t のビン間の相対ばらつき(max/min − 1)。**平坦回転なら 0**。
 */
export function curveShape(rows) {
  const om = rows.map((r) => r.omega).filter((v) => Number.isFinite(v) && v !== 0);
  const vt = rows.map((r) => r.vt).filter((v) => Number.isFinite(v) && v !== 0);
  const rel = (a) => (a.length < 2 ? null
    : Math.max(...a.map(Math.abs)) / Math.min(...a.map(Math.abs)) - 1);
  return { omegaSpread: rel(om), vtSpread: rel(vt) };
}

/** 等間隔でない時系列の相対ドリフト(最小二乗の傾き × 窓幅 ÷ 平均)。 */
export function relDrift(ts, vs) {
  const n = ts.length;
  if (n < 3) return null;
  let tm = 0, vm = 0;
  for (let i = 0; i < n; i++) { tm += ts[i]; vm += vs[i]; }
  tm /= n; vm /= n;
  let sxy = 0, sxx = 0;
  for (let i = 0; i < n; i++) { sxy += (ts[i] - tm) * (vs[i] - vm); sxx += (ts[i] - tm) ** 2; }
  if (!(sxx > 0) || !(Math.abs(vm) > 0)) return null;
  return (sxy / sxx) * (ts[n - 1] - ts[0]) / vm;
}

/**
 * 2 階 OU の**緩和時間**(遅い方の固有値の逆数)。宣言 ω₀・γ から作る**導出値**で、
 * 器はこれを使って「定常を測るのに十分長い窓」を選ぶ(刻みは厳密離散化なので自由に取れる)。
 */
export function relaxTime(omega0, gamma) {
  const d = gamma * gamma / 4 - omega0 * omega0;
  const slow = (d > 0) ? (gamma / 2 - Math.sqrt(d)) : (gamma / 2);
  return 1 / Math.max(1e-12, slow);
}

// 第269便a(第59報 W1・統括の読み (E)): **近点窓の純関数**(副作用なし・走行しない・数値を手で打たない)。
//
// ■ 直したもの(第268便a の判定器の契約未達)
//   第268便a の `tests/exp-w268a-d68.mjs` は、歳差の傾き Δϖ を **最初の nFit=58 近点**から作り、
//   換算に使う近点間周期 P_peri を **最初の 20 近点**(第252便b の固定窓)から作っていた。
//   同じ走行・同じ検出器でも**同じ近点集合ではない**ので、
//     ϖ̇ = Δϖ × YEAR / P_peri
//   の「分子と同じ窓の周期で割る」という換算契約(第268便a が自分で宣言した契約)を満たしていない。
//   周期が時間とともに変わる入力では 20 近点平均と 58 近点平均は**別の数**になる(下の合成試験)。
//
// ■ 新しい契約(本モジュールが固定する)
//   ① 周期は **傾き fit に使ったのと同じ最初の nFit 近点**(nFit−1 区間)の平均とする。
//   ② 窓が埋まらない(`nFitUsed < nFit`)・unwrap が中断した(`jump > 0`)ときは
//      **短い窓へ自動置換せず** `perMeanSim = null`・`windowComplete = false` とする。
//      (第251便c の定義契約 ④「測れないものは未測定と書く」をそのまま延長する。)
//   ③ 旧契約(20 近点固定窓)の値は `legacyPeriodMean` で**対照として**併記できる。
//      **旧値を新値として写さない**ためである(新契約の値は必ず再走して得る)。
//
// ■ このモジュールが言わないこと
//   「D68 が合(3σ)」「否(3σ)」「判定が増えた」。窓を揃えるのは**換算の前提**であって判定ではない。

// 近点候補列 `raw`(要素 {k, ang, r})から、近い重複を落とした近点列を作る。
//   `pRef` は重複除去の基準周期(接触要素の周期)。**第268便a・第249便b と同じ手続き**である。
export function dedupePeriastra(raw, rMin, rMax, pRef, dt) {
  const mid = 0.5 * (rMin + rMax);
  const peri = (raw || []).filter((p) => p.r <= mid);
  const keep = [];
  let dup = 0;
  for (const p of peri) {
    if (keep.length && (p.k - keep[keep.length - 1].k) * dt < 0.5 * pRef) { dup++; continue; }
    keep.push(p);
  }
  return { keep, dup };
}

// 近点方位の unwrap と、**近点番号**への線形 fit(傾き = Δϖ [rad/周])。
//   π/2 を超える跳びが出たらそこで**打ち切る**(`jump` に数える) —— 第268便a と同じ。
export function unwrapFit(use) {
  const ang = [];
  let jump = 0;
  for (let i = 0; i < use.length; i++) {
    let a = use[i].ang;
    if (i) {
      let z = a - ang[i - 1];
      while (z > Math.PI) z -= 2 * Math.PI;
      while (z < -Math.PI) z += 2 * Math.PI;
      if (Math.abs(z) > Math.PI / 2) { jump++; break; }
      a = ang[i - 1] + z;
    }
    ang.push(a);
  }
  const n = ang.length;
  let slope = null, resid = null;
  if (n >= 2) {
    const mx = (n - 1) / 2, my = ang.reduce((a, b) => a + b, 0) / n;
    let sxy = 0, sxx = 0;
    for (let i = 0; i < n; i++) { sxy += (i - mx) * (ang[i] - my); sxx += (i - mx) * (i - mx); }
    slope = sxy / sxx;
    resid = Math.sqrt(ang.reduce((s, a, i) => s + (a - (my + slope * (i - mx))) ** 2, 0) / n);
  }
  return { ang, n, jump, slopeRad: slope, residRad: resid };
}

// **旧契約**(第252便b の固定窓 = 最初の `window` 近点 / `window-1` 区間)の近点間周期。
//   新契約の値と**並べて記録する**ためだけに残す(判定には使わない)。
export function legacyPeriodMean(keep, dt, window = 20) {
  const win = (keep || []).slice(0, window);
  if (win.length < window) return null;
  return (win[window - 1].k - win[0].k) * dt / (window - 1);
}

// **新契約**の 1 段分の抽出。返り値の `perMeanSim` は**傾きと同じ近点集合**の平均間隔である。
//   `windowComplete` が false のときは `perMeanSim` を null にする(短い窓へ置換しない)。
export function fitPeriastronStage({ raw, rMin, rMax, pRef, dt, nFit, legacyWindow = 20 }) {
  const { keep, dup } = dedupePeriastra(raw, rMin, rMax, pRef, dt);
  const use = keep.slice(0, nFit);
  const f = unwrapFit(use);
  const n = f.n;
  // 窓の充足: 傾き fit に nFit 個の近点をすべて使えたか(unwrap の中断も不充足に数える)
  const windowComplete = (n === nFit && f.jump === 0 && nFit >= 2);
  const perMeanSim = windowComplete ? (use[n - 1].k - use[0].k) * dt / (n - 1) : null;
  return {
    nPeriFound: keep.length, nFitUsed: n, dup, jump: f.jump,
    slopeDegPerOrbit: (f.slopeRad === null) ? null : f.slopeRad * 180 / Math.PI,
    residDeg: (f.residRad === null) ? null : f.residRad * 180 / Math.PI,
    perMeanSim,
    periodWindow: nFit, periodIntervals: windowComplete ? (n - 1) : 0, windowComplete,
    windowNote: windowComplete
      ? '周期は**傾き fit と同じ最初の ' + nFit + ' 近点(' + (nFit - 1) + ' 区間)**の平均'
      : '窓が充足していない(nFitUsed=' + n + ' / jump=' + f.jump + ')— **短い窓へ置換せず未測定**とする',
    // 旧契約(20 近点固定窓)の対照。**新値の代わりに使ってはならない**。
    legacy: { window: legacyWindow, perMeanSim: legacyPeriodMean(keep, dt, legacyWindow),
      note: '第268便a までの契約(最初の ' + legacyWindow + ' 近点 = ' + (legacyWindow - 1)
        + ' 区間)—— **傾きと同じ近点集合ではない**' },
  };
}

// ---------------------------------------------------------------- 合成データ(純関数試験用)
// **周期が時間とともに変わる**近点列を作る。P_j = P0 × (1 + drift×j) で j 番目の区間を伸ばす。
//   近点方位は 1 周あたり `advRad` ずつ進む(unwrap できる範囲に収める)。
//   r は重複除去(`r <= (rMin+rMax)/2`)を通す値を入れる。
// この列では **20 近点平均 ≠ 58 近点平均** であり、旧関数と新関数の周期が違うことが**手計算でも出る**:
//   最初の m 区間の平均は P0 × (1 + drift×(m−1)/2) である。
export function syntheticPeriastra({ nPeri = 58, p0 = 100, drift = 0.001, advRad = 0.05, dt = 1 } = {}) {
  const out = [];
  let k = 0;
  for (let j = 0; j < nPeri; j++) {
    if (j) k += p0 * (1 + drift * (j - 1)) / dt;
    out.push({ k, ang: wrapPi(advRad * j), r: 1 });
  }
  return out;
}
function wrapPi(a) {
  let z = a;
  while (z > Math.PI) z -= 2 * Math.PI;
  while (z < -Math.PI) z += 2 * Math.PI;
  return z;
}
// 合成列の「最初の m 区間の平均」の閉じた式(試験の期待値を**手で打たない**ため)。
export function syntheticMeanFirst({ m, p0 = 100, drift = 0.001 }) {
  if (!(m >= 1)) return null;
  return p0 * (1 + drift * (m - 1) / 2);
}

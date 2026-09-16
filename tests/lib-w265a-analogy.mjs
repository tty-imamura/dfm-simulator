// 第265便a(第57報 W1)「**共同補正プロトコル**の純関数ライブラリ」。
//
// ■ ここにあるもの(**系種に依らない**部品だけ)
//   (1) `protocolDeclaration(spec)` —— 「窓・抽出器・観測版」を**1 つの記録**にまとめる宣言器。
//       系種(NS 連星 / BH 連星 / 星団 / 銀河)ごとに違うものを**違うまま**残すための欄を持つ。
//       **`sameWindowAsNS` は既定 false** で、true にするには「窓・抽出器・観測版が NS と同じである」
//       という**測った根拠**を `evidence` に書かないと通らない(空なら false に落とす)。
//   (2) `richardson3(qh, qh2, qh4)` —— 3 刻みの見かけの次数 p_obs=log₂|(Q_h−Q_{h/2})/(Q_{h/2}−Q_{h/4})| と
//       Richardson 外挿 Q_ext=Q_{h/4}+(Q_{h/4}−Q_{h/2})/(2^p−1)。**p_obs が正でなければ外挿しない**。
//       **差の比が単調でない(h/2→h/4 の差が h→h/2 の差より大きい)ときは `monotone:false` を立てる** ——
//       この場合 p_obs は負になるので外挿は付かない。
//   (3) `rootCheck(inp)` —— 共同根の返り値に**必ず**付ける検査票。
//       `{converged, status, residualP, residualW, observationalPass, isPrediction}`。
//       **`observationalPass` は常に null**(この器は σ 判定をしない)・**`isPrediction` は常に false**
//       (共同 fit は事前予測ではない —— 裁定 Z15)。
//       status は "fit-search-tolerance-met"(探索許容を満たした)/ "fit-search-unresolved"(根探索が
//       許容に届かない)/ "measurement-unresolved"(そもそも量が測れていない = 外挿が付かない・走行が未完)。
//       **停止条件は探索許容であって σ ではない。**
//   (4) `nondimJacobian(J, at)` —— [[∂P/∂k, ∂P/∂f],[∂ω̇/∂k, ∂ω̇/∂f]] を無次元化
//       ([[(k/P)∂P/∂k, (f/P)∂P/∂f],[(k/ω̇)∂ω̇/∂k, (f/ω̇)∂ω̇/∂f]])して特異値と条件数を返す。
//       **次元付き行列式で識別性を判断しない**(s と °/yr を掛けた行列式は単位で大きさが変わる)。
//   (5) `baselineVerdict(inp)` —— 基準走行(kFrame=1・f=1)の判定。
//       2 量とも nσ 以内なら "correction-not-required"・どちらかが外れたら "correction-required"・
//       σ が無い/量が測れていないなら "undecidable"。**判定は σ で行う**。
//   (6) `projectedStats(pts, opt)` —— 星団の**投影量**(投影半質量半径・コア半径・帯別の面内速度分散)。
//       **2D 面内の分散を視線速度分散と同一視しない** —— 返り値の名前に `Proxy` を付け、
//       `caveat` 欄を必ず持たせる。
//   (7) `periodFromMinima(ks, dt, unitSec)` —— 極小の間隔から周期を作る(BH 連星の inspiral 窓用)。
//
// ■ ここに無いもの(意図的に)
//   **観測値が 1 つも無い**(CSV が正本)。**合否の閾値も無い**(σ 倍は器が観測 σ から作る)。
//   **力学も無い**(エンジンには触れない)。`S._core` には 1 命令も足していない。
//
// ■ この器が**言わないこと**
//   「BH 連星・星団を較正した」「NS と同じ窓で測った」「共同 fit は事前予測である」。

// ---------------------------------------------------------------- (1) 宣言
export function protocolDeclaration(spec) {
  const s = spec || {};
  const ev = Array.isArray(s.evidence) ? s.evidence.filter((z) => typeof z === 'string' && z.trim()) : [];
  const same = (s.sameWindowAsNS === true) && ev.length > 0;
  return {
    systemKind: String(s.systemKind || 'unknown'),     // 'ns-binary' | 'bh-binary' | 'cluster' | 'galaxy'
    id: s.id === undefined ? null : s.id,
    sampleClass: s.sampleClass === undefined ? null : s.sampleClass,
    calibrationClass: s.calibrationClass === undefined ? 'principle' : s.calibrationClass,
    window: s.window === undefined ? null : s.window,            // {tStart, tEnd, unit, why}
    extractor: s.extractor === undefined ? null : s.extractor,   // {name, quantity[], definition}
    observationVersion: s.observationVersion === undefined ? null : s.observationVersion,
    quantities: Array.isArray(s.quantities) ? s.quantities.slice() : [],
    gateConnected: s.gateConnected === true,       // 観測 2 量の門が CSV へ繋がっているか
    sameWindowAsNS: same,
    evidence: ev,
    note: '窓・抽出器・観測版は系種ごとに違う。**NS と揃えたとは書かない**(裁定 (B))。',
  };
}

// ---------------------------------------------------------------- (2) 3 刻み
export function richardson3(qh, qh2, qh4) {
  if (![qh, qh2, qh4].every((z) => Number.isFinite(z))) {
    return { p: null, ext: null, monotone: null, d1: null, d2: null, note: '3 段が揃っていない' };
  }
  const d1 = qh - qh2, d2 = qh2 - qh4;
  if (!(Math.abs(d2) > 0)) return { p: null, ext: null, monotone: null, d1, d2, note: '2 段目と 3 段目の差が 0' };
  if (d1 * d2 < 0) {
    return { p: null, ext: null, monotone: false, d1, d2, sameSign: false,
      note: '**差の符号が反転している**(h→h/2 と h/2→h/4 で向きが違う)—— 単調に収束していないので外挿しない' };
  }
  const monotone = Math.abs(d2) < Math.abs(d1);
  const p = Math.log2(Math.abs(d1 / d2));
  if (!(p > 0)) {
    return { p, ext: null, monotone, d1, d2,
      note: '**見かけの次数が正でない**(h/2→h/4 の差が h→h/2 の差より大きい)—— 漸近域に居ないので外挿しない' };
  }
  return { p, ext: qh4 + (qh4 - qh2) / (Math.pow(2, p) - 1), monotone, d1, d2, note: null };
}

// ---------------------------------------------------------------- (3) rootCheck
export function rootCheck(inp) {
  const o = inp || {};
  const rP = Number.isFinite(o.residualP) ? o.residualP : null;
  const rW = Number.isFinite(o.residualW) ? o.residualW : null;
  const wObs = Number.isFinite(o.omegaDotObs) ? Math.abs(o.omegaDotObs) : null;
  const pTol = Number.isFinite(o.pTolSec) ? o.pTolSec : 1e-3;
  const wTol = Number.isFinite(o.wTolRel) ? o.wTolRel : 5e-4;
  let status, converged = false;
  if (o.measurementResolved === false || rP === null || rW === null || wObs === null || !(wObs > 0)) {
    status = 'measurement-unresolved';
  } else if (Math.abs(rP) < pTol && Math.abs(rW) / wObs < wTol) {
    status = 'fit-search-tolerance-met'; converged = true;
  } else {
    status = 'fit-search-unresolved';
  }
  return { converged, status, residualP: rP, residualW: rW,
    observationalPass: null,       // **この器は σ 判定をしない**(常に null)
    isPrediction: false,           // **共同 fit は事前予測ではない**(裁定 Z15)
    tolerance: { pTolSec: pTol, wTolRel: wTol,
      note: '**停止条件は探索許容であって σ ではない。**' } };
}

// ---------------------------------------------------------------- (4) 無次元感度
export function nondimJacobian(J, at) {
  const a = at || {};
  const k = Number(a.k), f = Number(a.f), P = Number(a.P), W = Number(a.omegaDot);
  if (!J || ![k, f, P, W].every(Number.isFinite) || !(Math.abs(P) > 0) || !(Math.abs(W) > 0)) return null;
  const m = [[k * J.dPdk / P, f * J.dPdf / P], [k * J.dWdk / W, f * J.dWdf / W]];
  // 2×2 の特異値(解析式): σ² は MᵀM の固有値
  const a11 = m[0][0], a12 = m[0][1], a21 = m[1][0], a22 = m[1][1];
  const t = a11 * a11 + a12 * a12 + a21 * a21 + a22 * a22;
  const d = a11 * a22 - a12 * a21;
  const disc = Math.max(0, t * t / 4 - d * d);
  const s1 = Math.sqrt(Math.max(0, t / 2 + Math.sqrt(disc)));
  const s2 = Math.sqrt(Math.max(0, t / 2 - Math.sqrt(disc)));
  return { matrix: m, det: d, sv: [s1, s2],
    cond: (s2 > 0) ? s1 / s2 : Infinity,
    note: '**無次元化した行列の条件数**で識別性を見る(次元付き行列式では見ない)。' };
}

// ---------------------------------------------------------------- (5) 基準走行の判定
export function baselineVerdict(inp) {
  const o = inp || {};
  const n = Number.isFinite(o.nSigma) ? o.nSigma : 3;
  const mk = (resid, sigma) => {
    if (!Number.isFinite(resid)) return { nSigma: null, inside: null, why: '量が測れていない' };
    if (!Number.isFinite(sigma) || !(sigma > 0)) return { nSigma: null, inside: null, why: 'σ が無い' };
    const z = resid / sigma;
    return { nSigma: z, inside: Math.abs(z) <= n, why: null };
  };
  const P = mk(o.residualP, o.sigmaP), W = mk(o.residualW, o.sigmaW);
  let verdict;
  if (P.inside === null || W.inside === null) verdict = 'undecidable';
  else if (P.inside && W.inside) verdict = 'correction-not-required';
  else verdict = 'correction-required';
  return { verdict, nSigmaGate: n, P, omegaDot: W,
    note: 'verdict="correction-required" は「観測質量に対する補正が要る系」という**判定**であって、'
      + '**観測質量が誤っていることの確定ではない**(初期条件・力則・数値誤差も同じ不一致に寄与しうる)。' };
}

// ---------------------------------------------------------------- (6) 星団の投影量
//   pts = [{x, y, vx, vy, m}]。**投影は x 軸へ**(視線方向は y と宣言する)。
//   ・**投影**半質量半径 = |x| で並べて質量の半分に達する |x|。
//   ・**面内(2D)**半質量半径 = √(x²+y²) で並べて質量の半分に達する半径(**投影量とは別の量**)。
//     —— どちらも「半質量半径」と呼べてしまうので、**両方を別の名前で返して呼ぶ側に選ばせる**。
//   ・コア半径 = 投影線密度が中心の半分に落ちる |x|(**粒子数 k で幅を決める窓**の線密度を使う ——
//     固定幅のビンは N=240 では数えの揺らぎで刻みごとに跳ねる。**King の r_c とは混用しない**)。
//   ・帯別の速度分散 = **粒子数で 5 等分した帯**(等幅ではない —— 外側が空にならないため)の
//     v_y の標準偏差(**面内の 1 成分** —— 視線速度分散ではない)。
export function projectedStats(pts, opt) {
  const o = opt || {};
  const nBand = (o.bands === undefined) ? 5 : o.bands;
  const arr = (pts || []).filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y)
    && Number.isFinite(p.vy) && Number.isFinite(p.m) && p.m > 0);
  if (arr.length < 2) return null;
  const R = arr.map((p) => ({ R: Math.abs(p.x), r2: Math.hypot(p.x, p.y), v: p.vy, m: p.m }));
  const mTot = R.reduce((s, z) => s + z.m, 0);
  const halfOf = (key) => {
    const s = R.slice().sort((a, b) => a[key] - b[key]);
    let acc = 0;
    for (const z of s) { acc += z.m; if (acc >= mTot / 2) return z[key]; }
    return null;
  };
  const rHalf = halfOf('R'), rHalf2D = halfOf('r2');
  R.sort((a, b) => a.R - b.R);
  const rMax = R[R.length - 1].R;
  // 帯: **粒子数で等分**(σ_v(r) の 5 帯)
  const bands = [];
  for (let i = 0; i < nBand; i++) {
    const i0 = Math.floor(R.length * i / nBand), i1 = Math.floor(R.length * (i + 1) / nBand);
    const inB = R.slice(i0, i1);
    const n = inB.length;
    let mean = null, sd = null;
    if (n >= 2) {
      mean = inB.reduce((s, z) => s + z.v, 0) / n;
      sd = Math.sqrt(inB.reduce((s, z) => s + (z.v - mean) * (z.v - mean), 0) / (n - 1));
    }
    const lo = inB.length ? inB[0].R : null, hi = inB.length ? inB[inB.length - 1].R : null;
    bands.push({ i, rLo: lo, rHi: hi, rMid: (lo !== null) ? 0.5 * (lo + hi) : null, n,
      mass: inB.reduce((s, z) => s + z.m, 0),
      vMean: mean, sigmaInPlaneProxy: sd });
  }
  // コア半径: **粒子数で幅を決める窓**(k 近傍)の線密度が中心の半分に落ちる R。
  //   固定幅のビンだと N=240 では数えの揺らぎで刻みごとに跳ねる(実測: 1.15 / 1.61 / 3.30)。
  //   窓を粒子数で決めると同じ量が滑らかに出る。**窓幅 k を返り値に残す**(定義の一部である)。
  let rCore = null, prof = null;
  const kWin = Math.max(8, Math.round(R.length / 10));
  if (R.length >= 2 * kWin) {
    prof = [];
    for (let i = 0; i + kWin <= R.length; i++) {
      const lo = R[i].R, hi = R[i + kWin - 1].R;
      const mass = R.slice(i, i + kWin).reduce((s, z) => s + z.m, 0);
      prof.push({ rMid: 0.5 * (lo + hi), lineDensity: (hi > lo) ? mass / (hi - lo) : null });
    }
    const s0 = prof[0].lineDensity;
    if (Number.isFinite(s0) && s0 > 0) {
      for (let i = 1; i < prof.length; i++) {
        const a = prof[i - 1], b = prof[i];
        if (Number.isFinite(a.lineDensity) && Number.isFinite(b.lineDensity)
          && a.lineDensity >= s0 / 2 && b.lineDensity < s0 / 2) {
          const t = (a.lineDensity - s0 / 2) / (a.lineDensity - b.lineDensity);
          rCore = a.rMid + t * (b.rMid - a.rMid); break;
        }
      }
    }
  }
  const all = R.map((z) => z.v);
  const mAll = all.reduce((s, v) => s + v, 0) / all.length;
  const sdAll = Math.sqrt(all.reduce((s, v) => s + (v - mAll) * (v - mAll), 0) / (all.length - 1));
  return { n: arr.length, mTotal: mTot,
    projectedHalfMassRadius: rHalf, halfMassRadius2D: rHalf2D, rMax,
    coreRadiusHalfDensity: rCore, coreWindowParticles: kWin,
    sigmaInPlaneProxyAll: sdAll, bands,
    caveat: '**投影は x 軸・「視線」は y 成分と宣言した面内の 1 成分である。'
      + '2D の面内分散を視線速度分散へ直接対応させない。**コア半径は線密度が半分に落ちる R であって '
      + 'King の r_c ではない。投影半質量半径(|x|)と面内 2D 半質量半径(√(x²+y²))は**別の量**である。' };
}

// ---------------------------------------------------------------- (8) 生成器つきプリセットの質量係数
//   `psrMassScaled`(`tests/lib-w262a-psrdiag.mjs`)は `bodies[i].m` を持つ 2 体プリセット用である。
//   星団・銀河の本体は **`type:"disk"` の生成器**(n・mMin・mMax・seed)なので、係数はそちらに掛ける。
//   **位置の生成は seed と半径分布だけで決まる**ので、質量係数を掛けても t=0 の配置は 1 bit も動かない
//   (速度は vMode が virial のときだけポテンシャル経由で動く —— 呼ぶ側が宣言する)。
//   **返すのは `sampleClass:"principle"` の診断コピーで、台帳と claims を外す。**
export function clusterMassScaled(preset, f, opt) {
  const o = opt || {};
  if (!Number.isFinite(f) || !(f > 0)) return null;
  const p = JSON.parse(JSON.stringify(preset));
  p.id = o.id || (preset.id + 'Diag');
  p.sampleClass = 'principle';
  delete p.massCalibration; delete p.claims; delete p.calibrationForecast;
  const touched = [];
  for (const b of (p.bodies || [])) {
    if (Number.isFinite(b.m)) { b.m *= f; touched.push('m'); }
    if (Number.isFinite(b.mMin)) { b.mMin *= f; touched.push('mMin'); }
    if (Number.isFinite(b.mMax)) { b.mMax *= f; touched.push('mMax'); }
    if (Number.isFinite(b.mTotal)) { b.mTotal *= f; touched.push('mTotal'); }
    if (o.dropLightSweep && b.lightSweep !== undefined) delete b.lightSweep;
  }
  if (o.kFrame !== undefined) p.physics.kFrame = o.kFrame;
  // **検証器が知らない鍵は足さない**(何に掛けたかは呼ぶ側が記録する)
  if (o.report) o.report.touched = Array.from(new Set(touched));
  return p;
}

// ---------------------------------------------------------------- (7) 極小間隔からの周期
export function periodFromMinima(ks, dt, unitSec) {
  const a = (ks || []).filter((z) => Number.isFinite(z));
  if (a.length < 2) return { period: null, n: a.length, note: '極小が 2 個未満' };
  const u = Number.isFinite(unitSec) ? unitSec : 1;
  const P = (a[a.length - 1] - a[0]) * dt / (a.length - 1) * u;
  const gaps = [];
  for (let i = 1; i < a.length; i++) gaps.push((a[i] - a[i - 1]) * dt * u);
  const m = gaps.reduce((s, z) => s + z, 0) / gaps.length;
  const sd = gaps.length >= 2
    ? Math.sqrt(gaps.reduce((s, z) => s + (z - m) * (z - m), 0) / (gaps.length - 1)) : null;
  return { period: P, n: a.length, gapSd: sd, note: null };
}

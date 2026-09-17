// 第269便d(第59報 W4)「**星団の比較サンプル v1a**: 明示状態の語彙・中心の契約・束縛率・幾何比の理論」。
//
// ■ ここにあるもの(**観測値を 1 つも持たない**純関数だけ)
//   (1) `STATES` / `isState(s)` —— **明示状態の語彙**(統括の読み (A) ③)。
//       `comparable` / `inside-interval` / `outside-interval` / `numerically-unresolved` /
//       `mapping-unresolved` / `not-measurable` / `not-applicable` の 7 語。
//       第269便c が置く共通モジュールと**同じ形**にしてあるが、名前の衝突を避けるため
//       本枝では別名(`lib-w269d-state.mjs`)に置く —— **統合時に統括が 1 本へ寄せる**。
//   (2) `stateRecord(spec)` —— 状態つきの 1 行。**比較を出してよいのは `comparable` /
//       `inside-interval` / `outside-interval` のときだけ**で、それ以外の状態で `value` や
//       `ratio` や `nSigma` を渡すと **throw する**(「観測量と並べていない」ことを器で担保する)。
//   (3) `numericalVerdict(rich)` —— `richardson3` の返り値を**状態の語**へ写す。
//       見かけの次数が正でない・差が単調でない・3 段が揃わないときは `numerically-unresolved`。
//       **正の次数が出たときも「収束済み」とは言わない**(`order-estimated` = 次数が推定できた、だけ)。
//   (4) `centerOf(pts, mode, opt)` —— 中心の契約。`origin`(第265便a の基準・中心を引かない)/
//       `mass-centroid`(質量重心・重心速度)/ `density-peak`(k 近傍の線密度が最大になる窓)。
//       **定義文字列を必ず返り値に持たせる**(どれを使ったか分からない中心を作らない)。
//   (5) `boundFraction(pts, opt)` —— 束縛率。**ニュートン力学のエネルギーによる診断**である
//       (Φ_i=−G Σ_{j≠i} m_j/√(d²+ε²) は E4 と同じ軟化核)。**kFrame=1 の走行では
//       この E は保存量ではない**(引きずりが入る)—— `caveat` に必ず書く。
//   (6) `halfRadiusRatioTheory(opt)` —— 面内 2D 半質量半径(√(x²+y²))と一次元射影半質量半径
//       (|x|)の**幾何比の理論値**。円対称な 2D 配置についての導出と、Plummer 面密度の閉形式
//       (比 = √3)、および打切り半径つきの数値解を返す。**3D 球対称の話ではない**
//       (本エンジンに z/vz は無い —— 統括の読み (D))。
//   (7) `clusterDiagCopy(preset, opt)` —— seed・N を変えた**診断コピー**(`sampleClass:"principle"`・
//       台帳と claims を外す)。**本体プリセットの JSON は 1 bit も書き換えない。**
//
// ■ ここに無いもの(意図的に)
//   観測値・σ・合否の閾値・力学。**47 Tuc の公表値と並べる比は 1 つも作らない。**
//
// ■ この器が**言わないこと**
//   「47 Tuc と比べられる投影半径を作った」「視線速度分散を測った」「観測と合った」「収束済み」。

// ---------------------------------------------------------------- (1) 語彙
export const STATES = ['comparable', 'inside-interval', 'outside-interval',
  'numerically-unresolved', 'mapping-unresolved', 'not-measurable', 'not-applicable'];
// **値を並べてよい状態**(これ以外では比較の数を作らない)
export const COMPARABLE_STATES = ['comparable', 'inside-interval', 'outside-interval'];
export function isState(s) { return STATES.indexOf(String(s)) >= 0; }

// ---------------------------------------------------------------- (2) 状態つきの 1 行
export function stateRecord(spec) {
  const s = spec || {};
  const st = String(s.state || '');
  if (!isState(st)) throw new Error('lib-w269d-state: 語彙に無い状態: ' + st);
  const cmp = COMPARABLE_STATES.indexOf(st) >= 0;
  const held = ['value', 'ratio', 'nSigma', 'residual'].filter((k) => s[k] !== undefined && s[k] !== null);
  if (!cmp && held.length) {
    throw new Error('lib-w269d-state: 状態 ' + st + ' では比較の数を出せない(' + held.join(',') + ')');
  }
  const r = { quantity: String(s.quantity || ''), state: st,
    why: s.why === undefined ? null : String(s.why),
    source: s.source === undefined ? null : String(s.source),
    unit: s.unit === undefined ? null : String(s.unit),
    comparisonWithheld: !cmp };
  if (cmp) { for (const k of ['value', 'ratio', 'nSigma', 'residual']) if (s[k] !== undefined) r[k] = s[k]; }
  return r;
}

// ---------------------------------------------------------------- (3) 3 刻みの状態
export function numericalVerdict(rich) {
  const r = rich || {};
  if (r.p === null || r.p === undefined || !(r.p > 0)) {
    return { status: 'numerically-unresolved', p: (r.p === undefined ? null : r.p),
      monotone: (r.monotone === undefined ? null : r.monotone), ext: null,
      why: (r.monotone === false) ? '差が単調でない(符号反転 または h/2→h/4 の差が大きい)'
        : (r.p === null || r.p === undefined) ? '3 段が揃っていない/差が 0' : '見かけの次数が正でない' };
  }
  return { status: 'order-estimated', p: r.p, monotone: r.monotone === true, ext: r.ext,
    why: '**見かけの次数が正で差が単調**なので外挿が付く —— これは「次数が推定できた」であって'
      + '**「収束済み」ではない**(段を増やすまで次数は確定しない)' };
}

// ---------------------------------------------------------------- (4) 中心の契約
export function centerOf(pts, mode, opt) {
  const o = opt || {};
  const arr = (pts || []).filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y) && Number.isFinite(p.m));
  const m = String(mode === undefined ? 'mass-centroid' : mode);
  if (m === 'origin') {
    return { mode: 'origin', x: 0, y: 0, vx: 0, vy: 0, n: arr.length,
      definition: '**原点**(第265便a の基準 —— 中心を引かない)。対照として残す。' };
  }
  if (m === 'mass-centroid') {
    let M = 0, x = 0, y = 0, vx = 0, vy = 0;
    for (const p of arr) { M += p.m; x += p.m * p.x; y += p.m * p.y;
      vx += p.m * (p.vx || 0); vy += p.m * (p.vy || 0); }
    if (!(Math.abs(M) > 0)) return { mode: 'mass-centroid', x: 0, y: 0, vx: 0, vy: 0, n: arr.length,
      definition: '質量重心(総質量 0 のため原点に落とした)', degenerate: true };
    return { mode: 'mass-centroid', x: x / M, y: y / M, vx: vx / M, vy: vy / M, n: arr.length, mass: M,
      definition: '**質量重心**(位置 Σm r/Σm)と**重心速度**(Σm v/Σm)を引く。'
        + '走行中に群が並進しても量が動かない、という理由で選ぶ既定。' };
  }
  if (m === 'density-peak') {
    const k = Number.isFinite(o.kDensity) ? Math.max(2, Math.round(o.kDensity))
      : Math.max(8, Math.round(arr.length / 10));
    const peak1D = (key) => {
      const s = arr.slice().sort((a, b) => a[key] - b[key]);
      if (s.length < k) return { c: null, idx: null };
      let best = -Infinity, bi = -1;
      for (let i = 0; i + k <= s.length; i++) {
        const lo = s[i][key], hi = s[i + k - 1][key];
        if (!(hi > lo)) continue;
        let mm = 0; for (let j = i; j < i + k; j++) mm += s[j].m;
        const d = mm / (hi - lo);
        if (d > best) { best = d; bi = i; }
      }
      if (bi < 0) return { c: null, idx: null };
      let mm = 0, acc = 0;
      for (let j = bi; j < bi + k; j++) { mm += s[j].m; acc += s[j].m * s[j][key]; }
      return { c: (mm > 0) ? acc / mm : null, lineDensity: best, window: [s[bi][key], s[bi + k - 1][key]] };
    };
    const px = peak1D('x'), py = peak1D('y');
    // **速度の中心は質量重心速度を使う**(k 窓の平均速度は N=240 では揺らぎが大きい —— 宣言)
    const mc = centerOf(arr, 'mass-centroid', o);
    return { mode: 'density-peak', x: px.c === null ? 0 : px.c, y: py.c === null ? 0 : py.c,
      vx: mc.vx, vy: mc.vy, n: arr.length, kWindow: k,
      lineDensityX: px.lineDensity === undefined ? null : px.lineDensity,
      lineDensityY: py.lineDensity === undefined ? null : py.lineDensity,
      windowX: px.window || null, windowY: py.window || null,
      definition: '**k 近傍の線密度が最大になる窓**(粒子数 k=' + k + ' の窓・軸ごとに独立)の'
        + '質量重み平均位置。**速度の中心だけは質量重心速度**を使う(k 窓の平均速度は N=240 では'
        + '揺らぎが大きい —— 宣言)。**King の密度中心や光度重心ではない。**' };
  }
  throw new Error('lib-w269d-state: 未知の中心モード: ' + m);
}

// ---------------------------------------------------------------- (5) 束縛率
export function boundFraction(pts, opt) {
  const o = opt || {};
  const G = Number.isFinite(o.G) ? o.G : null;
  if (G === null) return null;
  const eps2 = (Number.isFinite(o.softening) ? o.softening : 0) ** 2;
  const arr = (pts || []).filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y)
    && Number.isFinite(p.vx) && Number.isFinite(p.vy) && Number.isFinite(p.m));
  if (arr.length < 2) return null;
  const cvx = Number.isFinite(o.cvx) ? o.cvx : 0, cvy = Number.isFinite(o.cvy) ? o.cvy : 0;
  let nB = 0, mB = 0, mT = 0, phiSum = 0, kinSum = 0;
  for (let i = 0; i < arr.length; i++) {
    const a = arr[i];
    let phi = 0;
    for (let j = 0; j < arr.length; j++) {
      if (j === i) continue;
      const dx = arr[j].x - a.x, dy = arr[j].y - a.y;
      phi -= G * arr[j].m / Math.sqrt(dx * dx + dy * dy + eps2);
    }
    const dvx = a.vx - cvx, dvy = a.vy - cvy;
    const e = 0.5 * (dvx * dvx + dvy * dvy) + phi;    // 単位質量あたり
    mT += a.m; phiSum += a.m * phi; kinSum += 0.5 * a.m * (dvx * dvx + dvy * dvy);
    if (e < 0) { nB++; mB += a.m; }
  }
  return { n: arr.length, nBound: nB, countFraction: nB / arr.length,
    massFraction: (mT > 0) ? mB / mT : null, massTotal: mT,
    kineticTotal: kinSum, potentialTotal: 0.5 * phiSum,
    virialRatio: (phiSum !== 0) ? (2 * kinSum) / (-0.5 * phiSum) : null,
    definition: '**E_i = ½|v_i−v_c|² + Φ_i < 0**(単位質量あたり)。'
      + 'Φ_i = −G Σ_{j≠i} m_j/√(d²+ε²) は E4 と同じ軟化核(ε=softening)。'
      + 'v_c は宣言した中心の速度。**自己重力の二重計上を避けるため系の U は ½Σm_iΦ_i**。',
    caveat: '**ニュートン力学のエネルギーによる診断である。** kFrame=1 の走行には空間引きずりが'
      + '入るので、この E は**その走行の保存量ではない**(束縛率は「この定義での割合」であって'
      + '「脱出しないことの証明」ではない)。潮汐場・外部ポテンシャルも入れていない。' };
}

// ---------------------------------------------------------------- (6) 幾何比の理論
//   **円対称な 2D 配置**(x–y 面内・z は無い)についての幾何:
//   半径 r の粒子の x は x=r cosθ(θ 一様)なので、|x| ≤ X となる割合は
//     g(X, r) = 1                     (r ≤ X)
//             = (2/π) arcsin(X/r)     (r > X)
//   よって F₁(X) = ∫ g(X, r) dM(r)/M。面内 2D の累積は F₂(R) = M(<R)/M。
//   **Plummer 面密度** Σ(r) = Σ₀ (1+r²/a²)⁻² では M(<r)/M = r²/(r²+a²) なので
//     F₂ = 1/2 → R₂ = a、
//     λ(x) = ∫Σ dy = (π/2)Σ₀a⁴(x²+a²)^{−3/2} → F₁(X) = X/√(X²+a²) → F₁ = 1/2 → R₁ = a/√3。
//   **比 R₂/R₁ = √3 = 1.7320508075688772**(打切りなし・無限標本の極限)。
//   打切り半径 R_t がある実配置では両者とも縮むので、数値解も併せて返す。
export function halfRadiusRatioTheory(opt) {
  const o = opt || {};
  const a = Number.isFinite(o.plummerScale) ? o.plummerScale : 1;
  const rt = Number.isFinite(o.truncationRadius) ? o.truncationRadius : Infinity;
  const closed = { R2: a, R1: a / Math.sqrt(3), ratio: Math.sqrt(3) };
  // 一般式 F₁ の数値評価(閉形式の検算にも使う)
  const Mof = (r) => (r * r) / (r * r + a * a);                 // M(<r)/M(∞)
  const Mt = Number.isFinite(rt) ? Mof(rt) : 1;
  const dM = (r) => 2 * a * a * r / Math.pow(r * r + a * a, 2); // dM/dr / M(∞)
  const NQ = Number.isFinite(o.quadNodes) ? o.quadNodes : 40000;
  const rMaxQ = Number.isFinite(rt) ? rt : 4000 * a;
  // **変数変換 r = a·u/(1−u)**(u∈[0, u_t))で無限遠まで有限区間に写す —— 打切りなしの場合に
  //   r 空間の中点則で尾を切ると比が 0.6% ずれる(実測 1.7421)。u 空間なら閉形式に戻る。
  const uOf = (r) => r / (r + a);
  const uT = Number.isFinite(rt) ? uOf(rt) : 1;
  const F1 = (X) => {                                           // 打切り込みの割合(分母 Mt)
    const h = uT / NQ;
    let s = 0;
    for (let i = 0; i < NQ; i++) {                              // 中点則(u 空間)
      const u = (i + 0.5) * h;
      const r = a * u / (1 - u), drdu = a / ((1 - u) * (1 - u));
      const g = (r <= X) ? 1 : (2 / Math.PI) * Math.asin(Math.min(1, X / r));
      s += g * dM(r) * drdu * h;
    }
    return s / Mt;
  };
  const bisect = (fn, lo, hi) => { let L = lo, H = hi;
    for (let i = 0; i < 80; i++) { const M = 0.5 * (L + H); if (fn(M) < 0.5) L = M; else H = M; }
    return 0.5 * (L + H); };
  const R1t = bisect(F1, 1e-9, rMaxQ);
  const R2t = bisect((R) => Mof(Math.min(R, rMaxQ)) / Mt, 1e-9, rMaxQ);
  return {
    profile: 'plummer-surface-density', plummerScale: a,
    truncationRadius: Number.isFinite(rt) ? rt : null,
    massInsideTruncation: Mt,
    closedFormUntruncated: closed,
    truncatedNumeric: { R1: R1t, R2: R2t, ratio: R2t / R1t, quadNodes: NQ },
    generalFormula: 'F₁(X) = ∫ g(X,r) dM(r)/M, g = 1 (r≤X) / (2/π)·arcsin(X/r) (r>X) —— '
      + '**円対称な 2D 配置の幾何だけから出る**(力学も観測も入っていない)',
    derivation: 'Σ(r)=Σ₀(1+r²/a²)⁻² → M(<r)/M=r²/(r²+a²) → R₂=a。'
      + 'λ(x)=∫Σdy=(π/2)Σ₀a⁴(x²+a²)^{−3/2} → M(|x|≤X)/M=X/√(X²+a²) → R₁=a/√3。'
      + '比 R₂/R₁=√3。',
    caveat: '**3D 球対称の投影の話ではない。** 本エンジンは 2D で z/vz を持たないので、'
      + 'ここでの「投影」は面内の x 軸への射影である(統括の読み (D))。'
      + 'また実測の比は**有限 N(=240)の標本ゆらぎ**と、半質量半径を「累積が M/2 に達した粒子の半径」'
      + 'で採る**階段推定**の偏りを含む —— 理論比との差を力学の効果と読まない。' };
}

// ---------------------------------------------------------------- (7) 診断コピー(seed / N)
//   **本体プリセットの JSON は 1 bit も書き換えない。** 返すのは `sampleClass:"principle"` の
//   コピーで、台帳(massCalibration)と claims を外す。
//   `n` を変えるときは **既定で総質量を保存**する(m ← m×n₀/n)—— 分解能の感度であって
//   質量を変える実験ではない(`keepTotalMass:false` を明示したときだけ粒子質量を保つ)。
export function clusterDiagCopy(preset, opt) {
  const o = opt || {};
  const p = JSON.parse(JSON.stringify(preset));
  p.id = o.id || (preset.id + 'W269dDiag');
  p.sampleClass = 'principle';
  delete p.massCalibration; delete p.claims; delete p.calibrationForecast;
  const rep = { seedChanged: false, nChanged: false, massPerParticleScaled: null };
  if (o.seed !== undefined && o.seed !== null) { p.seed = o.seed; rep.seedChanged = true; }
  if (Number.isFinite(o.n) && o.n > 0) {
    const b = p.bodies && p.bodies[0];
    if (b && Number.isFinite(b.n)) {
      const n0 = b.n, n1 = Math.round(o.n);
      if (n1 !== n0) {
        b.n = n1; rep.nChanged = true;
        if (o.keepTotalMass !== false) {
          const f = n0 / n1;
          if (Number.isFinite(b.mMin)) b.mMin *= f;
          if (Number.isFinite(b.mMax)) b.mMax *= f;
          rep.massPerParticleScaled = f;
        }
      }
    }
  }
  if (o.report) Object.assign(o.report, rep);
  return p;
}

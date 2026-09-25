// 第281便b(原仮定者の裁定(第71報)「中心天体群から外縁にかけて引きずりが連鎖する」・統括の読み R73)
// — **有限予算の交換模型**の純関数(html を読まない・エンジンへ接続しない)。
//
// ■ 何の模型か(**連鎖仮説を調べる構成則であって、DFM の導出則ではない**)
//   節点 i(中心コア・円環 1..N・背景)が角速度 Ω_i と慣性 I_i を持ち、辺 (i,j) の結合 K_ij(単位 I/T —— 対称)で
//     I_i Ω̇_i = Σ_j K_ij (Ω_j − Ω_i)
//   に従って角速度を交換する。K は**宣言値**で、DFM の決定力から導いた量ではない(導出は未着手)。
//   「有限予算」= 系の角運動量 J=ΣI_iΩ_i と回転エネルギー E_rot=½ΣI_iΩ_i² が有限で、中心の自転は
//   **使えば減る貯金**として扱う(中心を固定する開いた実験では、固定に要る外部トルクの仕事を別帳簿に積む)。
//
// ■ 積分法(対ごとの厳密解の対称合成)
//   辺 1 本だけの部分系は閉じた形で解ける: λ=K(1/I_i+1/I_j)・Ω̄=(I_iΩ_i+I_jΩ_j)/(I_i+I_j)・
//   Ω_i(h)=Ω̄+(Ω_i−Ω̄)e^{−λh}。この写像は**対の角運動量を厳密に保ち**、散逸
//   ΔQ=½μΔ²(1−e^{−2λh})(μ=I_iI_j/(I_i+I_j)・Δ=Ω_j−Ω_i)は**負にならない**。
//   1 歩 = 辺を 1→m の順に h=dt/2、m→1 の順に h=dt/2(Strang の対称合成)→ **2 次**。
//   固定節点(`fixed`)は I=∞ の極限: λ=K/I_free・Ω_free(h)=Ω_fix+(Ω_free−Ω_fix)e^{−λh}・
//   外部が渡す角運動量 ΔJ_ext=I_free(Ω_free(h)−Ω_free)・外部トルクの仕事 ΔW_ext=Ω_fix·ΔJ_ext・
//   散逸 ΔQ=½I_free(Ω_free−Ω_fix)²(1−e^{−2λh})。
//
// ■ 帳簿(`chainRun` が返す)
//   J(t)=J(0)+J_ext(t)・E_rot(t)+Q(t)=E_rot(0)+W_ext(t)・ΔQ≥0(各辺・各半歩)。
//   Q は**閉じた式で別に積む**(E_rot の差から逆算しない)ので、閉じの残差は丸めだけを測る独立の検算になる。
//
// ■ この lib がしないこと
//   ・DFM の場(W・χ・u)から K や I を決めない(宣言値のまま)。・差動回転を「作る」パラメータを置かない。
//   ・エンジン・表示へ接続しない(器の中だけの純関数)。
export const CHAIN_LIB_VERSION = 'w281b-chain-1';

/** 系の検査。sys={I:[...](fixed の節点は無視), edges:[[i,j,K],...], fixed:{idx:Ω}}。戻り値 null=OK / 文字列=拒否理由 */
export function chainValidate(sys) {
  if (!sys || !Array.isArray(sys.I) || !sys.I.length) return 'I が無い';
  const n = sys.I.length;
  const fx = sys.fixed || {};
  for (let i = 0; i < n; i++) {
    if (Object.prototype.hasOwnProperty.call(fx, i)) { if (!Number.isFinite(fx[i])) return '固定値が非有限 ' + i; continue; }
    if (!(Number.isFinite(sys.I[i]) && sys.I[i] > 0)) return 'I は正の有限数 ' + i;
  }
  if (!Array.isArray(sys.edges)) return 'edges が無い';
  const seen = new Set();
  for (const e of sys.edges) {
    if (!Array.isArray(e) || e.length !== 3) return '辺は [i,j,K]';
    const [i, j, K] = e;
    if (!(Number.isInteger(i) && Number.isInteger(j) && i >= 0 && j >= 0 && i < n && j < n && i !== j)) return '辺の節点 ' + i + ',' + j;
    if (!(Number.isFinite(K) && K >= 0)) return 'K は 0 以上の有限数(対称 —— 1 本の辺で両側に同じ値が効く)';
    const key = Math.min(i, j) + '-' + Math.max(i, j);
    if (seen.has(key)) return '辺の重複 ' + key;
    seen.add(key);
    if (Object.prototype.hasOwnProperty.call(fx, i) && Object.prototype.hasOwnProperty.call(fx, j)) return '両端固定の辺 ' + key;
  }
  return null;
}

// 辺 1 本の厳密解(h だけ進める)。acc に dQ・dJext・dWext・dQmin を積む
function pairExact(Om, sys, e, h, acc) {
  const [i, j, K] = e;
  if (K === 0) return;                                   // 結合 0 は 1 bit も動かさない(因果対照)
  const fx = sys.fixed || {};
  const fi = Object.prototype.hasOwnProperty.call(fx, i), fj = Object.prototype.hasOwnProperty.call(fx, j);
  if (!fi && !fj) {
    const Ii = sys.I[i], Ij = sys.I[j];
    const lam = K * (1 / Ii + 1 / Ij), ex = Math.exp(-lam * h);
    const d = Om[j] - Om[i];
    const bar = (Ii * Om[i] + Ij * Om[j]) / (Ii + Ij);
    Om[i] = bar + (Om[i] - bar) * ex;
    Om[j] = bar + (Om[j] - bar) * ex;
    const mu = Ii * Ij / (Ii + Ij);
    const dq = 0.5 * mu * d * d * (1 - ex * ex);
    acc.Q += dq; if (dq < acc.dQmin) acc.dQmin = dq;
    return;
  }
  const f = fi ? i : j, k = fi ? j : i;                   // f=固定・k=自由
  const Ik = sys.I[k], Of = fx[f];
  const lam = K / Ik, ex = Math.exp(-lam * h);
  const a = Om[k] - Of;
  const nk = Of + a * ex;
  const dJ = Ik * (nk - Om[k]);
  Om[k] = nk;
  acc.Jext += dJ; acc.Wext += Of * dJ;
  const dq = 0.5 * Ik * a * a * (1 - ex * ex);
  acc.Q += dq; if (dq < acc.dQmin) acc.dQmin = dq;
}

/** 1 歩(Strang の対称合成)。Om は破壊的に更新。acc={Q,Jext,Wext,dQmin} */
export function chainStep(Om, sys, dt, acc) {
  const E = sys.edges, h = dt / 2;
  for (let k = 0; k < E.length; k++) pairExact(Om, sys, E[k], h, acc);
  for (let k = E.length - 1; k >= 0; k--) pairExact(Om, sys, E[k], h, acc);
  const fx = sys.fixed || {};
  for (const key of Object.keys(fx)) Om[Number(key)] = fx[key];
}

/** 自由節点だけの J と E_rot(固定節点は外部 —— 帳簿の外) */
export function chainTotals(Om, sys) {
  const fx = sys.fixed || {};
  let J = 0, E = 0;
  for (let i = 0; i < Om.length; i++) {
    if (Object.prototype.hasOwnProperty.call(fx, i)) continue;
    J += sys.I[i] * Om[i]; E += 0.5 * sys.I[i] * Om[i] * Om[i];
  }
  return { J, E };
}

/**
 * 走行。戻り値 {Omega, t, steps, ledger:{J0,J,Jext,E0,E,Q,Wext,jRel,closeRel,dQmin}, samples}
 * opts.sampleAt: 時刻の配列(その歩の後の Ω を記録)・opts.frontThr: 各節点が閾値を初めて越えた時刻
 */
export function chainRun(sys, Omega0, dt, T, opts) {
  const o = opts || {};
  const err = chainValidate(sys);
  if (err) return { ok: false, err };
  if (!(dt > 0 && Number.isFinite(dt) && T >= 0 && Number.isFinite(T))) return { ok: false, err: 'dt/T' };
  const Om = Float64Array.from(Omega0);
  const fx = sys.fixed || {};
  for (const key of Object.keys(fx)) Om[Number(key)] = fx[key];
  const t0 = chainTotals(Om, sys);
  const acc = { Q: 0, Jext: 0, Wext: 0, dQmin: Infinity };
  const steps = Math.round(T / dt);
  const samples = [];
  const want = (o.sampleAt || []).map((t) => Math.round(t / dt));
  const thr = o.frontThr;
  const front = thr === undefined ? null : new Array(Om.length).fill(null);
  if (want.includes(0)) samples.push({ t: 0, Omega: Array.from(Om) });
  let worstJ = 0, worstC = 0;
  for (let s = 1; s <= steps; s++) {
    chainStep(Om, sys, dt, acc);
    const tt = chainTotals(Om, sys);
    const jr = Math.abs(tt.J - (t0.J + acc.Jext)) / Math.max(Math.abs(t0.J), Math.abs(tt.J), 1e-300);
    const cr = Math.abs(tt.E + acc.Q - (t0.E + acc.Wext)) / Math.max(t0.E + Math.abs(acc.Wext), 1e-300);
    if (jr > worstJ) worstJ = jr;
    if (cr > worstC) worstC = cr;
    if (front) for (let i = 0; i < Om.length; i++) if (front[i] === null && Math.abs(Om[i]) >= thr) front[i] = s * dt;
    if (want.includes(s)) samples.push({ t: s * dt, Omega: Array.from(Om) });
  }
  const t1 = chainTotals(Om, sys);
  return { ok: true, Omega: Array.from(Om), t: steps * dt, steps,
    ledger: { J0: t0.J, J: t1.J, Jext: acc.Jext, E0: t0.E, E: t1.E, Q: acc.Q, Wext: acc.Wext,
      jRelMax: worstJ, closeRelMax: worstC, dQmin: acc.dQmin },
    samples, front };
}

// ---- 厳密解(閉じた系のみ): y=I^{1/2}Ω で ẏ=−M y・M=I^{−1/2} L I^{−1/2}(対称)を Jacobi 法で対角化
function jacobiEig(A0) {
  const n = A0.length, A = A0.map((r) => r.slice()), V = A0.map((_, i) => A0.map((__, j) => (i === j ? 1 : 0)));
  for (let sweep = 0; sweep < 100; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off += A[p][q] * A[p][q];
    if (off < 1e-30) break;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
      if (Math.abs(A[p][q]) < 1e-300) continue;
      const th = (A[q][q] - A[p][p]) / (2 * A[p][q]);
      const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1));
      const c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < n; k++) { const akp = A[k][p], akq = A[k][q]; A[k][p] = c * akp - s * akq; A[k][q] = s * akp + c * akq; }
      for (let k = 0; k < n; k++) { const apk = A[p][k], aqk = A[q][k]; A[p][k] = c * apk - s * aqk; A[q][k] = s * apk + c * aqk; }
      for (let k = 0; k < n; k++) { const vkp = V[k][p], vkq = V[k][q]; V[k][p] = c * vkp - s * vkq; V[k][q] = s * vkp + c * vkq; }
    }
  }
  return { lam: A.map((r, i) => r[i]), V };
}
export function chainExact(sys, Omega0, t) {
  if (sys.fixed && Object.keys(sys.fixed).length) return null;   // 固定節点のある系は非斉次 —— 対象外
  const n = sys.I.length;
  const L = Array.from({ length: n }, () => new Array(n).fill(0));
  for (const [i, j, K] of sys.edges) { L[i][i] += K; L[j][j] += K; L[i][j] -= K; L[j][i] -= K; }
  const r = sys.I.map((x) => 1 / Math.sqrt(x));
  const M = L.map((row, i) => row.map((v, j) => r[i] * v * r[j]));
  const { lam, V } = jacobiEig(M);
  const y0 = Omega0.map((w, i) => w * Math.sqrt(sys.I[i]));
  const c = lam.map((_, k) => V.reduce((s, row, i) => s + row[k] * y0[i], 0) * Math.exp(-lam[k] * t));
  return V.map((row, i) => row.reduce((s, v, k) => s + v * c[k], 0) * r[i]);
}

// ---- 宣言した試験系(**数は宣言であって、銀河の値を写したものではない**)
//   節点 0=中心コア(I=4・Ω₀=1.2)・1..6=円環(I=1・Ω₀=0)・7=背景(I=100・Ω₀=0)。
//   辺は最近接の鎖だけ(0–1–2–…–6–7)・K=0.5(全辺同じ)。
export const CHAIN_DECL = { nRings: 6, Icore: 4, Iring: 1, Ibg: 100, K: 0.5, OmegaCore0: 1.2 };
export function chainSystem(over) {
  const d = Object.assign({}, CHAIN_DECL, over || {});
  const n = d.nRings + 2;
  const I = [d.Icore].concat(new Array(d.nRings).fill(d.Iring), [d.Ibg]);
  const edges = [];
  for (let i = 0; i + 1 < n; i++) edges.push([i, i + 1, (d.cut === i) ? 0 : d.K]);
  const sys = { I, edges };
  if (d.fixed) sys.fixed = d.fixed;
  const Om0 = new Array(n).fill(0); Om0[0] = d.OmegaCore0;
  return { sys, Om0, decl: d };
}

/** 帳簿一式(QA behavior.chainLedger と正本 chainledger-w281b.json が読む) */
export function chainLedgerSuite() {
  const out = { libVersion: CHAIN_LIB_VERSION, decl: CHAIN_DECL };
  // (a) 閉じた鎖: T=40・dt=0.1
  {
    const { sys, Om0 } = chainSystem();
    const r = chainRun(sys, Om0, 0.1, 40, { sampleAt: [0, 5, 10, 20, 40], frontThr: 0.01 });
    const Jinf = r.ledger.J0 / sys.I.reduce((s, x) => s + x, 0);
    out.closed = { dt: 0.1, T: 40, ledger: r.ledger, samples: r.samples, front: r.front, OmegaCommon: Jinf };
  }
  // (b) 刻み収束(閉じた鎖・T=10・厳密解との差の最大値)
  {
    const { sys, Om0 } = chainSystem();
    const ex = chainExact(sys, Om0, 10);
    const rows = [];
    for (const dt of [0.4, 0.2, 0.1, 0.05, 0.025]) {
      const r = chainRun(sys, Om0, dt, 10);
      rows.push({ dt, errMax: Math.max(...r.Omega.map((w, i) => Math.abs(w - ex[i]))) });
    }
    for (let k = 1; k < rows.length; k++) rows[k].order = Math.log2(rows[k - 1].errMax / rows[k].errMax);
    // 厳密解そのものの検算(J 保存と、固有値分解の再構成)
    const Jex = ex.reduce((s, w, i) => s + sys.I[i] * w, 0);
    out.convergence = { T: 10, rows, exactJRel: Math.abs(Jex - 1.2 * 4) / (1.2 * 4) };
  }
  // (c) 因果対照: 辺 3–4 を 0 にする → 節点 4..7 は 0 のまま(ビット)
  {
    const { sys, Om0 } = chainSystem({ cut: 3 });
    const r = chainRun(sys, Om0, 0.1, 40);
    out.causal = { cutEdge: [3, 4], T: 40, Omega: r.Omega, outerExactZero: r.Omega.slice(4).every((w) => w === 0),
      innerMoved: r.Omega.slice(1, 4).every((w) => w !== 0), ledger: r.ledger };
  }
  // (d) 長時間(閉じた鎖): 共通角速度へ近づく —— 差動回転を自動では作らない
  {
    const { sys, Om0 } = chainSystem();
    const Jinf = 1.2 * 4 / sys.I.reduce((s, x) => s + x, 0);
    const rows = [];
    for (const T of [40, 400, 4000, 40000]) {
      const r = chainRun(sys, Om0, 0.1, T);
      rows.push({ T, spreadMax: Math.max(...r.Omega.map((w) => Math.abs(w - Jinf))), coreFraction: r.Omega[0] / 1.2,
        jRelMax: r.ledger.jRelMax, closeRelMax: r.ledger.closeRelMax });
    }
    out.longTime = { OmegaCommon: Jinf, rows };
  }
  // (e) 開いた実験: 中心を Ω=1.2 に固定(外部トルク)・背景を 0 に固定 → 定常な勾配(外部の仕事で維持)
  {
    const { sys, Om0 } = chainSystem({ fixed: { 0: 1.2, 7: 0 } });
    const r = chainRun(sys, Om0, 0.1, 400, { sampleAt: [40, 400] });
    const T2 = chainRun(sys, Om0, 0.1, 800);
    const dQdt = (T2.ledger.Q - r.ledger.Q) / 400, dWdt = (T2.ledger.Wext - r.ledger.Wext) / 400;
    const lin = Array.from({ length: 8 }, (_, k) => 1.2 * (1 - k / 7));
    out.openBothFixed = { fixed: { core: 1.2, background: 0 }, T: 400, Omega: r.Omega, linearProfile: lin,
      profileDevMax: Math.max(...r.Omega.map((w, i) => Math.abs(w - lin[i]))), ledger: r.ledger,
      steadyDissipationRate: dQdt, steadyWorkRate: dWdt, steadyRateAnalytic: 0.5 * 7 * (1.2 / 7) ** 2 };
  }
  // (f) 開いた実験: 中心だけ固定・背景は有限の I → 全節点が 1.2 へ(外部が J と仕事を払い続ける)
  {
    const { sys, Om0 } = chainSystem({ fixed: { 0: 1.2 } });
    const r = chainRun(sys, Om0, 0.1, 4000);
    out.openCoreFixed = { fixed: { core: 1.2 }, T: 4000, Omega: r.Omega, ledger: r.ledger,
      spreadMax: Math.max(...r.Omega.slice(1).map((w) => Math.abs(w - 1.2))) };
  }
  return out;
}

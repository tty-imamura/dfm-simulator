// 第257便d(第49報): 星団 C0/C1/Cn の**初期条件の作り方**だけを取り出した純 Node ライブラリ。
// 走行器 tests/exp-w257d-cluster2.mjs と QA `behavior.clusterVirial` が**同じ 1 本**を使う
//(QA がブラウザを起こさずに「3 群の初期ビリアル比・全エネルギーが揃っている」ことを固定できる)。
//
// 揃えるもの: **2K/|U| = QSTAR**・**E_tot = E***(同じセルの C1 群の自然値)・
// **λ = L/(M·r_h·v_rms) = LFRAC**・M・ソフトニング ε・外縁の切り方 RCUT/APLUM。
// **r_h は揃わない**(同じ E で分布が違えば違う)。ここは宣言であって、合わせ込みの隠蔽ではない。

export const CFG = {
  MTOT: 17.7,        // 🍇 と同じ全質量
  FC: 0.06,          // 中心成分の質量比 M_c = FC·M
  APLUM: 12.34,      // 場の星の 2D Plummer スケール
  RCUT: 120,         // 生成の外縁(RCUT/APLUM = 9.724 を全群・全セルで固定 = 外縁条件)
  NC0: 20,           // C0 の滑らかな中心成分の粒数
  AC0: 2.5,          // C0 の中心成分の Plummer スケール
  NBH: 4,            // Cn の BH 個数
  RSUB: 2.5,         // Cn の部分系の半径
  LFRAC: 0.10,       // λ の目標
  QSTAR: 1.0,        // 2K/|U| の目標
};
export const KINDS = ['C0', 'C1', 'Cn'];

export function lcg(seed) {
  let s = (seed >>> 0) || 1;
  return () => { s = (1664525 * s + 1013904223) >>> 0; return s / 4294967296; };
}
export function plummer2D(rnd, a, rcut) {
  for (let i = 0; i < 200; i++) { const u = rnd(); const R = a * Math.sqrt(u / (1 - u)); if (R <= rcut) return R; }
  return rcut;
}
export function stats(b, G, eps2) {
  let W = 0, K = 0, M = 0, L = 0, cx = 0, cy = 0, px = 0, py = 0;
  for (const p of b) { M += p.m; cx += p.m * p.x; cy += p.m * p.y; px += p.m * p.vx; py += p.m * p.vy; }
  cx /= M; cy /= M;
  for (const p of b) { L += p.m * ((p.x - cx) * p.vy - (p.y - cy) * p.vx); K += 0.5 * p.m * (p.vx * p.vx + p.vy * p.vy); }
  for (let i = 0; i < b.length; i++) for (let j = i + 1; j < b.length; j++) {
    const dx = b[j].x - b[i].x, dy = b[j].y - b[i].y;
    W -= G * b[i].m * b[j].m / Math.sqrt(dx * dx + dy * dy + eps2);
  }
  return { W, K, E: K + W, M, L, cx, cy, px, py, vRms: Math.sqrt(2 * K / M), Q: 2 * K / Math.abs(W) };
}
export function radiusOfMassFrac(b, frac) {
  let M = 0, cx = 0, cy = 0;
  for (const p of b) { M += p.m; cx += p.m * p.x; cy += p.m * p.y; }
  cx /= M; cy /= M;
  const s = b.map((p) => ({ r: Math.hypot(p.x - cx, p.y - cy), m: p.m })).sort((u, v) => u.r - v.r);
  let acc = 0;
  for (const q of s) { acc += q.m; if (acc >= frac * M) return q.r; }
  return s.length ? s[s.length - 1].r : 0;
}
export const halfMassRadius = (b) => radiusOfMassFrac(b, 0.5);

export function makeGroup(kind, seed, nField) {
  const { MTOT, FC, APLUM, RCUT, NC0, AC0, NBH, RSUB } = CFG;
  const rnd = lcg(seed);
  const Mc = FC * MTOT, Mf = MTOT - Mc, mf = Mf / nField;
  const b = [];
  for (let i = 0; i < nField; i++) {   // 場の星は 3 群でビット同一(乱数の消費順を揃える)
    const R = plummer2D(rnd, APLUM, RCUT), th = 2 * Math.PI * rnd();
    b.push({ m: mf, x: R * Math.cos(th), y: R * Math.sin(th), vx: 0, vy: 0, tag: 'field' });
  }
  if (kind === 'C0') {
    const rc = lcg(seed ^ 0x5bf03635);
    for (let i = 0; i < NC0; i++) {
      const R = plummer2D(rc, AC0, 6 * AC0), th = 2 * Math.PI * rc();
      b.push({ m: Mc / NC0, x: R * Math.cos(th), y: R * Math.sin(th), vx: 0, vy: 0, tag: 'core' });
    }
  } else if (kind === 'C1') {
    b.push({ m: Mc, x: 0, y: 0, vx: 0, vy: 0, tag: 'bh' });
  } else {
    for (let i = 0; i < NBH; i++) {
      const th = 2 * Math.PI * i / NBH;
      b.push({ m: Mc / NBH, x: RSUB * Math.cos(th), y: RSUB * Math.sin(th), vx: 0, vy: 0, tag: 'bh' });
    }
  }
  return b;
}
export function setIsotropicVelocities(b, seed, G, eps2) {
  const rv = lcg(seed ^ 0x1a2b3c4d);
  const st = stats(b, G, eps2);
  const v = Math.sqrt(Math.max(0, -st.W / st.M));
  for (const p of b) { const th = 2 * Math.PI * rv(); p.vx = v * Math.cos(th); p.vy = v * Math.sin(th); }
}
// 重心ゼロ → λ を LFRAC へ → (Q を QSTAR・E を eTarget へ)を**反復**。
// ソフトニング ε は位置と一緒に伸び縮みしないので W ∝ 1/s が厳密でない(W=−ΣGm_im_j/√(r²+ε²))。
// 1 回で済ませた版は 2K/|U| が 3.5×10⁻⁴・E が 6.9×10⁻⁴ ずれた —— 実測して反復に直した。
export function shape(b, G, eps2, eTarget) {
  const { LFRAC, QSTAR, RCUT } = CFG;
  let a = stats(b, G, eps2);
  for (const p of b) { p.x -= a.cx; p.y -= a.cy; p.vx -= a.px / a.M; p.vy -= a.py / a.M; }
  a = stats(b, G, eps2);
  let rh = halfMassRadius(b);
  const lTarget = LFRAC * a.M * rh * a.vRms;
  let I = 0; for (const p of b) I += p.m * (p.x * p.x + p.y * p.y);
  const om = (lTarget - a.L) / I;
  for (const p of b) { const vx = p.vx - om * p.y, vy = p.vy + om * p.x; p.vx = vx; p.vy = vy; }
  let alpha = 1, s = 1, iter = 0, resid = null;
  for (; iter < 200; iter++) {
    a = stats(b, G, eps2);
    const al = Math.sqrt(QSTAR * Math.abs(a.W) / (2 * a.K));
    for (const p of b) { p.vx *= al; p.vy *= al; }
    alpha *= al;
    if (eTarget !== null && Number.isFinite(eTarget) && eTarget !== 0) {
      const a2 = stats(b, G, eps2);
      const sl = a2.E / eTarget, rs = Math.sqrt(sl);
      for (const p of b) { p.x *= sl; p.y *= sl; p.vx /= rs; p.vy /= rs; }
      s *= sl;
    }
    const a3 = stats(b, G, eps2);
    resid = Math.max(Math.abs(a3.Q / QSTAR - 1),
      (eTarget !== null && eTarget !== 0) ? Math.abs(a3.E / eTarget - 1) : 0);
    if (resid < 1e-14) break;
  }
  const f = stats(b, G, eps2);
  rh = halfMassRadius(b);
  return { scale: s, omegaAdded: om, alpha, shapeIter: iter, shapeResid: resid,
    rh, r95: radiusOfMassFrac(b, 0.95), rCut: RCUT * s,
    Q: f.Q, E: f.E, K: f.K, W: f.W, L: f.L, M: f.M, vRms: f.vRms,
    lambda: f.L / (f.M * rh * f.vRms), tCross: rh / f.vRms };
}

// QA が使う 1 セル分の初期条件(ブラウザ不要・軽量)。3 群を作って整形し、揃い具合を返す。
export function buildCell({ nField, eps, seed, G }) {
  const eps2 = eps * eps;
  const ref = makeGroup('C1', seed, nField);
  setIsotropicVelocities(ref, seed, G, eps2);
  const eTarget = shape(ref, G, eps2, null).E;
  const rows = [];
  for (const kind of KINDS) {
    const b = makeGroup(kind, seed, nField);
    setIsotropicVelocities(b, seed, G, eps2);
    const nrm = shape(b, G, eps2, eTarget);
    rows.push({ kind, n: b.length, init: nrm });
  }
  const qs = rows.map((r) => r.init.Q), es = rows.map((r) => r.init.E), ls = rows.map((r) => r.init.lambda);
  const rel = (v) => (Math.max(...v) - Math.min(...v)) / Math.max(...v.map(Math.abs));
  return { eTarget, rows,
    spread: { QRel: rel(qs), ERel: rel(es), lambdaRel: rel(ls),
      QMin: Math.min(...qs), QMax: Math.max(...qs),
      rh: rows.map((r) => r.init.rh), rCutOverRh: rows.map((r) => r.init.rCut / r.init.rh) } };
}

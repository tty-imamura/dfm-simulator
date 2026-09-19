// 第273便b(統括の検証項目 R20 / 裁定 AH20)— **カロン対照系列の「測定コード」そのもの**。
//
// これは第272便b の器 `tests/exp-w272b-charon.mjs` のページ側ヘルパを切り出したものである
// (**測定の意味論に対する変更は 0 行**。追加は `make()` の中の宣言鍵 1 つだけで、その理由と
// 同値性の実測は下に書く)。切り出しの目的は 2 つ:
//   ① **R20 の併合鍵に「測定コードの hash」を入れられるようにする** —— 併合鍵が `meta.targetSha256`
//      だけを見ていると、**測定コードや窓が変わった段**を同じ列へ混ぜてしまう。測定コードが
//      このファイル 1 本になったので、その SHA-256 が鍵の 1 成分になる。
//   ② 第273便b の k 走査器(`tests/exp-w273b-charonk.mjs`)が **272b と同一の測定**で走る
//      ことを構造的に保証する(コピーを持たない)。
//
// **測定の意味論は 1 つも変えていない**(窓・終了条件・保存量・検出器 A/B・近点の間引き規則は
// 第272便b の契約のまま)。`beta/index.html` は読むだけ・`S._core` には 1 命令も足していない。
//
// **唯一の追加**(第273便b・裁定 AH1): `make()` が分数 kFrame を書くとき
// `physics.kFrameApprox:"space-mesh-effective"` を宣言する。AH1 の二層契約で、現実較正クラスの
// 診断コピーに分数を書くには宣言が要るようになったためである(宣言が無いと `validatePreset` が
// 拒否して列そのものが走らない —— 第272便b の世代ではまだ門が無かった)。**この鍵は宣言専用で、
// エンジンのどの経路からも読まれない**。同値性は器が実測して JSON の `declarationInert` に書く。
//
// 使い方(器側): `await page.evaluate(installCharonPage, { ORB_MAX, PERI_WINDOW });`
// 設置後にページへ生える窓口(第272便b と同じ名前 —— 既存の器がそのまま動く):
//   `window.__w272.make(cfg)` / `.declaredState(id)` / `.chi(...)` / `.fLin(...)` / `.fQuad(...)` /
//   `.run(cfg, dt, maxSteps)`
export const CHARON_PAGE_VERSION = 'w273b-charonpage-1';

export function installCharonPage(W) {
  const ORB_MAX = W.ORB_MAX, PERI_WINDOW = W.PERI_WINDOW;
  window.__w272 = {};
  // 診断コピーを作る(内蔵は 1 bit も触らない)
  window.__w272.make = (cfg) => {
    const src = HP.allPresets().find((q) => q.id === 'plutoCharonReal');
    const p = JSON.parse(JSON.stringify(src));
    if (cfg.f !== undefined && cfg.f !== 1) for (const b of p.bodies) b.m = b.m * cfg.f;
    if (cfg.kFrame !== undefined) {
      p.physics.kFrame = cfg.kFrame;
      // 第273便b(裁定 AH1・**この 3 行だけが第272便b からの追加**): 分数 kFrame は
      // 現実較正クラス(❄️ は sampleClass:"calibration")では宣言鍵が必須になった
      // (QA `preset.kframe-calib-declared`)。診断コピーは原仮定者の仮説〔第62報〕
      // 「kFrame<1 は空間メッシュの影響の近似として許容する」をそのまま宣言する。
      // **宣言専用キーで、エンジンは 1 箇所も読まない**(同値性は器が実測して JSON に書く)。
      if (cfg.kFrame > 0 && cfg.kFrame < 1) p.physics.kFrameApprox = 'space-mesh-effective';
    }
    if (cfg.softening !== undefined) p.physics.softening = cfg.softening;
    if (cfg.geoPN !== undefined) p.physics.geoPN = cfg.geoPN;
    if (cfg.geoPN === 3) {
      // geoPN=3 は sampleClass:"calibration" では拒否される(現実較正にトイを混ぜない)。
      // **診断コピーを principle クラスへ落として**受理条件を満たす形にする
      p.sampleClass = 'principle'; p.fidelity = 'toy'; delete p.notClaim;
      p.physics.spaceMesh = { mode: 'vertex', gravity: false, inertia: false,
        lawVersion: cfg.lawVersion || 'scalar' };
      if (cfg.toyAllowDrag) p.physics.spaceMesh.toyAllowDrag = true;
    }
    return p;
  };
  window.__w272.declaredState = (id) => {
    const src = HP.allPresets().find((q) => q.id === id);
    if (!src) return null;
    const v = HP.validatePreset(JSON.parse(JSON.stringify(src)));
    if (!v.ok) return { id, error: v.errors };
    HP.sim.build(v.preset);
    const S = HP.sim;
    if (S.n < 2) return { id, error: 'n<2' };
    const ph = v.preset.physics;
    return { id, emoji: src.emoji, name: src.name, n: S.n,
      G: S.params.G, D0: S.params.D0, D0pull: S.params.D0pull, softening: S.params.softening,
      kFrame: S.params.kFrame, frameWeight: S.params.frameWeight, scaleExpT: (src.scaleExp || {}).T,
      mA: S.m[0], mB: S.m[1], xA: S.x[0], yA: S.y[0], xB: S.x[1], yB: S.y[1],
      vxA: S.vx[0], vyA: S.vy[0], vxB: S.vx[1], vyB: S.vy[1],
      omegaA: S.spin[0], omegaB: S.spin[1], declaredGeoPN: ph.geoPN };
  };
  window.__w272.chi = (mA, mB, a, D0, eps, p) => HP.dfmBinaryChi(mA, mB, a, D0, eps, p);
  window.__w272.fLin = (mA, mB, a, D0, eps, kF, p) => HP.dfmBinaryMassFactorLinear(mA, mB, a, D0, eps, kF, p);
  window.__w272.fQuad = (mA, mB, a, D0, eps, kF, p) => HP.dfmBinaryMassFactor(mA, mB, a, D0, eps, kF, p);

  // 本体: 1 走行で固定した保存量をすべて測る
  window.__w272.run = (cfg, dt, maxSteps) => {
    const p = window.__w272.make(cfg);
    const v = HP.validatePreset(p);
    if (!v.ok) return { error: 'validate', errors: v.errors, warnings: v.warnings };
    HP.sim.build(v.preset);
    const S = HP.sim;
    const G = S.params.G, eps = S.params.softening;
    const ci = 0, oi = 1;
    const mA = S.m[ci], mB = S.m[oi], MT = mA + mB;
    const cm0x = (mA * S.x[ci] + mB * S.x[oi]) / MT, cm0y = (mA * S.y[ci] + mB * S.y[oi]) / MT;
    const tot0 = S.totals();
    const eNewton = () => {
      const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci];
      const rr = Math.sqrt(dx * dx + dy * dy + eps * eps);
      let k = 0; for (let i = 0; i < S.n; i++) k += 0.5 * S.m[i] * (S.vx[i] * S.vx[i] + S.vy[i] * S.vy[i]);
      return k - G * mA * mB / rr;
    };
    const pAbs = () => { let s = 0; for (let i = 0; i < S.n; i++) s += S.m[i] * Math.hypot(S.vx[i], S.vy[i]); return s; };
    const e0 = eNewton(), pScale0 = pAbs();
    const osc0 = (() => {
      const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci];
      const dvx = S.vx[oi] - S.vx[ci], dvy = S.vy[oi] - S.vy[ci];
      const r = Math.hypot(dx, dy), v2 = dvx * dvx + dvy * dvy, mu = G * MT;
      const inv = 2 / r - v2 / mu, a = (inv !== 0) ? 1 / inv : NaN;
      const ex = (v2 * dx - (dx * dvx + dy * dvy) * dvx) / mu - dx / r;
      const ey = (v2 * dy - (dx * dvx + dy * dvy) * dvy) / mu - dy / r;
      return { r, a, e: Math.hypot(ex, ey), mu, P: (a > 0) ? 2 * Math.PI * Math.sqrt(a * a * a / mu) : NaN };
    })();

    let r2p = 0, r1p = 0, th2 = 0, th1 = 0, rd1 = 0;
    let rMin = Infinity, rMax = -Infinity, rMin1 = Infinity, rMax1 = -Infinity;
    const A = [], B = [], rev = [];
    let angAcc = 0, angPrev = Math.atan2(S.y[oi] - S.y[ci], S.x[oi] - S.x[ci]);
    let oscA = 0, oscP = 0, oscE = 0, oscN = 0, cmMax = 0;
    const sampleEvery = Math.max(1, Math.round(maxSteps / 2000));
    let k = 0, stop = 'steps', nan = false;
    for (; k < maxSteps; k++) {
      S.step(dt);
      const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci];
      const rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
      const dvx = S.vx[oi] - S.vx[ci], dvy = S.vy[oi] - S.vy[ci];
      const rd = (rr > 0) ? (dx * dvx + dy * dvy) / rr : 0;
      if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr;
      if (!rev.length) { if (rr < rMin1) rMin1 = rr; if (rr > rMax1) rMax1 = rr; }
      let d = th - angPrev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
      const prevAcc = angAcc; angAcc += d; angPrev = th;
      const nPrev = Math.floor(Math.abs(prevAcc) / (2 * Math.PI)), nNow = Math.floor(Math.abs(angAcc) / (2 * Math.PI));
      if (nNow > nPrev && rev.length < ORB_MAX + 2) {
        const target = Math.sign(angAcc) * nNow * 2 * Math.PI;
        const fr = (angAcc !== prevAcc) ? (target - prevAcc) / (angAcc - prevAcc) : 0;
        rev.push((k - 1 + fr) * dt);
      }
      if (k >= 1 && rd1 < 0 && rd >= 0 && A.length < ORB_MAX + 3) {
        const fr = (rd !== rd1) ? (-rd1 / (rd - rd1)) : 0;
        let a1 = th1, a2 = th; while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI; while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
        A.push({ ang: a1 + fr * (a2 - a1), k: k - 1 + fr, r: rr });
      }
      if (k >= 2 && r1p < r2p && r1p < rr && B.length < ORB_MAX + 3) {
        const dd = (r2p - 2 * r1p + rr), fr = (dd !== 0) ? 0.5 * (r2p - rr) / dd : 0;
        let a1 = th2, a2 = th1, a3 = th;
        while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI; while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
        while (a3 - a2 > Math.PI) a3 -= 2 * Math.PI; while (a3 - a2 < -Math.PI) a3 += 2 * Math.PI;
        B.push({ ang: a2 + 0.5 * fr * (a3 - a1) + 0.5 * fr * fr * (a3 - 2 * a2 + a1), k: k - 1 + fr, r: r1p });
      }
      r2p = r1p; r1p = rr; th2 = th1; th1 = th; rd1 = rd;
      if (k % sampleEvery === 0) {
        const v2 = dvx * dvx + dvy * dvy, mu = osc0.mu;
        const inv = 2 / rr - v2 / mu, a = (inv !== 0) ? 1 / inv : NaN;
        if (Number.isFinite(a) && a > 0) {
          const ex = (v2 * dx - (dx * dvx + dy * dvy) * dvx) / mu - dx / rr;
          const ey = (v2 * dy - (dx * dvx + dy * dvy) * dvy) / mu - dy / rr;
          oscA += a; oscP += 2 * Math.PI * Math.sqrt(a * a * a / mu); oscE += Math.hypot(ex, ey); oscN++;
        }
        const cx = (S.m[ci] * S.x[ci] + S.m[oi] * S.x[oi]) / MT, cy = (S.m[ci] * S.y[ci] + S.m[oi] * S.y[oi]) / MT;
        const cd = Math.hypot(cx - cm0x, cy - cm0y); if (cd > cmMax) cmMax = cd;
        if (S.hasNaN()) { nan = true; stop = 'nan'; break; }
      }
      if (rev.length >= ORB_MAX) { stop = 'orbMax'; break; }
    }
    const steps = k;
    const fit = (raw, pRef) => {
      const mid = 0.5 * (rMin + rMax);
      const peri = raw.filter((q) => q.r <= mid);
      const rej = { apo: raw.length - peri.length, dup: 0, jump: 0 };
      const keep = [];
      for (const q of peri) {
        if (keep.length && (q.k - keep[keep.length - 1].k) * dt < 0.5 * pRef) { rej.dup++; continue; }
        keep.push(q);
      }
      const use = keep, ang = [];
      for (let i = 0; i < use.length; i++) {
        let a = use[i].ang;
        if (i) { let z = a - ang[i - 1]; while (z > Math.PI) z -= 2 * Math.PI; while (z < -Math.PI) z += 2 * Math.PI;
          if (Math.abs(z) > Math.PI / 2) { rej.jump++; break; }
          a = ang[i - 1] + z; }
        ang.push(a);
      }
      const n = ang.length; let slope = null, resid = null;
      if (n >= 2) {
        const mx = (n - 1) / 2, my = ang.reduce((x, y) => x + y, 0) / n;
        let sxy = 0, sxx = 0;
        for (let i = 0; i < n; i++) { sxy += (i - mx) * (ang[i] - my); sxx += (i - mx) * (i - mx); }
        slope = sxy / sxx;
        resid = Math.sqrt(ang.reduce((s2, a2, i) => s2 + (a2 - (my + slope * (i - mx))) ** 2, 0) / n);
      }
      const win = use.slice(0, PERI_WINDOW), measured = (win.length >= PERI_WINDOW);
      return { nPeri: n, rej, slopeDeg: slope === null ? null : slope * 180 / Math.PI,
        residDeg: resid === null ? null : resid * 180 / Math.PI,
        perMean: measured ? (win[PERI_WINDOW - 1].k - win[0].k) * dt / (PERI_WINDOW - 1) : null,
        perFound: use.length, perWindow: PERI_WINDOW, perUnmeasured: !measured };
    };
    const pRef = Number.isFinite(osc0.P) ? osc0.P : (rev.length > 1 ? rev[1] - rev[0] : 1);
    const revP = []; for (let i = 0; i < rev.length; i++) revP.push(i ? rev[i] - rev[i - 1] : rev[0]);
    const tot1 = S.totals(), e1 = eNewton();
    const px = tot1.px - tot0.px, py = tot1.py - tot0.py;
    return {
      cfgApplied: { kFrame: S.params.kFrame, geoPN: S.params.geoPN, softening: S.params.softening,
        mA: S.m[ci], mB: S.m[oi], D0: S.params.D0, frameWeight: S.params.frameWeight,
        hasGeoToy: !!S.hasGeoToy, geoToyDeny: S.geoToyDeny || null, geoToyStop: S.geoToyStop || null,
        geoToyOverlay: S.geoToyOverlay || null },
      warnings: v.warnings, steps, stop, nan, dt,
      rev: revP.slice(0, 8), revN: revP.length,
      revMean: revP.length ? revP.reduce((x, y) => x + y, 0) / revP.length : null,
      A: fit(A, pRef), B: fit(B, pRef),
      rMin, rMax, rMin1, rMax1,
      eProxy: (rMax + rMin > 0) ? (rMax - rMin) / (rMax + rMin) : null,
      eProxy1: (rMax1 + rMin1 > 0 && rMax1 > 0) ? (rMax1 - rMin1) / (rMax1 + rMin1) : null,
      osc0, oscA: oscN ? oscA / oscN : null, oscP: oscN ? oscP / oscN : null, oscE: oscN ? oscE / oscN : null,
      ledger: {
        Lrel: (tot0.L !== 0) ? Math.abs(tot1.L - tot0.L) / Math.abs(tot0.L) : null,
        Pabs: Math.hypot(px, py), Prel: (pScale0 > 0) ? Math.hypot(px, py) / pScale0 : null,
        Erel: (e0 !== 0) ? Math.abs(e1 - e0) / Math.abs(e0) : null, E0: e0, E1: e1,
        cmMax, note: 'E6′/1PN は保存力ではない — 保存の主張ではなく列間比較のための同一定義の診断値' },
      clamp: { V: S.clampVN, S: S.clampSN, H: S.clampHN, A: S.clampAN, R: S.clampRN, T: S.clampTN }
    };
  };
}

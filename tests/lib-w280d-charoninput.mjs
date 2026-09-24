// 第280便d(原仮定者の裁定(第70報)「plutoCharonReal: 観測値版で問題が出ている理由を調査する/
//   plutoCharonDFM・plutoCharonKF0Control: まとめても良い。plutoCharonReal の精度を目標にする。
//   互いに潮汐ロックで引きずりが消えると、観測値版と変わらない想定」)—
// **❄️ の入力を整えた二体・同一定義の表・零条件の検査**に使う純関数と、ページ側の走行器。
//
// ■ ここにあるのは「出典の数の並置」「決定論的な換算」「走行器(測定コード)」だけである
//   ・**残差がゼロになる ε・a・GM・f を探索しない**(第276便b の禁止をそのまま継ぐ)。
//   ・Buie 2012 の a と PLU060 の GM を**混ぜた入力は候補にしない** —— 混ぜた行は「定義の混在」の
//     大きさを測るための対照としてだけ走らせる(列名に `mixed` を付ける)。
//   ・内蔵の ❄️⛄🌨️ の数は**読むだけ**で、1 bit も書き換えない。
import { GM_2024, ELEM_2024, BUIE_2012, HORIZONS_PR, G_MODEL, G_SI, PRECISE_UNITS, massFromGM }
  from './lib-w277b-charondfm.mjs';

export const CHARON_INPUT_VERSION = 'w280d-charoninput-1';

/** ❄️ plutoCharonReal の旧入力(NSSDC ファクトシートのアーカイブ版の転写 —— 内蔵の宣言の写し)。 */
export const OLD_INPUT = {
  source: 'plutoCharonReal の宣言(paper/data/solar-observations.csv・NSSDC アーカイブ版の転写)',
  aKm: 19596, ecc: 0, mPlutoKg: 1.303e22, mCharonKg: 1.586e21, G_SI: 6.674e-11,
  scale: { L: 6, T: 2, M: 25 }, softeningUnits: 0.05,
  note: '質量は出典表の値(GM ではない)・a は 1 km 刻みに丸めた値・G は 4 桁',
};

/** 比較の目標(判定行・暦の平均・接触要素 —— 3 つは別の量)。 */
export const TARGETS = {
  buie: { key: 'Buie 2012 二体 P(判定行 —— 本便では比較値)', periodSec: BUIE_2012.periodSec,
    sigmaSec: BUIE_2012.sigmaSec, aKm: BUIE_2012.aKm, aSigmaKm: BUIE_2012.aSigmaKm, source: BUIE_2012.source },
  plu060Mean: { key: 'PLU060 400 年平均 P', periodSec: ELEM_2024.Charon.periodSec, aKm: ELEM_2024.Charon.aKm,
    ecc: ELEM_2024.Charon.ecc, source: ELEM_2024.source },
  horizonsA: { key: 'Horizons osculating PR 元期 A', periodSec: HORIZONS_PR.epochA.periodSec, source: HORIZONS_PR.source },
};

/** GM[km³/s²] と a[km] からニュートン二体の周期 [s](ε=0・閉じた式 —— 走行ではない)。 */
export function keplerPeriodSec(gmKm3s2, aKm) {
  const a = aKm * 1e3, gm = gmKm3s2 * 1e9;
  return 2 * Math.PI * Math.sqrt(a * a * a / gm);
}
/** a[km] と P[s] から二体の GM[km³/s²](GM=4π²a³/P²)。 */
export function gmFromAP(aKm, periodSec) {
  const a = aKm * 1e3;
  return 4 * Math.PI * Math.PI * a * a * a / (periodSec * periodSec) / 1e9;
}

/**
 * **定義の混在の算術**(閉じた式 —— 走行ではない)。Buie の a と P が同じ解の中で含意する GM と、
 * PLU060 の GM の食い違いを、周期の秒と σ_Buie で書く。
 */
export function definitionMixAudit() {
  const gmPlu = GM_2024.Pluto.value + GM_2024.Charon.value;
  const gmPluSigma = Math.hypot(GM_2024.Pluto.sigma, GM_2024.Charon.sigma);
  const gmBuie = gmFromAP(BUIE_2012.aKm, BUIE_2012.periodSec);
  const gmBuieSigmaFromA = gmBuie * 3 * BUIE_2012.aSigmaKm / BUIE_2012.aKm;
  const pBuieAWithPluGM = keplerPeriodSec(gmPlu, BUIE_2012.aKm);
  const pPluAWithPluGM = keplerPeriodSec(gmPlu, ELEM_2024.Charon.aKm);
  const aBuieFromPluGM = Math.cbrt(gmPlu * 1e9 * BUIE_2012.periodSec * BUIE_2012.periodSec / (4 * Math.PI * Math.PI)) / 1e3;
  const oldGM = (OLD_INPUT.mPlutoKg + OLD_INPUT.mCharonKg) * OLD_INPUT.G_SI / 1e9;
  const s = BUIE_2012.sigmaSec, P0 = BUIE_2012.periodSec;
  return {
    gmPlu060: gmPlu, gmPlu060Sigma: gmPluSigma,
    gmBuieImplied: gmBuie, gmBuieImpliedSigmaFromA: gmBuieSigmaFromA,
    gmGapKm3s2: gmPlu - gmBuie, gmGapInPluSigma: (gmPlu - gmBuie) / gmPluSigma,
    gmOld: oldGM, gmOldMinusPlu: oldGM - gmPlu,
    aBuieKm: BUIE_2012.aKm, aPlu060MeanKm: ELEM_2024.Charon.aKm, aOldKm: OLD_INPUT.aKm,
    aBuieFromPluGMKm: aBuieFromPluGM, aGapKm: ELEM_2024.Charon.aKm - BUIE_2012.aKm,
    periods: {
      buieAWithPluGM: { sec: pBuieAWithPluGM, minusBuie: pBuieAWithPluGM - P0, sigma: (pBuieAWithPluGM - P0) / s,
        note: '**混ぜた入力**(Buie の a × PLU060 の GM)—— 候補ではない。定義の混在の大きさの物差し' },
      pluAWithPluGM: { sec: pPluAWithPluGM, minusBuie: pPluAWithPluGM - P0, sigma: (pPluAWithPluGM - P0) / s,
        minusPlu060Mean: pPluAWithPluGM - ELEM_2024.Charon.periodSec,
        note: '同じ解(Brozović & Jacobson 2024 の Table 8 GM と Table 10 の 400 年平均 a)の閉じた式' },
      oldInput: { sec: keplerPeriodSec(oldGM, OLD_INPUT.aKm), minusBuie: keplerPeriodSec(oldGM, OLD_INPUT.aKm) - P0,
        sigma: (keplerPeriodSec(oldGM, OLD_INPUT.aKm) - P0) / s,
        note: '❄️ の旧入力(a=19596 km・質量×G=6.674)の閉じた式(ε=0)' },
    },
  };
}

/**
 * 円軌道の二体を**重心系**へ置く(❄️ と同じ並び: 0=冥王星 −x・1=カロン +x、速度は ±y)。
 * speed: 'kepler'(ε=0 のケプラー速度 —— ❄️ の転写の規約)/'softened'(同じ軟化重力の円速度
 * Ω²=GM/(a²+ε²)^{3/2})/'kdk'(leapfrog KDK の離散相対平衡 v_t²=g a − g²dt²/4、g=GMa/(a²+ε²)^{3/2})。
 * 戻り値は preset の bodies の数値そのもの(サンプル単位)と、使った Ω。
 */
export function circularPair(o) {
  const G = o.G, mP = o.mP, mC = o.mC, a = o.a, eps = o.eps || 0, M = mP + mC;
  let vRel;
  const g = G * M * a / Math.pow(a * a + eps * eps, 1.5);
  if (o.speed === 'kepler') vRel = Math.sqrt(G * M / a);
  else if (o.speed === 'softened') vRel = Math.sqrt(g * a);
  else if (o.speed === 'kdk') vRel = Math.sqrt(g * a - g * g * o.dt * o.dt / 4);
  else throw new Error('speed は kepler / softened / kdk');
  const Om = vRel / a;
  const xP = -(mC / M) * a, xC = (mP / M) * a;
  return { Omega: Om, vRel, g,
    pluto: { x: xP, y: 0, vx: 0, vy: Om * xP }, charon: { x: xC, y: 0, vx: 0, vy: Om * xC } };
}

/** 精密単位(L=5・T=1・M=24)での GM → 質量(内蔵 G のまま割る —— ⛄🌨️ と同じ換算)。 */
export function precMassFromGM(gmKm3s2) { return massFromGM(gmKm3s2) / PRECISE_UNITS.kgPerUnit; }
/** Buie の a・P から作る二体の質量(質量比は 2024 の GM 比 —— ニュートン二体の相対周期には効かない)。 */
export function buieTwoBodyMasses() {
  const gm = gmFromAP(BUIE_2012.aKm, BUIE_2012.periodSec);
  const r = GM_2024.Charon.value / GM_2024.Pluto.value;
  return { gm, mP: precMassFromGM(gm / (1 + r)), mC: precMassFromGM(gm * r / (1 + r)) };
}

/** PLU060 400 年平均の同期自転(⛄🌨️ と同じ宣言 ω=2π/551855.8944 s・精密単位)。 */
export const OMEGA_PLU060_PREC = 2 * Math.PI / (ELEM_2024.Charon.periodSec / Math.pow(10, PRECISE_UNITS.T));

/**
 * **入力を整えた二体**(精密単位 L=5・T=1・M=24・ε は別に宣言)の bodies。❄️ と同じ規約
 * (重心系・円軌道・ε=0 のケプラー初速・0=冥王星 −x)で、入力の組だけを取り替える。
 *   'plu060Mean' … GM は Brozović & Jacobson 2024 Table 8・a は同 Table 10 の 400 年平均(**同じ解**)
 *   'buie'       … Buie 2012 の a と、Buie の a・P が含意する GM(質量比だけ 2024 の GM 比)
 *   'mixed'      … Buie の a × 2024 の GM(**定義の混在の物差し —— 候補ではない**)
 *   'oldA'       … ❄️ の a=19596 km × 2024 の GM(a の丸めだけを戻した対照)
 * 自転は ⛄🌨️ と同じ宣言(PLU060 400 年平均の同期)・半径も ⛄🌨️ と同じ。
 */
export function diagInputPair(kind) {
  let mP, mC, aKm;
  if (kind === 'plu060Mean' || kind === 'mixed' || kind === 'oldA') {
    mP = precMassFromGM(GM_2024.Pluto.value); mC = precMassFromGM(GM_2024.Charon.value);
    aKm = (kind === 'plu060Mean') ? ELEM_2024.Charon.aKm : (kind === 'mixed' ? BUIE_2012.aKm : OLD_INPUT.aKm);
  } else if (kind === 'buie') {
    const b = buieTwoBodyMasses(); mP = b.mP; mC = b.mC; aKm = BUIE_2012.aKm;
  } else throw new Error('kind は plu060Mean / buie / mixed / oldA');
  const a = aKm / PRECISE_UNITS.kmPerUnit;
  const cp = circularPair({ G: G_MODEL, mP, mC, a, speed: 'kepler' });
  return { kind, aKm, a, mP, mC, Omega: cp.Omega,
    bodies: [
      { m: mP, radius: 11.88, x: cp.pluto.x, y: 0, vx: 0, vy: cp.pluto.vy, spin: OMEGA_PLU060_PREC },
      { m: mC, radius: 6.06, x: cp.charon.x, y: 0, vx: 0, vy: cp.charon.vy, spin: OMEGA_PLU060_PREC }] };
}

/**
 * **厳密同期円**(零試験)の bodies。⛄ と同じ質量・同じ離角(元期 A の |r|)で、
 * 速度は leapfrog KDK の離散相対平衡(刻み dt・軟化 ε の重力で 1 步ごとに同じ半径へ戻る接線速度)、
 * 自転は両体とも v_t/a(**相対すべり s=v−ω×r が 0 になる瞬間同期**)。
 */
export function syncZeroPair(o) {
  const cp = circularPair({ G: G_MODEL, mP: o.mP, mC: o.mC, a: o.a, eps: o.eps, speed: o.speed || 'kdk', dt: o.dt });
  return { Omega: cp.Omega, vRel: cp.vRel, a: o.a, dt: o.dt, eps: o.eps, speed: o.speed || 'kdk',
    bodies: [
      { m: o.mP, radius: 11.88, x: cp.pluto.x, y: 0, vx: 0, vy: cp.pluto.vy, spin: cp.Omega },
      { m: o.mC, radius: 6.06, x: cp.charon.x, y: 0, vx: 0, vy: cp.charon.vy, spin: cp.Omega }] };
}

/** ❄️ の単位(L=6・T=2・M=25)で、入力(a[km]・質量[kg] か GM[km³/s²]・G_sim)から円軌道の二体を組む。 */
export function oldUnitsPair(o) {
  const sc = OLD_INPUT.scale, G = o.G === undefined ? 6.674 : o.G;
  // 質量は ① GM[km³/s²] から(G_sim で割る)② サンプル単位の値そのもの(内蔵の宣言の数)の 2 通り
  const mP = (o.gmP !== undefined) ? o.gmP * 1e9 * Math.pow(10, 2 * sc.T - 3 * sc.L) / G : o.mP;
  const mC = (o.gmC !== undefined) ? o.gmC * 1e9 * Math.pow(10, 2 * sc.T - 3 * sc.L) / G : o.mC;
  const a = o.aKm * 1e3 / Math.pow(10, sc.L);
  const M = mP + mC, vRel = Math.sqrt(G * M / a);
  // ❄️ の宣言と同じ作り方(相対ケプラー速度を質量比で配分)
  return { G, mP, mC, a, bodies: [
    { m: mP, x: -(mC / M) * a, y: 0, vx: 0, vy: -vRel * (mC / M) },
    { m: mC, x: (mP / M) * a, y: 0, vx: 0, vy: vRel * (mP / M) }] };
}

/** 円軌道の角運動量の帳簿から周期の変化を見積もる(ΔP/P = 3 ΔL_orb/L_orb —— 閉じた式)。 */
export function periodShiftFromSpinTransfer(o) {
  const dLspin = o.IP * o.dOmegaP + o.IC * o.dOmegaC;
  const dLorb = -dLspin;
  return { dLspin, dLorb, rel: 3 * dLorb / o.Lorb, dPsec: 3 * dLorb / o.Lorb * o.Psec };
}

/**
 * **ページ側の走行器**(`page.evaluate(installW280dPage)` で設置する)。測定コードは 2 通りを同じ走行で並べる:
 *   (A) **正式の抽出器**(`tests/lib-w273b-charonpage.mjs` の `run` と同じ足し込み・周の時刻 (k−1+fr)·dt)
 *   (B) 第278便b の位相の直接判定(初期方向に対する φ の負→非負・周の時刻 (k+fr)·dt)
 * 周期は隣り合う周の時刻の差なので、第 2 周以降は (A)(B) の時刻の原点のずれは消える。
 */
export function installW280dPage() {
  const W = window.__w280d = {};
  const P = (id) => HP.allPresets().find((q) => q.id === id);
  W.make = (cfg) => {
    const src = P(cfg.id || 'plutoCharonReal');
    if (!src) return null;
    const p = JSON.parse(JSON.stringify(src));
    if (cfg.diag) { p.sampleClass = 'principle'; p.fidelity = 'toy'; delete p.notClaim; delete p.claims; }
    const ph = p.physics;
    if (cfg.kFrame !== undefined) ph.kFrame = cfg.kFrame;
    if (cfg.G !== undefined) ph.G = cfg.G;
    if (cfg.softening !== undefined) ph.softening = cfg.softening;
    if (cfg.softeningFloor !== undefined) ph.softeningFloor = cfg.softeningFloor;
    if (cfg.massFloor !== undefined) ph.massFloor = cfg.massFloor;
    if (cfg.geoPN !== undefined) ph.geoPN = cfg.geoPN;
    if (cfg.massPrecision !== undefined) { if (cfg.massPrecision === null) delete ph.massPrecision; else ph.massPrecision = cfg.massPrecision; }
    if (cfg.integrator !== undefined) p.integrator = cfg.integrator;
    if (cfg.relativeDrag !== undefined) { if (cfg.relativeDrag === null) delete ph.relativeDrag; else ph.relativeDrag = cfg.relativeDrag; }
    if (cfg.meshVelocity !== undefined) { if (cfg.meshVelocity === null) delete ph.meshVelocity; else ph.meshVelocity = cfg.meshVelocity; }
    if (cfg.units) {
      const sp = cfg.units;
      for (const k in sp.phys) if (typeof ph[k] === 'number') ph[k] = ph[k] * sp.phys[k];
      for (const b of p.bodies) for (const k in sp.body) if (typeof b[k] === 'number') b[k] = b[k] * sp.body[k];
      p.scaleExp = { L: sp.to.L, T: sp.to.T, M: sp.to.M };
      if (cfg.softeningAfterUnits !== undefined) ph.softening = cfg.softeningAfterUnits;
    }
    if (cfg.bodies) for (let i = 0; i < cfg.bodies.length; i++) {
      if (i < p.bodies.length) Object.assign(p.bodies[i], cfg.bodies[i]);
      else p.bodies.push(Object.assign({ type: 'single', pinned: false }, cfg.bodies[i]));
    }
    if (cfg.shiftPair) { const s = cfg.shiftPair;
      for (let i = 0; i < 2; i++) { p.bodies[i].x += s.dx || 0; p.bodies[i].y += s.dy || 0;
        p.bodies[i].vx += s.dvx || 0; p.bodies[i].vy += s.dvy || 0; } }
    return p;
  };
  W.state = (cfg) => {
    const p = W.make(cfg); if (!p) return { error: 'no-preset' };
    const v = HP.validatePreset(p);
    if (!v.ok) return { error: 'validate', errors: v.errors };
    HP.sim.build(v.preset);
    const S = HP.sim;
    const o = { n: S.n, G: S.params.G, eps: S.params.softening, kFrame: S.params.kFrame, geoPN: S.params.geoPN,
      integ: S.integrator, mF64: S.m instanceof Float64Array, spF64: S.spin instanceof Float64Array,
      hasRD: !!S.hasRelativeDrag, hasMV: !!S.hasMeshVelocity, mvDeny: S.meshVelDeny || null,
      m: Array.from(S.m), x: Array.from(S.x), y: Array.from(S.y), vx: Array.from(S.vx), vy: Array.from(S.vy),
      spin: Array.from(S.spin), R: Array.from(S.R), warnings: v.warnings };
    return o;
  };
  // 本体。orbMax 周まで(または maxSteps で打ち切り)。周ごとに帳簿を記帳する
  W.run = (cfg, dt, orbMax, opt) => {
    const O = opt || {};
    const p = W.make(cfg); if (!p) return { error: 'no-preset' };
    const v = HP.validatePreset(p);
    if (!v.ok) return { error: 'validate', errors: v.errors };
    HP.sim.build(v.preset);
    const S = HP.sim, ci = 0, oi = 1;
    const G = S.params.G, eps = S.params.softening;
    const SEC = Math.pow(10, (p.scaleExp || {}).T || 0);
    const mA = S.m[ci], mB = S.m[oi], MT = mA + mB;
    const osc = () => { const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci];
      const dvx = S.vx[oi] - S.vx[ci], dvy = S.vy[oi] - S.vy[ci];
      const r = Math.hypot(dx, dy), v2 = dvx * dvx + dvy * dvy, mu = G * MT;
      const inv = 2 / r - v2 / mu, a = (inv !== 0) ? 1 / inv : NaN;
      const ex = (v2 * dx - (dx * dvx + dy * dvy) * dvx) / mu - dx / r;
      const ey = (v2 * dy - (dx * dvx + dy * dvy) * dvy) / mu - dy / r;
      return { r, a, e: Math.hypot(ex, ey), vr: (dx * dvx + dy * dvy) / r, vt: (dx * dvy - dy * dvx) / r }; };
    const slip = () => { const rx = S.x[oi] - S.x[ci], ry = S.y[oi] - S.y[ci];
      const vx = S.vx[oi] - S.vx[ci], vy = S.vy[oi] - S.vy[ci];
      const wi = S.spin[ci], wj = S.spin[oi];
      return [Math.hypot(vx + wi * ry, vy - wi * rx), Math.hypot(vx + wj * ry, vy - wj * rx)]; };
    const led = () => { const t = S.totals();
      return { px: t.px + (S.resPx || 0), py: t.py + (S.resPy || 0), L: t.L + (S.resL || 0) + (S.radL || 0) }; };
    const eN = () => { const E = S.energies(); const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci];
      return E.kin + E.rot - G * mA * mB / Math.sqrt(dx * dx + dy * dy + eps * eps); };
    const tot0 = led(), e0 = eN();
    let pAbs = 0; for (let i = 0; i < S.n; i++) pAbs += S.m[i] * Math.hypot(S.vx[i], S.vy[i]);
    const osc0 = osc(), slip0 = slip(), spin0 = [S.spin[ci], S.spin[oi]];
    const Pguess = Number.isFinite(osc0.a) && osc0.a > 0 ? 2 * Math.PI * Math.sqrt(osc0.a * osc0.a * osc0.a / (G * MT)) : 1e9;
    const maxSteps = O.maxSteps || Math.ceil((orbMax + 0.3) * Pguess / dt);
    // (A) 足し込み
    let angAcc = 0, angPrev = Math.atan2(S.y[oi] - S.y[ci], S.x[oi] - S.x[ci]); const revA = [];
    // (B) 位相
    const r0x = S.x[oi] - S.x[ci], r0y = S.y[oi] - S.y[ci];
    const hSign = Math.sign(r0x * (S.vy[oi] - S.vy[ci]) - r0y * (S.vx[oi] - S.vx[ci])) || 1;
    let phPrev = 0; const revB = [], revInfo = [];
    // 零条件の検査: 步ごとに状態のビットが変わったかは器の側(対の走行)で見る。ここでは量の最大
    let kickSeen = 0, heatNonZeroSteps = 0, heatPrev = S.relDragHeat || 0;
    let k = 0, stop = 'steps', err = null, slipMaxRev = 0;
    const trace = O.traceEvery ? [] : null;
    try {
      for (; k < maxSteps; k++) {
        S.step(dt);
        const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci];
        if (!Number.isFinite(dx + dy)) { stop = 'nan'; break; }
        const th = Math.atan2(dy, dx);
        let d = th - angPrev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
        const prevAcc = angAcc; angAcc += d; angPrev = th;
        const nPrev = Math.floor(Math.abs(prevAcc) / (2 * Math.PI)), nNow = Math.floor(Math.abs(angAcc) / (2 * Math.PI));
        if (nNow > nPrev) { const target = Math.sign(angAcc) * nNow * 2 * Math.PI;
          const fr = (angAcc !== prevAcc) ? (target - prevAcc) / (angAcc - prevAcc) : 0;
          revA.push((k - 1 + fr) * dt); }
        const ph = hSign * Math.atan2(r0x * dy - r0y * dx, r0x * dx + r0y * dy);
        const prevPh = phPrev; phPrev = ph;
        if (S.hasRelativeDrag) { const h = S.relDragHeat || 0; if (h !== heatPrev) { heatNonZeroSteps++; heatPrev = h; } }
        if ((k & 63) === 0) { const sl = slip(); const m = Math.max(sl[0], sl[1]); if (m > slipMaxRev) slipMaxRev = m; }
        if (trace && (k % O.traceEvery) === 0) { const q = osc(); trace.push([k, q.r, q.e, q.vr]); }
        if (prevPh < 0 && ph >= 0) {
          const fr = (ph !== prevPh) ? (0 - prevPh) / (ph - prevPh) : 0;
          revB.push((k + fr) * dt);
          const q = osc(), L = led();
          revInfo.push({ spin: [S.spin[ci], S.spin[oi]], heat: S.relDragHeat || 0, pos: S.relDragPos || 0,
            slip: slip(), slipMaxInRev: slipMaxRev, a: q.a, e: q.e, vr: q.vr,
            Lrel: Math.abs(L.L - tot0.L) / Math.abs(tot0.L), Prel: Math.hypot(L.px - tot0.px, L.py - tot0.py) / pAbs,
            EplusHeatRel: (eN() + (S.relDragHeat || 0) - e0) / Math.abs(e0),
            kickMax: S.relDragKickMax || 0, torqueMax: S.relDragTorqueMax || 0,
            meshVelWork: S.meshVelWork || 0, meshVelUMax: S.meshVelUMax || 0 });
          slipMaxRev = 0;
          if (revB.length >= orbMax) { stop = 'orbMax'; k++; break; }
        }
      }
    } catch (e) { err = String(e); stop = 'error'; }
    const per = (arr) => arr.map((t, i) => (i ? t - arr[i - 1] : t) * SEC);
    const fin = []; for (let i = 0; i < S.n; i++) fin.push(S.x[i], S.y[i], S.vx[i], S.vy[i], S.spin[i]);
    return { cfgId: cfg.id || 'plutoCharonReal', dt, steps: k, stop, err, secPerUnit: SEC,
      applied: { G, eps, kFrame: S.params.kFrame, geoPN: S.params.geoPN, integ: S.integrator,
        mF64: S.m instanceof Float64Array, spF64: S.spin instanceof Float64Array, hasRD: !!S.hasRelativeDrag,
        integration: S.relDrag ? (S.relDrag.integration || 'explicit') : null, hasMV: !!S.hasMeshVelocity,
        mvDeny: S.meshVelDeny || null, n: S.n, m: Array.from(S.m) },
      warnings: v.warnings, osc0, slip0, spin0,
      periodsA: per(revA), periodsB: per(revB), revInfo,
      relDrag: { heat: S.relDragHeat || 0, pos: S.relDragPos || 0, kickMax: S.relDragKickMax || 0,
        torqueMax: S.relDragTorqueMax || 0, slipMax: S.relDragSlipMax || 0, n: S.relDragN || 0, heatNonZeroSteps },
      meshVel: { n: S.meshVelN || 0, undef: S.meshVelUndef || 0, bad: S.meshVelBad || 0, uMax: S.meshVelUMax || 0,
        kickMax: S.meshVelKickMax || 0, work: S.meshVelWork || 0, chiMin: S.meshVelChiMin, chiMax: S.meshVelChiMax },
      finalState: fin, finalStateHex: fin.map((z) => { const b = new DataView(new ArrayBuffer(8)); b.setFloat64(0, z);
        return b.getBigUint64(0).toString(16); }).join(','), trace,
      clamp: [S.clampVN, S.clampSN, S.clampHN, S.clampAN, S.clampRN, S.clampTN] };
  };
  // 1 步の零条件(読み口 relativeDragProbe と步の前後の状態)
  W.oneStep = (cfg, dt) => {
    const p = W.make(cfg); const v = HP.validatePreset(p);
    if (!v.ok) return { error: v.errors };
    HP.sim.build(v.preset); const S = HP.sim;
    const pr = HP.relativeDragProbe ? HP.relativeDragProbe(S, 0, 1, dt) : null;
    const before = [S.x[0], S.y[0], S.vx[0], S.vy[0], S.spin[0], S.x[1], S.y[1], S.vx[1], S.vy[1], S.spin[1]];
    const r = HP.dfmRelativeDragStep(S, dt);
    const after = [S.x[0], S.y[0], S.vx[0], S.vy[0], S.spin[0], S.x[1], S.y[1], S.vx[1], S.vy[1], S.spin[1]];
    return { probe: pr ? { slipI: pr.slipI, slipJ: pr.slipJ, kickMag: pr.kickMag, torqueI: pr.torqueI, torqueJ: pr.torqueJ, dE: pr.dE } : null,
      step: r ? { dE: r.dE, kickMax: r.kickMax, torqueMax: r.torqueMax, slipMax: r.slipMax } : null,
      heat: S.relDragHeat, stateBitSame: before.every((z, i) => Object.is(z, after[i])) };
  };
}

export default { CHARON_INPUT_VERSION, OLD_INPUT, TARGETS, keplerPeriodSec, gmFromAP, definitionMixAudit,
  circularPair, precMassFromGM, buieTwoBodyMasses, periodShiftFromSpinTransfer, installW280dPage,
  G_MODEL, G_SI };

// 第253便a W1「空間メッシュ ―― 粒子を頂点とする動くメッシュの観測写像」(第45報)。
//
// 原仮定者(第45報・全文は docs/PHYSICS.md 〔第253便a〕に引用):
//   「『もしも宇宙に天体が1つしか無かったら』、天体の移動と回転は即時、空間メッシュに反映される。
//    その為、天体上の観測者からは認知出来ない/『もしも宇宙に天体が2つしかなかったら。その2つしか
//    ない天体が同じ質量だったら』、どれだけ天体同士が動いても、空間メッシュの天体同士を結ぶ線と
//    中間地点は一意に決まる/つまり、『背景決定力 D₀』が無視出来る程小さい時は、配置された粒子が
//    空間メッシュの頂点となり、粒子の動きに連動して空間メッシュが変形して動く/この仕組みは現状の
//    アプリに実装されていないが、必須である」。
//
// 本ハーネスが測るのは **観測写像** だけである ―― 「慣性系で測った量」と「メッシュ座標 q で測った量」を
// **2 欄に分けて並べる**。目的は 3 審査 v11 の一致点を数値で守ること:
//   ・「公転が消える」は **座標の話** として測る(q が凍ることを示す)。
//   ・**力の話としては閉じる**(座標を変えても加速度・近点間周期は残る ―― 同じ表の左欄に数字で出す)。
//   ・**メッシュ座標で線分長が固定されても物理的分離は固定されない** ―― 物理距離は計量 g=FᵀF で復元し、
//     慣性系の |r| とビット一致するかを毎サンプル確かめる。
//
// **エンジンの物理は 1 bit も書き換えない**(preset の宣言だけを差し替える。メッシュは読み取り専用の
// 純関数 HP.dfmSpaceMeshCapture / dfmSpaceMeshState / dfmSpaceMeshAt だけを叩く)。
//
// ■ 節
//   BOX  : 🫂 boxBinaryToy(q=1・D0pull 3 段 1e−6/1/1e3)。静止・共通並進 V の 2 通り。
//   NS   : ⚡ psrDoubleABDFM(q=0.933)・🧶 psrB1534DFM(q=1.009)の実系 NS 連星。同じ表。
//   T1   : 単独天体(n=1・剛体)の並進と回転 ―― 「天体上の観測者からは認知出来ない」の数値。
//
// 実行: node tests/exp-w253a-spacemesh.mjs [--box] [--ns] [--t1] [--dt 0.004] [--fast]
// 出力: tests/out/spacemesh-w253.json(.gitignore 既定どおり未コミット ―― 数値は PHYSICS に全載)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'spacemesh-w253.json');
const argv = process.argv.slice(2);
const FAST = argv.includes('--fast');
const DT = (() => { const i = argv.indexOf('--dt'); return (i >= 0 && argv[i + 1]) ? Number(argv[i + 1]) : 0.004; })();
const NPERI = FAST ? 4 : 6;
const only = argv.filter((a) => a.startsWith('--') && a !== '--fast' && a !== '--dt').map((a) => a.slice(2));
const want = (k) => !only.length || only.includes(k);

let browser;
try { const { chromium } = await import('playwright'); browser = await chromium.launch(); }
catch {
  const { chromium } = await import('playwright');
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
}
const pg = await browser.newPage();
const pageErrors = [];
pg.on('pageerror', (e) => pageErrors.push(String(e)));
await pg.goto(INDEX, { waitUntil: 'load' });
await pg.waitForFunction(() => window.HP && HP.sim);

const out = { target: TARGET, node: process.version, at: new Date().toISOString(), wave: '253a', dt: DT, nPeri: NPERI, fast: FAST };

// ---------------------------------------------------------------- ページ側の共通ライブラリ
await pg.evaluate(() => {
  const W = (window.__w253 = {});
  W.YR = 365.25 * 86400;
  W.SYS = {
    psrDoubleABDFM: { label: '⚡ J0737−3039A/B (DFM)', PobsS: 8834.534723278, omegaDot: 16.899323, eObs: 0.087777036, Tunit: 10 },
    psrB1534DFM: { label: '🧶 B1534+12 (DFM)', PobsS: 36351.7026, omegaDot: 1.755789, eObs: 0.2736775, Tunit: 10 },
  };
  // ---- 走行 1 本。慣性系の量とメッシュ座標の量を**同じサンプル点**で採る
  //      pd: 検証済みプリセット相当のオブジェクト・boost: 両粒子へ足す共通速度(背景に対する並進)
  W.run = (pd, dt, tEnd, NP, pRef, boost) => {
    const p2 = JSON.parse(JSON.stringify(pd));
    if (boost) for (const b of p2.bodies) b.vx += boost;
    const v = HP.validatePreset(p2);
    const S = HP.sim; S.build(v.preset);
    // ---- メッシュを捕捉(参照配置 = t=0 の配置)
    const anchor = HP.dfmSpaceMeshCapture(S, [0, 1]);
    if (!anchor) return { err: 'capture failed' };
    const m0 = S.m[0], m1 = S.m[1], Ms = m0 + m1;
    const cmOf = () => [(m0 * S.x[0] + m1 * S.x[1]) / Ms, (m0 * S.y[0] + m1 * S.y[1]) / Ms];
    const vcmOf = () => [(m0 * S.vx[0] + m1 * S.vx[1]) / Ms, (m0 * S.vy[0] + m1 * S.vy[1]) / Ms];
    const cm0 = cmOf(), vcm0 = vcmOf(), t00 = S.t;
    const steps = Math.round(tEnd / dt), STRIDE = 64;
    // 近点検出(検出器 A: ṙ の −→+ 交差。第246便b→第252便a と同一手続き)
    const A = [];
    let rd1 = 0, t1 = 0, rMin = Infinity, rMax = -Infinity, cmDev = 0, cmMax = 0;
    // メッシュ側の集計
    let qDev = 0, qDevRel = 0, distRelMax = 0, distBitN = 0, distN = 0;
    let chiMin = Infinity, chiMax = -Infinity, detMin = Infinity, detMax = -Infinity;
    let divMin = Infinity, divMax = -Infinity, uMeshErr = 0, meshNull = 0;
    let accMax = 0, accMin = Infinity, relSpMin = Infinity, relSpMax = -Infinity;
    let modeSet = {}, uniqueTrue = 0, uniqueN = 0;
    let prevW = null, prevT = null;
    const ref = anchor.ref, refLen = anchor.refRLen;
    for (let k = 0; k < steps; k++) {
      S.step(dt);
      const dx = S.x[1] - S.x[0], dy = S.y[1] - S.y[0];
      const rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
      const dvx = S.vx[1] - S.vx[0], dvy = S.vy[1] - S.vy[0];
      const rd = (dx * dvx + dy * dvy) / rr;
      if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr;
      if (k >= 1 && rd1 < 0 && rd >= 0) {
        const fr = (rd !== rd1) ? (-rd1 / (rd - rd1)) : 0;
        let a1 = t1, a2 = th; while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI; while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
        A.push({ ang: a1 + fr * (a2 - a1), k: k - 1 + fr, r: rr });
      }
      t1 = th; rd1 = rd;
      if ((k % STRIDE) === (STRIDE - 1)) {
        const c = cmOf(), dtEl = S.t - t00;
        const d = Math.hypot(c[0] - cm0[0], c[1] - cm0[1]); if (d > cmMax) cmMax = d;
        const dv = Math.hypot(c[0] - (cm0[0] + vcm0[0] * dtEl), c[1] - (cm0[1] + vcm0[1] * dtEl)); if (dv > cmDev) cmDev = dv;
        // ---- 相対加速度(サンプル刻みの差分。**座標を変えても残る量**)
        const sp = Math.hypot(dvx, dvy);
        if (sp < relSpMin) relSpMin = sp; if (sp > relSpMax) relSpMax = sp;
        if (prevW !== null) {
          const dtS = S.t - prevT;
          const aa = Math.hypot((dvx - prevW[0]) / dtS, (dvy - prevW[1]) / dtS);
          if (aa > accMax) accMax = aa; if (aa < accMin) accMin = aa;
        }
        prevW = [dvx, dvy]; prevT = S.t;
        // ---- メッシュ座標
        const M = HP.dfmSpaceMeshState(anchor, S);
        if (!M) { meshNull++; continue; }
        modeSet[M.mode] = (modeSet[M.mode] || 0) + 1;
        uniqueN++; if (M.unique) uniqueTrue++;
        if (M.chi < chiMin) chiMin = M.chi; if (M.chi > chiMax) chiMax = M.chi;
        if (M.detF < detMin) detMin = M.detF; if (M.detF > detMax) detMax = M.detF;
        if (M.divU < divMin) divMin = M.divU; if (M.divU > divMax) divMax = M.divU;
        const z0 = HP.dfmSpaceMeshAt(M, S.x[0], S.y[0]), z1 = HP.dfmSpaceMeshAt(M, S.x[1], S.y[1]);
        const e0 = Math.hypot(z0.qx - ref[0][0], z0.qy - ref[0][1]);
        const e1 = Math.hypot(z1.qx - ref[1][0], z1.qy - ref[1][1]);
        const e = Math.max(e0, e1); if (e > qDev) qDev = e;
        if (e / refLen > qDevRel) qDevRel = e / refLen;
        // 頂点契約 u(xᵢ)=vᵢ の残差
        const ue = Math.max(Math.abs(z0.uMeshX - S.vx[0]), Math.abs(z0.uMeshY - S.vy[0]),
          Math.abs(z1.uMeshX - S.vx[1]), Math.abs(z1.uMeshY - S.vy[1]));
        if (ue > uMeshErr) uMeshErr = ue;
        // ---- 計量 g=FᵀF で復元した物理距離 vs 慣性系の |r|
        const dqx = ref[1][0] - ref[0][0], dqy = ref[1][1] - ref[0][1], g = M.metric;
        const dg = Math.sqrt(dqx * (g[0] * dqx + g[1] * dqy) + dqy * (g[2] * dqx + g[3] * dqy));
        distN++; if (Object.is(dg, rr)) distBitN++;
        const dr = Math.abs(dg / rr - 1); if (dr > distRelMax) distRelMax = dr;
      }
    }
    const cmEnd = cmOf();
    // ---- 近点の位相 fit(第252便a と同型)
    const mid = 0.5 * (rMin + rMax);
    const peri = A.filter((z) => z.r < mid), keep = [];
    for (const z of peri) { if (keep.length && (z.k - keep[keep.length - 1].k) * dt < 0.5 * pRef) continue; keep.push(z); }
    const use = keep.slice(0, NP), ang = [];
    for (let i = 0; i < use.length; i++) {
      let a = use[i].ang;
      if (i) { let z = a - ang[i - 1]; while (z > Math.PI) z -= 2 * Math.PI; while (z < -Math.PI) z += 2 * Math.PI;
        if (Math.abs(z) > Math.PI / 2) break; a = ang[i - 1] + z; }
      ang.push(a);
    }
    let slope = null;
    if (ang.length >= 2) {
      const nA = ang.length, mx = (nA - 1) / 2, my = ang.reduce((a, b) => a + b, 0) / nA;
      let sxy = 0, sxx = 0;
      for (let i = 0; i < nA; i++) { sxy += (i - mx) * (ang[i] - my); sxx += (i - mx) * (i - mx); }
      slope = sxy / sxx;
    }
    const per = []; for (let i = 1; i < use.length; i++) per.push((use[i].k - use[i - 1].k) * dt);
    const perMean = per.length ? per.reduce((a, b) => a + b, 0) / per.length : null;
    const M0 = HP.dfmSpaceMeshState(anchor, S);
    return {
      // ---- 慣性系で測った量(**消えない物理量**)
      inertial: { nPeri: ang.length, periodPeri: perMean, advDeg: slope === null ? null : slope * 180 / Math.PI,
        rMin, rMax, eProxy: (rMax - rMin) / (rMax + rMin),
        cmWalk: Math.hypot(cmEnd[0] - cm0[0], cmEnd[1] - cm0[1]), cmMax, cmDev,
        relSpeedMin: relSpMin, relSpeedMax: relSpMax, accRelMin: accMin, accRelMax: accMax,
        nan: S.hasNaN(), clamp: S.clampVN + S.clampSN + S.clampRN + S.clampTN + S.clampAN },
      // ---- メッシュ座標 q で測った量(**消える表示量**)
      mesh: { kind: M0 ? M0.kind : null, refRLen: refLen,
        qDevMax: qDev, qDevRelMax: qDevRel, uVertexErrMax: uMeshErr,
        chiMin, chiMax, detFmin: detMin, detFmax: detMax, divUmin: divMin, divUmax: divMax,
        modes: modeSet, uniqueFrac: uniqueN ? uniqueTrue / uniqueN : null, samples: uniqueN,
        // 計量で復元した物理距離が慣性系の |r| と一致するか
        distFromMetricRelMax: distRelMax, distBitFrac: distN ? distBitN / distN : null,
        distSamples: distN, meshNull },
      boost: boost || 0,
    };
  };
  // ---- 🫂 相当の合成 2 体(プリセットに依存しない器)。第252便a §BOX と同じ規約
  W.mkBox = (q, D0pull) => {
    const G = 0.60066, c = 30, e = 0.3, sepA = 200, eps = 0.05;
    const m1 = 1000 / (1 + q), m2 = 1000 * q / (1 + q), M = m1 + m2;
    const a = sepA / (1 + e), muN = G * M;
    const vA = Math.sqrt(muN * (1 - e) / (a * (1 + e)));
    return { pd: { name: 'w253 mesh box', description: 'space mesh probe', emoji: '🕸',
        camera: { scale: 130 }, world: { boundary: 'none', size: 0 },
        physics: { G, D0: 0.006, kFrame: 1, q: 3, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, kappaT: 0.0006674,
          cLight: c, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
          geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: eps, timeScale: 60, dispMag: 3,
          stateCarry: 'double', framePrecision: 'double', frameReaction: 'pairReduced',
          frameWeight: 'pull', D0pull },
        bodies: [
          { type: 'single', m: m1, radius: 1, x: -sepA * m2 / M, y: 0, vx: 0, vy: -vA * m2 / M, spin: 0, pinned: false, pnSource: true },
          { type: 'single', m: m2, radius: 1, x: sepA * m1 / M, y: 0, vx: 0, vy: vA * m1 / M, spin: 0, pinned: false },
        ],
        overlays: { rotationCurve: false, tempHistogram: false, field: false, trail: true } },
      meta: { m1, m2, M, a, e, sepA, muN, eps, vRel: vA, Pkep: 2 * Math.PI * Math.sqrt(a * a * a / muN) } };
  };
});

const fmt = (z, d = 6) => (z === null || z === undefined) ? '—' : (typeof z === 'number' ? z.toFixed(d) : String(z));
const ex3 = (z) => (z === null || z === undefined) ? '—' : z.toExponential(3);

// ============================================================ BOX: 🫂(q=1・D0pull 3 段)
if (want('box')) {
  const r = await pg.evaluate(([dt, NP]) => {
    const W = window.__w253, rows = [];
    for (const D0pull of [1e-6, 1, 1e3]) {
      const z = W.mkBox(1, D0pull), meta = z.meta;
      const still = W.run(z.pd, dt, (NP + 0.6) * meta.Pkep, NP, meta.Pkep, 0);
      const moved = W.run(z.pd, dt, (NP + 0.6) * meta.Pkep, NP, meta.Pkep, 2 * meta.vRel);
      rows.push({ q: 1, D0pull, meta, still, moved,
        dPeriodPct: (still.inertial.periodPeri && moved.inertial.periodPeri)
          ? 100 * (moved.inertial.periodPeri / still.inertial.periodPeri - 1) : null,
        qDevSame: Object.is(still.mesh.qDevRelMax, moved.mesh.qDevRelMax),
        distBitSame: Object.is(still.mesh.distBitFrac, moved.mesh.distBitFrac) });
    }
    // 不等質量の対照(同じ器・q=0.5)
    const zu = W.mkBox(0.5, 1);
    const uStill = W.run(zu.pd, dt, (NP + 0.6) * zu.meta.Pkep, NP, zu.meta.Pkep, 0);
    return { rows, unequal: { q: 0.5, meta: zu.meta, still: uStill } };
  }, [DT, NPERI]);
  out.box = r;
  for (const z of r.rows) {
    console.error(`  BOX q=1 D0pull=${z.D0pull}: χ=${ex3(z.still.mesh.chiMin)}〜${ex3(z.still.mesh.chiMax)}`
      + ` mode=${JSON.stringify(z.still.mesh.modes)} unique率=${fmt(z.still.mesh.uniqueFrac, 3)}`
      + ` / 慣性系 P=${fmt(z.still.inertial.periodPeri, 4)} Δϖ=${fmt(z.still.inertial.advDeg, 6)}°/周`
      + ` |a_rel|=${ex3(z.still.inertial.accRelMin)}〜${ex3(z.still.inertial.accRelMax)}`
      + ` 重心走行=${ex3(z.still.inertial.cmWalk)}`
      + ` / メッシュ q のずれ(相対)=${ex3(z.still.mesh.qDevRelMax)}`
      + ` detF=${ex3(z.still.mesh.detFmin)}〜${ex3(z.still.mesh.detFmax)}`
      + ` 計量で復元した距離の相対差=${ex3(z.still.mesh.distFromMetricRelMax)}`
      + ` ビット一致率=${fmt(z.still.mesh.distBitFrac, 4)}`
      + ` / 共通並進 V=2v_rel: ΔP=${ex3(z.dPeriodPct)}% q のずれ=${ex3(z.moved.mesh.qDevRelMax)}`);
  }
  console.error(`  BOX 不等質量 q=0.5(対照): unique率=${fmt(r.unequal.still.mesh.uniqueFrac, 3)}`
    + ` χ=${ex3(r.unequal.still.mesh.chiMin)}〜${ex3(r.unequal.still.mesh.chiMax)}`
    + ` q のずれ=${ex3(r.unequal.still.mesh.qDevRelMax)} 重心の弾道ずれ=${ex3(r.unequal.still.inertial.cmDev)}`);
}

// ============================================================ NS: ⚡🧶(実系の NS 連星)
if (want('ns')) {
  const r = await pg.evaluate(([dt, NP]) => {
    const W = window.__w253, rows = [];
    for (const id of ['psrDoubleABDFM', 'psrB1534DFM']) {
      const src = HP.allPresets().find((z) => z.id === id);
      const pd = JSON.parse(JSON.stringify(src));
      delete pd.massCalibration;
      pd.physics.framePrecision = 'double';
      const s = W.SYS[id], Pu = s.PobsS / s.Tunit;
      const b = pd.bodies, m1 = b[0].m, m2 = b[1].m, M = m1 + m2;
      const vRel = Math.hypot(b[1].vx - b[0].vx, b[1].vy - b[0].vy);
      const still = W.run(pd, dt, (NP + 0.6) * Pu, NP, Pu, 0);
      const moved = W.run(pd, dt, (NP + 0.6) * Pu, NP, Pu, 0.5 * vRel);
      rows.push({ id, label: s.label, m1, m2, q: m2 / m1, dmOverM: Math.abs(m1 - m2) / M,
        Pobs: Pu, obsDeg: s.omegaDot * s.PobsS / (365.25 * 86400), vRel, still, moved,
        dPeriodPct: (still.inertial.periodPeri && moved.inertial.periodPeri)
          ? 100 * (moved.inertial.periodPeri / still.inertial.periodPeri - 1) : null });
    }
    return { rows };
  }, [DT, NPERI]);
  out.ns = r;
  for (const z of r.rows) {
    console.error(`  NS ${z.label}: q=${fmt(z.q, 6)} |Δm|/M=${ex3(z.dmOverM)}`
      + ` χ=${ex3(z.still.mesh.chiMin)}〜${ex3(z.still.mesh.chiMax)} mode=${JSON.stringify(z.still.mesh.modes)}`
      + ` unique率=${fmt(z.still.mesh.uniqueFrac, 3)}`
      + ` / 慣性系 P=${fmt(z.still.inertial.periodPeri, 6)}(観測 ${fmt(z.Pobs, 6)})`
      + ` Δϖ=${ex3(z.still.inertial.advDeg)}°/周(観測 ${ex3(z.obsDeg)})`
      + ` 重心走行=${ex3(z.still.inertial.cmWalk)} |a_rel|=${ex3(z.still.inertial.accRelMax)}`
      + ` / メッシュ q のずれ(相対)=${ex3(z.still.mesh.qDevRelMax)}`
      + ` 計量で復元した距離の相対差=${ex3(z.still.mesh.distFromMetricRelMax)} ビット一致率=${fmt(z.still.mesh.distBitFrac, 4)}`
      + ` / 共通並進 V=0.5v_rel: ΔP=${ex3(z.dPeriodPct)}% q のずれ=${ex3(z.moved.mesh.qDevRelMax)}`);
  }
}

// ============================================================ T1: 単独天体(剛体メッシュ)
if (want('t1')) {
  const r = await pg.evaluate(() => {
    const pd = { name: 'w253 T1', description: 'single body', emoji: '🕸',
      camera: { scale: 130 }, world: { boundary: 'none', size: 0 },
      physics: { G: 0.60066, D0: 0.006, kFrame: 1, q: 3, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
        kappaT: 0.0006674, cLight: 30, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
        geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.05, timeScale: 60,
        stateCarry: 'double', framePrecision: 'double', frameWeight: 'pull', D0pull: 1 },
      bodies: [{ type: 'single', m: 500, radius: 1, x: 0, y: 0, vx: 0.25, vy: -0.5, spin: 0.375, pinned: false }],
      overlays: {} };
    const v = HP.validatePreset(JSON.parse(JSON.stringify(pd)));
    const S = HP.sim; S.build(v.preset);
    const A = HP.dfmSpaceMeshCapture(S, [0]);
    const rows = [];
    for (let k = 0; k < 4000; k++) {
      S.step(0.004);
      if ((k % 500) === 499) {
        // 姿勢は**殻の積分角 S.rotA**(spin·dt の累積)を渡す ―― ω×経過時間では代用しない。
        // コアの積分角 S.rotAc も併記する(どちらの軸に結ぶかは決断事項)
        const ang = S.rotA ? S.rotA[0] : 0, angCore = S.rotAc ? S.rotAc[0] : 0;
        const M = HP.dfmSpaceMeshState(A, S, { angle: ang, omega: S.spin[0] });
        if (!M) { rows.push({ t: S.t, null: true }); continue; }
        const self = HP.dfmSpaceMeshAt(M, S.x[0], S.y[0]);
        const far = HP.dfmSpaceMeshAt(M, S.x[0] + 10, S.y[0] + 20);
        rows.push({ t: S.t, angle: M.angle, angleCore: angCore, omegaDtProxy: S.spin[0] * S.t,
          omega: M.omega, chi: M.chi, mode: M.mode, unique: M.unique,
          detF: M.detF, divU: M.divU,
          selfRelBitZero: Object.is(self.ux, S.vx[0]) && Object.is(self.uy, S.vy[0]),
          selfRel: Math.hypot(self.ux - S.vx[0], self.uy - S.vy[0]),
          farRel: Math.hypot(far.ux - S.vx[0], far.uy - S.vy[0]),
          farExpect: Math.hypot(-S.spin[0] * 20, S.spin[0] * 10),
          qSelf: [self.qx, self.qy], qBit: Object.is(self.qx, M.ref[0][0]) && Object.is(self.qy, M.ref[0][1]) });
      }
    }
    return { rows, allSelfZero: rows.every((z) => z.selfRelBitZero === true),
      allQbit: rows.every((z) => z.qBit === true) };
  });
  out.t1 = r;
  console.error(`  T1 単独天体: 天体上の観測者相対 u−v がビット 0(全サンプル)=${r.allSelfZero}`
    + ` / メッシュ座標 q が捕捉値のまま(ビット)=${r.allQbit}`
    + ` / 最終サンプル: 殻の積分角=${fmt(r.rows[r.rows.length - 1].angle, 6)}`
    + `(コアの積分角=${fmt(r.rows[r.rows.length - 1].angleCore, 6)}・ω×t=${fmt(r.rows[r.rows.length - 1].omegaDtProxy, 6)})`
    + ` ω=${fmt(r.rows[r.rows.length - 1].omega, 6)}`
    + ` 遠方点の |u−v|=${ex3(r.rows[r.rows.length - 1].farRel)}(期待 ${ex3(r.rows[r.rows.length - 1].farExpect)})`
    + ` χ=${r.rows[r.rows.length - 1].chi} mode=${r.rows[r.rows.length - 1].mode}`);
}

out.pageErrors = pageErrors;
let prev = {};
try { prev = JSON.parse(fs.readFileSync(OUT, 'utf8')); } catch { /* 初回 */ }
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(Object.assign(prev, out), null, 1));
console.error(`  → ${path.relative(ROOT, OUT)} を更新した(pageErrors ${pageErrors.length} 件)`);
await browser.close();

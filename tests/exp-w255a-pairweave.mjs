// 第255便a W1「連星の空間メッシュ ―― 重心原点・pairWeave・有限回転子交換・帳簿と輸送の修正」(第47報)。
//
// 原仮定者(第47報・全文は docs/PHYSICS.md 〔第255便a〕に**原文のまま**引用):
//   「各粒子の移動回転により、空間メッシュの各座標における移動回転差分は、瞬間的に決まっている。
//    粒子間の引力や引きずりの計算に織り込む方法を検討する/連星での中間地点の表示は、重心地点に
//    変える/空間メッシュの追従による、慣性の退化は、重力波放出類似と、ダークマターハロー類似を
//    兼ねる/処理を軽くする工夫をする」。
//
// ■ 節(すべて実測。予想は 1 つも書かない)
//   BARY: **重心原点**。等質量は中点式と**ビット同一**・不等質量は解析重心と ulp 比較・
//         頂点契約 |u(xᵢ)−vᵢ| が両方の原点で 0。
//   PW  : **pairWeave**。🪟 で OFF/ON の帳簿(E/P/L)・NaN・クランプ・χ→0 の回帰・u=0 のニュートン一致。
//   D0  : **D0pull 5 段**(0/1e−4/1e−2/1/1e3)の近点間 P と Δϖ を OFF と weave で(= A0 の第 3 経路)。
//   ROT : **有限回転子交換**。純関数の保存則(L+J・E+Q・Q≥0・同期停止・逆回転)と、
//         🪟 へ接続した実走行の帳簿。
//   TR  : **blended 随伴**。D₀ を上げると輸送が止まること・停止した輸送が再生成されないこと・
//         二重バッファ後も原子的停止が保たれること。
//
// 実行: node tests/exp-w255a-pairweave.mjs [--bary] [--pw] [--d0] [--rot] [--tr] [--fast]
// 出力: tests/out/pairweave-w255.json(.gitignore 既定どおり未コミット ―― 数値は PHYSICS に全載)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'pairweave-w255.json');
const argv = process.argv.slice(2);
const FAST = argv.includes('--fast');
const only = argv.filter((a) => a.startsWith('--') && a !== '--fast').map((a) => a.slice(2));
const want = (k) => !only.length || only.includes(k);
const fx = (x) => (x === null || x === undefined) ? 'null' : Number(x).toExponential(4);

const out = { target: TARGET, node: process.version, at: new Date().toISOString(), wave: '255a', fast: FAST };

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

await pg.evaluate(() => {
  const W = (window.__w255 = {});
  // ---- 🫂 相当の合成 2 体(第252便a §BOX・第253便a・第254便a と同一規約 — q で質量比を振れる)
  W.mkBox = (q, D0pull, extra) => {
    const G = 0.60066, c = 30, e = 0.3, sepA = 200, eps = 0.05;
    const m1 = 1000 / (1 + q), m2 = 1000 * q / (1 + q), M = m1 + m2;
    const a = sepA / (1 + e), muN = G * M;
    const vA = Math.sqrt(muN * (1 - e) / (a * (1 + e)));
    const ph = { G, D0: 0.006, kFrame: 1, q: 3, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, kappaT: 0.0006674,
      cLight: c, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
      geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: eps, timeScale: 60, dispMag: 3,
      stateCarry: 'double', framePrecision: 'double', frameReaction: 'pairReduced',
      frameWeight: 'pull', D0pull };
    Object.assign(ph, extra || {});
    return { pd: { name: 'w255 weave box', description: 'pair weave probe', emoji: '🕸',
        camera: { scale: 130 }, world: { boundary: 'none', size: 0 }, physics: ph,
        bodies: [
          { type: 'single', m: m1, radius: 1, x: -sepA * m2 / M, y: 0, vx: 0, vy: -vA * m2 / M, spin: 0, pinned: false, pnSource: true },
          { type: 'single', m: m2, radius: 1, x: sepA * m1 / M, y: 0, vx: 0, vy: vA * m1 / M, spin: 0, pinned: false },
        ],
        overlays: { rotationCurve: false, tempHistogram: false, field: false, trail: true } },
      meta: { m1, m2, M, a, e, sepA, muN, eps, vRel: vA, Pkep: 2 * Math.PI * Math.sqrt(a * a * a / muN) } };
  };
  // ---- 近点解析(第252便a/第253便a/第254便a と同一手続き)
  W.periFit = (A, rMin, rMax, dt, pRef, NP) => {
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
    return { nPeri: ang.length, period: per.length ? per.reduce((a, b) => a + b, 0) / per.length : null,
      advDeg: slope === null ? null : slope * 180 / Math.PI };
  };
  // ---- 走行 1 本(近点・帳簿・メッシュ内部量)
  W.run = (pd, dt, steps, pRef, NP) => {
    const v = HP.validatePreset(JSON.parse(JSON.stringify(pd)));
    if (!v.ok) return { err: (v.errors || []).join('|') };
    const S = HP.sim; S.build(v.preset);
    const m0 = S.m[0], m1 = S.m[1], Ms = m0 + m1;
    const cmOf = () => [(m0 * S.x[0] + m1 * S.x[1]) / Ms, (m0 * S.y[0] + m1 * S.y[1]) / Ms];
    const cm0 = cmOf();
    const T0 = S.totals ? S.totals() : null;
    const gg = S.params.G, e2 = S.params.softening * S.params.softening;
    const emech = () => { const dx = S.x[1] - S.x[0], dy = S.y[1] - S.y[0];
      return 0.5 * m0 * (S.vx[0] ** 2 + S.vy[0] ** 2) + 0.5 * m1 * (S.vx[1] ** 2 + S.vy[1] ** 2)
        - gg * m0 * m1 / Math.sqrt(dx * dx + dy * dy + e2); };
    const E0 = emech();
    const A = [];
    let rd1 = 0, t1 = 0, rMin = Infinity, rMax = -Infinity;
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
    }
    const cmE = cmOf();
    const fit = W.periFit(A, rMin, rMax, dt, pRef, NP);
    const T = S.totals ? S.totals() : null;
    return { ...fit, rMin, rMax, nan: S.hasNaN(),
      clamp: S.clampVN + S.clampSN + S.clampRN + S.clampTN + S.clampAN,
      cmWalk: Math.hypot(cmE[0] - cm0[0], cmE[1] - cm0[1]),
      E: emech(), dE: emech() - E0,
      Ptot: T ? Math.hypot(T.px, T.py) : null, Ltot: T ? T.L : null,
      dP: (T && T0) ? Math.hypot(T.px - T0.px, T.py - T0.py) : null,
      dPx: (T && T0) ? (T.px - T0.px) : null, dPy: (T && T0) ? (T.py - T0.py) : null,
      dL: (T && T0) ? (T.L - T0.L) : null,
      weave: { px: S.spaceMeshWeavePx, py: S.spaceMeshWeavePy, L: S.spaceMeshWeaveL, E: S.spaceMeshWeaveE,
        chi: S.spaceMeshWeaveChi, rel: S.spaceMeshWeaveRel, clamp: S.spaceMeshWeaveClamp,
        stop: S.spaceMeshWeaveStop, has: S.hasPairWeave },
      rotor: { J: S.meshJ, Q: S.meshQ, L: S.meshRotorL, E: S.meshRotorE,
        omega: S.meshOmega, Omega: S.meshOmegaMesh, stop: S.meshRotorStop, has: S.hasMeshReservoir },
      mesh: { workE: S.spaceMeshWorkE, workPinned: S.spaceMeshWorkPinned, chi: S.spaceMeshChi,
        gravDiff: S.spaceMeshGravDiff, stop: S.spaceMeshStop },
      res: { px: S.resPx, py: S.resPy, L: S.resL },
      sig: JSON.stringify(v.preset.physics),
      state: [S.x[0], S.y[0], S.vx[0], S.vy[0], S.x[1], S.y[1], S.vx[1], S.vy[1]] };
  };
  // ---- 🪟 の宣言差し替え(プリセット本体は 1 bit も触らない)
  W.win = (patch) => {
    const P = HP.allPresets().find((z) => z.id === 'spaceMeshBinaryToy');
    const q = JSON.parse(JSON.stringify(P));
    if (patch && patch.physics) Object.assign(q.physics, patch.physics);
    if (patch && patch.spaceMesh === null) q.physics.spaceMesh = null;
    else if (patch && patch.spaceMesh) q.physics.spaceMesh = Object.assign({}, q.physics.spaceMesh, patch.spaceMesh);
    return q;
  };
});

// ================================================================ BARY: 重心原点
if (want('bary')) {
  out.bary = await pg.evaluate(() => {
    const W = window.__w255, R = {};
    const probe = (pd, label) => {
      const v = HP.validatePreset(JSON.parse(JSON.stringify(pd)));
      const S = HP.sim; S.build(v.preset);
      for (let k = 0; k < 1500; k++) S.step(0.004);
      const A = HP.dfmSpaceMeshCapture(S, [0, 1]);
      const M = HP.dfmSpaceMeshState(A, S);
      const m0 = S.m[0], m1 = S.m[1], Ms = m0 + m1;
      const bx = (m0 * S.x[0] + m1 * S.x[1]) / Ms, by = (m0 * S.y[0] + m1 * S.y[1]) / Ms;
      const mx = (S.x[0] + S.x[1]) / 2, my = (S.y[0] + S.y[1]) / 2;
      const sc = Math.max(Math.abs(bx), Math.abs(by), Math.hypot(S.x[1] - S.x[0], S.y[1] - S.y[0]));
      // 頂点契約 u(xᵢ)=vᵢ(重心原点で)
      let vmax = 0;
      for (const i of [0, 1]) {
        const ex = S.x[i] - M.origin[0], ey = S.y[i] - M.origin[1], B = M.gradU;
        const ux = M.velocity[0] + B[0] * ex + B[1] * ey, uy = M.velocity[1] + B[2] * ex + B[3] * ey;
        const e = Math.hypot(ux - S.vx[i], uy - S.vy[i]); if (e > vmax) vmax = e;
      }
      return { label, m0, m1, origin: [M.origin[0], M.origin[1]],
        barycentre: [M.barycentre[0], M.barycentre[1]], midpoint: [M.midpoint[0], M.midpoint[1]],
        originIsBary: Object.is(M.origin[0], bx) && Object.is(M.origin[1], by),
        originIsMid: Object.is(M.origin[0], mx) && Object.is(M.origin[1], my),
        baryUlp: Math.hypot(M.origin[0] - bx, M.origin[1] - by) / (sc * Number.EPSILON),
        midGap: Math.hypot(mx - bx, my - by), vertexErr: vmax, chi: M.chi, unique: M.unique };
    };
    R.eq = probe(W.mkBox(1, 1e-4).pd, '合成 q=1(等質量)');
    R.q05 = probe(W.mkBox(0.5, 1e-4).pd, '合成 q=0.5(不等質量)');
    R.win = probe(HP.allPresets().find((z) => z.id === 'spaceMeshBinaryToy'), '🪟 spaceMeshBinaryToy');
    R.psr = probe(HP.allPresets().find((z) => z.id === 'psrDoubleABDFM'), '⚡ psrDoubleABDFM');
    return R;
  });
  for (const v of Object.values(out.bary)) {
    console.error(`BARY ${v.label}: m=${v.m0.toFixed(3)}/${v.m1.toFixed(3)} 原点=重心 ${v.originIsBary}`
      + `(${v.baryUlp.toFixed(2)} ulp)・原点=中点 ${v.originIsMid}・中点と重心の隔たり ${fx(v.midGap)}`
      + ` / **頂点契約 |u−v| = ${fx(v.vertexErr)}**・χ=${Number(v.chi).toFixed(6)}`);
  }
}

// ================================================================ PW: pairWeave の契約と帳簿
if (want('pw')) {
  out.pw = await pg.evaluate((fast) => {
    const W = window.__w255, R = {};
    const N = fast ? 20000 : 400000;
    const mk = (weave, extra) => W.win({ spaceMesh: Object.assign({ weave }, extra || {}) });
    // ① 未宣言(weave 欠落)は 🪟 の既定と署名も状態もビット同一
    const off = W.run(W.win(null), 0.004, N, 1339, 3);
    const declOff = W.run(mk('off'), 0.004, N, 1339, 3);
    R.offBit = { sigSame: off.sig === declOff.sig,
      stateSame: off.state.every((z, i) => Object.is(z, declOff.state[i])) };
    // ② weave:"pair"(相対速度の読み替え)と "pairFull"(フレームの代入)の 2 案
    const on = W.run(mk('pair'), 0.004, N, 1339, 3);
    const full = W.run(mk('pairFull'), 0.004, N, 1339, 3);
    R.on = on; R.off = off; R.full = full;
    R.diff = { state: Math.max(...on.state.map((z, i) => Math.abs(z - off.state[i]))),
      period: (on.period !== null && off.period !== null) ? on.period - off.period : null,
      adv: (on.advDeg !== null && off.advDeg !== null) ? on.advDeg - off.advDeg : null };
    R.diffFull = { state: Math.max(...full.state.map((z, i) => Math.abs(z - off.state[i]))),
      rMax: full.rMax, clamp: full.clamp, E: full.E, nan: full.nan };
    // ③ 帳簿が閉じるか: Δ(力学 E) と weave.E / ΔP と weave.P / ΔL と weave.L
    // **リザーバ帳簿が閉じるか**: Δ(系の P・L) + リザーバ = 0(weave の寄与も同じ帳簿に載る)
    R.ledger = { dE: on.dE, weaveE: on.weave.E,
      dP: on.dP, weaveP: Math.hypot(on.weave.px, on.weave.py),
      dL: on.dL, weaveL: on.weave.L,
      resPx: on.res.px, resPy: on.res.py, resL: on.res.L,
      closeL: on.dL + on.res.L, closeP: Math.hypot(on.dPx + on.res.px, on.dPy + on.res.py),
      offCloseL: off.dL + off.res.L,
      offClosePscale: Math.abs(on.Ltot) };
    // ④ χ→0 の極(D0pull=1e12)で OFF へ戻るか
    const chi0off = W.run(W.win({ physics: { D0pull: 1e12 }, spaceMesh: null }), 0.004, 20000, 519, 3);
    const chi0on = W.run(mk('pair', {}), 0.004, 1, 519, 1);  // 形式合わせ(未使用)
    const chi0w = W.run(W.win({ physics: { D0pull: 1e12 }, spaceMesh: { weave: 'pair' } }), 0.004, 20000, 519, 3);
    R.chiZero = { max: Math.max(...chi0w.state.map((z, i) => Math.abs(z - chi0off.state[i]))),
      scale: Math.hypot(chi0off.state[0], chi0off.state[1]), chi: chi0w.weave.chi,
      weaveE: chi0w.weave.E, weaveP: Math.hypot(chi0w.weave.px, chi0w.weave.py) };
    void chi0on;
    // ⑤ kFrame=0(引きずりなし)では weave が素通りする = ビット同一
    const kf0off = W.run(W.win({ physics: { kFrame: 0 }, spaceMesh: null }), 0.004, 20000, 519, 3);
    const kf0on = W.run(W.win({ physics: { kFrame: 0 }, spaceMesh: { weave: 'pair' } }), 0.004, 20000, 519, 3);
    R.kf0 = { same: kf0off.state.every((z, i) => Object.is(z, kf0on.state[i])), stop: kf0on.weave.stop };
    // ⑥ 決定性(同じ宣言を 2 回)
    const dA = W.run(mk('pair'), 0.004, 4000, 1339, 2), dB = W.run(mk('pair'), 0.004, 4000, 1339, 2);
    R.det = dA.state.every((z, i) => Object.is(z, dB.state[i]));
    // ⑦ 門
    R.gates = [
      HP.validatePreset(mk('nope')).ok,
      HP.validatePreset(W.win({ spaceMesh: { reservoir: { Imesh: 0, gamma: 1 } } })).ok,
      HP.validatePreset(W.win({ spaceMesh: { reservoir: { Imesh: 1, gamma: -1 } } })).ok,
      HP.validatePreset(W.win({ spaceMesh: { reservoir: [1, 2] } })).ok].every((z) => z === false);
    // ⑨ OFF 対照の近点は基準として持っておく(窓の中で 3 近点が取れているか)
    // ⑧ weave 単独宣言(gravity/inertia は OFF)が署名に載る = 未宣言へ潰れない
    const solo = HP.validatePreset(W.win({ spaceMesh: { mode: 'vertex', gravity: false, inertia: false, weave: 'pair' } }));
    R.solo = { kept: !!(solo.preset.physics.spaceMesh && solo.preset.physics.spaceMesh.weave === 'pair'),
      decl: solo.preset.physics.spaceMesh };
    const dropped = HP.validatePreset(W.win({ spaceMesh: { mode: 'vertex', gravity: false, inertia: false, weave: 'off' } }));
    R.solo.allOffNull = (dropped.preset.physics.spaceMesh === null || dropped.preset.physics.spaceMesh === undefined);
    return R;
  }, FAST);
  const P = out.pw;
  console.error(`PW ① weave 欠落 = 既定(署名 ${P.offBit.sigSame}・状態ビット ${P.offBit.stateSame})`);
  console.error(`PW ② 🪟 OFF: P=${P.off.period} Δϖ=${P.off.advDeg} r=${P.off.rMin}〜${P.off.rMax} / `
    + `weave:"pair" P=${P.on.period} Δϖ=${P.on.advDeg} r=${P.on.rMin}〜${P.on.rMax}`
    + ` — 差 ΔP=${P.diff.period} Δ(Δϖ)=${P.diff.adv}・状態差 ${fx(P.diff.state)}`);
  console.error(`PW ②' weave:"pairFull"(代入案): P=${P.full.period} Δϖ=${P.full.advDeg} `
    + `r=${fx(P.full.rMin)}〜${fx(P.full.rMax)} E=${fx(P.full.E)} クランプ=${P.full.clamp} NaN=${P.full.nan}`);
  console.error(`PW ③ 帳簿: ΔL=${fx(P.ledger.dL)}(うち weave ${fx(P.ledger.weaveL)})・**ΔL+resL=${fx(P.ledger.closeL)}**`
    + `(OFF 対照 ${fx(P.ledger.offCloseL)}・|L|≈${fx(P.ledger.offClosePscale)}) / **ΔP+resP=${fx(P.ledger.closeP)}**`
    + ` / weave の離散仕事 ${fx(P.ledger.weaveE)}(Δ力学E=${fx(P.ledger.dE)})`);
  console.error(`PW ③' NaN=${P.on.nan} クランプ=${P.on.clamp} weaveクランプ=${P.on.weave.clamp}`
    + ` χ=${P.on.weave.chi} |v−u_pair|=${fx(P.on.weave.rel)} stop=${P.on.weave.stop}`);
  console.error(`PW ④ χ→0(D0pull=1e12): OFF との最大差 ${fx(P.chiZero.max)}(|x|≈${P.chiZero.scale.toFixed(1)})`
    + ` χ=${fx(P.chiZero.chi)} weaveE=${fx(P.chiZero.weaveE)}`);
  console.error(`PW ⑤ kFrame=0: ビット同一 ${P.kf0.same}(stop=${P.kf0.stop}) / ⑥ 決定性 ${P.det} / ⑦ 門 ${P.gates}`
    + ` / ⑧ weave 単独宣言が残る ${P.solo.kept}・4 チャネル OFF は null ${P.solo.allOffNull}`);
}

// ================================================================ D0: 5 段の P・Δϖ(A0 の第 3 経路)
if (want('d0')) {
  out.d0 = await pg.evaluate((fast) => {
    const W = window.__w255, rows = [];
    const N = fast ? 60000 : 1300000;
    for (const D0pull of [0, 1e-4, 1e-2, 1, 1e3]) {
      const off = W.run(W.win({ physics: { D0pull }, spaceMesh: null }), 0.004, N, 519, 4);
      const on = W.run(W.win({ physics: { D0pull }, spaceMesh: { weave: 'pair' } }), 0.004, N, 519, 4);
      rows.push({ D0pull, chi: on.weave.chi,
        offP: off.period, offAdv: off.advDeg, offR: [off.rMin, off.rMax], offClamp: off.clamp,
        onP: on.period, onAdv: on.advDeg, onR: [on.rMin, on.rMax], onClamp: on.clamp,
        dP: (on.period !== null && off.period !== null) ? on.period - off.period : null,
        dAdv: (on.advDeg !== null && off.advDeg !== null) ? on.advDeg - off.advDeg : null,
        weaveE: on.weave.E, weaveL: on.weave.L, weaveClamp: on.weave.clamp, rel: on.weave.rel,
        nan: on.nan, nPeriOff: off.nPeri, nPeriOn: on.nPeri, steps: N });
    }
    return rows;
  }, FAST);
  for (const r of out.d0) {
    console.error(`D0 ${r.D0pull}: χ=${Number(r.chi).toExponential(4)} | OFF P=${r.offP} Δϖ=${r.offAdv}`
      + ` | weave P=${r.onP} Δϖ=${r.onAdv} | 差 ΔP=${r.dP} Δ(Δϖ)=${r.dAdv}`
      + ` | クランプ ${r.offClamp}/${r.onClamp} weave ${r.weaveClamp} NaN=${r.nan}`);
  }
}

// ================================================================ ROT: 有限回転子交換
if (want('rot')) {
  out.rot = await pg.evaluate(() => {
    const R = {};
    // (1) 純関数の保存則(1 步)
    const one = HP.dfmMeshRotorExchange({ L: 10, J: 0, Iorb: 4, Imesh: 2, gamma: 0.3, dt: 0.5 });
    R.one = one;
    // (2) 長時間の積み上げ(L+J・E+Q)
    const march = (L0, J0, Io, Im, gm, h, n) => {
      let L = L0, J = J0, Q = 0;
      for (let k = 0; k < n; k++) {
        const e = HP.dfmMeshRotorExchange({ L, J, Iorb: Io, Imesh: Im, gamma: gm, dt: h });
        L = e.L; J = e.J; Q += e.dQ;
      }
      const E0 = L0 * L0 / (2 * Io) + J0 * J0 / (2 * Im);
      const E1 = L * L / (2 * Io) + J * J / (2 * Im);
      return { L, J, Q, sum0: L0 + J0, sum1: L + J, dSum: (L + J) - (L0 + J0),
        E0, E1, dE: E1 + Q - E0, omega: L / Io, Omega: J / Im };
    };
    R.march = march(10, 0, 4, 2, 0.3, 0.01, 20000);
    // (3) 一步と厳密解(指数緩和)の一致 — 刻みを 3 桁振っても同じ終状態へ行く
    R.stepInvariance = [1e-3, 1e-2, 1e-1].map((h) => {
      const m = march(10, 0, 4, 2, 0.3, h, Math.round(20 / h));
      return { h, L: m.L, J: m.J, Q: m.Q, dSum: m.dSum, dE: m.dE };
    });
    // (4) 否定対照 — 同期(ω=Ω_m)で停止・逆回転(Ω_m>ω)で L が軌道へ戻る
    R.sync = HP.dfmMeshRotorExchange({ L: 8, J: 4, Iorb: 4, Imesh: 2, gamma: 0.3, dt: 0.5 });  // ω=2・Ω=2
    R.reverse = HP.dfmMeshRotorExchange({ L: 2, J: 20, Iorb: 4, Imesh: 2, gamma: 0.3, dt: 0.5 }); // ω=0.5・Ω=10
    // (5) Q≥0(向きに依らず)
    R.qSigns = [R.one.dQ, R.reverse.dQ, R.sync.dQ];
    // (6) I_m→0 の極(退化を隠さない)と I_m→∞
    R.tiny = HP.dfmMeshRotorExchange({ L: 10, J: 0, Iorb: 4, Imesh: 1e-12, gamma: 0.3, dt: 0.5 });
    R.huge = HP.dfmMeshRotorExchange({ L: 10, J: 0, Iorb: 4, Imesh: 1e12, gamma: 0.3, dt: 0.5 });
    // (7) 門
    R.gates = [HP.dfmMeshRotorExchange(null), HP.dfmMeshRotorExchange({ L: 1, J: 0, Iorb: 0, Imesh: 1, gamma: 1, dt: 1 }),
      HP.dfmMeshRotorExchange({ L: 1, J: 0, Iorb: 1, Imesh: 0, gamma: 1, dt: 1 }),
      HP.dfmMeshRotorExchange({ L: 1, J: 0, Iorb: 1, Imesh: 1, gamma: -1, dt: 1 }),
      HP.dfmMeshRotorExchange({ L: NaN, J: 0, Iorb: 1, Imesh: 1, gamma: 1, dt: 1 })].map((z) => z === null);
    return R;
  });
  // 実エンジンへ接続した走行
  out.rotRun = await pg.evaluate((fast) => {
    const W = window.__w255, R = {};
    const N = fast ? 20000 : 120000;
    const go = (rv, label) => {
      const r = W.run(W.win({ spaceMesh: { reservoir: rv } }), 0.004, N, 1339, 3);
      const Im = rv.Imesh;
      return { label, rv, P: r.period, adv: r.advDeg, rMin: r.rMin, rMax: r.rMax, nan: r.nan, clamp: r.clamp,
        J: r.rotor.J, Q: r.rotor.Q, rotorL: r.rotor.L, rotorE: r.rotor.E,
        omega: r.rotor.omega, Omega: r.rotor.Omega, stop: r.rotor.stop,
        dE: r.dE, dL: r.dL, dP: r.dP, resL: r.res.L,
        rotorClose: r.rotor.L + r.rotor.J,              // 交換の内部閉包(ΣdL + J = 0 か)
        closeL: r.dL + r.res.L + r.rotor.J,             // 系の ΔL + リザーバ帳簿 + メッシュ J = 0 か
        closeE: r.dE + (r.rotor.J * r.rotor.J) / (2 * Im) + r.rotor.Q };  // E+Q が閉じるか
    };
    R.base = W.run(W.win(null), 0.004, N, 1339, 3);
    R.g0 = go({ Imesh: 5e5, gamma: 0 }, 'γ=0(対照 — 交換なし)');
    R.mid = go({ Imesh: 5e5, gamma: 1e3 }, 'I_m=5e5・γ=1e3');
    R.strong = go({ Imesh: 5e5, gamma: 1e5 }, 'I_m=5e5・γ=1e5');
    R.tiny = go({ Imesh: 1e-6, gamma: 1e3 }, 'I_m=1e−6(退化の極)');
    R.g0Bit = R.base.state.every((z, i) => Object.is(z, R.g0 ? 1 : 1));   // 下で上書き
    const g0run = W.run(W.win({ spaceMesh: { reservoir: { Imesh: 5e5, gamma: 0 } } }), 0.004, 4000, 1339, 2);
    const bs = W.run(W.win(null), 0.004, 4000, 1339, 2);
    R.g0Bit = g0run.state.every((z, i) => Object.is(z, bs.state[i]));
    return R;
  }, FAST);
  const r = out.rot;
  console.error(`ROT (1) 1 步: ω=${r.one.omega} Ω=${r.one.Omega} dL=${fx(r.one.dL)} dQ=${fx(r.one.dQ)}`
    + ` L+J 残差 ${fx(r.one.momentumResidual)} E+Q 残差 ${fx(r.one.energyResidual)}`);
  console.error(`ROT (2) 2 万步: L=${r.march.L} J=${r.march.J} Q=${r.march.Q} ΔL+J=${fx(r.march.dSum)}`
    + ` Δ(E+Q)=${fx(r.march.dE)} ω=${fx(r.march.omega)} Ω=${fx(r.march.Omega)}`);
  console.error(`ROT (3) 刻み不変: ` + r.stepInvariance.map((z) => `h=${z.h}→L=${z.L.toFixed(9)}`).join(' / '));
  console.error(`ROT (4) 同期 dL=${r.sync.dL}(Δ=${r.sync.delta}) / 逆回転 dL=${fx(r.reverse.dL)}(>0 = 軌道へ戻る)`);
  console.error(`ROT (5) Q の符号 ${r.qSigns.map((z) => (z >= 0 ? '+' : '-')).join('')} / (6) I_m→0 dL=${fx(r.tiny.dL)}`
    + ` I_m→∞ dL=${fx(r.huge.dL)} / (7) 門 ${r.gates.every((z) => z)}`);
  for (const k of ['g0', 'mid', 'strong', 'tiny']) {
    const v = out.rotRun[k];
    console.error(`ROT-RUN ${v.label}: P=${v.P} Δϖ=${v.adv} r=${fx(v.rMin)}〜${fx(v.rMax)} J=${fx(v.J)} Q=${fx(v.Q)}`
      + ` ΣdL+J=${fx(v.rotorClose)} ΔL+resL+J=${fx(v.closeL)} ΔE+J²/2I+Q=${fx(v.closeE)}`
      + ` ω=${fx(v.omega)} Ω=${fx(v.Omega)} 粒子側の厳密仕事=${fx(v.rotorE)}(回転子模型の予測 ${fx(-(v.J * v.J) / (2 * v.rv.Imesh) - v.Q)})`
      + ` stop=${v.stop} NaN=${v.nan} クランプ=${v.clamp}`);
  }
  console.error(`ROT-RUN γ=0 は宣言なしとビット同一: ${out.rotRun.g0Bit}`);
}

// ================================================================ TR: 輸送(blended・停止・二重バッファ)
if (want('tr')) {
  out.tr = await pg.evaluate(() => {
    const W = window.__w255, R = {};
    const follow = (ent, D0) => {
      const v = HP.validatePreset(JSON.parse(JSON.stringify(W.win(null))));
      const S = HP.sim; S.build(v.preset);
      const opts = { ids: [0, 1], interpolation: 'geometric', entrainment: ent };
      if (D0 !== undefined) opts.D0 = D0;
      const p0 = [[S.x[0], S.y[0]], [S.x[1], S.y[1]]];
      const tr = HP.dfmMeshTransportBind(S, p0, [[0, 1]], opts);
      if (!tr) return { err: 'bind' };
      let move = 0, err = 0;
      for (let k = 0; k < 4000; k++) {
        S.step(0.004);
        const rr = Math.hypot(S.x[1] - S.x[0], S.y[1] - S.y[0]);
        const q = Math.max(Math.hypot(tr.x[0] - S.x[0], tr.x[1] - S.y[0]),
          Math.hypot(tr.x[2] - S.x[1], tr.x[3] - S.y[1])) / rr;
        if (q > err) err = q;
        const mv = Math.max(Math.hypot(tr.x[0] - p0[0][0], tr.x[1] - p0[0][1]),
          Math.hypot(tr.x[2] - p0[1][0], tr.x[3] - p0[1][1]));
        if (mv > move) move = mv;
      }
      HP.sim.meshTransport = null;
      return { ent, D0: D0 === undefined ? 'preset' : D0, chi: tr.chi, follow: err, move, error: tr.error,
        detMin: tr.detMin, detMax: tr.detMax, steps: tr.steps };
    };
    R.vertex = follow('vertex');
    R.blended = follow('blended');
    R.blendedD0hi = follow('blended', 1e6);
    R.vertexD0hi = follow('vertex', 1e6);
    // 二重バッファでも原子的停止が保たれる
    const tr = HP.dfmMeshTransportCreate([[1, 0], [2, 3]]);
    HP.dfmMeshTransportStep(tr, 0.1, () => ({ u: [1, 0], gradU: [0, 0, 0, 0] }));
    HP.dfmMeshTransportStep(tr, 0.1, () => ({ u: [1, 0], gradU: [0, 0, 0, 0] }));
    const snap = Array.from(tr.x), snapF = Array.from(tr.F), st0 = tr.steps;
    const stop = HP.dfmMeshTransportStep(tr, 0.1, () => null);
    R.atomic = { nullStop: stop === null, err: tr.error, st: tr.steps === st0,
      kept: tr.x.every((z, i) => Object.is(z, snap[i])) && tr.F.every((z, i) => Object.is(z, snapF[i])),
      after: HP.dfmMeshTransportStep(tr, 0.1, () => ({ u: [1, 0], gradU: [0, 0, 0, 0] })) === null };
    // 二重バッファの再利用(配列が 2 本を行き来し、確保が増えない)
    const t2 = HP.dfmMeshTransportCreate([[1, 0]]);
    const seen = [];
    for (let k = 0; k < 4; k++) { HP.dfmMeshTransportStep(t2, 0.1, () => ({ u: [1, 0], gradU: [0, 0, 0, 0] }));
      seen.push(t2.x); }
    R.buffers = { distinct: new Set(seen).size, alternating: seen[0] === seen[2] && seen[1] === seen[3],
      x: Array.from(t2.x) };
    // 門
    R.gate = HP.dfmMeshTransportBind(HP.sim, [[0, 0]], null, { entrainment: 'nope' }) === null;
    HP.sim.meshTransport = null;
    return R;
  });
  for (const k of ['vertex', 'blended', 'blendedD0hi', 'vertexD0hi']) {
    const v = out.tr[k];
    console.error(`TR ${k}: χ=${fx(v.chi)} 頂点追従 ${fx(v.follow)} マーカー移動 ${fx(v.move)} err=${v.error}`);
  }
  console.error(`TR 原子的停止 ${JSON.stringify(out.tr.atomic)} / バッファ ${JSON.stringify(out.tr.buffers.alternating)}`
    + ` 別配列 ${out.tr.buffers.distinct} / 門 ${out.tr.gate}`);
}

out.pageErrors = pageErrors;
await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error('[w255a] → ' + path.relative(ROOT, OUT));
if (pageErrors.length) console.error('[w255a] pageErrors: ' + pageErrors.slice(0, 3).join(' | '));

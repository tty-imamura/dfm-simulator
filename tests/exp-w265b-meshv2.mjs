// 第265便b(第57報 W2・Z2)「mesh-v2 —— 引きずりの完全置換の**最小代数実装**」の実測器である。
//
// ■ 何を測るか(統括の読み (C))
//   場を粒子から代数的に求める: u_i = Σ_j W_ij(q) v_j + u_bg → L=½vᵀH(q)v−U(q)・**H=(I−W)ᵀM(I−W)**。
//   D₀=0 かつ η=1 では行和が 1 になるので **共通並進が零固有値**(構造的特異性)。
//   これを公理へ合わせる道は 2 つあり、**どちらが正しいかは決めない**ので両方実装して比べる:
//     ① `meshGauge:"inertia"`    … 重心の慣性を独立に残す(H′=H+δ·mmᵀ/M²・δ=M−1ᵀH1)
//     ② `meshGauge:"constraint"` … 零方向を射影して擬似逆で解く(ゲージ条件 Σ_i a_i = 0)
//
// ■ 出す 6 つ
//   §1 hess   … H 検査 4 項(対称性・正定値性・構造的特異性・行和)と解析値 λ=m(1∓ηχ)² の照合
//   §2 rest   … **静止 2 体**の加速度(v=0 で計量の微分項が消える)。等質量・D₀=0・η=1 の
//                相対加速度/Newton は μ/M=1/4 になるはず(〔第264便b ④(3)〕の M/μ≥4 の裏返し)
//   §3 galilei… **共通並進不変性**: 全粒子の速度へ V を足したときの加速度の変化(相対・重心)
//   §4 run    … 600 步(既存トイ〔gravity 閉包〕 対 mesh-v2 の 2 ゲージ): Δa・分離・近点間 P・帳簿
//   §5 sing   … **特異点近傍**(η→1・D₀→0)の λ_min・cond・stop(宣言値 cond>1e12 で止める)
//   §6 newton … **η=0 は Newton へ戻る**(差は丸めの桁 —— 実測を書く)
//
// ■ 言わないこと
//   **「引きずりを完全置換した」とは書かない**(対象は 2 体・回転源なし・衝突なしだけである)。
//   **mesh-v2 を銀河へ当てない**(3 体以上は step が notTwoBody で止まる)。
//
// 実行: node tests/exp-w265b-meshv2.mjs [--part hess,rest,galilei,run,sing,newton]
// 出力: tests/out/meshv2-w265b.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + (path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET));
const OUT = path.join(ROOT, 'tests', 'out', 'meshv2-w265b.json');
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const PARTS = arg('--part', 'hess,rest,galilei,run,sing,newton').split(',');
const want = (k) => PARTS.indexOf(k) >= 0;
const NSTEP = Number(arg('--steps', 600));

const LIB_PREC = fs.readFileSync(path.join(ROOT, 'tests', 'lib-precision-diagnostics.mjs'), 'utf8').replace(/^export /gm, '');
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
const pg = await browser.newPage();
const pageErrors = [];
pg.on('pageerror', (e) => pageErrors.push(String(e.message || e)));
await pg.goto(INDEX, { waitUntil: 'load' });
await pg.waitForFunction(() => window.HP && HP.sim);
await pg.addScriptTag({ content: LIB_PREC });

const R = { wave: '第265便b', target: TARGET, at: new Date().toISOString(), parts: PARTS, steps: NSTEP,
  note: '**mesh-v2 は候補であって確立した法則ではない。** 対象は 2 体・回転源なし・正の慣性・衝突なしだけである。' };

// ---------- §1 H 検査
if (want('hess')) {
  R.hess = await pg.evaluate(() => {
    const G = 6.674, EPS = 0.05, MM = 500, SEP = 240, PW = 1;
    const rows = [];
    for (const D0 of [0, 0.5, 2, 8]) {
      for (const eta of [0.25, 0.5, 1]) {
        for (const gauge of ['inertia', 'constraint']) {
          const b = [{ m: MM, x: -SEP / 2, y: 0, vx: 0, vy: -0.4 }, { m: MM, x: SEP / 2, y: 0, vx: 0, vy: 0.4 }];
          const r = HP.dfmMeshV2Solve(b, { G, eps: EPS, p: PW, D0, eta, gauge });
          // 解析値(等質量・2 体): χ=w/(D₀+w)・H=m[[1+η²χ², −2ηχ],[−2ηχ, 1+η²χ²]] → λ=m(1∓ηχ)²
          const w = MM * Math.pow(SEP * SEP + EPS * EPS, -PW / 2);
          const chi = w / (D0 + w);
          const lo = MM * (1 - eta * chi) * (1 - eta * chi), hi = MM * (1 + eta * chi) * (1 + eta * chi);
          rows.push({ D0, eta, gauge, chi: r.chi[0], chiExact: chi,
            symRel: r.symRel, minEig: r.minEig, maxEig: r.maxEig, cond: r.cond,
            minEigH: r.minEigH, maxEigH: r.maxEigH, condH: r.condH,
            eigLoExact: lo, eigHiExact: hi,
            eigLoRel: (lo > 0) ? Math.abs(r.minEigH - lo) / lo : Math.abs(r.minEigH),
            eigHiRel: Math.abs(r.maxEigH - hi) / hi,
            structural: r.structural, rowDev: r.rowDev, delta: r.delta, h11: r.h11, Mtot: r.Mtot,
            stop: r.stop });
        }
      }
    }
    return { rows };
  });
}

// ---------- §2 静止 2 体
if (want('rest')) {
  R.rest = await pg.evaluate(() => {
    const G = 6.674, EPS = 0.05, SEP = 240, PW = 1;
    const rows = [];
    for (const [m0, m1] of [[500, 500], [1000, 100], [2000, 20]]) {
      for (const D0 of [0, 0.5, 8]) {
        for (const gauge of ['inertia', 'constraint']) {
          const b = [{ m: m0, x: -SEP / 2, y: 0, vx: 0, vy: 0 }, { m: m1, x: SEP / 2, y: 0, vx: 0, vy: 0 }];
          const r = HP.dfmMeshV2Solve(b, { G, eps: EPS, p: PW, D0, eta: 1, gauge });
          const relMesh = (r.accel ? r.accel.x[1] - r.accel.x[0] : null);
          const relNewt = r.gravAccel ? r.gravAccel.x[1] - r.gravAccel.x[0] : null;
          const cmMesh = r.accel ? (m0 * r.accel.x[0] + m1 * r.accel.x[1]) / (m0 + m1) : null;
          const sumA = r.accel ? r.accel.x[0] + r.accel.x[1] : null;
          const mu = m0 * m1 / (m0 + m1), M = m0 + m1;
          rows.push({ m0, m1, D0, gauge, relMesh, relNewt,
            ratio: (relNewt) ? relMesh / relNewt : null, muOverM: mu / M,
            cmAccel: cmMesh, sumAccel: sumA, stop: r.stop, structural: r.structural });
        }
      }
    }
    return { rows };
  });
}

// ---------- §3 共通並進不変性
if (want('galilei')) {
  R.galilei = await pg.evaluate(() => {
    const G = 6.674, EPS = 0.05, SEP = 240, PW = 1, MM = 500;
    const rows = [];
    for (const D0 of [0, 0.5, 8]) {
      for (const gauge of ['inertia', 'constraint']) {
        for (const V of [0.0, 1.0, 7.0]) {
          const b = [{ m: MM, x: -SEP / 2, y: 0, vx: V, vy: -0.4 + V },
            { m: MM, x: SEP / 2, y: 0, vx: V, vy: 0.4 + V }];
          const r = HP.dfmMeshV2Solve(b, { G, eps: EPS, p: PW, D0, eta: 1, gauge });
          rows.push({ D0, gauge, V, stop: r.stop,
            a0: r.accel ? [r.accel.x[0], r.accel.y[0]] : null,
            a1: r.accel ? [r.accel.x[1], r.accel.y[1]] : null,
            rel: r.accel ? [r.accel.x[1] - r.accel.x[0], r.accel.y[1] - r.accel.y[0]] : null,
            cm: r.accel ? [(r.accel.x[0] + r.accel.x[1]) / 2, (r.accel.y[0] + r.accel.y[1]) / 2] : null });
        }
      }
    }
    // V=0 に対する相対加速度のずれ
    const out = { rows, drift: [] };
    for (const D0 of [0, 0.5, 8]) for (const gauge of ['inertia', 'constraint']) {
      const g = rows.filter((z) => z.D0 === D0 && z.gauge === gauge);
      const base = g.find((z) => z.V === 0);
      for (const z of g) {
        if (!z.rel || !base.rel) continue;
        const sc = Math.max(Math.abs(base.rel[0]), Math.abs(base.rel[1]), 1e-300);
        out.drift.push({ D0, gauge, V: z.V,
          relDev: Math.max(Math.abs(z.rel[0] - base.rel[0]), Math.abs(z.rel[1] - base.rel[1])) / sc,
          cmDev: Math.max(Math.abs(z.cm[0] - base.cm[0]), Math.abs(z.cm[1] - base.cm[1])) });
      }
    }
    // **中心差分の刻み依存**(残差が刻みで動けば FD 由来・動かなければ則そのものの破れ)
    out.fd = [];
    for (const fdRel of [1e-4, 1e-5, 1e-6, 1e-7]) {
      for (const gauge of ['inertia', 'constraint']) {
        const mk = (V) => HP.dfmMeshV2Solve(
          [{ m: MM, x: -SEP / 2, y: 0, vx: V, vy: -0.4 + V }, { m: MM, x: SEP / 2, y: 0, vx: V, vy: 0.4 + V }],
          { G, eps: EPS, p: PW, D0: 8, eta: 1, gauge, fdRel });
        const a = mk(0), b = mk(7);
        const r0 = [a.accel.x[1] - a.accel.x[0], a.accel.y[1] - a.accel.y[0]];
        const r7 = [b.accel.x[1] - b.accel.x[0], b.accel.y[1] - b.accel.y[0]];
        const sc = Math.max(Math.abs(r0[0]), Math.abs(r0[1]));
        out.fd.push({ fdRel, gauge, D0: 8, V: 7, fdStep: a.fdStep,
          relDev: Math.max(Math.abs(r7[0] - r0[0]), Math.abs(r7[1] - r0[1])) / sc });
      }
    }
    return out;
  });
}

// ---------- §4 600 步の走行(既存トイ 対 mesh-v2 の 2 ゲージ)
if (want('run')) {
  R.run = await pg.evaluate(({ NSTEP }) => {
    const KEY = HP.SPACE_MESH_KEY;
    const G = 6.674, EPS = 0.05, DT = 0.016, MM = 500, SEP = 240;
    const mk = (D0, mode, mp) => {
      const [m0, m1] = mp || [MM, MM];
      const q = JSON.parse(JSON.stringify(HP.allPresets().find((z) => z.id === 'spaceMeshBinaryToy')));
      delete q.claims; delete q.massCalibration; delete q.scaleExp; delete q.overlays;
      q.sampleClass = 'principle';
      const sm = { mode: 'vertex', gravity: false, inertia: false, lawVersion: 'scalar', toyGain: 1 };
      if (mode === 'inertia' || mode === 'constraint') { sm.law = 'mesh-v2'; sm.meshGauge = mode; }
      if (mode === 'newton') sm.toyGain = 0;
      q.physics = { G, D0, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, kappaT: 0,
        cLight: 30, bM: 1, etaRad: 0, geoPN: (mode === 'plainNewton') ? 0 : 3,
        lambdaPN: 1, radiusScale: 1, softening: EPS,
        timeScale: 1, stateCarry: 'double', frameWeight: 'share', spaceMesh: sm };
      if (mode === 'plainNewton') delete q.physics.spaceMesh;
      // **重心静止**の初期条件(m0 v0 + m1 v1 = 0)—— 重心が歩くかどうかを測るため
      const M = m0 + m1, V = 0.4;
      q.bodies = [{ type: 'single', m: m0, x: -SEP * m1 / M, y: 0, vx: 0, vy: -V * m1 / M * 2, spin: 0, pinned: false },
        { type: 'single', m: m1, x: SEP * m0 / M, y: 0, vx: 0, vy: V * m0 / M * 2, spin: 0, pinned: false }];
      return HP.validatePreset(q);
    };
    const run = (D0, mode, n, mp) => {
      const v = mk(D0, mode, mp);
      if (!v.ok) return { err: (v.errors || []).join('|') };
      const S = HP.sim; S.build(v.preset);
      const osc = () => {
        const dx = S.x[1] - S.x[0], dy = S.y[1] - S.y[0], r = Math.hypot(dx, dy);
        const dvx = S.vx[1] - S.vx[0], dvy = S.vy[1] - S.vy[0], v2 = dvx * dvx + dvy * dvy;
        const inv = 2 / r - v2 / (G * (S.m[0] + S.m[1]));
        return { r, a: (inv !== 0) ? 1 / inv : null };
      };
      const a0 = osc();
      let stopN = 0, stops = {}, condMax = 0, minEigMin = Infinity;
      for (let k = 0; k < n; k++) {
        S.step(DT);
        if (S.geoToyStop) { stopN++; stops[S.geoToyStop] = (stops[S.geoToyStop] || 0) + 1; }
        if (S.meshV2) {
          if (S.meshV2.cond > condMax) condMax = S.meshV2.cond;
          if (S.meshV2.minEig < minEigMin) minEigMin = S.meshV2.minEig;
        }
      }
      const a1 = osc();
      return { a0: a0.a, a1: a1.a, r0: a0.r, r1: a1.r,
        da: (a0.a && a1.a) ? (a1.a - a0.a) / a0.a : null,
        st: [S.x[0], S.y[0], S.vx[0], S.vy[0], S.x[1], S.y[1], S.vx[1], S.vy[1]],
        cm: [(S.m[0] * S.x[0] + S.m[1] * S.x[1]) / (S.m[0] + S.m[1]),
          (S.m[0] * S.y[0] + S.m[1] * S.y[1]) / (S.m[0] + S.m[1])],
        pTot: [S.m[0] * S.vx[0] + S.m[1] * S.vx[1], S.m[0] * S.vy[0] + S.m[1] * S.vy[1]],
        stopN, stops, condMax: condMax || null, minEigMin: (minEigMin < Infinity) ? minEigMin : null,
        ledgerE: Math.abs(S.geoToyE + S.geoToyEmesh),
        ledgerP: Math.hypot(S.geoToyPx + S.geoToyMeshPx, S.geoToyPy + S.geoToyMeshPy),
        ledgerL: Math.abs(S.geoToyL + S.geoToyMeshL),
        clampR: S.clampRN, nan: S.hasNaN(), sig: JSON.stringify(v.preset.physics[KEY] || null) };
    };
    const O = {};
    for (const mp of [[MM, MM], [1000, 100]]) {
      for (const D0 of [0, 0.5, 2, 8]) {
        const key = 'm=' + mp.join('/') + ' D0=' + D0;
        O[key] = {};
        for (const mode of ['toy', 'inertia', 'constraint', 'plainNewton']) {
          O[key][mode] = run(D0, mode, NSTEP, mp);
        }
        const t = O[key];
        const dmax = (a, b) => (a.st && b.st) ? a.st.reduce((d, z, i) => Math.max(d, Math.abs(z - b.st[i])), 0) : null;
        t.diff = { toyVsInertia: dmax(t.toy, t.inertia), toyVsConstraint: dmax(t.toy, t.constraint),
          inertiaVsConstraint: dmax(t.inertia, t.constraint),
          relSepInertia: (t.inertia.r1 && t.constraint.r1) ? (t.inertia.r1 - t.constraint.r1) / t.inertia.r1 : null };
      }
    }
    // §4b **近点間 P**(位相制限つき検出器・予算内で 3 近点)—— 600 步は 1 公転の 1 割弱なので別に測る
    const periodOf = (D0, mode, mp) => {
      const v = mk(D0, mode, mp);
      if (!v.ok) return { err: (v.errors || []).join('|') };
      const S = HP.sim; S.build(v.preset);
      const det = createPeriastronDetector({ phaseGate: 1.5 * Math.PI });
      let nP = 0, kk = 0, stopN = 0;
      for (; kk < 400000; kk++) {
        S.step(DT);
        if (S.geoToyStop) stopN++;
        const dx = S.x[1] - S.x[0], dy = S.y[1] - S.y[0], rr = Math.hypot(dx, dy);
        const dvx = S.vx[1] - S.vx[0], dvy = S.vy[1] - S.vy[0];
        const rd = (rr > 0) ? (dx * dvx + dy * dvy) / rr : 0;
        const z = det.push(kk, rr, rd, Math.atan2(dy, dx));
        if (z.accepted) { nP++; if (nP >= 3) break; }
      }
      const res = det.result(3), peri = res.peri || [];
      return { steps: kk, nPeri: res.nPeri, stopN,
        P: (peri.length >= 2) ? (peri[peri.length - 1].k - peri[0].k) * DT / (peri.length - 1) : null };
    };
    O.period = {};
    for (const mode of ['toy', 'inertia', 'constraint', 'plainNewton'])
      O.period[mode] = periodOf(0.5, mode, [MM, MM]);
    return O;
  }, { NSTEP });
}

// ---------- §5 特異点近傍
if (want('sing')) {
  R.sing = await pg.evaluate(() => {
    const G = 6.674, EPS = 0.05, SEP = 240, PW = 1, MM = 500;
    const rows = [];
    for (const D0 of [0, 1e-9, 1e-6, 1e-3]) {
      for (const eta of [0.9, 0.99, 0.999, 0.9999, 1]) {
        for (const gauge of ['inertia', 'constraint']) {
          const b = [{ m: MM, x: -SEP / 2, y: 0, vx: 0, vy: -0.4 }, { m: MM, x: SEP / 2, y: 0, vx: 0, vy: 0.4 }];
          const r = HP.dfmMeshV2Solve(b, { G, eps: EPS, p: PW, D0, eta, gauge });
          rows.push({ D0, eta, gauge, chi: r.chi[0], minEig: r.minEig, cond: r.cond,
            minEigH: r.minEigH, condH: r.condH, structural: r.structural,
            condRed: r.condRed, rhsNull: r.rhsNull, stop: r.stop,
            hasAccel: !!r.accel, a0: r.accel ? r.accel.x[0] : null });
        }
      }
    }
    // 積分器側で stop が立つか(S.geoToyStop / S.meshV2.stop)
    const KEY = HP.SPACE_MESH_KEY;
    const step = (D0, eta, gauge) => {
      const q = JSON.parse(JSON.stringify(HP.allPresets().find((z) => z.id === 'spaceMeshBinaryToy')));
      delete q.claims; delete q.massCalibration; delete q.scaleExp; delete q.overlays;
      q.sampleClass = 'principle';
      q.physics = { G, D0, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, kappaT: 0,
        cLight: 30, bM: 1, etaRad: 0, geoPN: 3, lambdaPN: 1, radiusScale: 1, softening: EPS,
        timeScale: 1, stateCarry: 'double', frameWeight: 'share',
        spaceMesh: { mode: 'vertex', gravity: false, inertia: false, lawVersion: 'scalar',
          toyGain: eta, law: 'mesh-v2', meshGauge: gauge } };
      q.bodies = [{ type: 'single', m: MM, x: -SEP / 2, y: 0, vx: 0, vy: -0.4, spin: 0, pinned: false },
        { type: 'single', m: MM, x: SEP / 2, y: 0, vx: 0, vy: 0.4, spin: 0, pinned: false }];
      const v = HP.validatePreset(q);
      if (!v.ok) return { err: (v.errors || []).join('|') };
      const S = HP.sim; S.build(v.preset);
      S.step(0.016);
      return { stop: S.geoToyStop, N: S.geoToyN, dv: S.geoToyDv,
        meshV2: S.meshV2 ? { minEig: S.meshV2.minEig, cond: S.meshV2.cond, stop: S.meshV2.stop,
          structural: S.meshV2.structural, gauge: S.meshV2.gauge } : null };
    };
    const steps = [];
    for (const [D0, eta] of [[0, 1], [0, 0.999999], [1e-9, 1], [1e-6, 1], [1e-3, 1], [0.5, 1]])
      for (const gauge of ['inertia', 'constraint']) steps.push({ D0, eta, gauge, r: step(D0, eta, gauge) });
    // 3 体・pinned・箱の門
    const gate = (kind) => {
      const q = JSON.parse(JSON.stringify(HP.allPresets().find((z) => z.id === 'spaceMeshBinaryToy')));
      delete q.claims; delete q.massCalibration; delete q.scaleExp; delete q.overlays;
      q.sampleClass = 'principle';
      q.physics = { G, D0: 0.5, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, kappaT: 0,
        cLight: 30, bM: 1, etaRad: 0, geoPN: 3, lambdaPN: 1, radiusScale: 1, softening: EPS,
        timeScale: 1, stateCarry: 'double', frameWeight: 'share',
        spaceMesh: { mode: 'vertex', gravity: false, inertia: false, lawVersion: 'scalar',
          law: 'mesh-v2', meshGauge: 'inertia' } };
      q.bodies = [{ type: 'single', m: MM, x: -SEP / 2, y: 0, vx: 0, vy: -0.4, spin: 0, pinned: (kind === 'pinned') },
        { type: 'single', m: MM, x: SEP / 2, y: 0, vx: 0, vy: 0.4, spin: 0, pinned: false }];
      if (kind === 'three') q.bodies.push({ type: 'single', m: 10, x: 0, y: 600, vx: 0.1, vy: 0, spin: 0, pinned: false });
      const v = HP.validatePreset(q);
      if (!v.ok) return { err: (v.errors || []).join('|') };
      const S = HP.sim; S.build(v.preset); S.step(0.016);
      return { stop: S.geoToyStop, N: S.geoToyN, meshV2: S.meshV2 };
    };
    return { rows, steps, gates: { three: gate('three'), pinned: gate('pinned'), ok: gate('ok') } };
  });
}

// ---------- §6 η=0 は Newton へ戻る
if (want('newton')) {
  R.newton = await pg.evaluate(() => {
    const KEY = HP.SPACE_MESH_KEY;
    const G = 6.674, EPS = 0.05, DT = 0.016, MM = 500, SEP = 240;
    const mk = (eta, mode) => {
      const q = JSON.parse(JSON.stringify(HP.allPresets().find((z) => z.id === 'spaceMeshBinaryToy')));
      delete q.claims; delete q.massCalibration; delete q.scaleExp; delete q.overlays;
      q.sampleClass = 'principle';
      q.physics = { G, D0: 0.5, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, kappaT: 0,
        cLight: 30, bM: 1, etaRad: 0, geoPN: (mode === 'plain') ? 0 : 3, lambdaPN: 1,
        radiusScale: 1, softening: EPS, timeScale: 1, stateCarry: 'double', frameWeight: 'share' };
      if (mode !== 'plain') q.physics.spaceMesh = { mode: 'vertex', gravity: false, inertia: false,
        lawVersion: 'scalar', toyGain: eta, law: 'mesh-v2', meshGauge: mode };
      q.bodies = [{ type: 'single', m: MM, x: -SEP / 2, y: 0, vx: 0, vy: -0.4, spin: 0, pinned: false },
        { type: 'single', m: MM, x: SEP / 2, y: 0, vx: 0, vy: 0.4, spin: 0, pinned: false }];
      return HP.validatePreset(q);
    };
    const run = (eta, mode, n) => {
      const v = mk(eta, mode);
      if (!v.ok) return { err: (v.errors || []).join('|') };
      const S = HP.sim; S.build(v.preset);
      let dvMax = 0;
      for (let k = 0; k < n; k++) { S.step(DT); if (S.geoToyDv > dvMax) dvMax = S.geoToyDv; }
      return { st: [S.x[0], S.y[0], S.vx[0], S.vy[0], S.x[1], S.y[1], S.vx[1], S.vy[1]], dvMax,
        stop: S.geoToyStop };
    };
    const plain = run(0, 'plain', 600);
    const out = {};
    for (const gauge of ['inertia', 'constraint']) {
      const z = run(0, gauge, 600), z1 = run(0, gauge, 1);
      out[gauge] = { dvMax1: z1.dvMax, dvMax600: z.dvMax,
        bitSame: z.st.every((w, i) => Object.is(w, plain.st[i])),
        maxDiff: z.st.reduce((d, w, i) => Math.max(d, Math.abs(w - plain.st[i])), 0),
        relDiff: z.st.reduce((d, w, i) => Math.max(d, Math.abs(w - plain.st[i]) / Math.max(1e-30, Math.abs(plain.st[i]))), 0) };
    }
    return { plain: plain.st, out };
  });
}

await browser.close();
R.pageErrors = pageErrors;
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
const ex = (z) => (z === null || z === undefined) ? '—' : Number(z).toExponential(3);
if (R.hess) {
  console.log('[w265b-meshv2] §1 H 検査(等質量 500・分離 240・p=1)');
  console.log(' D0    η     gauge       χ          sym(rel)  λmin(H)   λmax(H)   cond(H)   λ解析の相対差(lo/hi)  構造的  行和ずれ  δ');
  for (const z of R.hess.rows) {
    console.log(' ' + String(z.D0).padEnd(5) + ' ' + String(z.eta).padEnd(5) + ' ' + z.gauge.padEnd(11)
      + ' ' + z.chi.toFixed(8) + ' ' + ex(z.symRel) + ' ' + ex(z.minEigH) + ' ' + ex(z.maxEigH)
      + ' ' + ex(z.condH) + ' ' + ex(z.eigLoRel) + '/' + ex(z.eigHiRel)
      + ' ' + String(z.structural).padEnd(6) + ' ' + ex(z.rowDev) + ' ' + ex(z.delta));
  }
}
if (R.rest) {
  console.log('[w265b-meshv2] §2 静止 2 体(v=0)の相対加速度 / Newton');
  console.log(' m0    m1    D0    gauge       rel(mesh)   rel(Newton) 比          μ/M        Σa        重心 a');
  for (const z of R.rest.rows) {
    console.log(' ' + String(z.m0).padEnd(5) + ' ' + String(z.m1).padEnd(5) + ' ' + String(z.D0).padEnd(5)
      + ' ' + z.gauge.padEnd(11) + ' ' + ex(z.relMesh) + ' ' + ex(z.relNewt) + ' '
      + (z.ratio === null ? '—' : z.ratio.toFixed(8)) + ' ' + z.muOverM.toFixed(8)
      + ' ' + ex(z.sumAccel) + ' ' + ex(z.cmAccel));
  }
}
if (R.galilei) {
  console.log('[w265b-meshv2] §3 共通並進(V を全粒子へ足す)');
  for (const z of R.galilei.drift)
    console.log(' D0=' + String(z.D0).padEnd(4) + ' ' + z.gauge.padEnd(11) + ' V=' + String(z.V).padEnd(5)
      + ' 相対加速度のずれ(相対)=' + ex(z.relDev) + ' 重心加速度のずれ=' + ex(z.cmDev));
  console.log('  中心差分の刻み依存(D₀=8・V=7):');
  for (const z of R.galilei.fd || [])
    console.log('   fdRel=' + String(z.fdRel).padEnd(7) + ' (' + ex(z.fdStep) + ') ' + z.gauge.padEnd(11)
      + ' 相対ずれ=' + ex(z.relDev));
}
if (R.run) {
  console.log('[w265b-meshv2] §4 ' + NSTEP + ' 步(既存トイ 対 mesh-v2 の 2 ゲージ)');
  for (const k of Object.keys(R.run)) {
    if (k === 'period') continue;
    const t = R.run[k];
    console.log(' ' + k);
    for (const m of ['toy', 'inertia', 'constraint', 'plainNewton']) {
      const z = t[m]; if (!z || z.err) { console.log('   ' + m + ' ERR ' + (z && z.err)); continue; }
      console.log('   ' + m.padEnd(12) + ' a=' + ex(z.a1) + ' Δa/a=' + ex(z.da) + ' r=' + ex(z.r1)
        + ' 重心=[' + ex(z.cm[0]) + ',' + ex(z.cm[1]) + '] |P|=' + ex(Math.hypot(z.pTot[0], z.pTot[1]))
        + ' 停止步=' + z.stopN + ' 帳簿|E|=' + ex(z.ledgerE) + ' |P|=' + ex(z.ledgerP)
        + ' cond_max=' + ex(z.condMax) + ' NaN=' + z.nan);
    }
    console.log('   差: toy対inertia=' + ex(t.diff.toyVsInertia) + ' toy対constraint=' + ex(t.diff.toyVsConstraint)
      + ' inertia対constraint=' + ex(t.diff.inertiaVsConstraint) + ' 分離の相対差=' + ex(t.diff.relSepInertia));
  }
  if (R.run.period) {
    console.log(' §4b 近点間 P(m=500/500・D₀=0.5・位相制限 1.5π・3 近点)');
    const pn = R.run.period.plainNewton ? R.run.period.plainNewton.P : null;
    for (const m of Object.keys(R.run.period)) {
      const z = R.run.period[m];
      console.log('   ' + m.padEnd(12) + ' P=' + (z.P === null ? '—(近点 ' + z.nPeri + ' 個)' : z.P.toFixed(6))
        + ' 步=' + z.steps + ' 停止步=' + z.stopN
        + (pn && z.P ? ' Newton 比=' + (z.P / pn).toFixed(8) : ''));
    }
  }
}
if (R.sing) {
  console.log('[w265b-meshv2] §5 特異点近傍(純関数)');
  console.log(' D0        η        gauge       χ          λmin      cond      構造的  cond_red  stop');
  for (const z of R.sing.rows)
    console.log(' ' + String(z.D0).padEnd(9) + ' ' + String(z.eta).padEnd(8) + ' ' + z.gauge.padEnd(11)
      + ' ' + z.chi.toFixed(8) + ' ' + ex(z.minEig) + ' ' + ex(z.cond) + ' '
      + String(z.structural).padEnd(6) + ' ' + ex(z.condRed) + ' ' + (z.stop || '—'));
  console.log(' 積分器側:');
  for (const s of R.sing.steps)
    console.log('  D0=' + String(s.D0).padEnd(8) + ' η=' + String(s.eta).padEnd(9) + ' ' + s.gauge.padEnd(11)
      + ' stop=' + String(s.r.stop).padEnd(24) + ' N=' + s.r.N + ' dv=' + ex(s.r.dv));
  console.log(' 門: 3 体=' + R.sing.gates.three.stop + ' / pinned=' + R.sing.gates.pinned.stop
    + ' / 2 体自由=' + R.sing.gates.ok.stop);
}
if (R.newton) {
  console.log('[w265b-meshv2] §6 η=0 は Newton へ戻る(600 步・plain geoPN=0 との差)');
  for (const g of Object.keys(R.newton.out)) {
    const z = R.newton.out[g];
    console.log(' ' + g.padEnd(11) + ' ビット同一=' + z.bitSame + ' 最大差=' + ex(z.maxDiff)
      + ' 相対=' + ex(z.relDiff) + ' 1 步の Δv=' + ex(z.dvMax1) + ' 600 步の Δv 最大=' + ex(z.dvMax600));
  }
}
console.log(' out=' + OUT + ' pageErrors=' + pageErrors.length);

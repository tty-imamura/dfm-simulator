// 第259便b(第51報 W2): 親子コア(同心層)・3D スピン参照場・歳差/粘性緩和・K_cs 熱記帳の実測器。
//
// 測るもの:
//   ① 検証器: 受理 1 例 + 拒否 5 例(並進自由度・入れ子 layers・r 昇順・Σm 不一致・層数超過)+
//      **未宣言のプリセットの正準形に layers が 1 文字も出ない**こと
//   ② 球殻内部の重力 0(r<r_core)・遠方の点源一致(r≥r_shell)・中間帯の包含質量則 —— いずれも
//      **layers あり/なしの 1 步 Δv の差**で測る(接触ばね等の他チャネルは両側で同じなので厳密に落ちる)
//   ③ 運動量の閉性(Σ m Δv = 0)と、遠方だけの系の 600 步ビット同一
//   ④ 慣性核 w=m(r²+ε²)^(−p/2) の**有限半径積分**(点源比)—— p=1/2/3 × 薄殻/一様球(重力の球殻積分とは別)
//   ⑤ 融合(body 単位)の M/P/J 保存と、層合成則 2 案("role" 合算 / "add" 追加)の比較
//   ⑥ 3D スピン参照場: θ×歳差率×位相差 の面外流 RMS・面内引きずり・場のノルム
//   ⑦ 保守的歳差(E 不変・|J_c| 不変)と傾ける仕事(0.75 の例)・粘性緩和の Q_old/Q_exact 比
//
// 実行: QA_TARGET=beta/index.html node tests/exp-w259b-layers.mjs
//       (結果 JSON は W259B_OUT / 既定 tests/out/w259b-layers.json)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + (path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET));
const OUT = process.env.W259B_OUT || path.join(ROOT, 'tests', 'out', 'w259b-layers.json');

const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }

const page = await browser.newPage();
const pageErrors = [];
page.on('pageerror', (e) => pageErrors.push(String(e.message || e)));
await page.goto(INDEX, { waitUntil: 'load' });
await page.waitForFunction(() => window.HP && HP.sim);

const R = await page.evaluate(() => {
  const out = {};
  const mkP = (bodies, ph) => ({
    id: 'w259b', name: 'w259b', description: 'w259b の器。', emoji: '🧪',
    camera: { scale: 300 }, world: { boundary: 'none', size: 0 }, seed: 1,
    physics: Object.assign({ G: 1, D0: 0, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
      kappaT: 1 / 60, cLight: 30, contactK: 0.1, contactCap: 0.01, bM: 1, etaRad: 0, pRad: 4,
      gravityX: 0, gravityY: 0, geoPN: 0, lambdaPN: 1, pnAlpha: 1.5,
      radiusScale: 1, softening: 0.5, timeScale: 1 }, ph || {}),
    bodies, overlays: {} });
  const sgl = (o) => Object.assign({ type: 'single', m: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }, o);

  // ---------- ① 検証器 ----------
  {
    const LY = [{ role: 'core', m: 900, r: 20 }, { role: 'shell', m: 100, r: 100 }];
    const ok = HP.validatePreset(mkP([sgl({ m: 1000, radius: 1, layers: JSON.parse(JSON.stringify(LY)) })]));
    const acc = ok.ok && Array.isArray(ok.preset.bodies[0].layers) && ok.preset.bodies[0].layers.length === 2
      && ok.warnings.length === 0;
    const rej = (ly, extra) => {
      const v = HP.validatePreset(mkP([sgl(Object.assign({ m: 1000, radius: 1, layers: ly }, extra || {}))]));
      return { ok: v.ok, dropped: v.ok && v.preset.bodies[0].layers === undefined,
        warn: (v.warnings || []).filter((w) => String(w).includes('layers')).length };
    };
    out.validate = {
      accept: acc, acceptWarn: ok.warnings.length,
      r1_translation: rej([{ role: 'core', m: 900, r: 20, vx: 1 }, { role: 'shell', m: 100, r: 100 }]),
      r2_nested: rej([{ role: 'core', m: 900, r: 20, layers: [{ role: 'core', m: 1, r: 1 }] }, { role: 'shell', m: 100, r: 100 }]),
      r3_order: rej([{ role: 'core', m: 900, r: 100 }, { role: 'shell', m: 100, r: 20 }]),
      r4_masssum: rej([{ role: 'core', m: 900, r: 20 }, { role: 'shell', m: 300, r: 100 }]),
      r5_count: rej(Array.from({ length: 9 }, (_, k) => ({ role: 'core', m: 1000 / 9, r: k + 1 }))),
      r6_group: (() => {
        const v = HP.validatePreset(mkP([{ type: 'disk', n: 4, cx: 0, cy: 0, radius: 10, mMin: 1, mMax: 1,
          spinMin: 0, spinMax: 0, vMode: 'none', aroundMass: 0, vScale: 0, direction: 1,
          layers: [{ role: 'core', m: 0.5, r: 1 }, { role: 'shell', m: 0.5, r: 2 }] }]));
        return { ok: v.ok, warn: (v.warnings || []).filter((w) => String(w).includes('layers')).length };
      })(),
      // 未宣言プリセットの正準形に layers が出ない
      cleanSig: (() => {
        const v = HP.validatePreset(mkP([sgl({ m: 1000, radius: 1 })]));
        return v.ok && JSON.stringify(v.preset).indexOf('layers') < 0;
      })()
    };
  }

  // ---------- ②③ 球殻内部 0 / 遠方点源 / 中間帯 ----------
  {
    const eps = 0.5, G = 1, LY = [{ role: 'core', m: 900, r: 20 }, { role: 'shell', m: 100, r: 100 }];
    const DS = [5, 8, 14, 19.5, 20.5, 50, 75, 99.5, 100.5, 300, 500];
    const mk = (withLayers) => {
      const b = [sgl({ m: 1000, radius: 1, pinned: false })];
      if (withLayers) b[0].layers = JSON.parse(JSON.stringify(LY));
      for (const d of DS) b.push(sgl({ m: 1e-6, rMul: 0.2, x: d, y: 0 }));
      return mkP(b);
    };
    const run1 = (withLayers) => {
      const v = HP.validatePreset(mk(withLayers));
      const S = HP.sim; S.build(v.preset);
      const v0 = [], m0 = [];
      for (let i = 0; i < S.n; i++) { v0.push(S.vx[i]); m0.push(S.m[i]); }
      S.step(1e-6);
      const dv = [];
      for (let i = 0; i < S.n; i++) dv.push((S.vx[i] - v0[i]) / 1e-6);
      return { dv, m: m0, n: S.n, layerN: S.layerN, has: S.hasBodyLayers };
    };
    const A = run1(true), B = run1(false);
    const rows = [];
    let pRes = 0, pScale = 0;
    for (let k = 0; k < DS.length; k++) {
      const d = DS[k], i = k + 1;
      const sq = Math.pow(d * d + eps * eps, 1.5);
      let mEnc = 0; for (const L of LY) if (L.r <= d) mEnc += L.m;
      const aPoint = -G * 1000 * d / sq, aLay = -G * mEnc * d / sq;   // x 方向(中心へ向かうので負)
      const meas = A.dv[i] - B.dv[i], theo = aLay - aPoint;
      rows.push({ d, mEnc, aPoint, aLayered: aLay, measDiff: meas, theoDiff: theo,
        err: Math.abs(meas - theo), rel: Math.abs(theo) > 0 ? Math.abs(meas - theo) / Math.abs(theo) : Math.abs(meas) });
    }
    // 運動量の閉性(層パスの Δv の質量加重和 = 0)
    for (let i = 0; i < A.n; i++) { const dd = (A.dv[i] - B.dv[i]) * A.m[i]; pRes += dd; pScale += Math.abs(dd); }
    out.shell = { rows, momRes: pRes, momScale: pScale, layerN: A.layerN, hasFlag: A.has, hasFlagOff: B.has };

    // 遠方だけの系は 600 步ビット同一
    const farOnly = (withLayers) => {
      const b = [sgl({ m: 1000, radius: 1, pinned: false })];
      if (withLayers) b[0].layers = JSON.parse(JSON.stringify(LY));
      b.push(sgl({ m: 1e-3, rMul: 0.2, x: 300, y: 0, vy: 1.8257381 }));
      b.push(sgl({ m: 1e-3, rMul: 0.2, x: 0, y: -500, vx: 1.4142125 }));
      const v = HP.validatePreset(mkP(b));
      const S = HP.sim; S.build(v.preset);
      for (let k = 0; k < 600; k++) S.step(0.016);
      const buf = [];
      for (let i = 0; i < S.n; i++) buf.push(S.x[i], S.y[i], S.vx[i], S.vy[i]);
      return buf.join(',');
    };
    out.farBitSame = (farOnly(true) === farOnly(false));

    // **自己層の二重計上が無いこと**: 遠方の絶対加速度が総質量 1000 の点源と一致する
    // (層を「独立した粒子」として _core へも渡していたら 2000 相当になる)
    {
      const b = [sgl({ m: 1000, radius: 1, pinned: true, layers: JSON.parse(JSON.stringify(LY)) }),
        sgl({ m: 1e-6, rMul: 0.2, x: 300, y: 0 })];
      const v = HP.validatePreset(mkP(b));
      const S = HP.sim; S.build(v.preset);
      S.step(1e-3);
      const a = S.vx[1] / 1e-3, th = -G * 1000 * 300 / Math.pow(300 * 300 + eps * eps, 1.5);
      out.selfLayer = { aMeasured: a, aPointTotal: th, rel: Math.abs(a - th) / Math.abs(th),
        mEff: 1000, layerN: S.layerN };
    }

    // **運動量の閉性**(自由な 2 体を 600 步): Δ(Σ m v)+リザーバ / スケール
    {
      const mk2 = (withLayers) => {
        const b = [sgl({ m: 1000, radius: 1, x: 0, y: 0 })];
        if (withLayers) b[0].layers = JSON.parse(JSON.stringify(LY));
        b.push(sgl({ m: 1, rMul: 0.5, x: 40, y: 0, vy: 4.2 }));
        const v = HP.validatePreset(mkP(b));
        const S = HP.sim; S.build(v.preset);
        const T0 = S.totals();
        const P0 = [T0.px + S.resPx, T0.py + S.resPy, T0.L + S.resL];
        for (let k = 0; k < 600; k++) S.step(0.016);
        const T1 = S.totals();
        const P1 = [T1.px + S.resPx, T1.py + S.resPy, T1.L + S.resL];
        let sc = 0; for (let i = 0; i < S.n; i++) sc += Math.abs(S.m[i]) * Math.hypot(S.vx[i], S.vy[i]);
        return { dP: Math.hypot(P1[0] - P0[0], P1[1] - P0[1]), dL: Math.abs(P1[2] - P0[2]),
          Pscale: sc, Lscale: Math.abs(P0[2]), nan: S.hasNaN(), layerN: S.layerN };
      };
      out.momentum = { withLayers: mk2(true), noLayers: mk2(false) };
    }
  }

  // ---------- ④ 慣性核の有限半径積分 ----------
  {
    const tbl = [];
    for (const p of [1, 2, 3]) {
      for (const shape of ['shell', 'uniform']) {
        for (const d of [0.5, 1.5, 3, 10, 100]) {
          const r = HP.dfmLayerKernel({ m: 1, r: 1 }, d, { p, eps: 0.05, shape, nodes: 4000 });
          const r2 = HP.dfmLayerKernel({ m: 1, r: 1 }, d, { p, eps: 0.05, shape, nodes: 8000 });
          tbl.push({ p, shape, d, ratio: r ? r.ratio : null, point: r ? r.point : null,
            conv: (r && r2) ? Math.abs(r.value - r2.value) / Math.abs(r.value) : null });
        }
      }
    }
    out.kernel = tbl;
    out.kernelGates = [HP.dfmLayerKernel({ m: 1, r: 1 }, 1, { p: 0 }), HP.dfmLayerKernel({ m: -1, r: 1 }, 1, {}),
      HP.dfmLayerKernel({ m: 1, r: 0 }, 1, {}), HP.dfmLayerKernel({ m: 1, r: 1 }, 1, { shape: 'x' })].every((z) => z === null);
    // 重力側(球殻定理)の純関数の門と値
    const g = HP.dfmLayerGravity([{ role: 'core', m: 900, r: 20 }, { role: 'shell', m: 100, r: 100 }], 50, { G: 1, eps: 0.5 });
    out.gravPure = g;
    out.gravGates = [HP.dfmLayerGravity([], 1, {}), HP.dfmLayerGravity([{ m: 1, r: 2 }, { m: 1, r: 1 }], 1, {}),
      HP.dfmLayerGravity([{ m: -1, r: 1 }], 1, {})].every((z) => z === null);
  }

  // ---------- ⑤ 融合(body 単位)の保存と層合成則 2 案 ----------
  {
    const LA = [{ role: 'core', m: 90, r: 2 }, { role: 'shell', m: 10, r: 10 }];
    const LB = [{ role: 'core', m: 45, r: 1.5 }, { role: 'shell', m: 5, r: 8 }];
    const role = HP.dfmLayerMerge(LA, LB, 'role'), add = HP.dfmLayerMerge(LA, LB, 'add');
    const sum = (a) => a.reduce((s, L) => s + L.m, 0);
    const asc = (a) => a.every((L, k) => k === 0 || L.r > a[k - 1].r);
    // 繰り返し融合(8 回)で層数がどう伸びるか
    let cr = LA.slice(), ca = LA.slice();
    for (let k = 0; k < 8; k++) { cr = HP.dfmLayerMerge(cr, LB, 'role'); ca = HP.dfmLayerMerge(ca, LB, 'add'); }
    out.merge = { role, add, sumRole: sum(role), sumAdd: sum(add), ascRole: asc(role), ascAdd: asc(add),
      rep8Role: { n: cr.length, sum: sum(cr), asc: asc(cr) }, rep8Add: { n: ca.length, sum: sum(ca), asc: asc(ca) } };

    // 実エンジンの融合(層あり / 層なしの対照 —— 残差が同じなら本便は帳簿を 1 つも動かしていない)
    const runFuse = (withLayers) => {
      const b = [sgl({ m: 100, radius: 3, x: -6, y: 0, vx: 0.5, vy: 0, spin: 0.2 }),
        sgl({ m: 50, radius: 3, x: 6, y: 0, vx: -0.5, vy: 0.2, spin: -0.1 })];
      if (withLayers) { b[0].layers = JSON.parse(JSON.stringify(LA)); b[1].layers = JSON.parse(JSON.stringify(LB)); }
      const pr = mkP(b); pr.fusion = { dFrac: 0.7 }; pr.thermal = 'tint';
      const v = HP.validatePreset(pr);
      const S = HP.sim; S.build(v.preset);
      const T0 = S.totals(); let M0 = 0; for (let i = 0; i < S.n; i++) M0 += S.m[i];
      const P0 = { px: T0.px + S.resPx, py: T0.py + S.resPy, L: T0.L + S.resL };
      for (let k = 0; k < 4000 && S.n > 1; k++) S.step(0.004);
      const T1 = S.totals(); let M1 = 0; for (let i = 0; i < S.n; i++) M1 += S.m[i];
      const P1 = { px: T1.px + S.resPx + S.fusPx, py: T1.py + S.resPy + S.fusPy, L: T1.L + S.resL + S.fusL };
      const lay = [];
      for (let q = 0; q < (S.layN ? S.layN[0] : 0); q++)
        lay.push({ role: HP.BODY_LAYER_ROLES[S.layRl[q]], m: S.layM[q], r: S.layR[q] });
      return { fused: S.n === 1 ? 1 : 0, n: S.n, M0, M1, dM: M1 - M0,
        dPx: P1.px - P0.px, dPy: P1.py - P0.py, dL: P1.L - P0.L,
        Lscale: Math.abs(P0.L), Pscale: Math.hypot(P0.px, P0.py), lay,
        layMassRes: S.layMassRes, laySum: lay.reduce((s, L) => s + L.m, 0), m0: S.m[0], nan: S.hasNaN() };
    };
    out.fuse = runFuse(true);
    out.fuseNoLayers = runFuse(false);
  }

  // ---------- ⑥ 3D スピン参照場 ----------
  {
    const rows = [], NPSI = 720, R0 = 1;
    const uAt = (th, phi, psi) => {
      const w = [Math.sin(th) * Math.cos(phi), Math.sin(th) * Math.sin(phi), Math.cos(th)];
      const r = [R0 * Math.cos(psi), R0 * Math.sin(psi), 0];
      return HP.dfmSpinField3D(w, r, { R: 1e9, q: 0 });   // a≈1(幾何だけを見る)
    };
    for (const thd of [0, 30, 60, 90]) {
      const th = thd * Math.PI / 180;
      // (a) 環まわりの面外流 RMS(歳差なし・幾何そのもの)
      let s2 = 0, inp = 0, nrm = 0;
      for (let k = 0; k < NPSI; k++) { const psi = 2 * Math.PI * k / NPSI, u = uAt(th, 0, psi);
        s2 += u[2] * u[2]; inp += Math.hypot(u[0], u[1]); nrm += Math.hypot(u[0], u[1], u[2]); }
      const ringRms = Math.sqrt(s2 / NPSI), inPlane = inp / NPSI, norm = nrm / NPSI;
      // (b) 伴星位置での u_z: 歳差率 × 位相差
      const comp = {};
      for (const pr of [0, 0.5, 1, 2]) {
        for (const ph of [0, 90]) {
          let m1 = 0, q2 = 0;
          for (let k = 0; k < NPSI; k++) { const psi = 2 * Math.PI * k / NPSI;
            const phi = pr * psi + ph * Math.PI / 180;
            const u = uAt(th, phi, psi); m1 += u[2]; q2 += u[2] * u[2]; }
          comp['p' + pr + '_' + ph] = { mean: m1 / NPSI, rms: Math.sqrt(q2 / NPSI) };
        }
      }
      rows.push({ theta: thd, ringRms, sinOverSqrt2: Math.sin(th) / Math.SQRT2, inPlane, cosTheta: Math.abs(Math.cos(th)), norm, comp });
    }
    out.spin3d = rows;
    // 減衰 a(d)=(R/(R+d))^q(q は角速度の指数 — 速度は r^(1−q))
    const decay = [];
    for (const q of [0, 1, 2, 3]) {
      const row = { q, a: [], v: [] };
      for (const d of [0.5, 1, 2, 5, 10]) {
        const u = HP.dfmSpinField3D([0, 0, 1], [d, 0, 0], { R: 1, q });
        row.a.push(Math.pow(1 / (1 + d), q)); row.v.push(Math.hypot(u[0], u[1], u[2]));
      }
      decay.push(row);
    }
    out.spinDecay = decay;
    out.spinGates = [HP.dfmSpinField3D([0, 0], [1, 0, 0], {}), HP.dfmSpinField3D([0, 0, 1], [1, 0], {}),
      HP.dfmSpinField3D([0, 0, 1], [1, 0, 0], { R: -1 }), HP.dfmSpinField3D([0, 0, NaN], [1, 0, 0], {})].every((z) => z === null);
  }

  // ---------- ⑦ 保守的歳差 / 傾ける仕事 / 粘性緩和 ----------
  {
    // 保守的歳差: J_c が J_s と非平行なら実際に回り、|J_c| は不変・コアの E は不変
    const pr1 = HP.dfmSpinPrecess({ Js: [0, 0, 1], Jc: [0.5, 0, 0.5], k: 0.3, dt: 0.7, Is: 1, Ic: 1 });
    const pr2 = HP.dfmSpinPrecess({ Js: [0, 0, 1], Jc: [0.5, 0, 0.5], angle: Math.PI / 2, Is: 1e18, Ic: 1 });
    // 傾ける仕事(0.75 の例): |J_s|=1・|J_c|=0.5・I_s=1・α=90°
    const tw = HP.dfmTiltWork({ Js: [0, 0, 1], Jc: [0, 0, 0.5], Is: 1, Ic: 1, alpha: Math.PI / 2 });
    const twTab = [];
    for (const ad of [30, 60, 90, 180]) {
      const t = HP.dfmTiltWork({ Js: [0, 0, 1], Jc: [0, 0, 0.5], Is: 1, Ic: 1, alpha: ad * Math.PI / 180 });
      twTab.push({ alphaDeg: ad, dE: t.dE, theory: (1 - Math.cos(ad * Math.PI / 180)) * (1 * 0.5 + 0.25) / 1,
        absJcKept: Math.abs(t.absJc1 - t.absJc0) });
    }
    // 粘性緩和: Q_old/Q_exact = 1/(2−f)
    const rel = [];
    for (const kd of [1e-4, 1e-3, 1e-2, 0.1, 1, 5]) {
      const r = HP.dfmSpinRelax({ Ic: 2, Is: 5, Kcs: kd, dt: 1, omegaC: 3, omegaS: -1 });
      rel.push({ Kdt: kd, f: r.f, Qold: r.Qold, Qexact: r.Qexact, ratio: r.ratio,
        theory: 1 / (2 - r.f), dEmatch: Math.abs(r.dE - r.Qexact), Jres: Math.abs(r.Jtot1 - r.Jtot0) });
    }
    out.precess = { pr1: { absJc0: pr1.absJc0, absJc1: pr1.absJc1, dEc: pr1.dEc, dE: pr1.dE,
      Jres: Math.hypot(pr1.Jtot1[0] - pr1.Jtot0[0], pr1.Jtot1[1] - pr1.Jtot0[1], pr1.Jtot1[2] - pr1.Jtot0[2]), angle: pr1.angle },
      pr2: { absJcKept: Math.abs(pr2.absJc1 - pr2.absJc0), dE: pr2.dE, dEc: pr2.dEc } };
    out.tilt = { dE: tw.dE, E0: tw.E0, E1: tw.E1, absJcKept: Math.abs(tw.absJc1 - tw.absJc0), table: twTab };
    out.relax = rel;

    // 本体の K_cs 診断列(S.QcsOld / S.QcsExact)が純関数と一致するか
    const b = [sgl({ m: 100, radius: 3, spin: 0.5, pinned: true,
      core: { mode: 'differential', massFrac: 0.5, radius: 1.5, omega: 6, Kcs: 0.5 } })];
    const v = HP.validatePreset(mkP(b));
    const S = HP.sim; S.build(v.preset);
    for (let k = 0; k < 200; k++) S.step(0.016);
    out.engineKcs = { QcsOld: S.QcsOld, QcsExact: S.QcsExact, n: S.QcsN,
      ratio: S.QcsExact !== 0 ? S.QcsOld / S.QcsExact : null, radE: S.radE };
  }

  // ---------- 全内蔵プリセット: layers 宣言の有無 ----------
  {
    const decl = HP.allPresets().filter((p) => (p.bodies || []).some((b) => b && b.layers)).map((p) => p.id);
    out.builtinsWithLayers = decl;
    out.builtinCount = HP.allPresets().length;
    // 🧅 が読めるか
    const t = HP.allPresets().find((p) => p.id === 'layeredCoreDFM');
    if (t) {
      const v = HP.validatePreset(JSON.parse(JSON.stringify(t)));
      const S = HP.sim; S.build(v.preset);
      const r0 = [];
      for (let i = 1; i < S.n; i++) r0.push(Math.hypot(S.x[i], S.y[i]));
      for (let k = 0; k < 1250; k++) S.step(0.016);   // t=20
      const r1 = [];
      for (let i = 1; i < S.n; i++) r1.push(Math.hypot(S.x[i], S.y[i]));
      out.sample = { ok: v.ok, warn: v.warnings.length, n: S.n, r0, r1,
        drift: r0.map((z, k) => r1[k] - z), nan: S.hasNaN(), layerN: S.layerN,
        clamp: S.clampVN + S.clampSN + S.clampRN + S.clampTN + S.clampAN };
      // ワンタップ対照: layers を外す(= 点源 1000)
      const q = JSON.parse(JSON.stringify(t)); delete q.bodies[0].layers;
      const v2 = HP.validatePreset(q);
      const S2 = HP.sim; S2.build(v2.preset);
      for (let k = 0; k < 1250; k++) S2.step(0.016);
      const r2 = [];
      for (let i = 1; i < S2.n; i++) r2.push(Math.hypot(S2.x[i], S2.y[i]));
      out.sampleNoLayers = { r: r2, dFar: [r2[4] - r1[4], r2[5] - r1[5]], nan: S2.hasNaN() };
    } else out.sample = { missing: true };
  }
  return out;
});

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({ target: TARGET, pageErrors, R }, null, 1));
console.log(JSON.stringify({ target: TARGET, pageErrors, R }, null, 1));
await browser.close();

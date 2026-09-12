// 第257便b W2「m=2 引きずりシア 対 arm budget —— 供給できるか」(第49報)。
//
// 第256便b ⑥-4 が次便の課題として残した測定である:
//   「🎠 の円盤で `dfmGalaxyMeshField` の `gradU` の**対称無跡部**(= シア。反対称部は渦度)を
//    r ビン × 方位で読み、その **m=2 成分の振幅 × r / v_c²** を無次元量として ε と同じ表に並べる。
//    ここで『ε_req の帯 0.06〜0.25 に届くか』が合否条件になる」
//
// 測る量:
//   ① **引きずり加速度の Fourier 分解**(m=0,1,2,3)—— エンジンが実際に粒子へ与えている引きずり
//      a_drag = a(kFrame=現行) − a(kFrame=0) を**同じ状態から 2 回踏んで**差し引いて作る
//      (状態はスナップショットで厳密に戻す)。r ビンごとに a_r・a_φ の m 成分の振幅と位相を出す。
//   ② **ε_equiv** = A₂(a_r) / (v_c²|∇ψ|)(|∇ψ| は棒 i=90° と渦巻 i=20° の 2 通り)。
//      第256便b の「腕を保つのに要った ε の帯 0.06〜0.25」と同じ表に並べる。
//   ③ **シアの m=2**(場の側) —— gradU の対称無跡部 σ=[½(∂ₓu_x−∂_yu_y), ½(∂_yu_x+∂ₓu_y)] の
//      方位 Fourier。無次元化は σ·r/v_c と、加速度換算 σ·|v−u| の 2 通り。
//   ④ **時間平均仕事とトルク** —— ⟨Σ mᵢ vᵢ·a_{m=2,i}⟩ と ⟨Σ mᵢ (x×a_{m=2})ᵢ⟩ を同じ窓で積分し、
//      **同じ窓での帳簿の減少分**(dfmToyLedger の K・E_core・E_mesh・reservoir)と比べる。
//   ⑤ **連鎖メッシュ由来の a** —— リング縮約の u_chain(r) は**方位に依らない**ので、
//      その方位 Fourier に何が残るかを実測する(m=2 を供給できるか)。
//
// **「腕が自律生成した」とは書かない。** 粒子の力へは 1 バイトも接続していない。
// **観測回転曲線は 1 つも入力しない。**
//
// 実行: node tests/exp-w257b-armshear.mjs [--drag] [--shear] [--work] [--chain]
// 出力: tests/out/armshear-w257b.json(未コミット —— 数値は PHYSICS に全載)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + (path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET));
const OUT = process.env.W257B_OUT || path.join(ROOT, 'tests', 'out', 'armshear-w257b.json');
const argv = process.argv.slice(2);
const only = argv.filter((a) => a.startsWith('--')).map((a) => a.slice(2));
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

const out = { target: TARGET, node: process.version, at: new Date().toISOString(), wave: '257b' };

await pg.evaluate(() => {
  const W = (window.__w257bs = {});
  W.byId = (id) => HP.allPresets().find((p) => p.id === id);
  W.build = (id, steps, patch) => {
    const pd = JSON.parse(JSON.stringify(W.byId(id)));
    if (patch) patch(pd);
    const v = HP.validatePreset(pd);
    if (!v.ok) throw new Error('invalid ' + id + ': ' + (v.errors || []).join('|'));
    const S = HP.sim; S.build(v.preset);
    for (let k = 0; k < (steps || 0); k++) S.step(0.016);
    return S;
  };
  // 汎用スナップショット(型付き配列と数値スカラだけ —— 1 步のプローブを厳密に巻き戻すため)
  W.snap = (S) => {
    const o = { arr: {}, sc: {} };
    for (const k of Object.keys(S)) {
      const v = S[k];
      if (ArrayBuffer.isView(v)) o.arr[k] = v.slice();
      else if (typeof v === 'number') o.sc[k] = v;
    }
    return o;
  };
  W.restore = (S, o) => {
    for (const k of Object.keys(o.arr)) {
      const a = S[k];
      if (ArrayBuffer.isView(a) && a.length === o.arr[k].length) a.set(o.arr[k]);
    }
    for (const k of Object.keys(o.sc)) S[k] = o.sc[k];
    S._galSup = null;
  };
  // 同じ状態から 2 回踏んで引きずり加速度を取り出す(**状態は厳密に戻す**)
  W.dragAcc = (S, dt) => {
    const s0 = W.snap(S);
    const kF = S.params.kFrame;
    const v0x = Float64Array.from(S.vx), v0y = Float64Array.from(S.vy);
    S.step(dt);
    const a1x = Float64Array.from(S.vx, (v, i) => (v - v0x[i]) / dt);
    const a1y = Float64Array.from(S.vy, (v, i) => (v - v0y[i]) / dt);
    W.restore(S, s0);
    S.params.kFrame = 0;
    S.step(dt);
    const a0x = Float64Array.from(S.vx, (v, i) => (v - v0x[i]) / dt);
    const a0y = Float64Array.from(S.vy, (v, i) => (v - v0y[i]) / dt);
    W.restore(S, s0);
    S.params.kFrame = kF;
    return { ax: Float64Array.from(a1x, (v, i) => v - a0x[i]),
      ay: Float64Array.from(a1y, (v, i) => v - a0y[i]),
      totx: a1x, toty: a1y };
  };
  // 方位 Fourier(質量重み)。scalar(i) が返す量の m=0..3 の振幅と位相を r ビンで返す。
  W.fourier = (S, idx, scalar, mMax) => {
    const M = mMax === undefined ? 3 : mMax;
    let w = 0;
    const re = new Float64Array(M + 1), im = new Float64Array(M + 1);
    for (const i of idx) {
      const th = Math.atan2(S.y[i], S.x[i]), wi = S.m[i], q = scalar(i);
      if (!Number.isFinite(q)) continue;
      w += wi;
      for (let m = 0; m <= M; m++) { re[m] += wi * q * Math.cos(m * th); im[m] += wi * q * Math.sin(m * th); }
    }
    if (!(w > 0)) return null;
    const rows = [];
    for (let m = 0; m <= M; m++) {
      const a = re[m] / w, b = im[m] / w;
      // m=0 は平均そのもの・m≥1 は cos(mθ−φ) 展開の振幅 2|c_m|
      rows.push({ m, amp: m === 0 ? a : 2 * Math.hypot(a, b), phase: m === 0 ? 0 : Math.atan2(b, a) });
    }
    return { rows, wSum: w, n: idx.length };
  };
  W.bins = (S, edges) => {
    const bs = edges.slice(0, -1).map(() => []);
    for (let i = 0; i < S.n; i++) {
      const r = Math.hypot(S.x[i], S.y[i]);
      for (let b = 0; b < bs.length; b++) if (r >= edges[b] && r < edges[b + 1]) { bs[b].push(i); break; }
    }
    return bs;
  };
  W.vcOf = (S, idx) => {
    let M = 0, s = 0;
    for (const i of idx) { const r = Math.hypot(S.x[i], S.y[i]); if (!(r > 0)) continue;
      M += S.m[i]; s += S.m[i] * Math.abs((S.x[i] * S.vy[i] - S.y[i] * S.vx[i]) / r); }
    return M > 0 ? s / M : 0;
  };
});

const EDGES = [40, 80, 120, 160, 200, 251];

// ============================================================ ①② 引きずり加速度の Fourier と ε_equiv
if (want('drag')) {
  out.drag = await pg.evaluate((edges) => {
    const W = window.__w257bs;
    const S = W.build('galaxyMeshSpiral', 3000, null);
    const dt = 0.016;
    const A = W.dragAcc(S, dt);
    const bs = W.bins(S, edges);
    const rows = [];
    for (let b = 0; b < bs.length; b++) {
      const idx = bs[b];
      if (idx.length < 4) { rows.push({ rIn: edges[b], rOut: edges[b + 1], n: idx.length, sparse: true }); continue; }
      const rMid = 0.5 * (edges[b] + edges[b + 1]);
      const vc = W.vcOf(S, idx);
      const ar = (i) => { const r = Math.hypot(S.x[i], S.y[i]); return (A.ax[i] * S.x[i] + A.ay[i] * S.y[i]) / r; };
      const ap = (i) => { const r = Math.hypot(S.x[i], S.y[i]); return (-A.ax[i] * S.y[i] + A.ay[i] * S.x[i]) / r; };
      const tr = (i) => { const r = Math.hypot(S.x[i], S.y[i]); return (A.totx[i] * S.x[i] + A.toty[i] * S.y[i]) / r; };
      const fr = W.fourier(S, idx, ar), fp = W.fourier(S, idx, ap), ft = W.fourier(S, idx, tr);
      const A2 = fr.rows[2].amp;
      // ε_equiv = A₂ / (v_c²|∇ψ|)。棒 i=90°: |∇ψ|=m/r ・渦巻 i=20°: |∇ψ|=(m/r)/sin i
      const m = 2;
      const gBar = m / rMid, gSp = (m / rMid) / Math.sin(20 * Math.PI / 180);
      rows.push({ rIn: edges[b], rOut: edges[b + 1], rMid, n: idx.length, vc,
        aDragR: fr.rows, aDragPhi: fp.rows, aTotR: ft.rows,
        A2r: A2, A2phi: fp.rows[2].amp,
        epsBar: A2 / (vc * vc * gBar), epsSpiral: A2 / (vc * vc * gSp),
        // 参考: 第256便b の予算式が同じ帯で要求する ε(σ_r と幅 w=r/4 の宣言)
        budget: (() => { let M = 0, s2 = 0, sm = 0;
          for (const i of idx) { const r = Math.hypot(S.x[i], S.y[i]);
            const vr = (S.vx[i] * S.x[i] + S.vy[i] * S.y[i]) / r; M += S.m[i]; sm += S.m[i] * vr; }
          const mean = sm / M;
          for (const i of idx) { const r = Math.hypot(S.x[i], S.y[i]);
            const vr = (S.vx[i] * S.x[i] + S.vy[i] * S.y[i]) / r; s2 += S.m[i] * (vr - mean) * (vr - mean); }
          const sig = Math.sqrt(s2 / M);
          const bBar = HP.dfmArmBudget({ r: rMid, vc, sigma: sig, width: rMid / 4, m: 2, pitch: 90 });
          const bSp = HP.dfmArmBudget({ r: rMid, vc, sigma: sig, width: rMid / 4, m: 2, pitch: 20 });
          return { sigma: sig, width: rMid / 4, epsReqBar: bBar ? bBar.epsilon : null,
            epsReqSpiral: bSp ? bSp.epsilon : null }; })() });
    }
    // 引きずり加速度の大きさの目安
    let amax = 0, amean = 0, mm = 0;
    for (let i = 0; i < S.n; i++) { const a = Math.hypot(A.ax[i], A.ay[i]);
      amax = Math.max(amax, a); amean += S.m[i] * a; mm += S.m[i]; }
    return { dt, t: S.t, n: S.n, kFrame: S.params.kFrame, aDragMax: amax, aDragMean: amean / mm, rows };
  }, EDGES);
  console.log('§DRAG done');
}

// ============================================================ ③ シアの m=2(場の側・第256便b ⑥-4)
if (want('shear')) {
  out.shear = await pg.evaluate((edges) => {
    const W = window.__w257bs;
    const S = W.build('galaxyMeshSpiral', 3000, null);
    const rows = [];
    const NTH = 64;
    for (let b = 0; b < edges.length - 1; b++) {
      const r = 0.5 * (edges[b] + edges[b + 1]);
      const idx = W.bins(S, edges)[b];
      const vc = W.vcOf(S, idx);
      const sh1 = [], sh2 = [], vor = [], th = [];
      let ok = true;
      for (let k = 0; k < NTH; k++) {
        const t = 2 * Math.PI * k / NTH;
        const f = HP.dfmGalaxyMeshField(S, r * Math.cos(t), r * Math.sin(t), { need: 'uB', bg: 'static' });
        if (!f || !f.gradU) { ok = false; break; }
        const g = f.gradU;
        sh1.push(0.5 * (g[0] - g[3]));            // ½(∂ₓu_x − ∂_yu_y)
        sh2.push(0.5 * (g[1] + g[2]));            // ½(∂_yu_x + ∂ₓu_y)
        vor.push(g[2] - g[1]);
        th.push(t);
      }
      if (!ok) { rows.push({ r, err: 'field-null' }); continue; }
      const fou = (arr) => { const R = [];
        for (let m = 0; m <= 3; m++) { let re = 0, im = 0;
          for (let k = 0; k < NTH; k++) { re += arr[k] * Math.cos(m * th[k]); im += arr[k] * Math.sin(m * th[k]); }
          re /= NTH; im /= NTH;
          R.push({ m, amp: m === 0 ? re : 2 * Math.hypot(re, im), phase: m === 0 ? 0 : Math.atan2(im, re) }); }
        return R; };
      const mag = sh1.map((z, k) => Math.hypot(z, sh2[k]));
      const f1 = fou(sh1), f2 = fou(sh2), fm = fou(mag), fv = fou(vor);
      // シアの m=2 を加速度へ換算する 2 通り: σ·r(速度の次元)と σ·|v−u|(加速度の次元)
      let M = 0, sd = 0;
      for (const i of idx) { const f = HP.dfmGalaxyMeshField(S, S.x[i], S.y[i], { need: 'u', bg: 'static' });
        if (!f) continue; M += S.m[i]; sd += S.m[i] * Math.hypot(S.vx[i] - f.u[0], S.vy[i] - f.u[1]); }
      const slip = M > 0 ? sd / M : 0;
      const sigma2 = Math.hypot(f1[2].amp, f2[2].amp);
      const aShear = sigma2 * slip;
      const gBar = 2 / r, gSp = (2 / r) / Math.sin(20 * Math.PI / 180);
      rows.push({ r, n: idx.length, vc, slip,
        shear1: f1, shear2: f2, shearMag: fm, vorticity: fv,
        sigma_m2: sigma2, sigmaR_over_vc: sigma2 * r / vc,
        aShear, epsBar: aShear / (vc * vc * gBar), epsSpiral: aShear / (vc * vc * gSp) });
    }
    return { nTheta: NTH, t: S.t, rows };
  }, EDGES);
  console.log('§SHEAR done');
}

// ============================================================ ④ 時間平均仕事とトルク 対 帳簿の減少分
if (want('work')) {
  out.work = await pg.evaluate((edges) => {
    const W = window.__w257bs;
    const res = { runs: [] };
    for (const cfg of [{ tag: 'as-is', patch: null },
      { tag: 'reservoir', patch: (pd) => { pd.physics.spaceMesh = { mode: 'vertex', reservoir: { Imesh: 5e4, gamma: 50 } }; } }]) {
      let S;
      try { S = W.build('galaxyMeshSpiral', 3000, cfg.patch); }
      catch (e) { res.runs.push({ tag: cfg.tag, err: String(e) }); continue; }
      const dt = 0.016, SAMPLE = 1, NSTEP = 2000, PHSAMP = 25;
      const led0 = HP.dfmToyLedger(S, {});
      const e0 = { K: led0.K, U: led0.U, Emesh: led0.Emesh, Q: led0.Q, Wext: led0.Wext,
        spin: (() => { let s = 0; for (let i = 0; i < S.n; i++) s += 0.25 * S.m[i] * S.R[i] * S.R[i] * S.spin[i] * S.spin[i]; return s; })() };
      let workM2 = 0, torqueM2 = 0, workAll = 0, torqueAll = 0, nSamp = 0;
      const phase = [];
      for (let k = 0; k < NSTEP; k++) {
        if (k % SAMPLE === 0) {
          const A = W.dragAcc(S, dt);
          const bs = W.bins(S, edges);
          let wm = 0, tm = 0, wa = 0, ta = 0;
          const ph = [];
          for (let b = 0; b < bs.length; b++) {
            const idx = bs[b];
            if (idx.length < 4) continue;
            const ar = (i) => { const r = Math.hypot(S.x[i], S.y[i]); return (A.ax[i] * S.x[i] + A.ay[i] * S.y[i]) / r; };
            const ap = (i) => { const r = Math.hypot(S.x[i], S.y[i]); return (-A.ax[i] * S.y[i] + A.ay[i] * S.x[i]) / r; };
            const fr = W.fourier(S, idx, ar), fp = W.fourier(S, idx, ap);
            if (k % PHSAMP === 0) ph.push({ b, phaseR: fr.rows[2].phase, ampR: fr.rows[2].amp });
            // m=2 成分だけを再構成して仕事とトルクを積む
            for (const i of idx) {
              const r = Math.hypot(S.x[i], S.y[i]), th = Math.atan2(S.y[i], S.x[i]);
              const a2r = fr.rows[2].amp * Math.cos(2 * th - fr.rows[2].phase);
              const a2p = fp.rows[2].amp * Math.cos(2 * th - fp.rows[2].phase);
              const cx = S.x[i] / r, cy = S.y[i] / r;
              const a2x = a2r * cx - a2p * cy, a2y = a2r * cy + a2p * cx;
              wm += S.m[i] * (S.vx[i] * a2x + S.vy[i] * a2y);
              tm += S.m[i] * (S.x[i] * a2y - S.y[i] * a2x);
              wa += S.m[i] * (S.vx[i] * A.ax[i] + S.vy[i] * A.ay[i]);
              ta += S.m[i] * (S.x[i] * A.ay[i] - S.y[i] * A.ax[i]);
            }
          }
          workM2 += wm * SAMPLE * dt; torqueM2 += tm * SAMPLE * dt;
          workAll += wa * SAMPLE * dt; torqueAll += ta * SAMPLE * dt;
          if (k % PHSAMP === 0) phase.push({ t: S.t, rows: ph });
          nSamp++;
        }
        S.step(dt);
      }
      const led1 = HP.dfmToyLedger(S, { ref: led0 });
      const e1 = { K: led1.K, U: led1.U, Emesh: led1.Emesh, Q: led1.Q, Wext: led1.Wext,
        spin: (() => { let s = 0; for (let i = 0; i < S.n; i++) s += 0.25 * S.m[i] * S.R[i] * S.R[i] * S.spin[i] * S.spin[i]; return s; })() };
      // パターン速度: m=2 の位相の時系列に線形 fit(第256便b ⑥-7 の「器の改良」案)
      const fitOm = (b) => {
        const ts = [], ps = [];
        let prev = null, off = 0;
        for (const s of phase) { const rr = s.rows.find((z) => z.b === b); if (!rr) continue;
          let p = rr.phaseR;
          if (prev !== null) { while (p + off - prev > Math.PI) off -= 2 * Math.PI;
            while (p + off - prev < -Math.PI) off += 2 * Math.PI; }
          const pv = p + off; ts.push(s.t); ps.push(pv); prev = pv; }
        if (ts.length < 3) return null;
        let st = 0, sp = 0, stt = 0, stp = 0;
        for (let i = 0; i < ts.length; i++) { st += ts[i]; sp += ps[i]; stt += ts[i] * ts[i]; stp += ts[i] * ps[i]; }
        const nn = ts.length, den = nn * stt - st * st;
        if (!(Math.abs(den) > 0)) return null;
        const slope = (nn * stp - st * sp) / den;
        let ss = 0; const mean = sp / nn;
        let sr = 0;
        const a0 = (sp - slope * st) / nn;
        for (let i = 0; i < nn; i++) { ss += (ps[i] - mean) * (ps[i] - mean); sr += (ps[i] - a0 - slope * ts[i]) ** 2; }
        return { omegaPattern: slope / 2, r2: ss > 0 ? 1 - sr / ss : null, n: nn };
      };
      const oms = [];
      for (let b = 0; b < edges.length - 1; b++) { const f = fitOm(b); if (f) oms.push(Object.assign({ b }, f)); }
      res.runs.push({ tag: cfg.tag, nSamp, tWindow: NSTEP * dt, t0: led0.parts.t, t1: led1.parts.t,
        workM2, torqueM2, workAll, torqueAll,
        e0, e1, dK: e1.K - e0.K, dU: (e1.U !== null && e0.U !== null) ? e1.U - e0.U : null,
        dSpin: e1.spin - e0.spin,
        dEmesh: (e1.Emesh !== null && e0.Emesh !== null) ? e1.Emesh - e0.Emesh : null,
        dQ: e1.Q - e0.Q, dWext: e1.Wext - e0.Wext,
        ledgerResidual: led1.residual, undefinedTerms: led1.undefinedTerms,
        meshRotorStop: S.meshRotorStop, meshJ: S.meshJ, meshQ: S.meshQ, meshRotorE: S.meshRotorE,
        patternSpeeds: oms });
    }
    return res;
  }, EDGES);
  console.log('§WORK done');
}

// ============================================================ ⑤ 連鎖メッシュ由来の場の方位 Fourier
if (want('chain')) {
  out.chain = await pg.evaluate((edges) => {
    const W = window.__w257bs;
    const S = W.build('galaxyMeshSpiral', 3000, null);
    // 並進 V を与えた診断コピー(連鎖トイの駆動は構成天体の一括速度である)
    for (let i = 0; i < S.n; i++) { S.vx[i] += 5.854078913531191; if (S.pinned) S.pinned[i] = 0; }
    S._galSup = null;
    const ch = HP.dfmChainMeshBuild(S, { rings: 5, kNeighbors: 1, mu: 1, tau: 36.5, zeta: 1,
      tauDrag: 36.5, gammaBg: 1, bond: 'linear', kScale: 0 });
    const st = HP.dfmChainMeshStatic(ch);
    for (let i = 0; i < ch.n; i++) { ch.U[2 * i] = st.U[i][0]; ch.U[2 * i + 1] = st.U[i][1]; }
    const NTH = 64, rows = [];
    for (let b = 0; b < edges.length - 1; b++) {
      const r = 0.5 * (edges[b] + edges[b + 1]);
      const ur = [], up = [], th = [];
      for (let k = 0; k < NTH; k++) {
        const t = 2 * Math.PI * k / NTH;
        const f = HP.dfmChainMeshField(ch, r * Math.cos(t), r * Math.sin(t), {});
        if (!f) continue;
        ur.push(f.u[0] * Math.cos(t) + f.u[1] * Math.sin(t));
        up.push(-f.u[0] * Math.sin(t) + f.u[1] * Math.cos(t));
        th.push(t);
      }
      const fou = (arr) => { const R = [];
        for (let m = 0; m <= 3; m++) { let re = 0, im = 0;
          for (let k = 0; k < arr.length; k++) { re += arr[k] * Math.cos(m * th[k]); im += arr[k] * Math.sin(m * th[k]); }
          re /= arr.length; im /= arr.length;
          R.push({ m, amp: m === 0 ? re : 2 * Math.hypot(re, im) }); }
        return R; };
      rows.push({ r, ur: fou(ur), uphi: fou(up) });
    }
    return { rho: st.rho, UoverV: st.U.map((u) => Math.hypot(u[0], u[1]) / 5.854078913531191),
      nTheta: NTH, rows,
      note: 'リング縮約の u_chain は半径だけの関数なので、方位成分は並進由来の m=1 しか持たない' };
  }, EDGES);
  console.log('§CHAIN done');
}

out.pageErrors = pageErrors;
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log('written', OUT, 'pageErrors', pageErrors.length);
await browser.close();

// 第260便b(第52報 W2): 親子コアの修正の実測器。
//
// 測るもの:
//   ① **重なる拡張体の二重計上**(統括が設定した検証仮説 (6))の再現と対策の効果。
//      根 m=1 ×2・殻 R=10・中心 x=∓1・G=1・ε=0.5・v=0・重力チャネルだけで
//      「点源 / 層差分 / 合算」の 3 値を**基点 html と現行 html の両方で**測る。
//   ② **可積分核の解析極限**(検証仮説 (7)): uniform・ε=0・p=1/2 の内部・薄殻 A−B≤0 の門・
//      分数 p・R 近傍の桁落ち・ε>0 の刻み収束。
//   ③ **J_total 軸の保守的歳差**(検証仮説 (8)): 旧(固定 J_s 軸)対 新(J_total 軸)の ΔE・総 J 残差。
//   ④ **"add" 縮退**: dfmLayerMerge(…,"add") を 8 回繰り返したときの層数・Σm・半径。
//   ⑤ **接触ばね下限 0**(検証仮説 (15)): 🧅 の診断コピーで contactK/contactCap=0 にして帯A の r を測る。
//   ⑥ `HP.dfmLayerPairForce` の純関数としての検算(中央差分・遠方で点源・対称性・等半径の解析値)。
//
// 使い方: node tests/exp-w260b-layers2.mjs [基点html] [現行html]
//   既定: beta/_w260_base.html beta/index.html(基点が無ければ現行だけを測る)
//   結果 JSON は W260B_OUT(既定 tests/out/w260b-layers2.json)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.argv[2] || 'beta/_w260_base.html';
const CUR = process.argv[3] || 'beta/index.html';
const OUT = process.env.W260B_OUT || path.join(ROOT, 'tests', 'out', 'w260b-layers2.json');
const abs = (t) => (path.isAbsolute(t) ? t : path.join(ROOT, t));

const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }

// ---------------- ① 二重計上の再現(両 html で同じ器を走らせる) ----------------
async function overlapProbe(target) {
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e.message || e)));
  await page.goto('file://' + abs(target), { waitUntil: 'load' });
  await page.waitForFunction(() => window.HP && HP.sim);
  const r = await page.evaluate(() => {
    const mkP = (bodies, ph) => ({ id: 'w260b', name: 'w260b', description: 'w260b の器。', emoji: '🧪',
      camera: { scale: 300 }, world: { boundary: 'none', size: 0 }, seed: 1,
      physics: Object.assign({ G: 1, D0: 0, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
        kappaT: 1 / 60, cLight: 30, contactK: 0.1, contactCap: 0.01, bM: 1, etaRad: 0, pRad: 4,
        gravityX: 0, gravityY: 0, geoPN: 0, lambdaPN: 1, pnAlpha: 1.5,
        radiusScale: 1, softening: 0.5, timeScale: 1 }, ph || {}),
      bodies, overlays: {} });
    const sgl = (o) => Object.assign({ type: 'single', m: 1, radius: 0.1, x: 0, y: 0, vx: 0, vy: 0,
      spin: 0, pinned: false }, o);
    const SH = (R) => [{ role: 'shell', m: 1, r: R }];
    const H = 1e-6;
    // 「根 m=1・殻 R・中心 x=∓1」の 2 体。x=+1 の粒子の a_x を 1 步の Δv/dt で読む
    const run = (withLayers, R, sep) => {
      const b = [sgl({ x: -sep / 2 }), sgl({ x: +sep / 2 })];
      if (withLayers) { b[0].layers = SH(R); b[1].layers = SH(R); }
      const v = HP.validatePreset(mkP(b));
      const S = HP.sim; S.build(v.preset); S.step(H);
      return { ax: S.vx[1] / H, axL: S.vx[0] / H, layerN: S.layerN,
        pairN: S.layerPairN === undefined ? null : S.layerPairN,
        stop: S.layerStop === undefined ? null : S.layerStop,
        stopN: S.layerStopN === undefined ? null : S.layerStopN,
        p: Math.abs(S.m[0] * S.vx[0] + S.m[1] * S.vx[1]) };
    };
    const out = { cases: [] };
    for (const [R, sep, tag] of [[10, 2, '重なる(d=2 < R+R=20)'], [10, 25, '重ならない(d=25 > 20)'],
      [0.4, 2, '重ならない(d=2 > 0.8)']]) {
      const A = run(false, R, sep), B = run(true, R, sep);
      out.cases.push({ tag, R, sep, point: A.ax, total: B.ax, layerDiff: B.ax - A.ax,
        layerN: B.layerN, pairN: B.pairN, stop: B.stop, stopN: B.stopN, dP: B.p,
        sameBits: A.ax === B.ax });
    }
    // 拡張体 × 点(従来の経路)が変わっていないこと: 殻 R=10 の中に質量 1e−6 の点を置く
    {
      const b = [sgl({ m: 1000, radius: 1, pinned: true, layers: [{ role: 'core', m: 900, r: 20 },
        { role: 'shell', m: 100, r: 100 }] }), sgl({ m: 1e-6, radius: 0.02, x: 8 })];
      const v = HP.validatePreset(mkP(b));
      const S = HP.sim; S.build(v.preset); S.step(H);
      out.shellPoint = { a: S.vx[1] / H, layerN: S.layerN,
        pairN: S.layerPairN === undefined ? null : S.layerPairN };
    }
    // d→0(ΔF が定義されない組)は stop が立つか
    {
      const b = [sgl({ x: 0, layers: [{ role: 'shell', m: 1, r: 10 }] }),
        sgl({ x: 0, y: 0, layers: [{ role: 'shell', m: 1, r: 10 }] })];
      const v = HP.validatePreset(mkP(b));
      const S = HP.sim; S.build(v.preset); S.step(H);
      out.zeroSep = { stop: S.layerStop === undefined ? null : S.layerStop,
        stopN: S.layerStopN === undefined ? null : S.layerStopN,
        pairN: S.layerPairN === undefined ? null : S.layerPairN,
        nan: S.hasNaN(), ax: S.vx[1] / H };
    }
    out.hasPairApi = !!(window.HP && typeof HP.dfmLayerPairForce === 'function');
    return out;
  });
  await page.close();
  return { r, errs };
}

// ---------------- ②〜⑥(現行 html だけで測る) ----------------
async function mainProbe(target) {
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e.message || e)));
  await page.goto('file://' + abs(target), { waitUntil: 'load' });
  await page.waitForFunction(() => window.HP && HP.sim);
  const r = await page.evaluate(() => {
    const O = {};
    const K = (d, o) => HP.dfmLayerKernel({ m: 1, r: 1 }, d, o);

    // ---------- ② 可積分核の解析極限 ----------
    {
      const want = { '0|1': 1.5, '0|2': 3, '0.2|1': 1.48, '0.2|2': 2.959674389,
        '1|1': 1, '1|2': 1.5 };
      O.kernAnalytic = [];
      for (const d of [0, 0.2, 0.5, 1, 1.5]) {
        for (const p of [1, 2]) {
          const z = K(d, { p, eps: 0, shape: 'uniform' });
          O.kernAnalytic.push({ d, p, value: z ? z.value : null, method: z ? z.method : null,
            want: want[d + '|' + p] === undefined ? null : want[d + '|' + p] });
        }
      }
      // p=3 の内部は null のまま
      O.kernP3 = [0, 0.2, 0.5, 0.999].map((d) => ({ d, z: K(d, { p: 3, eps: 0, shape: 'uniform' }) }));
      O.kernP3out = K(2, { p: 3, eps: 0, shape: 'uniform' });
      // 薄殻 A−B≤0(ε=0・d=R)の門: q>0(p<2)なら有限
      O.kernShellGate = [0.5, 1, 1.5, 1.9, 2, 2.5, 3].map((p) => {
        const z = K(1, { p, eps: 0, shape: 'shell' });
        return { p, value: z ? z.value : null, method: z ? z.method : null,
          want: p < 2 ? Math.pow(2 * 1 * 1 + 0 + 1 * 1 - 1, 0) : null };
      });
      // 分数 p(uniform・ε=0・内部)は Simpson で有限になるか・節点で収束するか
      O.kernFrac = [];
      for (const p of [0.5, 1.5, 2.5]) {
        const a = K(0.2, { p, eps: 0, shape: 'uniform', nodes: 2000 });
        const b = K(0.2, { p, eps: 0, shape: 'uniform', nodes: 8000 });
        O.kernFrac.push({ p, n2000: a ? a.value : null, n8000: b ? b.value : null,
          rel: a && b ? Math.abs(a.value - b.value) / Math.abs(b.value) : null,
          method: a ? a.method : null });
      }
      // ε>0 の刻み収束(p=2・d=0.2 の解析値 2.959674389 へ寄るか)
      O.kernEps = [];
      for (const e of [1e-1, 1e-2, 1e-3, 1e-4, 1e-5]) {
        const a = K(0.2, { p: 2, eps: e, shape: 'uniform', nodes: 2000 });
        const b = K(0.2, { p: 2, eps: e, shape: 'uniform', nodes: 20000 });
        O.kernEps.push({ eps: e, n2000: a ? a.value : null, n20000: b ? b.value : null,
          method: a ? a.method : null });
      }
      // R 近傍の桁落ち(p=2 の解析形は ln((R+d)/|R−d|) を含む)
      O.kernNearR = [0.9, 0.99, 0.999, 0.9999, 0.99999, 1, 1.00001, 1.001, 1.01].map((d) => {
        const z = K(d, { p: 2, eps: 0, shape: 'uniform' });
        return { d, value: z ? z.value : null, method: z ? z.method : null };
      });
    }

    // ---------- ③ J_total 軸の保守的歳差 ----------
    {
      const Jc0 = [1, 0, 2], Js0 = [0, 0, 4], Ic = 2, Is = 8, k = 0.2, T = 1;
      const n2 = (v) => v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
      const E = (jc, js) => n2(jc) / (2 * Ic) + n2(js) / (2 * Is);
      const runPre = (axis, N) => {
        let jc = Jc0.slice(), js = Js0.slice();
        const E0 = E(jc, js), J0 = [js[0] + jc[0], js[1] + jc[1], js[2] + jc[2]];
        const dt = T / N;
        for (let i = 0; i < N; i++) {
          const z = HP.dfmSpinPrecess({ Js: js, Jc: jc, k, dt, Is, Ic, axis });
          if (!z) return null;
          jc = z.Jc; js = z.Js;
        }
        const J1 = [js[0] + jc[0], js[1] + jc[1], js[2] + jc[2]];
        return { N, dE: E(jc, js) - E0, dJ: Math.hypot(J1[0] - J0[0], J1[1] - J0[1], J1[2] - J0[2]),
          absJc: Math.hypot(jc[0], jc[1], jc[2]), absJs: Math.hypot(js[0], js[1], js[2]),
          absJc0: Math.hypot(Jc0[0], Jc0[1], Jc0[2]), absJs0: Math.hypot(Js0[0], Js0[1], Js0[2]) };
      };
      O.precess = { shell: [], total: [] };
      for (const N of [1, 10, 100, 1000]) {
        O.precess.shell.push(runPre('shell', N));
        O.precess.total.push(runPre('total', N));
      }
      // 第259便b の 1 行(|ΔJ_c|=0・|ΔE|=5.5e−21)の前後
      const one = (axis) => HP.dfmSpinPrecess({ Js: [0, 0, 1], Jc: [0.5, 0, 0.5], k: 0.3, dt: 0.7,
        Is: 1e18, Ic: 1, axis });
      O.precess259 = { shell: one('shell'), total: one('total') };
      // 傾ける仕事(第259便b の表・本便では触っていない)
      O.tilt = [30, 60, 90, 180].map((a) => {
        const z = HP.dfmTiltWork({ Js: [0, 0, 1], Jc: [0, 0, 0.5], Is: 1, Ic: 1,
          alpha: a * Math.PI / 180 });
        const al = a * Math.PI / 180;
        return { alphaDeg: a, dE: z.dE, want: (1 - Math.cos(al)) * (1 * 0.5 + 0.25) / 1,
          absJcKept: Math.abs(z.absJc1 - z.absJc0) };
      });
    }

    // ---------- ④ "add" の縮退 ----------
    {
      const LA = [{ role: 'core', m: 90, r: 2 }, { role: 'shell', m: 10, r: 10 }];
      const LB = [{ role: 'core', m: 45, r: 1.5 }, { role: 'shell', m: 5, r: 8 }];
      const sum = (a) => a.reduce((s, L) => s + L.m, 0);
      const trace = (rule) => {
        let c = JSON.parse(JSON.stringify(LA)), rows = [];
        for (let k = 1; k <= 8; k++) {
          c = HP.dfmLayerMerge(c, JSON.parse(JSON.stringify(LB)), rule);
          rows.push({ k, n: c.length, sum: sum(c),
            r: c.map((L) => Number(L.r.toFixed(6))), m: c.map((L) => Number(L.m.toFixed(6))),
            roles: c.map((L) => L.role),
            asc: c.every((L, q) => q === 0 || L.r > c[q - 1].r) });
        }
        return rows;
      };
      O.mergeAdd = trace('add');
      O.mergeRole = trace('role');
      // 「別々の半径で 8 回積む」= 縮退の原因が「同じ半径の再投入」かを切り分ける
      const distinct = (rule) => {
        let c = JSON.parse(JSON.stringify(LA)), rows = [];
        for (let k = 1; k <= 8; k++) {
          c = HP.dfmLayerMerge(c, [{ role: 'core', m: 1, r: 3 + k * 0.7 }], rule);
          rows.push({ k, n: c.length, sum: sum(c), r: c.map((L) => Number(L.r.toFixed(4))) });
        }
        return rows;
      };
      O.mergeAddDistinct = distinct('add');
    }

    // ---------- ⑤ 接触ばね下限 0(🧅 の診断コピー) ----------
    {
      const src = HP.allPresets().find((p) => p.id === 'layeredCoreDFM');
      O.onionFound = !!src;
      if (src) {
        const run = (cK, cC) => {
          const pr = JSON.parse(JSON.stringify(src));
          pr.id = 'w260bOnion';
          pr.physics.contactK = cK; pr.physics.contactCap = cC;
          const v = HP.validatePreset(pr);
          const S = HP.sim; S.build(v.preset);
          for (let i = 0; i < 1250; i++) S.step(0.016);
          const rr = [];
          for (let i = 1; i < S.n; i++) rr.push(Math.hypot(S.x[i], S.y[i]));
          return { contactK: v.preset.physics.contactK === undefined ? 40 : v.preset.physics.contactK,
            contactCap: v.preset.physics.contactCap === undefined ? 8 : v.preset.physics.contactCap,
            warn: (v.warnings || []).filter((w) => String(w).indexOf('contact') >= 0),
            t: S.t, r: rr, nan: S.hasNaN(), layerN: S.layerN,
            pairN: S.layerPairN === undefined ? null : S.layerPairN };
        };
        O.onion = { floor: run(0.1, 0.01), zero: run(0, 0), def: run(40, 8) };
      }
      // ⑤b 帯A だけを残した器(他の 4 粒を外す)—— 残差が「試験粒子どうしの相互重力」かを切り分ける
      {
        const runA = (cK, cC) => {
          const pr = { id: 'w260bA', name: 'a', description: 'a', emoji: '🧪',
            camera: { scale: 300 }, world: { boundary: 'none', size: 0 }, seed: 1,
            physics: { G: 1, D0: 0, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
              kappaT: 1 / 60, cLight: 30, contactK: cK, contactCap: cC, bM: 1, etaRad: 0, pRad: 4,
              gravityX: 0, gravityY: 0, geoPN: 0, lambdaPN: 1, pnAlpha: 1.5,
              radiusScale: 1, softening: 0.5, timeScale: 1 },
            bodies: [{ type: 'single', m: 1000, radius: 100, x: 0, y: 0, vx: 0, vy: 0, spin: 0,
              pinned: true, layers: [{ role: 'core', m: 900, r: 20 }, { role: 'shell', m: 100, r: 100 }] },
            { type: 'single', rMul: 20, m: 0.001, x: 8, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }],
            overlays: {} };
          const v = HP.validatePreset(pr);
          const S = HP.sim; S.build(v.preset);
          for (let i = 0; i < 1250; i++) S.step(0.016);
          return { r: Math.hypot(S.x[1], S.y[1]), v: Math.hypot(S.vx[1], S.vy[1]), t: S.t };
        };
        O.bandAonly = { floor: runA(0.1, 0.01), zero: runA(0, 0) };
      }
      // 値域の受理(0 が通る・0.1/0.01 の既存セーブも通る・負は 0 へ)
      const rng = (cK, cC) => {
        const pr = { id: 'w260bR', name: 'r', description: 'r', emoji: '🧪',
          camera: { scale: 300 }, world: { boundary: 'none', size: 0 }, seed: 1,
          physics: { G: 1, D0: 0, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
            kappaT: 1 / 60, cLight: 30, contactK: cK, contactCap: cC, bM: 1, etaRad: 0, pRad: 4,
            gravityX: 0, gravityY: 0, geoPN: 0, lambdaPN: 1, pnAlpha: 1.5,
            radiusScale: 1, softening: 0.5, timeScale: 1 },
          bodies: [{ type: 'single', m: 1, radius: 1, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }],
          overlays: {} };
        const v = HP.validatePreset(pr);
        return { in: [cK, cC], K: v.preset.physics.contactK, C: v.preset.physics.contactCap,
          warn: (v.warnings || []).filter((w) => String(w).indexOf('contact') >= 0).length,
          sig: JSON.stringify(v.preset).indexOf('contactK') >= 0 };
      };
      O.contactRange = [rng(0, 0), rng(0.1, 0.01), rng(-5, -5), rng(40, 8), rng(5000, 5000)];
    }

    // ---------- ⑥ dfmLayerPairForce の純関数検算 ----------
    if (typeof HP.dfmLayerPairForce === 'function') {
      const F = HP.dfmLayerPairForce;
      const sh = (m, r) => [{ m, r }];
      // 等半径・ε=0 の解析値 F=−G m1 m2/(4R²)(0<d<2R で距離に依らない)
      O.pairEqual = [0.5, 2, 5, 15, 19.9, 20, 25, 100].map((d) => {
        const z = F(sh(1, 10), sh(1, 10), d, { G: 1, eps: 0 });
        return { d, F: z.F, want: d < 20 ? -1 / 400 : -1 / (d * d), Fpoint: z.Fpoint, dF: z.dF };
      });
      // 中央差分(ε>0・非等半径・多層)
      O.pairCD = [];
      const LA = [{ m: 0.9, r: 2 }, { m: 0.1, r: 7 }], LB = [{ m: 0.4, r: 1 }, { m: 0.6, r: 5 }];
      for (const d of [1, 3, 6, 11.9, 13, 30]) {
        const h = 1e-5;
        const z = F(LA, LB, d, { G: 1, eps: 0.5 });
        const up = F(LA, LB, d + h, { G: 1, eps: 0.5 }).U, um = F(LA, LB, d - h, { G: 1, eps: 0.5 }).U;
        const cd = -(up - um) / (2 * h);
        O.pairCD.push({ d, F: z.F, cd, rel: Math.abs(z.F - cd) / Math.abs(cd), overlap: z.overlap });
      }
      // 対称性・遠方で点源・門
      const a1 = F([{ m: 1, r: 10 }], [{ m: 2, r: 3 }], 7, { G: 1, eps: 0.3 });
      const a2 = F([{ m: 2, r: 3 }], [{ m: 1, r: 10 }], 7, { G: 1, eps: 0.3 });
      O.pairSym = { F1: a1.F, F2: a2.F, dF: Math.abs(a1.F - a2.F), U1: a1.U, U2: a2.U };
      O.pairFar = [20, 50, 200, 1000].map((d) => {
        const z = F([{ m: 1, r: 10 }], [{ m: 1, r: 10 }], d, { G: 1, eps: 0 });
        return { d, dF: z.dF, dU: z.dU, rel: Math.abs(z.dF / z.Fpoint) };
      });
      O.pairGates = [F([], [{ m: 1, r: 1 }], 1, {}), F([{ m: 1, r: 1 }], [{ m: 1, r: 1 }], 0, {}),
        F([{ m: -1, r: 1 }], [{ m: 1, r: 1 }], 1, {}), F([{ m: 1, r: 1 }], [{ m: 1, r: 1 }], -1, {}),
        F([{ m: 1, r: 1 }], [{ m: 1, r: 1 }], 1, { eps: -1 })].map((z) => z === null);
      // 点 × 点は素の softened 点源に戻る
      const pp = F([{ m: 1, r: 0 }], [{ m: 1, r: 0 }], 2, { G: 1, eps: 0.5 });
      O.pairPoint = { F: pp.F, want: -1 * 2 / Math.pow(4 + 0.25, 1.5), dF: pp.dF };
      // 薄殻 × 点(球殻定理)= 内側 0・外側 点源
      O.pairShellPoint = [5, 9.9, 10, 10.1, 15].map((d) => {
        const z = F([{ m: 1, r: 10 }], [{ m: 1, r: 0 }], d, { G: 1, eps: 0 });
        return { d, F: z.F, want: d < 10 ? 0 : (d === 10 ? -1 / 200 : -1 / (d * d)) };
      });
    }
    return O;
  });
  await page.close();
  return { r, errs };
}

const res = { base: null, cur: null, main: null };
if (fs.existsSync(abs(BASE))) res.base = await overlapProbe(BASE);
res.cur = await overlapProbe(CUR);
res.main = await mainProbe(CUR);
await browser.close();

const f = (x, n = 10) => (x === null || x === undefined || !Number.isFinite(x) ? String(x) : Number(x).toFixed(n));
const e = (x) => (x === null || x === undefined || !Number.isFinite(x) ? String(x) : Number(x).toExponential(4));

console.log('===== ① 重なる拡張体の二重計上(x=+1 の粒子の a_x・外向き = 正) =====');
for (const [tag, blk] of [['基点 html', res.base], ['現行 html', res.cur]]) {
  if (!blk) { console.log(tag + ': (なし)'); continue; }
  console.log('--- ' + tag + ' (pairApi=' + blk.r.hasPairApi + ') ---');
  for (const c of blk.r.cases) {
    console.log(['  ' + c.tag, 'R=' + c.R, 'd=' + c.sep, '点源 ' + f(c.point),
      '層差分 ' + f(c.layerDiff), '合算 ' + f(c.total), 'layerN=' + c.layerN,
      'pairN=' + c.pairN, 'stop=' + c.stop, '|ΔP|=' + e(c.dP)].join(' / '));
  }
  console.log('  拡張体×点(従来経路): a=' + f(blk.r.shellPoint.a) + ' layerN=' + blk.r.shellPoint.layerN
    + ' pairN=' + blk.r.shellPoint.pairN);
  console.log('  d=0(ΔF 未定義): stop=' + blk.r.zeroSep.stop + ' stopN=' + blk.r.zeroSep.stopN
    + ' pairN=' + blk.r.zeroSep.pairN + ' NaN=' + blk.r.zeroSep.nan + ' a=' + f(blk.r.zeroSep.ax));
  if (blk.errs.length) console.log('  pageerror: ' + blk.errs.join(' | '));
}

const M = res.main.r;
console.log('\n===== ② 可積分核の解析極限(m=1・R=1・uniform・ε=0) =====');
for (const row of M.kernAnalytic) {
  console.log(['  d=' + row.d, 'p=' + row.p, 'value=' + f(row.value, 9), 'method=' + row.method,
    'want=' + (row.want === null ? '—' : f(row.want, 9))].join(' / '));
}
console.log('  p=3 内部: ' + M.kernP3.map((z) => 'd=' + z.d + '→' + (z.z === null ? 'null' : f(z.z.value, 6))).join('・')
  + ' / 外側 d=2 → ' + (M.kernP3out === null ? 'null' : f(M.kernP3out.value, 6)
    + '(' + M.kernP3out.method + ')'));
console.log('  薄殻 ε=0・d=R の門: ' + M.kernShellGate.map((z) => 'p=' + z.p + '→'
  + (z.value === null ? 'null' : f(z.value, 6))).join('・'));
console.log('  分数 p(uniform・ε=0・d=0.2): ' + M.kernFrac.map((z) => 'p=' + z.p + ' n2000=' + f(z.n2000, 8)
  + ' n8000=' + f(z.n8000, 8) + ' rel=' + e(z.rel)).join(' | '));
console.log('  ε>0 の収束(p=2・d=0.2・解析 2.959674389):');
for (const z of M.kernEps) console.log('    ε=' + z.eps + ' n2000=' + f(z.n2000, 9) + ' n20000=' + f(z.n20000, 9));
console.log('  R 近傍(p=2・解析形): ' + M.kernNearR.map((z) => 'd=' + z.d + '→' + f(z.value, 9)).join('・'));

console.log('\n===== ③ 保守的歳差(Jc=(1,0,2)・Js=(0,0,4)・Ic=2・Is=8・k=0.2・T=1) =====');
console.log('  分割 | axis:"shell"(旧固定 J_s 軸) ΔE / |ΔJ| | axis:"total"(新・既定) ΔE / |ΔJ|');
for (let i = 0; i < M.precess.shell.length; i++) {
  const a = M.precess.shell[i], b = M.precess.total[i];
  console.log('  ' + String(a.N).padStart(5) + ' | ' + e(a.dE) + ' / ' + e(a.dJ)
    + ' | ' + e(b.dE) + ' / ' + e(b.dJ) + '  (|Jc| ' + f(b.absJc, 12) + ' |Js| ' + f(b.absJs, 12) + ')');
}
console.log('  第259便b の 1 行(Js=(0,0,1)・Jc=(0.5,0,0.5)・k=0.3・dt=0.7・Is=1e18):');
for (const k of ['shell', 'total']) {
  const z = M.precess259[k];
  console.log('    axis:"' + k + '" |ΔJc|=' + e(Math.abs(z.absJc1 - z.absJc0)) + ' |ΔE|=' + e(Math.abs(z.dEtot))
    + ' |ΔJs|=' + e(Math.abs(z.absJs1 - z.absJs0)) + ' angle=' + f(z.angle, 8));
}
console.log('  傾ける仕事(本便では未変更): ' + M.tilt.map((z) => z.alphaDeg + '°→' + f(z.dE, 7)
  + '(解析 ' + f(z.want, 7) + ')').join('・'));

console.log('\n===== ④ dfmLayerMerge の繰り返し =====');
console.log('  "add": ' + M.mergeAdd.map((z) => z.k + '回→' + z.n + '層(Σm ' + z.sum + ')').join('・'));
console.log('    最終 r=' + JSON.stringify(M.mergeAdd[7].r) + ' m=' + JSON.stringify(M.mergeAdd[7].m)
  + ' roles=' + JSON.stringify(M.mergeAdd[7].roles) + ' 昇順=' + M.mergeAdd[7].asc);
console.log('  "role": ' + M.mergeRole.map((z) => z.k + '回→' + z.n + '層(Σm ' + z.sum + ')').join('・'));
console.log('  "add"(毎回 別の半径を 1 層ずつ): ' + M.mergeAddDistinct.map((z) => z.k + '回→' + z.n + '層').join('・'));
console.log('    最終 r=' + JSON.stringify(M.mergeAddDistinct[7].r));

console.log('\n===== ⑤ 接触ばね下限 0(🧅 の診断コピー・t=20) =====');
if (M.onion) {
  const lbl = ['帯A r=8', '帯A r=14', '帯B r=50', '帯B r=75', '帯C r=300', '帯C r=500'];
  const init = [8, 14, 50, 75, 300, 500];
  console.log('  設定 | ' + lbl.join(' | '));
  for (const k of ['floor', 'zero', 'def']) {
    const z = M.onion[k];
    console.log('  contactK=' + z.contactK + '/cap=' + z.contactCap + ' | '
      + z.r.map((v, i) => f(v, 4) + '(' + (v - init[i] >= 0 ? '+' : '') + f(v - init[i], 4) + ')').join(' | '));
  }
}
if (M.bandAonly) console.log('  帯A だけの器(他の 4 粒なし・r₀=8): contactK=0.1 → r=' + f(M.bandAonly.floor.r, 6)
  + '(|v|=' + e(M.bandAonly.floor.v) + ') / contactK=0 → r=' + f(M.bandAonly.zero.r, 6)
  + '(|v|=' + e(M.bandAonly.zero.v) + ')');
console.log('  値域: ' + M.contactRange.map((z) => '入力 ' + JSON.stringify(z.in) + '→K=' + z.K + '/C=' + z.C
  + '(警告 ' + z.warn + '・正準形に出る ' + z.sig + ')').join(' | '));

console.log('\n===== ⑥ dfmLayerPairForce(純関数) =====');
if (M.pairEqual) {
  console.log('  等半径 R=10・m=1・ε=0: ' + M.pairEqual.map((z) => 'd=' + z.d + ' F=' + f(z.F, 10)
    + '(want ' + f(z.want, 10) + ')').join(' | '));
  console.log('  中央差分(ε=0.5・多層):');
  for (const z of M.pairCD) console.log('    d=' + z.d + ' F=' + f(z.F, 10) + ' cd=' + f(z.cd, 10)
    + ' rel=' + e(z.rel) + ' overlap=' + z.overlap);
  console.log('  対称性 |F1−F2|=' + e(M.pairSym.dF));
  console.log('  遠方で点源: ' + M.pairFar.map((z) => 'd=' + z.d + ' ΔF=' + e(z.dF)).join('・'));
  console.log('  門(5 例すべて null): ' + JSON.stringify(M.pairGates));
  console.log('  点×点 F=' + f(M.pairPoint.F, 10) + '(want ' + f(M.pairPoint.want, 10) + ')・ΔF=' + e(M.pairPoint.dF));
  console.log('  薄殻×点: ' + M.pairShellPoint.map((z) => 'd=' + z.d + ' F=' + f(z.F, 10)
    + '(want ' + f(z.want, 10) + ')').join(' | '));
}
if (res.main.errs.length) console.log('pageerror: ' + res.main.errs.join(' | '));

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(res, null, 1));
console.log('\n→ ' + OUT);

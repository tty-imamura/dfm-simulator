// 第261便b(第53報 W2): 親子コアの ΔF・layerStop・"add" 融合・🧅 署名便・コア V2 変換の実測器。
//
// 測るもの:
//   ① **ΔF の 3 欄**(統括が設定した検証仮説 (5)): R₁=R₂=10・m=1・G=1・ε=0.5 で
//      d=10⁻⁸/10⁻⁶/10⁻⁴/1/5/19/20/21/50 の「現行(基点 html)/ 修正後(現行 html)/ 参照」。
//      参照は (a) ε=0・同半径の厳密式 −Gm₁m₂/(4R²)、(b) 小 d の解析級数 F≈2K·d·g″(R₂)/3、
//      (c) 大 d の単極子 −Gm₁m₂d/(d²+ε²)^{3/2}、(d) 独立な求積(層差の入れ子 + Gauss–Legendre)。
//      d=R₁+R₂ の段差(点源比)も両 html で出す。
//   ② **layerStop 2 案の比較**(検証仮説 (6)): 案B(既定 "define" —— d=0 を対称性で力 0)と
//      案A("halt" —— step 前検査で時刻を進めない)を、完全に重なった 2 体で走らせて並べる。
//   ③ **"add" の相対判定**(検証仮説 (7)): dfmLayerMerge(…,"add") を 8 回繰り返した層数・Σm・半径。
//   ④ **🧅 の署名便**(検証仮説 (8)): 新旧の presetSig と、帯A/帯B/帯C の t=20 の r。
//   ⑤ **コア V2 → layers の変換**: 遠方の点源差(厳密 0 のはず)と近傍の差の表。
//   ⑥ **applyLayerEdit の往復**: 編集 → bodyLayersOf → validatePreset → build がビット同一。
//
// 使い方: node tests/exp-w261b-pairforce.mjs [基点html] [現行html]
//   既定: beta/_w261_base.html beta/index.html
//   結果 JSON は W261B_OUT(既定 tests/out/w261b-pairforce.json)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.argv[2] || 'beta/_w261_base.html';
const CUR = process.argv[3] || 'beta/index.html';
const OUT = process.env.W261B_OUT || path.join(ROOT, 'tests', 'out', 'w261b-pairforce.json');
const abs = (t) => (path.isAbsolute(t) ? t : path.join(ROOT, t));

const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }

const DS = [1e-8, 1e-6, 1e-4, 1, 5, 19, 20, 21, 50];

// ---------- 参照(この器の中の独立実装 —— ページの実装は一切読まない) ----------
function glNodes(n) {
  const x = new Array(n), w = new Array(n);
  for (let i = 0; i < n; i++) {
    let z = Math.cos(Math.PI * (i + 0.75) / (n + 0.5)), pp = 0;
    for (let it = 0; it < 200; it++) {
      let p0 = 1, p1 = 0;
      for (let j = 0; j < n; j++) { const p2 = p1; p1 = p0; p0 = ((2 * j + 1) * z * p1 - j * p2) / (j + 1); }
      pp = n * (z * p0 - p1) / (z * z - 1);
      const dz = p0 / pp; z -= dz; if (Math.abs(dz) < 1e-15) break;
    }
    x[i] = z; w[i] = 2 / ((1 - z * z) * pp * pp);
  }
  return { x, w };
}
const GL = glNodes(120);
const integ = (f, a, b) => { let acc = 0;
  for (let i = 0; i < GL.x.length; i++) { const s = 0.5 * (b - a) * GL.x[i] + 0.5 * (a + b); acc += GL.w[i] * f(s); }
  return acc * 0.5 * (b - a); };
// 単一薄殻の「球面平均 − 点源」(消し合わない厳密形)
const mkDphi = (R, eps) => { const e2 = eps * eps, h = (w) => Math.sqrt(w * w + e2);
  return (d) => { const hp = h(d + R), hm = h(d - R), A = hp + hm, h0 = h(d), P = d * d + e2 - R * R;
    const D = (P >= 0) ? (hp * hm + P) : (4 * e2 * R * R) / (hp * hm - P);
    return -8 * e2 * R * R / (D * (A + 2 * h0) * h0 * A); }; };
function refdU(G, m1, R1, m2, R2, d, eps) {
  const d1 = mkDphi(R1, eps), d2 = mkDphi(R2, eps);
  const a = Math.abs(d - R2), b = d + R2;
  const f = (s) => s * d1(s);
  const T = (a < R1 && R1 < b) ? (integ(f, a, R1) + integ(f, R1, b)) : integ(f, a, b);
  return -G * m1 * m2 * (T / (2 * R2 * d) + d2(d));
}
function refF(G, m1, R1, m2, R2, d, eps) {   // 独立な求積からの F(点源 + ΔF)
  const h = Math.max(d * 1e-5, 1e-11);
  const w = Math.sqrt(d * d + eps * eps);
  const Fp = -G * m1 * m2 * d / (w * w * w);
  return Fp - (refdU(G, m1, R1, m2, R2, d + h, eps) - refdU(G, m1, R1, m2, R2, d - h, eps)) / (2 * h);
}
function serF(G, m1, R1, m2, R2, d, eps) {   // 小 d の解析級数 F = 2K[d·g″(R₂)/3 + d³·g⁗(R₂)/30]
  const e2 = eps * eps, K = G * m1 * m2 / (4 * R1 * R2);
  const h2 = (u) => e2 / Math.pow(u * u + e2, 1.5);
  const h4 = (u) => e2 * (12 * u * u - 3 * e2) / Math.pow(u * u + e2, 3.5);
  const g2 = h2(R2 + R1) - h2(R2 - R1), g4 = h4(R2 + R1) - h4(R2 - R1);
  return 2 * K * (d * g2 / 3 + d * d * d * g4 / 30);
}

async function probe(target) {
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e.message || e)));
  await page.goto('file://' + abs(target), { waitUntil: 'load' });
  await page.waitForFunction(() => window.HP && HP.sim);
  const r = await page.evaluate((ds) => {
    const O = { has: {} };
    O.has.coreV2ToLayers = typeof HP.coreV2ToLayers === 'function';
    O.has.applyLayerEdit = typeof HP.sim.applyLayerEdit === 'function';
    const SH = (R) => [{ role: 'shell', m: 1, r: R }];
    // ① 純関数の ΔF・F
    O.pair = ds.map((d) => {
      const z = HP.dfmLayerPairForce(SH(10), SH(10), d, { G: 1, eps: 0.5 });
      const z0 = HP.dfmLayerPairForce(SH(10), SH(10), d, { G: 1, eps: 0 });
      return { d, F: z ? z.F : null, dF: z ? z.dF : null, U: z ? z.U : null,
        method: z ? (z.dFmethod || null) : null, err: z ? (z.dFerr === undefined ? null : z.dFerr) : null,
        F0: z0 ? z0.F : null, dF0: z0 ? z0.dF : null };
    });
    // d=0 の扱い
    { const z = HP.dfmLayerPairForce(SH(10), SH(10), 0, { G: 1, eps: 0.5 });
      const z0 = HP.dfmLayerPairForce(SH(10), SH(10), 0, { G: 1, eps: 0 });
      O.d0 = { eps05: z ? { F: z.F, dF: z.dF, U: z.U } : null, eps0: z0 ? { F: z0.F, dF: z0.dF } : null }; }
    // d=R₁+R₂ の段差(点源比)
    { const z = HP.dfmLayerPairForce(SH(10), SH(10), 20, { G: 1, eps: 0.5 });
      const w = Math.sqrt(400 + 0.25), Fp = -20 / (w * w * w);
      O.step20 = z ? { F: z.F, Fpoint: Fp, rel: (z.F - Fp) / Fp } : null; }
    // 多層 × 多層の中央差分(U と F の整合)
    { const LA = [{ m: 0.9, r: 2 }, { m: 0.1, r: 7 }], LB = [{ m: 0.4, r: 1 }, { m: 0.6, r: 5 }];
      const h = 1e-5, z = HP.dfmLayerPairForce(LA, LB, 3, { G: 1, eps: 0.5 });
      const cd = -(HP.dfmLayerPairForce(LA, LB, 3 + h, { G: 1, eps: 0.5 }).U
        - HP.dfmLayerPairForce(LA, LB, 3 - h, { G: 1, eps: 0.5 }).U) / (2 * h);
      O.cd = { F: z.F, cd, rel: Math.abs(z.F - cd) / Math.abs(cd) }; }
    // ③ "add" 融合の縮退(8 回)
    { const LA = [{ role: 'core', m: 90, r: 2 }, { role: 'shell', m: 10, r: 10 }];
      const LB = [{ role: 'core', m: 45, r: 1.5 }, { role: 'shell', m: 5, r: 8 }];
      const rows = [];
      for (const rule of ['role', 'add']) {
        let cur = LA.map((L) => Object.assign({}, L)), seq = [];
        for (let k = 0; k < 8; k++) {
          cur = HP.dfmLayerMerge(cur, LB.map((L) => Object.assign({}, L)), rule);
          seq.push({ n: cur.length, sum: cur.reduce((a, L) => a + L.m, 0),
            r: cur.map((L) => Number(L.r.toPrecision(12))), m: cur.map((L) => L.m) });
        }
        rows.push({ rule, seq });
      }
      // 毎回ちがう半径を 1 つずつ足す(第260便b の対照)
      let cur2 = LA.map((L) => Object.assign({}, L)), grow = [];
      for (let k = 0; k < 8; k++) {
        cur2 = HP.dfmLayerMerge(cur2, [{ role: 'mantle', m: 1, r: 3 + k * 0.7 }], 'add');
        grow.push(cur2.length);
      }
      O.merge = { rows, grow };
    }
    // ⑤ コア V2 → layers
    if (O.has.coreV2ToLayers) {
      const cv = HP.coreV2ToLayers({ mode: 'differential', massFrac: 0.3, radius: 5, J: 12 },
        { m: 100, R: 10, spin: 0.5 });
      const far = [];
      if (cv.ok) {
        for (const d of [10, 20, 100, 1000]) {
          const g = HP.dfmLayerGravity(cv.layers, d, { G: 1, eps: 0.5 });
          far.push({ d, aPoint: g.aPoint, aLayered: g.aLayered, da: g.da });
        }
        for (const d of [1, 3, 5, 7]) {
          const g = HP.dfmLayerGravity(cv.layers, d, { G: 1, eps: 0.5 });
          far.push({ d, aPoint: g.aPoint, aLayered: g.aLayered, da: g.da });
        }
      }
      O.conv = { cv, far,
        cavity: HP.coreV2ToLayers({ mode: 'cavity', massFrac: -0.4, radius: 3 }, { m: 10, R: 8 }),
        outside: HP.coreV2ToLayers({ mode: 'rigid', massFrac: 0.5, radius: 12 }, { m: 10, R: 8 }),
        bare: HP.coreV2ToLayers({ mode: 'rigid', massFrac: 1, radius: 3 }, { m: 10, R: 8 }) };
    }
    // ② layerStop 2 案(完全に重なった 2 体・重力チャネルだけ)
    {
      const mkP = (bodies, ph) => ({ id: 'w261b', name: 'w261b', description: 'w261b の器。', emoji: '🧪',
        camera: { scale: 300 }, world: { boundary: 'none', size: 0 }, seed: 1,
        physics: Object.assign({ G: 1, D0: 0, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
          kappaT: 1 / 60, cLight: 30, contactK: 0, contactCap: 0, bM: 1, etaRad: 0, pRad: 4,
          gravityX: 0, gravityY: 0, geoPN: 0, lambdaPN: 1, pnAlpha: 1.5,
          radiusScale: 1, softening: 0.5, timeScale: 1 }, ph || {}),
        bodies, overlays: {} });
      const sgl = (o) => Object.assign({ type: 'single', m: 1, radius: 0.1, x: 0, y: 0, vx: 0, vy: 0,
        spin: 0, pinned: false }, o);
      const run = (mode, sep) => {
        const b = [sgl({ x: -sep / 2, layers: [{ role: 'shell', m: 1, r: 10 }] }),
          sgl({ x: +sep / 2, layers: [{ role: 'shell', m: 1, r: 10 }] })];
        const v = HP.validatePreset(mkP(b));
        const S = HP.sim; S.build(v.preset);
        if (S.layerStopMode !== undefined) S.layerStopMode = mode;
        const t0 = S.t, x0 = S.x[1], v0 = S.vx[1];
        for (let k = 0; k < 10; k++) S.step(0.016);
        return { mode, sep, dt: S.t - t0, dx: S.x[1] - x0, dv: S.vx[1] - v0,
          stop: S.layerStop === undefined ? null : S.layerStop,
          halt: S.layerHalt === undefined ? null : (S.layerHalt ? S.layerHalt.reason : null),
          pairN: S.layerPairN === undefined ? null : S.layerPairN,
          stopN: S.layerStopN === undefined ? null : S.layerStopN, nan: S.hasNaN() };
      };
      O.stop = [];
      for (const mode of ['define', 'halt']) for (const sep of [0, 2]) O.stop.push(run(mode, sep));
      // 重ならない対でも ΔF が入るか(検証仮説 (5))。**HP.sim は単一の器**なので値は先に取り切る
      const far = (sep) => {
        const b = [sgl({ x: -sep / 2, layers: [{ role: 'shell', m: 1, r: 10 }] }),
          sgl({ x: +sep / 2, layers: [{ role: 'shell', m: 1, r: 10 }] })];
        const v = HP.validatePreset(mkP(b));
        const S = HP.sim; S.build(v.preset); S.step(1e-6);
        const aLay = S.vx[1] / 1e-6, pairN = (S.layerPairN === undefined) ? null : S.layerPairN;
        const p = [sgl({ x: -sep / 2 }), sgl({ x: +sep / 2 })];
        const v2 = HP.validatePreset(mkP(p));
        S.build(v2.preset); S.step(1e-6);
        const aPt = S.vx[1] / 1e-6;
        return { sep, aLay, aPt, dA: aLay - aPt, pairN };
      };
      O.farPair = [far(25), far(50), far(200)];
      // **案A を実際に発火させる**: ΔF が定義されない対を人為的に作る(層の m を NaN にする)。
      // 案B(既定)ではこの対だけ層差分を当てずに時刻が進み、案A では時刻が 1 bit も進まない
      const poked = (mode) => {
        const b = [sgl({ x: -1, layers: [{ role: 'shell', m: 1, r: 10 }] }),
          sgl({ x: +1, layers: [{ role: 'shell', m: 1, r: 10 }] })];
        const v = HP.validatePreset(mkP(b));
        const S = HP.sim; S.build(v.preset);
        if (S.layerStopMode !== undefined) S.layerStopMode = mode;
        S.layM[0] = NaN;                       // 実行時に壊す(検証器は通らない宣言)
        const t0 = S.t, x1 = S.x[1], v1 = S.vx[1];
        for (let k = 0; k < 5; k++) S.step(0.016);
        return { mode, dt: S.t - t0, dx: S.x[1] - x1, dv: S.vx[1] - v1,
          stop: S.layerStop === undefined ? null : S.layerStop,
          halt: (S.layerHalt === undefined || !S.layerHalt) ? null : S.layerHalt.reason,
          stopN: S.layerStopN === undefined ? null : S.layerStopN, nan: S.hasNaN() };
      };
      O.poked = (HP.sim.layerStopMode !== undefined) ? ['define', 'halt'].map(poked) : null;
    }
    // ④ 🧅 の署名と帯の位置(t=20 = 1250 步)
    {
      const P = HP.allPresets().find((q) => q.id === 'layeredCoreDFM');
      O.onion = { sig: P ? presetSig(P).length : null,
        contactK: P ? P.physics.contactK : null, contactCap: P ? P.physics.contactCap : null,
        sigHash: null };
      if (P) {
        let a = 0x811c9dc5; const sg = presetSig(P);
        for (let k = 0; k < sg.length; k++) { a ^= sg.charCodeAt(k); a = Math.imul(a, 0x01000193) >>> 0; }
        O.onion.sigHash = a.toString(16);
        HP.loadPreset('layeredCoreDFM', false);
        const S = HP.sim;
        for (let k = 0; k < 1250; k++) S.step(0.016);
        const rr = []; for (let k = 1; k < S.n; k++) rr.push(Math.hypot(S.x[k], S.y[k]));
        O.onion.r = rr; O.onion.t = S.t; O.onion.nan = S.hasNaN();
        O.onion.v = []; for (let k = 1; k < S.n; k++) O.onion.v.push(Math.hypot(S.vx[k], S.vy[k]));
      }
    }
    // ⑥ applyLayerEdit の往復
    if (O.has.applyLayerEdit) {
      const mkP = (bodies) => ({ id: 'w261rt', name: 'w261rt', description: 'w261b の器。', emoji: '🧪',
        camera: { scale: 300 }, world: { boundary: 'none', size: 0 }, seed: 1,
        physics: { G: 1, D0: 0, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, kappaT: 1 / 60,
          cLight: 30, contactK: 0, contactCap: 0, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
          geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.5, timeScale: 1 },
        bodies, overlays: {} });
      const body0 = { type: 'single', m: 1000, radius: 100, x: 0, y: 0, vx: 0, vy: 0, spin: 0, pinned: true,
        layers: [{ role: 'core', m: 900, r: 20 }, { role: 'shell', m: 100, r: 100 }] };
      const v = HP.validatePreset(mkP([body0])); const S = HP.sim; S.build(v.preset);
      const e1 = S.applyLayerEdit(0, 0, { m: 800, J: 3.5 });
      const e2 = S.applyLayerEdit(0, 1, { r: 120 });
      const bad = S.applyLayerEdit(0, 1, { r: 5 });           // 昇順が壊れる → 1 bit も書かない
      const after = S.bodyLayersOf(0);
      const mSave = S.m[0];
      // 保存 JSON の往復: 正準形 → 文字列 → 再検証 → build がビット同一
      const b2 = Object.assign({}, body0, { m: mSave, layers: after });
      const v2 = HP.validatePreset(mkP([b2]));
      const round = JSON.stringify(v2.preset.bodies[0].layers) === JSON.stringify(
        HP.validatePreset(mkP([JSON.parse(JSON.stringify(b2))])).preset.bodies[0].layers);
      const S2 = HP.sim; S2.build(v2.preset);
      let same = (S2.layN[0] === S.layN[0]);
      for (let q = 0; q < S.layN[0]; q++) {
        if (S2.layM[q] !== S.layM[q] || S2.layR[q] !== S.layR[q]
          || S2.layRl[q] !== S.layRl[q] || S2.layJ[q] !== S.layJ[q]) same = false;
      }
      O.edit = { e1: e1.ok, e2: e2.ok, bad: bad.ok, badWhy: bad.reason, after, mSave,
        warn: v2.warnings.length, round, buildSame: same,
        del: S.applyLayerEdit(0, 0, null).ok, nAfterDel: S.layN[0],
        off: S.applyLayerEdit(0, -1, null).ok, flag: S.hasBodyLayers };
    }
    return O;
  }, DS);
  await page.close();
  return { r, errs };
}

const out = { base: BASE, cur: CUR, at: new Date().toISOString() };
out.baseR = fs.existsSync(abs(BASE)) ? (await probe(BASE)) : null;
out.curR = await probe(CUR);
await browser.close();

// 参照欄
const G = 1, m1 = 1, m2 = 1, R = 10, eps = 0.5;
out.ref = DS.map((d) => {
  const w = Math.sqrt(d * d + eps * eps);
  return { d, mono: -G * m1 * m2 * d / (w * w * w), eps0: (d >= 2 * R) ? -G / (d * d) : -G / (4 * R * R),
    series: serF(G, m1, R, m2, R, d, eps), quad: refF(G, m1, R, m2, R, d, eps) };
});

const fx = (v) => (v === null || v === undefined) ? '—' : Number(v).toExponential(9);
console.log('=== ① ΔF/F の 3 欄(R₁=R₂=10・m=1・G=1・ε=0.5)');
console.log('d | 現行 F | 修正後 F | 参照(級数/求積) | 参照(ε=0 厳密) | 修正後 method');
for (let k = 0; k < DS.length; k++) {
  const b = out.baseR ? out.baseR.r.pair[k] : null, c = out.curR.r.pair[k], rf = out.ref[k];
  console.log([DS[k], fx(b && b.F), fx(c.F), fx(Math.abs(DS[k]) < 1 ? rf.series : rf.quad),
    fx(rf.eps0), c.method, 'err=' + fx(c.err), 'eps0impl=' + fx(c.F0)].join(' | '));
}
console.log('d=0:', JSON.stringify(out.curR.r.d0), 'base:', out.baseR ? JSON.stringify(out.baseR.r.d0) : '—');
console.log('d=20 段差(点源比):', JSON.stringify(out.curR.r.step20), 'base:',
  out.baseR ? JSON.stringify(out.baseR.r.step20) : '—');
console.log('中央差分:', JSON.stringify(out.curR.r.cd));
console.log('=== ② layerStop 2 案');
for (const s of out.curR.r.stop) console.log(JSON.stringify(s));
console.log('重ならない対の ΔF:', JSON.stringify(out.curR.r.farPair));
if (out.baseR) console.log('(基点)重ならない対:', JSON.stringify(out.baseR.r.farPair));
console.log('ΔF 未定義を人為的に作った対照:', JSON.stringify(out.curR.r.poked));
if (out.baseR) console.log('(基点)同上:', JSON.stringify(out.baseR.r.poked));
console.log('=== ③ "add" 融合');
for (const row of out.curR.r.merge.rows) console.log(row.rule, JSON.stringify(row.seq.map((q) => q.n)),
  'Σm', JSON.stringify(row.seq.map((q) => q.sum)), '最終 r', JSON.stringify(row.seq[7].r),
  'm', JSON.stringify(row.seq[7].m));
console.log('毎回ちがう半径:', JSON.stringify(out.curR.r.merge.grow),
  '(基点', out.baseR ? JSON.stringify(out.baseR.r.merge.grow) : '—', ')');
if (out.baseR) for (const row of out.baseR.r.merge.rows) console.log('(基点)', row.rule,
  JSON.stringify(row.seq.map((q) => q.n)), '最終 r', JSON.stringify(row.seq[7].r));
console.log('=== ④ 🧅');
console.log('現行:', JSON.stringify(out.curR.r.onion));
if (out.baseR) console.log('基点:', JSON.stringify(out.baseR.r.onion));
console.log('=== ⑤ コア V2 → layers');
console.log(JSON.stringify(out.curR.r.conv, null, 1));
console.log('=== ⑥ applyLayerEdit の往復');
console.log(JSON.stringify(out.curR.r.edit));
console.log('pageerror 現行:', out.curR.errs.length, out.curR.errs.slice(0, 3));
if (out.baseR) console.log('pageerror 基点:', out.baseR.errs.length);

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log('→', OUT);

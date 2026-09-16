// 第265便c(第57報 W3・Z6): **ζ を層に持たせる**(前半)と **殻項 M_s 法則版**(後半)の実測器。
// 〔第264便c〕の `tests/exp-w264c-layerspin.mjs` の器をそのまま広げたもので、測るのは
//   ① 等価性の行列 —— (i) V2 のみ / (ii) 層+V2 / (iii) 層のみ の 3 状態で、
//      spin ∈ {0, 0.4} × ζ ∈ {1, 4} × shellSpinMass ∈ {"total","shell"} の 8 用量。
//      Q(回転場の源)・層の Σ J/ζ・**600 步後の状態の最大差**を並べる。
//   ② 「**層に値を足すだけでは同じにならない**」の対照 —— 移行計画から `inertiaScale` を
//      剥いで層へ置くと Q が J_z(1−1/ζ) だけずれることを数で出す。
//   ③ 移行計画が ζ を層へ運ぶか(`plan.layers[0].inertiaScale`)。
//   ④ **置換可否レポートの再集計**(内蔵 122 本)—— 現状と、全コア宣言に `shellSpinMass:"shell"` を
//      **複製したプリセットの上で**強制した場合(内蔵 JSON は 1 バイトも書き換えない)。
//   ⑤ **既定 Q の変動影響** —— 122 本を "shell" に強制したときの body ごとの Q の変化率。
//   ⑥ 既定 "total" が 1 bit も動いていないことの局所確認(同じ器で law を宣言しない列)。
//
// 使い方:
//   PLAYWRIGHT_CORE_DIR=/opt/node22/lib node tests/exp-w265c-zeta.mjs beta/_w265_base.html beta/index.html
// 出力: JSON(標準出力 + W265C_OUT)。**内蔵プリセットは 1 バイトも書き換えない**(deep copy の上で測る)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGETS = process.argv.slice(2).length ? process.argv.slice(2) : ['beta/index.html'];
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const STEPS = Number(process.env.W265C_STEPS || 600);

let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }

async function measure(target) {
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e.message || e)));
  await page.goto('file://' + path.join(ROOT, target), { waitUntil: 'load' });
  await page.waitForFunction(() => window.HP && HP.sim && HP.currentPreset());
  const out = await page.evaluate((steps) => {
    const O = {};
    const mkP = (spin, zeta, law) => ({
      id: 'w265cZeta', name: 'w265cZeta', emoji: '🧪',
      description: '第265便c の器(ζ と殻項の質量則)。E4 だけを残し opt-in の spinSpin を宣言する。',
      camera: { scale: 300 }, world: { boundary: 'none', size: 0 }, seed: 1,
      physics: { G: 1, D0: 0, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, kappaT: 1 / 60,
        cLight: 30, contactK: 0, contactCap: 0, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
        geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.5, timeScale: 1,
        spinSpin: 1e6 },
      bodies: [
        { type: 'single', m: 1000, radius: 10, x: -30, y: 0, vx: 0, vy: 0, spin, pinned: false,
          core: Object.assign({ mode: 'differential', massFrac: 0.3, radius: 0.1, omega: 20,
            tilt: 60, inertiaScale: zeta }, law === 'shell' ? { shellSpinMass: 'shell' } : {}) },
        { type: 'single', m: 10, radius: 1, x: 30, y: 0, vx: 0, vy: 0, spin: 3, pinned: false }],
      overlays: {},
    });
    const dropV2 = (S, i) => { S.coreMd[i] = 0; S.coreMF[i] = 0; S.RcV[i] = 0; S.coreJ[i] = 0;
      S.coreJm[i] = 0; S.coreIS[i] = 1; S.coreJx[i] = 0; S.coreJy[i] = 0; S.coreKcs[i] = 0;
      if (S.coreSSM) S.coreSSM[i] = 0;
      let any = false; for (let k = 0; k < S.n; k++) if (S.coreMd[k]) { any = true; break; }
      S.hasCoreV2 = any; };
    const planOf = (S, i, law) => HP.coreV2MigrationPlan({ m: S.m[i], R: S.R[i], spin: S.spin[i],
      core: Object.assign({ mode: 'differential', massFrac: S.coreMF[i], radius: S.RcV[i],
        inertiaScale: S.coreIS[i], Jz: S.coreJ[i], Jmag: S.coreJm[i],
        Jx: S.coreJx[i], Jy: S.coreJy[i] }, law === 'shell' ? { shellSpinMass: 'shell' } : {}) });
    // state: 'v2' | 'both' | 'lay' | 'layNoZeta'(ζ を剥いで層へ置く対照)
    const setup = (state, spin, zeta, law) => {
      const v = HP.validatePreset(mkP(spin, zeta, law));
      const S = HP.sim; S.build(v.preset);
      let plan = null;
      if (state !== 'v2') {
        plan = planOf(S, 0, law);
        let ly = plan.layers;
        if (state === 'layNoZeta') ly = ly.map((L) => { const c = Object.assign({}, L);
          delete c.inertiaScale; return c; });
        S._setBodyLayers(0, ly);
        if (state !== 'both') dropV2(S, 0);
      }
      return { S, plan };
    };
    const run = (state, spin, zeta, law) => {
      const { S, plan } = setup(state, spin, zeta, law);
      const o = { Q: HP.dfmSpinDipoleMoment(0, S), layQ: HP.dfmLayerDipoleMoment(0, S),
        nLay: S.layN[0] || 0, md: S.coreMd[0],
        layZeta: HP.dfmLayerInertiaScale ? HP.dfmLayerInertiaScale(0, 0, S) : null,
        planZeta: plan ? (plan.layers[0].inertiaScale === undefined ? 1 : plan.layers[0].inertiaScale) : null,
        law: HP.dfmShellSpinMassOf ? HP.dfmShellSpinMassOf(0, S) : null };
      for (let k = 0; k < steps; k++) S.step(0.016);
      o.st = []; for (let i = 0; i < S.n; i++) o.st.push([S.x[i], S.y[i], S.vx[i], S.vy[i], S.spin[i]]);
      return o;
    };
    const diff = (a, b) => { let m = 0;
      for (let i = 0; i < a.st.length; i++) for (let k = 0; k < a.st[i].length; k++)
        m = Math.max(m, Math.abs(a.st[i][k] - b.st[i][k]));
      return m; };
    // ===== ① 等価性の行列 =====
    O.matrix = {};
    for (const [tag, spin, zeta, law] of [
      ['spin0_z1_total', 0, 1, 'total'],
      ['spin04_z1_total', 0.4, 1, 'total'],
      ['spin0_z4_total', 0, 4, 'total'],
      ['spin04_z4_total', 0.4, 4, 'total'],
      ['spin04_z1_shell', 0.4, 1, 'shell'],
      ['spin04_z4_shell', 0.4, 4, 'shell'],
      ['spin0_z4_shell', 0, 4, 'shell'],
      ['spin2_z25_shell', 2, 2.5, 'shell'],
    ]) {
      const v2 = run('v2', spin, zeta, law);
      const both = run('both', spin, zeta, law);
      const lay = run('lay', spin, zeta, law);
      O.matrix[tag] = { spin, zeta, law,
        Q: { v2: v2.Q, both: both.Q, lay: lay.Q },
        layQ: lay.layQ, layZeta: lay.layZeta, planZeta: lay.planZeta, lawRead: v2.law,
        dQ: { bothMinusV2: both.Q - v2.Q, layMinusV2: lay.Q - v2.Q },
        d600: { both: diff(v2, both), lay: diff(v2, lay) } };
    }
    // ===== ② 「値を足すだけでは同じにならない」対照(ζ を剥ぐ) =====
    O.noZeta = {};
    for (const [tag, spin, zeta] of [['z4', 0, 4], ['z025', 0, 0.25]]) {
      const v2 = run('v2', spin, zeta, 'total');
      const lay = run('lay', spin, zeta, 'total');
      const bare = run('layNoZeta', spin, zeta, 'total');
      O.noZeta[tag] = { zeta, qV2: v2.Q, qLayWithZeta: lay.Q, qLayNoZeta: bare.Q,
        dWith: lay.Q - v2.Q, dWithout: bare.Q - v2.Q,
        expect: (bare.layQ !== null ? bare.layQ : 0) * (1 - 1 / zeta),
        d600With: diff(v2, lay), d600Without: diff(v2, bare) };
    }
    // ===== ③ 移行計画の ζ =====
    {
      const P = HP.coreV2MigrationPlan;
      const p4 = P({ m: 100, radius: 10, spin: 0.5,
        core: { mode: 'differential', massFrac: 0.3, radius: 5, omega: 4, tilt: 0, inertiaScale: 4 } });
      const p1 = P({ m: 100, radius: 10, spin: 0.5,
        core: { mode: 'differential', massFrac: 0.3, radius: 5, omega: 4, tilt: 0, inertiaScale: 1 } });
      const ps = P({ m: 100, radius: 10, spin: 0.5,
        core: { mode: 'differential', massFrac: 0.3, radius: 5, omega: 4, tilt: 0, shellSpinMass: 'shell' } });
      O.plan = { zeta4: p4.layers[0].inertiaScale, Ic4: p4.Ic, Jz4: p4.Jz,
        zeta1Key: Object.prototype.hasOwnProperty.call(p1.layers[0], 'inertiaScale'),
        lawTotal: p1.shellSpinMass, lawShell: ps.shellSpinMass };
    }
    // ===== ④ 置換可否レポートの再集計(内蔵 122 本・deep copy の上で law を強制) =====
    const tally = (force) => {
      const tot = { canReplace: 0, cannot: 0 }, byAxis = {}, byReason = {};
      let nCore = 0; const ids = [];
      for (const p of HP.allPresets()) {
        let q = p;
        if (force) { q = JSON.parse(JSON.stringify(p));
          for (const b of (q.bodies || [])) if (b && b.core && b.core.mode !== 'cavity')
            b.core.shellSpinMass = 'shell'; }
        const r = HP.coreV2ReplaceReport(q);
        if (!r.nCore) continue;
        nCore += r.nCore; tot.canReplace += r.counts.canReplace; tot.cannot += r.counts.cannot;
        for (const k of Object.keys(r.byAxis)) byAxis[k] = (byAxis[k] || 0) + r.byAxis[k];
        for (const k of Object.keys(r.byReason)) byReason[k] = (byReason[k] || 0) + r.byReason[k];
        if (r.counts.canReplace) ids.push((p.emoji || '') + p.id);
      }
      return { nPresets: HP.allPresets().length, nCore, tot, byAxis, byReason, ids };
    };
    O.report = { asIs: tally(false), forcedShell: tally(true) };
    // ===== ⑤ 既定 Q の変動影響(122 本を "shell" に強制したときの body ごとの Q) =====
    {
      const rows = [];
      for (const p of HP.allPresets()) {
        for (const b of (p.bodies || [])) {
          if (!b || !b.core || b.core.mode === 'cavity') continue;
          const m = Number(b.m), R = Number(b.radius !== undefined ? b.radius : b.R);
          const sp = Number(b.spin), mf = Number(b.core.massFrac);
          if (!Number.isFinite(m) || !Number.isFinite(R) || !Number.isFinite(sp)
              || !Number.isFinite(mf)) continue;
          const zeta = (b.core.inertiaScale === undefined) ? 1 : Number(b.core.inertiaScale);
          const Mc = mf * Math.abs(m), Ms = m - Mc;
          const Ic = 0.5 * Mc * Number(b.core.radius) * Number(b.core.radius) * zeta;
          const om = (b.core.omega === undefined) ? 0 : Number(b.core.omega);
          const th = (b.core.tilt === undefined) ? 0 : Number(b.core.tilt);
          const Jz = Ic * om * Math.cos(th * Math.PI / 180);
          const core = (b.core.mode === 'differential' || b.core.mode === 'active')
            ? (Ic > 1e-12 ? Jz / zeta : 0) : 0;
          const qT = 0.5 * m * R * R * sp + core;
          const qS = 0.5 * Ms * R * R * sp + core;
          if (qT === qS) continue;
          rows.push({ id: (p.emoji || '') + p.id, spin: sp, massFrac: mf,
            qTotal: qT, qShell: qS, rel: (qT !== 0) ? (qS - qT) / qT : null });
        }
      }
      rows.sort((a, b) => Math.abs((b.rel === null ? 0 : b.rel)) - Math.abs((a.rel === null ? 0 : a.rel)));
      O.qShift = { nChanged: rows.length, top: rows.slice(0, 12),
        relMin: rows.length ? Math.min(...rows.map((r) => (r.rel === null ? 0 : r.rel))) : null,
        relMax: rows.length ? Math.max(...rows.map((r) => (r.rel === null ? 0 : r.rel))) : null };
    }
    // ===== ⑥ 既定("total" を宣言しない)経路の局所確認 =====
    {
      const a = run('v2', 0.4, 1, 'total');
      const b = run('v2', 0.4, 1, 'total');
      O.selfSame = { d: diff(a, b), Q: a.Q, law: a.law };
    }
    return O;
  }, STEPS);
  await page.close();
  return { target, out, errs };
}

const res = [];
for (const t of TARGETS) res.push(await measure(t));
await browser.close();
const json = JSON.stringify(res, null, 1);
console.log(json);
if (process.env.W265C_OUT) fs.writeFileSync(process.env.W265C_OUT, json);

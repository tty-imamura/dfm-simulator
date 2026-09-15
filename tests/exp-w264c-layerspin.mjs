// 第264便c(第56報「親子コアが、コアV2を完全に置き換え可能な状態かを確認する」):
// **回転場の源の等価性**を 3 状態で測る器。
//
//   (i)   コア V2 のみ(基点と同じ宣言)
//   (ii)  層 + コア V2(移行計画で層を付け、V2 の宣言は残す)
//   (iii) 層のみ(移行後にコア V2 を実行状態から外す)
//
// 測るもの: spinDipoleMoment(回転場の源 Q)・層の Σ J_z・相手粒子が受けるスピン双極子力の
// 1 步 Δv・600 步後の状態(x/y/vx/vy/spin の最大絶対差と最大相対差)。
// 3 つの用量で回す: spin=0/ζ=1(厳密一致を期待)・spin≠0(殻の項の差)・ζ≠1(慣性倍率の差)。
// λ(physics.spinSpin)は **源の差が 600 步の状態に出る大きさ**に取る(d=60・λ=10⁶ で
// スピン双極子の加速度が重力の 2% 級 —— 小さすぎると「一致」が Float32 の床に埋もれて意味を失う)。
//
// 使い方:
//   PLAYWRIGHT_CORE_DIR=/home/user/dfm-simulator node tests/exp-w264c-layerspin.mjs beta/index.html
//   W264C_OUT=/path/layerspin-w264c.json node tests/exp-w264c-layerspin.mjs beta/_w264_base.html beta/index.html
// 出力: JSON(標準出力 + W264C_OUT)。**エンジンの既定経路は 1 bit も触らない**(opt-in の
// physics.spinSpin を宣言した専用プリセットの中だけで測る)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGETS = process.argv.slice(2).length ? process.argv.slice(2) : ['beta/index.html'];
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const STEPS = Number(process.env.W264C_STEPS || 600);

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
    const mkP = (spin, zeta) => ({
      id: 'w264cLayerSpin', name: 'w264cLayerSpin', emoji: '🧪',
      description: '第264便c の器(回転場の源の等価性)。E4 だけを残し、opt-in の spinSpin を宣言する。',
      camera: { scale: 300 }, world: { boundary: 'none', size: 0 }, seed: 1,
      physics: { G: 1, D0: 0, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, kappaT: 1 / 60,
        cLight: 30, contactK: 0, contactCap: 0, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
        geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.5, timeScale: 1,
        spinSpin: 1e6 },
      bodies: [
        { type: 'single', m: 1000, radius: 10, x: -30, y: 0, vx: 0, vy: 0, spin, pinned: false,
          core: { mode: 'differential', massFrac: 0.3, radius: 0.1, omega: 20, tilt: 60, inertiaScale: zeta } },
        { type: 'single', m: 10, radius: 1, x: 30, y: 0, vx: 0, vy: 0, spin: 3, pinned: false }],
      overlays: {},
    });
    // 実行状態からコア V2 を外す(層だけの粒子にする)。**層は 1 bit も触らない**
    const dropV2 = (S, i) => {
      S.coreMd[i] = 0; S.coreMF[i] = 0; S.RcV[i] = 0; S.coreJ[i] = 0; S.coreJm[i] = 0;
      S.coreIS[i] = 1; S.coreJx[i] = 0; S.coreJy[i] = 0; S.coreKcs[i] = 0;
      if (S.corePump) S.corePump[i] = 0; if (S.coreCtr) S.coreCtr[i] = 0;
      let any = false; for (let k = 0; k < S.n; k++) if (S.coreMd[k]) { any = true; break; }
      S.hasCoreV2 = any;
    };
    const setup = (state, spin, zeta) => {
      const v = HP.validatePreset(mkP(spin, zeta));
      const S = HP.sim; S.build(v.preset);
      let plan = null;
      if (state !== 'v2') {
        plan = HP.coreV2MigrationPlan({ m: S.m[0], R: S.R[0], spin: S.spin[0],
          core: { mode: 'differential', massFrac: S.coreMF[0], radius: S.RcV[0], inertiaScale: S.coreIS[0],
            Jz: S.coreJ[0], Jmag: S.coreJm[0], Jx: S.coreJx[0], Jy: S.coreJy[0] } });
        S._setBodyLayers(0, plan.layers);
        if (state === 'lay') dropV2(S, 0);
      }
      return { S, plan };
    };
    const probe = (spin, zeta, state) => {
      const { S, plan } = setup(state, spin, zeta);
      const LM = HP.BODY_LAYER_MAX, b0 = 0;
      let sumJ = 0; for (let q = 0; q < (S.layN[0] || 0); q++) sumJ += S.layJ[b0 + q];
      const o = {
        Q0: HP.dfmSpinDipoleMoment(0, S), Q1: HP.dfmSpinDipoleMoment(1, S),
        layerQ: HP.dfmLayerDipoleMoment(0, S), sumLayerJz: sumJ,
        nLay: S.layN[0] || 0, coreMd: S.coreMd[0],
        layJx: S.layJx ? S.layJx[b0] : null, layJy: S.layJy ? S.layJy[b0] : null,
        coreJx: S.coreJx[0], planJx: plan ? plan.Jx : null, planJz: plan ? plan.Jz : null,
      };
      // 相手粒子(#1)が 1 步で受ける Δv(重力+スピン双極子の合計 — 重力は 3 状態で同じ)
      const v0x = S.vx[1], v0y = S.vy[1];
      S.step(0.016);
      o.dv1 = [S.vx[1] - v0x, S.vy[1] - v0y];
      for (let k = 1; k < steps; k++) S.step(0.016);
      o.st = [];
      for (let i = 0; i < S.n; i++) o.st.push([S.x[i], S.y[i], S.vx[i], S.vy[i], S.spin[i]]);
      o.t = S.t;
      return o;
    };
    const cmp = (a, b) => {
      let maxAbs = 0, maxRel = 0;
      for (let i = 0; i < a.st.length; i++) for (let k = 0; k < a.st[i].length; k++) {
        const d = Math.abs(a.st[i][k] - b.st[i][k]);
        if (d > maxAbs) maxAbs = d;
        const den = Math.max(Math.abs(a.st[i][k]), Math.abs(b.st[i][k]));
        if (den > 0 && d / den > maxRel) maxRel = d / den;
      }
      return { maxAbs, maxRel, bitSame: maxAbs === 0 };
    };
    const cases = {};
    for (const [tag, spin, zeta] of [['spin0_zeta1', 0, 1], ['spin04_zeta1', 0.4, 1], ['spin0_zeta4', 0, 4]]) {
      const v2 = probe(spin, zeta, 'v2');
      const both = probe(spin, zeta, 'both');
      const lay = probe(spin, zeta, 'lay');
      cases[tag] = { spin, zeta,
        Q: { v2: v2.Q0, both: both.Q0, lay: lay.Q0 },
        layerQ: { v2: v2.layerQ, both: both.layerQ, lay: lay.layerQ },
        sumLayerJz: { v2: v2.sumLayerJz, both: both.sumLayerJz, lay: lay.sumLayerJz },
        nLay: { v2: v2.nLay, both: both.nLay, lay: lay.nLay },
        coreMd: { v2: v2.coreMd, both: both.coreMd, lay: lay.coreMd },
        layJx: { both: both.layJx, lay: lay.layJx }, coreJx: v2.coreJx,
        planJx: both.planJx, planJz: both.planJz,
        dv1: { v2: v2.dv1, both: both.dv1, lay: lay.dv1 },
        dQ: { bothMinusV2: both.Q0 - v2.Q0, layMinusV2: lay.Q0 - v2.Q0 },
        state600: { bothVsV2: cmp(v2, both), layVsV2: cmp(v2, lay) },
      };
    }
    // 二重計上が起きていないことの直接確認: 層 + V2 の粒子で層の J を 10 倍にしても Q が動かない
    {
      const { S } = setup('both', 0, 1);
      const q0 = HP.dfmSpinDipoleMoment(0, S);
      const arr = S.bodyLayersOf(0).map((L) => ({ role: L.role, m: L.m, r: L.r, J: (L.J || 0) * 10,
        Jx: L.Jx, Jy: L.Jy }));
      S._setBodyLayers(0, arr);
      cases.noDoubleCount = { qBefore: q0, qAfter: HP.dfmSpinDipoleMoment(0, S),
        layerQ: HP.dfmLayerDipoleMoment(0, S), coreMd: S.coreMd[0] };
    }
    // 宣言の無い層(🧅 のように J を書いていない)は従来式のまま = 既定経路不変の根拠
    {
      HP.loadPreset('layeredCoreDFM', false);
      const S = HP.sim;
      cases.onionUndeclared = { Q: HP.dfmSpinDipoleMoment(0, S), layerQ: HP.dfmLayerDipoleMoment(0, S),
        legacy: 0.5 * S.m[0] * S.R[0] * S.R[0] * S.spin[0], nLay: S.layN[0], spin: S.spin[0] };
    }
    return cases;
  }, STEPS);
  await page.close();
  return { target, out, errs };
}

const res = [];
for (const t of TARGETS) res.push(await measure(t));
await browser.close();
const json = JSON.stringify(res, null, 1);
console.log(json);
if (process.env.W264C_OUT) fs.writeFileSync(process.env.W264C_OUT, json);

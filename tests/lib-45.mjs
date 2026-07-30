// 第45便 45B: exp-45-* が共有するページ起動+計測ハーネス。
// tests/qa.mjs と同じ流儀(playwright → file:// で beta/index.html を開き page.evaluate で駆動)。
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const TARGET = process.env.QA_TARGET || 'beta/index.html';
export const INDEX = 'file://' + path.join(ROOT, TARGET);

export async function getBrowser() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  try { const { chromium } = await import('playwright-core'); return await chromium.launch({ executablePath: exe }); } catch {}
  throw new Error('playwright が見つかりません');
}

export async function openPage() {
  const browser = await getBrowser();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.on('pageerror', (e) => console.error('PAGEERROR', e.message));
  await page.goto(INDEX, { waitUntil: 'load' });
  await page.waitForFunction(() => typeof window.HP !== 'undefined');
  await page.evaluate(HARNESS_SRC);
  return { browser, page };
}

// ページ側へ注入する共通ハーネス。第一法則の物差しは QA fusion.* と同一式
// (KE並進+KE回転+内部熱 C·m·T_int − 重力 + E9 法線ばね + E5′ U_rep + 放射 radE
//  + 融合/分裂リザーバ fusU + 箱の反発係数<1 で壁に吸われた wallKE)。
export const HARNESS_SRC = `
window.__F = {
  mk: (bodies, fusion, phys, world) => ({
    id: 'exp45', name: 'exp45', description: '第45便 45B 実験構成',
    camera: { scale: 200 }, world: world || { boundary: 'none', size: 0 },
    thermal: 'tint', fusion,
    physics: Object.assign({ G: 1, D0: 0, kFrame: 0, kRep: 2, q: 2, muF: 0, gammaN: 0,
      kappaS: 0, etaRad: 0, pRad: 1, cHeat: 0.2, softening: 2, radiusScale: 1, timeScale: 1 }, phys || {}),
    bodies, overlays: {}
  }),
  energy: (s) => {
    const G = s.params.G, eps2 = s.params.softening * s.params.softening, C = s.params.cHeat;
    // 一様重力場(外部場 gravityX/gravityY)は a=(gX,gY) なのでポテンシャルは U=-m(gX·x+gY·y)。
    // 場を使う構成(♨️/🧊 系)ではこれを入れないと第一法則が閉じない
    const gX = s.params.gravityX || 0, gY = s.params.gravityY || 0;
    let E = 0;
    for (let i = 0; i < s.n; i++) {
      E += 0.5 * s.m[i] * (s.vx[i] * s.vx[i] + s.vy[i] * s.vy[i]);
      E += 0.25 * s.m[i] * s.R[i] * s.R[i] * s.spin[i] * s.spin[i];
      E += C * s.m[i] * (s.Tint ? s.Tint[i] : 0);
      E -= s.m[i] * (gX * s.x[i] + gY * s.y[i]);
    }
    for (let i = 0; i < s.n; i++) for (let j = i + 1; j < s.n; j++) {
      const dx = s.x[i] - s.x[j], dy = s.y[i] - s.y[j], d2 = dx * dx + dy * dy, d = Math.sqrt(d2);
      E -= G * s.m[i] * s.m[j] / Math.sqrt(d2 + eps2);
      const sumR = s.R[i] + s.R[j];
      if (d < sumR) {
        const muM = s.m[i] * s.m[j] / (s.m[i] + s.m[j]);
        const maxInv = Math.max(1 / s.m[i], 1 / s.m[j]);
        const xO = sumR - d, xC = 8 / (maxInv * 40 * muM);
        E += (xO <= xC) ? 20 * muM * xO * xO : 20 * muM * xC * xC + (8 / maxInv) * (xO - xC);
      }
    }
    return E + HP.urepEnergy(s) + s.radE + s.fusU + s.wallKE;
  },
  mass: (s) => { let M = 0; for (let i = 0; i < s.n; i++) M += s.m[i]; return M; },
  // 1サブステップずつ進め、粒子数が変わった step(=融合/分裂)の帳簿の跳びと、
  // 変わらなかった step の跳び(=積分器そのものの1步誤差)を別々に最大値で採る
  run: (preset, steps, opt) => {
    const s = HP.sim, F = window.__F;
    opt = opt || {};
    s.build(preset);
    const n0 = s.n, mass0 = F.mass(s);
    let eEv = 0, eStep = 0, pEv = 0, lEv = 0, nMaxSeen = s.n;
    const series = [];
    for (let k = 0; k < steps; k++) {
      const nb = s.n, Eb = F.energy(s), Tb = s.totals();
      s.step(opt.dt || 0.016);
      const dE = Math.abs(F.energy(s) - Eb), T1 = s.totals();
      if (s.n !== nb) {
        eEv = Math.max(eEv, dE);
        pEv = Math.max(pEv, Math.abs(T1.px - Tb.px), Math.abs(T1.py - Tb.py));
        lEv = Math.max(lEv, Math.abs(T1.L - Tb.L));
      } else eStep = Math.max(eStep, dE);
      if (s.n > nMaxSeen) nMaxSeen = s.n;
      if (opt.sample && k % opt.sample === 0) {
        let Tm = 0; for (let i = 0; i < s.n; i++) Tm += s.Tint ? s.Tint[i] : 0;
        series.push({ k, t: s.t, n: s.n, T: s.n ? Tm / s.n : 0, E: F.energy(s), fusN: s.fusN, fisN: s.fisN });
      }
    }
    const fu = s.fusLog || [], fi = s.fisLog || [];
    const mx = (a, f) => a.reduce((r, e) => Math.max(r, f(e)), 0);
    return {
      n0, n1: s.n, nMaxSeen, mass0, mass1: F.mass(s), fusN: s.fusN, fisN: s.fisN, fusU: s.fusU,
      eEv, eStep, pEv, lEv,
      rP: Math.max(mx(fu, e => e.rP), mx(fi, e => e.rP)),
      rL: Math.max(mx(fu, e => e.rL), mx(fi, e => e.rL)),
      rE: Math.max(mx(fu, e => e.rE), mx(fi, e => e.rE)),
      // 回収帳簿 fusPx/fusPy/fusL が融合+分裂の格納丸めの全量を持っていることの恒等式
      carry: Math.max(
        Math.abs(s.fusPx + fu.reduce((a, e) => a + e.ePx, 0) + fi.reduce((a, e) => a + e.ePx, 0)),
        Math.abs(s.fusPy + fu.reduce((a, e) => a + e.ePy, 0) + fi.reduce((a, e) => a + e.ePy, 0)),
        Math.abs(s.fusL + fu.reduce((a, e) => a + e.eL, 0) + fi.reduce((a, e) => a + e.eL, 0))),
      fus: fu.map(e => ({ t: e.t, dKE: e.dKE, uGrav: e.uGrav, uRep: e.uRep, uSpr: e.uSpr, dU3: e.dU3, eSc: e.eSc, dFrac: e.dFrac })),
      fis: fi.map(e => ({ t: e.t, m: e.m, T0: e.T0, T1: e.T1, w: e.w, d: e.d, dFrac: e.dFrac,
        dKE: e.dKE, dEsplit: e.dEsplit, uGrav: e.uGrav, uRep: e.uRep, uSpr: e.uSpr, dU3: e.dU3,
        heat: e.heat, eSc: e.eSc, rP: e.rP, rL: e.rL, rE: e.rE })),
      series,
      T: s.Tint ? Array.from(s.Tint.slice(0, s.n)) : []
    };
  }
};
`;

export const fmt = (v, d = 4) => (Number.isFinite(v) ? v.toExponential(d) : String(v));
export const num = (v, d = 3) => (Number.isFinite(v) ? v.toFixed(d) : String(v));

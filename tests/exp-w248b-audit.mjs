// 第248便b W2「⚡ の非スピン超過歳差の監査」。
//
// 背景: ⚡ psrDoubleABDFM の近点移動は framePrecision:"double" で 0.00945°/周 に収束した(第247便a D2)。
//       観測は 0.004731°/周(Kramer 2021 の ω̇=16.899°/yr ÷ 3572.07 周/yr)= **DFM は約2倍**。
//       SO(スピン–軌道)は tests/exp-w248b-so.mjs の独立参照で |Δϖ_SO|=1.95e-7°/周 = 差の 1/2.4e4 しかない。
//       よって埋めるべきは**非スピンの超過**であり、本スクリプトはその要因を掃引で分離する。
//
// **エンジンは変えない**。すべて JSON(preset)側の宣言を差し替えて測るだけである。
// 近点検出は第246便b→第247便a と同一手続き(検出器 A=ṙ の −→+ 交差 / B=距離極小の放物線頂点、
// 柵は 近点/遠点の区別・一周に近点1つ・半周ジャンプ拒否、5近点の位相を直線 fit)。
//
// 実行: node tests/exp-w248b-audit.mjs [--fast]
//       --fast は dt=0.001 の行を省く。
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const FAST = process.argv.slice(2).includes('--fast');

let browser;
try { const { chromium } = await import('playwright'); browser = await chromium.launch(); }
catch { const { chromium } = await import('playwright-core');
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); }
const pg = await browser.newPage();
const pageErrors = [];
pg.on('pageerror', (e) => pageErrors.push(String(e)));
await pg.goto(INDEX, { waitUntil: 'load' });
await pg.waitForFunction(() => window.HP && HP.sim);

await pg.evaluate(() => {
  // ---- ⚡ の変種を組む。mods = { f, physics:{...}, dropCore, dropSpinDipole }
  //   f は質量較正の因子(既定 1.999942269345993)。位置・速度は**質量比だけで決まる**ので触らない
  //   (第247便a の __w247psr と同じ約束 — 遠点整列の重心配分は f に依らない)。
  window.__w248variant = (mods) => {
    const pd = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === 'psrDoubleABDFM')));
    const f0 = pd.massCalibration.factor;
    const f = (mods.f === undefined) ? f0 : mods.f;
    for (const b of pd.bodies) {
      b.m = b.m / f0 * f;
      if (b.core) { if (f <= 1) delete b.core; else b.core.massFrac = (f - 1) / f; }
      if (mods.dropSpinDipole && b.spinDipole) delete b.spinDipole;
      if (mods.dropCore && b.core) delete b.core;
    }
    pd.physics = Object.assign({}, pd.physics, { framePrecision: 'double' }, mods.physics || {});
    for (const k of (mods.dropPhysics || [])) delete pd.physics[k];
    delete pd.massCalibration;    // 台帳の三者一致検査を実験へ持ち込まない
    return { pd, f };
  };
  // ---- 近点移動の測定(第246便b/第247便a と同一手続き)
  window.__w248peri = (S, dt, tEnd, pRef) => {
    const steps = Math.round(tEnd / dt);
    const A = [], Bd = [];
    let r2 = 0, r1 = 0, t2 = 0, t1 = 0, rd1 = 0, rMin = Infinity, rMax = -Infinity;
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
      if (k >= 2 && r1 < r2 && r1 < rr) {
        const dd = (r2 - 2 * r1 + rr), fr = (dd !== 0) ? 0.5 * (r2 - rr) / dd : 0;
        let a1 = t2, a2 = t1, a3 = th;
        while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI; while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
        while (a3 - a2 > Math.PI) a3 -= 2 * Math.PI; while (a3 - a2 < -Math.PI) a3 += 2 * Math.PI;
        Bd.push({ ang: a2 + 0.5 * fr * (a3 - a1) + 0.5 * fr * fr * (a3 - 2 * a2 + a1), k: k - 1 + fr, r: r1 });
      }
      r2 = r1; r1 = rr; t2 = t1; t1 = th; rd1 = rd;
    }
    const fit = (raw) => {
      const mid = 0.5 * (rMin + rMax);
      const peri = raw.filter((p) => p.r < mid);
      const rej = { apo: raw.length - peri.length, dup: 0, jump: 0 };
      const keep = [];
      for (const p of peri) {
        if (keep.length && (p.k - keep[keep.length - 1].k) * dt < 0.5 * pRef) { rej.dup++; continue; }
        keep.push(p);
      }
      const use = keep.slice(0, 5), ang = [];
      for (let i = 0; i < use.length; i++) {
        let a = use[i].ang;
        if (i) {
          let z = a - ang[i - 1]; while (z > Math.PI) z -= 2 * Math.PI; while (z < -Math.PI) z += 2 * Math.PI;
          if (Math.abs(z) > Math.PI / 2) { rej.jump++; break; }
          a = ang[i - 1] + z;
        }
        ang.push(a);
      }
      const n = ang.length; let slope = null, resid = null;
      if (n >= 2) {
        const mx = (n - 1) / 2, my = ang.reduce((a, b) => a + b, 0) / n;
        let sxy = 0, sxx = 0;
        for (let i = 0; i < n; i++) { sxy += (i - mx) * (ang[i] - my); sxx += (i - mx) * (i - mx); }
        slope = sxy / sxx;
        resid = Math.sqrt(ang.reduce((s, a, i) => s + (a - (my + slope * (i - mx))) ** 2, 0) / n);
      }
      const per = []; for (let i = 1; i < use.length; i++) per.push((use[i].k - use[i - 1].k) * dt);
      return { nPeri: n, rej, slopeDeg: slope === null ? null : slope * 180 / Math.PI,
        residDeg: resid === null ? null : resid * 180 / Math.PI, per };
    };
    return { rMin, rMax, A: fit(A), B: fit(Bd), nan: S.hasNaN(),
      clamp: S.clampVN + S.clampSN + S.clampRN + S.clampTN, framePrec: S.framePrec, hasSS: S.hasSpinSpin };
  };
  // ---- 1行を測る
  window.__w248run = (mods, dt) => {
    const { pd, f } = window.__w248variant(mods);
    const v = HP.validatePreset(pd); const S = HP.sim; S.build(v.preset);
    const o = window.__w248peri(S, dt, 5.6 * 881.9, 881.9);
    o.warn = v.warnings.length; o.warnMsgs = v.warnings.slice(0, 3);
    o.f = f; o.mA = pd.bodies[0].m; o.mB = pd.bodies[1].m;
    o.sep0 = Math.abs(pd.bodies[1].x - pd.bodies[0].x);
    return o;
  };
  // ---- 参照値: 同じ質量・同じ軌道要素での GR 1PN 予測 Δϖ=6πGM/(c²a(1−e²))(単位系そのまま)
  window.__w2481pn = (M, a, e, G, c) => 6 * Math.PI * G * M / (c * c * a * (1 - e * e)) * 180 / Math.PI;
});

const out = { rows: [] };

const push = async (id, label, mods, dt) => {
  const r = await pg.evaluate(({ mods, dt }) => window.__w248run(mods, dt), { mods, dt });
  out.rows.push({ id, label, dt, mods, ...r });
  console.error(`  ${id} (dt=${dt}) → A ${r.A.slopeDeg} deg/orbit  P=${r.A.per[0]}`);
};

// ============================================================ A: 数値(引きずり場の精度と刻み)
await push('A1', 'base(framePrecision:"double")', {}, 0.004);
await push('A2', 'base(framePrecision:"double")', {}, 0.002);
if (!FAST) await push('A3', 'base(framePrecision:"double")', {}, 0.001);
await push('A4', 'framePrecision:"single"(既定=native)', { physics: { framePrecision: 'single' } }, 0.002);

// ============================================================ B: 宣言キーを1つずつ既定→0(dt=0.002 固定)
const DT = 0.002;
await push('B1', 'spinDipole を両体から除去(SS 源をゼロに)', { dropSpinDipole: true }, DT);
await push('B2', 'geoPN=0(測地線 1PN E12 を切る)', { physics: { geoPN: 0 } }, DT);
await push('B3', 'lambdaPN=0(1PN の係数だけ 0)', { physics: { lambdaPN: 0 } }, DT);
await push('B4', 'kFrame=0(E6′ 引きずりを切る)', { physics: { kFrame: 0 } }, DT);
await push('B5', 'D0pull=0', { physics: { D0pull: 0 } }, DT);
await push('B6', 'frameWeight:"share"(第242便以前の重み)', { physics: { frameWeight: 'share' } }, DT);
await push('B7', 'frameReaction:"legacy"(E6′-R を外す)', { physics: { frameReaction: 'legacy' } }, DT);
await push('B8', 'coupleSink 削除(受け先ルーティング無し)', { dropPhysics: ['coupleSink'] }, DT);
await push('B9', 'cmGauge 削除(重心ゲージ無し)', { dropPhysics: ['cmGauge'] }, DT);
await push('B10', 'D0=0(背景決定力ゼロ)', { physics: { D0: 0 } }, DT);
await push('B11', 'q=2(qLock の 3.1789 → 既定)', { physics: { q: 2 } }, DT);
await push('B12', 'core 除去(コアv2 を外す)', { dropCore: true }, DT);
await push('B13', 'pnAlpha=0(1PN の α 項)', { physics: { pnAlpha: 0 } }, DT);

// ============================================================ C: 慣性則 f(質量較正)の掃引
await push('C1', 'f=1(観測質量・他は現行のまま)', { f: 1 }, DT);
await push('C2', 'f=1.5', { f: 1.5 }, DT);
await push('C3', 'f=1 かつ kFrame=0(=観測質量の 1PN だけ)', { f: 1, physics: { kFrame: 0 } }, DT);
await push('C4', 'f=2 かつ kFrame=0(=較正質量の 1PN だけ)', { f: 2, physics: { kFrame: 0 } }, DT);
await push('C5', 'f=1・kFrame=0・geoPN=0(純ニュートン対照)', { f: 1, physics: { kFrame: 0, geoPN: 0 } }, DT);
await push('C6', 'f=1・geoPN=0(引きずりだけ)', { f: 1, physics: { geoPN: 0 } }, DT);
if (!FAST) await push('C7', 'f=1(dt=0.001 — C1 の刻み確認)', { f: 1 }, 0.001);

// ============================================================ D: 「1PN チャネル ∝ λ_PN·GM/(c²p)」の裏取り
//   軌道(a・e・P)を観測どおりに保ったまま f と λ_PN と c を動かし、測った Δϖ が
//   6πG(fM_obs)/(c²a(1−e²)) と一緒に動くかを見る。動けば「超過=質量較正 f」が同定される。
await push('D1', 'lambdaPN=0.5(1PN 係数を半分)', { physics: { lambdaPN: 0.5 } }, DT);
await push('D2', 'lambdaPN=2(1PN 係数を倍)', { physics: { lambdaPN: 2 } }, DT);
await push('D3', 'cLight=3000√2(1PN∝1/c² の確認)', { physics: { cLight: 3000 * Math.SQRT2 } }, DT);
await push('D4', 'f=1.98(較正 f の近傍)', { f: 1.98 }, DT);
await push('D5', 'f=2.02(較正 f の近傍)', { f: 2.02 }, DT);
await push('D6', 'kFrame=0.5(引きずりを半分)', { physics: { kFrame: 0.5 } }, DT);

// ============================================================ 参照値
out.reference = await pg.evaluate(() => {
  const pd = HP.allPresets().find((q) => q.id === 'psrDoubleABDFM');
  const f0 = pd.massCalibration.factor;
  const G = pd.physics.G, c = pd.physics.cLight;
  const mA = pd.bodies[0].m, mB = pd.bodies[1].m;
  const Mobs = (mA + mB) / f0, Mcal = mA + mB;
  const a = 878.8366, e = 0.087777036;                       // 出典表の相対軌道(単位=10⁶m)
  return { G, c, f0, mA, mB, Mobs, Mcal, a, e,
    gr1pnObsMass: window.__w2481pn(Mobs, a, e, G, c),
    gr1pnCalMass: window.__w2481pn(Mcal, a, e, G, c),
    obsDegPerOrbit: 16.899323 / (3.15576e7 / 8834.534723278) };
});

out.pageErrors = pageErrors;
console.log(JSON.stringify(out, null, 1));
await browser.close();

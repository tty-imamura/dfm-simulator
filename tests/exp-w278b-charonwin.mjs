// 第278便b(統括の検証項目 R53・R54)— **陰的中点法 opt-in の検定**と、**カロン周期の再測(4 構成 × 3 刻み・
// 第 2〜第 6 周の時間窓)**を測る器。
//
// ■ しないこと(先に書く)
//   ・**残差がゼロになる ε・a・κ・質量係数を探索しない**(第276便b の禁止をそのまま継ぐ)。
//   ・内蔵の較正 37 本・❄️ plutoCharonReal を 1 bit も触らない(本器は ⛄🌨️ の診断コピーだけを走らせる)。
//   ・「較正が済んだ」「観測と一致した」「新発見」は書かない。**観測検定欄は「判定保留(量定義不一致)」**
//     (同一暦 PLU060 の入力を Buie 2012 の σ で判定しない — 統括の検証項目 R53)。
//
// ■ 測るもの
//   §A 純関数(ブラウザ不要): 無次元の最小対照(G=1・m 0.5/0.5・間隔 1・接線相対速度 1・ω=0・R=0.01・κ=1・
//       W₀=ε=0・h=0.01)の陽的 vs 中点法 / R=0.01·0.1·1 × h=1e−4·1e−2·1 の 9 条件 / 零条件 / 拒否 3 種。
//   §B エンジン(ページ): 同じ最小対照を `HP.dfmRelativeDragStep` に直接当てる(ビルドした宇宙の配列を
//       書き換えて 1 步)/ 零条件 / 受理契約(重複対・不正な integration・零慣性)/ 步での拒否は状態不変 /
//       読み口 `relativeDragProbe` が状態を動かさないこと。
//   §C カロン周期: kF0/semi・DFM/semi+陽的・kF0/leapfrog・DFM/leapfrog+midpoint × dt 0.16/0.08/0.04
//       (単位 10 s)を**同方向 6 周**まで回し、周ごとの周期・自転・熱・すべり・帳簿を記帳する。
//   §D 時間窓の収束(第 2〜第 6 周): **定常周期と呼べるかの判定規則は走らせる前に固定した**(下の STATIONARY)。
//
// 実行:
//   PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w278b-charonwin.mjs
//       [--pilot] [--only A,B,C] [--configs kf0Semi,dfmSemi,kf0Leap,dfmMid] [--stages h,h2,h4] [--orbits 6]
// 出力: tests/out/charonwin-w278b.json(来歴 meta は tests/lib-w272e-provenance.mjs 版 w272e-1)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { withProvenance } from './lib-w272e-provenance.mjs';
import { BUIE_2012, ELEM_2024, HORIZONS_PR, PRECISE_UNITS, pairSlipStep, totalsOf,
  syncCircularPair } from './lib-w277b-charondfm.mjs';
import { MIDPOINT_LIB_VERSION, pairSlipMidpointStep, minimalPair, midpointGuard } from './lib-w278b-midpoint.mjs';
// 第281便a(原仮定者の裁定(第71報)・AN16・統括の検証項目 R71): **この器が読む html の領域**の宣言。
//   `tests/lib-w281a-scope.mjs` がこの領域だけの hash(`scopeSha256`)を正本の meta に刻む。
//   `lint.provenanceMeta` ② は「targetSha256 一致 **または**(scopeComplete かつ scopeSha256 が今の html で
//   引き直した値と一致)」で通す。`lint.regenScope` が「宣言 ⊇ 器のコードから機械で引いた下限
//   (HP.*・html の最上位名・内蔵プリセット id)」を照合する。**1 行の JSON**(lint が読む)。
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
const REGEN_SCOPE = {"presets":["plutoCharonDFM","plutoCharonKF0Control"],"roots":["$","HP.allPresets","HP.dfmRelativeDragStep","HP.relativeDragProbe","HP.sim","HP.validatePreset","T","applyQLock","ch","ctx","dfmRelativeDragMidpointStep","dfmRelativeDragStep","isNum","relativeDragMidpointGuard","relativeDragMidpointSolve","relativeDragProbe","validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);   // 第281便a: 走行開始時の html の領域
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'charonwin-w278b.json');
const HARNESS_VERSION = 'w278b-charonwin-2';   // -2: 周の数え方を位相の直接判定へ(足し込みの丸め段差を除く)

const argv = process.argv.slice(2);
const getArg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const PILOT = argv.includes('--pilot');
const ONLY = (getArg('--only', '') || '').split(',').map((z) => z.trim()).filter(Boolean);
const want = (s) => !ONLY.length || ONLY.includes(s);
const STAGE_LIST = (getArg('--stages', 'h,h2,h4') || '').split(',').map((z) => z.trim()).filter(Boolean);
const ORBITS = +(getArg('--orbits', PILOT ? '2' : '6'));
const CONFIG_LIST = (getArg('--configs', 'kf0Semi,dfmSemi,kf0Leap,dfmMid') || '').split(',').map((z) => z.trim()).filter(Boolean);
const OUT_PATH = getArg('--out', OUT);

// ---- 契約(走らせる前に固定した) ------------------------------------------------
const STAGES = { h: { dt: 0.16 }, h2: { dt: 0.08 }, h4: { dt: 0.04 } };
const SEC_PER_UNIT = Math.pow(10, PRECISE_UNITS.T);
const CONFIGS = {
  kf0Semi: { label: 'kF0 / 既定 semi', id: 'plutoCharonKF0Control', integrator: 'semi', integration: null },
  dfmSemi: { label: 'DFM / semi + 陽的', id: 'plutoCharonDFM', integrator: 'semi', integration: 'explicit' },
  kf0Leap: { label: 'kF0 / leapfrog', id: 'plutoCharonKF0Control', integrator: 'leapfrog', integration: null },
  dfmMid: { label: 'DFM / leapfrog + midpoint', id: 'plutoCharonDFM', integrator: 'leapfrog', integration: 'midpoint' },
};
// **定常周期と呼べるかの判定規則(走らせる前に固定)**:
//   第 k 周の則の寄与 Δ_k = P_k(DFM/midpoint) − P_k(kF0/leapfrog)(同じ dt=0.04)について、
//   第 3〜第 6 周の周ごとの変化 |Δ_k − Δ_{k−1}| が、**同じ周の刻み半減差**
//   max(|P_k(0.04)−P_k(0.08)| の DFM 側, 同 kF0 側) 以下なら「定常周期と呼べる」、
//   1 つでも超えれば「**過渡を含む**」と書く(周ごとの変化が数値分解能より大きい = まだ動いている)。
const STATIONARY_RULE = '第 3〜第 6 周の |Δ_k−Δ_{k−1}|(Δ_k=DFM/midpoint−kF0/leapfrog・dt 0.04)が同じ周の刻み半減差 '
  + '(0.04 と 0.08 の差の大きい方)以下なら「定常周期と呼べる」・超えれば「過渡を含む」';
const OBS = { value: BUIE_2012.periodSec, sigma: BUIE_2012.sigmaSec, source: BUIE_2012.source };
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');

// ================================================================ §A 純関数
const MIN = { G: 1, dt: 0.01, kappa: 1, eps: 0, W0: 0 };
const pureCase = (fn, R, h) => {
  const s = minimalPair({ R }); const a = totalsOf(s);
  const r = fn(s, Object.assign({}, MIN, { dt: h }));
  const b = totalsOf(s);
  return { R, h, dEmech: b.E - a.E, heat: r.heat, EplusHeatErr: (b.E - a.E) + r.heat,
    EplusHeatRel: ((b.E - a.E) + r.heat) / a.E, dP: Math.hypot(b.px - a.px, b.py - a.py),
    dLz: b.L - a.L, dLzRel: Math.abs(b.L - a.L) / Math.max(1e-300, Math.abs(a.L)),
    spin: s.spin.slice(), dEform: r.dEform === undefined ? null : r.dEform,
    heatNonNegative: r.heat >= 0 };
};
const pure = {};
if (want('A')) {
  pure.minimal = { explicit: pureCase(pairSlipStep, 0.01, 0.01), midpoint: pureCase(pairSlipMidpointStep, 0.01, 0.01),
    note: 'G=1・m 0.5/0.5・間隔 1・接線相対速度 1・ω=0・R=0.01・κ=1・W₀=ε=0・h=0.01 の 1 步' };
  pure.nine = [];
  for (const R of [0.01, 0.1, 1]) for (const h of [1e-4, 1e-2, 1])
    pure.nine.push({ R, h, midpoint: pureCase(pairSlipMidpointStep, R, h), explicit: pureCase(pairSlipStep, R, h) });
  pure.nineSummary = {
    midpointHeatAllNonNegative: pure.nine.every((z) => z.midpoint.heat >= 0),
    midpointMaxEplusHeatErr: Math.max(...pure.nine.map((z) => Math.abs(z.midpoint.EplusHeatErr))),
    midpointMaxEplusHeatRel: Math.max(...pure.nine.map((z) => Math.abs(z.midpoint.EplusHeatRel))),
    midpointMaxDP: Math.max(...pure.nine.map((z) => z.midpoint.dP)),
    midpointMaxDLzRel: Math.max(...pure.nine.map((z) => z.midpoint.dLzRel)),
    explicitNegativeHeatCases: pure.nine.filter((z) => z.explicit.heat < 0).map((z) => ({ R: z.R, h: z.h, heat: z.explicit.heat })),
  };
  // 零条件(相互同期した円軌道)— 中点法でもキック・トルク・熱が 0 そのもの
  {
    const sp = syncCircularPair({ m1: 0.5, m2: 0.5, a: 1, G: 1, R1: 0.01, R2: 0.01 });
    const s = { m: sp.m.slice(), x: sp.x.slice(), y: sp.y.slice(), vx: sp.vx.slice(), vy: sp.vy.slice(), spin: sp.spin.slice(), R: sp.R.slice() };
    const before = JSON.stringify(s);
    const r = pairSlipMidpointStep(s, Object.assign({}, MIN, { dt: 0.01 }));
    pure.zero = { kickMax: r.kickMax, torqueMax: r.torqueMax, heat: r.heat, slipMax: r.slipMax,
      stateBitSame: JSON.stringify(s) === before };
  }
  // 拒否(状態不変)
  const rej = (tag, mut, pairs) => {
    const s = minimalPair({ R: 0.01 }); if (mut) mut(s);
    const before = JSON.stringify(s); let err = null;
    try { pairSlipMidpointStep(s, Object.assign({}, MIN, pairs ? { pairs } : {})); } catch (e) { err = (e instanceof RangeError) ? 'RangeError: ' + e.message : String(e); }
    return { tag, rejected: err !== null, err, stateBitSame: JSON.stringify(s) === before };
  };
  pure.reject = [
    rej('零慣性 R=0', (s) => { s.R[0] = 0; }),
    rej('多対(3 体・全対)', (s) => { s.m.push(0.1); s.x.push(3); s.y.push(0); s.vx.push(0); s.vy.push(0); s.spin.push(0); s.R.push(0.01); }),
    rej('零質量', (s) => { s.m[1] = 0; }),
    rej('重なった対 r=0', (s) => { s.x[1] = s.x[0]; }),
  ];
  pure.guardOk = midpointGuard(minimalPair({}), [[0, 1]]) === null;
}

// ================================================================ ブラウザ
let browser = null, page = null; const pageErrors = [];
async function openPage() {
  const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
  const req = createRequire(path.join(PW_DIR, 'noop.js'));
  const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { browser = await req('playwright').chromium.launch(); }
  catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
  page = await browser.newPage();
  page.on('pageerror', (e) => pageErrors.push(String(e)));
  await page.goto(INDEX, { waitUntil: 'load' });
  await page.waitForFunction(() => window.HP && HP.sim);
  await page.evaluate(installRunner);
}

function installRunner() {
  const W = window.__w278b = {};
  W.make = (cfg) => {
    const src = HP.allPresets().find((q) => q.id === cfg.id);
    if (!src) return null;
    const p = JSON.parse(JSON.stringify(src));
    if (cfg.integrator) p.integrator = cfg.integrator;
    if (p.physics.relativeDrag) {
      if (cfg.integration === 'midpoint') p.physics.relativeDrag.integration = 'midpoint';
      else delete p.physics.relativeDrag.integration;
    }
    return p;
  };
  // 帳簿の読み口(**器の側で 1 回だけ** resPx/resPy/resL/radL を足す — S.totals は変えない)
  W.ledgerOf = (S) => { const t = S.totals();
    return { px: t.px + (S.resPx || 0), py: t.py + (S.resPy || 0), L: t.L + (S.resL || 0) + (S.radL || 0),
      pxBare: t.px, pyBare: t.py, LBare: t.L, resPx: S.resPx || 0, resPy: S.resPy || 0, resL: S.resL || 0, radL: S.radL || 0 }; };
  W.run = (cfg, dt, orbMax) => {
    const p = W.make(cfg);
    if (!p) return { error: 'no-preset' };
    const v = HP.validatePreset(p);
    if (!v.ok) return { error: 'validate', errors: v.errors };
    HP.sim.build(v.preset);
    const S = HP.sim, G = S.params.G, eps = S.params.softening, ci = 0, oi = 1;
    const mA = S.m[ci], mB = S.m[oi], MT = mA + mB;
    const tot0 = W.ledgerOf(S);
    const energy = () => { const E = S.energies(); return E.kin + E.rot; };
    const eNewton = () => { const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci];
      return energy() - G * mA * mB / Math.sqrt(dx * dx + dy * dy + eps * eps); };
    const pAbs = () => { let s = 0; for (let i = 0; i < S.n; i++) s += S.m[i] * Math.hypot(S.vx[i], S.vy[i]); return s; };
    const e0 = eNewton(), pScale0 = pAbs();
    const slip = () => { const rx = S.x[oi] - S.x[ci], ry = S.y[oi] - S.y[ci];
      const vx = S.vx[oi] - S.vx[ci], vy = S.vy[oi] - S.vy[ci];
      const wi = S.spin[ci], wj = S.spin[oi];
      return [Math.hypot(vx + wi * ry, vy - wi * rx), Math.hypot(vx + wj * ry, vy - wj * rx)]; };
    const osc = () => { const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci];
      const dvx = S.vx[oi] - S.vx[ci], dvy = S.vy[oi] - S.vy[ci];
      const r = Math.hypot(dx, dy), v2 = dvx * dvx + dvy * dvy, mu = G * MT;
      const inv = 2 / r - v2 / mu, a = (inv !== 0) ? 1 / inv : NaN;
      const ex = (v2 * dx - (dx * dvx + dy * dvy) * dvx) / mu - dx / r;
      const ey = (v2 * dy - (dx * dvx + dy * dvy) * dvy) / mu - dy / r;
      return { a, e: Math.hypot(ex, ey) }; };
    const P_UNITS = 55185.58944;
    const maxSteps = Math.ceil((orbMax + 0.3) * P_UNITS / dt);
    const revs = [];
    // **周の数え方(第278便b で改めた)**: 角度を步ごとに足し込む方式(angAcc += d)は、ほぼ一定の小さい増分を
    // 大きい累積値へ足すので**丸めが同じ向きに揃う**(累積が 32 rad を越える第 6 周で ulp 7.1e-15 × 1.38M 步
    // ≈ 5e-9 rad/周 = 周期で ≈4e-4 s の段差を実測した)。ここでは**初期方向 r₀ に対する位相**
    // φ=atan2(r₀×r, r₀·r) を步ごとに直接求め、φ が負→非負へ変わる步で 0 を線形補間する(足し込まない)。
    const r0x = S.x[oi] - S.x[ci], r0y = S.y[oi] - S.y[ci];
    const hSign = Math.sign(r0x * (S.vy[oi] - S.vy[ci]) - r0y * (S.vx[oi] - S.vx[ci])) || 1;
    let phPrev = 0;
    // 旧方式(第277便b の器と同じ足し込み)も**同じ走行で並記**する(段差の大きさを実測で残すため)
    let angAcc = 0, angPrev = Math.atan2(r0y, r0x); const revAccT = [];
    let slipMaxRev = 0, nan = false, stop = 'steps', k = 0;
    const t0 = performance.now();
    const spin0 = [S.spin[ci], S.spin[oi]], slip0 = slip();
    let err = null;
    try {
      for (; k < maxSteps; k++) {
        S.step(dt);
        const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci];
        const ph = hSign * Math.atan2(r0x * dy - r0y * dx, r0x * dx + r0y * dy);
        const prevPh = phPrev; phPrev = ph;
        { const th = Math.atan2(dy, dx); let d = th - angPrev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
          const prevAcc = angAcc; angAcc += d; angPrev = th;
          const nPrev = Math.floor(Math.abs(prevAcc) / (2 * Math.PI)), nNow = Math.floor(Math.abs(angAcc) / (2 * Math.PI));
          if (nNow > nPrev) { const target = Math.sign(angAcc) * nNow * 2 * Math.PI;
            revAccT.push((k + ((angAcc !== prevAcc) ? (target - prevAcc) / (angAcc - prevAcc) : 0)) * dt); } }
        if ((k & 63) === 0) { const sl = slip(); const m = Math.max(sl[0], sl[1]); if (m > slipMaxRev) slipMaxRev = m;
          if (!Number.isFinite(dx + dy)) { nan = true; stop = 'nan'; break; } }
        if (prevPh < 0 && ph >= 0) {
          const fr = (ph !== prevPh) ? (0 - prevPh) / (ph - prevPh) : 0;
          const L = W.ledgerOf(S), o = osc(), sl = slip();
          revs.push({ t: (k + fr) * dt, spin: [S.spin[ci], S.spin[oi]], heat: S.relDragHeat || 0, pos: S.relDragPos || 0,
            slip: sl, slipMaxInRev: slipMaxRev, a: o.a, e: o.e,
            Lrel: Math.abs(L.L - tot0.L) / Math.abs(tot0.L),
            Prel: Math.hypot(L.px - tot0.px, L.py - tot0.py) / pScale0,
            EplusHeatRel: (eNewton() + (S.relDragHeat || 0) - e0) / Math.abs(e0) });
          slipMaxRev = 0;
          if (revs.length >= orbMax) { stop = 'orbMax'; k++; break; }
        }
      }
    } catch (e) { err = String(e); stop = 'error'; }
    // 周期は交差時刻の差(第 1 周は t=0 から)。**t は (k+fr)·dt** —— step k の後の時刻は (k+1)·dt なので、
    // 直前の時刻 k·dt から fr だけ進んだところが交差である
    const P = revs.map((r, i) => (i ? r.t - revs[i - 1].t : r.t) * 10);
    const Pacc = revAccT.map((t, i) => (i ? t - revAccT[i - 1] : t) * 10);
    const L1 = W.ledgerOf(S);
    return { cfg, dt, steps: k, stop, nan, err, ms: performance.now() - t0,
      applied: { integrator: S.integrator, hasRelativeDrag: !!S.hasRelativeDrag,
        integration: S.relDrag ? (S.relDrag.integration || 'explicit') : null, kappa: S.relDrag ? S.relDrag.kappa : null,
        spinIsF64: S.spin instanceof Float64Array },
      periodsSec: P, periodsSecLegacyAccum: Pacc, revs, spin0, slip0,
      ledgerEnd: { Lrel: Math.abs(L1.L - tot0.L) / Math.abs(tot0.L), LrelBare: Math.abs(L1.LBare - tot0.LBare) / Math.abs(tot0.LBare),
        Prel: Math.hypot(L1.px - tot0.px, L1.py - tot0.py) / pScale0, resL: L1.resL, radL: L1.radL, resPx: L1.resPx, resPy: L1.resPy,
        EplusHeatRel: (eNewton() + (S.relDragHeat || 0) - e0) / Math.abs(e0) },
      relDrag: { heat: S.relDragHeat || 0, pos: S.relDragPos || 0, kickMax: S.relDragKickMax || 0, slipMax: S.relDragSlipMax || 0, n: S.relDragN || 0 } };
  };
  // §B: エンジンの関数に最小対照を直接当てる(ビルドした宇宙の配列を書き換えて 1 步)
  W.engineMinimal = () => {
    const out = {};
    const prep = (integration, R, st) => {
      const p = W.make({ id: 'plutoCharonDFM', integrator: 'leapfrog', integration });
      const v = HP.validatePreset(p); HP.sim.build(v.preset);
      const S = HP.sim;
      S.params.G = 1; S.params.softening = 0;
      S.m[0] = 0.5; S.m[1] = 0.5; S.R[0] = R; S.R[1] = R;
      S.x[0] = st ? st.x[0] : -0.5; S.x[1] = st ? st.x[1] : 0.5; S.y[0] = st ? st.y[0] : 0; S.y[1] = st ? st.y[1] : 0;
      S.vx[0] = st ? st.vx[0] : 0; S.vx[1] = st ? st.vx[1] : 0; S.vy[0] = st ? st.vy[0] : -0.5; S.vy[1] = st ? st.vy[1] : 0.5;
      S.spin[0] = st ? st.spin[0] : 0; S.spin[1] = st ? st.spin[1] : 0;
      S.relDragHeat = 0; S.relDragPos = 0;
      return S;
    };
    const tot = (S) => { let E = 0, px = 0, py = 0, L = 0;
      for (let i = 0; i < 2; i++) { const I = 0.5 * S.m[i] * S.R[i] * S.R[i];
        E += 0.5 * S.m[i] * (S.vx[i] * S.vx[i] + S.vy[i] * S.vy[i]) + 0.5 * I * S.spin[i] * S.spin[i];
        px += S.m[i] * S.vx[i]; py += S.m[i] * S.vy[i]; L += S.m[i] * (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]) + I * S.spin[i]; }
      return { E, px, py, L }; };
    const one = (integration, R, h, st) => {
      const S = prep(integration, R, st); const a = tot(S);
      const pr = HP.relativeDragProbe(S, 0, 1, h);
      const snapA = JSON.stringify([...S.vx.slice(0, 2), ...S.vy.slice(0, 2), ...S.spin.slice(0, 2)]);
      const probeReadOnly = (JSON.stringify([...S.vx.slice(0, 2), ...S.vy.slice(0, 2), ...S.spin.slice(0, 2)]) === snapA);
      HP.dfmRelativeDragStep(S, h);
      const b = tot(S);
      return { R, h, integration: integration || 'explicit', dEmech: b.E - a.E, heat: S.relDragHeat, pos: S.relDragPos,
        EplusHeatErr: b.E - a.E + S.relDragHeat, dP: Math.hypot(b.px - a.px, b.py - a.py), dLz: b.L - a.L,
        spin: [S.spin[0], S.spin[1]], probeKick: pr ? pr.kickMag : null, probeDE: pr ? (pr.dE === undefined ? null : pr.dE) : null,
        probeReadOnly };
    };
    out.minimalExplicit = one(null, 0.01, 0.01);
    out.minimalMidpoint = one('midpoint', 0.01, 0.01);
    out.nine = [];
    for (const R of [0.01, 0.1, 1]) for (const h of [1e-4, 1e-2, 1]) out.nine.push(one('midpoint', R, h));
    // 零条件(相互同期した円軌道: m 0.5/0.5・a=1・G=1 → Ω=√2)
    { const Om = Math.SQRT2;
      const st = { x: [-0.5, 0.5], y: [0, 0], vx: [0, 0], vy: [-0.5 * Om, 0.5 * Om], spin: [Om, Om] };
      const S = prep('midpoint', 0.01, st);
      const before = JSON.stringify([...S.vx.slice(0, 2), ...S.vy.slice(0, 2), ...S.spin.slice(0, 2)]);
      const r = HP.dfmRelativeDragStep(S, 0.01);
      out.zero = { kickMax: r.kickMax, torqueMax: r.torqueMax, dE: r.dE, heat: S.relDragHeat,
        stateBitSame: JSON.stringify([...S.vx.slice(0, 2), ...S.vy.slice(0, 2), ...S.spin.slice(0, 2)]) === before }; }
    // 步での拒否(零慣性)— 状態不変
    { const S = prep('midpoint', 0.01); S.R[0] = 0;
      const before = JSON.stringify([...S.vx.slice(0, 2), ...S.vy.slice(0, 2), ...S.spin.slice(0, 2), S.relDragHeat]);
      let err = null; try { HP.dfmRelativeDragStep(S, 0.01); } catch (e) { err = (e instanceof RangeError) ? 'RangeError: ' + e.message : String(e); }
      out.engineRejectZeroInertia = { rejected: err !== null, err,
        stateBitSame: JSON.stringify([...S.vx.slice(0, 2), ...S.vy.slice(0, 2), ...S.spin.slice(0, 2), S.relDragHeat]) === before }; }
    // 受理契約
    const base = () => W.make({ id: 'plutoCharonDFM', integrator: 'leapfrog', integration: 'midpoint' });
    const acc = (tag, mut) => { const p = base(); mut(p); const v = HP.validatePreset(p);
      return { tag, ok: v.ok, err: (v.errors || [])[0] || null,
        out: v.ok ? (v.preset.physics.relativeDrag || null) : null }; };
    out.accept = [
      acc('midpoint を受理', () => {}),
      acc('重複対 [[0,1],[1,0]]', (p) => { delete p.physics.relativeDrag.integration; p.physics.relativeDrag.pairs = [[0, 1], [1, 0]]; }),
      acc('不正な integration "rk4"', (p) => { p.physics.relativeDrag.integration = 'rk4'; }),
      acc('零慣性(R=0)で midpoint', (p) => { p.bodies[0].radius = 0; }),
      acc('explicit は正準形に出ない', (p) => { p.physics.relativeDrag.integration = 'explicit'; }),
      acc('midpoint と 2 対', (p) => { p.physics.relativeDrag.pairs = [[0, 1], [0, 2]]; }),
    ];
    return out;
  };
}

// ================================================================ main
const engine = { runs: {}, minimal: null };
if (want('B') || want('C')) {
  await openPage();
  if (want('B')) engine.minimal = await page.evaluate(() => window.__w278b.engineMinimal());
  if (want('C')) {
    for (const cname of CONFIG_LIST) {
      engine.runs[cname] = {};
      for (const sname of STAGE_LIST) {
        const t0 = Date.now();
        const r = await page.evaluate((z) => window.__w278b.run(z.cfg, z.dt, z.orb),
          { cfg: CONFIGS[cname], dt: STAGES[sname].dt, orb: ORBITS });
        r.stage = sname; r.wallMs = Date.now() - t0;
        engine.runs[cname][sname] = r;
        console.log(cname, sname, 'P=', (r.periodsSec || []).map((z) => z.toFixed(6)).join(' / '), 'stop', r.stop, 'ms', r.wallMs, r.err || '');
        // 途中経過も書く(長い走行の喪失防止)
        fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
        fs.writeFileSync(OUT_PATH + '.partial', JSON.stringify({ engine }, null, 1));
      }
    }
  }
  await browser.close();
}

// ================================================================ §D 集計
const tables = {};
if (want('C')) {
  const P2 = (c, s) => { const r = (engine.runs[c] || {})[s]; return (r && r.periodsSec && r.periodsSec.length >= 2) ? r.periodsSec[1] : NaN; };
  tables.grid = {};
  for (const c of CONFIG_LIST) {
    const row = {};
    for (const s of STAGE_LIST) row[s] = P2(c, s);
    const d1 = row.h - row.h2, d2 = row.h2 - row.h4;
    row.halvingDiffH2H4 = d2; row.halvingDiffHH2 = d1; row.ratio = d2 !== 0 ? d1 / d2 : null;
    row.richardson1st = 2 * row.h4 - row.h2;
    row.vsBuieSec = row.h4 - OBS.value; row.vsBuieSigma = (row.h4 - OBS.value) / OBS.sigma;
    row.vsPlu060Sec = row.h4 - ELEM_2024.Charon.periodSec; row.vsPlu060ppm = (row.h4 - ELEM_2024.Charon.periodSec) / ELEM_2024.Charon.periodSec * 1e6;
    row.vsHorizonsPRASec = row.h4 - HORIZONS_PR.epochA.periodSec;
    row.label = CONFIGS[c].label;
    tables.grid[c] = row;
  }
  if (tables.grid.dfmMid && tables.grid.kf0Leap) tables.lawContributionLeap = {
    h: tables.grid.dfmMid.h - tables.grid.kf0Leap.h, h2: tables.grid.dfmMid.h2 - tables.grid.kf0Leap.h2,
    h4: tables.grid.dfmMid.h4 - tables.grid.kf0Leap.h4 };
  // 時間窓(第 2〜第 6 周)
  const win = {};
  for (const c of CONFIG_LIST) {
    const r4 = (engine.runs[c] || {}).h4, r2 = (engine.runs[c] || {}).h2;
    if (!r4) continue;
    const rows = [];
    for (let k = 0; k < r4.periodsSec.length; k++) {
      const rv = r4.revs[k], prv = k ? r4.revs[k - 1] : null;
      rows.push({ rev: k + 1, periodSec: r4.periodsSec[k],
        periodSecH2: r2 && r2.periodsSec[k] !== undefined ? r2.periodsSec[k] : null,
        halvingDiff: (r2 && r2.periodsSec[k] !== undefined) ? r4.periodsSec[k] - r2.periodsSec[k] : null,
        spinP: rv.spin[0], spinC: rv.spin[1], heatCum: rv.heat, heatInRev: rv.heat - (prv ? prv.heat : 0),
        slipAtEnd: rv.slip, slipMaxInRev: rv.slipMaxInRev, pos: rv.pos, e: rv.e, a: rv.a,
        Lrel: rv.Lrel, Prel: rv.Prel, EplusHeatRel: rv.EplusHeatRel });
    }
    win[c] = rows;
  }
  tables.window = win;
  if (win.dfmMid && win.kf0Leap) {
    const n = Math.min(win.dfmMid.length, win.kf0Leap.length);
    const delta = [];
    for (let k = 0; k < n; k++) delta.push({ rev: k + 1, deltaSec: win.dfmMid[k].periodSec - win.kf0Leap[k].periodSec,
      res: Math.max(Math.abs(win.dfmMid[k].halvingDiff || 0), Math.abs(win.kf0Leap[k].halvingDiff || 0)) });
    const checks = [];
    for (let k = 2; k < n; k++) checks.push({ rev: k + 1, change: delta[k].deltaSec - delta[k - 1].deltaSec, res: delta[k].res,
      within: Math.abs(delta[k].deltaSec - delta[k - 1].deltaSec) <= delta[k].res });
    tables.stationary = { rule: STATIONARY_RULE, delta, checks,
      verdict: (checks.length >= 4 && checks.every((z) => z.within)) ? '定常周期と呼べる' : '過渡を含む',
      thirdMinusSecondDfm: (win.dfmMid.length >= 3) ? win.dfmMid[2].periodSec - win.dfmMid[1].periodSec : null,
      thirdMinusSecondKf0: (win.kf0Leap.length >= 3) ? win.kf0Leap[2].periodSec - win.kf0Leap[1].periodSec : null };
  }
}

const meta = withProvenance({
  harness: HARNESS_VERSION, libVersion: MIDPOINT_LIB_VERSION, wave: '第278便b', pilot: PILOT,
  stages: STAGE_LIST, orbits: ORBITS, configs: CONFIG_LIST, stationaryRule: STATIONARY_RULE,
  doNotWrite: ['較正完了', '観測一致', '較正した', 'kF0 版が成立した'],
  observationColumn: '判定保留(量定義不一致)— 同一暦 PLU060 の入力を Buie 2012 の σ で判定しない(比較値のみ)',
  obs: OBS,
}, { root: ROOT, wave: '第278便b', target: TARGET,
  code: ['tests/exp-w278b-charonwin.mjs', 'tests/lib-w278b-midpoint.mjs', 'tests/lib-w277b-charondfm.mjs'],
  inputs: [TARGET] });

const out = { meta, pure, engine, tables, pageErrors };
fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));   // 第281便a: 領域 hash の 3 欄 + JSON 入力の安定 hash
fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1));
try { fs.unlinkSync(OUT_PATH + '.partial'); } catch { /* 無ければよい */ }
console.log('wrote', path.relative(ROOT, OUT_PATH), 'sha256', sha(fs.readFileSync(OUT_PATH)).slice(0, 16));
if (tables.grid) console.log(JSON.stringify(tables.grid, null, 1));
if (tables.stationary) console.log(JSON.stringify(tables.stationary, null, 1));

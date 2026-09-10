// 第253便b W1「A0(非 1PN 基線)の D0pull 掃引 — 2 乗則はどこまで言えるか」(第45報)。
//
// 第252便a は「Δϖ ≈ A0 + λ_PN·A_PN と分けると、2.000 対 2.025 の割れの全部が A0 である」ことと、
// 「A0 は kFrame=1 の引きずりチャネルで、🧶 B1534 では D0pull を ×0.5/×2 すると 0.247 倍/4.00 倍
//  = A0 ∝ D0pull² に見える」ことまでを測った。ただし ⚡🧮🩺 の A0 は**数値床**にあって、同じ 2 乗則を
// 確かめられていない —— そこで第252便a ⑦-4 が決断事項として残したのが「D0pull を系ごとに振って
// A0 の 2 乗則を 4 系で取る」である。本ハーネスはそれを**そのまま実測する器**である。
//
// **測る前に原因と書かない**(第45報 3 審査の一致点): A0 ∝ D0pull²=(1−χ)² と書いてよいのは、
// 4 系が**床の上で**同じ指数を返してからである。本器が出すのは次の 4 欄で、結論は実測に従う。
//   ・A0(検出器 A / B)と A0/A0_ref(宣言値 ×1 に対する比)
//   ・**差分比** R(s) = (A0(2s) − A0(s)) / (A0(s) − A0(s/2))
//     定数床込みの A0(s) = b + c·s² なら床 b が消えて **R = 4** になる(2 乗の**差分応答**の検定)。
//   ・**局所指数** α(s) = d log A0 / d log D0pull ≈ log(A0(2s)/A0(s/2)) / log 4
//     (床が支配的な系では符号が変わって定義できない —— そのときは null を返す)
//   ・χ₁χ₂ と (1−χ₁)(1−χ₂)(その D0pull での実行時 pull 分率。宣言から算出する純関数)
//
// **合成系は作らない**(3 審査 v11 L1(b))。κ/f の再 fit はしない。B1534 だけ背景を変えて観測に
// 合わせることもしない。エンジンの物理はハーネスからは 1 bit も書き換えない(preset の
// `physics` 宣言だけを差し替える)。近点測定は第249便a → 第252便a と**同一手続き**である。
//
// ■ 節
//   SWEEP : 4 系 × λ_PN=0 × framePrecision:"double" × 窓 20 近点 × D0pull ∈ {0.125,0.25,0.5,1,2,4,8}×宣言値。
//           `--sys <id>` で 1 系だけ回して既存 JSON へ差し替えられる(全量を 1 度に回さなくても 1 枚になる)。
//   H     : 同じ掃引を **dt/2** で(既定は 🧮 psrJ1757DFM —— 第252便a で「差分比が 4 に乗る」候補だった系)。
//           刻みを半分にしても差分比が動かないことを確かめる(= 差分応答が離散化の産物でないことの検定)。
//   CTRL  : **kFrame=0 の否定対照**(λ_PN=0・同じ D0pull)。A0 が床へ落ちることの機械確認。
//   FPDRY : ⚡ psrDoubleABDFM に framePrecision:"double" を宣言した**一時コピー**での乾走(プリセットは変えない)。
//           obsCard の数値・claims の窓・QA behavior.psrDoubleAB の条件がどう動くかを並べる。
//
// 実行: node tests/exp-w253b-a0sweep.mjs [--sweep] [--h] [--ctrl] [--fpdry] [--sys <id>] [--dt 0.004] [--np 20] [--fast]
// 出力: tests/out/a0sweep-w253.json(.gitignore の既定どおり**未コミット** —— 数値は docs/PHYSICS.md へ全載する)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'a0sweep-w253.json');
const argv = process.argv.slice(2);
const FAST = argv.includes('--fast');
const numArg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? Number(argv[i + 1]) : d; };
const strArg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const DT = numArg('--dt', 0.004);
const NPERI = FAST ? 6 : numArg('--np', 20);
const SECTS = argv.filter((a) => a.startsWith('--') && ['--sweep', '--h', '--ctrl', '--fpdry'].includes(a)).map((a) => a.slice(2));
const want = (k) => !SECTS.length || SECTS.includes(k);
const ONLY_SYS = strArg('--sys', null);

const IDS = ['psrDoubleABDFM', 'psrJ1757DFM', 'psrJ1946DFM', 'psrB1534DFM'];
// 掃引倍率(宣言値 D0pull に掛ける)。0.125 と 8 まで伸ばして「床の上に出る帯」を探す。
const SCALES = FAST ? [0.5, 1, 2] : [0.125, 0.25, 0.5, 1, 2, 4, 8];

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

// ---------------------------------------------------------------- ページ側の測定ライブラリ
// 第252便a `tests/exp-w252a-boxbinary.mjs` の §ID と**同一手続き**(近点検出器 A/B・柵・直線 fit)。
await pg.evaluate(() => {
  const W = (window.__w253 = {});
  W.YR = 365.25 * 86400;
  W.SYS = {
    psrDoubleABDFM: { label: '⚡ J0737−3039A/B (DFM)', PobsS: 8834.534723278, omegaDot: 16.899323, eObs: 0.087777036, Tunit: 10 },
    psrJ1757DFM: { label: '🧮 J1757−1854 (DFM)', PobsS: 15857.669019168, omegaDot: 10.3651, eObs: 0.6058142, Tunit: 10 },
    psrJ1946DFM: { label: '🩺 J1946+2052 (DFM)', PobsS: 6781.366656, omegaDot: 25.79205, eObs: 0.063848, Tunit: 10 },
    psrB1534DFM: { label: '🧶 B1534+12 (DFM)', PobsS: 36351.7026, omegaDot: 1.755789, eObs: 0.2736775, Tunit: 10 },
  };
  W.peri = (S, dt, tEnd, pRef, NP) => {
    const steps = Math.round(tEnd / dt);
    const A = [], Bd = [];
    let r2 = 0, r1 = 0, t2 = 0, t1 = 0, rd1 = 0, rMin = Infinity, rMax = -Infinity;
    let thPrev = null;
    const mAll = []; for (let i = 0; i < S.n; i++) mAll.push(S.m[i]);
    const Msum = mAll.reduce((a, b) => a + b, 0);
    const cmOf = () => { let cx = 0, cy = 0; for (let i = 0; i < S.n; i++) { cx += mAll[i] * S.x[i]; cy += mAll[i] * S.y[i]; } return [cx / Msum, cy / Msum]; };
    const cm0 = cmOf();
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
      thPrev = th;
    }
    const cmEnd = cmOf();
    const fit = (raw) => {
      const mid = 0.5 * (rMin + rMax);
      const peri = raw.filter((p) => p.r < mid);
      const rej = { apo: raw.length - peri.length, dup: 0, jump: 0 };
      const keep = [];
      for (const p of peri) {
        if (keep.length && (p.k - keep[keep.length - 1].k) * dt < 0.5 * pRef) { rej.dup++; continue; }
        keep.push(p);
      }
      const use = keep.slice(0, NP), ang = [];
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
      const perMean = per.length ? per.reduce((a, b) => a + b, 0) / per.length : null;
      return { nPeri: n, rej, slopeDeg: slope === null ? null : slope * 180 / Math.PI,
        residDeg: resid === null ? null : resid * 180 / Math.PI, perMean };
    };
    return { rMin, rMax, eProxy: (rMax - rMin) / (rMax + rMin), A: fit(A), B: fit(Bd),
      cmWalk: Math.hypot(cmEnd[0] - cm0[0], cmEnd[1] - cm0[1]),
      nan: S.hasNaN(), clamp: S.clampVN + S.clampSN + S.clampRN + S.clampTN + S.clampAN };
  };
  // 実行時 χ(pull 重み・n=2 の厳密形。エンジン S._compactForce と同じ式)
  W.chiAt = (m1, m2, d, D0p, eps, pw) => {
    const d2 = d * d + eps * eps, wg = (pw > 0) ? Math.pow(d2, -pw / 2) : 1 / Math.sqrt(d2);
    const w12 = m2 * wg, w21 = m1 * wg;
    return { chi1: (D0p + w12 > 0) ? w12 / (D0p + w12) : 0, chi2: (D0p + w21 > 0) ? w21 / (D0p + w21) : 0 };
  };
  W.meta = (id) => {
    const p = HP.allPresets().find((q) => q.id === id);
    const b = p.bodies, m1 = b[0].m, m2 = b[1].m, M = m1 + m2;
    const ph = p.physics;
    const pw = (ph.frameWeight === undefined) ? 2 : (ph.frameWeight === 'pull') ? 2 : (ph.frameWeight === 'pull3') ? 3 : (ph.frameWeight === 'pull4') ? 4 : 0;
    const D0p = (ph.D0pull !== undefined) ? ph.D0pull : ph.D0;
    const s = W.SYS[id];
    const e = s ? s.eObs : 0;
    const sep0 = Math.hypot(b[1].x - b[0].x, b[1].y - b[0].y);
    const a = sep0 / (1 + e);
    return { id, emoji: p.emoji, label: s ? s.label : p.name, m1, m2, M, q: m2 / m1,
      nu: m1 * m2 / (M * M), dmOverM: Math.abs(m1 - m2) / M, e, a, sep0, rPeri: a * (1 - e),
      pw, D0pDecl: D0p, softening: ph.softening, kFrame: ph.kFrame, lambdaPN: ph.lambdaPN,
      cLight: ph.cLight, G: ph.G,
      obsDeg: s ? s.omegaDot * s.PobsS / W.YR : null };
  };
  // 1 行を測る(physics の宣言だけを差し替える。bodies・massCalibration は 1 bit 触らない)
  W.run = (id, patch, dt, NP) => {
    const src = HP.allPresets().find((q) => q.id === id);
    const pd = JSON.parse(JSON.stringify(src));
    if (patch) for (const k of Object.keys(patch)) {
      if (patch[k] === '__delete') delete pd.physics[k]; else pd.physics[k] = patch[k];
    }
    delete pd.massCalibration;   // 台帳の三者一致検査を実験へ持ち込まない
    const s = W.SYS[id];
    const Pu = s ? s.PobsS / s.Tunit : null;
    const v = HP.validatePreset(pd); const S = HP.sim; S.build(v.preset);
    const o = W.peri(S, dt, (NP + 0.6) * (Pu || 1), Pu || 1, NP);
    o.D0pullUsed = v.preset.physics.D0pull;
    o.kFrame = v.preset.physics.kFrame;
    o.lambdaPN = v.preset.physics.lambdaPN;
    o.framePrecision = v.preset.physics.framePrecision || null;
    return o;
  };
});

const exp4 = (z) => (z === null || z === undefined || !Number.isFinite(z)) ? '—' : z.toExponential(4);
const fx = (z, d = 6) => (z === null || z === undefined || !Number.isFinite(z)) ? '—' : z.toFixed(d);

// ---------------------------------------------------------------- 既存 JSON の読み込み(差し替え併合)
let store = { rows: [] };
if (fs.existsSync(OUT)) {
  try { store = JSON.parse(fs.readFileSync(OUT, 'utf8')); if (!Array.isArray(store.rows)) store.rows = []; }
  catch { store = { rows: [] }; }
}
const keyOf = (r) => `${r.id}|${r.dt}|${r.kFrame}|${r.scale}`;
const putRow = (r) => {
  const k = keyOf(r);
  const i = store.rows.findIndex((z) => keyOf(z) === k);
  if (i >= 0) store.rows[i] = r; else store.rows.push(r);
};

const metaCache = {};
const metaOf = async (id) => (metaCache[id] || (metaCache[id] = await pg.evaluate((z) => window.__w253.meta(z), id)));

// 1 行の測定(λ_PN=0・framePrecision:"double"・D0pull=宣言値×scale)
async function measure(id, scale, dt, np, kFrame) {
  const meta = await metaOf(id);
  const D0 = meta.D0pDecl * scale;
  const patch = { lambdaPN: 0, framePrecision: 'double', D0pull: D0 };
  if (kFrame !== undefined && kFrame !== null) patch.kFrame = kFrame;
  const t0 = Date.now();
  const o = await pg.evaluate(([id, patch, dt, np]) => window.__w253.run(id, patch, dt, np), [id, patch, dt, np]);
  const chiApo = await pg.evaluate(([m1, m2, d, D0p, eps, pw]) => window.__w253.chiAt(m1, m2, d, D0p, eps, pw),
    [meta.m1, meta.m2, meta.sep0, D0, meta.softening, meta.pw]);
  const chiPer = await pg.evaluate(([m1, m2, d, D0p, eps, pw]) => window.__w253.chiAt(m1, m2, d, D0p, eps, pw),
    [meta.m1, meta.m2, meta.rPeri, D0, meta.softening, meta.pw]);
  const row = { id, emoji: meta.emoji, label: meta.label, dt, np, scale,
    kFrame: (kFrame === undefined || kFrame === null) ? meta.kFrame : kFrame,
    D0pDecl: meta.D0pDecl, D0pull: D0,
    A0_A: o.A.slopeDeg, A0_B: o.B.slopeDeg,
    residA: o.A.residDeg, nPeriA: o.A.nPeri, nPeriB: o.B.nPeri,
    perMeanA: o.A.perMean, eProxy: o.eProxy, cmWalk: o.cmWalk,
    obsDeg: meta.obsDeg,
    chiProdApo: chiApo.chi1 * chiApo.chi2, chiProdPeri: chiPer.chi1 * chiPer.chi2,
    oneMinusChiProdApo: (1 - chiApo.chi1) * (1 - chiApo.chi2),
    oneMinusChiProdPeri: (1 - chiPer.chi1) * (1 - chiPer.chi2),
    chiApo: [chiApo.chi1, chiApo.chi2], chiPeri: [chiPer.chi1, chiPer.chi2],
    nan: o.nan, clamp: o.clamp, framePrecision: o.framePrecision, lambdaPN: o.lambdaPN,
    secs: (Date.now() - t0) / 1000 };
  putRow(row);
  console.error(`  ${meta.emoji} ${id} dt=${dt} kF=${row.kFrame} ×${scale}: `
    + `A0(A)=${exp4(row.A0_A)} A0(B)=${exp4(row.A0_B)} 近点 ${row.nPeriA} 個 `
    + `χ₁χ₂(遠点)=${fx(row.chiProdApo, 8)} (1−χ₁)(1−χ₂)=${exp4(row.oneMinusChiProdApo)} ${row.secs.toFixed(1)}s`);
  return row;
}

// ---------------------------------------------------------------- SWEEP / H / CTRL
const sysList = ONLY_SYS ? ONLY_SYS.split(',') : IDS;

if (want('sweep')) {
  console.error(`[w253b] SWEEP: dt=${DT}・窓 ${NPERI} 近点・λ_PN=0・framePrecision="double"・系 ${sysList.join(' ')}`);
  for (const id of sysList) for (const s of SCALES) await measure(id, s, DT, NPERI, null);
}

if (want('h')) {
  const hSys = ONLY_SYS ? ONLY_SYS.split(',') : ['psrJ1757DFM'];
  console.error(`[w253b] H: dt=${DT / 2}(h/2)の同じ掃引・系 ${hSys.join(' ')}`);
  for (const id of hSys) for (const s of SCALES) await measure(id, s, DT / 2, NPERI, null);
}

if (want('ctrl')) {
  console.error('[w253b] CTRL: kFrame=0 の否定対照(λ_PN=0・宣言値の D0pull)');
  for (const id of sysList) await measure(id, 1, DT, NPERI, 0);
}


// ---------------------------------------------------------------- FPDRY: ⚡ の framePrecision:"double" 乾走
// 3 審査 v11 L5(d) は「⚡ 本体への `framePrecision:"double"` 宣言は推奨・ただしカード/claims/同窓較正と
// 一括で裁定後」とした。本節は**乾走(dry run)だけ**である —— **プリセットは 1 bit も変えない**。
// 宣言した一時コピーを作って、obsCard に載っている数値・claims の窓・QA `behavior.psrDoubleAB` の
// 判定条件が**どう動くか**を実測して並べる(採否は統括の決断事項)。
// 測定の手続きは QA `behavior.psrDoubleAB` の ⚡ DFM 版ブロックと**同じ**(dt=0.016・4.3 公転・
// 周回時間は相対角 2π 交差・近点移動は近点通過方向の直線 fit・帳簿は totals()+リザーバ)。
if (want('fpdry')) {
  console.error('[w253b] FPDRY: ⚡ psrDoubleABDFM の framePrecision native 対 "double"(dt=0.016・4.3 公転)');
  const dry = await pg.evaluate(() => {
    const P_OBS = 883.4534723278;          // 観測周期(単位時間)= 8834.534723278 s / 10
    const run = (fp) => {
      const pd = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === 'psrDoubleABDFM')));
      if (fp) pd.physics.framePrecision = fp;
      const vd = HP.validatePreset(pd); const S = HP.sim; S.build(vd.preset);
      const clamp0 = S.clampSN || 0;
      const T0 = S.totals(); const L0 = T0.L + S.resL + S.radL;
      const mt = S.m[0] + S.m[1];
      const com = () => ({ x: (S.m[0] * S.x[0] + S.m[1] * S.x[1]) / mt, y: (S.m[0] * S.y[0] + S.m[1] * S.y[1]) / mt });
      const c0 = com(); const ep0x = T0.px + S.resPx, ep0y = T0.py + S.resPy;
      const pScale = S.m[0] * Math.hypot(S.vx[0], S.vy[0]) + S.m[1] * Math.hypot(S.vx[1], S.vy[1]);
      const OM_B = 22.654675;   // 宣言値(coreOmV は初回 step 前 0 なので QA と同じく宣言値を基準に取る)
      let comMax = 0, sMax = 0, omBmax = -Infinity;
      const dt = 0.016, steps = Math.round(4.3 * P_OBS / dt);
      let ang = 0, px = 0, py = 0, rmin = Infinity, rmax = -Infinity;
      const revs = []; let nextRev = 2 * Math.PI, e1 = null, rmin1 = null;
      let prevR = null, prev2R = null, prevAng = null, prevT = null; const periAngs = [];
      for (let k = 0; k < steps; k++) {
        S.step(dt);
        const dx = S.x[1] - S.x[0], dy = S.y[1] - S.y[0], rr = Math.hypot(dx, dy);
        if (prevR !== null && prev2R !== null && prevR < prev2R && prevR < rr) periAngs.push([prevT, prevAng]);
        prev2R = prevR; prevR = rr; prevAng = Math.atan2(dy, dx); prevT = (k + 1) * dt;
        if (rr < rmin) rmin = rr; if (rr > rmax) rmax = rr;
        const sm = Math.max(Math.abs(S.spin[0]), Math.abs(S.spin[1])); if (sm > sMax) sMax = sm;
        if (S.coreOmV && S.coreOmV[1] > omBmax) omBmax = S.coreOmV[1];
        const cc = com(); const cd = Math.hypot(cc.x - c0.x, cc.y - c0.y); if (cd > comMax) comMax = cd;
        if (k === 0) { px = dx; py = dy; } else {
          ang += Math.atan2(px * dy - py * dx, px * dx + py * dy); px = dx; py = dy;
          while (Math.abs(ang) >= nextRev) { revs.push((k + 1) * dt); nextRev += 2 * Math.PI;
            if (e1 === null) { e1 = (rmax - rmin) / (rmax + rmin); rmin1 = rmin; } } }
      }
      const p2 = revs.length >= 2 ? revs[1] - revs[0] : null;
      const p3 = revs.length >= 3 ? revs[2] - revs[1] : null;
      const p4 = revs.length >= 4 ? revs[3] - revs[2] : null;
      const decPct = (p2 !== null && p3 !== null) ? (1 - p3 / p2) * 100 : null;
      const decPct2 = (p3 !== null && p4 !== null) ? (1 - p4 / p3) * 100 : null;
      let dPeri = null;
      if (periAngs.length >= 3) {
        let acc = 0, prev = null; const unw = [];
        for (const [t2, aa] of periAngs) { if (prev !== null) { let dd = aa - prev;
          while (dd > Math.PI) dd -= 2 * Math.PI; while (dd < -Math.PI) dd += 2 * Math.PI; acc += dd; } prev = aa; unw.push([t2, acc]); }
        let sx = 0, sy = 0, sxx = 0, sxy = 0; const n2 = unw.length;
        for (const [t2, u] of unw) { sx += t2; sy += u; sxx += t2 * t2; sxy += t2 * u; }
        dPeri = (n2 * sxy - sx * sy) / (n2 * sxx - sx * sx) * 180 / Math.PI * P_OBS;
      }
      // 近点間周期(obsCard の「近点間 8712.96 秒」と同じ量 — 近点通過時刻の平均間隔)
      const perT = []; for (let i = 1; i < periAngs.length; i++) perT.push(periAngs[i][0] - periAngs[i - 1][0]);
      const periMean = perT.length ? perT.reduce((a, b) => a + b, 0) / perT.length : null;
      const T1 = S.totals(); const L1 = T1.L + S.resL + S.radL;
      return {
        fp: vd.preset.physics.framePrecision || 'native(未宣言)',
        rev1Sec: revs.length >= 1 ? revs[0] * 10 : null,
        rev2Sec: p2 === null ? null : p2 * 10,
        rev3Sec: p3 === null ? null : p3 * 10,
        rev4Sec: p4 === null ? null : p4 * 10,
        periMeanSec: periMean === null ? null : periMean * 10, nPeri: periAngs.length,
        e1, rmin1, dPeri, decPct, decPct2, comMax, sMax,
        clampD: (S.clampSN || 0) - clamp0,
        lRel: Math.abs(L1 - L0) / Math.max(Math.abs(L0), 1e-9),
        pRel: Math.hypot(T1.px + S.resPx - ep0x, T1.py + S.resPy - ep0y) / Math.max(pScale, 1e-9),
        omDriftB: (omBmax / OM_B - 1) * 100,
        nan: S.hasNaN(), P_OBS,
      };
    };
    const a = run(null), b = run('double');
    // claims の窓(⚡ の claims 宣言そのもの)と QA `behavior.psrDoubleAB` の窓を、両方の実測へ当てる
    const judge = (r) => ({
      // claims
      'claims:period-fit(2周目 秒 ∈ [8790,8880])': r.rev2Sec !== null && r.rev2Sec >= 8790 && r.rev2Sec <= 8880,
      'claims:shape-unfitted(e ∈ [0.085,0.0905])': r.e1 !== null && r.e1 >= 0.085 && r.e1 <= 0.0905,
      'claims:periastron-advance(Δϖ ∈ [0.005,0.02])': r.dPeri !== null && r.dPeri >= 0.005 && r.dPeri <= 0.02,
      'claims:shell-spin-held(ドリフト ∈ [0,0.001]%)': r.sMax === 0,
      'claims:period-decay(ΔP/P ∈ [0.05,0.2]%)': r.decPct !== null && r.decPct >= 0.05 && r.decPct <= 0.2,
      'claims:core-spin-transcribed(Ω ドリフト ∈ [0,2]%)': r.omDriftB >= 0 && r.omDriftB <= 2,
      // QA behavior.psrDoubleAB の DFM 版の条件
      'QA:p2/P_obs−1 <1.2%': r.rev2Sec !== null && Math.abs(r.rev2Sec / (r.P_OBS * 10) - 1) < 0.012,
      'QA:|e−0.087977| <0.002': r.e1 !== null && Math.abs(r.e1 - 0.087977) < 0.002,
      'QA:|rmin/801.37−1| <1%': r.rmin1 !== null && Math.abs(r.rmin1 / 801.37 - 1) < 0.01,
      'QA:Δϖ ∈ [0.005,0.02]': r.dPeri !== null && r.dPeri >= 0.005 && r.dPeri <= 0.02,
      'QA:殻 spin 0・clampSN 0': r.sMax === 0 && r.clampD === 0,
      'QA:ΔP/P ∈ [0.05,0.2] かつ 次周も同窓': r.decPct >= 0.05 && r.decPct <= 0.2 && r.decPct2 >= 0.05 && r.decPct2 <= 0.2,
      'QA:帳簿 L<1e−8・P<1e−8・重心<0.01': r.lRel < 1e-8 && r.pRel < 1e-8 && r.comMax < 0.01,
      'QA:B コア Ω ドリフト ∈ [0,2]%': r.omDriftB >= 0 && r.omDriftB <= 2,
    });
    return { native: a, double: b, judgeNative: judge(a), judgeDouble: judge(b) };
  });
  store.fpDry = dry;
  const keys = Object.keys(dry.judgeNative);
  console.error('  量 | native | double | 変化率');
  const rows = [['1周目 [s]', 'rev1Sec'], ['2周目 P [s]', 'rev2Sec'], ['3周目 P [s]', 'rev3Sec'],
    ['近点間 P 平均 [s]', 'periMeanSec'], ['e(1周目窓)', 'e1'], ['近点 r_min', 'rmin1'],
    ['近点 個数', 'nPeri'], ['近点移動 [°/周]', 'dPeri'], ['ΔP/P [%/公転]', 'decPct'], ['次周 ΔP/P [%]', 'decPct2'],
    ['重心 max', 'comMax'], ['帳簿 L 残差', 'lRel'], ['帳簿 P 残差', 'pRel'], ['B コア Ω ドリフト [%]', 'omDriftB']];
  for (const [lab, k] of rows) {
    const a = dry.native[k], b = dry.double[k];
    const rel = (Number.isFinite(a) && Number.isFinite(b) && a !== 0) ? ((b / a - 1) * 100).toFixed(4) + '%' : '—';
    console.error(`  ${lab} | ${a} | ${b} | ${rel}`);
  }
  for (const k of keys) console.error(`  窓 ${k}: native=${dry.judgeNative[k]} → double=${dry.judgeDouble[k]}`);
}

// ---------------------------------------------------------------- 派生表(差分比・局所指数)
// 定数床込みの A0(s) = b + c·s² なら、床 b が差分で消えて
//     R(s) = (A0(2s) − A0(s)) / (A0(s) − A0(s/2)) = 4
// になる。局所指数 α(s) = log(A0(2s)/A0(s/2)) / log 4 は**床が支配的だと符号が変わって定義できない**。
function derive(rows) {
  const groups = {};
  for (const r of rows) {
    const g = `${r.id}|${r.dt}|${r.kFrame}`;
    (groups[g] || (groups[g] = [])).push(r);
  }
  const out = [];
  for (const g of Object.keys(groups)) {
    const rs = groups[g].slice().sort((a, b) => a.scale - b.scale);
    const bySc = new Map(rs.map((r) => [r.scale, r]));
    const ref = bySc.get(1) || null;
    for (const r of rs) {
      const half = bySc.get(r.scale / 2), dbl = bySc.get(r.scale * 2);
      const mk = (pick) => {
        const y0 = half ? half[pick] : null, y1 = r[pick], y2 = dbl ? dbl[pick] : null;
        const den = (y0 !== null && y1 !== null) ? (y1 - y0) : null;
        const num = (y1 !== null && y2 !== null) ? (y2 - y1) : null;
        const ratio = (num !== null && den !== null && den !== 0) ? num / den : null;
        const alpha = (y0 !== null && y2 !== null && y0 !== 0 && y2 / y0 > 0)
          ? Math.log(y2 / y0) / Math.log(4) : null;
        return { diffRatio: ratio, alpha };
      };
      const A = mk('A0_A'), B = mk('A0_B');
      out.push({ id: r.id, emoji: r.emoji, dt: r.dt, kFrame: r.kFrame, scale: r.scale,
        D0pull: r.D0pull, A0_A: r.A0_A, A0_B: r.A0_B,
        A0relA: (ref && ref.A0_A) ? r.A0_A / ref.A0_A : null,
        A0relB: (ref && ref.A0_B) ? r.A0_B / ref.A0_B : null,
        A0overObsPctA: (r.obsDeg && r.A0_A !== null) ? 100 * r.A0_A / r.obsDeg : null,
        diffRatioA: A.diffRatio, diffRatioB: B.diffRatio, alphaA: A.alpha, alphaB: B.alpha,
        chiProdApo: r.chiProdApo, oneMinusChiProdApo: r.oneMinusChiProdApo,
        detDiff: (r.A0_A !== null && r.A0_B !== null) ? Math.abs(r.A0_A - r.A0_B) : null,
        nPeriA: r.nPeriA, nan: r.nan, clamp: r.clamp });
    }
  }
  return out;
}

store.target = TARGET;
store.node = process.version;
store.at = new Date().toISOString();
store.wave = '253b';
store.window = { nPeri: NPERI, dtBase: DT, lambdaPN: 0, framePrecision: 'double',
  note: '全行 λ_PN=0(非 1PN 基線 A0)・framePrecision:"double" で数値床を平準化・近点 20 個の固定窓。'
    + '合成系は作っていない・κ/f の再 fit はしていない・プリセットの bodies/massCalibration は 1 bit 触っていない。' };
store.scales = SCALES;
store.derived = derive(store.rows);
store.pageErrors = pageErrors;
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(store, null, 1));
console.error(`[w253b] wrote ${OUT}(${store.rows.length} 行)`);

// ---- 読める表を stderr へ(PHYSICS へ転記する形)
const dtSet = [...new Set(store.derived.map((d) => d.dt))].sort((a, b) => b - a);
for (const dt of dtSet) {
  for (const kf of [1, 0]) {
    const rs = store.derived.filter((d) => d.dt === dt && d.kFrame === kf);
    if (!rs.length) continue;
    console.error(`\n=== dt=${dt}・kFrame=${kf}(λ_PN=0・framePrecision="double"・窓 ${NPERI} 近点)`);
    console.error('  系 / ×倍率 : A0(A) [°/周] / A0(B) / A0/A0(×1) / 差分比 R / 局所指数 α / (1−χ₁)(1−χ₂)(遠点)');
    for (const id of IDS) {
      const g = rs.filter((d) => d.id === id).sort((a, b) => a.scale - b.scale);
      if (!g.length) continue;
      for (const d of g) {
        console.error(`  ${d.emoji} ×${String(d.scale).padStart(5)} : ${exp4(d.A0_A).padStart(11)} / ${exp4(d.A0_B).padStart(11)}`
          + ` / ${fx(d.A0relA, 6).padStart(12)} / ${fx(d.diffRatioA, 5).padStart(10)} / ${fx(d.alphaA, 5).padStart(9)}`
          + ` / ${exp4(d.oneMinusChiProdApo)}`);
      }
    }
  }
}
if (pageErrors.length) console.error('[w253b] pageErrors: ' + pageErrors.slice(0, 3).join(' | '));
await browser.close();

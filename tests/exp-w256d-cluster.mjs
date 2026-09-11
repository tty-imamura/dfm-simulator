// 第256便d(第48報): 「**星団 C0/C1/Cn の器** —— 『中心に BH を置けば安定する』を先に否定する」。
//
// 原仮定者(第48報): 「星団は、中心部に複数のブラックホールを配置して安定させる」。
// 3 審査 v14(Grok/ChatGPT)は**対照を先に作れ**と言った: Mackey ら(2007/2008)の N 体では
// **BH を保持した星団は長期にコアが膨張する**(=「置けば安定」の逆)。だから本便は
// プリセットを 1 本も増やさず、**器だけ**を作って 3 群を同じ物差しで測る:
//   C0 … BH なし。中心にあるのは**滑らかな中心成分**(軽い粒 n_c 個の小さな Plummer)。
//   C1 … 中心に **1 個の重い粒**(中心総質量 M_c を 1 粒に集める)。
//   Cn … **同じ中心総質量**を n 個(既定 4)の有限半径の部分系へ分ける。
// **3 群は全質量 M・(2D)半質量半径 r_h・全角運動量 L を機械で揃えてから走らせる**
// (揃えないと「BH のおかげ」と「配置のおかげ」が混ざる)。中心固定(pinned)は**使わない**
// —— pinned は外部支持であって、自律的な安定ではない(使う展示は必ずそう書くこと)。
//
// 測るもの(全部を seed ごとに出す): 半質量半径の時系列(**長期のコア膨張**)・束縛率・中心密度・
// 中心成分の生き残り(BH 保持)・接近遭遇の回数(融合の代理)・エネルギー/角運動量の帳簿・
// 安全クランプ 0・NaN 0。**「安定した」は seed 1 つでは書かない**(3 seed の全部で言えることだけ書く)。
//
// **エンジンの物理は 1 bit も書き換えない**。内蔵 🍇(tuc47)の physics 宣言をそのまま流用し、
// bodies だけを本器が組む(診断コピー — プリセットは増やさない)。
//
// 実行: node tests/exp-w256d-cluster.mjs [--fast] [--seeds 3] [--cross 50] [--kf1]
// 出力: tests/out/cluster-w256.json(数値は docs/PHYSICS.md〔第256便d〕へ全載)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'cluster-w256.json');
const argv = process.argv.slice(2);
const FAST = argv.includes('--fast');
const KF1 = argv.includes('--kf1');
const numArg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? Number(argv[i + 1]) : d; };
const NSEED = FAST ? 1 : numArg('--seeds', 3);
const CROSS = FAST ? 6 : numArg('--cross', 50);

// ---------------------------------------------------------------- 配置(node 側で決定論的に作る)
const DT = 0.016;
const NFIELD = 200;          // 場の星の数
const MTOT = 17.7;           // 🍇 と同じ全質量(8.90×10⁵ M☉)
const FC = 0.06;             // 中心成分の質量比(M_c = FC·M — 「複数 BH」を置ける重さ)
const APLUM = 12.34;         // 🍇 と同じ Plummer スケール
const RCUT = 120;            // 生成の外縁(🍇 の 419 は潮汐半径 — 本器は分布の裾を切る)
const NC0 = 20;              // C0 の「滑らかな中心成分」の粒数
const AC0 = 2.5;             // C0 の中心成分の Plummer スケール
const NBH = 4;               // Cn の BH 個数(n=3〜5 の代表値)
const RSUB = 2.5;            // Cn の部分系の半径(C0 の中心成分と同じ広がり — 「有限半径」を揃える)
const LFRAC = 0.10;          // 全角運動量 L の目標(= LFRAC·M·r_h·v_rms — 3 群で同じ)

function lcg(seed) { let s = (seed >>> 0) || 1; return () => { s = (1664525 * s + 1013904223) >>> 0; return s / 4294967296; }; }

// 2D Plummer 面密度 Σ(R) ∝ (1+R²/a²)^−2 の逆関数サンプリング(中央値=a)
function plummer2D(rnd, a, rcut) {
  for (let i = 0; i < 200; i++) {
    const u = rnd();
    const R = a * Math.sqrt(u / (1 - u));
    if (R <= rcut) return R;
  }
  return rcut;
}

function potentialAndL(b, G, eps2) {
  let W = 0, M = 0, L = 0, cx = 0, cy = 0, px = 0, py = 0;
  for (let i = 0; i < b.length; i++) { M += b[i].m; cx += b[i].m * b[i].x; cy += b[i].m * b[i].y; px += b[i].m * b[i].vx; py += b[i].m * b[i].vy; }
  cx /= M; cy /= M;
  for (let i = 0; i < b.length; i++) L += b[i].m * ((b[i].x - cx) * b[i].vy - (b[i].y - cy) * b[i].vx);
  for (let i = 0; i < b.length; i++) for (let j = i + 1; j < b.length; j++) {
    const dx = b[j].x - b[i].x, dy = b[j].y - b[i].y;
    W -= G * b[i].m * b[j].m / Math.sqrt(dx * dx + dy * dy + eps2);
  }
  return { W, M, L, cx, cy, px, py };
}

function halfMassRadius(b) {
  let M = 0, cx = 0, cy = 0;
  for (const p of b) { M += p.m; cx += p.m * p.x; cy += p.m * p.y; }
  cx /= M; cy /= M;
  const s = b.map((p) => ({ r: Math.hypot(p.x - cx, p.y - cy), m: p.m })).sort((u, v) => u.r - v.r);
  let acc = 0;
  for (const q of s) { acc += q.m; if (acc >= 0.5 * M) return q.r; }
  return s.length ? s[s.length - 1].r : 0;
}

// ---------------------------------------------------------------- 3 群の生成(同じ seed = 同じ場の星)
function makeGroup(kind, seed) {
  const rnd = lcg(seed);
  const Mc = FC * MTOT, Mf = MTOT - Mc, mf = Mf / NFIELD;
  const b = [];
  // 場の星(3 群でビット同一 — 乱数の消費順を揃えるため最初に引く)
  for (let i = 0; i < NFIELD; i++) {
    const R = plummer2D(rnd, APLUM, RCUT), th = 2 * Math.PI * rnd();
    b.push({ m: mf, x: R * Math.cos(th), y: R * Math.sin(th), vx: 0, vy: 0, tag: 'field' });
  }
  // 中心成分
  if (kind === 'C0') {
    const rc = lcg(seed ^ 0x5bf03635);
    for (let i = 0; i < NC0; i++) {
      const R = plummer2D(rc, AC0, 6 * AC0), th = 2 * Math.PI * rc();
      b.push({ m: Mc / NC0, x: R * Math.cos(th), y: R * Math.sin(th), vx: 0, vy: 0, tag: 'core' });
    }
  } else if (kind === 'C1') {
    b.push({ m: Mc, x: 0, y: 0, vx: 0, vy: 0, tag: 'bh' });
  } else {   // Cn: 同じ中心総質量を n 個へ(有限半径 RSUB の正多角形 — 回転する部分系)
    for (let i = 0; i < NBH; i++) {
      const th = 2 * Math.PI * i / NBH;
      b.push({ m: Mc / NBH, x: RSUB * Math.cos(th), y: RSUB * Math.sin(th), vx: 0, vy: 0, tag: 'bh' });
    }
  }
  return b;
}

// 速度: 等方・全粒同じ速さ √(−W/M)(ビリアル 2K=−W を機械で満たす — 🫐 の vMode:"virial" と同流儀)
function setVirialVelocities(b, seed, G, eps2) {
  const rv = lcg(seed ^ 0x1a2b3c4d);
  const { W, M } = potentialAndL(b, G, eps2);
  const v = Math.sqrt(Math.max(0, -W / M));
  for (const p of b) { const th = 2 * Math.PI * rv(); p.vx = v * Math.cos(th); p.vy = v * Math.sin(th); }
  return { W, M, vRms: v };
}

// M・r_h・L を 3 群で揃える(位置を一様スケール → 速度を 1/√s → 剛体回転で L を合わせる)
function normalize(b, rhTarget, lTarget, G, eps2) {
  const before = { rh: halfMassRadius(b) };
  const s = rhTarget / before.rh;
  for (const p of b) { p.x *= s; p.y *= s; p.vx /= Math.sqrt(s); p.vy /= Math.sqrt(s); }
  // 重心を機械ゼロに
  const a1 = potentialAndL(b, G, eps2);
  for (const p of b) { p.x -= a1.cx; p.y -= a1.cy; p.vx -= a1.px / a1.M; p.vy -= a1.py / a1.M; }
  const a2 = potentialAndL(b, G, eps2);
  let I = 0; for (const p of b) I += p.m * (p.x * p.x + p.y * p.y);
  const om = (lTarget - a2.L) / I;
  for (const p of b) { const vx = p.vx - om * p.y, vy = p.vy + om * p.x; p.vx = vx; p.vy = vy; }
  const a3 = potentialAndL(b, G, eps2);
  return { scale: s, omegaAdded: om, rh: halfMassRadius(b), L: a3.L, M: a3.M, W: a3.W,
    rhBefore: before.rh, virial: -2 * (b.reduce((q, p) => q + 0.5 * p.m * (p.vx * p.vx + p.vy * p.vy), 0)) / a3.W };
}

// ================================================================ ブラウザ
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

const base = await pg.evaluate(() => {
  const p = HP.allPresets().find((q) => q.id === 'tuc47');
  return { physics: JSON.parse(JSON.stringify(p.physics)), camera: p.camera, world: p.world };
});
const G = base.physics.G, EPS2 = base.physics.softening * base.physics.softening;

await pg.evaluate(() => {
  const W = (window.__w256c = {});
  W.run = (bodies, physics, steps, dt, nSample, coreIdx, rh0) => {
    const pd = { id: 'w256dCluster', name: 'w256d cluster diag', emoji: '🧪', group: '診断',
      description: '第256便d の星団対照(診断コピー — プリセットではない)',
      camera: { scale: 60 }, world: { boundary: 'none', size: 0 }, physics,
      bodies: bodies.map((b) => ({ type: 'single', m: b.m, x: b.x, y: b.y, vx: b.vx, vy: b.vy, spin: 0, pinned: false })) };
    const v = HP.validatePreset(pd);
    if (!v || !v.preset) return { buildFailed: true, errors: (v && v.errors) ? v.errors.slice(0, 4) : ['validatePreset が preset を返さない'] };
    const S = HP.sim;
    S.build(v.preset);
    const n0 = S.n;
    const clamp0 = (S.clampVN || 0) + (S.clampSN || 0) + (S.clampRN || 0) + (S.clampTN || 0) + (S.clampAN || 0);
    const T0 = S.totals(), L0 = T0.L + S.resL + S.radL, E0 = (T0.E !== undefined ? T0.E : null);
    const com = () => { let M = 0, cx = 0, cy = 0; for (let i = 0; i < S.n; i++) { M += S.m[i]; cx += S.m[i] * S.x[i]; cy += S.m[i] * S.y[i]; } return [cx / M, cy / M, M]; };
    const snap = () => {
      const [cx, cy, M] = com();
      const arr = [];
      for (let i = 0; i < S.n; i++) arr.push({ r: Math.hypot(S.x[i] - cx, S.y[i] - cy), m: S.m[i], i });
      arr.sort((a, b) => a.r - b.r);
      let acc = 0, rh = arr.length ? arr[arr.length - 1].r : 0;
      for (const q of arr) { acc += q.m; if (acc >= 0.5 * M) { rh = q.r; break; } }
      // 束縛率: 個々の粒の力学エネルギー(重力ポテンシャルは全対・softening 込み)
      let nB = 0, mB = 0;
      for (let i = 0; i < S.n; i++) {
        let U = 0;
        for (let j = 0; j < S.n; j++) {
          if (j === i) continue;
          const dx = S.x[j] - S.x[i], dy = S.y[j] - S.y[i];
          U -= HP.sim.params.G * S.m[j] / Math.sqrt(dx * dx + dy * dy + HP.sim.params.softening * HP.sim.params.softening);
        }
        const vx = S.vx[i], vy = S.vy[i];
        if (0.5 * (vx * vx + vy * vy) + U < 0) { nB++; mB += S.m[i]; }
      }
      // 中心密度: 半径 0.2·r_h(0) 内の面密度
      const rc = 0.2 * rh0;
      let mc = 0; for (const q of arr) { if (q.r <= rc) mc += q.m; else break; }
      // 重い粒(中心成分)の位置と最大質量
      let mMax = 0, rHeavyMax = 0, nHeavy = 0;
      for (let i = 0; i < S.n; i++) {
        if (S.m[i] > mMax) mMax = S.m[i];
        if (S.m[i] > coreIdx.mThresh) { nHeavy++; const r = Math.hypot(S.x[i] - cx, S.y[i] - cy); if (r > rHeavyMax) rHeavyMax = r; }
      }
      return { t: S.t, n: S.n, rh, boundFrac: mB / M, boundN: nB / S.n,
        rhoC: mc / (Math.PI * rc * rc), mCore: mc, mMax, nHeavy, rHeavyMax, M };
    };
    const series = [snap()];
    const every = Math.max(1, Math.floor(steps / nSample));
    let minSepHeavy = Infinity;
    for (let k = 0; k < steps; k++) {
      S.step(dt);
      if (coreIdx.nHeavy0 > 1) {
        const hs = [];
        for (let i = 0; i < S.n; i++) if (S.m[i] > coreIdx.mThresh) hs.push(i);
        for (let a = 0; a < hs.length; a++) for (let b = a + 1; b < hs.length; b++) {
          const d = Math.hypot(S.x[hs[a]] - S.x[hs[b]], S.y[hs[a]] - S.y[hs[b]]);
          if (d < minSepHeavy) minSepHeavy = d;
        }
      }
      if ((k + 1) % every === 0) series.push(snap());
      if (S.hasNaN()) break;
    }
    const T1 = S.totals(), L1 = T1.L + S.resL + S.radL;
    return { n0, series, minSepHeavy: Number.isFinite(minSepHeavy) ? minSepHeavy : null,
      fusN: S.fusN || 0, nan: S.hasNaN(), steps,
      clampD: ((S.clampVN || 0) + (S.clampSN || 0) + (S.clampRN || 0) + (S.clampTN || 0) + (S.clampAN || 0)) - clamp0,
      lRel: Math.abs(L1 - L0) / Math.max(Math.abs(L0), 1e-9),
      eRel: (E0 !== null && T1.E !== undefined) ? Math.abs(T1.E - E0) / Math.max(Math.abs(E0), 1e-9) : null,
      warn: (v.warnings || []).length, warnMsgs: (v.warnings || []).slice(0, 2) };
  };
});

const physics = Object.assign({}, base.physics);
if (KF1) physics.kFrame = 1;
const out = { wave: '第256便d', target: TARGET, node: process.version, at: new Date().toISOString(),
  config: { DT, NFIELD, MTOT, FC, APLUM, RCUT, NC0, AC0, NBH, RSUB, LFRAC, NSEED, CROSS, kFrame: physics.kFrame },
  note: '3 群(C0 滑らかな中心成分 / C1 中心 1 BH / Cn 同じ中心総質量を n 個へ)を **M・r_h・L を揃えて**同じ物差しで走らせる。'
    + 'pinned(中心固定)は使っていない —— 外部支持なしで何が起きるかを測る器である。',
  runs: [] };

const fx = (z, d = 4) => (z === null || z === undefined || !Number.isFinite(z)) ? '—' : z.toFixed(d);
const KINDS = ['C0', 'C1', 'Cn'];
const CROSS_T = 10;          // 交差時間 ≈ r_h/σ ≈ 10 単位(🍇 の宣言)
const STEPS = Math.round(CROSS * CROSS_T / DT);

for (let s = 0; s < NSEED; s++) {
  const seed = 20260911 + s;
  // r_h と L の目標は **C1 群の生値**から取る(3 群で同じ数に揃える)
  const ref = makeGroup('C1', seed);
  const rv = setVirialVelocities(ref, seed, G, EPS2);
  const rhTarget = halfMassRadius(ref);
  const lTarget = LFRAC * MTOT * rhTarget * rv.vRms;
  for (const kind of KINDS) {
    const b = makeGroup(kind, seed);
    const vi = setVirialVelocities(b, seed, G, EPS2);
    const nrm = normalize(b, rhTarget, lTarget, G, EPS2);
    const mThresh = 1.5 * (MTOT - FC * MTOT) / NFIELD;   // 場の星の質量の 1.5 倍を「重い粒」の閾値
    const nHeavy0 = b.filter((p) => p.m > mThresh).length;
    const t0 = Date.now();
    const r = await pg.evaluate(([bodies, physics, steps, dt, nSample, coreIdx, rh0]) =>
      window.__w256c.run(bodies, physics, steps, dt, nSample, coreIdx, rh0),
    [b.map((p) => ({ m: p.m, x: p.x, y: p.y, vx: p.vx, vy: p.vy })), physics, STEPS, DT, 20,
      { mThresh, nHeavy0 }, nrm.rh]);
    if (r.buildFailed) { console.error(`  seed=${seed} ${kind}: **build 失敗** ${JSON.stringify(r.errors)}`); out.runs.push({ seed, kind, buildFailed: true, errors: r.errors }); continue; }
    const ser = r.series;
    const first = ser[0], last = ser[ser.length - 1];
    const row = { seed, kind, nHeavy0, mThresh, vRms: vi.vRms,
      norm: nrm, rhTarget, lTarget, steps: STEPS, crossings: CROSS,
      rh0: first.rh, rhEnd: last.rh, rhRatio: last.rh / first.rh,
      rhoC0: first.rhoC, rhoCEnd: last.rhoC, rhoRatio: last.rhoC / first.rhoC,
      boundFrac0: first.boundFrac, boundFracEnd: last.boundFrac,
      nEnd: last.n, mMaxEnd: last.mMax, nHeavyEnd: last.nHeavy, rHeavyMaxEnd: last.rHeavyMax,
      minSepHeavy: r.minSepHeavy, fusN: r.fusN, nan: r.nan, clampD: r.clampD, lRel: r.lRel, eRel: r.eRel,
      warn: r.warn, warnMsgs: r.warnMsgs, series: ser, wallSec: (Date.now() - t0) / 1000 };
    out.runs.push(row);
    console.error(`  seed=${seed} ${kind}: r_h ${fx(row.rh0, 3)}→${fx(row.rhEnd, 3)}(×${fx(row.rhRatio, 3)}) `
      + `ρ_c ×${fx(row.rhoRatio, 3)} 束縛 ${fx(row.boundFrac0 * 100, 1)}→${fx(row.boundFracEnd * 100, 1)}% `
      + `重い粒 ${nHeavy0}→${row.nHeavyEnd}(最遠 ${fx(row.rHeavyMaxEnd, 2)}・最小分離 ${fx(row.minSepHeavy, 4)}) `
      + `融合 ${row.fusN} NaN=${row.nan} クランプ ${row.clampD} |ΔL|/L=${row.lRel === null ? '—' : row.lRel.toExponential(1)} `
      + `[${row.wallSec.toFixed(1)}s]`);
  }
}

// ---------------------------------------------------------------- 群ごとの集計(seed 横断)
out.summary = {};
for (const kind of KINDS) {
  const rs = out.runs.filter((r) => r.kind === kind && !r.buildFailed);
  const med = (a) => { const z = a.slice().sort((x, y) => x - y); return z.length ? z[(z.length - 1) >> 1] : null; };
  out.summary[kind] = { nSeed: rs.length,
    rhRatio: rs.map((r) => r.rhRatio), rhRatioMed: med(rs.map((r) => r.rhRatio)),
    rhoRatio: rs.map((r) => r.rhoRatio), rhoRatioMed: med(rs.map((r) => r.rhoRatio)),
    boundEnd: rs.map((r) => r.boundFracEnd), boundEndMed: med(rs.map((r) => r.boundFracEnd)),
    nHeavyEnd: rs.map((r) => r.nHeavyEnd), rHeavyMaxEnd: rs.map((r) => r.rHeavyMaxEnd),
    minSepHeavy: rs.map((r) => r.minSepHeavy),
    clampD: rs.map((r) => r.clampD), nan: rs.some((r) => r.nan),
    lRelMax: rs.length ? Math.max(...rs.map((r) => r.lRel)) : null };
}
out.pageErrors = pageErrors;
await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error('[w256d-cl] → ' + path.relative(ROOT, OUT));
for (const kind of KINDS) {
  const s = out.summary[kind];
  if (!s.nSeed) { console.error(`  【${kind}】走行なし`); continue; }
  console.error(`  【${kind}】r_h 比 ${s.rhRatio.map((z) => z.toFixed(3)).join(' / ')}(中央 ${fx(s.rhRatioMed, 3)})`
    + ` ρ_c 比 ${s.rhoRatio.map((z) => z.toFixed(3)).join(' / ')} 束縛 ${s.boundEnd.map((z) => (z * 100).toFixed(1)).join(' / ')}%`
    + ` クランプ ${s.clampD.join('/')} NaN=${s.nan}`);
}
if (pageErrors.length) console.error('[w256d-cl] pageErrors: ' + pageErrors.slice(0, 3).join(' | '));

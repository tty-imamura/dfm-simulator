// 第257便d(第49報): **星団 C0/C1/Cn —— 初期のビリアル比・全エネルギー・外縁条件を揃えた N/ε 掃引**。
//
// 第256便d ⑤ は M・r_h・L を揃えて 3 群を走らせ、**3 群とも半質量半径が 3.9〜7.5 倍に膨張**した。
// 3 審査 v15 はここへ 2 つの条件を付けた:
//   (a) **中心配置を変えると平衡分布が変わる** —— 同じ速度を配って膨張を比べると、BH の効果と
//       初期緩和(そもそも平衡でなかったこと)が混ざる。**初期のビリアル比 2K/|U|・全エネルギー
//       E_tot・外縁条件を 3 群で揃えてから**比べること。
//   (b) 膨張が **N・ソフトニング ε の縮約由来**か **BH 由来**かを、まず数で切り分けること
//       ((iii) N/ソフトニング → (ii) kF1 → (i) 融合 の順)。
//
// 本器はその (a)(b) だけを行う。**kF1 も融合も走らせない**(未走行を未走行と書く)。
//
// ■ 揃え方(**厳密に揃うのは 2K/|U| と E_tot・λ の 3 つ**で、r_h は揃わない — そう書く)
//   1) 位置を作る(場の星 = 2D Plummer a=APLUM を RCUT で切る/中心成分は群ごと)。
//   2) 等方・等速の速度を配る(乱数列は 3 群で同じ — 場の星の向きはビット同一)。
//   3) 重心(位置・速度)を機械ゼロにする。
//   4) 剛体回転を足して **λ ≡ L/(M·r_h·v_rms) = LFRAC** にする。
//   5) 速度を α 倍して **Q ≡ 2K/|U| = QSTAR** にする(λ は α で不変)。
//   6) 位置を s 倍・速度を 1/√s 倍して **E_tot = E*** にする(Q も λ も s で不変)。
//      E* は同じセル(N, ε, seed)の **C1 群の自然値**を採る。
//   ⇒ 3 群で **2K/|U|・E_tot・λ・M・ε・外縁の切り方(RCUT/a)**が同じになる。
//      **r_h は揃わない**(同じ E で分布が違えば当然違う)ので、r_h(0) と r_cut/r_h を表に出す。
//   ⇒ 時間の物差しも群ごとの交差時間 t_cr=r_h/v_rms で取る(「50 交差」は各群 50 t_cr)。
//
// **エンジンの物理は 1 bit も書き換えない**。内蔵 🍇(tuc47)の physics 宣言を流用し、
// **ソフトニングだけ掃引**して bodies を器が組む(診断コピー — プリセットは増やさない)。
// pinned(中心固定)は使わない。
//
// 実行: node tests/exp-w257d-cluster2.mjs [--fast] [--cells "224:0.25,0.5,1.0:3;448:0.25,0.5,1.0:1;896:0.5:1"]
//                                        [--cross 50] [--budget 900]
//   --cells  … "N:ε,ε,…:seed 数" を ';' 区切りで。載っていない (N,ε) は **未走行**として表に出す。
//   --budget … 全体の計算時間予算(秒)。超えたセルは `skipped:"time-budget"` と記録する。
// 出力: tests/out/cluster2-w257.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CFG, KINDS, makeGroup, setIsotropicVelocities, shape } from './lib-w257d-cluster2.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'cluster2-w257.json');
const argv = process.argv.slice(2);
const FAST = argv.includes('--fast');
const strArg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const numArg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? Number(argv[i + 1]) : d; };
const CROSS = FAST ? 3 : numArg('--cross', 50);
const BUDGET = numArg('--budget', 1800);
// 掃引の 2 次元。**N は「場の星の数」**である(全粒子数は群ごとに N+NC0 / N+1 / N+NBH)。
const CELLS_SPEC = strArg('--cells', FAST ? '224:0.5:1' : '224:0.25,0.5,1.0:3;448:0.25,0.5,1.0:1;896:0.5:1');
const N_GRID = [224, 448, 896];
const EPS_GRID = [0.25, 0.5, 1.0];

const DT = 0.016;
// 初期条件の作り方は **tests/lib-w257d-cluster2.mjs が正本**(QA behavior.clusterVirial が
// 同じ 1 本をブラウザ無しで読む)。ここは走行と集計だけを持つ。
const { MTOT, FC, APLUM, RCUT, NC0, AC0, NBH, RSUB, LFRAC, QSTAR } = CFG;

// ---------------------------------------------------------------- セル指定を解く
const cells = [];
for (const seg of CELLS_SPEC.split(';')) {
  if (!seg.trim()) continue;
  const [nStr, epsStr, seedStr] = seg.split(':');
  const n = Number(nStr), seeds = Number(seedStr || 1);
  for (const e of String(epsStr).split(',')) cells.push({ n, eps: Number(e), seeds });
}
const cellKey = (n, e) => `${n}|${e}`;
const planned = new Set(cells.map((c) => cellKey(c.n, c.eps)));

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
  return { physics: JSON.parse(JSON.stringify(p.physics)) };
});
const G = base.physics.G;

await pg.evaluate(() => {
  const W = (window.__w257d = {});
  W.run = (bodies, physics, steps, dt, nSample, coreIdx, rh0) => {
    const pd = { id: 'w257dCluster2', name: 'w257d cluster2 diag', emoji: '🧪', group: '診断',
      description: '第257便d の星団 N/ε 掃引(診断コピー — プリセットではない)',
      camera: { scale: 60 }, world: { boundary: 'none', size: 0 }, physics,
      bodies: bodies.map((b) => ({ type: 'single', m: b.m, x: b.x, y: b.y, vx: b.vx, vy: b.vy, spin: 0, pinned: false })) };
    const v = HP.validatePreset(pd);
    if (!v || !v.preset) return { buildFailed: true, errors: (v && v.errors) ? v.errors.slice(0, 4) : ['validatePreset が preset を返さない'] };
    const S = HP.sim;
    S.build(v.preset);
    const clamp0 = (S.clampVN || 0) + (S.clampSN || 0) + (S.clampRN || 0) + (S.clampTN || 0) + (S.clampAN || 0);
    const T0 = S.totals(), L0 = T0.L + S.resL + S.radL;
    const com = () => { let M = 0, cx = 0, cy = 0; for (let i = 0; i < S.n; i++) { M += S.m[i]; cx += S.m[i] * S.x[i]; cy += S.m[i] * S.y[i]; } return [cx / M, cy / M, M]; };
    const snap = () => {
      const [cx, cy, M] = com();
      const arr = [];
      for (let i = 0; i < S.n; i++) arr.push({ r: Math.hypot(S.x[i] - cx, S.y[i] - cy), m: S.m[i], i });
      arr.sort((a, b) => a.r - b.r);
      let acc = 0, rh = arr.length ? arr[arr.length - 1].r : 0;
      for (const q of arr) { acc += q.m; if (acc >= 0.5 * M) { rh = q.r; break; } }
      const sof2 = HP.sim.params.softening * HP.sim.params.softening;
      let nB = 0, mB = 0, Wt = 0, Kt = 0;
      for (let i = 0; i < S.n; i++) {
        let U = 0;
        for (let j = 0; j < S.n; j++) {
          if (j === i) continue;
          const dx = S.x[j] - S.x[i], dy = S.y[j] - S.y[i];
          U -= HP.sim.params.G * S.m[j] / Math.sqrt(dx * dx + dy * dy + sof2);
        }
        const ki = 0.5 * (S.vx[i] * S.vx[i] + S.vy[i] * S.vy[i]);
        Wt += 0.5 * S.m[i] * U; Kt += S.m[i] * ki;
        if (ki + U < 0) { nB++; mB += S.m[i]; }
      }
      const rc = 0.2 * rh0;
      let mc = 0; for (const q of arr) { if (q.r <= rc) mc += q.m; else break; }
      let mMax = 0, rHeavyMax = 0, nHeavy = 0;
      for (let i = 0; i < S.n; i++) {
        if (S.m[i] > mMax) mMax = S.m[i];
        if (S.m[i] > coreIdx.mThresh) { nHeavy++; const r = Math.hypot(S.x[i] - cx, S.y[i] - cy); if (r > rHeavyMax) rHeavyMax = r; }
      }
      return { t: S.t, n: S.n, rh, boundFrac: mB / M, rhoC: mc / (Math.PI * rc * rc),
        mMax, nHeavy, rHeavyMax, M, E: Kt + Wt, K: Kt, W: Wt, Q: 2 * Kt / Math.abs(Wt) };
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
    return { n0: S.n, series, minSepHeavy: Number.isFinite(minSepHeavy) ? minSepHeavy : null,
      fusN: S.fusN || 0, nan: S.hasNaN(), steps,
      e0: series[0].E, e1: series[series.length - 1].E,
      q0: series[0].Q, q1: series[series.length - 1].Q, totalsE: (T1.E !== undefined ? T1.E : null),
      clampD: ((S.clampVN || 0) + (S.clampSN || 0) + (S.clampRN || 0) + (S.clampTN || 0) + (S.clampAN || 0)) - clamp0,
      lRel: Math.abs(L1 - L0) / Math.max(Math.abs(L0), 1e-9),
      // 帳簿 E は器が同じ式(softening 込みの全対ポテンシャル)で先頭と末尾に測る
      // (S.totals() は {px,py,L} しか返さないので E はここで作る)
      eRel: (series.length > 1 && Number.isFinite(series[0].E))
        ? Math.abs(series[series.length - 1].E - series[0].E) / Math.max(Math.abs(series[0].E), 1e-9) : null,
      warn: (v.warnings || []).length };
  };
});

const out = { wave: '第257便d', target: TARGET, node: process.version, at: new Date().toISOString(),
  config: { DT, G, MTOT, FC, APLUM, RCUT, NC0, AC0, NBH, RSUB, LFRAC, QSTAR, CROSS, BUDGET,
    cellsSpec: CELLS_SPEC, nGrid: N_GRID, epsGrid: EPS_GRID, kFrame: base.physics.kFrame },
  note: '第257便d: 初期の **2K/|U|=' + QSTAR + '・E_tot・λ・M・外縁の切り方(RCUT/a=' + (RCUT / APLUM).toFixed(3)
    + ')を 3 群で揃えてから** N(場の星の数)× ソフトニング ε を掃く。r_h は揃わない(同じ E で'
    + '分布が違えば違う)ので表に出す。時間は群ごとの交差時間 t_cr=r_h/v_rms で測る。'
    + '**kF1 も融合も走らせていない**(未走行 — 次段)。pinned は使わない。',
  runs: [], skipped: [] };

const t00 = Date.now();
for (const cell of cells) {
  const { n: NF, eps, seeds } = cell;
  const eps2 = eps * eps;
  const physics = Object.assign({}, base.physics, { softening: eps });
  for (let s = 0; s < seeds; s++) {
    const seed = 20260911 + s;
    if ((Date.now() - t00) / 1000 > BUDGET) {
      out.skipped.push({ N: NF, eps, seed, reason: 'time-budget' });
      continue;
    }
    // E* は同じセルの C1 群の自然値
    const ref = makeGroup('C1', seed, NF);
    setIsotropicVelocities(ref, seed, G, eps2);
    const refShape = shape(ref, G, eps2, null);
    const eTarget = refShape.E;
    for (const kind of KINDS) {
      const b = makeGroup(kind, seed, NF);
      setIsotropicVelocities(b, seed, G, eps2);
      const nrm = shape(b, G, eps2, eTarget);
      const mThresh = 1.5 * (MTOT - FC * MTOT) / NF;
      const nHeavy0 = b.filter((p) => p.m > mThresh).length;
      const steps = Math.round(CROSS * nrm.tCross / DT);
      const t0 = Date.now();
      const r = await pg.evaluate(([bodies, ph, st, dt, nSample, coreIdx, rh0]) =>
        window.__w257d.run(bodies, ph, st, dt, nSample, coreIdx, rh0),
      [b.map((p) => ({ m: p.m, x: p.x, y: p.y, vx: p.vx, vy: p.vy })), physics, steps, DT, 20,
        { mThresh, nHeavy0 }, nrm.rh]);
      if (r.buildFailed) {
        out.runs.push({ N: NF, eps, seed, kind, buildFailed: true, errors: r.errors });
        console.error(`  N=${NF} ε=${eps} seed=${seed} ${kind}: **build 失敗**`);
        continue;
      }
      const first = r.series[0], last = r.series[r.series.length - 1];
      const row = { N: NF, eps, seed, kind, nTotal: r.n0, nHeavy0, steps, crossings: CROSS,
        init: { Q: nrm.Q, E: nrm.E, K: nrm.K, W: nrm.W, L: nrm.L, M: nrm.M, lambda: nrm.lambda,
          rh: nrm.rh, r95: nrm.r95, rCut: nrm.rCut, rCutOverRh: nrm.rCut / nrm.rh,
          r95OverRh: nrm.r95 / nrm.rh, vRms: nrm.vRms, tCross: nrm.tCross, scale: nrm.scale },
        eTarget,
        rh0: first.rh, rhEnd: last.rh, rhRatio: last.rh / first.rh,
        rhoC0: first.rhoC, rhoCEnd: last.rhoC,
        boundFrac0: first.boundFrac, boundFracEnd: last.boundFracEnd === undefined ? last.boundFrac : last.boundFrac,
        nEnd: last.n, nHeavyEnd: last.nHeavy, rHeavyMaxEnd: last.rHeavyMax,
        minSepHeavy: r.minSepHeavy, fusN: r.fusN, nan: r.nan, clampD: r.clampD,
        lRel: r.lRel, eRel: r.eRel, warn: r.warn,
        series: r.series.map((z) => ({ t: z.t, rh: z.rh, boundFrac: z.boundFrac, rhoC: z.rhoC })),
        wallSec: (Date.now() - t0) / 1000 };
      out.runs.push(row);
      console.error(`  N=${NF} ε=${eps} seed=${seed} ${kind}: n=${r.n0} Q0=${nrm.Q.toFixed(6)} E0=${nrm.E.toFixed(6)}`
        + ` r_h ${first.rh.toFixed(3)}→${last.rh.toFixed(3)}(×${(last.rh / first.rh).toFixed(3)})`
        + ` 束縛 ${(first.boundFrac * 100).toFixed(1)}→${(last.boundFrac * 100).toFixed(1)}%`
        + ` 重い粒 ${nHeavy0}→${last.nHeavy}(最遠 ${last.rHeavyMax.toFixed(2)})`
        + ` 融合 ${r.fusN} NaN=${r.nan} クランプ ${r.clampD} |ΔL|/L=${r.lRel.toExponential(1)}`
        + ` |ΔE|/E=${r.eRel === null ? '—' : r.eRel.toExponential(1)} [${((Date.now() - t0) / 1000).toFixed(1)}s]`);
    }
  }
}

// ---------------------------------------------------------------- 未走行の宣言(N × ε の全格子)
for (const n of N_GRID) for (const e of EPS_GRID) {
  if (!planned.has(cellKey(n, e))) out.skipped.push({ N: n, eps: e, reason: 'not-planned(未走行)' });
}

// ---------------------------------------------------------------- 集計
out.summary = { cells: [], virialCheck: null };
const byCell = new Map();
for (const r of out.runs) {
  if (r.buildFailed) continue;
  const k = `${r.N}|${r.eps}`;
  if (!byCell.has(k)) byCell.set(k, []);
  byCell.get(k).push(r);
}
for (const [k, rs] of byCell) {
  const [N, eps] = k.split('|').map(Number);
  const per = {};
  for (const kind of KINDS) {
    const z = rs.filter((r) => r.kind === kind);
    per[kind] = { nSeed: z.length, rhRatio: z.map((r) => r.rhRatio),
      boundEnd: z.map((r) => r.boundFracEnd), rhoEnd: z.map((r) => r.rhoCEnd),
      rHeavyMaxEnd: z.map((r) => r.rHeavyMaxEnd), minSepHeavy: z.map((r) => r.minSepHeavy),
      clampD: z.map((r) => r.clampD), nan: z.some((r) => r.nan),
      lRelMax: z.length ? Math.max(...z.map((r) => r.lRel)) : null,
      eRelMax: z.length ? Math.max(...z.map((r) => r.eRel === null ? 0 : r.eRel)) : null };
  }
  // 初期の揃い具合。**seed ごとに 3 群の中で比べる**(E* は seed ごとに違うので、
  // seed をまたいで広がりを取ると「揃っていない」ように見える — 第257便d で直した)。
  const seeds = [...new Set(rs.map((r) => r.seed))];
  const perSeed = seeds.map((sd) => {
    const z = rs.filter((r) => r.seed === sd);
    const qs = z.map((r) => r.init.Q), es = z.map((r) => r.init.E);
    const rel = (v) => (Math.max(...v) - Math.min(...v)) / Math.max(...v.map(Math.abs));
    return { seed: sd, nKind: z.length, QRel: rel(qs), ERel: rel(es), E: es[0],
      Q: qs[0], rh: z.map((r) => r.init.rh), rCutOverRh: z.map((r) => r.init.rCutOverRh) };
  });
  per.initSpread = { perSeed,
    QRelMax: Math.max(...perSeed.map((z) => z.QRel)),
    ERelMax: Math.max(...perSeed.map((z) => z.ERel)),
    note: '同じ seed の 3 群どうしで比べた相対差(seed 間は E* が違うので比べない)' };
  out.summary.cells.push({ N, eps, per });
}
out.pageErrors = pageErrors;
await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error('[w257d-cl2] → ' + path.relative(ROOT, OUT));
for (const c of out.summary.cells) {
  console.error(`  【N=${c.N} ε=${c.eps}】 2K/|U| 相対差 ${c.per.initSpread.QRelMax.toExponential(2)}`
    + ` / E_tot 相対差 ${c.per.initSpread.ERelMax.toExponential(2)}`
    + KINDS.map((k) => ` ${k} r_h比 ${c.per[k].rhRatio.map((z) => z.toFixed(2)).join('/')}`).join(''));
}
if (out.skipped.length) console.error('[w257d-cl2] 未走行: ' + out.skipped.map((s) => `N=${s.N} ε=${s.eps}(${s.reason})`).join(' , '));
if (pageErrors.length) console.error('[w257d-cl2] pageErrors: ' + pageErrors.slice(0, 3).join(' | '));

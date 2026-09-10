// 第252便b(第44報)「近点サブステップ・20 近点窓・ε_num 3 段・A/B 表・参照積分器 1 点」。
//
// 第251便a ⑨ の持ち越し(設計ノート「periSubsteps は本便では実装しない」)を実装し、**既定 dt の残差が
// どこまで離散化なのか**を数で切り分ける。原則は 1 行:**dt 未収束の残差は物理ではない**。
//
// ■ 何を測るか(すべて実測 — 予想は書かない)
//   EPS  : ε_num 3 段。dt = h, h/2, h/4(h=アプリ既定 0.016)で Δϖ[°/周] を測り、
//            観測次数 p_obs = log₂|(Q_h−Q_{h/2})/(Q_{h/2}−Q_{h/4})|
//            ε_num  = |Q_h − Q_{h/4}|
//          を出す。同じ表に **既定 dt + physics.periSubsteps{n:4,8,16}** を並べ、
//          「近点だけ細かくする」で残差がどこまで縮むかと、その計算コスト
//          (= 実際に踏んだサブステップ数 / 外側ステップ数)を併記する。
//          対象は ⚡🧮🩺🧶(DFM 版)と 🪝🪄🩹🪤(案K = compactForce 版)の 8 本。
//   AB   : A/B 表。🪶🪃🪀(λ_PN=1/f・1PN 半分処方)対 🪝🪄🩹🪤(案K)を**既定 dt・
//          periSubsteps 無し/有り**で並べ、DFM/観測比を 1 表にする(第251便a の
//          「2.000 対 2.025」を dt と窓を揃えたうえで再測する)。
//   REF  : 参照積分器 1 点。**エンジンを 1 度も呼ばない Float64 の RK4**(このファイルの中だけで閉じる)を
//          h/16 で回し、エンジンの h/4 と Δϖ を比べる。**⚡ の 1 点だけ**で、全面導入はしない。
//          参照が写しているのは **kFrame=0 セクタ(E4 ソフト重力 + E12 測地線1PN)**である
//          —— ⚡ の既定は kFrame=1 で、引きずり(A8/E6′・pull 重み・輸送・pairReduced 反作用)は
//          **参照に入っていない**。したがって比較は ⚡ の **kF0 対照**の上で行う(限界の宣言)。
//   BIT  : 既定経路の bit 一致。periSubsteps 未宣言のとき、代表プリセットの 600 步が
//          基点(引数 --base <file>)と 1 bit 同じであることを確認する。
//
// ■ 窓の宣言(第252便b の統一): 近点の窓は **最初の 20 近点(19 区間)**。20 個に満たなければ
//   `unmeasured` を返し、他の周期定義へは置換しない(第251便c の定義契約の延長)。
//
// 実行: node tests/exp-w252b-substep.mjs [--eps] [--ab] [--ref] [--bit] [--fast]
//       (節を 1 つも指定しなければ EPS/AB/REF。--fast は h/4 段と n:16 を省く)
// 出力: tests/out/substep-w252.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'substep-w252.json');
const argv = process.argv.slice(2);
const FAST = argv.includes('--fast');
const BASE = (() => { const i = argv.indexOf('--base'); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : null; })();
const only = argv.filter((a) => a.startsWith('--') && a !== '--fast' && a !== '--base').map((a) => a.slice(2));
const want = (k) => only.length ? only.includes(k) : (k !== 'bit');

const DT0 = 0.016;            // アプリ既定(index.html の const DT)
const NWIN = 20;              // **窓 = 最初の 20 近点(19 区間)**(本便の統一宣言)
const YR = 365.25 * 86400;    // ユリウス年

// ---------------------------------------------------------------- 観測レコード(CSV が正本)
// paper/data/solar-observations.csv の**最初の行**を採る(calaudit と同じ規約)。
// CSV に行が無い量だけ、既存ハーネス(tests/exp-w249a.mjs の __W249SYS)の転写値を使い、
// `from:"w249a"` と記録する(手打ちの数字をこのファイルで増やさない)。
function loadObs() {
  const txt = fs.readFileSync(path.join(ROOT, 'paper', 'data', 'solar-observations.csv'), 'utf8');
  const m = new Map();
  for (const line of txt.split('\n')) {
    if (!line.trim() || line.startsWith('body,')) continue;
    const cols = []; let cur = '', inQ = false;
    for (const ch of line) {
      if (inQ) { if (ch === '"') inQ = false; else cur += ch; }
      else if (ch === '"') inQ = true;
      else if (ch === ',') { cols.push(cur); cur = ''; }
      else cur += ch;
    }
    cols.push(cur);
    const key = cols[0] + '|' + cols[1];
    if (m.has(key)) continue;
    m.set(key, { v: Number(cols[2]), unit: cols[3], source: cols[4] });
  }
  return m;
}
const CSV = loadObs();
// 系 → CSV の body 名(相対軌道の要素を持つ行)と、CSV に無い量の転写元
const SYS = {
  doubleAB: { body: 'PSR J0737-3039 B', label: '⚡ J0737−3039A/B', Tunit: 10,
    omegaDotFallback: 16.899323, omegaDotFrom: 'tests/exp-w249a.mjs(第249便a の転写 — CSV に periastron_advance 行が無い)' },
  j1757: { body: 'PSR J1757-1854', label: '🧮 J1757−1854', Tunit: 10 },
  j1946: { body: 'PSR J1946+2052', label: '🩺 J1946+2052', Tunit: 10 },
  b1534: { body: 'PSR B1534+12', label: '🧶 B1534+12', Tunit: 10 },
};
for (const k of Object.keys(SYS)) {
  const s = SYS[k];
  const P = CSV.get(s.body + '|orbital_period'), e = CSV.get(s.body + '|eccentricity');
  const w = CSV.get(s.body + '|periastron_advance');
  s.PobsS = (P && P.unit === 's') ? P.v : (P ? P.v * 86400 : null);
  s.e = e ? e.v : null;
  s.omegaDot = w ? w.v : s.omegaDotFallback;
  s.omegaDotFrom = w ? w.source : s.omegaDotFrom;
  s.obsDegPerOrbit = (s.omegaDot !== undefined && s.PobsS) ? s.omegaDot * s.PobsS / YR : null;
  s.Pu = s.PobsS / s.Tunit;
}
// プリセット id → 系
const OF = {
  psrDoubleABDFM: 'doubleAB', psrJ1757DFM: 'j1757', psrJ1946DFM: 'j1946', psrB1534DFM: 'b1534',
  psrDoubleABCF: 'doubleAB', psrJ1757CF: 'j1757', psrJ1946CF: 'j1946', psrB1534CF: 'b1534',
  psrDoubleABPN: 'doubleAB', psrJ1757PN: 'j1757', psrJ1946PN: 'j1946',
};
const EMOJI = { psrDoubleABDFM: '⚡', psrJ1757DFM: '🧮', psrJ1946DFM: '🩺', psrB1534DFM: '🧶',
  psrDoubleABCF: '🪝', psrJ1757CF: '🪄', psrJ1946CF: '🩹', psrB1534CF: '🪤',
  psrDoubleABPN: '🪶', psrJ1757PN: '🪃', psrJ1946PN: '🪀' };

// ================================================================ ブラウザ
let browser;
try { const { chromium } = await import('playwright'); browser = await chromium.launch(); }
catch {
  const { createRequire } = await import('node:module');
  const req = createRequire(path.join(ROOT, 'noop.js'));
  const { chromium } = req('playwright-core');
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
}
const pg = await browser.newPage();
const pageErrors = [];
pg.on('pageerror', (e) => pageErrors.push(String(e)));
await pg.goto(INDEX, { waitUntil: 'load' });
await pg.waitForFunction(() => window.HP && HP.sim);

// ---------------------------------------------------------------- ページ側ヘルパ(本体には入れない)
await pg.evaluate(() => {
  // 宣言の差し替え(physics の**宣言だけ**。bodies・massCalibration は 1 bit 触らない)
  window.__w252build = (id, patch) => {
    const pd = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === id)));
    if (patch) for (const k of Object.keys(patch)) {
      if (patch[k] === null) delete pd.physics[k]; else pd.physics[k] = patch[k];
    }
    delete pd.massCalibration;   // 台帳の三者一致検査を実験へ持ち込まない(第249便a と同じ)
    const v = HP.validatePreset(pd);
    HP.sim.build(v.preset);
    return { warn: (v.warnings || []).length, warnMsgs: (v.warnings || []).slice(0, 3),
      n: HP.sim.n, hasPeriSub: !!HP.sim.hasPeriSub, psN: HP.sim._psN || null,
      psRperi: HP.sim._psRperi || null, psAuto: !!HP.sim._psAuto,
      psThr: HP.sim.hasPeriSub ? HP.sim._psRmul * HP.sim._psRmin : null,
      psPair: HP.sim.hasPeriSub ? [HP.sim._psI, HP.sim._psJ] : null,
      kFrame: HP.sim.params.kFrame, lambdaPN: HP.sim.params.lambdaPN, cLight: HP.sim.params.cLight };
  };
  // 近点移動・近点間 P の測定(第246便b→第247便a→第249便a と同一手続き。**窓だけが本便の宣言**)
  //   nWin 個の近点位相を直線 fit した傾き = 1 周あたりの近点移動。
  //   nWin 個に満たなければ **unmeasured**(他の周期定義へは置換しない)。
  window.__w252peri = (S, dt, tEnd, pRef, nWin) => {
    const steps = Math.round(tEnd / dt);
    const A = [], Bd = [], sid = [];
    let r2 = 0, r1 = 0, t2 = 0, t1 = 0, rd1 = 0, rMin = Infinity, rMax = -Infinity;
    let acc = 0, accPrev = 0, thPrev = null, nTurn = 0;
    for (let k = 0; k < steps; k++) {
      S.step(dt);
      const dx = S.x[1] - S.x[0], dy = S.y[1] - S.y[0];
      const rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
      const dvx = S.vx[1] - S.vx[0], dvy = S.vy[1] - S.vy[0];
      const rd = (dx * dvx + dy * dvy) / rr;
      if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr;
      if (thPrev !== null) {
        let d = th - thPrev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
        accPrev = acc; acc += d;
        while (sid.length < nWin && Math.abs(acc) >= (nTurn + 1) * 2 * Math.PI) {
          const tgt = Math.sign(acc) * (nTurn + 1) * 2 * Math.PI;
          const fr = (acc !== accPrev) ? (tgt - accPrev) / (acc - accPrev) : 0;
          sid.push((k - 1 + fr) * dt); nTurn++;
        }
      }
      thPrev = th;
      if (k >= 1 && rd1 < 0 && rd >= 0) {   // 検出器 A(ṙ の −→+ 交差)
        const fr = (rd !== rd1) ? (-rd1 / (rd - rd1)) : 0;
        let a1 = t1, a2 = th; while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI; while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
        A.push({ ang: a1 + fr * (a2 - a1), k: k - 1 + fr, r: rr });
      }
      if (k >= 2 && r1 < r2 && r1 < rr) {   // 検出器 B(距離極小の放物線頂点)
        const dd = (r2 - 2 * r1 + rr), fr = (dd !== 0) ? 0.5 * (r2 - rr) / dd : 0;
        let a1 = t2, a2 = t1, a3 = th;
        while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI; while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
        while (a3 - a2 > Math.PI) a3 -= 2 * Math.PI; while (a3 - a2 < -Math.PI) a3 += 2 * Math.PI;
        Bd.push({ ang: a2 + 0.5 * fr * (a3 - a1) + 0.5 * fr * fr * (a3 - 2 * a2 + a1), k: k - 1 + fr, r: r1 });
      }
      r2 = r1; r1 = rr; t2 = t1; t1 = th; rd1 = rd;
      if (S.hasNaN()) break;
    }
    // **柵に使う参照周期は実測から取る**(第252便b): 近点検出の「一周に近点 1 つ」柵は
    // 0.5·pRef より近い検出を捨てるので、pRef に**観測周期**を渡すと、走った軌道の周期が
    // それより短い構成(⚡ の kF0 対照は実周期 369 単位 対 観測 883 単位)で**近点を 1 つおきに
    // 捨ててしまう**。相対角の 2π 交差から測った同方向周期(pRef 非依存)を使って自己無撞着にする。
    const sidMean = sid.length > 1 ? (sid[sid.length - 1] - sid[0]) / (sid.length - 1) : null;
    const pUse = (sidMean > 0) ? sidMean : pRef;
    return { rMin, rMax, eProxy: (rMax - rMin) / (rMax + rMin),
      A: window.__w252fit(A, rMin, rMax, pUse, dt, nWin), B: window.__w252fit(Bd, rMin, rMax, pUse, dt, nWin),
      pRefUsed: pUse, pRefGiven: pRef,
      sidN: sid.length, sidMean,
      steps, nan: S.hasNaN(), clamp: (S.clampVN || 0) + (S.clampSN || 0) + (S.clampRN || 0) + (S.clampTN || 0) + (S.clampAN || 0),
      periSubHits: S.periSubHits || 0, periSubSteps: S.periSubSteps || 0, framePrec: S.framePrec || null };
  };
  // 近点位相の直線 fit(柵は第246便b と同一 — 近点/遠点の区別・一周に近点 1 つ・半周ジャンプ拒否)
  window.__w252fit = (raw, rMin, rMax, pRef, dt, nWin) => {
    const mid = 0.5 * (rMin + rMax);
    const peri = raw.filter((p) => p.r < mid);
    const rej = { apo: raw.length - peri.length, dup: 0, jump: 0 };
    const keep = [];
    for (const p of peri) {
      if (keep.length && (p.k - keep[keep.length - 1].k) * dt < 0.5 * pRef) { rej.dup++; continue; }
      keep.push(p);
    }
    const found = keep.length;
    if (found < nWin) return { nPeri: found, found, unmeasured: true, rej,
      slopeDeg: null, residDeg: null, perMean: null, perN: 0 };
    const use = keep.slice(0, nWin), ang = [];
    for (let i = 0; i < use.length; i++) {
      let a = use[i].ang;
      if (i) { let z = a - ang[i - 1]; while (z > Math.PI) z -= 2 * Math.PI; while (z < -Math.PI) z += 2 * Math.PI;
        if (Math.abs(z) > Math.PI / 2) { rej.jump++; break; }
        a = ang[i - 1] + z; }
      ang.push(a);
    }
    const n = ang.length;
    if (n < nWin) return { nPeri: n, found, unmeasured: true, rej, slopeDeg: null, residDeg: null, perMean: null, perN: 0 };
    const mx = (n - 1) / 2, my = ang.reduce((a, b) => a + b, 0) / n;
    let sxy = 0, sxx = 0;
    for (let i = 0; i < n; i++) { sxy += (i - mx) * (ang[i] - my); sxx += (i - mx) * (i - mx); }
    const slope = sxy / sxx;
    const resid = Math.sqrt(ang.reduce((s, a, i) => s + (a - (my + slope * (i - mx))) ** 2, 0) / n);
    // 近点間周期 = 窓内 19 区間の平均(= (t_20 − t_1)/19)
    const perMean = (use[nWin - 1].k - use[0].k) * dt / (nWin - 1);
    return { nPeri: n, found, unmeasured: false, rej,
      slopeDeg: slope * 180 / Math.PI, residDeg: resid * 180 / Math.PI,
      perMean, perN: nWin - 1 };
  };
  // 1 行を測る
  window.__w252run = (id, dt, patch, orbits, nWin, Pu) => {
    const b = window.__w252build(id, patch);
    const S = HP.sim;
    const o = window.__w252peri(S, dt, orbits * Pu, Pu, nWin);
    o.meta = b;
    return o;
  };
});

const out = { wave: '第252便b', target: TARGET, node: process.version, at: new Date().toISOString(),
  dt0: DT0, window: { nPeri: NWIN, nIntervals: NWIN - 1,
    note: '窓 = 最初の 20 近点(19 区間)。20 個に満たなければ unmeasured(他の周期定義へは置換しない)' },
  obs: SYS, fast: FAST };

// 走行長: 20 近点を確実に含む 21.5 公転(遠点整列で始まるので最初の近点は約 0.5 公転後)
const ORBITS = 21.5;

const runRow = async (id, dt, patch, tag) => {
  const s = SYS[OF[id]];
  const t0 = Date.now();
  const r = await pg.evaluate(({ id, dt, patch, orbits, nWin, Pu }) =>
    window.__w252run(id, dt, patch, orbits, nWin, Pu), { id, dt, patch, orbits: ORBITS, nWin: NWIN, Pu: s.Pu });
  const adv = r.A.slopeDeg, obs = s.obsDegPerOrbit;
  const PmeasS = (r.A.perMean !== null) ? r.A.perMean * s.Tunit : null;
  const row = { id, emoji: EMOJI[id], sys: OF[id], tag, dt, patch: patch || null,
    advA: adv, advB: r.B.slopeDeg,
    detDiff: (adv === null || r.B.slopeDeg === null) ? null : Math.abs(adv - r.B.slopeDeg),
    residPct: (adv === null) ? null : (adv / obs - 1) * 100,
    ratioObs: (adv === null) ? null : adv / obs,
    obsDegPerOrbit: obs, nPeriA: r.A.nPeri, foundA: r.A.found, unmeasuredA: r.A.unmeasured,
    residFitDeg: r.A.residDeg,
    PmeasS, PobsS: s.PobsS, PresidPct: (PmeasS === null) ? null : (PmeasS / s.PobsS - 1) * 100,
    eProxy: r.eProxy, eObs: s.e, rMinMeas: r.rMin, rMaxMeas: r.rMax, steps: r.steps,
    periSubHits: r.periSubHits, periSubSteps: r.periSubSteps,
    costRatio: r.steps > 0 ? (r.steps - r.periSubHits + r.periSubSteps) / r.steps : null,
    nan: r.nan, clamp: r.clamp, warn: r.meta.warn, warnMsgs: r.meta.warnMsgs,
    framePrec: r.framePrec, meta: r.meta, wallSec: (Date.now() - t0) / 1000 };
  console.error(`  ${EMOJI[id]} ${id} [${tag}] dt=${dt} → Δϖ=${adv} °/周 (残差 ${row.residPct === null ? 'unmeasured' : row.residPct.toFixed(3) + '%'})`
    + ` P=${PmeasS === null ? '—' : PmeasS.toFixed(3)}s (${row.PresidPct === null ? '—' : row.PresidPct.toFixed(4) + '%'})`
    + ` 近点${r.A.found} cost×${row.costRatio === null ? 1 : row.costRatio.toFixed(2)} [${row.wallSec.toFixed(1)}s]`);
  return row;
};

// ============================================================ EPS: ε_num 3 段 + periSubsteps
if (want('eps')) {
  const IDS = ['psrDoubleABDFM', 'psrJ1757DFM', 'psrJ1946DFM', 'psrB1534DFM',
    'psrDoubleABCF', 'psrJ1757CF', 'psrJ1946CF', 'psrB1534CF'];
  const DTS = FAST ? [DT0, DT0 / 2] : [DT0, DT0 / 2, DT0 / 4];
  // periSubsteps の段。**rMul は宣言であって系ごとに合わせない**:
  //   rMul=1.05 … 近点のごく近傍だけを細分する(4 系とも実効デューティ比が小さい「本来の使い方」)
  //   rMul=1.5  … 広いゲート(e が小さい系では**軌道全域**が細分され、一様細分と同じになる — その退化も測る)
  const PS = FAST ? [{ n: 4, rMul: 1.05 }, { n: 8, rMul: 1.05 }]
    : [{ n: 4, rMul: 1.05 }, { n: 8, rMul: 1.05 }, { n: 4, rMul: 1.5 }];
  const rows = [];
  for (const id of IDS) {
    for (const dt of DTS) rows.push(await runRow(id, dt, null, 'uniform'));
    // 近点半径 r_peri は**宣言する**(periSubsteps.rPeri)。値は同じ系の既定 dt 一様走行の実測 r_min で、
    // 合わせ込みノブではなく「どこを近点近傍と呼ぶか」の宣言である(engine の auto は走行中の最小値)。
    const rPeri = rows.find((r) => r.id === id && r.tag === 'uniform' && r.dt === DT0).rMinMeas;
    for (const ps of PS) rows.push(await runRow(id, DT0, { periSubsteps: { ...ps, rPeri } },
      `peri n=${ps.n} rMul=${ps.rMul}`));
  }
  // ⚡ psrDoubleABDFM だけは **framePrecision が native(single)** のままなので、引きずり場の
  // 数値床(第246便 D2 → 第247便a)が残っている。数値床を外した対照(⚡+framePrecision:"double")を
  // 同じ器で 3 段測り、「収束しないのは処方ではなく場の精度」を分けて読めるようにする。
  for (const dt of DTS) rows.push(await runRow('psrDoubleABDFM', dt, { framePrecision: 'double' }, 'uniform+fpDouble'));
  // p_obs と ε_num(一様細分 3 段から)
  const conv = [];
  for (const key of IDS.concat(['psrDoubleABDFM|fpDouble'])) {
    const id = key.split('|')[0], tag = key.indexOf('|') > 0 ? 'uniform+fpDouble' : 'uniform';
    const sel = DTS.map((dt) => rows.find((r) => r.id === id && r.tag === tag && r.dt === dt));
    if (sel.some((r) => !r || r.advA === null)) { conv.push({ id, key, tag, emoji: EMOJI[id], unmeasured: true }); continue; }
    const [q1, q2, q3] = sel.map((r) => r.advA);
    const d1 = q1 - q2, d2 = (q3 !== undefined) ? q2 - q3 : null;
    const pObs = (d2 !== null && d2 !== 0) ? Math.log2(Math.abs(d1 / d2)) : null;
    const epsNum = (q3 !== undefined) ? Math.abs(q1 - q3) : Math.abs(q1 - q2);
    const obs = sel[0].obsDegPerOrbit;
    // 一次外挿(観測次数 p_obs を使った Richardson: Q* = Q_{h/4} + (Q_{h/4}−Q_{h/2})/(2^p−1))
    const rich = (pObs !== null && Math.pow(2, pObs) !== 1) ? q3 + (q3 - q2) / (Math.pow(2, pObs) - 1) : null;
    conv.push({ id, key, tag, emoji: EMOJI[id], dts: DTS, Q: sel.map((r) => r.advA),
      residPct: sel.map((r) => r.residPct), pObs, epsNum,
      epsNumPctOfObs: obs ? epsNum / Math.abs(obs) * 100 : null,
      richardson: rich, richardsonResidPct: (rich !== null && obs) ? (rich / obs - 1) * 100 : null,
      PmeasS: sel.map((r) => r.PmeasS), PresidPct: sel.map((r) => r.PresidPct) });
  }
  out.eps = { rows, conv,
    note: 'p_obs=log₂|(Q_h−Q_{h/2})/(Q_{h/2}−Q_{h/4})| / ε_num=|Q_h−Q_{h/4}| / '
      + 'costRatio=(実際に踏んだサブステップを含む総步数)/(外側ステップ数)' };
}

// ============================================================ AB: λ_PN=1/f 対 案K(既定 dt)
if (want('ab')) {
  const PAIRS = [
    { sys: 'doubleAB', dfm: 'psrDoubleABDFM', pn: 'psrDoubleABPN', cf: 'psrDoubleABCF' },
    { sys: 'j1757', dfm: 'psrJ1757DFM', pn: 'psrJ1757PN', cf: 'psrJ1757CF' },
    { sys: 'j1946', dfm: 'psrJ1946DFM', pn: 'psrJ1946PN', cf: 'psrJ1946CF' },
    { sys: 'b1534', dfm: 'psrB1534DFM', pn: null, cf: 'psrB1534CF' },   // B1534 に λ_PN=1/f 版は無い
  ];
  const rows = [];
  for (const p of PAIRS) for (const kind of ['dfm', 'pn', 'cf']) {
    const id = p[kind]; if (!id) continue;
    const a = await runRow(id, DT0, null, 'AB uniform'); a.kind = kind; rows.push(a);
    const b = await runRow(id, DT0, { periSubsteps: { n: 4, rMul: 1.05, rPeri: a.rMinMeas } },
      'AB peri n=4 rMul=1.05'); b.kind = kind; rows.push(b);
  }
  out.ab = { rows, note: '既定 dt=0.016・窓 20 近点。kind: dfm=処方なし(2 倍の基線)/ pn=λ_PN=1/f / cf=案K compactForce' };
}

// ============================================================ REF: 参照積分器 1 点(⚡ の kF0 セクタ)
if (want('ref')) {
  // ---- (1) エンジン側: ⚡ を kFrame=0 に**だけ**差し替えて h/4 で回す
  const engRows = [];
  for (const dt of (FAST ? [DT0, DT0 / 2] : [DT0, DT0 / 2, DT0 / 4])) {
    engRows.push(await runRow('psrDoubleABDFM', dt, { kFrame: 0 }, 'ref kF0 engine'));
  }
  const engPeri = await runRow('psrDoubleABDFM', DT0,
    { kFrame: 0, periSubsteps: { n: 8, rMul: 1.05, rPeri: engRows[0].rMinMeas } }, 'ref kF0 peri n=8');
  // ---- (2) 参照側: エンジンを 1 度も呼ばない Float64 RK4(このファイルの中だけで閉じる)
  //   写している式(beta/index.html の対ループから逐語転記):
  //     W=√(d²+ε²) 、fg=G/W³ 、a_i^N = −fg·m_j·(r_i−r_j)
  //     a_i^{1PN} = (λ/c²)[ (cB|v_i|² − cA·U_j)·∇U_i − cA(∇U_i·v_i)·v_i ] 、cA=1+2α 、cB=α−½ 、U_j=G m_j/W
  //     geoPN=2 の対反作用: a_j −= a_i^{1PN}·m_i/m_j(自由源のみ)
  //   kFrame=0 では w=v が厳密に成り立つので、これが ⚡ の kF0 セクタの**閉じた ODE** である。
  const sysDecl = await pg.evaluate(() => {
    const p = HP.allPresets().find((q) => q.id === 'psrDoubleABDFM');
    return { bodies: p.bodies.map((b) => ({ m: b.m, x: b.x, y: b.y, vx: b.vx, vy: b.vy, radius: b.radius })),
      physics: p.physics };
  });
  const P = sysDecl.physics, B0 = sysDecl.bodies;
  const Gc = P.G, cL = P.cLight, eps2 = P.softening * P.softening;
  const lam = (P.lambdaPN !== undefined) ? P.lambdaPN : 1, pnA = (P.pnAlpha !== undefined) ? P.pnAlpha : 1.5;
  const invC2 = lam / (cL * cL), cA = 1 + 2 * pnA, cB = pnA - 0.5;
  const m0 = B0[0].m, m1 = B0[1].m;
  // **割り当てゼロ**の RK4(19M 步級を回すため、状態は 8 つのスカラで持ち、加速度は共有バッファへ書く)
  const AC = new Float64Array(8);
  const accel = (x0, y0, x1, y1, u0, w0, u1, w1) => {
    const dx = x0 - x1, dy = y0 - y1;
    const d2 = dx * dx + dy * dy;
    const invW = 1 / Math.sqrt(d2 + eps2), fg = Gc * invW * invW * invW;
    let a0x = -fg * m1 * dx, a0y = -fg * m1 * dy;
    let a1x = fg * m0 * dx, a1y = fg * m0 * dy;
    {   // 1PN: 源 j=1 → i=0(エンジンの対ループと同じ式・同じ順)
      const Uj = Gc * m1 * invW, gux = -fg * m1 * dx, guy = -fg * m1 * dy;
      const v2 = u0 * u0 + w0 * w0, dU = gux * u0 + guy * w0;
      const pnx = invC2 * ((cB * v2 - cA * Uj) * gux - cA * dU * u0);
      const pny = invC2 * ((cB * v2 - cA * Uj) * guy - cA * dU * w0);
      a0x += pnx; a0y += pny; a1x -= pnx * m0 / m1; a1y -= pny * m0 / m1;
    }
    {   // 1PN: 源 i=0 → j=1
      const Ui = Gc * m0 * invW, gux = fg * m0 * dx, guy = fg * m0 * dy;
      const v2 = u1 * u1 + w1 * w1, dU = gux * u1 + guy * w1;
      const pnx = invC2 * ((cB * v2 - cA * Ui) * gux - cA * dU * u1);
      const pny = invC2 * ((cB * v2 - cA * Ui) * guy - cA * dU * w1);
      a1x += pnx; a1y += pny; a0x -= pnx * m1 / m0; a0y -= pny * m1 / m0;
    }
    AC[0] = u0; AC[1] = w0; AC[2] = u1; AC[3] = w1;
    AC[4] = a0x; AC[5] = a0y; AC[6] = a1x; AC[7] = a1y;
  };
  const S8 = new Float64Array(8), K1 = new Float64Array(8), K2 = new Float64Array(8),
    K3 = new Float64Array(8), K4 = new Float64Array(8), TMP = new Float64Array(8);
  const rk4 = (h) => {
    accel(S8[0], S8[1], S8[2], S8[3], S8[4], S8[5], S8[6], S8[7]); K1.set(AC);
    for (let i = 0; i < 8; i++) TMP[i] = S8[i] + 0.5 * h * K1[i];
    accel(TMP[0], TMP[1], TMP[2], TMP[3], TMP[4], TMP[5], TMP[6], TMP[7]); K2.set(AC);
    for (let i = 0; i < 8; i++) TMP[i] = S8[i] + 0.5 * h * K2[i];
    accel(TMP[0], TMP[1], TMP[2], TMP[3], TMP[4], TMP[5], TMP[6], TMP[7]); K3.set(AC);
    for (let i = 0; i < 8; i++) TMP[i] = S8[i] + h * K3[i];
    accel(TMP[0], TMP[1], TMP[2], TMP[3], TMP[4], TMP[5], TMP[6], TMP[7]); K4.set(AC);
    for (let i = 0; i < 8; i++) S8[i] += h / 6 * (K1[i] + 2 * K2[i] + 2 * K3[i] + K4[i]);
  };
  const refRun = (h, orbits, Pu) => {
    S8[0] = B0[0].x; S8[1] = B0[0].y; S8[2] = B0[1].x; S8[3] = B0[1].y;
    S8[4] = B0[0].vx; S8[5] = B0[0].vy; S8[6] = B0[1].vx; S8[7] = B0[1].vy;
    const steps = Math.round(orbits * Pu / h);
    const A = [];
    let rd1 = 0, rMin = Infinity, rMax = -Infinity, t1 = 0;
    for (let k = 0; k < steps; k++) {
      rk4(h);
      const s = S8;
      const dx = s[2] - s[0], dy = s[3] - s[1];
      const rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
      const dvx = s[6] - s[4], dvy = s[7] - s[5];
      const rd = (dx * dvx + dy * dvy) / rr;
      if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr;
      if (k >= 1 && rd1 < 0 && rd >= 0) {
        const fr = (rd !== rd1) ? (-rd1 / (rd - rd1)) : 0;
        let a1 = t1, a2 = th; while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI; while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
        A.push({ ang: a1 + fr * (a2 - a1), k: k - 1 + fr, r: rr });
      }
      t1 = th; rd1 = rd;
    }
    const mid = 0.5 * (rMin + rMax);
    const keep = A.filter((p) => p.r < mid);
    if (keep.length < NWIN) return { unmeasured: true, found: keep.length };
    // 参照側も同じ柵(一周に近点 1 つ)を掛ける。参照周期は**検出間隔の中央値**から取る
    // (エンジン側の pRefUsed と同じ趣旨 — 観測周期を渡さない)
    {
      const gaps = []; for (let i = 1; i < keep.length; i++) gaps.push(keep[i].k - keep[i - 1].k);
      gaps.sort((a, b) => a - b);
      const med = gaps.length ? gaps[gaps.length >> 1] * h : 0;
      if (med > 0) { const kp = [keep[0]];
        for (let i = 1; i < keep.length; i++) if ((keep[i].k - kp[kp.length - 1].k) * h >= 0.5 * med) kp.push(keep[i]);
        keep.length = 0; keep.push(...kp); }
      if (keep.length < NWIN) return { unmeasured: true, found: keep.length };
    }
    const use = keep.slice(0, NWIN), ang = [];
    for (let i = 0; i < use.length; i++) {
      let a = use[i].ang;
      if (i) { let z = a - ang[i - 1]; while (z > Math.PI) z -= 2 * Math.PI; while (z < -Math.PI) z += 2 * Math.PI; a = ang[i - 1] + z; }
      ang.push(a);
    }
    const n = ang.length, mx = (n - 1) / 2, my = ang.reduce((a, b) => a + b, 0) / n;
    let sxy = 0, sxx = 0;
    for (let i = 0; i < n; i++) { sxy += (i - mx) * (ang[i] - my); sxx += (i - mx) * (i - mx); }
    const slope = sxy / sxx;
    return { unmeasured: false, found: keep.length, nPeri: n, h, steps,
      slopeDeg: slope * 180 / Math.PI, perMean: (use[n - 1].k - use[0].k) * h / (n - 1),
      rMin, rMax, eProxy: (rMax - rMin) / (rMax + rMin) };
  };
  // ---- (2a) **転写検査**: 参照の力則がエンジンの kF0 セクタと同じ式かを機械で確かめる。
  //   エンジンを 20 步(既定の semi-implicit Euler・dt=0.016)進めた状態と、同じ初期条件から
  //   ハーネス側 Float64 で同じ積分器を回した状態を比べる(**参照 RK4 と同じ accel を使う**)。
  const tc = await pg.evaluate(() => {
    const pd = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === 'psrDoubleABDFM')));
    pd.physics.kFrame = 0; delete pd.massCalibration;
    const v = HP.validatePreset(pd); const S = HP.sim; S.build(v.preset);
    const s0 = { x: [S.x[0], S.x[1]], y: [S.y[0], S.y[1]], vx: [S.vx[0], S.vx[1]], vy: [S.vy[0], S.vy[1]] };
    for (let k = 0; k < 20; k++) S.step(0.016);
    return { s0, s1: { x: [S.x[0], S.x[1]], y: [S.y[0], S.y[1]], vx: [S.vx[0], S.vx[1]], vy: [S.vy[0], S.vy[1]] } };
  });
  {
    S8[0] = tc.s0.x[0]; S8[1] = tc.s0.y[0]; S8[2] = tc.s0.x[1]; S8[3] = tc.s0.y[1];
    S8[4] = tc.s0.vx[0]; S8[5] = tc.s0.vy[0]; S8[6] = tc.s0.vx[1]; S8[7] = tc.s0.vy[1];
    for (let k = 0; k < 20; k++) {
      accel(S8[0], S8[1], S8[2], S8[3], S8[4], S8[5], S8[6], S8[7]);
      S8[4] += AC[4] * DT0; S8[5] += AC[5] * DT0; S8[6] += AC[6] * DT0; S8[7] += AC[7] * DT0;
      S8[0] += S8[4] * DT0; S8[1] += S8[5] * DT0; S8[2] += S8[6] * DT0; S8[3] += S8[7] * DT0;
    }
    const rel = (a, b) => Math.abs(a - b) / Math.max(1e-30, Math.abs(b));
    out._tc = { steps: 20, dt: DT0,
      relMax: Math.max(rel(S8[0], tc.s1.x[0]), rel(S8[1], tc.s1.y[0]), rel(S8[2], tc.s1.x[1]),
        rel(S8[3], tc.s1.y[1]), rel(S8[4], tc.s1.vx[0]), rel(S8[7], tc.s1.vy[1])),
      engine: tc.s1, harness: { x: [S8[0], S8[2]], y: [S8[1], S8[3]], vx: [S8[4], S8[6]], vy: [S8[5], S8[7]] } };
    console.error(`  REF 転写検査(同じ積分器で 20 步): 最大相対差 ${out._tc.relMax.toExponential(2)}`);
  }
  const Pu = SYS.doubleAB.Pu;
  const t0 = Date.now();
  const refA = refRun(DT0 / 16, ORBITS, Pu);
  const refB = FAST ? null : refRun(DT0 / 32, ORBITS, Pu);
  console.error(`  REF RK4 h/16 → Δϖ=${refA.slopeDeg} °/周  [${((Date.now() - t0) / 1000).toFixed(1)}s]`);
  if (refB) console.error(`  REF RK4 h/32 → Δϖ=${refB.slopeDeg} °/周`);
  // 参照自身の自己収束(h/16 対 h/32)
  const eng = engRows[engRows.length - 1];
  engRows.push(engPeri);
  out.ref = {
    scope: '⚡ psrDoubleABDFM の **kFrame=0 セクタ**(E4 ソフト重力 + E12 測地線1PN)。'
      + '⚡ の既定は kFrame=1 で、引きずり(A8/E6′・pull 重み・輸送・pairReduced 反作用)は**参照に入っていない** — '
      + 'したがって比較はエンジン側も kFrame=0 に差し替えた対照の上で行う(限界の宣言)。',
    engine: engRows.map((r) => ({ tag: r.tag, dt: r.dt, patch: r.patch, advA: r.advA, advB: r.advB,
      PmeasS: r.PmeasS, eProxy: r.eProxy, costRatio: r.costRatio,
      nPeri: r.nPeriA, nan: r.nan, clamp: r.clamp })),
    reference: { integrator: 'RK4(Float64・このハーネス内で閉じる。エンジンを 1 度も呼ばない)',
      h16: refA, h32: refB,
      selfConvDeg: (refB && !refA.unmeasured && !refB.unmeasured) ? Math.abs(refA.slopeDeg - refB.slopeDeg) : null },
    compare: (eng && eng.advA !== null && !refA.unmeasured) ? {
      engineDt: eng.dt, engineAdvDeg: eng.advA, refAdvDeg: refA.slopeDeg,
      diffDeg: eng.advA - refA.slopeDeg,
      diffPct: (eng.advA / refA.slopeDeg - 1) * 100,
      enginePeriodS: eng.PmeasS, refPeriodS: refA.perMean * SYS.doubleAB.Tunit,
      periodDiffPct: (eng.PmeasS !== null) ? (eng.PmeasS / (refA.perMean * SYS.doubleAB.Tunit) - 1) * 100 : null,
    } : null,
    transcriptionCheck: out._tc,
    model: { G: Gc, cLight: cL, softening: P.softening, lambdaPN: lam, pnAlpha: pnA, kFrame: 0,
      masses: [m0, m1],
      formula: 'W=√(d²+ε²) / fg=G/W³ / a_i^N=−fg·m_j·(r_i−r_j) / '
        + 'a_i^{1PN}=(λ/c²)[(cB|v_i|²−cA·U_j)∇U_i − cA(∇U_i·v_i)v_i], cA=1+2α, cB=α−½, U_j=G·m_j/W / '
        + 'geoPN=2 の対反作用 a_j −= a_i^{1PN}·m_i/m_j' },
  };
  delete out._tc;
}

// ============================================================ BIT: 既定経路 bit 一致
if (want('bit') && BASE) {
  const IDS = ['psrDoubleABDFM', 'psrDoubleABCF', 'psrB1534DFM', 'psrB1534CF', 'plutoCharonReal', 'saturn'];
  const hashRun = async (page, ids) => page.evaluate((ids) => {
    const h = (S) => {
      let a = 0x811c9dc5;
      const buf = new ArrayBuffer(8), f = new Float64Array(buf), u = new Uint8Array(buf);
      const push = (v) => { f[0] = v; for (let b = 0; b < 8; b++) { a ^= u[b]; a = Math.imul(a, 0x01000193) >>> 0; } };
      for (const k of ['x', 'y', 'vx', 'vy', 'spin', 'R', 'm']) { const A = S[k]; if (!A) continue;
        for (let i = 0; i < S.n; i++) push(A[i]); }
      push(S.t); return a.toString(16);
    };
    const o = {};
    for (const id of ids) {
      const p = HP.allPresets().find((q) => q.id === id);
      if (!p) { o[id] = 'NOPRESET'; continue; }
      const v = HP.validatePreset(JSON.parse(JSON.stringify(p)));
      const S = HP.sim; S.build(v.preset);
      for (let k = 0; k < 600; k++) S.step(0.016);
      o[id] = h(S) + '|n=' + S.n + '|nan=' + S.hasNaN();
    }
    return o;
  }, ids);
  const cur = await hashRun(pg, IDS);
  const pg2 = await browser.newPage();
  await pg2.goto('file://' + path.resolve(BASE), { waitUntil: 'load' });
  await pg2.waitForFunction(() => window.HP && HP.sim);
  const base = await hashRun(pg2, IDS);
  await pg2.close();
  const diffs = IDS.filter((id) => cur[id] !== base[id]);
  out.bit = { base: BASE, steps: 600, dt: DT0, ids: IDS, cur, baseHash: base, allIdentical: diffs.length === 0, diffs };
  console.error(`  BIT 既定経路 600 步 bit 一致 = ${diffs.length === 0}${diffs.length ? ' 差=' + diffs.join(',') : ''}`);
}

out.pageErrors = pageErrors;
await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error('[w252b] → ' + path.relative(ROOT, OUT));

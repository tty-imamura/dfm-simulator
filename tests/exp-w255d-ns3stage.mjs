// 第255便d(第47報 N8/N6c)「NS 4 系(⚡🧮🩺🧶)の dt 3 段門 —— 数値収束の門と観測一致の門を分ける」。
//
// 第47報の 3 審査 v13 は 2 つを求めた。**N8**「NS 4 系だけ h, h/2, h/4 の 3 段+正の次数で門を通す
// (現行力則・spaceMesh 未宣言・恒星 4 量は保留)」。**N6c**「native 17 本の一括 double 化はしない ——
// 系ごとに p_obs 検定(20 近点・3 段)を回し、負なら double を宣言する」。
// 本ハーネスは**その検定そのもの**である。**予想は書かない**・**合否を先に決めない**。
//
// ■ 何を測るか(器は第252便b `exp-w252b-substep.mjs` と第254便d `exp-w254d-psrdouble.mjs` の流用)
//   STAGE3: 4 系 × {native(宣言を外した一時コピー)/ double(本体の宣言のまま)} × dt{h, h/2, h/4}
//           × 検出器 A(ṙ の −→+ 交差)/ B(距離極小の放物線頂点)。窓は**最初の 20 近点(19 区間)**。
//           出す量は Δϖ[°/周]・近点間 P[s]・e(半径比 proxy)の 3 つで、それぞれ
//             p_obs = log₂|(Q_h−Q_{h/2})/(Q_{h/2}−Q_{h/4})| 、 ε_num = |Q_h − Q_{h/4}|
//           を出す(第252便b ③ と同じ定義)。**生の近点検出数**(柵の前の近点側候補)と
//           **柵が捨てた数**(=偽検出)も同じ走行から出す —— 第254便d ③ の「native は dt を
//           細かくするほど偽検出が増える」を 4 系で検定するため。
//   GATE  : 収束の門(3 段が揃い p_obs>0)と観測一致の門(DFM/観測比・残差)を**別の欄**に出す。
//           収束しても比が ~2 なら「数値未解決 → 観測不一致」へ動くだけである、を機械で示す。
//
// **エンジンの物理はハーネスから 1 bit も書き換えない**(preset の `physics` 宣言だけを差し替え、
// `massCalibration` を外す — 第249便a/第252便b と同じ)。bodies・claims は触らない。
//
// 実行: node tests/exp-w255d-ns3stage.mjs [--sys psrDoubleABDFM,...] [--fast]
//       --sys  … 系を絞って走らせる(結果 JSON へ**併合**される — 4 系を別プロセスで回すため)
//       --fast … dt/4 段を省き走行を 6.5 公転へ(窓 20 近点は埋まらない = unmeasured になる)
// 出力: tests/out/ns3stage-w255.json(数値は docs/PHYSICS.md〔第255便d〕へ全載)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'ns3stage-w255.json');
const argv = process.argv.slice(2);
const FAST = argv.includes('--fast');
const SYS_ONLY = (() => { const i = argv.indexOf('--sys'); return (i >= 0 && argv[i + 1]) ? argv[i + 1].split(',') : null; })();

const DT0 = 0.016;            // アプリ既定(index.html の const DT)
const NWIN = 20;              // **窓 = 最初の 20 近点(19 区間)**(第252便b の統一宣言)
const YR = 365.25 * 86400;    // ユリウス年
const ORBITS = FAST ? 6.5 : 21.5;

// ---------------------------------------------------------------- 観測レコード(CSV が正本)
// paper/data/solar-observations.csv の**最初の行**を採る(calaudit・第252便b と同じ規約)。
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
    m.set(key, { v: Number(cols[2]), unit: cols[3], source: cols[4], sigma: cols[8] });
  }
  return m;
}
const CSV = loadObs();
const SYS = {
  psrDoubleABDFM: { emoji: '⚡', body: 'PSR J0737-3039 B', label: '⚡ J0737−3039A/B', Tunit: 10,
    omegaDotFallback: 16.899323,
    omegaDotFrom: 'tests/exp-w249a.mjs(第249便a の転写 — CSV に periastron_advance 行が無い)' },
  psrJ1757DFM: { emoji: '🧮', body: 'PSR J1757-1854', label: '🧮 J1757−1854', Tunit: 10 },
  psrJ1946DFM: { emoji: '🩺', body: 'PSR J1946+2052', label: '🩺 J1946+2052', Tunit: 10 },
  psrB1534DFM: { emoji: '🧶', body: 'PSR B1534+12', label: '🧶 B1534+12', Tunit: 10 },
};
for (const k of Object.keys(SYS)) {
  const s = SYS[k];
  const P = CSV.get(s.body + '|orbital_period'), e = CSV.get(s.body + '|eccentricity');
  const w = CSV.get(s.body + '|periastron_advance');
  s.PobsS = (P && P.unit === 's') ? P.v : (P ? P.v * 86400 : null);
  s.PobsSigmaS = (P && P.sigma && P.sigma.trim() !== '')
    ? (P.unit === 's' ? Number(P.sigma) : Number(P.sigma) * 86400) : null;
  s.eObs = e ? e.v : null;
  s.omegaDot = w ? w.v : s.omegaDotFallback;
  s.omegaDotFrom = w ? w.source : s.omegaDotFrom;
  s.obsDegPerOrbit = (s.omegaDot !== undefined && s.PobsS) ? s.omegaDot * s.PobsS / YR : null;
  s.Pu = s.PobsS / s.Tunit;
}
const IDS = (SYS_ONLY || Object.keys(SYS)).filter((id) => SYS[id]);

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

// ---------------------------------------------------------------- ページ側の測定ライブラリ
// 近点検出器 A/B・柵・直線 fit はすべて第252便b/第254便d と**同一手続き**(窓は引数)。
await pg.evaluate(() => {
  const W = (window.__w255d = {});
  // physics の宣言だけを差し替えて build する('__delete' で鍵を外す)。massCalibration は外す。
  W.build = (id, patch) => {
    const pd = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === id)));
    if (patch) for (const k of Object.keys(patch)) {
      if (patch[k] === '__delete') delete pd.physics[k]; else pd.physics[k] = patch[k];
    }
    delete pd.massCalibration;   // 台帳の三者一致検査を実験へ持ち込まない(第249便a と同じ)
    const v = HP.validatePreset(pd);
    HP.sim.build(v.preset);
    return { warn: (v.warnings || []).length, warnMsgs: (v.warnings || []).slice(0, 2),
      fpDecl: v.preset.physics.framePrecision || null, framePrec: HP.sim.framePrec || null,
      kFrame: HP.sim.params.kFrame, lambdaPN: HP.sim.params.lambdaPN, n: HP.sim.n };
  };
  W.fit = (raw, rMin, rMax, pRef, dt, nWin) => {
    const mid = 0.5 * (rMin + rMax);
    const peri = raw.filter((p) => p.r < mid);
    const rej = { apo: raw.length - peri.length, dup: 0, jump: 0 };
    const keep = [];
    for (const p of peri) {
      if (keep.length && (p.k - keep[keep.length - 1].k) * dt < 0.5 * pRef) { rej.dup++; continue; }
      keep.push(p);
    }
    const found = keep.length;
    const base = { cand: peri.length, found, rej };   // cand = 柵の前の近点側候補(= 生検出)
    if (found < nWin) return Object.assign(base, { nPeri: found, unmeasured: true,
      slopeDeg: null, residDeg: null, perMean: null });
    const use = keep.slice(0, nWin), ang = [];
    for (let i = 0; i < use.length; i++) {
      let a = use[i].ang;
      if (i) { let z = a - ang[i - 1]; while (z > Math.PI) z -= 2 * Math.PI; while (z < -Math.PI) z += 2 * Math.PI;
        if (Math.abs(z) > Math.PI / 2) { rej.jump++; break; }
        a = ang[i - 1] + z; }
      ang.push(a);
    }
    const n = ang.length;
    if (n < nWin) return Object.assign(base, { nPeri: n, unmeasured: true,
      slopeDeg: null, residDeg: null, perMean: null });
    const mx = (n - 1) / 2, my = ang.reduce((a, b) => a + b, 0) / n;
    let sxy = 0, sxx = 0;
    for (let i = 0; i < n; i++) { sxy += (i - mx) * (ang[i] - my); sxx += (i - mx) * (i - mx); }
    const slope = sxy / sxx;
    const resid = Math.sqrt(ang.reduce((s, a, i) => s + (a - (my + slope * (i - mx))) ** 2, 0) / n);
    return Object.assign(base, { nPeri: n, unmeasured: false,
      slopeDeg: slope * 180 / Math.PI, residDeg: resid * 180 / Math.PI,
      perMean: (use[nWin - 1].k - use[0].k) * dt / (nWin - 1), perN: nWin - 1 });
  };
  W.win = (dt, tEnd, pRef, nWin) => {
    const S = HP.sim;
    const steps = Math.round(tEnd / dt);
    const A = [], Bd = [], sid = [];
    let r2 = 0, r1 = 0, t2 = 0, t1 = 0, rd1 = 0, rMin = Infinity, rMax = -Infinity;
    let acc = 0, accPrev = 0, thPrev = null, nTurn = 0;
    const T0 = S.totals(), L0 = T0.L + S.resL + S.radL;
    const ep0x = T0.px + S.resPx, ep0y = T0.py + S.resPy;
    const pScale = S.m[0] * Math.hypot(S.vx[0], S.vy[0]) + S.m[1] * Math.hypot(S.vx[1], S.vy[1]);
    const mt = S.m[0] + S.m[1];
    const com = () => [(S.m[0] * S.x[0] + S.m[1] * S.x[1]) / mt, (S.m[0] * S.y[0] + S.m[1] * S.y[1]) / mt];
    const c0 = com();
    const clamp0 = (S.clampVN || 0) + (S.clampSN || 0) + (S.clampRN || 0) + (S.clampTN || 0) + (S.clampAN || 0);
    let comMax = 0, sMax = 0;
    for (let k = 0; k < steps; k++) {
      S.step(dt);
      const dx = S.x[1] - S.x[0], dy = S.y[1] - S.y[0];
      const rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
      const dvx = S.vx[1] - S.vx[0], dvy = S.vy[1] - S.vy[0];
      const rd = (dx * dvx + dy * dvy) / rr;
      if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr;
      const sm = Math.max(Math.abs(S.spin[0]), Math.abs(S.spin[1])); if (sm > sMax) sMax = sm;
      const cc = com(); const cd = Math.hypot(cc[0] - c0[0], cc[1] - c0[1]); if (cd > comMax) comMax = cd;
      if (thPrev !== null) {
        let d = th - thPrev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
        accPrev = acc; acc += d;
        while (Math.abs(acc) >= (nTurn + 1) * 2 * Math.PI) {
          const tgt = Math.sign(acc) * (nTurn + 1) * 2 * Math.PI;
          const fr = (acc !== accPrev) ? (tgt - accPrev) / (acc - accPrev) : 0;
          sid.push((k - 1 + fr) * dt); nTurn++;
        }
      }
      thPrev = th;
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
      if (S.hasNaN()) break;
    }
    // 柵の参照周期は**実測の同方向周期**から取る(第252便b ⑧ — 観測値を器の柵に使わない)
    const sidMean = sid.length > 1 ? (sid[sid.length - 1] - sid[0]) / (sid.length - 1) : null;
    const pUse = (sidMean > 0) ? sidMean : pRef;
    const T1 = S.totals(), L1 = T1.L + S.resL + S.radL;
    return { rMin, rMax, eProxy: (rMax - rMin) / (rMax + rMin),
      A: W.fit(A, rMin, rMax, pUse, dt, nWin), B: W.fit(Bd, rMin, rMax, pUse, dt, nWin),
      rawA: A.length, rawB: Bd.length, pRefUsed: pUse, sidN: sid.length, sidMean,
      comMax, sMax,
      clampD: ((S.clampVN || 0) + (S.clampSN || 0) + (S.clampRN || 0) + (S.clampTN || 0) + (S.clampAN || 0)) - clamp0,
      lRel: Math.abs(L1 - L0) / Math.max(Math.abs(L0), 1e-9),
      pRel: Math.hypot(T1.px + S.resPx - ep0x, T1.py + S.resPy - ep0y) / Math.max(pScale, 1e-9),
      steps, nan: S.hasNaN(), framePrec: S.framePrec || null };
  };
  W.run = (id, fp, dt, orbits, nWin, Pu) => {
    const meta = W.build(id, { framePrecision: fp || '__delete' });
    const o = W.win(dt, orbits * Pu, Pu, nWin);
    o.meta = meta;
    return o;
  };
});

const fx = (z, d = 6) => (z === null || z === undefined || !Number.isFinite(z)) ? '—' : z.toFixed(d);
const ex = (z, d = 4) => (z === null || z === undefined || !Number.isFinite(z)) ? '—' : z.toExponential(d);

// 節ごとに走らせても 1 枚の JSON になるよう、既存の結果へ**上書き併合**する
let prev = {};
if (fs.existsSync(OUT)) { try { prev = JSON.parse(fs.readFileSync(OUT, 'utf8')) || {}; } catch { prev = {}; } }
const out = { ...prev, wave: '第255便d', target: TARGET, node: process.version, at: new Date().toISOString(),
  window: { nPeri: NWIN, nIntervals: NWIN - 1, dt0: DT0, orbits: ORBITS,
    note: '窓 = 最初の 20 近点(19 区間)。20 個に満たなければ unmeasured(他の周期定義へは置換しない)' },
  obs: SYS, fast: FAST,
  note: 'p_obs=log₂|(Q_h−Q_{h/2})/(Q_{h/2}−Q_{h/4})| / ε_num=|Q_h−Q_{h/4}|(第252便b ③ と同じ定義)。'
    + '**収束の門と観測一致の門は別**である(gate.convergence / gate.agreement)。' };
out.rows = (prev.rows || []).filter((r) => !IDS.includes(r.id));
out.conv = (prev.conv || []).filter((r) => !IDS.includes(r.id));

const DTS = FAST ? [DT0, DT0 / 2] : [DT0, DT0 / 2, DT0 / 4];

for (const id of IDS) {
  const s = SYS[id];
  for (const fp of [null, 'double']) for (const dt of DTS) {
    const t0 = Date.now();
    const r = await pg.evaluate(([id, fp, dt, orbits, nWin, Pu]) => window.__w255d.run(id, fp, dt, orbits, nWin, Pu),
      [id, fp, dt, ORBITS, NWIN, s.Pu]);
    const advA = r.A.slopeDeg, advB = r.B.slopeDeg;
    const obs = s.obsDegPerOrbit;
    const row = { id, emoji: s.emoji, fp: fp || 'native', fpDecl: r.meta.fpDecl, framePrec: r.framePrec, dt,
      advA, advB, detDiff: (advA === null || advB === null) ? null : Math.abs(advA - advB),
      detDiffPct: (advA === null || advB === null || advA === 0) ? null : 100 * Math.abs(advA - advB) / Math.abs(advA),
      residPctA: advA === null ? null : (advA / obs - 1) * 100,
      ratioObsA: advA === null ? null : advA / obs,
      ratioObsB: advB === null ? null : advB / obs,
      periPsecA: r.A.perMean === null ? null : r.A.perMean * s.Tunit,
      periPsecB: r.B.perMean === null ? null : r.B.perMean * s.Tunit,
      periPresidPctA: r.A.perMean === null ? null : (r.A.perMean * s.Tunit / s.PobsS - 1) * 100,
      sidPsec: r.sidMean === null ? null : r.sidMean * s.Tunit,
      sidPresidPct: r.sidMean === null ? null : (r.sidMean * s.Tunit / s.PobsS - 1) * 100,
      eProxy: r.eProxy, eResidPct: s.eObs ? (r.eProxy / s.eObs - 1) * 100 : null,
      rMin: r.rMin, rMax: r.rMax,
      // 生の近点検出(柵の前の近点側候補)と柵が捨てた数(= 偽検出)
      candA: r.A.cand, foundA: r.A.found, dupA: r.A.rej.dup, jumpA: r.A.rej.jump,
      candB: r.B.cand, foundB: r.B.found, dupB: r.B.rej.dup, jumpB: r.B.rej.jump,
      rawA: r.rawA, rawB: r.rawB, unmeasuredA: r.A.unmeasured, unmeasuredB: r.B.unmeasured,
      residFitDegA: r.A.residDeg, residFitDegB: r.B.residDeg,
      comMax: r.comMax, sMax: r.sMax, clampD: r.clampD, lRel: r.lRel, pRel: r.pRel,
      sidN: r.sidN, steps: r.steps, nan: r.nan, warn: r.meta.warn, warnMsgs: r.meta.warnMsgs,
      wallSec: (Date.now() - t0) / 1000 };
    out.rows.push(row);
    console.error(`  ${s.emoji} ${id} [${row.fp}] dt=${dt}: Δϖ(A)=${fx(advA, 8)} Δϖ(B)=${fx(advB, 8)} `
      + `比=${fx(row.ratioObsA, 5)} P=${fx(row.periPsecA, 3)}s(${fx(row.periPresidPctA, 4)}%) `
      + `e=${fx(r.eProxy, 7)} 生検出 A/B=${r.A.cand}/${r.B.cand} 柵却下=${r.A.rej.dup}/${r.B.rej.dup} `
      + `[${row.wallSec.toFixed(1)}s]`);
  }

  // ---- 収束(第252便b ③ と同じ定義)。Δϖ(A)・Δϖ(B)・近点間 P(A)・e の 4 量それぞれで出す
  const QS = [['advA', 'Δϖ(A) [°/周]'], ['advB', 'Δϖ(B) [°/周]'], ['periPsecA', '近点間 P(A) [s]'], ['eProxy', 'e(半径比)']];
  for (const fp of ['native', 'double']) {
    const g = DTS.map((dt) => out.rows.find((z) => z.id === id && z.fp === fp && z.dt === dt));
    for (const [key, label] of QS) {
      if (g.length < 3 || g.some((z) => !z || z[key] === null || !Number.isFinite(z[key]))) {
        out.conv.push({ id, emoji: s.emoji, fp, key, label, unmeasured: true }); continue;
      }
      const [q1, q2, q3] = g.map((z) => z[key]);
      const d1 = q1 - q2, d2 = q2 - q3;
      const pObs = (d1 !== 0 && d2 !== 0) ? Math.log2(Math.abs(d1 / d2)) : null;
      const epsNum = Math.abs(q1 - q3);
      const ref = (key === 'advA' || key === 'advB') ? s.obsDegPerOrbit
        : (key === 'periPsecA') ? s.PobsS : s.eObs;
      const rich = (pObs !== null && Math.pow(2, pObs) !== 1) ? q3 + (q3 - q2) / (Math.pow(2, pObs) - 1) : null;
      out.conv.push({ id, emoji: s.emoji, fp, key, label, dts: DTS, Q: [q1, q2, q3],
        pObs, epsNum, epsOverRefPct: (ref ? 100 * epsNum / Math.abs(ref) : null),
        richardson: rich, ref,
        residPct: ref ? g.map((z) => (z[key] / ref - 1) * 100) : null,
        ratio: ref ? g.map((z) => z[key] / ref) : null,
        richardsonRatio: (rich !== null && ref) ? rich / ref : null,
        // **収束の門**(N8): 3 段が揃い、観測次数が正であること。観測一致は別欄。
        gateConvergence: (pObs !== null && pObs > 0) ? 'pass' : 'fail',
        // **観測一致の門**: ε_num が残差より小さいか(= 残差が離散化で説明できないか)
        gateAgreement: (ref && Number.isFinite(q3))
          ? ((Math.abs(q3 - ref) <= epsNum) ? 'within-eps' : 'outside-eps') : null });
    }
  }
  for (const c of out.conv.filter((z) => z.id === id && !z.unmeasured)) {
    console.error(`  収束 ${c.emoji} ${c.fp} ${c.label}: Q=[${c.Q.map((z) => (Math.abs(z) < 1 ? z.toFixed(8) : z.toFixed(4))).join(', ')}] `
      + `p_obs=${fx(c.pObs, 3)} ε_num=${ex(c.epsNum)} (基準の ${fx(c.epsOverRefPct, 3)}%) `
      + `外挿=${c.richardson === null ? '—' : (Math.abs(c.richardson) < 1 ? c.richardson.toFixed(8) : c.richardson.toFixed(4))} `
      + `比=${fx(c.richardsonRatio, 5)} 収束門=${c.gateConvergence} 一致門=${c.gateAgreement}`);
  }
}

out.pageErrors = pageErrors;
await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error('[w255d] → ' + path.relative(ROOT, OUT));
if (pageErrors.length) console.error('[w255d] pageErrors: ' + pageErrors.slice(0, 3).join(' | '));

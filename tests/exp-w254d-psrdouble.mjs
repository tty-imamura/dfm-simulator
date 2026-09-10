// 第254便d(第46報 M2)「⚡ psrDoubleABDFM の framePrecision:"double" 本体化 — 宣言前後の再測」。
//
// 第253便b ⑦ は「⚡ 本体に `framePrecision:"double"` を宣言したらどうなるか」を**乾走だけ**で測り、
// 第46報の 3 審査 v12 M2 が「入れる。ただしカード・claims・同窓較正・QA と**一括で**」とした。
// 本ハーネスはその一括更新に必要な数を**全部実測する器**である。**予想は書かない**。
//
// ■ 何を測るか
//   CARD : obsCard/descStruct/failureFirst/claims が引用している窓(**dt=0.016・4.3 公転**)で
//          native(未宣言)対 `framePrecision:"double"` を並べる。周回時間 [1,2,3 周目]・
//          近点間 P・e・近点 r_min・近点検出数・近点移動 Δϖ・ΔP/P・重心・帳簿 L/P・
//          B コア Ω ドリフト。claims 6 本と QA `behavior.psrDoubleAB` の各条件の合否も両側で出す。
//   WIN20: **窓 20 近点(19 区間)**・dt = h, h/2, h/4(h=0.016)・native/double・検出器 A/B。
//          第252便b ③ と同じ定義で観測次数 p_obs = log₂|(Q_h−Q_{h/2})/(Q_{h/2}−Q_{h/4})| と
//          ε_num = |Q_h − Q_{h/4}| を出す(Q は Δϖ[°/周])。近点間 P・同方向 P も同じ窓で。
//   BIT  : **全内蔵プリセット × 600 步(dt=0.016)** の状態ハッシュを基点 html と突き合わせる。
//          ⚡ は本便で宣言を足すので**差が出るのが正**(意図した 1 本)。他は 1 bit 不変。
//
// **エンジンの物理はハーネスから 1 bit も書き換えない**(preset の `physics` 宣言だけを差し替える)。
// bodies・massCalibration・claims は触らない。新しい力は 1 つも足していない。
//
// 実行: node tests/exp-w254d-psrdouble.mjs [--card] [--win20] [--chi] [--bit --base <file>] [--fast]
// 出力: tests/out/psrdouble-w254.json(.gitignore の既定どおり未コミット — 数値は docs/PHYSICS.md へ全載)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'psrdouble-w254.json');
const argv = process.argv.slice(2);
const FAST = argv.includes('--fast');
const BASE = (() => { const i = argv.indexOf('--base'); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : null; })();
const only = argv.filter((a) => a.startsWith('--') && !['--fast', '--base'].includes(a)).map((a) => a.slice(2));
const want = (k) => only.length ? only.includes(k) : (k !== 'bit');

const ID = 'psrDoubleABDFM';
const DT0 = 0.016;                       // アプリ既定(index.html の const DT)
const NWIN = 20;                         // 窓 = 最初の 20 近点(19 区間)— 第252便b の統一宣言
const P_OBS_S = 8834.534723278;          // 観測周期 [s](Hu et al. 2022)
const TUNIT = 10;                        // 1 単位 = 10 s
const PU = P_OBS_S / TUNIT;              // 観測周期 [単位時間]
const YR = 365.25 * 86400;
const OMEGA_DOT_OBS = 16.899323;         // [°/yr](第249便a の転写 — CSV に行が無い)
const OBS_DEG_PER_ORBIT = OMEGA_DOT_OBS * P_OBS_S / YR;
const ORBITS20 = FAST ? 6.5 : 21.5;      // 20 近点を確実に含む走行長

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
// 近点検出器 A(ṙ の −→+ 交差)/ B(距離極小の放物線頂点)・柵・直線 fit はすべて
// 第252便b `tests/exp-w252b-substep.mjs` と**同一手続き**(窓の宣言だけを引数で受ける)。
await pg.evaluate(() => {
  const W = (window.__w254 = {});
  // physics の宣言だけを差し替えて build する('__delete' で鍵を外す)
  W.build = (id, patch) => {
    const pd = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === id)));
    if (patch) for (const k of Object.keys(patch)) {
      if (patch[k] === '__delete') delete pd.physics[k]; else pd.physics[k] = patch[k];
    }
    const v = HP.validatePreset(pd);
    HP.sim.build(v.preset);
    return { warn: (v.warnings || []).length, fp: v.preset.physics.framePrecision || null,
      framePrec: HP.sim.framePrec || null };
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
    if (found < nWin) return { nPeri: found, found, unmeasured: true, rej, slopeDeg: null, residDeg: null, perMean: null };
    const use = keep.slice(0, nWin), ang = [];
    for (let i = 0; i < use.length; i++) {
      let a = use[i].ang;
      if (i) { let z = a - ang[i - 1]; while (z > Math.PI) z -= 2 * Math.PI; while (z < -Math.PI) z += 2 * Math.PI;
        if (Math.abs(z) > Math.PI / 2) { rej.jump++; break; }
        a = ang[i - 1] + z; }
      ang.push(a);
    }
    const n = ang.length;
    if (n < nWin) return { nPeri: n, found, unmeasured: true, rej, slopeDeg: null, residDeg: null, perMean: null };
    const mx = (n - 1) / 2, my = ang.reduce((a, b) => a + b, 0) / n;
    let sxy = 0, sxx = 0;
    for (let i = 0; i < n; i++) { sxy += (i - mx) * (ang[i] - my); sxx += (i - mx) * (i - mx); }
    const slope = sxy / sxx;
    const resid = Math.sqrt(ang.reduce((s, a, i) => s + (a - (my + slope * (i - mx))) ** 2, 0) / n);
    return { nPeri: n, found, unmeasured: false, rej,
      slopeDeg: slope * 180 / Math.PI, residDeg: resid * 180 / Math.PI,
      perMean: (use[nWin - 1].k - use[0].k) * dt / (nWin - 1), perN: nWin - 1 };
  };
  // 窓 nWin 近点での測定(帳簿・重心・コア Ω も同じ走行から取る)
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
    const clamp0 = S.clampSN || 0;
    let comMax = 0, sMax = 0, omBmax = -Infinity;
    for (let k = 0; k < steps; k++) {
      S.step(dt);
      const dx = S.x[1] - S.x[0], dy = S.y[1] - S.y[0];
      const rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
      const dvx = S.vx[1] - S.vx[0], dvy = S.vy[1] - S.vy[0];
      const rd = (dx * dvx + dy * dvy) / rr;
      if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr;
      const sm = Math.max(Math.abs(S.spin[0]), Math.abs(S.spin[1])); if (sm > sMax) sMax = sm;
      if (S.coreOmV && S.coreOmV[1] > omBmax) omBmax = S.coreOmV[1];
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
      comMax, sMax, clampD: (S.clampSN || 0) - clamp0,
      lRel: Math.abs(L1 - L0) / Math.max(Math.abs(L0), 1e-9),
      pRel: Math.hypot(T1.px + S.resPx - ep0x, T1.py + S.resPy - ep0y) / Math.max(pScale, 1e-9),
      omDriftB: (omBmax / 22.654675 - 1) * 100,
      steps, nan: S.hasNaN(), framePrec: S.framePrec || null };
  };
  W.runWin = (fp, dt, orbits, nWin, Pu) => {
    const meta = W.build('psrDoubleABDFM', { framePrecision: fp || '__delete' });
    const o = W.win(dt, orbits * Pu, Pu, nWin);
    o.meta = meta;
    return o;
  };
  // CARD: obsCard/claims が引用している窓(dt=0.016・4.3 公転)。第253便b ⑦ FPDRY と同一手続き。
  W.card = (fp) => {
    const meta = W.build('psrDoubleABDFM', { framePrecision: fp || '__delete' });
    const S = HP.sim;
    const P_OBS = 883.4534723278;
    const clamp0 = S.clampSN || 0;
    const T0 = S.totals(); const L0 = T0.L + S.resL + S.radL;
    const mt = S.m[0] + S.m[1];
    const com = () => ({ x: (S.m[0] * S.x[0] + S.m[1] * S.x[1]) / mt, y: (S.m[0] * S.y[0] + S.m[1] * S.y[1]) / mt });
    const c0 = com(); const ep0x = T0.px + S.resPx, ep0y = T0.py + S.resPy;
    const pScale = S.m[0] * Math.hypot(S.vx[0], S.vy[0]) + S.m[1] * Math.hypot(S.vx[1], S.vy[1]);
    const OM_B = 22.654675;
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
    const perT = []; for (let i = 1; i < periAngs.length; i++) perT.push(periAngs[i][0] - periAngs[i - 1][0]);
    const periMean = perT.length ? perT.reduce((a, b) => a + b, 0) / perT.length : null;
    const T1 = S.totals(); const L1 = T1.L + S.resL + S.radL;
    return {
      fp: meta.fp || 'native(未宣言)', framePrec: meta.framePrec,
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
});

const fx = (z, d = 6) => (z === null || z === undefined || !Number.isFinite(z)) ? '—' : z.toFixed(d);
const ex = (z, d = 4) => (z === null || z === undefined || !Number.isFinite(z)) ? '—' : z.toExponential(d);

// 節ごとに走らせても 1 枚の JSON になるよう、既存の結果へ**上書き併合**する
let prev = {};
if (fs.existsSync(OUT)) { try { prev = JSON.parse(fs.readFileSync(OUT, 'utf8')) || {}; } catch { prev = {}; } }
const out = { ...prev, wave: '第254便d', target: TARGET, node: process.version, at: new Date().toISOString(),
  window: { nPeri: NWIN, nIntervals: NWIN - 1, dt0: DT0, orbits: ORBITS20,
    note: '窓 = 最初の 20 近点(19 区間)。CARD 節だけは obsCard/claims が引用している 4.3 公転窓。' },
  obs: { PobsS: P_OBS_S, omegaDotDegPerYr: OMEGA_DOT_OBS, obsDegPerOrbit: OBS_DEG_PER_ORBIT,
    omegaDotFrom: 'tests/exp-w249a.mjs(第249便a の転写 — CSV に periastron_advance 行が無い)' },
  fast: FAST };

// ============================================================ CARD
if (want('card')) {
  console.error('[w254d] CARD: dt=0.016・4.3 公転(obsCard/claims の窓)— native 対 double');
  const nat = await pg.evaluate(() => window.__w254.card(null));
  const dbl = await pg.evaluate(() => window.__w254.card('double'));
  const judge = (r) => ({
    'claims:period-fit(2周目 秒 ∈ [8790,8880])': r.rev2Sec !== null && r.rev2Sec >= 8790 && r.rev2Sec <= 8880,
    'claims:shape-unfitted(e ∈ [0.085,0.0905])': r.e1 !== null && r.e1 >= 0.085 && r.e1 <= 0.0905,
    'claims:periastron-advance(Δϖ ∈ [0.005,0.02])': r.dPeri !== null && r.dPeri >= 0.005 && r.dPeri <= 0.02,
    'claims:shell-spin-held(ドリフト ∈ [0,0.001]%)': r.sMax === 0,
    'claims:period-decay(ΔP/P ∈ [0.05,0.2]%)': r.decPct !== null && r.decPct >= 0.05 && r.decPct <= 0.2,
    'claims:core-spin-transcribed(Ω ドリフト ∈ [0,2]%)': r.omDriftB >= 0 && r.omDriftB <= 2,
    'QA:p2/P_obs−1 <1.2%': r.rev2Sec !== null && Math.abs(r.rev2Sec / (r.P_OBS * 10) - 1) < 0.012,
    'QA:|e−0.087977| <0.002': r.e1 !== null && Math.abs(r.e1 - 0.087977) < 0.002,
    'QA:|rmin/801.37−1| <1%': r.rmin1 !== null && Math.abs(r.rmin1 / 801.37 - 1) < 0.01,
    'QA:Δϖ ∈ [0.005,0.02]': r.dPeri !== null && r.dPeri >= 0.005 && r.dPeri <= 0.02,
    'QA:殻 spin 0・clampSN 0': r.sMax === 0 && r.clampD === 0,
    'QA:ΔP/P ∈ [0.05,0.2] かつ 次周も同窓': r.decPct >= 0.05 && r.decPct <= 0.2 && r.decPct2 >= 0.05 && r.decPct2 <= 0.2,
    'QA:帳簿 L<1e−8・P<1e−8・重心<0.01': r.lRel < 1e-8 && r.pRel < 1e-8 && r.comMax < 0.01,
    'QA:B コア Ω ドリフト ∈ [0,2]%': r.omDriftB >= 0 && r.omDriftB <= 2,
  });
  out.card = { native: nat, double: dbl, judgeNative: judge(nat), judgeDouble: judge(dbl) };
  const rows = [['1周目 [s]', 'rev1Sec'], ['2周目 P [s]', 'rev2Sec'], ['3周目 P [s]', 'rev3Sec'],
    ['近点間 P 平均 [s]', 'periMeanSec'], ['近点 個数', 'nPeri'], ['e(1周目窓)', 'e1'], ['近点 r_min', 'rmin1'],
    ['近点移動 [°/周]', 'dPeri'], ['ΔP/P [%/公転]', 'decPct'], ['次周 ΔP/P [%]', 'decPct2'],
    ['重心 max', 'comMax'], ['帳簿 L 残差', 'lRel'], ['帳簿 P 残差', 'pRel'], ['B コア Ω ドリフト [%]', 'omDriftB']];
  console.error('  量 | native | double | 変化率');
  for (const [lab, k] of rows) {
    const a = nat[k], b = dbl[k];
    const rel = (Number.isFinite(a) && Number.isFinite(b) && a !== 0) ? ((b / a - 1) * 100).toFixed(4) + '%' : '—';
    console.error(`  ${lab} | ${a} | ${b} | ${rel}`);
  }
  for (const k of Object.keys(out.card.judgeNative))
    console.error(`  窓 ${k}: native=${out.card.judgeNative[k]} → double=${out.card.judgeDouble[k]}`);
}

// ============================================================ WIN20
if (want('win20')) {
  const DTS = FAST ? [DT0, DT0 / 2] : [DT0, DT0 / 2, DT0 / 4];
  console.error(`[w254d] WIN20: 窓 ${NWIN} 近点・dt=${DTS.join(', ')}・native/double・検出器 A/B`);
  out.win20 = { rows: [], dts: DTS, orbits: ORBITS20 };
  for (const fp of [null, 'double']) for (const dt of DTS) {
    const t0 = Date.now();
    const r = await pg.evaluate(([fp, dt, orbits, nWin, Pu]) => window.__w254.runWin(fp, dt, orbits, nWin, Pu),
      [fp, dt, ORBITS20, NWIN, PU]);
    const advA = r.A.slopeDeg, advB = r.B.slopeDeg;
    const row = { fp: fp || 'native', framePrec: r.framePrec, dt,
      advA, advB, detDiff: (advA === null || advB === null) ? null : Math.abs(advA - advB),
      residPctA: advA === null ? null : (advA / OBS_DEG_PER_ORBIT - 1) * 100,
      ratioObsA: advA === null ? null : advA / OBS_DEG_PER_ORBIT,
      periPsecA: r.A.perMean === null ? null : r.A.perMean * TUNIT,
      periPsecB: r.B.perMean === null ? null : r.B.perMean * TUNIT,
      periPresidPctA: r.A.perMean === null ? null : (r.A.perMean * TUNIT / P_OBS_S - 1) * 100,
      sidPsec: r.sidMean === null ? null : r.sidMean * TUNIT,
      sidPresidPct: r.sidMean === null ? null : (r.sidMean * TUNIT / P_OBS_S - 1) * 100,
      eProxy: r.eProxy, rMin: r.rMin, rMax: r.rMax,
      nPeriA: r.A.nPeri, foundA: r.A.found, rawA: r.rawA, foundB: r.B.found, rawB: r.rawB,
      unmeasuredA: r.A.unmeasured, rejA: r.A.rej, residFitDegA: r.A.residDeg,
      comMax: r.comMax, sMax: r.sMax, clampD: r.clampD, lRel: r.lRel, pRel: r.pRel,
      omDriftB: r.omDriftB, sidN: r.sidN, steps: r.steps, nan: r.nan,
      wallSec: (Date.now() - t0) / 1000 };
    out.win20.rows.push(row);
    console.error(`  ${row.fp} dt=${dt}: Δϖ(A)=${fx(advA, 8)} Δϖ(B)=${fx(advB, 8)} `
      + `近点間 P=${fx(row.periPsecA, 3)} s 同方向 P=${fx(row.sidPsec, 3)} s 近点 ${row.foundA} 個 `
      + `e=${fx(r.eProxy, 7)} ${row.wallSec.toFixed(1)}s`);
  }
  // p_obs と ε_num(第252便b ③ と同じ定義)
  const conv = {};
  for (const fp of ['native', 'double']) for (const det of ['advA', 'advB']) {
    const g = DTS.map((dt) => out.win20.rows.find((z) => z.fp === fp && z.dt === dt));
    if (g.length < 3 || g.some((z) => !z || z[det] === null)) continue;
    const [q1, q2, q3] = g.map((z) => z[det]);
    const d1 = q1 - q2, d2 = q2 - q3;
    conv[`${fp}|${det}`] = { Qh: q1, Qh2: q2, Qh4: q3,
      pObs: (d2 !== 0 && d1 !== 0) ? Math.log2(Math.abs(d1 / d2)) : null,
      epsNum: Math.abs(q1 - q3), epsOverObsPct: 100 * Math.abs(q1 - q3) / OBS_DEG_PER_ORBIT,
      richardson: (d2 !== 0 && d1 !== 0 && Math.abs(d1 / d2) > 1)
        ? q3 + d2 / (Math.abs(d1 / d2) - 1) : null };
  }
  out.win20.convergence = conv;
  for (const k of Object.keys(conv)) {
    const c = conv[k];
    console.error(`  収束 ${k}: Q_h=${fx(c.Qh, 8)} Q_h2=${fx(c.Qh2, 8)} Q_h4=${fx(c.Qh4, 8)} `
      + `p_obs=${fx(c.pObs, 3)} ε_num=${ex(c.epsNum)} (観測の ${fx(c.epsOverObsPct, 2)}%) 外挿=${fx(c.richardson, 8)}`);
  }
}

// ============================================================ CHI(第46報 M9: ❄️ の χ 表記の訂正)
// ❄️ plutoCharonReal の obsCard/failureFirst/descStruct は「χ=W/(D₀+W)≈0.92」と書いてきたが、
// **現行核(frameWeight:"share"・D₀=0.006・softening 0.05)のどの χ 定義から出た数かが辿れない**。
// 本節は**エンジンが公開している純関数そのもの**(HP.dfmBinaryChi / dfmPullEntrainment /
// dfmContactEntrainment)で 3 定義を計算し、宣言に載せる数を実測で決める。
// **プリセットの physics・bodies・claims は 1 bit も読み替えない**(宣言値をそのまま関数へ入れるだけ)。
if (want('chi')) {
  console.error('[w254d] CHI: ❄️🌊🌇 の χ を 3 定義(share / pull / 接触 h=0)で計算する');
  out.chi = await pg.evaluate(() => {
    const rows = [];
    for (const id of ['plutoCharonReal', 'neptuneReal', 'venusReal']) {
      const p = HP.allPresets().find((q) => q.id === id);
      if (!p) continue;
      const b = p.bodies, ph = p.physics;
      const mA = b[0].m, mB = b[1].m;
      const d = Math.hypot(b[1].x - b[0].x, b[1].y - b[0].y);
      const eps = ph.softening, D0 = ph.D0;
      const share = HP.dfmBinaryChi(mA, mB, d, D0, eps, 0);
      const pull = HP.dfmBinaryChi(mA, mB, d, D0, eps, 2);
      // 接触(h=0)は相手ではなく**自分の表面**でのフレーム分率(別チャネル — 対照として置く)
      const ctA = HP.dfmContactEntrainment({ M: mA, h: 0, eps, D0 });
      const ctB = HP.dfmContactEntrainment({ M: mB, h: 0, eps, D0 });
      // pull 版の並進 χ を dfmPullEntrainment でも独立に出して 2 経路が一致することを見る
      const peA = HP.dfmPullEntrainment({ M: mB, d, D0p: D0, eps, p: 2 });
      const peB = HP.dfmPullEntrainment({ M: mA, d, D0p: D0, eps, p: 2 });
      rows.push({ id, emoji: p.emoji, frameWeight: ph.frameWeight || '(未宣言=pull)',
        mA, mB, d, eps, D0,
        shareA: share.chiA, shareB: share.chiB, wShareA: share.wBA, wShareB: share.wAB,
        pullA: pull.chiA, pullB: pull.chiB,
        pullXA: peA.chi, pullXB: peB.chi,
        pullAgree: Math.abs(pull.chiA - peA.chi) + Math.abs(pull.chiB - peB.chi),
        contactA: ctA.chi, contactB: ctB.chi });
    }
    return rows;
  });
  for (const r of out.chi) {
    console.error(`  ${r.emoji} ${r.id}(frameWeight=${r.frameWeight}・d=${r.d}・ε=${r.eps}・D₀=${r.D0})`);
    console.error(`    share : χ₀=${r.shareA.toFixed(12)}  χ₁=${r.shareB.toFixed(12)}`);
    console.error(`    pull  : χ₀=${r.pullA.toExponential(6)}  χ₁=${r.pullB.toExponential(6)}(独立経路との差 ${r.pullAgree.toExponential(1)})`);
    console.error(`    接触h0: χ₀=${r.contactA.toFixed(12)}  χ₁=${r.contactB.toFixed(12)}`);
  }
}

// ============================================================ BIT(全内蔵プリセット × 600 步)
if (want('bit') && BASE) {
  console.error('[w254d] BIT: 全内蔵プリセット × 600 步(dt=0.016)を基点と突き合わせる');
  const hashAll = (page) => page.evaluate(() => {
    const h = (S) => {
      let a = 0x811c9dc5;
      const buf = new ArrayBuffer(8), f = new Float64Array(buf), u = new Uint8Array(buf);
      const push = (v) => { f[0] = v; for (let b = 0; b < 8; b++) { a ^= u[b]; a = Math.imul(a, 0x01000193) >>> 0; } };
      for (const k of ['x', 'y', 'vx', 'vy', 'spin', 'R', 'm']) { const A = S[k]; if (!A) continue;
        for (let i = 0; i < S.n; i++) push(A[i]); }
      push(S.t); return a.toString(16);
    };
    const o = {};
    for (const p of HP.allPresets()) {
      const v = HP.validatePreset(JSON.parse(JSON.stringify(p)));
      const S = HP.sim; S.build(v.preset);
      for (let k = 0; k < 600; k++) S.step(0.016);
      o[p.id] = h(S) + '|n=' + S.n + '|nan=' + S.hasNaN();
    }
    return o;
  });
  const cur = await hashAll(pg);
  const pg2 = await browser.newPage();
  await pg2.goto('file://' + path.resolve(BASE), { waitUntil: 'load' });
  await pg2.waitForFunction(() => window.HP && HP.sim);
  const base = await hashAll(pg2);
  await pg2.close();
  const ids = Object.keys(cur), baseIds = Object.keys(base);
  const diffs = ids.filter((id) => cur[id] !== base[id]);
  const added = ids.filter((id) => !(id in base)), removed = baseIds.filter((id) => !(id in cur));
  out.bit = { base: BASE, steps: 600, dt: DT0, nCur: ids.length, nBase: baseIds.length,
    diffs, added, removed, identicalCount: ids.length - diffs.length };
  console.error(`  BIT: 現行 ${ids.length} 本 / 基点 ${baseIds.length} 本 — 差=${diffs.length ? diffs.join(',') : 'なし'}`
    + ` (同一 ${ids.length - diffs.length} 本)`);
}

out.pageErrors = pageErrors;
await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error('[w254d] → ' + path.relative(ROOT, OUT));
if (pageErrors.length) console.error('[w254d] pageErrors: ' + pageErrors.slice(0, 3).join(' | '));

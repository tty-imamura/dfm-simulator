// 第252便a W1「箱宇宙と連星 — 等質量で公転が消える原理と 2.000 対 2.025 の識別」(第44報)。
//
// 原仮定者(第44報・原文は docs/PHYSICS.md 〔第252便a〕に全文引用):
//   「箱宇宙の出発点は、『もしも宇宙に天体が1つしか無かったら』である。その天体が移動したり回転しても、
//    感知出来ない/次に、『もしも宇宙に天体が2つしかなかったら』を考える。質量の大きな天体が宇宙の基準と
//    なり、小さな天体は公転する/さらに、『もしも2つしかない天体が同じ質量だったら』を考える。すると、
//    2天体が等価な基準になるので、互いの公転が消える。潮汐ロックで互いの向きが固定されれば、自転も消える/
//    冥王星とカロンは、潮汐ロックで互いを向いているが、背景決定力場に対する移動で互いの公転を続けている/
//    大質量の天体同士ではどうなるか。公転は残るが公転に伴う並進は減少する/コンパクト天体連星に、この理論を
//    導入する」。
//
// **エンジンの物理は本ハーネスからは 1 bit も書き換えない**(preset の宣言だけを差し替えて測る)。
// 近点検出は第246便b→第247便a→第248便→第249便a と同一手続き(検出器 A=ṙ の −→+ 交差 /
// B=距離極小の放物線頂点、柵は 近点/遠点の区別・一周に近点1つ・半周ジャンプ拒否、N 近点の位相を直線 fit)。
//
// ■ 節
//   ID   : **識別表**。⚡psrDoubleABDFM・🧮psrJ1757DFM・🩺psrJ1946DFM・🧶psrB1534DFM(+📿psrB1534)を
//          1 表にする: q=m₂/m₁・ν=m₁m₂/M²・4ν(等質量度)・|m₁−m₂|/M・e・実行時 χ₁χ₂(pull 重み)・
//          **λ_PN=0 の基線 A0**(°/周)・A_PN=A(λ=1)−A0・観測 Δϖ・DFM/obs 比・
//          **D0pull 感度**(×0.5/×2 で A0 がどう動くか)・重心走行(E12 対反作用)・窓(近点 N 個)。
//          「**2.000 と 2.025 を分ける列がどれか**」を実測で言うための表である。
//   PAIR : `physics.compactForce.velocityFrame`("absolute"=既定=v₁·v₂ / "pair"=相対速度のみ)の識別。
//          🪗compactForceToy・🪝🪄🩹🪤 で Δϖ を両枠で測る(**κ は再凍結しない** — 同じ κ での比較だけ)。
//   BOX  : **箱宇宙の原理**。等質量 2 体(q=1)× D0pull スイープで、χ・公転周期・重心並進・相対運動が
//          どう変わるかを測る。原理サンプル 🫧 boxBinaryToy の obsCard の裏取りでもある。
//          ❄️plutoCharonReal(等質量に近い実系)を同じ器で 1 行足す。
//   D0   : **D0pull=0 の意味**。検証器が明示 0 をどう扱うか・場コードと compactForce の分母が一致するか。
//   EQ   : **等質量度だけを振る**(総質量・分離・相対速度を固定して重心配分だけを変える — 第249便a の ν 則実験と同型)。
//          A0 が質量比で決まるのかどうかを直接測る。
//   DIAG : **A0 のノックアウト**(coupleSink・cmGauge・frameWeight・D0pull・softening・kFrame を 1 つずつ外す)。
//
// 実行: node tests/exp-w252a-boxbinary.mjs [--id] [--pair] [--box] [--d0] [--eq] [--diag] [--fast] [--dt 0.004]
//       節を絞って回すと**既存の結果 JSON へ差し替え**る(全節を 1 度に回さなくても 1 枚になる)。
// 出力: tests/out/boxbinary-w252.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'boxbinary-w252.json');
const argv = process.argv.slice(2);
const FAST = argv.includes('--fast');
const DT = (() => { const i = argv.indexOf('--dt'); return (i >= 0 && argv[i + 1]) ? Number(argv[i + 1]) : 0.004; })();
const NPERI = FAST ? 6 : 20;
const only = argv.filter((a) => a.startsWith('--') && a !== '--fast').map((a) => a.slice(2));
const want = (k) => !only.length || only.includes(k);

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

const out = { target: TARGET, node: process.version, at: new Date().toISOString(), wave: '252a', dt: DT, nPeri: NPERI, fast: FAST };

// ---------------------------------------------------------------- ページ側の共通ライブラリ
await pg.evaluate(() => {
  const W = (window.__w252 = {});
  W.YR = 365.25 * 86400;
  // 観測レコードの転写(paper/data/solar-observations.csv 経由でプリセット obsCard に載っている値)。
  //   PobsS = 近点間周期[s]・omegaDot = ω̇[°/yr]・eObs = 転写離心率・Tunit = 1 時間単位の秒数(L−T=5 族は 10)
  W.SYS = {
    psrDoubleABDFM: { label: '⚡ J0737−3039A/B (DFM)', PobsS: 8834.534723278, omegaDot: 16.899323, eObs: 0.087777036, Tunit: 10 },
    psrJ1757DFM: { label: '🧮 J1757−1854 (DFM)', PobsS: 15857.669019168, omegaDot: 10.3651, eObs: 0.6058142, Tunit: 10 },
    psrJ1946DFM: { label: '🩺 J1946+2052 (DFM)', PobsS: 6781.366656, omegaDot: 25.79205, eObs: 0.063848, Tunit: 10 },
    psrB1534DFM: { label: '🧶 B1534+12 (DFM)', PobsS: 36351.7026, omegaDot: 1.755789, eObs: 0.2736775, Tunit: 10 },
    psrB1534: { label: '📿 B1534+12 (観測版 kF0)', PobsS: 36351.7026, omegaDot: 1.755789, eObs: 0.2736775, Tunit: 10 },
  };
  // ---- 近点測定(第249便a __w249peri と同一手続き。NP を可変にしただけ)
  W.peri = (S, dt, tEnd, pRef, NP) => {
    const steps = Math.round(tEnd / dt);
    const A = [], Bd = [], sid = [];
    let r2 = 0, r1 = 0, t2 = 0, t1 = 0, rd1 = 0, rMin = Infinity, rMax = -Infinity;
    let acc = 0, accPrev = 0, thPrev = null, nTurn = 0;
    const mAll = []; for (let i = 0; i < S.n; i++) mAll.push(S.m[i]);
    const Msum = mAll.reduce((a, b) => a + b, 0);
    const cmOf = () => { let cx = 0, cy = 0; for (let i = 0; i < S.n; i++) { cx += mAll[i] * S.x[i]; cy += mAll[i] * S.y[i]; } return [cx / Msum, cy / Msum]; };
    const vcmOf = () => { let vx = 0, vy = 0; for (let i = 0; i < S.n; i++) { vx += mAll[i] * S.vx[i]; vy += mAll[i] * S.vy[i]; } return [vx / Msum, vy / Msum]; };
    const cm0 = cmOf(), vcm0 = vcmOf(), t00 = S.t;
    let cmMax = 0, cmDev = 0;   // cmDev = **弾道(初期の等速直線)からの重心のずれ** = 公転に伴う並進の観測量
    for (let k = 0; k < steps; k++) {
      S.step(dt);
      const dx = S.x[1] - S.x[0], dy = S.y[1] - S.y[0];
      const rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
      const dvx = S.vx[1] - S.vx[0], dvy = S.vy[1] - S.vy[0];
      const rd = (dx * dvx + dy * dvy) / rr;
      if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr;
      if ((k & 255) === 0) {
        const c = cmOf(), dtEl = S.t - t00;
        const d = Math.hypot(c[0] - cm0[0], c[1] - cm0[1]); if (d > cmMax) cmMax = d;
        const dv = Math.hypot(c[0] - (cm0[0] + vcm0[0] * dtEl), c[1] - (cm0[1] + vcm0[1] * dtEl)); if (dv > cmDev) cmDev = dv;
      }
      if (thPrev !== null) {
        let d = th - thPrev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
        accPrev = acc; acc += d;
        while (sid.length < NP && Math.abs(acc) >= (nTurn + 1) * 2 * Math.PI) {
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
    const sidPer = []; for (let i = 1; i < sid.length; i++) sidPer.push(sid[i] - sid[i - 1]);
    return { rMin, rMax, eProxy: (rMax - rMin) / (rMax + rMin), A: fit(A), B: fit(Bd),
      sidMean: sidPer.length ? sidPer.reduce((a, b) => a + b, 0) / sidPer.length : null,
      cmWalk: Math.hypot(cmEnd[0] - cm0[0], cmEnd[1] - cm0[1]), cmMax, cmDev,
      vcm0: vcm0.slice(),
      res: [S.resPx, S.resPy, S.resL],
      nan: S.hasNaN(), clamp: S.clampVN + S.clampSN + S.clampRN + S.clampTN + S.clampAN };
  };
  // ---- 実行時 χ(pull 重み・n=2 の厳密形。エンジン S._compactForce と同じ式)
  W.chiAt = (m1, m2, d, D0p, eps, pw) => {
    const d2 = d * d + eps * eps, wg = (pw > 0) ? Math.pow(d2, -pw / 2) : 1 / Math.sqrt(d2);
    const w12 = m2 * wg, w21 = m1 * wg;
    return { chi1: (D0p + w12 > 0) ? w12 / (D0p + w12) : 0, chi2: (D0p + w21 > 0) ? w21 / (D0p + w21) : 0 };
  };
  // ---- 1 行を測る(physics の宣言だけを差し替える。bodies・massCalibration は 1 bit 触らない)
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
    const tEnd = (NP + 0.6) * (Pu || 1);
    const o = W.peri(S, dt, tEnd, Pu || 1, NP);
    o.lambdaPN = v.preset.physics.lambdaPN;
    o.D0pull = v.preset.physics.D0pull;
    o.kFrame = v.preset.physics.kFrame;
    o.declaredD0pull = (v.preset.physics.D0pull === undefined) ? null : v.preset.physics.D0pull;
    if (s) {
      o.PmeasS = (o.A.perMean === null) ? null : o.A.perMean * s.Tunit;
      o.PobsS = s.PobsS;
      o.obsDeg = s.omegaDot * s.PobsS / W.YR;
    }
    return o;
  };
  // ---- 系の宣言(質量・幾何・χ)
  W.meta = (id) => {
    const p = HP.allPresets().find((q) => q.id === id);
    const b = p.bodies, m1 = b[0].m, m2 = b[1].m, M = m1 + m2;
    const mc = p.massCalibration || null;
    const f = mc ? mc.factor : 1;
    const sep0 = Math.hypot(b[1].x - b[0].x, b[1].y - b[0].y);
    const ph = p.physics;
    const pw = (ph.frameWeight === undefined) ? 2 : (ph.frameWeight === 'pull') ? 2 : (ph.frameWeight === 'pull3') ? 3 : (ph.frameWeight === 'pull4') ? 4 : 0;
    const D0p = (ph.D0pull !== undefined) ? ph.D0pull : ph.D0;
    const s = W.SYS[id];
    const e = s ? s.eObs : 0;
    const a = sep0 / (1 + e);                 // 遠点整列の転写なので sep0 = a(1+e)
    const rPeri = a * (1 - e);
    const chiApo = W.chiAt(m1, m2, sep0, D0p, ph.softening, pw);
    const chiPer = W.chiAt(m1, m2, rPeri, D0p, ph.softening, pw);
    return { id, emoji: p.emoji, label: s ? s.label : p.name,
      m1, m2, M, f, q: m2 / m1, nu: m1 * m2 / (M * M), eqMass4nu: 4 * m1 * m2 / (M * M),
      dmOverM: Math.abs(m1 - m2) / M, e, a, sep0, rPeri, pw, D0p, softening: ph.softening,
      kFrame: ph.kFrame, lambdaPN: ph.lambdaPN, geoPN: ph.geoPN, cLight: ph.cLight, G: ph.G,
      chiApo, chiPer, chiProdApo: chiApo.chi1 * chiApo.chi2, chiProdPer: chiPer.chi1 * chiPer.chi2,
      // 1PN 解析参照 Δϖ_GR = 6πGM/(c²a(1−e²))(**較正質量 M で評価** — 第248便b の同定の参照)
      gr1pnDegCal: 6 * Math.PI * ph.G * M / (ph.cLight * ph.cLight * a * (1 - e * e)) * 180 / Math.PI,
      gr1pnDegObs: 6 * Math.PI * ph.G * (M / f) / (ph.cLight * ph.cLight * a * (1 - e * e)) * 180 / Math.PI };
  };
});

const fmt = (z, d = 6) => (z === null || z === undefined) ? '—' : (typeof z === 'number' ? z.toFixed(d) : String(z));
const exp3 = (z) => (z === null || z === undefined) ? '—' : z.toExponential(3);

// ============================================================ ID: 識別表
if (want('id')) {
  const IDS = ['psrDoubleABDFM', 'psrJ1757DFM', 'psrJ1946DFM', 'psrB1534DFM', 'psrB1534'];
  const rows = [];
  for (const id of IDS) {
    const meta = await pg.evaluate((z) => window.__w252.meta(z), id);
    const t0 = Date.now();
    // **数値床の平準化**(第249便a と同じ宣言): 全行に framePrecision:"double" を敷く。
    // ⚡ 本体だけが native 宣言なので、ここで揃えないと ⚡ の A0 が丸め床に埋もれる(実測: A0/obs が 26.7%)。
    const FP = { framePrecision: 'double' };
    // ① 宣言のまま(λ_PN=1)
    const full = await pg.evaluate(([id, dt, NP, FP]) => window.__w252.run(id, FP, dt, NP), [id, DT, NPERI, FP]);
    // ② λ_PN=0 の基線 A0(1PN チャネルを閉じる — 残るのは引きずり+軟化+離散化)
    const lam0 = await pg.evaluate(([id, dt, NP, FP]) => window.__w252.run(id, Object.assign({ lambdaPN: 0 }, FP), dt, NP), [id, DT, NPERI, FP]);
    // ③ D0pull 感度(A0 の上で ×0.5 / ×2)
    const d0h = await pg.evaluate(([id, dt, NP, v, FP]) => window.__w252.run(id, Object.assign({ lambdaPN: 0, D0pull: v }, FP), dt, NP), [id, DT, NPERI, meta.D0p * 0.5, FP]);
    const d0d = await pg.evaluate(([id, dt, NP, v, FP]) => window.__w252.run(id, Object.assign({ lambdaPN: 0, D0pull: v }, FP), dt, NP), [id, DT, NPERI, meta.D0p * 2, FP]);
    // ④ dt 収束(DT/4・近点 6 個): A0 も A_PN も刻みの産物ではないことの確認
    const NPC = Math.min(NPERI, 6), DTC = DT / 4;
    const fullC = await pg.evaluate(([id, dt, NP, FP]) => window.__w252.run(id, FP, dt, NP), [id, DTC, NPC, FP]);
    const lam0C = await pg.evaluate(([id, dt, NP, FP]) => window.__w252.run(id, Object.assign({ lambdaPN: 0 }, FP), dt, NP), [id, DTC, NPC, FP]);
    const A0 = lam0.A.slopeDeg, AF = full.A.slopeDeg;
    rows.push({ id, emoji: meta.emoji, label: meta.label, meta,
      A0, AF, APN: (A0 === null || AF === null) ? null : AF - A0,
      obsDeg: full.obsDeg, ratio: (AF === null) ? null : AF / full.obsDeg,
      ratioPN: (A0 === null || AF === null) ? null : (AF - A0) / full.obsDeg,
      A0OverObsPct: (A0 === null) ? null : 100 * A0 / full.obsDeg,
      APNoverGRcal: (A0 === null || AF === null) ? null : (AF - A0) / meta.gr1pnDegCal,
      AFoverGRcal: (AF === null) ? null : AF / meta.gr1pnDegCal,
      d0Half: d0h.A.slopeDeg, d0Double: d0d.A.slopeDeg,
      d0HalfRel: (A0 && d0h.A.slopeDeg !== null) ? d0h.A.slopeDeg / A0 - 1 : null,
      d0DoubleRel: (A0 && d0d.A.slopeDeg !== null) ? d0d.A.slopeDeg / A0 - 1 : null,
      cmWalk: full.cmWalk, cmWalkOverA: full.cmWalk / meta.a, cmMax: full.cmMax,
      PmeasS: full.PmeasS, PresidPct: (full.PmeasS === null) ? null : 100 * (full.PmeasS / full.PobsS - 1),
      eProxy: full.eProxy, eResidPct: 100 * (full.eProxy / meta.e - 1),
      detDiff: (full.A.slopeDeg === null || full.B.slopeDeg === null) ? null : Math.abs(full.A.slopeDeg - full.B.slopeDeg),
      conv: { dt: DTC, nPeri: NPC, A0: lam0C.A.slopeDeg, AF: fullC.A.slopeDeg,
        APN: (lam0C.A.slopeDeg === null || fullC.A.slopeDeg === null) ? null : fullC.A.slopeDeg - lam0C.A.slopeDeg,
        ratio: (fullC.A.slopeDeg === null) ? null : fullC.A.slopeDeg / full.obsDeg,
        ratioPN: (lam0C.A.slopeDeg === null || fullC.A.slopeDeg === null) ? null : (fullC.A.slopeDeg - lam0C.A.slopeDeg) / full.obsDeg,
        A0OverObsPct: (lam0C.A.slopeDeg === null) ? null : 100 * lam0C.A.slopeDeg / full.obsDeg },
      nPeriA: full.A.nPeri, nan: full.nan, clamp: full.clamp, res: full.res,
      secs: (Date.now() - t0) / 1000 });
    const r = rows[rows.length - 1];
    console.error(`  ${meta.emoji} ${id}: q=${fmt(meta.q, 6)} ν=${fmt(meta.nu, 6)} 4ν=${fmt(meta.eqMass4nu, 6)} |Δm|/M=${exp3(meta.dmOverM)}`
      + ` e=${fmt(meta.e, 6)} χ₁χ₂(遠点)=${fmt(meta.chiProdApo, 8)}`);
    console.error(`     A0(λ=0)=${exp3(A0)} A(λ=1)=${exp3(AF)} A_PN=${exp3(r.APN)} obs=${exp3(r.obsDeg)}`
      + ` 比=${fmt(r.ratio, 6)} A0/obs=${fmt(r.A0OverObsPct, 4)}% A_PN/obs=${fmt(r.ratioPN, 6)}`);
    console.error(`     D0pull×0.5 → A0 ${fmt(r.d0HalfRel === null ? null : r.d0HalfRel * 100, 4)}% / ×2 → ${fmt(r.d0DoubleRel === null ? null : r.d0DoubleRel * 100, 4)}%`
      + ` / 重心走行 ${exp3(r.cmWalk)}(a 比 ${exp3(r.cmWalkOverA)}) / 近点 ${r.nPeriA} 個 / ${r.secs.toFixed(1)}s`);
    console.error(`     dt 収束(dt=${DTC}・近点 ${NPC}): A0=${exp3(r.conv.A0)} A_PN/obs=${fmt(r.conv.ratioPN, 6)} 比=${fmt(r.conv.ratio, 6)} A0/obs=${fmt(r.conv.A0OverObsPct, 4)}%`);
  }
  // ---- **2.000 と 2.025 を分ける列はどれか**: A0/obs と候補スカラの順位相関(Spearman・n=4)
  const dfm = rows.filter((z) => z.meta.kFrame === 1);
  const rank = (arr) => { const idx = arr.map((v, i) => [v, i]).sort((a, b) => a[0] - b[0]);
    const r = new Array(arr.length); idx.forEach((p, k) => { r[p[1]] = k + 1; }); return r; };
  const spearman = (a, b) => { const ra = rank(a), rb = rank(b), n = a.length;
    let d2 = 0; for (let i = 0; i < n; i++) d2 += (ra[i] - rb[i]) ** 2;
    return 1 - 6 * d2 / (n * (n * n - 1)); };
  const y = dfm.map((z) => Math.abs(z.A0OverObsPct));
  const CANDS = {
    'dmOverM(|m₁−m₂|/M)': dfm.map((z) => z.meta.dmOverM),
    '4ν(等質量度)': dfm.map((z) => z.meta.eqMass4nu),
    'e(離心率)': dfm.map((z) => z.meta.e),
    'χ₁χ₂(遠点)': dfm.map((z) => z.meta.chiProdApo),
    '1−χ₁χ₂': dfm.map((z) => 1 - z.meta.chiProdApo),
    'a(半長径)': dfm.map((z) => z.meta.a),
    'GM/(ac²)': dfm.map((z) => z.meta.G * z.meta.M / (z.meta.a * z.meta.cLight * z.meta.cLight)),
    'obsΔϖ': dfm.map((z) => z.obsDeg),
  };
  const corr = {};
  for (const k of Object.keys(CANDS)) corr[k] = spearman(y, CANDS[k]);
  out.id = { dt: DT, nPeri: NPERI, framePrecision: 'double(全行で平準化)', rows,
    split: { ids: dfm.map((z) => z.id), A0OverObsPct: dfm.map((z) => z.A0OverObsPct),
      ratio: dfm.map((z) => z.ratio), ratioPN: dfm.map((z) => z.ratioPN), cands: CANDS, spearman: corr } };
  console.error('  ── A0/obs(%) と候補スカラの順位相関(n=' + dfm.length + '・相関≠原因):');
  for (const k of Object.keys(corr)) console.error(`     ρ(|A0/obs|, ${k}) = ${corr[k].toFixed(4)}`);
}

// ============================================================ PAIR: velocityFrame の識別
if (want('pair')) {
  const CASES = [
    { id: 'compactForceToy', tEndOrb: 6.6, dt: 0.004, P: 489.2102 },
    { id: 'psrDoubleABCF', sys: 'psrDoubleABDFM' },
    { id: 'psrJ1757CF', sys: 'psrJ1757DFM' },
    { id: 'psrJ1946CF', sys: 'psrJ1946DFM' },
    { id: 'psrB1534CF', sys: 'psrB1534DFM' },
  ];
  const rows = [];
  for (const cs of CASES) {
    const NP = FAST ? 5 : 8;
    const r = await pg.evaluate(([id, sys, dt, NP, P]) => {
      const W = window.__w252;
      const go = (vf, boostFrac) => {
        const pd = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === id)));
        const cf = pd.physics.compactForce;
        if (vf) pd.physics.compactForce = Object.assign({}, cf, { velocityFrame: vf });
        if (boostFrac) {   // **背景決定力場に対する共通並進**(相対速度に対する割合)— 2 つの枠が分かれる唯一の場所
          const vr = Math.hypot(pd.bodies[1].vx - pd.bodies[0].vx, pd.bodies[1].vy - pd.bodies[0].vy);
          for (const b of pd.bodies) b.vx += boostFrac * vr;
        }
        delete pd.massCalibration;
        const v = HP.validatePreset(pd); const S = HP.sim; S.build(v.preset);
        const Pu = sys ? W.SYS[sys].PobsS / W.SYS[sys].Tunit : P;
        const o = W.peri(S, dt, (NP + 0.6) * Pu, Pu, NP);
        o.sig = JSON.stringify(v.preset.physics);
        o.cf = v.preset.physics.compactForce;
        o.U = S.compactU; o.WE = S.compactWorkE; o.chi = S.compactChiMin;
        o.PmeasS = (o.A.perMean === null) ? null : o.A.perMean * (sys ? W.SYS[sys].Tunit : 1);
        o.obsDeg = sys ? W.SYS[sys].omegaDot * W.SYS[sys].PobsS / W.YR : null;
        return o;
      };
      const abs = go(null), absExp = go('absolute'), pair = go('pair');
      const absB = go(null, 0.5), pairB = go('pair', 0.5);
      return { abs, absExp, pair, absB, pairB,
        bitDefault: JSON.stringify(abs.A) === JSON.stringify(absExp.A) && abs.sig === absExp.sig };
    }, [cs.id, cs.sys || null, cs.dt || DT, NP, cs.P || null]);
    const a = r.abs.A.slopeDeg, p = r.pair.A.slopeDeg;
    rows.push({ id: cs.id, sys: cs.sys || null, absDeg: a, pairDeg: p,
      diff: (a === null || p === null) ? null : p - a,
      diffRel: (a && p !== null) ? p / a - 1 : null,
      absRatio: r.abs.obsDeg ? a / r.abs.obsDeg : null,
      pairRatio: r.abs.obsDeg ? p / r.abs.obsDeg : null,
      obsDeg: r.abs.obsDeg, bitDefault: r.bitDefault,
      cmWalkAbs: r.abs.cmWalk, cmWalkPair: r.pair.cmWalk,
      Uabs: r.abs.U, Upair: r.pair.U, WEabs: r.abs.WE, WEpair: r.pair.WE,
      sigAbs: r.abs.sig === r.absExp.sig, cfPair: r.pair.cf,
      // **背景に対して走らせた場合**(共通速度 = 相対速度の 50%): ここで初めて 2 つの枠が分かれる
      boost: { frac: 0.5, absDeg: r.absB.A.slopeDeg, pairDeg: r.pairB.A.slopeDeg,
        diff: (r.absB.A.slopeDeg === null || r.pairB.A.slopeDeg === null) ? null : r.pairB.A.slopeDeg - r.absB.A.slopeDeg,
        absShiftRel: (r.abs.A.slopeDeg && r.absB.A.slopeDeg !== null) ? r.absB.A.slopeDeg / r.abs.A.slopeDeg - 1 : null,
        pairShiftRel: (r.pair.A.slopeDeg && r.pairB.A.slopeDeg !== null) ? r.pairB.A.slopeDeg / r.pair.A.slopeDeg - 1 : null,
        Uabs: r.absB.U, Upair: r.pairB.U },
      nan: r.pair.nan, clamp: r.pair.clamp });
    const z = rows[rows.length - 1];
    console.error(`  PAIR ${cs.id}: absolute=${exp3(a)} pair=${exp3(p)} 差=${exp3(z.diff)}`
      + ` 相対差=${z.diffRel === null ? '—' : (z.diffRel * 100).toExponential(3) + '%'}`
      + ` / 既定(未宣言 vs "absolute" 明示)ビット同一=${z.bitDefault}`);
    console.error(`       背景に対して走らせる(共通速度=相対速度の 50%): absolute=${exp3(z.boost.absDeg)}(静止比 ${z.boost.absShiftRel === null ? '—' : (z.boost.absShiftRel * 100).toExponential(3) + '%'})`
      + ` / pair=${exp3(z.boost.pairDeg)}(静止比 ${z.boost.pairShiftRel === null ? '—' : (z.boost.pairShiftRel * 100).toExponential(3) + '%'})`
      + ` / 枠の差=${exp3(z.boost.diff)}`);
  }
  out.pair = { rows };
}

// ============================================================ BOX: 箱宇宙の原理(等質量 × D0pull)
if (want('box')) {
  const r = await pg.evaluate(([dt]) => {
    const W = window.__w252;
    // 合成 2 体(プリセットに依存しない器): c₀=30 規約・総質量 1000・e=0.3・遠点分離 200。
    // D0pull を振ると実行時 χ が動く。χ→1 は「相手が自分の基準になりきる」・χ→0 は「背景が基準」。
    // boost は**背景決定力場に対する共通並進**(第44報の「背景決定力場に対する移動」の対照)。
    const mk = (q, D0pull, boost) => {
      const G = 0.60066, c = 30, e = 0.3, sepA = 200, eps = 0.05;
      const m1 = 1000 / (1 + q), m2 = 1000 * q / (1 + q), M = m1 + m2;
      const a = sepA / (1 + e), muN = G * M;
      const vA = Math.sqrt(muN * (1 - e) / (a * (1 + e)));    // 遠点の相対速度
      return { name: 'w252 box', description: 'box binary probe', emoji: '🫧',
        camera: { scale: 130 }, world: { boundary: 'none', size: 0 },
        physics: { G, D0: 0.006, kFrame: 1, q: 3, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, kappaT: 0.0006674,
          cLight: c, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
          geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: eps, timeScale: 60, dispMag: 3,
          stateCarry: 'double', framePrecision: 'double', frameReaction: 'pairReduced',
          frameWeight: 'pull', D0pull },
        bodies: [
          { type: 'single', m: m1, radius: 1, x: -sepA * m2 / M, y: 0, vx: boost, vy: -vA * m2 / M, spin: 0, pinned: false, pnSource: true },
          { type: 'single', m: m2, radius: 1, x: sepA * m1 / M, y: 0, vx: boost, vy: vA * m1 / M, spin: 0, pinned: false },
        ],
        overlays: { rotationCurve: false, tempHistogram: false, field: false, trail: true },
        meta: { m1, m2, M, a, e, sepA, muN, eps, G, c, Pkep: 2 * Math.PI * Math.sqrt(a * a * a / muN) } };
    };
    const one = (q, D0pull, boost, NP) => {
      const pd = mk(q, D0pull, boost);
      const meta = pd.meta; delete pd.meta;
      const v = HP.validatePreset(JSON.parse(JSON.stringify(pd)));
      const S = HP.sim; S.build(v.preset);
      const o = W.peri(S, dt, (NP + 0.6) * meta.Pkep, meta.Pkep, NP);
      const D0p = (v.preset.physics.D0pull !== undefined) ? v.preset.physics.D0pull : v.preset.physics.D0;
      const chiA = W.chiAt(meta.m1, meta.m2, meta.sepA, D0p, meta.eps, 2);
      const chiP = W.chiAt(meta.m1, meta.m2, meta.a * (1 - meta.e), D0p, meta.eps, 2);
      return { q, D0pull, boost, D0pEff: D0p, m1: meta.m1, m2: meta.m2,
        dmOverM: Math.abs(meta.m1 - meta.m2) / meta.M, eqMass4nu: 4 * meta.m1 * meta.m2 / (meta.M * meta.M),
        chi1Apo: chiA.chi1, chi2Apo: chiA.chi2, chiProdApo: chiA.chi1 * chiA.chi2,
        chi1Per: chiP.chi1, chi2Per: chiP.chi2,
        Pkep: meta.Pkep, Pmeas: o.A.perMean, Psid: o.sidMean,
        PresidPct: (o.A.perMean === null) ? null : 100 * (o.A.perMean / meta.Pkep - 1),
        advDeg: o.A.slopeDeg, eProxy: o.eProxy, rMin: o.rMin, rMax: o.rMax,
        cmWalk: o.cmWalk, cmDev: o.cmDev, cmDevOverA: o.cmDev / meta.a,
        nan: o.nan, clamp: o.clamp };
    };
    const NP = 6, rows = [], inv = [];
    for (const q of [1, 0.99, 0.9, 0.5, 0.1, 0.01]) {
      for (const D0pull of [1e-6, 1, 1e3]) {
        const z0 = one(q, D0pull, 0, NP), zs = one(q, D0pull, 0.3, NP), z3 = one(q, D0pull, 3, NP);
        rows.push(z0, zs, z3);
        // **背景に対する移動が相対軌道に効くか**(第44報の識別): 4 量のビット一致で見る
        const bit = Object.is(z0.Pmeas, z3.Pmeas) && Object.is(z0.advDeg, z3.advDeg)
          && Object.is(z0.rMin, z3.rMin) && Object.is(z0.rMax, z3.rMax);
        inv.push({ q, D0pull, dmOverM: z0.dmOverM,
          chi1: z0.chi1Apo, chi2: z0.chi2Apo,
          P0: z0.Pmeas, Ps: zs.Pmeas, P3: z3.Pmeas,
          dPpctSmall: (z0.Pmeas && zs.Pmeas) ? 100 * (zs.Pmeas / z0.Pmeas - 1) : null,
          dPpct: (z0.Pmeas && z3.Pmeas) ? 100 * (z3.Pmeas / z0.Pmeas - 1) : null,
          adv0: z0.advDeg, adv3: z3.advDeg,
          dAdvRel: (z0.advDeg && z3.advDeg !== null) ? z3.advDeg / z0.advDeg - 1 : null,
          cmDev0: z0.cmDev, cmDev3: z3.cmDev, cmDevOverA0: z0.cmDevOverA, cmDevOverA3: z3.cmDevOverA,
          bitIdentical: bit });
      }
    }
    // ---- ❄️ plutoCharonReal(等質量ではないが χ≈0.92 の近接連星 — 実在の対照)
    const pluto = (() => {
      const src = HP.allPresets().find((z) => z.id === 'plutoCharonReal');
      const vrel0 = Math.hypot(src.bodies[1].vx - src.bodies[0].vx, src.bodies[1].vy - src.bodies[0].vy);
      const go = (frac, kFrame) => {
        const boost = frac * vrel0;   // 軌道速度に対する割合で与える(絶対値 3 は本系では軌道を壊す)
        const pd = JSON.parse(JSON.stringify(src));
        if (kFrame !== undefined) pd.physics.kFrame = kFrame;
        if (boost) for (const b of pd.bodies) b.vx += boost;
        const v = HP.validatePreset(pd); const S = HP.sim; S.build(v.preset);
        const b = v.preset.bodies, m1 = b[0].m, m2 = b[1].m, M = m1 + m2;
        const sep = Math.hypot(b[1].x - b[0].x, b[1].y - b[0].y);
        const Pk = 2 * Math.PI * Math.sqrt(sep * sep * sep / (v.preset.physics.G * M));
        const o = W.peri(S, dt, 4.6 * Pk, Pk, 4);
        const D0p = (v.preset.physics.D0pull !== undefined) ? v.preset.physics.D0pull : v.preset.physics.D0;
        const pw = (v.preset.physics.frameWeight === undefined) ? 2 : (v.preset.physics.frameWeight === 'pull') ? 2 : 0;
        const chi = W.chiAt(m1, m2, sep, D0p, v.preset.physics.softening, pw);
        return { boostFrac: frac, boost, vrel0, kFrame: v.preset.physics.kFrame, m1, m2, q: m2 / m1, M,
          dmOverM: Math.abs(m1 - m2) / M, eqMass4nu: 4 * m1 * m2 / (M * M),
          frameWeight: v.preset.physics.frameWeight, D0pEff: D0p, chi1: chi.chi1, chi2: chi.chi2,
          Pkep: Pk, Psid: o.sidMean, PsidPct: (o.sidMean === null) ? null : 100 * (o.sidMean / Pk - 1),
          cmDev: o.cmDev, cmDevOverA: o.cmDev / sep, nan: o.nan, clamp: o.clamp };
      };
      const a0 = go(0), a3 = go(0.1), k0 = go(0, 0), k3 = go(0.1, 0);
      return { kF1: { still: a0, moving: a3,
        dPsidPct: (a0.Psid && a3.Psid) ? 100 * (a3.Psid / a0.Psid - 1) : null,
        bitIdentical: Object.is(a0.Psid, a3.Psid) },
      kF0: { still: k0, moving: k3,
        dPsidPct: (k0.Psid && k3.Psid) ? 100 * (k3.Psid / k0.Psid - 1) : null,
        bitIdentical: Object.is(k0.Psid, k3.Psid) } };
    })();
    return { rows, inv, pluto };
  }, [DT]);
  out.box = r;
  const f8 = (x) => (x === null || x === undefined) ? '—' : x.toFixed(8);
  for (const z of r.inv) {
    console.error(`  BOX q=${z.q} D0pull=${z.D0pull}: χ₁=${f8(z.chi1)} χ₂=${f8(z.chi2)}`
      + ` P(静止)=${z.P0 === null ? '—' : z.P0.toFixed(4)} P(boost=3)=${z.P3 === null ? '—' : z.P3.toFixed(4)}`
      + ` ΔP(v=0.3)=${z.dPpctSmall === null ? '—' : z.dPpctSmall.toExponential(3)}%`
      + ` ΔP(v=3)=${z.dPpct === null ? '—' : z.dPpct.toExponential(3)}% / Δϖ ${exp3(z.adv0)} → ${exp3(z.adv3)}`
      + ` / 重心の弾道ずれ/a ${exp3(z.cmDevOverA0)} → ${exp3(z.cmDevOverA3)} / **ビット同一=${z.bitIdentical}**`);
  }
  console.error(`  BOX ❄️ plutoCharonReal: q=${r.pluto.kF1.still.q.toFixed(6)} χ₁=${f8(r.pluto.kF1.still.chi1)} χ₂=${f8(r.pluto.kF1.still.chi2)}`
    + ` / kF1 同方向P 静止 ${r.pluto.kF1.still.Psid === null ? '—' : r.pluto.kF1.still.Psid.toFixed(6)}`
    + `(ケプラー比 ${fmt(r.pluto.kF1.still.PsidPct, 4)}%) → 背景に対する移動(相対速度の 10%)で ${fmt(r.pluto.kF1.dPsidPct, 6)}% 変化・ビット同一=${r.pluto.kF1.bitIdentical}`);
  console.error(`  BOX ❄️ kF0 対照: 同じ移動で ${fmt(r.pluto.kF0.dPsidPct, 6)}% 変化・ビット同一=${r.pluto.kF0.bitIdentical}`);
}

// ============================================================ EQ: 等質量度だけを振って A0 が動くか
// **本便の中心の実験**。ID 節で「2.000 と 2.025 の差の全部が A0(λ_PN=0 の基線)である」ことが出たので、
// 次は **A0 を決めているのは何か**を、系の他の量を固定したまま**質量比だけ**を振って測る
// (第249便a の __w249nuBuild と同じ作り方: 総質量 M・分離・相対速度を固定して重心配分だけを変える)。
if (want('eq')) {
  const rows = [];
  for (const base of ['psrDoubleABDFM', 'psrB1534DFM']) {
    for (const dm of [0, 4.667e-3, 1.414e-2, 2.056e-2, 3.453e-2, 0.1, 0.3]) {
      const NP = FAST ? 4 : 6;
      const r = await pg.evaluate(([id, dm, dt, NP]) => {
        const W = window.__w252, src = HP.allPresets().find((q) => q.id === id);
        const s = W.SYS[id], Pu = s.PobsS / s.Tunit;
        const go = (lam) => {
          const pd = JSON.parse(JSON.stringify(src));
          const m0 = src.bodies[0].m, m1 = src.bodies[1].m, M = m0 + m1;
          const sep = Math.abs(src.bodies[1].x - src.bodies[0].x);
          const vrel = Math.abs(src.bodies[1].vy - src.bodies[0].vy);
          const mA = M * (1 + dm) / 2, mB = M * (1 - dm) / 2;   // |m₁−m₂|/M = dm・総質量は不変
          pd.bodies[0].m = mA; pd.bodies[1].m = mB;
          pd.bodies[0].x = -sep * mB / M; pd.bodies[1].x = sep * mA / M;
          pd.bodies[0].vy = -vrel * mB / M; pd.bodies[1].vy = vrel * mA / M;
          if (pd.bodies[0].core) pd.bodies[0].core.massFrac = 0.4;   // コアは両者同じ分率に揃える(比較の統制)
          if (pd.bodies[1].core) pd.bodies[1].core.massFrac = 0.4;
          pd.physics.framePrecision = 'double';
          pd.physics.lambdaPN = lam;
          delete pd.massCalibration;
          const v = HP.validatePreset(pd); const S = HP.sim; S.build(v.preset);
          const o = W.peri(S, dt, (NP + 0.6) * Pu, Pu, NP);
          o.M = M; o.mA = mA; o.mB = mB; o.nu = mA * mB / (M * M);
          o.obsDeg = s.omegaDot * s.PobsS / W.YR;
          o.PmeasS = (o.A.perMean === null) ? null : o.A.perMean * s.Tunit;
          return o;
        };
        const a0 = go(0), a1 = go(1);
        return { A0: a0.A.slopeDeg, AF: a1.A.slopeDeg, obsDeg: a1.obsDeg, nu: a1.nu,
          cmDev0: a0.cmDev, cmDev1: a1.cmDev, eProxy: a1.eProxy,
          PmeasS: a1.PmeasS, nan: a1.nan, clamp: a1.clamp };
      }, [base, dm, DT, NP]);
      const row = { base, dmOverM: dm, eqMass4nu: 4 * r.nu, nu: r.nu,
        A0: r.A0, AF: r.AF, APN: (r.A0 === null || r.AF === null) ? null : r.AF - r.A0,
        obsDeg: r.obsDeg,
        A0OverObsPct: (r.A0 === null) ? null : 100 * r.A0 / r.obsDeg,
        ratio: (r.AF === null) ? null : r.AF / r.obsDeg,
        ratioPN: (r.A0 === null || r.AF === null) ? null : (r.AF - r.A0) / r.obsDeg,
        cmDev0: r.cmDev0, cmDev1: r.cmDev1, nan: r.nan, clamp: r.clamp };
      rows.push(row);
      console.error(`  EQ ${base} |Δm|/M=${dm}: A0=${exp3(row.A0)}(obs 比 ${fmt(row.A0OverObsPct, 4)}%)`
        + ` A_PN/obs=${fmt(row.ratioPN, 6)} 全体比=${fmt(row.ratio, 6)} 重心の弾道ずれ(λ=0)=${exp3(row.cmDev0)}`);
    }
  }
  out.eq = { dt: DT, rows };
}

// ============================================================ DIAG: A0 のノックアウト(何が A0 を作るか)
if (want('diag')) {
  const KO = [
    { tag: '基線(宣言のまま)', patch: {} },
    { tag: 'coupleSink→reservoir', patch: { coupleSink: 'reservoir' } },
    { tag: 'cmGauge を外す', patch: { cmGauge: '__delete' } },
    { tag: 'frameWeight→share', patch: { frameWeight: 'share' } },
    { tag: 'D0pull→D₀(0.006)', patch: { D0pull: 0.006 } },
    { tag: 'D0pull→1e-3(χ↓)', patch: { D0pull: 1e-3 } },
    { tag: 'softening 0.05→0.005', patch: { softening: 0.005 } },
    { tag: 'kFrame→0(引きずり切)', patch: { kFrame: 0 } },
  ];
  const rows = [];
  for (const id of ['psrB1534DFM', 'psrDoubleABDFM']) {
    for (const ko of KO) {
      const NP = FAST ? 4 : 6;
      const r = await pg.evaluate(([id, patch, dt, NP]) => {
        const W = window.__w252;
        const o = W.run(id, Object.assign({ lambdaPN: 0, framePrecision: 'double' }, patch), dt, NP);
        return { A0: o.A.slopeDeg, obsDeg: o.obsDeg, cmDev: o.cmDev, nan: o.nan, clamp: o.clamp,
          eProxy: o.eProxy, warnFree: true };
      }, [id, ko.patch, DT, FAST ? 4 : 6]);
      rows.push({ id, tag: ko.tag, patch: ko.patch, A0: r.A0, obsDeg: r.obsDeg,
        A0OverObsPct: (r.A0 === null) ? null : 100 * r.A0 / r.obsDeg, cmDev: r.cmDev,
        nan: r.nan, clamp: r.clamp });
      const z = rows[rows.length - 1];
      console.error(`  DIAG ${id} ${ko.tag}: A0=${exp3(z.A0)}(obs 比 ${fmt(z.A0OverObsPct, 4)}%)`);
    }
  }
  out.diag = { dt: DT, rows };
}

// ============================================================ D0: D0pull=0 の意味
if (want('d0')) {
  const r = await pg.evaluate(() => {
    const res = {};
    // ① 検証器: 明示 0 は DRAG_CH_DEFAULT と同値なので **ph へ入らない**(=未宣言と署名同一)
    const base = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === 'psrDoubleABDFM')));
    const mkv = (val) => { const pd = JSON.parse(JSON.stringify(base));
      if (val === '__delete') delete pd.physics.D0pull; else pd.physics.D0pull = val;
      delete pd.massCalibration;
      const v = HP.validatePreset(pd);
      return { ok: v.ok, D0pull: v.preset.physics.D0pull, sig: JSON.stringify(v.preset.physics) }; };
    res.validator = { declared: mkv(3.24204e-7), zero: mkv(0), removed: mkv('__delete') };
    res.zeroIsDropped = res.validator.zero.D0pull === undefined;
    res.zeroSigEqRemoved = res.validator.zero.sig === res.validator.removed.sig;
    // ② params へ直接 0 を書いたときの場コードと compactForce の一致(分母が同じ D0p を読むか)
    //    エンジンの実行時 χ は S._compactForce が計算する。宣言つきの 🪝 で D0pull を差し替えて比べる。
    const cf = (D0pull) => {
      const pd = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === 'psrDoubleABCF')));
      delete pd.massCalibration;
      const v = HP.validatePreset(pd); const S = HP.sim; S.build(v.preset);
      if (D0pull !== undefined) S.params.D0pull = D0pull;   // 検証器を通さず params を直接叩く(意味の確認)
      S._compactForce(0.016);
      return { chiMin: S.compactChiMin, chiMax: S.compactChiMax, onN: S.compactN, gateN: S.compactGateN, U: S.compactU };
    };
    res.engine = { declared: cf(undefined), zero: cf(0), huge: cf(1e12), d0Value: cf(0.006) };
    // ③ 純関数側の対応(同じ式を JS で解いた値)
    const p = HP.allPresets().find((q) => q.id === 'psrDoubleABCF');
    const b = p.bodies, m1 = b[0].m, m2 = b[1].m;
    const d = Math.hypot(b[1].x - b[0].x, b[1].y - b[0].y), eps = p.physics.softening;
    res.analytic = {
      atDeclared: window.__w252.chiAt(m1, m2, d, p.physics.D0pull, eps, 2),
      atZero: window.__w252.chiAt(m1, m2, d, 0, eps, 2),
      atD0: window.__w252.chiAt(m1, m2, d, p.physics.D0, eps, 2),
      atHuge: window.__w252.chiAt(m1, m2, d, 1e12, eps, 2) };
    return res;
  });
  out.d0 = r;
  console.error(`  D0 検証器: 明示 0 は ph から落ちる=${r.zeroIsDropped}・未宣言と署名同一=${r.zeroSigEqRemoved}`);
  console.error(`  D0 エンジン(🪝 の _compactForce 1 キック): 宣言 χ=${r.engine.declared.chiMin.toFixed(8)}`
    + ` / params.D0pull=0 → χ=${r.engine.zero.chiMin.toFixed(8)}(on ${r.engine.zero.onN})`
    + ` / 1e12 → χ=${r.engine.huge.chiMin.toExponential(3)}(on ${r.engine.huge.onN}・gate ${r.engine.huge.gateN})`);
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
out.pageErrors = pageErrors;
// 節を絞って回したときは**既存 JSON へ差し替える**(全節を 1 度に回さなくても 1 枚の結果ファイルになる)
if (only.length && fs.existsSync(OUT)) {
  try {
    const prev = JSON.parse(fs.readFileSync(OUT, 'utf8'));
    for (const k of Object.keys(prev)) if (out[k] === undefined) out[k] = prev[k];
    out.sectionsRun = only;
  } catch { /* 壊れた既存ファイルは無視して上書きする */ }
}
fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
console.error(`\n→ ${path.relative(ROOT, OUT)}(pageerrors ${pageErrors.length})`);
await browser.close();

// 第256便b W2「銀河 —— 外縁の引きずり限界 R_slip(固定した静止背景に対する並進 V の掃引)」(第48報)。
//
// 原仮定者(第48報・原文は docs/PHYSICS.md 〔第256便b〕に引用):
//   「銀河は、中心部の巨大ブラックホールと無数の天体で、安定した空間メッシュを構成する。
//    銀河も宇宙に対して移動しているので、無数に連なった天体を引きずる限界の半径が、外縁の境界になる」
//
// **測るのは診断量だけである**。「外縁を予測した」とは書かない —— 円盤を R で切って生成してもいない。
// **力へは 1 バイトも接続しない**(第254便b/第255便b と同じ、表示と記録の層)。
// **観測回転曲線は 1 つも入力しない**(u_n はエンジンの粒子速度だけから作る)。
//
// 測る量:
//   ① 有効範囲    —— 🎠 の既定(disk/affine)で nEff・supportR・rSupport・wSum・unValid を r で並べる。
//                     **外挿は null にせず印を立てる**(χ 混合はそのまま続く)ことを数で見せる。
//   ② R_slip(式)—— ChatGPT §4.4 の閾値式 R_slip=[A w*/(D₀(V−w*))]^(1/p)。A は**実測**する
//                     (遠方で W·r^p → A に収束するので、その台地の値を読む。M_tot と並べる)。
//   ③ R_slip(実測)—— 同じ場で (1−χ(r))·V = w* を切る半径を**二分法**で探す(風上/風下/直交の 3 方向)。
//   ④ r ビンの記録 —— χ(r)・(1−χ)|V|・|v−u|(粒子ごとに場を読んだ質量重み平均)を V 5 段で。
//   ⑤ D₀ 2 段 × p 2 段 —— 式と実測の一致/不一致が D₀・p でどう動くか。
//
// 診断コピー: 🎠 galaxyMeshSpiral の**中心 pinned を外し、全粒子に同じバルク速度 V を足した**宇宙。
//   背景は **bg:"static"(u_bg=0 = 固定した静止背景)**。bg:"frame"(現行の背景)は対照として別欄。
//
// 実行: node tests/exp-w256b-galaxyedge.mjs [--range] [--slip] [--bins] [--dp]
//   QA_TARGET=beta/index.html(既定)
// 出力: tests/out/galaxyedge-w256b.json(.gitignore 既定どおり未コミット —— 数値は PHYSICS に全載)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + (path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET));
const OUT = process.env.W256B_OUT || path.join(ROOT, 'tests', 'out', 'galaxyedge-w256b.json');
const argv = process.argv.slice(2);
const only = argv.filter((a) => a.startsWith('--')).map((a) => a.slice(2));
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

const out = { target: TARGET, node: process.version, at: new Date().toISOString(), wave: '256b' };

await pg.evaluate(() => {
  const W = (window.__w256b = {});
  W.byId = (id) => HP.allPresets().find((p) => p.id === id);
  // 診断コピー: 中心 pinned を外し、全粒子へ同じバルク速度 V を足す(**エンジンには何も足さない**)
  W.build = (id, steps, V) => {
    const pd = JSON.parse(JSON.stringify(W.byId(id)));
    const v = HP.validatePreset(pd);
    if (!v.ok) throw new Error('invalid ' + id);
    const S = HP.sim; S.build(v.preset);
    for (let k = 0; k < (steps || 0); k++) S.step(0.016);
    if (V) for (let i = 0; i < S.n; i++) { S.vx[i] += V; if (S.pinned) S.pinned[i] = 0; }
    S._galSup = null;    // pinned を直接いじったので支持の一時表を捨てる(器だけの操作)
    return S;
  };
  // 円盤の代表回転速度(質量重み平均の |v_φ| —— **観測ではなくこの宇宙の中の量**)
  W.vRep = (S) => {
    let M = 0, s = 0;
    for (let i = 0; i < S.n; i++) {
      const r = Math.hypot(S.x[i], S.y[i]);
      if (!(r > 5)) continue;
      const vphi = (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]) / r;
      M += S.m[i]; s += S.m[i] * Math.abs(vphi);
    }
    return M > 0 ? s / M : 0;
  };
  // 1 点の χ(方向 e の半径 r)
  W.chiAt = (S, r, ex, ey, fo) => {
    const f = HP.dfmGalaxyMeshField(S, r * ex, r * ey, Object.assign({ need: 'u', bg: 'static' }, fo || {}));
    return f ? f.chi : null;
  };
  // (1−χ(r))·V = w* を切る半径(二分法・単調でなくても「初めて超える」点を挟む)
  W.slipRadius = (S, V, wStar, ex, ey, fo, rHi) => {
    const g = (r) => { const c = W.chiAt(S, r, ex, ey, fo); return c === null ? null : (1 - c) * V - wStar; };
    let lo = 0.5, hi = rHi || 2000;
    const gl = g(lo), gh = g(hi);
    if (gl === null || gh === null) return null;
    if (gl > 0) return { r: lo, note: 'already-slipping-at-rMin' };   // 中心でも既に w* を超える
    if (gh < 0) return { r: null, note: 'never-slips-below-rMax' };
    for (let k = 0; k < 60; k++) { const md = 0.5 * (lo + hi); (g(md) < 0 ? lo = md : hi = md); }
    return { r: 0.5 * (lo + hi), note: 'bisect' };
  };
});

// ============================================================ ① 有効範囲(第255便b ⑧-3 への回答)
if (want('range')) {
  out.range = await pg.evaluate(() => {
    const W = window.__w256b;
    const S = W.build('galaxyMeshSpiral', 3000, 0);
    const decl = JSON.parse(JSON.stringify(S.overlays.galaxyField || null));
    const rows = [];
    for (const r of [10, 50, 100, 200, 251, 265, 280, 400, 520]) {
      const f = HP.dfmGalaxyMeshField(S, r, 0, { need: 'u' });          // 宣言(disk/affine)の既定
      const g = HP.dfmGalaxyMeshField(S, r, 0, { need: 'u', unSource: 'all', unFit: 'mean' });
      rows.push({ r, unSource: f.unSource, unFit: f.unFit,
        nEff: f.nEff, wSum: f.wSum, supportR: f.supportR, rSupport: f.rSupport, unValid: f.unValid,
        chi: f.chi, uAbs: Math.hypot(f.u[0], f.u[1]), unAbs: Math.hypot(f.un[0], f.un[1]),
        nEffMean: g.nEff, unAbsMean: Math.hypot(g.un[0], g.un[1]), unValidMean: g.unValid });
    }
    // 粒子の最外縁と支持半径の関係
    let rMax = 0, vMax = 0;
    for (let i = 0; i < S.n; i++) { rMax = Math.max(rMax, Math.hypot(S.x[i], S.y[i])); vMax = Math.max(vMax, Math.hypot(S.vx[i], S.vy[i])); }
    const f0 = HP.dfmGalaxyMeshField(S, 0.001, 0, { need: 'u' });
    return { decl, rows, rMaxParticle: rMax, vMaxParticle: vMax, n: S.n, t: S.t,
      supportR: f0.supportR, supportN: f0.supportN, supportC: f0.supportC, pad: HP.GALMESH_SUPPORT_PAD };
  });
  console.log('§RANGE done');
}

// ============================================================ ②③ R_slip(式と実測)
if (want('slip')) {
  out.slip = await pg.evaluate(() => {
    const W = window.__w256b;
    const S0 = W.build('galaxyMeshSpiral', 3000, 0);
    const vRep = W.vRep(S0);
    let M = 0; for (let i = 0; i < S0.n; i++) M += S0.m[i];
    const res = { vRep, mTotal: M, t: S0.t, n: S0.n, cases: [] };
    // A の実測(遠方で W·r^p が台地に乗る)
    res.amp = [];
    for (const p of [2, 3]) {
      const row = { p, probe: [] };
      for (const r of [300, 400, 600, 1000, 2000]) {
        const f = HP.dfmGalaxyMeshField(S0, r, 0, { need: 'u', bg: 'static', p });
        row.probe.push({ r, W: f.W, Arp: f.W * Math.pow(r, p) });
      }
      row.A = row.probe[row.probe.length - 1].Arp;
      row.AoverM = row.A / M;
      res.amp.push(row);
    }
    const D0dflt = HP.dfmGalaxyMeshField(S0, 100, 0, { need: 'u', bg: 'static' }).D0;
    res.D0default = D0dflt;
    const dirs = [{ k: 'downwind(+V)', e: [1, 0] }, { k: 'upwind(-V)', e: [-1, 0] }, { k: 'perp', e: [0, 1] }];
    const wStars = [0.1, 0.5, 2.0];
    for (const mulV of [0, 0.5, 1, 2, 4]) {
      const V = mulV * vRep;
      const S = W.build('galaxyMeshSpiral', 3000, V);
      for (const D0 of [D0dflt, 10 * D0dflt]) {
        for (const p of [2, 3]) {
          const A = res.amp.find((z) => z.p === p).A;
          const fo = { D0, p };
          for (const wS of wStars) {
            const formula = (V > wS) ? Math.pow(A * wS / (D0 * (V - wS)), 1 / p) : null;
            const meas = {};
            for (const d of dirs) {
              const m = (V > 0) ? W.slipRadius(S, V, wS, d.e[0], d.e[1], fo, 5000) : null;
              meas[d.k] = m ? m.r : null;
              meas[d.k + ':note'] = m ? m.note : 'V=0';
            }
            res.cases.push({ mulV, V, D0, p, wStar: wS, A, formula, meas,
              ratio: (formula && meas['downwind(+V)']) ? meas['downwind(+V)'] / formula : null });
          }
        }
      }
    }
    return res;
  });
  console.log('§SLIP done cases=' + out.slip.cases.length);
}

// ============================================================ ④ r ビンの記録(χ・(1−χ)V・|v−u|)
if (want('bins')) {
  out.bins = await pg.evaluate(() => {
    const W = window.__w256b;
    const S0 = W.build('galaxyMeshSpiral', 3000, 0);
    const vRep = W.vRep(S0);
    const res = { vRep, runs: [] };
    for (const mulV of [0, 0.5, 1, 2, 4]) {
      const V = mulV * vRep;
      const S = W.build('galaxyMeshSpiral', 3000, V);
      const nb = 8, rMax = 260, wid = rMax / nb;
      const bins = [];
      for (let b = 0; b < nb; b++) bins.push({ r: wid * (b + 0.5), mass: 0, sumChi: 0, sumDiff: 0, sumSlip: 0, count: 0, sumDiffPerp: 0 });
      for (let i = 0; i < S.n; i++) {
        const r = Math.hypot(S.x[i], S.y[i]);
        if (!(r > 0) || r >= rMax) continue;
        const b = Math.min(nb - 1, Math.floor(r / wid)), B = bins[b], m = S.m[i];
        if (!(m > 0)) continue;
        const f = HP.dfmGalaxyMeshField(S, S.x[i], S.y[i], { need: 'u', bg: 'static' });
        if (!f) continue;
        const dvx = S.vx[i] - f.u[0], dvy = S.vy[i] - f.u[1];
        B.mass += m; B.count++;
        B.sumChi += m * f.chi;
        B.sumDiff += m * Math.hypot(dvx, dvy);
        B.sumSlip += m * (1 - f.chi) * V;
      }
      res.runs.push({ mulV, V, bins: bins.map((B) => ({ r: B.r, count: B.count,
        chi: B.mass > 0 ? B.sumChi / B.mass : null,
        slipTrans: B.mass > 0 ? B.sumSlip / B.mass : null,
        vMinusU: B.mass > 0 ? B.sumDiff / B.mass : null })) });
    }
    // 対照: bg:"frame"(現行の背景 —— 固定した静止背景ではない)
    {
      const V = 1 * vRep, S = W.build('galaxyMeshSpiral', 3000, V);
      const rows = [];
      for (const r of [16.25, 81.25, 146.25, 243.75]) {
        const a = HP.dfmGalaxyMeshField(S, r, 0, { need: 'u', bg: 'static' });
        const b = HP.dfmGalaxyMeshField(S, r, 0, { need: 'u', bg: 'frame' });
        rows.push({ r, chiStatic: a.chi, uStatic: a.u, chiFrame: b.chi, uFrame: b.u, ubgFrame: b.ubg });
      }
      res.bgControl = { V, rows };
    }
    return res;
  });
  console.log('§BINS done');
}

// ============================================================ ⑥ 逆問題: 半径 R を「引きずる」のに要る許容すべり s=w*/V
//   閾値式は R_slip^p = (A/D₀)·s/(1−s) と書き直せる(s=w*/V)—— **V と w* は比でしか入らない**。
//   実測側は (1−χ(R))·V=w* ⇔ **s = 1−χ(R)** なので、式と実測の比較は
//   「遠方近似の χ_far=A/(A+D₀r^p)」対「実際の χ(r)」の比較そのものになる。
if (want('inv')) {
  out.inv = await pg.evaluate(() => {
    const W = window.__w256b;
    const S = W.build('galaxyMeshSpiral', 3000, 0);
    let M = 0, rRim = 0;
    for (let i = 0; i < S.n; i++) { M += S.m[i]; rRim = Math.max(rRim, Math.hypot(S.x[i], S.y[i])); }
    const rows = [];
    for (const D0 of [1.5, 15]) for (const p of [2, 3]) {
      const A = M;
      const probe = [];
      for (const r of [20, 50, 100, 200, rRim, 300, 520]) {
        const f = HP.dfmGalaxyMeshField(S, r, 0, { need: 'u', bg: 'static', D0, p });
        const chiFar = A / (A + D0 * Math.pow(r, p));
        probe.push({ r, chi: f.chi, chiFar, sNeed: 1 - f.chi, sFar: 1 - chiFar,
          relErrChi: (f.chi - chiFar) / chiFar });
      }
      // s(許容すべりの割合)を与えたときの R_slip = [(A/D₀)·s/(1−s)]^(1/p)(**V は入らない**)と、
      // その半径での実測 χ から出る s(=1−χ)を並べる
      const sTable = [];
      for (const s of [0.1, 0.25, 0.5, 0.75, 0.9, 0.95, 0.99]) {
        const R = Math.pow((A / D0) * s / (1 - s), 1 / p);
        const f = HP.dfmGalaxyMeshField(S, R, 0, { need: 'u', bg: 'static', D0, p });
        sTable.push({ s, Rformula: R, chiAtR: f ? f.chi : null, sMeasuredAtR: f ? 1 - f.chi : null });
      }
      rows.push({ D0, p, A, probe, sTable });
    }
    return { mTotal: M, rRim, rows,
      note: 's=w*/V。R_slip^p=(A/D₀)s/(1−s) は遠方近似 χ_far=A/(A+D₀r^p) と同値で、実測は s=1−χ(R)' };
  });
  console.log('§INV done');
}

// ============================================================ ⑤ D₀ 2 段 × p 2 段(χ の形)
if (want('dp')) {
  out.dp = await pg.evaluate(() => {
    const W = window.__w256b;
    const S = W.build('galaxyMeshSpiral', 3000, 0);
    const rows = [];
    for (const D0 of [1.5, 15]) for (const p of [2, 3]) {
      const r0 = [];
      for (const r of [20, 80, 160, 240, 320]) {
        const f = HP.dfmGalaxyMeshField(S, r, 0, { need: 'u', bg: 'static', D0, p });
        r0.push({ r, chi: f.chi, W: f.W });
      }
      rows.push({ D0, p, probe: r0 });
    }
    return { rows };
  });
  console.log('§DP done');
}

out.pageErrors = pageErrors;
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log('written', OUT, 'pageErrors', pageErrors.length);
await browser.close();

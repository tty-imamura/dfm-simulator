// 第258便b W2「銀河の場の D₀×q×kFrame×bg 感度表 —— 同じ χ でも u が変わる経路を数にする」(第50報)。
//
// 原仮定者(第50報・原文は docs/PHYSICS.md 〔第258便b〕に引用):
//   「空間メッシュの実装について精査する。現実較正に使える精度か。『背景決定力 D₀』
//    『引きずり減衰 q』『空間引きずり kFrame』との関係」
//
// 測るのは診断量だけである。**粒子は 1 步も再積分しない**(🎠 の初期状態を 1 回だけ組み、
// 場 dfmGalaxyMeshField を読むだけ)。**力へは 1 バイトも接続しない。観測回転曲線は入力しない。**
//
// 測る量:
//   ① **感度表** —— 点 (50,30) と r ビン(20/80/140/240・方位 32 点の平均)で
//      D₀ 0/1.5/15 × q 1/2/6 × kFrame 0/1 × bg "frame"/"static" の
//      χ・u・|u|・|u_n|・|u_bg|・u_φ・timeDerivativeComplete。
//   ② **経路の分離** —— bg:"static" では u=χ·u_n なので q・kFrame に**ビット不変**であること、
//      bg:"frame"(既定)では u_bg=dfmFrameAt が q(スピン引きずりの距離減衰 (R/(R+h))^q)と
//      kFrame(u_bg 全体に掛かる)を読むので u が変わること。**χ は両方で同一**であること。
//   ③ **D₀ の単調性** —— D₀ を上げると χ は単調に下がるが、**表示の回転 u_φ は単調に小さくならない**
//      (u_bg の分母にも D₀ が入るため)。同義でないことを数で出す。
//   ④ **D₀=0 の極** —— χ=1 厳密・u=u_n(bg に依らずビット同一)。
//
// **「銀河サンプルが完成した」「平坦回転曲線」「外縁を予測した」とは書かない。**
//
// 実行: node tests/exp-w258b-galaxybg.mjs [--grid] [--mono] [--pole]
// 出力: tests/out/galaxybg-w258b.json(未コミット —— 数値は PHYSICS に全載)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + (path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET));
const OUT = process.env.W258B_OUT || path.join(ROOT, 'tests', 'out', 'galaxybg-w258b.json');
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

const out = { target: TARGET, node: process.version, at: new Date().toISOString(), wave: '258b' };

await pg.evaluate(() => {
  const W = (window.__w258b = {});
  W.byId = (id) => HP.allPresets().find((p) => p.id === id);
  // 診断コピー: 🎠 を組むだけ(**粒子は 1 步も進めない**)
  W.build = (id, steps) => {
    const pd = JSON.parse(JSON.stringify(W.byId(id)));
    const v = HP.validatePreset(pd);
    if (!v.ok) throw new Error('invalid ' + id);
    const S = HP.sim; S.build(v.preset);
    for (let k = 0; k < (steps || 0); k++) S.step(0.016);
    S._galSup = null;
    return S;
  };
  // D₀・q・kFrame を差し替える(**診断コピーの params だけ** —— プリセットは 1 文字も動かない)
  W.setp = (S, D0, q, kF) => {
    S.params.D0 = D0;
    if (S.params.D0pull !== undefined) S.params.D0pull = D0;
    S.params.q = q; S.params.kFrame = kF;
    S._galSup = null;
  };
  // 1 点の読み(need は既定 uBt = ∂ₜu まで要求する)
  W.at = (S, x, y, bg) => {
    const f = HP.dfmGalaxyMeshField(S, x, y, { bg });
    if (!f) return null;
    const r = Math.hypot(x, y);
    const uphi = r > 0 ? (x * f.u[1] - y * f.u[0]) / r : 0;
    return { chi: f.chi, W: f.W, D0: f.D0, u: [f.u[0], f.u[1]], uabs: Math.hypot(f.u[0], f.u[1]),
      un: Math.hypot(f.un[0], f.un[1]), ubg: Math.hypot(f.ubg[0], f.ubg[1]), uphi,
      tdc: f.timeDerivativeComplete, unValid: f.unValid, unFit: f.unFit, unSource: f.unSource };
  };
  // r ビン(方位 nA 点の平均)
  W.ring = (S, r, bg, nA) => {
    const N = nA || 32;
    let chi = 0, uabs = 0, uphi = 0, un = 0, ubg = 0, tdc = true, ok = 0;
    for (let k = 0; k < N; k++) {
      const th = 2 * Math.PI * k / N;
      const a = W.at(S, r * Math.cos(th), r * Math.sin(th), bg);
      if (!a) continue;
      ok++; chi += a.chi; uabs += a.uabs; uphi += a.uphi; un += a.un; ubg += a.ubg;
      if (!a.tdc) tdc = false;
    }
    if (!ok) return null;
    return { r, n: ok, chi: chi / ok, uabs: uabs / ok, uphi: uphi / ok, un: un / ok, ubg: ubg / ok, tdc };
  };
});

// ---------- ① 感度表(点 (50,30) と r ビン)
if (want('grid')) {
  out.grid = await pg.evaluate(() => {
    const W = window.__w258b;
    const S = W.build('galaxyMeshSpiral', 0);
    const D0s = [0, 1.5, 15], qs = [1, 2, 6], kFs = [0, 1], bgs = ['frame', 'static'];
    const rows = [], rings = [];
    for (const D0 of D0s) for (const q of qs) for (const kF of kFs) for (const bg of bgs) {
      W.setp(S, D0, q, kF);
      const a = W.at(S, 50, 30, bg);
      rows.push({ D0, q, kF, bg, ...a });
      for (const r of [20, 80, 140, 240]) {
        const g = W.ring(S, r, bg);
        rings.push({ D0, q, kF, bg, ...g });
      }
    }
    // ② bg:"static" の q/kFrame 不変(ビット同一)と bg:"frame" の変化
    const bit = (a, b) => Object.is(a, b);
    const pick = (D0, q, kF, bg) => rows.find((z) => z.D0 === D0 && z.q === q && z.kF === kF && z.bg === bg);
    const cmp = (D0) => {
      const s1 = pick(D0, 1, 1, 'static'), s6 = pick(D0, 6, 1, 'static');
      const sk0 = pick(D0, 1, 0, 'static');
      const f1 = pick(D0, 1, 1, 'frame'), f6 = pick(D0, 6, 1, 'frame'), fk0 = pick(D0, 1, 0, 'frame');
      return { D0,
        staticQBit: bit(s1.u[0], s6.u[0]) && bit(s1.u[1], s6.u[1]),
        staticKBit: bit(s1.u[0], sk0.u[0]) && bit(s1.u[1], sk0.u[1]),
        chiSameQ: bit(f1.chi, f6.chi) && bit(f1.chi, s1.chi),
        frameQ1: f1.u, frameQ6: f6.u, frameK0: fk0.u, staticU: s1.u,
        ratioQ: Math.hypot(f6.u[0], f6.u[1]) / (Math.hypot(f1.u[0], f1.u[1]) || 1),
        frameK0EqStatic: bit(fk0.u[0], s1.u[0]) && bit(fk0.u[1], s1.u[1]) };
    };
    return { rows, rings, cmp: [cmp(0), cmp(1.5), cmp(15)],
      tdcAllFalse: rows.every((z) => z.tdc === false), n: rows.length };
  });
  console.log('grid rows', out.grid.n, 'tdcAllFalse', out.grid.tdcAllFalse);
}

// ---------- ③ D₀ の単調性(χ は単調減・u_φ は?)
if (want('mono')) {
  out.mono = await pg.evaluate(() => {
    const W = window.__w258b;
    const S = W.build('galaxyMeshSpiral', 0);
    const D0s = [0, 0.15, 1.5, 15, 150, 1500];
    const outv = [];
    for (const bg of ['frame', 'static']) for (const q of [1, 2, 6]) {
      const row = { bg, q, pts: [] };
      for (const D0 of D0s) {
        W.setp(S, D0, q, 1);
        const g = W.ring(S, 80, bg);
        const a = W.at(S, 50, 30, bg);
        row.pts.push({ D0, chi: g.chi, uabs: g.uabs, uphi: g.uphi, ubg: g.ubg,
          ptChi: a.chi, ptU: a.uabs });
      }
      const chiMono = row.pts.every((p, i) => i === 0 || p.chi < row.pts[i - 1].chi);
      const uMono = row.pts.every((p, i) => i === 0 || Math.abs(p.uphi) < Math.abs(row.pts[i - 1].uphi));
      outv.push({ ...row, chiMono, uphiMono: uMono });
    }
    return outv;
  });
  for (const r of out.mono) console.log('mono', r.bg, 'q=' + r.q, 'chiMono', r.chiMono, 'uphiMono', r.uphiMono);
}

// ---------- ④ D₀=0 の極(χ=1 厳密・u=u_n・bg に依らない)
if (want('pole')) {
  out.pole = await pg.evaluate(() => {
    const W = window.__w258b;
    const S = W.build('galaxyMeshSpiral', 0);
    W.setp(S, 0, 2, 1);
    const f = HP.dfmGalaxyMeshField(S, 50, 30, { bg: 'frame' });
    const s = HP.dfmGalaxyMeshField(S, 50, 30, { bg: 'static' });
    return { chiFrame: f.chi, chiStatic: s.chi,
      uBit: Object.is(f.u[0], s.u[0]) && Object.is(f.u[1], s.u[1]),
      uEqUn: Object.is(f.u[0], f.un[0]) && Object.is(f.u[1], f.un[1]),
      u: f.u, un: f.un, tdc: f.timeDerivativeComplete };
  });
  console.log('pole', JSON.stringify(out.pole));
}

out.pageErrors = pageErrors;
await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log('wrote', OUT);

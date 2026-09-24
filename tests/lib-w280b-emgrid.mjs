// 第280便b(統括の読み R70)— **地球–月の 1 表**の器(純 Node・ブラウザ不要)。
//
// ■ 何をするか
//   `beta/index.html` の inline script を **Node の主コンテキスト**で読み込み(`vm.runInThisContext` —— 第279便b の
//   headless 器は vm の別コンテキストで、最上位の関数呼び出しが遅い〔同じ 🌘 で 1/3〜1/5 の步/秒〕ため、長い走行には
//   こちらを使う。**物理コード(validatePreset / sim.build / sim.step)は html の本文そのまま**を実行する)、
//   一つの初期状態から条件を**一つずつ**変えたコピーを同じ抽出器・同じ窓で走らせる。
//
// ■ 抽出器(全行で同じ)
//   ・近点検出器 B(相対距離の極小 —— 3 点の放物線の頂点で時刻と方位を内挿)。**位置だけ**を読む
//     (meshVelocity を宣言した行では `vx,vy` が慣性速度 v=ẋ−u なので、速度から ṙ を作る検出器 A は使えない)。
//   ・検出器 A(ṙ の −→+ 交差 —— 正式の判定器 `exp-w249b-calaudit` と同じ手続き)も並記する(meshVelocity の行は参考値)。
//   ・窓: 月の同方向公転(相対角の連続化)で数えて **最初の 8 公転** と **最初の 27 公転** に入る近点。
//   ・近点方位の直線 fit(近点番号に対する傾き [deg/周] と、時刻に対する傾き → 近点回転の周期 [年])。
//   **正式の判定器の置換ではない**(窓と検出器の選び方が違う —— 同じ表の中での比較のための 1 つの物差し)。
import fs from 'node:fs';
import vm from 'node:vm';
import { makeUniversalStub } from './lib-w279b-headless.mjs';

export const EMGRID_LIB_VERSION = 'w280b-emgrid-1';
export const YEAR_UNITS_EM = 365.25 * 86400 / 100;        // 🌘 系(時間 1 単位 = 10² s)のユリウス年
export const DAY_UNITS_EM = 864;

/** html を主コンテキストで読み込む(1 プロセスに 1 回だけ)。戻り値 HP。 */
export function loadHtmlMain(htmlPath) {
  const html = fs.readFileSync(htmlPath, 'utf8');
  const m = html.match(/<script>([\s\S]*)<\/script>/);
  if (!m) throw new Error('inline <script> が無い');
  const stub = makeUniversalStub();
  const mem = () => { const mm = new Map(); return { getItem: (k) => (mm.has(String(k)) ? mm.get(String(k)) : null),
    setItem: (k, v) => mm.set(String(k), String(v)), removeItem: (k) => mm.delete(String(k)), clear: () => mm.clear(),
    key: () => null, get length() { return mm.size; } }; };
  const G = globalThis;
  Object.assign(G, { document: stub, localStorage: mem(), sessionStorage: mem(), requestAnimationFrame: () => 0, cancelAnimationFrame: () => {},
    matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }),
    getComputedStyle: () => stub, ResizeObserver: function () { return stub; }, MutationObserver: function () { return stub; },
    IntersectionObserver: function () { return stub; }, Image: function () { return stub; }, alert: () => {}, confirm: () => false,
    prompt: () => null, addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => true,
    innerWidth: 390, innerHeight: 844, devicePixelRatio: 1, screen: { width: 390, height: 844 },
    CustomEvent: function () { return stub; },
    location: { href: 'file:///headless/index.html', search: '', hash: '', protocol: 'file:', hostname: '', pathname: '/headless/index.html', origin: 'null' } });
  Object.defineProperty(G, 'navigator', { value: { language: 'ja', languages: ['ja'], userAgent: 'node-main', clipboard: stub }, configurable: true, writable: true });
  const st0 = G.setTimeout, si0 = G.setInterval, ce = console.error, cw = console.warn, cl = console.log;
  G.setTimeout = () => 0; G.setInterval = () => 0; G.window = G; G.self = G;
  const errs = [];
  console.error = (...a) => errs.push(a.map(String).join(' ')); console.warn = () => {}; console.log = () => {};
  try { vm.runInThisContext(m[1], { filename: htmlPath }); }
  finally { console.error = ce; console.warn = cw; console.log = cl; G.setTimeout = st0; G.setInterval = si0; }
  if (!G.HP) throw new Error('HP が公開されない');
  return { HP: G.HP, errors: errs };
}

/** 近点方位の直線 fit(calaudit の fit と同じ流儀: 近点側だけ・重複除去・unwrap)。 */
export function fitPeri(raw, rMin, rMax, pRef, dt) {
  const mid = 0.5 * (rMin + rMax);
  const peri = raw.filter((p) => p.r <= mid);
  const keep = [];
  for (const p of peri) { if (keep.length && (p.k - keep[keep.length - 1].k) * dt < 0.5 * pRef) continue; keep.push(p); }
  const ang = [];
  for (let i = 0; i < keep.length; i++) {
    let a = keep[i].ang;
    if (i) { let z = a - ang[i - 1]; while (z > Math.PI) z -= 2 * Math.PI; while (z < -Math.PI) z += 2 * Math.PI; a = ang[i - 1] + z; }
    ang.push(a);
  }
  const n = ang.length;
  if (n < 3) return { nPeri: n, slopeDegPerPeri: null, slopeDegPerTime: null, periMean: null };
  const mx = (n - 1) / 2, my = ang.reduce((s, a) => s + a, 0) / n;
  let sxy = 0, sxx = 0;
  for (let i = 0; i < n; i++) { sxy += (i - mx) * (ang[i] - my); sxx += (i - mx) * (i - mx); }
  const slope = sxy / sxx;
  const ts = keep.map((p) => p.k * dt), mt = ts.reduce((s, t) => s + t, 0) / n;
  let tsy = 0, tsx = 0, ss = 0;
  for (let i = 0; i < n; i++) { tsy += (ts[i] - mt) * (ang[i] - my); tsx += (ts[i] - mt) * (ts[i] - mt); }
  const sl = tsy / tsx;
  for (let i = 0; i < n; i++) { const e = ang[i] - (my + sl * (ts[i] - mt)); ss += e * e; }
  const se = n > 2 ? Math.sqrt(ss / (n - 2) / tsx) : null;
  return { nPeri: n, slopeDegPerPeri: slope * 180 / Math.PI, slopeDegPerTime: sl * 180 / Math.PI,
    seDegPerTime: se === null ? null : se * 180 / Math.PI, periMean: (ts[n - 1] - ts[0]) / (n - 1),
    residRmsDeg: Math.sqrt(ss / n) * 180 / Math.PI };
}

/**
 * 1 走行。preset(検証前の写し)を build し、`convert` が真なら月(oi)の慣性速度を v=ẋ−u(0) に直す。
 * 月の同方向公転で revMax 周を回るまで(または maxSteps)走らせ、窓ごとの近点 fit を返す。
 */
export function runRow(HP, preset, o) {
  const { ci, oi, dt, revMax = 27, maxSteps = 1e9, convert = false, windows = [8, 27], onProgress = null,
    yearUnits = YEAR_UNITS_EM, dayUnits = DAY_UNITS_EM } = o;
  const v = HP.validatePreset(JSON.parse(JSON.stringify(preset)));
  if (!v.ok) return { ok: false, err: 'validatePreset: ' + JSON.stringify(v.errors).slice(0, 200) };
  HP.sim.build(v.preset);
  const S = HP.sim;
  const out = { ok: true, warnings: v.warnings, hasMeshVelocity: !!S.hasMeshVelocity, meshVelDeny: S.meshVelDeny || null,
    kernel: !!(S.meshVel && S.meshVel.kernel), dt };
  if (S.hasMeshVelocity) {
    const f = HP.dfmMeshVelocityFieldAt(S, oi);
    out.u0 = f && f.defined ? f.u.slice() : null;
    out.u0Earth = (() => { const g = HP.dfmMeshVelocityFieldAt(S, ci); return g && g.defined ? g.u.slice() : null; })();
    if (convert && out.u0) { S.vx[oi] -= out.u0[0]; S.vy[oi] -= out.u0[1]; }
    out.vInit = [S.vx[oi], S.vy[oi]];
  }
  const rel = () => { const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci]; return [dx, dy, Math.hypot(dx, dy), Math.atan2(dy, dx)]; };
  let [dx0, dy0, r0, th0] = rel();
  const dvx0 = S.vx[oi] - S.vx[ci], dvy0 = S.vy[oi] - S.vy[ci];
  const mu = S.params.G * (S.m[ci] + S.m[oi]), v2 = dvx0 * dvx0 + dvy0 * dvy0;
  const a0 = 1 / (2 / r0 - v2 / mu), P0 = 2 * Math.PI * Math.sqrt(a0 * a0 * a0 / mu);
  out.osc0 = { r: r0, a: a0, P: P0 }; out.yearUnits = yearUnits; out.dayUnits = dayUnits;
  let angPrev = th0, angAcc = 0, r1 = r0, r2 = r0, th1 = th0, th2 = th0, rd1 = 0;
  const A = [], B = [], rev = [];
  let rMin = Infinity, rMax = -Infinity, k = 0;
  const rMinW = windows.map(() => Infinity), rMaxW = windows.map(() => -Infinity);
  for (; k < maxSteps; k++) {
    S.step(dt);
    const [dx, dy, rr, th] = rel();
    if (!Number.isFinite(rr)) { out.nan = true; break; }
    const dvx = S.vx[oi] - S.vx[ci], dvy = S.vy[oi] - S.vy[ci];
    const rd = rr > 0 ? (dx * dvx + dy * dvy) / rr : 0;
    if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr;
    for (let w = 0; w < windows.length; w++) if (rev.length < windows[w]) { if (rr < rMinW[w]) rMinW[w] = rr; if (rr > rMaxW[w]) rMaxW[w] = rr; }
    let d = th - angPrev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    const prevAcc = angAcc; angAcc += d; angPrev = th;
    const nP = Math.floor(Math.abs(prevAcc) / (2 * Math.PI)), nN = Math.floor(Math.abs(angAcc) / (2 * Math.PI));
    if (nN > nP) { const tg = Math.sign(angAcc) * nN * 2 * Math.PI; const fr = (tg - prevAcc) / (angAcc - prevAcc); rev.push((k - 1 + fr + 1) * dt); }
    if (k >= 1 && rd1 < 0 && rd >= 0) {
      const fr = (rd !== rd1) ? (-rd1 / (rd - rd1)) : 0;
      let a1 = th1, a2 = th; while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI; while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
      A.push({ ang: a1 + fr * (a2 - a1), k: k + fr, r: rr });
    }
    if (k >= 2 && r1 < r2 && r1 < rr) {
      const dd = (r2 - 2 * r1 + rr), fr = (dd !== 0) ? 0.5 * (r2 - rr) / dd : 0;
      let a1 = th2, a2 = th1, a3 = th;
      while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI; while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
      while (a3 - a2 > Math.PI) a3 -= 2 * Math.PI; while (a3 - a2 < -Math.PI) a3 += 2 * Math.PI;
      B.push({ ang: a2 + 0.5 * fr * (a3 - a1) + 0.5 * fr * fr * (a3 - 2 * a2 + a1), k: k + fr, r: r1 });
    }
    r2 = r1; r1 = rr; th2 = th1; th1 = th; rd1 = rd;
    if (rev.length >= revMax) { k++; break; }
    if (onProgress && (k & 0xFFFFF) === 0) onProgress(k, rev.length);
  }
  out.steps = k; out.tEnd = k * dt; out.revN = rev.length;
  out.sidMeanDays = rev.length >= 2 ? (rev[rev.length - 1] - rev[0]) / (rev.length - 1) / dayUnits : null;
  out.nan = out.nan || S.hasNaN();
  out.meshVel = S.hasMeshVelocity ? { n: S.meshVelN, undef: S.meshVelUndef, bad: S.meshVelBad, uMax: S.meshVelUMax, work: S.meshVelWork } : null;
  out.windows = windows.map((W, wi) => {
    const tCut = rev.length >= W ? rev[W - 1] : null;
    if (tCut === null) return { orbits: W, complete: false };
    const inW = (p) => p.k * dt <= tCut;
    const fb = fitPeri(B.filter(inW), rMinW[wi], rMaxW[wi], P0, dt);
    const fa = fitPeri(A.filter(inW), rMinW[wi], rMaxW[wi], P0, dt);
    const conv = (f) => (f.slopeDegPerTime ? { apsPeriodYr: 360 / f.slopeDegPerTime / yearUnits } : { apsPeriodYr: null });
    return { orbits: W, complete: true, tCut, eProxy: (rMaxW[wi] - rMinW[wi]) / (rMaxW[wi] + rMinW[wi]),
      B: Object.assign(fb, conv(fb), { anomDays: fb.periMean ? fb.periMean / dayUnits : null }),
      A: Object.assign(fa, conv(fa), { anomDays: fa.periMean ? fa.periMean / dayUnits : null }) };
  });
  return out;
}

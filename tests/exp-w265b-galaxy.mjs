// 第265便b(第57報 W2)「銀河のアナロジー —— 基準走行・測る量の宣言・3 刻み・(k, f) 感度」の実測器である。
//
// ■ 手順(統括の読み (B)): **同じ手順・別窓**で回す。NS と窓・抽出器・観測版を揃えたとは書かない。
//   ① **基準走行**(kFrame=1・f=1 = 中心質量は宣言値そのもの)を走らせる。
//   ② **測る量を先に宣言する**: 円盤だけの v_φ(r)(5 帯)・σ_R・保持率・V_rms。
//      **全粒子の半質量半径は指標にしない**(中心質量が支配するので円盤の話にならない)。
//   ③ **3 刻み**(同一終了時刻を dt=0.016/0.008/0.004)。統括の予備測定では 🎠 の V_rms が
//      T=9.6 で 1.6026/1.6610/1.6260 と**非単調**だった —— **単純外挿しない。**
//   ④ **(k=E6′ 結合 kFrame, f=中心質量) の感度**を無次元で出す。**共同根は出さない**
//      (観測 v(r) の門を持つのは 🛞 だけで、σ は接続していない)。
//
// ■ 宣言(測る量の定義 —— これが「別窓」の中身である)
//   円盤 … 🎠/🪁 では**指数円盤の 260 粒だけ**(粒子 index ≥ 91。中心核 1 粒と Plummer バルジ 90 粒を外す)。
//          🛞 では**恒星円盤の 200 粒だけ**(index < 200。HI 100 粒と中心核は外す)。
//   中心 … 🎠/🪁 は pinned 核(原点)。🛞 は**自由な中心核に対する相対**(反跳するので原点ではない)。
//   R_ref … t=0 の円盤粒子の最大半径。帯は R_ref×{0.1,0.25,0.5,0.75,1.0}・幅 ±12.5%。
//   v_φ … 帯の接線速度の平均。σ_R … 同じ帯の動径速度の標準偏差。保持率 … r ≤ R_ref の円盤粒子の割合。
//
// ■ 言わないこと
//   **銀河を較正した/回転曲線を再現した**とは書かない(観測 v(r) は 1 つも入力していない)。
//   **NS の (f, k) を転用しない。** **mesh-v2 はこの器では 1 度も使わない**(2 体でしか検証していない)。
//   pinned の反作用を含めずに粒子運動量だけの保存を要求しない。
//
// 実行: node tests/exp-w265b-galaxy.mjs [--part base,dt3,sens,ngc]
// 出力: tests/out/galaxy-w265b.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + (path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET));
const OUT = path.join(ROOT, 'tests', 'out', 'galaxy-w265b.json');
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const PARTS = arg('--part', 'base,dt3,sens,ngc').split(',');
const want = (k) => PARTS.indexOf(k) >= 0;

const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
const pg = await browser.newPage();
const pageErrors = [];
pg.on('pageerror', (e) => pageErrors.push(String(e.message || e)));
await pg.goto(INDEX, { waitUntil: 'load' });
await pg.waitForFunction(() => window.HP && HP.sim);

// 測定器(ページ内に置く共通関数)
await pg.evaluate(() => {
  window.W265 = {};
  // 円盤だけの帯統計。opts={from,to,center:'origin'|index}
  W265.diskStats = (S, o) => {
    const from = o.from, to = o.to;
    let cx = 0, cy = 0, cvx = 0, cvy = 0;
    if (typeof o.center === 'number') { cx = S.x[o.center]; cy = S.y[o.center]; cvx = S.vx[o.center]; cvy = S.vy[o.center]; }
    const bands = [0.1, 0.25, 0.5, 0.75, 1.0];
    const acc = bands.map(() => ({ n: 0, sv: 0, sr: 0, sr2: 0 }));
    let nIn = 0, nTot = 0, sv2 = 0;
    for (let i = from; i < to; i++) {
      const dx = S.x[i] - cx, dy = S.y[i] - cy, r = Math.hypot(dx, dy);
      const vx = S.vx[i] - cvx, vy = S.vy[i] - cvy;
      nTot++;
      if (r <= o.Rref) nIn++;
      sv2 += vx * vx + vy * vy;
      if (!(r > 0)) continue;
      const ur = [dx / r, dy / r], ut = [-dy / r, dx / r];
      const vr = vx * ur[0] + vy * ur[1], vt = vx * ut[0] + vy * ut[1];
      for (let b = 0; b < bands.length; b++) {
        const rb = bands[b] * o.Rref;
        if (Math.abs(r - rb) <= 0.125 * rb) { const a = acc[b]; a.n++; a.sv += vt; a.sr += vr; a.sr2 += vr * vr; }
      }
    }
    return { retention: nTot ? nIn / nTot : null, vrms: Math.sqrt(sv2 / Math.max(1, nTot)),
      bands: acc.map((a, b) => ({ r: bands[b] * o.Rref, n: a.n,
        vphi: a.n ? a.sv / a.n : null,
        sigmaR: a.n > 1 ? Math.sqrt(Math.max(0, a.sr2 / a.n - (a.sr / a.n) * (a.sr / a.n))) : null })) };
  };
  W265.build = (id, patch) => {
    const q = JSON.parse(JSON.stringify(HP.allPresets().find((z) => z.id === id)));
    if (patch && patch.physics) Object.assign(q.physics, patch.physics);
    if (patch && patch.centralMassFactor !== undefined) {
      const f = patch.centralMassFactor;
      for (const b of q.bodies) {
        if (b.type === 'single') b.m *= f;
        if (b.aroundMass) b.aroundMass *= f;
      }
    }
    const v = HP.validatePreset(q);
    if (!v.ok) return { err: (v.errors || []).join('|') };
    const S = HP.sim; S.build(v.preset);
    return { S, warn: (v.warnings || []).length, geoPN: S.params.geoPN };
  };
  W265.run = (id, patch, T, dt, seg) => {
    const b = W265.build(id, patch);
    if (b.err) return { err: b.err };
    const S = b.S;
    // R_ref = t=0 の円盤粒子の最大半径
    let Rref = 0;
    const cIdx = (seg.center === 'origin') ? null : seg.center;
    const cx0 = (cIdx === null) ? 0 : S.x[cIdx], cy0 = (cIdx === null) ? 0 : S.y[cIdx];
    for (let i = seg.from; i < seg.to; i++) Rref = Math.max(Rref, Math.hypot(S.x[i] - cx0, S.y[i] - cy0));
    const o = { from: seg.from, to: seg.to, Rref, center: (cIdx === null) ? 'origin' : cIdx };
    const at0 = W265.diskStats(S, o);
    const n = Math.round(T / dt);
    let stopN = 0, stops = {};
    for (let k = 0; k < n; k++) {
      S.step(dt);
      if (S.geoToyStop) { stopN++; stops[S.geoToyStop] = (stops[S.geoToyStop] || 0) + 1; }
    }
    const at1 = W265.diskStats(S, o);
    return { Rref, T, dt, steps: n, geoPN: b.geoPN, at0, at1, stopN, stops,
      chi: S.geoToyChi, nan: S.hasNaN(),
      ledgerE: Math.abs(S.geoToyE + S.geoToyEmesh),
      ledgerP: Math.hypot(S.geoToyPx + S.geoToyMeshPx, S.geoToyPy + S.geoToyMeshPy) };
  };
});

const R = { wave: '第265便b', target: TARGET, at: new Date().toISOString(), parts: PARTS,
  note: '**銀河は較正していない。** 観測回転曲線は 1 つも入力していない。NS の (f, k) は転用していない。' };
const GAL = { from: 91, to: 351, center: 'origin' };      // 🎠/🪁 の指数円盤 260 粒
const NGC = { from: 0, to: 200, center: 300 };            // 🛞 の恒星円盤 200 粒(中心核相対)

// ---------- §1 基準走行(T=48=🎠 の validT)
if (want('base')) {
  R.base = await pg.evaluate(({ GAL }) => {
    const O = {};
    O['🎠 orig(geoPN=0・kFrame=1)'] = W265.run('galaxyMeshSpiral', null, 48, 0.016, GAL);
    O['🎠 pn2(geoPN=2・kFrame=0)'] = W265.run('galaxyMeshSpiral',
      { physics: { geoPN: 2, kFrame: 0 } }, 48, 0.016, GAL);
    O['🪁 コピー(geoPN=3・kFrame=0)'] = W265.run('galaxyMeshSpiralGeoToy', null, 48, 0.016, GAL);
    return O;
  }, { GAL });
}

// ---------- §2 3 刻み(同一終了時刻 T=9.6)
if (want('dt3')) {
  R.dt3 = await pg.evaluate(({ GAL }) => {
    const O = {};
    for (const [tag, id, patch] of [['🎠 orig', 'galaxyMeshSpiral', null],
      ['🪁 コピー', 'galaxyMeshSpiralGeoToy', null]]) {
      O[tag] = {};
      for (const dt of [0.016, 0.008, 0.004]) O[tag]['dt=' + dt] = W265.run(id, patch, 9.6, dt, GAL);
    }
    return O;
  }, { GAL });
}

// ---------- §3 (k=kFrame, f=中心質量) の感度(基準走行 = 🎠 の kFrame=1・f=1)
if (want('sens')) {
  R.sens = await pg.evaluate(({ GAL }) => {
    const T = 9.6, dt = 0.016;
    const pick = (z) => ({ vphi50: z.at1.bands[2].vphi, vphi100: z.at1.bands[4].vphi,
      sig50: z.at1.bands[2].sigmaR, vrms: z.at1.vrms, ret: z.at1.retention,
      n50: z.at1.bands[2].n, n100: z.at1.bands[4].n });
    const at = (k, f) => pick(W265.run('galaxyMeshSpiral',
      { physics: { kFrame: k }, centralMassFactor: f }, T, dt, GAL));
    const base = at(1, 1);
    const rows = [];
    // **kFrame は CLAMPS で 0〜1 に切られる**(k=1.1 は 1 に丸められて基準と同じ値になる)ので、
    // k 側は**後退差分**(1.0 と 0.9)で取る。f 側は中心差分(1.02 と 0.98)。
    for (const [k, f] of [[1, 1], [0.9, 1], [0.8, 1], [1.1, 1], [1, 0.98], [1, 1.02], [0, 1], [1, 1.1]])
      rows.push({ k, f, v: at(k, f) });
    const g = (k, f) => rows.find((z) => z.k === k && z.f === f).v;
    const km = g(0.9, 1), fp = g(1, 1.02), fm = g(1, 0.98);
    const S = {};
    for (const key of ['vphi50', 'vphi100', 'sig50', 'vrms', 'ret']) {
      S[key] = { dlnk: (base[key] === 0) ? null : (base[key] - km[key]) / (base[key] * 0.1),
        dlnf: (base[key] === 0) ? null : (fp[key] - fm[key]) / (base[key] * 0.04) };
    }
    return { base, rows, sens: S, kClampNote: 'kFrame は 0〜1 に切られる(k=1.1 は 1 と同じ値)' };
  }, { GAL });
}

// ---------- §4 🛞 の基準走行(kFrame=1・f=1)と (k, f) 感度
if (want('ngc')) {
  R.ngc = await pg.evaluate(({ NGC }) => {
    const T = 40, dt = 0.016;
    const at = (k, f) => W265.run('ngc3198DFM', { physics: { kFrame: k }, centralMassFactor: f }, T, dt, NGC);
    const O = { base: at(1, 1), k0: at(0, 1), f110: at(1, 1.1), f090: at(1, 0.9) };
    return O;
  }, { NGC });
}

await browser.close();
R.pageErrors = pageErrors;
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
const f6 = (z) => (z === null || z === undefined) ? '—' : Number(z).toFixed(6);
const f4 = (z) => (z === null || z === undefined) ? '—' : Number(z).toFixed(4);
const tbl = (z) => z.at1.bands.map((b) => f4(b.vphi) + '〔' + b.n + '〕').join(' | ');
const sig = (z) => z.at1.bands.map((b) => f4(b.sigmaR)).join(' | ');
if (R.base) {
  console.log('[w265b-galaxy] §1 基準走行(T=48・dt=0.016・円盤 260 粒だけ)');
  for (const k of Object.keys(R.base)) {
    const z = R.base[k]; if (z.err) { console.log(' ' + k + ' ERR ' + z.err); continue; }
    console.log(' ' + k + ': R_ref=' + f4(z.Rref) + ' 保持率=' + f6(z.at1.retention)
      + ' V_rms=' + f6(z.at1.vrms) + ' 停止步=' + z.stopN + ' χ=' + f6(z.chi)
      + ' 帳簿|E|=' + z.ledgerE + ' NaN=' + z.nan);
    console.log('   v_φ: ' + tbl(z));
    console.log('   σ_R: ' + sig(z));
  }
}
if (R.dt3) {
  console.log('[w265b-galaxy] §2 3 刻み(同一終了時刻 T=9.6)');
  for (const tag of Object.keys(R.dt3)) {
    for (const dk of Object.keys(R.dt3[tag])) {
      const z = R.dt3[tag][dk];
      console.log(' ' + tag.padEnd(10) + ' ' + dk.padEnd(10) + ' V_rms=' + f6(z.at1.vrms)
        + ' 保持率=' + f6(z.at1.retention) + ' v_φ(0.5R)=' + f4(z.at1.bands[2].vphi)
        + ' σ_R(0.5R)=' + f4(z.at1.bands[2].sigmaR) + ' 步=' + z.steps);
    }
  }
}
if (R.sens) {
  console.log('[w265b-galaxy] §3 (k=kFrame, f=中心質量) 感度(🎠・T=9.6)');
  console.log(' k     f      v_φ(0.5R)  v_φ(1.0R)  σ_R(0.5R)  V_rms      保持率');
  for (const z of R.sens.rows)
    console.log(' ' + String(z.k).padEnd(5) + ' ' + String(z.f).padEnd(6) + ' '
      + f6(z.v.vphi50).padEnd(10) + ' ' + f6(z.v.vphi100).padEnd(10) + ' '
      + f6(z.v.sig50).padEnd(10) + ' ' + f6(z.v.vrms).padEnd(10) + ' ' + f6(z.v.ret));
  console.log(' 無次元感度(∂lnX/∂lnk, ∂lnX/∂lnf):');
  for (const k of Object.keys(R.sens.sens))
    console.log('   ' + k.padEnd(9) + ' k:' + f6(R.sens.sens[k].dlnk) + '  f:' + f6(R.sens.sens[k].dlnf));
}
if (R.ngc) {
  console.log('[w265b-galaxy] §4 🛞 ngc3198DFM(T=40・恒星円盤 200 粒・中心核相対)');
  for (const k of Object.keys(R.ngc)) {
    const z = R.ngc[k]; if (z.err) { console.log(' ' + k + ' ERR ' + z.err); continue; }
    console.log(' ' + k.padEnd(6) + ' R_ref=' + f4(z.Rref) + ' 保持率=' + f6(z.at1.retention)
      + ' V_rms=' + f6(z.at1.vrms));
    console.log('   v_φ: ' + tbl(z));
    console.log('   σ_R: ' + sig(z));
  }
}
console.log(' out=' + OUT + ' pageErrors=' + pageErrors.length);

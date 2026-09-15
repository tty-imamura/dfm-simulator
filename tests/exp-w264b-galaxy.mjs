// 第264便b(第56報 W2)「geoPN=3 を**銀河の原理コピー**で走らせる」実測器である。
//
// ■ なぜ銀河か(統括の読み (B) 後半)
//   geoPN=3 のトイは E6′/E12 を切って外場としての式を当てるものなので、**1PN と二重計上になる帯**では
//   置換の実験場にならない。銀河では 1PN が 10⁻⁶ 以下なので、**置換の実験場として銀河の原理コピーを使う**。
//   **較正はしない**(観測回転曲線は 1 つも入力しない・腕も主張しない)。
//
// ■ 走らせる 3 通り(同じ本・同じ初期条件・**法則だけ**を替える)
//   orig … プリセットそのまま(geoPN=0・kFrame=1 — 参照)
//   pn2  … geoPN=2・**kFrame=0**(トイの入場条件に合わせた対照 —— 引きずりの結合が無い統一測地線則)
//   pn3  … geoPN=3・kFrame=0・`spaceMesh{lawVersion:"scalar", toyGain:1}`(**トイ**)
//
// ■ 測る量(すべて宣言)
//   保持率 retention … **r ≤ R_ref の非 pinned 粒子の割合**(R_ref = 初期の非 pinned 最大半径)。
//   v(r) … 5 帯(R_ref の 0.1/0.25/0.5/0.75/1.0 倍・幅 ±12.5%)の**接線速度の平均**(符号つき)と |v|。
//   R_lock … 「引きずり限界半径」の**実測**: 32 方位の輪の上で、力学が読むのと同じ場
//            (`HP.dfmField` の scalar・全粒子源・背景 static)の u と、その帯の粒子平均速度 v̄ を比べ、
//            **slip = |u − v̄|/|V| が s=0.1 を初めて超える半径**(|V| = 質量重み RMS 速度)。
//            χ 側の読み(χ = W/(D₀+W) が 1−s を初めて下回る半径)も並べる。
//   仮説 R_drag = √(G·M/(D₀·|V|)) を**この実測と比べる**(検定であって較正ではない)。
//            **次元の注意**: W=Σm·r^−p の p は frameWeight が決める(share は p=1)ので、
//            [D₀]=M·L^−p である。G·M/(D₀|V|) は L^(3+p)·T^−1·M^−1 の次元で、**その平方根は長さではない**
//            (p=1 なら L²T^−1M^−1 の平方根)。**数として比べる**が、無次元の一致は主張できない。
//            比較のため、**χ から解いた閉じた形** R_slip=[(M/D₀)·s/(1−s)]^{1/p}(第257便a `HP.dfmSlipRadius`)
//            も同じ表に並べる(これは同じ χ の定義から出た式なので、実測と合って当然である)。
//
// ■ 言わないこと
//   **銀河を較正した/腕が描けた/回転曲線を再現した、とは書かない。** 保持率も v(r) も
//   **法則を替えたときに何が動くか**の記録であって、観測との一致では一切ない。
//
// 実行: QA_TARGET=beta/index.html node tests/exp-w264b-galaxy.mjs [--ids galaxyMeshSpiral,galaxy,galaxyStd] [--steps 600,3000]
// 出力: tests/out/galaxy-w264b.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + (path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET));
const OUT = process.env.W264B_OUT || path.join(ROOT, 'tests', 'out', 'galaxy-w264b.json');
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const IDS = arg('--ids', 'galaxyMeshSpiral,galaxy,galaxyStd').split(',');
const STEPS = arg('--steps', '600,3000').split(',').map(Number);
const LAWS = arg('--laws', 'orig,pn2,pn3').split(',');
const SLIP_S = Number(arg('--slip', 0.1));

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

await pg.evaluate(({ SLIP_S }) => {
  const KEY = HP.SPACE_MESH_KEY;
  window.__w264b = {};
  window.__w264b.run = (id, law, nStep) => {
    const q = JSON.parse(JSON.stringify(HP.allPresets().find((z) => z.id === id)));
    if (!q) return { err: 'preset なし' };
    delete q.claims; delete q.massCalibration;
    if (law !== 'orig') {
      q.sampleClass = 'principle';
      q.physics.kFrame = 0;
      if (law === 'pn2') { q.physics.geoPN = 2; delete q.physics[KEY]; }
      else { q.physics.geoPN = 3;
        q.physics[KEY] = { mode: 'vertex', gravity: false, inertia: false, lawVersion: 'scalar', toyGain: 1 }; }
    }
    const v = HP.validatePreset(q);
    if (!v.ok) return { err: (v.errors || []).join('|') };
    const S = HP.sim; S.build(v.preset);
    // 初期の参照半径(**非 pinned の最大半径** —— 保持率の分母を宣言で固定する)
    let Rref = 0, nFree = 0, Mtot = 0;
    for (let i = 0; i < S.n; i++) { Mtot += S.m[i]; if (S.pinned[i]) continue; nFree++;
      const r = Math.hypot(S.x[i], S.y[i]); if (r > Rref) Rref = r; }
    const t0 = performance.now();
    for (let k = 0; k < nStep; k++) S.step(0.016);
    const ms = performance.now() - t0;
    // 保持率
    let keep = 0, vSum = 0, mSum = 0;
    for (let i = 0; i < S.n; i++) {
      if (S.pinned[i]) continue;
      const r = Math.hypot(S.x[i], S.y[i]);
      if (r <= Rref && Number.isFinite(r)) keep++;
      const sp = Math.hypot(S.vx[i], S.vy[i]);
      if (Number.isFinite(sp)) { vSum += S.m[i] * sp * sp; mSum += S.m[i]; }
    }
    const Vrms = (mSum > 0) ? Math.sqrt(vSum / mSum) : 0;
    // v(r) の 5 帯
    const bands = [0.1, 0.25, 0.5, 0.75, 1].map((f) => {
      const rc = f * Rref, lo = rc * 0.875, hi = rc * 1.125;
      let n = 0, sPhi = 0, sAbs = 0;
      for (let i = 0; i < S.n; i++) {
        if (S.pinned[i]) continue;
        const r = Math.hypot(S.x[i], S.y[i]);
        if (!(r >= lo && r <= hi)) continue;
        n++; sAbs += Math.hypot(S.vx[i], S.vy[i]);
        sPhi += (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]) / r;
      }
      return { rc, n, vPhi: n ? sPhi / n : null, vAbs: n ? sAbs / n : null };
    });
    // 場の読み(力学が読むのと同じ源集合・同じ法則)
    const BD = [];
    for (let i = 0; i < S.n; i++) BD.push({ id: i, m: S.m[i], x: S.x[i], y: S.y[i], vx: S.vx[i], vy: S.vy[i], ax: 0, ay: 0 });
    const pw = (S.params.frameWeight === undefined || S.params.frameWeight === 'pull') ? 2
      : (S.params.frameWeight === 'pull3') ? 3 : (S.params.frameWeight === 'pull4') ? 4 : 1;
    const isPull = (S.params.frameWeight === undefined || String(S.params.frameWeight).indexOf('pull') === 0);
    const D0u = isPull ? ((S.params.D0pull !== undefined) ? S.params.D0pull : S.params.D0) : S.params.D0;
    const ring = (r) => {
      let chi = 0, ok = 0, su = [0, 0];
      for (let a = 0; a < 32; a++) {
        const th = 2 * Math.PI * a / 32;
        const f = HP.dfmField(BD, r * Math.cos(th), r * Math.sin(th),
          { G: S.params.G, eps: S.params.softening, p: pw, D0: D0u, lawVersion: 'scalar', background: 'static' });
        if (!f || f.chi === null) continue;
        ok++; chi += f.chi; su[0] += f.u[0]; su[1] += f.u[1];
      }
      if (!ok) return null;
      // 同じ帯の粒子平均速度
      const lo = r * 0.875, hi = r * 1.125;
      let n = 0, vx = 0, vy = 0;
      for (let i = 0; i < S.n; i++) {
        if (S.pinned[i]) continue;
        const rr = Math.hypot(S.x[i], S.y[i]);
        if (!(rr >= lo && rr <= hi)) continue;
        n++; vx += S.vx[i]; vy += S.vy[i];
      }
      const ub = [su[0] / ok, su[1] / ok];
      const vb = n ? [vx / n, vy / n] : null;
      return { r, chi: chi / ok, u: ub, vBar: vb, nBand: n,
        slip: (vb && Vrms > 0) ? Math.hypot(ub[0] - vb[0], ub[1] - vb[1]) / Vrms : null };
    };
    const rows = [];
    for (let k = 1; k <= 40; k++) rows.push(ring(Rref * k / 20));
    // R_lock = **ロックしている最外半径**(内側から外へ見て slip ≤ s であった最後の半径)。
    // χ 側は単調減少なので「χ が 1−s を初めて下回る半径」を線形補間で出す(格子 Rref/20 の刻みより細かく)。
    let rSlip = null, rChi = null, rChiInterp = null, prev = null;
    for (const z of rows) {
      if (!z) continue;
      if (z.slip !== null && z.slip <= SLIP_S) rSlip = z.r;
      if (rChi === null && z.chi < 1 - SLIP_S) {
        rChi = z.r;
        if (prev && prev.chi > 1 - SLIP_S) {
          const t = (prev.chi - (1 - SLIP_S)) / (prev.chi - z.chi);
          rChiInterp = prev.r + t * (z.r - prev.r);
        }
      }
      prev = z;
    }
    const Rdrag = (D0u > 0 && Vrms > 0) ? Math.sqrt(S.params.G * Mtot / (D0u * Vrms)) : null;
    // 第257便a の閉じた形。**s は「すべり」**(=1−χ)なので SLIP_S をそのまま渡す
    const Rslip = (typeof HP.dfmSlipRadius === 'function')
      ? HP.dfmSlipRadius({ A: Mtot, D0: D0u, p: pw, s: SLIP_S }) : null;
    return { id, law, nStep, ms, n: S.n, nFree, Rref, Mtot, Vrms, D0u, pw,
      retention: nFree ? keep / nFree : null, bands,
      nan: S.hasNaN(), clamp: (S.clampVN || 0) + (S.clampSN || 0) + (S.clampRN || 0),
      geoToy: { N: S.geoToyN, stop: S.geoToyStop, chi: S.geoToyChi, deny: S.geoToyDeny,
        closure: S.geoToyClosure },
      rLockSlip: rSlip, rLockChi: rChi, rLockChiInterp: rChiInterp, Rdrag,
      RslipFormula: (Rslip && Rslip.R !== undefined) ? Rslip.R : Rslip,
      rings: rows.filter((z) => z).map((z) => ({ r: z.r, chi: z.chi, slip: z.slip, nBand: z.nBand })),
      sig: JSON.stringify(v.preset.physics[KEY] || null), geoPN: S.params.geoPN, kFrame: S.params.kFrame };
  };
}, { SLIP_S });

const R = { wave: '第264便b', target: TARGET, at: new Date().toISOString(), ids: IDS, steps: STEPS,
  slipS: SLIP_S, rows: [],
  note: '**較正ではない。** 観測回転曲線は 1 つも入力していない。腕・平坦回転曲線・暗黒物質については何も主張しない。' };
for (const id of IDS) {
  for (const law of LAWS) {
    for (const st of STEPS) {
      const z = await pg.evaluate(([id, law, st]) => window.__w264b.run(id, law, st), [id, law, st]);
      R.rows.push(z);
      const p3 = (v) => (v === null || v === undefined) ? '—' : Number(v).toPrecision(6);
      console.log('[w264b-galaxy] ' + id + ' ' + law + ' ' + st + '步'
        + (z.err ? (' ERR ' + z.err) : (' 保持率=' + p3(z.retention) + ' V=' + p3(z.Vrms)
          + ' R_lock(slip/χ)=' + p3(z.rLockSlip) + '/' + p3(z.rLockChi)
          + ' R_drag=' + p3(z.Rdrag) + ' R_slip式=' + p3(z.RslipFormula)
          + ' toyN=' + z.geoToy.N + ' nan=' + z.nan + ' ' + Math.round(z.ms) + 'ms')));
    }
  }
}
await browser.close();
R.pageErrors = pageErrors;
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
console.log(' out=' + OUT + ' pageErrors=' + pageErrors.length);

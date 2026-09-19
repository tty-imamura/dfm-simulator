// 第272便c §1「コンパクト連星の**潮汐ロック枝**(kFrame=0・f=1・λ_PN=1)」の実測器である。
//
// ■ 何を測るか(**原仮定者の仮説(第62報)**: 互いに潮汐ロックした天体は kFrame≈0 とみなせる)
//   NS 4 系(⚡ J0737 / 🧮 J1757 / 🩺 J1946 / 🧶 B1534)+ 恒星 2 系(✨ αCen AB / 🌟 Sirius AB)の
//   **診断コピー**で、同じ窓(最初の 20 近点・位相制限 1.5π)・同じ 3 刻み(h, h/2, h/4)で
//   P(近点間周期)・ω̇(近点方位の実時刻回帰)・e(窓内の半径比振れ幅 = eProxy)を測り、
//   CSV(paper/data/solar-observations.csv)の**採用行**と**解タグ行**に対する σ 倍を記録する。
//
//   列(**旧共同根を消さずに並べる**):
//     builtin   … 内蔵そのまま(NS: kFrame=1・台帳 f≈2・λ_PN=1・コア殻あり / 恒星: kFrame=0・f=1)
//     lock      … **仮説列** kFrame=0・f=1・λ_PN=1(診断コピー・コア殻は外す)
//     root      … **旧共同根** kFrame=k\*・f=f\*・λ_PN=1(第265便a `tests/out/kjoint2-w265a.json`)
//     kf0Ledger … kFrame=0・f=台帳・λ_PN=1(**k と f の分離**)
//     corr      … kFrame=1・f=台帳・λ_PN=1(builtin と同じ (k,f)・コア殻だけ違う対照)
//     newton    … kFrame=0・f=1・**λ_PN=0**(1PN も切る = ω̇ の**数値の床**)
//
// ■ この器が**言わないこと**
//   「観測と合った」「潮汐ロックを証明した」「引きずり式が確定した」「共同根を再検証した」
//   「kFrame≈0 を法則として内蔵した」「カロンが合/否」。**σ 倍は記録であって合否ではない。**
//   2 量(P と ω̇)が同じ列で同時に σ に入るかは**実測して書く**(入ると先に書かない)。
//
// ■ 2D の限界(必ず表に出す)
//   **2D エンジンでは面外の自転軸を持てない。** 「コンパクト連星の自転軸が互いを向く」配位は
//   幾何として表現できないので、運動学の宣言 ω_i = Ω_AB + σ_i·n として記録するだけである
//   (`tests/lib-w272c-binlock.mjs` の `lockDeclaration`)。力へは 1 バイトも接続しない。
//
// ■ 触らないもの
//   `beta/index.html` は**読むだけ**。内蔵プリセット 124 本は 1 bit も動かさない
//   (変えるのは `psrMassScaled` が作る**診断コピー**の `physics.kFrame` / `physics.lambdaPN` / 質量だけ)。
//   `S._core` には 1 命令も足していない。
//
// 実行: PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright \
//         node tests/exp-w272c-nslock.mjs [--only id,...] [--variants a,b,...]
// 出力: tests/out/nslock-w272c.json
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { richardson3 } from './lib-w265a-analogy.mjs';
import { lockDeclaration, sigmaTimes, signedSynchrony, SIGN_CONVENTION_JA } from './lib-w272c-binlock.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'nslock-w272c.json');
const SRC265 = path.join(ROOT, 'tests', 'out', 'kjoint2-w265a.json');
const CSV = path.join(ROOT, 'paper', 'data', 'solar-observations.csv');
const HARNESS_VERSION = 'w272c-nslock-1';
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const DT0 = 0.016;
const DIVS = [1, 2, 4];
const PERI_WINDOW = 20;
const YEAR_SEC = 31557600;
const MAX_STEPS = Number(arg('--max-steps', 40000000));
const WALL_MS = Number(arg('--wall-ms', 900000));
const ONLY = (() => { const s = arg('--only', null); return s ? s.split(',') : null; })();
const VARIANTS = (() => { const s = arg('--variants', null); return s ? s.split(',') : null; })();

const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');

// ---- 系の宣言(観測事実の注記は「測っていないこと」を含めて書く)
const SYSTEMS = [
  { id: 'psrDoubleABDFM', emoji: '⚡', label: 'J0737−3039A/B', kind: 'ns-binary',
    csvBody: 'PSR J0737-3039 B', solution: 'Kramer2021-DDS',
    spinBodies: ['PSR J0737-3039 A', 'PSR J0737-3039 B'] },
  { id: 'psrJ1757DFM', emoji: '🧮', label: 'J1757−1854', kind: 'ns-binary',
    csvBody: 'PSR J1757-1854', solution: 'Singha2026-DDH',
    spinBodies: ['PSR J1757-1854'] },
  { id: 'psrJ1946DFM', emoji: '🩺', label: 'J1946+2052', kind: 'ns-binary',
    csvBody: 'PSR J1946+2052', solution: 'Meng2025-DDFWHE',
    spinBodies: ['PSR J1946+2052'] },
  { id: 'psrB1534DFM', emoji: '🧶', label: 'B1534+12', kind: 'ns-binary',
    csvBody: 'PSR B1534+12', solution: 'Fonseca2014-DDGR',
    spinBodies: ['PSR B1534+12'] },
  { id: 'alphaCenAB', emoji: '✨', label: 'α Centauri AB', kind: 'stellar-binary',
    csvBody: 'Alpha Centauri AB', solution: null, ledgerFrom: 'alphaCenABDFM',
    spinBodies: ['Alpha Centauri A', 'Alpha Centauri B'] },
  { id: 'siriusAB', emoji: '🌟', label: 'Sirius AB', kind: 'stellar-binary',
    csvBody: 'Sirius AB', solution: null, ledgerFrom: 'siriusABDFM',
    spinBodies: ['Sirius A', 'Sirius B'] },
];

// ---- CSV(正本)
function parseCsvLine(line) {
  const cols = []; let cur = '', inQ = false;
  for (const ch of line) {
    if (inQ) { if (ch === '"') inQ = false; else cur += ch; }
    else if (ch === '"') inQ = true;
    else if (ch === ',') { cols.push(cur); cur = ''; }
    else cur += ch;
  }
  cols.push(cur); return cols;
}
const OBS_ROWS = (() => {
  const txt = fs.readFileSync(CSV, 'utf8');
  const rows = [];
  for (const line of txt.split('\n')) {
    if (!line.trim() || line.startsWith('body,')) continue;
    const c = parseCsvLine(line);
    const sg = (c[8] !== undefined && c[8].trim() !== '') ? Number(c[8]) : null;
    rows.push({ body: c[0], quantity: c[1], value: Number(c[2]), unit: c[3], source: String(c[4]),
      note: String(c[7] || ''), sigma: (Number.isFinite(sg) && sg > 0) ? sg : null,
      recordId: String(c[9] || ''), solutionId: String(c[10] || '') });
  }
  return rows;
})();
const firstRow = (b, q) => OBS_ROWS.find((r) => r.body === b && r.quantity === q) || null;
// 第270便c(AD9)の語境界つき照合(`adopted_solution=` を解タグとして拾わない)
const solutionTagged = (note, tag) => new RegExp('(?:^|[^A-Za-z0-9_-])solution='
  + String(tag).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![A-Za-z0-9_])').test(String(note || ''));
const solRow = (b, q, t) => OBS_ROWS.find((r) => r.body === b && r.quantity === q
  && solutionTagged(r.note, t)) || null;
const toSec = (r) => (!r ? null : (r.unit === 's' ? r.value : (r.unit === 'd' ? r.value * 86400 : null)));
const sigSec = (r) => (!r || r.sigma === null ? null
  : (r.unit === 's' ? r.sigma : (r.unit === 'd' ? r.sigma * 86400 : null)));
const pack = (r, conv) => (!r ? null : { value: conv ? conv(r) : r.value,
  sigma: conv ? (r.sigma === null ? null : conv({ ...r, value: r.sigma })) : r.sigma,
  unit: r.unit, recordId: r.recordId, solutionId: r.solutionId || null, source: r.source.slice(0, 70) });

// ---- 第265便a の旧共同根
const SAVED265 = fs.existsSync(SRC265) ? JSON.parse(fs.readFileSync(SRC265, 'utf8')) : { systems: [] };
const savedRoot = (id) => {
  const s = (SAVED265.systems || []).find((z) => z.id === id);
  const a = s && s.columns && s.columns.adopted;
  return (a && Number.isFinite(a.kStar) && Number.isFinite(a.fStar)) ? { kStar: a.kStar, fStar: a.fStar } : null;
};

const LIB_PREC = fs.readFileSync(path.join(ROOT, 'tests', 'lib-precision-diagnostics.mjs'), 'utf8')
  .replace(/^export /gm, '');
const LIB_DIAG = fs.readFileSync(path.join(ROOT, 'tests', 'lib-w262a-psrdiag.mjs'), 'utf8')
  .replace(/^export /gm, '');

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
await pg.addScriptTag({ content: LIB_PREC });
await pg.addScriptTag({ content: LIB_DIAG });

await pg.evaluate(() => {
  // 診断コピーを作る。**内蔵は読むだけ**(psrMassScaled は deep copy を返す)。
  window.__w272cBuild = (srcId, spec) => {
    const src = HP.allPresets().find((q) => q.id === srcId);
    if (!src) return { ok: false, errors: ['no such preset: ' + srcId] };
    if (spec.builtin) {
      const v = HP.validatePreset(JSON.parse(JSON.stringify(src)));
      return v.ok ? { ok: true, preset: v.preset } : { ok: false, errors: v.errors };
    }
    const pd = psrMassScaled(src, spec.f, { kFrame: spec.kFrame, keepCore: !!spec.keepCore, id: 'w272cLock' });
    if (!pd) return { ok: false, errors: ['psrMassScaled returned null'] };
    if (spec.lambdaPN !== undefined) pd.physics.lambdaPN = spec.lambdaPN;
    const v = HP.validatePreset(pd);
    return v.ok ? { ok: true, preset: v.preset } : { ok: false, errors: v.errors };
  };
  window.__w272cRun = (srcId, spec, dt, nWant, maxSteps, budgetMs) => {
    const b = window.__w272cBuild(srcId, spec);
    if (!b.ok) return { ok: false, errors: b.errors };
    const P = b.preset;
    HP.sim.build(P);
    const S = HP.sim, ci = 0, oi = 1;
    const det = createPeriastronDetector({ phaseGate: 1.5 * Math.PI });
    const t0 = performance.now();
    const r00 = Math.hypot(S.x[oi] - S.x[ci], S.y[oi] - S.y[ci]);
    let k = 0, stopped = 'window', nPeri = 0;
    let rMin = Infinity, rMax = -Infinity, inWin = false;
    for (; k < maxSteps; k++) {
      S.step(dt);
      const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci];
      const rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
      const dvx = S.vx[oi] - S.vx[ci], dvy = S.vy[oi] - S.vy[ci];
      const rd = (rr > 0) ? (dx * dvx + dy * dvy) / rr : 0;
      if (inWin) { if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr; }
      const a = det.push(k, rr, rd, th);
      if (a.accepted) { nPeri++; inWin = true; }
      if (nPeri >= nWant) { stopped = 'window'; break; }
      if (rr > 8 * r00) { stopped = 'escape'; break; }
      if (S.hasNaN()) { stopped = 'nan'; break; }
      if ((k & 65535) === 0 && (performance.now() - t0) > budgetMs) { stopped = 'resource-limit'; break; }
    }
    if (k >= maxSteps) stopped = 'max-steps';
    const res = det.result(nWant);
    return { ok: true, steps: k, stopped, nan: S.hasNaN(), nPeri: res.nPeri,
      unwrapFailed: res.unwrapFailed,
      peri: (res.peri || []).map((p) => p.k), ang: (res.ang || []).slice(),
      clamp: (S.clampVN || 0) + (S.clampSN || 0) + (S.clampHN || 0) + (S.clampRN || 0) + (S.clampTN || 0),
      r0: r00, eProxy: (rMax > 0 && rMax + rMin > 0) ? (rMax - rMin) / (rMax + rMin) : null,
      used: { kFrame: P.physics.kFrame, lambdaPN: P.physics.lambdaPN, geoPN: P.physics.geoPN,
        sampleClass: P.sampleClass, masses: P.bodies.map((b2) => b2.m),
        hasCore: P.bodies.map((b2) => !!b2.core), spins: P.bodies.map((b2) => b2.spin) } };
  };
  // 内蔵の宣言(**本器が 1 bit も変えていない**ことの控え)
  window.__w272cBuiltin = (ids) => ids.map((id) => {
    const p = HP.allPresets().find((q) => q.id === id) || null;
    return p ? { id, emoji: p.emoji, kFrame: p.physics.kFrame, lambdaPN: p.physics.lambdaPN,
      geoPN: p.physics.geoPN, sampleClass: p.sampleClass,
      masses: p.bodies.map((b) => b.m), spins: p.bodies.map((b) => b.spin),
      // 第273便d(AH22): **符号つき**の公転角速度 Ω_z=(r×v)_z/r²(宣言された初期条件から作る)。
      // 面直 z は画面手前向きが正・反時計回り(x→y)が正 —— spin と同じ符号規約である。
      omegaOrbit: (() => {
        const a = p.bodies[0], b2 = p.bodies[1];
        if (!a || !b2) return null;
        const rx = b2.x - a.x, ry = b2.y - a.y, vx = b2.vx - a.vx, vy = b2.vy - a.vy;
        const r2 = rx * rx + ry * ry;
        return (r2 > 0) ? (rx * vy - ry * vx) / r2 : null;
      })(),
      unitT: Math.pow(10, Number(p.scaleExp.T)),
      ledgerFactor: (p.massCalibration && Number.isFinite(p.massCalibration.factor))
        ? p.massCalibration.factor : null,
      baseMass: (p.massCalibration && p.massCalibration.baseMass) ? p.massCalibration.baseMass.slice() : null }
      : { id, missing: true };
  });
});

function windowStats(peri, ang, n, dt, unitSec) {
  if (!peri || peri.length < n) return null;
  const P = (peri[n - 1] - peri[0]) * dt / (n - 1) * unitSec;
  const xs = [], ys = [];
  for (let i = 0; i < n; i++) { xs.push(peri[i] * dt); ys.push(ang[i]); }
  const m = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / m, my = ys.reduce((a, b) => a + b, 0) / m;
  let sxy = 0, sxx = 0;
  for (let i = 0; i < m; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; }
  if (!(sxx > 0)) return { P, W: null };
  return { P, W: sxy / sxx * 180 / Math.PI / unitSec * YEAR_SEC };
}

const BUILTIN = await pg.evaluate((ids) => window.__w272cBuiltin(ids),
  SYSTEMS.map((s) => s.id).concat(['alphaCenABDFM', 'siriusABDFM']));
const builtinOf = (id) => BUILTIN.find((z) => z.id === id) || null;

const out = { meta: { wave: '第272便c', section: '潮汐ロック枝(kFrame=0・f=1・λPN=1)',
  harness: HARNESS_VERSION, target: TARGET, targetSha256: sha(path.join(ROOT, TARGET)),
  csvSha256: sha(CSV), libSha256: sha(path.join(ROOT, 'tests', 'lib-w272c-binlock.mjs')),
  src265Sha256: fs.existsSync(SRC265) ? sha(SRC265) : null,
  at: new Date().toISOString(), dt0: DT0, divs: DIVS, periWindow: PERI_WINDOW,
  maxSteps: MAX_STEPS, wallMs: WALL_MS,
  metric: '近点間 P = 位相制限(1.5π)の最初の 20 近点(19 区間)の平均間隔。'
    + 'ω̇ = 採用近点の方位を実時刻に回帰した傾き(°/年)。e = 窓内の (r_max−r_min)/(r_max+r_min)(eProxy)。',
  eMappingNote: '**eProxy と観測の e_T(timing eccentricity)の写像は未確定である**(第271便までの裁定)。'
    + 'e の σ 倍は**記録**であって合否ではない。',
  hypothesis: '**原仮定者の仮説(第62報)**「互いに潮汐ロックした天体は kFrame≈0 とみなせる」を'
    + '**診断コピーで実測する**。既定の kFrame=1 と旧共同根(第265便a)は消さずに並べてある。',
  claim: '**σ 倍は記録であって合否ではない。**「観測と合った」「潮汐ロックを証明した」'
    + '「引きずり式が確定した」「共同根を再検証した」とは書かない。',
  touched: '**内蔵プリセットは 1 bit も動かしていない**(diagnostic copy の physics.kFrame / '
    + 'physics.lambdaPN / bodies[].m だけを書き換える)。`S._core` には 1 命令も足していない。',
  // 第273便d(統括の検証項目 R18 / AH22)
  spinAxisCorrection: '運動学の宣言 ω_i = Ω_AB + σ_i·n の **n は相手へ向かう単位ベクトル**'
    + '(天体間方向・面内)である。第272便c の「n は面直の単位ベクトル」は**撤回する**。'
    + '(σ_i n)×n = 0 は「軸上の相対すべりをこの項が拾わない」という意味に限られ、'
    + '「面内軸の自転が力学に効かない」ではない。',
  signConvention: SIGN_CONVENTION_JA,
  spinZeroNote: '**NS 4 系の内蔵 spin=0 は「観測同期の代用」ではない**(自転が転写できないので '
    + '0 を宣言してある = エンジンに自転源を置かない)。' },
  builtinDeclared: BUILTIN, systems: [], pageErrors: [] };

const tAll = Date.now();
let nStage = 0;

for (const sys of SYSTEMS) {
  if (ONLY && !ONLY.includes(sys.id)) continue;
  const bi = builtinOf(sys.id);
  if (!bi || bi.missing) { out.systems.push({ id: sys.id, error: 'preset が無い' }); continue; }
  const unitSec = bi.unitT;
  const ledgerSrc = sys.ledgerFrom ? builtinOf(sys.ledgerFrom) : bi;
  const fLedger = (ledgerSrc && Number.isFinite(ledgerSrc.ledgerFactor)) ? ledgerSrc.ledgerFactor : 1;
  const root = savedRoot(sys.id);

  const obs = {
    adopted: { P: pack(firstRow(sys.csvBody, 'orbital_period'), toSecConv),
      W: pack(firstRow(sys.csvBody, 'periastron_advance')),
      e: pack(firstRow(sys.csvBody, 'eccentricity')) },
    solution: sys.solution ? { P: pack(solRow(sys.csvBody, 'orbital_period', sys.solution), toSecConv),
      W: pack(solRow(sys.csvBody, 'periastron_advance', sys.solution)),
      e: pack(solRow(sys.csvBody, 'eccentricity', sys.solution)) } : null,
  };

  const variants = [];
  variants.push({ tag: 'builtin', spec: { builtin: true },
    what: '内蔵そのまま(kFrame=' + bi.kFrame + '・λ_PN=' + bi.lambdaPN + '・台帳 f'
      + (bi.ledgerFactor === null ? 'なし' : '=' + bi.ledgerFactor.toFixed(9)) + ')' });
  variants.push({ tag: 'lock', spec: { f: 1, kFrame: 0, lambdaPN: 1, keepCore: false },
    what: '**仮説列** kFrame=0・f=1・λ_PN=1(原仮定者の仮説・第62報)' });
  if (root) {
    variants.push({ tag: 'root', spec: { f: root.fStar, kFrame: root.kStar, lambdaPN: 1, keepCore: false },
      what: '**旧共同根**(第265便a)k\\*=' + root.kStar.toFixed(6) + '・f\\*=' + root.fStar.toFixed(8) });
  }
  variants.push({ tag: 'kf0Ledger', spec: { f: fLedger, kFrame: 0, lambdaPN: 1, keepCore: false },
    what: 'kFrame=0・f=台帳 ' + fLedger.toFixed(9) + '・λ_PN=1(k と f の分離)' });
  variants.push({ tag: 'corr', spec: { f: fLedger, kFrame: 1, lambdaPN: 1, keepCore: false },
    what: 'kFrame=1・f=台帳 ' + fLedger.toFixed(9) + '・λ_PN=1(既存補正を残した列)' });
  variants.push({ tag: 'newton', spec: { f: 1, kFrame: 0, lambdaPN: 0, keepCore: false },
    what: 'kFrame=0・f=1・**λ_PN=0**(1PN も切る = ω̇ の数値の床)' });

  const rec = { id: sys.id, emoji: sys.emoji, label: sys.label, kind: sys.kind, unitSec,
    csvBody: sys.csvBody, solutionTag: sys.solution, ledgerFactor: fLedger,
    ledgerFrom: sys.ledgerFrom || sys.id, savedRoot: root,
    builtin: bi, obs,
    // **観測の自転周期は CSV から読む**(手書きの注記を置かない)。同期しているかどうかは
    // P_spin/P_orb で判断できる: **1 に近いときだけ同期している**。転写行が無い天体は `null`。
    spinSynchrony: (() => {
      const Porb = obs.adopted.P ? obs.adopted.P.value : null;
      const rows = (sys.spinBodies || []).map((b) => {
        const r = firstRow(b, 'rotation_period');
        if (!r) return { body: b, transcribed: false, value: null, ratioToOrbit: null };
        const sec = toSec(r);
        return { body: b, transcribed: true, value: sec, unit: r.unit, recordId: r.recordId,
          ratioToOrbit: (sec !== null && Porb) ? sec / Porb : null };
      });
      const known = rows.filter((z) => z.ratioToOrbit !== null);
      // 第273便d(AH22): **符号つきの比**を別欄で出す。CSV の rotation_period は**大きさ**なので、
      // 符号は CSV からは読めない(`signKnownFromCsv:false`)。エンジンが実際に走らせる宣言
      // (内蔵 bodies の spin と、初期条件から作る公転角速度 Ω_z)は**符号を持っている**ので、
      // そちらは `signedDeclared` に符号つきで並べる。**絶対値で同期を判定しない。**
      const Om = bi ? bi.omegaOrbit : null;
      const signedDeclared = (bi && Array.isArray(bi.spins))
        ? bi.spins.map((sp, i) => ({ index: i, spin: sp, omegaOrbit: Om,
          signed: signedSynchrony(sp, Om),
          // **spin=0 は「観測同期の代用」ではない**(下の spinZeroNote)
          spinIsZero: sp === 0 }))
        : [];
      return { orbitalPeriodSec: Porb, rows,
        anyTranscribed: rows.some((z) => z.transcribed),
        allWithin1Percent: known.length > 0 && known.every((z) => Math.abs(z.ratioToOrbit - 1) < 0.01),
        ratioIsUnsigned: true,
        signKnownFromCsv: false,
        signConvention: SIGN_CONVENTION_JA,
        signedDeclared,
        spinZeroNote: '**内蔵の spin=0 は「観測上同期している」の代用ではない。** '
          + 'NS 4 系は自転が転写できないので **0 を宣言してある**(= エンジンに自転源を置かない)のであって、'
          + '「ω_spin = Ω_orb」を表してはいない。符号つきの比でも 0/Ω = 0 になり **+1 にはならない**。',
        note: '**「潮汐ロックしている」は観測事実ではなく仮説である。** '
          + '転写行が無い天体は本器では測れない(0 や 1 で埋めない)。'
          + '**P_spin/P_orb は符号を持たない比である**(逆行と順行を区別しない —— 第273便d・AH22)。' };
    })(),
    lockDeclaration: lockDeclaration({ systemKind: sys.kind, id: sys.id,
      sigma: [0, 0], observedSpin: bi.spins,
      synchronousObserved: false,
      independentChecks: ['パルス形状(自転軸の向きが変わればプロファイルが変わる)',
        '食の幾何(J0737 の B 側の食の形)', '測地線歳差の向きと速さ',
        '自転–軌道結合による ω̇ への寄与(2D では持てない)'] }),
    variants: [] };
  out.systems.push(rec);

  for (const v of variants) {
    if (VARIANTS && !VARIANTS.includes(v.tag)) continue;
    const stages = [];
    for (const div of DIVS) {
      const dt = DT0 / div;
      const r = await pg.evaluate(({ id, spec, dt, n, ms, wm }) =>
        window.__w272cRun(id, spec, dt, n, ms, wm),
      { id: sys.id, spec: v.spec, dt, n: PERI_WINDOW, ms: MAX_STEPS, wm: WALL_MS });
      const w = (r.ok && r.nPeri >= PERI_WINDOW) ? windowStats(r.peri, r.ang, PERI_WINDOW, dt, unitSec) : null;
      stages.push({ div, dt, ok: !!r.ok, errors: r.errors || null, stopped: r.stopped || null,
        nPeri: r.nPeri === undefined ? null : r.nPeri, steps: r.steps === undefined ? null : r.steps,
        unwrapFailed: r.unwrapFailed === undefined ? null : r.unwrapFailed,
        clamp: r.clamp === undefined ? null : r.clamp, nan: r.nan === undefined ? null : r.nan,
        e: r.eProxy === undefined ? null : r.eProxy,
        P: w ? w.P : null, omegaDot: w ? w.W : null, used: r.used || null });
      nStage++;
    }
    const gp = stages.map((s) => s.P), gw = stages.map((s) => s.omegaDot), ge = stages.map((s) => s.e);
    const rp = richardson3(...gp), rw = richardson3(...gw), re = richardson3(...ge);
    const col = { tag: v.tag, what: v.what, spec: v.spec, stages,
      richardson: { P: rp, omegaDot: rw, e: re },
      Pext: rp.ext, omegaDotExt: rw.ext, eExt: re.ext,
      resolved: { P: Number.isFinite(rp.ext), omegaDot: Number.isFinite(rw.ext), e: Number.isFinite(re.ext) } };
    // σ 倍(**記録のみ**)。外挿が付かない量は h/4 の値でも 1 本出す(どちらの列か明記する)。
    const sig = (which) => {
      const o = (which === 'solution') ? obs.solution : obs.adopted;
      if (!o) return null;
      const at = (q, modelExt, modelH4) => ({
        obs: o[q] ? o[q].value : null, sigma: o[q] ? o[q].sigma : null,
        recordId: o[q] ? o[q].recordId : null, solutionId: o[q] ? o[q].solutionId : null,
        modelExt, modelH4,
        sigmaTimesExt: o[q] ? sigmaTimes(modelExt, o[q].value, o[q].sigma) : null,
        sigmaTimesH4: o[q] ? sigmaTimes(modelH4, o[q].value, o[q].sigma) : null });
      return { P: at('P', rp.ext, stages[stages.length - 1].P),
        omegaDot: at('W', rw.ext, stages[stages.length - 1].omegaDot),
        e: at('e', re.ext, stages[stages.length - 1].e) };
    };
    col.sigma = { adopted: sig('adopted'), solution: sig('solution'),
      note: '**σ 倍は記録であって合否ではない。** e は eProxy⇄e_T の写像が未確定である。' };
    // **P と ω̇ が同時に 3σ 内に入るか**(実測して書く欄。判定ではなく数え上げ)
    const within = (z, n) => (typeof z === 'number' && Number.isFinite(z) && Math.abs(z) <= n);
    // **「入らなかった」と「判定できない」を分ける**(σ の宛先が無い量・外挿が付かない量は未判定)。
    const state = (z) => (typeof z === 'number' && Number.isFinite(z))
      ? (Math.abs(z) <= 3 ? 'within' : 'outside') : 'undecidable';
    const sa = col.sigma.adopted;
    const joint = (pz, wz) => {
      const a = state(pz), b = state(wz);
      if (a === 'undecidable' || b === 'undecidable') return 'undecidable';
      return (a === 'within' && b === 'within') ? 'within' : 'outside';
    };
    col.jointWithin3Sigma = sa ? {
      ext: within(sa.P.sigmaTimesExt, 3) && within(sa.omegaDot.sigmaTimesExt, 3),
      h4: within(sa.P.sigmaTimesH4, 3) && within(sa.omegaDot.sigmaTimesH4, 3),
      stateExt: joint(sa.P.sigmaTimesExt, sa.omegaDot.sigmaTimesExt),
      stateH4: joint(sa.P.sigmaTimesH4, sa.omegaDot.sigmaTimesH4),
      perQuantityExt: { P: state(sa.P.sigmaTimesExt), omegaDot: state(sa.omegaDot.sigmaTimesExt),
        e: state(sa.e.sigmaTimesExt) },
      note: '**数え上げであって合否ではない。** σ の宛先が無い量・外挿が付かない量は '
        + '`undecidable`(**「入らなかった」ではない**)。' } : null;
    rec.variants.push(col);
    console.error(`  ${sys.emoji} ${v.tag}: P(h/h2/h4)=${gp.map((z) => z === null ? '—' : z.toFixed(3)).join('/')}`
      + ` ext=${rp.ext === null ? '—' : rp.ext.toFixed(3)}`
      + `  ω̇=${gw.map((z) => z === null ? '—' : z.toFixed(5)).join('/')}`
      + ` ext=${rw.ext === null ? '—' : rw.ext.toFixed(5)}`
      + `  e=${ge.map((z) => z === null ? '—' : z.toFixed(6)).join('/')}`
      + `  [${((Date.now() - tAll) / 1000).toFixed(0)} s]`);
    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
  }
}

function toSecConv(r) { return toSec(r); }

out.meta.spentSec = +((Date.now() - tAll) / 1000).toFixed(1);
out.meta.stages = nStage;
out.pageErrors = pageErrors;
await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error('[w272c-nslock] wrote ' + OUT + '  (' + out.meta.spentSec + ' s / ' + nStage + ' 段)');

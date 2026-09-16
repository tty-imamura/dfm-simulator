// 第265便a(第57報 W1)「**アナロジー器**: BH 連星と星団を、NS と**同じ手順・別窓**で回す」。
//
// ■ 原仮定者の指示(第57報): 「ブラックホール連星、星団、銀河の検証をアナロジーとして進める」。
//   統括の読み (B): **並ぶのは手順だけである** ——「基準走行(kFrame=1・f=1)が外れたら (k, f) を
//   同時に動かす」という作業の形を共有するだけで、**窓・抽出器・観測版を NS と揃えたとは書かない**。
//   **較正クラスへは上げない**(principle のまま)。
//
// ■ 本器の担当(銀河は別枝)
//   (1) **BH 連星** 🎻 gw150914DFM / 🎐 gw150914
//       宣言: 窓 = inspiral 窓(開始 t=0・終了 t=T)。抽出器 = 分離の極小間隔から作る周期。
//       測る量 = ① 窓の終端での分離 ② 極小間隔の周期 ③ **周期変化**(前半窓と後半窓の周期の差)
//       ④ 最終質量(合体後の総質量 —— **窓の中で合体に達したかどうかも記録する**)。
//       **共同根は出さない**(P・ω̇ 型の観測門が繋がっていない —— 器が CSV を数えて確かめる)。
//       出すのは 3 刻みの基準走行と ∂P/∂k・∂P/∂f の感度まで。
//   (2) **星団** 🍇 tuc47 / 🫐 tuc47DFM
//       宣言: 窓 = t∈[0, T]。抽出器 = **投影量**(投影は x 軸・「視線」は y 成分)。
//       測る量 = σ_v(r)(半径 5 帯)・投影半質量半径・コア半径(面密度が半分に落ちる R)。
//       **2D 面内の分散を視線速度分散へ直接対応させない**(`projectedStats` の caveat を必ず持ち回る)。
//       hold-out 質量 f に対する感度も出す。
//
// ■ 3 刻み
//   dt = 0.016 / 0.008 / 0.004 を**同一終了時刻**で走らせる(步数ではなく時刻を揃える)。
//   Richardson 外挿は `richardson3` が**見かけの次数が正のときだけ**付ける ——
//   **差が単調でない量には外挿を書かない**(`monotone:false` を立てる)。
//
// ■ 触らないもの
//   `beta/index.html` は**読むだけ**。本体 🎻🎐🍇🫐 の JSON を 1 bit も書き換えない。
//   `S._core` には 1 命令も足していない。診断コピーは `sampleClass:"principle"`。
//
// ■ この器が**言わないこと**
//   「BH 連星・星団を較正した」「NS の窓を転用した」「NS の (f, k) を BH・星団へ写した」
//   「観測と合った」。
//
// 実行: node tests/exp-w265a-analogy.mjs [--only bh,cluster] [--bh-T 3640] [--cl-T 9.6]
// 出力: tests/out/analogy-w265a.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { richardson3, protocolDeclaration, nondimJacobian } from './lib-w265a-analogy.mjs';
// 第266便a: σ の印は 3 器と同じ 1 本で読む(`sigma_primary=verified` だけが門に入る)。
import { isSigmaPrimaryVerified } from './lib-w264d-sigmamark.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'analogy-w265a.json');
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const DT0 = 0.016;
const DIVS = [1, 2, 4];
const BH_T_SHORT = Number(arg('--bh-T0', 240));      // **統括の予備測定と同じ終了時刻**(最終分離の照合)
// 周期を 20 個取るための窓。**基準走行(f=1)は軌道が大きく広がる**ので、内蔵構成より長い窓が要る
// (f を半分にすると出発点が新しい軌道の近点になり、遠点は (1−e)/e 倍まで伸びる)。
const BH_T = Number(arg('--bh-T', 130000));
const BH_MIN = Number(arg('--bh-min', 20));
const CL_T = Number(arg('--cl-T', 9.6));             // **統括の予備測定と同じ終了時刻**
const ONLY = (() => { const s = arg('--only', null); return s ? s.split(',') : null; })();
const want = (tag) => !ONLY || ONLY.includes(tag);

// **統括の予備測定**(照合のためだけの定数。観測値ではない)
const PRELIM = {
  gw150914_finalSeparation_T240: [187.1607, 187.1863, 187.1991],
  tuc47_projHalfMass_T9p6: [7.637, 7.627, 7.441],
};

// ---- CSV(**観測の門が繋がっているかを数える**ためだけに読む)
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
function loadCsv(file, sigmaCol) {
  const fp = path.join(ROOT, 'paper', 'data', file);
  if (!fs.existsSync(fp)) return [];
  const rows = [];
  for (const line of fs.readFileSync(fp, 'utf8').split('\n')) {
    if (!line.trim() || line.startsWith('body,')) continue;
    const c = parseCsvLine(line);
    const sg = (sigmaCol !== null && c[sigmaCol] !== undefined && c[sigmaCol].trim() !== '')
      ? Number(c[sigmaCol]) : null;
    rows.push({ body: c[0], quantity: c[1], value: Number(c[2]), unit: c[3],
      source: String(c[4]).slice(0, 70), note: String(c[7] || '').slice(0, 120),
      sigma: (Number.isFinite(sg) && sg > 0) ? sg : null,
      // 第266便a: **印を見る**。σ が sigma 列に在っても `sigma_primary=verified` でなければ
      // 門には 1 bit も入らない(星団・銀河の σ はすべて unverified である)。
      primaryVerified: isSigmaPrimaryVerified(c[7] || '') });
  }
  return rows;
}
const SOLAR = loadCsv('solar-observations.csv', 8);
// 第266便a(第57報 追加): 星団・銀河 CSV に **sigma 列**(9 列目)が付いたので、そこも読む。
// **読めることと門に繋がることは別である** —— 入った σ はすべて `sigma_primary=unverified` で、
// `gateConnected` は下の `withVerifiedSigma` で数える(**星団・銀河は門に接続していない**)。
const CLUSTER = loadCsv('cluster-galaxy-observations.csv', 8);
function gateCensus(rows, bodies) {
  const sel = rows.filter((r) => bodies.includes(r.body));
  return { rows: sel.length, withSigma: sel.filter((r) => r.sigma !== null).length,
    withVerifiedSigma: sel.filter((r) => r.sigma !== null && r.primaryVerified).length,
    quantities: Array.from(new Set(sel.map((r) => r.quantity))) };
}

const LIB_ANALOGY = fs.readFileSync(path.join(ROOT, 'tests', 'lib-w265a-analogy.mjs'), 'utf8')
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
await pg.addScriptTag({ content: LIB_DIAG });
await pg.addScriptTag({ content: LIB_ANALOGY });
const libOk = await pg.evaluate(() => typeof projectedStats === 'function'
  && typeof clusterMassScaled === 'function' && typeof psrMassScaled === 'function');
if (!libOk) { console.error('[w265a-analogy] lib がページへ入っていない'); await browser.close(); process.exit(2); }

await pg.evaluate(() => {
  // ---- BH 連星: 同一終了時刻まで走り、分離の極小と終端の分離・総質量を返す
  window.__w265aBh = (srcId, f, kFrame, dt, tEnd, nMinWant, asIs) => {
    const src = HP.allPresets().find((q) => q.id === srcId);
    if (!src) return { ok: false, errors: ['no such preset: ' + srcId] };
    const pd = asIs ? JSON.parse(JSON.stringify(src))
      : psrMassScaled(src, f, { kFrame, keepCore: false, id: 'w265aBh' });
    const v = HP.validatePreset(pd);
    if (!v.ok) return { ok: false, errors: v.errors };
    HP.sim.build(v.preset);
    const S = HP.sim, ci = 0, oi = 1;
    const nSteps = Math.round(tEnd / dt);
    // **分離の極小**(**ヒステリシス検出**・相対振幅門 AMP)。
    //   ṙ の符号交差をそのまま極小にすると **2 步おきの上下**を拾う —— 実測: 🎻(kFrame=1)では
    //   極大・極小のどちらの近傍でも ṙ の − → + 交差が 2 步周期で並ぶ(60000 步で 52 回・
    //   🎐(kFrame=0)は 5 回)。そこで「極小を探す → r が極小から相対 AMP 上がったら確定 →
    //   極大を探す → r が極大から相対 AMP 下がったら極小探索へ戻る」という往復で採る。
    //   **この門は本器の抽出器の定義の一部**である(NS の位相制限 1.5π とは別の門)。
    //   生の ṙ 交差回数も `rawCross` に残す(**門が何を落としたかを数で見せる**)。
    const AMP = 1e-3;
    const mins = [];
    let rEnd = null, nan = false, rdPrev = null, rawCross = 0;
    let looking = 'min', extR = Infinity, extK = -1;
    const mTot0 = Array.prototype.reduce.call(S.m, (a, b) => a + b, 0);
    let k = 0, stopped = 'time';
    for (; k < nSteps; k++) {
      S.step(dt);
      const dx = S.x[oi] - S.x[ci], dy = S.y[oi] - S.y[ci];
      const rr = Math.hypot(dx, dy);
      const dvx = S.vx[oi] - S.vx[ci], dvy = S.vy[oi] - S.vy[ci];
      const rd = (rr > 0) ? (dx * dvx + dy * dvy) / rr : 0;
      if (rdPrev !== null && rdPrev < 0 && rd >= 0) rawCross++;   // **生の ṙ 交差**(比較用)
      rdPrev = rd;
      if (looking === 'min') {
        if (rr < extR) { extR = rr; extK = k; }
        else if (rr - extR > AMP * extR) { mins.push(extK); looking = 'max'; extR = rr; extK = k; }
      } else {
        if (rr > extR) { extR = rr; extK = k; }
        else if (extR - rr > AMP * extR) { looking = 'min'; extR = rr; extK = k; }
      }
      rEnd = rr;
      if (S.hasNaN()) { nan = true; stopped = 'nan'; break; }
      if (nMinWant > 0 && mins.length >= nMinWant) { stopped = 'minima'; break; }
      if (S.n !== undefined && S.n < 2) { stopped = 'merged'; break; }
    }
    const mTot = Array.prototype.reduce.call(S.m, (a, b) => a + b, 0);
    return { ok: true, steps: k, stopped, nan, minima: mins, tEndActual: k * dt,
      separationEnd: rEnd, nBodies: S.n === undefined ? null : S.n, rawCross,
      massTotal0: mTot0, massTotalEnd: mTot, merged: (S.n !== undefined && S.n < 2),
      kFrame: v.preset.physics.kFrame, geoPN: v.preset.physics.geoPN,
      sampleClass: v.preset.sampleClass,
      clamp: (S.clampVN || 0) + (S.clampSN || 0) + (S.clampHN || 0) + (S.clampRN || 0) + (S.clampTN || 0) };
  };
  // ---- 星団: 同一終了時刻まで走り、投影量を返す
  window.__w265aCluster = (srcId, f, kFrame, dt, tEnd, asIs) => {
    const src = HP.allPresets().find((q) => q.id === srcId);
    if (!src) return { ok: false, errors: ['no such preset: ' + srcId] };
    const rep = {};
    const pd = asIs ? JSON.parse(JSON.stringify(src))
      : clusterMassScaled(src, f, { kFrame, id: 'w265aCl', report: rep });
    const v = HP.validatePreset(pd);
    if (!v.ok) return { ok: false, errors: v.errors };
    HP.sim.build(v.preset);
    const S = HP.sim;
    const snap = () => {
      const pts = [];
      for (let i = 0; i < S.n; i++) pts.push({ x: S.x[i], y: S.y[i], vx: S.vx[i], vy: S.vy[i], m: S.m[i] });
      return pts;
    };
    const st0 = projectedStats(snap(), { bands: 5 });
    const nSteps = Math.round(tEnd / dt);
    let k = 0, nan = false;
    for (; k < nSteps; k++) { S.step(dt); if (S.hasNaN()) { nan = true; break; } }
    const st1 = projectedStats(snap(), { bands: 5 });
    return { ok: true, steps: k, nan, tEndActual: k * dt, n: S.n,
      start: st0, end: st1, scaled: rep.touched || null,
      kFrame: v.preset.physics.kFrame, geoPN: v.preset.physics.geoPN,
      sampleClass: v.preset.sampleClass,
      massTotal: Array.prototype.reduce.call(S.m, (a, b) => a + b, 0),
      clamp: (S.clampVN || 0) + (S.clampSN || 0) + (S.clampHN || 0) + (S.clampRN || 0) + (S.clampTN || 0) };
  };
  window.__w265aPresetFacts = (ids) => ids.map((id) => {
    const p = HP.allPresets().find((q) => q.id === id);
    if (!p) return { id, missing: true };
    return { id, emoji: p.emoji, sampleClass: p.sampleClass, kFrame: p.physics.kFrame,
      geoPN: p.physics.geoPN, scaleExp: p.scaleExp, notClaim: p.notClaim || null,
      hasMassCal: !!p.massCalibration,
      baseMass: (p.massCalibration && p.massCalibration.baseMass) ? p.massCalibration.baseMass.slice() : null,
      bodyMass: p.bodies.map((b) => (b.m !== undefined ? b.m : (b.mMin !== undefined ? b.mMin : null))) };
  });
});

const out = { meta: { wave: '第265便a', target: TARGET, dt0: DT0, divs: DIVS,
  bhWindow: { tShort: BH_T_SHORT, tLong: BH_T, minimaWanted: BH_MIN },
  clusterWindow: { tEnd: CL_T },
  claim: '**アナロジーは「同じ手順・別窓」である。** 窓・抽出器・観測版を NS と揃えたとは書かない。'
    + '**較正クラスへは上げない**(principle のまま)。**共同根は観測 2 量の門が繋がってから**。',
  prelimSource: 'PRELIM は**統括の予備測定**(照合のためだけの定数)。観測値ではない。',
  touched: '**本体 🎻🎐🍇🫐 の JSON は 1 bit も書き換えていない**。`S._core` には 1 命令も足していない。' },
  presetFacts: null, gateCensus: {}, bh: null, cluster: null, pageErrors: [] };

out.presetFacts = await pg.evaluate((ids) => window.__w265aPresetFacts(ids),
  ['gw150914', 'gw150914DFM', 'tuc47', 'tuc47DFM']);
out.gateCensus = {
  bh: gateCensus(SOLAR, ['GW150914 A', 'GW150914 B']),
  cluster: gateCensus(CLUSTER, ['47 Tuc']),
  note: '**σ を持つ行の本数**を数えた。0 なら「観測 2 量の門が繋がっていない」——'
    + 'この状態で共同根を出さない(統括の読み (B))。第266便a で星団 CSV にも sigma 列が付いたが、'
    + '**印が `verified` の行だけ**を接続と数える(`withVerifiedSigma`)。' };

const tAll = Date.now();

// ================================================================ (1) BH 連星
if (want('bh')) {
  const bh = { declaration: protocolDeclaration({ systemKind: 'bh-binary', id: 'gw150914DFM',
    sampleClass: 'calibration', calibrationClass: 'principle-analogy',
    window: { tStart: 0, tEndShort: BH_T_SHORT, tEndLong: BH_T, unit: 'sim time',
      why: 'inspiral 窓。**合体には達しない**(基準状態のスナップショットから数十公転で合体する系である)' },
    extractor: { name: 'separation-minima-v1',
      quantity: ['final-separation', 'minima-interval-period', 'period-drift', 'final-total-mass'],
      amplitudeGate: 1e-3,
      definition: '分離 r の**ヒステリシス極小検出**(極小 → 相対 1×10⁻³ 上昇で確定 → 極大 → '
        + '相対 1×10⁻³ 下降で極小探索へ)。門が無いと 🎻 では 2 步周期の ṙ 交差を極小として採る(実測)。'
        + '周期は極小間隔の平均。周期変化は前半窓と後半窓の平均間隔の差を窓中心の時間差で割った無次元量。'
        + '最終質量は窓の終端での総質量(**合体に達したかどうかを別に記録する**)。'
        + '**振幅門は NS の位相制限(1.5π)とは別の門である**' },
    observationVersion: { csv: 'paper/data/solar-observations.csv の GW150914 A/B 行' },
    quantities: ['orbital_period(派生参照値)', 'mass'],
    gateConnected: out.gateCensus.bh.withVerifiedSigma > 0 }),
    columns: [] };
  out.bh = bh;

  const runCol = async (tag, srcId, f, k, asIs) => {
    const col = { tag, srcId, f, kFrame: k, asIs, stages: [] };
    bh.columns.push(col);
    for (const div of DIVS) {
      const dt = DT0 / div;
      // ① 予備測定と同じ終了時刻での最終分離
      const rs = await pg.evaluate(({ id, f, k, dt, t, asIs }) =>
        window.__w265aBh(id, f, k, dt, t, 0, asIs), { id: srcId, f, k, dt, t: BH_T_SHORT, asIs });
      // ② 周期(極小 BH_MIN 個)
      const rl = await pg.evaluate(({ id, f, k, dt, t, n, asIs }) =>
        window.__w265aBh(id, f, k, dt, t, n, asIs), { id: srcId, f, k, dt, t: BH_T, n: BH_MIN, asIs });
      const unitSec = await pg.evaluate((id) => Math.pow(10,
        Number(HP.allPresets().find((q) => q.id === id).scaleExp.T)), srcId);
      let P = null, Pdrift = null, P1 = null, P2 = null;
      if (rl.ok && rl.minima.length >= 4) {
        const m = rl.minima, n = m.length;
        P = (m[n - 1] - m[0]) * dt / (n - 1) * unitSec;
        const h = Math.floor(n / 2);
        P1 = (m[h - 1] - m[0]) * dt / (h - 1) * unitSec;
        P2 = (m[n - 1] - m[h]) * dt / (n - 1 - h) * unitSec;
        const dtCentres = ((m[n - 1] + m[h]) / 2 - (m[h - 1] + m[0]) / 2) * dt * unitSec;
        Pdrift = (dtCentres > 0) ? (P2 - P1) / dtCentres : null;    // 無次元(s/s)
      }
      col.stages.push({ div, dt, unitSec,
        shortRun: { steps: rs.steps, stopped: rs.stopped, separationEnd: rs.separationEnd,
          massTotalEnd: rs.massTotalEnd, merged: rs.merged, nan: rs.nan, clamp: rs.clamp },
        longRun: { steps: rl.steps, stopped: rl.stopped, nMinima: rl.ok ? rl.minima.length : 0,
          rawCross: rl.rawCross,
          separationEnd: rl.separationEnd, massTotalEnd: rl.massTotalEnd, merged: rl.merged,
          nan: rl.nan, clamp: rl.clamp },
        period: P, periodFirstHalf: P1, periodSecondHalf: P2, periodDrift: Pdrift,
        kFrame: rs.kFrame, geoPN: rs.geoPN, sampleClass: rs.sampleClass, errors: rs.errors || rl.errors || null });
      console.error(`  🎻/🎐 ${tag} dt/${div}: 最終分離(T=${BH_T_SHORT})=${rs.separationEnd === null ? '—'
        : rs.separationEnd.toFixed(4)}  P=${P === null ? '—' : P.toFixed(8)} s  Ṗ=${Pdrift === null ? '—'
        : Pdrift.toExponential(3)}  合体=${rs.merged}  [${((Date.now() - tAll) / 1000).toFixed(0)} s]`);
      fs.mkdirSync(path.dirname(OUT), { recursive: true });
      fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
    }
    const g = (fn) => col.stages.map(fn);
    col.richardson = {
      separationEnd: richardson3(...g((s) => s.shortRun.separationEnd)),
      period: richardson3(...g((s) => s.period)),
      periodDrift: richardson3(...g((s) => s.periodDrift)) };
    // CSV の参照値との差(**σ が無いので σ 判定はしない** —— % だけ記録する)
    const ref = SOLAR.find((r) => r.body === 'GW150914 B' && r.quantity === 'orbital_period');
    col.referenceCheck = ref ? { refValue: ref.value, refUnit: ref.unit, refSigma: ref.sigma,
      note: '**派生参照値**(ニュートン換算の基準状態)であって σ を持つ観測量ではない。'
        + 'σ 判定はしない —— % だけを記録する。',
      pctByStage: col.stages.map((s) => (s.period === null ? null : (s.period - ref.value) / ref.value * 100)),
      pctExtrapolated: (col.richardson.period && col.richardson.period.ext !== null)
        ? (col.richardson.period.ext - ref.value) / ref.value * 100 : null } : null;
    return col;
  };

  await runCol('asIs_gw150914(🎐・内蔵のまま)', 'gw150914', 1, 0, true);
  await runCol('asIs_gw150914DFM(🎻・内蔵のまま)', 'gw150914DFM', 1, 1, true);
  const baseCol = await runCol('baseline(kFrame=1・f=1)', 'gw150914DFM', 1, 1, false);

  // 感度(h のみ・中心差分)。**共同根は出さない**。
  // **kFrame は検証器の値域 [0,1] に当たる**(`CLAMPS.kFrame=[0,1]` — 本便の実測: k=1.2 の走行は
  // k=1.0 とビット同一)。したがって **k=1 を中心にした中心差分は取れない** —— 中心を 0.9 へずらす
  // (基準走行の点 k=1 とは**別の点**での感度である)。
  const DK = 0.1, DF = 0.05, KC = 0.9;
  const one = async (f, k) => {
    const dt = DT0;
    const rl = await pg.evaluate(({ id, f, k, dt, t, n }) =>
      window.__w265aBh(id, f, k, dt, t, n, false),
    { id: 'gw150914DFM', f, k, dt, t: BH_T, n: BH_MIN });
    const unitSec = await pg.evaluate((id) => Math.pow(10,
      Number(HP.allPresets().find((q) => q.id === id).scaleExp.T)), 'gw150914DFM');
    if (!rl.ok || rl.minima.length < 4) return { f, k, P: null, Pdrift: null };
    const m = rl.minima, n = m.length;
    const P = (m[n - 1] - m[0]) * dt / (n - 1) * unitSec;
    const h = Math.floor(n / 2);
    const P1 = (m[h - 1] - m[0]) * dt / (h - 1) * unitSec;
    const P2 = (m[n - 1] - m[h]) * dt / (n - 1 - h) * unitSec;
    const dtC = ((m[n - 1] + m[h]) / 2 - (m[h - 1] + m[0]) / 2) * dt * unitSec;
    return { f, k, P, Pdrift: dtC > 0 ? (P2 - P1) / dtC : null };
  };
  const pk = await one(1, KC + DK), mk = await one(1, KC - DK);
  const pf = await one(1 + DF, KC), mf = await one(1 - DF, KC);
  const clampHi = await one(1, 1.2), clampAt1 = await one(1, 1.0);
  bh.clampProbe = { k12: clampHi, k10: clampAt1,
    identical: (clampHi.P !== null && clampAt1.P !== null && clampHi.P === clampAt1.P),
    note: '**kFrame は検証器の値域 [0,1] に当たる**(`CLAMPS.kFrame=[0,1]`)。'
      + 'k=1.2 の宣言は黙って 1.0 になる —— この 2 行が同じ値なら、それが実測の証拠である。' };
  const base0 = baseCol.stages[0];
  let J = null;
  if ([pk, mk, pf, mf].every((z) => z.P !== null)) {
    J = { dPdk: (pk.P - mk.P) / (2 * DK), dPdf: (pf.P - mf.P) / (2 * DF),
      dWdk: (pk.Pdrift !== null && mk.Pdrift !== null) ? (pk.Pdrift - mk.Pdrift) / (2 * DK) : null,
      dWdf: (pf.Pdrift !== null && mf.Pdrift !== null) ? (pf.Pdrift - mf.Pdrift) / (2 * DF) : null,
      dk: DK, df: DF };
    if (J.dWdk !== null && J.dWdf !== null) {
      J.det = J.dPdk * J.dWdf - J.dPdf * J.dWdk;
      bh.sensitivityNondim = nondimJacobian(J,
        { k: KC, f: 1, P: base0.period, omegaDot: base0.periodDrift });
    }
  }
  bh.sensitivityAtH = J || { error: '感度の 4 点のどれかで周期が測れない' };
  bh.sensitivityCenter = { k: KC, f: 1,
    why: '**k=1 は値域の端**(kFrame∈[0,1])なので中心差分が取れない —— 中心を 0.9 にした' };
  bh.sensitivityPoints = { pk, mk, pf, mf };
  bh.jointRoot = { attempted: false,
    why: '**観測 2 量の門が繋がっていない**(CSV の GW150914 行で σ を持つ行は '
      + out.gateCensus.bh.withSigma + ' 本)。共同根は門が繋がってから。' };
  bh.prelimCheck = {
    prelim: PRELIM.gw150914_finalSeparation_T240,
    measuredAsIs_gw150914: bh.columns[0].stages.map((s) => s.shortRun.separationEnd),
    delta: bh.columns[0].stages.map((s, i) => (s.shortRun.separationEnd === null ? null
      : s.shortRun.separationEnd - PRELIM.gw150914_finalSeparation_T240[i])) };
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
}

// ================================================================ (2) 星団
if (want('cluster')) {
  const cl = { declaration: protocolDeclaration({ systemKind: 'cluster', id: 'tuc47',
    sampleClass: 'principle', calibrationClass: 'principle-analogy',
    window: { tStart: 0, tEnd: CL_T, unit: 'sim time', why: '**統括の予備測定と同じ終了時刻**で照合するため' },
    extractor: { name: 'projected-x-axis-v1',
      quantity: ['projected-half-mass-radius', 'core-radius-half-density', 'in-plane-sigma-by-band'],
      definition: '投影は x 軸・「視線」は y 成分。コア半径は面密度が中心帯の半分に落ちる R'
        + '(**King の r_c とは混用しない**)' },
    observationVersion: { csv: 'paper/data/cluster-galaxy-observations.csv の 47 Tuc 行'
      + '(第266便a で **sigma 列**が付いたが、入った σ は `sigma_primary=unverified` で門には入らない)' },
    quantities: ['sigma0', 'core_radius', 'half_light_radius_projected'],
    gateConnected: out.gateCensus.cluster.withVerifiedSigma > 0 }),
    columns: [] };
  out.cluster = cl;

  const runCol = async (tag, srcId, f, k, asIs) => {
    const col = { tag, srcId, f, kFrame: k, asIs, stages: [] };
    cl.columns.push(col);
    for (const div of DIVS) {
      const dt = DT0 / div;
      const r = await pg.evaluate(({ id, f, k, dt, t, asIs }) =>
        window.__w265aCluster(id, f, k, dt, t, asIs), { id: srcId, f, k, dt, t: CL_T, asIs });
      col.stages.push({ div, dt, ok: r.ok, steps: r.steps, nan: r.nan, n: r.n, clamp: r.clamp,
        massTotal: r.massTotal, scaled: r.scaled, kFrame: r.kFrame, geoPN: r.geoPN,
        sampleClass: r.sampleClass, start: r.start, end: r.end, errors: r.errors || null });
      const e = r.end || {};
      console.error(`  🍇/🫐 ${tag} dt/${div}: 投影半質量半径=${e.projectedHalfMassRadius === undefined
        || e.projectedHalfMassRadius === null ? '—' : e.projectedHalfMassRadius.toFixed(4)}`
        + `  コア半径=${e.coreRadiusHalfDensity === null || e.coreRadiusHalfDensity === undefined ? '—'
          : e.coreRadiusHalfDensity.toFixed(4)}`
        + `  σ(面内)=${e.sigmaInPlaneProxyAll === undefined ? '—' : e.sigmaInPlaneProxyAll.toFixed(5)}`
        + `  [${((Date.now() - tAll) / 1000).toFixed(0)} s]`);
      fs.mkdirSync(path.dirname(OUT), { recursive: true });
      fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
    }
    const g = (fn) => col.stages.map(fn);
    col.richardson = {
      projectedHalfMassRadius: richardson3(...g((s) => (s.end ? s.end.projectedHalfMassRadius : null))),
      halfMassRadius2D: richardson3(...g((s) => (s.end ? s.end.halfMassRadius2D : null))),
      coreRadiusHalfDensity: richardson3(...g((s) => (s.end ? s.end.coreRadiusHalfDensity : null))),
      sigmaInPlaneProxyAll: richardson3(...g((s) => (s.end ? s.end.sigmaInPlaneProxyAll : null))) };
    return col;
  };

  await runCol('asIs_tuc47(🍇・内蔵のまま kFrame=0・f=1)', 'tuc47', 1, 0, true);
  await runCol('asIs_tuc47DFM(🫐・内蔵のまま kFrame=1・台帳 f)', 'tuc47DFM', 1, 1, true);
  const baseCol = await runCol('baseline(🍇 に kFrame=1・f=1)', 'tuc47', 1, 1, false);

  // 感度(h のみ・中心差分)。hold-out 質量 f と kFrame。
  // **kFrame は値域 [0,1] に当たる**ので中心を 0.8 へずらす(基準走行の点 k=1 とは別の点)。
  const DK = 0.2, DF = 0.1, KC = 0.8;
  const one = async (f, k) => {
    const r = await pg.evaluate(({ id, f, k, dt, t }) => window.__w265aCluster(id, f, k, dt, t, false),
      { id: 'tuc47', f, k, dt: DT0, t: CL_T });
    return { f, k, rHalf: r.ok && r.end ? r.end.projectedHalfMassRadius : null,
      rHalf2D: r.ok && r.end ? r.end.halfMassRadius2D : null,
      rCore: r.ok && r.end ? r.end.coreRadiusHalfDensity : null,
      sigma: r.ok && r.end ? r.end.sigmaInPlaneProxyAll : null };
  };
  const pk = await one(1, KC + DK), mk = await one(1, KC - DK);
  const pf = await one(1 + DF, KC), mf = await one(1 - DF, KC);
  const clampHi = await one(1, 1.2), clampAt1 = await one(1, 1.0);
  cl.clampProbe = { k12: clampHi, k10: clampAt1,
    identical: (clampHi.rHalf !== null && clampHi.rHalf === clampAt1.rHalf
      && clampHi.sigma === clampAt1.sigma),
    note: '**kFrame は検証器の値域 [0,1] に当たる**(`CLAMPS.kFrame=[0,1]`)。k=1.2 は黙って 1.0 になる。' };
  cl.sensitivityCenter = { k: KC, f: 1,
    why: '**k=1 は値域の端**(kFrame∈[0,1])なので中心差分が取れない —— 中心を 0.8 にした' };
  cl.sensitivityAtH = {
    dRhalf_dk: (pk.rHalf !== null && mk.rHalf !== null) ? (pk.rHalf - mk.rHalf) / (2 * DK) : null,
    dRhalf_df: (pf.rHalf !== null && mf.rHalf !== null) ? (pf.rHalf - mf.rHalf) / (2 * DF) : null,
    dSigma_dk: (pk.sigma !== null && mk.sigma !== null) ? (pk.sigma - mk.sigma) / (2 * DK) : null,
    dSigma_df: (pf.sigma !== null && mf.sigma !== null) ? (pf.sigma - mf.sigma) / (2 * DF) : null,
    dk: DK, df: DF, points: { pk, mk, pf, mf } };
  const b0 = baseCol.stages[0].end;
  if (b0 && cl.sensitivityAtH.dRhalf_dk !== null && cl.sensitivityAtH.dSigma_dk !== null) {
    cl.sensitivityNondim = nondimJacobian(
      { dPdk: cl.sensitivityAtH.dRhalf_dk, dPdf: cl.sensitivityAtH.dRhalf_df,
        dWdk: cl.sensitivityAtH.dSigma_dk, dWdf: cl.sensitivityAtH.dSigma_df },
      { k: KC, f: 1, P: b0.projectedHalfMassRadius, omegaDot: b0.sigmaInPlaneProxyAll });
  }
  cl.jointRoot = { attempted: false,
    why: '**観測 2 量の門が繋がっていない**(星団 CSV に σ 列そのものが無い)。'
      + 'さらに星団の共通 f は多体で一意でない(X15)—— 対象・動かす質量・初期値固定法の宣言が先。' };
  cl.prelimCheck = {
    prelim: PRELIM.tuc47_projHalfMass_T9p6,
    measuredAsIs_tuc47_projected: cl.columns[0].stages.map((s) => (s.end ? s.end.projectedHalfMassRadius : null)),
    measuredAsIs_tuc47_2D: cl.columns[0].stages.map((s) => (s.end ? s.end.halfMassRadius2D : null)),
    deltaProjected: cl.columns[0].stages.map((s, i) => (s.end && s.end.projectedHalfMassRadius !== null
      ? s.end.projectedHalfMassRadius - PRELIM.tuc47_projHalfMass_T9p6[i] : null)),
    delta2D: cl.columns[0].stages.map((s, i) => (s.end && s.end.halfMassRadius2D !== null
      ? s.end.halfMassRadius2D - PRELIM.tuc47_projHalfMass_T9p6[i] : null)),
    note: '**h/2→h/4 の差が h→h/2 の差より大きいなら単純外挿しない**(`richardson3` の monotone を見る)。' };
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
}

out.meta.spentSec = +((Date.now() - tAll) / 1000).toFixed(1);
out.pageErrors = pageErrors;
await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error('[w265a-analogy] wrote ' + OUT + '  (' + out.meta.spentSec + ' s)');

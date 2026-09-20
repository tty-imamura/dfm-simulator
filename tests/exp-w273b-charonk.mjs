// 第273便b(統括の検証項目 R21)— **❄️ カロン C3 の符号反転区間の探索(fit と明示・診断のみ)**。
//
// ■ なぜ走らせるのか(R21 の訂正)
//   第272便b の結論「kFrame∈[0,1] に 3σ へ入る値は無い」は **C2(f=1)の 6 点に限る**言い方である。
//   C3(一次則 f の自己無撞着解)では **k=0 で +294σ・k=0.1 で −4729σ** と**符号が反転**しており、
//   線形補間の零点 k≈0.0059 は第272便b では**探索されていなかった**。本器はその区間を実際に刻む。
//
// ■ **これは fit である**(独立な予測ではない)
//   零点を決めるのに使うのは**観測周期そのもの**(551856.43872 ± 0.02592 s)である。
//   したがって得られる k は「観測に合わせて決めた 1 つの自由パラメータ」であり、
//   **「解」でも「最良値」でも「kFrame の正しい値」でもない**。JSON は `fit:true` を刻む。
//   独立な観測量(近点移動・e・2 天体目の量)を**予測**できたときにだけ結論の語を使う ——
//   本器の出力はその手前である。**判定はしない。**
//
// ■ しないこと
//   ・`beta/index.html` を 1 文字も変えない(読むだけ)。**内蔵 124 本は 1 bit も変えない**
//     (分数 kFrame は器の中の**診断コピー**だけ。第273便b の二層契約に従い、診断コピーは
//      `physics.kFrameApprox:"space-mesh-effective"` を宣言する ——「近似として置いた」の明示)。
//   ・合否を書かない・「新発見」「潮汐ロックを証明」「観測と合った」を書かない。
//
// ■ 測るもの(**測定は第272便b と同一のコード**: `tests/lib-w273b-charonpage.mjs`)
//   ① **C3 の二分探索**: f=一次則の自己無撞着解 f(k) を毎回引き直し、σ(k)=(P₂(k)−P_obs)/σ_obs の
//      符号が変わる区間を h 段(dt 0.016・20,700,000 步)で挟み込む。**約 8〜14 点**。
//   ② **候補 k\* の 3 段**(h / h2 / h4 —— 物理時間は同じ)。次数 p と ε̂ は第271便a と同じ規約で、
//      **連続 2 段差が同符号のときだけ**立てる。**0.3σ 条件は緩めない**(そもそも判定しない)。
//   ③ **C2(f=1)でも同じ区間を刻む**(反転が無いことの確認 —— 単調なら零点は値域の外である)。
//   ④ **ε 系列**(0.05 / 0.025 / 0.0125)を k\* 固定で**別列**として測る(k と ε を同時に動かさない)。
//   ⑤ **宣言鍵の同値性**(裁定 AH1): `physics.kFrameApprox` を付けた診断コピーと付けないものが
//      **同じ步数で 1 bit も違わない**ことを実測する(宣言専用キーであることの機械的な裏づけ)。
//
// 実行:
//   PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w273b-charonk.mjs
//       [--iters N] [--stages] [--steps N] [--pilot]
//   --pilot / 規定步数に満たない --steps は**正本へ書かない**(charonk-w273b-probe.json へ)。
// 出力: tests/out/charonk-w273b.json(来歴 meta は tests/lib-w272e-provenance.mjs 版 w272e-1)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { installCharonPage, CHARON_PAGE_VERSION } from './lib-w273b-charonpage.mjs';
import { charonMergeKey, isCanonicalRun, MERGEKEY_VERSION } from './lib-w273b-mergekey.mjs';
import { withProvenance } from './lib-w272e-provenance.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'charonk-w273b.json');
const PROBE_OUT = path.join(ROOT, 'tests', 'out', 'charonk-w273b-probe.json');
const CALAUDIT = path.join(ROOT, 'tests', 'out', 'calaudit-w249.json');
const HARNESS_VERSION = 'w273b-charonk-1';

const argv = process.argv.slice(2);
const getArg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const PILOT = argv.includes('--pilot');
const DO_STAGES = !argv.includes('--no-stages');
const ITERS = Number(getArg('--iters', 14));

// ---- 契約(第272便b と同じ値。**走らせる前に固定した**) -------------------------
const STEP_H = 20700000, ORB_MAX = 60, PERI_WINDOW = 20;
const STAGES = { h: { dt: 0.016, steps: STEP_H }, h2: { dt: 0.008, steps: STEP_H * 2 }, h4: { dt: 0.004, steps: STEP_H * 4 } };
const STEPS = PILOT ? 2100000 : Number(getArg('--steps', STEP_H));
const EPS_SERIES = [0.05, 0.025, 0.0125];
const K_LO = 0, K_HI = 0.1;            // 第272便b の実測で σ が +294 → −4729 と符号を変える区間
const SIGMA_STOP = 1;                  // |σ| がこれ以下になったら挟み込みを止める(**合否ではない**)
const K_TOL = 1e-6;                    // 区間幅の下限

const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const targetSha256 = sha(fs.readFileSync(path.join(ROOT, TARGET)));
const measureSha256 = sha(fs.readFileSync(path.join(ROOT, 'tests', 'lib-w273b-charonpage.mjs')));
const libSha256 = sha(fs.readFileSync(path.join(ROOT, 'tests', 'lib-w272b-pairlock.mjs')));

// ---- 観測値・σ は calaudit 正本から引く(手で打ち直さない) ----------------------
let OBS = null;
try {
  const ca = JSON.parse(fs.readFileSync(CALAUDIT, 'utf8'));
  const pc = ca.presets.find((p) => p.id === 'plutoCharonReal');
  const row = pc.quantities.find((q) => q.kind === 'period' && q.adopted && q.adopted.value > 0);
  OBS = { value: row.adopted.value, sigma: row.adopted.sigma, unit: row.adopted.unit,
    key: row.adopted.key, recordId: row.adopted.recordId, source: row.adopted.source,
    from: 'tests/out/calaudit-w249.json', calauditSha256: sha(fs.readFileSync(CALAUDIT)) };
} catch (e) { OBS = { error: String(e) }; }
if (!OBS || !(OBS.sigma > 0)) { console.error('観測行が引けない: ' + JSON.stringify(OBS)); process.exit(2); }

// ================================================================ ブラウザ
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
const pageErrors = [];
const page = await browser.newPage();
page.on('pageerror', (e) => pageErrors.push(String(e)));
await page.goto(INDEX, { waitUntil: 'load' });
await page.waitForFunction(() => window.HP && HP.sim);
await page.evaluate(installCharonPage, { ORB_MAX, PERI_WINDOW });

const base = await page.evaluate((i) => window.__w272.declaredState(i), 'plutoCharonReal');
const A0 = Math.hypot(base.xB - base.xA, base.yB - base.yA);
const D00 = 0.006, EPS0 = 0.05;                   // 第272便b と同じ(一次則 f の引数)
const SEC = Math.pow(10, base.scaleExpT);

const fLinAt = async (kf) => {
  const r = await page.evaluate((z) => window.__w272.fLin(z.mA, z.mB, z.a, z.D0, z.eps, z.kF, 1),
    { mA: base.mA, mB: base.mB, a: A0, D0: D00, eps: EPS0, kF: kf });
  return r ? r.f : null;
};

const sigmaOf = (sec) => (sec === null || !Number.isFinite(sec)) ? null : (sec - OBS.value) / OBS.sigma;
const pctOf = (sec) => (sec === null || !Number.isFinite(sec)) ? null : (sec - OBS.value) / OBS.value * 100;

/** 1 点を測る(列 1 本 = 第272便b の測定そのまま)。 */
async function measure(tag, cfg, stage) {
  const st = STAGES[stage];
  const steps = (stage === 'h') ? STEPS : st.steps;
  const t0 = Date.now();
  const r = await page.evaluate((z) => window.__w272.run(z.cfg, z.dt, z.steps),
    { cfg, dt: st.dt, steps });
  const wall = (Date.now() - t0) / 1000;
  if (r.error) { console.log(tag + ' ERROR ' + JSON.stringify(r.errors)); return { tag, stage, cfg, error: r.error, errors: r.errors, wallSec: wall }; }
  const revSec = r.rev.map((x) => x * SEC);
  const rev2 = (revSec.length > 1) ? revSec[1] : null;
  const periA = (r.A.perMean !== null) ? r.A.perMean * SEC : null;
  const out = { tag, stage, cfg, dt: st.dt, stepsRequested: steps, wallSec: wall,
    kFrame: r.cfgApplied.kFrame, f: cfg.f, softening: r.cfgApplied.softening,
    rev2Sec: rev2, revSec: revSec.slice(0, 4), revN: r.revN,
    periASec: periA, periBSec: (r.B.perMean !== null) ? r.B.perMean * SEC : null,
    residPct: pctOf(rev2), sigma: sigmaOf(rev2),
    residPctPeriA: pctOf(periA), sigmaPeriA: sigmaOf(periA),
    precessDegPerRevA: r.A.slopeDeg, precessResidDegA: r.A.residDeg,
    precessDegPerRevB: r.B.slopeDeg, precessResidDegB: r.B.residDeg,
    eProxy: r.eProxy, eProxy1: r.eProxy1, rMin: r.rMin, rMax: r.rMax,
    ledger: r.ledger, clamp: r.clamp, nan: r.nan, stop: r.stop, steps: r.steps,
    cfgApplied: r.cfgApplied, warnings: r.warnings };
  console.log([tag.padEnd(18), stage.padEnd(3), 'k=' + String(out.kFrame).padEnd(12),
    'f=' + String(out.f === undefined ? 1 : out.f).slice(0, 14).padEnd(16),
    'P2=' + (rev2 === null ? '—' : rev2.toFixed(4)).padStart(14),
    'σ=' + (out.sigma === null ? '—' : out.sigma.toFixed(3)).padStart(12),
    'stop=' + r.stop, 'nan=' + r.nan, wall.toFixed(1) + 's'].join(' '));
  return out;
}

// ================================================================ ① C3 の二分探索(fit)
const c3 = [];
const evalC3 = async (k) => {
  const f = await fLinAt(k);
  const row = await measure('C3_k' + k, { kFrame: k, f, geoPN: 2, softening: EPS0 }, 'h');
  c3.push(row);
  return row;
};
let lo = K_LO, hi = K_HI;
const rLo = await evalC3(lo), rHi = await evalC3(hi);
let sLo = rLo.sigma, sHi = rHi.sigma;
const bracketed = (sLo !== null && sHi !== null && Math.sign(sLo) !== Math.sign(sHi));
let kStar = null, sStar = null, iters = 0;
if (bracketed) {
  for (iters = 0; iters < ITERS; iters++) {
    const mid = 0.5 * (lo + hi);
    const r = await evalC3(mid);
    if (r.sigma === null) break;
    if (Math.abs(r.sigma) <= SIGMA_STOP) { kStar = mid; sStar = r.sigma; break; }
    if (Math.sign(r.sigma) === Math.sign(sLo)) { lo = mid; sLo = r.sigma; } else { hi = mid; sHi = r.sigma; }
    kStar = mid; sStar = r.sigma;
    if (hi - lo < K_TOL) break;
  }
}
// 線形補間の零点(第272便b の 2 点からの外挿値と比べるため)
const interp2 = (a, fa, b, fb) => (fa === fb) ? null : a + (b - a) * (-fa) / (fb - fa);
const linearZero = interp2(K_LO, rLo.sigma, K_HI, rHi.sigma);

// ================================================================ ② 候補 k* の 3 段
const stageRows = {};
if (DO_STAGES && kStar !== null && !PILOT && STEPS === STEP_H) {
  const fStar = await fLinAt(kStar);
  for (const st of ['h', 'h2', 'h4']) {
    stageRows[st] = await measure('C3star', { kFrame: kStar, f: fStar, geoPN: 2, softening: EPS0 }, st);
  }
}
let order = null;
if (stageRows.h && stageRows.h2 && stageRows.h4) {
  const q = [stageRows.h.rev2Sec, stageRows.h2.rev2Sec, stageRows.h4.rev2Sec];
  if (q.every((z) => Number.isFinite(z))) {
    const d1 = q[1] - q[0], d2 = q[2] - q[1];
    const same = Math.sign(d1) === Math.sign(d2) && d2 !== 0;
    const p = same ? Math.log2(Math.abs(d1 / d2)) : null;
    const eh = (p !== null && Math.pow(2, p) !== 1) ? Math.abs(d2) / (Math.pow(2, p) - 1) : null;
    order = { stages: q, d1, d2, sameSign: same, pObs: p, epsHat: eh,
      epsHatSigma: eh === null ? null : eh / OBS.sigma,
      assessedValue: q[2], assessedStage: 'h4',
      residPct: pctOf(q[2]), sigma: sigmaOf(q[2]), orderEstimable: same,
      note: '次数は連続 2 段差が同符号のときだけ立てる(第271便a と同じ規約)。**判定はしていない** —— '
        + 'この k は観測周期に合わせた fit である' };
  }
}

// ================================================================ ③ C2(f=1)の同区間
const c2 = [];
for (const k of [0, 0.00625, 0.0125, 0.025, 0.05, 0.1]) {
  c2.push(await measure('C2_k' + k, { kFrame: k, f: 1, geoPN: 2, softening: EPS0 }, 'h'));
}
const c2sig = c2.map((r) => r.sigma).filter((z) => z !== null);
const c2Monotone = c2sig.every((z, i) => i === 0 || z > c2sig[i - 1]);
const c2SignChange = c2sig.some((z) => Math.sign(z) !== Math.sign(c2sig[0]));

// ================================================================ ④ ε 系列(k* 固定・別列)
const epsRows = [];
if (kStar !== null) {
  const fStar = await fLinAt(kStar);
  for (const ep of EPS_SERIES) {
    epsRows.push(await measure('S_e' + ep, { kFrame: kStar, f: fStar, geoPN: 2, softening: ep }, 'h'));
  }
}

// ================================================================ ⑤ 宣言鍵の同値性(AH1)
// `physics.kFrameApprox` を足した診断コピーと足さないものを**同じ步数**走らせ、
// 状態(x,y,vx,vy,spin)と署名を突き合わせる。**宣言専用キーであることの機械的な裏づけ**。
const declarationInert = await page.evaluate((N) => {
  const src = HP.allPresets().find((q) => q.id === 'plutoCharonReal');
  // 第275便a(第65報 (1)・kFrame 二値の既定契約): 宣言鍵の無い 0<k<1 は既定で最寄りの {0,1} へ
  //   丸められる(案B)ので、「宣言なし」の診断コピーはもう k=0.05 では走らない。**宣言専用キー**の
  //   裏づけは **2 つの宣言値**(`"space-mesh-effective"` と `"sample-only"` — どちらも非較正クラスで
  //   受理され k は 0.05 のまま)を同じ步数走らせて突き合わせる形へ改めた(署名は宣言値を区別する)。
  //   宣言なしのコピーが丸められたことは `undeclared` 欄に**情報として**残す(合否には使わない)。
  const mk = (key) => {
    const p = JSON.parse(JSON.stringify(src));
    p.sampleClass = 'principle';          // 門を迂回するためではなく、**両方を同じ条件に置く**ため
    delete p.notClaim;
    p.physics.kFrame = 0.05;
    if (key) p.physics.kFrameApprox = key;
    return p;
  };
  const runOne = (p) => {
    const v = HP.validatePreset(p);
    if (!v.ok) return { ok: false, errors: v.errors };
    HP.sim.build(v.preset);
    const S = HP.sim;
    for (let i = 0; i < N; i++) S.step(0.016);
    const st = [];
    for (let i = 0; i < S.n; i++) st.push(S.x[i], S.y[i], S.vx[i], S.vy[i], S.spin[i]);
    return { ok: true, state: st, kFrame: S.params.kFrame,
      approxInParams: S.params.kFrameApprox === undefined ? null : S.params.kFrameApprox,
      sig: presetSig(p) };
  };
  const a = runOne(mk('space-mesh-effective')), b = runOne(mk('sample-only'));
  if (!a.ok || !b.ok) return { ok: false, a, b };
  const u = runOne(mk(null));   // 宣言なし(第275便a 以降は丸められる — 情報欄)

  let worst = 0;
  for (let i = 0; i < a.state.length; i++) worst = Math.max(worst, Math.abs(a.state[i] - b.state[i]));
  return { ok: true, steps: N, n: a.state.length / 5,
    stateBitIdentical: JSON.stringify(a.state) === JSON.stringify(b.state), maxAbsDiff: worst,
    kFrameBoth: [a.kFrame, b.kFrame],
    approxInParams: [a.approxInParams, b.approxInParams],
    presetSigDiffers: a.sig !== b.sig,
    declared: ['space-mesh-effective', 'sample-only'],
    undeclared: u.ok ? { kFrame: u.kFrame, snapped: u.kFrame !== 0.05 } : { ok: false, errors: u.errors },
    note: '2 つの宣言値で状態がビット同一で presetSig だけが変わる = **宣言専用キー**(署名は宣言値を区別する)。'
      + ' 宣言なしの分数は第275便a の既定契約で {0,1} へ丸められる(undeclared 欄・情報)' };
}, 200000);
console.log('declarationInert: stateBitIdentical=' + declarationInert.stateBitIdentical
  + ' presetSigDiffers=' + declarationInert.presetSigDiffers);

// ================================================================ 書き出し
const MK = charonMergeKey({
  target: TARGET, targetSha256, measureSha256, libSha256,
  obsSha256: OBS.calauditSha256,
  obsRow: { key: OBS.key, recordId: OBS.recordId, value: OBS.value, sigma: OBS.sigma },
  window: { periWindow: PERI_WINDOW, orbMax: ORB_MAX, judgedRevIndex: 1 },
  stageSteps: STAGES,
});
const CANON = isCanonicalRun({ pilot: PILOT, steps: STEPS, stageSteps: STEP_H });

const meta = withProvenance({
  wave: '第273便b', harness: 'tests/exp-w273b-charonk.mjs', harnessVersion: HARNESS_VERSION,
  measureLib: 'tests/lib-w273b-charonpage.mjs', measureVersion: CHARON_PAGE_VERSION, measureSha256,
  mergeKeyVersion: MERGEKEY_VERSION, mergeKey: MK.key, mergeKeyParts: MK.parts,
  canonicalRun: CANON.canonical, canonicalRunWhy: CANON.why,
  // **これが fit であることの刻印**(R21)
  fit: true,
  fitNote: '零点は**観測周期そのもの**(calaudit の採用行)に合わせて挟み込んだ 1 自由パラメータである。'
    + '**「解」でも「最良値」でも「kFrame の正しい値」でもない**。独立な観測量を予測したわけではない',
  fitTarget: { quantity: 'Charon|orbital_period', detector: 'revSec[1](同方向 2 周目)',
    value: OBS.value, sigma: OBS.sigma, unit: OBS.unit, recordId: OBS.recordId },
  freeParameters: ['physics.kFrame(探索した 1 個)'],
  derivedParameters: ['f = HP.dfmBinaryMassFactorLinear(…, kFrame)(k から自動で引く自己無撞着解)'],
  contract: { stepH: STEP_H, orbMax: ORB_MAX, periWindow: PERI_WINDOW, stages: STAGES,
    judgedRevIndex: 1, bracket: [K_LO, K_HI], sigmaStop: SIGMA_STOP, kTol: K_TOL, itersMax: ITERS,
    note: '窓・終了条件・保存量は第272便b の契約のまま。**判定はしない** —— 診断である' },
  // 裁定 AH20: softening を宣言量に(問題一覧の生成器が読む欄)
  softeningDeclaration: {
    form: 'Plummer', formula: 'Φ_ij = −G m_i m_j / sqrt(d_ij² + ε²)',
    engineNote: '核(S._core)は 1/sqrt(d²+eps2)(eps2=ε²)で重み・力・ψ を作る —— 本器は読むだけ',
    key: 'physics.softening', unit: '長さ単位(この系では 10^scaleExp.L m)',
    epsilonDefault: EPS0, epsilonSeries: EPS_SERIES,
    separationAtT0: A0, epsilonOverSeparation: EPS0 / A0,
    epsilonOverSeparationSeries: EPS_SERIES.map((e) => ({ epsilon: e, ratio: e / A0 })),
    perColumnKey: 'epsilonSeries[].softening',
    initialState: '内蔵 ❄️ plutoCharonReal の JSON を複製し、位置・初速は転写のまま(質量だけ f 倍)。'
      + 'validatePreset → HP.sim.build で組む',
    note: 'ε は**数値設定であって物理法則ではない**。ε 系列は k\* を固定した別列で、'
      + '刻み収束(h/h2/h4)とは**同時に動かしていない**' },
  observation: OBS, secondsPerUnit: SEC, separationAtT0: A0,
  fLinArgs: { D0: D00, softening: EPS0, frameWeightPow: 1 },
  notClaim: ['カロンの合否', '新発見', 'k≈ の解', 'kFrame の最良値', '潮汐ロックの証明',
    '引きずり式の確定', '観測と合った'],
}, { root: ROOT, wave: '第273便b', target: TARGET,
  code: ['tests/exp-w273b-charonk.mjs', 'tests/lib-w273b-charonpage.mjs',
    'tests/lib-w273b-mergekey.mjs', 'tests/lib-w272b-pairlock.mjs', 'tests/lib-w272e-provenance.mjs'],
  inputs: [TARGET, 'tests/out/calaudit-w249.json'] });

const out = { meta,
  c3Scan: { bracket: [K_LO, K_HI], bracketed, iterations: iters, rows: c3,
    linearZeroFrom2Points: linearZero,
    kStar, sigmaAtKStar: sStar, finalInterval: [lo, hi],
    note: '**これは fit である**(観測周期に合わせて挟み込んだ)。符号が変わる区間があることと、'
      + 'その中の 1 点を刻んだことだけが実測で、**「解」ではない**' },
  stage3: { rows: stageRows, order },
  c2Scan: { rows: c2, monotoneIncreasing: c2Monotone, signChange: c2SignChange,
    note: 'f=1 では同じ区間で符号が変わらない(零点は値域の外) —— 第272便b の言い方はこの列に限る' },
  epsilonSeries: epsRows,
  declarationInert,
  pageErrors };

if (CANON.canonical) {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
  console.log('wrote ' + OUT);
} else {
  fs.mkdirSync(path.dirname(PROBE_OUT), { recursive: true });
  fs.writeFileSync(PROBE_OUT, JSON.stringify(out, null, 1));
  console.log('短い走行なので正本へは書かない(' + CANON.why + ') → ' + PROBE_OUT);
}
await browser.close();

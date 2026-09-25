// 第271便d(第61報)「**銀河の器の診断 3 本**: 準定常窓 variant(AF5)・clampSN の切り分け(AF7)・
//   N/seed 系列(AF19)」。**主判定窓 T=40 は動かさない。clamp の上限(±40)も変えない。**
//
// ■ 何を測るか(統括の検証項目 R6・採る AF5/AF7/AF19)
//   **AF5 準定常窓 variant** —— 「構造と速度のドリフトが**事前基準**より小さい区間」を第270便e が
//     **走行前に宣言した基準のまま**評価する(基準を本便で緩めない・結果を見て窓を足さない)。
//     結果は `variant:'quasi-steady'` の別行で、**主集計(`tests/out/sparc-w269c.json` の `columns[].rows`)には
//     混ぜない**。満たす窓が無ければ **「窓なし」**とそのまま書く。
//   **AF7 clampSN の切り分け** —— 🛞(kFrame=1)の 393,839 件がどう出るのかを、**物理時刻別・粒子別**に
//     記録する。同じ窓・同じ seed で **dt と dt/2** を比べ、作動率と捨てた ΔJ の積分が
//     **有限値へ落ち着く(持続飽和)か・消える(数値起因)か**を実測で分類する。
//     **どちらも「物理的に正しい」とは書かない。**
//   **AF19 N・seed 系列** —— 事前固定 seed 4 本(第270便e の等差列)× **N ×1/×2/×4** を
//     **同じ物理時刻・同じ抽出量**で走らせ、**帯占有・標本 SD・平均の SE を別々の欄**に出す。
//     **空帯は欠測**(0 で平均しない)。**帯統合は別 variant として定義だけ**(実施しない)。
//
// ■ この器が**しないこと**
//   ・`beta/index.html` を**読むだけ**(🌃🛞 の JSON を 1 bit も書き換えない。走るのは
//     `sampleClass:"principle"` の診断コピーだけ)。`S._core` には 1 命令も足していない。
//   ・**主判定窓 T=40 を動かさない**(準定常窓は別 variant であって置き換えではない)。
//   ・**clamp の上限を変えない**(±40 は engine の規則。本器は**数えるだけ**である)。
//   ・**観測残差を見て窓・帯・seed を選ばない**(窓の候補も seed の列も**先に宣言したもの**を使う)。
//
// ■ この器が**言わないこと**
//   「準定常窓で合った」「観測と合った」「回転曲線を再現した」「較正した」
//   「clamp は物理的な飽和である/数値のゴミである」(**分類は実測の語で書く**)
//   「seed と N を増やして誤差が縮んだ」「比較できる点が増えた」。
//
// 実行:
//   PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright \
//   node tests/exp-w271d-galaxydiag.mjs [--only qs,clamp,nseries]
// 出力: tests/out/galaxydiag-w271d.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { compareRow, tallyStates, measurementStamp, fileStamp, loadObsCsv, noteField,
  finiteNumber, validateWindow, NO_PVALUE_NOTE } from './lib-w269c-compare.mjs';
// 第281便a(原仮定者の裁定(第71報)・AN16・統括の検証項目 R71): **この器が読む html の領域**の宣言。
//   `tests/lib-w281a-scope.mjs` がこの領域だけの hash(`scopeSha256`)を正本の meta に刻む。
//   `lint.provenanceMeta` ② は「targetSha256 一致 **または**(scopeComplete かつ scopeSha256 が今の html で
//   引き直した値と一致)」で通す。`lint.regenScope` が「宣言 ⊇ 器のコードから機械で引いた下限
//   (HP.*・html の最上位名・内蔵プリセット id)」を照合する。**1 行の JSON**(lint が読む)。
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
const REGEN_SCOPE = {"presets":["ngc3198","ngc3198DFM"],"roots":["$","HP.allPresets","HP.sim","HP.validatePreset","T","applyQLock","ch","clamp","ctx","isNum","sim","validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);   // 第281便a: 走行開始時の html の領域
const INDEX = 'file://' + (path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET));
const OUT = path.join(ROOT, 'tests', 'out', 'galaxydiag-w271d.json');
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const PARTS = String(arg('--only', 'qs,clamp,nseries')).split(',');
const want = (k) => PARTS.indexOf(k) >= 0;
const T_END = 40;            // **主判定窓と同じ終端**(窓そのものは動かさない)
const DT0 = 0.016;
const CHECKPOINTS = [0, 10, 20, T_END];
const WINDOW = validateWindow({ T: T_END, dt: DT0, checkpoints: CHECKPOINTS });

// ---- 単位(銀河族 L19/T15/M38 —— `tests/exp-w269c-sparc.mjs` と同じ換算)
const KPC_M = 3.0856775814913673e19;
const KPC_PER_UNIT = 1e19 / KPC_M;      // 1 単位 = 0.3240779… kpc
const KMS_PER_UNIT = 1e19 / 1e15 / 1e3; // 1 単位 = 10 km/s
const toKpc = (u) => u * KPC_PER_UNIT;
const toUnit = (kpc) => kpc / KPC_PER_UNIT;

// ---- 観測 CSV(帯の端は **第269便c と同じ規則**で作り、保存 JSON と機械照合する)
const CSV_REL = 'paper/data/cluster-galaxy-observations.csv';
const CSV = path.join(ROOT, CSV_REL);
const ROWS = loadObsCsv(CSV);
const RE_R = /^v_rot\(r=([0-9.]+) kpc\)(_candidate)?$/;
const all43 = ROWS.filter((r) => r.body === 'NGC 3198' && RE_R.test(r.quantity)
  && !/_candidate$/.test(r.quantity))
  .map((r) => ({ rKpc: Number(RE_R.exec(r.quantity)[1]), vMs: r.value }))
  .sort((a, b) => a.rKpc - b.rKpc);
const cand = ROWS.filter((r) => r.body === 'NGC 3198' && /^v_rot\(r=[0-9.]+ kpc\)_candidate$/.test(r.quantity))
  .map((r) => ({ rKpc: Number(RE_R.exec(r.quantity)[1]), vMs: r.value, sigmaMs: r.sigmaCol,
    source: String(r.source), sigmaPrimary: noteField(r.note, 'sigma_primary') || 'unverified' }))
  .sort((a, b) => a.rKpc - b.rKpc);
function binEdges(rKpc) {
  const i = all43.findIndex((z) => Math.abs(z.rKpc - rKpc) < 1e-9);
  if (i < 0) return null;
  const lo = (i === 0) ? rKpc - 0.16 : (all43[i - 1].rKpc + rKpc) / 2;
  const hi = (i === all43.length - 1)
    ? rKpc + (rKpc - all43[i - 1].rKpc) / 2 : (rKpc + all43[i + 1].rKpc) / 2;
  return { loKpc: lo, hiKpc: hi, indexIn43: i };
}
const TRACER_SPLIT_KPC = 7.06;
const POINTS = cand.map((c) => {
  const e = binEdges(c.rKpc);
  return { rKpc: c.rKpc, vObsKms: c.vMs / 1000, sigmaKms: c.sigmaMs === null ? null : c.sigmaMs / 1000,
    bin: e, binLoUnit: e ? toUnit(e.loKpc) : null, binHiUnit: e ? toUnit(e.hiKpc) : null,
    tracer: (c.rKpc <= TRACER_SPLIT_KPC) ? 'stars' : 'hi',
    source: c.source, sigmaPrimary: c.sigmaPrimary };
});
const BINS = POINTS.map((p) => ({ lo: p.binLoUnit, hi: p.binHiUnit }));

// **帯が第269便c の保存 JSON と同じであることを機械で確かめる**(2 つの器で帯がずれない)。
const binCheck = (() => {
  const fp = path.join(ROOT, 'tests', 'out', 'sparc-w269c.json');
  if (!fs.existsSync(fp)) return { checked: false, why: 'sparc-w269c.json が無い' };
  const J = JSON.parse(fs.readFileSync(fp, 'utf8'));
  const a = (J.points || []).map((p) => [p.rKpc, p.bin.loKpc, p.bin.hiKpc, p.vObsKms, p.sigmaKms, p.tracer]);
  const b = POINTS.map((p) => [p.rKpc, p.bin.loKpc, p.bin.hiKpc, p.vObsKms, p.sigmaKms, p.tracer]);
  const same = JSON.stringify(a) === JSON.stringify(b);
  if (!same) throw new Error('[w271d] 帯が sparc-w269c.json と一致しない(帯の定義が 2 つに割れている)');
  return { checked: true, points: b.length, identicalToSparcW269c: true };
})();

// ---------------------------------------------------------------- AF5: **事前基準の宣言**
//   第270便e が `windowVariants.quasiSteady`(`declared-not-evaluated`)で**走行前に宣言した基準**を
//   **そのまま**使う。**本便で数値を緩めない・候補窓を足さない。**
const QS_CRITERIA = {
  id: 'quasi-steady-v0',
  declaredIn: '第270便e(`tests/out/sparc-w269c.json` の `windowVariants.quasiSteady` — `declared-not-evaluated`)',
  structureDriftMax: 0.02,      // |d ln R_half,HI / dt| ≤ 0.02 /時間単位
  velocityDriftMaxKmsPerT: 0.25,  // |d⟨v_t⟩/dt| ≤ 0.25 km/s /時間単位
  minWindowLength: 10,
  candidates: [[10, 20], [20, 30], [30, 40]],
  healthRequired: 'NaN 0 かつ**全クランプ 0**(窓の全域・種類別に 0)',
  stage: 'h/4(dt=0.004)で測る(第270便e の宣言どおり)',
  sampleDt: 0.5,
  // **本便で足した宣言(走行前に固定した — 観測残差は見ていない)**
  evaluabilityRule: '速度ドリフトは「窓の**全サンプル**で占有 n≥1 の帯」についてだけ評価する'
    + '(**空帯は欠測**であって 0 ではない)。**評価可能な帯が 3 本未満の窓は「評価不能」**として'
    + '**窓なし側**に数える —— **帯が空になったことを準定常の証拠にしない**。',
  selectionRule: '基準を満たした候補は**すべて併記する**(**良い結果のものを選ばない**)。',
  notSaid: ['準定常窓で合った', '早期窓の方が良かった', '主判定窓を移した',
    '観測残差を見て窓を選んだ'] };

// ---------------------------------------------------------------- AF19: **事前固定 seed 集合**
const SEEDS = [0, 1, 2, 3].map((k) => 270105001 + 1000 * k);   // 第270便e の等差列(そのまま)
// **実測して決めた系列**(下の `capProbe` を参照): 素朴な ×1/×2/×4 は engine の**粒子総数上限
//   `N_CAP=600`** に当たり、×2 は 399/199 へ、×4 は 359/239 へ縮小されたうえ、
//   **×4 では粒あたり質量が 1/4 のままなので総質量が保存されない**(1147.398 → 612.786)。
//   **上限は変えない**ので、**実施できる系列を上限直下まで**に置き換える:
//   disk 粒子 300 / 450 / 597(= ×1 / ×1.5 / ×1.99)。**粒あたり質量は n から決め直して総質量を保存する。**
//   **×2・×4 は engine の上限で実施不能**として `capProbe` に実測を残す(上限を上げるかは決断事項)。
const N_MULTS = [1, 1.5, 1.99];
const N_CAP_PROBE = [2, 4];

// ---------------------------------------------------------------- ページ
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

await pg.evaluate(() => {
  window.W271 = {};
  // **診断コピー**(本体は 1 bit も触らない)。`sampleClass:"principle"`・台帳と claims を外す。
  //   N 倍は **disk の n を k 倍し、粒あたり質量を 1/k にする**(= 総質量を保存する規約)。
  //   **中心核(single)は宣言質量なので N で割らない**(標本ではない — 宣言)。
  W271.copy = (id, patch) => {
    const src = HP.allPresets().find((q) => q.id === id);
    if (!src) return null;
    const p = JSON.parse(JSON.stringify(src));
    if (!patch) return p;
    p.id = patch.id || (id + 'W271dDiag');
    p.sampleClass = 'principle';
    delete p.massCalibration; delete p.claims; delete p.calibrationForecast;
    if (patch.dropHalo) delete p.physics.halo;
    if (patch.physics) Object.assign(p.physics, patch.physics);
    if (patch.seed !== undefined) p.seed = patch.seed;
    if (patch.nMult && patch.nMult !== 1) {
      const k = patch.nMult;
      for (const b of p.bodies) {
        if (b.type !== 'disk') continue;
        const n0 = b.n, nNew = Math.round(b.n * k);
        b.n = nNew;
        // **総質量を保存する**: 粒あたり質量は **丸めた後の n** から決め直す(1/k ではない)。
        if (typeof b.mMin === 'number') b.mMin = b.mMin * n0 / nNew;
        if (typeof b.mMax === 'number') b.mMax = b.mMax * n0 / nNew;
      }
    }
    return p;
  };
  // **受理だけ**(1 步も回さない)—— 粒子総数上限に当たるかを実測するための探り。
  W271.probe = (id, patch) => {
    const p = W271.copy(id, patch); if (!p) return { err: 'no preset ' + id };
    const requested = p.bodies.map((b) => (b.type === 'disk' ? b.n : 1));
    const v = HP.validatePreset(p);
    if (!v.ok) return { err: (v.errors || []).join('|'), requested };
    const S = HP.sim; S.build(v.preset);
    let mTot = 0; for (let i = 0; i < S.n; i++) mTot += S.m[i];
    return { ok: true, requested, accepted: v.preset.bodies.map((b) => (b.type === 'disk' ? b.n : 1)),
      n: S.n, massTotal: mTot,
      warnings: (v.warnings || []).filter((w) => String(w).indexOf('粒子総数') >= 0) };
  };
  W271.segOf = (p) => {
    let i = 0; const seg = { stars: null, hi: null, center: 'origin' };
    for (const b of p.bodies) {
      const from = i, to = i + (b.type === 'disk' ? b.n : 1);
      if (b.type === 'disk' && seg.stars === null) seg.stars = { from, to };
      else if (b.type === 'disk' && seg.hi === null) seg.hi = { from, to };
      else if (b.type === 'single') seg.center = from;
      i = to;
    }
    return seg;
  };
  W271.centerOf = (S, seg) => {
    if (typeof seg.center === 'number' && seg.center < S.n)
      return { cx: S.x[seg.center], cy: S.y[seg.center],
        cvx: S.vx[seg.center], cvy: S.vy[seg.center], kind: 'body#' + seg.center };
    return { cx: 0, cy: 0, cvx: 0, cvy: 0, kind: 'origin' };
  };
  // 帯統計(第269便c の `W269.stats` と同じ定義 —— r=0 は除外・v_t=(dx·dv_y−dy·dv_x)/r)
  W271.bandStats = (S, seg, bins) => {
    const c = W271.centerOf(S, seg);
    const mk = () => bins.map(() => ({ n: 0, sv: 0 }));
    const acc = { stars: mk(), hi: mk() };
    let zeroRadius = 0;
    for (const key of ['stars', 'hi']) {
      const sg = seg[key]; if (!sg) continue;
      for (let i = sg.from; i < sg.to && i < S.n; i++) {
        const dx = S.x[i] - c.cx, dy = S.y[i] - c.cy, r = Math.hypot(dx, dy);
        if (!(r > 0)) { zeroRadius++; continue; }
        const vx = S.vx[i] - c.cvx, vy = S.vy[i] - c.cvy;
        const vt = (dx * vy - dy * vx) / r;
        for (let b = 0; b < bins.length; b++)
          if (r >= bins[b].lo && r < bins[b].hi) { acc[key][b].n++; acc[key][b].sv += vt; }
      }
    }
    const fin = (a) => a.map((z) => ({ n: z.n, vtMean: z.n ? z.sv / z.n : null }));
    return { stars: fin(acc.stars), hi: fin(acc.hi), zeroRadius, center: c };
  };
  // **面内半質量半径**(質量重み・中心を引く・順序統計)。**光度重みではない。**
  W271.halfMassRadius = (S, seg, key) => {
    const sg = seg[key]; if (!sg) return null;
    const c = W271.centerOf(S, seg);
    const zs = [];
    let mTot = 0;
    for (let i = sg.from; i < sg.to && i < S.n; i++) {
      const r = Math.hypot(S.x[i] - c.cx, S.y[i] - c.cy);
      if (!Number.isFinite(r)) return null;
      zs.push({ r, m: S.m[i] }); mTot += S.m[i];
    }
    if (!zs.length || !(mTot > 0)) return null;
    zs.sort((a, b) => a.r - b.r);
    let acc = 0;
    for (const z of zs) { acc += z.m; if (acc >= mTot / 2) return z.r; }
    return zs[zs.length - 1].r;
  };
  W271.CLAMP_KINDS = ['clampVN', 'clampSN', 'clampHN', 'clampAN', 'clampRN', 'clampTN', 'angOvfN'];
  W271.clampSnap = (S) => { const o = {}; let total = 0;
    for (const k of W271.CLAMP_KINDS) { const z = S[k] || 0; o[k] = z; total += z; }
    return { byKind: o, total }; };
  W271.ledger = (S) => { const t = S.totals();
    return { L: t.L, resL: S.resL || 0, radL: S.radL || 0, total: t.L + (S.resL || 0) + (S.radL || 0) }; };

  // ---- AF5: 準定常窓のための**時系列**(構造ドリフト・速度ドリフト・健全性)
  W271.qsRun = (id, patch, dt, tEnd, sampleDt, bins) => {
    const p = W271.copy(id, patch); if (!p) return { err: 'no preset ' + id };
    const v = HP.validatePreset(p); if (!v.ok) return { err: (v.errors || []).join('|') };
    const S = HP.sim; S.build(v.preset);
    const seg = W271.segOf(v.preset);
    const nPer = Math.round(sampleDt / dt);
    const nSample = Math.round(tEnd / sampleDt);
    const series = [];
    const shot = () => {
      const bs = W271.bandStats(S, seg, bins);
      const ck = W271.clampSnap(S);
      return { t: S.t, rHalfHi: W271.halfMassRadius(S, seg, 'hi'),
        rHalfStars: W271.halfMassRadius(S, seg, 'stars'),
        vtHi: bs.hi.map((z) => z.vtMean), nHi: bs.hi.map((z) => z.n),
        vtStars: bs.stars.map((z) => z.vtMean), nStars: bs.stars.map((z) => z.n),
        clamp: ck.total, clampByKind: ck.byKind, nan: S.hasNaN() };
    };
    series.push(shot());
    let nan = false;
    for (let s = 0; s < nSample; s++) {
      for (let k = 0; k < nPer; k++) { S.step(dt); if (S.hasNaN()) { nan = true; break; } }
      series.push(shot());
      if (nan) break;
    }
    return { ok: true, n: S.n, dt, sampleDt, seg, nan, tActual: S.t, series,
      kFrame: v.preset.physics.kFrame, seed: v.preset.seed };
  };

  // ---- AF7: clampSN の切り分け(**物理時刻別・粒子別**)。**上限は変えない — 数えるだけ。**
  W271.clampRun = (id, patch, dt, tEnd, blockT) => {
    const p = W271.copy(id, patch); if (!p) return { err: 'no preset ' + id };
    const v = HP.validatePreset(p); if (!v.ok) return { err: (v.errors || []).join('|') };
    const S = HP.sim; S.build(v.preset);
    const seg = W271.segOf(v.preset);
    const CAP = 40, tol = 1e-9;
    const n0 = S.n;
    const comp = new Array(n0);
    for (let i = 0; i < n0; i++)
      comp[i] = (seg.stars && i >= seg.stars.from && i < seg.stars.to) ? 'stars'
        : ((seg.hi && i >= seg.hi.from && i < seg.hi.to) ? 'hi' : 'other');
    const inertia = new Array(n0);
    for (let i = 0; i < n0; i++) inertia[i] = 0.5 * S.m[i] * S.R[i] * S.R[i];
    const firstSatT = new Array(n0).fill(null);
    const satSteps = new Array(n0).fill(0);
    // **制限前の超過量(1 步外挿の推定)**: 初めて上限へ達した步で、
    //   直前 2 步(どちらも未クランプ)の |spin| から駆動率 |ds/dt| を作り、
    //   超過量 ≈ 率×dt −(上限までの残り)を出す。**クランプ後の値は必ず ±40 ちょうど**なので
    //   超過量そのものは器から読めない —— これは**推定であって実測ではない**(欄名に est を付ける)。
    const excessEst = new Array(n0).fill(null);
    const prev1 = new Float64Array(n0), prev2 = new Float64Array(n0);
    let havePrev = 0;
    const nSteps = Math.round(tEnd / dt);
    const perBlock = Math.max(1, Math.round(blockT / dt));
    const blocks = [];
    let prevSN = S.clampSN || 0;
    const led0 = W271.ledger(S);
    let prevLed = led0.total;
    let firstEventT = null, firstEventStep = null;
    let cum = { events: 0, ledgerDrop: 0, ledgerAbs: 0 };
    let blk = null;
    const newBlock = (tStart) => ({ tStart, tEnd: null, steps: 0, events: 0,
      ledgerDrop: 0, ledgerAbs: 0, satStepSum: 0, satMax: 0, stepsWithEvent: 0, nan: false });
    blk = newBlock(S.t);
    let nan = false;
    for (let k = 0; k < nSteps; k++) {
      S.step(dt);
      if (S.hasNaN()) { nan = true; blk.nan = true; break; }
      const sn = S.clampSN || 0;
      const dSN = sn - prevSN; prevSN = sn;
      const led = W271.ledger(S).total;
      const dLed = led - prevLed; prevLed = led;
      let sat = 0;
      for (let i = 0; i < S.n && i < n0; i++) {
        const a = Math.abs(S.spin[i]);
        if (a >= CAP * (1 - tol)) { sat++; satSteps[i]++;
          if (firstSatT[i] === null) { firstSatT[i] = S.t;
            if (havePrev >= 2) {
              const rate = (prev1[i] - prev2[i]) / dt;      // 未クランプ 2 步から作った駆動率
              const gap = CAP - prev1[i];
              const e = rate * dt - gap;
              excessEst[i] = (Number.isFinite(e) && e > 0) ? e : null;
            }
          } }
        prev2[i] = prev1[i]; prev1[i] = a;
      }
      havePrev = Math.min(2, havePrev + 1);
      if (dSN > 0 && firstEventT === null) { firstEventT = S.t; firstEventStep = k + 1; }
      cum.events += dSN; cum.ledgerDrop += -dLed; cum.ledgerAbs += Math.abs(dLed);
      blk.steps++; blk.events += dSN; blk.ledgerDrop += -dLed; blk.ledgerAbs += Math.abs(dLed);
      blk.satStepSum += sat; if (sat > blk.satMax) blk.satMax = sat;
      if (dSN > 0) blk.stepsWithEvent++;
      if (blk.steps >= perBlock) { blk.tEnd = S.t; blocks.push(blk); blk = newBlock(S.t); }
    }
    if (blk.steps > 0) { blk.tEnd = S.t; blocks.push(blk); }
    // **粒子別**(この器が出せるのは「飽和に居た步数」と「初回時刻」までである)
    const byComp = { stars: { nAny: 0, satStepSum: 0, firstMin: null },
      hi: { nAny: 0, satStepSum: 0, firstMin: null }, other: { nAny: 0, satStepSum: 0, firstMin: null } };
    const perParticle = [];
    for (let i = 0; i < n0; i++) {
      const c = byComp[comp[i]];
      if (satSteps[i] > 0) { c.nAny++;
        if (c.firstMin === null || firstSatT[i] < c.firstMin) c.firstMin = firstSatT[i]; }
      c.satStepSum += satSteps[i];
      if (satSteps[i] > 0) perParticle.push({ i, component: comp[i], firstSatT: firstSatT[i],
        satSteps: satSteps[i], inertia: inertia[i], spinEnd: S.spin[i],
        firstExcessEst: excessEst[i],
        firstExcessDJEst: (excessEst[i] === null) ? null : excessEst[i] * inertia[i] });
    }
    perParticle.sort((a, b) => b.satSteps - a.satSteps);
    const ck = W271.clampSnap(S);
    let inertiaSat = 0, nSat = 0;
    for (const z of perParticle) { inertiaSat += z.inertia; nSat++; }
    // 初回超過量(推定)の要約 —— **中央値・平均・最大**(**実測ではなく 1 步外挿の推定**)
    const exs = perParticle.map((z) => z.firstExcessEst).filter((z) => Number.isFinite(z)).sort((a, b) => a - b);
    const djs = perParticle.map((z) => z.firstExcessDJEst).filter((z) => Number.isFinite(z));
    const firstExcess = { count: exs.length,
      medianSpinUnits: exs.length ? exs[Math.floor(exs.length / 2)] : null,
      meanSpinUnits: exs.length ? exs.reduce((a, b) => a + b, 0) / exs.length : null,
      maxSpinUnits: exs.length ? exs[exs.length - 1] : null,
      sumDJ: djs.length ? djs.reduce((a, b) => a + b, 0) : null };
    return { ok: true, n: n0, dt, steps: nSteps, nan, tActual: S.t,
      kFrame: v.preset.physics.kFrame, seed: v.preset.seed,
      clampByKind: ck.byKind, clampTotal: ck.total,
      firstEventT, firstEventStep, cumulative: cum,
      ledger: { start: led0, end: W271.ledger(S) },
      blocks, byComponent: byComp,
      particlesTouched: perParticle.length,
      satStepSum: perParticle.reduce((a, z) => a + z.satSteps, 0),
      meanInertiaOfTouched: nSat ? inertiaSat / nSat : null,
      firstExcessEstimate: firstExcess,
      perParticleTop: perParticle.slice(0, 20),
      capDeclared: CAP };
  };

  // ---- AF19: N・seed 系列(同じ物理時刻・同じ抽出量)
  W271.nRun = (id, patch, dt, tEnd, bins) => {
    const p = W271.copy(id, patch); if (!p) return { err: 'no preset ' + id };
    const v = HP.validatePreset(p); if (!v.ok) return { err: (v.errors || []).join('|') };
    const S = HP.sim; S.build(v.preset);
    const seg = W271.segOf(v.preset);
    let mTot = 0; for (let i = 0; i < S.n; i++) mTot += S.m[i];
    const nSteps = Math.round(tEnd / dt);
    let nan = false;
    for (let k = 0; k < nSteps; k++) { S.step(dt); if (S.hasNaN()) { nan = true; break; } }
    const bs = W271.bandStats(S, seg, bins);
    const ck = W271.clampSnap(S);
    return { ok: true, n: S.n, nBodies: v.preset.bodies.map((b) => (b.type === 'disk' ? b.n : 1)),
      massTotal: mTot, dt, tActual: S.t, nan, seed: v.preset.seed,
      kFrame: v.preset.physics.kFrame,
      stars: bs.stars, hi: bs.hi, clamp: ck.total, clampByKind: ck.byKind };
  };
});

const out = {
  meta: measurementStamp({
    codeVersion: 'tests/exp-w271d-galaxydiag.mjs 第271便d',
    declarationVersion: 'compare-v1 / 第61報「提示された指摘を参考に改善/決断事項は概ね同意」',
    // 第272便e(AG11): 来歴を共通の形で。
    root: ROOT, wave: '第271便d(来歴は第272便e で共通化)', target: TARGET,
    code: ['tests/exp-w271d-galaxydiag.mjs', 'tests/lib-w269c-compare.mjs',
      'tests/lib-w270b-obscsv.mjs', 'tests/lib-w272e-provenance.mjs'],
    inputs: [fileStamp(path.join(ROOT, TARGET), TARGET), fileStamp(CSV, CSV_REL),
      fileStamp(path.join(ROOT, 'tests', 'lib-w269c-compare.mjs'), 'tests/lib-w269c-compare.mjs')] }),
  declaration: {
    what: '**銀河の器の診断 3 本**(AF5 準定常窓 variant・AF7 clampSN の切り分け・AF19 N/seed 系列)。'
      + '**主判定窓 T=40 は動かさない**(準定常窓は別 variant)。**clamp の上限 ±40 は変えない**'
      + '(本器は**数えるだけ**である)。**観測残差を見て窓・帯・seed を選ばない。**',
    primaryWindow: { T: T_END, dt: DT0, checkpoints: CHECKPOINTS, validated: WINDOW,
      note: '**主判定は `tests/out/sparc-w269c.json` の `columns[].rows` が正本**であり、'
        + '本 JSON の variant 行は**そこに混ぜない**。' },
    units: { kpcPerUnit: KPC_PER_UNIT, kmsPerUnit: KMS_PER_UNIT },
    bins: binCheck,
    notSaid: ['準定常窓で合った', '観測と合った', '回転曲線を再現した', '較正した',
      'clamp は物理的な飽和である', 'clamp は数値のゴミである',
      'seed と N を増やして誤差が縮んだ', '比較できる点が増えた', '再検証済み'] },
  points: POINTS,
  quasiSteady: null, clampSeparation: null, nSeedSeries: null,
  pageErrors: [] };

const tA = Date.now();
const write = () => { fs.mkdirSync(path.dirname(OUT), { recursive: true });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));   // 第281便a: 領域 hash の 3 欄 + JSON 入力の安定 hash
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1)); };
write();

const COLS = [
  { tag: '🌃 ngc3198(NFW 対照・内蔵のまま)', id: 'ngc3198', patch: null },
  { tag: '🌃 ハローなし対照(診断コピー)', id: 'ngc3198', patch: { id: 'ngc3198NoHaloW271d', dropHalo: true } },
  { tag: '🛞 ngc3198DFM(内蔵のまま)', id: 'ngc3198DFM', patch: null },
  { tag: '🛞 kFrame=0 対照(診断コピー)', id: 'ngc3198DFM',
    patch: { id: 'ngc3198DFMkF0W271d', physics: { kFrame: 0 } } } ];

// ================================================================ AF5: 準定常窓 variant
if (want('qs')) {
  const QS_DT = 0.004;   // h/4(第270便e の宣言)
  const qs = { criteria: QS_CRITERIA, stageDt: QS_DT, columns: [], rows: [], verdict: null };
  out.quasiSteady = qs;
  for (const c of COLS) {
    const r = await pg.evaluate(({ id, patch, dt, tEnd, sampleDt, bins }) =>
      W271.qsRun(id, patch, dt, tEnd, sampleDt, bins),
    { id: c.id, patch: c.patch, dt: QS_DT, tEnd: T_END, sampleDt: QS_CRITERIA.sampleDt, bins: BINS });
    if (r.err) { qs.columns.push({ tag: c.tag, id: c.id, error: r.err }); continue; }
    const S = r.series;
    const tArr = S.map((z) => z.t);
    const rHalf = S.map((z) => (z.rHalfHi === null ? null : toKpc(z.rHalfHi)));
    // **構造ドリフト**: |d ln R_half,HI/dt| を隣接サンプルの中心差分で(窓の全域で評価する)
    const dlnR = S.map((z, i) => {
      if (i === 0 || i === S.length - 1) return null;
      const a = S[i - 1].rHalfHi, b = S[i + 1].rHalfHi;
      if (!(a > 0) || !(b > 0)) return null;
      return (Math.log(b) - Math.log(a)) / (tArr[i + 1] - tArr[i - 1]);
    });
    // **速度ドリフト**: 帯ごとの |d⟨v_t⟩/dt| [km/s /時間単位]。**空帯は null(欠測)**。
    const dv = POINTS.map((p, bi) => S.map((z, i) => {
      if (i === 0 || i === S.length - 1) return null;
      const key = (p.tracer === 'hi') ? 'vtHi' : 'vtStars';
      const nKey = (p.tracer === 'hi') ? 'nHi' : 'nStars';
      const a = S[i - 1][key][bi], b = S[i + 1][key][bi];
      if (a === null || b === null) return null;
      if (!(S[i - 1][nKey][bi] > 0) || !(S[i + 1][nKey][bi] > 0) || !(z[nKey][bi] > 0)) return null;
      return (b - a) * KMS_PER_UNIT / (tArr[i + 1] - tArr[i - 1]);
    }));
    const col = { tag: c.tag, id: c.id, patch: c.patch, n: r.n, kFrame: r.kFrame, seed: r.seed,
      nan: r.nan, tActual: r.tActual, sampleDt: r.sampleDt, stageDt: QS_DT,
      series: { t: tArr, rHalfHiKpc: rHalf,
        rHalfStarsKpc: S.map((z) => (z.rHalfStars === null ? null : toKpc(z.rHalfStars))),
        clampTotal: S.map((z) => z.clamp),
        clampSN: S.map((z) => z.clampByKind.clampSN),
        nanAny: S.some((z) => z.nan === true),
        occupancyByPoint: POINTS.map((p, bi) =>
          S.map((z) => z[(p.tracer === 'hi') ? 'nHi' : 'nStars'][bi])) },
      structureDrift: dlnR, candidates: [] };
    for (const [a, b] of QS_CRITERIA.candidates) {
      const idx = [];
      for (let i = 0; i < tArr.length; i++) if (tArr[i] >= a - 1e-9 && tArr[i] <= b + 1e-9) idx.push(i);
      const inner = idx.filter((i) => dlnR[i] !== null);
      const structMax = inner.length ? Math.max(...inner.map((i) => Math.abs(dlnR[i]))) : null;
      // 健全性: 窓の**中で増えたクランプ**(累計の差)と NaN
      const i0 = idx[0], i1 = idx[idx.length - 1];
      const clampInWindow = (i0 !== undefined && i1 !== undefined)
        ? S[i1].clamp - S[i0].clamp : null;
      const nanInWindow = idx.some((i) => S[i].nan === true);
      // 速度ドリフト: 窓の全サンプルで占有 n≥1 の帯だけ評価する
      const bandRes = POINTS.map((p, bi) => {
        const occ = idx.map((i) => S[i][(p.tracer === 'hi') ? 'nHi' : 'nStars'][bi]);
        const evaluable = occ.every((z) => z > 0);
        const vals = inner.map((i) => dv[bi][i]).filter((z) => z !== null);
        return { rKpc: p.rKpc, tracer: p.tracer, evaluable, minOccupancy: Math.min(...occ),
          maxAbsDriftKmsPerT: vals.length ? Math.max(...vals.map((z) => Math.abs(z))) : null };
      });
      const ev = bandRes.filter((z) => z.evaluable && z.maxAbsDriftKmsPerT !== null);
      const velMax = ev.length ? Math.max(...ev.map((z) => z.maxAbsDriftKmsPerT)) : null;
      const cond = {
        lengthOk: (b - a) >= QS_CRITERIA.minWindowLength,
        structureOk: structMax !== null && structMax <= QS_CRITERIA.structureDriftMax,
        velocityOk: ev.length >= 3 && velMax !== null && velMax <= QS_CRITERIA.velocityDriftMaxKmsPerT,
        healthOk: clampInWindow === 0 && nanInWindow === false,
        evaluableBands: ev.length };
      const failed = Object.keys(cond).filter((k) => k !== 'evaluableBands' && cond[k] !== true);
      col.candidates.push({ window: [a, b], samples: idx.length,
        structureDriftMax: structMax, velocityDriftMaxKmsPerT: velMax,
        clampIncreaseInWindow: clampInWindow, nanInWindow,
        bands: bandRes, conditions: cond, failedConditions: failed,
        passed: failed.length === 0 });
    }
    qs.columns.push(col);
    console.error(`  AF5 ${c.tag}: 窓 ${col.candidates.map((z) =>
      `[${z.window[0]},${z.window[1]}]=${z.passed ? 'pass' : z.failedConditions.join('+')}`).join(' ')}`
      + `  [${((Date.now() - tA) / 1000).toFixed(0)} s]`);
    write();
  }
  // ---- variant 行(**主集計に混ぜない**)。**窓が無ければ 1 行も作らない。**
  const passed = [];
  for (const col of qs.columns) for (const cd of (col.candidates || [])) if (cd.passed)
    passed.push({ col, cd });
  for (const { col, cd } of passed) {
    for (let bi = 0; bi < POINTS.length; bi++) {
      const p = POINTS[bi];
      const band = cd.bands[bi];
      if (!band.evaluable) continue;
      out.quasiSteady.rows.push(Object.assign(compareRow({
        quantity: `v_rot(r=${p.rKpc} kpc)[${p.tracer}] @quasi-steady[${cd.window[0]},${cd.window[1]}]`,
        sim: { value: null, unit: 'km/s',
          window: `準定常窓 [${cd.window[0]}, ${cd.window[1]}](**別 variant** —— 主判定窓 T=${T_END} は動かしていない)`,
          extractor: `帯 [${p.bin.loKpc.toFixed(3)}, ${p.bin.hiKpc.toFixed(3)}] kpc の v_t 平均(h/4 段)`,
          stages: {}, order: null },
        obs: { value: p.vObsKms, unit: 'km/s', lower: null, upper: null, confidence: null,
          sigma: p.sigmaKms, source: p.source, verifiedMark: p.sigmaPrimary,
          role: '**準定常窓は別 variant** —— 主判定の置き換えではない' },
        state: 'numerically-unresolved',
        reason: '**準定常窓は主判定窓の置き換えではない**ので、この行は variant の記録である。'
          + '値の確定には主判定と同じ 3 刻みが要るが、**本器は h/4 の 1 段しか回していない**'
          + '(刻み依存は未測定)—— したがって `numerically-unresolved`。',
        diagnostics: { variant: 'quasi-steady', window: cd.window,
          maxAbsVelocityDriftKmsPerT: band.maxAbsDriftKmsPerT, minOccupancy: band.minOccupancy,
          note: '**主集計には混ぜない**(`tests/out/sparc-w269c.json` の `columns[].rows` が正本)。'
            + NO_PVALUE_NOTE } }), { variant: 'quasi-steady' }));
    }
  }
  qs.verdict = passed.length === 0
    ? { windowFound: false,
      statement: '**窓なし。** 事前に宣言した 3 候補 [10,20]/[20,30]/[30,40] は**どれも基準を満たさなかった**。'
        + '**基準は緩めない・候補は足さない**(観測残差を見て窓を選ばないため)。',
      perColumn: qs.columns.map((c) => ({ tag: c.tag,
        failed: (c.candidates || []).map((z) => ({ window: z.window, failed: z.failedConditions })) })) }
    : { windowFound: true, windows: passed.map(({ col, cd }) => ({ tag: col.tag, window: cd.window })),
      statement: '**基準を満たした候補をすべて併記する**(良い結果のものを選ばない)。'
        + '**主判定窓 T=40 は動かしていない。**' };
  qs.rowTally = tallyStates(qs.rows);
  write();
}

// ================================================================ AF7: clampSN の切り分け
if (want('clamp')) {
  const CL = { declaration: {
    what: '🛞(kFrame=1)の `clampSN`(自転の上限 ±40)を**物理時刻別・粒子別**に記録し、'
      + '**dt と dt/2** で作動率と捨てた ΔJ の積分を比べる。',
    capUnchanged: '**上限 ±40 は engine の規則で、本器は 1 bit も変えていない**(数えるだけ)。',
    duty: '**作動率** = その区間の `ΔclampSN` ÷(步数 × 粒子数)。'
      + '**1 步に 1 粒子が 2 回数えられる経路がある**かどうかは、'
      + '`ΔclampSN` と**飽和粒子の点呼**の比で実測して書く(推定しない)。',
    discardedJ: '**帳簿の動き** = 角運動量帳簿 `totals().L + resL + radL` の変化。'
      + 'クランプは `spin` を ±40 へ書き戻すだけで帳簿へ記帳しないので、**捨て分はここに現れる**。'
      + '**符号は一定でない**(+40 を越えた粒子を戻せば L は減り、−40 を下回った粒子を戻せば L は増える)ので、'
      + '**正味(signed)と 1 步ごとの絶対値の積分(abs)の両方**を出す。'
      + '**この量は積分誤差も含む** —— 床を測るために **kFrame=0 対照(`clampSN`=0)**の'
      + '同じ窓の帳簿漂流を並べる(**差し引いて「クランプ分」と断定はしない**)。',
    discardedWork: '**捨てた回転仕事の下限** = 40 × |ΔJ|(上限に張り付いた粒子の |ω| は 40 なので、'
      + '**|dE| = |ω dJ| ≥ 40 |dJ|**)。**上限は超過量が分からないと出ない**ので**下限だけ**を書く。',
    excessBeforeClamp: '**制限前の超過量そのものは器から読めない**(クランプ後の値は必ず ±40 ちょうど)。'
      + '本器が出すのは**初回飽和の 1 步外挿による推定**だけである: 直前 2 步(どちらも未クランプ)の '
      + '|spin| から駆動率 |ds/dt| を作り、**超過量 ≈ 率×dt −(上限までの残り)**。'
      + '**欄名に `Est` を付け、実測値と混ぜない。**',
    limitation: '**帳簿カウンタは `S._core` の中で増える**(そこには 1 命令も足さない規約)ので、'
      + '器が直接出せるのは**「上限に居た步数」と「初回時刻」**である。'
      + '**ただし本便の実測では `Σ_i (上限に居た步数) = clampSN` が 3 刻みとも厳密に一致した** —— '
      + 'この構成では**点呼が発動回数の粒子別内訳そのものになっている**(恒等式の証明ではなく実測の一致である)。',
    classification: '**持続飽和**(dt を半分にしても作動率と ΔJ 積分が同じ有限値へ寄る)か '
      + '**数値起因**(dt を半分にすると消える/半分になる)かを**実測で分類する**。'
      + '**どちらも「物理的に正しい」とは書かない。**' },
  runs: [], dtDependence: null, verdict: null };
  out.clampSeparation = CL;
  const CL_COLS = [
    { tag: '🛞 ngc3198DFM(kFrame=1・内蔵のまま)', id: 'ngc3198DFM', patch: null },
    { tag: '🛞 kFrame=0 対照(同一 seed・診断コピー)', id: 'ngc3198DFM',
      patch: { id: 'ngc3198DFMkF0W271dClamp', physics: { kFrame: 0 } } } ];
  const CL_DTS = [DT0, DT0 / 2, DT0 / 4];
  for (const c of CL_COLS) for (const dt of CL_DTS) {
    const r = await pg.evaluate(({ id, patch, dt, tEnd, blockT }) =>
      W271.clampRun(id, patch, dt, tEnd, blockT),
    { id: c.id, patch: c.patch, dt, tEnd: T_END, blockT: 2 });
    if (r.err) { CL.runs.push({ tag: c.tag, dt, error: r.err }); continue; }
    const stepsDone = r.blocks.reduce((a, z) => a + z.steps, 0);
    const satStepSum = r.blocks.reduce((a, z) => a + z.satStepSum, 0);
    const row = { tag: c.tag, id: c.id, patch: c.patch, dt, kFrame: r.kFrame, seed: r.seed,
      n: r.n, steps: r.steps, stepsDone, nan: r.nan, tActual: r.tActual,
      clampByKind: r.clampByKind, clampTotal: r.clampTotal,
      clampSN: r.clampByKind.clampSN,
      firstEventT: r.firstEventT, firstEventStep: r.firstEventStep,
      dutyPerStepPerParticle: (stepsDone > 0 && r.n > 0) ? r.clampByKind.clampSN / (stepsDone * r.n) : null,
      saturatedParticleSteps: satStepSum,
      saturatedFractionMean: (stepsDone > 0 && r.n > 0) ? satStepSum / (stepsDone * r.n) : null,
      eventsPerSaturatedParticleStep: satStepSum > 0 ? r.clampByKind.clampSN / satStepSum : null,
      perParticleAttributionExact: satStepSum === r.clampByKind.clampSN,
      particlesTouched: r.particlesTouched,
      meanInertiaOfTouched: r.meanInertiaOfTouched,
      byComponent: r.byComponent,
      firstExcessEstimate: r.firstExcessEstimate,
      perParticleTop: r.perParticleTop,
      ledger: r.ledger,
      ledgerNetDrop: r.cumulative.ledgerDrop,
      ledgerAbsIntegral: r.cumulative.ledgerAbs,
      ledgerAbsPerEvent: r.clampByKind.clampSN > 0 ? r.cumulative.ledgerAbs / r.clampByKind.clampSN : null,
      discardedWorkLowerBound: 40 * r.cumulative.ledgerAbs,
      blocks: r.blocks.map((z) => ({ tStart: +z.tStart.toFixed(6), tEnd: +z.tEnd.toFixed(6),
        steps: z.steps, events: z.events, stepsWithEvent: z.stepsWithEvent,
        dutyPerStepPerParticle: (z.steps > 0 && r.n > 0) ? z.events / (z.steps * r.n) : null,
        ledgerDrop: z.ledgerDrop, ledgerAbs: z.ledgerAbs,
        satMean: z.steps ? z.satStepSum / z.steps : null, satMax: z.satMax })) };
    CL.runs.push(row);
    console.error(`  AF7 ${c.tag} dt=${dt}: clampSN=${row.clampSN} 初回 t=${row.firstEventT}`
      + ` duty=${row.dutyPerStepPerParticle === null ? '—' : row.dutyPerStepPerParticle.toExponential(3)}`
      + ` |ΔJ|積分=${row.ledgerAbsIntegral.toExponential(3)}  [${((Date.now() - tA) / 1000).toFixed(0)} s]`);
    write();
  }
  // dt 依存の表(同じ窓・同じ seed・同じ抽出量 —— 3 刻み)
  const pick = (kF, dt) => CL.runs.find((z) => z.kFrame === kF && z.dt === dt);
  const series = (kF, f) => CL_DTS.map((dt) => { const z = pick(kF, dt); return z ? f(z) : null; });
  const ratios = (arr) => arr.map((z, i) => (i === 0 || !Number.isFinite(arr[i - 1]) || arr[i - 1] === 0
    || !Number.isFinite(z)) ? null : z / arr[i - 1]);
  const mk = (kF) => {
    if (!pick(kF, CL_DTS[0])) return null;
    const q = (f) => { const a = series(kF, f); return { byStage: a, ratioToPrevStage: ratios(a) }; };
    return { kFrame: kF, dtStages: CL_DTS,
      clampSN: q((z) => z.clampSN),
      dutyPerStepPerParticle: q((z) => z.dutyPerStepPerParticle),
      saturatedFractionMean: q((z) => z.saturatedFractionMean),
      firstEventT: { byStage: series(kF, (z) => z.firstEventT) },
      particlesTouched: { byStage: series(kF, (z) => z.particlesTouched) },
      perParticleAttributionExact: { byStage: series(kF, (z) => z.perParticleAttributionExact) },
      ledgerNetDrop: q((z) => z.ledgerNetDrop),
      ledgerAbsIntegral: q((z) => z.ledgerAbsIntegral),
      ledgerAbsPerEvent: q((z) => z.ledgerAbsPerEvent),
      discardedWorkLowerBound: { byStage: series(kF, (z) => z.discardedWorkLowerBound) },
      firstExcessMedianEst: { byStage: series(kF, (z) => z.firstExcessEstimate.medianSpinUnits) },
      firstExcessMaxEst: { byStage: series(kF, (z) => z.firstExcessEstimate.maxSpinUnits) } }; };
  CL.dtDependence = { kF1: mk(1), kF0: mk(0),
    note: '**同じ窓(T=40)・同じ seed・同じ抽出量**で dt・dt/2・dt/4 を並べた。'
      + '**帳簿の動きは積分誤差も含む**ので、`kF0`(clampSN=0)の同じ欄が**積分誤差の床**である。'
      + '`ratioToPrevStage` は「刻みを半分にしたときの倍率」である。' };
  const k1 = CL.dtDependence.kF1;
  CL.verdict = k1 ? {
    measured: { clampSNRatios: k1.clampSN.ratioToPrevStage,
      dutyRatios: k1.dutyPerStepPerParticle.ratioToPrevStage,
      saturatedFractionRatios: k1.saturatedFractionMean.ratioToPrevStage,
      ledgerAbsRatios: k1.ledgerAbsIntegral.ratioToPrevStage,
      kF0LedgerAbsFloor: CL.dtDependence.kF0 ? CL.dtDependence.kF0.ledgerAbsIntegral.byStage : null },
    reading: '**分類は実測の倍率で書く。** 步数は刻みを半分にするたび 2 倍になるので —— '
      + '**数値起因の側**なら「步あたりの作動率と飽和粒子の割合が 0 へ向かい、'
      + '|ΔJ| の積分も縮む」、**持続飽和の側**なら「步あたりの作動率と飽和割合が有限値へ寄り、'
      + '|ΔJ| の積分が有限値へ寄る」。**どちらも「物理的に正しい」とは書かない**'
      + '(この器が言えるのは刻み依存の形だけである)。',
    doNotSay: ['clamp は物理的な飽和である', 'clamp は数値のゴミである',
      '上限を上げれば解決する', 'clamp を止めたので比較できる'] } : null;
  write();
}

// ================================================================ AF19: N・seed 系列
if (want('nseries')) {
  const NS = { declaration: {
    seeds: SEEDS,
    seedRule: 'seed_k = 270105001 + 1000·k(k=0..3)—— **第270便e が走行前に宣言した等差列をそのまま使う**'
      + '(本数を後から足さない・採用値を後から選ばない)。',
    nRule: '**N ×1 / ×1.5 / ×1.99**(disk 粒子 300 / 450 / 597): disk の n を k 倍し、'
      + '**粒あたり質量を「丸めた後の n」から決め直して総質量を保存する**。'
      + '**中心核(single)は宣言質量なので N で割らない**(標本ではない)。'
      + '**素朴な ×2/×4 は engine の粒子総数上限 `N_CAP=600` に当たって実施できない** —— '
      + '実測は `capProbe` に残す(**上限は変えない**。上げるかは決断事項)。',
    fixed: `dt=${DT0} の 1 段・主判定窓と同じ **T=${T_END}** まで・帯は 10 点の事前宣言のまま`
      + '(**同じ物理時刻・同じ抽出量**)。**3 刻みは回さない**(これは標本の診断であって刻みの診断ではない)。',
    statistics: '**帯占有**(n)・**標本間 SD**(不偏 n−1)・**平均の SE = SD/√k** を**別々の欄**に出す。'
      + '**空帯は欠測**(分母から外し、使った本数を併記する —— 0 で平均しない)。'
      + '**SD も SE も観測 σ(e_Vobs)には足さない。**',
    bandIntegration: { status: 'declared-not-implemented',
      what: '**帯統合**(細い帯を束ねて 1 点にする解析)は**別 variant** である。'
        + '観測側も同じ窓・同じ重みで再集約し、**束ねた点の間の共分散**を持たなければ'
        + '「点数が増えた」と読めない。**本便は定義だけで実施しない。**' },
    doNotSay: ['N を増やして誤差が縮んだ', 'SD を観測 σ に足した', '本数を後から足した',
      'N を増やしたので比較できるようになった', '粒子上限を上げた'] },
  capProbe: null, columns: [] };
  out.nSeedSeries = NS;
  // ---- **粒子総数上限の実測**(1 步も回さない探り。**上限は変えない**)
  NS.capProbe = { nCapDeclaredInEngine: 600, probes: [] };
  for (const k of [1].concat(N_CAP_PROBE).concat(N_MULTS.filter((z) => z !== 1))) {
    const pr = await pg.evaluate(({ id, patch }) => W271.probe(id, patch),
      { id: 'ngc3198DFM', patch: { id: 'ngc3198DFMW271dProbe' + String(k).replace('.', 'p'),
        seed: SEEDS[0], nMult: k } });
    NS.capProbe.probes.push(Object.assign({ nMult: k }, pr));
    console.error(`  AF19 上限の探り ×${k}: 要求 ${JSON.stringify(pr.requested)} → 受理 `
      + `${JSON.stringify(pr.accepted)} 総質量 ${pr.massTotal === undefined ? '—' : pr.massTotal.toFixed(3)}`);
  }
  NS.capProbe.reading = '**要求した n がそのまま受理されるのは `N_CAP=600` の内側だけ**である。'
    + '×2(400/200/+核 1 = 601)と ×4(800/400/+核 1)は `validatePreset` が比例縮小し、'
    + '**×4 では粒あたり質量が縮小前の値のままなので総質量まで落ちる**。'
    + '**この便は上限を変えない**ので、実施する系列は**上限直下まで**にした。';
  write();
  for (const k of N_MULTS) {
    const col = { nMult: k, tag: `🛞 ngc3198DFM(kFrame=1)disk 粒子 ×${k}`, runs: [], stat: null };
    for (const sd of SEEDS) {
      const patch = { id: 'ngc3198DFMW271dN' + k + 'S' + sd, seed: sd, nMult: k };
      const r = await pg.evaluate(({ id, patch, dt, tEnd, bins }) => W271.nRun(id, patch, dt, tEnd, bins),
        { id: 'ngc3198DFM', patch, dt: DT0, tEnd: T_END, bins: BINS });
      if (r.err) { col.runs.push({ seed: sd, error: r.err }); continue; }
      col.runs.push({ seed: sd, n: r.n, nBodies: r.nBodies, massTotal: r.massTotal,
        nan: r.nan, tActual: r.tActual, clamp: r.clamp, clampByKind: r.clampByKind,
        byPoint: POINTS.map((p, bi) => { const z = r[p.tracer][bi];
          return { rKpc: p.rKpc, tracer: p.tracer, n: z.n,
            vtKms: z.vtMean === null ? null : z.vtMean * KMS_PER_UNIT }; }) });
      console.error(`  AF19 N×${k} seed=${sd}: n=${r.n} NaN=${r.nan} clampSN=${r.clampByKind.clampSN}`
        + `  [${((Date.now() - tA) / 1000).toFixed(0)} s]`);
      write();
    }
    col.stat = POINTS.map((p, bi) => {
      const ok = col.runs.filter((z) => !z.error);
      const xs = ok.map((z) => z.byPoint[bi].vtKms).filter((z) => Number.isFinite(z));
      const ns = ok.map((z) => z.byPoint[bi].n);
      const m = xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;
      const sd = (xs.length > 1)
        ? Math.sqrt(xs.reduce((a, b) => a + (b - m) * (b - m), 0) / (xs.length - 1)) : null;
      return { rKpc: p.rKpc, tracer: p.tracer, eVobsKms: p.sigmaKms,
        occupancyBySeed: ns, occupancyMean: ns.length ? ns.reduce((a, b) => a + b, 0) / ns.length : null,
        emptySeeds: ns.filter((z) => !(z > 0)).length,
        seedsWithValue: xs.length, seedsTotal: ok.length,
        meanKms: m, sdBetweenSeedsKms: sd,
        seMeanKms: (sd === null) ? null : sd / Math.sqrt(xs.length),
        sdOverEVobs: (sd === null || !(p.sigmaKms > 0)) ? null : sd / p.sigmaKms };
    });
    NS.columns.push(col);
    write();
  }
  NS.occupancyTrend = POINTS.map((p, bi) => ({ rKpc: p.rKpc, tracer: p.tracer,
    occupancyMeanByN: NS.columns.map((c) => (c.stat ? c.stat[bi].occupancyMean : null)),
    sdByN: NS.columns.map((c) => (c.stat ? c.stat[bi].sdBetweenSeedsKms : null)),
    seByN: NS.columns.map((c) => (c.stat ? c.stat[bi].seMeanKms : null)),
    seedsWithValueByN: NS.columns.map((c) => (c.stat ? c.stat[bi].seedsWithValue : null)) }));
  write();
}

out.meta.spentSec = +((Date.now() - tA) / 1000).toFixed(1);
out.pageErrors = pageErrors;
await browser.close();
write();
console.error('[w271d-galaxydiag] wrote ' + OUT + '  (' + out.meta.spentSec + ' s)  pageErrors='
  + pageErrors.length);

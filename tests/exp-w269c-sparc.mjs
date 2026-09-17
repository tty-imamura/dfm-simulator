// 第269便c(第59報 W3)「**銀河の比較サンプル v1**: NGC 3198 の SPARC 10 点比較器」。
//
// ■ 原仮定者の指示(第59報): 「ブラックホール連星、星団、銀河の各サンプルの完成を目指す」。
//   統括の読み (A)「完成=比較サンプル v1」・(C)「SPARC 公式 MassModels 表の NGC3198 は 43 点で、
//   CSV の候補 10 点は統括の予備測定(外部照合)で値・誤差とも一致(**verified にはしない**)」。
//
// ■ 比較器の契約(統括の読み (C) ①〜⑥ —— JSON の `contract` に同じ文で載せる)
//   ① 観測は**傾斜補正済み**(SPARC Vobs)→ 抽出した接線速度に **sin i を再びかけない**。
//   ② **共通の中心位置・中心速度を固定**する。r=|x−x_c|・v_t=(dx·dv_y−dy·dv_x)/r。**r=0 は除外**し
//      除外理由を残す。
//   ③ **星と HI を区別する**(外側 HI の観測に星+HI の平均を当てない)。混ぜる列は「混合」と明記する。
//   ④ **10 点の半径を CSV から固定**し、**ビン端を事前宣言**する(全 43 点の半径間隔から: 隣接点の中点。
//      最内点の内側端は −0.16 kpc・最外点の外側端は +(最後の間隔)/2)。**空ビンは null**。
//      個数・重み・方位カバレッジを併記する。**44.08 kpc は初期 HI 打切りを越える**(実測して書く)。
//   ⑤ t=0 は**初期条件診断**、t=10/20/40 を診断チェックポイントとして**先に固定**する。
//      主判定は宣言した最終窓(**T=40**)—— **散逸前だけを選んで成功としない**。
//      **これは新規の窓提案であって、観測から決まる時刻ではない。**
//   ⑥ **h/h2/h4 で同じ物理時刻**・N・softening・seed 依存を**別記録**にする。
//
// ■ さらに(統括の読み (C))
//   ・**🌃 の NFW は同じ 43 点へ fit 済みなので、10 点は 🌃 の独立 hold-out ではない**(fit の再現確認)。
//   ・**🛞 は未使用予測としての比較**(比較後に調整すれば次から fit 側になる)。
//   ・e_Vobs は**非円運動のランダム誤差**を含み**傾斜の系統誤差を含まない** →
//     **独立 Gaussian の全誤差と見なさない**。残差は**誤差単位の診断表示**にとどめる。
//   ・**χ² の p 値は出さない。全点が範囲内であることを系全体の 3σ と呼ばない。**
//   ・**🛞 の中心核質量は増やさない・調整しない。**
//
// ■ 触らないもの
//   `beta/index.html` は**読むだけ**。🌃🛞 の JSON を 1 bit も書き換えない。対照は**器の中で作る診断コピー**
//   (`sampleClass:"principle"`・台帳と claims を外す)。`S._core` には 1 命令も足していない。
//
// ■ この器が**言わないこと**
//   「銀河を完成した(観測一致版)」「回転曲線を再現した」「観測と合った」「較正した」
//   「全点が誤差内だから系全体が 3σ で合った」。
//
// 実行: node tests/exp-w269c-sparc.mjs [--T 40] [--only main,sens]
// 出力: tests/out/sparc-w269c.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { richardson3 } from './lib-w265a-analogy.mjs';
import { compareRow, tallyStates, measurementStamp, fileStamp, loadObsCsv, noteField,
  NO_PVALUE_NOTE } from './lib-w269c-compare.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + (path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET));
const OUT = path.join(ROOT, 'tests', 'out', 'sparc-w269c.json');
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const T_END = Number(arg('--T', 40));
const PARTS = String(arg('--only', 'main,sens')).split(',');
const want = (k) => PARTS.indexOf(k) >= 0;
const CHECKPOINTS = [0, 10, 20, T_END];
const DIVS = [1, 2, 4];
const DT0 = 0.016;

// ---- 単位(銀河族 L19/T15/M38 —— プリセットの scaleExp から確かめる)
const KPC_M = 3.0856775814913673e19;
const KPC_PER_UNIT = 1e19 / KPC_M;      // 1 単位 = 0.3240779… kpc
const KMS_PER_UNIT = 1e19 / 1e15 / 1e3; // 1 単位 = 10 km/s
const toKpc = (u) => u * KPC_PER_UNIT;
const toUnit = (kpc) => kpc / KPC_PER_UNIT;

// ---- CSV(観測の正本)
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
    source: String(r.source), url: r.url,
    // **印は読むだけ**(`verified` にはしない —— 第269便b が注記を足すかどうかに依存しない設計)
    sigmaPrimary: noteField(r.note, 'sigma_primary') || 'unverified',
    valueCheckedBy: noteField(r.note, 'value_checked_by'),
    valueCheckedAt: noteField(r.note, 'value_checked_at') }))
  .sort((a, b) => a.rKpc - b.rKpc);

// ---- ④ **ビン端の事前宣言**(全 43 点の半径間隔から機械的に作る —— 走行前に固定する)
function binEdges(rKpc) {
  const i = all43.findIndex((z) => Math.abs(z.rKpc - rKpc) < 1e-9);
  if (i < 0) return null;
  const lo = (i === 0) ? rKpc - 0.16 : (all43[i - 1].rKpc + rKpc) / 2;
  const hi = (i === all43.length - 1)
    ? rKpc + (rKpc - all43[i - 1].rKpc) / 2 : (rKpc + all43[i + 1].rKpc) / 2;
  return { loKpc: lo, hiKpc: hi, indexIn43: i,
    rule: (i === 0) ? '最内点: 内側端は −0.16 kpc(43 点の最内間隔 0.32 kpc の半分)'
      : ((i === all43.length - 1) ? '最外点: 外側端は +(最後の間隔)/2' : '隣接 43 点との中点') };
}
// ③ **トレーサの割り当て**(宣言 —— CSV の note が「Hα 優勢は出所の推定であり SPARC に行ごとの
//    トレーサ印は無い」と書いているので、**器側の宣言**として残す)
const TRACER_SPLIT_KPC = 7.06;   // 43 点の 0.32 kpc 刻み(Hα 側)が終わる半径
const POINTS = cand.map((c) => {
  const e = binEdges(c.rKpc);
  return { rKpc: c.rKpc, rUnit: toUnit(c.rKpc), vObsKms: c.vMs / 1000,
    sigmaKms: c.sigmaMs === null ? null : c.sigmaMs / 1000,
    bin: e, binLoUnit: e ? toUnit(e.loKpc) : null, binHiUnit: e ? toUnit(e.hiKpc) : null,
    tracer: (c.rKpc <= TRACER_SPLIT_KPC) ? 'stars' : 'hi',
    sigmaPrimary: c.sigmaPrimary, valueCheckedBy: c.valueCheckedBy, valueCheckedAt: c.valueCheckedAt,
    source: c.source, url: c.url };
});

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
  window.W269 = {};
  // **診断コピー**(本体は 1 bit も触らない)。`sampleClass:"principle"`・台帳と claims を外す。
  W269.copy = (id, patch) => {
    const src = HP.allPresets().find((q) => q.id === id);
    if (!src) return null;
    const p = JSON.parse(JSON.stringify(src));
    if (!patch) return p;                       // asIs(内蔵のまま)
    p.id = patch.id || (id + 'W269cDiag');
    p.sampleClass = 'principle';
    delete p.massCalibration; delete p.claims; delete p.calibrationForecast;
    if (patch.dropHalo) delete p.physics.halo;
    if (patch.physics) Object.assign(p.physics, patch.physics);
    if (patch.seed !== undefined) p.seed = patch.seed;
    return p;
  };
  // ② 共通の中心位置・中心速度を固定して帯統計を作る。**r=0 は除外して理由を残す。**
  W269.stats = (S, bins, seg) => {
    let cx = 0, cy = 0, cvx = 0, cvy = 0, centerKind = 'origin';
    if (typeof seg.center === 'number' && seg.center < S.n) {
      cx = S.x[seg.center]; cy = S.y[seg.center];
      cvx = S.vx[seg.center]; cvy = S.vy[seg.center]; centerKind = 'body#' + seg.center;
    }
    const mk = () => bins.map(() => ({ n: 0, mass: 0, sv: 0, sv2: 0, sect: {} }));
    const acc = { stars: mk(), hi: mk(), mixed: mk() };
    const info = { stars: { n: 0, rMax: 0 }, hi: { n: 0, rMax: 0 } };
    let zeroRadius = 0;
    const put = (key, b, r, vt, m, th) => {
      const a = acc[key][b]; a.n++; a.mass += m; a.sv += vt; a.sv2 += vt * vt;
      a.sect[th] = (a.sect[th] || 0) + 1;
    };
    const comps = [['stars', seg.stars], ['hi', seg.hi]];
    for (const [key, sg] of comps) {
      if (!sg) continue;
      for (let i = sg.from; i < sg.to && i < S.n; i++) {
        const dx = S.x[i] - cx, dy = S.y[i] - cy, r = Math.hypot(dx, dy);
        info[key].n++;
        if (r > info[key].rMax) info[key].rMax = r;
        if (!(r > 0)) { zeroRadius++; continue; }          // ② **r=0 は除外**(理由を残す)
        const vx = S.vx[i] - cvx, vy = S.vy[i] - cvy;
        const vt = (dx * vy - dy * vx) / r;
        const th = Math.floor(((Math.atan2(dy, dx) + Math.PI) / (2 * Math.PI)) * 12) % 12;
        for (let b = 0; b < bins.length; b++) {
          if (r >= bins[b].lo && r < bins[b].hi) {
            put(key, b, r, vt, S.m[i], th); put('mixed', b, r, vt, S.m[i], th);
          }
        }
      }
    }
    const fin = (a) => a.map((z) => ({ n: z.n, mass: z.mass,
      vtMean: z.n ? z.sv / z.n : null,
      vtSd: z.n > 1 ? Math.sqrt(Math.max(0, z.sv2 / z.n - (z.sv / z.n) * (z.sv / z.n))) : null,
      sectorsOccupied: Object.keys(z.sect).length, sectorsTotal: 12 }));
    return { centerKind, cx, cy, cvx, cvy, zeroRadius,
      stars: fin(acc.stars), hi: fin(acc.hi), mixed: fin(acc.mixed),
      componentInfo: info };
  };
  // 同一物理時刻のチェックポイントで統計を採る
  W269.run = (id, patch, dt, checkpoints, bins, seg) => {
    const p = W269.copy(id, patch);
    if (!p) return { err: 'no such preset: ' + id };
    const v = HP.validatePreset(p);
    if (!v.ok) return { err: (v.errors || []).join('|') };
    const S = HP.sim; S.build(v.preset);
    const out = { n: S.n, sampleClass: v.preset.sampleClass, seed: v.preset.seed,
      kFrame: v.preset.physics.kFrame, softening: v.preset.physics.softening,
      hasHalo: !!v.preset.physics.halo, scaleExp: v.preset.scaleExp, at: [] };
    let t = 0;
    for (const cp of checkpoints) {
      const nSteps = Math.round((cp - t) / dt);
      for (let k = 0; k < nSteps; k++) S.step(dt);
      t = cp;
      out.at.push({ t: cp, tActual: S.t, stats: W269.stats(S, bins, seg), nan: S.hasNaN(),
        clamp: (S.clampVN || 0) + (S.clampSN || 0) + (S.clampHN || 0) + (S.clampRN || 0)
          + (S.clampTN || 0) });
      if (S.hasNaN()) break;
    }
    return out;
  };
  W269.facts = (ids) => ids.map((id) => {
    const p = HP.allPresets().find((q) => q.id === id);
    if (!p) return { id, missing: true };
    return { id, emoji: p.emoji, sampleClass: p.sampleClass, scaleExp: p.scaleExp, seed: p.seed,
      kFrame: p.physics.kFrame, softening: p.physics.softening,
      halo: p.physics.halo || null, timeScale: p.physics.timeScale,
      bodies: p.bodies.map((b) => ({ type: b.type, n: b.n === undefined ? 1 : b.n,
        radius: b.radius, mMin: b.mMin, mMax: b.mMax, m: b.m, shell: b.shell || null,
        vMode: b.vMode || null, vScale: b.vScale === undefined ? null : b.vScale })) };
  });
});

const facts = await pg.evaluate((ids) => W269.facts(ids), ['ngc3198', 'ngc3198DFM']);
const factOf = (id) => facts.find((f) => f.id === id) || {};
// 粒子 index の宣言(プリセットの bodies の並びから作る —— 推測しない)
function segOf(id) {
  const f = factOf(id);
  const bs = f.bodies || [];
  let i = 0; const seg = { stars: null, hi: null, center: 'origin', layout: [] };
  for (const b of bs) {
    const from = i, to = i + (b.type === 'disk' ? b.n : 1);
    seg.layout.push({ type: b.type, from, to, radiusUnit: b.radius, shell: b.shell,
      radiusKpc: b.radius === undefined ? null : toKpc(b.radius) });
    if (b.type === 'disk' && seg.stars === null) seg.stars = { from, to };
    else if (b.type === 'disk' && seg.hi === null) seg.hi = { from, to };
    else if (b.type === 'single') seg.center = from;
    i = to;
  }
  return seg;
}
const SEG = { ngc3198: segOf('ngc3198'), ngc3198DFM: segOf('ngc3198DFM') };
const BINS = POINTS.map((p) => ({ lo: p.binLoUnit, hi: p.binHiUnit }));

const out = {
  meta: measurementStamp({
    codeVersion: 'tests/exp-w269c-sparc.mjs 第269便c',
    declarationVersion: 'compare-v1 / 第59報「完成=比較サンプル v1」',
    inputs: [fileStamp(path.join(ROOT, TARGET), TARGET), fileStamp(CSV, CSV_REL),
      fileStamp(path.join(ROOT, 'tests', 'lib-w269c-compare.mjs'), 'tests/lib-w269c-compare.mjs')] }),
  contract: {
    '①傾斜': '観測(SPARC Vobs)は**傾斜補正済み**である → 抽出した接線速度に **sin i を再びかけない**。'
      + 'CSV の inclination 行にも「SPARC Vobs is ALREADY DEPROJECTED - do not divide by sin(i) again」とある。',
    '②中心': '**共通の中心位置・中心速度を固定する。** 🌃 は外部 NFW が原点に固定されているので中心=原点・'
      + '中心速度=0(宣言)。🛞 は**自由な中心核に対する相対**(位置も速度も引く)。'
      + 'r=|x−x_c|・**v_t=(dx·dv_y−dy·dv_x)/r**。**r=0 の粒子は除外**し、除外数を `zeroRadius` に残す。',
    '③星と HI': '**星と HI を区別する。** 内側(r ≤ ' + TRACER_SPLIT_KPC + ' kpc・43 点が 0.32 kpc 刻みの'
      + 'Hα 側)は星、外側は HI を**主列**とする。**混合列は別に出す**(外側 HI の観測に星+HI の平均を'
      + '当てない)。**トレーサの出所は SPARC の行ごとの印ではなく記録側の推定**なので、'
      + 'この割り当ては**器側の宣言**である。',
    '④ビン端': '10 点の半径は CSV から固定し、**ビン端は全 43 点の半径間隔から事前宣言**する'
      + '(隣接 43 点との中点。最内点の内側端は −0.16 kpc・最外点の外側端は +(最後の間隔)/2)。'
      + '**空ビンは null**(0 で埋めない)。個数・質量重み・方位カバレッジ(12 分割中いくつ)を併記する。'
      + '**44.08 kpc(と 42.17 kpc)は初期 HI 打切りを越える** —— 打切り半径は実測して下に書く。',
    '⑤窓': 't=0 は**初期条件診断**。t=10/20/' + T_END + ' を診断チェックポイントとして**先に固定**した。'
      + '**主判定窓は T=' + T_END + '(宣言した最終窓)**であり、**散逸前だけを選んで成功としない**。'
      + '**これは新規の窓提案であって、観測から決まる時刻ではない。**',
    '⑥数値': '**h/h2/h4(dt=0.016/0.008/0.004)を同じ物理時刻で**走らせ、N・softening・seed 依存を'
      + '**別記録**にする。**数値未解決の宣言基準**: 最終 2 段の差 |Q_{h/2}−Q_{h/4}| が e_Vobs を'
      + '超えたら `numerically-unresolved`(値は残すが比較には使わない)。',
    holdOut: '**🌃 の NFW(ρ₀・r_s)は同じ SPARC 43 点への自前 2 ノブ fit である。'
      + 'したがって 10 点は 🌃 の独立 hold-out ではなく、fit の再現確認である。** '
      + '🛞 は fit に使っていない**未使用予測**としての比較(比較後に調整すれば次から fit 側になる)。',
    sigmaReading: '**e_Vobs は非円運動のランダム誤差を含み、傾斜の系統誤差を含まない。** '
      + '独立 Gaussian の全誤差と見なさない。残差は**誤差単位の診断表示**にとどめる。' + NO_PVALUE_NOTE,
    centralMass: '**🛞 の中心核質量は増やさない・調整しない。**(本便で触れたのは kFrame・seed・'
      + 'softening・ハローの有無だけで、いずれも診断コピーの中である)',
    notSaid: ['「銀河を完成した(観測一致版)」', '「回転曲線を再現した」', '「観測と合った」',
      '「較正した」', '「全点が誤差内だから系全体が 3σ で合った」'] },
  units: { kpcPerUnit: KPC_PER_UNIT, kmsPerUnit: KMS_PER_UNIT,
    note: '銀河族 L19/T15/M38: 1 長さ単位 = 10¹⁹ m = ' + KPC_PER_UNIT.toFixed(7) + ' kpc・'
      + '1 速度単位 = 10 km/s。プリセットの scaleExp と突き合わせる。' },
  observationVersion: { csv: CSV_REL, fullPoints: all43.length, comparedPoints: POINTS.length,
    note: '候補 10 点(`_candidate` 行)の値と e_Vobs を使う。**印は `sigma_primary` のまま読み、'
      + 'この器は verified に上げない**(統括の予備測定は外部照合であって原仮定者の目視確認ではない)。' },
  points: POINTS, presetFacts: facts, segments: SEG,
  columns: [], sensitivity: [], pageErrors: [] };

const tA = Date.now();
const nowrite = () => { fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1)); };

// ---- 4 本(🌃 NFW・🌃 ハローなし・🛞 DFM・🛞 kFrame=0)
const COLUMNS = [
  { tag: '🌃 ngc3198(NFW 対照・内蔵のまま)', id: 'ngc3198', patch: null, role: 'fit の再現確認' },
  { tag: '🌃 ハローなし対照(診断コピー・principle)', id: 'ngc3198',
    patch: { id: 'ngc3198NoHaloW269c', dropHalo: true }, role: '対照(ハローを外す)' },
  { tag: '🛞 ngc3198DFM(DFM 仮説・内蔵のまま)', id: 'ngc3198DFM', patch: null, role: '未使用予測' },
  { tag: '🛞 kFrame=0 対照(診断コピー・principle)', id: 'ngc3198DFM',
    patch: { id: 'ngc3198DFMkF0W269c', physics: { kFrame: 0 } }, role: '対照(引きずりを切る)' } ];

function pickComp(stats, tracer) { return stats[tracer]; }

if (want('main')) {
  for (const c of COLUMNS) {
    const col = { tag: c.tag, id: c.id, emoji: factOf(c.id).emoji, role: c.role,
      patch: c.patch, stages: [], rows: [] };
    out.columns.push(col);
    for (const div of DIVS) {
      const dt = DT0 / div;
      const r = await pg.evaluate(({ id, patch, dt, cps, bins, seg }) =>
        W269.run(id, patch, dt, cps, bins, seg),
      { id: c.id, patch: c.patch, dt, cps: CHECKPOINTS, bins: BINS, seg: SEG[c.id] });
      col.stages.push({ div, dt, run: r });
      const last = r.at ? r.at[r.at.length - 1] : null;
      console.error(`  ${col.emoji} ${c.tag} dt/${div}: n=${r.n} NaN=${last ? last.nan : '—'}`
        + ` r_max(HI)=${last ? toKpc(last.stats.componentInfo.hi.rMax).toFixed(2) : '—'} kpc`
        + `  [${((Date.now() - tA) / 1000).toFixed(0)} s]`);
      nowrite();
    }
    // ---- 初期打切り(t=0 の各成分の最大半径)
    const s0 = col.stages[0].run.at[0].stats.componentInfo;
    col.initialCutoff = { starsKpc: toKpc(s0.stars.rMax), hiKpc: toKpc(s0.hi.rMax),
      starsUnit: s0.stars.rMax, hiUnit: s0.hi.rMax,
      note: '**t=0 の実測**(生成器が置いた最外粒子の半径)。宣言半径ではない。' };
    // ---- 10 点 × チェックポイント × 3 段
    col.table = POINTS.map((p, bi) => {
      const per = {};
      for (const key of ['stars', 'hi', 'mixed']) {
        per[key] = CHECKPOINTS.map((cp, ci) => col.stages.map((st) => {
          const at = st.run.at && st.run.at[ci];
          if (!at) return null;
          const z = pickComp(at.stats, key)[bi];
          return { n: z.n, mass: z.mass,
            vtKms: z.vtMean === null ? null : z.vtMean * KMS_PER_UNIT,
            vtSdKms: z.vtSd === null ? null : z.vtSd * KMS_PER_UNIT,
            coverage: z.sectorsOccupied + '/' + z.sectorsTotal };
        }));
      }
      return { rKpc: p.rKpc, tracer: p.tracer, binKpc: p.bin, byComponent: per };
    });
    // ---- 主判定窓(T_END)の比較行
    const ciLast = CHECKPOINTS.length - 1;
    const cut = col.initialCutoff;
    for (let bi = 0; bi < POINTS.length; bi++) {
      const p = POINTS[bi];
      const tr = p.tracer;
      const cutKpc = (tr === 'hi') ? cut.hiKpc : cut.starsKpc;
      const perStage = col.stages.map((st) => {
        const at = st.run.at && st.run.at[ciLast];
        if (!at) return null;
        const z = pickComp(at.stats, tr)[bi];
        return { n: z.n, vtKms: z.vtMean === null ? null : z.vtMean * KMS_PER_UNIT,
          coverage: z.sectorsOccupied };
      });
      const vs = perStage.map((z) => (z ? z.vtKms : null));
      const ns = perStage.map((z) => (z ? z.n : 0));
      const rich = richardson3(vs[0], vs[1], vs[2]);
      const obs = { value: p.vObsKms, unit: 'km/s', lower: null, upper: null, confidence: null,
        sigma: p.sigmaKms, sigmaKind: 'e_Vobs(非円運動のランダム誤差 —— **傾斜の系統誤差を含まない**)',
        frame: '傾斜補正済みの円盤面(sin i を再びかけない)', source: p.source,
        role: (col.id === 'ngc3198') ? '**🌃 の NFW を fit した 43 点の一部** —— hold-out ではない'
          : '**🛞 は fit に使っていない** —— 未使用予測としての比較',
        verifiedMark: p.sigmaPrimary,
        valueCheckedBy: p.valueCheckedBy, valueCheckedAt: p.valueCheckedAt };
      let state, reason;
      if (p.binLoUnit > (tr === 'hi' ? cut.hiUnit : cut.starsUnit)) {
        state = 'mapping-unresolved';
        reason = `**ビンの内側端 ${p.bin.loKpc.toFixed(3)} kpc が初期 ${tr === 'hi' ? 'HI' : '星'} 打切り `
          + `${cutKpc.toFixed(3)} kpc を越えている。** この帯には転写された円盤が最初から存在しないので、`
          + `t=${T_END} にそこで見つかる粒子は**散逸で入ってきたもの**であり、観測の同半径のトレーサと`
          + `対応づけられていない。**0 や内側の値で補わない。**`;
      } else if (!ns.every((n) => n > 0)) {
        state = 'not-measurable';
        reason = `**空ビン**(3 段の粒子数 ${JSON.stringify(ns)})—— この半径帯に ${tr === 'hi' ? 'HI' : '星'} `
          + `粒子が居ない。**0 や最後の値で補わない。**`;
      } else if (p.sigmaKms !== null && Number.isFinite(vs[1]) && Number.isFinite(vs[2])
        && Math.abs(vs[1] - vs[2]) > p.sigmaKms) {
        state = 'numerically-unresolved';
        reason = `**最終 2 段の差 |h/2 − h/4| = ${Math.abs(vs[1] - vs[2]).toFixed(3)} km/s が `
          + `e_Vobs = ${p.sigmaKms.toFixed(3)} km/s を超えている**(宣言した数値予算 ⑥)—— `
          + `この点は刻み依存が観測誤差より大きく、比較に使えない。`;
      } else {
        state = 'comparable';
        reason = `比較の前提(定義・単位・座標系・窓・抽出器・数値精度)が揃って数値が並んだ。`
          + `**e_Vobs は独立 Gaussian の全誤差ではない**ので、残差は誤差単位の診断表示にとどめる`
          + `(区間判定も p 値も出さない)。`;
      }
      const v = (state === 'not-measurable') ? null : vs[2];
      col.rows.push(compareRow({ quantity: `v_rot(r=${p.rKpc} kpc)[${tr}]`,
        sim: { value: v, unit: 'km/s',
          window: `主判定窓 t=${T_END}(宣言した最終窓 —— 観測から決まる時刻ではない)`,
          extractor: `帯 [${p.bin.loKpc.toFixed(3)}, ${p.bin.hiKpc.toFixed(3)}] kpc の `
            + `v_t=(dx·dv_y−dy·dv_x)/r の粒子平均(${tr === 'hi' ? 'HI' : '星'} 成分のみ)`,
          stages: { h: vs[0], h2: vs[1], h4: vs[2] },
          order: rich.p, extrapolated: rich.monotone === true ? rich.ext : null },
        obs, state, reason,
        diagnostics: { nByStage: ns, coverageByStage: perStage.map((z) => (z ? z.coverage : null)),
          residualInSigmaByStage: vs.map((x) => ((x === null || p.sigmaKms === null || !(p.sigmaKms > 0))
            ? null : (x - p.vObsKms) / p.sigmaKms)),
          richardson: rich, initialCutoffKpc: cutKpc,
          mixedAtLastStage: (() => { const at = col.stages[2].run.at[ciLast];
            const z = at ? at.stats.mixed[bi] : null;
            return z ? { n: z.n, vtKms: z.vtMean === null ? null : z.vtMean * KMS_PER_UNIT } : null; })(),
          note: '**残差は誤差単位の診断表示である**(合否ではない)。' + NO_PVALUE_NOTE } }));
    }
    // ---- t=0 の**初期条件診断**(比較ではない —— 何を置いたかの記録)
    col.initialDiagnostic = POINTS.map((p, bi) => {
      const z = col.stages[0].run.at[0].stats[p.tracer][bi];
      return { rKpc: p.rKpc, tracer: p.tracer, n: z.n,
        vtKms: z.vtMean === null ? null : z.vtMean * KMS_PER_UNIT, vObsKms: p.vObsKms };
    });
    col.initialDiagnosticNote = (col.id === 'ngc3198')
      ? '**🌃 の初期速度は vMode="flat"(観測 V_flat 15.01 単位 = 150.1 km/s)を先置きしたもの**である。'
        + 't=0 に 150 km/s が並ぶのは**入力の写しであって予測ではない**。'
      : '**🛞 の初期速度は配置した実ポテンシャルの円運動解**(vMode="enclosed"・vScale=1 —— '
        + '観測 V_flat を先置きしない)である。**f≈2 のバリオンだけでは t=0 から外側は 150 km/s に'
        + '届いていない**(これは走行の結果ではなく初期条件の性質である)。';
    // ---- 帯の粒子数(**この比較の解像度**)
    const occ = [];
    for (let bi = 0; bi < POINTS.length; bi++) {
      const z = col.stages[2].run.at[CHECKPOINTS.length - 1].stats[POINTS[bi].tracer][bi];
      occ.push(z.n);
    }
    col.binOccupancyAtJudgement = { nByPoint: occ, max: Math.max(...occ),
      empty: occ.filter((n) => n === 0).length,
      note: '**N=300(星 200・HI 100)を 10 本の細い帯に切ると 1 帯あたり数粒**しか入らない。'
        + 'これがこの比較の**解像度の上限**である(観測 e_Vobs は 2〜3 km/s しかない)。' };
    col.stateTally = tallyStates(col.rows);
    col.checkpointSummary = CHECKPOINTS.map((cp, ci) => {
      const at = col.stages[2].run.at[ci];
      return { t: cp, nan: at ? at.nan : null, clamp: at ? at.clamp : null,
        center: at ? { kind: at.stats.centerKind, x: at.stats.cx, y: at.stats.cy,
          vx: at.stats.cvx, vy: at.stats.cvy,
          driftKpc: at ? toKpc(Math.hypot(at.stats.cx, at.stats.cy)) : null } : null,
        zeroRadiusExcluded: at ? at.stats.zeroRadius : null,
        starsRMaxKpc: at ? toKpc(at.stats.componentInfo.stars.rMax) : null,
        hiRMaxKpc: at ? toKpc(at.stats.componentInfo.hi.rMax) : null };
    });
    nowrite();
  }
}

// ---- seed / softening 感度(**別記録** —— 主表には混ぜない)
if (want('sens')) {
  const SENS = [
    { tag: '🌃 seed 別(1573711562)', id: 'ngc3198', patch: { id: 'ngc3198SeedBW269c', seed: 1573711562 } },
    { tag: '🌃 softening 2(既定 1)', id: 'ngc3198',
      patch: { id: 'ngc3198SoftBW269c', physics: { softening: 2 } } },
    { tag: '🛞 seed 別(1573711562)', id: 'ngc3198DFM',
      patch: { id: 'ngc3198DFMSeedBW269c', seed: 1573711562 } },
    { tag: '🛞 softening 2(既定 1)', id: 'ngc3198DFM',
      patch: { id: 'ngc3198DFMSoftBW269c', physics: { softening: 2 } } } ];
  for (const s of SENS) {
    const r = await pg.evaluate(({ id, patch, dt, cps, bins, seg }) =>
      W269.run(id, patch, dt, cps, bins, seg),
    { id: s.id, patch: s.patch, dt: DT0, cps: CHECKPOINTS, bins: BINS, seg: SEG[s.id] });
    const ciLast = CHECKPOINTS.length - 1;
    const at = r.at ? r.at[ciLast] : null;
    out.sensitivity.push({ tag: s.tag, id: s.id, patch: s.patch, dt: DT0,
      seed: r.seed, softening: r.softening, kFrame: r.kFrame, sampleClass: r.sampleClass,
      initialCutoffKpc: r.at ? { stars: toKpc(r.at[0].stats.componentInfo.stars.rMax),
        hi: toKpc(r.at[0].stats.componentInfo.hi.rMax) } : null,
      byPoint: POINTS.map((p, bi) => { const z = at ? at.stats[p.tracer][bi] : null;
        return { rKpc: p.rKpc, tracer: p.tracer, n: z ? z.n : null,
          vtKms: (z && z.vtMean !== null) ? z.vtMean * KMS_PER_UNIT : null }; }),
      nan: at ? at.nan : null, clamp: at ? at.clamp : null,
      note: '**diagnostic copy(`sampleClass:"principle"`)**。本体 🌃🛞 は 1 bit も動かしていない。' });
    console.error(`  感度 ${s.tag}: NaN=${at ? at.nan : '—'}  [${((Date.now() - tA) / 1000).toFixed(0)} s]`);
    nowrite();
  }
  // 主表(dt=0.016)との差
  const base = { ngc3198: out.columns.find((c) => c.id === 'ngc3198' && c.patch === null),
    ngc3198DFM: out.columns.find((c) => c.id === 'ngc3198DFM' && c.patch === null) };
  for (const s of out.sensitivity) {
    const b = base[s.id];
    if (!b) continue;
    const ciLast = CHECKPOINTS.length - 1;
    s.deltaVsBaseKms = POINTS.map((p, bi) => {
      const z = b.stages[0].run.at[ciLast].stats[p.tracer][bi];
      const v0 = z.vtMean === null ? null : z.vtMean * KMS_PER_UNIT;
      const v1 = s.byPoint[bi].vtKms;
      return { rKpc: p.rKpc, base: v0, alt: v1, delta: (v0 === null || v1 === null) ? null : v1 - v0 };
    });
  }
  nowrite();
}

out.summary = {
  stateTallyAll: tallyStates(out.columns.reduce((a, c) => a.concat(c.rows), [])),
  perColumn: out.columns.map((c) => ({ tag: c.tag, tally: c.stateTally })),
  beyondCutoff: POINTS.filter((p) => p.tracer === 'hi').map((p) => p.rKpc)
    .filter((r) => out.columns.length && r > out.columns[0].initialCutoff.hiKpc),
  holdOutNote: '**🌃 の 10 点は独立 hold-out ではない**(NFW の 2 ノブは同じ 43 点に fit 済み)。'
    + '🛞 は未使用予測としての比較である。',
  notSaid: ['「銀河を完成した(観測一致版)」', '「回転曲線を再現した」', '「観測と合った」',
    '「較正した」', '「全点が誤差内だから系全体が 3σ で合った」'] };
out.meta.spentSec = +((Date.now() - tA) / 1000).toFixed(1);
out.pageErrors = pageErrors;
await browser.close();
nowrite();
console.error('[w269c-sparc] wrote ' + OUT + '  (' + out.meta.spentSec + ' s)  pageErrors='
  + pageErrors.length);
for (const c of out.columns) {
  console.log('--- ' + c.tag + '  状態: ' + JSON.stringify(c.stateTally)
    + '  初期打切り HI=' + c.initialCutoff.hiKpc.toFixed(2) + ' kpc');
  for (const r of c.rows) console.log('   ' + r.quantity.padEnd(26)
    + (r.sim.value === null ? '—' : r.sim.value.toFixed(3)).padStart(10) + ' km/s   ' + r.state);
}

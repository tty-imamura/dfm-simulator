// 第256便d(第48報): 「**検出器の合成軌道検定** —— A/B の差は定義差か、推定器の誤差か」。
//
// 3 審査 v14 の ChatGPT O5.2: 「検出器 A/B の差を『定義差』と呼ぶ前に、**真値が分かっている軌道**で
// 検出器単体を検定せよ」。本器はその検定である。**シミュレータを 1 度も走らせない**(ブラウザ不要)。
// 合成軌道は解析ケプラー + 既知の歳差 ω̇(近点引数の一様回転)で、真値は閉じた式で分かる:
//   ・近点間周期の真値 = P_kep(厳密)
//   ・1 近点間の近点方向の前進の真値 = ω̇·P_kep(厳密)
// ここに第252便b/第254便d/第255便d と**同一手続き**の検出器 A(ṙ の −→+ 交差)/ B(距離極小の
// 放物線頂点)・柵・20 近点の直線 fit をかけ、**推定誤差**と **A−B 差**を出す。
//
// 読み方(**この器は肯定の道具ではなく否定の道具である**):
//   合成軌道で |A−B| が シミュレータの A−B 差より**十分小さい**なら、シミュレータ側の A/B 差は
//   「同じ定義の 2 検出器の推定器誤差」では説明できない = **軌道側**(積分誤差・引きずり場の床・
//   非ケプラー性)から来ている。逆に同程度なら、A/B 差は推定器の誤差であって系の性質ではない。
//   **どちらであるかは測って決める**(予想は書かない)。
//
// 実行: node tests/exp-w256d-detector.mjs [--fast]
// 出力: tests/out/detector-w256.json(数値は docs/PHYSICS.md〔第256便d〕へ全載)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runCase } from './lib-w256d-peri.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'tests', 'out', 'detector-w256.json');
const FAST = process.argv.slice(2).includes('--fast');
const DT0 = 0.016;
const YR = 365.25 * 86400;
const NWIN = 20;

// ---------------------------------------------------------------- 観測レコード(CSV が正本)
function loadCsv() {
  const txt = fs.readFileSync(path.join(ROOT, 'paper', 'data', 'solar-observations.csv'), 'utf8');
  const m = new Map();
  for (const line of txt.split('\n')) {
    if (!line.trim() || line.startsWith('body,')) continue;
    const cols = []; let cur = '', inQ = false;
    for (const ch of line) {
      if (inQ) { if (ch === '"') inQ = false; else cur += ch; }
      else if (ch === '"') inQ = true;
      else if (ch === ',') { cols.push(cur); cur = ''; }
      else cur += ch;
    }
    cols.push(cur);
    const key = cols[0] + '|' + cols[1];
    if (m.has(key)) continue;
    m.set(key, { v: Number(cols[2]), unit: cols[3], source: cols[4], sigma: cols[8] });
  }
  return m;
}
const CSV = loadCsv();
// 4 系。単位は プリセットと同じ相対論的連星族(1 単位 = 10⁶ m / 10 s)。
// ω̇ は CSV の periastron_advance 行(°/yr)。⚡ は第255便d と同じ第249便a の転写を fallback に持つ。
const SYS = [
  { id: 'psrDoubleABDFM', emoji: '⚡', body: 'PSR J0737-3039 B', label: 'J0737−3039A/B', wdFallback: 16.899323 },
  { id: 'psrJ1757DFM', emoji: '🧮', body: 'PSR J1757-1854', label: 'J1757−1854' },
  { id: 'psrJ1946DFM', emoji: '🩺', body: 'PSR J1946+2052', label: 'J1946+2052' },
  { id: 'psrB1534DFM', emoji: '🧶', body: 'PSR B1534+12', label: 'B1534+12' },
];
for (const s of SYS) {
  const P = CSV.get(s.body + '|orbital_period'), e = CSV.get(s.body + '|eccentricity');
  const a = CSV.get(s.body + '|semi_major_axis'), w = CSV.get(s.body + '|periastron_advance');
  s.PobsS = (P.unit === 's') ? P.v : P.v * 86400;
  s.e = e.v;
  s.aM = a.v;
  s.wdDegPerYr = w ? w.v : s.wdFallback;
  s.wdFrom = w ? String(w.source).slice(0, 70) : 'tests/exp-w249a.mjs(第249便a の転写)';
  s.P = s.PobsS / 10;               // 時間単位(1 単位 = 10 s)
  s.aU = s.aM / 1e6;                // 長さ単位(1 単位 = 10⁶ m)
  s.obsDegPerOrbit = s.wdDegPerYr * s.PobsS / YR;
  s.wdDegPerTime = s.obsDegPerOrbit / s.P;   // °/時間単位
}

const DTS = FAST ? [DT0] : [DT0, DT0 / 2, DT0 / 4];
const out = { wave: '第256便d', node: process.version, at: new Date().toISOString(), fast: FAST,
  window: { nPeri: NWIN, nIntervals: NWIN - 1, dt0: DT0, orbits: 21.5 },
  note: '解析ケプラー+既知 ω̇ の合成軌道(真値は閉じた式)に第255便d と同一手続きの検出器 A/B をかけた。'
    + '出るのは**推定器の誤差だけ**である(積分誤差 0・定義差 0 —— A も B も「近点通過の方向と時刻」を推定している)。',
  systems: SYS.map((s) => ({ id: s.id, emoji: s.emoji, label: s.label, e: s.e, PobsS: s.PobsS, aU: s.aU,
    wdDegPerYr: s.wdDegPerYr, wdFrom: s.wdFrom, obsDegPerOrbit: s.obsDegPerOrbit })),
  rows: [], zero: [], sweep: [] };

const fx = (z, d = 6) => (z === null || z === undefined || !Number.isFinite(z)) ? '—' : z.toFixed(d);
const ex = (z, d = 3) => (z === null || z === undefined || !Number.isFinite(z)) ? '—' : z.toExponential(d);

// ================================================================ ① 4 系 × dt 3 段 × 観測 ω̇
console.error('[w256d-det] ① 4 系 × dt 3 段(真値 = 観測換算 Δϖ_obs)');
for (const s of SYS) {
  for (const dt of DTS) {
    const r = runCase({ a: s.aU, e: s.e, P: s.P, omegaDotDegPerTime: s.wdDegPerTime, dt, orbits: 21.5, nWin: NWIN });
    const row = Object.assign({ id: s.id, emoji: s.emoji, label: s.label }, r);
    out.rows.push(row);
    console.error(`  ${s.emoji} dt=${dt}: 真 Δϖ=${fx(r.trueAdvDegPerOrbit, 8)} `
      + `A=${fx(r.A && r.A.advDeg, 8)}(誤差 ${ex(r.A && r.A.advErrDeg)} = ${fx(r.A && r.A.advErrRel * 100, 4)}%) `
      + `B=${fx(r.B && r.B.advDeg, 8)}(誤差 ${ex(r.B && r.B.advErrDeg)}) `
      + `|A−B|=${ex(r.detDiffDeg)} P 誤差 A=${ex(r.A && r.A.perErrRel)} 生検出=${r.A && r.A.cand}/${r.B && r.B.cand} 柵却下=${r.A && r.A.dup}/${r.B && r.B.dup}`);
  }
}

// ================================================================ ② ω̇=0 対照(真値 0 = 推定器の素のバイアス)
console.error('[w256d-det] ② ω̇=0 対照(真の近点移動 0 —— 出る値は全部が推定器のバイアス)');
for (const s of SYS) {
  for (const dt of DTS) {
    const r = runCase({ a: s.aU, e: s.e, P: s.P, omegaDotDegPerTime: 0, dt, orbits: 21.5, nWin: NWIN });
    const row = Object.assign({ id: s.id, emoji: s.emoji, label: s.label,
      biasAsPctOfObs: (r.A ? 100 * r.A.advDeg / s.obsDegPerOrbit : null) }, r);
    out.zero.push(row);
    console.error(`  ${s.emoji} dt=${dt}: A=${ex(r.A && r.A.advDeg)}°/周(観測の ${fx(row.biasAsPctOfObs, 5)}%) `
      + `B=${ex(r.B && r.B.advDeg)} |A−B|=${ex(r.detDiffDeg)} P 誤差 A=${ex(r.A && r.A.perErrRel)} / B=${ex(r.B && r.B.perErrRel)}`);
  }
}

// ================================================================ ③ e 掃引(既定 dt・⚡ の a/P で e だけ振る)
if (!FAST) {
  console.error('[w256d-det] ③ e 掃引(⚡ の a/P・観測換算 ω̇ を固定して e だけ振る)');
  const s = SYS[0];
  for (const e of [0.02, 0.05, 0.0877, 0.15, 0.27, 0.45, 0.6, 0.75]) {
    const r = runCase({ a: s.aU, e, P: s.P, omegaDotDegPerTime: s.wdDegPerTime, dt: DT0, orbits: 21.5, nWin: NWIN });
    out.sweep.push(Object.assign({ kind: 'ecc', base: s.id }, r));
    console.error(`  e=${e}: A 誤差 ${ex(r.A && r.A.advErrDeg)}(${fx(r.A && r.A.advErrRel * 100, 4)}%) `
      + `|A−B|=${ex(r.detDiffDeg)} P 誤差 A=${ex(r.A && r.A.perErrRel)} 生検出=${r.A && r.A.cand}/${r.B && r.B.cand} 柵却下=${r.A && r.A.dup}/${r.B && r.B.dup}`);
  }
  // ④ ω̇ 掃引(⚡ の幾何で歳差の大きさだけ 0.5〜4 倍 —— 誤差が真値に比例するか、真値に依らないか)
  console.error('[w256d-det] ④ ω̇ 掃引(⚡ の幾何・既定 dt)');
  for (const f of [0.5, 1, 2, 4]) {
    const r = runCase({ a: s.aU, e: s.e, P: s.P, omegaDotDegPerTime: s.wdDegPerTime * f, dt: DT0, orbits: 21.5, nWin: NWIN });
    out.sweep.push(Object.assign({ kind: 'omegaDot', base: s.id, factor: f }, r));
    console.error(`  ω̇×${f}: 真 ${fx(r.trueAdvDegPerOrbit, 8)} A 誤差 ${ex(r.A && r.A.advErrDeg)} |A−B|=${ex(r.detDiffDeg)}`);
  }
  // ⑤ 位相掃引(ω0 を 8 通り — 近点がサンプル格子のどこに落ちるかで誤差が変わるか)
  console.error('[w256d-det] ⑤ 初期位相 ω0 掃引(⚡ の幾何・既定 dt)');
  for (let i = 0; i < 8; i++) {
    const w0 = i * Math.PI / 4;
    const r = runCase({ a: s.aU, e: s.e, P: s.P, omegaDotDegPerTime: s.wdDegPerTime, omega0: w0, dt: DT0, orbits: 21.5, nWin: NWIN });
    out.sweep.push(Object.assign({ kind: 'phase', base: s.id, omega0: w0 }, r));
    console.error(`  ω0=${(w0 * 180 / Math.PI).toFixed(0)}°: A 誤差 ${ex(r.A && r.A.advErrDeg)} B 誤差 ${ex(r.B && r.B.advErrDeg)} |A−B|=${ex(r.detDiffDeg)}`);
  }
}

// ================================================================ ⑥⑦ 「A/B 差の正体」を当てにいく 2 つの汚し
// 合成軌道そのものでは A/B が 10⁻¹⁰ 台で一致してしまう。ではシミュレータ側の A−B(4.5×10⁻⁶〜2.9×10⁻⁴ °/周)
// は**軌道をどれだけ汚せば**再現できるのか。候補を 2 つだけ立てて掃く(どちらも仮説であって主張ではない)。
//   ⑥ **速度の食い違い時刻**(検出器 A だけが速度を使う — 位置と速度の時刻がずれていれば A だけ偏る)
//   ⑦ **位置の床/雑音**(引きずり場の Float32 の床 — 第246便 D2。両検出器が同じ雑音を見る)
out.lag = []; out.noise = [];
if (!FAST) {
  console.error('[w256d-det] ⑥ 速度の食い違い時刻 vLag(検出器 A だけが速度を使う)');
  for (const s of SYS) {
    for (const lag of [0.5, 0.25, 0.05, 0.01]) {
      const r = runCase({ a: s.aU, e: s.e, P: s.P, omegaDotDegPerTime: s.wdDegPerTime, dt: DT0, orbits: 21.5, nWin: NWIN, vLagFrac: lag });
      out.lag.push(Object.assign({ id: s.id, emoji: s.emoji }, r));
      console.error(`  ${s.emoji} lag=${lag}·dt: A 誤差 ${ex(r.A && r.A.advErrDeg)} B 誤差 ${ex(r.B && r.B.advErrDeg)} `
        + `|A−B|=${ex(r.detDiffDeg)} P 誤差 A=${ex(r.A && r.A.perErrRel)}`);
    }
  }
  console.error('[w256d-det] ⑦ 位置の雑音 ε(相対振幅・a 基準)と Float32 丸め');
  for (const s of SYS) {
    for (const eps of [1e-12, 1e-10, 1e-8, 1e-7, 1e-6]) {
      const r = runCase({ a: s.aU, e: s.e, P: s.P, omegaDotDegPerTime: s.wdDegPerTime, dt: DT0, orbits: 21.5, nWin: NWIN, posNoise: eps });
      out.noise.push(Object.assign({ id: s.id, emoji: s.emoji, eps }, r));
      console.error(`  ${s.emoji} ε=${eps}: A 誤差 ${ex(r.A && r.A.advErrDeg)} |A−B|=${ex(r.detDiffDeg)} 生検出=${r.A && r.A.cand}/${r.B && r.B.cand} 柵却下=${r.A && r.A.dup}/${r.B && r.B.dup}`);
    }
    const rq = runCase({ a: s.aU, e: s.e, P: s.P, omegaDotDegPerTime: s.wdDegPerTime, dt: DT0, orbits: 21.5, nWin: NWIN, posQuantF32: true });
    out.noise.push(Object.assign({ id: s.id, emoji: s.emoji, eps: 'f32' }, rq));
    console.error(`  ${s.emoji} Float32 丸め: A 誤差 ${ex(rq.A && rq.A.advErrDeg)} |A−B|=${ex(rq.detDiffDeg)} `
      + `生検出=${rq.A && rq.A.cand}/${rq.B && rq.B.cand} 柵却下=${rq.A && rq.A.dup}/${rq.B && rq.B.dup}`);
  }
}

// ================================================================ 集計
const fin = (z) => Number.isFinite(z);
const absMax = (arr, f) => arr.map(f).filter(fin).reduce((a, b) => Math.max(a, Math.abs(b)), 0);
out.summary = {
  rows: out.rows.length, zero: out.zero.length, sweep: out.sweep.length,
  maxAdvErrRelA: absMax(out.rows, (r) => r.A && r.A.advErrRel),
  maxAdvErrRelB: absMax(out.rows, (r) => r.B && r.B.advErrRel),
  maxDetDiffRelTrue: absMax(out.rows, (r) => r.detDiffRelTrue),
  maxPerErrRelA: absMax(out.rows, (r) => r.A && r.A.perErrRel),
  maxPerErrRelB: absMax(out.rows, (r) => r.B && r.B.perErrRel),
  zeroMaxBiasDeg: absMax(out.zero, (r) => r.A && r.A.advDeg),
  zeroMaxBiasPctOfObs: absMax(out.zero, (r) => r.biasAsPctOfObs),
  fenceRejectTotal: out.rows.concat(out.zero, out.sweep)
    .reduce((s, r) => s + ((r.A ? r.A.dup + r.A.jump : 0) + (r.B ? r.B.dup + r.B.jump : 0)), 0),
  unmeasured: out.rows.concat(out.zero, out.sweep).filter((r) => !r.A || !r.B).length,
  lagMaxAdvErrRelA: absMax(out.lag, (r) => r.A && r.A.advErrRel),
  lagMaxDetDiffRelTrue: absMax(out.lag, (r) => r.detDiffRelTrue),
  noiseMaxDetDiffRelTrue: absMax(out.noise, (r) => r.detDiffRelTrue),
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error('[w256d-det] 集計 ' + JSON.stringify(out.summary));
console.error('[w256d-det] → ' + path.relative(ROOT, OUT));

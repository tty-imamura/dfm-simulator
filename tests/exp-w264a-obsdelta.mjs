// 第264便a(第56報 W1・統括の裁定 X4)「**採用レコードと『判定に使う解』の差の表**」。
//
// ■ この器が答える 1 つの問い
//   第263便c は系ごとに「判定に使う解」を**宣言**した(docs/CALIBRATION_VERDICT_v1.44.md §5.8.5)が、
//   **builder の入力(bodies の m・初期条件)がどちらの解から来ているか**は文章で書いてあるだけだった。
//   —— 本器は **プリセットの質量を CSV の各解の行と機械的に突き合わせて**、
//   「この preset の baseMass はどの解と一致するか」を**数で**決める。**builder は 1 bit も変えない**
//   (署名が動く便は第265便 —— 本便は差の表までである)。
//
// ■ 出すもの
//   ① 系 × 量(P / e / ω̇)の「採用レコード」と「判定に使う解」の値・σ・差(σ 倍)。
//   ② 質量(パルサー・伴星)の両解の値と差(σ 倍)。
//   ③ **builder 入力の出どころ**: preset の `massCalibration.baseMass`(無ければ bodies の m)を
//      CSV の各解の質量へ**相対差で突き合わせ**、最も近い解を `matchedSolution` として返す。
//      一致が 10⁻⁶ より粗ければ `matched:false`(黙って「この解だ」と書かない)。
//   ④ 初期条件(遠点分離・遠点速度)は preset の宣言をそのまま転記する(出どころの宣言は obsCard 側)。
//
// 実行: node tests/exp-w264a-obsdelta.mjs
// 出力: tests/out/obsdelta-w264a.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const OUT = path.join(ROOT, 'tests', 'out', 'obsdelta-w264a.json');

const SYSTEMS = [
  { id: 'psrDoubleABDFM', emoji: '⚡', label: 'J0737−3039A/B', csvBody: 'PSR J0737-3039 B',
    massBodies: ['PSR J0737-3039 A', 'PSR J0737-3039 B'], judge: 'Kramer2021-DDS' },
  { id: 'psrJ1757DFM', emoji: '🧮', label: 'J1757−1854', csvBody: 'PSR J1757-1854',
    massBodies: ['PSR J1757-1854', 'PSR J1757-1854 companion'], judge: 'Singha2026-DDH' },
  { id: 'psrJ1946DFM', emoji: '🩺', label: 'J1946+2052', csvBody: 'PSR J1946+2052',
    massBodies: ['PSR J1946+2052', 'PSR J1946+2052 companion'], judge: 'Meng2025-DDFWHE' },
  { id: 'psrB1534DFM', emoji: '🧶', label: 'B1534+12', csvBody: 'PSR B1534+12',
    massBodies: ['PSR B1534+12', 'PSR B1534+12 companion'], judge: 'Fonseca2014-DDGR' },
];

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
const ROWS = (() => {
  const txt = fs.readFileSync(path.join(ROOT, 'paper', 'data', 'solar-observations.csv'), 'utf8');
  const r = [];
  for (const line of txt.split('\n')) {
    if (!line.trim() || line.startsWith('body,')) continue;
    const c = parseCsvLine(line);
    const sg = (c[8] !== undefined && c[8].trim() !== '') ? Number(c[8]) : null;
    const note = String(c[7] || '');
    const sol = (note.match(/solution=([A-Za-z0-9+_-]+)/) || [null, null])[1];
    r.push({ body: c[0], quantity: c[1], value: Number(c[2]), unit: c[3], source: String(c[4]),
      note, solution: sol, sigma: (Number.isFinite(sg) && sg > 0) ? sg : null });
  }
  return r;
})();
const first = (b, q) => ROWS.find((r) => r.body === b && r.quantity === q) || null;
const bySol = (b, q, s) => ROWS.find((r) => r.body === b && r.quantity === q && r.solution === s) || null;
const sols = (b, q) => ROWS.filter((r) => r.body === b && r.quantity === q && r.solution);
const toSec = (r) => (!r ? null : (r.unit === 's' ? r.value : (r.unit === 'd' ? r.value * 86400 : null)));
const sigSec = (r) => (!r || r.sigma === null ? null
  : (r.unit === 's' ? r.sigma : (r.unit === 'd' ? r.sigma * 86400 : null)));

// ---- プリセットの baseMass と初期条件をページから読む(**読むだけ**)
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
const pg = await browser.newPage();
await pg.goto('file://' + path.join(ROOT, TARGET), { waitUntil: 'load' });
await pg.waitForFunction(() => window.HP && HP.sim);
const decl = await pg.evaluate((ids) => ids.map((id) => {
  const p = HP.allPresets().find((q) => q.id === id);
  if (!p) return { id, missing: true };
  const mc = p.massCalibration || null;
  return { id, emoji: p.emoji,
    baseMass: (mc && Array.isArray(mc.baseMass)) ? mc.baseMass.slice() : null,
    bodyMass: p.bodies.map((b) => b.m), factor: mc ? mc.factor : null, law: mc ? mc.law : null,
    scaleExp: p.scaleExp,
    initial: p.bodies.map((b) => ({ x: b.x, y: b.y, vx: b.vx, vy: b.vy, radius: b.radius,
      hasCore: !!b.core, coreMassFrac: b.core ? b.core.massFrac : null })),
    separation: Math.hypot(p.bodies[1].x - p.bodies[0].x, p.bodies[1].y - p.bodies[0].y),
    vRel: Math.hypot(p.bodies[1].vx - p.bodies[0].vx, p.bodies[1].vy - p.bodies[0].vy),
    kFrame: p.physics.kFrame, geoPN: p.physics.geoPN, sampleClass: p.sampleClass };
}), SYSTEMS.map((s) => s.id));
await browser.close();

const out = { meta: { wave: '第264便a(X4)', target: TARGET,
  claim: '**builder は 1 bit も変えない**(署名が動く便は別便)。本表は差と出どころだけである。',
  massMatchRule: '相対差 ≤10⁻⁶ で一致とみなす。それより粗ければ `matched:false`(推測で当てない)。' },
  systems: [] };

const MSUN = null;  // 太陽質量は使わない(CSV は kg で持っている)
for (const sys of SYSTEMS) {
  const d = decl.find((z) => z.id === sys.id) || {};
  const rec = { id: sys.id, emoji: sys.emoji, label: sys.label, judge: sys.judge,
    kFrame: d.kFrame, geoPN: d.geoPN, sampleClass: d.sampleClass, quantities: [], masses: [],
    builder: { baseMassPreset: d.baseMass, bodyMass: d.bodyMass, factor: d.factor, law: d.law,
      separation: d.separation, vRel: d.vRel, initial: d.initial, scaleExp: d.scaleExp } };
  out.systems.push(rec);
  // ① P / e / ω̇
  for (const [kind, q] of [['P', 'orbital_period'], ['e', 'eccentricity'], ['omegaDot', 'periastron_advance']]) {
    const a = first(sys.csvBody, q), j = bySol(sys.csvBody, q, sys.judge);
    const va = (q === 'orbital_period') ? toSec(a) : (a ? a.value : null);
    const vj = (q === 'orbital_period') ? toSec(j) : (j ? j.value : null);
    const sa = (q === 'orbital_period') ? sigSec(a) : (a ? a.sigma : null);
    const sj = (q === 'orbital_period') ? sigSec(j) : (j ? j.sigma : null);
    const diff = (Number.isFinite(va) && Number.isFinite(vj)) ? vj - va : null;
    rec.quantities.push({ kind, quantity: q,
      adopted: a ? { value: va, sigma: sa, source: a.source.slice(0, 60) } : null,
      judge: j ? { value: vj, sigma: sj, source: j.source.slice(0, 60) } : null,
      diff, diffPct: (diff !== null && va) ? diff / va * 100 : null,
      // σ 倍は**両側の σ のうち小さいほう**(厳しい側)で出す。片方しか無ければそれを使う
      sigmaUsed: (sa && sj) ? Math.min(sa, sj) : (sa || sj || null),
      diffSigma: (diff !== null && ((sa && sj) ? Math.min(sa, sj) : (sa || sj)))
        ? diff / ((sa && sj) ? Math.min(sa, sj) : (sa || sj)) : null,
      // **どちらの σ で割るかで桁が変わる**ので両方を出す(§5.8.5 は採用レコード側の σ を使っている)
      diffSigmaAdopted: (diff !== null && sa) ? diff / sa : null,
      diffSigmaJudge: (diff !== null && sj) ? diff / sj : null,
      sigmaMissing: !(sa || sj) });
  }
  // ② 質量
  for (const mb of sys.massBodies) {
    const a = first(mb, 'mass'), j = bySol(mb, 'mass', sys.judge);
    const diff = (a && j) ? j.value - a.value : null;
    const sg = (a && a.sigma && j && j.sigma) ? Math.min(a.sigma, j.sigma) : ((a && a.sigma) || (j && j.sigma) || null);
    rec.masses.push({ body: mb,
      adopted: a ? { value: a.value, sigma: a.sigma, source: a.source.slice(0, 60) } : null,
      judge: j ? { value: j.value, sigma: j.sigma, source: j.source.slice(0, 60) } : null,
      diff, diffPct: (diff !== null && a) ? diff / a.value * 100 : null,
      diffSigma: (diff !== null && sg) ? diff / sg : null, sigmaMissing: !sg });
  }
  // ③ builder 入力の出どころ(**機械的に突き合わせる**)
  // preset の質量は sim 単位(scaleExp.M)なので kg へ戻す
  const kgPerUnit = d.scaleExp ? Math.pow(10, Number(d.scaleExp.M)) : null;
  const base = d.baseMass || d.bodyMass || null;
  const cand = [];
  if (base && kgPerUnit) {
    const kg = base.map((m) => m * kgPerUnit);
    const options = [{ tag: 'adopted(CSV の最初の行)', rows: sys.massBodies.map((b) => first(b, 'mass')) }];
    const solTags = new Set();
    for (const b of sys.massBodies) for (const r of sols(b, 'mass')) solTags.add(r.solution);
    for (const t of solTags) options.push({ tag: t, rows: sys.massBodies.map((b) => bySol(b, 'mass', t)) });
    for (const o of options) {
      if (!o.rows.every((r) => r && Number.isFinite(r.value))) continue;
      const rel = o.rows.map((r, i) => Math.abs(kg[i] - r.value) / r.value);
      cand.push({ tag: o.tag, relDiff: rel, maxRel: Math.max(...rel),
        csvKg: o.rows.map((r) => r.value) });
    }
    cand.sort((x, y) => x.maxRel - y.maxRel);
  }
  rec.builderSource = { presetBaseMassKg: (base && kgPerUnit) ? base.map((m) => m * kgPerUnit) : null,
    candidates: cand, matchedSolution: cand.length ? cand[0].tag : null,
    matched: cand.length ? cand[0].maxRel <= 1e-6 : false,
    maxRel: cand.length ? cand[0].maxRel : null,
    judgeDeclared: sys.judge,
    mixed: cand.length ? (cand[0].tag !== sys.judge) : null,
    note: '**判定に使う解と builder 入力が別の解なら `mixed:true`**(第263便c が文章で書いた混在を'
      + '機械で確かめたもの)。builder は本便で変えていない。' };
  console.error(`  ${sys.emoji} ${sys.label}: builder 入力 ≈ ${rec.builderSource.matchedSolution}`
    + `(maxRel=${rec.builderSource.maxRel === null ? '—' : rec.builderSource.maxRel.toExponential(2)}`
    + `・一致=${rec.builderSource.matched})・判定に使う解=${sys.judge}・混在=${rec.builderSource.mixed}`);
  for (const q of rec.quantities) {
    console.error(`     ${q.kind}: 採用=${q.adopted ? q.adopted.value : '—'} / 判定解=${q.judge ? q.judge.value : '—'}`
      + ` 差=${q.diff === null ? '—' : q.diff.toExponential(3)}`
      + ` (採用σ ${q.diffSigmaAdopted === null ? "—" : q.diffSigmaAdopted.toFixed(3)}σ / 判定解σ ${q.diffSigmaJudge === null ? "—" : q.diffSigmaJudge.toFixed(3)}σ)`);
  }
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error('[w264a-obsdelta] wrote ' + OUT);

// 第265便d(第57報 W4・統括の裁定 Z10): **判定に使う出典の宣言(太陽系)**の会計器。
//
// ■ 何をするか(**値は 1 つも動かさない**)
//   第264便d が数えた **食い違い 30 組**(`tests/exp-w264d-intakeA.mjs` の `collate` の
//   「食い違い」)について、**どの行を「正(judgement source)」とし、どれを「候補」とするか**を
//   **宣言表**として持ち、それが `paper/data/solar-observations.csv` の実体と合っているかを数える。
//
// ■ 宣言の規則(**先に書いて、例外を作らない**)
//   ① **正** = 一次資料の解(査読論文の表・IERS/JPL の解の表)で、**宣言した量の定義**
//      (慣性系・sidereal・varpi)と合うもの。
//   ② **候補** = ファクトシート(NSSDC 等の丸めた compilation・1σ 非公表)・Wikipedia・
//      同じ一次資料の別版・**定義が違う行**(equinox-of-date の varpi̇ 等)・値が空の記録行。
//   ③ 統括が名指しした 2 件(Z10)は①と同じ向きである:
//      カロン P は **Buie et al. 2012** を正・2006 と NSSDC は候補 / 地球 P は **IERS** を正・NSSDC は候補。
//
// ■ **この器がしないこと**
//   ・CSV の値・σ・`sigma_primary` の印を 1 文字も動かさない(宣言表は**別の層**である)。
//   ・門の行選択を差し替えない —— 現行の器(`tests/exp-w249b-calaudit.mjs`)は
//     **ファイル順の最初の行**を採る。本器は「宣言した正」と「現行が採る行」が**食い違う組**を
//     数えて出すだけである(差し替えは判定を動かすので、統括の裁定を待つ)。
//   ・**「太陽系の σ が揃った」「判定が動いた」とは書かない**(4 値は 1 本も動いていない)。
//
// 実行: node tests/exp-w265d-srcdecl.mjs
// 出力: tests/out/srcdecl-w265d.json(+ Markdown 表を標準出力へ)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readSigmaMark, readVerifiedBy } from './lib-w264d-sigmamark.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CSV = path.join(ROOT, 'paper', 'data', 'solar-observations.csv');
const OUT = path.join(ROOT, 'tests', 'out', 'srcdecl-w265d.json');

function parseCsvLine(line) {
  const c = []; let cur = '', q = false;
  for (const ch of line) {
    if (q) { if (ch === '"') q = false; else cur += ch; }
    else if (ch === '"') q = true;
    else if (ch === ',') { c.push(cur); cur = ''; }
    else cur += ch;
  }
  c.push(cur);
  return c;
}
const rows = [];
{
  const lines = fs.readFileSync(CSV, 'utf8').split('\n');
  let ln = 0;
  for (const L of lines) {
    ln++;
    if (!L.trim() || L.startsWith('body,')) continue;
    const c = parseCsvLine(L);
    if (c.length < 9) continue;
    rows.push({ ln, body: c[0], quantity: c[1], value: c[2], unit: c[3], source: c[4],
      note: c[7] || '', sigma: (c[8] || '').trim() });
  }
}

// ---- 宣言表(Z10)。`primary` は**出典の部分一致キー**で、`why` は上の規則のどれを使ったか。
//      `candidates` は同じ量の他の行の出典キー(**値は動かさない**)。
const DECL = [
  ['Moon', 'orbital_period', 'JPL SSD Planetary Satellite Mean Elements', '①解の表',
    ['NASA NSSDC Moon Fact Sheet', 'IERS Conventions Delaunay arguments'],
    'IERS Delaunay の行は equinox-of-date を含む**定義違い**なので候補に置く'],
  ['Moon', 'eccentricity', 'JPL SSD Planetary Satellite Mean Elements', '①解の表',
    ['NASA NSSDC Moon Fact Sheet'], ''],
  ['Mercury', 'orbital_period', 'JPL SSD Approximate Positions of the Planets', '①解の表',
    ['NASA NSSDC Mercury Fact Sheet'], ''],
  ['Mercury', 'eccentricity', 'JPL SSD Approximate Positions of the Planets', '①解の表',
    ['NASA NSSDC Mercury Fact Sheet'], ''],
  ['Mercury', 'periastron_advance', 'Park R.S. Folkner W.M.', '①査読論文の表(1σ つき)',
    ['JPL SSD Approximate Positions of the Planets'],
    'Standish の varpi̇ は equinox-of-date を含む**定義違い**'],
  ['Venus', 'eccentricity', 'JPL SSD Approximate Positions of the Planets', '①解の表',
    ['NASA NSSDC Venus Fact Sheet', 'NASA NSSDC Planetary Fact Sheet rounded compilation',
      'dfm-simulator solarInner declaration'],
    '現行の判定行はシミュレータ自身の宣言値 0.007 である(観測行ではない)'],
  ['Earth', 'orbital_period', 'IERS useful constants', '③Z10 が名指し(=①と同じ向き)',
    ['NASA NSSDCA, Earth Fact Sheet'], ''],
  ['Earth', 'eccentricity', 'JPL SSD Approximate Positions of the Planets', '①解の表',
    ['NASA NSSDCA, Earth Fact Sheet'], ''],
  ['Mars', 'orbital_period', 'JPL SSD Approximate Positions of the Planets', '①解の表',
    ['NASA NSSDC Mars Fact Sheet'], ''],
  ['Mars', 'eccentricity', 'JPL SSD Approximate Positions of the Planets', '①解の表',
    ['NASA NSSDCA, Mars Fact Sheet'], ''],
  ['Saturn ring C inner edge', 'radius', 'French et al. 2025', '①査読論文',
    ['NASA NSSDC Saturnian Rings Fact Sheet'], ''],
  ['Saturn ring feature D68', 'orbital_period', 'Hedman M.M. Burt J.A.', '①査読論文',
    ['Hedman et al. 2014, Icarus 233, 147'], '候補側は**値が空の記録行**である'],
  ['Phobos', 'orbital_period', 'Jacobson R.A. 2010 AJ 139 668 Table 6', '①査読論文の表',
    ['NASA NSSDC Mars Fact Sheet', 'NASA NSSDCA, Mars Fact Sheet', 'Wikipedia'], ''],
  ['Phobos', 'periastron_advance', 'Jacobson R.A. 2010 AJ 139 668 Table 6', '①査読論文の表',
    ['JPL Solar System Dynamics, Planetary Satellite Mean Elements'], '候補側は**値が空**'],
  ['Deimos', 'orbital_period', 'Jacobson R.A. 2010 AJ 139 668 Table 6', '①査読論文の表',
    ['NASA NSSDC Mars Fact Sheet', 'NASA NSSDCA, Mars Fact Sheet', 'user-held value 1.263 d', 'Wikipedia'], ''],
  ['Deimos', 'eccentricity', 'Jacobson R.A. 2010 AJ 139 668 Table 6', '①査読論文の表',
    ['NASA NSSDC Mars Fact Sheet', 'NASA NSSDCA, Mars Fact Sheet', 'user-held value; Jacobson', 'Wikipedia'], ''],
  ['Deimos', 'periastron_advance', 'Jacobson R.A. 2010 AJ 139 668 Table 6', '①査読論文の表',
    ['JPL Solar System Dynamics, Planetary Satellite Mean Elements'], '候補側は**値が空**'],
  ['Charon', 'orbital_period', 'Buie M.W. Tholen D.J. Grundy W.M. 2012', '③Z10 が名指し(=①と同じ向き)',
    ['Buie et al. 2006', 'NASA NSSDC Pluto Fact Sheet'],
    '2006 は外部確認印つきの候補(`value_checked_by` — `sigma_primary` は unverified のまま)'],
  ['Miranda', 'eccentricity', 'Jacobson R.A. 2014 AJ 148 76 Table 2', '①査読論文の表',
    ['NASA NSSDC Uranian Satellite Fact Sheet'], ''],
  ['Miranda', 'periastron_advance', 'Jacobson R.A. 2014 AJ 148 76 Table 2', '①査読論文の表',
    ['JPL Solar System Dynamics, Planetary Satellite Mean Elements'], '候補側は**値が空**'],
  ['Ariel', 'eccentricity', 'Jacobson R.A. 2014 AJ 148 76 Table 2', '①査読論文の表',
    ['NASA NSSDC Uranian Satellite Fact Sheet'], ''],
  ['Ariel', 'periastron_advance', 'Jacobson R.A. 2014 AJ 148 76 Table 2', '①査読論文の表',
    ['JPL Solar System Dynamics, Planetary Satellite Mean Elements'], '候補側は**値が空**'],
  ['Umbriel', 'eccentricity', 'Jacobson R.A. 2014 AJ 148 76 Table 2', '①査読論文の表',
    ['NASA NSSDC Uranian Satellite Fact Sheet'], ''],
  ['Umbriel', 'periastron_advance', 'Jacobson R.A. 2014 AJ 148 76 Table 2', '①査読論文の表',
    ['JPL Solar System Dynamics, Planetary Satellite Mean Elements'], '候補側は**値が空**'],
  ['Titania', 'eccentricity', 'Jacobson R.A. 2014 AJ 148 76 Table 2', '①査読論文の表',
    ['NASA NSSDC Uranian Satellite Fact Sheet'], ''],
  ['Titania', 'periastron_advance', 'Jacobson R.A. 2014 AJ 148 76 Table 2', '①査読論文の表',
    ['JPL Solar System Dynamics, Planetary Satellite Mean Elements'], '候補側は**値が空**'],
  ['Oberon', 'periastron_advance', 'Jacobson R.A. 2014 AJ 148 76 Table 2', '①査読論文の表',
    ['JPL Solar System Dynamics, Planetary Satellite Mean Elements'], '候補側は**値が空**'],
  ['Triton', 'orbital_period', 'JPL SSD Planetary Satellite Mean Elements', '①解の表',
    ['NASA NSSDC Neptunian Satellite Fact Sheet', 'user-held value 5.876854 d'], ''],
  ['Triton', 'eccentricity', 'Jacobson R.A. 2009 AJ 137 4322 Table 6', '①査読論文の表',
    ['NASA NSSDC Neptunian Satellite Fact Sheet', 'user-held value; Jacobson 2009'], ''],
  ['Triton', 'periastron_advance', 'Jacobson R.A. 2009 AJ 137 4322 Table 6', '①査読論文の表',
    ['JPL Solar System Dynamics, Planetary Satellite Mean Elements'], '候補側は**値が空**']
];

const out = [];
let missing = 0, gateMismatch = 0, sigmaRows = 0;
for (const [body, quantity, primary, why, cands, note] of DECL) {
  const mine = rows.filter((r) => r.body === body
    && (r.quantity === quantity || r.quantity === quantity + '_candidate'));
  const prim = mine.filter((r) => r.source.indexOf(primary) >= 0);
  // 現行の器が実際に採る行 = **ファイル順の最初の `body|quantity`**(`_candidate` は別の鍵)
  const gate = rows.find((r) => r.body === body && r.quantity === quantity) || null;
  const gateIsPrimary = !!(gate && prim.length && gate.ln === prim[0].ln);
  if (!prim.length) missing++;
  if (!gateIsPrimary) gateMismatch++;
  const sig = prim.length ? prim[0].sigma : '';
  if (sig) sigmaRows++;
  out.push({ body, quantity, why, note,
    primarySource: primary,
    primaryRow: prim.length ? { ln: prim[0].ln, quantity: prim[0].quantity, value: prim[0].value,
      sigma: prim[0].sigma || null, mark: readSigmaMark(prim[0].note).mark,
      verifiedBy: readVerifiedBy(prim[0].note).present } : null,
    candidates: cands.map((k) => {
      const r = mine.find((z) => z.source.indexOf(k) >= 0);
      return { key: k, ln: r ? r.ln : null, value: r ? r.value : null, sigma: r ? (r.sigma || null) : null };
    }),
    gateRow: gate ? { ln: gate.ln, value: gate.value, source: gate.source.slice(0, 48) } : null,
    gateIsPrimary });
}

const R = { wave: '第265便d', at: new Date().toISOString(), rule: 'Z10',
  n: out.length, primaryMissing: missing, gateMismatch, primaryWithSigma: sigmaRows,
  gateRule: '現行の器はファイル順の最初の `body|quantity` を採る(行選択は本便では差し替えない)',
  doNotWrite: ['太陽系の σ が揃った', '判定(4 値)が動いた', '出典を宣言したので合格が増えた'],
  rows: out };
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(R, null, 2));

console.log('[w265d] 判定に使う出典の宣言(太陽系・Z10)');
console.log('  食い違い ' + out.length + ' 組 / 宣言した正が CSV に無い ' + missing
  + ' / **現行の器が採る行 ≠ 宣言した正** ' + gateMismatch + ' 組 / 正が 1σ を持つ ' + sigmaRows + ' 組');
console.log('');
console.log('| 天体 | 量 | 正(judgement source) | 正の値 | 1σ | 候補 | 現行の器の行と一致 |');
console.log('|---|---|---|---:|---:|---|---|');
for (const z of out) {
  console.log('| ' + z.body + ' | ' + z.quantity + ' | ' + z.primarySource + ' | '
    + (z.primaryRow ? z.primaryRow.value : '—') + ' | '
    + (z.primaryRow && z.primaryRow.sigma ? z.primaryRow.sigma : '—') + ' | '
    + z.candidates.map((c) => c.key.slice(0, 26) + (c.value !== null && c.value !== '' ? ' ' + c.value : '(空)')).join(' / ')
    + ' | ' + (z.gateIsPrimary ? '一致' : '**不一致**') + ' |');
}
console.log('→ ' + OUT);

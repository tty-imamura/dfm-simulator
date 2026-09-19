// 第273便e(第63報・AH25 の材料 —— **実装しない・値を作らない**):
//   ✨ α Cen AB(`alphaCenAB`)と 🌟 Sirius AB(`siriusAB`)の **ω̇(近点移動の速さ)**が、
//   観測 CSV に**行としても σ としても無い**ことを機械で確かめる器。
//
// ■ なぜ要るか
//   この 2 系は「量限定合」であり、通っているのは**公転周期**(と第262便c の e 写像の量)だけである。
//   ω̇ を判定に載せるなら**観測行と 1σ が要る**が、現行 CSV には無い。無いことを**文章ではなく器で**
//   固定しておくと、「ω̇ が無いのに判定に使った」事故を後から検出できる。
//
// ■ 何を見るか(**値は 1 つも作らない**)
//   ① 2 系(と構成星)の行を全部並べ、**速さの量**(`periastron_advance` / `apsidal_period` /
//      `…_rate` / `…_advance_derived`)が 1 行も無いことを数える。
//   ② `longitude_of_periastron`(元期での ω)と `epoch_of_periastron`(近点通過期)は**在る**が、
//      これらは**角度と時刻であって速さではない**。**微分して ω̇ を作ってはならない**
//      (1 元期の値から速さは出ない)。
//   ③ その系の軌道要素を転写した**出典の表**を列挙する(ω̇ を探すならまずこの表である)。
//      **その表に ω̇ が印字されているかどうかは、この器では分からない**(CSV は転写であり、
//      転写されていないことは「表に無い」ことを意味しない)。**出典候補は候補のままにする。**
//
// ■ この器がしないこと
//   ・ω̇ の値を作らない・推定しない・文献値を書かない。判定(4 値)に触らない。
//   ・「ω̇ が無いから合わない」「ω̇ を足せば合う」とは書かない。
//
// 実行: node tests/exp-w273e-ah25.mjs
// 出力: tests/out/ah25-w273e.json(**正本ではない** —— 報告のための材料)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadObsCsv } from './lib-w270b-obscsv.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'tests', 'out', 'ah25-w273e.json');

const CSV_FILES = ['solar-observations.csv', 'cluster-galaxy-observations.csv',
  'transient-observations.csv', 'supernova-observations.csv', 'jovian-satellites.csv'];
/** ✨🌟 の系と、その構成星(同じ表から来た行を取りこぼさないため)。 */
const SYSTEMS = [
  { icon: '✨', preset: 'alphaCenAB', bodies: ['Alpha Centauri AB', 'Alpha Centauri A', 'Alpha Centauri B'] },
  { icon: '🌟', preset: 'siriusAB', bodies: ['Sirius AB', 'Sirius A', 'Sirius B'] },
];
/** **速さ**の量名(これが 1 行でもあれば ω̇ の観測行がある)。 */
const RATE_RE = /(periastron_advance|apsidal_period|apsidal_motion|_rate$|precession)/;
/** 速さ**ではない**近点まわりの量(角度・時刻)。 */
const STATIC_RE = /(longitude_of_periastron|epoch_of_periastron|argument_of_peri)/;

const all = [];
for (const f of CSV_FILES) {
  const L = loadObsCsv(path.join(ROOT, 'paper', 'data', f));
  for (const r of L.rows) { r._file = f; all.push(r); }
}

const systems = [];
for (const s of SYSTEMS) {
  const rows = all.filter((r) => s.bodies.includes(r.body));
  const rate = rows.filter((r) => RATE_RE.test(r.quantity));
  const stat = rows.filter((r) => STATIC_RE.test(r.quantity));
  const sources = [...new Set(rows.map((r) => r.source))].sort();
  systems.push({
    icon: s.icon, preset: s.preset, bodies: s.bodies,
    rows: rows.length,
    rateRows: rate.length,
    rateRowsWithSigma: rate.filter((r) => r.sigma !== null).length,
    staticAngleRows: stat.map((r) => ({ record_id: r.recordId, ln: r.ln, body: r.body,
      quantity: r.quantity, value: r.rawValue, unit: r.unit, sigma: r.rawSigma || null })),
    quantities: [...new Set(rows.map((r) => r.quantity))].sort(),
    sourceCandidates: sources,
  });
}

// 参考: 現行 CSV で ω̇ の**速さの行**を持っている天体(どんな形なら載るかの実例)
const rateBodies = {};
for (const r of all) if (RATE_RE.test(r.quantity)) {
  const k = r.body;
  if (!rateBodies[k]) rateBodies[k] = { rows: 0, withSigma: 0 };
  rateBodies[k].rows++;
  if (r.sigma !== null) rateBodies[k].withSigma++;
}

const out = {
  wave: '第273便e(第63報・AH25 の材料)',
  what: '✨🌟 の ω̇(近点移動の速さ)が観測 CSV に無いことの確認 + 出典候補の列挙',
  contract: [
    '**値を 1 つも作らない。** この器は CSV に何が在って何が無いかを数えるだけである。',
    '`longitude_of_periastron`(元期の ω)と `epoch_of_periastron`(近点通過期)は**在る**が、'
      + '**角度と時刻であって速さではない**。1 元期の値から ω̇ を作ってはならない。',
    '`sourceCandidates` は**この系の軌道要素を転写した出典**である。ω̇ を探すならまずこの表だが、'
      + '**その表に ω̇ が印字されているかはこの器では分からない**(CSV は転写であり、'
      + '転写に無いことは「表に無い」ことを意味しない)。**候補は候補のままにする。**',
    '**書かないこと**: 「ω̇ が無いから合わない」「ω̇ を足せば合う」「ω̇ を導出した」。',
  ],
  systems,
  rateBodiesInCsv: rateBodies,
  generatedAt: new Date().toISOString(),
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));

for (const s of systems) {
  console.log('[w273e-ah25] ' + s.icon + ' ' + s.preset + ': 行 ' + s.rows
    + ' / **ω̇ の速さの行 ' + s.rateRows + ' 行**(σ つき ' + s.rateRowsWithSigma + ' 行)');
  console.log('   速さでない近点まわりの行: '
    + (s.staticAngleRows.map((r) => r.body + '|' + r.quantity + '=' + r.value + ' ' + r.unit
      + '(σ ' + (r.sigma || '空') + ')').join(' / ') || 'なし'));
  console.log('   量名: ' + s.quantities.join(', '));
  console.log('   出典候補(**未確認**): ' + s.sourceCandidates.map((x) => x.slice(0, 96)).join(' | '));
}
console.log('→ ' + path.relative(ROOT, OUT));

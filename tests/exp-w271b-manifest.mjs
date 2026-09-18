// 第271便b(第61報・AB6): **実体凍結の試み** —— 外部データ表の URL・版・取得 UTC・SHA-256 を
// `paper/data/sources-manifest.json` に置く。
//
// ■ 規約(**捏造しない**)
//   ・`sha256` は**この器が実際に取得できたバイト列**からしか書かない。取得できなければ
//     `"sha256": null, "frozen": false, "reason": "<実測した失敗の理由>"` を書く。
//     **「取れなかった」は結果であって、埋めるべき穴ではない。**
//   ・依存する `record_id` は**正本の CSV から数えて**入れる(手で並べない)。
//   ・観測値・σ・印・来歴・行は 1 つも触らない(本器は CSV を**読むだけ**)。
//
// ■ 取得の判定
//   `--fetch` を付けたときだけ外に出る(既定は**取りに行かない** —— CI で毎回叩かないため)。
//   取得できたら `sha256`(hex)・`bytes`・`retrievedUtc`・`httpStatus` を書き、`frozen: true` にする。
//
// 実行: node tests/exp-w271b-manifest.mjs [--fetch] [--write]
// 出力: tests/out/manifest-w271b.json(`--write` で paper/data/sources-manifest.json も)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadObsCsv } from './lib-w270b-obscsv.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const FETCH = argv.indexOf('--fetch') >= 0;
const WRITE = argv.indexOf('--write') >= 0;
const OUT = path.join(ROOT, 'tests', 'out', 'manifest-w271b.json');
const MANIFEST = path.join(ROOT, 'paper', 'data', 'sources-manifest.json');
const bad = [];

const CLUSTER = loadObsCsv(path.join(ROOT, 'paper', 'data', 'cluster-galaxy-observations.csv'));
const SOLAR = loadObsCsv(path.join(ROOT, 'paper', 'data', 'solar-observations.csv'));
const ALL = CLUSTER.rows.concat(SOLAR.rows);

// ---------------------------------------------------------------- 凍結したい実体(**宣言表**)
// `match` は**正本の `source` 欄**に対する述語である(note の中の言及は数えない —— 言及は依存ではない)。
const ENTITIES = [
  { id: 'SPARC-MassModels-Lelli2016c',
    what: 'SPARC 公式リリース MassModels_Lelli2016c.mrt(NGC 3198 の R / Vobs / e_Vobs)',
    paper: 'Lelli, McGaugh & Schombert 2016, AJ 152, 157', table: 'MassModels_Lelli2016c.mrt',
    version: '2016c', url: 'http://astroweb.cwru.edu/SPARC/MassModels_Lelli2016c.mrt',
    doi: 'https://doi.org/10.3847/0004-6256/152/6/157',
    match: (r) => r.source.indexOf('MassModels_Lelli2016c.mrt') >= 0 },
  { id: 'SPARC-Table-Lelli2016c',
    what: 'SPARC 公式リリース SPARC_Lelli2016c.mrt(銀河ごとの一覧行)',
    paper: 'Lelli, McGaugh & Schombert 2016, AJ 152, 157', table: 'SPARC_Lelli2016c.mrt',
    version: '2016c', url: 'http://astroweb.cwru.edu/SPARC/SPARC_Lelli2016c.mrt',
    doi: 'https://doi.org/10.3847/0004-6256/152/6/157',
    match: (r) => r.source.indexOf('SPARC_Lelli2016c.mrt') >= 0 },
  { id: 'SPARC-site',
    what: 'SPARC の配布サイト(表を特定しない引用 —— rotmod の写しを含む)',
    paper: 'Lelli, McGaugh & Schombert 2016, AJ 152, 157', table: '(表未特定)',
    version: '(版未特定)', url: 'https://astroweb.cwru.edu/SPARC/',
    doi: 'https://doi.org/10.3847/0004-6256/152/6/157',
    match: (r) => /^SPARC \(Lelli|^SPARC fiducial|^derived interpretation of SPARC|SPARC PXL archive/
      .test(r.source) },
  { id: 'GGCD-Baumgardt-v4-parameter',
    what: 'Baumgardt Galactic Globular Cluster Database v4 parameter table(NGC 104 行)',
    paper: 'Baumgardt & Hilker 2018 ほか(データベース版 v4)', table: 'parameter.html',
    version: 'v4', url: 'https://people.smp.uq.edu.au/HolgerBaumgardt/globular/parameter.html',
    doi: 'https://doi.org/10.1093/mnras/sty1057',
    match: (r) => r.source.indexOf('Globular Cluster Database v4') >= 0 },
  { id: 'GGCD-Baumgardt-v2-parameter',
    what: 'Baumgardt Globular Cluster Database Version 2 parameter table',
    paper: 'Baumgardt & Vasiliev 2021 距離を含む版', table: 'newdata/parameter.html',
    version: 'Version 2',
    url: 'https://people.smp.uq.edu.au/HolgerBaumgardt/globular/newdata/parameter.html',
    doi: null,
    match: (r) => r.source.indexOf('Globular Cluster Database Version 2') >= 0 },
  { id: 'GGCD-Baumgardt-veldis',
    what: 'Baumgardt 速度分散表(NGC 104 行・Type=RV bins)',
    paper: 'Baumgardt & Hilker 2018 MNRAS 478 1520 系列', table: 'veldis.html',
    version: '(版未特定)', url: 'https://people.smp.uq.edu.au/HolgerBaumgardt/globular/veldis.html',
    doi: 'https://doi.org/10.1093/mnras/sty1057',
    match: (r) => r.source.indexOf('velocity-dispersion table') >= 0 },
  { id: 'GGCD-Baumgardt-ngc104-kin',
    what: 'Baumgardt V2 の個別運動学データ(ngc104_kin.txt・BH18 LOS RV 系列)',
    paper: 'Baumgardt & Hilker 2018 MNRAS 478 1520 系列', table: 'indivdata/ngc104_kin.txt',
    version: 'V2',
    url: 'https://people.smp.uq.edu.au/HolgerBaumgardt/globular/newdata/indivdata/ngc104_kin.txt',
    doi: null,
    match: (r) => r.url.indexOf('indivdata') >= 0 },
  { id: 'Harris2010-mwgc',
    what: 'Harris (1996, 2010 edition) Milky Way globular cluster catalogue',
    paper: 'Harris W.E. 1996, AJ 112, 1487(2010 edition)', table: 'mwgc.dat',
    version: '2010 edition', url: 'https://physwww.mcmaster.ca/~harris/mwgc.dat', doi: null,
    match: () => false,
    note: '**`source` 欄でこの表を引いている行は 1 つも無い**(note の本文に「Harris catalogue '
      + 'distance adopted by that table」等の言及があるだけ)。言及は依存ではないので '
      + '`dependsOn` は空である —— 凍結の対象にするかは決断事項。' },
];

// ---------------------------------------------------------------- 依存する record_id(**数えて入れる**)
for (const e of ENTITIES) {
  const hits = ALL.filter(e.match);
  e.dependsOn = hits.map((r) => r.recordId).filter(Boolean);
  e.dependsOnRows = hits.length;
  e.urlsInCsv = [...new Set(hits.map((r) => r.url))];
  if (hits.length !== e.dependsOn.length) bad.push(`${e.id}: record_id の無い行がある`);
}
// note の中だけの言及(**依存ではない**)を数える
const harrisMentions = ALL.filter((r) => r.note.indexOf('Harris') >= 0).length;

// ---------------------------------------------------------------- 取得(**取れたときだけ hash を書く**)
async function fetchOne(e) {
  const t0 = Date.now();
  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 30000);
    const res = await fetch(e.url, { signal: ctl.signal, redirect: 'follow' });
    clearTimeout(timer);
    const buf = Buffer.from(await res.arrayBuffer());
    if (!res.ok) return { frozen: false, sha256: null, bytes: null, httpStatus: res.status,
      reason: `HTTP ${res.status}(本文 ${buf.length} bytes・${buf.toString('utf8').slice(0, 120).replace(/\s+/g, ' ')})`,
      ms: Date.now() - t0 };
    return { frozen: true, sha256: crypto.createHash('sha256').update(buf).digest('hex'),
      bytes: buf.length, httpStatus: res.status, reason: null,
      retrievedUtc: new Date().toISOString(), ms: Date.now() - t0 };
  } catch (err) {
    return { frozen: false, sha256: null, bytes: null, httpStatus: null,
      reason: 'fetch が失敗した: ' + String(err && err.message || err).slice(0, 160),
      ms: Date.now() - t0 };
  }
}

const results = {};
for (const e of ENTITIES) {
  if (!FETCH || e.match === undefined) { }
  results[e.id] = FETCH ? await fetchOne(e)
    : { frozen: false, sha256: null, bytes: null, httpStatus: null,
      reason: '`--fetch` を付けずに回した(取りに行っていない)' };
}

// ---------------------------------------------------------------- マニフェスト
const manifest = {
  schemaVersion: 1,
  wave: '第271便b(2026-09-18・第61報・AB6)',
  what: '観測 CSV が引いている**外部データ表の実体**の台帳。URL・表・版・取得 UTC・SHA-256 と、'
    + 'その表に依存する `record_id` を並べる。**実体を凍結できたかどうかを正直に書く欄**である。',
  rule: [
    '`sha256` は**実際に取得できたバイト列**からしか書かない。取れなければ `sha256: null, '
      + 'frozen: false, reason: <実測した失敗の理由>` と書く(**推測のハッシュを置かない**)',
    '`dependsOn` は正本の CSV の `source` 欄から**数えて**入れる(note の中の言及は依存ではない)',
    '`frozen: false` は「この表の実体をこの環境では固定できていない」という**状態の名前**であって、'
      + '観測値が疑わしいという意味ではない',
    'この台帳は行を 1 つも書き換えない(値・σ・印・来歴は不変)',
  ],
  doNotWrite: ['出典を凍結した', '一次資料を再取得して確認した', '外部データの同定が完成した'],
  generatedBy: 'tests/exp-w271b-manifest.mjs',
  fetchAttempted: FETCH,
  fetchedAtUtc: FETCH ? new Date().toISOString() : null,
  sources: ENTITIES.map((e) => ({
    id: e.id, what: e.what, paper: e.paper, table: e.table, version: e.version,
    url: e.url, doi: e.doi, urlsInCsv: e.urlsInCsv, note: e.note || null,
    dependsOnRows: e.dependsOnRows, dependsOn: e.dependsOn,
    frozen: results[e.id].frozen, sha256: results[e.id].sha256, bytes: results[e.id].bytes,
    httpStatus: results[e.id].httpStatus,
    retrievedUtc: results[e.id].retrievedUtc || null,
    reason: results[e.id].reason,
  })),
  mentionsOnly: { 'Harris(note の本文のみ)': harrisMentions },
};
const frozen = manifest.sources.filter((s) => s.frozen).length;

if (WRITE) fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');

const out = { when: new Date().toISOString(), wave: '第271便b(2026-09-18・第61報・AB6)',
  base: 'main ef2cd45', wrote: WRITE, fetchAttempted: FETCH,
  tally: { entities: ENTITIES.length, frozen, notFrozen: ENTITIES.length - frozen,
    dependsOnRows: ENTITIES.reduce((a, e) => a + e.dependsOnRows, 0) },
  manifest, violations: bad,
  doNotWrite: manifest.doNotWrite };
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));

console.log('[w271b] 実体凍結(AB6)' + (FETCH ? '(**取得を試みた**)' : '(取りに行っていない)'));
for (const s of manifest.sources)
  console.log('  ' + s.id.padEnd(30) + ' 依存 ' + String(s.dependsOnRows).padStart(3) + ' 行 / '
    + (s.frozen ? ('sha256 ' + s.sha256.slice(0, 16) + '… (' + s.bytes + ' bytes)')
      : ('**未凍結** —— ' + String(s.reason).slice(0, 96))));
console.log('  凍結できた実体: ' + frozen + '/' + ENTITIES.length
  + ' / note の中だけの言及(依存ではない): Harris ' + harrisMentions + ' 行');
if (bad.length) console.log('  **違反 ' + bad.length + ' 件**: ' + bad.slice(0, 5).join(' , '));
console.log('→ ' + path.relative(ROOT, OUT) + (WRITE ? ' / paper/data/sources-manifest.json' : ''));

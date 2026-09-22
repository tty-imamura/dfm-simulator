// 第277便a(第67報 (1)・統括の検証項目 R47): **冥王星系の状態ファイルの整合検査と「別の量」の診断**。
//
// 入力は `paper/data/pluto-system-states.csv`(取得依頼 C の回答・2 系統の外部調査の転写)と
// `paper/data/solar-observations.csv`(GM の宣言行)だけである。**エンジンを 1 步も走らせない**。
//
// 何を出すか:
//   ① 整合検査: 72 成分(6 体 × 2 元期 × 6 成分)・単位・sigma 全空・record_id 一意。
//   ② **2D へ移すときの面外成分**: 冥王星–カロンの相対軌道面を基底にして 6 体を射影し、
//      面外成分(e3 方向)の最大値を出す(**z を捨てない**ことを数で示す)。
//   ③ **R47 の「別の量」**: 同じ暦・同じ元期から作った相対二体の a と P、重心基準の
//      osculating a と PR、Buie 2012 の two-body P、PLU060 の 400 年平均 P を**並べる**。
//      **どれも採用値ではない**。合否も σ も作らない。
//
// 実行: node tests/exp-w277a-plutostates.mjs
// 出力: tests/out/plutostates-w277a.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadPlutoStates, checkPlutoStates, stateOf, projectToOrbitPlane, projectAll,
  relativeTwoBody, gmFromAP, BODIES, EPOCHS } from './lib-w277a-plutostates.mjs';
import { loadObsCsv } from './lib-w270b-obscsv.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STATES_REL = 'paper/data/pluto-system-states.csv';
const OBS_REL = 'paper/data/solar-observations.csv';
const OUT = path.join(ROOT, 'tests', 'out', 'plutostates-w277a.json');

const L = loadPlutoStates(path.join(ROOT, STATES_REL));
const chk = checkPlutoStates(L);

// ---------------------------------------------------------------- GM は**宣言された入力**
// 丸めた GM(km³/s²)。**この器は GM を較正しない**(どこから採ったかを note に残す)。
const GM_DECL = {
  'PLU060-2024': { pluto: 869.3, charon: 106.1,
    from: 'Brozovic & Jacobson 2024 AJ 167 256 Table 8 (Current Work) / JPL SSD PLU060' },
  'PLU043-2015': { pluto: 869.6, charon: 105.9,
    from: 'Brozovic et al. 2015 Icarus 246 317 (abstract)' },
};

const outOfPlane = [], twoBody = [], projections = [];
for (const ep of EPOCHS) {
  const st = {};
  for (const b of BODIES) st[b] = stateOf(L, b, ep);
  const missing = BODIES.filter((b) => !st[b]);
  if (missing.length) { outOfPlane.push({ epoch: ep, missing }); continue; }
  // 相対状態(カロン − 冥王星)が軌道面を決める
  const rel = { r: [st.Charon.r[0] - st.Pluto.r[0], st.Charon.r[1] - st.Pluto.r[1],
    st.Charon.r[2] - st.Pluto.r[2]],
  v: [st.Charon.v[0] - st.Pluto.v[0], st.Charon.v[1] - st.Pluto.v[1],
    st.Charon.v[2] - st.Pluto.v[2]] };
  const single = projectToOrbitPlane(rel.r, rel.v);
  const all = projectAll(BODIES.map((b) => ({ body: b, r: st[b].r, v: st[b].v })), rel);
  projections.push({ epoch: ep,
    relativePlane: { posOutOfPlane: single.posOutOfPlane, velOutOfPlane: single.velOutOfPlane,
      note: '基準そのものは定義上 e3 成分が 0(丸め誤差だけが残る)' },
    rows: all.rows.map((x) => ({ body: x.body, posOutOfPlane: x.posOutOfPlane,
      velOutOfPlane: x.velOutOfPlane })),
    maxOutOfPlaneKm: all.maxOutOfPlane });
  outOfPlane.push({ epoch: ep, maxOutOfPlaneKm: all.maxOutOfPlane,
    worst: all.rows.slice().sort((a, b) => Math.abs(b.posOutOfPlane) - Math.abs(a.posOutOfPlane))[0].body });
  for (const [sol, g] of Object.entries(GM_DECL)) {
    const GM = g.pluto + g.charon;
    const tb = relativeTwoBody(st.Pluto, st.Charon, GM);
    twoBody.push({ epoch: ep, solution: sol, GMsum: GM, GMfrom: g.from,
      separationKm: tb.separation, semiMajorAxisKm: tb.semiMajorAxis,
      periodSec: tb.periodSec, eccentricity: tb.eccentricity,
      note: '診断(採用値ではない): 丸めた GM の宣言値から作った相対二体の a と P である' });
  }
}

// ---------------------------------------------------------------- 「別の量」の並び(R47)
const oscRows = L.rows.filter((r) => r.quantity === 'semi_major_axis_osculating'
  || r.quantity === 'sidereal_period_osculating');
const pick = (q, ep) => { const h = oscRows.find((r) => r.quantity === q && r.epoch === ep);
  return h ? h.value : null; };
const OBS = loadObsCsv(path.join(ROOT, OBS_REL));
const buie = OBS.rows.find((r) => r.body === 'Charon' && r.quantity === 'orbital_period_candidate'
  && r.source.indexOf('Buie M.W. Tholen D.J. Grundy W.M. 2012') === 0) || null;
const mean400 = OBS.rows.find((r) => r.body === 'Charon' && r.quantity === 'sidereal_period'
  && r.source.indexOf('Brozovic M. & Jacobson R.A. 2024') === 0) || null;
const aMean400 = OBS.rows.find((r) => r.body === 'Charon' && r.quantity === 'semi_major_axis_candidate'
  && r.source.indexOf('Brozovic M. & Jacobson R.A. 2024') === 0) || null;

const aOscA = pick('semi_major_axis_osculating', EPOCHS[0]);
const prA = pick('sidereal_period_osculating', EPOCHS[0]);
const prB = pick('sidereal_period_osculating', EPOCHS[1]);
const quantities = [
  { name: 'two-body Keplerian sidereal period (Buie 2012 の採用解)',
    periodSec: buie ? buie.value : null, sigmaSec: buie ? buie.sigma : null,
    what: '観測検定に使う行(HST 1992-2010・e を 0 に固定した二体当てはめ)' },
  { name: 'PLU060 の 1800-2200 平均 osculating 周期',
    periodSec: mean400 ? mean400.value : null, sigmaSec: null,
    what: '暦の再現(同一暦の内部一貫性)であって観測検定ではない' },
  { name: 'Horizons osculating PR(元期 A)', periodSec: prA, sigmaSec: null,
    what: '1 元期の osculating 値 — 元期を変えれば変わる' },
  { name: 'Horizons osculating PR(元期 B)', periodSec: prB, sigmaSec: null,
    what: '1 元期の osculating 値 — 元期 A と違う' },
];
const rel0 = twoBody.find((t) => t.epoch === EPOCHS[0] && t.solution === 'PLU060-2024') || null;
const separations = {
  relativeSemiMajorAxisKm: rel0 ? rel0.semiMajorAxisKm : null,
  relativePeriodSec: rel0 ? rel0.periodSec : null,
  barycentricOsculatingAKm: aOscA,
  meanOsculating1800_2200Km: aMean400 ? aMean400.value / 1000 : null,
  gmFrom_a_and_PR: (aOscA !== null && prA !== null) ? gmFromAP(aOscA, prA) : null,
  note: '重心基準の osculating a(17464 km 前後)と相対 a(19596 km 前後)は**別の量**である。'
    + '4π²a³/PR² は重心基準の a と PR から作った量で、GM の合計(975.4 km³/s²)とは別の数になる。'
    + '**どれも採用値ではない**',
};

const out = {
  meta: provenanceMeta({ root: ROOT,
    wave: '第277便a(第67報 (1)・統括の検証項目 R47)',
    target: STATES_REL,
    code: ['tests/exp-w277a-plutostates.mjs', 'tests/lib-w277a-plutostates.mjs',
      'tests/lib-w270b-obscsv.mjs', 'tests/lib-w272e-provenance.mjs'],
    inputs: [STATES_REL, OBS_REL] }),
  what: '冥王星系の状態ファイル(取得依頼 C の回答・2 系統の外部調査)の整合検査と「別の量」の診断',
  integrity: { ok: chk.ok, problems: chk.problems, tally: chk.tally },
  outOfPlane,
  projections,
  twoBody,
  quantities,
  separations,
  doNotWrite: ['較正した', '観測と合った', '残差が消えた', 'kF0 版が成立した',
    'この a と P を採用値にした', 'σ を作った'],
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log('[w277a] 整合検査 ' + (chk.ok ? 'ok' : 'NG(' + chk.problems.length + ' 件)')
  + ' / 行 ' + chk.tally.rows + '(状態 ' + chk.tally.stateRows + ' / その他 ' + chk.tally.otherRows + ')'
  + ' / 欠け ' + chk.tally.missingCells + ' / 重複セル ' + chk.tally.duplicatedCells
  + ' / sigma 列の非空 ' + chk.tally.rowsWithSigma);
for (const p of chk.problems.slice(0, 6)) console.log('  ! ' + p);
for (const o of outOfPlane) console.log('  面外最大 ' + o.epoch + ': '
  + (o.maxOutOfPlaneKm === undefined ? '—' : o.maxOutOfPlaneKm.toFixed(3)) + ' km(' + o.worst + ')');
for (const t of twoBody) console.log('  相対二体 ' + t.epoch + ' / ' + t.solution
  + ': a=' + t.semiMajorAxisKm.toFixed(3) + ' km  P=' + t.periodSec.toFixed(3) + ' s  e=' + t.eccentricity.toExponential(3));
for (const q of quantities) console.log('  ' + q.name + ': P='
  + (q.periodSec === null ? '—' : q.periodSec) + (q.sigmaSec ? ' ±' + q.sigmaSec : ''));
console.log('  重心基準 a=' + separations.barycentricOsculatingAKm + ' km / 4pi^2a^3/PR^2='
  + (separations.gmFrom_a_and_PR === null ? '—' : separations.gmFrom_a_and_PR.toFixed(3)) + ' km^3/s^2');
console.log('→ ' + path.relative(ROOT, OUT));

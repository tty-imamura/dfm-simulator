// 第280便b(統括の読み R70「🌘 と 🧲 は法則以外も違う —— 一つの初期状態から weight・q・法則版を一つずつ変えるコピーで測る」)
// — **地球–月の 1 表**の器。
//
// ■ 何を測るか
//   🌘 earthMoonRealKF1 の初期状態を基点に、次のコピーを**器の中だけで**作り(内蔵には足さない —— 🌓 だけは内蔵の
//   診断コピー earthMoonDiagOne を使う)、同じ抽出器(近点検出器 B・位置だけ)・同じ窓(月の最初の 8 公転 / 27 公転)で
//   近点移動 [deg/周] と近点回転の周期 [年] を並べる:
//     E0 🌘 そのまま(kFrame=1・pull〔D0pull〕・q_exact=8.2358・geoPN=2)
//     E1 重み: pull → share(D0pull を外し frameWeight:"share")
//     E2 初速: 🌘 → 🧲 の値(地球 vy −0.0013104・月 vy 0.1065368 —— 0.201% 違う)
//     E3 🧲 emAuditDFM そのまま(= E1 と E2 の両方)
//     E4 q: 8.2358 → 表裏核の振幅を参照距離 a で同じにする単一べき指数 q_fb(**fit ではない** —— 核の振幅から 1 回計算)
//     E5 法則: kFrame=1 → 0(引きずりなし)
//     E6 法則: kFrame=0 + meshVelocity(field:"explicit"・外部=地球・**点源**)・月の v=ẋ−u(0)
//     E7 核: E6 の点源 → 表裏核(= 🌓 earthMoonDiagOne そのまま)
//     E8 初速の意味: E7 で月の vy を座標速度 ẋ のまま入れる(v=ẋ と読ませる)
//     S0 🔆 emAuditSolar(太陽+地球+月・kFrame=0・geoPN=0 —— 現実の主因の参照行)
//   刻みは dt=0.016(全行)と dt/2=0.008(E0・E5・E7)。
//
// ■ しないこと
//   ・較正 37 本の q・入力を変えない(コピーは器の中だけ)。q を残差へ fit しない。閾値を置かない。
//   ・「観測一致」「較正した」と書かない(数を並べるだけ)。**正式の判定器の置換ではない**(窓・検出器の選び方が違う)。
//
// 実行(長い — 1 行 2〜8 分):
//   node tests/exp-w280b-emgrid.mjs --rows E0,E1 --dt 0.016 --part $SP/emgrid-part-a.json
//   node tests/exp-w280b-emgrid.mjs --merge $SP/emgrid-part-*.json   (正本 tests/out/emgrid-w280b.json を書く)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta, sha256Text } from './lib-w272e-provenance.mjs';
import { extractTopFunctions } from './lib-w279c-bgcompose.mjs';
import { loadHtmlMain, runRow, EMGRID_LIB_VERSION } from './lib-w280b-emgrid.mjs';
import * as SK from './lib-w280b-sphereKernel.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const OUT = path.join(ROOT, 'tests', 'out', 'emgrid-w280b.json');
const HARNESS_VERSION = 'w280b-emgrid-1';
const args = process.argv.slice(2);
const argOf = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };

export const ROWS = {
  E0: { label: '🌘 そのまま(kF1・pull・q_exact 8.2358)', axis: 'baseline' },
  E1: { label: '重み pull → share', axis: 'weight' },
  E2: { label: '初速 🌘 → 🧲(0.201%)', axis: 'initialVelocity' },
  E3: { label: '🧲 そのまま(share + 🧲 の初速)', axis: 'weight+initialVelocity' },
  E4: { label: 'q 8.2358 → q_fb(表裏核の振幅と参照距離で同じ単一べき)', axis: 'q' },
  E5: { label: '法則 kF1 → kF0(引きずりなし)', axis: 'law' },
  E6: { label: '法則 kF0 + meshVelocity explicit(点源)・v=ẋ−u(0)', axis: 'law' },
  E7: { label: '核 点源 → 表裏核(= 🌓 earthMoonDiagOne)', axis: 'kernel' },
  E8: { label: '初速の意味 v=ẋ(変換なし)・表裏核', axis: 'initialVelocityMeaning' },
  S0: { label: '🔆 太陽+地球+月(kF0・geoPN=0)', axis: 'reference' },
};

export const PHYSICS_NAMES = ['dfmGaussLegendre01', 'dfmLaneEmden', 'dfmSphereProfile', 'dfmSphereRho', 'dfmSphereOmega',
  'dfmSphereKernelRadial', 'dfmSphereKernelMomentsOf', 'dfmAddMoments', 'dfmComplexMomentsOf', 'dfmBlendComplexMoments',
  'dfmMeshVelocityRHS', 'meshVelocityPrepare', 'meshVelocitySources', 'meshVelocityMomentsOf', 'dfmMeshVelocityFieldAt',
  'dfmMeshVelocityStep', 'validateQLockKernel', 'validateSphereBody', 'sphereDeclOf', 'qLockCalc'];
export function physicsSourceSha(html) {
  const src = extractTopFunctions(html, PHYSICS_NAMES);
  const body = PHYSICS_NAMES.map((k) => k + '\n' + (src[k] || 'MISSING') + '\n').join('');
  return { sha: sha256Text(body), names: PHYSICS_NAMES };
}
function qFb(html) {
  const P = SK.makePure(html);
  const e = SK.earthCompare(P);
  return e.rows.find((z) => z.key === 'solid' && z.background === 'none');
}

function makeRow(HP, id, fb) {
  const P = (x) => JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === x)));
  const em = P('earthMoonRealKF1');
  const o = { ci: 0, oi: 1 };
  let p = em, convert = false;
  if (id === 'E0') p = em;
  else if (id === 'E1') { delete p.physics.D0pull; p.physics.frameWeight = 'share'; }
  else if (id === 'E2') { p.bodies[0].vy = -0.0013104; p.bodies[1].vy = 0.1065368; }
  else if (id === 'E3') p = P('emAuditDFM');
  else if (id === 'E4') { p.physics.q = fb.qEquivalent; delete p.qLock; }
  else if (id === 'E5') { p.physics.kFrame = 0; }
  else if (id === 'E6') {
    p.physics.kFrame = 0; delete p.physics.D0pull; p.sampleClass = 'principle'; delete p.qLock;
    p.physics.meshVelocity = { law: 'vMinusU', field: 'explicit', mutual: 0, external: ['body:0'],
      frame: { origin: 'barycenter', epoch: '🌘 t=0', rotation: 'none', translation: 'comoving' } };
    convert = true;
  } else if (id === 'E7') p = P('earthMoonDiagOne');
  else if (id === 'E8') { p = P('earthMoonDiagOne'); p.bodies[1].vx = em.bodies[1].vx; p.bodies[1].vy = em.bodies[1].vy; }
  else if (id === 'S0') { p = P('emAuditSolar'); o.ci = 1; o.oi = 2; o.yearUnits = 3155.76; o.dayUnits = 8.64; }
  else throw new Error('知らない行 ' + id);
  return { preset: p, o: Object.assign(o, { convert }) };
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN && args.includes('--merge')) {
  const files = args.filter((a) => a.endsWith('.json'));
  const rows = [];
  let fb = null;
  for (const f of files) { const J = JSON.parse(fs.readFileSync(f, 'utf8')); for (const r of J.rows) rows.push(r); if (J.qFb) fb = J.qFb; }
  const order = Object.keys(ROWS);
  rows.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id) || b.dt - a.dt);
  const htmlSha = rows.map((r) => r.targetSha256);
  // **物理の同一性**: 行の宣言の署名(presetSigHash —— 表示文言を見ない)と、場の経路の関数本文の SHA-256。
  // html の表示だけが変わっても(targetSha256 が変わっても)この 2 つが同じなら走行の前提は同じである
  const htmlNow = fs.readFileSync(path.join(ROOT, TARGET), 'utf8');
  const { HP } = loadHtmlMain(path.join(ROOT, TARGET));
  const fbNow = qFb(htmlNow);
  for (const r of rows) { const { preset } = makeRow(HP, r.id, fbNow); r.presetSigHash = HP.presetSigHash(preset); }
  const physicsSrc = physicsSourceSha(htmlNow);
  const CODE = ['tests/exp-w280b-emgrid.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w280b-sphereKernel.mjs',
    'tests/lib-w279c-bgcompose.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs'];
  const meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第280便b', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, libVersion: EMGRID_LIB_VERSION,
    ruling: '第70報: earthMoonRealKF1・emAuditDFM はまとめても良い。近点移動が目立つ。引きずり減衰 q の算出を見直す',
    reading: 'R70: 🌘 と 🧲 は法則以外も違う(D0pull/frameWeight/初期 vy 0.201%)—— 一つの初期状態から一つずつ変える',
    extractor: '近点検出器 B(相対距離の極小・3 点放物線の頂点 —— 位置だけ)。A(ṙ の −→+ 交差)は並記(meshVelocity 行は v が慣性速度なので参考値)',
    windows: '月の同方向公転で数えて最初の 8 公転 / 27 公転(正式の判定器の置換ではない)',
    solarNote: '🌘🧲 と本表のコピーはすべて二体(太陽摂動なし)。実際の月の近点回転(8.85 年)の主因は太陽摂動で、その参照行が S0(🔆)',
    notClaim: ['観測一致を達成した', '較正した', '較正を完了', 'q を fit した', '新発見'],
    allRowsSameHtml: htmlSha.every((z) => z === htmlSha[0]), physicsSourceSha256: physicsSrc.sha, physicsSourceNames: physicsSrc.names });
  const out = { meta, qFb: fb, rows };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
  const f3 = (x) => (x === null || x === undefined ? '—' : Number(x).toPrecision(5));
  for (const r of rows) {
    const w8 = r.run.windows[0], w27 = r.run.windows[1];
    console.log(`${r.id} dt=${r.dt} ${ROWS[r.id].label}: 8公転 B ${f3(w8.B && w8.B.slopeDegPerPeri)}°/周 ${f3(w8.B && w8.B.apsPeriodYr)}年 / 27公転 B ${f3(w27.B && w27.B.slopeDegPerPeri)}°/周 ${f3(w27.B && w27.B.apsPeriodYr)}年 / 恒星月 ${f3(r.run.sidMeanDays)}日`);
  }
  console.log('→ ' + path.relative(ROOT, OUT) + '(同じ html: ' + meta.allRowsSameHtml + ')');
  process.exit(0);
}

if (!IS_MAIN) { /* import 用(QA が PHYSICS_NAMES/physicsSourceSha を読む) */ } else {
const rowIds = (argOf('--rows') || 'E0').split(',');
const dt = Number(argOf('--dt') || 0.016);
const part = argOf('--part');
const html = fs.readFileSync(path.join(ROOT, TARGET), 'utf8');
const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
const fb = qFb(html);
const targetSha256 = provenanceMeta({ root: ROOT, target: TARGET }).targetSha256;
const res = { qFb: { qEquivalent: fb.qEquivalent, frontBackAmp: fb.frontBackAmp, currentAmp: fb.currentAmp }, rows: [], loadErrors: errors };
for (const id of rowIds) {
  const t0 = Date.now();
  const { preset, o } = makeRow(HP, id, fb);
  const smoke = args.includes('--smoke');
  const run = runRow(HP, preset, Object.assign(o, smoke ? { dt, revMax: 3, windows: [2, 3], maxSteps: 2e8 } : { dt, revMax: 27, maxSteps: 2e8 }));
  const row = { id, label: ROWS[id].label, axis: ROWS[id].axis, dt, targetSha256, wallS: (Date.now() - t0) / 1000, run,
    declared: { kFrame: preset.physics.kFrame, q: preset.physics.q, D0: preset.physics.D0, D0pull: preset.physics.D0pull === undefined ? null : preset.physics.D0pull,
      frameWeight: preset.physics.frameWeight || 'pull(既定)', geoPN: preset.physics.geoPN,
      vyEarth: preset.bodies[o.ci].vy, vyMoon: preset.bodies[o.oi].vy, meshVelocity: !!preset.physics.meshVelocity,
      kernel: !!(preset.physics.qLock && preset.physics.qLock.kernel) } };
  res.rows.push(row);
  if (part) fs.writeFileSync(part, JSON.stringify(res, null, 1));
  const w = run.windows;
  console.log(`${id} dt=${dt} steps=${run.steps} rev=${run.revN} ${row.wallS.toFixed(0)}s: 8公転 B ${w[0].B ? w[0].B.slopeDegPerPeri : '—'} / 27公転 B ${w[1].B ? w[1].B.slopeDegPerPeri : '—'} °/周 ・ u0=${JSON.stringify(run.u0 || null)}`);
}
process.exit(0);
}

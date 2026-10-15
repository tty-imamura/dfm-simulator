// 第304便e(DECISIONS v62 AN322・統括の検証項目 R198)— **低離心率の近点の抽出器の実測**(正本を書かない測定の器 —— 再生成表の段ではない)。
//
// ■ 何を測るか
//   🌋(金星 e≈0.0068)・💙(海王星 e≈0.0086)の写しを、第303便b の移送と同じ作り方(器 exp-w303b-inertialr2 の baseOf・variantOf・wExtOf —— G_loc と fitRecord を
//   外した写し)で、引きずり OFF(対照 —— 在位の宣言と同じ {Wbg:null, enabled:false})と ON(変種 B —— 源の慣性決定力 r⁻² の λ = 水星で合わせた値・正本
//   inertialr2-w303b.json の mercury.rows の B)を、刻み h・h/2・h/4 の 8 公転(runPl3 —— アプリの三次元の步)で走らせ、同じ走行から
//     検出器 B(距離の極小の 3 点放物線の頂点の方位 —— exp-w299c-planets3d の windowOf)と
//     新しい抽出器(tests/lib-w304e-apsis.mjs —— 接触の離心ベクトルの成分に位置の黄経の調和を足した最小二乗)
//   の近点率を出す。差(ON − OFF・同じ刻み)の数値の誤差 |h/2 − h/4| を、標的の σ(EPM2011 の候補の行 —— 金星 0.0016″/世紀)と比べる。
//   本の宣言・エンジン・正本は変えない(写しで走らせるだけ)。
//
// ■ 使い方
//   node tests/exp-w304e-apsis.mjs                         # 表を出す(約 1 分)
//   W304E_OUT=<json> node tests/exp-w304e-apsis.mjs        # 結果を JSON にも書く(既定は書かない —— 正本ではない)
//   W304E_IDS=venusSunInertial3d W304E_DIVS=1,2,4,8 W304E_K=0,3,6 で本・刻み・調和の数を変える
//
// ■ 言わないこと
//   ・「金星の近点率が σ の内で決まった」(数値の誤差を σ と比べるだけ —— 標的との差の合否は移送の器の仕事)。
//   ・「検出器 B が誤り」(高い離心率では頂点の検出は素直 —— 低離心率で揺れが大きいだけ)。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import * as PL from './exp-w299c-planets3d.mjs';
import * as I2 from './exp-w303b-inertialr2.mjs';
import * as AP from './lib-w304e-apsis.mjs';
import * as P3 from './lib-w299c-planets3d.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const IDS = (process.env.W304E_IDS || 'venusSunInertial3d,neptuneSunInertial3d').split(',');
const DIVS = (process.env.W304E_DIVS || '1,2,4').split(',').map(Number);
const KS = (process.env.W304E_K || '0,3,6').split(',').map(Number);
const N = 8;
export const HARNESS_VERSION = 'w304e-apsis-exp-1';

const clone = (x) => JSON.parse(JSON.stringify(x));
/** 正本 inertialr2-w303b.json の水星の変種 B の λ [m](無ければ 4431.88 —— 第303便b の値)。 */
export function lambdaB() {
  try { const J = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests', 'out', 'inertialr2-w303b.json'), 'utf8')); const r = J.mercury.rows.find((z) => z.variant === 'B'); if (r && Number.isFinite(r.x)) return { lambdaM: r.x, src: 'inertialr2-w303b.json mercury.rows B' }; } catch { /* 無い */ }
  return { lambdaM: 4431.88, src: '第303便b の値(正本が読めない)' };
}
/** 1 走行: 検出器 B と新しい抽出器(K の列)を同じ走行から。 */
export function runBoth(HP, q, dt, Ks = KS) {
  const mu = q.physics.G * (q.bodies[0].m + q.bodies[1].m);
  let smp = null;
  const R = AP.captureSim(HP, (S) => { smp = AP.attachSampler(S, { ci: 0, oi: 1, mu }); }, () => PL.runPl3(HP, q, { dt, revMax: N }));
  const Tsec = Math.pow(10, q.scaleExp.T), w = PL.windowOf(R, N, Tsec);
  const t1 = R.ev.rev[N - 1];
  const fits = {};
  for (const K of Ks) { const f = AP.apsisRate(smp.samples(), { t0: 0, t1, K }); fits[K] = f ? { aps: AP.toArcsecPerCentury(f.rate, Tsec), e: f.e, rmsP: f.rms[0], rmsQ: f.rms[1], n: f.n } : null; }
  return { detB: w.apsArcsecPerCentury, nPeri: w.nPeri, ecc: w.ecc, steps: R.steps, nan: R.nan, fits };
}

export function measureOne(HP, id, lam) {
  const p = I2.baseOf(HP, id), wExt = I2.wExtOf(HP, p).book, step = P3.stepsOf(p.timeRef.pRef).h;   // 刻み h は第303便b の hOf と同じ(時間の標準 —— 1 公転 360 步)
  const off = I2.variantOf(p, { kind: 'off' }, null, wExt), on = I2.variantOf(p, { kind: 'B', lambdaM: lam.lambdaM }, null, wExt);
  const rows = [];
  for (const d of DIVS) {
    const a = runBoth(HP, off, step / d), b = runBoth(HP, on, step / d);
    const diffFit = {}; for (const K of KS) diffFit[K] = (a.fits[K] && b.fits[K]) ? b.fits[K].aps - a.fits[K].aps : null;
    rows.push({ div: d, off: a, on: b, diffB: b.detB - a.detB, diffFit });
  }
  const tg = I2.targetOf(p);
  const last = rows.length - 1;
  const numErrB = rows.length >= 2 ? Math.abs(rows[last].diffB - rows[last - 1].diffB) : null;
  const numErrFit = {}; for (const K of KS) numErrFit[K] = rows.length >= 2 && rows[last].diffFit[K] !== null ? Math.abs(rows[last].diffFit[K] - rows[last - 1].diffFit[K]) : null;
  const ctlErrB = rows.length >= 2 ? Math.abs(rows[last].off.detB - rows[last - 1].off.detB) : null;
  const ctlErrFit = {}; for (const K of KS) ctlErrFit[K] = rows.length >= 2 && rows[last].off.fits[K] && rows[last - 1].off.fits[K] ? Math.abs(rows[last].off.fits[K].aps - rows[last - 1].off.fits[K].aps) : null;
  return { id, h: step, e: tg.e, pn1: tg.pn1, a1: tg.a1, sigma: tg.sigma, rows, numErrB, numErrFit, ctlErrB, ctlErrFit };
}

async function main() {
  const t0 = Date.now();
  const { HP } = loadHtmlMain(path.join(ROOT, TARGET));
  const lam = lambdaB();
  const st = AP.apsisSelfTest();
  console.log(`apsis self-test ${st.ok ? 'OK' : 'NG'} —— ${st.cases.join(' / ')}`);
  const out = { version: HARNESS_VERSION, lib: AP.APSIS_VERSION, target: TARGET, N, divs: DIVS, Ks: KS, lambda: lam, selfTest: st, bodies: [] };
  const f = (x, n = 6) => (x === null || x === undefined || !Number.isFinite(x)) ? '—' : x.toFixed(n);
  for (const id of IDS) {
    const r = measureOne(HP, id, lam);
    out.bodies.push(r);
    console.log(`${id}(e ${f(r.e, 5)}・1PN ${f(r.pn1, 4)}・σ ${r.sigma === null ? '—' : r.sigma}): h ${r.h}`);
    for (const z of r.rows) console.log(`  h/${z.div}: OFF 検出器B ${f(z.off.detB)}・新 ${KS.map((K) => 'K' + K + ' ' + f(z.off.fits[K] && z.off.fits[K].aps)).join(' ')} / 差(ON−OFF)検出器B ${f(z.diffB)}・新 ${KS.map((K) => 'K' + K + ' ' + f(z.diffFit[K])).join(' ')}`);
    console.log(`  数値の誤差 |h/${DIVS[DIVS.length - 2]} − h/${DIVS[DIVS.length - 1]}|(差): 検出器B ${f(r.numErrB, 7)}・新 ${KS.map((K) => 'K' + K + ' ' + f(r.numErrFit[K], 7)).join(' ')}(σ ${r.sigma === null ? '—' : r.sigma})`);
    console.log(`  対照(OFF)の刻みの差: 検出器B ${f(r.ctlErrB, 7)}・新 ${KS.map((K) => 'K' + K + ' ' + f(r.ctlErrFit[K], 7)).join(' ')}`);
  }
  out.elapsedS = (Date.now() - t0) / 1000;
  console.log(`exp-w304e-apsis: ${out.elapsedS.toFixed(1)} s`);
  if (process.env.W304E_OUT) { fs.writeFileSync(path.resolve(process.env.W304E_OUT), JSON.stringify(out, null, 1) + '\n'); console.log('→ ' + process.env.W304E_OUT); }
}
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) await main();

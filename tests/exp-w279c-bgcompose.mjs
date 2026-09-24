// 第279便c(原仮定者の裁定〔第69報〕・統括の読み R62)— **背景の閾値なし合成と速度分解 RHS の検算**の器。
//
// ■ 何を測るか(表 a〜f)
//   html の純関数 `dfmComplexMomentsOf`・`dfmBlendComplexMoments`・`dfmMeshVelocityRHS` を
//   (1) **html のソースから取り出して** node で評価し(tests/lib-w279c-bgcompose.mjs)、
//   (2) 同じ入力を**ページの `HP.*`** にも渡して、node とページの出力が**ビット一致**するかを数える。
//   (a) 直接計算(源をすべて明示天体 —— `meshFieldNoD0`)と分解→合成の一致(30 条件)
//   (b) 一定速度 V の座標変換で ẍ・v̇ が変わらない(12 条件・`advected` と否定対照 `fieldTime`)
//   (c) 定常な指定場で H/m=|p|²/2+p·u+Φ の保存(RK4 の刻み 2 段)と dH/dt の代数残差
//   (d) 境界(W=0・欠落・非有限・ゼロ重みの分子・自己項の宣言なし・D₀・場の門)
//   (e) 背景重み 1e−30 でも分子の寄与を保つ(**閾値なしの代数検査 —— 天体の数値例ではない**)
//   (f) 一様定常な場で追加の加速度 0
//
// ■ しないこと
//   ・エンジンの既定経路に触れない(ページは純関数を呼ぶだけ)・閾値を置かない・D₀ を読まない。
//
// 実行:
//   PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w279c-bgcompose.mjs
// 出力: tests/out/bgcompose-w279c.json(CANON・来歴は lib-w272e-provenance の形)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import {
  BGCOMPOSE_VERSION, makePure, decompositionSuite, galileanSuite, hamiltonianRun, boundaryCases,
  tinyWeightCases, uniformCases, rng,
} from './lib-w279c-bgcompose.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const OUT = path.join(ROOT, 'tests', 'out', 'bgcompose-w279c.json');
const HARNESS_VERSION = 'w279c-bgcompose-1';
const t0 = Date.now();

const html = fs.readFileSync(path.join(ROOT, TARGET), 'utf8');
const pure = makePure(html);

/* ── (a)〜(f) ── */
const A = decompositionSuite(pure, 30, 2791);
const B = galileanSuite(pure, 12, 2792);
const HBG = { W0: 0.2, A0: [0.2 * 0.3, 0.2 * 0.1], gradW: [0.002, -0.001], gradA: [0.0015, 0.004, -0.003, 0.0005], xStar: [0, 0] };
const HCFG = { GM: 1, Msrc: 1, eps: 0.2, bg: HBG, x0: [2.0, 0], v0: [0, 0.45], T: 40 };
const Cc = [20000, 40000].map((steps) => hamiltonianRun(pure, Object.assign({}, HCFG, { steps })));
const D = boundaryCases(pure);
const E = tinyWeightCases(pure);
const F = uniformCases(pure);

const maxOf = (rows, k) => Math.max(...rows.filter((z) => z.ok !== false).map((z) => z[k]));
const table = {
  a: { n: A.length, ok: A.filter((z) => z.ok).length, uRelMax: maxOf(A, 'uRel'),
    gradUTermRelMax: maxOf(A, 'gradUTermRel'), dUdtTermRelMax: maxOf(A, 'dUdtTermRel'),
    gradUValueRelMax: maxOf(A, 'gradURel'), dUdtValueRelMax: maxOf(A, 'dUdtRel'), WRelMax: maxOf(A, 'WRel'),
    uBitIdentical: A.filter((z) => z.uBits).length,
    chiLocalRange: [Math.min(...A.map((z) => z.chiLocal)), Math.max(...A.map((z) => z.chiLocal))] },
  b: { n: B.length,
    advected: { coordAccelRelMax: Math.max(...B.map((z) => z.advected.coordAccelRel)), vRateRelMax: Math.max(...B.map((z) => z.advected.vRateRel)),
      uShiftRelMax: Math.max(...B.map((z) => z.advected.uShiftRel)), gradURelMax: Math.max(...B.map((z) => z.advected.gradURel)) },
    fieldTimeOnly: { coordAccelRelMin: Math.min(...B.map((z) => z.fieldTime.coordAccelRel)),
      coordAccelRelMax: Math.max(...B.map((z) => z.fieldTime.coordAccelRel)), vRateRelMax: Math.max(...B.map((z) => z.fieldTime.vRateRel)) } },
  c: { steps: Cc.map((z) => z.steps), dHrelMax: Cc.map((z) => z.dHrelMax), ratio: Cc[0].dHrelMax / Cc[1].dHrelMax,
    dHdtAlgebraResidMax: Cc.map((z) => z.dHdtAlgebraResidMax), JasymmetryMax: Cc.map((z) => z.JasymmetryMax), H0: Cc[0].H0 },
  d: { n: D.n, pass: D.pass, inertiaKeptAtW0: D.inertiaKeptAtW0 },
  e: { n: E.length, relErrMax: Math.max(...E.map((z) => z.relErr)), allDefined: E.every((z) => z.defined === true),
    nonzeroKept: E.filter((z) => z.nonzero !== undefined).every((z) => z.nonzero === true) },
  f: { n: F.length, extraAccelMax: Math.max(...F.map((z) => Math.max(Math.abs(z.extraAccel[0]), Math.abs(z.extraAccel[1])))),
    extraVRateMax: Math.max(...F.map((z) => Math.max(Math.abs(z.extraVRate[0]), Math.abs(z.extraVRate[1])))),
    transportRelMax: Math.max(...F.map((z) => z.transportRel)) },
};

/* ── ページの HP.* と node の取り出しの突合(同じ入力 → ビット一致) ── */
const R = rng(2793);
const probes = [];
for (let c = 0; c < 24; c++) {
  const L = [], Ex = [];
  for (let i = 0; i < 1 + (c % 3); i++) L.push({ m: 0.5 + R(), x: 3 * (2 * R() - 1), y: 3 * (2 * R() - 1), vx: 2 * R() - 1, vy: 2 * R() - 1, ax: 0.1 * R(), ay: -0.1 * R() });
  for (let i = 0; i < 1 + (c % 2); i++) Ex.push({ m: Math.pow(10, -6 + 12 * R()), x: 30 * (2 * R() - 1), y: 30 * (2 * R() - 1), vx: 2 * R() - 1, vy: 2 * R() - 1, ax: 0, ay: 0 });
  probes.push({ L, E: Ex, px: 0.1 * (2 * R() - 1), py: 0.1 * (2 * R() - 1), e2: (c % 2) ? 0.0025 : 0, v: [2 * R() - 1, 2 * R() - 1], a: [0.1 * R(), 0.1 * R()] });
}
const nodeOut = probes.map((q) => {
  const mL = pure.dfmComplexMomentsOf(q.L, q.px, q.py, q.e2); mL.selfExcluded = true;
  const mE = pure.dfmComplexMomentsOf(q.E, q.px, q.py, q.e2);
  const f = pure.dfmBlendComplexMoments(mL, mE);
  const r = pure.dfmMeshVelocityRHS(f, q.v, q.a);
  return JSON.stringify([mL, mE, f, r]);
});
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
const pageErrors = [];
const page = await browser.newPage();
page.on('pageerror', (e) => pageErrors.push(String(e)));
await page.goto('file://' + path.join(ROOT, TARGET), { waitUntil: 'load' });
await page.waitForFunction(() => window.HP && HP.sim);
const pageOut = await page.evaluate((P) => P.map((q) => {
  const mL = HP.dfmComplexMomentsOf(q.L, q.px, q.py, q.e2); mL.selfExcluded = true;
  const mE = HP.dfmComplexMomentsOf(q.E, q.px, q.py, q.e2);
  const f = HP.dfmBlendComplexMoments(mL, mE);
  const r = HP.dfmMeshVelocityRHS(f, q.v, q.a);
  return JSON.stringify([mL, mE, f, r]);
}), probes);
const version = await page.evaluate(() => HP.MESH_VEL_STEP_VERSION);
await browser.close();
const pageAgree = nodeOut.filter((z, i) => z === pageOut[i]).length;

/* ── 書き出し ── */
const CODE = ['tests/exp-w279c-bgcompose.mjs', 'tests/lib-w279c-bgcompose.mjs', 'tests/lib-w278d-readaudit.mjs',
  'tests/lib-w275b-meshfield.mjs', 'tests/lib-w272e-provenance.mjs'];
const out = {
  meta: Object.assign(provenanceMeta({ root: ROOT, wave: '第279便c', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, libVersion: BGCOMPOSE_VERSION, stepVersion: version,
    ruling: '第69報: 背景複素決定力は閾値で無視せず適切に導入する/慣性力を複素決定力の直接作用として整理する/'
      + '厳密には空間に対する加速と空間による引きずり(座標変換)は区別する',
    law: 'W=W_loc+W_bg・A=A_loc+A_bg・u=A/W・∇u=(∇A−u⊗∇W)/W・∂ₜu=(∂ₜA−u∂ₜW)/W・χ=W_loc/W /'
      + ' ẋ=v+u・v̇=a_space−Jᵀv・ẍ=a_space+∂ₜu+Ju+(J−Jᵀ)v・H/m=|p|²/2+p·u+Φ',
    method: 'html の純関数をソースから取り出して node で評価(写しを持たない)+ 同じ入力をページの HP.* に渡してビット一致を数える',
    notClaim: ['慣性を導出した', '運動量則を導出した', '背景を無視してよいことを証明した', '背景を較正した', '閾値を採用した',
      '新発見'],
  }),
  table, pageVsNode: { n: probes.length, bitIdentical: pageAgree },
  a: A, b: B, c: Cc, d: D, e: E, f: F, hamiltonianConfig: HCFG,
  pageErrors, elapsedS: (Date.now() - t0) / 1000,
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
const e = (x) => (x === null || x === undefined ? '—' : Number(x).toExponential(3));
console.log(`(a) ${table.a.ok}/${table.a.n} 条件: u ${e(table.a.uRelMax)} / ∇u(項比)${e(table.a.gradUTermRelMax)} / ∂ₜu(項比)${e(table.a.dUdtTermRelMax)}`
  + ` / ∇u(値比)${e(table.a.gradUValueRelMax)} / u ビット一致 ${table.a.uBitIdentical}`);
console.log(`(b) advected: ẍ ${e(table.b.advected.coordAccelRelMax)} v̇ ${e(table.b.advected.vRateRelMax)} / fieldTime だけ: ẍ ${e(table.b.fieldTimeOnly.coordAccelRelMin)}〜${e(table.b.fieldTimeOnly.coordAccelRelMax)}`);
console.log(`(c) dH/H ${table.c.dHrelMax.map(e).join(' → ')}(比 ${table.c.ratio.toFixed(2)})・dH/dt 残差 ${table.c.dHdtAlgebraResidMax.map(e).join('/')}・J の非対称 ${table.c.JasymmetryMax.map(e).join('/')}`);
console.log(`(d) ${table.d.pass}/${table.d.n}・W=0 で慣性を保つ ${table.d.inertiaKeptAtW0}`);
console.log(`(e) ${table.e.n} 件・相対誤差 ${e(table.e.relErrMax)}・非ゼロを保つ ${table.e.nonzeroKept}`);
console.log(`(f) ${table.f.n} 件・追加加速度 ${e(table.f.extraAccelMax)}・追加 v̇ ${e(table.f.extraVRateMax)}・移送 ${e(table.f.transportRelMax)}`);
console.log(`ページ vs node: ${pageAgree}/${probes.length} ビット一致 → ${path.relative(ROOT, OUT)}(ページエラー ${pageErrors.length}・${out.elapsedS.toFixed(1)} s)`);

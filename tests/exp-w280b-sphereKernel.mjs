// 第280便b(原仮定者の裁定〔第70報〕・統括の読み R69)— **表裏核の検算**の器。
//
// ■ 何を測るか(表 a〜g —— 純関数は tests/lib-w280b-sphereKernel.mjs)
//   html の純関数(`dfmSphereProfile`・`dfmSphereKernelRadial`・`dfmSphereKernelMomentsOf`・`dfmSphereKernelQEff`)を
//   (1) **html のソースから取り出して** node で評価し、(2) 同じ入力を**ページの `HP.*`** にも渡してビット一致を数える。
//   (a) 遠方 W→M/r²・A_φ→L/r³ (b) 求積の収束と独立な 2 次元求積 (c) 表面近くの u_φ・角速度 (d) q_eff の距離依存
//   (e) 地球で現行核 (R/(R+a))^q と比べる(**c² の抑制は表裏核に無い**)(f) 中心と表面付近 (g) 微分と合成への受け渡し
//
// ■ しないこと
//   ・エンジンの既定経路に触れない・q を fit しない・閾値を置かない・弱場振幅を導出したとは書かない。
//
// 実行:
//   PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w280b-sphereKernel.mjs
// 出力: tests/out/spherekernel-w280b.json(CANON・来歴は lib-w272e-provenance の形)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import * as L from './lib-w280b-sphereKernel.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const OUT = path.join(ROOT, 'tests', 'out', 'spherekernel-w280b.json');
const HARNESS_VERSION = 'w280b-sphereKernel-1';
const t0 = Date.now();

const html = fs.readFileSync(path.join(ROOT, TARGET), 'utf8');
const P = L.makePure(html);
const A = L.farField(P), B = L.convergence(P), C = L.nearSurface(P), D = L.qEffTable(P), E = L.earthCompare(P),
  F = L.centerTable(P), G = L.derivativeChecks(P);

const mx = (arr) => Math.max(...arr);
const table = {
  a: { n: A.length, WRelAt100Max: mx(A.filter((z) => z.r === 100).map((z) => Math.abs(z.WRel))),
    ARelAt100Max: mx(A.filter((z) => z.r === 100).map((z) => Math.abs(z.ARel))),
    WRelAt10000Max: mx(A.filter((z) => z.r === 10000).map((z) => Math.abs(z.WRel))),
    ARelAt10000Max: mx(A.filter((z) => z.r === 10000).map((z) => Math.abs(z.ARel))),
    // r⁻² で縮むこと: r=100 → 1000 の比
    shrinkWMin: Math.min(...A.filter((z) => z.r === 100).map((z) => Math.abs(z.WRel) / Math.abs(A.find((y) => y.key === z.key && y.r === 1000).WRel))),
    shrinkAMin: Math.min(...A.filter((z) => z.r === 100).map((z) => Math.abs(z.ARel) / Math.abs(A.find((y) => y.key === z.key && y.r === 1000).ARel))) },
  b: { n: B.length, W8Max: mx(B.map((z) => z.W8)), W16Max: mx(B.map((z) => z.W16)), W32Max: mx(B.map((z) => z.W32)),
    G8Max: mx(B.map((z) => z.G8)), G16Max: mx(B.map((z) => z.G16)), G32Max: mx(B.map((z) => z.G32)),
    dW16Max: mx(B.map((z) => z.dW16)), dG16Max: mx(B.map((z) => z.dG16)),
    twoD48Max: mx(B.map((z) => Math.max(z.twoD48.W, z.twoD48.G))), twoD64Max: mx(B.map((z) => Math.max(z.twoD64.W, z.twoD64.G))),
    uniformExactMax: mx(B.filter((z) => z.uniformExact !== null).map((z) => z.uniformExact)) },
  c: Object.fromEntries(['solid', 'gas-b0', 'gas-b1', 'gas-b3', 'star-n3', 'compact', 'solid-shellular'].map((k) => [k,
    C.filter((z) => z.key === k).map((z) => ({ r: z.r, uphi: z.uphi, omegaU: z.omegaU, qEff: z.qEff }))])),
  d: D,
  e: E,
  f: { rows: F.rows, reject: F.reject, A0: F.rows.map((z) => z.pts[0].G), omegaU0: F.rows.map((z) => z.pts[0].omegaU) },
  g: { gradWMax: mx(G.rows.map((z) => z.gradW)), gradAMax: mx(G.rows.map((z) => z.gradA)), dWdtMax: mx(G.rows.map((z) => z.dWdt)),
    dAdtMax: mx(G.rows.map((z) => z.dAdt)), blendOk: G.rows.every((z) => z.blendOk), uSpinTangentialMax: mx(G.rows.map((z) => z.uSpinTangential)),
    spinZeroU: G.spinZeroU, spinZeroGradU: G.spinZeroGradU },
  profiles: L.CLASS_DECLS.map((c) => { const pr = P.dfmSphereProfile(c.decl, 32);
    return { key: c.key, decl: c.decl, kI: pr.kI, kL: pr.kL, rhoCenterOverMean: pr.rhoCenterOverMean, params: pr.params }; }),
};

/* ── ページの HP.* と node の取り出しの突合 ── */
const probes = [];
for (const c of L.CLASS_DECLS) for (const [r, e] of [[1.05, 0], [3.7, 0], [57, 0], [0.4, 0.1], [0, 0.2]]) probes.push({ decl: c.decl, r, e });
const mom = [];
for (const c of L.CLASS_DECLS.slice(0, 4)) for (const [px, py] of [[2.5, 0.3], [-4, 7], [60, -2]])
  mom.push({ decl: c.decl, body: { m: 1.3, R: 1.1, spin: 0.21, x: 0.2, y: -0.1, vx: 0.05, vy: -0.03, ax: 0.001, ay: 0.002, epsC: 0 }, px, py });
const nodeOut = probes.map((q) => JSON.stringify(P.dfmSphereKernelRadial(P.dfmSphereProfile(q.decl, 16), q.r, q.e)))
  .concat(mom.map((q) => JSON.stringify(P.dfmSphereKernelMomentsOf([Object.assign({}, q.body, { prof: P.dfmSphereProfile(q.decl, 16) })], q.px, q.py))));
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
const pageOut = await page.evaluate(({ probes, mom }) => probes.map((q) => JSON.stringify(HP.dfmSphereKernelRadial(HP.dfmSphereProfile(q.decl, 16), q.r, q.e)))
  .concat(mom.map((q) => JSON.stringify(HP.dfmSphereKernelMomentsOf([Object.assign({}, q.body, { prof: HP.dfmSphereProfile(q.decl, 16) })], q.px, q.py)))),
{ probes, mom });
const version = await page.evaluate(() => HP.SPHERE_KERNEL_VERSION);
await browser.close();
const pageAgree = nodeOut.filter((z, i) => z === pageOut[i]).length;
// 食い違った入力(ページと node の Math.* の最下位ビットの違いか)と、数値の最大相対差
const numsOf = (t) => { const o = []; JSON.parse(t, (k, v) => { if (typeof v === 'number') o.push(v); return v; }); return o; };
const mismatch = nodeOut.map((z, i) => ({ i, z })).filter((q) => q.z !== pageOut[q.i]).map((q) => {
  const a = numsOf(q.z), b = numsOf(pageOut[q.i]);
  let d = 0; for (let k = 0; k < Math.min(a.length, b.length); k++) { const s0 = Math.max(Math.abs(a[k]), Math.abs(b[k])); if (s0 > 0) d = Math.max(d, Math.abs(a[k] - b[k]) / s0); }
  const src = q.i < probes.length ? { kind: 'radial', decl: probes[q.i].decl, r: probes[q.i].r, e: probes[q.i].e }
    : { kind: 'moments', decl: mom[q.i - probes.length].decl, px: mom[q.i - probes.length].px };
  return Object.assign(src, { i: q.i, maxRelDiff: d, sameLength: a.length === b.length });
});

const CODE = ['tests/exp-w280b-sphereKernel.mjs', 'tests/lib-w280b-sphereKernel.mjs', 'tests/lib-w279c-bgcompose.mjs',
  'tests/lib-w278d-readaudit.mjs', 'tests/lib-w272e-provenance.mjs'];
const out = {
  meta: Object.assign(provenanceMeta({ root: ROOT, wave: '第280便b', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, libVersion: L.SPHEREKERNEL_LIB_VERSION, kernelVersion: version,
    ruling: '第70報: 引きずり減衰 q の算出を見直す。天体は球体なので表側の引きずりと裏側の引きずりは逆転している。'
      + '手前側の方が距離が近いので、その差分が残る。潮汐力に良く似ている。…密度分布にも影響を受ける',
    law: 'W_b(x)=∫ρ(ξ)/(|x−X−ξ|²+ε_c²)d³ξ・A_spin(x)=∫ρ(ξ)(Ω×ξ)/(…)d³ξ(並進 V_bW_b は別に足す)・u=A/W(第279便c の合成)',
    method: '方位の積分は閉じた式・半径は区間分割の Gauss–Legendre(密度の不連続と特異点に最も近い点へ等比に細分)。'
      + '独立な 2 次元求積(s と μ の両方を数値で)と突き合わせ、ページの HP.* と node の取り出しのビット一致を数える',
    notDerived: '弱場振幅(c² の抑制)は導出できていない —— 表裏核の振幅は現行 q_exact 核(LT 級)の約 10¹⁰ 倍(e)',
    notClaim: ['弱場振幅を導出した', 'q を再 fit した', '較正した', '観測一致を達成した', '慣性を導出した', '新発見'] }),
  table, pageVsNode: { n: nodeOut.length, bitIdentical: pageAgree, mismatch,
    maxRelDiff: mismatch.length ? Math.max(...mismatch.map((z) => z.maxRelDiff)) : 0 },
  a: A, b: B, c: C, pageErrors, elapsedS: (Date.now() - t0) / 1000,
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
const e = (x) => (x === null || x === undefined ? '—' : Number(x).toExponential(3));
console.log(`(a) r=100: W ${e(table.a.WRelAt100Max)} A ${e(table.a.ARelAt100Max)} / r=10⁴: W ${e(table.a.WRelAt10000Max)} A ${e(table.a.ARelAt10000Max)} / 100→1000 の縮み ≥ ${table.a.shrinkWMin.toFixed(1)}・${table.a.shrinkAMin.toFixed(1)}`);
console.log(`(b) 8 点 W ${e(table.b.W8Max)} G ${e(table.b.G8Max)} / 16 点 W ${e(table.b.W16Max)} G ${e(table.b.G16Max)} / 32 点 ${e(table.b.W32Max)} / 2D48 ${e(table.b.twoD48Max)} 2D64 ${e(table.b.twoD64Max)} / 一様球の閉形式 ${e(table.b.uniformExactMax)}`);
console.log(`(c) r=1.05 u_φ: ` + Object.entries(table.c).map(([k, v]) => k + ' ' + v[0].uphi.toFixed(4)).join(' / '));
console.log(`(d) ` + D.map((z) => `${z.key} Wbg=${z.Wbg}: ${z.q[0].toFixed(3)}→${z.q[z.q.length - 1].toFixed(3)}`).join(' / '));
console.log(`(e) 現行核 ${e(E.cur)}・LT ${e(E.lt)}・` + E.rows.map((z) => `${z.key}/${z.background} 表裏核 ${e(z.frontBackAmp)}(比 ${e(z.ratioFrontBackToCurrent)}・q 相当 ${z.qEquivalent.toFixed(4)}・u_φ ${z.uphiMS.toFixed(3)} m/s)`).join(' / '));
console.log(`(f) A(0)=${table.f.A0.join('/')}・拒否 ${F.reject.map((z) => z.ok).join('/')}`);
console.log(`(g) ∇W ${e(table.g.gradWMax)} ∇A ${e(table.g.gradAMax)} ∂ₜW ${e(table.g.dWdtMax)} ∂ₜA ${e(table.g.dAdtMax)} 合成 ${table.g.blendOk}`);
console.log(`食い違い: ${JSON.stringify(mismatch.map((z) => [z.i, z.kind, z.decl.densityClass, z.r ?? z.px, z.maxRelDiff]))}`);
console.log(`ページ vs node: ${pageAgree}/${nodeOut.length} ビット一致 → ${path.relative(ROOT, OUT)}(ページエラー ${pageErrors.length}・${out.elapsedS.toFixed(1)} s)`);

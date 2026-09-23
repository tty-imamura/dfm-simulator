// 第278便c(統括の検証項目 R55): **相対すべり `pairSlip` の符号修正の影響範囲**を実測する器。
//
// `tests/lib-w277c-nsgrid.mjs` の `pairSlip` は w277c-1 で第二天体を s2 = v **+** ω₂×r としていた。
// r・v を同じ i→j 向きで表すなら **s2 = v − ω₂×r**(版 w277c-2 で修正)。この器は
//   ① 最小対照 4 件(相互同期・その反転・相手が自転しない・逆回転)を修正前後の式で並べる
//   ② ラベルの入れ替え対称性 pairSlip(−r,−v,ω₂,ω₁).s1 = −pairSlip(r,v,ω₁,ω₂).s2 を乱数 64 件で測る
//   ③ **html の 2D 実装**(`beta/index.html` の `relativeDragProbe`・`dfmRelativeDragStep` の**ソースを
//      文字列として切り出して**評価する —— ページは開かない)と、同じ入力で s_i・s_j を突き合わせる
//   ④ `tests/lib-w277b-charondfm.mjs` の `pairSlipStep`(html と同じ式の純関数写し)を html の
//      `dfmRelativeDragStep` と同じ状態から 1 步進めて、状態をビットで突き合わせる
//   ⑤ `slipRmsCircular`(1 天体・別実装)と、修正後の `pairSlip` を 360 位相で平均した RMS の一致
//   ⑥ **影響範囲**: lib の中で `pairSlip` を呼ぶ関数をソースから数える(格子の力学が経由するか)
// を出す。**エンジンには 1 bit も触らない**(html は読むだけ・書かない)。
//
// 使い方: node tests/exp-w278c-slipaudit.mjs   → tests/out/slipaudit-w278c.json
// 書かないこと: 「新発見」「NS の平衡を実証した」。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as NG from './lib-w277c-nsgrid.mjs';
import * as CD from './lib-w277b-charondfm.mjs';
import { withProvenance } from './lib-w272e-provenance.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HTML = path.join(ROOT, 'beta', 'index.html');
const html = fs.readFileSync(HTML, 'utf8');
const norm = (a) => Math.hypot(...a);
const sub = (a, b) => a.map((x, i) => x - b[i]);

/* ── html から関数のソースを**文字列として**切り出す(ページは開かない) ─────────── */
function extractFunction(src, name) {
  const i = src.indexOf('function ' + name + '(');
  if (i < 0) return null;
  let j = src.indexOf('{', i), depth = 0;
  for (let k = j; k < src.length; k++) {
    const c = src[k];
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) return src.slice(i, k + 1); }
  }
  return null;
}
const verLine = (html.match(/const REL_DRAG_STEP_VERSION\s*=\s*"([^"]+)"/) || [])[1] || null;
const srcProbe = extractFunction(html, 'relativeDragProbe');
const srcStep = extractFunction(html, 'dfmRelativeDragStep');
const srcPairs = extractFunction(html, 'relativeDragPairs');
const htmlHas = !!(srcProbe && srcStep && srcPairs);
let H = null;
if (htmlHas) {
  // eslint-disable-next-line no-new-func
  H = new Function(`const isNum=(x)=>typeof x==='number'&&Number.isFinite(x);
    const REL_DRAG_STEP_VERSION=${JSON.stringify(verLine)};
    ${srcPairs}\n${srcProbe}\n${srcStep}
    return { relativeDragProbe, dfmRelativeDragStep, relativeDragPairs };`)();
}
/** html の S の最小形(2 体・z=0)。 */
function fakeS(o) {
  return { n: 2, m: o.m.slice(), x: o.x.slice(), y: o.y.slice(), vx: o.vx.slice(), vy: o.vy.slice(),
    spin: o.spin.slice(), R: o.R.slice(), params: { G: o.G, softening: o.eps || 0 },
    relDrag: { law: 'pairSlip', kappa: o.kappa, pairs: 'all', W0: o.W0 || 0 },
    hasRelativeDrag: true, pinned: null, resL: 0,
    relDragHeat: 0, relDragPos: 0, relDragResL: 0, relDragKickMax: 0, relDragTorqueMax: 0,
    relDragSlipMax: 0, relDragN: 0 };
}

/* ══ ① 最小対照 4 件(修正前後) ══════════════════════════════════════════════ */
const MIN_CASES = [
  { id: 'sync', label: '相互同期(r=(1,0,0)・v=(0,1,0)・ω₁=ω₂=(0,0,1))',
    r: [1, 0, 0], v: [0, 1, 0], w1: [0, 0, 1], w2: [0, 0, 1], expect: { s1: [0, 0, 0], s2: [0, 0, 0] } },
  { id: 'syncReversed', label: '反転(r=(−1,0,0)・v=(0,−1,0)・ω₁=ω₂=(0,0,1))',
    r: [-1, 0, 0], v: [0, -1, 0], w1: [0, 0, 1], w2: [0, 0, 1], expect: { s1: [0, 0, 0], s2: [0, 0, 0] } },
  { id: 'companionStill', label: '相手が自転しない(ω₂=0)',
    r: [1, 0, 0], v: [0, 1, 0], w1: [0, 0, 1], w2: [0, 0, 0], expect: { s1: [0, 0, 0], s2: [0, 1, 0] } },
  { id: 'counterRotating', label: '逆回転(ω₂=(0,0,−1))',
    r: [1, 0, 0], v: [0, 1, 0], w1: [0, 0, 1], w2: [0, 0, -1], expect: { s1: [0, 0, 0], s2: [0, 2, 0] } },
];
const minRows = MIN_CASES.map((c) => {
  const a = NG.pairSlip(c.r, c.v, c.w1, c.w2);
  const b = NG.pairSlipLegacyW277c1(c.r, c.v, c.w1, c.w2);
  return { id: c.id, label: c.label, r: c.r, v: c.v, w1: c.w1, w2: c.w2,
    fixed: { s1: a.s1, s2: a.s2 }, legacy: { s1: b.s1, s2: b.s2 }, expect: c.expect,
    fixedErr: Math.max(norm(sub(a.s1, c.expect.s1)), norm(sub(a.s2, c.expect.s2))),
    legacyErr: Math.max(norm(sub(b.s1, c.expect.s1)), norm(sub(b.s2, c.expect.s2))),
    swapFixed: NG.pairSlipSwapResidual(c.r, c.v, c.w1, c.w2),
    swapLegacy: NG.pairSlipSwapResidual(c.r, c.v, c.w1, c.w2, NG.pairSlipLegacyW277c1) };
});

/* ══ ② 入れ替え対称性(乱数 64 件・再現可能な LCG) ═════════════════════════ */
let seed = 278003;
const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648 * 2 - 1; };
const rv = () => [rnd(), rnd(), rnd()];
let swapFixedMax = 0, swapLegacyMin = Infinity;
for (let k = 0; k < 64; k++) {
  const r = rv(), v = rv(), w1 = rv(), w2 = rv();
  swapFixedMax = Math.max(swapFixedMax, NG.pairSlipSwapResidual(r, v, w1, w2));
  swapLegacyMin = Math.min(swapLegacyMin, NG.pairSlipSwapResidual(r, v, w1, w2, NG.pairSlipLegacyW277c1));
}

/* ══ ③ html の 2D 実装と s_i・s_j を突き合わせる ═════════════════════════════ */
const htmlRows = [];
let htmlMaxFixed = 0, htmlMaxLegacy = 0;
if (H) {
  const cases2d = MIN_CASES.map((c) => ({ id: c.id, r: c.r, v: c.v, wi: c.w1[2], wj: c.w2[2] }));
  for (let k = 0; k < 32; k++) cases2d.push({ id: 'rand' + k, r: [rnd(), rnd(), 0], v: [rnd(), rnd(), 0],
    wi: 3 * rnd(), wj: 3 * rnd() });
  for (const c of cases2d) {
    const S = fakeS({ m: [1, 0.5], x: [0, c.r[0]], y: [0, c.r[1]], vx: [0, c.v[0]], vy: [0, c.v[1]],
      spin: [c.wi, c.wj], R: [0.1, 0.1], G: 1, kappa: 0.3 });
    const p = H.relativeDragProbe(S, 0, 1, 0.01);
    const a = NG.pairSlip(c.r, c.v, [0, 0, c.wi], [0, 0, c.wj]);
    const b = NG.pairSlipLegacyW277c1(c.r, c.v, [0, 0, c.wi], [0, 0, c.wj]);
    const dFix = Math.max(Math.hypot(p.si[0] - a.s1[0], p.si[1] - a.s1[1]),
      Math.hypot(p.sj[0] - a.s2[0], p.sj[1] - a.s2[1]));
    const dLeg = Math.max(Math.hypot(p.si[0] - b.s1[0], p.si[1] - b.s1[1]),
      Math.hypot(p.sj[0] - b.s2[0], p.sj[1] - b.s2[1]));
    htmlMaxFixed = Math.max(htmlMaxFixed, dFix); htmlMaxLegacy = Math.max(htmlMaxLegacy, dLeg);
    if (!c.id.startsWith('rand')) htmlRows.push({ id: c.id, htmlSi: p.si, htmlSj: p.sj,
      libFixedS2: a.s2.slice(0, 2), libLegacyS2: b.s2.slice(0, 2), diffFixed: dFix, diffLegacy: dLeg,
      zAll: a.s1[2] === 0 && a.s2[2] === 0 });
  }
}

/* ══ ④ lib-w277b の pairSlipStep と html の dfmRelativeDragStep を 1 步ビットで突き合わせる ═══ */
const stepRows = [];
if (H) {
  const states = [
    { id: 'sync', ...CD.syncCircularPair({ m1: 1, m2: 0.3, a: 1, G: 1, R1: 0.05, R2: 0.03 }) },
    { id: 'rand', m: [1, 0.3], x: [0.01, 0.9], y: [-0.02, 0.3], vx: [0.05, -0.4], vy: [-0.1, 0.8],
      spin: [2.5, -0.7], R: [0.05, 0.03] },
  ];
  for (const st of states) {
    const S = fakeS({ m: st.m, x: st.x, y: st.y, vx: st.vx, vy: st.vy, spin: st.spin, R: st.R,
      G: 1, kappa: 0.2 });
    const L = { m: st.m.slice(), x: st.x.slice(), y: st.y.slice(), vx: st.vx.slice(), vy: st.vy.slice(),
      spin: st.spin.slice(), R: st.R.slice() };
    const rH = H.dfmRelativeDragStep(S, 0.01);
    const rL = CD.pairSlipStep(L, { G: 1, kappa: 0.2, dt: 0.01 });
    const same = ['vx', 'vy', 'spin'].every((k) => S[k].every((x, i) => Object.is(x, L[k][i])));
    stepRows.push({ id: st.id, htmlReturned: rH ? 'step' : 'null', htmlKickMax: rH ? rH.kickMax : 0,
      libN: rL.n, htmlDE: rH ? rH.dE : 0, libDE: rL.dE, bitSame: same,
      htmlSlipMax: rH ? rH.slipMax : 0, libSlipMax: rL.slipMax });
  }
}

/* ══ ⑤ slipRmsCircular(1 天体・別実装)と修正後 pairSlip の 360 位相 RMS ══════════ */
const rmsRows = [];
for (const c of [{ W: 1, th: 0 }, { W: 3185.4, th: 40.6 }, { W: 7, th: 90 }, { W: 0.3, th: 120 }]) {
  const t = c.th * Math.PI / 180;
  const w = [c.W * Math.sin(t), 0, c.W * Math.cos(t)];
  let s1 = 0, s2 = 0, s2l = 0;
  for (let i = 0; i < 360; i++) {
    const ph = 2 * Math.PI * i / 360;
    const r = [Math.cos(ph), Math.sin(ph), 0], v = [-Math.sin(ph), Math.cos(ph), 0];
    const a = NG.pairSlip(r, v, w, w), b = NG.pairSlipLegacyW277c1(r, v, w, w);
    s1 += a.s1mag ** 2; s2 += a.s2mag ** 2; s2l += b.s2mag ** 2;
  }
  const ref = NG.slipRmsCircular({ omegaOverN: c.W, thetaDeg: c.th });
  const r1 = Math.sqrt(s1 / 360), r2 = Math.sqrt(s2 / 360), r2l = Math.sqrt(s2l / 360);
  rmsRows.push({ omegaOverN: c.W, thetaDeg: c.th, slipRmsCircular: ref.rms, closed: ref.closed,
    pairSlipS1: r1, pairSlipS2: r2, legacyS2: r2l,
    relDiffFixed: Math.abs(r2 - ref.rms) / Math.max(1e-300, Math.abs(ref.rms) || 1),
    absDiffFixed: Math.abs(r2 - ref.rms), absDiffLegacy: Math.abs(r2l - ref.rms) });
}

/* ══ ⑥ 影響範囲: lib の中で pairSlip を呼ぶ関数 ══════════════════════════════════ */
const libSrc = fs.readFileSync(path.join(ROOT, 'tests', 'lib-w277c-nsgrid.mjs'), 'utf8');
const fnNames = ['bodyTorques', 'nsDerivs', 'nsInvariants', 'transferStep', 'runNsRun', 'classifyTheta',
  'slipTranslationInvariance', 'slipRmsCircular'];
const callers = fnNames.map((fn) => {
  const body = extractFunction(libSrc, fn) || '';
  return { fn, callsPairSlip: /\bpairSlip\(/.test(body) };
});
const expSrc = fs.readFileSync(path.join(ROOT, 'tests', 'exp-w277c-nsgrid.mjs'), 'utf8');
const expCalls = (expSrc.match(/NG\.pairSlip\(/g) || []).length;
const expTrans = (expSrc.match(/NG\.slipTranslationInvariance\(/g) || []).length;

const out = {
  meta: withProvenance({
    note: '第278便c — `pairSlip` の第二天体の符号修正(w277c-1 → w277c-2)の影響範囲。'
      + '**エンジンには 1 bit も触らない**(html は関数のソースを文字列で読むだけ)',
    htmlHasRelativeDrag: htmlHas, htmlVersion: verLine,
  }, {
    root: ROOT, wave: '第278便c', target: 'beta/index.html',
    code: ['tests/exp-w278c-slipaudit.mjs', 'tests/lib-w277c-nsgrid.mjs', 'tests/lib-w277b-charondfm.mjs',
      'tests/lib-w272e-provenance.mjs'],
    inputs: ['beta/index.html', 'tests/lib-w277c-nsgrid.mjs', 'tests/exp-w277c-nsgrid.mjs'],
  }),
  libVersion: NG.NSGRID_VERSION,
  minimal: minRows,
  swap: { cases: 64, fixedMax: swapFixedMax, legacyMin: swapLegacyMin },
  html2d: { available: htmlHas, rows: htmlRows, cases: htmlRows.length + (H ? 32 : 0),
    maxDiffFixed: htmlMaxFixed, maxDiffLegacy: htmlMaxLegacy },
  charonLibStep: stepRows,
  rmsCircular: rmsRows,
  scope: { libCallers: callers, expPairSlipCalls: expCalls, expTranslationInvarianceCalls: expTrans,
    gridDynamicsUsesPairSlip: callers.filter((c) => ['bodyTorques', 'nsDerivs', 'runNsRun',
      'transferStep', 'nsInvariants', 'classifyTheta'].includes(c.fn)).some((c) => c.callsPairSlip),
    note: '格子の力学(bodyTorques・nsDerivs・runNsRun・transferStep)は pairSlip を経由しない。'
      + 'lib で pairSlip を呼ぶのは slipTranslationInvariance だけで、その入力は v を変えない並進なので'
      + ' d2 は修正前後とも 0 である' },
};
fs.mkdirSync(path.join(ROOT, 'tests', 'out'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'tests', 'out', 'slipaudit-w278c.json'), JSON.stringify(out, null, 1));

console.log('# 第278便c — pairSlip の符号修正の影響範囲');
for (const r of minRows) console.log(`  ${r.id.padEnd(16)} 修正後 s2=${JSON.stringify(r.fixed.s2)} (誤差 ${r.fixedErr})`
  + ` / 旧 s2=${JSON.stringify(r.legacy.s2)} (誤差 ${r.legacyErr}) / 入替 ${r.swapFixed} vs 旧 ${r.swapLegacy}`);
console.log(`  入れ替え対称性 64 件: 修正後 最大 ${swapFixedMax} / 旧 最小 ${swapLegacyMin}`);
console.log(`  html 2D(${verLine}): 修正後との最大差 ${htmlMaxFixed} / 旧との最大差 ${htmlMaxLegacy}`);
for (const r of stepRows) console.log(`  lib-w277b pairSlipStep vs html dfmRelativeDragStep ${r.id}: ビット同一 ${r.bitSame}・kickMax ${r.htmlKickMax}・ΔE ${r.htmlDE}`);
for (const r of rmsRows) console.log(`  RMS ω/n=${r.omegaOverN} θ=${r.thetaDeg}: slipRmsCircular ${r.slipRmsCircular} / pairSlip s2 ${r.pairSlipS2} / 旧 s2 ${r.legacyS2}`);
console.log('  影響範囲: ' + callers.map((c) => c.fn + (c.callsPairSlip ? '●' : '○')).join(' ')
  + ` / 器の NG.pairSlip 呼び出し ${expCalls}・slipTranslationInvariance ${expTrans}`);
console.log('→ tests/out/slipaudit-w278c.json');

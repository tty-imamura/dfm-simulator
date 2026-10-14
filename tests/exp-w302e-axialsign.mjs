// 第302便e(原仮定者の裁定(第92報)・統括の検証項目 R189 の細目 AN298 ①⑤): **源の軸と Ω の符号の正準化**の器(Node だけ —— 対象 html の inline script を
// tests/lib-w279b-headless.mjs の loadHtmlHeadless で読み、html の関数 inertialDrag3AxialOmega・inertialDrag3AxialSign・inertialDragProbeAt・inertialDragProbeSample と
// アプリの入口 loadPreset・appStepDt をそのまま呼ぶ。式の写しを持たない)。
//
// ■ 何を測るか
//   part1 7 方向の対照(北 +z・南 −z・赤道 ±x・±y・一般の方向〔下半球〕): 源 1 体(軸 â・自転 Ω)と傾きの無い受け手 6 体を置いた最小の状態で
//         inertialDrag3AxialOmega を (â,Ω) と (−â,−Ω) で 1 回ずつ呼び、受け手ごとのベクトル Σ w â(S._rdWX/WY/WZ)とスカラー(S._rdWS)が
//         ビットで同じか。旧(第301便c)のスカラー Σ w は源 1 体なら σ·(今のスカラー)なので、旧の一致も同じ呼び出しから導く(式を写さない)。
//   part2 🪛 chainDiskToy3dTilt の N 步(既定 2000): 軸引きずりの帳簿(引きずり軸回転の合計・傾きの無い受け手の項数と最大)と姿勢の角 rotA の指紋。
//         W302E_BASE=<基点 html> を渡すと同じ走行を基点でも走らせ、rotA・位置・速度がビットで同じかを記録する(🪛 の源は上半球 —— σ=+1 のまま)。
//   part3 🪛 の源を (−â,−Ω) に置き換えた写し(build の後に軸と自転の符号だけを反転)を N3 步(既定 600)走らせ、元の走行と比べる
//         (源以外の全粒子の位置・速度・rotA がビットで同じか。基点を渡せば基点の同じ対照も —— 旧は傾きの無い受け手の rotA が逆符号に分かれる)。
//   part4 表示(受動プローブ)の点の色: 🪛 を 50 步 → 格子の表の |Σw|max(正準化した符号つき —— 点の色)と ω_z の最大(従来の欄)・
//         実在の傾きの無い受け手 i を p = x_i で引き直した omegaS と核の S._rdWS[i] の相対の最大差。
//
// ■ 言わないこと: 「🪛 の走りが変わった」(上半球の源は 1 bit も変わらない)・「軸引きずりの強さが較正された」。
//
// ■ 使い方
//   node tests/exp-w302e-axialsign.mjs   → 正本 tests/out/axialsign-w302e.json(段 axialsign-302e)
//   W302E_OUT=<json> で出力先を変える(試走は正本を書かない)・W302E_TARGET=<html>(既定 beta/index.html)・W302E_BASE=<基点 html>(記録だけ)・
//   W302E_N / W302E_N3 で步数(既定 2000 / 600)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
// 第281便a の領域 hash の宣言
const REGEN_SCOPE = {"presets":["chainDiskToy3dTilt"],"roots":["HP.REL_DRAG_AXIAL_SIGN_VERSION","HP.inertialDrag3AxialOmega","HP.inertialDrag3AxialSign","HP.inertialDragProbeAt","HP.inertialDragProbeSample","HP.loadPreset","HP.sim","REL_DRAG_AXIAL_SIGN_VERSION","T","appStepDt","ctx","inertialDrag3AxialOmega","inertialDrag3AxialSign","inertialDrag3SpinState","sim"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w302e-axialsign-1';
export const TILT_ID = 'chainDiskToy3dTilt';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const sha = (a) => crypto.createHash('sha1').update(Buffer.from(a.buffer, a.byteOffset, a.byteLength)).digest('hex').slice(0, 16);
const sci = (v) => (Number.isFinite(v) ? Number(v.toPrecision(6)) : v);

/** 7 方向(宣言 —— 赤道は ±x・±y の 4 つ。一般の方向は下半球) */
export const DIRS = (() => {
  const g = [0.3, -0.5, -0.8], gn = Math.hypot(...g);
  return [['north', [0, 0, 1]], ['south', [0, 0, -1]], ['eqXp', [1, 0, 0]], ['eqXm', [-1, 0, 0]], ['eqYp', [0, 1, 0]], ['eqYm', [0, -1, 0]],
    ['general', g.map((v) => v / gn)]];
})();
const RECV = [[3, 1, 2], [-2, 4, -1], [1, -3, 0.5], [0, 0, 5], [4, 0, 0], [-1, -1, -3]];

/** part1: 7 方向の対照(html の inertialDrag3AxialOmega を最小の状態で呼ぶ) */
export function part1(E) {
  const omega = E('inertialDrag3AxialOmega'), sign = E('inertialDrag3AxialSign');
  const kap = 4, eps = 0.5, Om = 0.5, n = 1 + RECV.length;
  const run = (a, om) => {
    const S = { n, x: new Float64Array(n), y: new Float64Array(n), z: new Float64Array(n), m: new Float64Array(n), spin: new Float64Array(n),
      pinned: new Uint8Array(n), sax: new Float64Array(n), say: new Float64Array(n), saz: new Float64Array(n).fill(1), _rdPairSet: null, _rdPairN: 0 };
    S.m[0] = 100; S.spin[0] = om; S.sax[0] = a[0]; S.say[0] = a[1]; S.saz[0] = a[2];
    RECV.forEach((p, k) => { S.x[k + 1] = p[0]; S.y[k + 1] = p[1]; S.z[k + 1] = p[2]; S.m[k + 1] = 1; });
    omega(S, n, kap, eps);
    return { WX: Array.from(S._rdWX.subarray(1, n)), WY: Array.from(S._rdWY.subarray(1, n)), WZ: Array.from(S._rdWZ.subarray(1, n)), WS: Array.from(S._rdWS.subarray(1, n)) };
  };
  const same = (p, q) => p.length === q.length && p.every((v, i) => Object.is(v, q[i]));
  const rows = [];
  for (const [name, a] of DIRS) {
    const na = a.map((v) => -v), sA = sign(a[0], a[1], a[2]), sB = sign(na[0], na[1], na[2]);
    const A = run(a, Om), B = run(na, -Om);
    const vec = same(A.WX, B.WX) && same(A.WY, B.WY) && same(A.WZ, B.WZ), sc = same(A.WS, B.WS);
    // 旧(第301便c)のスカラー Σ w: 源 1 体なら σ·(今のスカラー)(σ = ±1 の掛け算は丸めない)
    const oldA = A.WS.map((v) => sA * v), oldB = B.WS.map((v) => sB * v);
    const nonzero = A.WS.filter((v) => v !== 0).length;
    rows.push({ dir: name, axis: a.map(sci), sigma: [sA, sB], vectorSame: vec, scalarSame: sc, oldScalarSame: same(oldA, oldB), nonzero, ws: A.WS.map(sci), wsSign: sA * Om > 0 ? '+' : '-' });
  }
  const cnt = (f) => rows.filter(f).length;
  return { kappa: kap, eps, omega: Om, receivers: RECV, rows,
    summary: { dirs: rows.length, vectorSame: cnt((r) => r.vectorSame), scalarSame: cnt((r) => r.scalarSame), oldVectorSame: cnt((r) => r.vectorSame), oldScalarSame: cnt((r) => r.oldScalarSame),
      nonzeroAll: rows.every((r) => r.nonzero > 0), equatorRule: rows.filter((r) => r.dir.startsWith('eq')).map((r) => r.dir + ':' + r.sigma[0]).join(',') } };
}

function runTilt(H, steps, flip) {
  const E = H.evalExpr, HP = H.HP;
  HP.loadPreset(TILT_ID, false);
  const S = E('sim'), dt = E('appStepDt')(S);
  let src = -1;
  for (let i = 0; i < S.n; i++) if (S.spin[i] !== 0 && S.m[i] > 0) { src = i; break; }
  if (flip) { S.sax[src] = -S.sax[src]; S.say[src] = -S.say[src]; S.saz[src] = -S.saz[src]; S.spin[src] = -S.spin[src]; }
  const axis0 = [S.sax[src], S.say[src], S.saz[src]];
  let azMin = Infinity;
  for (let k = 0; k < steps; k++) { S.step(dt); if (S.saz[src] < azMin) azMin = S.saz[src]; }
  return { S, src, axis0, azMin, dt };
}

/** part2: 🪛 の N 步(帳簿と指紋) */
export function part2(H, steps, B) {
  const r = runTilt(H, steps, false), S = r.S, n = S.n;
  const st = H.evalExpr('inertialDrag3SpinState')(S) || {};
  const ax = st.axial || {}, sp = ax.split || {};
  const flat = [];
  for (let i = 0; i < n; i++) if (!S.saOn[i]) flat.push(i);
  const out = { id: TILT_ID, steps, dt: r.dt, n, source: r.src, axis0: r.axis0.map(sci), sourceAzMin: sci(r.azMin), sigma: H.evalExpr('inertialDrag3AxialSign')(...r.axis0),
    tiltless: flat.length, rotADragSum: sci(ax.rotA), flatTerms: sp.flatTerms, flatMax: sci(sp.flatMax), tiltTerms: sp.tiltTerms, omegaMax: sci(ax.omegaMax),
    print: { rotA: sha(S.rotA.subarray(0, n)), x: sha(S.x.subarray(0, n)), y: sha(S.y.subarray(0, n)), z: sha(S.z.subarray(0, n)), rotADr: S.rotADr ? sha(S.rotADr.subarray(0, n)) : null } };
  if (B) {
    const q = runTilt(B, steps, false), T = q.S;
    const eq = (k) => T[k] && S[k] && sha(T[k].subarray(0, n)) === sha(S[k].subarray(0, n));
    out.base = { rotA: eq('rotA'), x: eq('x'), y: eq('y'), z: eq('z'), vx: eq('vx'), vy: eq('vy'), vz: eq('vz'), rotADr: eq('rotADr') };
  }
  return out;
}

function flipCompare(H, steps) {
  const A = runTilt(H, steps, false), keep = {};
  const n = A.S.n;
  for (const k of ['x', 'y', 'z', 'vx', 'vy', 'vz', 'rotA']) keep[k] = A.S[k].slice(0, n);
  const B = runTilt(H, steps, true), src = A.src;
  const o = { diffKeys: [], flatRotADiff: 0, flatRotAMax: 0, flatRotAOpposite: 0, flat: 0 };
  for (const k of ['x', 'y', 'z', 'vx', 'vy', 'vz', 'rotA']) {
    let d = 0;
    for (let i = 0; i < n; i++) { if (i === src) continue; if (!Object.is(keep[k][i], B.S[k][i])) d++; }
    if (d) o.diffKeys.push(k + ':' + d);
  }
  for (let i = 0; i < n; i++) {
    if (i === src || B.S.saOn[i]) continue;
    o.flat++;
    const a = keep.rotA[i], b = B.S.rotA[i];
    if (Math.abs(a - b) > o.flatRotADiff) o.flatRotADiff = Math.abs(a - b);
    if (Math.abs(a) > o.flatRotAMax) o.flatRotAMax = Math.abs(a);
    if (a !== 0 && Math.sign(a) !== Math.sign(b)) o.flatRotAOpposite++;
  }
  o.flatRotADiff = sci(o.flatRotADiff); o.flatRotAMax = sci(o.flatRotAMax);
  o.sameExceptSource = o.diffKeys.length === 0;
  return o;
}
/** part3: 源を (−â,−Ω) に置き換えた 🪛 と元の走行の対照 */
export function part3(H, steps, B) {
  const out = { id: TILT_ID, steps, now: flipCompare(H, steps) };
  if (B) out.base = flipCompare(B, steps);
  return out;
}

/** part4: 受動プローブの点の色(正準化した Σw)と核の S._rdWS の一致。表の範囲は第298便c の器(tests/exp-w298c-drag3d.mjs の part3 の tilt)と同じ */
export const PROBE_VIEW = { mode: 'drag', cx: 0, cy: 0, hx: 30, hy: 30, res: 16, frame: 'centroid' };
export function part4(H, steps) {
  const E = H.evalExpr, HP = H.HP;
  HP.loadPreset(TILT_ID, false);
  const S = E('sim'), dt = E('appStepDt')(S);
  for (let k = 0; k < steps; k++) S.step(dt);
  const D = HP.inertialDragProbeSample(S, PROBE_VIEW);
  let rel = 0, checked = 0, scale = 0;
  const lim = Math.min(S.n, 64);
  for (let i = 0; i < S.n; i++) if (!S.saOn[i]) scale = Math.max(scale, Math.abs(S._rdWS[i]));
  for (let i = 0; i < lim; i++) {
    if (S.saOn[i] || S.pinned[i] || !(S.m[i] > 0)) continue;
    const q = HP.inertialDragProbeAt(S, 0, 0, 0, { skip: i });
    if (!q || q.omegaS === null || q.omegaS === undefined) continue;
    checked++;
    const e = Math.abs(q.omegaS - S._rdWS[i]) / (scale || 1);
    if (e > rel) rel = e;
  }
  let pos = 0, neg = 0;
  if (D && D.ws) for (let k = 0; k < D.nodes; k++) { if (D.ws[k] > 0) pos++; else if (D.ws[k] < 0) neg++; }
  return { id: TILT_ID, steps, nodes: D ? D.nodes : 0, ready: !!(D && D.ready && D.ready.ready), wsMax: sci(D ? D.wsMax : NaN), wzMax: sci(D ? D.wMax : NaN),
    wsPos: pos, wsNeg: neg, receiverChecked: checked, receiverRelMax: sci(rel) };
}

export function gatesOf(o) {
  const p1 = o.part1.summary;
  return {
    vector7: p1.vectorSame === 7,
    scalar7: p1.scalarSame === 7,
    oldScalarAllDiffer: p1.oldScalarSame === 0,
    nonzero: p1.nonzeroAll === true,
    equator: p1.equatorRule === 'eqXp:1,eqXm:-1,eqYp:1,eqYm:-1',
    tiltUpper: o.part2.sigma === 1 && o.part2.sourceAzMin > 0,
    tiltBaseSame: !o.part2.base || Object.values(o.part2.base).every(Boolean),
    flipSame: o.part3.now.sameExceptSource === true && o.part3.now.flatRotADiff === 0,
    flipBaseDiffers: !o.part3.base || (o.part3.base.flatRotAOpposite > 0),
    probeReady: o.part4.ready === true && o.part4.receiverChecked > 0 && o.part4.receiverRelMax <= 1e-8,
  };
}

export function runAll(H, B, o) {
  const N = (o && o.N) || 2000, N3 = (o && o.N3) || 600;
  const out = { part1: part1(H.evalExpr), part2: part2(H, N, B), part3: part3(H, N3, B), part4: part4(H, 50) };
  out.gates = gatesOf(out);
  out.ok = Object.values(out.gates).every(Boolean);
  return out;
}

export async function main() {
  const TARGET = process.env.W302E_TARGET || 'beta/index.html';
  const OUT = process.env.W302E_OUT || path.join(ROOT, 'tests', 'out', 'axialsign-w302e.json');
  const BASE = process.env.W302E_BASE || null;
  const N = Number(process.env.W302E_N) || 2000, N3 = Number(process.env.W302E_N3) || 600;
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now();
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const H = loadHtmlHeadless(html);
  const B = BASE ? loadHtmlHeadless(path.isAbsolute(BASE) ? BASE : path.join(ROOT, BASE)) : null;
  const R = runAll(H, B, { N, N3 });
  const out = { version: HARNESS_VERSION, generator: 'tests/exp-w302e-axialsign.mjs', target: TARGET,
    targetSha256: crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex'),
    base: BASE ? { file: BASE, sha256: crypto.createHash('sha256').update(fs.readFileSync(path.isAbsolute(BASE) ? BASE : path.join(ROOT, BASE))).digest('hex').slice(0, 12) } : null,
    ruling: '原仮定者の裁定(第92報)・統括の検証項目 R189(AN298 ①⑤ —— 源の軸を上半球へ正規化して符号を Ω へ移す・赤道は y → x の順)',
    signVersion: H.evalExpr('REL_DRAG_AXIAL_SIGN_VERSION'), steps: { N, N3, probe: 50 }, ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w302e-axialsign.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第302便e', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION,
    engine: 'Node の headless(tests/lib-w279b-headless.mjs の loadHtmlHeadless —— html の本文をそのまま実行・1 プロセス)',
    notClaim: ['🪛 の走りが変わった', '軸引きずりの強さが較正された'] });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s');
}
if (IS_MAIN) await main();

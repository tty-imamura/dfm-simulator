// 第298便c(原仮定者の裁定(第88報)「三次元の慣性決定力: 『回転引きずり』は赤道面で最大・自転軸方向でゼロ。『並進引きずり』『回転引きずり』と別に『軸引きずり』
// —— 自転軸方向で最大・同じ軸の向きに回転させる・赤道面でゼロ」「geoPN=4 は慣性決定力の多粒子版・三次元が既定・表示の『空間メッシュ』で渦状の引きずりが見えるよう
// 物理と表示の両面で精度を上げる(表示は Z=0 の公転面)」・統括の検証項目 R167)—— **三次元の慣性決定力 3 成分・受動プローブ・🔗 の三次元の写しの器**
// (Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、エンジン本体を走らせる。1 プロセス)。
//
// ■ 何を測るか(零試験は「同じか」の照合・数は値の記録 —— 物理の合否は書かない)
//   ① 零試験 6 つ(ブリーフの (1)〜(6)):
//      (1) 軸 +z・全員 z=0・axial off の三次元 = 二次元の表裏核(spinSource:"surfaceFlip")と全状態ビット同一(🔗 の写し n=81 PCG・3 体の直接法)
//      (2) 受け手が軸上 → 回転の項 0・軸の項 ≠ 0 (3) 赤道 → 軸の項 0・回転の項は最大 (4) 軸を反転 → 回転の項と軸の項が両方反転(ビット)
//      (5) 共通の平行移動・回転で共変(倍精度の状態 —— 回転した初期条件の走行と、元の走行を回した状態の差)(6) 運動量・角運動量(自転を含む)の収支
//   ② 有限球の収束: 一様球の ⟨K_ε(|d−ρ|) ρ⟩ を三次元の直積の求積(半径 × cos × 方位)で求め、閉じた形 M1(r)·ê と比べる(緯度 0/30/60/90°・r=0.5/1.5/3/10 R)。
//      Gauss–Legendre の点数(区間あたり 4/8/16/32)の M1 の差。回転の項の大きさ / (C m Ω M1) = sin(緯度の余角)。
//   ③ 受動プローブ: 門(実在の受け手で引き直した u と核の u の相対差)・表示 ON/OFF で状態の指紋が同じ・格子の収束(双一次の補間の誤差が細分で減る)・
//      渦の循環(源のまわりの円の ∮u·dl —— 自転源ありと 0 の対照)。
//   ④ 🔗 の三次元の写し 2 本(軸 +z・軸を 30° 傾けて軸引きずりを宣言)の 2000 步: 帯ごとの角変位・面外の変位・解法の反復と残差・帳簿。
//   ⑤ 受理: spinSource・dragCore が三次元で受理される(第 2 段で開けた)・spinDrag は二次元で拒否・鍵の検査。
//
// ■ しないこと・言わないこと
//   ・軸引きずりの係数 axialCoupling は宣言値(未較正 —— notClaim axial_drag_unfitted)。gain と同じ数を黙って使わない。
//   ・回転引きずりに sin² を重ねない・軸引きずりを線速度に足さない・表示のために物理にない渦を描かない。
//
// 実行: node tests/exp-w298c-drag3d.mjs → 正本 tests/out/drag3d-w298c.json(W298C_OUT で出力先を変える)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
const REGEN_SCOPE = {"presets":"all","roots":["HP.allPresets","HP.coord3d","HP.dfmGaussLegendre01","HP.inertialDrag3AxialOmega","HP.inertialDrag3RotTerm","HP.inertialDragProbeAt","HP.inertialDragProbeBilinear","HP.inertialDragProbeReady","HP.inertialDragProbeSample","HP.inertialDragProbeStreamlines","HP.inertialDragState","HP.inertialSpinMoment","HP.validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w298c-drag3d-1';
export const BOOKS = Object.freeze({ chain: 'chainDiskToy', chain3d: 'chainDiskToy3d', chain3dTilt: 'chainDiskToy3dTilt', moon3d: 'earthMoonSunInertial3d' });
export const SRC_AXIS = '宣言(第298便c の原理の本 —— 観測ではない)';
export const TILT = Object.freeze({ tiltDeg: 30, azimuthDeg: 0, axialCoupling: 4 });
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const DT = 0.016;
const clone = (x) => JSON.parse(JSON.stringify(x));
const sci = (v) => (Number.isFinite(v) ? Number(v.toPrecision(6)) : v);
const find = (HP, id) => HP.allPresets().find((q) => q.id === id);
function simOf(HP, preset) {
  const v = HP.validatePreset(clone(preset));
  if (!v.ok) throw new Error('受理されない: ' + JSON.stringify(v.errors).slice(0, 300));
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  return S;
}
const KEYS = ['x', 'y', 'vx', 'vy', 'spin', 'rotA'];
function compare(S2, S3) {
  let nDiff = 0, nVal = 0, maxAbs = 0;
  for (const k of KEYS) for (let i = 0; i < S2.n; i++) { nVal++; const a = S2[k][i], b = S3[k][i]; if (!Object.is(a, b)) { nDiff++; maxAbs = Math.max(maxAbs, Math.abs(a - b)); } }
  for (const k of ['t', 'radE']) { nVal++; if (!Object.is(S2[k], S3[k])) { nDiff++; maxAbs = Math.max(maxAbs, Math.abs(S2[k] - S3[k])); } }
  let zMax = 0; if (S3.z) for (let i = 0; i < S3.n; i++) zMax = Math.max(zMax, Math.abs(S3.z[i]), Math.abs(S3.vz[i]));
  return { nVal, nDiff, maxAbs, same: nDiff === 0, zMax };
}
// 状態の指紋(QA behavior.meshDisplayBitsame と同じ流儀 —— 数値・真偽値の欄と型付き配列の全部・表示のキャッシュ _sm・_sl・_gal で始まる鍵は除く)+ S.params
export function fingerprint(S) {
  let h1 = 0x811c9dc5, h2 = 0x01000193; const f64 = new Float64Array(1), u8 = new Uint8Array(f64.buffer);
  const mix = (b) => { h1 = Math.imul(h1 ^ b, 16777619) >>> 0; h2 = Math.imul(h2 ^ b, 2246822519) >>> 0; };
  const num = (v) => { f64[0] = v; for (let k = 0; k < 8; k++) mix(u8[k]); };
  const str = (s) => { for (let k = 0; k < s.length; k++) mix(s.charCodeAt(k) & 255); };
  let nKeys = 0;
  for (const k of Object.keys(S).sort()) {
    if (/^_s[mlg]|^_gal/.test(k)) continue;
    const v = S[k];
    if (typeof v === 'number') { str(k); num(v); nKeys++; }
    else if (typeof v === 'boolean') { str(k); mix(v ? 1 : 0); nKeys++; }
    else if (ArrayBuffer.isView(v) && !(v instanceof DataView)) { str(k); for (let i = 0; i < v.length; i++) num(Number(v[i])); nKeys++; }
  }
  str(JSON.stringify(S.params));
  return h1.toString(16) + h2.toString(16) + ':' + nKeys;
}

/* ── 🔗 の三次元の写し(html の本と同じであるべき形 —— QA preset.geo4Std298 が照合する)── */
export function chain3dPreset(HP, tilt) {
  const q = clone(find(HP, BOOKS.chain));
  for (const k of ['id', 'emoji', 'abBody']) delete q[k];
  q.physics = Object.assign({ coord: '3d' }, q.physics);
  const rd = q.physics.relativeDrag; delete rd.spinSource;
  rd.spinDrag = tilt ? { rot: 'surfaceFlip', axial: 'on', axialCoupling: TILT.axialCoupling } : { rot: 'surfaceFlip', axial: 'off' };
  q.bodies[0] = Object.assign({}, q.bodies[0], { spinAxis: tilt ? { enable: true, tiltDeg: TILT.tiltDeg, azimuthDeg: TILT.azimuthDeg, source: SRC_AXIS } : { enable: true, tiltDeg: 0, source: SRC_AXIS } });
  return q;
}
/** 小さな系(直接法): 自転する源 1 個(pinned でない)+受け手 k 個。z と軸は引数で */
function smallSys(o) {
  const ph = { coord: o.c3 === false ? undefined : '3d', G: o.G === undefined ? 0.01 : o.G, D0: 2, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, etaRad: 0, geoPN: 3, lambdaPN: 0,
    softening: 0.3, radiusScale: 1, cLight: 30, contactMode: 'none', stateCarry: 'double', massPrecision: 'double',
    relativeDrag: Object.assign({ law: 'inertial', gain: o.gain === undefined ? 2 : o.gain, eps: 0.5, pairs: 'all' }, o.rd || {}) };
  if (ph.coord === undefined) delete ph.coord;
  const B = [Object.assign({ type: 'single', m: 50, radius: 2, x: 0, y: 0, vx: 0, vy: 0, spin: 0.6, pinned: !!o.pinSrc }, o.src || {})];
  for (const r of o.recv) B.push(Object.assign({ type: 'single', m: 1, radius: 0.3, spin: 0, pinned: false }, r));
  return { name: 'w298c', description: 'w298c', sampleClass: 'principle', camera: { scale: 50 }, world: { boundary: 'none', size: 0 }, physics: ph, bodies: B };
}

/* ───────── ① 零試験 ───────── */
function part1(HP) {
  const out = {};
  // (1) 二次元の表裏核とビット同一
  const run = (name, p2, p3, steps) => {
    const S2 = simOf(HP, p2), S3 = simOf(HP, p3);
    for (let k = 0; k < steps; k++) { S2.step(DT); S3.step(DT); }
    const st2 = HP.inertialDragState(S2), st3 = HP.inertialDragState(S3);
    out[name] = Object.assign({ steps, coord3d: S3.coord3d === true, coord2d: S2.coord3d !== true,
      spinTerms2: st2.compose.chain ? st2.compose.chain.spinTerms : null, spinTerms3: st3.spin3 ? st3.spin3.rot.terms : null,
      spinMaxSame: !!(st2.compose.chain && st3.spin3 && st2.compose.chain.spinMax === st3.spin3.rot.max) }, compare(S2, S3));
  };
  const c2 = clone(find(HP, BOOKS.chain)); delete c2.id;
  const c3 = chain3dPreset(HP, false);
  const c3s = clone(c2); c3s.physics = Object.assign({ coord: '3d' }, c3s.physics);   // spinSource をそのまま三次元で(別名)
  run('chainPcg_spinDrag', c2, c3, 200);
  run('chainPcg_spinSource', c2, c3s, 200);
  const sm2 = smallSys({ c3: false, rd: { spinSource: 'surfaceFlip' }, recv: [{ x: 6, y: 1, vx: 0, vy: 0.2 }, { x: -4, y: 5, vx: 0.1, vy: 0 }] });
  const sm3 = smallSys({ rd: { spinDrag: { rot: 'surfaceFlip', axial: 'off' } }, recv: [{ x: 6, y: 1, vx: 0, vy: 0.2 }, { x: -4, y: 5, vx: 0.1, vy: 0 }] });
  run('direct3_spinDrag', sm2, sm3, 400);
  // 項そのもの(源の軸・受け手の位置を置いた 1 回の評価 —— 純関数として呼ぶ)
  const termAt = (ax, recv, o = {}) => {
    const p = smallSys({ rd: { spinDrag: { rot: 'surfaceFlip', axial: 'on', axialCoupling: 3 } }, recv: recv.map((r) => ({ x: r[0], y: r[1], z: r[2], vx: 0, vy: 0 })),
      src: { spinAxis: { enable: true, source: SRC_AXIS, tiltDeg: ax.tilt, azimuthDeg: ax.az } } });
    const S = simOf(HP, p), n = S.n;
    if (o.flip) { S.sax[0] = -S.sax[0]; S.say[0] = -S.say[0]; S.saz[0] = -S.saz[0]; }
    if (o.axis) { S.sax[0] = o.axis[0]; S.say[0] = o.axis[1]; S.saz[0] = o.axis[2]; }
    S._rdUX = new Float64Array(n); S._rdUY = new Float64Array(n); S._rdUZ = new Float64Array(n);
    S._rdPairSet = null; S._rdPairN = n;
    HP.inertialDrag3RotTerm(S, n, S.relDrag.gain, S.relDrag.eps);
    HP.inertialDrag3AxialOmega(S, n, 3, S.relDrag.eps);
    return { u: [...Array(n).keys()].map((i) => [S._rdUX[i], S._rdUY[i], S._rdUZ[i]]), w: [...Array(n).keys()].map((i) => [S._rdWX[i], S._rdWY[i], S._rdWZ[i]]),
      axis: [S.sax[0], S.say[0], S.saz[0]], S };
  };
  // (2) 軸上(+z と傾けた軸)・(3) 赤道
  const ax1 = termAt({ tilt: 0, az: 0 }, [[0, 0, 5], [5, 0, 0], [0, 0, -5]]);
  const ta = { tilt: 30, az: 40 };
  const t0 = termAt(ta, [[0, 0, 0.001]]);   // 軸を読むだけ
  const a = t0.axis, perp = (() => { const q = [-a[1], a[0], 0], nq = Math.hypot(...q); return q.map((v) => v / nq); })();
  const ax2 = termAt(ta, [a.map((v) => 5 * v), perp.map((v) => 5 * v)]);
  const mag = (v) => Math.hypot(v[0], v[1], v[2]);
  const gl = HP.dfmGaussLegendre01(HP.REL_DRAG_SPIN_NODES), M1 = HP.inertialSpinMoment(5, 2, 0.5, gl), Kp = 5 / ((25 + 0.25) * (25 + 0.25));
  out.onAxis = { rotUz: mag(ax1.u[1]), axialW: mag(ax1.w[1]), axialWexpect: 3 * ax1.S.m[0] * ax1.S.spin[0] * Kp, rotUtilt: mag(ax2.u[1]), axialWtilt: mag(ax2.w[1]),
    southRotU: mag(ax1.u[3]), southW: ax1.w[3] };
  const S1e = ax1.S, rEq = Math.hypot(S1e.x[2] - S1e.x[0], S1e.y[2] - S1e.y[0], S1e.z[2] - S1e.z[0]), M1eq = HP.inertialSpinMoment(rEq, S1e.radOv[0], 0.5, gl);
  out.equator = { rotU: mag(ax1.u[2]), rotUexpect: 2 * S1e.m[0] * S1e.spin[0] * M1eq, spinStored: S1e.spin[0], axialW: mag(ax1.w[2]), axialWzero: ax1.w[2].every((v) => v === 0), rotUtilt: mag(ax2.u[2]), axialWtilt: mag(ax2.w[2]) };
  // 緯度ごと: |回転の項| / (C m Ω M1) と sin(余緯度)・軸の項 / (κ m Ω K) と μ²
  out.latitude = [0, 15, 30, 45, 60, 75, 90].map((lat) => {
    const la = lat * Math.PI / 180, R = termAt({ tilt: 0, az: 0 }, [[5 * Math.cos(la), 0, 5 * Math.sin(la)]]);
    return { lat, rotRatio: sci(mag(R.u[1]) / (2 * 50 * 0.6 * M1)), cosLat: sci(Math.cos(la)), axialRatio: sci(mag(R.w[1]) / (3 * 50 * 0.6 * Kp)), sin2Lat: sci(Math.sin(la) ** 2) };
  });
  // (4) 軸の反転: 両方の項がビットで反転
  const rec = [[3, 2, 1], [-2, 4, -3], [1, -5, 2], [6, 0.5, -0.5]];
  const F0 = termAt(ta, rec), F1 = termAt(ta, rec, { flip: true });
  let flipBit = true, flipN = 0;
  for (let i = 1; i < F0.u.length; i++) for (let k = 0; k < 3; k++) { flipN += 2; if (!Object.is(F1.u[i][k], -F0.u[i][k]) || !Object.is(F1.w[i][k], -F0.w[i][k])) flipBit = false; }
  out.flip = { bitNegated: flipBit, nValues: flipN };
  // (5) 共変: 回転 R と平行移動を当てた初期条件の走行(倍精度)と、元の走行を R で回した状態
  const Rm = (() => { const ang = [0.7, -1.1, 0.4], c = ang.map(Math.cos), s = ang.map(Math.sin);
    const Rx = [[1, 0, 0], [0, c[0], -s[0]], [0, s[0], c[0]]], Ry = [[c[1], 0, s[1]], [0, 1, 0], [-s[1], 0, c[1]]], Rz = [[c[2], -s[2], 0], [s[2], c[2], 0], [0, 0, 1]];
    const mm = (A, B) => A.map((r) => [0, 1, 2].map((j) => r[0] * B[0][j] + r[1] * B[1][j] + r[2] * B[2][j])); return mm(Rz, mm(Ry, Rx)); })();
  const ap = (v) => [0, 1, 2].map((i) => Rm[i][0] * v[0] + Rm[i][1] * v[1] + Rm[i][2] * v[2]);
  const shift = [37.5, -12.25, 8];
  const base = smallSys({ G: 0.02, rd: { spinDrag: { rot: 'surfaceFlip', axial: 'on', axialCoupling: 3 } }, src: { vx: 0.01, vy: -0.02, spinAxis: { enable: true, source: SRC_AXIS, tiltDeg: 30, azimuthDeg: 40 } },
    recv: [{ x: 6, y: 1, z: 0.5, vx: 0, vy: 0.25, vz: 0.02, spinAxis: { enable: true, source: SRC_AXIS, tiltDeg: 10, azimuthDeg: 0 }, spin: 0.2 }, { x: -4, y: 5, z: -1, vx: 0.18, vy: 0, vz: 0 }, { x: 1, y: -7, z: 2, vx: -0.2, vy: 0.03, vz: 0.01 }] });
  const S0 = simOf(HP, base);
  const axisOf = (S, i) => [S.sax[i], S.say[i], S.saz[i]];
  const rot = clone(base);
  rot.bodies.forEach((b, i) => {
    const p = ap([b.x, b.y, b.z || 0]), v = ap([b.vx, b.vy, b.vz || 0]);
    b.x = p[0] + shift[0]; b.y = p[1] + shift[1]; b.z = p[2] + shift[2]; b.vx = v[0]; b.vy = v[1]; b.vz = v[2];
  });
  const S1 = simOf(HP, rot);
  for (let i = 0; i < S0.n; i++) { if (!S0.saOn[i]) continue; const r = ap(axisOf(S0, i)); S1.sax[i] = r[0]; S1.say[i] = r[1]; S1.saz[i] = r[2]; S1.sa0x[i] = r[0]; S1.sa0y[i] = r[1]; S1.sa0z[i] = r[2]; }
  const STEPS = 1500;
  for (let k = 0; k < STEPS; k++) { S0.step(DT); S1.step(DT); }
  let dr = 0, rs = 0, dv = 0, vs = 0, da = 0;
  for (let i = 0; i < S0.n; i++) {
    const p = ap([S0.x[i], S0.y[i], S0.z[i]]), v = ap([S0.vx[i], S0.vy[i], S0.vz[i]]);
    dr = Math.max(dr, Math.hypot(p[0] + shift[0] - S1.x[i], p[1] + shift[1] - S1.y[i], p[2] + shift[2] - S1.z[i])); rs = Math.max(rs, Math.hypot(p[0], p[1], p[2]));
    dv = Math.max(dv, Math.hypot(v[0] - S1.vx[i], v[1] - S1.vy[i], v[2] - S1.vz[i])); vs = Math.max(vs, Math.hypot(...v));
    if (S0.saOn[i]) { const a2 = ap(axisOf(S0, i)); da = Math.max(da, Math.hypot(a2[0] - S1.sax[i], a2[1] - S1.say[i], a2[2] - S1.saz[i])); }
  }
  // rotA は有効化した軸の粒子だけ(軸を持たない粒子は +z の規約 —— 系を回しても +z なので共変にならない〔第298便a の規約〕)
  const dRot = Math.max(...[...Array(S0.n).keys()].filter((i) => S0.saOn[i]).map((i) => Math.abs(S0.rotA[i] - S1.rotA[i])));
  const st0 = HP.inertialDragState(S0);
  out.covariance = { steps: STEPS, relDr: sci(dr / rs), relDv: sci(dv / vs), maxDaxis: sci(da), maxDrotA: sci(dRot), shift, axialTerms: st0.spin3.axial.terms, rotTerms: st0.spin3.rot.terms,
    axisTurns: st0.spin3.axial.axisTurns };
  // (6) 収支: 運動量(pinned なし —— 移送は v を触らない)・角運動量(軌道+自転 I s â)= 初期 + 移送の帳簿 dL3 + 軸引きずりの帳簿 + 歳差の拘束
  const S6 = simOf(HP, base);
  const T0 = HP.coord3d.totals(S6), L0 = T0.L, P0 = T0.P, Ps = Math.hypot(...[0, 1, 2].map((q) => { let s = 0; for (let i = 0; i < S6.n; i++) s += Math.abs(S6.m[i] * [S6.vx, S6.vy, S6.vz][q][i]); return s; }));
  let maxP = 0, maxL = 0, Lsc = 0;
  for (let k = 1; k <= 3000; k++) {
    S6.step(DT);
    if (k % 50) continue;
    const T = HP.coord3d.totals(S6), st = HP.inertialDragState(S6).spin3;
    maxP = Math.max(maxP, Math.hypot(T.P[0] - P0[0], T.P[1] - P0[1], T.P[2] - P0[2]) / Ps);
    const ledger = [0, 1, 2].map((q) => st.dL3[q] + st.axial.dLspin[q] + T.prescL[q]);
    const dL = [0, 1, 2].map((q) => T.L[q] - L0[q]);
    Lsc = Math.max(Lsc, Math.hypot(...dL));
    maxL = Math.max(maxL, Math.hypot(...[0, 1, 2].map((q) => dL[q] - ledger[q])));
  }
  const st6 = HP.inertialDragState(S6).spin3;
  out.budget = { steps: 3000, relP: sci(maxP), dLmax: sci(Lsc), Lresid: sci(maxL), Lscale: sci(Math.hypot(...L0)), relLresid: sci(maxL / Math.hypot(...L0)),
    dL3: st6.dL3.map(sci), dLspin: st6.axial.dLspin.map(sci), axisTurns: st6.axial.axisTurns, perpSkip: st6.axial.perpSkip };
  out.allSame = ['chainPcg_spinDrag', 'chainPcg_spinSource', 'direct3_spinDrag'].every((k) => out[k].same);
  return out;
}

/* ───────── ② 有限球の収束 ───────── */
function part2(HP) {
  const glOf = (n) => HP.dfmGaussLegendre01(n);
  const R = 1, eps = 0.1;
  // 一様球の ⟨K_ε(|d−ρ|) ρ⟩(体積平均)を直積の Gauss–Legendre(半径 s・cos μ・方位 φ)で。d は受け手の位置(源の中心から)
  const cub = (d, N) => {
    const g = glOf(N), out = [0, 0, 0]; let wsum = 0;
    for (let a = 0; a < N; a++) { const s = R * g.x[a], ws = R * g.w[a] * s * s;
      for (let b = 0; b < N; b++) { const mu = -1 + 2 * g.x[b], wm = 2 * g.w[b], st = Math.sqrt(Math.max(0, 1 - mu * mu));
        for (let c = 0; c < 2 * N; c++) { const ph = 2 * Math.PI * (c + 0.5) / (2 * N), wp = 2 * Math.PI / (2 * N);
          const rho = [s * st * Math.cos(ph), s * st * Math.sin(ph), s * mu], dx = d[0] - rho[0], dy = d[1] - rho[1], dz = d[2] - rho[2], r2 = dx * dx + dy * dy + dz * dz, r = Math.sqrt(r2), K = r / ((r2 + eps * eps) ** 2);
          const w = ws * wm * wp; out[0] += w * K * rho[0]; out[1] += w * K * rho[1]; out[2] += w * K * rho[2]; wsum += w; } } }
    return out.map((v) => v / wsum);
  };
  const rows = [];
  const gl16 = glOf(16);
  for (const r of [0.5, 1.5, 3, 10]) for (const lat of [0, 30, 60, 90]) {
    const la = lat * Math.PI / 180, e = [Math.cos(la), 0, Math.sin(la)], d = e.map((v) => r * v);
    const M1 = HP.inertialSpinMoment(r, R, eps, gl16);
    const cs = [8, 16, 32, 48].map((N) => { const c = cub(d, N), par = c[0] * e[0] + c[1] * e[1] + c[2] * e[2], perp = Math.hypot(c[0] - par * e[0], c[1] - par * e[1], c[2] - par * e[2]);
      return { N, relPar: sci(Math.abs(par - M1) / Math.abs(M1)), relPerp: sci(perp / Math.abs(M1)) }; });
    rows.push({ r, lat, M1: sci(M1), cub: cs });
  }
  const nodes = [4, 8, 16, 32].map((n) => ({ n, rel: Math.max(...[0.5, 1.2, 3, 10].map((r) => { const ref = HP.inertialSpinMoment(r, R, eps, glOf(64)); return Math.abs(HP.inertialSpinMoment(r, R, eps, glOf(n)) - ref) / Math.abs(ref); })) }))
    .map((z) => ({ n: z.n, rel: sci(z.rel) }));
  const far = [20, 50, 100].map((r) => ({ r, ratio: sci(HP.inertialSpinMoment(r, R, 0, gl16) / (0.6 * R * R / r ** 4)) }));
  // 収束の門: 最も細かい直積(N=48)で ê 方向が閉じた形と、垂直成分が 0 に近いこと(r ≥ 1.5R —— 内部 r=0.5 は核の軟化 ε で鋭い頂を持つので記録だけ)
  const outside = rows.filter((z) => z.r >= 1.5), fine = (z) => z.cub[z.cub.length - 1];
  return { R, eps, rows, nodes, farLimit: far, outsideParMax: sci(Math.max(...outside.map((z) => fine(z).relPar))), outsidePerpMax: sci(Math.max(...outside.map((z) => fine(z).relPerp))),
    monotone: outside.every((z) => z.cub[z.cub.length - 1].relPar <= z.cub[0].relPar + 1e-15) };
}

/* ───────── ③ 受動プローブ ───────── */
function part3(HP) {
  const out = {};
  const ready = (S) => { const r = HP.inertialDragProbeReady(S); return { ready: r.ready, why: r.why, checked: r.checked, relMax: sci(r.relMax) }; };
  const c3 = simOf(HP, chain3dPreset(HP, false)), c2 = simOf(HP, (() => { const p = clone(find(HP, BOOKS.chain)); delete p.id; return p; })());
  const t3 = simOf(HP, chain3dPreset(HP, true));
  const pair = simOf(HP, (() => { const p = clone(find(HP, 'inertialDragPair')); delete p.id; return p; })());
  out.readyBuild = ready(c3);
  for (let k = 0; k < 50; k++) { c3.step(DT); c2.step(DT); t3.step(DT); pair.step(DT); }
  out.ready = { chain3d: ready(c3), chain2d: ready(c2), chain3dTilt: ready(t3), pair2d: ready(pair) };
  // 表示 ON/OFF で状態の指紋が同じ(10 步ごとに格子の表・流線・プローブを呼ぶ)
  const view = { mode: 'drag', cx: 0, cy: 0, hx: 30, hy: 30, res: 16, frame: 'centroid' };
  const A = simOf(HP, chain3dPreset(HP, true)), B = simOf(HP, chain3dPreset(HP, true));
  let calls = 0, drawn = 0;
  for (let k = 1; k <= 300; k++) {
    A.step(DT); B.step(DT);
    if (k % 10 === 0) { const D = HP.inertialDragProbeSample(B, view); calls++; if (D && D.ux) { drawn++; HP.inertialDragProbeStreamlines(D, 12, 48); HP.inertialDragProbeAt(B, 3, 4, 0.5, { frame: 'coordinate' }); } }
  }
  out.displayBitsame = { steps: 300, calls, drawn, fpA: fingerprint(A), fpB: fingerprint(B), same: fingerprint(A) === fingerprint(B) };
  // 格子の収束: 双一次の補間と厳密なプローブの差(視野 ±24・格子の外の縁と源のすぐ近く r<3 は除く)
  const pts = []; let sd = 20261010; const rnd = () => { sd = (Math.imul(sd, 1103515245) + 12345) >>> 0; return sd / 4294967296; };
  for (let k = 0; k < 400; k++) { const x = -20 + 40 * rnd(), y = -20 + 40 * rnd(); if (Math.hypot(x, y) > 3) pts.push([x, y]); }
  const exact = pts.map((p) => HP.inertialDragProbeAt(t3, p[0], p[1], 0, { frame: 'centroid' }).u);
  const uS = Math.max(...exact.map((u) => Math.hypot(u[0], u[1])));
  out.grid = [8, 16, 48].map((res) => {
    const D = HP.inertialDragProbeSample(t3, { mode: 'drag', cx: 0, cy: 0, hx: 24, hy: 24, res, frame: 'centroid' });
    let em = 0, es = 0, nn = 0;
    pts.forEach((p, i) => { const u = HP.inertialDragProbeBilinear(D, p[0], p[1]); if (!u) return; const e = Math.hypot(u[0] - exact[i][0], u[1] - exact[i][1]) / uS; em = Math.max(em, e); es += e * e; nn++; });
    return { res, h: D.h, nodes: D.nodes, n: nn, maxRel: sci(em), rmsRel: sci(Math.sqrt(es / nn)) };
  });
  out.gridMonotone = out.grid.every((g, i) => i === 0 || g.rmsRel < out.grid[i - 1].rmsRel);
  // 渦の循環 ∮ u·dl(半径 r の円・面 Z=0)—— 自転源あり(🔗 の三次元)と自転 0 の対照
  const circ = (S, r) => { let G = 0; const N = 256; for (let k = 0; k < N; k++) { const th = 2 * Math.PI * (k + 0.5) / N, x = r * Math.cos(th), y = r * Math.sin(th);
    const u = HP.inertialDragProbeAt(S, x, y, 0, { frame: 'coordinate' }).u; G += (u[0] * -Math.sin(th) + u[1] * Math.cos(th)) * (2 * Math.PI * r / N); } return G; };
  const S0 = simOf(HP, (() => { const p = chain3dPreset(HP, false); delete p.physics.relativeDrag.spinDrag; p.bodies[0].spin = 0; return p; })());
  const Ss = simOf(HP, chain3dPreset(HP, false));
  S0.step(DT); S0.step(DT); Ss.step(DT); Ss.step(DT);
  out.circulation = [8, 12, 18].map((r) => ({ r, withSpin: sci(circ(Ss, r)), spin0: sci(circ(S0, r)) }));
  // 傾けた軸: 面 Z=0 の |u_z| と ω_z の最大(表示は XY の投影と点の色)
  const D16 = HP.inertialDragProbeSample(t3, view);
  let uzMax = 0; for (let k = 0; k < D16.nodes; k++) { const q = HP.inertialDragProbeAt(t3, D16.xs[k], D16.ys[k], 0, { frame: 'centroid' }); uzMax = Math.max(uzMax, Math.abs(q.u[2])); }
  out.tilt = { nodes: D16.nodes, uMax: sci(D16.uMax), uzMax: sci(uzMax), wzMax: sci(D16.wMax), streamlines: HP.inertialDragProbeStreamlines(D16, 12, 48).length };
  return out;
}

/* ───────── ④ 🔗 の三次元の写し 2 本(2000 步)───────── */
function part4(HP) {
  const out = {};
  for (const [key, tilt] of [['chain3d', false], ['chain3dTilt', true]]) {
    const S = simOf(HP, chain3dPreset(HP, tilt));
    const th0 = [], acc = new Float64Array(S.n), prev = new Float64Array(S.n);
    for (let i = 0; i < S.n; i++) { th0.push({ r: Math.hypot(S.x[i], S.y[i]), th: Math.atan2(S.y[i], S.x[i]) }); prev[i] = th0[i].th; }
    const t0 = Date.now();
    for (let k = 0; k < 2000; k++) {
      S.step(DT);
      for (let i = 0; i < S.n; i++) { const th = Math.atan2(S.y[i], S.x[i]); let d = th - prev[i]; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; acc[i] += d; prev[i] = th; }
    }
    const bs = bandStatsAcc(S, th0, acc), st = HP.inertialDragState(S), ch = st.compose.chain || {};
    out[key] = Object.assign({ steps: 2000, wallSec: (Date.now() - t0) / 1000, itersMax: st.compose.chain ? ch.itersMax : null, resMax: sci(st.compose.resMax), fail: ch.fail || 0, nan: S.hasNaN(),
      spin3: { rotTerms: st.spin3.rot.terms, rotMax: sci(st.spin3.rot.max), axialTerms: st.spin3.axial.terms, omegaMax: sci(st.spin3.axial.omegaMax), perpSkip: st.spin3.axial.perpSkip, rotA: sci(st.spin3.axial.rotA),
        dL3: st.spin3.dL3.map(sci) }, axis0: [S.sax[0], S.say[0], S.saz[0]].map(sci) }, bs);
  }
  // 🪛 の A/B(軸引きずりを外す)—— 位置・速度は A と全步ビット同一・姿勢の角 rotA だけが違う(軸引きずりは線速度に足さない)
  const pa = chain3dPreset(HP, true), pb = chain3dPreset(HP, true); pb.physics.relativeDrag.spinDrag = { rot: 'surfaceFlip', axial: 'off' };
  const SA = simOf(HP, pa), SB = simOf(HP, pb);
  let posSame = true, rotADiff = 0;
  for (let k = 0; k < 2000; k++) {
    SA.step(DT); SB.step(DT);
    for (let i = 0; i < SA.n && posSame; i++) for (const q of ['x', 'y', 'z', 'vx', 'vy', 'vz', 'spin']) if (!Object.is(SA[q][i], SB[q][i])) { posSame = false; break; }
  }
  for (let i = 0; i < SA.n; i++) rotADiff = Math.max(rotADiff, Math.abs(SA.rotA[i] - SB.rotA[i]));
  out.tiltAxialOff = { steps: 2000, positionsVelocitiesSame: posSame, rotAmaxDiff: sci(rotADiff) };
  return out;
}
function bandStatsAcc(S, th0, acc) {
  const bands = [[6, 12], [12, 18], [18, 24]], sum = bands.map(() => ({ n: 0, d: 0 }));
  let zMax = 0, vzMax = 0;
  for (let i = 1; i < S.n; i++) { const b = bands.findIndex((q) => th0[i].r >= q[0] && th0[i].r < q[1]); if (b < 0) continue; sum[b].n++; sum[b].d += acc[i];
    zMax = Math.max(zMax, Math.abs(S.z[i])); vzMax = Math.max(vzMax, Math.abs(S.vz[i])); }
  return { bands: bands.map((q, k) => ({ band: q, n: sum[k].n, dthMean: sci(sum[k].d / sum[k].n) })), zMax: sci(zMax), vzMax: sci(vzMax) };
}

/* ───────── ⑤ 受理 ───────── */
function part5(HP) {
  const V = (p) => { const v = HP.validatePreset(clone(p)); return { ok: v.ok, err: v.ok ? null : (v.errors || []).slice(0, 1).join('') }; };
  const c2 = clone(find(HP, BOOKS.chain)); delete c2.id;
  const s3 = clone(c2); s3.physics.coord = '3d';
  const d3 = smallSys({ recv: [{ x: 5, y: 0, vx: 0, vy: 0 }] }); d3.bodies[0].dragCore = { massFrac: 0.3, radius: 1 };
  const sd2 = clone(c2); delete sd2.physics.relativeDrag.spinSource; sd2.physics.relativeDrag.spinDrag = { rot: 'surfaceFlip', axial: 'off' };
  const both = chain3dPreset(HP, false); both.physics.relativeDrag.spinSource = 'surfaceFlip';
  const bad = (sd) => { const p = chain3dPreset(HP, false); p.physics.relativeDrag.spinDrag = sd; return V(p); };
  const sum3 = chain3dPreset(HP, false); sum3.physics.relativeDrag.compose = 'sum'; delete sum3.physics.relativeDrag.solver;
  const r = { spinSource3d: V(s3), dragCore3d: V(d3), spinDrag2d: V(sd2), spinDrag3d: V(chain3dPreset(HP, false)), spinDragTilt3d: V(chain3dPreset(HP, true)), both: V(both),
    noCoupling: bad({ rot: 'surfaceFlip', axial: 'on' }), couplingOff: bad({ rot: 'surfaceFlip', axial: 'off', axialCoupling: 1 }), allOff: bad({ rot: 'off', axial: 'off' }), unknownKey: bad({ rot: 'surfaceFlip', x: 1 }),
    sum: V(sum3) };
  r.ok = r.spinSource3d.ok && r.dragCore3d.ok && !r.spinDrag2d.ok && r.spinDrag3d.ok && r.spinDragTilt3d.ok && !r.both.ok && !r.noCoupling.ok && !r.couplingOff.ok && !r.allOff.ok && !r.unknownKey.ok && !r.sum.ok;
  r.rejectedList = HP.coord3d.rejected.slice(); r.opened = ['spinSource', 'dragCore'].filter((k) => HP.coord3d.rejected.indexOf(k) < 0);
  return r;
}

export function runAll(HP) {
  const out = { part1: part1(HP), part2: part2(HP), part3: part3(HP), part4: part4(HP), part5: part5(HP) };
  const p1 = out.part1, p2 = out.part2, p3 = out.part3, p5 = out.part5;
  out.gates = {
    zeroBitsame: p1.allSame === true,
    onAxis: p1.onAxis.rotUz === 0 && p1.onAxis.axialW > 0 && p1.onAxis.rotUtilt <= 1e-15 * p1.equator.rotU && p1.onAxis.axialWtilt > 0,
    equator: p1.equator.axialWzero === true && p1.equator.rotU > 0 && Math.abs(p1.equator.rotU - p1.equator.rotUexpect) <= 1e-12 * p1.equator.rotUexpect,
    flip: p1.flip.bitNegated === true,
    covariance: p1.covariance.relDr <= 1e-10 && p1.covariance.relDv <= 1e-10 && p1.covariance.maxDaxis <= 1e-12,
    budget: p1.budget.relP <= 1e-12 && p1.budget.relLresid <= 1e-10,
    sphere: p2.outsideParMax <= 1e-6 && p2.outsidePerpMax <= 1e-6,
    probeReady: Object.values(p3.ready).every((z) => z.ready === true) && p3.readyBuild.ready === false,
    displayBitsame: p3.displayBitsame.same === true && p3.displayBitsame.drawn > 0,
    gridConverges: p3.gridMonotone === true,
    axialNotLinear: out.part4.tiltAxialOff.positionsVelocitiesSame === true && out.part4.tiltAxialOff.rotAmaxDiff > 0,
    accept: p5.ok === true && p5.opened.length === 2,
  };
  out.ok = Object.values(out.gates).every(Boolean);
  return out;
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const OUT_PATH = process.env.W298C_OUT || path.join(ROOT, 'tests', 'out', 'drag3d-w298c.json');
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const t0 = Date.now();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const out = runAll(HP);
  const CODE = ['tests/exp-w298c-drag3d.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第298便c', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, spin3Version: HP.REL_DRAG_SPIN3_VERSION, probeVersion: HP.PROBE_VERSION, axialLaw: HP.REL_DRAG_AXIAL_LAW, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第88報)「三次元の慣性決定力: 回転引きずりは赤道面で最大・自転軸方向でゼロ/軸引きずり —— 自転軸方向で最大・同じ軸の向きに回転させる・赤道面でゼロ」「表示の空間メッシュで渦状の引きずりが見えるよう物理と表示の両面で精度を上げる(表示は Z=0 の公転面)」',
    reading: '統括の検証項目 R167' });
  out.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
  console.log(JSON.stringify(out.gates));
  console.log('→ ' + path.relative(ROOT, OUT_PATH) + '(' + out.elapsedS.toFixed(1) + ' s)・ok ' + out.ok);
}

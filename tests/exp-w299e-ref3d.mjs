// 第299便e(原仮定者の裁定(第89報)④「参照模型サンプルを三次元化する」・統括の検証項目 R174・AN286)
// — **参照模型の三次元化の器**(純 Node・ブラウザ不要 —— tests/lib-w280b-emgrid.mjs の loadHtmlMain で html の本文をそのまま走らせる・1 プロセス)。
//
// ■ 何を測るか(照合は「同じか」・数は値の記録 —— 物理の合否は書かない)
//   ① bit: 在位の 8 本(🔮🥏🧵🍭🎱📀🧹🎢 —— 三次元の本)と、凍結の二次元の写し(tests/data-w299e-ref2d.json)に**同じ状態の精度**
//      (stateCarry:"double")を足した二次元の走行の x・y・vx・vy・spin・rotA・t のビット一致(dt=0.25・800 步 = T=200)。
//      宣言の差が coord と stateCarry だけであること。二次元の写しそのもの(旧 Float32 の状態)との差の大きさ(精度の変更の分)。
//   ② thick: z の厚みと v_z の分散(t∈[100,200] の 4 步ごとの標本の平均)と宣言から出る定常値の比。規定系は σ_z・σ_z ω₀、Core 力学は
//      T/(m K∥)(軸 s の z 成分)と T/(m K_eff)(垂直成分)の混ぜ合わせ・T/m。🥏・📀 の軸比 σ_z/σ_R。
//   ③ gravity: 規定系 4 本は G=0→8 で 600 步の x・y・z・vx・vy・vz がビット同一(規定運動)/ Core 系は G≠0 で門 gravityDouble が止める。
//   ④ cov: Core 力学の三次元の共変(熱浴を外した写し —— 熱浴の乱数は世界座標の成分で引くので経路ごとの共変は無い)。
//      200 步の後に状態と軸 s を任意の回転 R で回した走行と、回さない走行を R で回した状態の差(さらに 200 步)。
//   ⑤ ledger: 三次元の P・L(3 成分)・E の収支 —— 粒子の総量の変化と帳簿(規定運動は shapeToy*/spiral* の 3 成分・Core 力学は coreField* と
//      外部キック)の差・熱浴の欄が受け取った量の厳密な負であること・供給の分解(SupE+DetE と E の差)。
//   ⑥ ck: チェックポイント(保存 → N 步 → 復帰 → N 步)と A/B の複製(cloneSimState)が同じ瞬間に戻ること(三次元の 8 本)・
//      凍結の二次元の写しのチェックポイント(二次元の本の複製の漏れのうち参照模型の分 —— 第299便a の報告)。
//   ⑦ save: 受理 → JSON → 受理で署名が同じ・同じ走行(z を含む)・二次元の写しと署名が違う。
//   ⑧ variants: coupling:"feedback"(診断)の三次元の写しが止まらずに走ること・成長する宣言(tauGrow>0)の σ_z(t) の追従。
//   ⑨ gate: 受理の門 coord3dDenyOf が 8 本に何も返さない・走行時の門 coord3dRuntimeWhy が null・対応表に shapeToy。
//
// ■ しないこと・言わないこと
//   ・「重力で扁平になった」とは書かない(扁平は σ_z の宣言・Core 力学では K∥ の宣言の帰結)。銀河・星団の較正ではない。
//   ・模型の固有基底を世界座標に対して傾ける宣言(incl・node の類)は作っていない(決断事項候補)。
//
// 実行: node tests/exp-w299e-ref3d.mjs → 正本 tests/out/ref3d-w299e.json(W299E_OUT で出力先を変える)
// 読む入力: html・tests/data-w299e-ref2d.json(凍結の二次元の写し)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
const REGEN_SCOPE = {"presets":["shapeToyArm","shapeToyArmCore","shapeToyCluster","shapeToyClusterCore","shapeToyDisk","shapeToyDiskCore","shapeToySpiral","shapeToySpiralCore"],"roots":["DT","HP.allPresets","HP.coord3d","HP.dfmMeshVelocityFieldAt","HP.loadPreset","HP.sim","HP.validatePreset","ckRestoreOne","ckSnapOne","cloneSimState","ctx","cw","presetSigHash"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w299e-ref3d-1';
export const IDS = Object.freeze(['shapeToyCluster', 'shapeToyDisk', 'shapeToyArm', 'shapeToySpiral', 'shapeToyClusterCore', 'shapeToyDiskCore', 'shapeToyArmCore', 'shapeToySpiralCore']);
export const FIXTURE = 'tests/data-w299e-ref2d.json';
const TARGET = 'beta/index.html';
const DT = 0.25, NSTEP = 800;
const clone = (x) => JSON.parse(JSON.stringify(x));
const sci = (v) => (Number.isFinite(v) ? Number(v.toPrecision(6)) : v);
const find = (HP, id) => HP.allPresets().find((q) => q.id === id);
let GG = globalThis;

function simOf(HP, preset) {
  const v = HP.validatePreset(clone(preset));
  if (!v.ok) throw new Error('受理されない: ' + JSON.stringify(v.errors).slice(0, 300));
  const S = HP.coord3d.makeSim(); S.build(clone(v.preset));
  return { S, v };
}
/** 内蔵の本(アプリの loadPreset と同じ —— 受理を通さない build) */
function simOfBuiltin(HP, id, mut) { const p = clone(find(HP, id)); if (mut) mut(p); const S = HP.coord3d.makeSim(); S.build(p); return S; }
/** 凍結の二次元の写しを本の形にする(説明文の無い宣言 —— 受理を通す) */
function fixtureBook(FX, id, dbl) {
  const b = clone(FX.books[id]);
  const p = { id: b.id, name: b.id + ' (2D fixture)', description: '凍結の二次元の写し(第299便e)', emoji: b.emoji, seed: b.seed, world: b.world, camera: b.camera, timeRef: b.timeRef, physics: b.physics, bodies: b.bodies };
  if (dbl) p.physics.stateCarry = 'double';
  return p;
}
const KEYS2 = ['x', 'y', 'vx', 'vy', 'spin', 'rotA'];
function cmp(A, B, keys) {
  let nDiff = 0, nVal = 0, maxAbs = 0;
  for (const k of keys) for (let i = 0; i < A.n; i++) { nVal++; const a = A[k][i], b = B[k][i]; if (!Object.is(a, b)) { nDiff++; maxAbs = Math.max(maxAbs, Math.abs(a - b)); } }
  if (!Object.is(A.t, B.t)) nDiff++;
  return { nVal, nDiff, maxAbs: sci(maxAbs) };
}
function fp(HP, S) {
  const o = [];
  for (const k of ['x', 'y', 'z', 'vx', 'vy', 'vz', 'spin', 'rotA']) if (S[k]) o.push(Array.from(S[k].subarray(0, S.n)).join(','));
  const st = HP.coord3d.ref3d.state(S); o.push(JSON.stringify(st ? st.ledger : null));
  for (const k of ['shapeToyE', 'coreFieldE', 'spiralE', 'coreFieldBathE']) o.push(String(S[k]));
  o.push(String(S.t)); return o.join('|');
}

/* ── ① bit ── */
function partBit(HP, FX) {
  const rows = {};
  for (const id of IDS) {
    const B = find(HP, id), F = FX.books[id];
    const ph = clone(B.physics); const dc = ph.coord, ds = ph.stateCarry; delete ph.coord; delete ph.stateCarry;
    const declSame = JSON.stringify(ph) === JSON.stringify(F.physics) && JSON.stringify(B.bodies) === JSON.stringify(F.bodies) && B.seed === F.seed;
    const S3 = simOfBuiltin(HP, id), S2d = simOf(HP, fixtureBook(FX, id, true)).S, S2f = simOf(HP, fixtureBook(FX, id, false)).S;
    for (let k = 0; k < NSTEP; k++) { S3.step(DT); S2d.step(DT); S2f.step(DT); }
    const c = cmp(S3, S2d, KEYS2), f = cmp(S3, S2f, ['x', 'y', 'vx', 'vy']);
    let rel = 0; for (let i = 0; i < S3.n; i++) { const r = Math.hypot(S3.x[i], S3.y[i]); if (r > 0) rel = Math.max(rel, Math.hypot(S3.x[i] - S2f.x[i], S3.y[i] - S2f.y[i]) / r); }
    rows[id] = { emoji: B.emoji, n: S3.n, coord: dc, stateCarry: ds, declOnlyCoordAndCarry: declSame, coord3d: S3.coord3d === true, coord2dFixture: S2d.coord3d !== true,
      vsFixtureDouble: c, vsFixtureFloat32: { nDiff: f.nDiff, maxAbs: f.maxAbs, maxRelPos: sci(rel) }, halt: S3.coord3dHalt || null };
  }
  const allSame = Object.values(rows).every((r) => r.vsFixtureDouble.nDiff === 0 && r.declOnlyCoordAndCarry && r.coord3d && r.coord2dFixture && r.coord === '3d' && r.stateCarry === 'double');
  return { dt: DT, steps: NSTEP, rows, allSame };
}

/* ── ② thick ── */
function expectedOf(S, cf, grp) {
  const m = S.mEff[S.pinned[0] ? 1 : 0];
  if (cf.law === 'coreField' && (grp === 'all' || grp === 'disk')) {
    const cfd = cf.coreField, s = cfd.axis, sn = Math.hypot(s[0], s[1], s[2]), sz = s[2] / sn;
    const kPar = S.coreFieldKPar, kEff = S.coreFieldKEff;
    const varZ = sz * sz * cfd.temp / (m * kPar) + (1 - sz * sz) * cfd.temp / (m * kEff);
    return { sigmaZ: Math.sqrt(varZ), sigmaVz: Math.sqrt(cfd.temp / m), basis: 'Core 力学の等温定常 T/(m K∥)・T/(m K_eff)・T/m' };
  }
  if (cf.shape === 'spiral' && grp === 'arm') return { sigmaZ: cf.spiral.armSigmaZ, sigmaVz: cf.spiral.armSigmaZ * cf.spiral.armOmega0, basis: '腕の OU の定常 armSigmaZ・armSigmaZ·armOmega0' };
  return { sigmaZ: cf.sigmaZ, sigmaVz: cf.sigmaZ * cf.omega0, basis: 'OU の定常 σ_z・σ_z ω₀' };
}
function partThick(HP) {
  const rows = {};
  for (const id of IDS) {
    const S = simOfBuiltin(HP, id), cf = S.params.shapeToy;
    const z0 = HP.coord3d.ref3d.state(S).stats;
    const acc = {};
    for (let k = 1; k <= NSTEP; k++) {
      S.step(DT);
      if (k >= 400 && k % 4 === 0) { const st = HP.coord3d.ref3d.state(S).stats;
        for (const g of Object.keys(st)) { const a = acc[g] || (acc[g] = { n: 0, sz: 0, svz: 0, rr: 0, mz: 0 }); a.n++; a.sz += st[g].sigmaZ ** 2; a.svz += st[g].sigmaVz ** 2; a.rr += st[g].rmsR ** 2; a.mz += st[g].meanZ; } }
    }
    const g = {};
    for (const k of Object.keys(acc)) { const a = acc[k], e = expectedOf(S, cf, k);
      const sz = Math.sqrt(a.sz / a.n), svz = Math.sqrt(a.svz / a.n), rr = Math.sqrt(a.rr / a.n);
      g[k] = { samples: a.n, sigmaZ: sci(sz), sigmaVz: sci(svz), rmsR: sci(rr), meanZ: sci(a.mz / a.n), sigmaZ0: sci(z0[k] ? z0[k].sigmaZ : NaN),
        expectSigmaZ: sci(e.sigmaZ), expectSigmaVz: sci(e.sigmaVz), ratioZ: sci(sz / e.sigmaZ), ratioVz: sci(svz / e.sigmaVz), aspectZoverRperAxis: sci(sz / (rr / Math.SQRT2)), basis: e.basis }; }
    rows[id] = { emoji: find(HP, id).emoji, law: cf.law || 'prescribed', shape: cf.shape, groups: g };
  }
  const ratios = Object.values(rows).flatMap((r) => Object.values(r.groups).map((q) => q.ratioZ));
  return { window: [100, 200], every: 4, rows, ratioZRange: [sci(Math.min(...ratios)), sci(Math.max(...ratios))] };
}

/* ── ③ gravity ── */
function partGravity(HP) {
  const rows = {};
  for (const id of IDS) {
    const A = simOfBuiltin(HP, id), B = simOfBuiltin(HP, id, (p) => { p.physics.G = 8; });
    for (let k = 0; k < 600; k++) { A.step(DT); B.step(DT); }
    const c = cmp(A, B, ['x', 'y', 'z', 'vx', 'vy', 'vz']);
    rows[id] = { law: A.params.shapeToy.law || 'prescribed', nDiffG8: c.nDiff, maxAbs: c.maxAbs, coreFieldStopG8: B.coreFieldStop || null };
  }
  const presOk = IDS.filter((id) => !/Core$/.test(id) || id === 'shapeToySpiralCore').every((id) => id === 'shapeToySpiralCore' || rows[id].nDiffG8 === 0);
  const coreGate = ['shapeToyClusterCore', 'shapeToyDiskCore', 'shapeToyArmCore', 'shapeToySpiralCore'].every((id) => rows[id].coreFieldStopG8 === 'gravityDouble');
  return { rows, prescribedBitSameUnderG: presOk, coreGravityDoubleGate: coreGate };
}

/* ── ④ cov(Core 力学の三次元の共変 —— 熱浴なしの写し)── */
function rotMat(axis, ang) {
  const n = Math.hypot(...axis), u = axis.map((a) => a / n), c = Math.cos(ang), s = Math.sin(ang), C = 1 - c;
  const [x, y, z] = u;
  return [[c + x * x * C, x * y * C - z * s, x * z * C + y * s], [y * x * C + z * s, c + y * y * C, y * z * C - x * s], [z * x * C - y * s, z * y * C + x * s, c + z * z * C]];
}
const mv = (R, v) => [R[0][0] * v[0] + R[0][1] * v[1] + R[0][2] * v[2], R[1][0] * v[0] + R[1][1] * v[1] + R[1][2] * v[2], R[2][0] * v[0] + R[2][1] * v[1] + R[2][2] * v[2]];
function partCov(HP) {
  const R = rotMat([1, 2, 3], 0.7), rows = {};
  for (const id of ['shapeToyDiskCore', 'shapeToyArmCore', 'shapeToyClusterCore']) {
    const mut = (p) => { p.physics.shapeToy.coreField.exchange = { mode: 'none', rate: 0, capacity: 0 }; };
    const A = simOfBuiltin(HP, id, mut), B = simOfBuiltin(HP, id, mut);
    for (let k = 0; k < 200; k++) { A.step(DT); B.step(DT); }
    // B の状態と軸を R で回す(中心は原点 —— pinned の中心の z=0)
    const cf = B.params.shapeToy, cfd = cf.coreField;
    B.params.shapeToy = Object.assign({}, cf, { coreField: Object.assign({}, cfd, { axis: mv(R, cfd.axis) }) });
    for (let i = 0; i < B.n; i++) {
      if (B.pinned[i]) continue;
      const p = mv(R, [B.x[i], B.y[i], B.z[i]]), v = mv(R, [B.vx[i], B.vy[i], B.vz[i]]);
      B.x[i] = p[0]; B.y[i] = p[1]; B.z[i] = p[2]; B.vx[i] = v[0]; B.vy[i] = v[1]; B.vz[i] = v[2];
      const q = mv(R, [B.cfX[i], B.cfY[i], B.cfZ[i]]), w = mv(R, [B.cfVx[i], B.cfVy[i], B.cfVz[i]]);
      B.cfX[i] = q[0]; B.cfY[i] = q[1]; B.cfZ[i] = q[2]; B.cfVx[i] = w[0]; B.cfVy[i] = w[1]; B.cfVz[i] = w[2];
      B.cfVxS[i] = B.vx[i]; B.cfVyS[i] = B.vy[i]; B.cfVzS[i] = B.vz[i];
    }
    for (let k = 0; k < 200; k++) { A.step(DT); B.step(DT); }
    let dr = 0, dv = 0, rs = 0, vs = 0;
    for (let i = 0; i < A.n; i++) {
      if (A.pinned[i]) continue;
      const p = mv(R, [A.x[i], A.y[i], A.z[i]]), v = mv(R, [A.vx[i], A.vy[i], A.vz[i]]);
      dr = Math.max(dr, Math.hypot(p[0] - B.x[i], p[1] - B.y[i], p[2] - B.z[i])); dv = Math.max(dv, Math.hypot(v[0] - B.vx[i], v[1] - B.vy[i], v[2] - B.vz[i]));
      rs = Math.max(rs, Math.hypot(A.x[i], A.y[i], A.z[i])); vs = Math.max(vs, Math.hypot(A.vx[i], A.vy[i], A.vz[i]));
    }
    rows[id] = { axis: cfd.axis, relDr: sci(dr / rs), relDv: sci(dv / vs), stopA: A.coreFieldStop || null, stopB: B.coreFieldStop || null };
  }
  const worst = Math.max(...Object.values(rows).flatMap((r) => [r.relDr, r.relDv]));
  return { rotation: { axis: [1, 2, 3], angleRad: 0.7 }, steps: [200, 200], exchange: 'none(写し)', rows, worstRel: sci(worst) };
}

/* ── ⑤ ledger ── */
function totals(S) {
  let px = 0, py = 0, pz = 0, lx = 0, ly = 0, lz = 0, K = 0;
  for (let i = 0; i < S.n; i++) { const m = S.mEff[i], x = S.x[i], y = S.y[i], z = S.z[i], vx = S.vx[i], vy = S.vy[i], vz = S.vz[i];
    px += m * vx; py += m * vy; pz += m * vz; lx += m * (y * vz - z * vy); ly += m * (z * vx - x * vz); lz += m * (x * vy - y * vx); K += 0.5 * m * (vx * vx + vy * vy + vz * vz); }
  return [px, py, pz, lx, ly, lz, K];
}
function partLedger(HP) {
  const rows = {};
  for (const id of IDS) {
    const S = simOfBuiltin(HP, id), T0 = totals(S);
    for (let k = 0; k < 600; k++) S.step(DT);
    const T1 = totals(S), d = T1.map((v, k) => v - T0[k]);
    const g = (k) => S[k] || 0;
    // 三次元の量 = 二次元の經路の欄(意味は変えていない)+ 三次元の本だけの欄(*Pz・*Lx・*Ly・*Ez・coreFieldL3FixX/Y・coreFieldExtPz/ExtEz)
    const pres = [g('shapeToyPx') + g('spiralPx'), g('shapeToyPy') + g('spiralPy'), g('shapeToyPz') + g('spiralPz'), g('shapeToyLx') + g('spiralLx'), g('shapeToyLy') + g('spiralLy'), g('shapeToyL') + g('spiralL'),
      g('shapeToyE') + g('shapeToyEz') + g('spiralE') + g('spiralEz')];
    const core = [g('coreFieldPx') + g('coreFieldExtPx'), g('coreFieldPy') + g('coreFieldExtPy'), g('coreFieldPz') + g('coreFieldExtPz'), g('coreFieldLx') + g('coreFieldL3FixX'), g('coreFieldLy') + g('coreFieldL3FixY'), g('coreFieldLz'),
      g('coreFieldE') + g('coreFieldExtE') + g('coreFieldExtEz')];
    const book = pres.map((v, k) => v + core[k]);
    const scaleP = Math.max(1e-300, ...[0, 1, 2].map((k) => Math.abs(book[k]))), scaleL = Math.max(1e-300, ...[3, 4, 5].map((k) => Math.abs(book[k]))), scaleE = Math.max(1e-300, Math.abs(book[6]), T1[6]);
    const res = d.map((v, k) => v - book[k]);
    const bathNeg = [['shapeToyPx', 'shapeToyBathPx'], ['shapeToyPy', 'shapeToyBathPy'], ['shapeToyPz', 'shapeToyBathPz'], ['shapeToyLx', 'shapeToyBathLx'], ['shapeToyLy', 'shapeToyBathLy'], ['shapeToyL', 'shapeToyBathL'], ['shapeToyE', 'shapeToyBathE'], ['shapeToyEz', 'shapeToyBathEz'],
      ['spiralPx', 'spiralBathPx'], ['spiralPy', 'spiralBathPy'], ['spiralPz', 'spiralBathPz'], ['spiralLx', 'spiralBathLx'], ['spiralLy', 'spiralBathLy'], ['spiralL', 'spiralBathL'], ['spiralE', 'spiralBathE'], ['spiralEz', 'spiralBathEz'],
      ['coreFieldPx', 'coreFieldReacPx'], ['coreFieldPy', 'coreFieldReacPy'], ['coreFieldPz', 'coreFieldReacPz'], ['coreFieldLx', 'coreFieldReacLx'], ['coreFieldLy', 'coreFieldReacLy'], ['coreFieldLz', 'coreFieldReacLz'], ['coreFieldE', 'coreFieldReacE']]
      .every(([a, b]) => (S[a] === undefined && S[b] === undefined) || (S[a] + S[b]) === 0);
    const E3 = (a, b) => a + b, sp3 = (sup, det, e) => Math.abs(sup + det - e) / Math.max(1e-300, Math.abs(e));
    const supSplit = (S.hasShapeToy ? sp3(E3(S.shapeToySupE, S.shapeToySupEz), E3(S.shapeToyDetE, S.shapeToyDetEz), E3(S.shapeToyE, S.shapeToyEz)) : null);
    const supSplitSp = (S.hasSpiral ? sp3(E3(S.spiralSupE, S.spiralSupEz), E3(S.spiralDetE, S.spiralDetEz), E3(S.spiralE, S.spiralEz)) : null);
    rows[id] = { steps: 600, dP: d.slice(0, 3).map(sci), dL: d.slice(3, 6).map(sci), dK: sci(d[6]), bookP: book.slice(0, 3).map(sci), bookL: book.slice(3, 6).map(sci), bookE: sci(book[6]),
      zShare: { Pz: sci(g('shapeToyPz') + g('spiralPz') + g('coreFieldPz')), Lx: sci(g('shapeToyLx') + g('spiralLx') + g('coreFieldLx') + g('coreFieldL3FixX')), Ly: sci(g('shapeToyLy') + g('spiralLy') + g('coreFieldLy') + g('coreFieldL3FixY')), Ez: sci(g('shapeToyEz') + g('spiralEz')),
        coreL3Fix: [sci(g('coreFieldL3FixX')), sci(g('coreFieldL3FixY'))], coreExtPz: sci(g('coreFieldExtPz')) },
      relResP: sci(Math.max(...[0, 1, 2].map((k) => Math.abs(res[k]))) / scaleP), relResL: sci(Math.max(...[3, 4, 5].map((k) => Math.abs(res[k]))) / scaleL), relResE: sci(Math.abs(res[6]) / scaleE),
      bathExactNeg: bathNeg, supplySplitRel: sci(supSplit), supplySplitRelSpiral: sci(supSplitSp) };
  }
  const worst = Math.max(...Object.values(rows).flatMap((r) => [r.relResP, r.relResL, r.relResE]));
  return { rows, worstRel: sci(worst), allBathExactNeg: Object.values(rows).every((r) => r.bathExactNeg) };
}

/* ── ⑥ ck ── */
function partCk(HP, FX) {
  const G = GG, rows = {};
  for (const id of IDS) {
    HP.loadPreset(id, false); const S = HP.sim;
    for (let k = 0; k < 20; k++) S.step(DT);
    const snap = G.ckSnapOne(S), B = G.cloneSimState();
    for (let k = 0; k < 20; k++) { S.step(DT); B.step(DT); }
    const a = fp(HP, S), b = fp(HP, B);
    G.ckRestoreOne(S, snap); for (let k = 0; k < 20; k++) S.step(DT);
    const c = fp(HP, S);
    // 凍結の二次元の写し(チェックポイントだけ —— 複製は currentPreset の本を読むので内蔵の本で測る)
    const F = simOf(HP, fixtureBook(FX, id, false)).S;
    for (let k = 0; k < 20; k++) F.step(DT);
    const fs2 = G.ckSnapOne(F); for (let k = 0; k < 20; k++) F.step(DT);
    const fa = fp(HP, F); G.ckRestoreOne(F, fs2); for (let k = 0; k < 20; k++) F.step(DT);
    rows[id] = { cloneSame: a === b, checkpointSame: a === c, fixture2dCheckpointSame: fa === fp(HP, F) };
  }
  return { rows, allSame: Object.values(rows).every((r) => r.cloneSame && r.checkpointSame && r.fixture2dCheckpointSame) };
}

/* ── ⑦ save ── */
function partSave(HP, FX) {
  const G = GG, rows = {};
  for (const id of IDS) {
    const p = clone(find(HP, id)), v1 = HP.validatePreset(clone(p)), v2 = HP.validatePreset(JSON.parse(JSON.stringify(v1.preset)));
    const sig1 = G.presetSigHash(v1.preset), sig2 = G.presetSigHash(v2.preset), sigF = G.presetSigHash(HP.validatePreset(fixtureBook(FX, id, false)).preset);
    const A = HP.coord3d.makeSim(); A.build(clone(v1.preset)); const B = HP.coord3d.makeSim(); B.build(clone(v2.preset));
    for (let k = 0; k < 300; k++) { A.step(DT); B.step(DT); }
    const warn = (v2.warnings || []).filter((w) => /coord2dZ|三次元/.test(String(w)));
    rows[id] = { sigSame: sig1 === sig2, runSame: fp(HP, A) === fp(HP, B), differsFrom2d: sig1 !== sigF, warnings3d: warn.length };
  }
  return { rows, allOk: Object.values(rows).every((r) => r.sigSame && r.runSame && r.differsFrom2d && r.warnings3d === 0) };
}

/* ── ⑧ variants ── */
function partVariants(HP) {
  const fb = simOfBuiltin(HP, 'shapeToyCluster', (p) => { p.physics.shapeToy.coupling = 'feedback'; });
  for (let k = 0; k < NSTEP; k++) fb.step(DT);
  const sf = HP.coord3d.ref3d.state(fb).stats.all;
  const gr = simOfBuiltin(HP, 'shapeToyCluster', (p) => { Object.assign(p.physics.shapeToy, { sigma0: 72, tauGrow: 50 }); });
  const track = [];
  for (let k = 1; k <= NSTEP; k++) { gr.step(DT); if (k % 200 === 0) { const st = HP.coord3d.ref3d.state(gr).stats.all, cf = gr.params.shapeToy;
    const fac = 1 + (cf.sigma0 / cf.sigma - 1) * Math.exp(-gr.t / cf.tauGrow); track.push({ t: gr.t, sigmaZ: sci(st.sigmaZ), expect: sci(cf.sigmaZ * fac), ratio: sci(st.sigmaZ / (cf.sigmaZ * fac)) }); } }
  return { feedback: { halt: fb.coord3dHalt || null, stop: fb.shapeToyStop || null, sigmaZ: sci(sf.sigmaZ), declared: 36, ratio: sci(sf.sigmaZ / 36),
      note: '診断用(二次元と同じく、エンジンの drift と OU が二重に当たるので定常の広がりは理論値に合わない —— 第274便d と同じ契約)' },
    growth: { sigma: 36, sigma0: 72, tauGrow: 50, track, halt: gr.coord3dHalt || null } };
}

/* ── ⑨ gate ── */
function partGate(HP) {
  const rows = {};
  for (const id of IDS) { const S = simOfBuiltin(HP, id); rows[id] = { deny: HP.coord3d.denyOf(find(HP, id)).map((z) => z.key), runtimeWhy: HP.coord3d.runtimeWhy(S) }; }
  const sup = HP.coord3d.supported.map((z) => z.key);
  return { rows, supportedHasShapeToy: sup.indexOf('shapeToy') >= 0, allAccepted: Object.values(rows).every((r) => r.deny.length === 0 && r.runtimeWhy === null) };
}

export function runAll(HP, G, FX) {
  GG = G || globalThis;
  const bit = partBit(HP, FX), thick = partThick(HP), gravity = partGravity(HP), cov = partCov(HP), ledger = partLedger(HP), ck = partCk(HP, FX), save = partSave(HP, FX), variants = partVariants(HP), gate = partGate(HP);
  const gates = {
    xyBitSameVsFixtureDouble: bit.allSame === true,
    prescribedBitSameUnderG: gravity.prescribedBitSameUnderG === true && gravity.coreGravityDoubleGate === true,
    covariantCore: cov.worstRel <= 1e-9,
    ledgerClosed: ledger.worstRel <= 1e-9 && ledger.allBathExactNeg === true,
    checkpointAndClone: ck.allSame === true,
    saveRoundTrip: save.allOk === true,
    accepted: gate.allAccepted === true && gate.supportedHasShapeToy === true };
  return { dt: DT, ids: IDS, bit, thick, gravity, cov, ledger, ck, save, variants, gate, gates, ok: Object.values(gates).every(Boolean) };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const t0 = Date.now();
  const OUT_PATH = process.env.W299E_OUT || path.join(ROOT, 'tests', 'out', 'ref3d-w299e.json');
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  if (!HP.coord3d || !HP.coord3d.ref3d) { console.error('html に HP.coord3d.ref3d が無い(第299便e の前の世代)'); process.exit(2); }
  const FX = JSON.parse(fs.readFileSync(path.join(ROOT, FIXTURE), 'utf8'));
  const R = runAll(HP, globalThis, FX);
  const out = Object.assign({ meta: null }, R);
  const CODE = ['tests/exp-w299e-ref3d.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第299便e', target: TARGET, code: CODE, inputs: [TARGET, FIXTURE] }), {
    harnessVersion: HARNESS_VERSION, ref3dVersion: HP.coord3d.ref3d.version, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第89報)④(参照模型サンプルを三次元化する)',
    reading: '統括の検証項目 R174・決断事項 AN286(在位の 8 本を三次元に —— 二次元の宣言は凍結の写し)',
    engine: 'Node の headless(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行・1 プロセス)',
    notClaim: ['重力で扁平になった', '星団・銀河の較正', '模型の固有基底を世界座標に対して傾ける宣言(未実装)'] });
  out.elapsedS = (Date.now() - t0) / 1000;
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
  console.log('gates ' + JSON.stringify(out.gates));
  console.log('→ ' + path.relative(ROOT, OUT_PATH) + '(' + out.elapsedS.toFixed(1) + ' s)・ok ' + out.ok);
  process.exit(out.ok ? 0 : 1);
}

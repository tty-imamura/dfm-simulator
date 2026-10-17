// 第307便c(原仮定者の裁定(第100報)「観測の自転を慣性軸回転と引きずり軸回転に分解する —— 金星・木星で検証してから他の天体へ。木星は先に太陽–木星、
// 対照で木星–イオ・太陽–木星–イオ」「観測の自転が安定なら、引きずり軸回転と潮汐のブレーキが釣り合っている」・決断事項 AN345 ④・統括の検証項目 R211):
// **金星・木星の観測の自転の分解の器と「釣り合い」の式**。
//
// Node だけ(対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読み、本の宣言 HP.allPresets() の質量・半径・位置・速度・自転・軸と
// relativeDrag の宣言〔W_bg・k = inertialR2.lambdaRs・ε〕を読むだけ)。**html・本の宣言・エンジンの式は変えない** —— 軸引きずりの球面の核・三次元の CTL・内部熱は
// エンジンへ入れず、器の中の参照の純関数(tests/lib-w307c-spindecomp.mjs)で測る(統合の後の次便でエンジンへ繋ぐ)。
//
// ■ 写した構成(宣言から探す)
//   SV 太陽–金星(🌋 の太陽と金星)/ SJ 太陽–木星(🏀)/ JIo 木星–イオ(太陽なし —— 🏀 の木星 + 木星系の二次元の本のイオ)/ SJIo 太陽–木星–イオ。
//   イオは二次元の本の木星に対する距離・速さを 🏀 の木星の赤道面へ回した**診断の配置**(太陽の側・順行 —— 実在の同じ元期の状態ではない)。
//   太陽の自転は観測の転記の値を固定の入力(分解しない)。単位は SI(本の scaleExp で換算)。
// ■ 段
//   K(純関数の確かめ): 求積のモーメント・赤道で逆/軸で同じ・中間の緯度のベクトル・源の軸への投影が 0 の仰角・分母の距離則(q ≈ 3/5)・剛体の抽出・½∇×u・CTL の平面の極限
//     (tests/lib-w292d-tide.mjs の ctlPair と一致)と仕事・熱の恒等式・内部熱・ケプラー・分解。
//   D(瞬間の分解): 4 構成 × 求積 8/12/16 —— 受け手ごとの軸引きずり ω_D(係数 A = 1 —— 回転引きずりの場と同じ k・同じ分母の剛体回転成分)と ω_I = ω_obs − ω_D
//     (木星とイオの未知は同時に解く)・横成分・遠方の閉じた式との差。
//   R(半径・自己・軟化): 源の R_d/R_body 1・0.1・0.01・受け手の自己の項 m_i/R_i³(分母)・宣言の ε。
//   P(対と行): 太陽の項の木星への寄与(並進の β・回転の ω_D)がイオの有無で変わらないこと(対ごとの分母)と、行の分母(他の源の I + D を足す)の対照。
//   A(係数の走査): ω_I = 0 で観測の自転を軸引きずりだけで作る A(金星・木星・イオ)と、A の各値での ω_D/ω_obs・ω_I/ω_obs(2 本の自転では A を同定できない)。
//   T(瞬間の潮汐の率): k₂ = 1・Δt = 1 s・I = 0.4 m R² の規格化 —— 慣性自転へのトルク・角加速度・熱・恒等式の残差。
//   E(釣り合いの仮説の時間発展): 固定の二体のケプラーの軌道(潮汐の反作用は帳簿だけ)・固定の軸の上の慣性自転 ω_I。滑りの読み方の仮説 A/B/C ×
//     係数 A ∈ {0(基線), 1, 規格化 A_n(軌道の平均の |ω_D| = n/2)}。CTL の lag は受け手の自転の緩和の時間 τ_T = 4 公転(規格化)・τ_C = τ_T・τ_cool = τ_T。
// ■ 言わないこと: 「金星の逆行を説明した」「イオの加熱を再現した」「自転が釣り合った」「磁気双極子と同じ」(器は写しの中で数を並べるだけ —— どの仮説が
//   第100報の「釣り合い」に当たるかは原仮定者の裁定の候補)。
// ■ 使い方
//   node tests/exp-w307c-spindecomp.mjs → 正本 tests/out/spindecomp-w307c.json(段 spindecomp-307c)
//   W307C_OUT=<json>(出力先)・W307C_TARGET=<html>(既定 beta/index.html)・W307C_QUICK=1(時間発展を 40 公転・求積を 8/12 に縮める試走 —— 木星の慣性自転が緩和しきらず門 steadyHeatC が偽になりうる。正本は書かない用途。全走行は 10 秒ほどなので煙試験も全走行)。
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadHtmlMain } from './lib-w280b-emgrid.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import { ctlPair } from './lib-w292d-tide.mjs';
import * as L from './lib-w307c-spindecomp.mjs';
// 第281便a の領域 hash の宣言(器と lib から deriveScope で引いた下限 + 本 3 本)
const REGEN_SCOPE = {"presets":["jupiterGalilean","jupiterSunInertial3d","venusSunInertial3d"],"roots":["$","HP.allPresets","HP.dfmMeshVelocityFieldAt","HP.sim","HP.validatePreset","T","ctx","cw","sim"],"core":false,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w307c-spindecomp-1';
const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const { add, sub, scale, dot, cross, norm, unit } = L;
const D2R = Math.PI / 180;

/** 10 の整数乗(文字列から —— `**` の最下位の桁の版の違いを避ける) */
export const pow10 = (e) => Number('1e' + e);
/** 時間発展の規格(正本に記録 —— QA は正本から読む) */
export const EVO = Object.freeze({ stepsPerOrbit: 256, orbits: 120, window: 10, NT: 4, k2: 1, inertia: 0.4, quickOrbits: 40 });

/* ───────────── 宣言から本を探す ───────────── */
const isPair3d = (e) => (p) => !!p && p.emoji === e && !!p.physics && p.physics.coord === '3d' && !!p.physics.relativeDrag && p.physics.relativeDrag.law === 'inertial'
  && !!p.physics.relativeDrag.inertialR2 && p.physics.relativeDrag.inertialR2.denom === 'pair' && Array.isArray(p.bodies) && p.bodies.length === 2;
/** 🌋・🏀(三次元・λ ∝ m・対の分母の宣言)と、🏀 の木星と同じ質量(相対 1e-6)を中心に持つ二次元の本(衛星 ≥ 1 —— 最も内側の衛星をイオとして読む) */
export function idsFromDecl(HP) {
  const v = HP.allPresets().find(isPair3d('🌋')), j = HP.allPresets().find(isPair3d('🏀'));
  if (!v || !j) throw new Error('宣言から 🌋・🏀 が見つからない');
  const mJ = j.bodies[1].m * pow10(j.scaleExp.M);
  const g = HP.allPresets().find((p) => !!p && !!p.scaleExp && !!p.physics && p.physics.coord !== '3d' && Array.isArray(p.bodies) && p.bodies.length >= 2
    && Math.abs(p.bodies[0].m * pow10(p.scaleExp.M) / mJ - 1) < 1e-6);
  if (!g) throw new Error('宣言から木星系の二次元の本が見つからない');
  return { venus: v.id, jupiter: j.id, jovian: g.id };
}
/* ───────────── 単位(SI)と天体 ───────────── */
export function unitsOf(p) {
  const e = p.scaleExp, Lm = pow10(e.L), T = pow10(e.T), M = pow10(e.M), rd = p.physics.relativeDrag || {};
  return { L: Lm, T, M, G: p.physics.G * pow10(3 * e.L - e.M - 2 * e.T), c: p.physics.cLight * pow10(e.L - e.T),
    Wbg: (rd.Wbg || 0) * pow10(e.M - 3 * e.L), eps: (rd.eps || 0) * Lm, k: rd.inertialR2 ? rd.inertialR2.lambdaRs : null };
}
export function axisOf(b) {
  const q = b.spinAxis;
  if (!q || !q.enable) return [0, 0, 1];
  const t = q.tiltDeg * D2R, a = (q.azimuthDeg || 0) * D2R;
  return [Math.sin(t) * Math.cos(a), Math.sin(t) * Math.sin(a), Math.cos(t)];
}
export function bodyOf(p, i, label) {
  const u = unitsOf(p), b = p.bodies[i];
  return { label, m: b.m * u.M, R: b.radius * u.L, x: [b.x, b.y, b.z || 0].map((x) => x * u.L), v: [b.vx, b.vy, b.vz || 0].map((x) => x * u.L / u.T), axis: axisOf(b), omega: b.spin / u.T };
}
/** 4 構成(宣言の値から —— イオは診断の配置) */
export function buildConfigs(HP, ids) {
  const byId = (id) => HP.allPresets().find((p) => p.id === id), pv = byId(ids.venus), pj = byId(ids.jupiter), pg = byId(ids.jovian);
  const uv = unitsOf(pv), uj = unitsOf(pj);
  const sunV = bodyOf(pv, 0, 'Sun'), venus = bodyOf(pv, 1, 'Venus'), sunJ = bodyOf(pj, 0, 'Sun'), jup = bodyOf(pj, 1, 'Jupiter');
  const g0 = bodyOf(pg, 0, 'Jupiter(2d)');
  let k = 1, best = Infinity;
  for (let i = 1; i < pg.bodies.length; i++) { const b = bodyOf(pg, i, ''), r = norm(sub(b.x, g0.x)); if (r < best) { best = r; k = i; } }
  const io0 = bodyOf(pg, k, 'Io');
  const s = sub(sunJ.x, jup.x), e1 = sub(s, scale(jup.axis, dot(s, jup.axis))), er = unit(e1), et = cross(jup.axis, er);
  const rIo = norm(sub(io0.x, g0.x)), vIo = norm(sub(io0.v, g0.v));
  const io = { label: 'Io', m: io0.m, R: io0.R, x: add(jup.x, scale(er, rIo)), v: add(jup.v, scale(et, vIo)), axis: jup.axis.slice(), omega: io0.omega };
  const P = (u) => ({ G: u.G, c: u.c, Wbg: u.Wbg, eps: u.eps, k: u.k });
  return {
    ioPlacement: { from: ids.jovian, index: k, r: rIo, v: vIo, note: '二次元の本の木星に対する距離・速さを 🏀 の木星の赤道面へ回した診断の配置(太陽の側・順行 —— 実在の同じ元期の状態ではない)' },
    configs: [
      { key: 'SV', ja: '太陽–金星', preset: ids.venus, bodies: [sunV, venus], fixed: [0], recv: 1, primary: 0, ...P(uv) },
      { key: 'SJ', ja: '太陽–木星', preset: ids.jupiter, bodies: [sunJ, jup], fixed: [0], recv: 1, primary: 0, ...P(uj) },
      { key: 'JIo', ja: '木星–イオ(太陽なし)', preset: ids.jupiter, bodies: [jup, io], fixed: [], recv: 1, primary: 0, ...P(uj) },
      { key: 'SJIo', ja: '太陽–木星–イオ', preset: ids.jupiter, bodies: [sunJ, jup, io], fixed: [0], recv: 2, primary: 1, ...P(uj) },
    ],
  };
}
/** 源 j(単位の慣性軸回転 —— â_j)を受け手 i の分母で */
export function sourceOf(C, i, j, o = {}) {
  const a = C.bodies[i], b = C.bodies[j], eta = o.eta === undefined ? 1 : o.eta;
  const What = C.Wbg + (o.self ? a.m / (a.R * a.R * a.R) : 0);
  const src = { m: b.m, R: b.R * eta, Om: (o.spin || b.axis), q: C.c * C.c / (2 * C.k * C.G), What, eps: o.eps ? C.eps : 0 };
  if (o.row) src.extra = C.bodies.map((z, k) => ({ z, k })).filter(({ k }) => k !== i && k !== j).map(({ z }) => ({ x: sub(z.x, b.x), m: z.m, q: src.q }));
  if (o.center) src.denFix = L.shellField(sub(a.x, b.x), src, 12).den;   // 分母を受け手の中心の値に固定(今のエンジンの行・対の尺度と同じ 1 つの数)
  return src;
}
/** 正本の inputs から構成を組み直す(QA が html を読まずに分解を作り直す) */
export function configsFromInputs(J) {
  return J.inputs.map((I) => ({ key: I.key, ja: I.ja, preset: I.preset, G: I.G, c: I.c, k: I.k, Wbg: I.WbgSI, eps: I.epsSI, recv: I.recv, primary: I.primary,
    bodies: I.bodies.map((b) => ({ label: b.label, m: b.m, R: b.R, x: b.x.slice(), v: b.v.slice(), axis: b.axis.slice(), omega: b.omega })),
    fixed: I.bodies.map((b, i) => (b.fixed ? i : -1)).filter((i) => i >= 0) }));
}
/* ───────────── D: 瞬間の分解 ───────────── */
export function measure(C, order, o = {}) {
  const n = C.bodies.length, B = C.bodies.map(() => C.bodies.map(() => 0)), V = C.bodies.map(() => C.bodies.map(() => null)), U = C.bodies.map(() => C.bodies.map(() => null));
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    if (i === j || C.fixed.includes(i)) continue;
    const a = C.bodies[i], src = sourceOf(C, i, j, o), d = sub(a.x, C.bodies[j].x);
    const z = L.shellResponse(d, a.R, src, order);
    B[i][j] = dot(z.omega, a.axis); V[i][j] = z.omega; U[i][j] = z.U;
  }
  const obs = C.bodies.map((b) => b.omega), dc = L.decompose(B, obs, C.fixed);
  const rows = C.bodies.map((a, i) => {
    if (C.fixed.includes(i)) return null;
    let vec = [0, 0, 0], far = 0, size2 = 0;
    for (let j = 0; j < n; j++) if (j !== i) {
      vec = add(vec, scale(V[i][j], dc.omegaI[j]));
      const rr = norm(sub(a.x, C.bodies[j].x)), s2 = (a.R * a.R + C.bodies[j].R * C.bodies[j].R) / (rr * rr); if (s2 > size2) size2 = s2;
      if (!o.eps && !o.row && !o.center) far += dot(L.farField(sub(a.x, C.bodies[j].x), sourceOf(C, i, j, o)).omega, a.axis) * dc.omegaI[j];
    }
    const wD = dc.omegaD[i], perp = norm(sub(vec, scale(a.axis, dot(vec, a.axis))));
    return { body: a.label, index: i, omegaObs: a.omega, omegaD: wD, omegaI: dc.omegaI[i], ratio: wD / a.omega, perpRel: perp / Math.abs(wD),
      farRel: (!o.eps && !o.row && !o.center) ? Math.abs(far - wD) / Math.abs(wD) : null, size2, recon: Math.abs(dc.omegaI[i] + wD - a.omega) / Math.abs(a.omega) };
  }).filter(Boolean);
  return { order, B, rows, U: U.map((r) => r.map((u) => (u ? norm(u) : null))) };
}
/** 受け手から見た源の幾何(距離・源の赤道からの仰角・遠方の q_eff・源の軸へ投影した向き) */
export function geometryOf(C) {
  const out = [];
  C.bodies.forEach((a, i) => {
    if (C.fixed.includes(i)) return;
    C.bodies.forEach((b, j) => {
      if (j === i) return;
      const d = sub(a.x, b.x), r = norm(d), mu = dot(d, b.axis) / r, src = sourceOf(C, i, j), ff = L.farField(d, src);
      const z = L.shellResponse(d, a.R, src, 12).omega;
      out.push({ recv: a.label, src: b.label, r, elevDeg: Math.asin(mu) / D2R, RrecOverR: a.R / r, RsrcOverR: b.R / r, qEff: ff.qEff,
        alongSrcAxis: dot(z, b.axis) / norm(z), gear: dot(z, b.axis) < 0, I: src.q / (r * r), D: b.m / (r * r * r), Wbg: C.Wbg });
    });
  });
  return out;
}
/* ───────────── P: 対の分母と行の分母(太陽の項の木星への寄与) ───────────── */
export function pairRow(configs) {
  const SJ = configs.find((c) => c.key === 'SJ'), S3 = configs.find((c) => c.key === 'SJIo'), JI = configs.find((c) => c.key === 'JIo');
  const beta = (C, i, j, row) => {
    const a = C.bodies[i], b = C.bodies[j], r = norm(sub(a.x, b.x)), q = C.c * C.c / (2 * C.k * C.G), D = b.m / (r * r * r);
    let I = q / (r * r);
    if (row) C.bodies.forEach((z, k) => { if (k !== i && k !== j) { const rk = norm(sub(a.x, z.x)); I += q / (rk * rk); } });
    return D / (C.Wbg + I);
  };
  const om = (C, i, j, row) => { const a = C.bodies[i]; return dot(L.shellResponse(sub(a.x, C.bodies[j].x), a.R, sourceOf(C, i, j, { row }), 12).omega, a.axis); };
  const denC = (C, i, j, row) => L.shellField(sub(C.bodies[i].x, C.bodies[j].x), sourceOf(C, i, j, { row }), 12).den;   // 受け手の中心の分母(行は他の源の I + D を足す)
  const r = {
    betaSJ: beta(SJ, 1, 0, false), betaSJIoPair: beta(S3, 1, 0, false), betaSJIoRow: beta(S3, 1, 0, true),
    omSJ: om(SJ, 1, 0, false), omSJIoPair: om(S3, 1, 0, false), omSJIoRow: om(S3, 1, 0, true),
    omIoJ_JIo: om(JI, 1, 0, false), omIoJ_SJIo: om(S3, 2, 1, false), omIoJ_SJIoRow: om(S3, 2, 1, true),
  };
  r.betaSame = r.betaSJ === r.betaSJIoPair; r.omSame = r.omSJ === r.omSJIoPair; r.ioSame = r.omIoJ_JIo === r.omIoJ_SJIo;
  r.denCenterPairOverRow = denC(S3, 1, 0, false) / denC(S3, 1, 0, true);   // 中心で割る行の尺度(今のエンジンの回転引きずりの s・軸引きずりの ν の形)の倍率
  r.betaRowOverPair = r.betaSJIoRow / r.betaSJIoPair; r.omRowOverPair = r.omSJIoRow / r.omSJIoPair; r.ioRowOverPair = r.omIoJ_SJIoRow / r.omIoJ_SJIo;
  return r;
}
/* ───────────── A: 係数の走査 ───────────── */
export function coefScan(dmain, configs) {
  const row = (key, body) => dmain.find((d) => d.key === key).rows.find((r) => r.body === body);
  const v = row('SV', 'Venus'), j = row('SJ', 'Jupiter');
  const JI = configs.find((c) => c.key === 'JIo'), dJI = dmain.find((d) => d.key === 'JIo');
  const AV = v.omegaObs / v.omegaD, AJ = j.omegaObs / j.omegaD, AIo = JI.bodies[1].omega / (dJI.B[1][0] * JI.bodies[0].omega);
  const list = [1, 1e5, 1e10, AV, 1e15, Math.abs(AJ)];
  const rows = list.map((A) => {
    const dc = L.decompose(dJI.B.map((r) => r.map((x) => x * A)), JI.bodies.map((b) => b.omega), []);
    return { A, venusDrag: A * v.ratio, venusInertial: 1 - A * v.ratio, jupiterDrag: A * j.ratio, jupiterInertial: 1 - A * j.ratio,
      ioDrag: dc.omegaD[1] / JI.bodies[1].omega, ioInertial: dc.omegaI[1] / JI.bodies[1].omega };
  });
  return { AV, AJ, AIo, signConflict: Math.sign(AV) !== Math.sign(AJ), rows,
    note: 'ω_I を自由にすれば任意の A で ω_I = ω_obs − A ω_D(1) と置ける —— 自転 2 本だけでは A を同定できない(追加の拘束: 自転の変化率・散逸・初期条件など)' };
}
/* ───────────── T: 瞬間の潮汐の率(規格化) ───────────── */
export function tideRates(C, dc) {
  return C.bodies.map((a, i) => {
    if (C.fixed.includes(i)) return null;
    let tq = 0, heat = 0, po = 0, ps = 0;
    const om = scale(a.axis, dc.omegaI[i]);
    C.bodies.forEach((b, j) => { if (j === i) return; const z = L.ctl3({ G: C.G, k2: 1, lag: 1, R: a.R, mj: b.m, r: sub(b.x, a.x), V: sub(b.v, a.v), omega: om }); tq += dot(z.torque, a.axis); heat += z.heat; po += z.powerOrbit; ps += z.powerSpin; });
    const I = EVO.inertia * a.m * a.R * a.R;
    return { body: a.label, torque: tq, accel: tq / I, heat, identity: (po + ps + heat) / Math.max(heat, Math.abs(ps), Math.abs(po)) };
  }).filter(Boolean);
}
/* ───────────── E: 釣り合いの仮説の時間発展 ───────────── */
export function evolutionOf(C, dmain, o = {}) {
  const r = C.bodies[C.recv], p = C.bodies[C.primary], N = EVO.stepsPerOrbit, orbits = o.orbits || EVO.orbits, W = Math.min(EVO.window, orbits - 1);
  const el = L.keplerElements(sub(r.x, p.x), sub(r.v, p.v), C.G * (p.m + r.m));
  const h = el.P / N, I = EVO.inertia * r.m * r.R * r.R;
  // 潮汐を起こす天体と軸引きずりの源(源の自転 = 分解した慣性自転 —— 太陽は観測の転記の値)
  const others = C.bodies.map((b, j) => ({ b, j })).filter(({ j }) => j !== C.recv && j !== C.primary);
  const frozen = others.map(({ b, j }) => ({ j, m: b.m, s0: sub(b.x, p.x), vs0: sub(b.v, p.v), b }));
  const wI = dmain.omegaI;
  // 半步の添字 k の表(1 公転で周期 —— h = P/N)
  const K = 2 * N, tab = [];
  for (let k = 0; k < K; k++) {
    const st = L.keplerState(el, k * h / 2), d = st.r, raisers = [{ m: p.m, r: scale(d, -1), V: scale(st.v, -1) }];
    let bd = dot(L.shellResponse(d, r.R, sourceOf(C, C.recv, C.primary), 8).omega, r.axis) * wI[C.primary];
    for (const f of frozen) {
      raisers.push({ m: f.m, r: sub(f.s0, d), V: sub(f.vs0, st.v) });
      bd += dot(L.shellResponse(sub(d, f.s0), r.R, sourceOf(C, C.recv, f.j), 8).omega, r.axis) * wI[f.j];
    }
    tab.push({ raisers, bd });
  }
  // 求積の表の確かめ(8 と 16 —— 4 相)
  let tabConv = 0;
  for (const k of [0, K / 4, K / 2, 3 * K / 4]) {
    const st = L.keplerState(el, k * h / 2);
    let b16 = dot(L.shellResponse(st.r, r.R, sourceOf(C, C.recv, C.primary), 16).omega, r.axis) * wI[C.primary];
    for (const f of frozen) b16 += dot(L.shellResponse(sub(st.r, f.s0), r.R, sourceOf(C, C.recv, f.j), 16).omega, r.axis) * wI[f.j];
    tabConv = Math.max(tabConv, Math.abs(tab[k].bd - b16) / Math.abs(b16));
  }
  const meanBd = tab.reduce((s, t, k) => s + (k % 2 === 0 ? t.bd : 0), 0) / N;
  const tauT = EVO.NT * el.P, a6 = el.a * el.a * el.a * el.a * el.a * el.a, R5 = r.R * r.R * r.R * r.R * r.R;
  const lag = I * a6 / (3 * EVO.k2 * C.G * p.m * p.m * R5 * tauT);
  const An = (el.n / 2) / Math.abs(meanBd);
  const tideAt = (k, w) => {
    const T = tab[k % K], om = scale(r.axis, w);
    let tq = 0, heat = 0, pOrb = 0;
    for (const z of T.raisers) { const c = L.ctl3({ G: C.G, k2: EVO.k2, lag, R: r.R, mj: z.m, r: z.r, V: z.V, omega: om }); tq += dot(c.torque, r.axis); heat += c.heat; pOrb += c.powerOrbit; }
    return { tq, heat, pOrb };
  };
  const steps = orbits * N, w0 = (W) * N, s0 = steps - w0;
  const run = (hyp, A) => {
    const dragAt = (k) => A * tab[k % K].bd;
    const R = L.evolveSpin({ hyp, I, omega0: wI[C.recv], h, steps, tauC: tauT, tauCool: tauT, dragAt, tideAt, sample: (s) => s >= s0 });
    const rec = R.rec, Tw = w0 * h;
    const obs = rec.map((q) => q.wI + q.wD), mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
    const wObs = mean(obs.slice(1)), wIm = mean(rec.slice(1).map((q) => q.wI)), wDm = mean(rec.slice(1).map((q) => q.wD));
    const dObs = (obs[obs.length - 1] - obs[0]) / Tw;
    const der = []; for (let k = 1; k + 1 < obs.length; k++) der.push((obs[k + 1] - obs[k - 1]) / (2 * h));
    const dm = mean(der), drms = Math.sqrt(mean(der.map((x) => (x - dm) * (x - dm))));
    const heatW = rec.slice(1).reduce((s, q) => s + q.dH, 0) / Tw;
    // 窓の平均のトルク(記録した ω_I で引き直す)
    let tqW = 0; rec.slice(1).forEach((q) => { tqW += tideAt(2 * q.s, hyp === 'A' ? q.wI + q.wD : q.wI).tq; }); tqW /= (rec.length - 1);
    const dEspin = 0.5 * I * (R.omegaI * R.omegaI - wI[C.recv] * wI[C.recv]), acc = R.acc;
    const spinLedger = Math.abs(dEspin - (acc.pSpin + acc.pSup)) / Math.max(Math.abs(dEspin), Math.abs(acc.pSpin), 1e-300);
    const ctlLedger = Math.abs(acc.pOrb + acc.pSpin + acc.pDrag + acc.heat) / Math.max(acc.heat, Math.abs(acc.pOrb), Math.abs(acc.pSpin), 1e-300);
    const heatLedger = Math.abs(acc.heat - R.E - R.radiated) / Math.max(acc.heat, 1e-300);
    return { hyp, A, omegaObsMeanOverN: wObs / el.n, omegaIMeanOverN: wIm / el.n, omegaDMeanOverN: wDm / el.n, _wObs: wObs, _wI: wIm, _wD: wDm,
      dObsMeanPN: dObs * el.P / el.n, dObsRmsPN: drms * el.P / el.n, torqueAccelPN: tqW / I * el.P / el.n, supplyPN: hyp === 'C' ? wDm / tauT * el.P / el.n : 0,
      heatMean: heatW, Eend: R.E, EoverHtau: heatW > 0 ? R.E / (heatW * tauT) : null,
      dragWorkOverHeat: heatW > 0 ? rec.slice(1).reduce((s, q) => s + q.dDrag, 0) / (heatW * Tw) : null, supplyOverHeat: heatW > 0 ? rec.slice(1).reduce((s, q) => s + q.dSup, 0) / (heatW * Tw) : null,
      spinLedger, ctlLedger, heatLedger };
  };
  const base = run('B', 0), runs = [];
  for (const [lvl, A] of [['1', 1], ['An', An]]) for (const hyp of ['A', 'B', 'C']) {
    const q = run(hyp, A);
    q.level = lvl;
    q.dObs = (q._wObs - base._wObs) / q._wD; q.dI = (q._wI - base._wI) / q._wD; q.heatRel = base.heatMean > 0 ? q.heatMean / base.heatMean : null;
    runs.push(q);
  }
  const strip = (q) => { const o2 = {}; for (const [k, x] of Object.entries(q)) if (!k.startsWith('_')) o2[k] = x; return o2; };
  return { key: C.key, recv: r.label, primary: p.label, a: el.a, e: el.e, n: el.n, P: el.P, incl: Math.acos(Math.max(-1, Math.min(1, dot(el.hhat, r.axis)))) / D2R,
    tauT, lag, An, meanDragA1OverN: meanBd / el.n, tabConv, orbits, window: W, stepsPerOrbit: N, base: strip(base), runs: runs.map(strip) };
}
/* ───────────── 全体 ───────────── */
export function runAll(HP, o = {}) {
  const quick = !!o.quick, t = {}; let t0 = Date.now();
  const ids = idsFromDecl(HP), { configs, ioPlacement } = buildConfigs(HP, ids);
  const checks = L.checksOf();
  // CTL の平面の極限(tests/lib-w292d-tide.mjs の ctlPair と)
  const pl = { G: 1, k2: 0.3, lag: 0.05, R: 0.7, mj: 2, r: [3, 0.4], V: [-0.2, 0.6], Omega: 0.8 };
  const old = ctlPair(pl), flat = L.ctl3({ ...pl, r: [...pl.r, 0], V: [...pl.V, 0], omega: [0, 0, pl.Omega] });
  const planar = Math.max(norm(sub(flat.diss, [...old.diss, 0])) / norm([...old.diss, 0]), Math.abs(flat.heat - old.heat) / old.heat, Math.abs(flat.torque[2] - old.torque) / Math.abs(old.torque));
  checks.gates.ctlPlanar = planar < 1e-13; checks.values.ctlPlanar = planar;
  t.checks = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now();
  const orders = quick ? [8, 12] : [8, 12, 16], main = orders[orders.length - 1];
  const decomp = configs.map((C) => { const runs = orders.map((n) => measure(C, n)); const fin = runs[runs.length - 1];
    const conv = Math.max(...runs[0].rows.map((r, k) => Math.abs(r.omegaD - fin.rows[k].omegaD) / Math.abs(fin.rows[k].omegaD)));
    return { key: C.key, ja: C.ja, preset: C.preset, order: main, conv8: conv, rows: fin.rows, B: fin.B, geometry: geometryOf(C) }; });
  t.decomp = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now();
  const radius = configs.map((C) => { const m1 = measure(C, 12), m01 = measure(C, 12, { eta: 0.1 }), m001 = measure(C, 12, { eta: 0.01 }), ms = measure(C, 12, { self: true }), me = measure(C, 12, { eps: true }), mc = measure(C, 12, { center: true });
    return { key: C.key, rows: m1.rows.map((r, k) => ({ body: r.body, eta1: r.omegaD, eta01: m01.rows[k].omegaD, eta001: m001.rows[k].omegaD, self: ms.rows[k].omegaD, epsDecl: me.rows[k].omegaD, eps: C.eps, center: mc.rows[k].omegaD })) }; });
  t.radius = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now();
  const pairrow = pairRow(configs);
  const scan = coefScan(decomp, configs);
  const tides = configs.map((C, k) => ({ key: C.key, rows: tideRates(C, { omegaI: (() => { const w = C.bodies.map((b) => b.omega); decomp[k].rows.forEach((r) => { w[r.index] = r.omegaI; }); return w; })() }) }));
  t.misc = { wallSec: (Date.now() - t0) / 1000 }; t0 = Date.now();
  const evolution = configs.map((C, k) => { const w = C.bodies.map((b) => b.omega); decomp[k].rows.forEach((r) => { w[r.index] = r.omegaI; }); return evolutionOf(C, { omegaI: w }, { orbits: quick ? EVO.quickOrbits : EVO.orbits }); });
  t.evolution = { wallSec: (Date.now() - t0) / 1000 };
  const inputs = configs.map((C) => ({ key: C.key, ja: C.ja, preset: C.preset, G: C.G, c: C.c, k: C.k, WbgSI: C.Wbg, epsSI: C.eps, recv: C.recv, primary: C.primary,
    bodies: C.bodies.map((b, i) => ({ label: b.label, m: b.m, R: b.R, omega: b.omega, axis: b.axis, x: b.x, v: b.v, fixed: C.fixed.includes(i) })) }));
  const J = { quick, ids, ioPlacement, evo: { ...EVO }, orders, inputs, checks, decomp, radius, pairrow, scan, tides, evolution };
  J.gates = gatesOf(J);
  J.ok = Object.values(J.gates).every(Boolean);
  J.timing = t;
  return J;
}
/* ───────────── 表(PHYSICS の行)・数・門 ───────────── */
const f3 = (v) => (v === null || v === undefined || !Number.isFinite(v)) ? '—' : (v === 0 ? '0' : (Math.abs(v) >= 1e-3 && Math.abs(v) < 1e4 ? String(Number(v.toPrecision(4))) : v.toExponential(3)));
export const fmtNum = f3;
const dOf = (J, key) => J.decomp.find((d) => d.key === key);
const rowOf = (J, key, body) => dOf(J, key).rows.find((r) => r.body === body);
const HYP_JA = { A: 'A(滑り = 観測の自転)', B: 'B(滑り = 慣性自転)', C: 'C(B + 引きずりが慣性自転へ)' };
export function physicsTables(J) {
  const L2 = [];
  L2.push('| 構成 | 受け手 | 源 | 距離 r [m] | 源の赤道からの仰角 [°] | R_受け手/r | 遠方の q_eff | 源の軸への向き(軸引きずり) | 慣性決定力 I = q/r² | 引きずり D = m/r³ | W_bg [kg/m³] |');
  L2.push('|---|---|---|---|---|---|---|---|---|---|---|');
  for (const d of J.decomp) for (const g of d.geometry) L2.push(`| ${d.ja} | ${g.recv} | ${g.src} | ${f3(g.r)} | ${f3(g.elevDeg)} | ${f3(g.RrecOverR)} | ${f3(g.qEff)} | ${g.gear ? '逆' : '同じ'}(${f3(g.alongSrcAxis)}) | ${f3(g.I)} | ${f3(g.D)} | ${f3(g.Wbg)} |`);
  L2.push('');
  L2.push('| 構成 | 受け手 | 観測の自転 ω_obs [rad/s] | 軸引きずり ω_D(A = 1)[rad/s] | 慣性自転 ω_I = ω_obs − ω_D [rad/s] | ω_D/ω_obs | 横成分 / |ω_D| | 遠方の閉じた式との差 | 求積 8 と最終の差 |');
  L2.push('|---|---|---|---|---|---|---|---|---|');
  for (const d of J.decomp) for (const r of d.rows) L2.push(`| ${d.ja} | ${r.body} | ${f3(r.omegaObs)} | ${f3(r.omegaD)} | ${r.omegaI.toExponential(9)} | ${f3(r.ratio)} | ${f3(r.perpRel)} | ${f3(r.farRel)} | ${f3(d.conv8)} |`);
  L2.push('');
  L2.push('| 構成 | 受け手 | ω_D(源の R_d = R)| R_d = 0.1 R | R_d = 0.01 R | 比 0.1 / 0.01 | 受け手の自己の項 m/R³ を分母へ | 宣言の ε(m) | ε を入れた ω_D | 分母を受け手の中心で固定 | 中心で固定 / 点ごと |');
  L2.push('|---|---|---|---|---|---|---|---|---|---|---|');
  for (const z of J.radius) for (const r of z.rows) L2.push(`| ${dOf(J, z.key).ja} | ${r.body} | ${f3(r.eta1)} | ${f3(r.eta01)} | ${f3(r.eta001)} | ${f3(r.eta01 / r.eta1)} / ${f3(r.eta001 / r.eta1)} | ${f3(r.self)} | ${f3(r.eps)} | ${f3(r.epsDecl)} | ${f3(r.center)} | ${f3(r.center / r.eta1)} |`);
  L2.push('');
  const P = J.pairrow;
  L2.push('| 太陽の項の木星への寄与 | 太陽–木星 | 太陽–木星–イオ(対の分母) | 同(行の分母 —— イオの I を足す) | 行/対 |');
  L2.push('|---|---|---|---|---|');
  L2.push(`| 並進の β = D/(Ŵ + I) | ${f3(P.betaSJ)} | ${f3(P.betaSJIoPair)}(${P.betaSame ? '同じビット' : '違う'}) | ${f3(P.betaSJIoRow)} | ${f3(P.betaRowOverPair)} |`);
  L2.push(`| 軸引きずり(太陽の単位の自転あたり —— 分母を点ごと) | ${f3(P.omSJ)} | ${f3(P.omSJIoPair)}(${P.omSame ? '同じビット' : '違う'}) | ${f3(P.omSJIoRow)} | ${f3(P.omRowOverPair)} |`);
  L2.push(`| 同(分母を受け手の中心の 1 つの数で割る行の尺度) | — | — | ${f3(P.omSJIoPair * P.denCenterPairOverRow)} | ${f3(P.denCenterPairOverRow)} |`);
  L2.push(`| 木星の項のイオへの寄与(対照) | ${f3(P.omIoJ_JIo)}(木星–イオ) | ${f3(P.omIoJ_SJIo)}(${P.ioSame ? '同じビット' : '違う'}) | ${f3(P.omIoJ_SJIoRow)} | ${f3(P.ioRowOverPair)} |`);
  L2.push('');
  const S = J.scan;
  L2.push(`| 係数 A | 金星 ω_D/ω_obs | 金星 ω_I/ω_obs | 木星 ω_D/ω_obs | 木星 ω_I/ω_obs | イオ ω_D/ω_obs(木星–イオ) | イオ ω_I/ω_obs |`);
  L2.push('|---|---|---|---|---|---|---|');
  for (const r of S.rows) L2.push(`| ${f3(r.A)} | ${f3(r.venusDrag)} | ${f3(r.venusInertial)} | ${f3(r.jupiterDrag)} | ${f3(r.jupiterInertial)} | ${f3(r.ioDrag)} | ${f3(r.ioInertial)} |`);
  L2.push('');
  L2.push('| 構成 | 受け手 | 慣性自転へのトルク τ·â [N m] | 角加速度 τ/I [rad/s²](I = 0.4 m R²) | 熱の率 H [W] | 恒等式 P_orb + τ·Ω + H の残差 |');
  L2.push('|---|---|---|---|---|---|');
  for (const z of J.tides) for (const r of z.rows) L2.push(`| ${dOf(J, z.key).ja} | ${r.body} | ${f3(r.torque)} | ${f3(r.accel)} | ${f3(r.heat)} | ${f3(r.identity)} |`);
  L2.push('');
  L2.push('| 構成(受け手) | e | 軌道と軸の角 [°] | 規格化の A_n | ⟨ω_D⟩/n(A = 1) | 表の求積 8 と 16 の差 |');
  L2.push('|---|---|---|---|---|---|');
  for (const z of J.evolution) L2.push(`| ${dOf(J, z.key).ja}(${z.recv}) | ${f3(z.e)} | ${f3(z.incl)} | ${f3(z.An)} | ${f3(z.meanDragA1OverN)} | ${f3(z.tabConv)} |`);
  L2.push('');
  L2.push('| 構成(受け手) | A | 仮説 | ⟨ω_obs⟩/n | (⟨ω_obs⟩ − 基線)/⟨ω_D⟩ | (⟨ω_I⟩ − 基線)/⟨ω_D⟩ | ⟨ω̇_obs⟩ P/n | ω̇_obs の変動 rms P/n | ⟨τ/I⟩ P/n | ⟨ω_D/τ_C⟩ P/n | 熱 / 基線の熱 | E/(⟨H⟩τ_cool) | 引きずりの仕事 / 熱(窓) | 供給 / 熱(窓) |');
  L2.push('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  for (const z of J.evolution) {
    const b = z.base;
    L2.push(`| ${dOf(J, z.key).ja}(${z.recv}) | 0 | 基線(引きずりなし) | ${b.omegaObsMeanOverN.toPrecision(8)} | — | — | ${f3(b.dObsMeanPN)} | ${f3(b.dObsRmsPN)} | ${f3(b.torqueAccelPN)} | 0 | 1 | ${f3(b.EoverHtau)} | — | — |`);
    for (const q of z.runs) L2.push(`| ${dOf(J, z.key).ja}(${z.recv}) | ${q.level === '1' ? '1' : 'A_n'} | ${HYP_JA[q.hyp]} | ${q.omegaObsMeanOverN.toPrecision(8)} | ${f3(q.dObs)} | ${f3(q.dI)} | ${f3(q.dObsMeanPN)} | ${f3(q.dObsRmsPN)} | ${f3(q.torqueAccelPN)} | ${f3(q.supplyPN)} | ${f3(q.heatRel)} | ${f3(q.EoverHtau)} | ${f3(q.dragWorkOverHeat)} | ${f3(q.supplyOverHeat)} |`);
  }
  return L2.join('\n');
}
/** 正本から作る数の文字列(PHYSICS の本文に入っていること —— QA が照合) */
export function docNumbers(J) {
  const v = rowOf(J, 'SV', 'Venus'), j = rowOf(J, 'SJ', 'Jupiter'), io = rowOf(J, 'JIo', 'Io');
  const evV = J.evolution.find((z) => z.key === 'SV'), rn = (h) => evV.runs.find((q) => q.level === 'An' && q.hyp === h);
  return [f3(v.omegaD), f3(v.ratio), f3(j.omegaD), f3(j.ratio), f3(io.omegaD), f3(J.scan.AV), f3(J.scan.AJ), f3(J.pairrow.omRowOverPair), f3(rn('A').dObs), f3(rn('B').dObs), f3(rn('C').dObs)]
    .filter((s) => s !== '—' && s !== '0');
}
export function gatesOf(J) {
  const allRows = J.decomp.flatMap((d) => d.rows), evRuns = J.evolution.flatMap((z) => [z.base].concat(z.runs));
  const lv = (z, h) => z.runs.find((q) => q.level === 'An' && q.hyp === h);
  const g = {
    checks: Object.values(J.checks.gates).every(Boolean),
    finite: allRows.every((r) => [r.omegaD, r.omegaI, r.ratio].every(Number.isFinite)),
    reconstruction: allRows.every((r) => r.recon < 1e-12),
    quadrature: J.decomp.every((d) => d.conv8 < 1e-6) && J.evolution.every((z) => z.tabConv < 1e-6),
    farField: allRows.every((r) => r.farRel === null || r.farRel < 3 * r.size2 + 1e-4),   // 遠方の閉じた式の差は (R/r)² の桁(木星–イオは R_木星/r = 0.17)
    etaSquared: J.radius.every((z) => z.rows.every((r) => { const f = rowOf(J, z.key, r.body).farRel || 0;
      return Math.abs(r.eta001 / r.eta01 / 0.01 - 1) < 0.003 && Math.abs(r.eta01 / r.eta1 / 0.01 - 1) < 0.003 + 1.5 * f; })),
    gearNearEquator: J.decomp.every((d) => d.geometry.every((g) => Math.abs(Math.sin(g.elevDeg * Math.PI / 180)) >= 0.5 || g.gear)),
    pairInvariant: J.pairrow.betaSame && J.pairrow.omSame && J.pairrow.ioSame && Math.abs(J.pairrow.omRowOverPair) < 1e-2 && J.pairrow.denCenterPairOverRow < 1e-3,
    centerDenominatorLaw: J.radius.every((z) => z.rows.every((r) => { const g = dOf(J, z.key).geometry.find((x) => x.recv === r.body && Math.abs(x.elevDeg) < 10 && x.I > 1e3 * (x.D + x.Wbg));
      return !g || Math.abs(r.center / r.eta1 - 3) < 0.05 + 5 * rowOf(J, z.key, r.body).size2; })),   // 慣性決定力が分母を支配する赤道付近: 点ごとの分母(q ≈ 3 —— −½)と中心で固定(q ≈ 5 —— −3/2)の比 ≈ 3
    scanRecorded: J.scan.signConflict === true && Number.isFinite(J.scan.AV) && Number.isFinite(J.scan.AJ),
    tideIdentity: J.tides.every((z) => z.rows.every((r) => Math.abs(r.identity) < 1e-12 && r.heat >= 0)),
    ledgers: evRuns.every((q) => q.spinLedger < 1e-8 && q.ctlLedger < 1e-9 && q.heatLedger < 1e-12),
    hypothesesSeparate: J.evolution.every((z) => Math.abs(lv(z, 'A').dObs) < 0.05 && Math.abs(lv(z, 'B').dObs - 1) < 0.05 && lv(z, 'C').dObs > 1.5 && lv(z, 'C').dObs < 2.5
      && Math.abs(lv(z, 'A').dI + 1) < 0.05 && Math.abs(lv(z, 'B').dI) < 0.05),
    hypothesesA1: J.evolution.every((z) => { const q = (h) => z.runs.find((x) => x.level === '1' && x.hyp === h); return Math.abs(q('A').dObs) < 0.05 && Math.abs(q('B').dObs - 1) < 0.05 && q('C').dObs > 1.5; }),
    steadyHeatC: J.evolution.every((z) => lv(z, 'B').heatRel === 1 && lv(z, 'C').heatRel > 5 * lv(z, 'A').heatRel && Math.abs(lv(z, 'C').supplyOverHeat + 1) < 0.05),   // B は基線とビット同一・C だけ定常の加熱(供給 ≈ −熱)
  };
  return g;
}
const NOT_CLAIM = ['金星の逆行を説明した', 'イオの加熱を再現した', '自転が釣り合った', '磁気双極子と同じ', '係数 A が決まった'];

export async function main() {
  const TARGET = process.env.W307C_TARGET || 'beta/index.html';
  const OUT = process.env.W307C_OUT || path.join(ROOT, 'tests', 'out', 'spindecomp-w307c.json');
  const quick = process.env.W307C_QUICK === '1';
  const html = path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET);
  const t0 = Date.now();
  const W281A_SCOPE = w281aScopeStamp(html, REGEN_SCOPE);
  const { HP } = loadHtmlMain(html);
  const R = runAll(HP, { quick });
  const out = { version: HARNESS_VERSION, libVersion: L.LIB_VERSION, generator: 'tests/exp-w307c-spindecomp.mjs', target: TARGET,
    targetSha256: crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex'),
    ruling: '原仮定者の裁定(第100報)(観測の自転 = 慣性軸回転 + 引きずり軸回転・軸引きずりは受け手の球面の近い側と遠い側の回転引きずりの差分・金星と太陽–木星を先に・木星–イオと太陽–木星–イオを対照・太陽の自転は分解しない・観測の自転が安定なら引きずり軸回転と潮汐のブレーキが釣り合う)・決断事項 AN345 ④(ω_obs = ω_I + ω_D・ω̇_obs = τ/I + ω̇_D)・統括の検証項目 R211',
    ...R };
  out.elapsedS = (Date.now() - t0) / 1000;
  const CODE = ['tests/exp-w307c-spindecomp.mjs', 'tests/lib-w307c-spindecomp.mjs', 'tests/lib-w292d-tide.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  out.meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第307便c', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION,
    engine: 'Node(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— 本の宣言を読むだけ。軸引きずりの球面の核・三次元の CTL・内部熱は器の参照の純関数〔エンジンの式ではない〕)',
    notClaim: NOT_CLAIM });
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
  console.log('→', path.relative(ROOT, OUT), 'ok=' + out.ok, JSON.stringify(out.gates), out.elapsedS + ' s', JSON.stringify(out.timing));
}
if (IS_MAIN) await main();

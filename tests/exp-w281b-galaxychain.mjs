// 第281便b(原仮定者の裁定(第71報)「銀河の引きずり(座標変換)の分布を確認する。中心天体群から外縁にかけて引きずりが
// 連鎖する事で、引きずり強度のなだらかな変化と、連鎖引きずりの限界による背景宇宙との境界が生じる」・統括の読み R72/R73)
// — **銀河連鎖便の器**(表示・純関数・記録だけ —— エンジンへは 1 バイトも接続しない)。
//
// ■ 何を測るか
//   ① 場の契約の一覧(R72): 🎠 galaxyMeshSpiral・🪁 galaxyMeshSpiralGeoToy・🎋 galaxyMeshSpiralGeoToyLite・
//      🛞 ngc3198DFM の**初期状態**で、半径 20/40/80/120/240/480 × 64 方位の平均 χ・u_φ・|u| を 3 列で出す:
//        disp = 表示 `dfmGalaxyMeshField`(p=2・D₀ をそのまま W_bg に使う・宣言があれば disk/affine・`unValid` の印)
//        api1 = 共通 API `dfmFieldSnapshot`→`dfmField`(share → p=1・全源・背景 static)
//        api2 = 対照: 同じ共通 API で p=2 だけ替えたもの
//      kFrame>0 の本(🎠🛞)は 1 歩後の **E6′ の u(エンジンが粒子位置で作った値 `S.uPx/uPy`)**を粒子の半径ビンで並記する。
//   ② 連鎖の実測(R73): 🎋(171 体)で t=0/10/20/40 の半径ビン |u|(R)・u_φ(R)・χ(R)=W_L/(W_L+W_bg)・
//      R_edge(χ̄ が 0.5/0.2/0.1 を切る半径 —— **診断閾値であって場は切らない**)・慣性 v_φ と座標速度 ẋ_φ・
//      渦度/ひずみ率/発散/条件数・半径 R の内側の角運動量 L(<R)。
//      **中心応答** ∂u_φ/∂Ω_core を中心 spin 1.2 と 0 の 2 走行の差で(🎋 と、E6′ が spin を読む 🎠 の対照)。
//      W_bg を D₀ の流用ではなく**外部天体**(静止した 64 体の環・半径 2600 と 26000・中心で W_bg=D₀ となる宣言の規格化)
//      から作った場合の χ の差(p=2 は `dfmComplexMomentsOf`/`dfmBlendComplexMoments` = 第279便c の閾値なし合成と照合)。
//   ③ 有限予算の交換模型の帳簿(純関数 `tests/lib-w281b-chain.mjs`)→ 別の正本 `tests/out/chainledger-w281b.json`
//      (target=lib 自身 —— html を読まない)。
//
// ■ しないこと
//   ・R_edge で場を切らない・「境界を発見した」「平坦回転を再現した」と書かない・v_c を先に合わせるパラメータを置かない。
//   ・mutual:1 を使わない・較正 37 本に触らない・内蔵プリセットを足さない(コピーは器の中だけ)。
//
// 実行(約 1〜2 分・Chromium 不要・環境変数なし —— 既定で beta/index.html を読む。`QA_TARGET` で対象を替えられる):
//   node tests/exp-w281b-galaxychain.mjs            … 両方の正本を書く
//   node tests/exp-w281b-galaxychain.mjs --ledger   … 交換模型の正本だけ
// 正本: tests/out/galaxychain-w281b.json(target=beta/index.html —— **html が変わったら走らせ直す**)/
//       tests/out/chainledger-w281b.json(target=tests/lib-w281b-chain.mjs)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import * as CH from './lib-w281b-chain.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w281b-galaxychain-1';
export const RADII = [20, 40, 80, 120, 240, 480];
export const NAZ = 64;
export const DT = 0.016;
export const CHAIN_TIMES = [0, 10, 20, 40];
export const EDGE_THR = [0.5, 0.2, 0.1];
export const EXT_RING = { K: 64, radii: [2600, 26000] };
export const CONTRACT_PRESETS = ['galaxyMeshSpiral', 'galaxyMeshSpiralGeoToy', 'galaxyMeshSpiralGeoToyLite', 'ngc3198DFM'];

// ---- 読み手ごとの契約(lawId は本便で付けた**名前**であって、html の宣言ではない —— どれを境界判定の正典にするかは決断事項)
export const FIELD_CONTRACTS = [
  { lawId: 'GF-disp', reader: 'dfmGalaxyMeshField(表示・記録・蓄積格子)', weight: 'w=m(d²+ε²)^(−p/2)', p: '2(GALMESH_P_DEFAULT — share の本でも 2・pull 系は frameWeightPow)',
    background: 'D₀ をそのまま W_bg に使う(χ=W/(W+D₀))・u_bg は宣言 bg(static=0 / frame=dfmFrameAt)', sources: '全源で W(χ)・u_n の標本は unSource(disk=静止中心を外す)',
    selfExclusion: 'なし(格子点で評価)', spin: '入力に無い', fit: 'unFit(mean / affine)・標本外は unValid=false の印' },
  { lawId: 'GF-api1', reader: 'dfmFieldSnapshot → dfmField(共通 API・診断)', weight: 'w=m(d²+ε²)^(−p/2)', p: 'frameWeightPow(share → 1)',
    background: 'D₀(pull 系は D0pull)を分母に足す・u_bg=0(static)', sources: '全源', selfExclusion: 'なし(格子点)・excludeBodyId で外せる', spin: '入力に無い(snapshot は omega を渡さない)', fit: '正規化平均' },
  { lawId: 'GF-api2', reader: '対照: 共通 API で p=2 だけ替えたもの', weight: '同上', p: '2', background: '同上', sources: '全源', selfExclusion: 'なし', spin: '入力に無い', fit: '正規化平均' },
  { lawId: 'GF-e6', reader: 'S._core の E6′(kFrame>0 の本の力学)', weight: 'w=m/√(d²+ε²)(share)/ m/(d²+ε²)(pull)', p: '1(share)',
    background: 'D₀(+箱の W_B)を分母に足す', sources: '自分以外の全粒子', selfExclusion: 'あり(対ループ)', spin: '入る: ω_j(d)=s_j(R_j/(R_j+d))^q・q=2', fit: '正規化平均(粒子位置だけ)' },
  { lawId: 'GF-toy', reader: 'dfmGeoToyStep(geoPN=3・scalar の力学)', weight: 'w=m(d²+ε²)^(−p/2)', p: 'frameWeightPow(share → 1)',
    background: 'D₀ を分母に足す・u_bg=0', sources: '自分以外の全粒子(重力も同じ集合)', selfExclusion: 'あり(excludeBodyId)', spin: '入らない(omega:0)', fit: '正規化平均(粒子位置だけ)' },
];

const phiHat = (x, y) => { const r = Math.hypot(x, y); return [-y / r, x / r]; };
function mean(a) { return a.length ? a.reduce((s, v) => s + v, 0) / a.length : null; }

/** 1 つの読み手を 1 つの半径で 64 方位に評価して平均する。fn(x,y) → {chi,u,gradU?,unValid?,W?,fitCond?} or null */
export function ringStats(fn, R, cx, cy, nAz) {
  const N = nAz || NAZ;
  const chi = [], uPhi = [], uAbs = [], om = [], sh = [], dv = [], cond = [], fc = [], W = [];
  let nNull = 0, nExtrap = 0;
  for (let k = 0; k < N; k++) {
    const th = 2 * Math.PI * k / N, x = cx + R * Math.cos(th), y = cy + R * Math.sin(th);
    const f = fn(x, y);
    if (!f || !f.u) { nNull++; continue; }
    const [ex, ey] = phiHat(x - cx, y - cy);
    chi.push(f.chi); uPhi.push(f.u[0] * ex + f.u[1] * ey); uAbs.push(Math.hypot(f.u[0], f.u[1]));
    if (f.W !== undefined && f.W !== null) W.push(f.W);
    if (f.unValid === false) nExtrap++;
    if (typeof f.fitCond === 'number') fc.push(f.fitCond);
    const G = f.gradU;
    if (Array.isArray(G) && G.length === 4) {
      const [a, b, c, d] = G;                                     // [∂x ux, ∂y ux, ∂x uy, ∂y uy]
      om.push(c - b); dv.push(a + d); sh.push(Math.hypot(a - d, b + c));
      // 条件数 = 2×2 の特異値比(σmax/σmin)
      const s1 = a * a + b * b + c * c + d * d, det = Math.abs(a * d - b * c);
      const disc = Math.sqrt(Math.max(0, s1 * s1 - 4 * det * det));
      const smax = Math.sqrt((s1 + disc) / 2), smin = Math.sqrt(Math.max(0, (s1 - disc) / 2));
      cond.push(smin > 0 ? smax / smin : Infinity);
    }
  }
  const out = { R, chi: mean(chi), uPhi: mean(uPhi), uAbs: mean(uAbs), nNull, nExtrap };
  if (W.length) out.W = mean(W);
  if (om.length) { out.vort = mean(om); out.shear = mean(sh); out.div = mean(dv);
    const cf = cond.filter(Number.isFinite); out.condMedian = cf.length ? cf.sort((p, q) => p - q)[Math.floor(cf.length / 2)] : null; }
  if (fc.length) out.fitCondMean = mean(fc);
  return out;
}

export function buildPreset(HP, id, mutate) {
  const p = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === id)));
  if (mutate) mutate(p);
  const v = HP.validatePreset(p);
  HP.sim.build(v.preset);
  return { S: HP.sim, preset: v.preset };
}

/** 3 列(+ E6′)の読み手を作る */
export function readers(HP, S) {
  const snap = HP.dfmFieldSnapshot(S);
  const disp = (x, y) => HP.dfmGalaxyMeshField(S, x, y, { need: 'uB' });
  const api = (pw) => (snap && snap.bodies) ? (x, y) => HP.dfmField(snap.bodies, x, y, Object.assign({}, snap.options, pw === undefined ? {} : { p: pw })) : () => null;
  return { snap, disp, api1: api(), api2: api(2) };
}

/** 契約表の 1 行(1 本のプリセットの初期状態)。QA docs.galaxyFieldContract がいまの html で引き直す */
export function contractRow(HP, id) {
  const { S, preset } = buildPreset(HP, id);
  const R = readers(HP, S);
  const g0 = HP.dfmGalaxyMeshField(S, RADII[0], 0, { need: 'u' });
  const row = { id, emoji: preset.emoji, n: S.n, kFrame: preset.physics.kFrame, geoPN: preset.physics.geoPN,
    frameWeight: preset.physics.frameWeight || 'pull(既定)', D0: preset.physics.D0, eps: preset.physics.softening,
    snapStop: R.snap ? R.snap.stop : 'null', snapOptions: R.snap ? R.snap.options : null,
    dispDecl: g0 ? { p: g0.p, D0: g0.D0, unSource: g0.unSource, unFit: g0.unFit, bg: g0.bg } : null, rows: [] };
  for (const r of RADII) row.rows.push({ R: r, disp: ringStats(R.disp, r, 0, 0), api1: ringStats(R.api1, r, 0, 0), api2: ringStats(R.api2, r, 0, 0) });
  // 表示の χ は W が p=2・全源・D₀(disk は u_n の標本だけを外す)なので、共通 API の p=2 と同じ式になるはず —— 値で照合する
  let dChi = 0;
  for (const r of RADII) for (let k = 0; k < NAZ; k++) {
    const th = 2 * Math.PI * k / NAZ, a = R.disp(r * Math.cos(th), r * Math.sin(th)), b = R.api2(r * Math.cos(th), r * Math.sin(th));
    if (a && b) dChi = Math.max(dChi, Math.abs(a.chi - b.chi));
  }
  row.maxAbsChiDispMinusApi2 = dChi;
  if (preset.physics.kFrame > 0) {
    S.step(DT);                                                   // E6′ の u は 1 歩で作られる(S.uPx/uPy)
    row.e6AfterOneStep = binParticles(S, (i) => (S.hasU && S.hasU[i]) ? [S.uPx[i], S.uPy[i]] : null);
    // 同じ初期状態で**自転だけ 0**(single の spin を 0)にした 1 歩 —— E6′ の u のうち自転項の寄与を分ける
    const { S: S0 } = buildPreset(HP, id, (p) => { for (const b of p.bodies) if (b.type === 'single' && b.spin) b.spin = 0; });
    S0.step(DT);
    row.e6SpinZeroAfterOneStep = binParticles(S0, (i) => (S0.hasU && S0.hasU[i]) ? [S0.uPx[i], S0.uPy[i]] : null);
  }
  return row;
}

// 粒子の半径ビン(RADII に合わせた境界)
export const BIN_EDGES = [10, 30, 60, 100, 180, 360, 720];
export function binParticles(S, valFn, cx, cy) {
  const c0 = cx || 0, c1 = cy || 0;
  const out = RADII.map((R, k) => ({ R, lo: BIN_EDGES[k], hi: BIN_EDGES[k + 1], n: 0, uPhi: 0, uAbs: 0 }));
  for (let i = 0; i < S.n; i++) {
    if (S.pinned && S.pinned[i]) continue;
    const x = S.x[i] - c0, y = S.y[i] - c1, r = Math.hypot(x, y);
    const k = BIN_EDGES.findIndex((e, j) => j + 1 < BIN_EDGES.length && r >= e && r < BIN_EDGES[j + 1]);
    if (k < 0) continue;
    const u = valFn(i);
    if (!u) continue;
    const [ex, ey] = phiHat(x, y);
    out[k].n++; out[k].uPhi += u[0] * ex + u[1] * ey; out[k].uAbs += Math.hypot(u[0], u[1]);
  }
  for (const b of out) if (b.n) { b.uPhi /= b.n; b.uAbs /= b.n; } else { b.uPhi = null; b.uAbs = null; }
  return out;
}

// ---- R_edge: χ̄(R) を対数格子で引き、閾値を初めて(内→外)切る半径を対数内挿する。**場は切らない**
export const EDGE_GRID = (() => { const g = []; for (let k = 0; k <= 240; k++) g.push(Math.pow(10, k / 40)); return g; })();   // 1 〜 10⁶
export function edgeRadii(chiOf, thrs) {
  const prof = EDGE_GRID.map((R) => chiOf(R));
  const out = {};
  for (const t of thrs) {
    let first = null, nCross = 0;
    for (let k = 1; k < prof.length; k++) {
      const a = prof[k - 1], b = prof[k];
      if (a === null || b === null) continue;
      if ((a - t) * (b - t) < 0 || (b === t && a !== t)) {
        nCross++;
        if (first === null && a > t) {
          const la = Math.log(EDGE_GRID[k - 1]), lb = Math.log(EDGE_GRID[k]);
          first = Math.exp(la + (lb - la) * (a - t) / (a - b));
        }
      }
    }
    out[String(t)] = { R: first, nCross };
  }
  return out;
}

// 外部天体の環(静止)の W_bg。規格化は「中心で W_bg=D₀」(宣言)
export function extRingW(Rext, K, pw, D0, eps, x, y) {
  const m = D0 / (K * Math.pow(Rext * Rext + eps * eps, -pw / 2));
  let W = 0;
  for (let k = 0; k < K; k++) {
    const th = 2 * Math.PI * k / K, dx = x - Rext * Math.cos(th), dy = y - Rext * Math.sin(th);
    W += m * Math.pow(dx * dx + dy * dy + eps * eps, -pw / 2);
  }
  return { W, m };
}
export function extRingList(Rext, K, D0, eps) {
  const m = D0 / (K * Math.pow(Rext * Rext + eps * eps, -1));
  return Array.from({ length: K }, (_, k) => { const th = 2 * Math.PI * k / K; return { m, x: Rext * Math.cos(th), y: Rext * Math.sin(th), vx: 0, vy: 0 }; });
}

/** 1 時刻の連鎖の記録(🎋) */
function chainSnapshot(HP, S, prevXY, dt) {
  const R = readers(HP, S);
  const D0 = S.params.D0, eps = S.params.softening;
  const rec = { t: S.t, ring: [], bins: null, edge: {}, ext: [] };
  for (const r of RADII) rec.ring.push({ R: r, disp: ringStats(R.disp, r, 0, 0), api1: ringStats(R.api1, r, 0, 0), api2: ringStats(R.api2, r, 0, 0) });
  // 粒子ビン: 慣性 v_φ(S.vx,S.vy)・座標速度 ẋ_φ(直前 1 歩の変位 / dt)・トイが読む自己除外の u(p=1)
  const snap = R.snap;
  const bodies = snap.bodies;
  const vB = binParticles(S, (i) => [S.vx[i], S.vy[i]]);
  const xB = prevXY ? binParticles(S, (i) => [(S.x[i] - prevXY.x[i]) / dt, (S.y[i] - prevXY.y[i]) / dt]) : null;
  const uB = binParticles(S, (i) => { const f = HP.dfmField(bodies, S.x[i], S.y[i], Object.assign({}, snap.options, { excludeBodyId: i, need: 'mesh' })); return f ? f.u : null; });
  let dxv = 0;
  if (prevXY) for (let i = 0; i < S.n; i++) { if (S.pinned[i]) continue;
    dxv = Math.max(dxv, Math.hypot((S.x[i] - prevXY.x[i]) / dt - S.vx[i], (S.y[i] - prevXY.y[i]) / dt - S.vy[i])); }
  // 角運動量 L(<R)(自由粒子の軌道角運動量・慣性速度)
  const Lin = RADII.map((Rr) => { let L = 0; for (let i = 0; i < S.n; i++) { if (S.pinned[i]) continue;
    if (Math.hypot(S.x[i], S.y[i]) < Rr) L += S.m[i] * (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]); } return L; });
  rec.bins = RADII.map((Rr, k) => ({ R: Rr, n: vB[k].n, vPhi: vB[k].uPhi, xdotPhi: xB ? xB[k].uPhi : null, uToyPhi: uB[k].uPhi, uToyAbs: uB[k].uAbs, Lin: Lin[k] }));
  rec.maxXdotMinusV = prevXY ? dxv : null;
  // R_edge(3 列 —— 表示の χ は W が p=2・全源・D₀ なので api2 と同じ式。値で照合する)
  const chiMean = (fn) => (Rr) => { let s = 0, n = 0; for (let k = 0; k < NAZ; k++) { const th = 2 * Math.PI * k / NAZ;
    const f = fn(Rr * Math.cos(th), Rr * Math.sin(th)); if (f && Number.isFinite(f.chi)) { s += f.chi; n++; } } return n ? s / n : null; };
  const apiMesh = (pw) => (x, y) => HP.dfmField(bodies, x, y, Object.assign({}, snap.options, { need: 'mesh' }, pw === undefined ? {} : { p: pw }));
  const dispU = (x, y) => HP.dfmGalaxyMeshField(S, x, y, { need: 'u' });
  rec.edge.api1 = edgeRadii(chiMean(apiMesh()), EDGE_THR);
  rec.edge.api2 = edgeRadii(chiMean(apiMesh(2)), EDGE_THR);
  rec.edge.disp = edgeRadii(chiMean(dispU), EDGE_THR);
  // 外部天体の環(W_bg を D₀ の流用でなく明示天体から)
  for (const Rext of EXT_RING.radii) {
    for (const pw of [1, 2]) {
      const chiExt = (x, y) => { const f = HP.dfmField(bodies, x, y, Object.assign({}, snap.options, { need: 'mesh', p: pw }));
        if (!f) return null; const bgW = extRingW(Rext, EXT_RING.K, pw, D0, eps, x, y).W; return { chi: f.W / (f.W + bgW) }; };
      const ring = RADII.map((Rr) => { const st = ringStats((x, y) => { const c = chiExt(x, y); return c ? { chi: c.chi, u: [0, 0] } : null; }, Rr, 0, 0); return { R: Rr, chi: st.chi }; });
      const edge = edgeRadii(chiMean((x, y) => (Math.hypot(x, y) < 0.95 * Rext ? chiExt(x, y) : null)), EDGE_THR);
      rec.ext.push({ Rext, p: pw, ring, edgeInside095: edge });
    }
  }
  return rec;
}

/** 第279便c の閾値なし合成(p=2)と本器の手計算の照合(🎋 の初期状態・環 2600) */
function blendCheck(HP, S) {
  const snap = HP.dfmFieldSnapshot(S);
  const D0 = S.params.D0, eps = S.params.softening;
  const bg = extRingList(2600, EXT_RING.K, D0, eps);
  let maxRel = 0, n = 0;
  for (const r of RADII) for (let k = 0; k < 8; k++) {
    const th = 2 * Math.PI * k / 8, x = r * Math.cos(th), y = r * Math.sin(th);
    const L = HP.dfmComplexMomentsOf(snap.bodies, x, y, eps * eps), B = HP.dfmComplexMomentsOf(bg, x, y, eps * eps);
    const bl = HP.dfmBlendComplexMoments(Object.assign({}, L, { selfExcluded: true }), B);
    const f = HP.dfmField(snap.bodies, x, y, Object.assign({}, snap.options, { need: 'mesh', p: 2 }));
    const mine = f.W / (f.W + extRingW(2600, EXT_RING.K, 2, D0, eps, x, y).W);
    const rel = Math.abs(bl.chi - mine) / Math.abs(mine);
    if (rel > maxRel) maxRel = rel; n++;
  }
  return { n, maxRelChi: maxRel, note: 'dfmBlendComplexMoments の χ=W_loc/(W_loc+W_bg) と本器の手計算(dfmField p=2 の W + 環の W)' };
}

/** 連鎖の走行(spin を替えた 2 走行)。戻り値 {times:[rec...]} */
export function chainRun(HP, id, spin) {
  const { S } = buildPreset(HP, id, (p) => { p.bodies[0].spin = spin; });
  const recs = [];
  let prev = null;
  const stepsAt = CHAIN_TIMES.map((t) => Math.round(t / DT));
  let k = 0;
  const snapState = () => ({ x: Float64Array.from(S.x.subarray(0, S.n)), y: Float64Array.from(S.y.subarray(0, S.n)) });
  const stateAt = [];
  for (const target of stepsAt) {
    while (k < target) { if (k === target - 1) prev = snapState(); S.step(DT); k++; }
    recs.push(chainSnapshot(HP, S, target > 0 ? prev : null, DT));
    stateAt.push({ x: Array.from(S.x.subarray(0, S.n)), y: Array.from(S.y.subarray(0, S.n)), vx: Array.from(S.vx.subarray(0, S.n)), vy: Array.from(S.vy.subarray(0, S.n)),
      uPx: S.uPx ? Array.from(S.uPx.subarray(0, S.n)) : null, uPy: S.uPy ? Array.from(S.uPy.subarray(0, S.n)) : null, nan: S.hasNaN ? S.hasNaN() : null });
  }
  return { recs, stateAt, n: S.n, spinRead: S.spin ? S.spin[0] : null };
}

/** 中心応答: 2 走行の差(t ごと・半径ごと)。ΔΩ で割った ∂u_φ/∂Ω_core と、状態そのものの差 */
export function responseOf(A, B, dOmega) {
  return A.recs.map((ra, j) => {
    const rb = B.recs[j], sa = A.stateAt[j], sb = B.stateAt[j];
    let dx = 0, dv = 0, du = 0;
    for (let i = 0; i < sa.x.length; i++) {
      dx = Math.max(dx, Math.hypot(sa.x[i] - sb.x[i], sa.y[i] - sb.y[i]));
      dv = Math.max(dv, Math.hypot(sa.vx[i] - sb.vx[i], sa.vy[i] - sb.vy[i]));
      if (sa.uPx && sb.uPx) du = Math.max(du, Math.hypot(sa.uPx[i] - sb.uPx[i], sa.uPy[i] - sb.uPy[i]));
    }
    return { t: ra.t, maxAbsDx: dx, maxAbsDv: dv, maxAbsDuE6: du,
      rows: ra.ring.map((z, k) => { const w = rb.ring[k];
        return { R: z.R, dDispUphi: z.disp.uPhi - w.disp.uPhi, dApi1Uphi: z.api1.uPhi - w.api1.uPhi,
          dDispUphiPerOmega: (z.disp.uPhi - w.disp.uPhi) / dOmega, dApi1UphiPerOmega: (z.api1.uPhi - w.api1.uPhi) / dOmega,
          dVphiBin: (ra.bins[k].vPhi !== null && rb.bins[k].vPhi !== null) ? ra.bins[k].vPhi - rb.bins[k].vPhi : null }; }) };
  });
}

export function ledgerCanon(root) {
  const suite = CH.chainLedgerSuite();
  const meta = Object.assign(provenanceMeta({ root, wave: '第281便b', target: 'tests/lib-w281b-chain.mjs',
    code: ['tests/exp-w281b-galaxychain.mjs', 'tests/lib-w281b-chain.mjs', 'tests/lib-w272e-provenance.mjs'],
    inputs: ['tests/lib-w281b-chain.mjs'] }), {
    harnessVersion: HARNESS_VERSION, libVersion: CH.CHAIN_LIB_VERSION,
    ruling: '第71報: 中心天体群から外縁にかけて引きずりが連鎖する(連鎖引きずりの限界による背景宇宙との境界)',
    reading: 'R73: 有限予算の交換模型 I_iΩ̇_i=ΣK_ij(Ω_j−Ω_i) —— 連鎖仮説を調べる構成則であって DFM の導出則ではない',
    notClaim: ['DFM から導出した', '差動回転を再現した', '平坦回転を再現した', '境界を発見した', '新発見'] });
  return { meta, suite };
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const args = process.argv.slice(2);
  const TARGET = process.env.QA_TARGET || 'beta/index.html';
  const outDir = path.join(ROOT, 'tests', 'out');
  fs.mkdirSync(outDir, { recursive: true });
  const L = ledgerCanon(ROOT);
  fs.writeFileSync(path.join(outDir, 'chainledger-w281b.json'), JSON.stringify(L, null, 1));
  console.log('chainledger: J 相対 ' + L.suite.closed.ledger.jRelMax.toExponential(2) + '・閉じ ' + L.suite.closed.ledger.closeRelMax.toExponential(2)
    + '・次数 ' + L.suite.convergence.rows.slice(1).map((r) => r.order.toFixed(4)).join('/') + '・因果対照 ' + L.suite.causal.outerExactZero);
  if (!args.includes('--ledger')) {
    const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
    const t0 = Date.now();
    const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
    const contract = CONTRACT_PRESETS.map((id) => contractRow(HP, id));
    console.log('契約表 ' + ((Date.now() - t0) / 1000).toFixed(1) + ' s');
    for (const c of contract) {
      const r240 = c.rows.find((z) => z.R === 240);
      console.log(`${c.emoji} ${c.id}: r=240 χ disp ${r240.disp.chi.toFixed(4)} / api1 ${r240.api1.chi.toFixed(4)} / api2 ${r240.api2.chi.toFixed(4)} ・u_φ ${r240.disp.uPhi.toFixed(3)}/${r240.api1.uPhi.toFixed(3)}/${r240.api2.uPhi.toFixed(3)}`);
    }
    const lite = 'galaxyMeshSpiralGeoToyLite';
    const { S: S0 } = buildPreset(HP, lite);
    const blend = blendCheck(HP, S0);
    const t1 = Date.now();
    const A = chainRun(HP, lite, 1.2), B = chainRun(HP, lite, 0);
    console.log('🎋 2 走行 ' + ((Date.now() - t1) / 1000).toFixed(1) + ' s');
    const t2 = Date.now();
    const CA = chainRun(HP, 'galaxyMeshSpiral', 1.2), CB = chainRun(HP, 'galaxyMeshSpiral', 0);
    console.log('🎠 2 走行 ' + ((Date.now() - t2) / 1000).toFixed(1) + ' s');
    const meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第281便b', target: TARGET,
      code: ['tests/exp-w281b-galaxychain.mjs', 'tests/lib-w281b-chain.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w272e-provenance.mjs'],
      inputs: [TARGET] }), {
      harnessVersion: HARNESS_VERSION, loadErrors: errors.length,
      ruling: '第71報: 銀河の引きずり(座標変換)の分布を確認する。中心天体群から外縁にかけて引きずりが連鎖する事で、引きずり強度のなだらかな変化と、連鎖引きずりの限界による背景宇宙との境界が生じる',
      reading: 'R72(場の契約が割れている)・R73(連鎖を測る量・R_edge は診断量)',
      radii: RADII, nAz: NAZ, dt: DT, chainTimes: CHAIN_TIMES, edgeThresholds: EDGE_THR, edgeGrid: '10^(k/40), k=0..240(1〜10⁶)', extRing: EXT_RING,
      extRingNorm: '環の質量は中心で W_bg=D₀ になるよう宣言で規格化(回転曲線には合わせていない)',
      notClaim: ['境界を発見した', '平坦回転を再現した', '観測一致を達成した', '較正した', '新発見', '引きずり消失を確認した'] });
    const strip = (R) => ({ recs: R.recs, n: R.n, spinRead: R.spinRead });
    const out = { meta, contracts: FIELD_CONTRACTS, contract, blendCheck: blend,
      chain: { preset: lite, spinA: 1.2, spinB: 0, runA: strip(A), runB: strip(B), response: responseOf(A, B, 1.2) },
      contrast: { preset: 'galaxyMeshSpiral', spinA: 1.2, spinB: 0, runA: strip(CA), runB: strip(CB), response: responseOf(CA, CB, 1.2) } };
    fs.writeFileSync(path.join(outDir, 'galaxychain-w281b.json'), JSON.stringify(out, null, 1));
    console.log('→ tests/out/galaxychain-w281b.json(' + ((Date.now() - t0) / 1000).toFixed(1) + ' s)');
  }
}

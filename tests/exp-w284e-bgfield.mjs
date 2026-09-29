// 第284便e(原仮定者の裁定(第74報)④「背景複素決定力 W₀・A₀ 関連パラメータについて算出可能なものを確認する」・
// 統括の検証項目 R91)—— **背景複素決定力 W₀・A₀ の算出表と接続の実測**の器。
//
// ■ 何を測るか(Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読む)
//   (A) 算出の式(p=2 —— `dfmComplexMomentsOf` と同じ核): 明示天体と重複しない背景源 j の台帳 {m_j, X_j, V_j, a_j} と
//       軟化 ε から、評価点 x で r_j = x − X_j・s_j = |r_j|² + ε²・w_j = m_j/s_j として
//         W₀ = Σ w_j                     [M/L²]
//         A₀ = Σ w_j V_j                 [M/(L·T)](向きつき)
//         ∇W₀ = Σ ∇w_j = Σ −2 m_j r_j / s_j²        [M/L³]
//         (∇A₀)_ab = Σ V_ja ∂_b w_j      [M/(L²·T)](並び [∂ₓAx, ∂_yAx, ∂ₓAy, ∂_yAy])
//         ∂ₜW₀ = Σ ∂ₜw_j = Σ −∇w_j·V_j   [M/(L²·T)]
//         ∂ₜA₀ = Σ [(∂ₜw_j) V_j + w_j a_j]            [M/(L·T²)]
//       を器の中の独立な実装 `momentsP2` で書き、html の `HP.dfmComplexMomentsOf` と台帳ごとに照合する(相対 1e-12)。
//   (B) 検算 3 件: ① 2 源 m=1 を x=±2・速度 ±3ŷ・ε=0 → 原点で W₀=0.5・A₀=0・∇W₀=0・∂A_y/∂x=1.5(A₀=0 でも回転勾配は 0 でない)
//       ② 一様速度 V の基準系変更: A′ = A − W V・(∇A)′ = ∇A − V⊗∇W・∂ₜW′ = ∂ₜW + ∇W·V・∂ₜA′ = ∂ₜA + (∇A)·V − V ∂ₜW′(W・∇W は不変)
//       ③ 無限一様 3D の発散: 一様密度 ρ の球(半径 R・中心で評価)は W₀ = 4πρ(R − ε·atan(R/ε)) → R に比例して発散する
//          (格子の和で R を倍々にして実測)。**有限領域か宇宙論的カーネルの宣言が要る**。
//       補: D₀(Σ m/r —— 1/r 側)と W₀(Σ m/r² —— 1/r² 側)は同じ D₀ で違う W₀ を持つ台帳がある → **D₀ から W₀ を換算しない**。
//           u_bg = A₀/W₀ は W₀ = 0 で**未定義**(0 にしない —— `uBg` は null を返す)。
//           一様・凍結・静止の背景の A₀ = ∇ = ∂ₜ = 0 は**宣言**であって算出ではない(有限の一様球でも中心を外すと ∇W₀ ≠ 0)。
//   (C) 4 区分の表(算出できる / 宣言が要る / 未確定 / 未接続)。
//   (D) 接続の実測: 💮 clusterAnalogyBH・🌚 galaxyAnalogyBH(share 経路)で physics.backgroundComplex を「未宣言 / background:"zero" /
//       大きな値」にして N 步 → 状態(x,y,vx,vy,spin)が**ビット一致**(= 力学が読まない = 未接続)。
//       `physics.meshVelocity`(field:"backgroundComplex")を宣言した 🔁 mercuryGeoToy3・charonGeoToy3 では A₀ を変えると状態が**変わる**(= 適用中)。
//       内蔵の宣言の棚卸し(backgroundComplex を宣言した本・meshVelocity の field)。
//
// ■ しないこと・言わないこと
//   ・html の力学に触らない(写しは器の中だけ)。W₀・A₀ を力学へ接続する法則版は作らない(決断事項候補)。
//   ・D₀ から W₀ を換算しない。W₀ = 0 の u_bg を 0 と書かない。「観測一致を達成した」「較正を完了した」「新発見」と書かない。
//
// 実行(Node だけ・Chromium 不要・数秒): node tests/exp-w284e-bgfield.mjs
// 読む正本: なし(html だけ)。正本: tests/out/bgfield-w284e.json(target=beta/index.html・領域 hash REGEN_SCOPE)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
// 第281便a(AN16・R71): **この器が読む html の領域**の宣言(1 行の JSON —— lint.regenScope が読む)
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
const REGEN_SCOPE = {"presets":"all","roots":["$","DT","HP.allPresets","HP.dfmComplexMomentsOf","HP.dfmMeshVelocityFieldAt","HP.sim","HP.validateBackgroundComplex","HP.validatePreset","cw","dfmComplexMomentsOf","isNum","validateBackgroundComplex"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w284e-bgfield-1';
export const DT = 0.016;
export const REL_TOL = 1e-12;
/** 接続の実測の步数(share 経路は重いので 💮🌚 を短く —— 步数は記録する)。 */
export const WIRE_STEPS = { share: 120, mesh: 2000 };
/** share 経路の 2 本と、meshVelocity(field:"backgroundComplex")を宣言した 2 本。 */
export const SHARE_IDS = ['clusterAnalogyBH', 'galaxyAnalogyBH'];
export const MESH_IDS = ['mercuryGeoToy3', 'charonGeoToy3'];
export const EMOJI = { clusterAnalogyBH: '💮', galaxyAnalogyBH: '🌚', mercuryGeoToy3: '🔁', charonGeoToy3: '🌒' };
/** 4 区分の語(表・PHYSICS・QA の照合で同じ文字列)。 */
export const CATS = Object.freeze({ computable: '算出できる', declare: '宣言が要る', undetermined: '未確定', unwired: '未接続', applied: '適用中' });

/** p=2 の複素モーメント(器の中の独立な実装 —— 式は冒頭 (A))。台帳の欄 ax/ay が未宣言なら ∂ₜA₀ は null(未確定)。 */
export function momentsP2(list, px, py, eps2) {
  let W = 0, gWx = 0, gWy = 0, dW = 0, Ax = 0, Ay = 0, g0 = 0, g1 = 0, g2 = 0, g3 = 0, Tx = 0, Ty = 0, accKnown = true;
  for (const b of list) {
    const rx = px - b.x, ry = py - b.y, s = rx * rx + ry * ry + eps2;
    if (!(s > 0)) return null;                         // 源の上(ε=0)は未定義
    const w = b.m / s, k = -2 * b.m / (s * s), gx = k * rx, gy = k * ry;
    const vx = b.vx || 0, vy = b.vy || 0, dw = -(gx * vx + gy * vy);
    W += w; gWx += gx; gWy += gy; dW += dw; Ax += w * vx; Ay += w * vy;
    g0 += vx * gx; g1 += vx * gy; g2 += vy * gx; g3 += vy * gy;
    if (b.ax === undefined || b.ay === undefined) accKnown = false;
    Tx += dw * vx + w * (b.ax || 0); Ty += dw * vy + w * (b.ay || 0);
  }
  return { W, A: [Ax, Ay], gradW: [gWx, gWy], gradA: [g0, g1, g2, g3], dWdt: dW, dAdt: accKnown ? [Tx, Ty] : null, n: list.length };
}
/** u_bg = A₀/W₀(W₀ = 0 では**未定義** —— null を返す。0 にしない)。 */
export function uBg(W, A) { return (W > 0 && Array.isArray(A)) ? [A[0] / W, A[1] / W] : null; }
/** D₀ 側(Σ m/√(r²+ε²) —— 1/r)。W₀ 側と別の量であることを示すためだけに使う。 */
export function d0Of(list, px, py, eps2) { let D = 0; for (const b of list) { const rx = px - b.x, ry = py - b.y; D += b.m / Math.sqrt(rx * rx + ry * ry + eps2); } return D; }

const rel = (a, b) => (a === b) ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300);
const flat = (M) => [M.W].concat(M.A, M.gradW, M.gradA, [M.dWdt], M.dAdt || []);

/** 検算 ① 2 源(±2・速度 ±3ŷ・ε=0)。 */
export const TWO_SOURCE = { list: [{ m: 1, x: 2, y: 0, vx: 0, vy: 3, ax: 0, ay: 0 }, { m: 1, x: -2, y: 0, vx: 0, vy: -3, ax: 0, ay: 0 }], at: [0, 0], eps2: 0,
  want: { W: 0.5, A: [0, 0], gradW: [0, 0], gradA: [0, 0, 1.5, 0], dWdt: 0, dAdt: [0, 0] } };
/** 検算 ② の台帳(決定的な 3 源 —— 位置・速度・加速度つき)と基準系の速度 V。 */
export const FRAME_LEDGER = { list: [
  { m: 2.0, x: 5.0, y: 1.0, vx: 0.3, vy: -1.2, ax: 0.01, ay: -0.02 },
  { m: 0.7, x: -3.0, y: 4.0, vx: -0.8, vy: 0.5, ax: -0.03, ay: 0.004 },
  { m: 1.3, x: 1.5, y: -6.0, vx: 1.1, vy: 0.9, ax: 0.002, ay: 0.015 }], at: [0.4, -0.3], eps2: 0.25, V: [0.7, -0.4] };
/** 検算 ③ 一様 3D の格子(間隔 h・密度 ρ・軟化 ε)と半径の列。 */
export const UNIFORM3D = { rho: 1, h: 1, eps: 0.5, radii: [4, 8, 16, 32] };
/** 補 D₀ ≠ W₀ の対(同じ D₀ = 1・違う W₀)。 */
export const D0_PAIR = [{ list: [{ m: 1, x: 1, y: 0 }], at: [0, 0] }, { list: [{ m: 2, x: 2, y: 0 }], at: [0, 0] }];

/** ③ 一様球(3D)の中心の W₀: 格子の和と閉じた式 4πρ(R − ε·atan(R/ε))。オフセット点の ∇W₀ も(一様でも中心を外すと 0 でない)。 */
export function uniform3d(cfg) {
  const { rho, h, eps, radii } = cfg, e2 = eps * eps, m = rho * h * h * h;
  return radii.map((R) => {
    const K = Math.floor(R / h);
    let W = 0, Woff = 0, gOffX = 0, n = 0;
    const off = R / 2;
    for (let i = -K; i <= K; i++) for (let j = -K; j <= K; j++) for (let k = -K; k <= K; k++) {
      const x = i * h, y = j * h, z = k * h;
      if (x * x + y * y + z * z > R * R) continue;
      n++;
      const s = x * x + y * y + z * z + e2; W += m / s;
      const dx = off - x, so = dx * dx + y * y + z * z + e2; Woff += m / so; gOffX += -2 * m * dx / (so * so);
    }
    return { R, n, W, Wclosed: 4 * Math.PI * rho * (R - eps * Math.atan(R / eps)), WoverR: W / R, offset: off, gradWxOffset: gOffX };
  });
}

/** (C) 4 区分の表 —— 量 × 状況。**算出できる**は台帳(明示天体と重複しない j)があるときだけ。 */
export function categoryTable() {
  const Q = [
    { key: 'W0', sym: 'W₀', unit: 'M/L²', formula: 'Σ m_j/s_j', needs: 'm_j・X_j・ε' },
    { key: 'A0', sym: 'A₀', unit: 'M/(L·T)', formula: 'Σ w_j V_j', needs: 'm_j・X_j・V_j・ε' },
    { key: 'gradW', sym: '∇W₀', unit: 'M/L³', formula: 'Σ −2m_j r_j/s_j²', needs: 'm_j・X_j・ε' },
    { key: 'gradA', sym: '∇A₀', unit: 'M/(L²·T)', formula: 'Σ V_ja ∂_b w_j', needs: 'm_j・X_j・V_j・ε' },
    { key: 'dWdt', sym: '∂ₜW₀', unit: 'M/(L²·T)', formula: 'Σ −∇w_j·V_j', needs: 'm_j・X_j・V_j・ε' },
    { key: 'dAdt', sym: '∂ₜA₀', unit: 'M/(L·T²)', formula: 'Σ[(∂ₜw_j)V_j + w_j a_j]', needs: 'm_j・X_j・V_j・a_j・ε' },
    { key: 'uBg', sym: 'u_bg', unit: 'L/T', formula: 'A₀/W₀(W₀ > 0 のときだけ)', needs: 'W₀ > 0' },
  ];
  return Q.map((q) => ({ ...q,
    ledger: CATS.computable + (q.key === 'dAdt' ? '(a_j が台帳に無ければ未確定)' : q.key === 'uBg' ? '(W₀ = 0 では未定義)' : ''),
    uniformStatic: q.key === 'W0' ? CATS.declare + '(有限領域か宇宙論的カーネル —— 無限一様 3D は発散)'
      : q.key === 'uBg' ? CATS.declare + '(A₀ = 0 の宣言から 0 —— W₀ の宣言が要る)' : CATS.declare + '(一様・凍結・静止なら 0 と宣言 —— 算出ではない)',
    fromD0: CATS.undetermined + '(D₀ から換算しない)',
    none: CATS.undetermined + '(null —— 0 ではない)' }));
}

const J = (x) => JSON.parse(JSON.stringify(x));
const LARGE_BGC = { background: 'declared', note: '第284便e の接続の実測(大きな値 —— 力学が読むかを見るだけ)', W0: 1000, A0: [50, -80], gradW: [1, 2], gradA: [0.1, 0.2, 0.3, 0.4], dWdt: 0.5, dAdt: [1, 2] };
const ZERO_BGC = { background: 'zero', W0: 0, A0: [0, 0], gradW: [0, 0], gradA: [0, 0, 0, 0], dWdt: 0, dAdt: [0, 0] };
function runState(HP, p, steps) {
  const v = HP.validatePreset(J(p)); if (!v.ok) return { err: v.errors };
  HP.sim.build(v.preset); const S = HP.sim;
  for (let k = 0; k < steps; k++) S.step(DT);
  const st = []; for (let i = 0; i < S.n; i++) st.push(S.x[i], S.y[i], S.vx[i], S.vy[i], S.spin[i]);
  return { st, nan: S.hasNaN(), n: S.n, hasMeshVelocity: S.hasMeshVelocity === true, meshField: (S.params.meshVelocity || {}).field || null };
}
const bitSame = (a, b) => a.length === b.length && a.every((v, i) => Object.is(v, b[i]));
const maxAbsDiff = (a, b) => a.reduce((m, v, i) => Math.max(m, Math.abs(v - b[i])), 0);

/** (D) 接続の実測。 */
export function wireChecks(HP) {
  const rows = [];
  for (const id of SHARE_IDS) {
    const P = HP.allPresets().find((q) => q.id === id);
    const base = runState(HP, P, WIRE_STEPS.share);
    const z = J(P); z.physics.backgroundComplex = J(ZERO_BGC);
    const L = J(P); L.physics.backgroundComplex = J(LARGE_BGC);
    const rz = runState(HP, z, WIRE_STEPS.share), rl = runState(HP, L, WIRE_STEPS.share);
    rows.push({ id, emoji: EMOJI[id], path: 'share', steps: WIRE_STEPS.share, n: base.n, meshField: rl.meshField, hasMeshVelocity: rl.hasMeshVelocity,
      accepted: !rz.err && !rl.err, err: rz.err || rl.err || null,
      zeroBitSame: !rz.err && bitSame(base.st, rz.st), largeBitSame: !rl.err && bitSame(base.st, rl.st), nan: base.nan || !!rl.nan,
      state: (!rz.err && !rl.err && bitSame(base.st, rz.st) && bitSame(base.st, rl.st)) ? CATS.unwired : CATS.applied });
  }
  for (const id of MESH_IDS) {
    const P = HP.allPresets().find((q) => q.id === id);
    const bgc = P.physics.backgroundComplex;
    const base = runState(HP, P, WIRE_STEPS.mesh);
    // A₀ だけを動かす(W₀・∇・∂ₜ は宣言のまま —— 受理器を通る形)。0 と 10 倍
    const z = J(P), L = J(P);
    if (bgc.bgModel === 'sources') {
      // 第287便c(R109): 🌒 は背景を源の台帳(bgModel "sources" —— 時間の契約 "sources")で宣言する。A₀=Σw V は台帳から出る値で
      // 手入力の A₀ を変えると受理器が「型の値と違う」で拒否するので、台帳の速度を 0 倍・10 倍にして A₀ を 0・10 倍にする
      // (V に比例する ∇A・∂ₜW・∂ₜA の V の項も一緒に動く —— 手入力の成分は外して台帳から出させる)
      for (const Q of [z, L]) for (const k of ['A0', 'gradA', 'dWdt', 'dAdt']) delete Q.physics.backgroundComplex[k];
      for (const s of z.physics.backgroundComplex.ledger) { s.vx = 0; s.vy = 0; }
      for (const s of L.physics.backgroundComplex.ledger) { s.vx *= 10; s.vy *= 10; }
    } else {
      z.physics.backgroundComplex.A0 = [0, 0];
      L.physics.backgroundComplex.A0 = bgc.A0.map((v) => 10 * v);
    }
    const rz = runState(HP, z, WIRE_STEPS.mesh), rl = runState(HP, L, WIRE_STEPS.mesh);
    rows.push({ id, emoji: EMOJI[id], path: 'meshVelocity', steps: WIRE_STEPS.mesh, n: base.n, meshField: base.meshField, hasMeshVelocity: base.hasMeshVelocity,
      accepted: !rz.err && !rl.err, err: rz.err || rl.err || null, a0: bgc.A0,
      zeroBitSame: !rz.err && bitSame(base.st, rz.st), largeBitSame: !rl.err && bitSame(base.st, rl.st), nan: base.nan || !!rl.nan,
      maxAbsDiffZero: rz.err ? null : maxAbsDiff(base.st, rz.st), maxAbsDiffLarge: rl.err ? null : maxAbsDiff(base.st, rl.st),
      state: (!rz.err && !rl.err && !bitSame(base.st, rz.st) && !bitSame(base.st, rl.st)) ? CATS.applied : CATS.unwired });
  }
  return rows;
}
/** 内蔵の宣言の棚卸し。 */
export function inventory(HP) {
  const out = [];
  for (const p of HP.allPresets()) {
    const ph = p.physics || {}, bgc = ph.backgroundComplex, mv = ph.meshVelocity;
    if (bgc === undefined && !mv) continue;
    out.push({ id: p.id, emoji: p.emoji || null, background: bgc ? bgc.background : null, sources: bgc && Array.isArray(bgc.sources) ? bgc.sources.map((s) => s.id) : null,
      meshField: mv ? mv.field : null, reads: !!(mv && mv.field === 'backgroundComplex') });
  }
  return { nPresets: HP.allPresets().length, rows: out };
}

/** (A)(B) 検算。 */
export function checks(HP) {
  const C = {};
  const t = TWO_SOURCE, m1 = momentsP2(t.list, t.at[0], t.at[1], t.eps2), h1 = HP.dfmComplexMomentsOf(t.list, t.at[0], t.at[1], t.eps2);
  const w = t.want, wf = [w.W].concat(w.A, w.gradW, w.gradA, [w.dWdt], w.dAdt);
  C.twoSource = { mine: m1, html: h1, want: w, ok: flat(m1).every((v, i) => Math.abs(v - wf[i]) <= 1e-15) && flat(h1).every((v, i) => Object.is(v, flat(m1)[i]) || rel(v, flat(m1)[i]) <= REL_TOL),
    uBg: uBg(m1.W, m1.A), note: 'A₀ = 0 でも ∂A_y/∂x = 1.5(反対向きに動く 2 源は分子で相殺するが回転勾配は残る)' };
  const F = FRAME_LEDGER, V = F.V;
  const M = momentsP2(F.list, F.at[0], F.at[1], F.eps2);
  const Mh = HP.dfmComplexMomentsOf(F.list, F.at[0], F.at[1], F.eps2);
  const shifted = F.list.map((b) => Object.assign({}, b, { vx: b.vx - V[0], vy: b.vy - V[1] }));
  const Ms = momentsP2(shifted, F.at[0], F.at[1], F.eps2);
  const dWp = M.dWdt + M.gradW[0] * V[0] + M.gradW[1] * V[1];
  const pred = { W: M.W, A: [M.A[0] - M.W * V[0], M.A[1] - M.W * V[1]], gradW: M.gradW.slice(),
    gradA: [M.gradA[0] - V[0] * M.gradW[0], M.gradA[1] - V[0] * M.gradW[1], M.gradA[2] - V[1] * M.gradW[0], M.gradA[3] - V[1] * M.gradW[1]],
    dWdt: dWp, dAdt: [M.dAdt[0] + M.gradA[0] * V[0] + M.gradA[1] * V[1] - V[0] * dWp, M.dAdt[1] + M.gradA[2] * V[0] + M.gradA[3] * V[1] - V[1] * dWp] };
  const fp = flat(pred), fs2 = flat(Ms);
  const worst = fp.reduce((m, v, i) => Math.max(m, Math.abs(v - fs2[i]) / Math.max(Math.abs(v), Math.abs(fs2[i]), 1e-12)), 0);
  const worstHtml = flat(M).reduce((m, v, i) => Math.max(m, rel(v, flat(Mh)[i])), 0);
  const u0 = uBg(M.W, M.A), u1 = uBg(Ms.W, Ms.A);
  C.frameShift = { V, before: M, after: Ms, predicted: pred, worstRel: worst, worstRelHtml: worstHtml, ok: worst <= REL_TOL && worstHtml <= REL_TOL,
    uBefore: u0, uAfter: u1, uShift: [u0[0] - u1[0], u0[1] - u1[1]] };
  const U = uniform3d(UNIFORM3D);
  const ratios = U.slice(1).map((z, i) => z.W / U[i].W);
  C.uniform3d = { cfg: UNIFORM3D, rows: U, ratios, diverges: ratios.every((r) => r > 1.8), offsetGradNonZero: U.every((z) => Math.abs(z.gradWxOffset) > 0),
    note: '一様密度の球の中心で W₀ ≈ 4πρR —— R を倍にすると W₀ もほぼ倍(無限一様 3D では発散)。中心を外した点では ∇W₀ ≠ 0' };
  const d = D0_PAIR.map((q) => ({ D0: d0Of(q.list, q.at[0], q.at[1], 0), W0: momentsP2(q.list, q.at[0], q.at[1], 0).W }));
  C.d0NotW0 = { rows: d, sameD0: d[0].D0 === d[1].D0, differentW0: d[0].W0 !== d[1].W0, note: '同じ D₀ で W₀ が違う台帳がある → D₀ から W₀ を換算する関数は無い' };
  const empty = HP.dfmComplexMomentsOf([], 0, 0, 0);
  C.uUndefined = { emptyW: empty ? empty.W : null, uBg: uBg(0, [0, 0]), ok: uBg(0, [0, 0]) === null && uBg(0, [1, 0]) === null };
  // 受理器: 未宣言 = null(未確定)・zero は宣言・W0=0 に分子は置けない
  const vNull = HP.validateBackgroundComplex(undefined), vZero = HP.validateBackgroundComplex(J(ZERO_BGC)),
    vBad = HP.validateBackgroundComplex({ background: 'declared', note: 'x', W0: 0, A0: [1, 0], gradW: [0, 0], gradA: [0, 0, 0, 0], dWdt: 0, dAdt: [0, 0] });
  C.validator = { undeclared: vNull.ok && vNull.backgroundComplex === null, zeroDeclared: vZero.ok && vZero.backgroundComplex && vZero.backgroundComplex.background === 'zero',
    w0ZeroNumeratorRejected: vBad.ok === false };
  return C;
}

const f6 = (x) => (Number.isFinite(x) ? Number(x.toPrecision(6)).toString() : '—');
/** PHYSICS〔第284便e〕の表の行(QA docs.bgField が PHYSICS にあるかを照合する)。 */
export function docRows(Jb) {
  const out = { cats: [], wire: [], uniform: [] };
  for (const r of Jb.categories) out.cats.push(`| ${r.sym} [${r.unit}] | ${r.formula} | ${r.needs} | ${r.ledger} | ${r.uniformStatic} | ${r.none} |`);
  for (const w of Jb.wire) out.wire.push(`| ${w.emoji} \`${w.id}\` | ${w.path} | ${w.steps} | ${w.zeroBitSame ? 'ビット一致' : '変わる'} | ${w.largeBitSame ? 'ビット一致' : '変わる'} | **${w.state}** |`);
  for (const u of Jb.checks.uniform3d.rows) out.uniform.push(`| ${u.R} | ${u.n} | ${f6(u.W)} | ${f6(u.Wclosed)} | ${f6(u.WoverR)} |`);
  return out;
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const TARGET = process.env.QA_TARGET || 'beta/index.html';
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const t0 = Date.now();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const C = checks(HP);
  console.log(`(B①) 2 源: W₀=${C.twoSource.mine.W}・A₀=[${C.twoSource.mine.A}]・∇W₀=[${C.twoSource.mine.gradW}]・∂A_y/∂x=${C.twoSource.mine.gradA[2]} —— ${C.twoSource.ok}`);
  console.log(`(B②) 基準系変更: 最大相対差 ${C.frameShift.worstRel.toExponential(2)}・html と ${C.frameShift.worstRelHtml.toExponential(2)} —— ${C.frameShift.ok}`);
  console.log(`(B③) 一様 3D: W₀/R ${C.uniform3d.rows.map((z) => z.WoverR.toFixed(3)).join(' / ')}・倍率 ${C.uniform3d.ratios.map((r) => r.toFixed(3)).join(' / ')}`);
  console.log(`(補) D₀ 同じ ${C.d0NotW0.sameD0}・W₀ 違う ${C.d0NotW0.differentW0}・u_bg(W₀=0)=${JSON.stringify(C.uUndefined.uBg)}`);
  const wire = wireChecks(HP);
  for (const w of wire) console.log(`(D) ${w.emoji} ${w.id} [${w.path}] ${w.steps} 步: zero ${w.zeroBitSame}・large ${w.largeBitSame} → ${w.state}${w.err ? ' ERR ' + JSON.stringify(w.err) : ''}`);
  const inv = inventory(HP);
  console.log(`(D) 棚卸し: 内蔵 ${inv.nPresets} 本・backgroundComplex/meshVelocity の宣言 ${inv.rows.length} 本(読む ${inv.rows.filter((z) => z.reads).length})`);
  const CODE = ['tests/exp-w284e-bgfield.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  const meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第284便e', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第74報)④: 「背景複素決定力 W₀・A₀」関連パラメータについて算出可能なものを確認する',
    reading: '統括の検証項目 R91: 受理器と #bgcPanel はあるが、力学が読むのは physics.meshVelocity(field:"backgroundComplex")を宣言した本だけ。p=2 の台帳から W₀・A₀・∇・∂ₜ は算出できる・D₀ から W₀ は換算しない・一様・凍結・静止は宣言・u_bg は W₀=0 で未定義・無限一様 3D は発散',
    kernel: 'p=2(w=m/(r²+ε²) —— HP.dfmComplexMomentsOf と同じ)', dt: DT, wireSteps: WIRE_STEPS,
    engine: 'Node の headless(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま vm で実行)',
    notClaim: ['観測一致を達成した', '較正を完了した', 'D₀ から W₀ を換算した', 'u_bg=0', '新発見'] });
  const out = { meta, cats: CATS, checks: C, categories: categoryTable(), wire, inventory: inv, elapsedS: (Date.now() - t0) / 1000 };
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  const outDir = path.join(ROOT, 'tests', 'out');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'bgfield-w284e.json'), JSON.stringify(out, null, 1) + '\n');
  console.log('→ tests/out/bgfield-w284e.json(' + out.elapsedS.toFixed(1) + ' s)');
}

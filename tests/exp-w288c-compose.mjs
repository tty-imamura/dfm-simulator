// 第288便c(原仮定者の裁定(第78報)⑧・第78報で閉じた AN84/AN85・統括の検証項目 R115)—— **背景と中心の合成**と**回転核の候補**の器。
//
// ■ 何を測るか(Node だけ —— 対象 html の inline script を tests/lib-w280b-emgrid.mjs の loadHtmlMain で読む)
//   (A) 診断コピー 🧩 galaxyAnalogyBHCompose(🌚 の写し + 静止背景 spaceMesh.D0:1.5 の明示 + 宣言 bgCompose)が 🌚 と 300 步でビット同一
//       (旧 W_bg=D₀ と同じ数を明示しただけ —— WbgFrom のラベルだけが "declared")。
//   (B) 共通評価器(tests/lib-w288c-compose.mjs)を 🧩 の初期状態の全自由粒子で評価:
//       ① 中心の計上回数 = 1(台帳が参照した body:0 を局所の和から外す)・採らない形(二重計上)は W が w_c だけ大きい
//       ② 静止した中心(v_c=0)と静止背景だけ(A_spin なし)なら u=0(ビット)—— 点質量を足しただけでは自転の流れは出ない
//       ③ A_spin を有限サイズの回転源(E6′ の減衰形・中心だけ)として**源の添字の位置で**足す(order "inline")と、エンジンの
//          場の契約 `dfmFieldContract`(🧩 の契約 = `dfmFieldContractOf(S,"toy")`)の u・∇u・∂ₜu・χ とビット一致 /
//          **最後にまとめて**足す(order "separate")と式は同じで和の順だけが違う —— 差は丸めだけ(最大の相対差を記録)
//       ④ 単位: 核 p=1 の W(M/L)と p=2 の W(M/L²)は同じ数ではない —— 背景の宣言の p と核の p が違えば評価器は拒否
//   (C) 回転核の候補(tests/lib-w288c-rotlet.mjs —— 純関数・エンジン未接続): 解析勾配と中心差分(h・h/2・h/4 の次数 2・丸め床を宣言)・
//       面内の J と面内の r では J×r が z を向く(面内の u は 0 —— 試験に固定)・双極子型の配向の力とトルク(中心差分・作用反作用・
//       全角運動量の釣り合い)・β の単位(L/M —— G/c²)・既存の q 付き回転場と**同じ状態で並べる比較器**(足さない —— 置換経路の比較)。
//
// ■ しないこと・言わないこと
//   ・share-p1 の規約(centerSpin・spaceMesh.D0・meshVelocity との併用の拒否)を変えない。complex-p2 を既定にしない(AN85)。
//   ・回転核を既存の場へ足さない(二重計上)。「複素場を接続した」「回転核で腕が出た」「中心の自転が銀河の回転を作った」と書かない。
//
// 実行(Node だけ・Chromium 不要): node tests/exp-w288c-compose.mjs
// 読む正本: なし(html だけ)。正本: tests/out/compose-w288c.json(target=beta/index.html・領域 hash REGEN_SCOPE)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
import * as LC from './lib-w288c-compose.mjs';
import * as LR from './lib-w288c-rotlet.mjs';
const REGEN_SCOPE = {"presets":["galaxyAnalogyBH","galaxyAnalogyBHCompose"],"roots":["$","DT","HP.allPresets","HP.dfmFieldContract","HP.dfmFieldContractOf","HP.dfmMeshVelocityFieldAt","HP.frameWeightPow","HP.sim","HP.validatePreset","cw","dfmFieldContract","sim","validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const HARNESS_VERSION = 'w288c-compose-1';
export const DT = 0.016;
export const COPY_STEPS = 300;
export const COPY_ID = 'galaxyAnalogyBHCompose';
/** 評価する円周の半径(外の点 —— 自己除外なし)。 */
export const RING = Object.freeze([20, 40, 80, 120, 240, 480]);
/** 回転核の単体試験の丸め床: 中心差分の丸め誤差 ≈ FLOOR_ULPS·2⁻⁵²·|u|/h(相対は |∇u| で割る)。この下の段は次数に数えない。 */
export const FLOOR_ULPS = 64;
export const ORDER_WINDOW = [1.8, 2.2];
const EPSM = Math.pow(2, -52);
const clone = (x) => JSON.parse(JSON.stringify(x));
const find = (HP, id) => HP.allPresets().find((q) => q.id === id);
function build(HP, p) {
  const v = HP.validatePreset(clone(p));
  if (!v.ok) return { ok: false, err: String(JSON.stringify(v.errors)).slice(0, 300) };
  HP.sim.build(v.preset);
  return { ok: true, S: HP.sim, preset: v.preset };
}
function stateArr(S) { const a = [S.n, S.t]; for (let i = 0; i < S.n; i++) a.push(S.x[i], S.y[i], S.vx[i], S.vy[i], S.spin[i]); return a; }

/** (A) 🧩 と 🌚 のビット同一。 */
export function copyEquiv(HP) {
  const run = (id) => { const b = build(HP, find(HP, id)); if (!b.ok) return { ok: false, err: b.err }; const S = b.S;
    for (let k = 0; k < COPY_STEPS; k++) S.step(DT); return { ok: true, st: stateArr(S), stop: S.geoToyStop || null }; };
  const a = run('galaxyAnalogyBH'), c = run(COPY_ID);
  const same = a.ok && c.ok && a.st.length === c.st.length && a.st.every((v, i) => Object.is(v, c.st[i]));
  const bc = build(HP, find(HP, COPY_ID)), ctr = HP.dfmFieldContractOf(bc.S, 'toy'), decl = bc.preset.bgCompose;
  const b0 = build(HP, find(HP, 'galaxyAnalogyBH')), ctr0 = HP.dfmFieldContractOf(b0.S, 'toy');
  return { steps: COPY_STEPS, dt: DT, bitSame: same, stop: [a.stop, c.stop], WbgCopy: ctr.contract.Wbg, WbgFromCopy: ctr.contract.WbgFrom,
    WbgBase: ctr0.contract.Wbg, WbgFromBase: ctr0.contract.WbgFrom, declaration: decl, ok: same && ctr.contract.Wbg === ctr0.contract.Wbg && ctr.contract.WbgFrom === 'declared' };
}
/** 🧩 の初期状態から、エンジンの場の契約と同じ源の並び(BD —— dfmGeoToySpinStep と同じ欄・加速度 0)を作る。 */
function bodiesOf(S) {
  const B = [];
  for (let i = 0; i < S.n; i++) B.push({ id: i, m: S.m[i], x: S.x[i], y: S.y[i], vx: S.vx[i], vy: S.vy[i], ax: 0, ay: 0, spin: S.spin[i], R: S.R[i], omegaDot: 0, pinned: S.pinned[i] === 1 });
  return B;
}
const flatF = (f) => [f.u[0], f.u[1]].concat(f.gradU, f.dUdt, [f.chi]);
/** (B) 共通評価器の試験。 */
export function composeChecks(HP) {
  const b = build(HP, find(HP, COPY_ID));
  if (!b.ok) return { ok: false, err: b.err };
  const S = b.S, B = bodiesOf(S), decl = b.preset.bgCompose;
  const k0 = +decl.center.ref.replace('body:', ''), ctr = HP.dfmFieldContractOf(S, 'toy').contract, p = ctr.p, eps = ctr.eps;
  const bg = { p: decl.background.p, W: decl.background.W, A: decl.background.A.slice() };
  const base = { bodies: B, p, eps, background: bg, ledger: [{ ref: decl.center.ref }], spin: { mode: 'e6', q: ctr.q, centers: [k0] } };
  let nEval = 0, onceAll = true, dblDiffMax = 0, inlineSame = 0, sepSame = 0, sepRelMax = 0, contractNull = 0;
  for (let i = 0; i < S.n; i++) {
    if (B[i].pinned) continue;
    const once = LC.composeAt(Object.assign({}, base, { self: i, px: B[i].x, py: B[i].y, order: 'inline' }));
    const dbl = LC.composeAt(Object.assign({}, base, { self: i, px: B[i].x, py: B[i].y, order: 'inline', double: true }));
    const sep = LC.composeAt(Object.assign({}, base, { self: i, px: B[i].x, py: B[i].y, order: 'separate' }));
    const f = HP.dfmFieldContract(B, B[i].x, B[i].y, Object.assign({}, ctr, { excludeBodyId: i }));
    if (!f) { contractNull++; continue; }
    nEval++;
    if (!(once.ok && once.counts.perBody[k0] === 1 && dbl.counts.perBody[k0] === 2)) onceAll = false;
    const dx = B[i].x - B[k0].x, dy = B[i].y - B[k0].y, wc = B[k0].m * Math.pow(dx * dx + dy * dy + eps * eps, -p / 2);
    dblDiffMax = Math.max(dblDiffMax, Math.abs((dbl.W - once.W) - wc) / once.W);
    const a = flatF(once), c = flatF(f), s = flatF(sep);
    if (a.every((v, q) => Object.is(v, c[q]))) inlineSame++;
    if (s.every((v, q) => Object.is(v, c[q]))) sepSame++;
    for (let q = 0; q < s.length; q++) { const sc = Math.max(Math.abs(c[q]), q < 2 ? Math.hypot(c[0], c[1]) : q < 6 ? Math.max(...c.slice(2, 6).map(Math.abs)) : q < 8 ? Math.hypot(c[6], c[7]) : 1, 1e-300);
      sepRelMax = Math.max(sepRelMax, Math.abs(s[q] - c[q]) / sc); }
  }
  // ② 静止した中心と静止背景だけ(A_spin なし / あり)の円周の点
  const only = [B[k0]];
  const ring = RING.map((r) => {
    const o = { bodies: only, p, eps, background: bg, ledger: [{ ref: 'body:0' }], self: -1, px: B[k0].x + r, py: B[k0].y };
    const none = LC.composeAt(Object.assign({}, o, { spin: { mode: 'none' } })), e6 = LC.composeAt(Object.assign({}, o, { spin: { mode: 'e6', q: ctr.q, centers: [0] } }));
    return { r, uNone: none.u, uNoneZero: none.u[0] === 0 && none.u[1] === 0, uPhiE6: e6.u[1], W: none.W };   // 点は中心の +x 側 —— u_φ = u_y
  });
  // ④ 単位(p=1 と p=2 の W は同じ数ではない・宣言の p が違えば拒否)
  const at = { bodies: B, eps, ledger: [{ ref: decl.center.ref }], self: -1, px: B[k0].x + 100, py: B[k0].y, spin: { mode: 'none' } };
  const w1 = LC.composeAt(Object.assign({}, at, { p: 1, background: { p: 1, W: 0, A: [0, 0] } })), w2 = LC.composeAt(Object.assign({}, at, { p: 2, background: { p: 2, W: 0, A: [0, 0] } }));
  const mis = LC.composeAt(Object.assign({}, at, { p: 1, background: { p: 2, W: bg.W, A: [0, 0] } }));
  const units = { W_p1: w1.W, units_p1: w1.units, W_p2: w2.W, units_p2: w2.units, ratio: w1.W / w2.W, mismatchRejected: mis.ok === false && mis.why === 'units' };
  const out = { version: LC.COMPOSE_VERSION, p, eps, Wbg: bg.W, q: ctr.q, center: decl.center.ref, nEval, contractNull,
    centerOnce: { all: onceAll, doubleExcessRelMax: dblDiffMax },
    inline: { bitSame: inlineSame, of: nEval }, separate: { bitSame: sepSame, of: nEval, relMax: sepRelMax },
    ring, units };
  out.ok = onceAll && nEval > 0 && contractNull === 0 && inlineSame === nEval && dblDiffMax <= 1e-12 && sepRelMax <= 1e-12
    && ring.every((z) => z.uNoneZero && z.uPhiE6 !== 0) && units.mismatchRejected && units.W_p1 !== units.W_p2;
  return out;
}

/** (C) 回転核の単体試験と比較器。 */
export const ROT_CASES = Object.freeze([
  Object.freeze({ key: 'jzInPlane', label: 'J=ẑ Jz・r 面内', J: [0, 0, 1.3], r: [3.1, -1.7, 0], eps: 0.4 }),
  Object.freeze({ key: 'tilted', label: 'J 傾き 60°・r 立体', J: [0.9, -0.4, 0.65], r: [1.2, 2.3, -0.8], eps: 0.3 }),
  Object.freeze({ key: 'jInPlane', label: 'J 面内(90° 倒れ)・r 面内', J: [1.1, 0.5, 0], r: [2.2, -0.9, 0], eps: 0.2 })]);
export function rotletChecks(HP) {
  const beta = 1, H = 0.08;
  const grads = ROT_CASES.map((c) => {
    const G = LR.rotletGrad(c.J, c.r, beta, c.eps), u = LR.rotletU(c.J, c.r, beta, c.eps), un = Math.hypot(...u);
    let gmax = 0; for (const row of G) for (const v of row) gmax = Math.max(gmax, Math.abs(v));
    const steps = [1, 2, 4].map((k) => { const h = H / k, err = LR.maxRel(LR.rotletGradFD(c.J, c.r, beta, c.eps, h), G);
      const floor = FLOOR_ULPS * EPSM * un / (h * Math.max(gmax, 1e-300)); return { h, err, floor, belowFloor: err <= floor }; });
    const order = [0, 1].map((q) => (!steps[q + 1].belowFloor && steps[q + 1].err > 0) ? Math.log2(steps[q].err / steps[q + 1].err) : null);
    const inPlane = c.J[2] === 0 && c.r[2] === 0;
    return { key: c.key, label: c.label, u, steps, order, inPlaneJandR: inPlane,
      uInPlaneZero: inPlane ? (u[0] === 0 && u[1] === 0) : null, uzOnly: inPlane ? u[2] !== 0 : null,
      ok: order.every((o, q) => o === null || steps[q + 1].belowFloor || (o >= ORDER_WINDOW[0] && o <= ORDER_WINDOW[1])) && (!inPlane || (u[0] === 0 && u[1] === 0 && u[2] !== 0)) };
  });
  // 双極子型の配向: 力とトルクの閉じた式を中心差分と照合・作用反作用・全角運動量の釣り合い τ_i+τ_j+r×F_i=0
  const Ji = [0.3, -0.8, 1.1], Jj = [-0.5, 0.2, 0.9], r = [2.1, -1.4, 0.7], kappa = 0.7, e = 0.25;
  const ft = LR.dipoleForceTorque(Ji, Jj, r, kappa, e);
  const dSteps = [1, 2, 4].map((k) => { const h = 1e-3 / k; const Ff = LR.dipoleForceFD(Ji, Jj, r, kappa, e, h), Tf = LR.dipoleTorqueFD(Ji, Jj, r, kappa, e, h);
    return { h, forceErr: LR.maxRel([Ff], [ft.Fi]), torqueErr: LR.maxRel([Tf], [ft.tauI]) }; });
  const rxF = LR.cross(r, ft.Fi), bal = [0, 1, 2].map((k) => ft.tauI[k] + ft.tauJ[k] + rxF[k]);
  const scale = Math.max(...ft.tauI.map(Math.abs), ...ft.tauJ.map(Math.abs), ...rxF.map(Math.abs));
  const ordOf = (key) => [0, 1].map((q) => Math.log2(dSteps[q][key] / dSteps[q + 1][key]));
  const dOrder = { force: ordOf('forceErr'), torque: ordOf('torqueErr') };
  const inWin = (o) => o >= ORDER_WINDOW[0] && o <= ORDER_WINDOW[1];
  const dipole = { U: ft.U, Fi: ft.Fi, tauI: ft.tauI, tauJ: ft.tauJ, steps: dSteps, order: dOrder,
    newton3: ft.Fi.every((v, k) => v === -ft.Fj[k]), angMomBalanceRel: Math.max(...bal.map(Math.abs)) / scale,
    ok: dOrder.force.every(inWin) && dOrder.torque.every(inWin) && dSteps[2].forceErr < 1e-6 && dSteps[2].torqueErr < 1e-6
      && ft.Fi.every((v, k) => v === -ft.Fj[k]) && Math.max(...bal.map(Math.abs)) / scale < 1e-12 };
  // 比較器(置換経路 —— 足さない): 🧩 の中心の J=I Ω ẑ(I=½ m R²)と β=G/c² の rotlet の u_φ と、場の契約の自転の寄与 uSpin を同じ円周の点で並べる
  const b = build(HP, find(HP, COPY_ID)), S = b.S, B = bodiesOf(S), ctr = HP.dfmFieldContractOf(S, 'toy').contract;
  const P = S.params, c0 = B[0], I = 0.5 * c0.m * c0.R * c0.R, Jz = I * c0.spin, betaG = LR.betaOf(P.G, P.cLight);
  const comp = RING.map((rr) => {
    const f = HP.dfmFieldContract(B, c0.x + rr, c0.y, Object.assign({}, ctr, { excludeBodyId: null }));
    const ur = LR.rotletU([0, 0, Jz], [rr, 0, 0], betaG, P.softening);
    return { r: rr, uSpinContract: f ? f.uSpin[1] : null, uRotlet: ur[1], ratio: (f && f.uSpin[1] !== 0) ? ur[1] / f.uSpin[1] : null };
  });
  return { version: LR.ROTLET_VERSION, grads, dipole,
    beta: { G: P.G, c: P.cLight, betaG, unit: 'L/M(J が M L² T⁻¹ なら u が L T⁻¹)' },
    comparator: { J: Jz, I, how: 'J=½ m R² Ω ẑ(中心の本体半径 R・自転 Ω)・β=G/c²・点は中心の +x 側(u_φ=u_y)—— 足さない(置換経路の比較だけ)', rows: comp },
    ok: grads.every((g) => g.ok) && dipole.ok };
}

export function computeAll(HP) { return { copy: copyEquiv(HP), compose: composeChecks(HP), rotlet: rotletChecks(HP) }; }
const f3 = (x) => (x === null || x === undefined) ? '—' : (x === 0 ? '0' : Number(x).toExponential(2));
const f2 = (x) => (x === null || x === undefined) ? '—' : Number(x).toFixed(2);
/** PHYSICS〔第288便c〕の表の行(QA docs が照合する)。 */
export function docRows(J) {
  const out = { ring: [], rot: [] };
  for (const z of J.compose.ring) out.ring.push(`| ${z.r} | ${z.uNoneZero ? '0(ビット)' : f3(Math.hypot(z.uNone[0], z.uNone[1]))} | ${f3(z.uPhiE6)} |`);
  for (const g of J.rotlet.grads) out.rot.push(`| ${g.label} | ${g.steps.map((s) => f3(s.err)).join(' / ')} | ${g.order.map(f2).join(' / ')} | ${g.inPlaneJandR ? (g.uInPlaneZero ? '面内 0・z だけ' : '面内に残る') : '—'} |`);
  return out;
}

const IS_MAIN = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_MAIN) {
  const TARGET = process.env.QA_TARGET || 'beta/index.html';
  const OUT_PATH = process.env.W288C_OUT || path.join(ROOT, 'tests', 'out', 'compose-w288c.json');
  const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
  const { loadHtmlMain } = await import('./lib-w280b-emgrid.mjs');
  const t0 = Date.now();
  const { HP, errors } = loadHtmlMain(path.join(ROOT, TARGET));
  const R = computeAll(HP);
  console.log(`(A) 🧩 と 🌚 の ${R.copy.steps} 步: ビット同一 ${R.copy.bitSame}・W_bg ${R.copy.WbgCopy}(${R.copy.WbgFromCopy})/${R.copy.WbgBase}(${R.copy.WbgFromBase})`);
  const C = R.compose;
  console.log(`(B) 評価点 ${C.nEval}: 中心 1 回 ${C.centerOnce.all}(二重計上の超過 − w_c の相対 ${f3(C.centerOnce.doubleExcessRelMax)})・inline ビット一致 ${C.inline.bitSame}/${C.inline.of}・separate ${C.separate.bitSame}/${C.separate.of}(相対差 ≤ ${f3(C.separate.relMax)})`);
  console.log(`(B) 円周 ${JSON.stringify(C.ring.map((z) => [z.r, z.uNoneZero, z.uPhiE6]))}・単位 ${JSON.stringify(C.units)}・ok ${C.ok}`);
  for (const g of R.rotlet.grads) console.log(`(C) ${g.key}: err ${g.steps.map((s) => s.err.toExponential(2)).join('/')} 次数 ${g.order.map(f2).join('/')} 面内 ${g.uInPlaneZero} ok ${g.ok}`);
  console.log(`(C) 双極子 ${JSON.stringify({ order: R.rotlet.dipole.order, err: R.rotlet.dipole.steps[2], n3: R.rotlet.dipole.newton3, bal: R.rotlet.dipole.angMomBalanceRel })} ok ${R.rotlet.dipole.ok}`);
  console.log(`(C) 比較器 ${JSON.stringify(R.rotlet.comparator.rows)}`);
  const CODE = ['tests/exp-w288c-compose.mjs', 'tests/lib-w288c-compose.mjs', 'tests/lib-w288c-rotlet.mjs', 'tests/lib-w280b-emgrid.mjs', 'tests/lib-w272e-provenance.mjs', 'tests/lib-w281a-scope.mjs'];
  const meta = Object.assign(provenanceMeta({ root: ROOT, wave: '第288便c', target: TARGET, code: CODE, inputs: [TARGET] }), {
    harnessVersion: HARNESS_VERSION, loadErrors: errors.length,
    ruling: '原仮定者の裁定(第78報)⑧と第78報で閉じた AN84(背景の台帳に中心を 1 源として足す・中心は 1 回だけ・A_spin は別に構成)/AN85(complex-p2 は既定にしない)・統括の検証項目 R115',
    engine: 'Node の headless(tests/lib-w280b-emgrid.mjs の loadHtmlMain —— html の本文をそのまま実行)',
    notClaim: ['複素場を接続した', '回転核で腕が出た', '中心の自転が銀河の回転を作った', '新発見'] });
  const out = { meta, ...R, elapsedS: (Date.now() - t0) / 1000 };
  out.ok = R.copy.ok && R.compose.ok && R.rotlet.ok;
  Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 1) + '\n');
  console.log('→ ' + path.relative(ROOT, OUT_PATH) + '(' + out.elapsedS.toFixed(1) + ' s)・ok ' + out.ok);
}

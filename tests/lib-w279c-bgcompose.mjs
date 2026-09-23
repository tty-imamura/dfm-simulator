// 第279便c(原仮定者の裁定〔第69報〕・統括の読み R62・R63)— **背景の閾値なし合成と速度分解 RHS の検算**(純関数)。
//
// ■ 何をするか
//   `beta/index.html` の純関数 `dfmComplexMomentsOf`・`dfmBlendComplexMoments`・`dfmMeshVelocityRHS` を
//   **html のソース文字列から取り出して** node で評価し(写しを持たない —— 取り出しはコメント・文字列を潰した
//   写しで波括弧を数える)、次の検算を並べる:
//     (a) 明示源の直接計算 `meshFieldNoD0`(源をすべて明示天体として足す・lib-w275b)と、
//         局所・外部に**分解してから合成**した場の一致(u・∇u・∂ₜu の最大相対差)
//     (b) 一定速度 V の座標変換(ガリレイ): 座標加速度 ẍ と v̇ が変わらないこと(背景は `advected` 規約で移す
//         —— 否定対照として `fieldTime` だけで移したときの崩れも測る)
//     (c) 定常な指定場(静止した局所源 + 定常な線形背景)で H/m=|p|²/2+p·u+Φ が保たれること
//         (RK4 の刻み 2 段の残差と、RHS から組んだ dH/dt の代数残差)
//     (d) 境界: W=0(未定義 —— 慣性は 0 にしない)・欠落・非有限・ゼロ重みに非ゼロ分子・自己項の宣言なし・
//         D₀ を足した入力・速度でない場・時間微分の揃わない場
//     (e) 背景重み 1e−30 でも分子の寄与を保つ(**閾値なしの代数検査** —— 天体の数値例ではない)
//     (f) 一様定常な場では追加の加速度が 0(移送だけ)
//
// ■ しないこと
//   ・html を書き換えない・判定しない(数を並べるだけ —— 合否は QA が出す)。
//   ・「背景を接続した」「慣性を導出した」とは書かない。
import { stripJs } from './lib-w278d-readaudit.mjs';
import { meshFieldNoD0, toComovingFrame } from './lib-w275b-meshfield.mjs';

export const BGCOMPOSE_VERSION = 'w279c-bgcompose-1';
export const PURE_NAMES = ['isNum', 'dfmComplexMomentsOf', 'dfmBlendComplexMoments', 'dfmMeshVelocityRHS'];

/** html の inline script から最上位の `function NAME(` を取り出す(潰した写しで波括弧を数え、原文を切り出す)。 */
export function extractTopFunctions(html, names) {
  const sIdx = html.indexOf('<script');
  const bIdx = html.indexOf('>', sIdx) + 1;
  const eIdx = html.lastIndexOf('</script>');
  const code = html.slice(bIdx, eIdx);
  const st = stripJs(code);
  const out = {};
  for (const nm of names) {
    const re = new RegExp('(^|\\n)function ' + nm + '\\(', 'g');
    const m = re.exec(st);
    if (!m) { out[nm] = null; continue; }
    const a = m.index + (m[1] ? 1 : 0);
    let i = st.indexOf('{', a), depth = 0, end = -1;
    for (; i < st.length; i++) {
      const ch = st[i];
      if (ch === '{') depth++;
      else if (ch === '}') { depth--; if (depth === 0) { end = i + 1; break; } }
    }
    out[nm] = end > 0 ? code.slice(a, end) : null;
  }
  return out;
}

/** 取り出した 4 関数を 1 つのスコープで組み立てる(html と同じ本文・同じ isNum)。 */
export function makePure(html) {
  const src = extractTopFunctions(html, PURE_NAMES);
  for (const k of PURE_NAMES) if (!src[k]) throw new Error('html に ' + k + ' が無い');
  // eslint-disable-next-line no-new-func
  const f = new Function(PURE_NAMES.map((k) => src[k]).join('\n') + '\nreturn {' + PURE_NAMES.join(',') + '};');
  const o = f();
  o.sources = src;
  return o;
}

/* ─────────────────────────────── 乱数(再現可能) ─────────────────────────────── */
export function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const relMax = (x, y) => {
  let d = 0, s = 0;
  for (let i = 0; i < x.length; i++) { d = Math.max(d, Math.abs(x[i] - y[i])); s = Math.max(s, Math.abs(x[i]), Math.abs(y[i])); }
  return s > 0 ? d / s : d;
};

/* ─────────────────────── (a) 直接計算 vs 分解 → 合成 ─────────────────────── */
/**
 * 1 条件: 局所源 L と外部源 E を点 (px,py) で。直接 = meshFieldNoD0(L∪E, norm "self")、
 * 分解 = blend(moments(L)+selfExcluded, moments(E))。
 */
export function decompositionCase(pure, L, E, px, py, eps) {
  const direct = meshFieldNoD0(L.concat(E), px, py, { p: 2, eps, norm: 'self' });
  const mL = L.length ? pure.dfmComplexMomentsOf(L, px, py, eps * eps) : null;
  const mE = E.length ? pure.dfmComplexMomentsOf(E, px, py, eps * eps) : null;
  if (mL) mL.selfExcluded = true;
  const b = pure.dfmBlendComplexMoments(mL, mE);
  if (!direct || !b || !b.ok || !b.defined) return { ok: false, direct: !!direct, blend: b ? (b.err || b.why) : null };
  // ∇u・∂ₜu は 2 項の差 (∇A − u⊗∇W)/W なので、差が項より桁違いに小さい条件では「値に対する相対差」が
  // 打ち消しの丸めを拡大する —— **項の大きさに対する相対差**(gradUTermRel・dUdtTermRel)も併記する
  const W = direct.W, un = Math.hypot(direct.u[0], direct.u[1]);
  const gScale = Math.max(...direct.gradA.map(Math.abs)) / W + un * Math.hypot(direct.gradW[0], direct.gradW[1]) / W;
  const tScale = Math.max(...direct.dAdt.map(Math.abs)) / W + un * Math.abs(direct.dWdt) / W;
  const absMax = (x, y) => Math.max(...x.map((z, i) => Math.abs(z - y[i])));
  return { ok: true, nL: L.length, nE: E.length,
    uRel: relMax(direct.u, b.u), gradURel: relMax(direct.gradU, b.gradU), dUdtRel: relMax(direct.dUdt, b.dUdt),
    gradUTermRel: gScale > 0 ? absMax(direct.gradU, b.gradU) / gScale : 0,
    dUdtTermRel: tScale > 0 ? absMax(direct.dUdt, b.dUdt) / tScale : 0,
    chiDirect: direct.chi, chiLocal: b.chi, WRel: Math.abs(direct.W - b.W) / direct.W,
    uBits: direct.u.every((z, i) => z === b.u[i]) };
}

/** 再現可能な 24 条件以上の生成(局所 1〜3 源・外部 1〜2 源・重みの比を 10⁻⁸〜10⁸ に振る)。 */
export function decompositionSuite(pure, n, seed) {
  const R = rng(seed || 2791);
  const rows = [];
  for (let c = 0; c < n; c++) {
    const nL = 1 + Math.floor(R() * 3), nE = 1 + Math.floor(R() * 2);
    const scale = Math.pow(10, -8 + 16 * R());               // 外部源の質量の倍率(重みの比を振る)
    const far = Math.pow(10, R() * 3);                        // 外部源の距離の倍率
    const src = (m, r) => { const th = 2 * Math.PI * R();
      return { m, x: r * Math.cos(th), y: r * Math.sin(th), vx: 2 * R() - 1, vy: 2 * R() - 1, ax: 0.1 * (2 * R() - 1), ay: 0.1 * (2 * R() - 1) }; };
    const L = [], E = [];
    for (let i = 0; i < nL; i++) L.push(src(0.5 + R(), 1 + 3 * R()));
    for (let i = 0; i < nE; i++) E.push(src((0.5 + R()) * scale, (5 + 20 * R()) * far));
    const eps = R() < 0.5 ? 0 : 0.05 * R();
    const px = 0.3 * (2 * R() - 1), py = 0.3 * (2 * R() - 1);
    rows.push(Object.assign({ case: c, scale, far, eps }, decompositionCase(pure, L, E, px, py, eps)));
  }
  return rows;
}

/* ─────────────────────── (b) 一定速度の座標変換 ─────────────────────── */
/**
 * 局所源 L(動く・加速する)+ 線形背景 bg を点 x で。粒子の慣性速度 v・空間加速度 a は両系で同じ
 * (v=ẋ−u は ẋ と u が同じ V だけずれるので不変)。K′ では源の速度を v_j−V、背景を toComovingFrame で移す。
 * 返すのは ẍ(coordAccel)と v̇ の相対差(`advected` と、否定対照 `fieldTime`)。
 */
export function galileanCase(pure, L, bg, x, v, a, V, eps) {
  const e2 = eps * eps;
  const f0 = pure.dfmBlendComplexMoments(Object.assign(pure.dfmComplexMomentsOf(L, x[0], x[1], e2), { selfExcluded: true }), toBgMoments(bg));
  const Lb = L.map((s) => Object.assign({}, s, { vx: s.vx - V[0], vy: s.vy - V[1] }));
  const out = { V };
  const r0 = pure.dfmMeshVelocityRHS(f0, v, a);
  for (const conv of ['advected', 'fieldTime']) {
    const bgp = toComovingFrame(bg, V, { convention: conv });
    const f1 = pure.dfmBlendComplexMoments(Object.assign(pure.dfmComplexMomentsOf(Lb, x[0], x[1], e2), { selfExcluded: true }), toBgMoments(bgp));
    const r1 = pure.dfmMeshVelocityRHS(f1, v, a);
    out[conv] = { coordAccelRel: relMax(r0.coordAccel, r1.coordAccel), vRateRel: relMax(r0.vRate, r1.vRate),
      uShiftRel: relMax([f0.u[0] - V[0], f0.u[1] - V[1]], f1.u), gradURel: relMax(f0.gradU, f1.gradU) };
  }
  return out;
}
/** lib-w275b の背景({W0,A0,...})を合成関数の形({W,A,...})へ。 */
export function toBgMoments(bg) {
  return { W: bg.W0, A: bg.A0.slice(), gradW: bg.gradW.slice(), gradA: bg.gradA.slice(), dWdt: bg.dWdt, dAdt: bg.dAdt.slice() };
}
export function galileanSuite(pure, n, seed) {
  const R = rng(seed || 2792);
  const rows = [];
  for (let c = 0; c < n; c++) {
    const L = [];
    const nL = 1 + Math.floor(R() * 3);
    for (let i = 0; i < nL; i++) { const th = 2 * Math.PI * R(), r = 1 + 3 * R();
      L.push({ m: 0.5 + R(), x: r * Math.cos(th), y: r * Math.sin(th), vx: 2 * R() - 1, vy: 2 * R() - 1, ax: 0.2 * (2 * R() - 1), ay: 0.2 * (2 * R() - 1) }); }
    const W0 = 0.05 + 0.5 * R();
    const bg = { W0, A0: [W0 * (2 * R() - 1), W0 * (2 * R() - 1)], gradW: [0.01 * (2 * R() - 1), 0.01 * (2 * R() - 1)],
      gradA: [0.01 * (2 * R() - 1), 0.01 * (2 * R() - 1), 0.01 * (2 * R() - 1), 0.01 * (2 * R() - 1)],
      dWdt: 0.001 * (2 * R() - 1), dAdt: [0.01 * (2 * R() - 1), 0.01 * (2 * R() - 1)] };
    const x = [0.2 * (2 * R() - 1), 0.2 * (2 * R() - 1)], v = [2 * R() - 1, 2 * R() - 1], a = [0.1 * (2 * R() - 1), 0.1 * (2 * R() - 1)];
    const V = [3 * (2 * R() - 1), 3 * (2 * R() - 1)];
    rows.push(Object.assign({ case: c }, galileanCase(pure, L, bg, x, v, a, V, R() < 0.5 ? 0 : 0.05)));
  }
  return rows;
}

/* ─────────────────────── (c) 定常な指定場で H が保たれるか ─────────────────────── */
/**
 * 静止した局所源(質量 M・原点・速度 0・加速度 0)+ 定常な線形背景(∂ₜW=∂ₜA=0)。Φ=−GM/√(r²+ε²)。
 * ẋ=v+u・v̇=−∇Φ−Jᵀv を RK4 で積分し、H=|v|²/2+v·u+Φ の相対変化の最大値を返す。
 */
export function hamiltonianRun(pure, cfg) {
  const { GM, eps, bg, x0, v0, T, steps } = cfg;
  const e2 = eps * eps;
  const L = [{ m: cfg.Msrc, x: 0, y: 0, vx: 0, vy: 0, ax: 0, ay: 0 }];
  const field = (x, y) => {
    const mL = pure.dfmComplexMomentsOf(L, x, y, e2); mL.selfExcluded = true;
    const d = [x - bg.xStar[0], y - bg.xStar[1]];
    const B = { W: bg.W0 + bg.gradW[0] * d[0] + bg.gradW[1] * d[1],
      A: [bg.A0[0] + bg.gradA[0] * d[0] + bg.gradA[1] * d[1], bg.A0[1] + bg.gradA[2] * d[0] + bg.gradA[3] * d[1]],
      gradW: bg.gradW.slice(), gradA: bg.gradA.slice(), dWdt: 0, dAdt: [0, 0] };
    return pure.dfmBlendComplexMoments(mL, B);
  };
  const grav = (x, y) => { const q = x * x + y * y + e2, iq = 1 / Math.sqrt(q), iq3 = iq * iq * iq; return [-GM * x * iq3, -GM * y * iq3]; };
  const Phi = (x, y) => -GM / Math.sqrt(x * x + y * y + e2);
  const H = (s) => { const f = field(s[0], s[1]); return 0.5 * (s[2] * s[2] + s[3] * s[3]) + s[2] * f.u[0] + s[3] * f.u[1] + Phi(s[0], s[1]); };
  const der = (s) => { const f = field(s[0], s[1]); const r = pure.dfmMeshVelocityRHS(f, [s[2], s[3]], grav(s[0], s[1]));
    return [r.positionRate[0], r.positionRate[1], r.vRate[0], r.vRate[1]]; };
  // dH/dt の代数残差(RHS から組む: ∇ₓH·ẋ + ∇ₚH·ṗ —— ∇ₓH は中心差分)
  const dHdtResid = (s) => {
    const r = der(s), h = 1e-6 * Math.max(1, Math.hypot(s[0], s[1]));
    const Hx = (H([s[0] + h, s[1], s[2], s[3]]) - H([s[0] - h, s[1], s[2], s[3]])) / (2 * h);
    const Hy = (H([s[0], s[1] + h, s[2], s[3]]) - H([s[0], s[1] - h, s[2], s[3]])) / (2 * h);
    const f = field(s[0], s[1]);
    const Hp = [s[2] + f.u[0], s[3] + f.u[1]];
    const dH = Hx * r[0] + Hy * r[1] + Hp[0] * r[2] + Hp[1] * r[3];
    const scale = Math.abs(Hx * r[0]) + Math.abs(Hy * r[1]) + Math.abs(Hp[0] * r[2]) + Math.abs(Hp[1] * r[3]);
    return scale > 0 ? Math.abs(dH) / scale : 0;
  };
  let s = [x0[0], x0[1], v0[0], v0[1]];
  const H0 = H(s), dt = T / steps;
  let dHmax = 0, residMax = 0, Jasym = 0;
  for (let n = 0; n < steps; n++) {
    const k1 = der(s), s2 = s.map((z, i) => z + 0.5 * dt * k1[i]);
    const k2 = der(s2), s3 = s.map((z, i) => z + 0.5 * dt * k2[i]);
    const k3 = der(s3), s4 = s.map((z, i) => z + dt * k3[i]);
    const k4 = der(s4);
    s = s.map((z, i) => z + dt / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
    if (n % Math.max(1, Math.floor(steps / 200)) === 0) {
      dHmax = Math.max(dHmax, Math.abs(H(s) - H0) / Math.abs(H0));
      residMax = Math.max(residMax, dHdtResid(s));
      const f = field(s[0], s[1]); Jasym = Math.max(Jasym, Math.abs(f.gradU[1] - f.gradU[2]) / Math.max(1e-300, Math.abs(f.gradU[0]) + Math.abs(f.gradU[3])));
    }
  }
  dHmax = Math.max(dHmax, Math.abs(H(s) - H0) / Math.abs(H0));
  return { steps, dt, H0, HT: H(s), dHrelMax: dHmax, dHdtAlgebraResidMax: residMax, JasymmetryMax: Jasym, xT: [s[0], s[1]] };
}

/* ─────────────────────── (d) 境界 ─────────────────────── */
export function boundaryCases(pure) {
  const ok = { W: 1, A: [0.3, 0.1], gradW: [0.01, 0], gradA: [0, 0, 0, 0], dWdt: 0, dAdt: [0, 0] };
  const loc = (o) => Object.assign({ selfExcluded: true }, o);
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const drop = (o, k) => { const z = clone(o); delete z[k]; return z; };
  const C = [];
  const put = (name, want, got) => C.push({ name, want, got: got && got.ok === true ? (got.defined === false ? 'undefined' : 'ok') : 'reject',
    err: got && got.ok === false ? String(got.err).slice(0, 80) : (got && got.why ? String(got.why).slice(0, 60) : null) });
  const zero = { W: 0, A: [0, 0], gradW: [0, 0], gradA: [0, 0, 0, 0], dWdt: 0, dAdt: [0, 0] };
  put('W=0(局所も背景も重み 0)→ 未定義', 'undefined', pure.dfmBlendComplexMoments(loc(clone(zero)), clone(zero)));
  put('背景だけ W=0 → 未定義', 'undefined', pure.dfmBlendComplexMoments(null, clone(zero)));
  for (const k of ['A', 'gradW', 'gradA', 'dWdt', 'dAdt']) put('背景の ' + k + ' 欠落 → 拒否', 'reject', pure.dfmBlendComplexMoments(null, drop(ok, k)));
  for (const k of ['A', 'gradW', 'gradA', 'dWdt', 'dAdt']) put('局所の ' + k + ' 欠落 → 拒否', 'reject', pure.dfmBlendComplexMoments(loc(drop(ok, k)), null));
  put('背景 W 欠落 → 拒否', 'reject', pure.dfmBlendComplexMoments(null, drop(ok, 'W')));
  put('背景 W 負 → 拒否', 'reject', pure.dfmBlendComplexMoments(null, Object.assign(clone(ok), { W: -1 })));
  put('背景 A に NaN → 拒否', 'reject', pure.dfmBlendComplexMoments(null, Object.assign(clone(ok), { A: [NaN, 0] })));
  put('背景 dAdt に Infinity → 拒否', 'reject', pure.dfmBlendComplexMoments(null, Object.assign(clone(ok), { dAdt: [Infinity, 0] })));
  put('背景 gradA の長さ 3 → 拒否', 'reject', pure.dfmBlendComplexMoments(null, Object.assign(clone(ok), { gradA: [0, 0, 0] })));
  put('ゼロ重みに非ゼロ分子 A → 拒否', 'reject', pure.dfmBlendComplexMoments(null, Object.assign(clone(zero), { A: [1e-3, 0] })));
  put('ゼロ重みに非ゼロ微分 dAdt → 拒否', 'reject', pure.dfmBlendComplexMoments(null, Object.assign(clone(zero), { dAdt: [0, 1e-9] })));
  put('局所に selfExcluded なし → 拒否', 'reject', pure.dfmBlendComplexMoments(clone(ok), null));
  put('局所に D0 → 拒否', 'reject', pure.dfmBlendComplexMoments(loc(Object.assign(clone(ok), { D0: 0.006 })), null));
  put('背景に D0 → 拒否', 'reject', pure.dfmBlendComplexMoments(null, Object.assign(clone(ok), { D0: 0.006 })));
  put('局所も背景も無い → 拒否', 'reject', pure.dfmBlendComplexMoments(null, null));
  put('正しい背景 → 受理', 'ok', pure.dfmBlendComplexMoments(null, clone(ok)));
  // RHS の門
  const f = pure.dfmBlendComplexMoments(null, clone(ok));
  put('RHS: uQuantity なし → 拒否', 'reject', pure.dfmMeshVelocityRHS(Object.assign({}, f, { uQuantity: undefined }), [0, 0], [0, 0]));
  put('RHS: uQuantity "weight" → 拒否', 'reject', pure.dfmMeshVelocityRHS(Object.assign({}, f, { uQuantity: 'weight' }), [0, 0], [0, 0]));
  put('RHS: timeDerivativeComplete なし → 拒否', 'reject', pure.dfmMeshVelocityRHS(Object.assign({}, f, { timeDerivativeComplete: undefined }), [0, 0], [0, 0]));
  put('RHS: dUdt 欠落 → 拒否', 'reject', pure.dfmMeshVelocityRHS(Object.assign({}, f, { dUdt: undefined }), [0, 0], [0, 0]));
  put('RHS: v に NaN → 拒否', 'reject', pure.dfmMeshVelocityRHS(f, [NaN, 0], [0, 0]));
  put('RHS: 正しい場 → 受理', 'ok', pure.dfmMeshVelocityRHS(f, [0.1, 0.2], [0, 0]));
  // W=0 の RHS は慣性を 0 にしない
  const fu = pure.dfmBlendComplexMoments(null, clone(zero));
  const ru = pure.dfmMeshVelocityRHS(fu, [0.7, -0.4], [0.01, 0.02]);
  const inertiaKept = ru.ok && ru.positionRate[0] === 0.7 && ru.positionRate[1] === -0.4 && ru.vRate[0] === 0.01 && ru.vRate[1] === 0.02;
  return { cases: C, pass: C.filter((z) => z.want === z.got).length, n: C.length, inertiaKeptAtW0: inertiaKept,
    W0rhs: ru.ok ? { positionRate: ru.positionRate, vRate: ru.vRate, defined: ru.defined } : null };
}

/* ─────────────────────── (e) 背景重み 1e−30 ─────────────────────── */
export function tinyWeightCases(pure) {
  const rows = [];
  const bgOf = (W, U) => ({ W, A: [W * U[0], W * U[1]], gradW: [0, 0], gradA: [0, 0, 0, 0], dWdt: 0, dAdt: [0, 0] });
  // e1: 局所なし・背景 1e−30 → u は背景の速度そのもの(閾値で「未定義」にしない)
  { const U = [3, 4], f = pure.dfmBlendComplexMoments(null, bgOf(1e-30, U));
    rows.push({ name: 'e1 局所なし・W_bg=1e−30', defined: f.defined, u: f.u, expected: U,
      relErr: f.defined ? relMax(f.u, U) : null }); }
  // e2: 局所 W=1(u_loc=0)+ 背景 W=1e−30・u_bg=1e20 → δu = 1e−10(閾値で切れば 0)
  { const Ub = [1e20, -2e20], loc = { selfExcluded: true, W: 1, A: [0, 0], gradW: [0, 0], gradA: [0, 0, 0, 0], dWdt: 0, dAdt: [0, 0] };
    const f = pure.dfmBlendComplexMoments(loc, bgOf(1e-30, Ub));
    const exp = [1e-30 * Ub[0] / (1 + 1e-30), 1e-30 * Ub[1] / (1 + 1e-30)];
    rows.push({ name: 'e2 局所 W=1・u_loc=0 + 背景 W=1e−30・u_bg=(1e20,−2e20)', defined: f.defined, u: f.u, expected: exp,
      relErr: relMax(f.u, exp), nonzero: f.u[0] !== 0 && f.u[1] !== 0 }); }
  // e3: 局所も背景も 1e−30 級(同じ重み)→ u は平均(スケールに依らない)
  { const loc = { selfExcluded: true, W: 1e-30, A: [1e-30 * 2, 0], gradW: [0, 0], gradA: [0, 0, 0, 0], dWdt: 0, dAdt: [0, 0] };
    const f = pure.dfmBlendComplexMoments(loc, bgOf(1e-30, [0, 2]));
    rows.push({ name: 'e3 局所 W=1e−30・u=(2,0) + 背景 W=1e−30・u=(0,2)', defined: f.defined, u: f.u, expected: [1, 1],
      relErr: relMax(f.u, [1, 1]) }); }
  // e4: 背景の微分だけが 1e−30 級 —— ∂ₜu に寄与が残る
  { const loc = { selfExcluded: true, W: 1, A: [0, 0], gradW: [0, 0], gradA: [0, 0, 0, 0], dWdt: 0, dAdt: [0, 0] };
    const B = { W: 1e-30, A: [0, 0], gradW: [0, 0], gradA: [0, 0, 0, 0], dWdt: 0, dAdt: [1e-30, 0] };
    const f = pure.dfmBlendComplexMoments(loc, B);
    rows.push({ name: 'e4 背景 ∂ₜA=1e−30(W_bg=1e−30)', defined: f.defined, dUdt: f.dUdt, expected: [1e-30 / (1 + 1e-30), 0],
      relErr: relMax(f.dUdt, [1e-30 / (1 + 1e-30), 0]), nonzero: f.dUdt[0] !== 0 }); }
  return rows;
}

/* ─────────────────────── (f) 一様定常な場 ─────────────────────── */
export function uniformCases(pure) {
  const rows = [];
  for (const [W0, U, gW, dW] of [[1, [0.3, -0.2], [0.01, 0.02], 0.001], [5.7e4, [0, 4740.27], [1.93e-8, 0], 0],
    [1e-12, [2.29e5, 0], [0, 2.5e-20], 1e-15]]) {
    // A=W U・∇A = U⊗∇W・∂ₜA = U ∂ₜW → u ≡ U・∇u = 0・∂ₜu = 0
    const B = { W: W0, A: [W0 * U[0], W0 * U[1]], gradW: gW.slice(), gradA: [U[0] * gW[0], U[0] * gW[1], U[1] * gW[0], U[1] * gW[1]],
      dWdt: dW, dAdt: [U[0] * dW, U[1] * dW] };
    const f = pure.dfmBlendComplexMoments(null, B);
    const v = [0.123, -0.456], a = [1e-3, 2e-3];
    const r = pure.dfmMeshVelocityRHS(f, v, a);
    rows.push({ W0, U, gradUmax: Math.max(...f.gradU.map(Math.abs)), dUdtMax: Math.max(...f.dUdt.map(Math.abs)),
      extraAccel: [r.coordAccel[0] - a[0], r.coordAccel[1] - a[1]], extraVRate: [r.vRate[0] - a[0], r.vRate[1] - a[1]],
      transportRel: relMax(r.transport, U) });
  }
  return rows;
}

export default { BGCOMPOSE_VERSION, PURE_NAMES, extractTopFunctions, makePure, rng, decompositionCase, decompositionSuite,
  galileanCase, galileanSuite, toBgMoments, hamiltonianRun, boundaryCases, tinyWeightCases, uniformCases };

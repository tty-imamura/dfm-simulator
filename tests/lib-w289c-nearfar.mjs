// 第289便c(原仮定者の裁定(第79報)⑤「高密度表面の手前/反対の逆転で回転引きずり」の整理・第79報で閉じた AN98/AN99・統括の検証項目 R121)——
// **有限サイズ回転源の手前/反対**の純関数(Node だけ・**エンジン未接続**・html を読まない)。
//
// ■ 何か(**提案する作用素**であって、通常の勾配をベクトル化したものではない)
//   回転源 1 個(中心 c・半径 R・角速度 Ω・軸は単位ベクトル ŝ —— z か面内)。観測点 x から中心への単位ベクトル n̂ = (c − x)/d(d = |c − x|)。
//   手前の表面点 c − R n̂ と反対の表面点 c + R n̂ の接線速度 v_near = Ω ŝ × (−R n̂)・v_far = Ω ŝ × (+R n̂)(= −v_near)を、
//   それぞれの距離の 3 乗(+ε³)で重み、ベクトルとして足す:
//     u_rot = C·m·( v_near/((d−R)³+ε³) + v_far/((d+R)³+ε³) )
//   v_far = −v_near なので、大きさで書けば**手前と反対の差** C m |v| (w_near − w_far)(反対側の表面は逆向きに動くので符号が逆転する)。
//   単位: C は相対移動 r⁻³ 核の C_d と同じ [L³/M](m [M]・v [L/T]・w [L⁻³] → u [L/T])。
//   **d ≤ R は核の内側として拒否**(表面の式を中心へ外挿しない)。
//   遠方展開(ε=0): w_near − w_far = (6d²R + 2R³)/(d² − R²)³ ≈ 6R/d⁴ —— 対称な回転源では最低次(r⁻³)の並進項 m(v_near+v_far)/d³ が打ち消し、
//   残りは ∝ J×r/r⁵(J ∝ m R² Ω —— 大きさ r⁻⁴)。器が log-log で冪を測る。
//   面内の軸 ŝ と面内の n̂ では ŝ×n̂ が z を向く —— 面内成分は厳密に 0(回転核 rotlet と同じ型の注意)。
//
// ■ 門(AN99): **C=0 で既存の u とビット同一**。`addCandidate(u, du, C)` は C=0 のとき候補を評価も加算もせず u をそのまま写す
//   (+0 を −0 に足すと符号つき 0 が変わるので、0 を足す形にしない)。器が 🧩 の全自由粒子で `HP.dfmFieldContract` と照合する。
//   **C≠0 を星団の門が通るように調整しない**(C は宣言 —— 由来は決断事項)。
//
// ■ 書かないこと: 「回転引きずりが創発した」「連鎖で円盤ができた」「複素場を接続した」。既存の q 付き場・u=A/W・E6′ に足さない(二重計上)。
//   冪は `**`/Math.pow を使わず積で書く(tests/README §1)。
export const NEARFAR_VERSION = 'w289c-nearfar-1';

const fin = Number.isFinite;
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const v3 = (p) => [p[0], p[1], (p.length > 2) ? p[2] : 0];

/**
 * 手前/反対の核の評価。
 * @param {{x:number[], c:number[], R:number, Omega:number, axis:number[], m:number, gain:number, eps:number}} o
 * @returns {{ok:boolean, why?:string, u:number[], d:number, near:{p:number[],v:number[],w:number}, far:{p:number[],v:number[],w:number}}}
 */
export function nearFarAt(o) {
  if (!o || !Array.isArray(o.x) || !Array.isArray(o.c) || !Array.isArray(o.axis)) return { ok: false, why: 'shape' };
  const x = v3(o.x), c = v3(o.c), s = v3(o.axis), R = o.R, Om = o.Omega, m = o.m, C = o.gain, eps = o.eps;
  if (![...x, ...c, ...s].every(fin) || !fin(Om) || !fin(C)) return { ok: false, why: 'state' };
  if (!(R > 0) || !fin(R)) return { ok: false, why: 'R' };
  if (!(m > 0) || !fin(m)) return { ok: false, why: 'mass' };
  if (!(eps >= 0) || !fin(eps)) return { ok: false, why: 'eps' };
  const sn = Math.sqrt(s[0] * s[0] + s[1] * s[1] + s[2] * s[2]);
  if (!(Math.abs(sn - 1) <= 1e-12)) return { ok: false, why: 'axis' };
  const dv = [c[0] - x[0], c[1] - x[1], c[2] - x[2]], d = Math.sqrt(dv[0] * dv[0] + dv[1] * dv[1] + dv[2] * dv[2]);
  if (!(d > R)) return { ok: false, why: 'inside' };                      // 核の内側(d ≤ R)は拒否 —— 表面の式を中心へ外挿しない
  const n = [dv[0] / d, dv[1] / d, dv[2] / d];
  const W = [Om * s[0], Om * s[1], Om * s[2]];
  const vNear = cross(W, [-R * n[0], -R * n[1], -R * n[2]]), vFar = cross(W, [R * n[0], R * n[1], R * n[2]]);
  const dn = d - R, df = d + R, e3 = eps * eps * eps;
  const wN = 1 / (dn * dn * dn + e3), wF = 1 / (df * df * df + e3);
  const k = C * m;
  const u = [0, 1, 2].map((a) => k * (vNear[a] * wN + vFar[a] * wF));
  return { ok: true, version: NEARFAR_VERSION, u, d, near: { p: [c[0] - R * n[0], c[1] - R * n[1], c[2] - R * n[2]], v: vNear, w: wN },
    far: { p: [c[0] + R * n[0], c[1] + R * n[1], c[2] + R * n[2]], v: vFar, w: wF } };
}

/** 閉じた式(ε=0・z 軸・面内の点): |u| = C m R Ω (w_near − w_far)・w_near − w_far = (6d²R + 2R³)/(d² − R²)³。 */
export function closedMag(d, R, Omega, m, gain) {
  const q = d * d - R * R;
  return gain * m * R * Omega * (6 * d * d * R + 2 * R * R * R) / (q * q * q);
}

/** 門の比較器: C=0 なら候補を評価も加算もしない(既存の u をそのまま写す)。C≠0 なら u + C·du(du は C=1 の候補)。 */
export function addCandidate(u, du, C) {
  if (C === 0) return [u[0], u[1]];
  return [u[0] + C * du[0], u[1] + C * du[1]];
}

/** log-log の最小二乗の傾き。 */
export function slopeLogLog(rs, vs) {
  const X = rs.map(Math.log), Y = vs.map((v) => Math.log(Math.abs(v)));
  const n = X.length, mx = X.reduce((a, b) => a + b, 0) / n, my = Y.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0;
  for (let i = 0; i < n; i++) { sxy += (X[i] - mx) * (Y[i] - my); sxx += (X[i] - mx) * (X[i] - mx); }
  return sxy / sxx;
}
/** r = R·10^(k/(N−1))(k=0..N−1)の対数等間隔の点(10R〜100R)。 */
export function farRadii(R, N = 11) { const out = []; for (let k = 0; k < N; k++) out.push(10 * R * Math.exp(Math.LN10 * k / (N - 1))); return out; }

/** 遠方の冪の床(宣言): 10R〜100R の 11 点の当てはめは ε=0 で −4.012(有限の R/d の補正・10R の局所は −4.054)—— |傾き+4| ≤ 0.05・100R の局所の冪は |+4| ≤ 1e-3。 */
export const POWER_FLOOR = Object.freeze({ fit: 0.05, local100: 1e-3 });

/** 純関数だけの単体試験(器と QA が呼ぶ)。 */
export function selfTest() {
  const base = { c: [0, 0, 0], R: 1, Omega: 1, axis: [0, 0, 1], m: 1, gain: 1, eps: 0 };
  const checks = {};
  // 内側(d ≤ R)の拒否・表面ちょうども拒否
  const inside = [0.5, 1].map((d) => nearFarAt(Object.assign({}, base, { x: [d, 0, 0] })));
  checks.insideRejected = inside.every((r) => r.ok === false && r.why === 'inside');
  // 閉じた式と一致(ε=0)
  const rs = [1.5, 3, 10, 40];
  const cl = rs.map((d) => { const r = nearFarAt(Object.assign({}, base, { x: [d, 0, 0] })); const mag = Math.hypot(r.u[0], r.u[1], r.u[2]);
    return Math.abs(mag - closedMag(d, 1, 1, 1, 1)) / closedMag(d, 1, 1, 1, 1); });
  checks.closedForm = cl.every((e) => e <= 1e-13);
  // 方向: z 軸・点が +x 側 → n̂ = −x̂・v_near = ẑ × (R x̂) = +R ŷ(手前の表面が +y へ動く)→ u は +y(J×r の向き —— J=+z・r=+x)
  const p = nearFarAt(Object.assign({}, base, { x: [5, 0, 0] }));
  checks.direction = p.u[0] === 0 && p.u[1] > 0 && p.u[2] === 0;
  // 面内の軸 → 面内成分は厳密に 0(z だけ)
  const ip = nearFarAt(Object.assign({}, base, { x: [3, 4, 0], axis: [0.6, -0.8, 0] }));
  checks.inPlaneAxisZOnly = ip.ok && ip.u[0] === 0 && ip.u[1] === 0 && ip.u[2] !== 0;
  // Ω=0 で 0・C=0 で 0
  checks.omega0 = nearFarAt(Object.assign({}, base, { x: [5, 0, 0], Omega: 0 })).u.every((v) => v === 0);
  // addCandidate: C=0 で既存の u をそのまま(−0 も保つ)
  const uNeg0 = [-0, 1.5], gate = addCandidate(uNeg0, [1, 1], 0);
  checks.gateKeepsSignedZero = Object.is(gate[0], -0) && gate[1] === 1.5;
  checks.naiveAddLoses = !Object.is(uNeg0[0] + 0 * 1, -0);           // 0 を足す形は −0 を +0 に変える(門をこの形にしない理由)
  return { version: NEARFAR_VERSION, ok: Object.values(checks).every(Boolean), checks };
}

/** 遠方の冪(純関数だけ): 手前/反対(z 軸)と rotlet 型(β J×r/s^{3/2})を同じ点で(R=1・ε 0 と 0.1)。 */
export function powerTable(rotletU) {
  const R = 1, rs = farRadii(R);
  const rows = [0, 0.1].map((eps) => {
    const nf = rs.map((d) => { const r = nearFarAt({ x: [d, 0, 0], c: [0, 0, 0], R, Omega: 1, axis: [0, 0, 1], m: 1, gain: 1, eps }); return Math.hypot(...r.u); });
    const rl = rs.map((d) => Math.hypot(...rotletU([0, 0, 0.5], [d, 0, 0], 1, eps)));
    const loc = (vals, k) => Math.log(vals[k] / vals[k - 1]) / Math.log(rs[k] / rs[k - 1]);
    return { eps, nearFar: { fit: slopeLogLog(rs, nf), local10: loc(nf, 1), local100: loc(nf, rs.length - 1) },
      rotlet: { fit: slopeLogLog(rs, rl), local10: loc(rl, 1), local100: loc(rl, rs.length - 1) } };
  });
  const ok = rows.every((z) => Math.abs(z.nearFar.fit + 4) <= POWER_FLOOR.fit && Math.abs(z.nearFar.local100 + 4) <= POWER_FLOOR.local100
    && Math.abs(z.rotlet.fit + 2) <= POWER_FLOOR.fit && Math.abs(z.rotlet.local100 + 2) <= POWER_FLOOR.local100);
  return { R, radii: rs, floor: POWER_FLOOR, rows, ok };
}

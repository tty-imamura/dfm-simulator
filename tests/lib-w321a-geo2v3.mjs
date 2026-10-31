// 第321便a(原仮定者の予定(第123報)「geoPN=2の予定: 3D対応する。現状、最も銀河を再現しているのがgalaxyGeo2であり、引きずり近似としての需要が有る」・
// 統括の検証項目 R266): **geoPN=2(v−u 則)の輸送の 3 成分の純関数**(策定の段 S1 —— html・エンジン・在位の本は変えない。器と QA だけが読む)。
//
// ■ 何の写しか(beta/index.html の基点 a708bfe の行 —— 読んだだけ・`S._core` は 1 命令も変えていない)
//   ① 対ループの決定力・フレームの分子 P・勾配(generic 34005〜34048 行 / 特別化 pairCorePN 29842〜29877 行 —— 二つは同じ値〔QA kernel.bitident〕):
//        w_j = m_j/√(d²+ε²)(frameWeight:"share")・c_j = v_j + ω_j(d) × (r_i − r_j)・ω_j(d) = s_j â_j (R_j/(R_j+d))^q(q 近似 —— 2D は ẑ のスカラー)・
//        ∂P_a/∂x_b = (∂w_j/∂x_b) c_a + w_j ∂c_a/∂x_b・∂w_j/∂x_b = −m_j (r−r_j)_b/(d²+ε²)^{3/2}・∂c_a/∂x_b = [ω]_×,ab + (ω′ × r)_a n_b・ω′ = −q ω/(R_j+d)。
//   ② 輸送(34558〜34587 行): u = P/W(W = D₀ + Σ w_j)・J_ab = (∂P_a/∂x_b − u_a ∂W/∂x_b)/W・
//        Δu = (u − u_prev) − ((v−u)·∇)u dt + (∇×u) × (v − k_F u) dt(2D の curl·ẑ× は 3D の (∇×u)×)・|Δu| ≤ 0.8・Δv = k_F Δu・Δp = m k_F Δu・
//        初回(u の履歴が無い天体)は Δv を当てず履歴だけ置く・pinned の受け手は受けない。
//   ③ 反作用(34692〜34789 行): Δp_i を源 j へ φ_ij = w_j(r_i)/W(r_i) で配る(pinned の源と背景 D₀ はリザーバ)・残余トルク n_ij = (r_i − r_j) × φ_ij Δp_i を
//        (I_i + I_j) の等角加速度で 2 つの自転へ(3D はベクトル)・粒子あたり |Δv| ≤ 16(残りはリザーバ)。
//   ④ 位置更新(34903〜34922 行): rotA += s dt・|v| ≤ 100・|s| ≤ 40・ドリフト(KDK の A だけ)・t の前進(KDK の B だけ)。
//   積分器は `S._core` の mode(semi = 0・leapfrog = 1 と 2)と同じ相。**数の表現**(状態・フレームの配列の単精度/倍精度)は呼び手の配列の型のまま
//   (html の既定は Float32 —— 面への退化の照合はこの型で同じ演算列を通す)。
//
// ■ 3D の規約(この lib の宣言 —— S2 で裁定する候補)
//   ・源の自転のベクトル Ω_j = s_j â_j(今の三次元の状態 S.spin〔軸まわりの角速度〕と単位の軸 S.sax/say/saz —— 軸を有効化しない粒子は +z)。
//   ・q 近似の 3D: 緯度に依らない角速度 ω_j(d) = Ω_j (R_j/(R_j+d))^q の殻の速度 ω_j(d) × (r − r_j)(極で 0・赤道で最大)。
//   ・残余トルクの自転への入れ方 spinPolicy: "vector"(Ω' = s â + ΔΩ —— 軸が回る・s' の符号は軸の向きを保つ側)/"parallel"(â 方向の分だけ s へ・垂直の分は
//     角運動量の口座 spinPerpL へ)。退化の場面(â = ẑ・ΔΩ ∥ ẑ)ではどちらも 2D と同じ演算列。
//   ・口座の欄は 2D と同じ名(resPx・resPy・resL —— 3D は resPz・resLx・resLy・resLz〔resL = resLz〕・dragWorkE・dragWorkKE・dragSpinE・dragWorkN・clampVN・clampSN・clampRN)。
//     固定中心の拘束分は新しい欄 conP・conL(pinned の天体に当たらなかった重力の力積とそのモーメント —— 2D は記帳しない)。
//
// ■ この lib の範囲の外(拒否 —— 理由を返す): λ_PN ≠ 0・接触(contactMode が "none" でない)・frameWeight が "share" でない(pull 族は別の分母)・kRep・muF・kappaS・etaRad・
//   一様外場・ハロー・UniverseBox・pairReduced・coupleSink・cmGauge・dragRef・粒子別 q・コア・熱・相変化・機構スペクトル。
//
// ■ 言わないこと: 3D で銀河を再現した・3D の回転曲線(本はまだ無い —— 純関数と試験だけ)。q 近似を導いた法則と呼ばない。
export const GEO2V3_VERSION = 'w321a-geo2v3-1';
/** 2D の核から写した上限(行は基点 a708bfe)。 */
export const GEO2V3_LIMITS = Object.freeze({ duMax: 0.8, duMax2: 0.64, vMax: 100, vMax2: 10000, spinMax: 40, reactDvCap: 16, reactDvCap2: 256, iMin: 1e-9, wMin: 1e-9, dMin: 1e-9 });
/** 写した 2D の行(基点 a708bfe の beta/index.html —— 文書と正本の表が読む)。 */
export const GEO2V3_SOURCE_LINES = Object.freeze([
  { part: '対ループのフレームの分子(generic)', lines: '34005-34006', what: 'uAx += w_j (v_j + ω_j ẑ×(r−r_j))' },
  { part: '対ループの勾配(generic)', lines: '34015-34048', what: '∂P/∂x・∂W/∂x(Plummer の w の厳密微分・∂ω/∂d = −qω/(R+d))' },
  { part: '対ループ(特別化 pairCorePN)', lines: '29842-29877', what: '同じ式(ω を使い回す —— 値は同じ)' },
  { part: '輸送 3 項(②)', lines: '34558-34587', what: 'Δu − ((v−u)·∇)u dt + curl ẑ×(v − k_F u) dt・|Δu|≤0.8・Δp' },
  { part: '反作用(③)', lines: '34692-34789', what: 'φ_ij 分配・残余トルク・|Δv|≤16・背景 D₀ のリザーバ' },
  { part: '位置更新(④)', lines: '34903-34922', what: 'rotA・|v|≤100・|s|≤40・ドリフト' },
  { part: '上限の定数', lines: '6973', what: 'REACTION_DV_CAP = 16' }]);

const F32 = Float32Array, F64 = Float64Array;
const ctorOf = (p) => (p === 'double' ? F64 : F32);
const SCALAR_LEDGER = ['resPx', 'resPy', 'resPz', 'resLx', 'resLy', 'resLz', 'conPx', 'conPy', 'conPz', 'conLx', 'conLy', 'conLz',
  'spinPerpLx', 'spinPerpLy', 'spinPerpLz', 'dragWorkE', 'dragWorkKE', 'dragSpinE', 'dragWorkN', 'clampVN', 'clampSN', 'clampRN', 'axisTurnN'];

/** 範囲の検査(純関数 —— physics と bodies を読むだけ)。戻り値 {ok, reasons:[{key, why}]} */
export function geo2v3ScopeOf(ph, bodies) {
  const out = [], add = (key, why) => out.push({ key, why });
  const p = ph && typeof ph === 'object' ? ph : {};
  const num = (k) => (typeof p[k] === 'number' ? p[k] : 0);
  if (p.geoPN !== 2) add('geoPN', 'geoPN が 2 でない(番号 2 の宣言だけ —— 3/4/geodesic が v−u 則に解決する宣言は S2 でも拒否のまま)');
  if (!(num('kFrame') > 0)) add('kFrame', 'kFrame > 0 でない(kFrame = 0 は kF0 の EIH の役割 —— 別の経路)');
  if (p.lambdaPN !== 0) add('lambdaPN', 'λ_PN ≠ 0(1PN の w の項は S2 の範囲の外)');
  if (p.contactMode !== 'none') add('contactMode', 'contactMode が "none" でない(接触なしの契約だけ)');
  if (p.frameWeight !== 'share') add('frameWeight', 'frameWeight が "share" でない(pull 族は分母 D0pull と重み m/(d²+ε²)^{p/2} —— 別の段)');
  for (const k of ['kRep', 'muF', 'kappaS', 'etaRad', 'gravityX', 'gravityY']) if (num(k) !== 0) add(k, k + ' ≠ 0');
  for (const k of ['halo', 'frameReaction', 'coupleSink', 'cmGauge', 'dragRef', 'spaceMesh', 'geodesic', 'relativeDrag', 'qLock', 'ledgerFrame'])
    if (p[k] !== undefined && p[k] !== null && !(k === 'frameReaction' && p[k] === 'legacy') && !(k === 'coupleSink' && p[k] === 'spin')) add(k, 'physics.' + k + ' は範囲の外');
  (Array.isArray(bodies) ? bodies : []).forEach((b, i) => {
    if (!b || typeof b !== 'object') return;
    for (const k of ['core', 'layers', 'dragQ', 'dragQTrans', 'pulse', 'spinDipole', 'zonal', 'railOmega']) if (b[k] !== undefined && b[k] !== null && b[k] !== 0) add('body', 'bodies[' + i + '].' + k);
    if (b.lightSweep === 'auto') add('body', 'bodies[' + i + '].lightSweep:"auto"');
  });
  return { ok: out.length === 0, reasons: out };
}

/**
 * 純関数の状態を作る。bodies: [{m, R, x, y, z?, vx, vy, vz?, spin?, axis?:[3], pinned?}]・params: {G, D0, kFrame, q, softening}・
 * prec: {state, frame, mass, spin}('single' | 'double' —— html の既定は全部 single)。
 */
export function makeState(bodies, params, prec = {}, extra = {}) {
  const n = bodies.length, P = Object.assign({ state: 'single', frame: 'single', mass: 'single', spin: 'single' }, prec);
  const S = ctorOf(P.state), Fm = ctorOf(P.mass), Fs = ctorOf(P.spin), Ff = ctorOf(P.frame);
  const st = { version: GEO2V3_VERSION, n, prec: P, params: Object.assign({}, params), integrator: extra.integrator || 'semi', spinPolicy: extra.spinPolicy || 'vector',
    m: new Fm(n), R: new F32(n), pinned: new Uint8Array(n), x: new S(n), y: new S(n), z: new S(n), vx: new S(n), vy: new S(n), vz: new S(n),
    carVx: P.state === 'double' && extra.carry ? new F64(n) : null, carVy: P.state === 'double' && extra.carry ? new F64(n) : null, carVz: P.state === 'double' && extra.carry ? new F64(n) : null,
    spin: new Fs(n), sax: new F64(n), say: new F64(n), saz: new F64(n).fill(1), uPx: new Ff(n), uPy: new Ff(n), uPz: new Ff(n), hasU: new Uint8Array(n),
    rotA: new F64(n), t: 0, ledger: Object.fromEntries(SCALAR_LEDGER.map((k) => [k, 0])), trace: null };
  bodies.forEach((b, i) => {
    st.m[i] = b.m; st.R[i] = b.R; st.pinned[i] = b.pinned ? 1 : 0;
    st.x[i] = b.x || 0; st.y[i] = b.y || 0; st.z[i] = b.z || 0; st.vx[i] = b.vx || 0; st.vy[i] = b.vy || 0; st.vz[i] = b.vz || 0; st.spin[i] = b.spin || 0;
    if (Array.isArray(b.axis)) { const a = b.axis, nn = Math.hypot(a[0], a[1], a[2]); st.sax[i] = a[0] / nn; st.say[i] = a[1] / nn; st.saz[i] = a[2] / nn; }
  });
  return st;
}
/** 状態の写し(配列の型を保つ)。 */
export function cloneState(st) {
  const o = Object.assign({}, st);
  for (const k of ['m', 'R', 'pinned', 'x', 'y', 'z', 'vx', 'vy', 'vz', 'carVx', 'carVy', 'carVz', 'spin', 'sax', 'say', 'saz', 'uPx', 'uPy', 'uPz', 'hasU', 'rotA'])
    o[k] = st[k] ? new st[k].constructor(st[k]) : st[k];
  o.params = Object.assign({}, st.params); o.prec = Object.assign({}, st.prec); o.ledger = Object.assign({}, st.ledger); o.trace = null;
  return o;
}
/** html の二次元の sim(build の後)から状態を写す(z = v_z = 0・軸 +z・配列は sim と同じ型)。 */
export function stateOf2D(S, extra = {}) {
  const n = S.n, p = S.params, pr = { state: S.x instanceof F64 ? 'double' : 'single', frame: S.uPx instanceof F64 ? 'double' : 'single', mass: S.mEff instanceof F64 ? 'double' : 'single', spin: S.spin instanceof F64 ? 'double' : 'single' };
  const st = makeState(Array.from({ length: n }, () => ({ m: 0, R: 0 })), { G: p.G, D0: p.D0, kFrame: p.kFrame, q: p.q, softening: p.softening }, pr, { integrator: S.integrator, spinPolicy: extra.spinPolicy, carry: !!S.carVx });
  for (let i = 0; i < n; i++) {
    st.m[i] = S.mEff[i]; st.R[i] = S.R[i]; st.pinned[i] = S.pinned[i]; st.x[i] = S.x[i]; st.y[i] = S.y[i]; st.vx[i] = S.vx[i]; st.vy[i] = S.vy[i]; st.spin[i] = S.spin[i];
    st.uPx[i] = S.uPx[i]; st.uPy[i] = S.uPy[i]; st.hasU[i] = S.hasU[i]; st.rotA[i] = S.rotA[i];
    if (st.carVx) { st.carVx[i] = S.carVx[i]; st.carVy[i] = S.carVy[i]; }
  }
  st.t = S.t; Object.assign(st.ledger, { resPx: S.resPx, resPy: S.resPy, resLz: S.resL, clampVN: S.clampVN, clampSN: S.clampSN, clampRN: S.clampRN || 0 });
  return st;
}
/** html の三次元の sim(build の後)から状態を写す(S.z・S.vz・S.spin と軸 S.sax/say/saz を読む)。 */
export function stateOf3D(S, params, extra = {}) {
  const st = stateOf2D(S, extra);
  if (params) Object.assign(st.params, params);
  for (let i = 0; i < S.n; i++) { st.z[i] = S.z[i]; st.vz[i] = S.vz[i]; st.sax[i] = S.sax[i]; st.say[i] = S.say[i]; st.saz[i] = S.saz[i]; if (st.carVz && S.carVz) st.carVz[i] = S.carVz[i]; }
  return st;
}

/* ───────── 演算子(式そのもの —— 步と同じ演算の順)───────── */
/** ω × r の 3 成分(源の殻の速度 —— 2D の omj*(−dy), omj*dx と同じ演算列に退化する並び)。 */
function crossOR(ox, oy, oz, rx, ry, rz) { return [oy * rz - oz * ry, oz * rx - ox * rz, ox * ry - oy * rx]; }
/** 源 j の受け手側の寄与: 決定力 w・殻の速度 c・勾配 ∂P(行優先 9)と ∂W(3)。r = r_i − r_j・d = |r|。 */
export function sourceTerm3(mj, Rj, sj, ax, ay, az, vxj, vyj, vzj, rx, ry, rz, d, invW, invd3, q, withGrad) {
  const wj = mj * invW;
  let ox = 0, oy = 0, oz = 0;
  if (sj !== 0) { const tt = Rj / (Rj + d); if (q === 2) { ox = (sj * ax) * tt * tt; oy = (sj * ay) * tt * tt; oz = (sj * az) * tt * tt; } else { const g = Math.pow(tt, q); ox = (sj * ax) * g; oy = (sj * ay) * g; oz = (sj * az) * g; } }
  const cr = crossOR(ox, oy, oz, rx, ry, rz);
  const c = [vxj + cr[0], vyj + cr[1], vzj + cr[2]];
  if (!withGrad) return { w: wj, c };
  const idd = (d > 1e-9) ? 1 / d : 0;
  let dx_ = 0, dy_ = 0, dz_ = 0;   // ∂ω/∂d(ベクトル)
  if (sj !== 0) { dx_ -= q * ox / (Rj + d); dy_ -= q * oy / (Rj + d); dz_ -= q * oz / (Rj + d); }
  const gw = [-mj * rx * invd3, -mj * ry * invd3, -mj * rz * invd3];
  const nv = [rx * idd, ry * idd, rz * idd];
  const Q = crossOR(dx_, dy_, dz_, rx, ry, rz);
  // [ω]_× の行優先(ε_akb ω_k)
  const E = [0, -oz, oy, oz, 0, -ox, -oy, ox, 0];
  const dP = new Array(9);
  for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) dP[3 * a + b] = gw[b] * c[a] + wj * (E[3 * a + b] + Q[a] * nv[b]);
  return { w: wj, c, dP, dW: gw, omega: [ox, oy, oz] };
}
/** 任意の点 r の u・∇u(倍精度の写し —— 試験と S2 の設計の口)。exclude の天体は源から外す。 */
export function frameAtPoint3(st, r, o = {}) {
  const p = st.params, eps2 = p.softening * p.softening, q = p.q, ex = o.exclude;
  let W = p.D0, Px = 0, Py = 0, Pz = 0;
  const dP = new Array(9).fill(0), dW = [0, 0, 0];
  for (let j = 0; j < st.n; j++) {
    if (j === ex) continue;
    const rx = r[0] - st.x[j], ry = r[1] - st.y[j], rz = r[2] - st.z[j], d2 = rx * rx + ry * ry + rz * rz, d = Math.sqrt(d2);
    const invW = 1 / Math.sqrt(d2 + eps2), invd3 = invW * invW * invW;
    const T = sourceTerm3(st.m[j], st.R[j], st.spin[j], st.sax[j], st.say[j], st.saz[j], st.vx[j], st.vy[j], st.vz[j], rx, ry, rz, d, invW, invd3, q, true);
    W += T.w; Px += T.w * T.c[0]; Py += T.w * T.c[1]; Pz += T.w * T.c[2];
    for (let k = 0; k < 9; k++) dP[k] += T.dP[k];
    for (let k = 0; k < 3; k++) dW[k] += T.dW[k];
  }
  const u = [Px / W, Py / W, Pz / W], J = new Array(9);
  for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) J[3 * a + b] = (dP[3 * a + b] - u[a] * dW[b]) / W;
  return { u, J, W, curl: curlOf(J) };
}
/** 3×3 の勾配 J_ab = ∂u_a/∂x_b(行優先)の回転 ∇×u。 */
export function curlOf(J) { return [J[7] - J[5], J[2] - J[6], J[3] - J[1]]; }
/**
 * 輸送の演算子(2D の 34565〜34575 行の 3 成分): Δu = (u − u_prev) + (−((v−u)·∇)u + (∇×u) × (v − k_F u)) dt・|Δu| ≤ 0.8。
 * 戻り値 {du(クランプ後), raw, adv, cor, curl, clamped}。履歴が無い(hasPrev=false)なら du = 0(初回の蹴りなし)。
 */
export function transportDelta3(u, J, uPrev, v, kF, dt, hasPrev = true) {
  const curl = curlOf(J);
  if (!hasPrev) return { du: [0, 0, 0], raw: [0, 0, 0], adv: [0, 0, 0], cor: [0, 0, 0], curl, clamped: false };
  const rux = v[0] - u[0], ruy = v[1] - u[1], ruz = v[2] - u[2];
  const wx2 = v[0] - kF * u[0], wy2 = v[1] - kF * u[1], wz2 = v[2] - kF * u[2];
  const adv = [rux * J[0] + ruy * J[1] + ruz * J[2], rux * J[3] + ruy * J[4] + ruz * J[5], rux * J[6] + ruy * J[7] + ruz * J[8]];
  const cor = [curl[1] * wz2 - curl[2] * wy2, curl[2] * wx2 - curl[0] * wz2, curl[0] * wy2 - curl[1] * wx2];
  let dux = (u[0] - uPrev[0]) + (-adv[0] + cor[0]) * dt, duy = (u[1] - uPrev[1]) + (-adv[1] + cor[1]) * dt, duz = (u[2] - uPrev[2]) + (-adv[2] + cor[2]) * dt;
  const raw = [dux, duy, duz];
  const dl2 = dux * dux + duy * duy + duz * duz;
  let clamped = false;
  if (dl2 > 0.64) { const sc = 0.8 / Math.sqrt(dl2); dux *= sc; duy *= sc; duz *= sc; clamped = true; }
  return { du: [dux, duy, duz], raw, adv, cor, curl, clamped };
}
/** 剛体回転の場 u = V + Ω × r + H r の J(解析 —— 試験の入力)。 */
export function rigidJ(Om, H = 0) { return [H, -Om[2], Om[1], Om[2], H, -Om[0], -Om[1], Om[0], H]; }

/* ───────── 1 步(semi / leapfrog —— `S._core` の相と同じ)───────── */
/** 1 步。戻り値は新しい状態(入力は変えない)。o.trace = true で各相の u・J・Δu・Δp・反作用を記録する。 */
export function geo2Step3(st0, dt, o = {}) {
  const st = cloneState(st0);
  if (o.trace) st.trace = [];
  if ((o.integrator || st.integrator) === 'leapfrog') { corePass3(st, dt, 1, o); corePass3(st, dt, 2, o); }
  else corePass3(st, dt, 0, o);
  return st;
}
/** n 步(状態を進めて返す)。 */
export function geo2Run3(st, dt, steps, o = {}) { let s = st; for (let k = 0; k < steps; k++) s = geo2Step3(s, dt, o); return s; }

function corePass3(st, dt, mode, o) {
  const n = st.n, p = st.params, L = st.ledger;
  const kickDt = (mode !== 0) ? dt * 0.5 : dt;
  const doPost = (mode !== 1), doDrift = (mode !== 2);
  if (!n) { if (doPost) st.t += dt; return; }
  const { m, R, pinned, x, y, z, vx, vy, vz, spin, sax, say, saz, uPx, uPy, uPz, hasU, rotA } = st;
  const carV = !!st.carVx, carVx = st.carVx, carVy = st.carVy, carVz = st.carVz;
  const eps = p.softening, eps2 = eps * eps, G = p.G, q = p.q, kFrame = p.kFrame, D0 = p.D0;
  const g2on = kFrame > 0;
  const SA = ctorOf(st.prec.state), FA = ctorOf(st.prec.frame);
  const ax = new SA(n), ay = new SA(n), az = new SA(n);
  const sumW = new FA(n), uAx = new FA(n), uAy = new FA(n), uAz = new FA(n), dpx = new FA(n), dpy = new FA(n), dpz = new FA(n);
  const pairD = new FA(Math.max(1, n * (n - 1) / 2));
  const dP = new F64(9 * n), dW = new F64(3 * n), Imom = new F64(n);
  for (let i0 = 0; i0 < n; i0++) Imom[i0] = 0.5 * m[i0] * R[i0] * R[i0];
  const tr = o.trace ? { mode, u: [], J: [], du: [], dp: [], accV: null, accS: null } : null;
  // ① 全対(i<j の走査順 —— 2D と同じ。受け手 i の和は源の添字の昇順)
  let pk = 0;
  for (let i = 0; i < n; i++) {
    const mi = m[i], Ri = R[i], si = spin[i], xi = x[i], yi = y[i], zi = z[i];
    for (let j = i + 1; j < n; j++, pk++) {
      const dx = xi - x[j], dy = yi - y[j], dz = zi - z[j];
      const d2 = dx * dx + dy * dy + dz * dz, d = Math.sqrt(d2);
      pairD[pk] = d;
      const mj = m[j], Rj = R[j], sj = spin[j];
      const invW = 1 / Math.sqrt(d2 + eps2), invd3 = invW * invW * invW, fg = G * invd3;
      ax[i] -= fg * mj * dx; ay[i] -= fg * mj * dy; az[i] -= fg * mj * dz;
      ax[j] += fg * mi * dx; ay[j] += fg * mi * dy; az[j] += fg * mi * dz;
      const Tj = sourceTerm3(mj, Rj, sj, sax[j], say[j], saz[j], vx[j], vy[j], vz[j], dx, dy, dz, d, invW, invd3, q, g2on);
      const Ti = sourceTerm3(mi, Ri, si, sax[i], say[i], saz[i], vx[i], vy[i], vz[i], -dx, -dy, -dz, d, invW, invd3, q, g2on);
      sumW[i] += Tj.w; sumW[j] += Ti.w;
      uAx[i] += Tj.w * Tj.c[0]; uAy[i] += Tj.w * Tj.c[1]; uAz[i] += Tj.w * Tj.c[2];
      uAx[j] += Ti.w * Ti.c[0]; uAy[j] += Ti.w * Ti.c[1]; uAz[j] += Ti.w * Ti.c[2];
      if (g2on) {
        for (let k = 0; k < 9; k++) { dP[9 * i + k] += Tj.dP[k]; dP[9 * j + k] += Ti.dP[k]; }
        for (let k = 0; k < 3; k++) { dW[3 * i + k] += Tj.dW[k]; dW[3 * j + k] += Ti.dW[k]; }
      }
    }
  }
  // ② 速度のキック・輸送 3 項(受け手の昇順)
  let anyDp = false, dwW = 0, dwK = 0, dwS = 0, dwN = 0;
  for (let i = 0; i < n; i++) {
    if (pinned[i]) {   // 拘束の口座: pinned の天体に当たらなかった重力の力積(2D は記帳しない —— 3D の口座の新しい欄)
      const Jx = m[i] * ax[i] * kickDt, Jy = m[i] * ay[i] * kickDt, Jz = m[i] * az[i] * kickDt;
      L.conPx += Jx; L.conPy += Jy; L.conPz += Jz; L.conLx += y[i] * Jz - z[i] * Jy; L.conLy += z[i] * Jx - x[i] * Jz; L.conLz += x[i] * Jy - y[i] * Jx;
      continue;
    }
    if (carV) {
      const addX = ax[i] * kickDt + carVx[i], v0x = vx[i]; vx[i] = v0x + addX; carVx[i] = addX - (vx[i] - v0x);
      const addY = ay[i] * kickDt + carVy[i], v0y = vy[i]; vy[i] = v0y + addY; carVy[i] = addY - (vy[i] - v0y);
      const addZ = az[i] * kickDt + carVz[i], v0z = vz[i]; vz[i] = v0z + addZ; carVz[i] = addZ - (vz[i] - v0z);
    } else { vx[i] += ax[i] * kickDt; vy[i] += ay[i] * kickDt; vz[i] += az[i] * kickDt; }
    if (!doPost) continue;
    const denom = D0 + sumW[i];
    if (denom > 0 && g2on) {
      const ux = uAx[i] / denom, uy = uAy[i] / denom, uz = uAz[i] / denom, u = [ux, uy, uz];
      const J = new Array(9);
      for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) J[3 * a + b] = (dP[9 * i + 3 * a + b] - u[a] * dW[3 * i + b]) / denom;
      const T = transportDelta3(u, J, [uPx[i], uPy[i], uPz[i]], [vx[i], vy[i], vz[i]], kFrame, dt, hasU[i] === 1);
      if (tr) { tr.u.push([i, ux, uy, uz]); tr.J.push([i, ...J]); }
      if (hasU[i]) {
        const dux = T.du[0], duy = T.du[1], duz = T.du[2];
        const dvx = kFrame * dux, dvy = kFrame * duy, dvz = kFrame * duz;
        { const w = m[i] * (vx[i] * dvx + vy[i] * dvy + vz[i] * dvz); dwW += w; dwK += w + 0.5 * m[i] * (dvx * dvx + dvy * dvy + dvz * dvz); dwN++; }
        vx[i] += kFrame * dux; vy[i] += kFrame * duy; vz[i] += kFrame * duz;
        dpx[i] = m[i] * kFrame * dux; dpy[i] = m[i] * kFrame * duy; dpz[i] = m[i] * kFrame * duz;
        if (dpx[i] !== 0 || dpy[i] !== 0 || dpz[i] !== 0) anyDp = true;
        if (tr) { tr.du.push([i, dux, duy, duz, T.clamped]); tr.dp.push([i, dpx[i], dpy[i], dpz[i]]); }
      } else if (tr) tr.du.push([i, 0, 0, 0, false]);
      uPx[i] = ux; uPy[i] = uy; uPz[i] = uz; hasU[i] = 1;
    }
  }
  // ③ 反作用(i<j の対 —— 2D と同じ走査・倍精度へ集積して一括適用)
  if (doPost && kFrame > 0 && anyDp) {
    const accVx = new F64(n), accVy = new F64(n), accVz = new F64(n), accSx = new F64(n), accSy = new F64(n), accSz = new F64(n);
    const Warr = new F64(n), hasD = new Uint8Array(n), bgW = D0;
    for (let i0 = 0; i0 < n; i0++) { const W0 = bgW + sumW[i0]; Warr[i0] = W0; hasD[i0] = ((dpx[i0] !== 0 || dpy[i0] !== 0 || dpz[i0] !== 0) && W0 > 0) ? 1 : 0; }
    let pk2 = 0;
    for (let i = 0; i < n; i++) {
      const mi = m[i], xi = x[i], yi = y[i], zi = z[i], Ii = Imom[i], Wi = Warr[i], dpxi = dpx[i], dpyi = dpy[i], dpzi = dpz[i], hasI = hasD[i] === 1;
      for (let j = i + 1; j < n; j++, pk2++) {
        const hasJ = hasD[j] === 1;
        if (!hasI && !hasJ) continue;
        const dpxj = dpx[j], dpyj = dpy[j], dpzj = dpz[j], Wj = Warr[j];
        const d = pairD[pk2], dx = xi - x[j], dy = yi - y[j], dz = zi - z[j], Ij = Imom[j];
        if (hasI) {
          const phi = (m[j] / Math.sqrt(d * d + eps2)) / Wi;
          const rpx = phi * dpxi, rpy = phi * dpyi, rpz = phi * dpzi;
          if (pinned[j]) { L.resPx -= rpx; L.resPy -= rpy; L.resPz -= rpz; L.resLx -= yi * rpz - zi * rpy; L.resLy -= zi * rpx - xi * rpz; L.resLz -= xi * rpy - yi * rpx; }
          else {
            accVx[j] -= rpx / m[j]; accVy[j] -= rpy / m[j]; accVz[j] -= rpz / m[j];
            const IJ = Ii + Ij;
            if (Math.abs(IJ) > 1e-9) {
              const nx = (dy * rpz - dz * rpy) / IJ, ny = (dz * rpx - dx * rpz) / IJ, nz = (dx * rpy - dy * rpx) / IJ;
              accSx[i] -= nx; accSy[i] -= ny; accSz[i] -= nz; accSx[j] -= nx; accSy[j] -= ny; accSz[j] -= nz;
            }
          }
        }
        if (hasJ) {
          const phi = (mi / Math.sqrt(d * d + eps2)) / Wj;
          const rpx = phi * dpxj, rpy = phi * dpyj, rpz = phi * dpzj;
          if (pinned[i]) { L.resPx -= rpx; L.resPy -= rpy; L.resPz -= rpz; L.resLx -= y[j] * rpz - z[j] * rpy; L.resLy -= z[j] * rpx - x[j] * rpz; L.resLz -= x[j] * rpy - y[j] * rpx; }
          else {
            accVx[i] -= rpx / mi; accVy[i] -= rpy / mi; accVz[i] -= rpz / mi;
            const IJ = Ii + Ij;
            if (Math.abs(IJ) > 1e-9) {
              const ex = x[j] - xi, ey = y[j] - yi, ez = z[j] - zi;
              const nx = (ey * rpz - ez * rpy) / IJ, ny = (ez * rpx - ex * rpz) / IJ, nz = (ex * rpy - ey * rpx) / IJ;
              accSx[j] -= nx; accSy[j] -= ny; accSz[j] -= nz; accSx[i] -= nx; accSy[i] -= ny; accSz[i] -= nz;
            }
          }
        }
      }
    }
    for (let i = 0; i < n; i++) {   // 粒子あたり |Δv| ≤ 16(残りはリザーバ)
      const dv2 = accVx[i] * accVx[i] + accVy[i] * accVy[i] + accVz[i] * accVz[i];
      if (dv2 > 256) {
        const sc = 16 / Math.sqrt(dv2), rx = accVx[i] * (1 - sc), ry = accVy[i] * (1 - sc), rz = accVz[i] * (1 - sc);
        L.resPx += m[i] * rx; L.resPy += m[i] * ry; L.resPz += m[i] * rz;
        L.resLx += m[i] * (y[i] * rz - z[i] * ry); L.resLy += m[i] * (z[i] * rx - x[i] * rz); L.resLz += m[i] * (x[i] * ry - y[i] * rx);
        accVx[i] *= sc; accVy[i] *= sc; accVz[i] *= sc; L.clampRN++;
      }
    }
    for (let i = 0; i < n; i++) {   // 仕事の口座(2D の dwAddApply と同じ式 —— 適用の前の v と s で)
      const dvx = accVx[i], dvy = accVy[i], dvz = accVz[i], dsx = accSx[i], dsy = accSy[i], dsz = accSz[i];
      if (dvx === 0 && dvy === 0 && dvz === 0 && dsx === 0 && dsy === 0 && dsz === 0) continue;
      const mi = m[i], w = mi * (vx[i] * dvx + vy[i] * dvy + vz[i] * dvz);
      dwW += w; dwK += w + 0.5 * mi * (dvx * dvx + dvy * dvy + dvz * dvz); dwN++;
      if (dsx !== 0 || dsy !== 0 || dsz !== 0) { const Ii = Imom[i], s = spin[i]; dwS += Ii * ((s * sax[i]) * dsx + (s * say[i]) * dsy + (s * saz[i]) * dsz + 0.5 * (dsx * dsx + dsy * dsy + dsz * dsz)); }
    }
    for (let i = 0; i < n; i++) {
      vx[i] += accVx[i]; vy[i] += accVy[i]; vz[i] += accVz[i];
      applySpin3(st, i, accSx[i], accSy[i], accSz[i], Imom[i]);
    }
    if (bgW > 0) {
      for (let i = 0; i < n; i++) {
        if (dpx[i] === 0 && dpy[i] === 0 && dpz[i] === 0) continue;
        const Wi = bgW + sumW[i]; if (Wi <= 1e-9) continue;
        const phiBg = bgW / Wi, rpx = phiBg * dpx[i], rpy = phiBg * dpy[i], rpz = phiBg * dpz[i];
        L.resPx -= rpx; L.resPy -= rpy; L.resPz -= rpz; L.resLx -= y[i] * rpz - z[i] * rpy; L.resLy -= z[i] * rpx - x[i] * rpz; L.resLz -= x[i] * rpy - y[i] * rpx;
      }
    }
    if (tr) { tr.accV = [Array.from(accVx), Array.from(accVy), Array.from(accVz)]; tr.accS = [Array.from(accSx), Array.from(accSy), Array.from(accSz)]; }
  }
  if (dwN) { L.dragWorkE += dwW; L.dragWorkKE += dwK; L.dragSpinE += dwS; L.dragWorkN += dwN; }
  // ④ 安全上限・位置更新
  for (let i = 0; i < n; i++) {
    if (doPost) rotA[i] += spin[i] * dt;
    if (pinned[i]) continue;
    const vv2 = vx[i] * vx[i] + vy[i] * vy[i] + vz[i] * vz[i];
    if (vv2 > 10000) { const sc = 100 / Math.sqrt(vv2); vx[i] *= sc; vy[i] *= sc; vz[i] *= sc; L.clampVN++; }
    if (spin[i] > 40) { spin[i] = 40; L.clampSN++; } else if (spin[i] < -40) { spin[i] = -40; L.clampSN++; }
    if (doDrift) { x[i] += vx[i] * dt; y[i] += vy[i] * dt; z[i] += vz[i] * dt; }
  }
  if (tr) st.trace.push(tr);
  if (!doPost) return;
  st.t += dt;
}
/** 残余トルクの角速度の増分 ΔΩ を自転(s と軸)へ。軸に平行な分は s へ(2D の spin += accS と同じ演算)・垂直の分は spinPolicy で。 */
function applySpin3(st, i, dsx, dsy, dsz, Ii) {
  if (dsx === 0 && dsy === 0 && dsz === 0) return;
  const ax = st.sax[i], ay = st.say[i], az = st.saz[i];
  const dpar = dsx * ax + dsy * ay + dsz * az;
  const px = dsx - dpar * ax, py = dsy - dpar * ay, pz = dsz - dpar * az;
  if (px === 0 && py === 0 && pz === 0) { st.spin[i] += dpar; return; }
  if (st.spinPolicy === 'parallel') {
    st.spin[i] += dpar; const L = st.ledger; L.spinPerpLx += Ii * px; L.spinPerpLy += Ii * py; L.spinPerpLz += Ii * pz; return;
  }
  const s = st.spin[i], Ox = s * ax + dsx, Oy = s * ay + dsy, Oz = s * az + dsz, mag = Math.sqrt(Ox * Ox + Oy * Oy + Oz * Oz);
  if (!(mag > 0)) { st.spin[i] = 0; return; }
  const sg = (Ox * ax + Oy * ay + Oz * az) < 0 ? -1 : 1;
  st.spin[i] = sg * mag; st.sax[i] = sg * Ox / mag; st.say[i] = sg * Oy / mag; st.saz[i] = sg * Oz / mag; st.ledger.axisTurnN++;
}

/* ───────── 試験の道具(状態の回転・保存量・差)───────── */
/** 軸 k(単位でなくてよい)のまわりの角 a の回転行列(行優先 9)。 */
export function rotMat(k, a) {
  const nn = Math.hypot(k[0], k[1], k[2]), ux = k[0] / nn, uy = k[1] / nn, uz = k[2] / nn, c = Math.cos(a), s = Math.sin(a), C = 1 - c;
  return [c + ux * ux * C, ux * uy * C - uz * s, ux * uz * C + uy * s, uy * ux * C + uz * s, c + uy * uy * C, uy * uz * C - ux * s, uz * ux * C - uy * s, uz * uy * C + ux * s, c + uz * uz * C];
}
export function mv3(M, v) { return [M[0] * v[0] + M[1] * v[1] + M[2] * v[2], M[3] * v[0] + M[4] * v[1] + M[5] * v[2], M[6] * v[0] + M[7] * v[1] + M[8] * v[2]]; }
/** 状態を回転 M で回す(位置・速度・u の履歴・軸・口座のベクトル —— s は回転のスカラー)。 */
export function rotateState(st, M) {
  const o = cloneState(st);
  const tri = [['x', 'y', 'z'], ['vx', 'vy', 'vz'], ['uPx', 'uPy', 'uPz'], ['sax', 'say', 'saz']];
  if (st.carVx) tri.push(['carVx', 'carVy', 'carVz']);
  for (let i = 0; i < st.n; i++) for (const [a, b, c] of tri) { const r = mv3(M, [st[a][i], st[b][i], st[c][i]]); o[a][i] = r[0]; o[b][i] = r[1]; o[c][i] = r[2]; }
  for (const k of ['resP', 'resL', 'conP', 'conL', 'spinPerpL']) { const r = mv3(M, [st.ledger[k + 'x'], st.ledger[k + 'y'], st.ledger[k + 'z']]); o.ledger[k + 'x'] = r[0]; o.ledger[k + 'y'] = r[1]; o.ledger[k + 'z'] = r[2]; }
  return o;
}
/** 全運動量・全角運動量(軌道 + 自転 I s â + リザーバ + 拘束 + 垂直の口座)と運動エネルギー。 */
export function totals3(st) {
  const L = st.ledger;
  let Px = 0, Py = 0, Pz = 0, Lx = 0, Ly = 0, Lz = 0, K = 0, Ks = 0;
  for (let i = 0; i < st.n; i++) {
    const m = st.m[i], I = 0.5 * m * st.R[i] * st.R[i], s = st.spin[i];
    Px += m * st.vx[i]; Py += m * st.vy[i]; Pz += m * st.vz[i];
    Lx += m * (st.y[i] * st.vz[i] - st.z[i] * st.vy[i]) + I * s * st.sax[i];
    Ly += m * (st.z[i] * st.vx[i] - st.x[i] * st.vz[i]) + I * s * st.say[i];
    Lz += m * (st.x[i] * st.vy[i] - st.y[i] * st.vx[i]) + I * s * st.saz[i];
    K += 0.5 * m * (st.vx[i] * st.vx[i] + st.vy[i] * st.vy[i] + st.vz[i] * st.vz[i]); Ks += 0.5 * I * s * s;
  }
  const P = [Px + L.resPx + L.conPx, Py + L.resPy + L.conPy, Pz + L.resPz + L.conPz];
  const Lt = [Lx + L.resLx + L.conLx + L.spinPerpLx, Ly + L.resLy + L.conLy + L.spinPerpLy, Lz + L.resLz + L.conLz + L.spinPerpLz];
  return { P, L: Lt, K, Ks, Pfree: [Px, Py, Pz], Lfree: [Lx, Ly, Lz] };
}
/** 相対の差(a と b が両方 0 なら 0)。 */
export function relDiff(a, b) { if (a === b) return 0; const s = Math.max(Math.abs(a), Math.abs(b)); return s > 0 ? Math.abs(a - b) / s : 0; }
/** 配列どうしの差: 最大の絶対差・尺度(配列の最大の絶対値)に対する相対差・異なる要素の数。 */
export function arrDiff(a, b) {
  let mx = 0, sc = 0, nd = 0;
  for (let i = 0; i < a.length; i++) { const d = Math.abs(a[i] - b[i]); if (d > mx) mx = d; sc = Math.max(sc, Math.abs(a[i]), Math.abs(b[i])); if (!(a[i] === b[i])) nd++; }
  return { maxAbs: mx, rel: sc > 0 ? mx / sc : 0, nDiff: nd };
}

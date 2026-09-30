// 第288便e(原仮定者の裁定(第78報)⑦「DFM 版ブラックホールは自転軸が公転面に対し 90° 倒れた状態・銀河に対する引きずりは歳差回転が担う・
// 多層化が簡単なら多層化」・統括の検証項目 R117)—— **歳差が担う面内の引きずりの候補**を測る純関数(エンジン未接続・html を読まない)。
//
// ■ 何を置くか(すべて**候補の診断量**。既存の場 u に足さない —— 器 tests/exp-w288e-tilt90.mjs が比較器で並べるだけ)
//   ① 回転核(rotlet 型)u = β J×d / s^{3/2}(d = r − r_src・s = |d|² + ε²・β = G/c² —— J が物理的角運動量なら β の単位は L/M)。
//      **面内の J と面内の d では J×d は z を向く**(面内成分は厳密に 0 —— 1 層・z=0 の対照)。
//   ② **有限厚さの立体核**: 中心のコアを半径 R_c・半高 h の一様な円柱と宣言し、z 方向に N 枚の等質量の層(層の中心
//      z_k = −h + (k+½)·2h/N)へ分ける。各層は自転の角運動量 J_s/N(軸 n = 面内)と、歳差 Ω_p で z 軸まわりに回ることで
//      持つ角運動量 J_z,k = I_⊥,k Ω_p sin²θ(θ=90° —— I_⊥,k = ½(M_c/N)R_c²: 層を z 軸まわりに回す慣性)を運ぶ。
//      中央面(z=0)の点で (a) 自転の部分の面内成分(上下の層で z_k の符号が逆 → 和が消える)・(b) 歳差の部分の面内成分
//      (J_z ẑ × d は面内 —— 消えない)を分けて評価する。
//   ③ **z 微分の解析評価**: 自転の部分の面内成分の ∂/∂z(z=0)= β Σ_k (J_s/N)(n_y, −n_x)[s_k^{−3/2} − 3 z_k² s_k^{−5/2}]
//      —— 方向は円盤全体で一様(−ẑ×n)なので、環の方位平均の u_φ 射影は 0(ワープ型のずれで、回転ではない)。
//   ④ **層数の収束**: N = 1(z=0 の 1 点)・2・4・8・16・32 で ② の歳差の部分の環平均 u_φ の相対変化。
//   ⑤ **歳差 Ω_p の対照**: 0・宣言値・2 倍 —— 0 で面内は厳密に 0・2 倍で 2 倍(線形)。
//   ⑥ **多層の換算式の候補**(閉じた式): 剛体の L_z = I_∥ ω_s cosθ + I_⊥ Ω_p sin²θ(ω_s = ψ̇ + φ̇cosθ は対称軸まわりの自転)を層ごとに足した
//      J_z,eff = Σ_k (I_∥,k ω_k cosθ_k + I_⊥,k Ω_p,k sin²θ_k) と、それを読み手の慣性 I_read = ½ m R² で割った**等価な殻スピン** s_eff。
//      θ=90° では J_z,eff = Σ I_⊥,k Ω_p,k(自転は L_z に入らない —— 引きずりの候補は歳差だけが担う)。
//      **既存の |J|²/(2I) と足して二重に数えない**(E_rot の剛体対照 ½I_∥ω_s² + ½I_⊥(θ̇² + φ̇² sin²θ) は別の欄)。
//
// ■ 数値: 冪は `**`/Math.pow を使わず積で書く(実行環境で Math.pow が 1 ulp 違っても表が変わらない —— tests/README §1)。
// ■ しないこと・言わないこと
//   ・エンジンに接続しない・既存の場(E6′・場の契約の e6 項)に足さない・法則へ昇格しない。β・h・I_⊥ は**宣言**で DFM から導出した値ではない。
//   ・「引きずりが戻った」「90° で銀河を回した」とは書かない。2D の面内の流れを「渦伸長」と呼ばない。
export const TILT90_LIB_VERSION = 'w288e-tilt90-1';

/** 宣言(🛸 の中心コアと同じ値 —— 器が html の宣言と照合する)。 */
export const DECL = Object.freeze({
  G: 0.8, c: 30,                    // 🌚 の physics(β = G/c² —— 単位 L/M の宣言)
  Mc: 750, Rc: 7.5, omegaCore: 16,  // コア: massFrac 0.3 × m 2500・半径 7.5・Ω 16(|J| = ½ M_c R_c² Ω = 337500 = 🌚 の殻 ½·2500·15²·1.2)
  tiltDeg: 90, azimuthDeg: 0,
  omegaP: 0.12,                     // 歳差 Ω_p [rad/時間](宣言 —— DFM から導出した値ではない・銀河の観測は無い)
  halfHeightOverRc: 1,              // 立体核の円柱の半高 h = R_c(宣言)
  eps: 3,                           // 🌚 のソフトニング
  mRead: 2500, Rread: 15,           // 場の契約の読み手が自転を読む中心(本体の質量・半径)
});
export const LAYER_COUNTS = Object.freeze([1, 2, 4, 8, 16, 32]);
export const OMEGA_P_SCALES = Object.freeze([0, 1, 2]);   // Ω_p = 0・宣言値・2 倍
export const RADII = Object.freeze([20, 40, 80, 120, 240, 480]);
export const NAZ = 64;

const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

/** 宣言から派生する量(閉じた式)。 */
export function derived(d = DECL) {
  const beta = d.G / (d.c * d.c);
  const Ic = 0.5 * d.Mc * d.Rc * d.Rc;               // エンジンのコア慣性の規約(½ M_c R_c²・ζ=1)
  const Js = Ic * d.omegaCore;                       // 自転の角運動量 |J|
  const h = d.halfHeightOverRc * d.Rc;
  const Iread = 0.5 * d.mRead * d.Rread * d.Rread;
  return { beta, Ic, Js, h, Iread };
}

/** 層の中心(等質量・等厚)。N=1 は z=0 の 1 点(厚さなしの対照)。 */
export function layerZ(N, h) {
  if (N === 1) return [0];
  const z = [];
  for (let k = 0; k < N; k++) z.push(-h + (k + 0.5) * 2 * h / N);
  return z;
}

/**
 * 立体核を 1 点 (x, y, zp) で評価する。返り値: 自転の部分 uS(3 成分)・歳差の部分 uP(3 成分)・層ごとの自転の面内の大きさの最大。
 * @param {{x:number,y:number,zp?:number,N:number,phi:number,omegaP:number,thetaDeg?:number}} o
 */
export function stackKernel(o, d = DECL) {
  const { beta, Ic, Js, h } = derived(d);
  const th = ((o.thetaDeg === undefined) ? d.tiltDeg : o.thetaDeg) * Math.PI / 180;
  const n = [Math.sin(th) * Math.cos(o.phi), Math.sin(th) * Math.sin(o.phi), Math.cos(th)];
  const zs = layerZ(o.N, h), zp = o.zp || 0, e2 = d.eps * d.eps;
  const Jsk = Js / o.N, Jzk = (Ic / o.N) * o.omegaP * Math.sin(th) * Math.sin(th);
  const uS = [0, 0, 0], uP = [0, 0, 0];
  let perLayerMax = 0;
  for (const zk of zs) {
    const dv = [o.x, o.y, zp - zk], s = dv[0] * dv[0] + dv[1] * dv[1] + dv[2] * dv[2] + e2, k3 = beta / (s * Math.sqrt(s));
    const cs = cross([Jsk * n[0], Jsk * n[1], Jsk * n[2]], dv);
    const cp = cross([0, 0, Jzk], dv);
    for (let a = 0; a < 3; a++) { uS[a] += k3 * cs[a]; uP[a] += k3 * cp[a]; }
    perLayerMax = Math.max(perLayerMax, Math.hypot(k3 * cs[0], k3 * cs[1]));
  }
  return { uS, uP, perLayerMax };
}

/** 自転の部分の面内成分の ∂/∂z(解析式・点 (x,y,0))。 */
export function dzSpinInPlane(o, d = DECL) {
  const { beta, Js, h } = derived(d);
  const th = ((o.thetaDeg === undefined) ? d.tiltDeg : o.thetaDeg) * Math.PI / 180;
  const nx = Math.sin(th) * Math.cos(o.phi), ny = Math.sin(th) * Math.sin(o.phi);
  const zs = layerZ(o.N, h), e2 = d.eps * d.eps, Jsk = Js / o.N;
  let f = 0;
  for (const zk of zs) { const s = o.x * o.x + o.y * o.y + zk * zk + e2; f += Jsk * (1 / (s * Math.sqrt(s)) - 3 * zk * zk / (s * s * Math.sqrt(s))); }
  return [beta * ny * f, -beta * nx * f];
}

/** 半径 r の環(方位 NAZ 点)の平均: u_φ・u_r・面内 rms・z の rms(自転/歳差を分けて)。 */
export function ringStats(r, N, phi, omegaP, d = DECL, zp = 0) {
  let sPhi = 0, sR = 0, sIn2 = 0, sZ2 = 0, pPhi = 0, pR = 0, pIn2 = 0, pZ2 = 0, perMax = 0, dzPhi = 0, dzMag = 0;
  for (let a = 0; a < NAZ; a++) {
    const t = 2 * Math.PI * a / NAZ, ex = Math.cos(t), ey = Math.sin(t), x = r * ex, y = r * ey;
    const k = stackKernel({ x, y, zp, N, phi, omegaP }, d);
    sPhi += -k.uS[0] * ey + k.uS[1] * ex; sR += k.uS[0] * ex + k.uS[1] * ey; sIn2 += k.uS[0] * k.uS[0] + k.uS[1] * k.uS[1]; sZ2 += k.uS[2] * k.uS[2];
    pPhi += -k.uP[0] * ey + k.uP[1] * ex; pR += k.uP[0] * ex + k.uP[1] * ey; pIn2 += k.uP[0] * k.uP[0] + k.uP[1] * k.uP[1]; pZ2 += k.uP[2] * k.uP[2];
    perMax = Math.max(perMax, k.perLayerMax);
    if (zp === 0) { const g = dzSpinInPlane({ x, y, N, phi }, d); dzPhi += -g[0] * ey + g[1] * ex; dzMag = Math.max(dzMag, Math.hypot(g[0], g[1])); }
  }
  return { r, N, spin: { uPhi: sPhi / NAZ, uR: sR / NAZ, rmsIn: Math.sqrt(sIn2 / NAZ), rmsZ: Math.sqrt(sZ2 / NAZ), perLayerMax: perMax },
    prec: { uPhi: pPhi / NAZ, uR: pR / NAZ, rmsIn: Math.sqrt(pIn2 / NAZ), rmsZ: Math.sqrt(pZ2 / NAZ) },
    dz: (zp === 0) ? { uPhiMean: dzPhi / NAZ, maxMag: dzMag } : null };
}

/**
 * 多層の換算式の候補: 層 [{Ipar, Iperp, omega, omegaP, thetaDeg}] → J_z,eff と、読み手の慣性で割った等価な殻スピン s_eff。
 * 剛体の L_z = I_∥ ω_s cosθ + I_⊥ Ω_p sin²θ を層ごとに足す(θ=90° では自転の項は 0)。
 */
export function precessionToZ(layers, Iread) {
  let Jz = 0, Jspin = 0, Jprec = 0;
  for (const L of layers) {
    const th = L.thetaDeg * Math.PI / 180, c = Math.cos(th), s = Math.sin(th);
    const a = L.Ipar * L.omega * c, b = L.Iperp * L.omegaP * s * s;
    Jspin += a; Jprec += b; Jz += a + b;
  }
  return { Jz, Jspin, Jprec, sEff: Jz / Iread };
}

/** 剛体の回転エネルギーの対照(歳差 φ̇ = Ω_p・章動 θ̇ = 0): ½I_∥ω_s² + ½I_⊥Ω_p² sin²θ。 */
export function rigidEnergy(L) {
  const s = Math.sin(L.thetaDeg * Math.PI / 180);
  return 0.5 * L.Ipar * L.omega * L.omega + 0.5 * L.Iperp * L.omegaP * L.omegaP * s * s;
}

/** 候補の表(器が正本に書く)。 */
export function candidateTables(d = DECL) {
  const D = derived(d), phi0 = d.azimuthDeg * Math.PI / 180;
  const rel = (a, b) => (a === b) ? 0 : Math.abs(a - b) / Math.max(Math.abs(a), Math.abs(b), 1e-300);
  // ① 1 層(z=0)の対照 —— 面内成分は厳密に 0
  const single = RADII.map((r) => { const k = ringStats(r, 1, phi0, d.omegaP, d); return { r, spinInPlaneRms: k.spin.rmsIn, spinZRms: k.spin.rmsZ }; });
  // ②③④ 層数の収束(宣言の Ω_p)
  const layers = LAYER_COUNTS.map((N) => ({ N, rows: RADII.map((r) => ringStats(r, N, phi0, d.omegaP, d)) }));
  const conv = [];
  for (let i = 1; i < layers.length; i++) {
    const a = layers[i - 1], b = layers[i];
    conv.push({ from: a.N, to: b.N, precUPhiRelMax: Math.max(...b.rows.map((z, j) => rel(z.prec.uPhi, a.rows[j].prec.uPhi))) });
  }
  // N=1 は層が 1 つ(z=0)なので「上下で消える」比は定義しない(null)—— 面内の残りは cos 90° の丸め(6.1e-17)の z 成分だけ
  const spinCancel = layers.map((L) => ({ N: L.N, sumOverPerLayerMax: (L.N === 1) ? null : Math.max(...L.rows.map((z) => (z.spin.perLayerMax > 0) ? z.spin.rmsIn / z.spin.perLayerMax : 0)),
    perLayerMax: Math.max(...L.rows.map((z) => z.spin.perLayerMax)), dzUPhiMeanAbsMax: Math.max(...L.rows.map((z) => Math.abs(z.dz.uPhiMean))),
    dzMagMax: Math.max(...L.rows.map((z) => z.dz.maxMag)) }));
  // 中央面の外(zp = ±h/2)では自転の部分の面内成分が奇関数で現れる(上下で符号が逆 —— 厚さの平均で 0)
  const offPlane = RADII.map((r) => { const up = ringStats(r, 8, phi0, d.omegaP, d, D.h / 2), dn = ringStats(r, 8, phi0, d.omegaP, d, -D.h / 2);
    return { r, zp: D.h / 2, spinRmsInUp: up.spin.rmsIn, spinRmsInDown: dn.spin.rmsIn, spinUPhiUp: up.spin.uPhi, spinUPhiDown: dn.spin.uPhi }; });
  // ⑤ Ω_p の対照(N=8)
  const omegaP = OMEGA_P_SCALES.map((f) => ({ scale: f, omegaP: f * d.omegaP, rows: RADII.map((r) => { const k = ringStats(r, 8, phi0, f * d.omegaP, d); return { r, precUPhi: k.prec.uPhi, spinRmsIn: k.spin.rmsIn }; }) }));
  const lin = omegaP[2].rows.map((z, j) => (omegaP[1].rows[j].precUPhi !== 0) ? z.precUPhi / omegaP[1].rows[j].precUPhi : null);
  // 解析の z 微分と有限差分の照合(N=8・r=40・方位 0)
  const hh = 1e-4, pt = { x: 40, y: 0, N: 8, phi: phi0, omegaP: d.omegaP };
  const kp = stackKernel(Object.assign({}, pt, { zp: hh }), d), km = stackKernel(Object.assign({}, pt, { zp: -hh }), d);
  const fd = [(kp.uS[0] - km.uS[0]) / (2 * hh), (kp.uS[1] - km.uS[1]) / (2 * hh)], an = dzSpinInPlane(pt, d);
  const dzCheckRel = Math.max(rel(fd[0], an[0]), rel(fd[1], an[1]));
  // ⑥ 換算式の候補(宣言のコアだけが歳差する / 仮に本体全体が同じ Ω_p で歳差したら)
  const core = (f) => [{ Ipar: D.Ic, Iperp: D.Ic, omega: d.omegaCore, omegaP: f * d.omegaP, thetaDeg: d.tiltDeg }];
  const whole = (f) => [{ Ipar: D.Iread, Iperp: D.Iread, omega: D.Js / D.Iread, omegaP: f * d.omegaP, thetaDeg: d.tiltDeg }];
  const toZ = OMEGA_P_SCALES.map((f) => ({ scale: f, omegaP: f * d.omegaP, core: precessionToZ(core(f), D.Iread), wholeBody: precessionToZ(whole(f), D.Iread),
    Erot: rigidEnergy(core(f)[0]) }));
  // 多層(⚫ の差動コアの層の形 —— コア + 殻の 2 層)の例: 殻は歳差しない(Ω_p=0)・自転 0 → 殻は L_z に入らない
  const twoShell = precessionToZ([{ Ipar: D.Ic, Iperp: D.Ic, omega: d.omegaCore, omegaP: d.omegaP, thetaDeg: d.tiltDeg },
    { Ipar: D.Iread - D.Ic, Iperp: D.Iread - D.Ic, omega: 0, omegaP: 0, thetaDeg: 0 }], D.Iread);
  return { version: TILT90_LIB_VERSION, decl: d, derived: D, radii: RADII, nAz: NAZ, single, layers, conv, spinCancel, offPlane, omegaP, linear2x: lin,
    dzCheck: { point: pt, fd, analytic: an, rel: dzCheckRel }, toZ, twoShell };
}

/** 単体試験(器と QA が呼ぶ)。 */
export function selfTest() {
  const T = candidateTables();
  const checks = {};
  // 面内の J・面内の d → 面内成分は z 成分の 1e-15 以下(残りは cos 90° = 6.1e-17 の丸めが作る J_z の分だけ)
  checks.singleZero = T.single.every((z) => z.spinInPlaneRms <= 1e-15 * z.spinZRms && z.spinZRms > 0);
  checks.spinCancels = T.spinCancel.filter((z) => z.N > 1).every((z) => z.sumOverPerLayerMax <= 1e-12);   // 上下の層で消える(丸めの範囲)
  checks.perLayerNonzero = T.spinCancel.filter((z) => z.N > 1).every((z) => z.perLayerMax > 0);             // 層ごとには 0 でない
  checks.dzRingMeanZero = T.spinCancel.every((z) => z.dzUPhiMeanAbsMax <= 1e-12 * Math.max(z.dzMagMax, 1e-300));
  checks.dzAnalytic = T.dzCheck.rel <= 1e-6;
  checks.precNonzero = T.layers.every((L) => L.rows.every((z) => z.prec.uPhi > 0));
  checks.omega0Zero = T.omegaP[0].rows.every((z) => z.precUPhi === 0);
  checks.linear = T.linear2x.every((x) => x !== null && Math.abs(x - 2) <= 1e-12);
  checks.converges = T.conv.slice(1).every((z, i) => z.precUPhiRelMax <= T.conv[i].precUPhiRelMax) && T.conv[T.conv.length - 1].precUPhiRelMax < 1e-3;
  checks.oddOffPlane = T.offPlane.every((z) => Math.abs(z.spinRmsInUp - z.spinRmsInDown) <= 1e-12 * Math.max(z.spinRmsInUp, 1e-300) && z.spinRmsInUp > 0);
  const D = T.derived;
  checks.toZ90 = T.toZ.every((z) => Math.abs(z.core.Jspin) <= 1e-9 * D.Js && Math.abs(z.core.Jprec - D.Ic * z.omegaP) <= 1e-12 * Math.max(D.Ic * z.omegaP, 1));
  checks.toZupright = (() => { const r = precessionToZ([{ Ipar: D.Ic, Iperp: D.Ic, omega: 16, omegaP: 0.12, thetaDeg: 0 }], D.Iread); return Math.abs(r.Jz - D.Ic * 16) <= 1e-12 * D.Ic * 16; })();
  return { version: TILT90_LIB_VERSION, ok: Object.values(checks).every(Boolean), checks };
}

// ===== エンジンの状態から読む診断(器が使う —— S を読むだけで書かない)=====
/** 場の契約の瞬時のトイ加速度(dfmGeoToySpinStep と同じ式・同じ源の加速度 —— 第287便a の器の写し。dragR を宣言しない本だけ)。 */
export function toyAccel(HP, S) {
  const p = S.params, n = S.n, cf = p.spaceMesh || {};
  const pw = HP.frameWeightPow(p), eps = p.softening, G = p.G;
  const D0p = HP.frameWeightIsPull(p) ? ((p.D0pull !== undefined) ? p.D0pull : p.D0) : p.D0;
  const BD = [];
  for (let i = 0; i < n; i++) BD.push({ id: i, m: S.m[i], x: S.x[i], y: S.y[i], vx: S.vx[i], vy: S.vy[i], ax: 0, ay: 0,
    spin: S.spin[i], R: S.R[i], omegaDot: 0, pinned: (S.pinned[i] === 1) });
  for (let i = 0; i < n; i++) {
    if (S.pinned[i]) continue;
    const f = HP.dfmField(BD, S.x[i], S.y[i], { excludeBodyId: i, need: 'gravity', G, eps, p: pw, D0: D0p, background: 'static', energyContract: 'toy' });
    BD[i].ax = f.gravity[0]; BD[i].ay = f.gravity[1];
  }
  const wDecl = (cf.D0 !== undefined && cf.D0 !== null);
  const C = { p: pw, eps, Wbg: wDecl ? cf.D0 : D0p, WbgFrom: wDecl ? 'declared' : 'D0', sources: 'all', velocity: 'v', spin: 'e6', spinSources: 'center', q: p.q,
    fit: 'mean', background: 'static', need: 'uBt', excludeBodyId: 0 };
  const eta = (cf.toyGain === undefined) ? 1 : cf.toyGain;
  const ax = new Float64Array(n), ay = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    if (S.pinned[i]) continue;
    C.excludeBodyId = i;
    const f = HP.dfmFieldContract(BD, S.x[i], S.y[i], C);
    if (!f) continue;
    const ubx = eta * f.u[0], uby = eta * f.u[1];
    const gxx = eta * f.gradU[0], gxy = eta * f.gradU[1], gyx = eta * f.gradU[2], gyy = eta * f.gradU[3];
    const tux = eta * f.dUdt[0], tuy = eta * f.dUdt[1];
    const vxi = S.vx[i], vyi = S.vy[i], rlx = vxi - ubx, rly = vyi - uby;
    ax[i] = tux + gxx * vxi + gxy * vyi - (gxx * rlx + gyx * rly);
    ay[i] = tuy + gyx * vxi + gyy * vyi - (gxy * rlx + gyy * rly);
  }
  return { ax, ay, BD, contract: C };
}
/** E4 の重力加速度(軟化 ε・全源・自己除外)。 */
export function gravAccel(S) {
  const n = S.n, G = S.params.G, e2 = S.params.softening * S.params.softening, ax = new Float64Array(n), ay = new Float64Array(n);
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    const dx = S.x[j] - S.x[i], dy = S.y[j] - S.y[i], d2 = dx * dx + dy * dy + e2, w = G / (d2 * Math.sqrt(d2));
    ax[i] += w * S.m[j] * dx; ay[i] += w * S.m[j] * dy; ax[j] -= w * S.m[i] * dx; ay[j] -= w * S.m[i] * dy;
  }
  return { ax, ay };
}
/** 銀河スケールの η_mesh の bin(中心 ic のまわり・符号つき・+ は外向き)。 */
export const ETA_BINS = Object.freeze([[0, 20], [20, 40], [40, 80], [80, 120], [120, 240], [240, 480]]);
export function etaMesh(HP, S, ic) {
  const g = gravAccel(S), t = toyAccel(HP, S), cx = S.x[ic], cy = S.y[ic];
  return ETA_BINS.map(([r0, r1]) => {
    let n = 0, M = 0, agr = 0, amr = 0, amp = 0;
    for (let i = 0; i < S.n; i++) {
      if (i === ic) continue;
      const dx = S.x[i] - cx, dy = S.y[i] - cy, r = Math.hypot(dx, dy);
      if (!(r >= r0 && r < r1) || !(r > 0)) continue;
      const ex = dx / r, ey = dy / r, m = S.m[i];
      n++; M += m; agr += m * (g.ax[i] * ex + g.ay[i] * ey); amr += m * (t.ax[i] * ex + t.ay[i] * ey); amp += m * (-t.ax[i] * ey + t.ay[i] * ex);
    }
    if (!n) return { r0, r1, n: 0, eta: null };
    return { r0, r1, n, aGr: agr / M, aMeshR: amr / M, aMeshPhi: amp / M, eta: (Math.abs(agr) > 0) ? (amr / M) / Math.abs(agr / M) : null };
  });
}

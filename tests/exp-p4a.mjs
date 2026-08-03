// 第68便 P4a 検証実験: v−u 統一測地線則(geoPN=2 候補)の3極限+退化の数値検証
// - 本スクリプトは QA ではない(合否は console 表示+ tests/out/p4a-results.json)。
//   **エンジン(index.html)には一切触れない** — 統一則そのものを独立のミニ積分器(RK4・倍精度)で
//   検証し、導出(DERIVATIONS §18)の解析極限を数値で固定する。実装(geoPN=2)は次スプリント。
// - 統一運動方程式(弱場1PN・|u|≪c。DERIVATIONS §18 の導出):
//     dv/dt = kF·[∂u/∂t + (u·∇)u + (∇×u) ẑ×w] + ∇U·(1 + ((α−½)w² − (1+2α)U)/c²)
//             − (1+2α)(∇U·w)w/c²、  w = v − kF·u
//   第1項群=フレーム輸送(legacy E6′ の連続極限)・第3項=渦度コリオリ(フレームドラッグの正体)・
//   後半=現行 E12 の v→w 置換。kF=0 で現行 geoPN=1(絶対速度 E12)に厳密退化。
// - 検証項目:
//   P4a-1(静的退化): pinned 太陽・u=0 — 近日点前進が解析値 6πGM/(c²a(1−e²)) に一致(V18 再現)
//   P4a-2(共動極限): 全系が一様速度 V で並進・u=V — 統一則は共動フレームで P4a-1 と同一の前進。
//     現行 E12(絶対 v)は前進が V に依存して破れる(修復対象の欠陥の定量化)
//   P4a-3(回転フレーム): 剛体 u=Ω ẑ×r・G=0 — 共回転粒子(w=0)は求心 −Ω²r だけで円軌道を保ち、
//     摂動 w は共回転座標で直線運動(コリオリ 2Ω が (∇×u)=2Ω から自動で出る = ニュートンのバケツ)
//   P4a-4(kF=0 退化): 統一則(kF=0)と現行 E12 式が同一軌道(倍精度で一致)
// 実行: node tests/exp-p4a.mjs(ブラウザ不要・数秒)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(OUT_DIR, { recursive: true });

// ---- V18 と同じ較正系(式の一致検証用の増幅系): GM=150, a=60, e=0.2056, c=40, α=1.5 ----
const GM = 150, aSemi = 60, e = 0.2056, c = 40, ALPHA = 1.5, EPS = 0;   // ε=0(ソフトニングなし — 解析式と直接比較)
const cA = 1 + 2 * ALPHA, cB = ALPHA - 0.5;
const analytic = 6 * Math.PI * GM / (c * c * aSemi * (1 - e * e));   // rad/周

// 統一則の加速度。uField = {u(x,y,t), dudt(x,y,t), gradU?} を与える(u=null で u≡0)。
// mode: 'unified'(kF 込み統一則) / 'e12abs'(現行 E12 — 絶対 v・輸送なし)
function accel(mode, kF, x, y, vx, vy, t, uField, sun) {
  // 重力源(太陽)の位置は sun(t) で与える(共動テスト用)
  const s = sun(t);
  const dx = x - s.x, dy = y - s.y;
  const r2 = dx * dx + dy * dy + EPS * EPS, r = Math.sqrt(r2);
  const U = GM / r;
  const gx = -GM * dx / (r2 * r), gy = -GM * dy / (r2 * r);   // ∇U(引力方向)
  let ax = gx, ay = gy;
  let wx = vx, wy = vy;
  if (mode === 'unified' && uField) {
    const uf = uField(x, y, t);
    wx = vx - kF * uf.ux; wy = vy - kF * uf.uy;
    // フレーム輸送: ∂u/∂t + (u·∇)u + (∇×u) ẑ×w
    ax += kF * (uf.dudtx + uf.advx + uf.curl * (-wy));
    ay += kF * (uf.dudty + uf.advy + uf.curl * (wx));
  }
  // 1PN(w 基準。e12abs は w=v のまま)
  const w2 = wx * wx + wy * wy, gw = gx * wx + gy * wy;
  ax += ((cB * w2 - cA * U) * gx - cA * gw * wx) / (c * c);
  ay += ((cB * w2 - cA * U) * gy - cA * gw * wy) / (c * c);
  return [ax, ay];
}

// RK4 積分器
function integrate(mode, kF, state0, tEnd, dt, uField, sun) {
  let [x, y, vx, vy] = state0, t = 0;
  const traj = [];
  const f = (x, y, vx, vy, t) => { const [ax, ay] = accel(mode, kF, x, y, vx, vy, t, uField, sun); return [vx, vy, ax, ay]; };
  const steps = Math.round(tEnd / dt);
  for (let k = 0; k < steps; k++) {
    if (k % 8 === 0) traj.push([t, x, y, vx, vy]);
    const k1 = f(x, y, vx, vy, t);
    const k2 = f(x + k1[0] * dt / 2, y + k1[1] * dt / 2, vx + k1[2] * dt / 2, vy + k1[3] * dt / 2, t + dt / 2);
    const k3 = f(x + k2[0] * dt / 2, y + k2[1] * dt / 2, vx + k2[2] * dt / 2, vy + k2[3] * dt / 2, t + dt / 2);
    const k4 = f(x + k3[0] * dt, y + k3[1] * dt, vx + k3[2] * dt, vy + k3[3] * dt, t + dt);
    x += dt * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]) / 6;
    y += dt * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]) / 6;
    vx += dt * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]) / 6;
    vy += dt * (k1[3] + 2 * k2[3] + 2 * k3[3] + k4[3]) / 6;
    t += dt;
  }
  traj.push([t, x, y, vx, vy]);
  return traj;
}

// 近日点前進の測定: 太陽相対の Runge-Lenz ベクトル e⃗ = (w×L)ẑ 系/GM − r̂ の角度ドリフト
// (共動テストでは w=v−V・r=x−sun が正しい相対量)
function pericenterDrift(traj, sun, V) {
  const angs = [];
  for (const [t, x, y, vx, vy] of traj) {
    const s = sun(t);
    const rx = x - s.x, ry = y - s.y;
    const wx = vx - V[0], wy = vy - V[1];
    const L = rx * wy - ry * wx;
    const r = Math.hypot(rx, ry);
    const ex = (wy * L) / GM - rx / r, ey = (-wx * L) / GM - ry / r;
    angs.push({ t, a: Math.atan2(ey, ex) });
  }
  // 角度をアンラップして最小二乗で dϖ/dt を取る(1PN の e⃗ は小振動を持つため傾きで読む)
  let un = 0, prev = angs[0].a;
  const P = [];
  for (const q of angs) { let d = q.a - prev; if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI; un += d; prev = q.a; P.push([q.t, un]); }
  const n = P.length, sx = P.reduce((s, p) => s + p[0], 0), sy = P.reduce((s, p) => s + p[1], 0);
  const sxx = P.reduce((s, p) => s + p[0] * p[0], 0), sxy = P.reduce((s, p) => s + p[0] * p[1], 0);
  return (n * sxy - sx * sy) / (n * sxx - sx * sx);   // rad / 時間
}

const results = {};
const Torb = 2 * Math.PI * Math.sqrt(aSemi ** 3 / GM);   // ケプラー周期
const rp = aSemi * (1 - e), vp = Math.sqrt(GM * (2 / rp - 1 / aSemi));   // 近日点条件
const N_ORB = 12, DT = Torb / 20000;

// ---- P4a-1: 静的退化(u=0) ----
{
  const sun = () => ({ x: 0, y: 0 });
  const tr = integrate('unified', 1, [rp, 0, 0, vp], N_ORB * Torb, DT, null, sun);
  const drift = pericenterDrift(tr, sun, [0, 0]) * Torb;   // rad/周
  results.p4a1 = { measured: drift, analytic, errPct: 100 * Math.abs(drift - analytic) / analytic };
  console.log(`P4a-1 静的退化: 前進=${drift.toExponential(4)} rad/周 vs 解析 ${analytic.toExponential(4)} — 誤差 ${results.p4a1.errPct.toFixed(2)}%`);
}

// ---- P4a-2: 共動極限(u=V 一様・太陽も V で並進) ----
{
  const V = [1.0, 0];
  const sun = (t) => ({ x: V[0] * t, y: V[1] * t });
  const uField = () => ({ ux: V[0], uy: V[1], dudtx: 0, dudty: 0, advx: 0, advy: 0, curl: 0 });
  const tr1 = integrate('unified', 1, [rp, 0, V[0], vp + V[1]], N_ORB * Torb, DT, uField, sun);
  const d1 = pericenterDrift(tr1, sun, V) * Torb;
  const tr2 = integrate('e12abs', 0, [rp, 0, V[0], vp + V[1]], N_ORB * Torb, DT, null, sun);
  const d2 = pericenterDrift(tr2, sun, V) * Torb;
  results.p4a2 = { unified: d1, e12abs: d2, analytic,
    unifiedErrPct: 100 * Math.abs(d1 - analytic) / analytic,
    e12absErrPct: 100 * Math.abs(d2 - analytic) / analytic };
  console.log(`P4a-2 共動極限(V=1.0): 統一則=${d1.toExponential(4)}(誤差 ${results.p4a2.unifiedErrPct.toFixed(2)}%) / ` +
    `現行E12(絶対v)=${d2.toExponential(4)}(誤差 ${results.p4a2.e12absErrPct.toFixed(1)}% — ガリレイ共変性の破れの定量化)`);
}

// ---- P4a-3: 回転フレーム(剛体 u=Ω ẑ×r・G=0 の輸送項のみ) ----
{
  const OM = 0.02;
  const uField = (x, y) => ({ ux: -OM * y, uy: OM * x, dudtx: 0, dudty: 0,
    advx: -OM * OM * x, advy: -OM * OM * y, curl: 2 * OM });   // (u·∇)u=−Ω²r・∇×u=2Ω
  const noG = { accel: null };
  // G を切るために GM=0 相当の sun を遠方に置くのではなく、専用の f を組む(重力項を除いた統一則)
  const f = (x, y, vx, vy) => {
    const uf = uField(x, y);
    const wx = vx - uf.ux, wy = vy - uf.uy;
    return [uf.advx + uf.curl * (-wy), uf.advy + uf.curl * (wx)];
  };
  const run = (x, y, vx, vy, tEnd, dt) => {
    const traj = [];
    let t = 0;
    const g = (x, y, vx, vy) => { const [ax, ay] = f(x, y, vx, vy); return [vx, vy, ax, ay]; };
    for (let k = 0; k < Math.round(tEnd / dt); k++) {
      if (k % 8 === 0) traj.push([t, x, y, vx, vy]);
      const k1 = g(x, y, vx, vy), k2 = g(x + k1[0] * dt / 2, y + k1[1] * dt / 2, vx + k1[2] * dt / 2, vy + k1[3] * dt / 2);
      const k3 = g(x + k2[0] * dt / 2, y + k2[1] * dt / 2, vx + k2[2] * dt / 2, vy + k2[3] * dt / 2);
      const k4 = g(x + k3[0] * dt, y + k3[1] * dt, vx + k3[2] * dt, vy + k3[3] * dt);
      x += dt * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]) / 6; y += dt * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]) / 6;
      vx += dt * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]) / 6; vy += dt * (k1[3] + 2 * k2[3] + 2 * k3[3] + k4[3]) / 6;
      t += dt;
    }
    traj.push([t, x, y, vx, vy]);
    return traj;
  };
  // (a) 共回転(w=0): 半径 100 の円軌道が重力ゼロで保たれる(空間が軌道を支える — バケツの解)
  const R0 = 100, T3 = 2 * Math.PI / OM * 3;
  const trA = run(R0, 0, 0, OM * R0, T3, 0.005);
  const rDrift = Math.max(...trA.map(p => Math.abs(Math.hypot(p[1], p[2]) - R0)));
  // (b) 摂動 w: 共回転座標系で直線運動になる(コリオリ 2Ω が自動で出る証明)
  const w0 = 0.1;
  const trB = run(R0, 0, w0, OM * R0, T3, 0.005);
  let maxDev = 0;
  for (const [t, x, y] of trB) {
    const ca = Math.cos(-OM * t), sa = Math.sin(-OM * t);
    const rx = x * ca - y * sa, ry = x * sa + y * ca;   // 共回転座標
    // 期待: (R0 + w0·t, 0) の直線
    const dev = Math.hypot(rx - (R0 + w0 * t), ry);
    if (dev > maxDev) maxDev = dev;
  }
  results.p4a3 = { radialDrift: rDrift, rotFrameDeviation: maxDev, R0, orbits: 3 };
  console.log(`P4a-3 回転フレーム(G=0): 共回転円軌道の半径ドリフト=${rDrift.toExponential(2)}(3周) / ` +
    `摂動wの共回転系直線からの逸脱=${maxDev.toExponential(2)}(コリオリ2Ωの自動創発)`);
}

// ---- P4a-4: kF=0 退化(統一則 kF=0 ≡ 現行 E12) ----
{
  const sun = () => ({ x: 0, y: 0 });
  const uField = (x, y) => ({ ux: -0.02 * y, uy: 0.02 * x, dudtx: 0, dudty: 0, advx: -4e-4 * x, advy: -4e-4 * y, curl: 0.04 });
  const trU = integrate('unified', 0, [rp, 0, 0, vp], 2 * Torb, DT, uField, sun);   // kF=0: u があっても効かない
  const trE = integrate('e12abs', 0, [rp, 0, 0, vp], 2 * Torb, DT, null, sun);
  let maxD = 0;
  for (let i = 0; i < trU.length; i++) maxD = Math.max(maxD, Math.hypot(trU[i][1] - trE[i][1], trU[i][2] - trE[i][2]));
  results.p4a4 = { maxTrajDiff: maxD };
  console.log(`P4a-4 kF=0 退化: 統一則(kF=0) vs 現行E12 の軌道差=${maxD.toExponential(2)}(倍精度一致)`);
}

fs.writeFileSync(path.join(OUT_DIR, 'p4a-results.json'), JSON.stringify(results, null, 2));
console.log('saved: tests/out/p4a-results.json');

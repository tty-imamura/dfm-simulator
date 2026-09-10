// 第254便a W1「空間メッシュ本体 ―― 輸送・場・重力と慣性の 2 候補・参照試験・opt-in」(第46報)。
//
// 原仮定者(第46報・全文は docs/PHYSICS.md 〔第254便a〕に**原文のまま**引用):
//   「連星では、『背景決定力 D₀』をゼロに近付けると、空間メッシュが連星の公転に合わせて回転する/
//    空間メッシュの、表示と内部状態は、それぞれ適切なものを選択する。判断出来ない場合は、各案を
//    実装して検証を行う/『決定力場の空間メッシュの勾配で加速する力が重力』/『決定力場の空間
//    メッシュのフレームの時間変化率を維持する力が慣性力』」。
//
// ■ 節(すべて実測。予想は 1 つも書かない)
//   REF : **(a) 参照試験**。全項変換 q̈=F⁻¹{a−C̈−F̈(q−C₀)−2Ḟq̇} が
//         ①往復(x→q→x・v→q̇→v・a→q̈→a)で元の r(t) を 1 ulp で戻すか(🫂・⚡ の実エンジン 200 步)
//         ②独立 RK4 の試験粒子を、慣性系で解いた軌道と**メッシュ座標で解いた軌道**が一致するか
//         **通らなければ (b) opt-in へ進まない**(3 審査 v12 M1)。
//   TR  : **物質線の輸送**。⚡ 実エンジン dt=0.016 × 10000 步で、頂点追従誤差を
//         **幾何整合補間**と**速度補間**の 2 案で実測して比べる。
//   JP  : **判断ポイント**。D0pull を 3 段以上振り、内部状態(Ω_mesh 対 Ω_orbit・χ・輸送線の回転角)と
//         表示(参照ガイド/輸送線)の両方を数値化する。慣性系の周期・近点移動・加速度も同じ表に。
//   INE : **慣性 2 候補**(material/action)を同じ器で比較。OFF 対照・kF0 対照・共通並進つき。
//   OPT : ⚡🧶 に opt-in を当てた A0・近点間 P・Δϖ の表(プリセットは 1 bit も変えない)。
//
// 実行: node tests/exp-w254a-meshforce.mjs [--ref] [--tr] [--jp] [--ine] [--opt] [--fast]
// 出力: tests/out/meshforce-w254.json(.gitignore 既定どおり未コミット ―― 数値は PHYSICS に全載)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'meshforce-w254.json');
const argv = process.argv.slice(2);
const FAST = argv.includes('--fast');
const only = argv.filter((a) => a.startsWith('--') && a !== '--fast').map((a) => a.slice(2));
const want = (k) => !only.length || only.includes(k);

const out = { target: TARGET, node: process.version, at: new Date().toISOString(), wave: '254a', fast: FAST };

// ================================================================ REF-B: 独立 RK4(ブラウザ不要)
// **メッシュ座標の運動方程式が元の運動方程式と同じ軌道を出すか**を、エンジンとは無関係の
// 独立 RK4 で確かめる。2 頂点(相互重力のみ)+ 試験粒子 1 個(2 頂点から重力を受ける)。
//   慣性系  : ẍ = a(x)
//   メッシュ: q̈ = F⁻¹{a − C̈ − F̈(q−C₀) − 2Ḟ q̇}、x=C+F(q−C₀)
// F は r に**線形**([[a,−b],[b,a]]・a=r·r₀/|r₀|²・b=r₀×r/|r₀|²)なので Ḟ=F(w)・F̈=F(ẇ) が厳密に出る。
function refIndependent() {
  const G = 1, eps = 0;
  const m1 = 1, m2 = 1;
  const acc2 = (x1, y1, x2, y2) => {   // 頂点どうしの重力
    const dx = x2 - x1, dy = y2 - y1, s = dx * dx + dy * dy + eps * eps;
    const iv = 1 / Math.sqrt(s), i3 = iv * iv * iv;
    return [G * m2 * dx * i3, G * m2 * dy * i3, -G * m1 * dx * i3, -G * m1 * dy * i3];
  };
  const accT = (px, py, x1, y1, x2, y2) => {   // 試験粒子が受ける重力(質量 0 = 反作用なし)
    let ax = 0, ay = 0;
    for (const [bx, by, bm] of [[x1, y1, m1], [x2, y2, m2]]) {
      const dx = bx - px, dy = by - py, s = dx * dx + dy * dy + eps * eps;
      const iv = 1 / Math.sqrt(s), i3 = iv * iv * iv;
      ax += G * bm * dx * i3; ay += G * bm * dy * i3;
    }
    return [ax, ay];
  };
  // 初期条件: 円に近い連星(r=2・v=±0.35)+ 外側の試験粒子
  const S0 = [-1, 0, 1, 0, 0, -0.35, 0, 0.35, 3.0, 1.0, 0.15, 0.42];
  const r0 = [S0[2] - S0[0], S0[3] - S0[1]], r02 = r0[0] * r0[0] + r0[1] * r0[1];
  const C0 = [(S0[0] + S0[2]) / 2, (S0[1] + S0[3]) / 2];
  const Fof = (vx, vy) => [(vx * r0[0] + vy * r0[1]) / r02, -(r0[0] * vy - r0[1] * vx) / r02,
    (r0[0] * vy - r0[1] * vx) / r02, (vx * r0[0] + vy * r0[1]) / r02];
  // ---- 慣性系の RHS(頂点 4+4、試験粒子 2+2)
  const rhsI = (S) => {
    const [a1x, a1y, a2x, a2y] = acc2(S[0], S[1], S[2], S[3]);
    const [tx, ty] = accT(S[8], S[9], S[0], S[1], S[2], S[3]);
    return [S[4], S[5], S[6], S[7], a1x, a1y, a2x, a2y, S[10], S[11], tx, ty];
  };
  // ---- メッシュ座標の RHS(頂点は慣性系のまま・試験粒子だけ q で解く)
  const rhsM = (S) => {
    const [a1x, a1y, a2x, a2y] = acc2(S[0], S[1], S[2], S[3]);
    const C = [(S[0] + S[2]) / 2, (S[1] + S[3]) / 2];
    const Cd = [(S[4] + S[6]) / 2, (S[5] + S[7]) / 2];
    const Cdd = [(a1x + a2x) / 2, (a1y + a2y) / 2];
    const F = Fof(S[2] - S[0], S[3] - S[1]);
    const Fd = Fof(S[6] - S[4], S[7] - S[5]);
    const Fdd = Fof(a2x - a1x, a2y - a1y);
    const det = F[0] * F[3] - F[1] * F[2];
    const iF = [F[3] / det, -F[1] / det, -F[2] / det, F[0] / det];
    const q = [S[8], S[9]], qd = [S[10], S[11]];
    const ex = q[0] - C0[0], ey = q[1] - C0[1];
    const px = C[0] + F[0] * ex + F[1] * ey, py = C[1] + F[2] * ex + F[3] * ey;
    const [tx, ty] = accT(px, py, S[0], S[1], S[2], S[3]);
    const bx = tx - Cdd[0] - (Fdd[0] * ex + Fdd[1] * ey) - 2 * (Fd[0] * qd[0] + Fd[1] * qd[1]);
    const by = ty - Cdd[1] - (Fdd[2] * ex + Fdd[3] * ey) - 2 * (Fd[2] * qd[0] + Fd[3] * qd[1]);
    return [S[4], S[5], S[6], S[7], a1x, a1y, a2x, a2y,
      qd[0], qd[1], iF[0] * bx + iF[1] * by, iF[2] * bx + iF[3] * by];
  };
  const rk4 = (S, f, h) => {
    const a = f(S), b = f(S.map((v, i) => v + h / 2 * a[i]));
    const c = f(S.map((v, i) => v + h / 2 * b[i])), d = f(S.map((v, i) => v + h * c[i]));
    return S.map((v, i) => v + h / 6 * (a[i] + 2 * b[i] + 2 * c[i] + d[i]));
  };
  const scan = (N, h) => {
  let SI = S0.slice();
  // メッシュ側の初期条件: q=x(捕捉時 F=I・C=C₀)・q̇ = F⁻¹(ẋ−Ċ−Ḟ(q−C₀))
  const Cd0 = [(S0[4] + S0[6]) / 2, (S0[5] + S0[7]) / 2];
  const Fd0 = Fof(S0[6] - S0[4], S0[7] - S0[5]);
  const e0x = S0[8] - C0[0], e0y = S0[9] - C0[1];
  let SM = S0.slice();
  SM[10] = S0[10] - Cd0[0] - (Fd0[0] * e0x + Fd0[1] * e0y);
  SM[11] = S0[11] - Cd0[1] - (Fd0[2] * e0x + Fd0[3] * e0y);
  let maxRel = 0, maxUlp = 0, rows = [];
  for (let k = 0; k < N; k++) {
    SI = rk4(SI, rhsI, h); SM = rk4(SM, rhsM, h);
    const C = [(SM[0] + SM[2]) / 2, (SM[1] + SM[3]) / 2];
    const F = Fof(SM[2] - SM[0], SM[3] - SM[1]);
    const ex = SM[8] - C0[0], ey = SM[9] - C0[1];
    const px = C[0] + F[0] * ex + F[1] * ey, py = C[1] + F[2] * ex + F[3] * ey;
    const e = Math.hypot(px - SI[8], py - SI[9]);
    const sc = Math.hypot(SI[8], SI[9]);
    if (e / sc > maxRel) maxRel = e / sc;
    const ul = e / Math.max(Math.ulp ? Math.ulp(sc) : Number.EPSILON * sc, Number.MIN_VALUE);
    if (ul > maxUlp) maxUlp = ul;
    if (k % 50 === 49) rows.push({ k: k + 1, absErr: e, relErr: e / sc, ulp: ul });
  }
  return { steps: N, h, maxRelErr: maxRel, maxUlp, rows };
  };
  // **同じ物理時間**を刻み 4 段で解く。両定式が連続極限で一致するなら、差は RK4 の打ち切り誤差
  // だけなので **観測次数 ≈4** が出る(定式の食い違いなら次数は 0 に潰れる)。
  const T = 2.0;
  const seq = [0.02, 0.01, 0.005, 0.0025].map((h) => scan(Math.round(T / h), h));
  const ord = seq.slice(1).map((r, i) => Math.log2(seq[i].maxRelErr / r.maxRelErr));
  return { T, seq: seq.map((r) => ({ h: r.h, steps: r.steps, maxRelErr: r.maxRelErr, maxUlp: r.maxUlp })),
    order: ord, at200: scan(200, 0.01) };
}

if (want('ref')) {
  out.refIndependent = refIndependent();
  console.error('REF-B(独立 RK4・慣性系 vs メッシュ座標): 200 步 h=0.01 で相対 '
    + out.refIndependent.at200.maxRelErr.toExponential(4) + ' / 刻み 4 段 '
    + out.refIndependent.seq.map((r) => r.maxRelErr.toExponential(3)).join(' → ')
    + ' → **観測次数 ' + out.refIndependent.order.map((o) => o.toFixed(3)).join('/') + '**');
}

// ================================================================ ブラウザ側
let browser;
try { const { chromium } = await import('playwright'); browser = await chromium.launch(); }
catch {
  const { chromium } = await import('playwright');
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
}
const pg = await browser.newPage();
const pageErrors = [];
pg.on('pageerror', (e) => pageErrors.push(String(e)));
await pg.goto(INDEX, { waitUntil: 'load' });
await pg.waitForFunction(() => window.HP && HP.sim);

await pg.evaluate(() => {
  const W = (window.__w254 = {});
  // ---- 🫂 相当の合成 2 体(第252便a §BOX・第253便a と同一規約)
  W.mkBox = (q, D0pull, extra) => {
    const G = 0.60066, c = 30, e = 0.3, sepA = 200, eps = 0.05;
    const m1 = 1000 / (1 + q), m2 = 1000 * q / (1 + q), M = m1 + m2;
    const a = sepA / (1 + e), muN = G * M;
    const vA = Math.sqrt(muN * (1 - e) / (a * (1 + e)));
    const ph = { G, D0: 0.006, kFrame: 1, q: 3, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, kappaT: 0.0006674,
      cLight: c, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
      geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: eps, timeScale: 60, dispMag: 3,
      stateCarry: 'double', framePrecision: 'double', frameReaction: 'pairReduced',
      frameWeight: 'pull', D0pull };
    Object.assign(ph, extra || {});
    return { pd: { name: 'w254 mesh box', description: 'space mesh force probe', emoji: '🕸',
        camera: { scale: 130 }, world: { boundary: 'none', size: 0 }, physics: ph,
        bodies: [
          { type: 'single', m: m1, radius: 1, x: -sepA * m2 / M, y: 0, vx: 0, vy: -vA * m2 / M, spin: 0, pinned: false, pnSource: true },
          { type: 'single', m: m2, radius: 1, x: sepA * m1 / M, y: 0, vx: 0, vy: vA * m1 / M, spin: 0, pinned: false },
        ],
        overlays: { rotationCurve: false, tempHistogram: false, field: false, trail: true } },
      meta: { m1, m2, M, a, e, sepA, muN, eps, vRel: vA, Pkep: 2 * Math.PI * Math.sqrt(a * a * a / muN) } };
  };
  // ---- 近点解析(第252便a/第253便a と同一手続き)
  W.periFit = (A, rMin, rMax, dt, pRef, NP) => {
    const mid = 0.5 * (rMin + rMax);
    const peri = A.filter((z) => z.r < mid), keep = [];
    for (const z of peri) { if (keep.length && (z.k - keep[keep.length - 1].k) * dt < 0.5 * pRef) continue; keep.push(z); }
    const use = keep.slice(0, NP), ang = [];
    for (let i = 0; i < use.length; i++) {
      let a = use[i].ang;
      if (i) { let z = a - ang[i - 1]; while (z > Math.PI) z -= 2 * Math.PI; while (z < -Math.PI) z += 2 * Math.PI;
        if (Math.abs(z) > Math.PI / 2) break; a = ang[i - 1] + z; }
      ang.push(a);
    }
    let slope = null;
    if (ang.length >= 2) {
      const nA = ang.length, mx = (nA - 1) / 2, my = ang.reduce((a, b) => a + b, 0) / nA;
      let sxy = 0, sxx = 0;
      for (let i = 0; i < nA; i++) { sxy += (i - mx) * (ang[i] - my); sxx += (i - mx) * (i - mx); }
      slope = sxy / sxx;
    }
    const per = []; for (let i = 1; i < use.length; i++) per.push((use[i].k - use[i - 1].k) * dt);
    return { nPeri: ang.length, period: per.length ? per.reduce((a, b) => a + b, 0) / per.length : null,
      advDeg: slope === null ? null : slope * 180 / Math.PI };
  };
  // ---- 走行 1 本(近点・帳簿・メッシュ内部量)。pd は検証器へ通す前のオブジェクト
  W.run = (pd, dt, steps, pRef, NP, opt) => {
    const o = opt || {};
    const p2 = JSON.parse(JSON.stringify(pd));
    if (o.boost) for (const b of p2.bodies) b.vx += o.boost;
    const v = HP.validatePreset(p2);
    if (!v.ok) return { err: (v.errors || []).join('|') };
    const S = HP.sim; S.build(v.preset);
    const anchor = HP.dfmSpaceMeshCapture(S, [0, 1]);
    let tr = null, trV = null;
    if (o.transport) {
      const M0 = HP.dfmSpaceMeshState(anchor, S);
      const pts = [[S.x[0], S.y[0]], [S.x[1], S.y[1]], [M0.origin[0], M0.origin[1]],
        [M0.origin[0] + M0.refRLen, M0.origin[1]], [M0.origin[0], M0.origin[1] + M0.refRLen]];
      tr = HP.dfmMeshTransportBind(S, pts, [[0, 1]], { ids: [0, 1], interpolation: 'geometric' });
      // 比較用の速度補間は**別の tr を手回しで**進める(S に載るのは 1 本だけ)
      trV = HP.dfmMeshTransportCreate(pts, [[0, 1]]);
      trV.anchor = anchor; trV.ids = [0, 1]; trV.interpolation = 'velocity';
      trV.background = 'static'; trV.D0 = null;
      trV.prev = { t: S.t, C: [M0.origin[0], M0.origin[1]], F: M0.F.slice(),
        U: [M0.velocity[0], M0.velocity[1]], B: M0.gradU.slice(), chi: M0.chi };
    }
    const m0 = S.m[0], m1 = S.m[1], Ms = m0 + m1;
    const cmOf = () => [(m0 * S.x[0] + m1 * S.x[1]) / Ms, (m0 * S.y[0] + m1 * S.y[1]) / Ms];
    const cm0 = cmOf();
    const A = [];
    let rd1 = 0, t1 = 0, rMin = Infinity, rMax = -Infinity;
    let chiMin = Infinity, chiMax = -Infinity, accMin = Infinity, accMax = 0;
    let trErrG = 0, trErrV = 0, omMeshMin = Infinity, omMeshMax = -Infinity;
    let omOrbMin = Infinity, omOrbMax = -Infinity, prevW = null, prevT = null;
    let omBlMin = Infinity, omBlMax = -Infinity, chiPMin = Infinity, chiPMax = -Infinity;
    let thMesh = 0, thOrb = 0, thPrev = null;
    const STR = o.stride || 64;
    for (let k = 0; k < steps; k++) {
      S.step(dt);
      if (trV) {  // 速度補間の比較線(S の外で同じ步を進める)
        const Mv = HP.dfmSpaceMeshState(anchor, S);
        const P = trV.prev, h = S.t - P.t;
        if (Mv && h > 0) {
          const C0 = P.C, C1 = Mv.origin, U0 = P.U, B0 = P.B, U1 = Mv.velocity, B1 = Mv.gradU;
          HP.dfmMeshTransportStep(trV, h, (x, y, s) => {
            const w1 = (s === undefined) ? 0 : s, w0 = 1 - w1;
            const ex0 = x - C0[0], ey0 = y - C0[1], ex1 = x - C1[0], ey1 = y - C1[1];
            return { u: [w0 * (U0[0] + B0[0] * ex0 + B0[1] * ey0) + w1 * (U1[0] + B1[0] * ex1 + B1[1] * ey1),
              w0 * (U0[1] + B0[2] * ex0 + B0[3] * ey0) + w1 * (U1[1] + B1[2] * ex1 + B1[3] * ey1)],
            gradU: [w0 * B0[0] + w1 * B1[0], w0 * B0[1] + w1 * B1[1], w0 * B0[2] + w1 * B1[2], w0 * B0[3] + w1 * B1[3]] };
          });
          trV.prev = { t: S.t, C: [C1[0], C1[1]], F: Mv.F.slice(), U: [U1[0], U1[1]], B: B1.slice(), chi: Mv.chi };
        }
      }
      const dx = S.x[1] - S.x[0], dy = S.y[1] - S.y[0];
      const rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
      const dvx = S.vx[1] - S.vx[0], dvy = S.vy[1] - S.vy[0];
      const rd = (dx * dvx + dy * dvy) / rr;
      if (rr < rMin) rMin = rr; if (rr > rMax) rMax = rr;
      if (k >= 1 && rd1 < 0 && rd >= 0) {
        const fr = (rd !== rd1) ? (-rd1 / (rd - rd1)) : 0;
        let a1 = t1, a2 = th; while (a2 - a1 > Math.PI) a2 -= 2 * Math.PI; while (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
        A.push({ ang: a1 + fr * (a2 - a1), k: k - 1 + fr, r: rr });
      }
      // 公転角の積算(慣性系)
      if (thPrev !== null) { let d = th - thPrev; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; thOrb += d; }
      thPrev = th; t1 = th; rd1 = rd;
      if ((k % STR) === (STR - 1)) {
        const M = HP.dfmSpaceMeshState(anchor, S);
        if (M) {
          if (M.chi < chiMin) chiMin = M.chi; if (M.chi > chiMax) chiMax = M.chi;
          const om = M.gradU[2];                       // Ω_mesh = B₁₀(T2 の回転率)
          if (om < omMeshMin) omMeshMin = om; if (om > omMeshMax) omMeshMax = om;
          const oo = (dx * dvy - dy * dvx) / (rr * rr);  // Ω_orbit = (r×w)/r²
          if (oo < omOrbMin) omOrbMin = oo; if (oo > omOrbMax) omOrbMax = oo;
          // **混合場**の回転率 Ω_blend(静止背景に対する χ 混合。∇χ 込み)。プローブ点は C から
          // 参照分離の半分だけ +x へずらした点(頂点ではないので χ の場所依存が効く)
          const pxq = M.origin[0] + 0.5 * M.refRLen, pyq = M.origin[1];
          const bd = [];
          for (let z = 0; z < S.n; z++) bd.push({ m: S.m[z], x: S.x[z], y: S.y[z] });
          const pwq = HP.frameWeightPow(S.params) > 0 ? HP.frameWeightPow(S.params) : 1;
          const fl = HP.dfmMeshScalarField(bd, pxq, pyq, { G: S.params.G, eps: S.params.softening, power: pwq });
          const ex = pxq - M.origin[0], ey = pyq - M.origin[1];
          const un = [M.velocity[0] + M.gradU[0] * ex + M.gradU[1] * ey,
            M.velocity[1] + M.gradU[2] * ex + M.gradU[3] * ey];
          const bl = HP.dfmMeshBlend({ u: un, gradU: M.gradU, dUdt: [0, 0] },
            { u: [0, 0], gradU: [0, 0, 0, 0], dUdt: [0, 0] }, fl.Wpull, fl.gradW, M.D0, 0);
          if (bl) { const ob = (bl.gradU[2] - bl.gradU[1]) / 2;
            if (ob < omBlMin) omBlMin = ob; if (ob > omBlMax) omBlMax = ob;
            if (bl.chi < chiPMin) chiPMin = bl.chi; if (bl.chi > chiPMax) chiPMax = bl.chi; }
        }
        if (prevW !== null) {
          const dtS = S.t - prevT;
          const aa = Math.hypot((dvx - prevW[0]) / dtS, (dvy - prevW[1]) / dtS);
          if (aa > accMax) accMax = aa; if (aa < accMin) accMin = aa;
        }
        prevW = [dvx, dvy]; prevT = S.t;
        if (tr && !tr.error) {
          const e0 = Math.hypot(tr.x[0] - S.x[0], tr.x[1] - S.y[0]);
          const e1 = Math.hypot(tr.x[2] - S.x[1], tr.x[3] - S.y[1]);
          const e = Math.max(e0, e1) / rr; if (e > trErrG) trErrG = e;
        }
        if (trV && !trV.error) {
          const e0 = Math.hypot(trV.x[0] - S.x[0], trV.x[1] - S.y[0]);
          const e1 = Math.hypot(trV.x[2] - S.x[1], trV.x[3] - S.y[1]);
          const e = Math.max(e0, e1) / rr; if (e > trErrV) trErrV = e;
        }
      }
    }
    const cmE = cmOf();
    const fit = W.periFit(A, rMin, rMax, dt, pRef, NP);
    const T = S.totals ? S.totals() : null;
    // 力学エネルギー(2 体の並進+ソフトニング重力。帳簿の比較用に器の中で同じ式を使う)
    const gg = S.params.G, e2 = S.params.softening * S.params.softening;
    const ddx = S.x[1] - S.x[0], ddy = S.y[1] - S.y[0];
    const Emech = 0.5 * S.m[0] * (S.vx[0] ** 2 + S.vy[0] ** 2) + 0.5 * S.m[1] * (S.vx[1] ** 2 + S.vy[1] ** 2)
      - gg * S.m[0] * S.m[1] / Math.sqrt(ddx * ddx + ddy * ddy + e2);
    return { inertial: { ...fit, rMin, rMax, accRelMin: accMin, accRelMax: accMax,
        cmWalk: Math.hypot(cmE[0] - cm0[0], cmE[1] - cm0[1]),
        nan: S.hasNaN(), clamp: S.clampVN + S.clampSN + S.clampRN + S.clampTN + S.clampAN },
      mesh: { chiMin, chiMax, omMeshMin, omMeshMax, omOrbMin, omOrbMax, omBlendMin: omBlMin, omBlendMax: omBlMax, chiProbeMin: chiPMin, chiProbeMax: chiPMax,
        thOrbTotal: thOrb, thMeshTotal: tr ? tr.angle : null,
        trErrGeometric: tr ? trErrG : null, trErrVelocity: trV ? trErrV : null,
        trError: tr ? tr.error : null, trErrorV: trV ? trV.error : null,
        trDetMin: tr ? tr.detMin : null, trDetMax: tr ? tr.detMax : null,
        trSymDev: tr ? tr.symDev : null },
      ledger: { spaceMeshWorkE: S.spaceMeshWorkE, spaceMeshChi: S.spaceMeshChi,
        spaceMeshGravDiff: S.spaceMeshGravDiff, spaceMeshStop: S.spaceMeshStop,
        resPx: S.resPx, resPy: S.resPy, resL: S.resL,
        E: Emech, P: T ? Math.hypot(T.px, T.py) : null, L: T ? T.L : null },
      sig: JSON.stringify(v.preset.physics), state: [S.x[0], S.y[0], S.vx[0], S.vy[0], S.x[1], S.y[1], S.vx[1], S.vy[1]] };
  };
});

// ---------------------------------------------------------------- REF-A: 実エンジンの往復(ulp)
if (want('ref')) {
  out.refRoundTrip = await pg.evaluate(() => {
    const W = window.__w254, res = {};
    const cases = [{ label: '🫂 boxBinaryToy (D0pull=1e-4)', pd: W.mkBox(1, 1e-4).pd, dt: 0.004 },
      { label: '⚡ psrDoubleABDFM', pd: HP.allPresets().find((z) => z.id === 'psrDoubleABDFM'), dt: 0.016 }];
    for (const c of cases) {
      const v = HP.validatePreset(JSON.parse(JSON.stringify(c.pd)));
      const S = HP.sim; S.build(v.preset);
      const A = HP.dfmSpaceMeshCapture(S, [0, 1]);
      const C0 = A.refOrigin, r0 = A.refR, r02 = A.refR2;
      const Fof = (vx, vy) => { const a = (vx * r0[0] + vy * r0[1]) / r02, b = (r0[0] * vy - r0[1] * vx) / r02;
        return [a, -b, b, a]; };
      const G = v.preset.physics.G, eps2 = v.preset.physics.softening ** 2;
      let maxU = 0, maxRel = 0, maxV = 0, maxA = 0, maxRulp = 0, n = 0;
      for (let k = 0; k < 200; k++) {
        S.step(c.dt);
        const x1 = S.x[0], y1 = S.y[0], x2 = S.x[1], y2 = S.y[1];
        const v1 = [S.vx[0], S.vy[0]], v2 = [S.vx[1], S.vy[1]];
        const rx = x2 - x1, ry = y2 - y1, s = rx * rx + ry * ry + eps2;
        const iv = 1 / Math.sqrt(s), i3 = iv * iv * iv;
        const a1 = [G * S.m[1] * rx * i3, G * S.m[1] * ry * i3];
        const a2 = [-G * S.m[0] * rx * i3, -G * S.m[0] * ry * i3];
        const C = [(x1 + x2) / 2, (y1 + y2) / 2];
        const Cd = [(v1[0] + v2[0]) / 2, (v1[1] + v2[1]) / 2];
        const Cdd = [(a1[0] + a2[0]) / 2, (a1[1] + a2[1]) / 2];
        const F = Fof(rx, ry), Fd = Fof(v2[0] - v1[0], v2[1] - v1[1]);
        const Fdd = Fof(a2[0] - a1[0], a2[1] - a1[1]);
        const det = F[0] * F[3] - F[1] * F[2];
        const iF = [F[3] / det, -F[1] / det, -F[2] / det, F[0] / det];
        for (const [px, py, pv, pa] of [[x1, y1, v1, a1], [x2, y2, v2, a2]]) {
          // 前進: x→q・v→q̇・a→q̈(全項変換)
          const dx = px - C[0], dy = py - C[1];
          const qx = C0[0] + iF[0] * dx + iF[1] * dy, qy = C0[1] + iF[2] * dx + iF[3] * dy;
          const ex = qx - C0[0], ey = qy - C0[1];
          const bvx = pv[0] - Cd[0] - (Fd[0] * ex + Fd[1] * ey);
          const bvy = pv[1] - Cd[1] - (Fd[2] * ex + Fd[3] * ey);
          const qdx = iF[0] * bvx + iF[1] * bvy, qdy = iF[2] * bvx + iF[3] * bvy;
          const bax = pa[0] - Cdd[0] - (Fdd[0] * ex + Fdd[1] * ey) - 2 * (Fd[0] * qdx + Fd[1] * qdy);
          const bay = pa[1] - Cdd[1] - (Fdd[2] * ex + Fdd[3] * ey) - 2 * (Fd[2] * qdx + Fd[3] * qdy);
          const qddx = iF[0] * bax + iF[1] * bay, qddy = iF[2] * bax + iF[3] * bay;
          // 逆変換: q→x・q̇→v・q̈→a
          const bx = C[0] + F[0] * ex + F[1] * ey, by = C[1] + F[2] * ex + F[3] * ey;
          const bvx2 = Cd[0] + Fd[0] * ex + Fd[1] * ey + F[0] * qdx + F[1] * qdy;
          const bvy2 = Cd[1] + Fd[2] * ex + Fd[3] * ey + F[2] * qdx + F[3] * qdy;
          const bax2 = Cdd[0] + Fdd[0] * ex + Fdd[1] * ey + 2 * (Fd[0] * qdx + Fd[1] * qdy) + F[0] * qddx + F[1] * qddy;
          const bay2 = Cdd[1] + Fdd[2] * ex + Fdd[3] * ey + 2 * (Fd[2] * qdx + Fd[3] * qdy) + F[2] * qddx + F[3] * qddy;
          const sc = Math.hypot(px, py) || 1;
          const e = Math.hypot(bx - px, by - py);
          if (e / sc > maxRel) maxRel = e / sc;
          const u = e / (Math.abs(sc) * Number.EPSILON); if (u > maxU) maxU = u;
          const ev = Math.hypot(bvx2 - pv[0], bvy2 - pv[1]) / (Math.hypot(pv[0], pv[1]) || 1);
          if (ev > maxV) maxV = ev;
          const ea = Math.hypot(bax2 - pa[0], bay2 - pa[1]) / (Math.hypot(pa[0], pa[1]) || 1);
          if (ea > maxA) maxA = ea;
          n++;
        }
        // r(t) の再構成(メッシュ座標だけから)
        const q1 = A.ref[0], q2 = A.ref[1];
        const d1x = q2[0] - q1[0], d1y = q2[1] - q1[1];
        const rr2 = Math.hypot(F[0] * d1x + F[1] * d1y, F[2] * d1x + F[3] * d1y);
        const rr = Math.hypot(rx, ry);
        const ru = Math.abs(rr2 - rr) / (Math.abs(rr) * Number.EPSILON);
        if (ru > maxRulp) maxRulp = ru;
      }
      res[c.label] = { samples: n, posUlp: maxU, posRel: maxRel, velRel: maxV, accRel: maxA, rUlp: maxRulp };
    }
    return res;
  });
  for (const [k, v] of Object.entries(out.refRoundTrip)) {
    console.error(`REF-A ${k}: 位置往復 ${v.posUlp.toFixed(2)} ulp(相対 ${v.posRel.toExponential(3)})`
      + ` / v ${v.velRel.toExponential(3)} / a ${v.accRel.toExponential(3)} / **r(t) ${v.rUlp.toFixed(2)} ulp**`);
  }
}

// ---------------------------------------------------------------- TR: 物質線の輸送(2 案)
if (want('tr')) {
  out.transport = await pg.evaluate((fast) => {
    const W = window.__w254, res = {};
    const N = fast ? 2000 : 10000;
    const P = HP.allPresets().find((z) => z.id === 'psrDoubleABDFM');
    res['⚡ psrDoubleABDFM dt=0.016'] = W.run(P, 0.016, N, 900, 6, { transport: true, stride: 16 }).mesh;
    const B = W.mkBox(1, 1e-4);
    res['🫂 q=1 D0pull=1e-4 dt=0.004'] = W.run(B.pd, 0.004, fast ? 2000 : 10000, B.meta.Pkep, 6,
      { transport: true, stride: 16 }).mesh;
    return res;
  }, FAST);
  for (const [k, v] of Object.entries(out.transport)) {
    console.error(`TR ${k}: 幾何整合 ${Number(v.trErrGeometric).toExponential(4)} / `
      + `速度補間 ${Number(v.trErrVelocity).toExponential(4)}(相対・頂点追従の最大誤差)`
      + ` det ${Number(v.trDetMin).toExponential(3)}〜${Number(v.trDetMax).toExponential(3)}`);
  }
}

// ---------------------------------------------------------------- JP: 判断ポイント(D0pull 掃引)
if (want('jp')) {
  out.judgment = await pg.evaluate((fast) => {
    const W = window.__w254, rows = [];
    const NS = fast ? 200000 : 2000000;   // t=800 / t=8000(D0pull=1e-6 の P≈1948 でも 4 近点入る)
    for (const D0 of [1e-6, 1e-4, 1e-2, 1, 1e3]) {
      const B = W.mkBox(1, D0);
      const r = W.run(B.pd, 0.004, NS, B.meta.Pkep, 4, { transport: true, stride: 32 });
      rows.push({ D0pull: D0, ...r, Pkep: B.meta.Pkep });
    }
    return rows;
  }, FAST);
  for (const r of out.judgment) {
    const m = r.mesh, i = r.inertial;
    console.error(`JP D0pull=${r.D0pull}: χ=${Number(m.chiMin).toExponential(4)}〜${Number(m.chiMax).toExponential(4)} `
      + `Ω_mesh=${Number(m.omMeshMin).toExponential(3)}〜${Number(m.omMeshMax).toExponential(3)} `
      + `Ω_orb=${Number(m.omOrbMin).toExponential(3)}〜${Number(m.omOrbMax).toExponential(3)} `
      + `Ω_blend=${Number(m.omBlendMin).toExponential(3)}〜${Number(m.omBlendMax).toExponential(3)} `
      + `θ_mesh/θ_orb=${(m.thMeshTotal / m.thOrbTotal).toFixed(9)} nP=${i.nPeri} P=${Number(i.period).toFixed(4)} `
      + `Δϖ=${Number(i.advDeg).toFixed(6)}°/周 |a|=${Number(i.accRelMin).toExponential(2)}〜${Number(i.accRelMax).toExponential(2)}`);
  }
}

// ---------------------------------------------------------------- INE: 慣性 2 候補の比較
if (want('ine')) {
  out.inertia = await pg.evaluate((fast) => {
    const W = window.__w254, rows = [];
    const NS = fast ? 100000 : 1000000;   // t=400 / t=4000(固定時間窓 — 候補ごとに周期が違うので步数を揃える)
    const D0 = 1e-4;                       // クランプ 0 の帯(1e−6 の極は使わない)
    const variants = [
      { label: 'OFF(対照)', sm: null },
      { label: 'gravity のみ', sm: { mode: 'vertex', gravity: true, inertia: false } },
      { label: 'material', sm: { mode: 'vertex', gravity: false, inertia: 'material' } },
      { label: 'action', sm: { mode: 'vertex', gravity: false, inertia: 'action' } },
      { label: 'gravity+material', sm: { mode: 'vertex', gravity: true, inertia: 'material' } },
      { label: 'gravity+action', sm: { mode: 'vertex', gravity: true, inertia: 'action' } },
      { label: 'kF0 対照(material)', sm: { mode: 'vertex', gravity: false, inertia: 'material' }, kF: 0 },
      { label: 'material+共通並進 V=3', sm: { mode: 'vertex', gravity: false, inertia: 'material' }, boost: 3 },
    ];
    for (const vv of variants) {
      const ex = {};
      if (vv.sm) ex.spaceMesh = vv.sm;
      if (vv.kF !== undefined) ex.kFrame = vv.kF;
      const B = W.mkBox(1, D0, ex);
      const r = W.run(B.pd, 0.004, NS, B.meta.Pkep, 6, { boost: vv.boost || 0, stride: 256 });
      rows.push({ label: vv.label, D0pull: D0, ...r });
    }
    // χ→0 極でのビット一致(D0pull を大きくすると Δa が 0 に潰れるか)
    const bitRows = [];
    for (const D of [1e12, Infinity]) {
      const A = W.mkBox(1, 1, { spaceMesh: { mode: 'vertex', gravity: true, inertia: 'material', D0: (D === Infinity ? 1e300 : D) } });
      const Bb = W.mkBox(1, 1);
      const ra = W.run(A.pd, 0.004, 600, A.meta.Pkep, 6, {});
      const rb = W.run(Bb.pd, 0.004, 600, Bb.meta.Pkep, 6, {});
      bitRows.push({ D0: String(D), same: ra.state.every((z, i) => Object.is(z, rb.state[i])),
        maxDiff: Math.max(...ra.state.map((z, i) => Math.abs(z - rb.state[i]))) });
    }
    // 未宣言の 1 bit 不変(spaceMesh を宣言しない/両方 OFF で正規化される)
    const nd = [];
    for (const sm of [undefined, { mode: 'vertex', gravity: false, inertia: false }, { gravity: true, inertia: 'material' }]) {
      const B = W.mkBox(1, 1, sm === undefined ? {} : { spaceMesh: sm });
      const r = W.run(B.pd, 0.004, 600, B.meta.Pkep, 6, {});
      nd.push({ decl: JSON.stringify(sm) || 'none', sig: r.sig, state: r.state });
    }
    const base = nd[0];
    return { rows, bitRows,
      normalize: nd.map((z) => ({ decl: z.decl, sigSame: z.sig === base.sig,
        stateSame: z.state.every((q, i) => Object.is(q, base.state[i])) })) };
  }, FAST);
  for (const r of out.inertia.rows) {
    const i = r.inertial, l = r.ledger;
    console.error(`INE ${r.label}: P=${Number(i.period).toFixed(4)} Δϖ=${Number(i.advDeg).toFixed(6)} `
      + `r=${Number(i.rMin).toFixed(3)}〜${Number(i.rMax).toFixed(3)} E=${Number(l.E).toExponential(8)} `
      + `workE=${Number(l.spaceMeshWorkE).toExponential(4)} gravDiff=${Number(l.spaceMeshGravDiff).toExponential(3)} `
      + `χ=${Number(l.spaceMeshChi).toFixed(8)} clamp=${i.clamp} NaN=${i.nan}`);
  }
  console.error('INE bit:', JSON.stringify(out.inertia.bitRows), JSON.stringify(out.inertia.normalize));
}

// ---------------------------------------------------------------- DEG: 慣性項の**退化**を直接測る
// 頂点では u_mesh(xᵢ)=vᵢ が恒等なので、a_I(material)=∂ₜu+(∇u)v = Du/Dt = **共動点の加速度** = ẍᵢ に
// なる。つまり「慣性力」は新しい力ではなく**重力加速度そのものの再導出**である可能性がある ——
// その比 |a_I| / |a_Newton| を、頂点と非頂点のプローブ点で実測して分ける。
if (want("deg")) {
  out.degeneracy = await pg.evaluate(() => {
    const W = window.__w254, rows = [];
    for (const D0 of [1e-6, 1e-4, 1e-2, 1, 1e3]) {
      const B = W.mkBox(1, D0);
      const v = HP.validatePreset(JSON.parse(JSON.stringify(B.pd)));
      const S = HP.sim; S.build(v.preset);
      const A = HP.dfmSpaceMeshCapture(S, [0, 1]);
      let rv = null, rp = null;
      for (let k = 0; k < 4000; k++) {
        S.step(0.004);
        if (k !== 3999) continue;
        const M = HP.dfmSpaceMeshState(A, S);
        const G = S.params.G, e2 = S.params.softening ** 2, pw = HP.frameWeightPow(S.params) || 1;
        const rx = S.x[1] - S.x[0], ry = S.y[1] - S.y[0], s = rx * rx + ry * ry + e2;
        const iv = 1 / Math.sqrt(s), i3 = iv * iv * iv;
        const a0 = [G * S.m[1] * rx * i3, G * S.m[1] * ry * i3];
        const a1 = [-G * S.m[0] * rx * i3, -G * S.m[0] * ry * i3];
        const wx = S.vx[1] - S.vx[0], wy = S.vy[1] - S.vy[0];
        const dwx = a1[0] - a0[0], dwy = a1[1] - a0[1];
        const r2 = rx * rx + ry * ry, B2 = M.gradU, H = B2[0], Om = B2[2];
        const Hd = (wx * wx + wy * wy + rx * dwx + ry * dwy) / r2 - 2 * H * H;
        const Od = (rx * dwy - ry * dwx) / r2 - 2 * H * Om;
        const Cdd = [(a0[0] + a1[0]) / 2, (a0[1] + a1[1]) / 2];
        const bd = []; for (let z = 0; z < S.n; z++) bd.push({ m: S.m[z], x: S.x[z], y: S.y[z] });
        const probe = (px, py, vxp, vyp, exc) => {
          const ex = px - M.origin[0], ey = py - M.origin[1];
          const un = [M.velocity[0] + B2[0] * ex + B2[1] * ey, M.velocity[1] + B2[2] * ex + B2[3] * ey];
          const tn = [Cdd[0] + Hd * ex - Od * ey - (B2[0] * M.velocity[0] + B2[1] * M.velocity[1]),
            Cdd[1] + Od * ex + Hd * ey - (B2[2] * M.velocity[0] + B2[3] * M.velocity[1])];
          const fl = HP.dfmMeshScalarField(bd, px, py, { G, eps: S.params.softening, power: pw, exclude: exc });
          const bl = HP.dfmMeshBlend({ u: un, gradU: B2, dUdt: tn },
            { u: [0, 0], gradU: [0, 0, 0, 0], dUdt: [0, 0] }, fl.Wpull, fl.gradW, M.D0, 0);
          const mm = HP.dfmMeshParticleRHS({ u: bl.u, gradU: bl.gradU, dUdt: bl.dUdt, gravity: [0, 0] }, [vxp, vyp], "material");
          const ac = HP.dfmMeshParticleRHS({ u: bl.u, gradU: bl.gradU, dUdt: bl.dUdt, gravity: [0, 0] }, [vxp, vyp], "action");
          const gN = Math.hypot(fl.gravity[0], fl.gravity[1]);
          return { chi: bl.chi, aI_material: Math.hypot(mm.a[0], mm.a[1]), aI_action: Math.hypot(ac.a[0], ac.a[1]),
            gNewton: gN, ratioMaterial: Math.hypot(mm.a[0], mm.a[1]) / gN, ratioAction: Math.hypot(ac.a[0], ac.a[1]) / gN,
            relSpeed: Math.hypot(vxp - bl.u[0], vyp - bl.u[1]) };
        };
        rv = probe(S.x[0], S.y[0], S.vx[0], S.vy[0], 0);
        const px = M.origin[0] + 1.7 * M.refRLen, py = M.origin[1] + 0.9 * M.refRLen;
        rp = probe(px, py, 0, 0, null);
      }
      rows.push({ D0pull: D0, vertex: rv, probe: rp });
    }
    return rows;
  });
  for (const r of out.degeneracy) {
    console.error(`DEG D0pull=${r.D0pull}: 頂点 χ=${r.vertex.chi.toFixed(8)} |v−u|=${r.vertex.relSpeed.toExponential(3)} `
      + `|a_I|/|g_N| material=${r.vertex.ratioMaterial.toFixed(8)} action=${r.vertex.ratioAction.toFixed(8)} / `
      + `非頂点 χ=${r.probe.chi.toFixed(8)} material=${r.probe.ratioMaterial.toFixed(6)} action=${r.probe.ratioAction.toFixed(6)}`);
  }
}

// ---------------------------------------------------------------- OPT: ⚡🧶 の opt-in 表
if (want('opt')) {
  out.optin = await pg.evaluate((fast) => {
    const W = window.__w254, rows = [];
    const NP = fast ? 3 : 8;   // ⚡ は 8 近点窓・🧶 は 4 近点窓(周期が 4 倍長いため — 宣言する)
    for (const id of ['psrDoubleABDFM', 'psrB1534DFM']) {
      const P = HP.allPresets().find((z) => z.id === id);
      if (!P) continue;
      for (const vv of [{ l: 'OFF(λPN=0)', sm: null }, { l: 'material', sm: { mode: 'vertex', gravity: false, inertia: 'material' } },
        { l: 'action', sm: { mode: 'vertex', gravity: false, inertia: 'action' } },
        { l: 'gravity', sm: { mode: 'vertex', gravity: true, inertia: false } }]) {
        const pd = JSON.parse(JSON.stringify(P));
        pd.physics.lambdaPN = 0; pd.physics.framePrecision = 'double';
        if (vv.sm) pd.physics.spaceMesh = vv.sm;
        const NS = (id === "psrDoubleABDFM") ? (fast ? 60000 : 460000) : (fast ? 120000 : 940000);
        const r = W.run(pd, 0.016, NS, id === "psrDoubleABDFM" ? 880 : 3630,
          id === "psrDoubleABDFM" ? NP : Math.max(3, Math.round(NP / 2)), { stride: 512 });
        rows.push({ id, variant: vv.l, ...r });
      }
    }
    return rows;
  }, FAST);
  for (const r of out.optin) {
    const i = r.inertial, l = r.ledger;
    console.error(`OPT ${r.id} ${r.variant}: nPeri=${i.nPeri} P=${Number(i.period).toFixed(6)} `
      + `A0(Δϖ@λPN=0)=${Number(i.advDeg).toExponential(6)}°/周 workE=${Number(l.spaceMeshWorkE).toExponential(3)} `
      + `χ=${Number(l.spaceMeshChi).toFixed(8)} clamp=${i.clamp}`);
  }
}

// ---------------------------------------------------------------- SMP: 新サンプル 🪟 の実測
if (want("smp")) {
  out.sample = await pg.evaluate((fast) => {
    const W = window.__w254, res = { rows: [] };
    const P = HP.allPresets().find((z) => z.id === "spaceMeshBinaryToy");
    if (!P) return { err: "preset not found" };
    const NS = fast ? 300000 : 1500000;
    const mk = (patch) => { const q = JSON.parse(JSON.stringify(P)); Object.assign(q.physics, patch || {}); return q; };
    const A = W.run(mk(), 0.004, NS, 518.8543790497372, 6, { transport: true, stride: 64 });
    const B = W.run(mk({ spaceMesh: null }), 0.004, NS, 518.8543790497372, 6, { transport: true, stride: 64 });
    res.A = A; res.B = B;
    res.stateSame = A.state.every((z, i) => Object.is(z, B.state[i]));
    res.stateMaxDiff = Math.max(...A.state.map((z, i) => Math.abs(z - B.state[i])));
    res.sigA = A.sig; res.sigB = B.sig;
    for (const D0 of [0, 1e-4, 1e-2, 1, 1e3]) {
      const r = W.run(mk({ D0pull: D0 }), 0.004, fast ? 200000 : 1000000, 518.8543790497372, 4, { transport: true, stride: 64 });
      const v = HP.validatePreset(mk({ D0pull: D0 }));
      const S = HP.sim; S.build(v.preset);
      const an = HP.dfmSpaceMeshCapture(S, [0, 1]); const M = HP.dfmSpaceMeshState(an, S);
      res.rows.push({ D0pull: D0, declared: v.preset.physics.D0pull, chi0: M.chi, mode: M.mode, unique: M.unique,
        chiMin: r.mesh.chiMin, chiMax: r.mesh.chiMax, omBlendMin: r.mesh.omBlendMin, omBlendMax: r.mesh.omBlendMax,
        omMeshMin: r.mesh.omMeshMin, omMeshMax: r.mesh.omMeshMax, thRatio: r.mesh.thMeshTotal / r.mesh.thOrbTotal,
        trG: r.mesh.trErrGeometric, trV: r.mesh.trErrVelocity,
        P: r.inertial.period, adv: r.inertial.advDeg, nPeri: r.inertial.nPeri, rMin: r.inertial.rMin, rMax: r.inertial.rMax, clamp: r.inertial.clamp, nan: r.inertial.nan,
        gravDiff: r.ledger.spaceMeshGravDiff, workE: r.ledger.spaceMeshWorkE });
    }
    return res;
  }, FAST);
  const s = out.sample;
  console.error("SMP A/B same=" + s.stateSame + " maxDiff=" + Number(s.stateMaxDiff).toExponential(3)
    + " P(A)=" + Number(s.A.inertial.period).toFixed(6) + " P(B)=" + Number(s.B.inertial.period).toFixed(6)
    + " Δϖ(A)=" + Number(s.A.inertial.advDeg).toFixed(6) + " Δϖ(B)=" + Number(s.B.inertial.advDeg).toFixed(6));
  for (const r of s.rows) console.error("SMP D0pull=" + r.D0pull + " decl=" + r.declared
    + " χ0=" + Number(r.chi0).toFixed(8) + " mode=" + r.mode + " unique=" + r.unique
    + " χ=" + Number(r.chiMin).toExponential(3) + "〜" + Number(r.chiMax).toExponential(3) + " nP=" + r.nPeri
    + " Ω_blend/Ω_mesh=" + (r.omBlendMax / r.omMeshMax).toFixed(6)
    + " θ比=" + Number(r.thRatio).toFixed(9) + " trG=" + Number(r.trG).toExponential(3)
    + " trV=" + Number(r.trV).toExponential(3) + " P=" + Number(r.P).toFixed(4)
    + " Δϖ=" + Number(r.adv).toFixed(6) + " clamp=" + r.clamp
    + " gravDiff=" + Number(r.gravDiff).toExponential(3) + " workE=" + Number(r.workE).toExponential(3));
}

out.pageErrors = pageErrors;
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error('wrote', OUT, 'pageErrors', pageErrors.length);
await browser.close();

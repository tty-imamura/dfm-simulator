// 第251便a W1「コンパクト天体以上で有意な力を導入する — 3 候補の符号を同じ器で確定する」(第43報)。
//
// 原仮定者(第43報): 「コンパクト天体以上で有意な力を導入しないと進展が無いので、解決するまで取り組む/
// 導入しても恒星連星までの結果は壊さない/様々な物理計算からヒントを見付け、安定した結果を出力する
// アルゴリズムに到達する/進め方は検証を優先する」。
//
// **本ハーネスはエンジンを 1 度も呼ばない。** `S.step` も E12 も E6′ も走らせず、この 1 ファイルの中だけで
// 閉じた **2 体・重心系・Float64・RK4** を回し、純関数 `HP.dfmCompactForce` が返す力だけを足す
// (第250便a の tests/exp-w250a-induced.mjs と同型)。目的は **Δϖ の符号と大きさ**を、3 モデル
// (current=案K・manev・lj)× 4 系(⚡🧮🩺 の NS 3 系+✴️ の恒星連星)× η で 1 枚の表にすることである。
//
// ■ 系の値は**プリセットからの転写**(手打ちしない)
//   HP.allPresets() から ⚡ psrDoubleABDFM・🧮 psrJ1757DFM・🩺 psrJ1946DFM・✴️ alphaCenABDFM を読み、
//   質量 m_i(較正質量)・半径 R_i・遠点状態(位置・速度)・massCalibration の f_i と χ_i・G・c を取る。
//   遠点状態から**ニュートン 2 体の a と e** を出し(μ_N=G(m₁+m₂))、p=a(1−e²) を固定して e を振る。
//   ※ この RK4 の軌道は**エンジンの kF1 軌道ではない**(kF1 の引きずりは周期を伸ばす)。ここで測るのは
//     「追加力が Δϖ をどちら向きにどれだけ動かすか」であって、観測との照合は段5(エンジン)で行う。
//
// ■ η の規約(符号つき)
//   η ≡ (F_add の**動径成分**)/(F_N の大きさ) を**近点で**評価する。**η>0 は斥力(外向き)**・η<0 は引力。
//   各モデルの係数(current の κ・manev の alphaK・lj の C₆)は「単位係数での η」を 1 回測ってから
//   η_target/η_unit で決める(fit ではなく規格化)。
//
// ■ 節
//   FD   : 純関数の自己検査(有限差分 F=−∇U・等大反対・ゲートのビット 0・不正入力 null)。
//   SIGN : 3 モデル × 4 系 × η=0/±10⁻⁵/±10⁻⁴ × e=(≈円/0.1/実 e)の Δϖ 表。
//   KAPPA: current の解析式 Δϖ_K=−2πκχ₁χ₂G m₁m₂/(M c²p) との照合・κ 符号反転・全速度反転の偶対称。
//   MANEV: 2πα/(μ_N p)(= alphaK=3・μ_N=μ なら 6πμ/(pc²))との照合。
//   LJ   : ζ=C₈/(C₆·s_p) を掃引して**符号が変わる点**(理論値 ζ=3/4)を挟む。
//   FREEZE: ⚡ で「1PN の半分を打ち消す」κ を解き、それを 🧮🩺 へそのまま流したときの比。
//
// 実行: node tests/exp-w251a-compact.mjs [--fd] [--sign] [--kappa] [--manev] [--lj] [--freeze]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'exp-w251a-compact.json');
const argv = process.argv.slice(2);
const only = argv.filter((a) => a.startsWith('--')).map((a) => a.slice(2));
const want = (k) => !only.length || only.includes(k);

let browser;
try { const { chromium } = await import('playwright'); browser = await chromium.launch(); }
catch {
  const { createRequire } = await import('node:module');
  const req = createRequire(path.join(ROOT, 'noop.js'));
  const { chromium } = req('playwright-core');
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
}
const pg = await browser.newPage();
const pageErrors = [];
pg.on('pageerror', (e) => pageErrors.push(String(e)));
await pg.goto(INDEX, { waitUntil: 'load' });
await pg.waitForFunction(() => window.HP && HP.sim);

const out = { target: TARGET, node: process.version, at: new Date().toISOString(), wave: '251a' };

// ---------------------------------------------------------------- ページ内の共通ライブラリ
// 系の転写・RK4・近点 fit をページ側に 1 度だけ置く(各節はこれを呼ぶ)。
await pg.evaluate(() => {
  const W = (window.__w251 = {});
  // 系の転写(プリセット → 2 体の実単位)
  W.SYS = {};
  const IDS = { doubleAB: 'psrDoubleABDFM', j1757: 'psrJ1757DFM', j1946: 'psrJ1946DFM', alphaCen: 'alphaCenABDFM' };
  for (const key of Object.keys(IDS)) {
    const p = HP.allPresets().find((z) => z.id === IDS[key]);
    const b = p.bodies, mc = p.massCalibration;
    const m1 = b[0].m, m2 = b[1].m, M = m1 + m2;
    const dx = b[1].x - b[0].x, dy = b[1].y - b[0].y;
    const dvx = b[1].vx - b[0].vx, dvy = b[1].vy - b[0].vy;
    const rA = Math.hypot(dx, dy), vA = Math.hypot(dvx, dvy);
    const G = p.physics.G, c = p.physics.cLight;
    const f1 = mc.factorByBody[0], f2 = mc.factorByBody[1];
    // 軌道の幾何は**観測質量の 2 体ケプラー**で決める(プリセットの遠点状態は「f=1 の実ケプラー遠点速度」
    // なので、これが実際の系の軌道 — ⚡ なら a=878.8・e=0.0874・P=8834 s が出る)。
    // 較正質量 f≈2 のまま純ニュートンで積分すると e≈0.54 の深い楕円になる(⚡ の kF0 対照そのもの)ので、
    // **(p, e) を軌道の定義とし、質量台帳 massMode だけを差し替えて同じ (p,e) で比較する**。
    const muObs = G * (m1 / f1 + m2 / f2);
    const aO = 1 / (2 / rA - vA * vA / muObs);
    const h = rA * vA;                       // 遠点は v⊥r
    const eccO = Math.sqrt(Math.max(0, 1 - h * h / (muObs * aO)));
    W.SYS[key] = { id: IDS[key], emoji: p.emoji, m1, m2, M, R1: b[0].radius, R2: b[1].radius,
      f1, f2, chi1: mc.chi[0], chi2: mc.chi[1],
      G, c, muN: G * M, muObs, rApo: rA, vApo: vA, a: aO, ecc: eccO, p: aO * (1 - eccO * eccO), h,
      massRatioTerm: m1 * m2 / (M * M) };
  }
  // 質量台帳の切替: "dfm"=較正質量 m_i(エンジンの台帳)/"obs"=観測質量 m_i/f_i(f=1 に戻す)
  W.ledger = (sys, mm) => (mm === 'dfm')
    ? { m1: sys.m1, m2: sys.m2, f1: sys.f1, f2: sys.f2 }
    : { m1: sys.m1 / sys.f1, m2: sys.m2 / sys.f2, f1: 1, f2: 1 };
  // 追加力の呼び出し(1 が 2 に及ぼす力を返す)
  W.force = (sys, mm, model, coef, x1, y1, vx1, vy1, x2, y2, vx2, vy2) => {
    const L = W.ledger(sys, mm);
    return HP.dfmCompactForce(Object.assign({
      model, dx: x2 - x1, dy: y2 - y1, vx1, vy1, vx2, vy2,
      m1: L.m1, m2: L.m2, R1: sys.R1, R2: sys.R2, f1: L.f1, f2: L.f2,
      chi1: sys.chi1, chi2: sys.chi2, G: sys.G, c: sys.c }, coef || {}));
  };
  // 近点状態(重心系・近点発)。軌道は (p, e) で定義し、速さは台帳の μ で決める
  W.periState = (sys, mm, ecc) => {
    const L = W.ledger(sys, mm), MM = L.m1 + L.m2, muN = sys.G * MM;
    const p = sys.p, r0 = p / (1 + ecc), h = Math.sqrt(muN * p), v0 = h / r0;
    const w1 = -L.m2 / MM, w2 = L.m1 / MM;
    return { r0, v0, muN, MM, m1: L.m1, m2: L.m2,
      x1: w1 * r0, y1: 0, vx1: 0, vy1: w1 * v0, x2: w2 * r0, y2: 0, vx2: 0, vy2: w2 * v0 };
  };
  // 単位係数での η(近点・符号つき: +=斥力)
  W.etaUnit = (sys, mm, model, unitCoef, ecc) => {
    const s = W.periState(sys, mm, ecc);
    const z = W.force(sys, mm, model, unitCoef, s.x1, s.y1, s.vx1, s.vy1, s.x2, s.y2, s.vx2, s.vy2);
    if (!z) return null;
    const fr = (z.fx * (s.x2 - s.x1) + z.fy * (s.y2 - s.y1)) / s.r0;   // 動径成分(外向き +)
    const FN = sys.G * s.m1 * s.m2 / (s.r0 * s.r0);
    return { eta: fr / FN, on: z.on, FN, fr };
  };
  // ---- 2 体・重心系・Float64・RK4。mm:"dfm"(較正質量)/"obs"(観測質量)— 慣性も重力も追加力も同じ台帳
  W.run = (sysKey, mm, model, coef, ecc, dt, nPeri, opts) => {
    const sys = W.SYS[sysKey], o = opts || {}, L = W.ledger(sys, mm);
    const m1 = L.m1, m2 = L.m2, M = m1 + m2, G = sys.G;
    const muN = G * M, gm1 = m1, gm2 = m2;
    const st = W.periState(sys, mm, ecc);
    let x1 = st.x1, y1 = st.y1, vx1 = st.vx1, vy1 = st.vy1, x2 = st.x2, y2 = st.y2, vx2 = st.vx2, vy2 = st.vy2;
    if (o.reverseV) { vx1 = -vx1; vy1 = -vy1; vx2 = -vx2; vy2 = -vy2; }
    const T = 2 * Math.PI * Math.sqrt(Math.pow(sys.p / (1 - ecc * ecc), 3) / muN);
    const steps = Math.ceil((nPeri + 1.2) * T / dt);
    // 加速度(1,2 の順)。重力は Gm_i m_j/r²(質量は massMode 側)、追加力は純関数
    const acc = (X1, Y1, VX1, VY1, X2, Y2, VX2, VY2) => {
      const dx = X2 - X1, dy = Y2 - Y1, r2 = dx * dx + dy * dy, r = Math.sqrt(r2), ir3 = 1 / (r2 * r);
      // 重力: 1 が受ける力は +方向(2 へ向かう)
      let f1x = G * gm1 * gm2 * dx * ir3, f1y = G * gm1 * gm2 * dy * ir3;
      let f2x = -f1x, f2y = -f1y;
      if (model) {
        const z = HP.dfmCompactForce(Object.assign({ model, dx, dy, vx1: VX1, vy1: VY1, vx2: VX2, vy2: VY2,
          m1, m2, R1: sys.R1, R2: sys.R2, f1: L.f1, f2: L.f2, chi1: sys.chi1, chi2: sys.chi2,
          G, c: sys.c }, coef || {}));
        if (z && z.on) { f2x += z.fx; f2y += z.fy; f1x -= z.fx; f1y -= z.fy; }
      }
      return [f1x / m1, f1y / m1, f2x / m2, f2y / m2];
    };
    const ener = (X1, Y1, VX1, VY1, X2, Y2, VX2, VY2) => {
      const dx = X2 - X1, dy = Y2 - Y1, r = Math.hypot(dx, dy);
      let U = -G * gm1 * gm2 / r;
      if (model) {
        const z = HP.dfmCompactForce(Object.assign({ model, dx, dy, vx1: VX1, vy1: VY1, vx2: VX2, vy2: VY2,
          m1, m2, R1: sys.R1, R2: sys.R2, f1: L.f1, f2: L.f2, chi1: sys.chi1, chi2: sys.chi2,
          G, c: sys.c }, coef || {}));
        if (z && z.on) U += z.U;
      }
      return 0.5 * m1 * (VX1 * VX1 + VY1 * VY1) + 0.5 * m2 * (VX2 * VX2 + VY2 * VY2) + U;
    };
    const E0 = ener(x1, y1, vx1, vy1, x2, y2, vx2, vy2);
    const P0x = m1 * vx1 + m2 * vx2, P0y = m1 * vy1 + m2 * vy2;
    const L0 = m1 * (x1 * vy1 - y1 * vx1) + m2 * (x2 * vy2 - y2 * vx2);
    let dE = 0, dL = 0, dP = 0, rd1 = 0;
    const peri = [];
    const S8 = new Float64Array(8);
    const step = () => {
      const y0 = [x1, y1, vx1, vy1, x2, y2, vx2, vy2];
      const der = (s) => { const a = acc(s[0], s[1], s[2], s[3], s[4], s[5], s[6], s[7]);
        return [s[2], s[3], a[0], a[1], s[6], s[7], a[2], a[3]]; };
      const k1 = der(y0);
      for (let i = 0; i < 8; i++) S8[i] = y0[i] + 0.5 * dt * k1[i];
      const k2 = der(S8);
      for (let i = 0; i < 8; i++) S8[i] = y0[i] + 0.5 * dt * k2[i];
      const k3 = der(S8);
      for (let i = 0; i < 8; i++) S8[i] = y0[i] + dt * k3[i];
      const k4 = der(S8);
      const nv = new Array(8);
      for (let i = 0; i < 8; i++) nv[i] = y0[i] + dt / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]);
      x1 = nv[0]; y1 = nv[1]; vx1 = nv[2]; vy1 = nv[3]; x2 = nv[4]; y2 = nv[5]; vx2 = nv[6]; vy2 = nv[7];
    };
    for (let k = 0; k < steps && peri.length < nPeri; k++) {
      const pdx = x2 - x1, pdy = y2 - y1;
      const pvx = vx2 - vx1, pvy = vy2 - vy1;
      step();
      const dx = x2 - x1, dy = y2 - y1, r = Math.hypot(dx, dy);
      const rd = (dx * (vx2 - vx1) + dy * (vy2 - vy1)) / r;
      const ee = ener(x1, y1, vx1, vy1, x2, y2, vx2, vy2);
      const d = Math.abs(ee / E0 - 1); if (d > dE) dE = d;
      const LL = m1 * (x1 * vy1 - y1 * vx1) + m2 * (x2 * vy2 - y2 * vx2);
      const dl = Math.abs(LL / L0 - 1); if (dl > dL) dL = dl;
      const px = m1 * vx1 + m2 * vx2, py = m1 * vy1 + m2 * vy2;
      const dp = Math.hypot(px - P0x, py - P0y) / (m1 * Math.abs(st.vy1) + m2 * Math.abs(st.vy2));
      if (dp > dP) dP = dp;
      if (k >= 1 && rd1 < 0 && rd >= 0) {
        const fr = (rd !== rd1) ? (-rd1 / (rd - rd1)) : 0;
        let a0 = Math.atan2(pdy, pdx), b0 = Math.atan2(dy, dx);
        while (b0 - a0 > Math.PI) b0 -= 2 * Math.PI;
        while (b0 - a0 < -Math.PI) b0 += 2 * Math.PI;
        peri.push(a0 + fr * (b0 - a0));
      }
      rd1 = rd;
    }
    // 近点方位の直線 fit(1 周あたりの前進 rad)
    const ang = [];
    for (let i = 0; i < peri.length; i++) {
      let a = peri[i];
      if (i) { let z = a - ang[i - 1]; while (z > Math.PI) z -= 2 * Math.PI; while (z < -Math.PI) z += 2 * Math.PI; a = ang[i - 1] + z; }
      ang.push(a);
    }
    const n = ang.length; let slope = null;
    if (n >= 2) {
      const mx = (n - 1) / 2, my = ang.reduce((s, z) => s + z, 0) / n;
      let sxy = 0, sxx = 0;
      for (let i = 0; i < n; i++) { sxy += (i - mx) * (ang[i] - my); sxx += (i - mx) * (i - mx); }
      slope = sxy / sxx;
    }
    return { nPeri: n, T, dt, dPhi: slope, dEmax: dE, dLmax: dL, dPmax: dP, muN };
  };
});

const SYS = await pg.evaluate(() => window.__w251.SYS);
out.systems = SYS;
console.error('系(プリセット転写):');
for (const k of Object.keys(SYS)) {
  const s = SYS[k];
  console.error(`  ${s.emoji} ${k}: m=${s.m1.toFixed(3)}/${s.m2.toFixed(3)} f=${s.f1.toFixed(6)} χ=${s.chi1.toExponential(4)}`
    + ` a=${s.a.toFixed(3)} e=${s.ecc.toFixed(6)} p=${s.p.toFixed(3)} c=${s.c}`);
}

// ============================================================ FD: 純関数の自己検査
if (want('fd')) {
  out.fd = await pg.evaluate(() => {
    const base = { dx: 700, dy: 300, vx1: 0.4, vy1: -2.7, vx2: -0.5, vy2: 2.9,
      m1: 5321.8, m2: 4966.6, R1: 0.01175, R2: 0.01175, f1: 2, f2: 2,
      chi1: 0.99994, chi2: 0.99994, G: 6.674, c: 2997.92458 };
    const COEF = { current: { kappa: 6, rc: 0.5 }, manev: { alphaK: 3, rc: 0.5 }, lj: { C6: 1e18, C8: 4e23, rc: 0.5 } };
    const res = {};
    for (const model of ['current', 'manev', 'lj']) {
      // 有限差分: F=−∇U(current は v 固定)
      let maxRel = 0, n = 0;
      for (const [dx, dy] of [[700, 300], [-400, 900], [1200, 0], [0, -650], [55, 40]]) {
        const h = 1e-6 * Math.hypot(dx, dy);
        for (const ax of [0, 1]) {
          const pp = Object.assign({}, base, COEF[model], { model });
          const a = HP.dfmCompactForce(Object.assign({}, pp, { dx: dx + (ax ? 0 : h), dy: dy + (ax ? h : 0) }));
          const b = HP.dfmCompactForce(Object.assign({}, pp, { dx: dx - (ax ? 0 : h), dy: dy - (ax ? h : 0) }));
          const m = HP.dfmCompactForce(Object.assign({}, pp, { dx, dy }));
          const fd = -(a.U - b.U) / (2 * h), f = ax ? m.fy : m.fx;
          if (Math.abs(fd) > 0) { const rel = Math.abs(f - fd) / Math.abs(fd); if (rel > maxRel) maxRel = rel; n++; }
        }
      }
      // ゲート下は厳密 0(ビット)
      const off = (model === 'current') ? HP.dfmCompactForce(Object.assign({}, base, COEF[model], { model, chi1: 2e-4, chi2: 2.4e-4 }))
        : (model === 'manev') ? HP.dfmCompactForce(Object.assign({}, base, COEF[model], { model, R1: 6.96e2, R2: 6.96e2, f1: 1.0002, f2: 1.0002, m1: 21.46, m2: 18.08 }))
          : HP.dfmCompactForce(Object.assign({}, base, COEF[model], { model, R1: 6.96e2, R2: 6.96e2, m1: 21.46, m2: 18.08 }));
      // 等大反対(2 が 1 に及ぼす力 = dx,dy 反転で fx,fy が符号反転)
      const A = HP.dfmCompactForce(Object.assign({}, base, COEF[model], { model }));
      const B = HP.dfmCompactForce(Object.assign({}, base, COEF[model], { model, dx: -base.dx, dy: -base.dy,
        vx1: base.vx2, vy1: base.vy2, vx2: base.vx1, vy2: base.vy1, m1: base.m2, m2: base.m1,
        R1: base.R2, R2: base.R1, f1: base.f2, f2: base.f1, chi1: base.chi2, chi2: base.chi1 }));
      res[model] = { maxRel, n,
        offBit: Object.is(off.U, 0) && Object.is(off.fx, 0) && Object.is(off.fy, 0) && off.on === false,
        off: { on: off.on, U: off.U, fx: off.fx, fy: off.fy, gateVal: off.gateVal,
          chiIJ: off.chiIJ, Cij: off.Cij, sigma: off.sigma },
        newton3: Math.abs(A.fx + B.fx) <= 1e-9 * Math.abs(A.fx) && Math.abs(A.fy + B.fy) <= 1e-9 * Math.abs(A.fy),
        A: { U: A.U, fx: A.fx, fy: A.fy, on: A.on } };
    }
    // 速度反転(current は v に偶)
    const cv = Object.assign({}, base, COEF.current, { model: 'current' });
    const c1 = HP.dfmCompactForce(cv);
    const c2 = HP.dfmCompactForce(Object.assign({}, cv, { vx1: -cv.vx1, vy1: -cv.vy1, vx2: -cv.vx2, vy2: -cv.vy2 }));
    const c3 = HP.dfmCompactForce(Object.assign({}, cv, { kappa: -6 }));
    res.vEven = Object.is(c1.fx, c2.fx) && Object.is(c1.fy, c2.fy) && Object.is(c1.U, c2.U);
    res.kappaFlip = Object.is(c1.fx, -c3.fx) && Object.is(c1.fy, -c3.fy);
    res.bad = [HP.dfmCompactForce(null), HP.dfmCompactForce({ model: 'nope', dx: 1, dy: 0, m1: 1, m2: 1 }),
      HP.dfmCompactForce(Object.assign({}, base, { model: 'current', dx: 0, dy: 0 })),
      HP.dfmCompactForce(Object.assign({}, base, { model: 'current', m1: -1 })),
      HP.dfmCompactForce(Object.assign({}, base, { model: 'current', chi1: NaN }))].map((z) => z === null);
    return res;
  });
  for (const m of ['current', 'manev', 'lj']) {
    const r = out.fd[m];
    console.error(`  FD ${m}: 有限差分 最大相対差 ${r.maxRel.toExponential(3)}(${r.n} 点)/ ゲート下ビット 0=${r.offBit}`
      + ` / 等大反対=${r.newton3}`);
  }
  console.error(`  FD current: v 反転で不変=${out.fd.vEven} / κ 符号反転で F 反転=${out.fd.kappaFlip} / 不正入力 null=${out.fd.bad.every(Boolean)}`);
}

// ============================================================ SIGN: 3 モデル × 4 系 × η × e の符号表
if (want('sign')) {
  out.sign = await pg.evaluate(() => {
    const W = window.__w251;
    const rows = [];
    const ETAS = [0, 1e-5, -1e-5, 1e-4, -1e-4];
    for (const sysKey of Object.keys(W.SYS)) {
      const sys = W.SYS[sysKey];
      const ECCS = [{ tag: '≈円(e=10⁻³)', e: 1e-3 }, { tag: 'e=0.1', e: 0.1 }, { tag: '実 e', e: sys.ecc }];
      for (const model of ['current', 'manev', 'lj']) {
        const mm = 'obs';   // 軌道は観測質量のケプラー(=実際の系の軌道)。較正質量台帳は KAPPA 節で別に測る
        for (const ec of ECCS) {
          // 単位係数(current κ=1・manev alphaK=1・lj C₆=1 で C₈=0)
          const unit = (model === 'current') ? { kappa: 1 } : (model === 'manev') ? { alphaK: 1 } : { C6: 1, C8: 0 };
          const eu = W.etaUnit(sys, mm, model, unit, ec.e);
          const muN = W.periState(sys, mm, ec.e).muN;
          for (const eta of ETAS) {
            let coef = null, gated = false;
            if (eta === 0) { coef = null; } else if (!eu || !eu.on || eu.eta === 0) { gated = true; }
            else {
              const k = eta / eu.eta;
              coef = (model === 'current') ? { kappa: k } : (model === 'manev') ? { alphaK: k } : { C6: k, C8: 0 };
            }
            if (gated) { rows.push({ sys: sysKey, emoji: sys.emoji, model, mm, ecc: ec.e, eccTag: ec.tag, eta, gated: true, dPhi: 0, note: 'ゲート下 = 力ビット 0' }); continue; }
            const dt = 2 * Math.PI * Math.sqrt(Math.pow(sys.p / (1 - ec.e * ec.e), 3) / muN) / 8000;
            const z = W.run(sysKey, mm, (eta === 0) ? null : model, coef, ec.e, dt, 6, {});
            rows.push({ sys: sysKey, emoji: sys.emoji, model, mm, ecc: ec.e, eccTag: ec.tag, eta,
              gated: false, dPhi: z.dPhi, dEmax: z.dEmax, dLmax: z.dLmax, dPmax: z.dPmax, T: z.T, dt: z.dt, nPeri: z.nPeri,
              coef: coef ? JSON.parse(JSON.stringify(coef)) : null });
          }
        }
      }
    }
    return rows;
  });
  const g = {};
  for (const r of out.sign) { const k = `${r.emoji}${r.model}`; (g[k] = g[k] || []).push(r); }
  for (const k of Object.keys(g)) {
    const rs = g[k];
    console.error(`  SIGN ${k}(台帳 ${rs[0].mm}):`);
    for (const r of rs) console.error(`     e=${String(r.ecc).slice(0, 8).padEnd(9)} η=${String(r.eta).padStart(6)} → Δϖ=${r.gated ? 'ゲート下 0' : r.dPhi.toExponential(6)} rad/周`
      + (r.gated ? '' : `  |ΔE/E|≤${r.dEmax.toExponential(1)} |ΔL/L|≤${r.dLmax.toExponential(1)}`));
  }
}

// ============================================================ KAPPA: 案K の解析式・符号反転・v 偶対称
if (want('kappa')) {
  out.kappa = await pg.evaluate(() => {
    const W = window.__w251, res = [];
    for (const sysKey of ['doubleAB', 'j1757', 'j1946']) {
      const sys = W.SYS[sysKey];
      for (const mm of ['obs', 'dfm']) {
        const L = W.ledger(sys, mm), MM = L.m1 + L.m2;
        for (const kap of [6, -6, 1, 0.1]) {
          const dt = 2 * Math.PI * Math.sqrt(Math.pow(sys.p / (1 - sys.ecc * sys.ecc), 3) / (sys.G * MM)) / 8000;
          const z = W.run(sysKey, mm, 'current', { kappa: kap }, sys.ecc, dt, 6, {});
          const zr = W.run(sysKey, mm, 'current', { kappa: kap }, sys.ecc, dt, 6, { reverseV: true });
          // 解析: Δϖ = −2πκχ₁χ₂ G m₁m₂/(M c² p)
          const lin = -2 * Math.PI * kap * sys.chi1 * sys.chi2 * sys.G * L.m1 * L.m2 / (MM * sys.c * sys.c * sys.p);
          // 1PN 参照(この軌道の p と同じ台帳の総質量で)
          const pn = 6 * Math.PI * sys.G * MM / (sys.c * sys.c * sys.p);
          res.push({ sys: sysKey, emoji: sys.emoji, mm, kappa: kap, meas: z.dPhi, lin,
            diffPct: (lin !== 0) ? (z.dPhi / lin - 1) * 100 : null,
            // 力は v に偶なので、全速度反転は「同じ軌道を逆回り」= Δϖ の**符号だけ**が返る
            measRevV: zr.dPhi, revEven: Math.abs(zr.dPhi / (-z.dPhi) - 1),
            pn1: pn, ratioToPN: z.dPhi / pn, dEmax: z.dEmax, dLmax: z.dLmax, dPmax: z.dPmax });
        }
      }
    }
    return res;
  });
  for (const r of out.kappa) console.error(`  KAPPA ${r.emoji}[${r.mm}] κ=${String(r.kappa).padStart(5)} → 実測 ${r.meas.toExponential(6)}`
    + ` 解析 ${r.lin.toExponential(6)} 差 ${r.diffPct.toFixed(4)}% / Δϖ/Δϖ_1PN=${r.ratioToPN.toFixed(6)}`
    + ` / v 全反転は −Δϖ に一致(相対差 ${r.revEven.toExponential(2)}) / |ΔE/E|≤${r.dEmax.toExponential(2)} |ΔL/L|≤${r.dLmax.toExponential(2)}`);
}

// ============================================================ MANEV: 2πα/(μ_N p) との照合
if (want('manev')) {
  out.manev = await pg.evaluate(() => {
    const W = window.__w251, res = [];
    for (const sysKey of ['doubleAB', 'j1757', 'j1946', 'alphaCen']) {
      const sys = W.SYS[sysKey];
      for (const aK of [3, 1]) {
        const dt = 2 * Math.PI * Math.sqrt(Math.pow(sys.p / (1 - sys.ecc * sys.ecc), 3) / sys.muObs) / 8000;
        const z = W.run(sysKey, 'obs', 'manev', { alphaK: aK }, sys.ecc, dt, 6, {});
        const alpha = aK * sys.muObs * sys.muObs / (sys.c * sys.c);
        const lin = 2 * Math.PI * alpha / (sys.muObs * sys.p);
        const gr = 6 * Math.PI * sys.muObs / (sys.c * sys.c * sys.p);
        const L = W.ledger(sys, 'obs');
        const probe = HP.dfmCompactForce({ model: 'manev', dx: sys.p, dy: 0, vx1: 0, vy1: 0, vx2: 0, vy2: 0,
          m1: L.m1, m2: L.m2, R1: sys.R1, R2: sys.R2, f1: L.f1, f2: L.f2, G: sys.G, c: sys.c, alphaK: aK });
        res.push({ sys: sysKey, emoji: sys.emoji, alphaK: aK, meas: z.dPhi, lin, gr,
          diffPct: (lin !== 0) ? (z.dPhi / lin - 1) * 100 : null,
          grPct: (gr !== 0) ? (z.dPhi / gr - 1) * 100 : null,
          gateOn: probe.on, C1: probe.C1, C2: probe.C2, dEmax: z.dEmax, dLmax: z.dLmax });
      }
    }
    return res;
  });
  for (const r of out.manev) console.error(`  MANEV ${r.emoji} alphaK=${r.alphaK} ゲート on=${r.gateOn}(C=${r.C1.toExponential(3)}/${r.C2.toExponential(3)})`
    + (r.gateOn ? ` → 実測 ${r.meas.toExponential(6)} 一次式 ${r.lin.toExponential(6)} 差 ${r.diffPct.toFixed(4)}%`
      + ` / 6πμ/(pc²)=${r.gr.toExponential(6)} 差 ${r.grPct.toFixed(4)}% / |ΔE/E|≤${r.dEmax.toExponential(2)}` : ' → 力ビット 0'));
}

// ============================================================ LJ: ζ=C₈/(C₆ s_p) の符号反転点
if (want('lj')) {
  out.lj = await pg.evaluate(() => {
    const W = window.__w251, res = [];
    const sysKey = 'doubleAB', sys = W.SYS[sysKey], mm = 'obs';
    const st = W.periState(sys, mm, sys.ecc), sp = st.r0 * st.r0;
    // **C₆ を固定**(C₈=0 だけで近点の η=−10⁻⁵ になる大きさ)してから ζ=C₈/(C₆·s_p) を振る。
    // (η を毎回 10⁻⁵ に規格化し直すと、近点で力が消える ζ=3/4 の近傍で係数が発散して表が読めない)
    const eu0 = W.etaUnit(sys, mm, 'lj', { C6: 1, C8: 0 }, sys.ecc);
    const C6f = -1e-5 / eu0.eta;
    for (const zeta of [0, 0.25, 0.5, 0.6, 0.65, 0.7, 0.75, 0.8, 1.0, 1.5, 2.0]) {
      const coef = { C6: C6f, C8: zeta * sp * C6f };
      const eu = W.etaUnit(sys, mm, 'lj', coef, sys.ecc);
      const dt = 2 * Math.PI * Math.sqrt(Math.pow(sys.p / (1 - sys.ecc * sys.ecc), 3) / st.muN) / 8000;
      const z = W.run(sysKey, mm, 'lj', coef, sys.ecc, dt, 6, {});
      res.push({ zeta, etaPeri: eu ? eu.eta : null, etaUnitSign: eu ? Math.sign(eu.eta) : null,
        C6: C6f, C8: zeta * sp * C6f, dPhi: z.dPhi, dEmax: z.dEmax, dLmax: z.dLmax });
    }
    // 恒星連星のゲート(✴️)。Ξ は「その台帳の質量」で決まるので、較正質量側(dfm)でも見る
    const s2 = W.SYS.alphaCen, L2 = W.ledger(s2, 'dfm'), L1 = W.ledger(sys, 'dfm');
    const probe = HP.dfmCompactForce({ model: 'lj', dx: s2.p, dy: 0, m1: L2.m1, m2: L2.m2,
      R1: s2.R1, R2: s2.R2, G: s2.G, c: s2.c, C6: 1e30, C8: 0 });
    const probeNS = HP.dfmCompactForce({ model: 'lj', dx: sys.p, dy: 0, m1: L1.m1, m2: L1.m2,
      R1: sys.R1, R2: sys.R2, G: sys.G, c: sys.c, C6: 1e30, C8: 0 });
    return { sweep: res, sp, star: { on: probe.on, xi1: probe.xi1, xi2: probe.xi2, sigma: probe.sigma, U: probe.U, fx: probe.fx },
      ns: { on: probeNS.on, xi1: probeNS.xi1, xi2: probeNS.xi2, sigma: probeNS.sigma, theta: probeNS.theta } };
  });
  for (const r of out.lj.sweep) console.error(`  LJ ζ=${String(r.zeta).padStart(5)} → 近点の η=${r.etaPeri.toExponential(3)}`
    + `  Δϖ=${r.dPhi === null ? 'ゲート下' : r.dPhi.toExponential(6)} rad/周  |ΔE/E|≤${r.dEmax.toExponential(1)}`);
  console.error(`  LJ ゲート: NS Ξ=${out.lj.ns.xi1.toExponential(3)}/${out.lj.ns.xi2.toExponential(3)} σ=${out.lj.ns.sigma.toExponential(3)} Θ=${out.lj.ns.theta}`
    + ` / 恒星 Ξ=${out.lj.star.xi1.toExponential(3)}/${out.lj.star.xi2.toExponential(3)} σ=${out.lj.star.sigma.toExponential(3)} on=${out.lj.star.on}`);
}

// ============================================================ FREEZE: ⚡ で κ を凍結 → 🧮🩺 へ流す
if (want('freeze')) {
  out.freeze = await pg.evaluate(() => {
    const W = window.__w251;
    // 「この RK4 の軌道で 1PN(較正質量)の半分を打ち消す κ」を解析式から解く:
    //   Δϖ_K = −2πκχ₁χ₂Gm₁m₂/(Mc²p) 、 Δϖ_1PN = 6πGM/(c²p)  →  κ* = 3M²/(χ₁χ₂ m₁m₂) · (1/2)
    const res = [];
    // Δϖ_K/Δϖ_1PN = −κ·χ₁χ₂·m₁m₂/(3M²) は**質量台帳に依らない**(m₁m₂/M² は f を約分する)。
    const k0 = (() => { const s = W.SYS.doubleAB; return 1.5 / (s.chi1 * s.chi2 * s.massRatioTerm); })();
    for (const sysKey of ['doubleAB', 'j1757', 'j1946']) {
      const s = W.SYS[sysKey];
      const kSelf = 1.5 / (s.chi1 * s.chi2 * s.massRatioTerm);
      for (const mm of ['obs', 'dfm']) {
        const L = W.ledger(s, mm), MM = L.m1 + L.m2;
        const dt = 2 * Math.PI * Math.sqrt(Math.pow(s.p / (1 - s.ecc * s.ecc), 3) / (s.G * MM)) / 8000;
        const z = W.run(sysKey, mm, 'current', { kappa: k0 }, s.ecc, dt, 6, {});
        const pn = 6 * Math.PI * s.G * MM / (s.c * s.c * s.p);
        res.push({ sys: sysKey, emoji: s.emoji, mm, kFrozen: k0, kSelf, ratioK: k0 / kSelf,
          dPhiK: z.dPhi, pn1: pn, cancelFrac: z.dPhi / pn, residualPct: (z.dPhi / pn + 0.5) / 0.5 * 100 });
      }
    }
    return { kFrozen: k0, rows: res };
  });
  console.error(`  FREEZE ⚡ で凍結した κ = ${out.freeze.kFrozen.toFixed(6)}`);
  for (const r of out.freeze.rows) console.error(`     ${r.emoji} ${r.sys}[${r.mm}]: 自系解 κ*=${r.kSelf.toFixed(6)}(比 ${r.ratioK.toFixed(6)})`
    + ` / Δϖ_K/Δϖ_1PN = ${r.cancelFrac.toFixed(6)}(−0.5 からの残差 ${r.residualPct.toFixed(4)}%)`);
}

out.pageErrors = pageErrors;
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error('→ ' + path.relative(ROOT, OUT));
await browser.close();

// 第136便 exp-qlockradial.mjs — qLockRadialAudit(qLock 半径方向ストレステスト)のフルハーネス。
// 目的: qLock の長所(追加 fit なしで参照点を LT 級に合わせる)と代償(参照点の外で r⁻³ 則を
//       捨てる)を、同一の実測・同一の図にする。
//
// 構成(統括裁定・実測前に固定):
//   中心天体 = 地球(実質量 5.9724×10²⁴kg・実半径 6.38×10⁶m・実自転 23.93h)。
//   規約は beta の 🌘earthMoonRealKF1 と同一(サンプル別スケール指数 1単位=10⁶m/10²s/10²⁵kg・
//   D₀=0.006・q=8.25〔qLock の LT整合則を月の実軌道を参照軌道として算出した値〕・
//   kRep=muF=γN=κ_S=0・geoPN=2・λ_PN=1・pnα=1.5・stateCarry:"double"・softening ε=0.1)。
//   プローブ = 質量床級(m=1e-6・pnSource なし)の試験粒子。e=0.05 の近円軌道・1 run 1 プローブ。
//   中心天体は pinned(反跳による運動引きずりの混入を断つ — §D でその混入量そのものを実測する)。
//
// 測定方式: kF1−kF0 同一構成差分(exp-kf1b の実証済み手法)。同一初期条件で kFrame=1 と
//   kFrame=0 を走らせ、近点移動/公転の差分 Δϖ_drag を取る。数値床・ソフトニング歳差は差分で
//   相殺する。近点移動は2方式(近点通過法=r 極小の放物線補間 / RL勾配法)で出す(emAudit と同形)。
//   加えて **u 場そのもの**(S.uAx/S.uAy/S.sumW)から フレーム角速度 ω_DFM(r) を直接読む —
//   時間積分を通さない厳密量で、力学差分が倍精度の丸め床を下回る外側域でも半径則が測れる。
//
// 事前登録窓 W1〜W5(統括が実測前に固定 — 実測後に動かさない。PASS/FAIL を問わず実測値を記録)。
// 実行: node tests/exp-qlockradial.mjs(playwright 必須・数分)→ tests/out/qlockradial-results.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildManifest, NOT_APPLICABLE, NOT_INSTRUMENTED } from './manifest.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + (TARGET.startsWith('/') ? TARGET : path.join(ROOT, TARGET));
const OUT_DIR = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(OUT_DIR, { recursive: true });

async function launch() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  try { const { chromium } = await import('playwright-core'); return await chromium.launch({ executablePath: exe }); } catch {}
  const { chromium } = await import('playwright');
  return chromium.launch({ executablePath: exe });
}

// ---- 規約(🌘earthMoonRealKF1 と同一)----
const PHYS = { G: 6.674, D0: 0.006, kFrame: 1, q: 8.25, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
  kappaT: 7.415555555555556e-9, cLight: 30000, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
  massFloor: 1e-6, geoPN: 2, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.1,
  timeScale: 1, stateCarry: 'double' };
const ME = 0.59724;        // 地球の実質量(10²⁵kg 単位)
const RE = 6.38;           // 地球の実半径(10⁶m 単位)
const SPIN = 0.0072921;    // 地球の実自転(rad/10²s = 23.93h 周期)
const MP = 1e-6;           // プローブ質量(massFloor 級)
const RP_DISP = 0.01;      // プローブ半径(接触・表示専用 — 重力は ε=0.1 のソフトニングで決まる)
const ECC = 0.05;
const A_MOON = 384.748;          // 月の軌道長半径(10⁶m)
const R_REF = 363.6253;          // qLock の参照軌道 = 🌘 の月の初期距離 a(1−e)(q*=8.25 を出した距離)
const R_IN = 1.5 * RE;           // 内側端 = 1.5 R_地球
const R_OUT = 2 * A_MOON;        // 外側端 = 2a_月
const Q_LOCK = 8.25, Q_FLAT = 3;
// 1公転あたりの步数。引きずり増分 Δv=kF·Δu は補償和に乗らない生の加算なので、|Δv| が
// 速度の ulp を下回ると 1 bit も積まれない = 引きずりが「記録されない」丸め床が生じる。
// Δu は 1步あたり ∝ dt なので、**粗い步幅ほど床が下がる**。主測定は粗側 NC で取り、
// NM(4倍細)と長窓(64公転)の3点一致で解像を機械判定する。W1(ソフトニング解析値照合)は
// 積分精度そのものを見る窓なので細側 NF で取る。
const NC = 1000, NM = 4000, NF = 4e5;
const ORBITS = 8;                // 事前登録窓 W2 と同じ 8公転窓
const ORBITS_LONG = 64;          // 解像判定用の長窓

// 対数等間隔9点(1.5R_地球 〜 2a_月)+ qLock 参照半径 1点 = 10点
const RADII = (() => {
  const rs = [];
  for (let k = 0; k <= 8; k++) rs.push(R_IN * Math.pow(R_OUT / R_IN, k / 8));
  rs.push(R_REF);
  return rs.sort((a, b) => a - b);
})();
const IREF = RADII.indexOf(R_REF);

// 解析値(すべて宣言済みの近似 — 本文に近似の明示を残す)
const Jspin = 0.4 * ME * RE * RE * SPIN;                    // 一様球近似の自転角運動量
const omLT = (r) => 2 * PHYS.G * Jspin / (PHYS.cLight * PHYS.cLight * r * r * r);   // Ω_LT=2GJ/(c₀²r³)
const softAnalytic = (a) => -3 * Math.PI * PHYS.softening * PHYS.softening
  / (a * a * Math.pow(1 - ECC * ECC, 2));                   // −3πε²/(a²(1−e²)²)
const kepT = (a) => 2 * Math.PI * Math.sqrt(a * a * a / (PHYS.G * ME));
// LT の赤道面順行軌道の近点移動(標準式 ϖ̇=Ω̇_node+ω̇_peri=−4GJ/(c₀²a³(1−e²)^{3/2}))
const dpomLT = (a) => -2 * omLT(a) / Math.pow(1 - ECC * ECC, 1.5) * kepT(a);
// log–log 傾き(最小二乗)
const slopeLL = (rs, ys) => {
  const pts = rs.map((r, i) => [Math.log(r), Math.log(Math.abs(ys[i]))])
    .filter((p) => Number.isFinite(p[1]));
  if (pts.length < 2) return NaN;
  let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (const [x, y] of pts) { sx += x; sy += y; sxx += x * x; sxy += x * y; }
  const n = pts.length;
  return (n * sxy - sx * sy) / (n * sxx - sx * sx);
};

const browser = await launch();
const page = await browser.newPage();
page.on('pageerror', (e) => console.error('PAGE ERROR:', e.message));
await page.goto(INDEX);
await page.waitForFunction(() => window.HP && HP.sim);
await page.exposeFunction('qlrLog', (s) => console.log(s));

const CTX = { PHYS, ME, RE, SPIN, MP, RP_DISP, ECC };

// 二体(中心天体+プローブ1個)を組み、近点移動を2方式で測る
const HARNESS = ({ PHYS, ME, RE, SPIN, MP, RP_DISP, ECC }) => {
  window.__qlr = {
    build(a, kF, q, spin, pin, mp, ecc) {
      const P = Object.assign({}, PHYS, { kFrame: kF, q });
      const e = (ecc === undefined) ? ECC : ecc;
      const GM = P.G * (pin ? ME : ME + mp);
      const rp = a * (1 - e), vp = Math.sqrt(GM * (1 + e) / rp);
      const fm = pin ? 0 : mp / (ME + mp);
      const S = HP.sim;
      S.build({ id: 'qlr', name: 'qlr', emoji: '🧭', seed: 1, camera: { scale: 900 },
        world: { boundary: 'none', size: 0 }, physics: P,
        bodies: [
          { type: 'single', m: ME, radius: RE, x: -rp * fm, y: 0, vx: 0, vy: -vp * fm,
            spin, pinned: !!pin, pnSource: true },
          { type: 'single', m: mp, radius: RP_DISP, x: rp * (1 - fm), y: 0, vx: 0,
            vy: vp * (1 - fm), spin: 0, pinned: false } ] });
      return { S, GM, T: 2 * Math.PI * Math.sqrt(a * a * a / GM) };
    },
    // u 場のフレーム角速度 ω_DFM(r)=(r×u)/r² を直接読む(1步だけ進めて場を確定させる)。
    // プローブは半径 r ちょうどに置く(e=0)ので、返る rr は指定した r と一致する
    uField(a, q) {
      const { S } = this.build(a, 1, q, SPIN, true, MP, 0);
      S.step(1e-9);
      const i = 1, rr = Math.hypot(S.x[i], S.y[i]);
      const denom = S.params.D0 + S.sumW[i];
      return { r: rr, w: S.sumW[i], chi: S.sumW[i] / denom,
        om: (-S.y[i] * S.uAx[i] + S.x[i] * S.uAy[i]) / (rr * rr * denom) };
    },
    run(a, kF, q, spin, pin, mp, N, orbits) {
      const { S, GM, T } = this.build(a, kF, q, spin, pin, mp);
      const dt = T / N, steps = Math.round(orbits * N);
      const SAMPLE = Math.max(1, Math.floor(steps / 8000));
      let pomPrev = null, pomUnw = 0, sT = 0, sP = 0, sTT = 0, sTP = 0, nS = 0;
      let r1 = null, r2 = null, th1 = 0, th2 = 0, t1 = 0;
      let eMin = 1e9, eMax = 0;
      const peri = [];
      for (let k = 0; k < steps; k++) {
        S.step(dt);
        const t = (k + 1) * dt;
        const dx = S.x[1] - S.x[0], dy = S.y[1] - S.y[0];
        const rr = Math.hypot(dx, dy), thn = Math.atan2(dy, dx);
        if (r1 !== null && r2 !== null && r1 < r2 && r1 < rr) {   // r の極小=近点通過(放物線補間)
          const den = (r2 - 2 * r1 + rr), dd = den !== 0 ? 0.5 * (r2 - rr) / den : 0;
          let dth = thn - th2;
          while (dth > Math.PI) dth -= 2 * Math.PI; while (dth < -Math.PI) dth += 2 * Math.PI;
          peri.push({ t: t1 + dd * dt, th: th1 + dd * (dth / 2) });
        }
        r2 = r1; th2 = th1; r1 = rr; th1 = thn; t1 = t;
        if (k % SAMPLE) continue;
        const vx = S.vx[1] - S.vx[0], vy = S.vy[1] - S.vy[0];
        const h = dx * vy - dy * vx;
        const ex = (vy * h) / GM - dx / rr, ey = (-vx * h) / GM - dy / rr;
        const ecc = Math.hypot(ex, ey), pom = Math.atan2(ey, ex);
        if (ecc < eMin) eMin = ecc; if (ecc > eMax) eMax = ecc;
        if (pomPrev !== null) { let d = pom - pomPrev;
          while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; pomUnw += d; }
        pomPrev = pom;
        sT += t; sP += pomUnw; sTT += t * t; sTP += t * pomUnw; nS++;
      }
      const slopeRL = (nS * sTP - sT * sP) / (nS * sTT - sT * sT);
      let acc = 0, prev = peri.length ? peri[0].th : 0;
      const pw = peri.map((p) => { let d = p.th - prev;
        while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
        acc += d; prev = p.th; return acc; });
      let qT = 0, qP = 0, qTT = 0, qTP = 0;
      for (let i = 0; i < peri.length; i++) { qT += peri[i].t; qP += pw[i];
        qTT += peri[i].t * peri[i].t; qTP += peri[i].t * pw[i]; }
      const nP = peri.length;
      const slopePe = nP >= 3 ? (nP * qTP - qT * qP) / (nP * qTT - qT * qT) : NaN;
      const Tper = nP >= 2 ? (peri[nP - 1].t - peri[0].t) / (nP - 1) : T;
      return { slopeRL, slopePe, Tper, T, nP, eMin, eMax, nan: S.hasNaN(),
        // 終状態(kF1 と kF0 の bit 一致判定に使う — 引きずり増分が v の ulp を下回ると
        // 速度更新に 1 bit も乗らず、軌道は完全に同一になる)
        fin: [S.x[1] - S.x[0], S.y[1] - S.y[0], S.vx[1] - S.vx[0], S.vy[1] - S.vy[0]],
        dpomRL: slopeRL * Tper, dpomPe: slopePe * Tper };
    },
  };
};
await page.evaluate(HARNESS, CTX);

const out = { target: TARGET, wave: 136,
  config: { units: '1単位=10⁶m/10²s/10²⁵kg', physics: PHYS, mEarth: ME, rEarth: RE, spinEarth: SPIN,
    mProbe: MP, ecc: ECC, pinned: true, orbits: ORBITS, orbitsLong: ORBITS_LONG,
    stepsPerOrbit: { NC, NM, NF },
    qLock: Q_LOCK, qFlat: Q_FLAT, radii: RADII, iRef: IREF, rRef: R_REF, rIn: R_IN, rOut: R_OUT,
    Jspin, JspinNote: '一様球近似 J=(2/5)MR²Ω(近似であることを宣言して用いる)' },
  windowsPreRegistered: {
    W1: 'kF0 対照(全プローブ)— Δϖ がソフトニング解析値 −3πε²/(a²(1−e²)²) と ±5% で一致',
    W2: '参照点(月軌道プローブ・qLock 版)— 近点回転周期 8.85年 ±15%(8公転窓)',
    W3: '引きずり差分 Δϖ_drag の符号 — 全プローブで順行(自転と同方向 = 正)',
    W4: '最外プローブ(r≈2a)の |Δϖ_drag| が参照点値の 1/8 未満(r⁻³ なら 1/8)',
    W5: 'q=3 対照との外側域(r≥参照半径)log–log 傾き差(q3 − qLock)が 3〜8' },
  uField: [], probes: [], spinSymmetry: [], recoil: {}, slopes: {}, windows: {} };

// ================= A) u 場の半径プロファイル(厳密量)=================
console.log('== A) u 場のフレーム角速度 ω_DFM(r)(時間積分を通さない厳密量)==');
for (const r of RADII) {
  const uq = await page.evaluate(({ r, q }) => window.__qlr.uField(r, q), { r, q: Q_LOCK });
  const u3 = await page.evaluate(({ r, q }) => window.__qlr.uField(r, q), { r, q: Q_FLAT });
  const LT = omLT(r);
  const bare = SPIN * Math.pow(RE / (RE + r), Q_LOCK);
  const row = { r, rMeasured: uq.r, rOverRE: r / RE, w: uq.w, chi: uq.chi,
    omQLock: uq.om, omQ3: u3.om,
    omBareAnalytic: bare, omChiBareAnalytic: uq.chi * bare, omLT: LT,
    ratioQLock: uq.om / LT, ratioQ3: u3.om / LT, ratioBare: bare / LT,
    isRef: Math.abs(r - R_REF) < 1e-9 };
  out.uField.push(row);
  console.log(`r=${r.toFixed(3)}(${(r / RE).toFixed(2)}R⊕) χ=${uq.chi.toFixed(5)} ` +
    `ω_DFM=${uq.om.toExponential(4)} Ω_LT=${LT.toExponential(4)} ω/Ω_LT=${row.ratioQLock.toExponential(4)} ` +
    `素のω/Ω_LT=${row.ratioBare.toExponential(4)} [q=3 対照 ω=${u3.om.toExponential(4)} 比=${row.ratioQ3.toExponential(4)}]`);
}

// ================= B) Δϖ_drag 半径プロファイル(kF1−kF0 同一構成差分)=================
// 主測定 = NC 步/公転 × ORBITS 公転(事前登録の 8公転窓)。
// 解像判定 = 主測定 / NM(4倍細)/ 長窓(ORBITS_LONG 公転)の3点が 10% 以内で一致するか。
//   引きずり増分は補償和に乗らないので、床に落ちた点は步幅・窓を変えると値が飛ぶ。
console.log(`\n== B) Δϖ_drag(kF1−kF0 同一構成差分・${ORBITS}公転窓・主測定 N=${NC} 步/公転)==`);
const VARIANTS = [['main', NC, ORBITS], ['fine', NM, ORBITS], ['long', NC, ORBITS_LONG]];
for (let i = 0; i < RADII.length; i++) {
  const a = RADII[i];
  const t0 = Date.now();
  const cell = {};
  for (const [tag, N, o] of VARIANTS) {
    const k0 = await page.evaluate(({ a, N, o }) =>
      window.__qlr.run(a, 0, 8.25, 0.0072921, true, 1e-6, N, o), { a, N, o });
    const kq = await page.evaluate(({ a, N, o, q }) =>
      window.__qlr.run(a, 1, q, 0.0072921, true, 1e-6, N, o), { a, N, o, q: Q_LOCK });
    const k3 = await page.evaluate(({ a, N, o, q }) =>
      window.__qlr.run(a, 1, q, 0.0072921, true, 1e-6, N, o), { a, N, o, q: Q_FLAT });
    cell[tag] = { N, orbits: o, kF0Pe: k0.dpomPe, kF0RL: k0.dpomRL, Tper: k0.Tper, nP: k0.nP,
      dragQLockPe: kq.dpomPe - k0.dpomPe, dragQLockRL: kq.dpomRL - k0.dpomRL,
      dragQ3Pe: k3.dpomPe - k0.dpomPe, dragQ3RL: k3.dpomRL - k0.dpomRL,
      eMin: kq.eMin, eMax: kq.eMax, nan: k0.nan || kq.nan || k3.nan };
  }
  // W1 用の細步幅 kF0(積分精度そのものを見るのでここだけ NF)
  const kF0fine = await page.evaluate(({ a, N, o }) =>
    window.__qlr.run(a, 0, 8.25, 0.0072921, true, 1e-6, N, o), { a, N: NF, o: ORBITS });
  // スピン反転(奇数次=引きずり本体 / 偶数次+床)
  const kMinus = await page.evaluate(({ a, N, o, q }) =>
    window.__qlr.run(a, 1, q, -0.0072921, true, 1e-6, N, o), { a, N: NC, o: ORBITS, q: Q_LOCK });
  const soft = softAnalytic(a);
  const spread = (vals) => {
    const f = vals.filter((v) => Number.isFinite(v));
    if (!f.length || f.some((v) => v === 0)) return Infinity;
    const mx = Math.max(...f.map(Math.abs)), mn = Math.min(...f.map(Math.abs));
    if (f.some((v) => v * f[0] < 0)) return Infinity;      // 符号が割れたら床
    return (mx - mn) / mn;
  };
  const dQL = VARIANTS.map(([t]) => cell[t].dragQLockPe);
  const dQ3 = VARIANTS.map(([t]) => cell[t].dragQ3Pe);
  const row = { r: a, isRef: i === IREF, soft,
    kF0Pe: kF0fine.dpomPe, kF0Ratio: kF0fine.dpomPe / soft, kF0RL: kF0fine.dpomRL,
    kF0PeCoarse: cell.main.kF0Pe, kF0RatioCoarse: cell.main.kF0Pe / soft,
    dragQLock: cell.main.dragQLockPe, dragQLockRL: cell.main.dragQLockRL,
    dragQLockFine: cell.fine.dragQLockPe, dragQLockLong: cell.long.dragQLockPe,
    dragQ3: cell.main.dragQ3Pe, dragQ3RL: cell.main.dragQ3RL,
    dragQ3Fine: cell.fine.dragQ3Pe, dragQ3Long: cell.long.dragQ3Pe,
    spreadQLock: spread(dQL), spreadQ3: spread(dQ3),
    dragMinusSpin: kMinus.dpomPe - cell.main.kF0Pe,
    Torb: cell.main.Tper, dpomLT: dpomLT(a),
    eMin: kF0fine.eMin, eMax: kF0fine.eMax, eMinCoarse: cell.main.eMin, eMaxCoarse: cell.main.eMax,
    nan: VARIANTS.some(([t]) => cell[t].nan) || kF0fine.nan,
    cells: cell };
  row.resolvedQLock = row.spreadQLock <= 0.10;
  row.resolvedQ3 = row.spreadQ3 <= 0.10;
  row.dragOverLT = row.dragQLock / row.dpomLT;
  row.spinOdd = (row.dragQLock - row.dragMinusSpin) / 2;
  row.spinEven = (row.dragQLock + row.dragMinusSpin) / 2;
  // 引きずり 1步分の増分と速度の ulp の比(床の物理的な由来 — 記録用の解析見積り)
  const uAt = out.uField[i], vAt = Math.sqrt(PHYS.G * ME / a);
  row.duPerStepOverUlp = (2 * Math.PI * a * 9 * Math.abs(uAt.omQLock) / NC)
    / (Math.abs(vAt) * Math.pow(2, -52));
  out.probes.push(row);
  out.spinSymmetry.push({ r: a, dragPlusSpin: row.dragQLock, dragMinusSpin: row.dragMinusSpin,
    odd: row.spinOdd, even: row.spinEven });
  console.log(`r=${a.toFixed(3)} kF0=${row.kF0Pe.toExponential(4)}(解析比 ${row.kF0Ratio.toFixed(4)}) ` +
    `Δϖ_drag(qLock)=${row.dragQLock.toExponential(4)}${row.resolvedQLock ? '' : '[床]'} ` +
    `(ばらつき ${Number.isFinite(row.spreadQLock) ? (row.spreadQLock * 100).toFixed(1) + '%' : '∞'}) ` +
    `(q=3)=${row.dragQ3.toExponential(4)}${row.resolvedQ3 ? '' : '[床]'} ` +
    `Δϖ_LT=${row.dpomLT.toExponential(3)} e=${row.eMin.toFixed(5)}〜${row.eMax.toFixed(5)} ` +
    `[${((Date.now() - t0) / 1000).toFixed(1)}s]`);
}

// ================= C) スピン反転の対称性(奇数次=引きずり本体 / 偶数次+数値床)=================
console.log('\n== C) スピン反転の対称性(qLock・主測定)==');
for (const row of out.spinSymmetry) {
  console.log(`r=${row.r.toFixed(3)} Δϖ(+s)=${row.dragPlusSpin.toExponential(4)} ` +
    `Δϖ(−s)=${row.dragMinusSpin.toExponential(4)} ` +
    `奇数次=${row.odd.toExponential(4)} 偶数次+床=${row.even.toExponential(3)}`);
}

// ================= D) 反跳(運動引きずり)対照 — 参照点・自由地球・プローブ質量掃引 =================
// 🌘 の 8.85年は「地球が重心のまわりを回る」運動引きずりが駆動する。試験粒子(質量床)では
// その駆動源が消えることを、プローブ質量の掃引で直接示す。
console.log('\n== D) 反跳(運動引きずり)対照 — 参照点 r=R_REF・地球 free ==');
out.recoil.rows = [];
for (const mp of [1e-6, 7.346e-5, 7.346e-3]) {
  const k0 = await page.evaluate(({ a, N, o, mp }) =>
    window.__qlr.run(a, 0, 8.25, 0.0072921, false, mp, N, o), { a: R_REF, N: NC, o: ORBITS, mp });
  const k1 = await page.evaluate(({ a, N, o, mp }) =>
    window.__qlr.run(a, 1, 8.25, 0.0072921, false, mp, N, o), { a: R_REF, N: NC, o: ORBITS, mp });
  const d = k1.dpomPe - k0.dpomPe;
  const yr = 2 * Math.PI * k0.Tper / d / 315576;
  out.recoil.rows.push({ mProbe: mp, massRatio: mp / ME, drag: d, apsidalYears: yr });
  console.log(`m_probe=${mp.toExponential(3)}(m/M=${(mp / ME).toExponential(3)}) ` +
    `Δϖ_drag=${d.toExponential(4)} 近点回転周期=${yr.toFixed(3)}年`);
}
out.recoil.note = '自由二体(pinned なし)では Δϖ_drag がプローブ質量にほぼ比例する — ' +
  '🌘 の 8.85年は自転(スピン引きずり)ではなく地球の重心運動(運動引きずり)が駆動していることの直接確認。';

// ================= E) 事前登録窓 W1〜W5 の判定 =================
const P = out.probes, U = out.uField;
const refP = P[IREF], outP = P[P.length - 1];
const outerIdx = P.map((p, i) => i).filter((i) => P[i].r >= R_REF - 1e-9);
const resolvedIdx = P.map((p, i) => i).filter((i) => P[i].resolvedQLock && P[i].resolvedQ3);

// W1
const w1 = P.map((p) => ({ r: p.r, ratio: p.kF0Ratio, ok: Math.abs(p.kF0Ratio - 1) <= 0.05 }));
out.windows.W1 = { pass: w1.every((v) => v.ok), rows: w1,
  worst: w1.reduce((a, b) => (Math.abs(b.ratio - 1) > Math.abs(a.ratio - 1) ? b : a)) };
// W2
const w2yr = 2 * Math.PI * refP.Torb / refP.dragQLock / 315576;
const w2yrQ3 = 2 * Math.PI * refP.Torb / refP.dragQ3 / 315576;
out.windows.W2 = { pass: Number.isFinite(w2yr) && w2yr > 8.85 * 0.85 && w2yr < 8.85 * 1.15,
  apsidalYears: w2yr, dragAtRef: refP.dragQLock, resolved: refP.resolvedQLock,
  apsidalYearsQ3: w2yrQ3, dragAtRefQ3: refP.dragQ3,
  target: 8.85, tol: 0.15 };
// W3
const w3 = P.map((p) => ({ r: p.r, drag: p.dragQLock, prograde: p.dragQLock > 0 }));
out.windows.W3 = { pass: w3.every((v) => v.prograde), rows: w3,
  omegaProgradeAll: U.every((u) => u.omQLock > 0),
  note: 'ω_DFM(フレームそのものの回転)の符号と Δϖ_drag(近点移動)の符号は別物 — 実測を両方記録する。' };
// W4
const w4ratio = Math.abs(outP.dragQLock) / Math.abs(refP.dragQLock);
out.windows.W4 = { pass: w4ratio < 1 / 8, ratio: w4ratio,
  dragOuter: outP.dragQLock, dragRef: refP.dragQLock,
  resolvedOuter: outP.resolvedQLock, resolvedRef: refP.resolvedQLock };
// W5(事前登録=外側域 r≥参照半径 の Δϖ_drag 傾き差。参考値として ω_DFM 側の傾き差も記録)
const sl = (idx, key) => slopeLL(idx.map((i) => P[i].r), idx.map((i) => P[i][key]));
const slU = (idx, key) => slopeLL(idx.map((i) => U[i].r), idx.map((i) => U[i][key]));
const w5dpom = { qLock: sl(outerIdx, 'dragQLock'), q3: sl(outerIdx, 'dragQ3') };
w5dpom.diff = w5dpom.q3 - w5dpom.qLock;
const w5om = { qLock: slU(outerIdx, 'omQLock'), q3: slU(outerIdx, 'omQ3') };
w5om.diff = w5om.q3 - w5om.qLock;
const w5res = { qLock: sl(resolvedIdx, 'dragQLock'), q3: sl(resolvedIdx, 'dragQ3') };
w5res.diff = w5res.q3 - w5res.qLock;
// 外側漸近域 = r ≥ 10R_地球(そこで初めて (R/(R+r))^q ≈ (R/r)^q の冪則域に入る)かつ
// 両曲線とも解像した半径。事前登録窓の判定には使わない**付帯記録**である。
const asympIdx = P.map((p, i) => i)
  .filter((i) => P[i].r >= 10 * RE && P[i].resolvedQLock && P[i].resolvedQ3);
const w5asy = { qLock: sl(asympIdx, 'dragQLock'), q3: sl(asympIdx, 'dragQ3') };
w5asy.diff = w5asy.q3 - w5asy.qLock;
out.windows.W5 = { pass: w5dpom.diff >= 3 && w5dpom.diff <= 8, byDpomOuter: w5dpom,
  byOmegaOuter: w5om, byDpomResolvedBand: w5res, byDpomAsymptoticBand: w5asy,
  passByOmega: w5om.diff >= 3 && w5om.diff <= 8,
  passByAsymptotic: w5asy.diff >= 3 && w5asy.diff <= 8,
  outerRadii: outerIdx.map((i) => P[i].r), resolvedRadii: resolvedIdx.map((i) => P[i].r),
  asymptoticRadii: asympIdx.map((i) => P[i].r),
  asymptoticBandDef: 'r ≥ 10R_地球 かつ Δϖ_drag が両曲線とも解像した半径(付帯記録)',
  outerResolvedQLock: outerIdx.every((i) => P[i].resolvedQLock) };

// 傾きの実測記録(W4 の付帯記録・図の生成元)
const lastResolved = resolvedIdx.length ? resolvedIdx[resolvedIdx.length - 1] : -1;
out.slopes = {
  omegaQLockOuter: w5om.qLock, omegaQ3Outer: w5om.q3,
  omegaQLockAll: slU(U.map((u, i) => i), 'omQLock'), omegaQ3All: slU(U.map((u, i) => i), 'omQ3'),
  ratioQLockOuter: slopeLL(outerIdx.map((i) => U[i].r), outerIdx.map((i) => U[i].ratioQLock)),
  dpomQ3Outer: w5dpom.q3, dpomQLockOuter: w5dpom.qLock,
  // Δϖ_drag ∝ ω_DFM·T(T∝r^{3/2})の検証 — q=3 は外側域で両方が解像しているので傾き差が
  // +1.5 に一致するはずで、実測がそれを満たせば「ω_DFM の傾きを Δϖ の傾きの代理に使える」
  dpomMinusOmegaSlopeQ3Outer: w5dpom.q3 - w5om.q3, expectedOffset: 1.5,
  lastResolvedRadiusQLock: lastResolved >= 0 ? P[lastResolved].r : null,
  omegaLTReference: -3, dpomLTReference: -1.5,
  note: 'Ω_LT は r⁻³(rad/時間)、Δϖ_LT/公転は T∝r^{3/2} を掛けて r^{−3/2}。' +
    'DFM は χ(r)·(R/(R+r))^q なので、外側域では約 −(1+q) 乗(rad/時間)へ落ちる。' };

// 内側飽和域の記録
out.innerSaturation = {
  chiByRadius: U.map((u) => ({ r: u.r, chi: u.chi })),
  chiInnermost: U[0].chi, chiOutermost: U[U.length - 1].chi,
  ratioInnermost: U[0].ratioQLock, ratioRef: U[IREF].ratioQLock, ratioOutermost: U[U.length - 1].ratioQLock,
  crossingRadius: (() => {   // ω_DFM=Ω_LT となる半径(対数内挿)
    for (let i = 1; i < U.length; i++) {
      const a = Math.log(U[i - 1].ratioQLock), b = Math.log(U[i].ratioQLock);
      if ((a > 0) !== (b > 0)) {
        const f = a / (a - b);
        return Math.exp(Math.log(U[i - 1].r) + f * (Math.log(U[i].r) - Math.log(U[i - 1].r)));
      }
    } return null;
  })(),
  note: 'χ=w/(D₀+w) は内側で 1 へ飽和し、ω_DFM は s·(R/(R+r))^q の有限値に留まる。' +
    'Ω_LT は r⁻³ で発散するので、比 ω_DFM/Ω_LT は内側で巨大になる — LT 発散と DFM 飽和の差。' };

// 収束確認(N1 vs N2)
out.convergence = P.map((p) => ({ r: p.r,
  dragMain: p.dragQLock, dragFine: p.dragQLockFine, dragLong: p.dragQLockLong,
  spread: p.spreadQLock, resolved: p.resolvedQLock,
  dragQ3Main: p.dragQ3, dragQ3Fine: p.dragQ3Fine, dragQ3Long: p.dragQ3Long, spreadQ3: p.spreadQ3,
  kF0RatioCoarse: p.kF0RatioCoarse, kF0RatioFine: p.kF0Ratio,
  duPerStepOverUlp: p.duPerStepOverUlp }));

console.log('\n== E) 事前登録窓の判定 ==');
console.log(`W1 kF0 ソフトニング一致(±5%): ${out.windows.W1.pass ? 'PASS' : 'FAIL'} ` +
  `最悪 r=${out.windows.W1.worst.r.toFixed(3)} 比=${out.windows.W1.worst.ratio.toFixed(4)}`);
console.log(`W2 参照点の近点回転周期(8.85年±15%): ${out.windows.W2.pass ? 'PASS' : 'FAIL'} ` +
  `実測=${w2yr.toExponential(4)}年(Δϖ_drag=${refP.dragQLock.toExponential(4)}・解像=${refP.resolvedQLock})`);
console.log(`W3 Δϖ_drag が全プローブで順行: ${out.windows.W3.pass ? 'PASS' : 'FAIL'} ` +
  `(ω_DFM の順行は ${out.windows.W3.omegaProgradeAll ? '全点 PASS' : 'NG'})`);
console.log(`W4 最外/参照点 < 1/8: ${out.windows.W4.pass ? 'PASS' : 'FAIL'} 比=${w4ratio.toExponential(3)}`);
console.log(`W5 外側域 傾き差(q3−qLock)3〜8: ${out.windows.W5.pass ? 'PASS' : 'FAIL'} ` +
  `Δϖ基準=${w5dpom.diff.toFixed(3)}(qLock ${w5dpom.qLock.toFixed(3)} / q3 ${w5dpom.q3.toFixed(3)}) ` +
  `ω_DFM基準=${w5om.diff.toFixed(3)}(qLock ${w5om.qLock.toFixed(3)} / q3 ${w5om.q3.toFixed(3)}) ` +
  `外側漸近域(付帯記録)=${w5asy.diff.toFixed(3)}(qLock ${w5asy.qLock.toFixed(3)} / q3 ${w5asy.q3.toFixed(3)}・` +
  `r=${asympIdx.map((i) => P[i].r.toFixed(1)).join('/')})`);
console.log(`内側飽和: χ=${U[0].chi.toFixed(4)}(最内)→${U[U.length - 1].chi.toFixed(4)}(最外)・` +
  `ω/Ω_LT=${U[0].ratioQLock.toExponential(3)}(最内)/${U[IREF].ratioQLock.toFixed(4)}(参照)/` +
  `${U[U.length - 1].ratioQLock.toExponential(3)}(最外)・交点 r≈${out.innerSaturation.crossingRadius?.toFixed(1)}`);

// ---- 第145便: 実験マニフェスト(生成来歴・数値環境・分類・判定ポインタ・健全性)-------------
// 測定ロジック・数値は一切変更していない。結果へ `manifest` キーを1本足すだけの additive 変更。
out.manifest = await buildManifest({
  root: ROOT, scriptUrl: import.meta.url, page, browser, payload: out,
  target: TARGET,
  experiment: { id: 'qlockradial', wave: 136,
    title: 'qLockRadialAudit — qLock の半径方向ストレステスト(参照点の外で r⁻³ 則を捨てる代償の実測)',
    command: 'node tests/exp-qlockradial.mjs' },
  presets: { mode: 'dynamic',
    declaredIn: 'PHYS 定数群+ハーネス冒頭の宣言値(ME/RE/SPIN/MP/ECC/RADII…)',
    declaration: '動的構成(内蔵プリセットを読まず、🌘earthMoonRealKF1 と同一規約の宣言値から build する)',
    configs: { physics: PHYS, mEarth: ME, rEarth: RE, spinEarth: SPIN, mProbe: MP, rProbe: RP_DISP,
      ecc: ECC, radii: RADII, rRef: R_REF, rIn: R_IN, rOut: R_OUT, qLock: Q_LOCK, qFlat: Q_FLAT,
      pinned: true },
    note: '規約は beta の 🌘earthMoonRealKF1 と同一(単位 1=10⁶m/10²s/10²⁵kg)。中心天体は pinned で、' +
      '反跳による運動引きずりの混入は §D(recoil)で別途実測している' },
  numerics: {
    seed: NOT_APPLICABLE,
    dt: 'dt = T_orbit / N(N は下記 stepsPerOrbit。半径ごとに T_orbit が異なるため dt も異なる)',
    timeScale: 1, substeps: NOT_APPLICABLE,
    steps: { coarse: `${NC} 步/公転 × ${ORBITS} 公転`, medium: `${NM} 步/公転 × ${ORBITS} 公転`,
      fine: `${NF} 步/公転 × ${ORBITS} 公転(W1 用)`, long: `${NC} 步/公転 × ${ORBITS_LONG} 公転` },
    window: { main: `${ORBITS} 公転(事前登録窓 W2 と同一)`, long: `${ORBITS_LONG} 公転(解像判定用)`,
      note: '主測定は粗側 NC。NM(4倍細)と長窓の3点一致で解像を機械判定する(convergence)' },
    warmup: NOT_APPLICABLE,
    numericalFloor: '引きずり増分 Δv=kF·Δu が速度の ulp を下回ると 1 bit も積まれない丸め床がある。' +
      '床の判定は probes.*.resolvedQLock に記録済み',
  },
  classification: {
    input: ['地球の実質量 5.9724×10²⁴kg・実半径 6.38×10⁶m・実自転 23.93h(観測由来の外部入力)',
      'D₀=0.006(既存の共有較正値 — 本便で再フィットしない)',
      'q=8.25(qLock の LT 整合則を月の実軌道 R_REF=363.6253 を参照軌道として**算出**した値)',
      'プローブ配置(対数等間隔9点+参照半径1点)・e=0.05・窓・步数(実測前に固定)'],
    fit: [],
    derived: ['u 場のフレーム角速度 ω_DFM(r)(時間積分を通さない厳密量 — uField)',
      '近点移動 Δϖ(近点通過法・RL 勾配法の2方式 — probes)',
      '引きずり差分 Δϖ_drag = kF1 − kF0(同一構成差分)',
      'log–log 傾き(slopes)・内側飽和(innerSaturation)・収束(convergence)',
      '反跳混入量(recoil)・スピン対称性(spinSymmetry)'],
    holdOut: [],
    note: '本便は追加の当てはめを一つも持たない(fit は空)。q=8.25 は算出値、D₀=0.006 は既存の共有値。' +
      '事前登録窓 W1〜W5 は実測前に固定し実測後に動かしていない',
  },
  judgement: {
    pointers: ['windowsPreRegistered', 'windows.W1', 'windows.W2', 'windows.W3', 'windows.W4',
      'windows.W5', 'uField', 'probes', 'slopes', 'convergence', 'innerSaturation', 'recoil',
      'spinSymmetry'],
    note: '許容窓は windowsPreRegistered(実測前固定の文言)、判定と実測値・比・残差は windows.W1〜W5 に' +
      '構造ごと入っている。W1 の外部解析値はソフトニング歳差 −3πε²/(a²(1−e²)²)、W2 は近点回転周期 8.85 年',
    externalReferences: ['ソフトニング歳差の解析値 −3πε²/(a²(1−e²)²)(W1 の照合先)',
      '月の近点回転周期 8.85 年(W2 の照合先)',
      'Lense–Thirring 角速度 Ω_LT(内側飽和・ω 比の照合先)',
      '一様球近似の自転角運動量 J=(2/5)MR²Ω(近似であることを config.JspinNote で宣言済み)'],
  },
  health: {
    conservation: { status: NOT_INSTRUMENTED,
      note: '中心天体を pinned にしているため運動量は原理的に閉じない構成である(その代わり反跳の' +
        '混入量そのものを recoil で実測している)。保存量残差は記録していない' },
  },
});

fs.writeFileSync(path.join(OUT_DIR, 'qlockradial-results.json'), JSON.stringify(out, null, 2));
console.log('\nsaved: tests/out/qlockradial-results.json');
await browser.close();

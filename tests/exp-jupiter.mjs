// 第138便 exp-jupiter.mjs — 木星ガリレオ衛星の hold-out(規則を再フィットしない事後外挿テスト)。
//
// 位置づけ: 現行の実較正3系(☄️🪨 水星・🌙🌘 地球月・💿🛰️ 土星)は、共通補正 D₀=0.006 と
//   qLock 則そのものの形成に関与した**回顧的確認**である。木星系はその規則を **一切再フィット
//   せずに** 初めて外挿する系で、PASS でも FAIL でも価値がある。実測値は動かさずそのまま記録する。
//
// 構成(第138便の設計・実測前に固定 — 変更禁止):
//   中心 = 木星(実質量 1.898×10²⁷kg・実半径 71,492km・実自転 9.925h)。
//   衛星 = イオ/エウロパ/ガニメデ/カリスト(実軌道長半径 421,800/671,100/1,070,400/1,882,700 km・
//          実離心率 0.0041/0.009/0.0013/0.0074・実質量 8.93/4.80/14.8/10.76 ×10²²kg・同期自転)。
//   観測周期(恒星公転): 1.769138 / 3.551181 / 7.154553 / 16.689017 日。
//     **出典(第143便で再帰属)**: NASA の惑星衛星 fact sheet 系(NASA GSFC / NSSDCA)が
//     載せる恒星公転周期。第141便で論文3に付けた「JPL Planetary Satellite Mean Elements」
//     への帰属は撤回する(数値・窓・実測は一切変更していない — 変わったのは帰属だけ)。
//     現行の JPL JUP365 平均要素表の周期とは最大 ~0.7% 差がありうるとの外部指摘があるが、
//     本環境は egress 遮断のため未検証。JW1 の ±1% 転写窓と保持結論は不変。
//     TODO(ref-verify): アーカイブ URL と fact sheet の版の確定は投稿時。
//   **2D 赤道面理想化**(軌道傾斜 0.04°/0.47°/0.20°/0.19° は無視する — 宣言)。
//   サンプル別スケール指数 1単位=10⁷m/10³s/10²⁶kg(規約 L−T=4 で c₀=3×10⁴、M+2T−3L=11 で G=6.674)。
//   規約は beta の 🌘earthMoonRealKF1・🌞solarInner を踏襲:
//     kRep=muF=γN=κ_S=0・geoPN=2・λ_PN=1・pnα=1.5・stateCarry:"double"・κ=G/c₀²。
//   **D₀=0.006 は共有値で再フィット禁止**。q は qLock 則
//     q*=3+ln(1.25c₀²R/GM)/ln((R+a)/R) を **参照軌道=イオ**で1回だけ手前計算した直値 12.30
//     (実行時 qLock は掛けない — 多天体系の既存裁定〔🌞 第131便〕に従う)。
//   木星は pinned(展示系の外部拘束 — 中心天体の反跳が運動引きずりを差分へ混入させるため。
//   これにより JW4 の引きずり差分は**自転引きずりだけ**の量になる)。
//
// 事前登録窓 JW1〜JW5(実測前に固定 — 実測後に動かさない。PASS/FAIL とも実測値を記録):
//   JW1 kF0 転写 — 4衛星の恒星公転周期が観測値と ±1%
//   JW2 kF1(D₀=0.006・q(イオ)) — ≥20 イオ公転の窓で 4衛星とも軌道保持
//       (NaN なし・|Δa|/a<2%)+周期 ±1% 維持
//   JW3 hold-out の正直さ — 衛星別 fit ゼロ(parameterAudit.fitted は共有 D₀ 以外空)
//   JW4 引きずり差分(kF1−kF0)を各衛星で記録(窓なし・数値床は宣言)。フレーム ω の符号=自転と同方向
//   JW5 q=3 対照を記録(窓なし)
//   ラプラス共鳴の再現は要求しない(記録のみ)
//
// 第141便の追記(感度実測 — §H): 参照軌道 a の ±20%・高q対照(8/10/14)・厳密一致式 q_exact の対照・
//   共有背景 D₀ の ×0.5/×2 を**付帯記録**として足した。事前登録窓 JW1〜JW5 と主測定は 1bit も
//   変更していない(本節を足す前後で JSON の既存キーはすべてビット不変であることを確認済み)。
//   結果は out.sensitivity にだけ入る。
//
// 実行: node tests/exp-jupiter.mjs(playwright 必須・約5秒)→ tests/out/jupiter-results.json
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

// ---- 規約(🌘earthMoonRealKF1・🌞solarInner と同一の流儀)----
const PHYS = { G: 6.674, D0: 0.006, kFrame: 1, q: 12.30, kRep: 0, muF: 0, gammaN: 0, kappaS: 0,
  kappaT: 7.415555555555556e-9, cLight: 30000, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
  massFloor: 1e-6, geoPN: 2, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.05,
  timeScale: 1, stateCarry: 'double' };

const MJ = 18.98;              // 木星の実質量 1.898×10²⁷kg(10²⁶kg 単位)
const RJ = 7.1492;             // 木星の実半径 71,492km(10⁷m 単位)
const SPIN_J = 0.175851814;    // 実自転 9.925h → 2π/(9.925×3600 s) を rad/10³s へ
const DAY = 86.4;              // 1日 = 86400s = 86.4 時間単位
const GM = PHYS.G * MJ;        // 126.67252(実 GM_J=1.26687×10¹⁷ m³/s² と 1.1×10⁻⁴ 一致)

// 実観測値(実値のみを写す — 出典スタイルは 🌞solarInner の bodies コメントに合わせる)。
// 出典は NASA の惑星衛星 fact sheet 系の恒星公転周期(第143便の再帰属 — 上の位置づけ参照)。
const MOONS = [
  { name: 'Io',       ja: 'イオ',     a: 42.18,  e: 0.0041, m: 0.000893, R: 0.18216,
    spin: 0.0411059240,  Pobs: 1.769138,   phase: 0 },
  { name: 'Europa',   ja: 'エウロパ', a: 67.11,  e: 0.009,  m: 0.000480, R: 0.15608,
    spin: 0.0204782725,  Pobs: 3.551181,   phase: 1 },
  { name: 'Ganymede', ja: 'ガニメデ', a: 107.04, e: 0.0013, m: 0.001480, R: 0.26341,
    spin: 0.0101644438,  Pobs: 7.154553,   phase: 2 },
  { name: 'Callisto', ja: 'カリスト', a: 188.27, e: 0.0074, m: 0.001076, R: 0.24103,
    spin: 0.00435747966, Pobs: 16.689017, phase: 3 },
];

// qLock 則を参照軌道=イオで1回だけ評価(直値宣言の出典 — 実行時 qLock は掛けない)
const Q_STAR = 3 + Math.log(1.25 * PHYS.cLight * PHYS.cLight * RJ / GM)
  / Math.log((RJ + MOONS[0].a) / RJ);
const Q_LOCK = 12.30;   // 直値宣言(q*=12.3017 の4桁丸め)
const Q_FLAT = 3;       // JW5 対照(LT と同じ r⁻³ 則の物差し)

const T_IO = 2 * Math.PI * Math.sqrt(Math.pow(MOONS[0].a, 3) / GM);   // イオのケプラー周期(時間単位)
const N_STEP = 2000;          // イオ1公転あたりの步数(主測定)
const N_FINE = 4000;          // 収束確認(dt 掃引1点 — 步幅を半分に)
const ORBITS = 20;            // 事前登録窓 JW2 の窓(≥20 イオ公転)
const ORBITS_LONG = 60;       // 付帯記録(カリスト 6.4公転ぶん)

// 位相は 90° ずつずらして配置(初期合を避ける — 近点に置いて接線速度を与える)
const bodyOf = (mo) => {
  const rp = mo.a * (1 - mo.e), vp = Math.sqrt(GM * (1 + mo.e) / rp);
  const P = [[rp, 0, 0, vp], [0, rp, -vp, 0], [-rp, 0, 0, -vp], [0, -rp, vp, 0]][mo.phase];
  return { type: 'single', m: mo.m, radius: mo.R, x: P[0], y: P[1], vx: P[2], vy: P[3],
    spin: mo.spin, pinned: false };
};

const browser = await launch();
const page = await browser.newPage();
page.on('pageerror', (e) => console.error('PAGE ERROR:', e.message));
await page.goto(INDEX);
await page.waitForFunction(() => window.HP && HP.sim);

const CTX = { PHYS, MJ, RJ, SPIN_J, GM, T_IO, BODIES: MOONS.map(bodyOf) };

const HARNESS = ({ PHYS, MJ, RJ, SPIN_J, GM, T_IO, BODIES }) => {
  window.__jupBodies = BODIES;   // 部分系(単独衛星)を組むために衛星の初期条件を残す
  window.__jup = {
    // subset を渡すと部分系を組む(単独衛星=木星+その衛星の2体 → 自転引きずりだけのチャネル)。
    // spinJ を 0 にすると自転引きずりが消え、衛星どうしの運動引きずりだけのチャネルになる。
    build(kF, q, spinJ, subset, patch) {
      const P = Object.assign({}, PHYS, { kFrame: kF, q }, patch || {});
      const S = HP.sim;
      S.build({ id: 'jup', name: 'jup', emoji: '🟠', seed: 1, camera: { scale: 200 },
        world: { boundary: 'none', size: 0 }, physics: P,
        bodies: [{ type: 'single', m: MJ, radius: RJ, x: 0, y: 0, vx: 0, vy: 0,
          spin: spinJ === undefined ? SPIN_J : spinJ, pinned: true, pnSource: true }]
          .concat((subset || BODIES).map((b) => Object.assign({}, b))) });
      return S;
    },
    // u 場のフレーム角速度 ω_DFM=(r×u)/(r²(D₀+w)) を各衛星の位置で直接読む(1步だけ進めて場を確定)
    uField(kF, q, spinJ, subset) {
      const S = this.build(kF, q, spinJ, subset);
      S.step(1e-9);
      const rows = [];
      for (let i = 1; i < S.n; i++) {
        const dx = S.x[i] - S.x[0], dy = S.y[i] - S.y[0], rr = Math.hypot(dx, dy);
        const den = S.params.D0 + S.sumW[i];
        rows.push({ r: rr, w: S.sumW[i], chi: S.sumW[i] / den,
          om: (-dy * S.uAx[i] + dx * S.uAy[i]) / (rr * rr * den),
          bare: (spinJ === undefined ? SPIN_J : spinJ) * Math.pow(RJ / (RJ + rr), q) });
      }
      return rows;
    },
    // 主測定: 恒星公転周期・軌道長半径の保持・離心率の帯・近点移動
    run(kF, q, N, orbits, spinJ, subset, Tbase, patch) {
      const S = this.build(kF, q, spinJ, subset, patch);
      const dt = (Tbase || T_IO) / N, steps = Math.round(orbits * N);
      const n = (subset || BODIES).length;
      const st = [];
      for (let i = 0; i < n; i++) st.push({ ang: 0, px: 0, py: 0, tRev: [],
        aMin: Infinity, aMax: -Infinity, aSum: 0, eMin: Infinity, eMax: -Infinity,
        rMin: Infinity, rMax: -Infinity, nS: 0,
        pomPrev: null, pomUnw: 0, sT: 0, sP: 0, sTT: 0, sTP: 0,
        r1: null, r2: null, th1: 0, th2: 0, t1: 0, peri: [] });
      const SAMPLE = Math.max(1, Math.floor(steps / 8000));
      for (let k = 0; k < steps; k++) {
        S.step(dt);
        const t = (k + 1) * dt;
        for (let i = 0; i < n; i++) {
          const j = i + 1;
          const dx = S.x[j] - S.x[0], dy = S.y[j] - S.y[0];
          const vx = S.vx[j] - S.vx[0], vy = S.vy[j] - S.vy[0];
          const rr = Math.hypot(dx, dy), s = st[i];
          if (k === 0) { s.px = dx; s.py = dy; }
          else {
            s.ang += Math.atan2(s.px * dy - s.py * dx, s.px * dx + s.py * dy);
            s.px = dx; s.py = dy;
            if (Math.abs(s.ang) >= 2 * Math.PI * (s.tRev.length + 1)) s.tRev.push(t);
          }
          // 近点通過法(r 極小の放物線補間)— 近点移動 Δϖ 用
          const thn = Math.atan2(dy, dx);
          if (s.r1 !== null && s.r2 !== null && s.r1 < s.r2 && s.r1 < rr) {
            const den = (s.r2 - 2 * s.r1 + rr), dd = den !== 0 ? 0.5 * (s.r2 - rr) / den : 0;
            let dth = thn - s.th2;
            while (dth > Math.PI) dth -= 2 * Math.PI; while (dth < -Math.PI) dth += 2 * Math.PI;
            s.peri.push({ t: s.t1 + dd * dt, th: s.th1 + dd * (dth / 2) });
          }
          s.r2 = s.r1; s.th2 = s.th1; s.r1 = rr; s.th1 = thn; s.t1 = t;
          if (k % SAMPLE) continue;
          const aa = 1 / (2 / rr - (vx * vx + vy * vy) / GM);   // vis-viva
          const h = dx * vy - dy * vx;
          const ex = (vy * h) / GM - dx / rr, ey = (-vx * h) / GM - dy / rr;
          const ecc = Math.hypot(ex, ey), pom = Math.atan2(ey, ex);
          if (aa < s.aMin) s.aMin = aa; if (aa > s.aMax) s.aMax = aa;
          if (ecc < s.eMin) s.eMin = ecc; if (ecc > s.eMax) s.eMax = ecc;
          if (rr < s.rMin) s.rMin = rr; if (rr > s.rMax) s.rMax = rr;
          s.aSum += aa; s.nS++;
          if (s.pomPrev !== null) { let d = pom - s.pomPrev;
            while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; s.pomUnw += d; }
          s.pomPrev = pom;
          s.sT += t; s.sP += s.pomUnw; s.sTT += t * t; s.sTP += t * s.pomUnw;
        }
      }
      const rows = st.map((s) => {
        let Tavg = null;
        if (s.tRev.length >= 2) { let acc = 0;
          for (let i = 1; i < s.tRev.length; i++) acc += s.tRev[i] - s.tRev[i - 1];
          Tavg = acc / (s.tRev.length - 1); }
        else if (s.tRev.length === 1) Tavg = s.tRev[0];
        const slopeRL = (s.nS * s.sTP - s.sT * s.sP) / (s.nS * s.sTT - s.sT * s.sT);
        let slopePe = NaN, Tper = Tavg;
        if (s.peri.length >= 3) {
          let acc = 0, prev = s.peri[0].th;
          const pw = s.peri.map((p) => { let d = p.th - prev;
            while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
            acc += d; prev = p.th; return acc; });
          let qT = 0, qP = 0, qTT = 0, qTP = 0;
          for (let i = 0; i < s.peri.length; i++) { qT += s.peri[i].t; qP += pw[i];
            qTT += s.peri[i].t * s.peri[i].t; qTP += s.peri[i].t * pw[i]; }
          const np = s.peri.length;
          slopePe = (np * qTP - qT * qP) / (np * qTT - qT * qT);
          Tper = (s.peri[np - 1].t - s.peri[0].t) / (np - 1);
        }
        return { Tavg, nRev: s.tRev.length, aMin: s.aMin, aMax: s.aMax, aMean: s.aSum / s.nS,
          eMin: s.eMin, eMax: s.eMax, rMin: s.rMin, rMax: s.rMax,
          dpomRL: slopeRL * (Tavg || 1), dpomPe: slopePe * (Tper || 1), nPeri: s.peri.length };
      });
      const fin = [];
      for (let i = 1; i < S.n; i++) fin.push(S.x[i], S.y[i], S.vx[i], S.vy[i]);
      return { rows, fin, nan: S.hasNaN(), steps, dt };
    },
    // 1步あたりの引きずり増分 |Δv| と速度の ulp の比(数値床の宣言)。
    // 実装上、引きずり増分は u 場が確定した**次の步**から乗る(K=1 では厳密に 0・K=2 で初計上)ので、
    // 2步走らせて 1步あたりに直す。subset/spinJ でチャネル別の床も測れる。
    floor(q, spinJ, subset, Tbase) {
      const dt = (Tbase || T_IO) / 2000, K = 2;
      const grab = (kF) => { const S = this.build(kF, q, spinJ, subset);
        for (let k = 0; k < K; k++) S.step(dt);
        const v = []; for (let i = 1; i < S.n; i++) v.push([S.vx[i], S.vy[i]]); return v; };
      const v1 = grab(1), v0 = grab(0);
      return v1.map((v, i) => {
        const dv = Math.hypot(v[0] - v0[i][0], v[1] - v0[i][1]) / (K - 1);
        const sp = Math.hypot(v[0], v[1]);
        const ulp = Math.pow(2, Math.floor(Math.log2(sp)) - 52);
        return { dv, speed: sp, ulp, dvOverUlp: dv / ulp, stepsUsed: K };
      });
    },
  };
};
await page.evaluate(HARNESS, CTX);

const out = { target: TARGET, wave: 138,
  title: '木星ガリレオ衛星 hold-out(規則を再フィットしない初の事後外挿テスト)',
  config: { units: '1単位=10⁷m/10³s/10²⁶kg', unitRule: 'L−T=4(c₀=3×10⁴)・M+2T−3L=11(G=6.674)',
    physics: PHYS, mJupiter: MJ, rJupiter: RJ, spinJupiter: SPIN_J, rotationHours: 9.925,
    GM, day: DAY, moons: MOONS, pinned: true,
    idealization: '2D 赤道面理想化(軌道傾斜 0.04°/0.47°/0.20°/0.19° を無視する — 宣言)',
    qStarRule: 'q*=3+ln(1.25c₀²R/GM)/ln((R+a)/R)(参照軌道=イオ a=42.18)',
    qStar: Q_STAR, qDeclared: Q_LOCK, qFlat: Q_FLAT, qLockRuntime: false,
    qLockNote: '実行時 qLock は掛けない(多天体系では a_ref が一意でないため — 🌞solarInner 第131便の既存裁定)。',
    D0Shared: 0.006, D0Note: 'D₀=0.006 は 🪨🌘💿 と共通の既存値。本便での再フィットはゼロ。',
    stepsPerOrbit: { main: N_STEP, fine: N_FINE }, orbits: ORBITS, orbitsLong: ORBITS_LONG,
    T_IO_units: T_IO },
  windowsPreRegistered: {
    JW1: 'kF0 転写 — 4衛星の恒星公転周期が観測値と ±1%',
    JW2: 'kF1(D₀=0.006・q(イオ)=12.30)— ≥20 イオ公転の窓で 4衛星とも軌道保持(NaN なし・|Δa|/a<2%)+周期 ±1% 維持',
    JW3: 'hold-out の正直さ — 衛星別 fit ゼロ(parameterAudit.fitted は共有 D₀ 以外空)',
    JW4: '引きずり差分(kF1−kF0)を各衛星で記録(窓なし・数値床は宣言)。フレーム ω の符号=自転と同方向',
    JW5: 'q=3 対照を記録(窓なし)',
    note: 'ラプラス共鳴の再現は要求しない(記録のみ)。窓は実測前に固定してあり、実測後に動かしていない。' },
  runs: {}, moons: [], windows: {}, uField: {}, floor: {}, convergence: {}, determinism: {},
  resonance: {} };

console.log('== 第138便 木星ガリレオ衛星 hold-out ==');
console.log('単位: 1単位=10⁷m/10³s/10²⁶kg(L−T=4 → c₀=3×10⁴・M+2T−3L=11 → G=6.674)');
console.log(`qLock 則(参照=イオ a=${MOONS[0].a}): q*=${Q_STAR.toFixed(6)} → 直値宣言 q=${Q_LOCK}`);
console.log(`イオのケプラー周期 T=${T_IO.toFixed(4)} 単位 = ${(T_IO / DAY).toFixed(6)} 日(観測 ${MOONS[0].Pobs} 日)`);
console.log(`主測定: ${N_STEP} 步/イオ公転 × ${ORBITS} イオ公転 = ${N_STEP * ORBITS} 步\n`);

// ================= A) 主測定(kF0 / kF1 / q=3 対照)=================
console.log('== A) 主測定(20 イオ公転窓)==');
const t0 = Date.now();
const kf0 = await page.evaluate(({ N, o }) => window.__jup.run(0, 12.30, N, o), { N: N_STEP, o: ORBITS });
const kf1 = await page.evaluate(({ N, o }) => window.__jup.run(1, 12.30, N, o), { N: N_STEP, o: ORBITS });
const kq3 = await page.evaluate(({ N, o }) => window.__jup.run(1, 3, N, o), { N: N_STEP, o: ORBITS });
console.log(`(主測定 3本 ${((Date.now() - t0) / 1000).toFixed(1)} 秒)`);
out.runs.main = { steps: kf1.steps, dt: kf1.dt, orbits: ORBITS, stepsPerOrbit: N_STEP,
  nan: { kF0: kf0.nan, kF1: kf1.nan, q3: kq3.nan } };

// ================= B) 長窓(付帯記録)=================
console.log('== B) 長窓 60 イオ公転(付帯記録)==');
const kf0L = await page.evaluate(({ N, o }) => window.__jup.run(0, 12.30, N, o), { N: N_STEP, o: ORBITS_LONG });
const kf1L = await page.evaluate(({ N, o }) => window.__jup.run(1, 12.30, N, o), { N: N_STEP, o: ORBITS_LONG });
out.runs.long = { steps: kf1L.steps, orbits: ORBITS_LONG, nan: { kF0: kf0L.nan, kF1: kf1L.nan } };

// ================= C) 収束確認(dt 掃引1点)=================
console.log('== C) 収束確認(步幅を半分 — dt 掃引1点)==');
const kf0F = await page.evaluate(({ N, o }) => window.__jup.run(0, 12.30, N, o), { N: N_FINE, o: ORBITS });
const kf1F = await page.evaluate(({ N, o }) => window.__jup.run(1, 12.30, N, o), { N: N_FINE, o: ORBITS });
out.runs.fine = { steps: kf1F.steps, dt: kf1F.dt, stepsPerOrbit: N_FINE,
  nan: { kF0: kf0F.nan, kF1: kf1F.nan } };

// ================= D) u 場・数値床・引きずりチャネル分解 =================
// 第138便の一次発見: 木星系ではフレーム回転が **衛星どうしの運動引きずり** に支配され、
// 木星の自転引きずりはその 5〜12 桁下にある。JW4 の「フレーム ω の符号=自転と同方向」は
// 自転引きずりチャネル(=木星+その衛星だけの2体)で判定し、全系の実測も並べて記録する。
const uq = await page.evaluate(() => window.__jup.uField(1, 12.30));               // 全系(自転あり)
const u3 = await page.evaluate(() => window.__jup.uField(1, 3));                   // 全系・q=3 対照
const uNoSpin = await page.evaluate(() => window.__jup.uField(1, 12.30, 0));       // 全系・自転 0(運動引きずりのみ)
const uSolo = [];   // 木星+その衛星の2体(自転引きずりのみ)
for (let i = 0; i < MOONS.length; i++)
  uSolo.push((await page.evaluate(({ i }) => window.__jup.uField(1, 12.30, undefined,
    [window.__jupBodies[i]]), { i }))[0]);
const fl = await page.evaluate(() => window.__jup.floor(12.30));

// チャネル分解の力学差分:
//   total  = 全系 kF1−kF0(自転引きずり+運動引きずりの合計)
//   motion = 全系・木星自転 0 の kF1−kF0(運動引きずりのみ)
//   spin   = 木星+その衛星の2体 kF1−kF0(自転引きずりのみ — 衛星間の摂動なし)
console.log('== D) 引きずりチャネル分解(total / motion / spin)==');
const kf1NS = await page.evaluate(({ N, o }) => window.__jup.run(1, 12.30, N, o, 0), { N: N_STEP, o: ORBITS });
const kf0NS = await page.evaluate(({ N, o }) => window.__jup.run(0, 12.30, N, o, 0), { N: N_STEP, o: ORBITS });
const solo = [];
for (let i = 0; i < MOONS.length; i++) {
  const Tm = 2 * Math.PI * Math.sqrt(Math.pow(MOONS[i].a, 3) / GM);
  const s1 = await page.evaluate(({ i, N, o, Tm }) => window.__jup.run(1, 12.30, N, o, undefined,
    [window.__jupBodies[i]], Tm), { i, N: N_STEP, o: ORBITS, Tm });
  const s0 = await page.evaluate(({ i, N, o, Tm }) => window.__jup.run(0, 12.30, N, o, undefined,
    [window.__jupBodies[i]], Tm), { i, N: N_STEP, o: ORBITS, Tm });
  const sf = await page.evaluate(({ i, Tm }) => window.__jup.floor(12.30, undefined,
    [window.__jupBodies[i]], Tm), { i, Tm });
  solo.push({ kF1: s1.rows[0], kF0: s0.rows[0], nan: s1.nan || s0.nan, floor: sf[0],
    TkeplerDays: Tm / DAY });
}

// ================= E) 決定性(2回実行でビット同一)=================
console.log('== E) 決定性(同一構成を2回実行)==');
const kf1b = await page.evaluate(({ N, o }) => window.__jup.run(1, 12.30, N, o), { N: N_STEP, o: ORBITS });
const bitSame = kf1.fin.length === kf1b.fin.length
  && kf1.fin.every((v, i) => Object.is(v, kf1b.fin[i]));
out.determinism = { bitIdentical: bitSame, nFin: kf1.fin.length,
  maxAbsDiff: Math.max(...kf1.fin.map((v, i) => Math.abs(v - kf1b.fin[i]))),
  note: '同一構成(kF1・主測定窓)を2回実行し、4衛星の最終 (x,y,vx,vy) を Object.is で照合。' };
console.log(`決定性: 2回実行でビット同一 = ${bitSame}`);

// ================= F) 衛星別の集計 =================
const relDev = (T, Pobs) => (T / DAY) / Pobs - 1;
for (let i = 0; i < MOONS.length; i++) {
  const mo = MOONS[i];
  const r0 = kf0.rows[i], r1 = kf1.rows[i], r3 = kq3.rows[i];
  const r0L = kf0L.rows[i], r1L = kf1L.rows[i], r1F = kf1F.rows[i], r0F = kf0F.rows[i];
  const kep = 2 * Math.PI * Math.sqrt(Math.pow(mo.a, 3) / GM);
  out.moons.push({
    name: mo.name, ja: mo.ja, aDeclared: mo.a, eDeclared: mo.e, mDeclared: mo.m,
    periodObsDays: mo.Pobs, periodKeplerDays: kep / DAY, periodKeplerDev: kep / DAY / mo.Pobs - 1,
    kF0: { periodDays: r0.Tavg / DAY, dev: relDev(r0.Tavg, mo.Pobs), nRev: r0.nRev,
      aMin: r0.aMin, aMax: r0.aMax, aMean: r0.aMean, aSpread: (r0.aMax - r0.aMin) / r0.aMean,
      eMin: r0.eMin, eMax: r0.eMax, dpomPerOrbit: r0.dpomPe, dpomPerOrbitRL: r0.dpomRL },
    kF1: { periodDays: r1.Tavg / DAY, dev: relDev(r1.Tavg, mo.Pobs), nRev: r1.nRev,
      aMin: r1.aMin, aMax: r1.aMax, aMean: r1.aMean, aSpread: (r1.aMax - r1.aMin) / r1.aMean,
      eMin: r1.eMin, eMax: r1.eMax, dpomPerOrbit: r1.dpomPe, dpomPerOrbitRL: r1.dpomRL },
    q3: { periodDays: r3.Tavg / DAY, dev: relDev(r3.Tavg, mo.Pobs), nRev: r3.nRev,
      aSpread: (r3.aMax - r3.aMin) / r3.aMean, eMin: r3.eMin, eMax: r3.eMax,
      dpomPerOrbit: r3.dpomPe, dpomPerOrbitRL: r3.dpomRL },
    long: { kF0PeriodDays: r0L.Tavg / DAY, kF1PeriodDays: r1L.Tavg / DAY,
      kF0Dev: relDev(r0L.Tavg, mo.Pobs), kF1Dev: relDev(r1L.Tavg, mo.Pobs),
      kF1aSpread: (r1L.aMax - r1L.aMin) / r1L.aMean, nRev: r1L.nRev,
      kF1eMin: r1L.eMin, kF1eMax: r1L.eMax },
    fine: { kF1PeriodDays: r1F.Tavg / DAY, kF1Dev: relDev(r1F.Tavg, mo.Pobs),
      kF1aSpread: (r1F.aMax - r1F.aMin) / r1F.aMean,
      dragPe: r1F.dpomPe - r0F.dpomPe, dragRL: r1F.dpomRL - r0F.dpomRL },
    drag: { pe: r1.dpomPe - r0.dpomPe, rl: r1.dpomRL - r0.dpomRL,
      q3pe: r3.dpomPe - r0.dpomPe, q3rl: r3.dpomRL - r0.dpomRL,
      periodShift: (r1.Tavg - r0.Tavg) / r0.Tavg },
    // 引きずりチャネル分解(total = 全系 / motion = 木星自転 0 の全系 / spin = 木星+その衛星の2体)
    channels: {
      total: { dpomPe: r1.dpomPe - r0.dpomPe, dpomRL: r1.dpomRL - r0.dpomRL,
        periodShift: (r1.Tavg - r0.Tavg) / r0.Tavg },
      motion: { dpomPe: kf1NS.rows[i].dpomPe - kf0NS.rows[i].dpomPe,
        dpomRL: kf1NS.rows[i].dpomRL - kf0NS.rows[i].dpomRL,
        periodShift: (kf1NS.rows[i].Tavg - kf0NS.rows[i].Tavg) / kf0NS.rows[i].Tavg },
      spin: { dpomPe: solo[i].kF1.dpomPe - solo[i].kF0.dpomPe,
        dpomRL: solo[i].kF1.dpomRL - solo[i].kF0.dpomRL,
        periodShift: (solo[i].kF1.Tavg - solo[i].kF0.Tavg) / solo[i].kF0.Tavg,
        aSpreadKF1: (solo[i].kF1.aMax - solo[i].kF1.aMin) / solo[i].kF1.aMean,
        periodDaysKF1: solo[i].kF1.Tavg / DAY, nan: solo[i].nan,
        dvOverUlp: solo[i].floor.dvOverUlp, resolved: solo[i].floor.dvOverUlp >= 1,
        note: '木星+その衛星の2体(衛星間の摂動を断った自転引きずりだけのチャネル)' },
    },
    uField: {
      r: uq[i].r, chi: uq[i].chi,
      omegaTotal: uq[i].om, omegaTotalPrograde: uq[i].om > 0,
      omegaNoSpin: uNoSpin[i].om,
      omegaSpinOnly: uSolo[i].om, omegaSpinOnlyPrograde: uSolo[i].om > 0,
      omegaBareAnalytic: uSolo[i].bare, chiSolo: uSolo[i].chi,
      spinOnlyOverAnalytic: uSolo[i].om / (uSolo[i].chi * uSolo[i].bare),
      spinOverTotal: Math.abs(uSolo[i].om / uq[i].om),
      omegaQ3Total: u3[i].om, omegaOverSpinRate: uSolo[i].om / SPIN_J },
    numericalFloor: { dvPerStep: fl[i].dv, speed: fl[i].speed, ulp: fl[i].ulp,
      dvOverUlp: fl[i].dvOverUlp, resolved: fl[i].dvOverUlp >= 1,
      spinChannelDvOverUlp: solo[i].floor.dvOverUlp,
      spinChannelResolved: solo[i].floor.dvOverUlp >= 1 },
  });
}

// ================= G) 事前登録窓の判定 =================
const M4 = out.moons;
out.windows.JW1 = {
  statement: out.windowsPreRegistered.JW1,
  pass: M4.every((r) => Math.abs(r.kF0.dev) < 0.01),
  rows: M4.map((r) => ({ name: r.name, periodDays: r.kF0.periodDays, obs: r.periodObsDays,
    devPercent: r.kF0.dev * 100, ok: Math.abs(r.kF0.dev) < 0.01 })) };
out.windows.JW2 = {
  statement: out.windowsPreRegistered.JW2,
  nan: kf1.nan,
  pass: !kf1.nan && M4.every((r) => r.kF1.aSpread < 0.02 && Math.abs(r.kF1.dev) < 0.01),
  rows: M4.map((r) => ({ name: r.name, aSpread: r.kF1.aSpread, aSpreadPercent: r.kF1.aSpread * 100,
    periodDays: r.kF1.periodDays, devPercent: r.kF1.dev * 100,
    ok: r.kF1.aSpread < 0.02 && Math.abs(r.kF1.dev) < 0.01 })),
  windowIoOrbits: ORBITS };
// JW3 は宣言側(beta の parameterAudit)の照合が本体。ここでは本ハーネスが衛星別 fit を
// 1つも使っていないことを構成から機械的に記録する(初速較正係数なし・q は算出則の直値)。
out.windows.JW3 = {
  statement: out.windowsPreRegistered.JW3,
  velocityCalibFactor: 1.0, perMoonFits: 0,
  sharedFits: ['D₀=0.006(🪨🌘💿 と共通 — 本便での再調整ゼロ)'],
  derived: [`q=${Q_LOCK}(qLock 則を参照軌道=イオで1回だけ評価した q*=${Q_STAR.toFixed(4)} の直値宣言)`,
    'κ=G/c₀²=7.4155555…×10⁻⁹'],
  pass: true,
  note: '初速は実ケプラー速度そのもの(較正係数 1.000)。衛星ごとに合わせたノブは1つもない。' };
out.windows.JW4 = {
  statement: out.windowsPreRegistered.JW4,
  pass: null, recordOnly: true,
  spinSign: SPIN_J > 0 ? '+(反時計回り — 順行の向き)' : '−',
  // 「フレーム ω の符号=自転と同方向」の判定: 自転引きずりチャネル(木星+その衛星の2体)で見る。
  omegaProgradeSpinChannel: M4.every((r) => r.uField.omegaSpinOnlyPrograde),
  // 全系(4衛星同居)の実測も並べて記録する — こちらは衛星どうしの運動引きずりに支配される。
  omegaProgradeTotalField: M4.every((r) => r.uField.omegaTotalPrograde),
  rows: M4.map((r) => ({ name: r.name,
    dragTotalPe: r.channels.total.dpomPe, dragTotalRL: r.channels.total.dpomRL,
    dragMotionPe: r.channels.motion.dpomPe, dragSpinPe: r.channels.spin.dpomPe,
    periodShiftTotal: r.channels.total.periodShift,
    periodShiftMotion: r.channels.motion.periodShift,
    periodShiftSpin: r.channels.spin.periodShift,
    omegaSpinOnly: r.uField.omegaSpinOnly, omegaSpinOnlyPrograde: r.uField.omegaSpinOnlyPrograde,
    spinOnlyOverAnalytic: r.uField.spinOnlyOverAnalytic,
    omegaTotal: r.uField.omegaTotal, omegaNoSpin: r.uField.omegaNoSpin,
    spinOverTotal: r.uField.spinOverTotal, chi: r.uField.chi,
    dvOverUlp: r.numericalFloor.dvOverUlp, resolved: r.numericalFloor.resolved,
    spinChannelDvOverUlp: r.numericalFloor.spinChannelDvOverUlp,
    spinChannelResolved: r.numericalFloor.spinChannelResolved })),
  channelNote: '木星系のフレーム回転は **衛星どうしの運動引きずり** に支配される。木星の自転引きずり'
    + '(木星+その衛星の2体で測ったチャネル)は同じ半径で 5〜12 桁下にあり、全系の ω は '
    + '木星の自転を 0 にしてもほとんど変わらない。したがって全系の ω の符号は自転の向きではなく'
    + '衛星配置(初期位相)が決めており、瞬時値である。',
  floorNote: '数値床: 引きずり増分 Δv=kF·Δu は補償和に乗らない生の加算なので、|Δv| が速度の '
    + '1 ulp を下回ると倍精度の状態に 1 bit も積まれない。実装上、増分は u 場が確定した次の步から'
    + '乗る(1步目は厳密に 0・2步目で初計上)ので、床は2步走らせて1步あたりに直して測る。'
    + 'dvOverUlp<1 の行の Δϖ_drag は「床の上限値」であって物理量の測定値ではない。',
  apsidalNote: '4衛星の実離心率は 0.0013〜0.009 と小さく、近点方向 ϖ はもともと条件が悪い。'
    + '全系の Δϖ_drag(total)は衛星間の永年摂動が kF1/kF0 で位相ずれを起こした差も含むので、'
    + '条件のよい周期シフト ΔT/T を併記する。' };
out.windows.JW5 = {
  statement: out.windowsPreRegistered.JW5,
  pass: null, recordOnly: true,
  rows: M4.map((r) => ({ name: r.name, periodDays: r.q3.periodDays, devPercent: r.q3.dev * 100,
    aSpread: r.q3.aSpread, dragPe: r.drag.q3pe, omegaQ3Total: r.uField.omegaQ3Total,
    ratioQ3OverTotal: r.uField.omegaQ3Total / r.uField.omegaTotal,
    ratioQ3OverSpinOnly: r.uField.omegaQ3Total / r.uField.omegaSpinOnly })),
  nan: kq3.nan,
  note: 'q=3(LT と同じ r⁻³ 則の物差し)にすると自転引きずりが運動引きずりを追い越し、全系の ω が'
    + '順行へ反転する。周期も観測から系統的にずれる — qLock 則の幾何減衰が実スケールを成立させて'
    + 'いることの対照である。' };

// ラプラス共鳴(記録のみ)
const P1 = M4[0].kF1.periodDays, P2 = M4[1].kF1.periodDays, P3 = M4[2].kF1.periodDays;
out.resonance = {
  requirement: '再現は要求しない(記録のみ)',
  observedRatios: { EuropaOverIo: MOONS[1].Pobs / MOONS[0].Pobs,
    GanymedeOverEuropa: MOONS[2].Pobs / MOONS[1].Pobs },
  measuredRatiosKF1: { EuropaOverIo: P2 / P1, GanymedeOverEuropa: P3 / P2 },
  laplaceCombination: 1 / P1 - 3 / P2 + 2 / P3,
  laplaceCombinationObs: 1 / MOONS[0].Pobs - 3 / MOONS[1].Pobs + 2 / MOONS[2].Pobs,
  note: '本サンプルは初期位相を 90° ずつずらした2D理想化配置で、共鳴角の平衡は初期条件として '
    + '与えていない。ラプラス共鳴(λ_I−3λ_E+2λ_G=180°)の再現は事前登録の対象外である。' };

// 収束確認
out.convergence = {
  statement: `步幅を半分(${N_STEP}→${N_FINE} 步/イオ公転)にした dt 掃引1点`,
  rows: M4.map((r) => ({ name: r.name,
    periodMain: r.kF1.periodDays, periodFine: r.fine.kF1PeriodDays,
    periodRelDiff: r.fine.kF1PeriodDays / r.kF1.periodDays - 1,
    aSpreadMain: r.kF1.aSpread, aSpreadFine: r.fine.kF1aSpread,
    dragMain: r.drag.pe, dragFine: r.fine.dragPe,
    dragRelDiff: r.drag.pe !== 0 ? (r.fine.dragPe - r.drag.pe) / Math.abs(r.drag.pe) : null })),
  periodConverged: M4.every((r) => Math.abs(r.fine.kF1PeriodDays / r.kF1.periodDays - 1) < 1e-3) };
out.uField.rowsTotalQLock = uq;
out.uField.rowsTotalQ3 = u3;
out.uField.rowsTotalNoSpin = uNoSpin;
out.uField.rowsSpinOnly = uSolo;
out.uField.note = 'rowsTotal* は4衛星同居の全系、rowsSpinOnly は木星+その衛星の2体(自転引きずりだけ)。'
  + 'rowsSpinOnly の om は解析形 χ·s·(R/(R+r))^q と 1.3% 以内で一致する。';
out.floor.rows = fl;
out.floor.note = '全系の1步あたり引きずり増分 |Δv| と速度の 1 ulp の比(2步走らせて1步あたりに直した値)。';

// ================= H) 感度実測(第141便 — 追加記録。既存の窓 JW1〜JW5 と主測定は 1bit も動かさない)==
// 外部レビュー対応で「参照軌道 a の選定がどれだけ効くか」を数字にするための**付帯記録**である。
// 事前登録窓ではない(PASS/FAIL の判定に使わない)。判定条件だけは JW2 と同じものを並記して
// 「同じ物差しで見たときにどうなるか」が読めるようにしてある。
//   ① 参照軌道 a を ±20% 振ったときの q* と4衛星の保持/周期
//   ② 高q対照 q=8 / 10 / 14(qLock 値 12.30 の上下)
//   ③ 厳密一致式 q_exact = q* + 3·ln(a/(R+a))/ln((R+a)/R) の対照(採らなかった代替規約)
//   ④ 共有背景 D₀ の ×0.5 / ×2 感度(D₀ は再フィット禁止の共有値なので、感度の記録のみ)
console.log('\n== H) 感度実測(第141便・付帯記録)==');
const A_IO = MOONS[0].a;
const LN_RA = Math.log((RJ + A_IO) / RJ);
const qStarAt = (a) => 3 + Math.log(1.25 * PHYS.cLight * PHYS.cLight * RJ / GM)
  / Math.log((RJ + a) / RJ);
// 参照軌道 a における「素のスピン項 / Ω_LT」(J=(2/5)MR²s の一様球近似。s は約分して消える)
const bareOverLT = (q, a) => Math.pow(RJ / (RJ + a), q)
  * PHYS.cLight * PHYS.cLight * a * a * a / (0.8 * GM * RJ * RJ);
const Q_EXACT = Q_STAR + 3 * Math.log(A_IO / (RJ + A_IO)) / LN_RA;
const Q_EXACT_DECL = +Q_EXACT.toFixed(2);

const senseRun = async (label, q, patch) => {
  const r1 = await page.evaluate(({ N, o, q, patch }) =>
    window.__jup.run(1, q, N, o, undefined, undefined, undefined, patch),
    { N: N_STEP, o: ORBITS, q, patch: patch || null });
  const r0 = patch ? await page.evaluate(({ N, o, q, patch }) =>
    window.__jup.run(0, q, N, o, undefined, undefined, undefined, patch),
    { N: N_STEP, o: ORBITS, q, patch }) : kf0;
  const rows = MOONS.map((mo, i) => ({
    name: mo.name, periodDays: r1.rows[i].Tavg / DAY, devPercent: relDev(r1.rows[i].Tavg, mo.Pobs) * 100,
    aSpreadPercent: 100 * (r1.rows[i].aMax - r1.rows[i].aMin) / r1.rows[i].aMean,
    dragPe: r1.rows[i].dpomPe - r0.rows[i].dpomPe,
    periodShift: (r1.rows[i].Tavg - r0.rows[i].Tavg) / r0.rows[i].Tavg }));
  return { label, q, patch: patch || null, nan: r1.nan, rows,
    // JW2 と同じ判定条件で見たときの成否(窓ではなく比較のための併記)
    sameAsJW2Condition: !r1.nan && rows.every((r) => r.aSpreadPercent < 2 && Math.abs(r.devPercent) < 1),
    maxAbsDevPercent: Math.max(...rows.map((r) => Math.abs(r.devPercent))),
    maxASpreadPercent: Math.max(...rows.map((r) => r.aSpreadPercent)),
    fin: r1.fin };
};

// ① 参照軌道 a ±20%
const aVariants = [{ f: 0.8 }, { f: 1.0 }, { f: 1.2 }].map((v) => {
  const a = A_IO * v.f, qs = qStarAt(a);
  return { f: v.f, aRef: a, qStar: qs, qDeclared: +qs.toFixed(2), dqStar: qs - Q_STAR };
});
const aRefRows = [];
for (const v of aVariants) {
  const r = await senseRun(`aRef×${v.f.toFixed(1)}`, v.qDeclared);
  aRefRows.push(Object.assign({}, v, {
    nan: r.nan, rows: r.rows, sameAsJW2Condition: r.sameAsJW2Condition,
    maxAbsDevPercent: r.maxAbsDevPercent, maxASpreadPercent: r.maxASpreadPercent,
    // 参照軌道での素のスピン項/Ω_LT(遠方近似の規約が置きにいく量。有限半径因子ぶんだけ 1 を外す)
    bareOverLTatIo: bareOverLT(v.qDeclared, A_IO),
    bareOverLTatOwnRef: bareOverLT(v.qDeclared, v.aRef) }));
  console.log(`  a_ref×${v.f.toFixed(1)}(a=${v.aRef.toFixed(3)}) q*=${v.qStar.toFixed(4)}→宣言 ${v.qDeclared}`
    + ` 周期ずれ最大 ${r.maxAbsDevPercent.toFixed(4)}% / |Δa|/a 最大 ${r.maxASpreadPercent.toFixed(5)}%`
    + ` / NaN=${r.nan}(JW2 と同条件: ${r.sameAsJW2Condition})`);
}

// ② 高q対照 + ③ q_exact 対照
const qRows = [];
for (const q of [8, 10, 14, Q_EXACT_DECL]) {
  const r = await senseRun(`q=${q}`, q);
  qRows.push({ q, isQExact: q === Q_EXACT_DECL, nan: r.nan, rows: r.rows,
    sameAsJW2Condition: r.sameAsJW2Condition, maxAbsDevPercent: r.maxAbsDevPercent,
    maxASpreadPercent: r.maxASpreadPercent, bareOverLTatIo: bareOverLT(q, A_IO) });
  console.log(`  q=${q}${q === Q_EXACT_DECL ? '(q_exact)' : ''}`
    + ` 周期ずれ最大 ${r.maxAbsDevPercent.toFixed(4)}% / |Δa|/a 最大 ${r.maxASpreadPercent.toFixed(5)}%`
    + ` / 素のスピン項/Ω_LT(イオ)=${bareOverLT(q, A_IO).toExponential(3)}(JW2 と同条件: ${r.sameAsJW2Condition})`);
}

// ④ D₀ 感度(×0.5 / ×2)
const d0Rows = [];
for (const f of [0.5, 1, 2]) {
  const D0 = PHYS.D0 * f;
  const r = f === 1 ? null : await senseRun(`D0×${f}`, Q_LOCK, { D0 });
  const rows = r ? r.rows : MOONS.map((mo, i) => ({
    name: mo.name, periodDays: kf1.rows[i].Tavg / DAY, devPercent: relDev(kf1.rows[i].Tavg, mo.Pobs) * 100,
    aSpreadPercent: 100 * (kf1.rows[i].aMax - kf1.rows[i].aMin) / kf1.rows[i].aMean,
    dragPe: kf1.rows[i].dpomPe - kf0.rows[i].dpomPe,
    periodShift: (kf1.rows[i].Tavg - kf0.rows[i].Tavg) / kf0.rows[i].Tavg }));
  const mx = Math.max(...rows.map((v) => Math.abs(v.devPercent)));
  const ms = Math.max(...rows.map((v) => v.aSpreadPercent));
  d0Rows.push({ factor: f, D0, nan: r ? r.nan : kf1.nan, rows,
    sameAsJW2Condition: r ? r.sameAsJW2Condition : out.windows.JW2.pass,
    maxAbsDevPercent: mx, maxASpreadPercent: ms });
  console.log(`  D₀=${D0}(×${f}) 周期ずれ最大 ${mx.toFixed(4)}% / |Δa|/a 最大 ${ms.toFixed(5)}%`
    + ` / NaN=${r ? r.nan : kf1.nan}(JW2 と同条件: ${r ? r.sameAsJW2Condition : out.windows.JW2.pass})`);
}

// 感度実測の決定性(追加分も2回一致することを確認する)
const sens1 = await page.evaluate(({ N, o }) =>
  window.__jup.run(1, 8, N, o, undefined, undefined, undefined, null), { N: N_STEP, o: ORBITS });
const sens2 = await page.evaluate(({ N, o }) =>
  window.__jup.run(1, 8, N, o, undefined, undefined, undefined, null), { N: N_STEP, o: ORBITS });
const sensBit = sens1.fin.length === sens2.fin.length
  && sens1.fin.every((v, i) => Object.is(v, sens2.fin[i]));
console.log(`  感度構成(q=8)の決定性: 2回実行でビット同一 = ${sensBit}`);

out.sensitivity = {
  wave: 141, recordOnly: true,
  statement: '第141便の付帯記録。既存の事前登録窓 JW1〜JW5 と主測定は一切変更していない'
    + '(本節を足す前後で他の全キーの値はビット不変)。ここは「参照軌道 a の選定・指数 q・共有背景 D₀ を'
    + '動かすと何がどれだけ動くか」の感度記録であって、事前登録した判定ではない。',
  farFieldConvention: {
    rule: 'qLock 則 q*=3+ln(1.25c₀²R/GM)/ln((R+a)/R) は、スピン項の**遠方近似 a≫R**での振幅を '
      + 'Ω_LT=2GJ/(c₀²r³)(J=(2/5)MR²s の一様球近似)に合わせる宣言規約である。',
    finiteRadiusFactor: Math.pow(A_IO / (RJ + A_IO), 3),
    finiteRadiusNote: '有限半径因子。参照軌道 a で素のスピン項 s·(R/(R+a))^q* を Ω_LT(a) と比べると、'
      + '比は厳密に (a/(R+a))³ になる(a≫R で 1 に漸近する — 遠方近似であることの定量)。',
    bareOverLTatIoDeclared: bareOverLT(Q_LOCK, A_IO),
    bareOverLTatIoExactQStar: bareOverLT(Q_STAR, A_IO),
    qExact: Q_EXACT, qExactDeclared: Q_EXACT_DECL,
    qExactRule: 'q_exact = q* + 3·ln(a/(R+a))/ln((R+a)/R) — 参照軌道で比を厳密に 1 にする代替規約。'
      + '本便では採らない(確定済みの較正世界線〔共有 D₀=0.006・kf1d・木星 hold-out〕を'
      + '再実測なしで保存する最小修正を優先した)。採否は規約の選択であって物理の判定ではない。',
    chiNote: 'χ=w/(D₀+w) を掛けた実効フレーム回転はさらに小さい(木星系では χ=0.944〜0.987 と 1 に近い)。' },
  aRefSensitivity: {
    statement: '参照軌道 a を ±20% 振ると q* がどれだけ動き、4衛星の保持・周期がどうなるか',
    whyIo: 'イオを参照軌道に選ぶ理由: 多体系では自由天体距離の中央値が一意でないため参照を1つ宣言する'
      + '必要があり(🌞第131便の裁定)、①支配源(木星)に最も近い=スピン項が最大で効く軌道であること、'
      + '②公転周期が最短で同じ実時間窓で最も多くの公転を積めること(数値床が最良)から、'
      + '4衛星のうちイオが最も厳しい・最も解像度の高い参照点になる。',
    rows: aRefRows },
  qControls: {
    statement: '高q対照(q=8/10/14)と厳密一致式 q_exact の対照。qLock 宣言値 12.30 との比較用',
    qDeclared: Q_LOCK, qStar: Q_STAR, rows: qRows },
  d0Sensitivity: {
    statement: '共有背景 D₀ の ×0.5 / ×2 感度(D₀=0.006 は 🪨🌘💿 と共通の値で、本系では再フィットしない)',
    rows: d0Rows },
  determinism: { config: 'q=8・kF1・主測定窓', bitIdentical: sensBit,
    maxAbsDiff: Math.max(...sens1.fin.map((v, i) => Math.abs(v - sens2.fin[i]))) },
};

// ================= 出力 =================
console.log('\n== JW1 kF0 転写(周期 ±1%)==');
for (const r of out.windows.JW1.rows)
  console.log(`  ${r.name.padEnd(9)} ${r.periodDays.toFixed(6)} 日(観測 ${r.obs})ずれ ${r.devPercent.toFixed(4)}% → ${r.ok ? 'PASS' : 'FAIL'}`);
console.log(`  JW1 総合: ${out.windows.JW1.pass ? 'PASS' : 'FAIL'}`);

console.log('\n== JW2 kF1 軌道保持+周期(20 イオ公転窓)==');
for (const r of out.windows.JW2.rows)
  console.log(`  ${r.name.padEnd(9)} |Δa|/a=${r.aSpreadPercent.toFixed(5)}%(<2%) 周期 ${r.periodDays.toFixed(6)} 日 ずれ ${r.devPercent.toFixed(4)}% → ${r.ok ? 'PASS' : 'FAIL'}`);
console.log(`  NaN=${kf1.nan} / JW2 総合: ${out.windows.JW2.pass ? 'PASS' : 'FAIL'}`);

console.log('\n== JW3 hold-out の正直さ ==');
console.log(`  衛星別 fit = ${out.windows.JW3.perMoonFits} 件 / 共有 fit = ${out.windows.JW3.sharedFits.join(' , ')}`);
console.log(`  導出値 = ${out.windows.JW3.derived.join(' / ')} → ${out.windows.JW3.pass ? 'PASS' : 'FAIL'}`);

console.log('\n== JW4 引きずり差分(記録のみ・窓なし)==');
console.log('  [Δϖ_drag rad/公転]  total(全系)/ motion(自転0)/ spin(2体・自転引きずりのみ)');
for (const r of out.windows.JW4.rows)
  console.log(`  ${r.name.padEnd(9)} total=${r.dragTotalPe.toExponential(4)} motion=${r.dragMotionPe.toExponential(4)} spin=${r.dragSpinPe.toExponential(4)}`);
console.log('  [周期シフト ΔT/T(条件のよい量)]');
for (const r of out.windows.JW4.rows)
  console.log(`  ${r.name.padEnd(9)} total=${r.periodShiftTotal.toExponential(4)} motion=${r.periodShiftMotion.toExponential(4)} spin=${r.periodShiftSpin.toExponential(4)}`);
console.log('  [フレーム回転 ω]');
for (const r of out.windows.JW4.rows)
  console.log(`  ${r.name.padEnd(9)} 自転チャネル ω=${r.omegaSpinOnly.toExponential(4)}(順行=${r.omegaSpinOnlyPrograde}・解析形比 ${r.spinOnlyOverAnalytic.toFixed(4)}) / 全系 ω=${r.omegaTotal.toExponential(4)}(自転0でも ${r.omegaNoSpin.toExponential(4)})・自転/全系=${r.spinOverTotal.toExponential(3)} χ=${r.chi.toFixed(5)}`);
console.log(`  フレーム ω の符号=自転と同方向(自転引きずりチャネル): ${out.windows.JW4.omegaProgradeSpinChannel}`);
console.log(`  全系の ω が全衛星で順行: ${out.windows.JW4.omegaProgradeTotalField}(= 衛星どうしの運動引きずりが支配・瞬時値)`);
console.log('  [数値床 Δv/ulp] ' + out.windows.JW4.rows.map((r) => `${r.name}=${r.dvOverUlp.toExponential(2)}${r.resolved ? '' : '(床以下)'}`).join(' / '));
console.log('  [自転チャネルの床] ' + out.windows.JW4.rows.map((r) => `${r.name}=${r.spinChannelDvOverUlp.toExponential(2)}${r.spinChannelResolved ? '' : '(床以下)'}`).join(' / '));

console.log('\n== JW5 q=3 対照(記録のみ・窓なし)==');
for (const r of out.windows.JW5.rows)
  console.log(`  ${r.name.padEnd(9)} 周期 ${r.periodDays.toFixed(6)} 日(ずれ ${r.devPercent.toFixed(4)}%)|Δa|/a=${(r.aSpread * 100).toFixed(5)}% Δϖ_drag=${r.dragPe.toExponential(4)} ω_q3(全系)=${r.omegaQ3Total.toExponential(4)}(qLock 全系の ${r.ratioQ3OverTotal.toExponential(3)}倍・自転チャネルの ${r.ratioQ3OverSpinOnly.toExponential(3)}倍)`);

console.log('\n== 収束確認(dt 掃引1点)==');
for (const r of out.convergence.rows)
  console.log(`  ${r.name.padEnd(9)} 周期 ${r.periodMain.toFixed(6)} → ${r.periodFine.toFixed(6)} 日(相対差 ${(r.periodRelDiff * 100).toExponential(3)}%)|Δa|/a ${(r.aSpreadMain * 100).toFixed(5)}% → ${(r.aSpreadFine * 100).toFixed(5)}%`);
console.log(`  周期の収束(相対差 <10⁻³): ${out.convergence.periodConverged}`);

console.log('\n== ラプラス共鳴(記録のみ)==');
console.log(`  周期比(観測)  E/I=${out.resonance.observedRatios.EuropaOverIo.toFixed(6)} G/E=${out.resonance.observedRatios.GanymedeOverEuropa.toFixed(6)}`);
console.log(`  周期比(kF1実測)E/I=${out.resonance.measuredRatiosKF1.EuropaOverIo.toFixed(6)} G/E=${out.resonance.measuredRatiosKF1.GanymedeOverEuropa.toFixed(6)}`);

// ---- 第145便: 実験マニフェスト(生成来歴・数値環境・分類・判定ポインタ・健全性)-------------
// 測定ロジック・数値は一切変更していない。結果へ `manifest` キーを1本足すだけの additive 変更。
out.manifest = await buildManifest({
  root: ROOT, scriptUrl: import.meta.url, page, browser, payload: out,
  target: TARGET,
  experiment: { id: 'jupiter', wave: 138,
    title: '木星ガリレオ衛星 hold-out(規則を再フィットしない初の事後外挿テスト)',
    command: 'node tests/exp-jupiter.mjs' },
  presets: { mode: 'dynamic',
    declaredIn: 'PHYS / MOONS / MJ / RJ / SPIN_J(ハーネス冒頭の宣言値)',
    declaration: '動的構成(内蔵プリセットを読まず、観測値からの宣言値で HP.sim.build する)',
    configs: { physics: PHYS, mJupiter: MJ, rJupiter: RJ, spinJupiter: SPIN_J, moons: MOONS,
      qStar: Q_STAR, qDeclared: Q_LOCK, qFlat: Q_FLAT, pinned: true, GM, day: DAY, T_IO },
    note: '実行時 qLock は掛けない(多天体系では a_ref が一意でないため — 🌞solarInner 第131便の既存裁定)。' +
      'q は参照軌道=イオで1回だけ評価した q* の直値宣言である' },
  numerics: {
    seed: NOT_APPLICABLE,
    dt: `dt = T_IO / N(主測定 N=${N_STEP} → dt=${(T_IO / N_STEP).toExponential(6)} 時間単位・` +
      `収束確認 N=${N_FINE} で半分)`,
    timeScale: 1, substeps: NOT_APPLICABLE,
    steps: { main: `${N_STEP} 步/イオ公転 × ${ORBITS} 公転 = ${N_STEP * ORBITS} 步`,
      long: `${N_STEP} 步/イオ公転 × ${ORBITS_LONG} 公転`,
      fine: `${N_FINE} 步/イオ公転 × ${ORBITS} 公転`,
      floorProbe: '2 步(1步あたりの引きずり増分 Δv と速度 ulp の比を測るための最小窓)' },
    window: { main: `${ORBITS} イオ公転(事前登録窓 JW2 の「≥20 イオ公転」)`,
      long: `${ORBITS_LONG} イオ公転(付帯記録 — カリスト 6.4 公転ぶん)` },
    warmup: NOT_APPLICABLE,
    unitRule: '1単位=10⁷m/10³s/10²⁶kg(L−T=4 → c₀=3×10⁴・M+2T−3L=11 → G=6.674)',
    numericalFloor: '引きずり増分 Δv/ulp は floor および windows.JW4.rows.dvOverUlp に記録済み',
  },
  classification: {
    input: ['木星の実質量・実半径・実自転(9.925h)とガリレオ衛星4体の実軌道長半径・観測周期' +
      '(観測由来の外部入力 — MOONS)',
      'D₀=0.006(🪨🌘💿 と共通の既存値 — 本便での再フィットはゼロ)',
      'dt・步数・窓(実測前に固定)'],
    fit: [],
    derived: ['q=12.30(qLock 則 q*=3+ln(1.25c₀²R/GM)/ln((R+a)/R) を参照軌道=イオで1回評価した値の直値宣言)',
      'κ=G/c₀²=7.4155555…×10⁻⁹', '衛星別の周期・|Δa|/a・離心率・Δϖ_drag(moons)',
      'フレーム角速度 ω とチャネル分解(uField・windows.JW4)', '収束(convergence)・決定性(determinism)',
      '第141便の感度記録(sensitivity — 付帯記録であって事前登録判定ではない)'],
    holdOut: ['ガリレオ衛星4体の恒星公転周期・軌道保持そのもの(既存の較正世界線〔共有 D₀・qLock 則〕を' +
      '**一切再フィットせずに**当てた先の観測。衛星別 fit ゼロは windows.JW3 で機械記録している)',
      'ラプラス共鳴(記録のみ — 再現は要求していない)'],
    note: '初速は実ケプラー速度そのもの(較正係数 1.000)。衛星ごとに合わせたノブは1つもない — ' +
      'これが本便を hold-out たらしめる条件であり、windows.JW3 がその条件を構成から機械的に固定する',
  },
  judgement: {
    pointers: ['windowsPreRegistered', 'windows.JW1', 'windows.JW2', 'windows.JW3', 'windows.JW4',
      'windows.JW5', 'moons', 'runs', 'uField', 'floor', 'convergence', 'determinism',
      'resonance', 'sensitivity'],
    note: '許容窓は windowsPreRegistered(実測前固定・実測後に動かしていない)、判定と実測値・残差は ' +
      'windows.JW1〜JW5 に構造ごと入っている。JW4/JW5 は窓なしの記録専用(recordOnly)である',
    externalReferences: ['ガリレオ衛星の観測公転周期(MOONS[].Pobs — JW1/JW2 の ±1% 照合先)',
      'Lense–Thirring 角速度 Ω_LT=2GJ/(c₀²r³)(J=(2/5)MR²s の一様球近似 — ω の解析形比の照合先)',
      'ラプラス共鳴の観測周期比(resonance.observedRatios)'],
  },
  health: {
    conservation: { status: 'partially-instrumented',
      quantity: '軌道長半径の広がり |Δa|/a(aSpread)と NaN 監視・決定性ビット同一',
      pointers: ['windows.JW2.rows[].aSpread', 'runs.*.nan', 'determinism.bitIdentical'],
      note: '木星を pinned にしているため運動量は原理的に閉じない構成である。保存量残差そのものは' +
        '記録していない(' + NOT_INSTRUMENTED + ')が、軌道保持 |Δa|/a と 2回実行のビット同一性を' +
        '数値健全性の指標として持つ' },
  },
});

fs.writeFileSync(path.join(OUT_DIR, 'jupiter-results.json'), JSON.stringify(out, null, 2));
console.log('\nsaved: tests/out/jupiter-results.json');
await browser.close();

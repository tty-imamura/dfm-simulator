// 第36便 E3(台帳4-47 Phase C): u_req 逆問題によるダークローター分布の設計
// - 本スクリプトは QA ではない(合否判定なし)。tests/out/ureq-results.json に計測値を保存する。
// - 中心式(REVIEW_20260723_DARK_ROTOR_DM_GALAXY §2.1・ChatGPT §6.2):
//       u_req(r) = ( v_obs² − v_bar² + r·a_rep ) / ( k_F · v_obs )
//   由来: 円軌道の動径釣り合い v²/r = a_grav − a_rep + k_F·u_φ·v/r。
//   左辺第3項は E6′ 輸送 Δv=k_F·Δu の、定常軸対称場を回る粒子から見た向心成分
//   (u=u_φ φ̂ を角速度 Ω=v/r で追うと du/dt = −u_φ·(v/r)·r̂)。v_bar²=r·a_grav とおけば上式。
// - 手順: ①🌌galaxy の v_bar(r)/a_rep(r) 実測 → 目標 v_obs(r)(外縁平坦 V_f=1.33·v_bar(220))
//         → u_req(r) 算出 ②ローターリング(2〜3リング)の E3 フレーム場 u_φ(r) を実測して一致度評価
//         ③粗い格子(各3水準)で掃引し、最良構成で恒星円盤を 6000 步走らせて v/v_bar(r) を実測
// - 成功基準(研究実験。未達でも FAIL ではなく実測の記録が成果): 外縁3帯で |v/v_obs − 1| < 10%
// 実行: node tests/exp-ureq.mjs(playwright 必須。約8分)
//   QA_TARGET=beta/index.html node tests/exp-ureq.mjs  … 既定。絶対パスも可(/ で始まれば絶対扱い)
//
// 転記元(確定版は `git show HEAD:beta/index.html` を参照 — 実装ファイルは一切変更していない):
//   v_bar(r) .......... beta/index.html:3281-3295(curveVBarAt。8方位の平均動径加速度 → √(r·a_r))
//   E3 フレーム u ..... beta/index.html:2476-2493(w=m/√(d²+ε²)・ω=s·(R/(R+d))^q・u=Σw(v+ω×Δr)/W)
//   E5′ 斥力 .......... beta/index.html:2494-2499(F=kRep·μ·(ω_i²+ω_j²)·(r_i−r_j))
//   E6′ 輸送 .......... beta/index.html:2626-2641(Δv=k_F·Δu。u は自分自身を除外して評価)
//   v(r) 実測 ......... tests/qa.mjs:1429-1432(vφ=(x·vy−y·vx)/r)を tests/seeds.mjs:77-84 の8帯へ
//   8帯定義 ........... tests/seeds.mjs:36-41(r=40〜300 の8等分。E1〔台帳4-49〕と同一)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + (TARGET.startsWith('/') ? TARGET : path.join(ROOT, TARGET));
const OUT_DIR = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(OUT_DIR, { recursive: true });

const DT = 0.016;
const STEPS = 6000;                 // tests/seeds.mjs:26(GALAXY_STEPS)と同一。有限窓 t≈96
const VF_FACTOR = 1.33;             // 目標平坦値 V_f = VF_FACTOR × v_bar(220)(実測増強値 1.322 に対応)
const VF_RADIUS = 220;

// 8帯(tests/seeds.mjs:36-41 と同一 — E1 の profile 節と直接比較できる)
const PROFILE_N = 8, PROFILE_RMIN = 40, PROFILE_RMAX = 300;
const BANDS = Array.from({ length: PROFILE_N }, (_, i) => {
  const lo = PROFILE_RMIN + i * (PROFILE_RMAX - PROFILE_RMIN) / PROFILE_N;
  const hi = PROFILE_RMIN + (i + 1) * (PROFILE_RMAX - PROFILE_RMIN) / PROFILE_N;
  return { lo, hi, mid: (lo + hi) / 2 };
});
const OUTER3 = [5, 6, 7];           // 外縁3帯(rMid 218.75 / 251.25 / 283.75)

// ---- 設計変数(各3水準の粗い格子 = 27 構成)----
// リング半径は8帯の「境界」に置く(帯の中点=v_bar/u_φ の評価点から最も遠い ±16.25 —
// 評価点のすぐ横にローターが来ると 8方位サンプルの平均動径加速度が汚れるため)
const RING_SETS = [
  { id: 'A2', radii: [137.5, 235.0] },
  { id: 'B3', radii: [105.0, 170.0, 235.0] },
  { id: 'C2', radii: [202.5, 267.5] }
];
const M_ROT = [20, 60, 150];
const S_ROT = [0.5, 1.5, 3.0];
const N_PER_RING = 10;

async function launch() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  const { chromium } = await import('playwright-core');
  return chromium.launch({ executablePath: exe });
}
async function newPage(browser) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(INDEX);
  await page.waitForFunction(() => window.HP && HP.sim);
  return page;
}

async function installKernel(page, cfg) {
  await page.evaluate(({ BANDS, N_PER_RING, DT }) => {
    const K = { BANDS, N_PER_RING, DT };
    K.galPreset = () => JSON.parse(JSON.stringify(HP.allPresets().find(p => p.id === 'galaxy')));

    // ---- v_bar(r): beta/index.html:3281-3295(curveVBarAt)を転記。nAz は既定8(アプリと同一)----
    K.vBarAt = (r, nAz = 8) => {
      const s = HP.sim, G = s.params.G, eps2 = s.params.softening * s.params.softening;
      let accSum = 0;
      for (let a = 0; a < nAz; a++) {
        const th = (a / nAz) * Math.PI * 2, px = r * Math.cos(th), py = r * Math.sin(th);
        let axp = 0, ayp = 0;
        for (let j = 0; j < s.n; j++) {
          const dx = s.x[j] - px, dy = s.y[j] - py, d2 = dx * dx + dy * dy;
          const fg = G * s.m[j] / Math.pow(d2 + eps2, 1.5);
          axp += fg * dx; ayp += fg * dy;
        }
        accSum += -(axp * Math.cos(th) + ayp * Math.sin(th));
      }
      const ar = accSum / nAz;
      return ar > 0 ? Math.sqrt(r * ar) : 0;
    };
    // ---- u_φ(r): E3 フレーム場(beta/index.html:2476-2493 と同形。kFrame は掛けない素の u)----
    // tests/exp-darkrotor.mjs:180-197 の uphiAt を転記(16方位平均)。場の点での評価なので
    // 全粒子を含む(粒子が受ける u は自己場を除くが、恒星 m≈0.33 の自己項 w=m/ε は
    // W≈D₀+2500/r に対し 1% 未満 — meta.selfTermFrac に実測を残す)。
    K.uPhiAt = (r) => {
      const s = HP.sim, p = s.params, eps2 = p.softening * p.softening, q = p.q;
      let acc = 0;
      for (let a = 0; a < 16; a++) {
        const th = (a / 16) * Math.PI * 2, px = r * Math.cos(th), py = r * Math.sin(th);
        let uNx = 0, uNy = 0, W = p.D0;
        for (let j = 0; j < s.n; j++) {
          const dx = px - s.x[j], dy = py - s.y[j], d2 = dx * dx + dy * dy;
          const inv = 1 / Math.sqrt(d2 + eps2), w = s.m[j] * inv, d = Math.sqrt(d2);
          W += w;
          let om = 0; const sj = s.spin[j];
          if (sj !== 0) { const tt = s.R[j] / (s.R[j] + d); om = sj * Math.pow(tt, q); }
          uNx += w * (s.vx[j] + om * (-dy)); uNy += w * (s.vy[j] + om * dx);
        }
        acc += (px * uNy - py * uNx) / r / W;
      }
      return acc / 16;
    };
    // ---- a_rep(r): E5′ 斥力の動径成分(外向き正)。beta/index.html:2494-2499 を転記し、
    // 帯内の実在恒星(index 1..nDisk)について実測平均する(テスト粒子ではなく実配置)。
    K.aRepBand = (lo, hi, nDisk) => {
      const s = HP.sim, p = s.params, eps2 = p.softening * p.softening, q = p.q, kRep = p.kRep;
      let sum = 0, c = 0;
      for (let i = 1; i <= nDisk && i < s.n; i++) {
        const ri = Math.hypot(s.x[i], s.y[i]);
        if (!(ri >= lo && ri < hi)) continue;
        let ax = 0, ay = 0;
        const mi = s.m[i], si = s.spin[i];
        for (let j = 0; j < s.n; j++) {
          if (j === i) continue;
          const dx = s.x[i] - s.x[j], dy = s.y[i] - s.y[j], d = Math.sqrt(dx * dx + dy * dy);
          const mj = s.m[j], sj = s.spin[j];
          let omi = 0, omj = 0;
          if (si !== 0) { const tt = s.R[i] / (s.R[i] + d); omi = si * Math.pow(tt, q); }
          if (sj !== 0) { const tt = s.R[j] / (s.R[j] + d); omj = sj * Math.pow(tt, q); }
          if (kRep > 0 && (omi !== 0 || omj !== 0) && Math.abs(mi + mj) > 1e-9) {
            const f = kRep * (mi * mj / (mi + mj)) * (omi * omi + omj * omj);
            ax += f / mi * dx; ay += f / mi * dy;
          }
        }
        sum += (ax * s.x[i] + ay * s.y[i]) / ri; c++;   // 外向き正
      }
      return { aRep: c ? sum / c : 0, n: c };
    };
    // ---- v(r) 実測(tests/qa.mjs:1429-1432 → tests/seeds.mjs:77-84 の8帯版を転記)----
    K.vMeasBand = (lo, hi, nDisk) => {
      const s = HP.sim;
      let sum = 0, c = 0;
      for (let i = 1; i <= nDisk && i < s.n; i++) {
        const r = Math.hypot(s.x[i], s.y[i]);
        if (r >= lo && r < hi) { sum += (s.x[i] * s.vy[i] - s.y[i] * s.vx[i]) / r; c++; }
      }
      return { v: c ? sum / c : 0, n: c };
    };
    // ---- ローターリング付きプリセットの生成 ----
    // 恒星円盤の index を変えないよう bodies の末尾に追加する(0=中心星・1..380=円盤・381..=ローター)
    K.mkPreset = (cfg) => {
      const g = K.galPreset();
      if (cfg.kFrame !== undefined) g.physics.kFrame = cfg.kFrame;
      if (cfg.kRep !== undefined) g.physics.kRep = cfg.kRep;
      if (cfg.rings) {
        cfg.rings.forEach((rr, ri) => {
          const vr = (cfg.vRing && cfg.vRing[ri] !== undefined) ? cfg.vRing[ri] : 0;
          for (let k = 0; k < K.N_PER_RING; k++) {
            const ang = (k / K.N_PER_RING) * Math.PI * 2 + (ri % 2 ? Math.PI / K.N_PER_RING : 0);
            g.bodies.push({ type: 'single', rMul: 2.0, m: cfg.m,
              x: rr * Math.cos(ang), y: rr * Math.sin(ang),
              vx: -vr * Math.sin(ang), vy: vr * Math.cos(ang),
              spin: cfg.s, lightSweep: 1, pinned: false });
          }
        });
      }
      return g;
    };
    K.build = (cfg) => { const v = HP.validatePreset(K.mkPreset(cfg)); HP.sim.build(v.preset); return (v.warnings || []).length; };
    // 2パス構築: リング半径での v_bar を測ってからローターに円軌道速度を与える
    K.buildWithCircularRings = (cfg) => {
      K.build(cfg);
      if (!cfg.rings) return { vRing: [] };
      const vRing = cfg.rings.map(r => K.vBarAt(r));
      K.build(Object.assign({}, cfg, { vRing }));
      return { vRing };
    };
    // ---- 帯別プロファイル(v_bar・u_φ・a_rep・v実測)----
    K.profile = (nDisk) => K.BANDS.map(b => {
      const vb = K.vBarAt(b.mid), vb32 = K.vBarAt(b.mid, 32);
      const ar = K.aRepBand(b.lo, b.hi, nDisk), vm = K.vMeasBand(b.lo, b.hi, nDisk);
      return { rLo: b.lo, rHi: b.hi, rMid: b.mid, vBar: vb, vBar32: vb32,
        uPhi: K.uPhiAt(b.mid), aRep: ar.aRep, nRep: ar.n, vMeas: vm.v, nMeas: vm.n };
    });
    window.__E3 = K;
    return true;
  }, cfg);
}

// ---- 基準(ローター無しの 🌌galaxy)----
async function measureBase(page, opt) {
  return page.evaluate(({ STEPS, DT, VF_RADIUS }) => {
    const K = window.__E3;
    const g = K.galPreset();
    const nDisk = g.bodies[1].n;
    K.build({});
    const s = HP.sim;
    const t0 = { step: 0, profile: K.profile(nDisk), vBarAtVf: K.vBarAt(VF_RADIUS), uPhiAtVf: K.uPhiAt(VF_RADIUS) };
    // 恒星が受ける u の自己場寄与の割合(場の点評価との差の見積り)
    const p = s.params, eps = p.softening;
    const selfTermFrac = (() => {
      let i = -1, best = 1e9;
      for (let k = 1; k <= nDisk; k++) { const d = Math.abs(Math.hypot(s.x[k], s.y[k]) - 220); if (d < best) { best = d; i = k; } }
      let W = p.D0;
      for (let j = 0; j < s.n; j++) { if (j === i) continue;
        const dx = s.x[i] - s.x[j], dy = s.y[i] - s.y[j];
        W += s.m[j] / Math.sqrt(dx * dx + dy * dy + eps * eps); }
      const wSelf = s.m[i] / eps;
      return { i, r: Math.hypot(s.x[i], s.y[i]), wSelf, W, frac: wSelf / (W + wSelf) };
    })();
    for (let k = 0; k < STEPS; k++) s.step(DT);
    const tEnd = { step: STEPS, profile: K.profile(nDisk), vBarAtVf: K.vBarAt(VF_RADIUS),
      uPhiAtVf: K.uPhiAt(VF_RADIUS), nan: s.hasNaN() };
    // kFrame=0 対照(E1 の B 条件と同じ)
    K.build({ kFrame: 0 });
    for (let k = 0; k < STEPS; k++) s.step(DT);
    const tEndK0 = { step: STEPS, profile: K.profile(nDisk), nan: s.hasNaN() };
    return { nDisk, t0, tEnd, tEndK0, selfTermFrac };
  }, opt);
}

// ---- 設計格子の掃引(t=0 の解析のみ。step しない)----
async function sweep(page, opt) {
  return page.evaluate(({ grid, vObs, kFrame }) => {
    const K = window.__E3;
    const nDisk = K.galPreset().bodies[1].n;
    return grid.map(cfg => {
      const { vRing } = K.buildWithCircularRings(cfg);
      const s = HP.sim;
      let mRot = 0;
      for (let i = nDisk + 1; i < s.n; i++) mRot += s.m[i];
      const bands = K.profile(nDisk).map((b, k) => {
        const vo = vObs[k];
        // u_req(r) = (v_obs² − v_bar² + r·a_rep)/(k_F·v_obs)
        const uReq = (vo * vo - b.vBar * b.vBar + b.rMid * b.aRep) / (kFrame * vo);
        // 逆に、設計の u_φ から予測される円軌道速度(同じ釣り合いの根):
        //   v² − k_F·u_φ·v − (v_bar² − r·a_rep) = 0
        const B = kFrame * b.uPhi, C = b.vBar * b.vBar - b.rMid * b.aRep;
        const disc = B * B + 4 * C;
        // disc≤0 = その半径に円軌道解が存在しない(E5′ 斥力が重力+フレームを上回る)
        const vPred = disc > 0 ? (B + Math.sqrt(disc)) / 2 : 0;
        return Object.assign({}, b, { vObs: vo, uReq, vPred, ratioPred: vPred / vo,
          noCircular: !(disc > 0),
          errU: uReq !== 0 ? (b.uPhi - uReq) / Math.abs(uReq) : null });
      });
      return { id: cfg.id, ring: cfg.ringId, m: cfg.m, s: cfg.s, rings: cfg.rings, vRing,
        mRotTotal: mRot, bands };
    });
  }, opt);
}

// ---- 最終走行(6000步)----
async function finalRun(page, opt) {
  return page.evaluate(({ cfg, STEPS, DT, vObs }) => {
    const K = window.__E3;
    const nDisk = K.galPreset().bodies[1].n;
    K.buildWithCircularRings(cfg);
    const s = HP.sim;
    const snap = (step) => {
      const prof = K.profile(nDisk).map((b, k) => Object.assign({}, b, {
        vObs: vObs[k], ratioObs: vObs[k] ? b.vMeas / vObs[k] : null,
        ratioBar: b.vBar > 0 ? b.vMeas / b.vBar : null }));
      // 健全性: 恒星の残存・半径分布・ローターの残存
      const rs = [];
      for (let i = 1; i <= nDisk && i < s.n; i++) rs.push(Math.hypot(s.x[i], s.y[i]));
      rs.sort((a, b) => a - b);
      let rotIn = 0, nRot = 0, spinAbs = 0;
      for (let i = nDisk + 1; i < s.n; i++) { nRot++; spinAbs += Math.abs(s.spin[i]);
        if (Math.hypot(s.x[i], s.y[i]) < 400) rotIn++; }
      let maxSpin = 0;
      for (let i = 0; i < s.n; i++) maxSpin = Math.max(maxSpin, Math.abs(s.spin[i]));
      return { step, t: +s.t.toFixed(2), profile: prof,
        health: { r50: rs[Math.floor(rs.length * 0.5)], r90: rs[Math.floor(rs.length * 0.9)],
          keep: rs.filter(r => r < 600).length, nDisk, nRot, rotorInside400: rotIn,
          rotorSpinAbsMean: nRot ? spinAbs / nRot : 0, maxSpin },
        nan: s.hasNaN() };
    };
    const out = { id: cfg.id, checkpoints: [snap(0)] };
    let done = 0;
    for (const ck of [3000, 6000]) {
      for (let k = done; k < ck; k++) s.step(DT);
      done = ck;
      out.checkpoints.push(snap(ck));
      if (out.checkpoints.at(-1).nan) break;
    }
    return out;
  }, opt);
}

// ---- 実行 ----
const t0 = Date.now();
const commit = (() => { try { return execSync('git rev-parse HEAD', { cwd: ROOT }).toString().trim(); } catch { return 'unknown'; } })();
const browser = await launch();
const page = await newPage(browser);
await installKernel(page, { BANDS, N_PER_RING, DT });
console.log(`対象: ${TARGET}  commit=${commit.slice(0, 7)}`);

console.log('E3-1: 基準(ローター無し 🌌galaxy)の v_bar(r)/a_rep(r) 実測...');
const base = await measureBase(page, { STEPS, DT, VF_RADIUS });
const kFrame = 1;
const VF = VF_FACTOR * base.t0.vBarAtVf;
// 目標: 外縁平坦。v_bar が V_f を上回る内側では v_bar を、下回る外側では V_f を目標とする
const vObs = base.t0.profile.map(b => Math.max(b.vBar, VF));
console.log(`  v_bar(220)@t=0 = ${base.t0.vBarAtVf.toFixed(4)} → V_f = ${VF_FACTOR}× = ${VF.toFixed(4)}`);
console.log(`  v_bar(r)@t=0 : ${base.t0.profile.map(b => b.vBar.toFixed(2)).join(' ')}`);
console.log(`  a_rep(r)@t=0 : ${base.t0.profile.map(b => b.aRep.toExponential(1)).join(' ')}`);
console.log(`  v_obs(r)目標 : ${vObs.map(v => v.toFixed(2)).join(' ')}`);
console.log(`  u_φ(r)@t=0   : ${base.t0.profile.map(b => b.uPhi.toFixed(3)).join(' ')}`);
console.log(`  基準6000步 v(r): ${base.tEnd.profile.map(b => b.vMeas.toFixed(2)).join(' ')} (n=${base.tEnd.profile.map(b => b.nMeas).join('/')})`);

// u_req(r)(基準構成での必要フレーム速度)
const uReqBase = base.t0.profile.map((b, k) =>
  (vObs[k] * vObs[k] - b.vBar * b.vBar + b.rMid * b.aRep) / (kFrame * vObs[k]));
console.log(`  u_req(r)基準 : ${uReqBase.map(u => u.toFixed(3)).join(' ')}`);

console.log(`E3-2: 設計格子の掃引(${RING_SETS.length}×${M_ROT.length}×${S_ROT.length}=${RING_SETS.length * M_ROT.length * S_ROT.length} 構成・t=0 解析)...`);
const grid = [];
for (const rs of RING_SETS) for (const m of M_ROT) for (const s of S_ROT)
  grid.push({ id: `${rs.id}-m${m}-s${s}`, ringId: rs.id, rings: rs.radii, m, s });
const sweepRes = await sweep(page, { grid, vObs, kFrame });
const scoreOf = (r) => Math.max(...OUTER3.map(k => Math.abs(r.bands[k].ratioPred - 1)));
sweepRes.forEach(r => { r.scoreOuter3 = scoreOf(r); });
const ranked = [...sweepRes].sort((a, b) => a.scoreOuter3 - b.scoreOuter3);
for (const r of ranked) console.log(`  ${r.id.padEnd(14)} m_tot=${r.mRotTotal.toFixed(0).padStart(4)} ` +
  `u_φ(外3)=${OUTER3.map(k => r.bands[k].uPhi.toFixed(2)).join('/')} ` +
  `u_req=${OUTER3.map(k => r.bands[k].uReq.toFixed(2)).join('/')} ` +
  `v_pred/v_obs=${OUTER3.map(k => r.bands[k].ratioPred.toFixed(3)).join('/')} score=${r.scoreOuter3.toFixed(3)}`);

const bestIds = [ranked[0].id, ranked[1].id];
console.log(`E3-3: 最良2構成 + 基準対照を ${STEPS}步 実走...`);
const finals = {};
for (const id of bestIds) {
  const cfg = grid.find(g => g.id === id);
  const t1 = Date.now();
  finals[id] = await finalRun(page, { cfg, STEPS, DT, vObs });
  const last = finals[id].checkpoints.at(-1);
  console.log(`  ${id}: v/v_obs(外3)=${OUTER3.map(k => last.profile[k].ratioObs?.toFixed(3)).join('/')} ` +
    `n=${OUTER3.map(k => last.profile[k].nMeas).join('/')} r90=${last.health.r90.toFixed(0)} ` +
    `keep=${last.health.keep}/${last.health.nDisk} rotor=${last.health.rotorInside400}/${last.health.nRot} ` +
    `NaN=${last.nan} [${((Date.now() - t1) / 1000).toFixed(0)}s]`);
}
// 最良構成の kFrame=0 対照(フレーム経路の寄与分離)
{
  const cfg = Object.assign({}, grid.find(g => g.id === bestIds[0]), { kFrame: 0, id: bestIds[0] + '-kF0' });
  finals[cfg.id] = await finalRun(page, { cfg, STEPS, DT, vObs });
  const last = finals[cfg.id].checkpoints.at(-1);
  console.log(`  ${cfg.id}: v/v_obs(外3)=${OUTER3.map(k => last.profile[k].ratioObs?.toFixed(3)).join('/')} r90=${last.health.r90.toFixed(0)}`);
}
// 基準(ローター無し)を同じ指標で
{
  const cfg = { id: 'base-norotor' };
  finals[cfg.id] = await finalRun(page, { cfg, STEPS, DT, vObs });
  const last = finals[cfg.id].checkpoints.at(-1);
  console.log(`  ${cfg.id}: v/v_obs(外3)=${OUTER3.map(k => last.profile[k].ratioObs?.toFixed(3)).join('/')} r90=${last.health.r90.toFixed(0)}`);
}

// ---- E3-4: kRep=0 診断(第19便 §4.2-3 の統制と同じ切り分け)----
// E5′ 斥力を切ると a_rep=0 になり、u_req は純粋に「フレームで足りない分」だけになる。
// u_φ の不足(2D・q=2 の限界)と E5′ 障害のどちらが律速かを分離する。
console.log('E3-4: kRep=0 診断(E5′ 斥力を切った同一格子の掃引)...');
const gridK0 = grid.map(g => Object.assign({}, g, { kRep: 0, id: g.id + '-kRep0' }));
const sweepK0 = await sweep(page, { grid: gridK0, vObs, kFrame });
sweepK0.forEach(r => { r.scoreOuter3 = scoreOf(r); });
const rankedK0 = [...sweepK0].sort((a, b) => a.scoreOuter3 - b.scoreOuter3);
for (const r of rankedK0.slice(0, 8)) console.log(`  ${r.id.padEnd(20)} m_tot=${r.mRotTotal.toFixed(0).padStart(4)} ` +
  `u_φ(外3)=${OUTER3.map(k => r.bands[k].uPhi.toFixed(2)).join('/')} ` +
  `u_req=${OUTER3.map(k => r.bands[k].uReq.toFixed(2)).join('/')} ` +
  `v_pred/v_obs=${OUTER3.map(k => r.bands[k].ratioPred.toFixed(3)).join('/')} score=${r.scoreOuter3.toFixed(3)}`);
{
  const cfg = gridK0.find(g => g.id === rankedK0[0].id);
  finals[cfg.id] = await finalRun(page, { cfg, STEPS, DT, vObs });
  const last = finals[cfg.id].checkpoints.at(-1);
  console.log(`  [実走] ${cfg.id}: v/v_obs(外3)=${OUTER3.map(k => last.profile[k].ratioObs?.toFixed(3)).join('/')} ` +
    `n=${OUTER3.map(k => last.profile[k].nMeas).join('/')} r90=${last.health.r90.toFixed(0)} ` +
    `keep=${last.health.keep}/${last.health.nDisk} rotor=${last.health.rotorInside400}/${last.health.nRot} NaN=${last.nan}`);
}

await browser.close();

const out = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(), commit, target: TARGET,
  note: '第36便 E3(台帳4-47 Phase C): u_req 逆問題でのローター分布設計。QA ではない(合否なし)。' +
    '成功基準は研究目標であり、未達でも FAIL ではない(実測の記録が成果)。',
  meta: {
    dt: DT, steps: STEPS, kFrame, vfFactor: VF_FACTOR, vfRadius: VF_RADIUS, VF,
    bands: BANDS.map((b, i) => ({ index: i, rLo: b.lo, rHi: b.hi, rMid: b.mid })),
    outer3: OUTER3, ringSets: RING_SETS, mRot: M_ROT, sRot: S_ROT, nPerRing: N_PER_RING,
    ureqFormula: 'u_req(r) = (v_obs² − v_bar² + r·a_rep)/(k_F·v_obs)  [REVIEW_20260723 §2.1]',
    vPredFormula: 'v_pred は v² − k_F·u_φ·v − (v_bar² − r·a_rep) = 0 の正根',
    sources: {
      vBar: 'beta/index.html:3281-3295 (curveVBarAt)',
      frameU: 'beta/index.html:2476-2493 (E3)',
      aRep: 'beta/index.html:2494-2499 (E5′)',
      transport: 'beta/index.html:2626-2641 (E6′ Δv=k_F·Δu)',
      vMeas: 'tests/qa.mjs:1429-1432 → tests/seeds.mjs:77-84 (8帯)',
      bands: 'tests/seeds.mjs:36-41 (E1・台帳4-49 と同一の8帯)'
    }
  },
  base, vObs, uReqBase, sweep: sweepRes, ranked: ranked.map(r => ({ id: r.id, score: r.scoreOuter3 })),
  sweepKRep0: sweepK0, rankedKRep0: rankedK0.map(r => ({ id: r.id, score: r.scoreOuter3 })),
  finals
};
fs.writeFileSync(path.join(OUT_DIR, 'ureq-results.json'), JSON.stringify(out, null, 1));
console.log(`保存: tests/out/ureq-results.json  合計 ${((Date.now() - t0) / 1000).toFixed(1)}s`);

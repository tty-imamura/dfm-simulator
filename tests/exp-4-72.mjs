// 第39便 39A フェーズ1(台帳4-72): 🕶️darkrotor を V1a 構成(中心BH+対向2ローター)へ改訂する
// 前の「内蔵化前の最終確認」と、説明文・QA 閾値に載せる実測値の再取得。
// - 本スクリプトは QA ではない(合否 exit code なし)。tests/out/exp-4-72.json に計測値を保存する。
// - **対象実装ファイル(beta/index.html)は一切変更しない**(39C が並行編集中)。プリセットの
//   改変・追加もしない — V1a 構成は「内蔵 🕶️darkrotor の深いコピーを書き換えて validatePreset に
//   通す」カスタムプリセット注入経路(tests/qa.mjs:1208-1224 freebox base()/run() /
//   tests/seeds.mjs:113-117・162-165 と同一の HP API)だけで作る。
//   起動直後に一度だけ HP.loadPreset('darkrotor', false) を通す(ページ内グローバル currentPreset を
//   正規経路で同期。tests/exp-factors.mjs:13-16 の A/B複製破損バグの教訓)。
// - 対象HTMLは起動時に一時ディレクトリへスナップショットしてから開く(1回の実験中に対象が
//   入れ替わらないことの保証 — 38C の tests/exp-4-67.mjs / exp-4-68c.mjs と同じ流儀。SHA-256 を記録)。
//
// V1a 構成(第38便 38C レポート §3.1・提案A = 統括採択):
//   中心BH   m2000・spin0.12・radius45・rMul2.0・lightSweep1・自由(vx/vy は総運動量ゼロ化で再計算)
//   ローター 対向2体のみ(x=±200・m150・radius18・spin2.0・rMul2.0・lightSweep1)
//            周速 3.9169 → 3.371251(38C §3.3 の較正値: 6000步後の半径が 200 に戻る条件)
//   恒星リング 380体(rIn70・rOut260・aroundMass2000)は不変。物理パラメータも現行のまま。
//   有効窓 6000步 → 24000步(t≈384)
//
// 測定(フェーズ1の 4 項目):
//   P0 総運動量ゼロ化の2パス解(= 内蔵化する vx/vy)+ 較正の再確認(6000步後のローター半径)
//   P1 24000步 本走行: on(spin2.0)/ ctrl(QA と同じ「中心BH+全ローターのスピン0」)
//      → 保持率・σ_r・rotDev・NaN・|ΔL|/L_scale・A2(帯平均)・ピッチ角・behavior.darkrotor 用の
//        3000步指標(外縁v_φ・r90・ローター平均|spin|・重心移動 …)
//   P2 スピン用量反応(ローターのみ 0→1→2→3。2.0 は P1 の 6000步 CK を流用)
//   P3 台帳4-53 の要因分離を新構成で再測定(exp-factors.mjs の darkrotor 節と同式・同步数)
//   P4 t=0 静的量: darkrotor.uphi(u_φ 140/200/260 の on/off 比)
//
// 実行: node tests/exp-4-72.mjs(playwright 必須。既定 4 並列・約8分)
//   QA_TARGET=beta/index.html node tests/exp-4-72.mjs   … 既定
//   EXP472_NW=2 node tests/exp-4-72.mjs                 … 並列ワーカー数(既定4)
//
// 転記元(指標式は tests/qa.mjs / tests/exp-factors.mjs から一字も変えず転記。両ファイルは変更していない):
//   m=2 腕振幅 A2 / 環帯定義 ..... tests/qa.mjs:197(BANDS)+ 398-410(darkrotorLong の a2)
//   恒星保持・ローター偏差 ....... tests/qa.mjs:427-433(keep/tot/rotDev/rotIn)
//   外縁v_φ・r90・重心移動ほか ... tests/qa.mjs:346-381(darkrotorMidNew — behavior.darkrotor の計算部)
//   u_φ(140/200/260) ............ tests/qa.mjs:2999-3030(darkrotor.uphi の uphiAt)
//   要因分離の腕指標 ............. tests/exp-factors.mjs:130-162(darkrotor 節・6000步/後半平均)
//   保存則の尺度 pS/lS と相対ずれ  tests/qa.mjs:1211-1220(freebox scales)+ 1170-1173
//     = beta/index.html:5866-5867(HP.verify.v1 の恒等式)と同形
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const TARGET_ABS = TARGET.startsWith('/') ? TARGET : path.join(ROOT, TARGET);
const OUT_DIR = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(OUT_DIR, { recursive: true });

const TARGET_SRC = fs.readFileSync(TARGET_ABS);
const TARGET_SHA = crypto.createHash('sha256').update(TARGET_SRC).digest('hex');
const TMP_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'exp472-'));
const SNAP = path.join(TMP_DIR, 'target.html');
fs.writeFileSync(SNAP, TARGET_SRC);
const INDEX = 'file://' + SNAP;

const DT = 0.016;
const STEPS = 24000;                        // 新しい有効窓
const CKS = [3000, 6000, 12000, 24000];     // 3000 は behavior.darkrotor(QA)と同じ步数
const BLK = 500;                            // A2 スナップショット間隔(qa.mjs darkrotorLong と同じ)
const A2_WIN = 3000;                        // 帯平均窓([ck-3000, ck] の7点 = qa.mjs の後半平均と同形)
const BANDS = [[80, 120], [120, 160], [160, 200], [200, 240]];   // tests/qa.mjs:197 を転記
// ピッチ角推定用の細い環帯(恒星リングは rIn=70・rOut=260)。A2 の帯定義とは別物(探索指標)
const PBANDS = [];
for (let r = 80; r < 260; r += 15) PBANDS.push([r, r + 15]);
const REF_SEED = 20260726;                  // 内蔵プリセットの seed(= 既定seed)
const VROT = 3.371251;                      // 38C §3.3 の較正値
const CAL_STEPS = 6000;                     // 較正判定の走行長(38C と同じ)
const FACT_STEPS = 6000;                    // 要因分離(exp-factors.mjs darkrotor 節)の走行長
const DOSE_SPINS = [0, 1, 3];               // 2.0 は P1 の on を流用
const CHANNELS = [                          // tests/exp-factors.mjs:63-71 を転記
  { id: 'baseline', override: null },
  { id: 'kFrame=0', override: { kFrame: 0 } },
  { id: 'kRep=0', override: { kRep: 0 } },
  { id: 'muF=0', override: { muF: 0 } },
  { id: 'kappaS=0', override: { kappaS: 0 } },
  { id: 'etaRad=0', override: { etaRad: 0 } },
  { id: 'D0=0', override: { D0: 0 } },
];
const NW = Math.max(1, Number(process.env.EXP472_NW || 4));

async function launch() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  const { chromium } = await import('playwright-core');
  return chromium.launch({ executablePath: exe });
}

function pageSetup() {
  HP.loadPreset('darkrotor', false);   // 正規経路でプリセットを読む(currentPreset 同期)
  const BASE = () => JSON.parse(JSON.stringify(HP.allPresets().find(q => q.id === 'darkrotor')));

  // V1a のプリセット組み立て。bodies 以外(physics/seed/camera/overlays/activeParams)は内蔵のまま。
  // bodies = [中心BH, ローター(x=+200), ローター(x=-200), 恒星リング] — フェーズ2で
  // BUILTIN_PRESETS に書く配列そのものの順序。
  const mkPreset = (o) => {
    const p = BASE();
    const src = p.bodies, bh = src[0], rotors = src.slice(1, 11), ring = src[11];
    const keep = rotors.filter(b => Math.abs(b.y) < 1e-9 && Math.abs(Math.abs(b.x) - 200) < 1e-9);
    for (const b of keep) {
      b.vy = (b.x > 0 ? 1 : -1) * o.vRot;
      if (o.rotorSpin !== undefined) b.spin = o.rotorSpin;
    }
    if (o.bhSpin !== undefined) bh.spin = o.bhSpin;
    if (o.bhVx !== undefined) { bh.vx = o.bhVx; bh.vy = o.bhVy; }
    p.bodies = [bh].concat(keep, [ring]);
    p.seed = o.seed;
    return p;
  };
  const buildRaw = (o) => {
    const v = HP.validatePreset(mkPreset(o));
    if (!v.ok) throw new Error('validatePreset NG: ' + v.errors.join(' / '));
    HP.sim.build(v.preset);
    return v;
  };
  // 総運動量ゼロ化(2パス。single の運動量は v に線形なので BH の Δv = −P/m_BH で厳密に 0)
  const zeroSolve = (o) => {
    buildRaw(Object.assign({}, o, { bhVx: 0, bhVy: 0 }));
    const t = HP.sim.totals(), mBH = HP.sim.m[0];
    return { bhVx: -t.px / mBH, bhVy: -t.py / mBH, P0: [t.px, t.py], mBH };
  };
  const build = (o) => {
    const v = buildRaw(o);
    const s = HP.sim;
    if (o.override) Object.assign(s.params, o.override);        // exp-factors.mjs と同じ経路
    const OFF = mkPreset(o).bodies.filter(b => b.type === 'single').length;
    if (o.ctrlZeroSpins) for (let i = 0; i < OFF; i++) s.spin[i] = 0;   // qa.mjs darkrotorLong の ctrl
    return { warnings: v.warnings, OFF };
  };

  // ---- 指標(tests/qa.mjs からの転記)----
  const a2 = (s, OFF, BB) => BB.map(([lo, hi]) => {
    const bx = s.x[0], by = s.y[0];
    let cr = 0, ci = 0, N = 0;
    for (let i = OFF; i < s.n; i++) {
      const dx = s.x[i] - bx, dy = s.y[i] - by, r = Math.hypot(dx, dy);
      if (r >= lo && r < hi) { const th = Math.atan2(dy, dx);
        cr += Math.cos(2 * th); ci += Math.sin(2 * th); N++; }
    }
    return { A2: N ? Math.hypot(cr, ci) / N : 0, N, noise: N ? Math.sqrt(Math.PI / (4 * N)) : 0 };
  });
  const scales = (s) => {
    let pS = 0, lS = 0;
    for (let i = 0; i < s.n; i++) {
      pS += s.m[i] * Math.hypot(s.vx[i], s.vy[i]);
      lS += Math.abs(s.m[i] * s.x[i] * s.vy[i]) + Math.abs(s.m[i] * s.y[i] * s.vx[i])
          + 0.5 * s.m[i] * s.R[i] * s.R[i] * Math.abs(s.spin[i]);
    }
    return { pS, lS };
  };
  const med = (arr) => { if (!arr.length) return null;
    const a = arr.slice().sort((x, y) => x - y); return a[Math.floor(a.length / 2)]; };

  // ---- ピッチ角(探索指標。QA には使わない)----
  // 各細環帯で m=2 の位相 ψ(r) = ½·arg(Σ e^{2iθ}) を測り、対数螺旋 r ∝ e^{θ tan i} を仮定して
  // ψ = a + b·ln r の重み付き最小二乗を取る。tan i = 1/|b| → ピッチ角 i = atan(1/|b|)。
  // ψ は π 周期なので隣接帯へ連続化(最も近い分枝を選ぶ)。有意帯(A2 > 2×ノイズ床 √(π/4N))のみ使う。
  // 回転が反時計回り(dirSign=+1)なら b<0 = 後行(trailing)螺旋。
  const pitchFit = (s, OFF, PB, dirSign) => {
    const bx = s.x[0], by = s.y[0];
    const pts = [];
    for (const [lo, hi] of PB) {
      let cr = 0, ci = 0, N = 0;
      for (let i = OFF; i < s.n; i++) {
        const dx = s.x[i] - bx, dy = s.y[i] - by, r = Math.hypot(dx, dy);
        if (r >= lo && r < hi) { const th = Math.atan2(dy, dx);
          cr += Math.cos(2 * th); ci += Math.sin(2 * th); N++; }
      }
      if (N < 8) continue;
      const A = Math.hypot(cr, ci) / N, noise = Math.sqrt(Math.PI / (4 * N));
      pts.push({ r: Math.sqrt(lo * hi), psi: Math.atan2(ci, cr) / 2, A, N, noise });
    }
    const use = pts.filter(p => p.A > 2 * p.noise);
    if (use.length < 4) return { ok: false, nBand: use.length, nCand: pts.length };
    let prev = use[0].psi;
    const xs = [], ys = [], ws = [];
    for (let k = 0; k < use.length; k++) {
      let v = use[k].psi;
      if (k > 0) v += Math.round((prev - v) / Math.PI) * Math.PI;
      prev = v;
      xs.push(Math.log(use[k].r)); ys.push(v); ws.push(use[k].N * use[k].A);
    }
    let Sw = 0, Sx = 0, Sy = 0, Sxx = 0, Sxy = 0;
    for (let k = 0; k < xs.length; k++) { const w = ws[k];
      Sw += w; Sx += w * xs[k]; Sy += w * ys[k]; Sxx += w * xs[k] * xs[k]; Sxy += w * xs[k] * ys[k]; }
    const den = Sw * Sxx - Sx * Sx;
    if (!(Math.abs(den) > 1e-12)) return { ok: false, nBand: use.length, nCand: pts.length };
    const b = (Sw * Sxy - Sx * Sy) / den, a = (Sy - b * Sx) / Sw;
    let ssTot = 0, ssRes = 0; const ym = Sy / Sw;
    for (let k = 0; k < xs.length; k++) { const w = ws[k], pr = a + b * xs[k];
      ssRes += w * (ys[k] - pr) * (ys[k] - pr); ssTot += w * (ys[k] - ym) * (ys[k] - ym); }
    return { ok: true, slope: b, pitchDeg: Math.atan(1 / Math.abs(b)) * 180 / Math.PI,
      R2: ssTot > 0 ? 1 - ssRes / ssTot : null, nBand: use.length, nCand: pts.length,
      trailing: dirSign * b < 0 };
  };

  // 恒星統計(tests/exp-4-67.mjs から転記 — keep は r<400 と r<500 の両方を持つ。
  // 38C レポートの保持率は r<400 基準・qa.mjs の keepPct は r<500 基準)
  const starStats = (s, OFF, st0) => {
    const bx = s.x[0], by = s.y[0], bvx = s.vx[0], bvy = s.vy[0];
    const all = [], inR = [];
    let keep400 = 0, keep500 = 0, tot = 0, sVr2 = 0, sumL = 0, outer = 0, nOuter = 0;
    for (let i = OFF; i < s.n; i++) {
      const dx = s.x[i] - bx, dy = s.y[i] - by, r = Math.hypot(dx, dy);
      all.push(r);
      if (st0[i - OFF] < 350) { tot++; if (r < 400) keep400++; if (r < 500) keep500++; }
      // 外縁 v_φ: tests/qa.mjs:363-364(darkrotorMidNew)を転記
      if (r >= 156 && r <= 286) { outer += (dx * (s.vy[i] - bvy) - dy * (s.vx[i] - bvx)) / r; nOuter++; }
      sumL += s.m[i] * (dx * (s.vy[i] - bvy) - dy * (s.vx[i] - bvx));
      if (r < 400) { inR.push(r);
        const vr = (dx * (s.vx[i] - bvx) + dy * (s.vy[i] - bvy)) / (r || 1);
        sVr2 += vr * vr; }
    }
    const mean = inR.reduce((a, v) => a + v, 0) / (inR.length || 1);
    const varR = inR.reduce((a, v) => a + (v - mean) * (v - mean), 0) / (inR.length || 1);
    const sortAll = all.slice().sort((x, y) => x - y);
    return { keep400, keep500, tot,
      keepPct: tot ? 100 * keep400 / tot : 0, keepPct500: tot ? 100 * keep500 / tot : 0,
      nIn: inR.length, sigmaR: Math.sqrt(varR), medR: med(inR), meanR: mean,
      sigmaVr: Math.sqrt(sVr2 / (inR.length || 1)),
      medRall: med(all), r90all: sortAll[Math.floor(sortAll.length * 0.9)],
      outer: nOuter ? outer / nOuter : 0, nOuter, Lstar: sumL };
  };

  // ---- 本走行 ----
  const runOne = (o, cfg) => {
    const bi = build(o);
    const s = HP.sim;
    const OFF = bi.OFF, NH = OFF - 1;
    const bx0 = s.x[0], by0 = s.y[0];
    const st0 = [], hr0 = [];
    for (let i = OFF; i < s.n; i++) st0.push(Math.hypot(s.x[i] - bx0, s.y[i] - by0));
    for (let k = 1; k <= NH; k++) hr0.push(Math.hypot(s.x[k] - bx0, s.y[k] - by0));
    let M = 0, cx0 = 0, cy0 = 0, p0x = 0, p0y = 0;
    for (let i = 0; i < s.n; i++) { M += s.m[i]; cx0 += s.m[i] * s.x[i]; cy0 += s.m[i] * s.y[i];
      p0x += s.m[i] * s.vx[i]; p0y += s.m[i] * s.vy[i]; }
    cx0 /= M; cy0 /= M;
    const pTot0 = Math.hypot(p0x, p0y);
    const t0 = s.totals(), sc0 = scales(s);
    const init = starStats(s, OFF, st0);
    const dirSign = init.Lstar >= 0 ? 1 : -1;    // 恒星の公転向き(+1 = 反時計回り)
    const snaps = [];
    const cks = [];
    let maxSpin = 0, nanAt = null;
    for (let blk = 0; blk < cfg.STEPS / cfg.BLK; blk++) {
      for (let k = 0; k < cfg.BLK; k++) s.step(0.016);
      const t = (blk + 1) * cfg.BLK;
      for (let i = 0; i < s.n; i++) { const a = Math.abs(s.spin[i]); if (a > maxSpin) maxSpin = a; }
      const z = a2(s, OFF, cfg.BANDS);
      const pf = pitchFit(s, OFF, cfg.PBANDS, dirSign);
      snaps.push({ t, A2: z.map(v => +v.A2.toFixed(6)), N: z.map(v => v.N),
        noise: z.map(v => +v.noise.toFixed(5)),
        pitch: pf.ok ? +pf.pitchDeg.toFixed(2) : null, slope: pf.ok ? +pf.slope.toFixed(4) : null,
        pR2: pf.ok && pf.R2 !== null ? +pf.R2.toFixed(3) : null,
        trailing: pf.ok ? pf.trailing : null, pNB: pf.nBand });
      if (s.hasNaN() && nanAt === null) nanAt = t;
      if (cfg.CKS.indexOf(t) >= 0) {
        const st = starStats(s, OFF, st0);
        const t1 = s.totals(), sc1 = scales(s);
        let rotDev = 0, rotIn = 0, hs = 0, rotR = [];
        for (let k = 1; k <= NH; k++) {
          const r = Math.hypot(s.x[k] - s.x[0], s.y[k] - s.y[0]);
          rotR.push(+r.toFixed(3));
          if (r > 60 && r < 400) rotIn++;
          hs += Math.abs(s.spin[k]);
          rotDev = Math.max(rotDev, Math.abs(r / hr0[k - 1] - 1));
        }
        let cx = 0, cy = 0;
        for (let i = 0; i < s.n; i++) { cx += s.m[i] * s.x[i]; cy += s.m[i] * s.y[i]; }
        const win = snaps.filter(v => v.t >= t - cfg.A2_WIN && v.t <= t);
        const A2m = cfg.BANDS.map((_, b) => win.reduce((a, v) => a + v.A2[b], 0) / win.length);
        const pw = win.map(v => v.pitch).filter(v => v !== null);
        const pwS = pw.slice().sort((a, b) => a - b);
        cks.push({ step: t, tSim: +(t * 0.016).toFixed(3), star: st,
          A2: A2m.map(v => +v.toFixed(5)),
          A2mean: +(A2m.reduce((a, v) => a + v, 0) / A2m.length).toFixed(5),
          A2winN: win.length, noise: snaps[snaps.length - 1].noise, nBand: snaps[snaps.length - 1].N,
          pitchMed: pwS.length ? +pwS[Math.floor(pwS.length / 2)].toFixed(2) : null,
          pitchMin: pwS.length ? pwS[0] : null, pitchMax: pwS.length ? pwS[pwS.length - 1] : null,
          pitchN: pwS.length, trailingN: win.filter(v => v.trailing === true).length,
          rotDev: +rotDev.toFixed(5), rotIn, NH, rotR, haloSpin: hs / NH,
          maxSpinSoFar: +maxSpin.toFixed(4), bhSpin: s.spin[0], nan: s.hasNaN(),
          comMove: Math.hypot(cx / M - cx0, cy / M - cy0),
          Lz: t1.L, P: [t1.px, t1.py],
          ledger: [s.resPx, s.resPy, s.resL, s.radE, s.radL],
          relP: Math.hypot(t1.px + s.resPx - t0.px, t1.py + s.resPy - t0.py) / sc1.pS,
          relL: Math.abs(t1.L + s.resL + s.radL - t0.L) / sc1.lS,
          dLrel0: Math.abs(t1.L + s.resL + s.radL - t0.L) / Math.max(Math.abs(t0.L), 1e-9) });
      }
      if (nanAt !== null) break;
    }
    return { warnings: bi.warnings, n: s.n, OFF, NH, nanAt, dirSign, pTot0,
      init: { star: init, Lz: t0.L, P: [t0.px, t0.py], pScale: sc0.pS, lScale: sc0.lS,
        rotR0: hr0.map(v => +v.toFixed(4)) },
      cks, snaps };
  };

  // ---- 要因分離(tests/exp-factors.mjs:148-161 の darkrotor 節と同式・同步数)----
  const runFactor = (o, cfg) => {
    const bi = build(o);
    const s = HP.sim, OFF = bi.OFF;
    const late = [];
    let maxSpin = 0;
    for (let blk = 0; blk < cfg.FACT_STEPS / 500; blk++) {
      for (let k = 0; k < 500; k++) s.step(0.016);
      for (let i = 0; i < s.n; i++) maxSpin = Math.max(maxSpin, Math.abs(s.spin[i]));
      const t = (blk + 1) * 500;
      if (t >= cfg.FACT_STEPS / 2) late.push(a2(s, OFF, cfg.BANDS).map(v => v.A2));
    }
    const A2 = cfg.BANDS.map((_, b) => late.reduce((a, v) => a + v[b], 0) / late.length);
    const nan = s.hasNaN(), finite = A2.every(Number.isFinite);
    return { value: (!nan && finite) ? A2.reduce((a, v) => a + v, 0) / A2.length : null,
      nan, divergent: nan || !finite, A2: A2.map(v => +v.toFixed(5)), maxSpin, nLate: late.length };
  };

  // ---- 較正の確認: 6000步後のローター半径(38C §3.3 と同じ判定量)----
  const calCheck = (o, cfg) => {
    build(o);
    const s = HP.sim;
    for (let k = 0; k < cfg.CAL_STEPS; k++) s.step(0.016);
    return { r1: Math.hypot(s.x[1] - s.x[0], s.y[1] - s.y[0]),
      r2: Math.hypot(s.x[2] - s.x[0], s.y[2] - s.y[0]) };
  };
  // セカント法(38C §3.3 と同法。較正がずれたときだけ使う)
  const calibrate = (o, cfg) => {
    const rAt = (vRot) => calCheck(Object.assign({}, o, { vRot }), cfg).r1;
    const R0 = 200, TOL = 1.0, VLO = 2.5, VHI = 5.5;
    let v0 = 3.30, r0 = rAt(v0), v1 = 3.60, r1 = rAt(v1);
    const hist = [{ v: v0, r: +r0.toFixed(3) }, { v: v1, r: +r1.toFixed(3) }];
    for (let it = 0; it < 3 && Math.abs(r1 - R0) > TOL; it++) {
      let v2 = (Math.abs(r1 - r0) < 1.0) ? v1 + (r1 < R0 ? 0.4 : -0.4)
        : v1 + (R0 - r1) * (v1 - v0) / (r1 - r0);
      if (!(v2 > VLO)) v2 = VLO; if (!(v2 < VHI)) v2 = VHI;
      if (Math.abs(v2 - v1) < 1e-4) break;
      const r2 = rAt(v2);
      hist.push({ v: +v2.toFixed(6), r: +r2.toFixed(3) });
      v0 = v1; r0 = r1; v1 = v2; r1 = r2;
    }
    const best = hist.slice().sort((a, b) => Math.abs(a.r - R0) - Math.abs(b.r - R0))[0];
    return { vRot: +best.v.toFixed(6), rEnd: best.r, hist };
  };

  // ---- t=0 の u_φ(tests/qa.mjs:2999-3030 の uphiAt を転記)----
  const uphiAt = (s, r) => {
    const p = s.params, eps2 = p.softening * p.softening, q = p.q;
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
        if (s.coreMR[j] !== 0 && sj !== 0 && s.Rc[j] > 0 && s.coreSR[j] !== 1) {
          const tt = s.Rc[j] / (s.Rc[j] + d); om += s.coreMR[j] * sj * (s.coreSR[j] - 1) * Math.pow(tt, q);
        }
        uNx += w * (s.vx[j] + om * (-dy)); uNy += w * (s.vy[j] + om * dx);
      }
      acc += (px * uNy - py * uNx) / r / W;
    }
    return acc / 16;
  };
  const uphiRun = (o) => {
    const bi = build(o);
    const s = HP.sim;
    const on = { u140: uphiAt(s, 140), u200: uphiAt(s, 200), u260: uphiAt(s, 260) };
    build(Object.assign({}, o, { ctrlZeroSpins: true }));
    const s2 = HP.sim;
    const off = { u140: uphiAt(s2, 140), u200: uphiAt(s2, 200), u260: uphiAt(s2, 260), nOff: bi.OFF };
    return { on, off, ratio: [on.u140 / off.u140, on.u200 / off.u200, on.u260 / off.u260] };
  };

  window.__E472 = { mkPreset, buildRaw, zeroSolve, build, runOne, runFactor, calCheck, calibrate, uphiRun };
}

async function newPage(browser) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(INDEX);
  await page.waitForFunction(() => window.HP && HP.sim);
  await page.evaluate(pageSetup);
  return page;
}

async function checkApplicable(page) {
  return page.evaluate(() => {
    if (!HP.allPresets().some(p => p.id === 'darkrotor')) return { ok: false, reason: '対象に darkrotor プリセットなし' };
    if (!(HP.sim && HP.sim.obsT)) return { ok: false, reason: '対象に観測温度系(obsT)なし(旧v3以前)' };
    const P = HP.allPresets().find(q => q.id === 'darkrotor');
    if (!P.bodies.every(b => !b.pinned && !b.railOmega && !b.railH))
      return { ok: false, reason: '対象の darkrotor はレール駆動の旧v3構成' };
    const nS = P.bodies.filter(b => b.type === 'single').length;
    const nR = P.bodies.filter(b => b.type === 'ring').length;
    if (nS !== 11 || nR !== 1)
      return { ok: false, reason: `darkrotor が V0(v5・single=11/ring=1)ではない(single=${nS} ring=${nR}) — 既に改訂済み?` };
    return { ok: true, reason: '', bhM: P.bodies[0].m, bhSpin: P.bodies[0].spin,
      ringAround: P.bodies[11].aroundMass, rotorVy: P.bodies[1].vy, seed: P.seed,
      physics: P.physics };
  });
}

async function runJobs(jobs, worker) {
  const queue = jobs.slice();
  const results = new Array(jobs.length);
  await Promise.all(Array.from({ length: Math.min(NW, jobs.length) }, async () => {
    const browser = await launch();
    const page = await newPage(browser);
    while (queue.length) {
      const job = queue.shift();
      const i = jobs.indexOf(job);
      const t1 = Date.now();
      try { results[i] = await worker(page, job); }
      catch (e) { results[i] = { error: String((e && e.message) || e) }; }
      results[i].elapsedSec = +((Date.now() - t1) / 1000).toFixed(1);
      results[i].job = job;
    }
    await browser.close();
  }));
  return results;
}

const CFG = { STEPS, CKS, BLK, A2_WIN, BANDS, PBANDS, CAL_STEPS, FACT_STEPS };
const nf = (v, d = 1) => (v === null || v === undefined || !Number.isFinite(v)) ? '—' : v.toFixed(d);

// ================================ 実行 ================================
const t0 = Date.now();
const commit = (() => { try { return execSync('git rev-parse HEAD', { cwd: ROOT }).toString().trim(); } catch { return 'unknown'; } })();
console.log(`第39便 39A フェーズ1(台帳4-72)対象: ${TARGET}  sha256=${TARGET_SHA.slice(0, 12)}  commit=${commit.slice(0, 7)}  並列=${NW}`);

let baseInfo;
{
  const b = await launch(); const pg = await newPage(b);
  const ap = await checkApplicable(pg);
  if (!ap.ok) { await b.close(); console.error(`中止: ${ap.reason}`); process.exit(1); }
  baseInfo = ap;
  console.log(`  前提OK: 現行 darkrotor v5(BH m=${ap.bhM} spin=${ap.bhSpin} ring.aroundMass=${ap.ringAround} `
    + `rotor vy=${ap.rotorVy} seed=${ap.seed})`);

  // ---- P0-a: 総運動量ゼロ化の2パス解(= 内蔵化する vx/vy)----
  const zs = await pg.evaluate(({ o }) => window.__E472.zeroSolve(o),
    { o: { seed: REF_SEED, vRot: VROT, rotorSpin: 2.0, bhSpin: 0.12 } });
  var ZERO = zs;
  // 内蔵プリセットには丸めた値を書く(現行は小数5桁。ここは8桁で残差を1e-5未満に抑える)
  var BHVX = +zs.bhVx.toFixed(8), BHVY = +zs.bhVy.toFixed(8);
  const chk = await pg.evaluate(({ o }) => { window.__E472.build(o);
    const t = HP.sim.totals(); return { px: t.px, py: t.py, mBH: HP.sim.m[0] }; },
    { o: { seed: REF_SEED, vRot: VROT, rotorSpin: 2.0, bhSpin: 0.12, bhVx: BHVX, bhVy: BHVY } });
  var ZERO_ROUND = { bhVx: BHVX, bhVy: BHVY, Pafter: [chk.px, chk.py], absP: Math.hypot(chk.px, chk.py) };
  console.log(`P0-a: 総運動量ゼロ化 2パス解 vx=${zs.bhVx.toExponential(9)} vy=${zs.bhVy.toExponential(9)} `
    + `(ゼロ化前 |P|=${Math.hypot(zs.P0[0], zs.P0[1]).toFixed(6)})`);
  console.log(`      内蔵化する丸め値 vx=${BHVX} vy=${BHVY} → 残差 |P|=${ZERO_ROUND.absP.toExponential(3)}`);

  // ---- P4: t=0 の u_φ(darkrotor.uphi の再較正データ)----
  var UPHI = await pg.evaluate(({ o }) => window.__E472.uphiRun(o),
    { o: { seed: REF_SEED, vRot: VROT, rotorSpin: 2.0, bhSpin: 0.12, bhVx: BHVX, bhVy: BHVY } });
  console.log(`P4: u_φ(140/200/260) on=${UPHI.on.u140.toFixed(4)}/${UPHI.on.u200.toFixed(4)}/${UPHI.on.u260.toFixed(4)} `
    + `off=${UPHI.off.u140.toFixed(4)}/${UPHI.off.u200.toFixed(4)}/${UPHI.off.u260.toFixed(4)} `
    + `比=${UPHI.ratio.map(v => v.toFixed(3)).join('/')}(現行v5閾値 1.60/1.19/1.65・v5実測 1.760/1.314/1.823)`);
  await b.close();
}

const OPT = { seed: REF_SEED, vRot: VROT, rotorSpin: 2.0, bhSpin: 0.12, bhVx: BHVX, bhVy: BHVY };

// ---- P0-b: 較正の再確認(6000步後のローター半径 — 38C は 199.815)----
console.log(`P0-b: 較正の再確認(vRot=${VROT}・${CAL_STEPS}步後のローター半径)...`);
const calRes = await runJobs([{ tag: 'calCheck' }], (page) => page.evaluate(
  ({ o, cfg }) => window.__E472.calCheck(o, cfg), { o: OPT, cfg: CFG }));
const CAL = calRes[0];
console.log(`      r(ローター1)=${nf(CAL.r1, 3)}  r(ローター2)=${nf(CAL.r2, 3)}  |r−200|=${nf(Math.abs(CAL.r1 - 200), 3)} [${CAL.elapsedSec}s]`);
let RECAL = null;
if (Math.abs(CAL.r1 - 200) > 1.0) {
  console.log('      → 較正がずれている。セカント法で周速を再解...');
  const rc = await runJobs([{ tag: 'recal' }], (page) => page.evaluate(
    ({ o, cfg }) => window.__E472.calibrate(o, cfg), { o: OPT, cfg: CFG }));
  RECAL = rc[0];
  console.log(`      再較正: vRot=${RECAL.vRot}(r=${RECAL.rEnd}) 履歴 ${RECAL.hist.map(h => `${h.v}→${h.r}`).join(' , ')}`);
  OPT.vRot = RECAL.vRot;
}

// ---- P1: 24000步 本走行(on / ctrl)----
const P1_JOBS = [
  { tag: 'on(V1a・rotor spin2.0)', opt: Object.assign({}, OPT) },
  { tag: 'ctrl(BH+全ローター spin0)', opt: Object.assign({}, OPT, { ctrlZeroSpins: true }) },
];
console.log(`P1: 本走行 ${P1_JOBS.length}本(${STEPS}步・CK ${CKS.join('/')})...`);
const p1 = await runJobs(P1_JOBS, (page, job) => page.evaluate(
  ({ o, cfg }) => window.__E472.runOne(o, cfg), { o: job.opt, cfg: CFG }));
const brief = (r) => {
  if (r.error) return `エラー=${r.error}`;
  const c = r.cks;
  if (!c || !c.length) return '(CKなし)';
  return `保持%(r<400) ${c.map(v => nf(v.star.keepPct)).join('→')} `
    + `σ_r ${c.map(v => nf(v.star.sigmaR)).join('→')} `
    + `A2帯平均 ${c.map(v => nf(v.A2mean, 3)).join('→')} `
    + `ピッチ ${c.map(v => nf(v.pitchMed, 1)).join('→')}° `
    + `rotDev ${c.map(v => nf(v.rotDev, 3)).join('→')} `
    + `|ΔL|/L_scale ${c[c.length - 1].relL.toExponential(2)} NaN=${r.nanAt === null ? 'なし' : 't=' + r.nanAt}`;
};
for (const r of p1) {
  try { console.log(`  ${r.job.tag}: ${brief(r)} [${r.elapsedSec}s]`); }
  catch (e) { console.log(`  ${r.job.tag}: (表示エラー ${String(e && e.message || e)} — 数値は JSON に保存)`); }
}

// ---- P2: スピン用量反応(ローターのみ 0→1→3。2.0 は P1 の on を流用)----
const P2_JOBS = DOSE_SPINS.map(sp => ({ tag: `dose/rotorSpin=${sp}`,
  opt: Object.assign({}, OPT, { rotorSpin: sp }) }));
console.log(`P2: スピン用量反応 ${P2_JOBS.length}本(${STEPS}步)...`);
const p2 = await runJobs(P2_JOBS, (page, job) => page.evaluate(
  ({ o, cfg }) => window.__E472.runOne(o, cfg), { o: job.opt, cfg: CFG }));
for (const r of p2) {
  try { console.log(`  ${r.job.tag}: ${brief(r)} [${r.elapsedSec}s]`); }
  catch (e) { console.log(`  ${r.job.tag}: (表示エラー — 数値は JSON に保存)`); }
}

// ---- P3: 台帳4-53 要因分離の再測定(新構成・exp-factors.mjs と同式)----
const P3_JOBS = CHANNELS.map(ch => ({ tag: `factor/${ch.id}`, ch: ch.id,
  opt: Object.assign({}, OPT, { override: ch.override }) }));
console.log(`P3: 要因分離 ${P3_JOBS.length}チャネル(${FACT_STEPS}步・後半平均)...`);
const p3 = await runJobs(P3_JOBS, (page, job) => page.evaluate(
  ({ o, cfg }) => window.__E472.runFactor(o, cfg), { o: job.opt, cfg: CFG }));
const baseVal = (p3.find(r => r.job.ch === 'baseline') || {}).value;
for (const r of p3) {
  const rat = (r.value !== null && r.value !== undefined && baseVal) ? r.value / baseVal : null;
  r.ratioToBaseline = rat;
  console.log(`  ${r.job.ch.padEnd(9)}: A2帯平均=${r.value === null || r.value === undefined ? '—' : r.value.toFixed(4)}`
    + `${rat !== null ? `(baseline比 ${rat.toFixed(3)})` : ''} 帯=${r.A2 ? r.A2.join('/') : '—'} `
    + `NaN=${r.nan} 発散=${r.divergent} [${r.elapsedSec}s]`);
}

// ---- 要約 ----
const ck = (r, st) => (r.cks || []).find(c => c.step === st) || null;
const on = p1[0], ctrl = p1[1];
const dose = {};
for (const r of p2) dose[r.job.opt.rotorSpin] = r;
dose[2] = on;
console.log('');
console.log('==== 要約 ====');
for (const st of CKS) {
  const a = ck(on, st), b = ck(ctrl, st);
  if (!a) continue;
  console.log(`  ${String(st).padStart(5)}步(t=${(st * 0.016).toFixed(1)}): `
    + `A2 on=${a.A2.map(v => v.toFixed(3)).join('/')}(帯平均 ${a.A2mean.toFixed(3)}) `
    + `ctrl=${b ? b.A2.map(v => v.toFixed(3)).join('/') : '—'}(帯平均 ${b ? b.A2mean.toFixed(3) : '—'}) `
    + `比=${b && b.A2mean ? (a.A2mean / b.A2mean).toFixed(2) : '—'} `
    + `ノイズ床(ctrl)=${b ? b.noise.map(v => v.toFixed(3)).join('/') : '—'}`);
  console.log(`         保持 r<400 ${nf(a.star.keepPct, 2)}% / r<500 ${nf(a.star.keepPct500, 2)}% `
    + `σ_r=${nf(a.star.sigmaR, 2)} 外縁v_φ=${nf(a.star.outer, 3)}(n=${a.star.nOuter}) r90=${nf(a.star.r90all, 1)} `
    + `rotDev=${(a.rotDev * 100).toFixed(2)}% rotIn=${a.rotIn}/${a.NH} ローター平均|spin|=${nf(a.haloSpin, 3)} `
    + `max|spin|=${nf(a.maxSpinSoFar, 3)} BHspin=${nf(a.bhSpin, 5)} 重心移動=${nf(a.comMove, 3)} `
    + `|ΔL|/L_scale=${a.relL.toExponential(2)} ピッチ=${nf(a.pitchMed, 1)}°(${a.trailingN}/${a.pitchN}点が後行)`);
}
console.log('  用量反応(A2帯平均): '
  + [0, 1, 2, 3].map(sp => { const r = dose[sp]; const c = r && ck(r, 6000);
    return `spin${sp}→${c ? c.A2mean.toFixed(3) : '—'}`; }).join('  ') + '  (6000步窓)');
console.log('                      '
  + [0, 1, 2, 3].map(sp => { const r = dose[sp]; const c = r && ck(r, 24000);
    return `spin${sp}→${c ? c.A2mean.toFixed(3) : '—'}`; }).join('  ') + '  (24000步窓)');

// ---- 保存 ----
const strip = (r) => ({ job: { tag: r.job.tag, ch: r.job.ch || null, opt: r.job.opt || null },
  elapsedSec: r.elapsedSec, error: r.error || null, warnings: r.warnings || null,
  n: r.n, OFF: r.OFF, NH: r.NH, nanAt: r.nanAt, dirSign: r.dirSign, pTot0: r.pTot0,
  init: r.init, cks: r.cks, snaps: r.snaps,
  value: r.value, ratioToBaseline: r.ratioToBaseline, A2: r.A2, nan: r.nan, divergent: r.divergent,
  maxSpin: r.maxSpin, nLate: r.nLate });
const out = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(), commit, target: TARGET, targetSha256: TARGET_SHA,
  note: '第39便 39A フェーズ1(台帳4-72「🕶️darkrotor を V1a 構成へ改訂」)。QA ではない(合否判定なし)。'
    + 'beta/index.html は読み取りのみ — 内蔵プリセットの改変・追加は一切していない。V1a 構成は '
    + 'allPresets() の深いコピーを書き換え validatePreset→sim.build で注入している。',
  meta: {
    dt: DT, steps: STEPS, checkpoints: CKS, blockSteps: BLK, a2Window: A2_WIN,
    bands: BANDS, pitchBands: PBANDS, seed: REF_SEED, vRotUsed: OPT.vRot, vRot38C: VROT,
    factorSteps: FACT_STEPS, doseSpins: DOSE_SPINS, channels: CHANNELS.map(c => c.id),
    workers: NW, node: process.version, platform: `${os.platform()} ${os.release()}`, cpus: os.cpus().length,
    baseInfo,
    zeroing: { exact: ZERO, rounded: ZERO_ROUND },
    calibration: { vRot: VROT, steps: CAL_STEPS, r1: CAL.r1, r2: CAL.r2, recalibrated: RECAL },
    uphi: UPHI,
    sources: {
      a2: 'tests/qa.mjs:197(BANDS)+ 398-410(darkrotorLong の a2)',
      keepRotDev: 'tests/qa.mjs:427-433',
      midNew: 'tests/qa.mjs:346-381(darkrotorMidNew = behavior.darkrotor の計算部)',
      uphi: 'tests/qa.mjs:2999-3030(darkrotor.uphi の uphiAt)',
      factors: 'tests/exp-factors.mjs:130-162(darkrotor 節)',
      conservation: 'tests/qa.mjs:1211-1220 + 1170-1173 = beta/index.html:5866-5867(HP.verify.v1)と同形',
      presetInjection: 'tests/qa.mjs:1208-1224 / tests/seeds.mjs:113-117・162-165',
      v1aDesign: '第38便 38C レポート §3.1/§3.3(提案A = 統括採択)',
    },
    designNotes: [
      'V1a の bodies は [中心BH, ローター(x=+200), ローター(x=-200), 恒星リング] の順で組む(フェーズ2で BUILTIN_PRESETS に書く配列そのもの)。physics・seed・camera・overlays・activeParams は現行のまま。',
      'BH の vx/vy は総運動量ゼロ化の2パス法で解き、内蔵化する丸め値(小数8桁)で本走行している。',
      'ctrl は qa.mjs darkrotorLong と同じ「build 後に中心BH+全ローターのスピンを 0 にする」経路(質量・半径・配置は完全に軸対称のまま)。',
      'ピッチ角は探索指標: 細環帯 15 刻みで m=2 の位相 ψ(r)=½arg(Σe^{2iθ}) を測り ψ=a+b·ln r を重み付き最小二乗。i=atan(1/|b|)。有意帯(A2>2×√(π/4N))のみ使用。',
      '要因分離は exp-factors.mjs の darkrotor 節と同じ 6000步・後半平均・4帯平均。上書きは build 後の sim.params 直接代入(同ファイル 96行と同じ経路)。',
    ],
  },
  runs: { p1: p1.map(strip), p2: p2.map(strip), p3: p3.map(strip) },
};
fs.writeFileSync(path.join(OUT_DIR, 'exp-4-72.json'), JSON.stringify(out, null, 1));
console.log(`保存: tests/out/exp-4-72.json  合計 ${((Date.now() - t0) / 1000).toFixed(1)}s`);
try { fs.rmSync(TMP_DIR, { recursive: true, force: true }); } catch (_) {}

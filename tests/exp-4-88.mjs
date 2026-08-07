// 第84便B 実験 4-88: 天体系の複合2件(🕶️darkrotor・⏳nebulaBipolar)への**創発の標準試験**展開
//
// 主題: 第83便A が 🥚selfRotor で標準試験化した6試験(docs/PHYSICS.md「創発水準(E0〜E3)と
//   標準試験」節)を、E水準タグを持たない天体系の複合サンプル2件へ適用し、E水準を**実測で
//   正直に**格付けする。**昇格ありきにしない** — pinned 駆動を含む構成は定義上 E2/E3 に
//   該当しないので、その場合は E1+頑健性注記が正しい着地である。
//
// 標準試験(6試験)と本便での担当:
//   ① ノックアウト対照   : 既存 claims が既にカバー(🕶️ = ローターのスピン0 / ⏳ = kRep=0)… 参照のみ
//   ② 用量反応           : 既存 descStruct が既にカバー(🕶️ = spin 0/1/2/3 の単調増加)   … 参照のみ
//   ③ 多seed             : 本ハーネス A1 / B1
//   ④ 粒子数スケーリング : 本ハーネス A2 / B2
//   ⑤ 摂動回復           : 本ハーネス A3 / B3
//   ⑥ 時間窓             : 本ハーネス A1/B1 の走行に相乗り(250步ブロックの時系列。追加コスト0)
//
// 構成からの E水準判定(実測の前に確定する部分):
//   🕶️darkrotor    … 4 body 定義すべて pinned なし(中心BH・対向2ローター・恒星リング380が全部自由)、
//                     world.boundary="none"・伝熱壁なし・レールなし ⇒ **閉鎖系**。E2 の資格あり。
//                     E3 は本ハーネス③④⑤の実測で決める。
//   ⏳nebulaBipolar … 24 body 定義のうち **22個が pinned:true**(赤道ダークアーク=暗黒トーラス)。
//                     ローブを立てている「幾何」は外部固定された構造そのもの ⇒ **外部駆動下の
//                     自己組織化 = E1**。定義上 E2/E3 には該当しない(descStruct も既に
//                     「アークは pinned(外部固定)なので閉鎖系ではない」と明記済み)。
//                     本ハーネスは E1 に**頑健性の実測を付ける**ことを目的とする。
//
// 測定量(各サンプルの「主張量」— 標準試験は主張量で測る):
//   🕶️: armA2BandAvg = 環帯[80,120][120,160][160,200][200,240]の m=2 振幅 A2 の後半平均
//        (t=3000〜6000 の7点平均。qa.mjs W5C_UNITS.darkrotorLong と同一式)
//        pitchAngleMedianDeg = 対数螺旋フィットのピッチ角中央値(同7点。qa.mjs と同一式)
//        armRatio = 本則の帯平均 / 対照(ローター spin=0)の帯平均
//   ⏳: polarFraction = 系外(r>200)到達ガスのうち ±y30°以内の割合(等方なら 1/3)
//        escN = 脱出体数 / lSwC = 中心の減光 / lSwArc = アーク帯の平均減光
//
// 摂動について(実験操作であってアプリの機能ではない — 第83便A と同じ流儀):
//   ハーネスが構造形成後(step 3000)に S.vx/S.vy を直接書き換える。決定論を保つため乱数は
//   ハーネス内の LCG(seed 固定)で、**質量重みつき平均を引いて注入対象群の全運動量を保存**
//   させる(重心が飛ばない = 「外から蹴った」ではなく「内部をかき混ぜた」摂動)。
//   注入は保存則の帳簿を意図的に破る操作なので、注入を含む run では relL を判定に使わない。
//   🕶️ は**恒星だけ**を蹴る(ローター=駆動源を蹴ったら「構造の自己維持」ではなく
//   「駆動源の破壊」の試験になってしまうため)。⏳ は**ガスだけ**を蹴る(アークは pinned)。
//
// 実行: QA_TARGET=beta/index.html node tests/exp-4-88.mjs(playwright 必須・実測 約25分)
//       EXP488_QUICK=1 を付けると seed 数・振り幅を最小化して配線だけを確かめる(数値は正本ではない)
// 出力: tests/out/exp-4-88.json(QA ではない — 合否判定はしない計測スクリプト。
//       ただし末尾で E水準の判定根拠を自動整形して出す)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + (TARGET.startsWith('/') ? TARGET : path.join(ROOT, TARGET));
const OUT_DIR = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(OUT_DIR, { recursive: true });
// 配線確認用の縮約モード(EXP488_QUICK=1)。数値の正本は常に既定モードの走行である
const QUICK = process.env.EXP488_QUICK === '1';
const OUT_FILE = QUICK ? 'exp-4-88.quick.json' : 'exp-4-88.json';

async function launch() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  const { chromium } = await import('playwright-core');
  return chromium.launch({ executablePath: exe });
}
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
await page.goto(INDEX);
await page.waitForFunction(() => window.HP && HP.sim);

const hasDR = await page.evaluate(() => HP.allPresets().some((p) => p.id === 'darkrotor'));
const hasNB = await page.evaluate(() => HP.allPresets().some((p) => p.id === 'nebulaBipolar'));
if (!hasDR && !hasNB) { console.log('SKIP: 対象に 🕶️/⏳ がありません'); await browser.close(); process.exit(0); }

// ---- 小道具 ------------------------------------------------------------------------------
const q = (a) => { const b = [...a].sort((x, y) => x - y);
  const md = b.length % 2 ? b[(b.length - 1) / 2] : 0.5 * (b[b.length / 2 - 1] + b[b.length / 2]);
  return { min: +b[0].toFixed(4), median: +md.toFixed(4), max: +b[b.length - 1].toFixed(4),
    mean: +(a.reduce((s, v) => s + v, 0) / a.length).toFixed(4), vals: a.map((v) => +v.toFixed(4)) }; };
const f3 = (a) => a.map((v) => v.toFixed(3)).join('/');
const sec = (t) => ((Date.now() - t) / 1000).toFixed(1) + 's';

const out = { meta: { exp: '4-88', wave: 84, track: 'B', target: TARGET,
  date: new Date().toISOString().slice(0, 10),
  quick: QUICK,
  note: '🕶️darkrotor・⏳nebulaBipolar への創発標準試験の展開 — 多seed/スケーリング/摂動回復/時間窓(QA ではない計測)',
  covered_elsewhere: {
    knockout: '🕶️ = ローターのスピン0 対照(QA behavior.darkrotorLong / claims darkrotor.arm-band-avg の control)。⏳ = kRep=0 対照(QA claim.nebulabipolar-polar の control)。本ハーネスでは再測定せず参照する',
    doseResponse: '🕶️ = spin 0→1→2→3 で帯平均 0.186→0.209→0.560→0.707(descStruct・tests/exp-4-72.mjs)。⏳ = 圧力 kRep のオン/オフのみ(用量反応の掃引は未実施 — 正直な記録)' } } };
const T_ALL = Date.now();

// ============================================================================================
// A) 🕶️darkrotor — 閉鎖系(pinned 0)の複合サンプル
// ============================================================================================
if (hasDR) {
  const A = out.darkrotor = {};

  // ---- A0) 構成の確認(E水準判定の一次資料)------------------------------------------------
  A.構成 = await page.evaluate(() => {
    const p = HP.allPresets().find((q) => q.id === 'darkrotor');
    HP.loadPreset('darkrotor', false);
    const S = HP.sim;
    let nPin = 0; for (let i = 0; i < S.n; i++) if (S.pinned[i]) nPin++;
    return { nBodyDef: p.bodies.length, nParticle: S.n, pinnedParticles: nPin,
      pinnedBodyDefs: p.bodies.filter((b) => b.pinned).length,
      boundary: p.world.boundary, worldSize: p.world.size, gravityX: p.physics.gravityX,
      gravityY: p.physics.gravityY, wallThermal: !!(p.world && p.world.wallT), seed: p.seed,
      validT: p.validT, emergence: p.emergence === undefined ? '(未宣言)' : p.emergence,
      nStar: p.bodies[3].n, claims: (p.claims || []).map((c) => c.id) };
  });
  console.log('=== A0) 🕶️ 構成 ===');
  console.log(' ', JSON.stringify(A.構成));
  console.log(`  → pinned 粒子 ${A.構成.pinnedParticles}/${A.構成.nParticle}・境界 "${A.構成.boundary}"・一様重力 0 ` +
    `⇒ **閉鎖系**(E2 の資格あり。E3 は③④⑤の実測で決める)`);

  // ---- 共通ランナー(qa.mjs W5C_UNITS.darkrotorLong の測定式をそのまま移植)------------------
  // mod: {seed, n, mScale, ctrl:'none'|'rotor'|'all', kick:{at,amp,rngSeed}, blk, nBlk}
  const runDR = (mod) => page.evaluate((o) => {
    const BANDS = [[80, 120], [120, 160], [160, 200], [200, 240]];
    const P0 = HP.allPresets().find((q) => q.id === 'darkrotor');
    const p = JSON.parse(JSON.stringify(P0));
    if (o.seed !== undefined) p.seed = o.seed;
    if (o.n !== undefined) p.bodies[3].n = o.n;
    if (o.mScale !== undefined) { p.bodies[3].mMin *= o.mScale; p.bodies[3].mMax *= o.mScale; }
    const v = HP.validatePreset(p);
    if (!v.ok) return { err: v.errors };
    HP.sim.build(v.preset);
    const S = HP.sim;
    const NH = p.bodies.filter((b) => b.type === 'single').length - 1;   // ローター体数(=2)
    const OFF = NH + 1;                                                  // 恒星の先頭 index(=3)
    // 対照: 'rotor' = 対向2ローターのみ spin=0(claims の control patch・abBody と同じ)
    //       'all'   = 中心BH も含む全 single を spin=0(qa.mjs darkrotorLong と同じ)
    if (o.ctrl === 'rotor') { S.spin[1] = 0; S.spin[2] = 0; }
    else if (o.ctrl === 'all') { for (let i = 0; i <= NH; i++) S.spin[i] = 0; }

    // --- 測定式(qa.mjs から一字も変えずに移植)---
    const a2 = (s) => BANDS.map(([lo, hi]) => {
      const bx = s.x[0], by = s.y[0];
      let cr = 0, ci = 0, N = 0;
      for (let i = OFF; i < s.n; i++) {
        const dx = s.x[i] - bx, dy = s.y[i] - by, r = Math.hypot(dx, dy);
        if (r >= lo && r < hi) { const th = Math.atan2(dy, dx);
          cr += Math.cos(2 * th); ci += Math.sin(2 * th); N++; }
      }
      return { A2: N ? Math.hypot(cr, ci) / N : 0, N, noise: N ? Math.sqrt(Math.PI / (4 * N)) : 0 };
    });
    const PB = []; for (let r = 80; r < 260; r += 15) PB.push([r, r + 15]);
    const pitchFit = (s, dirSign) => {
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
      const use = pts.filter((z) => z.A > 2 * z.noise);
      if (use.length < 4) return { ok: false, nBand: use.length };
      let prev = use[0].psi;
      const xs = [], ys = [], ws = [];
      for (let k = 0; k < use.length; k++) {
        let w2 = use[k].psi;
        if (k > 0) w2 += Math.round((prev - w2) / Math.PI) * Math.PI;
        prev = w2;
        xs.push(Math.log(use[k].r)); ys.push(w2); ws.push(use[k].N * use[k].A);
      }
      let Sw = 0, Sx = 0, Sy = 0, Sxx = 0, Sxy = 0;
      for (let k = 0; k < xs.length; k++) { const w = ws[k];
        Sw += w; Sx += w * xs[k]; Sy += w * ys[k]; Sxx += w * xs[k] * xs[k]; Sxy += w * xs[k] * ys[k]; }
      const den = Sw * Sxx - Sx * Sx;
      if (!(Math.abs(den) > 1e-12)) return { ok: false, nBand: use.length };
      const b = (Sw * Sxy - Sx * Sy) / den, a = (Sy - b * Sx) / Sw;
      let ssTot = 0, ssRes = 0; const ym = Sy / Sw;
      for (let k = 0; k < xs.length; k++) { const w = ws[k], pr = a + b * xs[k];
        ssRes += w * (ys[k] - pr) * (ys[k] - pr); ssTot += w * (ys[k] - ym) * (ys[k] - ym); }
      return { ok: true, slope: b, pitchDeg: Math.atan(1 / Math.abs(b)) * 180 / Math.PI,
        R2: ssTot > 0 ? 1 - ssRes / ssTot : null, nBand: use.length, trailing: dirSign * b < 0 };
    };

    // --- 初期状態 ---
    let lz0 = 0;
    for (let i = OFF; i < S.n; i++) lz0 += S.x[i] * S.vy[i] - S.y[i] * S.vx[i];
    const dirSign = Math.sign(lz0) || 1;
    const hr0 = [], st0 = [];
    for (let k = 1; k <= NH; k++) hr0.push(Math.hypot(S.x[k] - S.x[0], S.y[k] - S.y[0]));
    for (let i = OFF; i < S.n; i++) st0.push(Math.hypot(S.x[i] - S.x[0], S.y[i] - S.y[0]));
    let mDisk = 0; for (let i = OFF; i < S.n; i++) mDisk += Math.abs(S.m[i]);
    const T0 = S.totals(), L0 = T0.L + S.resL + S.radL;
    const vRmsStar = () => { let s = 0, c = 0;
      for (let i = OFF; i < S.n; i++) { s += S.vx[i] * S.vx[i] + S.vy[i] * S.vy[i]; c++; }
      return c ? Math.sqrt(s / c) : 0; };
    // --- 摂動注入(恒星だけ・注入群の運動量保存)---
    const inject = (k) => {
      let s = (k.rngSeed || 20260807) >>> 0;
      const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
      const gauss = () => { const u = Math.max(1e-12, rnd()), w = rnd();
        return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * w); };
      const sig = k.amp * vRmsStar() / Math.SQRT2;
      const dvx = new Float64Array(S.n), dvy = new Float64Array(S.n);
      for (let i = OFF; i < S.n; i++) { dvx[i] = sig * gauss(); dvy[i] = sig * gauss(); }
      let mT = 0, px = 0, py = 0;
      for (let i = OFF; i < S.n; i++) { const a = Math.abs(S.m[i]); mT += a; px += a * dvx[i]; py += a * dvy[i]; }
      if (mT > 1e-12) { px /= mT; py /= mT; }
      for (let i = OFF; i < S.n; i++) { S.vx[i] += dvx[i] - px; S.vy[i] += dvy[i] - py; }
      return { sigma: sig, vRms: vRmsStar() };
    };

    // --- 走行(250步ブロック × 24 = 6000步)---
    const BLK = o.blk || 250, NBLK = o.nBlk || 24;
    const series = [], pitch = [];
    let maxSpin = 0, kickInfo = null, preKick = null, postKick = null, lastZ = null;
    for (let blk = 0; blk < NBLK; blk++) {
      for (let k = 0; k < BLK; k++) S.step(0.016);
      for (let i = 0; i < S.n; i++) maxSpin = Math.max(maxSpin, Math.abs(S.spin[i]));
      const t = (blk + 1) * BLK;
      const z = a2(S); lastZ = z;
      const band = z.map((u) => u.A2), avg = band.reduce((a, u) => a + u, 0) / band.length;
      const rec = { t, A2: band.map((u) => +u.toFixed(4)), avg: +avg.toFixed(4) };
      if (o.kick && t === o.kick.at) {
        preKick = { ...rec };
        kickInfo = inject(o.kick);
        const z2 = a2(S), b2 = z2.map((u) => u.A2);
        postKick = { t, A2: b2.map((u) => +u.toFixed(4)),
          avg: +(b2.reduce((a, u) => a + u, 0) / b2.length).toFixed(4), kicked: true };
        rec.kicked = true; rec.avgPost = postKick.avg;
      }
      series.push(rec);
      // ピッチ・後半平均の窓は走行長に依らず t=3000〜6000 の500步刻み7点に固定する
      // (qa.mjs behavior.darkrotor-pitch / darkrotorLong と同一定義。9000步走行でも定義は動かさない)
      if (t >= 3000 && t <= 6000 && t % 500 === 0) pitch.push({ t, ...pitchFit(S, dirSign) });
    }
    // --- 終端の健全性 ---
    const bx = S.x[0], by = S.y[0];
    let keep = 0, tot = 0, rotDev = 0, rotIn = 0;
    for (let i = OFF; i < S.n; i++) { const r = Math.hypot(S.x[i] - bx, S.y[i] - by);
      if (st0[i - OFF] < 350) { tot++; if (r < 500) keep++; } }
    for (let k = 1; k <= NH; k++) { const r = Math.hypot(S.x[k] - bx, S.y[k] - by);
      if (r > 60 && r < 400) rotIn++;
      rotDev = Math.max(rotDev, Math.abs(r / hr0[k - 1] - 1)); }
    // --- 後半平均(t=3000〜6000 の500步刻み7点 = qa.mjs と同一定義)---
    const late = series.filter((z) => z.t >= 3000 && z.t <= 6000 && z.t % 500 === 0);
    const A2late = [0, 1, 2, 3].map((b) => late.reduce((a, z) => a + z.A2[b], 0) / late.length);
    const bandAvg = A2late.reduce((a, u) => a + u, 0) / 4;
    const pOk = pitch.filter((z) => z.ok);
    const pd = pOk.map((z) => z.pitchDeg).sort((a, b) => a - b);
    const T1 = S.totals(), L1 = T1.L + S.resL + S.radL;
    let lScale = 0;
    for (let i = 0; i < S.n; i++) lScale += Math.abs(S.m[i] * (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]))
      + 0.5 * Math.abs(S.m[i]) * S.R[i] * S.R[i] * Math.abs(S.spin[i]);
    return { n: S.n, nStar: S.n - OFF, mDisk: +mDisk.toFixed(3), nLate: late.length,
      A2late: A2late.map((u) => +u.toFixed(4)), bandAvg: +bandAvg.toFixed(4),
      nBandEnd: lastZ.map((z) => z.N), noiseEnd: lastZ.map((z) => +z.noise.toFixed(4)),
      pitchMed: pd.length ? +pd[Math.floor(pd.length / 2)].toFixed(2) : null,
      pitchN: pd.length, pitchAll: pitch.map((z) => ({ t: z.t, deg: z.ok ? +z.pitchDeg.toFixed(2) : null })),
      trailing: pOk.filter((z) => z.trailing === true).length, dirSign,
      keep, tot, keepPct: +(100 * keep / tot).toFixed(1), maxSpin: +maxSpin.toFixed(3),
      rotDev: +rotDev.toFixed(4), rotIn, series, preKick, postKick,
      kick: kickInfo ? { sigma: +kickInfo.sigma.toFixed(4), vRms: +kickInfo.vRms.toFixed(4) } : null,
      relL: +(Math.abs(L1 - L0) / Math.max(lScale, 1e-9)).toExponential(2),
      nan: S.hasNaN(), clampV: S.clampVN, clampR: S.clampRN || 0 };
  }, mod);

  // ---- A1) ③多seed + ⑥時間窓 --------------------------------------------------------------
  // 多seed数の選定: 1本(6000步・383粒子)の実測コストが **38.7 s** で、本則+対照の2本を1seed
  // あたり必要とするため、16seed だと多seedだけで 20.6 分・④⑤込みで 45 分を超える。統括裁定
  // 「1件あたりの計算コストで総時間が過大なら 8 まで減らしてよい」に従い **8seed** を採る
  // (⏳ 側は 1本 1.6 s と軽いので裁定どおり 16seed)。
  const SEEDS8 = Array.from({ length: QUICK ? 2 : 8 }, (_, i) => 20260726 + i);   // 内蔵 seed 20260726 を先頭に置く
  // 対照は qa.mjs behavior.darkrotorLong / descStruct の 0.156 と同じ **中心BH も含む全 single の
  // spin=0**(ctrl:'all')を採る。claims の control patch と abBody(ワンタップA/B)は「対向2ローター
  // のみ spin=0」で定義がわずかに違うので、その差は A1b で別に実測して記録する。
  console.log('=== A1) ③多seed 8(6000步・本則 vs 対照〔全 single の spin=0〕)+ ⑥時間窓相乗り ===');
  {
    const t0 = Date.now();
    const ms = { seeds: SEEDS8, nSeedReason: '1本38.7s実測 → 16seedでは総時間が過大(統括裁定の8へ縮約)',
      main: {}, ctrl: {} };
    for (const sd of SEEDS8) {
      const a = await runDR({ seed: sd });
      const b = await runDR({ seed: sd, ctrl: 'all' });
      ms.main['s' + sd] = a; ms.ctrl['s' + sd] = b;
      console.log(`seed${sd}`.padEnd(12),
        `本則 帯${f3(a.A2late)} 平均${a.bandAvg.toFixed(3)} ピッチ${a.pitchMed === null ? '—' : a.pitchMed.toFixed(2)}°` +
        `(${a.pitchN}点/後行${a.trailing}) 保持${a.keepPct}% rotDev${(a.rotDev * 100).toFixed(2)}% max|spin|${a.maxSpin}`,
        `| 対照 平均${b.bandAvg.toFixed(3)} → 増強${(a.bandAvg / Math.max(b.bandAvg, 1e-9)).toFixed(2)}倍`,
        a.nan || b.nan ? 'NAN' : '', (a.clampV || a.clampR) ? `clamp${a.clampV}/${a.clampR}` : '');
    }
    const g = (o, f) => SEEDS8.map((sd) => f(ms[o]['s' + sd]));
    const ratios = SEEDS8.map((sd) => ms.main['s' + sd].bandAvg / Math.max(ms.ctrl['s' + sd].bandAvg, 1e-9));
    ms.stats = {
      bandAvg: { main: q(g('main', (s) => s.bandAvg)), ctrl: q(g('ctrl', (s) => s.bandAvg)) },
      armRatio: q(ratios),
      pitchMed: q(g('main', (s) => s.pitchMed === null ? NaN : s.pitchMed).filter((v) => !Number.isNaN(v))),
      pitchMedCtrl: g('ctrl', (s) => s.pitchMed),
      trailing: { main: g('main', (s) => `${s.trailing}/${s.pitchN}`), ctrl: g('ctrl', (s) => `${s.trailing}/${s.pitchN}`) },
      minBandPerSeed: q(g('main', (s) => Math.min(...s.A2late))),
      keepPct: q(g('main', (s) => s.keepPct)), rotDev: q(g('main', (s) => s.rotDev)),
      maxSpin: q(g('main', (s) => s.maxSpin)),
      nan: SEEDS8.filter((sd) => ms.main['s' + sd].nan || ms.ctrl['s' + sd].nan),
      clamp: SEEDS8.filter((sd) => ms.main['s' + sd].clampV || ms.main['s' + sd].clampR),
      relLMax: Math.max(...g('main', (s) => Number(s.relL))) };
    // ⑥ 時間窓: 帯平均の立ち上がり(本則の最終値の何%に、いつ達したか)
    ms.timeWindow = SEEDS8.map((sd) => {
      const s = ms.main['s' + sd], c = ms.ctrl['s' + sd];
      const fin = s.bandAvg;
      const t90 = (s.series.find((z) => z.avg >= 0.9 * fin) || {}).t || null;
      const t50 = (s.series.find((z) => z.avg >= 0.5 * fin) || {}).t || null;
      // 増強比の時系列(本則 avg / 対照 avg)— 分離が言える時間帯
      const rat = s.series.map((z, i) => ({ t: z.t, r: +(z.avg / Math.max(c.series[i].avg, 1e-9)).toFixed(3) }));
      return { seed: sd, t50, t90, ratioSeries: rat };
    });
    A.多seed = ms;
    A.多seed.所要 = sec(t0);
    console.log(`  帯平均 本則 ${JSON.stringify(ms.stats.bandAvg.main)}`);
    console.log(`  帯平均 対照 ${JSON.stringify(ms.stats.bandAvg.ctrl)}`);
    console.log(`  増強比       ${JSON.stringify(ms.stats.armRatio)}`);
    console.log(`  ピッチ角中央値 ${JSON.stringify(ms.stats.pitchMed)}(後行 本則 ${ms.stats.trailing.main.join(',')})`);
    console.log(`  ⑥ 帯平均が最終値の90%に達する step: ${ms.timeWindow.map((z) => z.t90).join('/')}`);
    console.log(`  [${sec(t0)}]`);
  }

  // ---- A1b) 対照定義の突合(ローターのみ spin0 vs 全 single spin0)-------------------------
  // 🕶️ には**定義の違う対照が2つ**ある: ①claims の control patch / abBody(ワンタップA/B)は
  // 「対向2ローターのみ spin=0」、②qa.mjs behavior.darkrotorLong と descStruct の 0.156 は
  // 「中心BH も含む全 single spin=0」。中心BH の spin は 0.12 と小さいが、残る m=2 の大きさが
  // どれだけ変わるかは測っておく価値がある(ワンタップA/B が見せている対照の強さの正体)。
  console.log('=== A1b) 対照定義の突合(ローターのみ spin0 vs 全 single spin0)===');
  {
    const t0 = Date.now();
    const rows = [];
    for (const sd of SEEDS8.slice(0, 2)) {
      const cR = await runDR({ seed: sd, ctrl: 'rotor' });
      const cA = A.多seed.ctrl['s' + sd];
      rows.push({ seed: sd, rotorOnly: cR.bandAvg, rotorOnlyBands: cR.A2late,
        allSingles: cA.bandAvg, allSinglesBands: cA.A2late,
        diff: +(cR.bandAvg - cA.bandAvg).toFixed(4) });
      const L = rows[rows.length - 1];
      console.log(`  seed${sd} ローターのみ=${L.rotorOnly.toFixed(4)}(${f3(L.rotorOnlyBands)}) / ` +
        `全single=${L.allSingles.toFixed(4)}(${f3(L.allSinglesBands)}) 差 ${L.diff}`);
    }
    A.対照定義 = { rows,
      note: 'claims の control patch と abBody(ワンタップA/B)は「対向2ローターのみ spin=0」。' +
        'qa.mjs behavior.darkrotorLong と descStruct の 0.156 は「中心BH も含む全 single spin=0」。' +
        '本ハーネスの多seed対照は後者(既存文書の数値と地続きにするため)' };
    A.対照定義.所要 = sec(t0);
    console.log(`  [${sec(t0)}]`);
  }

  // ---- A2) ④粒子数スケーリング --------------------------------------------------------------
  // N_CAP=600(beta 1448行)のため恒星 380 の「2倍」は物理的に置けない。到達できる最大は
  // 597(=600−中心BH−ローター2)で **1.57倍** に留まる — この上限は正直に記録する。
  // 加えて 🕶️ は「恒星の質量 = mMin..mMax 一定 × n」なので n を振ると**円盤の自己重力も動く**
  // (第83便A の 🥚 と同じ交絡)。そこで質量補正版(mMin/mMax を ×380/n して円盤総質量をほぼ固定)
  // も併走させ、「離散模様か」と「円盤質量の効果か」を分離する。
  console.log('=== A2) ④粒子数スケーリング(n=190/380/597・N_CAP=600 で2倍は不可)===');
  {
    const t0 = Date.now();
    const sc = { nCap: 600, plan: QUICK ? [190, 380] : [190, 380, 597], seeds: [20260726, 20260727],
      limit: 'N_CAP=600 のため恒星の2倍(760)は置けない — 到達最大は597(1.57倍)。' +
        'また n は円盤総質量(=自己重力)でもあるので、質量補正版を併走させて交絡を分離する',
      main: [], ctrl: [], massFixed: [] };
    for (const n of sc.plan) {
      for (const sd of sc.seeds) {
        if (n === 380 && A.多seed) {   // 標準 n は多seed の結果を再利用(追加走行なし)
          const a = A.多seed.main['s' + sd];
          sc.main.push({ n, seed: sd, nStar: a.nStar, mDisk: a.mDisk, bandAvg: a.bandAvg,
            A2late: a.A2late, pitchMed: a.pitchMed, nBandEnd: a.nBandEnd, noiseEnd: a.noiseEnd,
            keepPct: a.keepPct, nan: a.nan, reused: true });
          continue;
        }
        const a = await runDR({ seed: sd, n });
        sc.main.push({ n, seed: sd, nStar: a.nStar, mDisk: a.mDisk, bandAvg: a.bandAvg,
          A2late: a.A2late, pitchMed: a.pitchMed, nBandEnd: a.nBandEnd, noiseEnd: a.noiseEnd,
          keepPct: a.keepPct, nan: a.nan });
      }
      // 対照は seed 先頭のみ(コスト配分)
      const sd = sc.seeds[0];
      const c = (n === 380 && A.多seed) ? A.多seed.ctrl['s' + sd] : await runDR({ seed: sd, n, ctrl: 'all' });
      sc.ctrl.push({ n, seed: sd, bandAvg: c.bandAvg, A2late: c.A2late, nBandEnd: c.nBandEnd,
        noiseEnd: c.noiseEnd, reused: n === 380 });
      // 質量補正版(円盤総質量をほぼ固定)— 標準 n では不要
      if (n !== 380) {
        const m = await runDR({ seed: sd, n, mScale: 380 / n });
        sc.massFixed.push({ n, seed: sd, mScale: +(380 / n).toFixed(4), mDisk: m.mDisk,
          bandAvg: m.bandAvg, A2late: m.A2late, pitchMed: m.pitchMed, keepPct: m.keepPct, nan: m.nan });
      }
    }
    for (const r of sc.main) console.log(`  本則 n=${String(r.n).padStart(3)} seed${r.seed}`,
      `恒星${r.nStar} 円盤質量${r.mDisk} 帯${f3(r.A2late)} 平均${r.bandAvg.toFixed(3)}`,
      `ピッチ${r.pitchMed === null ? '—' : r.pitchMed.toFixed(2)}° 帯人数${r.nBandEnd.join('/')}`,
      `ノイズ床${f3(r.noiseEnd)} 保持${r.keepPct}%`, r.reused ? '(多seedから再利用)' : '');
    for (const r of sc.ctrl) console.log(`  対照 n=${String(r.n).padStart(3)} 平均${r.bandAvg.toFixed(3)}`,
      `帯${f3(r.A2late)}`, r.reused ? '(再利用)' : '');
    for (const r of sc.massFixed) console.log(`  質量補正 n=${String(r.n).padStart(3)}(×${r.mScale})`,
      `円盤質量${r.mDisk} 平均${r.bandAvg.toFixed(3)} ピッチ${r.pitchMed === null ? '—' : r.pitchMed.toFixed(2)}°`);
    sc.ratioByN = sc.plan.map((n) => {
      const m = sc.main.filter((r) => r.n === n).map((r) => r.bandAvg);
      const c = sc.ctrl.find((r) => r.n === n).bandAvg;
      return { n, mainMedian: +q(m).median.toFixed(4), ctrl: c, ratio: +(q(m).median / Math.max(c, 1e-9)).toFixed(2) };
    });
    console.log(`  増強比 by n: ${sc.ratioByN.map((z) => `n${z.n}=${z.ratio}倍`).join(' / ')}`);
    A.スケーリング = sc; A.スケーリング.所要 = sec(t0);
    console.log(`  [${sec(t0)}]`);
  }

  // ---- A3) ⑤摂動回復 ------------------------------------------------------------------------
  // 「崩れ幅を実測してから復帰を測る」(第83便A 設計)。設計上の注意が2つある:
  //  ・**A2 は位置だけで決まる量**なので、速度ノイズを入れた瞬間には 1 bit も動かない。
  //    崩れは注入の**あとの走行**に現れるので、「注入直後の落ち幅」ではなく
  //    「無摂動 baseline の同時刻値に対する比の**最小値**」を崩れ幅として測る。
  //  ・注入時刻は **step 4000**(A1 の⑥で帯平均が最終値の90%に達するのが 3750〜4000 步と出た =
  //    腕が立ち切った時点)。復帰を見るため走行は **9000步**まで延ばす。
  //    ※6000步より先では対照(スピン0)側にも円盤の自己重力起源の m=2 が育つので
  //      「腕/対照の分離」は言えなくなるが、ここで比べているのは**摂動あり本則 vs 摂動なし本則**
  //      であり、どちらも同じドリフトを受けるのでこの比較は 9000步でも有効である。
  console.log('=== A3) ⑤摂動回復(step4000 で恒星に速度ノイズ・9000步まで追跡)===');
  {
    const t0 = Date.now();
    const AMPS = QUICK ? [0.2] : [0.05, 0.1, 0.2, 0.4];
    const KICK_AT = 4000, NBLK = 36;   // 250步 × 36 = 9000步
    const pk = { amps: AMPS, at: KICK_AT, steps: 9000, seeds: QUICK ? [20260726] : [20260726, 20260727],
      note: '崩れ幅 = 無摂動 baseline の同時刻値に対する比の最小値。復帰 = その最小値以降に比が0.9へ戻る step',
      baseline: {}, runs: [] };
    for (const sd of pk.seeds) {
      const base = await runDR({ seed: sd, nBlk: NBLK });
      pk.baseline['s' + sd] = { bandAvg: base.bandAvg, keepPct: base.keepPct,
        series: base.series.map((z) => ({ t: z.t, avg: z.avg })) };
      const bAt = (t) => (base.series.find((z) => z.t === t) || {}).avg || 0;
      for (const amp of AMPS) {
        const r = await runDR({ seed: sd, nBlk: NBLK, kick: { at: KICK_AT, amp, rngSeed: 20260807 } });
        const post = r.series.filter((z) => z.t > KICK_AT)
          .map((z) => ({ t: z.t, ratio: +(z.avg / Math.max(bAt(z.t), 1e-9)).toFixed(4), avg: z.avg }));
        let mn = post[0]; for (const z of post) if (z.ratio < mn.ratio) mn = z;
        const rec = post.find((z) => z.t > mn.t && z.ratio >= 0.9);
        pk.runs.push({ seed: sd, amp, sigma: r.kick.sigma, vRms: r.kick.vRms,
          preAvg: r.preKick.avg, minRatio: mn.ratio, minRatioT: mn.t,
          ratioAt6000: (post.find((z) => z.t === 6000) || {}).ratio,
          ratioAt9000: (post.find((z) => z.t === 9000) || {}).ratio,
          recoverT: rec ? rec.t : null, recoverDt: rec ? rec.t - mn.t : null,
          keepPct: r.keepPct, baseKeepPct: base.keepPct,
          pitchMed: r.pitchMed, trailing: `${r.trailing}/${r.pitchN}`,
          nan: r.nan, clampV: r.clampV, clampR: r.clampR, ratioSeries: post });
        const L = pk.runs[pk.runs.length - 1];
        console.log(`  seed${sd} amp${String(amp).padEnd(5)} σ=${L.sigma}(v_RMS=${L.vRms})`,
          `崩れ幅=×${L.minRatio}(step${L.minRatioT}) 比@6000=${L.ratioAt6000} 比@9000=${L.ratioAt9000}`,
          `復帰=${L.recoverT === null ? '**未復帰**' : L.recoverT + `(Δ${L.recoverDt}步)`}`,
          `保持${L.keepPct}%(無摂動${L.baseKeepPct}%) 後行${L.trailing}`, L.nan ? 'NAN' : '');
      }
    }
    pk.byAmp = AMPS.map((a) => { const r = pk.runs.filter((z) => z.amp === a);
      return { amp: a, minRatio: q(r.map((z) => z.minRatio)), ratioAt9000: q(r.map((z) => z.ratioAt9000)),
        recovered: r.filter((z) => z.recoverT !== null).length + '/' + r.length }; });
    A.摂動回復 = pk; A.摂動回復.所要 = sec(t0);
    console.log(`  amp別: ${pk.byAmp.map((z) => `amp${z.amp} 崩れ×${z.minRatio.median} 9000步で×${z.ratioAt9000.median} 復帰${z.recovered}`).join(' / ')}`);
    console.log(`  [${sec(t0)}]`);
  }
}

// ============================================================================================
// B) ⏳nebulaBipolar — pinned アークを持つ複合サンプル(構成から E1 確定)
// ============================================================================================
if (hasNB) {
  const B = out.nebulaBipolar = {};

  // ---- B0) 構成の確認 ------------------------------------------------------------------------
  B.構成 = await page.evaluate(() => {
    const p = HP.allPresets().find((q) => q.id === 'nebulaBipolar');
    HP.loadPreset('nebulaBipolar', false);
    const S = HP.sim;
    let nPin = 0; for (let i = 0; i < S.n; i++) if (S.pinned[i]) nPin++;
    return { nBodyDef: p.bodies.length, nParticle: S.n, pinnedParticles: nPin,
      pinnedBodyDefs: p.bodies.filter((b) => b.pinned).length,
      boundary: p.world.boundary, seed: p.seed, validT: p.validT,
      emergence: p.emergence === undefined ? '(未宣言)' : p.emergence,
      nGas: p.bodies[p.bodies.length - 1].n, claims: (p.claims || []).map((c) => c.id) };
  });
  console.log('=== B0) ⏳ 構成 ===');
  console.log(' ', JSON.stringify(B.構成));
  console.log(`  → pinned 粒子 ${B.構成.pinnedParticles}/${B.構成.nParticle}(赤道ダークアーク22個が外部固定)` +
    ` ⇒ **閉鎖系ではない**。E水準の定義により E2/E3 には該当しない = **E1**(外部駆動下の自己組織化)`);

  // ---- 共通ランナー --------------------------------------------------------------------------
  // mod: {seed, nGas, kRep, kick:{at,amp,rngSeed}, steps}
  const runNB = (mod) => page.evaluate((o) => {
    const P0 = HP.allPresets().find((q) => q.id === 'nebulaBipolar');
    const p = JSON.parse(JSON.stringify(P0));
    if (o.seed !== undefined) p.seed = o.seed;
    if (o.kRep !== undefined) p.physics.kRep = o.kRep;
    const gasDef = p.bodies[p.bodies.length - 1];
    if (o.nGas !== undefined) gasDef.n = o.nGas;
    const v = HP.validatePreset(p);
    if (!v.ok) return { err: v.errors };
    HP.sim.build(v.preset);
    const S = HP.sim;
    const NARC = p.bodies.filter((b) => b.pinned).length;   // 22
    const GAS0 = NARC + 1;                                   // ガスの先頭 index(=23)
    const nGas = S.n - GAS0;
    const T0 = S.totals(), L0 = T0.L + S.resL + S.radL;
    const POL = Math.PI / 6;
    const polarOf = (i) => Math.atan2(Math.abs(S.x[i]), Math.abs(S.y[i]));   // ±y からの角(0=極方向)
    const vRmsGas = () => { let s = 0; for (let i = GAS0; i < S.n; i++) s += S.vx[i] ** 2 + S.vy[i] ** 2;
      return nGas ? Math.sqrt(s / nGas) : 0; };
    // 初到達(r>200 を最初に跨いだ)step と、そのときの方位を記録する
    const crossT = new Array(S.n).fill(-1), crossA = new Array(S.n).fill(0);
    const inject = (k) => {
      let s = (k.rngSeed || 20260807) >>> 0;
      const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
      const gauss = () => { const u = Math.max(1e-12, rnd()), w = rnd();
        return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * w); };
      const sig = k.amp * vRmsGas() / Math.SQRT2;
      const dvx = new Float64Array(S.n), dvy = new Float64Array(S.n);
      for (let i = GAS0; i < S.n; i++) { dvx[i] = sig * gauss(); dvy[i] = sig * gauss(); }
      let mT = 0, px = 0, py = 0;
      for (let i = GAS0; i < S.n; i++) { const a = Math.abs(S.m[i]); mT += a; px += a * dvx[i]; py += a * dvy[i]; }
      if (mT > 1e-12) { px /= mT; py /= mT; }
      for (let i = GAS0; i < S.n; i++) { S.vx[i] += dvx[i] - px; S.vy[i] += dvy[i] - py; }
      return { sigma: sig, vRms: vRmsGas() };
    };
    const snap = (t) => {   // claim 定義(終端位置ベース)+ crossing 定義の両方
      let escF = 0, polF = 0;
      for (let i = GAS0; i < S.n; i++) { const r = Math.hypot(S.x[i], S.y[i]);
        if (r > 200) { escF++; if (polarOf(i) < POL) polF++; } }
      let escX = 0, polX = 0;
      for (let i = GAS0; i < S.n; i++) if (crossT[i] >= 0) { escX++; if (crossA[i] < POL) polX++; }
      return { t, escF, fracF: escF ? +(polF / escF).toFixed(4) : 0,
        escX, fracX: escX ? +(polX / escX).toFixed(4) : 0 };
    };
    const BLK = 250, NBLK = (o.steps || 6000) / BLK;
    const series = []; let kickInfo = null, preKick = null;
    for (let blk = 0; blk < NBLK; blk++) {
      for (let k = 0; k < BLK; k++) {
        S.step(0.016);
        for (let i = GAS0; i < S.n; i++) if (crossT[i] < 0 && Math.hypot(S.x[i], S.y[i]) > 200) {
          crossT[i] = blk * BLK + k + 1; crossA[i] = polarOf(i); }
      }
      const t = (blk + 1) * BLK;
      if (o.kick && t === o.kick.at) { preKick = snap(t); kickInfo = inject(o.kick); }
      series.push(snap(t));
    }
    let lSwArc = 0; for (let i = 1; i <= NARC; i++) lSwArc += S.lSw[i] / NARC;
    const cross = [];
    for (let i = GAS0; i < S.n; i++) if (crossT[i] >= 0) cross.push({ t: crossT[i], polar: crossA[i] < POL });
    const fin = series[series.length - 1];
    const T1 = S.totals(), L1 = T1.L + S.resL + S.radL;
    let lScale = 0;
    for (let i = 0; i < S.n; i++) lScale += Math.abs(S.m[i] * (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]))
      + 0.5 * Math.abs(S.m[i]) * S.R[i] * S.R[i] * Math.abs(S.spin[i]);
    return { n: S.n, nGas, escN: fin.escF, polarFraction: fin.fracF,
      escX: fin.escX, fracX: fin.fracX, escRate: +(fin.escF / nGas).toFixed(4),
      lSwC: +S.lSw[0].toFixed(4), lSwArc: +lSwArc.toFixed(4), series, cross,
      preKick, kick: kickInfo ? { sigma: +kickInfo.sigma.toFixed(4), vRms: +kickInfo.vRms.toFixed(4) } : null,
      relL: +(Math.abs(L1 - L0) / Math.max(lScale, 1e-9)).toExponential(2),
      nan: S.hasNaN(), clampV: S.clampVN, clampR: S.clampRN || 0 };
  }, mod);

  // ---- B1) ③多seed 16 + ⑥時間窓 --------------------------------------------------------------
  // ⏳ は 1本(6000步・83粒子)が 1.6 s と軽いので、統括裁定の目標どおり **16seed** を採る。
  const SEEDS16 = Array.from({ length: QUICK ? 3 : 16 }, (_, i) => 20260804 + i);   // 内蔵 seed 20260804 を先頭に
  console.log('=== B1) ③多seed 16(6000步・本則 vs 対照〔kRep=0〕)+ ⑥時間窓相乗り ===');
  {
    const t0 = Date.now();
    const ms = { seeds: SEEDS16, nSeedReason: '1本1.6s実測 — 16seed でも 51s。裁定の目標16をそのまま採用',
      main: {}, ctrl: {} };
    for (const sd of SEEDS16) {
      const a = await runNB({ seed: sd });
      const b = await runNB({ seed: sd, kRep: 0 });
      ms.main['s' + sd] = a; ms.ctrl['s' + sd] = b;
      console.log(`seed${sd}`.padEnd(12),
        `本則 脱出${String(a.escN).padStart(2)}/${a.nGas} 極方向比${a.polarFraction.toFixed(3)}`,
        `(crossing定義 ${a.fracX.toFixed(3)}) 中心lSw${a.lSwC.toFixed(3)} アーク帯${a.lSwArc.toFixed(3)}`,
        `| 対照(kRep=0) 脱出${b.escN}`, a.nan || b.nan ? 'NAN' : '');
    }
    const g = (o, f) => SEEDS16.map((sd) => f(ms[o]['s' + sd]));
    ms.stats = {
      polarFraction: q(g('main', (s) => s.polarFraction)),
      polarFractionCrossing: q(g('main', (s) => s.fracX)),
      escN: q(g('main', (s) => s.escN)), escCtrl: q(g('ctrl', (s) => s.escN)),
      lSwC: q(g('main', (s) => s.lSwC)), lSwArc: q(g('main', (s) => s.lSwArc)),
      isotropic: 1 / 3,
      concentration: q(g('main', (s) => s.polarFraction / (1 / 3))),
      nan: SEEDS16.filter((sd) => ms.main['s' + sd].nan || ms.ctrl['s' + sd].nan),
      relLMax: Math.max(...g('main', (s) => Number(s.relL))) };
    // ⑥ 時間窓: 極方向比が安定する時間帯・脱出が始まる step
    ms.timeWindow = SEEDS16.map((sd) => {
      const s = ms.main['s' + sd];
      const first = (s.series.find((z) => z.escF > 0) || {}).t || null;
      const t10 = (s.series.find((z) => z.escF >= 10) || {}).t || null;
      return { seed: sd, firstEscT: first, esc10T: t10,
        fracAt: [2000, 3000, 4000, 5000, 6000].map((t) => {
          const z = s.series.find((u) => u.t === t); return { t, escF: z.escF, fracF: z.fracF }; }) };
    });
    B.多seed = ms; B.多seed.所要 = sec(t0);
    console.log(`  極方向比(claim定義) ${JSON.stringify(ms.stats.polarFraction)}`);
    console.log(`  極方向比(crossing) ${JSON.stringify(ms.stats.polarFractionCrossing)}`);
    console.log(`  脱出体数 本則 ${JSON.stringify(ms.stats.escN)} / 対照(kRep=0) ${JSON.stringify(ms.stats.escCtrl)}`);
    console.log(`  中心lSw ${JSON.stringify(ms.stats.lSwC)} / アーク帯lS̄ ${JSON.stringify(ms.stats.lSwArc)}`);
    console.log(`  [${sec(t0)}]`);
  }

  // ---- B2) ④粒子数スケーリング --------------------------------------------------------------
  // ガス数 30/60/120(半分/標準/2倍)。⏳ も n はガス総質量でもあり、さらに半径30の円盤に
  // 詰める個数なので**充填密度**(接触ばね・E5′ の相手数)も同時に動く — 交絡は明記する。
  console.log('=== B2) ④ガス粒子数スケーリング(n=30/60/120)===');
  {
    const t0 = Date.now();
    const sc = { plan: [30, 60, 120], seeds: [20260804, 20260805, 20260806],
      limit: 'n はガス総質量でも充填密度でもある(半径30の円盤に詰める個数)。' +
        'アーク幾何・中心質量は不変なので「幾何が collimate するか」は分離できるが、' +
        '「粒子数だけを独立に振る」設計ではない(🥚 と同じ交絡)',
      main: [], ctrl: [] };
    for (const n of sc.plan) {
      for (const sd of sc.seeds) {
        const a = (n === 60 && B.多seed && B.多seed.main['s' + sd]) ? B.多seed.main['s' + sd]
          : await runNB({ seed: sd, nGas: n });
        sc.main.push({ n, seed: sd, nGas: a.nGas, escN: a.escN, escRate: a.escRate,
          polarFraction: a.polarFraction, fracX: a.fracX, lSwArc: a.lSwArc, nan: a.nan,
          reused: n === 60 });
      }
      const sd = sc.seeds[0];
      const c = (n === 60 && B.多seed) ? B.多seed.ctrl['s' + sd] : await runNB({ seed: sd, nGas: n, kRep: 0 });
      sc.ctrl.push({ n, seed: sd, escN: c.escN, reused: n === 60 });
    }
    for (const r of sc.main) console.log(`  本則 n=${String(r.n).padStart(3)} seed${r.seed}`,
      `脱出${String(r.escN).padStart(3)}/${r.nGas}(率${r.escRate.toFixed(3)})`,
      `極方向比${r.polarFraction.toFixed(3)}(crossing ${r.fracX.toFixed(3)}) アーク帯${r.lSwArc.toFixed(3)}`,
      r.reused ? '(多seedから再利用)' : '', r.nan ? 'NAN' : '');
    for (const r of sc.ctrl) console.log(`  対照(kRep=0) n=${String(r.n).padStart(3)} 脱出${r.escN}`);
    sc.byN = sc.plan.map((n) => {
      const m = sc.main.filter((r) => r.n === n);
      return { n, polarFraction: q(m.map((r) => r.polarFraction)),
        escRate: q(m.map((r) => r.escRate)), ctrlEsc: sc.ctrl.find((r) => r.n === n).escN }; });
    console.log(`  極方向比 by n: ${sc.byN.map((z) => `n${z.n}=${z.polarFraction.median}(${z.polarFraction.min}〜${z.polarFraction.max})`).join(' / ')}`);
    B.スケーリング = sc; B.スケーリング.所要 = sec(t0);
    console.log(`  [${sec(t0)}]`);
  }

  // ---- B3) ⑤摂動回復 ------------------------------------------------------------------------
  // ⏳ の主張量は「脱出ガスの極方向集中」= 累積統計なので、注入前後で切って測る:
  // step3000(脱出がまだ数体の時点)でガスの速度を等方ノイズでかき混ぜ、**注入後に r>200 を
  // 跨いだ粒子だけ**の極方向比を無摂動と比べる(= 方位をランダム化しても幾何が collimate し直すか)。
  console.log('=== B3) ⑤摂動回復(step3000 でガスに等方速度ノイズ・注入後の脱出だけを測る)===');
  {
    const t0 = Date.now();
    const AMPS = QUICK ? [1.0] : [0.25, 0.5, 1.0, 2.0, 4.0];
    const pk = { amps: AMPS, at: 3000, seeds: QUICK ? [20260804] : [20260804, 20260805, 20260806], runs: [] };
    const postCross = (r, at) => { const a = r.cross.filter((z) => z.t > at);
      return { n: a.length, polar: a.filter((z) => z.polar).length,
        frac: a.length ? +(a.filter((z) => z.polar).length / a.length).toFixed(4) : null }; };
    for (const sd of pk.seeds) {
      const base = B.多seed.main['s' + sd];
      const bp = postCross(base, 3000);
      for (const amp of AMPS) {
        const r = await runNB({ seed: sd, kick: { at: 3000, amp, rngSeed: 20260807 } });
        const p2 = postCross(r, 3000);
        pk.runs.push({ seed: sd, amp, sigma: r.kick.sigma, vRms: r.kick.vRms,
          preEsc: r.preKick.escF, preFrac: r.preKick.fracF,
          postEscN: p2.n, postFrac: p2.frac, baseEscN: bp.n, baseFrac: bp.frac,
          endEsc: r.escN, endFrac: r.polarFraction, baseEndEsc: base.escN, baseEndFrac: base.polarFraction,
          lSwArc: r.lSwArc, nan: r.nan, clampV: r.clampV, clampR: r.clampR });
        const L = pk.runs[pk.runs.length - 1];
        console.log(`  seed${sd} amp${String(amp).padEnd(4)} σ=${L.sigma}(v_RMS=${L.vRms})`,
          `注入後の脱出${L.postEscN}体 極方向比${L.postFrac === null ? '—' : L.postFrac.toFixed(3)}`,
          `vs 無摂動${L.baseEscN}体 ${L.baseFrac === null ? '—' : L.baseFrac.toFixed(3)}`,
          `| 終端(claim定義) ${L.endFrac.toFixed(3)}/${L.endEsc}体 vs ${L.baseEndFrac.toFixed(3)}/${L.baseEndEsc}体`,
          L.nan ? 'NAN' : '');
      }
    }
    pk.byAmp = AMPS.map((a) => { const r = pk.runs.filter((z) => z.amp === a);
      return { amp: a, postFrac: q(r.filter((z) => z.postFrac !== null).map((z) => z.postFrac)),
        endFrac: q(r.map((z) => z.endFrac)), endEsc: q(r.map((z) => z.endEsc)) }; });
    B.摂動回復 = pk; B.摂動回復.所要 = sec(t0);
    console.log(`  amp別 注入後極方向比: ${pk.byAmp.map((z) => `amp${z.amp}=${z.postFrac.median}`).join(' / ')}`);
    console.log(`  [${sec(t0)}]`);
  }
}

// ============================================================================================
// C) E水準の判定サマリ
// ============================================================================================
out.meta.elapsedSec = +((Date.now() - T_ALL) / 1000).toFixed(1);
const judge = out.judge = {};
console.log('\n================ C) E水準の判定 ================');
if (out.darkrotor) {
  const A = out.darkrotor, S = A.多seed.stats;
  const closed = A.構成.pinnedParticles === 0 && A.構成.boundary === 'none'
    && A.構成.gravityX === 0 && A.構成.gravityY === 0;
  const seedOk = S.armRatio.min > 1.5 && S.nan.length === 0;
  const scaleOk = A.スケーリング.ratioByN.every((z) => z.ratio > 1.5);
  // ⑤ の合否: 「壊しても**また立ち上がる**か(自己維持)」なので、崩れたあと baseline の90%へ
  // 戻ることを要求する。戻らないなら E3 の要件は満たさない(= E2 に留まる)
  const kickOk = A.摂動回復.runs.length > 0 && A.摂動回復.runs.every((r) => r.recoverT !== null);
  judge.darkrotor = { closedSystem: closed,
    多seed: { 判定: seedOk, 増強比min: S.armRatio.min, 増強比中央: S.armRatio.median, NaN: S.nan.length },
    スケーリング: { 判定: scaleOk, 増強比: A.スケーリング.ratioByN },
    摂動回復: { 判定: kickOk, 詳細: A.摂動回復.runs.map((r) => `amp${r.amp}(seed${r.seed}): 崩れ×${r.minRatio}@${r.minRatioT} → 9000步で×${r.ratioAt9000} 復帰=${r.recoverT === null ? '未復帰' : r.recoverT}`) },
    水準: closed ? (seedOk && scaleOk && kickOk ? 'E3' : 'E2') : 'E1' };
  console.log(`🕶️darkrotor: 閉鎖系=${closed}(pinned 0/${A.構成.nParticle}) / ` +
    `③多seed8 増強比 min=${S.armRatio.min} 中央=${S.armRatio.median} → ${seedOk ? '通過' : '不通過'} / ` +
    `④スケーリング ${A.スケーリング.ratioByN.map((z) => `n${z.n}:${z.ratio}倍`).join(' ')} → ${scaleOk ? '通過' : '不通過'} / ` +
    `⑤摂動回復 → ${kickOk ? '通過' : '不通過'}`);
  console.log(`  ⇒ **E水準 = ${judge.darkrotor.水準}**`);
}
if (out.nebulaBipolar) {
  const B = out.nebulaBipolar, S = B.多seed.stats;
  judge.nebulaBipolar = { closedSystem: false,
    構成根拠: `pinned 粒子 ${B.構成.pinnedParticles}/${B.構成.nParticle}(赤道ダークアーク22個が外部固定)。` +
      `ローブを立てる幾何そのものが外部から与えられているので、定義により E2/E3 には該当しない`,
    多seed: { 極方向比: S.polarFraction, 等方: 1 / 3, 集中度: S.concentration, NaN: S.nan.length },
    スケーリング: B.スケーリング.byN.map((z) => ({ n: z.n, 極方向比中央: z.polarFraction.median })),
    摂動回復: B.摂動回復.byAmp.map((z) => ({ amp: z.amp, 注入後極方向比中央: z.postFrac.median })),
    水準: 'E1' };
  console.log(`⏳nebulaBipolar: 閉鎖系=false(pinned ${B.構成.pinnedParticles}/${B.構成.nParticle}) / ` +
    `③多seed16 極方向比 ${S.polarFraction.min}〜${S.polarFraction.max}(中央${S.polarFraction.median}・等方1/3) / ` +
    `④スケーリング ${B.スケーリング.byN.map((z) => `n${z.n}:${z.polarFraction.median}`).join(' ')} / ` +
    `⑤摂動回復 ${B.摂動回復.byAmp.map((z) => `amp${z.amp}:${z.postFrac.median}`).join(' ')}`);
  console.log(`  ⇒ **E水準 = E1**(pinned 駆動を含むので昇格しない — 頑健性は上の実測を注記として付ける)`);
}
console.log(`\n総所要 ${out.meta.elapsedSec}s`);

fs.writeFileSync(path.join(OUT_DIR, OUT_FILE), JSON.stringify(out, null, 1));
console.log('→ tests/out/' + OUT_FILE + (QUICK ? '(EXP488_QUICK=1 の縮約走行 — 数値は正本ではない)' : ''));
await browser.close();

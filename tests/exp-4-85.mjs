// 第83便A 実験 4-85: 🥚selfRotor(自己形成ダークローター)の**創発の標準試験**
//
// 主題: 「見た目がそれらしい固定seedの1本」と「再現性を持つ創発」を分けるための標準試験を、
//   第82便B で E2 と宣言した 🥚selfRotor に適用して E3(頑健性確認済みの創発)の可否を決める。
//   第82便B の exp-4-84 が担った①ノックアウト対照・②用量反応に対し、本ハーネスは残り4試験
//   ③多seed(16)・④粒子数スケーリング・⑤摂動回復・⑥時間窓を担当する。
//
// 標準試験(6試験)と担当ハーネス:
//   ① ノックアウト対照     : 機構を1つ外すと現象が消えるか        … exp-4-84(第82便B)
//   ② 用量反応             : 駆動因を強めると単調に強まるか        … exp-4-84(第82便B)
//   ③ 多seed               : 乱数の引きが変わっても再現するか      … 本ハーネス ①
//   ④ 粒子数スケーリング   : 特定の粒子数の離散模様ではないか      … 本ハーネス ②
//   ⑤ 摂動回復             : 壊してもまた立ち上がるか(自己維持)  … 本ハーネス ③
//   ⑥ 時間窓               : 成立する時間帯はどこか(validT 整合)… 本ハーネス ④
//
// 測定量(秩序変数 — 第82便B の創発モニタ HP.emergenceStats と同じ定義):
//   mFrac   = 最大質量天体の質量 / Σ|m|   (融合成長した中心天体の質量比)
//   maxFrac = 最大**塊**の質量比           (連結成分 — 中心天体+その周りの束縛群)
//   align   = スピン整列度(慣性重みつき)/ vsig = 回転支持比 V/σ / nCluster = 塊の数
//   lSw     = 中心天体の実効減光 lS_eff / lSwHalo = 中心以外の平均 lS_eff
//   Jc      = 中心天体の J_core / bound = 中心天体に重力束縛された天体の割合
//
// 摂動の注入について(実験操作であってアプリの機能ではない):
//   ハーネスが構造形成後(step 7500 = t120)に S.vx/S.vy(⑤b では S.spin も)を直接書き換える。
//   アプリ側に摂動ボタンは実装していない(本便のスコープ外)。決定論を保つため乱数は
//   ハーネス内の LCG(seed 固定)で、**質量重みつき平均を引いて系の全運動量は保存**させる
//   (重心が飛ばない = 「外から蹴った」ではなく「内部をかき混ぜた」摂動にする)。
//   注入は保存則の帳簿を意図的に破る操作なので、注入を含む run では relL を判定に使わない。
//
// 実行: QA_TARGET=beta/index.html node tests/exp-4-85.mjs(playwright 必須・約4分)
// 出力: tests/out/exp-4-85.json(QA ではない — 合否判定はしない計測スクリプト。
//       ただし末尾で E3 昇格の判定基準①②③に対する自動判定を出す)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + (TARGET.startsWith('/') ? TARGET : path.join(ROOT, TARGET));
const OUT_DIR = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(OUT_DIR, { recursive: true });

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

const has = await page.evaluate(() => HP.allPresets().some((p) => p.id === 'selfRotor'));
if (!has) { console.log('SKIP: 対象に 🥚selfRotor がありません(第82便B 未適用)'); await browser.close(); process.exit(0); }

// ---- 共通ランナー ------------------------------------------------------------------------
// mod: {seed, n, noFuse, noCore, steps[], kick:{at, vAmp, spinFlip, rngSeed}}
const run = (mod) => page.evaluate((o) => {
  const p = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === 'selfRotor')));
  if (o.noFuse) delete p.fusion;
  if (o.noCore) delete p.bodies[0].core;
  if (o.n !== undefined) p.bodies[0].n = o.n;
  if (o.seed !== undefined) p.seed = o.seed;
  const v = HP.validatePreset(p);
  if (!v.ok) return { err: v.errors };
  HP.sim.build(v.preset);
  const S = HP.sim;
  const N0 = S.n;
  const cs0 = HP.coreState(0);
  const jSeed = cs0 ? cs0.J : 0;
  const mSeed = Math.abs(S.m[0]);
  const T0 = S.totals(), L0 = T0.L + S.resL + S.radL;
  // 第97便: c₀=30 相似世代(validT 288)は同じ物理窓が步数×2 — 実行は VF 倍・記録は旧単位で正規化
  const VF = (v.preset.validT || 144) / 144;
  const step = () => Math.round(S.t / 0.016 / VF);
  const vRms = () => { let s = 0; for (let i = 0; i < S.n; i++) s += S.vx[i] * S.vx[i] + S.vy[i] * S.vy[i];
    return S.n ? Math.sqrt(s / S.n) : 0; };
  const meas = () => {
    let bi = 0, mTot = 0;
    for (let i = 0; i < S.n; i++) { mTot += Math.abs(S.m[i]); if (Math.abs(S.m[i]) > Math.abs(S.m[bi])) bi = i; }
    const cs = HP.coreState(bi);
    const G = S.params.G, MB = Math.abs(S.m[bi]);
    let bound = 0, lswH = 0, nH = 0, jSum = 0;
    for (let i = 0; i < S.n; i++) {
      const c2 = HP.coreState(i); if (c2) jSum += c2.J;
      if (i === bi) continue;
      const dx = S.x[i] - S.x[bi], dy = S.y[i] - S.y[bi];
      const dvx = S.vx[i] - S.vx[bi], dvy = S.vy[i] - S.vy[bi];
      const r = Math.hypot(dx, dy);
      if (0.5 * (dvx * dvx + dvy * dvy) - G * MB / Math.max(r, 1) < 0) bound++;
      lswH += S.lSw[i]; nH++;
    }
    const em = HP.emergenceStats(S);
    const Jc = cs ? cs.J : 0;
    return { step: step(), n: S.n, fusN: S.fusN,
      mMax: MB, mFrac: MB / mTot, spin: S.spin[bi], R: S.R[bi],
      lSw: S.lSw[bi], lSwHalo: nH ? lswH / nH : 0,
      Jc, JcSum: jSum, JcSeeds: jSeed ? Jc / jSeed : 0, mSeeds: MB / mSeed,
      bound: bound / Math.max(1, nH), vRms: vRms(),
      nCluster: em.nCluster, maxFrac: em.maxFrac, align: em.align, vsig: em.vsig };
  };
  // 摂動注入(ハーネス内 LCG — 決定論。全運動量は保存させる)
  const inject = (k) => {
    let s = (k.rngSeed || 12345) >>> 0;
    const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
    const gauss = () => { const u = Math.max(1e-12, rnd()), w = rnd();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * w); };
    const before = meas();
    const sig = (k.vAmp || 0) * before.vRms / Math.SQRT2;   // 成分ごとの σ(速さの RMS 比で較正)
    const dvx = new Float64Array(S.n), dvy = new Float64Array(S.n);
    for (let i = 0; i < S.n; i++) { dvx[i] = sig * gauss(); dvy[i] = sig * gauss(); }
    // 質量重みつき平均を引いて Σm·Δv = 0 にする(重心速度を変えない)
    let mT = 0, px = 0, py = 0;
    for (let i = 0; i < S.n; i++) { const a = Math.abs(S.m[i]); mT += a; px += a * dvx[i]; py += a * dvy[i]; }
    if (mT > 1e-12) { px /= mT; py /= mT; }
    for (let i = 0; i < S.n; i++) { S.vx[i] += dvx[i] - px; S.vy[i] += dvy[i] - py; }
    let flipped = 0;
    if (k.spinFlip) { for (let i = 0; i < S.n; i++) if (rnd() < 0.5) { S.spin[i] = -S.spin[i]; flipped++; } }
    return { before, sigma: sig, flipped };
  };
  const steps = o.steps || [3000, 6000, 9000];   // 旧単位(実行步数は ×VF)
  const out = [meas()];
  let kick = null;
  for (const T of steps) {
    while (step() < T) S.step(0.016);   // step() が旧単位なので実行は自動的に ×VF
    if (o.kick && o.kick.at === T && !kick) { kick = inject(o.kick); out.push(Object.assign(meas(), { kicked: true })); }
    else out.push(meas());
  }
  const T1 = S.totals(), L1 = T1.L + S.resL + S.radL;
  let lScale = 0;
  for (let i = 0; i < S.n; i++) lScale += Math.abs(S.m[i] * (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]))
    + 0.5 * Math.abs(S.m[i]) * S.R[i] * S.R[i] * Math.abs(S.spin[i]);
  return { N0, jSeed, mSeed, snaps: out, kick: kick ? { sigma: kick.sigma, flipped: kick.flipped, before: kick.before } : null,
    relL: Math.abs(L1 - L0) / Math.max(lScale, 1e-9),
    nan: S.hasNaN(), clampV: S.clampVN, clampR: S.clampRN || 0 };
}, mod);

const at = (r, step) => r.snaps.find((s) => s.step === step) || r.snaps[r.snaps.length - 1];
const q = (a) => { const b = [...a].sort((x, y) => x - y);
  const md = b.length % 2 ? b[(b.length - 1) / 2] : 0.5 * (b[b.length / 2 - 1] + b[b.length / 2]);
  return { min: b[0], median: md, max: b[b.length - 1], mean: b.reduce((s, v) => s + v, 0) / b.length,
    vals: a.map((v) => +v.toFixed(4)) }; };
const f4 = (o) => ({ min: +o.min.toFixed(4), median: +o.median.toFixed(4), max: +o.max.toFixed(4),
  mean: +o.mean.toFixed(4), vals: o.vals });

const out = { meta: { exp: '4-85', wave: 83, track: 'A', target: TARGET, date: new Date().toISOString().slice(0, 10),
  note: '🥚selfRotor 創発の標準試験 — 多seed16/粒子数スケーリング/摂動回復/時間窓(QA ではない計測)',
  stepUnit: '旧単位(c₀=30 相似世代は実行步数 ×validT/144 — 第97便再実測)' } };
const t00 = Date.now();

// ==== ① 多seed 16 ===========================================================================
// 20260806〜20260821 の16seed で本則と対照(融合オフ)を 9000步(=validT 144)まで走らせる。
// 対照も16seed 全部で採る — 1本 3秒弱なので間引く必要がない(実測で判断)。
console.log('=== ① 多seed 16(9000步・本則 vs 融合オフ対照)===');
const SEEDS16 = Array.from({ length: 16 }, (_, i) => 20260806 + i);
const ms = { seeds: SEEDS16, main: {}, noFuse: {} };
for (const sd of SEEDS16) {
  const a = await run({ seed: sd, steps: [9000] });
  const b = await run({ seed: sd, noFuse: true, steps: [9000] });
  ms.main['s' + sd] = a; ms.noFuse['s' + sd] = b;
  const A = at(a, 9000), B = at(b, 9000);
  console.log(`seed${sd}`.padEnd(12),
    `本則 n${String(A.n).padStart(3)} fus${String(A.fusN).padStart(3)} mFrac${(A.mFrac * 100).toFixed(1)}%`,
    `maxFrac${A.maxFrac.toFixed(3)} align${A.align.toFixed(3)} V/σ${A.vsig.toFixed(2)}`,
    `lSw${A.lSw.toFixed(3)}/halo${A.lSwHalo.toFixed(3)} Jc${A.Jc.toFixed(4)} b${A.bound.toFixed(2)}`,
    `| 対照 mFrac${(B.mFrac * 100).toFixed(2)}% maxFrac${B.maxFrac.toFixed(3)}`,
    a.nan || b.nan ? 'NAN' : '', (a.clampV || a.clampR) ? `clamp${a.clampV}/${a.clampR}` : '');
}
const gm = (o, f) => SEEDS16.map((sd) => f(at(ms[o]['s' + sd], 9000)));
ms.stats = {
  mFrac: { main: f4(q(gm('main', (s) => s.mFrac))), noFuse: f4(q(gm('noFuse', (s) => s.mFrac))) },
  maxFrac: { main: f4(q(gm('main', (s) => s.maxFrac))), noFuse: f4(q(gm('noFuse', (s) => s.maxFrac))) },
  align: { main: f4(q(gm('main', (s) => s.align))), noFuse: f4(q(gm('noFuse', (s) => s.align))) },
  vsig: { main: f4(q(gm('main', (s) => s.vsig))), noFuse: f4(q(gm('noFuse', (s) => s.vsig))) },
  lSw: { main: f4(q(gm('main', (s) => s.lSw))), noFuse: f4(q(gm('noFuse', (s) => s.lSw))) },
  lSwHalo: { main: f4(q(gm('main', (s) => s.lSwHalo))), noFuse: f4(q(gm('noFuse', (s) => s.lSwHalo))) },
  Jc: { main: f4(q(gm('main', (s) => s.Jc))) },
  JcSeeds: { main: f4(q(gm('main', (s) => s.JcSeeds))) },
  bound: { main: f4(q(gm('main', (s) => s.bound))), noFuse: f4(q(gm('noFuse', (s) => s.bound))) },
  nBody: { main: f4(q(gm('main', (s) => s.n))) }, fusN: { main: f4(q(gm('main', (s) => s.fusN))) },
  nan: SEEDS16.filter((sd) => ms.main['s' + sd].nan || ms.noFuse['s' + sd].nan),
  clamp: SEEDS16.filter((sd) => ms.main['s' + sd].clampV || ms.main['s' + sd].clampR),
  relLmax: Math.max(...SEEDS16.map((sd) => ms.main['s' + sd].relL)),
};
out.multiSeed = ms;
console.log('--- 16seed 集計 @9000步 ---');
console.log(JSON.stringify(ms.stats, null, 1));

// ==== ② 粒子数スケーリング ==================================================================
// n=90/180/360 を代表3seed で。n を変えると乱数列も変わるので「同一 seed の一致」ではなく
// 分布(min/median/max)で傾向が保たれるかを見る。
console.log('=== ② 粒子数スケーリング(n=90/180/360・代表3seed・9000步)===');
const SEED3 = [20260806, 20260807, 20260808];
const sc = { ns: [90, 180, 360], seeds: SEED3, runs: {}, stats: {} };
for (const n of sc.ns) {
  sc.runs['n' + n] = {}; sc.runs['n' + n + 'noFuse'] = {};
  for (const sd of SEED3) {
    const a = await run({ seed: sd, n, steps: [9000] });
    const b = await run({ seed: sd, n, noFuse: true, steps: [9000] });
    sc.runs['n' + n]['s' + sd] = a; sc.runs['n' + n + 'noFuse']['s' + sd] = b;
    const A = at(a, 9000), B = at(b, 9000);
    console.log(`n=${n} seed${sd}`.padEnd(20),
      `n${String(A.n).padStart(3)} fus${String(A.fusN).padStart(3)} mFrac${(A.mFrac * 100).toFixed(1)}%`,
      `maxFrac${A.maxFrac.toFixed(3)} align${A.align.toFixed(3)} V/σ${A.vsig.toFixed(2)}`,
      `lSw${A.lSw.toFixed(3)}/halo${A.lSwHalo.toFixed(3)} b${A.bound.toFixed(2)}`,
      `| 対照 mFrac${(B.mFrac * 100).toFixed(2)}%(=1/${n})`);
  }
  const g = (key, f) => SEED3.map((sd) => f(at(sc.runs[key]['s' + sd], 9000)));
  sc.stats['n' + n] = {
    mFrac: f4(q(g('n' + n, (s) => s.mFrac))), mFracNoFuse: f4(q(g('n' + n + 'noFuse', (s) => s.mFrac))),
    maxFrac: f4(q(g('n' + n, (s) => s.maxFrac))), align: f4(q(g('n' + n, (s) => s.align))),
    vsig: f4(q(g('n' + n, (s) => s.vsig))), lSw: f4(q(g('n' + n, (s) => s.lSw))),
    lSwHalo: f4(q(g('n' + n, (s) => s.lSwHalo))), bound: f4(q(g('n' + n, (s) => s.bound))),
    nBody: f4(q(g('n' + n, (s) => s.n))), fusN: f4(q(g('n' + n, (s) => s.fusN))),
    ratio: +(q(g('n' + n, (s) => s.mFrac)).median / Math.max(1e-12, q(g('n' + n + 'noFuse', (s) => s.mFrac)).median)).toFixed(1),
  };
}
out.scaling = sc;
console.log('--- スケーリング集計 ---');
console.log(JSON.stringify(sc.stats, null, 1));

// ==== ③ 摂動回復 ============================================================================
// ③a 較正: step7500(t=120)で速度ノイズの大きさ vAmp(速さRMS比)を 0.15/0.3/0.6/1.0 と振り、
//     「どの大きさなら秩序変数が実際に崩れるか」を実測してから本測の振幅を決める。
console.log('=== ③a 摂動の較正(seed 20260806・step7500 で注入・注入直後の秩序変数)===');
const KICK_AT = 7500;   // t=120(構造形成が終わっている実測時刻 — ④の時間窓で確認する)
// 注入直後の緩和は速いので、蹴った直後を密に採る(回復時間の分解能 = 10步 = Δt0.16)
const REC_STEPS = [7500, 7510, 7525, 7550, 7600, 7700, 7750, 8000, 8500, 9000, 10000, 12000, 15000];
const pb = { kickAt: KICK_AT, seeds: SEED3, calib: {}, runs: {}, ref: {} };
for (const amp of [0.15, 0.3, 0.6, 1.0, 2.0, 4.0]) {
  const r = await run({ seed: 20260806, steps: REC_STEPS, kick: { at: KICK_AT, vAmp: amp, rngSeed: 83001 } });
  pb.calib['v' + amp] = r;
  const b = r.kick.before, a = at(r, KICK_AT), e = at(r, 15000);
  console.log(`vAmp=${amp}`.padEnd(12),
    `σ=${r.kick.sigma.toFixed(3)} 前 mf${b.maxFrac.toFixed(3)} al${b.align.toFixed(3)} V/σ${b.vsig.toFixed(2)} b${b.bound.toFixed(2)} sp${b.spin.toFixed(3)} n${b.n}`,
    `→ 直後 mf${a.maxFrac.toFixed(3)} al${a.align.toFixed(3)} V/σ${a.vsig.toFixed(2)} b${a.bound.toFixed(2)}`,
    `→ 15000步 mf${e.maxFrac.toFixed(3)} al${e.align.toFixed(3)} V/σ${e.vsig.toFixed(2)} b${e.bound.toFixed(2)} mFrac${(e.mFrac * 100).toFixed(1)}%`);
}
// ③b 本測: 代表3seed。(i) 速度ノイズのみ(統括指示の 30%)/ (ii) 速度ノイズ+スピン反転
//     (align は速度ノイズでは定義上まったく動かないので、整列度の回復を測るには
//      スピン側にも摂動を入れる必要がある — 実測に基づく追加試験)。
//     (iii) 無摂動の双子(同 seed・同步数)を基準線として別に走らせ、「回復」は基準線との差で読む。
console.log('=== ③b 摂動回復(代表3seed・step7500 で注入 → 15000步まで追跡)===');
for (const sd of SEED3) {
  const ref = await run({ seed: sd, steps: REC_STEPS });
  const kv = await run({ seed: sd, steps: REC_STEPS, kick: { at: KICK_AT, vAmp: 0.3, rngSeed: 83002 } });
  const ks = await run({ seed: sd, steps: REC_STEPS, kick: { at: KICK_AT, vAmp: 0.3, spinFlip: true, rngSeed: 83003 } });
  pb.ref['s' + sd] = ref; pb.runs['s' + sd] = { v30: kv, v30spin: ks };
  const R9 = at(ref, 15000);
  console.log(`seed${sd} 基準(無摂動)`.padEnd(26),
    `@15000 maxFrac${R9.maxFrac.toFixed(3)} align${R9.align.toFixed(3)} V/σ${R9.vsig.toFixed(2)} mFrac${(R9.mFrac * 100).toFixed(1)}% n${R9.n}`);
  for (const [tag, r] of [['v30(速度30%)', kv], ['v30+spin反転', ks]]) {
    const b = r.kick.before;
    const line = REC_STEPS.map((T) => { const s = at(r, T);
      return `${T}:mf${s.maxFrac.toFixed(3)}/al${s.align.toFixed(3)}`; }).join(' ');
    console.log(`  ${tag}`.padEnd(26), `σ=${r.kick.sigma.toFixed(3)} flip=${r.kick.flipped}`,
      `注入前 mf${b.maxFrac.toFixed(3)} al${b.align.toFixed(3)} V/σ${b.vsig.toFixed(2)}`);
    console.log('   ', line);
  }
}
// 回復の定量: 秩序変数 X について「注入直後の落ち込み」を 1 として、無摂動基準線に対する
// 回復率 rec(T) = (X_pert(T) − X_post) / (X_ref(T) − X_post) を採る。rec≥0.9 の最初の步が回復時間。
const recovery = (r, ref, key) => {
  const post = at(r, KICK_AT)[key];
  const rows = REC_STEPS.filter((T) => T > KICK_AT).map((T) => {
    const xr = at(ref, T)[key], xp = at(r, T)[key];
    const den = xr - post;
    return { step: T, ref: +xr.toFixed(4), pert: +xp.toFixed(4),
      rec: Math.abs(den) < 1e-9 ? (Math.abs(xp - xr) < 1e-9 ? 1 : 0) : +((xp - post) / den).toFixed(3) };
  });
  const hit = rows.find((v) => v.rec >= 0.9);
  return { post: +post.toFixed(4), rows, recStep: hit ? hit.step : null, recDt: hit ? (hit.step - KICK_AT) * 0.016 : null };
};
pb.recovery = {};
for (const sd of SEED3) {
  pb.recovery['s' + sd] = {};
  for (const mode of ['v30', 'v30spin']) {
    pb.recovery['s' + sd][mode] = {
      maxFrac: recovery(pb.runs['s' + sd][mode], pb.ref['s' + sd], 'maxFrac'),
      align: recovery(pb.runs['s' + sd][mode], pb.ref['s' + sd], 'align'),
      vsig: recovery(pb.runs['s' + sd][mode], pb.ref['s' + sd], 'vsig'),
      bound: recovery(pb.runs['s' + sd][mode], pb.ref['s' + sd], 'bound'),
      spin: recovery(pb.runs['s' + sd][mode], pb.ref['s' + sd], 'spin'),
      mFrac: recovery(pb.runs['s' + sd][mode], pb.ref['s' + sd], 'mFrac'),
      // 「そもそも崩れたか」— 崩れていない変数の「回復」は空虚なので必ず併記する
      disturbed: {}, };
    for (const k of ['maxFrac', 'align', 'vsig', 'bound', 'spin']) {
      const b = pb.runs['s' + sd][mode].kick.before[k], p = at(pb.runs['s' + sd][mode], KICK_AT)[k];
      pb.recovery['s' + sd][mode].disturbed[k] = { before: +b.toFixed(4), post: +p.toFixed(4),
        drop: +(Math.abs(b) < 1e-12 ? 0 : (b - p) / Math.abs(b)).toFixed(4) };
    }
  }
}
out.perturb = pb;
console.log('--- 崩れ幅(注入直後 / 注入前)と回復(rec=(X_pert−X_直後)/(X_無摂動−X_直後)≥0.9)---');
for (const sd of SEED3) for (const mode of ['v30', 'v30spin']) {
  const R = pb.recovery['s' + sd][mode];
  console.log(`seed${sd} ${mode}`.padEnd(24),
    ['maxFrac', 'align', 'vsig', 'bound', 'spin'].map((k) =>
      `${k}: ${R.disturbed[k].before}→${R.disturbed[k].post}(崩れ${(R.disturbed[k].drop * 100).toFixed(0)}%)` +
      `${Math.abs(R.disturbed[k].drop) < 0.02 ? '[崩れず]' : R[k].recStep ? `→回復@+${R[k].recStep - KICK_AT}步(Δt=${R[k].recDt.toFixed(2)})` : '→未回復'}`).join(' / '));
}

// ==== ④ 時間窓 ==============================================================================
// 立ち上がり(構造形成)の完了と、その後の安定を実測して validT=144(=9000步)との整合を見る。
console.log('=== ④ 時間窓(代表3seed・密なサンプリング 0〜18000步)===');
const TW_STEPS = [250, 500, 750, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 7500, 9000, 10500, 12000, 15000, 18000];
const tw = { steps: TW_STEPS, runs: {}, window: {} };
for (const sd of SEED3) {
  const r = await run({ seed: sd, steps: TW_STEPS });
  tw.runs['s' + sd] = r;
  const fin = at(r, 9000);
  // 立ち上がり: mFrac が 9000步 値の 90% に初めて達する步 / 塊がひとつに落ち着く步
  const rise = [0, ...TW_STEPS].map((T) => at(r, T)).find((s) => s.mFrac >= 0.9 * fin.mFrac);
  const alignT = [0, ...TW_STEPS].map((T) => at(r, T)).find((s) => s.align >= 0.99);
  const clumpT = [0, ...TW_STEPS].map((T) => at(r, T)).find((s) => s.maxFrac >= 0.9);
  // 安定: 立ち上がり後、以降の全サンプルで mFrac が 9000步 値の ±10% に収まる最初の步
  const after = TW_STEPS.map((T) => at(r, T));
  let stab = null;
  for (let i = 0; i < after.length; i++) {
    if (after.slice(i).every((s) => Math.abs(s.mFrac - fin.mFrac) <= 0.1 * fin.mFrac)) { stab = after[i].step; break; }
  }
  tw.window['s' + sd] = { riseStep: rise ? rise.step : null, riseT: rise ? +(rise.step * 0.016).toFixed(1) : null,
    alignStep: alignT ? alignT.step : null, clumpStep: clumpT ? clumpT.step : null,
    stabStep: stab, stabT: stab === null ? null : +(stab * 0.016).toFixed(1),
    mFrac9000: +fin.mFrac.toFixed(4), mFrac18000: +at(r, 18000).mFrac.toFixed(4),
    drift9to18: +Math.abs(at(r, 18000).mFrac - fin.mFrac).toFixed(4) };
  console.log(`seed${sd}`.padEnd(12), TW_STEPS.map((T) => { const s = at(r, T);
    return `${T}:${(s.mFrac * 100).toFixed(0)}%`; }).join(' '));
  console.log('  窓:', JSON.stringify(tw.window['s' + sd]));
}
out.timeWindow = tw;

// ==== 判定(統括の E3 昇格基準 ①②③)========================================================
const mainMin = ms.stats.mFrac.main.min;
const ctlMedian = ms.stats.mFrac.noFuse.median;
const c1 = SEEDS16.every((sd) => at(ms.main['s' + sd], 9000).mFrac > 10 * ctlMedian);
// ② 対照(融合オフ)の質量比は定義上つねに 1/n なので、n を変えると対照の基準線も動く。
//    「10倍超」を min で見るか median で見るかで結論が変わる n があるため、両方を出す。
const scMin = {}, scMed = {};
for (const n of [90, 180, 360]) {
  const s = sc.stats['n' + n];
  scMin['n' + n] = s.mFrac.min > 10 * s.mFracNoFuse.median;
  scMed['n' + n] = s.mFrac.median > 10 * s.mFracNoFuse.median;
}
const c2min = Object.values(scMin).every(Boolean), c2med = Object.values(scMed).every(Boolean);
// ③ 「崩れたのに戻った」だけを回復と数える(崩れなかった変数の回復は空虚なので別立て)
const distOf = (sd, mode, k) => pb.recovery['s' + sd][mode].disturbed[k];
const recOk = SEED3.every((sd) => {
  const R = pb.recovery['s' + sd];
  const spinBroke = Math.abs(distOf(sd, 'v30spin', 'align').drop) > 0.5;
  return spinBroke && R.v30spin.align.recStep !== null;
});
const vUntouched = SEED3.every((sd) => Math.abs(distOf(sd, 'v30', 'maxFrac').drop) < 0.02);
out.verdict = {
  c1_multiSeed16: { pass: c1, detail: `16seed 全ての mFrac(min=${(mainMin * 100).toFixed(1)}%)が対照中央値 ${(ctlMedian * 100).toFixed(2)}% の10倍(${(10 * ctlMedian * 100).toFixed(1)}%)超` },
  c2_scaling: { pass: c2med, passStrictMin: c2min,
    detail: [90, 180, 360].map((n) => { const s = sc.stats['n' + n];
      return `n=${n}: mFrac ${(s.mFrac.min * 100).toFixed(1)}〜${(s.mFrac.max * 100).toFixed(1)}%(中央${(s.mFrac.median * 100).toFixed(1)}%) vs 対照 ${(s.mFracNoFuse.median * 100).toFixed(2)}%(=1/${n}) 比 中央${s.ratio}/最小${(s.mFrac.min / s.mFracNoFuse.median).toFixed(1)} ` +
        `maxFrac中央${s.maxFrac.median} align中央${s.align.median}`; }).join(' / ') },
  c3_perturbRecovery: { pass: recOk, velocityKickDoesNotDisturb: vUntouched,
    detail: SEED3.map((sd) => `seed${sd}: 速度30%→maxFrac 崩れ${(distOf(sd, 'v30', 'maxFrac').drop * 100).toFixed(1)}%(=構造は乱れない)・` +
      `V/σ 崩れ${(distOf(sd, 'v30', 'vsig').drop * 100).toFixed(0)}%→回復${pb.recovery['s' + sd].v30.vsig.recStep ? '+' + (pb.recovery['s' + sd].v30.vsig.recStep - KICK_AT) + '步' : '未達'} / ` +
      `spin反転→align ${distOf(sd, 'v30spin', 'align').before}→${distOf(sd, 'v30spin', 'align').post}→回復${pb.recovery['s' + sd].v30spin.align.recStep ? '+' + (pb.recovery['s' + sd].v30spin.align.recStep - KICK_AT) + '步(Δt' + pb.recovery['s' + sd].v30spin.align.recDt.toFixed(2) + ')' : '未達'}`).join(' / ') },
  promoteE3: c1 && c2med,
  elapsedSec: +((Date.now() - t00) / 1000).toFixed(1),
};
console.log('=== 判定 ===');
console.log(JSON.stringify(out.verdict, null, 1));

fs.writeFileSync(path.join(OUT_DIR, 'exp-4-85.json'), JSON.stringify(out, null, 1));
console.log('saved tests/out/exp-4-85.json  (' + out.verdict.elapsedSec + 's)');
await browser.close();

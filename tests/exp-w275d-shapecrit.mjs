// 第275便d(第65報 (4)(5)(6)「🔮 は星団配置に安定収束させる / 🥏 は銀河に見える様に / 🧵 中心天体版」):
// **形状トイの安定・低分散・銀河らしさの判定器**。
//
// **判定の列は測る前に決めてある**(第273便 R28・第274便d と同じ流儀):
//   (a) **発散していない** …… 面内 RMS 半径が**初期配置**に対して T=200 まで ±5% 以内
//       (第274便d の既定は σ:36→90 の成長を宣言していたので、ここは**設計どおり外れる** —— 対照として並べる)。
//   (b) **入り乱れていない** …… 角運動量 L_z の符号が平均と逆の粒子の割合 < 5%(`retrograde`)と、
//       σ_z/σ_R(面外/面内)。**銀河ディスクらしさの必要条件**であって十分条件ではない。
//   (c) **棒が太らない** …… 🧵 の横断 RMS 幅の残差 ±5% 以内・軸方向の半長の残差 ±5% 以内。
//   (d) **摂動からの回復** …… 潜在状態を ×1.05 / ×1.10 して、RMS 半径が戻るか(3 seed)。
//   (e) **無成長対照** …… τ=0 の宣言そのもの(本便の既定)と、**成長あり**(第274便d の既定)を並べる。
//   (f) **回転曲線の形**(診断) …… 半径ビンの Ω と v_t のばらつき。**剛体回転なら Ω が一定**・
//       **平坦回転なら v_t が一定**。この模型の A(t) は**線形写像**なので剛体回転しか出ない —— その否定結果を数で置く。
//
// **この器は合否を宣言しない**(数と、事前に決めた条件を満たしたかの真偽値だけを JSON へ置く)。
// **較正ではない**: 観測された星団・銀河・渦状腕の量を 1 つも入力していない。
//
// 使い方:
//   PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w275d-shapecrit.mjs
// 環境変数: W275D_OUT(既定 tests/out/shapecrit-w275d.json)/ W275D_TARGET(既定 beta/index.html)/
//           W275D_SMOKE=1(短い配線確認 —— 正本にしない)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { rmsRadius, retrograde, axisWidth, rotationCurve, curveShape, meanSd, relDrift, relaxTime }
  from './lib-w275d-shapecrit.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
// 第281便a(原仮定者の裁定(第71報)・AN16・統括の検証項目 R71): **この器が読む html の領域**の宣言。
//   `tests/lib-w281a-scope.mjs` がこの領域だけの hash(`scopeSha256`)を正本の meta に刻む。
//   `lint.provenanceMeta` ② は「targetSha256 一致 **または**(scopeComplete かつ scopeSha256 が今の html で
//   引き直した値と一致)」で通す。`lint.regenScope` が「宣言 ⊇ 器のコードから機械で引いた下限
//   (HP.*・html の最上位名・内蔵プリセット id)」を照合する。**1 行の JSON**(lint が読む)。
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
const REGEN_SCOPE = {"presets":"all","roots":["$","HP.allPresets","HP.currentPreset","HP.sim","HP.validatePreset","T","applyQLock","ch","ctx","isNum","validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.W275D_TARGET || 'beta/index.html';
const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);   // 第281便a: 走行開始時の html の領域
const OUT = process.env.W275D_OUT || path.join(ROOT, 'tests', 'out', 'shapecrit-w275d.json');
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const SMOKE = process.env.W275D_SMOKE === '1';

// **事前に決めた合格条件**(宣言値。導出ではない)
// **1 枚の RMS 半径は N 粒子の標本量**なので 1/(2√N) のゆらぎを持つ(N=240 で 3.2%)。
// したがって判定は**残差の平均(偏り)**と、**ドリフト ÷ その推定量自身のゆらぎ(z)**で行う
// —— 1 枚ごとの最大値は数として並べるだけにする(第274便d ⑥ と同じ流儀)。
const CRIT = {
  rmsRel: 0.05,      // RMS 半径の**平均残差**(宣言した定常の大きさ σ√2 に対する)
  // **門は 3σ**(2σ ではない): この器は 6 本 + 候補 8 行の **14 行**を同じ門にかけるので、
  // 2σ なら 1 行が偶然はみ出す確率が 5 割に近い。3σ にすると族全体の誤警報が 4% 程度になる
  // (**測る前に決めた宣言値**であって、落ちたから緩めたのではない)。
  driftZ: 3.0,       // RMS 半径のドリフト ÷ その推定量自身のゆらぎ
  driftAbs: 0.02,    // ドリフトが窓全体で 2% 未満なら z を問わない(**量がほぼ定数のとき z は意味を失う**)
  initK: 3.0,        // **初期配置**の RMS の残差を、その推定量のゆらぎ 1/(2√N) の何倍まで許すか
  retroFrac: 0.05,   // 角運動量が平均と逆の粒子の割合(**回転を宣言した 🥏 にだけ当てる**)
  widthRel: 0.05,    // 🧵 の横断幅(σ_n に対する平均残差)・軸半長の残差
  recovRel: 0.05,    // 摂動から戻った後の |RMS/摂動前 − 1|
  axisRatio: 0.5,    // 🥏 の σ_z/σ_R(これ以下で「扁平」と呼ぶ —— 宣言値)
};
const RUN = { dt: 0.25, T: SMOKE ? 50 : 200, nSample: SMOKE ? 5 : 20,
  recovBurnT: SMOKE ? 50 : 200, recovT: SMOKE ? 100 : 400, smoke: SMOKE };

// ---- ブラウザ(落ちたら作り直して測り直す —— 回数は JSON の retries に残す)
let browser = null, page = null;
const pageErrors = [];
const retries = [];
async function launchBrowser() {
  try { return await req('playwright').chromium.launch(); }
  catch { return await req('playwright-core').chromium.launch({ executablePath: EXE }); }
}
async function ensurePage() {
  if (page && !page.isClosed()) return page;
  try { if (browser) await browser.close(); } catch { /* 落ちている */ }
  browser = await launchBrowser();
  page = await browser.newPage();
  page.on('pageerror', (e) => pageErrors.push(String(e.message || e)));
  await page.goto('file://' + path.join(ROOT, TARGET), { waitUntil: 'load' });
  await page.waitForFunction(() => window.HP && HP.sim && HP.currentPreset());
  await injectHelpers();
  return page;
}
async function retry(label, fn, n) {
  const max = n || 3;
  for (let i = 0; i < max; i++) {
    try { await ensurePage(); return await fn(); }
    catch (e) {
      const msg = String((e && e.message) || e);
      if (i === max - 1) throw e;
      retries.push({ label, attempt: i + 1, error: msg.slice(0, 140) });
      try { if (page && !page.isClosed()) await page.close(); } catch { /* 済み */ }
      try { if (browser) await browser.close(); } catch { /* 済み */ }
      browser = null; page = null;
    }
  }
  return null;
}

async function injectHelpers() {
  await page.evaluate(() => {
    window.W = {};
    // **診断コピー**(内蔵プリセットの JSON は 1 バイトも変えない)
    W.copy = (id, patch, seed, bodyPatch) => {
      const p = JSON.parse(JSON.stringify(HP.allPresets().find((z) => z.id === id)));
      if (patch) p.physics.shapeToy = Object.assign({}, p.physics.shapeToy, patch);
      if (bodyPatch) for (const b of p.bodies) if (!b.pinned) Object.assign(b, bodyPatch);
      if (seed !== undefined && seed !== null) p.seed = seed;
      // 検証器の正準形へ落としてから配る(第274便d の sigmaZ 未定義 → NaN の教訓)
      const v = HP.validatePreset(JSON.parse(JSON.stringify(p)));
      if (!v.ok) throw new Error('validate: ' + (v.errors || []).join('|'));
      return v.preset;
    };
    W.start = (p) => { const S = HP.sim; S.build(JSON.parse(JSON.stringify(p))); W.S = S;
      return { n: S.n, decl: JSON.parse(JSON.stringify(S.params.shapeToy)) }; };
    W.go = (steps, dt) => { const S = W.S; for (let k = 0; k < steps; k++) S.step(dt); return S.t; };
    // 中心(fixed は宣言値・pinned は最初の pinned 粒子)を引いた物理座標と速度、面外 z
    W.snap = () => {
      const S = W.S, cf = S.params.shapeToy;
      let cx = cf.cx, cy = cf.cy, cvx = 0, cvy = 0;
      if (cf.center === 'pinned') {
        for (let i = 0; i < S.n; i++) {
          if (S.pinned[i]) { cx = S.x[i]; cy = S.y[i]; cvx = S.vx[i]; cvy = S.vy[i]; break; }
        }
      }
      const X = [], Y = [], VX = [], VY = [], Z = [];
      for (let i = 0; i < S.n; i++) {
        if (S.pinned[i]) continue;
        X.push(S.x[i] - cx); Y.push(S.y[i] - cy);
        VX.push(S.vx[i] - cvx); VY.push(S.vy[i] - cvy);
        Z.push(S.zLat ? S.zLat[i] * S.shapeToySigmaZ : 0);
      }
      return { t: S.t, X, Y, VX, VY, Z, sigma: S.shapeToySigma, sigmaZ: S.shapeToySigmaZ,
        len: S.shapeToyLen, branch: S.shapeToyBranch, stop: S.shapeToyStop,
        nan: S.hasNaN(), clampV: S.clampVN, clampS: S.clampSN, n: S.shapeToyN, nAll: S.n,
        ledger: Math.abs(S.shapeToyPx + S.shapeToyBathPx) + Math.abs(S.shapeToyPy + S.shapeToyBathPy)
          + Math.abs(S.shapeToyL + S.shapeToyBathL) + Math.abs(S.shapeToyE + S.shapeToyBathE) };
    };
    // 潜在の倍率摂動(物理座標だけの摂動は規定運動が次の步で上書きする —— 第274便d の否定結果)
    W.kick = (k) => {
      const S = W.S;
      for (let i = 0; i < S.n; i++) {
        S.yLat[2 * i] *= k; S.yLat[2 * i + 1] *= k; S.zLat[i] *= k;
      }
      return true;
    };
    W.latentSd = () => {                       // 初期の潜在が定常(分散 1)からどれだけ離れているか
      const S = W.S; let n = 0, s = 0, sw = 0;
      for (let i = 0; i < S.n; i++) {
        if (S.pinned[i]) continue;
        s += S.yLat[2 * i] ** 2 + S.yLat[2 * i + 1] ** 2;
        sw += S.wLat[2 * i] ** 2 + S.wLat[2 * i + 1] ** 2; n += 2;
      }
      const w2 = S.params.shapeToy.omega0 ** 2;
      return { varY: n ? s / n : null, varWOverW2: n ? sw / n / w2 : null, n };
    };
  });
}
await ensurePage();

// チャンク駆動(1 回の evaluate を短く保つ)
async function drive(steps, dt) {
  let done = 0;
  while (done < steps) {
    const k = Math.min(800, steps - done);
    await page.evaluate((a) => W.go(a.k, a.dt), { k, dt });
    done += k;
  }
}

// **ドリフトはその推定量自身のゆらぎと比べる**(第274便d ⑥ と同じ流儀)。等間隔標本の最小二乗の
// 傾き × 窓幅 の標準偏差は σ_point·√(12/n_eff) で、独立枚数 n_eff は窓幅 ÷ 緩和時間で数える。
function driftStat(ts, vs, relax) {
  const n = ts.length;
  if (n < 3) return { rel: null, z: null, sigma: null, nEff: null, pointSd: null };
  const rel = relDrift(ts, vs);
  let tm = 0, vm = 0;
  for (let i = 0; i < n; i++) { tm += ts[i]; vm += vs[i]; }
  tm /= n; vm /= n;
  let sxy = 0, sxx = 0;
  for (let i = 0; i < n; i++) { sxy += (ts[i] - tm) * (vs[i] - vm); sxx += (ts[i] - tm) ** 2; }
  const slope = sxy / sxx;
  let s2 = 0;
  for (let i = 0; i < n; i++) s2 += ((vs[i] - (vm + slope * (ts[i] - tm))) / vm) ** 2;
  const pointSd = Math.sqrt(s2 / n), span = ts[n - 1] - ts[0];
  const nEff = Math.max(2, span / Math.max(1e-9, relax));
  const sigma = pointSd * Math.sqrt(12 / nEff);
  return { rel, z: sigma > 0 ? rel / sigma : null, sigma, nEff, pointSd };
}

// ---- 1 つの宣言を T まで走らせて、決めた列だけを返す
function metricsOf(snap, shape) {
  const isArm = (shape === 'arm');
  const rms = rmsRadius(snap.X, snap.Y);
  const retro = retrograde(snap.X, snap.Y, snap.VX, snap.VY);
  const aw = axisWidth(snap.X, snap.Y);
  const sdR = meanSd(snap.X.concat(snap.Y)).sd;
  const sdZ = meanSd(snap.Z).sd;
  const curve = isArm ? [] : rotationCurve(snap.X, snap.Y, snap.VX, snap.VY, 5);
  const speeds = snap.VX.map((v, i) => Math.hypot(v, snap.VY[i]));
  return { t: snap.t, rms, retroFrac: retro.frac, retroNet: retro.net,
    width: aw.width, half: aw.half, ratio: aw.ratio,
    sdR, sdZ, axisRatio: sdR > 0 ? sdZ / sdR : null,
    vMean: meanSd(speeds).mean, vMax: Math.max(...speeds),
    sigma: snap.sigma, sigmaZ: snap.sigmaZ, len: snap.len,
    curve, curveShape: curve.length ? curveShape(curve) : null };
}

async function runCase(id, patch, note, opt) {
  const o = Object.assign({ dt: RUN.dt, T: RUN.T, nSample: RUN.nSample, seed: null, body: null },
    opt || {});
  const head = await page.evaluate((a) => W.start(W.copy(a.id, a.patch, a.seed, a.body)),
    { id, patch, seed: o.seed, body: o.body });
  const shape = head.decl.shape;
  const relax = relaxTime(head.decl.omega0, head.decl.gamma);
  const lat0 = await page.evaluate(() => W.latentSd());

  // ---- (A) **表示窓**: t=0 から T=200(= サンプルの validT)を dt=0.25 で。
  //      ここは「原仮定者が画面で見る窓」であって、定常を測る窓ではない。
  const disp = [await page.evaluate(() => W.snap())];
  const perD = Math.max(1, Math.round(o.T / o.nSample / o.dt));
  for (let k = 0; k < o.nSample; k++) {
    await drive(perD, o.dt);
    disp.push(await page.evaluate(() => W.snap()));
  }
  const dRows = disp.map((q) => metricsOf(q, shape));
  const m0 = dRows[0], mD = dRows[dRows.length - 1], last0 = disp[disp.length - 1];
  const relOf = (a, b) => (a !== null && b) ? a / b - 1 : null;
  // **宣言した定常の大きさ**(σ を固定した宣言でだけ定義できる。腕の軸方向は OU を当てていないので
  // 理論値が無く、初期配置の RMS を基準にする —— 軸方向は凍結なのでこの基準自体にゆらぎが無い)。
  const rmsTheory = (shape === 'arm') ? m0.rms : head.decl.sigma * Math.SQRT2;
  const nPart = last0.n;
  const noise = nPart > 0 ? 1 / (2 * Math.sqrt(nPart)) : null;
  // 表示窓での**落ち着きの凹み**(冷たい初期速度から定常へ入るときの過渡)。**判定には使わない**
  const dispResid = dRows.map((r) => relOf(r.rms, rmsTheory));
  const settleDip = dispResid.reduce((p, q) => (Math.abs(q) > Math.abs(p) ? q : p), 0);

  // ---- (B) **定常窓**: 緩和時間の 3 倍を馴染ませてから、max(T, 6·relax) を測る。
  //      厳密離散化なので刻みは緩和時間で取ってよい(定常分布は刻みに依らない —— 第274便d ⑤)。
  // 刻みは 2.5 で頭打ちにする(**大きすぎる刻みはエンジン側のクランプを叩く** —— 定常分布は
  // 刻みに依らないが、クランプ計数は依る。測定の都合で物理を汚さないための上限である)。
  const sDt = Math.min(2.5, Math.max(o.dt, relax / 40));
  await drive(Math.round(3 * relax / sDt), sDt);
  const stat = [await page.evaluate(() => W.snap())];
  // 窓は**緩和時間の 24 倍**(= 独立な枚数が 20 枚以上になる長さ)。短い窓では「ドリフト ÷ ゆらぎ」の
  // 独立枚数 n_eff が 1 桁になり、z が推定量として意味を失う(第275便d の実測で判明した)。
  const statT = Math.max(4 * o.T, 24 * relax);
  const perS = Math.max(1, Math.round(statT / o.nSample / sDt));
  for (let k = 0; k < o.nSample; k++) {
    await drive(perS, sDt);
    stat.push(await page.evaluate(() => W.snap()));
  }
  const sRows = stat.map((q) => metricsOf(q, shape));
  const last = stat[stat.length - 1], mN = sRows[sRows.length - 1];
  const resid = sRows.map((r) => relOf(r.rms, rmsTheory));
  const rmsRelMean = resid.reduce((p, q) => p + q, 0) / resid.length;
  const maxRmsRel = Math.max(...resid.map(Math.abs));
  const drift = driftStat(sRows.map((r) => r.t), sRows.map((r) => r.rms), relax);
  const wResid = sRows.map((r) => relOf(r.width, head.decl.sigma));
  const widthRelMean = wResid.reduce((p, q) => p + q, 0) / wResid.length;
  const retroMean = sRows.reduce((p, q) => p + q.retroFrac, 0) / sRows.length;

  // **入り乱れ**は回転を宣言した 🥏 にだけ当てる条件である(🔮 も 🧵 も回さないので L_z の符号は
  // 半々になる —— 数は全部の行に載せるが、判定には使わない)。
  const ok = {
    // 初期配置の RMS は**1 枚の標本量**なので、ゆらぎ 1/(2√N) の 3 倍を門にする
    init: noise !== null && Math.abs(relOf(m0.rms, rmsTheory)) <= CRIT.initK * noise,
    rms: Math.abs(rmsRelMean) <= CRIT.rmsRel,
    drift: drift.rel !== null
      && (Math.abs(drift.rel) <= CRIT.driftAbs
        || (drift.z !== null && Math.abs(drift.z) <= CRIT.driftZ)),
    finite: last.nan === false && last.clampV === 0 && last.clampS === 0 && last.stop === null,
    ledger: last.ledger === 0,
  };
  if (shape === 'disk') {
    ok.retro = retroMean <= CRIT.retroFrac;
    ok.flat = mN.axisRatio !== null && mN.axisRatio <= CRIT.axisRatio;
  }
  if (shape === 'arm') {
    ok.width = Math.abs(widthRelMean) <= CRIT.widthRel;
    ok.half = Math.abs(relOf(mN.half, m0.half)) <= CRIT.widthRel;
  }
  return { id, note, shape, decl: head.decl, seed: o.seed, nAll: last.nAll, nToy: last.n,
    branch: last.branch, relax, statDt: sDt, statT,
    spinRatio: head.decl.shape === 'disk'
      ? Math.abs(head.decl.omegaSpin) / head.decl.omega0 : null,
    latentInit: lat0,
    rms0: m0.rms, rmsTheory, rmsInitRel: relOf(m0.rms, rmsTheory),
    // 表示窓(判定には使わない)
    settleDip, rmsRelDisplayEnd: relOf(mD.rms, rmsTheory),
    retroFracDisplayEnd: mD.retroFrac, axisRatioDisplayEnd: mD.axisRatio,
    displaySeries: dRows.map((r) => ({ t: +r.t.toFixed(2), rms: +r.rms.toFixed(4),
      rel: +relOf(r.rms, rmsTheory).toFixed(5),
      retro: r.retroFrac === null ? null : +r.retroFrac.toFixed(4) })),
    // 定常窓(判定に使う)
    rmsEnd: mN.rms, rmsRelEnd: relOf(mN.rms, rmsTheory),
    rmsRelMean, rmsRelMax: maxRmsRel, samplingNoise: noise,
    rmsDrift: drift.rel, rmsDriftZ: drift.z, rmsDriftSigma: drift.sigma, rmsDriftNEff: drift.nEff,
    retroFracEnd: mN.retroFrac, retroFracMean: retroMean, retroNetEnd: mN.retroNet,
    width0: m0.width, widthEnd: mN.width, widthTheory: head.decl.sigma,
    widthRel: relOf(mN.width, m0.width), widthRelMean,
    half0: m0.half, halfEnd: mN.half, halfRel: relOf(mN.half, m0.half), barRatioEnd: mN.ratio,
    axisRatio0: m0.axisRatio, axisRatioEnd: mN.axisRatio,
    vMeanEnd: mN.vMean, vMaxEnd: mN.vMax,
    sigmaEnd: mN.sigma, sigmaZEnd: mN.sigmaZ, lenEnd: mN.len,
    curveEnd: mN.curve, curveShapeEnd: mN.curveShape,
    statSeries: sRows.map((r) => ({ t: +r.t.toFixed(2), rms: +r.rms.toFixed(4),
      retro: r.retroFrac === null ? null : +r.retroFrac.toFixed(4),
      width: +r.width.toFixed(4), axisRatio: r.axisRatio === null ? null : +r.axisRatio.toFixed(4) })),
    nan: last.nan, clampV: last.clampV, clampS: last.clampS, stop: last.stop, ledger: last.ledger,
    ok, pass: Object.values(ok).every(Boolean) };
}

// ================= (e) 候補の比較(**実測して決める**)=================
// 🔮 と 🥏 は「成長を止めて σ を**初期配置の RMS に一致する値**へ置く」ことが出発点である
// (面内一様円盤 r=R√u の ⟨r²⟩=R²/2 と、2D 正規分布の ⟨r²⟩=2σ² が一致するのは σ=R/2。
//  🔮 は R=72 → σ=36、🥏 は R=88 → σ_R=44。**第274便d の σ₀ はこの値だった**)。
// 🥏 の「入り乱れ」は Ω/ω₀ の比で決まるので、比だけを変えた 3 案を並べる。
// 🧵 は箱 h=25 の横断 RMS が 25/√12=7.2169 なので σ_n=7.2(第274便d の σ₀)で幅が保たれる。
const RANDOM1 = { vMode: 'random', vScale: 1, direction: 1 };   // 第274便d の初期速度(乱数向き)
const BOX1 = { vScale: 1 };                                      // 🧵 の箱の初期速度(第274便d)
const RIGID05 = { vMode: 'rigid', vScale: 0.5, direction: 1 };   // 剛体回転 ω=Ω=0.5
// **候補は本便の既定(内蔵の宣言)に対する差分**として書く。第274便d の既定は「対照」として
// 宣言ごと戻した行で並べる(成長あり・初期速度も当時のもの)。
const CAND = [
  ['shapeToyCluster', { tauGrow: 25, sigma: 90, sigmaZ: 90, sigma0: 36 }, RANDOM1,
    '**第274便d の既定**(成長あり σ 36→90・τ=25・vMode random)—— 対照'],
  ['shapeToyCluster', null, null,
    '**採った案 C1**(本便の既定): τ=0・σ=σ₀=36・ω₀=0.10/γ=0.25(過減衰・緩和 20)'],
  ['shapeToyCluster', { omega0: 0.03, gamma: 0.08 }, null,
    '案 C2: ω₀=0.03/γ=0.08(過減衰・緩和 73.8・速度分散 1/3)'],
  ['shapeToyCluster', { omega0: 0.03, gamma: 0.06 }, null,
    '案 C3: ω₀=0.03/γ=0.06(**臨界**・緩和 33.3)'],
  ['shapeToyCluster', { omega0: 0.03, gamma: 0.03 }, null,
    '案 C4: ω₀=0.03/γ=0.03(**不足減衰**・緩和 66.7)'],
  ['shapeToyDisk', { tauGrow: 25, sigma: 110, sigmaZ: 35, sigma0: 44, omega0: 0.10, gamma: 0.08 },
    RANDOM1, '**第274便d の既定**(成長あり σ_R 44→110・Ω/ω₀=0.5)—— 対照'],
  ['shapeToyDisk', { omega0: 0.10, gamma: 0.08 }, null,
    '案 D1: ω₀=0.10/γ=0.08 据え置き(**Ω/ω₀=0.5** —— 入り乱れの対照)'],
  ['shapeToyDisk', { omega0: 0.01, gamma: 0.03 }, null,
    '案 D2: ω₀=0.01/γ=0.03(過減衰・Ω/ω₀=5・緩和 261.8)'],
  ['shapeToyDisk', null, null,
    '**採った案 D3**(本便の既定): ω₀=0.01/γ=0.02(**臨界**・Ω/ω₀=5・緩和 100)'],
  ['shapeToyDisk', { omega0: 0.004, gamma: 0.02 }, null,
    '案 D4: ω₀=0.004/γ=0.02(過減衰・Ω/ω₀=12.5・緩和 1197.8)'],
  ['shapeToyDisk', { omega0: 0.10, gamma: 0.20, omegaSpin: 0.5 }, RIGID05,
    '案 D5(**逆向きの道**): ω₀=0.10/γ=0.20(臨界)+ Ω=0.5(Ω/ω₀=5 を Ω 側で作る)'],
  ['shapeToyArm', { tauGrow: 25, sigma: 18, sigmaZ: 12, sigma0: 7.2, armLength: 380, armLength0: 120 },
    BOX1, '**第274便d の既定**(成長あり σ_n 7.2→18・L 120→380)—— 対照'],
  ['shapeToyArm', null, null,
    '**採った案 A1**(本便の既定): τ=0・σ_n=σ₀=7.2・σ_z=4.8・L=120 固定・ω₀=0.12/γ=0.24(臨界)'],
  ['shapeToyArm', { omega0: 0.04, gamma: 0.08 }, null,
    '案 A2: ω₀=0.04/γ=0.08(臨界・緩和 25 —— 横断の揺れを遅くする)'],
];
const candidates = [];
for (const [id, patch, body, note] of CAND) {
  candidates.push(await retry('cand:' + id + ':' + note.slice(0, 8),
    () => runCase(id, patch, note, { body })));
}

// ================= 内蔵の実測(宣言そのもの)=================
// **第276便d 以降**: `physics.shapeToy.law:"coreField"` を宣言した本は**この器の対象ではない**
// (この器は OU 法則〔規定運動〕の量 —— 潜在の共分散・写像の σ・帳簿 —— を測る作りである)。
// 除外した id は `excludedCoreField` に残す(**黙って落とさない**)。Core 力学の完成門は
// 第276便d の器 `tests/exp-w276d-corefield.mjs` が測り、正本は `tests/out/corefield-w276d.json` である。
const ALL_DECL = await page.evaluate(() => HP.allPresets()
  .filter((z) => z.physics && z.physics.shapeToy)
  .map((z) => ({ id: z.id, law: z.physics.shapeToy.law || 'prescribed' })));
const EXCLUDED = ALL_DECL.filter((z) => z.law === 'coreField').map((z) => z.id);
const IDS = ALL_DECL.filter((z) => z.law !== 'coreField').map((z) => z.id);
const builtins = [];
for (const id of IDS) {
  builtins.push(await retry('builtin:' + id, () => runCase(id, null, '内蔵の宣言そのもの', {})));
}

// ================= (d) 摂動からの回復 =================
async function recover(id, k, seed) {
  const head = await page.evaluate((a) => W.start(W.copy(a.id, null, a.seed)), { id, seed });
  // **窓は緩和時間で決める**(宣言 ω₀・γ からの導出値。厳密離散化なので刻みも緩和時間で取る)
  const relax = relaxTime(head.decl.omega0, head.decl.gamma);
  const dt = Math.min(50, Math.max(RUN.dt, relax / 40));
  const burnT = Math.max(RUN.recovBurnT, 4 * relax), measT = Math.max(RUN.recovT, 6 * relax);
  await drive(Math.round(burnT / dt), dt);
  const before = await page.evaluate(() => W.snap());
  await page.evaluate((a) => W.kick(a.k), { k });
  await page.evaluate((a) => W.go(1, a.dt), { dt });
  const after = await page.evaluate(() => W.snap());
  const rows = [];
  const per = Math.max(1, Math.round(measT / 10 / dt));
  for (let i = 0; i < 10; i++) { await drive(per, dt); rows.push(await page.evaluate(() => W.snap())); }
  const r0 = rmsRadius(before.X, before.Y), r1 = rmsRadius(after.X, after.Y);
  const tail = rows.slice(-5).map((s) => rmsRadius(s.X, s.Y));
  const end = tail.reduce((p, q) => p + q, 0) / tail.length;
  const last = rows[rows.length - 1];
  // **戻り先は「摂動前の 1 枚」ではなく「宣言した定常の大きさ」**で測る(1 枚の RMS は 1/(2√N) の
  // ゆらぎを持つので、それを分母にすると門がゆらぎに負ける —— 第274便d ⑥ と同じ理由)。
  const theory = (head.decl.shape === 'arm') ? r0 : head.decl.sigma * Math.SQRT2;
  return { id, k, seed, relax, dt, burnT, measT, rmsTheory: theory,
    rmsBefore: r0, beforeRel: r0 / theory - 1, rmsAfterKick: r1, kickRel: r1 / r0 - 1,
    rmsEnd: end, endRel: end / theory - 1, endRelVsBefore: end / r0 - 1, tailN: tail.length,
    nan: last.nan, stop: last.stop,
    pass: Math.abs(end / theory - 1) <= CRIT.recovRel && last.nan === false && last.stop === null };
}
const recovery = [];
for (const id of IDS) {
  for (const k of (SMOKE ? [1.10] : [1.05, 1.10])) {
    for (const seed of (SMOKE ? [20260920] : [20260920, 20260921, 20260922])) {
      recovery.push(await retry(`recover:${id}:${k}:${seed}`, () => recover(id, k, seed)));
    }
  }
}

// ================= 重力の対照(規定運動なら 1 bit も動かない)=================
const gravity = [];
for (const id of IDS) {
  const runs = await retry('gravity:' + id, () => page.evaluate((a) => {
    const fp = (S) => { let h = 0x811c9dc5;
      const buf = new ArrayBuffer(8), f = new Float64Array(buf), u = new Uint8Array(buf);
      const push = (v) => { f[0] = v; for (let b = 0; b < 8; b++) { h ^= u[b]; h = Math.imul(h, 0x01000193) >>> 0; } };
      for (const k of ['x', 'y', 'vx', 'vy']) for (let i = 0; i < S.n; i++) push(S[k][i]);
      return h.toString(16); };
    const out = [];
    for (const G of [0, 0.8, 8]) {
      const p = W.copy(a.id, null, null);
      p.physics.G = G;
      const S = HP.sim; S.build(JSON.parse(JSON.stringify(p)));
      for (let k = 0; k < 600; k++) S.step(0.016);
      out.push({ G, fp: fp(S), nan: S.hasNaN(), stop: S.shapeToyStop });
    }
    return out;
  }, { id }));
  gravity.push({ id, runs, same: runs.every((q) => q.fp === runs[0].fp) });
}

// ============ 中心天体の質量は効いているか(**実測して決める** —— 中心天体版の m/r の根拠)============
// 中心天体は `center:"pinned"` の**位置固定の参照点**である。G=0・対象粒子は規定運動なので、
// 中心天体の質量は対象粒子の状態に入らないはずである —— **はずである、ではなく測る**。
// 半径は `insideBig` の排他帯(radius+1)に入るので**配置を変える**(質量とは別の列にする)。
const centerMass = [];
for (const id of IDS) {
  const decl = await page.evaluate((a) => W.copy(a.id, null, null).physics.shapeToy, { id });
  if (decl.center !== 'pinned') continue;
  const runs = await retry('centerMass:' + id, () => page.evaluate((a) => {
    const fp = (S) => { let h = 0x811c9dc5;
      const buf = new ArrayBuffer(8), f = new Float64Array(buf), u = new Uint8Array(buf);
      const push = (v) => { f[0] = v; for (let b = 0; b < 8; b++) { h ^= u[b]; h = Math.imul(h, 0x01000193) >>> 0; } };
      for (const k of ['x', 'y', 'vx', 'vy']) for (let i = 1; i < S.n; i++) push(S[k][i]);
      return h.toString(16); };
    const out = [];
    for (const c of [{ m: 10, r: 5 }, { m: 100, r: 5 }, { m: 1000, r: 5 }, { m: 10, r: 20 }]) {
      const p = W.copy(a.id, null, null);
      p.bodies[0].m = c.m; p.bodies[0].radius = c.r;
      const S = HP.sim; S.build(JSON.parse(JSON.stringify(p)));
      for (let k = 0; k < 600; k++) S.step(0.016);
      out.push({ m: c.m, radius: c.r, fp: fp(S), n: S.n, stop: S.shapeToyStop, nan: S.hasNaN() });
    }
    return out;
  }, { id }));
  const base = runs[0].fp;
  centerMass.push({ id, runs,
    massSame: runs.filter((q) => q.radius === 5).every((q) => q.fp === base),
    radiusChanges: runs.find((q) => q.radius === 20).fp !== base });
}

// ================= 出力 =================
const summary = {
  builtins: builtins.map((r) => ({ id: r.id, shape: r.shape, pass: r.pass, ok: r.ok,
    rmsRelMean: r.rmsRelMean, rmsDriftZ: r.rmsDriftZ, samplingNoise: r.samplingNoise,
    retroFracEnd: r.retroFracEnd, axisRatioEnd: r.axisRatioEnd })),
  candidatesChosen: builtins.map((r) => r.id),
  recoveryAllPass: recovery.every((r) => r.pass),
  gravityBitSame: gravity.every((r) => r.same),
  centerMassInert: centerMass.every((r) => r.massSame),
  excludedCoreField: EXCLUDED,
  rigidRotationOnly: builtins.filter((r) => r.shape === 'disk')
    .map((r) => ({ id: r.id, omegaSpread: r.curveShapeEnd && r.curveShapeEnd.omegaSpread,
      vtSpread: r.curveShapeEnd && r.curveShapeEnd.vtSpread })),
};
const out = {
  meta: provenanceMeta({
    wave: '第275便d(第65報・安定サンプル 2)', root: ROOT, target: TARGET,
    inputs: [TARGET],
    code: ['tests/exp-w275d-shapecrit.mjs', 'tests/lib-w275d-shapecrit.mjs',
      'tests/lib-w272e-provenance.mjs'],
  }),
  section: '形状トイの安定・低分散・銀河らしさの判定(第65報 (4)(5)(6))',
  notCalibration: '**較正ではない**。観測された星団・銀河・渦状腕の量を 1 つも入力していない。'
    + '「銀河が安定した」「腕が創発した」とは書かない —— **指定した形状を定常分布に持つ参照モデル**の数である。',
  prescribedNote: '対象粒子は**規定運動**であり、重力はこの粒子の状態を決めない(G を変えても指紋が同じ)。'
    + '中心天体版の中心は `center:"pinned"` の**位置固定の参照**であって、**動的モデルではない**。',
  criteria: CRIT, run: RUN,
  excludedCoreField: EXCLUDED,
  excludedNote: '第276便d で `physics.shapeToy.law:"coreField"` を宣言した本は**この器の対象外**である'
    + '(この器は OU 法則〔規定運動〕の量を測る作りで、Core 力学の完成門は tests/exp-w276d-corefield.mjs が測る)。',
  candidates, builtins, recovery, gravityControl: gravity, centerMass,
  summary, retries, pageErrors,
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));   // 第281便a: 領域 hash の 3 欄 + JSON 入力の安定 hash
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
await browser.close();
console.log('wrote', OUT);
console.log(JSON.stringify(summary, null, 1));
if (pageErrors.length) { console.error('pageErrors', pageErrors.slice(0, 3)); process.exit(1); }

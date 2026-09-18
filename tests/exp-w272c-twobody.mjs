// 第272便c §2「**2 天体思考実験** —— メッシュ応答の実測」の器である。
//
// ■ **原仮定者の仮説(第62報)**の文(公開成果物の書き方)
//   「宇宙に同じ重さの 2 天体しか無いとき、1 つが動くと、距離が変われば空間メッシュが拡縮し、
//    距離が変わらない方向に動けばメッシュが他方を中心に回転して、他方が逆方向に自転したのと
//    同じ状態になる」。**本器はこの文を測れる形にしただけである**(正しさの主張ではない)。
//
// ■ 測るもの
//   §A 場の応答(`HP.dfmField` —— エンジンと同じ純関数):同質量 2 体で片方 A に
//      (a) **径方向**(距離が変わる)・(b) **接線方向**(距離が変わらない)の微小変位を与え、
//      相手 B の位置での ∇u を **拡縮 H=½tr(∇u)** と **回転 Ω=½(∂ₓu_y−∂_yu_x)** と
//      **伸縮(対称トレースレス)** に分解する。**D₀=0 の極限と現行 D₀ の 2 条件**で並べる。
//      自己除外(B を源から外す = E6′ が B に当てる場)と、全源(表示のメッシュ)の 2 列を出す。
//   §B 「他方の見かけの逆自転」: Ω を**相手中心の回転座標での相対角**として書き、
//      剛体回転 Ω_rigid=v_t/r と比べる。**せん断が同時に立つかどうかも数で出す**。
//   §C 帳簿(エンジン走行): 変位を**初期条件の変更**として記帳し、
//      全運動量・全角運動量・各天体の自転 spin が走行の前後でどう動くかを測る。
//      **メッシュが回ったこと自体は物理的な自転 J を変えない**(トルクが要る)ことを数で分ける。
//   §D 合体極限: 総 J = J_A + J_B + μ r×v を**内部項と軌道項に分けて**数で出す(遠方近似)。
//
// ■ この器が**言わないこと**
//   「潮汐ロックを証明した」「引きずり式が確定した」「観測と合った」。
//   §A の Ω は**相対座標の量**であって自転ではない。**2D では面外の自転軸を持てない。**
//
// ■ 触らないもの
//   `beta/index.html` は**読むだけ**。内蔵プリセットは 1 bit も動かさない(🪟 の診断コピーだけ)。
//
// 実行: PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w272c-twobody.mjs
// 出力: tests/out/twobody-w272c.json
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { meshFlowGrad, decomposeGrad, apparentCounterSpin } from './lib-w272c-binlock.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'twobody-w272c.json');
const HARNESS_VERSION = 'w272c-twobody-1';
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const NSTEP = Number(arg('--steps', 200000));

const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');

const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
const pg = await browser.newPage();
const pageErrors = [];
pg.on('pageerror', (e) => pageErrors.push(String(e.message || e)));
await pg.goto(INDEX, { waitUntil: 'load' });
await pg.waitForFunction(() => window.HP && HP.sim && typeof HP.dfmField === 'function');

const R = { meta: { wave: '第272便c', section: '2 天体思考実験(メッシュ応答)',
  harness: HARNESS_VERSION, target: TARGET, targetSha256: sha(path.join(ROOT, TARGET)),
  libSha256: sha(path.join(ROOT, 'tests', 'lib-w272c-binlock.mjs')),
  at: new Date().toISOString(), steps: NSTEP,
  hypothesis: '**原仮定者の仮説(第62報)**を測れる形にしただけである(正しさの主張ではない)。',
  decomposition: '∇u = H·I + Ω·ε + 伸縮(対称トレースレス)。'
    + 'H=½(∂ₓu_x+∂_yu_y) が拡縮・Ω=½(∂ₓu_y−∂_yu_x) が回転。',
  claim: '**Ω は相対座標の量であって自転ではない。** 物理的な自転 J を変えるにはトルクが要る。'
    + '**2D では面外の自転軸を持てない。**',
  touched: '内蔵プリセットは 1 bit も動かしていない(🪟 の診断コピーだけ)。' } };

// ---------------- §A 場の応答
console.error('§A 場の応答');
R.fieldResponse = await pg.evaluate(() => {
  const G = 6.674, EPS = 0.05, PW = 2, MM = 500, SEP = 240, V = 1e-3;
  const qA = [-SEP / 2, 0], qB = [SEP / 2, 0];
  const nHat = [1, 0], tHat = [0, 1];        // n̂ は A→B、t̂ はそれに直交
  const rows = [];
  const grad = (bodies, x, y, opts) => HP.dfmField(bodies, x, y, opts);
  for (const D0 of [0, 1e-12, 1e-4, 1e-2, 1]) {
    for (const dir of ['radial', 'tangential']) {
      for (const exclude of [true, false]) {
        const vA = (dir === 'radial') ? [V * nHat[0], V * nHat[1]] : [V * tHat[0], V * tHat[1]];
        const bodies = [{ id: 0, m: MM, x: qA[0], y: qA[1], vx: vA[0], vy: vA[1], ax: 0, ay: 0 },
          { id: 1, m: MM, x: qB[0], y: qB[1], vx: 0, vy: 0, ax: 0, ay: 0 }];
        const o = { G, eps: EPS, p: PW, D0, lawVersion: 'scalar', need: 'all' };
        if (exclude) o.excludeBodyId = 1;
        const f = grad(bodies, qB[0], qB[1], o);
        if (!f || !f.gradU) { rows.push({ D0, dir, exclude, stop: 'noField' }); continue; }
        const B = f.gradU;   // [∂ₓu_x, ∂_yu_x, ∂ₓu_y, ∂_yu_y](行優先)
        const H = 0.5 * (B[0] + B[3]);
        const Om = 0.5 * (B[2] - B[1]);
        const sxx = B[0] - H, sxy = 0.5 * (B[1] + B[2]);
        const shear = Math.hypot(sxx, sxy);
        rows.push({ D0, dir, exclude, chi: f.chi, u: f.u ? f.u.slice() : null, gradU: B.slice(),
          expansion: H, rotation: Om, shearMagnitude: shear,
          omegaRigid: (dir === 'tangential') ? V / SEP : 0,
          rotationOverRigid: (dir === 'tangential' && SEP > 0) ? Om / (V / SEP) : null,
          shearOverRotation: (Math.abs(Om) > 0) ? shear / Math.abs(Om) : null,
          expansionOverRadialRate: (dir === 'radial') ? H / (V / SEP) : null,
          // **独立に導いた応答係数**: u=χ(x)·v_A(自己除外・源 1 個)なので ∇u=v_A⊗∇χ は**階数 1** で、
          //   ∂_rχ = −(p/r)·χ(1−χ)(軟化を無視した極限)→ H/(v_r/r) も Ω/(v_t/r) も **−(p/2)χ(1−χ)**。
          //   **階数 1 だから、回転と同じ大きさのせん断が必ず同時に立つ**(剛体回転ではない)。
          predictedCoefficient: -(PW / 2) * f.chi * (1 - f.chi),
          uQuantity: f.uQuantity });
      }
    }
  }
  for (const z of rows) {
    if (z.stop) continue;
    const meas = (z.dir === 'radial') ? z.expansionOverRadialRate : z.rotationOverRigid;
    z.measuredCoefficient = meas;
    z.coefficientRelDiff = (z.exclude && Math.abs(z.predictedCoefficient) > 0 && meas !== null)
      ? Math.abs(meas - z.predictedCoefficient) / Math.abs(z.predictedCoefficient) : null;
  }
  return { params: { G, eps: EPS, p: PW, m: MM, separation: SEP, perturbationSpeed: V },
    definition: 'B の位置での ∇u。excludeBodyId:1 は「E6′ が B に当てる自己除外の場」、'
      + 'false は「表示のメッシュ(全源)」である。',
    coefficientLaw: '自己除外(源 1 個)では ∇u=v_A⊗∇χ が**階数 1** で、'
      + '**H/(v_r/r) も Ω/(v_t/r) も −(p/2)·χ(1−χ)**(軟化を無視した極限)。'
      + '**χ→1(D₀→0)でも χ→0(D₀→∞)でも 0 に落ち、χ=1/2 で最大 p/4** である。'
      + '**階数 1 なので、回転と同じ大きさのせん断が必ず同時に立つ**(剛体回転ではない)。',
    rows };
});
for (const z of R.fieldResponse.rows) {
  console.error(`  D0=${z.D0} ${z.dir}${z.exclude ? '/自己除外' : '/全源'}: `
    + `H=${z.expansion === undefined ? '—' : z.expansion.toExponential(4)} `
    + `Ω=${z.rotation === undefined ? '—' : z.rotation.toExponential(4)} `
    + `せん断=${z.shearMagnitude === undefined ? '—' : z.shearMagnitude.toExponential(4)} χ=${z.chi}`);
}

// ---- 独立計算(lib の純関数 —— 実装の写しではない)で同じ量を出す
{
  const P = R.fieldResponse.params;
  const rows = [];
  for (const z of R.fieldResponse.rows) {
    if (z.stop) continue;
    const vA = (z.dir === 'radial') ? [P.perturbationSpeed, 0] : [0, P.perturbationSpeed];
    const bodies = [{ m: P.m, x: -P.separation / 2, y: 0, vx: vA[0], vy: vA[1] }];
    if (!z.exclude) bodies.push({ m: P.m, x: P.separation / 2, y: 0, vx: 0, vy: 0 });
    const g = meshFlowGrad(bodies, P.separation / 2, 0,
      { eps: P.eps, p: P.p, D0: z.D0, eta: 1, h: 1e-3 });
    if (!g) { rows.push({ ...z, libStop: 'null' }); continue; }
    const relH = (Math.abs(z.expansion) > 0) ? Math.abs(g.expansion - z.expansion) / Math.abs(z.expansion) : null;
    const relO = (Math.abs(z.rotation) > 0) ? Math.abs(g.rotation - z.rotation) / Math.abs(z.rotation) : null;
    rows.push({ D0: z.D0, dir: z.dir, exclude: z.exclude,
      libExpansion: g.expansion, libRotation: g.rotation,
      libShear: Math.hypot(g.strain.xx, g.strain.xy),
      relDiffExpansion: relH, relDiffRotation: relO });
  }
  R.fieldResponseCrossCheck = { rows,
    note: '**lib-w272c-binlock は独立計算**(中心差分 h=1e-3)であって実装の写しではない。'
      + '差は中心差分の刻みぶんである。' };
}

// ---------------- §B 見かけの逆自転
{
  const rows = [];
  for (const z of R.fieldResponse.rows) {
    if (z.stop || z.dir !== 'tangential') continue;
    rows.push({ D0: z.D0, exclude: z.exclude,
      ...apparentCounterSpin(z.rotation, 0),
      omegaRigid: z.omegaRigid, rotationOverRigid: z.rotationOverRigid,
      shearOverRotation: z.shearOverRotation });
  }
  R.apparentCounterSpin = { rows,
    note: '**B は自転していない**(ω_B=0)。メッシュが Ω で回るので、メッシュ座標では B が −Ω で'
      + '自転しているように見える —— **これは相対座標の記述であって、B の J は変わっていない**。'
      + 'せん断/回転の比が 0 でなければ、メッシュは B のまわりを**剛体回転していない**。' };
}

// ---------------- §C 帳簿(エンジン走行)
console.error('§C 帳簿(エンジン走行)');
R.ledger = await pg.evaluate(async ({ nstep }) => {
  const src = HP.allPresets().find((q) => q.id === 'spaceMeshBinaryToy');
  if (!src) return { stop: 'noPreset' };
  // **円軌道の 2 体**を基準にする(静止 2 体は落下して接触するので帳簿が接触則に汚れる)。
  // 変位は**初期条件の変更**として記帳し、速度は基準のまま(= 走行中に外から押していない)。
  const mk = (D0, mode, delta, kFrame) => {
    const p = JSON.parse(JSON.stringify(src));
    p.id = 'w272cTwoBody';
    const SEP = 240, MM = 500;
    const G = p.physics.G;
    const vRel = Math.sqrt(G * (2 * MM) / SEP), vEach = vRel / 2;
    let ax = -SEP / 2, ay = 0;
    if (mode === 'radial') ax = -SEP / 2 - delta;                    // 距離が変わる
    if (mode === 'tangential') {                                      // 距離が変わらない(B を中心に回す)
      const th = delta / SEP, cx = SEP / 2;
      const dx = -SEP, dy = 0;
      ax = cx + dx * Math.cos(th) - dy * Math.sin(th);
      ay = 0 + dx * Math.sin(th) + dy * Math.cos(th);
    }
    p.bodies = [
      { ...p.bodies[0], m: MM, x: ax, y: ay, vx: 0, vy: -vEach, spin: 0 },
      { ...p.bodies[1], m: MM, x: SEP / 2, y: 0, vx: 0, vy: vEach, spin: 0 },
    ];
    p.physics = { ...p.physics, D0pull: D0, kFrame: (kFrame === undefined) ? 1 : kFrame };
    const v = HP.validatePreset(p);
    return v.ok ? v.preset : { __errors: v.errors };
  };
  const tally = (S) => {
    let px = 0, py = 0, L = 0, Ls = 0, E = 0;
    for (let i = 0; i < S.n; i++) {
      px += S.mEff[i] * S.vx[i]; py += S.mEff[i] * S.vy[i];
      L += S.mEff[i] * (S.x[i] * S.vy[i] - S.y[i] * S.vx[i]);
      Ls += (S.spin ? (S.spin[i] || 0) : 0);
      E += 0.5 * S.mEff[i] * (S.vx[i] * S.vx[i] + S.vy[i] * S.vy[i]);
    }
    return { px, py, L, spinSum: Ls, spins: Array.from({ length: S.n }, (_, i) => (S.spin ? S.spin[i] : 0)),
      kinetic: E, sep: Math.hypot(S.x[1] - S.x[0], S.y[1] - S.y[0]),
      angle: Math.atan2(S.y[0] - S.y[1], S.x[0] - S.x[1]) };
  };
  const rows = [];
  for (const kFrame of [1, 0]) {
  for (const D0 of [0, 1e-4]) {
    for (const mode of ['none', 'radial', 'tangential']) {
      const P = mk(D0, mode, 1.0, kFrame);
      if (P.__errors) { rows.push({ kFrame, D0, mode, stop: 'invalid', errors: P.__errors }); continue; }
      HP.sim.build(P);
      const S = HP.sim;
      const t0 = tally(S);
      // メッシュの回転角の積分(B の位置での Ω を步ごとに足す —— **相対座標の量**)
      let meshAngle = 0;
      const dt = 0.004;
      const sample = [];
      for (let k = 0; k < nstep; k++) {
        if ((k % 2000) === 0) {
          const bodies = [{ id: 0, m: S.mEff[0], x: S.x[0], y: S.y[0], vx: S.vx[0], vy: S.vy[0], ax: 0, ay: 0 },
            { id: 1, m: S.mEff[1], x: S.x[1], y: S.y[1], vx: S.vx[1], vy: S.vy[1], ax: 0, ay: 0 }];
          const f = HP.dfmField(bodies, S.x[1], S.y[1], { G: S.params.G, eps: S.params.softening,
            p: 2, D0: (S.params.D0pull !== undefined) ? S.params.D0pull : S.params.D0,
            lawVersion: 'scalar', need: 'all', excludeBodyId: 1 });
          const om = (f && f.gradU) ? 0.5 * (f.gradU[2] - f.gradU[1]) : 0;
          meshAngle += om * dt * 2000;
          if (sample.length < 6) sample.push({ k, sep: Math.hypot(S.x[1] - S.x[0], S.y[1] - S.y[0]), omega: om });
        }
        S.step(dt);
        if (S.hasNaN()) break;
      }
      const t1 = tally(S);
      rows.push({ kFrame, D0, mode, steps: nstep, dt, t0, t1,
        dP: [t1.px - t0.px, t1.py - t0.py], dL: t1.L - t0.L,
        dSpin: t1.spins.map((z, i) => z - t0.spins[i]),
        meshAngleIntegrated: meshAngle, sample,
        clamp: (S.clampVN || 0) + (S.clampSN || 0) + (S.clampHN || 0) + (S.clampRN || 0) + (S.clampTN || 0),
        nan: S.hasNaN(),
        resP: [S.resPx || 0, S.resPy || 0], resL: S.resL || 0 });
    }
  }
  }
  return { rows, note: '変位は**初期条件の変更**として記帳した(走行中に外から押していない)。'
    + '基準は**円軌道の 2 体**である(静止 2 体は落下して接触するので帳簿が接触則に汚れる)。'
    + '**kFrame=0 の対照**では引きずりチャネルが無いので、メッシュの Ω(運動学)が立っていても'
    + '自転 spin は動かない —— 「メッシュが回ったこと」と「J が変わったこと」を分ける列である。' };
}, { nstep: NSTEP });
for (const z of (R.ledger.rows || [])) {
  console.error(`  kF=${z.kFrame} D0=${z.D0} ${z.mode}: ΔP=${z.dP ? z.dP.map((q) => q.toExponential(2)).join(',') : '—'} `
    + `ΔL=${z.dL === undefined ? '—' : z.dL.toExponential(3)} `
    + `Δspin=${z.dSpin ? z.dSpin.map((q) => q.toExponential(2)).join(',') : '—'} `
    + `メッシュ積分角=${z.meshAngleIntegrated === undefined ? '—' : z.meshAngleIntegrated.toExponential(3)}`);
}

// ---------------- §D 合体極限の角運動量の分解
console.error('§D 合体極限');
R.mergerLimit = await pg.evaluate(() => {
  // 総角運動量(遠方から見た値)= J_A + J_B + μ r×v。
  // **内部の引きずり(k_int)を 0 にしても、軌道項 μ r×v は外に残る**ことを数で分ける。
  const G = 6.674, MM = 500, SEP = 240;
  const M = 2 * MM, mu = MM * MM / M;
  const rows = [];
  for (const sep of [240, 24, 2.4, 0.24]) {
    const vCirc = Math.sqrt(G * M / sep);           // 相対速度(円軌道)
    const Lorb = mu * sep * vCirc;                   // μ r×v
    // 潮汐ロック(同期)なら内部の自転角速度は公転角速度に等しい: ω=v/r
    const om = vCirc / sep;
    const Rb = 1;                                     // 🪟 の半径宣言(玩具)
    const Ispin = 0.4 * MM * Rb * Rb;                 // 一様球の 2/5 m R²(2D 表示だが**宣言**として置く)
    const Jspin = 2 * Ispin * om;
    rows.push({ sep, vRel: vCirc, omegaOrbit: om, Lorbital: Lorb, Jspin,
      spinOverOrbital: Lorb > 0 ? Jspin / Lorb : null, total: Lorb + Jspin });
  }
  return { params: { G, m: MM, M, mu, R: 1, inertiaLaw: '2/5 m R²(**宣言**であって測定ではない)' }, rows,
    note: '**k_int=0(内部の引きずりを切る)は軌道角運動量 μ r×v を消さない。** '
      + '接近するほど Ω が上がるので自転項は増えるが、この玩具の半径宣言では軌道項が支配する。'
      + '**これは遠方近似の会計であって、合体の力学を解いたものではない。**' };
});
for (const z of R.mergerLimit.rows) {
  console.error(`  r=${z.sep}: L_orb=${z.Lorbital.toExponential(4)} J_spin=${z.Jspin.toExponential(4)} `
    + `比=${z.spinOverOrbital.toExponential(3)}`);
}

R.pageErrors = pageErrors;
await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
console.error('[w272c-twobody] wrote ' + OUT);

// 第277便d(統括の読み R52)— **背景 ON/OFF の誤差予算**(純関数の 2 体積分・**エンジンではない**)。
//
// ■ 何を測るか
//   R52: 「『背景複素場は軌道範囲でほぼ一様』と『その力学効果は小さい』は**別**。背景と局所源の
//   全速度を**同じ共動系へ移し**、背景 ON/OFF の軌道差・位相差を測ってから『無視できる範囲』を
//   宣言する(a/R≈6.6e−6 だけでは証明にならない)。」
//
//   本器は第276便a の事前予測表 `tests/out/bgpredict-w276a.json` の背景(W₀・|A₀|・|∇W|・|∇A|・
//   |∂ₜW|・|∂ₜA|・u_bg)を**宣言した幾何**でベクトルへ起こし、`meshFieldNoD0`(norm "background")で
//   座標変換の加速度 **a_coord = (v·∇)u + ∂ₜu** を作り、**2 体を RK4 で 1 公転積分**して
//   背景 ON/OFF の位相差・a 差・e 差を出す。
//
// ■ 宣言(**測る前に書く**)
//   (D1) **背景の幾何**: 背景源は評価点から距離 r の **−x̂ 方向**に置く。背景の速度(評価点から見た
//        相対速度)は **+ŷ 方向に u_bg**。よって W₀>0・∇W=(−|∇W|,0)・A₀=(0,W₀u_bg)・
//        ∇A=u_bg⊗∇W=[0,0,−|∇W|u_bg,0]。**∇W と A₀ は直交する**(この幾何では)。
//   (D2) **時間微分の 2 案**: `geom`(この幾何の解析値。∂ₜW=−∇W·v_rel=0・∂ₜA=W₀a_bg x̂)と
//        `bound`(事前予測表の**整列した上界** |∂ₜW|=|∇W|u_bg・|∂ₜA| をそのまま使う)。
//        **事前予測表の時間微分は整列を仮定した大きさの上界**であり、この幾何の値とは別量である。
//   (D3) **結合 k**: a_i = g_i + k·(a_coord^X_i − a_coord^OFF_i)。**基準線は純ニュートン 2 体**で、
//        背景の寄与だけを差分で入れる(**ON/OFF の差を測る器**であって、エンジンの E6′ の再現ではない)。
//        k=1 は「引きずりが希釈されない」上限側の置き方である(エンジンの既定は D₀ で希釈される)。
//   (D4) **分解**: OFF(背景なし)→ UNI(W₀・A₀・時間微分だけ・**勾配 0**)→ ON(全部)。
//        「一様項」= UNI−OFF・「勾配項(差動)」= ON−UNI。
//   (D5) **物差し**: Buie 2012 の σ_P = 0.02592 s を**共通の物差し**として使う(🌘・📻 に
//        この σ が付くという意味ではない)。門: 1 公転あたりの位相差を時間へ直した |Δt| が
//        **≤1e−3·σ なら「この予算では軌道範囲で無視できる」**、超えるなら
//        **「一様重力相当のパラメータ 1 つでは代替できない —— 潮汐テンソル T が要る」**と書く。
//
// ■ しないこと
//   ・「背景を無視してよいことを証明した」「背景を較正した」とは書かない。
//   ・内蔵の物理入力を 1 つも変えない(ページは**宣言を読むだけ**)。
//   ・残差が小さくなる背景・k を探索して採用しない。
//
// ■ 第278便d(統括の読み R56)で足したもの —— 版 `w278d-bgbudget-2`(既存の行・門・警告計算は 1 つも変えていない)
//   **規格化候補の差の報告(採用しない・診断)** `candidates`: 各候補で ❄️🌘📻 の背景 ON/OFF 差
//   (周期差・位相差・位置差 —— 1 公転)を**刻み 3 段(N・2N・4N)**で測り、刻み収束を付ける。
//     N3     … (N3) 参照(第276便a の事前予測表の背景そのまま)
//     shield … 局所遮蔽の仮説式 w=M r^{−p} e^{−r/λ}(単位 [M/L²] のまま・λ=1 au / 10 au を宣言)
//     Weff   … 明示天体との一致から逆算した実効の重み(`tests/out/bgequiv-w278d.json` の L0ff の f)
//   **D₀ を希釈項として戻す形は候補に入れない**(R56)。閾値 1e−3σ_Buie は**採用しない** ——
//   各候補で「その閾値ならどうか」(`atReferenceThreshold`)を並べるだけである。
//   **再走の順序**: bgpredict(第276便a)→ bgequiv(第278便d)→ 本器。
//
// 実行:
//   PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w277d-bgbudget.mjs
// 出力: tests/out/bgbudget-w277d.json(CANON・来歴は lib-w272e-provenance の形)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { meshFieldNoD0, toComovingFrame, comovingCheck, COMOVING_VERSION, COMOVING_CONVENTIONS }
  from './lib-w275b-meshfield.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { shieldBackgroundPointSource, scaleBackground, convergence } from './lib-w278d-bgequiv.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const OUT = path.join(ROOT, 'tests', 'out', 'bgbudget-w277d.json');
const HARNESS_VERSION = 'w278d-bgbudget-2';
const SIGMA_BUIE = 0.02592;          // s(Buie 2012 の P の 1σ —— **共通の物差し**として使う)

const SAMPLES = [
  { id: 'plutoCharonReal', emoji: '❄️', label: '冥王星–カロン', rule: 'heliocentric' },
  { id: 'earthMoonRealKF1', emoji: '🌘', label: '地球–月(kFrame=1)', rule: 'heliocentric' },
  { id: 'psrDoubleAB', emoji: '📻', label: 'PSR J0737−3039A/B', rule: 'galactic' },
];
const K_LIST = [1, 0.1, 0.01, 1.347093246e-3];   // 最後は ❄️ の並進 χ(冥王星側・第254便d の実測値)

/* ── ① ページから宣言を読む(値は 1 つも変えない) ──────────────────────────── */
const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
const pageErrors = [];
const page = await browser.newPage();
page.on('pageerror', (e) => pageErrors.push(String(e)));
await page.goto('file://' + path.join(ROOT, TARGET), { waitUntil: 'load' });
await page.waitForFunction(() => window.HP && HP.sim);
const declared = await page.evaluate((ids) => {
  const out = {};
  for (const id of ids) {
    const s = HP.allPresets().find((q) => q.id === id);
    if (!s) { out[id] = { missing: true }; continue; }
    const v = HP.validatePreset(JSON.parse(JSON.stringify(s)));
    if (!v.ok) { out[id] = { error: v.errors }; continue; }
    const ph = v.preset.physics;
    out[id] = { emoji: s.emoji, name: s.name, scaleExp: s.scaleExp || null,
      G: ph.G, softening: ph.softening, D0: ph.D0, kFrame: ph.kFrame,
      frameWeight: ph.frameWeight === undefined ? null : ph.frameWeight,
      framePow: HP.frameWeightPow ? HP.frameWeightPow(ph) : null,
      backgroundComplex: ph.backgroundComplex === undefined ? null : ph.backgroundComplex,
      bodies: v.preset.bodies.map((b) => ({ m: b.m, x: b.x, y: b.y, vx: b.vx, vy: b.vy })) };
  }
  return out;
}, SAMPLES.map((s) => s.id));
await browser.close();

/* ── ② 事前予測表(第276便a の正本)を読む ─────────────────────────────────── */
const PRED = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests', 'out', 'bgpredict-w276a.json'), 'utf8'));
const predOf = (id) => {
  const r = (PRED.rows || []).find((q) => q.id === id);
  return (r && r.predictedSI) ? r.predictedSI : null;
};

/* ── ③ 宣言した幾何でベクトル背景を起こす(D1)(D2) ─────────────────────────── */
function backgroundVectors(pred, timeMode) {
  const W0 = pred.W0, u = pred.uBg, gW = pred.gradW, aBg = pred.a;
  const gradW = [-gW, 0];                              // 源は −x̂ 側 → W は +x 方向へ減る
  const A0 = [0, W0 * u];                              // 背景の相対速度は +ŷ
  const gradA = [0, 0, u * gradW[0], 0];               // ∇A = u_bg⊗∇W(u_bg は y 成分だけ)
  if (timeMode === 'bound') {
    return { W0, A0, gradW, gradA, dWdt: pred.dWdt, dAdt: [0, pred.dAdt],
      timeMode, note: '事前予測表の**整列した上界**をそのまま入れた(この幾何の解析値ではない)' };
  }
  // geom: ∂ₜW = −∇W·v_rel(v_rel=(0,−u)・∇W は x 成分だけ)= 0 / ∂ₜA = W₀·a_bg x̂
  return { W0, A0, gradW, gradA, dWdt: 0, dAdt: [W0 * aBg, 0],
    timeMode, note: 'この幾何の解析値(∇W ⊥ v_rel なので ∂ₜW=0)' };
}

/* ── ④ SI 変換 ───────────────────────────────────────────────────────────── */
function toSI(d) {
  const L = Math.pow(10, d.scaleExp.L), T = Math.pow(10, d.scaleExp.T), M = Math.pow(10, d.scaleExp.M);
  const V = L / T;
  const G = d.G * Math.pow(10, 3 * d.scaleExp.L - d.scaleExp.M - 2 * d.scaleExp.T);
  return { G, eps: d.softening * L,
    bodies: d.bodies.map((b) => ({ m: b.m * M, x: b.x * L, y: b.y * L, vx: b.vx * V, vy: b.vy * V })),
    unit: { L, T, M, V } };
}

/* ── ⑤ 力学(2 体・純関数) ──────────────────────────────────────────────── */
function newtonAcc(st, m, G, eps) {
  const dx = st[0] - st[4], dy = st[1] - st[5];
  const s = dx * dx + dy * dy + eps * eps, inv = 1 / Math.sqrt(s), inv3 = inv * inv * inv;
  return [[-G * m[1] * dx * inv3, -G * m[1] * dy * inv3],
    [G * m[0] * dx * inv3, G * m[0] * dy * inv3]];
}
/** 源 j(自己除外)から見た座標変換の加速度 a=(v·∇)u+∂ₜu。`bg=null` は背景なし(norm "self")。 */
function coordAcc(st, g, m, eps, bg, i) {
  const j = 1 - i;
  const src = [{ m: m[j], x: st[4 * j], y: st[4 * j + 1], vx: st[4 * j + 2], vy: st[4 * j + 3],
    ax: g[j][0], ay: g[j][1] }];
  const o = bg ? { p: 2, eps, norm: 'background', bg } : { p: 2, eps, norm: 'self' };
  const f = meshFieldNoD0(src, st[4 * i], st[4 * i + 1], o);
  if (!f) return null;
  const vx = st[4 * i + 2], vy = st[4 * i + 3];
  return [vx * f.gradU[0] + vy * f.gradU[1] + f.dUdt[0],
    vx * f.gradU[2] + vy * f.gradU[3] + f.dUdt[1]];
}
/** 状態微分。`bg` が null ならニュートンのみ。差分結合 k·(a_coord^bg − a_coord^off)。 */
function deriv(st, m, G, eps, bg, k) {
  const g = newtonAcc(st, m, G, eps);
  const a = [[g[0][0], g[0][1]], [g[1][0], g[1][1]]];
  if (bg && k !== 0) {
    for (let i = 0; i < 2; i++) {
      const on = coordAcc(st, g, m, eps, bg, i), off = coordAcc(st, g, m, eps, null, i);
      if (!on || !off) return null;
      a[i][0] += k * (on[0] - off[0]); a[i][1] += k * (on[1] - off[1]);
    }
  }
  return [st[2], st[3], a[0][0], a[0][1], st[6], st[7], a[1][0], a[1][1]];
}
function rk4(st0, m, G, eps, bg, k, dt, steps) {
  let st = st0.slice();
  for (let n = 0; n < steps; n++) {
    const k1 = deriv(st, m, G, eps, bg, k); if (!k1) return null;
    const s2 = st.map((z, i) => z + 0.5 * dt * k1[i]);
    const k2 = deriv(s2, m, G, eps, bg, k); if (!k2) return null;
    const s3 = st.map((z, i) => z + 0.5 * dt * k2[i]);
    const k3 = deriv(s3, m, G, eps, bg, k); if (!k3) return null;
    const s4 = st.map((z, i) => z + dt * k3[i]);
    const k4 = deriv(s4, m, G, eps, bg, k); if (!k4) return null;
    st = st.map((z, i) => z + (dt / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
  }
  return st;
}
/** 相対座標の接触軌道要素。 */
function elements(st, mu) {
  const rx = st[0] - st[4], ry = st[1] - st[5];
  const vx = st[2] - st[6], vy = st[3] - st[7];
  const r = Math.hypot(rx, ry), v2 = vx * vx + vy * vy, rv = rx * vx + ry * vy;
  const a = 1 / (2 / r - v2 / mu);
  const ex = ((v2 - mu / r) * rx - rv * vx) / mu, ey = ((v2 - mu / r) * ry - rv * vy) / mu;
  return { a, e: Math.hypot(ex, ey), r, phase: Math.atan2(ry, rx) };
}
const wrap = (d) => { while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return d; };

/* ── ⑥ 走行 ──────────────────────────────────────────────────────────────── */
const STEPS = Number(process.env.W277D_STEPS || 20000);
const rows = [];
const kSweep = [];
const conventionRows = [];
const frameCrossCheck = [];
const warnRows = [];
const covariance = [];

for (const S of SAMPLES) {
  const d = declared[S.id];
  const pred = predOf(S.id);
  if (!d || d.missing || d.error || !pred) {
    rows.push({ id: S.id, emoji: S.emoji, skipped: true, why: !pred ? '事前予測表に行が無い' : '宣言が読めない' });
    continue;
  }
  const si = toSI(d);
  const m = si.bodies.map((b) => b.m), G = si.G, eps = si.eps, mu = G * (m[0] + m[1]);
  const st0 = [si.bodies[0].x, si.bodies[0].y, si.bodies[0].vx, si.bodies[0].vy,
    si.bodies[1].x, si.bodies[1].y, si.bodies[1].vx, si.bodies[1].vy];
  const el0 = elements(st0, mu);
  const T = 2 * Math.PI * Math.sqrt(Math.pow(el0.a, 3) / mu);
  const n = 2 * Math.PI / T, dt = T / STEPS;

  // ---- 警告計算(**予測ではない**): 未整理の参照系で背景速度をそのまま足したときの見かけの寄与
  const sep = Math.hypot(st0[0] - st0[4], st0[1] - st0[5]);
  const wLocal = [m[1] / (sep * sep + eps * eps), m[0] / (sep * sep + eps * eps)];
  warnRows.push({ id: S.id, emoji: S.emoji, sepM: sep, epsM: eps, W0: pred.W0, uBg: pred.uBg,
    bodies: [0, 1].map((i) => ({ which: i === 0 ? '主' : '従', wOther: wLocal[i],
      chiBg: pred.W0 / (pred.W0 + wLocal[i]),
      apparentDeltaV: pred.W0 / (pred.W0 + wLocal[i]) * pred.uBg })),
    note: '**警告計算**: 局所源だけで静止している 2 体へ、参照系を揃えずに背景速度 u_bg を '
      + '重み付き平均へ足すと χ_bg·u_bg の見かけの寄与が出る —— **予測ではない**' });

  for (const timeMode of ['geom', 'bound']) {
    const bgDecl = backgroundVectors(pred, timeMode);
    const V = [0, pred.uBg];                       // 背景の速度(宣言した幾何)
    for (const conv of COMOVING_CONVENTIONS) {
      const bgCo = toComovingFrame(bgDecl, V, { convention: conv });
      if (!bgCo) continue;
      const bgWeight = { W0: bgCo.W0, A0: [0, 0], gradW: [0, 0], gradA: [0, 0, 0, 0],
        dWdt: 0, dAdt: [0, 0] };                       // **重み W₀ だけ**(分母の希釈のみ)
      const bgUni = { W0: bgCo.W0, A0: bgCo.A0, gradW: [0, 0], gradA: [0, 0, 0, 0],
        dWdt: bgCo.dWdt, dAdt: bgCo.dAdt };            // 値と時間微分(**勾配 0**)
      const stCo = st0.slice();
      stCo[2] -= V[0]; stCo[3] -= V[1]; stCo[6] -= V[0]; stCo[7] -= V[1];
      const runs = {};
      runs.off = rk4(stCo, m, G, eps, null, 0, dt, STEPS);
      runs.weight = rk4(stCo, m, G, eps, bgWeight, 1, dt, STEPS);
      runs.uni = rk4(stCo, m, G, eps, bgUni, 1, dt, STEPS);
      runs.on = rk4(stCo, m, G, eps, bgCo, 1, dt, STEPS);
      if (!runs.off || !runs.weight || !runs.uni || !runs.on) continue;
      const E = { off: elements(runs.off, mu), weight: elements(runs.weight, mu),
        uni: elements(runs.uni, mu), on: elements(runs.on, mu) };
      const diff = (A, B) => ({
        dPhase: wrap(A.phase - B.phase), dPhaseTimeS: wrap(A.phase - B.phase) / n,
        dPhaseTimeOverSigma: Math.abs(wrap(A.phase - B.phase) / n) / SIGMA_BUIE,
        daRel: (A.a - B.a) / B.a, de: A.e - B.e });
      const row = { id: S.id, emoji: S.emoji, label: S.label, rule: S.rule, timeMode, convention: conv,
        k: 1, steps: STEPS, periodS: T, aM: el0.a, e0: el0.e, sepM: sep, epsM: eps, G, muSI: mu,
        massesSI: m, W0: pred.W0, uBg: pred.uBg, gradW: pred.gradW, bgDeclared: bgDecl,
        bgComoving: bgCo,
        total: diff(E.on, E.off), uniform: diff(E.uni, E.off), gradient: diff(E.on, E.uni),
        weightOnly: diff(E.weight, E.off), timeDeriv: diff(E.uni, E.weight),
        elements: E,
        baselineClosureRel: Math.abs((E.off.a - el0.a) / el0.a),
        // **軌道が壊れていないか**(壊れている行の「1 公転あたりの差」は差として読めない)
        onStillBound: (E.on.a > 0 && E.on.e < 1),
        offStillBound: (E.off.a > 0 && E.off.e < 1),
        onEccEnd: E.on.e, onSemiRel: (E.on.a - el0.a) / el0.a };
      if (timeMode === 'geom' && conv === 'advected') rows.push(row);
      else conventionRows.push(row);
    }
    // ---- k 掃引(❄️ だけ・geom・advected)
    if (S.id === 'plutoCharonReal' && timeMode === 'geom') {
      const bgCo = toComovingFrame(bgDecl, V, { convention: 'advected' });
      const stCo = st0.slice(); stCo[3] -= V[1]; stCo[7] -= V[1];
      const off = rk4(stCo, m, G, eps, null, 0, dt, STEPS);
      const Eoff = elements(off, mu);
      for (const k of K_LIST) {
        const on = rk4(stCo, m, G, eps, bgCo, k, dt, STEPS);
        if (!on) continue;
        const E = elements(on, mu);
        kSweep.push({ id: S.id, k, dPhase: wrap(E.phase - Eoff.phase),
          dPhaseTimeS: wrap(E.phase - Eoff.phase) / n,
          dPhaseTimeOverSigma: Math.abs(wrap(E.phase - Eoff.phase) / n) / SIGMA_BUIE,
          daRel: (E.a - Eoff.a) / Eoff.a, de: E.e - Eoff.e });
      }
      // ---- 参照系の突合: 重心静止系(宣言のまま)vs 共動系(変換した背景)
      for (const conv of COMOVING_CONVENTIONS) {
        const bgc = toComovingFrame(bgDecl, V, { convention: conv });
        const stC = st0.slice(); stC[3] -= V[1]; stC[7] -= V[1];
        const inBary = rk4(st0, m, G, eps, bgDecl, 1, dt, STEPS);
        const inComov = rk4(stC, m, G, eps, bgc, 1, dt, STEPS);
        if (!inBary || !inComov) continue;
        const A = elements(inBary, mu), B = elements(inComov, mu);
        frameCrossCheck.push({ id: S.id, convention: conv,
          dPhase: wrap(A.phase - B.phase), daRel: (A.a - B.a) / B.a, de: A.e - B.e,
          note: '同じ物理を 2 つの参照系で積分した差 —— **規約が整合していれば 0 になるはず**' });
      }
    }
  }
  // ---- 場の側のガリレイ共変性(積分せず 1 点で測る)
  const bgDecl = backgroundVectors(pred, 'geom');
  const srcFor0 = [{ m: m[1], x: st0[4], y: st0[5], vx: st0[6], vy: st0[7], ax: 0, ay: 0 }];
  for (const conv of COMOVING_CONVENTIONS) {
    for (const [vname, V] of [['perp(宣言した幾何)', [0, pred.uBg]],
      ['tilt45(診断)', [pred.uBg / Math.SQRT2, pred.uBg / Math.SQRT2]]]) {
      for (const [sname, src] of [['背景のみ', []], ['背景+局所源', srcFor0]]) {
        const c = comovingCheck(src, st0[0], st0[1],
          { p: 2, eps, bg: bgDecl, V, convention: conv, vParticle: [st0[2], st0[3]] });
        if (!c) continue;
        covariance.push({ id: S.id, emoji: S.emoji, convention: conv, V: vname, sources: sname,
          uShiftRel: c.uShiftRel, gradUAbs: c.gradUAbs, gradURel: c.gradURel,
          dUdtRel: c.dUdtRel, residVsFieldTime: c.residVsFieldTime,
          residVsAdvected: c.residVsAdvected, accelRel: c.accelRel, accelDiff: c.accelDiff,
          chi0: c.chi0 });
      }
    }
  }
}

/* ── ⑥′ 第278便d: 規格化候補の差(**診断・採用しない**)と刻み収束 ──────────────────── */
const AU = 1.495978707e11;
const EQUIV_PATH = path.join(ROOT, 'tests', 'out', 'bgequiv-w278d.json');
let EQUIV = null;
try { EQUIV = JSON.parse(fs.readFileSync(EQUIV_PATH, 'utf8')); } catch { EQUIV = null; }
const weffOf = (id) => {
  const s = EQUIV && (EQUIV.samples || []).find((z) => z.id === id);
  if (!s || !s.wEff || !s.wEff.L0ff) return { f: null, why: '一致試験の正本に行が無い' };
  const w = s.wEff.L0ff[1] || s.wEff.L0ff[0];
  return (w && w.f !== null && w.f !== undefined) ? { f: w.f, withinResolution: !!w.withinResolution,
    resolutionF: w.resolutionF === undefined ? null : w.resolutionF, steps: w.steps }
    : { f: null, why: w && w.why ? w.why : '逆算できない' };
};
const CAND_NS = [STEPS, 2 * STEPS, 4 * STEPS];
/** 1 公転の積分に**交差時刻**(相対位置の角度が 1 周する時刻)を足した版(1 步は rk4(…,h,1))。 */
function rk4Track(st0, m, G, eps, bg, k, dt, steps) {
  const ang = (z) => Math.atan2(z[1] - z[5], z[0] - z[4]);
  const wrap1 = (d) => { while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return d; };
  const Lz = (st0[0] - st0[4]) * (st0[3] - st0[7]) - (st0[1] - st0[5]) * (st0[2] - st0[6]);
  const sgn = Lz >= 0 ? 1 : -1, target = sgn * 2 * Math.PI;
  let st = st0.slice(), unw = 0, prev = ang(st), sT = null, period = null;
  const maxN = Math.ceil(steps * 1.6);
  for (let n = 0; n < maxN; n++) {
    const s1 = rk4(st, m, G, eps, bg, k, dt, 1);
    if (!s1 || !s1.every(Number.isFinite)) break;
    const a1 = ang(s1), u1 = unw + wrap1(a1 - prev);
    if (period === null && (unw - target) * sgn < 0 && (u1 - target) * sgn >= 0) {
      const fOf = (h) => { const z = rk4(st, m, G, eps, bg, k, h, 1); return z ? unw + wrap1(ang(z) - prev) - target : NaN; };
      let h0 = 0, f0 = unw - target, h1 = dt, f1 = u1 - target;
      for (let it = 0; it < 40; it++) {
        const h2 = h1 - f1 * (h1 - h0) / (f1 - f0);
        if (!Number.isFinite(h2)) break;
        const f2 = fOf(h2);
        h0 = h1; f0 = f1; h1 = h2; f1 = f2;
        if (Math.abs(h1 - h0) <= 1e-13 * dt || f2 === 0) break;
      }
      period = n * dt + h1;
    }
    st = s1; unw = u1; prev = a1;
    if (n + 1 === steps) sT = st.slice();
    if (n + 1 >= steps && period !== null) break;
  }
  return sT ? { sT, period } : null;
}
const candidates = [];
for (const S of SAMPLES) {
  const d = declared[S.id];
  const pred = predOf(S.id);
  if (!d || d.missing || d.error || !pred) { candidates.push({ id: S.id, emoji: S.emoji, skipped: true }); continue; }
  const si = toSI(d);
  const m = si.bodies.map((b) => b.m), G = si.G, eps = si.eps, mu = G * (m[0] + m[1]);
  const st0 = [si.bodies[0].x, si.bodies[0].y, si.bodies[0].vx, si.bodies[0].vy,
    si.bodies[1].x, si.bodies[1].y, si.bodies[1].vx, si.bodies[1].vy];
  const el0 = elements(st0, mu);
  const T = 2 * Math.PI * Math.sqrt(Math.pow(el0.a, 3) / mu), n = 2 * Math.PI / T;
  const bgDecl = backgroundVectors(pred, 'geom');
  const V = [0, pred.uBg];
  const stCo = st0.slice(); stCo[2] -= V[0]; stCo[3] -= V[1]; stCo[6] -= V[0]; stCo[7] -= V[1];
  const we = weffOf(S.id);
  const CANDS = [
    { key: 'N3', label: '(N3) 参照', bg: bgDecl, factorW: 1 },
    { key: 'shield1au', label: '局所遮蔽 λ=1 au', lambdaM: AU },
    { key: 'shield10au', label: '局所遮蔽 λ=10 au', lambdaM: 10 * AU },
    { key: 'Weff', label: '明示天体との一致から逆算した W_eff', weff: we },
  ];
  const offs = {};
  for (const N of CAND_NS) offs[N] = rk4Track(stCo, m, G, eps, null, 0, T / N, N);
  const rowsC = [];
  for (const c of CANDS) {
    let bg = null, why = null, factorW = null, factorGrad = null;
    if (c.key === 'N3') { bg = bgDecl; factorW = 1; factorGrad = 1; }
    else if (c.lambdaM) {
      const sh = shieldBackgroundPointSource(bgDecl, pred.r, c.lambdaM, 2);
      if (sh) { factorW = sh.factorW; factorGrad = sh.factorGrad; bg = { W0: sh.W0, A0: sh.A0, gradW: sh.gradW,
        gradA: sh.gradA, dWdt: sh.dWdt, dAdt: sh.dAdt }; }
      else why = '遮蔽の式が値を返さない';
    } else if (c.weff) {
      if (c.weff.f === null) why = c.weff.why;
      else { bg = scaleBackground(bgDecl, c.weff.f); factorW = c.weff.f; factorGrad = c.weff.f; }
    }
    if (!bg) { rowsC.push({ key: c.key, label: c.label, skipped: true, why }); continue; }
    const bgCo = toComovingFrame(bg, V, { convention: 'advected' });
    const per = {};
    for (const N of CAND_NS) {
      const on = rk4Track(stCo, m, G, eps, bgCo, 1, T / N, N), off = offs[N];
      if (!on || !off) { per[N] = null; continue; }
      const Eon = elements(on.sT, mu);
      const dPh = wrap(elements(on.sT, mu).phase - elements(off.sT, mu).phase);
      const dr = [(on.sT[0] - on.sT[4]) - (off.sT[0] - off.sT[4]), (on.sT[1] - on.sT[5]) - (off.sT[1] - off.sT[5])];
      per[N] = { dP: (on.period !== null && off.period !== null) ? on.period - off.period : null,
        dPhaseTimeS: dPh / n, dPos: Math.hypot(dr[0], dr[1]), onBound: Eon.a > 0 && Eon.e < 1, onEcc: Eon.e };
    }
    const cv = (k) => convergence(CAND_NS.map((N) => (per[N] && per[N][k] !== null) ? per[N][k] : null));
    const last = per[CAND_NS[2]];
    const cT = cv('dPhaseTimeS');
    rowsC.push({ key: c.key, label: c.label, lambdaM: c.lambdaM || null, factorW, factorGrad,
      weff: c.weff || null, onBound: last ? last.onBound : false, onEcc: last ? last.onEcc : null,
      dP: cv('dP'), dPhaseTimeS: cT, dPos: cv('dPos'),
      overSigma: cT ? Math.abs(cT.values[2]) / SIGMA_BUIE : null,
      // **参考**(閾値は採用しない): その閾値ならどうか —— 軌道が壊れる行と刻み収束しない行は読まない
      atReferenceThreshold: (last && last.onBound && cT && cT.width < 1e-3 * SIGMA_BUIE)
        ? (Math.abs(cT.values[2]) <= 1e-3 * SIGMA_BUIE) : null });
  }
  candidates.push({ id: S.id, emoji: S.emoji, label: S.label, periodS: T, steps: CAND_NS, rows: rowsC });
}

/* ── ⑦ 宣言した門の判定 ──────────────────────────────────────────────────── */
const GATE = { name: 'negligibleWithinOrbit', rule: '|Δt_phase| ≤ 1e−3·σ_Buie',
  sigmaBuieS: SIGMA_BUIE, thresholdS: 1e-3 * SIGMA_BUIE,
  declaredBeforeMeasuring: true };
const verdicts = rows.filter((r) => !r.skipped).map((r) => {
  const t = Math.abs(r.total.dPhaseTimeS), g = Math.abs(r.gradient.dPhaseTimeS);
  return { id: r.id, emoji: r.emoji, label: r.label,
    dPhaseTimeS: r.total.dPhaseTimeS, overSigma: r.total.dPhaseTimeOverSigma,
    gradientTimeS: r.gradient.dPhaseTimeS, gradientOverSigma: r.gradient.dPhaseTimeOverSigma,
    uniformTimeS: r.uniform.dPhaseTimeS,
    negligible: t <= GATE.thresholdS,
    gradientNegligible: g <= GATE.thresholdS,
    onStillBound: r.onStillBound, onEccEnd: r.onEccEnd,
    readable: r.onStillBound && r.offStillBound,
    statement: t <= GATE.thresholdS
      ? 'この予算では軌道範囲で無視できる(k=1・1 公転)'
      : '**この予算では無視できない** —— 一様重力相当のパラメータ 1 つでは代替できない'
        + '(勾配による差動が残るので、必要なら潮汐テンソル T)' };
});

/* ── ⑧ 書き出し ─────────────────────────────────────────────────────────── */
const CODE = ['tests/exp-w277d-bgbudget.mjs', 'tests/lib-w275b-meshfield.mjs', 'tests/lib-w278d-bgequiv.mjs',
  'tests/lib-w272e-provenance.mjs'];
const out = {
  meta: Object.assign(provenanceMeta({ root: ROOT, wave: '第278便d(第277便d の器の版上げ)', target: TARGET,
    code: CODE, inputs: [TARGET, 'tests/out/bgpredict-w276a.json', 'tests/out/bgequiv-w278d.json'] }), {
    harnessVersion: HARNESS_VERSION, comovingVersion: COMOVING_VERSION,
    steps: STEPS, integrator: 'RK4(固定刻み・1 公転)',
    declarations: {
      D1: '背景源は −x̂ 方向・背景の相対速度は +ŷ 方向(∇W ⊥ A₀)',
      D2: 'timeMode geom = この幾何の解析値 / bound = 事前予測表の整列した上界',
      D3: 'a_i = g_i + k·(a_coord^bg − a_coord^off)。基準線は純ニュートン 2 体',
      D4: 'OFF → UNI(勾配 0)→ ON。一様項=UNI−OFF・勾配項=ON−UNI',
      D5: '物差しは Buie 2012 の σ_P=0.02592 s(🌘・📻 にこの σ が付くという意味ではない)' },
    doNotWrite: ['背景を無視してよいことを証明した', '背景を較正した', '慣性を導出した',
      '観測と合った', '新発見', 'v1.45.0 RC を切った'],
  }),
  gate: GATE,
  declaredFromPage: declared,
  predictionSource: { file: 'tests/out/bgpredict-w276a.json',
    wave: PRED.meta ? PRED.meta.wave : null },
  rows, verdicts, uniformVsGradient: rows.filter((r) => !r.skipped).map((r) => ({
    id: r.id, uniform: r.uniform, gradient: r.gradient, total: r.total })),
  kSweep, conventionRows, frameCrossCheck, covariance, warningCalculation: warnRows,
  // 第278便d: 規格化候補の差(**診断・採用しない**)と刻み収束(N・2N・4N)
  candidates, candidateNote: '候補は採用しない(診断)。D₀ を希釈項として戻す形は入れない。閾値 1e−3σ_Buie は未採用 —— '
    + 'atReferenceThreshold は「その閾値ならどうか」の参考で、軌道が壊れる行・刻み収束しない行は null',
  pageErrors,
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));

/* ── 画面出力 ────────────────────────────────────────────────────────────── */
const e = (x) => (x === null || x === undefined ? '—' : Number(x).toExponential(3));
console.log(`■ 背景 ON/OFF の誤差予算(第277便d・RK4 ${STEPS} 步 / 1 公転・k=1・timeMode=geom・convention=advected)`);
for (const r of rows) {
  if (r.skipped) { console.log(`   ${r.emoji} ${r.id} SKIP(${r.why})`); continue; }
  console.log(`   ${r.emoji} ${r.label}: P=${e(r.periodS)} s ・ a=${e(r.aM)} m ・ W₀=${e(r.W0)} ・ u_bg=${e(r.uBg)}`);
  console.log(`      全体   Δφ=${e(r.total.dPhase)} rad → Δt=${e(r.total.dPhaseTimeS)} s(σ_Buie 比 ${e(r.total.dPhaseTimeOverSigma)})`
    + ` Δa/a=${e(r.total.daRel)} Δe=${e(r.total.de)}`);
  console.log(`      重み W₀ だけ Δt=${e(r.weightOnly.dPhaseTimeS)} s / 時間微分 Δt=${e(r.timeDeriv.dPhaseTimeS)} s`
    + ` / 一様項(計) Δt=${e(r.uniform.dPhaseTimeS)} s / **勾配項** Δt=${e(r.gradient.dPhaseTimeS)} s`
    + `(σ 比 ${e(r.gradient.dPhaseTimeOverSigma)})`);
  console.log(`      軌道が閉じているか: OFF ${r.offStillBound} / ON ${r.onStillBound}(ON の e=${e(r.onEccEnd)}・Δa/a=${e(r.onSemiRel)})`);
}
console.log('■ 門の判定(**測る前に宣言**: |Δt| ≤ 1e−3·σ_Buie = ' + e(GATE.thresholdS) + ' s):');
for (const v of verdicts) console.log(`   ${v.emoji} ${v.id}: ${v.negligible ? '無視できる' : '**無視できない**'} — ${v.statement}`);
console.log('■ 警告計算(**予測ではない**):');
for (const w of warnRows) for (const b of w.bodies)
  console.log(`   ${w.emoji} ${b.which}: χ_bg=${e(b.chiBg)} → 見かけの Δv=${Number(b.apparentDeltaV).toFixed(3)} m/s`);
console.log('■ 共動系変換のガリレイ共変(1 点で測定):');
for (const c of covariance)
  console.log(`   ${c.emoji} ${c.convention.padEnd(9)} V=${c.V.padEnd(16)} ${c.sources.padEnd(12)}`
    + ` u ずれ ${e(c.uShiftRel)} / ∇u 差 ${e(c.gradUAbs)} / 残差(fieldTime) ${e(c.residVsFieldTime)}`
    + ` / 残差(advected) ${e(c.residVsAdvected)} / a 不変 ${e(c.accelRel)}`);
console.log('■ k 掃引(❄️):');
for (const s of kSweep) console.log(`   k=${s.k}: Δt=${e(s.dPhaseTimeS)} s(σ 比 ${e(s.dPhaseTimeOverSigma)})・Δa/a=${e(s.daRel)}・Δe=${e(s.de)}`);
console.log('■ 参照系の突合(重心静止系 vs 共動系・同じ物理):');
for (const f of frameCrossCheck) console.log(`   ${f.convention}: Δφ=${e(f.dPhase)} rad ・ Δa/a=${e(f.daRel)} ・ Δe=${e(f.de)}`);
console.log('■ 規格化候補(診断・採用しない・N/2N/4N):');
for (const c of candidates) {
  if (c.skipped) continue;
  for (const r of c.rows) {
    if (r.skipped) { console.log(`   ${c.emoji} ${r.label}: SKIP(${r.why})`); continue; }
    console.log(`   ${c.emoji} ${r.label}: Δt=${e(r.dPhaseTimeS && r.dPhaseTimeS.values[2])} s(幅 ${e(r.dPhaseTimeS && r.dPhaseTimeS.width)}・比 ${r.dPhaseTimeS && r.dPhaseTimeS.ratio !== null ? r.dPhaseTimeS.ratio.toFixed(2) : '—'})`
      + ` ΔP=${e(r.dP && r.dP.values[2])} s Δx=${e(r.dPos && r.dPos.values[2])} m bound=${r.onBound} 参考閾値=${r.atReferenceThreshold}`);
  }
}
console.log(`→ ${path.relative(ROOT, OUT)}(ページエラー ${pageErrors.length})`);

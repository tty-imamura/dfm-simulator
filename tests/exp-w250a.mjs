// 第250便a W1「コンパクト連星の検証 — 何が消え何が残るか・90° 軸・ラグビーボール尺度」(第42報)。
//
// 原仮定者(第42報)の見立て: 「恒星連星とコンパクト天体連星の較正で明確になったのは、コンパクト
// 天体連星同士では引きずりが消える事。つまり、コンパクト連星の自転軸は 90 度倒れ、互いに相手を
// 向いている。潮汐力でロックされ、自転軸方向にラグビーボールの様に引き伸ばされている。ただし
// 自転による遠心力で引き伸ばしと拮抗している。自転の軸は団子に刺した串の様に同じ方向に回転して
// いる事を予想。コンパクト天体同士にファンデルワールス力に相当する力が働いている事を検証する」。
//
// **エンジンの物理は 1 bit も変えない**。本ハーネスは純関数(HP.dfmDragChannels / HP.dfmTidalSpinScale)と
// 既存の宣言差し替えだけで測る。新しい力・新しい preset は 1 つも作らない。
//
// 節:
//   CH   : **引きずりの 2 チャネルを同じ器で並べる**。⚡🧮🩺🪶🪃🪀(NS)・✴️💫(恒星)・📻✨🌟(観測版)を
//          同じ HP.dfmDragChannels に掛け、回転チャネル η_rot=s(R/(R+d))^q/n と 並進チャネル χ を 1 枚に。
//          χ は 2 通り(実測=1 步後の S.uPx/uPy と伴星速度の比 / 解析=HP.dfmBinaryChi)で出す。
//   COND : ChatGPT v8 §4.1 の **5 条件**(そのまま/コア 90°/90°+公転速度 0/コア削除/kFrame=0)を
//          ⚡ と 3 PN variant(🪶🪃🪀)で再現。初期ステップの u と 1000 步後の軌道要素。
//   AXIS : **90° 軸の追従試験**。⚡ の B コアを tilt=90・方位 0 で置き 1/4 公転 → 伴星方向の回転角と
//          コア軸方位の変化。追従に要るトルク τ=n_orb ẑ×J の大きさと反作用の受け先候補を数字で。
//   TIDE : **ラグビーボール尺度**。HP.dfmTidalSpinScale を J0737 A/B・J1757・J1946 の転写値(SI)で。
//
// 実行: node tests/exp-w250a.mjs [--ch] [--cond] [--axis] [--tide] [--fast]
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const argv = process.argv.slice(2);
const FAST = argv.includes('--fast');
const only = argv.filter((a) => a.startsWith('--') && a !== '--fast').map((a) => a.slice(2));
const want = (k) => !only.length || only.includes(k);

let browser;
try { const { chromium } = await import('playwright'); browser = await chromium.launch(); }
catch { const { chromium } = await import('playwright-core');
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); }
const pg = await browser.newPage();
const pageErrors = [];
pg.on('pageerror', (e) => pageErrors.push(String(e)));
await pg.goto(INDEX, { waitUntil: 'load' });
await pg.waitForFunction(() => window.HP && HP.sim);

// ---------------------------------------------------------------- ページ側ヘルパ(本体には入れない)
await pg.evaluate(() => {
  // 二体の相対状態から軌道要素(μ=G(m₀+m₁)・a=1/(2/r−v²/μ)・e=√(1−h²/(μa)))
  window.__w250el = (S, G) => {
    const dx = S.x[1] - S.x[0], dy = S.y[1] - S.y[0];
    const dvx = S.vx[1] - S.vx[0], dvy = S.vy[1] - S.vy[0];
    const r = Math.hypot(dx, dy), v2 = dvx * dvx + dvy * dvy, mu = G * (S.m[0] + S.m[1]);
    const a = 1 / (2 / r - v2 / mu), h = dx * dvy - dy * dvx;
    const q = 1 - h * h / (mu * a);
    return { r, v: Math.sqrt(v2), a, e: (q > 0) ? Math.sqrt(q) : 0, h, mu,
      // n は **瞬時の相対角速度 θ̇=h/r²**(質量較正 f に依らず、初期状態だけで決まる規格化)。
      // nKep は同じ状態のニュートン平均運動 √(μ/a³) — **較正質量 f≈2 が入る量**なので併記に留める
      n: h / (r * r), nKep: (a > 0) ? Math.sqrt(mu / (a * a * a)) : null, th: Math.atan2(dy, dx) };
  };
  // 「観測の自転」= spinDipole.omega(観測転写)→ core.omega → shell spin の順で拾う。
  //   sDyn は **エンジンの E2/E3 が実際に読む殻スピン**(NS では宣言 0)。
  window.__w250spin = (b) => {
    const sd = (b.spinDipole && Number.isFinite(Number(b.spinDipole.omega))) ? Math.abs(Number(b.spinDipole.omega)) : null;
    const co = (b.core && Number.isFinite(Number(b.core.omega))) ? Math.abs(Number(b.core.omega)) : null;
    const sh = Number.isFinite(Number(b.spin)) ? Math.abs(Number(b.spin)) : 0;
    return { sObs: (sd !== null && sd > 0) ? sd : ((co !== null && co > 0) ? co : sh), sDyn: sh,
      src: (sd !== null && sd > 0) ? 'spinDipole' : ((co !== null && co > 0) ? 'core.omega' : 'spin') };
  };
  // CH: 1 プリセットの 2 チャネルを測る
  window.__w250ch = (id, dt) => {
    const src = HP.allPresets().find((q) => q.id === id);
    if (!src || !src.bodies || src.bodies.length < 2) return null;
    const pd = JSON.parse(JSON.stringify(src));
    const v = HP.validatePreset(pd); const S = HP.sim; S.build(v.preset);
    const p = v.preset.physics || {};
    const G = S.params.G, D0 = S.params.D0, eps = S.params.softening;
    const pw = HP.frameWeightPow(S.params);                 // 0=share / 2,3,4=pull
    const D0u = (pw > 0) ? ((p.D0pull > 0) ? p.D0pull : D0) : D0;
    const el0 = window.__w250el(S, G);
    const b = [pd.bodies[0], pd.bodies[1]];
    const sp = [window.__w250spin(b[0]), window.__w250spin(b[1])];
    const R = [S.R[0], S.R[1]];
    const qB = [Number.isFinite(Number(b[0].dragQ)) ? Number(b[0].dragQ) : S.params.q,
      Number.isFinite(Number(b[1].dragQ)) ? Number(b[1].dragQ) : S.params.q];
    // 解析 χ(pull 重み・実測分離で評価)
    const chiAn = HP.dfmBinaryChi(S.m[0], S.m[1], el0.r, D0u, eps, pw);
    // 実測 χ: 1 步進めて S.uPx/uPy と**伴星の速度**の比(2 体なので u_i=χ_i·v_j がそのまま出る)
    S.step(dt);
    const um = [Math.hypot(S.uPx[0], S.uPy[0]), Math.hypot(S.uPx[1], S.uPy[1])];
    const vm = [Math.hypot(S.vx[0], S.vy[0]), Math.hypot(S.vx[1], S.vy[1])];
    const chiMeas = [(vm[1] > 0) ? um[0] / vm[1] : null, (vm[0] > 0) ? um[1] / vm[0] : null];
    // 純関数で 2 チャネル(源は相手側の天体 — i が感じる u は j が作る)
    const ch = [
      HP.dfmDragChannels({ R: R[1], d: el0.r, q: qB[1], s: sp[1].sObs, n: Math.abs(el0.n), chi: chiAn.chiA }),
      HP.dfmDragChannels({ R: R[0], d: el0.r, q: qB[0], s: sp[0].sObs, n: Math.abs(el0.n), chi: chiAn.chiB })];
    const chDyn = [
      HP.dfmDragChannels({ R: R[1], d: el0.r, q: qB[1], s: sp[1].sDyn, n: Math.abs(el0.n), chi: chiAn.chiA }),
      HP.dfmDragChannels({ R: R[0], d: el0.r, q: qB[0], s: sp[0].sDyn, n: Math.abs(el0.n), chi: chiAn.chiB })];
    return { id, emoji: src.emoji, name: src.name, kFrame: S.params.kFrame, frameWeight: p.frameWeight || 'pull',
      pow: pw, D0, D0pull: D0u, eps, G, m: [S.m[0], S.m[1]], R, q: qB,
      sObs: [sp[0].sObs, sp[1].sObs], sSrc: [sp[0].src, sp[1].src], sDyn: [sp[0].sDyn, sp[1].sDyn],
      sep: el0.r, a: el0.a, e: el0.e, n: el0.n, chiAn: [chiAn.chiA, chiAn.chiB], chiMeas,
      uMag: um, vMag: vm, ch, chDyn, nan: S.hasNaN(), warn: (v.warnings || []).length };
  };
  // COND: ChatGPT v8 §4.1 の 5 条件
  window.__w250cond = (id, mode, dt, steps) => {
    const src = HP.allPresets().find((q) => q.id === id);
    const pd = JSON.parse(JSON.stringify(src));
    if (mode === 'tilt90' || mode === 'tilt90v0') {
      for (const b of pd.bodies) if (b.core) { b.core.tilt = 90; b.core.Kcs = 0; b.core.contract = 0; b.core.pump = 0; delete b.core.Kalign; }
    }
    if (mode === 'tilt90v0') for (const b of pd.bodies) { b.vx = 0; b.vy = 0; }
    if (mode === 'nocore') for (const b of pd.bodies) delete b.core;
    if (mode === 'kf0') pd.physics.kFrame = 0;
    if (pd.massCalibration) delete pd.massCalibration;      // 台帳の三者一致検査を実験へ持ち込まない
    const v = HP.validatePreset(pd); const S = HP.sim; S.build(v.preset);
    const G = S.params.G;
    const el0 = window.__w250el(S, G);
    S.step(dt);                                             // **最初のステップの u**(ChatGPT §4.1 と同じ量)
    const u1 = { uy: [S.uPy[0], S.uPy[1]], ux: [S.uPx[0], S.uPx[1]] };
    for (let k = 1; k < steps; k++) S.step(dt);
    const el1 = window.__w250el(S, G);
    return { id, mode, dt, steps, el0, el1, u1,
      dAdeg: (el1.a / el0.a - 1) * 100, de: el1.e - el0.e,
      nan: S.hasNaN(), clamp: S.clampVN + S.clampSN + S.clampRN + S.clampTN, warn: (v.warnings || []).length };
  };
  // AXIS: ⚡ の B コアを tilt=90・方位 0 に置いて 1/4 公転
  window.__w250axis = (id, dt, tEnd, tiltBody) => {
    const src = HP.allPresets().find((q) => q.id === id);
    const pd = JSON.parse(JSON.stringify(src));
    const bi = (tiltBody === undefined) ? 1 : tiltBody;
    const b = pd.bodies[bi];
    b.core = Object.assign({}, b.core, { tilt: 90, Kcs: 0, contract: 0, pump: 0 });
    delete b.core.Kalign;
    if (pd.massCalibration) delete pd.massCalibration;
    const v = HP.validatePreset(pd); const S = HP.sim; S.build(v.preset);
    const other = 1 - bi;
    const dir = () => Math.atan2(S.y[other] - S.y[bi], S.x[other] - S.x[bi]);   // B から見た伴星方向
    const az = () => Math.atan2(S.coreJy[bi], S.coreJx[bi]);                     // コア軸の面内方位
    const Jof = () => ({ Jx: S.coreJx[bi], Jy: S.coreJy[bi], Jz: S.coreJ[bi],
      Jperp: Math.hypot(S.coreJx[bi], S.coreJy[bi]),
      Jabs: Math.hypot(Math.hypot(S.coreJx[bi], S.coreJy[bi]), S.coreJ[bi]) });
    const d0 = dir(), a0 = az(), J0 = Jof(), el0 = window.__w250el(S, S.params.G);
    const steps = Math.round(tEnd / dt);
    let dAcc = 0, dPrev = d0, aAcc = 0, aPrev = a0, azMoved = 0;
    for (let k = 0; k < steps; k++) {
      S.step(dt);
      const dNow = dir(); let dd = dNow - dPrev;
      while (dd > Math.PI) dd -= 2 * Math.PI; while (dd < -Math.PI) dd += 2 * Math.PI;
      dAcc += dd; dPrev = dNow;
      const aNow = az(); let da = aNow - aPrev;
      while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
      aAcc += da; aPrev = aNow;
      if (Math.abs(aAcc) > Math.abs(azMoved)) azMoved = aAcc;
    }
    const J1 = Jof(), el1 = window.__w250el(S, S.params.G);
    // 追従に要るトルク τ = n_orb·|J| (J⊥ を軌道角速度で回すのに要る大きさ・向きは ẑ×J)
    const nOrb = Math.abs(el0.n);
    return { id, tiltBody: bi, dt, tEnd, steps,
      dirDeg0: d0 * 180 / Math.PI, dirAdvDeg: dAcc * 180 / Math.PI,
      azDeg0: a0 * 180 / Math.PI, azAdvDeg: aAcc * 180 / Math.PI, azMaxDeg: azMoved * 180 / Math.PI,
      J0, J1, JabsDrift: (J0.Jabs > 0) ? J1.Jabs / J0.Jabs - 1 : null,
      nOrb, tauNeeded: (nOrb !== null) ? nOrb * J0.Jperp : null,
      // 反作用の受け先候補(2D の実在量): 殻スピンは z 成分のみ・帳簿 resL も z のみ
      shellSpin: [S.spin[0], S.spin[1]], resL: S.resL, resLx: (S.resLx === undefined) ? null : S.resLx,
      el0, el1, nan: S.hasNaN(), clamp: S.clampVN + S.clampSN + S.clampRN + S.clampTN,
      warn: (v.warnings || []).length };
  };
});

const out = { target: TARGET, node: process.version, fast: FAST, at: new Date().toISOString() };

// ============================================================ CH: 2 チャネルを同じ器で
if (want('ch')) {
  const IDS = ['psrDoubleABDFM', 'psrJ1757DFM', 'psrJ1946DFM', 'psrDoubleABPN', 'psrJ1757PN', 'psrJ1946PN',
    'alphaCenABDFM', 'siriusABDFM', 'psrDoubleAB', 'alphaCenAB', 'siriusAB'];
  const rows = [];
  for (const id of IDS) {
    const r = await pg.evaluate(({ id, dt }) => window.__w250ch(id, dt), { id, dt: 0.001 });
    if (!r) { console.error(`  CH ${id} → SKIP(2 体でない)`); continue; }
    rows.push(r);
    console.error(`  CH ${r.emoji} ${id}: η_rot=${r.ch[0].etaRot.toExponential(3)}/${r.ch[1].etaRot.toExponential(3)}`
      + `  χ(解析)=${r.chiAn[0].toExponential(3)}/${r.chiAn[1].toExponential(3)}`
      + `  χ(実測)=${r.chiMeas[0] === null ? 'n/a' : r.chiMeas[0].toExponential(3)}`
      + `  gate=${r.ch[0].gate.toExponential(3)}`);
  }
  out.ch = rows;
}

// ============================================================ COND: 5 条件
if (want('cond')) {
  const IDS = ['psrDoubleABDFM', 'psrDoubleABPN', 'psrJ1757PN', 'psrJ1946PN'];
  const MODES = ['plain', 'tilt90', 'tilt90v0', 'nocore', 'kf0'];
  const STEPS = FAST ? 200 : 1000;
  const rows = [];
  for (const id of IDS) for (const mode of MODES) {
    const r = await pg.evaluate(({ id, mode, dt, steps }) => window.__w250cond(id, mode, dt, steps),
      { id, mode, dt: 0.001, steps: STEPS });
    rows.push(r);
    console.error(`  COND ${id} ${mode}: u_y=[${r.u1.uy[0]}, ${r.u1.uy[1]}]  a%=${r.dAdeg.toExponential(3)} de=${r.de.toExponential(3)}`);
  }
  // 同一系の 'plain' との差(ChatGPT §4.1 の「コア回転差は 1.5e-12」を再現する列)
  for (const r of rows) {
    const base = rows.find((z) => z.id === r.id && z.mode === 'plain');
    r.duyVsPlain = [r.u1.uy[0] - base.u1.uy[0], r.u1.uy[1] - base.u1.uy[1]];
  }
  out.cond = rows;
}

// ============================================================ AXIS: 90° 軸の追従試験
if (want('axis')) {
  const P_J0737 = 8834.534723278 / 10;        // 観測周期(時間単位 — 1単位=10 s)
  const dt = FAST ? 0.008 : 0.001;
  const r = await pg.evaluate(({ id, dt, tEnd }) => window.__w250axis(id, dt, tEnd, 1),
    { id: 'psrDoubleABDFM', dt, tEnd: P_J0737 / 4 });
  console.error(`  AXIS 伴星方向 ${r.dirAdvDeg.toFixed(4)}° 進む / コア軸方位 ${r.azAdvDeg.toExponential(3)}°`
    + `  J=(${r.J1.Jx.toFixed(4)}, ${r.J1.Jy.toFixed(4)}, ${r.J1.Jz.toFixed(4)})  τ_要=${r.tauNeeded.toExponential(4)}`);
  out.axis = r;
}

// ============================================================ TIDE: ラグビーボール尺度(SI)
if (want('tide')) {
  // paper/data/solar-observations.csv の転写値(SI)。**半径は EOS proxy 11.75 km**(観測半径ではない)・
  // 距離は**近点距離 a(1−e)**(最も潮汐が強い点)。伴星のスピンは未観測なので ε_rot は主星のみ。
  const SYS = [
    { label: '⚡ J0737−3039 A', m: 2.660982861e30, mComp: 2.483370041e30, R: 1.175e4,
      a: 8.788366e8, e: 0.087777036, Pspin: 0.02269937898645, Pb: 8834.534723278 },
    { label: '⚡ J0737−3039 B', m: 2.483370041e30, mComp: 2.660982861e30, R: 1.175e4,
      a: 8.788366e8, e: 0.087777036, Pspin: 2.77346074724, Pb: 8834.534723278 },
    { label: '🧮 J1757−1854(パルサー)', m: 2.6614084e30, mComp: 2.7731621e30, R: 1.175e4,
      a: 1.3219674457986195e9, e: 0.6058142, Pspin: 2.14972318900292e-2, Pb: 15857.669019168 },
    { label: '🩺 J1946+2052(パルサー)', m: 2.5528363e30, mComp: 2.481648e30, R: 1.175e4,
      a: 7.314902889635589e8, e: 0.063848, Pspin: 1.696017532298e-2, Pb: 6781.366656 }];
  const rows = await pg.evaluate((SYS) => SYS.map((s) => {
    const d = s.a * (1 - s.e), Om = 2 * Math.PI / s.Pspin;
    const t = HP.dfmTidalSpinScale({ m: s.m, mComp: s.mComp, R: s.R, d, Omega: Om, G: 6.674e-11 });
    const tApo = HP.dfmTidalSpinScale({ m: s.m, mComp: s.mComp, R: s.R, d: s.a * (1 + s.e), Omega: Om, G: 6.674e-11 });
    return Object.assign({ label: s.label, dPeri: d, dApo: s.a * (1 + s.e), Omega: Om,
      PspinOverPb: s.Pspin / s.Pb, epsTideApo: tApo.epsTide }, t);
  }), SYS);
  for (const r of rows) console.error(`  TIDE ${r.label}: ε_tide=${r.epsTide.toExponential(3)} ε_rot=${r.epsRot.toExponential(3)}`
    + ` 比=${r.ratio.toExponential(3)} → ${r.shape}`);
  out.tide = rows;
  // 識別試験 5 項目(ChatGPT v8 §5.3)— 現時点で本エンジンで測れるか
  out.discriminators = [
    { n: 1, test: 'J と −J で形状応答が同じか(スピン符号依存の速度依存項の分離)', status: '不可(2D の面外スカラー — 形状の自由度が無い)' },
    { n: 2, test: '同じ M・a・e で半径 R だけを変えて R のべき則を測る', status: '一部可(η_rot の R 依存は測れる。変形は測れない)' },
    { n: 3, test: '軸 0°/45°/90°・J=0・伴星の並進 0 を独立に比較', status: '可(本便 COND の 5 条件が 90°/J なし/並進 0 を含む)' },
    { n: 4, test: '軌道・コア・外殻の角運動量 3 成分と熱・放射・外部仕事を合わせる', status: '不可(殻スピンも帳簿 resL も z 成分のみ — 3 成分の受け皿が無い)' },
    { n: 5, test: 'J0737 で係数を選び、凍結して未使用 DNS へ適用', status: '手続きは可(第 4 の凍結 hold-out は B1534+12)。係数はまだ 1 つも置いていない' }];
}

out.pageErrors = pageErrors;
console.log(JSON.stringify(out, null, 1));
await browser.close();

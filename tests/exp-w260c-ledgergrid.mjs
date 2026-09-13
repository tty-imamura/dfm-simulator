// 第260便c(第52報): 帳簿・銀河の実測器 —— **固定物理時間 T × 刻み dt の格子**で残差を切り分け、
// **窓長**を副表に置き、**null の扱い**と **E_shell の欠落条件**と **有限容量の器**を数で固定する。
//
// 原仮定者(第52報・原文は docs/PHYSICS.md 〔第260便c〕に引用):
//   「実機確認: 済み」「進め方は、空間メッシュの実装を優先する。早期にコンパクト天体連星サンプルと
//    銀河サンプルを完成させる。中性子星連星までの現実較正を終える」
//
// 統括が設定した検証仮説 (9)(10) に対応する:
//   (9) **帳簿は固定物理時間 × dt の格子で切り分ける**(分母は固定参照 |K₀|+|U₀|+|Ecore₀|)。
//       「1/N なら離散化・定数なら未定義項」。
//   (10) **容量は力を制限しない**: Pmesh/Emesh と粒子キックを同段階で更新し、容量不足時は
//       **E を clamp せずキックを制約して再計算**する。τ と容量密度は**宣言値**である。
//
// 測る量(すべて**実測して決める** —— 予想は書かない):
//   ① **固定 T × dt**: 🎻🎠(診断コピーに meshEnergyCapacity=1e6 を宣言)・🍇 tuc47(現行のまま)・🔥 gas を
//      T=9.6/96 × h=0.016/0.008/0.004 で走らせ、|residualDrag|/(|K₀|+|U₀|+|Ecore₀|) と観測次数 p_obs
//   ② **窓長**(既定 dt=0.016)600/6000/60000 步の副表
//   ③ **residualDrag=null の扱い**: 🍇 tuc47 は W_drag 未定義 → null(**0 扱いしない**)。
//      tuc47(🍇・kFrame=0)と tuc47DFM(🫐・kFrame=1)を**区別して**記録する
//   ④ **E_shell の欠落条件**: thermal:"tint" の有無で定義/未定義が決まる。スピン=熱の宇宙では
//      殻の回転 E は**既に K に入っている**ので足すと二重計上になる(足さない・条件を書くだけ)
//   ⑤ **有限容量の器** `HP.dfmMeshCapacityStep`: 小さな閉じた箱(粒子 2〜3 + メッシュ)で P/J/E の保存と、
//      容量 3 段で応答が弱まる表。**力へは 1 バイトも接続しない**
//
// **書かないこと**: 「銀河サンプルが完成した(平坦回転の意味で)」「帳簿が閉じた」
// 「有限容量で距離減衰が実現した」「腕形成の証拠」。
//
// 実行: node tests/exp-w260c-ledgergrid.mjs [--grid] [--window] [--nullterm] [--eshell] [--cap]
//   PLAYWRIGHT_CORE_DIR=/home/user/dfm-simulator を付けて使う。
// 出力: tests/out/w260c-ledgergrid.json(未コミット —— 数値は PHYSICS に全載)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + (path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET));
const OUT = process.env.W260C_OUT || path.join(ROOT, 'tests', 'out', 'w260c-ledgergrid.json');
const argv = process.argv.slice(2).filter((a) => a.startsWith('--')).map((a) => a.slice(2));
const want = (k) => !argv.length || argv.includes(k);

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
await pg.waitForFunction(() => window.HP && HP.sim);

const out = { target: TARGET, node: process.version, at: new Date().toISOString(), wave: '260c' };

await pg.evaluate(() => {
  const W = (window.__w260c = {});
  W.byId = (id) => HP.allPresets().find((p) => p.id === id);
  W.build = (id, patch) => {
    const pd = JSON.parse(JSON.stringify(W.byId(id)));
    if (patch) patch(pd);
    const v = HP.validatePreset(pd);
    if (!v.ok) throw new Error('invalid ' + id + ' ' + JSON.stringify(v.errors || v.err));
    const S = HP.sim; S.build(v.preset);
    S._galSup = null;
    return S;
  };
  // **固定参照の分母**: 初期の |K₀|+|U₀|+|Ecore₀|(Ecore が未定義なら 0 を足すのではなく
  // 「未定義である」ことを記録して分母から外す —— 0 で埋めたのではない)
  W.denom = (a) => {
    const parts = { K: Math.abs(a.K), U: (a.U === null ? null : Math.abs(a.U)),
      Ecore: (a.Ecore === null ? null : Math.abs(a.Ecore)) };
    let d = parts.K + (parts.U || 0) + (parts.Ecore || 0);
    return { d: d || 1, parts, ecoreNull: a.Ecore === null, uNull: a.U === null };
  };
  // 1 走行 = 固定物理時間 T を刻み h で N=T/h 步(**T を固定して h を変える**)
  W.run = (id, T, h, patch) => {
    const S = W.build(id, patch);
    const a = HP.dfmToyLedger(S, {});
    const dn = W.denom(a);
    const N = Math.round(T / h);
    const t0 = performance.now();
    for (let k = 0; k < N; k++) S.step(h);
    const ms = performance.now() - t0;
    const b = HP.dfmToyLedger(S, { ref: a });
    const rd = b.residualDrag;
    return { id, emoji: W.byId(id).emoji, n: S.n, T, h, N, ms,
      K0: a.K, U0: a.U, Ecore0: a.Ecore, denom: dn.d, denomParts: dn.parts,
      ecoreNull: dn.ecoreNull,
      K: b.K, U: b.U, Emesh: b.Emesh, Emesh0: b.Emesh0, Q: b.Q, Etot: b.Etot, Wext: b.Wext,
      Eshell: b.Eshell, EshellState: b.EshellState,
      residual: b.residual, residualDrag: rd, residualDragState: b.residualDragState,
      meshCapState: b.meshCapState, meshSupplied: b.meshSupplied,
      dragWorkN: b.dragWorkN, Wdrag: b.Wdrag,
      rel: Math.abs(b.residual) / dn.d,
      // **null を 0 扱いしない**: 未定義なら relDrag も null である
      relDrag: (rd === null) ? null : Math.abs(rd) / dn.d,
      undef: b.undefinedTerms };
  };
  // E₀=10⁶ を診断コピーに宣言する patch(内蔵プリセットは 1 本も宣言していない)
  // (physics.spaceMesh.mode は "vertex" のみ。overlays.spaceMesh.mode〔表示方式〕とは別の鍵である)
  W.capPatch = (E0) => (pd) => {
    pd.physics.spaceMesh = { mode: 'vertex', meshEnergyCapacity: E0 };
  };
});

// ---------- ① 固定 T × dt の格子(検証仮説 (9))
if (want('grid')) {
  const Ts = [9.6, 96];
  const hs = [0.016, 0.008, 0.004];
  const jobs = [];
  for (const T of Ts) for (const h of hs) {
    jobs.push(['gw150914DFM', T, h, 1e6]);
    jobs.push(['galaxyMeshSpiral', T, h, 1e6]);
    jobs.push(['tuc47', T, h, null]);
    jobs.push(['gas', T, h, null]);
  }
  const rows = [];
  for (const [id, T, h, E0] of jobs) {
    const r = await pg.evaluate(([id2, T2, h2, E2]) =>
      window.__w260c.run(id2, T2, h2, E2 === null ? null : window.__w260c.capPatch(E2)),
      [id, T, h, E0]);
    r.E0 = E0;
    rows.push(r);
    console.log(`grid ${r.emoji}${id} T=${T} h=${h} N=${r.N} rel=${r.rel.toExponential(4)} `
      + `relDrag=${r.relDrag === null ? 'null' : r.relDrag.toExponential(4)} (${(r.ms / 1000).toFixed(1)}s)`);
  }
  // 観測次数 p_obs(h → h/2 の比の log2)。**null の段は次数を出さない**(0 扱いしない)
  const orders = [];
  for (const T of Ts) for (const id of ['gw150914DFM', 'galaxyMeshSpiral', 'tuc47', 'gas']) {
    const sel = hs.map((h) => rows.find((r) => r.id === id && r.T === T && r.h === h));
    const pick = (r) => (r.relDrag === null ? r.rel : r.relDrag);
    const o1 = Math.log2(pick(sel[0]) / pick(sel[1]));
    const o2 = Math.log2(pick(sel[1]) / pick(sel[2]));
    orders.push({ id, emoji: sel[0].emoji, T, used: sel[0].relDrag === null ? 'residual' : 'residualDrag',
      vals: sel.map(pick), pObs: [o1, o2] });
  }
  out.grid = { Ts, hs, rows, orders,
    note: '分母は**固定参照** |K₀|+|U₀|+|Ecore₀|(初期値)。Ecore が未定義の宇宙では 0 を足したのではなく'
      + '**項そのものが無い**(denomParts.Ecore=null)' };
}

// ---------- ② 窓長(既定 dt=0.016)の副表
if (want('window')) {
  const wins = (process.env.W260C_LONG === '1') ? [600, 6000, 60000] : [600, 6000];
  const rows = [];
  for (const N of wins) for (const [id, E0] of [['gw150914DFM', 1e6], ['galaxyMeshSpiral', 1e6],
    ['tuc47', null], ['gas', null]]) {
    const r = await pg.evaluate(([id2, N2, E2]) =>
      window.__w260c.run(id2, N2 * 0.016, 0.016, E2 === null ? null : window.__w260c.capPatch(E2)),
      [id, N, E0]);
    r.E0 = E0; rows.push(r);
    console.log(`win ${r.emoji}${id} N=${N} rel=${r.rel.toExponential(4)} `
      + `relDrag=${r.relDrag === null ? 'null' : r.relDrag.toExponential(4)} (${(r.ms / 1000).toFixed(1)}s)`);
  }
  out.window = { wins, rows };
}

// ---------- ③ residualDrag=null の扱い(🍇 tuc47 と 🫐 tuc47DFM を**区別**する)
if (want('nullterm')) {
  out.nullterm = await pg.evaluate(() => {
    const W = window.__w260c;
    const probe = (id, patch) => {
      const S = W.build(id, patch);
      const a = HP.dfmToyLedger(S, {});
      for (let k = 0; k < 600; k++) S.step(0.016);
      const b = HP.dfmToyLedger(S, { ref: a });
      const pd = W.byId(id);
      return { id, emoji: pd.emoji, kFrame: HP.sim.params.kFrame,
        ledgerDecl: JSON.stringify((pd.physics && pd.physics.ledger) || null),
        hasDragWork: !!S.hasDragWork, dragWorkN: b.dragWorkN,
        Wdrag: b.Wdrag, WdragKE: b.WdragKE, WdragSpin: b.WdragSpin,
        residual: b.residual, residualDrag: b.residualDrag,
        residualDragState: b.residualDragState,
        undefHasWdrag: b.undefinedTerms.indexOf('Wdrag') >= 0,
        Emesh: b.Emesh, meshCapState: b.meshCapState,
        // **null を 0 扱いしない**ことの機械的な確認: null と 0 は `=== 0` で区別できる
        isNull: b.residualDrag === null, isZero: b.residualDrag === 0 };
    };
    const rows = [probe('tuc47'), probe('tuc47DFM'), probe('gas'),
      probe('gw150914DFM'), probe('galaxyMeshSpiral')];
    // 宣言すれば定義される(🍇 の診断コピーに ledger:{dragWork:true} を足す — 内蔵は触らない)
    const tucDecl = probe('tuc47', (pd) => { pd.physics.ledger = { dragWork: true }; });
    const tucDFMDecl = probe('tuc47DFM', (pd) => { pd.physics.ledger = { dragWork: true }; });
    return { rows, tucDecl, tucDFMDecl };
  });
}

// ---------- ④ E_shell の欠落条件(足さない・条件を書くだけ)
if (want('eshell')) {
  out.eshell = await pg.evaluate(() => {
    const W = window.__w260c;
    const probe = (id) => {
      const pd = W.byId(id);
      const S = W.build(id);
      const b = HP.dfmToyLedger(S, {});
      // **スピン=熱の宇宙で殻の回転 E を足すとどれだけ二重計上になるか**(足さないが、量は測る)
      let Krot = 0, Ktr = 0;
      for (let i = 0; i < S.n; i++) {
        Ktr += 0.5 * S.m[i] * (S.vx[i] * S.vx[i] + S.vy[i] * S.vy[i]);
        Krot += 0.25 * S.m[i] * S.R[i] * S.R[i] * S.spin[i] * S.spin[i];
      }
      return { id, emoji: pd.emoji, thermal: pd.thermal || null,
        hasTint: !!S.Tint, Eshell: b.Eshell, EshellState: b.EshellState,
        undefHasEshell: b.undefinedTerms.indexOf('Eshell') >= 0,
        K: b.K, Ktrans: Ktr, Kspin: Krot,
        spinShareOfK: (b.K !== 0) ? Krot / b.K : null,
        cHeat: S.params.cHeat };
    };
    return { rows: ['gas', 'gw150914DFM', 'tuc47', 'tuc47DFM', 'galaxyMeshSpiral'].map(probe) };
  });
}

// ---------- ⑤ 有限容量の器(検証仮説 (10))
if (want('cap')) {
  out.cap = await pg.evaluate(() => {
    if (typeof HP.dfmMeshCapacityStep !== 'function') return { missing: true };
    // **小さな閉じた箱**: 粒子 3 + メッシュ(Pmesh/Lmesh/Emesh)。粒子間の力は入れない
    // (この器が測るのは「キックとメッシュ状態が同段階で閉じるか」だけである)
    const mkBodies = () => [
      { m: 2, x: -3, y: 1, vx: 0.4, vy: -0.2 },
      { m: 1, x: 2, y: -1.5, vx: -0.3, vy: 0.5 },
      { m: 3, x: 0.5, y: 4, vx: 0.1, vy: 0.25 }];
    const totals = (bs, P, L, E) => {
      let px = P[0], py = P[1], l = L, k = 0, ls = 0;
      for (const b of bs) { px += b.m * b.vx; py += b.m * b.vy; l += b.m * (b.x * b.vy - b.y * b.vx);
        k += 0.5 * b.m * (b.vx * b.vx + b.vy * b.vy);
        // **打ち消しの尺度**: Σm|x||v|(総和 L はほぼ打ち消すので、これで規格化しないと
        // 「相対誤差」が分母の小ささだけで大きく見える —— 両方を返して隠さない)
        ls += b.m * Math.hypot(b.x, b.y) * Math.hypot(b.vx, b.vy); }
      return { P: [px, py], L: l, E: k + E, Lscale: ls };
    };
    const runBox = (Emax, steps, dt, u, chi, tau) => {
      // **帯の真ん中から始める**(満杯から始めると受入側 = ceil で s=0 になり何も起きない)
      let bs = mkBodies(), P = [0, 0], L = 0, E = 0.5 * Emax;
      const T0 = totals(bs, P, L, E);
      let worstP = 0, worstL = 0, worstE = 0, nConstrained = 0, capState = 'ok', minS = 1;
      for (let k = 0; k < steps; k++) {
        const r = HP.dfmMeshCapacityStep({ bodies: bs, P, L, E, cap: { Emax },
          tau, dt, kick: { mode: 'drag', u, chi } });
        if (!r) return { err: 'step-null', Emax };
        bs = r.bodies; P = r.P; L = r.L; E = r.E;
        if (r.constrained) nConstrained++;
        if (r.scale < minS) minS = r.scale;
        if (r.capState !== 'ok') capState = r.capState;
        const T = totals(bs, P, L, E);
        worstP = Math.max(worstP, Math.hypot(T.P[0] - T0.P[0], T.P[1] - T0.P[1]));
        worstL = Math.max(worstL, Math.abs(T.L - T0.L));
        worstE = Math.max(worstE, Math.abs(T.E - T0.E));
      }
      const scale = Math.abs(T0.E) || 1;
      let speed = 0; for (const b of bs) speed += Math.hypot(b.vx, b.vy);
      return { Emax, steps, dt, tau, chi, u, capState, nConstrained, minScale: minS,
        Pmesh: P, Lmesh: L, Emesh: E, Eused: 0.5 * Emax - E,
        meanSpeed: speed / bs.length, dPmesh: Math.hypot(P[0], P[1]),
        absP: worstP, absL: worstL, absE: worstE,
        relP: worstP / (Math.hypot(T0.P[0], T0.P[1]) || 1), relL: worstL / (Math.abs(T0.L) || 1),
        relLscale: worstL / (T0.Lscale || 1),
        relE: worstE / scale, T0 };
    };
    // (a) **保存**: 容量が十分(Emax=1e6)なら 2000 步で P/J/E が丸めの範囲で閉じる
    const conserve = runBox(1e6, 2000, 0.02, [1.5, -0.8], 0.7, 5);
    // (b) **容量 3 段**: メッシュが粒子を u へ引く(粒子は静止から加速される = E は**供給**側)
    const rest = () => [{ m: 2, x: -3, y: 1, vx: 0, vy: 0 },
      { m: 1, x: 2, y: -1.5, vx: 0, vy: 0 }, { m: 3, x: 0.5, y: 4, vx: 0, vy: 0 }];
    const runSupply = (Emax) => {
      let bs = rest(), P = [0, 0], L = 0, E = Emax;
      const T0 = totals(bs, P, L, E);
      let nC = 0, capState = 'ok', worstE = 0, worstP = 0, worstL = 0;
      for (let k = 0; k < 1500; k++) {
        const r = HP.dfmMeshCapacityStep({ bodies: bs, P, L, E, cap: { Emax },
          tau: 5, dt: 0.02, kick: { mode: 'drag', u: [2, 0], chi: 1 } });
        if (!r) return { err: 'null', Emax };
        bs = r.bodies; P = r.P; L = r.L; E = r.E;
        if (r.constrained) nC++;
        if (r.capState !== 'ok') capState = r.capState;
        const T = totals(bs, P, L, E);
        worstE = Math.max(worstE, Math.abs(T.E - T0.E));
        worstP = Math.max(worstP, Math.hypot(T.P[0] - T0.P[0], T.P[1] - T0.P[1]));
        worstL = Math.max(worstL, Math.abs(T.L - T0.L));
      }
      let vmax = 0, vsum = 0;
      for (const b of bs) { const s = Math.hypot(b.vx, b.vy); vsum += s; if (s > vmax) vmax = s; }
      return { Emax, capState, nConstrained: nC, Emesh: E, Eused: Emax - E,
        vMean: vsum / bs.length, vMax: vmax, Pmesh: P,
        absE: worstE, absP: worstP, absL: worstL, relE: worstE / (Math.abs(T0.E) || 1) };
    };
    const supply = [1e6, 2, 0.2].map(runSupply);
    // (c) 容量密度 × 面積で宣言する経路(**宣言値**であって観測導出ではない)
    const byDensity = (() => {
      const r = HP.dfmMeshCapacityStep({ bodies: rest(), P: [0, 0], L: 0, E: 0.5,
        cap: { density: 0.01, area: 100 }, tau: 5, dt: 0.02,
        kick: { mode: 'drag', u: [2, 0], chi: 1 } });
      return r ? { Emax: r.Emax, decl: r.decl, capState: r.capState, scale: r.scale } : null;
    })();
    // (d) **E を clamp していない**ことの確認: 供給が尽きた步でも E は帯の中で連続のまま、
    //     キックが s 倍に制約される(scale<1 かつ E>=0 かつ ΔK が E を超えない)
    const floorStep = (() => {
      const r = HP.dfmMeshCapacityStep({ bodies: rest(), P: [0, 0], L: 0, E: 1e-4,
        cap: { Emax: 1 }, tau: 5, dt: 0.02, kick: { mode: 'drag', u: [50, 0], chi: 1 } });
      return r ? { scale: r.scale, capState: r.capState, E: r.E, dK: r.dK, dKfull: r.dKfull,
        A: r.A, B: r.B, conserve: r.conserve } : null;
    })();
    const ceilStep = (() => {
      // 粒子が速く、メッシュがほぼ満杯 → **受け取れない**(ceil)。E を clamp せずキックを制約する
      const bs = [{ m: 1, x: 0, y: 0, vx: 10, vy: 0 }];
      const r = HP.dfmMeshCapacityStep({ bodies: bs, P: [0, 0], L: 0, E: 0.999,
        cap: { Emax: 1 }, tau: 1, dt: 0.5, kick: { mode: 'drag', u: [0, 0], chi: 1 } });
      return r ? { scale: r.scale, capState: r.capState, E: r.E, Emax: r.Emax, dK: r.dK,
        dKfull: r.dKfull, conserve: r.conserve } : null;
    })();
    const gates = {
      nullSpec: HP.dfmMeshCapacityStep(null) === null,
      noBodies: HP.dfmMeshCapacityStep({ bodies: [], E: 1, cap: { Emax: 1 }, kick: {} }) === null,
      negE: HP.dfmMeshCapacityStep({ bodies: mkBodies(), E: -1, cap: { Emax: 1 },
        kick: { mode: 'drag' } }) === null,
      eOverCap: HP.dfmMeshCapacityStep({ bodies: mkBodies(), E: 2, cap: { Emax: 1 },
        kick: { mode: 'drag' } }) === null,
      noCap: HP.dfmMeshCapacityStep({ bodies: mkBodies(), E: 1, kick: { mode: 'drag' } }) === null,
      badTau: HP.dfmMeshCapacityStep({ bodies: mkBodies(), E: 1, cap: { Emax: 1 }, tau: 0,
        kick: { mode: 'drag' } }) === null,
      badChi: HP.dfmMeshCapacityStep({ bodies: mkBodies(), E: 1, cap: { Emax: 1 },
        kick: { mode: 'drag', chi: 2 } }) === null,
      badMode: HP.dfmMeshCapacityStep({ bodies: mkBodies(), E: 1, cap: { Emax: 1 },
        kick: { mode: 'spring' } }) === null,
      badDvLen: HP.dfmMeshCapacityStep({ bodies: mkBodies(), E: 1, cap: { Emax: 1 },
        kick: { mode: 'explicit', dv: [[0, 0]] } }) === null,
      negMass: HP.dfmMeshCapacityStep({ bodies: [{ m: -1, x: 0, y: 0, vx: 0, vy: 0 }], E: 1,
        cap: { Emax: 1 }, kick: { mode: 'drag' } }) === null,
      negDt: HP.dfmMeshCapacityStep({ bodies: mkBodies(), E: 1, cap: { Emax: 1 }, dt: -1,
        kick: { mode: 'drag' } }) === null };
    // 決定性(同じ宣言の 2 回の走行がビット同一)
    const det = (() => {
      const go = () => { let bs = mkBodies(), P = [0, 0], L = 0, E = 100;
        for (let k = 0; k < 50; k++) { const r = HP.dfmMeshCapacityStep({ bodies: bs, P, L, E,
          cap: { Emax: 100 }, tau: 3, dt: 0.05, kick: { mode: 'drag', u: [1, 1], chi: 0.6 } });
          bs = r.bodies; P = r.P; L = r.L; E = r.E; }
        return bs.map((b) => [b.vx, b.vy]).flat().concat([P[0], P[1], L, E]); };
      const a = go(), b = go();
      return a.every((z, i) => Object.is(z, b[i]));
    })();
    return { conserve, supply, byDensity, floorStep, ceilStep, gates, det };
  });
}

await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
out.pageErrors = pageErrors;
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log('wrote', OUT, 'pageErrors', pageErrors.length);

// 第261便d(第53報 W4): 帳簿の**規格化**と **coupleSink × inStep の 3 行**の実測器。
//
// 原仮定者(第53報・原文は docs/PHYSICS.md 〔第261便d〕に引用):
//   「数便後の Release を目指す。中性子星連星までの現実較正を終える」「決断事項: 概ね同意。改めて残った決断事項をまとめる」
//
// 統括が設定した検証仮説:
//   (10) **帳簿の規格化**: 分母から pinned 核の一定スピン E を除いた**活動部分**と従来分母を**併記**する。
//        活動部分の基準 ≈0(しきい値は宣言値)なら比は未定義にして**絶対残差**を出す。
//        **毎時刻の E_tot を分母にしない**(初回の返り値の denom を固定参照として使う)。
//   (12) **E_shell 契約**「T_int だけ・回転 E は K」を台帳に(既存実装と同じなら**署名便を作らない**)。
//        `residualDragState` / `EshellState` を正式 API にし、1e−3 門を
//        「T=96・h=0.016・分母(従来/活動)・seed」まで宣言する。
//   (2)  **inStep 既定昇格は coupleSink の受け先を決めてから**: 「未宣言→同段階 0 /
//        宣言時は sink へ送ったあと 0 / 支持範囲の出入りは sink 側リザーバにも同瞬間で記帳」の
//        3 行を器で測る。**既定は post のまま**(昇格は第262便の署名便)。
//
// 測る量(**実測して決める** —— 予想は書かない):
//   ① `--norm`   両分母の表: 🎻🔥🎠🍇🫐 を T=96 × h=0.016/0.008/0.004 で走らせ、
//                 |残差|/legacy と |残差|/active と絶対残差を**併記**する(🎠🍇 の判定が変わるか)。
//   ② `--eshell` E_shell 契約の**照合**: 実装(`EshellState`)が「tint だけ定義・無印は K の中」と
//                 一致するかを数で確かめる(一致するなら**署名便を作らない**)。
//   ③ `--sink`   coupleSink × inStep の 3 行: NS 1 系(coupleSink:"core")と非 sink 1 系で
//                 ΔP・ΔL・clampSN・受け先への送り高を表に。**基点 html と突き合わせて 1 bit 不変**を見る。
//
// **書かないこと**: 「帳簿が閉じた」「inStep を既定化した」「Release した」「規格化で残差が縮んだ」。
//
// 実行: PLAYWRIGHT_CORE_DIR=/home/user/dfm-simulator node tests/exp-w261d-ledgernorm.mjs [--norm] [--eshell] [--sink]
// 環境変数: W261D_BASE(基点 html の絶対パス — --sink の 1 bit 照合に使う)/ W261D_OUT / W261D_FAST=1
// 出力: tests/out/w261d-ledgernorm.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + (path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET));
const BASE = process.env.W261D_BASE || path.join(ROOT, 'beta', '_w261_base.html');
const OUT = process.env.W261D_OUT || path.join(ROOT, 'tests', 'out', 'w261d-ledgernorm.json');
const FAST = process.env.W261D_FAST === '1';
const argv = process.argv.slice(2).filter((a) => a.startsWith('--')).map((a) => a.slice(2));
const want = (k) => !argv.length || argv.includes(k);

const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }

const pageErrors = [];
async function openPage(url) {
  const pg = await browser.newPage();
  pg.on('pageerror', (e) => pageErrors.push(url.slice(-28) + ': ' + String(e.message || e)));
  await pg.goto(url, { waitUntil: 'load' });
  await pg.waitForFunction(() => window.HP && HP.sim);
  await pg.evaluate(HELPERS);
  return pg;
}
const out = { target: TARGET, base: BASE, node: process.version, at: new Date().toISOString(),
  wave: '261d', fast: FAST };

// 共通のヘルパ(両ページに同じものを張る —— openPage が必ず先に張る)
const HELPERS = () => {
  const W = (window.__w261d = {});
  W.byId = (id) => HP.allPresets().find((p) => p.id === id);
  W.build = (id, patch) => {
    const pd = JSON.parse(JSON.stringify(W.byId(id)));
    if (patch) patch(pd);
    const v = HP.validatePreset(pd);
    if (!v.ok) return { err: JSON.stringify(v.errors || v.err) };
    const S = HP.sim; S.build(v.preset); S._galSup = null;
    return { S, canon: JSON.stringify(v.preset) };
  };
  // 残差の相対化は**エンジンの純関数**を通す(器と QA が同じ式を読む)
  W.rel = (value, denom) => (typeof HP.dfmLedgerRelative === 'function')
    ? HP.dfmLedgerRelative(value, denom) : null;
  W.capPatch = (E0) => (pd) => { pd.physics.spaceMesh = { mode: 'vertex', meshEnergyCapacity: E0 }; };
};
const page = await openPage(INDEX);

// ============================================================ ① 両分母の表
if (want('norm')) {
  const hs = FAST ? [0.016, 0.008] : [0.016, 0.008, 0.004];
  const T = 96;
  const jobs = [['gw150914DFM', 1e6], ['galaxyMeshSpiral', 1e6], ['tuc47', null],
    ['tuc47DFM', null], ['gas', null]];
  const rows = [];
  for (const [id, E0] of jobs) for (const h of hs) {
    const r = await page.evaluate(([id2, T2, h2, E2]) => {
      const W = window.__w261d;
      const b = W.build(id2, E2 === null ? null : W.capPatch(E2));
      if (b.err) return { id: id2, h: h2, err: b.err };
      const S = b.S;
      const a = HP.dfmToyLedger(S, {});
      const N = Math.round(T2 / h2);
      const t0 = performance.now();
      for (let k = 0; k < N; k++) S.step(h2);
      const ms = performance.now() - t0;
      const z = HP.dfmToyLedger(S, { ref: a });
      const read = (z.residualDrag === null) ? 'residual' : 'residualDrag';
      const v = (z.residualDrag === null) ? z.residual : z.residualDrag;
      // **分母は初回の denom を固定参照**にする(毎時刻の E_tot を分母にしない)
      return { id: id2, emoji: W.byId(id2).emoji, n: S.n, T: T2, h: h2, N, ms, read,
        value: v, dragState: z.residualDragState, EshellState: z.EshellState,
        denom0: a.denom, denomEnd: z.denom, rel: W.rel(v, a.denom),
        relEnd: W.rel(v, z.denom) };
    }, [id, T, h, E0]);
    rows.push(r);
    const f = (x) => (x === null || x === undefined) ? 'null' : Number(x).toExponential(4);
    console.log(`norm ${r.emoji || ''}${r.id} h=${r.h} ${r.err ? 'ERR ' + r.err
      : `${r.read}=${f(r.value)} legacy=${f(r.rel && r.rel.relLegacy)} active=${f(r.rel && r.rel.relActive)}`
        + ` share=${r.denom0 ? (r.denom0.activeShare * 100).toFixed(3) + '%' : '-'} (${(r.ms / 1000).toFixed(1)}s)`}`);
  }
  // 観測次数 p_obs(h → h/2)を**両分母で**出す(定数分母なので p は同じはず —— 測って確かめる)
  const orders = [];
  for (const [id] of jobs) {
    const sel = hs.map((h) => rows.find((r) => r.id === id && r.h === h));
    if (sel.some((r) => !r || r.err)) continue;
    const pick = (r, kind) => (kind === 'abs') ? Math.abs(r.value)
      : (r.rel ? r.rel[kind] : null);
    const ord = (kind) => {
      const v = sel.map((r) => pick(r, kind));
      if (v.some((z) => !(z > 0))) return null;
      const o = []; for (let i = 0; i + 1 < v.length; i++) o.push(Math.log2(v[i] / v[i + 1]));
      return o;
    };
    orders.push({ id, emoji: sel[0].emoji, read: sel[0].read,
      pinnedShare: sel[0].denom0.activeShare, activeState: sel[0].denom0.activeState,
      abs: sel.map((r) => Math.abs(r.value)),
      relLegacy: sel.map((r) => pick(r, 'relLegacy')), relActive: sel.map((r) => pick(r, 'relActive')),
      pAbs: ord('abs'), pLegacy: ord('relLegacy'), pActive: ord('relActive') });
  }
  out.norm = { T, hs, rows, orders,
    note: '分母は**初回の返り値の denom を固定参照**にした(毎時刻の E_tot を分母にしない)。'
      + 'legacy=|K₀|+|U₀|+|Ecore₀| / active=legacy−|Σ_{pinned} ¼mR²ω²|' };
}

// ============================================================ ② E_shell 契約の照合
if (want('eshell')) {
  out.eshell = await page.evaluate(() => {
    const W = window.__w261d;
    const probe = (id) => {
      const b = W.build(id);
      if (b.err) return { id, err: b.err };
      const S = b.S, pd = W.byId(id);
      const z = HP.dfmToyLedger(S, {});
      let Ktr = 0, Krot = 0, KrotPin = 0;
      for (let i = 0; i < S.n; i++) {
        Ktr += 0.5 * S.m[i] * (S.vx[i] * S.vx[i] + S.vy[i] * S.vy[i]);
        const kr = 0.25 * S.m[i] * S.R[i] * S.R[i] * S.spin[i] * S.spin[i];
        Krot += kr; if (S.pinned[i] === 1) KrotPin += kr;
      }
      return { id, emoji: pd.emoji, thermal: pd.thermal || null, hasTint: !!S.Tint,
        Eshell: z.Eshell, EshellState: z.EshellState,
        undefNamed: z.undefinedTerms.indexOf('Eshell') >= 0,
        K: z.K, Ktrans: Ktr, Kspin: Krot, KspinPinned: KrotPin,
        // **契約の照合**: 「E_shell は T_int だけ」= tint 以外は null であること。
        // 「回転 E は K」= K − 並進 K = 殻の回転 E であること(差が丸めの範囲)
        contractTintOnly: (z.EshellState === 'tint') ? (z.Eshell !== null) : (z.Eshell === null),
        contractSpinInK: Math.abs((z.K - Ktr) - Krot) <= 1e-9 * (Math.abs(z.K) || 1),
        denom: z.denom };
    };
    const ids = ['gas', 'gw150914DFM', 'tuc47', 'tuc47DFM', 'galaxyMeshSpiral', 'psrDoubleABDFM'];
    const rows = ids.map(probe);
    // **T_int を宣言すると E_shell が定義される**(= 契約は「宣言の有無」だけで決まる)ことの対照。
    // 内蔵プリセットは 1 本も書き換えない —— 診断コピーである
    const decl = (() => {
      const b = W.build('tuc47', (pd) => { pd.thermal = 'tint'; });
      if (b.err) return { err: b.err };
      const z = HP.dfmToyLedger(b.S, {});
      return { Eshell: z.Eshell, EshellState: z.EshellState,
        undefNamed: z.undefinedTerms.indexOf('Eshell') >= 0, hasTint: !!b.S.Tint };
    })();
    return { rows, decl,
      note: 'E_shell 契約「T_int だけ・回転 E は K」を**既存実装と照合**した(署名便を作るかどうかの判断材料)' };
  });
  for (const r of out.eshell.rows)
    console.log(`eshell ${r.emoji || ''}${r.id} state=${r.EshellState} tintOnly=${r.contractTintOnly}`
      + ` spinInK=${r.contractSpinInK} pinnedSpinE=${r.denom ? r.denom.pinnedSpinE.toExponential(4) : '-'}`);
}

// ============================================================ ③ coupleSink × inStep の 3 行
if (want('sink')) {
  // **同じ走行を基点 html と候補 html で回す**。3 行の契約のうち本便が足したのは 2 行目・3 行目で、
  // 送り先も規則も `applyCoupleSinkAlt` と同一なので **状態は 1 bit も変わらないはず** —— 測る。
  const runOf = (pg, nStep, dt) => pg.evaluate(([nStep, dt]) => {
    const W = window.__w261d;
    const KEY = HP.SPACE_MESH_KEY;
    const SM = (extra) => Object.assign({ mode: 'vertex', inertia: 'coordinate',
      inertiaGain: 0, inertiaVertices: true }, extra || {});
    const ring = (rr, k8) => { const z = [];
      for (let k = 0; k < k8; k++) { const th = 2 * Math.PI * k / k8;
        z.push({ type: 'single', m: 0.5, x: rr * Math.cos(th), y: rr * Math.sin(th),
          vx: -0.026 * Math.sin(th), vy: 0.026 * Math.cos(th), spin: 0, pinned: false }); }
      return z; };
    // **支持範囲を出入りする粒子**(半径方向に走らせて宣言した支持半径 supR をまたがせる ——
    // これが無いと `meshCoordGive`(戻し)は 1 度も立たず、3 行目が測れない)
    const crossers = (supR) => { const z = [];
      for (let k = 0; k < 4; k++) { const th = Math.PI * (0.17 + 0.5 * k), sgn = (k % 2) ? -1 : 1;
        const rr = supR + sgn * 30;
        z.push({ type: 'single', m: 0.4, x: rr * Math.cos(th), y: rr * Math.sin(th),
          vx: -sgn * 9 * Math.cos(th), vy: -sgn * 9 * Math.sin(th), spin: 0, pinned: false }); }
      return z; };
    const run = (id, mut) => {
      const b = W.build(id, mut);
      if (b.err) return { err: b.err };
      const S = b.S;
      const T0 = S.totals();
      // `S.meshCoordGive` は**その步の値**で上書きされる(累積ではない)ので、器の側で積む
      let giveSum = 0, giveMax = 0, giveSteps = 0, onMin = Infinity, onMax = 0;
      let maskChanges = 0, outMax = 0, prevMask = null;
      for (let k = 0; k < nStep; k++) {
        S.step(dt);
        const g = S.meshCoordGive | 0;
        if (g) { giveSum += g; giveSteps++; if (g > giveMax) giveMax = g; }
        const on = S.meshCoordN | 0;
        if (on < onMin) onMin = on; if (on > onMax) onMax = on;
        if ((S.meshCoordOut | 0) > outMax) outMax = S.meshCoordOut | 0;
        // **対象マスクそのものが変わった步**を数える(数が同じでも中身が入れ替わることがある)
        const TG = S._mcTgt;
        if (TG) { let h = 0;
          for (let i = 0; i < TG.length; i++) h = (h * 31 + TG[i]) >>> 0;
          if (prevMask !== null && h !== prevMask) maskChanges++;
          prevMask = h; }
      }
      const T = S.totals();
      const st = []; for (let i = 0; i < S.n; i++) st.push(S.x[i], S.y[i], S.vx[i], S.vy[i], S.spin[i]);
      let coreJ = 0; if (S.coreJ) for (let i = 0; i < S.n; i++) coreJ += S.coreJ[i];
      return { n: S.n, st,
        dP: Math.hypot(T.px - T0.px + S.resPx, T.py - T0.py + S.resPy),
        dL: T.L - T0.L + S.resL, L0: T0.L,
        dLrel: Math.abs(T.L - T0.L + S.resL) / Math.max(Math.abs(T0.L), 1e-300),
        resL: S.resL, coreJ, clampSN: S.clampSN, clampTN: S.clampTN, clampRN: S.clampRN,
        removal: S.meshCoordRemoval, sink: S.meshCoordSink === undefined ? null : S.meshCoordSink,
        give: S.meshCoordGive, giveSum, giveMax, giveSteps, maskChanges, outMax,
        mcN: S.meshCoordN, mcNmin: (onMin === Infinity ? null : onMin), mcNmax: onMax,
        stop: S.meshCoordStop,
        sinkL: S.meshCoordSinkL === undefined ? null : S.meshCoordSinkL,
        sinkGive: S.meshCoordSinkGive === undefined ? null : S.meshCoordSinkGive,
        sinkN: S.meshCoordSinkN === undefined ? null : S.meshCoordSinkN,
        nan: S.hasNaN() };
    };
    // --- 非 sink 1 系(🪟 spaceMeshBinaryToy + リング・coupleSink 未宣言)
    const noSinkMut = (rem) => (pd) => {
      pd.physics[KEY] = SM(rem ? { inertiaRemoval: rem } : null);
      pd.bodies = pd.bodies.concat(ring(900, 8));
    };
    // --- sink 1 系: **同じ toy に coupleSink:"core" を宣言**した対照(NS と同じ受け先)
    const sinkMut = (rem, which) => (pd) => {
      pd.physics[KEY] = SM(rem ? { inertiaRemoval: rem } : null);
      pd.physics.coupleSink = which;
      pd.bodies = pd.bodies.concat(ring(900, 8));
    };
    const R = {};
    R.noSinkPost = run('spaceMeshBinaryToy', noSinkMut(null));
    R.noSinkInStep = run('spaceMeshBinaryToy', noSinkMut('inStep'));
    R.corePost = run('spaceMeshBinaryToy', sinkMut(null, 'core'));
    R.coreInStep = run('spaceMeshBinaryToy', sinkMut('inStep', 'core'));
    R.resPost = run('spaceMeshBinaryToy', sinkMut(null, 'reservoir'));
    R.resInStep = run('spaceMeshBinaryToy', sinkMut('inStep', 'reservoir'));
    // --- NS 1 系(⚡ psrDoubleABDFM・coupleSink:"core" が**本体の宣言**)。
    //     プリセットの physics は 1 bit も書き換えず、**spaceMesh の宣言だけ足した診断コピー**である
    R.nsBase = run('psrDoubleABDFM', null);
    R.nsPost = run('psrDoubleABDFM', (pd) => { pd.physics[KEY] = SM(null); });
    R.nsInStep = run('psrDoubleABDFM', (pd) => { pd.physics[KEY] = SM({ inertiaRemoval: 'inStep' }); });
    R.nsSinkDecl = (W.byId('psrDoubleABDFM').physics || {}).coupleSink || null;
    // --- 3 行目: **支持範囲の出入り**(inertiaSupport:"support" + 支持半径をまたぐ粒子)
    const supR = 900;
    // **D₀=0 を宣言した支持関数**でないと `dfmLocalMeshField` は支持外でも null を返さない
    //(= 出入りが起きない)。D₀ は**宣言値**であって較正ノブではない
    const supMut = (which, d0) => (pd) => {
      const sm = { inertiaRemoval: 'inStep', inertiaSupport: 'support', inertiaSupportR: supR };
      if (d0 !== undefined) sm.D0 = d0;
      pd.physics[KEY] = SM(sm);
      if (which) pd.physics.coupleSink = which;
      pd.bodies = pd.bodies.concat(ring(supR, 8)).concat(crossers(supR));
    };
    R.supNoSink = run('spaceMeshBinaryToy', supMut(null));
    R.supCore = run('spaceMeshBinaryToy', supMut('core'));
    R.supRes = run('spaceMeshBinaryToy', supMut('reservoir'));
    R.supD0NoSink = run('spaceMeshBinaryToy', supMut(null, 0));
    R.supD0Core = run('spaceMeshBinaryToy', supMut('core', 0));
    R.supD0Res = run('spaceMeshBinaryToy', supMut('reservoir', 0));
    return R;
  }, [nStep, dt]);
  const steps = FAST ? 400 : 1500, dt = 0.004;
  const cur = await runOf(page, steps, dt);
  let old = null;
  if (fs.existsSync(BASE)) { const bp = await openPage('file://' + BASE); old = await runOf(bp, steps, dt); await bp.close(); }
  // **状態差**(x,y,vx,vy)と spin を分けて出す(1 bit 不変の確認)
  const cmp = (a, b) => { if (!a || !b || !a.st || !b.st || a.st.length !== b.st.length) return null;
    let d = 0, ds = 0;
    for (let i = 0; i < a.st.length; i++) { const z = Math.abs(a.st[i] - b.st[i]);
      if (i % 5 === 4) ds = Math.max(ds, z); else d = Math.max(d, z); }
    return { xv: d, spin: ds }; };
  const keys = Object.keys(cur).filter((k) => cur[k] && typeof cur[k] === 'object');
  const vsBase = {};
  if (old) for (const k of keys) vsBase[k] = cmp(cur[k], old[k]);
  out.sink = { steps, dt, cur, old, baseMissing: !old, vsBase };
  for (const k of keys) {
    const r = cur[k];
    if (r.err) { console.log(`sink ${k} ERR ${r.err}`); continue; }
    console.log(`sink ${k} removal=${r.removal} sink=${r.sink} dP=${r.dP.toExponential(3)}`
      + ` dLrel=${r.dLrel.toExponential(3)} clampSN=${r.clampSN} give=${r.giveSum}/${r.giveSteps}步`
      + ` on=${r.mcNmin}..${r.mcNmax} maskΔ=${r.maskChanges} out=${r.outMax}`
      + ` sinkL=${r.sinkL === null ? '-' : r.sinkL.toExponential(3)} sinkN=${r.sinkN}`
      + (vsBase[k] ? ` | 基点差 xv=${vsBase[k].xv} spin=${vsBase[k].spin}` : ''));
  }
}

await page.close();
await browser.close();
out.pageErrors = pageErrors;
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log('wrote', OUT, 'pageErrors', pageErrors.length);

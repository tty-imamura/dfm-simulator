// 第261便a W1「空間メッシュの UI 3 件 — gain=1 の安定描画・指数スライダー・原点規則」(第53報)。
//
// 原仮定者(第53報): 「空間メッシュが、『引きずりの度合』が『1』の時に適切に描画される様にする。
//   歪みを質量の合計に反比例させるなど、どのサンプルでも安定化させる。『τ 固定』を変えても歪みが
//   変わらない様にする」「『引きずりの度合』のスライダーは、『0』から『10』を指数的に変化させる。
//   直値で『100』などの大きな値も入力可能にする」「空間メッシュの原点は、質量上位2粒子の重心と
//   する。2粒子目と3粒子目が同じ質量の場合は、無視して1粒子目を原点にする」。
//
// **表示専用**である —— presetSig・S.params・力学には 1 bit も入らない(§bit が突き合わせる)。
// 本器が書くのは**測った数だけ**である(予想は書かない・Failure First)。
//
// ■ 節(--now --norm --tau --origin --slider --bit・複数指定可・無指定は --bit 以外の全部)
//   now    : §1 **現状**(原点=全粒子重心・規格化なし)の gain=1 をメッシュ対応の全サンプルで測る。
//            同じ組み合わせを基点 html でも測って**一致**を確認する(退行の門)
//   norm   : §2 規格化 3 案(none / cell / mass)× gain 1 の比較表(最大変位/セル幅・折返し)
//   tau    : §3 τ 固定 ON/OFF・τ=0.5/2/100 で格子がビット同一か
//   origin : §4 原点規則の境界表(2 体・3 体同質量・全同質量・負質量・0 質量・1 体)
//   slider : §5 指数スライダーの位置 ↔ 値・直値・旧 localStorage 値の写像
//   bit    : §6 全内蔵プリセット × 600 步を基点 html と突き合わせる(1 bit 不変)
//
// 実行: node tests/exp-w261a-meshgain.mjs [--節...]
//       W261A_BASE=<基点 html>(既定 beta/_w261_base.html = git show 09899d2:beta/index.html)
// 出力: tests/out/meshgain-w261a.json(数値は docs/PHYSICS.md〔第261便a〕へ全載)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const INDEX = 'file://' + path.join(ROOT, process.env.QA_TARGET || 'beta/index.html');
const BASE = 'file://' + (process.env.W261A_BASE || path.join(ROOT, 'beta', '_w261_base.html'));
const OUT = path.join(ROOT, 'tests', 'out', 'meshgain-w261a.json');
const argv = process.argv.slice(2).filter((a) => a.startsWith('--')).map((a) => a.slice(2));
const want = (k) => argv.length ? argv.includes(k) : (k !== 'bit');

const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
const errs = [];
async function openPage(url) {
  const p = await browser.newPage();
  p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto(url, { waitUntil: 'load' });
  await p.waitForFunction(() => window.HP && HP.sim);
  return p;
}
const page = await openPage(INDEX);
const R = { sections: argv.length ? argv : 'default' };

// 1 つの sim について「メッシュを mesh モードで宣言 → 再構築 → 観測口を読む」評価器。
// **旧版(基点 html)にも在る鍵だけ**を読む経路と、第261便a で足した鍵も読む経路を分ける
const SWEEP = `(function(ids, opt){
  const out = [];
  for (const id of ids) {
    let row = { id };
    try {
      HP.loadPreset(id, false);
      const S = HP.sim;
      const ov = { mode: 'mesh', gain: opt.gain };
      if (opt.norm) ov.norm = opt.norm;
      if (opt.origin) ov.origin = opt.origin;
      if (opt.tau !== undefined && opt.tau !== null) ov.tau = opt.tau;
      S.overlays.spaceMesh = ov;
      HP.spaceGridInvalidate(S); HP.spaceGridEnsure(S);
      const st = HP.spaceGridNow(S);
      row.emoji = (HP.currentPreset() || {}).emoji || '';
      row.n = S.n;
      if (!st || !st.grid) { row.grid = null; out.push(row); continue; }
      const G = st.grid;
      row.kind = st.kind; row.note = st.note;
      row.cx = G.cx; row.cy = G.cy; row.R = G.R; row.h = G.h;
      row.vRef = G.vRef; row.tau = G.tau;
      row.nOk = G.nOk; row.nodes = G.nodes; row.nInvalid = G.nInvalid;
      row.folds = G.folds; row.folded = G.folded; row.minArea = G.minAreaRatio;
      row.loopMax = G.loopMax; row.chi = G.chi; row.still = G.still;
      if (G.X) { // 第261便a の観測口(基点 html には無い)
        let d = 0, bad = 0;
        for (let j = 0; j < G.K; j++) for (let i = 0; i < G.K; i++) {
          const k = j * G.K + i;
          const q = Math.hypot(G.X[k] - (G.cx - G.R + i * G.h), G.Y[k] - (G.cy - G.R + j * G.h));
          if (!Number.isFinite(G.X[k]) || !Number.isFinite(G.Y[k])) bad++;
          else if (q > d) d = q;
        }
        // **交点が立った節点だけ**を数える(AOK=0 の節点は X=0 のままなので、素朴に全節点で
        // 測ると「原点までの距離」が最大変位として出てしまう —— 最初の掃引で実際に出た)
        row.dispAllNodes = d / G.h; row.nonFinite = bad;
        row.dispMax = G.dispMax; row.dispCell = G.dispCell;
        row.norm = G.norm; row.tauRef = G.tauRef;
        row.originRule = st.originRule; row.originGap = st.originGap;
        row.baseLen = st.baseLen;
      }
    } catch (e) { row.err = String(e && e.message || e); }
    out.push(row);
  }
  return out;
})`;

async function sweep(pg, opt) {
  const ids = await pg.evaluate(() => HP.allPresets().map((p) => p.id));
  return pg.evaluate(([src, ids2, o]) => eval(src)(ids2, o), [SWEEP, ids, opt]);
}

// ============================================================ §1 現状(gain=1)
if (want('now')) {
  const cur = await sweep(page, { gain: 1, norm: 'none', origin: 'centroid' });
  const basePage = await openPage(BASE);
  const bas = await sweep(basePage, { gain: 1 });
  await basePage.close();
  const bmap = new Map(bas.map((r) => [r.id, r]));
  let same = 0, diff = [];
  for (const r of cur) {
    const b = bmap.get(r.id);
    if (!b) continue;
    const keys = ['cx', 'cy', 'R', 'h', 'vRef', 'tau', 'nOk', 'nodes', 'nInvalid', 'folds',
      'minArea', 'loopMax', 'chi', 'kind', 'note'];
    const bad = keys.filter((k) => JSON.stringify(r[k]) !== JSON.stringify(b[k]));
    if (bad.length) diff.push({ id: r.id, bad: bad.map((k) => [k, r[k], b[k]]) });
    else same++;
  }
  const drawn = cur.filter((r) => r.grid !== null && r.dispCell !== undefined);
  drawn.sort((a, b) => b.dispCell - a.dispCell);
  R.now = {
    presets: cur.length, drawn: drawn.length,
    foldedAt1: drawn.filter((r) => r.folded).map((r) => r.emoji + r.id),
    dispCellMax: drawn.length ? drawn[0].dispCell : null,
    dispCellMin: drawn.length ? drawn[drawn.length - 1].dispCell : null,
    nonFinite: drawn.filter((r) => r.nonFinite > 0).map((r) => r.id),
    baseMatch: { same, diff },
    rows: drawn.map((r) => ({ id: r.id, emoji: r.emoji, kind: r.kind, n: r.n,
      dispCell: r.dispCell, minArea: r.minArea, folds: r.folds, vRef: r.vRef, tau: r.tau,
      nOk: r.nOk + '/' + r.nodes })),
  };
  console.log('§1 現状 gain=1: 描けた', drawn.length, '/', cur.length,
    '・最大変位/セル幅 max', drawn[0] && drawn[0].dispCell.toFixed(3),
    'min', drawn.length && drawn[drawn.length - 1].dispCell.toFixed(4),
    '・折返し', R.now.foldedAt1.length, '本 ・基点一致', same, '本(差', diff.length, '本)');
}

// ============================================================ §2 規格化 3 案
if (want('norm')) {
  const out = {};
  for (const nm of ['none', 'cell', 'mass']) {
    const rows = await sweep(page, { gain: 1, norm: nm });
    const drawn = rows.filter((r) => r.grid !== null && r.dispCell !== undefined);
    const dc = drawn.map((r) => r.dispCell).filter((z) => Number.isFinite(z));
    dc.sort((a, b) => a - b);
    out[nm] = {
      drawn: drawn.length,
      dispCellMin: dc[0], dispCellMed: dc[Math.floor(dc.length / 2)], dispCellMax: dc[dc.length - 1],
      spread: dc[dc.length - 1] / (dc[0] || NaN),
      folded: drawn.filter((r) => r.folded).map((r) => r.emoji + r.id),
      nonFinite: drawn.filter((r) => r.nonFinite > 0).map((r) => r.id),
      rows: drawn.map((r) => ({ id: r.id, emoji: r.emoji, dispCell: r.dispCell,
        minArea: r.minArea, folds: r.folds, tau: r.tau })),
    };
    console.log('§2 norm=' + nm + ': 描けた', drawn.length,
      '・変位/セル幅 min', dc[0] && dc[0].toExponential(3), 'med',
      dc[Math.floor(dc.length / 2)] && dc[Math.floor(dc.length / 2)].toFixed(4),
      'max', dc[dc.length - 1] && dc[dc.length - 1].toFixed(4),
      '・折返し', out[nm].folded.length, '本');
  }
  // gain の効き方(採用案で 0 / 1 / 10 / 100)
  out.gainSweep = {};
  for (const g of [0, 0.5, 1, 2, 10, 100]) {
    const rows = await sweep(page, { gain: g, norm: 'cell' });
    const drawn = rows.filter((r) => r.dispCell !== undefined && r.grid !== null);
    const dc = drawn.map((r) => r.dispCell).filter(Number.isFinite).sort((a, b) => a - b);
    out.gainSweep[g] = { min: dc[0], max: dc[dc.length - 1],
      folded: drawn.filter((r) => r.folded).length, drawn: drawn.length };
  }
  console.log('§2 gain 掃引(cell):', JSON.stringify(out.gainSweep));
  R.norm = out;
}

// ============================================================ §3 τ 不変
if (want('tau')) {
  const ids = ['spaceMeshBinaryToy', 'galaxyMeshSpiral', 'boxBinaryToy', 'mercury'];
  const out = await page.evaluate((ids2) => {
    const res = {};
    const hash = (G) => { let a = 0x811c9dc5;
      const buf = new ArrayBuffer(8), f = new Float64Array(buf), u = new Uint8Array(buf);
      const push = (v) => { f[0] = v; for (let b = 0; b < 8; b++) { a ^= u[b]; a = Math.imul(a, 0x01000193) >>> 0; } };
      for (let k = 0; k < G.X.length; k++) { push(G.X[k]); push(G.Y[k]); }
      return a.toString(16); };
    for (const id of ids2) {
      try {
        HP.loadPreset(id, false);
      } catch (e) { res[id] = { err: String(e) }; continue; }
      const S = HP.sim;
      const row = {};
      for (const nm of ['none', 'cell', 'mass']) {
        const hs = {};
        for (const t of [null, 0.5, 2, 100]) {
          const ov = { mode: 'mesh', gain: 1, norm: nm };
          if (t !== null) ov.tau = t;
          S.overlays.spaceMesh = ov;
          HP.spaceGridInvalidate(S); HP.spaceGridEnsure(S);
          const st = HP.spaceGridNow(S);
          hs[String(t)] = st && st.grid ? { h: hash(st.grid), tau: st.grid.tau,
            disp: st.grid.dispCell, decl: st.grid.tauDecl } : null;
        }
        const ks = Object.keys(hs);
        row[nm] = { hashes: hs,
          allSame: ks.every((k) => hs[k] && hs[ks[0]] && hs[k].h === hs[ks[0]].h) };
      }
      res[id] = row;
    }
    return res;
  }, ids);
  R.tau = out;
  for (const id of Object.keys(out)) {
    const r = out[id];
    console.log('§3 τ 不変', id, Object.keys(r).map((nm) => nm + '=' + (r[nm] && r[nm].allSame)).join(' '));
  }
}

// ============================================================ §4 原点規則
if (want('origin')) {
  const out = await page.evaluate(() => {
    const mk = (bodies) => ({ name: 'x', description: 'd', emoji: '🕸',
      bodies: bodies.map((b) => ({ type: 'single', m: b[0], radius: 1, x: b[1], y: b[2],
        vx: 0, vy: 0, spin: 0, pinned: false })),
      camera: { scale: 100 }, world: { boundary: 'none', size: 0 },
      overlays: { spaceMesh: { mode: 'mesh' } } });
    const cases = {
      '2 体(等質量)': [[1, -10, 0], [1, 10, 0]],
      '2 体(質量比 9:1)': [[9, -10, 0], [1, 10, 0]],
      '3 体(m3 < m2)': [[10, -10, 0], [5, 10, 0], [1, 0, 20]],
      '3 体(m2=m3 厳密)': [[10, -10, 0], [5, 10, 0], [5, 0, 20]],
      '3 体(m2/m3 = 1+1e-12)': [[10, -10, 0], [5 * (1 + 1e-12), 10, 0], [5, 0, 20]],
      '3 体(m2/m3 = 1+1e-6)': [[10, -10, 0], [5 * (1 + 1e-6), 10, 0], [5, 0, 20]],
      '全同質量 3 体': [[2, -10, 0], [2, 10, 0], [2, 0, 20]],
      '1 体': [[3, 7, -2]],
      '負質量 2 位': [[10, -10, 0], [-6, 10, 0], [1, 0, 20]],
      '0 質量 2 位': [[10, -10, 0], [0, 10, 0], [0, 0, 20]],
      '全 0 質量': [[0, -10, 0], [0, 10, 0]],
    };
    const res = {};
    for (const k of Object.keys(cases)) {
      const v = HP.validatePreset(mk(cases[k]));
      HP.sim.build(v.preset);
      const S = HP.sim;
      // 検証器は m を下限で丸める(0・負は通らない)ので、**境界は S.m へ直接書いて**測る
      // —— 原点規則は表示専用の純粋な読み取りなので、力学を走らせずに読める
      for (let i = 0; i < S.n && i < cases[k].length; i++) S.m[i] = cases[k][i][0];
      const o = HP.spaceMeshOrigin(S);
      const bc = HP.massCentreOf(S);
      HP.spaceGridInvalidate(S); HP.spaceGridEnsure(S);
      const st = HP.spaceGridNow(S);
      res[k] = { origin: o ? [o.c[0], o.c[1]] : null, rule: o ? o.rule : null,
        ids: o ? o.ids : null, centroid: bc, grid: !!(st && st.grid),
        gridC: st && st.grid ? [st.grid.cx, st.grid.cy] : null,
        gridRule: st ? st.originRule : null, gap: st ? st.originGap : null };
    }
    // 内蔵サンプルの原点規則(何本が top1 に落ちるか)
    const tally = { top2: [], top1: [], none: [] };
    const gaps = [];
    for (const p of HP.allPresets()) {
      HP.loadPreset(p.id, false);
      const o = HP.spaceMeshOrigin(HP.sim);
      const bc = HP.massCentreOf(HP.sim);
      if (!o) { tally.none.push(p.emoji + p.id); continue; }
      tally[o.rule].push(p.emoji + p.id);
      if (bc) gaps.push({ id: p.id, emoji: p.emoji, rule: o.rule,
        gap: Math.hypot(o.c[0] - bc[0], o.c[1] - bc[1]) });
    }
    gaps.sort((a, b) => b.gap - a.gap);
    return { cases: res, tally: { top2: tally.top2.length, top1: tally.top1.length,
      none: tally.none.length, top1List: tally.top1.slice(0, 40), noneList: tally.none },
      gapTop: gaps.slice(0, 12) };
  });
  R.origin = out;
  console.log('§4 原点: 内蔵 top2', out.tally.top2, '本 / top1', out.tally.top1, '本 / 原点なし', out.tally.none, '本');
  for (const k of Object.keys(out.cases)) {
    const c = out.cases[k];
    console.log('   ', k, '→', c.rule, JSON.stringify(c.origin), '重心との差', c.gap === null ? '—' : Number(c.gap).toFixed(4));
  }
}

// ============================================================ §5 指数スライダー
if (want('slider')) {
  const out = await page.evaluate(() => {
    const C = HP.spaceGridConst();
    const rng = document.getElementById('smGainRange');
    const num = document.getElementById('smGainVal');
    const pos = {};
    for (const p of [0, 1, 25, 34, 50, 67, 84, 100]) pos[p] = HP.spaceMeshGainFromPos(p);
    const round = {};
    for (const g of [0, 0.01, 0.1, 0.5, 1, 2, 10]) round[g] = HP.spaceMeshGainToPos(g);
    const typed = {};
    for (const v of [0, 0.003, 1, 100, 9999, 1e5, -5, NaN]) typed[String(v)] = HP.setSpaceMeshGain(v);
    // 旧 localStorage 値(第257便c〜第260便: 0〜2・刻み 0.05)の写像
    const legacy = {};
    for (const v of ['0', '0.05', '0.5', '1', '1.5', '2']) {
      localStorage.setItem('hp_sm_gain', v);
      legacy[v] = { accepted: Number(v) >= 0 && Number(v) <= C.gainCap, pos: HP.spaceMeshGainToPos(Number(v)) };
    }
    HP.setSpaceMeshGain(1);
    return { const: C, slider: { min: +rng.min, max: +rng.max, step: +rng.step, value: rng.value },
      numVal: num.value, pos, round, typed, legacy };
  });
  R.slider = out;
  console.log('§5 スライダー: 位置', JSON.stringify(out.slider), '・位置→値', JSON.stringify(out.pos));
  console.log('   直値', JSON.stringify(out.typed), '・旧値', JSON.stringify(out.legacy));
}

// ============================================================ §6 力学 1 bit 不変
if (want('bit')) {
  const HASH = `(function(steps){
    const hash = (T) => { let a = 0x811c9dc5;
      const buf = new ArrayBuffer(8), f = new Float64Array(buf), u = new Uint8Array(buf);
      const push = (v) => { f[0] = v; for (let b = 0; b < 8; b++) { a ^= u[b]; a = Math.imul(a, 0x01000193) >>> 0; } };
      for (const k of ['x','y','vx','vy','spin','R','m','clock']) { const A = T[k]; if (!A || !A.length) continue;
        for (let i = 0; i < T.n; i++) push(A[i]); }
      push(T.t); return a.toString(16); };
    const out = {};
    for (const p of HP.allPresets()) {
      HP.loadPreset(p.id, false);
      const T = HP.sim;
      for (let i = 0; i < steps; i++) T.step(0.016);
      out[p.id] = hash(T) + '|' + T.hasNaN() + '|' + T.clampVN + '|' + T.clampSN + '|' + presetSig(p);
    }
    return out;
  })`;
  const a = await page.evaluate((src) => eval(src)(600), HASH);
  const bp = await openPage(BASE);
  const b = await bp.evaluate((src) => eval(src)(600), HASH);
  await bp.close();
  const ids = Object.keys(b);
  const bad = ids.filter((k) => a[k] !== b[k]);
  R.bit = { presets: ids.length, same: ids.length - bad.length, diff: bad.slice(0, 10),
    sigDiff: ids.filter((k) => String(a[k]).split('|')[4] !== String(b[k]).split('|')[4]).slice(0, 10) };
  console.log('§6 1 bit 不変: 一致', R.bit.same, '/', ids.length, bad.length ? ('差 ' + bad.join(' ')) : '');
}

R.pageErrors = errs;
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
console.log('→', path.relative(ROOT, OUT), '・pageErrors', errs.length);
await browser.close();

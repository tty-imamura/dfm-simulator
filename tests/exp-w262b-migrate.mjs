// 第262便b(第54報 W2「コアV2からの移行が可能な様に整備する」)の実測器。
//
// 測るもの(すべて実測 —— 予想は書かない):
//   ① **内蔵 121 本の移行レポート**: HP.coreV2MigrateReport(preset) を全プリセットに掛け、
//      convertible / naked / cavity / needsResolve / rejected の件数と id を出す。
//      あわせて **build 後**(m・R が解決した状態)の分類も出す(手続き生成の粒子を含む)。
//   ② **変換前後の遠方/近傍差**: コア V2 の粒子を層へ移行したときの重力差。
//      (a) 純関数 HP.dfmLayerGravity の aPoint/aLayered/da を d で並べた表、
//      (b) **実エンジンの 1 步 Δv/dt**(移行前 html/移行後 html ではなく、同じ html の
//          「移行しない/移行する」)で d=3/30/100 の Δa。
//   ③ **移行計画の中身**: I_c=½M_cRc²ζ・J_z=I_cω cosθ・J_x=I_cω sinθ・回転 E とその z 投影。
//      傾いたコア(🪩 bhCoreTilt)と JSON 形の両方で出す。
//   ④ **非有限の拒否**(統括が設定した検証仮説 (4)): _setBodyLayers に Infinity を渡して
//      基点 html と現行 html を比べる(基点は受理して根の m が Infinity になる)。
//   ⑤ **UI**: 切り替えボタンが m 欄の上にあるか・タブの並び(根 + 層1…)・
//      3 幅(1280/1024/800)でのパネル寸法と見切れ(scrollHeight 対 clientHeight・はみ出し画素)。
//
// 使い方: node tests/exp-w262b-migrate.mjs [基点html] [現行html]
//   既定: beta/_w262_base.html beta/index.html
//   結果 JSON は W262B_OUT(既定 tests/out/w262b-migrate.json)・スクリーンショットは W262B_SHOTS
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.argv[2] || 'beta/_w262_base.html';
const CUR = process.argv[3] || 'beta/index.html';
const OUT = process.env.W262B_OUT || path.join(ROOT, 'tests', 'out', 'w262b-migrate.json');
const SHOTS = process.env.W262B_SHOTS || '';
const abs = (t) => (path.isAbsolute(t) ? t : path.join(ROOT, t));

const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }

const DS = [1, 3, 5, 7, 10, 20, 100, 1000];

async function open(target, viewport) {
  const page = await browser.newPage(viewport ? { viewport } : {});
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e.message || e)));
  await page.goto('file://' + abs(target), { waitUntil: 'load' });
  await page.waitForFunction(() => window.HP && HP.sim);
  return { page, errs };
}

// ---------- ①②③④(計算系) ----------
async function probe(target) {
  const { page, errs } = await open(target);
  const r = await page.evaluate((ds) => {
    const O = { has: {}, errs: [] };
    O.has.plan = typeof HP.coreV2MigrationPlan === 'function';
    O.has.report = typeof HP.coreV2MigrateReport === 'function';
    O.has.toLayers = typeof HP.coreV2ToLayers === 'function';

    // ---- ① 内蔵 121 本の移行レポート(JSON 宣言の段) ----
    const ps = HP.allPresets();
    O.nPresets = ps.length;
    if (O.has.report) {
      const tot = { convertible: 0, naked: 0, cavity: 0, needsResolve: 0, rejected: 0 };
      const ids = { convertible: [], naked: [], cavity: [], needsResolve: [], rejected: [] };
      const byReason = {};
      let nCore = 0;
      for (const p of ps) {
        const rep = HP.coreV2MigrateReport(p);
        if (!rep.nCore) continue;
        nCore += rep.nCore;
        for (const k of Object.keys(tot)) {
          tot[k] += rep.counts[k] || 0;
          if (rep.counts[k]) ids[k].push((p.emoji || '') + p.id + '×' + rep.counts[k]);
        }
        for (const k of Object.keys(rep.byReason)) byReason[k] = (byReason[k] || 0) + rep.byReason[k];
      }
      O.report = { nCore, counts: tot, ids, byReason };
    }
    // ---- ① build 後の分類(m・R が解決した状態・手続き生成を含む) ----
    if (O.has.plan) {
      const tot = { convertible: 0, naked: 0, cavity: 0, rejected: 0 };
      const rows = [];
      for (const p of ps) {
        const hasCore = (p.bodies || []).some((b) => b && b.core);
        if (!hasCore) continue;
        HP.loadPreset(p.id, false);
        const S = HP.sim; const c = { convertible: 0, naked: 0, cavity: 0, rejected: 0 }; const why = {};
        for (let i = 0; i < S.n; i++) {
          if (!S.coreMd[i]) continue;
          const md = S.coreMd[i];
          const mode = (md === 1) ? 'rigid' : ((md === 3) ? 'active' : ((md === 4) ? 'cavity' : 'differential'));
          const pl = HP.coreV2MigrationPlan({ m: S.m[i], R: S.R[i], spin: S.spin[i],
            core: { mode, massFrac: S.coreMF[i], radius: S.RcV[i], inertiaScale: S.coreIS[i],
              Jz: S.coreJ[i], Jmag: S.coreJm ? S.coreJm[i] : Math.abs(S.coreJ[i]) } });
          let cls;
          if (pl.ok) cls = (pl.Ms > 0) ? 'convertible' : 'naked';
          else if (pl.reason === 'cavityHasNoMass') cls = 'cavity';
          else { cls = 'rejected'; why[pl.reason] = (why[pl.reason] || 0) + 1; }
          c[cls]++; tot[cls]++;
        }
        rows.push({ id: (p.emoji || '') + p.id, c, why });
      }
      O.built = { counts: tot, rows: rows.filter((x) => x.c.rejected || x.c.cavity || x.c.naked) ,
        nRows: rows.length, total: rows.reduce((a, x) => a + x.c.convertible + x.c.naked + x.c.cavity + x.c.rejected, 0) };
    }
    // ---- ② (a) 純関数の遠方/近傍表 ----
    if (O.has.toLayers) {
      const cv = HP.coreV2ToLayers({ mode: 'differential', massFrac: 0.3, radius: 5, J: 12 },
        { m: 100, R: 10, spin: 0.5 });
      O.grav = cv.ok ? ds.map((d) => { const g = HP.dfmLayerGravity(cv.layers, d, { G: 1, eps: 0.5 });
        return { d, aPoint: g.aPoint, aLayered: g.aLayered, da: g.da }; }) : null;
      O.gravLayers = cv.ok ? cv.layers : null;
      // 変換表の 4 行(rigid/differential/active・cavity・massFrac=1・Rc≥R)
      O.table = {
        differential: HP.coreV2ToLayers({ mode: 'differential', massFrac: 0.3, radius: 5, J: 12 }, { m: 100, R: 10, spin: 0.5 }),
        rigid: HP.coreV2ToLayers({ mode: 'rigid', massFrac: 0.3, radius: 5 }, { m: 100, R: 10, spin: 0.5 }),
        active: HP.coreV2ToLayers({ mode: 'active', massFrac: 0.3, radius: 5 }, { m: 100, R: 10, spin: 0.5 }),
        cavity: HP.coreV2ToLayers({ mode: 'cavity', massFrac: -0.4, radius: 3 }, { m: 10, R: 8 }),
        naked: HP.coreV2ToLayers({ mode: 'rigid', massFrac: 1, radius: 3 }, { m: 10, R: 8 }),
        outside: HP.coreV2ToLayers({ mode: 'rigid', massFrac: 0.5, radius: 12 }, { m: 10, R: 8 }),
        negative: HP.coreV2ToLayers({ mode: 'rigid', massFrac: 0.5, radius: 3 }, { m: -10, R: 8 })
      };
    }
    // ---- ② (b) 実エンジンの 1 步 Δa(移行しない/する) ----
    {
      const mkP = (bodies) => ({ id: 'w262b', name: 'w262b', emoji: '🧪',
        description: 'w262b の器。E4 の重力だけを見る。',
        camera: { scale: 300 }, world: { boundary: 'none', size: 0 }, seed: 1,
        physics: { G: 1, D0: 0, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, kappaT: 1 / 60,
          cLight: 30, contactK: 0, contactCap: 0, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
          geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.5, timeScale: 1 },
        bodies, overlays: {} });
      const run = (d, convert) => {
        const bs = [
          { type: 'single', m: 100, radius: 10, x: 0, y: 0, vx: 0, vy: 0, pinned: true, spin: 0,
            core: { mode: 'differential', massFrac: 0.3, radius: 5, omega: 0 } },
          { type: 'single', m: 1e-6, radius: 0.01, x: d, y: 0, vx: 0, vy: 0, spin: 0, pinned: false }];
        const v = HP.validatePreset(mkP(bs));
        const S = HP.sim; S.build(v.preset);
        if (convert) {
          // 基点 html には移行計画が無いので、同じ写像の coreV2ToLayers で作る(層の中身は同一)
          const pl = (typeof HP.coreV2MigrationPlan === 'function')
            ? HP.coreV2MigrationPlan({ m: S.m[0], R: S.R[0], spin: S.spin[0],
              core: { mode: 'differential', massFrac: S.coreMF[0], radius: S.RcV[0],
                inertiaScale: S.coreIS[0], Jz: S.coreJ[0], Jmag: S.coreJm ? S.coreJm[0] : 0 } })
            : HP.coreV2ToLayers({ mode: 'differential', massFrac: S.coreMF[0], radius: S.RcV[0], J: S.coreJ[0] },
              { m: S.m[0], R: S.R[0], spin: S.spin[0] });
          if (!pl.ok) return { d, convert, err: pl.reason };
          const st = S._setBodyLayers(0, pl.layers);
          if (!st.ok) return { d, convert, err: st.reason };
        }
        const dt = 0.016, v0 = S.vx[1];
        S.step(dt);
        return { d, convert, a: (S.vx[1] - v0) / dt, layN: S.layN[0], rootM: S.m[0] };
      };
      O.engine = [];
      for (const d of [3, 12, 30, 100]) {
        const a0 = run(d, false), a1 = run(d, true);
        O.engine.push({ d, aPlain: a0.a, aLayers: a1.a, da: (a1.a !== undefined && a0.a !== undefined) ? (a1.a - a0.a) : null,
          rel: (a0.a) ? ((a1.a - a0.a) / Math.abs(a0.a)) : null, err: a0.err || a1.err || null });
      }
    }
    // ---- ③ 移行計画の中身(JSON 形・傾きあり) ----
    if (O.has.plan) {
      O.plan = {
        json0: HP.coreV2MigrationPlan({ m: 100, radius: 10, spin: 0.5,
          core: { mode: 'differential', massFrac: 0.3, radius: 5, omega: 4, tilt: 0, inertiaScale: 1 } }),
        json60: HP.coreV2MigrationPlan({ m: 100, radius: 10, spin: 0.5,
          core: { mode: 'differential', massFrac: 0.3, radius: 5, omega: 4, tilt: 60, inertiaScale: 1 } }),
        active: HP.coreV2MigrationPlan({ m: 100, radius: 10, spin: 0.5,
          core: { mode: 'active', massFrac: 0.3, radius: 5, omega: 4, Kcs: 0.2, inertiaScale: 0.4 } }),
        naked: HP.coreV2MigrationPlan({ m: 10, radius: 8, spin: 0,
          core: { mode: 'rigid', massFrac: 1, radius: 3, omega: 1 } })
      };
      // 🪩 bhCoreTilt(実機の傾いたコア)
      HP.loadPreset('bhCoreTilt', false);
      const S = HP.sim;
      let idx = -1; for (let i = 0; i < S.n; i++) if (S.coreMd[i] && S.coreMd[i] !== 4) { idx = i; break; }
      if (idx >= 0) {
        O.plan.tiltLive = HP.coreV2MigrationPlan({ m: S.m[idx], R: S.R[idx], spin: S.spin[idx],
          core: { mode: 'differential', massFrac: S.coreMF[idx], radius: S.RcV[idx],
            inertiaScale: S.coreIS[idx], Jz: S.coreJ[idx], Jmag: S.coreJm[idx] } });
        O.plan.tiltLiveRaw = { Jz: S.coreJ[idx], Jm: S.coreJm[idx], Jx: S.coreJx[idx], m: S.m[idx], R: S.R[idx], Rc: S.RcV[idx], mf: S.coreMF[idx], iS: S.coreIS[idx] };
      }
    }
    // ---- ④ 非有限の拒否 ----
    {
      const mkP = (bodies) => ({ id: 'w262b2', name: 'w262b2', emoji: '🧪',
        description: 'w262b の器2。有限性の検査。',
        camera: { scale: 300 }, world: { boundary: 'none', size: 0 }, seed: 1,
        physics: { G: 1, D0: 0, kFrame: 0, q: 2, kRep: 0, muF: 0, gammaN: 0, kappaS: 0, kappaT: 1 / 60,
          cLight: 30, contactK: 0, contactCap: 0, bM: 1, etaRad: 0, pRad: 4, gravityX: 0, gravityY: 0,
          geoPN: 0, lambdaPN: 1, pnAlpha: 1.5, radiusScale: 1, softening: 0.5, timeScale: 1 },
        bodies, overlays: {} });
      const v = HP.validatePreset(mkP([{ type: 'single', m: 1000, radius: 100, x: 0, y: 0, vx: 0, vy: 0,
        spin: 0, pinned: true,
        layers: [{ role: 'core', m: 900, r: 20 }, { role: 'shell', m: 100, r: 100 }] }]));
      const S = HP.sim; S.build(v.preset);
      const m0 = S.m[0], l0 = S.layM[0];
      const t = {};
      t.inf = S._setBodyLayers(0, [{ role: 'core', m: Infinity, r: 20 }, { role: 'shell', m: 100, r: 100 }]);
      t.mAfterInf = S.m[0]; t.layAfterInf = S.layM[0];
      t.big = S._setBodyLayers(0, [{ role: 'core', m: 1e300, r: 20 }, { role: 'shell', m: 1e300, r: 100 }]);
      t.mAfterBig = S.m[0];
      t.rInf = S._setBodyLayers(0, [{ role: 'core', m: 900, r: Infinity }]);
      t.jInf = S._setBodyLayers(0, [{ role: 'core', m: 900, r: 20, J: Infinity }]);
      t.m0 = m0; t.l0 = l0; t.mEnd = S.m[0]; t.layEnd = S.layM[0];
      t.ok = S._setBodyLayers(0, [{ role: 'core', m: 800, r: 20 }, { role: 'shell', m: 100, r: 100 }]);
      t.mOk = S.m[0];
      O.finite = t;
    }
    return O;
  }, DS);
  r.pageErrors = errs;
  await page.close();
  return r;
}

// ---------- ⑤ UI(3 幅) ----------
async function ui(target) {
  const O = { widths: [] };
  // 3 幅(1280/1024/800)+ **縦が短い 800×420**(max-height が効くか = 見切れの本番)
  for (const [w, h] of [[1280, 720], [1024, 720], [800, 720], [800, 420]]) {
    const { page, errs } = await open(target, { width: w, height: h });
    const z = await page.evaluate(() => {
      const o = {};
      const has = !!document.querySelector('#beLayToggle');
      o.hasToggle = has;
      HP.loadPreset('layeredCoreDFM', false);
      HP.selectBody(0, 'A');
      const el = document.querySelector('#bodyEdit');
      const mRow = document.querySelector('#beM') ? document.querySelector('#beM').closest('.beRow') : null;
      const tgRow = document.querySelector('#beLayToggleRow');
      // 切り替えボタンは m 欄より上か(DOM 順序と画面座標の両方で見る)
      if (tgRow && mRow) {
        o.toggleBeforeM = !!(tgRow.compareDocumentPosition(mRow) & Node.DOCUMENT_POSITION_FOLLOWING);
        o.toggleTop = tgRow.getBoundingClientRect().top;
        o.mTop = mRow.getBoundingClientRect().top;
        o.toggleAboveM = o.toggleTop < o.mTop;
      }
      const geo = () => { const r = el.getBoundingClientRect();
        const wrap = document.querySelector('#canvasWrap').getBoundingClientRect();
        return { h: r.height, w: r.width, bottom: r.bottom, wrapBottom: wrap.bottom,
          overflowPx: Math.max(0, r.bottom - wrap.bottom),
          scrollH: el.scrollHeight, clientH: el.clientHeight,
          scrollW: el.scrollWidth, clientW: el.clientWidth,
          xOverflow: el.scrollWidth - el.clientWidth }; };
      o.closed = geo();
      if (has) {
        document.querySelector('#beLayToggle').click();
        o.open = geo();
        o.tabs = Array.from(document.querySelectorAll('#beLayTabs button')).map((b) => b.textContent);
        o.baseHidden = document.querySelector('#beBaseRows').style.display === 'none';
        o.layShown = document.querySelector('#beLayers').style.display === 'block';
        document.querySelector('#beLayToggle').click();
        o.backShown = document.querySelector('#beBaseRows').style.display !== 'none';
      } else {
        // 基点 html: details を開いた状態の高さ
        const d = document.querySelector('#beLayers');
        if (d) { d.open = true; o.open = geo();
          o.tabs = Array.from(document.querySelectorAll('#beLayTabs button')).map((b) => b.textContent); }
      }
      return o;
    });
    if (SHOTS) {
      fs.mkdirSync(SHOTS, { recursive: true });
      const tag = path.basename(target).replace(/\W+/g, "_");
      await page.screenshot({ path: path.join(SHOTS, `${tag}-${w}x${h}.png`) });
      if (z.hasToggle) {
        await page.evaluate(() => document.querySelector('#beLayToggle').click());
        await page.screenshot({ path: path.join(SHOTS, `${tag}-${w}x${h}-layers.png`) });
      }
    }
    z.width = w; z.height = h; z.pageErrors = errs;
    O.widths.push(z);
    await page.close();
  }
  return O;
}

const out = { base: BASE, cur: CUR,
  probeBase: await probe(BASE), probeCur: await probe(CUR),
  uiBase: await ui(BASE), uiCur: await ui(CUR) };
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log(JSON.stringify({
  report: out.probeCur.report ? out.probeCur.report.counts : null,
  built: out.probeCur.built ? out.probeCur.built.counts : null,
  engine: out.probeCur.engine,
  finiteBase: { inf: out.probeBase.finite.inf, mAfterInf: out.probeBase.finite.mAfterInf },
  finiteCur: { inf: out.probeCur.finite.inf, mAfterInf: out.probeCur.finite.mAfterInf },
  ui: out.uiCur.widths.map((w) => ({ w: w.width + "x" + w.height, aboveM: w.toggleAboveM, tabs: w.tabs,
    closedOverflow: w.closed.overflowPx, openOverflow: w.open ? w.open.overflowPx : null,
    xOverflow: w.closed.xOverflow })),
  uiBaseOverflow: out.uiBase.widths.map((w) => ({ w: w.width + "x" + w.height, closed: w.closed.overflowPx,
    open: w.open ? w.open.overflowPx : null, tabs: w.tabs })),
  errs: { base: out.probeBase.pageErrors, cur: out.probeCur.pageErrors }
}, null, 1));
console.log('wrote ' + OUT);
await browser.close();

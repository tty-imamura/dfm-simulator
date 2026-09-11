// 第255便c W3「表示 —— 空間線・重心マーカー・サンプルを選ぶ UI・N7」(第47報)の実測ハーネス。
//
// 原仮定者(第47報): 「表示は、『光線』の表示を参考に、主要天体から基準となる方向に『空間線』を
//   複数本飛ばして描画する方法を検討する」「連星での中間地点の表示は、重心地点に変える」
//   「処理を軽くする工夫をする」「サンプルを選ぶ UI: 絞り込みで、グループの絞り込みを無くす/
//   サンプル一覧は、グループ毎に畳んだ状態にする」。
//
// ■ 節(すべて実測。予想は 1 つも書かない)
//   ODE  : 線の ODE dx/dτ=u+c_line ê・dê/dτ=(I−êêᵀ)Bê の中点法を**解析解**と突き合わせる。
//          剛体回転 u=Ω J x では x(τ)=c_line τ (cos Ωτ, sin Ωτ) が厳密解。Ω=0.2・c_line=1・τ=1 で
//          (0.9800665778, 0.1986693308)。区間数を 8→128 と振って 2 次収束を確かめる。
//          無流・無勾配では直線、純粋なずり(B 対称)では ê が回らないことも見る。
//   COST : 「処理を軽くする工夫」の実測。①線束 1 回の再構築 ②キャッシュ読み ③1 フレーム描画
//          (空間線 OFF / lines / guide / transport)を品質 3 段で測る。銀河の局所場は O(N) なので
//          bgGrad:"zero"(∇u_bg を落とす近似)の**速さと線の形の差**も併記する。
//   BIT  : **全内蔵プリセット × 600 步(dt=0.016)** の状態ハッシュと presetSig を基点 html と
//          突き合わせる(表示便なので状態は全本一致・署名は意図した 2 本だけが動く)。
//
// **第256便c の注記(履歴として残す)**: `overlays.spaceMesh` の値域が 1 形({mode:…})になり、
//   `overlays.spaceMeshMode` は旧形の入力としてしか読まれなくなったので、本器の COST 節が
//   `S.overlays.spaceMeshMode` を差し替える行は**もう表示モードを切り替えない**(どのモードも
//   宣言側の {mode} のまま測られる)。4 モードの 1 フレーム描画は tests/exp-w256c-display.mjs --cost
//   が測る。本器は第255便c の実測の再現用にそのまま残す(数値は docs/PHYSICS.md 〔第255便c〕)。
//
// 実行: node tests/exp-w255c-lines.mjs [--ode] [--cost] [--bit] [--fast]
//       W255C_BASE=<基点 html のパス> で BIT の基点を指定する(既定 tests/out/base-w255c.html)
// 出力: tests/out/spacelines-w255c.json(.gitignore 既定どおり未コミット — 数値は PHYSICS に全載)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + path.join(ROOT, TARGET);
const OUT = path.join(ROOT, 'tests', 'out', 'spacelines-w255c.json');
const BASE = process.env.W255C_BASE || path.join(ROOT, 'tests', 'out', 'base-w255c.html');
const argv = process.argv.slice(2);
const only = argv.filter((a) => a.startsWith('--') && a !== '--fast').map((a) => a.slice(2));
const want = (k) => !only.length || only.includes(k);

async function getBrowser() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  const { chromium } = await import('playwright-core');
  return chromium.launch({ executablePath: exe });
}

const out = { target: TARGET, node: process.version, at: new Date().toISOString(), wave: '255c' };
const browser = await getBrowser();
const pageErrors = [];
const pg = await browser.newPage();
pg.on('pageerror', (e) => pageErrors.push(String(e.message || e)));
await pg.goto(INDEX, { waitUntil: 'load' });
await pg.waitForFunction(() => window.HP && HP.sim && HP.currentPreset());

// ================================================================ ODE
if (want('ode')) {
  console.error('[w255c] ODE: 線の ODE(中点法)を解析解と突き合わせる');
  out.ode = await pg.evaluate(() => {
    const o = {};
    const Om = 0.2;
    const rot = (x, y) => [-Om * y, Om * x, 0, -Om, Om, 0, 1];   // 剛体回転 u=Ω J x・B=Ω J
    o.exact = [Math.cos(Om), Math.sin(Om)];
    o.conv = {};
    for (const N of [8, 16, 32, 64, 128]) {
      const l = HP.dfmSpaceLineTrace(rot, 0, 0, 1, 0, 1, 1, N);
      const ex = l.pts[2 * l.n - 2], ey = l.pts[2 * l.n - 1];
      o.conv[N] = { end: [ex, ey], err: Math.hypot(ex - o.exact[0], ey - o.exact[1]), eHat: [l.ex, l.ey] };
    }
    // 無流・無勾配 → 直線(始点 (3,−2)・ê=(0,1)・c=2・τ=5 → (3, 8))
    const zero = () => [0, 0, 0, 0, 0, 0, 1];
    const z = HP.dfmSpaceLineTrace(zero, 3, -2, 0, 1, 2, 5, 64);
    o.straight = { end: [z.pts[2 * z.n - 2], z.pts[2 * z.n - 1]], eHat: [z.ex, z.ey] };
    // 純粋なずり(B が対称)でも ê の長さは 1 のまま((I−êêᵀ) の射影が保つ)
    const sh = () => [0, 0, 0, 0.7, 0.7, 0, 1];
    const s = HP.dfmSpaceLineTrace(sh, 0, 0, 1, 0, 1, 1, 64);
    o.shear = { end: [s.pts[2 * s.n - 2], s.pts[2 * s.n - 1]], eNorm: Math.hypot(s.ex, s.ey) };
    // 場が読めない点で止まる(停止は隠さない)
    let k = 0;
    const stop = () => (k++ < 10) ? [0, 0, 0, 0, 0, 0, 1] : false;
    const st = HP.dfmSpaceLineTrace(stop, 0, 0, 1, 0, 1, 1, 64);
    o.stop = { n: st.n, full: st.full };
    o.const = HP.spaceLineConst();
    return o;
  });
  const c = out.ode.conv;
  console.error(`  厳密 (${out.ode.exact.map((v) => v.toFixed(10)).join(', ')})`);
  for (const N of Object.keys(c))
    console.error(`   N=${N}: (${c[N].end[0].toFixed(10)}, ${c[N].end[1].toFixed(10)}) 誤差 ${c[N].err.toExponential(3)}`);
  console.error(`  直線 ${JSON.stringify(out.ode.straight.end)} / ずり |ê|=${out.ode.shear.eNorm}`);
}

// ================================================================ COST
if (want('cost')) {
  console.error('[w255c] COST: 描画コスト(再構築・キャッシュ読み・1 フレーム)');
  out.cost = await pg.evaluate(async () => {
    const o = { samples: {}, frame: {}, gal: {} };
    const bench = (fn, n) => { fn(); const t0 = performance.now(); for (let i = 0; i < n; i++) fn(); return (performance.now() - t0) / n; };
    const IDS = ['boxBinaryToy', 'spaceMeshBinaryToy', 'galaxyMeshSpiral', 'lensing'];
    for (const id of IDS) {
      HP.loadPreset(id, false);
      const S = HP.sim, r = { n: S.n, mode: S.overlays.spaceMeshMode || null, q: {} };
      for (const qm of ['exact', 'auto', 'lite']) {
        HP.setQuality(qm);
        HP.spaceLineInvalidate(S); HP.spaceLineEnsure(S);
        const st = HP.spaceLineNow(S);
        r.q[qm] = { lines: st ? st.lines : 0, pts: st ? st.pts : 0, seg: st ? st.seg : 0,
          buildMs: bench(() => { HP.spaceLineInvalidate(S); HP.spaceLineEnsure(S); }, 20),
          cachedMs: bench(() => HP.spaceLineEnsure(S), 300),
          every: st ? st.every : 0, cLine: st ? st.cLine : 0, tau: st ? st.tau : 0,
          L: st ? st.L : 0, chi: st ? st.chi : 0, Om: st ? st.Om : 0, kind: st ? st.kind : null };
      }
      HP.setQuality('exact');
      o.samples[id] = r;
    }
    // 1 フレーム描画: 空間線 OFF / lines(再構築ごと)/ lines(キャッシュ)/ guide / transport
    for (const id of ['spaceMeshBinaryToy', 'galaxyMeshSpiral']) {
      HP.loadPreset(id, false); HP.setQuality('exact');
      const S = HP.sim, keep = S.overlays.spaceMesh, keepM = S.overlays.spaceMeshMode;
      const f = {};
      S.overlays.spaceMesh = false; f.off = bench(() => HP.tick(0), 30);
      S.overlays.spaceMesh = keep; S.overlays.spaceMeshMode = keepM;
      f.linesRebuild = bench(() => { HP.spaceLineInvalidate(S); HP.tick(0); }, 30);
      f.linesCached = bench(() => HP.tick(0), 60);
      if (S.n >= 2 && !(keep && typeof keep === 'object')) {
        S.overlays.spaceMesh = true; S.overlays.spaceMeshMode = 'guide';
        f.guide = bench(() => HP.tick(0), 30);
        S.overlays.spaceMeshMode = 'transport';
        f.transport = bench(() => HP.tick(0), 30);
      }
      S.overlays.spaceMesh = keep; S.overlays.spaceMeshMode = keepM;
      o.frame[id] = f;
    }
    // 銀河の局所場: 1 点評価のコストと、∇u_bg を落とす近似の速さ/形の差
    HP.loadPreset('galaxyMeshSpiral', false);
    const S = HP.sim, cx = S.x[0], cy = S.y[0];
    o.gal.n = S.n;
    o.gal.evalFullUs = bench(() => HP.dfmGalaxyMeshField(S, cx + 30, cy + 20, {}), 2000) * 1000;
    o.gal.evalNoBgGradUs = bench(() => HP.dfmGalaxyMeshField(S, cx + 30, cy + 20, { bgGrad: 'zero' }), 2000) * 1000;
    o.gal.frameAtUs = bench(() => HP.dfmFrameAt(cx + 30, cy + 20, S), 2000) * 1000;
    const mk = (opts) => (px, py) => { const g = HP.dfmGalaxyMeshField(S, px, py, opts);
      return g ? [g.u[0], g.u[1], g.gradU[0], g.gradU[1], g.gradU[2], g.gradU[3], g.chi] : false; };
    const st = HP.spaceLineNow(S) || { cLine: 2.15, tau: 222 };
    const end = (opts) => { const l = HP.dfmSpaceLineTrace(mk(opts), cx + 5, cy, 1, 0, st.cLine, st.tau, 32);
      return [l.pts[2 * l.n - 2], l.pts[2 * l.n - 1]]; };
    o.gal.endFull = end({}); o.gal.endNoBgGrad = end({ bgGrad: 'zero' });
    o.gal.endGap = Math.hypot(o.gal.endFull[0] - o.gal.endNoBgGrad[0], o.gal.endFull[1] - o.gal.endNoBgGrad[1]);
    // guide 格子の「分」= K=12 の 25×25 点(比較の分母)
    o.guideSegs = 2 * (2 * 12 + 1);
    return o;
  });
  for (const id of Object.keys(out.cost.samples)) {
    const r = out.cost.samples[id];
    console.error(`  ${id}(N=${r.n}・${r.q.exact.kind}): ` + ['exact', 'auto', 'lite']
      .map((q) => `${q} ${r.q[q].lines}本×${r.q[q].seg}区間 build ${r.q[q].buildMs.toFixed(3)}ms・cache ${r.q[q].cachedMs.toFixed(4)}ms・間隔 ${Math.round(r.q[q].every)}ms`).join(' / '));
  }
  for (const id of Object.keys(out.cost.frame)) console.error(`  frame ${id}: ${JSON.stringify(out.cost.frame[id])}`);
  console.error(`  銀河1点: full ${out.cost.gal.evalFullUs.toFixed(1)}µs / bgGrad=zero ${out.cost.gal.evalNoBgGradUs.toFixed(1)}µs / dfmFrameAt ${out.cost.gal.frameAtUs.toFixed(1)}µs・近似の終点ずれ ${out.cost.gal.endGap.toFixed(1)}`);
}

// ================================================================ BIT(全内蔵プリセット × 600 步 + presetSig)
if (want('bit') && fs.existsSync(BASE)) {
  console.error('[w255c] BIT: 全内蔵プリセット × 600 步(dt=0.016)+ presetSig を基点と突き合わせる');
  const hashAll = (page) => page.evaluate(() => {
    const h = (S) => {
      let a = 0x811c9dc5;
      const buf = new ArrayBuffer(8), f = new Float64Array(buf), u = new Uint8Array(buf);
      const push = (v) => { f[0] = v; for (let b = 0; b < 8; b++) { a ^= u[b]; a = Math.imul(a, 0x01000193) >>> 0; } };
      for (const k of ['x', 'y', 'vx', 'vy', 'spin', 'R', 'm']) { const A = S[k]; if (!A) continue;
        for (let i = 0; i < S.n; i++) push(A[i]); }
      push(S.t); return a.toString(16);
    };
    const o = { state: {}, sig: {} };
    for (const p of HP.allPresets()) {
      const v = HP.validatePreset(JSON.parse(JSON.stringify(p)));
      const S = HP.sim; S.build(v.preset);
      for (let k = 0; k < 600; k++) S.step(0.016);
      o.state[p.id] = h(S) + '|n=' + S.n + '|nan=' + S.hasNaN();
      // presetSig は非公開なので、**検証後プリセットの JSON 全体**(署名の上位集合)を突き合わせる
      o.sig[p.id] = JSON.stringify(v.preset);
    }
    return o;
  });
  const cur = await hashAll(pg);
  const pg2 = await browser.newPage();
  await pg2.goto('file://' + path.resolve(BASE), { waitUntil: 'load' });
  await pg2.waitForFunction(() => window.HP && HP.sim);
  const base = await hashAll(pg2);
  await pg2.close();
  const ids = Object.keys(cur.state), baseIds = Object.keys(base.state);
  const diffs = ids.filter((id) => cur.state[id] !== base.state[id]);
  const sigDiffs = ids.filter((id) => cur.sig[id] !== base.sig[id]);
  out.bit = { base: BASE, steps: 600, nCur: ids.length, nBase: baseIds.length, diffs, sigDiffs,
    added: ids.filter((id) => !(id in base.state)), removed: baseIds.filter((id) => !(id in cur.state)),
    identicalCount: ids.length - diffs.length,
    sigDiffDetail: sigDiffs.map((id) => ({ id,
      base: (base.sig[id].match(/"overlays":\{[^}]*\}/) || [''])[0],
      cur: (cur.sig[id].match(/"overlays":\{[^}]*\}/) || [''])[0] })) };
  console.error(`  状態: 現行 ${ids.length} 本 / 基点 ${baseIds.length} 本 — 差=${diffs.length ? diffs.join(',') : 'なし'}`);
  console.error(`  署名: 差=${sigDiffs.length ? sigDiffs.join(',') : 'なし'}`);
} else if (want('bit')) {
  console.error(`[w255c] BIT: 基点 html が無いので省略(${BASE})`);
}

out.pageErrors = pageErrors;
await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.error('[w255c] → ' + path.relative(ROOT, OUT));
if (pageErrors.length) console.error('[w255c] pageErrors: ' + pageErrors.slice(0, 3).join(' | '));

// 第282便b — geoPN=1 主系列便(原仮定者の裁定(第72報)⑤「現実較正は geoPN=1 で進め、比較に geoPN=2 または 3」・
//   統括の検証項目 R79「geoPN=1 の自由連星には契約の穴がある」)。
//
// ■ geoPN は**アプリのモード番号**である(標準理論の 2PN・3PN ではない)。
//
// ■ 何を測るか(**既存 140 本の物理は変えない** —— 本体の分岐は 1 文字も変えず、対照は器の中のコピーで行う)
//   A. 契約の穴(headless・Node の vm): 自由二体(m=2/1・距離 10・初速 0・自転 0・両体 free・pnSource・G=1・c=10・
//      ε=0.001・stateCarry:"double"・kFrame=0)を同じ状態から 1 歩。geoPN=0/1/2/3(宣言なし=検証器が 2 へ丸める・
//      トイ scalar・vMinusU+reference-1PN)と反作用返しの対照コピー(g1R)× dt 0.001/0.0005 × カーネル(特別化 pn / 汎用)。
//      Σm·v・各体の v・λ_PN=0 との差(= 1PN の速度増分)・解析の Σm·a·dt。
//   B. 重心系の束縛二体(m=2/1・a=10・e=0.3・20 公転)で Σm·v と重心の変位を時刻で記録。
//   C. ガリレイ変換: 一様な V=0/0.1/1 を足した自由二体の 1 歩の 1PN 速度増分と、束縛二体の近点移動(正式の抽出器)。
//   D. 固定源の極限: pinned 源 + 試験粒子の 1 歩の 1PN 加速度を E12 の試験粒子形(純関数)と照合・geoPN=1 と 2 のビット比較。
//   E. 自由連星の近点移動: 質量比 1/1・2/1・9/1・99/1・pinned で Δϖ/Δϖ_GR を解析(geoPN=1: 1−11ν/3・geoPN=2: 1−10ν/3)と並べる。
//   F. 主系列の見本 `mercuryGeo1KF0`(☄️ の複製で geoPN=1 —— **器の中の principle コピー・内蔵ではない**)を
//      ☄️(geoPN=2)・🔁(geoPN=3)・λ_PN=0 対照と同じ抽出器・同じ窓(近点 59 個)で dt=0.016/0.008。
//   G. 比較表(kF0・同じ入力で geoPN=1/2/3): 🌙 earthMoonReal・🥶 plutoCharonDiagInput・✨ alphaCenAB・🌟 siriusAB・
//      📻 psrDoubleAB(BH 連星は kF0∧geoPN≥1 の内蔵が無い = 未宣言)。近点移動・周期・Σm·v のドリフト。
//   H. geoPN:1 を宣言する内蔵 3 本(☿ mercury・⭐ binary・V18 の verify_v18)を反作用返しのコピーで走らせた差。
//
// ■ 測定演算子: 近点移動は正式の判定器 `tests/exp-w249b-calaudit.mjs` のページ側ヘルパ(近点抽出 A・近点位相の直線 fit)を
//   **ソースの文字列のまま**取り出して評価する(`extractCalauditHelpers` —— 写しを持たない)。F・G の停止条件は判定器と同じ
//   `stopRuleFor`(60 公転ぶんの步数・階級上限)。
//
// ■ 言わないこと: Σm·v の非保存を一般相対論の保存則の話にしない(相対論的な全運動量は Σm·v ではない)。
//   「観測一致を達成した」「較正を完了した」「kF0 版が成立した」「精度を上げれば成立する」。
//
// 環境変数: `W282B_ENGINE=node`(F・G も Node の vm で走らせる —— 既定は Chromium・約 6 倍速い)/
//   `PLAYWRIGHT_CORE_DIR`(Chromium の Playwright)/ `W282B_QUICK=1`(A〜E と H だけ —— 正本は quick:true になり QA は受けない)/
//   `QA_TARGET`(対象 html —— 既定 beta/index.html)。
// 実行: PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright node tests/exp-w282b-geo1.mjs
// 出力: tests/out/geo1-w282b.json(来歴 w272e-1 + 領域 hash。**calaudit を走らせ直したら本器も走らせ直す** —— 水星の正式値を読む)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { loadHtmlHeadless } from './lib-w279b-headless.mjs';
import { stopRuleFor, STOP_RULE_VERSION } from './lib-w270a-stoprule.mjs';
import { provenanceMeta } from './lib-w272e-provenance.mjs';
import { extractCalauditHelpers, pn1AnalyticDeg } from './lib-w280a-mercury.mjs';
import * as L from './lib-w282b-geo1.mjs';
import { scopeStamp as w281aScopeStamp, stableInputs as w281aStableInputs } from './lib-w281a-scope.mjs';
// 第281便a の規約: この器が読む html の領域(1 行の JSON —— `lint.regenScope` が機械の下限と照合する)。
// HP.loadPreset・HP.setKernelForceGeneric・VERIFY・makeSim は文脈へ渡す文字列の中で使う(機械の下限には出ない)
const REGEN_SCOPE = {"presets":["alphaCenAB","alphaCenABDFM","binary","earthMoonReal","earthMoonRealKF1","emAuditDFM","emAuditNewton","gw150914DFM","jupiterGalilean","marsMoonsReal","mercury","mercuryGeoToy3","mercuryReal","neptuneReal","plutoCharonDiagInput","plutoCharonReal","psrB1534","psrB1534CF","psrB1534DFM","psrDoubleAB","psrDoubleABCF","psrDoubleABDFM","psrDoubleABPN","psrDoubleABSpinCal","psrJ1757CF","psrJ1757DFM","psrJ1757PN","psrJ1946CF","psrJ1946DFM","psrJ1946PN","qLockRadialAudit","qLockRadialAuditQ3","saturnZonalD68","siriusAB","siriusABDFM","venusReal"],"roots":["$","HP.allPresets","HP.coreState","HP.loadPreset","HP.setKernelForceGeneric","HP.sim","HP.validatePreset","LAWS","T","VERIFY","applyQLock","ch","clamp","ctx","isNum","makeSim","pairCorePN","pnSource","scaleExpT","validatePreset"],"core":true,"consts":[],"complete":true};

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const W281A_SCOPE = w281aScopeStamp(path.join(ROOT, TARGET), REGEN_SCOPE);
const OUT = path.join(ROOT, 'tests', 'out', 'geo1-w282b.json');
const CALAUDIT = 'tests/exp-w249b-calaudit.mjs';
const CANON_CAL = 'tests/out/calaudit-w249.json';
const QUICK = process.env.W282B_QUICK === '1';
const ENGINE = process.env.W282B_ENGINE === 'node' ? 'node' : 'chromium';
const t0 = Date.now();
const log = (...a) => console.error('[w282b]', ...a);
const J = (o) => JSON.stringify(o);
const deg = (rad) => rad * 180 / Math.PI;

// ---------------------------------------------------------------- 文脈(本体 H0 と反作用返しのコピー HR)
const htmlAbs = path.join(ROOT, TARGET);
const htmlText = fs.readFileSync(htmlAbs, 'utf8');
const H0 = loadHtmlHeadless(htmlAbs);
if (!H0.HP) throw new Error('HP が無い');
const sm = htmlText.match(/<script>([\s\S]*)<\/script>/);
const patched = L.patchReactionScript(sm[1]);
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'w282b-'));
const tmpHtml = path.join(tmpDir, 'react-copy.html');
fs.writeFileSync(tmpHtml, htmlText.replace(sm[1], () => patched.text));
const HR = loadHtmlHeadless(tmpHtml);
fs.rmSync(tmpDir, { recursive: true, force: true });
if (!HR.HP) throw new Error('反作用返しのコピーに HP が無い');
const reactCopy = { needle: L.REACT_NEEDLE, replaced: patched.count, flag: L.REACT_FLAG,
  note: '器の中の一時ファイルだけ(読み込んだ直後に消す)。本体 html は 1 文字も変えない。w の選択(geo2&&kHasU)と ∇u 集積(g2on)は変えない' };

// 文脈に置く小関数(JSON の文字列で受け渡す —— vm の配列・Float64Array を外へ持ち出さない)
const CTX_HELPERS = `globalThis.__w282b = {
  build(pj){ const v=HP.validatePreset(JSON.parse(pj)); if(!v.ok) throw new Error('受理されない: '+JSON.stringify(v.errors||v.err||v.error)); HP.sim.build(v.preset); return v; },
  snap(){ const S=HP.sim, n=S.n; let px=0,py=0,cx=0,cy=0,M=0,pS=0;
    for(let i=0;i<n;i++){ px+=S.m[i]*S.vx[i]; py+=S.m[i]*S.vy[i]; cx+=S.m[i]*S.x[i]; cy+=S.m[i]*S.y[i]; M+=S.m[i]; pS+=S.m[i]*Math.hypot(S.vx[i],S.vy[i]); }
    return { n, t:S.t, kKind:S._kKind, hasGeoToy:S.hasGeoToy===true, hasGeo3:S.hasGeo3===true, hasGeo3PN:S.hasGeo3PN===true,
      geoPN:S.params.geoPN, px, py, cx:cx/M, cy:cy/M, pS, m:Array.from(S.m).slice(0,Math.min(n,4)),
      x:Array.from(S.x).slice(0,Math.min(n,4)), y:Array.from(S.y).slice(0,Math.min(n,4)),
      vx:Array.from(S.vx).slice(0,Math.min(n,4)), vy:Array.from(S.vy).slice(0,Math.min(n,4)), spin:Array.from(S.spin).slice(0,Math.min(n,4)),
      resPx:S.resPx||0, resPy:S.resPy||0, geoToyMeshPx:S.geoToyMeshPx||0, geoToyMeshPy:S.geoToyMeshPy||0, geo3PnDL:S.geo3PnDL||0,
      pnOv:Array.from(S.pnOv||[]).slice(0,Math.min(n,4)), nan:S.hasNaN() }; },
  oneStep(pj, dt, gen){ const v=this.build(pj); HP.setKernelForceGeneric(!!gen);
    try{ HP.sim.step(dt); } finally { HP.setKernelForceGeneric(false); }
    return JSON.stringify(Object.assign(this.snap(), { applied:v.preset.physics.geoPN, warnings:(v.warnings||[]) })); },
  sampled(pj, dt, steps, nS){ this.build(pj); const out=[this.snap()]; const every=Math.max(1,Math.floor(steps/nS));
    for(let k=1;k<=steps;k++){ HP.sim.step(dt); if(k%every===0||k===steps) out.push(this.snap()); } return JSON.stringify(out); },
  fullState(pj, dt, steps){ this.build(pj); for(let k=0;k<steps;k++) HP.sim.step(dt); const S=HP.sim;
    return JSON.stringify({ n:S.n, x:Array.from(S.x), y:Array.from(S.y), vx:Array.from(S.vx), vy:Array.from(S.vy), spin:Array.from(S.spin),
      snap:this.snap() }); },
  loaded(id, dt, steps){ HP.loadPreset(id, false); const S=HP.sim; const s0=this.snap(); for(let k=0;k<steps;k++) S.step(dt);
    return JSON.stringify({ n:S.n, x:Array.from(S.x), y:Array.from(S.y), vx:Array.from(S.vx), vy:Array.from(S.vy), spin:Array.from(S.spin),
      s0, s1:this.snap(), geoPN:S.params.geoPN, kFrame:S.params.kFrame }); },
};`;
H0.evalExpr(CTX_HELPERS); HR.evalExpr(CTX_HELPERS);
const call = (H, expr) => JSON.parse(H.evalExpr(expr));

// ---------------------------------------------------------------- 正式の抽出器(判定器のページ側ヘルパをソースのまま)
const calSrc = fs.readFileSync(path.join(ROOT, CALAUDIT), 'utf8');
const helperBody = extractCalauditHelpers(calSrc);
const helperSha = crypto.createHash('sha256').update(helperBody, 'utf8').digest('hex');
const PERI_WINDOW = Number((calSrc.match(/const PERI_WINDOW = (\d+);/) || [])[1]);
const ORB_MAX = Number((calSrc.match(/const ORB_MAX = (\d+);/) || [])[1]);
const DT0 = Number((calSrc.match(/const DT0 = ([\d.]+);/) || [])[1]);
if (!(PERI_WINDOW === 20 && ORB_MAX === 60 && DT0 === 0.016)) throw new Error('判定器の窓の宣言が想定と違う');
// 器の中の宇宙を build する窓口(判定器の `__w249build` と同じ 4 行 —— 探す先だけが器の中の表)
const VARIANT_HOOK = `(function(){
  const ORIG = window.__w249build;
  window.__w282bVariants = {};
  window.__w249build = (id, kFrame0) => {
    const V = window.__w282bVariants[id];
    if (!V) return ORIG(id, kFrame0);
    const v = HP.validatePreset(JSON.parse(JSON.stringify(V)));
    if (!v.ok) throw new Error('器の中の宇宙が受理されない: ' + id + ' / ' + JSON.stringify(v.errors || v.err || v.error || ''));
    HP.sim.build(v.preset);
    return { warnings: v.warnings, n: HP.sim.n, map: window.__w249map(v.preset), kFrameApplied: (v.preset.physics || {}).kFrame };
  };
  window.__w282bP = () => { const S = HP.sim; let px = 0, py = 0, pS = 0;
    for (let i = 0; i < S.n; i++) { px += S.m[i] * S.vx[i]; py += S.m[i] * S.vy[i]; pS += S.m[i] * Math.hypot(S.vx[i], S.vy[i]); }
    return { px, py, pS, geoPN: S.params.geoPN, kFrame: S.params.kFrame, hasGeo3: S.hasGeo3 === true, hasGeo3PN: S.hasGeo3PN === true,
      hasGeoToy: S.hasGeoToy === true, kKind: S._kKind, pinned: Array.from(S.pinned).slice(0, 4) }; };
})()`;
function installHelpers(E) {
  E('(function(PERI_WINDOW){' + helperBody + '})(' + PERI_WINDOW + ')');
  E(VARIANT_HOOK);
}
const nodeE = (H) => (code) => H.evalExpr(code);
installHelpers(nodeE(H0)); installHelpers(nodeE(HR));

/** 1 走行(判定器の `__w249run` をそのまま呼ぶ)。E は文脈の評価関数(同期/非同期どちらでも)。 */
async function runPeri(E, id, dt, o) {
  const s = o || {};
  const b0 = await E(`window.__w249build(${J(id)}, false)`);
  const G = await E('HP.sim.params.G');
  const P0 = await E('window.__w282bP()');
  const tg = [{ ci: b0.map[0], oi: b0.map[1], label: id }];
  const osc0 = await E(`window.__w249osc0(${tg[0].ci}, ${tg[0].oi}, ${G})`);
  let maxSteps, orbMax = s.orbMax || ORB_MAX;
  if (s.stopId) maxSteps = stopRuleFor({ id: s.stopId, n: b0.n, dt, dtBase: DT0, stepsPerOrbit: [osc0.P / dt], orbMax }).maxSteps;
  else maxSteps = Math.ceil((orbMax + 1.5) * osc0.P / dt);
  const w0 = Date.now();
  const r = await E(`window.__w249run(${J(id)}, ${dt}, ${maxSteps}, ${J(tg)}, ${orbMax}, ${G}, false)`);
  const P1 = await E('window.__w282bP()');
  const t = r.targets[0];
  return { id, dt, steps: r.steps, maxSteps, orbMax, wallSec: (Date.now() - w0) / 1000, nan: r.nan, clamp: r.clamp,
    warnings: (b0.warnings || []).length, n: b0.n,
    slopeDegA: t.A.slopeDeg, residDegA: t.A.residDeg, nPeriA: t.A.nPeri, slopeDegB: t.B.slopeDeg, nPeriB: t.B.nPeri,
    perMeanA: t.A.perMean, perMeanFitA: t.A.perMeanFit, revPMean: t.revPMean, revN: t.revN,
    rev2: (t.revP && t.revP.length > 1) ? t.revP[1] : null, eProxy: t.eProxy,
    osc0: { a: osc0.a, e: osc0.e, P: osc0.P, mu: osc0.mu },
    P0, P1, dP: Math.hypot(P1.px - P0.px, P1.py - P0.py), dPrel: Math.hypot(P1.px - P0.px, P1.py - P0.py) / P0.pS };
}
const register = async (E, p) => E(`window.__w282bVariants[${J(p.id)}] = ${J(p)};`);

const LAWS = L.LAWS;
const lawPreset = L.lawVariant;
const geo3Of = L.geo3Variant;
const ctxOf = (law) => (law === 'g1R' ? HR : H0);

// ---------------------------------------------------------------- A. 契約の穴(自由二体の 1 歩)
const A = { rows: [], analytic: {} };
const DTS_A = [0.001, 0.0005];
const LAWS_A = ['g0', 'g1', 'g2', 'g3raw', 'g3toy', 'g3vmu', 'g1R', 'newton'];
for (const dt of DTS_A) {
  const newton = call(H0, `__w282b.oneStep(${J(J(lawPreset('newton', L.freeTwoBody())))}, ${dt}, false)`);
  for (const law of LAWS_A) {
    const pj = J(lawPreset(law, L.freeTwoBody()));
    const s = call(ctxOf(law), `__w282b.oneStep(${J(pj)}, ${dt}, false)`);
    const g = call(ctxOf(law), `__w282b.oneStep(${J(pj)}, ${dt}, true)`);
    const same = ['vx', 'vy', 'x', 'y', 'spin'].every((k) => J(s[k]) === J(g[k])) && s.px === g.px && s.py === g.py;
    A.rows.push({ law, dt, label: LAWS[law].label, applied: s.applied, geoPN: s.geoPN, kKind: s.kKind, kKindForced: g.kKind,
      hasGeoToy: s.hasGeoToy, hasGeo3: s.hasGeo3, hasGeo3PN: s.hasGeo3PN, warnings: s.warnings.filter((w) => !/softening/.test(w)),
      px: s.px, py: s.py, vx: s.vx, vy: s.vy, spin: s.spin,
      dvPN: [s.vx[0] - newton.vx[0], s.vx[1] - newton.vx[1]],
      pxPN: s.px - newton.px,
      meshPx: s.geoToyMeshPx, resPx: s.resPx, pxWithMesh: s.px + s.geoToyMeshPx,
      kernelBitSame: same, genericPx: g.px });
  }
}
{
  const r = L.pairMomentumRateGeo1({ G: 1, c: 10, eps: 0.001, b1: { m: 2, x: 0, y: 0, vx: 0, vy: 0 }, b2: { m: 1, x: 10, y: 0, vx: 0, vy: 0 } });
  const cf = L.comMomentumRateClosedForm({ G: 1, c: 10, m1: 2, m2: 1, rx: -10, ry: 0, vx: 0, vy: 0 });
  A.analytic = { sumMaPN: { px: r.px, py: r.py }, closedFormUnsoftened: cf,
    a1PN: [r.a1.ax, r.a1.ay], a2PN: [r.a2.ax, r.a2.ay],
    note: 'Σm·a₁ₚₙ = m₁ a₁ + m₂ a₂(a_i は相手を源とする E12 の試験粒子形・軟化つき)。閉形式は重心系・軟化なし: '
      + 'G m₁ m₂ (X₂−X₁)/(c² r²)·[(4GM/r − v²) n + 4ṙ v]' };
  for (const row of A.rows) row.pxAnalyticGeo1 = (row.law === 'g1') ? r.px * row.dt : null;
}
const rowA = (law, dt) => A.rows.find((z) => z.law === law && z.dt === dt);
A.summary = {
  g1PxDt: rowA('g1', 0.001).px, g1PxDt2: rowA('g1', 0.0005).px, g1Ratio: rowA('g1', 0.001).px / rowA('g1', 0.0005).px,
  g1VsAnalyticRel: L.relErr(rowA('g1', 0.001).px, A.analytic.sumMaPN.px * 0.001),
  g1VsAnalyticRelDt2: L.relErr(rowA('g1', 0.0005).px, A.analytic.sumMaPN.px * 0.0005),
  g2Px: [rowA('g2', 0.001).px, rowA('g2', 0.0005).px],
  g1RBitSameAsG2: DTS_A.every((dt) => J([rowA('g1R', dt).vx, rowA('g1R', dt).vy, rowA('g1R', dt).x]) === J([rowA('g2', dt).vx, rowA('g2', dt).vy, rowA('g2', dt).x])),
  g3vmuPx: [rowA('g3vmu', 0.001).px, rowA('g3vmu', 0.0005).px],
  g3vmuBitSameAsG2: DTS_A.every((dt) => J([rowA('g3vmu', dt).vx, rowA('g3vmu', dt).vy]) === J([rowA('g2', dt).vx, rowA('g2', dt).vy])),
  g3rawApplied: rowA('g3raw', 0.001).applied,
  kernelBitSameAll: A.rows.every((z) => z.kernelBitSame),
  nRows: A.rows.length,
};
{ // 記録(QA behavior.geo1Momentum が固定する値)と今回の実測の一致
  const R = L.GEO1_MOMENTUM_RECORD, bad = [];
  for (const [law, v] of Object.entries(R.px)) R.dts.forEach((dt, i) => { const r = rowA(law, dt);
    if (!r || L.relErr(r.px, v[i]) > 1e-12) bad.push(law + '@' + dt + ': ' + (r ? r.px : '—') + ' ≠ ' + v[i]); });
  A.recordMatches = bad.length === 0; A.recordMismatch = bad;
}
log('A', J(A.summary));

// ---------------------------------------------------------------- B. 重心系の束縛二体(Σm·v と重心の時刻歴)
const BIN = { m1: 2, m2: 1, a: 10, e: 0.3, physics: {} };
const P_BIN = 2 * Math.PI * Math.sqrt(BIN.a ** 3 / 1);   // GM=1
const B = { setup: Object.assign({}, BIN, { dt: 0.01, orbits: 20, P: P_BIN }), rows: [] };
{
  const steps = Math.round(20 * P_BIN / 0.01);
  for (const law of ['newton', 'g1', 'g2', 'g1R', 'g3vmu']) {
    const p = lawPreset(law, L.boundBinary(Object.assign({ id: 'w282b_binB' }, BIN)));
    const smp = call(ctxOf(law), `__w282b.sampled(${J(J(p))}, 0.01, ${steps}, 40)`);
    const s0 = smp[0];
    const series = smp.map((z) => ({ t: z.t, dpx: z.px - s0.px, dpy: z.py - s0.py, dcx: z.cx - s0.cx, dcy: z.cy - s0.cy }));
    const maxDP = Math.max(...series.map((z) => Math.hypot(z.dpx, z.dpy)));
    const last = series[series.length - 1];
    B.rows.push({ law, label: LAWS[law].label, steps, pS0: s0.pS, maxDP, maxDPrel: maxDP / s0.pS, finalDP: [last.dpx, last.dpy],
      finalDCom: [last.dcx, last.dcy], nan: smp[smp.length - 1].nan, series });
    log(`B ${law}: max|ΔP|=${maxDP.toExponential(3)} COM Δ=${Math.hypot(last.dcx, last.dcy).toExponential(3)}`);
  }
}

// ---------------------------------------------------------------- C. ガリレイ変換
const C = { oneStep: [], orbit: [] };
{
  const VS = [0, 0.1, 1];
  const base = {};
  for (const law of ['g1', 'g2', 'g1R', 'g3vmu']) for (const V of VS) {
    const pl = lawPreset(law, L.freeTwoBody({ V })), pn = lawPreset('newton', L.freeTwoBody({ V }));
    const s = call(ctxOf(law), `__w282b.oneStep(${J(J(pl))}, 0.001, false)`);
    const n = call(H0, `__w282b.oneStep(${J(J(pn))}, 0.001, false)`);
    const dv = [s.vx[0] - n.vx[0], s.vy[0] - n.vy[0], s.vx[1] - n.vx[1], s.vy[1] - n.vy[1]];
    if (V === 0) base[law] = dv;
    const b = base[law];
    const brk = Math.hypot(...dv.map((z, i) => z - b[i])) / Math.hypot(...b);
    C.oneStep.push({ law, V, dvPN: dv, pxPN: s.px - n.px, breakRel: brk });
  }
  // 束縛二体の近点移動(相対軌道・正式の抽出器)。重心は x0=−V·T/2 から動かす(座標の値域 ±5000 の内側)
  const ORB_C = 12, dtC = 0.01;
  for (const V of VS) {
    const x0 = -V * (ORB_C + 1.5) * P_BIN / 2;
    const rows = {};
    for (const law of ['newton', 'g1', 'g2', 'g1R', 'g3vmu']) {
      const p = lawPreset(law, L.boundBinary(Object.assign({ id: 'w282b_binC_V' + String(V).replace('.', 'p') }, BIN, { V, x0 })));
      const E = nodeE(ctxOf(law));
      await register(E, p);
      rows[law] = await runPeri(E, p.id, dtC, { orbMax: ORB_C });
    }
    for (const law of ['g1', 'g2', 'g1R', 'g3vmu']) {
      C.orbit.push({ law, V, dt: dtC, orbits: ORB_C, x0, slopeDeg: rows[law].slopeDegA, newtonDeg: rows.newton.slopeDegA,
        pnDeg: rows[law].slopeDegA - rows.newton.slopeDegA, nPeri: rows[law].nPeriA, nan: rows[law].nan, clamp: rows[law].clamp });
    }
    log(`C V=${V}: ` + ['g1', 'g2', 'g1R', 'g3vmu'].map((l) => l + ' ' + (rows[l].slopeDegA - rows.newton.slopeDegA).toExponential(6)).join(' / '));
  }
  for (const r of C.orbit) {
    const b = C.orbit.find((z) => z.law === r.law && z.V === 0);
    r.dPnVsV0 = r.pnDeg - b.pnDeg; r.dPnVsV0Rel = (r.pnDeg - b.pnDeg) / b.pnDeg;
  }
}

// ---------------------------------------------------------------- D. 固定源の極限
const D = {};
{
  const dt = 0.001;
  const fx = (o) => L.fixedSource(o);
  const n0 = call(H0, `__w282b.oneStep(${J(J(lawPreset('newton', fx({}))))}, ${dt}, false)`);
  const a = L.e12TestAccel({ G: 1, c: 10, eps: 0.001, mj: 1, dx: 10, dy: 0, wx: 0.1, wy: 0.3 });
  const rows = [];
  for (const law of ['g1', 'g2', 'g1R']) {
    const s = call(ctxOf(law), `__w282b.oneStep(${J(J(lawPreset(law, fx({}))))}, ${dt}, false)`);
    const mx = (s.vx[1] - n0.vx[1]) / dt, my = (s.vy[1] - n0.vy[1]) / dt;
    rows.push({ law, aPN: [mx, my], relErr: Math.hypot(mx - a.ax, my - a.ay) / Math.hypot(a.ax, a.ay), vx: s.vx, vy: s.vy });
  }
  const long = {};
  for (const law of ['g1', 'g2', 'g1R']) long[law] = call(ctxOf(law), `__w282b.fullState(${J(J(lawPreset(law, fx({}))))}, 0.01, 20000)`);
  const eqS = (u, v) => ['x', 'y', 'vx', 'vy', 'spin'].every((k) => J(u[k]) === J(v[k]));
  // 自由源(pinned:false)にしたとき: 試験粒子の 1 歩の 1PN 増分は pinned と同じ・Σm·Δv の残り
  const free = {};
  const nf = call(H0, `__w282b.oneStep(${J(J(lawPreset('newton', fx({ pinned: false }))))}, ${dt}, false)`);
  for (const law of ['g1', 'g2']) {
    const s = call(H0, `__w282b.oneStep(${J(J(lawPreset(law, fx({ pinned: false }))))}, ${dt}, false)`);
    const sp = rows.find((z) => z.law === law);
    const dvFree = [s.vx[1] - nf.vx[1], s.vy[1] - nf.vy[1]], dvPin = [sp.vx[1] - n0.vx[1], sp.vy[1] - n0.vy[1]];
    free[law] = { testDvPN: dvFree, pxPN: s.px - nf.px, pyPN: s.py - nf.py,
      testBitSameAsPinned: dvFree[0] === dvPin[0] && dvFree[1] === dvPin[1],
      testMomentumPN: s.m[1] * Math.hypot(dvFree[0], dvFree[1]) };
    free[law].residualShare = Math.hypot(free[law].pxPN, free[law].pyPN) / free[law].testMomentumPN;
  }
  D.analyticAPN = [a.ax, a.ay];
  D.rows = rows;
  D.long = { steps: 20000, dt: 0.01, g1BitSameAsG2: eqS(long.g1, long.g2), g1RBitSameAsG1: eqS(long.g1R, long.g1) };
  D.freeSource = free;
  D.setup = { M: 1, pinned: true, mt: 1e-6, r: [10, 0], v: [0.1, 0.3], G: 1, c: 10, eps: 0.001, dt };
  log('D', J({ relErr: rows.map((z) => z.relErr), long: D.long, free: Object.fromEntries(Object.entries(free).map(([k, v]) => [k, v.residualShare])) }));
}

// ---------------------------------------------------------------- E. 自由連星の近点移動(質量比の走査)
const E_ = { setup: { a: 10, e: 0.3, c: 10, eps: 0.001, GM: 1, dt: 0.01, orbits: 20, dtHalfFor: '2/1', c20For: ['1/1', '2/1'] }, rows: [], basis: null };
{
  E_.basis = L.gaussAdvanceBasis(0.3, 200000);
  const PAIRS = [{ key: '1/1', m1: 1, m2: 1 }, { key: '2/1', m1: 2, m2: 1 }, { key: '9/1', m1: 9, m2: 1 }, { key: '99/1', m1: 99, m2: 1 },
    { key: 'pinned', m1: 1, m2: 1e-6, pin: true }];
  const CASES = [];
  for (const pr of PAIRS) {
    CASES.push({ pr, dt: 0.01, c: 10 });
    if (pr.key === '2/1') CASES.push({ pr, dt: 0.005, c: 10 });
    if (pr.key === '2/1' || pr.key === '1/1') CASES.push({ pr, dt: 0.01, c: 20 });
  }
  for (const { pr, dt, c } of CASES) {
    const nu = pr.pin ? 0 : pr.m1 * pr.m2 / (pr.m1 + pr.m2) ** 2;
    const rows = {};
    for (const law of ['newton', 'g1', 'g2', 'g1R', 'g3vmu']) {
      const p = lawPreset(law, L.boundBinary({ id: 'w282b_binE_' + pr.key.replace('/', 'x') + '_' + String(dt).replace('.', 'p') + '_c' + c,
        m1: pr.m1, m2: pr.m2, a: 10, e: 0.3, pinFirst: !!pr.pin, physics: { cLight: c } }));
      const E = nodeE(ctxOf(law));
      await register(E, p);
      rows[law] = await runPeri(E, p.id, dt, { orbMax: 20 });
    }
    const o = rows.newton.osc0;
    const grDeg = deg(L.gr1pnAdvanceRad({ GM: o.mu, c, a: o.a, e: o.e }));
    for (const law of ['g1', 'g2', 'g1R', 'g3vmu']) {
      const pn = rows[law].slopeDegA - rows.newton.slopeDegA;
      const an = L.advanceRatio(law === 'g1' ? 'geo1' : 'geo2', nu, E_.basis);
      E_.rows.push({ pair: pr.key, nu, dt, c, law, pnDeg: pn, grDeg, ratio: pn / grDeg, analyticRatio: an, ratioMinusAnalytic: pn / grDeg - an,
        eih: 1, nPeri: rows[law].nPeriA, nan: rows[law].nan, clamp: rows[law].clamp, osc0: o });
    }
    log(`E ${pr.key} dt=${dt} c=${c} ν=${nu.toFixed(4)}: ` + E_.rows.filter((z) => z.pair === pr.key && z.dt === dt && z.c === c).map((z) => `${z.law} ${z.ratio.toFixed(5)}(解析 ${z.analyticRatio.toFixed(5)})`).join(' / '));
  }
}

// ---------------------------------------------------------------- H. geoPN:1 を宣言する内蔵 3 本 × 反作用返しのコピー
const Hx = {};
{
  const cmp = (a, b) => {
    let maxD = 0, nDiff = 0;
    for (let i = 0; i < a.n; i++) {
      const d = Math.hypot(a.x[i] - b.x[i], a.y[i] - b.y[i]);
      if (d > maxD) maxD = d;
      if (a.x[i] !== b.x[i] || a.y[i] !== b.y[i] || a.vx[i] !== b.vx[i] || a.vy[i] !== b.vy[i] || a.spin[i] !== b.spin[i]) nDiff++;
    }
    return { maxPosDiff: maxD, nBodiesDiff: nDiff, n: a.n };
  };
  for (const [id, steps] of [['mercury', 5000], ['binary', 2000]]) {
    const a = call(H0, `__w282b.loaded(${J(id)}, 0.016, ${steps})`);
    const b = call(HR, `__w282b.loaded(${J(id)}, 0.016, ${steps})`);
    const c = cmp(a, b);
    const st = (s) => [0, 1].map((i) => Math.hypot(s.x[i] - b.x[i], s.y[i] - b.y[i]));
    Hx[id] = Object.assign(c, { steps, dt: 0.016, geoPN: a.geoPN, kFrame: a.kFrame, starPosDiff: st(a), bitSame: c.nBodiesDiff === 0,
      pOrig: { dpx: a.s1.px - a.s0.px, dpy: a.s1.py - a.s0.py, pS0: a.s0.pS }, pReact: { dpx: b.s1.px - b.s0.px, dpy: b.s1.py - b.s0.py },
      pnOv: a.s0.pnOv, pinned: id === 'mercury' ? '源(太陽)が pinned' : '両星とも free' });
    log(`H ${id}: bitSame=${Hx[id].bitSame} maxPos=${c.maxPosDiff.toExponential(3)} stars=${Hx[id].starPosDiff.map((z) => z.toExponential(3)).join(',')}`);
  }
  const v0 = JSON.parse(H0.evalExpr('JSON.stringify(VERIFY._pnRuns())'));
  const v1 = JSON.parse(HR.evalExpr('JSON.stringify(VERIFY._pnRuns())'));
  Hx.verify_v18 = { orig: v0, react: v1, bitSame: J(v0) === J(v1), note: 'VERIFY._pnRuns()(V18/V19/V20 の共通走行 —— 源は pinned)' };
  log('H verify_v18 bitSame', Hx.verify_v18.bitSame);
}

// ---------------------------------------------------------------- F・G. 水星の表と比較表(正式の抽出器・停止条件)
let F = null, G = null, repro = null;
if (!QUICK) {
  let browser = null, pg = null, E;
  if (ENGINE === 'node') E = nodeE(H0);
  else {
    const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/opt/node22/lib/node_modules/playwright';
    const req = createRequire(path.join(PW_DIR, 'noop.js'));
    const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
    try { browser = await req('playwright').chromium.launch(); }
    catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }
    pg = await browser.newPage();
    await pg.goto('file://' + htmlAbs, { waitUntil: 'load' });
    await pg.waitForFunction(() => window.HP && HP.sim);
    E = (code) => pg.evaluate(code);
    await installHelpers(E);
  }
  const presetOf = async (id) => JSON.parse(await E(`JSON.stringify(HP.allPresets().find((q) => q.id === ${J(id)}) || null)`));
  const cal = JSON.parse(fs.readFileSync(path.join(ROOT, CANON_CAL), 'utf8'));
  const calRow = (id, kind) => { const p = cal.presets.find((z) => z.id === id); return p ? (p.quantities || []).find((q) => q.kind === kind) || null : null; };

  // F. 水星
  const MR = await presetOf('mercuryReal');
  const MG1 = L.mercuryGeo1KF0(MR);
  const MLAM0 = Object.assign(JSON.parse(JSON.stringify(MG1)), { id: 'mercuryW282bLam0', physics: Object.assign({}, MG1.physics, { geoPN: 2, lambdaPN: 0 }) });
  await register(E, MG1); await register(E, MLAM0);
  const COND = [
    { key: 'g2', id: 'mercuryReal', label: '☄️ mercuryReal そのもの(geoPN=2・kF0・λ_PN=1)' },
    { key: 'g1', id: 'mercuryGeo1KF0', label: '🥇 mercuryGeo1KF0(☄️ の複製で geoPN=1 —— 器の中の principle コピー)' },
    { key: 'g3', id: 'mercuryGeoToy3', label: '🔁 mercuryGeoToy3(geoPN=3・vMinusU・u=V=(2.3,0)・reference-1PN(v))' },
    { key: 'lam0', id: 'mercuryW282bLam0', label: 'λ_PN=0(1PN を切った対照)' },
  ];
  F = { rows: [], conds: COND };
  for (const dt of [0.016, 0.008]) for (const c of COND) {
    const r = await runPeri(E, c.id, dt, { stopId: 'mercuryReal' });
    F.rows.push(Object.assign({ cond: c.key, label: c.label }, r));
    log(`F ${c.key} dt=${dt}: ${r.slopeDegA} (n=${r.nPeriA}, ${r.wallSec}s)`);
  }
  const FR = (k, dt) => F.rows.find((z) => z.cond === k && z.dt === dt);
  const o = FR('g2', 0.016).osc0;
  const pnAnalytic = pn1AnalyticDeg({ GM: MR.physics.G * MR.bodies[0].m, c: MR.physics.cLight, a: o.a, e: o.e });
  F.pn1Analytic = pnAnalytic;
  F.diff = [0.016, 0.008].map((dt) => ({ dt,
    g1_minus_g2: FR('g1', dt).slopeDegA - FR('g2', dt).slopeDegA, g1BitSameAsG2: FR('g1', dt).slopeDegA === FR('g2', dt).slopeDegA,
    g3_minus_g2: FR('g3', dt).slopeDegA - FR('g2', dt).slopeDegA,
    pn_g1: FR('g1', dt).slopeDegA - FR('lam0', dt).slopeDegA, pn_g2: FR('g2', dt).slopeDegA - FR('lam0', dt).slopeDegA,
    pn_g3: FR('g3', dt).slopeDegA - FR('lam0', dt).slopeDegA,
    pn_g1_minus_analytic: FR('g1', dt).slopeDegA - FR('lam0', dt).slopeDegA - pnAnalytic,
    total_g1_minus_analytic: FR('g1', dt).slopeDegA - pnAnalytic }));
  F.stepWidth = FR('g2', 0.008).slopeDegA - FR('g2', 0.016).slopeDegA;
  const CAL0 = calRow('mercuryReal', 'precession');
  repro = { formal: CAL0 ? CAL0.meas : null, here: FR('g2', 0.016).slopeDegA, bitIdentical: !!CAL0 && FR('g2', 0.016).slopeDegA === CAL0.meas,
    engine: ENGINE, note: '判定器の正本値(calaudit-w249.json)と、同じ抽出器のソースを本器で評価した値のビット比較' };
  log('repro', J(repro));
  if (!repro.bitIdentical) throw new Error('☄️ の正式値をビットで再現できない —— 器を止める');

  // G. 比較表
  const SYS = [
    { group: '太陽系', id: 'mercuryReal', note: '太陽 pinned(開放系 —— Σm·v は保存の対象外)' },
    { group: '太陽系', id: 'earthMoonReal', note: '両体 free・1PN 源は地球だけ(pnSource 10)' },
    { group: '太陽系', id: 'plutoCharonDiagInput', note: '❄️ の kF0 診断コピー(内蔵 principle)・両体 free・1PN 源は冥王星だけ' },
    { group: '恒星連星', id: 'alphaCenAB', note: '両体 free・1PN 源は A だけ(pnSource 10)' },
    { group: '恒星連星', id: 'siriusAB', note: '両体 free・1PN 源は A だけ(pnSource 10)' },
    { group: 'NS 連星', id: 'psrDoubleAB', note: '両体 free・両方 1PN 源(pnSource 11)' },
  ];
  G = { rows: [], undeclared: [{ group: 'BH 連星', status: '未宣言',
    note: 'kFrame=0 かつ geoPN≥1 の BH 連星の内蔵が無い(🎻 gw150914 は geoPN=0・kFrame=0 / gw150914DFM は kFrame=1)' }], systems: SYS };
  for (const s of SYS) {
    const base = await presetOf(s.id);
    if (!base) { G.rows.push({ id: s.id, missing: true }); continue; }
    const g1 = Object.assign(JSON.parse(JSON.stringify(base)), { id: s.id + 'W282bG1', sampleClass: 'principle' });
    g1.physics = Object.assign({}, base.physics, { geoPN: 1 });
    for (const k of ['claims', 'obsCard', 'massCalibration', 'calibrationForecast']) delete g1[k];
    const g3 = s.id === 'mercuryReal' ? null : geo3Of(base, s.id + 'W282bG3');
    await register(E, g1); if (g3) await register(E, g3);
    const runs = {};
    runs.g2 = (s.id === 'mercuryReal') ? FR('g2', 0.016) : await runPeri(E, s.id, 0.016, { stopId: s.id });
    runs.g1 = (s.id === 'mercuryReal') ? FR('g1', 0.016) : await runPeri(E, g1.id, 0.016, { stopId: s.id });
    runs.g3 = (s.id === 'mercuryReal') ? FR('g3', 0.016) : await runPeri(E, g3.id, 0.016, { stopId: s.id });
    const cp = calRow(s.id, 'precession');
    for (const law of ['g1', 'g2', 'g3']) {
      const r = runs[law];
      G.rows.push({ group: s.group, id: s.id, emoji: base.emoji, law, runId: r.id, note: s.note, dt: 0.016, steps: r.steps, maxSteps: r.maxSteps,
        nPeriA: r.nPeriA, slopeDegA: r.slopeDegA, perMeanA: r.perMeanA, revPMean: r.revPMean, rev2: r.rev2, eProxy: r.eProxy,
        dP: r.dP, dPrel: r.dPrel, pS0: r.P0.pS, geoPNApplied: r.P1.geoPN, hasGeo3PN: r.P1.hasGeo3PN, pinned: r.P0.pinned,
        nan: r.nan, clamp: r.clamp, wallSec: r.wallSec,
        massCalibration: base.massCalibration ? { f: base.massCalibration.f === undefined ? null : base.massCalibration.f } : null,
        formalPrecessionBit: (law === 'g2' && cp) ? (r.slopeDegA === cp.meas) : null });
    }
    const R = (law) => G.rows.find((z) => z.id === s.id && z.law === law);
    G.rows.filter((z) => z.id === s.id).forEach((z) => {
      z.slope_minus_g2 = z.slopeDegA - R('g2').slopeDegA;
      z.rev_minus_g2 = (z.revPMean !== null && R('g2').revPMean !== null) ? z.revPMean - R('g2').revPMean : null;
    });
    log(`G ${s.id}: ` + ['g1', 'g2', 'g3'].map((l) => `${l} ${R(l).slopeDegA} dP ${R(l).dPrel.toExponential(2)}`).join(' / '));
  }
  if (browser) await browser.close();
}

// ---------------------------------------------------------------- 出力
const out = {
  meta: Object.assign(provenanceMeta({ root: ROOT, wave: '第282便b', target: TARGET,
    code: ['tests/exp-w282b-geo1.mjs', 'tests/lib-w282b-geo1.mjs', 'tests/lib-w279b-headless.mjs', 'tests/lib-w270a-stoprule.mjs',
      'tests/lib-w272e-provenance.mjs', 'tests/lib-w280a-mercury.mjs', 'tests/lib-w280c-geo3.mjs', 'tests/lib-w281a-scope.mjs', CALAUDIT],
    inputs: [TARGET, CANON_CAL] }), {
    version: L.GEO1_W282B_VERSION, quick: QUICK,
    engine: { oneStepAndOrbits: 'Node の vm(tests/lib-w279b-headless.mjs)—— 本体と反作用返しのコピーの 2 文脈',
      mercuryAndTable: QUICK ? null : (ENGINE === 'node' ? 'Node の vm' : 'Chromium(判定器と同じ —— ページで対象 html を読む)') },
    extractor: { from: CALAUDIT, helperSha256: helperSha, periWindow: PERI_WINDOW, orbMax: ORB_MAX, dtBase: DT0, stopRuleVersion: STOP_RULE_VERSION },
    reactCopy,
    declarations: ['既存 140 本の物理は変えない(本体の分岐は 1 文字も変えない・対照は器の中のコピー)',
      'geoPN はアプリのモード番号であって、標準理論の 2PN・3PN ではない',
      'Σm·v はこのアプリの状態変数の和であって、相対論的な全運動量ではない(1PN の保存量は速度・位置の補正項を含む)',
      '主系列の見本 mercuryGeo1KF0 は器の中の principle コピー(内蔵ではない・較正母集団の外)'],
    doNotWrite: ['一般相対論の運動量保存違反', '観測一致を達成した', '較正を完了した', 'kF0 版が成立した', '精度を上げれば成立する', 'geoPN=2 は 2PN'],
    wallSec: (Date.now() - t0) / 1000,
  }),
  laws: LAWS,
  A, B, C, D, E: E_, H: Hx,
  F, G, reproduction: repro,
  mercuryGeo1KF0: (() => { const p = L.mercuryGeo1KF0({ id: 'mercuryReal', physics: {}, bodies: [] }); return { id: p.id, emoji: p.emoji, sampleClass: p.sampleClass,
    descStruct: p.descStruct, status: p.status, patch: { physics: { geoPN: 1 } }, builtin: false }; })(),
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
Object.assign(out.meta, W281A_SCOPE, w281aStableInputs(ROOT, out.meta.inputs));
fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
log('書いた', path.relative(ROOT, OUT), (Date.now() - t0) / 1000, 's');

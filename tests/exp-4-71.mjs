// 第71便 検証実験: 温度選別(第70便 E5 の発見)の機構分解
// - 問い: 「高温星=ディスク残留・低温星=中心沈降(比1.25)」は E6′ のどの項が運ぶのか。
//   候補は2つ: (A) 星スピンの u 回転項(高スピン星が近傍の u に渦を与える — E2/E3 の ω 項)
//              (B) ③反作用の残余トルク(対の軌道↔スピン角運動量移譲 — accS 経路)
// - 方法: **パッチビルド A/B**。本スクリプトが beta/index.html から候補項だけを外した診断コピーを
//   scratchpad に生成して読み込む(アプリ本体には一切触れない・再現はスクリプト再実行で可)。
//   パッチA = 星スピンの u 回転項オフ(pinned 天体〔中心〕の ω だけ残す)
//   パッチB = ③残余トルクのスピン移譲オフ(accS を積まない — L は対で閉じなくなる診断専用)
// - 併せて無改変ビルドで: L 収支時系列(軌道L/スピンL×高低温群+リザーバ)・用量反応
//   (スピン差・D0・q)・速度分散 σ_v(中心 vs ディスク — 「バルジは光学的に低温だが力学的に
//   熱い」〔2026-08-04 原仮定者裁定の解釈〕がこの創発でも成り立つかの実測)
// - 出力: tests/out/exp-4-71.json
// 実行: node tests/exp-4-71.mjs
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(OUT_DIR, { recursive: true });
const SCRATCH = fs.mkdtempSync(path.join(os.tmpdir(), 'dfm-e471-'));

// ---- パッチビルドの生成(検証つき文字列置換 — 一致しなければ即エラー) ----
const SRC = fs.readFileSync(path.join(ROOT, 'beta', 'index.html'), 'utf8');
function makePatched(name, edits) {
  let s = SRC;
  for (const [from, to] of edits) {
    if (!s.includes(from)) throw new Error(`パッチ対象が見つからない(${name}): ${from.slice(0, 60)}...`);
    s = s.split(from).join(to);
  }
  const p = path.join(SCRATCH, name);
  fs.writeFileSync(p, s);
  return 'file://' + p;
}
// パッチA: 星スピンの u 回転項オフ(pinned=中心の ω のみ残す)。コア差動項も同ゲート
const urlA = makePatched('beta-noStarSwirl.html', [
  ['if(sj!==0){ const tt=Rj/(Rj+d); omj = (q===2)? sj*tt*tt : sj*Math.pow(tt,q); }',
   'if(sj!==0&&pinned[j]){ const tt=Rj/(Rj+d); omj = (q===2)? sj*tt*tt : sj*Math.pow(tt,q); }'],
  ['if(si!==0){ const tt=Ri/(Ri+d); omi = (q===2)? si*tt*tt : si*Math.pow(tt,q); }',
   'if(si!==0&&pinned[i]){ const tt=Ri/(Ri+d); omi = (q===2)? si*tt*tt : si*Math.pow(tt,q); }']]);
// パッチB: ③残余トルクのスピン移譲オフ(診断専用 — L は意図的に対で閉じない)
const urlB = makePatched('beta-noResTorque.html', [
  ['accS[i]-=dsn; accS[j]-=dsn;', ';'],
  ['accS[j]-=dsn; accS[i]-=dsn;', ';']]);
const urlAB = makePatched('beta-noBoth.html', [
  ['if(sj!==0){ const tt=Rj/(Rj+d); omj = (q===2)? sj*tt*tt : sj*Math.pow(tt,q); }',
   'if(sj!==0&&pinned[j]){ const tt=Rj/(Rj+d); omj = (q===2)? sj*tt*tt : sj*Math.pow(tt,q); }'],
  ['if(si!==0){ const tt=Ri/(Ri+d); omi = (q===2)? si*tt*tt : si*Math.pow(tt,q); }',
   'if(si!==0&&pinned[i]){ const tt=Ri/(Ri+d); omi = (q===2)? si*tt*tt : si*Math.pow(tt,q); }'],
  ['accS[i]-=dsn; accS[j]-=dsn;', ';'],
  ['accS[j]-=dsn; accS[i]-=dsn;', ';']]);
const url0 = 'file://' + path.join(ROOT, 'beta', 'index.html');

async function launch() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  const { chromium } = await import('playwright-core');
  return chromium.launch({ executablePath: exe });
}
const browser = await launch();

// 混合円盤の共通測定(高温 spin=hotS ×190 + 低温 spin=coldS ×190・kRep=0・中心 pinned spin=ctrS)
const RUN_SRC = (over) => `(() => {
  const o = ${JSON.stringify(over)};
  HP.sim.build({ id:'e71', name:'d', description:'d', camera:{scale:400},
    world:{boundary:'none',size:0}, seed:20260804,
    physics:{ G:0.8, D0:(o.D0===undefined?1.5:o.D0), kFrame:(o.kF===undefined?1:o.kF),
      q:(o.q===undefined?2:o.q), kRep:0, muF:0, gammaN:0, kappaS:0, Kt:50, cLight:60, bM:1,
      etaRad:0, pRad:4, gravityX:0, gravityY:0, geoPN:0, lambdaPN:1, pnAlpha:1.5,
      radiusScale:1, softening:3, timeScale:1 },
    bodies:[
      { type:'single', rMul:1.2, m:2500, x:0, y:0, vx:0, vy:0,
        spin:(o.ctrS===undefined?1.2:o.ctrS), pinned:true, radius:15 },
      { type:'disk', rMul:1.2, n:190, cx:0, cy:0, radius:260, mMin:0.3, mMax:0.3,
        spinMin:(o.hotS===undefined?2:o.hotS), spinMax:(o.hotS===undefined?2:o.hotS),
        vMode:'kepler', aroundMass:2500, vScale:1.05, direction:1, bulkVx:0, bulkVy:0 },
      { type:'disk', rMul:1.2, n:190, cx:0, cy:0, radius:260, mMin:0.3, mMax:0.3,
        spinMin:(o.coldS===undefined?0.2:o.coldS), spinMax:(o.coldS===undefined?0.2:o.coldS),
        vMode:'kepler', aroundMass:2500, vScale:1.05, direction:1, bulkVx:0, bulkVy:0 }] });
  const S = HP.sim;
  const hotIdx = [], coldIdx = [];
  for (let i = 1; i < S.n; i++) (S.spin[i] > (o.hotS===undefined?2:o.hotS)/2 + (o.coldS===undefined?0.2:o.coldS)/2 ? hotIdx : coldIdx).push(i);
  const group = (idx) => { let r=0, Lo=0, Ls=0;
    for (const i of idx) { r += Math.hypot(S.x[i], S.y[i]);
      Lo += S.m[i]*(S.x[i]*S.vy[i]-S.y[i]*S.vx[i]);
      Ls += 0.5*S.m[i]*S.R[i]*S.R[i]*S.spin[i]; }
    return { r: r/idx.length, Lo, Ls }; };
  const sigma = (rLo, rHi) => {   // 局所円運動平均からの速度分散(力学温度)
    let vs = [], vt = [];
    for (let i = 1; i < S.n; i++) { const rr = Math.hypot(S.x[i], S.y[i]);
      if (rr < rLo || rr >= rHi) continue;
      const ux2 = -S.y[i]/rr, uy2 = S.x[i]/rr;   // 接線方向
      vt.push(S.vx[i]*ux2 + S.vy[i]*uy2); vs.push(S.vx[i]*(S.x[i]/rr) + S.vy[i]*(S.y[i]/rr)); }
    const dev = (a) => { if (a.length < 4) return 0;
      const m2 = a.reduce((s2, v) => s2 + v, 0)/a.length;
      return Math.sqrt(a.reduce((s2, v) => s2 + (v-m2)*(v-m2), 0)/a.length); };
    return { n: vt.length, sT: dev(vt), sR: dev(vs) }; };
  const series = [];
  const steps = (o.steps===undefined?6000:o.steps);
  for (let k = 0; k < steps; k++) { S.step(0.016);
    if ((k+1) % 600 === 0) { const h = group(hotIdx), c = group(coldIdx);
      series.push({ k: k+1, rHot: h.r, rCold: c.r, LoHot: h.Lo, LoCold: c.Lo,
        LsHot: h.Ls, LsCold: c.Ls, resL: S.resL }); } }
  const h = group(hotIdx), c = group(coldIdx);
  return { sep: h.r/c.r, rHot: h.r, rCold: c.r,
    LoHot: h.Lo, LoCold: c.Lo, LsHot: h.Ls, LsCold: c.Ls, resL: S.resL,
    spinHotEnd: hotIdx.reduce((s2,i)=>s2+S.spin[i],0)/hotIdx.length,
    spinColdEnd: coldIdx.reduce((s2,i)=>s2+S.spin[i],0)/coldIdx.length,
    sigCenter: sigma(0, 90), sigDisk: sigma(120, 260),
    series, clampV: S.clampVN, nan: S.hasNaN() };
})()`;

async function runOn(url, over) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
  await page.goto(url);
  await page.waitForFunction(() => window.HP && HP.sim);
  const r = await page.evaluate(RUN_SRC(over));
  await page.close();
  return r;
}

// ---- F1: パッチ帰属(基準/A/B/A+B — 同一混合構成・6000步) ----
const base = await runOn(url0, {});
console.log('F1 base       sep=', base.sep.toFixed(4));
const pA = await runOn(urlA, {});
console.log('F1 patchA(星渦オフ) sep=', pA.sep.toFixed(4));
const pB = await runOn(urlB, {});
console.log('F1 patchB(残余トルクオフ) sep=', pB.sep.toFixed(4));
const pAB = await runOn(urlAB, {});
console.log('F1 patchA+B   sep=', pAB.sep.toFixed(4));

// ---- F2: 用量反応 — スピン差(中心1.2固定) ----
const gap15 = await runOn(url0, { hotS: 1.5, coldS: 0.5 });
const gap12 = await runOn(url0, { hotS: 1.2, coldS: 0.8 });
console.log('F2 gap 1.5/0.5 sep=', gap15.sep.toFixed(4), ' 1.2/0.8 sep=', gap12.sep.toFixed(4));

// ---- F3: 用量反応 — D0(φ 希釈)と q(ω 距離核) ----
const d05 = await runOn(url0, { D0: 0.5 });
const d50 = await runOn(url0, { D0: 5 });
const q3 = await runOn(url0, { q: 3 });
console.log('F3 D0=0.5 sep=', d05.sep.toFixed(4), ' D0=5 sep=', d50.sep.toFixed(4), ' q=3 sep=', q3.sep.toFixed(4));

// ---- F4: 第70便 E5「力学選別」のアーチファクト定量化 ----
// E5 は群を**終状態の符号付き spin>1** で再分類していた。③残余トルクが全星スピンを逆行へ
// 汲み下げる(F1 パッチBで確定)ため、終状態で spin>1 を保つのは外縁の生存外れ値だけになり、
// 「高温星が外に残った」ように見える。正追跡(初期集団)とE5方式を同一走行で並記して定量化する
const F4_SRC = (kRep) => `(() => {
  HP.sim.build({ id:'f4', name:'d', description:'d', camera:{scale:400},
    world:{boundary:'none',size:0}, seed:20260804,
    physics:{ G:0.8, D0:1.5, kFrame:1, q:2, kRep:${kRep}, muF:0, gammaN:0, kappaS:0, Kt:50,
      cLight:60, bM:1, etaRad:0, pRad:4, gravityX:0, gravityY:0, geoPN:0, lambdaPN:1,
      pnAlpha:1.5, radiusScale:1, softening:3, timeScale:1 },
    bodies:[
      { type:'single', rMul:1.2, m:2500, x:0, y:0, vx:0, vy:0, spin:1.2, pinned:true, radius:15 },
      { type:'disk', rMul:1.2, n:190, cx:0, cy:0, radius:260, mMin:0.3, mMax:0.3,
        spinMin:2, spinMax:2, vMode:'kepler', aroundMass:2500, vScale:1.05, direction:1, bulkVx:0, bulkVy:0 },
      { type:'disk', rMul:1.2, n:190, cx:0, cy:0, radius:260, mMin:0.3, mMax:0.3,
        spinMin:0.2, spinMax:0.2, vMode:'kepler', aroundMass:2500, vScale:1.05, direction:1, bulkVx:0, bulkVy:0 }] });
  const S = HP.sim;
  const hotIdx=[], coldIdx=[];
  for(let i=1;i<S.n;i++) (S.spin[i]>1.1? hotIdx:coldIdx).push(i);
  for (let k=0;k<6000;k++) S.step(0.016);
  const meanR=(idx)=>idx.reduce((s,i)=>s+Math.hypot(S.x[i],S.y[i]),0)/idx.length;
  const proper = meanR(hotIdx)/meanR(coldIdx);
  const hotEnd=[], coldEnd=[];
  for(let i=1;i<S.n;i++) (S.spin[i]>1? hotEnd:coldEnd).push(i);
  const e5style = (hotEnd.length&&coldEnd.length)? meanR(hotEnd)/meanR(coldEnd) : null;
  const bins=[[0,60],[60,110],[110,160],[160,210],[210,300]];
  const prof=bins.map(bb=>{ let s=0,a=0,c=0;
    for(let i=1;i<S.n;i++){ const rr=Math.hypot(S.x[i],S.y[i]);
      if(rr>=bb[0]&&rr<bb[1]){ s+=S.spin[i]; a+=Math.abs(S.spin[i]); c++; } }
    return { bin:bb, n:c, spin:c? s/c:0, absSpin:c? a/c:0 }; });
  return { kRep:${kRep}, proper, e5style, nHotEnd:hotEnd.length, prof, nan:S.hasNaN() };
})()`;
async function runF4(kRep) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
  await page.goto(url0);
  await page.waitForFunction(() => window.HP && HP.sim);
  const r = await page.evaluate(F4_SRC(kRep));
  await page.close();
  return r;
}
const f4k0 = await runF4(0), f4k1 = await runF4(1);
console.log('F4 kRep=0: 正追跡=', f4k0.proper.toFixed(4), ' E5方式=', f4k0.e5style && f4k0.e5style.toFixed(4),
  '(終状態spin>1の生存数=', f4k0.nHotEnd, ')');
console.log('F4 kRep=1: 正追跡=', f4k1.proper.toFixed(4), ' E5方式=', f4k1.e5style && f4k1.e5style.toFixed(4),
  '(生存数=', f4k1.nHotEnd, ')');

const out = { meta: { exp: '4-71', date: new Date().toISOString().slice(0, 10),
    note: 'パッチビルドは本スクリプトが一時生成する診断コピー(アプリ本体は不変)' },
  f1_attribution: { base, patchA_noStarSwirl: pA, patchB_noResTorque: pB, patchAB: pAB },
  f2_spinGap: { gap20_02: base, gap15_05: gap15, gap12_08: gap12 },
  f3_dose: { D0_05: d05, D0_15: base, D0_50: d50, q3 },
  f4_artifact: { k0: f4k0, k1: f4k1 } };
fs.writeFileSync(path.join(OUT_DIR, 'exp-4-71.json'), JSON.stringify(out, null, 2));
console.log('→ tests/out/exp-4-71.json');
await browser.close();
fs.rmSync(SCRATCH, { recursive: true, force: true });

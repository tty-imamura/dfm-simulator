// 第274便c(第64報): **`HP.dfmField` の API 同値**と、新しい `need:"mesh"` の契約を機械確認する器。
//
// ■ 何を確かめるか
//   ① **同値**: 基点 html と現行 html で、`dfmField` の返り値が**全項目で一致**する
//      (源集合 × 選択肢の直積。scalar / local / complex・`excludeBodyId` の ID と添字・
//       非有限の源・欄の欠損・m≤0・支持内に源なし・空集合・箱側の源・背景 frame の有無)。
//      第274便c の同値最適化(配列を作らないスカラー検査・源オブジェクトの形・指数の前処理)は
//      **値も拒否条件も変えない**はずなので、**1 例でも違えば入れない**という契約である。
//   ② **`need:"mesh"` の契約**: `need:"all"` と **u/∇u/∂ₜu/χ/W/∇W/∂ₜW/nIn/uQuantity/
//      supportPolicy/accComplete/bgDtComplete/timeDerivativeComplete が一致**し、
//      **D・∇D・gravity は null**(0 で埋めない)であること。
//      **唯一の意図した差**: 既定経路が持っていた「**和 D が非有限**なら null」という門が
//      `need:"mesh"` には無い(源ごとの門は `dfmLocalMeshField` が同じ条件で持っている)。
//      その 1 点は `dOverflow` 欄に**そのまま出す**(隠さない)。
//
// ■ この器が言わないこと
//   「速くなった」「正しい」—— 一致は**同じ値を返した**ことだけを意味する。
//
// 使い方:
//   PLAYWRIGHT_CORE_DIR=/opt/node22/lib/node_modules/playwright \
//   node tests/exp-w274c-needmesh.mjs beta/_w274_base.html beta/index.html
// 終了コード: 同値でない例が 1 つでもあれば 1。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { provenanceMeta, stampFile } from './lib-w272e-provenance.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const A = process.argv[2] || 'beta/_w274_base.html';
const B = process.argv[3] || 'beta/index.html';
const OUT = process.env.W274C_OUT || path.join(ROOT, 'tests', 'out', 'needmesh-w274c.json');

const PW_DIR = process.env.PLAYWRIGHT_CORE_DIR || '/home/user/dfm-simulator';
const req = createRequire(path.join(PW_DIR, 'noop.js'));
const EXE = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
let browser;
try { browser = await req('playwright').chromium.launch(); }
catch { browser = await req('playwright-core').chromium.launch({ executablePath: EXE }); }

// ページ内で走る本体(文字列として両方の html に流す)
const BODY = `(() => {
  // ---- 源集合(欄の欠損・非有限・m≤0・重なり・空を含む)
  const full = (id,m,x,y,vx,vy,ax,ay,om,od) => ({id,m,x,y,vx,vy,ax,ay,omega:om,omegaDot:od});
  const SRC = {
    two:      [full(0,5,-10,0,0,0.2,0.01,0,0,0), full(1,5,10,0,0,-0.2,-0.01,0,0,0)],
    twoNoAcc: [{id:0,m:5,x:-10,y:0,vx:0,vy:0.2}, {id:1,m:5,x:10,y:0,vx:0,vy:-0.2}],
    twoNoId:  [{m:5,x:-10,y:0,vx:0,vy:0.2,ax:0,ay:0}, {m:5,x:10,y:0,vx:0,vy:-0.2,ax:0,ay:0}],
    spin:     [full(0,5,-10,0,0,0.2,0.01,0,0.3,0.05), full(1,7,10,4,0.1,-0.2,-0.01,0.02,-0.4,0)],
    withR:    [Object.assign(full(0,5,-10,0,0,0.2,0,0,0,0),{R:40,Rdot:0.7}),
               Object.assign(full(1,5,10,0,0,-0.2,0,0,0,0),{R:25,Rdot:-0.3})],
    idClash:  [full(9,7,100,0,0,0,0,0,0,0), full(1,3,0,0,0,0,0,0,0,0)],
    many:     (()=>{ const a=[]; let s=12345;
                 const rnd=()=>{ s=(s*1103515245+12345)&0x7fffffff; return s/0x7fffffff; };
                 for(let i=0;i<40;i++) a.push(full(i, 0.2+rnd(), (rnd()-0.5)*400, (rnd()-0.5)*400,
                   (rnd()-0.5)*2, (rnd()-0.5)*2, (rnd()-0.5)*0.01, (rnd()-0.5)*0.01, 0, 0));
                 return a; })(),
    nonFinite:[full(0,5,-10,0,0,0.2,0,0,0,0), full(1,NaN,10,0,0,-0.2,0,0,0,0)],
    infX:     [full(0,5,-10,0,0,0.2,0,0,0,0), full(1,5,Infinity,0,0,-0.2,0,0,0,0)],
    negMass:  [full(0,5,-10,0,0,0.2,0,0,0,0), full(1,-3,10,0,0,-0.2,0,0,0,0)],
    zeroMass: [full(0,5,-10,0,0,0.2,0,0,0,0), full(1,0,10,0,0,-0.2,0,0,0,0)],
    overlap:  [full(0,5,3,4,0,0,0,0,0,0)],
    empty:    [],
    holed:    [full(0,5,-10,0,0,0.2,0,0,0,0), null],
    boxy:     [full(0,1e300,-10,0,0,0.2,0,0,0,0), full(1,1e300,10,0,-0.2,0,0,0,0)],
  };
  // ---- 選択肢
  const OPT = [];
  for (const law of ['scalar','local','complex']) {
    for (const bg of ['static','frame']) {
      for (const ex of [undefined, 0, 1, 9]) {
        const o = { lawVersion:law, background:bg, eps:0.5, D0:1, G:0.8, p:1 };
        if (ex!==undefined) o.excludeBodyId=ex;
        if (law==='local') { o.R=60; }
        if (bg==='frame') o.bg={ u:[0.3,-0.2], gradU:[0.01,0,0,0.01], dUdt:[0.001,0] };
        OPT.push(o);
      }
    }
  }
  // 支持半径が小さすぎて**支持内に源が無い** / Ṙ 宣言 / p=0 / p=2 / D0=0 / 背景 dUdt 欠落
  OPT.push({ lawVersion:'local', R:1, eps:0.5, D0:0, G:1, p:1, background:'static' });
  OPT.push({ lawVersion:'local', R:1, eps:0.5, D0:2, G:1, p:1, background:'static' });
  OPT.push({ lawVersion:'local', R:60, Rdot:0.4, eps:0.5, D0:1, G:1, p:1, background:'static' });
  OPT.push({ lawVersion:'scalar', eps:0, D0:0, G:1, p:0, background:'static' });
  OPT.push({ lawVersion:'scalar', eps:3, D0:1.5, G:0.8, p:2, background:'static' });
  OPT.push({ lawVersion:'scalar', eps:3, D0:1.5, G:0.8, p:4, background:'static' });
  OPT.push({ lawVersion:'scalar', eps:0.5, D0:1, G:1, p:1, background:'frame', bg:{ u:[1,0] } });
  OPT.push({ lawVersion:'scalar', eps:0.5, D0:1, G:1, p:1, energyContract:'meshLedger' });
  OPT.push({ lawVersion:'zzz', eps:0.5, D0:1, G:1, p:1 });
  OPT.push({ lawVersion:'scalar', eps:-1, D0:1, G:1, p:1 });
  OPT.push({ lawVersion:'scalar', eps:0.5, D0:1, G:NaN, p:1 });

  const PT = [[3,4],[0,0],[-10,0],[1e5,-1e5]];
  const ser = (z) => JSON.stringify(z, (k,v) => (typeof v==='number' && !Number.isFinite(v))
    ? ('#'+String(v)) : v);
  const rows = [];
  let nCase = 0;
  for (const sk of Object.keys(SRC)) for (const oi in OPT) for (const pi in PT) {
    const o = OPT[oi], pt = PT[pi];
    let a=null, aErr=null, m=null, mErr=null;
    try { a = HP.dfmField(SRC[sk], pt[0], pt[1], o); } catch (e) { aErr = String(e && e.message); }
    const hasMesh = HP.DFM_FIELD_NEED.indexOf('mesh')>=0;
    if (hasMesh) { try { m = HP.dfmField(SRC[sk], pt[0], pt[1], Object.assign({}, o, {need:'mesh'})); }
      catch (e) { mErr = String(e && e.message); } }
    nCase++;
    rows.push({ key: sk+'|'+oi+'|'+pi, all: ser(a), allErr: aErr,
      mesh: hasMesh? ser(m) : null, meshErr: mErr });
  }
  return { nCase, rows, hasMesh: HP.DFM_FIELD_NEED.indexOf('mesh')>=0,
    needList: HP.DFM_FIELD_NEED.slice() };
})()`;

async function run(target) {
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e.message || e)));
  await page.goto('file://' + path.join(ROOT, target), { waitUntil: 'load' });
  await page.waitForFunction(() => window.HP && HP.sim && HP.currentPreset());
  const out = await page.evaluate(BODY);
  await page.close();
  return { out, errs };
}

const a = await run(A);
const b = await run(B);
await browser.close();

// ---- ① 基点 html との同値(need 既定 "all" の返り値が全項目で一致するか)
const mapA = new Map(a.out.rows.map((r) => [r.key, r]));
const apiDiff = [];
for (const r of b.out.rows) {
  const q = mapA.get(r.key);
  if (!q) { apiDiff.push({ key: r.key, why: 'basemissing' }); continue; }
  if (q.all !== r.all || q.allErr !== r.allErr) apiDiff.push({ key: r.key, base: q.all, now: r.all });
}
// ---- ② need:"mesh" の契約
const meshDiff = [], meshNullBad = [], dOverflow = [];
const MESH_SAME = ['u', 'gradU', 'dUdt', 'chi', 'W', 'gradW', 'dWdt', 'nIn', 'uQuantity',
  'supportPolicy', 'accComplete', 'bgDtComplete', 'timeDerivativeComplete', 'lawVersion',
  'background', 'sourceIds', 'energyContract', 'G', 'eps', 'p', 'D0', 'complex'];
for (const r of b.out.rows) {
  if (r.mesh === null) continue;
  const A1 = r.all === undefined ? null : JSON.parse(r.all === 'null' ? 'null' : r.all);
  const M1 = JSON.parse(r.mesh === 'null' ? 'null' : r.mesh);
  if (A1 === null && M1 === null) continue;
  if (A1 === null && M1 !== null) {
    // 既定経路が null で mesh が値を返す = **和 D の門**が効いていた例(意図した唯一の差)
    dOverflow.push({ key: r.key, meshNIn: M1.nIn, meshChi: M1.chi });
    continue;
  }
  if (M1 === null) { meshDiff.push({ key: r.key, why: 'meshNullButAllOk' }); continue; }
  if (!(M1.D === null && M1.gradD === null && M1.gravity === null)) meshNullBad.push(r.key);
  for (const k of MESH_SAME) {
    if (JSON.stringify(A1[k]) !== JSON.stringify(M1[k])) {
      meshDiff.push({ key: r.key, field: k, all: A1[k], mesh: M1[k] }); break;
    }
  }
}
const ok = apiDiff.length === 0 && meshDiff.length === 0 && meshNullBad.length === 0
  && b.out.hasMesh && a.errs.length === 0 && b.errs.length === 0;
const res = {
  meta: Object.assign({ wave: '第274便c', base: A, now: B,
    doNotWrite: '**一致は「同じ値を返した」ことだけを意味する**(速さも正しさも言わない)。' },
    provenanceMeta({ root: ROOT, wave: '第274便c', target: B,
      code: ['tests/exp-w274c-needmesh.mjs', 'tests/lib-w272e-provenance.mjs'],
      // **inputs は現行 html だけ**(基点 html は走行後に消す一時ファイル —— 刻印は comparedWith に残す)
      inputs: [B] }),
    { comparedWith: [stampFile(path.join(ROOT, A), A)] }),
  nCase: b.out.nCase, needListBase: a.out.needList, needListNow: b.out.needList,
  apiIdentical: apiDiff.length === 0, apiDiff: apiDiff.slice(0, 10),
  meshContractOk: meshDiff.length === 0 && meshNullBad.length === 0,
  meshDiff: meshDiff.slice(0, 10), meshGravityNotNull: meshNullBad.slice(0, 10),
  dOverflowOnlyDiff: dOverflow.length, dOverflowExamples: dOverflow.slice(0, 5),
  pageErrorsBase: a.errs.slice(0, 3), pageErrorsNow: b.errs.slice(0, 3), ok,
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(res, null, 1));
console.log(JSON.stringify(res, null, 1));
process.exit(ok ? 0 : 1);

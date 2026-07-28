// 第39便 39B 実験(台帳4-73): 「高スピン域で保存恒等式が破れる」原因の特定。
// - 本スクリプトは QA ではない(合否 exit code なし)。tests/out/exp-4-73.json に計測値を保存する。
// - 対象実装ファイル(既定 beta/index.html)は**一切変更しない**。起動時に一時ディレクトリへ
//   スナップショットし(SHA-256 を記録)、その複製にだけ計測用の計装を文字列置換で挿す。
//   計装は「数える/積む」だけで、物理の式・順序・値には触れていない(下の EDITS を参照)。
//
// 測るもの:
//   (A) 全内蔵プリセット×既定パラメータ×STEPS步 での E6′ 飽和(1サブステップの引きずり量 0.8
//       クランプ)の発動回数・max|Δu|²、および速度上限(|v|≤100)/スピン上限(|s|≤40)の発動回数
//   (B) 🕶️darkrotor v6 の BHスピン掃引での |ΔL|/L_scale と、その内訳:
//        dL1 … ①全対ループ(E9 接触・E10′)が動かした L
//        dL2 … ②速度更新+E6′キック。うち E6′ 分は lE6k = Σ(r_i×Δp_i) として別に積む
//        dL3 … ③E6′反作用パス。l3an = −Σφ·(r_i×Δp_i)(解析的に取り去るべき量)と比較する
//        dL4 … ④安全上限・位置更新・境界
//        absLs/absLv … ③で「Float32 の丸めにより増分が消えた」ぶんの L(spin側/速度側)
//   φ 分配の閉じ残り(Σφ_ij+φ_bg−1)も受け手ごとに実測する。
//
// 結論(2026-07-28 実測): dL3−l3an ≡ absLs+absLv(説明率 100%)。すなわち破れは
// **Float32Array 状態配列の丸め吸収**であり、E6′ の 0.8 飽和クランプではない
// (飽和は φ 分配の恒等式に効かない — 閉じ残りは相対 1.8e-6 = float32 eps 水準)。
// 詳細は docs/DERIVATIONS.md §17.9。
//
// 実行: node tests/exp-4-73.mjs        (playwright 必須・既定で約12分)
//   QA_TARGET=index.html node tests/exp-4-73.mjs   … 対象ファイルの差し替え
//   EXP473_STEPS=6000 / EXP473_SPINS=0.12,4 / EXP473_NW=5 … 走行長・掃引・並列数
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const TARGET_ABS = TARGET.startsWith('/') ? TARGET : path.join(ROOT, TARGET);
const OUT_DIR = path.join(ROOT, 'tests', 'out');
fs.mkdirSync(OUT_DIR, { recursive: true });

const CENSUS_STEPS = Number(process.env.EXP473_CENSUS_STEPS || 2000);
const STEPS = Number(process.env.EXP473_STEPS || 24000);
const CKS = (process.env.EXP473_CKS || '6000,12000,24000').split(',').map(Number).filter(v => v <= STEPS);
const SPINS = (process.env.EXP473_SPINS || '0.12,1,2,4,8').split(',').map(Number);
const NW = Math.max(1, Number(process.env.EXP473_NW || 5));

const SRC = fs.readFileSync(TARGET_ABS, 'utf8');
const SHA = crypto.createHash('sha256').update(SRC).digest('hex');

// ---- 計装(すべて「数える/積む」だけ。物理の式・順序・値には触れない)----
const EDITS = [
  // カウンタの土台と、帳簿込みの L を返すヘルパ
  ['  S.totals = function(){',
    `  window.__CT = window.__CT || {};
  window.__CTreset = () => { window.__CT = { satE6:0, e6n:0, maxDl2:0, satV:0, satS:0, dLv:0, dLs:0,
    dL1:0, dL2:0, dL3:0, dL4:0, lE6k:0, l3an:0, absLs:0, absLv:0, nAbsS:0, nAbsV:0, nDsn:0, nRp:0,
    phiMax:0, phiMin:2, phiLoss:0, nPhi:0, nPhiBad:0, ijSkip:0, nsub:0 }; };
  window.__CTreset();
  window.__Lnow = (S) => { let L = 0;
    for (let i = 0; i < S.n; i++) L += S.m[i]*(S.x[i]*S.vy[i]-S.y[i]*S.vx[i]) + 0.5*S.m[i]*S.R[i]*S.R[i]*S.spin[i];
    return L + S.resL + S.radL; };
  S.totals = function(){`],
  // E6′ 飽和クランプの発動回数と max|Δu|²
  ['          if(dl2>0.64){ const sc=0.8/Math.sqrt(dl2); dux*=sc; duy*=sc; }',
    `          __CT.e6n++; if(dl2>__CT.maxDl2) __CT.maxDl2=dl2;
          if(dl2>0.64){ __CT.satE6++; const sc=0.8/Math.sqrt(dl2); dux*=sc; duy*=sc; }`],
  // ②が E6′ キックで注入した L = Σ(r_i×Δp_i)
  ['          dpx[i]=m[i]*kFrame*dux; dpy[i]=m[i]*kFrame*duy;  // Δp_i(反作用パスで分配)',
    `          dpx[i]=m[i]*kFrame*dux; dpy[i]=m[i]*kFrame*duy;  // Δp_i(反作用パスで分配)
          if(window.__AUDIT) __CT.lE6k+=x[i]*dpy[i]-y[i]*dpx[i];`],
  // 速度安全上限(|v|≤100)が捨てた P/L
  ['      if(vv2>10000){ const sc=100/Math.sqrt(vv2); vx[i]*=sc; vy[i]*=sc; }',
    `      if(vv2>10000){ const sc=100/Math.sqrt(vv2); const ovx=vx[i], ovy=vy[i]; vx[i]*=sc; vy[i]*=sc;
        __CT.satV++; __CT.dLv+=m[i]*(x[i]*(vy[i]-ovy)-y[i]*(vx[i]-ovx)); }`],
  // スピン安全上限(|s|≤40)が捨てた L
  ['      if(spin[i]>40) spin[i]=40; else if(spin[i]<-40) spin[i]=-40;',
    `      if(spin[i]>40||spin[i]<-40){ const os=spin[i]; spin[i]=(os>40)?40:-40;
        __CT.satS++; __CT.dLs+=0.5*m[i]*R[i]*R[i]*(spin[i]-os); }`],
  // 段階境界 A(サブステップ入口)
  ['    // ===== ① 全対ループ: E1決定力・E3フレーム・E4重力・E5′斥力・E9接触・E10′拡散 =====',
    `    if(window.__AUDIT){ __CT.nsub++; __CT.__LA=__Lnow(S); }
    // ===== ① 全対ループ: E1決定力・E3フレーム・E4重力・E5′斥力・E9接触・E10′拡散 =====`],
  // 段階境界 A1(①の直後)
  ['    // ===== ② 粒子ループ: 速度更新・E6′輸送(Δp確定)・スピン拡散・E11放射冷却 =====',
    `    if(window.__AUDIT){ const L=__Lnow(S); __CT.dL1+=L-__CT.__LA; __CT.__LA1=L; }
    // ===== ② 粒子ループ: 速度更新・E6′輸送(Δp確定)・スピン拡散・E11放射冷却 =====`],
  // 段階境界 B(②の直後)+ φ 実測用バッファ
  ['    // ===== ③ E6′ 反作用対ループ: φ_ij 分配・残余トルクのスピン移譲・リザーバ帳簿 =====',
    `    if(window.__AUDIT){ const L=__Lnow(S); __CT.dL2+=L-__CT.__LA1; __CT.__LB=L;
      if(!window.__PHI||__PHI.length<n) window.__PHI=new Float64Array(n); __PHI.fill(0); }
    // ===== ③ E6′ 反作用対ループ: φ_ij 分配・残余トルクのスピン移譲・リザーバ帳簿 =====`],
  // 段階境界 C(③の直後)+ 受け手ごとの Σφ 検査
  ['    // ===== ④ 粒子ループ: 安全上限・位置更新・境界・時計 =====',
    `    if(window.__AUDIT){ const L=__Lnow(S); __CT.dL3+=L-__CT.__LB; __CT.__LC=L;
      for(let i2=0;i2<n;i2++){ if(dpx[i2]===0&&dpy[i2]===0) continue;
        const ph=__PHI[i2]; __CT.nPhi++;
        if(ph>__CT.phiMax) __CT.phiMax=ph; if(ph<__CT.phiMin) __CT.phiMin=ph;
        if(Math.abs(ph-1)>1e-9) __CT.nPhiBad++;
        __CT.phiLoss+=(1-ph)*(x[i2]*dpy[i2]-y[i2]*dpx[i2]); } }
    // ===== ④ 粒子ループ: 安全上限・位置更新・境界・時計 =====`],
  // 段階境界 D(④の直後)
  ['    // 第35便: 以降(近点検出器・t進み・尺度履歴・光子伝播)は 1サブステップ1回。',
    `    if(window.__AUDIT){ const L=__Lnow(S); __CT.dL4+=L-__CT.__LC; }
    // 第35便: 以降(近点検出器・t進み・尺度履歴・光子伝播)は 1サブステップ1回。`],
  // φ_ij(受け手 i)と、③が解析的に取り去るべき L
  ['            const phi=(m[j]/Math.sqrt(d*d+eps2))/Wi;',
    `            const phi=(m[j]/Math.sqrt(d*d+eps2))/Wi;
            if(window.__AUDIT) __PHI[i]+=phi;`],
  ['            const rpx=phi*dpxi, rpy=phi*dpyi;',
    `            const rpx=phi*dpxi, rpy=phi*dpyi;
            if(window.__AUDIT) __CT.l3an-=xi*rpy-yi*rpx;`],
  ['            const phi=(mi/Math.sqrt(d*d+eps2))/Wj;',
    `            const phi=(mi/Math.sqrt(d*d+eps2))/Wj;
            if(window.__AUDIT) __PHI[j]+=phi;`],
  ['            const rpx=phi*dpxj, rpy=phi*dpyj;',
    `            const rpx=phi*dpxj, rpy=phi*dpyj;
            if(window.__AUDIT) __CT.l3an-=x[j]*rpy-y[j]*rpx;`],
  ['          const phiBg=bgW/Wi;',
    `          const phiBg=bgW/Wi;
          if(window.__AUDIT) __PHI[i]+=phiBg;`],
  ['          const rpx=phiBg*dpx[i], rpy=phiBg*dpy[i];',
    `          const rpx=phiBg*dpx[i], rpy=phiBg*dpy[i];
          if(window.__AUDIT) __CT.l3an-=x[i]*rpy-y[i]*rpx;`],
  // ③の反作用インパルスが Float32 の丸めで消えたぶん
  ['              vx[j]-=rpx/m[j]; vy[j]-=rpy/m[j];',
    `              const _o1=vx[j], _o2=vy[j];
              vx[j]-=rpx/m[j]; vy[j]-=rpy/m[j];
              if(window.__AUDIT){ const ex=(vx[j]-_o1)+rpx/m[j], ey=(vy[j]-_o2)+rpy/m[j];
                __CT.absLv+=m[j]*(x[j]*ey-y[j]*ex); __CT.nRp++;
                if(vx[j]===_o1&&rpx!==0) __CT.nAbsV++; }`],
  ['              vx[i]-=rpx/mi; vy[i]-=rpy/mi;',
    `              const _p1=vx[i], _p2=vy[i];
              vx[i]-=rpx/mi; vy[i]-=rpy/mi;
              if(window.__AUDIT){ const ex=(vx[i]-_p1)+rpx/mi, ey=(vy[i]-_p2)+rpy/mi;
                __CT.absLv+=mi*(xi*ey-yi*ex); __CT.nRp++;
                if(vx[i]===_p1&&rpx!==0) __CT.nAbsV++; }`],
  // ③の残余トルク移譲が Float32 の丸めで消えたぶん
  [`                const dsn=(dx*rpy-dy*rpx)/IJ;       // 残余トルク n_ij を等角加速度で移譲
                spin[i]-=dsn; spin[j]-=dsn;`,
    `                const dsn=(dx*rpy-dy*rpx)/IJ;       // 残余トルク n_ij を等角加速度で移譲
                const _s1=spin[i], _s2=spin[j];
                spin[i]-=dsn; spin[j]-=dsn;
                if(window.__AUDIT){ __CT.absLs+=Ii*((spin[i]-_s1)+dsn)+Ij*((spin[j]-_s2)+dsn);
                  __CT.nDsn+=2; if(spin[i]===_s1&&dsn!==0) __CT.nAbsS++; if(spin[j]===_s2&&dsn!==0) __CT.nAbsS++; }`],
  [`                const dsn=((x[j]-xi)*rpy-(y[j]-yi)*rpx)/IJ;
                spin[j]-=dsn; spin[i]-=dsn;`,
    `                const dsn=((x[j]-xi)*rpy-(y[j]-yi)*rpx)/IJ;
                const _t1=spin[i], _t2=spin[j];
                spin[j]-=dsn; spin[i]-=dsn;
                if(window.__AUDIT){ __CT.absLs+=Ii*((spin[i]-_t1)+dsn)+Ij*((spin[j]-_t2)+dsn);
                  __CT.nDsn+=2; if(spin[i]===_t1&&dsn!==0) __CT.nAbsS++; if(spin[j]===_t2&&dsn!==0) __CT.nAbsS++; }`],
];

let inst = SRC;
for (const [a, b] of EDITS) {
  const i = inst.indexOf(a);
  if (i < 0) throw new Error('計装アンカーが見つかりません: ' + a.slice(0, 70));
  if (inst.indexOf(a, i + 1) >= 0) throw new Error('計装アンカーが一意でありません: ' + a.slice(0, 70));
  inst = inst.slice(0, i) + b + inst.slice(i + a.length);
}
const TMP_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'exp473-'));
const SNAP = path.join(TMP_DIR, 'inst.html');
fs.writeFileSync(SNAP, inst);
const INDEX = 'file://' + SNAP;

async function launch() {
  const exe = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  try { const { chromium } = await import('playwright'); return await chromium.launch(); } catch {}
  const { chromium } = await import('playwright-core');
  return chromium.launch({ executablePath: exe });
}
async function newPage(browser) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.on('pageerror', (e) => console.log('PAGEERROR', e.message));
  await page.goto(INDEX);
  await page.waitForFunction(() => window.HP && HP.sim);
  return page;
}
// 保存則の尺度: tests/qa.mjs:1211-1220(freebox scales)と同一式
const SCALES = `((s)=>{let pS=0,lS=0;for(let i=0;i<s.n;i++){pS+=s.m[i]*Math.hypot(s.vx[i],s.vy[i]);
  lS+=Math.abs(s.m[i]*s.x[i]*s.vy[i])+Math.abs(s.m[i]*s.y[i]*s.vx[i])+0.5*s.m[i]*s.R[i]*s.R[i]*Math.abs(s.spin[i]);}
  return {pS,lS};})`;

const browser = await launch();

// ---------- (A) 全プリセットの飽和発動センサス ----------
console.log(`exp-4-73 (A) 飽和センサス: 全内蔵プリセット×既定×${CENSUS_STEPS}步 …`);
const census = await (async () => {
  const page = await newPage(browser);
  const ids = await page.evaluate(() => HP.allPresets().map((p) => String(p.id)));
  const rows = [];
  for (const id of ids) {
    const r = await page.evaluate(([pid, steps, scalesSrc]) => {
      const scales = eval(scalesSrc);
      HP.loadPreset(pid, false);
      const S = HP.sim;
      __CTreset(); window.__AUDIT = true;
      const t0 = S.totals(), L0 = t0.L;
      for (let k = 0; k < steps; k++) S.step(0.016);
      const t1 = S.totals(), sc = scales(S), c = window.__CT;
      return { id: pid, n: S.n, kFrame: S.params.kFrame, e6n: c.e6n, satE6: c.satE6,
        maxDl2: c.maxDl2, satV: c.satV, satS: c.satS,
        relL: Math.abs(t1.L + S.resL + S.radL - L0) / sc.lS, nan: S.hasNaN() };
    }, [id, CENSUS_STEPS, SCALES]);
    rows.push(r);
    if (r.kFrame > 0)
      console.log(`  ${r.id.padEnd(16)} n=${String(r.n).padStart(4)} E6′評価=${String(r.e6n).padStart(8)} `
        + `飽和=${String(r.satE6).padStart(6)} max|Δu|²=${r.maxDl2.toExponential(2)} relL=${r.relL.toExponential(2)}`);
  }
  await page.close();
  return rows;
})();
const hits = census.filter((r) => r.satE6 > 0);
console.log(`  → 飽和が発動したプリセット: ${hits.length}/${census.length}`
  + (hits.length ? ` (${hits.map((h) => `${h.id}:${h.satE6}回/relL=${h.relL.toExponential(2)}`).join(' ')})` : ''));

// ---------- (B) BHスピン掃引と破れの発生源分解 ----------
function pageSetup() {
  HP.loadPreset('darkrotor', false);   // 正規経路でプリセットを読む(currentPreset 同期)
  window.__mk = (spin) => {
    const p = JSON.parse(JSON.stringify(HP.allPresets().find((q) => q.id === 'darkrotor')));
    p.bodies[0].spin = spin;
    const v = HP.validatePreset(p);
    if (!v.ok) throw new Error('validatePreset NG: ' + v.errors.join(' / '));
    HP.sim.build(v.preset);
  };
}
async function runSpin(spin) {
  const page = await newPage(browser);
  await page.evaluate(pageSetup);
  const r = await page.evaluate(([spin, cks, scalesSrc]) => {
    const scales = eval(scalesSrc);
    __mk(spin);
    const s = HP.sim;
    __CTreset(); window.__AUDIT = true;
    const t0 = s.totals(), L0 = t0.L;
    const out = []; let done = 0, maxSpin = 0;
    for (const ck of cks) {
      while (done < ck) { s.step(0.016); done++; }
      for (let i = 0; i < s.n; i++) { const a = Math.abs(s.spin[i]); if (a > maxSpin) maxSpin = a; }
      const t1 = s.totals(), sc = scales(s), c = Object.assign({}, window.__CT);
      const dL = t1.L + s.resL + s.radL - L0;
      const rr = []; for (let i = 1; i < s.n; i++) rr.push(Math.hypot(s.x[i]-s.x[0], s.y[i]-s.y[0]));
      rr.sort((a, b) => a - b);
      out.push({ step: ck, relL: Math.abs(dL) / sc.lS, dL, lScale: sc.lS,
        maxSpin: +maxSpin.toFixed(4), nan: s.hasNaN(), r90: rr[Math.floor(rr.length*0.9)],
        satE6: c.satE6, e6n: c.e6n, maxDl2: c.maxDl2, satV: c.satV, satS: c.satS,
        dL1: c.dL1, dL2: c.dL2, dL3: c.dL3, dL4: c.dL4, lE6k: c.lE6k, l3an: c.l3an,
        absLs: c.absLs, absLv: c.absLv, absRateS: c.nDsn ? c.nAbsS/c.nDsn : 0,
        absRateV: c.nRp ? c.nAbsV/c.nRp : 0,
        phiMin: c.phiMin, phiMax: c.phiMax, phiLoss: c.phiLoss, phiBad: c.nPhiBad, nPhi: c.nPhi,
        // Γ = E6′ が搬送した角運動量の累計 / L_scale(主張禁止レンジの不変量)
        gamma: Math.abs(c.lE6k) / sc.lS,
        // ③の閉じ残りと、それが float32 吸収で説明できる割合
        gap3: c.dL3 - c.l3an, explained: (c.dL3 - c.l3an) === 0 ? 1 : (c.absLs + c.absLv) / (c.dL3 - c.l3an) });
      if (s.hasNaN()) break;
    }
    return { spin, n: s.n, L0, cks: out };
  }, [spin, CKS, SCALES]);
  await page.close();
  return r;
}
console.log(`exp-4-73 (B) BHスピン掃引 ${SPINS.join('/')} × ${STEPS}步(並列${NW})…`);
const sweep = [];
{
  const queue = SPINS.slice();
  await Promise.all(Array.from({ length: Math.min(NW, queue.length) }, async () => {
    while (queue.length) {
      const sp = queue.shift();
      const t0 = Date.now();
      const r = await runSpin(sp);
      sweep.push(r);
      const last = r.cks[r.cks.length - 1];
      console.log(`  S_bh=${String(sp).padStart(4)} (${((Date.now()-t0)/1000).toFixed(0)}s) `
        + `relL=${last.relL.toExponential(2)} Γ=${last.gamma.toExponential(2)} 飽和=${last.satE6} `
        + `③閉じ残り=${last.gap3.toExponential(3)} float32吸収=${(last.absLs+last.absLv).toExponential(3)} `
        + `説明率=${(100*last.explained).toFixed(1)}% φ∈[${last.phiMin.toFixed(6)},${last.phiMax.toFixed(6)}]`);
    }
  }));
}
await browser.close();
sweep.sort((a, b) => a.spin - b.spin);

const OUT = path.join(OUT_DIR, 'exp-4-73.json');
fs.writeFileSync(OUT, JSON.stringify({
  when: new Date().toISOString(), target: TARGET, targetSha256: SHA,
  censusSteps: CENSUS_STEPS, steps: STEPS, cks: CKS, spins: SPINS,
  method: {
    instrumentation: '計測用の一時複製にカウンタのみ挿入(物理の式・順序・値には触れていない)',
    scales: 'tests/qa.mjs:1211-1220(freebox scales)を転記',
    identity: 'relL = |L + resL + radL − L(0)| / L_scale(beta/index.html の HP.verify.v1 と同形)',
    gamma: 'Γ = |Σ_substeps Σ_i (r_i×Δp_i^{E6′})| / L_scale(主張禁止レンジの不変量)',
    conclusion: 'dL3−l3an = absLs+absLv(説明率100%)= Float32Array の丸め吸収。E6′ の 0.8 飽和は無関係',
  },
  census, sweep,
}, null, 2));
console.log(`→ ${path.relative(ROOT, OUT)}`);

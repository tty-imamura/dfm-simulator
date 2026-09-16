// 第265便d(第57報 W4): **LFBOT のトイ仮説**(減光で出られなかった自光の蓄積と、崩壊での放出)の実測器。
//
// 原仮定者(第57報)「『Luminous Fast Blue Optical Transient』について、『減光』で青方偏移した光が
// 蓄積し、天体の崩壊で一気に放出した、という仮説を立てる」。
//
// ■ この器が出すもの
//   cons  … §1 **保存則 3 段**。E_s+E_γ+E_esc+Q−E_in=E_s(0) の相対残差を dt・dt/2・dt/4 で出す。
//           **E_in(減光で熱から引き取った自光)を落として書くと二重計上になる**ので、
//           落とした形 E_s+E_γ+E_esc+Q−E_s(0) の残差も並べて出す(= 落としてはならない証拠)。
//   main  … §2 **本体 🐮 の走行**(蓄積期 → 崩壊 → 放出)。E_γ・E_esc・ν̄・L_esc のピーク・
//           立ち上がり時間・エジェクタ速度(最大/中央・c 比)。
//   ctrl  … §3 **対照 4 本**(供給源 E_s(0) は 4 本とも同じ 4000): ①青方偏移なし(shiftRate=0)
//           ②閉じ込めなし(lightTrap を外す)③崩壊による脱出変更なし(tEscCollapse=tEsc)
//           ④再充填なし(`refill:false` = **一度で空になる貯蔵槽** —— 崩壊のラッチ以降は
//             減光で出られなかった自光を溜め直さない)。
//   ident … §4 **識別性**。どの出力量がどの入力で動くかを 1 つずつ動かして数で出す
//           (爆発時刻・色・光度が別々のつまみで合わせられる構成ではないことを示すため)。
//   bit   … §5 **既定経路の 1 bit 不変**(lightTrap を宣言しない本は 600 步で状態が動かない)。
//
// ■ **書かないこと**
//   「AT2018cow を再現した」「LFBOT を予測した/観測一致させた」「崩壊したら必ず放出する(予測式)」。
//   実イベントへ 3σ を出さない。これは **principle のトイ**である。
//
// 実行: node tests/exp-w265d-lfbot.mjs [--part cons,main,ctrl,ident,bit]
// 出力: tests/out/lfbot-w265d.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = process.env.QA_TARGET || 'beta/index.html';
const INDEX = 'file://' + (path.isAbsolute(TARGET) ? TARGET : path.join(ROOT, TARGET));
const OUT = process.env.W265D_OUT || path.join(ROOT, 'tests', 'out', 'lfbot-w265d.json');
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : d; };
const PARTS = arg('--part', 'cons,main,ctrl,ident,bit').split(',');
const want = (k) => PARTS.indexOf(k) >= 0;

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

// ---- ページ側の共通ヘルパ(内蔵 🐮 を土台に、つまみだけを差し替えて走らせる)
const HELPERS = `
window.__W265D = {
  base(){ const q = HP.allPresets().find(z => z.id === 'lfbotTrap');
    return q ? JSON.parse(JSON.stringify(q)) : null; },
  // 走行 1 本。opts でコアの lightTrap / shed / etaRad を差し替える
  run(opts){
    const o = opts || {};
    const q = window.__W265D.base();
    if(!q) return { err:'lfbotTrap が内蔵に無い' };
    const b = q.bodies[0];
    if(o.etaRad !== undefined) q.physics.etaRad = o.etaRad;
    if(o.lightTrap === null) delete b.core.lightTrap;
    else if(o.lightTrap) Object.assign(b.core.lightTrap, o.lightTrap);
    if(o.noShed) delete b.core.shed;
    const v = HP.validatePreset(q);
    if(!v.ok) return { err:(v.errors||[]).join('|') };
    const S = HP.sim; S.build(v.preset);
    const dt = (o.dt === undefined) ? 0.016 : o.dt;
    const steps = (o.steps === undefined) ? 2500 : o.steps;
    const sample = [];
    let peakL = 0, peakT = null, peakEg = 0, peakEgT = null, peakNu = 0, fireT = null;
    let egAtFire = null, escAtFire = null, n0 = S.n;
    let firstEsc = null, halfT = null;
    for(let k = 0; k < steps; k++){
      S.step(dt);
      // 宣言しない宇宙では帳簿が null である(対照②)—— **break せずに 0 として記録する**
      const z = HP.dfmLightTrapLedger(S);
      if(z){
        if(z.Lesc > peakL){ peakL = z.Lesc; peakT = S.t; }
        if(z.Eg > peakEg){ peakEg = z.Eg; peakEgT = S.t; }
        if(z.nuBar !== null && z.nuBar > peakNu) peakNu = z.nuBar;
        if(fireT === null && z.collapsed > 0){ fireT = z.collapseT; egAtFire = z.Eg; escAtFire = z.Eesc; }
        if(firstEsc === null && z.Eesc > 0) firstEsc = S.t;
        if(k % 25 === 0) sample.push({ t:S.t, Eg:z.Eg, Eesc:z.Eesc, Es:z.Es, Ein:z.Ein,
          nu:z.nuBar, L:z.Lesc, col:z.collapsed, res:z.relResidual });
      }
    }
    const z = HP.dfmLightTrapLedger(S) || { Eg:0, Ng:0, Es:0, Eesc:0, Q:0, Ein:0, nuBar:null,
      Es0:0, invariant:0, residual:0, relResidual:null, thermalWired:(S.thermal==="tint"),
      collapsed:0, collapseT:null, declared:false };
    // 立ち上がり時間: 崩壊時刻から E_esc が「崩壊後に出た総量の半分」に達するまで
    if(fireT !== null && z){
      const tot = z.Eesc - escAtFire;
      let acc = null;
      for(const s of sample) if(s.t >= fireT && acc === null && (s.Eesc - escAtFire) >= 0.5 * tot){ acc = s.t - fireT; }
      halfT = acc;
    }
    // エジェクタ(shed で増えた粒子)の速度
    const vs = [];
    for(let i = n0; i < S.n; i++) vs.push(Math.hypot(S.vx[i], S.vy[i]));
    vs.sort((a,b) => a - b);
    const med = vs.length ? vs[vs.length >> 1] : null;
    return { t:S.t, n:S.n, nEj:S.n - n0, dt, steps,
      Eg:z.Eg, Ng:z.Ng, Es:z.Es, Eesc:z.Eesc, Q:z.Q, Ein:z.Ein, nuBar:z.nuBar,
      Es0:z.Es0, invariant:z.invariant, residual:z.residual, relResidual:z.relResidual,
      residualNoEin:(z.Es + z.Eg + z.Eesc + z.Q) - z.Es0,
      thermalWired:z.thermalWired, collapsed:z.collapsed, collapseT:z.collapseT,
      peakL, peakT, peakEg, peakEgT, peakNu, fireT, egAtFire, escAtFire, firstEsc, halfT,
      vEjMax:vs.length ? vs[vs.length - 1] : null, vEjMed:med,
      vEjMaxOverC:vs.length ? vs[vs.length - 1] / HP.sim.params.cLight : null,
      radE:S.radE, shedNev:S.shedNev, nan:S.hasNaN(), sample };
  },
  // 状態のハッシュ(ビット同一検査用)
  hash(){ const S = HP.sim; let h = 0xcbf29ce484222325n;
    const f = (x) => { const b = new Float64Array([x]); const u = new BigUint64Array(b.buffer);
      h = ((h ^ u[0]) * 1099511628211n) & 0xffffffffffffffffn; };
    for(let i = 0; i < S.n; i++){ f(S.x[i]); f(S.y[i]); f(S.vx[i]); f(S.vy[i]); f(S.spin[i]); }
    return h.toString(16); }
};`;
await pg.addScriptTag({ content: HELPERS });

const R = { wave: '第265便d', target: TARGET, at: new Date().toISOString(), parts: PARTS,
  note: '**principle のトイである。** 実イベント(AT2018cow 等)へ σ を出さない。' };

// ---------- §1 保存則 3 段
if (want('cons')) {
  R.cons = await pg.evaluate(() => {
    const rows = [];
    for (const [dt, steps] of [[0.016, 2500], [0.008, 5000], [0.004, 10000]]) {
      const z = window.__W265D.run({ dt, steps });
      rows.push({ dt, steps, err: z.err || null, Es0: z.Es0, invariant: z.invariant,
        residual: z.residual, relResidual: z.relResidual, residualNoEin: z.residualNoEin,
        Ein: z.Ein, Eg: z.Eg, Eesc: z.Eesc, Es: z.Es, Q: z.Q, nan: z.nan });
    }
    return rows;
  });
}

// ---------- §2 本体
if (want('main')) {
  R.main = await pg.evaluate(() => window.__W265D.run({}));
  if (R.main && R.main.sample) R.main.sample = R.main.sample.filter((_, i) => i % 4 === 0);
}

// ---------- §3 対照 4 本
if (want('ctrl')) {
  R.ctrl = await pg.evaluate(() => {
    const mk = (name, o) => { const z = window.__W265D.run(o);
      return { name, err: z.err || null, peakL: z.peakL, peakT: z.peakT, fireT: z.fireT,
        halfT: z.halfT, Eesc: z.Eesc, Ein: z.Ein, Es0: z.Es0, Eg: z.Eg,
        outOverIn: (z.Ein + (z.Es0 - z.Es)) > 0 ? z.Eesc / (z.Ein + (z.Es0 - z.Es)) : null,
        peakNu: z.peakNu, nuBar: z.nuBar, vEjMax: z.vEjMax, vEjMed: z.vEjMed,
        nEj: z.nEj, relResidual: z.relResidual, nan: z.nan }; };
    return [
      mk('本体', {}),
      mk('①青方偏移なし', { lightTrap: { shiftRate: 0 } }),
      mk('②閉じ込めなし', { lightTrap: null }),
      mk('③崩壊で脱出を変えない', { lightTrap: { tEscCollapse: null } }),
      mk('④再充填なし', { lightTrap: { refill: false } })
    ];
  });
}

// ---------- §4 識別性(どの出力がどの入力で動くか)
if (want('ident')) {
  R.ident = await pg.evaluate(() => {
    const base = window.__W265D.run({});
    const rows = [{ knob: '基準', value: '—', fireT: base.fireT, peakL: base.peakL,
      peakNu: base.peakNu, Eesc: base.Eesc, vEjMax: base.vEjMax, halfT: base.halfT }];
    const mk = (knob, value, o) => { const z = window.__W265D.run(o);
      rows.push({ knob, value, fireT: z.fireT, peakL: z.peakL, peakNu: z.peakNu,
        Eesc: z.Eesc, vEjMax: z.vEjMax, halfT: z.halfT,
        dFireT: (z.fireT !== null && base.fireT !== null) ? z.fireT - base.fireT : null,
        rPeakL: base.peakL > 0 ? z.peakL / base.peakL : null,
        rPeakNu: base.peakNu > 0 ? z.peakNu / base.peakNu : null,
        rVej: base.vEjMax > 0 ? z.vEjMax / base.vEjMax : null }); };
    mk('shiftRate ×2', 'shiftRate', { lightTrap: { shiftRate: 2 * 0.6 } });
    mk('tEsc ×2', 'tEsc', { lightTrap: { tEsc: 2 * 40 } });
    mk('tEscCollapse ×2', 'tEscCollapse', { lightTrap: { tEscCollapse: 2 * 0.4 } });
    mk('supply ×2', 'supply', { lightTrap: { supply: 2 * 4000 } });
    mk('etaRad ×2', 'etaRad', { etaRad: 2 * 0.02 });
    return rows;
  });
}

// ---------- §5 既定経路の 1 bit 不変(lightTrap を宣言しない本)
if (want('bit')) {
  R.bit = await pg.evaluate(() => {
    const out = [];
    for (const id of ['envelopeShedDFM', 'whiteDwarfDFM', 'layeredCoreDFM', 'bhCore']) {
      const q = HP.allPresets().find((z) => z.id === id);
      if (!q) { out.push({ id, err: '内蔵に無い' }); continue; }
      const v = HP.validatePreset(JSON.parse(JSON.stringify(q)));
      if (!v.ok) { out.push({ id, err: (v.errors || []).join('|') }); continue; }
      const S = HP.sim; S.build(v.preset);
      for (let k = 0; k < 600; k++) S.step(0.016);
      out.push({ id, hash: window.__W265D.hash(), n: S.n,
        hasLightTrap: !!S.hasLightTrap, nan: S.hasNaN() });
    }
    return out;
  });
}

R.pageErrors = pageErrors;
await browser.close();
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(R, null, 2));
console.log('[w265d] LFBOT トイ(蓄積と崩壊放出)');
if (R.cons) for (const z of R.cons) console.log('  保存 dt=' + z.dt, 'rel=' + z.relResidual,
  'E_in を落とした形=' + z.residualNoEin, z.err ? ('ERR ' + z.err) : '');
if (R.main) console.log('  本体: fireT=' + R.main.fireT, 'peakL=' + R.main.peakL,
  'E_esc=' + R.main.Eesc, 'nu=' + R.main.nuBar, 'vEjMax=' + R.main.vEjMax, R.main.err || '');
if (R.ctrl) for (const z of R.ctrl) console.log('  対照 ' + z.name, 'peakL=' + z.peakL,
  'halfT=' + z.halfT, 'Eesc=' + z.Eesc, 'nu=' + z.peakNu, 'vEj=' + z.vEjMax, z.err || '');
if (R.bit) for (const z of R.bit) console.log('  bit ' + z.id, z.hash || z.err);
console.log('→ ' + OUT);
